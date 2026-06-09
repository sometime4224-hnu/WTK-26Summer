(function () {
  'use strict';

  const FOOTER_ID = 'site-copyright-footer';
  const STYLE_ID = 'site-copyright-style';
  const LEGACY_STYLE_ID = 'legacy-vietnamese-cleanup-style';
  const LEGACY_HIDDEN_CLASS = 'legacy-vietnamese-hidden';

  const LEGACY_CONTROL_SELECTORS = [
    '#viToggle',
    '#viToggleBtn',
    '#translation-btn',
    '[data-vi-toggle]',
    '.js-vi-toggle',
    '.translation-toggle',
    '.vi-switch',
    '.vi-switch-inline'
  ];

  const LEGACY_CONTENT_SELECTORS = [
    '.vi-text',
    '.vietnamese',
    '.vi-guide',
    '[data-vi-panel]',
    '.lw-vocab-vi',
    '.lw-note-tab[data-instruction-language="vi"]',
    '.lw-note-tab[data-quiz-language="vi"]'
  ];

  const LEGACY_TOGGLE_TEXT = /^\s*(?:(?:Ti\u1ebfng Vi\u1ec7t|Vietnamese|\ubca0\ud2b8\ub0a8\uc5b4)\s+(?:ON|OFF|\ubcf4\uae30|\uc228\uae30\uae30)|VI\s+(?:ON|OFF)|VN\s*\uc124\uba85(?:\s*(?:\ud3ec\ud568|\uc228\uae30\uae30|\ubcf4\uae30))?)\s*$/i;
  const LEGACY_TEXT_BLOCK = /(?:Gi\u1ea3i th\u00edch\s*\(VI\)|\bVI:\s|Tr\u00ean \u0111\u01b0\u1eddng|\u0110\u00e2y l\u00e0|Ch\u1ee7 \u0111\u1ec1|T\u00ecm \u00fd|H\u01b0\u1edbng d\u1eabn|T\u1eeb v\u1ef1ng|Ng\u1eef ph\u00e1p|M\u1edf b\u00e0i|Th\u00e2n b\u00e0i|K\u1ebft b\u00e0i|Xem to\u00e0n b\u1ed9 b\u00e0i \u0111\u1ecdc)/i;
  const LEGACY_PAREN_TEXT = /\s*\((?:[^)]*(?:\u0110\u00fang|Sai|Trung c\u1ea5p|H\u1ecdc|Luy\u1ec7n t\u1eadp|T\u00ecnh hu\u1ed1ng|Quy t\u1eafc|Ng\u1eef ph\u00e1p|T\u1eeb v\u1ef1ng|Ki\u1ec3m tra|\u0110i\u1ec1n|Ch\u1ee7 \u0111\u1ec1|H\u01b0\u1edbng d\u1eabn|V\u00ed d\u1ee5|M\u1edf b\u00e0i|Th\u00e2n b\u00e0i|K\u1ebft b\u00e0i|T\u1eeb kh\u00f3a|Sao ch\u00e9p|L\u01b0u|Tr\u01b0\u1edbc|Ti\u1ebfp theo|ch\u1eef)[^)]*)\)/gi;
  const LEGACY_SLASH_TEXT = /\s*\/\s*(?:\u0110\u00fang(?: r\u1ed3i)?|Sai(?: r\u1ed3i)?|Th\u1eed l\u1ea1i nh\u00e9\.?|Xu\u1ea5t s\u1eafc!?)/gi;

  function shouldShowFooter() {
    return Boolean(document.body && document.body.dataset.showGlobalCopyright === 'true');
  }

  function init() {
    cleanupLegacyVietnamese();

    // Global footer notices are disabled by default.
    // If a specific local page ever needs one again, opt in with:
    //   <body data-show-global-copyright="true">
    if (!shouldShowFooter()) return;
    if (document.getElementById(FOOTER_ID)) return;
    injectStyle();
    injectFooter();
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${FOOTER_ID} {
        margin-top: 28px;
        padding: 18px 16px 28px;
        color: #64748b;
        font-size: 11px;
        line-height: 1.7;
        text-align: center;
      }

      #${FOOTER_ID} .site-copyright-inner {
        width: min(960px, 100%);
        margin: 0 auto;
        padding-top: 14px;
        border-top: 1px solid rgba(148, 163, 184, 0.24);
      }

      #${FOOTER_ID} p {
        margin: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function injectLegacyCleanupStyle() {
    if (document.getElementById(LEGACY_STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = LEGACY_STYLE_ID;
    style.textContent = `
      .${LEGACY_HIDDEN_CLASS},
      [data-legacy-vietnamese-hidden="true"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function isModernMultilang(element) {
    return Boolean(
      element
      && element.closest
      && element.closest('[data-multilang-bar], .multilang-bar, [data-multilang-scaffold="auto"], .multilang-scaffold, [data-lang]')
    );
  }

  function hideLegacyElement(element) {
    if (!element || isModernMultilang(element)) return;
    element.classList.add(LEGACY_HIDDEN_CLASS);
    element.dataset.legacyVietnameseHidden = 'true';
    element.hidden = true;
    element.setAttribute('aria-hidden', 'true');
    if (element.matches('button, a, input, select, textarea, [tabindex]')) {
      element.setAttribute('tabindex', '-1');
    }
  }

  function stripLegacyText(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const parent = node.parentElement;
    if (!parent || isModernMultilang(parent)) return;
    if (parent.closest('script, style, textarea')) return;

    const nextText = node.nodeValue
      .replace(LEGACY_PAREN_TEXT, '')
      .replace(LEGACY_SLASH_TEXT, '');

    if (nextText !== node.nodeValue) {
      node.nodeValue = nextText.replace(/\s{2,}/g, ' ');
    }
  }

  function isStandaloneLegacyVietnamese(element) {
    if (!element || isModernMultilang(element)) return false;
    if (element.closest('script, style, textarea')) return false;

    const text = (element.textContent || '').trim();
    if (!text || !LEGACY_TEXT_BLOCK.test(text)) return false;
    if (/[가-힣]/.test(text) && !/^(?:Gi\u1ea3i th\u00edch\s*\(VI\)|\bVI:\s|Ti\u1ebfng Vi\u1ec7t)/i.test(text)) {
      return false;
    }

    return text.length < 240;
  }

  function cleanupLegacyVietnamese(root) {
    injectLegacyCleanupStyle();

    if (root && root.nodeType === Node.TEXT_NODE) {
      stripLegacyText(root);
      return;
    }

    const scope = root && (root.nodeType === Node.ELEMENT_NODE || root.nodeType === Node.DOCUMENT_NODE)
      ? root
      : document;

    LEGACY_CONTROL_SELECTORS.forEach((selector) => {
      if (scope.matches && scope.matches(selector)) hideLegacyElement(scope);
      scope.querySelectorAll(selector).forEach(hideLegacyElement);
    });

    LEGACY_CONTENT_SELECTORS.forEach((selector) => {
      if (scope.matches && scope.matches(selector)) hideLegacyElement(scope);
      scope.querySelectorAll(selector).forEach(hideLegacyElement);
    });

    const elementCandidates = scope.matches
      ? [scope].concat(Array.from(scope.querySelectorAll('button, a, p, span, div, li, small')))
      : Array.from(scope.querySelectorAll('button, a, p, span, div, li, small'));

    elementCandidates.forEach((element) => {
      const ownText = (element.textContent || '').trim();
      if (LEGACY_TOGGLE_TEXT.test(ownText) || isStandaloneLegacyVietnamese(element)) {
        hideLegacyElement(element);
      }
    });

    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(stripLegacyText);
  }

  function watchLegacyVietnamese() {
    if (!document.body || document.body.dataset.legacyVietnameseCleanupWatch === 'true') return;
    document.body.dataset.legacyVietnameseCleanupWatch = 'true';

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => cleanupLegacyVietnamese(node));
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function injectFooter() {
    const footer = document.createElement('footer');
    footer.id = FOOTER_ID;
    footer.innerHTML = `
      <div class="site-copyright-inner">
        <p>See the repository README and LICENSE for project notice details.</p>
      </div>
    `;
    document.body.appendChild(footer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      watchLegacyVietnamese();
    }, { once: true });
  } else {
    init();
    watchLegacyVietnamese();
  }
})();
