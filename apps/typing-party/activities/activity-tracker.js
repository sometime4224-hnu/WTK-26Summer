(function () {
  "use strict";

  const STORAGE_KEY = "typingParty.activity.lastSignal.v1";
  let lastSignature = "";
  let lastInputAt = 0;
  let idleTimer = 0;

  function textOf(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : "";
  }

  function numberOf(selector) {
    const value = Number(textOf(selector).replace(/[^\d]/g, ""));
    return Number.isFinite(value) ? value : 0;
  }

  function detectStageTitle() {
    return textOf("#missionTitle") || textOf("#stageTitle") || document.title || "활동";
  }

  function detectProgress() {
    const completedCount = document.querySelector("#completedCount");
    const totalCount = document.querySelector("#totalCount");
    if (completedCount && totalCount) {
      return {
        completed: numberOf("#completedCount"),
        total: numberOf("#totalCount")
      };
    }

    const progressText = textOf("#progressText");
    const match = /(\d+)\s*\/\s*(\d+)/.exec(progressText);
    if (match) {
      return {
        completed: Number(match[1]) - 1,
        total: Number(match[2])
      };
    }

    const dots = document.querySelectorAll(".progress-dot, .progress button, .stage-chip, .drop-card");
    if (dots.length) {
      return {
        completed: document.querySelectorAll(".is-done").length,
        total: dots.length
      };
    }

    const reportTotal = document.querySelector("#reportTotal");
    if (reportTotal) {
      return {
        completed: numberOf("#reportTotal"),
        total: 15
      };
    }

    return {
      completed: 0,
      total: 0
    };
  }

  function detectDetail() {
    return textOf("#feedbackText")
      || textOf("#feedbackStrip")
      || textOf("#targetDisplay")
      || textOf(".prompt-text")
      || "";
  }

  function getStatus(progress) {
    if (progress.total > 0 && progress.completed >= progress.total) return "completed";
    if (lastInputAt && Date.now() - lastInputAt < 45000) return "working";
    return "opened";
  }

  function postSignal(reason) {
    const progress = detectProgress();
    const payload = {
      type: "typing-party-progress",
      reason,
      status: getStatus(progress),
      stageTitle: detectStageTitle(),
      detail: detectDetail(),
      completed: progress.completed,
      total: progress.total,
      url: window.location.pathname,
      updatedAt: Date.now()
    };
    const signature = JSON.stringify(payload);
    if (signature === lastSignature) return;
    lastSignature = signature;

    try {
      window.sessionStorage.setItem(STORAGE_KEY, signature);
    } catch (error) {}

    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, window.location.origin === "null" ? "*" : window.location.origin);
    }
  }

  function markWorking() {
    lastInputAt = Date.now();
    postSignal("input");
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => postSignal("idle"), 1200);
  }

  function install() {
    postSignal("opened");
    document.addEventListener("input", markWorking, true);
    document.addEventListener("change", markWorking, true);
    document.addEventListener("click", () => window.setTimeout(() => postSignal("click"), 80), true);

    const observer = new MutationObserver(() => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => postSignal("mutation"), 180);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    window.setInterval(() => postSignal("interval"), 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
})();
