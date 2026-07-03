# Design Document: Context-Aware Controls

## Overview

This feature fixes two related issues in `grapesjs/packages/core/minimal-builder-plugin.js`:

1. **`email-table-cell` `isComponent` over-matching** — The current implementation matches every `<td>` and `<th>` in the canvas, including layout columns (`class="responsive-td"`). This causes table-specific traits (Grid Actions, Colspan, Rowspan, etc.) to appear in the right panel when a layout column is selected.

2. **Paragraph formatting toggle** — The `email-paragraph` component gains a `formattingMode` trait that lets users strip HTML tags from `paragraphText` at render time, keeping the original value intact for round-trip safety.

Both changes are isolated to a single file. No new files, no new dependencies.

---

## Architecture

The builder is a self-contained IIFE in `minimal-builder-plugin.js`. All component types are registered via `components.addType(...)`. The relevant extension points are:

- **`isComponent(el)`** — a static hook called during DOM parsing to assign a component type to a parsed element. Returning `false` means "not this type"; returning `{ type: 'foo' }` assigns the type.
- **`model.defaults`** — the component's default properties, including `traits` (right-panel controls) and named props.
- **`bindRenderer(model, propNames, renderFn)`** — a helper that calls `renderFn(model)` immediately and re-calls it whenever any of the listed props change. This drives reactive re-rendering.
- **`renderParagraphBlock(model)`** — the pure render function for `email-paragraph`. It reads model props and returns an HTML string.

```
┌─────────────────────────────────────────────────────────────┐
│                  minimal-builder-plugin.js                  │
│                                                             │
│  isComponent(el)          ← Fix 1: narrow TD/TH matching   │
│  renderParagraphBlock(m)  ← Fix 2: formattingMode branch   │
│  email-paragraph defaults ← Fix 2: add trait + default     │
│  email-paragraph init()   ← Fix 2: add to bindRenderer     │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Fix 1: `email-table-cell` `isComponent`

**Current behavior:**
```js
isComponent(el) {
  if (el.tagName === 'TD' || el.tagName === 'TH') {
    return { type: 'email-table-cell' };
  }
  return false;
}
```
This matches all `<td>` and `<th>` elements unconditionally.

**New behavior:**
```js
isComponent(el) {
  if (el.tagName !== 'TD' && el.tagName !== 'TH') return false;
  // Exclude layout columns by class
  if (el.classList && el.classList.contains('responsive-td')) return false;
  // Exclude layout columns by data attribute
  if (el.dataset && el.dataset.layoutRole === 'layout-column') return false;
  // Only match cells inside email-table structures
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
}
```

**Decision rationale:**
- Exclusion checks come first (fast path for layout columns).
- Ancestor traversal is used rather than a single-level parent check because the DOM nesting depth between a `<td>` and its `<table class="sb-inner-table">` ancestor can vary (e.g., `tbody` in between).
- Two ancestor markers are checked: `sb-inner-table` class (structural) and `data-gjs-type="email-table-row"` (semantic). Either is sufficient.
- Elements with `data-gjs-type` set to another value are not affected — GrapesJS applies `data-gjs-type` attributes before calling `isComponent` only for elements that don't already have an explicit type assignment, so the framework handles that case at a higher level.

### Fix 2: `email-paragraph` Formatting Toggle

**New trait added to `email-paragraph` defaults:**
```js
{
  type: 'select',
  name: 'formattingMode',
  label: 'Formatting',
  changeProp: true,
  options: [
    { id: 'keep', name: 'Keep Formatting' },
    { id: 'remove', name: 'Remove Formatting' },
  ],
}
```

Inserted between the `paragraphText` textarea and the `align` select, so the trait order in the panel is: Text → Formatting → Align.

**New default value:**
```js
formattingMode: 'keep',
```

**Updated `bindRenderer` call:**
```js
bindRenderer(this, ['paragraphText', 'align', 'formattingMode'], renderParagraphBlock);
```

**Updated `renderParagraphBlock`:**
```js
const renderParagraphBlock = (model) => {
  const align = normalizeAlign(model.get('align') || model.getStyle?.()?.['text-align'], 'left');
  let text = model.get('paragraphText') || 'Add your supporting copy here...';
  if (model.get('formattingMode') === 'remove') {
    text = text
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
  const inner = `<p style="margin:0; font-size:15px; line-height:inherit; color:inherit; font-family:inherit; text-align:${align}; font-weight:inherit;">${text}</p>`;
  return renderSectionShell(inner, { background: 'transparent', align, textAlign: align });
};
```

**Decision rationale:**
- Stripping is done at render time, not stored. The original `paragraphText` is always preserved, so switching back to "Keep Formatting" restores the full HTML without any data loss.
- The regex `/<[^>]+>/g` strips all HTML tags. HTML entities (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`) are decoded to their plain-text equivalents so the rendered output reads naturally.
- Defaulting to `'keep'` means zero behavior change for existing paragraphs.
- `formattingMode` is added to `bindRenderer`'s prop list so the canvas re-renders immediately when the trait is changed.

---

## Data Models

### `email-table-cell` — no model changes

The `isComponent` fix is a static method change only. The model `defaults`, `init`, and sync methods are unchanged.

### `email-paragraph` — model additions

| Property | Type | Default | Description |
|---|---|---|---|
| `formattingMode` | `string` | `'keep'` | Controls whether HTML tags are stripped at render time. Values: `'keep'` \| `'remove'`. |

The `paragraphText` property is unchanged — it always stores the raw value (potentially with HTML markup).

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Layout columns are excluded from `email-table-cell`

*For any* `<td>` or `<th>` element that has `class="responsive-td"`, the `email-table-cell` `isComponent` function SHALL return `false`.

**Validates: Requirements 1.1, 3.3**

---

### Property 2: Cells inside `sb-inner-table` are matched

*For any* `<td>` or `<th>` element (without `class="responsive-td"`) that has an ancestor element with `class="sb-inner-table"`, the `email-table-cell` `isComponent` function SHALL return `{ type: 'email-table-cell' }`.

**Validates: Requirements 1.2**

---

### Property 3: Cells inside `email-table-row` ancestors are matched

*For any* `<td>` or `<th>` element (without `class="responsive-td"`) that has an ancestor element with `data-gjs-type="email-table-row"`, the `email-table-cell` `isComponent` function SHALL return `{ type: 'email-table-cell' }`.

**Validates: Requirements 1.3**

---

### Property 4: Unqualified cells are not matched

*For any* `<td>` or `<th>` element that has no qualifying ancestor (`sb-inner-table` or `email-table-row`) and does not have `class="responsive-td"`, the `email-table-cell` `isComponent` function SHALL return `false`.

**Validates: Requirements 1.4**

---

### Property 5: Keep Formatting preserves paragraphText

*For any* `paragraphText` value (including values containing HTML markup), when `formattingMode` is `'keep'`, the output of `renderParagraphBlock` SHALL contain the original `paragraphText` value unchanged.

**Validates: Requirements 4.2**

---

### Property 6: Remove Formatting strips all HTML tags

*For any* `paragraphText` value containing HTML tags, when `formattingMode` is `'remove'`, the output of `renderParagraphBlock` SHALL contain no HTML tags from the original `paragraphText` (only the wrapping `<p>` tag from the render function itself is present).

**Validates: Requirements 4.3, 4.8**

---

### Property 7: Plain text is unaffected by formattingMode

*For any* `paragraphText` value that contains no HTML tags, the output of `renderParagraphBlock` SHALL be identical regardless of whether `formattingMode` is `'keep'` or `'remove'`.

**Validates: Requirements 4.6**

---

### Property 8: Formatting toggle is a render-time operation (round-trip safety)

*For any* `paragraphText` value with HTML markup, rendering with `formattingMode='keep'` after previously rendering with `formattingMode='remove'` SHALL produce the same output as rendering with `formattingMode='keep'` from the start — the original `paragraphText` is never mutated.

**Validates: Requirements 4.5**

---

**Property Reflection:**

- Properties 2 and 3 are distinct (different ancestor markers) and cannot be merged — each validates a separate acceptance criterion.
- Properties 5 and 8 overlap slightly: Property 8 is the round-trip formulation of Property 5's guarantee. Property 8 is kept because it explicitly validates the non-mutation design decision (Requirement 4.5), while Property 5 validates the basic keep-mode behavior (Requirement 4.2).
- Properties 1 and 4 are complementary (positive and negative cases for the exclusion logic) and both are needed.
- Property 7 (plain text invariant) is not subsumed by Properties 5 or 6 — it tests the boundary where both modes should produce identical output.

---

## Error Handling

### `isComponent` traversal

- If `el.parentElement` is `null` (element is detached from DOM), the `while` loop exits cleanly and returns `false`. No null-pointer risk.
- If `el.classList` or `el.dataset` is undefined (non-standard element), the `&&` short-circuit prevents property access errors.

### `renderParagraphBlock` stripping

- If `paragraphText` is `undefined` or empty, the fallback string `'Add your supporting copy here...'` is used before stripping is attempted.
- The regex `/<[^>]+>/g` is safe for all inputs — it does not use lookaheads or backreferences that could cause catastrophic backtracking on typical email copy.
- HTML entity decoding covers the four most common entities (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`). Other entities (e.g., `&mdash;`) are left as-is, which is acceptable for email copy.

---

## Testing Strategy

### Unit Tests

Unit tests verify specific examples and edge cases for the two pure functions: `isComponent` and `renderParagraphBlock`.

**`isComponent` unit tests:**
- `<td class="responsive-td">` → returns `false`
- `<th class="responsive-td">` → returns `false`
- `<td>` inside `<table class="sb-inner-table">` → returns `{ type: 'email-table-cell' }`
- `<td>` inside `<tr data-gjs-type="email-table-row">` → returns `{ type: 'email-table-cell' }`
- `<td>` with no qualifying ancestor → returns `false`
- `<td data-gjs-type="some-other-type">` inside `sb-inner-table` → returns `{ type: 'email-table-cell' }` (GrapesJS handles the override at framework level)

**`renderParagraphBlock` unit tests:**
- `formattingMode='keep'` with plain text → text appears unchanged
- `formattingMode='keep'` with HTML → HTML appears unchanged
- `formattingMode='remove'` with `<b>bold</b>` → renders `bold`
- `formattingMode='remove'` with `&nbsp;` → renders a space
- `formattingMode='remove'` with no HTML → same output as `'keep'`
- Default `formattingMode` is `'keep'`

**Component definition tests:**
- `email-paragraph` defaults contain `formattingMode: 'keep'`
- `email-paragraph` traits include a `formattingMode` select with `'keep'` and `'remove'` options
- `email-table-cell` traits include `table-cell-actions`, `colspan`, `rowspan`, `align`, `valign`, `background-color`, `padding`

### Property-Based Tests

Property-based tests use [fast-check](https://github.com/dubzzz/fast-check) (JavaScript) with a minimum of 100 iterations per property.

Each test is tagged with: `Feature: context-aware-controls, Property N: <property text>`

**Property 1** — Generate `td`/`th` elements with `class="responsive-td"`, verify `isComponent` returns `false`.

**Property 2** — Generate `td`/`th` elements (without `responsive-td`) nested inside a `<table class="sb-inner-table">` at varying depths (1–5 levels), verify `isComponent` returns `{ type: 'email-table-cell' }`.

**Property 3** — Generate `td`/`th` elements (without `responsive-td`) with a `<tr data-gjs-type="email-table-row">` ancestor at varying depths, verify `isComponent` returns `{ type: 'email-table-cell' }`.

**Property 4** — Generate `td`/`th` elements with random ancestor chains that contain neither `sb-inner-table` nor `email-table-row`, verify `isComponent` returns `false`.

**Property 5** — Generate arbitrary `paragraphText` strings (including strings with HTML tags), verify `renderParagraphBlock` output contains the original text when `formattingMode='keep'`.

**Property 6** — Generate `paragraphText` strings containing HTML tags, verify `renderParagraphBlock` output (excluding the wrapping `<p>` tag) contains no `<tag>` patterns when `formattingMode='remove'`.

**Property 7** — Generate plain-text strings (no `<` or `>` characters), verify `renderParagraphBlock` output is identical for `formattingMode='keep'` and `formattingMode='remove'`.

**Property 8** — Generate `paragraphText` strings with HTML, verify that rendering with `'keep'` after rendering with `'remove'` produces the same output as rendering with `'keep'` directly (model mutation check).
