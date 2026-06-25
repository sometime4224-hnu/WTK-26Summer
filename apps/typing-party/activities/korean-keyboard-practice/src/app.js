(function () {
  "use strict";

  const KEY_LAYOUT = [
    { code: "KeyQ", latin: "Q", hangul: "ㅂ", shiftHangul: "ㅃ", hand: "left", finger: "left-pinky", row: "top" },
    { code: "KeyW", latin: "W", hangul: "ㅈ", shiftHangul: "ㅉ", hand: "left", finger: "left-ring", row: "top" },
    { code: "KeyE", latin: "E", hangul: "ㄷ", shiftHangul: "ㄸ", hand: "left", finger: "left-middle", row: "top" },
    { code: "KeyR", latin: "R", hangul: "ㄱ", shiftHangul: "ㄲ", hand: "left", finger: "left-index", row: "top" },
    { code: "KeyT", latin: "T", hangul: "ㅅ", shiftHangul: "ㅆ", hand: "left", finger: "left-index", row: "top" },
    { code: "KeyY", latin: "Y", hangul: "ㅛ", shiftHangul: "", hand: "right", finger: "right-index", row: "top" },
    { code: "KeyU", latin: "U", hangul: "ㅕ", shiftHangul: "", hand: "right", finger: "right-index", row: "top" },
    { code: "KeyI", latin: "I", hangul: "ㅑ", shiftHangul: "", hand: "right", finger: "right-middle", row: "top" },
    { code: "KeyO", latin: "O", hangul: "ㅐ", shiftHangul: "ㅒ", hand: "right", finger: "right-ring", row: "top" },
    { code: "KeyP", latin: "P", hangul: "ㅔ", shiftHangul: "ㅖ", hand: "right", finger: "right-pinky", row: "top" },
    { code: "KeyA", latin: "A", hangul: "ㅁ", shiftHangul: "", hand: "left", finger: "left-pinky", row: "home" },
    { code: "KeyS", latin: "S", hangul: "ㄴ", shiftHangul: "", hand: "left", finger: "left-ring", row: "home" },
    { code: "KeyD", latin: "D", hangul: "ㅇ", shiftHangul: "", hand: "left", finger: "left-middle", row: "home" },
    { code: "KeyF", latin: "F", hangul: "ㄹ", shiftHangul: "", hand: "left", finger: "left-index", row: "home" },
    { code: "KeyG", latin: "G", hangul: "ㅎ", shiftHangul: "", hand: "left", finger: "left-index", row: "home" },
    { code: "KeyH", latin: "H", hangul: "ㅗ", shiftHangul: "", hand: "right", finger: "right-index", row: "home" },
    { code: "KeyJ", latin: "J", hangul: "ㅓ", shiftHangul: "", hand: "right", finger: "right-index", row: "home" },
    { code: "KeyK", latin: "K", hangul: "ㅏ", shiftHangul: "", hand: "right", finger: "right-middle", row: "home" },
    { code: "KeyL", latin: "L", hangul: "ㅣ", shiftHangul: "", hand: "right", finger: "right-ring", row: "home" },
    { code: "KeyZ", latin: "Z", hangul: "ㅋ", shiftHangul: "", hand: "left", finger: "left-pinky", row: "bottom" },
    { code: "KeyX", latin: "X", hangul: "ㅌ", shiftHangul: "", hand: "left", finger: "left-ring", row: "bottom" },
    { code: "KeyC", latin: "C", hangul: "ㅊ", shiftHangul: "", hand: "left", finger: "left-middle", row: "bottom" },
    { code: "KeyV", latin: "V", hangul: "ㅍ", shiftHangul: "", hand: "left", finger: "left-index", row: "bottom" },
    { code: "KeyB", latin: "B", hangul: "ㅠ", shiftHangul: "", hand: "left", finger: "left-index", row: "bottom" },
    { code: "KeyN", latin: "N", hangul: "ㅜ", shiftHangul: "", hand: "right", finger: "right-index", row: "bottom" },
    { code: "KeyM", latin: "M", hangul: "ㅡ", shiftHangul: "", hand: "right", finger: "right-index", row: "bottom" }
  ];

  const PRACTICE_SETS = {
    find: {
      label: "자리 찾기",
      targets: ["KeyF", "KeyJ", "KeyA", "KeyS", "KeyD", "KeyK", "KeyL", "KeyG", "KeyH", "KeyR", "KeyT", "KeyY", "KeyU", "KeyN"]
    },
    syllable: {
      label: "음절 입력",
      targets: ["가", "나", "다", "마", "바", "사", "아", "자", "하", "고", "구", "기"]
    },
    word: {
      label: "단어 입력",
      targets: ["한국", "학생", "학교", "이름", "컴퓨터", "전화", "커피", "가방", "친구", "오늘"]
    }
  };

  const ROWS = {
    top: KEY_LAYOUT.filter((key) => key.row === "top"),
    home: KEY_LAYOUT.filter((key) => key.row === "home"),
    bottom: KEY_LAYOUT.filter((key) => key.row === "bottom")
  };

  const HOME_CODES = new Set(["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL"]);

  const FINGER_LABELS = {
    "left-pinky": "왼손 새끼",
    "left-ring": "왼손 약지",
    "left-middle": "왼손 중지",
    "left-index": "왼손 검지",
    "right-index": "오른손 검지",
    "right-middle": "오른손 중지",
    "right-ring": "오른손 약지",
    "right-pinky": "오른손 새끼"
  };

  const state = {
    mode: "find",
    index: { find: 0, syllable: 0, word: 0 },
    completed: { find: 0, syllable: 0, word: 0 },
    attempts: { find: 0, syllable: 0, word: 0 },
    composing: false
  };

  const els = {
    keyboardBoard: document.getElementById("keyboardBoard"),
    currentKeyBadge: document.getElementById("currentKeyBadge"),
    reachList: document.getElementById("reachList"),
    practiceModeLabel: document.getElementById("practiceModeLabel"),
    targetDisplay: document.getElementById("targetDisplay"),
    targetHint: document.getElementById("targetHint"),
    keyCapture: document.getElementById("keyCapture"),
    answerInput: document.getElementById("answerInput"),
    feedbackStrip: document.getElementById("feedbackStrip"),
    completedCount: document.getElementById("completedCount"),
    totalCount: document.getElementById("totalCount"),
    attemptCount: document.getElementById("attemptCount"),
    nextButton: document.getElementById("nextButton"),
    resetPractice: document.getElementById("resetPractice")
  };

  function getKey(code) {
    return KEY_LAYOUT.find((key) => key.code === code);
  }

  function getCurrentTarget() {
    const set = PRACTICE_SETS[state.mode];
    return set.targets[state.index[state.mode]];
  }

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function renderKeyboard() {
    els.keyboardBoard.innerHTML = "";
    Object.entries(ROWS).forEach(([rowName, keys]) => {
      const row = document.createElement("div");
      row.className = `keyboard-row keyboard-row--${rowName}`;
      row.style.setProperty("--key-count", String(keys.length));

      keys.forEach((key) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `key-button finger-${key.finger}`;
        button.dataset.code = key.code;
        button.dataset.hangul = key.hangul;
        button.setAttribute("aria-label", `${key.latin} 자리 ${key.hangul}`);
        if (HOME_CODES.has(key.code)) {
          button.classList.add("is-home");
        }
        button.innerHTML = `
          <span class="key-latin">${key.latin}</span>
          <span class="key-hangul">${key.hangul}</span>
          <span class="key-shift">${key.shiftHangul || "&nbsp;"}</span>
        `;
        row.appendChild(button);
      });

      els.keyboardBoard.appendChild(row);
    });
  }

  function setFeedback(message, kind) {
    els.feedbackStrip.textContent = message;
    els.feedbackStrip.classList.toggle("is-good", kind === "good");
    els.feedbackStrip.classList.toggle("is-bad", kind === "bad");
  }

  function setActiveTab() {
    document.querySelectorAll(".practice-tab").forEach((tab) => {
      const active = tab.dataset.mode === state.mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  }

  function updateKeyboardTarget(code) {
    document.querySelectorAll(".key-button").forEach((button) => {
      button.classList.toggle("is-target", Boolean(code) && button.dataset.code === code);
    });
  }

  function renderReachForKey(key) {
    const homeText = HOME_CODES.has(key.code) ? "홈키" : "이동 자리";
    els.currentKeyBadge.textContent = homeText;
    els.reachList.innerHTML = `
      <span>지금 자리</span>
      <strong>${key.hangul}</strong>
      <p>${FINGER_LABELS[key.finger]}로 ${key.latin} 자리를 누릅니다.</p>
    `;
  }

  function renderReachForText(target) {
    els.currentKeyBadge.textContent = "한/영 확인";
    els.reachList.innerHTML = `
      <span>지금 입력</span>
      <strong>${target}</strong>
      <p>한글 입력 모드에서 목표 글자를 그대로 입력합니다.</p>
    `;
  }

  function renderPractice() {
    const set = PRACTICE_SETS[state.mode];
    const target = getCurrentTarget();
    const total = set.targets.length;
    const completed = Math.min(state.completed[state.mode], total);

    setActiveTab();
    els.practiceModeLabel.textContent = set.label;
    els.completedCount.textContent = String(completed);
    els.totalCount.textContent = String(total);
    els.attemptCount.textContent = String(state.attempts[state.mode]);
    els.nextButton.textContent = completed >= total ? "다시" : "다음";

    if (state.mode === "find") {
      const key = getKey(target);
      els.targetDisplay.textContent = key.hangul;
      els.targetHint.textContent = `${FINGER_LABELS[key.finger]} · ${key.latin} 자리`;
      els.keyCapture.hidden = false;
      els.answerInput.hidden = true;
      els.answerInput.value = "";
      updateKeyboardTarget(key.code);
      renderReachForKey(key);
      requestAnimationFrame(() => els.keyCapture.focus());
      return;
    }

    els.targetDisplay.textContent = target;
    els.targetHint.textContent = "한글 입력 모드";
    els.keyCapture.hidden = true;
    els.answerInput.hidden = false;
    els.answerInput.value = "";
    els.answerInput.placeholder = target;
    updateKeyboardTarget("");
    renderReachForText(target);
    requestAnimationFrame(() => els.answerInput.focus());
  }

  function pulseKey(code, className) {
    const keyButton = els.keyboardBoard.querySelector(`[data-code="${code}"]`);
    if (!keyButton) return;
    keyButton.classList.add(className);
    window.setTimeout(() => {
      keyButton.classList.remove(className);
    }, 360);
  }

  function advanceAfterCorrect() {
    const set = PRACTICE_SETS[state.mode];
    const total = set.targets.length;
    state.completed[state.mode] = Math.min(total, state.completed[state.mode] + 1);

    if (state.completed[state.mode] >= total) {
      setFeedback("좋아요. 이 단계가 끝났습니다.", "good");
      renderPractice();
      return;
    }

    state.index[state.mode] = (state.index[state.mode] + 1) % total;
    setFeedback("정확해요. 다음 목표로 갑니다.", "good");
    renderPractice();
  }

  function handleFindCode(code) {
    if (state.mode !== "find") return;
    const targetCode = getCurrentTarget();
    const targetKey = getKey(targetCode);
    state.attempts.find += 1;

    if (code === targetCode) {
      pulseKey(code, "is-hit");
      advanceAfterCorrect();
      return;
    }

    const pressedKey = getKey(code);
    pulseKey(code, "is-miss");
    const pressedText = pressedKey ? `${pressedKey.hangul}(${pressedKey.latin})` : "다른 키";
    setFeedback(`${pressedText}가 아니라 ${targetKey.hangul}(${targetKey.latin}) 자리입니다.`, "bad");
    renderPractice();
  }

  function handleTextInput() {
    if (state.mode === "find" || state.composing) return;

    const target = getCurrentTarget();
    const value = normalizeText(els.answerInput.value);
    if (!value) {
      setFeedback("목표 글자를 입력하세요.", "");
      return;
    }

    if (/[A-Za-z]/.test(value)) {
      setFeedback("한/영 키 확인: 지금은 한글 입력 모드가 필요합니다.", "bad");
      return;
    }

    if (value === target) {
      state.attempts[state.mode] += 1;
      advanceAfterCorrect();
      return;
    }

    if (value.length >= target.length) {
      state.attempts[state.mode] += 1;
      setFeedback(`다시 입력해 보세요. 목표는 ${target}입니다.`, "bad");
    }
  }

  function switchMode(mode) {
    if (!PRACTICE_SETS[mode]) return;
    state.mode = mode;
    setFeedback(mode === "find" ? "목표 키를 보고 손가락을 먼저 올려 보세요." : "한글 입력 모드로 목표를 입력하세요.", "");
    renderPractice();
  }

  function resetMode() {
    state.index[state.mode] = 0;
    state.completed[state.mode] = 0;
    state.attempts[state.mode] = 0;
    setFeedback(state.mode === "find" ? "목표 키를 보고 손가락을 먼저 올려 보세요." : "한글 입력 모드로 목표를 입력하세요.", "");
    renderPractice();
  }

  function skipOrRestart() {
    const set = PRACTICE_SETS[state.mode];
    if (state.completed[state.mode] >= set.targets.length) {
      resetMode();
      return;
    }
    state.index[state.mode] = (state.index[state.mode] + 1) % set.targets.length;
    setFeedback("다음 목표로 이동했습니다.", "");
    renderPractice();
  }

  function bindEvents() {
    document.querySelectorAll(".practice-tab").forEach((tab) => {
      tab.addEventListener("click", () => switchMode(tab.dataset.mode));
    });

    els.keyboardBoard.addEventListener("click", (event) => {
      const button = event.target.closest(".key-button");
      if (!button) return;
      handleFindCode(button.dataset.code);
    });

    document.addEventListener("keydown", (event) => {
      if (state.mode !== "find") return;
      if (!event.code || !event.code.startsWith("Key")) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      const tagName = event.target && event.target.tagName;
      if (tagName === "TEXTAREA" || tagName === "INPUT") return;
      event.preventDefault();
      handleFindCode(event.code);
    });

    els.answerInput.addEventListener("compositionstart", () => {
      state.composing = true;
    });
    els.answerInput.addEventListener("compositionend", () => {
      state.composing = false;
      handleTextInput();
    });
    els.answerInput.addEventListener("input", handleTextInput);
    els.nextButton.addEventListener("click", skipOrRestart);
    els.resetPractice.addEventListener("click", resetMode);
  }

  renderKeyboard();
  bindEvents();
  renderPractice();
})();
