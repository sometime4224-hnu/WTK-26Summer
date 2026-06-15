(function () {
    "use strict";

    function supportImage(src, size) {
        if (!src) return "";
        const folder = size === 320 ? "support-320" : "support-160";
        return String(src).replace(/\/(?:split|support-160|support-320)\//, `/${folder}/`);
    }

    function escapeAttribute(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function imageTag(src, alt, options = {}) {
        const size = options.size === 320 ? 320 : 160;
        const className = options.className || "support-visual-img";
        const loading = options.loading || "lazy";
        const priority = options.priority ? ' fetchpriority="high"' : "";
        return `<img src="${escapeAttribute(supportImage(src, size))}" alt="${escapeAttribute(alt)}" class="${escapeAttribute(className)}" width="${size}" height="${size}" decoding="async" loading="${escapeAttribute(loading)}"${priority}>`;
    }

    window.C11VocabSupport = {
        supportImage,
        imageTag
    };
})();
