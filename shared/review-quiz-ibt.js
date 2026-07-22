(function () {
    "use strict";

    const config = window.REVIEW_QUIZ_CONFIG;
    const root = document.getElementById("reviewQuizIbtRoot");
    if (!config || !root) return;

    const letters = ["A", "B", "C", "D"];
    const storageBase = config.ibtStorageKey || `snu3b.c${config.chapter || "x"}.reviewQuizIbt.v1`;
    const progressKey = `${storageBase}.progress`;
    const scoreLogKey = `${storageBase}.scoreLogs`;
    const recommendedMinutes = Number(config.recommendedMinutes || 25);
    const fixedSeed = new URLSearchParams(window.location.search).get("seed");
    const storageVersion = 1;
    const titleSuffix = Object.prototype.hasOwnProperty.call(config, "titleSuffix")
        ? String(config.titleSuffix || "")
        : " IBT";
    const questionIds = new Set((config.questions || []).map(function (question) { return question.id; }));

    let scoreLogs = [];
    let timerId = null;
    const state = {
        screen: "start",
        currentIndex: 0,
        answers: {},
        attempt: null,
        startedAt: Date.now(),
        result: null,
        reviewFilter: "wrong",
        notice: "",
        storageIssues: {},
        storageNotice: "",
        recoveryText: ""
    };

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, "&#96;");
    }

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[.,!?~'"`()[\]{}:;·ㆍ，。！？、]/g, "")
            .replace(/\s+/g, "");
    }

    function storageIssue(key, status, raw, message) {
        state.storageIssues[key] = {
            status: status,
            raw: typeof raw === "string" ? raw : "",
            message: message
        };
    }

    function clearStorageIssue(key) {
        delete state.storageIssues[key];
    }

    function readRawStorage(key) {
        try {
            const raw = window.localStorage.getItem(key);
            return { ok: true, raw: raw };
        } catch (error) {
            storageIssue(key, "unavailable", "", "이 브라우저에서 저장소를 읽을 수 없습니다.");
            return { ok: false, raw: null };
        }
    }

    function parseStoredJson(key) {
        const stored = readRawStorage(key);
        if (!stored.ok || stored.raw == null) {
            return { status: stored.ok ? "empty" : "unavailable", value: null, raw: stored.raw };
        }
        try {
            return { status: "parsed", value: JSON.parse(stored.raw), raw: stored.raw };
        } catch (error) {
            storageIssue(key, "corrupt", stored.raw, "저장 데이터가 손상되어 자동 저장을 멈췄습니다.");
            return { status: "corrupt", value: null, raw: stored.raw };
        }
    }

    function writeStorageRecord(key, value) {
        const issue = state.storageIssues[key];
        if (issue && (issue.status === "corrupt" || issue.status === "unsupported")) {
            state.storageNotice = "기존 저장 데이터를 보호하기 위해 자동 저장을 멈췄습니다.";
            return false;
        }
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            clearStorageIssue(key);
            state.storageNotice = "";
            return true;
        } catch (error) {
            storageIssue(key, "write-failed", "", "답은 메모리에 유지되지만 이 기기에 저장되지 않았습니다.");
            state.storageNotice = "저장하지 못했습니다. 현재 답은 이 화면에만 유지됩니다.";
            return false;
        }
    }

    function removeStorage(key) {
        try {
            window.localStorage.removeItem(key);
            clearStorageIssue(key);
            return true;
        } catch (error) {
            storageIssue(key, "unavailable", "", "저장 데이터를 지울 수 없습니다.");
            return false;
        }
    }

    function isFiniteNumber(value) {
        return typeof value === "number" && Number.isFinite(value);
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }

    function isValidScoreLog(log) {
        return isPlainObject(log)
            && (typeof log.seed === "string" || typeof log.seed === "number")
            && Number.isInteger(log.score)
            && Number.isInteger(log.total)
            && log.total === config.questions.length
            && log.score >= 0
            && log.score <= log.total
            && Number.isInteger(log.percent)
            && log.percent >= 0
            && log.percent <= 100
            && isFiniteNumber(log.completedAt)
            && typeof log.signature === "string";
    }

    function readScoreLogs() {
        const stored = parseStoredJson(scoreLogKey);
        if (stored.status === "empty" || stored.status === "unavailable" || stored.status === "corrupt") return [];

        let logs = null;
        if (Array.isArray(stored.value)) {
            logs = stored.value;
        } else if (isPlainObject(stored.value) && stored.value.version === storageVersion) {
            if (stored.value.quizId !== storageBase || !Array.isArray(stored.value.entries)) {
                storageIssue(scoreLogKey, "corrupt", stored.raw, "응시 기록 형식이 올바르지 않아 자동 저장을 멈췄습니다.");
                return [];
            }
            logs = stored.value.entries;
        } else if (isPlainObject(stored.value) && Object.prototype.hasOwnProperty.call(stored.value, "version")) {
            storageIssue(scoreLogKey, "unsupported", stored.raw, "지원하지 않는 버전의 응시 기록이 있어 자동 저장을 멈췄습니다.");
            return [];
        }

        if (!logs || !logs.every(isValidScoreLog)) {
            storageIssue(scoreLogKey, "corrupt", stored.raw, "응시 기록 형식이 올바르지 않아 자동 저장을 멈췄습니다.");
            return [];
        }
        clearStorageIssue(scoreLogKey);
        return logs.slice(-30);
    }

    function writeScoreLogs(logs) {
        const nextLogs = logs.slice(-30);
        if (writeStorageRecord(scoreLogKey, {
            version: storageVersion,
            quizId: storageBase,
            entries: nextLogs
        })) {
            scoreLogs = nextLogs;
        } else {
            scoreLogs = nextLogs;
        }
    }

    function hashSeed(seed) {
        const source = String(seed || "review-ibt");
        let hash = 2166136261;
        for (let i = 0; i < source.length; i += 1) {
            hash ^= source.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function createRng(seed) {
        let current = hashSeed(seed) || 1;
        return function next() {
            current ^= current << 13;
            current ^= current >>> 17;
            current ^= current << 5;
            return ((current >>> 0) / 4294967296);
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
        const copy = Object.assign({}, question, { number: index + 1 });
        if (question.type !== "mcq") return copy;

        const targetSlot = Number.isInteger(question.targetSlot) ? question.targetSlot : index % 4;
        const rng = createRng(`${seed}:${question.id}:${index}`);
        const distractors = shuffleWithRng(question.distractors || [], rng).slice(0, 3);
        const options = new Array(4);
        let distractorIndex = 0;

        for (let slot = 0; slot < 4; slot += 1) {
            const correct = slot === targetSlot;
            options[slot] = {
                letter: letters[slot],
                text: correct ? question.answer : distractors[distractorIndex],
                correct: correct
            };
            if (!correct) distractorIndex += 1;
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
        const source = attempt || state.attempt || buildAttempt("count");
        return source.questions.reduce(function (counts, question) {
            counts.total += 1;
            counts[question.type] = (counts[question.type] || 0) + 1;
            return counts;
        }, { total: 0, mcq: 0, short: 0, scaffold: 0 });
    }

    function sectionInfo(type) {
        if (type === "mcq") return "4지선다";
        if (type === "short") return "단답형";
        return "쓰기형";
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
            return {
                label: item.label || item.text,
                met: accepts.some(function (candidate) {
                    return normalized.includes(normalize(candidate));
                })
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
        const lengthOk = normalize(value).length >= (question.minNormalizedLength || 12);
        const ok = lengthOk && status.every(function (item) { return item.met; });
        return {
            ok: ok,
            correct: question.example,
            message: ok ? "필수 표현을 모두 사용했습니다." : "필수 표현과 문장 길이를 다시 확인하세요.",
            explanation: question.explanation || "",
            required: status
        };
    }

    function isAnswered(question, value) {
        if (question.type === "mcq") return Boolean(value);
        return normalize(value).length > 0;
    }

    function answerCount(answers) {
        const source = answers || state.answers;
        return state.attempt.questions.reduce(function (total, question) {
            return total + (isAnswered(question, source[question.id]) ? 1 : 0);
        }, 0);
    }

    function collectAnswers() {
        return Object.assign({}, state.answers);
    }

    function answerSignature(answers) {
        const normalizedAnswers = {};
        state.attempt.questions.forEach(function (question) {
            normalizedAnswers[question.id] = normalize(answers[question.id]);
        });
        return `${state.attempt.seed}:${JSON.stringify(normalizedAnswers)}`;
    }

    function validateAnswers(answers, attempt) {
        if (!isPlainObject(answers)) return false;
        const attemptById = new Map(attempt.questions.map(function (question) {
            return [question.id, question];
        }));
        return Object.keys(answers).every(function (id) {
            if (!questionIds.has(id) || !attemptById.has(id) || typeof answers[id] !== "string") return false;
            const question = attemptById.get(id);
            if (question.type !== "mcq" || answers[id] === "") return true;
            return [question.answer].concat(question.distractors || []).includes(answers[id]);
        });
    }

    function validateResult(result, attempt) {
        if (!isPlainObject(result)) return false;
        if (String(result.seed) !== String(attempt.seed)) return false;
        if (!Number.isInteger(result.score) || result.score < 0 || result.score > attempt.questions.length) return false;
        if (result.total !== attempt.questions.length) return false;
        if (!Number.isInteger(result.percent) || result.percent < 0 || result.percent > 100) return false;
        if (!validateAnswers(result.answers, attempt)) return false;
        if (!isFiniteNumber(result.completedAt) || !isFiniteNumber(result.elapsedMs)) return false;
        if (!Array.isArray(result.items) || result.items.length !== attempt.questions.length) return false;
        if (typeof result.signature !== "string") return false;
        return result.items.every(function (item, index) {
            return isPlainObject(item)
                && item.id === attempt.questions[index].id
                && item.number === index + 1
                && typeof item.ok === "boolean";
        });
    }

    function validateProgress(progress) {
        if (!isPlainObject(progress)) return null;
        if (typeof progress.seed !== "string" && typeof progress.seed !== "number") return null;
        const attempt = buildAttempt(progress.seed);
        if (progress.total !== attempt.questions.length) return null;
        if (!Number.isInteger(progress.currentIndex) || progress.currentIndex < 0 || progress.currentIndex >= progress.total) return null;
        if (!isFiniteNumber(progress.startedAt) || progress.startedAt <= 0) return null;
        if (progress.updatedAt != null && (!isFiniteNumber(progress.updatedAt) || progress.updatedAt <= 0)) return null;
        if (!validateAnswers(progress.answers, attempt)) return null;
        const computedAnswered = attempt.questions.reduce(function (total, question) {
            return total + (isAnswered(question, progress.answers[question.id]) ? 1 : 0);
        }, 0);
        if (!Number.isInteger(progress.answered) || progress.answered !== computedAnswered) return null;
        if (progress.completed != null && typeof progress.completed !== "boolean") return null;
        if (progress.lastResult != null && !validateResult(progress.lastResult, attempt)) return null;
        return progress;
    }

    function decodeProgress() {
        const stored = parseStoredJson(progressKey);
        if (stored.status === "empty" || stored.status === "unavailable" || stored.status === "corrupt") return null;

        let progress = null;
        if (isPlainObject(stored.value) && stored.value.version === storageVersion) {
            if (stored.value.quizId !== storageBase || !isPlainObject(stored.value.data)) {
                storageIssue(progressKey, "corrupt", stored.raw, "저장된 진행 형식이 올바르지 않아 자동 저장을 멈췄습니다.");
                return null;
            }
            progress = stored.value.data;
        } else if (isPlainObject(stored.value) && Object.prototype.hasOwnProperty.call(stored.value, "version")) {
            storageIssue(progressKey, "unsupported", stored.raw, "지원하지 않는 버전의 진행 데이터가 있어 자동 저장을 멈췄습니다.");
            return null;
        } else {
            progress = stored.value;
        }

        const valid = validateProgress(progress);
        if (!valid) {
            storageIssue(progressKey, "corrupt", stored.raw, "저장된 진행 형식이 올바르지 않아 자동 저장을 멈췄습니다.");
            return null;
        }
        clearStorageIssue(progressKey);
        return valid;
    }

    function saveProgress(extra) {
        const payload = Object.assign({
            seed: state.attempt.seed,
            answers: state.answers,
            currentIndex: state.currentIndex,
            startedAt: state.startedAt,
            updatedAt: Date.now(),
            answered: answerCount(),
            total: state.attempt.questions.length
        }, extra || {});
        writeStorageRecord(progressKey, {
            version: storageVersion,
            quizId: storageBase,
            data: payload
        });
    }

    function readProgress() {
        const progress = decodeProgress();
        if (!progress) return null;
        if (String(progress.seed) !== String(state.attempt.seed)) return null;
        return progress;
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

    function formatElapsed(ms) {
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    function currentQuestion() {
        return state.attempt.questions[state.currentIndex];
    }

    function correctText(question) {
        if (question.type === "mcq") return question.answer;
        if (question.type === "short") return (question.answers || [question.answer])[0];
        return question.example;
    }

    function selectedText(question, value) {
        if (!value) return "-";
        if (question.type !== "mcq") return value;
        const option = (question.options || []).find(function (item) {
            return item.text === value;
        });
        return option ? `${option.letter}. ${option.text}` : value;
    }

    function renderTopActions() {
        const links = Array.isArray(config.links) && config.links.length
            ? config.links
            : [
                { href: "index.html", label: `${config.chapter || "11"}과 목록` },
                { href: "review-quiz.html", label: "전체보기" }
            ];
        return `
            <div class="ibt-top-actions">
                ${links.map(function (link) {
                    return `<a class="ibt-link-button" href="${escapeAttr(link.href)}">${escapeHtml(link.label)}</a>`;
                }).join("")}
                <button class="ibt-button" type="button" data-action="reset-storage">저장 초기화</button>
            </div>
        `;
    }

    function renderStats() {
        const counts = getQuestionCounts();
        const typeStats = [
            ["mcq", "객관식"],
            ["short", "단답"],
            ["scaffold", "쓰기"]
        ].filter(function (item) { return counts[item[0]] > 0; });
        return `
            <div class="ibt-stats" aria-label="문항 구성">
                <span><strong>${counts.total}</strong>문항</span>
                ${typeStats.map(function (item) {
                    return `<span>${item[1]} <strong>${counts[item[0]]}</strong></span>`;
                }).join("")}
                <span>권장 <strong>${recommendedMinutes}분</strong></span>
            </div>
        `;
    }

    function storageRecoveryPayload() {
        const records = {};
        [progressKey, scoreLogKey].forEach(function (key) {
            const issue = state.storageIssues[key];
            if (issue && issue.raw) {
                records[key] = issue.raw;
                return;
            }
            const stored = readRawStorage(key);
            records[key] = stored.raw;
        });
        return JSON.stringify({ quizId: storageBase, records: records }, null, 2);
    }

    function renderStorageStatus() {
        const issues = Object.keys(state.storageIssues).map(function (key) {
            return state.storageIssues[key];
        });
        if (!issues.length && !state.storageNotice && !state.recoveryText) return "";
        const messages = Array.from(new Set(issues.map(function (issue) { return issue.message; }).filter(Boolean)));
        if (state.storageNotice && !messages.includes(state.storageNotice)) messages.push(state.storageNotice);
        return `
            <section class="ibt-storage-status" role="alert">
                <div>
                    <h2>저장 상태 확인</h2>
                    ${messages.map(function (message) { return `<p>${escapeHtml(message)}</p>`; }).join("")}
                </div>
                <div class="ibt-action-row">
                    <button class="ibt-button" type="button" data-action="copy-storage">저장 데이터 복사</button>
                    <button class="ibt-button" type="button" data-action="reset-storage">저장된 진행 초기화</button>
                </div>
                ${state.recoveryText ? `
                    <label class="ibt-recovery-label">
                        복사할 저장 데이터
                        <textarea class="ibt-recovery-text" readonly>${escapeHtml(state.recoveryText)}</textarea>
                    </label>
                ` : ""}
            </section>
        `;
    }

    function renderInlineStorageNotice() {
        const issueKey = Object.keys(state.storageIssues)[0];
        const issue = issueKey ? state.storageIssues[issueKey] : null;
        const message = state.storageNotice || (issue && issue.message);
        return message
            ? `<p class="ibt-storage-inline" role="status">${escapeHtml(message)} 처음 화면에서 복사하거나 초기화할 수 있습니다.</p>`
            : "";
    }

    function renderScoreLogs() {
        if (!scoreLogs.length) {
            return '<p class="ibt-empty">아직 완료 기록이 없습니다.</p>';
        }
        return `
            <ol class="ibt-score-list">
                ${scoreLogs.slice().reverse().map(function (log, index) {
                    const round = scoreLogs.length - index;
                    return `
                        <li>
                            <span>${round}회차</span>
                            <strong>${log.score}/${log.total}점</strong>
                            <em>${log.percent}% · ${escapeHtml(log.timeLabel || formatDateTime(log.completedAt))}</em>
                        </li>
                    `;
                }).join("")}
            </ol>
        `;
    }

    function renderStart() {
        stopTimer();
        const progress = readProgress();
        const canResume = progress && progress.answered > 0 && !progress.completed;
        const answered = progress ? progress.answered : 0;
        const hasImage = isPlainObject(config.image) && Boolean(config.image.src);
        const eyebrow = config.eyebrow || `TOPIK IBT Review · Lesson ${config.chapter}`;

        root.innerHTML = `
            <section class="ibt-hero ${hasImage ? "" : "ibt-hero--compact"}">
                <div class="ibt-hero-copy">
                    <p class="ibt-eyebrow">${escapeHtml(eyebrow)}</p>
                    <h1>${escapeHtml(config.title)}${escapeHtml(titleSuffix)}</h1>
                    <p>${escapeHtml(config.subtitle)}</p>
                    <div class="ibt-tags">
                        ${(config.tags || []).map(function (tag) {
                            return `<span>${escapeHtml(tag)}</span>`;
                        }).join("")}
                    </div>
                </div>
                ${hasImage ? `<figure class="ibt-hero-media">
                    <img src="${escapeAttr(config.image.src)}" alt="${escapeAttr(config.image.alt)}" width="${config.image.width || 640}" height="${config.image.height || 420}">
                </figure>` : ""}
            </section>

            ${renderStats()}

            <section class="ibt-start-panel">
                <div>
                    <h2>시험 화면으로 풀기</h2>
                    <p>한 화면에 한 문항씩 풀고, 마지막에 결과와 오답 복습을 확인합니다.</p>
                    ${canResume ? `<p class="ibt-resume-note">저장된 진행: ${answered}/${progress.total}문항</p>` : ""}
                </div>
                <div class="ibt-action-row">
                    ${canResume ? '<button id="resumeIbtButton" class="ibt-button ibt-button-primary" type="button" data-action="resume">이어 풀기</button>' : ""}
                    <button id="startIbtButton" class="ibt-button ibt-button-primary" type="button" data-action="start-new">${canResume ? "새 시도" : "시작"}</button>
                    <button class="ibt-button" type="button" data-action="show-results">최근 결과</button>
                </div>
            </section>

            <section class="ibt-log-panel">
                <div class="ibt-panel-head">
                    <h2>응시 기록</h2>
                    ${renderTopActions()}
                </div>
                ${renderScoreLogs()}
            </section>

            ${renderStorageStatus()}
            <p class="ibt-rights-note">${escapeHtml(config.rightsNote || "")}</p>
        `;
    }

    function renderDots() {
        return state.attempt.questions.map(function (question, index) {
            const answered = isAnswered(question, state.answers[question.id]);
            const active = index === state.currentIndex;
            return `
                <button
                    class="ibt-dot-button ${answered ? "is-answered" : ""} ${active ? "is-current" : ""}"
                    type="button"
                    data-action="goto"
                    data-index="${index}"
                    aria-label="${index + 1}번 문항"
                    aria-current="${active ? "step" : "false"}"
                >${index + 1}</button>
            `;
        }).join("");
    }

    function renderProgress() {
        const answered = answerCount();
        const total = state.attempt.questions.length;
        const percent = total ? Math.round((answered / total) * 100) : 0;
        return `
            <section class="ibt-progress-panel">
                <div class="ibt-progress-main">
                    <div class="ibt-progress-track" aria-hidden="true"><div class="ibt-progress-fill" style="width: ${percent}%"></div></div>
                    <div class="ibt-progress-meta">
                        <span id="ibtProgressText">${answered}/${total}문항 답함</span>
                        <span>경과 <strong id="ibtElapsed">${formatElapsed(Date.now() - state.startedAt)}</strong> · 권장 ${recommendedMinutes}분</span>
                    </div>
                </div>
                <div class="ibt-dot-strip" aria-label="문항 이동">
                    ${renderDots()}
                </div>
            </section>
        `;
    }

    function renderMeta(question) {
        return `
            <div class="ibt-question-meta">
                <span class="ibt-question-number">${String(question.number).padStart(2, "0")}</span>
                <span>${escapeHtml(question.area)}</span>
                <span>${escapeHtml(question.kind || sectionInfo(question.type))}</span>
                <span>${sectionInfo(question.type)}</span>
            </div>
        `;
    }

    function renderMcq(question) {
        const current = state.answers[question.id] || "";
        return `
            <div class="ibt-choice-grid" role="radiogroup" aria-label="${question.number}번 답 선택">
                ${question.options.map(function (option, index) {
                    const inputId = `${question.id}-${index}`;
                    const checked = current === option.text;
                    return `
                        <label class="ibt-choice ${checked ? "is-selected" : ""}">
                            <input id="${escapeAttr(inputId)}" type="radio" name="${escapeAttr(question.id)}" value="${escapeAttr(option.text)}" ${checked ? "checked" : ""}>
                            <span class="ibt-choice-letter">${option.letter}</span>
                            <span>${escapeHtml(option.text)}</span>
                        </label>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderShort(question) {
        const value = state.answers[question.id] || "";
        return `
            <input
                class="ibt-text-answer"
                type="text"
                autocomplete="off"
                value="${escapeAttr(value)}"
                placeholder="답을 입력하세요."
                aria-label="${question.number}번 답안"
            >
        `;
    }

    function renderRequired(question) {
        return (question.required || []).map(function (item) {
            return `<li>${escapeHtml(item.label || item.text)}</li>`;
        }).join("");
    }

    function renderScaffold(question) {
        const value = state.answers[question.id] || "";
        return `
            <div class="ibt-scaffold-box">
                <p>${escapeHtml(question.template)}</p>
                <ul aria-label="필수 표현">${renderRequired(question)}</ul>
            </div>
            <textarea
                class="ibt-scaffold-answer"
                aria-label="${question.number}번 답안"
                placeholder="${escapeAttr(question.placeholder || "답안을 쓰세요.")}"
            >${escapeHtml(value)}</textarea>
        `;
    }

    function renderQuestionInput(question) {
        if (question.type === "mcq") return renderMcq(question);
        if (question.type === "short") return renderShort(question);
        return renderScaffold(question);
    }

    function renderQuiz() {
        startTimer();
        const question = currentQuestion();
        root.innerHTML = `
            ${renderProgress()}
            ${renderInlineStorageNotice()}
            ${state.notice ? `<p class="ibt-notice" role="status">${escapeHtml(state.notice)}</p>` : ""}

            <section class="ibt-quiz-layout">
                <article class="ibt-question-card ${state.notice ? "is-shake" : ""}" data-ibt-question-card data-question-id="${escapeAttr(question.id)}" data-type="${escapeAttr(question.type)}">
                    ${renderMeta(question)}
                    <p class="ibt-question-prompt">${escapeHtml(question.prompt)}</p>
                    ${question.support ? `<p class="ibt-question-support">${escapeHtml(question.support)}</p>` : ""}
                    ${renderQuestionInput(question)}
                </article>

                <aside class="ibt-side-panel">
                    <h2>진행 도구</h2>
                    <p>답은 이 기기에 자동 저장됩니다.</p>
                    <div class="ibt-side-stats">
                        <span>시도 번호 <strong>${escapeHtml(state.attempt.seed)}</strong></span>
                        <span>현재 문항 <strong>${question.number}/${state.attempt.questions.length}</strong></span>
                    </div>
                    <div class="ibt-action-stack">
                        <button class="ibt-button" type="button" data-action="start">처음 화면</button>
                        <button class="ibt-button" type="button" data-action="start-new">새 시도</button>
                    </div>
                </aside>
            </section>

            <nav class="ibt-nav-bar" aria-label="문항 이동">
                <button class="ibt-button" type="button" data-action="prev" ${state.currentIndex === 0 ? "disabled" : ""}>이전</button>
                <button class="ibt-button ibt-button-primary" type="button" data-action="finish">채점하기</button>
                <button class="ibt-button" type="button" data-action="next">${state.currentIndex === state.attempt.questions.length - 1 ? "마침" : "다음"}</button>
            </nav>
        `;
        state.notice = "";
    }

    function resultForAnswers(answers) {
        let score = 0;
        const items = state.attempt.questions.map(function (question) {
            const value = answers[question.id] || "";
            const graded = gradeAnswer(question, value);
            if (graded.ok) score += 1;
            return {
                id: question.id,
                number: question.number,
                type: question.type,
                area: question.area,
                kind: question.kind,
                prompt: question.prompt,
                selected: value,
                correct: graded.correct,
                ok: graded.ok,
                explanation: graded.explanation,
                message: graded.message,
                required: graded.required || []
            };
        });
        const total = state.attempt.questions.length;
        const areaScores = Array.from(items.reduce(function (areas, item) {
            const key = item.area || "전체";
            const current = areas.get(key) || { area: key, score: 0, total: 0 };
            current.total += 1;
            if (item.ok) current.score += 1;
            areas.set(key, current);
            return areas;
        }, new Map()).values());
        return {
            seed: state.attempt.seed,
            score: score,
            total: total,
            percent: Math.round((score / total) * 100),
            answers: Object.assign({}, answers),
            completedAt: Date.now(),
            elapsedMs: Date.now() - state.startedAt,
            items: items,
            areaScores: areaScores,
            signature: answerSignature(answers)
        };
    }

    function saveResult(result) {
        if (!scoreLogs.some(function (log) { return log.signature === result.signature; })) {
            writeScoreLogs(scoreLogs.concat({
                seed: result.seed,
                score: result.score,
                total: result.total,
                percent: result.percent,
                completedAt: result.completedAt,
                timeLabel: formatDateTime(result.completedAt),
                elapsedMs: result.elapsedMs,
                signature: result.signature
            }));
        }
        saveProgress({ lastResult: result, completed: true });
    }

    function renderResultSummary(result) {
        const wrong = result.total - result.score;
        const areaScores = Array.isArray(result.areaScores) && result.areaScores.length
            ? result.areaScores
            : Array.from(result.items.reduce(function (areas, item) {
                const key = item.area || "전체";
                const current = areas.get(key) || { area: key, score: 0, total: 0 };
                current.total += 1;
                if (item.ok) current.score += 1;
                areas.set(key, current);
                return areas;
            }, new Map()).values());
        return `
            <section class="ibt-result-hero">
                <p class="ibt-eyebrow">Result</p>
                <h1>${result.score}/${result.total}점</h1>
                <div class="ibt-result-grid">
                    <div class="ibt-score-ring" style="--score-deg: ${Math.round(result.percent * 3.6)}deg"><span>${result.percent}%</span></div>
                    <div>
                        <p>정답 ${result.score}문항 · 오답 ${wrong}문항</p>
                        <p>소요 시간 ${formatElapsed(result.elapsedMs)} · ${formatDateTime(result.completedAt)}</p>
                        <div class="ibt-area-scores" aria-label="영역별 점수">
                            ${areaScores.map(function (area) {
                                return `<span>${escapeHtml(area.area)} <strong>${area.score}/${area.total}</strong></span>`;
                            }).join("")}
                        </div>
                    </div>
                </div>
                <div class="ibt-action-row">
                    <button class="ibt-button ibt-button-primary" type="button" data-action="start-new">다시 풀기</button>
                    <button class="ibt-button" type="button" data-action="resume">답안 보기</button>
                    <button class="ibt-button" type="button" data-action="start">처음 화면</button>
                </div>
            </section>
        `;
    }

    function renderReviewItem(item) {
        const question = state.attempt.questions[item.number - 1];
        return `
            <article class="ibt-review-item ${item.ok ? "is-correct" : "is-wrong"}">
                <div class="ibt-review-head">
                    <div>
                        <strong>${item.number}. ${escapeHtml(item.prompt)}</strong>
                        <div class="ibt-review-meta">
                            <span>${escapeHtml(item.area)}</span>
                            <span>${escapeHtml(item.kind || sectionInfo(item.type))}</span>
                        </div>
                    </div>
                    <span class="ibt-status-pill">${item.ok ? "정답" : "오답"}</span>
                </div>
                <div class="ibt-review-answer">
                    <p><b>내 답</b> ${escapeHtml(selectedText(question, item.selected))}</p>
                    <p><b>정답/예시</b> ${escapeHtml(correctText(question))}</p>
                    <p>${escapeHtml(item.explanation)}</p>
                </div>
                ${item.required && item.required.length ? `
                    <ul class="ibt-required-review">
                        ${item.required.map(function (required) {
                            return `<li class="${required.met ? "is-met" : "is-missing"}">${escapeHtml(required.label)}</li>`;
                        }).join("")}
                    </ul>
                ` : ""}
            </article>
        `;
    }

    function renderResult() {
        stopTimer();
        const result = state.result;
        if (!result) {
            renderStart();
            return;
        }
        const items = result.items.filter(function (item) {
            return state.reviewFilter === "all" || !item.ok;
        });

        root.innerHTML = `
            ${renderResultSummary(result)}
            ${renderInlineStorageNotice()}
            <section class="ibt-review-panel">
                <div class="ibt-panel-head">
                    <div>
                        <h2>복습</h2>
                        <p>${state.reviewFilter === "all" ? "전체 문항을 확인합니다." : "오답만 먼저 확인합니다."}</p>
                    </div>
                    <div class="ibt-segments" aria-label="복습 필터">
                        <button class="${state.reviewFilter === "wrong" ? "is-active" : ""}" type="button" data-action="filter" data-filter="wrong">오답</button>
                        <button class="${state.reviewFilter === "all" ? "is-active" : ""}" type="button" data-action="filter" data-filter="all">전체</button>
                    </div>
                </div>
                <div class="ibt-review-list">
                    ${items.length ? items.map(renderReviewItem).join("") : '<p class="ibt-empty">오답이 없습니다.</p>'}
                </div>
            </section>
        `;
    }

    function updateProgressChrome() {
        const answered = answerCount();
        const total = state.attempt.questions.length;
        const percent = total ? Math.round((answered / total) * 100) : 0;
        const text = document.getElementById("ibtProgressText");
        const fill = root.querySelector(".ibt-progress-fill");
        if (text) text.textContent = `${answered}/${total}문항 답함`;
        if (fill) fill.style.width = `${percent}%`;
        root.querySelectorAll(".ibt-dot-button").forEach(function (button) {
            const question = state.attempt.questions[Number(button.dataset.index)];
            button.classList.toggle("is-answered", isAnswered(question, state.answers[question.id]));
        });
    }

    function updateTimer() {
        const elapsed = document.getElementById("ibtElapsed");
        if (elapsed) elapsed.textContent = formatElapsed(Date.now() - state.startedAt);
    }

    function startTimer() {
        if (timerId) return;
        timerId = window.setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        if (!timerId) return;
        window.clearInterval(timerId);
        timerId = null;
    }

    function startNewAttempt(seed) {
        state.attempt = buildAttempt(seed || Date.now());
        state.answers = {};
        state.currentIndex = 0;
        state.startedAt = Date.now();
        state.result = null;
        state.reviewFilter = "wrong";
        state.notice = "";
        saveProgress({ completed: false, lastResult: null });
    }

    function openQuiz(resume) {
        const progress = resume ? readProgress() : null;
        if (progress) {
            state.answers = progress.answers || {};
            state.currentIndex = Math.min(Number(progress.currentIndex) || 0, state.attempt.questions.length - 1);
            state.startedAt = Number(progress.startedAt) || Date.now();
        } else if (!resume) {
            startNewAttempt(Date.now());
        }
        state.screen = "quiz";
        state.result = null;
        renderQuiz();
    }

    function goToQuestion(index) {
        if (index < 0 || index >= state.attempt.questions.length) return;
        state.currentIndex = index;
        saveProgress({ completed: false });
        state.screen = "quiz";
        renderQuiz();
    }

    function updateAnswer(questionId, value) {
        state.answers[questionId] = value;
        saveProgress({ completed: false });
        updateProgressChrome();
    }

    function finishAttempt() {
        const firstMissing = state.attempt.questions.findIndex(function (question) {
            return !isAnswered(question, state.answers[question.id]);
        });
        if (firstMissing >= 0) {
            state.currentIndex = firstMissing;
            state.notice = `${firstMissing + 1}번 문항에 답한 뒤 채점할 수 있습니다.`;
            renderQuiz();
            return;
        }

        const result = resultForAnswers(state.answers);
        state.result = result;
        state.screen = "result";
        state.reviewFilter = result.score === result.total ? "all" : "wrong";
        saveResult(result);
        renderResult();
    }

    function showLatestResult() {
        const progress = readProgress();
        if (progress && progress.lastResult) {
            state.result = progress.lastResult;
            state.screen = "result";
            state.reviewFilter = state.result.score === state.result.total ? "all" : "wrong";
            renderResult();
        }
    }

    function resetPageStorage(askForConfirmation) {
        if (askForConfirmation && !window.confirm("이 시험의 저장된 진행과 응시 기록을 초기화할까요?")) return false;
        const progressRemoved = removeStorage(progressKey);
        const logsRemoved = removeStorage(scoreLogKey);
        if (!progressRemoved || !logsRemoved) {
            state.storageNotice = "저장 데이터를 모두 초기화하지 못했습니다.";
            if (state.screen === "start") renderStart();
            return false;
        }
        scoreLogs = [];
        state.answers = {};
        state.currentIndex = 0;
        state.startedAt = Date.now();
        state.attempt = buildAttempt(fixedSeed || Date.now());
        state.result = null;
        state.reviewFilter = "wrong";
        state.notice = "";
        state.storageNotice = "이 시험의 저장 데이터를 초기화했습니다.";
        state.recoveryText = "";
        state.screen = "start";
        renderStart();
        return true;
    }

    function copyStorageRecovery() {
        const payload = storageRecoveryPayload();
        state.recoveryText = payload;
        state.storageNotice = "아래 저장 데이터를 선택해 복사할 수 있습니다.";
        renderStart();
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(payload).then(function () {
                state.storageNotice = "저장 데이터를 클립보드에 복사했습니다.";
                if (state.screen === "start") renderStart();
            }).catch(function () {
                // The visible recovery textarea remains available as a fallback.
            });
        }
    }

    function handleClick(event) {
        const control = event.target.closest("[data-action]");
        if (!control) return;

        const action = control.dataset.action;
        if (action === "start") {
            state.screen = "start";
            renderStart();
            return;
        }
        if (action === "start-new") {
            startNewAttempt(fixedSeed || Date.now());
            state.screen = "quiz";
            renderQuiz();
            return;
        }
        if (action === "resume") {
            openQuiz(true);
            return;
        }
        if (action === "show-results") {
            showLatestResult();
            return;
        }
        if (action === "copy-storage") {
            copyStorageRecovery();
            return;
        }
        if (action === "reset-storage") {
            resetPageStorage(true);
            return;
        }
        if (action === "goto") {
            goToQuestion(Number(control.dataset.index));
            return;
        }
        if (action === "prev") {
            goToQuestion(Math.max(0, state.currentIndex - 1));
            return;
        }
        if (action === "next") {
            if (state.currentIndex === state.attempt.questions.length - 1) {
                finishAttempt();
                return;
            }
            goToQuestion(state.currentIndex + 1);
            return;
        }
        if (action === "finish") {
            finishAttempt();
            return;
        }
        if (action === "filter") {
            state.reviewFilter = control.dataset.filter || "wrong";
            renderResult();
        }
    }

    function handleChange(event) {
        const card = event.target.closest("[data-ibt-question-card]");
        if (!card) return;
        const question = currentQuestion();
        if (question.type === "mcq" && event.target.matches("input[type='radio']")) {
            updateAnswer(question.id, event.target.value);
            renderQuiz();
        }
    }

    function handleInput(event) {
        const card = event.target.closest("[data-ibt-question-card]");
        if (!card) return;
        const question = currentQuestion();
        if (event.target.matches(".ibt-text-answer, .ibt-scaffold-answer")) {
            updateAnswer(question.id, event.target.value);
        }
    }

    function handleKeydown(event) {
        if (state.screen !== "quiz") return;
        if (event.target.matches("input, textarea")) return;
        if (event.key === "ArrowLeft") {
            goToQuestion(Math.max(0, state.currentIndex - 1));
        }
        if (event.key === "ArrowRight") {
            if (state.currentIndex < state.attempt.questions.length - 1) {
                goToQuestion(state.currentIndex + 1);
            }
        }
    }

    function init() {
        scoreLogs = readScoreLogs();
        const stored = decodeProgress();
        const seed = fixedSeed || (stored && stored.seed) || Date.now();
        state.attempt = buildAttempt(seed);
        state.startedAt = Date.now();

        const progress = stored && String(stored.seed) === String(state.attempt.seed) ? stored : null;
        if (progress) {
            state.answers = progress.answers || {};
            state.currentIndex = Math.min(Number(progress.currentIndex) || 0, state.attempt.questions.length - 1);
            state.startedAt = Number(progress.startedAt) || Date.now();
            state.result = progress.lastResult || null;
        }

        window.__reviewQuizIbt = {
            config: config,
            normalize: normalize,
            buildAttempt: buildAttempt,
            gradeAnswer: gradeAnswer,
            getQuestionCounts: getQuestionCounts,
            currentAttempt: function () { return state.attempt; },
            collectAnswers: collectAnswers,
            readProgress: function () { return decodeProgress(); },
            readScoreLogs: function () { return readScoreLogs(); },
            getStorageState: function () {
                return {
                    issues: Object.assign({}, state.storageIssues),
                    notice: state.storageNotice
                };
            },
            getStorageKeys: function () {
                return { progressKey: progressKey, scoreLogKey: scoreLogKey };
            },
            clearStorage: function () {
                return resetPageStorage(false);
            },
            setAnswers: function (answers) {
                state.answers = Object.assign({}, answers || {});
                saveProgress({ completed: false });
                if (state.screen === "quiz") renderQuiz();
            },
            finish: finishAttempt
        };

        renderStart();
    }

    root.addEventListener("click", handleClick);
    root.addEventListener("change", handleChange);
    root.addEventListener("input", handleInput);
    document.addEventListener("keydown", handleKeydown);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
}());
