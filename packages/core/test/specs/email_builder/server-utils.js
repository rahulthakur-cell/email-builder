const {
  buildPlainTextFromHtml,
  findNonPublicAssetUrls,
  getSmtpSettings,
  isValidEmail,
} = require('../../../email-builder/server-utils');
const { sendTestEmail } = require('../../../email-builder/server');

describe('email builder test-email server utils', () => {
  test('validates recipient email addresses', () => {
    expect(isValidEmail('person@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
  });

  test('flags non-public asset URLs in exported HTML', () => {
    const html = `
      <table background="/images/banner.png">
        <tr>
          <td><img src="data:image/png;base64,abc123" alt="bad" /></td>
          <td style="background-image:url('https://cdn.example.com/hero.png')">ok</td>
        </tr>
      </table>
    `;

    expect(findNonPublicAssetUrls(html)).toEqual([
      'data:image/png;base64,abc123',
      '/images/banner.png',
    ]);
  });

  test('builds smtp settings and reports incomplete auth config', () => {
    const config = getSmtpSettings({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'mailer',
      SMTP_FROM: 'Builder <no-reply@example.com>',
    });

    expect(config.errors).toContain('SMTP_USER and SMTP_PASS must be provided together.');
    expect(config.transport.host).toBe('smtp.example.com');
    expect(config.transport.port).toBe(587);
  });

  test('builds a readable text fallback', () => {
    const text = buildPlainTextFromHtml('<style>.x{color:red;}</style><h1>Hello</h1><p>World &amp; team</p>');
    expect(text).toBe('Hello World & team');
  });

  test('rejects invalid send-test-email payloads before SMTP is used', async () => {
    await expect(sendTestEmail({ email: 'bad-address', html: '<p>Hello</p>' })).resolves.toMatchObject({
      status: 400,
      payload: { error: 'Enter a valid recipient email address.' },
    });

    await expect(sendTestEmail({ email: 'person@example.com', html: '<img src=\"data:image/png;base64,abc\" />' })).resolves.toMatchObject({
      status: 422,
    });
  });
});
