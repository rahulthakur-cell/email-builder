const icon = {
  columns: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="8" height="16" rx="2"></rect><rect x="13" y="4" width="8" height="16" rx="2"></rect></svg>`,
  button: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="10" rx="3"></rect><line x1="8" y1="12" x2="16" y2="12"></line></svg>`,
  divider: `<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line></svg>`,
  heading: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v16"></path><path d="M18 4v16"></path><path d="M6 12h12"></path></svg>`,
  paragraph: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M13 4H9a4 4 0 0 0 0 8h4"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m10 9 5 3-5 3z"></path></svg>`,
  social: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  menu: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path></svg>`,
  html: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5"></path><path d="m16 7 5 5-5 5"></path></svg>`,
  table: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 10h18"></path><path d="M9 5v14"></path><path d="M15 5v14"></path></svg>`,
  timer: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2 2"></path><path d="M5 3 2 6"></path><path d="m22 6-3-3"></path></svg>`,
  desktop: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path><path d="M12 16v4"></path></svg>`,
  mobile: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2"></rect><path d="M11 18.5h2"></path></svg>`,
  undo: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>`,
  redo: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path></svg>`,
  eye: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  layers: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 10 5-10 5L2 7Z"></path><path d="m2 12 10 5 10-5"></path><path d="m2 17 10 5 10-5"></path></svg>`,
  moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"></path></svg>`,
  contentTab: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  blocksTab: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>`,
  bodyTab: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18"></path><path d="M8 14h8"></path></svg>`,
  imageTab: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>`,
  upload: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5-5 5 5"></path><path d="M12 15V5"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
  back: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-8-5 18-3-7-10-3Z"></path><path d="m13 14 8-11"></path></svg>`,
};

export const renderBuilderShell = (root) => {
  root.innerHTML = `
    <div class="studio-shell">
      <header class="studio-appbar">
        <div class="studio-appbar__left">
          <div class="studio-brand" aria-label="Email Studio">
            <div class="studio-brand__mark" aria-hidden="true">
              <span class="studio-brand__mark-lg"></span>
              <span></span>
              <span></span>
              <span class="studio-brand__mark-lg"></span>
              <span></span>
              <span></span>
              <span class="studio-brand__mark-sm"></span>
            </div>
            <div class="studio-brand__wordmark">
              <span>unlayer</span>
              <strong>studio</strong>
            </div>
          </div>

          <button id="btn-open-templates" class="studio-appbar__nav" type="button">
            ${icon.layers}
            <span>Templates</span>
          </button>
        </div>

        <div class="studio-appbar__actions">
          <div id="save-status" class="studio-status" data-state="saved">Draft Saved</div>
          <span class="studio-appbar__theme" aria-hidden="true">${icon.moon}</span>
          <button id="btn-open-test-email" class="studio-button studio-button--secondary studio-button--send-test" type="button">
            ${icon.send}
            <span>Send Test Email</span>
          </button>
          <button id="btn-save-template" class="studio-button studio-button--secondary" type="button">Save Template</button>
          <button id="btn-export" class="studio-button studio-button--primary studio-button--export" type="button">EXPORT</button>
        </div>
      </header>

      <div class="studio-toolbar">
        <div class="studio-toolbar__zone studio-toolbar__zone--left">
          <button id="btn-undo" class="studio-cell-button" type="button" title="Undo">${icon.undo}</button>
          <button id="btn-redo" class="studio-cell-button" type="button" title="Redo">${icon.redo}</button>
        </div>

        <div class="studio-toolbar__zone studio-toolbar__zone--center">
          <button class="studio-cell-button is-active" data-device="desktop" type="button" title="Desktop view">${icon.desktop}</button>
          <button class="studio-cell-button" data-device="mobilePortrait" type="button" title="Mobile view">${icon.mobile}</button>
        </div>

        <div class="studio-toolbar__zone studio-toolbar__zone--right">
          <button id="btn-preview" class="studio-cell-button" type="button" title="Preview">${icon.eye}</button>
        </div>
      </div>

      <div class="studio-workspace">
        <main class="studio-stage">
          <div class="studio-stage__surface">
            <div id="gjs"></div>
          </div>
        </main>

        <aside class="studio-dock">
          <div class="studio-dock__panel">
            <div class="studio-dock__body">

              <!-- CONTENT TAB — GrapesJS native blocks with drag-and-drop -->
              <section class="studio-panel studio-panel--content is-active" data-dock-panel="content">
                <div id="builder-blocks-host" class="studio-blocks-host">
                  <div id="builder-blocks" class="studio-blocks"></div>
                </div>
              </section>

              <!-- BLOCKS TAB — Column layout structures matching Unlayer -->
              <section class="studio-panel studio-panel--blocks" data-dock-panel="blocks">
                <div class="studio-blocks-heading">Blank</div>
                <div class="studio-layout-grid" id="layout-blocks-grid">
                  <!-- Layout blocks are rendered by JS -->
                </div>
              </section>

              <!-- BODY TAB — Settings matching Unlayer's General section -->
              <section class="studio-panel studio-panel--body" data-dock-panel="body">
                <div class="studio-body-section">
                  <div class="studio-body-section__title">
                    <span>General</span>
                  </div>

                  <form id="body-settings-form" class="studio-body-form">
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Text Color</label>
                      <div class="studio-body-row__control">
                        <input id="body-text-color" type="color" value="#000000" />
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Background Color</label>
                      <div class="studio-body-row__control">
                        <input id="body-email-background" type="color" value="#ffffff" />
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Content Width</label>
                      <div class="studio-body-row__control studio-body-row__control--stepper">
                        <input id="body-content-width" type="number" min="320" max="900" step="10" value="600" />
                        <span class="studio-stepper-unit">px</span>
                        <button type="button" class="studio-stepper-btn" data-stepper="body-content-width" data-dir="-1">−</button>
                        <button type="button" class="studio-stepper-btn" data-stepper="body-content-width" data-dir="1">+</button>
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Content Alignment</label>
                      <div class="studio-body-row__control studio-body-row__control--toggle">
                        <button type="button" class="studio-toggle-btn" data-align="left" id="body-align-left" title="Left">
                          <svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h12M3 18h18"></path></svg>
                        </button>
                        <button type="button" class="studio-toggle-btn is-active" data-align="center" id="body-align-center" title="Center">
                          <svg viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M3 18h18"></path></svg>
                        </button>
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Font Family</label>
                      <div class="studio-body-row__control">
                        <select id="body-font-family">
                          <option value="Arial, Helvetica, sans-serif">Arial</option>
                          <option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</option>
                          <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                          <option value="Verdana, Geneva, sans-serif">Verdana</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="'Times New Roman', Times, serif">Times New Roman</option>
                          <option value="'Courier New', Courier, monospace">Courier New</option>
                        </select>
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Font Weight</label>
                      <div class="studio-body-row__control">
                        <select id="body-font-weight">
                          <option value="400">Regular</option>
                          <option value="500">Medium</option>
                          <option value="600">Semi Bold</option>
                          <option value="700">Bold</option>
                        </select>
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Preheader Text</label>
                      <div class="studio-body-row__control">
                        <input id="body-preheader" type="text" placeholder="Preview text in inbox" />
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Links Color</label>
                      <div class="studio-body-row__control">
                        <input id="body-link-color" type="color" value="#2563eb" />
                      </div>
                    </div>
                    <div class="studio-body-row">
                      <label class="studio-body-row__label">Canvas Background</label>
                      <div class="studio-body-row__control">
                        <input id="body-canvas-background" type="color" value="#f3f5f8" />
                      </div>
                    </div>
                  </form>
                </div>
              </section>

              <!-- IMAGES TAB -->
              <section class="studio-panel studio-panel--images" data-dock-panel="images">
                <div class="studio-assets__toolbar">
                  <div class="studio-search studio-search--compact">
                    ${icon.search}
                    <input id="asset-url-input" type="url" placeholder="Paste image URL" />
                  </div>
                  <button id="asset-add-url" class="studio-button studio-button--secondary" type="button">Add URL</button>
                  <label class="studio-button studio-button--secondary studio-upload-button">
                    ${icon.upload}
                    <span>Upload</span>
                    <input id="asset-upload-input" type="file" accept="image/*" hidden />
                  </label>
                </div>

                <div id="asset-hint" class="studio-panel-note">
                  Open this panel to manage your image library or choose an image for the selected block.
                </div>

                <div id="asset-grid" class="studio-asset-grid"></div>
              </section>

              <!-- SELECTION / PROPERTIES PANEL — shown when component is selected -->
              <section class="studio-panel studio-panel--selection" data-dock-panel="selection">
                <div class="studio-selection-header">
                  <button id="btn-selection-back" class="studio-selection-back" type="button" title="Back to content">
                    ${icon.back}
                  </button>
                  <strong id="selection-title">Selected Block</strong>
                </div>

                <div id="selection-empty" class="studio-empty">
                  <div class="studio-empty__icon">${icon.contentTab}</div>
                  <strong>No content selected</strong>
                  <p>Click on any element in the canvas to edit its properties.</p>
                </div>

                <div id="selection-pane" class="studio-selection is-hidden">
                  <div class="studio-subtabs">
                    <button class="studio-subtab is-active" data-selection-tab="content" type="button">Content</button>
                    <button class="studio-subtab" data-selection-tab="style" type="button">Design</button>
                  </div>

	                  <div class="studio-selection__panel is-active" data-selection-panel="content">
	                    <div id="selection-custom-content" class="studio-selection-custom is-hidden"></div>
	                    <div id="selection-default-content" class="studio-selection-default">
	                      <div id="builder-traits" class="builder-traits"></div>
	                      <div class="studio-structure">
	                        <div class="studio-section-heading">
	                          ${icon.layers}
	                          <span>Structure</span>
	                        </div>
	                        <div id="builder-layers" class="builder-layers"></div>
	                      </div>
	                    </div>
	                  </div>

                  <div class="studio-selection__panel" data-selection-panel="style">
                    <div id="selection-style-host" class="studio-selection__style-host">
                      <div id="builder-styles" class="builder-styles"></div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>

          <div class="studio-dock__rail">
            <button class="studio-rail-button is-active" data-dock="content" type="button">
              ${icon.contentTab}
              <span>Content</span>
            </button>
            <button class="studio-rail-button" data-dock="blocks" type="button">
              ${icon.blocksTab}
              <span>Blocks</span>
            </button>
            <button class="studio-rail-button" data-dock="body" type="button">
              ${icon.bodyTab}
              <span>Body</span>
            </button>
            <button class="studio-rail-button" data-dock="images" type="button">
              ${icon.imageTab}
              <span>Images</span>
            </button>
          </div>
        </aside>
      </div>
    </div>

    <div id="template-modal" class="studio-modal" aria-hidden="true">
      <div class="studio-modal__dialog">
        <div class="studio-modal__head">
          <div>
            <strong>Templates</strong>
            <p>Start from a curated layout or a clean email canvas.</p>
          </div>
          <button class="studio-modal__close" id="btn-close-template-modal" type="button">&times;</button>
        </div>
        <div id="template-grid" class="studio-template-grid"></div>
      </div>
    </div>

    <div id="export-modal" class="studio-modal" aria-hidden="true">
      <div class="studio-modal__dialog studio-modal__dialog--wide">
        <div class="studio-modal__head">
          <div>
            <strong>Production HTML</strong>
            <p>Copy or download email-safe output for your sender.</p>
          </div>
          <button class="studio-modal__close" id="btn-close-export-modal" type="button">&times;</button>
        </div>
        <textarea id="export-code" class="studio-export-code" spellcheck="false" readonly></textarea>
        <div class="studio-modal__foot">
          <span>Inline styles are preserved where possible for stronger inbox compatibility.</span>
          <div class="studio-modal__actions">
            <button id="btn-copy-html" class="studio-button studio-button--secondary" type="button">Copy HTML</button>
            <button id="btn-download-html" class="studio-button studio-button--primary" type="button">Download HTML</button>
          </div>
        </div>
      </div>
    </div>

    <div id="test-email-modal" class="studio-modal" aria-hidden="true">
      <div class="studio-modal__dialog studio-modal__dialog--compact">
        <div class="studio-modal__head">
          <div>
            <strong>Send Test Email</strong>
            <p>Send the current template to yourself or a teammate for inbox review.</p>
          </div>
          <button class="studio-modal__close" id="btn-close-test-email-modal" type="button">&times;</button>
        </div>
        <div class="studio-modal__body studio-modal__body--padded">
          <form id="test-email-form" class="studio-test-email-form">
            <label class="studio-test-email-field" for="test-email-recipient">
              <span>Recipient email</span>
              <input id="test-email-recipient" type="email" placeholder="name@example.com" autocomplete="email" required />
            </label>
            <p class="studio-test-email-note">
              The builder sends the same HTML used for export, including inlined CSS. Make sure all images use public URLs before sending.
            </p>
            <div id="test-email-feedback" class="studio-test-email-feedback" aria-live="polite"></div>
          </form>
        </div>
        <div class="studio-modal__foot">
          <span>Test sends use your configured SMTP account.</span>
          <div class="studio-modal__actions">
            <button id="btn-cancel-test-email" class="studio-button studio-button--secondary" type="button">Cancel</button>
            <button id="btn-send-test-email" class="studio-button studio-button--primary" type="submit" form="test-email-form">Send Test Email</button>
          </div>
        </div>
      </div>
    </div>

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

    <div id="builder-toast" class="studio-toast" aria-live="polite"></div>
  `;

  return {
    shellRoot: root.querySelector('.studio-shell'),
    saveStatus: root.querySelector('#save-status'),
    templateModal: root.querySelector('#template-modal'),
    exportModal: root.querySelector('#export-modal'),
    testEmailModal: root.querySelector('#test-email-modal'),
    templateGrid: root.querySelector('#template-grid'),
    exportCode: root.querySelector('#export-code'),
    testEmailForm: root.querySelector('#test-email-form'),
    testEmailInput: root.querySelector('#test-email-recipient'),
    testEmailFeedback: root.querySelector('#test-email-feedback'),
    testEmailSubmit: root.querySelector('#btn-send-test-email'),
    toast: root.querySelector('#builder-toast'),
    dockButtons: Array.from(root.querySelectorAll('[data-dock]')),
    dockPanels: Array.from(root.querySelectorAll('[data-dock-panel]')),
    blocksHost: root.querySelector('#builder-blocks-host'),
    blockLibraryRoot: root.querySelector('#builder-blocks'),
    // Layout blocks grid
    layoutGrid: root.querySelector('#layout-blocks-grid'),
    // Selection panel
    selectionHeader: root.querySelector('.studio-selection-header'),
    selectionTitle: root.querySelector('#selection-title'),
    selectionBack: root.querySelector('#btn-selection-back'),
    selectionEmpty: root.querySelector('#selection-empty'),
    selectionPane: root.querySelector('#selection-pane'),
	    selectionTabs: Array.from(root.querySelectorAll('[data-selection-tab]')),
	    selectionPanels: Array.from(root.querySelectorAll('[data-selection-panel]')),
	    selectionCustomContent: root.querySelector('#selection-custom-content'),
	    selectionDefaultContent: root.querySelector('#selection-default-content'),
	    selectionStyleHost: root.querySelector('#selection-style-host'),
    builderStylesRoot: root.querySelector('#builder-styles'),
    // Assets
    assetHint: root.querySelector('#asset-hint'),
    assetGrid: root.querySelector('#asset-grid'),
    assetUrlInput: root.querySelector('#asset-url-input'),
    assetAddUrl: root.querySelector('#asset-add-url'),
    assetUploadInput: root.querySelector('#asset-upload-input'),
    // Body settings form
    bodySettingsForm: root.querySelector('#body-settings-form'),
    saveTemplateModal: root.querySelector('#save-template-modal'),
    saveTemplateForm: root.querySelector('#save-template-form'),
    saveTemplateInput: root.querySelector('#save-template-name'),
    saveTemplateFeedback: root.querySelector('#save-template-feedback'),
    saveTemplateSubmit: root.querySelector('#btn-confirm-save-template'),
  };
};
