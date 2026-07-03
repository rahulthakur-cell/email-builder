    # Tasks

## Implementation Plan

- [x] 1. Email-Safe Social Icons
  - [x] 1.1 Add `socialIconPngMap` constant to `minimal-builder-plugin.js` with PNG URLs for all 8 required networks (facebook, instagram, linkedin, youtube, x/twitter, tiktok, pinterest, snapchat) plus vimeo
  - [x] 1.2 Implement `getSocialIconImg(name, opts)` function in `minimal-builder-plugin.js` that returns an `<img>` tag with the PNG URL, `width`/`height` attributes set to `iconSize`, `alt` set to the capitalized network name, and `border-radius` derived from `iconShape`
  - [x] 1.3 Update `renderSocialLinks()` in `minimal-builder-plugin.js` to call `getSocialIconImg()` instead of `getSocialIconSvg()`, preserving all existing parameters (`iconSize`, `iconStyle`, `iconShape`, `spacing`, `align`, `linkColor`)
  - [x] 1.4 Verify the canvas preview still renders social icons correctly after the change (manual check)

- [x] 2. Professional Test Email Template
  - [x] 2.1 Add the `professional` entry to the `emailTemplates` object in `minimal-builder-plugin.js` with components: `site-header`, `email-heading`, `email-image`, `email-paragraph`, `email-button`, `email-social`, `site-footer`
  - [x] 2.2 Set sensible default prop values on each component in the Professional template (heading text, image src/alt, paragraph copy, button text, social items with 4 networks, centered alignment)
  - [x] 2.3 Verify the Professional template card appears in the Templates modal and loads correctly via the existing `applyTemplate` flow (manual check)
  - [x] 2.4 Verify that exporting the Professional template via `buildProductionHtml()` produces no `<svg>` elements in the output (depends on task 1 being complete)

- [x] 3. Save Template — Shell (DOM)
  - [x] 3.1 Add the "Save Template" button (`id="btn-save-template"`) to the `.studio-appbar__actions` section in `shell.js`, positioned between the Send Test Email button and the EXPORT button
  - [x] 3.2 Add the Save Template modal (`id="save-template-modal"`) to `shell.js` with: modal dialog, header with title/close button, body with name input (`id="save-template-name"`) and feedback element (`id="save-template-feedback"`), footer with Cancel and Save buttons
  - [x] 3.3 Add the new shell element references to the return object of `renderBuilderShell()`: `saveTemplateModal`, `saveTemplateForm`, `saveTemplateInput`, `saveTemplateFeedback`, `saveTemplateSubmit`

- [x] 4. Save Template — App Logic
  - [x] 4.1 Add the `SAVED_TEMPLATES_KEY` constant (`'grapesjs-email-builder-saved-templates'`) to `app.js`
  - [x] 4.2 Implement `getSavedTemplates()` helper in `app.js` that reads and JSON-parses the localStorage array, returning `[]` on any error
  - [x] 4.3 Implement `setSavedTemplates(templates)` helper in `app.js` that JSON-stringifies and writes the array to localStorage, re-throwing errors so callers can show a toast
  - [x] 4.4 Wire up the "Save Template" button click handler: open the save template modal, clear the name input and feedback
  - [x] 4.5 Wire up the Save Template form submit handler: validate the name (reject empty/whitespace-only with inline error), build the saved template entry (`{ id, name, createdAt, projectData, html, css, bodySettings }`), call `setSavedTemplates`, close modal, show success toast; catch errors and show error toast
  - [x] 4.6 Wire up the Cancel and close (×) button handlers for the Save Template modal
  - [x] 4.7 Update `renderTemplateGrid()` in `app.js` to prepend a "My Templates" section (with section heading and cards) when `getSavedTemplates()` returns a non-empty array; each saved template card must show the template name and a `×` delete button
  - [x] 4.8 Implement the saved template card click handler: call `editor.loadProjectData(template.projectData)`, call `applyBodySettings(template.bodySettings)`, close the modal, show a toast; catch errors and show error toast
  - [x] 4.9 Implement the saved template delete button click handler: filter the template out of the saved templates array, call `setSavedTemplates`, re-render the template grid
  - [x] 4.10 Ensure the "My Templates" section heading is not rendered when there are no saved templates (Requirement 3.14)

- [x] 5. Tests
  - [x] 5.1 Write unit test: assert `socialIconPngMap` contains entries for all 8 required networks (facebook, instagram, linkedin, youtube, x, tiktok, pinterest, snapchat)
  - [x] 5.2 Write unit test: assert the `professional` template entry exists in `emailTemplates` and contains component entries for all 7 required types
  - [x] 5.3 Write unit test: assert the Save Template button exists in the appbar HTML between the test email and export buttons
  - [x] 5.4 Write unit test: assert submitting an empty/whitespace name does not write to localStorage and shows a validation error
  - [x] 5.5 Write unit test: assert the Templates modal does not render a "My Templates" heading when localStorage has no saved templates
  - [x] 5.6 Write property test (P3): for any social component configuration, `renderSocialLinks()` output must not contain `<svg` — Feature: email-template-social-save, Property 3
  - [x] 5.7 Write property test (P4): for any social component with one or more items, each item produces an `<img>` with a non-empty `alt` attribute — Feature: email-template-social-save, Property 4
  - [x] 5.8 Write property test (P5): for any social component configuration, the rendered output reflects `iconSize` as `width`/`height` attributes and `align` as the table `align` attribute — Feature: email-template-social-save, Property 5
  - [x] 5.9 Write property test (P6): for any valid (non-empty, non-whitespace) template name, after saving, localStorage contains a complete entry with all required fields — Feature: email-template-social-save, Property 6
  - [x] 5.10 Write property test (P7): for any whitespace-only string, submitting it as a template name does not write to localStorage — Feature: email-template-social-save, Property 7
  - [x] 5.11 Write property test (P8): for any non-empty array of saved templates in localStorage, `renderTemplateGrid()` produces a card for each template in the "My Templates" section — Feature: email-template-social-save, Property 8
  - [x] 5.12 Write property test (P9): for any saved template with a `bodySettings` object, loading it results in `state.bodySettings` matching the stored values — Feature: email-template-social-save, Property 9
  - [x] 5.13 Write property test (P10): for any saved template, after deletion, it is absent from `getSavedTemplates()` and from the rendered modal — Feature: email-template-social-save, Property 10
  - [x] 5.14 Write property test (P11): when localStorage throws during save or load, the application shows an error toast and does not propagate an uncaught exception — Feature: email-template-social-save, Property 11
