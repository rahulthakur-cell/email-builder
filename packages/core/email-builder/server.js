'use strict';

const http = require('http');
const { handleEmailRequest, sendTestEmail } = require('./email-handler');

const API_HOST = process.env.EMAIL_API_HOST || '127.0.0.1';
const API_PORT = parseInt(process.env.EMAIL_API_PORT || '8787', 10);

const createServer = () => http.createServer(handleEmailRequest);

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
