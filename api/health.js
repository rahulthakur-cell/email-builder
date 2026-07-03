'use strict';

/**
 * Vercel Serverless Function — GET /email-api/health
 *
 * Wraps the existing handleEmailRequest from email-handler.js.
 * We patch req.url to match the route the handler expects, since
 * Vercel will invoke this at /api/health but the handler
 * checks for /email-api/health.
 */
const { handleEmailRequest } = require('../packages/core/email-builder/email-handler');

module.exports = async (req, res) => {
  // Override URL so the existing router in email-handler matches correctly
  req.url = '/email-api/health';
  return handleEmailRequest(req, res);
};
