/**
 * Shared multilingual translation toggle for Korean learning pages.
 *
 * Pages add <div data-multilang-bar></div> where the buttons should appear,
 * then mark translation blocks with data-lang, for example:
 * <div data-lang="vi" class="lang-box">...</div>
 */
(function () {
    "use strict";

    const STORAGE_KEY = "preferred-lang";
    const NONE = "none";

    const ALL_LANGS = [
        { code: "vi", label: "Tiếng Việt" },
        { code: "mn", label: "Монгол" },
        { code: "ar", label: "العربية", dir: "rtl" },
        { code: "kk", label: "Қазақша" },
        { code: "th", label: "ไทย" },
        { code: "en", label: "English" },
        { code: "ja", label: "日本語" },
        { code: "zh", label: "中文" }
    ];

    const langMap = new Map(ALL_LANGS.map((lang) => [lang.code, lang]));
    const cfg = window.MULTILANG_CONFIG || {};
    const requestedLangs = Array.isArray(cfg.langs) && cfg.langs.length
        ? cfg.langs
        : collectPageLangs();
    const activeLangs = requestedLangs
        .map((code) => langMap.get(code))
        .filter(Boolean);
    const defaultLang = cfg.defaultLang || NONE;

    let currentLang = cfg.ignoreStoredLang ? defaultLang : getStored();
    if (currentLang !== NONE && !activeLangs.some((lang) => lang.code === currentLang)) {
        currentLang = defaultLang;
    }

    function collectPageLangs() {
        return Array.from(document.querySelectorAll("[data-lang]"))
            .map((el) => el.dataset.lang)
            .filter((code, index, list) => code && list.indexOf(code) === index);
    }

    function getStored() {
        try {
            return localStorage.getItem(STORAGE_KEY) || NONE;
        } catch {
            return NONE;
        }
    }

    function setStored(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // Ignore storage failures in restricted browser contexts.
        }
    }

    function getBlocks(lang) {
        return Array.from(document.querySelectorAll(`[data-lang="${lang}"]`));
    }

    function applyLang(lang) {
        document.querySelectorAll("[data-lang]").forEach((el) => {
            el.classList.remove("lang-visible");
        });

        const visibleBlocks = lang === NONE ? [] : getBlocks(lang);
        visibleBlocks.forEach((el) => {
            el.classList.add("lang-visible");
        });

        document.querySelectorAll("[data-multilang-btn]").forEach((btn) => {
            const active = btn.dataset.multilangBtn === lang;
            btn.classList.toggle("active", active);
            btn.setAttribute("aria-pressed", String(active));
        });

        document.body.dataset.activeLang = lang;
    }

    function buildBar(container) {
        container.classList.add("multilang-bar");
        container.setAttribute("role", "group");
        container.setAttribute("aria-label", "번역 언어 선택");

        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "multilang-btn multilang-btn--none";
        hideBtn.dataset.multilangBtn = NONE;
        hideBtn.setAttribute("aria-pressed", String(currentLang === NONE));
        hideBtn.textContent = "번역 끄기";
        hideBtn.addEventListener("click", () => selectLang(NONE));
        container.appendChild(hideBtn);

        activeLangs.forEach(({ code, label }) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `multilang-btn multilang-btn--${code}`;
            btn.dataset.multilangBtn = code;
            btn.setAttribute("aria-pressed", String(currentLang === code));
            btn.textContent = label;
            btn.addEventListener("click", () => selectLang(code));
            container.appendChild(btn);
        });

    }

    function selectLang(lang) {
        currentLang = lang;
        setStored(lang);
        applyLang(lang);
    }

    function refresh() {
        applyLang(currentLang);
    }

    function init() {
        document.querySelectorAll("[data-multilang-bar]").forEach(buildBar);
        applyLang(currentLang !== NONE ? currentLang : defaultLang);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.MultilangToggle = {
        setLang: selectLang,
        refresh,
        getLang: () => currentLang,
        getLanguages: () => activeLangs.map((lang) => lang.code)
    };
})();
