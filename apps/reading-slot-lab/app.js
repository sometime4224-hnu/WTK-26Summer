(() => {
    "use strict";

    const DATA = window.READING_SLOT_LAB_DATA;
    const STORAGE_KEY = "korean3b.reading-slot-lab.v2";
    const ALL_FILTER = "all";
    const HINT_TYPES = {
        syntax: {
            label: "성분 힌트",
            heading: "성분 단서",
            className: "hint-mark--syntax"
        },
        logic: {
            label: "내용 힌트",
            heading: "내용 단서",
            className: "hint-mark--logic"
        }
    };

    if (!DATA) {
        return;
    }

    const componentMap = new Map(DATA.components.map((component) => [component.id, component]));
    const itemMap = new Map(DATA.items.map((item) => [item.id, item]));

    const refs = {};
    const state = {
        filter: ALL_FILTER,
        currentItemId: DATA.items[0]?.id || "",
        selections: {},
        drafts: {},
        checked: {},
        revealed: {}
    };
    let activeHintType = "";

    document.addEventListener("DOMContentLoaded", () => {
        cacheRefs();
        restoreState();
        render();
        bindEvents();
    });

    function cacheRefs() {
        refs.scoreText = document.getElementById("scoreText");
        refs.saveStatus = document.getElementById("saveStatus");
        refs.lessonFilters = document.getElementById("lessonFilters");
        refs.itemCountText = document.getElementById("itemCountText");
        refs.progressFill = document.getElementById("progressFill");
        refs.questionRail = document.getElementById("questionRail");
        refs.sourceLabel = document.getElementById("sourceLabel");
        refs.questionTitle = document.getElementById("questionTitle");
        refs.questionProgress = document.getElementById("questionProgress");
        refs.passageBox = document.getElementById("passageBox");
        refs.hintArea = document.getElementById("hintArea");
        refs.componentChoices = document.getElementById("componentChoices");
        refs.draftInput = document.getElementById("draftInput");
        refs.prevButton = document.getElementById("prevButton");
        refs.checkButton = document.getElementById("checkButton");
        refs.nextButton = document.getElementById("nextButton");
        refs.feedbackPanel = document.getElementById("feedbackPanel");
        refs.resultSummary = document.getElementById("resultSummary");
        refs.weakSummary = document.getElementById("weakSummary");
        refs.resetButton = document.getElementById("resetButton");
    }

    function bindEvents() {
        refs.lessonFilters.addEventListener("click", (event) => {
            const button = event.target.closest("[data-filter]");
            if (!button) return;
            state.filter = button.dataset.filter;
            activeHintType = "";
            const items = getFilteredItems();
            if (!items.some((item) => item.id === state.currentItemId)) {
                state.currentItemId = items[0]?.id || DATA.items[0].id;
            }
            saveState();
            render();
        });

        refs.questionRail.addEventListener("click", (event) => {
            const button = event.target.closest("[data-item-id]");
            if (!button) return;
            state.currentItemId = button.dataset.itemId;
            activeHintType = "";
            saveState();
            render();
        });

        refs.hintArea.addEventListener("click", (event) => {
            const button = event.target.closest("[data-hint-type]");
            if (!button) return;
            const hintType = button.dataset.hintType;
            if (!HINT_TYPES[hintType]) return;
            activeHintType = activeHintType === hintType ? "" : hintType;
            renderPractice();
        });

        refs.passageBox.addEventListener("click", (event) => {
            const button = event.target.closest("[data-blank-reveal]");
            if (!button) return;
            const item = getCurrentItem();
            state.revealed[item.id] = !state.revealed[item.id];
            saveState();
            renderPractice();
        });

        refs.componentChoices.addEventListener("click", (event) => {
            const button = event.target.closest("[data-component-option]");
            if (!button) return;
            const item = getCurrentItem();
            state.selections[item.id] = button.dataset.componentOption;
            state.checked[item.id] = false;
            saveState();
            renderPractice();
            renderRail();
            renderResults();
        });

        refs.draftInput.addEventListener("input", () => {
            const item = getCurrentItem();
            state.drafts[item.id] = refs.draftInput.value;
            saveState();
            showSavedStatus();
        });

        refs.checkButton.addEventListener("click", () => {
            const item = getCurrentItem();
            state.checked[item.id] = true;
            saveState();
            render();
            refs.feedbackPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });

        refs.prevButton.addEventListener("click", () => moveQuestion(-1));
        refs.nextButton.addEventListener("click", () => moveQuestion(1));

        refs.resetButton.addEventListener("click", () => {
            if (!window.confirm("저장된 답을 모두 지울까요?")) return;
            state.filter = ALL_FILTER;
            state.currentItemId = DATA.items[0].id;
            state.selections = {};
            state.drafts = {};
            state.checked = {};
            state.revealed = {};
            activeHintType = "";
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch {}
            render();
        });
    }

    function render() {
        renderFilters();
        renderRail();
        renderPractice();
        renderResults();
    }

    function renderFilters() {
        const filters = [
            { id: ALL_FILTER, label: "전체" },
            ...["10", "11", "12", "13"].map((lesson) => ({ id: lesson, label: `${lesson}과` }))
        ];

        refs.lessonFilters.innerHTML = filters.map((filter) => `
            <button class="filter-button ${state.filter === filter.id ? "is-active" : ""}" type="button" data-filter="${escapeHtml(filter.id)}" aria-pressed="${state.filter === filter.id}">
                ${escapeHtml(filter.label)}
            </button>
        `).join("");

        const items = getFilteredItems();
        refs.itemCountText.textContent = state.filter === ALL_FILTER
            ? `전체 ${items.length}문항`
            : `${state.filter}과 ${items.length}문항`;
    }

    function renderRail() {
        const items = getFilteredItems();
        refs.questionRail.innerHTML = items.map((item, index) => {
            const status = getItemStatus(item);
            return `
                <button class="rail-button ${item.id === state.currentItemId ? "is-active" : ""} ${status.className}" type="button" data-item-id="${escapeHtml(item.id)}" aria-label="${item.lesson}과 ${index + 1}번" aria-current="${item.id === state.currentItemId ? "true" : "false"}">
                    ${index + 1}
                </button>
            `;
        }).join("");
    }

    function renderPractice() {
        const item = getCurrentItem();
        const items = getFilteredItems();
        const currentIndex = Math.max(0, items.findIndex((candidate) => candidate.id === item.id));
        const selected = state.selections[item.id] || "";
        const checked = Boolean(state.checked[item.id]);
        const revealed = Boolean(state.revealed[item.id]);

        refs.sourceLabel.textContent = `${item.lesson}과 읽기 · ${item.sourceTitle}`;
        refs.questionTitle.textContent = `${currentIndex + 1}번`;
        refs.questionProgress.textContent = `${currentIndex + 1} / ${items.length}`;
        refs.passageBox.innerHTML = `
            <p class="passage-context">${escapeHtml(item.context)}</p>
            <div class="passage-lines">
                ${renderPassageLines(item, activeHintType, revealed)}
            </div>
        `;
        renderHintControls(item);

        refs.componentChoices.innerHTML = DATA.components.map((component) => {
            const isSelected = selected === component.id;
            const acceptedIds = getAcceptedComponentIds(item);
            const isCorrect = checked && acceptedIds.includes(component.id);
            const isWrong = checked && isSelected && !isCorrect;
            return `
                <button class="component-button ${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}" type="button" data-component-option="${escapeHtml(component.id)}" aria-pressed="${isSelected}">
                    <strong>${escapeHtml(formatComponent(component))}</strong>
                    ${renderComponentSupport(component)}
                </button>
            `;
        }).join("");

        refs.draftInput.value = state.drafts[item.id] || "";
        refs.draftInput.placeholder = "답을 써 보세요.";
        refs.checkButton.disabled = false;
        refs.prevButton.disabled = currentIndex <= 0;
        refs.nextButton.disabled = currentIndex >= items.length - 1;

        renderFeedback(item);
    }

    function renderFeedback(item) {
        if (!state.checked[item.id]) {
            refs.feedbackPanel.hidden = true;
            refs.feedbackPanel.className = "feedback-panel";
            refs.feedbackPanel.innerHTML = "";
            return;
        }

        const selectedId = state.selections[item.id];
        const acceptedIds = getAcceptedComponentIds(item);
        const hasSelection = Boolean(selectedId);
        const isCorrect = acceptedIds.includes(selectedId);
        const selected = componentMap.get(selectedId);
        const possibilities = getPossibilities(item);
        const acceptedLabels = possibilities
            .map((possibility) => componentMap.get(possibility.componentId))
            .filter(Boolean)
            .map(formatComponent);
        const uniqueAcceptedLabels = Array.from(new Set(acceptedLabels));
        const draft = (state.drafts[item.id] || "").trim();
        const headline = !hasSelection
            ? "정답을 확인하세요."
            : isCorrect
            ? selectedId === item.componentId ? "맞았습니다." : "가능합니다."
            : "다시 보세요.";
        const headlineBody = !hasSelection
            ? "선택하지 않아도 예시 답과 형태를 볼 수 있습니다."
            : isCorrect
            ? selectedId === item.componentId
                ? "빈칸에 들어갈 말의 형태를 잘 찾았습니다."
                : "선택한 형태로도 자연스러운 문장을 만들 수 있습니다."
            : "이 자리에서 자연스러운 형태를 다시 확인하세요.";

        refs.feedbackPanel.hidden = false;
        refs.feedbackPanel.className = `feedback-panel ${isCorrect ? "is-good" : "is-bad"}`;
        refs.feedbackPanel.innerHTML = `
            <p><strong>${headline}</strong> ${headlineBody}</p>
            <p>가능한 형태: ${uniqueAcceptedLabels.map(escapeHtml).join(", ")}</p>
            <p>내가 고른 형태: ${escapeHtml(selected ? formatComponent(selected) : "없음")}</p>
            <p>단서: ${escapeHtml(item.clue)}</p>
            <p>${escapeHtml(item.explanation)}</p>
            ${item.reviewNote ? `<p>${escapeHtml(item.reviewNote)}</p>` : ""}
            <div class="possibility-list" aria-label="가능한 답">
                ${possibilities.map(renderPossibility).join("")}
            </div>
            <p>${draft ? `내 답: ${escapeHtml(draft)}` : "내 답을 쓰고 예시 답과 비교하세요."}</p>
        `;
    }

    function renderPassageLines(item, hintType, revealed) {
        const lines = Array.isArray(item.passage) && item.passage.length
            ? item.passage
            : [{ before: item.before, after: item.after }];
        const hints = getHints(item, hintType);
        const typeConfig = HINT_TYPES[hintType];

        return lines.map((line, index) => {
            const lineNumber = index + 1;
            const lineHints = hints.filter((hint) => hint.line === lineNumber);
            if (Object.prototype.hasOwnProperty.call(line, "before") || Object.prototype.hasOwnProperty.call(line, "after")) {
                return `
                    <p class="passage-sentence is-target" data-passage-line="${lineNumber}">
                        ${renderTextWithHints(line.before || "", lineHints, typeConfig)}${renderBlankMark(item, revealed)}${renderTextWithHints(line.after || "", lineHints, typeConfig)}
                    </p>
                `;
            }

            return `
                <p class="passage-sentence" data-passage-line="${lineNumber}">
                    ${renderTextWithHints(line.text || "", lineHints, typeConfig)}
                </p>
            `;
        }).join("");
    }

    function renderBlankMark(item, revealed) {
        const originalText = getOriginalBlankText(item);
        const label = revealed && originalText ? originalText : "빈칸";
        const ariaLabel = revealed ? "원문 숨기기" : "원문 보기";
        return `
            <button class="blank-mark ${revealed ? "is-revealed" : ""}" type="button" data-blank-reveal aria-pressed="${revealed}" aria-label="${escapeHtml(ariaLabel)}">
                ${escapeHtml(label)}
            </button>
        `;
    }

    function renderHintControls(item) {
        const types = Object.entries(HINT_TYPES).filter(([hintType]) => getHints(item, hintType).length);
        if (!types.length) {
            refs.hintArea.innerHTML = "";
            return;
        }

        const buttons = types.map(([hintType, config]) => `
            <button class="hint-button ${activeHintType === hintType ? "is-active" : ""}" type="button" data-hint-type="${escapeHtml(hintType)}" aria-pressed="${activeHintType === hintType}">
                ${escapeHtml(config.label)}
            </button>
        `).join("");
        const activeConfig = HINT_TYPES[activeHintType];
        const notes = Array.from(new Set(getHints(item, activeHintType)
            .map((hint) => hint.note)
            .filter(Boolean)));

        refs.hintArea.innerHTML = `
            <div class="hint-buttons">
                ${buttons}
            </div>
            ${activeConfig && notes.length ? `
                <div class="hint-note ${activeHintType === "syntax" ? "is-syntax" : "is-logic"}" aria-live="polite">
                    <strong>${escapeHtml(activeConfig.heading)}</strong>
                    ${notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("")}
                </div>
            ` : ""}
        `;
    }

    function renderTextWithHints(text, hints, typeConfig) {
        if (!text || !typeConfig || !hints.length) {
            return escapeHtml(text || "");
        }

        const ranges = hints
            .map((hint) => {
                const term = hint.text || "";
                const start = term ? text.indexOf(term) : -1;
                return start >= 0 ? { start, end: start + term.length } : null;
            })
            .filter(Boolean)
            .sort((left, right) => left.start - right.start || right.end - left.end)
            .reduce((result, range) => {
                const previous = result[result.length - 1];
                if (previous && range.start < previous.end) return result;
                result.push(range);
                return result;
            }, []);

        if (!ranges.length) {
            return escapeHtml(text);
        }

        let cursor = 0;
        const parts = [];
        ranges.forEach((range) => {
            parts.push(escapeHtml(text.slice(cursor, range.start)));
            parts.push(`<span class="hint-mark ${typeConfig.className}">${escapeHtml(text.slice(range.start, range.end))}</span>`);
            cursor = range.end;
        });
        parts.push(escapeHtml(text.slice(cursor)));
        return parts.join("");
    }

    function renderResults() {
        const total = DATA.items.length;
        const checkedItems = DATA.items.filter((item) => state.checked[item.id]);
        const correctItems = checkedItems.filter((item) => getAcceptedComponentIds(item).includes(state.selections[item.id]));
        const percent = total ? Math.round((correctItems.length / total) * 100) : 0;

        refs.scoreText.textContent = `${correctItems.length} / ${total}`;
        refs.progressFill.style.width = `${percent}%`;

        refs.resultSummary.innerHTML = [
            { label: "확인", value: `${checkedItems.length} / ${total}` },
            { label: "정답", value: `${correctItems.length} / ${total}` },
            ...["10", "11", "12", "13"].map((lesson) => {
                const lessonItems = DATA.items.filter((item) => item.lesson === lesson);
                const lessonCorrect = lessonItems.filter((item) => (
                    state.checked[item.id] && getAcceptedComponentIds(item).includes(state.selections[item.id])
                )).length;
                return { label: `${lesson}과`, value: `${lessonCorrect} / ${lessonItems.length}` };
            })
        ].map((item) => `
            <div class="result-pill"><span>${escapeHtml(item.label)}</span><b>${escapeHtml(item.value)}</b></div>
        `).join("");

        const weakItems = DATA.items
            .filter((item) => state.checked[item.id] && !getAcceptedComponentIds(item).includes(state.selections[item.id]))
            .reduce((map, item) => {
                const label = Array.from(new Set(
                    getPossibilities(item)
                        .map((possibility) => componentMap.get(possibility.componentId))
                        .filter(Boolean)
                        .map(formatComponent)
                )).join(" / ");
                map.set(label, (map.get(label) || 0) + 1);
                return map;
            }, new Map());

        const weakRows = Array.from(weakItems.entries())
            .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ko"));

        refs.weakSummary.innerHTML = weakRows.length
            ? weakRows.map(([label, count]) => `<div class="result-pill"><span>${escapeHtml(label)}</span><b>${count}</b></div>`).join("")
            : '<div class="result-pill"><span>약한 형태</span><b>없음</b></div>';
    }

    function moveQuestion(delta) {
        const items = getFilteredItems();
        const index = items.findIndex((item) => item.id === state.currentItemId);
        const next = items[index + delta];
        if (!next) return;
        state.currentItemId = next.id;
        activeHintType = "";
        saveState();
        render();
    }

    function getFilteredItems() {
        if (state.filter === ALL_FILTER) return DATA.items;
        return DATA.items.filter((item) => item.lesson === state.filter);
    }

    function getCurrentItem() {
        const filtered = getFilteredItems();
        if (filtered.some((item) => item.id === state.currentItemId)) {
            return itemMap.get(state.currentItemId);
        }
        state.currentItemId = filtered[0]?.id || DATA.items[0].id;
        return itemMap.get(state.currentItemId);
    }

    function getItemStatus(item) {
        if (!state.checked[item.id]) return { className: "" };
        return getAcceptedComponentIds(item).includes(state.selections[item.id])
            ? { className: "is-correct" }
            : { className: "is-wrong" };
    }

    function getPossibilities(item) {
        if (Array.isArray(item.possibilities) && item.possibilities.length) {
            return item.possibilities;
        }
        return [
            {
                componentId: item.componentId,
                answers: item.modelAnswers,
                note: item.explanation
            }
        ];
    }

    function getAcceptedComponentIds(item) {
        return Array.from(new Set(getPossibilities(item).map((possibility) => possibility.componentId)));
    }

    function getOriginalBlankText(item) {
        return item.originalAnswer || (Array.isArray(item.modelAnswers) ? item.modelAnswers[0] : "") || "";
    }

    function getHints(item, hintType) {
        if (!hintType || !item.hints || !Array.isArray(item.hints[hintType])) {
            return [];
        }
        return item.hints[hintType];
    }

    function renderPossibility(possibility) {
        const component = componentMap.get(possibility.componentId);
        return `
            <div class="possibility-group">
                <strong>${escapeHtml(component ? formatComponent(component) : possibility.componentId)}</strong>
                <div class="answer-list">
                    ${(possibility.answers || []).map((answer) => `<span>${escapeHtml(answer)}</span>`).join("")}
                </div>
                <p>${escapeHtml(possibility.note || "")}</p>
            </div>
        `;
    }

    function renderComponentSupport(component) {
        const particles = Array.isArray(component.particles) ? component.particles : [];
        const examples = Array.isArray(component.examples) ? component.examples : [];
        const items = particles.length ? particles : examples.slice(0, 2);
        const label = particles.length ? "조사" : "예";

        if (!items.length) {
            return `<span class="component-support">${escapeHtml(component.hint)}</span>`;
        }

        return `
            <span class="component-support ${particles.length ? "has-particles" : "has-examples"}" aria-label="${escapeHtml(`${label}: ${items.join(", ")}`)}">
                <span class="support-label">${escapeHtml(label)}</span>
                ${items.map((item) => `<span class="support-chip">${escapeHtml(item)}</span>`).join("")}
            </span>
        `;
    }

    function formatComponent(component) {
        return `${component.label} (${component.abbr})`;
    }

    function restoreState() {
        let saved = null;
        try {
            saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
        } catch {
            saved = null;
        }

        if (!saved || typeof saved !== "object") return;

        if (saved.filter === ALL_FILTER || ["10", "11", "12", "13"].includes(saved.filter)) {
            state.filter = saved.filter;
        }
        if (itemMap.has(saved.currentItemId)) {
            state.currentItemId = saved.currentItemId;
        }
        state.selections = cleanRecord(saved.selections, (value) => componentMap.has(value));
        state.drafts = cleanRecord(saved.drafts, (value) => typeof value === "string");
        state.checked = cleanRecord(saved.checked, (value) => typeof value === "boolean");
        state.revealed = cleanRecord(saved.revealed, (value) => typeof value === "boolean");
    }

    function saveState() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            showSavedStatus();
        } catch {
            refs.saveStatus.textContent = "저장 제한";
        }
    }

    function showSavedStatus() {
        refs.saveStatus.textContent = "자동 저장됨";
    }

    function cleanRecord(record, isValidValue) {
        if (!record || typeof record !== "object") return {};
        return Object.fromEntries(
            Object.entries(record).filter(([key, value]) => itemMap.has(key) && isValidValue(value))
        );
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
