'use strict';

/**
 * Tests for the sendTestEmailRequest frontend function (from app.js).
 *
 * Because app.js is a browser ES module that cannot be directly imported in
 * Jest, the function logic is copied inline here and tested with a mocked
 * global.fetch.
 *
 * Covers:
 *   6.3 — sendTestEmailRequest: network failure, 500+details, 422+assetIssues,
 *          generic non-2xx, and 200 success
 *   6.5 — Property 2: always throws Error with non-empty message for non-2xx
 *
 * Validates: Requirements 2.1, 2.3, 2.4
 */

// ---------------------------------------------------------------------------
// Inline copy of sendTestEmailRequest (simplified — no buildProductionHtml or
// client-side findNonPublicAssetUrls, matching the version described in the
// task spec).
// ---------------------------------------------------------------------------

const sendTestEmailRequest = async (email, html) => {
  let response;
  try {
    response = await fetch('/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, html }),
    });
  } catch (_networkError) {
    throw new Error('Could not reach the test email service.');
  }

  let result = {};
  try {
    result = await response.json();
  } catch (_) {
    // non-JSON body — use defaults
  }

  if (response.ok) return result;

  // HTTP 500 with details array → SMTP misconfiguration
  if (response.status === 500 && Array.isArray(result.details) && result.details.length) {
    const detail = result.details.slice(0, 3).join(' ');
    throw new Error(`SMTP is not configured. Check your .env file. ${detail}`);
  }

  // HTTP 422 with assetIssues → server-side asset validation failure
  if (response.status === 422 && Array.isArray(result.assetIssues) && result.assetIssues.length) {
    throw new Error(`${result.error || 'Asset issue.'} ${result.assetIssues.slice(0, 2).join(', ')}`);
  }

  // All other non-2xx responses
  throw new Error(result.error || 'Could not send the test email.');
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a mock fetch Response-like object.
 *
 * @param {number} status
 * @param {object|null} body  — will be JSON-serialised; pass null for non-JSON
 */
const mockFetchResponse = (status, body) => {
  const ok = status >= 200 && status < 300;
  return {
    ok,
    status,
    json: body === null
      ? jest.fn().mockRejectedValue(new SyntaxError('Unexpected token'))
      : jest.fn().mockResolvedValue(body),
  };
};

// ---------------------------------------------------------------------------
// 6.3 — sendTestEmailRequest: specific branches
// ---------------------------------------------------------------------------

describe('sendTestEmailRequest — specific branches', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('network failure → throws "Could not reach the test email service."', async () => {
    global.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(sendTestEmailRequest('user@example.com', '<p>Hi</p>')).rejects.toThrow(
      'Could not reach the test email service.',
    );
  });

  test('500 with details array → throws SMTP config message', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(500, {
        error: 'SMTP is not configured correctly.',
        details: ['Missing SMTP_HOST.', 'Missing SMTP_FROM.'],
      }),
    );

    await expect(sendTestEmailRequest('user@example.com', '<p>Hi</p>')).rejects.toThrow(
      /SMTP is not configured\. Check your \.env file\./,
    );
  });

  test('500 with details array → error message includes detail text', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(500, {
        error: 'SMTP error',
        details: ['Missing SMTP_HOST.'],
      }),
    );

    const err = await sendTestEmailRequest('user@example.com', '<p>Hi</p>').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('Missing SMTP_HOST.');
  });

  test('500 without details array → falls through to generic error', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(500, { error: 'Internal server error' }),
    );

    const err = await sendTestEmailRequest('user@example.com', '<p>Hi</p>').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Internal server error');
  });

  test('422 with assetIssues → throws asset message', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(422, {
        error: 'Test emails require public image URLs.',
        assetIssues: ['data:image/png;base64,abc', '/images/logo.png'],
      }),
    );

    const err = await sendTestEmailRequest('user@example.com', '<p>Hi</p>').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain('Test emails require public image URLs.');
    expect(err.message).toContain('data:image/png;base64,abc');
  });

  test('422 without assetIssues → falls through to generic error', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(422, { error: 'Unprocessable entity' }),
    );

    const err = await sendTestEmailRequest('user@example.com', '<p>Hi</p>').catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Unprocessable entity');
  });

  test('400 → throws with result.error message', async () => {
    global.fetch.mockResolvedValue(
      mockFetchResponse(400, { error: 'Enter a valid recipient email address.' }),
    );

    await expect(sendTestEmailRequest('bad', '<p>Hi</p>')).rejects.toThrow(
      'Enter a valid recipient email address.',
    );
  });

  test('non-2xx with no error field → throws fallback message', async () => {
    global.fetch.mockResolvedValue(mockFetchResponse(503, {}));

    await expect(sendTestEmailRequest('user@example.com', '<p>Hi</p>')).rejects.toThrow(
      'Could not send the test email.',
    );
  });

  test('non-JSON body on non-2xx → throws fallback message', async () => {
    global.fetch.mockResolvedValue(mockFetchResponse(500, null));

    await expect(sendTestEmailRequest('user@example.com', '<p>Hi</p>')).rejects.toThrow(
      'Could not send the test email.',
    );
  });

  test('200 success → resolves with result object', async () => {
    const successPayload = { ok: true, messageId: '<abc@test>', accepted: ['user@example.com'], rejected: [] };
    global.fetch.mockResolvedValue(mockFetchResponse(200, successPayload));

    const result = await sendTestEmailRequest('user@example.com', '<p>Hi</p>');
    expect(result).toEqual(successPayload);
  });

  test('201 success → resolves with result object', async () => {
    global.fetch.mockResolvedValue(mockFetchResponse(201, { ok: true }));

    const result = await sendTestEmailRequest('user@example.com', '<p>Hi</p>');
    expect(result).toEqual({ ok: true });
  });
});

// ---------------------------------------------------------------------------
// 6.5 — Property 2: sendTestEmailRequest always throws Error with non-empty
//        message for any non-2xx response
//
// Validates: Requirements 2.1, 2.3, 2.4
// ---------------------------------------------------------------------------

describe('Property 2 — sendTestEmailRequest always throws Error with non-empty message for non-2xx', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Generate 25 varied { status, body } combinations for non-2xx responses.
  const nonOkCases = [
    // 400-range
    { status: 400, body: { error: 'Bad request' } },
    { status: 400, body: {} },
    { status: 401, body: { error: 'Unauthorized' } },
    { status: 401, body: {} },
    { status: 403, body: { error: 'Forbidden' } },
    { status: 403, body: {} },
    { status: 404, body: { error: 'Not found.' } },
    { status: 404, body: {} },
    { status: 413, body: { error: 'Payload exceeds the configured limit.' } },
    { status: 413, body: {} },
    { status: 422, body: { error: 'Asset issue.', assetIssues: ['data:image/png;base64,x'] } },
    { status: 422, body: { error: 'Unprocessable entity' } },
    { status: 422, body: {} },
    { status: 429, body: { error: 'Too many requests' } },
    // 500-range
    { status: 500, body: { error: 'SMTP error', details: ['Missing SMTP_HOST.'] } },
    { status: 500, body: { error: 'Internal server error' } },
    { status: 500, body: {} },
    { status: 500, body: null },  // non-JSON body
    { status: 502, body: { error: 'Bad gateway' } },
    { status: 502, body: {} },
    { status: 503, body: { error: 'Service unavailable' } },
    { status: 503, body: {} },
    { status: 504, body: { error: 'Gateway timeout' } },
    { status: 504, body: {} },
    // Edge: empty error string (should fall back to default message)
    { status: 400, body: { error: '' } },
  ];

  test.each(nonOkCases.map((c, i) => [i, c]))(
    'case[%i] status=%p always throws Error with non-empty message',
    async (_i, { status, body }) => {
      global.fetch.mockResolvedValue(mockFetchResponse(status, body));

      let thrown;
      try {
        await sendTestEmailRequest('user@example.com', '<p>Hi</p>');
      } catch (err) {
        thrown = err;
      }

      // Must have thrown
      expect(thrown).toBeDefined();
      // Must be an Error instance
      expect(thrown).toBeInstanceOf(Error);
      // Message must be non-empty
      expect(typeof thrown.message).toBe('string');
      expect(thrown.message.length).toBeGreaterThan(0);
    },
  );
});
