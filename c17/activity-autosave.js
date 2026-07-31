(function () {
    "use strict";

    if (!window.C17ActivityState) {
        return;
    }

    const filename = (window.location.pathname.split("/").pop() || "activity.html").toLowerCase();
    const pageId = filename.replace(/\.html$/, "");
    const initialState = { actions: [], inputs: {}, completed: false };
    let restoring = true;

    function ignoredButton(button) {
        if (button.closest(".c17-state-tools")) {
            return true;
        }
        const identity = [
            button.id,
            button.className,
            button.getAttribute("aria-label"),
            button.textContent
        ].join(" ").toLowerCase();
        return /\b(audio|play|pause|speak|listen|sound|volume|tts)\b/.test(identity)
            || /듣기|재생|발음/.test(identity)
            || button.closest("nav, .topbar, .footer-nav");
    }

    function isRestartButton(button) {
        const identity = [
            button.id,
            button.className,
            button.textContent
        ].join(" ").toLowerCase();
        return /(?:^|\s|[-_])(reset|restart)(?:$|\s|[-_])/.test(identity)
            || /다시 시작|처음부터 다시/.test(identity);
    }

    function locatorFor(element) {
        if (element.id) {
            return { type: "id", value: element.id };
        }
        const dataPairs = Array.from(element.attributes)
            .filter((attr) => attr.name.startsWith("data-"))
            .map((attr) => [attr.name, attr.value]);
        if (dataPairs.length) {
            return { type: "data", tag: element.tagName.toLowerCase(), pairs: dataPairs };
        }
        const buttons = Array.from(document.querySelectorAll("button"));
        const index = buttons.indexOf(element);
        return index >= 0 ? { type: "button-index", value: index } : null;
    }

    function elementFor(locator) {
        if (!locator) return null;
        if (locator.type === "id") {
            return document.getElementById(locator.value);
        }
        if (locator.type === "button-index") {
            return document.querySelectorAll("button")[locator.value] || null;
        }
        if (locator.type === "data") {
            const selector = locator.pairs.reduce((value, pair) => {
                return value + `[${CSS.escape(pair[0])}="${CSS.escape(pair[1])}"]`;
            }, locator.tag || "");
            try {
                return document.querySelector(selector);
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    function inputKey(input, index) {
        return input.id || input.name || `${input.tagName.toLowerCase()}-${index}`;
    }

    function collectInputs() {
        const values = {};
        document.querySelectorAll("input, textarea, select").forEach((input, index) => {
            const key = inputKey(input, index);
            values[key] = input.type === "checkbox" || input.type === "radio"
                ? { checked: input.checked }
                : { value: input.value };
        });
        return values;
    }

    function restoreInputs(values) {
        document.querySelectorAll("input, textarea, select").forEach((input, index) => {
            const saved = values[inputKey(input, index)];
            if (!saved) return;
            if (Object.prototype.hasOwnProperty.call(saved, "checked")) {
                input.checked = Boolean(saved.checked);
            } else if (Object.prototype.hasOwnProperty.call(saved, "value")) {
                input.value = saved.value;
            }
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
    }

    function pageLooksComplete() {
        const status = Array.from(document.querySelectorAll(
            "[role='status'], [aria-live], .result, .result-card, .feedback, .complete, .completed"
        )).map((element) => element.textContent).join(" ");
        return /활동 완료|학습 완료|퀴즈 완료|모두 완료|완료되었습니다/.test(status);
    }

    const stateStore = window.C17ActivityState.create(pageId, initialState, {
        validate: function (value) {
            return Boolean(value)
                && Array.isArray(value.actions)
                && value.actions.every((action) => action && typeof action === "object")
                && value.inputs
                && typeof value.inputs === "object"
                && !Array.isArray(value.inputs)
                && typeof value.completed === "boolean";
        },
        onReset: function () {
            window.location.reload();
        }
    });
    const activityState = stateStore.get();

    function saveCheckpoint() {
        activityState.inputs = collectInputs();
        activityState.completed = pageLooksComplete();
        stateStore.save(activityState);
    }

    document.addEventListener("click", function (event) {
        if (restoring) return;
        const button = event.target.closest("button");
        if (!button || ignoredButton(button)) return;
        if (isRestartButton(button)) {
            activityState.actions = [];
            activityState.completed = false;
            window.setTimeout(saveCheckpoint, 0);
            return;
        }
        const locator = locatorFor(button);
        if (!locator) return;
        activityState.actions.push(locator);
        if (activityState.actions.length > 120) {
            activityState.actions = activityState.actions.slice(-120);
        }
        window.setTimeout(saveCheckpoint, 0);
    });

    document.addEventListener("input", function () {
        if (!restoring) {
            saveCheckpoint();
        }
    });
    document.addEventListener("change", function () {
        if (!restoring) {
            saveCheckpoint();
        }
    });

    function mountTools() {
        let mount = document.getElementById("activityStateTools");
        if (!mount) {
            mount = document.createElement("div");
            mount.id = "activityStateTools";
            const footer = document.querySelector(".footer-nav, footer");
            if (footer && footer.parentNode) {
                footer.insertAdjacentElement("beforebegin", mount);
            } else {
                document.body.appendChild(mount);
            }
        }
        stateStore.mount(mount, function () {
            activityState.inputs = collectInputs();
            activityState.completed = pageLooksComplete();
            return activityState;
        });
    }

    function restore() {
        activityState.actions.forEach((locator) => {
            const button = elementFor(locator);
            if (button && !button.disabled && !ignoredButton(button)) {
                button.click();
            }
        });
        restoreInputs(activityState.inputs);
        restoring = false;
        mountTools();
    }

    const cssHref = "activity-state.css";
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = cssHref;
        document.head.appendChild(stylesheet);
    }

    window.requestAnimationFrame(function () {
        window.requestAnimationFrame(restore);
    });
})();
