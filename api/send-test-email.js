'use strict';

/**
 * Vercel Serverless Function — POST /send-test-email
 *
 * Wraps the existing handleEmailRequest from email-handler.js.
 * We patch req.url to match the route the handler expects, since
 * Vercel will invoke this at /api/send-test-email but the handler
 * checks for /send-test-email.
 */
const { handleEmailRequest } = require('../packages/core/email-builder/email-handler');

module.exports = async (req, res) => {
  // Override URL so the existing router in email-handler matches correctly
  req.url = '/send-test-email';
  return handleEmailRequest(req, res);
};
