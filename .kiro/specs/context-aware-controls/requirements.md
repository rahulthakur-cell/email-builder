# Requirements Document

## Introduction

This feature addresses three related improvements to the GrapesJS email builder's right-panel control system in `minimal-builder-plugin.js`:

1. **Table cell component detection fix** — The `email-table-cell` component's `isComponent` check currently matches every `<td>` and `<th>` element in the canvas, including layout columns (`responsive-td`). This causes table-specific traits (Add Row, Add Column, Colspan, Rowspan) to appear when a layout column is selected, which is incorrect.

2. **Context-based right panel controls** — The right panel must show only the traits that are relevant to the selected component type, with no cross-contamination between table cells and layout columns.

3. **Paragraph formatting toggle** — The `email-paragraph` component gains a "Keep Formatting / Remove Formatting" toggle that lets users strip HTML tags from pasted rich text, keeping only plain text.

---

## Glossary

- **Builder**: The GrapesJS-based email builder defined in `minimal-builder-plugin.js`.
- **Component**: A GrapesJS model registered via `components.addType(...)`.
- **email-table-cell**: The component type representing a `<td>` or `<th>` element that is a direct descendant of an `email-table` structure (i.e., inside `<table class="sb-inner-table">` or a row with `data-gjs-type="email-table-row"`).
- **Layout_Column**: A `<td>` element with `class="responsive-td"` and `data-layout-role="layout-column"`, used as a droppable column in the layout grid. It is NOT an `email-table-cell`.
- **Right_Panel**: The GrapesJS trait manager panel rendered in `#builder-traits`, which displays the traits of the currently selected component.
- **Table_Traits**: The set of traits specific to `email-table-cell`: Grid Actions (`table-cell-actions`), Colspan, Rowspan, horizontal alignment, vertical alignment, background color, and padding.
- **Layout_Traits**: The style properties shown for a Layout_Column: padding, margin, background, and alignment — surfaced through the GrapesJS style manager, not the trait manager.
- **isComponent**: The GrapesJS hook on a component type that determines whether a parsed DOM element should be assigned that component type.
- **email-paragraph**: The component type representing a paragraph text block (`div.sb-paragraph`).
- **paragraphText**: The `email-paragraph` model property holding the paragraph's HTML content.
- **Formatting_Toggle**: A new trait on `email-paragraph` that switches between "Keep Formatting" and "Remove Formatting" modes.
- **Plain_Text**: The text content of `paragraphText` with all HTML tags stripped, preserving only character data.

---

## Requirements

### Requirement 1: Narrow `email-table-cell` Component Detection

**User Story:** As a content editor, I want table-specific controls to appear only when I select a real table cell, so that I do not see irrelevant table actions when I click a layout column.

#### Acceptance Criteria

1. WHEN the Builder parses a `<td>` or `<th>` element that has `class="responsive-td"`, THE `email-table-cell` `isComponent` SHALL return `false` for that element.

2. WHEN the Builder parses a `<td>` or `<th>` element that does NOT have `class="responsive-td"` and is a descendant of a `<table>` element with `class="sb-inner-table"`, THE `email-table-cell` `isComponent` SHALL return `{ type: 'email-table-cell' }` for that element.

3. WHEN the Builder parses a `<td>` or `<th>` element that does NOT have `class="responsive-td"` and has an ancestor element with `data-gjs-type="email-table-row"`, THE `email-table-cell` `isComponent` SHALL return `{ type: 'email-table-cell' }` for that element.

4. WHEN the Builder parses a `<td>` or `<th>` element that does NOT satisfy any of the conditions in criteria 2 or 3, THE `email-table-cell` `isComponent` SHALL return `false` for that element.

5. THE `email-table-cell` `isComponent` SHALL NOT modify the component type of any element that already carries a `data-gjs-type` attribute with a value other than `email-table-cell`.

---

### Requirement 2: Table Cell Right Panel Shows Only Table Traits

**User Story:** As a content editor, I want the right panel to show table-specific controls (grid actions, colspan, rowspan, cell alignment) only when I select a table cell, so that I can manage table structure without distraction.

#### Acceptance Criteria

1. WHEN an `email-table-cell` component is selected, THE Right_Panel SHALL display the Table_Traits: Grid Actions, Colspan, Rowspan, horizontal alignment, vertical alignment, background color, and padding.

2. WHEN an `email-table-cell` component is selected, THE Right_Panel SHALL NOT display Layout_Traits (padding/margin/background controls sourced from the layout style manager sector).

3. WHILE an `email-table-cell` component remains selected, THE Right_Panel SHALL keep the Table_Traits visible without resetting between user interactions.

4. IF a user selects a different component type after selecting an `email-table-cell`, THEN THE Right_Panel SHALL replace the Table_Traits with the traits appropriate to the newly selected component type.

---

### Requirement 3: Layout Column Right Panel Shows Only Layout Traits

**User Story:** As a content editor, I want the right panel to show only layout and style controls when I select a layout column, so that I do not accidentally trigger table row/column operations on a layout column.

#### Acceptance Criteria

1. WHEN a Layout_Column is selected, THE Right_Panel SHALL NOT display any Table_Traits (Grid Actions, Colspan, Rowspan, horizontal alignment, vertical alignment controls from the `email-table-cell` trait set).

2. WHEN a Layout_Column is selected, THE Right_Panel SHALL display only the style properties applicable to a layout column: padding, margin, background color, and alignment.

3. WHEN a Layout_Column is selected, THE Builder SHALL NOT register the Layout_Column as an `email-table-cell` component type.

4. IF a user selects a Layout_Column that was previously misidentified as an `email-table-cell`, THEN THE Builder SHALL re-evaluate the component type using the corrected `isComponent` logic and assign the correct type.

---

### Requirement 4: Paragraph Formatting Toggle

**User Story:** As a content editor, I want a formatting toggle on the paragraph block so that I can strip HTML tags from pasted rich text and keep only plain text when needed.

#### Acceptance Criteria

1. THE `email-paragraph` component SHALL include a Formatting_Toggle trait with two options: "Keep Formatting" and "Remove Formatting".

2. WHEN the Formatting_Toggle is set to "Keep Formatting", THE `email-paragraph` component SHALL render `paragraphText` as-is, preserving all existing HTML markup.

3. WHEN the Formatting_Toggle is set to "Remove Formatting", THE `email-paragraph` component SHALL strip all HTML tags from `paragraphText` and render only the resulting Plain_Text.

4. WHEN the Formatting_Toggle is changed from "Keep Formatting" to "Remove Formatting", THE `email-paragraph` component SHALL update the rendered output immediately without requiring a page reload.

5. WHEN the Formatting_Toggle is changed from "Remove Formatting" to "Keep Formatting", THE `email-paragraph` component SHALL restore rendering of the current `paragraphText` value as-is, without re-applying any previously stripped tags.

6. IF `paragraphText` contains no HTML tags, THEN THE `email-paragraph` component SHALL render the same output regardless of the Formatting_Toggle value.

7. THE Formatting_Toggle SHALL default to "Keep Formatting" for all new and existing `email-paragraph` components.

8. WHEN the Formatting_Toggle is set to "Remove Formatting", THE `email-paragraph` component SHALL preserve whitespace and line breaks that are represented as plain text characters, stripping only HTML element tags and their attributes.
