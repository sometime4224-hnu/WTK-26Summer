(function () {
    "use strict";

    const config = window.C12_GRAMMAR1_VISUAL_PROTOTYPE;
    const root = document.getElementById("visualPrototype");

    if (!config || !root) return;

    window.MULTILANG_CONFIG = Object.assign({}, window.MULTILANG_CONFIG || {}, {
        langs: config.langs || ["en", "vi", "ar", "mn", "kk", "th"],
        defaultLang: "none"
    });

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function norm(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[\s.,!?~`"'“”‘’()]/g, "");
    }

    function shuffle(items) {
        const copied = items.slice();
        for (let i = copied.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = copied[i];
            copied[i] = copied[j];
            copied[j] = tmp;
        }
        return copied;
    }

    function loadPrefs() {
        try {
            return JSON.parse(localStorage.getItem(config.storageKey) || "{}");
        } catch {
            return {};
        }
    }

    function savePrefs(nextPrefs) {
        try {
            localStorage.setItem(config.storageKey, JSON.stringify(nextPrefs));
        } catch {
            // Storage can be unavailable in some browser modes.
        }
    }

    function syncMultilangBlocks() {
        if (!window.MultilangToggle) return;
        if (typeof window.MultilangToggle.refresh === "function") {
            window.MultilangToggle.refresh();
        }
    }

    function renderTranslations(translations) {
        const langs = config.langs || [];
        return `
            <div class="story-translation-grid">
                ${langs.map((lang) => {
                    const text = translations && translations[lang] ? translations[lang] : "";
                    const dir = lang === "ar" ? ' dir="rtl"' : "";
                    return `<p class="lang-box" data-lang="${esc(lang)}" lang="${esc(lang)}"${dir}>${esc(text)}</p>`;
                }).join("")}
            </div>
        `;
    }

    function renderStoryCard(card) {
        return `
            <article class="story-card" data-story-id="${esc(card.id)}">
                <div class="story-media">
                    <img src="${esc(card.image)}" width="1672" height="941" alt="${esc(card.alt)}" loading="lazy" decoding="async" />
                    <button class="fullscreen-btn" type="button" data-fullscreen-id="${esc(card.id)}" aria-label="${esc(card.title)} 전체화면으로 보기">
                        <span aria-hidden="true">⛶</span>
                        <span>전체 화면</span>
                    </button>
                </div>
                <div class="story-copy">
                    <span class="story-step">${esc(card.step)} · ${esc(card.label)}</span>
                    <h2>${esc(card.title)}</h2>
                    <p>${esc(card.body)}</p>
                    <div class="story-example">${esc(card.example)}</div>
                    ${renderTranslations(card.translations)}
                </div>
            </article>
        `;
    }

    function renderViTranslation(text, extraClass) {
        if (!text) return "";
        const classes = `quiz-translation lang-box${extraClass ? ` ${extraClass}` : ""}`;
        return `<p class="${classes}" data-lang="vi" lang="vi">${esc(text)}</p>`;
    }

    function renderShell() {
        root.innerHTML = `
            <section class="visual-hero">
                <div class="hero-copy">
                    <p class="eyebrow">${esc(config.eyebrow)}</p>
                    <h1 class="hero-title">${esc(config.title)}</h1>
                    <p class="hero-lead">${esc(config.lead)}</p>
                </div>
                <div class="hero-stat-grid" aria-label="핵심 구조">
                    ${(config.heroStats || []).map((stat) => `
                        <div class="hero-stat">
                            <span>${esc(stat.label)}</span>
                            <strong>${esc(stat.value)}</strong>
                        </div>
                    `).join("")}
                </div>
            </section>

            <section class="translation-bar" aria-label="다국어 번역">
                <p class="translation-bar__title">다국어 도움</p>
                <div data-multilang-bar></div>
            </section>

            <section class="storyboard" aria-label="이미지 학습 순서">
                ${(config.storyboard || []).map(renderStoryCard).join("")}
            </section>

            <section class="support-panel" aria-label="문법 1 연결 활동">
                <div>
                    <p class="support-panel__title">연결 활동</p>
                    <p class="support-panel__desc">이미지로 의미를 잡은 뒤, 카드 게임과 말하기 활동으로 바로 이어 갈 수 있습니다.</p>
                </div>
                <div class="support-links">
                    <a class="resource-link" href="grammar1-form-typing.html">활용형 쓰기</a>
                    <a class="resource-link" href="grammar1-card-game.html">문법 카드 게임</a>
                    <a class="resource-link" href="grammar1-reason.html">이유 문법 비교</a>
                    <a class="resource-link" href="grammar1-2-speaking.html">문법1·2 융합 말하기</a>
                </div>
            </section>

            <section id="imageLightbox" class="image-lightbox hidden" role="dialog" aria-modal="true" aria-label="이미지 전체화면 보기">
                <button id="lightboxCloseBtn" class="lightbox-close" type="button" aria-label="전체화면 닫기">닫기</button>
                <figure class="lightbox-figure">
                    <img id="lightboxImage" src="" alt="" />
                    <figcaption>
                        <strong id="lightboxTitle"></strong>
                        <span id="lightboxCaption"></span>
                    </figcaption>
                </figure>
            </section>

            <div class="practice-tabs" role="tablist" aria-label="연습 탭">
                <button id="tabDrill" class="tab-btn active" type="button">형태 드릴</button>
                <button id="tabQuiz" class="tab-btn" type="button">퀴즈</button>
            </div>

            <section id="drillPanel" class="practice-panel">
                <div class="practice-grid">
                    <article class="practice-card">
                        <p class="eyebrow">Form Drill</p>
                        <h2>${esc(config.drill.title)}</h2>
                        <p>${esc(config.drill.intro)}</p>
                        <ul class="guide-list">
                            <li>앞면의 동사를 문장 속 형태로 바꿉니다.</li>
                            <li>정답을 본 뒤 아는 카드와 다시 볼 카드를 나눕니다.</li>
                            <li>헷갈린 카드는 결과 화면에서 한 번 더 봅니다.</li>
                        </ul>
                    </article>
                    <article class="practice-card">
                        <div class="meta-row">
                            <strong id="drillProgress">1 / 1</strong>
                            <span id="drillMode">형태 확인</span>
                        </div>
                        <div class="progress-line"><div id="drillBar" class="progress-bar"></div></div>
                        <div id="drillFace" class="drill-card-face" role="button" tabindex="0" aria-label="드릴 카드 정답 보기"></div>
                        <div id="drillActions" class="button-row hidden">
                            <button id="drillKnowBtn" class="btn primary" type="button">알아요</button>
                            <button id="drillRetryBtn" class="btn danger" type="button">다시 볼게요</button>
                        </div>
                        <article id="drillResult" class="result-card hidden"></article>
                    </article>
                </div>
            </section>

            <section id="quizPanel" class="practice-panel hidden">
                <div class="practice-grid">
                    <article class="practice-card">
                        <p class="eyebrow">Quick Check</p>
                        <h2>${esc(config.quizTitle)}</h2>
                        <p>${esc(config.quizIntro)}</p>
                        <ul class="guide-list">
                            <li>형태와 의미를 문장 안에서 확인합니다.</li>
                            <li>정답 뒤에는 바로 근거를 봅니다.</li>
                            <li>오답 문항만 다시 풀 수 있습니다.</li>
                        </ul>
                    </article>
                    <article class="practice-card">
                        <div class="meta-row">
                            <strong id="quizProgress">1 / 1</strong>
                            <span>즉시 피드백</span>
                        </div>
                        <div class="progress-line"><div id="quizBar" class="progress-bar"></div></div>
                        <div class="question-box">
                            <p id="qGrammar" class="question-tag"></p>
                            <p id="qText" class="question-text"></p>
                            <p id="qHintKo" class="quiz-hint"></p>
                            <p id="qHintVi" class="quiz-hint quiz-translation lang-box" data-lang="vi" lang="vi"></p>
                        </div>
                        <div id="choices" class="choices"></div>
                        <div id="shortWrap" class="short-wrap hidden">
                            <input id="shortInput" type="text" autocomplete="off" placeholder="정답 입력" />
                            <button id="checkShortBtn" class="btn primary" type="button">정답 확인</button>
                        </div>
                        <div id="feedbackBox" class="feedback hidden"></div>
                        <button id="nextBtn" class="btn primary hidden" type="button">다음 문제</button>
                        <article id="resultPanel" class="result-card hidden"></article>
                    </article>
                </div>
            </section>

            <nav class="footer-nav" aria-label="문법 이동">
                <a class="nav-link" href="grammar1-classic.html">문법 1 기존 버전</a>
                <a class="nav-link" href="index.html">12과 목록</a>
                <a class="nav-link primary" href="grammar2.html">문법 2</a>
            </nav>
        `;
    }

    renderShell();

    const quizBank = (config.quiz || []).map((item, index) => Object.assign({ id: `q${index + 1}` }, item));
    const drillBank = (config.drill.cards || []).map((item, index) => Object.assign({ id: `d${index + 1}` }, item));
    const prefs = loadPrefs();

    const state = {
        activeTab: "drill",
        prefs: Object.assign({
            best: { score: 0, total: quizBank.length, percent: 0 },
            lastWrongIds: []
        }, prefs),
        drill: {
            cards: shuffle(drillBank),
            index: 0,
            score: 0,
            missed: [],
            revealed: false
        },
        quiz: createQuiz(quizBank, "전체 문제")
    };

    const refs = {
        tabDrill: document.getElementById("tabDrill"),
        tabQuiz: document.getElementById("tabQuiz"),
        drillPanel: document.getElementById("drillPanel"),
        quizPanel: document.getElementById("quizPanel"),
        lightbox: document.getElementById("imageLightbox"),
        lightboxImage: document.getElementById("lightboxImage"),
        lightboxTitle: document.getElementById("lightboxTitle"),
        lightboxCaption: document.getElementById("lightboxCaption"),
        lightboxCloseBtn: document.getElementById("lightboxCloseBtn")
    };

    function findStoryCard(id) {
        return (config.storyboard || []).find((card) => card.id === id);
    }

    function openLightbox(card) {
        if (!card) return;
        refs.lightboxImage.src = card.image;
        refs.lightboxImage.alt = card.alt;
        refs.lightboxTitle.textContent = card.title;
        refs.lightboxCaption.textContent = card.example;
        refs.lightbox.classList.remove("hidden");
        document.body.classList.add("lightbox-open");
        refs.lightboxCloseBtn.focus();
    }

    function closeLightbox() {
        if (refs.lightbox.classList.contains("hidden")) return;
        refs.lightbox.classList.add("hidden");
        refs.lightboxImage.removeAttribute("src");
        refs.lightboxImage.alt = "";
        document.body.classList.remove("lightbox-open");
    }

    function createQuiz(pool, modeLabel) {
        return {
            questions: shuffle(pool),
            modeLabel: modeLabel || "전체 문제",
            index: 0,
            score: 0,
            answered: false,
            selected: "",
            logs: [],
            finished: false
        };
    }

    function showTab(name) {
        state.activeTab = name;
        const drillActive = name === "drill";
        refs.drillPanel.classList.toggle("hidden", !drillActive);
        refs.quizPanel.classList.toggle("hidden", drillActive);
        refs.tabDrill.classList.toggle("active", drillActive);
        refs.tabQuiz.classList.toggle("active", !drillActive);
        if (!drillActive && !state.quizStarted) {
            state.quizStarted = true;
            renderQuestion();
        }
        syncMultilangBlocks();
    }

    function currentDrillCard() {
        return state.drill.cards[state.drill.index];
    }

    function renderDrillCard() {
        const card = currentDrillCard();
        const total = state.drill.cards.length || 1;
        const face = document.getElementById("drillFace");
        const actions = document.getElementById("drillActions");
        document.getElementById("drillProgress").textContent = `${Math.min(state.drill.index + 1, total)} / ${total}`;
        document.getElementById("drillBar").style.width = `${Math.round((state.drill.index / total) * 100)}%`;
        document.getElementById("drillMode").textContent = card ? card.tag : "형태 확인";
        document.getElementById("drillResult").classList.add("hidden");
        actions.classList.add("hidden");

        if (!card) {
            showDrillResult();
            return;
        }

        state.drill.revealed = false;
        face.innerHTML = `
            <p class="drill-tag">${esc(card.tag)}</p>
            <p class="drill-front">${esc(card.front)}</p>
            ${card.sub ? `<p class="drill-sub">${esc(card.sub)}</p>` : ""}
        `;
    }

    function revealDrillCard() {
        const card = currentDrillCard();
        if (!card || state.drill.revealed) return;
        state.drill.revealed = true;
        document.getElementById("drillFace").innerHTML = `
            <p class="drill-tag">정답</p>
            <p class="drill-back">${esc(card.back)}</p>
            <p class="drill-rule">${esc(card.rule)}</p>
            ${renderViTranslation(card.ruleVi, "drill-sub")}
        `;
        document.getElementById("drillActions").classList.remove("hidden");
        syncMultilangBlocks();
    }

    function rateDrill(knew) {
        const card = currentDrillCard();
        if (!card) return;
        if (knew) {
            state.drill.score += 1;
        } else {
            state.drill.missed.push(card);
        }
        state.drill.index += 1;
        if (state.drill.index >= state.drill.cards.length) {
            showDrillResult();
            return;
        }
        renderDrillCard();
    }

    function startDrill(cards) {
        state.drill.cards = shuffle(cards);
        state.drill.index = 0;
        state.drill.score = 0;
        state.drill.missed = [];
        state.drill.revealed = false;
        document.getElementById("drillResult").classList.add("hidden");
        renderDrillCard();
    }

    function showDrillResult() {
        const total = state.drill.cards.length || 1;
        const result = document.getElementById("drillResult");
        const missed = state.drill.missed;
        document.getElementById("drillBar").style.width = "100%";
        document.getElementById("drillActions").classList.add("hidden");
        document.getElementById("drillFace").innerHTML = `
            <p class="drill-tag">드릴 완료</p>
            <p class="drill-back">${state.drill.score} / ${total}</p>
            <p class="drill-sub">다시 볼 카드를 아래에 정리했습니다.</p>
        `;
        result.innerHTML = `
            <div class="score-card">
                <p class="eyebrow">Drill Complete</p>
                <h3>${state.drill.score} / ${total}</h3>
                <p>즉시 인지 ${Math.round((state.drill.score / total) * 100)}%</p>
                <div class="button-row">
                    <button id="restartDrillBtn" class="btn primary" type="button">다시 드릴</button>
                    <button id="reviewDrillBtn" class="btn danger" type="button" ${missed.length ? "" : "disabled"}>오답만 복습</button>
                </div>
            </div>
            <div class="mistake-list">
                ${missed.length ? missed.map((card) => `
                    <article class="mistake-item">
                        <p><strong>${esc(card.front)}</strong></p>
                        <p>정답: ${esc(card.back)}</p>
                        <p>${esc(card.rule)}</p>
                    </article>
                `).join("") : '<article class="mistake-item ok"><p>다시 볼 카드가 없습니다.</p></article>'}
            </div>
        `;
        result.classList.remove("hidden");
        document.getElementById("restartDrillBtn").addEventListener("click", () => startDrill(drillBank));
        document.getElementById("reviewDrillBtn").addEventListener("click", () => {
            if (missed.length) startDrill(missed);
        });
    }

    function currentQuestion() {
        return state.quiz.questions[state.quiz.index];
    }

    function renderQuestion() {
        const quiz = state.quiz;
        const q = currentQuestion();

        if (!q) {
            renderQuizResult();
            return;
        }

        quiz.answered = false;
        quiz.selected = "";
        document.getElementById("quizProgress").textContent = `${quiz.modeLabel} · ${quiz.index + 1} / ${quiz.questions.length}`;
        document.getElementById("quizBar").style.width = `${Math.round((quiz.index / quiz.questions.length) * 100)}%`;
        document.getElementById("qGrammar").textContent = q.grammar;
        document.getElementById("qText").textContent = q.q;
        document.getElementById("qHintKo").textContent = `상황: ${q.hintKo || ""}`;
        document.getElementById("qHintVi").textContent = q.hintVi ? `Tình huống: ${q.hintVi}` : "";
        document.getElementById("feedbackBox").classList.add("hidden");
        document.getElementById("feedbackBox").innerHTML = "";
        document.getElementById("nextBtn").classList.add("hidden");
        document.getElementById("resultPanel").classList.add("hidden");

        const choices = document.getElementById("choices");
        const shortWrap = document.getElementById("shortWrap");
        const shortInput = document.getElementById("shortInput");
        choices.innerHTML = "";
        shortWrap.classList.add("hidden");
        shortInput.value = "";
        shortInput.disabled = false;
        document.getElementById("checkShortBtn").disabled = false;

        if (q.type === "mcq") {
            q.options.forEach((option) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "choice-btn";
                button.textContent = option;
                button.addEventListener("click", () => answerQuestion(option));
                choices.appendChild(button);
            });
        } else {
            shortWrap.classList.remove("hidden");
        }
        syncMultilangBlocks();
    }

    function lockQuizInputs(q, user) {
        if (q.type === "mcq") {
            Array.from(document.querySelectorAll("#choices .choice-btn")).forEach((button) => {
                button.disabled = true;
                if (button.textContent === q.answer) {
                    button.classList.add("correct");
                } else if (button.textContent === user) {
                    button.classList.add("wrong");
                } else {
                    button.classList.add("dimmed");
                }
            });
            return;
        }
        document.getElementById("shortInput").disabled = true;
        document.getElementById("checkShortBtn").disabled = true;
    }

    function answerQuestion(user) {
        const quiz = state.quiz;
        const q = currentQuestion();
        if (!q || quiz.answered) return;

        const correct = q.type === "mcq" ? q.answer : q.answers[0];
        const ok = q.type === "mcq"
            ? user === q.answer
            : q.answers.some((answer) => norm(answer) === norm(user));

        quiz.answered = true;
        quiz.selected = user;
        if (ok) quiz.score += 1;
        quiz.logs.push({
            id: q.id,
            ok,
            user,
            correct,
            q: q.q,
            explainKo: q.explainKo,
            explainVi: q.explainVi
        });

        const feedback = document.getElementById("feedbackBox");
        feedback.className = `feedback ${ok ? "ok" : "bad"}`;
        feedback.innerHTML = `
            <strong>${ok ? "정답입니다." : "오답입니다."}</strong>
            <p>내 답: ${esc(user || "(무응답)")}</p>
            <p>정답: ${esc(correct)}</p>
            <p>${esc(q.explainKo)}</p>
            ${renderViTranslation(q.explainVi)}
        `;
        feedback.classList.remove("hidden");
        document.getElementById("nextBtn").classList.remove("hidden");
        lockQuizInputs(q, user);
        document.getElementById("quizBar").style.width = `${Math.round(((quiz.index + 1) / quiz.questions.length) * 100)}%`;
        syncMultilangBlocks();
    }

    function updateBest() {
        const quiz = state.quiz;
        const percent = Math.round((quiz.score / quiz.questions.length) * 100);
        const best = state.prefs.best || { score: 0, total: quizBank.length, percent: 0 };
        if (percent > best.percent || (percent === best.percent && quiz.score > best.score)) {
            state.prefs.best = { score: quiz.score, total: quiz.questions.length, percent };
        }
        state.prefs.lastWrongIds = quiz.logs.filter((log) => !log.ok).map((log) => log.id);
        savePrefs(state.prefs);
    }

    function renderQuizResult() {
        const quiz = state.quiz;
        quiz.finished = true;
        updateBest();
        const percent = Math.round((quiz.score / quiz.questions.length) * 100);
        const wrong = quiz.logs.filter((log) => !log.ok);
        const result = document.getElementById("resultPanel");

        result.innerHTML = `
            <div class="score-card">
                <p class="eyebrow">Quiz Complete</p>
                <h3>${quiz.score} / ${quiz.questions.length}</h3>
                <p>정답률 ${percent}% · 최고 기록 ${state.prefs.best.score}/${state.prefs.best.total} (${state.prefs.best.percent}%)</p>
                <div class="button-row">
                    <button id="restartQuizBtn" class="btn primary" type="button">다시 풀기</button>
                    <button id="retryWrongBtn" class="btn danger" type="button" ${wrong.length ? "" : "disabled"}>오답만 다시 풀기</button>
                </div>
            </div>
            <div class="mistake-list">
                ${wrong.length ? wrong.map((item, index) => `
                    <article class="mistake-item">
                        <p><strong>오답 ${index + 1}</strong></p>
                        <p>${esc(item.q)}</p>
                        <p>내 답: ${esc(item.user || "(무응답)")}</p>
                        <p>정답: ${esc(item.correct)}</p>
                        <p>${esc(item.explainKo)}</p>
                        ${renderViTranslation(item.explainVi)}
                    </article>
                `).join("") : '<article class="mistake-item ok"><p>오답이 없습니다. 모든 문항을 정확히 풀었습니다.</p></article>'}
            </div>
        `;
        result.classList.remove("hidden");
        document.getElementById("restartQuizBtn").addEventListener("click", () => {
            state.quiz = createQuiz(quizBank, "전체 문제");
            renderQuestion();
        });
        document.getElementById("retryWrongBtn").addEventListener("click", () => {
            if (!wrong.length) return;
            const wrongIds = new Set(wrong.map((item) => item.id));
            const pool = quizBank.filter((item) => wrongIds.has(item.id));
            state.quiz = createQuiz(pool, "오답 다시 풀기");
            renderQuestion();
        });
        syncMultilangBlocks();
    }

    refs.tabDrill.addEventListener("click", () => showTab("drill"));
    refs.tabQuiz.addEventListener("click", () => showTab("quiz"));
    document.querySelectorAll(".fullscreen-btn").forEach((button) => {
        button.addEventListener("click", () => openLightbox(findStoryCard(button.dataset.fullscreenId)));
    });
    refs.lightboxCloseBtn.addEventListener("click", closeLightbox);
    refs.lightbox.addEventListener("click", (event) => {
        if (event.target === refs.lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeLightbox();
    });
    document.getElementById("drillFace").addEventListener("click", revealDrillCard);
    document.getElementById("drillFace").addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            revealDrillCard();
        }
    });
    document.getElementById("drillKnowBtn").addEventListener("click", () => rateDrill(true));
    document.getElementById("drillRetryBtn").addEventListener("click", () => rateDrill(false));
    document.getElementById("checkShortBtn").addEventListener("click", () => {
        const value = document.getElementById("shortInput").value.trim();
        if (!value) return;
        answerQuestion(value);
    });
    document.getElementById("shortInput").addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.key === "Enter" && !state.quiz.answered) {
            event.preventDefault();
            document.getElementById("checkShortBtn").click();
        }
    });
    document.getElementById("nextBtn").addEventListener("click", () => {
        state.quiz.index += 1;
        renderQuestion();
    });

    renderDrillCard();
})();
