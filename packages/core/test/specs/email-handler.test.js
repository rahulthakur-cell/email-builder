'use strict';

/**
 * Tests for email-builder/email-handler.js
 *
 * Covers:
 *   6.1 — handleEmailRequest: all four route branches
 *   6.2 — sendTestEmail: all validation branches
 *   6.4 — Property 1: sendTestEmail always returns a valid status, never throws
 *
 * Validates: Requirements 2.1, 2.3, 2.4
 */

// ---------------------------------------------------------------------------
// Mock nodemailer BEFORE requiring the module under test so the mock is in
// place when email-handler.js is first loaded.
// ---------------------------------------------------------------------------
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({
      messageId: '<mock-id@test>',
      accepted: ['recipient@example.com'],
      rejected: [],
    }),
  })),
}));

// Mock dotenv so loading .env files is a no-op in the test environment.
jest.mock('dotenv', () => ({ config: jest.fn() }));

// Mock server-utils so we can control getSmtpSettings independently.
jest.mock('../../email-builder/server-utils', () => {
  const actual = jest.requireActual('../../email-builder/server-utils');
  return {
    ...actual,
    getSmtpSettings: jest.fn(() => ({
      errors: [],
      transport: { host: 'smtp.test', port: 587, secure: false },
      defaults: {
        from: 'test@example.com',
        replyTo: undefined,
        subjectPrefix: '[Test Email]',
      },
    })),
  };
});

const { handleEmailRequest, sendTestEmail } = require('../../email-builder/email-handler');
const { getSmtpSettings } = require('../../email-builder/server-utils');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal mock IncomingMessage. */
const makeReq = (method, url, overrides = {}) => ({
  method,
  url,
  on: jest.fn(),
  destroy: jest.fn(),
  ...overrides,
});

/** Create a minimal mock ServerResponse. */
const makeRes = () => ({
  writeHead: jest.fn(),
  end: jest.fn(),
});

/**
 * Simulate a POST request body by making req.on('data'/'end') fire
 * synchronously with the given JSON payload.
 */
const withBody = (req, payload) => {
  req.on.mockImplementation((event, handler) => {
    if (event === 'data') {
      handler(Buffer.from(JSON.stringify(payload)));
    }
    if (event === 'end') {
      handler();
    }
  });
  return req;
};

// ---------------------------------------------------------------------------
// 6.1 — handleEmailRequest: route branches
// ---------------------------------------------------------------------------

describe('handleEmailRequest — route branches', () => {
  test('OPTIONS → 204 with CORS headers', async () => {
    const req = makeReq('OPTIONS', '/send-test-email');
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(
      204,
      expect.objectContaining({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': expect.stringContaining('OPTIONS'),
      }),
    );
    expect(res.end).toHaveBeenCalled();
  });

  test('GET /email-api/health → 200 { ok: true }', async () => {
    const req = makeReq('GET', '/email-api/health');
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body).toEqual({ ok: true });
  });

  test('POST /send-test-email with valid body → delegates to sendTestEmail and returns result', async () => {
    const req = makeReq('POST', '/send-test-email');
    withBody(req, { email: 'user@example.com', html: '<p>Hello</p>' });
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, expect.any(Object));
    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.ok).toBe(true);
    expect(body.messageId).toBeDefined();
  });

  test('POST /send-test-email with invalid email → 400', async () => {
    const req = makeReq('POST', '/send-test-email');
    withBody(req, { email: 'not-an-email', html: '<p>Hello</p>' });
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(400, expect.any(Object));
    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.error).toMatch(/valid recipient/i);
  });

  test('unknown route → 404 { error: "Not found." }', async () => {
    const req = makeReq('GET', '/unknown-path');
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(404, expect.any(Object));
    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.error).toBe('Not found.');
  });

  test('POST /send-test-email with oversized payload → 413', async () => {
    const req = makeReq('POST', '/send-test-email');
    // Simulate the body reader rejecting with the size-limit error.
    req.on.mockImplementation((event, handler) => {
      if (event === 'data') {
        // Trigger the size limit by sending a huge chunk.
        const bigChunk = Buffer.alloc(3_000_000, 'x');
        handler(bigChunk);
      }
    });
    const res = makeRes();

    await handleEmailRequest(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(413, expect.any(Object));
    const body = JSON.parse(res.end.mock.calls[0][0]);
    expect(body.error).toMatch(/payload exceeds/i);
  });
});

// ---------------------------------------------------------------------------
// 6.2 — sendTestEmail: validation branches
// ---------------------------------------------------------------------------

describe('sendTestEmail — validation branches', () => {
  beforeEach(() => {
    // Reset to a valid SMTP config by default.
    getSmtpSettings.mockReturnValue({
      errors: [],
      transport: { host: 'smtp.test', port: 587, secure: false },
      defaults: {
        from: 'test@example.com',
        replyTo: undefined,
        subjectPrefix: '[Test Email]',
      },
    });
  });

  test('invalid email → 400', async () => {
    const result = await sendTestEmail({ email: 'not-an-email', html: '<p>Hi</p>' });
    expect(result.status).toBe(400);
    expect(result.payload.error).toMatch(/valid recipient/i);
  });

  test('empty HTML → 400', async () => {
    const result = await sendTestEmail({ email: 'user@example.com', html: '' });
    expect(result.status).toBe(400);
    expect(result.payload.error).toMatch(/html is required/i);
  });

  test('whitespace-only HTML → 400', async () => {
    const result = await sendTestEmail({ email: 'user@example.com', html: '   ' });
    expect(result.status).toBe(400);
    expect(result.payload.error).toMatch(/html is required/i);
  });

  test('non-public asset URLs → 422 with assetIssues', async () => {
    const html = '<img src="data:image/png;base64,abc123" />';
    const result = await sendTestEmail({ email: 'user@example.com', html });
    expect(result.status).toBe(422);
    expect(Array.isArray(result.payload.assetIssues)).toBe(true);
    expect(result.payload.assetIssues.length).toBeGreaterThan(0);
  });

  test('relative asset URL → 422', async () => {
    const html = '<img src="/images/logo.png" />';
    const result = await sendTestEmail({ email: 'user@example.com', html });
    expect(result.status).toBe(422);
  });

  test('missing SMTP config → 500 with details array', async () => {
    getSmtpSettings.mockReturnValue({
      errors: ['Missing SMTP_HOST.', 'Missing SMTP_FROM.'],
      transport: {},
      defaults: { from: '', subjectPrefix: '[Test Email]' },
    });

    const result = await sendTestEmail({ email: 'user@example.com', html: '<p>Hi</p>' });
    expect(result.status).toBe(500);
    expect(Array.isArray(result.payload.details)).toBe(true);
    expect(result.payload.details.length).toBeGreaterThan(0);
  });

  test('successful send → 200 with ok, messageId, accepted, rejected', async () => {
    const result = await sendTestEmail({ email: 'user@example.com', html: '<p>Hello world</p>' });
    expect(result.status).toBe(200);
    expect(result.payload.ok).toBe(true);
    expect(result.payload.messageId).toBeDefined();
    expect(Array.isArray(result.payload.accepted)).toBe(true);
    expect(Array.isArray(result.payload.rejected)).toBe(true);
  });

  test('public http/https asset URLs are allowed → 200', async () => {
    const html = '<img src="https://cdn.example.com/image.png" />';
    const result = await sendTestEmail({ email: 'user@example.com', html });
    expect(result.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// 6.4 — Property 1: sendTestEmail always returns a valid status, never throws
//
// Validates: Requirements 2.1, 2.3, 2.4
// ---------------------------------------------------------------------------

describe('Property 1 — sendTestEmail always returns a valid status and never throws', () => {
  const VALID_STATUSES = new Set([200, 400, 413, 422, 500]);

  // Generate a varied set of { email, html } inputs.
  const inputs = [
    // Valid emails
    { email: 'user@example.com', html: '<p>Hello</p>' },
    { email: 'a@b.co', html: '<div>Content</div>' },
    { email: 'test+tag@domain.org', html: '<table><tr><td>Cell</td></tr></table>' },
    { email: 'user.name@sub.domain.com', html: '<p>Hi</p>' },
    // Invalid emails
    { email: '', html: '<p>Hello</p>' },
    { email: 'not-an-email', html: '<p>Hello</p>' },
    { email: 'missing@', html: '<p>Hello</p>' },
    { email: '@nodomain.com', html: '<p>Hello</p>' },
    { email: 'spaces in@email.com', html: '<p>Hello</p>' },
    { email: 'no-at-sign', html: '<p>Hello</p>' },
    { email: null, html: '<p>Hello</p>' },
    { email: undefined, html: '<p>Hello</p>' },
    // Empty / whitespace HTML
    { email: 'user@example.com', html: '' },
    { email: 'user@example.com', html: '   ' },
    { email: 'user@example.com', html: null },
    { email: 'user@example.com', html: undefined },
    // HTML with data: URLs (non-public)
    { email: 'user@example.com', html: '<img src="data:image/png;base64,abc" />' },
    { email: 'user@example.com', html: '<div style="background:url(data:image/gif;base64,xyz)"></div>' },
    // HTML with relative URLs (non-public)
    { email: 'user@example.com', html: '<img src="/images/logo.png" />' },
    { email: 'user@example.com', html: '<img src="../assets/photo.jpg" />' },
    // HTML with public URLs (should pass asset check)
    { email: 'user@example.com', html: '<img src="https://cdn.example.com/img.png" />' },
    { email: 'user@example.com', html: '<img src="http://example.com/img.jpg" />' },
    // Mixed: some public, some non-public
    { email: 'user@example.com', html: '<img src="https://cdn.example.com/ok.png" /><img src="/local.png" />' },
    // Complex HTML
    { email: 'user@example.com', html: '<html><body><h1>Title</h1><p>Paragraph with <strong>bold</strong></p></body></html>' },
    // Very short HTML
    { email: 'user@example.com', html: '<p>x</p>' },
    // HTML with special characters
    { email: 'user@example.com', html: '<p>Hello &amp; World &lt;3&gt;</p>' },
    // Numeric / non-string inputs
    { email: 42, html: '<p>Hello</p>' },
    { email: 'user@example.com', html: 42 },
    { email: {}, html: '<p>Hello</p>' },
    { email: 'user@example.com', html: {} },
  ];

  beforeEach(() => {
    // Use valid SMTP config so valid inputs can reach the send step.
    getSmtpSettings.mockReturnValue({
      errors: [],
      transport: { host: 'smtp.test', port: 587, secure: false },
      defaults: {
        from: 'test@example.com',
        replyTo: undefined,
        subjectPrefix: '[Test Email]',
      },
    });
  });

  test.each(inputs.map((input, i) => [i, input]))(
    'input[%i] always returns a valid status and a payload object',
    async (_i, input) => {
      let result;
      // The function must NEVER throw — it must always return a value.
      await expect(
        (async () => {
          result = await sendTestEmail(input);
        })(),
      ).resolves.not.toThrow();

      expect(result).toBeDefined();
      expect(VALID_STATUSES.has(result.status)).toBe(true);
      expect(typeof result.payload).toBe('object');
      expect(result.payload).not.toBeNull();
    },
  );

  test('SMTP config errors always produce status 500 with details array', async () => {
    getSmtpSettings.mockReturnValue({
      errors: ['Missing SMTP_HOST.'],
      transport: {},
      defaults: { from: '', subjectPrefix: '[Test Email]' },
    });

    // Any valid email + html should hit the SMTP check and return 500.
    const result = await sendTestEmail({ email: 'user@example.com', html: '<p>Hi</p>' });
    expect(result.status).toBe(500);
    expect(VALID_STATUSES.has(result.status)).toBe(true);
    expect(Array.isArray(result.payload.details)).toBe(true);
  });
});
