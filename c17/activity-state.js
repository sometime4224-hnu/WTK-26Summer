(function () {
    "use strict";

    const PREFIX = "korean3b.c17.";
    const SCHEMA_VERSION = 1;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function isPlainObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }

    function issueMessage(issue) {
        if (issue === "corrupt") {
            return "이 페이지의 이전 기록을 읽을 수 없습니다. 원본 기록은 그대로 보존했습니다.";
        }
        if (issue === "unknown-version") {
            return "다른 버전의 학습 기록이 있어 덮어쓰지 않았습니다. 현재 작업은 메모리에만 유지됩니다.";
        }
        if (issue === "unavailable") {
            return "이 기기에서는 학습 기록 저장소를 사용할 수 없습니다. 현재 작업은 페이지를 닫기 전까지 유지됩니다.";
        }
        if (issue === "write") {
            return "학습 기록을 저장하지 못했습니다. 현재 기록을 내려받아 보관할 수 있습니다.";
        }
        return "이 페이지의 진행은 이 기기에 자동 저장됩니다.";
    }

    function download(filename, contents) {
        const url = URL.createObjectURL(new Blob([contents], { type: "application/json;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () {
            URL.revokeObjectURL(url);
        }, 0);
    }

    function create(pageId, initialState, options) {
        if (!pageId || typeof pageId !== "string") {
            throw new TypeError("C17ActivityState.create에는 pageId가 필요합니다.");
        }

        const config = options || {};
        const key = PREFIX + pageId + ".v1";
        const initial = clone(initialState);
        const validate = typeof config.validate === "function"
            ? config.validate
            : function (value) { return isPlainObject(value); };
        let current = clone(initial);
        let rawRecord = "";
        let issue = "";
        let mounted = null;
        let currentGetter = null;
        let listenersMounted = false;
        let suppressFlush = false;

        function readExisting() {
            try {
                rawRecord = window.localStorage.getItem(key) || "";
            } catch (error) {
                issue = "unavailable";
                return;
            }

            if (!rawRecord) {
                if (typeof config.migrate === "function") {
                    try {
                        const migrated = config.migrate({
                            pageId: pageId,
                            key: key,
                            initialState: clone(initial)
                        });
                        if (migrated && validate(migrated)) {
                            current = clone(migrated);
                            writeRecord();
                        }
                    } catch (error) {
                        // A failed legacy migration must never block a clean page.
                    }
                }
                return;
            }

            try {
                const payload = JSON.parse(rawRecord);
                if (!payload || payload.schemaVersion !== SCHEMA_VERSION || payload.pageId !== pageId) {
                    issue = payload && payload.schemaVersion !== SCHEMA_VERSION
                        ? "unknown-version"
                        : "corrupt";
                    return;
                }
                if (!validate(payload.state)) {
                    issue = "corrupt";
                    return;
                }
                current = clone(payload.state);
            } catch (error) {
                issue = "corrupt";
            }
        }

        function payloadFor(state) {
            return {
                schemaVersion: SCHEMA_VERSION,
                pageId: pageId,
                updatedAt: new Date().toISOString(),
                state: clone(state)
            };
        }

        function writeRecord() {
            if (issue === "corrupt" || issue === "unknown-version" || issue === "unavailable") {
                renderMount();
                return false;
            }
            const serialized = JSON.stringify(payloadFor(current));
            try {
                window.localStorage.setItem(key, serialized);
                rawRecord = serialized;
                issue = "";
                renderMount();
                return true;
            } catch (error) {
                issue = "write";
                renderMount();
                return false;
            }
        }

        function recoveryText() {
            const recovery = {
                schemaVersion: SCHEMA_VERSION,
                pageId: pageId,
                exportedAt: new Date().toISOString(),
                issue: issue || "manual-export",
                state: clone(current)
            };
            if (rawRecord) {
                recovery.originalRecord = rawRecord;
            }
            return JSON.stringify(recovery, null, 2);
        }

        function resetRecord(requireConfirmation) {
            if (requireConfirmation !== false
                && !window.confirm("이 페이지에 저장된 학습 기록만 초기화할까요?")) {
                return false;
            }
            try {
                window.localStorage.removeItem(key);
                rawRecord = "";
                issue = "";
                current = clone(initial);
                suppressFlush = typeof config.onReset === "function";
                renderMount();
                if (typeof config.onReset === "function") {
                    config.onReset(clone(current));
                }
                return true;
            } catch (error) {
                issue = "unavailable";
                renderMount();
                return false;
            }
        }

        function renderMount() {
            if (!mounted) {
                return;
            }
            mounted.className = "c17-state-tools" + (issue ? " c17-state-tools--issue" : "");
            mounted.replaceChildren();

            const status = document.createElement("p");
            status.className = "c17-state-tools__status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            status.textContent = issueMessage(issue);
            mounted.appendChild(status);

            const actions = document.createElement("div");
            actions.className = "c17-state-tools__actions";

            if (issue) {
                const exportButton = document.createElement("button");
                exportButton.type = "button";
                exportButton.className = "c17-state-tools__button";
                exportButton.textContent = "현재 기록 내려받기";
                exportButton.addEventListener("click", function () {
                    if (currentGetter) {
                        const latest = currentGetter();
                        if (validate(latest)) {
                            current = clone(latest);
                        }
                    }
                    download("c17-" + pageId + "-recovery.json", recoveryText());
                    status.textContent = "복구용 기록을 내려받았습니다.";
                });
                actions.appendChild(exportButton);
            }

            const resetButton = document.createElement("button");
            resetButton.type = "button";
            resetButton.className = "c17-state-tools__button";
            resetButton.textContent = "이 페이지 기록 초기화";
            resetButton.addEventListener("click", function () {
                resetRecord(true);
            });
            actions.appendChild(resetButton);
            mounted.appendChild(actions);
        }

        function get() {
            return clone(current);
        }

        function save(nextState) {
            if (!validate(nextState)) {
                return false;
            }
            suppressFlush = false;
            current = clone(nextState);
            return writeRecord();
        }

        function flush() {
            if (suppressFlush) {
                return true;
            }
            if (currentGetter) {
                const latest = currentGetter();
                if (validate(latest)) {
                    current = clone(latest);
                }
            }
            return writeRecord();
        }

        function mount(element, getCurrentState) {
            mounted = element || null;
            currentGetter = typeof getCurrentState === "function" ? getCurrentState : currentGetter;
            renderMount();

            if (!listenersMounted) {
                listenersMounted = true;
                document.addEventListener("visibilitychange", function () {
                    if (document.visibilityState === "hidden") {
                        flush();
                    }
                });
                window.addEventListener("pagehide", flush);
            }
            return api;
        }

        function exportRecovery(shouldDownload) {
            if (currentGetter) {
                const latest = currentGetter();
                if (validate(latest)) {
                    current = clone(latest);
                }
            }
            const text = recoveryText();
            if (shouldDownload) {
                download("c17-" + pageId + "-recovery.json", text);
            }
            return text;
        }

        readExisting();

        const api = {
            get: get,
            save: save,
            flush: flush,
            reset: resetRecord,
            mount: mount,
            exportRecovery: exportRecovery
        };

        return api;
    }

    window.C17ActivityState = {
        create: create,
        schemaVersion: SCHEMA_VERSION
    };
})();
