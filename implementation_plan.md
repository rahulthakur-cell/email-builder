# Implement Visual Refresh to Match Reference UI

The user wants to completely overhaul the builder's outer UI (the top bar, left panel, and right panel) to match a provided reference image. The reference shows a much cleaner, tabbed layout with custom block icons, grouped settings, and an overall polished aesthetic.

## User Review Required

Please review the following plan to implement the visual refresh. The changes are largely confined to `_index.html` (for layout structure and CSS) and `minimal-builder-plugin.js` (for attaching icons to blocks and structuring the style manager).

> [!IMPORTANT]
> The style manager in GrapesJS can be customized heavily with CSS. We will implement the custom "Spacing" box-model visual using CSS Grid layout applied to the default GrapesJS margin/padding inputs. 

## Proposed Changes

### `_index.html`

- **Top Bar**: Update layout to include the square "dots" logo on the left. Restyle the actions on the right (Templates, Desktop view switcher, Undo/Redo icons, Preview, Export HTML, Save Draft) to match the button styles and icons shown in the reference.
- **Left Panel (Tabs & Blocks)**:
  - Add a tab header (`div`) with "Blocks" and "Layers".
  - Style the Blocks panel to include a search bar with a shortcut hint.
  - Implement the "Basic Sections", "Content Sections", etc., categories as accordions or simple headers.
  - Style the blocks grid to display as 2 or 3 columns of square cards (`display: grid`), overriding the default GrapesJS block layout.
- **Right Panel (Tabs & Style Manager)**:
  - Add a tab header with "Content", "Style", and "Advanced".
  - Add specific CSS to target the GrapesJS Style Manager's "Spacing" sector. We will visually arrange the margin and padding inputs into the nested box model shown in the reference image using CSS Grid.

### `minimal-builder-plugin.js`

- **Block Definitions**: Add an inline SVG `media` property to each block configuration (Header, Hero, Text, Image, Button, Divider, Spacer, Social, etc.) so that they display the custom icons seen in the reference image.
- **Style Manager Config**: Ensure the `styleManagerSectors` array strictly matches the reference categories: `Spacing`, `Typography`, `Colors`, `Background`, `Border & Radius`, and `Box Shadow`.

## Verification Plan

- Refresh the browser and verify the Top Bar aligns correctly with the new logo and styled buttons.
- Check the Left Panel to ensure blocks are displayed as a neat grid of square cards with icons.
- Check the Right Panel to ensure the tabs work (if interactive) and that the "Spacing" sector in the Style Manager visually mimics a box model.
