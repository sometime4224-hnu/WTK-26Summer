(function () {
    "use strict";

    var config = window.C15WorkbookConfig;
    var root = document.getElementById("workbookApp");
    if (!config || !root) return;

    var STORAGE_VERSION = 1;
    var storageKey = config.storageKey;
    var state = { version: STORAGE_VERSION, values: {}, checked: {} };
    var storageBlocked = false;
    var storageStatus = null;
    var saveTimer = null;
    var rawRecovery = null;

    function normalize(value) {
        return String(value || "")
            .replace(/[\s\u00a0]/g, "")
            .replace(/[.,!?·…'"“”‘’()]/g, "")
            .replace(/니다$/g, "")
            .replace(/어요$/g, "어")
            .replace(/아요$/g, "아")
            .toLowerCase();
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
        });
    }

    function validStoredState(candidate) {
        return candidate && candidate.version === STORAGE_VERSION &&
            candidate.values && typeof candidate.values === "object" &&
            candidate.checked && typeof candidate.checked === "object";
    }

    function setStorageStatus(message, kind) {
        if (!storageStatus) return;
        storageStatus.textContent = message;
        storageStatus.className = "wb-storage" + (kind ? " is-" + kind : "");
    }

    function loadState() {
        try {
            var raw = localStorage.getItem(storageKey);
            if (!raw) return;
            var parsed = JSON.parse(raw);
            if (validStoredState(parsed)) {
                state = parsed;
                return;
            }
            rawRecovery = raw;
            storageBlocked = true;
        } catch (error) {
            rawRecovery = "(저장된 자료를 읽을 수 없습니다.)";
            storageBlocked = true;
        }
    }

    function serializeState() {
        return JSON.stringify({ version: STORAGE_VERSION, values: state.values, checked: state.checked });
    }

    function saveNow() {
        if (storageBlocked) return;
        try {
            localStorage.setItem(storageKey, serializeState());
            setStorageStatus("이 기기에 자동 저장되었습니다.", "success");
        } catch (error) {
            storageBlocked = true;
            setStorageStatus("자동 저장을 하지 못했습니다. 아래에서 내 답을 복사해 보관하세요.", "error");
            updateRecoveryControls();
        }
    }

    function scheduleSave() {
        if (saveTimer) window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(saveNow, 350);
    }

    function itemId(exerciseId, index) {
        return exerciseId + "-" + index;
    }

    function getAllExercises() {
        return config.exercises || [];
    }

    function updateProgress() {
        var exercises = getAllExercises();
        var complete = exercises.filter(function (exercise) { return !!state.checked[exercise.id]; }).length;
        var percent = exercises.length ? Math.round(complete / exercises.length * 100) : 0;
        var bar = document.getElementById("progressBar");
        var label = document.getElementById("progressLabel");
        if (bar) bar.style.width = percent + "%";
        if (label) label.textContent = "확인한 연습 " + complete + " / " + exercises.length;
        exercises.forEach(function (exercise) {
            var status = document.querySelector('[data-check-state="' + exercise.id + '"]');
            if (!status) return;
            status.textContent = state.checked[exercise.id] ? "확인함" : "아직";
            status.classList.toggle("is-done", !!state.checked[exercise.id]);
        });
    }

    function inputMarkup(exercise, item, index) {
        var id = itemId(exercise.id, index);
        var value = escapeHtml(state.values[id] || "");
        var label = escapeHtml(exercise.title + " " + (index + 1) + "번 답");
        if (item.type === "text") {
            return '<textarea id="' + id + '" data-input-id="' + id + '" aria-label="' + label + '" rows="3" placeholder="답을 적어 보세요.">' + value + '</textarea>';
        }
        return '<div class="wb-answer-row">'
            + (item.before ? '<span>' + escapeHtml(item.before) + '</span>' : '')
            + '<input id="' + id + '" data-input-id="' + id + '" aria-label="' + label + '" type="text" autocomplete="off" value="' + value + '" placeholder="답" />'
            + (item.after ? '<span>' + escapeHtml(item.after) + '</span>' : '')
            + '</div>';
    }

    function exerciseMarkup(exercise, exerciseIndex) {
        var items = exercise.items.map(function (item, itemIndex) {
            return '<article class="wb-item" data-item="' + itemId(exercise.id, itemIndex) + '">'
                + '<p class="wb-item__prompt"><span class="wb-item__index">' + (itemIndex + 1) + ')</span>' + escapeHtml(item.prompt) + '</p>'
                + (item.hint ? '<p class="wb-verb-hint"><span>기본형 힌트</span>' + escapeHtml(item.hint) + '</p>' : '')
                + inputMarkup(exercise, item, itemIndex)
                + '<p class="wb-item__feedback" aria-live="polite"></p>'
                + '</article>';
        }).join("");
        return '<section class="wb-exercise" id="' + exercise.id + '">'
            + '<div class="wb-exercise__head"><div><span class="wb-exercise__number">연습 ' + (exerciseIndex + 1) + '</span><h2>' + escapeHtml(exercise.title) + '</h2></div>'
            + '<span class="wb-check-state" data-check-state="' + exercise.id + '"></span></div>'
            + '<div class="wb-exercise__body">'
            + '<p class="wb-instruction">' + escapeHtml(exercise.instruction) + '</p>'
            + (exercise.example ? '<p class="wb-example">' + exercise.example + '</p>' : '')
            + '<div class="wb-items">' + items + '</div>'
            + '<div class="wb-exercise__actions"><button class="wb-action" type="button" data-check-exercise="' + exercise.id + '" aria-label="' + escapeHtml(exercise.title + " 답 확인") + '">답 확인</button>'
            + '<p class="wb-exercise__summary" data-summary="' + exercise.id + '"></p></div>'
            + '</div></section>';
    }

    function resolveExercise(exerciseId) {
        return getAllExercises().find(function (exercise) { return exercise.id === exerciseId; });
    }

    function checkExact(value, accepted) {
        var normal = normalize(value);
        return (accepted || []).some(function (answer) { return normal === normalize(answer); });
    }

    function checkOpenResponse(value, requiredPattern) {
        var normal = normalize(value);
        if (!normal) return { kind: "empty", message: "먼저 답을 적어 보세요." };
        if (requiredPattern && normal.indexOf(normalize(requiredPattern)) === -1) {
            return { kind: "needs-work", message: "문장은 여러 가지가 될 수 있어요. <strong>" + escapeHtml(requiredPattern) + "</strong> 표현을 넣어 다시 확인해 보세요." };
        }
        return { kind: "correct", message: "좋아요. 목표 표현을 넣어 답을 만들었어요." };
    }

    function checkExercise(exerciseId) {
        var exercise = resolveExercise(exerciseId);
        if (!exercise) return;
        var correctCount = 0;
        var enteredCount = 0;
        exercise.items.forEach(function (item, index) {
            var id = itemId(exercise.id, index);
            var field = document.getElementById(id);
            var feedback = field && field.closest(".wb-item").querySelector(".wb-item__feedback");
            if (!field || !feedback) return;
            var value = field.value.trim();
            var outcome;
            if (item.open) {
                outcome = checkOpenResponse(value, item.requiredPattern);
            } else if (!value) {
                outcome = { kind: "empty", message: "먼저 답을 적어 보세요." };
            } else if (checkExact(value, item.answers)) {
                outcome = { kind: "correct", message: "맞아요." };
            } else {
                outcome = { kind: "needs-work", message: "다시 살펴보세요. " + escapeHtml(item.tip || "목표 표현의 형태를 확인해 보세요.") };
            }
            if (value) enteredCount += 1;
            if (outcome.kind === "correct") correctCount += 1;
            field.classList.remove("is-correct", "is-needs-work");
            if (outcome.kind === "correct") field.classList.add("is-correct");
            if (outcome.kind === "needs-work") field.classList.add("is-needs-work");
            feedback.className = "wb-item__feedback is-" + outcome.kind;
            feedback.innerHTML = outcome.message;
        });
        state.checked[exercise.id] = enteredCount === exercise.items.length;
        var summary = document.querySelector('[data-summary="' + exercise.id + '"]');
        if (summary) {
            if (enteredCount !== exercise.items.length) {
                summary.textContent = "답을 모두 적은 뒤 다시 확인해 보세요.";
            } else if (exercise.items.some(function (item) { return item.open; })) {
                summary.textContent = "답을 확인했습니다. 열린 답은 목표 표현이 들어갔는지 중심으로 살펴보세요.";
            } else {
                summary.textContent = correctCount + " / " + exercise.items.length + "개를 맞혔어요.";
            }
        }
        updateProgress();
        saveNow();
    }

    function render() {
        root.innerHTML = '<div class="wb-progress" aria-label="연습 진행률">'
            + '<span class="wb-progress__label" id="progressLabel"></span>'
            + '<span class="wb-progress__label" aria-hidden="true">자동 저장</span>'
            + '<div class="wb-progress__track" aria-hidden="true"><div id="progressBar" class="wb-progress__bar"></div></div>'
            + '</div><div class="wb-exercises">'
            + getAllExercises().map(exerciseMarkup).join("")
            + '</div><details class="wb-note"><summary>답을 쓰는 팁</summary><p>' + escapeHtml(config.tip) + '</p></details>'
            + '<p id="storageStatus" class="wb-storage" aria-live="polite"></p>'
            + '<div class="wb-bottom-actions" id="recoveryControls">'
            + '<button class="wb-action wb-action--subtle" type="button" id="copyAnswers">내 답 복사</button>'
            + '<button class="wb-action wb-action--subtle" type="button" id="resetWorkbook">이 워크북 초기화</button>'
            + '</div>';
        storageStatus = document.getElementById("storageStatus");
        document.querySelectorAll("[data-input-id]").forEach(function (field) {
            field.addEventListener("input", function () {
                state.values[field.dataset.inputId] = field.value;
                scheduleSave();
            });
            field.addEventListener("blur", function () {
                state.values[field.dataset.inputId] = field.value;
                saveNow();
            });
        });
        document.querySelectorAll("[data-check-exercise]").forEach(function (button) {
            button.addEventListener("click", function () { checkExercise(button.dataset.checkExercise); });
        });
        document.getElementById("copyAnswers").addEventListener("click", copyAnswers);
        document.getElementById("resetWorkbook").addEventListener("click", resetWorkbook);
        updateProgress();
        if (storageBlocked) {
            setStorageStatus("기존 저장 자료를 안전하게 읽지 못해 자동 저장을 멈췄습니다. 내 답을 복사한 뒤 초기화할 수 있어요.", "error");
            updateRecoveryControls();
        } else {
            setStorageStatus("이 페이지의 답은 이 기기에 자동 저장됩니다.");
        }
    }

    function updateRecoveryControls() {
        var copyButton = document.getElementById("copyAnswers");
        if (copyButton && rawRecovery) copyButton.textContent = "저장 자료·내 답 복사";
    }

    function answerText() {
        return getAllExercises().map(function (exercise, exerciseIndex) {
            var lines = ["연습 " + (exerciseIndex + 1) + ": " + exercise.title];
            exercise.items.forEach(function (item, index) {
                lines.push((index + 1) + ") " + item.prompt + "\n" + (state.values[itemId(exercise.id, index)] || ""));
            });
            return lines.join("\n");
        }).join("\n\n");
    }

    function copyAnswers() {
        var text = rawRecovery
            ? "[복구용 기존 저장 자료]\n" + rawRecovery + "\n\n[현재 입력한 답]\n" + answerText()
            : answerText();
        function done() { setStorageStatus("내 답을 클립보드에 복사했어요.", "success"); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(function () { window.prompt("아래 내용을 복사해 보관하세요.", text); });
        } else {
            window.prompt("아래 내용을 복사해 보관하세요.", text);
        }
    }

    function resetWorkbook() {
        if (!window.confirm("이 문법 워크북에 저장된 답만 초기화할까요?")) return;
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            setStorageStatus("저장 자료를 지우지 못했습니다. 내 답을 복사해 보관하세요.", "error");
            return;
        }
        storageBlocked = false;
        rawRecovery = null;
        state = { version: STORAGE_VERSION, values: {}, checked: {} };
        render();
        setStorageStatus("이 워크북의 답을 초기화했어요.", "success");
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") saveNow();
    });
    window.addEventListener("pagehide", saveNow);

    loadState();
    render();
}());
