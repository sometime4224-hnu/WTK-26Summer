(function () {
  'use strict';

  const FOOTER_ID = 'site-copyright-footer';
  const STYLE_ID = 'site-copyright-style';

  function shouldShowFooter() {
    return Boolean(document.body && document.body.dataset.showGlobalCopyright === 'true');
  }

  function init() {
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
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
