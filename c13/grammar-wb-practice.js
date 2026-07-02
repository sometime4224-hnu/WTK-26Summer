(() => {
    const PAGE = window.C13_WB_PAGE;
    const root = document.getElementById("wbRoot");
    if (!PAGE || !root) return;

    document.title = PAGE.documentTitle || PAGE.title || document.title;
    document.documentElement.style.setProperty("--wb-accent", PAGE.theme?.accent || "#4f46e5");
    document.documentElement.style.setProperty("--wb-accent-dark", PAGE.theme?.accentDark || "#3730a3");
    document.documentElement.style.setProperty("--wb-accent-soft", PAGE.theme?.accentSoft || "#eef2ff");
    document.documentElement.style.setProperty("--stage-count", PAGE.stages.length);

    const state = {
        activeStage: 0,
        taskIndexes: PAGE.stages.map(() => 0),
        inputs: {},
        checked: new Set(),
        done: false
    };

    window.C13_WB_PRACTICE = { PAGE, state, goToStage, render };

    render();

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function currentStage() {
        return PAGE.stages[state.activeStage];
    }

    function currentTask() {
        const stage = currentStage();
        return stage.tasks[state.taskIndexes[state.activeStage]];
    }

    function totalTasks() {
        return PAGE.stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
    }

    function checkedInStage(stage) {
        return stage.tasks.filter((task) => state.checked.has(task.id)).length;
    }

    function render() {
        if (state.done) {
            renderSummary();
            return;
        }

        const stage = currentStage();
        const task = currentTask();
        const taskIndex = state.taskIndexes[state.activeStage];
        const completed = state.checked.size;
        const total = totalTasks();
        const progressPercent = total ? Math.round((completed / total) * 100) : 0;

        root.innerHTML = `
            <div class="wb-shell">
                <section class="wb-hero">
                    <div>
                        <p class="wb-eyebrow">${esc(PAGE.eyebrow || "Workbook Practice")}</p>
                        <h1>${esc(PAGE.title)}</h1>
                        <p class="wb-lead">${esc(PAGE.lead)}</p>
                    </div>
                    <div class="wb-hero__actions">
                        ${(PAGE.heroLinks || []).map((link) => `<a class="wb-link-button" href="${esc(link.href)}">${esc(link.label)}</a>`).join("")}
                    </div>
                </section>

                <nav class="stage-tabs" aria-label="연습 단계">
                    ${PAGE.stages.map((item, index) => `
                        <button class="stage-tab" type="button" data-stage-index="${index}" aria-selected="${index === state.activeStage}">
                            <span class="stage-tab__number">${index + 1}</span>
                            <span>
                                <span class="stage-tab__title">${esc(item.title)}</span>
                                <span class="stage-tab__sub">${esc(item.sub || `${item.tasks.length}문항`)}</span>
                            </span>
                        </button>
                    `).join("")}
                </nav>

                <section class="wb-layout">
                    <section class="work-panel" aria-live="polite">
                        ${renderTask(stage, task, taskIndex)}
                    </section>

                    <aside class="side-panel" aria-label="연습 현황">
                        <div class="progress-block">
                            <p class="progress-title">Progress</p>
                            <div class="meter">
                                <div class="meter__row">
                                    <span>예시 확인</span>
                                    <span>${completed} / ${total}</span>
                                </div>
                                <div class="meter__track"><div class="meter__bar" style="width:${progressPercent}%"></div></div>
                            </div>
                            <ul class="stage-mini-list">
                                ${PAGE.stages.map((item) => `
                                    <li>
                                        <span>${esc(item.title)}</span>
                                        <span>${checkedInStage(item)} / ${item.tasks.length}</span>
                                    </li>
                                `).join("")}
                            </ul>
                        </div>
                        <div class="tip-box">
                            <strong>${esc(PAGE.tipTitle || "주관식 확인 방식")}</strong>
                            <p>${esc(PAGE.tip || "문장을 쓴 뒤 예시를 확인합니다. 여러 답이 가능하므로 정오 판정 없이 다음 문항으로 이동할 수 있습니다.")}</p>
                        </div>
                    </aside>
                </section>

                <nav class="footer-nav" aria-label="다음 학습">
                    ${(PAGE.footerLinks || []).map((link, index) => `<a class="${index === (PAGE.footerLinks || []).length - 1 ? "wb-link-button" : "wb-button"}" href="${esc(link.href)}">${esc(link.label)}</a>`).join("")}
                </nav>
            </div>
        `;

        root.querySelectorAll("[data-stage-index]").forEach((button) => {
            button.addEventListener("click", () => goToStage(Number(button.dataset.stageIndex)));
        });

        const input = root.querySelector("#answerInput");
        const checkButton = root.querySelector("#checkAnswerBtn");
        if (input && checkButton) {
            input.addEventListener("input", () => {
                state.inputs[task.id] = input.value;
                checkButton.disabled = !input.value.trim();
            });
            checkButton.addEventListener("click", () => {
                const value = input.value.trim();
                if (!value) return;
                state.inputs[task.id] = input.value;
                state.checked.add(task.id);
                render();
                requestAnimationFrame(() => {
                    root.querySelector(".example-panel")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
                });
            });
        }

        root.querySelector("#prevTaskBtn")?.addEventListener("click", prevTask);
        root.querySelector("#nextTaskBtn")?.addEventListener("click", nextTask);
        root.querySelector("#rewriteTaskBtn")?.addEventListener("click", () => {
            state.checked.delete(task.id);
            state.inputs[task.id] = "";
            render();
        });
    }

    function renderTask(stage, task, taskIndex) {
        const inputValue = state.inputs[task.id] || "";
        const checked = state.checked.has(task.id);
        const examples = task.examples || [];
        const stageProgress = `${taskIndex + 1} / ${stage.tasks.length}`;

        return `
            <div class="stage-head">
                <div>
                    <h2>${esc(stage.title)}</h2>
                    <p class="stage-note">${esc(stage.intro || "")}</p>
                </div>
                <span class="status-pill">${stageProgress}</span>
            </div>

            <article class="task-card">
                <div class="task-meta">
                    <span class="chip chip--accent">${esc(task.kind || "쓰기")}</span>
                    ${task.source ? `<span class="chip">${esc(task.source)}</span>` : ""}
                </div>
                <h3 class="task-title">${esc(task.prompt)}</h3>
                ${renderContext(task)}
                ${task.cue ? `<div class="cue-box"><b>단서</b><span>${esc(task.cue)}</span></div>` : ""}
                ${renderBank(task.bank)}
                <label class="answer-label" for="answerInput">
                    내 답안
                    <textarea id="answerInput" class="answer-input" spellcheck="false" placeholder="${esc(task.placeholder || PAGE.placeholder || "문장을 직접 써 보세요.")}">${esc(inputValue)}</textarea>
                </label>
                <div class="action-row">
                    <button id="checkAnswerBtn" class="wb-button wb-button--primary" type="button" ${inputValue.trim() ? "" : "disabled"}>예시 확인</button>
                    <button id="rewriteTaskBtn" class="wb-button" type="button">다시 쓰기</button>
                    <button id="prevTaskBtn" class="wb-button" type="button" ${state.activeStage === 0 && taskIndex === 0 ? "disabled" : ""}>이전</button>
                    <button id="nextTaskBtn" class="wb-button wb-button--soft" type="button">${nextLabel()}</button>
                </div>
                ${checked ? renderExamples(inputValue, examples, task.note) : `<div class="feedback-panel">${esc(task.hint || "먼저 직접 써 보고 예시 확인을 눌러 보세요. 이 활동은 정답/오답을 판정하지 않습니다.")}</div>`}
            </article>
        `;
    }

    function renderContext(task) {
        if (!task.context || !task.context.length) return "";
        return `
            <ul class="task-context">
                ${task.context.map((line) => `<li>${esc(line)}</li>`).join("")}
            </ul>
        `;
    }

    function renderBank(bank) {
        if (!bank || !bank.length) return "";
        return `
            <div class="word-bank" aria-label="참고 표현">
                ${bank.map((item) => `<span>${esc(item)}</span>`).join("")}
            </div>
        `;
    }

    function renderExamples(inputValue, examples, note) {
        return `
            <div class="example-panel">
                <h3>가능한 답변 예시</h3>
                <div class="stored-answer">
                    <span>내가 쓴 문장</span>
                    <p>${esc(inputValue)}</p>
                </div>
                <ul class="example-list">
                    ${examples.map((example) => `<li>${esc(example)}</li>`).join("")}
                </ul>
                ${note ? `<div class="feedback-panel">${esc(note)}</div>` : ""}
            </div>
        `;
    }

    function nextLabel() {
        const stage = currentStage();
        const taskIndex = state.taskIndexes[state.activeStage];
        if (taskIndex < stage.tasks.length - 1) return "다음 문항";
        if (state.activeStage < PAGE.stages.length - 1) return "다음 단계";
        return "마무리";
    }

    function nextTask() {
        const stage = currentStage();
        const taskIndex = state.taskIndexes[state.activeStage];
        if (taskIndex < stage.tasks.length - 1) {
            state.taskIndexes[state.activeStage] += 1;
        } else if (state.activeStage < PAGE.stages.length - 1) {
            state.activeStage += 1;
        } else {
            state.done = true;
        }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function prevTask() {
        const taskIndex = state.taskIndexes[state.activeStage];
        if (taskIndex > 0) {
            state.taskIndexes[state.activeStage] -= 1;
        } else if (state.activeStage > 0) {
            state.activeStage -= 1;
            state.taskIndexes[state.activeStage] = PAGE.stages[state.activeStage].tasks.length - 1;
        }
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function goToStage(index) {
        if (index < 0 || index >= PAGE.stages.length) return;
        state.done = false;
        state.activeStage = index;
        render();
    }

    function renderSummary() {
        const completed = state.checked.size;
        const total = totalTasks();
        root.innerHTML = `
            <div class="wb-shell">
                <section class="summary-panel">
                    <p class="wb-eyebrow">${esc(PAGE.eyebrow || "Workbook Practice")}</p>
                    <h2>${esc(PAGE.summaryTitle || "WB 보조활동을 마쳤습니다.")}</h2>
                    <p>${esc(PAGE.summary || "확인한 예시를 바탕으로 문장을 다시 말해 보세요. 주관식은 여러 답이 가능하므로 채점보다 표현 선택을 점검하는 것이 더 중요합니다.")}</p>
                    <div class="meter">
                        <div class="meter__row">
                            <span>예시 확인</span>
                            <span>${completed} / ${total}</span>
                        </div>
                        <div class="meter__track"><div class="meter__bar" style="width:${total ? Math.round((completed / total) * 100) : 0}%"></div></div>
                    </div>
                    <div class="action-row">
                        <button id="restartPracticeBtn" class="wb-button wb-button--primary" type="button">처음으로</button>
                        ${(PAGE.footerLinks || []).map((link) => `<a class="wb-button" href="${esc(link.href)}">${esc(link.label)}</a>`).join("")}
                    </div>
                </section>
            </div>
        `;
        root.querySelector("#restartPracticeBtn").addEventListener("click", () => {
            state.done = false;
            state.activeStage = 0;
            state.taskIndexes = PAGE.stages.map(() => 0);
            render();
        });
    }
})();
