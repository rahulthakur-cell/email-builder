const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const {
  buildPlainTextFromHtml,
  findNonPublicAssetUrls,
  getSmtpSettings,
  isValidEmail,
} = require('./server-utils');

const loadEnvFiles = () => {
  const candidates = [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../..', '.env'),
  ];

  candidates.forEach((filePath) => {
    dotenv.config({ path: filePath, override: false });
  });
};

loadEnvFiles();

const API_HOST = process.env.EMAIL_API_HOST || '127.0.0.1';
const API_PORT = parseInt(process.env.EMAIL_API_PORT || '8787', 10);
const MAX_REQUEST_BYTES = parseInt(process.env.EMAIL_API_MAX_REQUEST_BYTES || '2000000', 10);

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
};

const readRequestBody = (request) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;

    request.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_REQUEST_BYTES) {
        reject(new Error('Payload exceeds the configured limit.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on('end', () => {
      const rawBody = Buffer.concat(chunks).toString('utf8').trim();
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(new Error('Request body must be valid JSON.'));
      }
    });

    request.on('error', reject);
  });

const buildSubject = (subjectPrefix) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
  return `${subjectPrefix} GrapesJS preview ${timestamp} UTC`;
};

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

const createServer = () => http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && request.url === '/email-api/health') {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === 'POST' && request.url === '/send-test-email') {
    try {
      const body = await readRequestBody(request);
      const result = await sendTestEmail(body);
      sendJson(response, result.status, result.payload);
    } catch (error) {
      const status = error.message === 'Payload exceeds the configured limit.' ? 413 : 400;
      sendJson(response, status, { error: error.message || 'Could not send the test email.' });
    }
    return;
  }

  sendJson(response, 404, { error: 'Not found.' });
});

const server = createServer();

const startServer = () => server.listen(API_PORT, API_HOST, () => {
  console.log(`[email-builder] Test email API running at http://${API_HOST}:${API_PORT}`);
});

if (require.main === module) {
  startServer();
}

module.exports = {
  createServer,
  sendTestEmail,
  server,
  startServer,
};
