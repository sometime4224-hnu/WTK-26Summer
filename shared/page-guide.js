(function () {
    "use strict";

    const LANG_OPTIONS = [
        { code: "ko", label: "한국어", dir: "ltr" },
        { code: "en", label: "English", dir: "ltr" },
        { code: "vi", label: "Tiếng Việt", dir: "ltr" },
        { code: "ar", label: "العربية", dir: "rtl" },
        { code: "mn", label: "Монгол", dir: "ltr" },
        { code: "kk", label: "Қазақша", dir: "ltr" },
        { code: "th", label: "ไทย", dir: "ltr" }
    ];

    const LANG_BY_CODE = LANG_OPTIONS.reduce(function (map, lang) {
        map[lang.code] = lang;
        return map;
    }, {});

    const GUIDE_BY_TYPE = {
        vocabulary: {
            kicker: "어휘 안내",
            title: "어휘 페이지 사용 방법",
            foot: {
                ko: "필요할 때만 열어 보고, 학습은 카드와 퀴즈에서 바로 시작하면 됩니다.",
                en: "Open this only when you need help; you can start learning right away with the cards and quizzes.",
                vi: "Chỉ mở khi cần hỗ trợ; bạn có thể bắt đầu học ngay với thẻ từ và bài quiz.",
                ar: "افتح هذا الدليل عند الحاجة فقط؛ ويمكنك بدء التعلّم مباشرة من البطاقات والاختبارات.",
                mn: "Хэрэгтэй үедээ л нээгээрэй; карт болон сорилоор шууд хичээллэж эхэлж болно.",
                kk: "Қажет кезде ғана ашыңыз; карточкалар мен викториналардан бірден бастай аласыз.",
                th: "เปิดดูเมื่อจำเป็นเท่านั้น แล้วเริ่มเรียนจากบัตรคำและแบบทดสอบได้ทันที"
            },
            items: [
                {
                    label: "카드",
                    accent: "#e4582e",
                    descriptions: {
                        ko: "그림 카드를 누르면 뜻과 번역을 확인할 수 있어요.",
                        en: "Tap a picture card to check the meaning and translation.",
                        vi: "Nhấn vào thẻ có hình để xem nghĩa và bản dịch.",
                        ar: "اضغط على بطاقة الصورة لترى المعنى والترجمة.",
                        mn: "Зурагтай картыг дарж утга болон орчуулгыг шалгаарай.",
                        kk: "Мағынасы мен аудармасын көру үшін суретті карточканы басыңыз.",
                        th: "แตะบัตรภาพเพื่อดูความหมายและคำแปล"
                    }
                },
                {
                    label: "정리",
                    accent: "#2563eb",
                    descriptions: {
                        ko: "검색과 분류 버튼으로 필요한 단어만 빠르게 모아 봐요.",
                        en: "Use search and category buttons to quickly find just the words you need.",
                        vi: "Dùng ô tìm kiếm và nút phân loại để lọc nhanh những từ cần học.",
                        ar: "استخدم البحث وأزرار التصنيف لتصفية الكلمات التي تحتاج إليها بسرعة.",
                        mn: "Хайлт ба ангиллын товчоор хэрэгтэй үгсээ хурдан шүүж үзээрэй.",
                        kk: "Іздеу мен санат түймелері арқылы қажет сөздерді жылдам сүзіп қараңыз.",
                        th: "ใช้ช่องค้นหาและปุ่มหมวดหมู่เพื่อกรองเฉพาะคำที่ต้องการอย่างรวดเร็ว"
                    }
                },
                {
                    label: "퀴즈",
                    accent: "#7c3aed",
                    descriptions: {
                        ko: "뜻, 초성, 그림 퀴즈로 바로 복습할 수 있어요.",
                        en: "Review right away with meaning, initial consonant, and picture quizzes.",
                        vi: "Ôn tập ngay bằng các bài quiz về nghĩa, phụ âm đầu và hình ảnh.",
                        ar: "راجع مباشرةً باختبارات المعنى والحرف الأول والصور.",
                        mn: "Утга, эхний гийгүүлэгч, зурагтай сорилоор шууд давтаарай.",
                        kk: "Мағына, бастапқы дауыссыз дыбыс және сурет викториналары арқылы бірден қайталаңыз.",
                        th: "ทบทวนได้ทันทีด้วยแบบทดสอบความหมาย พยัญชนะต้น และรูปภาพ"
                    }
                },
                {
                    label: "언어",
                    accent: "#0f766e",
                    descriptions: {
                        ko: "번역 언어는 상단 언어 버튼에서 필요한 만큼만 켜요.",
                        en: "Turn on only the translation language you need using the language buttons.",
                        vi: "Chỉ bật ngôn ngữ dịch bạn cần bằng các nút ngôn ngữ phía trên.",
                        ar: "فعّل لغة الترجمة التي تحتاجها فقط من أزرار اللغة في الأعلى.",
                        mn: "Дээд талын хэлний товчноос хэрэгтэй орчуулгын хэлээ л асаагаарай.",
                        kk: "Жоғарғы тіл түймелері арқылы қажет аударма тілін ғана қосыңыз.",
                        th: "เปิดเฉพาะภาษาคำแปลที่ต้องการจากปุ่มภาษาด้านบน"
                    }
                }
            ]
        },
        grammar: {
            kicker: "문법 안내",
            title: "문법 페이지 사용 방법",
            foot: {
                ko: "학습에서 흐름을 잡고, 연습에서 바로 확인하는 순서가 가장 편합니다.",
                en: "The smoothest flow is to understand the pattern first, then check it right away in practice.",
                vi: "Cách thuận tiện nhất là nắm cách dùng ở phần học rồi kiểm tra ngay ở phần luyện tập.",
                ar: "الأسهل هو فهم القاعدة أولًا، ثم التحقق منها مباشرة في التدريب.",
                mn: "Эхлээд дүрмээ ойлгоод, дараа нь дасгалаар шууд шалгах нь хамгийн тохиромжтой.",
                kk: "Алдымен грамматиканы түсініп, кейін жаттығуда бірден тексерген ыңғайлы.",
                th: "วิธีที่สะดวกที่สุดคือเข้าใจรูปแบบก่อน แล้วตรวจสอบทันทีในส่วนฝึก"
            },
            items: [
                {
                    label: "학습",
                    accent: "#2563eb",
                    descriptions: {
                        ko: "의미, 형태, 비교, 예문을 차례대로 확인해요.",
                        en: "Review the meaning, form, comparison, and examples in order.",
                        vi: "Xem lần lượt ý nghĩa, cấu trúc, so sánh và ví dụ.",
                        ar: "راجع المعنى والصيغة والمقارنة والأمثلة بالترتيب.",
                        mn: "Утга, хэлбэр, харьцуулалт, жишээг дарааллаар нь үзээрэй.",
                        kk: "Мағына, құрылым, салыстыру және мысалдарды ретімен қараңыз.",
                        th: "ดูความหมาย รูปแบบ การเปรียบเทียบ และตัวอย่างตามลำดับ"
                    }
                },
                {
                    label: "번역",
                    accent: "#0f766e",
                    descriptions: {
                        ko: "어려운 설명은 언어 버튼으로 번역을 켜고 다시 읽어요.",
                        en: "If an explanation feels difficult, turn on a translation with the language button and read again.",
                        vi: "Với phần giải thích khó, hãy bật bản dịch bằng nút ngôn ngữ rồi đọc lại.",
                        ar: "عند صعوبة الشرح، فعّل الترجمة بزر اللغة واقرأ مرة أخرى.",
                        mn: "Тайлбар хэцүү байвал хэлний товчоор орчуулгыг асааж дахин уншаарай.",
                        kk: "Түсіндірме қиын болса, тіл түймесімен аударманы қосып қайта оқыңыз.",
                        th: "ถ้าคำอธิบายยาก ให้เปิดคำแปลด้วยปุ่มภาษาแล้วอ่านอีกครั้ง"
                    }
                },
                {
                    label: "연습",
                    accent: "#d97706",
                    descriptions: {
                        ko: "문제를 풀면 정답과 해설을 바로 확인할 수 있어요.",
                        en: "After answering a question, you can check the answer and explanation right away.",
                        vi: "Sau khi trả lời câu hỏi, bạn có thể xem đáp án và giải thích ngay.",
                        ar: "بعد حل السؤال، يمكنك رؤية الإجابة والشرح مباشرة.",
                        mn: "Асуултад хариулсны дараа зөв хариу болон тайлбарыг шууд шалгаж болно.",
                        kk: "Сұрақты орындағаннан кейін жауап пен түсіндірмені бірден көре аласыз.",
                        th: "เมื่อทำโจทย์แล้ว จะดูคำตอบและคำอธิบายได้ทันที"
                    }
                },
                {
                    label: "연결",
                    accent: "#7c3aed",
                    descriptions: {
                        ko: "아래 이동 버튼으로 보조 퀴즈나 다음 문법으로 이어 가요.",
                        en: "Use the buttons below to continue to a support quiz or the next grammar point.",
                        vi: "Dùng các nút phía dưới để chuyển sang quiz bổ trợ hoặc ngữ pháp tiếp theo.",
                        ar: "استخدم أزرار التنقل في الأسفل للانتقال إلى اختبار إضافي أو القاعدة التالية.",
                        mn: "Доорх шилжих товчоор туслах сорил эсвэл дараагийн дүрэм рүү үргэлжлээрэй.",
                        kk: "Төмендегі өту түймелерімен қосымша викторинаға немесе келесі грамматикаға жалғастырыңыз.",
                        th: "ใช้ปุ่มด้านล่างเพื่อไปยังแบบทดสอบเสริมหรือไวยากรณ์ถัดไป"
                    }
                }
            ]
        }
    };

    function detectGuideType() {
        const fileName = decodeURIComponent(location.pathname.split("/").pop() || "").toLowerCase();
        if (fileName === "vocabulary.html") return "vocabulary";
        if (/^grammar\d+\.html$/.test(fileName)) return "grammar";
        return "";
    }

    function findTopbar() {
        return document.querySelector(".topbar, .global-nav, .injected-global-nav, .top-nav, .sticky-nav, .nav");
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function normalizeLang(code) {
        if (!code || code === "none") return "ko";
        return LANG_BY_CODE[code] ? code : "ko";
    }

    function readStoredLang(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return "";
        }
    }

    function writeStoredLang(lang) {
        try {
            localStorage.setItem("page-guide-lang", lang);
        } catch (error) {
            // Storage can be unavailable in a local or private browsing context.
        }
    }

    function initialLang() {
        const guideLang = readStoredLang("page-guide-lang");
        if (guideLang) return normalizeLang(guideLang);

        const pageLang = window.MultilangToggle?.getLang?.();
        if (pageLang) return normalizeLang(pageLang);

        return normalizeLang(readStoredLang("preferred-lang") || document.documentElement.lang);
    }

    function translated(value, lang) {
        if (typeof value === "string") return value;
        if (!value) return "";
        return value[lang] || value.ko || "";
    }

    function itemDescription(item, lang) {
        return translated(item.descriptions || item.description || item.text, lang);
    }

    function buildDialog(guide) {
        const backdrop = document.createElement("div");
        backdrop.className = "page-guide-backdrop";
        backdrop.hidden = true;

        backdrop.innerHTML = `
            <section class="page-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="pageGuideTitle" tabindex="-1">
                <header class="page-guide-head">
                    <div class="page-guide-title-wrap">
                        <p class="page-guide-kicker">${escapeHtml(guide.kicker)}</p>
                        <h2 id="pageGuideTitle" class="page-guide-title">${escapeHtml(guide.title)}</h2>
                    </div>
                    <div class="page-guide-actions">
                        <div class="page-guide-lang">
                            <button class="page-guide-lang-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="안내 언어 선택">
                                <span class="page-guide-lang-current">한국어</span>
                                <span class="page-guide-lang-arrow" aria-hidden="true">▾</span>
                            </button>
                            <div class="page-guide-lang-menu" role="listbox" aria-label="안내 언어" hidden>
                                ${LANG_OPTIONS.map(function (lang) {
                                    return `
                                        <button class="page-guide-lang-option" type="button" role="option" data-page-guide-lang="${escapeHtml(lang.code)}" lang="${escapeHtml(lang.code)}" dir="${escapeHtml(lang.dir)}">
                                            ${escapeHtml(lang.label)}
                                        </button>
                                    `;
                                }).join("")}
                            </div>
                        </div>
                        <button class="page-guide-close" type="button" aria-label="안내 닫기">×</button>
                    </div>
                </header>
                <ul class="page-guide-list">
                    ${guide.items.map(function (item, index) {
                        return `
                            <li class="page-guide-item" style="--page-guide-accent: ${escapeHtml(item.accent)}">
                                <strong>${escapeHtml(item.label)}</strong>
                                <span data-page-guide-desc="${index}"></span>
                            </li>
                        `;
                    }).join("")}
                </ul>
                <p class="page-guide-foot" data-page-guide-foot></p>
            </section>
        `;

        document.body.appendChild(backdrop);
        return backdrop;
    }

    function initPageGuide() {
        if (document.querySelector(".page-guide-trigger")) return;

        const guide = window.PAGE_GUIDE_CONFIG || GUIDE_BY_TYPE[detectGuideType()];
        const topbar = findTopbar();
        if (!guide || !topbar) return;

        const trigger = document.createElement("button");
        trigger.className = "page-guide-trigger";
        trigger.type = "button";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-expanded", "false");
        trigger.innerHTML = "<span aria-hidden=\"true\">💡</span><span>안내</span>";
        topbar.appendChild(trigger);

        const backdrop = buildDialog(guide);
        const dialog = backdrop.querySelector(".page-guide-dialog");
        const closeButton = backdrop.querySelector(".page-guide-close");
        const langTrigger = backdrop.querySelector(".page-guide-lang-trigger");
        const langCurrent = backdrop.querySelector(".page-guide-lang-current");
        const langMenu = backdrop.querySelector(".page-guide-lang-menu");
        const langOptions = Array.from(backdrop.querySelectorAll(".page-guide-lang-option"));

        let activeLang = initialLang();
        let lastFocus = null;

        function setMenuOpen(isOpen) {
            langMenu.hidden = !isOpen;
            langTrigger.setAttribute("aria-expanded", String(isOpen));
        }

        function renderLang() {
            const langMeta = LANG_BY_CODE[activeLang] || LANG_BY_CODE.ko;
            langCurrent.textContent = langMeta.label;

            backdrop.querySelectorAll("[data-page-guide-desc]").forEach(function (node) {
                const item = guide.items[Number(node.dataset.pageGuideDesc)];
                node.textContent = itemDescription(item, activeLang);
                node.setAttribute("lang", activeLang);
                node.setAttribute("dir", langMeta.dir);
            });

            const foot = backdrop.querySelector("[data-page-guide-foot]");
            foot.textContent = translated(guide.foot, activeLang);
            foot.setAttribute("lang", activeLang);
            foot.setAttribute("dir", langMeta.dir);

            langOptions.forEach(function (option) {
                const selected = option.dataset.pageGuideLang === activeLang;
                option.classList.toggle("is-active", selected);
                option.setAttribute("aria-selected", String(selected));
            });
        }

        function openGuide() {
            lastFocus = document.activeElement;
            renderLang();
            backdrop.hidden = false;
            trigger.setAttribute("aria-expanded", "true");
            dialog.focus();
        }

        function closeGuide() {
            setMenuOpen(false);
            backdrop.hidden = true;
            trigger.setAttribute("aria-expanded", "false");
            if (lastFocus && typeof lastFocus.focus === "function") {
                lastFocus.focus();
            }
        }

        trigger.addEventListener("click", openGuide);
        closeButton.addEventListener("click", closeGuide);
        langTrigger.addEventListener("click", function () {
            setMenuOpen(langMenu.hidden);
        });
        langOptions.forEach(function (option) {
            option.addEventListener("click", function () {
                activeLang = normalizeLang(option.dataset.pageGuideLang);
                writeStoredLang(activeLang);
                renderLang();
                setMenuOpen(false);
                langTrigger.focus();
            });
        });

        backdrop.addEventListener("click", function (event) {
            if (event.target === backdrop) closeGuide();
            if (!event.target.closest(".page-guide-lang")) setMenuOpen(false);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape" || backdrop.hidden) return;
            if (!langMenu.hidden) {
                setMenuOpen(false);
                langTrigger.focus();
                return;
            }
            closeGuide();
        });

        renderLang();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPageGuide);
    } else {
        initPageGuide();
    }
})();
