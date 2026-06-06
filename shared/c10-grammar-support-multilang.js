/**
 * Multilingual helper scaffold for c10 grammar support activities.
 *
 * This keeps support pages on the shared multilang-toggle UI while leaving
 * the game or quiz interaction itself in Korean.
 */
(function () {
    "use strict";

    const LANG_ORDER = ["en", "vi", "ar", "mn", "kk", "th"];
    const LANG_TITLES = {
        en: "English",
        vi: "Tiếng Việt",
        ar: "العربية",
        mn: "Монгол",
        kk: "Қазақша",
        th: "ไทย"
    };

    const DATA = {
        "c10/grammar1-game-soccer.html": {
            title: "다국어 보조 안내",
            subtitle: "게임은 한국어 문장을 그대로 풀고, 선택한 언어로 규칙만 확인합니다.",
            terms: ["A/V-던"],
            translations: {
                en: {
                    summary: "Pick the ending that best fits the clue while the soccer target moves.",
                    points: [
                        "Round 1 shows a Korean hint for the grammar function.",
                        "Keep the Korean sentence and ending forms as they are.",
                        "The key contrast is past habit or unfinished recall versus present, completed past, and future forms."
                    ]
                },
                vi: {
                    summary: "Chọn đuôi định ngữ phù hợp với gợi ý khi mục tiêu bóng đá di chuyển.",
                    points: [
                        "Vòng 1 có gợi ý tiếng Hàn về chức năng ngữ pháp.",
                        "Giữ nguyên câu tiếng Hàn và các dạng đuôi.",
                        "Trọng tâm là phân biệt hồi tưởng thói quen/quá khứ chưa hoàn tất với hiện tại, quá khứ hoàn tất và tương lai."
                    ]
                },
                ar: {
                    summary: "اختر نهاية الصفة المناسبة اعتمادا على الدليل أثناء حركة الهدف.",
                    points: [
                        "تعرض الجولة الأولى تلميحا كوريا لوظيفة القاعدة.",
                        "تبقى الجملة الكورية وصيغ النهايات كما هي.",
                        "التركيز على التمييز بين التذكر الماضي أو الفعل غير المكتمل وبين الحاضر والماضي المكتمل والمستقبل."
                    ]
                },
                mn: {
                    summary: "Хөдөлж буй хөл бөмбөгийн байг онохдоо өгөгдсөн санаанд тохирох тодотгох нөхцөлийг сонгоно.",
                    points: [
                        "1-р шатанд дүрмийн үүргийг солонгосоор сануулна.",
                        "Солонгос өгүүлбэр болон нөхцөлийн хэлбэрийг өөрчлөхгүй.",
                        "Гол ялгаа нь өнгөрсөн дадал эсвэл дуусаагүй дурсамжийг одоо, бүрэн өнгөрсөн, ирээдүйн хэлбэрээс ялгах явдал юм."
                    ]
                },
                kk: {
                    summary: "Қозғалып тұрған футбол нысанасында берілген ишараға сай анықтауыш жалғауын таңдаңыз.",
                    points: [
                        "1-раундта грамматикалық қызмет туралы корейше ишара беріледі.",
                        "Корей сөйлемі мен жалғау формаларын өзгертпеңіз.",
                        "Негізгі айырма: өткен әдет немесе аяқталмаған еске алу мен қазіргі, аяқталған өткен, болашақ формалар."
                    ]
                },
                th: {
                    summary: "เลือกส่วนขยายหน้าคำนามให้ตรงกับคำใบ้ ขณะเป้าฟุตบอลเคลื่อนที่",
                    points: [
                        "รอบที่ 1 จะแสดงคำใบ้ภาษาเกาหลีเกี่ยวกับหน้าที่ทางไวยากรณ์",
                        "คงประโยคภาษาเกาหลีและรูปลงท้ายไว้ตามเดิม",
                        "จุดสำคัญคือแยกการรำลึกถึงนิสัยในอดีต/การกระทำที่ยังไม่จบ ออกจากรูปปัจจุบัน อดีตที่จบแล้ว และอนาคต"
                    ]
                }
            }
        },
        "c10/grammar12-quiz-menu.html": {
            title: "다국어 보조 안내",
            subtitle: "퀴즈 묶음의 목적과 권장 순서를 선택한 언어로 확인합니다.",
            terms: ["A/V-던", "-잖아요"],
            translations: {
                en: {
                    summary: "Choose the warm-up first, then move to the integrated quiz.",
                    points: [
                        "The warm-up checks whether each sentence uses the target grammar correctly.",
                        "The integrated quiz mixes multiple-choice and short-answer questions.",
                        "Korean grammar expressions stay in Korean so you can practice the exact form."
                    ]
                },
                vi: {
                    summary: "Nên làm phần khởi động trước, sau đó chuyển sang bài kiểm tra tổng hợp.",
                    points: [
                        "Phần khởi động kiểm tra câu dùng ngữ pháp mục tiêu đúng hay sai.",
                        "Bài tổng hợp có cả trắc nghiệm và trả lời ngắn.",
                        "Các biểu thức ngữ pháp tiếng Hàn được giữ nguyên để luyện đúng hình thức."
                    ]
                },
                ar: {
                    summary: "ابدأ بالتدريب التمهيدي، ثم انتقل إلى الاختبار المدمج.",
                    points: [
                        "يتحقق التدريب التمهيدي من صحة استعمال القاعدة في كل جملة.",
                        "يمزج الاختبار المدمج بين الاختيار من متعدد والإجابة القصيرة.",
                        "تبقى التعبيرات النحوية الكورية بالكورية للتدرب على الصيغة الدقيقة."
                    ]
                },
                mn: {
                    summary: "Эхлээд халаалтын дасгалыг хийж, дараа нь нэгдсэн сорил руу орно.",
                    points: [
                        "Халаалтын хэсэг нь өгүүлбэр зорилтот дүрмийг зөв хэрэглэсэн эсэхийг шалгана.",
                        "Нэгдсэн сорил олон сонголт болон богино хариултыг хослуулна.",
                        "Солонгос дүрмийн илэрхийллийг яг хэлбэрээр нь дадуулахын тулд солонгосоор үлдээнэ."
                    ]
                },
                kk: {
                    summary: "Алдымен қыздыру тапсырмасын орындап, кейін біріктірілген тестке өтіңіз.",
                    points: [
                        "Қыздыру бөлімі әр сөйлемде мақсат грамматикасының дұрыс қолданылғанын тексереді.",
                        "Біріктірілген тестте көп таңдаулы және қысқа жауапты сұрақтар араласады.",
                        "Корей грамматикалық тұлғалары нақты форманы жаттықтыру үшін корейше сақталады."
                    ]
                },
                th: {
                    summary: "เริ่มจากแบบฝึกอุ่นเครื่อง แล้วค่อยไปทำแบบทดสอบรวม",
                    points: [
                        "แบบอุ่นเครื่องตรวจว่าประโยคใช้ไวยากรณ์เป้าหมายถูกหรือไม่",
                        "แบบทดสอบรวมมีทั้งปรนัยและคำตอบสั้น",
                        "รูปไวยากรณ์ภาษาเกาหลีจะคงไว้เป็นภาษาเกาหลีเพื่อฝึกรูปจริง"
                    ]
                }
            }
        },
        "c10/grammar12-quiz-warmup.html": {
            title: "상황 번역",
            subtitle: "문항별 상황을 선택한 언어로 확인합니다.",
            terms: ["A/V-던", "-잖아요"],
            translations: {
                en: {
                    summary: "Each question keeps the Korean sentence. The selected language shows the situation for that question.",
                    points: []
                },
                vi: {
                    summary: "Mỗi câu giữ nguyên câu tiếng Hàn. Ngôn ngữ đã chọn hiển thị tình huống của câu đó.",
                    points: []
                },
                ar: {
                    summary: "تبقى الجملة الكورية كما هي. تعرض اللغة المختارة موقف كل سؤال.",
                    points: []
                },
                mn: {
                    summary: "Асуулт бүрийн солонгос өгүүлбэр хэвээр байна. Сонгосон хэл тухайн асуултын нөхцөлийг харуулна.",
                    points: []
                },
                kk: {
                    summary: "Әр сұрақтағы корей сөйлемі өзгермейді. Таңдалған тіл сол сұрақтың жағдаятын көрсетеді.",
                    points: []
                },
                th: {
                    summary: "แต่ละข้อคงประโยคเกาหลีไว้ ภาษาที่เลือกจะแสดงสถานการณ์ของข้อนั้น",
                    points: []
                }
            }
        },
        "c10/grammar12-quiz.html": {
            title: "상황 번역",
            subtitle: "문항별 상황을 선택한 언어로 확인합니다.",
            terms: ["A/V-던", "-잖아요"],
            translations: {
                en: {
                    summary: "Check each question's situation in the selected language before answering.",
                    points: []
                },
                vi: {
                    summary: "Xem tình huống của từng câu bằng ngôn ngữ đã chọn trước khi trả lời.",
                    points: []
                },
                ar: {
                    summary: "راجع موقف كل سؤال باللغة المختارة قبل الإجابة.",
                    points: []
                },
                mn: {
                    summary: "Хариулахаасаа өмнө асуулт бүрийн нөхцөлийг сонгосон хэлээр шалгана.",
                    points: []
                },
                kk: {
                    summary: "Жауап бермес бұрын әр сұрақтың жағдаятын таңдалған тілде тексеріңіз.",
                    points: []
                },
                th: {
                    summary: "ตรวจสถานการณ์ของแต่ละข้อในภาษาที่เลือกก่อนตอบ",
                    points: []
                }
            }
        }
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

    function ensureStylesheet() {
        const href = "../shared/multilang-toggle.css";
        const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .some((link) => link.getAttribute("href") === href);
        if (exists) return;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function appendText(parent, tag, text, className) {
        if (!text) return null;
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = text;
        parent.appendChild(node);
        return node;
    }

    function appendTerms(parent, terms) {
        if (!Array.isArray(terms) || !terms.length) return;
        const wrap = document.createElement("div");
        wrap.className = "multilang-scaffold__term";
        terms.forEach((term, index) => {
            if (index) wrap.appendChild(document.createTextNode(" "));
            const code = document.createElement("code");
            code.className = "ko-term";
            code.lang = "ko";
            code.dir = "ltr";
            code.textContent = term;
            wrap.appendChild(code);
        });
        parent.appendChild(wrap);
    }

    function buildPanel(entry) {
        const section = document.createElement("section");
        section.className = "multilang-scaffold";
        section.dataset.multilangSupport = "auto";
        section.setAttribute("aria-label", "다국어 보조 안내");

        const head = document.createElement("div");
        head.className = "multilang-scaffold__head";
        const copy = document.createElement("div");
        appendText(copy, "strong", entry.title || "다국어 보조 안내");
        appendText(copy, "p", entry.subtitle || "");
        const bar = document.createElement("div");
        bar.dataset.multilangBar = "";
        head.append(copy, bar);

        const body = document.createElement("div");
        body.className = "multilang-scaffold__body";
        LANG_ORDER.forEach((lang) => {
            const translation = entry.translations && entry.translations[lang];
            if (!translation) return;
            const box = document.createElement("div");
            box.className = "lang-box multilang-scaffold__box";
            box.dataset.lang = lang;
            box.lang = lang;
            if (lang === "ar") box.dir = "rtl";
            appendText(box, "div", translation.title || LANG_TITLES[lang] || lang, "multilang-scaffold__language");
            appendTerms(box, entry.terms);
            appendText(box, "p", translation.summary || "");
            if (Array.isArray(translation.points) && translation.points.length) {
                const list = document.createElement("ul");
                translation.points.forEach((point) => appendText(list, "li", point));
                box.appendChild(list);
            }
            body.appendChild(box);
        });

        section.append(head, body);
        return section;
    }

    function insertPanel(panel) {
        const main = document.querySelector("main");
        if (main && main.parentNode) {
            main.insertAdjacentElement("beforebegin", panel);
            return;
        }
        const nav = document.querySelector("nav");
        if (nav && nav.parentNode) {
            nav.insertAdjacentElement("afterend", panel);
            return;
        }
        document.body.insertAdjacentElement("afterbegin", panel);
    }

    function init() {
        const entry = DATA[getPageKey()];
        if (!entry || document.querySelector('[data-multilang-support="auto"]')) return;
        ensureStylesheet();
        window.MULTILANG_CONFIG = Object.assign({}, window.MULTILANG_CONFIG || {}, {
            langs: LANG_ORDER.slice(),
            defaultLang: "none"
        });
        insertPanel(buildPanel(entry));
    }

    if (document.body) {
        init();
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
