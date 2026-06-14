(function () {
    "use strict";

    const LANGS = {
        none: { label: "한국어 뜻", answerLabel: "한국어 뜻", speech: "ko-KR" },
        en: { label: "영어", answerLabel: "English", speech: "en-US" },
        vi: { label: "베트남어", answerLabel: "Tiếng Việt", speech: "vi-VN" },
        mn: { label: "몽골어", answerLabel: "Монгол", speech: "mn-MN" },
        ar: { label: "아랍어", answerLabel: "العربية", speech: "ar", dir: "rtl" },
        kk: { label: "카자흐어", answerLabel: "Қазақша", speech: "kk-KZ" },
        th: { label: "태국어", answerLabel: "ไทย", speech: "th-TH" }
    };
    const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const MODE_META = {
        meaning: {
            title: "뜻 퀴즈",
            type: "뜻 맞히기",
            subtitle: "어휘를 보고 알맞은 뜻을 고릅니다.",
            empty: "퀴즈에 사용할 어휘가 없습니다."
        },
        choseong: {
            title: "초성 퀴즈",
            type: "초성 퀴즈",
            subtitle: "초성을 보고 알맞은 어휘를 고릅니다.",
            empty: "초성 퀴즈에 사용할 어휘가 없습니다."
        },
        image: {
            title: "그림 퀴즈",
            type: "그림 퀴즈",
            subtitle: "그림에 맞는 어휘를 고릅니다.",
            empty: "그림이 있는 퀴즈 어휘가 없습니다."
        }
    };

    function init() {
        const cfg = window.VOCABULARY_CONFIG;
        if (!cfg) return;

        const mode = MODE_META[document.body.dataset.quizMode] ? document.body.dataset.quizMode : "meaning";
        const meta = MODE_META[mode];
        const words = normalizeWords(cfg.words || []).filter((word) => word.quiz !== false);
        let sourceWords = mode === "image" ? words.filter(hasQuizImage) : words;
        let activeLang = currentLang(cfg);
        let queue = shuffle(sourceWords);
        let quizIndex = 0;
        let correctCount = 0;

        const els = {
            pageTitle: document.getElementById("quiz-page-title"),
            subtitle: document.getElementById("quiz-subtitle"),
            progress: document.getElementById("quiz-progress"),
            type: document.getElementById("quiz-type"),
            question: document.getElementById("quiz-question"),
            options: document.getElementById("quiz-options"),
            feedback: document.getElementById("quiz-feedback"),
            nextBtn: document.getElementById("next-question-btn"),
            restartBtn: document.getElementById("restart-quiz-btn")
        };

        document.title = `11과 어휘 ${meta.title}`;
        if (els.pageTitle) els.pageTitle.textContent = meta.title;
        if (els.subtitle) els.subtitle.textContent = meta.subtitle;

        function renderQuestion() {
            const current = queue[quizIndex];
            els.options.innerHTML = "";
            els.feedback.textContent = "";
            els.nextBtn.hidden = true;

            if (!current) {
                els.progress.textContent = "문제 0 / 0";
                els.type.textContent = meta.type;
                els.question.innerHTML = `<p class="quiz-prompt">${escapeHtml(meta.empty)}</p>`;
                return;
            }

            els.progress.textContent = `문제 ${quizIndex + 1} / ${queue.length}`;
            els.type.textContent = mode === "meaning" ? `${answerLabel(activeLang)} 맞히기` : meta.type;
            els.question.innerHTML = questionMarkup(current, mode);
            els.feedback.dir = mode === "meaning" ? langDir(activeLang) : "ltr";

            const wrongPool = sourceWords.filter((word) => word !== current);
            const choices = shuffle([current, ...shuffle(wrongPool).slice(0, 3)]);
            const correctAnswer = answerFor(current, mode, activeLang);

            choices.forEach((choice) => {
                const option = document.createElement("button");
                option.className = "quiz-option";
                option.type = "button";
                option.textContent = answerFor(choice, mode, activeLang);
                option.dir = mode === "meaning" ? langDir(activeLang) : "ltr";
                option.dataset.correct = String(choice === current);
                option.addEventListener("click", () => {
                    const ok = choice === current;
                    if (ok) correctCount += 1;
                    document.querySelectorAll(".quiz-option").forEach((button) => {
                        button.disabled = true;
                        if (button === option) button.classList.add(ok ? "correct" : "wrong");
                        if (!ok && button.dataset.correct === "true") button.classList.add("correct");
                    });
                    els.feedback.textContent = ok ? "정답!" : `오답 - 정답: ${correctAnswer}`;
                    els.nextBtn.hidden = false;
                });
                els.options.appendChild(option);
            });
        }

        function nextQuestion() {
            quizIndex += 1;
            if (quizIndex < queue.length) {
                renderQuestion();
                return;
            }
            els.progress.textContent = `완료 / ${queue.length}`;
            els.type.textContent = "퀴즈 완료";
            els.question.innerHTML = '<p class="quiz-prompt">퀴즈 완료!</p>';
            els.options.innerHTML = "";
            els.feedback.textContent = `${queue.length}문제 중 ${correctCount}문제를 맞혔습니다.`;
            els.nextBtn.hidden = true;
            els.restartBtn.hidden = false;
        }

        function restartQuiz() {
            sourceWords = mode === "image" ? words.filter(hasQuizImage) : words;
            queue = shuffle(sourceWords);
            quizIndex = 0;
            correctCount = 0;
            els.restartBtn.hidden = true;
            renderQuestion();
        }

        els.nextBtn.addEventListener("click", nextQuestion);
        els.restartBtn.addEventListener("click", restartQuiz);
        document.addEventListener("click", (event) => {
            if (!event.target.closest("[data-multilang-btn]")) return;
            setTimeout(() => {
                const nextLang = currentLang(cfg);
                if (nextLang === activeLang) return;
                activeLang = nextLang;
                renderQuestion();
            }, 50);
        });

        renderQuestion();
    }

    function normalizeWords(source) {
        return source.map((word, index) => ({
            ...word,
            id: word.id || `word-${index + 1}`,
            ko: word.ko || word.term || word.korean || "",
            meaning: word.meaning || word.definition || word.foreign || "",
            category: word.category || "all",
            image: word.image || null,
            imageAlt: word.imageAlt || word.alt || "",
            quizImage: word.quizImage || word.maskedImage || null,
            quizImageAlt: word.quizImageAlt || word.imageAlt || word.alt || ""
        })).filter((word) => word.ko);
    }

    function hasQuizImage(word) {
        return Boolean(word.quizImage || word.image);
    }

    function currentLang(cfg) {
        const lang = window.MultilangToggle?.getLang?.() || readStored("preferred-lang", cfg.defaultLang || "none");
        if (!LANGS[lang] || (lang !== "none" && !cfg.languages?.includes(lang))) return "none";
        return lang;
    }

    function readStored(key, fallback) {
        try { return localStorage.getItem(key) || fallback; }
        catch (error) { return fallback; }
    }

    function answerFor(word, mode, lang) {
        if (mode !== "meaning") return word.ko;
        if (lang === "none") return word.meaning || word.example || word.ko;
        return word[lang] || word.meaning || word.example || word.ko;
    }

    function answerLabel(lang) {
        return LANGS[lang]?.answerLabel || "한국어 뜻";
    }

    function langDir(lang) {
        return LANGS[lang]?.dir || "ltr";
    }

    function questionMarkup(word, mode) {
        if (mode === "meaning") {
            return `
                <div class="quiz-term">${escapeHtml(word.ko)}</div>
                <p class="quiz-prompt">알맞은 뜻을 고르세요.</p>
            `;
        }

        if (mode === "choseong") {
            return `
                ${visualMarkup(word, `<span class="quiz-choseong-overlay">${escapeHtml(choseongFor(word.ko))}</span>`)}
                <p class="quiz-prompt">초성을 보고 어휘를 고르세요.</p>
            `;
        }

        return `
            ${visualMarkup(word)}
            <p class="quiz-prompt">그림에 맞는 어휘를 고르세요.</p>
        `;
    }

    function visualMarkup(word, overlay = "") {
        const src = word.quizImage || word.image;
        const alt = word.quizImageAlt || word.imageAlt || "어휘 그림";
        const visual = src
            ? `<img class="quiz-image" src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" />`
            : `<span class="quiz-visual__fallback">${escapeHtml(word.ko)}</span>`;
        return `<div class="quiz-visual">${visual}${overlay}</div>`;
    }

    function choseongFor(value) {
        return String(value || "").split("").map((char) => {
            const code = char.charCodeAt(0) - 0xac00;
            if (code >= 0 && code <= 11171) return CHOSEONG[Math.floor(code / 588)];
            return char;
        }).join("").replace(/\s+/g, " ").trim();
    }

    function shuffle(source) {
        const list = source.slice();
        for (let i = list.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
        return list;
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
