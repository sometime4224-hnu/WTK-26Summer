const ROUND_LINKS = [
    { id: "1", href: "./round1.html", label: "1회차" },
    { id: "2", href: "./round2.html", label: "2회차" },
    { id: "3", href: "./round3.html", label: "3회차" },
    { id: "4", href: "./round4.html", label: "4회차" }
];

const STORAGE_NAMESPACE = "final-vocab-grammar-mock";
const LEGACY_STORAGE_NAMESPACE = "private-listening-review";

document.addEventListener("DOMContentLoaded", () => {
    renderLandingIndex();
    renderRoundNav();

    const pageSource = document.body.dataset.quizSource;
    const roundId = document.body.dataset.roundId;
    if (!pageSource && !roundId) return;

    initializeQuiz(pageSource, roundId).catch((error) => {
        const errorCard = document.getElementById("loadError");
        if (!errorCard) return;
        errorCard.hidden = false;
        errorCard.textContent = `퀴즈를 불러오지 못했습니다. ${error.message}`;
    });
});

function renderLandingIndex() {
    const container = document.querySelector(".round-board");
    if (!container) return;

    container.innerHTML = ROUND_LINKS.map((round) => {
        const totalQuestions = getRoundQuestionTotal(round.id);
        const savedSelections = readStoredSelections(getRoundStorageKey(round.id));
        const answeredCount = Object.keys(savedSelections).length;
        const summary = loadRoundSummary(round.id);
        const attemptText = summary.attempts > 0 ? `응시 ${summary.attempts}회` : "응시 전";
        const bestText = summary.bestScore === null ? "최고 점수 없음" : `최고 ${summary.bestScore}%`;
        const progressText = answeredCount > 0
            ? `이어 풀기 ${answeredCount}/${totalQuestions}`
            : `진행 0/${totalQuestions}`;
        const stateText = answeredCount > 0 ? "이어 풀기 가능" : "새로 시작";
        const cardClass = answeredCount > 0 ? " is-in-progress" : summary.attempts > 0 ? " is-attempted" : "";

        return `
            <a class="round-card${cardClass}" href="${round.href}">
                <span class="round-card__label">${round.label}</span>
                <span class="round-card__badge">${stateText}</span>
                <span class="round-card__status">${attemptText}</span>
                <span class="round-card__status">${bestText}</span>
                <span class="round-card__status">${progressText}</span>
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
        return `
            <a href="${round.href}" class="${activeClass.trim()}">
                <span>${round.label}</span>
            </a>
        `;
    }).join("");
}

async function initializeQuiz(sourcePath, roundId) {
    const markdown = await loadQuizMarkdown(sourcePath, roundId);
    const quiz = parseQuizMarkdown(markdown);
    validateQuiz(quiz);
    renderQuiz(quiz);
    wireQuizInteractions(quiz);
}

async function loadQuizMarkdown(sourcePath, roundId) {
    const embeddedMarkdown = window.PRIVATE_QUIZ_MARKDOWN?.[roundId];
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

    const sections = getHeadingBlocks(questionPart, 2)
        .filter((section) => section.title !== "정답 및 짧은 해설")
        .map((section) => parseSection(section.title, section.body));

    return {
        title,
        introHtml: renderMarkdownish(introRaw),
        sections,
        answers: parseAnswers(tailPart),
        focusItems: parseFocusItems(tailPart)
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

function renderQuiz(quiz) {
    const questionCount = getQuestionNumbers(quiz.sections).length;
    const meta = document.getElementById("quizMeta");
    const intro = document.getElementById("quizIntro");
    const sectionsRoot = document.getElementById("quizSections");
    const progressText = document.getElementById("progressText");
    const focusCard = document.getElementById("focusCard");
    const focusList = document.getElementById("focusList");

    if (meta) {
        meta.textContent = `총 ${questionCount}문항`;
    }

    if (intro) {
        intro.innerHTML = `
            <h2>${escapeHtml(quiz.title)}</h2>
            ${quiz.introHtml || "<p>문항을 읽고 알맞은 답을 골라 보세요.</p>"}
        `;
    }

    if (progressText) {
        progressText.textContent = `0 / ${questionCount}`;
    }

    if (focusCard && focusList && quiz.focusItems.length) {
        focusCard.hidden = false;
        focusList.innerHTML = quiz.focusItems
            .map((item) => `<div class="focus-item">${renderInline(item)}</div>`)
            .join("");
    }

    sectionsRoot.innerHTML = quiz.sections.map((section) => renderSection(section, quiz.answers)).join("");
}

function renderSection(section, answers) {
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
                    return `
                        <article class="question-card" data-question="${item.number}">
                            <div class="question-card__head">
                                <div class="question-number">Q${item.number}</div>
                                <div class="question-stem">${item.stemHtml}</div>
                            </div>
                            <div class="option-list">
                                ${item.options.map((option) => `
                                    <div class="option" data-choice="${option.letter}" data-correct="${answer.correct === option.letter}">
                                        <input id="q${item.number}-${option.letter}" class="option-input" type="radio" name="q${item.number}" value="${option.letter}">
                                        <label for="q${item.number}-${option.letter}">
                                            <span class="option-letter">${option.letter}</span>
                                            <span>${renderInline(option.text)}</span>
                                        </label>
                                    </div>
                                `).join("")}
                            </div>
                            <div class="feedback-panel" hidden></div>
                        </article>
                    `;
                }).join("")}
            </div>
        </section>
    `;
}

function wireQuizInteractions(quiz) {
    const roundId = document.body.dataset.roundId;
    const storageKey = getRoundStorageKey(roundId);
    const root = document.getElementById("quizSections");
    const gradeButton = document.getElementById("gradeButton");
    const resetButton = document.getElementById("resetButton");
    const totalQuestions = getQuestionNumbers(quiz.sections).length;

    restoreAnswers(storageKey);
    updateProgress(totalQuestions);

    root.addEventListener("change", (event) => {
        if (!event.target.classList.contains("option-input")) return;
        saveAnswers(storageKey);
        clearFeedback();
        updateProgress(totalQuestions);
    });

    gradeButton.addEventListener("click", () => {
        const result = gradeQuiz(quiz.answers);
        saveAnswers(storageKey);
        saveRoundSummary(roundId, result, totalQuestions);
    });

    resetButton.addEventListener("click", () => {
        if (!window.confirm("선택한 답을 모두 지우고 처음부터 다시 풀까요?")) return;
        document.querySelectorAll(".option-input:checked").forEach((input) => {
            input.checked = false;
        });
        localStorage.removeItem(storageKey);
        clearFeedback();
        updateProgress(totalQuestions);
    });
}

function saveAnswers(storageKey) {
    const selections = {};
    document.querySelectorAll(".question-card").forEach((card) => {
        const number = card.dataset.question;
        const checked = card.querySelector(".option-input:checked");
        if (checked) selections[number] = checked.value;
    });
    localStorage.setItem(storageKey, JSON.stringify(selections));
}

function restoreAnswers(storageKey) {
    const saved = readStoredSelections(storageKey);
    try {
        Object.entries(saved).forEach(([number, letter]) => {
            const input = document.querySelector(`#q${number}-${letter}`);
            if (input) input.checked = true;
        });
    } catch {
        localStorage.removeItem(storageKey);
    }
}

function gradeQuiz(answerMap) {
    let correctCount = 0;
    let answeredCount = 0;

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

        if (!checked) {
            card.classList.add("is-unanswered");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-bad";
            feedback.innerHTML = `<strong>미응답</strong><br>정답은 <code>${answer.correct}</code>입니다. ${renderInline(answer.explanation)}`;
            return;
        }

        answeredCount += 1;

        if (checked.value === answer.correct) {
            correctCount += 1;
            card.classList.add("is-correct");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-good";
            feedback.innerHTML = `<strong>정답</strong><br>${renderInline(answer.explanation)}`;
            return;
        }

        const wrongOption = card.querySelector(`.option[data-choice="${checked.value}"]`);
        if (wrongOption) wrongOption.classList.add("is-wrong-answer");
        card.classList.add("is-incorrect");
        feedback.hidden = false;
        feedback.className = "feedback-panel is-bad";
        feedback.innerHTML = `<strong>오답</strong><br>정답은 <code>${answer.correct}</code>입니다. ${renderInline(answer.explanation)}`;
    });

    const totalCount = answerMap.size;
    const percent = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const progressFill = document.getElementById("progressFill");

    if (progressText) progressText.textContent = `${correctCount} / ${totalCount}`;
    if (scoreText) scoreText.textContent = `응답 ${answeredCount}문항 · 정답률 ${percent}%`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    return { correctCount, answeredCount, totalCount, percent };
}

function clearFeedback() {
    document.querySelectorAll(".question-card").forEach((card) => {
        card.classList.remove("is-correct", "is-incorrect", "is-unanswered");
        card.querySelectorAll(".option").forEach((option) => {
            option.classList.remove("is-correct-answer", "is-wrong-answer");
        });
        const feedback = card.querySelector(".feedback-panel");
        feedback.hidden = true;
        feedback.className = "feedback-panel";
        feedback.innerHTML = "";
    });
}

function updateProgress(totalCount) {
    const answeredCount = document.querySelectorAll(".option-input:checked").length;
    const percent = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0;
    const progressText = document.getElementById("progressText");
    const scoreText = document.getElementById("scoreText");
    const progressFill = document.getElementById("progressFill");

    if (progressText) progressText.textContent = `${answeredCount} / ${totalCount}`;
    if (scoreText) {
        scoreText.textContent = answeredCount === totalCount
            ? "채점하세요."
            : "답을 고르세요.";
    }
    if (progressFill) progressFill.style.width = `${percent}%`;
}

function getHeadingBlocks(text, level) {
    if (!text) return [];

    const marker = "#".repeat(level);
    const regex = new RegExp(`^${marker}\\s+(.+)$`, "gm");
    const matches = [...text.matchAll(regex)];

    return matches.map((match, index) => {
        const start = match.index + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
        return {
            title: match[1].trim(),
            body: text.slice(start, end).replace(/^\n+/, "").trim()
        };
    });
}

function getQuestionNumbers(sections) {
    return sections.flatMap((section) => section.items)
        .filter((item) => item.type === "question")
        .map((item) => item.number);
}

function getRoundStorageKey(roundId) {
    return `${STORAGE_NAMESPACE}-round-${roundId}`;
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

function readStoredSelections(storageKey) {
    let raw = localStorage.getItem(storageKey);
    if (!raw) {
        const roundId = storageKey.match(/round-(\d+)$/)?.[1];
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
    const raw = localStorage.getItem(getRoundSummaryKey(roundId));
    if (!raw) {
        return { attempts: 0, bestScore: null, lastScore: null, totalQuestions: 0 };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            attempts: Number(parsed.attempts) || 0,
            bestScore: Number.isFinite(parsed.bestScore) ? parsed.bestScore : null,
            lastScore: Number.isFinite(parsed.lastScore) ? parsed.lastScore : null,
            totalQuestions: Number(parsed.totalQuestions) || 0
        };
    } catch {
        localStorage.removeItem(getRoundSummaryKey(roundId));
        return { attempts: 0, bestScore: null, lastScore: null, totalQuestions: 0 };
    }
}

function saveRoundSummary(roundId, result, totalQuestions) {
    const summary = loadRoundSummary(roundId);
    const nextBest = summary.bestScore === null ? result.percent : Math.max(summary.bestScore, result.percent);
    const nextSummary = {
        attempts: summary.attempts + 1,
        bestScore: nextBest,
        lastScore: result.percent,
        totalQuestions
    };
    localStorage.setItem(getRoundSummaryKey(roundId), JSON.stringify(nextSummary));
}

function getRoundQuestionTotal(roundId) {
    const markdown = window.PRIVATE_QUIZ_MARKDOWN?.[roundId];
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
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function wireQuizInteractions(quiz) {
    const roundId = document.body.dataset.roundId;
    const storageKey = getRoundStorageKey(roundId);
    const root = document.getElementById("quizSections");
    const gradeButtons = [...document.querySelectorAll('[data-action="grade"]')];
    const resetButtons = [...document.querySelectorAll('[data-action="reset"]')];
    const totalQuestions = getQuestionNumbers(quiz.sections).length;

    restoreAnswers(storageKey);
    updateProgress(totalQuestions);

    root.addEventListener("change", (event) => {
        if (!event.target.classList.contains("option-input")) return;
        saveAnswers(storageKey);
        clearFeedback();
        updateProgress(totalQuestions);
    });

    root.addEventListener("click", (event) => {
        const toggleButton = event.target.closest(".feedback-translate-toggle");
        if (!toggleButton) return;

        const feedback = toggleButton.closest(".feedback-panel");
        const translation = feedback?.querySelector(".feedback-translation");
        if (!translation) return;

        const shouldOpen = translation.hidden;
        translation.hidden = !shouldOpen;
        toggleButton.textContent = shouldOpen ? "한국어만 보기" : "베트남어 보기";
    });

    gradeButtons.forEach((button) => button.addEventListener("click", () => {
        if (!isReadyToGrade(totalQuestions)) {
            updateProgress(totalQuestions);
            focusFirstUnansweredQuestion();
            return;
        }

        saveAnswers(storageKey);
        const result = gradeQuiz(quiz.answers);
        const signature = getAnswerSignature();
        saveRoundSummary(roundId, result, totalQuestions, signature);
    }));

    resetButtons.forEach((button) => button.addEventListener("click", () => {
        if (!window.confirm("선택한 답을 모두 지우고 처음부터 다시 풀까요?")) return;
        document.querySelectorAll(".option-input:checked").forEach((input) => {
            input.checked = false;
        });
        localStorage.removeItem(storageKey);
        clearFeedback();
        updateProgress(totalQuestions);
    }));
}

function saveAnswers(storageKey) {
    const selections = collectSelections();
    localStorage.setItem(storageKey, JSON.stringify(selections));
    return selections;
}

function gradeQuiz(answerMap) {
    let correctCount = 0;
    let answeredCount = 0;

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

        const correctText = getOptionText(card, answer.correct);
        const selectedText = checked ? getOptionText(card, checked.value) : "";

        if (!checked) {
            card.classList.add("is-unanswered");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-bad";
            feedback.innerHTML = buildFeedbackHtml({
                status: "unanswered",
                correctLetter: answer.correct,
                correctText,
                explanation: answer.explanation
            });
            return;
        }

        answeredCount += 1;

        if (checked.value === answer.correct) {
            correctCount += 1;
            card.classList.add("is-correct");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-good";
            feedback.innerHTML = buildFeedbackHtml({
                status: "correct",
                correctLetter: answer.correct,
                correctText,
                selectedLetter: checked.value,
                selectedText,
                explanation: answer.explanation
            });
            return;
        }

        const wrongOption = card.querySelector(`.option[data-choice="${checked.value}"]`);
        if (wrongOption) wrongOption.classList.add("is-wrong-answer");
        card.classList.add("is-incorrect");
        feedback.hidden = false;
        feedback.className = "feedback-panel is-bad";
        feedback.innerHTML = buildFeedbackHtml({
            status: "incorrect",
            correctLetter: answer.correct,
            correctText,
            selectedLetter: checked.value,
            selectedText,
            explanation: answer.explanation
        });
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

    return { correctCount, answeredCount, totalCount, percent };
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
            ? "모든 문제를 풀었습니다. 채점하세요."
            : `아직 ${remainingCount}문항 남았습니다. 모두 풀면 채점할 수 있습니다.`;
    }
    if (progressFill) progressFill.style.width = `${percent}%`;
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

function getAnswerSignature() {
    return JSON.stringify(collectSelections());
}

function setGradeButtonsState(answeredCount, totalCount) {
    const readyToGrade = totalCount > 0 && answeredCount === totalCount;
    document.querySelectorAll('[data-action="grade"]').forEach((button) => {
        button.disabled = !readyToGrade;
        button.setAttribute("aria-disabled", String(!readyToGrade));
    });
    return readyToGrade;
}

function isReadyToGrade(totalCount) {
    return document.querySelectorAll(".option-input:checked").length === totalCount && totalCount > 0;
}

function focusFirstUnansweredQuestion() {
    const firstUnanswered = [...document.querySelectorAll(".question-card")]
        .find((card) => !card.querySelector(".option-input:checked"));
    if (!firstUnanswered) return;

    firstUnanswered.scrollIntoView({ behavior: "smooth", block: "center" });
}

function getOptionText(card, letter) {
    const value = card.querySelector(`.option[data-choice="${letter}"] label span:last-child`);
    return value ? value.textContent.trim() : letter;
}

function buildFeedbackHtml({ status, correctLetter, correctText, selectedLetter = "", selectedText = "", explanation }) {
    const heading = status === "correct"
        ? "정답이에요."
        : status === "incorrect"
            ? "오답이에요."
            : "아직 답을 고르지 않았어요.";
    const guide = status === "correct"
        ? "잘했습니다. 왜 맞는지 한 번 더 읽어 보세요."
        : status === "incorrect"
            ? "괜찮아요. 정답과 이유를 같이 보면 바로 정리할 수 있어요."
            : "정답과 이유를 먼저 보고 다시 풀어 보세요.";
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
    const token = `\`${correctText}\``;
    const normalized = normalizeExplanationText(explanation);

    if (explanation.includes("가정")) {
        return `이 문제는 가정을 말할 때 쓰는 문법을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("걱정") || explanation.includes("염려")) {
        return `이 문제는 걱정하는 마음을 말하는 문장이에요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("목적")) {
        return `이 문제는 목적을 말하는 표현을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("추측")) {
        return `이 문제는 보고 판단하는 추측 표현을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("반복")) {
        return `이 문제는 과거에 자주 하던 일을 말하는 표현을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("진행 중")) {
        return `이 문제는 지금 하고 있는 행동을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("선택")) {
        return `이 문제는 둘 중 아무거나 괜찮을 때 쓰는 표현을 묻고 있어요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("뜻이 같은 말")) {
        return `이 문제는 뜻이 비슷한 말을 찾는 문제예요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("바꿔 쓸 수 있는 말")) {
        return `이 문제는 같은 뜻으로 바꿔 쓰는 말을 찾는 문제예요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("글은") || explanation.includes("글에서")) {
        return `이 문제는 글의 내용과 맞는 답을 찾는 문제예요. 그래서 ${token}이 맞아요. ${normalized}`;
    }
    if (explanation.includes("자연스럽")) {
        return `문장과 가장 잘 어울리는 말이 ${token}예요. ${normalized}`;
    }
    if (explanation.includes("쓴다") || explanation.includes("씁니다")) {
        return `이 상황에서는 ${token}를 써요. ${normalized}`;
    }
    if (explanation.includes("맞다") || explanation.includes("맞습니다")) {
        return `이 문장에는 ${token}가 맞아요. ${normalized}`;
    }

    return `정답은 ${token}예요. ${normalized}`;
}

function normalizeExplanationText(explanation) {
    let text = explanation.trim().replace(/\s+/g, " ");
    const replacements = [
        ["맞습니다.", "맞아요."],
        ["맞습니다", "맞아요"],
        ["자연스럽습니다.", "자연스러워요."],
        ["자연스럽습니다", "자연스러워요"],
        ["가장 자연스럽습니다.", "가장 자연스러워요."],
        ["가장 자연스럽습니다", "가장 자연스러워요"],
        ["연결됩니다.", "잘 이어져요."],
        ["연결됩니다", "잘 이어져요"],
        ["나타냅니다.", "나타내요."],
        ["나타냅니다", "나타내요"],
        ["설명합니다.", "설명해요."],
        ["설명합니다", "설명해요"],
        ["말합니다.", "말해요."],
        ["말합니다", "말해요"],
        ["입니다.", "이에요."],
        ["입니다", "이에요"],
        ["라고 합니다.", "라고 해요."],
        ["라고 합니다", "라고 해요"],
        ["라고 한다.", "라고 해요."],
        ["라고 한다", "라고 해요"],
        ["를 씁니다.", "를 써요."],
        ["를 씁니다", "를 써요"],
        ["를 쓴다.", "를 써요."],
        ["를 쓴다", "를 써요"],
        ["가장 잘 드러난다.", "가장 잘 보여 줘요."],
        ["가장 잘 드러난다", "가장 잘 보여 줘요"],
        ["자연스럽다.", "자연스러워요."],
        ["자연스럽다", "자연스러워요"],
        ["맞다.", "맞아요."],
        ["맞다", "맞아요"],
        ["이다.", "이에요."],
        ["이다", "이에요"]
    ];

    replacements.forEach(([from, to]) => {
        text = text.replaceAll(from, to);
    });

    return text;
}

function buildVietnameseFeedbackText(status, correctLetter, correctText, selectedLetter, selectedText, explanation) {
    const lines = [];
    lines.push(status === "correct"
        ? "Bạn làm đúng."
        : status === "incorrect"
            ? "Bạn làm sai."
            : "Bạn chưa chọn đáp án.");
    lines.push(`Đáp án đúng: ${correctLetter}. \`${correctText}\`.`);
    lines.push(status === "unanswered"
        ? "Đáp án bạn chọn: chưa chọn."
        : `Đáp án bạn chọn: ${selectedLetter}. \`${selectedText}\`.`);
    lines.push(`Giải thích: ${buildVietnameseReason(correctText, explanation)}`);
    return lines.join(" ");
}

function buildVietnameseReason(correctText, explanation) {
    const token = `\`${correctText}\``;

    if (explanation.includes("가정")) return `Câu này hỏi ngữ pháp dùng khi nói giả định. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("걱정") || explanation.includes("염려")) return `Câu này nói về lo lắng hoặc sợ điều gì xảy ra. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("목적")) return `Câu này hỏi cách nói mục đích. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("추측")) return `Câu này hỏi cách suy đoán từ tình huống nhìn thấy. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("반복")) return `Câu này hỏi cách nói việc thường làm trong quá khứ. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("진행 중")) return `Câu này hỏi cách nói hành động đang diễn ra. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("선택")) return `Câu này hỏi cách nói chọn cái nào cũng được. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("뜻이 같은 말")) return `Đây là câu hỏi tìm từ có nghĩa giống nhau. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("바꿔 쓸 수 있는 말")) return `Đây là câu hỏi tìm cách nói có thể thay thế bằng cùng nghĩa. Vì vậy ${token} là đáp án đúng.`;
    if (explanation.includes("글은") || explanation.includes("글에서")) return `Dựa vào bài đọc, ${token} là đáp án đúng.`;
    if (explanation.includes("자연스럽")) return `Trong ngữ cảnh này, ${token} là cách nói tự nhiên nhất.`;
    if (explanation.includes("쓴다") || explanation.includes("씁니다")) return `Trong tình huống này, dùng ${token}.`;
    if (explanation.includes("맞다") || explanation.includes("맞습니다")) return `Trong câu này, ${token} là đáp án đúng.`;

    return `Trong câu này, ${token} là đáp án đúng.`;
}

function loadRoundSummary(roundId) {
    const raw = localStorage.getItem(getRoundSummaryKey(roundId));
    if (!raw) {
        return { attempts: 0, bestScore: null, lastScore: null, totalQuestions: 0, lastSignature: null };
    }

    try {
        const parsed = JSON.parse(raw);
        return {
            attempts: Number(parsed.attempts) || 0,
            bestScore: Number.isFinite(parsed.bestScore) ? parsed.bestScore : null,
            lastScore: Number.isFinite(parsed.lastScore) ? parsed.lastScore : null,
            totalQuestions: Number(parsed.totalQuestions) || 0,
            lastSignature: typeof parsed.lastSignature === "string" ? parsed.lastSignature : null
        };
    } catch {
        localStorage.removeItem(getRoundSummaryKey(roundId));
        return { attempts: 0, bestScore: null, lastScore: null, totalQuestions: 0, lastSignature: null };
    }
}

function saveRoundSummary(roundId, result, totalQuestions, signature) {
    const summary = loadRoundSummary(roundId);
    if (summary.lastSignature === signature && summary.lastScore === result.percent) {
        return;
    }

    const nextBest = summary.bestScore === null ? result.percent : Math.max(summary.bestScore, result.percent);
    const nextSummary = {
        attempts: summary.attempts + 1,
        bestScore: nextBest,
        lastScore: result.percent,
        totalQuestions,
        lastSignature: signature
    };
    localStorage.setItem(getRoundSummaryKey(roundId), JSON.stringify(nextSummary));
}

function renderLandingIndex() {
    const container = document.querySelector(".round-board");
    if (!container) return;

    container.innerHTML = ROUND_LINKS.map((round) => {
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
        const stateText = answeredCount > 0 ? "이어 풀기 가능" : summary.attempts > 0 ? "다시 풀기" : "새로 시작";
        const cardClass = answeredCount > 0 ? " is-in-progress" : summary.attempts > 0 ? " is-attempted" : "";

        return `
            <a class="round-card${cardClass}" href="${round.href}">
                <span class="round-card__label">${round.label}</span>
                <span class="round-card__badge">${stateText}</span>
                <span class="round-card__status">${attemptText}</span>
                <span class="round-card__status">${bestText}</span>
                <span class="round-card__status">${averageText}</span>
                <span class="round-card__status">${progressText}</span>
            </a>
        `;
    }).join("");
}

function buildEasyFeedbackText(correctText, explanation) {
    return rewriteExplanationForFeedback(explanation);
}

function rewriteExplanationForFeedback(explanation) {
    let text = explanation.trim().replace(/\s+/g, " ");

    const replacements = [
        [/`([^`]+)`이다\./g, "`$1`라고 해요."],
        [/`([^`]+)`이다/g, "`$1`라고 해요"],
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

function wireQuizInteractions(quiz) {
    const roundId = document.body.dataset.roundId;
    const storageKey = getRoundStorageKey(roundId);
    const root = document.getElementById("quizSections");
    const gradeButtons = [...document.querySelectorAll('[data-action="grade"]')];
    const resetButtons = [...document.querySelectorAll('[data-action="reset"]')];
    const totalQuestions = getQuestionNumbers(quiz.sections).length;

    ensureGradeSummaryModal();
    restoreAnswers(storageKey);
    updateProgress(totalQuestions);

    root.addEventListener("change", (event) => {
        if (!event.target.classList.contains("option-input")) return;
        saveAnswers(storageKey);
        clearFeedback();
        closeGradeSummaryModal({ scrollTop: false });
        updateProgress(totalQuestions);
    });

    root.addEventListener("click", (event) => {
        const toggleButton = event.target.closest(".feedback-translate-toggle");
        if (!toggleButton) return;

        const feedback = toggleButton.closest(".feedback-panel");
        const translation = feedback?.querySelector(".feedback-translation");
        if (!translation) return;

        const shouldOpen = translation.hidden;
        translation.hidden = !shouldOpen;
        toggleButton.textContent = shouldOpen ? "한국어만 보기" : "베트남어 보기";
    });

    gradeButtons.forEach((button) => button.addEventListener("click", () => {
        if (!isReadyToGrade(totalQuestions)) {
            updateProgress(totalQuestions);
            focusFirstUnansweredQuestion();
            return;
        }

        saveAnswers(storageKey);
        const result = gradeQuiz(quiz.answers);
        const signature = getAnswerSignature();
        saveRoundSummary(roundId, result, totalQuestions, signature);
        showGradeSummaryModal(result);
    }));

    resetButtons.forEach((button) => button.addEventListener("click", () => {
        if (!window.confirm("선택한 답을 모두 지우고 처음부터 다시 풀까요?")) return;
        document.querySelectorAll(".option-input:checked").forEach((input) => {
            input.checked = false;
        });
        localStorage.removeItem(storageKey);
        clearFeedback();
        closeGradeSummaryModal({ scrollTop: false });
        updateProgress(totalQuestions);
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

        const correctText = getOptionText(card, answer.correct);
        const selectedText = checked ? getOptionText(card, checked.value) : "";

        if (!checked) {
            card.classList.add("is-unanswered");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-bad";
            feedback.innerHTML = buildFeedbackHtml({
                status: "unanswered",
                correctLetter: answer.correct,
                correctText,
                explanation: answer.explanation
            });
            questionResults.push({ number, isCorrect: false, mark: "X" });
            return;
        }

        answeredCount += 1;

        if (checked.value === answer.correct) {
            correctCount += 1;
            card.classList.add("is-correct");
            feedback.hidden = false;
            feedback.className = "feedback-panel is-good";
            feedback.innerHTML = buildFeedbackHtml({
                status: "correct",
                correctLetter: answer.correct,
                correctText,
                selectedLetter: checked.value,
                selectedText,
                explanation: answer.explanation
            });
            questionResults.push({ number, isCorrect: true, mark: "O" });
            return;
        }

        const wrongOption = card.querySelector(`.option[data-choice="${checked.value}"]`);
        if (wrongOption) wrongOption.classList.add("is-wrong-answer");
        card.classList.add("is-incorrect");
        feedback.hidden = false;
        feedback.className = "feedback-panel is-bad";
        feedback.innerHTML = buildFeedbackHtml({
            status: "incorrect",
            correctLetter: answer.correct,
            correctText,
            selectedLetter: checked.value,
            selectedText,
            explanation: answer.explanation
        });
        questionResults.push({ number, isCorrect: false, mark: "X" });
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

    if (scrollTop) {
        scrollToQuizTop();
    }
}

function scrollToQuizTop() {
    window.scrollTo({ top: 0, behavior: "auto" });
    const progressText = document.getElementById("progressText");
    if (progressText) {
        progressText.setAttribute("tabindex", "-1");
        progressText.focus({ preventScroll: true });
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
    if (summary.lastSignature === signature && summary.lastScore === result.percent) {
        return;
    }

    const nextAttempts = summary.attempts + 1;
    const previousTotalScore = summary.totalScore ?? (summary.lastScore !== null && summary.attempts > 0
        ? summary.lastScore * summary.attempts
        : 0);
    const nextTotalScore = previousTotalScore + result.percent;
    const nextBest = summary.bestScore === null ? result.percent : Math.max(summary.bestScore, result.percent);
    const nextAverage = Number((nextTotalScore / nextAttempts).toFixed(1));

    const nextSummary = {
        attempts: nextAttempts,
        bestScore: nextBest,
        averageScore: nextAverage,
        lastScore: result.percent,
        totalScore: nextTotalScore,
        totalQuestions,
        lastSignature: signature
    };
    localStorage.setItem(getRoundSummaryKey(roundId), JSON.stringify(nextSummary));
}

function formatScore(value) {
    if (!Number.isFinite(value)) return "-";
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function buildEasyFeedbackText(correctText, explanation) {
    return rewriteExplanationForFeedback(explanation);
}

function rewriteExplanationForFeedback(explanation) {
    let text = explanation.trim().replace(/\s+/g, " ");

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
