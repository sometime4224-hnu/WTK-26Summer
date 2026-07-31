/*
 * Small, page-scoped persistence helper for Chapter 16 grammar activities.
 * It deliberately does not replace a malformed or unreadable record: learners
 * can copy/download the in-memory work or reset only the current page.
 */
(function () {
    "use strict";

    const PREFIX = "korean3b.c16.grammar.";
    const VERSION = 1;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function formatIssue(issue) {
        if (issue === "corrupt") return "이 페이지의 이전 학습 기록을 읽을 수 없습니다. 원본 기록은 그대로 두었습니다.";
        if (issue === "unavailable") return "이 기기에서는 학습 기록을 저장할 수 없습니다. 현재 작업은 이 페이지를 닫기 전까지 유지됩니다.";
        if (issue === "write") return "학습 기록을 저장하지 못했습니다. 현재 작업을 복사하거나 내려받아 보관할 수 있습니다.";
        return "학습 기록 상태를 확인할 수 없습니다.";
    }

    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        } finally {
            textarea.remove();
        }
    }

    function downloadText(filename, text) {
        const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
    }

    function create(pageId, initialState, options) {
        const config = options || {};
        const key = PREFIX + pageId;
        const initial = clone(initialState);
        const validate = typeof config.validate === "function" ? config.validate : function () { return true; };
        let issue = "";
        let rawRecord = "";
        let current = clone(initial);
        let mounted = null;
        let currentGetter = null;

        try {
            rawRecord = window.localStorage.getItem(key) || "";
            if (rawRecord) {
                const payload = JSON.parse(rawRecord);
                if (!payload || payload.version !== VERSION || payload.page !== pageId || !validate(payload.state)) {
                    issue = "corrupt";
                } else {
                    current = clone(payload.state);
                }
            }
        } catch (error) {
            issue = rawRecord ? "corrupt" : "unavailable";
        }

        function recoveryText() {
            const data = {
                page: pageId,
                savedAt: new Date().toISOString(),
                issue: issue || "manual-export",
                current: current
            };
            if (rawRecord) data.originalRecord = rawRecord;
            return JSON.stringify(data, null, 2);
        }

        function renderMount() {
            if (!mounted) return;
            const hasIssue = Boolean(issue);
            mounted.className = "c16-state-tools" + (hasIssue ? " c16-state-tools--issue" : "");
            mounted.innerHTML = "";

            const status = document.createElement("p");
            status.className = "c16-state-tools__status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            status.textContent = hasIssue ? formatIssue(issue) : "이 페이지의 진행은 이 기기에 자동 저장됩니다.";
            mounted.appendChild(status);

            const actions = document.createElement("div");
            actions.className = "c16-state-tools__actions";
            if (hasIssue) {
                const copy = document.createElement("button");
                copy.type = "button";
                copy.className = "c16-state-tools__button";
                copy.textContent = "현재 기록 복사";
                copy.addEventListener("click", function () {
                    if (currentGetter) current = clone(currentGetter());
                    copyText(recoveryText()).then(function () {
                        status.textContent = "현재 기록을 복사했습니다.";
                    }).catch(function () {
                        status.textContent = "복사하지 못했습니다. 아래 초기화 전에 화면 내용을 직접 보관해 주세요.";
                    });
                });
                actions.appendChild(copy);

                const download = document.createElement("button");
                download.type = "button";
                download.className = "c16-state-tools__button";
                download.textContent = "기록 내려받기";
                download.addEventListener("click", function () {
                    if (currentGetter) current = clone(currentGetter());
                    downloadText("c16-" + pageId + "-recovery.json", recoveryText());
                    status.textContent = "현재 기록 파일을 내려받았습니다.";
                });
                actions.appendChild(download);
            }

            const reset = document.createElement("button");
            reset.type = "button";
            reset.className = "c16-state-tools__button";
            reset.textContent = "이 페이지 기록 초기화";
            reset.addEventListener("click", function () {
                resetRecord(true);
            });
            actions.appendChild(reset);
            mounted.appendChild(actions);
        }

        function resetRecord(confirmReset) {
            if (confirmReset && !window.confirm("이 페이지에 저장된 학습 기록만 삭제할까요?")) return false;
            try {
                window.localStorage.removeItem(key);
                rawRecord = "";
                issue = "";
                current = clone(initial);
                renderMount();
                if (typeof config.onReset === "function") config.onReset(clone(current));
                return true;
            } catch (error) {
                issue = "unavailable";
                renderMount();
                return false;
            }
        }

        function save(nextState) {
            current = clone(nextState);
            if (issue === "corrupt") {
                renderMount();
                return false;
            }
            const payload = {
                version: VERSION,
                page: pageId,
                updatedAt: new Date().toISOString(),
                state: current
            };
            try {
                window.localStorage.setItem(key, JSON.stringify(payload));
                rawRecord = JSON.stringify(payload);
                if (issue) issue = "";
                renderMount();
                return true;
            } catch (error) {
                issue = "write";
                renderMount();
                return false;
            }
        }

        function mount(element, getCurrentState) {
            mounted = element || null;
            currentGetter = typeof getCurrentState === "function" ? getCurrentState : null;
            renderMount();
        }

        function track(getCurrentState) {
            currentGetter = typeof getCurrentState === "function" ? getCurrentState : currentGetter;
            const flush = function () {
                if (currentGetter) save(currentGetter());
            };
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "hidden") flush();
            });
            window.addEventListener("pagehide", flush);
        }

        return {
            key: key,
            get: function () { return clone(current); },
            save: save,
            reset: function () { return resetRecord(false); },
            mount: mount,
            track: track,
            get hasRecoveryIssue() { return Boolean(issue); },
            get issue() { return issue; }
        };
    }

    // Hash navigation scrolls reliably, but it does not consistently move
    // keyboard focus to a landmark. Give every C16 skip link a real focus
    // destination without changing the normal anchor behaviour.
    document.addEventListener("click", function (event) {
        const link = event.target.closest(".c16-skip-link, .skip-link, .sp-c16-skip");
        if (!link) return;
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("#") || href.length < 2) return;
        const target = document.getElementById(href.slice(1));
        if (!target) return;
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        window.setTimeout(function () {
            target.focus({ preventScroll: true });
        }, 0);
    });

    window.C16GrammarState = { create: create, VERSION: VERSION };
})();
