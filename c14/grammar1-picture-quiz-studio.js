(() => {
    "use strict";

    const refs = {
        progressText: document.getElementById("progressText"),
        progressBar: document.getElementById("progressBar"),
        micBtn: document.getElementById("micBtn"),
        manualFocusBtn: document.getElementById("manualFocusBtn"),
        manualTools: document.getElementById("manualTools"),
        manualInput: document.getElementById("manualInput"),
        speechMeta: document.getElementById("speechMeta"),
        nextBtn: document.getElementById("nextBtn"),
        restartBtn: document.getElementById("restartBtn"),
        sceneTitle: document.getElementById("sceneTitle"),
        sceneImage: document.getElementById("sceneImage"),
        sceneImageFallback: document.getElementById("sceneImageFallback"),
        quizWorkspace: document.getElementById("quizWorkspace"),
        summaryPanel: document.getElementById("summaryPanel"),
        summaryTitle: document.getElementById("summaryTitle")
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognitionSupported = Boolean(
        SpeechRecognitionClass &&
        (
            window.isSecureContext ||
            ["localhost", "127.0.0.1"].includes(window.location.hostname) ||
            window.location.protocol === "file:"
        )
    );

    function scrollBehavior() {
        return reducedMotion.matches ? "auto" : "smooth";
    }

    function focusAndScroll(target) {
        if (!target) return;
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }

    function syncProgressAria() {
        const match = refs.progressText.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        if (!match) return;
        const current = Number(match[1]);
        const total = Number(match[2]);
        refs.progressBar.setAttribute("aria-valuemin", "1");
        refs.progressBar.setAttribute("aria-valuemax", String(total));
        refs.progressBar.setAttribute("aria-valuenow", String(current));
        refs.progressBar.setAttribute("aria-valuetext", current + " / " + total);
    }

    function syncMicState() {
        refs.micBtn.setAttribute("aria-pressed", String(refs.micBtn.classList.contains("is-listening")));
    }

    function prepareDirectInput(disableMic = true) {
        if (disableMic) {
            refs.micBtn.disabled = true;
            refs.micBtn.setAttribute("aria-disabled", "true");
        }
        refs.manualTools.open = true;
        refs.manualFocusBtn.hidden = false;
        document.body.dataset.inputMode = "manual";
    }

    function syncRecognitionFallback() {
        const status = refs.speechMeta.textContent.trim();
        if (status === "마이크 허용" || status === "오류") {
            prepareDirectInput(true);
        } else if (status === "다시 말하기") {
            prepareDirectInput(false);
        }
    }

    function showImageFallback() {
        refs.sceneImage.hidden = true;
        refs.sceneImageFallback.hidden = false;
        refs.sceneImageFallback.setAttribute("aria-label", refs.sceneImage.alt || "그림 카드");
    }

    function showSceneImage() {
        refs.sceneImage.hidden = false;
        refs.sceneImageFallback.hidden = true;
    }

    function focusCurrentView() {
        window.requestAnimationFrame(() => {
            if (!refs.summaryPanel.classList.contains("hidden")) {
                focusAndScroll(refs.summaryTitle);
                return;
            }
            focusAndScroll(refs.sceneTitle);
        });
    }

    function syncSummaryView() {
        const summaryVisible = !refs.summaryPanel.classList.contains("hidden");
        refs.quizWorkspace.hidden = summaryVisible;
        document.body.toggleAttribute("data-summary-view", summaryVisible);
    }

    refs.manualFocusBtn.addEventListener("click", () => {
        refs.manualTools.open = true;
        focusAndScroll(refs.manualInput);
    });
    refs.nextBtn.addEventListener("click", focusCurrentView);
    refs.restartBtn.addEventListener("click", focusCurrentView);
    refs.sceneImage.addEventListener("load", showSceneImage);
    refs.sceneImage.addEventListener("error", showImageFallback);

    new MutationObserver(syncProgressAria).observe(refs.progressText, {
        childList: true,
        characterData: true,
        subtree: true
    });
    new MutationObserver(syncMicState).observe(refs.micBtn, {
        attributes: true,
        attributeFilter: ["class"]
    });
    new MutationObserver(syncRecognitionFallback).observe(refs.speechMeta, {
        childList: true,
        characterData: true,
        subtree: true
    });
    new MutationObserver(showSceneImage).observe(refs.sceneImage, {
        attributes: true,
        attributeFilter: ["src"]
    });
    new MutationObserver(syncSummaryView).observe(refs.summaryPanel, {
        attributes: true,
        attributeFilter: ["class"]
    });

    if (!speechRecognitionSupported) prepareDirectInput();
    if (refs.sceneImage.complete && !refs.sceneImage.naturalWidth) showImageFallback();
    syncProgressAria();
    syncMicState();
    syncSummaryView();
})();
