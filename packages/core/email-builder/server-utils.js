const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_PROTOCOLS = new Set(['http:', 'https:']);

const trimToString = (value) => `${value ?? ''}`.trim();

const parseBoolean = (value, fallback = false) => {
  const normalized = trimToString(value).toLowerCase();
  if (!normalized) return fallback;
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return fallback;
};

const parseInteger = (value, fallback = NaN) => {
  const parsed = parseInt(trimToString(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isValidEmail = (value) => EMAIL_RE.test(trimToString(value));

const isPublicHttpUrl = (value) => {
  try {
    const parsed = new URL(trimToString(value));
    return PUBLIC_PROTOCOLS.has(parsed.protocol);
  } catch (error) {
    return false;
  }
};

const collectHtmlAssetUrls = (html = '') => {
  const source = `${html || ''}`;
  const urls = [];
  const addUrl = (value) => {
    const next = trimToString(value).replace(/^['"]|['"]$/g, '');
    if (next) urls.push(next);
  };

  [
    /<img\b[^>]*\bsrc=(['"])(.*?)\1/gi,
    /\bbackground=(['"])(.*?)\1/gi,
  ].forEach((pattern) => {
    let match = pattern.exec(source);
    while (match) {
      addUrl(match[2]);
      match = pattern.exec(source);
    }
  });

  const cssUrlPattern = /url\((['"]?)(.*?)\1\)/gi;
  let cssMatch = cssUrlPattern.exec(source);
  while (cssMatch) {
    addUrl(cssMatch[2]);
    cssMatch = cssUrlPattern.exec(source);
  }

  return Array.from(new Set(urls));
};

const findNonPublicAssetUrls = (html = '') =>
  collectHtmlAssetUrls(html).filter((url) => !isPublicHttpUrl(url));

const buildPlainTextFromHtml = (html = '') =>
  trimToString(
    `${html || ''}`
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' '),
  );

const getSmtpSettings = (env = process.env) => {
  const host = trimToString(env.SMTP_HOST);
  const port = parseInteger(env.SMTP_PORT, 587);
  const secure = parseBoolean(env.SMTP_SECURE, false);
  const user = trimToString(env.SMTP_USER);
  const pass = trimToString(env.SMTP_PASS);
  const from = trimToString(env.SMTP_FROM);
  const replyTo = trimToString(env.SMTP_REPLY_TO);
  const subjectPrefix = trimToString(env.TEST_EMAIL_SUBJECT_PREFIX || '[Test Email]');
  const errors = [];

  if (!host) errors.push('Missing SMTP_HOST.');
  if (!Number.isFinite(port) || port <= 0) errors.push('SMTP_PORT must be a valid positive number.');
  if (!from) errors.push('Missing SMTP_FROM.');
  if ((user && !pass) || (!user && pass)) {
    errors.push('SMTP_USER and SMTP_PASS must be provided together.');
  }

  return {
    errors,
    transport: {
      host,
      port,
      secure,
      ...(user ? { auth: { user, pass } } : {}),
    },
    defaults: {
      from,
      replyTo: replyTo || undefined,
      subjectPrefix: subjectPrefix || '[Test Email]',
    },
  };
};

module.exports = {
  buildPlainTextFromHtml,
  collectHtmlAssetUrls,
  findNonPublicAssetUrls,
  getSmtpSettings,
  isPublicHttpUrl,
  isValidEmail,
  parseBoolean,
};
