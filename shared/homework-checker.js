(function () {
    "use strict";

    const STORAGE_KEY = "teacher-homework-checker-v1";
    const DEFAULT_COLUMN_COUNT = 5;
    const root = document.getElementById("homeworkCheckerRoot");

    if (!root) return;

    const rosters = [
        {
            id: "class7",
            label: "7반",
            names: [
                "짠 하 로안 안",
                "즈엉 반 바오",
                "부 딩 프엉",
                "짠 티 김 응옥",
                "응웬 하 미",
                "응웬 반 람",
                "부 티 민 프엉",
                "짠 투안 아잉",
                "반 티 하이 엔",
                "딘 닛 주이",
                "부이 바오 옌",
                "응웬 반 풍",
                "르엉 득 뚜",
                "팜 득 러이",
                "라님 알 하미드",
                "간바트 운졸",
                "호앙 후이 리에우",
                "레티느",
                "부 후엔 린",
                "응웬 티 김 풍",
                "응으 티 번 니",
                "황 티 탄 쭉",
                "보 후인 안",
                "도득흥",
                "원 티 응옥 린"
            ]
        },
        {
            id: "class6",
            label: "6반",
            names: [
                "칭 텐 김",
                "찡 황 칸 후엔",
                "응우엔 빈 빈",
                "응웬 반 짭",
                "응웬 티 홍 낫",
                "레 띠에우 방",
                "응웬 프엉 마이",
                "팜 티 응옥 니",
                "응우엔 티 후엔",
                "르우 반 뒤",
                "쯔엉 민 황안",
                "장티김아잉",
                "응웬 황 티 터",
                "쩐 부 바오",
                "응웬 반 팅",
                "베갈리나 말리카",
                "부티 탕 쭉",
                "응우엔 티 화이",
                "레 티 하이리",
                "반 티 튀 항",
                "팜 홍 타이",
                "응우엔 티 투 후에",
                "팜 쑤안 휘",
                "부 티 응아",
                "이잉잉"
            ]
        }
    ];

    let deleteMode = false;
    let storageError = "";
    const state = normalizeState(loadState());

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function buildDefaultColumns() {
        return Array.from({ length: DEFAULT_COLUMN_COUNT }, function (_, index) {
            return {
                id: `date-${index + 1}`,
                value: ""
            };
        });
    }

    function buildDefaultClassState() {
        return {
            columns: buildDefaultColumns(),
            marks: {},
            nextColumnNumber: DEFAULT_COLUMN_COUNT + 1
        };
    }

    function loadState() {
        try {
            return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
        } catch (error) {
            return null;
        }
    }

    function normalizeColumns(columns) {
        if (!Array.isArray(columns)) return buildDefaultColumns();

        const seen = new Set();
        return columns
            .map(function (column, index) {
                const id = String(column && column.id ? column.id : `date-${index + 1}`);
                if (seen.has(id)) return null;
                seen.add(id);
                return {
                    id,
                    value: String(column && column.value ? column.value : "")
                };
            })
            .filter(Boolean);
    }

    function normalizeMarks(marks, columns, roster) {
        const allowedColumns = new Set(columns.map(function (column) {
            return column.id;
        }));
        const normalized = {};

        if (!marks || typeof marks !== "object") return normalized;

        Object.keys(marks).forEach(function (studentIndex) {
            const numericIndex = Number(studentIndex);
            if (!Number.isInteger(numericIndex) || numericIndex < 0 || numericIndex >= roster.names.length) return;

            const row = marks[studentIndex];
            if (!row || typeof row !== "object") return;

            Object.keys(row).forEach(function (columnId) {
                const value = row[columnId];
                if (!allowedColumns.has(columnId) || (value !== "o" && value !== "x")) return;
                if (!normalized[studentIndex]) normalized[studentIndex] = {};
                normalized[studentIndex][columnId] = value;
            });
        });

        return normalized;
    }

    function normalizeClassState(source, roster) {
        const defaults = buildDefaultClassState();
        const columns = normalizeColumns(source && source.columns);
        const maxColumnNumber = columns.reduce(function (max, column) {
            const match = column.id.match(/^date-(\d+)$/);
            return match ? Math.max(max, Number(match[1])) : max;
        }, DEFAULT_COLUMN_COUNT);
        const nextColumnNumber = Math.max(
            Number(source && source.nextColumnNumber) || defaults.nextColumnNumber,
            maxColumnNumber + 1
        );

        return {
            columns,
            marks: normalizeMarks(source && source.marks, columns, roster),
            nextColumnNumber
        };
    }

    function normalizeState(source) {
        const normalized = {
            version: 1,
            activeClassId: rosters[0].id,
            mobileActiveColumnIds: {},
            classes: {}
        };

        rosters.forEach(function (roster) {
            const classState = normalizeClassState(
                source && source.classes && source.classes[roster.id],
                roster
            );
            const savedMobileColumnId = source
                && source.mobileActiveColumnIds
                && source.mobileActiveColumnIds[roster.id];
            const mobileColumn = classState.columns.find(function (column) {
                return column.id === savedMobileColumnId;
            }) || classState.columns[0];

            normalized.classes[roster.id] = classState;
            normalized.mobileActiveColumnIds[roster.id] = mobileColumn ? mobileColumn.id : "";
        });

        if (rosters.some(function (roster) {
            return roster.id === (source && source.activeClassId);
        })) {
            normalized.activeClassId = source.activeClassId;
        }

        return normalized;
    }

    function saveState() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            storageError = "";
        } catch (error) {
            storageError = "저장하지 못했습니다.";
        }
    }

    function getRoster(classId) {
        return rosters.find(function (roster) {
            return roster.id === classId;
        }) || rosters[0];
    }

    function getActiveRoster() {
        return getRoster(state.activeClassId);
    }

    function getClassData(classId) {
        return state.classes[classId] || buildDefaultClassState();
    }

    function getActiveClassData() {
        return getClassData(state.activeClassId);
    }

    function getMobileActiveColumn(classData) {
        const selectedId = state.mobileActiveColumnIds[state.activeClassId];
        return classData.columns.find(function (column) {
            return column.id === selectedId;
        }) || classData.columns[0] || null;
    }

    function setMobileActiveColumnId(columnId) {
        state.mobileActiveColumnIds[state.activeClassId] = String(columnId || "");
    }

    function getColumnLabel(column, index) {
        return column.value || `날짜 ${index + 1}`;
    }

    function getMark(studentIndex, columnId) {
        const row = getActiveClassData().marks[String(studentIndex)];
        return row && row[columnId] ? row[columnId] : "";
    }

    function setMark(studentIndex, columnId, value) {
        const classData = getActiveClassData();
        const key = String(studentIndex);
        if (!classData.marks[key]) classData.marks[key] = {};

        if (value) {
            classData.marks[key][columnId] = value;
        } else {
            delete classData.marks[key][columnId];
        }

        if (!Object.keys(classData.marks[key]).length) {
            delete classData.marks[key];
        }
    }

    function nextMarkValue(current) {
        if (current === "o") return "x";
        if (current === "x") return "";
        return "o";
    }

    function buildSummary() {
        const roster = getActiveRoster();
        const classData = getActiveClassData();
        const total = roster.names.length * classData.columns.length;
        let done = 0;
        let missing = 0;

        roster.names.forEach(function (_, studentIndex) {
            classData.columns.forEach(function (column) {
                const value = getMark(studentIndex, column.id);
                if (value === "o") done += 1;
                if (value === "x") missing += 1;
            });
        });

        return {
            total,
            done,
            missing,
            unchecked: Math.max(0, total - done - missing)
        };
    }

    function renderClassTabs() {
        return `
            <div class="class-tabs" role="tablist" aria-label="반 선택">
                ${rosters.map(function (roster) {
                    const active = roster.id === state.activeClassId;
                    return `
                        <button class="class-tab" type="button" role="tab" aria-selected="${active ? "true" : "false"}" data-action="select-class" data-class-id="${escapeHtml(roster.id)}">
                            ${escapeHtml(roster.label)}
                        </button>
                    `;
                }).join("")}
            </div>
        `;
    }

    function renderSummary() {
        const summary = buildSummary();

        return `
            <section class="checker-summary" aria-label="현재 반 요약">
                <article class="summary-card">
                    <span>전체 칸</span>
                    <strong>${summary.total}</strong>
                </article>
                <article class="summary-card is-done">
                    <span>제출</span>
                    <strong>${summary.done}</strong>
                </article>
                <article class="summary-card is-missing">
                    <span>미제출 확인</span>
                    <strong>${summary.missing}</strong>
                </article>
                <article class="summary-card is-unchecked">
                    <span>미확인</span>
                    <strong>${summary.unchecked}</strong>
                </article>
            </section>
        `;
    }

    function renderDateHead(column, index) {
        return `
            <th class="date-column" scope="col">
                <div class="date-head">
                    <input type="text" value="${escapeHtml(column.value)}" placeholder="날짜" data-date-input data-column-id="${escapeHtml(column.id)}" aria-label="${escapeHtml(`${index + 1}번째 날짜`)}">
                    ${deleteMode ? `<button class="date-delete-button" type="button" data-delete-date data-action="delete-date" data-column-id="${escapeHtml(column.id)}">삭제</button>` : ""}
                </div>
            </th>
        `;
    }

    function renderMobileDateControls(columns) {
        const activeColumn = getMobileActiveColumn(getActiveClassData());
        const activeColumnIndex = columns.findIndex(function (column) {
            return activeColumn && column.id === activeColumn.id;
        });

        if (!activeColumn) {
            return '<div class="mobile-date-panel"><p class="mobile-date-empty">날짜를 추가해주세요.</p></div>';
        }

        return `
            <div class="mobile-date-panel" aria-label="날짜 입력">
                <div class="mobile-date-selector" role="tablist" aria-label="날짜 선택">
                    ${columns.map(function (column, index) {
                        const active = column.id === activeColumn.id;
                        return `
                            <button class="mobile-date-tab" type="button" role="tab" aria-selected="${active ? "true" : "false"}" data-mobile-date-select data-action="select-mobile-date" data-column-id="${escapeHtml(column.id)}">
                                ${escapeHtml(getColumnLabel(column, index))}
                            </button>
                        `;
                    }).join("")}
                </div>
                <div class="mobile-date-edit">
                    <label>
                        <span>선택 날짜</span>
                        <input type="text" value="${escapeHtml(activeColumn.value)}" placeholder="날짜" data-mobile-date-input data-column-id="${escapeHtml(activeColumn.id)}" aria-label="${escapeHtml(`${activeColumnIndex + 1}번째 날짜`)}">
                    </label>
                    ${deleteMode ? `<button class="date-delete-button mobile-delete-button" type="button" data-mobile-delete-date data-action="delete-date" data-column-id="${escapeHtml(activeColumn.id)}">삭제</button>` : ""}
                </div>
            </div>
        `;
    }

    function renderMarkButton(studentIndex, column) {
        const value = getMark(studentIndex, column.id);
        const label = value === "o" ? "O" : value === "x" ? "X" : "";

        return `
            <td class="mark-cell">
                <button class="mark-button" type="button" data-state="${escapeHtml(value)}" data-mark-cell="${studentIndex}-${escapeHtml(column.id)}" data-action="toggle-mark" data-student-index="${studentIndex}" data-column-id="${escapeHtml(column.id)}" aria-label="${escapeHtml(`${studentIndex + 1}번 ${column.value || "날짜 미입력"} ${label || "미확인"}`)}">
                    ${escapeHtml(label)}
                </button>
            </td>
        `;
    }

    function renderMobileMarkButton(studentIndex, column, columnIndex) {
        const value = getMark(studentIndex, column.id);
        const label = value === "o" ? "O" : value === "x" ? "X" : "";
        const dateLabel = getColumnLabel(column, columnIndex);

        return `
            <button class="mark-button mobile-mark-button" type="button" data-state="${escapeHtml(value)}" data-mobile-mark-cell="${studentIndex}-${escapeHtml(column.id)}" data-action="toggle-mark" data-student-index="${studentIndex}" data-column-id="${escapeHtml(column.id)}" aria-label="${escapeHtml(`${studentIndex + 1}번 ${dateLabel} ${label || "미확인"}`)}">
                ${escapeHtml(label)}
            </button>
        `;
    }

    function renderMobileCards(roster, classData) {
        const activeColumn = getMobileActiveColumn(classData);
        const activeColumnIndex = activeColumn
            ? classData.columns.findIndex(function (column) {
                return column.id === activeColumn.id;
            })
            : -1;

        return `
            <div class="mobile-checker-board" data-mobile-checker-board>
                ${renderMobileDateControls(classData.columns)}
                ${activeColumn ? `
                    <div class="mobile-selected-date">${escapeHtml(getColumnLabel(activeColumn, activeColumnIndex))}</div>
                    <div class="mobile-student-list">
                        ${roster.names.map(function (name, studentIndex) {
                            return `
                                <article class="mobile-student-card" data-mobile-student-card>
                                    <div class="mobile-student-head">
                                        <strong>${escapeHtml(name)}</strong>
                                        <span>${studentIndex + 1}</span>
                                    </div>
                                    ${renderMobileMarkButton(studentIndex, activeColumn, activeColumnIndex)}
                                </article>
                            `;
                        }).join("")}
                    </div>
                ` : '<p class="checker-empty">표시할 날짜가 없습니다.</p>'}
            </div>
        `;
    }

    function renderTable() {
        const roster = getActiveRoster();
        const classData = getActiveClassData();

        return `
            <section class="checker-board" aria-labelledby="checkerBoardTitle">
                <div class="checker-board-head">
                    <h2 id="checkerBoardTitle">${escapeHtml(roster.label)} 숙제 확인</h2>
                    <span>${roster.names.length}명 · 날짜 ${classData.columns.length}개</span>
                </div>
                <div class="checker-table-scroll">
                    <table class="checker-table">
                        <thead>
                            <tr>
                                <th class="name-column" scope="col">
                                    <span class="name-head">이름</span>
                                </th>
                                ${classData.columns.map(renderDateHead).join("")}
                            </tr>
                        </thead>
                        <tbody>
                            ${roster.names.map(function (name, studentIndex) {
                                return `
                                    <tr data-student-row>
                                        <th class="name-column" scope="row">
                                            <span class="student-name">
                                                <span class="student-name-text">${escapeHtml(name)}</span>
                                                <span class="student-number">${studentIndex + 1}</span>
                                            </span>
                                        </th>
                                        ${classData.columns.map(function (column) {
                                            return renderMarkButton(studentIndex, column);
                                        }).join("")}
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                    ${classData.columns.length ? "" : `<p class="checker-empty">날짜 없음</p>`}
                </div>
                ${renderMobileCards(roster, classData)}
            </section>
        `;
    }

    function render() {
        const roster = getActiveRoster();
        const classData = getActiveClassData();

        root.innerHTML = `
            <header class="checker-hero">
                <div class="checker-title-row">
                    <div>
                        <p class="checker-eyebrow">Homework Check</p>
                        <h1>숙제 확인표</h1>
                    </div>
                    ${renderClassTabs()}
                </div>
                <div class="checker-actions">
                    <button class="checker-button primary" type="button" data-action="add-date">날짜 추가</button>
                    <button id="deleteModeToggle" class="checker-button danger" type="button" aria-pressed="${deleteMode ? "true" : "false"}" data-action="toggle-delete-mode">삭제 모드</button>
                </div>
                <p class="checker-status">${escapeHtml(roster.label)} · ${roster.names.length}명 · 날짜 ${classData.columns.length}개${storageError ? ` · ${storageError}` : ""}</p>
            </header>
            ${renderSummary()}
            ${renderTable()}
        `;
    }

    function addDateColumn() {
        const classData = getActiveClassData();
        let nextNumber = Number(classData.nextColumnNumber) || classData.columns.length + 1;
        let id = `date-${nextNumber}`;

        while (classData.columns.some(function (column) {
            return column.id === id;
        })) {
            nextNumber += 1;
            id = `date-${nextNumber}`;
        }

        classData.columns.push({ id, value: "" });
        classData.nextColumnNumber = nextNumber + 1;
        setMobileActiveColumnId(id);
        saveState();
        render();
    }

    function deleteDateColumn(columnId) {
        const classData = getActiveClassData();
        const columnIndex = classData.columns.findIndex(function (column) {
            return column.id === columnId;
        });
        if (columnIndex < 0) return;

        const column = classData.columns[columnIndex];
        const label = column.value || `${columnIndex + 1}번째 날짜`;
        if (!window.confirm(`${label} 열을 삭제할까요?`)) return;

        classData.columns.splice(columnIndex, 1);
        const nextMobileColumn = classData.columns[columnIndex]
            || classData.columns[columnIndex - 1]
            || classData.columns[0];
        setMobileActiveColumnId(nextMobileColumn ? nextMobileColumn.id : "");
        Object.keys(classData.marks).forEach(function (studentIndex) {
            delete classData.marks[studentIndex][columnId];
            if (!Object.keys(classData.marks[studentIndex]).length) {
                delete classData.marks[studentIndex];
            }
        });

        saveState();
        render();
    }

    function storeDateInputValue(input) {
        const classData = getActiveClassData();
        const column = classData.columns.find(function (item) {
            return item.id === input.dataset.columnId;
        });
        if (!column) return null;

        column.value = input.value;
        return column;
    }

    function updateMobileDateLabels(column) {
        const classData = getActiveClassData();
        const columnIndex = classData.columns.findIndex(function (item) {
            return item.id === column.id;
        });
        const label = getColumnLabel(column, columnIndex);

        root.querySelectorAll("[data-mobile-date-select]").forEach(function (button) {
            if (button.dataset.columnId === column.id) {
                button.textContent = label;
            }
        });

        const selectedDate = root.querySelector(".mobile-selected-date");
        const activeColumn = getMobileActiveColumn(classData);
        if (selectedDate && activeColumn && activeColumn.id === column.id) {
            selectedDate.textContent = label;
        }
    }

    function syncVisibleDateInputs() {
        let changed = false;
        root.querySelectorAll("[data-date-input], [data-mobile-date-input]").forEach(function (input) {
            if (input.offsetParent === null) return;
            changed = Boolean(storeDateInputValue(input)) || changed;
        });
        return changed;
    }

    root.addEventListener("click", function (event) {
        const button = event.target.closest("[data-action]");
        if (!button || !root.contains(button)) return;

        syncVisibleDateInputs();
        const action = button.dataset.action;

        if (action === "select-class") {
            state.activeClassId = button.dataset.classId;
            saveState();
            render();
            return;
        }

        if (action === "select-mobile-date") {
            setMobileActiveColumnId(button.dataset.columnId);
            saveState();
            render();
            return;
        }

        if (action === "add-date") {
            addDateColumn();
            return;
        }

        if (action === "toggle-delete-mode") {
            deleteMode = !deleteMode;
            saveState();
            render();
            return;
        }

        if (action === "delete-date") {
            deleteDateColumn(button.dataset.columnId);
            return;
        }

        if (action === "toggle-mark") {
            const studentIndex = Number(button.dataset.studentIndex);
            const columnId = button.dataset.columnId;
            const nextValue = nextMarkValue(getMark(studentIndex, columnId));
            setMark(studentIndex, columnId, nextValue);
            saveState();
            render();
        }
    });

    function handleDateValueEvent(event) {
        const input = event.target.closest("[data-date-input], [data-mobile-date-input]");
        if (!input || !root.contains(input)) return;

        const column = storeDateInputValue(input);
        if (!column) return;
        updateMobileDateLabels(column);
        saveState();
    }

    root.addEventListener("input", handleDateValueEvent);
    root.addEventListener("change", handleDateValueEvent);
    root.addEventListener("focusout", handleDateValueEvent);

    saveState();
    render();
}());
