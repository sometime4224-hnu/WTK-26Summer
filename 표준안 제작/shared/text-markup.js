(() => {
    "use strict";

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function hasBalancedUnderlineMarkers(text) {
        const markerCount = (String(text).match(/==/g) || []).length;
        return markerCount % 2 === 0;
    }

    function renderInlineMarkup(text, options = {}) {
        const renderUnderline = options.renderUnderline !== false;
        const renderCode = options.renderCode !== false;
        let html = escapeHtml(text);

        if (renderUnderline) {
            html = html.replace(/==(.+?)==/g, '<span class="question-underline">$1</span>');
        }

        if (renderCode) {
            html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
        }

        return html;
    }

    window.Korean3BTextMarkup = {
        escapeHtml,
        hasBalancedUnderlineMarkers,
        renderInlineMarkup
    };
})();
