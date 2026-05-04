export const builderConfig = {
  storageKey: 'grapesjs-email-builder-studio-v5',
  defaultTemplateKey: '',
  enabledBlockGroups: ['layout', 'content', 'sections', 'merge'],
  defaultBodyStyles: {
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
  assetSources: [
    {
      type: 'image',
      src: 'https://picsum.photos/id/1060/900/700',
      name: 'Studio desk',
      category: 'Stock',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/id/1080/900/700',
      name: 'Workspace scene',
      category: 'Stock',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/id/1050/900/700',
      name: 'Lifestyle product',
      category: 'Stock',
    },
    {
      type: 'image',
      src: 'https://picsum.photos/id/1039/900/700',
      name: 'Creative layout',
      category: 'Stock',
    },
  ],
  // Layout definitions for the Blocks tab — matching Unlayer's column structures
  layoutDefinitions: [
    { id: 'section-1', widths: [1], label: '100%' },
    { id: 'section-1-2', widths: [1, 1], label: '50% / 50%' },
    { id: 'section-1-3', widths: [1, 1, 1], label: '33% / 33% / 33%' },
    { id: 'section-1-4', widths: [1, 1, 1, 1], label: '25% × 4' },
    { id: 'section-2-1', widths: [2, 1], label: '66% / 33%' },
    { id: 'section-1-2-wide', widths: [1, 2], label: '33% / 66%' },
    { id: 'section-25-50-25', widths: [1, 2, 1], label: '25% / 50% / 25%' },
    { id: 'section-25-25-50', widths: [1, 1, 2], label: '25% / 25% / 50%' },
  ],
};

export const bodySelectors = {
  body: 'body',
  links: 'a',
  shell: '.sb-shell',
  shellGap: '.sb-shell + .sb-shell',
};
