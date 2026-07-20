(() => {
  "use strict";

  const SAVE_KEY = "c15-house-rescue-save-v1";
  const CONTROL_MODE_KEY = "c15-house-rescue-control-mode-v1";
  const TUTORIAL_KEY = "c15-house-rescue-tutorial-v1";
  const SAVE_VERSION = 2;
  const WORLD = Object.freeze({ width: 960, height: 640 });
  const REPAIR_STEPS = 2;
  const ISSUE_PHASES = Object.freeze(["queued", "incident", "diagnosed", "resolved"]);

  const byId = (id) => document.getElementById(id);
  const ui = {
    game: byId("houseGame"),
    heroToggle: byId("heroToggle"),
    heroDetails: byId("heroDetails"),
    fullscreenToggle: byId("fullscreenToggle"),
    resetButton: byId("resetButton"),
    soundToggle: byId("soundToggle"),
    canvas: byId("houseCanvas"),
    canvasFrame: document.querySelector(".canvas-frame"),
    storyToggle: byId("storyToggle"),
    storyToggleLabel: byId("storyToggleLabel"),
    storyPanel: byId("storyPanel"),
    storyTitle: byId("storyTitle"),
    storyBody: byId("storyBody"),
    storyProgressFill: byId("storyProgressFill"),
    storyProgressLabel: byId("storyProgressLabel"),
    missionGuide: byId("missionGuide"),
    missionPhase: byId("missionPhase"),
    missionInstruction: byId("missionInstruction"),
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
    diagnosisVisual: byId("diagnosisVisual"),
    diagnosisVisualPrimary: byId("diagnosisVisualPrimary"),
    diagnosisVisualSecondary: byId("diagnosisVisualSecondary"),
    diagnosisQuestion: byId("diagnosisQuestion"),
    diagnosisOptions: byId("diagnosisOptions"),
    diagnosisFeedback: byId("diagnosisFeedback"),
    diagnosisCancel: byId("diagnosisCancel"),
    endingPanel: byId("endingPanel"),
    endingSummary: byId("endingSummary"),
    endingWords: byId("endingWords"),
    endingJournal: byId("endingJournal"),
    endingRestart: byId("endingRestart"),
    toast: byId("toast"),
    toastIcon: document.querySelector(".toast-icon"),
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
    { x: 440, y: 118, w: 80, h: 92 },
    { x: 156, y: 288, w: 112, h: 64 },
    { x: 692, y: 288, w: 112, h: 64 },
    { x: 440, y: 438, w: 80, h: 104 }
  ]);

  const ISSUES = Object.freeze([
    {
      id: "water-supply", room: "kitchen", label: "수도꼭지", icon: "🚰", x: 100, y: 76, w: 72, h: 58,
      expression: "수돗물이 안 나오다", clue: "손잡이를 돌려도 물 한 방울 나오지 않아요.",
      incident: "수도꼭지를 돌렸는데 물이 한 방울도 나오지 않아요.",
      example: "주방 수돗물이 안 나와서 관리실에 연락했어요.",
      repairTarget: { label: "급수 밸브", icon: "🔩", x: 112, y: 202, w: 62, h: 44 },
      repairSteps: ["싱크대 아래 급수 밸브가 잠겼는지 확인했어요.", "급수 밸브를 천천히 열고 물이 나오는지 확인했어요."],
      resolution: "수도꼭지에서 물이 다시 나와요.",
      distractors: ["물이 새다", "물이 안 내려가다"], color: "#4f9ec4"
    },
    {
      id: "power-outage", room: "living", label: "전등 스위치", icon: "💡", x: 386, y: 388, w: 44, h: 60,
      expression: "전기가 나가다", clue: "불도 텔레비전도 갑자기 모두 꺼졌어요.",
      incident: "딸깍! 거실 불과 텔레비전이 갑자기 모두 꺼졌어요.",
      example: "어젯밤에 전기가 나가서 촛불을 켰어요.",
      repairTarget: { label: "두꺼비집", icon: "⚡", x: 72, y: 378, w: 62, h: 68 },
      repairSteps: ["젖은 손이 아닌지 확인하고 전기 제품의 전원을 껐어요.", "내려간 차단기를 안전하게 올렸어요."],
      resolution: "거실 불과 텔레비전이 다시 켜졌어요.",
      distractors: ["난방이 안 되다", "소음이 심하다"], color: "#e7a52e"
    },
    {
      id: "toilet-clog", room: "bathroom", label: "변기", icon: "🚽", x: 560, y: 72, w: 82, h: 78,
      expression: "변기가 막히다", clue: "물을 내리자 물이 차오르고 변기가 꿀렁거려요.",
      incident: "물을 내리자 변기 물이 올라오며 꿀렁거려요.",
      example: "변기가 막혀서 뚫어뻥을 사용했어요.",
      repairSteps: ["물이 넘치지 않도록 급수 밸브를 먼저 잠갔어요.", "뚫어뻥을 밀착해 막힌 곳을 뚫었어요."],
      resolution: "변기 물이 정상적으로 내려가요.",
      distractors: ["수돗물이 안 나오다", "물이 새다"], color: "#6e8fc4"
    },
    {
      id: "leak", room: "bathroom", label: "수도관", icon: "💧", x: 842, y: 176, w: 56, h: 72,
      expression: "물이 새다", clue: "수도관 연결 부분에서 물방울이 계속 떨어져요.",
      incident: "수도관 아래에 물방울이 떨어지고 바닥 웅덩이가 커져요.",
      example: "욕실 수도관에서 물이 새서 바닥이 젖었어요.",
      repairSteps: ["더 새지 않도록 급수 밸브를 잠갔어요.", "수도관 연결 너트를 렌치로 조였어요."],
      resolution: "물방울이 멈추고 바닥을 닦았어요.",
      distractors: ["물이 안 내려가다", "수돗물이 안 나오다"], color: "#3f9bc0"
    },
    {
      id: "noise", room: "bedroom", label: "이웃집 벽", icon: "🔊", x: 888, y: 414, w: 34, h: 136,
      expression: "소음이 심하다", clue: "벽 너머에서 쿵쿵거리는 소리가 크게 들려요.",
      incident: "밤인데 이웃집 벽 너머에서 쿵쿵 소리가 크게 들려요.",
      example: "밤마다 이웃집 소음이 심해서 잠을 못 자요.",
      repairTarget: { label: "관리실 인터폰", icon: "☎️", x: 548, y: 394, w: 66, h: 54 },
      repairSteps: ["소음이 난 시간과 상황을 조용히 기록했어요.", "관리실에 연락해 이웃에게 조용히 해 달라고 요청했어요."],
      resolution: "벽 너머 소리가 잦아들어 다시 조용해졌어요.",
      actionLabel: "대응",
      distractors: ["전기가 나가다", "이상한 냄새가 나다"], color: "#bd625e"
    },
    {
      id: "heating", room: "bedroom", label: "난방기", icon: "🌡️", x: 548, y: 520, w: 92, h: 54,
      expression: "난방이 안 되다", clue: "온도를 올려도 방바닥과 공기가 계속 차가워요.",
      incident: "온도를 올렸는데도 방바닥이 차갑고 입김이 나요.",
      example: "난방이 안 돼서 방 안이 너무 추워요.",
      repairSteps: ["온도조절기의 설정 온도를 확인했어요.", "난방 밸브를 열고 관리실 점검을 요청했어요."],
      resolution: "방바닥이 따뜻해지고 실내 온도가 올라갔어요.",
      actionLabel: "점검",
      distractors: ["전기가 나가다", "소음이 심하다"], color: "#d47755"
    },
    {
      id: "smell", room: "kitchen", label: "냉장고", icon: "🧊", x: 352, y: 92, w: 72, h: 118,
      expression: "이상한 냄새가 나다", clue: "문을 여니 코를 찌르는 낯선 냄새가 퍼져요.",
      incident: "냉장고 문을 여니 코를 찌르는 냄새가 퍼져요.",
      example: "냉장고에서 이상한 냄새가 나서 안을 청소했어요.",
      repairSteps: ["유통기한을 살펴 상한 음식을 찾았어요.", "상한 음식을 버리고 냉장고 안을 닦았어요."],
      resolution: "냉장고 안이 깨끗해지고 냄새가 사라졌어요.",
      distractors: ["소음이 심하다", "난방이 안 되다"], color: "#7f78a8"
    },
    {
      id: "drain", room: "kitchen", label: "싱크대 배수구", icon: "🕳️", x: 220, y: 78, w: 72, h: 58,
      expression: "물이 안 내려가다", clue: "싱크대에 고인 물이 빙글빙글 돌기만 해요.",
      incident: "설거지 물이 싱크대에 고인 채 내려가지 않아요.",
      example: "싱크대 물이 안 내려가서 배수구를 청소했어요.",
      repairSteps: ["배수구 거름망을 조심히 꺼냈어요.", "거름망과 배수구의 이물질을 제거했어요."],
      resolution: "고인 물이 소용돌이치며 시원하게 내려가요.",
      distractors: ["변기가 막히다", "수돗물이 안 나오다"], color: "#66798b"
    }
  ]);

  const ISSUE_BY_ID = new Map(ISSUES.map((issue) => [issue.id, issue]));
  const MISSION_ORDER = Object.freeze([
    "power-outage", "water-supply", "drain", "smell",
    "toilet-clog", "leak", "heating", "noise"
  ]);
  const ISSUE_VISUALS = Object.freeze({
    "power-outage": Object.freeze({ cue: "blackout-flicker", primary: "💡", secondary: "📺", effects: ["⚡", "✦", "⚡"] }),
    "water-supply": Object.freeze({ cue: "dry-faucet", primary: "🚰", secondary: "🚫", effects: ["💧", "×", "💧"] }),
    drain: Object.freeze({ cue: "standing-water", primary: "🚰", secondary: "🕳️", effects: ["↻", "•", "↻"] }),
    smell: Object.freeze({ cue: "rising-odor", primary: "🧊", secondary: "🤢", effects: ["〰", "〰", "〰"] }),
    "toilet-clog": Object.freeze({ cue: "rising-bowl-water", primary: "🚽", secondary: "🪠", effects: ["●", "○", "●"] }),
    leak: Object.freeze({ cue: "falling-drops-puddle", primary: "🔧", secondary: "💧", effects: ["💧", "💧", "💧"] }),
    heating: Object.freeze({ cue: "cold-room-snow", primary: "🌡️", secondary: "🥶", effects: ["❄", "❄", "❄"] }),
    noise: Object.freeze({ cue: "wall-impact-waves", primary: "🧱", secondary: "🛏️", effects: ["💥", "◖", "💥"] })
  });
  const TOOLKIT = Object.freeze({ id: "toolkit", room: "living", label: "수리 가방", icon: "🧰", x: 350, y: 536, w: 66, h: 56 });

  const keys = Object.create(null);
  const controls = { joystickActive: false, joystickX: 0, joystickY: 0, joystickPointerId: null, actionPressed: false };
  const autoNavigation = { goalX: null, goalY: null, targetId: null, stallTime: 0, retries: 0 };
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
  let incidentFx = null;
  let resolutionFx = null;

  function blankIssueState() {
    return Object.fromEntries(ISSUES.map((issue) => [issue.id, { phase: "queued", repairStep: 0 }]));
  }

  function getStoredMode() {
    try { return localStorage.getItem(CONTROL_MODE_KEY) === "joystick" ? "joystick" : "tap"; }
    catch { return "tap"; }
  }

  function createState() {
    return {
      version: SAVE_VERSION,
      started: false,
      completed: false,
      toolkit: true,
      soundOn: true,
      controlMode: getStoredMode(),
      player: { x: 250, y: 492, w: 28, h: 38, facing: "down", step: 0 },
      issues: blankIssueState(),
      activeIssueId: MISSION_ORDER[0],
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

  function syncCanvasResolution() {
    if (!ui.canvas) return;
    const portraitStage = playing && window.innerWidth <= 680 && window.innerHeight > window.innerWidth;
    let nextWidth = WORLD.width;
    let nextHeight = WORLD.height;
    if (portraitStage && ui.canvasFrame) {
      const frameWidth = Math.max(1, ui.canvasFrame.clientWidth);
      const frameHeight = Math.max(1, ui.canvasFrame.clientHeight);
      nextHeight = Math.max(900, Math.min(1600, Math.round(nextWidth * frameHeight / frameWidth)));
    }
    if (ui.canvas.width !== nextWidth || ui.canvas.height !== nextHeight) {
      ui.canvas.width = nextWidth;
      ui.canvas.height = nextHeight;
    }
  }

  function normalizeMode(mode) {
    return mode === "joystick" ? "joystick" : "tap";
  }

  function setControlMode(mode, { save = true } = {}) {
    state.controlMode = normalizeMode(mode);
    document.documentElement.dataset.controlMode = state.controlMode;
    ui.controlModeSelector?.querySelectorAll('input[name="controlMode"]').forEach((input) => {
      input.checked = input.value === state.controlMode;
    });
    state.path = [];
    state.autoTargetId = null;
    autoNavigation.goalX = null;
    autoNavigation.goalY = null;
    autoNavigation.targetId = null;
    autoNavigation.stallTime = 0;
    autoNavigation.retries = 0;
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
    return state.issues[id] || { phase: "queued", repairStep: 0 };
  }

  function isDiscovered(issueOrId) {
    return ["diagnosed", "resolved"].includes(issueStatus(issueOrId).phase);
  }

  function isResolved(issueOrId) {
    return issueStatus(issueOrId).phase === "resolved";
  }

  function activeIssue() {
    return state.activeIssueId ? ISSUE_BY_ID.get(state.activeIssueId) || null : null;
  }

  function displayObjectForIssue(issue) {
    const status = issueStatus(issue);
    if (status.phase === "diagnosed" && issue.repairTarget) {
      return { ...issue, ...issue.repairTarget, id: issue.id, stage: "response" };
    }
    return { ...issue, stage: status.phase === "resolved" ? "resolved" : "symptom" };
  }

  function responseTargetLabel(issue) {
    return issue.repairTarget?.label || issue.label;
  }

  function withObjectParticle(label) {
    const lastCharacter = String(label || "").slice(-1);
    const code = lastCharacter.charCodeAt(0);
    const hasFinalConsonant = code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
    return `${label}${hasFinalConsonant ? "을" : "를"}`;
  }

  function isBlackoutActive() {
    return ["incident", "diagnosed"].includes(issueStatus("power-outage").phase);
  }

  function effectStrength(issueOrId) {
    const id = typeof issueOrId === "string" ? issueOrId : issueOrId.id;
    const status = issueStatus(id);
    if (id !== state.activeIssueId || !["incident", "diagnosed"].includes(status.phase)) return 0;
    return status.phase === "diagnosed" && status.repairStep > 0 ? 0.46 : 1;
  }

  function beginSceneFx(type, issue) {
    const fx = { issueId: issue.id, startedAt: performance.now() };
    if (type === "incident") incidentFx = fx;
    else resolutionFx = fx;
    const frame = ui.canvasFrame;
    if (!frame) return;
    const className = type === "incident" ? "is-incident-flash" : "is-resolution-flash";
    frame.classList.remove(className);
    requestAnimationFrame(() => frame.classList.add(className));
    window.setTimeout(() => frame.classList.remove(className), type === "incident" ? 900 : 1300);
  }

  function updateDiagnosisVisual(issue) {
    const visual = ISSUE_VISUALS[issue.id];
    if (!visual || !ui.diagnosisVisual) return;
    ui.diagnosisVisual.dataset.issue = issue.id;
    ui.diagnosisVisual.setAttribute("aria-label", issue.clue);
    if (ui.diagnosisVisualPrimary) ui.diagnosisVisualPrimary.textContent = visual.primary;
    if (ui.diagnosisVisualSecondary) ui.diagnosisVisualSecondary.textContent = visual.secondary;
    ui.diagnosisVisual.querySelectorAll(".diagnosis-visual__effect").forEach((element, index) => {
      element.textContent = visual.effects[index] || "✦";
    });
  }

  function discoveredIssues() {
    return state.discoveryOrder.map((id) => ISSUE_BY_ID.get(id)).filter(Boolean);
  }

  function repairedIssues() {
    return state.repairedOrder.map((id) => ISSUE_BY_ID.get(id)).filter(Boolean);
  }

  function serializeState() {
    return {
      version: SAVE_VERSION,
      started: state.started,
      completed: state.completed,
      toolkit: state.toolkit,
      soundOn: state.soundOn,
      controlMode: state.controlMode,
      player: { x: state.player.x, y: state.player.y, facing: state.player.facing },
      issues: state.issues,
      activeIssueId: state.activeIssueId,
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
      if (!saved || ![1, SAVE_VERSION].includes(saved.version)) return false;
      const next = createState();
      next.started = Boolean(saved.started);
      next.completed = Boolean(saved.completed);
      next.toolkit = true;
      next.soundOn = saved.soundOn !== false;
      next.controlMode = getStoredMode();
      if (saved.player && Number.isFinite(saved.player.x) && Number.isFinite(saved.player.y)) {
        next.player.x = Math.max(30, Math.min(WORLD.width - 50, saved.player.x));
        next.player.y = Math.max(30, Math.min(WORLD.height - 60, saved.player.y));
        next.player.facing = ["up", "down", "left", "right"].includes(saved.player.facing) ? saved.player.facing : "down";
      }
      for (const issue of ISSUES) {
        const source = saved.issues?.[issue.id];
        const migratedPhase = ISSUE_PHASES.includes(source?.phase)
          ? source.phase
          : source?.repaired
            ? "resolved"
            : source?.discovered
              ? "diagnosed"
              : "queued";
        next.issues[issue.id] = {
          phase: migratedPhase,
          repairStep: Math.max(0, Math.min(REPAIR_STEPS, Number(source?.repairStep) || 0))
        };
      }
      next.discoveryOrder = Array.isArray(saved.discoveryOrder)
        ? saved.discoveryOrder.filter((id, index, list) => ISSUE_BY_ID.has(id) && list.indexOf(id) === index && ["diagnosed", "resolved"].includes(next.issues[id].phase))
        : MISSION_ORDER.filter((id) => ["diagnosed", "resolved"].includes(next.issues[id].phase));
      next.repairedOrder = Array.isArray(saved.repairedOrder)
        ? saved.repairedOrder.filter((id, index, list) => ISSUE_BY_ID.has(id) && list.indexOf(id) === index && next.issues[id].phase === "resolved")
        : MISSION_ORDER.filter((id) => next.issues[id].phase === "resolved");
      const firstUnresolved = MISSION_ORDER.find((id) => next.issues[id].phase !== "resolved") || null;
      next.activeIssueId = firstUnresolved;
      next.completed = !firstUnresolved;
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
    if (ui.toastIcon) ui.toastIcon.textContent = tone === "warning" ? "!" : tone === "hint" ? "→" : "✓";
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
    if (playing && activeIssue() && issueStatus(activeIssue()).phase === "queued") {
      activateCurrentIssue({ announce: true });
    }
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
    const issue = activeIssue();
    if (!issue || isResolved(issue)) return [];
    return [displayObjectForIssue(issue)];
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
    return isOpen(ui.dialogueBox) || isOpen(ui.diagnosisPanel) || isOpen(ui.endingPanel) || isOpen(ui.controlTutorial) || isOpen(ui.journalDrawer);
  }

  function activateCurrentIssue({ announce = true } = {}) {
    const issue = activeIssue();
    if (!issue) return false;
    const status = issueStatus(issue);
    if (status.phase === "queued") {
      status.phase = "incident";
      beginSceneFx("incident", issue);
    }
    if (announce) {
      showToast("집 안에 변화가 생겼어요", "빛·움직임·소리를 보고 움직이는 곳을 터치하세요.", "warning");
      beep(issue.id === "power-outage" ? 165 : 360, 0.12, issue.id === "power-outage" ? "square" : "triangle");
      haptic([18, 24, 18]);
    }
    updateAllUi();
    saveGame();
    return true;
  }

  function closeDiagnosis() {
    activeDiagnosisId = null;
    setOpen(ui.diagnosisPanel, false);
    ui.canvas?.focus({ preventScroll: true });
  }

  function queueNextMission() {
    const currentIndex = MISSION_ORDER.indexOf(state.activeIssueId);
    const nextId = MISSION_ORDER.slice(currentIndex + 1).find((id) => !isResolved(id)) || null;
    state.activeIssueId = nextId;
    return Boolean(nextId);
  }

  function openDiagnosis(issue) {
    const status = issueStatus(issue);
    if (issue.id !== state.activeIssueId || status.phase !== "incident") return false;
    activeDiagnosisId = issue.id;
    if (ui.diagnosisScene) ui.diagnosisScene.textContent = `${ROOMS.find((room) => room.id === issue.room)?.icon || "🏠"} 장면 관찰`;
    if (ui.diagnosisQuestion) ui.diagnosisQuestion.textContent = "이 장면과 어울리는 표현은 무엇일까요?";
    updateDiagnosisVisual(issue);
    if (ui.diagnosisFeedback) {
      ui.diagnosisFeedback.textContent = "그림의 움직임을 보고 골라 보세요.";
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
    return true;
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
    if (status.phase === "incident") {
      status.phase = "diagnosed";
      state.discoveryOrder.push(issue.id);
    }
    closeDiagnosis();
    spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, issue.color, 16);
    showToast("표현을 찾았어요", `${issue.expression} · 이제 ${responseTargetLabel(issue)}에서 ${issue.actionLabel || "해결"}하세요.`);
    beep(720, 0.11, "sine");
    haptic(24);
    updateAllUi();
    saveGame();
    return true;
  }

  function repairIssue(issue) {
    const status = issueStatus(issue);
    if (status.phase !== "diagnosed") return false;
    const canonicalIssue = ISSUE_BY_ID.get(issue.id) || issue;
    const steps = Array.isArray(issue.repairSteps) && issue.repairSteps.length
      ? issue.repairSteps
      : ["상태를 안전하게 확인했어요.", "문제가 해결됐는지 다시 확인했어요."];
    const actionLabel = issue.actionLabel || "해결";
    status.repairStep = Math.min(REPAIR_STEPS, status.repairStep + 1);
    spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, issue.color, 9);
    if (status.repairStep < REPAIR_STEPS) {
      showDialogue(
        `${actionLabel} ${status.repairStep}/${REPAIR_STEPS} · ${responseTargetLabel(issue)}`,
        `${steps[status.repairStep - 1]} 창을 닫은 뒤 ${withObjectParticle(responseTargetLabel(issue))} 다시 터치해 다음 단계인 “${steps[status.repairStep]}”를 진행하세요.`
      );
      beep(460, 0.06, "triangle");
    } else {
      status.phase = "resolved";
      beginSceneFx("resolution", canonicalIssue);
      if (!state.repairedOrder.includes(issue.id)) state.repairedOrder.push(issue.id);
      showToast(`${actionLabel} 완료`, "장면이 어떻게 정상으로 돌아오는지 눈으로 확인하세요.");
      spawnParticles(issue.x + issue.w / 2, issue.y + issue.h / 2, "#f3c763", 24);
      beep(860, 0.15, "sine");
      haptic([18, 28, 28]);
      const hasNextMission = queueNextMission();
      if (hasNextMission) {
        showDialogue(
          `${actionLabel} 완료`,
          `“${issue.example}” 장면의 변화를 확인한 뒤 창을 닫으면 다음 상황이 시작됩니다.`
        );
      } else {
        completeGame();
      }
    }
    updateAllUi();
    saveGame();
    return true;
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
    autoNavigation.targetId = null;
    const issue = ISSUE_BY_ID.get(object.id);
    if (!issue || issue.id !== state.activeIssueId) return false;
    const status = issueStatus(issue);
    if (status.phase === "queued") {
      activateCurrentIssue({ announce: true });
      return true;
    }
    if (status.phase === "incident") {
      openDiagnosis(issue);
      return true;
    }
    if (status.phase === "diagnosed") {
      repairIssue(displayObjectForIssue(issue));
      return true;
    }
    showDialogue(issue.label, `${issue.expression}. ${issue.example}`);
    beep(560, 0.05, "sine");
    return true;
  }

  function completeGame() {
    state.completed = true;
    state.activeIssueId = null;
    state.path = [];
    setOpen(ui.dialogueBox, false);
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
        const midpointX = (current.x + x) / 2;
        const midpointY = (current.y + y) / 2;
        if (!isWalkable(x, y) || !isWalkable(midpointX, midpointY)) continue;
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
    autoNavigation.goalX = worldX;
    autoNavigation.goalY = worldY;
    autoNavigation.targetId = targetId;
    autoNavigation.stallTime = 0;
    autoNavigation.retries = 0;
    if (!state.path.length) {
      state.autoTargetId = null;
      autoNavigation.targetId = null;
      showToast("길을 찾지 못했어요", "방 안쪽이나 문 근처를 다시 눌러 보세요.", "hint");
    }
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
      if (!state.path.length) {
        const targetId = state.autoTargetId;
        state.autoTargetId = null;
        autoNavigation.goalX = null;
        autoNavigation.goalY = null;
        autoNavigation.targetId = null;
        autoNavigation.stallTime = 0;
        if (targetId) {
          const object = ISSUE_BY_ID.get(targetId);
          if (object && nearestObject(112)?.id === object.id) tryInteract();
        }
      }
      return true;
    }
    const beforeX = state.player.x;
    const beforeY = state.player.y;
    movePlayer(dx / distance, dy / distance, Math.min(distance, 210 * dt));
    const moved = Math.hypot(state.player.x - beforeX, state.player.y - beforeY);
    autoNavigation.stallTime = moved < 0.2 ? autoNavigation.stallTime + dt : 0;
    if (autoNavigation.stallTime > 0.5) {
      autoNavigation.retries += 1;
      autoNavigation.stallTime = 0;
      const goalX = autoNavigation.goalX;
      const goalY = autoNavigation.goalY;
      const playerX = state.player.x + state.player.w / 2;
      const playerY = state.player.y + state.player.h / 2;
      state.path = Number.isFinite(goalX) && Number.isFinite(goalY) && autoNavigation.retries <= 2
        ? buildPath(playerX, playerY, goalX, goalY)
        : [];
      if (!state.path.length) {
        state.autoTargetId = null;
        autoNavigation.targetId = null;
        showToast("이동 경로를 다시 확인해 주세요", "문이 보이는 통로나 방 안쪽을 터치해 보세요.", "hint");
      }
    }
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
    const unresolved = ISSUES.filter((issue) => issue.room === roomId && !isResolved(issue)).length;
    const current = activeIssue();
    if (current?.room === roomId) return "이 방에서 반복해서 움직이는 장면을 찾아보세요.";
    return unresolved ? `이 방에는 앞으로 확인할 상황이 ${unresolved}개 있어요.` : "이 방의 점검을 마쳤어요.";
  }

  function updateInteractionPrompt() {
    const object = playing && !hasBlockingOverlay() && !isOpen(ui.dialogueBox) ? nearestObject() : null;
    if (!object) {
      setOpen(ui.interactionPrompt, false);
      if (ui.touchActionLabel) ui.touchActionLabel.textContent = "조사";
      return;
    }
    let label = `${object.label} 조사`;
    const issue = ISSUE_BY_ID.get(object.id);
    const status = issueStatus(object);
    if (status.phase === "incident") label = `${object.label} 상황 확인`;
    if (status.phase === "diagnosed") label = `${object.label} ${issue?.actionLabel || "해결"} ${status.repairStep + 1}/${REPAIR_STEPS}`;
    if (status.phase === "resolved") label = `${object.label} 복습`;
    if (ui.interactionPromptText) ui.interactionPromptText.textContent = label;
    if (ui.interactionPromptKey) ui.interactionPromptKey.textContent = isTouchDevice ? "행동" : "E";
    if (ui.touchActionLabel) ui.touchActionLabel.textContent = status.phase === "diagnosed" ? (issue?.actionLabel || "해결") : "확인";
    setOpen(ui.interactionPrompt, true);
  }

  function updateRoomMap() {
    ui.roomMap?.querySelectorAll("[data-room]").forEach((button) => {
      const active = button.dataset.room === currentRoomId;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      const roomIssues = ISSUES.filter((issue) => issue.room === button.dataset.room);
      const repaired = roomIssues.filter((issue) => isResolved(issue)).length;
      button.dataset.progress = `${repaired}/${roomIssues.length}`;
      button.classList.toggle("is-complete", roomIssues.length > 0 && repaired === roomIssues.length);
    });
  }

  function updateStory() {
    const discovered = discoveredIssues().length;
    const repaired = repairedIssues().length;
    const issue = activeIssue();
    const status = issue ? issueStatus(issue) : null;
    const room = issue ? ROOMS.find((entry) => entry.id === issue.room) : null;
    let phaseLabel = "점검 완료";
    let title = "우리 집 점검 완료";
    let body = "기록장을 열어 여덟 표현과 해결 문장을 다시 말해 보세요.";
    let mission = "모든 상황을 해결했어요. 수리 기록장을 확인하세요.";
    if (issue && status) {
      if (status.phase === "queued") {
        phaseLabel = "다음 상황";
        title = "다음 장면 준비";
        body = "방금 바뀐 장면을 확인한 뒤 창을 닫아 주세요.";
        mission = "정상으로 돌아온 모습을 확인하고 창을 닫으세요.";
      } else if (status.phase === "incident") {
        phaseLabel = "👁 장면 관찰";
        title = `${room?.icon || "🏠"} ${room?.name || "집 안"}의 변화를 찾아보세요`;
        body = "빛·물·공기·사물의 반복되는 움직임을 살펴보세요.";
        mission = "반복해서 움직이는 장면을 찾아 터치하세요.";
      } else if (status.phase === "diagnosed") {
        const target = responseTargetLabel(issue);
        const action = issue.actionLabel || "해결";
        phaseLabel = `${action} ${status.repairStep + 1}/${REPAIR_STEPS}`;
        title = `${target}에서 ${action}하기`;
        body = `${issue.expression} 상황이에요. ${issue.repairSteps?.[status.repairStep] || "상태를 안전하게 확인하세요."}`;
        mission = `${room?.name || "집 안"}의 ${withObjectParticle(target)} 터치: ${issue.repairSteps?.[status.repairStep] || "상태 확인"}`;
      }
    }
    if (ui.storyTitle) ui.storyTitle.textContent = title;
    if (ui.storyBody) ui.storyBody.textContent = body;
    if (ui.storyToggleLabel) ui.storyToggleLabel.textContent = title;
    if (ui.missionPhase) ui.missionPhase.textContent = phaseLabel;
    if (ui.missionInstruction) ui.missionInstruction.textContent = mission;
    if (ui.missionGuide) {
      ui.missionGuide.dataset.phase = status?.phase || "resolved";
      ui.missionGuide.dataset.issue = issue?.id || "complete";
    }
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
    MISSION_ORDER.map((id) => ISSUE_BY_ID.get(id)).filter(Boolean).forEach((issue, index) => {
      const status = issueStatus(issue);
      const item = document.createElement("li");
      const discoveredNow = isDiscovered(issue);
      const resolvedNow = isResolved(issue);
      item.className = `journal-item ${discoveredNow ? "is-discovered" : "is-locked"} ${resolvedNow ? "is-repaired" : ""}`;
      if (discoveredNow) {
        item.innerHTML = `<span class="journal-number">${index + 1}</span><div><strong>${issue.expression}</strong><p>${issue.example}</p><small>${resolvedNow ? `✓ ${issue.actionLabel || "해결"} 완료` : `${issue.actionLabel || "해결"} ${status.repairStep}/${REPAIR_STEPS}`}</small></div>`;
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
    if (ui.toolValue) ui.toolValue.textContent = "기본 도구 준비";
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
    if (ui.tutorialStatus) ui.tutorialStatus.textContent = "설명을 확인한 뒤 다음을 눌러 탐험을 시작하세요.";
    if (ui.tutorialNext) ui.tutorialNext.textContent = tutorialStep === 0 ? "다음" : "탐험 시작";
  }

  function beginQueuedMission() {
    const issue = activeIssue();
    if (!issue || issueStatus(issue).phase !== "queued") return false;
    const isOpeningMission = issue.id === MISSION_ORDER[0]
      && state.discoveryOrder.length === 0
      && state.repairedOrder.length === 0;
    if (isOpeningMission) {
      activateCurrentIssue({ announce: false });
      showDialogue(
        "집 지킴이",
        "저와 함께 우리 집을 고쳐주세요! 집 안에서 달라진 모습을 눈으로 찾아봐요.",
        "opening"
      );
      beep(430, 0.08, "sine");
      haptic(16);
      return true;
    }
    return activateCurrentIssue({ announce: true });
  }

  function completeTutorial() {
    setOpen(ui.controlTutorial, false);
    try { localStorage.setItem(TUTORIAL_KEY, "done"); } catch { /* ignore */ }
    ui.canvas?.focus({ preventScroll: true });
    if (activeIssue() && issueStatus(activeIssue()).phase === "queued") beginQueuedMission();
    else showToast("현재 임무", ui.missionInstruction?.textContent || "반짝이는 목표를 확인하세요.", "hint");
  }

  function enterGame({ forceTutorial = false } = {}) {
    state.started = true;
    playing = true;
    ui.game.classList.add("is-game-started");
    document.body.classList.add("is-game-started");
    ui.startCard?.classList.add("hidden");
    requestAnimationFrame(syncCanvasResolution);
    setOpen(ui.endingPanel, false);
    setControlMode(state.controlMode, { save: false });
    updateAllUi();
    saveGame();
    let seenTutorial = false;
    try { seenTutorial = localStorage.getItem(TUTORIAL_KEY) === "done"; } catch { /* ignore */ }
    if (forceTutorial || !seenTutorial) showTutorial();
    else {
      ui.canvas?.focus({ preventScroll: true });
      if (activeIssue() && issueStatus(activeIssue()).phase === "queued") beginQueuedMission();
      else showToast("점검 시작", "저장된 상황에서 이어갑니다.", "hint");
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
    incidentFx = null;
    resolutionFx = null;
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
      if (ui.startButton) ui.startButton.textContent = "이어하기";
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
    const issue = ISSUE_BY_ID.get(id);
    const object = id === TOOLKIT.id ? TOOLKIT : issue ? displayObjectForIssue(issue) : null;
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
    const current = activeIssue();
    const currentObject = current ? displayObjectForIssue(current) : null;
    const powerPhase = issueStatus("power-outage").phase;
    const currentVisual = current ? ISSUE_VISUALS[current.id] : null;
    return {
      started: state.started,
      completed: state.completed,
      toolkit: state.toolkit,
      discovered: discoveredIssues().map((issue) => issue.expression),
      repaired: repairedIssues().map((issue) => issue.expression),
      activeIssueId: state.activeIssueId,
      issues: Object.fromEntries(MISSION_ORDER.map((id) => [id, { ...issueStatus(id) }])),
      blackout: ["incident", "diagnosed"].includes(powerPhase),
      targetLabel: currentObject?.label || null,
      visualCue: current && currentVisual ? {
        kind: currentVisual.cue,
        issueId: current.id,
        phase: issueStatus(current).phase,
        strength: effectStrength(current),
        sourceBounds: { x: current.x, y: current.y, w: current.w, h: current.h },
        targetBounds: currentObject ? { x: currentObject.x, y: currentObject.y, w: currentObject.w, h: currentObject.h } : null
      } : null,
      resolutionEffect: resolutionFx ? { issueId: resolutionFx.issueId, active: fxProgress(resolutionFx, performance.now(), 1350) < 1 } : null,
      pathLength: state.path.length,
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
        if (isOpen(ui.diagnosisPanel)) closeDiagnosis();
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
    window.addEventListener("resize", () => { detectDevice(); syncCanvasResolution(); updateAllUi(); });
    window.addEventListener("orientationchange", () => window.setTimeout(() => { detectDevice(); syncCanvasResolution(); updateAllUi(); }, 80));

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
    ui.diagnosisCancel?.addEventListener("click", closeDiagnosis);
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
        setOpen(ui.statsPanel, false);
        ui.statsToggle?.setAttribute("aria-expanded", "false");
        beginTapNavigation(room.x + room.w / 2, room.y + room.h / 2, null);
        showToast(`${room.icon} ${room.name}(으)로 이동`, "문을 지나 안전한 길로 걸어갑니다.", "hint");
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
    drawFurniture(time);
    drawRoomIncidentAtmosphere(time);
    drawHouseIncidentLayer(time);
    ISSUES.forEach((issue) => {
      const status = issueStatus(issue);
      if (status.phase === "diagnosed" && issue.repairTarget) {
        drawIssue({ ...issue, stage: "symptom-context" }, time);
      } else {
        drawIssue(displayObjectForIssue(issue), time);
      }
    });
    const issue = activeIssue();
    if (issue) {
      drawProblemEffect(issue, issueStatus(issue), time);
      if (issueStatus(issue).phase === "diagnosed" && issue.repairTarget) {
        drawIssue(displayObjectForIssue(issue), time);
      }
    }
    drawResolutionEffect(time);
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

  function drawFurniture(time) {
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
    drawPlant(418, 528);
    drawPowerFixtures(time);
    // Bedroom bed, desk and wardrobe
    const noiseStrength = effectStrength("noise");
    const bedShake = noiseStrength ? Math.sin(time * 0.036) * 2.4 * noiseStrength : 0;
    drawFurnitureBox(680 + bedShake, 390, 174, 96, "#f3c8bd", "#b97b70", "침대");
    drawFurnitureBox(650, 532, 142, 48, "#cf9c79", "#90634c", "책상");
    drawFurnitureBox(816, 530, 62, 66, "#b98d78", "#7d5d50", "옷장");
  }

  function drawPowerFixtures(time) {
    const off = isBlackoutActive();
    ctx.save();
    roundRect(54, 490, 82, 54, 8);
    const screenGlow = ctx.createLinearGradient(54, 490, 136, 544);
    screenGlow.addColorStop(0, off ? "#121923" : "#dff7ff");
    screenGlow.addColorStop(1, off ? "#05080d" : "#77bfd7");
    ctx.fillStyle = screenGlow;
    ctx.fill();
    ctx.strokeStyle = off ? "#4b5563" : "#527b9a";
    ctx.lineWidth = 4;
    ctx.stroke();
    if (off) {
      ctx.strokeStyle = "rgba(180, 196, 213, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(68, 501); ctx.lineTo(122, 532); ctx.stroke();
    } else {
      const scanY = 498 + ((time * 0.035) % 35);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.52)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(60, scanY); ctx.lineTo(130, scanY); ctx.stroke();
      ctx.fillStyle = "rgba(42, 120, 157, 0.48)";
      ctx.beginPath(); ctx.arc(76, 515, 8, 0, Math.PI * 2); ctx.arc(108, 515, 11, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = "#6b4a3b";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(370, 474);
    ctx.lineTo(370, 526);
    ctx.stroke();
    ctx.fillStyle = off ? "#4b5563" : "#ffe49b";
    ctx.beginPath();
    ctx.arc(370, 466, 19, 0, Math.PI * 2);
    ctx.fill();
    if (!off) {
      const glow = ctx.createRadialGradient(370, 466, 4, 370, 466, 62);
      glow.addColorStop(0, "rgba(255, 231, 151, 0.48)");
      glow.addColorStop(1, "rgba(255, 231, 151, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(370, 466, 62, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function fxProgress(fx, time, duration) {
    if (!fx) return 1;
    return Math.max(0, Math.min(1, (time - fx.startedAt) / duration));
  }

  function drawRoomIncidentAtmosphere(time) {
    const issue = activeIssue();
    if (!issue) return;
    const strength = effectStrength(issue);
    if (!strength) return;
    const room = ROOMS.find((entry) => entry.id === issue.room);
    if (!room) return;
    ctx.save();
    roundRect(room.x + 4, room.y + 4, room.w - 8, room.h - 8, 15);
    ctx.clip();
    if (issue.id === "heating") {
      ctx.fillStyle = `rgba(73, 145, 190, ${0.19 * strength})`;
      ctx.fillRect(room.x, room.y, room.w, room.h);
      const flakes = strength > 0.7 ? 7 : 3;
      for (let index = 0; index < flakes; index += 1) {
        const x = room.x + 42 + ((index * 67 + time * 0.018 * (1 + index % 2)) % (room.w - 84));
        const y = room.y + ((index * 61 + time * 0.028 * (1 + (index % 3) * 0.18)) % room.h);
        drawSnowflake(x, y, 6 + (index % 3) * 1.5, `rgba(242, 251, 255, ${0.68 * strength})`);
      }
    } else if (issue.id === "smell") {
      const haze = ctx.createRadialGradient(issue.x + 15, issue.y + 40, 4, issue.x + 15, issue.y + 40, 170);
      haze.addColorStop(0, `rgba(111, 91, 128, ${0.18 * strength})`);
      haze.addColorStop(1, "rgba(111, 91, 128, 0)");
      ctx.fillStyle = haze;
      ctx.fillRect(room.x, room.y, room.w, room.h);
    } else if (issue.id === "noise") {
      ctx.fillStyle = `rgba(74, 61, 91, ${0.08 * strength})`;
      ctx.fillRect(room.x, room.y, room.w, room.h);
    }
    ctx.restore();
  }

  function drawHouseIncidentLayer(time) {
    const restoringPower = resolutionFx?.issueId === "power-outage";
    if (!isBlackoutActive() && !restoringPower) return;
    let opacity = 0.5;
    if (isBlackoutActive()) {
      const age = incidentFx?.issueId === "power-outage" ? time - incidentFx.startedAt : 1000;
      if (age < 760) opacity = 0.28 + (Math.sin(age * 0.055) > 0.18 ? 0.25 : 0.04);
      else opacity = 0.53 + Math.abs(Math.sin(time * 0.0027)) * 0.035;
    } else {
      const progress = fxProgress(resolutionFx, time, 1250);
      opacity = 0.48 * (1 - progress);
      if (progress >= 1) return;
    }
    ctx.save();
    const playerX = state.player.x + state.player.w / 2;
    const playerY = state.player.y + state.player.h / 2;
    const shade = ctx.createRadialGradient(playerX, playerY, 28, playerX, playerY, 310);
    shade.addColorStop(0, `rgba(10, 16, 29, ${opacity * 0.48})`);
    shade.addColorStop(0.45, `rgba(10, 16, 29, ${opacity * 0.84})`);
    shade.addColorStop(1, `rgba(10, 16, 29, ${opacity})`);
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);
    ctx.restore();
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
    const contextOnly = issue.stage === "symptom-context";
    const nearby = !contextOnly && nearestObject()?.id === issue.id;
    const active = !contextOnly && issue.id === state.activeIssueId && status.phase !== "resolved";
    const pulse = 0.5 + Math.sin(time * 0.004 + MISSION_ORDER.indexOf(issue.id)) * 0.5;
    const centerX = issue.x + issue.w / 2;
    const centerY = issue.y + issue.h / 2;
    ctx.save();
    if (contextOnly) ctx.globalAlpha = 0.7;
    if (active) {
      ctx.globalAlpha = status.phase === "diagnosed" ? 0.34 + pulse * 0.24 : 0.2 + pulse * 0.18;
      ctx.fillStyle = status.phase === "diagnosed" ? "#ef7a67" : "#f3c763";
      ctx.beginPath(); ctx.arc(centerX, centerY, Math.max(issue.w, issue.h) * (0.65 + pulse * 0.12), 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.shadowColor = nearby || active ? "rgba(255, 246, 190, 0.95)" : "rgba(45, 30, 28, 0.2)";
    ctx.shadowBlur = nearby ? 20 : active ? 12 : 5;
    roundRect(issue.x, issue.y, issue.w, issue.h, 12);
    ctx.fillStyle = status.phase === "resolved" ? "#eaf3e3" : active ? "#fffaf0" : "#f4f0e9";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = status.phase === "resolved" ? "#78a268" : nearby || active ? "#f3c763" : "#aa9e94";
    ctx.lineWidth = nearby ? 5 : active ? 4 : 2;
    ctx.stroke();
    ctx.font = `${Math.min(34, issue.h * 0.48)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
    ctx.textAlign = "center";
    ctx.globalAlpha = status.phase === "queued" && !active ? 0.58 : 1;
    ctx.fillText(issue.icon, centerX, centerY + 10);
    ctx.globalAlpha = 1;
    ctx.font = "800 11px system-ui, sans-serif";
    ctx.fillStyle = "#4d3934";
    ctx.fillText(issue.label, centerX, issue.y + issue.h + 16);
    if (active) {
      const badgeY = issue.y - 17;
      ctx.fillStyle = status.phase === "diagnosed" ? "#b64f43" : "#e2a83a";
      ctx.beginPath(); ctx.arc(centerX, badgeY, 14 + pulse * 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fffaf1";
      ctx.font = "18px \"Apple Color Emoji\", \"Segoe UI Emoji\", sans-serif";
      const badge = status.phase === "diagnosed"
        ? issue.actionLabel === "대응" ? "☎️" : issue.actionLabel === "점검" ? "🔎" : "🛠️"
        : "👁️";
      ctx.fillText(badge, centerX, badgeY + 6);
      if (status.phase === "diagnosed") {
        for (let index = 0; index < REPAIR_STEPS; index += 1) {
          ctx.beginPath();
          ctx.arc(centerX - 8 + index * 16, issue.y + issue.h + 29, 5, 0, Math.PI * 2);
          ctx.fillStyle = index < status.repairStep ? "#4f8c63" : "#f0c3b8";
          ctx.fill();
          ctx.strokeStyle = "#753f36";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    }
    if (status.phase === "resolved") {
      ctx.fillStyle = "#4f8650";
      ctx.beginPath();
      ctx.arc(issue.x + issue.w - 4, issue.y + 4, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.fillText("✓", issue.x + issue.w - 4, issue.y + 9);
    }
    ctx.textAlign = "start";
    ctx.restore();
  }

  function drawDroplet(x, y, size, color = "#3e9fca", alpha = 1) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size * 0.85, y - size * 0.18, x + size * 0.7, y + size * 0.78, x, y + size);
    ctx.bezierCurveTo(x - size * 0.7, y + size * 0.78, x - size * 0.85, y - size * 0.18, x, y - size);
    ctx.fill();
    ctx.restore();
  }

  function drawCross(x, y, size, color = "#bd493f", alpha = 1) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(3, size * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - size, y - size); ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y - size); ctx.lineTo(x - size, y + size);
    ctx.stroke();
    ctx.restore();
  }

  function drawSparkle(x, y, size, color = "#fff1a8", alpha = 1) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(2, size * 0.22);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.moveTo(x - size * 0.58, y - size * 0.58); ctx.lineTo(x + size * 0.58, y + size * 0.58);
    ctx.moveTo(x + size * 0.58, y - size * 0.58); ctx.lineTo(x - size * 0.58, y + size * 0.58);
    ctx.stroke();
    ctx.restore();
  }

  function drawSnowflake(x, y, size, color = "rgba(242,251,255,0.85)") {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    for (let index = 0; index < 3; index += 1) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(-size, 0); ctx.lineTo(size, 0); ctx.stroke();
    }
    ctx.restore();
  }

  function drawImpactBurst(x, y, radius, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = `rgba(191, 62, 57, ${alpha})`;
    ctx.fillStyle = `rgba(237, 113, 72, ${alpha * 0.34})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let index = 0; index < 16; index += 1) {
      const angle = index * Math.PI / 8;
      const length = index % 2 ? radius * 0.52 : radius;
      const px = Math.cos(angle) * length;
      const py = Math.sin(angle) * length;
      if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function drawProblemEffect(issue, status, time) {
    const severity = effectStrength(issue);
    if (!severity) return;
    const x = issue.x + issue.w / 2;
    const y = issue.y + issue.h / 2;
    const wave = Math.sin(time * 0.007);
    const pulse = 0.5 + Math.sin(time * 0.009) * 0.5;
    ctx.save();
    ctx.globalAlpha = severity;
    ctx.lineWidth = 3.5;
    if (issue.id === "leak") {
      const puddleWidth = 38 + pulse * 17 * severity;
      ctx.fillStyle = "rgba(39, 144, 193, 0.5)";
      ctx.beginPath(); ctx.ellipse(x - 4, issue.y + issue.h + 30, puddleWidth, 12 + pulse * 2, 0, 0, Math.PI * 2); ctx.fill();
      for (let index = 0; index < (severity > 0.7 ? 3 : 1); index += 1) {
        const cycle = ((time * (0.00105 + index * 0.00017) + index * 0.34) % 1);
        const dropY = issue.y + issue.h * 0.52 + cycle * 52;
        drawDroplet(x - 7 + index * 8, dropY, 5 + index, "#309aca", 1 - Math.max(0, cycle - 0.82) / 0.18);
        if (cycle > 0.78) {
          ctx.strokeStyle = `rgba(143, 220, 239, ${(1 - cycle) * 4.5})`;
          ctx.beginPath(); ctx.ellipse(x - 7 + index * 8, issue.y + issue.h + 27, (cycle - 0.78) * 45, (cycle - 0.78) * 12, 0, 0, Math.PI * 2); ctx.stroke();
        }
      }
    } else if (issue.id === "toilet-clog") {
      const waterY = issue.y + issue.h * 0.58 + wave * 3;
      ctx.fillStyle = "rgba(48, 155, 199, 0.7)";
      ctx.beginPath(); ctx.ellipse(x, waterY, issue.w * 0.34, 10 + pulse * 3, 0, 0, Math.PI * 2); ctx.fill();
      const bubbles = severity > 0.7 ? 3 : 1;
      for (let index = 0; index < bubbles; index += 1) {
        const cycle = ((time * 0.0008 + index * 0.31) % 1);
        ctx.globalAlpha = severity * (1 - cycle);
        ctx.strokeStyle = "#9ee4f3";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x - 18 + index * 18, waterY - cycle * 26, 3 + cycle * 5, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = severity;
      if (status.phase === "diagnosed" && status.repairStep > 0) {
        const plungeY = waterY - 14 + Math.abs(wave) * 8;
        ctx.fillStyle = "#b84d40";
        ctx.beginPath(); ctx.ellipse(x, plungeY, 17, 8, 0, Math.PI, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#70493a"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(x, plungeY - 2); ctx.lineTo(x, plungeY - 35); ctx.stroke();
      }
    } else if (issue.id === "drain") {
      const waterY = issue.y + issue.h * 0.55;
      ctx.fillStyle = "rgba(57, 153, 190, 0.5)";
      ctx.beginPath(); ctx.ellipse(x, waterY, issue.w * 0.58, 19 + wave * 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(201, 242, 249, 0.82)";
      ctx.beginPath(); ctx.ellipse(x, waterY, issue.w * 0.45, 13, 0, 0, Math.PI * 2); ctx.stroke();
      const debris = severity > 0.7 ? 4 : 2;
      for (let index = 0; index < debris; index += 1) {
        const angle = time * 0.0013 + index * Math.PI * 2 / debris;
        ctx.fillStyle = index % 2 ? "#7d684f" : "#596b57";
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * 27, waterY + Math.sin(angle) * 9, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (issue.id === "water-supply") {
      const dropY = issue.y + issue.h + 18 + pulse * 5;
      drawDroplet(x, dropY, 10, "rgba(79, 158, 196, 0.3)");
      drawCross(x, dropY, 12 + pulse * 2, "#bf4f45");
      ctx.strokeStyle = "rgba(75, 132, 158, 0.8)";
      ctx.beginPath(); ctx.arc(x, issue.y + 8, 24, -2.7 + wave * 0.08, -0.42 + wave * 0.08); ctx.stroke();
    } else if (issue.id === "power-outage") {
      ctx.strokeStyle = `rgba(255, 210, 92, ${0.55 + pulse * 0.42})`;
      ctx.lineWidth = 4;
      for (const offset of [-15, 17]) {
        ctx.beginPath();
        ctx.moveTo(x + offset, y - 38);
        ctx.lineTo(x + offset * 0.45, y - 25);
        ctx.lineTo(x + offset * 0.85, y - 15);
        ctx.stroke();
      }
      drawCross(370, 466, 25, "rgba(219, 89, 70, 0.82)", 0.75 + pulse * 0.25);
    } else if (issue.id === "noise") {
      const impactPhase = (time * 0.0032) % 2;
      const impactY = impactPhase < 1 ? issue.y + 33 : issue.y + issue.h - 32;
      drawImpactBurst(x - 5, impactY, 19 + pulse * 8, 0.62 + pulse * 0.3);
      ctx.strokeStyle = "rgba(190, 64, 59, 0.78)";
      ctx.lineWidth = 4;
      for (let index = 0; index < 3; index += 1) {
        ctx.globalAlpha = severity * (0.85 - index * 0.17);
        ctx.beginPath();
        ctx.arc(x - 6, impactY, 30 + index * 18 + pulse * 5, Math.PI * 0.62, Math.PI * 1.38);
        ctx.stroke();
      }
    } else if (issue.id === "heating") {
      const thermometerX = issue.x + 16;
      const thermometerBottom = issue.y + issue.h - 9;
      ctx.strokeStyle = "rgba(46, 116, 161, 0.9)";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(thermometerX, thermometerBottom); ctx.lineTo(thermometerX, thermometerBottom - 17); ctx.stroke();
      drawSnowflake(x - 21, y - 42 + wave * 5, 8, "rgba(246, 253, 255, 0.95)");
      drawSnowflake(x + 13, y - 55 - wave * 4, 6, "rgba(246, 253, 255, 0.85)");
      if (roomForPoint(state.player.x, state.player.y)?.id === "bedroom") {
        const breath = ((time * 0.0011) % 1);
        ctx.globalAlpha = severity * (1 - breath);
        ctx.fillStyle = "rgba(238, 250, 255, 0.7)";
        ctx.beginPath();
        ctx.ellipse(state.player.x + state.player.w / 2 + 16 + breath * 18, state.player.y + 12 - breath * 6, 8 + breath * 7, 4 + breath * 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (issue.id === "smell") {
      ctx.fillStyle = "rgba(92, 78, 58, 0.86)";
      ctx.beginPath(); ctx.ellipse(issue.x + 13, issue.y + issue.h * 0.62, 8, 6, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(110, 132, 65, 0.85)";
      ctx.beginPath(); ctx.arc(issue.x + 27, issue.y + issue.h * 0.72, 6, 0, Math.PI * 2); ctx.fill();
      const trails = severity > 0.7 ? 3 : 1;
      for (let index = 0; index < trails; index += 1) {
        const offset = index * 17 - (trails - 1) * 8;
        const rise = ((time * 0.00065 + index * 0.34) % 1);
        ctx.globalAlpha = severity * (0.85 - rise * 0.55);
        ctx.strokeStyle = index % 2 ? "#7b6d91" : "#7f8451";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x + offset, y + 2 - rise * 18);
        ctx.bezierCurveTo(x - 15 + offset, y - 25 - rise * 28, x + 18 + offset, y - 45 - rise * 34, x + offset, y - 72 - rise * 40);
        ctx.stroke();
      }
    }
    if (incidentFx?.issueId === issue.id) {
      const arrival = fxProgress(incidentFx, time, 1150);
      if (arrival < 1) {
        ctx.globalAlpha = (1 - arrival) * 0.9;
        ctx.strokeStyle = "#ffd06f";
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(x, y, Math.max(issue.w, issue.h) * 0.65 + arrival * 70, 0, Math.PI * 2); ctx.stroke();
      } else incidentFx = null;
    }
    ctx.restore();
  }

  function drawResolutionEffect(time) {
    if (!resolutionFx) return;
    const issue = ISSUE_BY_ID.get(resolutionFx.issueId);
    if (!issue) { resolutionFx = null; return; }
    const progress = fxProgress(resolutionFx, time, 1350);
    if (progress >= 1) { resolutionFx = null; return; }
    const x = issue.x + issue.w / 2;
    const y = issue.y + issue.h / 2;
    const fade = 1 - progress;
    ctx.save();
    if (issue.id === "power-outage") {
      drawSparkle(370, 466, 12 + progress * 8, "#ffe49b", fade);
      drawSparkle(95, 513, 10 + progress * 7, "#b9edff", fade);
    } else if (issue.id === "water-supply") {
      ctx.strokeStyle = `rgba(45, 157, 204, ${fade})`;
      ctx.lineWidth = 9 - progress * 5;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, issue.y + issue.h * 0.58); ctx.lineTo(x, issue.y + issue.h + 38 * fade); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, issue.y + issue.h + 36, 28 * progress, 8 * progress, 0, 0, Math.PI * 2); ctx.stroke();
    } else if (issue.id === "drain") {
      ctx.strokeStyle = `rgba(48, 153, 194, ${fade})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 4; angle += 0.12) {
        const radius = (48 - angle * 3.1) * fade;
        const px = x + Math.cos(angle + progress * 9) * radius;
        const py = issue.y + issue.h * 0.55 + Math.sin(angle + progress * 9) * radius * 0.33;
        if (angle === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    } else if (issue.id === "toilet-clog") {
      ctx.fillStyle = `rgba(53, 157, 198, ${0.62 * fade})`;
      ctx.beginPath();
      ctx.ellipse(x, issue.y + issue.h * (0.58 + progress * 0.16), issue.w * 0.34 * fade, 12 * fade, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (issue.id === "leak") {
      ctx.fillStyle = `rgba(45, 149, 193, ${0.48 * fade})`;
      ctx.beginPath(); ctx.ellipse(x - 4 + progress * 34, issue.y + issue.h + 30, 48 * fade, 12 * fade, 0, 0, Math.PI * 2); ctx.fill();
    } else if (issue.id === "smell") {
      const sweepX = issue.x - 8 + progress * (issue.w + 16);
      ctx.strokeStyle = `rgba(235, 252, 255, ${0.9 * fade})`;
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(sweepX, issue.y + 8); ctx.lineTo(sweepX + 15, issue.y + issue.h - 8); ctx.stroke();
    } else if (issue.id === "heating") {
      const room = ROOMS.find((entry) => entry.id === "bedroom");
      const warmth = ctx.createLinearGradient(0, room.y + room.h, 0, room.y);
      warmth.addColorStop(0, `rgba(238, 143, 72, ${0.25 * fade})`);
      warmth.addColorStop(1, "rgba(238, 143, 72, 0)");
      ctx.fillStyle = warmth; ctx.fillRect(room.x, room.y, room.w, room.h);
      for (let index = 0; index < 3; index += 1) {
        ctx.strokeStyle = `rgba(213, 101, 60, ${fade * 0.7})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x - 20 + index * 20, issue.y - 2);
        ctx.bezierCurveTo(x - 32 + index * 20, issue.y - 18, x - 8 + index * 20, issue.y - 28, x - 18 + index * 20, issue.y - 45);
        ctx.stroke();
      }
    } else if (issue.id === "noise") {
      ctx.strokeStyle = `rgba(65, 147, 137, ${fade * 0.7})`;
      ctx.lineWidth = 4;
      for (let index = 0; index < 3; index += 1) {
        const radius = (48 + index * 18) * fade;
        ctx.beginPath(); ctx.arc(x, y, radius, Math.PI * 0.68, Math.PI * 1.32); ctx.stroke();
      }
    }
    ctx.globalAlpha = fade * 0.8;
    ctx.strokeStyle = "#62a878";
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, 24 + progress * 62, 0, Math.PI * 2); ctx.stroke();
    drawSparkle(x - 30, y - 24, 8 + progress * 4, "#eaffc5", fade);
    drawSparkle(x + 34, y + 12, 6 + progress * 5, "#fff4a7", fade);
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
    const portraitCanvas = ui.canvas.height > ui.canvas.width * 1.05;
    const desiredScale = playing ? (portraitCanvas ? 2.18 : isTouchDevice ? 1.32 : 1.24) : 1;
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
