# Requirements Document

## Introduction

This feature adds a non-intrusive formatting confirmation popup to the GrapesJS email builder. When a user pastes text into a Paragraph component — either by editing inline on the canvas or via the `paragraphText` textarea in the right-panel trait manager — the Popup presents two choices: **Keep Formatting** (preserve inline styles, colors, links) or **Remove Formatting** (strip to clean plain text). The popup appears only when the pasted content contains HTML formatting, fires once per paste action, and dismisses immediately after the user makes a choice. If the user dismisses without choosing, the pasted content is kept as-is (equivalent to Keep Formatting).

## Glossary

- **Popup**: The small, non-modal overlay rendered in the main document that presents the Keep / Remove formatting choice to the user.
- **Paste_Detector**: The module responsible for listening to `paste` events on both the canvas iframe and the right-panel textarea, determining whether the pasted content contains HTML formatting, and triggering the Popup.
- **Formatting_Applier**: The module responsible for applying the user's formatting choice to the selected Paragraph component model and triggering a re-render.
- **Paragraph_Component**: A GrapesJS component of type `email-paragraph` that holds a `paragraphText` trait and a `formattingMode` trait.
- **Canvas_Window**: The `contentWindow` of the GrapesJS iframe, which hosts inline editing events.
- **Right_Panel_Textarea**: The `<textarea>` rendered by the GrapesJS trait manager for the `paragraphText` trait of the selected Paragraph_Component.
- **formattingMode**: A trait on the Paragraph_Component model with values `keep` or `remove` that controls how `renderParagraphBlock` renders the component's text.
- **HTML Formatting**: The presence of any HTML tags (e.g., `<b>`, `<span>`, `<a>`, `<font>`) or inline style attributes in the pasted clipboard content.
- **Plain Text Paste**: A paste event whose clipboard data contains no HTML tags or inline style attributes — only raw text characters.

---

## Requirements

### Requirement 1: Detect Paste Events on the Canvas

**User Story:** As an email builder user, I want the builder to detect when I paste text into a Paragraph component on the canvas, so that I can be offered a formatting choice.

#### Acceptance Criteria

1. WHEN the Canvas_Window fires a `paste` event and a Paragraph_Component is the active inline-editing target, THE Paste_Detector SHALL capture the event.
2. WHEN the Paste_Detector captures a canvas paste event, THE Paste_Detector SHALL read the clipboard data from the event's `clipboardData` object.
3. WHEN the Paste_Detector captures a canvas paste event, THE Paste_Detector SHALL NOT interfere with the default paste behavior before the user makes a formatting choice.
4. IF the Canvas_Window is not available or the GrapesJS iframe has not loaded, THEN THE Paste_Detector SHALL log a warning and take no further action.

---

### Requirement 2: Detect Paste Events on the Right-Panel Textarea

**User Story:** As an email builder user, I want the builder to detect when I paste text into the paragraphText textarea in the right panel, so that I can be offered a formatting choice regardless of where I paste.

#### Acceptance Criteria

1. WHEN the Right_Panel_Textarea fires a `paste` event, THE Paste_Detector SHALL capture the event.
2. WHEN the Paste_Detector captures a right-panel paste event, THE Paste_Detector SHALL read the clipboard data from the event's `clipboardData` object.
3. WHEN the Right_Panel_Textarea is replaced or re-rendered by the GrapesJS trait manager (e.g., on component re-selection), THE Paste_Detector SHALL re-attach the paste listener to the new textarea element.
4. IF no Paragraph_Component is currently selected when a paste event fires on the Right_Panel_Textarea, THEN THE Paste_Detector SHALL take no action.

---

### Requirement 3: Determine Whether Pasted Content Contains HTML Formatting

**User Story:** As an email builder user, I want the popup to appear only when my pasted content actually contains formatting, so that plain text pastes are not interrupted.

#### Acceptance Criteria

1. WHEN the Paste_Detector captures a paste event, THE Paste_Detector SHALL inspect the `text/html` clipboard data type for the presence of HTML tags or inline style attributes.
2. IF the `text/html` clipboard data is absent or contains no HTML tags, THEN THE Paste_Detector SHALL treat the paste as a Plain Text Paste and SHALL NOT show the Popup.
3. IF the `text/html` clipboard data contains one or more HTML tags, THEN THE Paste_Detector SHALL classify the paste as containing HTML Formatting and SHALL proceed to show the Popup.
4. THE Paste_Detector SHALL perform the HTML detection check using a pattern that matches opening HTML tags (e.g., `/<[a-z][^>]*>/i`).

---

### Requirement 4: Show the Formatting Popup

**User Story:** As an email builder user, I want to see a clear, non-intrusive popup after pasting formatted content, so that I can decide how to handle the formatting.

#### Acceptance Criteria

1. WHEN the Paste_Detector determines that pasted content contains HTML Formatting, THE Popup SHALL be rendered and made visible in the main document.
2. THE Popup SHALL display the question "Keep or remove formatting?" along with two action buttons: "Keep Formatting" and "Remove Formatting".
3. THE Popup SHALL be positioned near the top of the viewport or near the Right_Panel_Textarea, so that it does not obscure the canvas content being edited.
4. THE Popup SHALL be rendered in the main document DOM, not inside the Canvas_Window iframe.
5. WHEN the Popup is shown, THE Popup SHALL receive keyboard focus so that keyboard-only users can interact with it.
6. THE Popup SHALL have an accessible role of `dialog` and an `aria-label` of "Paste formatting options".

---

### Requirement 5: Enforce One Popup Per Paste Action

**User Story:** As an email builder user, I want the popup to appear only once per paste action, so that I am not spammed with repeated prompts.

#### Acceptance Criteria

1. WHEN the Popup is already visible, THE Paste_Detector SHALL NOT show a second Popup for any subsequent paste event until the current Popup has been dismissed.
2. WHEN the user makes a formatting choice, THE Popup SHALL be dismissed before any further paste events can trigger a new Popup.
3. THE Paste_Detector SHALL use a boolean guard flag that is set to `true` when the Popup is shown and reset to `false` when the Popup is dismissed.

---

### Requirement 6: Apply "Keep Formatting" Choice

**User Story:** As an email builder user, I want to keep the original formatting of my pasted content, so that links, bold text, and colors are preserved in the email.

#### Acceptance Criteria

1. WHEN the user clicks "Keep Formatting", THE Formatting_Applier SHALL set the `formattingMode` trait on the selected Paragraph_Component model to `keep`.
2. WHEN the user clicks "Keep Formatting", THE Formatting_Applier SHALL update the `paragraphText` trait on the selected Paragraph_Component model with the pasted `text/html` clipboard content.
3. WHEN the Formatting_Applier updates the Paragraph_Component model, THE Paragraph_Component SHALL re-render on the canvas within one animation frame.
4. WHEN the user clicks "Keep Formatting", THE Popup SHALL be dismissed immediately after the model update.

---

### Requirement 7: Apply "Remove Formatting" Choice

**User Story:** As an email builder user, I want to strip formatting from my pasted content, so that the text matches the email's base styles without unwanted inline styles or colors.

#### Acceptance Criteria

1. WHEN the user clicks "Remove Formatting", THE Formatting_Applier SHALL set the `formattingMode` trait on the selected Paragraph_Component model to `remove`.
2. WHEN the user clicks "Remove Formatting", THE Formatting_Applier SHALL update the `paragraphText` trait on the selected Paragraph_Component model with the pasted `text/plain` clipboard content, falling back to the `text/html` content stripped of tags if `text/plain` is unavailable.
3. WHEN the Formatting_Applier updates the Paragraph_Component model, THE Paragraph_Component SHALL re-render on the canvas within one animation frame.
4. WHEN the user clicks "Remove Formatting", THE Popup SHALL be dismissed immediately after the model update.

---

### Requirement 8: Dismiss Without Choosing (Default Behavior)

**User Story:** As an email builder user, I want to be able to dismiss the popup without making a choice, so that the pasted content is kept as-is without any forced transformation.

#### Acceptance Criteria

1. WHEN the user presses the Escape key while the Popup is focused, THE Popup SHALL be dismissed without modifying the Paragraph_Component model.
2. WHEN the user clicks outside the Popup while it is visible, THE Popup SHALL be dismissed without modifying the Paragraph_Component model.
3. WHEN the Popup is dismissed without a choice, THE Formatting_Applier SHALL NOT change the `formattingMode` or `paragraphText` traits on the Paragraph_Component model.
4. WHEN the Popup is dismissed without a choice, the pasted content SHALL remain in the component as if "Keep Formatting" had been the implicit default.

---

### Requirement 9: Popup Lifecycle and Cleanup

**User Story:** As an email builder user, I want the popup to clean up properly after use, so that it does not leave stale event listeners or DOM elements that could cause unexpected behavior.

#### Acceptance Criteria

1. WHEN the Popup is dismissed (by any means), THE Popup SHALL remove itself from the main document DOM.
2. WHEN the Popup is dismissed, THE Paste_Detector SHALL reset its guard flag to allow future paste events to trigger a new Popup.
3. WHEN a different component type (non-Paragraph) is selected and a paste event fires, THE Paste_Detector SHALL NOT show the Popup.
4. WHEN the GrapesJS editor is destroyed or the page is unloaded, THE Paste_Detector SHALL remove all attached paste event listeners from both the Canvas_Window and the main document.

---

### Requirement 10: Accessibility and Visual Design

**User Story:** As an email builder user, I want the popup to be visually consistent with the existing builder UI and accessible to keyboard and screen reader users, so that the experience is seamless and inclusive.

#### Acceptance Criteria

1. THE Popup SHALL use the existing `--studio-*` CSS custom properties for colors, typography, border-radius, and shadow, consistent with the builder's design system.
2. THE Popup SHALL render two buttons styled using the existing `studio-button studio-button--primary` and `studio-button studio-button--secondary` CSS classes.
3. THE Popup SHALL have a maximum width of 320px and SHALL be positioned using `position: fixed` so that it remains visible regardless of canvas scroll position.
4. WHEN the Popup is visible, THE Popup SHALL trap focus within its two action buttons so that Tab and Shift+Tab cycle only between them.
5. THE Popup SHALL include a visible label or heading that is announced by screen readers when the Popup receives focus.
