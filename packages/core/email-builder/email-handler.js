'use strict';

const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const {
  buildPlainTextFromHtml,
  findNonPublicAssetUrls,
  getSmtpSettings,
  isValidEmail,
} = require('./server-utils');

// ---------------------------------------------------------------------------
// Environment loading
// ---------------------------------------------------------------------------

const loadEnvFiles = () => {
  const candidates = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../..', '.env'),
  ];

  candidates.forEach((filePath) => {
    dotenv.config({ path: filePath, override: false });
  });
};

// Load .env files at module load time (side effect limited to env vars only —
// no server is created or started here).
loadEnvFiles();

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

const MAX_REQUEST_BYTES = parseInt(process.env.EMAIL_API_MAX_REQUEST_BYTES || '2000000', 10);

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Write a JSON response with CORS headers.
 *
 * @param {import('http').ServerResponse} res
 * @param {number} statusCode
 * @param {object} payload
 */
const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(payload));
};

/**
 * Read and parse the request body as JSON.
 * Rejects if the payload exceeds MAX_REQUEST_BYTES or if the body is not
 * valid JSON.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<object>}
 */
const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_REQUEST_BYTES) {
        reject(new Error('Payload exceeds the configured limit.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8').trim();
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (_err) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });

    req.on('error', reject);
  });

/**
 * Build a timestamped email subject line.
 *
 * @param {string} subjectPrefix
 * @returns {string}
 */
const buildSubject = (subjectPrefix) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  return `${subjectPrefix} GrapesJS preview ${timestamp} UTC`;
};

// ---------------------------------------------------------------------------
// Business logic
// ---------------------------------------------------------------------------

/**
 * Validate inputs, check SMTP configuration, and send a test email via
 * Nodemailer.
 *
 * @param {{ email: string, html: string }} params
 * @returns {Promise<{ status: number, payload: object }>}
 */
const sendTestEmail = async ({ email, html }) => {
  if (!isValidEmail(email)) {
    return { status: 400, payload: { error: 'Enter a valid recipient email address.' } };
  }

  const normalizedHtml = `${html || ''}`.trim();
  if (!normalizedHtml) {
    return { status: 400, payload: { error: 'Email HTML is required.' } };
  }

  const assetIssues = findNonPublicAssetUrls(normalizedHtml);
  if (assetIssues.length) {
    return {
      status: 422,
      payload: {
        error: 'Test emails require public image URLs. Replace any uploaded or relative images before sending.',
        assetIssues,
      },
    };
  }

  const smtp = getSmtpSettings();
  if (smtp.errors.length) {
    return {
      status: 500,
      payload: {
        error: 'SMTP is not configured correctly for test emails.',
        details: smtp.errors,
      },
    };
  }

  const transporter = nodemailer.createTransport(smtp.transport);
  const info = await transporter.sendMail({
    from: smtp.defaults.from,
    to: email,
    replyTo: smtp.defaults.replyTo,
    subject: buildSubject(smtp.defaults.subjectPrefix),
    html: normalizedHtml,
    text: buildPlainTextFromHtml(normalizedHtml) || 'GrapesJS test email preview.',
    headers: {
      'X-GrapesJS-Email-Builder': 'test-email',
    },
  });

  return {
    status: 200,
    payload: {
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
    },
  };
};

// ---------------------------------------------------------------------------
// Request router
// ---------------------------------------------------------------------------

/**
 * Express/Node-compatible async request handler that routes email-related
 * requests.
 *
 * Routes handled:
 *   OPTIONS *                  → 204 with CORS headers
 *   GET  /email-api/health     → 200 { ok: true }
 *   POST /send-test-email      → parse body, call sendTestEmail, return result
 *   anything else              → 404 { error: "Not found." }
 *
 * This function does NOT start any HTTP server. It is safe to require() this
 * module from webpack.config.js or any other context.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {Promise<void>}
 */
const handleEmailRequest = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/email-api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'POST' && req.url === '/send-test-email') {
    try {
      const body = await readRequestBody(req);
      const result = await sendTestEmail(body);
      sendJson(res, result.status, result.payload);
    } catch (error) {
      const status = error.message === 'Payload exceeds the configured limit.' ? 413 : 400;
      sendJson(res, status, { error: error.message || 'Could not send the test email.' });
    }
    return;
  }

  sendJson(res, 404, { error: 'Not found.' });
};

// ---------------------------------------------------------------------------
// Exports — no server is created or started here
// ---------------------------------------------------------------------------

module.exports = {
  handleEmailRequest,
  sendTestEmail,
  readRequestBody,
  sendJson,
};
