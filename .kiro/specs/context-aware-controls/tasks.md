# Tasks

## Task List

- [ ] 1. Fix `email-table-cell` `isComponent` to exclude layout columns
  - [x] 1.1 Replace the `isComponent` body in `components.addType('email-table-cell', ...)` with the narrowed implementation that excludes `responsive-td` elements and uses ancestor traversal to match only cells inside `sb-inner-table` or `email-table-row` structures
  - [x] 1.2 Verify the change does not affect the `email-table-row` or `email-table` component definitions

- [x] 2. Add `formattingMode` to `email-paragraph`
  - [x] 2.1 Add `formattingMode: 'keep'` to `email-paragraph` model `defaults`
  - [x] 2.2 Insert the `formattingMode` select trait into the `email-paragraph` traits array (between `paragraphText` and `align`)
  - [x] 2.3 Add `'formattingMode'` to the `bindRenderer` prop list in `email-paragraph` `init()`

- [x] 3. Update `renderParagraphBlock` to handle `formattingMode`
  - [x] 3.1 Add a branch in `renderParagraphBlock` that strips HTML tags, decodes common HTML entities (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`), and trims the result when `model.get('formattingMode') === 'remove'`

- [x] 4. Write property-based tests
  - [x] 4.1 Write Property 1 test: layout columns (`responsive-td`) are excluded by `isComponent`
  - [x] 4.2 Write Property 2 test: cells inside `sb-inner-table` ancestor are matched by `isComponent`
  - [x] 4.3 Write Property 3 test: cells inside `email-table-row` ancestor are matched by `isComponent`
  - [x] 4.4 Write Property 4 test: cells with no qualifying ancestor return `false` from `isComponent`
  - [x] 4.5 Write Property 5 test: `renderParagraphBlock` with `formattingMode='keep'` preserves `paragraphText` unchanged
  - [x] 4.6 Write Property 6 test: `renderParagraphBlock` with `formattingMode='remove'` strips all HTML tags from `paragraphText`
  - [x] 4.7 Write Property 7 test: plain-text `paragraphText` produces identical output for both `formattingMode` values
  - [x] 4.8 Write Property 8 test: `paragraphText` is never mutated — rendering with `'keep'` after `'remove'` produces the same output as `'keep'` from the start

- [x] 5. Write unit/example tests
  - [x] 5.1 Write example tests for `isComponent` edge cases (responsive-td, nested cells, detached elements)
  - [x] 5.2 Write example tests for `renderParagraphBlock` with specific HTML inputs (`<b>`, `<br>`, `&nbsp;`, empty string)
  - [x] 5.3 Write example tests verifying `email-paragraph` defaults (`formattingMode: 'keep'`) and trait definitions
  - [x] 5.4 Write example tests verifying `email-table-cell` trait list contains all required Table_Traits
