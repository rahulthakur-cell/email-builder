# Match Unlayer Studio — End-to-End Email Builder

Redesign the existing GrapesJS email builder shell to **exactly replicate** the Unlayer Studio layout, tabs, component grid, blocks panel, body settings, images panel, and canvas behavior.

## Unlayer Reference Screenshots

````carousel
![Unlayer Content Tab — 3×4 grid of square tiles: Columns, Button, Divider, Heading, Paragraph, Image, Video, Social, Menu, HTML, Table, Timer](C:\Users\RAHUL\.gemini\antigravity\brain\fab0987e-924c-4f98-a698-d754fdd865f0\.system_generated\click_feedback\click_feedback_1777705534649.png)
<!-- slide -->
![Unlayer Blocks Tab — Column layout structures: 100%, 50|50, 33|33|33, 25×4, 33|66, 66|33, etc.](C:\Users\RAHUL\.gemini\antigravity\brain\fab0987e-924c-4f98-a698-d754fdd865f0\.system_generated\click_feedback\click_feedback_1777705574013.png)
<!-- slide -->
![Unlayer Body Tab — General settings: Text Color, Background Color, Content Width, Content Alignment, Font Family, Font Weight](C:\Users\RAHUL\.gemini\antigravity\brain\fab0987e-924c-4f98-a698-d754fdd865f0\.system_generated\click_feedback\click_feedback_1777705684097.png)
````

---

## Gap Analysis: Current vs Unlayer

| Area | Unlayer | Current | Gap |
|---|---|---|---|
| **Content Tab** | 12 tiles in 3-col grid (Columns, Button, Divider, Heading, Paragraph, Image, Video, Social, Menu, HTML, Table, Timer) | 15 items split across content/merge groups; Columns block missing from content grid | Need to match exact 12-item set, add Columns as first item |
| **Blocks Tab** | "Blank" heading → 8 column-layout cards stacked vertically with visual structure preview | 5 layout presets only; missing 25×4 and 25\|50\|25 | Need 8 layout presets matching Unlayer exactly |
| **Body Tab** | Clean form: Text Color, Background Color, Content Width (with px/stepper), Content Alignment (left/center toggle), Font Family, Font Weight, Preheader Text, Links Color | 7 custom fields (canvas bg, email bg, width, font, link color, outer padding, section gap) — different field set | Must match Unlayer's exact field list and layout |
| **Images Tab** | Upload drop-zone, search bar for stock images, image grid | URL input + upload button + asset cards — no drop-zone, no search | Redesign to match Unlayer pattern |
| **Right Panel** | When component selected → properties panel with collapsible sections (Content tab / Design tab at top). When nothing selected → shows Content/Blocks tab | Complex split-dock mode, forceContentView flag | Simplify to match Unlayer's direct behavior |
| **Sidebar Rail** | Narrow right rail (~48px) with 4 icon+label buttons: Content, Blocks, Body, Images | 78px rail, same 4 buttons | Reduce width, match Unlayer styling |
| **Canvas** | Light gray checkerboard, "No content here. Drag content from right." in dashed blue box | Similar but with custom canvas fills | Match exact empty-state message |
| **Toolbar** | Undo/Redo (left), Desktop/Mobile (center), Preview eye (right) — clean, minimal cells | Same structure but thicker cells (80px×64px) | Fine-tune sizing |

---

## Proposed Changes

### Phase 1: Sidebar Restructure & Tab System

#### [MODIFY] [shell.js](file:///d:/grapesjs/grapesjs/packages/core/email-builder/shell.js)

Complete restructure of the right-side panel to match Unlayer:

1. **Content Tab Panel** — flat 3-column grid of 12 component tiles (matching Unlayer exactly):
   - Row 1: Columns, Button, Divider
   - Row 2: Heading, Paragraph, Image
   - Row 3: Video, Social, Menu
   - Row 4: HTML, Table, Timer
   - Each tile: ~100px tall, icon centered above label, light border, hover effect

2. **Blocks Tab Panel** — "Blank" heading → 8 stacked column-layout cards:
   - 100% (full width)
   - 50% | 50%
   - 33% | 33% | 33%
   - 25% | 25% | 25% | 25%
   - 33% | 66%
   - 66% | 33%
   - 25% | 50% | 25%
   - 25% | 25% | 50%

3. **Body Tab Panel** — clean form matching Unlayer's "General" section:
   - Text Color (color picker)
   - Background Color (color picker)
   - Content Width (number input with px label + stepper buttons)
   - Content Alignment (Left / Center toggle buttons)
   - Font Family (dropdown)
   - Font Weight (dropdown: Regular/Bold/etc.)
   - Preheader Text (text input)
   - Links Color (color picker)

4. **Images Tab Panel** — redesigned:
   - Upload drop-zone (dashed border area, "Drop files here or click to upload")
   - Search bar for filtering images
   - Image grid

5. **Selection Panel** — when a component is selected, the panel content area switches to show:
   - Component name + close/back button
   - Content tab and Design tab sub-tabs
   - Collapsible property sections

6. **Sidebar Rail** — reduce to ~48px, match Unlayer icon sizing

---

#### [MODIFY] [app.js](file:///d:/grapesjs/grapesjs/packages/core/email-builder/app.js)

1. **Simplify dock mode logic** — remove `forceContentView`, `selection-split` mode. Match Unlayer's simpler behavior:
   - When nothing selected → show active tab (Content/Blocks/Body/Images)
   - When component selected → show component properties (with back arrow to return)
2. **Update content element IDs** to match Unlayer's 12 items (reorder, add 'columns' to content list)
3. **Update layout preset IDs** to include all 8 Unlayer layout structures
4. **Update body settings** to match Unlayer fields (text color, content alignment, font weight, preheader text)

---

### Phase 2: Styling Overhaul

#### [MODIFY] [styles.css](file:///d:/grapesjs/grapesjs/packages/core/email-builder/styles.css)

1. **Rail width** — reduce `--studio-rail-width: 48px`
2. **Dock width** — adjust to `~300px` to match Unlayer's narrower panel
3. **Content grid** — update to 3-column grid with ~100px tall tiles, clean borders
4. **Block cards** — horizontal layout-preview cards with gray column visualizations
5. **Body form** — horizontal label/input rows matching Unlayer's General section
6. **Images panel** — upload drop-zone + search + grid styling
7. **Selection/properties** — collapsible sections with clean separators
8. **Color tokens** — match Unlayer's palette (white panels, light gray borders #E0E0E0, primary blue #0091FF)
9. **Toolbar** — thinner cells matching Unlayer

---

### Phase 3: Plugin Updates  

#### [MODIFY] [minimal-builder-plugin.js](file:///d:/grapesjs/grapesjs/packages/core/minimal-builder-plugin.js)

1. **Add missing layout blocks** — `section-1-4` already exists, add `section-25-50-25` and `section-25-25-50`
2. **Update block icons** — match Unlayer's simple monochrome icon style (not the colored badge icons)
3. **Update content block order** — reorder to match Unlayer exactly
4. **Remove merge-tag blocks** from content grid (keep them as internal types, just not in the main content tab)

---

### Phase 4: Config Updates

#### [MODIFY] [config.js](file:///d:/grapesjs/grapesjs/packages/core/email-builder/config.js)

1. **Update `defaultBodyStyles`** — add `textColor`, `contentAlignment`, `fontWeight`, `preheaderText`
2. **Update `bodySelectors`** if needed for new settings

---

## User Review Required

> [!IMPORTANT]
> **Merge Tags Removal**: Unlayer's Content tab has exactly 12 items. Currently we have 3 merge tag blocks (Name, Email, Unsubscribe). Should these be:
> - (A) Removed entirely from the Content grid to match Unlayer exactly
> - (B) Kept but moved to a separate "Merge Tags" sub-section or dropdown
>
> I recommend (A) — remove from the content grid, keep them as registered blocks that can be accessed via search only.

> [!IMPORTANT]
> **Template Sections**: Currently there are ~10 "section" blocks (Header, Hero, Products, FAQ, etc.). These don't exist in Unlayer's standard editor. Should we:
> - (A) Remove them entirely
> - (B) Move them to a separate "Saved" or "Custom Blocks" sub-section in the Blocks tab
>
> I recommend (A) for now, to exactly match Unlayer's interface.

> [!IMPORTANT]
> **"Columns" Block in Content Tab**: In Unlayer, the very first item in the Content tab is "Columns" which opens a column-layout picker. Should clicking it:
> - (A) Directly insert a 2-column layout (simple behavior)
> - (B) Show a dropdown/popover to choose column configuration (closer to Unlayer behavior)
>
> I recommend (A) initially, with the Blocks tab providing the full layout picker.

## Open Questions

> [!NOTE]
> **Preheader Text**: Unlayer's Body tab includes a "Preheader Text" field. This is an email-specific hidden text that appears in inbox previews. Should we:
> 1. Store it in the editor state and include it in the exported HTML as a hidden `<span>` in the `<body>`?
> 2. Or treat it as a simple metadata field?

---

## Verification Plan

### Automated Tests
1. Build the project: `pnpm start` → verify no console errors
2. Browser test: Open the builder, verify 4 tabs work correctly
3. Verify Content tab shows exactly 12 tiles in 3-col grid
4. Verify Blocks tab shows 8 layout structures
5. Verify Body tab shows all settings with proper controls
6. Verify component selection shows properties panel
7. Verify drag-and-drop works for all components

### Manual Verification
- Side-by-side comparison with Unlayer Studio
- Take screenshots and compare layout, spacing, colors
- Test all component drag-and-drop flows
- Verify email HTML export still works correctly
