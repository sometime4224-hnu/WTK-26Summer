/**
 * multilang-toggle.js
 * 한국어 학습 웹페이지 표준 다국어 토글
 *
 * ── 역할 ──────────────────────────────────────────────────────────────────
 * 페이지 내 [data-lang="vi|en|ja|zh"] 속성이 붙은 번역 블록을
 * 선택한 언어에 따라 표시/숨김 처리한다.
 * 언어 선택은 localStorage에 저장되어 페이지 이동 후에도 유지된다.
 *
 * ── 사용법 ────────────────────────────────────────────────────────────────
 * 1. HTML에 토글 컨테이너 추가:
 *      <div data-multilang-bar></div>
 *    ※ 버튼은 JS가 자동 생성한다. 수동으로 버튼을 넣지 않아도 된다.
 *
 * 2. 번역 블록에 data-lang 속성 부여:
 *      <p data-lang="vi">Đây là ví dụ.</p>
 *      <p data-lang="en">This is an example.</p>
 *
 * 3. 스크립트 로드 (페이지 맨 아래, </body> 직전):
 *      <script src="../shared/multilang-toggle.js"></script>
 *
 * ── 설정 (선택) ───────────────────────────────────────────────────────────
 * 특정 페이지에서 표시할 언어 목록을 제한하려면 로드 전에 설정:
 *      <script>
 *        window.MULTILANG_CONFIG = {
 *          langs: ["vi", "en"],   // 이 언어만 버튼 표시 (기본: 전체)
 *          defaultLang: "vi"       // 최초 방문 시 기본 선택 언어 (기본: "none")
 *        };
 *      </script>
 *
 * ── 언어 코드 ─────────────────────────────────────────────────────────────
 *   "vi" — 베트남어
 *   "en" — 영어
 *   "ja" — 일본어
 *   "zh" — 중국어
 *
 * ── CSS 연동 ──────────────────────────────────────────────────────────────
 * multilang-toggle.css 를 함께 로드해야 버튼·번역 블록 스타일이 적용된다.
 * design-tokens.css 의 --lang-* 변수를 사용한다.
 */

(function () {
    "use strict";

    /* ── 상수 ──────────────────────────────────────────────────────────── */
    const STORAGE_KEY = "preferred-lang";
    const NONE        = "none";

    const ALL_LANGS = [
        { code: "vi", label: "Tiếng Việt",  emoji: "🇻🇳" },
        { code: "en", label: "English",      emoji: "🇬🇧" },
        { code: "ja", label: "日本語",        emoji: "🇯🇵" },
        { code: "zh", label: "中文",          emoji: "🇨🇳" },
    ];

    /* ── 설정 읽기 ─────────────────────────────────────────────────────── */
    const cfg         = window.MULTILANG_CONFIG || {};
    const allowedSet  = cfg.langs ? new Set(cfg.langs) : null;
    const activeLangs = allowedSet
        ? ALL_LANGS.filter(l => allowedSet.has(l.code))
        : ALL_LANGS;
    const defaultLang = cfg.defaultLang || NONE;

    /* ── 현재 언어 결정 ────────────────────────────────────────────────── */
    function getStored() {
        try { return localStorage.getItem(STORAGE_KEY) || NONE; }
        catch { return NONE; }
    }
    function setStored(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); }
        catch { /* 스토리지 사용 불가 환경 무시 */ }
    }

    let currentLang = getStored();
    // 저장된 언어가 허용 목록에 없으면 defaultLang 사용
    if (currentLang !== NONE && activeLangs.every(l => l.code !== currentLang)) {
        currentLang = defaultLang;
    }

    /* ── 번역 블록 제어 ────────────────────────────────────────────────── */
    function applyLang(lang) {
        // 모든 번역 블록 숨김
        document.querySelectorAll("[data-lang]").forEach(el => {
            el.classList.remove("lang-visible");
        });
        // 선택 언어 블록 표시
        if (lang !== NONE) {
            document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
                el.classList.add("lang-visible");
            });
        }
        // 버튼 상태 반영
        document.querySelectorAll("[data-multilang-btn]").forEach(btn => {
            const active = btn.dataset.multilangBtn === lang;
            btn.classList.toggle("active", active);
            btn.setAttribute("aria-pressed", String(active));
        });
        // body 에 현재 언어 클래스 (필요시 CSS에서 추가 제어)
        document.body.dataset.activeLang = lang;
    }

    /* ── 버튼 바 렌더링 ────────────────────────────────────────────────── */
    function buildBar(container) {
        container.classList.add("multilang-bar");
        container.setAttribute("role", "group");
        container.setAttribute("aria-label", "번역 언어 선택");

        // "숨기기" 버튼
        const hideBtn = document.createElement("button");
        hideBtn.type = "button";
        hideBtn.className = "multilang-btn multilang-btn--none";
        hideBtn.dataset.multilangBtn = NONE;
        hideBtn.setAttribute("aria-pressed", String(currentLang === NONE));
        hideBtn.innerHTML = '<i class="fa-solid fa-eye-slash" aria-hidden="true"></i> 번역 끄기';
        hideBtn.addEventListener("click", () => selectLang(NONE));
        container.appendChild(hideBtn);

        // 언어별 버튼
        activeLangs.forEach(({ code, label, emoji }) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `multilang-btn multilang-btn--${code}`;
            btn.dataset.multilangBtn = code;
            btn.setAttribute("aria-pressed", String(currentLang === code));
            btn.textContent = `${emoji} ${label}`;
            btn.addEventListener("click", () => selectLang(code));
            container.appendChild(btn);
        });
    }

    function selectLang(lang) {
        currentLang = lang;
        setStored(lang);
        applyLang(lang);
    }

    /* ── 초기화 ────────────────────────────────────────────────────────── */
    function init() {
        // [data-multilang-bar] 가 있으면 버튼 바 삽입
        document.querySelectorAll("[data-multilang-bar]").forEach(buildBar);

        // 초기 언어 적용
        applyLang(currentLang !== NONE ? currentLang : defaultLang);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    /* ── 공개 API ──────────────────────────────────────────────────────── */
    window.MultilangToggle = {
        /** 프로그래밍 방식으로 언어 전환 */
        setLang: selectLang,
        /** 현재 선택된 언어 코드 반환 ("none"|"vi"|"en"|"ja"|"zh") */
        getLang: () => currentLang,
    };

})();
