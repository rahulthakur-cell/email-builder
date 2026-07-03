# Bugfix Requirements Document

## Introduction

`POST /send-test-email` is unreachable on `localhost:8080` because the webpack dev server only proxies that path to a separate mail API process on `127.0.0.1:8787`, which is not running in the default local setup. As a result, every attempt to send a test email from the builder returns an HTML 404 page instead of a JSON response, and the frontend cannot distinguish a missing route from a real send failure. The fix mounts the email handler directly into the webpack dev server so both the UI and `curl` work against a single origin without requiring the standalone mail server to be running.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user submits the Send Test Email form on `localhost:8080` THEN the system returns an HTML `404` page because the webpack dev server proxies `/send-test-email` to `127.0.0.1:8787`, which is not running.

1.2 WHEN `POST /send-test-email` returns an HTML `404` THEN the system throws a JSON parse error and shows the generic message "Could not reach the test email service. Make sure the email API is running." without distinguishing a missing route from a network failure.

1.3 WHEN `GET /email-api/health` is requested on `localhost:8080` THEN the system returns an HTML `404` for the same proxy reason, making health checks unreliable.

1.4 WHEN no `.env` file is present and the standalone mail server is started manually THEN the system starts the server but any send attempt fails with an unhandled SMTP configuration error rather than a structured `500` JSON response.

### Expected Behavior (Correct)

2.1 WHEN a user submits the Send Test Email form on `localhost:8080` THEN the system SHALL handle `POST /send-test-email` directly in the webpack dev server middleware and return a JSON response (`200`, `400`, `413`, `422`, or `500`) without requiring the standalone mail server.

2.2 WHEN `POST /send-test-email` returns a non-`2xx` status THEN the system SHALL parse the JSON error body and display a message that distinguishes between a missing/unavailable route, an SMTP configuration problem, and an asset validation failure.

2.3 WHEN `GET /email-api/health` is requested on `localhost:8080` THEN the system SHALL return `200 { "ok": true }` from the same webpack dev server middleware.

2.4 WHEN no `.env` file is present and `POST /send-test-email` is called THEN the system SHALL return `500` JSON with `{ "error": "SMTP is not configured correctly for test emails.", "details": [...] }` instead of crashing or returning HTML.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user exports HTML from the builder THEN the system SHALL CONTINUE TO produce the same production HTML output, unaffected by the email route changes.

3.2 WHEN the builder loads on `localhost:8080` THEN the system SHALL CONTINUE TO serve the GrapesJS editor normally with no change to the page load or asset serving behavior.

3.3 WHEN `POST /send-test-email` is called with a valid recipient, valid HTML, and correct SMTP credentials THEN the system SHALL CONTINUE TO send the email and return `200 { "ok": true, "messageId": "...", ... }`.

3.4 WHEN `POST /send-test-email` is called with an invalid email address THEN the system SHALL CONTINUE TO return `400 { "error": "Enter a valid recipient email address." }`.

3.5 WHEN `POST /send-test-email` is called with empty HTML THEN the system SHALL CONTINUE TO return `400 { "error": "Email HTML is required." }`.

3.6 WHEN `POST /send-test-email` is called with non-public asset URLs in the HTML THEN the system SHALL CONTINUE TO return `422 { "error": "...", "assetIssues": [...] }`.

3.7 WHEN `POST /send-test-email` is called with a payload exceeding the size limit THEN the system SHALL CONTINUE TO return `413 { "error": "Payload exceeds the configured limit." }`.

3.8 WHEN the standalone mail server (`server.js`) is run directly THEN the system SHALL CONTINUE TO operate as an independent fallback on its configured port, unaffected by the webpack middleware changes.
