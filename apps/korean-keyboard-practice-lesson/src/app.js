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

  const WORD_TARGETS = ["한국", "학생", "학교", "이름", "컴퓨터", "전화", "커피", "가방", "친구", "오늘", "사람", "시간", "음식", "운동", "시장", "가족", "사진", "버스"];

  const LESSON_STAGES = [
    { id: "ready", title: "준비", minutes: 2, kind: "warmup", targets: ["KeyF", "KeyJ"], completionLabel: "준비 완료" },
    { id: "layout", title: "자판 보기", minutes: 2, kind: "layout", targets: ["KeyF", "KeyJ", "KeyR", "KeyK"], completionLabel: "자판 확인" },
    { id: "home", title: "홈키 자리 찾기", minutes: 4, kind: "find", targets: ["KeyF", "KeyJ", "KeyA", "KeyS", "KeyD", "KeyK", "KeyL", "KeyF", "KeyJ", "KeyA", "KeyS", "KeyD", "KeyK", "KeyL"], completionLabel: "홈키 완료" },
    { id: "common", title: "자주 쓰는 자모 찾기", minutes: 4, kind: "find", targets: ["KeyR", "KeyT", "KeyG", "KeyH", "KeyY", "KeyU", "KeyN", "KeyB", "KeyM", "KeyE", "KeyW", "KeyO", "KeyP", "KeyV"], completionLabel: "확장 자리 완료" },
    { id: "syllable", title: "음절 입력", minutes: 4, kind: "text", targets: ["가", "나", "다", "마", "바", "사", "아", "자", "하", "고", "구", "기", "거", "너", "더", "러", "머", "버", "서", "어", "저", "호", "후", "히"], completionLabel: "음절 완료" },
    { id: "word", title: "단어 입력", minutes: 4, kind: "text", targets: WORD_TARGETS, completionLabel: "단어 완료" },
    { id: "rhythm", title: "리듬 단어 입력", minutes: 4, kind: "rhythm", targets: WORD_TARGETS, completionLabel: "리듬 완료" },
    { id: "finish", title: "마무리", minutes: 1, kind: "summary", targets: [], completionLabel: "수업 정리" }
  ];

  const TOTAL_MINUTES = LESSON_STAGES.reduce((sum, stage) => sum + stage.minutes, 0);
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
  const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  const JUNGSEONG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
  const JONGSEONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  const JAMO_TO_CODE = {
    "ㅂ": "KeyQ", "ㅃ": "KeyQ", "ㅈ": "KeyW", "ㅉ": "KeyW", "ㄷ": "KeyE", "ㄸ": "KeyE",
    "ㄱ": "KeyR", "ㄲ": "KeyR", "ㅅ": "KeyT", "ㅆ": "KeyT", "ㅛ": "KeyY", "ㅕ": "KeyU",
    "ㅑ": "KeyI", "ㅐ": "KeyO", "ㅒ": "KeyO", "ㅔ": "KeyP", "ㅖ": "KeyP", "ㅁ": "KeyA",
    "ㄴ": "KeyS", "ㅇ": "KeyD", "ㄹ": "KeyF", "ㅎ": "KeyG", "ㅗ": "KeyH", "ㅓ": "KeyJ",
    "ㅏ": "KeyK", "ㅣ": "KeyL", "ㅋ": "KeyZ", "ㅌ": "KeyX", "ㅊ": "KeyC", "ㅍ": "KeyV",
    "ㅠ": "KeyB", "ㅜ": "KeyN", "ㅡ": "KeyM"
  };
  const COMPOSITE_VOWELS = {
    "ㅘ": ["ㅗ", "ㅏ"],
    "ㅙ": ["ㅗ", "ㅐ"],
    "ㅚ": ["ㅗ", "ㅣ"],
    "ㅝ": ["ㅜ", "ㅓ"],
    "ㅞ": ["ㅜ", "ㅔ"],
    "ㅟ": ["ㅜ", "ㅣ"],
    "ㅢ": ["ㅡ", "ㅣ"]
  };
  const COMPOSITE_FINALS = {
    "ㄳ": ["ㄱ", "ㅅ"],
    "ㄵ": ["ㄴ", "ㅈ"],
    "ㄶ": ["ㄴ", "ㅎ"],
    "ㄺ": ["ㄹ", "ㄱ"],
    "ㄻ": ["ㄹ", "ㅁ"],
    "ㄼ": ["ㄹ", "ㅂ"],
    "ㄽ": ["ㄹ", "ㅅ"],
    "ㄾ": ["ㄹ", "ㅌ"],
    "ㄿ": ["ㄹ", "ㅍ"],
    "ㅀ": ["ㄹ", "ㅎ"],
    "ㅄ": ["ㅂ", "ㅅ"]
  };

  const state = {
    stageIndex: 0,
    targetIndex: {},
    completed: {},
    attempts: {},
    skipped: new Set(),
    readyImeDone: false,
    englishWarnings: 0,
    lastEnglishValue: "",
    composing: false,
    rhythmMissed: 0,
    rhythmStartedAt: {},
    rhythmTimeCue: {},
    transitionOpen: false,
    transitionStageIndex: 0,
    guideAnimationToken: ""
  };

  let rhythmCueTimer = 0;

  const els = {
    stageList: document.getElementById("stageList"),
    timeSummary: document.getElementById("timeSummary"),
    timeProgress: document.getElementById("timeProgress"),
    stageMeta: document.getElementById("stageMeta"),
    missionTitle: document.getElementById("missionTitle"),
    stageStatus: document.getElementById("stageStatus"),
    targetArea: document.getElementById("targetArea"),
    standardTarget: document.getElementById("standardTarget"),
    rhythmArea: document.getElementById("rhythmArea"),
    rhythmWordCard: document.getElementById("rhythmWordCard"),
    rhythmCaption: document.getElementById("rhythmCaption"),
    missionModeLabel: document.getElementById("missionModeLabel"),
    targetDisplay: document.getElementById("targetDisplay"),
    targetHint: document.getElementById("targetHint"),
    keyCapture: document.getElementById("keyCapture"),
    answerInput: document.getElementById("answerInput"),
    stageTask: document.getElementById("stageTask"),
    feedbackStrip: document.getElementById("feedbackStrip"),
    completedCount: document.getElementById("completedCount"),
    totalCount: document.getElementById("totalCount"),
    attemptCount: document.getElementById("attemptCount"),
    missionActions: document.getElementById("missionActions"),
    completionPrompt: document.getElementById("completionPrompt"),
    prevStageButton: document.getElementById("prevStageButton"),
    retryStageButton: document.getElementById("retryStageButton"),
    nextStageButton: document.getElementById("nextStageButton"),
    resetLesson: document.getElementById("resetLesson"),
    keyboardBoard: document.getElementById("keyboardBoard"),
    currentKeyBadge: document.getElementById("currentKeyBadge"),
    reachList: document.getElementById("reachList"),
    transitionOverlay: document.getElementById("transitionOverlay"),
    transitionTitle: document.getElementById("transitionTitle"),
    transitionMessage: document.getElementById("transitionMessage"),
    transitionSummary: document.getElementById("transitionSummary"),
    transitionNextButton: document.getElementById("transitionNextButton"),
    transitionRetryButton: document.getElementById("transitionRetryButton")
  };

  function getStage() {
    return LESSON_STAGES[state.stageIndex];
  }

  function getKey(code) {
    return KEY_LAYOUT.find((key) => key.code === code);
  }

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function getTargetIndex(stage) {
    return state.targetIndex[stage.id] || 0;
  }

  function getCurrentTarget(stage) {
    return stage.targets[getTargetIndex(stage)];
  }

  function getStageTotal(stage) {
    if (stage.kind === "warmup") return stage.targets.length + 1;
    if (stage.kind === "layout") return stage.targets.length;
    if (stage.kind === "info" || stage.kind === "summary") return 1;
    return stage.targets.length;
  }

  function getStageCompleted(stage) {
    if (stage.kind === "summary") return 1;
    if (stage.kind === "warmup") {
      return Number(state.readyImeDone) + Math.min(state.completed[stage.id] || 0, stage.targets.length);
    }
    return Math.min(state.completed[stage.id] || 0, getStageTotal(stage));
  }

  function isStageComplete(stage) {
    return getStageCompleted(stage) >= getStageTotal(stage);
  }

  function setFeedback(message, kind) {
    els.feedbackStrip.textContent = message;
    els.feedbackStrip.classList.toggle("is-good", kind === "good");
    els.feedbackStrip.classList.toggle("is-bad", kind === "bad");
    els.feedbackStrip.classList.toggle("is-warn", kind === "warn");
  }

  function clearRhythmCueTimer() {
    if (!rhythmCueTimer) return;
    window.clearTimeout(rhythmCueTimer);
    rhythmCueTimer = 0;
  }

  function activateRhythmTimeCue(stage) {
    if (getStage().id !== stage.id || isStageComplete(stage)) return;
    state.rhythmTimeCue[stage.id] = true;
    els.targetArea.classList.add("is-time-cue");
    els.rhythmCaption.textContent = "권장 시간이 지났습니다. 다음 단계로 넘어가도 좋아요.";
    setFeedback("권장 시간이 지났습니다. 다음 단계로 넘어가도 좋아요.", "warn");
  }

  function armRhythmTimeCue(stage) {
    clearRhythmCueTimer();
    if (stage.kind !== "rhythm" || state.rhythmTimeCue[stage.id] || isStageComplete(stage)) return;
    if (!state.rhythmStartedAt[stage.id]) state.rhythmStartedAt[stage.id] = Date.now();
    const elapsed = Date.now() - state.rhythmStartedAt[stage.id];
    const delay = Math.max(0, stage.minutes * 60 * 1000 - elapsed);
    rhythmCueTimer = window.setTimeout(() => activateRhythmTimeCue(stage), delay);
  }

  function closeTransitionOverlay() {
    state.transitionOpen = false;
    els.transitionOverlay.hidden = true;
  }

  function openTransitionOverlay(stage) {
    const nextStage = LESSON_STAGES[state.stageIndex + 1];
    state.transitionOpen = true;
    state.transitionStageIndex = state.stageIndex;
    els.transitionTitle.textContent = "잘했어요";
    els.transitionMessage.textContent = `${stage.title} 연습을 끝냈습니다. 키보드로 다음 행동을 선택하세요.`;
    els.transitionSummary.textContent = `완료 ${getStageCompleted(stage)}/${getStageTotal(stage)} · 다음 ${nextStage ? nextStage.title : "처음부터"}`;
    els.transitionNextButton.innerHTML = `${nextStage ? "다음 연습" : "처음부터"} <kbd>Enter</kbd>`;
    els.transitionOverlay.hidden = false;
    requestAnimationFrame(() => els.transitionNextButton.focus());
  }

  function advanceRhythmTarget(stage) {
    state.targetIndex[stage.id] = (getTargetIndex(stage) + 1) % stage.targets.length;
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
        if (HOME_CODES.has(key.code)) button.classList.add("is-home");
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

  function expandJamo(jamo) {
    return COMPOSITE_VOWELS[jamo] || COMPOSITE_FINALS[jamo] || (jamo ? [jamo] : []);
  }

  function getInputSequence(text) {
    return Array.from(text || "").flatMap((char) => {
      const codePoint = char.charCodeAt(0);
      if (codePoint >= 0xac00 && codePoint <= 0xd7a3) {
        const syllableIndex = codePoint - 0xac00;
        const initial = CHOSEONG[Math.floor(syllableIndex / 588)];
        const medial = JUNGSEONG[Math.floor((syllableIndex % 588) / 28)];
        const final = JONGSEONG[syllableIndex % 28];
        return [initial, ...expandJamo(medial), ...expandJamo(final)]
          .filter(Boolean)
          .map((jamo) => ({ jamo, code: JAMO_TO_CODE[jamo] || "" }))
          .filter((item) => item.code);
      }
      return expandJamo(char)
        .map((jamo) => ({ jamo, code: JAMO_TO_CODE[jamo] || "" }))
        .filter((item) => item.code);
    });
  }

  function getTypingGuide(target, currentValue = "") {
    const sequence = getInputSequence(target);
    const currentSequence = getInputSequence(currentValue);
    let matchedCount = 0;

    while (
      matchedCount < sequence.length &&
      matchedCount < currentSequence.length &&
      sequence[matchedCount].jamo === currentSequence[matchedCount].jamo &&
      sequence[matchedCount].code === currentSequence[matchedCount].code
    ) {
      matchedCount += 1;
    }

    const isPrefix = matchedCount === currentSequence.length && currentSequence.length <= sequence.length;
    const nextInput = sequence[matchedCount] || null;
    const remainingSequence = sequence.slice(matchedCount);
    const typedSequence = sequence.slice(0, matchedCount);

    return {
      sequence,
      currentSequence,
      matchedCount,
      isPrefix,
      requiredCodes: [...new Set(remainingSequence.map((item) => item.code))],
      typedCodes: [...new Set(typedSequence.map((item) => item.code))],
      nextCode: nextInput ? nextInput.code : "",
      nextJamo: nextInput ? nextInput.jamo : "",
      guideToken: `${target}|${matchedCount}|${currentSequence.map((item) => item.jamo).join("")}`
    };
  }

  function getKeyboardGuideForText(target) {
    return getTypingGuide(target, "");
  }

  function updateKeyboardGuide({ targetCode = "", requiredCodes = [], typedCodes = [], nextCode = "", guideToken = "" } = {}) {
    const requiredSet = new Set(requiredCodes.filter(Boolean));
    const typedSet = new Set(typedCodes.filter(Boolean));
    const nextToken = nextCode ? `${nextCode}:${guideToken || nextCode}` : "";
    const shouldRestartNextAnimation = Boolean(nextToken) && nextToken !== state.guideAnimationToken;
    state.guideAnimationToken = nextToken;
    if (nextCode) typedSet.delete(nextCode);

    els.keyboardBoard.querySelectorAll(".key-button").forEach((button) => {
      const code = button.dataset.code;
      const isNextKey = Boolean(nextCode) && code === nextCode;
      button.classList.toggle("is-target", Boolean(targetCode) && code === targetCode);
      button.classList.toggle("is-typed", typedSet.has(code));
      button.classList.toggle("is-required", requiredSet.has(code));
      if (isNextKey && shouldRestartNextAnimation) {
        button.classList.remove("is-next-key");
        void button.offsetWidth;
      }
      button.classList.toggle("is-next-key", isNextKey);
    });
  }

  function updateKeyboardTarget(code) {
    updateKeyboardGuide({ targetCode: code });
  }

  function renderStageList() {
    els.stageList.innerHTML = LESSON_STAGES.map((stage, index) => {
      const active = index === state.stageIndex;
      const complete = isStageComplete(stage);
      const skipped = state.skipped.has(stage.id) && !complete;
      return `
        <button class="stage-button${active ? " is-active" : ""}${complete ? " is-complete" : ""}${skipped ? " is-skipped" : ""}" type="button" data-stage-index="${index}" aria-disabled="true" tabindex="-1">
          <span>${index + 1}단계 · ${stage.minutes}분</span>
          <strong>${stage.title}</strong>
        </button>
      `;
    }).join("");
  }

  function renderTime(stage) {
    const stageNumber = state.stageIndex + 1;
    const elapsedThroughStage = LESSON_STAGES.slice(0, stageNumber).reduce((sum, item) => sum + item.minutes, 0);
    const progress = Math.round((elapsedThroughStage / TOTAL_MINUTES) * 100);
    els.timeSummary.textContent = `${stageNumber}단계 · ${stage.minutes}분`;
    els.timeProgress.style.width = `${progress}%`;
    els.stageMeta.textContent = `${stageNumber}단계 · 권장 ${stage.minutes}분`;
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

  function renderReachForTypingGuide(target, guide, isRhythm = false) {
    const nextKey = guide.nextCode ? getKey(guide.nextCode) : null;
    if (nextKey) {
      els.currentKeyBadge.textContent = `다음 ${nextKey.hangul}`;
      els.reachList.innerHTML = `
        <span>다음 키</span>
        <strong>${guide.nextJamo}</strong>
        <p>${nextKey.latin} 자리 · ${FINGER_LABELS[nextKey.finger]}로 이어 입력합니다.</p>
      `;
      return;
    }

    els.currentKeyBadge.textContent = isRhythm ? "리듬 입력" : "한글 입력";
    els.reachList.innerHTML = `
      <span>지금 입력</span>
      <strong>${target}</strong>
      <p>${isRhythm ? "단어가 맞으면 다음 비트로 넘어갑니다." : "목표 입력을 마치면 다음 항목으로 넘어갑니다."}</p>
    `;
  }

  function applyTypingGuide(target, currentValue = "", isRhythm = false) {
    const guide = getTypingGuide(target, currentValue);
    updateKeyboardGuide(guide);
    renderReachForTypingGuide(target, guide, isRhythm);
    return guide;
  }

  function getActiveTypingTarget(stage = getStage()) {
    if (stage.kind === "warmup" && !state.readyImeDone) {
      return { target: "가", isRhythm: false };
    }

    if ((stage.kind === "text" || stage.kind === "rhythm") && !isStageComplete(stage)) {
      return { target: getCurrentTarget(stage), isRhythm: stage.kind === "rhythm" };
    }

    return null;
  }

  function refreshTypingGuideOnly(valueOverride = "") {
    const activeTarget = getActiveTypingTarget();
    if (!activeTarget || !activeTarget.target) return null;
    const currentValue = normalizeText(els.answerInput.value || valueOverride);
    return applyTypingGuide(activeTarget.target, currentValue, activeTarget.isRhythm);
  }

  function renderReachForStage(stage) {
    if (stage.kind === "warmup" && !state.readyImeDone) {
      const nextInput = getInputSequence("가")[0];
      const nextKey = nextInput ? getKey(nextInput.code) : null;
      els.currentKeyBadge.textContent = nextKey ? `다음 ${nextKey.hangul}` : "한/영 전환";
      els.reachList.innerHTML = `
        <span>한/영 확인</span>
        <strong>가</strong>
        <p>${nextKey ? `${nextKey.latin} 자리부터 눌러 한글 입력 상태를 확인합니다.` : "R과 K를 눌러 가가 나오는지 확인합니다."}</p>
      `;
      return;
    }

    if (stage.kind === "text" || stage.kind === "rhythm") {
      const target = getCurrentTarget(stage) || "완료";
      renderReachForTypingGuide(target, getTypingGuide(target, ""), stage.kind === "rhythm");
      return;
    }

    els.currentKeyBadge.textContent = stage.kind === "layout" ? "전체 배열" : "수업 준비";
    els.reachList.innerHTML = `
      <span>지금 안내</span>
      <strong>${stage.title}</strong>
      <p>${stage.kind === "layout" ? "왼손은 주로 자음, 오른손은 주로 모음을 담당합니다." : "손가락을 홈키 가까이에 편하게 올립니다."}</p>
    `;
  }

  function renderWarmupTask(stage) {
    const pressedCount = getStageCompleted(stage);
    els.stageTask.hidden = false;

    if (!state.readyImeDone) {
      els.stageTask.innerHTML = `
        <div class="rhythm-score-strip" aria-label="한영 전환 입력 진행">
          <span>한/영 전환 <strong>확인</strong></span>
          <span>누를 키 <strong>R · K</strong></span>
          <span>진행 <strong>${pressedCount}/${getStageTotal(stage)}</strong></span>
        </div>
      `;
      els.targetDisplay.textContent = "가";
      els.targetHint.textContent = "한/영 키로 한글 입력을 켠 뒤 R + K를 눌러 가를 만듭니다.";
      els.answerInput.hidden = false;
      els.answerInput.placeholder = "가";
      applyTypingGuide("가", els.answerInput.value, false);
      requestAnimationFrame(() => els.answerInput.focus());
      return;
    }

    const targetCode = getCurrentTarget(stage);
    const key = getKey(targetCode);
    els.stageTask.innerHTML = `
      <div class="rhythm-score-strip" aria-label="준비 키 입력 진행">
        <span>한/영 <strong>완료</strong></span>
        <span>기준키 <strong>F · J</strong></span>
        <span>진행 <strong>${pressedCount}/${getStageTotal(stage)}</strong></span>
      </div>
    `;
    els.targetDisplay.textContent = key.hangul;
    els.targetHint.textContent = `${key.latin} 키를 실제로 눌러 기준 위치를 확인합니다.`;
    els.keyCapture.hidden = false;
    updateKeyboardTarget(key.code);
    renderReachForKey(key);
    requestAnimationFrame(() => els.keyCapture.focus());
  }

  function renderLayoutTask(stage) {
    const targetCode = getCurrentTarget(stage);
    const key = getKey(targetCode);
    const pressedCount = getStageCompleted(stage);
    els.stageTask.hidden = false;
    els.stageTask.innerHTML = `
      <div class="rhythm-score-strip" aria-label="자판 보기 키 입력 진행">
        <span>홈키 <strong>F · J</strong></span>
        <span>첫 글자 <strong>R · K</strong></span>
        <span>진행 <strong>${pressedCount}/${getStageTotal(stage)}</strong></span>
      </div>
    `;
    els.targetDisplay.textContent = key.hangul;
    els.targetHint.textContent = `${key.latin} 자리로 전체 자판의 기준 위치를 확인합니다.`;
    els.keyCapture.hidden = false;
    updateKeyboardTarget(key.code);
    renderReachForKey(key);
    requestAnimationFrame(() => els.keyCapture.focus());
  }

  function renderRhythmTask(stage) {
    const target = getCurrentTarget(stage) || stage.targets[0];
    const completed = getStageCompleted(stage);
    const missed = state.rhythmMissed || 0;
    const cueActive = Boolean(state.rhythmTimeCue[stage.id]) && !isStageComplete(stage);

    applyTypingGuide(target, els.answerInput.value, true);
    els.rhythmWordCard.textContent = target;
    els.rhythmWordCard.classList.remove("is-pulsing");
    void els.rhythmWordCard.offsetWidth;
    els.rhythmWordCard.classList.add("is-pulsing");
    els.rhythmCaption.textContent = cueActive ? "권장 시간이 지났습니다. 다음 단계로 넘어가도 좋아요." : "판정선에 맞춰 단어를 정확히 입력하세요.";
    els.answerInput.hidden = false;
    els.answerInput.placeholder = target;
    els.stageTask.hidden = false;
    els.stageTask.innerHTML = `
      <div class="rhythm-score-strip" aria-label="리듬 입력 진행">
        <span>성공 <strong>${completed}</strong></span>
        <span>놓침 <strong>${missed}</strong></span>
        <span>진행 <strong>${completed}/${getStageTotal(stage)}</strong></span>
      </div>
    `;
    requestAnimationFrame(() => els.answerInput.focus());
  }

  function renderSummary() {
    const practiceStages = LESSON_STAGES.filter((stage) => stage.kind === "find" || stage.kind === "text" || stage.kind === "rhythm");
    const rhythmStage = LESSON_STAGES.find((stage) => stage.kind === "rhythm");
    const completedTargets = practiceStages.reduce((sum, stage) => sum + getStageCompleted(stage), 0);
    const totalTargets = practiceStages.reduce((sum, stage) => sum + getStageTotal(stage), 0);
    const rhythmSuccess = rhythmStage ? getStageCompleted(rhythmStage) : 0;
    const skippedCount = state.skipped.size;
    const revisit = practiceStages.filter((stage) => !isStageComplete(stage)).map((stage) => stage.title).join(", ") || "없음";

    els.stageTask.hidden = false;
    els.stageTask.innerHTML = `
      <div class="summary-list">
        <div class="summary-item"><span>완료한 미션</span><strong>${completedTargets}/${totalTargets}</strong></div>
        <div class="summary-item"><span>리듬 성공</span><strong>${rhythmSuccess}</strong></div>
        <div class="summary-item"><span>놓친 단어</span><strong>${state.rhythmMissed}</strong></div>
        <div class="summary-item"><span>넘어간 단계</span><strong>${skippedCount}</strong></div>
        <div class="summary-item"><span>한/영 확인</span><strong>${state.englishWarnings}</strong></div>
        <div class="summary-item"><span>다시 연습</span><strong>${revisit}</strong></div>
      </div>
    `;
  }

  function renderMission() {
    const stage = getStage();
    const complete = isStageComplete(stage);
    const total = getStageTotal(stage);
    const completed = getStageCompleted(stage);
    const isRhythm = stage.kind === "rhythm";
    const timeCue = isRhythm && Boolean(state.rhythmTimeCue[stage.id]) && !complete;

    els.missionTitle.textContent = stage.title;
    els.missionModeLabel.textContent = stage.completionLabel;
    els.completedCount.textContent = String(completed);
    els.totalCount.textContent = String(total);
    els.attemptCount.textContent = String(state.attempts[stage.id] || 0);
    els.stageStatus.textContent = complete ? "완료" : state.skipped.has(stage.id) ? "넘어감" : "진행 중";
    els.stageStatus.classList.toggle("is-complete", complete);
    els.stageStatus.classList.toggle("is-skipped", state.skipped.has(stage.id) && !complete);
    els.missionActions.hidden = true;
    els.missionActions.classList.remove("is-complete");
    els.completionPrompt.hidden = true;
    els.completionPrompt.textContent = `${stage.title} 완료! 다음 연습으로 넘어가거나 다시 할 수 있습니다.`;
    els.prevStageButton.hidden = false;
    els.prevStageButton.disabled = state.stageIndex === 0;
    els.retryStageButton.hidden = true;
    els.nextStageButton.classList.toggle("is-ready", complete);
    els.nextStageButton.classList.toggle("is-cue", timeCue);
    els.nextStageButton.textContent = "다음 연습";

    els.targetArea.classList.toggle("is-rhythm", isRhythm);
    els.targetArea.classList.toggle("is-time-cue", timeCue);
    els.standardTarget.hidden = isRhythm;
    els.rhythmArea.hidden = !isRhythm;
    if (isRhythm) {
      armRhythmTimeCue(stage);
    } else {
      clearRhythmCueTimer();
    }

    els.keyCapture.hidden = true;
    els.answerInput.hidden = true;
    els.answerInput.value = "";
    els.stageTask.hidden = true;
    updateKeyboardTarget("");

    if (stage.kind === "warmup") {
      renderWarmupTask(stage);
      return;
    }

    if (stage.kind === "layout") {
      renderLayoutTask(stage);
      return;
    }

    if (stage.kind === "find") {
      const key = getKey(getCurrentTarget(stage));
      els.targetDisplay.textContent = key.hangul;
      els.targetHint.textContent = `${FINGER_LABELS[key.finger]} · ${key.latin} 자리`;
      els.keyCapture.hidden = false;
      updateKeyboardTarget(key.code);
      renderReachForKey(key);
      requestAnimationFrame(() => els.keyCapture.focus());
      return;
    }

    if (stage.kind === "text") {
      const target = getCurrentTarget(stage);
      els.targetDisplay.textContent = target;
      els.targetHint.textContent = "한글 입력 모드";
      els.answerInput.hidden = false;
      els.answerInput.placeholder = target;
      applyTypingGuide(target, els.answerInput.value, false);
      requestAnimationFrame(() => els.answerInput.focus());
      return;
    }

    if (stage.kind === "rhythm") {
      renderRhythmTask(stage);
      return;
    }

    els.targetDisplay.textContent = "완료";
    els.targetHint.textContent = "오늘 연습 결과를 확인합니다.";
    renderSummary();
    renderReachForStage(stage);
  }

  function render() {
    const stage = getStage();
    renderTime(stage);
    renderStageList();
    renderMission();
  }

  function pulseKey(code, className) {
    const keyButton = els.keyboardBoard.querySelector(`[data-code="${code}"]`);
    if (!keyButton) return;
    keyButton.classList.add(className);
    window.setTimeout(() => keyButton.classList.remove(className), 360);
  }

  function handleFindCode(code) {
    const stage = getStage();
    if (stage.kind !== "find") return;
    if (isStageComplete(stage)) {
      setFeedback("이 단계의 자리를 모두 눌렀습니다. 다음 단계로 이동하세요.", "good");
      return;
    }

    const targetCode = getCurrentTarget(stage);
    const targetKey = getKey(targetCode);
    state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;

    if (code === targetCode) {
      state.completed[stage.id] = (state.completed[stage.id] || 0) + 1;
      state.skipped.delete(stage.id);
      pulseKey(code, "is-hit");
      if (isStageComplete(stage)) {
        setFeedback(`${stage.completionLabel}: 모두 눌렀습니다.`, "good");
        render();
        openTransitionOverlay(stage);
      } else {
        state.targetIndex[stage.id] = getTargetIndex(stage) + 1;
        setFeedback("정확해요. 다음 자리를 찾아보세요.", "good");
        render();
      }
      return;
    }

    const pressedKey = getKey(code);
    pulseKey(code, "is-miss");
    const pressedText = pressedKey ? `${pressedKey.hangul}(${pressedKey.latin})` : "다른 키";
    setFeedback(`${pressedText}가 아니라 ${targetKey.hangul}(${targetKey.latin}) 자리입니다.`, "bad");
    render();
  }

  function handleWarmupInput() {
    const stage = getStage();
    if (stage.kind !== "warmup") return;
    if (state.readyImeDone) return;
    if (state.composing) {
      refreshTypingGuideOnly();
      return;
    }

    const target = "가";
    const value = normalizeText(els.answerInput.value);
    const guide = applyTypingGuide(target, value, false);
    if (!value) {
      setFeedback("한/영 키로 한글 입력을 켠 뒤 R + K를 눌러 가를 입력하세요.", "");
      return;
    }

    if (/[A-Za-z]/.test(value)) {
      if (state.lastEnglishValue !== value) {
        state.englishWarnings += 1;
        state.lastEnglishValue = value;
        state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      }
      els.answerInput.value = "";
      setFeedback("한/영 키를 눌러 한글 입력으로 바꿔 보세요.", "bad");
      render();
      return;
    }

    state.lastEnglishValue = "";
    if (value === target) {
      state.readyImeDone = true;
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      els.answerInput.value = "";
      setFeedback("한글 입력 확인 완료. 이제 F와 J 기준키를 눌러 보세요.", "good");
      render();
      return;
    }

    if (guide.isPrefix) {
      setFeedback("좋아요. 확대된 다음 키를 이어서 눌러 보세요.", "");
      return;
    }

    if (value.length >= 1) {
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      setFeedback("목표는 가입니다. R + K를 천천히 눌러 보세요.", "bad");
      render();
    }
  }

  function handleWarmupCode(code) {
    const stage = getStage();
    if (stage.kind !== "warmup") return;
    if (!state.readyImeDone) {
      setFeedback("먼저 한/영 키를 확인하고 가를 입력하세요.", "warn");
      requestAnimationFrame(() => els.answerInput.focus());
      return;
    }
    if (isStageComplete(stage)) return;

    const targetCode = getCurrentTarget(stage);
    const targetKey = getKey(targetCode);
    state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;

    if (code === targetCode) {
      state.completed[stage.id] = (state.completed[stage.id] || 0) + 1;
      state.skipped.delete(stage.id);
      pulseKey(code, "is-hit");
      if (isStageComplete(stage)) {
        setFeedback("준비 완료: 한/영과 기준키를 확인했습니다.", "good");
        render();
        openTransitionOverlay(stage);
      } else {
        state.targetIndex[stage.id] = getTargetIndex(stage) + 1;
        setFeedback("좋아요. 이제 오른손 기준키 J를 눌러 보세요.", "good");
        render();
      }
      return;
    }

    pulseKey(code, "is-miss");
    setFeedback(`${targetKey.hangul}(${targetKey.latin}) 기준키부터 눌러 보세요.`, "bad");
    render();
  }

  function handleLayoutCode(code) {
    const stage = getStage();
    if (stage.kind !== "layout") return;
    if (isStageComplete(stage)) return;

    const targetCode = getCurrentTarget(stage);
    const targetKey = getKey(targetCode);
    state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;

    if (code === targetCode) {
      state.completed[stage.id] = (state.completed[stage.id] || 0) + 1;
      state.skipped.delete(stage.id);
      pulseKey(code, "is-hit");
      if (isStageComplete(stage)) {
        setFeedback("자판 확인 완료: 홈키와 첫 글자 위치를 눌렀습니다.", "good");
        render();
        openTransitionOverlay(stage);
      } else {
        state.targetIndex[stage.id] = getTargetIndex(stage) + 1;
        setFeedback("좋아요. 다음 자판 위치를 확인하세요.", "good");
        render();
      }
      return;
    }

    pulseKey(code, "is-miss");
    setFeedback(`${targetKey.hangul}(${targetKey.latin}) 자리를 눌러 자판 위치를 확인하세요.`, "bad");
    render();
  }

  function handleRhythmInput() {
    const stage = getStage();
    if (stage.kind !== "rhythm") return;
    if (isStageComplete(stage)) return;
    if (state.composing) {
      refreshTypingGuideOnly();
      return;
    }

    const target = getCurrentTarget(stage);
    const value = normalizeText(els.answerInput.value);
    const guide = applyTypingGuide(target, value, true);
    if (!value) {
      setFeedback("리듬 단어를 입력하세요.", "");
      return;
    }

    if (/[A-Za-z]/.test(value)) {
      if (state.lastEnglishValue !== value) {
        state.englishWarnings += 1;
        state.lastEnglishValue = value;
      }
      setFeedback("한/영 키 확인: 지금은 한글 입력 모드가 필요합니다.", "bad");
      return;
    }

    state.lastEnglishValue = "";
    if (value === target) {
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      state.completed[stage.id] = (state.completed[stage.id] || 0) + 1;
      state.skipped.delete(stage.id);
      if (isStageComplete(stage)) {
        clearRhythmCueTimer();
        setFeedback(`${stage.completionLabel}: 리듬 단어를 모두 입력했습니다.`, "good");
        render();
        openTransitionOverlay(stage);
      } else {
        advanceRhythmTarget(stage);
        setFeedback("정확해요. 다음 비트로 갑니다.", "good");
        render();
      }
      return;
    }

    if (guide.isPrefix) {
      setFeedback("좋아요. 확대된 다음 키를 이어서 입력하세요.", "");
      return;
    }

    if (value.length >= target.length) {
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      state.rhythmMissed += 1;
      advanceRhythmTarget(stage);
      setFeedback("박자를 놓쳤어요. 다음 단어를 따라가세요.", "warn");
      render();
      return;
    }

    setFeedback("강조된 다음 키를 확인하고 이어서 입력하세요.", "warn");
  }

  function handleTextInput() {
    const stage = getStage();
    if (stage.kind === "warmup") {
      handleWarmupInput();
      return;
    }
    if (stage.kind === "rhythm") {
      handleRhythmInput();
      return;
    }
    if (stage.kind !== "text") return;
    if (isStageComplete(stage)) return;
    if (state.composing) {
      refreshTypingGuideOnly();
      return;
    }

    const target = getCurrentTarget(stage);
    const value = normalizeText(els.answerInput.value);
    const guide = applyTypingGuide(target, value, false);
    if (!value) {
      setFeedback("목표 글자를 입력하세요.", "");
      return;
    }

    if (/[A-Za-z]/.test(value)) {
      if (state.lastEnglishValue !== value) {
        state.englishWarnings += 1;
        state.lastEnglishValue = value;
      }
      setFeedback("한/영 키 확인: 지금은 한글 입력 모드가 필요합니다.", "bad");
      return;
    }

    state.lastEnglishValue = "";
    if (value === target) {
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      state.completed[stage.id] = (state.completed[stage.id] || 0) + 1;
      state.skipped.delete(stage.id);
      if (isStageComplete(stage)) {
        setFeedback(`${stage.completionLabel}: 모두 입력했습니다.`, "good");
        render();
        openTransitionOverlay(stage);
      } else {
        state.targetIndex[stage.id] = getTargetIndex(stage) + 1;
        setFeedback("정확해요. 다음 목표를 입력하세요.", "good");
        render();
      }
      return;
    }

    if (guide.isPrefix) {
      setFeedback("좋아요. 확대된 다음 키를 이어서 입력하세요.", "");
      return;
    }

    if (value.length >= target.length) {
      state.attempts[stage.id] = (state.attempts[stage.id] || 0) + 1;
      setFeedback(`다시 입력해 보세요. 목표는 ${target}입니다.`, "bad");
      render();
      return;
    }

    setFeedback("강조된 다음 키를 확인하고 이어서 입력하세요.", "warn");
  }

  function goToStage(index, feedback) {
    closeTransitionOverlay();
    state.stageIndex = Math.max(0, Math.min(index, LESSON_STAGES.length - 1));
    if (feedback) setFeedback(feedback.message, feedback.kind);
    render();
  }

  function goNext() {
    if (!state.transitionOpen) {
      setFeedback("현재 미션을 끝내면 다음 연습으로 넘어갈 수 있습니다.", "warn");
      return;
    }

    const completedIndex = state.transitionStageIndex;
    if (state.stageIndex === LESSON_STAGES.length - 1) {
      resetLesson();
      return;
    }

    if (completedIndex >= LESSON_STAGES.length - 1) {
      resetLesson();
      return;
    }

    goToStage(completedIndex + 1, { message: "다음 연습을 시작합니다.", kind: "good" });
  }

  function remindTransitionKeyboard(event) {
    event.preventDefault();
    els.transitionMessage.textContent = "마우스 대신 Enter 또는 Space로 다음 연습, R로 다시 하기를 선택합니다.";
  }

  function retryStage() {
    const stage = getStage();
    clearRhythmCueTimer();
    closeTransitionOverlay();
    delete state.targetIndex[stage.id];
    delete state.completed[stage.id];
    delete state.attempts[stage.id];
    state.skipped.delete(stage.id);
    state.lastEnglishValue = "";
    state.composing = false;

    if (stage.kind === "warmup") {
      state.readyImeDone = false;
    }

    if (stage.kind === "rhythm") {
      state.rhythmMissed = 0;
      delete state.rhythmStartedAt[stage.id];
      delete state.rhythmTimeCue[stage.id];
    }

    setFeedback(`${stage.title} 단계를 다시 연습합니다.`, "");
    render();
  }

  function resetLesson() {
    clearRhythmCueTimer();
    closeTransitionOverlay();
    state.stageIndex = 0;
    state.targetIndex = {};
    state.completed = {};
    state.attempts = {};
    state.skipped = new Set();
    state.readyImeDone = false;
    state.englishWarnings = 0;
    state.lastEnglishValue = "";
    state.composing = false;
    state.rhythmMissed = 0;
    state.rhythmStartedAt = {};
    state.rhythmTimeCue = {};
    state.transitionOpen = false;
    state.transitionStageIndex = 0;
    state.guideAnimationToken = "";
    setFeedback("한/영 키로 한글 입력을 켠 뒤 R + K를 눌러 가를 입력하세요.", "");
    render();
  }

  function bindEvents() {
    document.addEventListener("keydown", (event) => {
      if (state.transitionOpen) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goNext();
          return;
        }
        if (event.key.toLowerCase() === "r") {
          event.preventDefault();
          retryStage();
          return;
        }
      }

      const stage = getStage();
      if (stage.kind !== "find" && stage.kind !== "warmup" && stage.kind !== "layout") return;
      if (!event.code || !event.code.startsWith("Key")) return;
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      const tagName = event.target && event.target.tagName;
      if (tagName === "TEXTAREA" || tagName === "INPUT") return;
      event.preventDefault();
      handleWarmupCode(event.code);
      handleLayoutCode(event.code);
      handleFindCode(event.code);
    });

    els.answerInput.addEventListener("compositionstart", (event) => {
      state.composing = true;
      refreshTypingGuideOnly(event.data);
    });
    els.answerInput.addEventListener("compositionupdate", (event) => {
      refreshTypingGuideOnly(event.data);
    });
    els.answerInput.addEventListener("compositionend", () => {
      state.composing = false;
      refreshTypingGuideOnly();
      handleTextInput();
    });
    els.answerInput.addEventListener("input", (event) => {
      if (event.isComposing || state.composing) {
        refreshTypingGuideOnly(event.data);
        return;
      }
      handleTextInput();
    });
    els.transitionNextButton.addEventListener("click", remindTransitionKeyboard);
    els.transitionRetryButton.addEventListener("click", remindTransitionKeyboard);
    els.resetLesson.addEventListener("click", resetLesson);
  }

  renderKeyboard();
  bindEvents();
  render();
})();
