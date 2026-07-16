(() => {
  "use strict";

  const SAVE_KEY = "c15-house-rescue-save-v1";
  const CONTROL_MODE_KEY = "c15-house-rescue-control-mode-v1";
  const TUTORIAL_KEY = "c15-house-rescue-tutorial-v1";
  const WORLD = Object.freeze({ width: 960, height: 640 });
  const REPAIR_STEPS = 2;

  const byId = (id) => document.getElementById(id);
  const ui = {
    game: byId("houseGame"),
    heroToggle: byId("heroToggle"),
    heroDetails: byId("heroDetails"),
    fullscreenToggle: byId("fullscreenToggle"),
    resetButton: byId("resetButton"),
    soundToggle: byId("soundToggle"),
    canvas: byId("houseCanvas"),
    storyToggle: byId("storyToggle"),
    storyToggleLabel: byId("storyToggleLabel"),
    storyPanel: byId("storyPanel"),
    storyTitle: byId("storyTitle"),
    storyBody: byId("storyBody"),
    storyProgressFill: byId("storyProgressFill"),
    storyProgressLabel: byId("storyProgressLabel"),
    statsToggle: byId("statsToggle"),
    statsToggleLabel: byId("statsToggleLabel"),
    statsPanel: byId("statsPanel"),
    roomMap: byId("roomMap"),
    safetyValue: byId("safetyValue"),
    toolValue: byId("toolValue"),
    saveValue: byId("saveValue"),
    journalToggle: byId("journalToggle"),
    journalToggleLabel: byId("journalToggleLabel"),
    startCard: byId("startCard"),
    startEyebrow: byId("startEyebrow"),
    startTitle: byId("startTitle"),
    startDescription: byId("startDescription"),
    controlModeSelector: byId("controlModeSelector"),
    fullscreenButton: byId("fullscreenButton"),
    startButton: byId("startButton"),
    resumeHint: byId("resumeHint"),
    interactionPrompt: byId("interactionPrompt"),
    interactionPromptKey: byId("interactionPromptKey"),
    interactionPromptText: byId("interactionPromptText"),
    dialogueBox: byId("dialogueBox"),
    dialogueSpeaker: byId("dialogueSpeaker"),
    dialogueText: byId("dialogueText"),
    dialogueClose: byId("dialogueClose"),
    diagnosisPanel: byId("diagnosisPanel"),
    diagnosisScene: byId("diagnosisScene"),
    diagnosisQuestion: byId("diagnosisQuestion"),
    diagnosisOptions: byId("diagnosisOptions"),
    diagnosisFeedback: byId("diagnosisFeedback"),
    endingPanel: byId("endingPanel"),
    endingSummary: byId("endingSummary"),
    endingWords: byId("endingWords"),
    endingJournal: byId("endingJournal"),
    endingRestart: byId("endingRestart"),
    toast: byId("toast"),
    toastTitle: byId("toastTitle"),
    toastBody: byId("toastBody"),
    journalBackdrop: byId("journalBackdrop"),
    journalDrawer: byId("journalDrawer"),
    journalClose: byId("journalClose"),
    journalSummary: byId("journalSummary"),
    journalList: byId("journalList"),
    touchControls: byId("touchControls"),
    touchJoystick: byId("touchJoystick"),
    touchJoystickKnob: byId("touchJoystickKnob"),
    touchAction: byId("touchAction"),
    touchActionLabel: byId("touchActionLabel"),
    tapModeHint: byId("tapModeHint"),
    controlTutorial: byId("controlTutorial"),
    tutorialStepLabel: byId("tutorialStepLabel"),
    tutorialTitle: byId("tutorialTitle"),
    tutorialBody: byId("tutorialBody"),
    tutorialStatus: byId("tutorialStatus"),
    tutorialSkip: byId("tutorialSkip"),
    tutorialNext: byId("tutorialNext")
  };

  if (!ui.canvas || !ui.game) return;
  const ctx = ui.canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const ROOMS = Object.freeze([
    { id: "kitchen", name: "주방", icon: "🍳", x: 24, y: 24, w: 432, h: 280, floor: "#fff5d8", line: "#d9a441" },
    { id: "bathroom", name: "욕실", icon: "🛁", x: 504, y: 24, w: 432, h: 280, floor: "#e7f5f7", line: "#63a9b5" },
    { id: "living", name: "거실", icon: "🛋️", x: 24, y: 336, w: 432, h: 280, floor: "#eaf4df", line: "#7fa15f" },
    { id: "bedroom", name: "침실", icon: "🛏️", x: 504, y: 336, w: 432, h: 280, floor: "#f9e7e2", line: "#c7887a" }
  ]);

  const DOORS = Object.freeze([
    { x: 456, y: 118, w: 48, h: 92 },
    { x: 156, y: 304, w: 112, h: 32 },
    { x: 692, y: 304, w: 112, h: 32 },
    { x: 456, y: 438, w: 48, h: 104 }
  ]);

  const ISSUES = Object.freeze([
    {
      id: "water-supply", room: "kitchen", label: "수도꼭지", icon: "🚰", x: 100, y: 76, w: 72, h: 58,
      expression: "수돗물이 안 나오다", clue: "손잡이를 돌려도 물 한 방울 나오지 않아요.",
      example: "주방 수돗물이 안 나와서 관리실에 연락했어요.", repair: "수도 밸브를 확인해요.",
      distractors: ["물이 새다", "물이 안 내려가다"], color: "#4f9ec4"
    },
    {
      id: "power-outage", room: "living", label: "두꺼비집", icon: "💡", x: 72, y: 378, w: 62, h: 68,
      expression: "전기가 나가다", clue: "불도 텔레비전도 갑자기 모두 꺼졌어요.",
      example: "어젯밤에 전기가 나가서 촛불을 켰어요.", repair: "차단기를 안전하게 올려요.",
      distractors: ["난방이 안 되다", "소음이 심하다"], color: "#e7a52e"
    },
    {
      id: "toilet-clog", room: "bathroom", label: "변기", icon: "🚽", x: 560, y: 72, w: 82, h: 78,
      expression: "변기가 막히다", clue: "물을 내리자 물이 차오르고 변기가 꿀렁거려요.",
      example: "변기가 막혀서 뚫어뻥을 사용했어요.", repair: "뚫어뻥으로 막힌 곳을 뚫어요.",
      distractors: ["수돗물이 안 나오다", "물이 새다"], color: "#6e8fc4"
    },
    {
      id: "leak", room: "bathroom", label: "수도관", icon: "💧", x: 842, y: 176, w: 56, h: 72,
      expression: "물이 새다", clue: "수도관 연결 부분에서 물방울이 계속 떨어져요.",
      example: "욕실 수도관에서 물이 새서 바닥이 젖었어요.", repair: "연결 너트를 조여요.",
      distractors: ["물이 안 내려가다", "수돗물이 안 나오다"], color: "#3f9bc0"
    },
    {
      id: "noise", room: "bedroom", label: "이웃집 벽", icon: "🔊", x: 888, y: 414, w: 34, h: 136,
      expression: "소음이 심하다", clue: "벽 너머에서 쿵쿵거리는 소리가 크게 들려요.",
      example: "밤마다 이웃집 소음이 심해서 잠을 못 자요.", repair: "관리실에 조용히 요청해요.",
      distractors: ["전기가 나가다", "이상한 냄새가 나다"], color: "#bd625e"
    },
    {
      id: "heating", room: "bedroom", label: "난방기", icon: "🌡️", x: 548, y: 520, w: 92, h: 54,
      expression: "난방이 안 되다", clue: "온도를 올려도 방바닥과 공기가 계속 차가워요.",
      example: "난방이 안 돼서 방 안이 너무 추워요.", repair: "난방 밸브와 온도계를 확인해요.",
      distractors: ["전기가 나가다", "소음이 심하다"], color: "#d47755"
    },
    {
      id: "smell", room: "kitchen", label: "냉장고", icon: "🧊", x: 352, y: 92, w: 72, h: 118,
      expression: "이상한 냄새가 나다", clue: "문을 여니 코를 찌르는 낯선 냄새가 퍼져요.",
      example: "냉장고에서 이상한 냄새가 나서 안을 청소했어요.", repair: "상한 음식을 버리고 안을 닦아요.",
      distractors: ["소음이 심하다", "난방이 안 되다"], color: "#7f78a8"
    },
    {
      id: "drain", room: "kitchen", label: "싱크대 배수구", icon: "🕳️", x: 220, y: 78, w: 72, h: 58,
      expression: "물이 안 내려가다", clue: "싱크대에 고인 물이 빙글빙글 돌기만 해요.",
      example: "싱크대 물이 안 내려가서 배수구를 청소했어요.", repair: "배수구의 이물질을 꺼내요.",
      distractors: ["변기가 막히다", "수돗물이 안 나오다"], color: "#66798b"
    }
  ]);

  const ISSUE_BY_ID = new Map(ISSUES.map((issue) => [issue.id, issue]));
  const TOOLKIT = Object.freeze({ id: "toolkit", room: "living", label: "수리 가방", icon: "🧰", x: 350, y: 536, w: 66, h: 56 });

  const keys = Object.create(null);
  const controls = { joystickActive: false, joystickX: 0, joystickY: 0, joystickPointerId: null, actionPressed: false };
  const camera = { x: WORLD.width / 2, y: WORLD.height / 2, scale: 1 };
  let audioContext = null;
  let toastTimer = 0;
  let resetTimer = 0;
  let resetArmed = false;
  let lastFrame = performance.now();
  let accumulator = 0;
  let lastSaveAt = 0;
  let tutorialStep = 0;
  let activeDiagnosisId = null;
  let currentRoomId = "living";
  let playing = false;
  let isTouchDevice = false;
  let particles = [];

  function blankIssueState() {
    return Object.fromEntries(ISSUES.map((issue) => [issue.id, { discovered: false, repaired: false, repairStep: 0 }]));
  }

  function getStoredMode() {
    try { return localStorage.getItem(CONTROL_MODE_KEY) === "tap" ? "tap" : "joystick"; }
    catch { return "joystick"; }
  }

  function createState() {
    return {
      version: 1,
      started: false,
      completed: false,
      toolkit: false,
      soundOn: true,
      controlMode: getStoredMode(),
      player: { x: 250, y: 492, w: 28, h: 38, facing: "down", step: 0 },
      issues: blankIssueState(),
      discoveryOrder: [],
      repairedOrder: [],
      path: [],
      autoTargetId: null
    };
  }

  let state = createState();

  function setOpen(element, open) {
    if (!element) return;
    element.classList.toggle("hidden", !open);
    element.classList.toggle("is-open", open);
    element.setAttribute("aria-hidden", String(!open));
  }

  function isOpen(element) {
    return Boolean(element && !element.classList.contains("hidden"));
  }

  function detectDevice() {
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const touch = (navigator.maxTouchPoints || 0) > 0 || coarse;
    isTouchDevice = touch;
    const width = window.innerWidth;
    document.documentElement.dataset.device = touch ? "touch" : "pointer";
    document.documentElement.dataset.profile = width <= 520 ? "phone" : width <= 1100 ? "tablet" : "desktop";
    document.documentElement.dataset.orientation = window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    return touch;
  }

  function normalizeMode(mode) {
    return mode === "tap" ? "tap" : "joystick";
  }

  function setControlMode(mode, { save = true } = {}) {
    state.controlMode = normalizeMode(mode);
    document.documentElement.dataset.controlMode = state.controlMode;
    ui.controlModeSelector?.querySelectorAll('input[name="controlMode"]').forEach((input) => {
      input.checked = input.value === state.controlMode;
    });
    state.path = [];
    state.autoTargetId = null;
    releaseInputs();
    if (save) {
      try { localStorage.setItem(CONTROL_MODE_KEY, state.controlMode); } catch { /* storage can be unavailable */ }
      saveGame();
    }
    updateInteractionPrompt();
  }

  function roomForPoint(x, y) {
    return ROOMS.find((room) => x >= room.x && x <= room.x + room.w && y >= room.y && y <= room.y + room.h) || null;
  }

  function issueStatus(issueOrId) {
    const id = typeof issueOrId === "string" ? issueOrId : issueOrId.id;
    return state.issues[id] || { discovered: false, repaired: false, repairStep: 0 };
  }

  function discoveredIssues() {
    return state.discoveryOrder.map((id) => ISSUE_BY_ID.get(id)).filter(Boolean);
  }

  function repairedIssues() {
    return state.repairedOrder.map((id) => ISSUE_BY_ID.get(id)).filter(Boolean);
  }

  function serializeState() {
    return {
      version: 1,
      started: state.started,
      completed: state.completed,
      toolkit: state.toolkit,
      soundOn: state.soundOn,
      controlMode: state.controlMode,
      player: { x: state.player.x, y: state.player.y, facing: state.player.facing },
      issues: state.issues,
      discoveryOrder: state.discoveryOrder,
      repairedOrder: state.repairedOrder,
      savedAt: Date.now()
    };
  }

  function saveGame() {
    if (!state.started) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
      lastSaveAt = performance.now();
      if (ui.saveValue) ui.saveValue.textContent = "방금 저장";
    } catch {
      if (ui.saveValue) ui.saveValue.textContent = "저장 불가";
    }
  }

  function restoreGame() {
    let raw = null;
    try { raw = localStorage.getItem(SAVE_KEY); } catch { return false; }
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1) return false;
      const next = createState();
      next.started = Boolean(saved.started);
      next.completed = Boolean(saved.completed);
      next.toolkit = Boolean(saved.toolkit);
      next.soundOn = saved.soundOn !== false;
      next.controlMode = normalizeMode(saved.controlMode ?? getStoredMode());
      if (saved.player && Number.isFinite(saved.player.x) && Number.isFinite(saved.player.y)) {
        next.player.x = Math.max(30, Math.min(WORLD.width - 50, saved.player.x));
        next.player.y = Math.max(30, Math.min(WORLD.height - 60, saved.player.y));
        next.player.facing = ["up", "down", "left", "right"].includes(saved.player.facing) ? saved.player.facing : "down";
      }
      for (const issue of ISSUES) {
        const source = saved.issues?.[issue.id];
        next.issues[issue.id] = {
          discovered: Boolean(source?.discovered),
          repaired: Boolean(source?.repaired),
          repairStep: Math.max(0, Math.min(REPAIR_STEPS, Number(source?.repairStep) || 0))
        };
      }
      next.discoveryOrder = Array.isArray(saved.discoveryOrder)
        ? saved.discoveryOrder.filter((id, index, list) => ISSUE_BY_ID.has(id) && list.indexOf(id) === index && next.issues[id].discovered)
        : ISSUES.filter((issue) => next.issues[issue.id].discovered).map((issue) => issue.id);
      next.repairedOrder = Array.isArray(saved.repairedOrder)
        ? saved.repairedOrder.filter((id, index, list) => ISSUE_BY_ID.has(id) && list.indexOf(id) === index && next.issues[id].repaired)
        : ISSUES.filter((issue) => next.issues[issue.id].repaired).map((issue) => issue.id);
      state = next;
      return next.started;
    } catch {
      return false;
    }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  }

  function beep(frequency = 520, duration = 0.07, type = "sine") {
    if (!state.soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.07, audioContext.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + 0.02);
    } catch { /* audio is enhancement only */ }
  }

  function haptic(pattern = 16) {
    try { navigator.vibrate?.(pattern); } catch { /* enhancement only */ }
  }

  function showToast(title, body, tone = "good") {
    if (!ui.toast) return;
    clearTimeout(toastTimer);
    ui.toast.dataset.tone = tone;
    if (ui.toastTitle) ui.toastTitle.textContent = title;
    if (ui.toastBody) ui.toastBody.textContent = body;
    setOpen(ui.toast, true);
    toastTimer = window.setTimeout(() => setOpen(ui.toast, false), 3000);
  }

  function showDialogue(speaker, text, tone = "normal") {
    if (ui.dialogueSpeaker) ui.dialogueSpeaker.textContent = speaker;
    if (ui.dialogueText) ui.dialogueText.textContent = text;
    if (ui.dialogueBox) ui.dialogueBox.dataset.tone = tone;
    setOpen(ui.dialogueBox, true);
    ui.dialogueBox?.focus({ preventScroll: true });
  }

  function closeDialogue() {
    setOpen(ui.dialogueBox, false);
    ui.canvas?.focus({ preventScroll: true });
  }

  function spawnParticles(x, y, color, count = 12) {
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 90;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 30,
        life: 0.55 + Math.random() * 0.4,
        max: 0.95,
        size: 2 + Math.random() * 5,
        color
      });
    }
  }

  function isWalkable(x, y) {
    const margin = 10;
    for (const room of ROOMS) {
      if (x >= room.x + margin && x <= room.x + room.w - margin && y >= room.y + margin && y <= room.y + room.h - margin) return true;
    }
    for (const door of DOORS) {
      if (x >= door.x && x <= door.x + door.w && y >= door.y && y <= door.y + door.h) return true;
    }
    return false;
  }

  function objectAnchor(object) {
    return { x: object.x + object.w / 2, y: object.y + object.h / 2 };
  }

  function visibleObjects() {
    return state.toolkit ? ISSUES : [TOOLKIT, ...ISSUES];
  }

  function nearestObject(reach = isTouchDevice ? 92 : 76) {
    const px = state.player.x + state.player.w / 2;
    const py = state.player.y + state.player.h / 2;
    let found = null;
    let foundDistance = reach;
    for (const object of visibleObjects()) {
      if (object.id === TOOLKIT.id && state.toolkit) continue;
      const anchor = objectAnchor(object);
      const distance = Math.hypot(px - anchor.x, py - anchor.y);
      if (distance < foundDistance) {
        found = object;
        foundDistance = distance;
      }
    }
    return found;
  }

  function hasBlockingOverlay() {
    return isOpen(ui.diagnosisPanel) || isOpen(ui.endingPanel) || isOpen(ui.controlTutorial) || isOpen(ui.journalDrawer);
  }

  function openDiagnosis(issue) {
    activeDiagnosisId = issue.id;
    if (ui.diagnosisScene) ui.diagnosisScene.textContent = `${ROOMS.find((room) => room.id === issue.room)?.name || "집 안"} · ${issue.label}`;
    if (ui.diagnosisQuestion) ui.diagnosisQuestion.textContent = issue.clue;
    if (ui.diagnosisFeedback) {
      ui.diagnosisFeedback.textContent = "장면에 맞는 표현을 골라 보세요.";
      ui.diagnosisFeedback.dataset.tone = "normal";
    }
    if (ui.diagnosisOptions) {
      ui.diagnosisOptions.innerHTML = "";
      const options = [issue.expression, ...issue.distractors];
      const shift = ISSUES.findIndex((entry) => entry.id === issue.id) % options.length;
      const ordered = options.slice(shift).concat(options.slice(0, shift));
      ordered.forEach((text) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.dataset.answer = text;
        button.addEventListener("click", () => answerDiagnosis(text));
        ui.diagnosisOptions.appendChild(button);
      });
    }
    closeDialogue();
    setOpen(ui.diagnosisPanel, true);
    ui.diagnosisPanel?.focus({ preventScroll: true });
  }

  function answerDiagnosis(answer) {
    const issue = ISSUE_BY_ID.get(activeDiagnosisId);
    if (!issue) return false;
    if (answer !== issue.expression) {
      if (ui.diagnosisFeedback) {
        ui.diagnosisFeedback.textContent = "장면의 핵심 단서를 다시 살펴보세요.";
        ui.diagnosisFeedback.dataset.tone = "bad";
      }
      beep(180, 0.12, "square");
      haptic([20, 30, 20]);
      return false;
    }
    const status = issueStatus(issue);
    if (!status.discovered) {
      status.discovered = true;
      state.discoveryOrder.push(issue.id);
    }
    activeDiagnosisId = null;
    setOpen(ui.diagnosisPanel, false);
    spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, issue.color, 16);
    showToast("표현을 찾았어요", `${issue.expression} · 이제 다시 조사해 수리하세요.`);
    beep(720, 0.11, "sine");
    haptic(24);
    updateAllUi();
    saveGame();
    return true;
  }

  function repairIssue(issue) {
    const status = issueStatus(issue);
    status.repairStep = Math.min(REPAIR_STEPS, status.repairStep + 1);
    spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, issue.color, 9);
    if (status.repairStep < REPAIR_STEPS) {
      showDialogue("수리 메모", `${issue.repair} (${status.repairStep}/${REPAIR_STEPS}) 한 번 더 행동해 보세요.`);
      beep(460, 0.06, "triangle");
    } else {
      status.repaired = true;
      if (!state.repairedOrder.includes(issue.id)) state.repairedOrder.push(issue.id);
      showDialogue("수리 완료", `${issue.expression} → 문제가 해결됐어요! ${issue.example}`);
      showToast("안전도 상승", `${issue.label} 점검을 마쳤어요.`);
      spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, "#f3c763", 24);
      beep(860, 0.15, "sine");
      haptic([18, 28, 28]);
      if (state.repairedOrder.length === ISSUES.length) completeGame();
    }
    updateAllUi();
    saveGame();
  }

  function tryInteract() {
    if (!playing || hasBlockingOverlay()) return false;
    const object = nearestObject();
    if (!object) {
      showToast("조사할 곳이 없어요", "반짝이는 물건에 조금 더 가까이 가 보세요.", "hint");
      return false;
    }
    state.path = [];
    state.autoTargetId = null;
    if (object.id === TOOLKIT.id) {
      if (!state.toolkit) {
        state.toolkit = true;
        spawnParticles(object.x + object.w / 2, object.y + object.h / 2, "#f2bc5b", 22);
        showDialogue("집주인", "수리 가방을 챙겼어요. 이제 반짝이는 물건을 조사하고 문제를 정확히 말해 보세요.");
        showToast("도구 준비 완료", "밸브·뚫어뻥·렌치·점검기가 들어 있어요.");
        beep(650, 0.12, "triangle");
        haptic(24);
        updateAllUi();
        saveGame();
      }
      return true;
    }
    if (!state.toolkit) {
      showDialogue("집주인", "거실에 있는 수리 가방을 먼저 챙겨 주세요.", "warning");
      return false;
    }
    const status = issueStatus(object);
    if (!status.discovered) {
      openDiagnosis(object);
      return true;
    }
    if (!status.repaired) {
      repairIssue(object);
      return true;
    }
    showDialogue(object.label, `${object.expression}. ${object.example}`);
    beep(560, 0.05, "sine");
    return true;
  }

  function completeGame() {
    state.completed = true;
    state.path = [];
    if (ui.endingSummary) ui.endingSummary.textContent = "네 방의 문제를 모두 해결했어요!";
    if (ui.endingWords) ui.endingWords.textContent = `${state.discoveryOrder.length}개`;
    if (ui.endingJournal) ui.endingJournal.textContent = `${state.repairedOrder.length}문장`;
    setOpen(ui.endingPanel, true);
    ui.endingPanel?.focus({ preventScroll: true });
    beep(920, 0.23, "triangle");
    window.setTimeout(() => beep(1120, 0.3, "sine"), 160);
    saveGame();
  }

  function releaseInputs() {
    Object.keys(keys).forEach((key) => { keys[key] = false; });
    controls.joystickActive = false;
    controls.joystickX = 0;
    controls.joystickY = 0;
    controls.joystickPointerId = null;
    controls.actionPressed = false;
    ui.touchJoystick?.classList.remove("is-active");
    ui.touchAction?.classList.remove("is-active");
    if (ui.touchJoystickKnob) ui.touchJoystickKnob.style.transform = "translate(0px, 0px)";
  }

  function updateJoystick(event) {
    if (!ui.touchJoystick) return;
    const rect = ui.touchJoystick.getBoundingClientRect();
    const radius = Math.max(28, Math.min(rect.width, rect.height) * 0.38);
    let x = (event.clientX - (rect.left + rect.width / 2)) / radius;
    let y = (event.clientY - (rect.top + rect.height / 2)) / radius;
    const length = Math.hypot(x, y);
    if (length > 1) { x /= length; y /= length; }
    if (length < 0.14) { x = 0; y = 0; }
    controls.joystickX = x;
    controls.joystickY = y;
    if (ui.touchJoystickKnob) {
      ui.touchJoystickKnob.style.transform = `translate(${x * radius * 0.58}px, ${y * radius * 0.58}px)`;
    }
  }

  function findNearestGridPoint(x, y, cell = 24) {
    const columns = Math.ceil(WORLD.width / cell);
    const rows = Math.ceil(WORLD.height / cell);
    const baseColumn = Math.max(0, Math.min(columns - 1, Math.floor(x / cell)));
    const baseRow = Math.max(0, Math.min(rows - 1, Math.floor(y / cell)));
    for (let radius = 0; radius < Math.max(columns, rows); radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const column = baseColumn + dx;
          const row = baseRow + dy;
          if (column < 0 || row < 0 || column >= columns || row >= rows) continue;
          const point = { column, row, x: column * cell + cell / 2, y: row * cell + cell / 2 };
          if (isWalkable(point.x, point.y)) return point;
        }
      }
    }
    return null;
  }

  function buildPath(startX, startY, goalX, goalY) {
    const cell = 24;
    const start = findNearestGridPoint(startX, startY, cell);
    const goal = findNearestGridPoint(goalX, goalY, cell);
    if (!start || !goal) return [];
    const key = (column, row) => `${column},${row}`;
    const queue = [start];
    const cameFrom = new Map([[key(start.column, start.row), null]]);
    let cursor = 0;
    let reached = null;
    while (cursor < queue.length && cursor < 2200) {
      const current = queue[cursor++];
      if (current.column === goal.column && current.row === goal.row) { reached = current; break; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const column = current.column + dx;
        const row = current.row + dy;
        const nextKey = key(column, row);
        if (cameFrom.has(nextKey)) continue;
        const x = column * cell + cell / 2;
        const y = row * cell + cell / 2;
        if (!isWalkable(x, y)) continue;
        cameFrom.set(nextKey, current);
        queue.push({ column, row, x, y });
      }
    }
    if (!reached) return [];
    const path = [];
    let point = reached;
    while (point) {
      path.push({ x: point.x, y: point.y });
      point = cameFrom.get(key(point.column, point.row));
    }
    path.reverse();
    path.shift();
    path.push({ x: goalX, y: goalY });
    return path.filter((pointItem) => isWalkable(pointItem.x, pointItem.y));
  }

  function beginTapNavigation(worldX, worldY, targetId = null) {
    const px = state.player.x + state.player.w / 2;
    const py = state.player.y + state.player.h / 2;
    state.path = buildPath(px, py, worldX, worldY);
    state.autoTargetId = targetId;
    if (!state.path.length) showToast("길을 찾지 못했어요", "방 안쪽이나 문 근처를 다시 눌러 보세요.", "hint");
  }

  function findTapObject(x, y) {
    let result = null;
    let distance = 86;
    for (const object of visibleObjects()) {
      if (object.id === TOOLKIT.id && state.toolkit) continue;
      const anchor = objectAnchor(object);
      const nextDistance = Math.hypot(x - anchor.x, y - anchor.y);
      if (nextDistance < distance) { result = object; distance = nextDistance; }
    }
    return result;
  }

  function approachPoint(object) {
    const room = ROOMS.find((entry) => entry.id === object.room);
    const anchor = objectAnchor(object);
    const candidates = [
      { x: anchor.x - 66, y: anchor.y }, { x: anchor.x + 66, y: anchor.y },
      { x: anchor.x, y: anchor.y - 66 }, { x: anchor.x, y: anchor.y + 66 }
    ].filter((point) => isWalkable(point.x, point.y) && (!room || roomForPoint(point.x, point.y)?.id === room.id));
    if (!candidates.length) return anchor;
    const px = state.player.x + state.player.w / 2;
    const py = state.player.y + state.player.h / 2;
    return candidates.sort((a, b) => Math.hypot(px - a.x, py - a.y) - Math.hypot(px - b.x, py - b.y))[0];
  }

  function screenToWorld(clientX, clientY) {
    const rect = ui.canvas.getBoundingClientRect();
    const canvasX = (clientX - rect.left) * ui.canvas.width / rect.width;
    const canvasY = (clientY - rect.top) * ui.canvas.height / rect.height;
    return {
      x: (canvasX - ui.canvas.width / 2) / camera.scale + camera.x,
      y: (canvasY - ui.canvas.height / 2) / camera.scale + camera.y
    };
  }

  function handleCanvasTap(event) {
    if (!playing || state.controlMode !== "tap" || hasBlockingOverlay()) return;
    event.preventDefault();
    const point = screenToWorld(event.clientX, event.clientY);
    const object = findTapObject(point.x, point.y);
    if (object) {
      const approach = approachPoint(object);
      beginTapNavigation(approach.x, approach.y, object.id);
      showToast("이동 중", `${object.label} 가까이로 갈게요.`, "hint");
    } else {
      beginTapNavigation(point.x, point.y, null);
    }
    haptic(10);
  }

  function movementInput() {
    let x = ((keys.ArrowRight || keys.KeyD) ? 1 : 0) - ((keys.ArrowLeft || keys.KeyA) ? 1 : 0);
    let y = ((keys.ArrowDown || keys.KeyS) ? 1 : 0) - ((keys.ArrowUp || keys.KeyW) ? 1 : 0);
    if (controls.joystickActive) {
      x += controls.joystickX;
      y += controls.joystickY;
    }
    const length = Math.hypot(x, y);
    return length > 1 ? { x: x / length, y: y / length } : { x, y };
  }

  function movePlayer(dx, dy, distance) {
    if (!dx && !dy) return;
    const centerX = state.player.x + state.player.w / 2;
    const centerY = state.player.y + state.player.h / 2;
    const nextX = centerX + dx * distance;
    const nextY = centerY + dy * distance;
    if (isWalkable(nextX, nextY)) {
      state.player.x += dx * distance;
      state.player.y += dy * distance;
    } else if (isWalkable(nextX, centerY)) {
      state.player.x += dx * distance;
    } else if (isWalkable(centerX, nextY)) {
      state.player.y += dy * distance;
    }
    if (Math.abs(dx) > Math.abs(dy)) state.player.facing = dx > 0 ? "right" : "left";
    else state.player.facing = dy > 0 ? "down" : "up";
    state.player.step += distance * 0.08;
  }

  function updateAutoNavigation(dt) {
    if (!state.path.length) return false;
    const target = state.path[0];
    const centerX = state.player.x + state.player.w / 2;
    const centerY = state.player.y + state.player.h / 2;
    const dx = target.x - centerX;
    const dy = target.y - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance < 7) {
      state.path.shift();
      if (!state.path.length && state.autoTargetId) {
        const targetId = state.autoTargetId;
        state.autoTargetId = null;
        const object = targetId === TOOLKIT.id ? TOOLKIT : ISSUE_BY_ID.get(targetId);
        if (object && nearestObject(112)?.id === object.id) tryInteract();
      }
      return true;
    }
    movePlayer(dx / distance, dy / distance, Math.min(distance, 210 * dt));
    return true;
  }

  function updateParticles(dt) {
    particles.forEach((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 120 * dt;
    });
    particles = particles.filter((particle) => particle.life > 0);
  }

  function update(dt) {
    updateParticles(dt);
    if (!playing || hasBlockingOverlay() || isOpen(ui.dialogueBox)) return;
    if (!updateAutoNavigation(dt)) {
      const input = movementInput();
      if (Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01) {
        state.path = [];
        state.autoTargetId = null;
        movePlayer(input.x, input.y, 190 * dt);
      }
    }
    const centerX = state.player.x + state.player.w / 2;
    const centerY = state.player.y + state.player.h / 2;
    const room = roomForPoint(centerX, centerY);
    if (room && room.id !== currentRoomId) {
      currentRoomId = room.id;
      showToast(`${room.icon} ${room.name}`, roomMissionHint(room.id), "hint");
    }
    updateInteractionPrompt();
    updateRoomMap();
    if (performance.now() - lastSaveAt > 10000) saveGame();
  }

  function roomMissionHint(roomId) {
    const unresolved = ISSUES.filter((issue) => issue.room === roomId && !issueStatus(issue).repaired).length;
    if (!state.toolkit) return roomId === "living" ? "수리 가방을 찾아보세요." : "거실에서 수리 가방을 먼저 챙기세요.";
    return unresolved ? `이 방에 해결할 문제가 ${unresolved}개 있어요.` : "이 방의 점검을 마쳤어요.";
  }

  function updateInteractionPrompt() {
    const object = playing && !hasBlockingOverlay() && !isOpen(ui.dialogueBox) ? nearestObject() : null;
    if (!object) {
      setOpen(ui.interactionPrompt, false);
      if (ui.touchActionLabel) ui.touchActionLabel.textContent = "조사";
      return;
    }
    let label = `${object.label} 조사`;
    if (object.id === TOOLKIT.id) label = "수리 가방 챙기기";
    else {
      const status = issueStatus(object);
      if (status.discovered && !status.repaired) label = `${object.label} 수리 ${status.repairStep}/${REPAIR_STEPS}`;
      if (status.repaired) label = `${object.label} 복습`;
    }
    if (ui.interactionPromptText) ui.interactionPromptText.textContent = label;
    if (ui.interactionPromptKey) ui.interactionPromptKey.textContent = isTouchDevice ? "행동" : "E";
    if (ui.touchActionLabel) ui.touchActionLabel.textContent = label.includes("수리") ? "수리" : label.includes("챙기기") ? "줍기" : "조사";
    setOpen(ui.interactionPrompt, true);
  }

  function updateRoomMap() {
    ui.roomMap?.querySelectorAll("[data-room]").forEach((button) => {
      const active = button.dataset.room === currentRoomId;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      const roomIssues = ISSUES.filter((issue) => issue.room === button.dataset.room);
      const repaired = roomIssues.filter((issue) => issueStatus(issue).repaired).length;
      button.dataset.progress = `${repaired}/${roomIssues.length}`;
    });
  }

  function updateStory() {
    const discovered = discoveredIssues().length;
    const repaired = repairedIssues().length;
    let title = "거실의 수리 가방 챙기기";
    let body = "수리 가방 가까이에서 조사 버튼을 눌러 도구를 준비하세요.";
    if (state.toolkit && repaired < ISSUES.length) {
      const inProgress = ISSUES.find((issue) => issueStatus(issue).discovered && !issueStatus(issue).repaired);
      const next = inProgress || ISSUES.find((issue) => !issueStatus(issue).discovered);
      if (next) {
        const room = ROOMS.find((entry) => entry.id === next.room);
        title = inProgress ? `${next.label} 수리 마무리` : `${room?.name || "집 안"}의 이상 징후 찾기`;
        body = inProgress ? `${next.expression} 장면으로 돌아가 두 번 행동해 문제를 해결하세요.` : `${room?.icon || "🏠"} ${room?.name || "집 안"}에서 반짝이는 ${next.label}을 조사하세요.`;
      }
    } else if (repaired === ISSUES.length) {
      title = "우리 집 점검 완료";
      body = "기록장을 열어 여덟 표현과 해결 문장을 다시 말해 보세요.";
    }
    if (ui.storyTitle) ui.storyTitle.textContent = title;
    if (ui.storyBody) ui.storyBody.textContent = body;
    if (ui.storyToggleLabel) ui.storyToggleLabel.textContent = title;
    if (ui.storyProgressFill) ui.storyProgressFill.style.width = `${repaired / ISSUES.length * 100}%`;
    if (ui.storyProgressLabel) ui.storyProgressLabel.textContent = `${repaired} / ${ISSUES.length} 해결 · 표현 ${discovered}`;
  }

  function updateJournal() {
    const discovered = discoveredIssues();
    if (ui.journalToggleLabel) ui.journalToggleLabel.textContent = `표현 ${discovered.length} / ${ISSUES.length}`;
    if (ui.journalSummary) {
      ui.journalSummary.textContent = discovered.length
        ? `${discovered.length}개 표현을 찾고 ${repairedIssues().length}곳을 수리했어요.`
        : "아직 기록한 표현이 없어요. 집 안의 이상 징후를 찾아보세요.";
    }
    if (!ui.journalList) return;
    ui.journalList.innerHTML = "";
    ISSUES.forEach((issue, index) => {
      const status = issueStatus(issue);
      const item = document.createElement("li");
      item.className = `journal-item ${status.discovered ? "is-discovered" : "is-locked"} ${status.repaired ? "is-repaired" : ""}`;
      if (status.discovered) {
        item.innerHTML = `<span class="journal-number">${index + 1}</span><div><strong>${issue.expression}</strong><p>${issue.example}</p><small>${status.repaired ? "✓ 해결 완료" : `수리 ${status.repairStep}/${REPAIR_STEPS}`}</small></div>`;
      } else {
        item.innerHTML = `<span class="journal-number">${index + 1}</span><div><strong>아직 찾지 못한 표현</strong><p>${ROOMS.find((room) => room.id === issue.room)?.name || "집 안"}에서 단서를 찾아보세요.</p></div>`;
      }
      ui.journalList.appendChild(item);
    });
  }

  function updateAllUi() {
    const discovered = discoveredIssues().length;
    const repaired = repairedIssues().length;
    const safety = Math.round(repaired / ISSUES.length * 100);
    if (ui.statsToggleLabel) ui.statsToggleLabel.textContent = `안전 ${safety} · 표현 ${discovered}`;
    if (ui.safetyValue) ui.safetyValue.textContent = `${safety}%`;
    if (ui.toolValue) ui.toolValue.textContent = state.toolkit ? "4종 세트" : "준비 전";
    if (ui.soundToggle) {
      ui.soundToggle.textContent = state.soundOn ? "소리 켜짐" : "소리 꺼짐";
      ui.soundToggle.setAttribute("aria-pressed", String(state.soundOn));
    }
    updateStory();
    updateJournal();
    updateRoomMap();
    updateInteractionPrompt();
  }

  function showTutorial() {
    tutorialStep = 0;
    renderTutorial();
    setOpen(ui.controlTutorial, true);
    ui.controlTutorial?.focus({ preventScroll: true });
  }

  function renderTutorial() {
    const tap = state.controlMode === "tap";
    const touchDevice = document.documentElement.dataset.device === "touch";
    if (ui.tutorialStepLabel) ui.tutorialStepLabel.textContent = `조작 연습 ${tutorialStep + 1} / 2`;
    if (ui.tutorialTitle) ui.tutorialTitle.textContent = tutorialStep === 0
      ? (!touchDevice ? "WASD 또는 방향키로 걸어 보세요" : tap ? "가고 싶은 곳을 터치하세요" : "이동 패드를 살짝 밀어 보세요")
      : (!touchDevice ? "E 또는 Space로 조사하세요" : tap ? "반짝이는 물건을 터치하세요" : "오른쪽 행동 버튼을 눌러 보세요");
    if (ui.tutorialBody) ui.tutorialBody.textContent = tutorialStep === 0
      ? (!touchDevice ? "네 방향 키로 집 안을 움직이고 문을 지나 다른 방으로 갈 수 있어요." : tap ? "빈 바닥을 누르면 안전한 길을 찾아 자동으로 걸어갑니다." : "조이스틱을 원하는 방향으로 기울이면 집 안을 걸을 수 있어요.")
      : (!touchDevice ? "물건 가까이에서 행동 키를 누르면 조사·수리·줍기가 상황에 맞게 실행됩니다." : tap ? "물건을 누르면 가까이 이동한 뒤 자동으로 조사합니다." : "물건 가까이에서 조사·수리·줍기 버튼이 상황에 맞게 바뀝니다.");
    if (ui.tutorialStatus) ui.tutorialStatus.textContent = "직접 해 보거나 다음을 눌러도 좋아요.";
    if (ui.tutorialNext) ui.tutorialNext.textContent = tutorialStep === 0 ? "다음" : "탐험 시작";
  }

  function completeTutorial() {
    setOpen(ui.controlTutorial, false);
    try { localStorage.setItem(TUTORIAL_KEY, "done"); } catch { /* ignore */ }
    ui.canvas?.focus({ preventScroll: true });
    showToast("첫 임무", state.toolkit ? "다음 문제를 찾아보세요." : "거실의 수리 가방을 먼저 챙기세요.", "hint");
  }

  function enterGame({ forceTutorial = false } = {}) {
    state.started = true;
    playing = true;
    ui.game.classList.add("is-game-started");
    document.body.classList.add("is-game-started");
    ui.startCard?.classList.add("hidden");
    setOpen(ui.endingPanel, false);
    setControlMode(state.controlMode, { save: false });
    updateAllUi();
    saveGame();
    let seenTutorial = false;
    try { seenTutorial = localStorage.getItem(TUTORIAL_KEY) === "done"; } catch { /* ignore */ }
    if (forceTutorial || !seenTutorial) showTutorial();
    else {
      ui.canvas?.focus({ preventScroll: true });
      showToast("점검 시작", state.toolkit ? "저장된 방에서 이어갑니다." : "거실의 수리 가방을 찾아보세요.", "hint");
    }
  }

  function startNewGame({ forceTutorial = true } = {}) {
    const mode = state.controlMode;
    const soundOn = state.soundOn;
    clearSave();
    state = createState();
    state.controlMode = mode;
    state.soundOn = soundOn;
    currentRoomId = "living";
    activeDiagnosisId = null;
    particles = [];
    closeAllPanels();
    enterGame({ forceTutorial });
  }

  function resumeGame() {
    enterGame({ forceTutorial: false });
  }

  function closeAllPanels() {
    [ui.storyPanel, ui.statsPanel, ui.dialogueBox, ui.diagnosisPanel, ui.endingPanel, ui.toast, ui.controlTutorial, ui.journalDrawer, ui.journalBackdrop]
      .forEach((element) => setOpen(element, false));
  }

  function prepareStartCard(hasSave) {
    ui.game.classList.remove("is-game-started");
    document.body.classList.remove("is-game-started");
    ui.startCard?.classList.remove("hidden");
    if (ui.resumeHint) setOpen(ui.resumeHint, hasSave);
    if (hasSave) {
      if (ui.startEyebrow) ui.startEyebrow.textContent = "저장된 집 점검 기록";
      if (ui.startTitle) ui.startTitle.textContent = "마지막 방에서 이어서 점검할까요?";
      if (ui.startDescription) ui.startDescription.textContent = `${discoveredIssues().length}개 표현을 찾고 ${repairedIssues().length}곳을 해결했어요.`;
      if (ui.startButton) ui.startButton.textContent = "현재 화면으로 이어하기";
      if (ui.fullscreenButton) ui.fullscreenButton.textContent = "전체화면으로 이어하기";
    }
  }

  function togglePanel(panel, button) {
    const open = !isOpen(panel);
    [ui.storyPanel, ui.statsPanel].forEach((entry) => { if (entry !== panel) setOpen(entry, false); });
    setOpen(panel, open);
    button?.setAttribute("aria-expanded", String(open));
  }

  function openJournal(open = true) {
    setOpen(ui.journalDrawer, open);
    setOpen(ui.journalBackdrop, open);
    ui.journalToggle?.setAttribute("aria-expanded", String(open));
    if (open) {
      updateJournal();
      ui.journalDrawer?.focus({ preventScroll: true });
    } else ui.canvas?.focus({ preventScroll: true });
  }

  function getFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  async function toggleFullscreen() {
    try {
      if (getFullscreenElement()) await (document.exitFullscreen?.() || document.webkitExitFullscreen?.());
      else await (ui.game.requestFullscreen?.() || ui.game.webkitRequestFullscreen?.());
    } catch {
      showToast("전체화면을 열 수 없어요", "현재 화면에서도 그대로 게임을 시작할 수 있어요.", "hint");
    }
  }

  function syncFullscreenUi() {
    const active = Boolean(getFullscreenElement());
    document.documentElement.dataset.fullscreen = active ? "on" : "off";
    if (ui.fullscreenToggle) ui.fullscreenToggle.textContent = active ? "전체화면 나가기" : "전체화면";
  }

  function handleReset() {
    if (!resetArmed) {
      resetArmed = true;
      if (ui.resetButton) ui.resetButton.textContent = "한 번 더 누르기";
      showToast("처음부터 시작할까요?", "진행 기록을 지우려면 버튼을 한 번 더 누르세요.", "warning");
      clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        resetArmed = false;
        if (ui.resetButton) ui.resetButton.textContent = "처음부터";
      }, 2800);
      return;
    }
    resetArmed = false;
    clearTimeout(resetTimer);
    if (ui.resetButton) ui.resetButton.textContent = "처음부터";
    startNewGame({ forceTutorial: false });
  }

  function teleportTo(id) {
    const object = id === TOOLKIT.id ? TOOLKIT : ISSUE_BY_ID.get(id);
    if (!object) throw new Error(`Unknown house object: ${id}`);
    closeDialogue();
    setOpen(ui.diagnosisPanel, false);
    activeDiagnosisId = null;
    const point = approachPoint(object);
    state.player.x = point.x - state.player.w / 2;
    state.player.y = point.y - state.player.h / 2;
    currentRoomId = object.room;
    state.path = [];
    state.autoTargetId = null;
    updateAllUi();
    return snapshotForTests();
  }

  function snapshotForTests() {
    return {
      started: state.started,
      completed: state.completed,
      toolkit: state.toolkit,
      discovered: discoveredIssues().map((issue) => issue.expression),
      repaired: repairedIssues().map((issue) => issue.expression),
      player: { x: Math.round(state.player.x * 100) / 100, y: Math.round(state.player.y * 100) / 100 },
      controlMode: state.controlMode,
      controls: {
        joystickActive: controls.joystickActive,
        joystickX: Math.round(controls.joystickX * 1000) / 1000,
        joystickY: Math.round(controls.joystickY * 1000) / 1000,
        actionPressed: controls.actionPressed
      },
      activeDiagnosisId,
      room: currentRoomId
    };
  }

  function bindEvents() {
    document.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      keys[event.code] = true;
      if (!event.repeat && ["KeyE", "Space"].includes(event.code)) tryInteract();
      if (event.code === "Escape") {
        if (isOpen(ui.diagnosisPanel)) { activeDiagnosisId = null; setOpen(ui.diagnosisPanel, false); }
        else if (isOpen(ui.journalDrawer)) openJournal(false);
        else if (isOpen(ui.dialogueBox)) closeDialogue();
        else if (isOpen(ui.storyPanel)) setOpen(ui.storyPanel, false);
        else if (isOpen(ui.statsPanel)) setOpen(ui.statsPanel, false);
      }
    }, { passive: false });
    document.addEventListener("keyup", (event) => { keys[event.code] = false; });
    window.addEventListener("blur", releaseInputs);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { releaseInputs(); saveGame(); }
    });
    window.addEventListener("beforeunload", saveGame);
    window.addEventListener("resize", () => { detectDevice(); updateAllUi(); });
    window.addEventListener("orientationchange", () => window.setTimeout(() => { detectDevice(); updateAllUi(); }, 80));

    ui.heroToggle?.addEventListener("click", () => {
      const open = ui.heroDetails?.classList.contains("hidden") ?? true;
      setOpen(ui.heroDetails, open);
      ui.heroToggle.setAttribute("aria-expanded", String(open));
      ui.heroToggle.textContent = open ? "안내 닫기" : "안내 보기";
    });
    ui.storyToggle?.addEventListener("click", () => togglePanel(ui.storyPanel, ui.storyToggle));
    ui.statsToggle?.addEventListener("click", () => togglePanel(ui.statsPanel, ui.statsToggle));
    ui.journalToggle?.addEventListener("click", () => openJournal(!isOpen(ui.journalDrawer)));
    ui.journalClose?.addEventListener("click", () => openJournal(false));
    ui.journalBackdrop?.addEventListener("click", () => openJournal(false));
    ui.dialogueClose?.addEventListener("click", closeDialogue);
    ui.resetButton?.addEventListener("click", handleReset);
    ui.soundToggle?.addEventListener("click", () => {
      state.soundOn = !state.soundOn;
      updateAllUi();
      if (state.soundOn) beep(620, 0.08, "sine");
      saveGame();
    });
    ui.controlModeSelector?.addEventListener("change", (event) => {
      if (event.target?.matches('input[name="controlMode"]')) setControlMode(event.target.value);
    });
    ui.startButton?.addEventListener("click", () => state.started ? resumeGame() : startNewGame({ forceTutorial: true }));
    ui.fullscreenButton?.addEventListener("click", async () => {
      await toggleFullscreen();
      state.started ? resumeGame() : startNewGame({ forceTutorial: true });
    });
    ui.fullscreenToggle?.addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", syncFullscreenUi);
    document.addEventListener("webkitfullscreenchange", syncFullscreenUi);
    ui.endingRestart?.addEventListener("click", () => startNewGame({ forceTutorial: false }));
    ui.tutorialSkip?.addEventListener("click", completeTutorial);
    ui.tutorialNext?.addEventListener("click", () => {
      if (tutorialStep === 0) { tutorialStep = 1; renderTutorial(); }
      else completeTutorial();
    });
    ui.roomMap?.querySelectorAll("[data-room]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!playing || hasBlockingOverlay()) return;
        const room = ROOMS.find((entry) => entry.id === button.dataset.room);
        if (!room) return;
        state.player.x = room.x + room.w / 2 - state.player.w / 2;
        state.player.y = room.y + room.h / 2 - state.player.h / 2;
        currentRoomId = room.id;
        state.path = [];
        updateAllUi();
        showToast(`${room.icon} ${room.name}`, roomMissionHint(room.id), "hint");
      });
    });

    if (ui.touchJoystick) {
      const finishJoystick = (event) => {
        if (event?.pointerId != null && controls.joystickPointerId != null && event.pointerId !== controls.joystickPointerId) return;
        controls.joystickActive = false;
        controls.joystickX = 0;
        controls.joystickY = 0;
        controls.joystickPointerId = null;
        ui.touchJoystick.classList.remove("is-active");
        if (ui.touchJoystickKnob) ui.touchJoystickKnob.style.transform = "translate(0px, 0px)";
      };
      ui.touchJoystick.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        state.path = [];
        controls.joystickActive = true;
        controls.joystickPointerId = event.pointerId;
        ui.touchJoystick.classList.add("is-active");
        ui.touchJoystick.setPointerCapture?.(event.pointerId);
        updateJoystick(event);
        haptic(8);
      });
      ui.touchJoystick.addEventListener("pointermove", (event) => {
        if (!controls.joystickActive || event.pointerId !== controls.joystickPointerId) return;
        event.preventDefault();
        updateJoystick(event);
      });
      ui.touchJoystick.addEventListener("pointerup", finishJoystick);
      ui.touchJoystick.addEventListener("pointercancel", finishJoystick);
      ui.touchJoystick.addEventListener("lostpointercapture", finishJoystick);
    }

    if (ui.touchAction) {
      const releaseAction = () => {
        controls.actionPressed = false;
        ui.touchAction.classList.remove("is-active");
      };
      ui.touchAction.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        controls.actionPressed = true;
        ui.touchAction.classList.add("is-active");
        tryInteract();
        haptic(12);
      });
      ui.touchAction.addEventListener("pointerup", releaseAction);
      ui.touchAction.addEventListener("pointercancel", releaseAction);
      ui.touchAction.addEventListener("pointerleave", releaseAction);
    }
    ui.canvas.addEventListener("pointerup", handleCanvasTap);
  }

  function roundRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawWorld(time) {
    ctx.save();
    ctx.translate(ui.canvas.width / 2, ui.canvas.height / 2);
    ctx.scale(camera.scale, camera.scale);
    ctx.translate(-camera.x, -camera.y);
    ctx.fillStyle = "#7d554b";
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    for (const room of ROOMS) drawRoom(room);
    drawDoors();
    drawFurniture();
    ISSUES.forEach((issue) => drawIssue(issue, time));
    if (!state.toolkit) drawToolkit(time);
    drawPath();
    drawParticles();
    drawPlayer(time);
    ctx.restore();
    drawCanvasShade();
  }

  function drawRoom(room) {
    ctx.save();
    ctx.shadowColor = "rgba(51, 28, 24, 0.2)";
    ctx.shadowBlur = 12;
    roundRect(room.x, room.y, room.w, room.h, 18);
    ctx.fillStyle = room.floor;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = room.line;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = room.line;
    ctx.lineWidth = 1;
    const step = room.id === "bathroom" ? 32 : 40;
    for (let x = room.x + step; x < room.x + room.w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, room.y + 8); ctx.lineTo(x, room.y + room.h - 8); ctx.stroke();
    }
    for (let y = room.y + step; y < room.y + room.h; y += step) {
      ctx.beginPath(); ctx.moveTo(room.x + 8, y); ctx.lineTo(room.x + room.w - 8, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(65, 42, 37, 0.78)";
    ctx.font = "800 18px system-ui, sans-serif";
    ctx.fillText(`${room.icon} ${room.name}`, room.x + 20, room.y + room.h - 18);
    ctx.restore();
  }

  function drawDoors() {
    ctx.fillStyle = "#ead6bb";
    ctx.strokeStyle = "#9f765c";
    ctx.lineWidth = 3;
    DOORS.forEach((door) => {
      roundRect(door.x, door.y, door.w, door.h, 8);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.globalAlpha = 0.28;
      ctx.strokeStyle = "#8b624e";
      ctx.lineWidth = 2;
      if (door.w > door.h) {
        for (let x = door.x + 12; x < door.x + door.w; x += 20) { ctx.beginPath(); ctx.moveTo(x, door.y + 4); ctx.lineTo(x, door.y + door.h - 4); ctx.stroke(); }
      } else {
        for (let y = door.y + 12; y < door.y + door.h; y += 20) { ctx.beginPath(); ctx.moveTo(door.x + 4, y); ctx.lineTo(door.x + door.w - 4, y); ctx.stroke(); }
      }
      ctx.restore();
    });
  }

  function drawFurniture() {
    // Kitchen counter and table
    drawFurnitureBox(54, 184, 270, 56, "#d6a06e", "#9a6747", "조리대");
    drawFurnitureBox(350, 238, 78, 42, "#f0cf95", "#a77c4e", "식탁");
    // Bathroom tub and cabinet
    drawFurnitureBox(666, 58, 224, 70, "#f9ffff", "#83b8c1", "욕조");
    drawFurnitureBox(706, 218, 94, 48, "#c9e6e9", "#609ca7", "세면대");
    // Living room sofa, rug and plants
    drawFurnitureBox(154, 382, 190, 60, "#87a976", "#5f7e50", "소파");
    ctx.fillStyle = "rgba(241, 203, 136, 0.6)";
    roundRect(142, 472, 174, 86, 26); ctx.fill();
    drawPlant(412, 372);
    // Bedroom bed, desk and wardrobe
    drawFurnitureBox(680, 390, 174, 96, "#f3c8bd", "#b97b70", "침대");
    drawFurnitureBox(650, 532, 142, 48, "#cf9c79", "#90634c", "책상");
    drawFurnitureBox(816, 530, 62, 66, "#b98d78", "#7d5d50", "옷장");
  }

  function drawFurnitureBox(x, y, width, height, fill, stroke, label) {
    ctx.save();
    ctx.shadowColor = "rgba(66, 42, 36, 0.18)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 4;
    roundRect(x, y, width, height, 10);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "rgba(47, 34, 31, 0.65)";
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, x + width / 2, y + height / 2 + 4);
    ctx.textAlign = "start";
    ctx.restore();
  }

  function drawPlant(x, y) {
    ctx.fillStyle = "#9b6c4e";
    roundRect(x - 12, y + 20, 24, 25, 5); ctx.fill();
    ctx.fillStyle = "#5d9553";
    for (const offset of [-18, -8, 8, 18]) {
      ctx.beginPath(); ctx.ellipse(x + offset * 0.55, y + 12, 10, 22, offset * 0.025, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawIssue(issue, time) {
    const status = issueStatus(issue);
    const nearby = nearestObject()?.id === issue.id;
    const pulse = 0.5 + Math.sin(time * 0.004 + ISSUES.indexOf(issue)) * 0.5;
    const centerX = issue.x + issue.w / 2;
    const centerY = issue.y + issue.h / 2;
    ctx.save();
    if (!status.repaired) {
      ctx.globalAlpha = status.discovered ? 0.34 + pulse * 0.22 : 0.18 + pulse * 0.12;
      ctx.fillStyle = status.discovered ? "#ef7a67" : "#f3c763";
      ctx.beginPath(); ctx.arc(centerX, centerY, Math.max(issue.w, issue.h) * (0.65 + pulse * 0.12), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.shadowColor = nearby ? "rgba(255, 246, 190, 0.95)" : "rgba(45, 30, 28, 0.2)";
    ctx.shadowBlur = nearby ? 18 : 5;
    roundRect(issue.x, issue.y, issue.w, issue.h, 12);
    ctx.fillStyle = status.repaired ? "#dcebd2" : "#fffaf0";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = status.repaired ? "#78a268" : nearby ? "#f3c763" : issue.color;
    ctx.lineWidth = nearby ? 5 : 3;
    ctx.stroke();
    ctx.font = `${Math.min(34, issue.h * 0.48)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(status.repaired ? "✓" : issue.icon, centerX, centerY + 10);
    ctx.font = "800 11px system-ui, sans-serif";
    ctx.fillStyle = "#4d3934";
    ctx.fillText(issue.label, centerX, issue.y + issue.h + 16);
    if (status.discovered && !status.repaired) {
      ctx.fillStyle = "#a8453d";
      ctx.font = "900 10px system-ui, sans-serif";
      ctx.fillText(`${status.repairStep}/${REPAIR_STEPS}`, centerX, issue.y - 8);
    }
    ctx.textAlign = "start";
    drawProblemEffect(issue, status, time);
    ctx.restore();
  }

  function drawProblemEffect(issue, status, time) {
    if (status.repaired) return;
    const x = issue.x + issue.w / 2;
    const y = issue.y + issue.h / 2;
    const wave = Math.sin(time * 0.006);
    ctx.save();
    ctx.lineWidth = 3;
    if (["leak", "toilet-clog", "drain"].includes(issue.id)) {
      ctx.fillStyle = "rgba(49, 151, 199, 0.75)";
      for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.arc(x - 15 + i * 15, y + issue.h / 2 + 7 + wave * 3, 5 + i, 0, Math.PI * 2); ctx.fill(); }
    } else if (issue.id === "water-supply") {
      ctx.strokeStyle = "#4f9ec4"; ctx.beginPath(); ctx.moveTo(x - 8, y + 20); ctx.lineTo(x + 8, y + 36); ctx.moveTo(x + 8, y + 20); ctx.lineTo(x - 8, y + 36); ctx.stroke();
    } else if (issue.id === "power-outage") {
      ctx.fillStyle = `rgba(47, 38, 55, ${0.22 + 0.12 * Math.abs(wave)})`; ctx.beginPath(); ctx.arc(x, y, 34, 0, Math.PI * 2); ctx.fill();
    } else if (issue.id === "noise") {
      ctx.strokeStyle = "rgba(190, 75, 70, 0.75)";
      for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.arc(x, y, 35 + i * 12 + wave * 4, -0.9, 0.9); ctx.stroke(); }
    } else if (issue.id === "heating") {
      ctx.strokeStyle = "rgba(80, 146, 186, 0.8)";
      for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.moveTo(x - 18 + i * 18, y - 35); ctx.lineTo(x - 12 + i * 18, y - 47); ctx.stroke(); }
    } else if (issue.id === "smell") {
      ctx.strokeStyle = "rgba(126, 103, 151, 0.7)";
      for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.moveTo(x - 15 + i * 15, y - 32); ctx.bezierCurveTo(x - 25 + i * 15, y - 45, x + i * 15, y - 52, x - 8 + i * 15, y - 64); ctx.stroke(); }
    }
    ctx.restore();
  }

  function drawToolkit(time) {
    const near = nearestObject()?.id === TOOLKIT.id;
    const pulse = 0.5 + Math.sin(time * 0.005) * 0.5;
    const x = TOOLKIT.x + TOOLKIT.w / 2;
    const y = TOOLKIT.y + TOOLKIT.h / 2;
    ctx.save();
    ctx.globalAlpha = 0.25 + pulse * 0.2;
    ctx.fillStyle = "#f3c763";
    ctx.beginPath(); ctx.arc(x, y, 47 + pulse * 8, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowColor = near ? "#fff0a8" : "rgba(60, 38, 30, 0.25)";
    ctx.shadowBlur = near ? 20 : 8;
    roundRect(TOOLKIT.x, TOOLKIT.y, TOOLKIT.w, TOOLKIT.h, 13);
    ctx.fillStyle = "#d77e4f"; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#8c4c36"; ctx.lineWidth = 4; ctx.stroke();
    ctx.font = "32px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
    ctx.textAlign = "center"; ctx.fillText(TOOLKIT.icon, x, y + 11);
    ctx.font = "900 11px system-ui, sans-serif"; ctx.fillStyle = "#5a392f"; ctx.fillText("수리 가방", x, TOOLKIT.y - 9);
    ctx.textAlign = "start";
    ctx.restore();
  }

  function drawPath() {
    if (!state.path.length || state.controlMode !== "tap") return;
    ctx.save();
    ctx.fillStyle = "rgba(109, 70, 56, 0.38)";
    state.path.forEach((point, index) => {
      if (index % 2) return;
      ctx.beginPath(); ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  function drawParticles() {
    particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, particle.life / particle.max);
      ctx.fillStyle = particle.color;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  }

  function drawPlayer(time) {
    const x = state.player.x;
    const y = state.player.y + Math.sin(state.player.step) * 1.8;
    const width = state.player.w;
    const height = state.player.h;
    ctx.save();
    ctx.fillStyle = "rgba(70, 44, 37, 0.22)";
    ctx.beginPath(); ctx.ellipse(x + width / 2, y + height + 4, 17, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f0b58e";
    ctx.beginPath(); ctx.arc(x + width / 2, y + 10, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#4f3b39";
    ctx.beginPath(); ctx.arc(x + width / 2, y + 6, 10, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#5f8daa";
    roundRect(x + 3, y + 18, width - 6, 18, 7); ctx.fill();
    ctx.strokeStyle = "#405c70"; ctx.lineWidth = 3;
    const swing = Math.sin(state.player.step) * 3;
    ctx.beginPath(); ctx.moveTo(x + 9, y + 34); ctx.lineTo(x + 7 + swing, y + height + 3); ctx.moveTo(x + width - 9, y + 34); ctx.lineTo(x + width - 7 - swing, y + height + 3); ctx.stroke();
    if (state.toolkit) {
      ctx.fillStyle = "#c96942"; roundRect(x + width - 1, y + 20, 10, 13, 3); ctx.fill();
    }
    ctx.restore();
  }

  function drawCanvasShade() {
    const gradient = ctx.createRadialGradient(ui.canvas.width / 2, ui.canvas.height / 2, ui.canvas.height * 0.28, ui.canvas.width / 2, ui.canvas.height / 2, ui.canvas.width * 0.65);
    gradient.addColorStop(0, "rgba(255,255,255,0)");
    gradient.addColorStop(1, "rgba(58,32,28,0.23)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
  }

  function render(time) {
    const room = ROOMS.find((entry) => entry.id === currentRoomId) || ROOMS[2];
    const desiredScale = playing ? (isTouchDevice ? 1.32 : 1.24) : 1;
    const halfViewWidth = ui.canvas.width / (2 * desiredScale);
    const halfViewHeight = ui.canvas.height / (2 * desiredScale);
    const roomCenterX = room.x + room.w / 2;
    const roomCenterY = room.y + room.h / 2;
    const desiredX = playing
      ? Math.max(halfViewWidth, Math.min(WORLD.width - halfViewWidth, roomCenterX))
      : WORLD.width / 2;
    const desiredY = playing
      ? Math.max(halfViewHeight, Math.min(WORLD.height - halfViewHeight, roomCenterY))
      : WORLD.height / 2;
    camera.scale += (desiredScale - camera.scale) * 0.06;
    camera.x += (desiredX - camera.x) * 0.055;
    camera.y += (desiredY - camera.y) * 0.055;
    ctx.fillStyle = "#6e4942";
    ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height);
    drawWorld(time);
  }

  function frame(time) {
    const elapsed = Math.min(0.08, (time - lastFrame) / 1000);
    lastFrame = time;
    const targetStep = isTouchDevice ? 1 / 45 : 1 / 60;
    accumulator = Math.min(0.16, accumulator + elapsed);
    while (accumulator >= targetStep) {
      update(targetStep);
      accumulator -= targetStep;
    }
    render(time);
    requestAnimationFrame(frame);
  }

  bindEvents();
  detectDevice();
  const hasSavedGame = restoreGame();
  setControlMode(state.controlMode, { save: false });
  currentRoomId = roomForPoint(state.player.x + state.player.w / 2, state.player.y + state.player.h / 2)?.id || "living";
  prepareStartCard(hasSavedGame);
  updateAllUi();
  syncFullscreenUi();
  requestAnimationFrame(frame);

  window.__houseRescueTest = Object.freeze({
    startNew() { startNewGame({ forceTutorial: true }); return snapshotForTests(); },
    teleportTo(id) { return teleportTo(id); },
    interact() { tryInteract(); return snapshotForTests(); },
    answerCorrect() {
      const issue = ISSUE_BY_ID.get(activeDiagnosisId);
      if (issue) answerDiagnosis(issue.expression);
      return snapshotForTests();
    },
    snapshot() { return snapshotForTests(); }
  });
})();
