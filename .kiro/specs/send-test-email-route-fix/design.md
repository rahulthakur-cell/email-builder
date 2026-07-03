# Send Test Email Route Fix — Bugfix Design

## Overview

The webpack dev server proxies `/send-test-email` and `/email-api/health` to a standalone mail
server on `127.0.0.1:8787`. That server is not started in the default local setup, so every
request returns an HTML 404 page. The frontend's `sendTestEmailRequest` then fails to parse JSON
and surfaces a generic "Make sure the email API is running" message that gives the developer no
actionable information.

The fix has two parts:

1. **Server-side**: Extract the Nodemailer request-handling logic from `server.js` into a new
   shared module `email-handler.js`. Mount that handler directly in the webpack dev server via
   `setupMiddlewares`, eliminating the proxy entirely. `server.js` is refactored to import from
   `email-handler.js` so both paths share one implementation.

2. **Client-side**: Update `sendTestEmailRequest` in `app.js` to distinguish between a
   network/fetch failure, an SMTP misconfiguration (`500` with `details`), an asset validation
   failure (`422` with `assetIssues`), and any other non-2xx error, so the user sees a message
   that tells them what to do next.

---

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — a request to `/send-test-email`
  or `/email-api/health` on `localhost:8080` when the standalone mail server is not running.
- **Property (P)**: The desired behavior when the bug condition holds — the webpack dev server
  handles the request directly and returns a well-formed JSON response.
- **Preservation**: All existing behaviors that must remain unchanged: HTML export, editor load,
  valid email sends, validation error responses, and standalone `server.js` operation.
- **`handleEmailRequest(req, res)`**: The function exported by the new
  `email-builder/email-handler.js` that handles both `POST /send-test-email` and
  `GET /email-api/health`.
- **`sendTestEmail(body)`**: The pure business-logic function in `server.js` (and re-exported
  from `email-handler.js`) that validates input, checks SMTP config, and sends via Nodemailer.
- **`setupMiddlewares`**: The webpack-dev-server v4 hook used to mount Express-compatible
  middleware before the dev server's own request handling.
- **`sendTestEmailRequest(email)`**: The frontend function in `app.js` that calls
  `POST /send-test-email` and maps the response to a user-visible message.

---

## Bug Details

### Bug Condition

The bug manifests when any request is made to `/send-test-email` or `/email-api/health` on the
webpack dev server (`localhost:8080`) and the standalone mail server process is not running on
`127.0.0.1:8787`. The webpack proxy forwards the request to a dead port, the OS returns a
connection-refused error, and webpack-dev-server responds with an HTML error page instead of
JSON.

**Formal Specification:**

```
FUNCTION isBugCondition(request)
  INPUT: request — an HTTP request arriving at the webpack dev server
  OUTPUT: boolean

  RETURN (request.url IN ['/send-test-email', '/email-api/health'])
         AND standaloneMailServerIsNotRunning()
         AND webpackDevServerIsHandlingRequest()
END FUNCTION
```

### Examples

- **Bug**: `POST /send-test-email` with valid JSON body → webpack proxies to `127.0.0.1:8787`
  → connection refused → webpack returns HTML 404 → `response.json()` throws → frontend shows
  "Could not reach the test email service. Make sure the email API is running."
- **Bug**: `GET /email-api/health` → same proxy failure → HTML 404 → health check reports
  service unavailable even though the dev server is running fine.
- **Bug**: No `.env` file present, standalone server started manually → `sendTestEmail` throws
  an unhandled SMTP error instead of returning `500` JSON with `details`.
- **Fixed**: `POST /send-test-email` with valid JSON body → webpack middleware calls
  `handleEmailRequest` directly → returns `200 { ok: true, messageId: "..." }`.
- **Fixed**: `GET /email-api/health` → webpack middleware calls `handleEmailRequest` directly
  → returns `200 { ok: true }`.

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- HTML export from the builder (`buildProductionHtml`) must produce identical output.
- The GrapesJS editor must load normally on `localhost:8080` with no change to asset serving.
- `POST /send-test-email` with a valid recipient, valid HTML, and correct SMTP credentials must
  continue to send the email and return `200 { ok: true, messageId: "...", ... }`.
- `POST /send-test-email` with an invalid email address must continue to return
  `400 { error: "Enter a valid recipient email address." }`.
- `POST /send-test-email` with empty HTML must continue to return
  `400 { error: "Email HTML is required." }`.
- `POST /send-test-email` with non-public asset URLs must continue to return
  `422 { error: "...", assetIssues: [...] }`.
- `POST /send-test-email` with an oversized payload must continue to return
  `413 { error: "Payload exceeds the configured limit." }`.
- Running `node server.js` directly must continue to start the standalone server on its
  configured port, unaffected by the webpack middleware changes.

**Scope:**

All requests that are NOT to `/send-test-email` or `/email-api/health` are completely
unaffected by this fix. This includes all static asset serving, the GrapesJS bundle, and any
other dev-server routes.

---

## Hypothesized Root Cause

1. **Proxy-only architecture**: `webpack.config.js` uses `devServer.proxy` to forward the two
   email routes to a separate process. There is no fallback when that process is absent. The
   fix is to replace the proxy entries with an in-process middleware mount.

2. **No shared handler module**: The Nodemailer logic lives entirely inside `server.js`, which
   is a standalone HTTP server and cannot be `require()`-d into webpack config without also
   starting the server. Extracting the handler into `email-handler.js` breaks this coupling.

3. **Frontend error conflation**: `sendTestEmailRequest` catches all non-2xx responses with a
   single `result.error || 'Could not send the test email.'` message. It does not distinguish
   between a network failure (fetch throws), an SMTP misconfiguration (`500` + `details`), an
   asset issue (`422` + `assetIssues`), or any other server error. The fix adds explicit
   branches for each case.

4. **Missing `.env` guidance**: `.env.example` lists the SMTP variables but does not explain
   which are required vs optional, making it easy to start the server with an incomplete
   configuration and receive an opaque error.

---

## Correctness Properties

Property 1: Bug Condition — Webpack Dev Server Handles Email Routes Directly

_For any_ HTTP request where `isBugCondition(request)` is true (i.e., the request targets
`/send-test-email` or `/email-api/health` on the webpack dev server), the fixed webpack
middleware SHALL handle the request in-process and return a JSON response with the correct
`Content-Type: application/json` header and an appropriate HTTP status code (`200`, `400`,
`413`, `422`, or `500`), without proxying to `127.0.0.1:8787`.

**Validates: Requirements 2.1, 2.3, 2.4**

Property 2: Preservation — Non-Email-Route Requests Are Unaffected

_For any_ HTTP request where `isBugCondition(request)` is false (i.e., the request does NOT
target `/send-test-email` or `/email-api/health`), the fixed webpack dev server SHALL produce
exactly the same response as the original configuration, preserving all static asset serving,
editor bundle delivery, and other dev-server behavior.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### New File: `email-builder/email-handler.js`

Extract the request-handling logic from `server.js` into a standalone module. This module
must not start any server on `require()` — it only exports functions.

**Exports:**

```javascript
module.exports = {
  handleEmailRequest,  // async (req, res) => void  — Express/Node-compatible handler
  sendTestEmail,       // async ({ email, html }) => { status, payload }
  readRequestBody,     // async (req) => object  — shared body parser
  sendJson,            // (res, statusCode, payload) => void
};
```

**`handleEmailRequest(req, res)`** must handle:

- `OPTIONS *` → `204` with CORS headers
- `GET /email-api/health` → `200 { ok: true }`
- `POST /send-test-email` → parse body, call `sendTestEmail`, return result
- Anything else → `404 { error: "Not found." }`

The function must load `.env` files on first call (or at module load time) using the same
`loadEnvFiles` logic currently in `server.js`.

**`sendTestEmail({ email, html })`** is moved verbatim from `server.js`. It must:

- Validate email → `400` on failure
- Validate HTML presence → `400` on failure
- Check for non-public asset URLs → `422` on failure
- Check SMTP config → `500` with `details` array on failure
- Send via Nodemailer → `200` with `messageId`, `accepted`, `rejected` on success

### Changes to `server.js`

Replace the inline implementations of `sendTestEmail`, `readRequestBody`, `sendJson`, and
`buildSubject` with imports from `email-handler.js`. The `createServer` function is updated to
call `handleEmailRequest` instead of duplicating the routing logic. `loadEnvFiles` is removed
from `server.js` (it moves to `email-handler.js`). The public API (`createServer`, `server`,
`startServer`) is preserved unchanged.

**Specific changes:**

1. Add `require('./email-handler')` at the top.
2. Remove the local definitions of `sendJson`, `readRequestBody`, `buildSubject`,
   `sendTestEmail`, and `loadEnvFiles`.
3. Rewrite `createServer` to delegate to `handleEmailRequest`:
   ```javascript
   const createServer = () => http.createServer(handleEmailRequest);
   ```
4. Keep `module.exports = { createServer, sendTestEmail, server, startServer }` — re-export
   `sendTestEmail` from `email-handler.js` so existing consumers are unaffected.

### Changes to `webpack.config.js`

Replace the two `proxy` entries with a `setupMiddlewares` hook that mounts
`handleEmailRequest` as Express middleware.

**Before:**
```javascript
proxy: {
  '/send-test-email': { target: 'http://127.0.0.1:8787', changeOrigin: true },
  '/email-api/health': { target: 'http://127.0.0.1:8787', changeOrigin: true },
},
```

**After:**
```javascript
setupMiddlewares: (middlewares, devServer) => {
  const { handleEmailRequest } = require('./email-builder/email-handler');
  devServer.app.post('/send-test-email', handleEmailRequest);
  devServer.app.get('/email-api/health', handleEmailRequest);
  devServer.app.options('/send-test-email', handleEmailRequest);
  return middlewares;
},
```

The `proxy` key for these two routes is removed entirely. Any other proxy entries that may
exist in `config.devServer.proxy` are preserved via the spread.

### Changes to `app.js`

Update `sendTestEmailRequest` to distinguish error types:

```javascript
const sendTestEmailRequest = async (email) => {
  const html = buildProductionHtml();
  state.lastExportHtml = html;

  // Client-side asset check (fast path — avoids a round-trip)
  const assetIssues = findNonPublicAssetUrls(html);
  if (assetIssues.length) {
    throw new Error(
      `Public image URLs are required before sending. Update these assets first: ${assetIssues.slice(0, 2).join(', ')}`
    );
  }

  let response;
  try {
    response = await fetch('/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, html }),
    });
  } catch (_networkError) {
    // fetch() itself threw — network unreachable or CORS preflight failed
    throw new Error('Could not reach the test email service.');
  }

  let result = {};
  try { result = await response.json(); } catch (_) { /* non-JSON body — use defaults */ }

  if (response.ok) return result;

  // HTTP 500 with details array → SMTP misconfiguration
  if (response.status === 500 && Array.isArray(result.details) && result.details.length) {
    const detail = result.details.slice(0, 3).join(' ');
    throw new Error(`SMTP is not configured. Check your .env file. ${detail}`);
  }

  // HTTP 422 with assetIssues → server-side asset validation failure
  if (response.status === 422 && Array.isArray(result.assetIssues) && result.assetIssues.length) {
    throw new Error(
      `${result.error || 'Asset issue.'} ${result.assetIssues.slice(0, 2).join(', ')}`
    );
  }

  // All other non-2xx responses
  throw new Error(result.error || 'Could not send the test email.');
};
```

### Changes to `.env.example`

Add inline comments that clarify which variables are required and what each does, and add a
note about the `EMAIL_API_HOST`/`EMAIL_API_PORT` variables being used only by the standalone
server (not the webpack middleware):

```dotenv
# Required: SMTP server hostname
SMTP_HOST=smtp.example.com

# Required: SMTP port (587 = STARTTLS, 465 = SSL, 25 = plain)
SMTP_PORT=587

# Optional: set to true only when using port 465
SMTP_SECURE=false

# Optional: leave blank for anonymous SMTP relays
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Required: the From address shown in the test email
SMTP_FROM="GrapesJS Email Builder <no-reply@example.com>"

# Optional: Reply-To address
SMTP_REPLY_TO=support@example.com

# Optional: prefix added to the test email subject line
TEST_EMAIL_SUBJECT_PREFIX=[Test Email]

# Used only by the standalone server.js — not needed for webpack dev server
EMAIL_API_HOST=127.0.0.1
EMAIL_API_PORT=8787
```

---

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that
demonstrate the bug on the unfixed code, then verify the fix works correctly and preserves
existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix.
Confirm or refute the root cause analysis.

**Test Plan**: Write integration-style tests that simulate HTTP requests to the webpack dev
server (or a minimal Express app that mirrors its middleware setup) and assert that the
response is JSON with the correct status code. Run these tests against the unfixed code to
observe the HTML 404 failure.

**Test Cases**:

1. **Health check returns JSON** (will fail on unfixed code — returns HTML 404):
   `GET /email-api/health` → expect `200 { ok: true }` with `Content-Type: application/json`.
2. **Send with missing SMTP config returns structured 500** (will fail on unfixed code):
   `POST /send-test-email` with valid body, no `.env` → expect
   `500 { error: "...", details: [...] }`.
3. **Send with invalid email returns 400** (will fail on unfixed code — returns HTML 404):
   `POST /send-test-email` with `{ email: "not-an-email", html: "<p>hi</p>" }` → expect
   `400 { error: "Enter a valid recipient email address." }`.
4. **Send with empty HTML returns 400** (will fail on unfixed code):
   `POST /send-test-email` with `{ email: "a@b.com", html: "" }` → expect
   `400 { error: "Email HTML is required." }`.

**Expected Counterexamples**:

- All four requests return an HTML page (webpack proxy error page) instead of JSON.
- `response.json()` throws a SyntaxError in the frontend.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed middleware
produces the expected JSON response.

**Pseudocode:**

```
FOR ALL request WHERE isBugCondition(request) DO
  response := webpackMiddleware_fixed(request)
  ASSERT response.headers['content-type'] CONTAINS 'application/json'
  ASSERT response.status IN [200, 400, 413, 422, 500]
  ASSERT JSON.parse(response.body) IS object
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed code
produces the same result as the original code.

**Pseudocode:**

```
FOR ALL request WHERE NOT isBugCondition(request) DO
  ASSERT webpackConfig_original(request) = webpackConfig_fixed(request)
END FOR
```

**Testing Approach**: Property-based testing is recommended for the `sendTestEmail` business
logic because:

- It generates many combinations of `{ email, html }` inputs automatically.
- It catches edge cases in validation logic (e.g., borderline email formats, HTML with mixed
  asset URL types) that manual tests miss.
- It provides strong guarantees that the extracted `email-handler.js` behaves identically to
  the original `server.js` logic.

**Test Cases**:

1. **Valid send preservation**: Observe that `sendTestEmail` with valid inputs and a mock
   transporter returns `200` on the original code, then verify the same on the fixed code.
2. **Validation error preservation**: Verify that `400`/`422`/`413` responses from
   `sendTestEmail` are identical before and after the refactor.
3. **Frontend error-type mapping**: Verify that each HTTP status/body combination maps to the
   correct user-facing message in the updated `sendTestEmailRequest`.

### Unit Tests

- Test `handleEmailRequest` for each route (`GET /email-api/health`, `POST /send-test-email`,
  `OPTIONS`, unknown route) using mock `req`/`res` objects.
- Test `sendTestEmail` for all validation branches: invalid email, empty HTML, non-public
  assets, missing SMTP config, successful send.
- Test `readRequestBody` for oversized payloads, invalid JSON, and empty bodies.
- Test the updated `sendTestEmailRequest` frontend function for each error branch: network
  failure, `500` with `details`, `422` with `assetIssues`, generic non-2xx.

### Property-Based Tests

- Generate random `{ email, html }` pairs and verify that `sendTestEmail` always returns one
  of the five expected status codes (`200`, `400`, `413`, `422`, `500`) and never throws
  unhandled.
- Generate random HTML strings and verify that `findNonPublicAssetUrls` in `app.js` and
  `findNonPublicAssetUrls` in `server-utils.js` agree on which URLs are non-public.
- Generate random HTTP status codes and `result` bodies and verify that `sendTestEmailRequest`
  always throws an `Error` with a non-empty message for any non-2xx response.

### Integration Tests

- Start a minimal Express app that mounts `handleEmailRequest` on the same routes as the
  webpack middleware and run the full request/response cycle.
- Verify that switching from the proxy config to the `setupMiddlewares` config does not change
  the response for any of the preserved behaviors (requirements 3.3–3.7).
- Verify that `server.js` still starts and responds correctly after the refactor.
