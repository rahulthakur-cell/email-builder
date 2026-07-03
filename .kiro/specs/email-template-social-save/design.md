# Design Document

## Feature: email-template-social-save

---

## Overview

This feature delivers three tightly related improvements to the GrapesJS email builder:

1. **Professional Template** — A new built-in template added to `emailTemplates` in `minimal-builder-plugin.js`, composed entirely of existing component types, that gives users a polished starting point without introducing any new dependencies.

2. **Email-Safe Social Icons** — A targeted fix to `renderSocialLinks()` that replaces inline `<svg>` elements (invisible in Gmail, Outlook, Apple Mail, and Yahoo Mail) with `<img>` tags pointing to publicly hosted PNG icons via a reliable CDN.

3. **Save Template Feature** — A "Save Template" button in the appbar that lets users persist the current editor state (project data + production HTML + CSS + body settings) to localStorage, with full CRUD support in the Templates modal.

All three areas touch the same three files: `minimal-builder-plugin.js`, `shell.js`, and `app.js`. The changes are additive and backward-compatible — no existing templates, components, or storage keys are modified.

---

## Architecture

The builder follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│  shell.js  — DOM structure, modals, appbar HTML          │
├─────────────────────────────────────────────────────────┤
│  app.js    — Application logic, event wiring, state      │
├─────────────────────────────────────────────────────────┤
│  minimal-builder-plugin.js  — GrapesJS plugin:           │
│    • Component type registrations                        │
│    • Block library                                       │
│    • Render functions (renderSocialLinks, etc.)          │
│    • emailTemplates object                               │
├─────────────────────────────────────────────────────────┤
│  config.js — Static configuration (keys, defaults)       │
└─────────────────────────────────────────────────────────┘
```

Each of the three sub-features maps cleanly to this layered structure:

| Sub-feature | Primary file | Secondary file |
|---|---|---|
| Professional Template | `minimal-builder-plugin.js` (add to `emailTemplates`) | `app.js` (no change needed — `renderTemplateGrid` iterates all keys) |
| Email-Safe Social Icons | `minimal-builder-plugin.js` (replace `getSocialIconSvg` usage in `renderSocialLinks`) | — |
| Save Template | `shell.js` (button + modal HTML) | `app.js` (logic, localStorage, modal rendering) |

---

## Components and Interfaces

### 1. Professional Template

The template is a plain JavaScript object added to the `emailTemplates` map in `minimal-builder-plugin.js`. The existing `renderTemplateGrid()` in `app.js` iterates `Object.entries(minimalBuilder.emailTemplates)` and renders a card for every key — no changes to `app.js` are needed for the template to appear.

**Template definition shape** (matches existing entries):

```js
professional: {
  name: 'Professional',
  description: 'A clean, modern email with header, hero image, body copy, CTA, social icons, and footer.',
  components: [
    { type: 'site-header' },
    { type: 'email-heading', headingText: 'Your headline goes here', headingLevel: 'h1', align: 'center' },
    { type: 'email-image', imageSrc: 'https://picsum.photos/id/1060/900/700', imageAlt: 'Featured image', imageAlign: 'center', imageWidth: '100%' },
    { type: 'email-paragraph', paragraphText: 'Add your supporting copy here...', align: 'left' },
    { type: 'email-button', buttonText: 'Get Started', align: 'center' },
    { type: 'email-social', socialItems: [
      { label: 'facebook', url: '#' },
      { label: 'instagram', url: '#' },
      { label: 'x', url: '#' },
      { label: 'linkedin', url: '#' },
    ], align: 'center' },
    { type: 'site-footer' },
  ],
}
```

All component types (`site-header`, `email-heading`, `email-paragraph`, `email-image`, `email-button`, `email-social`, `site-footer`) are already registered by the plugin. The `applyTemplate` flow in `app.js` calls `editor.setComponents(cloneValue(template.components))` which handles instantiation.

### 2. Email-Safe Social Icons

**Root cause:** `renderSocialLinks()` calls `getSocialIconSvg()` which returns a `<div>` containing an `<svg>` element. Inline SVG is stripped or ignored by Gmail, Outlook, Apple Mail, and Yahoo Mail.

**Fix approach:** Replace `getSocialIconSvg()` with a new `getSocialIconImg()` function that returns an `<img>` tag pointing to a publicly hosted PNG icon.

**CDN selection:** [Simple Icons CDN](https://cdn.simpleicons.org/) (`https://cdn.simpleicons.org/{slug}/{color}`) serves SVG files, not PNG — unsuitable. The best option for email-safe PNG icons is the **Brandfetch CDN** or a self-hosted approach. After research, the most reliable, no-auth, HTTPS PNG source for social icons is:

- **`https://img.icons8.com/color/48/{slug}.png`** — Icons8 provides stable, publicly accessible PNG icons at fixed sizes. No API key required for basic usage. Widely used in email templates.

However, to avoid any third-party dependency risk, the design uses a **direct PNG URL map** where each network maps to a stable, well-known CDN URL. The recommended CDN is **Icons8** for colored icons and a fallback to a neutral gray square for unknown networks.

**`socialIconPngMap` structure:**

```js
const socialIconPngMap = {
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
```

**`getSocialIconImg()` function signature:**

```js
const getSocialIconImg = (name = '', opts = {}) => {
  // Returns an <img> tag with the PNG icon URL, sized to iconSize, with alt text
  // Falls back to a text label if the network is unknown
}
```

**Updated `renderSocialLinks()` — key change:**

```js
// Before:
${getSocialIconSvg(item.label, { style: iconStyle, shape: iconShape, size: iconSize, linkColor })}

// After:
${getSocialIconImg(item.label, { size: iconSize, shape: iconShape, style: iconStyle, linkColor })}
```

The `iconStyle` and `iconShape` properties are preserved in the new function:
- `iconStyle` controls whether to use the colored PNG or apply a CSS filter/border treatment
- `iconShape` controls `border-radius` on the `<img>` wrapper `<td>` or the `<img>` itself
- `iconSize` sets `width` and `height` attributes on the `<img>` tag
- `spacing` and `align` are unchanged (controlled by the outer table structure)
- `linkColor` is used for the `outline`/`border` style when `iconStyle === 'outline'`

**Rendered output example:**

```html
<td style="padding-left:10px; line-height:0; font-size:0;">
  <a href="https://facebook.com" style="text-decoration:none; display:inline-block;" target="_blank">
    <img src="https://img.icons8.com/color/48/facebook-new.png"
         width="32" height="32"
         alt="Facebook"
         style="display:block; border:0; border-radius:50%;" />
  </a>
</td>
```

### 3. Save Template Feature

#### 3a. Shell Changes (`shell.js`)

**New button** added to `.studio-appbar__actions` between the Send Test Email button and the EXPORT button:

```html
<button id="btn-save-template" class="studio-button studio-button--secondary" type="button">
  Save Template
</button>
```

**New modal** added after the existing `#test-email-modal`:

```html
<div id="save-template-modal" class="studio-modal" aria-hidden="true">
  <div class="studio-modal__dialog studio-modal__dialog--compact">
    <div class="studio-modal__head">
      <div>
        <strong>Save Template</strong>
        <p>Save the current design as a reusable template.</p>
      </div>
      <button class="studio-modal__close" id="btn-close-save-template-modal" type="button">&times;</button>
    </div>
    <div class="studio-modal__body studio-modal__body--padded">
      <form id="save-template-form" class="studio-test-email-form">
        <label class="studio-test-email-field" for="save-template-name">
          <span>Template name</span>
          <input id="save-template-name" type="text" placeholder="e.g. Summer Campaign" autocomplete="off" />
        </label>
        <div id="save-template-feedback" class="studio-test-email-feedback" aria-live="polite"></div>
      </form>
    </div>
    <div class="studio-modal__foot">
      <span></span>
      <div class="studio-modal__actions">
        <button id="btn-cancel-save-template" class="studio-button studio-button--secondary" type="button">Cancel</button>
        <button id="btn-confirm-save-template" class="studio-button studio-button--primary" type="submit" form="save-template-form">Save</button>
      </div>
    </div>
  </div>
</div>
```

**New shell references** returned from `renderBuilderShell()`:

```js
saveTemplateModal: root.querySelector('#save-template-modal'),
saveTemplateForm: root.querySelector('#save-template-form'),
saveTemplateInput: root.querySelector('#save-template-name'),
saveTemplateFeedback: root.querySelector('#save-template-feedback'),
saveTemplateSubmit: root.querySelector('#btn-confirm-save-template'),
```

#### 3b. App Logic (`app.js`)

**localStorage key:**

```js
const SAVED_TEMPLATES_KEY = 'grapesjs-email-builder-saved-templates';
```

This key does not start with `grapesjs-email-builder-studio` so it will not be cleared by the existing stale-storage cleanup loop.

**Saved template schema:**

```ts
interface SavedTemplate {
  id: string;           // crypto.randomUUID() or Date.now().toString(36)
  name: string;         // user-supplied name
  createdAt: string;    // ISO 8601 timestamp
  projectData: object;  // editor.getProjectData()
  html: string;         // buildProductionHtml()
  css: string;          // editor.getCss()
  bodySettings: object; // snapshot of state.bodySettings
}
```

The `bodySettings` field is critical for Requirement 3.8 — it allows `applyBodySettings()` to be called with the stored values when loading a saved template.

**localStorage helpers:**

```js
const getSavedTemplates = () => {
  try {
    const raw = localStorage.getItem(SAVED_TEMPLATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const setSavedTemplates = (templates) => {
  localStorage.setItem(SAVED_TEMPLATES_KEY, JSON.stringify(templates));
};
```

**Save flow:**

```
User clicks "Save Template"
  → openModal(shell.saveTemplateModal)
  → User types name and submits form
  → Validate: name.trim() !== ''
    → If empty: show validation error in #save-template-feedback, do not save
    → If valid:
        → Build entry: { id, name, createdAt, projectData, html, css, bodySettings }
        → getSavedTemplates() → push entry → setSavedTemplates()
        → closeModal(shell.saveTemplateModal)
        → showToast('Template saved.')
        → catch localStorage errors → showToast('Could not save template.')
```

**Load flow (saved template):**

```
User clicks saved template card in Templates modal
  → editor.loadProjectData(template.projectData)
  → applyBodySettings(template.bodySettings)
  → closeModal(shell.templateModal)
  → showToast(`${template.name} loaded.`)
  → catch errors → showToast('Could not load that template.')
```

**Delete flow:**

```
User clicks × on saved template card
  → getSavedTemplates()
  → filter out entry with matching id
  → setSavedTemplates(filtered)
  → re-render the template grid (renderTemplateGrid())
```

**Updated `renderTemplateGrid()`:**

The function is extended to render a "My Templates" section above the built-in templates section when saved templates exist:

```
renderTemplateGrid():
  1. shell.templateGrid.innerHTML = ''
  2. savedTemplates = getSavedTemplates()
  3. If savedTemplates.length > 0:
       Render <div class="studio-template-section-heading">My Templates</div>
       For each saved template:
         Render card with name, createdAt, and × delete button
  4. Render <div class="studio-template-section-heading">Built-in Templates</div>
       (only if savedTemplates.length > 0, to avoid heading when there are no saved templates)
  5. For each built-in template: render card (existing logic)
  6. Render Blank Canvas card (existing logic)
```

---

## Data Models

### Saved Template (localStorage)

```json
{
  "id": "lx3k9f2a",
  "name": "Summer Campaign",
  "createdAt": "2025-06-15T14:32:00.000Z",
  "projectData": { "...GrapesJS project data object..." },
  "html": "<!doctype html>...",
  "css": "body { ... }",
  "bodySettings": {
    "textColor": "#000000",
    "canvasBackground": "#e5e5e5",
    "emailBackground": "#ffffff",
    "contentWidth": 600,
    "contentAlignment": "center",
    "fontFamily": "Arial, Helvetica, sans-serif",
    "fontWeight": "400",
    "preheaderText": "",
    "linkColor": "#2563eb"
  }
}
```

**localStorage array structure:**

```json
[
  { "id": "lx3k9f2a", "name": "Summer Campaign", ... },
  { "id": "m7p2q8rb", "name": "Welcome Email", ... }
]
```

**Key:** `grapesjs-email-builder-saved-templates`

### Social Icon PNG Map

```js
// Key: lowercase network name (matches socialItems[].label)
// Value: HTTPS PNG URL, minimum 48×48px source
const socialIconPngMap = {
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
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Professional template uses only registered component types

*For any* component entry in the Professional template's `components` array, its `type` field must be a member of the set of component types registered by `minimal-builder-plugin.js`.

**Validates: Requirements 1.4**

---

### Property 2: Professional template export is SVG-free

*For any* invocation of `buildProductionHtml()` after loading the Professional template, the resulting HTML string must not contain the substring `<svg`.

**Validates: Requirements 1.6**

---

### Property 3: Social icon rendering produces no inline SVG

*For any* social component model configuration (any combination of `socialItems`, `iconStyle`, `iconShape`, `iconSize`, `align`, `linkColor`, `spacing`), the HTML string returned by `renderSocialLinks()` must not contain the substring `<svg`.

**Validates: Requirements 2.1**

---

### Property 4: Social icons render as `<img>` tags with alt text

*For any* social component model with one or more `socialItems`, the HTML returned by `renderSocialLinks()` must contain an `<img>` element for each item, and each `<img>` must have a non-empty `alt` attribute containing the social network name.

**Validates: Requirements 2.2, 2.3**

---

### Property 5: Social icon configuration is preserved in rendered output

*For any* valid social component configuration, the rendered HTML must reflect the specified `iconSize` (as `width` and `height` attributes on `<img>`), the specified `align` (as the `align` attribute on the outer table), and the specified `spacing` (as `padding-left` on icon cells after the first).

**Validates: Requirements 2.5, 2.6**

---

### Property 6: Saving any valid template name persists a complete entry

*For any* non-empty, non-whitespace template name, after the save flow completes, `localStorage.getItem(SAVED_TEMPLATES_KEY)` must parse to an array containing an entry with `name` equal to the submitted name, and with non-null `projectData`, `html`, `css`, `bodySettings`, `id`, and `createdAt` fields.

**Validates: Requirements 3.3**

---

### Property 7: Whitespace-only template names are rejected

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), submitting it as a template name must not add any entry to localStorage, and the save modal must remain open with a visible validation error.

**Validates: Requirements 3.4**

---

### Property 8: All saved templates appear in the Templates modal

*For any* array of saved templates stored in localStorage, calling `renderTemplateGrid()` must produce DOM cards for every saved template in the "My Templates" section, with each card displaying the template name.

**Validates: Requirements 3.6**

---

### Property 9: Loading a saved template restores body settings

*For any* saved template entry with a `bodySettings` object, loading that template must result in `state.bodySettings` being equal to the stored `bodySettings` values.

**Validates: Requirements 3.8**

---

### Property 10: Deleting a saved template removes it from localStorage and the modal

*For any* saved template in localStorage, after the delete action is triggered for that template, the template must no longer appear in `getSavedTemplates()` and `renderTemplateGrid()` must not produce a card for it.

**Validates: Requirements 3.10**

---

### Property 11: localStorage errors during save/load are handled gracefully

*For any* localStorage operation (save or load) that throws an error, the application must display an error toast message and must not throw an uncaught exception.

**Validates: Requirements 3.12, 3.13**

---

## Error Handling

### Social Icon CDN Unavailability

If the Icons8 CDN is unreachable, `<img>` tags will fail to load but the `alt` attribute ensures the social network name remains visible as text — satisfying Requirement 2.4. No JavaScript error handling is needed since this is a browser-native `<img>` fallback.

**Design decision:** The `alt` attribute is the primary fallback mechanism. No `onerror` handler is added to avoid inline JavaScript in email HTML (which is stripped by most clients anyway).

### localStorage Errors

All localStorage reads and writes are wrapped in `try/catch`. The pattern used throughout the existing codebase (e.g., `getSavedTestEmailRecipient`) is followed:

```js
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
    throw e; // re-throw so the caller can show an error toast
  }
};
```

The save flow catches the re-thrown error and calls `showToast('Could not save template.')`. The load flow catches errors from `JSON.parse` or `loadProjectData` and calls `showToast('Could not load that template.')`.

### Template Name Validation

Validation is performed client-side before any localStorage write:

```js
const name = shell.saveTemplateInput.value.trim();
if (!name) {
  // Show inline error, do not save
  shell.saveTemplateFeedback.textContent = 'Please enter a template name.';
  shell.saveTemplateFeedback.classList.add('is-visible');
  return;
}
```

### Corrupt localStorage Data

If `JSON.parse` fails on the saved templates array (e.g., corrupted data), `getSavedTemplates()` returns `[]` silently. This means corrupt data is effectively ignored rather than crashing the modal.

---

## Testing Strategy

### Unit Tests

Unit tests cover specific examples and edge cases:

- **Professional template structure**: Assert the template object has the required component types and no SVG in its export output.
- **Social icon map completeness**: Assert `socialIconPngMap` has entries for all 8 required networks.
- **Save Template modal UI**: Assert the button exists in the appbar and the modal contains a name input.
- **Empty template name rejection**: Assert submitting an empty name shows an error and does not write to localStorage.
- **No saved templates — no section heading**: Assert the "My Templates" heading is absent when localStorage has no saved templates.
- **Saved template card has delete button**: Assert each saved template card contains a `×` delete control.

### Property-Based Tests

Property-based tests use [fast-check](https://github.com/dubzzz/fast-check) (already a common choice in JS ecosystems; no existing test framework was found in the project, so fast-check with a simple Node.js test runner is recommended).

Each property test runs a minimum of **100 iterations**.

**Tag format:** `// Feature: email-template-social-save, Property N: <property text>`

| Property | Generator | Assertion |
|---|---|---|
| P1: Professional template uses only registered types | — (static check) | All `type` values in `professional.components` are in the registered set |
| P2: Professional template export is SVG-free | — (static check) | `buildProductionHtml()` output does not contain `<svg` |
| P3: Social rendering produces no SVG | `fc.record({ socialItems: fc.array(socialItemArb), iconStyle: fc.constantFrom(...), iconShape: fc.constantFrom(...), iconSize: fc.integer({min:16, max:64}), align: fc.constantFrom('left','center','right'), linkColor: fc.hexColor(), spacing: fc.integer({min:0, max:30}) })` | Output does not contain `<svg` |
| P4: Social icons have `<img>` with alt text | Same as P3 | Each item produces an `<img alt="NetworkName">` |
| P5: Social icon config preserved in output | Same as P3 | `width="${iconSize}"`, `height="${iconSize}"`, `align="${align}"` present |
| P6: Valid name saves complete entry | `fc.string({minLength:1}).filter(s => s.trim().length > 0)` | localStorage entry has all required fields |
| P7: Whitespace names rejected | `fc.stringOf(fc.constantFrom(' ', '\t', '\n'))` | No localStorage write, modal stays open |
| P8: All saved templates appear in modal | `fc.array(savedTemplateArb, {minLength:1, maxLength:10})` | DOM contains a card for each template |
| P9: Loading restores body settings | `fc.record({ bodySettings: bodySettingsArb, ... })` | `state.bodySettings` equals stored values |
| P10: Delete removes from localStorage and modal | `fc.array(savedTemplateArb, {minLength:1})` + pick random index | Entry absent from storage and DOM after delete |
| P11: localStorage errors handled gracefully | Mock `localStorage.setItem`/`getItem` to throw | Toast shown, no uncaught exception |

### Integration / Manual Tests

- **Email client rendering**: Send a test email with the social component and verify icons are visible in Gmail, Outlook 2016+, Apple Mail, and Yahoo Mail.
- **Canvas preview**: Verify social icons render correctly in the GrapesJS canvas after the SVG→PNG change.
- **Mobile preview**: Verify the Professional template renders in a single-column layout at 360px.
- **localStorage quota**: Verify behavior when localStorage is full (quota exceeded error).
