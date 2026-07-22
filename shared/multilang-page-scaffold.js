/**
 * Page-level multilingual scaffold panel for chapter learning pages.
 *
 * The page data file provides short scaffold notes keyed by paths such as
 * "c10/grammar1.html". This script inserts one common translation panel and
 * lets multilang-toggle.js handle the language buttons.
 */
(function () {
    "use strict";

    const DATA = window.MULTILANG_PAGE_DATA || {};
    const LANG_ORDER = ["en", "vi", "ar", "mn", "kk", "th"];
    const LANG_LABELS = {
        en: "English",
        vi: "Tiếng Việt",
        ar: "العربية",
        mn: "Монгол",
        kk: "Қазақша",
        th: "ไทย"
    };

    function getPageKey() {
        const parts = window.location.pathname
            .split("/")
            .filter(Boolean)
            .map((part) => {
                try {
                    return decodeURIComponent(part).toLowerCase();
                } catch {
                    return part.toLowerCase();
                }
            });
        if (parts.length < 2) return "";
        return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
    }

    function getEntryForCurrentPage() {
        const key = getPageKey();
        if (DATA[key]) return DATA[key];

        const classicKey = key.replace(/-classic\.html$/, ".html");
        if (classicKey !== key && DATA[classicKey]) return DATA[classicKey];
        return null;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function ensureStylesheet() {
        const href = "../shared/multilang-toggle.css";
        const existing = Array.from(document.querySelectorAll("link[rel='stylesheet']"))
            .some((link) => link.getAttribute("href") === href);
        if (existing) return;

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function getLanguages(entry) {
        const translations = entry && entry.translations ? entry.translations : {};
        return LANG_ORDER.filter((lang) => translations[lang]);
    }

    function renderTerm(term) {
        if (!term) return "";
        return `<code class="ko-term" lang="ko" dir="ltr">${escapeHtml(term)}</code>`;
    }

    function renderTranslation(lang, entry, translation) {
        const title = translation.title || LANG_LABELS[lang] || lang;
        const summary = translation.summary || "";
        const points = Array.isArray(translation.points) ? translation.points : [];
        const grammar = translation.grammar || entry.grammar || "";

        return `
            <div class="multilang-scaffold__language">${escapeHtml(title)}</div>
            ${grammar ? `<div class="multilang-scaffold__term">${renderTerm(grammar)}</div>` : ""}
            ${summary ? `<p>${escapeHtml(summary)}</p>` : ""}
            ${points.length ? `
                <ul>
                    ${points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                </ul>
            ` : ""}
        `;
    }

    function buildPanel(entry, languages) {
        const section = document.createElement("section");
        section.className = "multilang-scaffold";
        section.dataset.multilangScaffold = "auto";
        section.setAttribute("aria-label", entry.ariaLabel || "다국어 문법 도움말");

        const title = entry.title || "다국어 문법 도움말";
        const subtitle = entry.subtitle || "필요한 언어를 골라 문법 의미와 사용 맥락만 짧게 확인하세요.";

        section.innerHTML = `
            <div class="multilang-scaffold__head">
                <div>
                    <strong>${escapeHtml(title)}</strong>
                    <p>${escapeHtml(subtitle)}</p>
                </div>
                <div data-multilang-bar></div>
            </div>
            <div class="multilang-scaffold__body"></div>
        `;

        const body = section.querySelector(".multilang-scaffold__body");
        languages.forEach((lang) => {
            const box = document.createElement("div");
            box.className = "lang-box multilang-scaffold__box";
            box.dataset.lang = lang;
            box.lang = lang;
            if (lang === "ar") box.dir = "rtl";
            box.innerHTML = renderTranslation(lang, entry, entry.translations[lang]);
            body.appendChild(box);
        });

        return section;
    }

    function findAnchor(selector) {
        if (typeof selector !== "string" || !selector.trim()) return null;
        try {
            return document.querySelector(selector);
        } catch {
            return null;
        }
    }

    function movePanelAfterAnchor(panel, anchor) {
        if (!panel || !anchor || !anchor.parentNode) return false;
        anchor.insertAdjacentElement("afterend", panel);
        return true;
    }

    function watchConfiguredAnchor(panel, selector) {
        if (!selector || !document.body || findAnchor(selector)) return;

        const observer = new MutationObserver(() => {
            const anchor = findAnchor(selector);
            if (!anchor || !movePanelAfterAnchor(panel, anchor)) return;
            observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function insertPanel(panel, entry) {
        const configuredSelector = typeof entry.anchorSelector === "string"
            ? entry.anchorSelector.trim()
            : "";
        const configuredAnchor = findAnchor(configuredSelector);
        if (movePanelAfterAnchor(panel, configuredAnchor)) return;

        const anchor = document.querySelector("[data-multilang-anchor]");
        if (movePanelAfterAnchor(panel, anchor)) {
            watchConfiguredAnchor(panel, configuredSelector);
            return;
        }

        const header = document.querySelector("header");
        if (movePanelAfterAnchor(panel, header)) {
            watchConfiguredAnchor(panel, configuredSelector);
            return;
        }
        const main = document.querySelector("main");
        if (main && main.parentNode) {
            main.insertAdjacentElement("beforebegin", panel);
            watchConfiguredAnchor(panel, configuredSelector);
            return;
        }
        const dynamicRoot = configuredSelector
            ? document.querySelector("#listening-workbook-app")
            : null;
        if (dynamicRoot && dynamicRoot.parentNode) {
            dynamicRoot.insertAdjacentElement("afterend", panel);
        } else {
            document.body.insertAdjacentElement("afterbegin", panel);
        }
        watchConfiguredAnchor(panel, configuredSelector);
    }

    function hideElement(element) {
        if (!element) return;
        element.hidden = true;
        element.setAttribute("aria-hidden", "true");
        element.setAttribute("tabindex", "-1");
        element.style.display = "none";
    }

    function hideLegacyVietnameseControls() {
        const legacyControls = new Set();
        [
            "#viToggle",
            "#viToggleBtn",
            "#translation-btn",
            "[data-vi-toggle]",
            ".js-vi-toggle",
            ".translation-toggle"
        ].forEach((selector) => {
            document.querySelectorAll(selector).forEach((control) => legacyControls.add(control));
        });

        legacyControls.forEach(hideElement);
        document.querySelectorAll(".vi-on").forEach((element) => element.classList.remove("vi-on"));
        document.querySelectorAll("[data-vi-panel]").forEach(hideElement);
    }

    function hideLegacyVietnameseContent(root) {
        if (root && root.nodeType !== 1 && root.nodeType !== 9) return;
        const scope = root && root.nodeType === 1 ? root : document;
        const elements = [];

        if (scope.matches && (scope.matches(".vi-text") || scope.matches("[data-vi-panel]"))) {
            elements.push(scope);
        }
        scope.querySelectorAll(".vi-text, [data-vi-panel]").forEach((element) => elements.push(element));

        const textCandidates = scope.matches
            ? [scope].concat(Array.from(scope.querySelectorAll("p, span, div, li")))
            : Array.from(scope.querySelectorAll("p, span, div, li"));

        textCandidates.forEach((element) => {
            if (element.closest("[data-multilang-scaffold='auto']")) return;
            const text = element.textContent.trim();
            const plainText = text.replace(/[()]/g, "").trim();
            if (
                text.includes("Giải thích (VI):")
                || /\bVI:\s/.test(text)
                || plainText === "Đúng"
                || plainText === "Sai"
            ) {
                elements.push(element);
            }
        });

        elements.forEach((element) => {
            if (element.closest("[data-multilang-scaffold='auto']")) return;
            hideElement(element);
        });
    }

    function watchLegacyVietnameseContent() {
        hideLegacyVietnameseContent(document);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    hideLegacyVietnameseContent(node);
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        const entry = getEntryForCurrentPage();
        if (!entry || document.querySelector("[data-multilang-scaffold='auto']")) return;

        const languages = getLanguages(entry);
        if (!languages.length) return;

        ensureStylesheet();
        window.MULTILANG_CONFIG = Object.assign({}, window.MULTILANG_CONFIG || {}, {
            langs: languages,
            defaultLang: "none"
        });

        insertPanel(buildPanel(entry, languages), entry);
        hideLegacyVietnameseControls();
        watchLegacyVietnameseContent();
    }

    if (document.body) {
        init();
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
