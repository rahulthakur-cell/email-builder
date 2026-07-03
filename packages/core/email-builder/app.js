import { builderConfig, bodySelectors } from './config.js';
import { renderBuilderShell } from './shell.js';

const appRoot = document.getElementById('app');
const shell = renderBuilderShell(appRoot);
const minimalBuilder = window.grapesjsMinimalBuilder;
const previewButton = document.getElementById('btn-preview');

if (!window.grapesjs || !minimalBuilder) {
  throw new Error('GrapesJS editor dependencies did not load.');
}

// --- Clear stale storage from previous schema versions ---
// Bump this suffix whenever the data model changes to avoid ghost components.
const STORAGE_VERSION = 'v6';
const activeStorageKey = `${builderConfig.storageKey}-${STORAGE_VERSION}`;
const TEST_EMAIL_RECIPIENT_KEY = `${activeStorageKey}:test-email-recipient`;
const SAVED_TEMPLATES_KEY = 'grapesjs-email-builder-saved-templates';
(() => {
  // Remove old keys that don't match the current version
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('grapesjs-email-builder') && k !== activeStorageKey && k !== SAVED_TEMPLATES_KEY) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) { /* storage may be unavailable */ }
})();

const state = {
  dockMode: 'content',
  selectionTab: 'content',
  bodySettings: { ...builderConfig.defaultBodyStyles },
  toastTimer: 0,
  lastExportHtml: '',
  assetPickerState: null,
  previewActive: false,
  componentSelected: false,
  testEmailBusy: false,
};

const cloneValue = (v) => JSON.parse(JSON.stringify(v || []));
const px = (v, fb) => { const p = parseInt(`${v}`.replace('px', ''), 10); return Number.isFinite(p) ? p : fb; };
const normalizeAlign = (value, fallback = 'left') => {
  const next = `${value || ''}`.trim().toLowerCase();
  return ['left', 'center', 'right'].includes(next) ? next : fallback;
};
const escapeAttr = (value) => `${value ?? ''}`
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
const parseImageWidthValue = (value) => {
  const raw = `${value || ''}`.trim().toLowerCase();
  if (raw.endsWith('px')) {
    const amount = parseInt(raw, 10);
    return { amount: Number.isFinite(amount) ? Math.min(600, Math.max(40, amount)) : 320, unit: 'px' };
  }
  const amount = parseInt(raw, 10);
  return { amount: Number.isFinite(amount) ? Math.min(100, Math.max(5, amount)) : 100, unit: '%' };
};
const buildImageWidthValue = (amount, unit) => {
  const numeric = parseInt(`${amount}`, 10);
  if (unit === 'px') {
    return `${Number.isFinite(numeric) ? Math.min(600, Math.max(40, numeric)) : 320}px`;
  }
  return `${Number.isFinite(numeric) ? Math.min(100, Math.max(5, numeric)) : 100}%`;
};
const DEFAULT_IMAGE_SRC = 'https://picsum.photos/id/1060/900/700';
const isValidEmailAddress = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${value || ''}`.trim());

const getDefaultSingleColumnLayout = () => {
  const base = minimalBuilder.blockLibrary?.find((b) => b.id === 'section-1')?.content || '';
  return base
    .replace('class="sb-shell"', 'class="sb-shell base-shell" data-base-layout-node="true" data-gjs-removable="false" data-gjs-copyable="false" data-gjs-draggable="false"')
    .replace('data-layout-role="layout-grid"', 'data-layout-role="layout-grid" data-base-layout-node="true" data-gjs-removable="false" data-gjs-copyable="false" data-gjs-draggable="false"')
    .replace('data-layout-role="layout-row"', 'data-layout-role="layout-row" data-base-layout-node="true" data-gjs-removable="false" data-gjs-copyable="false" data-gjs-draggable="false"')
    .replace('data-layout-role="layout-column"', 'data-layout-role="layout-column" data-base-layout-node="true" data-gjs-removable="false" data-gjs-copyable="false" data-gjs-draggable="false"');
};

const refreshCanvas = () => {
  window.requestAnimationFrame(() => {
    try { editor.refresh(); editor.Canvas?.getWindow?.()?.dispatchEvent(new Event('resize')); } catch (e) {}
  });
};

const setStatus = (msg, kind = 'saved') => { shell.saveStatus.textContent = msg; shell.saveStatus.dataset.state = kind; };
const showToast = (msg) => {
  shell.toast.textContent = msg; shell.toast.classList.add('is-visible');
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => shell.toast.classList.remove('is-visible'), 2400);
};
const openModal = (m) => { m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); };
const closeModal = (m) => { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); };
const getSavedTestEmailRecipient = () => {
  try {
    return localStorage.getItem(TEST_EMAIL_RECIPIENT_KEY) || '';
  } catch (error) {
    return '';
  }
};
const saveTestEmailRecipient = (value) => {
  try {
    localStorage.setItem(TEST_EMAIL_RECIPIENT_KEY, value);
  } catch (error) {}
};
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
    throw e;
  }
};
const setTestEmailFeedback = (message = '', kind = 'neutral') => {
  shell.testEmailFeedback.textContent = message;
  shell.testEmailFeedback.dataset.state = kind;
  shell.testEmailFeedback.classList.toggle('is-visible', !!message);
};
const setTestEmailBusy = (busy) => {
  state.testEmailBusy = busy;
  shell.testEmailInput.disabled = busy;
  shell.testEmailSubmit.disabled = busy;
  shell.testEmailSubmit.textContent = busy ? 'Sending...' : 'Send Test Email';
};
const openTestEmailModal = () => {
  shell.testEmailInput.value = getSavedTestEmailRecipient();
  setTestEmailFeedback('', 'neutral');
  setTestEmailBusy(false);
  openModal(shell.testEmailModal);
  window.requestAnimationFrame(() => shell.testEmailInput.focus());
};
const closeTestEmailModal = () => {
  if (state.testEmailBusy) return;
  closeModal(shell.testEmailModal);
};

const editor = window.grapesjs.init({
  container: '#gjs',
  height: '100%',
  width: 'auto',
  storageManager: {
    type: 'local', autosave: true, autoload: true, stepsBeforeSave: 1,
    options: { local: { key: activeStorageKey, checkLocal: true } },
  },
  panels: { defaults: [] },
  avoidInlineStyle: false,
  jsInHtml: false,
  deviceManager: {
    devices: [
      { id: 'desktop', name: 'Desktop', width: '' },
      { id: 'mobilePortrait', name: 'Mobile', width: '360px', widthMedia: '480px' },
    ],
  },
  assetManager: { custom: true, upload: false, autoAdd: true, assets: builderConfig.assetSources },
  blockManager: { appendTo: '#builder-blocks' },
  layerManager: { appendTo: '#builder-layers' },
  selectorManager: { appendTo: '#builder-styles', componentFirst: true },
  styleManager: { appendTo: '#builder-styles', sectors: minimalBuilder.styleManagerSectors() },
  traitManager: { appendTo: '#builder-traits' },
  baseCss: minimalBuilder.canvasCss,
  plugins: [minimalBuilder],
  components: getDefaultSingleColumnLayout(),
});

// --- Helpers ---
const getSelected = () => { const s = editor.getSelected(); return s && s !== editor.getWrapper() ? s : null; };
const getAttr = (c, n) => c?.getAttributes?.()?.[n] ?? c?.get?.('attributes')?.[n] ?? '';
const getLabel = (c = getSelected()) => getAttr(c, 'data-gjs-name') || c?.get?.('name') || c?.getName?.() || c?.get?.('type') || 'Selected block';
const isImageComponent = (component = getSelected()) => component?.get?.('type') === 'email-image';

const renderImageSelectionContent = (component) => {
  const src = component.get('imageSrc') || '';
  const previewSrc = src || DEFAULT_IMAGE_SRC;
  const alt = component.get('imageAlt') || '';
  const link = component.get('imageLink') || '';
  const align = normalizeAlign(component.get('imageAlign') || component.getStyle?.()?.['text-align'], 'center');
  const { amount, unit } = parseImageWidthValue(component.get('imageWidth') || component.getStyle?.()?.width || '100%');

  shell.selectionCustomContent.innerHTML = `
    <div class="studio-image-editor">
      <div class="studio-image-editor__preview" data-image-preview>
        <img src="${escapeAttr(previewSrc)}" alt="${escapeAttr(alt || 'Selected image preview')}" />
      </div>

      <div class="studio-image-editor__actions">
        <button class="studio-button studio-button--primary" type="button" data-image-action="choose">${src ? 'Replace Image' : 'Choose Image'}</button>
        <button class="studio-button studio-button--secondary" type="button" data-image-action="clear"${src ? '' : ' disabled'}>Reset</button>
      </div>

      <div class="studio-image-editor__field">
        <label class="studio-image-editor__label" for="image-source-input">Image Source</label>
        <input id="image-source-input" class="studio-image-editor__input" type="url" value="${escapeAttr(src)}" placeholder="Paste image URL" data-image-field="src" />
      </div>

      <div class="studio-image-editor__field">
        <label class="studio-image-editor__label" for="image-alt-input">Alt Text</label>
        <input id="image-alt-input" class="studio-image-editor__input" type="text" value="${escapeAttr(alt)}" placeholder="Describe this image" data-image-field="alt" />
      </div>

      <div class="studio-image-editor__field">
        <label class="studio-image-editor__label" for="image-link-input">Image Link</label>
        <input id="image-link-input" class="studio-image-editor__input" type="url" value="${escapeAttr(link)}" placeholder="https://example.com" data-image-field="link" />
      </div>

      <div class="studio-image-editor__grid">
        <div class="studio-image-editor__field">
          <label class="studio-image-editor__label" for="image-width-input">Width</label>
          <input id="image-width-input" class="studio-image-editor__input" type="number" min="${unit === 'px' ? 40 : 5}" max="${unit === 'px' ? 600 : 100}" step="1" value="${amount}" data-image-field="width" />
        </div>
        <div class="studio-image-editor__field">
          <label class="studio-image-editor__label" for="image-width-unit">Unit</label>
          <select id="image-width-unit" class="studio-image-editor__input" data-image-field="unit">
            <option value="%"${unit === '%' ? ' selected' : ''}>%</option>
            <option value="px"${unit === 'px' ? ' selected' : ''}>px</option>
          </select>
        </div>
      </div>

      <div class="studio-image-editor__field">
        <label class="studio-image-editor__label">Alignment</label>
        <div class="studio-image-editor__align">
          <button class="studio-image-editor__align-btn${align === 'left' ? ' is-active' : ''}" type="button" data-image-align="left">Left</button>
          <button class="studio-image-editor__align-btn${align === 'center' ? ' is-active' : ''}" type="button" data-image-align="center">Center</button>
          <button class="studio-image-editor__align-btn${align === 'right' ? ' is-active' : ''}" type="button" data-image-align="right">Right</button>
        </div>
      </div>

      <div class="studio-panel-note studio-panel-note--compact">
        Use the Design tab for padding, margin, borders, and background styling.
      </div>
    </div>
  `;

  const preview = shell.selectionCustomContent.querySelector('[data-image-preview]');
  const sourceInput = shell.selectionCustomContent.querySelector('[data-image-field="src"]');
  const altInput = shell.selectionCustomContent.querySelector('[data-image-field="alt"]');
  const linkInput = shell.selectionCustomContent.querySelector('[data-image-field="link"]');
  const widthInput = shell.selectionCustomContent.querySelector('[data-image-field="width"]');
  const unitInput = shell.selectionCustomContent.querySelector('[data-image-field="unit"]');
  const clearButton = shell.selectionCustomContent.querySelector('[data-image-action="clear"]');
  const chooseButton = shell.selectionCustomContent.querySelector('[data-image-action="choose"]');

  const setPreview = (value, previewAlt = '') => {
    const nextValue = value || DEFAULT_IMAGE_SRC;
    preview.innerHTML = `<img src="${escapeAttr(nextValue)}" alt="${escapeAttr(previewAlt || 'Selected image preview')}" />`;
    clearButton.disabled = !value || value === DEFAULT_IMAGE_SRC;
    chooseButton.textContent = value ? 'Replace Image' : 'Choose Image';
  };

  const syncImageWidth = () => {
    const nextUnit = unitInput.value === 'px' ? 'px' : '%';
    widthInput.min = nextUnit === 'px' ? '40' : '5';
    widthInput.max = nextUnit === 'px' ? '600' : '100';
    const nextWidth = buildImageWidthValue(widthInput.value, nextUnit);
    component.set('imageWidth', nextWidth);
    component.addStyle({ width: 'auto', 'max-width': 'none' });
  };

  sourceInput.addEventListener('input', () => {
    component.set('imageSrc', sourceInput.value.trim());
    setPreview(sourceInput.value.trim(), altInput.value.trim());
  });

  altInput.addEventListener('input', () => {
    component.set('imageAlt', altInput.value);
    setPreview(sourceInput.value.trim(), altInput.value.trim());
  });

  linkInput.addEventListener('input', () => component.set('imageLink', linkInput.value.trim()));
  widthInput.addEventListener('input', syncImageWidth);
  unitInput.addEventListener('change', syncImageWidth);

  shell.selectionCustomContent.querySelectorAll('[data-image-align]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextAlign = button.dataset.imageAlign;
      component.set('imageAlign', nextAlign);
      shell.selectionCustomContent.querySelectorAll('[data-image-align]').forEach((item) => item.classList.toggle('is-active', item === button));
    });
  });

  clearButton.addEventListener('click', () => {
    component.set('imageSrc', DEFAULT_IMAGE_SRC);
    sourceInput.value = DEFAULT_IMAGE_SRC;
    setPreview(DEFAULT_IMAGE_SRC, altInput.value.trim());
    showToast('Image reset.');
  });

  chooseButton.addEventListener('click', () => {
    state.selectionTab = 'content';
    editor.select(component);
    editor.AssetManager.open({
      types: ['image'],
      select(asset, complete) {
        const nextSrc = asset.getSrc ? asset.getSrc() : asset.get?.('src');
        component.set('imageSrc', nextSrc || DEFAULT_IMAGE_SRC);
        state.selectionTab = 'content';
        editor.select(component);
        updateSelectionPanels();
        complete && editor.AssetManager.close();
      },
    });
  });
};

const updateSelectionContent = () => {
  const selected = getSelected();
  const showCustomImageEditor = !!selected && state.selectionTab === 'content' && isImageComponent(selected);
  shell.selectionCustomContent.classList.toggle('is-hidden', !showCustomImageEditor);
  shell.selectionDefaultContent.classList.toggle('is-hidden', showCustomImageEditor);

  if (showCustomImageEditor) {
    renderImageSelectionContent(selected);
  } else {
    shell.selectionCustomContent.innerHTML = '';
  }
};

// --- Body Settings ---
const getBodyVal = (sel, prop, fb) => { const r = editor.Css.getRule(sel); return r?.getStyle?.()?.[prop] ?? fb; };

const readBodySettings = () => ({
  textColor: getBodyVal(bodySelectors.body, 'color', builderConfig.defaultBodyStyles.textColor),
  canvasBackground: getBodyVal(bodySelectors.body, 'background', builderConfig.defaultBodyStyles.canvasBackground),
  emailBackground: getBodyVal(bodySelectors.shell, 'background', builderConfig.defaultBodyStyles.emailBackground),
  contentWidth: px(getBodyVal(bodySelectors.shell, 'max-width', `${builderConfig.defaultBodyStyles.contentWidth}px`), builderConfig.defaultBodyStyles.contentWidth),
  contentAlignment: getBodyVal(bodySelectors.shell, 'text-align', builderConfig.defaultBodyStyles.contentAlignment),
  fontFamily: getBodyVal(bodySelectors.body, 'font-family', builderConfig.defaultBodyStyles.fontFamily),
  fontWeight: getBodyVal(bodySelectors.body, 'font-weight', builderConfig.defaultBodyStyles.fontWeight),
  preheaderText: builderConfig.defaultBodyStyles.preheaderText,
  linkColor: getBodyVal(bodySelectors.links, 'color', builderConfig.defaultBodyStyles.linkColor),
});

const syncBodyForm = () => {
  const v = state.bodySettings;
  document.getElementById('body-text-color').value = v.textColor;
  document.getElementById('body-canvas-background').value = v.canvasBackground;
  document.getElementById('body-email-background').value = v.emailBackground;
  document.getElementById('body-content-width').value = v.contentWidth;
  document.getElementById('body-font-family').value = v.fontFamily;
  document.getElementById('body-font-weight').value = v.fontWeight;
  document.getElementById('body-preheader').value = v.preheaderText || '';
  document.getElementById('body-link-color').value = v.linkColor;
  // Alignment toggle
  document.querySelectorAll('.studio-toggle-btn').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.align === v.contentAlignment);
  });
};

const applyBodySettings = (values, options = {}) => {
  state.bodySettings = {
    textColor: values.textColor || builderConfig.defaultBodyStyles.textColor,
    canvasBackground: values.canvasBackground || builderConfig.defaultBodyStyles.canvasBackground,
    emailBackground: values.emailBackground || builderConfig.defaultBodyStyles.emailBackground,
    contentWidth: Number(values.contentWidth) || builderConfig.defaultBodyStyles.contentWidth,
    contentAlignment: values.contentAlignment || builderConfig.defaultBodyStyles.contentAlignment,
    fontFamily: values.fontFamily || builderConfig.defaultBodyStyles.fontFamily,
    fontWeight: values.fontWeight || builderConfig.defaultBodyStyles.fontWeight,
    preheaderText: values.preheaderText || '',
    linkColor: values.linkColor || builderConfig.defaultBodyStyles.linkColor,
  };
  document.documentElement.style.setProperty('--studio-canvas-fill', state.bodySettings.canvasBackground);
  editor.Css.setRule(bodySelectors.body, {
    margin: '0', padding: '0', background: 'transparent',
    color: state.bodySettings.textColor,
    'font-family': state.bodySettings.fontFamily,
    'font-weight': state.bodySettings.fontWeight,
  });
  editor.Css.setRule(bodySelectors.links, { color: state.bodySettings.linkColor, 'text-decoration': 'none' });
  editor.Css.setRule(bodySelectors.shell, {
    width: '100%', 'max-width': `${state.bodySettings.contentWidth}px`,
    margin: '0 auto', background: state.bodySettings.emailBackground,
    'text-align': state.bodySettings.contentAlignment,
  });
  if (!options.silent) syncBodyForm();
};

const ensureBodySettings = () => { const c = readBodySettings(); applyBodySettings(c, { silent: true }); syncBodyForm(); };

// --- Dock / Panel switching ---
const setPreviewState = (active) => {
  state.previewActive = active;
  previewButton.classList.toggle('is-active', active);
  shell.shellRoot.classList.toggle('is-previewing', active);
  refreshCanvas();
};

const syncPreviewState = (active) => {
  if (active) editor.runCommand('core:preview'); else editor.stopCommand('core:preview');
  setPreviewState(active);
};

const updateSelectionPanels = () => {
  const sel = getSelected();
  const hasSel = !!sel;
  shell.selectionEmpty.classList.toggle('is-hidden', hasSel);
  shell.selectionPane.classList.toggle('is-hidden', !hasSel);
  if (hasSel) shell.selectionTitle.textContent = getLabel(sel);
  shell.selectionTabs.forEach((b) => b.classList.toggle('is-active', b.dataset.selectionTab === state.selectionTab));
  shell.selectionPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.selectionPanel === state.selectionTab));
  updateSelectionContent();
};

const setDockMode = (mode) => {
  state.dockMode = mode;
  // If component is selected and we're on content/blocks, show selection panel instead
  const sel = getSelected();
  let visiblePanel = mode;
  if (sel && (mode === 'content' || mode === 'blocks')) {
    visiblePanel = 'selection';
    state.componentSelected = true;
  } else {
    state.componentSelected = false;
  }
  shell.dockButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.dock === mode));
  shell.dockPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.dockPanel === visiblePanel));
  updateSelectionPanels();
};

const setSelectionTab = (tab) => { state.selectionTab = tab; setDockMode(state.dockMode); };

// --- Helpers: find the best droppable target for a content block ---
// Walk up from the selected component to find a column (responsive-td) or the wrapper
const findDropTarget = () => {
  let target = getSelected();
  // If a content component is selected, find its parent column
  while (target) {
    const tag = target.get?.('tagName');
    const classes = target.getClasses?.() || [];
    if (tag === 'td' && classes.includes('responsive-td')) return target;
    target = target.parent?.();
  }
  // No column found — find the first empty column in the wrapper, or fallback to wrapper
  const wrapper = editor.getWrapper();
  const allCols = [];
  const walk = (model) => {
    if (!model) return;
    const t = model.get?.('tagName');
    const c = model.getClasses?.() || [];
    if (t === 'td' && c.includes('responsive-td')) { allCols.push(model); return; }
    (model.components?.() || []).forEach(walk);
  };
  walk(wrapper);
  // Prefer an empty column, then the first column, then wrapper
  return allCols.find((c) => c.components().length === 0) || allCols[0] || wrapper;
};

// Content blocks now use GrapesJS native BlockManager rendering with built-in drag-and-drop.
// No custom tile setup needed — blocks are displayed via CSS in a 3-column grid.

// --- "Add Content" button handler (dispatched from empty column overlay in canvas) ---
window.addEventListener('builder:add-content-request', () => {
  // MUST deselect first — otherwise setDockMode sees the selected component
  // via getSelected() and re-shows the selection panel instead of content panel
  editor.select(null);
  state.componentSelected = false;
  setDockMode('content');
});

// --- Layout blocks grid rendering ---
const renderLayoutGrid = () => {
  const grid = shell.layoutGrid;
  if (!grid) return;
  grid.innerHTML = '';
  builderConfig.layoutDefinitions.forEach((layout) => {
    const card = document.createElement('div');
    card.className = 'studio-layout-card';
    card.setAttribute('draggable', 'true');
    card.dataset.layoutId = layout.id;
    // Visual preview columns
    const cols = layout.widths.map((w) => `<div class="studio-layout-col" style="flex:${w};"></div>`).join('');
    card.innerHTML = `<div class="studio-layout-preview"><div class="studio-layout-cols">${cols}</div></div>`;
    // Drag
    card.addEventListener('dragstart', (e) => {
      const block = editor.BlockManager.get(layout.id);
      if (!block) return;
      const content = block.get('content');
      e.dataTransfer.setData('text/html', typeof content === 'string' ? content : '');
      e.dataTransfer.effectAllowed = 'copy';
      editor.runCommand('core:block-drag', { block });
    });
    card.addEventListener('dragend', () => { try { editor.stopCommand('core:block-drag'); } catch (err) {} });
    card.addEventListener('click', () => {
      const block = editor.BlockManager.get(layout.id);
      if (!block) return;
      const content = block.get('content');
      const wrapper = editor.getWrapper();
      try {
        const added = wrapper.append(content);
        if (added && added[0]) { editor.select(added[0]); refreshCanvas(); }
      } catch (err) {}
    });
    grid.appendChild(card);
  });
};

// --- Asset management ---
const renderAssetGrid = (customState = state.assetPickerState) => {
  const assets = customState?.assets || editor.AssetManager.getAll().models || [];
  shell.assetGrid.innerHTML = '';
  assets.forEach((asset) => {
    const src = asset.getSrc ? asset.getSrc() : asset.get?.('src');
    const name = asset.get?.('name') || src?.split('/').pop() || 'Image';
    const card = document.createElement('article');
    card.className = 'studio-asset-card';
    card.innerHTML = `<div class="studio-asset-card__preview"><img src="${src}" alt="${name}" /></div>
      <div class="studio-asset-card__meta"><div><strong>${name}</strong></div>
      <div class="studio-asset-card__actions"><button class="studio-button studio-button--secondary" type="button">Use</button></div></div>`;
    card.querySelector('button').addEventListener('click', () => {
      if (customState?.select) {
        customState.select(asset, true);
        customState.close?.();
        state.assetPickerState = null;
        setDockMode('content');
        showToast('Image applied.');
      } else { showToast('Asset ready to use.'); }
    });
    shell.assetGrid.appendChild(card);
  });
};

const addUrlAsset = () => {
  const url = shell.assetUrlInput.value.trim();
  if (!url) return;
  editor.AssetManager.add({ type: 'image', src: url, name: 'Custom image', category: 'Custom' });
  shell.assetUrlInput.value = '';
  renderAssetGrid();
  showToast('Image added.');
};

const uploadLocalAsset = async (file) => {
  const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(file); });
  const added = editor.AssetManager.add({ type: 'image', src: dataUrl, name: file.name, category: 'Uploads' });
  renderAssetGrid();
  // Auto-apply the uploaded image if asset picker was triggered by a component (Image/Video)
  if (state.assetPickerState?.select && added) {
    const asset = Array.isArray(added) ? added[0] : added;
    if (asset) {
      state.assetPickerState.select(asset, true);
      state.assetPickerState.close?.();
      state.assetPickerState = null;
      setDockMode('content');
      showToast('Image uploaded and applied.');
      return;
    }
  }
  showToast('Image uploaded.');
};

// --- Export ---
const getEditorMarkup = () => {
  const html = editor.getHtml({ cleanId: true });
  const css = [minimalBuilder.canvasCss, editor.getCss({ keepUnusedStyles: false })].filter(Boolean).join('\n');
  return { html, css };
};

const buildRawEditorTemplate = () => {
  const { html, css } = getEditorMarkup();
  return {
    html,
    css,
    combined: [css ? `<style>\n${css}\n</style>` : '', html].filter(Boolean).join('\n'),
  };
};

const inlineEditorStyles = (html, css) => {
  const doc = document.implementation.createHTMLDocument('email-export');
  doc.body.innerHTML = html;
  const styleEl = doc.createElement('style'); styleEl.textContent = css; doc.head.appendChild(styleEl);
  const retainedCss = [];
  const appendStyle = (el, cssText) => {
    if (!cssText || el === styleEl) return;
    const existing = (el.getAttribute('style') || '').trim();
    const normalized = existing ? `${existing.replace(/;+\s*$/, '')}; ` : '';
    el.setAttribute('style', `${normalized}${cssText}`.replace(/\s+/g, ' ').trim());
  };
  const rules = styleEl.sheet ? Array.from(styleEl.sheet.cssRules || []) : [];
  rules.forEach((rule) => {
    if (rule.type === CSSRule.STYLE_RULE) {
      try { const els = doc.querySelectorAll(rule.selectorText); if (!els.length) return; els.forEach((el) => appendStyle(el, rule.style.cssText)); } catch (e) { retainedCss.push(rule.cssText); }
      return;
    }
    retainedCss.push(rule.cssText);
  });
  styleEl.remove();
  return { html: doc.body.innerHTML.trim(), bodyStyle: doc.body.getAttribute('style') || '', retainedCss: retainedCss.join('\n') };
};

const buildProductionHtml = () => {
  const { html: rawHtml, css: rawCss } = buildRawEditorTemplate();
  const { html, bodyStyle, retainedCss } = inlineEditorStyles(rawHtml, rawCss);
  const headCss = ['a[x-apple-data-detectors], u + #body a, #MessageViewBody a { color: inherit !important; text-decoration: none !important; }', retainedCss].filter(Boolean).join('\n');
  const exportBodyStyle = [bodyStyle, `background: ${state.bodySettings.canvasBackground}`].filter(Boolean).join('; ');
  const preheader = state.bodySettings.preheaderText ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${state.bodySettings.preheaderText}</span>` : '';
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Email Template</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings xmlns:o="urn:schemas-microsoft-com:office:office"><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  ${headCss ? `<style>${headCss}</style>` : ''}
</head>
<body id="body" style="${exportBodyStyle}">
  ${preheader}
  <center role="article" aria-roledescription="email" lang="en" style="width:100%;">
${html}
  </center>
</body>
</html>`;
};

const updateExportCode = () => { state.lastExportHtml = buildProductionHtml(); shell.exportCode.value = state.lastExportHtml; };
const isPublicHttpUrl = (value) => {
  try {
    const parsed = new URL(`${value || ''}`.trim());
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
};
const findNonPublicAssetUrls = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const urls = [];
  const seen = new Set();
  const addUrl = (value) => {
    const next = `${value || ''}`.trim().replace(/^['"]|['"]$/g, '');
    if (!next || seen.has(next)) return;
    seen.add(next);
    urls.push(next);
  };
  const collectCssUrls = (value = '') => {
    const matches = value.matchAll(/url\((['"]?)(.*?)\1\)/gi);
    for (const match of matches) addUrl(match[2]);
  };

  doc.querySelectorAll('img[src]').forEach((node) => addUrl(node.getAttribute('src')));
  doc.querySelectorAll('[background]').forEach((node) => addUrl(node.getAttribute('background')));
  doc.querySelectorAll('[style]').forEach((node) => collectCssUrls(node.getAttribute('style') || ''));
  doc.querySelectorAll('style').forEach((node) => collectCssUrls(node.textContent || ''));

  return urls.filter((url) => !isPublicHttpUrl(url));
};
const sendTestEmailRequest = async (email) => {
  const html = buildProductionHtml();
  state.lastExportHtml = html;

  // Client-side asset check (fast path — avoids a round-trip)
  const assetIssues = findNonPublicAssetUrls(html);
  if (assetIssues.length) {
    throw new Error(
      `Public image URLs are required before sending. Update these assets first: ${assetIssues.slice(0, 2).join(', ')}`
    );
  }

  let response;
  try {
    response = await fetch('/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, html }),
    });
  } catch (_networkError) {
    // fetch() itself threw — network unreachable or CORS preflight failed
    throw new Error('Could not reach the test email service.');
  }

  let result = {};
  try { result = await response.json(); } catch (_) { /* non-JSON body — use defaults */ }

  if (response.ok) return result;

  // HTTP 500 with details array → SMTP misconfiguration
  if (response.status === 500 && Array.isArray(result.details) && result.details.length) {
    const detail = result.details.slice(0, 3).join(' ');
    throw new Error(`SMTP is not configured. Check your .env file. ${detail}`);
  }

  // HTTP 422 with assetIssues → server-side asset validation failure
  if (response.status === 422 && Array.isArray(result.assetIssues) && result.assetIssues.length) {
    throw new Error(
      `${result.error || 'Asset issue.'} ${result.assetIssues.slice(0, 2).join(', ')}`
    );
  }

  // All other non-2xx responses
  throw new Error(result.error || 'Could not send the test email.');
};

const downloadHtml = (html) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'email-template.html';
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
};

const copyHtml = async (html) => {
  if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(html); return; }
  shell.exportCode.focus(); shell.exportCode.select(); document.execCommand('copy');
};

const applyTemplate = async (templateKey) => {
  const template = minimalBuilder.emailTemplates[templateKey];
  editor.Css.clear();
  editor.setComponents(template ? cloneValue(template.components) : getDefaultSingleColumnLayout());
  applyBodySettings(builderConfig.defaultBodyStyles, { silent: false });
  closeModal(shell.templateModal);
  await editor.store();
  setStatus('Draft Saved', 'saved');
  showToast(template ? `${template.name} loaded.` : 'Blank email ready.');
};

const ensureDefaultBaseLayout = async () => {
  const wrapper = editor.getWrapper();
  if (!wrapper?.components?.()?.length) { editor.setComponents(getDefaultSingleColumnLayout()); await editor.store(); }
};

const renderTemplateGrid = () => {
  shell.templateGrid.innerHTML = '';

  // My Templates section (user-saved)
  const savedTemplates = getSavedTemplates();
  if (savedTemplates.length > 0) {
    const savedHeading = document.createElement('div');
    savedHeading.className = 'studio-template-section-heading';
    savedHeading.textContent = 'My Templates';
    shell.templateGrid.appendChild(savedHeading);

    savedTemplates.forEach((template) => {
      const card = document.createElement('div');
      card.className = 'studio-template-card studio-template-card--saved';
      const date = new Date(template.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      card.innerHTML = `
        <div class="studio-template-card__body">
          <strong>${template.name}</strong>
          <p>Saved ${date}</p>
        </div>
        <button class="studio-template-card__delete" type="button" title="Delete template" data-template-id="${template.id}">&times;</button>
      `;
      // Load handler — click on card body (not delete button)
      card.querySelector('.studio-template-card__body').addEventListener('click', () => {
        try {
          editor.loadProjectData(template.projectData);
          applyBodySettings(template.bodySettings || builderConfig.defaultBodyStyles);
          closeModal(shell.templateModal);
          showToast(`${template.name} loaded.`);
        } catch (e) {
          showToast('Could not load that template.');
        }
      });
      // Delete handler
      card.querySelector('.studio-template-card__delete').addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.templateId;
        try {
          const updated = getSavedTemplates().filter((t) => t.id !== id);
          setSavedTemplates(updated);
        } catch (e) {
          showToast('Could not delete that template.');
        }
        renderTemplateGrid();
      });
      shell.templateGrid.appendChild(card);
    });

    // Divider heading for built-in templates
    const builtinHeading = document.createElement('div');
    builtinHeading.className = 'studio-template-section-heading';
    builtinHeading.textContent = 'Built-in Templates';
    shell.templateGrid.appendChild(builtinHeading);
  }

  // Built-in templates
  Object.entries(minimalBuilder.emailTemplates).forEach(([key, template]) => {
    const card = document.createElement('button'); card.type = 'button'; card.className = 'studio-template-card';
    card.innerHTML = `<strong>${template.name}</strong><p>${template.description}</p>`;
    card.addEventListener('click', () => applyTemplate(key).catch(() => { setStatus('Save failed', 'error'); showToast('Could not load that template.'); }));
    shell.templateGrid.appendChild(card);
  });
  const blankCard = document.createElement('button'); blankCard.type = 'button'; blankCard.className = 'studio-template-card';
  blankCard.innerHTML = '<strong>Blank Canvas</strong><p>Start with only the primitive-first email-safe block library.</p>';
  blankCard.addEventListener('click', () => applyTemplate('').catch(() => { setStatus('Save failed', 'error'); showToast('Could not reset the canvas.'); }));
  shell.templateGrid.appendChild(blankCard);
};

// --- Event Bindings ---
shell.dockButtons.forEach((b) => b.addEventListener('click', () => {
  // If component is selected and user clicks Content tab, deselect to show content grid
  if (b.dataset.dock === 'content' && state.componentSelected) {
    editor.select(null);
    state.componentSelected = false;
  }
  setDockMode(b.dataset.dock);
}));

shell.selectionTabs.forEach((b) => b.addEventListener('click', () => setSelectionTab(b.dataset.selectionTab)));

shell.selectionBack.addEventListener('click', () => {
  editor.select(null);
  state.componentSelected = false;
  setDockMode('content');
});

shell.assetAddUrl.addEventListener('click', addUrlAsset);
shell.assetUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addUrlAsset(); } });
shell.assetUploadInput.addEventListener('change', async (e) => {
  const [file] = e.target.files || [];
  if (!file) return;
  try { await uploadLocalAsset(file); } catch (err) { showToast('Could not upload that image.'); } finally { e.target.value = ''; }
});

// Body settings form
shell.bodySettingsForm.addEventListener('input', () => {
  applyBodySettings({
    textColor: document.getElementById('body-text-color').value,
    canvasBackground: document.getElementById('body-canvas-background').value,
    emailBackground: document.getElementById('body-email-background').value,
    contentWidth: document.getElementById('body-content-width').value,
    contentAlignment: state.bodySettings.contentAlignment,
    fontFamily: document.getElementById('body-font-family').value,
    fontWeight: document.getElementById('body-font-weight').value,
    preheaderText: document.getElementById('body-preheader').value,
    linkColor: document.getElementById('body-link-color').value,
  }, { silent: true });
});

// Alignment toggle buttons
document.querySelectorAll('.studio-toggle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.bodySettings.contentAlignment = btn.dataset.align;
    document.querySelectorAll('.studio-toggle-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
    applyBodySettings(state.bodySettings, { silent: true });
  });
});

// Stepper buttons
document.querySelectorAll('.studio-stepper-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.stepper);
    if (!input) return;
    const step = Number(input.step) || 10;
    const dir = Number(btn.dataset.dir);
    input.value = Math.max(Number(input.min) || 0, Math.min(Number(input.max) || 9999, Number(input.value) + step * dir));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
});

document.getElementById('btn-open-test-email').addEventListener('click', () => openTestEmailModal());
document.getElementById('btn-open-templates').addEventListener('click', () => openModal(shell.templateModal));
document.getElementById('btn-close-template-modal').addEventListener('click', () => closeModal(shell.templateModal));
document.getElementById('btn-close-export-modal').addEventListener('click', () => closeModal(shell.exportModal));
document.getElementById('btn-close-test-email-modal').addEventListener('click', () => closeTestEmailModal());
document.getElementById('btn-cancel-test-email').addEventListener('click', () => closeTestEmailModal());
[shell.templateModal, shell.exportModal, shell.testEmailModal].forEach((m) => m.addEventListener('click', (e) => {
  if (e.target !== m) return;
  if (m === shell.testEmailModal) {
    closeTestEmailModal();
    return;
  }
  closeModal(m);
}));

// Save Template
document.getElementById('btn-save-template').addEventListener('click', () => {
  shell.saveTemplateInput.value = '';
  shell.saveTemplateFeedback.textContent = '';
  shell.saveTemplateFeedback.classList.remove('is-visible');
  openModal(shell.saveTemplateModal);
  window.requestAnimationFrame(() => shell.saveTemplateInput.focus());
});

document.getElementById('btn-close-save-template-modal').addEventListener('click', () => closeModal(shell.saveTemplateModal));
document.getElementById('btn-cancel-save-template').addEventListener('click', () => closeModal(shell.saveTemplateModal));

shell.saveTemplateModal.addEventListener('click', (e) => {
  if (e.target === shell.saveTemplateModal) closeModal(shell.saveTemplateModal);
});

shell.saveTemplateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = shell.saveTemplateInput.value.trim();
  if (!name) {
    shell.saveTemplateFeedback.textContent = 'Please enter a template name.';
    shell.saveTemplateFeedback.classList.add('is-visible');
    shell.saveTemplateFeedback.dataset.state = 'error';
    return;
  }
  try {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const entry = {
      id,
      name,
      createdAt: new Date().toISOString(),
      projectData: editor.getProjectData(),
      html: buildProductionHtml(),
      css: editor.getCss({ keepUnusedStyles: false }),
      bodySettings: { ...state.bodySettings },
    };
    const existing = getSavedTemplates();
    setSavedTemplates([...existing, entry]);
    closeModal(shell.saveTemplateModal);
    showToast('Template saved.');
  } catch (e) {
    showToast('Could not save template.');
  }
});

document.getElementById('btn-export').addEventListener('click', () => {
  try { updateExportCode(); openModal(shell.exportModal); } catch (e) { setStatus('Export failed', 'error'); showToast('Could not build the production HTML.'); }
});
shell.testEmailForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (state.testEmailBusy) return;

  const email = shell.testEmailInput.value.trim();
  if (!isValidEmailAddress(email)) {
    setTestEmailFeedback('Enter a valid email address before sending.', 'error');
    shell.testEmailInput.focus();
    return;
  }

  try {
    setTestEmailBusy(true);
    setTestEmailFeedback('Sending the current template...', 'info');
    await sendTestEmailRequest(email);
    saveTestEmailRecipient(email);
    setTestEmailFeedback('Test email sent successfully.', 'success');
    closeModal(shell.testEmailModal);
    showToast(`Test email sent to ${email}.`);
  } catch (error) {
    setTestEmailFeedback(error.message || 'Could not send the test email.', 'error');
    showToast('Could not send the test email.');
  } finally {
    setTestEmailBusy(false);
  }
});
document.getElementById('btn-copy-html').addEventListener('click', async () => {
  try { if (!state.lastExportHtml) updateExportCode(); await copyHtml(state.lastExportHtml); showToast('Production HTML copied.'); } catch (e) { showToast('Copy failed.'); }
});
document.getElementById('btn-download-html').addEventListener('click', () => {
  try { if (!state.lastExportHtml) updateExportCode(); downloadHtml(state.lastExportHtml); showToast('HTML file downloaded.'); } catch (e) { showToast('Download failed.'); }
});

document.getElementById('btn-undo').addEventListener('click', () => editor.runCommand('core:undo'));
document.getElementById('btn-redo').addEventListener('click', () => editor.runCommand('core:redo'));

document.querySelectorAll('[data-device]').forEach((b) => {
  b.addEventListener('click', () => {
    editor.setDevice(b.dataset.device);
    document.querySelectorAll('[data-device]').forEach((i) => i.classList.toggle('is-active', i === b));
    refreshCanvas();
  });
});

previewButton.addEventListener('click', () => syncPreviewState(!state.previewActive));

// --- Editor Events ---
editor.on('storage:start:store', () => setStatus('Saving...', 'saving'));
editor.on('storage:end:store', () => setStatus('Draft Saved', 'saved'));
editor.on('storage:error:store', () => { setStatus('Save failed', 'error'); showToast('Could not save the draft.'); });

editor.on('component:selected', () => {
  if (state.previewActive) syncPreviewState(false);
  state.selectionTab = isImageComponent() ? 'content' : 'style';
  state.componentSelected = true;
  setDockMode(state.dockMode);
});

editor.on('component:deselected', () => {
  state.componentSelected = false;
  updateSelectionPanels();
  setDockMode(state.dockMode);
});

editor.on('asset:custom', (props) => {
  state.assetPickerState = props;
  shell.assetHint.textContent = props.select ? 'Choose an image to apply it to the selected block.' : 'Manage the shared image library for this email.';
  renderAssetGrid(props);
  setDockMode('images');
});

editor.on('run:core:preview', () => setPreviewState(true));
editor.on('stop:core:preview', () => setPreviewState(false));

editor.on('load', async () => {
  // Validate existing components: remove any that exist in state but fail to render
  const wrapper = editor.getWrapper();
  const topLevel = wrapper.components();
  if (topLevel.length === 0) {
    // Fresh start — add default layout
    wrapper.append(getDefaultSingleColumnLayout());
  } else {
    // Clean up: ensure every top-level component actually has an element on the canvas
    const toRemove = [];
    topLevel.forEach((comp) => {
      const el = comp.getEl();
      if (!el || !el.parentElement) {
        toRemove.push(comp);
      }
    });
    if (toRemove.length > 0) {
      console.warn(`Removing ${toRemove.length} ghost component(s) that had no canvas element.`);
      toRemove.forEach((comp) => comp.remove());
    }
  }

  renderTemplateGrid();
  ensureBodySettings();
  renderLayoutGrid();
  // GrapesJS blocks render natively — no custom tile setup needed
  renderAssetGrid();
  setDockMode('content');
  setPreviewState(false);
  refreshCanvas();
  setStatus('Draft Saved', 'saved');
  showToast('Builder ready.');
});
