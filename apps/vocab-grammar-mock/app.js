const ROUND_LINKS = [
    { id: "1", href: "./round1.html", label: "1회차", enabled: true },
    { id: "2", href: "./round2.html", label: "2회차", enabled: true },
    { id: "1-ibt", href: "./round1-ibt.html", label: "1회차 IBT 형식", enabled: true, sourceRoundId: "1", experimental: true },
    { id: "2-ibt", href: "./round2-ibt.html", label: "2회차 IBT 형식", enabled: true, sourceRoundId: "2", experimental: true },
    { id: "3", href: "./round3.html", label: "3회차", enabled: false },
    { id: "4", href: "./round4.html", label: "4회차", enabled: false },
    { id: "marathon30", href: "./marathon30.html", label: "30문제 마라톤", enabled: false }
];

const STORAGE_NAMESPACE = "vocab-grammar-mock";
const LEGACY_STORAGE_NAMESPACE = "private-listening-review";
const ATTEMPT_VERSION = 1;
const OPTION_LETTERS = ["A", "B", "C", "D"];
const IBT_DISPLAY_LETTERS = ["①", "②", "③", "④"];
const DEFAULT_HOMEWORK_STUDENT_NAME_KEY = "vocab-grammar-mock-homework-name";
let ibtClockTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    renderLandingIndex();
    renderRoundNav();

    const pageSource = document.body.dataset.quizSource;
    const roundId = document.body.dataset.roundId;
    const sourceRoundId = document.body.dataset.sourceRoundId || getRoundSourceId(roundId);
    if (!pageSource && !roundId) return;

    initializeQuiz(pageSource, roundId, sourceRoundId).catch((error) => {
        const errorCard = document.getElementById("loadError");
        if (!errorCard) return;
        errorCard.hidden = false;
        errorCard.textContent = `퀴즈를 불러오지 못했습니다. ${error.message}`;
    });
});

async function initializeQuiz(sourcePath, roundId, sourceRoundId = roundId) {
    const markdown = await loadQuizMarkdown(sourcePath, sourceRoundId);
    const quiz = parseQuizMarkdown(markdown);
    validateQuiz(quiz);

    const storageKey = getRoundStorageKey(roundId);
    const savedSelections = readStoredSelections(storageKey);
    quiz.attempt = getOrCreateAttemptState(roundId, quiz, savedSelections);
    quiz.roundId = roundId;
    quiz.sourceRoundId = sourceRoundId;
    quiz.homework = getHomeworkAssignment(roundId);

    window.renderQuiz(quiz);
    window.wireQuizInteractions(quiz);
}

async function loadQuizMarkdown(sourcePath, roundId) {
    const embeddedMarkdown = window.PRIVATE_QUIZ_MARKDOWN?.[roundId];
    const canFetchFirst = sourcePath && window.location.protocol !== "file:";

    if (canFetchFirst) {
        try {
            const response = await fetch(sourcePath, { cache: "no-store" });
            if (response.ok) return response.text();
        } catch {
            // Fall through to the embedded copy so direct file use still works.
        }
    }

    if (typeof embeddedMarkdown === "string" && embeddedMarkdown.trim()) {
        return embeddedMarkdown;
    }

    if (!sourcePath) {
        throw new Error("내장 퀴즈 데이터가 없고 불러올 원본 경로도 없습니다.");
    }

    const response = await fetch(sourcePath, { cache: "no-store" });
    if (!response.ok) {
        throw new Error(`문서 응답 코드 ${response.status}`);
    }

    return response.text();
}

function parseQuizMarkdown(markdown) {
    const normalized = markdown.replace(/\r\n/g, "\n");
    const answerIndex = normalized.search(/^##\s+정답 및 짧은 해설\s*$/m);
    const questionPart = answerIndex === -1
        ? normalized.trim()
        : normalized.slice(0, answerIndex).trim();
    const tailPart = answerIndex === -1
        ? ""
        : normalized.slice(answerIndex).trim();

    const titleMatch = questionPart.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "복습 퀴즈";

    const introMatch = questionPart.match(/^#\s+.+?\n+([\s\S]*?)(?=\n##\s)/);
    const introRaw = introMatch ? introMatch[1].trim() : "";

    return {
        title,
        introHtml: renderMarkdownish(introRaw),
        sections: getHeadingBlocks(questionPart, 2)
            .filter((section) => section.title !== "정답 및 짧은 해설")
            .map((section) => parseSection(section.title, section.body)),
        answers: parseAnswers(tailPart),
        focusItems: parseFocusItems(tailPart),
        attempt: null
    };
}

function parseSection(title, body) {
    return {
        title,
        items: getHeadingBlocks(body, 3).map((block) => {
            const heading = block.title;
            const content = block.body;

            if (/^\d+\s*-\s*\d+$/.test(heading)) {
                return { type: "shared", range: heading, contentHtml: renderMarkdownish(content) };
            }

            if (/^\d+$/.test(heading)) {
                return parseQuestion(Number(heading), content);
            }

            return { type: "note", title: heading, contentHtml: renderMarkdownish(content) };
        })
    };
}

function parseQuestion(number, rawContent) {
    const lines = rawContent.split("\n");
    const stemLines = [];
    const optionLines = [];

    for (const line of lines) {
        const trimmed = line.trimEnd();
        if (/^[A-D]\.\s+/.test(trimmed)) {
            optionLines.push(trimmed);
        } else {
            stemLines.push(line);
        }
    }

    return {
        type: "question",
        number,
        stemHtml: renderMarkdownish(stemLines.join("\n").trim()),
        options: optionLines.map((line) => {
            const match = line.match(/^([A-D])\.\s+([\s\S]+)$/);
            return { letter: match[1], text: match[2].trim() };
        })
    };
}

function parseAnswers(rawTail) {
    const tailSections = getHeadingBlocks(rawTail, 2);
    const answerSection = tailSections.find((section) => section.title.includes("정답"));
    const answerMap = new Map();
    if (!answerSection) return answerMap;

    for (const line of answerSection.body.split("\n")) {
        const trimmed = line.trim();
        const match = trimmed.match(/^(\d+)\.\s+`?([A-D])`?\s*-\s+([\s\S]+)$/);
        if (!match) continue;
        answerMap.set(Number(match[1]), {
            correct: match[2],
            explanation: match[3].trim()
        });
    }

    return answerMap;
}

function parseFocusItems(rawTail) {
    const tailSections = getHeadingBlocks(rawTail, 2);
    const focusSection = tailSections.find((section) => section.title.includes("핵심"));
    if (!focusSection) return [];

    return focusSection.body
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim());
}

function isIbtMode() {
    return document.body.dataset.quizMode === "ibt";
}

function renderIbtQuiz(quiz) {
    const root = document.getElementById("ibtExamRoot");
    if (!root) return;

    const questionNumbers = getQuestionNumbers(quiz.sections);
    const questionCount = questionNumbers.length;
    const savedName = getHomeworkStudentName();

    root.innerHTML = `
        <header class="ibt-exam-header">
            <div class="ibt-exam-header__cell">
                <span>수험번호</span>
                <strong>${escapeHtml(buildIbtCandidateNumber(quiz.roundId))}</strong>
            </div>
            <div class="ibt-exam-header__title">
                <strong>한국어능력시험(TOPIK) IBT 체험</strong>
                <span>${escapeHtml(getRoundLabel(quiz.roundId))}</span>
            </div>
            <div class="ibt-exam-header__cell ibt-exam-header__clock">
                <span>현재시간</span>
                <strong id="ibtCurrentTime">--:--:--</strong>
            </div>
        </header>

        <section class="ibt-title-box">
            <div>
                <h1>${escapeHtml(quiz.title)}</h1>
                <p>TOPIK IBT 방식으로 한 문항씩 풀고 마지막에 답안을 확인합니다.</p>
            </div>
            <div class="ibt-language" aria-label="언어 선택">
                <span class="is-active">한국어</span>
                <span aria-disabled="true">English</span>
            </div>
        </section>

        ${quiz.homework ? renderIbtIdentityPanel(quiz, savedName) : ""}

        <section class="ibt-exam-stage" aria-label="IBT 시험 화면">
            <section class="ibt-progress-panel">
                <div class="ibt-progress-main">
                    <div class="progress-track" aria-hidden="true"><div id="progressFill" class="progress-fill"></div></div>
                    <div class="ibt-progress-meta">
                        <span id="progressText">0 / ${questionCount}</span>
                        <span id="quizMeta">총 ${questionCount}문항</span>
                        <span id="scoreText">아직 ${questionCount}문항이 남았습니다.</span>
                    </div>
                </div>
                <div class="ibt-tool-actions">
                    <button class="action-button" type="button" data-ibt-action="open-questions">전체 문제</button>
                    <button class="action-button action-button--primary" type="button" data-ibt-action="open-submit">답안 제출로 이동</button>
                    <button id="resetButton" data-action="reset" class="action-button" type="button">다시</button>
                </div>
            </section>

            <div id="quizSections" class="section-stack ibt-section-stack"></div>
        </section>

        <footer class="ibt-footer" aria-label="문항 이동">
            <div class="ibt-footer__side">
                <button class="ibt-nav-button" type="button" data-ibt-action="prev">
                    <span aria-hidden="true">‹</span>
                    <span>이전</span>
                </button>
            </div>
            <div class="ibt-footer__center">
                <span id="ibtFooterStatus">현재 문항 1/${questionCount}</span>
            </div>
            <div class="ibt-footer__side ibt-footer__side--right">
                <button class="ibt-nav-button ibt-nav-button--primary" type="button" data-ibt-action="next">
                    <span>다음</span>
                    <span aria-hidden="true">›</span>
                </button>
            </div>
        </footer>

        ${renderIbtModalShells()}
    `;

    const sectionsRoot = document.getElementById("quizSections");
    if (!sectionsRoot) return;
    ensureQuestionPalette(sectionsRoot, questionNumbers);
    sectionsRoot.innerHTML = buildIbtQuestionEntries(quiz).map((entry) => renderIbtQuestionEntry(entry, quiz.answers, quiz.attempt)).join("");
    applyIbtStartedState(quiz);
    setIbtCurrentQuestion(readIbtCurrentIndex(quiz.roundId, questionCount), { save: false });
    updateIbtClock();
    startIbtClock();
}

function renderIbtIdentityPanel(quiz, savedName) {
    return `
        <section id="homeworkPanel" class="homework-panel ibt-identity-card ${savedName ? "" : "is-name-missing"}">
            <div class="ibt-identity-card__seat">
                <span>좌석</span>
                <strong>1</strong>
            </div>
            <div class="homework-panel__text">
                <span class="homework-panel__badge">본인확인</span>
                <h2>수험자 이름을 확인하세요</h2>
                <p>${escapeHtml(quiz.homework.roundLabel)} 답안은 별도 IBT 형식 기록으로 제출됩니다.</p>
            </div>
            <label class="student-name-field" for="studentNameInput">
                <span>성명</span>
                <input id="studentNameInput" type="text" maxlength="40" autocomplete="name" value="${escapeHtml(savedName)}" placeholder="여기에 이름 입력">
            </label>
            <p id="homeworkStatus" class="homework-status ${savedName ? "is-idle" : "is-pending"}">
                ${savedName ? "이름이 저장되었습니다. 다음 버튼을 눌러 시험 화면으로 이동하세요." : "이름을 입력한 뒤 다음 버튼을 눌러 주세요."}
            </p>
            <div class="ibt-identity-card__actions">
                <button id="ibtStartButton" class="action-button action-button--primary" type="button" data-ibt-action="start-exam" ${savedName ? "" : "disabled"}>다음</button>
            </div>
        </section>
    `;
}

function renderIbtModalShells() {
    return `
        <div id="ibtQuestionModal" class="ibt-modal" hidden>
            <div class="ibt-modal__backdrop" data-ibt-action="close-modal"></div>
            <section class="ibt-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="ibtQuestionModalTitle">
                <div class="ibt-modal__head">
                    <h2 id="ibtQuestionModalTitle">전체 문제</h2>
                    <button class="summary-modal__close" type="button" data-ibt-action="close-modal">닫기</button>
                </div>
                <div class="ibt-modal__body">
                    <div id="ibtQuestionOverview"></div>
                </div>
            </section>
        </div>
        <div id="ibtSubmitModal" class="ibt-modal" hidden>
            <div class="ibt-modal__backdrop" data-ibt-action="close-modal"></div>
            <section class="ibt-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="ibtSubmitModalTitle">
                <div class="ibt-modal__head">
                    <h2 id="ibtSubmitModalTitle">답안 제출</h2>
                    <button class="summary-modal__close" type="button" data-ibt-action="close-modal">닫기</button>
                </div>
                <div class="ibt-modal__body">
                    <p class="ibt-submit-guide">아래 표에서 답안 상태를 확인하고, 모든 문항에 답한 뒤 채점하세요.</p>
                    <div id="ibtSubmitOverview"></div>
                </div>
                <div class="ibt-modal__foot">
                    <button data-action="grade" class="action-button action-button--primary" type="button">채점하기</button>
                </div>
            </section>
        </div>
    `;
}

function buildIbtQuestionEntries(quiz) {
    const entries = [];
    quiz.sections.forEach((section) => {
        let shared = null;
        section.items.forEach((item) => {
            if (item.type === "shared" || item.type === "note") {
                shared = {
                    label: item.type === "shared" ? item.range : item.title,
                    html: item.contentHtml
                };
                return;
            }

            if (item.type !== "question") return;
            entries.push({
                question: item,
                sectionTitle: section.title,
                shared
            });
        });
    });
    return entries;
}

function renderIbtQuestionEntry(entry, answers, attempt) {
    const item = entry.question;
    const answer = answers.get(item.number);
    const optionOrder = getOptionOrderForQuestion(item, attempt);
    const sharedMarkup = entry.shared
        ? `
            <aside class="ibt-source-panel">
                <div class="shared-card__range">${escapeHtml(entry.shared.label)}</div>
                ${entry.shared.html}
            </aside>
        `
        : `
            <aside class="ibt-source-panel ibt-source-panel--empty">
                <div class="shared-card__range">${escapeHtml(entry.sectionTitle)}</div>
                <p>왼쪽에는 공통 지문이 있는 문항에서 제시문이 표시됩니다.</p>
            </aside>
        `;

    return `
        <article class="question-card ibt-question-card" data-question="${item.number}" data-section-title="${escapeHtml(entry.sectionTitle)}">
            ${sharedMarkup}
            <section class="ibt-question-panel">
                <div class="question-card__head">
                    <div class="question-number">${String(item.number).padStart(2, "0")}</div>
                    <div>
                        <div class="ibt-question-section">${escapeHtml(entry.sectionTitle)}</div>
                        <div class="question-stem">${item.stemHtml}</div>
                    </div>
                </div>
                <div class="option-list ibt-option-list" role="radiogroup" aria-label="${item.number}번 답 선택">
                    ${optionOrder.map((originalLetter, index) => {
                        const option = item.options.find((candidate) => candidate.letter === originalLetter);
                        const displayLetter = IBT_DISPLAY_LETTERS[index];
                        return `
                            <div class="option" data-choice="${originalLetter}" data-display-choice="${displayLetter}" data-correct="${answer.correct === originalLetter}">
                                <input id="q${item.number}-${originalLetter}" class="option-input" type="radio" name="q${item.number}" value="${originalLetter}">
                                <label for="q${item.number}-${originalLetter}">
                                    <span class="option-letter">${displayLetter}</span>
                                    <span class="option-text">${renderInline(option.text)}</span>
                                </label>
                            </div>
                        `;
                    }).join("")}
                </div>
                <div class="feedback-panel" hidden></div>
            </section>
        </article>
    `;
}

function renderQuiz(quiz) {
    if (isIbtMode()) {
        renderIbtQuiz(quiz);
        return;
    }

    const questionNumbers = getQuestionNumbers(quiz.sections);
    const questionCount = questionNumbers.length;
    const meta = document.getElementById("quizMeta");
    const intro = document.getElementById("quizIntro");
    const sectionsRoot = document.getElementById("quizSections");
    const progressText = document.getElementById("progressText");
    const focusCard = document.getElementById("focusCard");
    const focusList = document.getElementById("focusList");

    if (meta) meta.textContent = `총 ${questionCount}문항`;

    if (intro) {
        intro.innerHTML = `
            <h2>${escapeHtml(quiz.title)}</h2>
            ${quiz.introHtml || "<p>문항을 읽고 알맞은 답을 골라 보세요.</p>"}
        `;
    }

    if (progressText) progressText.textContent = `0 / ${questionCount}`;

    renderHomeworkPanel(quiz);

    if (focusCard && focusList && quiz.focusItems.length) {
        focusCard.hidden = false;
        focusList.innerHTML = quiz.focusItems
            .map((item) => `<div class="focus-item">${renderInline(item)}</div>`)
            .join("");
    }

    if (!sectionsRoot) return;
    ensureQuestionPalette(sectionsRoot, questionNumbers);
    sectionsRoot.innerHTML = quiz.sections.map((section) => renderSection(section, quiz.answers, quiz.attempt)).join("");
}

function renderSection(section, answers, attempt) {
    const questionTotal = section.items.filter((item) => item.type === "question").length;
    return `
        <section class="section-card">
            <div class="section-card__header">
                <h2>${escapeHtml(section.title)}</h2>
                <div class="section-card__count">${questionTotal}문항</div>
            </div>
            <div class="section-card__body">
                ${section.items.map((item) => {
                    if (item.type === "shared") {
                        return `
                            <article class="shared-card">
                                <div class="shared-card__range">${escapeHtml(item.range)}</div>
                                ${item.contentHtml}
                            </article>
                        `;
                    }

                    if (item.type === "note") {
                        return `
                            <article class="shared-card">
                                <div class="shared-card__range">${escapeHtml(item.title)}</div>
                                ${item.contentHtml}
                            </article>
                        `;
                    }

                    const answer = answers.get(item.number);
                    const optionOrder = getOptionOrderForQuestion(item, attempt);
                    return `
                        <article class="question-card" data-question="${item.number}" data-section-title="${escapeHtml(section.title)}">
                            <div class="question-card__head">
                                <div class="question-number">Q${item.number}</div>
                                <div class="question-stem">${item.stemHtml}</div>
                            </div>
                            <div class="option-list">
                                ${optionOrder.map((originalLetter, index) => {
                                    const option = item.options.find((candidate) => candidate.letter === originalLetter);
                                    const displayLetter = OPTION_LETTERS[index];
                                    return `
                                        <div class="option" data-choice="${originalLetter}" data-display-choice="${displayLetter}" data-correct="${answer.correct === originalLetter}">
                                            <input id="q${item.number}-${originalLetter}" class="option-input" type="radio" name="q${item.number}" value="${originalLetter}">
                                            <label for="q${item.number}-${originalLetter}">
                                                <span class="option-letter">${displayLetter}</span>
                                                <span class="option-text">${renderInline(option.text)}</span>
                                            </label>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                            <div class="feedback-panel" hidden></div>
                        </article>
                    `;
                }).join("")}
            </div>
        </section>
    `;
}

function getHomeworkConfig() {
    return window.VOCAB_GRAMMAR_HOMEWORK_CONFIG || null;
}

function getHomeworkAssignment(roundId) {
    const config = getHomeworkConfig();
    if (!config || typeof config.getAssignment !== "function") return null;
    return config.getAssignment(roundId);
}

function getHomeworkStudentNameKey() {
    return getHomeworkConfig()?.studentNameKey || DEFAULT_HOMEWORK_STUDENT_NAME_KEY;
}

function getHomeworkStudentName() {
    try {
        return String(localStorage.getItem(getHomeworkStudentNameKey()) || "").trim();
    } catch {
        return "";
    }
}

function setHomeworkStudentName(value) {
    try {
        localStorage.setItem(getHomeworkStudentNameKey(), String(value || "").trim());
    } catch {
        // Local storage can be unavailable; the input value still works for this session.
    }
}

function renderHomeworkPanel(quiz) {
    if (!quiz.homework) return;

    const quizPanel = document.querySelector(".quiz-panel");
    const firstToolbar = quizPanel?.querySelector(".toolbar");
    if (!quizPanel || !firstToolbar) return;

    let panel = document.getElementById("homeworkPanel");
    if (!panel) {
        panel = document.createElement("section");
        panel.id = "homeworkPanel";
        panel.className = "homework-panel";
        quizPanel.insertBefore(panel, firstToolbar);
    }

    const savedName = getHomeworkStudentName();
    panel.innerHTML = `
        <div class="homework-panel__text">
            <span class="homework-panel__badge">응시 기록</span>
            <h2>먼저 이름을 입력하세요</h2>
            <p>${escapeHtml(quiz.homework.roundLabel)} 채점 결과가 온라인 응시 기록으로 제출됩니다.</p>
        </div>
        <label class="student-name-field" for="studentNameInput">
            <span>이름</span>
            <input id="studentNameInput" type="text" maxlength="40" autocomplete="name" value="${escapeHtml(savedName)}" placeholder="여기에 이름 입력">
        </label>
        <p id="homeworkStatus" class="homework-status ${savedName ? "is-idle" : "is-pending"}">
            ${savedName ? "이름이 저장되었습니다. 모든 문항을 푼 뒤 제출하세요." : "이름을 입력하면 퀴즈가 시작됩니다."}
        </p>
    `;
}

function bindHomeworkPanel(quiz) {
    if (!quiz.homework) return;

    const input = document.getElementById("studentNameInput");
    if (!input) return;

    input.addEventListener("input", () => {
        const value = input.value.trim();
        setHomeworkStudentName(value);
        applyHomeworkLockState(quiz);
        if (isIbtMode()) {
            updateIbtStartButton(quiz);
            updateProgress(getQuestionNumbers(quiz.sections).length);
            return;
        }
        if (value) {
            clearHomeworkNameAttention();
            setHomeworkStatus(quiz, "idle", "이름이 저장되었습니다. 모든 문항을 푼 뒤 제출하세요.");
        }
        updateProgress(getQuestionNumbers(quiz.sections).length);
    });
}

function isHomeworkEnabled(quiz) {
    return Boolean(quiz?.homework || document.getElementById("homeworkPanel"));
}

function isHomeworkLocked(quiz) {
    return isHomeworkEnabled(quiz) && !getHomeworkStudentName();
}

function applyHomeworkLockState(quiz) {
    const locked = isHomeworkLocked(quiz);
    const panel = document.getElementById("homeworkPanel");
    const input = document.getElementById("studentNameInput");

    document.body.classList.toggle("homework-locked", locked);
    document.body.classList.toggle("homework-name-missing", locked);
    if (panel) panel.classList.toggle("is-name-missing", locked);
    if (input) input.setAttribute("aria-invalid", String(locked));

    document.querySelectorAll(".option-input").forEach((input) => {
        input.disabled = locked;
    });

    if (locked) {
        setHomeworkStatus(quiz, "pending", isIbtMode() ? "이름을 입력한 뒤 다음 버튼을 눌러 주세요." : "이름을 입력하면 퀴즈가 시작됩니다.");
    }
}

function showMissingHomeworkName(quiz) {
    const panel = document.getElementById("homeworkPanel");
    setHomeworkStatus(quiz, "error", "이름을 먼저 입력해야 제출할 수 있습니다.");
    if (panel) {
        panel.classList.remove("is-attention");
        void panel.offsetWidth;
        panel.classList.add("is-attention");
    }
    const input = document.getElementById("studentNameInput");
    if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

function clearHomeworkNameAttention() {
    const panel = document.getElementById("homeworkPanel");
    if (!panel) return;
    panel.classList.remove("is-attention");
}

function setHomeworkStatus(quiz, kind, message) {
    if (!isHomeworkEnabled(quiz)) return;
    const status = document.getElementById("homeworkStatus");
    if (!status) return;
    status.className = `homework-status is-${kind || "idle"}`;
    status.textContent = message;
}

function signatureHash(signature) {
    let hash = 2166136261;
    const source = String(signature || "");
    for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}

function buildHomeworkPayload(quiz, result, signature) {
    const assignment = quiz.homework;
    return {
        assignmentId: assignment.assignmentId,
        assignmentTitle: assignment.assignmentTitle,
        chapter: getHomeworkConfig()?.chapter || "midterm-3b",
        roundId: assignment.roundId,
        roundLabel: assignment.roundLabel,
        studentName: getHomeworkStudentName(),
        anonymousUid: "",
        seed: quiz.attempt?.seed || "",
        signatureHash: signatureHash(signature),
        score: result.correctCount,
        total: result.totalCount,
        percent: result.percent,
        completed: result.answeredCount === result.totalCount,
        answered: result.answeredCount,
        correctQuestions: result.questionResults
            .filter((item) => item.isCorrect)
            .map((item) => item.number),
        wrongQuestions: result.questionResults
            .filter((item) => !item.isCorrect)
            .map((item) => item.number),
        questionResults: result.questionResults.map((item) => ({
            number: item.number,
            area: item.sectionTitle || "",
            sectionTitle: item.sectionTitle || "",
            studentAnswer: item.selectedText || "",
            selectedLetter: item.selectedLetter || "",
            selectedOriginalLetter: item.selectedOriginalLetter || "",
            correctAnswer: item.correctText || "",
            correctLetter: item.correctLetter || "",
            correctOriginalLetter: item.correctOriginalLetter || "",
            isCorrect: Boolean(item.isCorrect)
        })),
        clientSubmittedAt: new Date().toISOString()
    };
}

async function submitHomeworkResult(quiz, result, signature) {
    if (!quiz.homework || result.answeredCount !== result.totalCount) return null;

    const submitter = window.HomeworkSubmitter;
    if (!submitter || typeof submitter.submitHomework !== "function") {
        setHomeworkStatus(quiz, "error", "온라인 제출 모듈을 찾을 수 없습니다.");
        return null;
    }

    setHomeworkStatus(quiz, "pending", "온라인 제출 중입니다...");
    try {
        const response = await submitter.submitHomework(buildHomeworkPayload(quiz, result, signature));
        setHomeworkStatus(quiz, "success", "온라인 제출이 완료되었습니다.");
        return response;
    } catch (error) {
        const message = error?.message || "알 수 없는 오류";
        setHomeworkStatus(quiz, "error", `온라인 제출 실패: ${message}`);
        return null;
    }
}

function wireQuizInteractions(quiz) {
    const roundId = document.body.dataset.roundId;
    const storageKey = getRoundStorageKey(roundId);
    const attemptKey = getAttemptStorageKey(roundId);
    const root = document.getElementById("quizSections");
    const palette = document.getElementById("questionPalette");
    const gradeButtons = [...document.querySelectorAll('[data-action="grade"]')];
    const resetButtons = [...document.querySelectorAll('[data-action="reset"]')];
    const totalQuestions = getQuestionNumbers(quiz.sections).length;
    let wasReadyToGrade = false;

    ensureGradeSummaryModal();
    bindHomeworkPanel(quiz);
    restoreAnswers(storageKey);
    wasReadyToGrade = updateProgress(totalQuestions);
    applyHomeworkLockState(quiz);
    if (isIbtMode()) wireIbtInteractions(quiz, totalQuestions);
    window.addEventListener("pagehide", () => saveAnswers(storageKey));
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") saveAnswers(storageKey);
    });

    if (root) {
        root.addEventListener("change", (event) => {
            if (!event.target.classList.contains("option-input")) return;
            saveAnswers(storageKey);
            clearFeedback();
            closeGradeSummaryModal({ scrollTop: false });
            const readyToGrade = updateProgress(totalQuestions);
            if (readyToGrade && !wasReadyToGrade) {
                promptReadyToSubmit(quiz);
            } else if (!readyToGrade) {
                clearReadyToSubmitHighlight();
                setHomeworkStatus(quiz, "idle", "답안이 자동 저장되었습니다. 모든 문항을 푼 뒤 제출하세요.");
            }
            updateIbtChrome(totalQuestions);
            wasReadyToGrade = readyToGrade;
        });

        root.addEventListener("click", (event) => {
            if (isHomeworkLocked(quiz) && event.target.closest(".question-card, .option")) {
                showMissingHomeworkName(quiz);
                return;
            }

            const toggleButton = event.target.closest(".feedback-translate-toggle");
            if (!toggleButton) return;

            const feedback = toggleButton.closest(".feedback-panel");
            const translation = feedback?.querySelector(".feedback-translation");
            if (!translation) return;

            const shouldOpen = translation.hidden;
            translation.hidden = !shouldOpen;
            toggleButton.textContent = shouldOpen ? "한국어만 보기" : "베트남어 보기";
        });
    }

    if (palette) {
        palette.addEventListener("click", (event) => {
            const button = event.target.closest("[data-question-jump]");
            if (!button) return;
            const card = document.querySelector(`.question-card[data-question="${button.dataset.questionJump}"]`);
            if (!card) return;
            if (isIbtMode()) {
                const cards = getIbtQuestionCards();
                const index = cards.indexOf(card);
                if (index >= 0) {
                    setIbtCurrentQuestion(index, { scroll: true });
                    return;
                }
            }
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    gradeButtons.forEach((button) => button.addEventListener("click", async () => {
        if (isHomeworkLocked(quiz)) {
            showMissingHomeworkName(quiz);
            return;
        }

        if (!isReadyToGrade(totalQuestions)) {
            updateProgress(totalQuestions);
            focusFirstUnansweredQuestion();
            return;
        }

        saveAnswers(storageKey);
        clearReadyToSubmitHighlight();
        const result = window.gradeQuiz(quiz.answers);
        const signature = getAnswerSignature(roundId);
        saveRoundSummary(roundId, result, totalQuestions, signature);
        window.showGradeSummaryModal(result);
        updateQuestionPalette();
        updateIbtChrome(totalQuestions);
        closeIbtModals();
        await submitHomeworkResult(quiz, result, signature);
    }));

    resetButtons.forEach((button) => button.addEventListener("click", () => {
        if (!window.confirm("선택한 답을 모두 지우고 처음부터 다시 풀까요?")) return;
        localStorage.removeItem(storageKey);
        localStorage.removeItem(attemptKey);
        clearReadyToSubmitHighlight();
        closeGradeSummaryModal({ scrollTop: false });
        window.location.reload();
    }));
}

function gradeQuiz(answerMap) {
    let correctCount = 0;
    let answeredCount = 0;
    const questionResults = [];

    document.querySelectorAll(".question-card").forEach((card) => {
        const number = Number(card.dataset.question);
        const answer = answerMap.get(number);
        const checked = card.querySelector(".option-input:checked");
        const feedback = card.querySelector(".feedback-panel");
        const correctOption = card.querySelector('.option[data-correct="true"]');

        card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
        card.querySelectorAll(".option").forEach((option) => {
            option.classList.remove("is-correct-answer", "is-wrong-answer");
        });

        if (correctOption) correctOption.classList.add("is-correct-answer");

        const correctLetter = getDisplayLetter(card, answer.correct);
        const correctText = getOptionText(card, answer.correct);
        const selectedOriginalLetter = checked ? checked.value : "";
        const selectedLetter = checked ? getDisplayLetter(card, checked.value) : "";
        const selectedText = checked ? getOptionText(card, checked.value) : "";
        const resultBase = {
            number,
            sectionTitle: card.dataset.sectionTitle || "",
            correctLetter,
            correctOriginalLetter: answer.correct,
            correctText,
            selectedLetter,
            selectedOriginalLetter,
            selectedText
        };

        if (!checked) {
            card.classList.add("is-unanswered");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-bad";
            feedback.innerHTML = window.buildFeedbackHtml({
                status: "unanswered",
                correctLetter,
                correctText,
                explanation: answer.explanation
            });
            questionResults.push(Object.assign({}, resultBase, { isCorrect: false, mark: "X" }));
            return;
        }

        answeredCount += 1;

        if (selectedOriginalLetter === answer.correct) {
            correctCount += 1;
            card.classList.add("is-correct");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-good";
            feedback.innerHTML = window.buildFeedbackHtml({
                status: "correct",
                correctLetter,
                correctText,
                selectedLetter,
                selectedText,
                explanation: answer.explanation
            });
            questionResults.push(Object.assign({}, resultBase, { isCorrect: true, mark: "O" }));
            return;
        }

        const wrongOption = card.querySelector(`.option[data-choice="${selectedOriginalLetter}"]`);
        if (wrongOption) wrongOption.classList.add("is-wrong-answer");
        card.classList.add("is-incorrect");
        feedback.hidden = false;
        feedback.className = "feedback-panel is-bad";
        feedback.innerHTML = window.buildFeedbackHtml({
            status: "incorrect",
            correctLetter,
            correctText,
            selectedLetter,
            selectedText,
            explanation: answer.explanation
        });
        questionResults.push(Object.assign({}, resultBase, { isCorrect: false, mark: "X" }));
    });

    const totalCount = answerMap.size;
    const percent = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const progressFill = document.getElementById("progressFill");
    const wrongCount = totalCount - correctCount;

    if (progressText) progressText.textContent = `${correctCount} / ${totalCount}`;
    if (scoreText) {
        scoreText.textContent = wrongCount === 0
            ? `모든 문제를 맞았습니다. ${totalCount}문항 중 ${correctCount}문항 정답입니다.`
            : `${totalCount}문항 중 ${correctCount}문항 맞았습니다. 틀린 문제 ${wrongCount}문항을 다시 보세요.`;
    }
    if (progressFill) progressFill.style.width = `${percent}%`;

    return {
        correctCount,
        answeredCount,
        totalCount,
        percent,
        wrongCount,
        questionResults
    };
}

function buildFeedbackHtml({ status, correctLetter, correctText, selectedLetter = "", selectedText = "", explanation }) {
    const heading = status === "correct"
        ? "정답입니다."
        : status === "incorrect"
            ? "오답입니다."
            : "미응답입니다.";

    const guide = status === "correct"
        ? "정답 근거를 한 번 더 확인해 보세요."
        : status === "incorrect"
            ? "정답과 내가 고른 보기를 비교해 보세요."
            : "정답 표현을 먼저 확인하고 다시 풀어 보세요.";

    const answerText = status === "unanswered"
        ? "아직 고르지 않았어요."
        : `<code>${escapeHtml(selectedLetter)}</code> ${renderInline(selectedText)}`;
    const easyReason = buildEasyFeedbackText(correctText, explanation);
    const vietnameseReason = buildVietnameseFeedbackText(status, correctLetter, correctText, selectedLetter, selectedText, explanation);

    return `
        <div class="feedback-heading">${heading}</div>
        <p class="feedback-guide">${guide}</p>
        <div class="feedback-row">
            <span class="feedback-label">정답</span>
            <span class="feedback-value"><code>${escapeHtml(correctLetter)}</code> ${renderInline(correctText)}</span>
        </div>
        <div class="feedback-row">
            <span class="feedback-label">내 답</span>
            <span class="feedback-value">${answerText}</span>
        </div>
        <div class="feedback-row feedback-row--stack">
            <span class="feedback-label">설명</span>
            <span class="feedback-value">${renderInline(easyReason)}</span>
        </div>
        <button class="feedback-translate-toggle" type="button">베트남어 보기</button>
        <div class="feedback-translation" hidden>
            <div class="feedback-row feedback-row--stack">
                <span class="feedback-label">Tiếng Việt</span>
                <span class="feedback-value">${renderInline(vietnameseReason)}</span>
            </div>
        </div>
    `;
}

function buildEasyFeedbackText(correctText, explanation) {
    return rewriteExplanationForFeedback(explanation || correctText);
}

function buildVietnameseFeedbackText(status, correctLetter, correctText, selectedLetter, selectedText, explanation) {
    const lines = [];
    lines.push(status === "correct"
        ? "Bạn đã chọn đúng."
        : status === "incorrect"
            ? "Câu này chưa đúng."
            : "Câu này chưa được chọn.");
    lines.push(`Đáp án đúng là ${correctLetter}: ${correctText}.`);
    if (status === "incorrect" && selectedLetter) {
        lines.push(`Bạn đã chọn ${selectedLetter}: ${selectedText}.`);
    }
    lines.push(buildVietnameseReason(correctText, explanation));
    return lines.join(" ");
}

function buildVietnameseReason(correctText, explanation) {
    const source = `${correctText} ${explanation}`;
    if (/소개팅|선보다|청혼|사귀|고백|연애|결혼/.test(source)) {
        return "Hãy phân biệt rõ giai đoạn gặp gỡ, hẹn hò và kết hôn trong ngữ cảnh.";
    }
    if (/-던|입던|신던/.test(source)) {
        return "Mẫu -던 dùng khi nhớ lại hành động hoặc trạng thái thường xảy ra trong quá khứ.";
    }
    if (/까 봐|걱정|염려/.test(source)) {
        return "Khi có ý lo lắng điều gì đó xảy ra, dùng -(으)ㄹ까 봐.";
    }
    if (/도록|목적/.test(source)) {
        return "V-도록 diễn tả mục đích hoặc hướng để việc gì đó có thể xảy ra.";
    }
    if (/더니|결과/.test(source)) {
        return "V-았/었더니 nối trải nghiệm trực tiếp với kết quả sau đó.";
    }
    return "Hãy đọc lại ngữ cảnh và so sánh nghĩa của đáp án đúng với các lựa chọn còn lại.";
}

function rewriteExplanationForFeedback(explanation) {
    let text = String(explanation || "").trim().replace(/\s+/g, " ");
    const replacements = [
        [/`([^`]+)`와 뜻이 같은 말은 `[^`]+`이다\./g, "뜻이 같은 말을 찾는 문제예요."],
        [/`([^`]+)`와 바꿔 쓸 수 있는 말은 `[^`]+`이다\./g, "같은 뜻으로 바꿔 쓸 수 있는 말을 찾는 문제예요."],
        [/(.+?)은 `[^`]+`이다\./g, "$1을 말해요."],
        [/라고 한다\./g, "라고 해요."],
        [/라고 한다/g, "라고 해요"],
        [/를 쓴다\./g, "를 써요."],
        [/를 쓴다/g, "를 써요"],
        [/가 맞다\./g, "가 맞아요."],
        [/가 맞다/g, "가 맞아요"],
        [/이 맞다\./g, "이 맞아요."],
        [/이 맞다/g, "이 맞아요"],
        [/가 가장 자연스럽다\./g, "가 가장 자연스러워요."],
        [/가 가장 자연스럽다/g, "가 가장 자연스러워요"],
        [/가 자연스럽다\./g, "가 자연스러워요."],
        [/가 자연스럽다/g, "가 자연스러워요"],
        [/자연스럽습니다\./g, "자연스러워요."],
        [/자연스럽습니다/g, "자연스러워요"],
        [/맞습니다\./g, "맞아요."],
        [/맞습니다/g, "맞아요"],
        [/설명합니다\./g, "설명해요."],
        [/설명합니다/g, "설명해요"],
        [/말합니다\./g, "말해요."],
        [/말합니다/g, "말해요"],
        [/나타냅니다\./g, "나타내요."],
        [/나타냅니다/g, "나타내요"],
        [/연결됩니다\./g, "잘 이어져요."],
        [/연결됩니다/g, "잘 이어져요"],
        [/드러난다\./g, "잘 보여 줘요."],
        [/드러난다/g, "잘 보여 줘요"]
    ];

    replacements.forEach(([pattern, replacement]) => {
        text = text.replace(pattern, replacement);
    });

    return text;
}

function saveAnswers(storageKey) {
    const selections = collectSelections();
    try {
        localStorage.setItem(storageKey, JSON.stringify(selections));
    } catch {
        // Keep the in-memory selections available even when local storage is blocked.
    }
    return selections;
}

function restoreAnswers(storageKey) {
    const saved = readStoredSelections(storageKey);
    Object.entries(saved).forEach(([number, originalLetter]) => {
        const input = document.querySelector(`#q${number}-${originalLetter}`);
        if (input) input.checked = true;
    });

    const restoredCount = Object.keys(saved).length;
    const renderedCount = document.querySelectorAll(".question-card").length;
    if (restoredCount && restoredCount > renderedCount) {
        localStorage.removeItem(storageKey);
    }
}

function clearFeedback() {
    document.querySelectorAll(".question-card").forEach((card) => {
        card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
        card.querySelectorAll(".option").forEach((option) => {
            option.classList.remove("is-correct-answer", "is-wrong-answer");
        });
        const feedback = card.querySelector(".feedback-panel");
        if (feedback) {
            feedback.hidden = true;
            feedback.innerHTML = "";
            feedback.className = "feedback-panel";
        }
    });
    updateQuestionPalette();
}

function updateProgress(totalCount) {
    const answeredCount = document.querySelectorAll(".option-input:checked").length;
    const percent = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const progressFill = document.getElementById("progressFill");
    const remainingCount = Math.max(totalCount - answeredCount, 0);
    const readyToGrade = setGradeButtonsState(answeredCount, totalCount);

    if (progressText) progressText.textContent = `${answeredCount} / ${totalCount}`;
    if (scoreText) {
        scoreText.textContent = readyToGrade
            ? "모든 문제를 풀었습니다. 채점할 수 있습니다."
            : `아직 ${remainingCount}문항이 남았습니다.`;
    }
    if (progressFill) progressFill.style.width = `${percent}%`;
    updateQuestionPalette();
    updateIbtChrome(totalCount);
    return readyToGrade;
}

function collectSelections() {
    const selections = {};
    document.querySelectorAll(".question-card").forEach((card) => {
        const number = card.dataset.question;
        const checked = card.querySelector(".option-input:checked");
        if (checked) selections[number] = checked.value;
    });
    return selections;
}

function getAnswerSignature(roundId) {
    const selections = collectSelections();
    const orderedSelections = Object.keys(selections)
        .sort((left, right) => Number(left) - Number(right))
        .reduce((result, key) => {
            result[key] = selections[key];
            return result;
        }, {});
    const attempt = readAttemptState(getAttemptStorageKey(roundId));
    return JSON.stringify({
        seed: attempt?.seed || "unknown",
        selections: orderedSelections
    });
}

function setGradeButtonsState(answeredCount, totalCount) {
    const readyToGrade = totalCount > 0 && answeredCount === totalCount;
    const locked = isHomeworkLocked();
    document.querySelectorAll('[data-action="grade"]').forEach((button) => {
        button.disabled = locked || !readyToGrade;
        button.setAttribute("aria-disabled", String(locked || !readyToGrade));
    });
    return readyToGrade;
}

function promptReadyToSubmit(quiz) {
    if (isHomeworkLocked(quiz)) return;
    const gradeButton = getPreferredGradeButton();
    document.body.classList.add("ready-to-submit");
    document.querySelectorAll('[data-action="grade"]').forEach((button) => {
        button.classList.add("is-ready-to-submit");
    });
    setHomeworkStatus(quiz, "ready", "모든 문항이 자동 저장되었습니다. 채점 버튼을 눌러 제출을 완료하세요.");
    if (!gradeButton) return;
    window.setTimeout(() => {
        gradeButton.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => gradeButton.focus({ preventScroll: true }), 320);
    }, 120);
}

function getPreferredGradeButton() {
    const buttons = [...document.querySelectorAll('[data-action="grade"]')]
        .filter((button) => !button.disabled);
    return buttons.find((button) => button.closest(".toolbar--bottom")) || buttons[0] || null;
}

function clearReadyToSubmitHighlight() {
    document.body.classList.remove("ready-to-submit");
    document.querySelectorAll('[data-action="grade"]').forEach((button) => {
        button.classList.remove("is-ready-to-submit");
    });
}

function isReadyToGrade(totalCount) {
    return totalCount > 0 && document.querySelectorAll(".option-input:checked").length === totalCount;
}

function focusFirstUnansweredQuestion() {
    const firstUnanswered = [...document.querySelectorAll(".question-card")]
        .find((card) => !card.querySelector(".option-input:checked"));
    if (!firstUnanswered) return;
    if (isIbtMode()) {
        const cards = getIbtQuestionCards();
        const targetIndex = cards.indexOf(firstUnanswered);
        if (targetIndex >= 0) setIbtCurrentQuestion(targetIndex);
    }
    firstUnanswered.scrollIntoView({ behavior: "smooth", block: "center" });
    const firstInput = firstUnanswered.querySelector(".option-input");
    if (firstInput) firstInput.focus({ preventScroll: true });
}

function getIbtQuestionCards() {
    return [...document.querySelectorAll(".ibt-question-card")];
}

function getIbtCurrentIndex() {
    const cards = getIbtQuestionCards();
    const index = cards.findIndex((card) => card.classList.contains("is-current"));
    return index >= 0 ? index : 0;
}

function getIbtCurrentIndexKey(roundId) {
    return `${STORAGE_NAMESPACE}-ibt-current-${roundId}`;
}

function getIbtStartedKey(roundId) {
    return `${STORAGE_NAMESPACE}-ibt-started-${roundId}`;
}

function isIbtStarted(roundId) {
    if (!getHomeworkStudentName()) return false;
    try {
        return localStorage.getItem(getIbtStartedKey(roundId)) === "true";
    } catch {
        return document.body.classList.contains("ibt-started");
    }
}

function setIbtStarted(roundId, started) {
    try {
        if (started) {
            localStorage.setItem(getIbtStartedKey(roundId), "true");
        } else {
            localStorage.removeItem(getIbtStartedKey(roundId));
        }
    } catch {
        // The CSS state still updates for the current session.
    }
}

function applyIbtStartedState(quiz) {
    if (!isIbtMode()) return;
    const started = isIbtStarted(quiz?.roundId || document.body.dataset.roundId);
    document.body.classList.toggle("ibt-started", started);
    updateIbtStartButton(quiz);
}

function updateIbtStartButton(quiz) {
    if (!isIbtMode()) return;
    const hasName = Boolean(getHomeworkStudentName());
    const button = document.getElementById("ibtStartButton");
    if (button) button.disabled = !hasName;
    if (hasName) {
        clearHomeworkNameAttention();
        setHomeworkStatus(quiz, "idle", "이름이 저장되었습니다. 다음 버튼을 눌러 시험 화면으로 이동하세요.");
    } else {
        setIbtStarted(document.body.dataset.roundId, false);
        document.body.classList.remove("ibt-started");
        setHomeworkStatus(quiz, "pending", "이름을 입력한 뒤 다음 버튼을 눌러 주세요.");
    }
}

function startIbtExam(quiz) {
    if (!getHomeworkStudentName()) {
        showMissingHomeworkName(quiz);
        updateIbtStartButton(quiz);
        return;
    }

    setIbtStarted(quiz?.roundId || document.body.dataset.roundId, true);
    document.body.classList.add("ibt-started");
    applyHomeworkLockState(quiz);
    updateProgress(getQuestionNumbers(quiz.sections).length);
    scrollIbtCurrentQuestionIntoView("smooth");
}

function readIbtCurrentIndex(roundId, totalCount) {
    try {
        const value = Number(localStorage.getItem(getIbtCurrentIndexKey(roundId)));
        if (Number.isInteger(value) && value >= 0 && value < totalCount) return value;
    } catch {
        // The first question is a safe fallback when localStorage is blocked.
    }
    return 0;
}

function writeIbtCurrentIndex(roundId, index) {
    try {
        localStorage.setItem(getIbtCurrentIndexKey(roundId), String(index));
    } catch {
        // Navigation still works for the current session.
    }
}

function setIbtCurrentQuestion(index, { save = true, scroll = false } = {}) {
    if (!isIbtMode()) return;
    const cards = getIbtQuestionCards();
    if (!cards.length) return;

    const bounded = Math.max(0, Math.min(index, cards.length - 1));
    cards.forEach((card, cardIndex) => {
        const active = cardIndex === bounded;
        card.classList.toggle("is-current", active);
        card.hidden = !active;
        card.setAttribute("aria-hidden", String(!active));
    });

    const roundId = document.body.dataset.roundId;
    if (save && roundId) writeIbtCurrentIndex(roundId, bounded);
    updateIbtChrome(cards.length);
    if (scroll) scrollIbtCurrentQuestionIntoView("smooth");
}

function scrollIbtCurrentQuestionIntoView(behavior = "auto") {
    const currentCard = getIbtQuestionCards()[getIbtCurrentIndex()];
    if (!currentCard || currentCard.hidden) return;
    window.setTimeout(() => {
        currentCard.scrollIntoView({ behavior, block: "start" });
    }, 40);
}

function updateIbtChrome(totalCount = getIbtQuestionCards().length) {
    if (!isIbtMode()) return;
    const cards = getIbtQuestionCards();
    const currentIndex = getIbtCurrentIndex();
    const currentCard = cards[currentIndex];
    const answeredCount = document.querySelectorAll(".option-input:checked").length;
    const remainingCount = Math.max(totalCount - answeredCount, 0);
    const footerStatus = document.getElementById("ibtFooterStatus");
    const prevButton = document.querySelector('[data-ibt-action="prev"]');
    const nextButton = document.querySelector('[data-ibt-action="next"]');

    if (footerStatus) {
        const currentNumber = currentCard?.dataset.question || String(currentIndex + 1);
        footerStatus.textContent = `현재 문항 ${currentNumber}/${totalCount} · 남은 문항 ${remainingCount}`;
    }

    if (prevButton) prevButton.disabled = currentIndex <= 0;
    if (nextButton) nextButton.querySelector("span:first-child")?.replaceChildren(document.createTextNode(currentIndex >= totalCount - 1 ? "제출" : "다음"));

    document.querySelectorAll("[data-question-jump]").forEach((button) => {
        const card = document.querySelector(`.question-card[data-question="${button.dataset.questionJump}"]`);
        button.classList.toggle("is-current", Boolean(card && card === currentCard));
    });

    updateIbtOverviewTables();
}

function getIbtAnswerRowsHtml() {
    const cards = getIbtQuestionCards();
    return `
        <div class="ibt-answer-grid" role="table" aria-label="문항별 답안">
            ${cards.map((card, index) => {
                const checked = card.querySelector(".option-input:checked");
                const selected = checked ? card.querySelector(`.option[data-choice="${checked.value}"]`)?.dataset.displayChoice : "";
                const isCurrent = card.classList.contains("is-current");
                const isMissing = !selected;
                return `
                    <button
                        class="ibt-answer-cell ${isCurrent ? "is-current" : ""} ${isMissing ? "is-missing" : "is-answered"}"
                        type="button"
                        data-question-jump="${card.dataset.question}"
                        aria-label="${index + 1}번 ${selected || "미응답"}"
                    >
                        <span>${String(index + 1).padStart(2, "0")}</span>
                        <strong>${selected || "-"}</strong>
                    </button>
                `;
            }).join("")}
        </div>
    `;
}

function updateIbtOverviewTables() {
    if (!isIbtMode()) return;
    const html = getIbtAnswerRowsHtml();
    const questionOverview = document.getElementById("ibtQuestionOverview");
    const submitOverview = document.getElementById("ibtSubmitOverview");
    if (questionOverview) questionOverview.innerHTML = html;
    if (submitOverview) submitOverview.innerHTML = html;
}

function openIbtModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    updateIbtOverviewTables();
    modal.hidden = false;
    document.body.classList.add("has-summary-modal");
    const firstButton = modal.querySelector("button");
    if (firstButton) firstButton.focus();
}

function closeIbtModals() {
    document.querySelectorAll(".ibt-modal").forEach((modal) => {
        modal.hidden = true;
    });
    if (!document.querySelector(".summary-modal:not([hidden])")) {
        document.body.classList.remove("has-summary-modal");
    }
}

function startIbtClock() {
    if (ibtClockTimer) return;
    ibtClockTimer = window.setInterval(updateIbtClock, 1000);
}

function updateIbtClock() {
    const target = document.getElementById("ibtCurrentTime");
    if (!target) return;
    try {
        target.textContent = new Intl.DateTimeFormat("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        }).format(new Date());
    } catch {
        target.textContent = new Date().toLocaleTimeString();
    }
}

function wireIbtInteractions(quiz, totalQuestions) {
    updateIbtChrome(totalQuestions);

    document.addEventListener("click", (event) => {
        const jump = event.target.closest("[data-question-jump]");
        if (jump && isIbtMode()) {
            const card = document.querySelector(`.question-card[data-question="${jump.dataset.questionJump}"]`);
            const cards = getIbtQuestionCards();
            const index = cards.indexOf(card);
            if (index >= 0) {
                setIbtCurrentQuestion(index, { scroll: true });
                closeIbtModals();
            }
            return;
        }

        const control = event.target.closest("[data-ibt-action]");
        if (!control || !isIbtMode()) return;

        const action = control.dataset.ibtAction;
        if (action === "start-exam") {
            startIbtExam(quiz);
            return;
        }
        if (action === "prev") {
            setIbtCurrentQuestion(getIbtCurrentIndex() - 1, { scroll: true });
            return;
        }
        if (action === "next") {
            const current = getIbtCurrentIndex();
            if (current >= totalQuestions - 1) {
                openIbtModal("ibtSubmitModal");
                return;
            }
            setIbtCurrentQuestion(current + 1, { scroll: true });
            return;
        }
        if (action === "open-questions") {
            openIbtModal("ibtQuestionModal");
            return;
        }
        if (action === "open-submit") {
            openIbtModal("ibtSubmitModal");
            return;
        }
        if (action === "close-modal") {
            closeIbtModals();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!isIbtMode()) return;
        if (event.key === "Escape") {
            closeIbtModals();
            return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowLeft") setIbtCurrentQuestion(getIbtCurrentIndex() - 1, { scroll: true });
        if (event.key === "ArrowRight") setIbtCurrentQuestion(getIbtCurrentIndex() + 1, { scroll: true });
    });
}

function ensureQuestionPalette(sectionsRoot, questionNumbers) {
    let palette = document.getElementById("questionPalette");
    if (!palette) {
        palette = document.createElement("aside");
        palette.id = "questionPalette";
        palette.className = "question-palette";
        sectionsRoot.parentElement.insertBefore(palette, sectionsRoot);
    }

    const compactLabels = isIbtMode();
    palette.innerHTML = `
        <div class="question-palette__title">문항</div>
        <div class="question-palette__grid">
            ${questionNumbers.map((number) => `
                <button class="question-jump" type="button" data-question-jump="${number}" aria-label="${number}번 문항으로 이동">${compactLabels ? String(number).padStart(2, "0") : `Q${number}`}</button>
            `).join("")}
        </div>
    `;
}

function updateQuestionPalette() {
    document.querySelectorAll("[data-question-jump]").forEach((button) => {
        const card = document.querySelector(`.question-card[data-question="${button.dataset.questionJump}"]`);
        const currentCard = isIbtMode() ? getIbtQuestionCards()[getIbtCurrentIndex()] : null;
        button.classList.toggle("is-answered", Boolean(card?.querySelector(".option-input:checked")));
        button.classList.toggle("is-correct", Boolean(card?.classList.contains("is-correct")));
        button.classList.toggle("is-wrong", Boolean(card?.classList.contains("is-incorrect") || card?.classList.contains("is-unanswered")));
        button.classList.toggle("is-current", Boolean(currentCard && card === currentCard));
    });
}

function getOptionText(card, originalLetter) {
    return card.querySelector(`.option[data-choice="${originalLetter}"] .option-text`)?.textContent.trim() || "";
}

function getDisplayLetter(card, originalLetter) {
    return card.querySelector(`.option[data-choice="${originalLetter}"]`)?.dataset.displayChoice || originalLetter;
}

function getOptionOrderForQuestion(question, attempt) {
    const fallback = question.options.map((option) => option.letter);
    const stored = attempt?.orders?.[question.number];
    if (!Array.isArray(stored)) return fallback;
    const source = new Set(fallback);
    if (stored.length !== fallback.length || !stored.every((letter) => source.has(letter))) return fallback;
    return stored;
}

function getOrCreateAttemptState(roundId, quiz, savedSelections) {
    const attemptKey = getAttemptStorageKey(roundId);
    const existing = readAttemptState(attemptKey);
    if (existing && isValidAttemptState(existing, quiz)) return existing;

    const hasSavedSelections = Object.keys(savedSelections || {}).length > 0;
    const nextAttempt = hasSavedSelections
        ? buildIdentityAttemptState(quiz)
        : buildBalancedAttemptState(quiz);

    localStorage.setItem(attemptKey, JSON.stringify(nextAttempt));
    return nextAttempt;
}

function readAttemptState(attemptKey) {
    const raw = localStorage.getItem(attemptKey);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        localStorage.removeItem(attemptKey);
        return null;
    }
}

function isValidAttemptState(attempt, quiz) {
    if (attempt.version !== ATTEMPT_VERSION || !attempt.orders || typeof attempt.orders !== "object") {
        return false;
    }

    return getQuestionItems(quiz.sections).every((question) => {
        const expected = question.options.map((option) => option.letter);
        const stored = attempt.orders[question.number];
        if (!Array.isArray(stored) || stored.length !== expected.length) return false;
        const expectedSet = new Set(expected);
        return stored.every((letter) => expectedSet.has(letter)) && new Set(stored).size === expectedSet.size;
    });
}

function buildIdentityAttemptState(quiz) {
    const orders = {};
    getQuestionItems(quiz.sections).forEach((question) => {
        orders[question.number] = question.options.map((option) => option.letter);
    });

    return {
        version: ATTEMPT_VERSION,
        seed: "legacy-identity",
        orders
    };
}

function buildBalancedAttemptState(quiz) {
    const questions = getQuestionItems(quiz.sections);
    const seed = makeAttemptSeed();
    const rng = createSeededRandom(seed);
    const targetLetters = buildBalancedTargetLetters(questions.length, rng);
    const orders = {};

    questions.forEach((question, index) => {
        const answer = quiz.answers.get(question.number);
        const correctOriginal = answer.correct;
        const targetDisplay = targetLetters[index];
        const targetIndex = OPTION_LETTERS.indexOf(targetDisplay);
        const distractors = shuffleArray(
            question.options
                .map((option) => option.letter)
                .filter((letter) => letter !== correctOriginal),
            rng
        );
        const order = [];
        let distractorIndex = 0;

        OPTION_LETTERS.forEach((_, displayIndex) => {
            order[displayIndex] = displayIndex === targetIndex
                ? correctOriginal
                : distractors[distractorIndex++];
        });

        orders[question.number] = order;
    });

    return {
        version: ATTEMPT_VERSION,
        seed,
        orders
    };
}

function buildBalancedTargetLetters(total, rng) {
    const counts = {};
    const base = Math.floor(total / OPTION_LETTERS.length);
    const remainder = total % OPTION_LETTERS.length;
    const extras = shuffleArray([...OPTION_LETTERS], rng).slice(0, remainder);

    OPTION_LETTERS.forEach((letter) => {
        counts[letter] = base + (extras.includes(letter) ? 1 : 0);
    });

    const targets = [];
    while (targets.length < total) {
        const last = targets[targets.length - 1];
        const beforeLast = targets[targets.length - 2];
        const candidates = OPTION_LETTERS.filter((letter) => (
            counts[letter] > 0 && !(letter === last && letter === beforeLast)
        ));
        const maxCount = Math.max(...candidates.map((letter) => counts[letter]));
        const strongest = candidates.filter((letter) => counts[letter] === maxCount);
        const next = strongest[Math.floor(rng() * strongest.length)];
        targets.push(next);
        counts[next] -= 1;
    }

    return targets;
}

function makeAttemptSeed() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function createSeededRandom(seed) {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return function random() {
        hash += 0x6D2B79F5;
        let value = hash;
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffleArray(items, rng) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(rng() * (index + 1));
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
}

function getHeadingBlocks(text, level) {
    const marker = "#".repeat(level);
    const regex = new RegExp(`^${marker}\\s+(.+)$`, "gm");
    const matches = [...text.matchAll(regex)];

    return matches.map((match, index) => {
        const start = match.index + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
        return {
            title: match[1].trim(),
            body: text.slice(start, end).trim()
        };
    });
}

function getQuestionItems(sections) {
    return sections.flatMap((section) => section.items)
        .filter((item) => item.type === "question");
}

function getQuestionNumbers(sections) {
    return getQuestionItems(sections).map((item) => item.number);
}

function getRoundStorageKey(roundId) {
    return `${STORAGE_NAMESPACE}-round-${roundId}`;
}

function getRoundConfig(roundId) {
    return ROUND_LINKS.find((round) => round.id === roundId) || null;
}

function getRoundSourceId(roundId) {
    return getRoundConfig(roundId)?.sourceRoundId || roundId;
}

function getRoundLabel(roundId) {
    return getRoundConfig(roundId)?.label || `${roundId}회차`;
}

function buildIbtCandidateNumber(roundId) {
    const digits = String(roundId || "1").replace(/\D/g, "") || "1";
    return `IBT-${digits.padStart(4, "0")}`;
}

function getLegacyRoundStorageKey(roundId) {
    return `${LEGACY_STORAGE_NAMESPACE}-round-${roundId}`;
}

function getRoundSummaryKey(roundId) {
    return `${STORAGE_NAMESPACE}-summary-${roundId}`;
}

function getLegacyRoundSummaryKey(roundId) {
    return `${LEGACY_STORAGE_NAMESPACE}-summary-${roundId}`;
}

function getAttemptStorageKey(roundId) {
    return `${STORAGE_NAMESPACE}-attempt-${roundId}`;
}

function readStoredSelections(storageKey) {
    let raw = localStorage.getItem(storageKey);
    if (!raw) {
        const roundId = storageKey.match(/round-([\w-]+)$/)?.[1];
        const legacyKey = roundId ? getLegacyRoundStorageKey(roundId) : storageKey.replace(STORAGE_NAMESPACE, LEGACY_STORAGE_NAMESPACE);
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
            raw = legacyRaw;
            localStorage.setItem(storageKey, legacyRaw);
        }
    }
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        localStorage.removeItem(storageKey);
        return {};
    }
}

function loadRoundSummary(roundId) {
    let raw = localStorage.getItem(getRoundSummaryKey(roundId));
    if (!raw) {
        const legacyRaw = localStorage.getItem(getLegacyRoundSummaryKey(roundId));
        if (legacyRaw) {
            raw = legacyRaw;
            localStorage.setItem(getRoundSummaryKey(roundId), legacyRaw);
        }
    }
    if (!raw) {
        return {
            attempts: 0,
            bestScore: null,
            averageScore: null,
            lastScore: null,
            totalScore: null,
            totalQuestions: 0,
            lastSignature: null
        };
    }

    try {
        const parsed = JSON.parse(raw);
        const attempts = Number(parsed.attempts) || 0;
        const bestScore = Number.isFinite(parsed.bestScore) ? parsed.bestScore : null;
        const lastScore = Number.isFinite(parsed.lastScore) ? parsed.lastScore : null;
        const storedAverage = Number.isFinite(parsed.averageScore) ? parsed.averageScore : null;
        let totalScore = Number.isFinite(parsed.totalScore) ? parsed.totalScore : null;

        if (totalScore === null && storedAverage !== null && attempts > 0) {
            totalScore = storedAverage * attempts;
        }
        if (totalScore === null && lastScore !== null && attempts > 0) {
            totalScore = lastScore * attempts;
        }

        const averageScore = attempts > 0 && totalScore !== null
            ? Number((totalScore / attempts).toFixed(1))
            : null;

        return {
            attempts,
            bestScore,
            averageScore,
            lastScore,
            totalScore,
            totalQuestions: Number(parsed.totalQuestions) || 0,
            lastSignature: typeof parsed.lastSignature === "string" ? parsed.lastSignature : null
        };
    } catch {
        localStorage.removeItem(getRoundSummaryKey(roundId));
        return {
            attempts: 0,
            bestScore: null,
            averageScore: null,
            lastScore: null,
            totalScore: null,
            totalQuestions: 0,
            lastSignature: null
        };
    }
}

function saveRoundSummary(roundId, result, totalQuestions, signature) {
    const summary = loadRoundSummary(roundId);
    if (summary.lastSignature === signature && summary.lastScore === result.percent) return;

    const nextAttempts = summary.attempts + 1;
    const previousTotalScore = summary.totalScore ?? (summary.lastScore !== null && summary.attempts > 0
        ? summary.lastScore * summary.attempts
        : 0);
    const nextTotalScore = previousTotalScore + result.percent;
    const nextBest = summary.bestScore === null ? result.percent : Math.max(summary.bestScore, result.percent);
    const nextAverage = Number((nextTotalScore / nextAttempts).toFixed(1));

    localStorage.setItem(getRoundSummaryKey(roundId), JSON.stringify({
        attempts: nextAttempts,
        bestScore: nextBest,
        averageScore: nextAverage,
        lastScore: result.percent,
        totalScore: nextTotalScore,
        totalQuestions,
        lastSignature: signature
    }));
}

function getRoundQuestionTotal(roundId) {
    const markdown = window.PRIVATE_QUIZ_MARKDOWN?.[getRoundSourceId(roundId)];
    if (typeof markdown !== "string" || !markdown.trim()) return 0;
    const quiz = parseQuizMarkdown(markdown);
    return getQuestionNumbers(quiz.sections).length;
}

function validateQuiz(quiz) {
    const questionNumbers = getQuestionNumbers(quiz.sections);
    const duplicates = questionNumbers.filter((number, index) => questionNumbers.indexOf(number) !== index);
    if (duplicates.length) {
        throw new Error(`중복 문항 번호가 있습니다: ${[...new Set(duplicates)].join(", ")}`);
    }

    const missingAnswers = questionNumbers.filter((number) => !quiz.answers.has(number));
    if (missingAnswers.length) {
        throw new Error(`정답이 없는 문항이 있습니다: ${missingAnswers.join(", ")}`);
    }

    getQuestionItems(quiz.sections).forEach((question) => {
        const letters = question.options.map((option) => option.letter);
        const uniqueLetters = new Set(letters);
        if (question.options.length !== 4 || uniqueLetters.size !== 4 || letters.join("") !== "ABCD") {
            throw new Error(`문항 ${question.number}의 선택지 형식이 올바르지 않습니다.`);
        }
        const answer = quiz.answers.get(question.number);
        if (!uniqueLetters.has(answer.correct)) {
            throw new Error(`문항 ${question.number}의 정답 선택지가 존재하지 않습니다.`);
        }
    });
}

function renderMarkdownish(text) {
    if (!text) return "";
    return text
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map(renderBlock)
        .join("");
}

function renderBlock(block) {
    const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    if (!lines.length) return "";

    if (lines.every((line) => line.startsWith("- "))) {
        return `<ul>${lines.map((line) => `<li>${renderInline(line.slice(2).trim())}</li>`).join("")}</ul>`;
    }

    return `<p>${lines.map((line) => renderInline(line)).join("<br>")}</p>`;
}

function renderInline(text) {
    return escapeHtml(text)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/==(.+?)==/g, '<span class="text-underline">$1</span>');
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function renderLandingIndex() {
    const container = document.querySelector(".round-board");
    if (!container) return;

    container.innerHTML = ROUND_LINKS.map((round) => {
        const isEnabled = round.enabled !== false;
        const totalQuestions = getRoundQuestionTotal(round.id);
        const savedSelections = readStoredSelections(getRoundStorageKey(round.id));
        const answeredCount = Object.keys(savedSelections).length;
        const summary = loadRoundSummary(round.id);
        const attemptText = summary.attempts > 0 ? `응시 ${summary.attempts}회` : "응시 전";
        const bestText = summary.bestScore === null ? "최고 점수 없음" : `최고 ${formatScore(summary.bestScore)}%`;
        const averageText = summary.averageScore === null ? "평균 점수 없음" : `평균 ${formatScore(summary.averageScore)}%`;
        const progressText = answeredCount > 0
            ? `이어 풀기 ${answeredCount}/${totalQuestions}`
            : `진행 0/${totalQuestions}`;
        const stateText = isEnabled
            ? answeredCount > 0 ? "이어 풀기 가능" : summary.attempts > 0 ? "다시 풀기" : "새로 시작"
            : "비활성화";
        const cardClass = isEnabled
            ? answeredCount > 0 ? " is-in-progress" : summary.attempts > 0 ? " is-attempted" : ""
            : " is-disabled";
        const cardBody = `
                <span class="round-card__label">${round.label}</span>
                <span class="round-card__badge">${stateText}</span>
                ${isEnabled
                    ? `
                        <span class="round-card__status">${attemptText}</span>
                        <span class="round-card__status">${bestText}</span>
                        <span class="round-card__status">${averageText}</span>
                        <span class="round-card__status">${progressText}</span>
                    `
                    : '<span class="round-card__status">현재 1~2회차만 열려 있습니다.</span>'}
        `;

        if (!isEnabled) {
            return `
                <article class="round-card${cardClass}" aria-disabled="true">
                    ${cardBody}
                </article>
            `;
        }

        return `
            <a class="round-card${cardClass}" href="${round.href}">
                ${cardBody}
            </a>
        `;
    }).join("");
}

function renderRoundNav() {
    const container = document.getElementById("roundNav");
    if (!container) return;

    const currentRound = document.body.dataset.roundId;
    container.innerHTML = ROUND_LINKS.map((round) => {
        const activeClass = round.id === currentRound ? " is-active" : "";
        if (round.enabled === false) {
            return `
                <span class="${`is-disabled${activeClass}`.trim()}" aria-disabled="true">
                    <span>${round.label}</span>
                </span>
            `;
        }
        return `
            <a href="${round.href}" class="${activeClass.trim()}">
                <span>${round.label}</span>
            </a>
        `;
    }).join("");
}

function formatScore(value) {
    if (!Number.isFinite(value)) return "-";
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function ensureGradeSummaryModal() {
    let modal = document.getElementById("gradeSummaryModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "gradeSummaryModal";
    modal.className = "summary-modal";
    modal.hidden = true;
    modal.innerHTML = `
        <div class="summary-modal__backdrop" data-summary-close="backdrop"></div>
        <div class="summary-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="summaryModalTitle">
            <div class="summary-modal__head">
                <h2 id="summaryModalTitle">채점 결과</h2>
                <button class="summary-modal__close" type="button" data-summary-close="button" aria-label="닫기">닫기</button>
            </div>
            <div class="summary-modal__body">
                <p id="summaryModalScore" class="summary-modal__score"></p>
                <p id="summaryModalGuide" class="summary-modal__guide"></p>
                <div id="summaryModalGrid" class="summary-grid" aria-label="문항별 정오답 요약"></div>
            </div>
            <div class="summary-modal__foot">
                <button class="action-button action-button--primary" type="button" data-summary-close="primary">상세 피드백 보기</button>
            </div>
        </div>
    `;

    modal.addEventListener("click", (event) => {
        if (!event.target.closest("[data-summary-close]")) return;
        closeGradeSummaryModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        const openModal = document.getElementById("gradeSummaryModal");
        if (!openModal || openModal.hidden) return;
        closeGradeSummaryModal();
    });

    document.body.appendChild(modal);
    return modal;
}

function showGradeSummaryModal(result) {
    const modal = ensureGradeSummaryModal();
    const score = modal.querySelector("#summaryModalScore");
    const guide = modal.querySelector("#summaryModalGuide");
    const grid = modal.querySelector("#summaryModalGrid");
    const closeButton = modal.querySelector('[data-summary-close="primary"]');

    if (score) {
        score.textContent = `${result.totalCount}문항 중 ${result.correctCount}문항 정답, ${result.percent}%`;
    }

    if (guide) {
        guide.textContent = result.wrongCount === 0
            ? "모든 문제를 맞았습니다. 팝업을 닫고 위에서부터 피드백을 읽어 보세요."
            : "문항별 결과를 먼저 확인한 뒤, 팝업을 닫고 위에서부터 상세 피드백을 읽어 보세요.";
    }

    if (grid) {
        grid.innerHTML = result.questionResults.map((item) => `
            <div class="summary-chip ${item.isCorrect ? "is-correct" : "is-wrong"}" aria-label="Q${item.number} ${item.mark}">
                <span class="summary-chip__number">Q${item.number}</span>
                <span class="summary-chip__mark">${item.mark}</span>
            </div>
        `).join("");
    }

    modal.hidden = false;
    document.body.classList.add("has-summary-modal");
    if (closeButton) closeButton.focus();
}

function closeGradeSummaryModal({ scrollTop = true } = {}) {
    const modal = document.getElementById("gradeSummaryModal");
    if (!modal || modal.hidden) {
        if (scrollTop) scrollToQuizTop();
        return;
    }

    modal.hidden = true;
    document.body.classList.remove("has-summary-modal");
    if (scrollTop) scrollToQuizTop();
}

function scrollToQuizTop() {
    window.scrollTo({ top: 0, behavior: "auto" });
    const progressText = document.getElementById("progressText");
    if (progressText) {
        progressText.setAttribute("tabindex", "-1");
        progressText.focus({ preventScroll: true });
    }
}

window.renderQuiz = renderQuiz;
window.wireQuizInteractions = wireQuizInteractions;
window.gradeQuiz = gradeQuiz;
window.buildFeedbackHtml = buildFeedbackHtml;
window.showGradeSummaryModal = showGradeSummaryModal;
window.closeGradeSummaryModal = closeGradeSummaryModal;
window.buildEasyFeedbackText = buildEasyFeedbackText;
window.renderInline = renderInline;
window.escapeHtml = escapeHtml;
window.getOptionText = getOptionText;
window.getDisplayLetter = getDisplayLetter;
