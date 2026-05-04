(function (global) {
  // Themed icon system — each block gets a color-coded icon matching its use case
  const blockLabel = (shortName, title, copy) => {
    const iconMap = {
      // --- Email Sections (rich, warm palette) ---
      HD: { color: '#3b82f6', bg: '#eff6ff', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>' },
      HR: { color: '#8b5cf6', bg: '#f5f3ff', d: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
      FG: { color: '#ec4899', bg: '#fdf2f8', d: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
      PG: { color: '#f97316', bg: '#fff7ed', d: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
      PC: { color: '#0ea5e9', bg: '#f0f9ff', d: '<rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="12" cy="15" r="2"/>' },
      CR: { color: '#6366f1', bg: '#eef2ff', d: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' },
      TS: { color: '#14b8a6', bg: '#f0fdfa', d: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="12" y2="13"/>' },
      FQ: { color: '#f59e0b', bg: '#fffbeb', d: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
      CT: { color: '#ef4444', bg: '#fef2f2', d: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
      FT: { color: '#64748b', bg: '#f8fafc', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="8" y1="19" x2="8.01" y2="19"/><line x1="12" y1="19" x2="12.01" y2="19"/><line x1="16" y1="19" x2="16.01" y2="19"/>' },

      // --- Content Elements (cool, modern palette) ---
      TXT: { color: '#8b5cf6', bg: '#f5f3ff', d: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>' },
      LNK: { color: '#3b82f6', bg: '#eff6ff', d: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
      IMG: { color: '#f97316', bg: '#fff7ed', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },
      SP: { color: '#94a3b8', bg: '#f1f5f9', d: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="8 8 12 5 16 8"/><polyline points="8 16 12 19 16 16"/>' },
      BTN: { color: '#6366f1', bg: '#eef2ff', d: '<rect x="3" y="7" width="18" height="10" rx="3" ry="3"/><line x1="8" y1="12" x2="16" y2="12"/>' },
      DIV: { color: '#a8a29e', bg: '#fafaf9', d: '<line x1="4" y1="12" x2="20" y2="12"/>' },
      LST: { color: '#14b8a6', bg: '#f0fdfa', d: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/>' },
      HED: { color: '#7c3aed', bg: '#f5f3ff', d: '<path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/>' },
      PAR: { color: '#0f766e', bg: '#ecfdf5', d: '<path d="M5 7h14"/><path d="M5 12h14"/><path d="M5 17h9"/>' },
      VID: { color: '#dc2626', bg: '#fef2f2', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>' },
      HTM: { color: '#0f766e', bg: '#ecfeff', d: '<path d="m8 7-5 5 5 5"/><path d="m16 7 5 5-5 5"/><path d="M14 4 10 20"/>' },
      TBL: { color: '#475569', bg: '#f8fafc', d: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M9 5v14"/><path d="M15 5v14"/>' },

      // --- Layout Sections (structural, neutral) ---
      S1: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>' },
      S2: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/>' },
      S3: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>' },
      S4: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="7.5" y1="3" x2="7.5" y2="21"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="16.5" y1="3" x2="16.5" y2="21"/>' },
      S21: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/>' },
      S12: { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>' },

      // --- Social & Special ---
      SOC: { color: '#ec4899', bg: '#fdf2f8', d: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>' },
      NAV: { color: '#2563eb', bg: '#eff6ff', d: '<path d="M4 7h16"/><path d="M4 12h10"/><path d="M4 17h16"/>' },

      // --- Merge Tags (data/variable tones) ---
      NM: { color: '#f59e0b', bg: '#fffbeb', d: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
      EM: { color: '#06b6d4', bg: '#ecfeff', d: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
      UN: { color: '#64748b', bg: '#f8fafc', d: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>' },
    };

    const icon = iconMap[shortName] || { color: '#64748b', bg: '#f1f5f9', d: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' };

    return `
      <div style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;background:${icon.bg};color:${icon.color};border-radius:10px;flex-shrink:0;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;">
          ${icon.d}
        </svg>
      </div>
      <div style="font-size:11px;font-weight:600;color:#334155;text-align:center;line-height:1.3;margin-top:2px;">${title}</div>
    `;
  };

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

  const normalizeAlign = (value, fallback = 'left') => {
    const next = `${value || ''}`.trim().toLowerCase();
    return ['left', 'center', 'right'].includes(next) ? next : fallback;
  };

  const normalizeImageWidth = (value, fallback = '100%') => {
    const raw = `${value || ''}`.trim().toLowerCase();
    if (!raw) return fallback;
    if (raw === 'auto') return 'auto';

    if (raw.endsWith('%')) {
      const pct = parseInt(raw, 10);
      return Number.isFinite(pct) ? `${Math.min(100, Math.max(5, pct))}%` : fallback;
    }

    const px = parseInt(raw.replace(/px$/, ''), 10);
    return Number.isFinite(px) ? `${Math.min(600, Math.max(40, px))}px` : fallback;
  };

  const syncAlignmentStyle = (model, propName = 'align', fallback = 'left') => {
    let syncing = false;

    const syncFromProp = () => {
      if (syncing) return;
      syncing = true;
      const nextAlign = normalizeAlign(model.get(propName), fallback);
      const currentStyle = model.getStyle?.() || {};

      if (model.get(propName) !== nextAlign) {
        model.set(propName, nextAlign, { silent: true });
      }

      if (normalizeAlign(currentStyle['text-align'], fallback) !== nextAlign) {
        model.addStyle({ 'text-align': nextAlign });
      }
      syncing = false;
    };

    const syncFromStyle = () => {
      if (syncing) return;
      syncing = true;
      const currentStyle = model.getStyle?.() || {};
      const nextAlign = normalizeAlign(currentStyle['text-align'] || model.get(propName), fallback);

      if (model.get(propName) !== nextAlign) {
        model.set(propName, nextAlign);
      }

      if (normalizeAlign(currentStyle['text-align'], fallback) !== nextAlign) {
        model.addStyle({ 'text-align': nextAlign });
      }
      syncing = false;
    };

    model.on(`change:${propName}`, syncFromProp);
    model.on('change:style', syncFromStyle);
    syncFromProp();
  };

  const renderButton = (label, href = '#', opts = {}) => {
    if (!label) return '';

    const { variant = 'primary', align = 'center', compact = false } = opts;
    const isSecondary = variant === 'secondary';
    const borderRadius = opts.borderRadius != null ? `${opts.borderRadius}px` : (compact ? '999px' : '8px');
    const buttonPadding = opts.buttonPadding || (compact ? '10px 16px' : '14px 28px');
    const fullWidth = opts.fullWidth === true;
    const target = opts.target || '_self';
    const tableAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center';
    const tableStyle = fullWidth ? 'width:100%;' : (align === 'center' ? 'margin:0 auto;' : align === 'right' ? 'margin-left:auto;' : '');
    const cellStyle = [
      `border-radius:${borderRadius};`,
      `background:${opts.buttonColor || (isSecondary ? '#ffffff' : '#111827')};`,
      isSecondary ? 'border:1px solid #d6d3d1;' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const linkStyle = [
      `display:${fullWidth ? 'block' : 'inline-block'};`,
      `padding:${buttonPadding};`,
      'font-family:Arial, Helvetica, sans-serif;',
      `font-size:${compact ? '13px' : '14px'};`,
      'font-weight:700;',
      'line-height:1.1;',
      `color:${opts.textColor || (isSecondary ? '#111827' : '#ffffff')};`,
      'text-decoration:none;',
      'mso-line-height-rule:exactly;',
      fullWidth ? 'text-align:center;' : '',
    ].filter(Boolean).join(' ');

    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="${tableAlign}" style="${tableStyle}"${fullWidth ? ' width="100%"' : ''}>
        <tr>
          <td style="${cellStyle}">
            <a href="${href || '#'}" target="${target}" style="${linkStyle}">${label}</a>
          </td>
        </tr>
      </table>
    `.trim();
  };

  const renderSectionShell = (innerHtml, opts = {}) => {
    const {
      padding = '24px 20px',
      background = 'transparent',
      align = '',
      radius = '0px',
      textAlign = align || 'inherit',
    } = opts;

    const alignAttr = align ? `align="${align}"` : '';

    return `
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:${background}; border-radius:${radius};">
        <tr>
          <td ${alignAttr} style="padding:${padding}; text-align:${textAlign};">
            ${innerHtml}
          </td>
        </tr>
      </table>
    `.trim();
  };

  const getCtaAttributes = (ctaValue) => {
    let url = '#';
    let target = '_blank';
    if (!ctaValue) return { href: url, target };
    
    let cta = ctaValue;
    if (typeof cta === 'string') {
      try { cta = JSON.parse(cta); } catch(e) {}
    }
    
    if (typeof cta === 'object' && cta !== null) {
      if (cta.type === 'website') {
        url = cta.url || '#';
        target = cta.target || '_blank';
      } else if (cta.type === 'email') {
        const email = cta.email || '';
        const params = [];
        if (cta.subject) params.push(`subject=${encodeURIComponent(cta.subject)}`);
        if (cta.body) params.push(`body=${encodeURIComponent(cta.body)}`);
        const query = params.length > 0 ? `?${params.join('&')}` : '';
        url = email ? `mailto:${email}${query}` : '#';
      } else if (cta.type === 'phone') {
        url = cta.phone ? `tel:${cta.phone}` : '#';
      }
    } else if (typeof cta === 'string') {
      url = cta; // Fallback for plain strings
    }
    
    return { href: url, target };
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

  const socialIconMap = {
    facebook: { bg: '#1877f2', color: '#ffffff', path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
    instagram: { bg: '#e1306c', color: '#ffffff', path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M6.5 2h11a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5h-11a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
    linkedin: { bg: '#0a66c2', color: '#ffffff', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z' },
    youtube: { bg: '#ff0000', color: '#ffffff', path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z' },
    tiktok: { bg: '#111827', color: '#ffffff', path: 'M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z' },
    pinterest: { bg: '#e60023', color: '#ffffff', path: 'M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2zm1 14.5c-.8.1-1.6-.3-1.8-.9-.1-.2-.8-3.3-.9-4-.2-.8-.7-1.5-1.5-1.5-.7 0-1.3.6-1.3 1.5 0 1.1.7 1.9 1.5 1.9.2 0 .5 0 .6-.1-.1.4-.4 1.6-.4 1.8-.2 1-.6 2.3-1.2 3.3-.7-.9-1.3-2.1-1.3-3.7 0-2.8 2.2-5.5 6-5.5 3.5 0 5.5 2.5 5.5 5.2 0 3-1.6 5.3-3.8 5.3-1.1 0-2-.6-2-1.2z' },
    x: { bg: '#111827', color: '#ffffff', path: 'M4 4l5.37 7.4L4 20h2.48l3.96-5.26L13.76 20h6.24l-5.6-7.72L20 4h-2.48l-3.66 4.86L10.24 4H4zm3.3 1.44h2.05l9.35 12.8h-2.05L7.3 5.44z' },
    twitter: { bg: '#111827', color: '#ffffff', path: 'M4 4l5.37 7.4L4 20h2.48l3.96-5.26L13.76 20h6.24l-5.6-7.72L20 4h-2.48l-3.66 4.86L10.24 4H4zm3.3 1.44h2.05l9.35 12.8h-2.05L7.3 5.44z' },
    snapchat: { bg: '#FFFC00', color: '#111827', path: 'M11.8.8c.8 0 1.7.3 2.3.9.6.6 1 1.4 1 2.3 0 .4-.1.8-.3 1.2-.2.4-.4.8-.8 1.1-.3.2-.6.3-.9.4l-.5.1c-.2 0-.4 0-.5.1 1.2.6 1.9 1.5 1.9 2.7 0 .5-.2 1-.5 1.4-.4.5-1 1-1.7 1.2l-.7.2c-.3.1-.7.2-1 .4-.2.2-.3.4-.3.6 0 .2.1.4.3.6.3.2.7.4 1.2.5.5.1 1.1.2 1.7.3h.1c.3 0 .6 0 .9.1.5.1 1 .3 1.4.6.4.3.7.8.9 1.3l.1.5c.1.4 0 .8-.2 1.1-.2.3-.5.5-.8.6-.5.2-1 .3-1.6.3-1.1 0-2.3-.3-3.3-.8-1.1-.5-2.1-1.2-3-2C8.7 18 7.6 18.7 6.5 19.2c-1 .5-2.2.8-3.3.8-.6 0-1.1-.1-1.6-.3-.3-.1-.6-.3-.8-.6-.2-.3-.3-.7-.2-1.1l.1-.5c.2-.5.5-1 .9-1.3.4-.3.9-.5 1.4-.6.3-.1.6-.1.9-.1h.1c.6-.1 1.2-.2 1.7-.3.5-.1.9-.3 1.2-.5.2-.2.3-.4.3-.6 0-.2-.1-.4-.3-.6-.3-.2-.7-.3-1-.4l-.7-.2c-.7-.2-1.3-.7-1.7-1.2-.3-.4-.5-.9-.5-1.4 0-1.2.7-2.1 1.9-2.7-.1 0-.3-.1-.5-.1l-.5-.1c-.3-.1-.6-.2-.9-.4-.4-.3-.6-.7-.8-1.1-.2-.4-.3-.8-.3-1.2 0-.9.4-1.7 1-2.3.6-.6 1.5-.9 2.3-.9h.1z' },
    vimeo: { bg: '#1ab7ea', color: '#ffffff', path: 'M22.39 7.26c-.11 2.39-1.77 5.75-4.99 10.08-3.31 4.5-6.22 6.74-8.73 6.74-1.42 0-2.61-1.38-3.55-4.14-.65-2.52-1.3-5.06-1.95-7.61-.83-3.1-1.75-4.66-2.76-4.66-.2 0-.82.38-1.87 1.14l-1.15-1.42c1.23-1.1 2.5-2.3 3.82-3.61 1.63-1.57 2.76-2.4 3.4-2.5 1.57-.2 2.52.88 2.85 3.25.32 2.52.54 4.14.65 4.86.5 3.53 1.15 5.28 1.95 5.28.6 0 1.46-.86 2.57-2.57 1.11-1.72 1.67-3.1 1.67-4.15 0-1.63-.6-2.45-1.8-2.45-.6 0-1.2.16-1.8.49 1.18-3.83 3.37-5.63 6.57-5.4 2.4.16 3.46 1.63 3.2 4.4z' },
  };

  const getSocialIconSvg = (name = '', opts = {}) => {
    const key = `${name}`.trim().toLowerCase();
    const match = socialIconMap[key] || { bg: '#475569', color: '#ffffff', path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' };
    const { style = 'branded', shape = 'circle', size = 32, linkColor = '#6366f1' } = opts;
    
    let fill = match.color;
    let bg = match.bg;
    
    if (style === 'outline') {
      fill = linkColor;
      bg = 'transparent';
    } else if (style === 'solid-custom') {
      fill = '#ffffff';
      bg = linkColor;
    } else if (style === 'solid-branded') {
      fill = '#ffffff';
      bg = match.bg;
    } else if (style === 'branded') {
      fill = match.bg;
      bg = 'transparent';
    }

    const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '20%' : '0%';
    const bgStyle = shape !== 'none' ? `background-color: ${bg}; border-radius: ${borderRadius};` : `background-color: transparent;`;
    
    const padding = shape !== 'none' ? Math.floor(size * 0.25) : 0;
    const svgSize = shape !== 'none' ? size - (padding * 2) : size;

    return `
      <div style="display:inline-flex; align-items:center; justify-content:center; width:${size}px; height:${size}px; ${bgStyle} box-sizing: border-box;">
        <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg" style="display:block;">
          <path d="${match.path}"/>
        </svg>
      </div>
    `;
  };

  const getVideoThumbnail = (url, customThumbnail) => {
    if (customThumbnail) {
      return customThumbnail;
    }

    const youtubeMatch = `${url || ''}`.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/i);
    if (youtubeMatch?.[1]) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
    }

    return 'https://picsum.photos/id/1015/1200/720';
  };

  const renderMenuItems = (model) => {
    const items = Array.isArray(model.get('navItems')) ? model.get('navItems') : [];
    const layout = model.get('layout') || 'horizontal';
    const align = model.get('align') || 'center';
    const spacing = parseInt(model.get('spacing'), 10);
    const validSpacing = isNaN(spacing) ? 15 : spacing;
    const dividerColor = model.get('dividerColor') || 'transparent';
    const textColor = model.get('textColor') || '#374151';
    const fontSize = model.get('fontSize') || '14px';
    const fontWeight = model.get('fontWeight') || '500';
    const fontFamily = model.get('fontFamily') || 'Arial, Helvetica, sans-serif';
    const menuPadding = model.get('menuPadding') || '16px 0';
    const backgroundColor = model.get('backgroundColor') || 'transparent';

    const textStyle = `color:${textColor}; font-size:${fontSize}; font-weight:${fontWeight}; font-family:${fontFamily}; text-decoration:none;`;

    let linksHtml = '';
    const filteredItems = items.filter((item) => item && item.label);

    if (layout === 'horizontal') {
      linksHtml = filteredItems.map((item, index) => {
        const divider = index ? `<span style="color:${dividerColor}; padding:0 ${validSpacing}px;">|</span>` : '';
        const itemTarget = item.target || '_blank';
        return `${divider}<a href="${item.url || '#'}" target="${itemTarget}" style="${textStyle}">${item.label}</a>`;
      }).join('');
    } else {
      // Vertical layout
      linksHtml = filteredItems.map((item, index) => {
        const paddingBottom = index < filteredItems.length - 1 ? `${validSpacing}px` : '0';
        const divider = dividerColor !== 'transparent' && index < filteredItems.length - 1 ? `border-bottom: 1px solid ${dividerColor};` : '';
        const itemTarget = item.target || '_blank';
        return `
          <tr>
            <td align="${align}" style="padding-bottom:${paddingBottom}; ${divider}">
              <a href="${item.url || '#'}" target="${itemTarget}" style="${textStyle}; display:block;">${item.label}</a>
            </td>
          </tr>
        `;
      }).join('');
    }

    const inner = layout === 'horizontal' ? `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:${backgroundColor};">
        <tr>
          <td align="${align}" style="padding: ${menuPadding};">
            ${linksHtml}
          </td>
        </tr>
      </table>
    `.trim() : `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:${backgroundColor};">
        <tr>
          <td style="padding: ${menuPadding};">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              ${linksHtml}
            </table>
          </td>
        </tr>
      </table>
    `.trim();

    // Remove the wrapper padding so `menuPadding` and `backgroundColor` behave correctly.
    return renderSectionShell(inner, { padding: '0px' });
  };

  const renderSocialLinks = (model) => {
    const items = Array.isArray(model.get('socialItems')) ? model.get('socialItems') : [];
    const align = model.get('align') || 'center';
    const linkColor = model.get('linkColor') || '#6366f1';
    const iconSize = parseInt(model.get('iconSize'), 10) || 32;
    const iconStyle = model.get('iconStyle') || 'solid-branded';
    const iconShape = model.get('iconShape') || 'circle';
    const spacing = parseInt(model.get('spacing'), 10) || 10;

    const linksHtml = items
      .filter((item) => item && item.label)
      .map((item, index) => {
        const paddingLeft = index > 0 ? `${spacing}px` : '0';
        return `
          <td style="padding-left:${paddingLeft}; line-height:0; font-size:0;">
            <a href="${item.url || '#'}" style="text-decoration:none; display:inline-block;" target="_blank">
              ${getSocialIconSvg(item.label, { style: iconStyle, shape: iconShape, size: iconSize, linkColor })}
            </a>
          </td>
        `;
      })
      .join('');

    const inner = `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="${align}" style="margin: ${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};">
        <tr>
          ${linksHtml}
        </tr>
      </table>
    `.trim();

    return renderSectionShell(inner, { padding: '12px 20px', align: align, textAlign: align });
  };

  const renderHeadingBlock = (model) => {
    const level = model.get('headingLevel') || 'h2';
    const tag = ['h1', 'h2', 'h3'].includes(level) ? level : 'h2';
    const fontSize = tag === 'h1' ? '34px' : tag === 'h3' ? '22px' : '28px';
    const align = normalizeAlign(model.get('align') || model.getStyle?.()?.['text-align'], 'left');
    const inner = `
      <${tag} style="margin:0; font-size:${fontSize}; line-height:inherit; color:inherit; font-family:inherit; text-align:${align}; font-weight:inherit;">
        ${model.get('headingText') || 'Write a strong headline'}
      </${tag}>
    `;
    return renderSectionShell(inner, { background: 'transparent', align, textAlign: align });
  };

  const renderParagraphBlock = (model) => {
    const align = normalizeAlign(model.get('align') || model.getStyle?.()?.['text-align'], 'left');
    const inner = `
      <p style="margin:0; font-size:15px; line-height:inherit; color:inherit; font-family:inherit; text-align:${align}; font-weight:inherit;">
        ${model.get('paragraphText') || 'Add your supporting copy here. This block is designed for email-safe copy sections and introductory text.'}
      </p>
    `;
    return renderSectionShell(inner, { background: 'transparent', align, textAlign: align });
  };

  const renderImageBlock = (model) => {
    const src = model.get('imageSrc') || 'https://picsum.photos/id/1060/900/700';
    const alt = model.get('imageAlt') || 'Email image';
    const align = normalizeAlign(model.get('imageAlign') || model.getStyle?.()?.['text-align'], 'center');
    const width = normalizeImageWidth(model.get('imageWidth') || model.getStyle?.()?.width, '100%');
    const imageWidthAttr = width.endsWith('px') ? ` width="${parseInt(width, 10)}"` : '';
    const imageMarkup = `<img src="${src}" alt="${alt}"${imageWidthAttr} style="display:inline-block; width:${width}; max-width:100%; height:auto; border:0; outline:none; text-decoration:none; vertical-align:top;" />`;
    
    const cta = getCtaAttributes(model.get('imageCta'));
    const linkedImage = `<a href="${cta.href}" target="${cta.target}" style="display:inline-block; text-decoration:none;">${imageMarkup}</a>`;

    return renderSectionShell(linkedImage, {
      padding: '0',
      background: 'transparent',
      align,
      textAlign: align,
    });
  };

  const renderButtonBlock = (model) => {
    const cta = getCtaAttributes(model.get('buttonCta'));
    return renderSectionShell(
      renderButton(model.get('buttonText') || 'Click me', cta.href, {
        align: model.get('align') || 'center',
        buttonColor: model.get('buttonColor'),
        textColor: model.get('textColor'),
        borderRadius: model.get('borderRadius'),
        buttonPadding: model.get('buttonPadding'),
        fullWidth: model.get('fullWidth'),
        target: cta.target,
      }),
      { padding: '20px' },
    );
  };

  const renderDividerBlock = (model) => {
    const dividerWidth = model.get('dividerWidth') || '100%';
    const thickness = model.get('dividerThickness') || '1px';
    const color = model.get('dividerColor') || '#e2e8f0';
    const inner = `
      <table role="presentation" width="${dividerWidth}" border="0" cellpadding="0" cellspacing="0" align="center">
        <tr>
          <td style="border-top:${thickness} solid ${color}; font-size:0; line-height:0;">&nbsp;</td>
        </tr>
      </table>
    `;

    return renderSectionShell(inner, { padding: '16px 20px', align: 'center' });
  };

  const renderSpacerBlock = (model) =>
    renderSectionShell(
      `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr><td height="${model.get('spacerHeight') || 32}" style="font-size:0; line-height:0;">&nbsp;</td></tr></table>`,
      { padding: '0 20px' },
    );

  const renderVideoBlock = (model) => {
    const videoUrl = model.get('videoUrl') || '#';
    const thumbnail = getVideoThumbnail(videoUrl, model.get('videoThumbnail'));
    const title = model.get('videoTitle') || 'Watch the video';
    
    // For video, fallback to videoUrl if cta is not configured
    let cta = getCtaAttributes(model.get('videoCta'));
    if (cta.href === '#') {
      cta.href = videoUrl;
      cta.target = '_blank';
    }

    const inner = `
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-radius:18px; overflow:hidden; background:#0f172a;">
            <a href="${cta.href}" target="${cta.target}" style="display:block; text-decoration:none;">
              <img src="${thumbnail}" alt="${model.get('videoAlt') || title}" style="display:block; width:100%; max-width:100%; height:auto; opacity:0.88;" />
              <div style="padding:16px 20px; background:#0f172a;">
                <span style="display:inline-block; padding:10px 16px; border-radius:999px; background:#ffffff; color:#0f172a; font-size:12px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;">Play video</span>
                <div style="font-size:12px; line-height:12px;">&nbsp;</div>
                <strong style="display:block; color:#ffffff; font-size:22px; line-height:1.35; font-family:Arial, Helvetica, sans-serif;">${title}</strong>
              </div>
            </a>
          </td>
        </tr>
      </table>
    `.trim();

    return renderSectionShell(inner, { padding: '20px' });
  };

  const renderHtmlBlock = (model) => {
    const code = model.get('htmlCode') || '<div style="padding:12px; border:1px dashed #cbd5e1; text-align:center;">Custom HTML block</div>';
    return renderSectionShell(code, { padding: '12px 20px' });
  };

  // renderTableBlock removed - email-table now manages its own components internally

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
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background:\${palette.accent}; border-radius:12px;">
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
  const textareaTrait = (name, label) => ({ type: 'textarea', name, label, changeProp: true });
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
    'email-heading',
    'email-paragraph',
    'email-image',
    'email-button',
    'email-divider',
    'email-spacer',
    'email-video',
    'email-html',
    'email-table',
    'menu-items-component',
    'social-links-component',
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
    if (!traits.getType('textarea')) {
      traits.addType('textarea', {
        createInput({ trait }) {
          const textarea = document.createElement('textarea');
          textarea.placeholder = trait.get('placeholder') || '';
          textarea.rows = trait.get('rows') || 5;
          textarea.style.width = '100%';
          return textarea;
        },

        onEvent({ elInput, component, trait }) {
          component.set(trait.get('name'), elInput.value);
        },

        onUpdate({ elInput, component, trait }) {
          elInput.value = component.get(trait.get('name')) || '';
        },
      });
    }

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

    traits.addType('cta-action', {
      eventCapture: ['input', 'change'],
      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sb-trait-cta-action';
        const propName = trait.get('name');
        
        const getValue = () => {
          let val = component.get(propName);
          if (typeof val === 'string') {
            try { val = JSON.parse(val); } catch (e) {}
          }
          return typeof val === 'object' && val !== null ? val : { type: 'website', url: '', target: '_blank', email: '', subject: '', body: '', phone: '' };
        };
        
        const setValue = (val) => {
          component.set(propName, JSON.parse(JSON.stringify(val)));
        };

        const render = () => {
          const val = getValue();
          wrapper.innerHTML = `
            <div style="margin-bottom:8px;">
              <select class="cta-type" style="width:100%; box-sizing:border-box; margin-bottom:8px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;">
                <option value="website" ${val.type === 'website' ? 'selected' : ''}>Open Website</option>
                <option value="email" ${val.type === 'email' ? 'selected' : ''}>Send Email</option>
                <option value="phone" ${val.type === 'phone' ? 'selected' : ''}>Call Phone Number</option>
              </select>
            </div>
            
            ${val.type === 'website' ? `
              <div class="cta-fields" style="display:flex; flex-direction:column; gap:6px;">
                <input type="text" class="cta-url" placeholder="URL (e.g. https://...)" value="${val.url || ''}" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none;">
                <select class="cta-target" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none;">
                  <option value="_blank" ${val.target === '_blank' ? 'selected' : ''}>New tab</option>
                  <option value="_self" ${val.target === '_self' ? 'selected' : ''}>Same window</option>
                </select>
              </div>
            ` : ''}

            ${val.type === 'email' ? `
              <div class="cta-fields" style="display:flex; flex-direction:column; gap:6px;">
                <input type="text" class="cta-email" placeholder="Email Address" value="${val.email || ''}" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none;">
                <input type="text" class="cta-subject" placeholder="Subject (Optional)" value="${val.subject || ''}" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none;">
                <textarea class="cta-body" placeholder="Body (Optional)" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; resize:vertical; min-height:60px;">${val.body || ''}</textarea>
              </div>
            ` : ''}

            ${val.type === 'phone' ? `
              <div class="cta-fields" style="display:flex; flex-direction:column; gap:6px;">
                <input type="text" class="cta-phone" placeholder="Phone Number" value="${val.phone || ''}" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none;">
              </div>
            ` : ''}
          `;
        };

        wrapper.addEventListener('input', (e) => {
          const val = getValue();
          if (e.target.classList.contains('cta-url')) val.url = e.target.value;
          if (e.target.classList.contains('cta-email')) val.email = e.target.value;
          if (e.target.classList.contains('cta-subject')) val.subject = e.target.value;
          if (e.target.classList.contains('cta-body')) val.body = e.target.value;
          if (e.target.classList.contains('cta-phone')) val.phone = e.target.value;
          setValue(val);
        });

        wrapper.addEventListener('change', (e) => {
          const val = getValue();
          if (e.target.classList.contains('cta-type')) {
            val.type = e.target.value;
            setValue(val);
            render();
          }
          if (e.target.classList.contains('cta-target')) {
            val.target = e.target.value;
            setValue(val);
          }
        });

        setTimeout(render, 0);
        return wrapper;
      },
      onEvent() { },
      onUpdate() { },
    });

    traits.addType('dynamic-list', {
      eventCapture: ['input', 'change'],
      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sb-trait-dynamic-list';
        wrapper.innerHTML = `
          <div class="sb-dynamic-list-items"></div>
          <button class="sb-dynamic-list-add" type="button" style="width: 100%; padding: 7px 10px; margin-top: 6px; border-radius: 6px; border: 1px dashed rgba(0,0,0,0.12); background: transparent; cursor: pointer; font-size: 12px; font-family: inherit; color: #6b7280; transition: all 0.12s ease;" onmouseover="this.style.borderColor='#6366f1';this.style.color='#6366f1'" onmouseout="this.style.borderColor='rgba(0,0,0,0.12)';this.style.color='#6b7280'">+ Add Item</button>
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
            itemEl.style.cssText = 'margin-bottom:8px; padding:10px 12px; border:1px solid rgba(0,0,0,0.07); border-radius:8px; background:#fafbfc;';
            itemEl.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:10px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.04em;">Item ${index + 1}</span>
                <div style="display:flex; gap:4px;">
                  <button type="button" data-index="${index}" class="sb-dynamic-list-up" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#6b7280; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:12px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)';this.style.color='#111827'" onmouseout="this.style.background='none';this.style.color='#6b7280'">&#8593;</button>
                  <button type="button" data-index="${index}" class="sb-dynamic-list-down" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#6b7280; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:12px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)';this.style.color='#111827'" onmouseout="this.style.background='none';this.style.color='#6b7280'">&#8595;</button>
                  <button type="button" data-index="${index}" class="sb-dynamic-list-remove" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#ef4444; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:14px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(239,68,68,0.08)';this.style.borderColor='rgba(239,68,68,0.15)'" onmouseout="this.style.background='none';this.style.borderColor='transparent'">&times;</button>
                </div>
              </div>
              <input type="text" data-index="${index}" data-key="label" value="${item.label || ''}" placeholder="Label" style="width:100%; box-sizing:border-box; margin-bottom:6px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
              <input type="text" data-index="${index}" data-key="url" value="${item.url || ''}" placeholder="URL (e.g. https://...)" style="width:100%; box-sizing:border-box; margin-bottom:6px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
              <select data-index="${index}" data-key="target" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
                <option value="_self" ${item.target === '_self' ? 'selected' : ''}>Same window</option>
                <option value="_blank" ${item.target !== '_self' ? 'selected' : ''}>New tab</option>
              </select>
            `;
            list.appendChild(itemEl);
          });
        };

        addBtn.addEventListener('click', () => {
          setItems([...getItems(), { label: 'New Link', url: '#' }]);
          renderItems();
        });

        list.addEventListener('change', (e) => {
          if (e.target.tagName === 'SELECT') {
            const index = e.target.getAttribute('data-index');
            const key = e.target.getAttribute('data-key');
            const items = [...getItems()];
            items[index] = { ...items[index], [key]: e.target.value };
            setItems(items);
          }
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
          const btn = e.target.closest('button');
          if (!btn) return;

          const index = parseInt(btn.getAttribute('data-index'), 10);
          const items = [...getItems()];

          if (btn.classList.contains('sb-dynamic-list-remove')) {
            items.splice(index, 1);
            setItems(items);
            renderItems();
          } else if (btn.classList.contains('sb-dynamic-list-up') && index > 0) {
            const temp = items[index];
            items[index] = items[index - 1];
            items[index - 1] = temp;
            setItems(items);
            renderItems();
          } else if (btn.classList.contains('sb-dynamic-list-down') && index < items.length - 1) {
            const temp = items[index];
            items[index] = items[index + 1];
            items[index + 1] = temp;
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

    traits.addType('social-list', {
      eventCapture: ['input', 'change'],
      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sb-trait-dynamic-list';
        wrapper.innerHTML = `
          <div class="sb-dynamic-list-items"></div>
          <button class="sb-dynamic-list-add" type="button" style="width: 100%; padding: 7px 10px; margin-top: 6px; border-radius: 6px; border: 1px dashed rgba(0,0,0,0.12); background: transparent; cursor: pointer; font-size: 12px; font-family: inherit; color: #6b7280; transition: all 0.12s ease;" onmouseover="this.style.borderColor='#6366f1';this.style.color='#6366f1'" onmouseout="this.style.borderColor='rgba(0,0,0,0.12)';this.style.color='#6b7280'">+ Add Social Icon</button>
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
          component.set(propName, JSON.parse(JSON.stringify(items)));
        };

        const renderItems = () => {
          list.innerHTML = '';
          const items = getItems();
          items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.style.cssText = 'margin-bottom:8px; padding:10px 12px; border:1px solid rgba(0,0,0,0.07); border-radius:8px; background:#fafbfc;';
            const labelLower = (item.label || 'facebook').toLowerCase();
            itemEl.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-size:10px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.04em;">Icon ${index + 1}</span>
                <div style="display:flex; gap:4px;">
                  <button type="button" data-index="${index}" class="sb-dynamic-list-up" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#6b7280; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:12px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)';this.style.color='#111827'" onmouseout="this.style.background='none';this.style.color='#6b7280'">&#8593;</button>
                  <button type="button" data-index="${index}" class="sb-dynamic-list-down" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#6b7280; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:12px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(0,0,0,0.05)';this.style.color='#111827'" onmouseout="this.style.background='none';this.style.color='#6b7280'">&#8595;</button>
                  <button type="button" data-index="${index}" class="sb-dynamic-list-remove" style="width:22px; height:22px; display:flex; align-items:center; justify-content:center; color:#ef4444; background:none; border:1px solid transparent; border-radius:4px; cursor:pointer; font-size:14px; line-height:1; transition:all 0.12s ease;" onmouseover="this.style.background='rgba(239,68,68,0.08)';this.style.borderColor='rgba(239,68,68,0.15)'" onmouseout="this.style.background='none';this.style.borderColor='transparent'">&times;</button>
                </div>
              </div>
              <select data-index="${index}" data-key="label" style="width:100%; box-sizing:border-box; margin-bottom:6px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
                <option value="facebook" ${labelLower === 'facebook' ? 'selected' : ''}>Facebook</option>
                <option value="instagram" ${labelLower === 'instagram' ? 'selected' : ''}>Instagram</option>
                <option value="x" ${labelLower === 'x' ? 'selected' : ''}>X (Twitter)</option>
                <option value="linkedin" ${labelLower === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                <option value="youtube" ${labelLower === 'youtube' ? 'selected' : ''}>YouTube</option>
                <option value="tiktok" ${labelLower === 'tiktok' ? 'selected' : ''}>TikTok</option>
                <option value="pinterest" ${labelLower === 'pinterest' ? 'selected' : ''}>Pinterest</option>
                <option value="snapchat" ${labelLower === 'snapchat' ? 'selected' : ''}>Snapchat</option>
                <option value="vimeo" ${labelLower === 'vimeo' ? 'selected' : ''}>Vimeo</option>
              </select>
              <input type="text" data-index="${index}" data-key="url" value="${item.url || ''}" placeholder="URL (e.g. https://...)" style="width:100%; box-sizing:border-box; border-radius:6px; border:1px solid rgba(0,0,0,0.1); padding:7px 10px; font-size:12px; font-family:inherit; color:#111827; background:#fff; outline:none; transition:border-color 0.12s ease;" onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='rgba(0,0,0,0.1)'">
            `;
            list.appendChild(itemEl);
          });
        };

        addBtn.addEventListener('click', () => {
          setItems([...getItems(), { label: 'facebook', url: '#' }]);
          renderItems();
        });

        list.addEventListener('change', (e) => {
          if (e.target.tagName === 'SELECT') {
            const index = e.target.getAttribute('data-index');
            const key = e.target.getAttribute('data-key');
            const items = [...getItems()];
            items[index] = { ...items[index], [key]: e.target.value };
            setItems(items);
          }
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

    traits.addType('table-cell-actions', {
      createInput({ trait, component }) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:8px;">
            <button type="button" class="btn-add-row-before" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #d1d5db; border-radius:4px; background:#fff;">+ Row Before</button>
            <button type="button" class="btn-add-row-after" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #d1d5db; border-radius:4px; background:#fff;">+ Row After</button>
            <button type="button" class="btn-delete-row" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #fecaca; border-radius:4px; background:#fef2f2; color:#ef4444;">- Del Row</button>
          </div>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            <button type="button" class="btn-add-col-before" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #d1d5db; border-radius:4px; background:#fff;">+ Col Before</button>
            <button type="button" class="btn-add-col-after" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #d1d5db; border-radius:4px; background:#fff;">+ Col After</button>
            <button type="button" class="btn-delete-col" style="flex:1; padding:4px; font-size:11px; cursor:pointer; border:1px solid #fecaca; border-radius:4px; background:#fef2f2; color:#ef4444;">- Del Col</button>
          </div>
        `;

        const row = component.parent();
        const tbody = row ? row.parent() : null;

        if (!tbody || tbody.get('tagName') !== 'tbody') {
           return wrapper;
        }

        const createCell = (isHeader = false) => ({
          type: 'email-table-cell',
          tagName: isHeader ? 'th' : 'td',
          content: 'New Cell',
          attributes: { 'data-gjs-type': 'text' },
          style: {
             padding: '12px',
             'word-break': 'break-word',
             color: isHeader ? '#0f172a' : '#475569',
             'font-size': isHeader ? '13px' : '14px',
             'font-weight': isHeader ? '700' : '400',
             'text-align': 'left',
             'background-color': isHeader ? '#f8fafc' : 'transparent',
             'border': '1px solid #dbe4f0'
          }
        });

        const updateWidths = () => {
          const firstRow = tbody.components().models[0];
          if (!firstRow) return;
          const colsCount = firstRow.components().length;
          const colPercent = (100 / colsCount).toFixed(2) + '%';
          tbody.components().forEach(r => {
             r.components().forEach(c => c.addStyle({ width: colPercent }));
          });
        };

        wrapper.querySelector('.btn-add-row-before').addEventListener('click', () => {
          const rowIndex = row.index();
          const colsCount = row.components().length;
          const newRow = tbody.components().add({ type: 'email-table-row', tagName: 'tr' }, { at: rowIndex });
          for (let i = 0; i < colsCount; i++) newRow.append(createCell());
        });

        wrapper.querySelector('.btn-add-row-after').addEventListener('click', () => {
          const rowIndex = row.index();
          const colsCount = row.components().length;
          const newRow = tbody.components().add({ type: 'email-table-row', tagName: 'tr' }, { at: rowIndex + 1 });
          for (let i = 0; i < colsCount; i++) newRow.append(createCell());
        });

        wrapper.querySelector('.btn-delete-row').addEventListener('click', () => {
          if (tbody.components().length > 1) row.remove();
        });

        wrapper.querySelector('.btn-add-col-before').addEventListener('click', () => {
          const colIndex = component.index();
          tbody.components().forEach(r => {
             r.components().add(createCell(r.components().models[0]?.get('tagName') === 'th'), { at: colIndex });
          });
          updateWidths();
        });

        wrapper.querySelector('.btn-add-col-after').addEventListener('click', () => {
          const colIndex = component.index();
          tbody.components().forEach(r => {
             r.components().add(createCell(r.components().models[0]?.get('tagName') === 'th'), { at: colIndex + 1 });
          });
          updateWidths();
        });

        wrapper.querySelector('.btn-delete-col').addEventListener('click', () => {
          const colIndex = component.index();
          if (row.components().length > 1) {
            tbody.components().forEach(r => {
               const cellToRemove = r.components().models[colIndex];
               if (cellToRemove) cellToRemove.remove();
            });
            updateWidths();
          }
        });

        return wrapper;
      },
      onEvent() {},
      onUpdate() {}
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
      <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:transparent;">
        <tr>
          <td style="padding:28px 20px;">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
              ${listItems
        .map(
          (item) => `
                    <tr>
                      <td valign="top" style="width:18px; padding:0 10px 12px 0; font-size:inherit; line-height:1.6; color:inherit;">&bull;</td>
                      <td valign="top" style="padding:0 0 12px; font-size:inherit; line-height:1.7; color:inherit; font-family:inherit;">
                        ${item.url ? `<a href="${item.url}" style="color:inherit; text-decoration:none;">${item.label || 'List item'}</a>` : item.label || 'List item'}
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

    img, p, h1, h2, h3, h4, h5, h6, table, a, div, span {
      max-width: 100%;
      word-break: break-word;
    }

    td {
      background-color: #ffffff;
    }

    body {
      margin: 0;
      padding: 32px 0 24px;
      background: transparent;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
    }

    body:empty::before {
      content: "No content here. Drag content from the right.";
      width: min(748px, calc(100% - 64px));
      min-height: 148px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 20px;
      color: #0b7ddd;
      font-size: 18px;
      line-height: 1.5;
      border: 1px dashed #7cc5f8;
      background: #dceefd;
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
      margin-top: 0 !important;
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

    td.responsive-td {
      position: relative;
      min-height: 50px;
    }
    
    td.responsive-td:empty {
      outline: 1px dashed rgba(148,163,184,0.35);
      background: #f8fafc;
    }
    
    td.responsive-td:empty::before {
      content: 'No content here. Drag content from the right.';
      display: block;
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      padding: 24px 16px;
      pointer-events: none;
    }

    td.responsive-td.is-selected-empty {
      outline: 2px solid #179cf4;
    }

    .empty-col-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 20px;
      background: rgba(248, 250, 252, 0.92);
      pointer-events: none;
      z-index: 10;
    }

    .empty-col-msg {
      max-width: 320px;
      color: #0b7ddd;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
      pointer-events: none;
    }

    .empty-col-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 0 18px;
      border: none;
      border-radius: 8px;
      background: #179cf4;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 6px 14px rgba(23, 156, 244, 0.24);
      transition: background 140ms ease;
    }

    .empty-col-btn:hover {
      background: #1087d8;
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
      name: 'Layout',
      open: true,
      properties: [
        {
          property: 'width',
          name: 'Width',
          type: 'slider',
          default: 'auto',
          defaults: 'auto',
          min: 0,
          max: 600,
          step: 1,
          units: ['px', '%', 'auto'],
        },
        {
          property: 'max-width',
          name: 'Max Width',
          default: 'none',
          defaults: 'none',
        },
        {
          property: 'min-height',
          name: 'Min Height',
          default: 'auto',
          defaults: 'auto',
        },
        {
          property: 'text-align',
          name: 'Alignment',
          type: 'radio',
          default: 'left',
          defaults: 'left',
          options: [
            { id: 'left', label: 'Left' },
            { id: 'center', label: 'Center' },
            { id: 'right', label: 'Right' },
          ],
        },
      ],
    },
    {
      name: 'Spacing',
      open: false,
      properties: [
        {
          property: 'padding',
          name: 'Padding',
          type: 'composite',
          properties: [
            { name: 'Top', property: 'padding-top', type: 'integer', default: '0', units: ['px'] },
            { name: 'Right', property: 'padding-right', type: 'integer', default: '0', units: ['px'] },
            { name: 'Bottom', property: 'padding-bottom', type: 'integer', default: '0', units: ['px'] },
            { name: 'Left', property: 'padding-left', type: 'integer', default: '0', units: ['px'] },
          ],
        },
        {
          property: 'margin',
          name: 'Margin',
          type: 'composite',
          properties: [
            { name: 'Top', property: 'margin-top', type: 'integer', default: '0', units: ['px'] },
            { name: 'Right', property: 'margin-right', type: 'integer', default: '0', units: ['px'] },
            { name: 'Bottom', property: 'margin-bottom', type: 'integer', default: '0', units: ['px'] },
            { name: 'Left', property: 'margin-left', type: 'integer', default: '0', units: ['px'] },
          ],
        },
      ],
    },
    {
      name: 'Typography',
      open: false,
      properties: [
        {
          property: 'font-family',
          name: 'Font Family',
          type: 'select',
          default: 'Arial, Helvetica, sans-serif',
          defaults: 'Arial, Helvetica, sans-serif',
          options: safeFontOptions,
        },
        {
          property: 'font-size',
          name: 'Font Size',
          type: 'integer',
          default: '14',
          defaults: '14',
          units: ['px'],
          min: 8,
          max: 100,
        },
        {
          property: 'font-weight',
          name: 'Font Weight',
          type: 'select',
          default: '400',
          defaults: '400',
          options: [
            { id: '300', label: 'Light' },
            { id: '400', label: 'Regular' },
            { id: '500', label: 'Medium' },
            { id: '600', label: 'Semi Bold' },
            { id: '700', label: 'Bold' },
            { id: '800', label: 'Extra Bold' },
          ],
        },
        {
          property: 'line-height',
          name: 'Line Height',
          type: 'integer',
          default: '140',
          defaults: '140',
          units: ['%', 'px'],
          min: 50,
          max: 300,
        },
        {
          property: 'letter-spacing',
          name: 'Letter Spacing',
          type: 'integer',
          default: '0',
          defaults: '0',
          units: ['px'],
          min: -5,
          max: 20,
        },
        {
          property: 'color',
          name: 'Text Color',
          type: 'color',
        },
        {
          property: 'text-decoration',
          name: 'Decoration',
          type: 'select',
          default: 'none',
          defaults: 'none',
          options: [
            { id: 'none', label: 'None' },
            { id: 'underline', label: 'Underline' },
            { id: 'line-through', label: 'Strikethrough' },
          ],
        },
      ],
    },
    {
      name: 'Background',
      open: false,
      properties: [
        {
          property: 'background-color',
          name: 'Background Color',
          type: 'color',
        },
        {
          property: 'opacity',
          name: 'Opacity',
          type: 'slider',
          default: '1',
          defaults: '1',
          min: 0,
          max: 1,
          step: 0.05,
        },
      ],
    },
    {
      name: 'Border',
      open: false,
      properties: [
        {
          property: 'border',
          name: 'Border',
          type: 'composite',
          properties: [
            { name: 'Width', property: 'border-width', type: 'integer', default: '0', units: ['px'] },
            {
              name: 'Style', property: 'border-style', type: 'select', default: 'none',
              options: [
                { id: 'none', label: 'None' },
                { id: 'solid', label: 'Solid' },
                { id: 'dashed', label: 'Dashed' },
                { id: 'dotted', label: 'Dotted' },
              ],
            },
            { name: 'Color', property: 'border-color', type: 'color' },
          ],
        },
        {
          property: 'border-radius',
          name: 'Corner Radius',
          type: 'integer',
          default: '0',
          defaults: '0',
          units: ['px'],
          min: 0,
          max: 100,
        },
        {
          property: 'box-shadow',
          name: 'Box Shadow',
        },
      ],
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
          ],
        },
        {
          name: 'List Position',
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

  const blockLibrary = [];

  const minimalBuilderPlugin = (editor, opts = {}) => {
    registerAssetImageTrait(editor);

    const components = editor.DomComponents;
    const blocks = editor.BlockManager;
    const layoutCategory = opts.layoutCategory || opts.basicSectionsCategory || { id: 'layout', label: 'Layout', open: true };
    const contentCategory = opts.contentCategory || { id: 'content', label: 'Content', open: true };
    const sectionsCategory = opts.sectionsCategory || { id: 'sections', label: 'Sections', open: true };
    const emailCategory = opts.emailCategory || { id: 'merge-tags', label: 'Merge Tags', open: true };

    // Common style groups for component-based rendering
    const styleGroups = {
      typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'text-align', 'text-decoration'],
      layout: ['width', 'max-width', 'min-height', 'padding', 'margin'],
      background: ['background-color', 'opacity'],
      border: ['border', 'border-radius', 'box-shadow'],
    };

    // Register base-shell to natively enforce non-removable behavior on the initial layout only
    components.addType('base-shell', {
      isComponent: el => el.tagName === 'TABLE' && el.classList && el.classList.contains('base-shell'),
      model: {
        defaults: {
          removable: false,
          copyable: false,
          draggable: false,
          droppable: false,
          hoverable: false,
          highlightable: false,
        }
      }
    });

    blockLibrary.length = 0;

    const createColumnLayout = (_columnCount, widths) => {
      const columnMarkup = widths
        .map((width, index) => {
          const isFirst = index === 0;
          const isLast = index === widths.length - 1;
          const padding = isFirst ? '0 8px 0 0' : isLast ? '0 0 0 8px' : '0 8px';
          return `<td class="responsive-td" width="${width}" valign="top" style="padding:${padding}; word-break: break-word;" data-gjs-droppable="true" data-gjs-highlightable="true" data-layout-role="layout-column" data-gjs-name="Column ${index + 1}"></td>`;
        })
        .join('');

      return `
        <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:transparent;" data-layout-role="layout-shell" data-gjs-name="Columns">
          <tr>
            <td style="padding:20px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" data-layout-role="layout-grid" data-gjs-name="Columns Grid">
                <tr data-layout-role="layout-row" data-gjs-name="Row">
                  ${columnMarkup}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    };

    const registerBlock = ({
      id,
      label,
      icon,
      group,
      keywords = '',
      category,
      content,
      select = false,
      activate = false,
      attributes = {},
      customLabel = false,
      titleText = '',
    }) => {
      blockLibrary.push({ id, label, icon, group, keywords, content });
      blocks.add(id, {
        label: customLabel ? label : blockLabel(icon, label),
        category,
        content,
        select,
        activate,
        attributes: {
          ...attributes,
          title: customLabel ? titleText : label,
          'data-block-id': id,
          'data-group': group,
          'data-keywords': `${label} ${keywords}`.trim(),
        },
      });
    };

    const mergeTagDefinitions = {
      name: {
        label: 'Name',
        raw: '{{name}}',
      },
      email: {
        label: 'Email',
        raw: '{{email}}',
      },
      unsubscribe: {
        label: 'Unsubscribe',
        href: '{{unsubscribe_url}}',
      },
    };

    const getMergeTagDefinition = (kind = 'name') => mergeTagDefinitions[kind] || mergeTagDefinitions.name;
    const getMergeTagLabel = (kind = 'name') => getMergeTagDefinition(kind).label;

    const syncMergeTagModel = (model, opts = {}) => {
      const kind = model.get('mergeKind') || (model.is('merge-tag-link') ? 'unsubscribe' : 'name');
      const definition = getMergeTagDefinition(kind);
      const attrs = {
        ...model.getAttributes({ noClass: true }),
        'data-merge-editor': 'true',
        'data-merge-kind': kind,
        contenteditable: 'false',
      };

      if (model.is('merge-tag-inline')) {
        attrs['data-merge-raw'] = model.get('mergeRaw') || definition.raw;
      } else {
        attrs.href = attrs.href || definition.href;
        delete attrs['data-merge-raw'];
      }

      model.set(
        {
          mergeKind: kind,
          name: getMergeTagLabel(kind),
        },
        { ...opts, silent: true },
      );

      model.setAttributes(attrs, opts);
    };

    components.addType('merge-tag-inline', {
      isComponent(el) {
        if (el?.nodeType !== 1 || el.getAttribute('data-merge-editor') !== 'true') {
          return false;
        }

        const kind = el.getAttribute('data-merge-kind');
        if (!['name', 'email'].includes(kind)) {
          return false;
        }

        return {
          type: 'merge-tag-inline',
          mergeKind: kind,
          mergeRaw: el.getAttribute('data-merge-raw') || getMergeTagDefinition(kind).raw,
          content: el.textContent || getMergeTagLabel(kind),
        };
      },

      model: {
        defaults: {
          name: 'Merge Tag',
          tagName: 'span',
          classes: ['sb-merge-tag', 'sb-merge-tag--inline'],
          selectable: true,
          removable: true,
          copyable: true,
          draggable: true,
          droppable: false,
          editable: false,
          highlightable: true,
          stylable: false,
          mergeKind: 'name',
          mergeRaw: '{{name}}',
          content: 'Name',
          attributes: {
            'data-merge-editor': 'true',
            'data-merge-kind': 'name',
            'data-merge-raw': '{{name}}',
            contenteditable: 'false',
          },
        },

        init() {
          this.on('change:mergeKind change:mergeRaw', () => syncMergeTagModel(this));
          syncMergeTagModel(this);
        },
      },
    });

    components.addType('merge-tag-link', {
      isComponent(el) {
        if (el?.nodeType !== 1 || el.getAttribute('data-merge-editor') !== 'true') {
          return false;
        }

        if (el.getAttribute('data-merge-kind') !== 'unsubscribe') {
          return false;
        }

        return {
          type: 'merge-tag-link',
          mergeKind: 'unsubscribe',
          content: el.textContent || 'Unsubscribe',
        };
      },

      model: {
        defaults: {
          name: 'Unsubscribe',
          tagName: 'a',
          classes: ['sb-merge-tag', 'sb-merge-tag--link'],
          selectable: true,
          removable: true,
          copyable: true,
          draggable: true,
          droppable: false,
          editable: false,
          highlightable: true,
          stylable: false,
          mergeKind: 'unsubscribe',
          content: 'Unsubscribe',
          attributes: {
            href: '{{unsubscribe_url}}',
            style: 'color: #6b7280; text-decoration: underline; font-size: 12px;',
            'data-merge-editor': 'true',
            'data-merge-kind': 'unsubscribe',
            contenteditable: 'false',
          },
        },

        init() {
          this.on('change:mergeKind', () => syncMergeTagModel(this));
          syncMergeTagModel(this);
        },
      },
    });

    components.addType('email-heading', {
      model: {
        defaults: {
          name: 'Heading',
          tagName: 'div',
          classes: ['sb-section', 'sb-heading'],
          style: {
            'color': '#111827',
            'font-family': 'Arial, Helvetica, sans-serif',
            'line-height': '1.25',
            'text-align': 'left',
          },
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background],
          headingText: 'Write a strong headline',
          headingLevel: 'h2',
          align: 'left',
          traits: [
            textareaTrait('headingText', 'Heading text'),
            {
              type: 'select',
              name: 'headingLevel',
              label: 'Heading size',
              changeProp: true,
              options: [
                { id: 'h1', name: 'Large' },
                { id: 'h2', name: 'Medium' },
                { id: 'h3', name: 'Small' },
              ],
            },
            {
              type: 'select',
              name: 'align',
              label: 'Align',
              changeProp: true,
              options: [
                { id: 'left', name: 'Left' },
                { id: 'center', name: 'Center' },
                { id: 'right', name: 'Right' },
              ],
            },
          ],
        },

        init() {
          syncAlignmentStyle(this, 'align', 'left');
          bindRenderer(this, ['headingText', 'headingLevel', 'align'], renderHeadingBlock);
        },
      },
    });

    components.addType('email-paragraph', {
      model: {
        defaults: {
          name: 'Paragraph',
          tagName: 'div',
          classes: ['sb-section', 'sb-paragraph'],
          style: {
            'color': '#475569',
            'font-family': 'Arial, Helvetica, sans-serif',
            'line-height': '1.7',
            'text-align': 'left',
          },
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background],
          paragraphText: 'Add your supporting copy here. This block is designed for email-safe copy sections and introductory text.',
          align: 'left',
          traits: [
            textareaTrait('paragraphText', 'Paragraph text'),
            {
              type: 'select',
              name: 'align',
              label: 'Align',
              changeProp: true,
              options: [
                { id: 'left', name: 'Left' },
                { id: 'center', name: 'Center' },
                { id: 'right', name: 'Right' },
              ],
            },
          ],
        },

        init() {
          syncAlignmentStyle(this, 'align', 'left');
          bindRenderer(this, ['paragraphText', 'align'], renderParagraphBlock);
        },
      },
    });

    components.addType('email-image', {
      model: {
        defaults: {
          name: 'Image',
          tagName: 'div',
          classes: ['sb-section', 'sb-image'],
          stylable: ['padding', 'margin', ...styleGroups.border, ...styleGroups.background],
          style: {
            'text-align': 'center',
          },
          imageSrc: 'https://picsum.photos/id/1060/900/700',
          imageAlt: 'Email image',
          imageCta: { type: 'website', url: '', target: '_blank', email: '', subject: '', phone: '' },
          imageWidth: '100%',
          imageAlign: 'center',
          traits: [
            { type: 'asset-image', name: 'imageSrc', label: 'Image source', changeProp: true, category: traitCategories.media },
            textTrait('imageAlt', 'Image alt'),
            { type: 'cta-action', name: 'imageCta', label: 'Action', changeProp: true },
            textTrait('imageWidth', 'Width (e.g. 100% or 320px)'),
            {
              type: 'select', name: 'imageAlign', label: 'Align', changeProp: true,
              options: [
                { id: 'left', name: 'Left' }, { id: 'center', name: 'Center' }, { id: 'right', name: 'Right' },
              ],
            },
          ],
        },

        init() {
          syncAlignmentStyle(this, 'imageAlign', 'center');
          bindRenderer(this, ['imageSrc', 'imageAlt', 'imageCta', 'imageWidth', 'imageAlign'], renderImageBlock);
        },
      },
    });

    components.addType('email-button', {
      model: {
        defaults: {
          name: 'Button',
          tagName: 'div',
          classes: ['sb-section', 'sb-button'],
          stylable: ['width', 'max-width', 'min-height', 'padding', 'margin'], // Removed background/color/border as they are traits
          buttonText: 'Click me',
          buttonCta: { type: 'website', url: '#', target: '_self', email: '', subject: '', phone: '' },
          align: 'center',
          buttonColor: '#111827',
          textColor: '#ffffff',
          borderRadius: 8,
          buttonPadding: '14px 28px',
          fullWidth: false,
          traits: [
            textTrait('buttonText', 'Button text'),
            { type: 'cta-action', name: 'buttonCta', label: 'Action', changeProp: true },
            { type: 'color', name: 'buttonColor', label: 'Button Color', changeProp: true },
            { type: 'color', name: 'textColor', label: 'Text Color', changeProp: true },
            { type: 'number', name: 'borderRadius', label: 'Corner radius', changeProp: true, min: 0, max: 50, step: 1 },
            textTrait('buttonPadding', 'Padding (CSS)'),
            checkboxTrait('fullWidth', 'Full width'),
            {
              type: 'select',
              name: 'align',
              label: 'Align',
              changeProp: true,
              options: [
                { id: 'left', name: 'Left' },
                { id: 'center', name: 'Center' },
                { id: 'right', name: 'Right' },
              ],
            },
          ],
        },

        init() {
          bindRenderer(this, ['buttonText', 'buttonCta', 'buttonColor', 'textColor', 'borderRadius', 'buttonPadding', 'fullWidth', 'align'], renderButtonBlock);
        },
      },
    });

    components.addType('email-divider', {
      model: {
        defaults: {
          name: 'Divider',
          tagName: 'div',
          classes: ['sb-section', 'sb-divider'],
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          dividerColor: '#e2e8f0',
          dividerThickness: '1px',
          dividerWidth: '100%',
          traits: [
            { type: 'color', name: 'dividerColor', label: 'Divider color', changeProp: true },
            textTrait('dividerThickness', 'Thickness'),
            textTrait('dividerWidth', 'Width'),
          ],
        },

        init() {
          bindRenderer(this, ['dividerColor', 'dividerThickness', 'dividerWidth'], renderDividerBlock);
        },
      },
    });

    components.addType('email-spacer', {
      model: {
        defaults: {
          name: 'Spacer',
          tagName: 'div',
          classes: ['sb-section', 'sb-spacer'],
          stylable: ['min-height', 'background-color'],
          spacerHeight: 32,
          traits: [
            { type: 'number', name: 'spacerHeight', label: 'Height (px)', changeProp: true, min: 4, max: 160, step: 2 },
          ],
        },

        init() {
          bindRenderer(this, ['spacerHeight'], renderSpacerBlock);
        },
      },
    });

    components.addType('email-video', {
      model: {
        defaults: {
          name: 'Video',
          tagName: 'div',
          classes: ['sb-section', 'sb-video'],
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          videoTitle: 'Watch the video',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoThumbnail: '',
          videoAlt: 'Video preview',
          videoCta: { type: 'website', url: '', target: '_blank', email: '', subject: '', phone: '' },
          traits: [
            textTrait('videoTitle', 'Title'),
            textTrait('videoUrl', 'Video URL'),
            { type: 'asset-image', name: 'videoThumbnail', label: 'Thumbnail', changeProp: true, category: traitCategories.media },
            textTrait('videoAlt', 'Thumbnail alt'),
            { type: 'cta-action', name: 'videoCta', label: 'Action', changeProp: true },
          ],
        },

        init() {
          bindRenderer(this, ['videoTitle', 'videoUrl', 'videoThumbnail', 'videoAlt', 'videoCta'], renderVideoBlock);
        },
      },
    });

    components.addType('email-html', {
      model: {
        defaults: {
          name: 'HTML',
          tagName: 'div',
          classes: ['sb-section', 'sb-html'],
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background],
          htmlCode: '<div style="padding:12px; border:1px dashed #cbd5e1; text-align:center;">Custom HTML block</div>',
          traits: [
            { ...textareaTrait('htmlCode', 'HTML code'), rows: 8, placeholder: '<div>Custom content</div>' },
          ],
        },

        init() {
          bindRenderer(this, ['htmlCode'], renderHtmlBlock);
        },
      },
    });

    components.addType('email-table-cell', {
      extend: 'text',
      isComponent(el) {
        if (el.tagName === 'TD' || el.tagName === 'TH') {
          return { type: 'email-table-cell' };
        }
        return false;
      },
      model: {
        defaults: {
          name: 'Cell',
          tagName: 'td',
          draggable: ['tr', 'tbody', 'thead', 'tfoot'],
          droppable: true,
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          traits: [
            { type: 'table-cell-actions', name: 'actions', label: 'Grid Actions' },
            { type: 'number', name: 'colspan', label: 'Colspan', min: 1, max: 10 },
            { type: 'number', name: 'rowspan', label: 'Rowspan', min: 1, max: 10 },
            { type: 'select', name: 'align', label: 'Align (Horiz)', options: [
              { id: 'left', name: 'Left' }, { id: 'center', name: 'Center' }, { id: 'right', name: 'Right' }
            ]},
            { type: 'select', name: 'valign', label: 'Align (Vert)', options: [
              { id: 'top', name: 'Top' }, { id: 'middle', name: 'Middle' }, { id: 'bottom', name: 'Bottom' }
            ]},
            { type: 'color', name: 'background-color', label: 'Background' },
            { type: 'text', name: 'padding', label: 'Padding' },
          ],
        },
        init() {
          this.on('change:attributes:colspan change:attributes:rowspan change:attributes:align change:attributes:valign change:attributes:background-color change:attributes:padding', this.syncAttributesToStyles);
          this.on('change:style', this.syncStylesToAttributes);
        },
        syncAttributesToStyles() {
          const attrs = this.getAttributes();
          const style = {};
          if (attrs.align) style['text-align'] = attrs.align;
          if (attrs.valign) style['vertical-align'] = attrs.valign;
          if (attrs['background-color']) style['background-color'] = attrs['background-color'];
          if (attrs.padding) style['padding'] = attrs.padding;
          if (Object.keys(style).length > 0) {
             this.addStyle(style);
          }
        },
        syncStylesToAttributes() {
          const style = this.getStyle();
          const attrs = this.getAttributes();
          let changed = false;
          const newAttrs = { ...attrs };
          if (style['text-align'] && style['text-align'] !== attrs.align) { newAttrs.align = style['text-align']; changed = true; }
          if (style['vertical-align'] && style['vertical-align'] !== attrs.valign) { newAttrs.valign = style['vertical-align']; changed = true; }
          if (style['background-color'] && style['background-color'] !== attrs['background-color']) { newAttrs['background-color'] = style['background-color']; changed = true; }
          if (style['padding'] && style['padding'] !== attrs.padding) { newAttrs.padding = style['padding']; changed = true; }
          if (changed) {
            this.setAttributes(newAttrs);
          }
        }
      }
    });

    components.addType('email-table-row', {
      model: {
        defaults: {
          name: 'Row',
          tagName: 'tr',
          draggable: ['tbody', 'thead', 'tfoot', 'table'],
          droppable: ['th', 'td', 'email-table-cell'],
          stylable: [...styleGroups.background, ...styleGroups.border],
        }
      }
    });

    components.addType('email-table', {
      model: {
        defaults: {
          name: 'Table',
          tagName: 'div',
          classes: ['sb-section', 'sb-table'],
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          tableIncludeHeader: true,
          cellPadding: 12,
          borderWidth: 1,
          borderColor: '#dbe4f0',
          borderStyle: 'solid',
          tableBackground: 'transparent',
          traits: [
            checkboxTrait('tableIncludeHeader', 'Header row'),
            { type: 'number', name: 'cellPadding', label: 'Padding (px)', changeProp: true, min: 0, max: 40, step: 1 },
            { type: 'number', name: 'borderWidth', label: 'Border (px)', changeProp: true, min: 0, max: 10, step: 1 },
            { type: 'select', name: 'borderStyle', label: 'Border Style', changeProp: true, options: [
                { id: 'solid', name: 'Solid' }, { id: 'dashed', name: 'Dashed' }, { id: 'dotted', name: 'Dotted' }, { id: 'none', name: 'None' }
            ] },
            { type: 'color', name: 'borderColor', label: 'Border Color', changeProp: true },
            { type: 'color', name: 'tableBackground', label: 'Background', changeProp: true },
          ],
        },

        init() {
          const findByClass = (comp, className) => {
            if (comp.getClasses?.().includes(className)) return comp;
            const children = comp.components().models;
            for (let i = 0; i < children.length; i++) {
              const found = findByClass(children[i], className);
              if (found) return found;
            }
            return null;
          };

          this.getInnerTbody = () => {
             let tbody = findByClass(this, 'sb-inner-tbody');
             if (!tbody) {
                const innerTable = findByClass(this, 'sb-inner-table');
                if (innerTable) {
                   tbody = innerTable.components().models.find(c => c.get('tagName') === 'tbody') || innerTable;
                }
             }
             return tbody;
          };

          if (this.components().length === 0) {
            this.components(`
              <table class="sb-shell" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width:600px; margin:0 auto; background:transparent;">
                <tr>
                  <td style="padding:20px;">
                    <table class="sb-inner-table" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:transparent; width:100%; table-layout:fixed;">
                      <tbody class="sb-inner-tbody">
                        <tr data-gjs-type="email-table-row">
                          <th data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#0f172a; font-size:13px; font-weight:700; text-align:left; background-color:#f8fafc; border:1px solid #dbe4f0;">Heading 1</th>
                          <th data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#0f172a; font-size:13px; font-weight:700; text-align:left; background-color:#f8fafc; border:1px solid #dbe4f0;">Heading 2</th>
                          <th data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#0f172a; font-size:13px; font-weight:700; text-align:left; background-color:#f8fafc; border:1px solid #dbe4f0;">Heading 3</th>
                        </tr>
                        <tr data-gjs-type="email-table-row">
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 1.1</td>
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 1.2</td>
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 1.3</td>
                        </tr>
                        <tr data-gjs-type="email-table-row">
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 2.1</td>
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 2.2</td>
                          <td data-gjs-type="email-table-cell" style="padding:12px; width:33.33%; word-break:break-word; color:#475569; font-size:14px; font-weight:400; text-align:left; background-color:transparent; border:1px solid #dbe4f0;">Cell 2.3</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
            `);
          }

          this.on('change:tableIncludeHeader', this.syncHeader);
          this.on('change:cellPadding change:borderWidth change:borderStyle change:borderColor change:tableBackground', this.syncTableStyles);
        },

        syncHeader() {
          const tbody = this.getInnerTbody();
          if (!tbody) return;
          const includeHeader = this.get('tableIncludeHeader') !== false;
          const firstRow = tbody.components().models[0];
          if (firstRow) {
            firstRow.components().models.forEach(col => {
              const currentlyIsTh = col.get('tagName') === 'th';
              if (currentlyIsTh !== includeHeader) {
                col.set('tagName', includeHeader ? 'th' : 'td');
                col.addStyle({
                  'font-weight': includeHeader ? '700' : '400',
                  color: includeHeader ? '#0f172a' : '#475569',
                  'font-size': includeHeader ? '13px' : '14px',
                  'background-color': includeHeader ? '#f8fafc' : 'transparent'
                });
              }
            });
          }
        },

        syncTableStyles() {
          const tbody = this.getInnerTbody();
          if (!tbody) return;

          const pad = (parseInt(this.get('cellPadding'), 10) || 0) + 'px';
          const bw = (parseInt(this.get('borderWidth'), 10) || 0) + 'px';
          const bc = this.get('borderColor') || '#dbe4f0';
          const bs = this.get('borderStyle') || 'solid';
          const bg = this.get('tableBackground') || 'transparent';
          const borderStyleStr = bw === '0px' ? 'none' : `${bw} ${bs} ${bc}`;

          const innerTable = tbody.parent();
          if (innerTable && innerTable.get('tagName') === 'table') {
            innerTable.addStyle({ background: bg });
          }

          tbody.components().models.forEach((rowComp) => {
            rowComp.components().models.forEach((tdComp) => {
               tdComp.addStyle({
                 padding: pad,
                 border: borderStyleStr
               });
            });
          });
        }
      },
    });

    components.addType('site-header', {
      model: {
        defaults: {
          name: 'Email Header',
          tagName: 'div',
          classes: ['sb-section', 'sb-header'],
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
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

    components.addType('menu-items-component', {
      model: {
        defaults: {
          name: 'Menu Items',
          tagName: 'div',
          classes: ['sb-menu-items'],
          style: {
            'color': '#374151',
            'font-family': 'Arial, Helvetica, sans-serif',
            'font-size': '14px',
            'text-align': 'center',
          },
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          navItems: [
            { label: 'Shop', url: '#' },
            { label: 'About', url: '#' },
            { label: 'Contact', url: '#' }
          ],
          layout: 'horizontal',
          align: 'center',
          spacing: 15,
          menuPadding: '16px 0',
          textColor: '#374151',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: 'Arial, Helvetica, sans-serif',
          backgroundColor: 'transparent',
          dividerColor: 'transparent',
          traits: [
            { type: 'dynamic-list', name: 'navItems', label: 'Menu items' },
            { type: 'select', name: 'layout', label: 'Layout', changeProp: true, options: [{ id: 'horizontal', name: 'Horizontal' }, { id: 'vertical', name: 'Vertical' }] },
            { type: 'select', name: 'align', label: 'Align', changeProp: true, options: [{ id: 'left', name: 'Left' }, { id: 'center', name: 'Center' }, { id: 'right', name: 'Right' }] },
            { type: 'number', name: 'spacing', label: 'Spacing (px)', changeProp: true, min: 0, max: 100 },
            textTrait('menuPadding', 'Padding (e.g. 16px 0)'),
            { type: 'color', name: 'textColor', label: 'Text color', changeProp: true },
            textTrait('fontSize', 'Font size'),
            { type: 'select', name: 'fontWeight', label: 'Font weight', changeProp: true, options: [{ id: '400', name: 'Normal' }, { id: '500', name: 'Medium' }, { id: '700', name: 'Bold' }] },
            {
              type: 'select', name: 'fontFamily', label: 'Font family', changeProp: true, options: [
                { id: 'Arial, Helvetica, sans-serif', name: 'Arial' },
                { id: '"Helvetica Neue", Helvetica, Arial, sans-serif', name: 'Helvetica' },
                { id: '"Times New Roman", Times, serif', name: 'Times New Roman' },
                { id: 'Georgia, serif', name: 'Georgia' },
                { id: 'Tahoma, Verdana, Segoe, sans-serif', name: 'Tahoma' },
                { id: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif', name: 'Trebuchet MS' },
                { id: '"Courier New", Courier, monospace', name: 'Courier New' }
              ]
            },
            { type: 'color', name: 'backgroundColor', label: 'Background', changeProp: true },
            { type: 'color', name: 'dividerColor', label: 'Divider color', changeProp: true },
          ],
        },
        init() {
          bindRenderer(
            this,
            ['navItems', 'layout', 'align', 'spacing', 'menuPadding', 'textColor', 'fontSize', 'fontWeight', 'fontFamily', 'backgroundColor', 'dividerColor'],
            renderMenuItems,
          );
        },
      },
    });

    components.addType('social-links-component', {
      model: {
        defaults: {
          name: 'Social Links',
          tagName: 'div',
          classes: ['sb-social-links'],
          stylable: [...styleGroups.layout, ...styleGroups.background, ...styleGroups.border],
          socialItems: [
            { label: 'facebook', url: '#' },
            { label: 'x', url: '#' },
            { label: 'instagram', url: '#' },
            { label: 'linkedin', url: '#' }
          ],
          align: 'center',
          iconStyle: 'solid-branded',
          iconShape: 'circle',
          linkColor: '#6366f1',
          iconSize: 32,
          spacing: 12,
          traits: [
            { type: 'social-list', name: 'socialItems', label: 'Social links', changeProp: true },
            {
              type: 'select', name: 'iconStyle', label: 'Icon Style', changeProp: true, options: [
                { id: 'branded', name: 'Branded Color' },
                { id: 'solid-branded', name: 'Solid Branded' },
                { id: 'outline', name: 'Outline Custom' },
                { id: 'solid-custom', name: 'Solid Custom' }
              ]
            },
            {
              type: 'select', name: 'iconShape', label: 'Icon Shape', changeProp: true, options: [
                { id: 'circle', name: 'Circle' },
                { id: 'square', name: 'Square' },
                { id: 'rounded', name: 'Rounded' },
                { id: 'none', name: 'None' }
              ]
            },
            { type: 'color', name: 'linkColor', label: 'Custom color', changeProp: true },
            { type: 'number', name: 'iconSize', label: 'Size (px)', changeProp: true, default: 32, min: 16, max: 64, step: 1 },
            { type: 'number', name: 'spacing', label: 'Spacing (px)', changeProp: true, default: 12, min: 0, max: 48, step: 1 },
            { type: 'select', name: 'align', label: 'Align', changeProp: true, options: [{ id: 'left', name: 'Left' }, { id: 'center', name: 'Center' }, { id: 'right', name: 'Right' }] },
          ],
        },
        init() {
          bindRenderer(
            this,
            ['socialItems', 'align', 'linkColor', 'iconSize', 'iconStyle', 'iconShape', 'spacing'],
            renderSocialLinks,
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
          style: {
            'color': '#334155',
            'font-family': 'Arial, Helvetica, sans-serif',
            'font-size': '15px',
          },
          stylable: [...styleGroups.typography, ...styleGroups.layout, ...styleGroups.background, 'list-style-type', 'list-style-position'],
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

    const renderStructurePreview = (widths, text) => {
      const columns = widths.map(w => `<div class="sb-struct-col" style="flex: ${w};"></div>`).join('');
      return `
        <div class="sb-struct-preview">
          <div class="sb-struct-cols">${columns}</div>
          <div class="sb-struct-text">${text}</div>
        </div>
      `;
    };

    registerBlock({
      id: 'section-1',
      label: renderStructurePreview([1], '100%'),
      titleText: '100%',
      icon: '',
      group: 'layout',
      keywords: '100 percent full width single section row layout wrapper',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(1, ['100%']),
    });

    registerBlock({
      id: 'section-1-2',
      label: renderStructurePreview([1, 1], '50% / 50%'),
      titleText: '50 / 50',
      icon: '',
      group: 'layout',
      keywords: '50 50 two columns split layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(2, ['50%', '50%']),
    });

    registerBlock({
      id: 'section-1-3',
      label: renderStructurePreview([1, 1, 1], '33% / 33% / 33%'),
      titleText: '33 / 33 / 33',
      icon: '',
      group: 'layout',
      keywords: '33 33 33 three columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(3, ['33.33%', '33.33%', '33.33%']),
    });

    registerBlock({
      id: 'section-1-4',
      label: renderStructurePreview([1, 1, 1, 1], '25% / 25% / 25% / 25%'),
      titleText: '4 Columns',
      icon: '',
      group: 'layout',
      keywords: 'four columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(4, ['25%', '25%', '25%', '25%']),
    });

    registerBlock({
      id: 'section-2-1',
      label: renderStructurePreview([2, 1], '67% / 33%'),
      titleText: '67 / 33',
      icon: '',
      group: 'layout',
      keywords: '67 33 asymmetric wide left columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(2, ['66.66%', '33.33%']),
    });

    registerBlock({
      id: 'section-1-2-wide',
      label: renderStructurePreview([1, 2], '33% / 67%'),
      titleText: '33 / 67',
      icon: '',
      group: 'layout',
      keywords: '33 67 asymmetric wide right columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(2, ['33.33%', '66.66%']),
    });

    registerBlock({
      id: 'section-25-50-25',
      label: renderStructurePreview([1, 2, 1], '25% / 50% / 25%'),
      titleText: '25 / 50 / 25',
      icon: '',
      group: 'layout',
      keywords: '25 50 25 centered wide middle columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(3, ['25%', '50%', '25%']),
    });

    registerBlock({
      id: 'section-25-25-50',
      label: renderStructurePreview([1, 1, 2], '25% / 25% / 50%'),
      titleText: '25 / 25 / 50',
      icon: '',
      group: 'layout',
      keywords: '25 25 50 asymmetric wide right three columns layout',
      category: layoutCategory,
      customLabel: true,
      content: createColumnLayout(3, ['25%', '25%', '50%']),
    });

    registerBlock({
      id: 'heading',
      label: 'Heading',
      icon: 'HED',
      group: 'content',
      keywords: 'headline title heading text',
      category: contentCategory,
      select: true,
      content: { type: 'email-heading' },
    });

    registerBlock({
      id: 'paragraph',
      label: 'Paragraph',
      icon: 'PAR',
      group: 'content',
      keywords: 'text copy paragraph content',
      category: contentCategory,
      select: true,
      content: { type: 'email-paragraph' },
    });

    registerBlock({
      id: 'image',
      label: 'Image',
      icon: 'IMG',
      group: 'content',
      keywords: 'photo hero media asset',
      category: contentCategory,
      select: true,
      content: { type: 'email-image' },
    });

    registerBlock({
      id: 'button',
      label: 'Button',
      icon: 'BTN',
      group: 'content',
      keywords: 'cta call to action button',
      category: contentCategory,
      select: true,
      content: { type: 'email-button' },
    });

    registerBlock({
      id: 'divider',
      label: 'Divider',
      icon: 'DIV',
      group: 'content',
      keywords: 'separator horizontal rule divider',
      category: contentCategory,
      select: true,
      content: { type: 'email-divider' },
    });

    registerBlock({
      id: 'spacer',
      label: 'Spacer',
      icon: 'SP',
      group: 'content',
      keywords: 'spacing whitespace gap spacer',
      category: contentCategory,
      select: true,
      content: { type: 'email-spacer' },
    });

    registerBlock({
      id: 'menu-items',
      label: 'Menu',
      icon: 'NAV',
      group: 'content',
      keywords: 'navigation links menu header',
      category: contentCategory,
      select: true,
      content: { type: 'menu-items-component' },
    });

    registerBlock({
      id: 'social-links',
      label: 'Social',
      icon: 'SOC',
      group: 'content',
      keywords: 'social icons links instagram linkedin facebook x',
      category: contentCategory,
      select: true,
      content: { type: 'social-links-component' },
    });

    registerBlock({
      id: 'video',
      label: 'Video',
      icon: 'VID',
      group: 'content',
      keywords: 'video youtube thumbnail play',
      category: contentCategory,
      select: true,
      content: { type: 'email-video' },
    });

    registerBlock({
      id: 'html',
      label: 'HTML',
      icon: 'HTM',
      group: 'content',
      keywords: 'custom html advanced embed',
      category: contentCategory,
      select: true,
      content: { type: 'email-html' },
    });

    registerBlock({
      id: 'columns',
      label: 'Columns',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="8" height="16" rx="2"></rect><rect x="13" y="4" width="8" height="16" rx="2"></rect></svg>`,
      group: 'content',
      keywords: 'columns row layout split',
      category: contentCategory,
      content: createColumnLayout(2, ['50%', '50%']),
    });

    registerBlock({
      id: 'table',
      label: 'Table',
      icon: 'TBL',
      group: 'content',
      keywords: 'table rows columns pricing comparison',
      category: contentCategory,
      select: true,
      content: { type: 'email-table' },
    });

    registerBlock({
      id: 'list',
      label: 'List',
      icon: 'LST',
      group: 'content',
      keywords: 'bullet list checklist',
      category: contentCategory,
      select: true,
      content: { type: 'custom-list' },
    });

    registerBlock({
      id: 'site-header',
      label: 'Header',
      icon: 'HD',
      group: 'sections',
      keywords: 'brand intro top navigation hero header',
      category: sectionsCategory,
      select: true,
      content: { type: 'site-header' },
    });

    registerBlock({
      id: 'hero-section',
      label: 'Hero',
      icon: 'HR',
      group: 'sections',
      keywords: 'hero intro launch announcement',
      category: sectionsCategory,
      select: true,
      content: { type: 'hero-section' },
    });

    registerBlock({
      id: 'feature-grid',
      label: 'Benefits',
      icon: 'FG',
      group: 'sections',
      keywords: 'benefits features cards',
      category: sectionsCategory,
      select: true,
      content: { type: 'feature-grid' },
    });

    registerBlock({
      id: 'products-section',
      label: 'Products',
      icon: 'PG',
      group: 'sections',
      keywords: 'products cards ecommerce offers',
      category: sectionsCategory,
      select: true,
      content: { type: 'products-section' },
    });

    registerBlock({
      id: 'product-card',
      label: 'Product Card',
      icon: 'PC',
      group: 'sections',
      keywords: 'single product pricing card',
      category: sectionsCategory,
      select: true,
      content: { type: 'product-card' },
    });

    registerBlock({
      id: 'feature-carousel',
      label: 'Story Cards',
      icon: 'CR',
      group: 'sections',
      keywords: 'story cards editorial content',
      category: sectionsCategory,
      select: true,
      content: { type: 'feature-carousel' },
    });

    registerBlock({
      id: 'testimonials-section',
      label: 'Testimonials',
      icon: 'TS',
      group: 'sections',
      keywords: 'quotes social proof reviews',
      category: sectionsCategory,
      select: true,
      content: { type: 'testimonials-section' },
    });

    registerBlock({
      id: 'faq-section',
      label: 'FAQ',
      icon: 'FQ',
      group: 'sections',
      keywords: 'frequently asked questions support',
      category: sectionsCategory,
      select: true,
      content: { type: 'faq-section' },
    });

    registerBlock({
      id: 'cta-banner',
      label: 'CTA Banner',
      icon: 'CT',
      group: 'sections',
      keywords: 'call to action closing banner',
      category: sectionsCategory,
      select: true,
      content: { type: 'cta-banner' },
    });

    registerBlock({
      id: 'site-footer',
      label: 'Footer',
      icon: 'FT',
      group: 'sections',
      keywords: 'footer links compliance contact unsubscribe',
      category: sectionsCategory,
      select: true,
      content: { type: 'site-footer' },
    });

    registerBlock({
      id: 'tag-name',
      label: 'Name',
      icon: 'NM',
      group: 'merge',
      keywords: 'merge tag variable name',
      category: emailCategory,
      content: {
        type: 'merge-tag-inline',
        mergeKind: 'name',
        mergeRaw: '{{name}}',
        content: 'Name',
        attributes: {
          'data-merge-editor': 'true',
          'data-merge-kind': 'name',
          'data-merge-raw': '{{name}}',
          contenteditable: 'false',
        },
      },
    });

    registerBlock({
      id: 'tag-email',
      label: 'Email',
      icon: 'EM',
      group: 'merge',
      keywords: 'merge tag variable email',
      category: emailCategory,
      content: {
        type: 'merge-tag-inline',
        mergeKind: 'email',
        mergeRaw: '{{email}}',
        content: 'Email',
        attributes: {
          'data-merge-editor': 'true',
          'data-merge-kind': 'email',
          'data-merge-raw': '{{email}}',
          contenteditable: 'false',
        },
      },
    });

    registerBlock({
      id: 'tag-unsubscribe',
      label: 'Unsubscribe',
      icon: 'UN',
      group: 'merge',
      keywords: 'merge tag unsubscribe link',
      category: emailCategory,
      content: {
        type: 'merge-tag-link',
        mergeKind: 'unsubscribe',
        content: 'Unsubscribe',
        attributes: {
          href: '{{unsubscribe_url}}',
          style: 'color: #6b7280; text-decoration: underline; font-size: 12px;',
          'data-merge-editor': 'true',
          'data-merge-kind': 'unsubscribe',
          contenteditable: 'false',
        },
      },
    });

    const isResponsiveColumn = (model) =>
      model?.get?.('tagName') === 'td' && model?.getClasses?.()?.includes('responsive-td');
    const updateEmptyColumnOverlay = (model, isSelected) => {
      if (!isResponsiveColumn(model)) {
        return;
      }

      const el = model.getEl();
      if (!el) {
        return;
      }

      const isEmpty = model.components().length === 0;
      const existing = el.querySelector('.empty-col-overlay');
      if (!isSelected || !isEmpty) {
        el.classList.remove('is-selected-empty');
        existing?.remove();
        return;
      }

      el.classList.add('is-selected-empty');
      if (existing) {
        return;
      }

      const overlay = el.ownerDocument.createElement('div');
      overlay.className = 'empty-col-overlay';
      overlay.innerHTML = `
        <div class="empty-col-msg">No content here. Drag content from the right.</div>
        <button class="empty-col-btn" type="button">Add Content</button>
      `;

      const btn = overlay.querySelector('.empty-col-btn');
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        editor.select(model);
        const ParentCustomEvent = window.parent?.CustomEvent || CustomEvent;
        window.parent?.dispatchEvent(new ParentCustomEvent('builder:add-content-request', {
          detail: {
            source: 'empty-column',
          },
        }));
      });

      el.appendChild(overlay);
    };

    editor.on('component:selected', (model) => {
      updateEmptyColumnOverlay(model, true);
    });

    editor.on('component:deselected', (model) => {
      updateEmptyColumnOverlay(model, false);
    });

    editor.on('component:update:components', (model) => {
      updateEmptyColumnOverlay(model, editor.getSelected() === model);
    });

    editor.on('load', () => {
      const selected = editor.getSelected();
      if (selected) {
        updateEmptyColumnOverlay(selected, true);
      }
    });
  };

  minimalBuilderPlugin.canvasCss = canvasCss;
  minimalBuilderPlugin.emailTemplates = emailTemplates;
  minimalBuilderPlugin.blockLibrary = blockLibrary;
  minimalBuilderPlugin.styleManagerSectors = styleManagerSectors;

  global.grapesjsMinimalBuilder = minimalBuilderPlugin;
})(typeof globalThis !== 'undefined' ? globalThis : window);
