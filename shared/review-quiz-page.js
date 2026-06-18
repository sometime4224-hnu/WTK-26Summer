(function () {
    "use strict";

    const config = window.REVIEW_QUIZ_CONFIG;
    if (!config) return;

    const letters = ["A", "B", "C", "D"];
    const storageBase = config.storageKey || `snu3b.c${config.chapter || "x"}.reviewQuiz.v1`;
    const progressKey = `${storageBase}.progress`;
    const scoreLogKey = `${storageBase}.scoreLogs`;
    let currentAttempt = null;
    let scoreLogs = [];
    let currentProgressMeta = {};

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[.,!?~'"`()[\]{}:;·ㆍ，。！？、]/g, "")
            .replace(/\s+/g, "");
    }

    function readJson(key, fallback) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Local storage can be unavailable in strict browser modes.
        }
    }

    function removeStorage(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            // Ignore storage failures; the quiz should still work in memory.
        }
    }

    function readScoreLogs() {
        const logs = readJson(scoreLogKey, []);
        return Array.isArray(logs) ? logs : [];
    }

    function writeScoreLogs(logs) {
        scoreLogs = logs.slice(-60);
        writeJson(scoreLogKey, scoreLogs);
    }

    function formatDateTime(timestamp) {
        try {
            return new Intl.DateTimeFormat("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }).format(new Date(timestamp));
        } catch (error) {
            return new Date(timestamp).toLocaleString();
        }
    }

    function hashSeed(seed) {
        const source = String(seed || "review");
        let hash = 2166136261;
        for (let i = 0; i < source.length; i += 1) {
            hash ^= source.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function createRng(seed) {
        let state = hashSeed(seed) || 1;
        return function next() {
            state ^= state << 13;
            state ^= state >>> 17;
            state ^= state << 5;
            return ((state >>> 0) / 4294967296);
        };
    }

    function shuffleWithRng(items, rng) {
        const copy = items.slice();
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(rng() * (i + 1));
            const temp = copy[i];
            copy[i] = copy[j];
            copy[j] = temp;
        }
        return copy;
    }

    function buildQuestion(question, index, seed) {
        const copy = Object.assign({}, question);
        copy.number = index + 1;

        if (question.type !== "mcq") {
            return copy;
        }

        const targetSlot = Number.isInteger(question.targetSlot) ? question.targetSlot : index % 4;
        const rng = createRng(`${seed}:${question.id}:${index}`);
        const distractors = shuffleWithRng(question.distractors || [], rng).slice(0, 3);
        const options = new Array(4);
        let distractorIndex = 0;

        for (let slot = 0; slot < 4; slot += 1) {
            const isCorrect = slot === targetSlot;
            options[slot] = {
                letter: letters[slot],
                text: isCorrect ? question.answer : distractors[distractorIndex],
                correct: isCorrect
            };
            if (!isCorrect) distractorIndex += 1;
        }

        copy.options = options;
        copy.correctLetter = letters[targetSlot];
        return copy;
    }

    function buildAttempt(seed) {
        const attemptSeed = String(seed || Date.now());
        return {
            seed: attemptSeed,
            questions: config.questions.map(function (question, index) {
                return buildQuestion(question, index, attemptSeed);
            })
        };
    }

    function getQuestionCounts(attempt) {
        const source = attempt || currentAttempt || buildAttempt("count");
        const counts = { total: source.questions.length, mcq: 0, short: 0, scaffold: 0 };
        source.questions.forEach(function (question) {
            counts[question.type] = (counts[question.type] || 0) + 1;
        });
        return counts;
    }

    function getAnswerSlotCounts(attempt) {
        const source = attempt || currentAttempt || buildAttempt("slots");
        return source.questions
            .filter(function (question) { return question.type === "mcq"; })
            .reduce(function (counts, question) {
                counts[question.correctLetter] = (counts[question.correctLetter] || 0) + 1;
                return counts;
            }, { A: 0, B: 0, C: 0, D: 0 });
    }

    function requiredStatus(question, value) {
        const normalized = normalize(value);
        return (question.required || []).map(function (item) {
            if (Array.isArray(item.allOf)) {
                return {
                    label: item.label || item.text,
                    met: item.allOf.every(function (candidate) {
                        return normalized.includes(normalize(candidate));
                    })
                };
            }
            const accepts = Array.isArray(item.accepts) ? item.accepts : [item.text || item.label];
            const met = accepts.some(function (candidate) {
                return normalized.includes(normalize(candidate));
            });
            return {
                label: item.label || item.text,
                met: met
            };
        });
    }

    function gradeAnswer(question, value) {
        if (question.type === "mcq") {
            const ok = value === question.answer;
            return {
                ok: ok,
                correct: question.answer,
                message: ok ? "정답입니다." : "오답입니다.",
                explanation: question.explanation || ""
            };
        }

        if (question.type === "short") {
            const normalized = normalize(value);
            const answers = question.answers || [question.answer];
            const ok = answers.some(function (answer) {
                return normalize(answer) === normalized;
            });
            return {
                ok: ok,
                correct: answers[0],
                message: ok ? "정답입니다." : "오답입니다.",
                explanation: question.explanation || ""
            };
        }

        const status = requiredStatus(question, value);
        const normalizedLength = normalize(value).length;
        const lengthOk = normalizedLength >= (question.minNormalizedLength || 12);
        const ok = lengthOk && status.every(function (item) { return item.met; });
        return {
            ok: ok,
            correct: question.example,
            message: ok ? "필수 표현을 모두 사용했습니다." : "필수 표현과 문장 길이를 다시 확인하세요.",
            explanation: question.explanation || "",
            required: status
        };
    }

    function sectionInfo(type) {
        if (type === "mcq") {
            return {
                title: "4지선다",
                desc: "보기는 시도마다 섞이고, 정답 위치는 A-D가 균등하게 배치됩니다."
            };
        }
        if (type === "short") {
            return {
                title: "단답형 주관식",
                desc: "띄어쓰기와 문장부호는 채점에서 크게 보지 않습니다."
            };
        }
        return {
            title: "비계형 주관식",
            desc: "제시된 틀과 필수 표현을 사용해 짧은 답안을 완성합니다."
        };
    }

    function renderMeta(question) {
        return `
            <div class="question-meta">
                <span class="q-number">${question.number}</span>
                <span class="area-chip">${escapeHtml(question.area)}</span>
                <span class="kind-chip">${escapeHtml(question.kind || sectionInfo(question.type).title)}</span>
            </div>
        `;
    }

    function renderMcq(question) {
        const options = question.options.map(function (option, index) {
            const inputId = `${question.id}-${index}`;
            return `
                <label class="choice" data-correct="${option.correct ? "true" : "false"}">
                    <input type="radio" id="${escapeHtml(inputId)}" name="${escapeHtml(question.id)}" value="${escapeHtml(option.text)}" data-option-index="${index}">
                    <span class="choice-letter">${option.letter}</span>
                    <span>${escapeHtml(option.text)}</span>
                </label>
            `;
        }).join("");

        return `
            <article class="question-card" data-question-id="${escapeHtml(question.id)}" data-type="mcq">
                ${renderMeta(question)}
                <p class="question-prompt">${escapeHtml(question.prompt)}</p>
                ${question.support ? `<p class="question-support">${escapeHtml(question.support)}</p>` : ""}
                <div class="choice-grid">${options}</div>
                <p class="feedback" aria-live="polite"></p>
            </article>
        `;
    }

    function renderShort(question) {
        return `
            <article class="question-card" data-question-id="${escapeHtml(question.id)}" data-type="short">
                ${renderMeta(question)}
                <p class="question-prompt">${escapeHtml(question.prompt)}</p>
                ${question.support ? `<p class="question-support">${escapeHtml(question.support)}</p>` : ""}
                <input class="text-answer" type="text" autocomplete="off" aria-label="${question.number}번 답안">
                <p class="feedback" aria-live="polite"></p>
            </article>
        `;
    }

    function renderRequired(question) {
        return (question.required || []).map(function (item) {
            return `<li data-required-label="${escapeHtml(item.label || item.text)}">${escapeHtml(item.label || item.text)}</li>`;
        }).join("");
    }

    function renderScaffold(question) {
        return `
            <article class="question-card" data-question-id="${escapeHtml(question.id)}" data-type="scaffold">
                ${renderMeta(question)}
                <p class="question-prompt">${escapeHtml(question.prompt)}</p>
                <div class="scaffold-box">
                    <p class="scaffold-template">${escapeHtml(question.template)}</p>
                    <ul class="required-list" aria-label="필수 표현">${renderRequired(question)}</ul>
                </div>
                <textarea class="scaffold-answer" aria-label="${question.number}번 답안" placeholder="${escapeHtml(question.placeholder || "답안을 쓰세요.")}"></textarea>
                <p class="feedback" aria-live="polite"></p>
            </article>
        `;
    }

    function renderQuestion(question) {
        if (question.type === "mcq") return renderMcq(question);
        if (question.type === "short") return renderShort(question);
        return renderScaffold(question);
    }

    function renderSections() {
        const order = ["mcq", "short", "scaffold"];
        return order.map(function (type) {
            const questions = currentAttempt.questions.filter(function (question) {
                return question.type === type;
            });
            const info = sectionInfo(type);
            return `
                <section class="quiz-section" data-section="${type}">
                    <div class="section-head">
                        <div>
                            <h2>${info.title}</h2>
                            <p>${info.desc}</p>
                        </div>
                        <span class="summary-chip"><strong>${questions.length}</strong>문항</span>
                    </div>
                    <div class="question-list">
                        ${questions.map(renderQuestion).join("")}
                    </div>
                </section>
            `;
        }).join("");
    }

    function renderAnswerKey() {
        const items = currentAttempt.questions.map(function (question) {
            const answer = question.type === "mcq"
                ? `${question.correctLetter}. ${question.answer}`
                : (question.type === "short" ? (question.answers || [question.answer])[0] : question.example);
            return `<div>${question.number}. ${escapeHtml(answer)}</div>`;
        }).join("");

        return `
            <details class="answer-key">
                <summary>정답과 예시 답안</summary>
                <div class="answer-key-grid">${items}</div>
            </details>
        `;
    }

    function renderScoreLogItems() {
        if (!scoreLogs.length) {
            return '<li class="score-log-empty">아직 완료 기록이 없습니다.</li>';
        }
        return scoreLogs.slice().reverse().map(function (log, index, reversed) {
            const round = scoreLogs.length - index;
            return `
                <li class="score-log-item">
                    <span>${round}회차</span>
                    <strong>${log.score} / ${log.total}점</strong>
                    <em>${log.percent}% · ${escapeHtml(log.timeLabel || formatDateTime(log.completedAt))}</em>
                </li>
            `;
        }).join("");
    }

    function renderScoreLogPanel() {
        return `
            <section class="score-log-panel" aria-labelledby="scoreLogTitle">
                <div class="score-log-head">
                    <div>
                        <h2 id="scoreLogTitle">점수 기록</h2>
                        <p>모든 문항을 푼 뒤 채점하면 회차별 점수가 저장됩니다.</p>
                    </div>
                    <button id="clearScoreLogsButton" class="review-button" type="button">기록 지우기</button>
                </div>
                <ol id="scoreLogList" class="score-log-list">
                    ${renderScoreLogItems()}
                </ol>
            </section>
        `;
    }

    function renderPage() {
        const counts = getQuestionCounts(currentAttempt);
        const slots = getAnswerSlotCounts(currentAttempt);
        const root = document.getElementById("reviewQuizRoot");
        root.innerHTML = `
            <div id="completionStamp" class="completion-stamp"${scoreLogs.length ? "" : " hidden"} aria-label="잘했어요 도장">
                <span>잘했어요</span>
                <b>완료</b>
            </div>

            <header class="review-header">
                <div>
                    <p class="review-eyebrow">${escapeHtml(config.eyebrow || "Workbook Review")}</p>
                    <h1>${escapeHtml(config.title)}</h1>
                    <p class="review-lead">${escapeHtml(config.subtitle)}</p>
                    <div class="review-tags">
                        ${(config.tags || []).map(function (tag) {
                            return `<span class="review-tag">${escapeHtml(tag)}</span>`;
                        }).join("")}
                    </div>
                </div>
                <figure class="review-media">
                    <img src="${escapeHtml(config.image.src)}" alt="${escapeHtml(config.image.alt)}" width="${config.image.width || 640}" height="${config.image.height || 420}" decoding="async" fetchpriority="high">
                </figure>
            </header>

            <div class="review-summary" aria-label="문항 구성">
                <span class="summary-chip"><strong>${counts.total}</strong>문항</span>
                <span class="summary-chip">객관식 <strong>${counts.mcq}</strong></span>
                <span class="summary-chip">단답형 <strong>${counts.short}</strong></span>
                <span class="summary-chip">비계형 <strong>${counts.scaffold}</strong></span>
                <span class="summary-chip">정답 위치 A/B/C/D <strong>${slots.A}/${slots.B}/${slots.C}/${slots.D}</strong></span>
                <span class="summary-chip" id="progressStatus">진행 <strong>0/${counts.total}</strong></span>
            </div>

            <div class="review-toolbar" aria-label="채점 도구">
                <div class="score-stack">
                    <div id="scoreMain" class="score-main">아직 채점하지 않았습니다.</div>
                    <div id="scoreSub" class="score-sub">시도 번호 ${escapeHtml(currentAttempt.seed)}</div>
                </div>
                <div class="review-actions">
                    <button id="checkAllButton" class="review-button primary" type="button">정답 확인</button>
                    <button id="resetButton" class="review-button" type="button">입력 지우기</button>
                    <button id="newAttemptButton" class="review-button" type="button">새 시도</button>
                    <button id="printButton" class="review-button" type="button">인쇄</button>
                </div>
            </div>

            <form id="reviewQuizForm" autocomplete="off">
                ${renderSections()}
            </form>

            ${renderScoreLogPanel()}
            ${renderAnswerKey()}
            <p class="rights-note">${escapeHtml(config.rightsNote || "워크북 학습 목표를 바탕으로 새로 구성한 보조 문제입니다.")}</p>
        `;

        bindEvents();
    }

    function questionById(id) {
        return currentAttempt.questions.find(function (question) {
            return question.id === id;
        });
    }

    function isAnswered(question, value) {
        if (question.type === "mcq") return Boolean(value);
        return normalize(value).length > 0;
    }

    function answerCount(answers) {
        return currentAttempt.questions.reduce(function (count, question) {
            return count + (isAnswered(question, answers[question.id]) ? 1 : 0);
        }, 0);
    }

    function collectAnswers() {
        const answers = {};
        document.querySelectorAll(".question-card").forEach(function (card) {
            const question = questionById(card.dataset.questionId);
            answers[question.id] = valueForCard(card, question);
        });
        return answers;
    }

    function answerSignature(answers) {
        const normalizedAnswers = {};
        currentAttempt.questions.forEach(function (question) {
            normalizedAnswers[question.id] = normalize(answers[question.id]);
        });
        return `${currentAttempt.seed}:${JSON.stringify(normalizedAnswers)}`;
    }

    function saveProgress(extra) {
        const answers = collectAnswers();
        currentProgressMeta = Object.assign({}, currentProgressMeta, extra || {});
        writeJson(progressKey, {
            seed: currentAttempt.seed,
            answers: answers,
            answered: answerCount(answers),
            total: currentAttempt.questions.length,
            updatedAt: Date.now(),
            checked: Boolean(currentProgressMeta.checked),
            lastScore: currentProgressMeta.lastScore || null,
            loggedSignature: currentProgressMeta.loggedSignature || ""
        });
        updateProgressStatus(answers);
    }

    function readProgress() {
        const progress = readJson(progressKey, null);
        if (!progress || typeof progress !== "object") return null;
        if (String(progress.seed) !== String(currentAttempt.seed)) return null;
        return progress;
    }

    function restoreAnswers(answers) {
        if (!answers) return;
        document.querySelectorAll(".question-card").forEach(function (card) {
            const question = questionById(card.dataset.questionId);
            const value = answers[question.id] || "";
            if (question.type === "mcq") {
                const input = Array.from(card.querySelectorAll("input[type='radio']")).find(function (control) {
                    return control.value === value;
                });
                if (input) input.checked = true;
                return;
            }
            const field = question.type === "short"
                ? card.querySelector(".text-answer")
                : card.querySelector(".scaffold-answer");
            if (field) field.value = value;
        });
    }

    function updateProgressStatus(answers) {
        const status = document.getElementById("progressStatus");
        if (!status) return;
        const source = answers || collectAnswers();
        const answered = answerCount(source);
        status.innerHTML = `진행 <strong>${answered}/${currentAttempt.questions.length}</strong>`;
    }

    function updateScoreLogUi() {
        const list = document.getElementById("scoreLogList");
        if (list) list.innerHTML = renderScoreLogItems();
        const stamp = document.getElementById("completionStamp");
        if (stamp) stamp.hidden = scoreLogs.length === 0;
    }

    function valueForCard(card, question) {
        if (question.type === "mcq") {
            const selected = card.querySelector("input[type='radio']:checked");
            return selected ? selected.value : "";
        }
        if (question.type === "short") {
            const input = card.querySelector(".text-answer");
            return input ? input.value : "";
        }
        const textarea = card.querySelector(".scaffold-answer");
        return textarea ? textarea.value : "";
    }

    function applyFeedback(card, question, result) {
        const feedback = card.querySelector(".feedback");
        card.classList.toggle("is-correct", result.ok);
        card.classList.toggle("is-wrong", !result.ok);
        feedback.className = `feedback ${result.ok ? "ok" : "bad"}`;

        if (question.type === "scaffold") {
            const requiredItems = card.querySelectorAll(".required-list li");
            (result.required || []).forEach(function (status, index) {
                const item = requiredItems[index];
                if (!item) return;
                item.classList.toggle("is-met", status.met);
                item.classList.toggle("is-missing", !status.met);
            });
        }

        const correctLine = result.correct ? ` 정답/예시: ${result.correct}` : "";
        const explainLine = result.explanation ? ` ${result.explanation}` : "";
        feedback.textContent = `${result.message}${correctLine}${explainLine}`;
    }

    function clearFeedbackState() {
        document.querySelectorAll(".question-card").forEach(function (card) {
            card.classList.remove("is-correct", "is-wrong");
        });
        document.querySelectorAll(".required-list li").forEach(function (item) {
            item.classList.remove("is-met", "is-missing");
        });
        document.querySelectorAll(".feedback").forEach(function (feedback) {
            feedback.className = "feedback";
            feedback.textContent = "";
        });
        document.body.classList.remove("checked");
        document.getElementById("scoreMain").textContent = "아직 채점하지 않았습니다.";
        document.getElementById("scoreSub").textContent = "진행 상황이 저장되었습니다.";
    }

    function addScoreLog(score, total, answers) {
        const signature = answerSignature(answers);
        if (currentProgressMeta.loggedSignature === signature) {
            return false;
        }
        if (scoreLogs.some(function (log) { return log.signature === signature; })) {
            currentProgressMeta.loggedSignature = signature;
            return false;
        }

        const completedAt = Date.now();
        const percent = Math.round((score / total) * 100);
        const log = {
            id: `${completedAt}-${scoreLogs.length + 1}`,
            seed: currentAttempt.seed,
            score: score,
            total: total,
            percent: percent,
            completedAt: completedAt,
            timeLabel: formatDateTime(completedAt),
            signature: signature
        };

        writeScoreLogs(scoreLogs.concat(log));
        currentProgressMeta.loggedSignature = signature;
        updateScoreLogUi();
        return true;
    }

    function checkAll(options) {
        const settings = Object.assign({ logCompletion: true, save: true }, options || {});
        const cards = Array.from(document.querySelectorAll(".question-card"));
        const answers = collectAnswers();
        const answered = answerCount(answers);
        const isComplete = answered === cards.length;
        let correct = 0;
        cards.forEach(function (card) {
            const question = questionById(card.dataset.questionId);
            const result = gradeAnswer(question, answers[question.id]);
            if (result.ok) correct += 1;
            applyFeedback(card, question, result);
        });
        document.body.classList.add("checked");
        document.getElementById("scoreMain").textContent = `${correct} / ${cards.length}점`;
        let subText = correct === cards.length
            ? "모든 문항을 맞혔습니다."
            : "오답은 해설과 예시 답안을 확인하세요.";

        let logged = false;
        if (settings.logCompletion && isComplete) {
            logged = addScoreLog(correct, cards.length, answers);
            subText = logged ? "완료 회차 점수를 저장했습니다." : "이미 저장된 완료 회차입니다.";
        } else if (settings.logCompletion && !isComplete) {
            subText = `진행 ${answered}/${cards.length}: 모든 문항을 풀면 점수 기록이 저장됩니다.`;
        }

        document.getElementById("scoreSub").textContent = subText;
        if (settings.save) {
            saveProgress({
                checked: true,
                lastScore: {
                    score: correct,
                    total: cards.length,
                    answered: answered,
                    complete: isComplete
                },
                loggedSignature: currentProgressMeta.loggedSignature || ""
            });
        }
    }

    function clearInputs() {
        document.querySelectorAll("input[type='radio']").forEach(function (input) {
            input.checked = false;
        });
        document.querySelectorAll(".text-answer, .scaffold-answer").forEach(function (input) {
            input.value = "";
        });
        clearFeedbackState();
        document.getElementById("scoreSub").textContent = `시도 번호 ${currentAttempt.seed}`;
        currentProgressMeta.checked = false;
        saveProgress({ checked: false, lastScore: null });
    }

    function newAttempt() {
        currentAttempt = buildAttempt(Date.now());
        currentProgressMeta = {};
        document.body.classList.remove("checked");
        renderPage();
        saveProgress({ checked: false, lastScore: null, loggedSignature: "" });
    }

    function bindEvents() {
        document.getElementById("checkAllButton").addEventListener("click", checkAll);
        document.getElementById("resetButton").addEventListener("click", clearInputs);
        document.getElementById("newAttemptButton").addEventListener("click", newAttempt);
        document.getElementById("printButton").addEventListener("click", function () {
            window.print();
        });
        document.getElementById("clearScoreLogsButton").addEventListener("click", function () {
            writeScoreLogs([]);
            currentProgressMeta.loggedSignature = "";
            saveProgress({ loggedSignature: "" });
            updateScoreLogUi();
        });

        const form = document.getElementById("reviewQuizForm");
        const handleProgressInput = function () {
            if (document.body.classList.contains("checked")) {
                clearFeedbackState();
            }
            saveProgress({ checked: false });
        };
        form.addEventListener("input", handleProgressInput);
        form.addEventListener("change", handleProgressInput);
    }

    function init() {
        const urlSeed = new URLSearchParams(window.location.search).get("seed");
        scoreLogs = readScoreLogs();
        const storedAnySeed = readJson(progressKey, null);
        const seed = urlSeed || (storedAnySeed && storedAnySeed.seed) || Date.now();
        currentAttempt = buildAttempt(seed);
        window.__reviewQuiz = {
            config: config,
            normalize: normalize,
            buildAttempt: buildAttempt,
            gradeAnswer: gradeAnswer,
            getQuestionCounts: getQuestionCounts,
            getAnswerSlotCounts: getAnswerSlotCounts,
            currentAttempt: function () { return currentAttempt; },
            checkAll: checkAll,
            collectAnswers: collectAnswers,
            readProgress: function () { return readJson(progressKey, null); },
            readScoreLogs: function () { return readScoreLogs(); },
            getStorageKeys: function () {
                return { progressKey: progressKey, scoreLogKey: scoreLogKey };
            },
            clearStorage: function () {
                removeStorage(progressKey);
                removeStorage(scoreLogKey);
                scoreLogs = [];
                currentProgressMeta = {};
                updateScoreLogUi();
            }
        };
        renderPage();
        const progress = readProgress();
        if (progress) {
            currentProgressMeta = {
                checked: Boolean(progress.checked),
                lastScore: progress.lastScore || null,
                loggedSignature: progress.loggedSignature || ""
            };
            restoreAnswers(progress.answers);
            updateProgressStatus(progress.answers);
            if (progress.checked) {
                checkAll({ logCompletion: false, save: false });
            }
        } else {
            saveProgress({ checked: false, lastScore: null, loggedSignature: "" });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
