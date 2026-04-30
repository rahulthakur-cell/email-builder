(function (global) {
  const blockLabel = (shortName, title, copy) => `
    <div style="display:grid; gap:9px; text-align:left;">
      <div
        style="
          width:44px;
          height:44px;
          border-radius:14px;
          border:1px solid #e7e5e4;
          background:linear-gradient(180deg, #ffffff 0%, #f5f5f4 100%);
          display:grid;
          place-items:center;
          box-shadow:0 10px 24px rgba(15, 23, 42, 0.07);
          color:#111827;
          font-size:12px;
          font-weight:700;
          letter-spacing:0.08em;
        "
      >
        ${shortName}
      </div>
      <div style="font-size:13px; font-weight:600; color:#111827;">${title}</div>
      <div style="font-size:11px; line-height:1.45; color:#78716c;">${copy}</div>
    </div>
  `;

  const tonePalette = {
    'tone-oat': { background: '#f8f7f4', accent: '#efece6' },
    'tone-stone': { background: '#f5f5f4', accent: '#ece7de' },
    'tone-sage': { background: '#eef6f0', accent: '#d8ead9' },
  };

  const safeFontOptions = [
    { id: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { id: '\'Trebuchet MS\', Helvetica, sans-serif', label: 'Trebuchet MS' },
    { id: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
    { id: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
    { id: 'Georgia, serif', label: 'Georgia' },
    { id: '\'Times New Roman\', Times, serif', label: 'Times New Roman' },
    { id: '\'Courier New\', Courier, monospace', label: 'Courier New' },
  ];

  const renderButton = (label, href = '#', opts = {}) => {
    if (!label) return '';

    const { variant = 'primary', align = 'center', compact = false } = opts;
    const isSecondary = variant === 'secondary';
    const tableAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
    const tableStyle = align === 'center' ? 'margin:0 auto;' : align === 'right' ? 'margin-left:auto;' : '';
    const cellStyle = [
      `border-radius:${compact ? '999px' : '8px'};`,
      `background:${isSecondary ? '#ffffff' : '#111827'};`,
      isSecondary ? 'border:1px solid #d6d3d1;' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const linkStyle = [
      'display:inline-block;',
      `padding:${compact ? '10px 16px' : '12px 20px'};`,
      'font-family:Arial, Helvetica, sans-serif;',
      `font-size:${compact ? '13px' : '14px'};`,
      'font-weight:700;',
      'line-height:1.1;',
      `color:${isSecondary ? '#111827' : '#ffffff'};`,
      'text-decoration:none;',
      'mso-line-height-rule:exactly;',
    ].join(' ');

    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="${tableAlign}" style="${tableStyle}">
        <tr>
          <td style="${cellStyle}">
            <a href="${href || '#'}" style="${linkStyle}">${label}</a>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderPill = (text) =>
    text
      ? `<span style="display:inline-block; padding:6px 12px; border-radius:20px; background:#f8f7f4; color:#57534e; font-size:12px; font-weight:600; border:1px solid #e7e5e4;">${text}</span>`
      : '';

  const renderInlineLinks = (items, styles = {}) =>
    items
      .filter((item) => item && item.label)
      .map((item, index) => {
        const divider = index ? `<span style="color:${styles.dividerColor || '#c4bdb3'}; padding:0 8px;">&bull;</span>` : '';
        return `${divider}<a href="${item.url || '#'}" style="color:${styles.color || '#57534e'}; text-decoration:none; font-size:${styles.fontSize || '12px'}; font-weight:${styles.fontWeight || '600'};">${item.label}</a>`;
      })
      .join('');

  const buildProductCard = ({
    productTag,
    productName,
    productPrice,
    productCopy,
    visualTone,
    productImage,
    productAlt,
    productButtonText,
    productHref,
  }) => {
    const palette = tonePalette[visualTone] || tonePalette['tone-oat'];
    const mediaMarkup = productImage
      ? `
          <tr>
            <td style="padding:0;">
              <img src="${productImage}" alt="${productAlt || productName}" style="display:block; width:100%; max-width:100%; height:auto; border:0; border-radius:16px 16px 0 0;" />
            </td>
          </tr>
        `
      : `
          <tr>
            <td style="padding:24px 20px 0;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:${palette.accent}; border-radius:12px;">
                <tr>
                  <td height="160" align="center" valign="middle" style="font-size:13px; color:#78716c; letter-spacing:0.04em;">
                    Add product image
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;

    return `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border:1px solid #ece8e1; border-radius:16px; background:${palette.background}; border-collapse:separate;">
        ${mediaMarkup}
        <tr>
          <td style="padding:${productImage ? '20px' : '16px 20px 20px'}; text-align:left;">
            ${productTag ? `<span style="display:inline-block; padding:6px 10px; border-radius:999px; background:#ffffff; border:1px solid #e7e5e4; color:#57534e; font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">${productTag}</span>` : ''}
            <div style="font-size:12px; line-height:12px;">&nbsp;</div>
            <strong style="display:block; font-size:20px; line-height:1.3; color:#111827;">${productName}</strong>
            <div style="font-size:10px; line-height:10px;">&nbsp;</div>
            <p style="margin:0; font-size:14px; line-height:1.7; color:#57534e;">${productCopy}</p>
            <div style="font-size:16px; line-height:16px;">&nbsp;</div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" valign="middle">
                  ${renderButton(productButtonText || 'View details', productHref, { variant: 'secondary', align: 'left', compact: true })}
                </td>
                <td align="right" valign="middle" style="font-size:18px; font-weight:700; color:#111827;">
                  ${productPrice}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const textTrait = (name, label) => ({ type: 'text', name, label, changeProp: true });
  const textareaTrait = (name, label) => ({ type: 'text', name, label, changeProp: true });
  const numberTrait = (name, label) => ({ type: 'number', name, label, changeProp: true });
  const checkboxTrait = (name, label) => ({
    type: 'checkbox',
    name,
    label,
    changeProp: true,
    valueTrue: true,
    valueFalse: false,
  });
  const dynamicComponentTypes = new Set([
    'site-header',
    'hero-section',
    'product-card',
    'products-section',
    'feature-carousel',
    'feature-grid',
    'testimonials-section',
    'faq-section',
    'cta-banner',
    'site-footer',
    'custom-list',
  ]);
  const traitCategories = {
    media: { id: 'media', label: 'Media' },
    content: { id: 'content', label: 'Content' },
    action: { id: 'action', label: 'Action' },
  };
  const splitItems = (value) =>
    `${value || ''}`
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const applyDynamicDelegation = (root) => {
    const ownerType = root.get('type');

    const walk = (component, currentOwnerType) => {
      component.components().forEach((child) => {
        const childType = child.get('type');

        if (dynamicComponentTypes.has(childType)) {
          return;
        }

        child.set('delegate', {
          ...(child.get('delegate') || {}),
          select: (cmp) => cmp.closestType(currentOwnerType),
          layer: (cmp) => cmp.closestType(currentOwnerType),
        });

        walk(child, currentOwnerType);
      });
    };

    walk(root, ownerType);
  };

  const bindRenderer = (model, propNames, renderContent) => {
    const update = () => {
      model.components(renderContent(model));
      applyDynamicDelegation(model);
    };
    const changeEvents = propNames.map((propName) => `change:${propName}`).join(' ');
    model.on(changeEvents, update);
    update();
  };

  const registerAssetImageTrait = (editor) => {
    const traits = editor.Traits;
    if (traits.getType('asset-image')) return;

    traits.addType('asset-image', {
      eventCapture: ['input', 'change'],

      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sb-trait-asset';
        wrapper.innerHTML = `
          <div class="sb-trait-asset__row">
            <input class="sb-trait-asset__input" type="text" placeholder="Paste image URL or choose asset" />
            <button class="sb-trait-asset__button" type="button">Choose</button>
          </div>
          <div class="sb-trait-asset__preview" data-empty="No image selected"></div>
        `;

        const input = wrapper.querySelector('.sb-trait-asset__input');
        const button = wrapper.querySelector('.sb-trait-asset__button');
        const preview = wrapper.querySelector('.sb-trait-asset__preview');
        const propName = trait.get('name');
        const setValue = (value) => {
          input.value = value || '';
          component.set(propName, value || '');
          if (value) {
            preview.innerHTML = `<img src="${value}" alt="" />`;
          } else {
            preview.innerHTML = '';
          }
        };

        button.addEventListener('click', (event) => {
          event.preventDefault();
          const assetManager = editor.AssetManager;
          assetManager.open({
            types: ['image'],
            select(asset, complete) {
              setValue(asset.getSrc());
              complete && assetManager.close();
            },
          });
        });

        return wrapper;
      },

      onEvent({ elInput, component, trait }) {
        const input = elInput.querySelector('.sb-trait-asset__input');
        component.set(trait.get('name'), input.value || '');
      },

      onUpdate({ elInput, component, trait }) {
        const value = component.get(trait.get('name')) || '';
        const input = elInput.querySelector('.sb-trait-asset__input');
        const preview = elInput.querySelector('.sb-trait-asset__preview');

        input.value = value;
        if (value) {
          preview.innerHTML = `<img src="${value}" alt="" />`;
        } else {
          preview.innerHTML = '';
        }
      },
    });

    traits.addType('dynamic-list', {
      eventCapture: ['input', 'change'],
      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sb-trait-dynamic-list';
        wrapper.innerHTML = `
          <div class="sb-dynamic-list-items"></div>
          <button class="sb-dynamic-list-add" type="button" style="width: 100%; padding: 8px; margin-top: 10px; border-radius: 6px; border: 1px dashed #ccc; background: transparent; cursor: pointer;">+ Add Item</button>
        `;

        const list = wrapper.querySelector('.sb-dynamic-list-items');
        const addBtn = wrapper.querySelector('.sb-dynamic-list-add');
        const propName = trait.get('name');

        const getItems = () => {
          let val = component.get(propName);
          if (typeof val === 'string') {
            try { val = JSON.parse(val); } catch (e) { val = []; }
          }
          return Array.isArray(val) ? val : [];
        };
        const setItems = (items) => {
          // GrapesJS needs a new array reference or deep clone to detect changes sometimes
          component.set(propName, JSON.parse(JSON.stringify(items)));
        };

        const renderItems = () => {
          list.innerHTML = '';
          const items = getItems();
          items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.style.marginBottom = '10px';
            itemEl.style.padding = '10px';
            itemEl.style.border = '1px solid #eee';
            itemEl.style.borderRadius = '6px';
            itemEl.innerHTML = `
              <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                <label style="font-size: 11px; font-weight: bold; color: #555;">Item ${index + 1}</label>
                <button type="button" data-index="${index}" class="sb-dynamic-list-remove" style="color:red; background:none; border:none; cursor:pointer;">&times;</button>
              </div>
              <input type="text" data-index="${index}" data-key="label" value="${item.label || ''}" placeholder="Label" style="width:100%; box-sizing:border-box; margin-bottom:6px; border-radius:4px; border:1px solid #ccc; padding:6px; font-size:12px;">
              <input type="text" data-index="${index}" data-key="url" value="${item.url || ''}" placeholder="URL" style="width:100%; box-sizing:border-box; border-radius:4px; border:1px solid #ccc; padding:6px; font-size:12px;">
            `;
            list.appendChild(itemEl);
          });
        };

        addBtn.addEventListener('click', () => {
          setItems([...getItems(), { label: 'New Link', url: '#' }]);
          renderItems();
        });

        list.addEventListener('input', (e) => {
          if (e.target.tagName === 'INPUT') {
            const index = e.target.getAttribute('data-index');
            const key = e.target.getAttribute('data-key');
            const items = [...getItems()];
            items[index] = { ...items[index], [key]: e.target.value };
            setItems(items);
          }
        });

        list.addEventListener('click', (e) => {
          if (e.target.classList.contains('sb-dynamic-list-remove')) {
            const index = e.target.getAttribute('data-index');
            const items = [...getItems()];
            items.splice(index, 1);
            setItems(items);
            renderItems();
          }
        });

        setTimeout(renderItems, 0);
        return wrapper;
      },
      onEvent() { },
      onUpdate() { },
    });
  };

  const renderHeader = (model) => {
    const navItems = Array.isArray(model.get('navItems')) ? model.get('navItems') : [];
    const actions = [
      model.get('secondaryCta')
        ? `<td class="responsive-td" align="center" style="padding:0 6px 0 0;">${renderButton(model.get('secondaryCta'), model.get('secondaryCtaLink'), { variant: 'secondary' })}</td>`
        : '',
      model.get('primaryCta')
        ? `<td class="responsive-td" align="center" style="padding:0 0 0 6px;">${renderButton(model.get('primaryCta'), model.get('primaryCtaLink'))}</td>`
        : '',
    ]
      .filter(Boolean)
      .join('');

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:24px 20px 14px;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                ${model.get('brandInitials')
                  ? `
                    <td valign="top" style="width:52px; padding-right:14px;">
                      <table role="presentation" width="44" border="0" cellpadding="0" cellspacing="0" style="background:#111827; border-radius:14px;">
                        <tr>
                          <td align="center" height="44" style="font-size:13px; font-weight:700; color:#ffffff; letter-spacing:0.08em;">
                            ${model.get('brandInitials')}
                          </td>
                        </tr>
                      </table>
                    </td>
                  `
                  : ''}
                <td valign="middle" align="left">
                  ${model.get('brandName') ? `<strong style="display:block; font-size:20px; line-height:1.2; color:#111827;">${model.get('brandName')}</strong>` : ''}
                  ${model.get('brandTagline') ? `<span style="display:block; margin-top:6px; font-size:13px; line-height:1.6; color:#57534e;">${model.get('brandTagline')}</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${navItems.length
          ? `
            <tr>
              <td align="center" style="padding:0 20px 18px; border-top:1px solid #ece8e1; border-bottom:1px solid #ece8e1;">
                <div style="padding:13px 0 12px;">
                  ${renderInlineLinks(navItems)}
                </div>
              </td>
            </tr>
          `
          : ''}
        ${actions
          ? `
            <tr>
              <td style="padding:20px 20px 24px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>${actions}</tr>
                </table>
              </td>
            </tr>
          `
          : ''}
      </table>
    `.trim();
  };

  const renderHero = (model) => {
    const heroButtons = [
      model.get('heroPrimaryCta')
        ? `<td class="responsive-td" align="center" style="padding:0 6px 0 0;">${renderButton(model.get('heroPrimaryCta'), model.get('heroPrimaryCtaLink'))}</td>`
        : '',
      model.get('heroSecondaryCta')
        ? `<td class="responsive-td" align="center" style="padding:0 0 0 6px;">${renderButton(model.get('heroSecondaryCta'), model.get('heroSecondaryCtaLink'), { variant: 'secondary' })}</td>`
        : '',
    ]
      .filter(Boolean)
      .join('');

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:40px 20px; text-align:center;">
            ${renderPill(model.get('heroEyebrow'))}
            <h1 style="margin:18px 0 16px; font-size:36px; line-height:1.2; color:#111827;">${model.get('heroTitle')}</h1>
            <p style="margin:0 auto 28px; max-width:480px; font-size:16px; line-height:1.7; color:#57534e;">${model.get('heroText')}</p>
            ${heroButtons
              ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>${heroButtons}</tr>
                </table>
              `
              : ''}
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:32px; background:#f8f7f4; border:1px solid #ece8e1; border-radius:14px;">
              <tr>
                <td class="responsive-td" width="33.33%" align="center" style="padding:18px 12px;">
                  <strong style="display:block; font-size:24px; line-height:1.1; color:#111827;">${model.get('statOneValue')}</strong>
                  <span style="display:block; margin-top:6px; font-size:12px; line-height:1.5; color:#78716c;">${model.get('statOneLabel')}</span>
                </td>
                <td class="responsive-td" width="33.33%" align="center" style="padding:18px 12px;">
                  <strong style="display:block; font-size:24px; line-height:1.1; color:#111827;">${model.get('statTwoValue')}</strong>
                  <span style="display:block; margin-top:6px; font-size:12px; line-height:1.5; color:#78716c;">${model.get('statTwoLabel')}</span>
                </td>
                <td class="responsive-td" width="33.33%" align="center" style="padding:18px 12px;">
                  <strong style="display:block; font-size:24px; line-height:1.1; color:#111827;">${model.get('statThreeValue')}</strong>
                  <span style="display:block; margin-top:6px; font-size:12px; line-height:1.5; color:#78716c;">${model.get('statThreeLabel')}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderProductsSectionCard = (model, prefix) =>
    buildProductCard({
      productTag: model.get(`${prefix}Tag`),
      productName: model.get(`${prefix}Name`),
      productPrice: model.get(`${prefix}Price`),
      productCopy: model.get(`${prefix}Copy`),
      productImage: model.get(`${prefix}Image`),
      productAlt: model.get(`${prefix}Alt`),
      productButtonText: model.get(`${prefix}ButtonText`),
      productHref: model.get(`${prefix}Href`),
      visualTone: model.get(`${prefix}Tone`),
    });

  const renderProductsSection = (model) => `
    <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
      <tr>
        <td style="padding:40px 20px 20px; text-align:center;">
          ${renderPill(model.get('productsEyebrow'))}
          <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#111827;">${model.get('productsTitle')}</h2>
          <p style="margin:0 auto; max-width:480px; font-size:15px; line-height:1.7; color:#57534e;">${model.get('productsText')}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 20px;">
          ${renderProductsSectionCard(model, 'productOne')}
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 40px;">
          ${renderProductsSectionCard(model, 'productTwo')}
        </td>
      </tr>
    </table>
  `.trim();

  const renderCarousel = (model) => {
    const slides = [
      {
        title: model.get('slideOneTitle'),
        text: model.get('slideOneText'),
        cta: model.get('slideOneCta'),
        href: model.get('slideOneHref'),
      },
      {
        title: model.get('slideTwoTitle'),
        text: model.get('slideTwoText'),
        cta: model.get('slideTwoCta'),
        href: model.get('slideTwoHref'),
      },
      {
        title: model.get('slideThreeTitle'),
        text: model.get('slideThreeText'),
        cta: model.get('slideThreeCta'),
        href: model.get('slideThreeHref'),
      },
    ];

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:40px 20px 20px; text-align:center;">
            ${renderPill(model.get('carouselEyebrow'))}
            <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#111827;">${model.get('carouselTitle')}</h2>
            <p style="margin:0 auto; max-width:480px; font-size:15px; line-height:1.7; color:#57534e;">${model.get('carouselText')}</p>
          </td>
        </tr>
        ${slides
          .map(
            (slide, index) => `
              <tr>
                <td style="padding:0 20px ${index === slides.length - 1 ? '40px' : '18px'};">
                  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#fafaf9; border:1px solid #ece8e1; border-radius:16px;">
                    <tr>
                      <td style="padding:24px 20px; text-align:left;">
                        <span style="display:inline-block; margin-bottom:12px; font-size:12px; font-weight:700; letter-spacing:0.08em; color:#78716c;">0${index + 1}</span>
                        <strong style="display:block; font-size:22px; line-height:1.35; color:#111827;">${slide.title}</strong>
                        <p style="margin:12px 0 18px; font-size:14px; line-height:1.7; color:#57534e;">${slide.text}</p>
                        ${renderButton(slide.cta, slide.href, { align: 'left', compact: true })}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            `,
          )
          .join('')}
      </table>
    `.trim();
  };

  const renderFeatureGrid = (model) => {
    const features = [
      { number: '01', title: model.get('featureOneTitle'), text: model.get('featureOneText') },
      { number: '02', title: model.get('featureTwoTitle'), text: model.get('featureTwoText') },
      { number: '03', title: model.get('featureThreeTitle'), text: model.get('featureThreeText') },
    ];

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:40px 20px; text-align:center;">
            ${renderPill(model.get('featuresEyebrow'))}
            <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#111827;">${model.get('featuresTitle')}</h2>
            <p style="margin:0 auto 24px; max-width:480px; font-size:15px; line-height:1.7; color:#57534e;">${model.get('featuresText')}</p>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                ${features
                  .map(
                    (feature) => `
                      <td class="responsive-td" width="33.33%" valign="top" style="padding:10px; text-align:center;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="40" style="margin:0 auto 12px; background:#111827; border-radius:999px;">
                          <tr>
                            <td height="40" align="center" style="font-size:13px; font-weight:700; color:#ffffff;">${feature.number}</td>
                          </tr>
                        </table>
                        <strong style="display:block; font-size:18px; line-height:1.35; color:#111827;">${feature.title}</strong>
                        <p style="margin:10px 0 0; font-size:14px; line-height:1.7; color:#57534e;">${feature.text}</p>
                      </td>
                    `,
                  )
                  .join('')}
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderTestimonials = (model) => {
    const quotes = [
      { quote: model.get('quoteOne'), name: model.get('quoteOneName'), role: model.get('quoteOneRole') },
      { quote: model.get('quoteTwo'), name: model.get('quoteTwoName'), role: model.get('quoteTwoRole') },
      { quote: model.get('quoteThree'), name: model.get('quoteThreeName'), role: model.get('quoteThreeRole') },
    ];

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:40px 20px; text-align:center;">
            ${renderPill(model.get('testimonialsEyebrow'))}
            <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#111827;">${model.get('testimonialsTitle')}</h2>
            <p style="margin:0 auto 24px; max-width:480px; font-size:15px; line-height:1.7; color:#57534e;">${model.get('testimonialsText')}</p>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                ${quotes
                  .map(
                    (quote) => `
                      <td class="responsive-td" width="33.33%" valign="top" style="padding:10px;">
                        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="height:100%; background:#fafaf9; border:1px solid #ece8e1; border-radius:16px;">
                          <tr>
                            <td style="padding:22px 18px; text-align:left;">
                              <p style="margin:0 0 16px; font-size:16px; line-height:1.75; color:#334155;">${quote.quote}</p>
                              <strong style="display:block; font-size:14px; line-height:1.4; color:#111827;">${quote.name}</strong>
                              <span style="display:block; margin-top:4px; font-size:12px; line-height:1.5; color:#78716c;">${quote.role}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    `,
                  )
                  .join('')}
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderFaq = (model) => {
    const answers = [
      { question: model.get('faqOneQuestion'), answer: model.get('faqOneAnswer') },
      { question: model.get('faqTwoQuestion'), answer: model.get('faqTwoAnswer') },
      { question: model.get('faqThreeQuestion'), answer: model.get('faqThreeAnswer') },
    ];

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:40px 20px;">
            <div style="text-align:center;">
              ${renderPill(model.get('faqEyebrow'))}
              <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#111827;">${model.get('faqTitle')}</h2>
              <p style="margin:0 auto 24px; max-width:480px; font-size:15px; line-height:1.7; color:#57534e;">${model.get('faqText')}</p>
            </div>
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              ${answers
                .map(
                  (item) => `
                    <tr>
                      <td style="padding:0 0 16px;">
                        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:#fafaf9; border:1px solid #ece8e1; border-radius:14px;">
                          <tr>
                            <td style="padding:20px 18px;">
                              <strong style="display:block; font-size:17px; line-height:1.45; color:#111827;">${item.question}</strong>
                              <p style="margin:10px 0 0; font-size:14px; line-height:1.75; color:#57534e;">${item.answer}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  `,
                )
                .join('')}
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderCtaBanner = (model) => {
    const buttons = [
      model.get('ctaPrimary')
        ? `<td class="responsive-td" align="center" style="padding:0 6px 0 0;">${renderButton(model.get('ctaPrimary'), model.get('ctaPrimaryLink'), { variant: 'secondary' })}</td>`
        : '',
      model.get('ctaSecondary')
        ? `<td class="responsive-td" align="center" style="padding:0 0 0 6px;">${renderButton(model.get('ctaSecondary'), model.get('ctaSecondaryLink'))}</td>`
        : '',
    ]
      .filter(Boolean)
      .join('');

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#111827; color:#ffffff; border-radius:16px;">
        <tr>
          <td style="padding:40px 20px; text-align:center;">
            ${renderPill(model.get('ctaEyebrow'))}
            <h2 style="margin:18px 0 14px; font-size:28px; line-height:1.25; color:#ffffff;">${model.get('ctaTitle')}</h2>
            <p style="margin:0 auto 28px; max-width:460px; font-size:16px; line-height:1.7; color:#e7e5e4;">${model.get('ctaText')}</p>
            ${buttons
              ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                  <tr>${buttons}</tr>
                </table>
              `
              : ''}
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderFooter = (model) => {
    const col1Links = Array.isArray(model.get('col1Links')) ? model.get('col1Links') : [];
    const col2Links = Array.isArray(model.get('col2Links')) ? model.get('col2Links') : [];
    const col3Lines = [model.get('col3Text1'), model.get('col3Text2'), model.get('col3Text3')].filter(Boolean);
    const renderColumnLinks = (links) =>
      links
        .filter((link) => link && link.label)
        .map(
          (link) => `
            <tr>
              <td style="padding:0 0 8px;">
                <a href="${link.url || '#'}" style="font-size:13px; line-height:1.6; color:#57534e; text-decoration:none;">${link.label}</a>
              </td>
            </tr>
          `,
        )
        .join('');

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#fafaf9; border-top:1px solid #ece8e1;">
        <tr>
          <td style="padding:32px 20px 20px;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                ${model.get('footerInitials')
                  ? `
                    <td valign="top" style="width:52px; padding-right:14px;">
                      <table role="presentation" width="44" border="0" cellpadding="0" cellspacing="0" style="background:#111827; border-radius:14px;">
                        <tr>
                          <td align="center" height="44" style="font-size:13px; font-weight:700; color:#ffffff; letter-spacing:0.08em;">
                            ${model.get('footerInitials')}
                          </td>
                        </tr>
                      </table>
                    </td>
                  `
                  : ''}
                <td valign="top" align="left">
                  ${model.get('footerBrand') ? `<strong style="display:block; font-size:20px; line-height:1.2; color:#111827;">${model.get('footerBrand')}</strong>` : ''}
                  ${model.get('footerTagline') ? `<span style="display:block; margin-top:6px; font-size:13px; line-height:1.6; color:#57534e;">${model.get('footerTagline')}</span>` : ''}
                  ${model.get('footerText') ? `<p style="margin:14px 0 0; font-size:14px; line-height:1.8; color:#57534e;">${model.get('footerText')}</p>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 20px 24px;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td class="responsive-td" width="33.33%" valign="top" style="padding:0 10px 14px 0;">
                  ${model.get('col1Title') ? `<strong style="display:block; margin-bottom:12px; font-size:12px; line-height:1.5; color:#111827; letter-spacing:0.08em; text-transform:uppercase;">${model.get('col1Title')}</strong>` : ''}
                  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                    ${renderColumnLinks(col1Links)}
                  </table>
                </td>
                <td class="responsive-td" width="33.33%" valign="top" style="padding:0 10px 14px;">
                  ${model.get('col2Title') ? `<strong style="display:block; margin-bottom:12px; font-size:12px; line-height:1.5; color:#111827; letter-spacing:0.08em; text-transform:uppercase;">${model.get('col2Title')}</strong>` : ''}
                  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                    ${renderColumnLinks(col2Links)}
                  </table>
                </td>
                <td class="responsive-td" width="33.33%" valign="top" style="padding:0 0 14px 10px;">
                  ${model.get('col3Title') ? `<strong style="display:block; margin-bottom:12px; font-size:12px; line-height:1.5; color:#111827; letter-spacing:0.08em; text-transform:uppercase;">${model.get('col3Title')}</strong>` : ''}
                  ${col3Lines
                    .map(
                      (line) => `
                        <span style="display:block; margin-bottom:8px; font-size:13px; line-height:1.6; color:#57534e;">
                          ${line}
                        </span>
                      `,
                    )
                    .join('')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px 24px; border-top:1px solid #ece8e1;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td class="responsive-td" align="left" style="font-size:12px; line-height:1.6; color:#78716c;">
                  ${model.get('footerMetaLeft')}
                </td>
                <td class="responsive-td" align="right" style="font-size:12px; line-height:1.6; color:#78716c;">
                  ${model.get('footerMetaRight')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderCustomList = (model) => {
    const listItems = Array.isArray(model.get('listItems')) ? model.get('listItems') : [];

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:#ffffff;">
        <tr>
          <td style="padding:28px 20px;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              ${listItems
                .map(
                  (item) => `
                    <tr>
                      <td valign="top" style="width:18px; padding:0 10px 12px 0; font-size:16px; line-height:1.6; color:#0f766e;">&bull;</td>
                      <td valign="top" style="padding:0 0 12px; font-size:15px; line-height:1.7; color:#334155;">
                        ${item.url ? `<a href="${item.url}" style="color:#0f766e; text-decoration:none;">${item.label || 'List item'}</a>` : item.label || 'List item'}
                      </td>
                    </tr>
                  `,
                )
                .join('')}
            </table>
            ${model.get('listCta')
              ? `<div style="padding-top:10px;">${renderButton(model.get('listCta'), model.get('listCtaLink'), { align: 'left', compact: true })}</div>`
              : ''}
          </td>
        </tr>
      </table>
    `.trim();
  };

  const canvasCss = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 24px 0;
      background: #f1efeb;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
    }

    body:empty::before {
      content: "Drag email-safe blocks from the left panel to start building your template.";
      display: block;
      text-align: center;
      padding: 150px 20px;
      color: #a8a29e;
      font-size: 20px;
      line-height: 1.5;
      pointer-events: none;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    td {
      border-collapse: collapse;
    }

    img {
      display: block;
      max-width: 100%;
      height: auto;
      border: 0;
      outline: none;
      text-decoration: none;
    }

    .sb-shell {
      width: 100% !important;
      max-width: 600px !important;
      margin: 0 auto !important;
      background: #ffffff;
    }

    .sb-shell + .sb-shell {
      margin-top: 16px !important;
    }

    @media only screen and (max-width: 600px) {
      .responsive-td {
        display: block !important;
        width: 100% !important;
        text-align: center !important;
      }

      .sb-shell {
        width: 100% !important;
      }
    }
  `;

  const emailTemplates = {
    minimal: {
      name: 'Product Launch',
      description: 'A polished launch email with product highlights, story cards, and a strong footer.',
      components: [
        { type: 'site-header' },
        { type: 'hero-section' },
        { type: 'products-section' },
        { type: 'feature-carousel' },
        { type: 'testimonials-section' },
        { type: 'cta-banner' },
        { type: 'site-footer' },
      ],
    },
    welcome: {
      name: 'Welcome Series',
      description: 'A clean onboarding email with benefits, a primary CTA, and a simple footer.',
      components: [
        { type: 'site-header' },
        {
          type: 'hero-section',
          heroEyebrow: 'Hello {{name}}',
          heroTitle: 'Welcome to the list. Your first curated email starts here.',
          heroText: 'Use this template for welcome flows, onboarding sequences, or first-purchase nudges with safe export-ready email markup.',
          heroPrimaryCta: 'Explore what is new',
          heroSecondaryCta: 'Manage preferences',
        },
        { type: 'feature-grid' },
        { type: 'cta-banner', ctaTitle: 'Start with your strongest welcome CTA.', ctaPrimary: 'View collection', ctaSecondary: 'Read the guide' },
        { type: 'site-footer' }
      ],
    },
    newsletter: {
      name: 'Monthly Newsletter',
      description: 'A reusable update email with editorial cards, bullet links, and a lighter promotional rhythm.',
      components: [
        { type: 'site-header' },
        {
          type: 'hero-section',
          heroEyebrow: 'April Update',
          heroTitle: "What shipped this month, and what is coming next.",
          heroText: 'Mix top stories, product notes, release highlights, and customer updates inside one email-safe layout.',
          heroPrimaryCta: 'Read the full issue',
          heroSecondaryCta: 'Forward to your team',
        },
        {
          type: 'custom-list',
          listCta: 'Open release notes',
          listItems: [
            { label: 'New campaign builder shortcuts', url: '#' },
            { label: 'Improved image handling for exports', url: '#' },
            { label: 'Fresh template kits for product launches', url: '#' },
          ],
        },
        { type: 'feature-carousel', carouselEyebrow: 'Top stories', carouselTitle: 'Three editorial cards for your biggest updates.' },
        { type: 'site-footer' },
      ],
    },
  };

  const styleManagerSectors = () => [
    {
      name: 'Spacing',
      open: true,
      buildProps: ['width', 'max-width', 'min-height', 'margin', 'padding'],
    },
    {
      name: 'Typography',
      open: false,
      properties: [
        {
          property: 'font-family',
          name: 'Font',
          type: 'select',
          default: 'Arial, Helvetica, sans-serif',
          defaults: 'Arial, Helvetica, sans-serif',
          options: safeFontOptions,
        },
        'font-size',
        'font-weight',
        'letter-spacing',
        'line-height',
        'color',
        'text-align',
      ],
    },
    {
      name: 'Colors',
      open: false,
      buildProps: ['color', 'background-color', 'opacity'],
    },
    {
      name: 'Background',
      open: false,
      buildProps: ['background-color', 'background'],
    },
    {
      name: 'Border & Radius',
      open: false,
      buildProps: ['border', 'border-radius', 'box-shadow'],
    },
    {
      name: 'Advanced',
      open: false,
      properties: [
        {
          name: 'Vertical Align',
          property: 'vertical-align',
          type: 'select',
          default: 'top',
          defaults: 'top',
          options: [
            { id: 'top', label: 'Top' },
            { id: 'middle', label: 'Middle' },
            { id: 'bottom', label: 'Bottom' },
          ],
        },
        {
          name: 'Text Decoration',
          property: 'text-decoration',
          type: 'select',
          default: 'none',
          defaults: 'none',
          options: [
            { id: 'none', label: 'None' },
            { id: 'underline', label: 'Underline' },
          ],
        },
        {
          name: 'List Style',
          property: 'list-style-type',
          type: 'select',
          default: 'disc',
          defaults: 'disc',
          options: [
            { id: 'none', label: 'None' },
            { id: 'disc', label: 'Disc' },
            { id: 'circle', label: 'Circle' },
            { id: 'square', label: 'Square' },
            { id: 'decimal', label: 'Numbers' },
            { id: 'lower-alpha', label: 'Letters (a, b, c)' },
            { id: 'upper-alpha', label: 'Letters (A, B, C)' },
            { id: 'lower-roman', label: 'Roman (i, ii, iii)' },
            { id: 'upper-roman', label: 'Roman (I, II, III)' }
          ]
        },
        {
          name: 'Position',
          property: 'list-style-position',
          type: 'select',
          default: 'outside',
          defaults: 'outside',
          options: [
            { id: 'inside', label: 'Inside' },
            { id: 'outside', label: 'Outside' },
          ],
        },
      ],
    },
  ];

  const minimalBuilderPlugin = (editor, opts = {}) => {
    registerAssetImageTrait(editor);

    const components = editor.DomComponents;
    const blocks = editor.BlockManager;
    const sectionCategory = opts.sectionCategory || { id: 'sections', label: 'Sections', open: true };
    const commerceCategory = opts.commerceCategory || { id: 'commerce', label: 'Commerce', open: true };

    components.addType('site-header', {
      model: {
        defaults: {
          name: 'Email Header',
          tagName: 'div',
          classes: ['sb-section', 'sb-header'],
          stylable: true,
          brandInitials: 'ES',
          brandName: 'Email Studio',
          brandTagline: 'Production-ready email templates',
          navItems: [
            { label: 'Products', url: '#' },
            { label: 'Stories', url: '#' },
            { label: 'Pricing', url: '#' },
            { label: 'Support', url: '#' }
          ],
          secondaryCta: 'View templates',
          secondaryCtaLink: '#',
          primaryCta: 'Launch campaign',
          primaryCtaLink: '#',
          traits: [
            textTrait('brandInitials', 'Brand mark'),
            textTrait('brandName', 'Brand name'),
            textTrait('brandTagline', 'Brand tagline'),
            { type: 'dynamic-list', name: 'navItems', label: 'Menu items' },
            textTrait('secondaryCta', 'Secondary button'),
            textTrait('secondaryCtaLink', 'Secondary URL'),
            textTrait('primaryCta', 'Primary button'),
            textTrait('primaryCtaLink', 'Primary URL'),
          ],
        },

        init() {
          bindRenderer(
            this,
            ['brandInitials', 'brandName', 'brandTagline', 'navItems', 'secondaryCta', 'secondaryCtaLink', 'primaryCta', 'primaryCtaLink'],
            renderHeader,
          );
        },
      },
    });

    components.addType('hero-section', {
      model: {
        defaults: {
          name: 'Email Hero',
          tagName: 'div',
          classes: ['sb-section', 'sb-hero'],
          stylable: true,
          heroEyebrow: 'New release',
          heroTitle: 'Build polished email campaigns that are ready for real delivery.',
          heroText:
            'Use this hero for launches, newsletters, onboarding flows, or promotions with a safer structure for SendGrid, Mailchimp, Klaviyo, and custom senders.',
          heroPrimaryCta: 'Explore collection',
          heroPrimaryCtaLink: '#',
          heroSecondaryCta: 'See lookbook',
          heroSecondaryCtaLink: '#',
          statOneValue: '24h',
          statOneLabel: 'Draft turnaround',
          statTwoValue: '8',
          statTwoLabel: 'Email-safe sections',
          statThreeValue: '600px',
          statThreeLabel: 'Responsive max width',
          traits: [
            textTrait('heroEyebrow', 'Eyebrow'),
            textareaTrait('heroTitle', 'Hero title'),
            textareaTrait('heroText', 'Hero text'),
            textTrait('heroPrimaryCta', 'Primary button'),
            textTrait('heroPrimaryCtaLink', 'Primary URL'),
            textTrait('heroSecondaryCta', 'Secondary button'),
            textTrait('heroSecondaryCtaLink', 'Secondary URL'),
            textTrait('statOneValue', 'Stat 1 value'),
            textTrait('statOneLabel', 'Stat 1 label'),
            textTrait('statTwoValue', 'Stat 2 value'),
            textTrait('statTwoLabel', 'Stat 2 label'),
            textTrait('statThreeValue', 'Stat 3 value'),
            textTrait('statThreeLabel', 'Stat 3 label'),
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'heroEyebrow',
              'heroTitle',
              'heroText',
              'heroPrimaryCta',
              'heroPrimaryCtaLink',
              'heroSecondaryCta',
              'heroSecondaryCtaLink',
              'statOneValue',
              'statOneLabel',
              'statTwoValue',
              'statTwoLabel',
              'statThreeValue',
              'statThreeLabel',
            ],
            renderHero,
          );
        },
      },
    });

    components.addType('product-card', {
      model: {
        defaults: {
          name: 'Product Card',
          tagName: 'div',
          classes: ['sb-product-card'],
          droppable: false,
          stylable: ['background-color', 'padding', 'margin', 'border-radius', 'border'],
          productTag: 'Signature',
          productName: 'Nimbus Lamp',
          productPrice: '$148',
          productCopy: 'Soft glow, matte finish, and a shape that works in living rooms, bedrooms, and boutique displays.',
          productImage: '',
          productAlt: 'Nimbus Lamp',
          productButtonText: 'View details',
          productHref: '#',
          visualTone: 'tone-oat',
          traits: [
            { type: 'asset-image', name: 'productImage', label: 'Product image', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productAlt', label: 'Image alt', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productTag', label: 'Tag', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productName', label: 'Name', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productPrice', label: 'Price', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productCopy', label: 'Description', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productButtonText', label: 'Button text', changeProp: true, category: traitCategories.action },
            { type: 'text', name: 'productHref', label: 'Button link', changeProp: true, category: traitCategories.action },
            {
              type: 'select',
              name: 'visualTone',
              label: 'Visual tone',
              changeProp: true,
              category: traitCategories.content,
              options: [
                { id: 'tone-oat', label: 'Oat' },
                { id: 'tone-stone', label: 'Stone' },
                { id: 'tone-sage', label: 'Sage' },
              ],
            },
          ],
        },

        init() {
          const syncContent = () => {
            this.components(
              buildProductCard({
                productTag: this.get('productTag'),
                productName: this.get('productName'),
                productPrice: this.get('productPrice'),
                productCopy: this.get('productCopy'),
                productImage: this.get('productImage'),
                productAlt: this.get('productAlt'),
                productButtonText: this.get('productButtonText'),
                productHref: this.get('productHref'),
                visualTone: this.get('visualTone'),
              }),
            );
            applyDynamicDelegation(this);
          };

          this.on(
            'change:productTag change:productName change:productPrice change:productCopy change:productImage change:productAlt change:productButtonText change:productHref change:visualTone',
            syncContent,
          );
          syncContent();
        },
      },
    });

    components.addType('products-section', {
      model: {
        defaults: {
          name: 'Products Section',
          tagName: 'div',
          classes: ['sb-section', 'sb-products'],
          stylable: true,
          productsEyebrow: 'Featured products',
          productsTitle: 'Highlight the products, bundles, or offers you want people to click first.',
          productsText:
            'These product cards are built with a safer structure for email and can be edited directly from the trait panel.',
          productOneTag: 'Best seller',
          productOneName: 'Nimbus Lamp',
          productOnePrice: '$148',
          productOneCopy: 'A warm table light with a matte finish and soft premium detailing for bedrooms, reading corners, and launch emails.',
          productOneImage: '',
          productOneAlt: 'Nimbus Lamp',
          productOneButtonText: 'Shop Nimbus',
          productOneHref: '#',
          productOneTone: 'tone-oat',
          productTwoTag: 'New arrival',
          productTwoName: 'Vale Chair',
          productTwoPrice: '$320',
          productTwoCopy: 'Curved upholstery, softened edges, and a silhouette that works beautifully in product drops and seasonal promos.',
          productTwoImage: '',
          productTwoAlt: 'Vale Chair',
          productTwoButtonText: 'See Vale',
          productTwoHref: '#',
          productTwoTone: 'tone-stone',
          traits: [
            textTrait('productsEyebrow', 'Eyebrow'),
            textareaTrait('productsTitle', 'Section title'),
            textareaTrait('productsText', 'Section text'),
            { type: 'asset-image', name: 'productOneImage', label: 'Product 1 image', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productOneAlt', label: 'Product 1 alt', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productOneTag', label: 'Product 1 tag', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productOneName', label: 'Product 1 name', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productOnePrice', label: 'Product 1 price', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productOneCopy', label: 'Product 1 copy', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productOneButtonText', label: 'Product 1 button', changeProp: true, category: traitCategories.action },
            { type: 'text', name: 'productOneHref', label: 'Product 1 URL', changeProp: true, category: traitCategories.action },
            {
              type: 'select',
              name: 'productOneTone',
              label: 'Product 1 tone',
              changeProp: true,
              category: traitCategories.content,
              options: [
                { id: 'tone-oat', label: 'Oat' },
                { id: 'tone-stone', label: 'Stone' },
                { id: 'tone-sage', label: 'Sage' },
              ],
            },
            { type: 'asset-image', name: 'productTwoImage', label: 'Product 2 image', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productTwoAlt', label: 'Product 2 alt', changeProp: true, category: traitCategories.media },
            { type: 'text', name: 'productTwoTag', label: 'Product 2 tag', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productTwoName', label: 'Product 2 name', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productTwoPrice', label: 'Product 2 price', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productTwoCopy', label: 'Product 2 copy', changeProp: true, category: traitCategories.content },
            { type: 'text', name: 'productTwoButtonText', label: 'Product 2 button', changeProp: true, category: traitCategories.action },
            { type: 'text', name: 'productTwoHref', label: 'Product 2 URL', changeProp: true, category: traitCategories.action },
            {
              type: 'select',
              name: 'productTwoTone',
              label: 'Product 2 tone',
              changeProp: true,
              category: traitCategories.content,
              options: [
                { id: 'tone-oat', label: 'Oat' },
                { id: 'tone-stone', label: 'Stone' },
                { id: 'tone-sage', label: 'Sage' },
              ],
            },
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'productsEyebrow',
              'productsTitle',
              'productsText',
              'productOneTag',
              'productOneName',
              'productOnePrice',
              'productOneCopy',
              'productOneImage',
              'productOneAlt',
              'productOneButtonText',
              'productOneHref',
              'productOneTone',
              'productTwoTag',
              'productTwoName',
              'productTwoPrice',
              'productTwoCopy',
              'productTwoImage',
              'productTwoAlt',
              'productTwoButtonText',
              'productTwoHref',
              'productTwoTone',
            ],
            renderProductsSection,
          );
        },
      },
    });

    components.addType('feature-carousel', {
      model: {
        defaults: {
          name: 'Story Cards',
          tagName: 'div',
          classes: ['sb-section', 'sb-carousel'],
          stylable: true,
          carouselEyebrow: 'Top stories',
          carouselTitle: 'Three editorial cards for launches, updates, and feature highlights.',
          carouselText:
            'Use this block when you need quick cards for campaign highlights but still want the output to stay email-safe.',
          slideOneTitle: 'Lead with your most important release or featured collection.',
          slideOneText:
            'Keep the copy concise, add one strong CTA, and let the first story set the tone for the rest of the email.',
          slideOneCta: 'Open campaign',
          slideOneHref: '#',
          slideTwoTitle: 'Give the second card to a supporting offer, bundle, or helpful guide.',
          slideTwoText:
            'This format works well for content-led newsletters, product education, or secondary conversion paths.',
          slideTwoCta: 'View bundle',
          slideTwoHref: '#',
          slideThreeTitle: 'Reserve the third card for urgency, proof, or a final optional click.',
          slideThreeText:
            'Because the cards are static, the export stays cleaner and more dependable across inboxes than a web-style slider.',
          slideThreeCta: 'See new drop',
          slideThreeHref: '#',
          traits: [
            textTrait('carouselEyebrow', 'Eyebrow'),
            textareaTrait('carouselTitle', 'Section title'),
            textareaTrait('carouselText', 'Section text'),
            textareaTrait('slideOneTitle', 'Slide 1 title'),
            textareaTrait('slideOneText', 'Slide 1 text'),
            textTrait('slideOneCta', 'Slide 1 button'),
            textTrait('slideOneHref', 'Slide 1 URL'),
            textareaTrait('slideTwoTitle', 'Slide 2 title'),
            textareaTrait('slideTwoText', 'Slide 2 text'),
            textTrait('slideTwoCta', 'Slide 2 button'),
            textTrait('slideTwoHref', 'Slide 2 URL'),
            textareaTrait('slideThreeTitle', 'Slide 3 title'),
            textareaTrait('slideThreeText', 'Slide 3 text'),
            textTrait('slideThreeCta', 'Slide 3 button'),
            textTrait('slideThreeHref', 'Slide 3 URL'),
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'carouselEyebrow',
              'carouselTitle',
              'carouselText',
              'slideOneTitle',
              'slideOneText',
              'slideOneCta',
              'slideOneHref',
              'slideTwoTitle',
              'slideTwoText',
              'slideTwoCta',
              'slideTwoHref',
              'slideThreeTitle',
              'slideThreeText',
              'slideThreeCta',
              'slideThreeHref',
            ],
            renderCarousel,
          );
        },
      },
    });

    components.addType('feature-grid', {
      model: {
        defaults: {
          name: 'Benefits Grid',
          tagName: 'div',
          classes: ['sb-section', 'sb-features'],
          stylable: true,
          featuresEyebrow: 'Why it works',
          featuresTitle: 'Explain the key reasons this email or offer deserves attention.',
          featuresText:
            'These cards are useful for onboarding points, differentiators, shipping details, or launch benefits.',
          featureOneTitle: 'Email-safe markup',
          featureOneText: 'The sections are structured for easier export into real sending platforms and common inbox clients.',
          featureTwoTitle: 'Clean editing flow',
          featureTwoText: 'Update headlines, links, buttons, and product details without hunting through the canvas.',
          featureThreeTitle: 'Reusable sections',
          featureThreeText: 'Mix product, story, proof, FAQ, and footer blocks into one coherent email system.',
          traits: [
            textTrait('featuresEyebrow', 'Eyebrow'),
            textareaTrait('featuresTitle', 'Section title'),
            textareaTrait('featuresText', 'Section text'),
            textTrait('featureOneTitle', 'Feature 1 title'),
            textareaTrait('featureOneText', 'Feature 1 text'),
            textTrait('featureTwoTitle', 'Feature 2 title'),
            textareaTrait('featureTwoText', 'Feature 2 text'),
            textTrait('featureThreeTitle', 'Feature 3 title'),
            textareaTrait('featureThreeText', 'Feature 3 text'),
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'featuresEyebrow',
              'featuresTitle',
              'featuresText',
              'featureOneTitle',
              'featureOneText',
              'featureTwoTitle',
              'featureTwoText',
              'featureThreeTitle',
              'featureThreeText',
            ],
            renderFeatureGrid,
          );
        },
      },
    });

    components.addType('testimonials-section', {
      model: {
        defaults: {
          name: 'Testimonials',
          tagName: 'div',
          classes: ['sb-section', 'sb-testimonials'],
          stylable: true,
          testimonialsEyebrow: 'Social proof',
          testimonialsTitle: 'Add customer proof, partner notes, or short review quotes.',
          testimonialsText:
            'This section works well after a hero, product story, or launch message when you need trust before the next CTA.',
          quoteOne:
            '"The white layout finally made our catalog feel premium instead of crowded. Editing sections is much faster now."',
          quoteOneName: 'Aarav Malhotra',
          quoteOneRole: 'Founder, Northline Home',
          quoteTwo:
            '"We can drag a block, change the content in the sidebar, and publish a polished page without extra design work."',
          quoteTwoName: 'Nisha Verma',
          quoteTwoRole: 'Marketing Lead, Atelier One',
          quoteThree:
            '"The builder now feels more like a real page system instead of disconnected blocks. That helped our team a lot."',
          quoteThreeName: 'Rohan Singh',
          quoteThreeRole: 'Product Manager, Luma Retail',
          traits: [
            textTrait('testimonialsEyebrow', 'Eyebrow'),
            textareaTrait('testimonialsTitle', 'Section title'),
            textareaTrait('testimonialsText', 'Section text'),
            textareaTrait('quoteOne', 'Quote 1'),
            textTrait('quoteOneName', 'Quote 1 name'),
            textTrait('quoteOneRole', 'Quote 1 role'),
            textareaTrait('quoteTwo', 'Quote 2'),
            textTrait('quoteTwoName', 'Quote 2 name'),
            textTrait('quoteTwoRole', 'Quote 2 role'),
            textareaTrait('quoteThree', 'Quote 3'),
            textTrait('quoteThreeName', 'Quote 3 name'),
            textTrait('quoteThreeRole', 'Quote 3 role'),
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'testimonialsEyebrow',
              'testimonialsTitle',
              'testimonialsText',
              'quoteOne',
              'quoteOneName',
              'quoteOneRole',
              'quoteTwo',
              'quoteTwoName',
              'quoteTwoRole',
              'quoteThree',
              'quoteThreeName',
              'quoteThreeRole',
            ],
            renderTestimonials,
          );
        },
      },
    });

    components.addType('faq-section', {
      model: {
        defaults: {
          name: 'FAQ Section',
          tagName: 'div',
          classes: ['sb-section', 'sb-faq'],
          stylable: true,
          faqEyebrow: 'Common questions',
          faqTitle: 'Answer the questions that usually block clicks or conversions.',
          faqText:
            'Use it for product details, shipping notes, plan questions, or campaign clarifications without sending readers away.',
          faqOneQuestion: 'Will this export work with common email senders?',
          faqOneAnswer: 'Yes. The builder is optimized around production HTML export for platforms like SendGrid, Mailchimp, Klaviyo, and custom senders.',
          faqTwoQuestion: 'Can I swap content without changing the layout?',
          faqTwoAnswer: 'Yes. Most common content edits happen through the trait panel, so you can keep structure consistent while changing copy and links.',
          faqThreeQuestion: 'What should I avoid in email blocks?',
          faqThreeAnswer: 'Avoid scripts, web widgets, and complex browser-only interactions. The builder favors safer structures for inbox rendering.',
          traits: [
            textTrait('faqEyebrow', 'Eyebrow'),
            textareaTrait('faqTitle', 'Section title'),
            textareaTrait('faqText', 'Section text'),
            textTrait('faqOneQuestion', 'Question 1'),
            textareaTrait('faqOneAnswer', 'Answer 1'),
            textTrait('faqTwoQuestion', 'Question 2'),
            textareaTrait('faqTwoAnswer', 'Answer 2'),
            textTrait('faqThreeQuestion', 'Question 3'),
            textareaTrait('faqThreeAnswer', 'Answer 3'),
          ],
        },

        init() {
          bindRenderer(
            this,
            [
              'faqEyebrow',
              'faqTitle',
              'faqText',
              'faqOneQuestion',
              'faqOneAnswer',
              'faqTwoQuestion',
              'faqTwoAnswer',
              'faqThreeQuestion',
              'faqThreeAnswer',
            ],
            renderFaq,
          );
        },
      },
    });

    components.addType('cta-banner', {
      model: {
        defaults: {
          name: 'CTA Banner',
          tagName: 'div',
          classes: ['sb-section', 'sb-cta'],
          stylable: true,
          ctaEyebrow: 'Ready to launch',
          ctaTitle: 'Close with a clear action before the footer.',
          ctaText:
            'Use this area for signups, demos, launches, or one final promo before the footer.',
          ctaPrimary: 'Launch collection',
          ctaPrimaryLink: '#',
          ctaSecondary: 'Talk to sales',
          ctaSecondaryLink: '#',
          traits: [
            textTrait('ctaEyebrow', 'Eyebrow'),
            textareaTrait('ctaTitle', 'Banner title'),
            textareaTrait('ctaText', 'Banner text'),
            textTrait('ctaPrimary', 'Primary button'),
            textTrait('ctaPrimaryLink', 'Primary URL'),
            textTrait('ctaSecondary', 'Secondary button'),
            textTrait('ctaSecondaryLink', 'Secondary URL'),
          ],
        },

        init() {
          bindRenderer(
            this,
            ['ctaEyebrow', 'ctaTitle', 'ctaText', 'ctaPrimary', 'ctaPrimaryLink', 'ctaSecondary', 'ctaSecondaryLink'],
            renderCtaBanner,
          );
        },
      },
    });

    components.addType('site-footer', {
      model: {
        defaults: {
          name: 'Email Footer',
          tagName: 'div',
          classes: ['sb-section', 'sb-footer'],
          stylable: true,
          footerInitials: 'ES',
          footerBrand: 'Email Studio',
          footerTagline: 'Production-ready campaigns with safer export',
          footerText:
            'Use the footer for company details, support links, compliance links, and a final brand reminder without overpowering the email.',
          footerMetaLeft: 'You are receiving this email because you subscribed to product updates.',
          footerMetaRight: '2026 Email Studio. All rights reserved.',
          col1Title: 'Browse',
          col1Links: [
            { label: 'Templates', url: '#' },
            { label: 'Launches', url: '#' },
            { label: 'Newsletter archive', url: '#' },
            { label: 'Support', url: '#' }
          ],
          col2Title: 'Company',
          col2Links: [
            { label: 'About', url: '#' },
            { label: 'Pricing', url: '#' },
            { label: 'API', url: '#' },
            { label: 'Contact', url: '#' }
          ],
          col3Title: 'Contact',
          col3Text1: '12 Horizon Lane',
          col3Text2: 'New Delhi, India',
          col3Text3: 'hello@emailstudio.dev',
          traits: [
            textTrait('footerInitials', 'Brand mark'),
            textTrait('footerBrand', 'Brand name'),
            textTrait('footerTagline', 'Tagline'),
            textareaTrait('footerText', 'Footer text'),
            textTrait('col1Title', 'Col 1 title'),
            { type: 'dynamic-list', name: 'col1Links', label: 'Col 1 links' },
            textTrait('col2Title', 'Col 2 title'),
            { type: 'dynamic-list', name: 'col2Links', label: 'Col 2 links' },
            textTrait('col3Title', 'Col 3 title'),
            textTrait('col3Text1', 'Col 3 text 1'),
            textTrait('col3Text2', 'Col 3 text 2'),
            textTrait('col3Text3', 'Col 3 text 3'),
            textTrait('footerMetaLeft', 'Meta left'),
            textTrait('footerMetaRight', 'Meta right'),
          ],
        },

        init() {
          bindRenderer(
            this,
            ['footerInitials', 'footerBrand', 'footerTagline', 'footerText', 'footerMetaLeft', 'footerMetaRight', 'col1Title', 'col1Links', 'col2Title', 'col2Links', 'col3Title', 'col3Text1', 'col3Text2', 'col3Text3'],
            renderFooter,
          );
        },
      },
    });

    components.addType('custom-list', {
      model: {
        defaults: {
          name: 'List Block',
          tagName: 'div',
          classes: ['sb-custom-list'],
          stylable: true,
          listItems: [
            { label: 'List item 1', url: '' },
            { label: 'List item 2', url: '' },
            { label: 'List item 3', url: '' }
          ],
          listCta: '',
          listCtaLink: '#',
          traits: [
            { type: 'dynamic-list', name: 'listItems', label: 'List items' },
            textTrait('listCta', 'CTA button'),
            textTrait('listCtaLink', 'CTA URL'),
          ],
        },

        init() {
          bindRenderer(
            this,
            ['listItems', 'listCta', 'listCtaLink'],
            renderCustomList,
          );
        },
      },
    });

    blocks.add('site-header', {
      label: blockLabel('HD', 'Header', 'Brand, links, and call to action'),
      category: sectionCategory,
      select: true,
      content: { type: 'site-header' },
    });

    blocks.add('hero-section', {
      label: blockLabel('HR', 'Hero', 'Big headline and conversion area'),
      category: sectionCategory,
      select: true,
      content: { type: 'hero-section' },
    });

    blocks.add('feature-grid', {
      label: blockLabel('FG', 'Features Grid', 'Three-card benefits section'),
      category: sectionCategory,
      select: true,
      content: { type: 'feature-grid' },
    });

    blocks.add('products-section', {
      label: blockLabel('PG', 'Products Grid', 'Three polished product cards'),
      category: commerceCategory,
      select: true,
      content: { type: 'products-section' },
    });

    blocks.add('product-card', {
      label: blockLabel('PC', 'Product Card', 'Single card with editable traits'),
      category: commerceCategory,
      select: true,
      content: { type: 'product-card' },
    });

    blocks.add('feature-carousel', {
      label: blockLabel('CR', 'Carousel', 'Sliding campaign showcase'),
      category: sectionCategory,
      select: true,
      content: { type: 'feature-carousel' },
    });

    blocks.add('testimonials-section', {
      label: blockLabel('TS', 'Testimonials', 'Three clean quote cards'),
      category: sectionCategory,
      select: true,
      content: { type: 'testimonials-section' },
    });

    blocks.add('faq-section', {
      label: blockLabel('FQ', 'FAQ', 'Question and answer cards'),
      category: sectionCategory,
      select: true,
      content: { type: 'faq-section' },
    });

    blocks.add('cta-banner', {
      label: blockLabel('CT', 'CTA Banner', 'Bottom conversion section'),
      category: sectionCategory,
      select: true,
      content: { type: 'cta-banner' },
    });

    blocks.add('site-footer', {
      label: blockLabel('FT', 'Footer', 'Soft multi-column footer'),
      category: sectionCategory,
      select: true,
      content: { type: 'site-footer' },
    });

    const basicCategory = { id: 'basic', label: 'Basic Elements', open: true };

    blocks.add('text', {
      label: blockLabel('TXT', 'Text', 'Insert simple text'),
      category: basicCategory,
      content: {
        type: 'text',
        content: 'Insert your text here',
        style: { padding: '10px' },
        activeOnRender: 1
      }
    });

    blocks.add('link', {
      label: blockLabel('LNK', 'Link', 'Insert a link'),
      category: basicCategory,
      content: {
        type: 'link',
        content: 'Link',
        style: { color: '#0f766e' }
      }
    });

    blocks.add('image', {
      label: blockLabel('IMG', 'Image', 'Insert an image'),
      category: basicCategory,
      content: {
        type: 'image',
        style: { color: 'black' }
      }
    });

    blocks.add('video', {
      label: blockLabel('VID', 'Video', 'Insert a video player'),
      category: basicCategory,
      content: {
        type: 'video',
        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        style: { height: '350px', width: '100%' }
      }
    });

    blocks.add('button', {
      label: blockLabel('BTN', 'Button', 'Insert a CTA button'),
      category: basicCategory,
      content: '<a class="sb-button sb-button--primary" href="#">Click me</a>'
    });

    blocks.add('divider', {
      label: blockLabel('DIV', 'Divider', 'Insert a horizontal line'),
      category: basicCategory,
      content: '<hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />'
    });

    blocks.add('list', {
      label: blockLabel('LST', 'List Items', 'Insert a bullet list'),
      category: basicCategory,
      select: true,
      content: { type: 'custom-list' }
    });

    blocks.add('section-1', {
      label: blockLabel('S1', '1 Section', 'Single column block'),
      category: basicCategory,
      content: `
        <div style="padding: 20px; display: block; border: 1px dashed rgba(0,0,0,0.1);">
          <div style="min-height: 50px;"></div>
        </div>
      `
    });

    blocks.add('section-1-3', {
      label: blockLabel('S3', '1/3 Section', 'Three columns block'),
      category: basicCategory,
      content: `
        <div style="display: flex; flex-wrap: wrap; padding: 20px; gap: 20px; border: 1px dashed rgba(0,0,0,0.1);">
          <div style="flex: 1; min-height: 50px; border: 1px dashed rgba(0,0,0,0.05);"></div>
          <div style="flex: 1; min-height: 50px; border: 1px dashed rgba(0,0,0,0.05);"></div>
          <div style="flex: 1; min-height: 50px; border: 1px dashed rgba(0,0,0,0.05);"></div>
        </div>
      `
    });

    const emailCategory = { id: 'email', label: 'Email Tags', open: true };
Tags', open: true };
Tags', open: true };
Tags', open: true };

    blocks.add('tag-name', {
      label: blockLabel('NM', 'Name', 'Insert {{name}} variable'),
      category: emailCategory,
      content: '{{name}}',
    });

    blocks.add('tag-email', {
      label: blockLabel('EM', 'Email', 'Insert {{email}} variable'),
      category: emailCategory,
      content: '{{email}}',
    });

    blocks.add('tag-unsubscribe', {
      label: blockLabel('UN', 'Unsubscribe', 'Unsubscribe link'),
      category: emailCategory,
      content: '<a href="{{unsubscribe_url}}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">Unsubscribe</a>',
    });
  };

  minimalBuilderPlugin.canvasCss = canvasCss;
  minimalBuilderPlugin.emailTemplates = emailTemplates;
  minimalBuilderPlugin.styleManagerSectors = styleManagerSectors;

  global.grapesjsMinimalBuilder = minimalBuilderPlugin;
})(typeof globalThis !== 'undefined' ? globalThis : window);
