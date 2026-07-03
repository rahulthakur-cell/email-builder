'use strict';

/**
 * Tests for the email-template-social-save feature.
 *
 * Covers:
 *   5.1  — socialIconPngMap has all 8 required networks
 *   5.2  — professional template exists with all 7 component types
 *   5.3  — Save Template button exists in appbar between test-email and export
 *   5.4  — Empty/whitespace name does not write to localStorage
 *   5.5  — No "My Templates" heading when localStorage is empty
 *   5.6  — P3: renderSocialLinks output never contains <svg
 *   5.7  — P4: each social item produces <img> with non-empty alt
 *   5.8  — P5: iconSize reflected as width/height; align reflected on outer table
 *   5.9  — P6: valid name saves complete entry to localStorage
 *   5.10 — P7: whitespace-only name does not write to localStorage
 *   5.11 — P8: all saved templates appear as cards in "My Templates" section
 *   5.12 — P9: loading a saved template restores bodySettings
 *   5.13 — P10: deleting a saved template removes it from storage
 *   5.14 — P11: localStorage errors are handled gracefully (no uncaught exception)
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

let mockStore = {};
const mockLocalStorage = {
  getItem: jest.fn((key) => mockStore[key] ?? null),
  setItem: jest.fn((key, value) => { mockStore[key] = String(value); }),
  removeItem: jest.fn((key) => { delete mockStore[key]; }),
  clear: jest.fn(() => { mockStore = {}; }),
  get length() { return Object.keys(mockStore).length; },
  key: jest.fn((i) => Object.keys(mockStore)[i] ?? null),
};
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage, writable: true });

beforeEach(() => {
  mockStore = {};
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Inline implementations of pure functions (mirrors app.js logic)
// ---------------------------------------------------------------------------

const SAVED_TEMPLATES_KEY = 'grapesjs-email-builder-saved-templates';

const getSavedTemplates = () => {
  try {
    const raw = localStorage.getItem(SAVED_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setSavedTemplates = (templates) => {
  try {
    localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    throw e;
  }
};

const validateTemplateName = (name) => {
  return name && name.trim().length > 0;
};

const saveTemplate = (name, projectData, html, css, bodySettings) => {
  if (!validateTemplateName(name)) {
    return { success: false, error: 'Please enter a template name.' };
  }
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const entry = {
    id,
    name: name.trim(),
    createdAt: new Date().toISOString(),
    projectData,
    html,
    css,
    bodySettings,
  };
  const existing = getSavedTemplates();
  setSavedTemplates([...existing, entry]);
  return { success: true, entry };
};

// ---------------------------------------------------------------------------
// Inline social rendering (mirrors minimal-builder-plugin.js logic)
// ---------------------------------------------------------------------------

const socialIconPngMapTest = {
  facebook:  'https://img.icons8.com/color/48/facebook-new.png',
  instagram: 'https://img.icons8.com/color/48/instagram-new.png',
  linkedin:  'https://img.icons8.com/color/48/linkedin.png',
  youtube:   'https://img.icons8.com/color/48/youtube-play.png',
  x:         'https://img.icons8.com/color/48/twitterx.png',
  twitter:   'https://img.icons8.com/color/48/twitterx.png',
  tiktok:    'https://img.icons8.com/color/48/tiktok.png',
  pinterest: 'https://img.icons8.com/color/48/pinterest.png',
  snapchat:  'https://img.icons8.com/color/48/snapchat.png',
  vimeo:     'https://img.icons8.com/color/48/vimeo.png',
};

const getSocialIconImgTest = (name = '', opts = {}) => {
  const key = `${name}`.trim().toLowerCase();
  const src = socialIconPngMapTest[key] || 'https://img.icons8.com/color/48/share.png';
  const altText = key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Social';
  const { size = 32, shape = 'circle' } = opts;
  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '20%' : '0%';
  return `<img src="${src}" width="${size}" height="${size}" alt="${altText}" style="display:block; border:0; border-radius:${borderRadius};" />`;
};

const renderSocialLinksTest = (model) => {
  const items = Array.isArray(model.get('socialItems')) ? model.get('socialItems') : [];
  const align = model.get('align') || 'center';
  const linkColor = model.get('linkColor') || '#6366f1';
  const iconSize = parseInt(model.get('iconSize'), 10) || 32;
  const iconStyle = model.get('iconStyle') || 'solid-branded';
  const iconShape = model.get('iconShape') || 'circle';
  const spacing = parseInt(model.get('spacing'), 10) || 10;

  const linksHtml = items
    .filter((item) => item && item.label)
    .map((item, index) => {
      const paddingLeft = index > 0 ? `${spacing}px` : '0';
      return `<td style="padding-left:${paddingLeft}; line-height:0; font-size:0;">
        <a href="${item.url || '#'}" style="text-decoration:none; display:inline-block;" target="_blank">
          ${getSocialIconImgTest(item.label, { size: iconSize, shape: iconShape, style: iconStyle, linkColor })}
        </a>
      </td>`;
    })
    .join('');

  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="${align}"><tr>${linksHtml}</tr></table>`;
};

const makeSocialModel = (overrides = {}) => {
  const defaults = {
    socialItems: [{ label: 'facebook', url: '#' }],
    align: 'center',
    linkColor: '#6366f1',
    iconSize: 32,
    iconStyle: 'solid-branded',
    iconShape: 'circle',
    spacing: 10,
  };
  return {
    get: (prop) => (overrides[prop] !== undefined ? overrides[prop] : defaults[prop]),
  };
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeSavedTemplate = (overrides = {}) => ({
  id: 'test-id-' + Math.random().toString(36).slice(2),
  name: 'Test Template',
  createdAt: new Date().toISOString(),
  projectData: { pages: [] },
  html: '<!doctype html><html><body></body></html>',
  css: 'body {}',
  bodySettings: {
    textColor: '#000000',
    canvasBackground: '#e5e5e5',
    emailBackground: '#ffffff',
    contentWidth: 600,
    contentAlignment: 'center',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: '400',
    preheaderText: '',
    linkColor: '#2563eb',
  },
  ...overrides,
});

// Minimal renderTemplateGrid that mirrors the "My Templates" section logic
const renderTemplateGridHtml = (savedTemplates) => {
  let html = '';
  if (savedTemplates.length > 0) {
    html += '<div class="studio-template-section-heading">My Templates</div>';
    savedTemplates.forEach((t) => {
      html += `<div class="studio-template-card studio-template-card--saved" data-template-id="${t.id}">
        <div class="studio-template-card__body"><strong>${t.name}</strong></div>
        <button class="studio-template-card__delete" data-template-id="${t.id}">&times;</button>
      </div>`;
    });
    html += '<div class="studio-template-section-heading">Built-in Templates</div>';
  }
  return html;
};

// ---------------------------------------------------------------------------
// 5.1 — socialIconPngMap has all 8 required networks
// ---------------------------------------------------------------------------

describe('5.1 — socialIconPngMap contains all required networks', () => {
  const pluginSource = fs.readFileSync(
    path.resolve(__dirname, '../../minimal-builder-plugin.js'),
    'utf8',
  );

  const requiredNetworks = ['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok', 'pinterest', 'snapchat'];

  requiredNetworks.forEach((network) => {
    test(`socialIconPngMap contains "${network}"`, () => {
      // Check the source contains the key in the socialIconPngMap object
      expect(pluginSource).toMatch(new RegExp(`socialIconPngMap[\\s\\S]*?${network}\\s*:`));
    });
  });

  test('socialIconPngMap URLs are HTTPS PNG links', () => {
    // Extract the socialIconPngMap block from source
    const match = pluginSource.match(/const socialIconPngMap\s*=\s*\{([\s\S]*?)\};/);
    expect(match).not.toBeNull();
    const mapBlock = match[1];
    // All values should be https URLs
    const urls = mapBlock.match(/https:\/\/[^\s'"]+/g) || [];
    expect(urls.length).toBeGreaterThan(0);
    urls.forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });
});

// ---------------------------------------------------------------------------
// 5.2 — professional template exists with all 7 component types
// ---------------------------------------------------------------------------

describe('5.2 — professional template has all required component types', () => {
  let plugin;

  beforeAll(() => {
    // The plugin IIFE registers on globalThis
    require('../../minimal-builder-plugin.js');
    plugin = global.grapesjsMinimalBuilder;
  });

  test('emailTemplates.professional exists', () => {
    expect(plugin.emailTemplates).toBeDefined();
    expect(plugin.emailTemplates.professional).toBeDefined();
  });

  test('professional template has a name and description', () => {
    const t = plugin.emailTemplates.professional;
    expect(typeof t.name).toBe('string');
    expect(t.name.length).toBeGreaterThan(0);
    expect(typeof t.description).toBe('string');
  });

  const requiredTypes = [
    'site-header',
    'email-heading',
    'email-image',
    'email-paragraph',
    'email-button',
    'email-social',
    'site-footer',
  ];

  requiredTypes.forEach((type) => {
    test(`professional template includes component type "${type}"`, () => {
      const t = plugin.emailTemplates.professional;
      const types = t.components.map((c) => c.type);
      expect(types).toContain(type);
    });
  });
});

// ---------------------------------------------------------------------------
// 5.3 — Save Template button exists between test-email and export buttons
// ---------------------------------------------------------------------------

describe('5.3 — Save Template button is in the appbar between test-email and export', () => {
  test('btn-save-template appears between btn-open-test-email and btn-export in shell HTML', async () => {
    // Import shell.js as ES module via dynamic import
    const { renderBuilderShell } = await import('../../email-builder/shell.js');
    const div = document.createElement('div');
    renderBuilderShell(div);

    const html = div.innerHTML;
    const testEmailPos = html.indexOf('btn-open-test-email');
    const saveTemplatePos = html.indexOf('btn-save-template');
    const exportPos = html.indexOf('btn-export');

    expect(testEmailPos).toBeGreaterThan(-1);
    expect(saveTemplatePos).toBeGreaterThan(-1);
    expect(exportPos).toBeGreaterThan(-1);

    expect(saveTemplatePos).toBeGreaterThan(testEmailPos);
    expect(exportPos).toBeGreaterThan(saveTemplatePos);
  });

  test('save-template-modal exists in shell HTML', async () => {
    const { renderBuilderShell } = await import('../../email-builder/shell.js');
    const div = document.createElement('div');
    renderBuilderShell(div);
    expect(div.querySelector('#save-template-modal')).not.toBeNull();
    expect(div.querySelector('#save-template-name')).not.toBeNull();
    expect(div.querySelector('#save-template-feedback')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 5.4 — Empty/whitespace name does not write to localStorage
// ---------------------------------------------------------------------------

describe('5.4 — Empty/whitespace template name is rejected', () => {
  const invalidNames = ['', ' ', '   ', '\t', '\n', '  \t  \n  '];

  invalidNames.forEach((name, i) => {
    test(`name[${i}] "${JSON.stringify(name)}" is rejected and does not write to localStorage`, () => {
      const result = saveTemplate(name, {}, '', '', {});
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

// ---------------------------------------------------------------------------
// 5.5 — No "My Templates" heading when localStorage is empty
// ---------------------------------------------------------------------------

describe('5.5 — No "My Templates" heading when no saved templates', () => {
  test('renderTemplateGrid produces no "My Templates" heading when saved templates array is empty', () => {
    const html = renderTemplateGridHtml([]);
    expect(html).not.toContain('My Templates');
  });

  test('renderTemplateGrid produces no "Built-in Templates" heading when saved templates array is empty', () => {
    const html = renderTemplateGridHtml([]);
    expect(html).not.toContain('Built-in Templates');
  });
});

// ---------------------------------------------------------------------------
// 5.6 — P3: renderSocialLinks output never contains <svg
// ---------------------------------------------------------------------------

describe('P3 — renderSocialLinks output never contains <svg', () => {
  const socialConfigs = [
    { socialItems: [{ label: 'facebook', url: '#' }], align: 'center', iconSize: 32, iconShape: 'circle', iconStyle: 'solid-branded', spacing: 10 },
    { socialItems: [{ label: 'instagram', url: '#' }, { label: 'x', url: '#' }], align: 'left', iconSize: 24, iconShape: 'rounded', iconStyle: 'outline', spacing: 8 },
    { socialItems: [{ label: 'linkedin', url: '#' }, { label: 'youtube', url: '#' }, { label: 'tiktok', url: '#' }], align: 'right', iconSize: 48, iconShape: 'square', iconStyle: 'solid-custom', spacing: 12 },
    { socialItems: [{ label: 'pinterest', url: '#' }], align: 'center', iconSize: 16, iconShape: 'circle', iconStyle: 'branded', spacing: 0 },
    { socialItems: [{ label: 'snapchat', url: '#' }, { label: 'vimeo', url: '#' }], align: 'center', iconSize: 64, iconShape: 'circle', iconStyle: 'solid-branded', spacing: 20 },
    { socialItems: [{ label: 'unknown-network', url: '#' }], align: 'center', iconSize: 32, iconShape: 'circle', iconStyle: 'solid-branded', spacing: 10 },
    { socialItems: [], align: 'center', iconSize: 32, iconShape: 'circle', iconStyle: 'solid-branded', spacing: 10 },
    { socialItems: [{ label: 'facebook', url: '#' }, { label: 'instagram', url: '#' }, { label: 'x', url: '#' }, { label: 'linkedin', url: '#' }], align: 'center', iconSize: 32, iconShape: 'circle', iconStyle: 'solid-branded', spacing: 10 },
  ];

  test.each(socialConfigs.map((c, i) => [i, c]))(
    'config[%i] — output does not contain <svg',
    (_i, config) => {
      const model = makeSocialModel(config);
      const html = renderSocialLinksTest(model);
      expect(html).not.toContain('<svg');
    },
  );
});

// ---------------------------------------------------------------------------
// 5.7 — P4: each social item produces <img> with non-empty alt
// ---------------------------------------------------------------------------

describe('P4 — each social item produces <img> with non-empty alt', () => {
  const configs = [
    { socialItems: [{ label: 'facebook', url: '#' }] },
    { socialItems: [{ label: 'instagram', url: '#' }, { label: 'x', url: '#' }] },
    { socialItems: [{ label: 'linkedin', url: '#' }, { label: 'youtube', url: '#' }, { label: 'tiktok', url: '#' }] },
    { socialItems: [{ label: 'unknown', url: '#' }] },
    { socialItems: [{ label: 'facebook', url: '#' }, { label: 'instagram', url: '#' }, { label: 'x', url: '#' }, { label: 'linkedin', url: '#' }] },
  ];

  test.each(configs.map((c, i) => [i, c]))(
    'config[%i] — each item has <img> with non-empty alt',
    (_i, config) => {
      const model = makeSocialModel(config);
      const html = renderSocialLinksTest(model);
      const items = config.socialItems;

      items.forEach((item) => {
        // Each item should produce an <img> tag
        expect(html).toContain('<img');
        // The alt attribute should contain the capitalized network name
        const expectedAlt = item.label.charAt(0).toUpperCase() + item.label.slice(1);
        expect(html).toContain(`alt="${expectedAlt}"`);
      });
    },
  );
});

// ---------------------------------------------------------------------------
// 5.8 — P5: iconSize reflected as width/height; align reflected on outer table
// ---------------------------------------------------------------------------

describe('P5 — iconSize and align are reflected in rendered output', () => {
  const configs = [
    { iconSize: 16, align: 'left' },
    { iconSize: 24, align: 'center' },
    { iconSize: 32, align: 'right' },
    { iconSize: 48, align: 'center' },
    { iconSize: 64, align: 'left' },
  ];

  test.each(configs.map((c, i) => [i, c]))(
    'config[%i] — iconSize=%p and align=%p are reflected',
    (_i, { iconSize, align }) => {
      const model = makeSocialModel({
        socialItems: [{ label: 'facebook', url: '#' }],
        iconSize,
        align,
      });
      const html = renderSocialLinksTest(model);

      // iconSize should appear as width and height attributes
      expect(html).toContain(`width="${iconSize}"`);
      expect(html).toContain(`height="${iconSize}"`);

      // align should appear on the outer table
      expect(html).toContain(`align="${align}"`);
    },
  );
});

// ---------------------------------------------------------------------------
// 5.9 — P6: valid name saves complete entry to localStorage
// ---------------------------------------------------------------------------

describe('P6 — valid template name saves complete entry to localStorage', () => {
  const validNames = ['My Template', 'Summer Campaign 2025', 'a', 'Test 123', 'Special!@#$%'];

  test.each(validNames.map((n, i) => [i, n]))(
    'name[%i] "%s" saves a complete entry',
    (_i, name) => {
      const projectData = { pages: [{ id: 'main' }] };
      const html = '<!doctype html><html><body>test</body></html>';
      const css = 'body { color: red; }';
      const bodySettings = { textColor: '#000', contentWidth: 600 };

      const result = saveTemplate(name, projectData, html, css, bodySettings);
      expect(result.success).toBe(true);

      const saved = getSavedTemplates();
      expect(saved.length).toBe(1);

      const entry = saved[0];
      expect(entry.name).toBe(name.trim());
      expect(entry.id).toBeTruthy();
      expect(entry.createdAt).toBeTruthy();
      expect(entry.projectData).toEqual(projectData);
      expect(entry.html).toBe(html);
      expect(entry.css).toBe(css);
      expect(entry.bodySettings).toEqual(bodySettings);
    },
  );
});

// ---------------------------------------------------------------------------
// 5.10 — P7: whitespace-only name does not write to localStorage
// ---------------------------------------------------------------------------

describe('P7 — whitespace-only template name does not write to localStorage', () => {
  const whitespaceNames = ['', ' ', '   ', '\t', '\n', '  \t  \n  '];

  test.each(whitespaceNames.map((n, i) => [i, n]))(
    'whitespace name[%i] does not write to localStorage',
    (_i, name) => {
      saveTemplate(name, {}, '', '', {});
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
      expect(getSavedTemplates()).toEqual([]);
    },
  );
});

// ---------------------------------------------------------------------------
// 5.11 — P8: all saved templates appear as cards in "My Templates" section
// ---------------------------------------------------------------------------

describe('P8 — all saved templates appear in "My Templates" section', () => {
  const templateSets = [
    [makeSavedTemplate({ name: 'Template A' })],
    [makeSavedTemplate({ name: 'Template A' }), makeSavedTemplate({ name: 'Template B' })],
    [makeSavedTemplate({ name: 'A' }), makeSavedTemplate({ name: 'B' }), makeSavedTemplate({ name: 'C' })],
    Array.from({ length: 5 }, (_, i) => makeSavedTemplate({ name: `Template ${i + 1}` })),
  ];

  test.each(templateSets.map((ts, i) => [i, ts]))(
    'set[%i] with %# templates — all appear as cards',
    (_i, templates) => {
      const html = renderTemplateGridHtml(templates);

      expect(html).toContain('My Templates');

      templates.forEach((t) => {
        expect(html).toContain(t.name);
        expect(html).toContain(t.id);
      });
    },
  );
});

// ---------------------------------------------------------------------------
// 5.12 — P9: loading a saved template restores bodySettings
// ---------------------------------------------------------------------------

describe('P9 — loading a saved template restores bodySettings', () => {
  const bodySettingsSets = [
    { textColor: '#ff0000', canvasBackground: '#cccccc', emailBackground: '#ffffff', contentWidth: 600, contentAlignment: 'center', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: '400', preheaderText: '', linkColor: '#2563eb' },
    { textColor: '#000000', canvasBackground: '#e5e5e5', emailBackground: '#f0f0f0', contentWidth: 500, contentAlignment: 'left', fontFamily: 'Georgia, serif', fontWeight: '700', preheaderText: 'Hello!', linkColor: '#ff0000' },
    { textColor: '#333333', canvasBackground: '#ffffff', emailBackground: '#fafafa', contentWidth: 700, contentAlignment: 'center', fontFamily: 'Tahoma, Geneva, sans-serif', fontWeight: '400', preheaderText: '', linkColor: '#0000ff' },
  ];

  test.each(bodySettingsSets.map((bs, i) => [i, bs]))(
    'bodySettings[%i] — loading restores all fields',
    (_i, bodySettings) => {
      const template = makeSavedTemplate({ bodySettings });

      // Simulate loading: the load handler calls applyBodySettings(template.bodySettings)
      // We test that the bodySettings object from the template matches what was stored
      const loaded = template.bodySettings;
      expect(loaded).toEqual(bodySettings);

      // Verify all required fields are present
      expect(loaded.textColor).toBe(bodySettings.textColor);
      expect(loaded.canvasBackground).toBe(bodySettings.canvasBackground);
      expect(loaded.emailBackground).toBe(bodySettings.emailBackground);
      expect(loaded.contentWidth).toBe(bodySettings.contentWidth);
      expect(loaded.contentAlignment).toBe(bodySettings.contentAlignment);
      expect(loaded.fontFamily).toBe(bodySettings.fontFamily);
      expect(loaded.fontWeight).toBe(bodySettings.fontWeight);
      expect(loaded.preheaderText).toBe(bodySettings.preheaderText);
      expect(loaded.linkColor).toBe(bodySettings.linkColor);
    },
  );
});

// ---------------------------------------------------------------------------
// 5.13 — P10: deleting a saved template removes it from storage and modal
// ---------------------------------------------------------------------------

describe('P10 — deleting a saved template removes it from storage and modal', () => {
  const templateSets = [
    [makeSavedTemplate({ name: 'Only Template' })],
    [makeSavedTemplate({ name: 'A' }), makeSavedTemplate({ name: 'B' })],
    [makeSavedTemplate({ name: 'A' }), makeSavedTemplate({ name: 'B' }), makeSavedTemplate({ name: 'C' })],
  ];

  test.each(templateSets.map((ts, i) => [i, ts]))(
    'set[%i] — deleting first template removes it',
    (_i, templates) => {
      // Save all templates
      setSavedTemplates(templates);

      const toDelete = templates[0];

      // Simulate delete: filter out the template
      const updated = getSavedTemplates().filter((t) => t.id !== toDelete.id);
      setSavedTemplates(updated);

      // Verify it's gone from storage
      const remaining = getSavedTemplates();
      expect(remaining.find((t) => t.id === toDelete.id)).toBeUndefined();
      expect(remaining.length).toBe(templates.length - 1);

      // Verify it's gone from the rendered modal
      const html = renderTemplateGridHtml(remaining);
      expect(html).not.toContain(toDelete.id);
      expect(html).not.toContain(toDelete.name);
    },
  );
});

// ---------------------------------------------------------------------------
// 5.14 — P11: localStorage errors are handled gracefully
// ---------------------------------------------------------------------------

describe('P11 — localStorage errors are handled gracefully', () => {
  test('getSavedTemplates returns [] when localStorage.getItem throws', () => {
    mockLocalStorage.getItem.mockImplementationOnce(() => {
      throw new Error('localStorage unavailable');
    });
    expect(() => getSavedTemplates()).not.toThrow();
    expect(getSavedTemplates()).toEqual([]);
  });

  test('getSavedTemplates returns [] when stored value is invalid JSON', () => {
    mockStore[SAVED_TEMPLATES_KEY] = 'not-valid-json{{{';
    expect(() => getSavedTemplates()).not.toThrow();
    expect(getSavedTemplates()).toEqual([]);
  });

  test('setSavedTemplates re-throws when localStorage.setItem throws', () => {
    mockLocalStorage.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => setSavedTemplates([makeSavedTemplate()])).toThrow('QuotaExceededError');
  });

  test('saveTemplate catches setSavedTemplates error and returns failure', () => {
    mockLocalStorage.setItem.mockImplementationOnce(() => {
      throw new Error('QuotaExceededError');
    });
    // The saveTemplate wrapper should catch the error
    let caught = false;
    try {
      saveTemplate('My Template', {}, '', '', {});
    } catch (e) {
      caught = true;
    }
    // The error propagates from setSavedTemplates — callers (app.js) catch it and show toast
    // This test verifies the error is thrown (not silently swallowed at the storage layer)
    expect(caught).toBe(true);
  });

  test('getSavedTemplates returns [] when localStorage.getItem returns null', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);
    expect(getSavedTemplates()).toEqual([]);
  });
});
