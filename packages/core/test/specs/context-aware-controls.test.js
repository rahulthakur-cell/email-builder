'use strict';

/**
 * Tests for the context-aware-controls feature.
 *
 * Covers:
 *   5.1  — isComponent edge cases (responsive-td, nested cells, detached)
 *   5.2  — renderParagraphBlock with specific HTML inputs
 *   5.3  — email-paragraph defaults and trait definitions
 *   5.4  — email-table-cell trait list contains all required Table_Traits
 *   4.1  — P1: layout columns (responsive-td) are excluded by isComponent
 *   4.2  — P2: cells inside sb-inner-table ancestor are matched
 *   4.3  — P3: cells inside email-table-row ancestor are matched
 *   4.4  — P4: cells with no qualifying ancestor return false
 *   4.5  — P5: renderParagraphBlock with formattingMode='keep' preserves paragraphText
 *   4.6  — P6: renderParagraphBlock with formattingMode='remove' strips all HTML tags
 *   4.7  — P7: plain-text paragraphText produces identical output for both modes
 *   4.8  — P8: paragraphText is never mutated (round-trip safety)
 */

// ---------------------------------------------------------------------------
// Inline isComponent implementation (mirrors the fixed minimal-builder-plugin.js)
// ---------------------------------------------------------------------------

/**
 * The narrowed isComponent function extracted for unit testing.
 * Mirrors the implementation in minimal-builder-plugin.js.
 */
const emailTableCellIsComponent = (el) => {
  if (el.tagName !== 'TD' && el.tagName !== 'TH') return false;
  if (el.classList && el.classList.contains('responsive-td')) return false;
  if (el.dataset && el.dataset.layoutRole === 'layout-column') return false;
  let parent = el.parentElement;
  while (parent) {
    if (parent.classList && parent.classList.contains('sb-inner-table')) {
      return { type: 'email-table-cell' };
    }
    if (parent.dataset && parent.dataset.gjsType === 'email-table-row') {
      return { type: 'email-table-cell' };
    }
    parent = parent.parentElement;
  }
  return false;
};

// ---------------------------------------------------------------------------
// Inline renderParagraphBlock (mirrors the updated minimal-builder-plugin.js)
// ---------------------------------------------------------------------------

const renderParagraphBlock = (model) => {
  const align = model.get('align') || 'left';
  let text = model.get('paragraphText') || 'Add your supporting copy here.';
  if (model.get('formattingMode') === 'remove') {
    text = text
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
  return `<p style="text-align:${align};">${text}</p>`;
};

// ---------------------------------------------------------------------------
// DOM helpers for isComponent tests
// ---------------------------------------------------------------------------

/**
 * Create a <td> or <th> element with optional class and dataset attributes.
 */
const makeTd = (tag = 'TD', opts = {}) => {
  const el = document.createElement(tag.toLowerCase());
  if (opts.classes) opts.classes.forEach((c) => el.classList.add(c));
  if (opts.dataset) Object.entries(opts.dataset).forEach(([k, v]) => { el.dataset[k] = v; });
  return el;
};

/**
 * Wrap an element in a chain of ancestor elements.
 * ancestors = [{ tag, classes?, dataset? }, ...]  (innermost first)
 */
const wrapInAncestors = (el, ancestors) => {
  let current = el;
  for (const anc of ancestors) {
    const parent = document.createElement(anc.tag.toLowerCase());
    if (anc.classes) anc.classes.forEach((c) => parent.classList.add(c));
    if (anc.dataset) Object.entries(anc.dataset).forEach(([k, v]) => { parent.dataset[k] = v; });
    parent.appendChild(current);
    current = parent;
  }
  return el; // return the original element (now attached to ancestors)
};

// ---------------------------------------------------------------------------
// Model mock helper
// ---------------------------------------------------------------------------

const makeModel = (props = {}) => ({
  get: (key) => props[key],
});

// ---------------------------------------------------------------------------
// 5.1 — isComponent edge cases
// ---------------------------------------------------------------------------

describe('5.1 — isComponent edge cases', () => {
  test('<td class="responsive-td"> returns false', () => {
    const el = makeTd('TD', { classes: ['responsive-td'] });
    expect(emailTableCellIsComponent(el)).toBe(false);
  });

  test('<th class="responsive-td"> returns false', () => {
    const el = makeTd('TH', { classes: ['responsive-td'] });
    expect(emailTableCellIsComponent(el)).toBe(false);
  });

  test('<td data-layout-role="layout-column"> returns false', () => {
    const el = makeTd('TD', { dataset: { layoutRole: 'layout-column' } });
    expect(emailTableCellIsComponent(el)).toBe(false);
  });

  test('<td> inside <table class="sb-inner-table"> returns email-table-cell', () => {
    const el = makeTd('TD');
    wrapInAncestors(el, [
      { tag: 'TR' },
      { tag: 'TBODY' },
      { tag: 'TABLE', classes: ['sb-inner-table'] },
    ]);
    expect(emailTableCellIsComponent(el)).toEqual({ type: 'email-table-cell' });
  });

  test('<td> inside <tr data-gjs-type="email-table-row"> returns email-table-cell', () => {
    const el = makeTd('TD');
    wrapInAncestors(el, [
      { tag: 'TR', dataset: { gjsType: 'email-table-row' } },
    ]);
    expect(emailTableCellIsComponent(el)).toEqual({ type: 'email-table-cell' });
  });

  test('detached <td> (no parent) returns false', () => {
    const el = makeTd('TD');
    // No parent — parentElement is null
    expect(emailTableCellIsComponent(el)).toBe(false);
  });

  test('<div> element returns false (not TD/TH)', () => {
    const el = document.createElement('div');
    expect(emailTableCellIsComponent(el)).toBe(false);
  });

  test('<td> with no qualifying ancestor returns false', () => {
    const el = makeTd('TD');
    wrapInAncestors(el, [
      { tag: 'TR' },
      { tag: 'TBODY' },
      { tag: 'TABLE' }, // no sb-inner-table class
    ]);
    expect(emailTableCellIsComponent(el)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5.2 — renderParagraphBlock with specific HTML inputs
// ---------------------------------------------------------------------------

describe('5.2 — renderParagraphBlock with specific HTML inputs', () => {
  test('keep mode: <b>bold</b> is preserved', () => {
    const model = makeModel({ paragraphText: '<b>bold</b>', formattingMode: 'keep', align: 'left' });
    expect(renderParagraphBlock(model)).toContain('<b>bold</b>');
  });

  test('remove mode: <b>bold</b> becomes "bold"', () => {
    const model = makeModel({ paragraphText: '<b>bold</b>', formattingMode: 'remove', align: 'left' });
    const output = renderParagraphBlock(model);
    expect(output).not.toContain('<b>');
    expect(output).toContain('bold');
  });

  test('remove mode: <br> is stripped', () => {
    const model = makeModel({ paragraphText: 'line1<br>line2', formattingMode: 'remove', align: 'left' });
    const output = renderParagraphBlock(model);
    expect(output).not.toContain('<br>');
    expect(output).toContain('line1');
    expect(output).toContain('line2');
  });

  test('remove mode: &nbsp; becomes a space', () => {
    const model = makeModel({ paragraphText: 'hello&nbsp;world', formattingMode: 'remove', align: 'left' });
    const output = renderParagraphBlock(model);
    expect(output).toContain('hello world');
  });

  test('remove mode: empty string uses fallback text', () => {
    const model = makeModel({ paragraphText: '', formattingMode: 'remove', align: 'left' });
    const output = renderParagraphBlock(model);
    expect(output).toContain('Add your supporting copy here.');
  });

  test('keep mode: empty string uses fallback text', () => {
    const model = makeModel({ paragraphText: '', formattingMode: 'keep', align: 'left' });
    const output = renderParagraphBlock(model);
    expect(output).toContain('Add your supporting copy here.');
  });

  test('remove mode: &amp; becomes &', () => {
    const model = makeModel({ paragraphText: 'A &amp; B', formattingMode: 'remove', align: 'left' });
    expect(renderParagraphBlock(model)).toContain('A & B');
  });

  test('remove mode: &lt; and &gt; become < and >', () => {
    const model = makeModel({ paragraphText: '&lt;tag&gt;', formattingMode: 'remove', align: 'left' });
    expect(renderParagraphBlock(model)).toContain('<tag>');
  });
});

// ---------------------------------------------------------------------------
// 5.3 — email-paragraph defaults and trait definitions
// ---------------------------------------------------------------------------

describe('5.3 — email-paragraph defaults and trait definitions', () => {
  let plugin;

  beforeAll(() => {
    require('../../minimal-builder-plugin.js');
    plugin = global.grapesjsMinimalBuilder;
  });

  test('plugin loads and exposes emailTemplates', () => {
    expect(plugin).toBeDefined();
    expect(plugin.emailTemplates).toBeDefined();
  });

  test('plugin source contains formattingMode: keep default', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../minimal-builder-plugin.js'), 'utf8',
    );
    expect(src).toContain("formattingMode: 'keep'");
  });

  test('plugin source contains formattingMode select trait with keep and remove options', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../minimal-builder-plugin.js'), 'utf8',
    );
    expect(src).toContain("name: 'formattingMode'");
    expect(src).toContain("id: 'keep'");
    expect(src).toContain("id: 'remove'");
    expect(src).toContain("Keep Formatting");
    expect(src).toContain("Remove Formatting");
  });

  test('plugin source includes formattingMode in bindRenderer for email-paragraph', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../minimal-builder-plugin.js'), 'utf8',
    );
    expect(src).toContain("'formattingMode'");
    expect(src).toContain("renderParagraphBlock");
  });
});

// ---------------------------------------------------------------------------
// 5.4 — email-table-cell trait list contains all required Table_Traits
// ---------------------------------------------------------------------------

describe('5.4 — email-table-cell trait list contains all required Table_Traits', () => {
  test('plugin source contains table-cell-actions trait', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.resolve(__dirname, '../../minimal-builder-plugin.js'), 'utf8',
    );
    expect(src).toContain("type: 'table-cell-actions'");
    expect(src).toContain("name: 'colspan'");
    expect(src).toContain("name: 'rowspan'");
  });

  test('isComponent for email-table-cell excludes responsive-td', () => {
    const el = makeTd('TD', { classes: ['responsive-td'] });
    expect(emailTableCellIsComponent(el)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// P1 — Layout columns (responsive-td) are excluded by isComponent
// ---------------------------------------------------------------------------

describe('P1 — Layout columns (responsive-td) are excluded by isComponent', () => {
  const cases = [
    { tag: 'TD', classes: ['responsive-td'] },
    { tag: 'TH', classes: ['responsive-td'] },
    { tag: 'TD', classes: ['responsive-td', 'some-other-class'] },
    { tag: 'TD', classes: ['responsive-td'], dataset: { layoutRole: 'layout-column' } },
    { tag: 'TD', classes: ['responsive-td', 'c1234'] },
  ];

  test.each(cases.map((c, i) => [i, c]))(
    'case[%i] — responsive-td element returns false',
    (_i, { tag, classes = [], dataset = {} }) => {
      const el = makeTd(tag, { classes, dataset });
      // Even if wrapped in sb-inner-table, responsive-td must be excluded
      wrapInAncestors(el, [{ tag: 'TABLE', classes: ['sb-inner-table'] }]);
      expect(emailTableCellIsComponent(el)).toBe(false);
    },
  );
});

// ---------------------------------------------------------------------------
// P2 — Cells inside sb-inner-table ancestor are matched
// ---------------------------------------------------------------------------

describe('P2 — Cells inside sb-inner-table ancestor are matched', () => {
  // Test at varying nesting depths (1–5 levels between cell and sb-inner-table)
  const depths = [
    [{ tag: 'TABLE', classes: ['sb-inner-table'] }],
    [{ tag: 'TBODY' }, { tag: 'TABLE', classes: ['sb-inner-table'] }],
    [{ tag: 'TR' }, { tag: 'TBODY' }, { tag: 'TABLE', classes: ['sb-inner-table'] }],
    [{ tag: 'DIV' }, { tag: 'TR' }, { tag: 'TBODY' }, { tag: 'TABLE', classes: ['sb-inner-table'] }],
    [{ tag: 'SPAN' }, { tag: 'DIV' }, { tag: 'TR' }, { tag: 'TBODY' }, { tag: 'TABLE', classes: ['sb-inner-table'] }],
  ];

  test.each(depths.map((d, i) => [i, d]))(
    'depth[%i] — <td> inside sb-inner-table at depth %# returns email-table-cell',
    (_i, ancestors) => {
      const el = makeTd('TD');
      wrapInAncestors(el, ancestors);
      expect(emailTableCellIsComponent(el)).toEqual({ type: 'email-table-cell' });
    },
  );

  test.each(depths.map((d, i) => [i, d]))(
    'depth[%i] — <th> inside sb-inner-table at depth %# returns email-table-cell',
    (_i, ancestors) => {
      const el = makeTd('TH');
      wrapInAncestors(el, ancestors);
      expect(emailTableCellIsComponent(el)).toEqual({ type: 'email-table-cell' });
    },
  );
});

// ---------------------------------------------------------------------------
// P3 — Cells inside email-table-row ancestor are matched
// ---------------------------------------------------------------------------

describe('P3 — Cells inside email-table-row ancestor are matched', () => {
  const depths = [
    [{ tag: 'TR', dataset: { gjsType: 'email-table-row' } }],
    [{ tag: 'DIV' }, { tag: 'TR', dataset: { gjsType: 'email-table-row' } }],
    [{ tag: 'SPAN' }, { tag: 'DIV' }, { tag: 'TR', dataset: { gjsType: 'email-table-row' } }],
  ];

  test.each(depths.map((d, i) => [i, d]))(
    'depth[%i] — <td> inside email-table-row at depth %# returns email-table-cell',
    (_i, ancestors) => {
      const el = makeTd('TD');
      wrapInAncestors(el, ancestors);
      expect(emailTableCellIsComponent(el)).toEqual({ type: 'email-table-cell' });
    },
  );
});

// ---------------------------------------------------------------------------
// P4 — Cells with no qualifying ancestor return false
// ---------------------------------------------------------------------------

describe('P4 — Cells with no qualifying ancestor return false', () => {
  const cases = [
    [], // detached
    [{ tag: 'TR' }], // tr without email-table-row marker
    [{ tag: 'TBODY' }, { tag: 'TABLE' }], // table without sb-inner-table class
    [{ tag: 'DIV' }, { tag: 'SECTION' }], // non-table ancestors
    [{ tag: 'TABLE', classes: ['some-other-table'] }], // wrong class
    [{ tag: 'TR', dataset: { gjsType: 'some-other-type' } }], // wrong data-gjs-type
  ];

  test.each(cases.map((c, i) => [i, c]))(
    'case[%i] — <td> with non-qualifying ancestors returns false',
    (_i, ancestors) => {
      const el = makeTd('TD');
      if (ancestors.length > 0) wrapInAncestors(el, ancestors);
      expect(emailTableCellIsComponent(el)).toBe(false);
    },
  );
});

// ---------------------------------------------------------------------------
// P5 — renderParagraphBlock with formattingMode='keep' preserves paragraphText
// ---------------------------------------------------------------------------

describe('P5 — formattingMode=keep preserves paragraphText unchanged', () => {
  const inputs = [
    'Plain text',
    '<b>Bold text</b>',
    '<span style="color:red;">Colored</span>',
    '<a href="https://example.com">Link</a>',
    'Text with <br> line break',
    '<p>Nested paragraph</p>',
    'Text &amp; more text',
    '<strong><em>Nested tags</em></strong>',
    '',
    'No HTML at all',
  ];

  test.each(inputs.map((t, i) => [i, t]))(
    'input[%i] — paragraphText is preserved in keep mode',
    (_i, text) => {
      const model = makeModel({ paragraphText: text, formattingMode: 'keep', align: 'left' });
      const output = renderParagraphBlock(model);
      const expected = text || 'Add your supporting copy here.';
      expect(output).toContain(expected);
    },
  );
});

// ---------------------------------------------------------------------------
// P6 — renderParagraphBlock with formattingMode='remove' strips all HTML tags
// ---------------------------------------------------------------------------

describe('P6 — formattingMode=remove strips all HTML tags from paragraphText', () => {
  const inputs = [
    { text: '<b>bold</b>', expectedText: 'bold' },
    { text: '<span style="color:red;">red</span>', expectedText: 'red' },
    { text: '<a href="#">link</a>', expectedText: 'link' },
    { text: '<p>paragraph</p>', expectedText: 'paragraph' },
    { text: '<strong><em>nested</em></strong>', expectedText: 'nested' },
    { text: 'hello&nbsp;world', expectedText: 'hello world' },
    { text: 'A &amp; B', expectedText: 'A & B' },
    { text: '<br>', expectedText: '' }, // just a br tag — stripped to empty, fallback used
    { text: 'no tags here', expectedText: 'no tags here' },
  ];

  test.each(inputs.map((c, i) => [i, c]))(
    'input[%i] — HTML tags are stripped in remove mode',
    (_i, { text, expectedText }) => {
      const model = makeModel({ paragraphText: text, formattingMode: 'remove', align: 'left' });
      const output = renderParagraphBlock(model);
      // The output should not contain any HTML tags from the original paragraphText
      // (the wrapping <p> tag from the render function itself is allowed)
      const innerContent = output.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
      // No remaining HTML tags from the original input
      expect(innerContent).not.toMatch(/<[a-zA-Z][^>]*>/);
      if (expectedText) {
        expect(output).toContain(expectedText);
      }
    },
  );
});

// ---------------------------------------------------------------------------
// P7 — Plain-text paragraphText produces identical output for both modes
// ---------------------------------------------------------------------------

describe('P7 — Plain-text paragraphText produces identical output for both modes', () => {
  const plainTexts = [
    'Hello world',
    'Simple paragraph text',
    'Numbers 123 and symbols !@#',
    'A longer sentence with multiple words and punctuation.',
    'Short',
    'Text with   multiple   spaces',
  ];

  test.each(plainTexts.map((t, i) => [i, t]))(
    'plain text[%i] — keep and remove produce identical output',
    (_i, text) => {
      const keepModel = makeModel({ paragraphText: text, formattingMode: 'keep', align: 'left' });
      const removeModel = makeModel({ paragraphText: text, formattingMode: 'remove', align: 'left' });
      expect(renderParagraphBlock(keepModel)).toBe(renderParagraphBlock(removeModel));
    },
  );
});

// ---------------------------------------------------------------------------
// P8 — paragraphText is never mutated (round-trip safety)
// ---------------------------------------------------------------------------

describe('P8 — paragraphText is never mutated (round-trip safety)', () => {
  const htmlTexts = [
    '<b>Bold text</b>',
    '<span style="color:red;">Colored text</span>',
    '<a href="https://example.com">Link text</a>',
    '<strong><em>Nested formatting</em></strong>',
    'Text with <br> break and <b>bold</b>',
  ];

  test.each(htmlTexts.map((t, i) => [i, t]))(
    'html text[%i] — rendering with keep after remove produces same as keep from start',
    (_i, text) => {
      // Render with keep first
      const keepModel = makeModel({ paragraphText: text, formattingMode: 'keep', align: 'left' });
      const keepOutput = renderParagraphBlock(keepModel);

      // Render with remove (should not mutate the model's paragraphText)
      const removeModel = makeModel({ paragraphText: text, formattingMode: 'remove', align: 'left' });
      renderParagraphBlock(removeModel); // discard output

      // Render with keep again — should produce the same output as the first keep render
      // (paragraphText was not mutated by the remove render)
      const keepAgainModel = makeModel({ paragraphText: text, formattingMode: 'keep', align: 'left' });
      const keepAgainOutput = renderParagraphBlock(keepAgainModel);

      expect(keepAgainOutput).toBe(keepOutput);
    },
  );

  test('paragraphText prop is not modified by renderParagraphBlock in remove mode', () => {
    const originalText = '<b>Original <em>HTML</em> text</b>';
    const props = { paragraphText: originalText, formattingMode: 'remove', align: 'left' };
    const model = makeModel(props);

    renderParagraphBlock(model);

    // The original props object should not have been mutated
    expect(props.paragraphText).toBe(originalText);
  });
});
