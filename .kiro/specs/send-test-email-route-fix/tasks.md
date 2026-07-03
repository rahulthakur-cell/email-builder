# Send Test Email Route Fix — Tasks

## Implementation Tasks

- [x] 1. Create `email-builder/email-handler.js`
  - [x] 1.1 Copy `loadEnvFiles`, `sendJson`, `readRequestBody`, `buildSubject`, and `sendTestEmail` from `server.js` into the new module
  - [x] 1.2 Implement `handleEmailRequest(req, res)` that routes `OPTIONS`, `GET /email-api/health`, `POST /send-test-email`, and unknown paths
  - [x] 1.3 Export `{ handleEmailRequest, sendTestEmail, readRequestBody, sendJson }` from the module
  - [x] 1.4 Verify the module can be `require()`-d without starting any server or side effects beyond loading `.env`

- [x] 2. Refactor `email-builder/server.js` to import from `email-handler.js`
  - [x] 2.1 Add `require('./email-handler')` and destructure the needed exports
  - [x] 2.2 Remove the local definitions of `loadEnvFiles`, `sendJson`, `readRequestBody`, `buildSubject`, and `sendTestEmail`
  - [x] 2.3 Rewrite `createServer` to delegate to `handleEmailRequest` (`http.createServer(handleEmailRequest)`)
  - [x] 2.4 Re-export `sendTestEmail` from `email-handler.js` in `module.exports` so existing consumers are unaffected
  - [x] 2.5 Verify `node server.js` still starts the standalone server and responds to `GET /email-api/health` and `POST /send-test-email`

- [x] 3. Update `webpack.config.js` to mount the handler as middleware
  - [x] 3.1 Remove the `/send-test-email` and `/email-api/health` entries from `devServer.proxy`
  - [x] 3.2 Add a `setupMiddlewares` hook that `require`s `email-handler.js` and mounts `handleEmailRequest` on `POST /send-test-email`, `GET /email-api/health`, and `OPTIONS /send-test-email`
  - [x] 3.3 Verify the `setupMiddlewares` hook returns the `middlewares` array unchanged (required by webpack-dev-server v4)
  - [x] 3.4 Verify that other proxy entries (if any) in `config.devServer.proxy` are still spread in

- [x] 4. Update `sendTestEmailRequest` in `app.js`
  - [x] 4.1 Replace the single catch-all error message for non-2xx responses with explicit branches: `500` + `details` array → SMTP config message; `422` + `assetIssues` → asset message; other non-2xx → `result.error` fallback
  - [x] 4.2 Change the `fetch` catch block message from "Make sure the email API is running" to "Could not reach the test email service." (removes the misleading instruction about a separate process)
  - [x] 4.3 Add a safe JSON parse fallback (`try/catch` around `response.json()`) so an unexpected non-JSON body does not throw a secondary error

- [x] 5. Update `.env.example`
  - [x] 5.1 Add inline comments identifying which variables are required (`SMTP_HOST`, `SMTP_FROM`) vs optional
  - [x] 5.2 Add a comment on `EMAIL_API_HOST` and `EMAIL_API_PORT` clarifying they are only used by the standalone `server.js`, not the webpack middleware

- [x] 6. Write and run tests
  - [x] 6.1 Write unit tests for `handleEmailRequest` covering all four route branches using mock `req`/`res` objects
  - [x] 6.2 Write unit tests for `sendTestEmail` covering all validation branches (invalid email, empty HTML, non-public assets, missing SMTP config)
  - [x] 6.3 Write unit tests for the updated `sendTestEmailRequest` frontend function covering: network failure, `500`+`details`, `422`+`assetIssues`, generic non-2xx, and `200` success
  - [x] 6.4 Write a property-based test (Property 1) that generates random `{ email, html }` inputs and asserts `sendTestEmail` always returns a status in `[200, 400, 413, 422, 500]` and never throws unhandled
  - [x] 6.5 Write a property-based test (Property 2) that generates random HTTP status/body combinations and asserts `sendTestEmailRequest` always throws an `Error` with a non-empty `.message` for any non-2xx response
  - [x] 6.6 Run all tests and confirm they pass
