(function () {
    "use strict";

    const config = window.C13_GRAMMAR_PAGE;
    const root = document.getElementById("page");

    if (!config || !root) {
        return;
    }

    const theme = Object.assign({
        accent: "#2563eb",
        accentDark: "#1d4ed8",
        accentSoft: "#dbeafe",
        accentLine: "#93c5fd"
    }, config.theme || {});

    document.body.classList.add("c13-grammar-page");
    document.body.style.setProperty("--c13-accent", theme.accent);
    document.body.style.setProperty("--c13-accent-dark", theme.accentDark);
    document.body.style.setProperty("--c13-accent-soft", theme.accentSoft);
    document.body.style.setProperty("--c13-accent-line", theme.accentLine);

    if (config.documentTitle) {
        document.title = config.documentTitle;
    }

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
            // Ignore storage failures in restricted browser contexts.
        }
    }

    function syncMultilangBlocks() {
        if (!window.MultilangToggle || typeof window.MultilangToggle.getLang !== "function" || typeof window.MultilangToggle.setLang !== "function") {
            return;
        }
        if (typeof window.MultilangToggle.refresh === "function") {
            window.MultilangToggle.refresh();
            return;
        }
        window.MultilangToggle.setLang(window.MultilangToggle.getLang());
    }

    function htmlList(items, tagName) {
        if (!Array.isArray(items) || !items.length) return "";
        const tag = tagName === "ol" ? "ol" : "ul";
        return `<${tag}>${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
    }

    function renderStudyCard(card) {
        const examples = Array.isArray(card.examples) && card.examples.length
            ? `<div class="example-list">${card.examples.map((example) => `<div class="example">${example}</div>`).join("")}</div>`
            : "";
        return `
            <article class="study-card ${card.wide ? "wide" : ""}">
                ${card.eyebrow ? `<p class="eyebrow">${esc(card.eyebrow)}</p>` : ""}
                <h2>${card.title}</h2>
                ${(card.body || []).map((line) => `<p>${line}</p>`).join("")}
                ${htmlList(card.list, card.listType)}
                ${examples}
            </article>
        `;
    }
    function renderVisualCards() {
        if (!Array.isArray(config.visualCards) || !config.visualCards.length) {
            return "";
        }

        return `
            <div class="visual-grid" aria-label="시각 학습 카드">
                ${config.visualCards.map((card, index) => {
                    return `
                        <article class="visual-card">
                            <h2>${esc(card.title)}</h2>
                            <div class="visual-card__media">
                                <img
                                    src="${esc(card.src)}"
                                    ${card.srcset ? `srcset="${esc(card.srcset)}"` : ""}
                                    sizes="${esc(card.sizes || "(min-width: 860px) 520px, calc(100vw - 40px)")}"
                                    alt="${esc(card.alt || "")}"
                                    decoding="async"
                                    loading="${index === 0 ? "eager" : "lazy"}"
                                    fetchpriority="${index === 0 ? "high" : "auto"}"
                                />
                            </div>
                        </article>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderResourcePanel() {
        if (!Array.isArray(config.resources) || !config.resources.length) {
            return `
                <div class="flow-panel" aria-label="학습 흐름">
                    <p class="flow-panel__title">오늘의 흐름</p>
                    <div class="flow-step"><span>1</span><strong>의미를 먼저 잡기</strong></div>
                    <div class="flow-step"><span>2</span><strong>형태를 카드로 확인</strong></div>
                    <div class="flow-step"><span>3</span><strong>퀴즈로 바로 점검</strong></div>
                </div>
            `;
        }

        return `
            <div class="resource-panel" aria-label="보조 활동">
                <p class="resource-panel__title">보조 활동</p>
                ${config.resources.map((resource) => `
                    <a class="resource-link" href="${esc(resource.href)}">
                        <span>${esc(resource.label)}</span>
                        <span aria-hidden="true">→</span>
                    </a>
                `).join("")}
            </div>
        `;
    }

    function renderFooterNav() {
        const links = [];
        if (config.prev) {
            links.push(`<a class="nav-link" href="${esc(config.prev.href)}">${esc(config.prev.label)}</a>`);
        }
        links.push('<a class="nav-link" href="index.html">13과 목록</a>');
        if (config.next) {
            links.push(`<a class="nav-link primary" href="${esc(config.next.href)}">${esc(config.next.label)}</a>`);
        }
        return `<nav class="footer-nav" aria-label="문법 이동">${links.join("")}</nav>`;
    }
    function renderHeroIllustration() {
        const illustration = config.illustration || {};
        if (!illustration.src) return "";

        return `
            <figure class="hero-illustration">
                <img
                    class="hero-illustration__image"
                    src="${esc(illustration.src)}"
                    alt="${esc(illustration.alt || "")}"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                />
                ${illustration.caption ? `<figcaption>${esc(illustration.caption)}</figcaption>` : ""}
            </figure>
        `;
    }

    function renderShell() {
        root.innerHTML = `
            <section class="hero-panel">
                <div class="hero-main ${config.illustration && config.illustration.src ? "has-illustration" : ""}">
                    <div class="hero-copy">
                        <p class="eyebrow">${esc(config.eyebrow)}</p>
                        <h1 class="hero-title">${config.title}</h1>
                        <p class="hero-lead">${config.lead}</p>
                    </div>
                    ${renderHeroIllustration()}
                    <div class="chip-row">
                        ${(config.chips || []).map((chip) => `<span class="chip">${esc(chip)}</span>`).join("")}
                    </div>
                    <div class="meaning-strip" aria-label="핵심 의미">
                        ${(config.meaningCards || []).map((card) => `
                            <div class="meaning-card">
                                <strong>${esc(card.label)}</strong>
                                <p>${card.text}</p>
                            </div>
                        `).join("")}
                    </div>
                    <aside class="action-panel" aria-label="학습 이동">
                        <div class="tab-row" role="tablist" aria-label="학습 탭">
                            <button id="tabLearn" class="tab-btn active" type="button">학습</button>
                            <button id="tabDrill" class="tab-btn" type="button">형태 드릴</button>
                            <button id="tabQuiz" class="tab-btn" type="button">퀴즈</button>
                        </div>
                        ${renderResourcePanel()}
                    </aside>
                </div>
            </section>

            <section id="learnPanel" class="panel">
                ${renderVisualCards()}
                <div class="learn-grid">
                    ${(config.learnCards || []).map(renderStudyCard).join("")}
                </div>
            </section>

            <section id="drillPanel" class="panel hidden">
                <div class="practice-grid">
                    <article class="practice-card guide-card">
                        <p class="eyebrow">Form Drill</p>
                        <h2>${esc(config.drill.title)}</h2>
                        <p>${config.drill.intro}</p>
                        <ul class="guide-list">
                            <li>앞면을 보고 먼저 답을 떠올립니다.</li>
                            <li>카드를 눌러 정답과 규칙을 확인합니다.</li>
                            <li>헷갈린 카드는 마지막에 다시 볼 수 있습니다.</li>
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

            <section id="quizPanel" class="panel hidden">
                <div class="practice-grid">
                    <article class="practice-card guide-card">
                        <p class="eyebrow">Quick Check</p>
                        <h2>${esc(config.quizTitle || "실전 퀴즈")}</h2>
                        <p>${config.quizIntro || "문장 맥락 안에서 형태와 의미를 바로 확인합니다."}</p>
                        <ul class="guide-list">
                            <li>객관식과 단답형 문항이 섞여 있습니다.</li>
                            <li>정답을 고르면 즉시 근거 설명이 나옵니다.</li>
                            <li>결과 화면에서 오답만 다시 풀 수 있습니다.</li>
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

            ${renderFooterNav()}
        `;
    }

    renderShell();

    const panels = {
        learn: document.getElementById("learnPanel"),
        drill: document.getElementById("drillPanel"),
        quiz: document.getElementById("quizPanel")
    };
    const tabs = {
        learn: document.getElementById("tabLearn"),
        drill: document.getElementById("tabDrill"),
        quiz: document.getElementById("tabQuiz")
    };

    const prefs = loadPrefs();
    const quizBank = (config.quiz || []).map((item, index) => Object.assign({ id: `q${index + 1}` }, item));
    const drillBank = (config.drill.cards || []).map((item, index) => Object.assign({ id: `d${index + 1}` }, item));

    const state = {
        activeTab: "learn",
        drillStarted: false,
        quizStarted: false,
        prefs: Object.assign({
            best: { score: 0, total: quizBank.length, percent: 0 },
            lastWrongIds: []
        }, prefs),
        drill: {
            cards: [],
            index: 0,
            score: 0,
            missed: [],
            revealed: false
        },
        quiz: createQuiz(quizBank, "전체 문제")
    };

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
        Object.keys(panels).forEach((key) => {
            const active = key === name;
            panels[key].classList.toggle("hidden", !active);
            tabs[key].classList.toggle("active", active);
        });

        if (name === "drill" && !state.drillStarted) {
            state.drillStarted = true;
            startDrill(drillBank);
        }
        if (name === "quiz" && !state.quizStarted) {
            state.quizStarted = true;
            renderQuestion();
        }
        syncMultilangBlocks();
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

    function currentDrillCard() {
        return state.drill.cards[state.drill.index];
    }

    function renderDrillCard() {
        const card = currentDrillCard();
        const total = state.drill.cards.length || 1;
        const face = document.getElementById("drillFace");
        const actions = document.getElementById("drillActions");

        document.getElementById("drillProgress").textContent = `${state.drill.index + 1} / ${total}`;
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
            <p class="drill-front">${card.front}</p>
            ${card.sub ? `<p class="drill-sub">${card.sub}</p>` : ""}
            <p class="drill-sub">카드를 눌러 정답을 확인하세요.</p>
        `;
    }

    function revealDrillCard() {
        const card = currentDrillCard();
        if (!card || state.drill.revealed) return;

        state.drill.revealed = true;
        document.getElementById("drillFace").innerHTML = `
            <p class="drill-tag">정답</p>
            <p class="drill-back">${card.back}</p>
            <p class="drill-rule">${card.rule}</p>
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

    function showDrillResult() {
        const total = state.drill.cards.length || 1;
        const result = document.getElementById("drillResult");
        document.getElementById("drillBar").style.width = "100%";
        document.getElementById("drillActions").classList.add("hidden");
        document.getElementById("drillFace").innerHTML = `
            <p class="drill-tag">드릴 완료</p>
            <p class="drill-back">${state.drill.score} / ${total}</p>
            <p class="drill-sub">헷갈린 카드는 아래에서 다시 볼 수 있습니다.</p>
        `;

        const missed = state.drill.missed;
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
                        <p><strong>${card.front}</strong></p>
                        <p>정답: ${card.back}</p>
                        <p>${card.rule}</p>
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
            explainKo: q.explainKo
        });

        const feedback = document.getElementById("feedbackBox");
        feedback.className = `feedback ${ok ? "ok" : "bad"}`;
        feedback.innerHTML = `
            <strong>${ok ? "정답입니다." : "오답입니다."}</strong>
            <p>내 답: ${esc(user || "(무응답)")}</p>
            <p>정답: ${esc(correct)}</p>
            <p>${esc(q.explainKo)}</p>
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
        if (
            percent > best.percent ||
            (percent === best.percent && quiz.score > best.score)
        ) {
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

    tabs.learn.addEventListener("click", () => showTab("learn"));
    tabs.drill.addEventListener("click", () => showTab("drill"));
    tabs.quiz.addEventListener("click", () => showTab("quiz"));

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
})();
