const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
  gameShell: document.getElementById("gameShell"),
  heroPanel: document.getElementById("heroPanel"),
  heroToggle: document.getElementById("heroToggle"),
  heroDetails: document.getElementById("heroDetails"),
  fullscreenToggle: document.getElementById("fullscreenToggle"),
  tutorialReplay: document.getElementById("tutorialReplay"),
  controlModeToggle: document.getElementById("controlModeToggle"),
  startCard: document.getElementById("startCard"),
  fullscreenButton: document.getElementById("fullscreenButton"),
  fullscreenStatus: document.getElementById("fullscreenStatus"),
  startButton: document.getElementById("startButton"),
  continueButton: document.getElementById("continueButton"),
  resetButton: document.getElementById("resetButton"),
  voiceToggle: document.getElementById("voiceToggle"),
  saveSummary: document.getElementById("saveSummary"),
  controlModeSelector: document.getElementById("controlModeSelector"),
  promptBubble: document.getElementById("promptBubble"),
  toast: document.getElementById("toast"),
  dialogueBox: document.getElementById("dialogueBox"),
  dialogueSpeaker: document.getElementById("dialogueSpeaker"),
  dialogueText: document.getElementById("dialogueText"),
  dialogueNext: document.getElementById("dialogueNext"),
  dialogueClose: document.getElementById("dialogueClose"),
  miniGame: document.getElementById("miniGame"),
  miniGameType: document.getElementById("miniGameType"),
  miniGameTitle: document.getElementById("miniGameTitle"),
  miniGameInstruction: document.getElementById("miniGameInstruction"),
  miniGameClose: document.getElementById("miniGameClose"),
  activityCanvas: document.getElementById("activityCanvas"),
  activityGuide: document.getElementById("activityGuide"),
  activityObjectives: document.getElementById("activityObjectives"),
  activityHint: document.getElementById("activityHint"),
  quizCard: document.getElementById("quizCard"),
  quizType: document.getElementById("quizType"),
  quizTitle: document.getElementById("quizTitle"),
  quizPrompt: document.getElementById("quizPrompt"),
  quizExpression: document.getElementById("quizExpression"),
  quizAnswerInput: document.getElementById("quizAnswerInput"),
  quizChoiceBank: document.getElementById("quizChoiceBank"),
  quizFeedback: document.getElementById("quizFeedback"),
  quizSubmit: document.getElementById("quizSubmit"),
  quizReset: document.getElementById("quizReset"),
  quizClose: document.getElementById("quizClose"),
  storyTitle: document.getElementById("storyTitle"),
  storyBody: document.getElementById("storyBody"),
  storyProgressFill: document.getElementById("storyProgressFill"),
  storyProgressLabel: document.getElementById("storyProgressLabel"),
  storyPanel: document.getElementById("storyPanel"),
  storyToggle: document.getElementById("storyToggle"),
  storyToggleLabel: document.getElementById("storyToggleLabel"),
  statsPanel: document.getElementById("statsPanel"),
  statsToggle: document.getElementById("statsToggle"),
  statsToggleLabel: document.getElementById("statsToggleLabel"),
  timeOfDayValue: document.getElementById("timeOfDayValue"),
  timeOfDayDetail: document.getElementById("timeOfDayDetail"),
  timeProgressFill: document.getElementById("timeProgressFill"),
  journalToggle: document.getElementById("journalToggle"),
  journalToggleLabel: document.getElementById("journalToggleLabel"),
  journalDrawer: document.getElementById("journalDrawer"),
  journalClose: document.getElementById("journalClose"),
  journalBackdrop: document.getElementById("journalBackdrop"),
  warmthValue: document.getElementById("warmthValue"),
  miniMap: document.getElementById("miniMap"),
  basketList: document.getElementById("basketList"),
  saveStatus: document.getElementById("saveStatus"),
  storyList: document.getElementById("storyList"),
  nounsList: document.getElementById("nounsList"),
  verbsList: document.getElementById("verbsList"),
  taskList: document.getElementById("taskList"),
  moodList: document.getElementById("moodList"),
  listeningList: document.getElementById("listeningList"),
  endingCard: document.getElementById("endingCard"),
  endingTitle: document.getElementById("endingTitle"),
  endingBody: document.getElementById("endingBody"),
  endingTasks: document.getElementById("endingTasks"),
  endingWarmth: document.getElementById("endingWarmth"),
  endingQuizCount: document.getElementById("endingQuizCount"),
  endingExpressionSummary: document.getElementById("endingExpressionSummary"),
  endingReview: document.getElementById("endingReview"),
  endingRestart: document.getElementById("endingRestart"),
  endingContinue: document.getElementById("endingContinue"),
  controlTutorial: document.getElementById("controlTutorial"),
  tutorialStepLabel: document.getElementById("tutorialStepLabel"),
  tutorialTitle: document.getElementById("tutorialTitle"),
  tutorialBody: document.getElementById("tutorialBody"),
  tutorialStatus: document.getElementById("tutorialStatus"),
  tutorialNext: document.getElementById("tutorialNext"),
  tutorialSkip: document.getElementById("tutorialSkip"),
  tapTutorialTarget: document.getElementById("tapTutorialTarget"),
  portraitGate: document.getElementById("portraitGate"),
  portraitGateStatus: document.getElementById("portraitGateStatus"),
  portraitRetry: document.getElementById("portraitRetry"),
  portraitCancel: document.getElementById("portraitCancel"),
  touchAction: document.getElementById("touchAction"),
  touchActionLabel: document.getElementById("touchActionLabel"),
  touchActionHint: document.getElementById("touchActionHint"),
  touchJoystick: document.getElementById("touchJoystick"),
  touchStickKnob: document.getElementById("touchStickKnob")
};

const miniMapCtx = ui.miniMap.getContext("2d");
const activityCtx = ui.activityCanvas.getContext("2d");

const IMAGE_ASSET_ROOT = "assets/images";
const VEGETABLE_ASSETS = [
  `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-01-napa-cabbage.png`,
  `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-02-carrot.png`,
  `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-10-radish.png`,
  `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-12-lettuce.png`
];
const PLANTER_ASSETS = [
  `${IMAGE_ASSET_ROOT}/plants/plant-24-fern.png`,
  `${IMAGE_ASSET_ROOT}/plants/plant-12-pink-cosmos.png`,
  `${IMAGE_ASSET_ROOT}/plants/plant-13-lavender-sprig.png`,
  `${IMAGE_ASSET_ROOT}/plants/plant-10-yellow-daisy.png`
];
const TREE_ASSETS = [
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-01-oak-tree.png`,
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-02-maple-tree.png`,
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-03-pine-tree.png`,
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-04-cherry-blossom-tree.png`,
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-08-apple-tree.png`,
  `${IMAGE_ASSET_ROOT}/trees/medium-plant-09-silver-birch.png`
];
const PRODUCE_ASSETS = {
  apple: `${IMAGE_ASSET_ROOT}/produce/produce-fruit-01-red-apple.png`,
  pear: `${IMAGE_ASSET_ROOT}/produce/produce-fruit-03-pear.png`,
  strawberry: `${IMAGE_ASSET_ROOT}/produce/produce-fruit-04-strawberry.png`,
  watermelon: `${IMAGE_ASSET_ROOT}/produce/produce-fruit-08-watermelon-slice.png`,
  orange: `${IMAGE_ASSET_ROOT}/produce/produce-fruit-10-orange.png`
};
const LIVESTOCK_ASSETS = {
  cow: `${IMAGE_ASSET_ROOT}/livestock/farm-01-cow.png`,
  sheep: `${IMAGE_ASSET_ROOT}/livestock/farm-04-sheep.png`,
  pig: `${IMAGE_ASSET_ROOT}/livestock/farm-06-pig.png`,
  chick: `${IMAGE_ASSET_ROOT}/livestock/baby-04-chick.png`,
  kitten: `${IMAGE_ASSET_ROOT}/livestock/baby-02-kitten.png`
};
const BASKET_ITEM_ASSETS = {
  꽃단장: `${IMAGE_ASSET_ROOT}/plants/plant-12-pink-cosmos.png`,
  잔디결: `${IMAGE_ASSET_ROOT}/plants/plant-25-lawn-tuft.png`,
  모종상자: `${IMAGE_ASSET_ROOT}/plants/plant-24-fern.png`,
  "싱싱한 채소": `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-01-napa-cabbage.png`,
  "반듯한 고랑": `${IMAGE_ASSET_ROOT}/vegetables/produce-vegetable-02-carrot.png`,
  "달걀 꾸러미": `${IMAGE_ASSET_ROOT}/livestock/baby-04-chick.png`,
  "저녁 한 상": PRODUCE_ASSETS.apple
};
const imageAssetCache = new Map();

function loadGameImage(src) {
  if (!src) {
    return null;
  }
  if (imageAssetCache.has(src)) {
    return imageAssetCache.get(src);
  }
  const image = new Image();
  image.decoding = "async";
  const asset = {
    image,
    loaded: false,
    failed: false
  };
  image.onload = () => {
    asset.loaded = true;
  };
  image.onerror = () => {
    asset.failed = true;
  };
  image.src = src;
  imageAssetCache.set(src, asset);
  return asset;
}

function drawCenteredImageAssetOn(g, src, x, y, width, height, options = {}) {
  const asset = loadGameImage(src);
  if (!asset?.loaded || asset.failed) {
    return false;
  }
  g.save();
  g.translate(x, y);
  if (options.flipX) {
    g.scale(-1, 1);
  }
  g.globalAlpha *= options.alpha ?? 1;
  g.drawImage(asset.image, -width / 2, -height / 2, width, height);
  g.restore();
  return true;
}

function drawCenteredImageAsset(src, x, y, width, height, options = {}) {
  return drawCenteredImageAssetOn(ctx, src, x, y, width, height, options);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char] ?? char;
  });
}

function getBasketItemAsset(item) {
  if (BASKET_ITEM_ASSETS[item]) {
    return BASKET_ITEM_ASSETS[item];
  }
  if (item.includes("물고기")) {
    return "";
  }
  if (item.includes("채소")) {
    return BASKET_ITEM_ASSETS["싱싱한 채소"];
  }
  if (item.includes("모종")) {
    return BASKET_ITEM_ASSETS.모종상자;
  }
  if (item.includes("달걀") || item.includes("가축")) {
    return BASKET_ITEM_ASSETS["달걀 꾸러미"];
  }
  if (item.includes("잔디")) {
    return BASKET_ITEM_ASSETS.잔디결;
  }
  if (item.includes("저녁")) {
    return BASKET_ITEM_ASSETS["저녁 한 상"];
  }
  return "";
}

function renderBasketChip(item, isEmpty) {
  const asset = isEmpty ? "" : getBasketItemAsset(item);
  const imageMarkup = asset
    ? `<img class="basket-chip-icon" src="${escapeHtml(asset)}" alt="" aria-hidden="true">`
    : "";
  return `<span class="basket-chip ${isEmpty ? "is-empty" : ""}">${imageMarkup}<span>${escapeHtml(item)}</span></span>`;
}

const world = {
  width: 2000,
  height: 1400
};

const WORLD_CANVAS_BASE = { width: 960, height: 640 };
const ACTIVITY_CANVAS_BASE = { width: 640, height: 360 };
const MINIMAP_BASE_SIZE = 180;

const DEVICE_PROFILES = {
  desktop: {
    worldWidth: 960,
    worldHeight: 640,
    activityWidth: 640,
    activityHeight: 360,
    miniMapSize: 180,
    touchAssist: 0,
    activityAssist: 0,
    moveSpeedMultiplier: 1,
    activitySpeedMultiplier: 1,
    effectDensity: 1,
    prefersCompactHud: false,
    touchButtonSize: 62,
    touchActionWidth: 124,
    touchActionHeight: 72
  },
  tablet: {
    worldWidth: 960,
    worldHeight: 600,
    activityWidth: 640,
    activityHeight: 360,
    miniMapSize: 164,
    touchAssist: 16,
    activityAssist: 10,
    moveSpeedMultiplier: 1.02,
    activitySpeedMultiplier: 1.03,
    effectDensity: 0.92,
    prefersCompactHud: true,
    touchButtonSize: 66,
    touchActionWidth: 132,
    touchActionHeight: 76
  },
  "phone-high": {
    worldWidth: 840,
    worldHeight: 560,
    activityWidth: 640,
    activityHeight: 360,
    miniMapSize: 144,
    touchAssist: 28,
    activityAssist: 16,
    moveSpeedMultiplier: 1.06,
    activitySpeedMultiplier: 1.06,
    effectDensity: 0.8,
    prefersCompactHud: true,
    touchButtonSize: 54,
    touchActionWidth: 112,
    touchActionHeight: 62
  },
  "phone-low": {
    worldWidth: 760,
    worldHeight: 507,
    activityWidth: 640,
    activityHeight: 360,
    miniMapSize: 128,
    touchAssist: 34,
    activityAssist: 20,
    moveSpeedMultiplier: 1.08,
    activitySpeedMultiplier: 1.08,
    effectDensity: 0.66,
    prefersCompactHud: true,
    touchButtonSize: 52,
    touchActionWidth: 108,
    touchActionHeight: 60
  }
};

function getPortraitProfileOverrides(id, isTouch, isPortrait) {
  if (!isPortrait) {
    return {};
  }

  switch (id) {
    case "tablet":
      return {
        worldWidth: 780,
        worldHeight: 936,
        activityWidth: 640,
        activityHeight: 400,
        miniMapSize: 140,
        touchButtonSize: 62,
        touchActionWidth: 124,
        touchActionHeight: 70
      };
    case "phone-high":
      return {
        worldWidth: 720,
        worldHeight: 960,
        activityWidth: 640,
        activityHeight: 400,
        miniMapSize: 132,
        touchButtonSize: 52,
        touchActionWidth: 112,
        touchActionHeight: 62
      };
    case "phone-low":
      return {
        worldWidth: 660,
        worldHeight: 880,
        activityWidth: 640,
        activityHeight: 400,
        miniMapSize: 118,
        touchButtonSize: 50,
        touchActionWidth: 108,
        touchActionHeight: 60
      };
    default:
      return {};
  }
}

function detectDeviceProfile() {
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || WORLD_CANVAS_BASE.width;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || WORLD_CANVAS_BASE.height;
  const shortestSide = Math.min(viewportWidth, viewportHeight);
  const longestSide = Math.max(viewportWidth, viewportHeight);
  const pixelRatio = window.devicePixelRatio || 1;
  const hasTouchPoints = navigator.maxTouchPoints > 0;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const isTouch = coarsePointer || hasTouchPoints;
  const isPortrait = viewportHeight >= viewportWidth;
  const deviceMemory = navigator.deviceMemory ?? 6;

  let id = "desktop";
  if (shortestSide <= 480 && longestSide <= 1024) {
    id = shortestSide <= 390 || deviceMemory <= 4 ? "phone-low" : "phone-high";
  } else if (isTouch && (shortestSide <= 900 || longestSide <= 1366)) {
    id = "tablet";
  } else if (!isTouch && viewportWidth <= 980) {
    id = "tablet";
  }

  const portraitOverrides = getPortraitProfileOverrides(id, isTouch, isPortrait);
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  if (/^phone/.test(id) && isPortrait) {
    const resolvedTouchButtonSize = portraitOverrides.touchButtonSize ?? DEVICE_PROFILES[id].touchButtonSize;
    const resolvedTouchActionHeight = portraitOverrides.touchActionHeight ?? DEVICE_PROFILES[id].touchActionHeight;
    const touchUiReserve = isTouch
      ? Math.round(Math.max(resolvedTouchActionHeight, resolvedTouchButtonSize * 2.2) + 18)
      : 0;
    const gameplayHeight = Math.max(1, viewportHeight - 40 - touchUiReserve);
    const worldHeight = portraitOverrides.worldHeight ?? DEVICE_PROFILES[id].worldHeight;
    portraitOverrides.worldWidth = clamp(Math.round((worldHeight * viewportWidth) / gameplayHeight), 360, 720);
  }

  return {
    id,
    isTouch,
    isPortrait,
    viewportWidth,
    viewportHeight,
    pixelRatio,
    prefersReducedMotion,
    ...DEVICE_PROFILES[id],
    ...portraitOverrides
  };
}

const initialDeviceProfile = detectDeviceProfile();

const SAVE_KEY = "soil-village-save-v4";
const CONTROL_TUTORIAL_KEY = "soil-village-controls-tutorial-v1";
const CONTROL_TUTORIAL_MODES_KEY = "soil-village-controls-tutorial-v2";
const CONTROL_MODE_KEY = "soil-village-control-mode-v1";
const LEGACY_SAVE_KEYS = [
  "soil-village-improved-save-v1",
  "soil-village-graphics-improved-save-v1",
  "soil-village-save-v3"
];
const DAY_STAGE_LABELS = ["아침", "점심", "낮", "저녁", "밤"];
const DAY_STAGE_HINTS = [
  "풀잎에 이슬이 맺히고 새들이 먼저 움직이기 시작합니다.",
  "볕이 가장 밝아져 꽃과 벌레들이 분주하게 오갑니다.",
  "햇살이 무르익어 들판과 연못이 또렷하게 빛납니다.",
  "바람이 선선해지고 등불과 물가 움직임이 살아납니다.",
  "불빛과 반딧불이 도드라지고 밤 공기가 마을을 감쌉니다."
];
const DAY_ACTIVITY_HINTS = [
  "아침 공기 덕에 이슬과 새 움직임이 선명합니다.",
  "점심 볕 아래 꽃과 풀들이 가장 분주하게 반응합니다.",
  "낮에는 손이 가장 잘 붙어 들판 일이 시원하게 이어집니다.",
  "저녁이 되면 동물과 물가가 더 또렷하게 반응합니다.",
  "밤에는 등불 아래 물가와 반짝임이 도드라집니다."
];
const DAY_VISUAL_PROFILES = [
  { butterflyWake: 1.18, dragonflyWake: 0.74, birdWake: 1.16, chickenWake: 1.08, frogWake: 0.48, catWake: 0.92, flowerGlow: 0.24, dew: 0.72, lantern: 0, firefly: 0, lawnEase: 0.92, fieldEcho: 0.16, wateringAssist: 0.52, fishShore: 0.16, fishCalm: 0.94, feedGather: 1.16 },
  { butterflyWake: 1.04, dragonflyWake: 1.08, birdWake: 0.92, chickenWake: 0.98, frogWake: 0.4, catWake: 0.84, flowerGlow: 0.18, dew: 0.18, lantern: 0, firefly: 0, lawnEase: 1.08, fieldEcho: 0.26, wateringAssist: 0.18, fishShore: 0.08, fishCalm: 0.88, feedGather: 1 },
  { butterflyWake: 0.82, dragonflyWake: 1.22, birdWake: 0.68, chickenWake: 0.78, frogWake: 0.52, catWake: 0.48, flowerGlow: 0.14, dew: 0, lantern: 0.06, firefly: 0.04, lawnEase: 1.14, fieldEcho: 0.58, wateringAssist: 0.08, fishShore: 0.22, fishCalm: 0.96, feedGather: 0.82 },
  { butterflyWake: 0.38, dragonflyWake: 0.46, birdWake: 0.34, chickenWake: 0.52, frogWake: 1.08, catWake: 0.82, flowerGlow: 0.28, dew: 0, lantern: 0.62, firefly: 0.58, lawnEase: 0.92, fieldEcho: 0.34, wateringAssist: 0.22, fishShore: 0.64, fishCalm: 1.08, feedGather: 1.12 },
  { butterflyWake: 0.1, dragonflyWake: 0.08, birdWake: 0.08, chickenWake: 0.18, frogWake: 1.42, catWake: 0.3, flowerGlow: 0.74, dew: 0, lantern: 1, firefly: 1, lawnEase: 0.72, fieldEcho: 0.08, wateringAssist: 0.34, fishShore: 0.82, fishCalm: 1.16, feedGather: 0.56 }
];
const WORLD_LIGHT_PROFILES = [
  { x: -0.24, y: 0.34, length: 1.22, strength: 1 },
  { x: -0.06, y: 0.16, length: 0.92, strength: 0.92 },
  { x: 0.12, y: 0.2, length: 1.04, strength: 0.94 },
  { x: 0.34, y: 0.36, length: 1.34, strength: 0.9 },
  { x: -0.04, y: 0.12, length: 0.84, strength: 0.58 }
];
const DAY_CYCLE_DURATION = 240;

const dialogueAudioManifest = {
  busStop: ["./audio/bus-stop-1.mp3", "./audio/bus-stop-2.mp3"],
  pondChild: ["./audio/pond-child-1.mp3", "./audio/pond-child-2.mp3"],
  porchAuntMorning: ["./audio/porch-aunt-morning-1.mp3", "./audio/porch-aunt-morning-2.mp3"],
  porchAuntMidday: ["./audio/porch-aunt-midday-1.mp3", "./audio/porch-aunt-midday-2.mp3"],
  porchAuntEvening: ["./audio/porch-aunt-evening-1.mp3", "./audio/porch-aunt-evening-2.mp3"],
  porchAuntNight: ["./audio/porch-aunt-night-1.mp3", "./audio/porch-aunt-night-2.mp3"]
};

const dialogueAudioPlayer = new Audio();
dialogueAudioPlayer.preload = "none";

const sfxManifest = {
  uiClick: "./audio/sfx-ui-click.wav",
  uiStart: "./audio/sfx-ui-start.wav",
  dayChime: "./audio/sfx-day-chime.wav",
  taskComplete: "./audio/sfx-task-complete.wav",
  equipTool: "./audio/sfx-equip-tool.wav",
  shearsTrim: "./audio/sfx-shears-trim.wav",
  mowerPass: "./audio/sfx-mower-pass.wav",
  plantPop: "./audio/sfx-plant-pop.wav",
  waterPour: "./audio/sfx-water-pour.wav",
  hoeDig: "./audio/sfx-hoe-dig.wav",
  feedPour: "./audio/sfx-feed-pour.wav",
  fishCast: "./audio/sfx-fish-cast.wav",
  fishHook: "./audio/sfx-fish-hook.wav",
  basketDrop: "./audio/sfx-basket-drop.wav",
  natureRustle: "./audio/sfx-nature-rustle.wav",
  natureShimmer: "./audio/sfx-nature-shimmer.wav",
  birdFlutter: "./audio/sfx-bird-flutter.wav"
};

const sfxDefaults = {
  uiClick: { volume: 0.34, poolSize: 3 },
  uiStart: { volume: 0.56, poolSize: 2 },
  dayChime: { volume: 0.38, poolSize: 2 },
  taskComplete: { volume: 0.62, poolSize: 2 },
  equipTool: { volume: 0.48, poolSize: 4, cooldownMs: 60 },
  shearsTrim: { volume: 0.5, poolSize: 4, cooldownMs: 70 },
  mowerPass: { volume: 0.34, poolSize: 4, cooldownMs: 150 },
  plantPop: { volume: 0.46, poolSize: 4, cooldownMs: 80 },
  waterPour: { volume: 0.46, poolSize: 4, cooldownMs: 120 },
  hoeDig: { volume: 0.48, poolSize: 4, cooldownMs: 110 },
  feedPour: { volume: 0.52, poolSize: 4, cooldownMs: 90 },
  fishCast: { volume: 0.42, poolSize: 3, cooldownMs: 120 },
  fishHook: { volume: 0.56, poolSize: 3, cooldownMs: 120 },
  basketDrop: { volume: 0.54, poolSize: 3, cooldownMs: 100 },
  natureRustle: { volume: 0.34, poolSize: 4, cooldownMs: 120 },
  natureShimmer: { volume: 0.28, poolSize: 3, cooldownMs: 160 },
  birdFlutter: { volume: 0.38, poolSize: 3, cooldownMs: 140 }
};

const sfxPools = new Map();
const activeSfxPlayers = new Set();
const sfxCooldowns = new Map();

const nounWords = [
  { id: "garden", label: "정원", hint: "집 주변의 작은 뜰" },
  { id: "grass", label: "잔디", hint: "땅에 낮게 나는 풀" },
  { id: "vegetable", label: "채소", hint: "밭에서 길러 먹는 식물" },
  { id: "farming", label: "농사", hint: "밭에서 작물을 기르는 일" },
  { id: "livestock", label: "가축", hint: "집에서 기르는 동물" },
  { id: "fish", label: "물고기", hint: "물에서 사는 동물" }
];

const verbWords = [
  { id: "care", label: "가꾸다", hint: "보기 좋게 손질하고 돌보다" },
  { id: "trim", label: "깎다", hint: "풀이나 털을 짧게 자르다" },
  { id: "plant", label: "심다", hint: "씨나 모종을 땅에 넣다" },
  { id: "raise", label: "키우다", hint: "자라게 하다" },
  { id: "farm", label: "짓다", hint: "농사를 하다" },
  { id: "catch", label: "잡다", hint: "붙들거나 낚아채다" }
];

const collocations = [
  {
    id: "gardenCare",
    label: "정원을 가꾸다",
    hint: "꽃과 울타리를 손질하며 집 앞 뜰을 돌본다.",
    nounId: "garden",
    verbId: "care"
  },
  {
    id: "lawnTrim",
    label: "잔디를 깎다",
    hint: "마당의 풀을 짧게 정리해 길을 환하게 만든다.",
    nounId: "grass",
    verbId: "trim"
  },
  {
    id: "vegetablePlant",
    label: "채소를 심다",
    hint: "빈 고랑에 모종을 넣고 흙을 덮는다.",
    nounId: "vegetable",
    verbId: "plant"
  },
  {
    id: "vegetableGrow",
    label: "채소를 키우다",
    hint: "심은 모종에 물을 주고 자라도록 돌본다.",
    nounId: "vegetable",
    verbId: "raise"
  },
  {
    id: "farmWork",
    label: "농사를 짓다",
    hint: "밭고랑을 다지고 하루 농사 흐름을 익힌다.",
    nounId: "farming",
    verbId: "farm"
  },
  {
    id: "raiseLivestock",
    label: "가축을 키우다",
    hint: "외양간의 동물에게 사료를 나누어 준다.",
    nounId: "livestock",
    verbId: "raise"
  },
  {
    id: "catchFish",
    label: "물고기를 잡다",
    hint: "연못의 움직임을 보고 타이밍을 맞춘다.",
    nounId: "fish",
    verbId: "catch"
  }
];

const taskRewards = {
  gardenCare: "꽃단장",
  lawnTrim: "잔디향",
  vegetablePlant: "모종상자",
  vegetableGrow: "싱싱한 채소",
  farmWork: "반듯한 고랑",
  raiseLivestock: "달걀 꾸러미",
  catchFish: "은빛 물고기"
};

const moodExpressions = [
  {
    id: "peaceful",
    label: "평화롭다",
    hint: "마을 끝 언덕에 서면 소리보다 바람이 먼저 들린다."
  },
  {
    id: "cleanAir",
    label: "공기가 맑다",
    hint: "아침 햇살 아래 들판을 지나면 숨이 가볍게 느껴진다."
  },
  {
    id: "relaxed",
    label: "여유가 있다",
    hint: "잠깐 벤치에 앉아도 시간이 조급하게 흐르지 않는다."
  },
  {
    id: "loseTrack",
    label: "시간 가는 줄 모르다",
    hint: "몇 가지 일을 끝내고 나면 어느새 해가 기울어 있다."
  },
  {
    id: "inconvenient",
    label: "불편하다",
    hint: "비 온 뒤 흙길이 질퍽해져 걷는 속도가 늦어진다."
  },
  {
    id: "boring",
    label: "따분하다",
    hint: "누군가에겐 한적함이 따분하게 느껴질 수도 있다."
  }
];

const listeningExpressions = [
  {
    id: "weekendFarm",
    label: "주말농장",
    hint: "이번 주말에는 주말농장에서 손이 바빠질 거야."
  },
  {
    id: "goCountryside",
    label: "시골에 내려가다",
    hint: "도시를 떠나 시골에 내려가면 하루 리듬이 달라진다."
  },
  {
    id: "growDirectly",
    label: "직접 채소를 키우다",
    hint: "직접 채소를 키우면 기다리는 시간도 즐겁다."
  },
  {
    id: "firstFarm",
    label: "처음 농사를 짓다",
    hint: "처음 농사를 짓는 날이라 작은 일부터 차근차근 한다."
  }
];

const storySteps = [
  {
    id: "meetAunt",
    title: "이모를 만나 오늘 일을 듣기",
    body: "버스 정류장에서 이모와 이야기하며 시골 첫날의 흐름을 잡으세요.",
    targetZoneIds: ["busStop", "noticeBoard"],
    check: (state) => state.flags.has("talkedAunt"),
    reward: 8,
    toastTitle: "첫 부탁",
    toastBody: "이모에게 오늘의 동선을 들었습니다."
  },
  {
    id: "morningCleanup",
    title: "정원을 가꾸고 잔디를 깎기",
    body: "집 앞 정원을 가꾸고 공터의 잔디를 깎아 마을의 첫인상을 환하게 만드세요.",
    targetZoneIds: ["gardenCare", "lawnTrim", "noticeBoard"],
    check: (state) => state.completedTasks.has("gardenCare") && state.completedTasks.has("lawnTrim"),
    reward: 14,
    toastTitle: "아침 마당 완료",
    toastBody: "집 앞 풍경이 정돈되며 하루가 제대로 시작됩니다."
  },
  {
    id: "middayFields",
    title: "채소를 심고 농사를 짓기",
    body: "채소 밭에 모종을 심고 큰 밭에서 농사를 지으며 한낮의 흐름을 만드세요.",
    targetZoneIds: ["vegetablePlant", "farmWork", "noticeBoard"],
    check: (state) => state.completedTasks.has("vegetablePlant") && state.completedTasks.has("farmWork"),
    reward: 16,
    toastTitle: "한낮의 밭일",
    toastBody: "땅의 리듬이 잡히며 다음 손길을 받을 준비가 됩니다."
  },
  {
    id: "restAndGrow",
    title: "쉬었다가 채소에 물 주기",
    body: "벤치에 잠깐 앉아 숨을 고른 뒤 밭으로 돌아가 채소를 키우세요.",
    targetZoneIds: ["bench", "vegetableGrow", "noticeBoard"],
    check: (state) => state.flags.has("benchRest") && state.completedTasks.has("vegetableGrow"),
    reward: 12,
    toastTitle: "느긋한 돌봄",
    toastBody: "쉬는 시간까지 포함되어야 시골의 하루가 완성됩니다."
  },
  {
    id: "eveningErrands",
    title: "가축을 키우고 물고기를 잡기",
    body: "가축을 키우고 물고기를 잡은 뒤, 연못가 아이의 이야기도 들어 보세요.",
    targetZoneIds: ["raiseLivestock", "catchFish", "pondChild", "noticeBoard"],
    check: (state) =>
      state.completedTasks.has("raiseLivestock") &&
      state.completedTasks.has("catchFish") &&
      state.flags.has("talkedChild"),
    reward: 18,
    toastTitle: "오후 심부름 완료",
    toastBody: "이제 오늘 모은 것들로 집 앞 저녁상을 차릴 시간입니다."
  },
  {
    id: "sunsetClosing",
    title: "저녁상을 차리고 언덕에서 하루 마무리",
    body: "집 앞 식탁에 오늘 모은 재료를 올리고, 언덕에서 노을 진 마을을 바라보세요.",
    targetZoneIds: ["dinnerTable", "lookout", "noticeBoard"],
    check: (state) => state.flags.has("dinnerServed") && state.flags.has("lookoutSeen"),
    reward: 24,
    toastTitle: "하루가 무르익다",
    toastBody: "일, 대화, 풍경이 하나로 이어지며 하루가 저녁빛 속에 정리됩니다."
  }
];

const zoneDefinitions = [
  {
    id: "busStop",
    type: "dialogue",
    label: "버스 정류장",
    prompt: "E - 이모와 이야기한다",
    x: 220,
    y: 1180,
    radius: 88,
    speaker: "이모",
    lines: [
      "시골에 내려가자마자 흙냄새가 반기네. 이번 주말은 네 첫 주말농장이라고 생각하면 돼.",
      "처음 농사를 짓는 날이니까 정원부터 밭, 연못까지 천천히 한 바퀴 돌아보자. 직접 채소를 키우는 재미도 오늘 알게 될 거야."
    ],
    unlockListening: ["goCountryside", "weekendFarm", "firstFarm", "growDirectly"]
  },
  {
    id: "gardenCare",
    type: "task",
    label: "집 앞 정원",
    prompt: "E - 정원을 가꾼다",
    x: 375,
    y: 336,
    radius: 92,
    taskId: "gardenCare",
    afterText: "꽃과 울타리를 다듬고 나니 집 앞이 훨씬 반듯해졌다."
  },
  {
    id: "noticeBoard",
    type: "story",
    label: "할 일판",
    prompt: "E - 오늘의 부탁을 확인한다",
    x: 330,
    y: 1040,
    radius: 84
  },
  {
    id: "lawnTrim",
    type: "task",
    label: "공터 잔디",
    prompt: "E - 잔디를 깎는다",
    x: 785,
    y: 258,
    radius: 95,
    taskId: "lawnTrim",
    afterText: "풀이 낮아지자 공터가 훤하게 열렸다."
  },
  {
    id: "vegetablePlant",
    type: "task",
    label: "채소 밭",
    prompt: "E - 채소를 심는다",
    x: 1095,
    y: 544,
    radius: 108,
    taskId: "vegetablePlant",
    afterText: "모종이 고랑마다 자리를 잡았다."
  },
  {
    id: "vegetableGrow",
    type: "task",
    label: "채소 밭",
    prompt: "E - 채소를 키운다",
    x: 1168,
    y: 612,
    radius: 102,
    taskId: "vegetableGrow",
    requires: (state) => state.completedTasks.has("vegetablePlant") && state.flags.has("benchRest"),
    hiddenUntilAvailable: true,
    afterText: "물을 머금은 모종이 한층 싱싱해 보인다."
  },
  {
    id: "farmWork",
    type: "task",
    label: "큰 밭",
    prompt: "E - 농사를 짓는다",
    x: 638,
    y: 930,
    radius: 115,
    taskId: "farmWork",
    afterText: "고랑을 다지고 흙을 뒤집으니 하루 농사의 중심이 잡힌다."
  },
  {
    id: "raiseLivestock",
    type: "task",
    label: "외양간",
    prompt: "E - 가축을 키운다",
    x: 1498,
    y: 462,
    radius: 98,
    taskId: "raiseLivestock",
    afterText: "사료통이 채워지자 소와 돼지, 양이 금세 가까이 다가온다."
  },
  {
    id: "catchFish",
    type: "task",
    label: "연못",
    prompt: "E - 물고기를 잡는다",
    x: 1446,
    y: 1004,
    radius: 106,
    taskId: "catchFish",
    afterText: "건져 올린 물고기를 바구니에 담고 나니 연못가 손끝에 물기가 남았다."
  },
  {
    id: "bench",
    type: "mood",
    label: "벤치",
    prompt: "E - 잠깐 앉아 쉰다",
    x: 1038,
    y: 206,
    radius: 80,
    onInteract: (state) => {
      state.flags.add("benchRest");
      advanceDayCycleForAction(28, "벤치에 앉아 숨을 고르는 사이");
      maybeUnlockMood("relaxed");
      startWorldExpressionMoment(
        "relaxed",
        "여유가 있다",
        "잠깐 멈춰도 재촉하는 소리가 없습니다. 바람과 그늘 사이로 하루가 느긋하게 흐릅니다."
      );
      showToast("여유가 있다", "잠깐 쉬어도 하루가 조급하지 않게 흐릅니다.");
    }
  },
  {
    id: "dinnerTable",
    type: "delivery",
    label: "집 앞 식탁",
    prompt: "E - 오늘의 저녁상을 차린다",
    x: 542,
    y: 500,
    radius: 86,
    requires: (state) => state.storyIndex >= 5,
    hiddenUntilAvailable: true
  },
  {
    id: "porchAunt",
    type: "dialogue",
    label: "마당의 이모",
    prompt: "E - 이모와 잠깐 이야기한다",
    x: 452,
    y: 476,
    radius: 80,
    requires: (state) => state.storyIndex >= 2,
    getDialogue: (state) => {
      if (state.dayStage === 4) {
        return {
          speaker: "이모",
          audioId: "porchAuntNight",
          visitFlag: "talkedPorchAuntNight",
          lines: [
            "밤이 되면 시골은 더 조용해지지. 대신 반딧불이랑 개구리 소리가 더 잘 들려.",
            "조금만 더 걸어 보면 낮에 봤던 마을이랑 또 다른 얼굴처럼 느껴질 거야."
          ]
        };
      }

      if (state.dayStage >= 3 || state.storyIndex >= 5) {
        return {
          speaker: "이모",
          audioId: "porchAuntEvening",
          visitFlag: "talkedPorchAuntEvening",
          lines: [
            "바구니가 묵직하네. 오늘은 정말 시골에 내려온 하루답게 보냈구나.",
            "저녁상을 차리고 언덕에서 노을을 보면, 왜 이 동네가 평화롭다고 하는지 알게 될 거야."
          ]
        };
      }

      if (state.dayStage === 0) {
        return {
          speaker: "이모",
          audioId: "porchAuntMorning",
          visitFlag: "talkedPorchAuntMorning",
          lines: [
            "아침 공기는 다르지? 마당이 아직 축축해서 꽃잎 끝에 이슬이 맺혀 있단다.",
            "해가 더 올라오기 전에 정원 쪽부터 천천히 둘러보면 하루가 훨씬 길게 느껴질 거야."
          ]
        };
      }

      return {
        speaker: "이모",
        audioId: "porchAuntMidday",
        visitFlag: "talkedPorchAuntMidday",
        lines: [
          "마당이 조금씩 살아나는구나. 이런 날은 일하다 보면 시간 가는 줄 모르지.",
          "급하게 다 하려 하지 말고, 쉬었다가 다시 손을 대면 채소도 더 잘 큰단다."
        ]
      };
    }
  },
  {
    id: "lookout",
    type: "mood",
    label: "언덕",
    prompt: "E - 마을을 내려다본다",
    x: 1730,
    y: 194,
    radius: 92,
    onInteract: () => {
      state.flags.add("lookoutSeen");
      maybeUnlockMood("peaceful");
      if (state.completedTasks.size >= 4) {
        maybeUnlockMood("loseTrack");
      }
      startWorldExpressionMoment(
        "peaceful",
        "평화롭다",
        "멀리서 들리는 트랙터 소리도 바람 속으로 잦아들고, 마을 전체가 고요하게 이어집니다."
      );
      showToast("평화롭다", "멀리서 트랙터 소리만 희미하게 들릴 만큼 마을이 고요합니다.");
    }
  },
  {
    id: "pondChild",
    type: "dialogue",
    label: "동네 아이",
    prompt: "E - 아이와 이야기한다",
    x: 1390,
    y: 896,
    radius: 84,
    speaker: "동네 아이",
    lines: [
      "도시에 사는 사촌은 시골이 따분하다고 했지만, 나는 연못만 가도 하루가 금방 지나.",
      "물가에 오래 있으면 공기가 맑다는 말을 왜 하는지 바로 알 수 있어."
    ],
    unlockMood: ["boring", "cleanAir"]
  }
];

const quizSignDefinitions = [
  {
    id: "quiz-gardenCare",
    taskId: "gardenCare",
    x: 536,
    y: 384,
    radius: 58,
    label: "정원 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "정원을 가꾸다",
    prefix: "정원을",
    answer: "가꾸다",
    choicePool: ["심", "키", "우", "깎", "잡"],
    followerId: "chick"
  },
  {
    id: "quiz-lawnTrim",
    taskId: "lawnTrim",
    x: 916,
    y: 334,
    radius: 58,
    label: "잔디 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "잔디를 깎다",
    prefix: "잔디를",
    answer: "깎다",
    choicePool: ["심", "키", "우", "잡", "짓"],
    followerId: "bunny"
  },
  {
    id: "quiz-vegetablePlant",
    taskId: "vegetablePlant",
    x: 1034,
    y: 756,
    radius: 58,
    label: "모종 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "채소를 심다",
    prefix: "채소를",
    answer: "심다",
    choicePool: ["가", "꾸", "키", "우", "깎", "잡"],
    followerId: "duck"
  },
  {
    id: "quiz-vegetableGrow",
    taskId: "vegetableGrow",
    x: 1196,
    y: 756,
    radius: 58,
    label: "물주기 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "채소를 키우다",
    prefix: "채소를",
    answer: "키우다",
    choicePool: ["심", "가", "꾸", "깎", "잡"],
    followerId: "cat"
  },
  {
    id: "quiz-farmWork",
    taskId: "farmWork",
    x: 700,
    y: 1072,
    radius: 58,
    label: "밭일 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "농사를 짓다",
    prefix: "농사를",
    answer: "짓다",
    choicePool: ["심", "키", "우", "잡", "깎"],
    followerId: "lamb"
  },
  {
    id: "quiz-raiseLivestock",
    taskId: "raiseLivestock",
    x: 1412,
    y: 566,
    radius: 58,
    label: "외양간 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "가축을 키우다",
    prefix: "가축을",
    answer: "키우다",
    choicePool: ["심", "가", "꾸", "깎", "잡"],
    followerId: "puppy"
  },
  {
    id: "quiz-catchFish",
    taskId: "catchFish",
    x: 1360,
    y: 1120,
    radius: 58,
    label: "연못 팻말",
    prompt: "E - 팻말 퀴즈 풀기",
    expression: "물고기를 잡다",
    prefix: "물고기를",
    answer: "잡다",
    choicePool: ["심", "키", "우", "깎", "짓"],
    followerId: "frog"
  }
];

const followerDefinitions = {
  chick: { label: "병아리", palette: ["#f6e48d", "#f2cf5b", "#e08a45"], shape: "chick", asset: `${IMAGE_ASSET_ROOT}/followers/baby-04-chick.png`, assetScale: 1.08 },
  bunny: { label: "토끼", palette: ["#f7efe6", "#e5d4c4", "#d97f56"], shape: "bunny", asset: `${IMAGE_ASSET_ROOT}/followers/baby-03-bunny.png`, assetScale: 1.08 },
  duck: { label: "오리", palette: ["#f7f0b9", "#f1d45f", "#e58f4e"], shape: "duck", asset: `${IMAGE_ASSET_ROOT}/followers/baby-05-duckling.png`, assetScale: 1.08 },
  cat: { label: "고양이", palette: ["#f1dac6", "#d6b18b", "#7b6047"], shape: "cat", asset: `${IMAGE_ASSET_ROOT}/followers/baby-02-kitten.png`, assetScale: 1.1 },
  lamb: { label: "양", palette: ["#fcf7ef", "#e8ddcf", "#8d765e"], shape: "lamb", asset: `${IMAGE_ASSET_ROOT}/followers/baby-08-lamb.png`, assetScale: 1.1 },
  puppy: { label: "강아지", palette: ["#f0dfc3", "#c89d73", "#6f543f"], shape: "puppy", asset: "", assetScale: 1.1 },
  frog: { label: "개구리", palette: ["#b5dd83", "#78b15a", "#f5f1df"], shape: "frog", asset: `${IMAGE_ASSET_ROOT}/followers/baby-25-froglet.png`, assetScale: 1.04 }
};

const followerOrder = quizSignDefinitions.map((entry) => entry.followerId);

const followerFormation = [
  { back: 26, side: 0 },
  { back: 40, side: -18 },
  { back: 40, side: 18 },
  { back: 56, side: -26 },
  { back: 56, side: 26 },
  { back: 72, side: -12 },
  { back: 72, side: 12 }
];

const obstacles = [
  { x: 250, y: 140, w: 240, h: 210 },
  { x: 1380, y: 340, w: 230, h: 170 },
  { x: 1466, y: 918, w: 222, h: 176 },
  { x: 1680, y: 120, w: 150, h: 120 }
];

const slowZones = [
  {
    id: "largeField",
    x: 520,
    y: 820,
    w: 330,
    h: 220,
    expression: "불편하다",
    detail: "큰 밭의 젖은 흙이 신발을 붙잡아 걸음이 무거워집니다. 고랑 사이를 평소보다 천천히 지나갑니다.",
    toast: "큰 밭의 젖은 흙에서는 발이 조금씩 빠집니다."
  }
];

function createFollowerState(ids = []) {
  return ids
    .filter((id) => followerDefinitions[id])
    .map((id, index) => ({
      id,
      x: 245 - (index + 1) * 18,
      y: 1138 + index * 6,
      bob: randomRange(0, Math.PI * 2),
      step: randomRange(0, Math.PI * 2),
      blink: randomRange(0, Math.PI * 2),
      hop: 0
    }));
}

function createQuizAssemblyState(choices = [], selection = []) {
  return {
    choices: [...choices],
    selection: [...selection]
  };
}

function createAutoNavigationState() {
  return {
    active: false,
    scope: null,
    waypoints: [],
    waypointIndex: 0,
    destination: null,
    targetType: null,
    targetId: null,
    targetLabel: "",
    autoInteract: false,
    traversal: null,
    actionCooldown: 0,
    actionAttempts: 0,
    stuckTimer: 0,
    lastDistance: Infinity
  };
}

const state = {
  started: false,
  voiceEnabled: true,
  controlMode: "joystick",
  device: initialDeviceProfile,
  uiFrame: {
    miniMapLastRender: -Infinity,
    miniGameUiSignature: "",
    timeHudSignature: "",
    promptSignature: "",
    touchActionSignature: ""
  },
  keys: new Set(),
  touchKeys: new Set(),
  touchStick: {
    active: false,
    pointerId: null,
    x: 0,
    y: 0,
    magnitude: 0
  },
  interactQueued: false,
  autoNavigation: createAutoNavigationState(),
  player: { x: 245, y: 1110, r: 16, speed: 232, facing: "down", step: 0 },
  camera: { x: 0, y: 0, targetX: 0, targetY: 0 },
  hoveredZone: null,
  hoveredPractice: null,
  activeDialogue: null,
  dialogueIndex: 0,
  activeMiniGame: null,
  pausedActivity: null,
  activeQuiz: null,
  quizAssembly: createQuizAssemblyState(),
  storyIndex: 0,
  warmth: 0,
  basket: [],
  completedTasks: new Set(),
  solvedQuizSigns: new Set(),
  unlockedFollowers: new Set(),
  followers: createFollowerState(),
  unlockedNouns: new Set(),
  unlockedVerbs: new Set(),
  unlockedMood: new Set(),
  unlockedListening: new Set(),
  flags: new Set(),
  uiPanels: {
    heroExpanded: false,
    storyOpen: false,
    statsOpen: false,
    journalOpen: false
  },
  toastTimer: 0,
  expressionMoment: null,
  activeSlowZoneId: null,
  dayCycle: 0,
  dayCount: 1,
  dayStage: 0,
  endingShown: false,
  pendingEnding: false,
  controlTutorial: {
    open: false,
    step: 0,
    pendingLaunch: null,
    fallbackMessage: ""
  },
  portraitModeRequested: false,
  portraitGate: {
    open: false,
    pendingLaunch: null,
    fullscreenMessage: "",
    reason: ""
  },
  lastFocusedElement: null,
  saveMessage: "저장되지 않음",
  worldPractice: createWorldPracticeState(),
  ambient: createAmbientState(),
  lastTimestamp: 0,
  frameAccumulator: 0
};

const tutorialBackgroundTabIndexes = new Map();

const cloudAnchors = [
  { x: 180, y: 110, scale: 1.1, speed: 0.7 },
  { x: 720, y: 84, scale: 0.9, speed: 0.52 },
  { x: 1340, y: 146, scale: 1.25, speed: 0.62 },
  { x: 1710, y: 98, scale: 0.82, speed: 0.44 }
];

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function createWorldPracticeCells(x1, y, width, count) {
  return {
    x1,
    y,
    w: width,
    cells: Array.from({ length: count }, () => 0),
    reaction: 0
  };
}

function createWorldPracticeFish(baseX, baseY, seed) {
  return {
    baseX,
    baseY,
    x: baseX,
    y: baseY,
    vx: 0,
    vy: 0,
    panic: 0,
    caught: false,
    respawn: 0,
    seed
  };
}

function createNatureBush(x, y, options = {}) {
  return {
    x,
    y,
    label: options.label ?? "수풀",
    scale: options.scale ?? 1,
    baseColor: options.baseColor ?? "#5f8d4d",
    accentColor: options.accentColor ?? "#7fb067",
    blossomColor: options.blossomColor ?? "#f7d6e0",
    berryColor: options.berryColor ?? "#d66f63",
    asset: options.asset ?? `${IMAGE_ASSET_ROOT}/plants/plant-23-leaf-bush.png`,
    cooldown: 0,
    shake: 0,
    brush: 0,
    glow: 0,
    dropTimer: 0,
    visitorTimer: 0,
    visitorType: "none",
    sway: randomRange(0, Math.PI * 2),
    readyPhase: randomRange(0, Math.PI * 2),
    lastReaction: -1,
    interactionCount: 0
  };
}

function createNatureFlowerPatch(x, y, options = {}) {
  return {
    x,
    y,
    label: options.label ?? "꽃무리",
    scale: options.scale ?? 1,
    palette: options.palette ?? ["#f1b56b", "#f7d6e0", "#f4f0d0"],
    stemColor: options.stemColor ?? "#6c9158",
    asset: options.asset ?? `${IMAGE_ASSET_ROOT}/plants/plant-10-yellow-daisy.png`,
    cooldown: 0,
    shake: 0,
    brush: 0,
    glow: 0,
    dropTimer: 0,
    visitorTimer: 0,
    visitorType: "none",
    sway: randomRange(0, Math.PI * 2),
    readyPhase: randomRange(0, Math.PI * 2),
    lastReaction: -1,
    interactionCount: 0
  };
}

function createNatureTree(x, y, options = {}) {
  return {
    x,
    y,
    label: options.label ?? "나무",
    size: options.size ?? 26,
    trunkHeight: options.trunkHeight ?? 26,
    variant: options.variant ?? 0,
    palette:
      options.palette ?? {
        base: "#5c8d4c",
        accent: "#7fb067",
        trunk: "#7a5637"
      },
    asset: options.asset ?? TREE_ASSETS[(options.assetIndex ?? options.variant ?? 0) % TREE_ASSETS.length],
    fruitAsset: options.fruitAsset ?? PRODUCE_ASSETS.apple,
    fruitColor: options.fruitColor ?? "#e7b564",
    cooldown: 0,
    shake: 0,
    brush: 0,
    glow: 0,
    dropTimer: 0,
    visitorTimer: 0,
    visitorType: "none",
    sway: randomRange(0, Math.PI * 2),
    readyPhase: randomRange(0, Math.PI * 2),
    lastReaction: -1,
    interactionCount: 0
  };
}

function createWorldPracticeState() {
  return {
    carriedTool: null,
    toolCharges: 0,
    carryingCatch: false,
    actionPose: 0,
    feedback: "",
    feedbackTimer: 0,
    garden: {
      source: { x: 276, y: 396 },
      shrubs: [
        { x: 316, y: 402, trim: 0, shake: 0, resetTimer: 0 },
        { x: 372, y: 416, trim: 0, shake: 0, resetTimer: 0 },
        { x: 430, y: 404, trim: 0, shake: 0, resetTimer: 0 },
        { x: 488, y: 418, trim: 0, shake: 0, resetTimer: 0 },
        { x: 548, y: 402, trim: 0, shake: 0, resetTimer: 0 }
      ],
      topiaries: [
        { x: 606, y: 436, trim: 0, shake: 0, resetTimer: 0 },
        { x: 346, y: 916, trim: 0, shake: 0, resetTimer: 0 }
      ]
    },
    lawn: {
      source: { x: 904, y: 284, xHome: 904, yHome: 284, attached: false, tilt: 0 },
      lanes: [
        createWorldPracticeCells(690, 222, 174, 8),
        createWorldPracticeCells(704, 262, 188, 9),
        createWorldPracticeCells(716, 304, 196, 9)
      ],
      verges: [
        { x: 324, y: 760, w: 54, h: 34, cut: 0, reaction: 0, resetTimer: 0 },
        { x: 1128, y: 760, w: 62, h: 36, cut: 0, reaction: 0, resetTimer: 0 },
        { x: 1512, y: 786, w: 52, h: 34, cut: 0, reaction: 0, resetTimer: 0 }
      ],
      resetTimer: 0
    },
    vegetable: {
      tray: { x: 962, y: 516, seedlings: 4, maxSeedlings: 4 },
      bucket: { x: 1262, y: 552, water: 0, capacity: 2 },
      well: { x: 1330, y: 532 },
      plots: [
        { x: 1022, y: 506, planted: false, watered: false, pop: 0, bounce: 0 },
        { x: 1098, y: 514, planted: false, watered: false, pop: 0, bounce: 0 },
        { x: 1048, y: 590, planted: false, watered: false, pop: 0, bounce: 0 },
        { x: 1124, y: 598, planted: false, watered: false, pop: 0, bounce: 0 }
      ],
      planters: [
        { x: 552, y: 348, planted: false, watered: false, pop: 0, bloom: 0, resetTimer: 0 },
        { x: 432, y: 1102, planted: false, watered: false, pop: 0, bloom: 0, resetTimer: 0 }
      ],
      resetTimer: 0
    },
    field: {
      source: { x: 548, y: 928 },
      rows: [
        createWorldPracticeCells(556, 860, 238, 8),
        createWorldPracticeCells(570, 902, 238, 8),
        createWorldPracticeCells(584, 946, 230, 8)
      ],
      sidePatches: [
        { x: 908, y: 846, tilled: 0, reaction: 0, resetTimer: 0 },
        { x: 1198, y: 782, tilled: 0, reaction: 0, resetTimer: 0 }
      ],
      resetTimer: 0
    },
    barn: {
      source: { x: 1432, y: 534, servings: 2 },
      troughs: [
        { x: 1420, y: 520, fill: 0, reaction: 0 },
        { x: 1548, y: 528, fill: 0, reaction: 0 }
      ],
      feedSpots: [
        { x: 514, y: 356, fill: 0, reaction: 0, visitor: "cat" },
        { x: 1340, y: 948, fill: 0, reaction: 0, visitor: "birds" }
      ]
    },
    pond: {
      source: { x: 1408, y: 956 },
      basket: { x: 1418, y: 1044, stored: 0, resetTimer: 0 },
      cast: { x: 1490, y: 996, timer: 0, hooked: false, hookSoundTimer: 0 },
      fish: [
        createWorldPracticeFish(1478, 986, 0.3),
        createWorldPracticeFish(1496, 1034, 1.4),
        createWorldPracticeFish(1532, 954, 2.2)
      ],
      skimmers: [
        { x: 1442, y: 924, cleared: false, bob: 0.4, reaction: 0, respawn: 0, kind: "leaf" },
        { x: 1448, y: 1082, cleared: false, bob: 1.6, reaction: 0, respawn: 0, kind: "toy" }
      ]
    }
  };
}

function createAmbientState() {
  return {
    butterflies: [
      { homeX: 338, homeY: 278, x: 338, y: 278, vx: 0, vy: 0, seed: 0.2, scare: 0 },
      { homeX: 392, homeY: 252, x: 392, y: 252, vx: 0, vy: 0, seed: 1.3, scare: 0 },
      { homeX: 442, homeY: 306, x: 442, y: 306, vx: 0, vy: 0, seed: 2.1, scare: 0 },
      { homeX: 970, homeY: 378, x: 970, y: 378, vx: 0, vy: 0, seed: 2.8, scare: 0 },
      { homeX: 1098, homeY: 392, x: 1098, y: 392, vx: 0, vy: 0, seed: 3.4, scare: 0 },
      { homeX: 1166, homeY: 354, x: 1166, y: 354, vx: 0, vy: 0, seed: 4.2, scare: 0 }
    ],
    chickens: [
      { homeX: 1450, homeY: 558, x: 1450, y: 558, vx: 0, vy: 0, heading: 1, bob: 0.2, panic: 0 },
      { homeX: 1528, homeY: 574, x: 1528, y: 574, vx: 0, vy: 0, heading: -1, bob: 1.5, panic: 0 },
      { homeX: 1578, homeY: 548, x: 1578, y: 548, vx: 0, vy: 0, heading: 1, bob: 2.4, panic: 0 }
    ],
    frogs: [
      { baseX: 1468, baseY: 1002, x: 1468, y: 1002, waterX: 1498, waterY: 1014, hop: 0, hidden: 0, cooldown: 0.4, ripple: 0 },
      { baseX: 1624, baseY: 956, x: 1624, y: 956, waterX: 1600, waterY: 982, hop: 0, hidden: 0, cooldown: 1.3, ripple: 0 }
    ],
    dragonflies: [
      { homeX: 1494, homeY: 934, x: 1494, y: 934, vx: 0, vy: 0, seed: 0.7, scare: 0 },
      { homeX: 1574, homeY: 1016, x: 1574, y: 1016, vx: 0, vy: 0, seed: 1.9, scare: 0 },
      { homeX: 1652, homeY: 952, x: 1652, y: 952, vx: 0, vy: 0, seed: 2.8, scare: 0 }
    ],
    fieldBirds: [
      { homeX: 666, homeY: 866, x: 666, y: 866, vx: 0, vy: 0, seed: 0.4, scare: 0, heading: 1 },
      { homeX: 724, homeY: 882, x: 724, y: 882, vx: 0, vy: 0, seed: 1.5, scare: 0, heading: -1 }
    ],
    windChime: { x: 438, y: 226, phase: 0, ring: 0 },
    mailbox: { x: 314, y: 350, open: 0, bounce: 0 },
    scarecrow: { x: 690, y: 898, sway: 0, flutter: 0 },
    cat: {
      x: 426,
      y: 332,
      vx: 0,
      vy: 0,
      heading: -1,
      nap: 0,
      stretch: 0,
      cooldown: 1.2,
      spotIndex: 0,
      spots: [
        { x: 426, y: 332 },
        { x: 364, y: 344 },
        { x: 468, y: 300 }
      ]
    },
    spinner: { x: 392, y: 1016, spin: 0, boost: 0 },
    laundry: { gust: 0, sway: 0 },
    nature: {
      bushes: [
        createNatureBush(314, 590, { label: "향기 수풀", scale: 1.02, blossomColor: "#f7d6e0", berryColor: "#d87762", asset: `${IMAGE_ASSET_ROOT}/plants/plant-23-leaf-bush.png` }),
        createNatureBush(458, 610, { label: "꽃 수풀", scale: 1.08, baseColor: "#6b9653", accentColor: "#8dbe70", blossomColor: "#f1b56b", asset: `${IMAGE_ASSET_ROOT}/plants/plant-24-fern.png` }),
        createNatureBush(878, 414, { label: "둥근 수풀", scale: 0.96, baseColor: "#5b8447", accentColor: "#78a95f", blossomColor: "#f4f0d0", asset: `${IMAGE_ASSET_ROOT}/plants/plant-21-clover.png` }),
        createNatureBush(1310, 780, { label: "열매 수풀", scale: 1.1, baseColor: "#5b8949", accentColor: "#87b66d", berryColor: "#e08a5e", asset: `${IMAGE_ASSET_ROOT}/plants/plant-18-meadow-grass.png` }),
        createNatureBush(1360, 1136, { label: "물가 수풀", scale: 1.04, baseColor: "#648f56", accentColor: "#8cc27b", blossomColor: "#f7d6e0", asset: `${IMAGE_ASSET_ROOT}/plants/plant-25-lawn-tuft.png` })
      ],
      flowers: [
        createNatureFlowerPatch(234, 604, { label: "들꽃", palette: ["#f1b56b", "#f7d6e0", "#f4f0d0"], scale: 1, asset: `${IMAGE_ASSET_ROOT}/plants/plant-12-pink-cosmos.png` }),
        createNatureFlowerPatch(548, 640, { label: "길가 꽃", palette: ["#d66f63", "#f7d6e0", "#f1b56b"], scale: 1.08, asset: `${IMAGE_ASSET_ROOT}/plants/plant-01-red-flower.png` }),
        createNatureFlowerPatch(936, 388, { label: "정원 꽃", palette: ["#f4f0d0", "#f1b56b", "#d66f63"], scale: 0.96, asset: `${IMAGE_ASSET_ROOT}/plants/plant-03-yellow-flower.png` }),
        createNatureFlowerPatch(1188, 768, { label: "밭둑 꽃", palette: ["#f7d6e0", "#f1b56b", "#a0c46d"], scale: 1, asset: `${IMAGE_ASSET_ROOT}/plants/plant-07-orange-tulip.png` }),
        createNatureFlowerPatch(1422, 1124, { label: "물가 꽃", palette: ["#d7eff6", "#f7d6e0", "#f4f0d0"], stemColor: "#6b8f55", scale: 1.02, asset: `${IMAGE_ASSET_ROOT}/plants/plant-13-lavender-sprig.png` }),
        createNatureFlowerPatch(706, 1078, { label: "들판 꽃", palette: ["#f1b56b", "#f4f0d0", "#d66f63"], scale: 1.06, asset: `${IMAGE_ASSET_ROOT}/plants/plant-10-yellow-daisy.png` })
      ],
      trees: [
        createNatureTree(258, 652, {
          label: "복숭아나무",
          size: 24,
          trunkHeight: 24,
          variant: 0,
          palette: { base: "#6e9c58", accent: "#8ab56f", trunk: "#765338" },
          asset: TREE_ASSETS[3],
          fruitAsset: PRODUCE_ASSETS.strawberry,
          fruitColor: "#f0a28d"
        }),
        createNatureTree(884, 404, {
          label: "꽃나무",
          size: 25,
          trunkHeight: 24,
          variant: 2,
          palette: { base: "#5f904b", accent: "#8dbc73", trunk: "#724f34" },
          asset: TREE_ASSETS[0],
          fruitAsset: PRODUCE_ASSETS.pear,
          fruitColor: "#f7d6e0"
        }),
        createNatureTree(1244, 820, {
          label: "배나무",
          size: 26,
          trunkHeight: 26,
          variant: 1,
          palette: { base: "#628f4a", accent: "#87b76e", trunk: "#745236" },
          asset: TREE_ASSETS[4],
          fruitAsset: PRODUCE_ASSETS.apple,
          fruitColor: "#e4d073"
        }),
        createNatureTree(1666, 786, {
          label: "큰 나무",
          size: 30,
          trunkHeight: 30,
          variant: 0,
          palette: { base: "#557f46", accent: "#7aa564", trunk: "#6b4e33" },
          asset: TREE_ASSETS[2],
          fruitAsset: PRODUCE_ASSETS.orange,
          fruitColor: "#d4a265"
        })
      ]
    },
    particles: [],
    grassBursts: []
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function getFullscreenRequest() {
  if (!ui.gameShell) {
    return null;
  }
  return ui.gameShell.requestFullscreen || ui.gameShell.webkitRequestFullscreen || null;
}

function getFullscreenExit() {
  return document.exitFullscreen || document.webkitExitFullscreen || null;
}

function setFullscreenStatus(message, isError = false) {
  if (!ui.fullscreenStatus) {
    return;
  }
  ui.fullscreenStatus.textContent = message;
  ui.fullscreenStatus.classList.toggle("is-error", isError);
}

function syncFullscreenUi() {
  const wasFullscreen = document.documentElement.dataset.fullscreen === "on";
  const isFullscreen = Boolean(getFullscreenElement());
  document.documentElement.dataset.fullscreen = isFullscreen ? "on" : "off";
  document.body.classList.toggle("is-fullscreen", isFullscreen);
  if (ui.fullscreenToggle) {
    const compactPhoneExit = isFullscreen && /^phone/.test(state.device?.id ?? "");
    ui.fullscreenToggle.textContent = isFullscreen ? (compactPhoneExit ? "나가기" : "전체화면 나가기") : "전체화면";
    ui.fullscreenToggle.setAttribute("aria-label", isFullscreen ? "전체화면 나가기" : "전체화면으로 전환");
    ui.fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
    ui.fullscreenToggle.classList.toggle("hidden", !getFullscreenRequest() && !isFullscreen);
  }
  if (isFullscreen) {
    setFullscreenStatus("전체화면을 사용하고 있어요. 이제 조작 안내를 확인해 보세요.");
  } else {
    setFullscreenStatus(
      isSmartphoneProfile()
        ? "주소창을 줄이고 스마트폰을 세로로 맞춰 게임과 조작부를 편하게 보여 줍니다."
        : "브라우저의 주소창을 줄여 게임과 조작부를 넓게 보여 줍니다."
    );
  }
  if (wasFullscreen && !isFullscreen) {
    handleFullscreenPortraitExit();
  }
  window.setTimeout(() => syncDeviceProfile({ force: true }), 80);
}

function waitForFullscreenActivation(timeout = 900) {
  if (getFullscreenElement()) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      document.removeEventListener("fullscreenchange", check);
      document.removeEventListener("webkitfullscreenchange", check);
      window.clearTimeout(timer);
      resolve(Boolean(getFullscreenElement()));
    };
    const check = () => {
      if (getFullscreenElement()) {
        finish();
      }
    };
    const timer = window.setTimeout(finish, timeout);
    document.addEventListener("fullscreenchange", check);
    document.addEventListener("webkitfullscreenchange", check);
  });
}

function isSmartphoneProfile() {
  return Boolean(state.device?.isTouch && /^phone/.test(state.device?.id ?? ""));
}

function isPortraitViewport() {
  return window.innerHeight >= window.innerWidth;
}

function getOrientationLock() {
  return window.screen?.orientation?.lock;
}

function waitForPortraitViewport(timeout = 700) {
  if (isPortraitViewport()) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
      window.screen?.orientation?.removeEventListener?.("change", check);
      window.clearTimeout(timer);
      resolve(isPortraitViewport());
    };
    const check = () => {
      if (isPortraitViewport()) {
        finish();
      }
    };
    const timer = window.setTimeout(finish, timeout);
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    window.screen?.orientation?.addEventListener?.("change", check);
  });
}

async function requestPortraitOrientationLock() {
  if (!isSmartphoneProfile()) {
    return { locked: false, supported: false, message: "" };
  }
  const lock = getOrientationLock();
  if (typeof lock !== "function" || !getFullscreenElement()) {
    return {
      locked: false,
      supported: false,
      message: "자동 세로 전환을 지원하지 않는 브라우저예요. 휴대전화를 직접 세로로 돌려 주세요."
    };
  }
  const portraitLockModes = ["portrait-primary", "portrait"];
  for (const mode of portraitLockModes) {
    try {
      await Promise.resolve(lock.call(window.screen.orientation, mode));
      const portrait = await waitForPortraitViewport();
      if (portrait) {
        return {
          locked: true,
          supported: true,
          message: "세로모드로 고정했어요."
        };
      }
      unlockPortraitOrientation();
      return {
        locked: false,
        supported: true,
        message: "브라우저의 화면 방향이 세로로 바뀌지 않아 자동 잠금을 풀었어요. 휴대전화를 직접 세로로 돌려 주세요."
      };
    } catch (error) {
      // Some browsers accept only the generic portrait value, so try it once as a fallback.
    }
  }
  unlockPortraitOrientation();
  return {
    locked: false,
    supported: true,
    message: "브라우저가 자동 세로 전환을 허용하지 않았어요. 화면 방향 잠금을 풀고 휴대전화를 직접 세로로 돌려 주세요."
  };
}

function unlockPortraitOrientation() {
  try {
    window.screen?.orientation?.unlock?.();
  } catch {}
}

function setPortraitGateStatus(message) {
  ui.portraitGateStatus.textContent = message || "세로 방향을 기다리고 있어요.";
}

function showPortraitGate(pendingLaunch = null, fullscreenMessage = "", reason = "") {
  state.portraitGate.open = true;
  state.portraitGate.pendingLaunch = pendingLaunch;
  state.portraitGate.fullscreenMessage = fullscreenMessage;
  state.portraitGate.reason = reason;
  if (pendingLaunch) {
    ui.startCard.classList.add("hidden");
  }
  ui.portraitGate.classList.remove("hidden");
  ui.portraitCancel.textContent = getFullscreenElement() ? "전체화면 나가기" : "현재 방향으로 계속";
  setPortraitGateStatus(reason);
  syncMobileViewportMode();
  focusOverlay(ui.portraitGate);
}

function hidePortraitGate() {
  state.portraitGate.open = false;
  state.portraitGate.pendingLaunch = null;
  state.portraitGate.fullscreenMessage = "";
  state.portraitGate.reason = "";
  ui.portraitGate.classList.add("hidden");
  syncMobileViewportMode();
}

function trapPortraitGateTab(event) {
  if (!state.portraitGate.open || event.key !== "Tab") {
    return false;
  }
  const stops = [ui.portraitRetry, ui.portraitCancel].filter((element) => !element.disabled);
  const currentIndex = stops.indexOf(document.activeElement);
  const nextIndex = event.shiftKey
    ? currentIndex <= 0
      ? stops.length - 1
      : currentIndex - 1
    : currentIndex < 0 || currentIndex === stops.length - 1
      ? 0
      : currentIndex + 1;
  event.preventDefault();
  stops[nextIndex].focus({ preventScroll: true });
  return true;
}

function completePortraitGateIfReady() {
  if (!state.portraitGate.open || !isPortraitViewport()) {
    return false;
  }
  const pendingLaunch = state.portraitGate.pendingLaunch;
  const fullscreenMessage = state.portraitGate.fullscreenMessage;
  hidePortraitGate();
  syncDeviceProfile({ force: true });
  if (pendingLaunch) {
    continueImmersiveLaunch(pendingLaunch, fullscreenMessage);
  } else if (state.controlTutorial.open) {
    focusOverlay(ui.controlTutorial);
  } else {
    restoreOverlayFocus();
  }
  return true;
}

async function retryPortraitMode() {
  if (!state.portraitGate.open) {
    return;
  }
  ui.portraitRetry.disabled = true;
  setPortraitGateStatus("세로모드로 전환하는 중이에요…");
  const result = await requestPortraitOrientationLock();
  ui.portraitRetry.disabled = false;
  syncDeviceProfile({ force: true });
  if (!completePortraitGateIfReady()) {
    setPortraitGateStatus(result.message);
    focusOverlay(ui.portraitGate);
  }
}

async function cancelPortraitGate() {
  const pendingLaunch = state.portraitGate.pendingLaunch;
  const fullscreenMessage = state.portraitGate.fullscreenMessage;
  hidePortraitGate();
  state.portraitModeRequested = false;
  unlockPortraitOrientation();
  if (getFullscreenElement()) {
    const exit = getFullscreenExit();
    if (exit) {
      try {
        await Promise.resolve(exit.call(document));
      } catch {}
    }
    syncFullscreenUi();
  }
  if (pendingLaunch) {
    continueImmersiveLaunch(
      pendingLaunch,
      fullscreenMessage || "세로모드 안내를 닫아 현재 화면에서 계속합니다."
    );
  }
}

function handleFullscreenPortraitExit() {
  const pendingLaunch = state.portraitGate.open ? state.portraitGate.pendingLaunch : null;
  const fullscreenMessage = state.portraitGate.fullscreenMessage;
  if (state.portraitGate.open) {
    hidePortraitGate();
  }
  state.portraitModeRequested = false;
  unlockPortraitOrientation();
  if (pendingLaunch) {
    window.setTimeout(() => {
      continueImmersiveLaunch(pendingLaunch, fullscreenMessage || "전체화면을 나가 현재 화면에서 계속합니다.");
    }, 0);
  }
}

function syncPortraitRequirement() {
  if (!state.portraitModeRequested || !isSmartphoneProfile()) {
    return;
  }
  if (isPortraitViewport()) {
    completePortraitGateIfReady();
    return;
  }
  if (!state.portraitGate.open && (state.started || state.controlTutorial.open)) {
    showPortraitGate(null, "", "세로 화면으로 돌리면 게임을 계속할 수 있어요.");
  }
}

async function requestGameFullscreen() {
  if (getFullscreenElement()) {
    return { active: true, message: "" };
  }
  const request = getFullscreenRequest();
  if (!request) {
    const message = "이 브라우저는 일반 웹 화면의 전체화면 전환을 지원하지 않아요. 현재 화면에서 계속할게요.";
    setFullscreenStatus(message, true);
    return { active: false, message };
  }
  setFullscreenStatus("전체화면으로 전환하는 중이에요…");
  try {
    await Promise.resolve(request.call(ui.gameShell));
    const active = await waitForFullscreenActivation();
    if (active) {
      syncFullscreenUi();
      return { active: true, message: "" };
    }
    const message = "전체화면 전환을 확인하지 못했어요. 현재 화면에서도 그대로 플레이할 수 있어요.";
    setFullscreenStatus(message, true);
    return { active: false, message };
  } catch (error) {
    const message = "전체화면 전환이 허용되지 않았어요. 현재 화면에서도 그대로 플레이할 수 있어요.";
    setFullscreenStatus(message, true);
    return { active: false, message };
  }
}

async function toggleGameFullscreen() {
  if (getFullscreenElement()) {
    const exit = getFullscreenExit();
    if (exit) {
      try {
        await Promise.resolve(exit.call(document));
      } catch {}
    }
    syncFullscreenUi();
    return;
  }
  state.portraitModeRequested = isSmartphoneProfile();
  const result = await requestGameFullscreen();
  if (state.portraitModeRequested) {
    const orientationResult = await requestPortraitOrientationLock();
    syncDeviceProfile({ force: true });
    if (!state.portraitModeRequested) {
      return;
    }
    if (!isPortraitViewport()) {
      showPortraitGate(null, result.message, orientationResult.message);
      return;
    }
  }
  if (result.message) {
    showToast("현재 화면으로 전환", result.message);
  }
}

function normalizeControlMode(value) {
  return value === "tap" ? "tap" : "joystick";
}

function getStoredControlMode() {
  try {
    return normalizeControlMode(window.localStorage.getItem(CONTROL_MODE_KEY));
  } catch {
    return "joystick";
  }
}

function syncControlModeUi() {
  const isTap = state.controlMode === "tap";
  document.documentElement.dataset.controlMode = state.controlMode;
  ui.controlModeSelector?.querySelectorAll("input[name='controlMode']").forEach((input) => {
    input.checked = input.value === state.controlMode;
  });
  if (ui.controlModeToggle) {
    ui.controlModeToggle.textContent = `조작 방식 · ${isTap ? "화면 터치" : "조이스틱"}`;
    ui.controlModeToggle.setAttribute("aria-label", `${isTap ? "조이스틱" : "화면 터치"} 방식으로 변경`);
  }
  applyDeviceCss(state.device);
  updateTouchActionLabel();
}

function setControlMode(value, options = {}) {
  const { savePreference = true, saveGame = true, announce = false } = options;
  const nextMode = normalizeControlMode(value);
  const changed = state.controlMode !== nextMode;
  state.controlMode = nextMode;
  if (changed) {
    cancelAutoNavigation();
    resetTouchJoystick();
  }
  if (savePreference) {
    try {
      window.localStorage.setItem(CONTROL_MODE_KEY, nextMode);
    } catch {}
  }
  syncControlModeUi();
  syncMobileViewportMode();
  if (saveGame && state.started) {
    persistGame("조작 방식 저장");
  }
  if (announce && changed) {
    showToast(
      "조작 방식 변경",
      nextMode === "tap" ? "장소나 대상을 누르면 걸어가서 자동으로 행동합니다." : "왼쪽 조이스틱과 오른쪽 행동 버튼을 사용합니다."
    );
  }
}

function readTutorialModes() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CONTROL_TUTORIAL_MODES_KEY) || "{}");
    return stored && typeof stored === "object" ? stored : {};
  } catch {
    return {};
  }
}

function hasSeenControlTutorial(mode = state.controlMode) {
  try {
    const seenModes = readTutorialModes();
    if (seenModes[normalizeControlMode(mode)] === true) {
      return true;
    }
    return normalizeControlMode(mode) === "joystick" && window.localStorage.getItem(CONTROL_TUTORIAL_KEY) === "done";
  } catch {
    return false;
  }
}

function rememberControlTutorial(mode = state.controlMode) {
  try {
    const normalizedMode = normalizeControlMode(mode);
    const seenModes = readTutorialModes();
    seenModes[normalizedMode] = true;
    window.localStorage.setItem(CONTROL_TUTORIAL_MODES_KEY, JSON.stringify(seenModes));
    if (normalizedMode === "joystick") {
      window.localStorage.setItem(CONTROL_TUTORIAL_KEY, "done");
    }
  } catch {}
}

function lockTutorialBackgroundFocus() {
  unlockTutorialBackgroundFocus();
  document.querySelectorAll("a, button, input, textarea, select, summary, [tabindex]").forEach((element) => {
    if (ui.controlTutorial.contains(element)) {
      return;
    }
    tutorialBackgroundTabIndexes.set(element, element.hasAttribute("tabindex") ? element.getAttribute("tabindex") : null);
    element.setAttribute("tabindex", "-1");
  });
}

function unlockTutorialBackgroundFocus() {
  tutorialBackgroundTabIndexes.forEach((previousValue, element) => {
    if (!element.isConnected) {
      return;
    }
    if (previousValue === null) {
      element.removeAttribute("tabindex");
    } else {
      element.setAttribute("tabindex", previousValue);
    }
  });
  tutorialBackgroundTabIndexes.clear();
}

function trapTutorialTab(event) {
  if (!state.controlTutorial.open || event.key !== "Tab") {
    return false;
  }
  const stops = [ui.tutorialSkip, ui.tutorialNext].filter((element) => !element.disabled);
  if (!stops.length) {
    return false;
  }
  const currentIndex = stops.indexOf(document.activeElement);
  const nextIndex = event.shiftKey
    ? currentIndex <= 0
      ? stops.length - 1
      : currentIndex - 1
    : currentIndex < 0 || currentIndex === stops.length - 1
      ? 0
      : currentIndex + 1;
  event.preventDefault();
  stops[nextIndex].focus({ preventScroll: true });
  return true;
}

function renderControlTutorialStep() {
  const step = clamp(state.controlTutorial.step, 0, 1);
  const isMovementStep = step === 0;
  const isTapMode = state.controlMode === "tap";
  state.controlTutorial.step = step;
  document.body.dataset.tutorialStep = isMovementStep ? "move" : "action";
  document.body.dataset.tutorialMode = state.controlMode;
  ui.tutorialStepLabel.textContent = `조작 안내 ${step + 1} / 2`;
  ui.tutorialTitle.textContent = isTapMode
    ? isMovementStep
      ? "가고 싶은 땅을 눌러 보세요"
      : "표시된 이모를 눌러 보세요"
    : isMovementStep
      ? "왼쪽 이동 패드를 밀어 보세요"
      : "오른쪽 행동 버튼을 누르세요";
  ui.tutorialBody.textContent = isTapMode
    ? isMovementStep
      ? "화면의 빈 땅을 누르면 그곳까지 자동으로 걸어갑니다. 아래 게임 화면을 한 번 눌러 연습해 보세요."
      : "사람이나 물건을 한 번 누르면 가까이 걸어간 뒤 대화하거나 행동합니다."
    : isMovementStep
      ? "손가락을 패드에 올린 채 가고 싶은 방향으로 밀면 마을을 걸을 수 있어요."
      : "사람이나 물건 가까이에 가면 버튼이 할 수 있는 행동으로 바뀌어요. 그때 한 번 눌러 주세요.";
  ui.tutorialNext.textContent = isMovementStep
    ? isTapMode
      ? "다음: 대상 터치"
      : "다음: 행동 버튼"
    : "알겠어요, 산책 시작";
  ui.tutorialStatus.textContent = state.controlTutorial.fallbackMessage;
  ui.tutorialStatus.classList.toggle("hidden", !state.controlTutorial.fallbackMessage);
  [...ui.controlTutorial.querySelectorAll(".tutorial-progress span")].forEach((dot, index) => {
    dot.classList.toggle("is-active", index <= step);
  });
  ui.touchJoystick.classList.toggle("is-tutorial-target", !isTapMode && isMovementStep);
  ui.touchAction.classList.toggle("is-tutorial-target", !isTapMode && !isMovementStep);
  ui.tapTutorialTarget.classList.toggle("hidden", !isTapMode || isMovementStep);
}

function showControlTutorial(pendingLaunch = null, fallbackMessage = "") {
  state.controlTutorial.open = true;
  state.controlTutorial.step = 0;
  state.controlTutorial.pendingLaunch = pendingLaunch;
  state.controlTutorial.fallbackMessage = fallbackMessage;
  ui.startCard.classList.add("hidden");
  ui.controlTutorial.classList.remove("hidden");
  lockTutorialBackgroundFocus();
  renderControlTutorialStep();
  syncMobileViewportMode();
  focusOverlay(ui.controlTutorial);
}

function launchPreparedSession(mode) {
  const selectedControlMode = state.controlMode;
  if (mode === "continue") {
    const saved = loadSavedGame();
    if (saved?.started && applySavedGame(saved)) {
      setControlMode(selectedControlMode, { savePreference: true, saveGame: true });
      return;
    }
  }
  setControlMode(selectedControlMode, { savePreference: true, saveGame: false });
  startGame();
}

function completeControlTutorial() {
  const pendingLaunch = state.controlTutorial.pendingLaunch;
  rememberControlTutorial();
  state.controlTutorial.open = false;
  state.controlTutorial.step = 0;
  state.controlTutorial.pendingLaunch = null;
  state.controlTutorial.fallbackMessage = "";
  state.portraitGate.open = false;
  state.portraitGate.pendingLaunch = null;
  state.portraitGate.fullscreenMessage = "";
  state.portraitGate.reason = "";
  delete document.body.dataset.tutorialStep;
  delete document.body.dataset.tutorialMode;
  ui.controlTutorial.classList.add("hidden");
  ui.portraitGate.classList.add("hidden");
  ui.tapTutorialTarget.classList.add("hidden");
  ui.touchJoystick.classList.remove("is-tutorial-target");
  ui.touchAction.classList.remove("is-tutorial-target");
  unlockTutorialBackgroundFocus();
  if (pendingLaunch) {
    launchPreparedSession(pendingLaunch);
  } else {
    syncMobileViewportMode();
    restoreOverlayFocus();
  }
}

function advanceControlTutorial() {
  if (!state.controlTutorial.open) {
    return;
  }
  if (state.controlTutorial.step === 0) {
    state.controlTutorial.step = 1;
    renderControlTutorialStep();
    return;
  }
  completeControlTutorial();
}

function continueImmersiveLaunch(launchMode, fullscreenMessage = "") {
  if (state.device?.isTouch && !hasSeenControlTutorial()) {
    showControlTutorial(launchMode, fullscreenMessage);
    return;
  }
  launchPreparedSession(launchMode);
  if (fullscreenMessage) {
    showToast("현재 화면으로 시작", fullscreenMessage);
  }
}

async function beginFullscreenLaunch() {
  const saved = loadSavedGame();
  const launchMode = saved?.started ? "continue" : "new";
  state.portraitModeRequested = isSmartphoneProfile();
  ui.fullscreenButton.disabled = true;
  const result = await requestGameFullscreen();
  syncDeviceProfile({ force: true });
  if (state.portraitModeRequested) {
    const orientationResult = await requestPortraitOrientationLock();
    syncDeviceProfile({ force: true });
    if (!state.portraitModeRequested) {
      ui.fullscreenButton.disabled = false;
      continueImmersiveLaunch(launchMode, result.message || "전체화면을 나가 현재 화면에서 계속합니다.");
      return;
    }
    if (!isPortraitViewport()) {
      ui.fullscreenButton.disabled = false;
      showPortraitGate(launchMode, result.message, orientationResult.message);
      return;
    }
    setFullscreenStatus("전체화면 세로모드로 플레이합니다.");
  }
  ui.fullscreenButton.disabled = false;
  continueImmersiveLaunch(launchMode, result.message);
}

function beginWindowLaunch(mode) {
  if (!getFullscreenElement()) {
    state.portraitModeRequested = false;
    unlockPortraitOrientation();
  }
  if (state.device?.isTouch && !hasSeenControlTutorial()) {
    showControlTutorial(mode);
    return;
  }
  launchPreparedSession(mode);
}

function setCanvasResolution(targetCanvas, width, height) {
  if (!targetCanvas) {
    return;
  }
  if (targetCanvas.width !== width) {
    targetCanvas.width = width;
  }
  if (targetCanvas.height !== height) {
    targetCanvas.height = height;
  }
}

function clampCameraToViewport() {
  state.camera.x = clamp(state.camera.x, 0, Math.max(0, world.width - canvas.width));
  state.camera.y = clamp(state.camera.y, 0, Math.max(0, world.height - canvas.height));
  state.camera.targetX = clamp(state.camera.targetX, 0, Math.max(0, world.width - canvas.width));
  state.camera.targetY = clamp(state.camera.targetY, 0, Math.max(0, world.height - canvas.height));
}

function applyDeviceCss(profile) {
  document.documentElement.dataset.deviceProfile = profile.id;
  document.documentElement.dataset.inputMode = profile.isTouch ? "touch" : "mouse";
  document.documentElement.dataset.orientation = profile.isPortrait ? "portrait" : "landscape";
  document.documentElement.dataset.touchUi = profile.isTouch ? "on" : "off";
  const touchUiReserve = profile.isTouch && state.controlMode === "joystick"
    ? Math.round(Math.max(profile.touchActionHeight, profile.touchButtonSize * 2.2) + 18)
    : 0;
  document.documentElement.style.setProperty("--mini-map-size", `${profile.miniMapSize}px`);
  document.documentElement.style.setProperty("--world-aspect", `${profile.worldWidth} / ${profile.worldHeight}`);
  document.documentElement.style.setProperty("--activity-aspect", `${profile.activityWidth} / ${profile.activityHeight}`);
  document.documentElement.style.setProperty("--touch-button-size", `${profile.touchButtonSize}px`);
  document.documentElement.style.setProperty("--touch-action-width", `${profile.touchActionWidth}px`);
  document.documentElement.style.setProperty("--touch-action-height", `${profile.touchActionHeight}px`);
  document.documentElement.style.setProperty("--touch-ui-reserve", `${touchUiReserve}px`);
}

function applyResponsiveCanvasProfile() {
  const profile = state.device;
  setCanvasResolution(canvas, profile.worldWidth, profile.worldHeight);
  setCanvasResolution(ui.miniMap, profile.miniMapSize, profile.miniMapSize);
  setCanvasResolution(ui.activityCanvas, profile.activityWidth, profile.activityHeight);
  if (state.activeMiniGame) {
    rebuildActiveMiniGameState();
    window.requestAnimationFrame(renderWorldScene);
  } else if (state.activeDialogue || state.activeQuiz || state.endingShown) {
    window.requestAnimationFrame(renderWorldScene);
  }
  state.uiFrame.miniMapLastRender = -Infinity;
  clampCameraToViewport();
}

function syncPhoneCanvasToFrame() {
  const profile = state.device;
  if (
    !/^phone/.test(profile?.id ?? "") ||
    !state.started ||
    !document.body.classList.contains("is-mobile-playing")
  ) {
    return;
  }
  const frame = canvas.closest(".canvas-frame");
  const rect = frame?.getBoundingClientRect();
  if (!rect || rect.width < 1 || rect.height < 1) {
    return;
  }
  const maximumWorldWidth = profile.isPortrait ? 780 : 1240;
  const nextWorldWidth = clamp(Math.round((profile.worldHeight * rect.width) / rect.height), 360, maximumWorldWidth);
  if (Math.abs(canvas.width - nextWorldWidth) <= 1) {
    return;
  }
  profile.worldWidth = nextWorldWidth;
  document.documentElement.style.setProperty("--world-aspect", `${profile.worldWidth} / ${profile.worldHeight}`);
  setCanvasResolution(canvas, profile.worldWidth, profile.worldHeight);
  state.uiFrame.miniMapLastRender = -Infinity;
  clampCameraToViewport();
}

function syncDeviceProfile(options = {}) {
  const { force = false } = options;
  const nextProfile = detectDeviceProfile();
  const current = state.device;
  const changed =
    force ||
    !current ||
    current.id !== nextProfile.id ||
    current.isPortrait !== nextProfile.isPortrait ||
    current.viewportWidth !== nextProfile.viewportWidth ||
    current.viewportHeight !== nextProfile.viewportHeight;

  if (!changed) {
    return;
  }

  state.device = nextProfile;
  if (!nextProfile.isTouch) {
    resetTouchJoystick();
  }
  applyDeviceCss(nextProfile);
  applyResponsiveCanvasProfile();
  updateVoiceButton();
  updateTouchJoystickVisual();

  if (nextProfile.prefersCompactHud) {
    state.uiPanels.heroExpanded = false;
    if (!state.uiPanels.journalOpen) {
      state.uiPanels.storyOpen = false;
      state.uiPanels.statsOpen = false;
    }
  }

  syncUiPanels();
}

function getInteractionAssist(kind = "default") {
  const profile = state.device ?? initialDeviceProfile;
  if (!profile.isTouch) {
    return 0;
  }

  switch (kind) {
    case "zone":
      return profile.touchAssist * 0.86;
    case "tool":
      return profile.touchAssist;
    case "station":
      return profile.touchAssist * 0.78;
    case "nature":
      return Math.max(8, profile.touchAssist * 0.3);
    case "activity":
      return profile.activityAssist;
    case "toolTip":
      return profile.activityAssist * 0.72;
    default:
      return profile.touchAssist * 0.72;
  }
}

function updateTouchJoystickVisual() {
  if (!ui.touchStickKnob || !ui.touchJoystick) {
    return;
  }

  const joystickSize = ui.touchJoystick.clientWidth || (state.device?.touchButtonSize ?? 60) * 2.55;
  const knobSize = (state.device?.touchButtonSize ?? 60) * 1.02;
  const maxOffset = Math.max(12, (joystickSize - knobSize) * 0.34);

  document.documentElement.style.setProperty("--joy-offset-x", `${(state.touchStick.x * maxOffset).toFixed(1)}px`);
  document.documentElement.style.setProperty("--joy-offset-y", `${(state.touchStick.y * maxOffset).toFixed(1)}px`);
  ui.touchJoystick.classList.toggle("is-active", state.touchStick.active || state.touchStick.magnitude > 0.04);
}

function resetTouchJoystick() {
  state.touchStick.active = false;
  state.touchStick.pointerId = null;
  state.touchStick.x = 0;
  state.touchStick.y = 0;
  state.touchStick.magnitude = 0;
  updateTouchJoystickVisual();
}

function updateTouchJoystickInput(clientX, clientY) {
  if (!ui.touchJoystick) {
    return;
  }

  const rect = ui.touchJoystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const maxDistance = Math.max(24, rect.width * 0.32);
  let dx = clientX - centerX;
  let dy = clientY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance > maxDistance) {
    const scale = maxDistance / distance;
    dx *= scale;
    dy *= scale;
  }

  state.touchStick.x = dx / maxDistance;
  state.touchStick.y = dy / maxDistance;
  state.touchStick.magnitude = Math.min(1, Math.hypot(state.touchStick.x, state.touchStick.y));
  updateTouchJoystickVisual();
}

function getDigitalAxis(negativeCodes = [], positiveCodes = []) {
  let axis = 0;
  if (negativeCodes.some((code) => state.keys.has(code))) {
    axis -= 1;
  }
  if (positiveCodes.some((code) => state.keys.has(code))) {
    axis += 1;
  }
  return axis;
}

function getMovementIntent() {
  let dx = getDigitalAxis(["ArrowLeft", "KeyA"], ["ArrowRight", "KeyD"]);
  let dy = getDigitalAxis(["ArrowUp", "KeyW"], ["ArrowDown", "KeyS"]);

  if (state.device?.isTouch) {
    dx += state.touchStick.x;
    dy += state.touchStick.y;
  }

  const rawLength = Math.hypot(dx, dy);
  if (rawLength < 0.001) {
    return { dx: 0, dy: 0, magnitude: 0 };
  }

  const clampScale = rawLength > 1 ? 1 / rawLength : 1;
  return {
    dx: dx * clampScale,
    dy: dy * clampScale,
    magnitude: Math.min(1, rawLength)
  };
}

function hasMovementInput(threshold = 0.12) {
  return getMovementIntent().magnitude > threshold || state.autoNavigation.active;
}

function cancelAutoNavigation(options = {}) {
  const { announce = false } = options;
  const wasActive = state.autoNavigation?.active;
  state.autoNavigation = createAutoNavigationState();
  if (announce && wasActive) {
    showToast("이동을 멈췄습니다", "다른 장소나 대상을 누르면 다시 이동합니다.");
  }
}

function getCanvasPointerPoint(event, targetCanvas) {
  const rect = targetCanvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }
  return {
    x: (event.clientX - rect.left) * (targetCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (targetCanvas.height / rect.height)
  };
}

function isWorldNavigationPointOpen(x, y, padding = state.player.r + 7) {
  if (x < padding || y < padding || x > world.width - padding || y > world.height - padding) {
    return false;
  }
  return !obstacles.some(
    (obstacle) =>
      x > obstacle.x - padding &&
      x < obstacle.x + obstacle.w + padding &&
      y > obstacle.y - padding &&
      y < obstacle.y + obstacle.h + padding
  );
}

function isWorldNavigationSegmentOpen(start, end) {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const steps = Math.max(1, Math.ceil(distance / 12));
  for (let index = 1; index <= steps; index += 1) {
    const ratio = index / steps;
    if (!isWorldNavigationPointOpen(lerp(start.x, end.x, ratio), lerp(start.y, end.y, ratio))) {
      return false;
    }
  }
  return true;
}

function findWorldNavigationPath(start, goal) {
  if (isWorldNavigationSegmentOpen(start, goal)) {
    return [{ x: goal.x, y: goal.y }];
  }

  const cell = 32;
  const cols = Math.ceil(world.width / cell);
  const rows = Math.ceil(world.height / cell);
  const toCell = (point) => ({
    x: clamp(Math.floor(point.x / cell), 0, cols - 1),
    y: clamp(Math.floor(point.y / cell), 0, rows - 1)
  });
  const cellPoint = (entry) => ({ x: entry.x * cell + cell / 2, y: entry.y * cell + cell / 2 });
  const keyOf = (x, y) => `${x},${y}`;
  const startCell = toCell(start);
  let goalCell = toCell(goal);
  if (!isWorldNavigationPointOpen(cellPoint(goalCell).x, cellPoint(goalCell).y)) {
    const alternatives = [];
    for (let radius = 1; radius <= 4; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const candidate = { x: goalCell.x + dx, y: goalCell.y + dy };
          if (candidate.x < 0 || candidate.y < 0 || candidate.x >= cols || candidate.y >= rows) continue;
          const point = cellPoint(candidate);
          if (isWorldNavigationPointOpen(point.x, point.y)) {
            alternatives.push({ ...candidate, distance: Math.hypot(point.x - goal.x, point.y - goal.y) });
          }
        }
      }
      if (alternatives.length) break;
    }
    alternatives.sort((a, b) => a.distance - b.distance);
    if (alternatives[0]) goalCell = alternatives[0];
  }

  const resolvedGoal = isWorldNavigationPointOpen(goal.x, goal.y) ? goal : cellPoint(goalCell);
  const open = [{ ...startCell, g: 0, f: 0 }];
  const scores = new Map([[keyOf(startCell.x, startCell.y), 0]]);
  const parents = new Map();
  const closed = new Set();
  const directions = [
    [-1, 0, 1], [1, 0, 1], [0, -1, 1], [0, 1, 1],
    [-1, -1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [1, 1, Math.SQRT2]
  ];

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();
    const currentKey = keyOf(current.x, current.y);
    if (closed.has(currentKey)) continue;
    if (current.x === goalCell.x && current.y === goalCell.y) {
      const cells = [current];
      let cursor = currentKey;
      while (parents.has(cursor)) {
        const previous = parents.get(cursor);
        cells.push(previous);
        cursor = keyOf(previous.x, previous.y);
      }
      cells.reverse();
      const raw = cells.slice(1).map(cellPoint);
      raw.push({ x: resolvedGoal.x, y: resolvedGoal.y });
      const smoothed = [];
      let anchor = { x: start.x, y: start.y };
      let index = 0;
      while (index < raw.length) {
        let farthest = index;
        for (let probe = raw.length - 1; probe >= index; probe -= 1) {
          if (isWorldNavigationSegmentOpen(anchor, raw[probe])) {
            farthest = probe;
            break;
          }
        }
        smoothed.push(raw[farthest]);
        anchor = raw[farthest];
        index = farthest + 1;
      }
      return smoothed;
    }
    closed.add(currentKey);
    directions.forEach(([dx, dy, cost]) => {
      const nx = current.x + dx;
      const ny = current.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
      const point = cellPoint({ x: nx, y: ny });
      if (!isWorldNavigationPointOpen(point.x, point.y)) return;
      if (dx && dy) {
        const sideA = cellPoint({ x: current.x + dx, y: current.y });
        const sideB = cellPoint({ x: current.x, y: current.y + dy });
        if (!isWorldNavigationPointOpen(sideA.x, sideA.y) || !isWorldNavigationPointOpen(sideB.x, sideB.y)) return;
      }
      const nextKey = keyOf(nx, ny);
      const nextScore = current.g + cost;
      if (nextScore >= (scores.get(nextKey) ?? Infinity)) return;
      scores.set(nextKey, nextScore);
      parents.set(nextKey, { x: current.x, y: current.y });
      const heuristic = Math.hypot(goalCell.x - nx, goalCell.y - ny);
      open.push({ x: nx, y: ny, g: nextScore, f: nextScore + heuristic });
    });
  }
  return [];
}

function getWorldTargetApproachPoint(target) {
  const start = { x: state.player.x, y: state.player.y };
  const interactionRadius = Math.max(34, (target.radius ?? target.baseRadius ?? 42) + getInteractionAssist(target.kind === "quiz" ? "zone" : target.kind ?? "zone") - 10);
  if (Math.hypot(start.x - target.x, start.y - target.y) <= interactionRadius) {
    return start;
  }
  const candidates = [];
  for (let index = 0; index < 16; index += 1) {
    const angle = (Math.PI * 2 * index) / 16;
    const candidate = {
      x: target.x + Math.cos(angle) * Math.max(28, interactionRadius - 8),
      y: target.y + Math.sin(angle) * Math.max(28, interactionRadius - 8)
    };
    if (isWorldNavigationPointOpen(candidate.x, candidate.y)) {
      candidates.push(candidate);
    }
  }
  candidates.sort((a, b) => Math.hypot(a.x - start.x, a.y - start.y) - Math.hypot(b.x - start.x, b.y - start.y));
  return candidates[0] ?? { x: target.x, y: target.y };
}

function setAutoNavigation(scope, waypoints, options = {}) {
  if (!waypoints.length) {
    showToast("그곳으로 갈 수 없어요", "조금 더 가까운 땅이나 다른 쪽을 눌러 보세요.");
    return false;
  }
  state.autoNavigation = {
    ...createAutoNavigationState(),
    active: true,
    scope,
    waypoints: waypoints.map((point) => ({ x: point.x, y: point.y })),
    destination: { ...waypoints[waypoints.length - 1] },
    targetType: options.targetType ?? null,
    targetId: options.targetId ?? null,
    targetLabel: options.targetLabel ?? "목적지",
    autoInteract: Boolean(options.autoInteract),
    traversal: options.traversal ?? null
  };
  return true;
}

function resolveWorldTapTarget(id, type) {
  if (type === "zone") return getAvailableZones().find((target) => target.id === id) ?? null;
  return buildWorldPracticeTargets().find((target) => target.id === id) ?? null;
}

function findWorldTapTarget(point) {
  const scaleAssist = Math.max(18, 34 * (canvas.width / Math.max(canvas.clientWidth, 1)));
  const targets = [
    ...getAvailableZones().map((target) => ({ ...target, tapType: "zone" })),
    ...buildWorldPracticeTargets().map((target) => ({ ...target, tapType: "practice" }))
  ];
  return targets
    .map((target) => ({ target, distance: Math.hypot(point.x - target.x, point.y - target.y) }))
    .filter(({ target, distance }) => distance <= Math.max(target.radius ?? target.baseRadius ?? 40, scaleAssist))
    .sort((a, b) => a.distance - b.distance)[0]?.target ?? null;
}

function beginWorldTapNavigation(point) {
  const target = findWorldTapTarget(point);
  const goal = target ? getWorldTargetApproachPoint(target) : point;
  const path = findWorldNavigationPath({ x: state.player.x, y: state.player.y }, goal);
  return setAutoNavigation("world", path, {
    targetType: target?.tapType,
    targetId: target?.id,
    targetLabel: target?.label ?? "선택한 곳",
    autoInteract: Boolean(target)
  });
}

function findActivityTapTarget(game, point) {
  return buildActivityTargets(game)
    .map((target) => {
      const inside = target.shape === "rect"
        ? point.x >= target.x - 18 && point.x <= target.x + target.w + 18 && point.y >= target.y - 18 && point.y <= target.y + target.h + 18
        : Math.hypot(point.x - target.x, point.y - target.y) <= Math.max(target.r ?? 22, 34);
      return { target, inside, distance: Math.hypot(point.x - getActivityTargetAnchor(target).x, point.y - getActivityTargetAnchor(target).y) };
    })
    .filter((entry) => entry.inside)
    .sort((a, b) => a.distance - b.distance)[0]?.target ?? null;
}

function beginActivityTapNavigation(point) {
  const game = state.activeMiniGame;
  if (!game) return false;
  const target = findActivityTapTarget(game, point);
  if (!target) {
    return setAutoNavigation("activity", [{ x: clamp(point.x, 36, game.width - 36), y: clamp(point.y, 48, game.height - 36) }], {
      targetLabel: "선택한 곳"
    });
  }
  if (target.requiresAction === false) {
    const centerY = target.y + target.h / 2;
    const left = { x: target.x + 12, y: centerY };
    const right = { x: target.x + target.w - 12, y: centerY };
    const nearLeft = Math.hypot(game.player.x - left.x, game.player.y - left.y) <= Math.hypot(game.player.x - right.x, game.player.y - right.y);
    const waypoints = nearLeft ? [left, right] : [right, left];
    return setAutoNavigation("activity", waypoints, {
      targetType: "activity",
      targetId: target.id,
      targetLabel: target.label,
      traversal: { reversePasses: 0 }
    });
  }
  const anchor = getActivityTargetAnchor(target);
  return setAutoNavigation("activity", [{ x: clamp(anchor.x, 36, game.width - 36), y: clamp(anchor.y, 48, game.height - 36) }], {
    targetType: "activity",
    targetId: target.id,
    targetLabel: target.label,
    autoInteract: true
  });
}

function getAutoNavigationMovement(scope, player, dt) {
  const navigation = state.autoNavigation;
  if (!navigation.active || navigation.scope !== scope) return { dx: 0, dy: 0, magnitude: 0 };
  if (scope === "activity" && navigation.autoInteract && state.activeMiniGame) {
    const movingTarget = buildActivityTargets(state.activeMiniGame).find((target) => target.id === navigation.targetId);
    if (movingTarget) {
      const anchor = getActivityTargetAnchor(movingTarget);
      const lastIndex = navigation.waypoints.length - 1;
      navigation.waypoints[lastIndex] = {
        x: clamp(anchor.x, 36, state.activeMiniGame.width - 36),
        y: clamp(anchor.y, 48, state.activeMiniGame.height - 36)
      };
      navigation.destination = { ...navigation.waypoints[lastIndex] };
    }
  }
  const waypoint = navigation.waypoints[navigation.waypointIndex];
  if (!waypoint) return { dx: 0, dy: 0, magnitude: 0 };
  const dx = waypoint.x - player.x;
  const dy = waypoint.y - player.y;
  const distance = Math.hypot(dx, dy);
  navigation.actionCooldown = Math.max(0, navigation.actionCooldown - dt);
  if (distance <= 9) {
    navigation.waypointIndex += 1;
    navigation.lastDistance = Infinity;
    if (navigation.waypointIndex < navigation.waypoints.length) {
      return getAutoNavigationMovement(scope, player, dt);
    }
    finishAutoNavigation(scope);
    return { dx: 0, dy: 0, magnitude: 0 };
  }
  if (distance >= navigation.lastDistance - 0.15) navigation.stuckTimer += dt;
  else navigation.stuckTimer = Math.max(0, navigation.stuckTimer - dt * 0.5);
  navigation.lastDistance = distance;
  if (navigation.stuckTimer > 1.1) {
    cancelAutoNavigation();
    showToast("이동이 막혔어요", "다른 쪽 땅을 한 번 눌러 주세요.");
    return { dx: 0, dy: 0, magnitude: 0 };
  }
  return { dx: dx / distance, dy: dy / distance, magnitude: 1 };
}

function finishAutoNavigation(scope) {
  const navigation = state.autoNavigation;
  if (!navigation.active || navigation.scope !== scope) return;
  if (scope === "world" && navigation.autoInteract) {
    const target = resolveWorldTapTarget(navigation.targetId, navigation.targetType);
    cancelAutoNavigation();
    if (!target) return;
    if (navigation.targetType === "practice") {
      state.hoveredPractice = target;
      handleWorldPracticeAction();
    } else {
      state.hoveredZone = target;
      interactWithZone(target);
    }
    return;
  }
  if (scope === "activity") {
    const game = state.activeMiniGame;
    const current = game ? buildActivityTargets(game).find((target) => target.id === navigation.targetId) : null;
    if (navigation.traversal && current && navigation.traversal.reversePasses < 1) {
      const reverse = [...navigation.waypoints].reverse();
      navigation.waypoints = reverse;
      navigation.waypointIndex = 0;
      navigation.traversal.reversePasses += 1;
      navigation.lastDistance = Infinity;
      return;
    }
    if (navigation.autoInteract && current && navigation.actionAttempts < 3) {
      navigation.actionAttempts += 1;
      navigation.waypointIndex = Math.max(0, navigation.waypoints.length - 1);
      navigation.lastDistance = Infinity;
      handleActivityAction();
      const remaining = buildActivityTargets(game).find((target) => target.id === navigation.targetId);
      if (remaining) {
        navigation.actionCooldown = 0.12;
        return;
      }
    }
  }
  cancelAutoNavigation();
}

function syncMobileViewportMode() {
  const isPhoneProfile = /^phone/.test(state.device?.id ?? "");
  const isStartCardOpen = !ui.startCard.classList.contains("hidden");
  const isDialogueOpen = !ui.dialogueBox.classList.contains("hidden");
  const isMiniGameOpen = !ui.miniGame.classList.contains("hidden");
  const isQuizOpen = !ui.quizCard.classList.contains("hidden");
  const isEndingOpen = !ui.endingCard.classList.contains("hidden");
  const isControlTutorialOpen = state.controlTutorial.open && !ui.controlTutorial.classList.contains("hidden");
  const isPortraitGateOpen = state.portraitGate.open && !ui.portraitGate.classList.contains("hidden");
  const hasOverlay =
    state.uiPanels.heroExpanded ||
    state.uiPanels.storyOpen ||
    state.uiPanels.statsOpen ||
    state.uiPanels.journalOpen ||
    isStartCardOpen ||
    isDialogueOpen ||
    isMiniGameOpen ||
    isQuizOpen ||
    isEndingOpen ||
    isControlTutorialOpen ||
    isPortraitGateOpen;

  document.body.classList.toggle("is-mobile-playing", isPhoneProfile && state.started && !hasOverlay);
  document.body.classList.toggle("is-mobile-overlay-active", isPhoneProfile && hasOverlay);
  document.body.classList.toggle("is-game-overlay-active", hasOverlay);
  document.body.classList.toggle("is-game-started", state.started);
  document.body.classList.toggle("is-start-card-open", isStartCardOpen);
  document.body.classList.toggle("is-dialogue-open", isDialogueOpen);
  document.body.classList.toggle("is-mini-game-open", isMiniGameOpen);
  document.body.classList.toggle("is-quiz-open", isQuizOpen);
  document.body.classList.toggle("is-ending-open", isEndingOpen);
  document.body.classList.toggle("is-control-tutorial", isControlTutorialOpen);
  document.body.classList.toggle("is-portrait-gate", isPortraitGateOpen);
  document.body.classList.toggle("is-journal-open", state.uiPanels.journalOpen);
  if (isPhoneProfile && state.started && !hasOverlay) {
    window.requestAnimationFrame(syncPhoneCanvasToFrame);
  }
}

function getEffectDensity() {
  const density = state.device?.effectDensity ?? 1;
  return clamp(state.device?.prefersReducedMotion ? Math.min(density, 0.45) : density, 0.45, 1);
}

function scaleEffectCount(count, minimum = 1) {
  return Math.max(minimum, Math.round(count * getEffectDensity()));
}

function shouldEmitEffect(chance = 1) {
  return Math.random() < chance * getEffectDensity();
}

function getAmbientParticleLimit() {
  return Math.round(56 + getEffectDensity() * 64);
}

function shouldRenderAmbientSlot(index, denseThreshold = 0.72) {
  const density = getEffectDensity();
  if (density >= 0.92) {
    return true;
  }
  if (density >= denseThreshold) {
    return index % 2 === 0;
  }
  return index % 3 === 0;
}

function getMiniMapRefreshInterval() {
  const density = getEffectDensity();
  if (density >= 0.92) {
    return 100;
  }
  if (density >= 0.76) {
    return 130;
  }
  return 180;
}

function shouldRefreshMiniMap() {
  const interval = getMiniMapRefreshInterval();
  const now = performance.now();
  if (now - state.uiFrame.miniMapLastRender >= interval) {
    state.uiFrame.miniMapLastRender = now;
    return true;
  }
  return false;
}

function snapshotActivityState(game) {
  if (!game) {
    return null;
  }

  return {
    kind: game.kind,
    canvasSize: { width: game.width, height: game.height },
    player: {
      xRatio: game.player.x / Math.max(game.width, 1),
      yRatio: game.player.y / Math.max(game.height, 1),
      carrying: game.player.carrying,
      carryingCatch: game.player.carryingCatch,
      facing: game.player.facing,
      step: game.player.step
    },
    feedback: game.feedback,
    feedbackTimer: game.feedbackTimer,
    expressionCue: game.expressionCue,
    expressionCueTimer: game.expressionCueTimer,
    expressionAlpha: game.expressionAlpha,
    expressionPulse: game.expressionPulse,
    sweatSpawnTimer: game.sweatSpawnTimer,
    actionPose: game.actionPose,
    completion: game.completion ? { ...game.completion } : null,
    particles: game.particles?.map((particle) => ({ ...particle })) ?? [],
    sweatDrops: game.sweatDrops?.map((drop) => ({ ...drop })) ?? [],
    shrubs: game.shrubs?.map((entry) => ({ trimmed: entry.trimmed, trimProgress: entry.trimProgress, shake: entry.shake })),
    mower: game.mower ? { attached: game.mower.attached, tilt: game.mower.tilt } : null,
    lanes: game.lanes?.map((entry) => ({ cut: entry.cut, reaction: entry.reaction, cells: [...entry.cells] })),
    tray: game.tray ? { taken: game.tray.taken, seedlings: game.tray.seedlings } : null,
    plots: game.plots?.map((entry) => ({ planted: entry.planted, pop: entry.pop })),
    bucket: game.bucket
      ? { taken: game.bucket.taken, water: game.bucket.water, capacity: game.bucket.capacity, filledTrips: game.bucket.filledTrips }
      : null,
    plants: game.plants?.map((entry) => ({ watered: entry.watered, bounce: entry.bounce, droop: entry.droop })),
    rows: game.rows?.map((entry) => ({ progress: entry.progress, ripple: entry.ripple, cells: [...entry.cells] })),
    feedBag: game.feedBag ? { taken: game.feedBag.taken, servings: game.feedBag.servings } : null,
    troughs: game.troughs?.map((entry) => ({ filled: entry.filled, fillLevel: entry.fillLevel, reaction: entry.reaction })),
    animals: game.animals?.map((entry) => ({ interest: entry.interest, step: entry.step })),
    net: game.net ? { taken: game.net.taken } : null,
    basket: game.basket ? { stored: game.basket.stored } : null,
    fish: game.fish?.map((entry) => ({ caught: entry.caught, panic: entry.panic, vx: entry.vx, vy: entry.vy }))
  };
}

function restoreActivityState(snapshot, nextGame) {
  if (!snapshot || !nextGame || snapshot.kind !== nextGame.kind) {
    return nextGame;
  }

  nextGame.player.x = clamp((snapshot.player?.xRatio ?? 0.14) * nextGame.width, 36, nextGame.width - 36);
  nextGame.player.y = clamp((snapshot.player?.yRatio ?? 0.82) * nextGame.height, 48, nextGame.height - 36);
  nextGame.player.prevX = nextGame.player.x;
  nextGame.player.prevY = nextGame.player.y;
  nextGame.player.carrying = snapshot.player?.carrying ?? nextGame.player.carrying;
  nextGame.player.carryingCatch = snapshot.player?.carryingCatch ?? nextGame.player.carryingCatch;
  nextGame.player.facing = snapshot.player?.facing ?? nextGame.player.facing;
  nextGame.player.step = snapshot.player?.step ?? nextGame.player.step;
  nextGame.feedback = snapshot.feedback ?? "";
  nextGame.feedbackTimer = snapshot.feedbackTimer ?? 0;
  nextGame.expressionCue = snapshot.expressionCue ?? "";
  nextGame.expressionCueTimer = snapshot.expressionCueTimer ?? 0;
  nextGame.expressionAlpha = snapshot.expressionAlpha ?? nextGame.expressionAlpha;
  nextGame.expressionPulse = snapshot.expressionPulse ?? nextGame.expressionPulse;
  nextGame.sweatSpawnTimer = snapshot.sweatSpawnTimer ?? nextGame.sweatSpawnTimer;
  nextGame.actionPose = snapshot.actionPose ?? 0;
  if (snapshot.completion && nextGame.completion) {
    Object.assign(nextGame.completion, snapshot.completion);
  }
  const effectScaleX = nextGame.width / Math.max(snapshot.canvasSize?.width ?? nextGame.width, 1);
  const effectScaleY = nextGame.height / Math.max(snapshot.canvasSize?.height ?? nextGame.height, 1);
  nextGame.particles = snapshot.particles?.map((particle) => ({
    ...particle,
    x: particle.x * effectScaleX,
    y: particle.y * effectScaleY,
    vx: particle.vx * effectScaleX,
    vy: particle.vy * effectScaleY
  })) ?? nextGame.particles;
  nextGame.sweatDrops = snapshot.sweatDrops?.map((drop) => ({
    ...drop,
    x: drop.x * effectScaleX,
    y: drop.y * effectScaleY,
    vx: drop.vx * effectScaleX,
    vy: drop.vy * effectScaleY
  })) ?? nextGame.sweatDrops;

  snapshot.shrubs?.forEach((entry, index) => Object.assign(nextGame.shrubs?.[index] ?? {}, entry));
  if (snapshot.mower && nextGame.mower) {
    Object.assign(nextGame.mower, snapshot.mower);
  }
  snapshot.lanes?.forEach((entry, index) => {
    if (!nextGame.lanes?.[index]) {
      return;
    }
    nextGame.lanes[index].cut = entry.cut;
    nextGame.lanes[index].reaction = entry.reaction;
    nextGame.lanes[index].cells = [...entry.cells];
    if (isActivityCoverageComplete(nextGame.lanes[index].cut)) {
      nextGame.lanes[index].cells.fill(1);
      nextGame.lanes[index].cut = 1;
    }
  });
  if (snapshot.tray && nextGame.tray) {
    Object.assign(nextGame.tray, snapshot.tray);
  }
  snapshot.plots?.forEach((entry, index) => Object.assign(nextGame.plots?.[index] ?? {}, entry));
  if (snapshot.bucket && nextGame.bucket) {
    Object.assign(nextGame.bucket, snapshot.bucket);
  }
  snapshot.plants?.forEach((entry, index) => Object.assign(nextGame.plants?.[index] ?? {}, entry));
  snapshot.rows?.forEach((entry, index) => {
    if (!nextGame.rows?.[index]) {
      return;
    }
    nextGame.rows[index].progress = entry.progress;
    nextGame.rows[index].ripple = entry.ripple;
    nextGame.rows[index].cells = [...entry.cells];
    if (isActivityCoverageComplete(nextGame.rows[index].progress)) {
      nextGame.rows[index].cells.fill(1);
      nextGame.rows[index].progress = 1;
    }
  });
  if (snapshot.feedBag && nextGame.feedBag) {
    Object.assign(nextGame.feedBag, snapshot.feedBag);
  }
  snapshot.troughs?.forEach((entry, index) => Object.assign(nextGame.troughs?.[index] ?? {}, entry));
  snapshot.animals?.forEach((entry, index) => {
    if (!nextGame.animals?.[index]) {
      return;
    }
    nextGame.animals[index].interest = entry.interest;
    nextGame.animals[index].step = entry.step;
  });
  if (snapshot.net && nextGame.net) {
    Object.assign(nextGame.net, snapshot.net);
  }
  if (snapshot.basket && nextGame.basket) {
    Object.assign(nextGame.basket, snapshot.basket);
  }
  snapshot.fish?.forEach((entry, index) => {
    if (!nextGame.fish?.[index]) {
      return;
    }
    Object.assign(nextGame.fish[index], entry);
  });

  return nextGame;
}

function rebuildActiveMiniGameState() {
  if (!state.activeMiniGame) {
    return;
  }
  const snapshot = snapshotActivityState(state.activeMiniGame);
  const rebuilt = createActivityState(state.activeMiniGame.zone);
  state.activeMiniGame = restoreActivityState(snapshot, rebuilt);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function parseColor(color) {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const value = Number.parseInt(hex, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
      a: 1
    };
  }

  const match = color.match(/rgba?\(([^)]+)\)/u);
  if (!match) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  const parts = match[1].split(",").map((part) => Number(part.trim()));
  return {
    r: parts[0] ?? 255,
    g: parts[1] ?? 255,
    b: parts[2] ?? 255,
    a: parts[3] ?? 1
  };
}

function mixColor(colorA, colorB, amount) {
  const parsedA = parseColor(colorA);
  const parsedB = parseColor(colorB);
  const r = Math.round(lerp(parsedA.r, parsedB.r, amount));
  const g = Math.round(lerp(parsedA.g, parsedB.g, amount));
  const b = Math.round(lerp(parsedA.b, parsedB.b, amount));
  const a = lerp(parsedA.a, parsedB.a, amount);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

function normalizeDayCycle(value) {
  return ((value % 1) + 1) % 1;
}

function getDayStageFromCycle(dayCycle = state.dayCycle) {
  return Math.floor(normalizeDayCycle(dayCycle) * DAY_STAGE_LABELS.length) % DAY_STAGE_LABELS.length;
}

function getDayStageBlend(dayCycle = state.dayCycle) {
  const normalized = normalizeDayCycle(dayCycle);
  const scaled = normalized * DAY_STAGE_LABELS.length;
  return scaled - Math.floor(scaled);
}

function getCurrentDayBlendInfo() {
  const current = getDayStageFromCycle(state.dayCycle);
  return {
    current,
    next: (current + 1) % DAY_STAGE_LABELS.length,
    blend: getDayStageBlend(state.dayCycle)
  };
}

function getDayStageLabel(stage = state.dayStage) {
  return DAY_STAGE_LABELS[stage] ?? DAY_STAGE_LABELS[0];
}

function getDayClockText(dayCycle = state.dayCycle) {
  const normalized = normalizeDayCycle(dayCycle);
  const scaled = normalized * DAY_STAGE_LABELS.length;
  const stage = Math.floor(scaled) % DAY_STAGE_LABELS.length;
  const stageBlend = scaled - Math.floor(scaled);
  // 아침→점심→낮→저녁→밤의 시각적 단계와 시계가 자연스럽게 맞도록
  // 마지막 밤 구간만 다음 날 아침까지 이어 준다.
  const stageMinutes = [6 * 60, 11 * 60, 15 * 60, 18 * 60, 21 * 60, 30 * 60];
  const totalMinutes = Math.floor(lerp(stageMinutes[stage], stageMinutes[stage + 1], stageBlend)) % (24 * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

let cachedDayProfileKey = "";
let cachedDayProfile = null;

function getDayProfile() {
  const { current, next, blend } = getCurrentDayBlendInfo();
  const cacheKey = `${state.dayCycle}:${state.dayStage}`;
  if (cachedDayProfile && cacheKey === cachedDayProfileKey) {
    return cachedDayProfile;
  }
  const from = DAY_VISUAL_PROFILES[current];
  const to = DAY_VISUAL_PROFILES[next];
  cachedDayProfileKey = cacheKey;
  cachedDayProfile = {
    butterflyWake: lerp(from.butterflyWake, to.butterflyWake, blend),
    dragonflyWake: lerp(from.dragonflyWake, to.dragonflyWake, blend),
    birdWake: lerp(from.birdWake, to.birdWake, blend),
    chickenWake: lerp(from.chickenWake, to.chickenWake, blend),
    frogWake: lerp(from.frogWake, to.frogWake, blend),
    catWake: lerp(from.catWake, to.catWake, blend),
    flowerGlow: lerp(from.flowerGlow, to.flowerGlow, blend),
    dew: lerp(from.dew, to.dew, blend),
    lantern: lerp(from.lantern, to.lantern, blend),
    firefly: lerp(from.firefly, to.firefly, blend),
    lawnEase: lerp(from.lawnEase, to.lawnEase, blend),
    fieldEcho: lerp(from.fieldEcho, to.fieldEcho, blend),
    wateringAssist: lerp(from.wateringAssist, to.wateringAssist, blend),
    fishShore: lerp(from.fishShore, to.fishShore, blend),
    fishCalm: lerp(from.fishCalm, to.fishCalm, blend),
    feedGather: lerp(from.feedGather, to.feedGather, blend),
    activityHint: DAY_ACTIVITY_HINTS[state.dayStage] ?? DAY_ACTIVITY_HINTS[0]
  };
  return cachedDayProfile;
}

function getLanternGlowAmount() {
  const { current, next, blend } = getCurrentDayBlendInfo();
  const currentAmount = [0, 0, 0.04, 0.62, 1][current];
  const nextAmount = [0, 0, 0.04, 0.62, 1][next];
  return lerp(currentAmount, nextAmount, blend);
}

function getNightAmount() {
  const { current, next, blend } = getCurrentDayBlendInfo();
  const currentAmount = [0, 0, 0, 0.34, 1][current];
  const nextAmount = [0, 0, 0, 0.34, 1][next];
  return lerp(currentAmount, nextAmount, blend);
}

function getMorningDewAmount() {
  const { current, next, blend } = getCurrentDayBlendInfo();
  const currentAmount = [0.72, 0.18, 0, 0, 0][current];
  const nextAmount = [0.72, 0.18, 0, 0, 0][next];
  return lerp(currentAmount, nextAmount, blend);
}

function pickRandom(items = []) {
  return items[Math.floor(Math.random() * items.length)] ?? "";
}

function syncUiPanels() {
  ui.heroDetails.classList.toggle("hidden", !state.uiPanels.heroExpanded);
  ui.storyPanel.classList.toggle("hidden", !state.uiPanels.storyOpen);
  ui.statsPanel.classList.toggle("hidden", !state.uiPanels.statsOpen);
  ui.journalDrawer.classList.toggle("hidden", !state.uiPanels.journalOpen);
  ui.journalBackdrop.classList.toggle("hidden", !state.uiPanels.journalOpen);
  ui.heroPanel.classList.toggle("is-expanded", state.uiPanels.heroExpanded);
  ui.heroToggle.setAttribute("aria-expanded", String(state.uiPanels.heroExpanded));
  ui.storyToggle.setAttribute("aria-expanded", String(state.uiPanels.storyOpen));
  ui.statsToggle.setAttribute("aria-expanded", String(state.uiPanels.statsOpen));
  ui.journalToggle.setAttribute("aria-expanded", String(state.uiPanels.journalOpen));

  const isCompactProfile = Boolean(state.device?.prefersCompactHud);
  ui.heroToggle.textContent = state.uiPanels.heroExpanded
    ? isCompactProfile
      ? "안내 닫기"
      : "안내 접기"
    : isCompactProfile
      ? "안내"
      : "안내 펼치기";
  document.body.classList.toggle("is-compact-hud", Boolean(state.device?.prefersCompactHud));
  ui.storyToggle.classList.toggle("is-active", state.uiPanels.storyOpen);
  ui.statsToggle.classList.toggle("is-active", state.uiPanels.statsOpen);
  ui.journalToggle.classList.toggle("is-active", state.uiPanels.journalOpen);
  syncMobileViewportMode();
}

function closeOptionalPanels() {
  state.uiPanels.storyOpen = false;
  state.uiPanels.statsOpen = false;
  state.uiPanels.journalOpen = false;
  syncUiPanels();
}

function focusOverlay(element) {
  if (!element) {
    return;
  }
  const activeElement = document.activeElement;
  if (activeElement && activeElement !== document.body && !element.contains(activeElement)) {
    state.lastFocusedElement = activeElement;
  }
  window.requestAnimationFrame(() => element.focus({ preventScroll: true }));
}

function restoreOverlayFocus() {
  const previous = state.lastFocusedElement;
  state.lastFocusedElement = null;
  if (previous?.isConnected) {
    previous.focus({ preventScroll: true });
  } else if (!state.device?.isTouch) {
    canvas.focus({ preventScroll: true });
  }
}

function toggleUiPanel(panelKey) {
  if (!(panelKey in state.uiPanels)) {
    return;
  }
  const willOpen = !state.uiPanels[panelKey];
  state.uiPanels.storyOpen = false;
  state.uiPanels.statsOpen = false;
  state.uiPanels.journalOpen = false;
  state.uiPanels[panelKey] = willOpen;
  syncUiPanels();
  if (panelKey === "journalOpen") {
    if (state.uiPanels.journalOpen) {
      focusOverlay(ui.journalDrawer);
    } else {
      restoreOverlayFocus();
    }
  }
  playSfx("uiClick", {
    volume: 0.26,
    playbackRate: state.uiPanels[panelKey] ? 1.02 : 0.92
  });
}

function getQuizSignDefinition(id) {
  return quizSignDefinitions.find((entry) => entry.id === id || entry.taskId === id) ?? null;
}

function shuffleArray(list) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function buildQuizChoiceSet(quiz) {
  const answerLetters = Array.from(quiz.answer);
  const distractors = Array.isArray(quiz.choicePool)
    ? quiz.choicePool.slice(0, Math.max(0, 10 - answerLetters.length))
    : [];
  return shuffleArray([...answerLetters, ...distractors].slice(0, 10)).map((text, index) => ({
    id: `${quiz.id}-${index}-${text}`,
    text
  }));
}

function buildQuizBlankMarkup(answer) {
  return Array.from(answer)
    .map(() => '<span class="quiz-slot is-empty">(   )</span>')
    .join("");
}

function normalizeQuizAnswer(text) {
  return (text ?? "").replace(/\s+/g, "").trim();
}

function getQuizChoiceMap() {
  return new Map(state.quizAssembly.choices.map((choice) => [choice.id, choice]));
}

function getCurrentQuizAnswer() {
  const choiceMap = getQuizChoiceMap();
  return state.quizAssembly.selection
    .map((id) => choiceMap.get(id)?.text ?? "")
    .join("");
}

function renderQuizExpression() {
  const quiz = state.activeQuiz;
  if (!quiz) {
    ui.quizExpression.innerHTML = "";
    return;
  }
  const choiceMap = getQuizChoiceMap();
  const answerLength = Array.from(quiz.answer).length;
  const slots = Array.from({ length: answerLength }, (_, index) => {
    const choice = choiceMap.get(state.quizAssembly.selection[index]);
    const text = choice?.text ?? "(   )";
    const stateClass = choice ? "is-filled" : "is-empty";
    const label = choice ? `${choice.text} 지우기` : `${index + 1}번째 빈칸`;
    return `<button type="button" class="quiz-slot ${stateClass}" data-quiz-slot="${index}" aria-label="${label}">${text}</button>`;
  }).join("");
  ui.quizExpression.innerHTML = `
    <span class="quiz-prefix">${quiz.prefix}</span>
    <span class="quiz-slot-strip">${slots}</span>
  `;
}

function renderQuizChoiceBank() {
  const quiz = state.activeQuiz;
  if (!quiz) {
    ui.quizChoiceBank.innerHTML = "";
    return;
  }
  const answerLength = Array.from(quiz.answer).length;
  const selectionFull = state.quizAssembly.selection.length >= answerLength;
  ui.quizChoiceBank.innerHTML = state.quizAssembly.choices
    .map((choice) => {
      const used = state.quizAssembly.selection.includes(choice.id);
      const disabled = used || selectionFull;
      return `<button type="button" class="quiz-choice${used ? " is-used" : ""}" data-quiz-choice="${choice.id}" ${disabled ? "disabled" : ""}>${choice.text}</button>`;
    })
    .join("");
}

function syncQuizBoard() {
  renderQuizExpression();
  renderQuizChoiceBank();
}

function resetQuizSelection(reshuffle = false) {
  state.quizAssembly.selection = [];
  if (reshuffle) {
    state.quizAssembly.choices = shuffleArray(state.quizAssembly.choices);
  }
  syncQuizBoard();
  persistGame("표현 저장");
}

function appendQuizChoice(choiceId) {
  if (!state.activeQuiz) {
    return false;
  }
  const answerLength = Array.from(state.activeQuiz.answer).length;
  if (state.quizAssembly.selection.length >= answerLength || state.quizAssembly.selection.includes(choiceId)) {
    return false;
  }
  state.quizAssembly.selection.push(choiceId);
  syncQuizBoard();
  persistGame("표현 저장");
  playSfx("uiClick", { volume: 0.18, playbackRate: 1.08 });
  return true;
}

function removeQuizChoice(slotIndex) {
  if (!state.activeQuiz || slotIndex < 0 || slotIndex >= state.quizAssembly.selection.length) {
    return false;
  }
  state.quizAssembly.selection.splice(slotIndex, 1);
  syncQuizBoard();
  persistGame("표현 저장");
  playSfx("uiClick", { volume: 0.14, playbackRate: 0.92 });
  return true;
}

function syncFollowerCompanions() {
  const existing = new Map(state.followers.map((entry) => [entry.id, entry]));
  state.followers = followerOrder
    .filter((id) => state.unlockedFollowers.has(id))
    .map((id, index) => {
      const previous = existing.get(id);
      if (previous) {
        previous.step = previous.step ?? randomRange(0, Math.PI * 2);
        previous.blink = previous.blink ?? randomRange(0, Math.PI * 2);
        previous.bob = previous.bob ?? randomRange(0, Math.PI * 2);
        previous.hop = previous.hop ?? 0;
        return previous;
      }
      return {
        id,
        x: state.player.x - 18 - index * 12,
        y: state.player.y + 26 + index * 6,
        bob: randomRange(0, Math.PI * 2),
        step: randomRange(0, Math.PI * 2),
        blink: randomRange(0, Math.PI * 2),
        hop: 0
      };
    });
}

function showQuizFeedback(message, status = "error") {
  ui.quizFeedback.textContent = message;
  ui.quizFeedback.classList.remove("hidden", "is-error", "is-success");
  ui.quizFeedback.classList.add(status === "success" ? "is-success" : "is-error");
}

function openQuiz(quizId) {
  const quiz = getQuizSignDefinition(quizId);
  if (!quiz) {
    return false;
  }
  if (!state.completedTasks.has(quiz.taskId) && !state.solvedQuizSigns.has(quiz.id)) {
    showToast("먼저 몸으로 해 보기", `‘${quiz.expression}’ 활동을 마치면 이 팻말이 열립니다.`);
    return false;
  }
  closeOptionalPanels();
  setPrompt("");
  state.activeQuiz = quiz;
  state.quizAssembly = createQuizAssemblyState(buildQuizChoiceSet(quiz), []);
  ui.quizCard.classList.remove("hidden");
  ui.quizType.textContent = state.solvedQuizSigns.has(quiz.id) ? "팻말 다시 읽기" : "팻말 퀴즈";
  ui.quizTitle.textContent = state.solvedQuizSigns.has(quiz.id) ? quiz.expression : `‘${quiz.prefix}’에 어울리는 동작`;
  ui.quizPrompt.textContent = "팻말에 적힌 활동 표현의 빈칸을 채워 보세요.";
  ui.quizExpression.innerHTML = `
    <span class="quiz-prefix">${quiz.prefix}</span>
    <span class="quiz-slot-strip">${buildQuizBlankMarkup(quiz.answer)}</span>
  `;
  syncQuizBoard();
  ui.quizAnswerInput.placeholder = "동사를 완성하세요";
  ui.quizFeedback.classList.add("hidden");
  ui.quizFeedback.classList.remove("is-error", "is-success");
  ui.quizType.textContent = state.solvedQuizSigns.has(quiz.id) ? "팻말 다시 읽기" : "팻말 퀴즈";
  ui.quizPrompt.textContent = "팻말 아래 글자 조각을 눌러 생활 표현을 완성해 보세요.";
  syncMobileViewportMode();
  updateTouchActionLabel();
  focusOverlay(ui.quizCard);
  return true;
}

function closeQuiz() {
  state.activeQuiz = null;
  state.quizAssembly = createQuizAssemblyState();
  ui.quizCard.classList.add("hidden");
  ui.quizFeedback.classList.add("hidden");
  ui.quizFeedback.classList.remove("is-error", "is-success");
  ui.quizAnswerInput.value = "";
  ui.quizExpression.innerHTML = "";
  ui.quizChoiceBank.innerHTML = "";
  syncMobileViewportMode();
  updateTouchActionLabel();
  persistGame("표현 저장");
  restoreOverlayFocus();
}

function submitQuizAnswer() {
  if (!state.activeQuiz) {
    return false;
  }
  const quiz = state.activeQuiz;
  const answerLength = Array.from(quiz.answer).length;
  const typed = normalizeQuizAnswer(getCurrentQuizAnswer());
  ui.quizAnswerInput.value = typed;
  if (state.quizAssembly.selection.length < answerLength || !typed) {
    showQuizFeedback("글자를 모두 눌러서 빈칸을 먼저 완성해 보세요.");
    playSfx("uiClick", { volume: 0.16, playbackRate: 0.88 });
    return false;
  }
  if (typed !== quiz.answer) {
    showQuizFeedback(`아직 아니에요. '${quiz.prefix}'에 어울리는 동사를 다시 떠올려 보세요.`);
    playSfx("uiClick", { volume: 0.16, playbackRate: 0.84 });
    return false;
  }

  const firstSolved = !state.solvedQuizSigns.has(quiz.id);
  const follower = followerDefinitions[quiz.followerId];
  state.solvedQuizSigns.add(quiz.id);
  let unlockedFollower = null;
  if (follower && !state.unlockedFollowers.has(quiz.followerId)) {
    state.unlockedFollowers.add(quiz.followerId);
    syncFollowerCompanions();
    unlockedFollower = follower;
  }

  playSfx("taskComplete", { playbackRate: 1.08, volume: 0.52 });
  renderSidebar();
  persistGame("퀴즈");
  closeQuiz();
  emitWorldPracticeBurst(
    state.player.x,
    state.player.y - 18,
    ["rgba(255, 229, 166, 0.92)", "rgba(245, 184, 121, 0.9)", "rgba(174, 214, 147, 0.88)"],
    { count: 10, minLife: 0.48, maxLife: 0.8, minSize: 3, maxSize: 5 }
  );
  startWorldExpressionMoment(
    `quiz-${quiz.taskId}`,
    quiz.expression,
    `직접 해 본 동작과 ‘${quiz.answer}’가 한 표현으로 다시 이어졌습니다.`,
    3.2
  );
  if (firstSolved && unlockedFollower) {
    showToast(quiz.expression, `${unlockedFollower.label}가 캐릭터를 졸졸 따라옵니다.`);
  } else if (firstSolved) {
    showToast(quiz.expression, "팻말 퀴즈를 맞혀 표현이 더 또렷해졌습니다.");
  } else {
    showToast(quiz.expression, "이미 푼 팻말이지만 다시 한 번 정확히 떠올렸습니다.");
  }
  return true;
}

function serializeState() {
  return {
    started: state.started,
    voiceEnabled: state.voiceEnabled,
    controlMode: state.controlMode,
    player: {
      x: state.player.x,
      y: state.player.y,
      facing: state.player.facing,
      step: state.player.step
    },
    camera: {
      x: state.camera.x,
      y: state.camera.y
    },
    storyIndex: state.storyIndex,
    warmth: state.warmth,
    basket: [...state.basket],
    completedTasks: [...state.completedTasks],
    solvedQuizSigns: [...state.solvedQuizSigns],
    unlockedFollowers: [...state.unlockedFollowers],
    unlockedNouns: [...state.unlockedNouns],
    unlockedVerbs: [...state.unlockedVerbs],
    unlockedMood: [...state.unlockedMood],
    unlockedListening: [...state.unlockedListening],
    flags: [...state.flags],
    dayCycle: state.dayCycle,
    dayCount: state.dayCount,
    dayStage: state.dayStage,
    endingShown: state.endingShown,
    pendingEnding: state.pendingEnding,
    pausedActivity: state.pausedActivity,
    activeMiniGame: state.activeMiniGame
      ? {
          zoneId: state.activeMiniGame.zone.id,
          snapshot: snapshotActivityState(state.activeMiniGame)
        }
      : null,
    activeDialogue: state.activeDialogue
      ? {
          zoneId: state.activeDialogue.zoneId,
          index: state.dialogueIndex
        }
      : null,
    activeQuiz: state.activeQuiz
      ? {
          id: state.activeQuiz.id,
          choices: state.quizAssembly.choices,
          selection: state.quizAssembly.selection
        }
      : null
  };
}

function updateSaveSummary(snapshot = null) {
  const data = snapshot ?? loadSavedGame();
  if (!data || !data.started) {
    ui.continueButton.classList.add("hidden");
    ui.saveSummary.classList.add("hidden");
    ui.fullscreenButton.textContent = isSmartphoneProfile() ? "세로 전체화면으로 시작" : "전체화면으로 시작";
    ui.startButton.textContent = "현재 화면으로 시작";
    ui.startButton.classList.add("secondary-button");
    ui.startButton.classList.remove("primary-button");
    ui.continueButton.classList.add("secondary-button");
    ui.continueButton.classList.remove("primary-button");
    ui.saveStatus.textContent = state.saveMessage;
    return;
  }

  const completedCount = Array.isArray(data.completedTasks) ? data.completedTasks.length : 0;
  const warmth = data.warmth ?? 0;
  const stage = DAY_STAGE_LABELS[data.dayStage ?? 0] ?? DAY_STAGE_LABELS[0];
  const dayCount = data.dayCount ?? 1;
  const clockText = getDayClockText(data.dayCycle ?? ((data.dayStage ?? 0) + 0.04) / DAY_STAGE_LABELS.length);
  const draftLabel = data.activeMiniGame || data.pausedActivity || data.activeDialogue || data.activeQuiz ? " · 하던 활동 이어서 하기" : "";

  ui.continueButton.classList.remove("hidden");
  ui.saveSummary.classList.remove("hidden");
  ui.fullscreenButton.textContent = isSmartphoneProfile() ? "세로 전체화면으로 이어서 걷기" : "전체화면으로 이어서 걷기";
  ui.startButton.textContent = "새로 시작";
  ui.startButton.classList.add("secondary-button");
  ui.startButton.classList.remove("primary-button");
  ui.continueButton.textContent = "현재 화면으로 이어서 걷기";
  ui.continueButton.classList.add("secondary-button");
  ui.continueButton.classList.remove("primary-button");
  ui.saveSummary.textContent = `저장된 산책이 있습니다. ${dayCount}일차 ${stage} ${clockText} · 부탁 ${Math.min((data.storyIndex ?? 0) + 1, storySteps.length)}/${storySteps.length} · 완료한 일 ${completedCount}개 · 온기 ${warmth}${draftLabel}`;
  ui.saveStatus.textContent = state.started ? state.saveMessage : "이어서 걷기 가능";
}

function persistGame(reason = "자동 저장") {
  if (!state.started) {
    state.saveMessage = "새 하루 준비 중";
    ui.saveStatus.textContent = state.saveMessage;
    return;
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
    state.saveMessage = `${reason}됨`;
  } catch (error) {
    state.saveMessage = "저장 실패";
  }
  updateSaveSummary(serializeState());
}

function clearSavedGame() {
  try {
    [SAVE_KEY, ...LEGACY_SAVE_KEYS].forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    // Ignore storage cleanup failures.
  }
}

function loadSavedGame() {
  try {
    for (const key of [SAVE_KEY, ...LEGACY_SAVE_KEYS]) {
      const raw = localStorage.getItem(key);
      if (!raw) {
        continue;
      }
      try {
        const saved = JSON.parse(raw);
        if (key !== SAVE_KEY) {
          localStorage.setItem(SAVE_KEY, raw);
        }
        return saved;
      } catch (error) {
        // Try the next compatible save when an older entry is damaged.
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

function restoreSavedOverlay(data) {
  if (data.endingShown) {
    return;
  }

  if (data.activeMiniGame?.zoneId) {
    const zone = zoneDefinitions.find((entry) => entry.id === data.activeMiniGame.zoneId);
    if (zone && !state.completedTasks.has(zone.taskId)) {
      state.activeMiniGame = restoreActivityState(data.activeMiniGame.snapshot, createActivityState(zone));
      ui.miniGame.classList.remove("hidden");
      updateMiniGameUi({ force: true });
      renderActivityScene();
      syncMobileViewportMode();
      focusOverlay(ui.miniGame);
      return;
    }
  }

  if (data.activeDialogue?.zoneId) {
    const zone = zoneDefinitions.find((entry) => entry.id === data.activeDialogue.zoneId);
    if (zone) {
      const dialogueState = buildDialogueState(zone);
      state.activeDialogue = dialogueState;
      state.dialogueIndex = clamp(data.activeDialogue.index ?? 0, 0, Math.max(0, dialogueState.lines.length - 1));
      ui.dialogueSpeaker.textContent = dialogueState.speaker;
      ui.dialogueText.textContent = dialogueState.lines[state.dialogueIndex] ?? "";
      ui.dialogueNext.textContent =
        state.dialogueIndex >= dialogueState.lines.length - 1 ? "대화 마치기" : "다음";
      ui.dialogueBox.classList.remove("hidden");
      syncMobileViewportMode();
      focusOverlay(ui.dialogueBox);
      return;
    }
  }

  if (data.activeQuiz?.id && openQuiz(data.activeQuiz.id)) {
    state.quizAssembly = createQuizAssemblyState(data.activeQuiz.choices ?? [], data.activeQuiz.selection ?? []);
    syncQuizBoard();
  }
}

function applySavedGame(data) {
  if (!data) {
    return false;
  }

  state.started = Boolean(data.started);
  state.voiceEnabled = data.voiceEnabled ?? true;
  state.controlMode = normalizeControlMode(data.controlMode ?? getStoredControlMode());
  state.autoNavigation = createAutoNavigationState();
  state.player.x = data.player?.x ?? 245;
  state.player.y = data.player?.y ?? 1110;
  state.player.facing = data.player?.facing ?? "down";
  state.player.step = data.player?.step ?? 0;
  state.camera.x = data.camera?.x ?? 0;
  state.camera.y = data.camera?.y ?? 0;
  state.camera.targetX = state.camera.x;
  state.camera.targetY = state.camera.y;
  state.storyIndex = data.storyIndex ?? 0;
  state.warmth = data.warmth ?? 0;
  state.basket = Array.isArray(data.basket) ? [...data.basket] : [];
  state.completedTasks = new Set(data.completedTasks ?? []);
  state.solvedQuizSigns = new Set(data.solvedQuizSigns ?? []);
  state.unlockedFollowers = new Set(data.unlockedFollowers ?? []);
  state.unlockedNouns = new Set(data.unlockedNouns ?? []);
  state.unlockedVerbs = new Set(data.unlockedVerbs ?? []);
  state.unlockedMood = new Set(data.unlockedMood ?? []);
  state.unlockedListening = new Set(data.unlockedListening ?? []);
  state.flags = new Set(data.flags ?? []);
  if (!state.flags.has("talkedAunt")) {
    listeningExpressions.forEach((expression) => state.unlockedListening.delete(expression.id));
  }
  if (!state.flags.has("lookoutSeen")) {
    state.unlockedMood.delete("peaceful");
  }
  if (!state.flags.has("benchRest")) {
    state.unlockedMood.delete("relaxed");
  }
  if (!state.flags.has("talkedChild")) {
    state.unlockedMood.delete("boring");
  }
  if (!state.flags.has("mudNotice")) {
    state.unlockedMood.delete("inconvenient");
  }
  if (state.completedTasks.size < 4) {
    state.unlockedMood.delete("loseTrack");
  }
  state.uiPanels.heroExpanded = false;
  state.uiPanels.storyOpen = false;
  state.uiPanels.statsOpen = false;
  state.uiPanels.journalOpen = false;
  state.dayCycle = normalizeDayCycle(data.dayCycle ?? ((data.dayStage ?? 0) + 0.04) / DAY_STAGE_LABELS.length);
  state.dayCount = Math.max(1, data.dayCount ?? 1);
  state.dayStage = getDayStageFromCycle(state.dayCycle);
  state.endingShown = Boolean(data.endingShown);
  state.pendingEnding = !state.endingShown && (Boolean(data.pendingEnding) || state.storyIndex >= storySteps.length);
  state.pausedActivity = data.pausedActivity ?? null;
  state.activeDialogue = null;
  state.dialogueIndex = 0;
  state.activeMiniGame = null;
  state.activeQuiz = null;
  state.quizAssembly = createQuizAssemblyState();
  state.hoveredZone = null;
  state.hoveredPractice = null;
  state.toastTimer = 0;
  state.expressionMoment = null;
  state.activeSlowZoneId = null;
  delete canvas.dataset.expressionMoment;
  canvas.removeAttribute("aria-description");
  resetTouchJoystick();
  state.uiFrame.miniMapLastRender = -Infinity;
  state.ambient = createAmbientState();
  state.worldPractice = createWorldPracticeState();
  syncFollowerCompanions();
  state.saveMessage = "저장된 산책 불러옴";

  ui.startCard.classList.add("hidden");
  ui.dialogueBox.classList.add("hidden");
  ui.miniGame.classList.add("hidden");
  ui.quizCard.classList.add("hidden");
  ui.promptBubble.classList.add("hidden");
  ui.endingCard.classList.toggle("hidden", !state.endingShown);

  syncUiPanels();
  updateVoiceButton();
  renderSidebar();
  if (state.endingShown) {
    showEndingCard();
  } else {
    restoreSavedOverlay(data);
    if (state.pendingEnding) {
      startWorldExpressionMoment(
        "peaceful",
        "평화롭다",
        "언덕에서 바라본 고요한 마을을 잠깐 더 느낀 뒤 오늘의 하루를 정리합니다."
      );
    }
  }
  updateSaveSummary(data);
  return true;
}

function showToast(title, description) {
  ui.toast.textContent = `${title} · ${description}`;
  ui.toast.classList.remove("hidden");
  state.toastTimer = 3.4;
}

function startWorldExpressionMoment(id, label, detail, duration = 3.6) {
  state.expressionMoment = {
    id,
    label,
    detail,
    duration,
    timer: duration
  };
  canvas.dataset.expressionMoment = id;
  canvas.setAttribute("aria-description", `${label}. ${detail}`);
}

function updateWorldExpressionMoment(dt) {
  if (
    !state.expressionMoment ||
    state.activeMiniGame ||
    state.activeDialogue ||
    state.activeQuiz ||
    state.endingShown ||
    state.uiPanels.heroExpanded ||
    state.uiPanels.journalOpen ||
    state.uiPanels.storyOpen ||
    state.uiPanels.statsOpen
  ) {
    return;
  }
  state.expressionMoment.timer = Math.max(0, state.expressionMoment.timer - dt);
  if (state.expressionMoment.timer <= 0) {
    state.expressionMoment = null;
    delete canvas.dataset.expressionMoment;
    canvas.removeAttribute("aria-description");
    if (state.pendingEnding) {
      state.pendingEnding = false;
      showEndingCard();
      persistGame("하루 마무리");
    }
  }
}

function maybeUnlockMood(id) {
  if (!state.unlockedMood.has(id)) {
    state.unlockedMood.add(id);
    renderSidebar();
    return true;
  }
  return false;
}

function maybeUnlockListening(ids = []) {
  let changed = false;
  ids.forEach((id) => {
    if (!state.unlockedListening.has(id)) {
      state.unlockedListening.add(id);
      changed = true;
    }
  });
  if (changed) {
    renderSidebar();
  }
}

function updateVoiceButton() {
  ui.voiceToggle.textContent = state.voiceEnabled ? "소리 켜짐" : "소리 꺼짐";
  ui.voiceToggle.setAttribute("aria-pressed", String(state.voiceEnabled));
}

function resetAudioPlayback(audio) {
  if (!audio) {
    return;
  }
  try {
    audio.pause();
  } catch (_) {
    return;
  }
  try {
    if (audio.readyState > 0) {
      audio.currentTime = 0;
    }
  } catch (_) {
    // Some browsers throw before metadata is loaded. In that case, keep going without rewinding.
  }
}

function tryPlayAudio(audio, onFailure = null) {
  if (!audio) {
    return;
  }
  try {
    const playback = audio.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {
        onFailure?.();
      });
    }
  } catch (_) {
    onFailure?.();
  }
}

function stopDialogueAudio() {
  resetAudioPlayback(dialogueAudioPlayer);
}

function ensureSfxPool(id) {
  if (sfxPools.has(id)) {
    return sfxPools.get(id);
  }
  const source = sfxManifest[id];
  if (!source) {
    return [];
  }
  const audio = new Audio(source);
  audio.preload = "none";
  audio.addEventListener("ended", () => {
    activeSfxPlayers.delete(audio);
  });
  const pool = [audio];
  sfxPools.set(id, pool);
  return pool;
}

function expandSfxPool(id, pool) {
  const source = sfxManifest[id];
  const maxSize = sfxDefaults[id]?.poolSize ?? 3;
  if (!source || pool.length >= maxSize) {
    return null;
  }
  const audio = new Audio(source);
  audio.preload = "none";
  audio.addEventListener("ended", () => {
    activeSfxPlayers.delete(audio);
  });
  pool.push(audio);
  return audio;
}

function stopAllAudio() {
  stopDialogueAudio();
  activeSfxPlayers.forEach((player) => {
    resetAudioPlayback(player);
  });
  activeSfxPlayers.clear();
}

function playSfx(id, options = {}) {
  if (!state.voiceEnabled) {
    return;
  }
  const source = sfxManifest[id];
  if (!source) {
    return;
  }
  const defaults = sfxDefaults[id] ?? {};
  const cooldownMs = options.cooldownMs ?? defaults.cooldownMs ?? 0;
  const cooldownKey = options.cooldownKey ?? id;
  if (cooldownMs > 0) {
    const now = performance.now();
    if (now < (sfxCooldowns.get(cooldownKey) ?? 0)) {
      return;
    }
    sfxCooldowns.set(cooldownKey, now + cooldownMs);
  }
  const pool = ensureSfxPool(id);
  if (pool.length === 0) {
    return;
  }
  const player = pool.find((entry) => entry.paused || entry.ended) ?? expandSfxPool(id, pool) ?? pool[0];
  resetAudioPlayback(player);
  player.volume = clamp(options.volume ?? defaults.volume ?? 0.5, 0, 1);
  player.playbackRate = clamp(options.playbackRate ?? defaults.playbackRate ?? 1, 0.55, 1.7);
  activeSfxPlayers.add(player);
  tryPlayAudio(player, () => {
    activeSfxPlayers.delete(player);
  });
}

function playDialogueAudio(zoneId, lineIndex) {
  if (!state.voiceEnabled) {
    return;
  }
  const source = dialogueAudioManifest[zoneId]?.[lineIndex];
  if (!source) {
    return;
  }
  if (dialogueAudioPlayer.src.endsWith(source)) {
    resetAudioPlayback(dialogueAudioPlayer);
  } else {
    dialogueAudioPlayer.src = source;
  }
  tryPlayAudio(dialogueAudioPlayer);
}

function awardWarmth(amount) {
  state.warmth += amount;
}

function addBasketItem(item) {
  if (!item || state.basket.includes(item)) {
    return;
  }
  state.basket.push(item);
}

function getCurrentStoryStep() {
  return storySteps[Math.min(state.storyIndex, storySteps.length - 1)] ?? null;
}

function getCurrentTargetZones() {
  const availableById = new Map(getAvailableZones().map((zone) => [zone.id, zone]));
  const completionFlags = {
    busStop: "talkedAunt",
    bench: "benchRest",
    pondChild: "talkedChild",
    dinnerTable: "dinnerServed",
    lookout: "lookoutSeen"
  };
  return (getCurrentStoryStep()?.targetZoneIds ?? [])
    .map((id) => availableById.get(id))
    .filter((zone) => {
      if (!zone) {
        return false;
      }
      if (zone.taskId && state.completedTasks.has(zone.taskId)) {
        return false;
      }
      const completionFlag = completionFlags[zone.id];
      return !completionFlag || !state.flags.has(completionFlag);
    });
}

function getStoryProgressPercent() {
  return storySteps.length === 0 ? 100 : (state.storyIndex / storySteps.length) * 100;
}

function announceDayStage(stage = state.dayStage) {
  playSfx("dayChime", {
    volume: 0.3,
    playbackRate: 0.96 + stage * 0.04
  });
  showToast(`${getDayStageLabel(stage)}이 되었습니다`, DAY_STAGE_HINTS[stage] ?? DAY_STAGE_HINTS[0]);
}

function syncDayStage(options = {}) {
  const { announce = false } = options;
  const previousStage = state.dayStage;
  state.dayStage = getDayStageFromCycle(state.dayCycle);
  if (announce && state.started && state.dayStage !== previousStage) {
    announceDayStage(state.dayStage);
  }
  return state.dayStage !== previousStage;
}

function advanceDayCycle(seconds, options = {}) {
  const { announce = false } = options;
  if (seconds <= 0) {
    return false;
  }
  const previousCycle = state.dayCycle;
  state.dayCycle = normalizeDayCycle(state.dayCycle + seconds / DAY_CYCLE_DURATION);
  if (state.dayCycle < previousCycle) {
    state.dayCount += 1;
  }
  return syncDayStage({ announce });
}

function advanceDayCycleForAction(seconds, reason = "") {
  const changed = advanceDayCycle(seconds, { announce: false });
  if (changed && reason) {
    showToast(`${getDayStageLabel()}이 되었습니다`, `${reason} ${DAY_STAGE_HINTS[state.dayStage]}`);
  }
}

function renderTimeHud() {
  const stageLabel = getDayStageLabel();
  const clockText = getDayClockText();
  const detailText = state.device?.prefersCompactHud
    ? `${clockText} · ${state.dayCount}일차`
    : `${clockText} · ${state.dayCount}일차 · ${DAY_STAGE_HINTS[state.dayStage]}`;
  const progressWidth = `${(normalizeDayCycle(state.dayCycle) * 100).toFixed(1)}%`;
  const signature = `${stageLabel}|${clockText}|${state.warmth}|${detailText}|${progressWidth}`;
  if (signature === state.uiFrame.timeHudSignature) {
    return;
  }
  state.uiFrame.timeHudSignature = signature;
  ui.statsToggleLabel.textContent = `${stageLabel} ${clockText} · 온기 ${state.warmth}`;
  if (ui.timeOfDayValue) {
    ui.timeOfDayValue.textContent = stageLabel;
  }
  if (ui.timeOfDayDetail) {
    ui.timeOfDayDetail.textContent = detailText;
  }
  if (ui.timeProgressFill) {
    ui.timeProgressFill.style.width = progressWidth;
  }
}

function showEndingCard() {
  closeOptionalPanels();
  state.pendingEnding = false;
  state.endingShown = true;
  ui.endingTitle.textContent = "시골 마을의 하루가 저녁빛에 닿았습니다";
  ui.endingBody.textContent =
    "부탁을 따라 움직이다 보니 표현이 공부가 아니라 장면으로 남았습니다. 이제 마을의 냄새와 손의 감각으로 단어가 기억되는 상태입니다.";
  ui.endingTasks.textContent = `${state.completedTasks.size}/${collocations.length}`;
  ui.endingWarmth.textContent = `${state.warmth}`;
  ui.endingQuizCount.textContent = `${state.solvedQuizSigns.size}/${quizSignDefinitions.length}`;
  const missedExpressions = quizSignDefinitions
    .filter((quiz) => !state.solvedQuizSigns.has(quiz.id))
    .map((quiz) => quiz.expression);
  const feltMoodExpressions = moodExpressions
    .filter((expression) => state.unlockedMood.has(expression.id))
    .map((expression) => expression.label);
  const metListeningExpressions = listeningExpressions
    .filter((expression) => state.unlockedListening.has(expression.id))
    .map((expression) => expression.label);
  const missedMoodExpressions = moodExpressions
    .filter((expression) => !state.unlockedMood.has(expression.id))
    .map((expression) => expression.label);
  const missedListeningExpressions = listeningExpressions
    .filter((expression) => !state.unlockedListening.has(expression.id))
    .map((expression) => expression.label);
  const reviewLines = [
    missedExpressions.length
      ? `팻말에서 다시 확인할 표현: ${missedExpressions.join(", ")}`
      : `몸으로 익히고 팻말에서 확인한 표현: ${quizSignDefinitions.map((quiz) => quiz.expression).join(", ")}`,
    feltMoodExpressions.length ? `마을에서 느낀 표현: ${feltMoodExpressions.join(", ")}` : "",
    metListeningExpressions.length ? `대사에서 만난 표현: ${metListeningExpressions.join(", ")}` : "",
    missedMoodExpressions.length ? `아직 못 느낀 표현: ${missedMoodExpressions.join(", ")}` : "",
    missedListeningExpressions.length ? `아직 못 만난 대사 표현: ${missedListeningExpressions.join(", ")}` : ""
  ].filter(Boolean);
  ui.endingExpressionSummary.textContent = reviewLines.join(" · ");
  ui.endingCard.classList.remove("hidden");
  syncMobileViewportMode();
  focusOverlay(ui.endingCard);
}

function advanceStoryProgress() {
  let advanced = false;
  while (state.storyIndex < storySteps.length && storySteps[state.storyIndex].check(state)) {
    const step = storySteps[state.storyIndex];
    awardWarmth(step.reward);
    state.storyIndex += 1;
    advanced = true;
    showToast(step.toastTitle, step.toastBody);
  }
  syncDayStage();
  if (advanced && state.storyIndex >= storySteps.length && !state.endingShown) {
    if (state.expressionMoment) {
      state.pendingEnding = true;
    } else {
      showEndingCard();
    }
  }
  if (advanced) {
    persistGame("진행");
  }
  return advanced;
}

function getDinnerMissingItems() {
  const requiredTasks = [
    { id: "vegetableGrow", label: "싱싱한 채소" },
    { id: "raiseLivestock", label: "달걀 꾸러미" },
    { id: "catchFish", label: "은빛 물고기" }
  ];
  return requiredTasks.filter((entry) => !state.completedTasks.has(entry.id)).map((entry) => entry.label);
}

function renderHud() {
  const currentStep = getCurrentStoryStep();
  const progressPercent = clamp(getStoryProgressPercent(), 0, 100);
  const storySummary =
    state.storyIndex >= storySteps.length ? "오늘 완료" : currentStep?.title ?? "마을 산책";
  ui.storyTitle.textContent =
    state.storyIndex >= storySteps.length ? "하루를 잘 마무리했습니다" : currentStep?.title ?? "마을을 둘러보는 중";
  ui.storyBody.textContent =
    state.storyIndex >= storySteps.length
      ? "원하면 다시 시작해서 다른 순서로 돌아다녀도 됩니다."
      : currentStep?.body ?? "마을을 천천히 걸으며 다음 할 일을 찾아보세요.";
  ui.storyToggleLabel.textContent = storySummary;
  ui.storyProgressFill.style.width = `${progressPercent}%`;
  ui.storyProgressLabel.textContent =
    state.storyIndex >= storySteps.length ? "완료" : `${state.storyIndex + 1}/${storySteps.length}`;
  ui.warmthValue.textContent = `${state.warmth}`;

  const basketItems = state.basket.length > 0 ? state.basket : ["아직 바구니가 비어 있습니다"];
  ui.basketList.innerHTML = basketItems
    .map((item, index) => renderBasketChip(item, state.basket.length === 0 && index === 0))
    .join("");
  ui.saveStatus.textContent = state.saveMessage;
  renderTimeHud();
}

function renderMiniMap() {
  const mapWidth = ui.miniMap.width;
  const mapHeight = ui.miniMap.height;
  const scaleX = mapWidth / world.width;
  const scaleY = mapHeight / world.height;
  const targetZones = getCurrentTargetZones();

  miniMapCtx.clearRect(0, 0, mapWidth, mapHeight);

  const miniMapSkyStops = [
    { top: "#cee0ef", bottom: "#e7edcb" },
    { top: "#f1dfb9", bottom: "#e4e4b5" },
    { top: "#d9e3f2", bottom: "#d2ddb6" },
    { top: "#e5ba90", bottom: "#b7c08c" },
    { top: "#4f5976", bottom: "#778968" }
  ];
  const { current, next, blend } = getCurrentDayBlendInfo();
  const skyGradient = miniMapCtx.createLinearGradient(0, 0, 0, mapHeight);
  skyGradient.addColorStop(0, mixColor(miniMapSkyStops[current].top, miniMapSkyStops[next].top, blend));
  skyGradient.addColorStop(1, mixColor(miniMapSkyStops[current].bottom, miniMapSkyStops[next].bottom, blend));
  miniMapCtx.fillStyle = skyGradient;
  miniMapCtx.fillRect(0, 0, mapWidth, mapHeight);

  miniMapCtx.save();
  miniMapCtx.scale(mapWidth / MINIMAP_BASE_SIZE, mapHeight / MINIMAP_BASE_SIZE);
  miniMapCtx.fillStyle = "rgba(126, 174, 104, 0.18)";
  miniMapCtx.fillRect(16, 12, 58, 40);
  miniMapCtx.fillRect(80, 16, 40, 24);
  miniMapCtx.fillRect(48, 102, 34, 24);
  miniMapCtx.fillStyle = "rgba(114, 166, 189, 0.3)";
  miniMapCtx.beginPath();
  miniMapCtx.ellipse(146, 128, 20, 15, 0, 0, Math.PI * 2);
  miniMapCtx.fill();

  miniMapCtx.strokeStyle = "rgba(162, 138, 103, 0.8)";
  miniMapCtx.lineWidth = 6;
  miniMapCtx.beginPath();
  miniMapCtx.moveTo(20, 16);
  miniMapCtx.lineTo(20, 164);
  miniMapCtx.moveTo(20, 94);
  miniMapCtx.lineTo(100, 94);
  miniMapCtx.lineTo(142, 94);
  miniMapCtx.stroke();
  miniMapCtx.restore();

  zoneDefinitions.forEach((zone) => {
    if (zone.type === "story") {
      return;
    }
    if (zone.requires && !zone.requires(state) && zone.hiddenUntilAvailable) {
      return;
    }

    const x = zone.x * scaleX;
    const y = zone.y * scaleY;
    const isCurrent = targetZones.some((target) => target.id === zone.id);
    let color = "rgba(61, 88, 58, 0.38)";

    if (zone.type === "dialogue") {
      color = "rgba(91, 121, 171, 0.72)";
    } else if (zone.type === "mood") {
      color = "rgba(211, 166, 74, 0.72)";
    } else if (zone.type === "delivery") {
      color = "rgba(215, 123, 90, 0.74)";
    } else if (zone.type === "task" && state.completedTasks.has(zone.taskId)) {
      color = "rgba(111, 167, 102, 0.68)";
    } else if (zone.type === "task") {
      color = "rgba(84, 125, 80, 0.58)";
    }

    miniMapCtx.fillStyle = isCurrent ? "rgba(214, 114, 78, 0.95)" : color;
    miniMapCtx.beginPath();
    miniMapCtx.arc(x, y, isCurrent ? 4.8 : 3.4, 0, Math.PI * 2);
    miniMapCtx.fill();
  });

  miniMapCtx.strokeStyle = "rgba(31, 47, 31, 0.2)";
  miniMapCtx.lineWidth = 2;
  miniMapCtx.strokeRect(
    state.camera.x * scaleX,
    state.camera.y * scaleY,
    canvas.width * scaleX,
    canvas.height * scaleY
  );

  miniMapCtx.fillStyle = "#c15f3f";
  miniMapCtx.beginPath();
  miniMapCtx.arc(state.player.x * scaleX, state.player.y * scaleY, 4.5, 0, Math.PI * 2);
  miniMapCtx.fill();
}

function renderSidebar() {
  ui.storyList.innerHTML = storySteps
    .map((step, index) => {
      const completed = index < state.storyIndex;
      const current = index === state.storyIndex && state.storyIndex < storySteps.length;
      return `
        <li class="progress-item ${completed ? "is-complete" : ""} ${current ? "is-current" : ""}">
          <strong>${completed ? "완료" : current ? "현재 목표" : "예정"} · ${step.title}</strong>
          <span>${step.body}</span>
        </li>
      `;
    })
    .join("");

  ui.nounsList.innerHTML = nounWords
    .map(
      (item) => `
        <div class="chip ${state.unlockedNouns.has(item.id) ? "is-unlocked" : ""}">
          <strong>${item.label}</strong>
          <small>${item.hint}</small>
        </div>
      `
    )
    .join("");

  ui.verbsList.innerHTML = verbWords
    .map(
      (item) => `
        <div class="chip ${state.unlockedVerbs.has(item.id) ? "is-unlocked" : ""}">
          <strong>${item.label}</strong>
          <small>${item.hint}</small>
        </div>
      `
    )
    .join("");

  ui.taskList.innerHTML = collocations
    .map((item) => {
      const zone = zoneDefinitions.find((entry) => entry.taskId === item.id);
      const locked = zone?.requires && !zone.requires(state);
      const completed = state.completedTasks.has(item.id);
      const quiz = getQuizSignDefinition(item.id);
      const checked = quiz ? state.solvedQuizSigns.has(quiz.id) : false;
      const quizStatus = checked
        ? "표현 확인 완료"
        : completed
          ? "마을 팻말이 열림"
          : "활동을 마치면 팻말이 열림";
      return `
        <li class="progress-item ${completed ? "is-complete" : ""} ${locked && !completed ? "is-locked" : ""}">
          <strong>${completed ? "완료" : locked ? "잠김" : "진행 가능"} · ${item.label}</strong>
          <span>${locked && !completed ? "모종을 심고 벤치에서 잠시 쉬면 열립니다." : item.hint} · ${quizStatus}</span>
        </li>
      `;
    })
    .join("");

  ui.moodList.innerHTML = moodExpressions
    .map((item) => {
      const unlocked = state.unlockedMood.has(item.id);
      return `
        <li class="progress-item ${unlocked ? "is-complete" : ""}">
          <strong>${unlocked ? "기억남" : "아직 못 느낌"} · ${item.label}</strong>
          <span>${item.hint}</span>
        </li>
      `;
    })
    .join("");

  ui.listeningList.innerHTML = listeningExpressions
    .map((item) => {
      const unlocked = state.unlockedListening.has(item.id);
      return `
        <li class="progress-item ${unlocked ? "is-complete" : ""}">
          <strong>${unlocked ? "대사에서 만남" : "아직 못 만남"} · ${item.label}</strong>
          <span>${item.hint}</span>
        </li>
      `;
    })
    .join("");

  const unlockedExpressionCount =
    state.unlockedNouns.size +
    state.unlockedVerbs.size +
    state.completedTasks.size +
    state.unlockedMood.size +
    state.unlockedListening.size;
  ui.journalToggleLabel.textContent =
    unlockedExpressionCount > 0 ? `표현 ${unlockedExpressionCount}개` : "표현 펼치기";

  renderHud();
}

function resetState(options = {}) {
  const { clearSave = true } = options;
  stopAllAudio();
  if (clearSave) {
    clearSavedGame();
  }
  state.started = false;
  state.voiceEnabled = true;
  state.keys.clear();
  state.touchKeys.clear();
  resetTouchJoystick();
  state.interactQueued = false;
  state.autoNavigation = createAutoNavigationState();
  state.player.x = 245;
  state.player.y = 1110;
  state.player.facing = "down";
  state.player.step = 0;
  state.camera.x = 0;
  state.camera.y = 0;
  state.camera.targetX = 0;
  state.camera.targetY = 0;
  state.hoveredZone = null;
  state.hoveredPractice = null;
  state.activeDialogue = null;
  state.dialogueIndex = 0;
  state.activeMiniGame = null;
  state.pausedActivity = null;
  state.activeQuiz = null;
  state.quizAssembly = createQuizAssemblyState();
  state.storyIndex = 0;
  state.warmth = 0;
  state.basket = [];
  state.completedTasks.clear();
  state.solvedQuizSigns.clear();
  state.unlockedFollowers.clear();
  state.followers = createFollowerState();
  state.unlockedNouns.clear();
  state.unlockedVerbs.clear();
  state.unlockedMood.clear();
  state.unlockedListening.clear();
  state.flags.clear();
  state.uiPanels.heroExpanded = false;
  state.uiPanels.storyOpen = false;
  state.uiPanels.statsOpen = false;
  state.uiPanels.journalOpen = false;
  state.toastTimer = 0;
  state.expressionMoment = null;
  state.activeSlowZoneId = null;
  delete canvas.dataset.expressionMoment;
  canvas.removeAttribute("aria-description");
  state.uiFrame.miniMapLastRender = -Infinity;
  state.ambient = createAmbientState();
  state.worldPractice = createWorldPracticeState();
  state.dayCycle = 0;
  state.dayCount = 1;
  state.dayStage = 0;
  state.endingShown = false;
  state.pendingEnding = false;
  state.controlTutorial.open = false;
  state.controlTutorial.step = 0;
  state.controlTutorial.pendingLaunch = null;
  state.controlTutorial.fallbackMessage = "";
  delete document.body.dataset.tutorialStep;
  delete document.body.dataset.tutorialMode;
  ui.resetButton.textContent = "하루 다시 시작";
  ui.resetButton.classList.remove("is-confirming");
  state.saveMessage = "새 하루 준비 중";
  ui.startCard.classList.remove("hidden");
  ui.dialogueBox.classList.add("hidden");
  ui.miniGame.classList.add("hidden");
  ui.quizCard.classList.add("hidden");
  ui.promptBubble.classList.add("hidden");
  ui.endingCard.classList.add("hidden");
  ui.controlTutorial.classList.add("hidden");
  ui.tapTutorialTarget.classList.add("hidden");
  ui.touchJoystick.classList.remove("is-tutorial-target");
  ui.touchAction.classList.remove("is-tutorial-target");
  unlockTutorialBackgroundFocus();
  syncUiPanels();
  updateVoiceButton();
  syncDayStage();
  renderSidebar();
  updateSaveSummary(clearSave ? null : loadSavedGame());
  focusOverlay(ui.startCard);
}

function setPrompt(text) {
  const resolvedText = text
    ? state.device?.isTouch
      ? state.controlMode === "tap"
        ? text
            .replace(/^E\s*-\s*/, "대상 터치 · ")
            .replace(/E로/g, "대상을 눌러")
            .replace(/E 키/g, "대상 터치")
        : text
            .replace(/^E\s*-\s*/, "행동 버튼 · ")
            .replace(/E로/g, "행동 버튼으로")
            .replace(/E 키/g, "행동 버튼")
      : text
    : "";
  if (resolvedText === state.uiFrame.promptSignature) {
    return;
  }
  state.uiFrame.promptSignature = resolvedText;
  if (!resolvedText) {
    ui.promptBubble.classList.add("hidden");
    return;
  }
  ui.promptBubble.textContent = resolvedText;
  ui.promptBubble.classList.remove("hidden");
}

function getAvailableZones() {
  return zoneDefinitions.filter((zone) => {
    if (zone.type === "task" && state.completedTasks.has(zone.taskId)) {
      return false;
    }
    if (zone.requires && !zone.requires(state)) {
      return !zone.hiddenUntilAvailable;
    }
    return true;
  });
}

function getNearestZone() {
  let bestZone = null;
  let bestDistance = Infinity;
  for (const zone of getAvailableZones()) {
    const distance = Math.hypot(state.player.x - zone.x, state.player.y - zone.y);
    const interactionRadius = zone.radius + getInteractionAssist("zone");
    if (distance < interactionRadius && distance < bestDistance) {
      bestZone = zone;
      bestDistance = distance;
    }
  }
  return bestZone;
}

function setWorldPracticeFeedback(text) {
  state.worldPractice.feedback = text;
  state.worldPractice.feedbackTimer = 2.2;
}

function emitWorldPracticeBurst(x, y, palette, options = {}) {
  const count = options.count ?? 6;
  for (let index = 0; index < count; index += 1) {
    emitAmbientParticle(x + randomRange(-6, 6), y + randomRange(-4, 4), {
      color: palette[index % palette.length],
      vx: randomRange(options.minVx ?? -22, options.maxVx ?? 22),
      vy: randomRange(options.minVy ?? -30, options.maxVy ?? -8),
      size: randomRange(options.minSize ?? 2, options.maxSize ?? 4),
      life: randomRange(options.minLife ?? 0.35, options.maxLife ?? 0.65),
      kind: options.kind ?? "dot"
    });
  }
}

function getWorldPracticeToolPose() {
  const dirX = state.player.facing === "left" ? -1 : state.player.facing === "right" ? 1 : 0;
  const dirY = state.player.facing === "up" ? -1 : state.player.facing === "down" ? 1 : 0;
  return {
    x: state.player.x + dirX * 18,
    y: state.player.y - 8 + dirY * 10,
    dirX,
    dirY
  };
}

function getWorldFishingLurePose() {
  const pose = getWorldPracticeToolPose();
  const dirX = pose.dirX || (state.player.facing === "left" ? -1 : state.player.facing === "right" ? 1 : 0);
  const dirY = pose.dirY || (state.player.facing === "up" ? -1 : 1);
  return {
    x: state.player.x + dirX * 92 + (dirY === 0 ? 0 : 10),
    y: state.player.y - 14 + dirY * 76,
    dirX,
    dirY
  };
}

function storeCarriedWorldTool() {
  const practice = state.worldPractice;
  if (practice.carriedTool === "seedlings" && practice.toolCharges > 0) {
    practice.vegetable.tray.seedlings = Math.min(
      practice.vegetable.tray.maxSeedlings,
      practice.vegetable.tray.seedlings + practice.toolCharges
    );
  }
  if (practice.carriedTool === "bucket") {
    practice.vegetable.bucket.water = practice.toolCharges;
  }
  if (practice.carriedTool === "feed" && practice.toolCharges > 0) {
    practice.barn.source.servings = Math.max(practice.barn.source.servings, practice.toolCharges);
  }
  if (practice.carriedTool === "rod") {
    practice.pond.cast.timer = 0;
    practice.pond.cast.hooked = false;
    practice.pond.cast.hookSoundTimer = 0;
  }
  if (practice.carriedTool === "mower") {
    practice.lawn.source.attached = false;
    practice.lawn.source.x = practice.lawn.source.xHome;
    practice.lawn.source.y = practice.lawn.source.yHome;
    practice.lawn.source.tilt = 0;
  }
  practice.toolCharges = 0;
  practice.carryingCatch = false;
}

function equipWorldPracticeTool(type, charges = 0) {
  storeCarriedWorldTool();
  state.worldPractice.carriedTool = type;
  state.worldPractice.toolCharges = charges;
  if (type === "mower") {
    state.worldPractice.lawn.source.attached = true;
  }
}

function clearWorldPracticeTool() {
  storeCarriedWorldTool();
  state.worldPractice.carriedTool = null;
}

function getWorldPracticeRowCellTarget(row, player, radiusY = 18) {
  if (player.x < row.x1 - 12 || player.x > row.x1 + row.w + 12 || Math.abs(player.y - row.y) > radiusY) {
    return null;
  }
  const cellWidth = row.w / row.cells.length;
  const index = clamp(Math.floor((player.x - row.x1) / cellWidth), 0, row.cells.length - 1);
  return {
    index,
    x: row.x1 + index * cellWidth + cellWidth * 0.5,
    y: row.y,
    width: cellWidth
  };
}

function markWorldPracticeMoment(flag, title, body) {
  if (state.flags.has(flag)) {
    return;
  }
  state.flags.add(flag);
  awardWarmth(2);
  showToast(title, body);
}

function getNearestWorldPracticeTargetLegacy() {
  const practice = state.worldPractice;
  const player = state.player;
  const targets = [];
  const addTarget = (target) => {
    target.distance = Math.hypot(player.x - target.x, player.y - target.y);
    targets.push(target);
  };

  if (state.completedTasks.has("gardenCare")) {
    addTarget({
      id: "garden-source",
      x: practice.garden.source.x,
      y: practice.garden.source.y,
      radius: 42,
      prompt: practice.carriedTool === "shears" ? "E - 전지가위를 걸어두기" : "E - 전지가위 들기"
    });
    if (practice.carriedTool === "shears") {
      practice.garden.shrubs.forEach((shrub, index) => {
        if (shrub.trim < 1) {
          addTarget({
            id: `garden-shrub-${index}`,
            x: shrub.x,
            y: shrub.y,
            radius: 42,
            prompt: "E - 덤불 다듬기",
            shrubIndex: index
          });
        }
      });
      practice.garden.topiaries.forEach((topiary, index) => {
        if (topiary.trim < 1) {
          addTarget({
            id: `garden-topiary-${index}`,
            x: topiary.x,
            y: topiary.y,
            radius: 42,
            prompt: "E - 장식수 다듬기",
            label: "장식수",
            kind: "work",
            topiaryIndex: index
          });
        }
      });
      practice.garden.topiaries.forEach((topiary, index) => {
        if (topiary.trim < 1) {
          addTarget({
            id: `garden-topiary-${index}`,
            x: topiary.x,
            y: topiary.y,
            radius: 42,
            prompt: "E - 장식수 다듬기",
            label: "장식수",
            kind: "work",
            topiaryIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("lawnTrim")) {
    addTarget({
      id: "lawn-source",
      x: practice.lawn.source.xHome,
      y: practice.lawn.source.yHome,
      radius: 44,
      prompt: practice.carriedTool === "mower" ? "E - 잔디깎는 기계 세워두기" : "E - 잔디깎는 기계 밀기"
    });
  }

  if (state.completedTasks.has("vegetablePlant") && state.completedTasks.has("vegetableGrow")) {
    addTarget({
      id: "vegetable-tray",
      x: practice.vegetable.tray.x,
      y: practice.vegetable.tray.y,
      radius: 40,
      prompt: practice.carriedTool === "seedlings" ? "E - 모종 상자 내려두기" : "E - 모종 상자 들기"
    });
    addTarget({
      id: "vegetable-bucket",
      x: practice.vegetable.bucket.x,
      y: practice.vegetable.bucket.y,
      radius: 38,
      prompt: practice.carriedTool === "bucket" ? "E - 양동이 내려두기" : "E - 양동이 들기"
    });
    if (practice.carriedTool === "bucket" && practice.toolCharges < practice.vegetable.bucket.capacity) {
      addTarget({
        id: "vegetable-well",
        x: practice.vegetable.well.x,
        y: practice.vegetable.well.y,
        radius: 44,
        prompt: "E - 우물에서 물 채우기"
      });
    }
    practice.vegetable.plots.forEach((plot, index) => {
      if (practice.carriedTool === "seedlings" && !plot.planted) {
        addTarget({
          id: `vegetable-plant-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 모종 심기",
          plotIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && plot.planted && !plot.watered) {
        addTarget({
          id: `vegetable-water-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 물 주기",
          plotIndex: index
        });
      }
    });
    practice.vegetable.planters.forEach((planter, index) => {
      if (practice.carriedTool === "seedlings" && !planter.planted) {
        addTarget({
          id: `vegetable-planter-plant-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 심기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && planter.planted && !planter.watered) {
        addTarget({
          id: `vegetable-planter-water-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 물 주기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
    });
    practice.vegetable.planters.forEach((planter, index) => {
      if (practice.carriedTool === "seedlings" && !planter.planted) {
        addTarget({
          id: `vegetable-planter-plant-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 심기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && planter.planted && !planter.watered) {
        addTarget({
          id: `vegetable-planter-water-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 물 주기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
    });
  }

  if (state.completedTasks.has("farmWork")) {
    addTarget({
      id: "field-source",
      x: practice.field.source.x,
      y: practice.field.source.y,
      radius: 42,
      prompt: practice.carriedTool === "hoe" ? "E - 호미 세워두기" : "E - 호미 들기"
    });
    if (practice.carriedTool === "hoe") {
      practice.field.rows.forEach((row, rowIndex) => {
        const cellWidth = row.w / row.cells.length;
        const cellTargets = state.controlMode === "tap"
          ? row.cells.map((_, index) => ({
              index,
              x: row.x1 + index * cellWidth + cellWidth * 0.5,
              y: row.y
            }))
          : [getWorldPracticeRowCellTarget(row, player)].filter(Boolean);
        cellTargets.forEach((cellTarget) => {
          if (row.cells[cellTarget.index] >= 1) return;
          addTarget({
            id: `field-row-${rowIndex}-${cellTarget.index}`,
            x: cellTarget.x,
            y: cellTarget.y,
            radius: 40,
            prompt: "E - 고랑 다지기",
            rowIndex,
            cellIndex: cellTarget.index
          });
        });
      });
      practice.field.sidePatches.forEach((patch, index) => {
        if (patch.tilled < 1) {
          addTarget({
            id: `field-side-${index}`,
            x: patch.x,
            y: patch.y,
            radius: 42,
            prompt: "E - 길가 흙 다지기",
            label: "흙자리",
            kind: "work",
            sidePatchIndex: index
          });
        }
      });
      practice.field.sidePatches.forEach((patch, index) => {
        if (patch.tilled < 1) {
          addTarget({
            id: `field-side-${index}`,
            x: patch.x,
            y: patch.y,
            radius: 42,
            prompt: "E - 길가 흙 다지기",
            label: "흙자리",
            kind: "work",
            sidePatchIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("raiseLivestock")) {
    addTarget({
      id: "barn-source",
      x: practice.barn.source.x,
      y: practice.barn.source.y,
      radius: 42,
      prompt: practice.carriedTool === "feed" ? "E - 사료 자루 내려두기" : "E - 사료 자루 들기"
    });
    if (practice.carriedTool === "feed") {
      practice.barn.troughs.forEach((trough, index) => {
        if (trough.fill < 1) {
          addTarget({
            id: `barn-trough-${index}`,
            x: trough.x,
            y: trough.y,
            radius: 42,
            prompt: "E - 먹이통 채우기",
            troughIndex: index
          });
        }
      });
      practice.barn.feedSpots.forEach((spot, index) => {
        if (spot.fill < 1) {
          addTarget({
            id: `barn-feed-spot-${index}`,
            x: spot.x,
            y: spot.y,
            radius: 42,
            prompt: spot.visitor === "cat" ? "E - 고양이 그릇 채우기" : "E - 새 모이판 채우기",
            label: spot.visitor === "cat" ? "밥그릇" : "모이판",
            kind: "work",
            feedSpotIndex: index
          });
        }
      });
      practice.barn.feedSpots.forEach((spot, index) => {
        if (spot.fill < 1) {
          addTarget({
            id: `barn-feed-spot-${index}`,
            x: spot.x,
            y: spot.y,
            radius: 42,
            prompt: spot.visitor === "cat" ? "E - 고양이 그릇 채우기" : "E - 새 모이판 채우기",
            label: spot.visitor === "cat" ? "밥그릇" : "모이판",
            kind: "work",
            feedSpotIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("catchFish")) {
    addTarget({
      id: "pond-source",
      x: practice.pond.source.x,
      y: practice.pond.source.y,
      radius: 42,
      prompt: practice.carriedTool === "net" ? "E - 뜰채 내려두기" : "E - 뜰채 들기"
    });
    if (practice.carriedTool === "net") {
      if (practice.carryingCatch) {
        addTarget({
          id: "pond-basket",
          x: practice.pond.basket.x,
          y: practice.pond.basket.y,
          radius: 44,
          prompt: "E - 바구니에 물고기 담기"
        });
      } else {
        practice.pond.skimmers.forEach((skimmer, index) => {
          if (!skimmer.cleared) {
            addTarget({
              id: `pond-skimmer-${index}`,
              x: skimmer.x,
              y: skimmer.y,
              radius: 42,
              prompt: skimmer.kind === "toy" ? "E - 뜰채로 장난감 건지기" : "E - 뜬 잎 건지기",
              label: skimmer.kind === "toy" ? "장난감" : "뜬 잎",
              kind: "work",
              skimmerIndex: index
            });
          }
        });
        practice.pond.fish.forEach((fish, index) => {
          if (!fish.caught) {
            addTarget({
              id: `pond-fish-${index}`,
              x: fish.x,
              y: fish.y,
              radius: 46,
              prompt: "E - 뜰채 휘두르기",
              fishIndex: index
            });
          }
        });
      }
    }
  }

  let best = null;
  let bestDistance = Infinity;
  targets.forEach((target) => {
    if (target.distance <= target.radius && target.distance < bestDistance) {
      best = target;
      bestDistance = target.distance;
    }
  });
  return best;
}

function buildWorldPracticeTargetsLegacy() {
  const practice = state.worldPractice;
  const player = state.player;
  const targets = [];
  const addTarget = (target) => {
    target.distance = Math.hypot(player.x - target.x, player.y - target.y);
    targets.push(target);
  };

  if (state.completedTasks.has("gardenCare")) {
    addTarget({
      id: "garden-source",
      x: practice.garden.source.x,
      y: practice.garden.source.y,
      radius: 42,
      prompt: practice.carriedTool === "shears" ? "E - 전지 가위 내려놓기" : "E - 전지 가위 집기",
      label: "전지 가위",
      kind: "tool"
    });
    if (practice.carriedTool === "shears") {
      practice.garden.shrubs.forEach((shrub, index) => {
        if (shrub.trim < 1) {
          addTarget({
            id: `garden-shrub-${index}`,
            x: shrub.x,
            y: shrub.y,
            radius: 42,
            prompt: "E - 덤불 다듬기",
            label: "덤불",
            kind: "work",
            shrubIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("lawnTrim")) {
    addTarget({
      id: "lawn-source",
      x: practice.lawn.source.xHome,
      y: practice.lawn.source.yHome,
      radius: 44,
      prompt: practice.carriedTool === "mower" ? "E - 잔디깎는 기계 내려놓기" : "E - 잔디깎는 기계 잡기",
      label: "잔디깎는 기계",
      kind: "tool"
    });
    if (practice.carriedTool === "mower") {
      practice.lawn.verges.forEach((patch, index) => {
        if (patch.cut < 1) {
          addTarget({
            id: `lawn-verge-${index}`,
            x: patch.x,
            y: patch.y,
            radius: 44,
            prompt: "밀어 지나가면 길가 풀이 정리됩니다",
            label: "길가 풀",
            kind: "work",
            vergeIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("vegetablePlant") && state.completedTasks.has("vegetableGrow")) {
    addTarget({
      id: "vegetable-tray",
      x: practice.vegetable.tray.x,
      y: practice.vegetable.tray.y,
      radius: 40,
      prompt: practice.carriedTool === "seedlings" ? "E - 모종 상자 내려놓기" : "E - 모종 상자 들기",
      label: "모종 상자",
      kind: "tool"
    });
    addTarget({
      id: "vegetable-bucket",
      x: practice.vegetable.bucket.x,
      y: practice.vegetable.bucket.y,
      radius: 38,
      prompt: practice.carriedTool === "bucket" ? "E - 양동이 내려놓기" : "E - 양동이 들기",
      label: "양동이",
      kind: "tool"
    });
    if (practice.carriedTool === "bucket" && practice.toolCharges < practice.vegetable.bucket.capacity) {
      addTarget({
        id: "vegetable-well",
        x: practice.vegetable.well.x,
        y: practice.vegetable.well.y,
        radius: 44,
        prompt: "E - 우물에서 물 채우기",
        label: "우물",
        kind: "station"
      });
    }
    practice.vegetable.plots.forEach((plot, index) => {
      if (practice.carriedTool === "seedlings" && !plot.planted) {
        addTarget({
          id: `vegetable-plant-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 모종 심기",
          label: "텃밭",
          kind: "work",
          plotIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && plot.planted && !plot.watered) {
        addTarget({
          id: `vegetable-water-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 물 주기",
          label: "텃밭",
          kind: "work",
          plotIndex: index
        });
      }
    });
  }

  if (state.completedTasks.has("farmWork")) {
    addTarget({
      id: "field-source",
      x: practice.field.source.x,
      y: practice.field.source.y,
      radius: 42,
      prompt: practice.carriedTool === "hoe" ? "E - 호미 내려놓기" : "E - 호미 들기",
      label: "호미",
      kind: "tool"
    });
    if (practice.carriedTool === "hoe") {
      practice.field.rows.forEach((row, rowIndex) => {
        const cellWidth = row.w / row.cells.length;
        const cellTargets = state.controlMode === "tap"
          ? row.cells.map((_, index) => ({
              index,
              x: row.x1 + index * cellWidth + cellWidth * 0.5,
              y: row.y
            }))
          : [getWorldPracticeRowCellTarget(row, player)].filter(Boolean);
        cellTargets.forEach((cellTarget) => {
          if (row.cells[cellTarget.index] >= 1) return;
          addTarget({
            id: `field-row-${rowIndex}-${cellTarget.index}`,
            x: cellTarget.x,
            y: cellTarget.y,
            radius: 40,
            prompt: "E - 고랑 다지기",
            label: "고랑",
            kind: "work",
            rowIndex,
            cellIndex: cellTarget.index
          });
        });
      });
    }
  }

  if (state.completedTasks.has("raiseLivestock")) {
    addTarget({
      id: "barn-source",
      x: practice.barn.source.x,
      y: practice.barn.source.y,
      radius: 42,
      prompt: practice.carriedTool === "feed" ? "E - 사료 자루 내려놓기" : "E - 사료 자루 들기",
      label: "사료 자루",
      kind: "tool"
    });
    if (practice.carriedTool === "feed") {
      practice.barn.troughs.forEach((trough, index) => {
        if (trough.fill < 1) {
          addTarget({
            id: `barn-trough-${index}`,
            x: trough.x,
            y: trough.y,
            radius: 42,
            prompt: "E - 먹이통 채우기",
            label: "먹이통",
            kind: "work",
            troughIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("catchFish")) {
    addTarget({
      id: "pond-source",
      x: practice.pond.source.x,
      y: practice.pond.source.y,
      radius: 42,
      prompt: practice.carriedTool === "rod" ? "E - 낚싯대 내려놓기" : "E - 낚싯대 들기",
      label: "낚싯대",
      kind: "tool"
    });
    if (practice.carriedTool === "rod") {
      if (practice.carryingCatch) {
        addTarget({
          id: "pond-basket",
          x: practice.pond.basket.x,
          y: practice.pond.basket.y,
          radius: 44,
          prompt: "E - 바구니에 물고기 담기",
          label: "바구니",
          kind: "station"
        });
      } else {
        practice.pond.fish.forEach((fish, index) => {
          if (!fish.caught) {
            addTarget({
              id: `pond-fish-${index}`,
              x: fish.x,
              y: fish.y,
              radius: 88,
              prompt: "E - 낚싯대 던지기",
              label: "물고기",
              kind: "work",
              fishIndex: index
            });
          }
        });
      }
    }
  }

  return targets;
}

function buildWorldPracticeTargets() {
  const practice = state.worldPractice;
  const player = state.player;
  const targets = [];
  const addTarget = (target) => {
    target.baseRadius = target.radius ?? 40;
    target.hitRadius = target.baseRadius + getInteractionAssist(target.kind ?? "default");
    target.distance = Math.hypot(player.x - target.x, player.y - target.y);
    targets.push(target);
  };

  quizSignDefinitions.forEach((quiz) => {
    if (!state.completedTasks.has(quiz.taskId) && !state.solvedQuizSigns.has(quiz.id)) {
      return;
    }
    addTarget({
      id: quiz.id,
      x: quiz.x,
      y: quiz.y,
      radius: quiz.radius,
      prompt: state.solvedQuizSigns.has(quiz.id) ? "E - 팻말 다시 풀기" : quiz.prompt,
      label: quiz.label,
      kind: "quiz",
      quizId: quiz.id
    });
  });

  if (state.completedTasks.has("gardenCare")) {
    addTarget({
      id: "garden-source",
      x: practice.garden.source.x,
      y: practice.garden.source.y,
      radius: 42,
      prompt: practice.carriedTool === "shears" ? "E - 전지 가위 내려놓기" : "E - 전지 가위 집기",
      label: "전지 가위",
      kind: "tool"
    });
    if (practice.carriedTool === "shears") {
      practice.garden.shrubs.forEach((shrub, index) => {
        if (shrub.trim < 1) {
          addTarget({
            id: `garden-shrub-${index}`,
            x: shrub.x,
            y: shrub.y,
            radius: 42,
            prompt: "E - 덤불 다듬기",
            label: "덤불",
            kind: "work",
            shrubIndex: index
          });
        }
      });
      practice.garden.topiaries.forEach((topiary, index) => {
        if (topiary.trim < 1) {
          addTarget({
            id: `garden-topiary-${index}`,
            x: topiary.x,
            y: topiary.y,
            radius: 42,
            prompt: "E - 장식수 다듬기",
            label: "장식수",
            kind: "work",
            topiaryIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("lawnTrim")) {
    addTarget({
      id: "lawn-source",
      x: practice.lawn.source.xHome,
      y: practice.lawn.source.yHome,
      radius: 44,
      prompt: practice.carriedTool === "mower" ? "E - 잔디깎는 기계 내려놓기" : "E - 잔디깎는 기계 잡기",
      label: "잔디깎는 기계",
      kind: "tool"
    });
    if (practice.carriedTool === "mower") {
      practice.lawn.verges.forEach((patch, index) => {
        if (patch.cut < 1) {
          addTarget({
            id: `lawn-verge-${index}`,
            x: patch.x,
            y: patch.y,
            radius: 44,
            prompt: "밀어 지나가면 길가 풀이 정리됩니다",
            label: "길가 풀",
            kind: "work",
            vergeIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("vegetablePlant") && state.completedTasks.has("vegetableGrow")) {
    addTarget({
      id: "vegetable-tray",
      x: practice.vegetable.tray.x,
      y: practice.vegetable.tray.y,
      radius: 40,
      prompt: practice.carriedTool === "seedlings" ? "E - 모종 상자 내려놓기" : "E - 모종 상자 들기",
      label: "모종 상자",
      kind: "tool"
    });
    addTarget({
      id: "vegetable-bucket",
      x: practice.vegetable.bucket.x,
      y: practice.vegetable.bucket.y,
      radius: 38,
      prompt: practice.carriedTool === "bucket" ? "E - 양동이 내려놓기" : "E - 양동이 들기",
      label: "양동이",
      kind: "tool"
    });
    if (practice.carriedTool === "bucket" && practice.toolCharges < practice.vegetable.bucket.capacity) {
      addTarget({
        id: "vegetable-well",
        x: practice.vegetable.well.x,
        y: practice.vegetable.well.y,
        radius: 44,
        prompt: "E - 우물에서 물 채우기",
        label: "우물",
        kind: "station"
      });
    }
    practice.vegetable.plots.forEach((plot, index) => {
      if (practice.carriedTool === "seedlings" && !plot.planted) {
        addTarget({
          id: `vegetable-plant-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 모종 심기",
          label: "텃밭",
          kind: "work",
          plotIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && plot.planted && !plot.watered) {
        addTarget({
          id: `vegetable-water-${index}`,
          x: plot.x,
          y: plot.y,
          radius: 40,
          prompt: "E - 물 주기",
          label: "텃밭",
          kind: "work",
          plotIndex: index
        });
      }
    });
    practice.vegetable.planters.forEach((planter, index) => {
      if (practice.carriedTool === "seedlings" && !planter.planted) {
        addTarget({
          id: `vegetable-planter-plant-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 심기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
      if (practice.carriedTool === "bucket" && practice.toolCharges > 0 && planter.planted && !planter.watered) {
        addTarget({
          id: `vegetable-planter-water-${index}`,
          x: planter.x,
          y: planter.y,
          radius: 42,
          prompt: "E - 화분에 물 주기",
          label: "화분",
          kind: "work",
          planterIndex: index
        });
      }
    });
  }

  if (state.completedTasks.has("farmWork")) {
    addTarget({
      id: "field-source",
      x: practice.field.source.x,
      y: practice.field.source.y,
      radius: 42,
      prompt: practice.carriedTool === "hoe" ? "E - 호미 내려놓기" : "E - 호미 들기",
      label: "호미",
      kind: "tool"
    });
    if (practice.carriedTool === "hoe") {
      practice.field.rows.forEach((row, rowIndex) => {
        const cellWidth = row.w / row.cells.length;
        const cellTargets = state.controlMode === "tap"
          ? row.cells.map((_, index) => ({
              index,
              x: row.x1 + index * cellWidth + cellWidth * 0.5,
              y: row.y
            }))
          : [getWorldPracticeRowCellTarget(row, player)].filter(Boolean);
        cellTargets.forEach((cellTarget) => {
          if (row.cells[cellTarget.index] >= 1) return;
          addTarget({
            id: `field-row-${rowIndex}-${cellTarget.index}`,
            x: cellTarget.x,
            y: cellTarget.y,
            radius: 40,
            prompt: "E - 고랑 다지기",
            label: "고랑",
            kind: "work",
            rowIndex,
            cellIndex: cellTarget.index
          });
        });
      });
      practice.field.sidePatches.forEach((patch, index) => {
        if (patch.tilled < 1) {
          addTarget({
            id: `field-side-${index}`,
            x: patch.x,
            y: patch.y,
            radius: 42,
            prompt: "E - 길가 흙 다지기",
            label: "흙자리",
            kind: "work",
            sidePatchIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("raiseLivestock")) {
    addTarget({
      id: "barn-source",
      x: practice.barn.source.x,
      y: practice.barn.source.y,
      radius: 42,
      prompt: practice.carriedTool === "feed" ? "E - 사료 자루 내려놓기" : "E - 사료 자루 들기",
      label: "사료 자루",
      kind: "tool"
    });
    if (practice.carriedTool === "feed") {
      practice.barn.troughs.forEach((trough, index) => {
        if (trough.fill < 1) {
          addTarget({
            id: `barn-trough-${index}`,
            x: trough.x,
            y: trough.y,
            radius: 42,
            prompt: "E - 먹이통 채우기",
            label: "먹이통",
            kind: "work",
            troughIndex: index
          });
        }
      });
      practice.barn.feedSpots.forEach((spot, index) => {
        if (spot.fill < 1) {
          addTarget({
            id: `barn-feed-spot-${index}`,
            x: spot.x,
            y: spot.y,
            radius: 42,
            prompt: spot.visitor === "cat" ? "E - 고양이 그릇 채우기" : "E - 새 모이판 채우기",
            label: spot.visitor === "cat" ? "밥그릇" : "모이판",
            kind: "work",
            feedSpotIndex: index
          });
        }
      });
    }
  }

  if (state.completedTasks.has("catchFish")) {
    addTarget({
      id: "pond-source",
      x: practice.pond.source.x,
      y: practice.pond.source.y,
      radius: 42,
      prompt: practice.carriedTool === "rod" ? "E - 낚싯대 내려놓기" : "E - 낚싯대 들기",
      label: "낚싯대",
      kind: "tool"
    });
    if (practice.carriedTool === "rod") {
      if (practice.carryingCatch) {
        addTarget({
          id: "pond-basket",
          x: practice.pond.basket.x,
          y: practice.pond.basket.y,
          radius: 44,
          prompt: "E - 바구니에 물고기 담기",
          label: "바구니",
          kind: "station"
        });
      } else {
        practice.pond.fish.forEach((fish, index) => {
          if (!fish.caught) {
            addTarget({
              id: `pond-fish-${index}`,
              x: fish.x,
              y: fish.y,
              radius: 88,
              prompt: "E - 낚싯대 던지기",
              label: "물고기",
              kind: "work",
              fishIndex: index
            });
          }
        });
      }
    }
  }

  if (!practice.carriedTool) {
    state.ambient.nature.bushes.forEach((bush, index) => {
      if (bush.cooldown <= 0) {
        addTarget({
          id: `nature-bush-${index}`,
          x: bush.x,
          y: bush.y,
          radius: 42,
          prompt: "E - 수풀 건드리기",
          label: bush.label,
          kind: "nature",
          natureType: "bush",
          natureIndex: index
        });
      }
    });
    state.ambient.nature.flowers.forEach((flower, index) => {
      if (flower.cooldown <= 0) {
        addTarget({
          id: `nature-flower-${index}`,
          x: flower.x,
          y: flower.y,
          radius: 40,
          prompt: "E - 꽃무리 건드리기",
          label: flower.label,
          kind: "nature",
          natureType: "flower",
          natureIndex: index
        });
      }
    });
    state.ambient.nature.trees.forEach((tree, index) => {
      if (tree.cooldown <= 0) {
        addTarget({
          id: `nature-tree-${index}`,
          x: tree.x,
          y: tree.y + tree.trunkHeight * 0.4,
          radius: 50,
          prompt: "E - 나무 흔들어 보기",
          label: tree.label,
          kind: "nature",
          natureType: "tree",
          natureIndex: index
        });
      }
    });
  }

  return targets;
}

function getNearestWorldPracticeTarget() {
  const targets = buildWorldPracticeTargets();
  let best = null;
  let bestDistance = Infinity;
  targets.forEach((target) => {
    if (target.distance <= (target.hitRadius ?? target.radius) && target.distance < bestDistance) {
      best = target;
      bestDistance = target.distance;
    }
  });
  return best;
}

function getWorldPracticeCarryPrompt() {
  const practice = state.worldPractice;
  const timeHint = getDayProfile().activityHint;
  if (practice.carriedTool === "mower") {
    return `잔디깎는 기계를 밀며 잔디를 다듬어 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "shears") {
    return `덤불 가까이에서 E로 가지를 다듬어 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "seedlings") {
    return `빈 흙자리 가까이에서 E로 모종을 심어 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "bucket" && practice.toolCharges === 0) {
    return `우물 가까이에서 E로 물을 채워 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "bucket") {
    return `심어진 채소 가까이에서 E로 물을 주세요. ${timeHint}`;
  }
  if (practice.carriedTool === "hoe") {
    return `밭고랑 가까이에서 E로 흙을 다져 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "feed") {
    return `먹이통 가까이에서 E로 사료를 부어 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "rod" && practice.carryingCatch) {
    return `바구니 가까이에서 E로 물고기를 담아 보세요. ${timeHint}`;
  }
  if (practice.carriedTool === "rod") {
    return `물가 가까이에서 E로 낚싯대를 던져 보세요. ${timeHint}`;
  }
  return "";
}

function getNatureCollection(type) {
  if (type === "bush") {
    return state.ambient.nature.bushes;
  }
  if (type === "flower") {
    return state.ambient.nature.flowers;
  }
  if (type === "tree") {
    return state.ambient.nature.trees;
  }
  return [];
}

function waterNearbyPlot(index) {
  const origin = state.worldPractice.vegetable.plots[index];
  if (!origin) {
    return null;
  }
  const neighbor = state.worldPractice.vegetable.plots
    .map((plot, plotIndex) => ({ plot, plotIndex }))
    .filter(({ plot, plotIndex }) => plotIndex !== index && plot.planted && !plot.watered)
    .sort(
      (left, right) => Math.hypot(left.plot.x - origin.x, left.plot.y - origin.y) - Math.hypot(right.plot.x - origin.x, right.plot.y - origin.y)
    )[0];
  if (!neighbor) {
    return null;
  }
  const distance = Math.hypot(neighbor.plot.x - origin.x, neighbor.plot.y - origin.y);
  if (distance > 96) {
    return null;
  }
  neighbor.plot.watered = true;
  neighbor.plot.bounce = Math.max(neighbor.plot.bounce, 0.76);
  return neighbor.plot;
}

function waterNearbyPlanter(index) {
  const origin = state.worldPractice.vegetable.planters[index];
  if (!origin) {
    return null;
  }
  const neighbor = state.worldPractice.vegetable.planters
    .map((planter, planterIndex) => ({ planter, planterIndex }))
    .filter(({ planter, planterIndex }) => planterIndex !== index && planter.planted && !planter.watered)
    .sort(
      (left, right) =>
        Math.hypot(left.planter.x - origin.x, left.planter.y - origin.y) -
        Math.hypot(right.planter.x - origin.x, right.planter.y - origin.y)
    )[0];
  if (!neighbor) {
    return null;
  }
  const distance = Math.hypot(neighbor.planter.x - origin.x, neighbor.planter.y - origin.y);
  if (distance > 110) {
    return null;
  }
  neighbor.planter.watered = true;
  neighbor.planter.pop = Math.max(neighbor.planter.pop, 0.48);
  neighbor.planter.bloom = Math.max(neighbor.planter.bloom, 0.72);
  neighbor.planter.resetTimer = Math.max(neighbor.planter.resetTimer, 8);
  return neighbor.planter;
}

function applyFieldTimeBonus(row, cellIndex) {
  const bonusStrength = getDayProfile().fieldEcho;
  if (bonusStrength <= 0.12) {
    return false;
  }
  const preferredIndex = clamp(
    cellIndex + (state.player.facing === "left" ? -1 : state.player.facing === "right" ? 1 : 0),
    0,
    row.cells.length - 1
  );
  const candidates = [preferredIndex, cellIndex - 1, cellIndex + 1]
    .filter((value, index, array) => value >= 0 && value < row.cells.length && array.indexOf(value) === index && value !== cellIndex);
  const bonusIndex = candidates.find((value) => row.cells[value] < 1);
  if (bonusIndex === undefined) {
    return false;
  }
  row.cells[bonusIndex] = Math.max(row.cells[bonusIndex], bonusStrength);
  return true;
}

function pickNatureReaction(entry, count) {
  const options = [];
  for (let index = 0; index < count; index += 1) {
    if (count === 1 || index !== entry.lastReaction) {
      options.push(index);
    }
  }
  const reaction = options[Math.floor(Math.random() * options.length)] ?? 0;
  entry.lastReaction = reaction;
  entry.interactionCount = (entry.interactionCount ?? 0) + 1;
  return reaction;
}

function stirNearbyButterflies(x, y, strength = 1) {
  state.ambient.butterflies.forEach((butterfly) => {
    const distance = Math.hypot(butterfly.x - x, butterfly.y - y);
    if (distance > 220) {
      return;
    }
    const angle = Math.atan2(butterfly.y - y, butterfly.x - x) + Math.sin(butterfly.seed * 5) * 0.24;
    butterfly.scare = Math.max(butterfly.scare, 0.6 * strength);
    butterfly.vx += Math.cos(angle) * 90 * strength;
    butterfly.vy += (Math.sin(angle) * 60 - 20) * strength;
  });
}

function stirNearbyFieldBirds(x, y, strength = 1) {
  state.ambient.fieldBirds.forEach((bird) => {
    const distance = Math.hypot(bird.x - x, bird.y - y);
    if (distance > 260) {
      return;
    }
    const angle = Math.atan2(bird.y - y, bird.x - x) - 0.25;
    bird.scare = Math.max(bird.scare, 0.7 * strength);
    bird.vx += Math.cos(angle) * 120 * strength;
    bird.vy += (Math.sin(angle) * 70 - 40) * strength;
  });
}

function handleNatureInteractionTarget(target) {
  if (!target.natureType || target.natureIndex === undefined) {
    return false;
  }

  const collection = getNatureCollection(target.natureType);
  const entry = collection[target.natureIndex];
  if (!entry) {
    return false;
  }

  if (entry.cooldown > 0) {
    setWorldPracticeFeedback(`${entry.label}은 아직 살랑이며 가라앉는 중입니다.`);
    return true;
  }

  entry.cooldown = randomRange(2.8, 4.6);
  entry.shake = 1;
  entry.glow = 0.9;
  entry.brush = 1;
  const stage = state.dayStage;
  const natureSfxKey = `${target.natureType}-${target.natureIndex}`;

  if (target.natureType === "bush") {
    let reaction = pickNatureReaction(entry, 4);
    if (stage === 0 && reaction === 3) {
      reaction = 1;
    } else if (stage === 4 && reaction === 1) {
      reaction = 0;
    }
    if (reaction === 0) {
      playSfx("natureRustle", {
        playbackRate: randomRange(0.92, 1.08),
        cooldownKey: `nature-rustle-${natureSfxKey}`
      });
      emitWorldPracticeBurst(entry.x, entry.y - 6, ["rgba(133, 180, 101, 0.84)", "rgba(201, 231, 148, 0.76)"], {
        count: 8,
        minVx: -24,
        maxVx: 24,
        minVy: -24,
        maxVy: -8
      });
      setWorldPracticeFeedback(pickRandom(["수풀이 사각사각 흔들리며 잎이 후드득 떨어집니다.", "손끝이 닿자 수풀 안쪽이 폭신하게 출렁입니다."]));
    } else if (reaction === 1) {
      playSfx("natureShimmer", {
        playbackRate: randomRange(1.04, 1.16),
        cooldownKey: `nature-shimmer-${natureSfxKey}`
      });
      entry.visitorType = "butterfly";
      entry.visitorTimer = 1.8;
      emitWorldPracticeBurst(entry.x, entry.y - 10, [entry.blossomColor, "rgba(255, 245, 214, 0.82)"], {
        count: 9,
        minVx: -22,
        maxVx: 22,
        minVy: -28,
        maxVy: -10
      });
      stirNearbyButterflies(entry.x, entry.y, 1.2);
      setWorldPracticeFeedback(pickRandom(["수풀 틈에서 나비가 파르르 올라옵니다.", "꽃잎이 흩날리며 수풀 위로 나비가 맴돕니다."]));
    } else if (reaction === 2) {
      playSfx("natureRustle", {
        playbackRate: randomRange(1.04, 1.18),
        cooldownKey: `nature-rustle-${natureSfxKey}`
      });
      entry.dropTimer = 2.2;
      emitWorldPracticeBurst(entry.x, entry.y - 2, [entry.berryColor, "rgba(245, 218, 150, 0.78)"], {
        count: 7,
        minVx: -18,
        maxVx: 18,
        minVy: -20,
        maxVy: -6
      });
      setWorldPracticeFeedback(pickRandom(["열매 몇 알이 톡톡 튀며 아래로 굴러떨어집니다.", "수풀 안쪽에 숨어 있던 작은 열매가 바닥으로 톡 떨어집니다."]));
    } else {
      playSfx("birdFlutter", {
        playbackRate: randomRange(0.96, 1.1),
        cooldownKey: `nature-bird-${natureSfxKey}`
      });
      entry.visitorType = "bird";
      entry.visitorTimer = 1.5;
      emitWorldPracticeBurst(entry.x, entry.y - 8, ["rgba(240, 237, 226, 0.78)", "rgba(195, 182, 157, 0.7)"], {
        count: 6,
        minVx: -20,
        maxVx: 20,
        minVy: -26,
        maxVy: -12
      });
      stirNearbyFieldBirds(entry.x, entry.y, 1.1);
      setWorldPracticeFeedback(pickRandom(["수풀 속에서 작은 새가 푸드덕 날아오릅니다.", "바스락 소리와 함께 숨어 있던 작은 그림자가 튀어나갑니다."]));
    }
    return true;
  }

  if (target.natureType === "flower") {
    let reaction = pickNatureReaction(entry, 4);
    if (stage === 0 && reaction === 0) {
      reaction = 1;
    } else if (stage === 4) {
      reaction = 3;
    }
    if (reaction === 0) {
      playSfx("natureRustle", {
        playbackRate: randomRange(1.08, 1.18),
        cooldownKey: `nature-rustle-${natureSfxKey}`
      });
      entry.dropTimer = 2;
      emitWorldPracticeBurst(entry.x, entry.y - 10, [entry.palette[0], entry.palette[1], entry.palette[2]], {
        count: 10,
        minVx: -20,
        maxVx: 20,
        minVy: -30,
        maxVy: -10
      });
      setWorldPracticeFeedback(pickRandom(["꽃무리가 한 번 출렁이며 꽃잎이 빙글 돌고 내려앉습니다.", "꽃잎이 가볍게 흩날리며 손끝을 스칩니다."]));
    } else if (reaction === 1) {
      playSfx("natureShimmer", {
        playbackRate: randomRange(1.12, 1.24),
        cooldownKey: `nature-shimmer-${natureSfxKey}`
      });
      entry.glow = 1.2;
      for (let index = 0; index < 6; index += 1) {
        emitAmbientParticle(entry.x + randomRange(-10, 10), entry.y - 4 + randomRange(-6, 4), {
          color: "rgba(255, 247, 201, 0.8)",
          vx: randomRange(-8, 8),
          vy: randomRange(-20, -8),
          size: randomRange(1.6, 3),
          life: randomRange(0.35, 0.7)
        });
      }
      setWorldPracticeFeedback(pickRandom(["꽃 사이에서 은은한 반짝임이 몽글몽글 올라옵니다.", "햇빛을 머금은 꽃송이가 반짝이며 향기가 번집니다."]));
    } else if (reaction === 2) {
      playSfx("birdFlutter", {
        volume: 0.3,
        playbackRate: randomRange(1.14, 1.26),
        cooldownKey: `nature-flutter-${natureSfxKey}`
      });
      entry.visitorType = "butterfly";
      entry.visitorTimer = 1.7;
      stirNearbyButterflies(entry.x, entry.y, 1.3);
      emitWorldPracticeBurst(entry.x, entry.y - 6, ["rgba(255, 227, 182, 0.78)", "rgba(255, 205, 222, 0.76)"], {
        count: 7,
        minVx: -18,
        maxVx: 18,
        minVy: -26,
        maxVy: -10
      });
      setWorldPracticeFeedback(pickRandom(["꽃무리 사이에서 나비 한 쌍이 천천히 떠오릅니다.", "건드린 자리에서 작은 나비가 날개를 털며 솟아오릅니다."]));
    } else {
      playSfx("natureShimmer", {
        volume: 0.32,
        playbackRate: randomRange(1.18, 1.3),
        cooldownKey: `nature-shimmer-${natureSfxKey}`
      });
      entry.visitorType = "sparkle";
      entry.visitorTimer = 1.6;
      entry.dropTimer = 1.2;
      emitWorldPracticeBurst(entry.x, entry.y - 4, ["rgba(214, 239, 246, 0.82)", "rgba(244, 240, 208, 0.76)"], {
        count: 8,
        minVx: -14,
        maxVx: 14,
        minVy: -20,
        maxVy: -8
      });
      setWorldPracticeFeedback(pickRandom(["이슬 같은 반짝임이 꽃 위에서 또르르 흔들립니다.", "꽃술 끝에서 맑은 빛방울이 가볍게 튀어 오릅니다."]));
    }
    return true;
  }

  if (target.natureType === "tree") {
    let reaction = pickNatureReaction(entry, 4);
    if (stage === 3 && reaction === 0) {
      reaction = 1;
    } else if (stage === 4) {
      reaction = reaction === 1 ? 3 : reaction;
    }
    if (reaction === 0) {
      playSfx("natureRustle", {
        volume: 0.38,
        playbackRate: randomRange(0.82, 0.94),
        cooldownKey: `nature-rustle-${natureSfxKey}`
      });
      entry.dropTimer = 1.4;
      emitWorldPracticeBurst(entry.x, entry.y - entry.trunkHeight - 6, ["rgba(122, 175, 94, 0.82)", "rgba(203, 229, 155, 0.74)"], {
        count: 12,
        minVx: -26,
        maxVx: 26,
        minVy: -30,
        maxVy: -8
      });
      setWorldPracticeFeedback(pickRandom(["나무가 크게 흔들리며 잎사귀가 비처럼 흩어집니다.", "가지 끝에서 잎이 후드득 쏟아져 내려옵니다."]));
    } else if (reaction === 1) {
      playSfx("natureRustle", {
        volume: 0.34,
        playbackRate: randomRange(0.88, 1),
        cooldownKey: `nature-rustle-${natureSfxKey}`
      });
      entry.dropTimer = 2.4;
      emitWorldPracticeBurst(entry.x, entry.y - entry.trunkHeight * 0.2, [entry.fruitColor, "rgba(244, 226, 176, 0.78)"], {
        count: 8,
        minVx: -18,
        maxVx: 18,
        minVy: -18,
        maxVy: -4
      });
      setWorldPracticeFeedback(pickRandom(["가지 어딘가에 있던 열매가 톡 떨어져 발치에 구릅니다.", "나무를 건드리자 작은 열매가 도르르 떨어집니다."]));
    } else if (reaction === 2) {
      playSfx("birdFlutter", {
        volume: 0.4,
        playbackRate: randomRange(0.9, 1.02),
        cooldownKey: `nature-bird-${natureSfxKey}`
      });
      entry.visitorType = "bird";
      entry.visitorTimer = 1.8;
      stirNearbyFieldBirds(entry.x, entry.y, 1.3);
      emitWorldPracticeBurst(entry.x, entry.y - entry.trunkHeight, ["rgba(244, 241, 232, 0.78)", "rgba(191, 182, 160, 0.7)"], {
        count: 7,
        minVx: -24,
        maxVx: 24,
        minVy: -28,
        maxVy: -10
      });
      setWorldPracticeFeedback(pickRandom(["가지 사이에서 새들이 푸드덕 날아오릅니다.", "나무 꼭대기에서 작은 새 몇 마리가 놀라 날아갑니다."]));
    } else {
      playSfx("natureShimmer", {
        volume: 0.26,
        playbackRate: randomRange(0.96, 1.08),
        cooldownKey: `nature-shimmer-${natureSfxKey}`
      });
      entry.visitorType = "sparkle";
      entry.visitorTimer = 1.9;
      entry.glow = 1.3;
      for (let index = 0; index < 8; index += 1) {
        emitAmbientParticle(entry.x + randomRange(-18, 18), entry.y - entry.trunkHeight + randomRange(-18, 10), {
          color: "rgba(255, 244, 201, 0.78)",
          vx: randomRange(-9, 9),
          vy: randomRange(-18, -6),
          size: randomRange(1.4, 2.8),
          life: randomRange(0.35, 0.8)
        });
      }
      setWorldPracticeFeedback(pickRandom(["햇빛 조각 같은 반짝임이 나뭇잎 사이에서 반짝입니다.", "나무 그늘 안쪽에서 금빛 먼지가 떠오르듯 반응합니다."]));
    }
    return true;
  }

  return false;
}

function handleWorldPracticeAction() {
  const target = state.hoveredPractice ?? getNearestWorldPracticeTarget();
  const practice = state.worldPractice;
  const dayProfile = getDayProfile();
  if (!target) {
    return false;
  }
  practice.actionPose = 0.26;

  if (target.kind === "quiz" && target.quizId) {
    openQuiz(target.quizId);
    playSfx("uiClick", { volume: 0.24, playbackRate: 1.06 });
    return true;
  }

  if (handleNatureInteractionTarget(target)) {
    return true;
  }

  if (target.id === "garden-source") {
    if (practice.carriedTool === "shears") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.92
      });
      setWorldPracticeFeedback("전지가위를 다시 걸어 두었습니다.");
    } else {
      equipWorldPracticeTool("shears");
      playSfx("equipTool", {
        playbackRate: 1.04
      });
      setWorldPracticeFeedback("전지가위를 손에 쥐었습니다.");
    }
    return true;
  }

  if (target.shrubIndex !== undefined) {
    const shrub = practice.garden.shrubs[target.shrubIndex];
    playSfx("shearsTrim", {
      playbackRate: randomRange(0.96, 1.08),
      cooldownKey: `shrub-${target.shrubIndex}`
    });
    shrub.trim = clamp(shrub.trim + 0.45, 0, 1);
    shrub.shake = 1;
    if (shrub.trim >= 1) {
      shrub.resetTimer = 8;
      markWorldPracticeMoment("worldPracticeGarden", "정원을 가꾸다", "마당에서도 전지가위를 들고 덤불을 다듬을 수 있게 되었습니다.");
      setWorldPracticeFeedback("덤불이 말끔하게 다듬어졌습니다.");
    } else {
      setWorldPracticeFeedback("가지 끝이 사각사각 잘려 나갑니다.");
    }
    emitWorldPracticeBurst(shrub.x, shrub.y - 4, ["rgba(124, 172, 92, 0.78)", "rgba(167, 205, 119, 0.74)"], {
      count: 6,
      minVx: -28,
      maxVx: 28,
      minVy: -24,
      maxVy: -6
    });
    if (state.dayStage === 0) {
      emitWorldPracticeBurst(shrub.x, shrub.y - 12, ["rgba(236, 246, 255, 0.82)", "rgba(191, 223, 245, 0.72)"], {
        count: 4,
        minVx: -12,
        maxVx: 12,
        minVy: -18,
        maxVy: -6
      });
    }
    return true;
  }

  if (target.topiaryIndex !== undefined) {
    const topiary = practice.garden.topiaries[target.topiaryIndex];
    playSfx("shearsTrim", {
      playbackRate: randomRange(0.88, 1),
      cooldownKey: `topiary-${target.topiaryIndex}`
    });
    topiary.trim = clamp(topiary.trim + 0.5, 0, 1);
    topiary.shake = 1;
    if (topiary.trim >= 1) {
      topiary.resetTimer = 9;
      markWorldPracticeMoment("worldPracticeTopiary", "정원을 가꾸다", "집 앞 장식수와 길모퉁이 화단까지 손질할 수 있게 되었습니다.");
    }
    emitWorldPracticeBurst(topiary.x, topiary.y - 2, ["rgba(134, 186, 101, 0.82)", "rgba(219, 241, 154, 0.76)"], {
      count: 5,
      minVx: -16,
      maxVx: 16,
      minVy: -18,
      maxVy: -6
    });
    setWorldPracticeFeedback("전지 가위 끝이 장식수의 모양을 가지런하게 다듬습니다.");
    if (state.dayStage >= 3) {
      setWorldPracticeFeedback("저녁빛에 장식수 윤곽이 더 또렷하게 살아납니다.");
    }
    return true;
  }

  if (target.id === "lawn-source") {
    if (practice.carriedTool === "mower") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.9
      });
      setWorldPracticeFeedback("잔디깎는 기계를 제자리에 세워 두었습니다.");
    } else {
      equipWorldPracticeTool("mower");
      playSfx("equipTool", {
        volume: 0.52,
        playbackRate: 0.96
      });
      setWorldPracticeFeedback("잔디깎는 기계를 붙잡았습니다. 밀면 바로 잔디가 반응합니다.");
    }
    return true;
  }

  if (target.vergeIndex !== undefined) {
    setWorldPracticeFeedback("잔디깎는 기계를 밀고 지나가면 길가 풀이 사각사각 정리됩니다.");
    return true;
  }

  if (target.id === "vegetable-tray") {
    if (practice.carriedTool === "seedlings") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.9
      });
      setWorldPracticeFeedback("모종 상자를 내려두었습니다.");
    } else if (practice.vegetable.tray.seedlings > 0) {
      equipWorldPracticeTool("seedlings", practice.vegetable.tray.seedlings);
      practice.vegetable.tray.seedlings = 0;
      playSfx("equipTool", {
        playbackRate: 1.06
      });
      setWorldPracticeFeedback("모종 상자를 들었습니다.");
    } else {
      setWorldPracticeFeedback("지금은 상자에 남은 모종이 없습니다.");
    }
    return true;
  }

  if (target.id === "vegetable-bucket") {
    if (practice.carriedTool === "bucket") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.9
      });
      setWorldPracticeFeedback("양동이를 우물가에 내려두었습니다.");
    } else {
      equipWorldPracticeTool("bucket", practice.vegetable.bucket.water);
      practice.vegetable.bucket.water = 0;
      playSfx("equipTool", {
        playbackRate: 0.98
      });
      setWorldPracticeFeedback("양동이를 들었습니다.");
    }
    return true;
  }

  if (target.id === "vegetable-well") {
    practice.toolCharges = practice.vegetable.bucket.capacity;
    practice.vegetable.bucket.water = practice.toolCharges;
    playSfx("waterPour", {
      playbackRate: randomRange(0.94, 1.06),
      cooldownKey: "world-well-fill"
    });
    emitWorldPracticeBurst(practice.vegetable.well.x, practice.vegetable.well.y, ["rgba(173, 226, 242, 0.82)", "rgba(103, 184, 207, 0.8)"], {
      count: 7,
      minVx: -20,
      maxVx: 20,
      minVy: -26,
      maxVy: -10,
      kind: "splash"
    });
    setWorldPracticeFeedback("양동이에 맑은 물이 가득 찼습니다.");
    if (state.dayStage >= 3) {
      setWorldPracticeFeedback("우물물이 서늘하게 차올라 양동이가 금세 묵직해집니다.");
    }
    return true;
  }

  if (target.plotIndex !== undefined && target.id.startsWith("vegetable-plant")) {
    const plot = practice.vegetable.plots[target.plotIndex];
    playSfx("plantPop", {
      playbackRate: randomRange(0.94, 1.08),
      cooldownKey: `world-plot-plant-${target.plotIndex}`
    });
    plot.planted = true;
    plot.watered = false;
    plot.pop = 1;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    if (practice.toolCharges === 0) {
      practice.carriedTool = null;
    }
    emitWorldPracticeBurst(plot.x, plot.y + 4, ["rgba(167, 124, 78, 0.78)", "rgba(122, 84, 52, 0.72)"], {
      count: 5,
      minVx: -14,
      maxVx: 14,
      minVy: -16,
      maxVy: -4
    });
    setWorldPracticeFeedback("모종이 흙자리에 톡 내려앉았습니다.");
    return true;
  }

  if (target.plotIndex !== undefined && target.id.startsWith("vegetable-water")) {
    const plot = practice.vegetable.plots[target.plotIndex];
    playSfx("waterPour", {
      playbackRate: randomRange(0.98, 1.08),
      cooldownKey: `world-plot-water-${target.plotIndex}`
    });
    plot.watered = true;
    plot.bounce = 1;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    practice.vegetable.bucket.water = practice.toolCharges;
    const wateredNeighbor = dayProfile.wateringAssist > 0.24 ? waterNearbyPlot(target.plotIndex) : null;
    emitWorldPracticeBurst(plot.x, plot.y - 4, ["rgba(173, 226, 242, 0.82)", "rgba(103, 184, 207, 0.8)"], {
      count: 7,
      minVx: -16,
      maxVx: 16,
      minVy: -24,
      maxVy: -8,
      kind: "splash"
    });
    if (wateredNeighbor) {
      emitWorldPracticeBurst(wateredNeighbor.x, wateredNeighbor.y - 4, ["rgba(173, 226, 242, 0.58)", "rgba(103, 184, 207, 0.52)"], {
        count: 4,
        minVx: -12,
        maxVx: 12,
        minVy: -18,
        maxVy: -6,
        kind: "splash"
      });
    }
    if (practice.vegetable.plots.every((plotEntry) => plotEntry.watered)) {
      practice.vegetable.resetTimer = 8;
      markWorldPracticeMoment("worldPracticeVegetable", "채소를 키우다", "밭에서도 모종을 심고 물을 주며 채소를 직접 돌볼 수 있습니다.");
    }
    setWorldPracticeFeedback("채소 잎이 물을 먹고 한층 싱그러워졌습니다.");
    if (wateredNeighbor) {
      setWorldPracticeFeedback("젖은 흙결이 옆 포기까지 번지며 두 줄기가 함께 촉촉해집니다.");
    } else if (state.dayStage === 0) {
      setWorldPracticeFeedback("아침 이슬이 남아 있어 잎맥이 한층 더 또렷하게 살아납니다.");
    } else if (state.dayStage === 4) {
      setWorldPracticeFeedback("밤공기 덕에 물기가 천천히 스며들며 잎이 은근히 반짝입니다.");
    }
    return true;
  }

  if (target.planterIndex !== undefined && target.id.includes("planter-plant")) {
    const planter = practice.vegetable.planters[target.planterIndex];
    playSfx("plantPop", {
      playbackRate: randomRange(1, 1.12),
      cooldownKey: `world-planter-plant-${target.planterIndex}`
    });
    planter.planted = true;
    planter.watered = false;
    planter.pop = 1;
    planter.bloom = 0;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    if (practice.toolCharges === 0) {
      practice.carriedTool = null;
    }
    emitWorldPracticeBurst(planter.x, planter.y + 2, ["rgba(167, 124, 78, 0.78)", "rgba(122, 84, 52, 0.72)"], {
      count: 5,
      minVx: -14,
      maxVx: 14,
      minVy: -16,
      maxVy: -4
    });
    setWorldPracticeFeedback("화분 흙에 작은 모종을 옮겨 심었습니다.");
    return true;
  }

  if (target.planterIndex !== undefined && target.id.includes("planter-water")) {
    const planter = practice.vegetable.planters[target.planterIndex];
    playSfx("waterPour", {
      playbackRate: randomRange(1.02, 1.14),
      cooldownKey: `world-planter-water-${target.planterIndex}`
    });
    planter.watered = true;
    planter.pop = 0.6;
    planter.bloom = 1;
    planter.resetTimer = 10;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    practice.vegetable.bucket.water = practice.toolCharges;
    const wateredNeighbor = dayProfile.wateringAssist > 0.3 ? waterNearbyPlanter(target.planterIndex) : null;
    emitWorldPracticeBurst(planter.x, planter.y - 6, ["rgba(173, 226, 242, 0.82)", "rgba(103, 184, 207, 0.8)"], {
      count: 7,
      minVx: -16,
      maxVx: 16,
      minVy: -24,
      maxVy: -8,
      kind: "splash"
    });
    if (wateredNeighbor) {
      emitWorldPracticeBurst(wateredNeighbor.x, wateredNeighbor.y - 6, ["rgba(173, 226, 242, 0.58)", "rgba(103, 184, 207, 0.52)"], {
        count: 4,
        minVx: -12,
        maxVx: 12,
        minVy: -18,
        maxVy: -6,
        kind: "splash"
      });
    }
    markWorldPracticeMoment("worldPracticePlanter", "채소를 키우다", "텃밭뿐 아니라 집 앞 화분에도 직접 심고 물을 줄 수 있게 되었습니다.");
    setWorldPracticeFeedback("화분 잎이 촉촉하게 젖으며 금세 싱그러워집니다.");
    if (wateredNeighbor) {
      setWorldPracticeFeedback("넘친 물방울이 옆 화분까지 튀며 작은 화분 둘이 함께 살아납니다.");
    } else if (state.dayStage >= 3) {
      setWorldPracticeFeedback("선선한 공기 덕에 화분 흙이 천천히 젖으며 꽃빛이 오래 남습니다.");
    }
    return true;
  }

  if (target.id === "field-source") {
    if (practice.carriedTool === "hoe") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.9
      });
      setWorldPracticeFeedback("호미를 밭 옆에 세워 두었습니다.");
    } else {
      equipWorldPracticeTool("hoe");
      playSfx("equipTool", {
        playbackRate: 1
      });
      setWorldPracticeFeedback("호미를 쥐었습니다.");
    }
    return true;
  }

  if (target.rowIndex !== undefined) {
    const row = practice.field.rows[target.rowIndex];
    playSfx("hoeDig", {
      playbackRate: randomRange(0.94, 1.06),
      cooldownKey: `world-row-${target.rowIndex}-${target.cellIndex}`
    });
    row.cells[target.cellIndex] = 1;
    row.reaction = 1;
    const echoed = applyFieldTimeBonus(row, target.cellIndex);
    emitWorldPracticeBurst(target.x, target.y, ["rgba(177, 137, 85, 0.78)", "rgba(122, 84, 52, 0.72)"], {
      count: 6,
      minVx: -18,
      maxVx: 18,
      minVy: -18,
      maxVy: -6
    });
    if (echoed) {
      emitWorldPracticeBurst(target.x + (state.player.facing === "left" ? -18 : 18), target.y, ["rgba(177, 137, 85, 0.52)", "rgba(122, 84, 52, 0.44)"], {
        count: 4,
        minVx: -10,
        maxVx: 10,
        minVy: -14,
        maxVy: -4
      });
    }
    if (practice.field.rows.every((entry) => entry.cells.every((cell) => cell >= 1))) {
      practice.field.resetTimer = 8;
      markWorldPracticeMoment("worldPracticeField", "농사를 짓다", "월드 화면에서도 흙을 따라 직접 고랑을 만들 수 있게 되었습니다.");
    }
    setWorldPracticeFeedback("호미 끝이 흙을 갈라 고랑이 살아납니다.");
    if (echoed) {
      setWorldPracticeFeedback("흙결이 부드럽게 이어져 옆 칸까지 고랑 자국이 번져 갑니다.");
    } else if (state.dayStage === 2) {
      setWorldPracticeFeedback("낮볕에 마른 흙이 산뜻하게 갈라지며 고랑이 또렷하게 남습니다.");
    }
    return true;
  }

  if (target.sidePatchIndex !== undefined) {
    const patch = practice.field.sidePatches[target.sidePatchIndex];
    playSfx("hoeDig", {
      playbackRate: randomRange(0.9, 1),
      cooldownKey: `world-sidepatch-${target.sidePatchIndex}`
    });
    patch.tilled = 1;
    patch.reaction = 1;
    patch.resetTimer = 10;
    emitWorldPracticeBurst(patch.x, patch.y, ["rgba(177, 137, 85, 0.78)", "rgba(122, 84, 52, 0.72)"], {
      count: 6,
      minVx: -18,
      maxVx: 18,
      minVy: -18,
      maxVy: -6
    });
    markWorldPracticeMoment("worldPracticeSidePatch", "농사를 짓다", "밭 밖의 빈 흙자리도 호미로 정리하며 손에 익힐 수 있게 되었습니다.");
    setWorldPracticeFeedback("길가의 빈 흙자리도 반듯하게 다져졌습니다.");
    return true;
  }

  if (target.id === "barn-source") {
    if (practice.carriedTool === "feed") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.88
      });
      setWorldPracticeFeedback("사료 자루를 다시 내려두었습니다.");
    } else {
      equipWorldPracticeTool("feed", Math.max(practice.barn.source.servings, 2));
      practice.barn.source.servings = 0;
      playSfx("equipTool", {
        playbackRate: 0.96
      });
      setWorldPracticeFeedback("사료 자루를 들었습니다.");
    }
    return true;
  }

  if (target.troughIndex !== undefined) {
    const trough = practice.barn.troughs[target.troughIndex];
    playSfx("feedPour", {
      playbackRate: randomRange(0.96, 1.08),
      cooldownKey: `world-trough-${target.troughIndex}`
    });
    trough.fill = 1;
    trough.reaction = 1;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    if (practice.toolCharges === 0) {
      practice.carriedTool = null;
    }
    emitWorldPracticeBurst(trough.x, trough.y - 4, ["rgba(245, 217, 130, 0.82)", "rgba(219, 186, 103, 0.76)"], {
      count: 6,
      minVx: -16,
      maxVx: 16,
      minVy: -14,
      maxVy: -4
    });
    state.ambient.chickens.forEach((chicken) => {
      chicken.interest = Math.max(chicken.interest ?? 0, 0.28 + dayProfile.feedGather * 0.5);
    });
    markWorldPracticeMoment("worldPracticeBarn", "가축을 키우다", "먹이통이 차면 닭들이 정말로 가까이 몰려듭니다.");
    setWorldPracticeFeedback("먹이통에 사료가 소복하게 찼습니다.");
    if (state.dayStage >= 3) {
      setWorldPracticeFeedback("선선해진 동물들이 사료 냄새를 맡고 더 빠르게 가까이 다가옵니다.");
    }
    return true;
  }

  if (target.feedSpotIndex !== undefined) {
    const spot = practice.barn.feedSpots[target.feedSpotIndex];
    playSfx("feedPour", {
      playbackRate: randomRange(1, 1.12),
      cooldownKey: `world-feed-spot-${target.feedSpotIndex}`
    });
    spot.fill = 1;
    spot.reaction = 1;
    practice.toolCharges = Math.max(0, practice.toolCharges - 1);
    if (practice.toolCharges === 0) {
      practice.carriedTool = null;
    }
    emitWorldPracticeBurst(spot.x, spot.y - 4, ["rgba(245, 217, 130, 0.82)", "rgba(219, 186, 103, 0.76)"], {
      count: 6,
      minVx: -16,
      maxVx: 16,
      minVy: -14,
      maxVy: -4
    });
    if (spot.visitor === "cat") {
      state.ambient.cat.stretch = Math.max(state.ambient.cat.stretch, 0.4 + dayProfile.feedGather * 0.22);
    }
    markWorldPracticeMoment("worldPracticeFeedSpots", "가축을 키우다", "외양간 밖 그릇과 모이판에도 먹이를 나눠 둘 수 있게 되었습니다.");
    setWorldPracticeFeedback(spot.visitor === "cat" ? "집 앞 그릇에 사료를 담아 두었습니다." : "연못가 모이판에 사료가 소복하게 쌓였습니다.");
    return true;
  }

  if (target.id === "pond-source") {
    if (practice.carriedTool === "rod") {
      clearWorldPracticeTool();
      playSfx("equipTool", {
        playbackRate: 0.88
      });
      setWorldPracticeFeedback("낚싯대를 물가에 기대 두었습니다.");
    } else {
      equipWorldPracticeTool("rod");
      practice.pond.cast.timer = 0;
      practice.pond.cast.hooked = false;
      playSfx("equipTool", {
        playbackRate: 0.96
      });
      setWorldPracticeFeedback("낚싯대를 들고 물가에 섰습니다.");
    }
    return true;
  }

  if (target.id === "pond-basket") {
    playSfx("basketDrop", {
      playbackRate: randomRange(0.96, 1.04)
    });
    practice.carryingCatch = false;
    practice.pond.basket.stored += 1;
    practice.pond.basket.resetTimer = 8;
    emitWorldPracticeBurst(practice.pond.basket.x, practice.pond.basket.y - 6, ["rgba(255, 248, 238, 0.86)", "rgba(173, 226, 242, 0.8)"], {
      count: 6,
      minVx: -18,
      maxVx: 18,
      minVy: -18,
      maxVy: -6,
      kind: "splash"
    });
    practice.pond.cast.timer = 0;
    practice.pond.cast.hooked = false;
    markWorldPracticeMoment("worldPracticePond", "물고기를 잡다", "연못에서도 낚싯대를 던져 물고기를 낚아 올릴 수 있게 되었습니다.");
    setWorldPracticeFeedback("건진 물고기를 바구니에 담았습니다.");
    return true;
  }

  if (target.fishIndex !== undefined) {
    const fish = practice.pond.fish[target.fishIndex];
    playSfx("fishCast", {
      volume: 0.3,
      playbackRate: randomRange(0.96, 1.08),
      cooldownKey: `world-fish-cast-${target.fishIndex}`
    });
    fish.caught = true;
    fish.respawn = 8;
    practice.carryingCatch = true;
    practice.pond.cast.x = fish.x;
    practice.pond.cast.y = fish.y;
    practice.pond.cast.timer = 0.95;
    practice.pond.cast.hooked = true;
    practice.pond.cast.hookSoundTimer = 0.16;
    emitWorldPracticeBurst(fish.x, fish.y, ["rgba(173, 226, 242, 0.84)", "rgba(255, 248, 238, 0.82)"], {
      count: 7,
      minVx: -22,
      maxVx: 22,
      minVy: -28,
      maxVy: -10,
      kind: "splash"
    });
    setWorldPracticeFeedback("낚싯대를 던지자 찌가 쑥 잠기며 물고기가 걸렸습니다.");
    if (state.dayStage >= 3) {
      setWorldPracticeFeedback("저녁 물가로 붙은 물고기가 찌를 건드리자 낚싯대 끝이 묵직하게 휘어집니다.");
    }
    return true;
  }

  return false;
}

function getSlowZone(x, y) {
  return slowZones.find((zone) => x > zone.x && x < zone.x + zone.w && y > zone.y && y < zone.y + zone.h) ?? null;
}

function isSlowZone(x, y) {
  return Boolean(getSlowZone(x, y));
}

function updateSlowZoneExpression() {
  const zone = getSlowZone(state.player.x, state.player.y);
  const nextZoneId = zone?.id ?? null;
  if (nextZoneId === state.activeSlowZoneId) {
    return;
  }
  state.activeSlowZoneId = nextZoneId;
  if (!zone) {
    return;
  }

  if (!state.flags.has("mudNotice")) {
    state.flags.add("mudNotice");
    maybeUnlockMood("inconvenient");
    persistGame("발견");
  }
  startWorldExpressionMoment("inconvenient", zone.expression, zone.detail, 3.2);
  showToast(zone.expression, zone.toast);
}

function collidesWithObstacle(x, y) {
  return obstacles.some(
    (obstacle) =>
      x + state.player.r > obstacle.x &&
      x - state.player.r < obstacle.x + obstacle.w &&
      y + state.player.r > obstacle.y &&
      y - state.player.r < obstacle.y + obstacle.h
  );
}

function movePlayer(dt) {
  const manualMovement = getMovementIntent();
  if (manualMovement.magnitude > 0 && state.autoNavigation.active) {
    cancelAutoNavigation();
  }
  const movement = manualMovement.magnitude > 0
    ? manualMovement
    : getAutoNavigationMovement("world", state.player, dt);
  if (movement.magnitude === 0) {
    return;
  }
  const { dx, dy } = movement;

  if (Math.abs(dx) > Math.abs(dy)) {
    state.player.facing = dx > 0 ? "right" : "left";
  } else {
    state.player.facing = dy > 0 ? "down" : "up";
  }
  state.player.step += dt * 8;

  let speed = state.player.speed * (state.device?.moveSpeedMultiplier ?? 1);
  if (state.device?.isTouch && !(state.controlMode === "tap" && state.autoNavigation.active)) {
    speed *= 0.34 + movement.magnitude * 0.66;
  }
  if (isSlowZone(state.player.x, state.player.y)) {
    speed *= 0.62;
  }

  let nextX = clamp(state.player.x + dx * speed * dt, state.player.r, world.width - state.player.r);
  if (!collidesWithObstacle(nextX, state.player.y)) {
    state.player.x = nextX;
  }

  let nextY = clamp(state.player.y + dy * speed * dt, state.player.r, world.height - state.player.r);
  if (!collidesWithObstacle(state.player.x, nextY)) {
    state.player.y = nextY;
  }
  updateSlowZoneExpression();
}

function buildDialogueState(zone) {
  const dialogue = zone.getDialogue ? zone.getDialogue(state) : zone;
  return {
    zoneId: zone.id,
    speaker: dialogue.speaker ?? zone.speaker ?? zone.label,
    lines: dialogue.lines ?? [],
    audioId: dialogue.audioId ?? zone.audioId ?? zone.id,
    unlockListening: dialogue.unlockListening ?? zone.unlockListening,
    unlockMood: dialogue.unlockMood ?? zone.unlockMood,
    visitFlag: dialogue.visitFlag ?? null
  };
}

function openDialogue(zone) {
  closeOptionalPanels();
  const dialogueState = buildDialogueState(zone);
  state.activeDialogue = dialogueState;
  state.dialogueIndex = 0;
  setPrompt("");
  ui.dialogueBox.classList.remove("hidden");
  ui.dialogueSpeaker.textContent = dialogueState.speaker;
  ui.dialogueText.textContent = dialogueState.lines[0];
  ui.dialogueNext.textContent = dialogueState.lines.length <= 1 ? "대화 마치기" : "다음";
  syncMobileViewportMode();
  persistGame("대화 저장");
  focusOverlay(ui.dialogueBox);
  playDialogueAudio(dialogueState.audioId, 0);
}

function completeDialogue(dialogueState) {
  if (!dialogueState) {
    return;
  }
  const firstTalkWithAunt = dialogueState.zoneId === "busStop" && !state.flags.has("talkedAunt");
  const firstTalkWithChild = dialogueState.zoneId === "pondChild" && !state.flags.has("talkedChild");
  const firstVisitThisDialogue = dialogueState.visitFlag && !state.flags.has(dialogueState.visitFlag);

  if (dialogueState.zoneId === "busStop") {
    state.flags.add("talkedAunt");
  }
  if (dialogueState.zoneId === "pondChild") {
    state.flags.add("talkedChild");
  }
  if (dialogueState.visitFlag) {
    state.flags.add(dialogueState.visitFlag);
  }

  maybeUnlockListening(dialogueState.unlockListening);
  dialogueState.unlockMood?.forEach((id) => maybeUnlockMood(id));
  if (firstTalkWithAunt) {
    awardWarmth(8);
  }
  if (firstTalkWithChild) {
    awardWarmth(6);
    startWorldExpressionMoment(
      "boring",
      "따분하다",
      "같은 고요한 풍경도 누군가에게는 심심하게 느껴집니다. 연못 아이는 그 고요 속에서 재미를 찾습니다."
    );
  }
  if (firstVisitThisDialogue) {
    awardWarmth(5);
  }
  advanceStoryProgress();
  renderSidebar();
}

function closeDialogue() {
  state.activeDialogue = null;
  state.dialogueIndex = 0;
  ui.dialogueBox.classList.add("hidden");
  syncMobileViewportMode();
  stopDialogueAudio();
  playSfx("uiClick", {
    volume: 0.24,
    playbackRate: 0.9
  });
  persistGame("대화 저장");
  if (state.endingShown) {
    focusOverlay(ui.endingCard);
  } else {
    restoreOverlayFocus();
  }
}

function nextDialogue() {
  if (!state.activeDialogue) {
    return;
  }
  state.dialogueIndex += 1;
  if (state.dialogueIndex >= state.activeDialogue.lines.length) {
    completeDialogue(state.activeDialogue);
    closeDialogue();
    return;
  }
  ui.dialogueText.textContent = state.activeDialogue.lines[state.dialogueIndex];
  ui.dialogueNext.textContent =
    state.dialogueIndex >= state.activeDialogue.lines.length - 1 ? "대화 마치기" : "다음";
  persistGame("대화 저장");
  if (!state.voiceEnabled || !dialogueAudioManifest[state.activeDialogue.audioId]?.[state.dialogueIndex]) {
    playSfx("uiClick", {
      volume: 0.12,
      playbackRate: 1.1
    });
  }
  playDialogueAudio(state.activeDialogue.audioId, state.dialogueIndex);
}

function isActivityCoverageComplete(progress) {
  return progress >= 0.94;
}

function buildActivityObjectives(activity) {
  switch (activity.kind) {
    case "gardenCare":
      return [
        {
          label: "전지가위 집기",
          detail: "왼쪽 작업대에서 가위를 들어야 덤불을 다듬을 수 있습니다.",
          done: activity.player.carrying === "shears"
        },
        {
          label: "덤불 3곳 손질",
          detail: `${activity.shrubs.filter((shrub) => shrub.trimmed).length}/3곳을 손질했습니다.`,
          done: activity.shrubs.every((shrub) => shrub.trimmed)
        }
      ];
    case "lawnTrim":
      return [
        {
          label: "잔디깎는 기계 붙잡기",
          detail: "기계 가까이에서 행동하면 손잡이를 잡고 밀 수 있습니다.",
          done: activity.mower.attached
        },
        {
          label: "긴 잔디 세 줄 밀기",
          detail: `${activity.lanes.filter((lane) => isActivityCoverageComplete(lane.cut)).length}/3줄을 깎았습니다.`,
          done: activity.lanes.every((lane) => isActivityCoverageComplete(lane.cut))
        }
      ];
    case "vegetablePlant":
      return [
        {
          label: "모종 상자 들기",
          detail: "모종 상자를 집어 밭으로 옮기세요.",
          done: activity.tray.taken
        },
        {
          label: "모종 네 개 심기",
          detail: `${activity.plots.filter((plot) => plot.planted).length}/4개를 심었습니다.`,
          done: activity.plots.every((plot) => plot.planted)
        }
      ];
    case "vegetableGrow":
      return [
        {
          label: "우물에서 물 뜨기",
          detail: `우물에서 ${activity.bucket.filledTrips}번 물을 채웠습니다.`,
          done: activity.bucket.filledTrips > 0
        },
        {
          label: "시든 채소 네 줄 물 주기",
          detail: `${activity.plants.filter((plant) => plant.watered).length}/4줄에 물을 줬습니다.`,
          done: activity.plants.every((plant) => plant.watered)
        }
      ];
    case "farmWork":
      return [
        {
          label: "호미 들기",
          detail: "호미를 집어 밭고랑을 따라 걸으세요.",
          done: activity.player.carrying === "hoe"
        },
        {
          label: "고랑 세 줄 다지기",
          detail: `${activity.rows.filter((row) => isActivityCoverageComplete(row.progress)).length}/3줄을 다졌습니다.`,
          done: activity.rows.every((row) => isActivityCoverageComplete(row.progress))
        }
      ];
    case "raiseLivestock":
      return [
        {
          label: "사료 자루 들기",
          detail: "사료 자루를 들고 외양간 안쪽 먹이통으로 가세요.",
          done: activity.feedBag.taken
        },
        {
          label: "먹이통 두 곳 채우기",
          detail: `${activity.troughs.filter((trough) => trough.filled).length}/2곳을 채웠습니다.`,
          done: activity.troughs.every((trough) => trough.filled)
        }
      ];
    case "catchFish":
      return [
        {
          label: "뜰채 집기",
          detail: "뜰채를 들면 연못 가장자리에서 물고기를 건질 수 있습니다.",
          done: activity.net.taken
        },
        {
          label: "물고기 두 마리 담기",
          detail: `${activity.basket.stored}/2마리를 바구니에 담았습니다.`,
          done: activity.basket.stored >= 2
        }
      ];
    default:
      return [];
  }
}

function getActivityHint(activity) {
  switch (activity.kind) {
    case "gardenCare":
      return activity.player.carrying === "shears"
        ? "덤불 앞에서 행동해 가지를 다듬으세요."
        : "작업대 근처에서 행동하면 전지가위를 집습니다.";
    case "lawnTrim":
      return activity.mower.attached
        ? "기계를 밀고 긴 잔디 줄을 끝까지 지나가세요."
        : "잔디깎는 기계 가까이에서 행동해 손잡이를 잡으세요.";
    case "vegetablePlant":
      if (!activity.tray.taken) {
        return "모종 상자를 집은 뒤 빈 흙 자리마다 옮겨 심으세요.";
      }
      return activity.tray.seedlings > 0
        ? `빈 흙 자리 앞에서 행동해 모종을 심습니다. 남은 모종 ${activity.tray.seedlings}개`
        : "모종을 모두 심었습니다.";
    case "vegetableGrow":
      if (!activity.bucket.taken) {
        return "양동이를 집고 우물에서 물을 채우세요.";
      }
      if (activity.bucket.water <= 0) {
        return "양동이가 비었습니다. 우물 쪽에서 다시 물을 담아야 합니다.";
      }
      return `채소 앞에서 행동하면 물을 줍니다. 남은 물 ${activity.bucket.water}칸`;
    case "farmWork":
      return activity.player.carrying === "hoe"
        ? "고랑 위를 따라 길게 걸을수록 흙이 반듯하게 정리됩니다."
        : "호미를 집어 밭고랑 위를 직접 걸어 보세요.";
    case "raiseLivestock":
      if (!activity.feedBag.taken) {
        return "사료 자루를 집고 먹이통 두 곳까지 직접 옮기세요.";
      }
      return `먹이통 앞에서 행동하면 사료를 붓습니다. 남은 분량 ${activity.feedBag.servings}`;
    case "catchFish":
      if (!activity.net.taken) {
        return "뜰채를 집고 연못 가장자리 물고기 가까이 가 보세요.";
      }
      if (activity.player.carryingCatch) {
        return "건진 물고기를 바구니까지 옮겨 담아야 합니다.";
      }
      return "물고기 그림자 가까이에서 행동해 건진 뒤, 바구니로 옮기세요.";
    default:
      return "";
  }
}

function createActivityState(zone) {
  const collocation = collocations.find((item) => item.id === zone.taskId);
  const base = {
    zone,
    kind: zone.taskId,
    mode: "activity",
    width: ui.activityCanvas.width,
    height: ui.activityCanvas.height,
    title: collocation?.label ?? zone.prompt.replace(/^E\s*-\s*/, ""),
    phrase: collocation?.label ?? zone.label,
    instruction: "",
    feedback: "",
    feedbackTimer: 0,
    expressionCue: "",
    expressionCueTimer: 0,
    expressionAlpha: 0.24,
    expressionPulse: 0.18,
    sweatDrops: [],
    sweatSpawnTimer: 0.18,
    particles: [],
    actionPose: 0,
    toolPose: null,
    completion: {
      active: false,
      timer: 0,
      duration: 2.7
    },
    player: {
      x: 92,
      y: 300,
      r: 14,
      speed: 165 * (state.device?.activitySpeedMultiplier ?? 1),
      carrying: null,
      carryingCatch: null,
      facing: "right",
      step: 0,
      prevX: 92,
      prevY: 300
    }
  };

  switch (zone.taskId) {
    case "gardenCare":
      return {
        ...base,
        instruction: "전지가위를 집어 덤불 세 군데를 직접 다듬으세요.",
        tool: { x: 94, y: 286, r: 18 },
        shrubs: [
          { x: 430, y: 108, r: 24, trimmed: false, trimProgress: 0, shake: 0 },
          { x: 530, y: 186, r: 24, trimmed: false, trimProgress: 0, shake: 0 },
          { x: 450, y: 276, r: 24, trimmed: false, trimProgress: 0, shake: 0 }
        ]
      };
    case "lawnTrim":
      return {
        ...base,
        instruction: "잔디깎는 기계를 붙잡고 긴 잔디 줄을 직접 밀어 지나가세요.",
        player: { ...base.player, x: 112, y: 190 },
        mower: { x: 126, y: 190, w: 60, h: 30, attached: false, tilt: 0 },
        lanes: [
          { x1: 220, y: 102, w: 310, h: 42, cut: 0, reaction: 0, cells: Array.from({ length: 18 }, () => 0) },
          { x1: 220, y: 180, w: 310, h: 42, cut: 0, reaction: 0, cells: Array.from({ length: 18 }, () => 0) },
          { x1: 220, y: 258, w: 310, h: 42, cut: 0, reaction: 0, cells: Array.from({ length: 18 }, () => 0) }
        ]
      };
    case "vegetablePlant":
      return {
        ...base,
        instruction: "모종 상자를 들고 빈 흙 자리마다 모종을 하나씩 심으세요.",
        tray: { x: 96, y: 286, r: 18, taken: false, seedlings: 4 },
        plots: [
          { x: 372, y: 118, r: 18, planted: false, pop: 0 },
          { x: 476, y: 118, r: 18, planted: false, pop: 0 },
          { x: 372, y: 248, r: 18, planted: false, pop: 0 },
          { x: 476, y: 248, r: 18, planted: false, pop: 0 }
        ]
      };
    case "vegetableGrow":
      return {
        ...base,
        instruction: "양동이를 우물까지 가져가 물을 채우고 시든 채소를 차례로 살리세요.",
        bucket: { x: 96, y: 286, r: 18, taken: false, water: 0, capacity: 2, filledTrips: 0 },
        well: { x: 112, y: 108, r: 34 },
        plants: [
          { x: 360, y: 118, r: 18, watered: false, bounce: 0, droop: 1 },
          { x: 470, y: 118, r: 18, watered: false, bounce: 0, droop: 1 },
          { x: 360, y: 248, r: 18, watered: false, bounce: 0, droop: 1 },
          { x: 470, y: 248, r: 18, watered: false, bounce: 0, droop: 1 }
        ]
      };
    case "farmWork":
      return {
        ...base,
        instruction: "호미를 들고 밭고랑 세 줄을 직접 걸으며 흙을 반듯하게 다지세요.",
        tool: { x: 96, y: 286, r: 18 },
        rows: [
          { x1: 220, x2: 548, y: 112, progress: 0, ripple: 0, cells: Array.from({ length: 18 }, () => 0) },
          { x1: 220, x2: 548, y: 192, progress: 0, ripple: 0, cells: Array.from({ length: 18 }, () => 0) },
          { x1: 220, x2: 548, y: 272, progress: 0, ripple: 0, cells: Array.from({ length: 18 }, () => 0) }
        ]
      };
    case "raiseLivestock":
      return {
        ...base,
        instruction: "사료 자루를 들고 먹이통 두 곳에 직접 사료를 채우세요.",
        feedBag: { x: 96, y: 286, r: 18, taken: false, servings: 2 },
        animals: [
          { kind: "cow", x: 302, y: 154, homeX: 302, homeY: 154, color: "#e9e5de", step: 0, interest: 0 },
          { kind: "pig", x: 366, y: 204, homeX: 366, homeY: 204, color: "#e5b1a8", step: 0.7, interest: 0 },
          { kind: "sheep", x: 428, y: 240, homeX: 428, homeY: 240, color: "#ddd0a2", step: 1.1, interest: 0 }
        ],
        troughs: [
          { x: 460, y: 132, r: 18, filled: false, fillLevel: 0, reaction: 0 },
          { x: 492, y: 248, r: 18, filled: false, fillLevel: 0, reaction: 0 }
        ]
      };
    default:
      return {
        ...base,
        instruction: "뜰채로 물고기를 건진 뒤 바구니까지 옮겨 담으세요.",
        net: { x: 96, y: 286, r: 18, taken: false },
        basket: { x: 118, y: 112, r: 24, stored: 0 },
        pond: { x: 230, y: 72, w: 310, h: 226 },
        fish: [
          { x: 320, y: 132, vx: 42, vy: 24, caught: false, panic: 0 },
          { x: 468, y: 188, vx: -36, vy: 28, caught: false, panic: 0 },
          { x: 382, y: 248, vx: 34, vy: -30, caught: false, panic: 0 }
        ]
      };
  }
}

function isNearActivityTarget(player, target, extraRadius = 20) {
  return (
    Math.hypot(player.x - target.x, player.y - target.y) <=
    player.r + (target.r ?? 16) + extraRadius + getInteractionAssist("activity")
  );
}

function setActivityFeedback(message, expressionCue = "") {
  if (!state.activeMiniGame) {
    return;
  }
  state.activeMiniGame.feedback = message;
  state.activeMiniGame.feedbackTimer = 2.2;
  if (expressionCue) {
    state.activeMiniGame.expressionCue = expressionCue;
    state.activeMiniGame.expressionCueTimer = 1.9;
  }
}

function spawnActivitySweat(game, count = 1, intensity = 1) {
  const scaledCount = scaleEffectCount(count, 1);
  for (let index = 0; index < scaledCount; index += 1) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const life = 0.42 + Math.random() * 0.34 + intensity * 0.08;
    game.sweatDrops.push({
      x: game.player.x + side * (14 + Math.random() * 10),
      y: game.player.y - 58 + Math.random() * 8,
      vx: side * (6 + Math.random() * 10),
      vy: 12 + Math.random() * 22,
      size: 2.2 + Math.random() * 1.6 + intensity * 0.4,
      life,
      maxLife: life
    });
  }

  const sweatLimit = Math.round(10 + getEffectDensity() * 10);
  if (game.sweatDrops.length > sweatLimit) {
    game.sweatDrops.splice(0, game.sweatDrops.length - sweatLimit);
  }
}

function accentActivityExpression(game, intensity = 1) {
  game.expressionPulse = Math.max(game.expressionPulse, 0.52 + intensity * 0.36);
  game.expressionAlpha = Math.max(game.expressionAlpha, 0.34 + intensity * 0.18);
  spawnActivitySweat(game, 2 + Math.round(intensity * 2), intensity);
}

function updateActivityExpressionState(game, dt, movedDistance) {
  const isWorking =
    movedDistance > 0.8 &&
    (Boolean(game.player.carrying) ||
      Boolean(game.player.carryingCatch) ||
      (game.kind === "lawnTrim" && game.mower.attached));

  const targetAlpha = isWorking ? 0.38 : 0.22;
  game.expressionAlpha += (targetAlpha - game.expressionAlpha) * Math.min(dt * 3.6, 1);
  game.expressionPulse = Math.max(game.expressionPulse - dt * 0.88, 0);

  if (isWorking) {
    game.sweatSpawnTimer -= dt;
    if (game.sweatSpawnTimer <= 0) {
      spawnActivitySweat(game, game.expressionPulse > 0.4 ? 2 : 1, 0.45);
      game.sweatSpawnTimer = 0.18 + Math.random() * 0.16;
    }
  } else {
    game.sweatSpawnTimer = Math.max(game.sweatSpawnTimer, 0.12);
  }

  game.sweatDrops = game.sweatDrops.filter((drop) => {
    drop.life -= dt;
    if (drop.life <= 0) {
      return false;
    }
    drop.x += drop.vx * dt;
    drop.y += drop.vy * dt;
    drop.vy += 18 * dt;
    return true;
  });
}

function getFacingVector(facing) {
  switch (facing) {
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
    case "up":
      return { x: 0, y: -1 };
    default:
      return { x: 0, y: 1 };
  }
}

function getActivityToolPose(game) {
  const { player } = game;
  const dir = getFacingVector(player.facing);
  const sideX = dir.x === 0 ? 8 : 0;
  const sideY = dir.y === 0 ? -2 : 0;
  const handX = player.x + dir.x * 10 + sideX;
  const handY = player.y - 4 + dir.y * 10 + sideY;
  const swing = Math.sin((1 - Math.min(game.actionPose / 0.24, 1)) * Math.PI) * 0.55;
  let angle = Math.atan2(dir.y || 0.01, dir.x || 1);
  let tipX = handX;
  let tipY = handY;

  switch (player.carrying) {
    case "shears":
      angle += swing * 0.9;
      tipX = handX + Math.cos(angle) * 18;
      tipY = handY + Math.sin(angle) * 18;
      break;
    case "bucket":
      angle += swing * 0.24;
      tipX = handX + Math.cos(angle) * 14;
      tipY = handY + Math.sin(angle) * 14 + 6;
      break;
    case "hoe":
      angle += swing * 0.75 + 0.25;
      tipX = handX + Math.cos(angle) * 26;
      tipY = handY + Math.sin(angle) * 26 + 10;
      break;
    case "net":
      angle += swing * 0.72;
      tipX = handX + Math.cos(angle) * 28;
      tipY = handY + Math.sin(angle) * 28;
      break;
    case "feed":
      angle += swing * 0.16;
      tipX = handX + Math.cos(angle) * 12;
      tipY = handY + Math.sin(angle) * 12;
      break;
    case "seedlings":
      angle += swing * 0.2;
      tipX = handX + Math.cos(angle) * 10;
      tipY = handY + Math.sin(angle) * 10;
      break;
    default:
      if (game.kind === "lawnTrim" && game.mower.attached) {
        const mowerAngle = Math.atan2(dir.y, dir.x || 1);
        tipX = player.x + dir.x * 30;
        tipY = player.y + dir.y * 18 + 8;
        angle = mowerAngle;
      }
      break;
  }

  return { handX, handY, tipX, tipY, angle, dir, swing };
}

function isToolTouchingCircle(toolPose, target, radius = 0) {
  return (
    Math.hypot(toolPose.tipX - target.x, toolPose.tipY - target.y) <=
    (target.r ?? 16) + radius + getInteractionAssist("toolTip")
  );
}

function markCoverageCells(cells, startRatio, endRatio) {
  const safeStart = clamp(Math.min(startRatio, endRatio), 0, 1);
  const safeEnd = clamp(Math.max(startRatio, endRatio), 0, 1);
  const startIndex = clamp(Math.floor(safeStart * cells.length), 0, cells.length - 1);
  const endIndex = clamp(Math.ceil(safeEnd * cells.length), startIndex + 1, cells.length);
  for (let index = startIndex; index < endIndex; index += 1) {
    cells[index] = 1;
  }
}

function getCoverageProgress(cells) {
  return cells.reduce((sum, value) => sum + value, 0) / cells.length;
}

function spawnActivityParticles(
  game,
  x,
  y,
  { count = 4, palette = ["#ffffff"], kind = "dust", speed = 36, lift = 38, spread = 16, size = 3, life = 0.45 } = {}
) {
  const scaledCount = scaleEffectCount(count, 1);
  for (let index = 0; index < scaledCount; index += 1) {
    const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.3;
    const velocity = speed * (0.6 + Math.random() * 0.8);
    game.particles.push({
      kind,
      color: palette[index % palette.length],
      x: x + (Math.random() - 0.5) * spread,
      y: y + (Math.random() - 0.5) * spread * 0.6,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - lift * (0.2 + Math.random() * 0.6),
      size: size * (0.8 + Math.random() * 0.7),
      life,
      maxLife: life,
      rotation: Math.random() * Math.PI
    });
  }
  const particleLimit = Math.round(42 + getEffectDensity() * 24);
  if (game.particles.length > particleLimit) {
    game.particles.splice(0, game.particles.length - particleLimit);
  }
}

function buildActivityGuide(activity) {
  switch (activity.kind) {
    case "gardenCare":
      return [
        { label: "전지가위 집기", done: activity.player.carrying === "shears" },
        { label: "덤불 3곳 다듬기", done: activity.shrubs.every((shrub) => shrub.trimmed) }
      ];
    case "lawnTrim":
      return [
        { label: "기계 붙잡기", done: activity.mower.attached },
        { label: "긴 잔디 3줄 밀기", done: activity.lanes.every((lane) => isActivityCoverageComplete(lane.cut)) }
      ];
    case "vegetablePlant":
      return [
        { label: "모종 상자 들기", done: activity.tray.taken },
        { label: "빈자리 4곳에 심기", done: activity.plots.every((plot) => plot.planted) }
      ];
    case "vegetableGrow":
      return [
        { label: "양동이 들기", done: activity.bucket.taken },
        { label: "우물에서 물 뜨기", done: activity.bucket.filledTrips > 0 },
        { label: "채소에 물 주기", done: activity.plants.every((plant) => plant.watered) }
      ];
    case "farmWork":
      return [
        { label: "호미 들기", done: activity.player.carrying === "hoe" },
        { label: "고랑 3줄 다지기", done: activity.rows.every((row) => isActivityCoverageComplete(row.progress)) }
      ];
    case "raiseLivestock":
      return [
        { label: "사료 자루 들기", done: activity.feedBag.taken },
        { label: "먹이통 2곳 채우기", done: activity.troughs.every((trough) => trough.filled) }
      ];
    case "catchFish":
      return [
        { label: "뜰채 집기", done: activity.net.taken },
        { label: "물고기 건지기", done: activity.fish.some((fish) => fish.caught) },
        { label: "바구니에 2마리 담기", done: activity.basket.stored >= 2 }
      ];
    default:
      return [];
  }
}

function buildActivityTargets(game) {
  switch (game.kind) {
    case "gardenCare":
      if (game.player.carrying !== "shears") {
        return [{ ...game.tool, id: "garden-tool", label: "전지가위", prompt: "E 집기", requiresAction: true }];
      }
      return game.shrubs
        .map((shrub, index) => ({ ...shrub, id: `garden-shrub-${index}`, label: `덤불 ${index + 1}`, prompt: "E 다듬기", requiresAction: true }))
        .filter((shrub) => !shrub.trimmed);
    case "lawnTrim":
      if (!game.mower.attached) {
        return [
          {
            x: game.mower.x - 22,
            y: game.mower.y - 12,
            w: game.mower.w,
            h: game.mower.h,
            shape: "rect",
            id: "lawn-mower",
            label: "잔디깎는 기계",
            prompt: "E 붙잡기",
            requiresAction: true
          }
        ];
      }
      return game.lanes
        .map((lane, index) => ({
          x: lane.x1,
          y: lane.y,
          w: lane.w,
          h: lane.h,
          progress: lane.cut,
          shape: "rect",
          id: `lawn-lane-${index}`,
          label: `잔디 줄 ${index + 1}`,
          prompt: "밀어 지나가기",
          requiresAction: false
        }))
        .filter((lane) => !isActivityCoverageComplete(lane.progress));
    case "vegetablePlant":
      if (!game.tray.taken) {
        return [{ ...game.tray, id: "plant-tray", label: "모종 상자", prompt: "E 들기", requiresAction: true }];
      }
      return game.plots
        .map((plot, index) => ({ ...plot, id: `plant-plot-${index}`, label: `모종 자리 ${index + 1}`, prompt: "E 심기", requiresAction: true }))
        .filter((plot) => !plot.planted);
    case "vegetableGrow":
      if (!game.bucket.taken) {
        return [{ ...game.bucket, id: "grow-bucket", label: "양동이", prompt: "E 들기", requiresAction: true }];
      }
      if (game.bucket.water <= 0) {
        return [{ ...game.well, id: "grow-well", label: "우물", prompt: "E 물 뜨기", requiresAction: true }];
      }
      return game.plants
        .map((plant, index) => ({ ...plant, id: `grow-plant-${index}`, label: `채소 줄 ${index + 1}`, prompt: "E 물 주기", requiresAction: true }))
        .filter((plant) => !plant.watered);
    case "farmWork":
      if (game.player.carrying !== "hoe") {
        return [{ ...game.tool, id: "farm-tool", label: "호미", prompt: "E 들기", requiresAction: true }];
      }
      return game.rows
        .map((row, index) => ({
          x: row.x1,
          y: row.y - 10,
          w: row.x2 - row.x1,
          h: 20,
          progress: row.progress,
          shape: "rect",
          id: `farm-row-${index}`,
          label: `고랑 ${index + 1}`,
          prompt: "고랑 위로 걷기",
          requiresAction: false
        }))
        .filter((row) => !isActivityCoverageComplete(row.progress));
    case "raiseLivestock":
      if (!game.feedBag.taken) {
        return [{ ...game.feedBag, id: "livestock-feed", label: "사료 자루", prompt: "E 들기", requiresAction: true }];
      }
      return game.troughs
        .map((trough, index) => ({
          x: trough.x - 18,
          y: trough.y - 12,
          w: 36,
          h: 24,
          filled: trough.filled,
          shape: "rect",
          id: `livestock-trough-${index}`,
          label: `먹이통 ${index + 1}`,
          prompt: "E 사료 붓기",
          requiresAction: true
        }))
        .filter((trough) => !trough.filled);
    case "catchFish":
      if (!game.net.taken) {
        return [{ ...game.net, id: "fish-net", label: "뜰채", prompt: "E 집기", requiresAction: true }];
      }
      if (game.player.carryingCatch) {
        return [{ ...game.basket, id: "fish-basket", label: "바구니", prompt: "E 담기", requiresAction: true }];
      }
      return game.fish
        .map((fish, index) => ({ ...fish, id: `fish-${index}`, r: 18, label: `물고기 ${index + 1}`, prompt: "E 건지기", requiresAction: true }))
        .filter((fish) => !fish.caught);
    default:
      return [];
  }
}

function getActivityTargetDistance(player, target) {
  if (target.shape === "rect") {
    const nearestX = clamp(player.x, target.x, target.x + target.w);
    const nearestY = clamp(player.y, target.y, target.y + target.h);
    return Math.hypot(player.x - nearestX, player.y - nearestY);
  }
  return Math.hypot(player.x - target.x, player.y - target.y);
}

function getActivityTargetAnchor(target) {
  if (target.shape === "rect") {
    return { x: target.x + target.w / 2, y: target.y + target.h / 2 };
  }
  return { x: target.x, y: target.y };
}

function faceActivityPlayerToward(player, x, y) {
  const dx = x - player.x;
  const dy = y - player.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    player.facing = dx >= 0 ? "right" : "left";
  } else {
    player.facing = dy >= 0 ? "down" : "up";
  }
}

function getTouchActivityAssistConfig(game, target) {
  const base = {
    snapDistance: 132 + getInteractionAssist("activity") * 1.4,
    snapLerp: 0.78,
    offsetX: 26,
    offsetY: 20
  };

  switch (game.kind) {
    case "gardenCare":
      return { ...base, offsetX: 30, offsetY: 18 };
    case "vegetableGrow":
      return target === game.well ? { ...base, offsetX: 0, offsetY: 38 } : { ...base, offsetX: 20, offsetY: 20 };
    case "raiseLivestock":
      return { ...base, offsetX: 24, offsetY: 22 };
    case "catchFish":
      if (target === game.basket) {
        return { ...base, offsetX: 16, offsetY: 18 };
      }
      if (target === game.net) {
        return { ...base, offsetX: 18, offsetY: 18 };
      }
      return { ...base, offsetX: 0, offsetY: 28, snapDistance: 148 + getInteractionAssist("activity") * 1.4 };
    default:
      return base;
  }
}

function assistTouchActivityAction(game) {
  if (!state.device?.isTouch) {
    return null;
  }

  const target = getNearestActivityTarget(game, 162 + getInteractionAssist("activity"));
  if (!target || target.requiresAction === false) {
    return target;
  }

  const anchor = getActivityTargetAnchor(target);
  const config = getTouchActivityAssistConfig(game, target);
  const distance = Math.hypot(anchor.x - game.player.x, anchor.y - game.player.y);

  faceActivityPlayerToward(game.player, anchor.x, anchor.y);

  if (distance <= config.snapDistance) {
    const side = game.player.x <= anchor.x ? -1 : 1;
    const desiredX = anchor.x + side * config.offsetX;
    const desiredY = anchor.y + config.offsetY;
    game.player.x = clamp(lerp(game.player.x, desiredX, config.snapLerp), 36, game.width - 36);
    game.player.y = clamp(lerp(game.player.y, desiredY, config.snapLerp), 48, game.height - 36);
    game.player.prevX = game.player.x;
    game.player.prevY = game.player.y;
  }

  game.toolPose = getActivityToolPose(game);
  return target;
}

function getNearestActivityTarget(game, maxDistance = 92) {
  const targets = buildActivityTargets(game);
  const assistedMaxDistance = maxDistance + getInteractionAssist("activity");
  let closest = null;
  let minDistance = Infinity;

  targets.forEach((target) => {
    const distance = getActivityTargetDistance(game.player, target);
    if (distance < minDistance) {
      minDistance = distance;
      closest = target;
    }
  });

  return minDistance <= assistedMaxDistance ? closest : null;
}

function getTouchActionLabel() {
  if (!state.device?.isTouch) {
    return "행동";
  }

  if (state.activeDialogue) {
    return "다음";
  }

  if (state.activeQuiz) {
    return "확인";
  }

  if (!state.activeMiniGame) {
    return "행동";
  }

  const game = state.activeMiniGame;
  if (game.completion?.active) {
    return "완료";
  }
  const target = getNearestActivityTarget(game, 150);
  if (!target) {
    return "행동";
  }
  if (target.requiresAction === false) {
    return "이동";
  }

  switch (game.kind) {
    case "gardenCare":
      return game.player.carrying === "shears" ? "다듬기" : "집기";
    case "lawnTrim":
      return game.mower.attached ? "밀기" : "붙잡기";
    case "vegetablePlant":
      return game.tray.taken ? "심기" : "집기";
    case "vegetableGrow":
      if (!game.bucket.taken) {
        return "집기";
      }
      return target.id === "grow-well" ? "물 뜨기" : "물주기";
    case "farmWork":
      return game.player.carrying === "hoe" ? "고르기" : "집기";
    case "raiseLivestock":
      return game.feedBag.taken ? "붓기" : "집기";
    case "catchFish":
      if (!game.net.taken) {
        return "집기";
      }
      return game.player.carryingCatch ? "담기" : "잡기";
    default:
      return "행동";
  }
}

function updateTouchActionLabel() {
  const actionText = getTouchActionLabel();
  const nearbyActivityTarget = state.activeMiniGame
    ? getNearestActivityTarget(state.activeMiniGame, 150)
    : null;
  const movementTarget = nearbyActivityTarget?.requiresAction === false;
  const completionActive = Boolean(state.activeMiniGame?.completion?.active);
  const unavailable =
    state.device?.isTouch &&
    state.started &&
    !state.activeDialogue &&
    !state.activeQuiz &&
    (state.activeMiniGame
      ? !nearbyActivityTarget || movementTarget || completionActive
      : !state.hoveredZone && !state.hoveredPractice);
  const unavailableLabel = movementTarget
    ? `${nearbyActivityTarget.prompt}. 조이스틱으로 움직이세요.`
    : state.activeMiniGame?.completion?.active
      ? "작업 완료"
      : "행동할 대상에 가까이 가세요";
  const ariaLabel = unavailable ? unavailableLabel : actionText;
  const hintText = completionActive
    ? ""
    : movementTarget
      ? "조이스틱 사용"
      : unavailable
        ? "대상 가까이 가기"
        : state.activeDialogue
          ? "눌러서 계속"
          : state.activeQuiz
            ? "눌러서 확인"
            : "가까이에서 누르기";
  const signature = `${actionText}|${Boolean(unavailable)}|${completionActive}|${ariaLabel}|${hintText}`;
  if (signature === state.uiFrame.touchActionSignature) {
    return;
  }
  state.uiFrame.touchActionSignature = signature;
  ui.touchActionLabel.textContent = actionText;
  ui.touchActionHint.textContent = hintText;
  ui.touchActionHint.classList.toggle("hidden", !hintText);
  ui.touchAction.classList.toggle("is-idle", Boolean(unavailable));
  ui.touchAction.disabled = completionActive;
  ui.touchAction.setAttribute("aria-label", ariaLabel);
}

function updateMiniGameUi(options = {}) {
  const { force = false } = options;
  if (!state.activeMiniGame) {
    return;
  }
  const game = state.activeMiniGame;
  const isCompleting = Boolean(game.completion?.active);
  const target = isCompleting ? null : getNearestActivityTarget(game);
  const targetHint = target ? `${target.label} · ${target.prompt}` : "주변을 움직여 손에 닿는 대상 앞까지 가 보세요.";
  const resolvedTargetHint = state.device?.isTouch
    ? state.controlMode === "tap"
      ? target
        ? `${target.label}을 누르면 자동으로 이동${target.requiresAction === false ? "합니다" : "하고 행동합니다"}.`
        : "가고 싶은 땅을 눌러 이동하세요."
      : target
        ? target.requiresAction === false
          ? `${target.label} · ${target.prompt}. 조이스틱으로 움직이세요.`
          : `${target.label} 근처에서 행동 버튼`
        : "가까운 대상으로 움직여 보세요."
    : targetHint;
  const goals = buildActivityObjectives(game);
  const guide = buildActivityGuide(game);
  const currentGoalIndex = goals.findIndex((goal) => !goal.done);
  const currentGuideIndex = guide.findIndex((step) => !step.done);
  const hintText = isCompleting
    ? `${game.phrase} · 바뀐 장면을 잠깐 눈에 담아 보세요.`
    : game.feedback || `${getActivityHint(game)} ${resolvedTargetHint}`;
  const actionLabel = getTouchActionLabel();
  const signature = JSON.stringify([
    Boolean(state.device?.isTouch),
    game.kind,
    game.title,
    game.instruction,
    isCompleting,
    target?.id ?? target?.label ?? "",
    target?.prompt ?? "",
    hintText,
    actionLabel,
    guide.map((step) => [step.done, step.label]),
    goals.map((goal) => [goal.done, goal.label, goal.detail])
  ]);
  if (!force && signature === state.uiFrame.miniGameUiSignature) {
    return;
  }
  state.uiFrame.miniGameUiSignature = signature;

  ui.miniGame.classList.toggle("is-touch-activity", Boolean(state.device?.isTouch));
  ui.miniGame.classList.toggle("is-complete", isCompleting);
  ui.miniGameType.textContent = isCompleting ? "장면에 남은 표현" : "몸으로 하는 일";
  ui.miniGameTitle.textContent = game.title;
  ui.miniGameInstruction.textContent = isCompleting
    ? "도구와 손길이 만든 전후 변화를 확인하세요."
    : game.instruction;
  ui.activityGuide.innerHTML = guide
    .map(
      (step, index) => `
        <li class="activity-guide-step ${step.done ? "is-complete" : index === currentGuideIndex ? "is-current" : "is-pending"}">
          <span class="activity-guide-number" aria-hidden="true">${step.done ? "✓" : index + 1}</span>
          <span>${step.label}</span>
        </li>
      `
    )
    .join("");
  ui.miniGameClose.disabled = isCompleting;
  ui.activityHint.textContent = hintText;
  ui.activityObjectives.innerHTML = goals
    .map(
      (goal, index) => `
        <div class="activity-goal ${goal.done ? "is-complete" : index === currentGoalIndex ? "is-current" : "is-pending"}">
          <strong>${goal.done ? "완료" : index === currentGoalIndex ? "지금 할 일" : "다음 할 일"} · ${goal.label}</strong>
          <span>${goal.detail}</span>
        </div>
      `
    )
    .join("");
  updateTouchActionLabel();
}

function startMiniGame(zone) {
  cancelAutoNavigation();
  closeOptionalPanels();
  setPrompt("");
  const pausedSnapshot = state.pausedActivity?.zoneId === zone.id ? state.pausedActivity.snapshot : null;
  state.activeMiniGame = restoreActivityState(pausedSnapshot, createActivityState(zone));
  if (pausedSnapshot) {
    state.pausedActivity = null;
  }
  ui.miniGame.classList.remove("hidden");
  ui.miniGame.classList.toggle("is-complete", Boolean(state.activeMiniGame.completion?.active));
  ui.miniGameClose.disabled = Boolean(state.activeMiniGame.completion?.active);
  syncMobileViewportMode();
  updateMiniGameUi({ force: true });
  renderActivityScene();
  persistGame(pausedSnapshot ? "작업 불러오기" : "작업 시작");
  focusOverlay(ui.miniGame);
}

function closeMiniGame() {
  cancelAutoNavigation();
  state.activeMiniGame = null;
  state.uiFrame.miniGameUiSignature = "";
  ui.miniGame.classList.add("hidden");
  ui.miniGame.classList.remove("is-touch-activity", "is-complete");
  ui.miniGameClose.disabled = false;
  resetTouchJoystick();
  syncMobileViewportMode();
  activityCtx.clearRect(0, 0, ui.activityCanvas.width, ui.activityCanvas.height);
  updateTouchActionLabel();
  persistGame("작업 저장");
  if (state.endingShown) {
    focusOverlay(ui.endingCard);
  } else {
    restoreOverlayFocus();
  }
}

function pauseMiniGame() {
  const game = state.activeMiniGame;
  if (!game) {
    return;
  }
  if (game.completion?.active) {
    return;
  }
  cancelAutoNavigation();
  state.pausedActivity = {
    zoneId: game.zone.id,
    snapshot: snapshotActivityState(game)
  };
  state.activeMiniGame = null;
  state.uiFrame.miniGameUiSignature = "";
  ui.miniGame.classList.add("hidden");
  ui.miniGame.classList.remove("is-touch-activity", "is-complete");
  ui.miniGameClose.disabled = false;
  syncMobileViewportMode();
  activityCtx.clearRect(0, 0, ui.activityCanvas.width, ui.activityCanvas.height);
  updateTouchActionLabel();
  persistGame("작업 저장");
  showToast("작업이 저장됐습니다", "같은 장소에서 다시 시작하면 이어서 할 수 있습니다.");
  restoreOverlayFocus();
}

function completeTask(zone) {
  const task = collocations.find((item) => item.id === zone.taskId);
  state.completedTasks.add(zone.taskId);
  state.unlockedNouns.add(task.nounId);
  state.unlockedVerbs.add(task.verbId);
  addBasketItem(taskRewards[zone.taskId]);
  awardWarmth(10);

  const discoveredLoseTrack = state.completedTasks.size >= 4 && !state.unlockedMood.has("loseTrack");
  if (discoveredLoseTrack) {
    maybeUnlockMood("loseTrack");
  }

  advanceDayCycleForAction(22, `${task.label}에 몰두하는 동안`);
  const storyAdvanced = advanceStoryProgress();
  renderSidebar();
  persistGame("일과");
  closeMiniGame();
  emitWorldPracticeBurst(
    state.player.x,
    state.player.y - 18,
    ["rgba(255, 229, 166, 0.92)", "rgba(245, 184, 121, 0.9)", "rgba(174, 214, 147, 0.88)"],
    { count: 12, minLife: 0.52, maxLife: 0.86, minSize: 3, maxSize: 5.4 }
  );
  if (discoveredLoseTrack) {
    startWorldExpressionMoment(
      "loseTrack",
      "시간 가는 줄 모르다",
      "한 가지씩 몰두하다 보니 어느새 햇빛의 색과 마을 소리가 달라졌습니다."
    );
  } else if (!storyAdvanced && !state.endingShown) {
    showToast(task.label, zone.afterText);
  }

  if (state.completedTasks.size === collocations.length) {
    showToast("하루가 다 익었습니다", "표현들이 퀘스트가 아니라 장면처럼 기억될 때까지 마을을 한 바퀴 돌았습니다.");
  }
}

function handleActivityAction() {
  const game = state.activeMiniGame;
  if (!game) {
    return false;
  }
  if (game.completion?.active) {
    return false;
  }
  const assistedTarget = assistTouchActivityAction(game);
  if (assistedTarget?.requiresAction === false) {
    setActivityFeedback(`${game.phrase} · ${assistedTarget.prompt}. 조이스틱으로 움직이세요.`);
    updateMiniGameUi({ force: true });
    renderActivityScene();
    return false;
  }
  const player = game.player;
  const toolPose = getActivityToolPose(game);
  let didAction = false;
  let didLearningAction = false;
  game.actionPose = 0.24;

  if (game.kind === "gardenCare") {
    if (player.carrying !== "shears" && isNearActivityTarget(player, game.tool)) {
      player.carrying = "shears";
      playSfx("equipTool", {
        playbackRate: 1.04
      });
      setActivityFeedback("전지가위를 손에 들었습니다.");
      didAction = true;
    } else if (player.carrying === "shears") {
      const shrub = game.shrubs.find((entry) => !entry.trimmed && isToolTouchingCircle(toolPose, entry, 8));
      if (shrub) {
        playSfx("shearsTrim", {
          playbackRate: randomRange(0.96, 1.08),
          cooldownKey: `activity-shrub-${shrub.x}-${shrub.y}`
        });
        shrub.trimProgress = clamp(shrub.trimProgress + 0.5, 0, 1);
        shrub.shake = 1;
        shrub.trimmed = shrub.trimProgress >= 1;
        spawnActivityParticles(game, shrub.x, shrub.y - 4, {
          count: 6,
          kind: "leaf",
          palette: ["#9cc56c", "#7eaf63", "#b9d48e"],
          speed: 48,
          lift: 22,
          spread: 20,
          size: 4,
          life: 0.52
        });
        setActivityFeedback(
          shrub.trimmed
            ? "정원을 가꾸다 · 덤불이 보기 좋게 단정해졌습니다."
            : "정원을 가꾸다 · 가지 끝을 조금씩 손질하고 있습니다."
        );
        didAction = true;
        didLearningAction = true;
      }
    }
  } else if (game.kind === "lawnTrim") {
    if (!game.mower.attached && Math.hypot(player.x - game.mower.x, player.y - game.mower.y) < 36 + getInteractionAssist("activity") * 0.4) {
      game.mower.attached = true;
      player.carrying = "mower";
      playSfx("equipTool", {
        playbackRate: 0.96
      });
      setActivityFeedback("잔디깎는 기계를 붙잡았습니다. 이제 직접 밀어 보세요.");
      didAction = true;
    }
  } else if (game.kind === "vegetablePlant") {
    if (!game.tray.taken && isNearActivityTarget(player, game.tray)) {
      game.tray.taken = true;
      player.carrying = "seedlings";
      playSfx("equipTool", {
        playbackRate: 1.06
      });
      setActivityFeedback("모종 상자를 들었습니다.");
      didAction = true;
    } else if (game.tray.seedlings > 0) {
      const plot = game.plots.find((entry) => !entry.planted && isNearActivityTarget(player, entry, 18));
      if (plot) {
        playSfx("plantPop", {
          playbackRate: randomRange(0.96, 1.08),
          cooldownKey: `activity-plant-${plot.x}-${plot.y}`
        });
        plot.planted = true;
        plot.pop = 1;
        game.tray.seedlings -= 1;
        spawnActivityParticles(game, plot.x, plot.y + 6, {
          count: 5,
          kind: "soil",
          palette: ["#8d6e49", "#6a452d", "#b88b5c"],
          speed: 32,
          lift: 10,
          spread: 18,
          size: 3,
          life: 0.48
        });
        setActivityFeedback("채소를 심다 · 빈 흙자리에 모종이 하나 자리 잡았습니다.");
        didAction = true;
        didLearningAction = true;
        if (game.tray.seedlings <= 0) {
          player.carrying = null;
        }
      }
    }
  } else if (game.kind === "vegetableGrow") {
    if (!game.bucket.taken && isNearActivityTarget(player, game.bucket)) {
      game.bucket.taken = true;
      player.carrying = "bucket";
      playSfx("equipTool", {
        playbackRate: 0.98
      });
      setActivityFeedback("양동이를 들었습니다.");
      didAction = true;
    } else if (game.bucket.taken && isNearActivityTarget(player, game.well, 12)) {
      game.bucket.water = game.bucket.capacity;
      game.bucket.filledTrips += 1;
      playSfx("waterPour", {
        playbackRate: randomRange(0.94, 1.04),
        cooldownKey: "activity-well-fill"
      });
      spawnActivityParticles(game, game.well.x, game.well.y, {
        count: 6,
        kind: "water",
        palette: ["#9fd6e4", "#6bb4c7", "#d8f3fa"],
        speed: 34,
        lift: 18,
        spread: 16,
        size: 3,
        life: 0.46
      });
      setActivityFeedback("물을 뜨다 · 양동이에 물을 가득 채웠습니다.", "물을 뜨다");
      didAction = true;
    } else if (game.bucket.water > 0) {
      const plant = game.plants.find((entry) => !entry.watered && isNearActivityTarget(player, entry, 18));
      if (plant) {
        playSfx("waterPour", {
          playbackRate: randomRange(1.02, 1.12),
          cooldownKey: `activity-water-${plant.x}-${plant.y}`
        });
        plant.watered = true;
        plant.bounce = 1;
        plant.droop = 0;
        game.bucket.water -= 1;
        spawnActivityParticles(game, plant.x, plant.y - 4, {
          count: 7,
          kind: "water",
          palette: ["#9fd6e4", "#6bb4c7", "#d8f3fa"],
          speed: 28,
          lift: 22,
          spread: 16,
          size: 3,
          life: 0.44
        });
        setActivityFeedback("물을 주다 · 물을 머금은 잎이 다시 힘을 얻었습니다.", "물을 주다");
        didAction = true;
        didLearningAction = true;
      }
    }
  } else if (game.kind === "farmWork") {
    if (player.carrying !== "hoe" && isNearActivityTarget(player, game.tool)) {
      player.carrying = "hoe";
      playSfx("equipTool", {
        playbackRate: 1
      });
      setActivityFeedback("호미를 들었습니다. 고랑 위를 따라 천천히 걸어 보세요.");
      didAction = true;
    }
  } else if (game.kind === "raiseLivestock") {
    if (!game.feedBag.taken && isNearActivityTarget(player, game.feedBag)) {
      game.feedBag.taken = true;
      player.carrying = "feed";
      playSfx("equipTool", {
        playbackRate: 0.96
      });
      game.animals.forEach((animal) => {
        animal.interest = Math.max(animal.interest, 0.5);
      });
      setActivityFeedback("사료 자루를 어깨에 올렸습니다.");
      didAction = true;
    } else if (game.feedBag.servings > 0) {
      const trough = game.troughs.find((entry) => !entry.filled && isNearActivityTarget(player, entry, 18));
      if (trough) {
        playSfx("feedPour", {
          playbackRate: randomRange(0.96, 1.08),
          cooldownKey: `activity-feed-${trough.x}-${trough.y}`
        });
        trough.filled = true;
        trough.fillLevel = 1;
        trough.reaction = 1;
        game.feedBag.servings -= 1;
        game.animals.forEach((animal) => {
          animal.interest = Math.max(animal.interest, 0.85);
        });
        spawnActivityParticles(game, trough.x, trough.y - 6, {
          count: 6,
          kind: "feed",
          palette: ["#f0d27e", "#d8ba65", "#fff0ba"],
          speed: 28,
          lift: 12,
          spread: 14,
          size: 3,
          life: 0.5
        });
        setActivityFeedback("가축을 키우다 · 먹이를 채우자 동물들이 가까이 옵니다.");
        didAction = true;
        didLearningAction = true;
        if (game.feedBag.servings <= 0) {
          player.carrying = null;
        }
      }
    }
  } else if (game.kind === "catchFish") {
    if (!game.net.taken && isNearActivityTarget(player, game.net)) {
      game.net.taken = true;
      player.carrying = "net";
      playSfx("equipTool", {
        playbackRate: 1.02
      });
      setActivityFeedback("뜰채를 손에 쥐었습니다.");
      didAction = true;
    } else if (game.player.carryingCatch && isNearActivityTarget(player, game.basket, 18)) {
      game.player.carryingCatch = null;
      game.basket.stored += 1;
      playSfx("basketDrop", {
        playbackRate: randomRange(0.96, 1.04)
      });
      spawnActivityParticles(game, game.basket.x, game.basket.y - 8, {
        count: 5,
        kind: "splash",
        palette: ["#bde7f1", "#7bc0d5", "#fff5e9"],
        speed: 34,
        lift: 16,
        spread: 12,
        size: 3,
        life: 0.4
      });
      setActivityFeedback("물고기를 잡다 · 잡은 물고기를 바구니에 담았습니다.");
      didAction = true;
    } else if (game.net.taken && !game.player.carryingCatch) {
      const fish = game.fish.find(
        (entry) =>
          !entry.caught &&
          (isToolTouchingCircle(toolPose, entry, state.device?.isTouch ? 18 : 10) ||
            Math.hypot(player.x - entry.x, player.y - entry.y) < (state.device?.isTouch ? 46 : 34))
      );
      if (fish) {
        playSfx("fishHook", {
          playbackRate: randomRange(0.96, 1.1),
          cooldownKey: `activity-fish-${fish.x}-${fish.y}`
        });
        fish.caught = true;
        game.player.carryingCatch = "fish";
        spawnActivityParticles(game, fish.x, fish.y, {
          count: 7,
          kind: "splash",
          palette: ["#bde7f1", "#7bc0d5", "#fff5e9"],
          speed: 44,
          lift: 18,
          spread: 18,
          size: 4,
          life: 0.5
        });
        setActivityFeedback("물고기를 잡다 · 뜰채에 걸렸습니다. 바구니까지 옮기세요.");
        didAction = true;
        didLearningAction = true;
      }
    }
  }

  if (!didAction) {
    const target = assistedTarget ?? getNearestActivityTarget(game, 130);
    if (target) {
      setActivityFeedback(`${target.label} 쪽으로 더 가까이 가 보세요.`);
    } else {
      setActivityFeedback("손에 닿는 대상이 보이는 쪽으로 움직여 보세요.");
    }
  }
  if (didLearningAction) {
    accentActivityExpression(game, 1);
  }
  if (didAction) {
    persistGame("작업 저장");
  }
  updateMiniGameUi();
  renderActivityScene();
  return didAction;
}

function moveActivityPlayer(dt) {
  const game = state.activeMiniGame;
  if (!game) {
    return;
  }
  if (game.completion?.active) {
    return;
  }

  const player = game.player;
  player.prevX = player.x;
  player.prevY = player.y;

  const manualMovement = getMovementIntent();
  if (manualMovement.magnitude > 0 && state.autoNavigation.active) {
    cancelAutoNavigation();
  }
  const movement = manualMovement.magnitude > 0
    ? manualMovement
    : getAutoNavigationMovement("activity", player, dt);
  if (movement.magnitude === 0) {
    return;
  }

  const { dx, dy } = movement;

  if (Math.abs(dx) > Math.abs(dy)) {
    player.facing = dx > 0 ? "right" : "left";
  } else {
    player.facing = dy > 0 ? "down" : "up";
  }

  let speed = player.speed;
  if (state.device?.isTouch && !(state.controlMode === "tap" && state.autoNavigation.active)) {
    speed *= 0.4 + movement.magnitude * 0.6;
  }
  if (game.kind === "lawnTrim" && game.mower.attached) {
    speed *= state.device?.isTouch ? 0.88 : 0.82;
  }
  if (["seedlings", "bucket", "feed"].includes(player.carrying)) {
    speed *= state.device?.isTouch ? 0.95 : 0.9;
  }
  if (player.carryingCatch) {
    speed *= state.device?.isTouch ? 0.94 : 0.88;
  }

  player.x = clamp(player.x + dx * speed * dt, 36, game.width - 36);
  player.y = clamp(player.y + dy * speed * dt, 48, game.height - 36);

  if (state.device?.isTouch && Math.abs(dx) >= Math.abs(dy)) {
    if (game.kind === "lawnTrim" && game.mower.attached) {
      const nearestLane = game.lanes.reduce((best, lane) => {
        if (!best) {
          return lane;
        }
        const laneCenter = lane.y + lane.h / 2 - 8;
        const bestCenter = best.y + best.h / 2 - 8;
        return Math.abs(player.y - laneCenter) < Math.abs(player.y - bestCenter) ? lane : best;
      }, null);
      if (nearestLane) {
        const targetY = nearestLane.y + nearestLane.h / 2 - 8;
        player.y = clamp(lerp(player.y, targetY, Math.min(dt * 8, 1)), 48, game.height - 36);
      }
    }

    if (game.kind === "farmWork" && player.carrying === "hoe") {
      const nearestRow = game.rows.reduce((best, row) => {
        if (!best) {
          return row;
        }
        return Math.abs(player.y - row.y) < Math.abs(player.y - best.y) ? row : best;
      }, null);
      if (nearestRow) {
        player.y = clamp(lerp(player.y, nearestRow.y, Math.min(dt * 8.4, 1)), 48, game.height - 36);
      }
    }
  }

  player.step += dt * 10;
}

function isActivityComplete(game) {
  switch (game.kind) {
    case "gardenCare":
      return game.shrubs.every((shrub) => shrub.trimmed);
    case "lawnTrim":
      return game.lanes.every((lane) => isActivityCoverageComplete(lane.cut));
    case "vegetablePlant":
      return game.plots.every((plot) => plot.planted);
    case "vegetableGrow":
      return game.plants.every((plant) => plant.watered);
    case "farmWork":
      return game.rows.every((row) => isActivityCoverageComplete(row.progress));
    case "raiseLivestock":
      return game.troughs.every((trough) => trough.filled);
    case "catchFish":
      return game.basket.stored >= 2;
    default:
      return false;
  }
}

function prepareActivityFinalScene(game) {
  if (game.kind === "lawnTrim") {
    game.lanes.forEach((lane) => {
      lane.cells.fill(1);
      lane.cut = 1;
      lane.reaction = 1;
    });
  }
  if (game.kind === "farmWork") {
    game.rows.forEach((row) => {
      row.cells.fill(1);
      row.progress = 1;
      row.ripple = 1;
    });
  }
  if (game.kind === "raiseLivestock") {
    game.animals.forEach((animal) => {
      animal.interest = 1;
    });
    game.troughs.forEach((trough) => {
      trough.fillLevel = 1;
      trough.reaction = 1;
    });
  }
}

function beginActivityCompletion(game) {
  if (!game || game.completion.active) {
    return;
  }
  prepareActivityFinalScene(game);
  cancelAutoNavigation();
  resetTouchJoystick();
  game.completion.active = true;
  game.completion.timer = game.completion.duration;
  game.feedback = `${game.phrase} · 내 손으로 장면을 바꿨습니다.`;
  game.feedbackTimer = game.completion.duration;
  game.expressionCue = game.phrase;
  game.expressionCueTimer = game.completion.duration;
  accentActivityExpression(game, 1.55);
  spawnActivityParticles(game, game.width / 2, 98, {
    count: 18,
    kind: "sparkle",
    palette: ["#fff0b0", "#f1b56b", "#f7d6e0", "#b8d99a"],
    speed: 62,
    lift: 30,
    spread: 190,
    size: 6,
    life: game.completion.duration * 0.82
  });
  playSfx("taskComplete", { playbackRate: 1.02, volume: 0.64 });
  ui.miniGame.classList.add("is-complete");
  ui.miniGameClose.disabled = true;
  updateMiniGameUi({ force: true });
}

function updateActivityState(dt) {
  const game = state.activeMiniGame;
  if (!game) {
    return;
  }

  if (!game.completion.active) {
    moveActivityPlayer(dt);
  } else {
    game.player.prevX = game.player.x;
    game.player.prevY = game.player.y;
  }
  const movedDistance = Math.hypot(game.player.x - game.player.prevX, game.player.y - game.player.prevY);
  const movedHorizontally = Math.abs(game.player.x - game.player.prevX) >= Math.abs(game.player.y - game.player.prevY);
  game.actionPose = Math.max(game.actionPose - dt, 0);
  game.toolPose = getActivityToolPose(game);

  if (game.kind === "lawnTrim" && game.mower.attached) {
    const mowerDir = getFacingVector(game.player.facing);
    const mobileBandAssist = state.device?.isTouch ? 10 : 0;
    game.mower.x = game.player.x + mowerDir.x * 28;
    game.mower.y = game.player.y + mowerDir.y * 16 + 8;
    game.mower.tilt = (game.player.x - game.player.prevX) * 0.08;
    game.lanes.forEach((lane) => {
      lane.reaction = Math.max(lane.reaction - dt * 2.8, 0);
      const withinBand = Math.abs(game.mower.y - (lane.y + lane.h / 2)) < lane.h / 2 + 6 + mobileBandAssist;
      if (withinBand && movedHorizontally && movedDistance > 0.04) {
        const sideAssist = state.device?.isTouch ? 6 : 0;
        const startRatio = (game.mower.x - 22 - sideAssist - lane.x1) / lane.w;
        const endRatio = (game.mower.x + 18 + sideAssist - lane.x1) / lane.w;
        const previousCellCount = lane.cells.reduce((sum, cell) => sum + cell, 0);
        const wasComplete = isActivityCoverageComplete(lane.cut);
        markCoverageCells(lane.cells, startRatio, endRatio);
        lane.cut = getCoverageProgress(lane.cells);
        const nextCellCount = lane.cells.reduce((sum, cell) => sum + cell, 0);
        if (nextCellCount > previousCellCount) {
          lane.reaction = 1;
          playSfx("mowerPass", {
            playbackRate: 0.96,
            cooldownKey: "activity-mower-pass"
          });
        }
        if (!wasComplete && isActivityCoverageComplete(lane.cut)) {
          lane.cells.fill(1);
          lane.cut = 1;
          setActivityFeedback("잔디를 깎다 · 긴 잔디 한 줄이 짧고 환하게 정리됐습니다.");
          accentActivityExpression(game, 0.82);
          persistGame("작업 저장");
        }
        if (nextCellCount > previousCellCount && shouldEmitEffect(0.48)) {
          spawnActivityParticles(game, game.mower.x + 18, game.mower.y + 4, {
            count: 3,
            kind: "grass",
            palette: ["#9cc56c", "#dfe8a7", "#6f9a4f"],
            speed: 30,
            lift: 10,
            spread: 10,
            size: 3,
            life: 0.36
          });
        }
      }
    });
  }

  if (game.kind === "farmWork" && game.player.carrying === "hoe") {
    const rowTravel = Math.abs(game.player.x - game.player.prevX);
    const mobileRowAssist = state.device?.isTouch ? 6 : 0;
    game.rows.forEach((row) => {
      row.ripple = Math.max(row.ripple - dt * 2.4, 0);
      if (
        Math.abs(game.toolPose.tipY - row.y) < 16 + mobileRowAssist &&
        game.toolPose.tipX > row.x1 &&
        game.toolPose.tipX < row.x2 &&
        movedHorizontally &&
        movedDistance > 0.04
      ) {
        const tipAssist = state.device?.isTouch ? 6 : 0;
        const startRatio = (game.toolPose.tipX - 12 - tipAssist - row.x1) / (row.x2 - row.x1);
        const endRatio = (game.toolPose.tipX + 12 + tipAssist - row.x1) / (row.x2 - row.x1);
        const previousCellCount = row.cells.reduce((sum, cell) => sum + cell, 0);
        const wasComplete = isActivityCoverageComplete(row.progress);
        markCoverageCells(row.cells, startRatio, endRatio);
        row.progress = getCoverageProgress(row.cells);
        const nextCellCount = row.cells.reduce((sum, cell) => sum + cell, 0);
        if (nextCellCount > previousCellCount) {
          row.ripple = 1;
          playSfx("hoeDig", {
            playbackRate: 1.02,
            cooldownKey: "activity-hoe-dig"
          });
        }
        if (!wasComplete && isActivityCoverageComplete(row.progress)) {
          row.cells.fill(1);
          row.progress = 1;
          setActivityFeedback("농사를 짓다 · 흙 고랑 한 줄이 반듯하게 다져졌습니다.");
          accentActivityExpression(game, 0.82);
          persistGame("작업 저장");
        }
        if (nextCellCount > previousCellCount && rowTravel > 0.6 && shouldEmitEffect(0.44)) {
          spawnActivityParticles(game, game.toolPose.tipX, row.y + 4, {
            count: 3,
            kind: "soil",
            palette: ["#8d6e49", "#6a452d", "#b88b5c"],
            speed: 26,
            lift: 8,
            spread: 10,
            size: 3,
            life: 0.38
          });
        }
      }
    });
  }

  if (game.kind === "catchFish") {
    const threatRadius = state.device?.isTouch ? 88 : 96;
    const fishSpeedScale = state.device?.isTouch ? 0.84 : 1;
    const touchCatchAssistRadius = state.device?.isTouch ? 58 : 0;
    game.fish.forEach((fish) => {
      if (fish.caught) {
        return;
      }
      const threatX = game.net.taken ? game.toolPose.tipX : game.player.x;
      const threatY = game.net.taken ? game.toolPose.tipY : game.player.y;
      const dx = fish.x - threatX;
      const dy = fish.y - threatY;
      const distance = Math.hypot(dx, dy);
      if (state.device?.isTouch && game.net.taken && distance < touchCatchAssistRadius) {
        const pull = (touchCatchAssistRadius - distance) / touchCatchAssistRadius;
        fish.vx += (-dx / Math.max(distance, 1)) * pull * 64 * dt;
        fish.vy += (-dy / Math.max(distance, 1)) * pull * 56 * dt;
        fish.panic = Math.max(fish.panic - dt * 2.6, 0);
      } else if (distance < threatRadius) {
        const push = (threatRadius - distance) / threatRadius;
        fish.vx += (dx / Math.max(distance, 1)) * push * 54 * dt;
        fish.vy += (dy / Math.max(distance, 1)) * push * 54 * dt;
        fish.panic = Math.min(fish.panic + dt * 4.2, 1);
      } else {
        fish.panic = Math.max(fish.panic - dt * 1.8, 0);
      }

      const speed = Math.hypot(fish.vx, fish.vy);
      const maxSpeed = (64 + fish.panic * 36) * fishSpeedScale;
      if (speed > maxSpeed) {
        fish.vx = (fish.vx / speed) * maxSpeed;
        fish.vy = (fish.vy / speed) * maxSpeed;
      }
      fish.x += fish.vx * dt;
      fish.y += fish.vy * dt;
      fish.vx *= 0.995;
      fish.vy *= 0.995;
      if (fish.x < game.pond.x + 24 || fish.x > game.pond.x + game.pond.w - 24) {
        fish.vx *= -1;
      }
      if (fish.y < game.pond.y + 22 || fish.y > game.pond.y + game.pond.h - 22) {
        fish.vy *= -1;
      }
    });
  }

  if (game.kind === "raiseLivestock") {
    game.animals.forEach((animal, index) => {
      const trough = game.troughs[index % game.troughs.length];
      if (!trough) {
        return;
      }
      animal.interest = Math.max(animal.interest - dt * 0.55, 0);
      const nearFeed = game.player.carrying === "feed";
      const targetX = trough.filled ? trough.x - 44 : nearFeed ? game.player.x + (index === 0 ? -34 : 34) : animal.homeX;
      const targetY = trough.filled ? trough.y + (index === 0 ? 8 : -6) : nearFeed ? game.player.y + 24 : animal.homeY;
      const easing = Math.min(dt * 2.4, 1);
      animal.x += (targetX - animal.x) * easing;
      animal.y += (targetY - animal.y) * easing;
      animal.step += dt * 4;
    });
    game.troughs.forEach((trough) => {
      trough.reaction = Math.max(trough.reaction - dt * 2, 0);
      trough.fillLevel += ((trough.filled ? 1 : 0) - trough.fillLevel) * Math.min(dt * 4.5, 1);
    });
  }

  if (game.kind === "gardenCare") {
    game.shrubs.forEach((shrub) => {
      shrub.shake = Math.max(shrub.shake - dt * 3.6, 0);
    });
  }

  if (game.kind === "vegetablePlant") {
    game.plots.forEach((plot) => {
      plot.pop = Math.max(plot.pop - dt * 3.4, 0);
    });
  }

  if (game.kind === "vegetableGrow") {
    game.plants.forEach((plant) => {
      const targetDroop = plant.watered ? 0 : 1;
      plant.droop += (targetDroop - plant.droop) * Math.min(dt * 3.8, 1);
      plant.bounce = Math.max(plant.bounce - dt * 3.2, 0);
    });
  }

  game.particles = game.particles.filter((particle) => {
    particle.life -= dt;
    if (particle.life <= 0) {
      return false;
    }
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 34 * dt;
    particle.rotation += dt * 2.6;
    return true;
  });

  updateActivityExpressionState(game, dt, movedDistance);

  if (game.feedbackTimer > 0) {
    game.feedbackTimer = Math.max(game.feedbackTimer - dt, 0);
    if (game.feedbackTimer === 0) {
      game.feedback = "";
    }
  }
  if (game.expressionCueTimer > 0) {
    game.expressionCueTimer = Math.max(game.expressionCueTimer - dt, 0);
    if (game.expressionCueTimer === 0) {
      game.expressionCue = "";
    }
  }
}

function getActivityCanvasUiScale() {
  return /^phone/.test(state.device?.id ?? "") && state.device.viewportHeight <= 650 ? 1.12 : 1;
}

function drawActivityLabel(text, x, y, fillStyle = "rgba(32, 46, 28, 0.78)") {
  const uiScale = getActivityCanvasUiScale();
  activityCtx.fillStyle = fillStyle;
  activityCtx.font = `${(state.device?.isTouch ? 16 : 12) * uiScale}px "Gowun Dodum", sans-serif`;
  activityCtx.textAlign = "center";
  activityCtx.fillText(text, x, y);
}

function fillActivityRoundedRect(x, y, w, h, radius, fillStyle) {
  activityCtx.beginPath();
  activityCtx.moveTo(x + radius, y);
  activityCtx.arcTo(x + w, y, x + w, y + h, radius);
  activityCtx.arcTo(x + w, y + h, x, y + h, radius);
  activityCtx.arcTo(x, y + h, x, y, radius);
  activityCtx.arcTo(x, y, x + w, y, radius);
  activityCtx.closePath();
  activityCtx.fillStyle = fillStyle;
  activityCtx.fill();
}

function traceActivityOrganicPath(points) {
  const midpoint = (left, right) => [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
  const start = midpoint(points[points.length - 1], points[0]);
  activityCtx.beginPath();
  activityCtx.moveTo(start[0], start[1]);
  points.forEach((point, index) => {
    const end = midpoint(point, points[(index + 1) % points.length]);
    activityCtx.quadraticCurveTo(point[0], point[1], end[0], end[1]);
  });
  activityCtx.closePath();
}

function fillActivityOrganicRegion(points, palette) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const surface = activityCtx.createLinearGradient(minX, minY, minX, maxY);
  surface.addColorStop(0, palette.top);
  surface.addColorStop(0.55, palette.mid ?? palette.top);
  surface.addColorStop(1, palette.bottom);
  activityCtx.save();
  traceActivityOrganicPath(points);
  activityCtx.strokeStyle = palette.shoulder ?? "rgba(74, 104, 66, 0.14)";
  activityCtx.lineWidth = 12;
  activityCtx.lineJoin = "round";
  activityCtx.stroke();
  activityCtx.fillStyle = surface;
  traceActivityOrganicPath(points);
  activityCtx.fill();
  activityCtx.strokeStyle = palette.border ?? "rgba(246, 247, 218, 0.18)";
  activityCtx.lineWidth = 2.4;
  activityCtx.stroke();
  traceActivityOrganicPath(points);
  activityCtx.clip();
  const glow = activityCtx.createRadialGradient(minX + 110, minY + 52, 12, minX + 110, minY + 52, maxX - minX);
  glow.addColorStop(0, palette.glow ?? "rgba(255, 250, 215, 0.15)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  activityCtx.fillStyle = glow;
  activityCtx.fillRect(minX, minY, maxX - minX, maxY - minY);
  activityCtx.restore();
}

function drawActivityTargetHighlight(target) {
  if (!target) {
    return;
  }
  const pulse = state.device?.prefersReducedMotion
    ? 0.72
    : 0.72 + Math.sin(performance.now() / 180) * 0.12;
  const compactTargetScale = /^phone/.test(state.device?.id ?? "") ? 1.28 : 1;
  const targetRadius = (target.r ?? Math.max(target.w ?? 24, target.h ?? 24) * 0.42) + 10;
  const anchor = getActivityTargetAnchor(target);
  const halo = activityCtx.createRadialGradient(
    anchor.x,
    anchor.y,
    targetRadius * 0.22,
    anchor.x,
    anchor.y,
    targetRadius * 1.65 * compactTargetScale
  );
  halo.addColorStop(0, `rgba(255, 236, 178, ${0.14 + pulse * 0.06})`);
  halo.addColorStop(1, "rgba(255, 236, 178, 0)");
  activityCtx.fillStyle = halo;
  activityCtx.beginPath();
  activityCtx.arc(anchor.x, anchor.y, targetRadius * 1.65 * compactTargetScale, 0, Math.PI * 2);
  activityCtx.fill();

  activityCtx.save();
  activityCtx.strokeStyle = `rgba(214, 114, 78, ${0.58 + pulse * 0.2})`;
  activityCtx.lineWidth = 3 * compactTargetScale;
  if (target.shape === "rect") {
    activityCtx.strokeRect(target.x - 6, target.y - 6, target.w + 12, target.h + 12);
  } else {
    activityCtx.beginPath();
    activityCtx.arc(target.x, target.y, (target.r ?? 18) + 9 + pulse * 6 * compactTargetScale, 0, Math.PI * 2);
    activityCtx.stroke();
  }
  activityCtx.strokeStyle = `rgba(255, 249, 220, ${0.32 + pulse * 0.2})`;
  activityCtx.lineWidth = 1.5 * compactTargetScale;
  activityCtx.beginPath();
  activityCtx.arc(anchor.x, anchor.y, targetRadius + 7 * compactTargetScale, 0, Math.PI * 2);
  activityCtx.stroke();
  activityCtx.restore();

  const prompt = state.device?.isTouch
    ? `${target.label ?? "대상"} · ${getTouchActionLabel()}`
    : target.prompt;
  drawActivityLabel(prompt, anchor.x, anchor.y - (target.r ?? 24) - 18, "#8f3f2b");
}

function drawActivityAnimal(animal) {
  const bob = Math.sin(animal.step * 5) * (1.4 + animal.interest * 1.6);
  activityCtx.fillStyle = "rgba(31, 47, 31, 0.12)";
  activityCtx.beginPath();
  activityCtx.ellipse(animal.x, animal.y + 18, 22, 6, 0, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.save();
  activityCtx.translate(animal.x, animal.y + bob);
  activityCtx.lineCap = "round";

  const legColor = animal.kind === "pig" ? "#b77970" : "#806048";
  activityCtx.strokeStyle = legColor;
  activityCtx.lineWidth = 3;
  activityCtx.beginPath();
  activityCtx.moveTo(-9, 10);
  activityCtx.lineTo(-10, 20);
  activityCtx.moveTo(6, 10);
  activityCtx.lineTo(5, 20);
  activityCtx.stroke();

  if (animal.kind === "cow") {
    activityCtx.fillStyle = "#f3eee4";
    activityCtx.beginPath();
    activityCtx.ellipse(-2, 0, 25, 16, -0.04, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.fillStyle = "#98705c";
    activityCtx.beginPath();
    activityCtx.ellipse(-10, -5, 8, 6, -0.3, 0, Math.PI * 2);
    activityCtx.ellipse(4, 6, 7, 5, 0.22, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.fillStyle = "#ece5d9";
    activityCtx.beginPath();
    activityCtx.ellipse(20, -7, 13, 11, 0, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.strokeStyle = "#c9ad78";
    activityCtx.lineWidth = 2.4;
    activityCtx.beginPath();
    activityCtx.moveTo(15, -16);
    activityCtx.lineTo(12, -22);
    activityCtx.moveTo(24, -16);
    activityCtx.lineTo(28, -22);
    activityCtx.stroke();
    activityCtx.fillStyle = "#d9b2a1";
    activityCtx.beginPath();
    activityCtx.ellipse(24, -3, 8, 5, 0, 0, Math.PI * 2);
    activityCtx.fill();
  } else if (animal.kind === "pig") {
    activityCtx.fillStyle = "#e5a9a0";
    activityCtx.beginPath();
    activityCtx.ellipse(-2, 2, 24, 15, 0, 0, Math.PI * 2);
    activityCtx.ellipse(19, -5, 12, 11, 0, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.beginPath();
    activityCtx.moveTo(12, -14);
    activityCtx.lineTo(15, -22);
    activityCtx.lineTo(20, -14);
    activityCtx.moveTo(22, -14);
    activityCtx.lineTo(27, -21);
    activityCtx.lineTo(29, -12);
    activityCtx.fill();
    activityCtx.fillStyle = "#c9847a";
    activityCtx.beginPath();
    activityCtx.ellipse(26, -2, 7, 5, 0, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.strokeStyle = "#b77970";
    activityCtx.lineWidth = 2;
    activityCtx.beginPath();
    activityCtx.arc(-25, 0, 7, Math.PI * 0.6, Math.PI * 1.9);
    activityCtx.stroke();
    activityCtx.fillStyle = "#9d625c";
    activityCtx.beginPath();
    activityCtx.arc(24, -2, 1.2, 0, Math.PI * 2);
    activityCtx.arc(29, -2, 1.2, 0, Math.PI * 2);
    activityCtx.fill();
  } else {
    activityCtx.fillStyle = "#f3eee2";
    [-13, -4, 6, 15].forEach((offset, index) => {
      activityCtx.beginPath();
      activityCtx.arc(offset, index % 2 === 0 ? 1 : -2, 12, 0, Math.PI * 2);
      activityCtx.fill();
    });
    activityCtx.fillStyle = "#9a8269";
    activityCtx.beginPath();
    activityCtx.ellipse(22, -7, 11, 9, 0, 0, Math.PI * 2);
    activityCtx.ellipse(14, -12, 7, 3, -0.4, 0, Math.PI * 2);
    activityCtx.ellipse(29, -12, 7, 3, 0.4, 0, Math.PI * 2);
    activityCtx.fill();
  }

  activityCtx.fillStyle = "#493b32";
  activityCtx.beginPath();
  activityCtx.arc(21, -9, 1.7, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.fillStyle = "rgba(255, 251, 235, 0.3)";
  activityCtx.beginPath();
  activityCtx.ellipse(-9, -8, 8, 4, -0.25, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.restore();

  if (animal.interest > 0.12) {
    activityCtx.strokeStyle = `rgba(214, 114, 78, ${animal.interest * 0.7})`;
    activityCtx.lineWidth = 2;
    activityCtx.beginPath();
    activityCtx.arc(animal.x + 20, animal.y - 26 + bob, 6 + animal.interest * 4, Math.PI * 0.1, Math.PI * 0.9);
    activityCtx.stroke();
  }
}

function drawActivityExpression(game, focusTarget = null) {
  const alpha = clamp(game.expressionAlpha + game.expressionPulse * 0.12, 0, 0.78);
  if (alpha <= 0.06) {
    return;
  }

  const focusAnchor = focusTarget ? getActivityTargetAnchor(focusTarget) : null;
  const isNearFocus = focusAnchor
    ? Math.hypot(focusAnchor.x - game.player.x, focusAnchor.y - game.player.y) < 112
    : false;
  const expressionLift = isNearFocus ? 108 : 58;
  const rawLabelY = game.player.y - expressionLift - (state.device?.prefersReducedMotion ? 0 : Math.sin(performance.now() / 260) * 2.2);
  const rawLabelX = game.player.x;
  const uiScale = getActivityCanvasUiScale();
  const expressionLabel = game.expressionCue || game.phrase;

  activityCtx.save();
  const expressionFontSize = (state.device?.isTouch ? 20 : 15) * uiScale;
  activityCtx.font = `700 ${expressionFontSize}px "Gowun Dodum", sans-serif`;
  activityCtx.textAlign = "center";

  const textWidth = activityCtx.measureText(expressionLabel).width;
  const bubbleWidth = textWidth + (state.device?.isTouch ? 32 : 24) * uiScale;
  const bubbleHeight = (state.device?.isTouch ? 32 : 24) * uiScale;
  const labelX = clamp(rawLabelX, bubbleWidth / 2 + 10, game.width - bubbleWidth / 2 - 10);
  const labelY = clamp(rawLabelY, bubbleHeight + 8, game.height - 58);

  fillActivityRoundedRect(
    labelX - bubbleWidth / 2,
    labelY - (state.device?.isTouch ? 24 : 18) * uiScale,
    bubbleWidth,
    bubbleHeight,
    12,
    `rgba(255, 249, 239, ${0.5 + alpha * 0.42})`
  );

  activityCtx.fillStyle = `rgba(112, 50, 31, ${0.72 + alpha * 0.28})`;
  activityCtx.fillText(expressionLabel, labelX, labelY - 1);

  game.sweatDrops.forEach((drop) => {
    const dropAlpha = clamp((drop.life / drop.maxLife) * (0.18 + alpha * 0.66), 0, 1);
    activityCtx.fillStyle = `rgba(108, 164, 183, ${dropAlpha})`;
    activityCtx.beginPath();
    activityCtx.ellipse(drop.x, drop.y, drop.size * 0.6, drop.size, 0.08, 0, Math.PI * 2);
    activityCtx.fill();
  });

  activityCtx.restore();
}

function wrapCanvasTextLines(targetContext, text, maxWidth, maxLines = 2) {
  const characters = Array.from(String(text ?? ""));
  const lines = [];
  let current = "";
  let index = 0;
  while (index < characters.length && lines.length < maxLines) {
    const next = current + characters[index];
    if (current && targetContext.measureText(next).width > maxWidth) {
      lines.push(current.trim());
      current = "";
      continue;
    }
    current = next;
    index += 1;
  }
  if (current && lines.length < maxLines) {
    lines.push(current.trim());
  }
  if (index < characters.length && lines.length > 0) {
    let last = lines[lines.length - 1];
    while (last && targetContext.measureText(`${last}…`).width > maxWidth) {
      last = Array.from(last).slice(0, -1).join("");
    }
    lines[lines.length - 1] = `${last.trim()}…`;
  }
  return lines.length > 0 ? lines : [""];
}

function drawActivityCompletion(game) {
  if (!game.completion?.active) {
    return;
  }
  const progress = clamp(1 - game.completion.timer / Math.max(game.completion.duration, 0.01), 0, 1);
  const remaining = clamp(game.completion.timer / Math.max(game.completion.duration, 0.01), 0, 1);
  const alpha = Math.min(1, progress * 5, remaining * 4 + 0.12);
  const eased = 1 - Math.pow(1 - progress, 3);
  const compactOverlay = state.device?.id !== "desktop";
  if (compactOverlay) {
    const compactWidth = Math.min(game.width - 72, 370);
    const compactHeight = 58;
    const compactX = (game.width - compactWidth) / 2;
    const compactY = 14;
    activityCtx.save();
    activityCtx.globalAlpha = alpha;
    fillActivityRoundedRect(compactX, compactY, compactWidth, compactHeight, 20, "rgba(37, 55, 36, 0.9)");
    strokeActivityRoundedRect(compactX, compactY, compactWidth, compactHeight, 20, "rgba(255, 239, 188, 0.58)", 2);
    activityCtx.fillStyle = "#f6d88c";
    activityCtx.beginPath();
    activityCtx.arc(compactX + 31, compactY + compactHeight / 2, 16 + eased * 3, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.strokeStyle = "#40583b";
    activityCtx.lineWidth = 3.4;
    activityCtx.lineCap = "round";
    activityCtx.beginPath();
    activityCtx.moveTo(compactX + 23, compactY + 29);
    activityCtx.lineTo(compactX + 29, compactY + 35);
    activityCtx.lineTo(compactX + 40, compactY + 22);
    activityCtx.stroke();
    activityCtx.fillStyle = "#fff7df";
    activityCtx.font = `800 22px "Gowun Dodum", sans-serif`;
    activityCtx.textAlign = "left";
    activityCtx.textBaseline = "middle";
    activityCtx.fillText(game.phrase, compactX + 58, compactY + compactHeight / 2 + 1);
    activityCtx.restore();
    return;
  }
  const overlayScale = Math.min(getActivityCanvasUiScale(), 1.22);
  const cardWidth = Math.min(game.width - 46, 500 * overlayScale);
  const cardHeight = 108 * overlayScale;
  const cardX = (game.width - cardWidth) / 2;
  const cardY = 22;
  const checkX = cardX + 48 * overlayScale;
  const checkY = cardY + 48 * overlayScale;

  activityCtx.save();
  activityCtx.globalAlpha = alpha;
  fillActivityRoundedRect(cardX, cardY, cardWidth, cardHeight, 22 * overlayScale, "rgba(37, 55, 36, 0.92)");
  strokeActivityRoundedRect(cardX, cardY, cardWidth, cardHeight, 22 * overlayScale, "rgba(255, 239, 188, 0.62)", 2);

  activityCtx.fillStyle = "#f6d88c";
  activityCtx.beginPath();
  activityCtx.arc(checkX, checkY, (19 + eased * 5) * overlayScale, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.strokeStyle = "#40583b";
  activityCtx.lineWidth = 4 * overlayScale;
  activityCtx.lineCap = "round";
  activityCtx.beginPath();
  activityCtx.moveTo(checkX - 9 * overlayScale, checkY);
  activityCtx.lineTo(checkX - 2 * overlayScale, checkY + 8 * overlayScale);
  activityCtx.lineTo(checkX + 12 * overlayScale, checkY - 10 * overlayScale);
  activityCtx.stroke();

  const textX = checkX + 38 * overlayScale;
  const textWidth = cardX + cardWidth - textX - 22 * overlayScale;
  activityCtx.textAlign = "left";
  activityCtx.fillStyle = "#fff7df";
  activityCtx.font = `800 ${24 * overlayScale}px "Gowun Dodum", sans-serif`;
  activityCtx.fillText(game.phrase, textX, cardY + 38 * overlayScale);
  activityCtx.fillStyle = "#f4dcae";
  activityCtx.font = `700 ${15.5 * overlayScale}px "Gowun Dodum", sans-serif`;
  const lines = wrapCanvasTextLines(activityCtx, game.zone.afterText, textWidth, 2);
  lines.forEach((line, index) => {
    activityCtx.fillText(line, textX, cardY + (64 + index * 20) * overlayScale);
  });
  activityCtx.restore();
}

function traceRoundedRect(g, x, y, w, h, radius) {
  const safeRadius = Math.min(radius, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + safeRadius, y);
  g.arcTo(x + w, y, x + w, y + h, safeRadius);
  g.arcTo(x + w, y + h, x, y + h, safeRadius);
  g.arcTo(x, y + h, x, y, safeRadius);
  g.arcTo(x, y, x + w, y, safeRadius);
  g.closePath();
}

function fillRoundedRectOn(g, x, y, w, h, radius, fillStyle) {
  traceRoundedRect(g, x, y, w, h, radius);
  g.fillStyle = fillStyle;
  g.fill();
}

function strokeRoundedRectOn(g, x, y, w, h, radius, strokeStyle, lineWidth = 1) {
  traceRoundedRect(g, x, y, w, h, radius);
  g.strokeStyle = strokeStyle;
  g.lineWidth = lineWidth;
  g.stroke();
}

function drawStarburstOn(g, x, y, options = {}) {
  const {
    points = 4,
    outerRadius = 6,
    innerRadius = outerRadius * 0.42,
    rotation = 0,
    fillStyle = "#fff9ef",
    alpha = 1
  } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation);
  g.globalAlpha *= alpha;
  g.fillStyle = fillStyle;
  g.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * index) / points;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (index === 0) {
      g.moveTo(px, py);
    } else {
      g.lineTo(px, py);
    }
  }
  g.closePath();
  g.fill();
  g.restore();
}

function drawCanvasSeedlingCrate(g, x, y, options = {}) {
  const { scale = 1, sprouts = 3, rotation = 0 } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation);
  fillRoundedRectOn(g, -15 * scale, -10 * scale, 26 * scale, 18 * scale, 4 * scale, "#9a6b46");
  fillRoundedRectOn(g, -12 * scale, -5 * scale, 20 * scale, 8 * scale, 2 * scale, "rgba(100, 67, 43, 0.45)");
  g.strokeStyle = "rgba(245, 226, 196, 0.26)";
  g.lineWidth = 1.2 * scale;
  g.beginPath();
  g.moveTo(-12 * scale, -2 * scale);
  g.lineTo(8 * scale, -2 * scale);
  g.moveTo(-12 * scale, 2 * scale);
  g.lineTo(8 * scale, 2 * scale);
  g.stroke();
  for (let index = 0; index < Math.max(0, Math.min(sprouts, 4)); index += 1) {
    const px = (-9 + index * 7) * scale;
    g.fillStyle = index % 2 === 0 ? "#84c266" : "#a8d67a";
    g.beginPath();
    g.ellipse(px - 1.5 * scale, -12 * scale + (index % 2) * scale, 3.2 * scale, 4.8 * scale, -0.6, 0, Math.PI * 2);
    g.ellipse(px + 2 * scale, -12 * scale + (index % 2) * scale, 3.2 * scale, 4.8 * scale, 0.6, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#5b8b49";
    g.lineWidth = 1.2 * scale;
    g.beginPath();
    g.moveTo(px, -10 * scale);
    g.lineTo(px, -4 * scale);
    g.stroke();
  }
  g.restore();
}

function drawCanvasVegetablePlant(g, x, y, options = {}) {
  const {
    scale = 1,
    watered = false,
    mature = false,
    droop = 0,
    variant = 0,
    bounce = 0
  } = options;
  const stemTop = -12 * scale - bounce;
  const leafLift = mature ? 1.16 : 1;
  const leafColor = watered ? "#73ad57" : "#91a65d";
  const leafLight = watered ? "#a6ce75" : "#b8bd76";
  g.save();
  g.translate(x, y);
  g.lineCap = "round";
  g.strokeStyle = watered ? "#4f7f43" : "#6f8048";
  g.lineWidth = 3 * scale;
  g.beginPath();
  g.moveTo(0, 8 * scale);
  g.quadraticCurveTo(droop * 3 * scale, -1 * scale, 0, stemTop);
  g.stroke();

  const leafSpecs = [
    { side: -1, y: -5, rotation: -0.62 - droop * 0.42, size: 1 },
    { side: 1, y: -8, rotation: 0.62 + droop * 0.42, size: 0.92 },
    { side: -1, y: -13, rotation: -0.48 - droop * 0.28, size: 0.78 },
    { side: 1, y: -16, rotation: 0.48 + droop * 0.28, size: 0.72 }
  ];
  leafSpecs.slice(0, mature ? 4 : 2).forEach((leaf, index) => {
    g.save();
    g.translate(leaf.side * 4.5 * scale, leaf.y * scale - bounce * 0.5);
    g.rotate(leaf.rotation);
    g.fillStyle = index % 2 === 0 ? leafColor : leafLight;
    g.beginPath();
    g.ellipse(0, 0, 8 * leaf.size * scale * leafLift, 4.6 * leaf.size * scale * leafLift, 0, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "rgba(55, 92, 48, 0.34)";
    g.lineWidth = 1 * scale;
    g.beginPath();
    g.moveTo(-5 * leaf.size * scale, 0);
    g.lineTo(5 * leaf.size * scale, 0);
    g.stroke();
    g.restore();
  });

  if (mature) {
    const produceColors = ["#a7cc72", "#e4a75f", "#d98768", "#9bc86c"];
    const produce = produceColors[variant % produceColors.length];
    g.fillStyle = produce;
    g.beginPath();
    if (variant % 2 === 0) {
      g.arc(0, -10 * scale - bounce, 7 * scale, 0, Math.PI * 2);
      g.arc(-5 * scale, -8 * scale - bounce, 5 * scale, 0, Math.PI * 2);
      g.arc(5 * scale, -8 * scale - bounce, 5 * scale, 0, Math.PI * 2);
    } else {
      g.ellipse(0, -9 * scale - bounce, 6 * scale, 9 * scale, 0.08, 0, Math.PI * 2);
    }
    g.fill();
    g.fillStyle = "rgba(255, 247, 206, 0.28)";
    g.beginPath();
    g.ellipse(-2.5 * scale, -13 * scale - bounce, 2.4 * scale, 1.8 * scale, -0.3, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function drawCanvasBucket(g, x, y, options = {}) {
  const { scale = 1, water = 0, rotation = 0 } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation);
  fillRoundedRectOn(g, -10 * scale, -10 * scale, 20 * scale, 22 * scale, 5 * scale, "#8d6a4e");
  fillRoundedRectOn(g, -9 * scale, -8 * scale, 18 * scale, 18 * scale, 4 * scale, "rgba(202, 181, 154, 0.14)");
  g.strokeStyle = "#6d4d34";
  g.lineWidth = 2 * scale;
  g.beginPath();
  g.arc(0, -11 * scale, 8 * scale, Math.PI, 0);
  g.stroke();
  g.strokeStyle = "rgba(249, 236, 214, 0.34)";
  g.lineWidth = 1.2 * scale;
  g.beginPath();
  g.moveTo(-6 * scale, -5 * scale);
  g.lineTo(-2 * scale, -8 * scale);
  g.stroke();
  if (water > 0) {
    const waterLevel = clamp(water, 0, 1);
    const waterHeight = (3 + waterLevel * 5) * scale;
    fillRoundedRectOn(g, -8 * scale, (4 - waterHeight / scale) * scale, 16 * scale, waterHeight, 2 * scale, "#74bfd3");
    g.fillStyle = "rgba(245, 252, 255, 0.4)";
    g.fillRect(-6 * scale, (3 - waterHeight / scale) * scale, 10 * scale, 1.6 * scale);
  }
  g.restore();
}

function drawCanvasFeedBag(g, x, y, options = {}) {
  const { scale = 1, rotation = 0, open = 0.5 } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation);
  fillRoundedRectOn(g, -12 * scale, -14 * scale, 24 * scale, 28 * scale, 7 * scale, "#c6ab74");
  g.fillStyle = "rgba(118, 89, 53, 0.16)";
  g.fillRect(-9 * scale, -4 * scale, 18 * scale, 8 * scale);
  g.strokeStyle = "#8b6941";
  g.lineWidth = 1.6 * scale;
  g.beginPath();
  g.moveTo(-8 * scale, -3 * scale);
  g.lineTo(7 * scale, -8 * scale);
  g.stroke();
  g.fillStyle = `rgba(240, 216, 140, ${0.28 + open * 0.32})`;
  g.beginPath();
  g.arc(5 * scale, -2 * scale, 2.6 * scale, 0, Math.PI * 2);
  g.arc(0, 2 * scale, 2 * scale, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function drawCanvasBasket(g, x, y, options = {}) {
  const { scale = 1, stored = 0, rotation = 0, itemAssets = null } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation);
  fillRoundedRectOn(g, -22 * scale, -14 * scale, 44 * scale, 28 * scale, 12 * scale, "#9d7048");
  g.strokeStyle = "rgba(244, 227, 192, 0.7)";
  g.lineWidth = 1.8 * scale;
  g.strokeRect(-14 * scale, -5 * scale, 28 * scale, 14 * scale);
  g.strokeStyle = "rgba(120, 84, 49, 0.34)";
  g.beginPath();
  g.arc(0, -11 * scale, 14 * scale, Math.PI, 0);
  g.stroke();
  if (stored > 0) {
    const visibleAssets = Array.isArray(itemAssets) ? itemAssets.filter(Boolean).slice(0, Math.max(1, stored)) : [];
    if (visibleAssets.length > 0) {
      visibleAssets.forEach((asset, index) => {
        const offsetX = (-8 + index * 8) * scale;
        const offsetY = (-5 - (index % 2) * 3) * scale;
        drawCenteredImageAssetOn(g, asset, offsetX, offsetY, 17 * scale, 17 * scale);
      });
    } else {
      for (let index = 0; index < Math.min(stored, 2); index += 1) {
        drawCanvasFish(g, (-7 + index * 14) * scale, (-5 - index * 3) * scale, {
          scale: 0.72 * scale,
          rotation: index % 2 === 0 ? 0.08 : -0.08,
          palette: index % 2 === 0
            ? ["#fff5e9", "#f7d9a2", "#7ba9b8"]
            : ["#f8e5bb", "#f1b972", "#7aa7bc"]
        });
      }
    }
  }
  g.restore();
}

function drawCanvasFish(g, x, y, options = {}) {
  const {
    scale = 1,
    rotation = 0,
    palette = ["#fff5e9", "#f7d9a2", "#7ba9b8"],
    lively = 0
  } = options;
  g.save();
  g.translate(x, y);
  g.rotate(rotation + lively * 0.06);
  g.fillStyle = palette[0];
  g.beginPath();
  g.ellipse(0, 0, 11 * scale, 6.5 * scale, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = palette[1];
  g.beginPath();
  g.moveTo(-10.5 * scale, 0);
  g.lineTo(-20 * scale, -6 * scale);
  g.lineTo(-20 * scale, 6 * scale);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(123, 169, 184, 0.85)";
  g.lineWidth = 1.1 * scale;
  g.beginPath();
  g.moveTo(-2 * scale, -4 * scale);
  g.lineTo(8 * scale, 3 * scale);
  g.stroke();
  g.fillStyle = palette[2];
  g.beginPath();
  g.arc(7 * scale, -1.5 * scale, 1.4 * scale, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.beginPath();
  g.ellipse(3 * scale, -3 * scale, 3.8 * scale, 1.4 * scale, -0.2, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function drawActivityParticles(game) {
  game.particles.forEach((particle) => {
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    activityCtx.save();
    activityCtx.translate(particle.x, particle.y);
    activityCtx.rotate(particle.rotation);
    activityCtx.globalAlpha = alpha * 0.9;

    if (particle.kind === "leaf" || particle.kind === "grass") {
      activityCtx.fillStyle = particle.color;
      activityCtx.beginPath();
      activityCtx.ellipse(0, 0, particle.size * 0.55, particle.size, 0, 0, Math.PI * 2);
      activityCtx.fill();
      activityCtx.strokeStyle = "rgba(72, 109, 57, 0.42)";
      activityCtx.lineWidth = Math.max(1, particle.size * 0.16);
      activityCtx.beginPath();
      activityCtx.moveTo(-particle.size * 0.24, particle.size * 0.7);
      activityCtx.lineTo(particle.size * 0.2, -particle.size * 0.65);
      activityCtx.stroke();
      activityCtx.fillStyle = "rgba(255, 250, 233, 0.28)";
      activityCtx.beginPath();
      activityCtx.ellipse(-particle.size * 0.12, -particle.size * 0.16, particle.size * 0.2, particle.size * 0.34, 0, 0, Math.PI * 2);
      activityCtx.fill();
    } else if (particle.kind === "water" || particle.kind === "splash") {
      activityCtx.fillStyle = particle.color;
      activityCtx.beginPath();
      activityCtx.ellipse(0, 0, particle.size * 0.6, particle.size, 0.1, 0, Math.PI * 2);
      activityCtx.fill();
      activityCtx.fillStyle = "rgba(255,255,255,0.46)";
      activityCtx.beginPath();
      activityCtx.arc(-particle.size * 0.14, -particle.size * 0.22, particle.size * 0.18, 0, Math.PI * 2);
      activityCtx.fill();
    } else if (particle.kind === "soil" || particle.kind === "feed") {
      activityCtx.fillStyle = particle.color;
      activityCtx.beginPath();
      activityCtx.moveTo(-particle.size * 0.42, -particle.size * 0.16);
      activityCtx.lineTo(particle.size * 0.18, -particle.size * 0.42);
      activityCtx.lineTo(particle.size * 0.5, particle.size * 0.1);
      activityCtx.lineTo(-particle.size * 0.08, particle.size * 0.46);
      activityCtx.closePath();
      activityCtx.fill();
      activityCtx.fillStyle = "rgba(255, 241, 220, 0.2)";
      activityCtx.beginPath();
      activityCtx.arc(-particle.size * 0.08, -particle.size * 0.12, particle.size * 0.14, 0, Math.PI * 2);
      activityCtx.fill();
    } else {
      drawStarburstOn(activityCtx, 0, 0, {
        outerRadius: particle.size * 0.72,
        innerRadius: particle.size * 0.26,
        fillStyle: particle.color,
        alpha: 0.88,
        rotation: particle.rotation
      });
    }

    activityCtx.restore();
  });
}

function drawHeldActivityTool(game, bob) {
  const { player } = game;
  const pose = game.toolPose ?? getActivityToolPose(game);

  if (game.kind === "lawnTrim" && game.mower.attached) {
    activityCtx.save();
    activityCtx.strokeStyle = "#7a5637";
    activityCtx.lineWidth = 3;
    activityCtx.beginPath();
    activityCtx.moveTo(player.x + 8, player.y - 4 + bob);
    activityCtx.lineTo(game.mower.x - 10, game.mower.y - 2);
    activityCtx.stroke();
    activityCtx.restore();
  }

  if (!player.carrying || player.carrying === "mower") {
    return;
  }

  activityCtx.save();
  activityCtx.translate(pose.handX, pose.handY + bob * 0.25);
  activityCtx.rotate(pose.angle);

  if (player.carrying === "shears") {
    activityCtx.strokeStyle = "#d9dfe3";
    activityCtx.lineWidth = 2.6;
    activityCtx.beginPath();
    activityCtx.moveTo(-9, -7);
    activityCtx.lineTo(11, -1);
    activityCtx.moveTo(-9, 7);
    activityCtx.lineTo(11, 1);
    activityCtx.stroke();
    activityCtx.strokeStyle = "#c15f3f";
    activityCtx.lineWidth = 2.1;
    activityCtx.beginPath();
    activityCtx.arc(-12, -6, 4.6, 0, Math.PI * 2);
    activityCtx.arc(-12, 6, 4.6, 0, Math.PI * 2);
    activityCtx.stroke();
    activityCtx.fillStyle = "#f2ddbf";
    activityCtx.beginPath();
    activityCtx.arc(10, 0, 2.8, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.fillStyle = "rgba(255,255,255,0.38)";
    activityCtx.fillRect(-3, -2, 8, 1.5);
  } else if (player.carrying === "seedlings") {
    drawCanvasSeedlingCrate(activityCtx, -2, -1, { scale: 0.9, sprouts: game.tray?.seedlings ?? 0 });
  } else if (player.carrying === "bucket") {
    drawCanvasBucket(activityCtx, -1, 0, {
      scale: 0.95,
      water: (game.bucket?.water ?? 0) / Math.max(game.bucket?.capacity ?? 1, 1),
      rotation: 0.04
    });
  } else if (player.carrying === "hoe") {
    activityCtx.strokeStyle = "#8d6e49";
    activityCtx.lineWidth = 3;
    activityCtx.beginPath();
    activityCtx.moveTo(-10, 0);
    activityCtx.lineTo(19, 0);
    activityCtx.stroke();
    activityCtx.fillStyle = "#d8bb7a";
    activityCtx.beginPath();
    activityCtx.moveTo(18, -4);
    activityCtx.lineTo(29, -3);
    activityCtx.lineTo(24, 7);
    activityCtx.lineTo(18, 5);
    activityCtx.closePath();
    activityCtx.fill();
    activityCtx.strokeStyle = "#9f824a";
    activityCtx.lineWidth = 1.2;
    activityCtx.stroke();
    activityCtx.fillStyle = "rgba(255,255,255,0.28)";
    activityCtx.fillRect(16, -14, 7, 2);
  } else if (player.carrying === "feed") {
    drawCanvasFeedBag(activityCtx, 0, 0, {
      scale: 0.92,
      rotation: -0.04,
      open: clamp((game.feedBag?.servings ?? 0) / 2, 0.16, 0.82)
    });
  } else if (player.carrying === "net") {
    activityCtx.strokeStyle = "#8d6e49";
    activityCtx.lineWidth = 2.6;
    activityCtx.beginPath();
    activityCtx.moveTo(-10, 0);
    activityCtx.lineTo(18, 0);
    activityCtx.stroke();
    activityCtx.beginPath();
    activityCtx.arc(22, 0, 10, 0, Math.PI * 2);
    activityCtx.stroke();
    activityCtx.strokeStyle = "rgba(244, 232, 210, 0.42)";
    activityCtx.lineWidth = 1;
    activityCtx.beginPath();
    activityCtx.moveTo(16, -5);
    activityCtx.lineTo(28, 5);
    activityCtx.moveTo(16, 5);
    activityCtx.lineTo(28, -5);
    activityCtx.moveTo(22, -9);
    activityCtx.lineTo(22, 9);
    activityCtx.moveTo(13, 0);
    activityCtx.lineTo(31, 0);
    activityCtx.stroke();
    activityCtx.fillStyle = "rgba(255,255,255,0.18)";
    activityCtx.beginPath();
    activityCtx.arc(22, 0, 5, 0, Math.PI * 2);
    activityCtx.fill();
  }

  activityCtx.restore();
}

function drawActivityPersonFigure(game, options = {}) {
  const { player } = game;
  const { bodyColor = "#c15f3f", accentColor = "#f4e8cf", hatColor = "#6a8e5a", skinColor = "#f8efe1" } = options;
  const bob = Math.sin(player.step * 5) * 1.6;
  const dirX = player.facing === "left" ? -1 : player.facing === "right" ? 1 : 0;
  const dirY = player.facing === "up" ? -1 : player.facing === "down" ? 1 : 0;
  const stride = Math.sin(player.step * 5) * 3.2;
  const torsoY = player.y + 1 + bob;
  const headY = player.y - 12 + bob;
  const pose = game.toolPose ?? getActivityToolPose(game);
  const backShoulderX = player.x - 11 - dirX * 1.5;
  const backShoulderY = torsoY - 2;
  const frontShoulderX = player.x + 11 + dirX * 0.5;
  const frontShoulderY = torsoY - 3;

  drawActivityEllipseShadow(player.x, player.y + 21, 17, 6.4, 0.18);

  activityCtx.strokeStyle = "#6b4c37";
  activityCtx.lineWidth = 4;
  activityCtx.lineCap = "round";
  activityCtx.beginPath();
  activityCtx.moveTo(player.x - 5.5, torsoY + 13);
  activityCtx.lineTo(player.x - 6.5 + stride, torsoY + 27);
  activityCtx.moveTo(player.x + 5.5, torsoY + 13);
  activityCtx.lineTo(player.x + 6.5 - stride, torsoY + 27);
  activityCtx.stroke();

  activityCtx.fillStyle = "#734f35";
  activityCtx.beginPath();
  activityCtx.ellipse(player.x - 7 + stride, torsoY + 27, 5.2, 2.4, 0, 0, Math.PI * 2);
  activityCtx.ellipse(player.x + 7 - stride, torsoY + 27, 5.2, 2.4, 0, 0, Math.PI * 2);
  activityCtx.fill();

  activityCtx.strokeStyle = "rgba(105, 75, 55, 0.72)";
  activityCtx.lineWidth = 3;
  activityCtx.beginPath();
  activityCtx.moveTo(backShoulderX, backShoulderY);
  activityCtx.lineTo(player.x - 16 - dirX * 1.5, torsoY + 9 + stride * 0.18);
  activityCtx.stroke();

  activityCtx.fillStyle = bodyColor;
  activityCtx.beginPath();
  activityCtx.ellipse(player.x, torsoY + 1, 16, 18, 0, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.fillStyle = "rgba(255, 244, 230, 0.14)";
  activityCtx.beginPath();
  activityCtx.ellipse(player.x - 4, torsoY - 5, 8, 5, -0.4, 0, Math.PI * 2);
  activityCtx.fill();

  fillActivityRoundedRect(player.x - 9, torsoY - 3, 18, 18, 6, accentColor);
  activityCtx.strokeStyle = "rgba(115, 148, 84, 0.72)";
  activityCtx.lineWidth = 1.8;
  activityCtx.beginPath();
  activityCtx.moveTo(player.x - 8, torsoY + 12);
  activityCtx.lineTo(player.x + 8, torsoY - 1);
  activityCtx.stroke();
  activityCtx.fillStyle = "#f1d48b";
  activityCtx.fillRect(player.x - 4, torsoY - 6, 8, 4);
  activityCtx.fillStyle = "#7aa060";
  activityCtx.fillRect(player.x - 2.8, torsoY + 2, 5.6, 9);

  activityCtx.fillStyle = skinColor;
  activityCtx.beginPath();
  activityCtx.ellipse(player.x, headY, 8.9, 9.9, 0, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.fillStyle = "rgba(255, 255, 255, 0.25)";
  activityCtx.beginPath();
  activityCtx.ellipse(player.x - 2.5, headY - 3.8, 3.1, 2.2, -0.4, 0, Math.PI * 2);
  activityCtx.fill();

  activityCtx.fillStyle = "#6f4f38";
  activityCtx.beginPath();
  activityCtx.arc(player.x, headY - 2, 8.6, Math.PI, Math.PI * 2);
  activityCtx.fill();
  activityCtx.fillStyle = hatColor;
  activityCtx.fillRect(player.x - 13 + dirX * 1.6, headY - 14, 26, 4);
  activityCtx.fillStyle = "#7a5737";
  activityCtx.fillRect(player.x - 11, headY - 19, 22, 7);
  activityCtx.fillStyle = hatColor;
  activityCtx.fillRect(player.x - 11, headY - 17, 22, 3);
  activityCtx.fillStyle = "rgba(54, 73, 42, 0.18)";
  activityCtx.fillRect(player.x - 11, headY - 14, 22, 3);

  if (player.facing !== "up") {
    activityCtx.fillStyle = "rgba(110, 77, 56, 0.92)";
    activityCtx.beginPath();
    if (player.facing === "left") {
      activityCtx.arc(player.x - 4, headY - 1, 1.2, 0, Math.PI * 2);
      activityCtx.fill();
    } else if (player.facing === "right") {
      activityCtx.arc(player.x + 4, headY - 1, 1.2, 0, Math.PI * 2);
      activityCtx.fill();
    } else {
      activityCtx.arc(player.x - 3.4, headY - 1 + dirY * 0.8, 1.2, 0, Math.PI * 2);
      activityCtx.arc(player.x + 3.4, headY - 1 + dirY * 0.8, 1.2, 0, Math.PI * 2);
      activityCtx.fill();
    }
    activityCtx.strokeStyle = "rgba(181, 112, 98, 0.85)";
    activityCtx.lineWidth = 1.4;
    activityCtx.beginPath();
    activityCtx.arc(player.x + dirX * 1.2, headY + 3, 2.6, 0.2, Math.PI - 0.2);
    activityCtx.stroke();
    activityCtx.fillStyle = "rgba(229, 175, 153, 0.6)";
    activityCtx.beginPath();
    activityCtx.arc(player.x - 5, headY + 2, 1.6, 0, Math.PI * 2);
    activityCtx.arc(player.x + 5, headY + 2, 1.6, 0, Math.PI * 2);
    activityCtx.fill();
  }

  drawHeldActivityTool(game, bob);

  activityCtx.strokeStyle = "rgba(111, 79, 57, 0.92)";
  activityCtx.lineWidth = 3.4;
  activityCtx.beginPath();
  activityCtx.moveTo(frontShoulderX, frontShoulderY);
  activityCtx.lineTo(pose.handX - dirX * 0.4, pose.handY + bob * 0.18);
  activityCtx.stroke();
  activityCtx.fillStyle = skinColor;
  activityCtx.beginPath();
  activityCtx.arc(pose.handX, pose.handY + bob * 0.2, 3.2, 0, Math.PI * 2);
  activityCtx.fill();
}

function drawActivityPlayer(game) {
  const { player } = game;
  const bob = Math.sin(player.step * 5) * 1.6;
  drawActivityPersonFigure(game);

  if (player.carryingCatch) {
    drawCanvasFish(activityCtx, player.x + 18, player.y - 8 + bob, {
      scale: 0.92,
      rotation: 0.1,
      palette: ["#fff5e9", "#f7d9a2", "#7ba9b8"]
    });
  }
}

function strokeActivityRoundedRect(x, y, w, h, radius, strokeStyle, lineWidth = 1) {
  activityCtx.beginPath();
  activityCtx.moveTo(x + radius, y);
  activityCtx.arcTo(x + w, y, x + w, y + h, radius);
  activityCtx.arcTo(x + w, y + h, x, y + h, radius);
  activityCtx.arcTo(x, y + h, x, y, radius);
  activityCtx.arcTo(x, y, x + w, y, radius);
  activityCtx.closePath();
  activityCtx.strokeStyle = strokeStyle;
  activityCtx.lineWidth = lineWidth;
  activityCtx.stroke();
}

function drawActivityEllipseShadow(x, y, rx, ry, alpha = 0.12) {
  activityCtx.fillStyle = `rgba(31, 47, 31, ${alpha})`;
  activityCtx.beginPath();
  activityCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  activityCtx.fill();
}

function drawActivityGrassTexture(x, y, w, h, density = 36, color = "rgba(103, 141, 78, 0.18)") {
  activityCtx.strokeStyle = color;
  activityCtx.lineWidth = 1.3;
  const bladeCount = scaleEffectCount(density, 10);
  for (let index = 0; index < bladeCount; index += 1) {
    const px = x + ((index * 29) % w);
    const py = y + ((index * 47) % h);
    activityCtx.beginPath();
    activityCtx.moveTo(px, py + 6);
    activityCtx.lineTo(px + ((index % 3) - 1) * 3, py - 5);
    activityCtx.stroke();
  }
}

function drawActivitySoilTexture(x, y, w, h, rows = 6) {
  const rowCount = Math.max(3, Math.round(rows * (0.75 + getEffectDensity() * 0.25)));
  for (let row = 0; row < rowCount; row += 1) {
    const rowY = y + 18 + row * ((h - 36) / rowCount);
    activityCtx.strokeStyle = row % 2 === 0 ? "rgba(217, 187, 123, 0.15)" : "rgba(102, 68, 43, 0.18)";
    activityCtx.lineWidth = 3;
    activityCtx.beginPath();
    activityCtx.moveTo(x + 14, rowY);
    activityCtx.lineTo(x + w - 14, rowY + 8);
    activityCtx.stroke();
  }
}

function drawActivityFenceSegment(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const steps = Math.max(2, Math.floor(length / 26));
  const nx = dx / steps;
  const ny = dy / steps;
  activityCtx.strokeStyle = "#8e6846";
  activityCtx.lineWidth = 3;
  activityCtx.beginPath();
  activityCtx.moveTo(x1, y1);
  activityCtx.lineTo(x2, y2);
  activityCtx.stroke();
  for (let index = 0; index <= steps; index += 1) {
    const px = x1 + nx * index;
    const py = y1 + ny * index;
    activityCtx.strokeStyle = "#7b5637";
    activityCtx.lineWidth = 4;
    activityCtx.beginPath();
    activityCtx.moveTo(px, py - 8);
    activityCtx.lineTo(px, py + 10);
    activityCtx.stroke();
  }
}

function drawActivityFlowerCluster(x, y, palette) {
  palette.forEach((color, index) => {
    const px = x + Math.cos(index * 1.7) * 8;
    const py = y + Math.sin(index * 2.3) * 4;
    activityCtx.fillStyle = color;
    activityCtx.beginPath();
    activityCtx.arc(px, py, 3 + (index % 2), 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.fillStyle = "#f7efdc";
    activityCtx.beginPath();
    activityCtx.arc(px, py, 1.2, 0, Math.PI * 2);
    activityCtx.fill();
  });
}

function drawActivityStonePath(x, y, w, h) {
  fillActivityRoundedRect(x, y, w, h, 20, "#ead8ae");
  strokeActivityRoundedRect(x, y, w, h, 20, "rgba(146, 114, 77, 0.18)", 2);
  activityCtx.fillStyle = "rgba(182, 150, 105, 0.18)";
  const pebbleCount = scaleEffectCount(52, 18);
  for (let index = 0; index < pebbleCount; index += 1) {
    const px = x + 18 + ((index * 31) % (w - 36));
    const py = y + 18 + ((index * 27) % (h - 36));
    activityCtx.beginPath();
    activityCtx.ellipse(px, py, 4 + (index % 3), 1.6 + (index % 2) * 0.6, 0.4, 0, Math.PI * 2);
    activityCtx.fill();
  }
}

function drawActivityBackdrop(game, palette = {}) {
  const sky = activityCtx.createLinearGradient(0, 0, 0, game.height);
  sky.addColorStop(0, palette.skyTop ?? "#cfe2c5");
  sky.addColorStop(0.5, palette.skyMid ?? "#dbe8d0");
  sky.addColorStop(1, palette.skyBottom ?? "#efe6cd");
  activityCtx.fillStyle = sky;
  activityCtx.fillRect(0, 0, game.width, game.height);

  const haze = activityCtx.createLinearGradient(0, 44, 0, 240);
  haze.addColorStop(0, "rgba(255,255,255,0)");
  haze.addColorStop(0.56, palette.haze ?? "rgba(255, 248, 219, 0.16)");
  haze.addColorStop(1, "rgba(255,255,255,0)");
  activityCtx.fillStyle = haze;
  activityCtx.fillRect(0, 0, game.width, game.height);

  const sun = activityCtx.createRadialGradient(game.width * 0.76, 70, 10, game.width * 0.76, 70, 72);
  sun.addColorStop(0, "rgba(255, 244, 201, 0.72)");
  sun.addColorStop(1, "rgba(255,255,255,0)");
  activityCtx.fillStyle = sun;
  activityCtx.beginPath();
  activityCtx.arc(game.width * 0.76, 70, 72, 0, Math.PI * 2);
  activityCtx.fill();
  const sunWide = activityCtx.createRadialGradient(game.width * 0.76, 70, 20, game.width * 0.76, 70, 132);
  sunWide.addColorStop(0, "rgba(255,255,255,0.08)");
  sunWide.addColorStop(1, "rgba(255,255,255,0)");
  activityCtx.fillStyle = sunWide;
  activityCtx.beginPath();
  activityCtx.arc(game.width * 0.76, 70, 132, 0, Math.PI * 2);
  activityCtx.fill();

  const cloudTint = palette.cloudTint ?? "rgba(255,255,255,0.34)";
  const cloudCount = scaleEffectCount(4, 2);
  for (let index = 0; index < cloudCount; index += 1) {
    const x = 86 + index * 132;
    const y = 56 + (index % 2) * 22;
    activityCtx.fillStyle = "rgba(255,255,255,0.16)";
    activityCtx.beginPath();
    activityCtx.ellipse(x + 10, y + 12, 38, 10, 0, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.fillStyle = cloudTint;
    activityCtx.beginPath();
    activityCtx.ellipse(x, y, 28, 16, 0, 0, Math.PI * 2);
    activityCtx.ellipse(x + 26, y + 2, 24, 14, 0, 0, Math.PI * 2);
    activityCtx.ellipse(x - 24, y + 4, 22, 12, 0, 0, Math.PI * 2);
    activityCtx.fill();
  }

  const hills = palette.hills ?? [
    "rgba(164, 188, 147, 0.6)",
    "rgba(130, 161, 113, 0.42)",
    "rgba(104, 132, 92, 0.26)"
  ];

  [
    { baseY: 154, points: [[0, 176], [110, 150], [220, 170], [340, 146], [470, 172], [640, 144]], color: hills[0] },
    { baseY: 194, points: [[0, 208], [90, 186], [210, 214], [350, 182], [480, 208], [640, 182]], color: hills[1] },
    { baseY: 228, points: [[0, 246], [120, 220], [240, 248], [380, 218], [520, 242], [640, 220]], color: hills[2] }
  ].forEach((hill) => {
    activityCtx.fillStyle = hill.color;
    activityCtx.beginPath();
    activityCtx.moveTo(-20, game.height);
    activityCtx.lineTo(-20, hill.baseY);
    hill.points.forEach(([x, y]) => activityCtx.lineTo(x, y));
    activityCtx.lineTo(game.width + 20, hill.baseY + 18);
    activityCtx.lineTo(game.width + 20, game.height);
    activityCtx.closePath();
    activityCtx.fill();
  });
  const ground = activityCtx.createLinearGradient(0, 170, 0, game.height);
  ground.addColorStop(0, palette.groundTop ?? "#bfd097");
  ground.addColorStop(1, palette.groundBottom ?? "#8fa472");
  activityCtx.fillStyle = ground;
  activityCtx.fillRect(0, 168, game.width, game.height - 168);

  const meadowGlow = activityCtx.createRadialGradient(game.width * 0.34, 236, 18, game.width * 0.34, 236, 210);
  meadowGlow.addColorStop(0, palette.groundGlow ?? "rgba(255, 248, 219, 0.1)");
  meadowGlow.addColorStop(1, "rgba(255,255,255,0)");
  activityCtx.fillStyle = meadowGlow;
  activityCtx.fillRect(0, 168, game.width, game.height - 168);

  for (let patch = 0; patch < 8; patch += 1) {
    const x = 42 + patch * 72;
    const y = 196 + (patch % 3) * 22;
    activityCtx.fillStyle = patch % 2 === 0 ? "rgba(165, 181, 114, 0.12)" : "rgba(129, 151, 92, 0.08)";
    activityCtx.beginPath();
    activityCtx.ellipse(x, y, 42, 12, -0.18 + patch * 0.03, 0, Math.PI * 2);
    activityCtx.fill();
  }

  activityCtx.strokeStyle = "rgba(240, 244, 218, 0.08)";
  activityCtx.lineWidth = 2;
  for (let line = 0; line < 7; line += 1) {
    const y = 184 + line * 28;
    activityCtx.beginPath();
    activityCtx.moveTo(0, y);
    activityCtx.lineTo(game.width, y + Math.sin(line * 0.7) * 6);
    activityCtx.stroke();
  }

  // 지면이 배경 포인트를 덮지 않도록 원경 식생과 장소 실루엣을 마지막에 얹는다.
  drawActivityTreeLine(166, palette.farTreeLine ?? "rgba(132, 156, 110, 0.18)", 92, palette.farTreeTrunk ?? "rgba(86, 68, 48, 0.12)");
  drawActivityBackdropAccent(game, palette);
}

function drawActivityPondSurface(x, y, w, h) {
  const water = activityCtx.createRadialGradient(x + w * 0.42, y + h * 0.32, 18, x + w * 0.5, y + h * 0.5, w * 0.58);
  water.addColorStop(0, "#8fc8d6");
  water.addColorStop(1, "#5e96ac");
  fillActivityRoundedRect(x, y, w, h, 42, water);
  strokeActivityRoundedRect(x, y, w, h, 42, "rgba(255,255,255,0.2)", 2);
  activityCtx.fillStyle = "rgba(255,255,255,0.16)";
  activityCtx.beginPath();
  activityCtx.ellipse(x + w * 0.62, y + h * 0.22, 52, 14, 0.2, 0, Math.PI * 2);
  activityCtx.fill();
  activityCtx.beginPath();
  activityCtx.ellipse(x + w * 0.28, y + h * 0.62, 32, 10, -0.2, 0, Math.PI * 2);
  activityCtx.fill();
  for (let ring = 0; ring < 2; ring += 1) {
    activityCtx.strokeStyle = `rgba(255,255,255,${0.15 + ring * 0.05})`;
    activityCtx.lineWidth = 1.5;
    activityCtx.beginPath();
    activityCtx.ellipse(x + w * (0.35 + ring * 0.2), y + h * (0.54 - ring * 0.12), 26 + ring * 12, 10 + ring * 4, 0, 0, Math.PI * 2);
    activityCtx.stroke();
  }
}

function renderActivityScene() {
  const game = state.activeMiniGame;
  if (!game) {
    return;
  }
  const focusTarget = getNearestActivityTarget(game);

  activityCtx.clearRect(0, 0, game.width, game.height);
  const scenePalettes = {
    gardenCare: { skyTop: "#d5e6c7", skyMid: "#e5eed3", skyBottom: "#f2ead5", groundTop: "#cadc9f", groundBottom: "#9ab079", haze: "rgba(255, 245, 220, 0.16)", feature: "cottage", treeLine: "rgba(106, 132, 88, 0.22)", groundGlow: "rgba(255, 245, 214, 0.1)" },
    lawnTrim: { skyTop: "#d2e5c7", skyMid: "#e3eed5", skyBottom: "#efe5cf", groundTop: "#bfd58e", groundBottom: "#89a66b", haze: "rgba(245, 248, 219, 0.14)", feature: "cottage", treeLine: "rgba(95, 129, 80, 0.22)", groundGlow: "rgba(236, 246, 209, 0.08)" },
    vegetablePlant: { skyTop: "#d9e5c8", skyMid: "#e8efd8", skyBottom: "#f2e6d0", groundTop: "#d4c889", groundBottom: "#9e8a57", haze: "rgba(255, 238, 205, 0.16)", feature: "fields", treeLine: "rgba(118, 132, 84, 0.22)", groundGlow: "rgba(255, 237, 199, 0.08)" },
    vegetableGrow: { skyTop: "#d9e4c9", skyMid: "#e6efd8", skyBottom: "#f1e5d3", groundTop: "#c4c889", groundBottom: "#89945b", haze: "rgba(244, 248, 220, 0.14)", feature: "fields", treeLine: "rgba(106, 128, 82, 0.22)", groundGlow: "rgba(239, 248, 214, 0.08)" },
    farmWork: { skyTop: "#d9e0c6", skyMid: "#e5e7ca", skyBottom: "#eadcc1", groundTop: "#cab57a", groundBottom: "#8e7447", haze: "rgba(255, 232, 190, 0.16)", feature: "fields", treeLine: "rgba(113, 121, 80, 0.2)", groundGlow: "rgba(255, 228, 183, 0.08)" },
    raiseLivestock: { skyTop: "#d8dfc7", skyMid: "#e6e7d3", skyBottom: "#efdec7", groundTop: "#d1bf8b", groundBottom: "#9f8558", haze: "rgba(255, 237, 210, 0.14)", feature: "barn", treeLine: "rgba(116, 122, 87, 0.2)", groundGlow: "rgba(255, 235, 198, 0.08)" },
    catchFish: { skyTop: "#cfe0cf", skyMid: "#dfebdc", skyBottom: "#ece5cf", groundTop: "#bfd1a4", groundBottom: "#8ea379", haze: "rgba(230, 243, 236, 0.14)", feature: "pond", treeLine: "rgba(91, 125, 97, 0.22)", groundGlow: "rgba(219, 240, 230, 0.08)" }
  };
  drawActivityBackdrop(game, scenePalettes[game.kind] ?? scenePalettes.gardenCare);

  activityCtx.lineWidth = 2;

  if (game.kind === "gardenCare") {
    drawActivityStonePath(34, 44, 120, 274);
    fillActivityRoundedRect(58, 70, 78, 132, 18, "#f8f0dc");
    strokeActivityRoundedRect(58, 70, 78, 132, 18, "rgba(122, 89, 60, 0.14)", 2);
    activityCtx.fillStyle = "#b56c46";
    activityCtx.beginPath();
    activityCtx.moveTo(52, 86);
    activityCtx.lineTo(97, 58);
    activityCtx.lineTo(142, 86);
    activityCtx.closePath();
    activityCtx.fill();
    activityCtx.fillStyle = "#b8d1db";
    activityCtx.fillRect(74, 106, 18, 20);
    activityCtx.fillRect(104, 106, 18, 20);
    activityCtx.fillStyle = "#8b6342";
    activityCtx.fillRect(88, 156, 18, 46);
    fillActivityOrganicRegion(
      [[190, 74], [228, 44], [558, 48], [602, 86], [598, 270], [562, 316], [222, 320], [180, 282], [178, 108]],
      { top: "#e1ecbd", mid: "#d3e3a9", bottom: "#b9cf8d", shoulder: "rgba(76, 111, 66, 0.16)" }
    );
    drawActivityGrassTexture(200, 60, 380, 236, 72, "rgba(108, 144, 80, 0.16)");
    drawActivityFenceSegment(214, 304, 566, 304);
    drawActivityFlowerCluster(224, 296, ["#f1b56b", "#d66f63", "#f7d6e0"]);
    drawActivityFlowerCluster(546, 296, ["#f1b56b", "#d66f63", "#f4f0d0"]);
    game.shrubs.forEach((shrub, index) => {
      const shakeX = Math.sin(performance.now() / 45 + index) * shrub.shake * 6;
      const radius = shrub.r - shrub.trimProgress * 7;
      drawActivityEllipseShadow(shrub.x, shrub.y + 20, radius * 0.95, 8, 0.1);
      const shrubRadius = shrub.trimmed ? 18 : radius;
      const shrubGradient = activityCtx.createLinearGradient(shrub.x, shrub.y - shrubRadius, shrub.x, shrub.y + shrubRadius);
      shrubGradient.addColorStop(0, shrub.trimmed ? "#9bc57b" : "#78a860");
      shrubGradient.addColorStop(1, shrub.trimmed ? "#6d9d59" : "#4d7943");
      activityCtx.fillStyle = shrubGradient;
      activityCtx.beginPath();
      activityCtx.arc(shrub.x + shakeX, shrub.y + 3, shrubRadius, 0, Math.PI * 2);
      if (!shrub.trimmed) {
        activityCtx.arc(shrub.x - shrubRadius * 0.58 + shakeX * 0.8, shrub.y + 7, shrubRadius * 0.64, 0, Math.PI * 2);
        activityCtx.arc(shrub.x + shrubRadius * 0.58 + shakeX * 0.7, shrub.y + 8, shrubRadius * 0.62, 0, Math.PI * 2);
        activityCtx.arc(shrub.x + shakeX * 0.7, shrub.y - shrubRadius * 0.44, shrubRadius * 0.68, 0, Math.PI * 2);
      }
      activityCtx.fill();
      activityCtx.fillStyle = "rgba(255, 247, 205, 0.18)";
      activityCtx.beginPath();
      activityCtx.ellipse(shrub.x - shrubRadius * 0.28 + shakeX, shrub.y - shrubRadius * 0.28, shrubRadius * 0.38, shrubRadius * 0.18, -0.3, 0, Math.PI * 2);
      activityCtx.fill();
      if (!shrub.trimmed && shrub.trimProgress > 0) {
        activityCtx.strokeStyle = "rgba(255, 248, 235, 0.55)";
        activityCtx.lineWidth = 2;
        activityCtx.beginPath();
        activityCtx.arc(shrub.x + shakeX, shrub.y, radius + 5, -Math.PI / 2, (-Math.PI / 2) + shrub.trimProgress * Math.PI * 2);
        activityCtx.stroke();
      }
    });
    fillRoundedRectOn(activityCtx, game.tool.x - 18, game.tool.y - 13, 36, 26, 6, "#a6784c");
    activityCtx.fillStyle = "rgba(111, 76, 49, 0.34)";
    activityCtx.fillRect(game.tool.x - 14, game.tool.y - 7, 28, 10);
    if (game.player.carrying !== "shears") {
      activityCtx.strokeStyle = "#d9dfe3";
      activityCtx.lineWidth = 1.8;
      activityCtx.beginPath();
      activityCtx.moveTo(game.tool.x - 8, game.tool.y - 7);
      activityCtx.lineTo(game.tool.x + 6, game.tool.y - 1);
      activityCtx.moveTo(game.tool.x - 8, game.tool.y + 3);
      activityCtx.lineTo(game.tool.x + 6, game.tool.y + 1);
      activityCtx.stroke();
      activityCtx.strokeStyle = "#c15f3f";
      activityCtx.lineWidth = 1.6;
      activityCtx.beginPath();
      activityCtx.arc(game.tool.x - 11, game.tool.y - 6, 3, 0, Math.PI * 2);
      activityCtx.arc(game.tool.x - 11, game.tool.y + 4, 3, 0, Math.PI * 2);
      activityCtx.stroke();
      activityCtx.fillStyle = "rgba(255,255,255,0.28)";
      activityCtx.fillRect(game.tool.x - 4, game.tool.y - 2, 8, 1.5);
    }
    if (game.player.carrying === "shears") {
      drawActivityLabel("빈 작업대", game.tool.x, game.tool.y - 24);
    }
  } else if (game.kind === "lawnTrim") {
    drawActivityStonePath(40, 50, 120, 260);
    fillActivityOrganicRegion(
      [[190, 76], [232, 44], [558, 48], [604, 88], [596, 272], [562, 316], [224, 320], [180, 282], [178, 110]],
      { top: "#9ac36d", mid: "#86b65d", bottom: "#6d9b51", shoulder: "rgba(65, 103, 56, 0.18)", glow: "rgba(247, 244, 194, 0.12)" }
    );
    drawActivityGrassTexture(202, 64, 378, 230, 86, "rgba(88, 129, 67, 0.16)");
    drawActivityFenceSegment(206, 302, 574, 302);
    game.lanes.forEach((lane) => {
      const cellWidth = lane.w / lane.cells.length;
      fillActivityRoundedRect(lane.x1, lane.y, lane.w, lane.h, lane.h / 2, "#6f9f4d");
      lane.cells.forEach((cell, index) => {
        const cellX = lane.x1 + index * cellWidth;
        if (cell > 0) {
          activityCtx.fillStyle = "#a8c97d";
          activityCtx.fillRect(cellX - 0.3, lane.y + 4, cellWidth + 0.6, lane.h - 8);
          activityCtx.strokeStyle = "rgba(238, 244, 208, 0.22)";
          activityCtx.lineWidth = 1.4;
          activityCtx.beginPath();
          activityCtx.moveTo(cellX + 2, lane.y + lane.h / 2);
          activityCtx.lineTo(cellX + cellWidth - 2, lane.y + lane.h / 2 + (index % 2 ? 2 : -2));
          activityCtx.stroke();
        } else {
          activityCtx.strokeStyle = index % 2 === 0 ? "#47783f" : "#5a8b48";
          activityCtx.lineWidth = 2;
          activityCtx.beginPath();
          activityCtx.moveTo(cellX + cellWidth * 0.32, lane.y + lane.h - 5);
          activityCtx.lineTo(cellX + cellWidth * 0.2, lane.y + 7 + (index % 3) * 3);
          activityCtx.moveTo(cellX + cellWidth * 0.68, lane.y + lane.h - 5);
          activityCtx.lineTo(cellX + cellWidth * 0.78, lane.y + 10 + ((index + 1) % 3) * 3);
          activityCtx.stroke();
        }
      });
      if (lane.reaction > 0) {
        activityCtx.fillStyle = `rgba(255, 248, 235, ${lane.reaction * 0.18})`;
        activityCtx.fillRect(lane.x1, lane.y, lane.w, lane.h);
      }
    });
    drawActivityEllipseShadow(game.mower.x, game.mower.y + 14, 28, 8, 0.14);
    activityCtx.save();
    activityCtx.translate(game.mower.x, game.mower.y);
    activityCtx.rotate(game.mower.tilt * 0.02);
    activityCtx.fillStyle = "#b95f3a";
    activityCtx.fillRect(-22, -12, game.mower.w, game.mower.h);
    activityCtx.fillStyle = "#f8efe1";
    activityCtx.fillRect(-18, -18, 30, 5);
    activityCtx.fillStyle = "#6d5443";
    activityCtx.beginPath();
    activityCtx.arc(-12, 12, 6, 0, Math.PI * 2);
    activityCtx.arc(12, 12, 6, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.restore();
  } else if (game.kind === "vegetablePlant" || game.kind === "vegetableGrow") {
    drawActivityStonePath(36, 46, 120, 274);
    drawActivityEllipseShadow(390, 304, 160, 18, 0.14);
    fillActivityRoundedRect(230, 70, 320, 220, 20, "#6f4c31");
    strokeActivityRoundedRect(230, 70, 320, 220, 20, "rgba(57, 35, 22, 0.24)", 2);
    activityCtx.fillStyle = "#94714a";
    activityCtx.fillRect(224, 64, 332, 10);
    activityCtx.fillRect(224, 286, 332, 10);
    activityCtx.fillRect(224, 70, 10, 220);
    activityCtx.fillRect(546, 70, 10, 220);
    for (let row = 0; row < 4; row += 1) {
      activityCtx.fillStyle = row % 2 === 0 ? "#7b5535" : "#6a452d";
      activityCtx.fillRect(250, 92 + row * 48, 280, 28);
      activityCtx.strokeStyle = "rgba(217, 187, 123, 0.14)";
      activityCtx.lineWidth = 2;
      activityCtx.beginPath();
      activityCtx.moveTo(258, 106 + row * 48);
      activityCtx.lineTo(522, 106 + row * 48);
      activityCtx.stroke();
    }
    drawActivityFenceSegment(246, 304, 534, 304);
    if (game.kind === "vegetablePlant") {
      if (!game.tray.taken) {
        drawActivityEllipseShadow(game.tray.x, game.tray.y + 16, 20, 6, 0.12);
        drawCanvasSeedlingCrate(activityCtx, game.tray.x, game.tray.y, { scale: 1, sprouts: game.tray.seedlings });
      }
      game.plots.forEach((plot, index) => {
        const lift = Math.sin(plot.pop * Math.PI) * 5;
        drawActivityEllipseShadow(plot.x, plot.y + 18, plot.planted ? 10 : 14, 5, 0.09);
        activityCtx.fillStyle = plot.planted ? "#7ab15b" : "#49311f";
        activityCtx.beginPath();
        activityCtx.arc(plot.x, plot.y + lift, plot.planted ? 11 : 15, 0, Math.PI * 2);
        activityCtx.fill();
        if (plot.planted) {
          drawCanvasVegetablePlant(activityCtx, plot.x, plot.y + 4, {
            scale: 0.78,
            watered: false,
            mature: false,
            variant: index,
            bounce: lift
          });
        }
      });
    } else {
      drawActivityEllipseShadow(game.well.x, game.well.y + 24, 28, 8, 0.12);
      activityCtx.fillStyle = "#8d6e49";
      activityCtx.beginPath();
      activityCtx.arc(game.well.x, game.well.y, 30, 0, Math.PI * 2);
      activityCtx.fill();
      activityCtx.fillStyle = "#75a8ba";
      activityCtx.beginPath();
      activityCtx.arc(game.well.x, game.well.y, 18, 0, Math.PI * 2);
      activityCtx.fill();
      activityCtx.strokeStyle = "rgba(244, 229, 202, 0.2)";
      activityCtx.lineWidth = 2;
      activityCtx.beginPath();
      activityCtx.arc(game.well.x, game.well.y, 24, 0, Math.PI * 2);
      activityCtx.stroke();
      activityCtx.strokeStyle = "#7a5a3d";
      activityCtx.lineWidth = 3;
      activityCtx.beginPath();
      activityCtx.moveTo(game.well.x - 20, game.well.y - 30);
      activityCtx.lineTo(game.well.x - 20, game.well.y - 48);
      activityCtx.moveTo(game.well.x + 20, game.well.y - 30);
      activityCtx.lineTo(game.well.x + 20, game.well.y - 48);
      activityCtx.moveTo(game.well.x - 20, game.well.y - 48);
      activityCtx.lineTo(game.well.x + 20, game.well.y - 48);
      activityCtx.stroke();
      if (!game.bucket.taken) {
        drawActivityEllipseShadow(game.bucket.x, game.bucket.y + 16, 16, 5, 0.1);
        drawCanvasBucket(activityCtx, game.bucket.x, game.bucket.y - 1, {
          scale: 1,
          water: game.bucket.water / Math.max(game.bucket.capacity, 1)
        });
      }
      game.plants.forEach((plant, index) => {
        const bounce = Math.sin(plant.bounce * Math.PI) * 6;
        const droop = plant.droop * 0.85;
        const growthReveal = game.completion?.active
          ? 1 - game.completion.timer / Math.max(game.completion.duration, 0.01)
          : 0;
        const growthScale = 1 + clamp(growthReveal, 0, 1) * 0.34;
        drawActivityEllipseShadow(plant.x, plant.y + 16, 10, 4, 0.08);
        drawCanvasVegetablePlant(activityCtx, plant.x, plant.y + 4, {
          scale: growthScale,
          watered: plant.watered,
          mature: plant.watered,
          droop,
          variant: index,
          bounce
        });
      });
    }
  } else if (game.kind === "farmWork") {
    drawActivityStonePath(36, 46, 120, 274);
    drawActivityEllipseShadow(386, 306, 174, 20, 0.16);
    fillActivityRoundedRect(216, 72, 340, 224, 22, "#765130");
    strokeActivityRoundedRect(216, 72, 340, 224, 22, "rgba(58, 36, 20, 0.24)", 2);
    drawActivitySoilTexture(216, 72, 340, 224, 7);
    drawActivityFenceSegment(230, 302, 542, 302);
    game.rows.forEach((row) => {
      const width = row.x2 - row.x1;
      const cellWidth = width / row.cells.length;
      activityCtx.strokeStyle = "#5d3d27";
      activityCtx.lineWidth = 18;
      activityCtx.lineCap = "round";
      activityCtx.beginPath();
      activityCtx.moveTo(row.x1, row.y);
      activityCtx.lineTo(row.x2, row.y);
      activityCtx.stroke();
      row.cells.forEach((cell, index) => {
        if (cell > 0) {
          activityCtx.strokeStyle = "#9b7447";
          activityCtx.lineWidth = 11 + row.ripple * 2;
          activityCtx.beginPath();
          activityCtx.moveTo(row.x1 + index * cellWidth - 0.5, row.y - 1);
          activityCtx.lineTo(row.x1 + (index + 1) * cellWidth + 0.5, row.y + 1);
          activityCtx.stroke();
        }
      });
      activityCtx.strokeStyle = "rgba(238, 209, 153, 0.18)";
      activityCtx.lineWidth = 2;
      activityCtx.beginPath();
      activityCtx.moveTo(row.x1 + 4, row.y - 5);
      activityCtx.lineTo(row.x2 - 4, row.y - 5);
      activityCtx.stroke();
    });
    if (game.player.carrying !== "hoe") {
      drawActivityEllipseShadow(game.tool.x + 4, game.tool.y + 16, 14, 4, 0.1);
      activityCtx.fillStyle = "#8d6e49";
      activityCtx.fillRect(game.tool.x - 4, game.tool.y - 18, 8, 28);
      activityCtx.fillStyle = "#d8bb7a";
      activityCtx.beginPath();
      activityCtx.moveTo(game.tool.x + 6, game.tool.y - 20);
      activityCtx.lineTo(game.tool.x + 22, game.tool.y - 18);
      activityCtx.lineTo(game.tool.x + 16, game.tool.y - 6);
      activityCtx.lineTo(game.tool.x + 6, game.tool.y - 8);
      activityCtx.closePath();
      activityCtx.fill();
      activityCtx.strokeStyle = "#9f824a";
      activityCtx.lineWidth = 1.2;
      activityCtx.stroke();
    }
  } else if (game.kind === "raiseLivestock") {
    drawActivityStonePath(36, 46, 120, 274);
    drawActivityEllipseShadow(388, 306, 152, 18, 0.15);
    fillActivityRoundedRect(228, 72, 310, 228, 22, "#d48a5c");
    strokeActivityRoundedRect(228, 72, 310, 228, 22, "rgba(103, 58, 39, 0.2)", 2);
    for (let plank = 0; plank < 7; plank += 1) {
      activityCtx.strokeStyle = "rgba(255, 233, 207, 0.14)";
      activityCtx.lineWidth = 2;
      activityCtx.beginPath();
      activityCtx.moveTo(246, 92 + plank * 28);
      activityCtx.lineTo(520, 104 + plank * 28);
      activityCtx.stroke();
    }
    activityCtx.fillStyle = "rgba(214, 188, 126, 0.2)";
    activityCtx.fillRect(236, 232, 292, 58);
    for (let hay = 0; hay < 40; hay += 1) {
      const hx = 246 + ((hay * 17) % 268);
      const hy = 236 + ((hay * 11) % 44);
      activityCtx.strokeStyle = "rgba(232, 215, 166, 0.22)";
      activityCtx.lineWidth = 1.2;
      activityCtx.beginPath();
      activityCtx.moveTo(hx, hy);
      activityCtx.lineTo(hx + 8, hy + 3);
      activityCtx.stroke();
    }
    activityCtx.fillStyle = "#f2e7c9";
    activityCtx.fillRect(262, 108, 40, 86);
    activityCtx.fillRect(462, 198, 40, 86);
    drawActivityFenceSegment(244, 302, 524, 302);
    if (!game.feedBag.taken) {
      drawActivityEllipseShadow(game.feedBag.x, game.feedBag.y + 16, 16, 5, 0.1);
      drawCanvasFeedBag(activityCtx, game.feedBag.x, game.feedBag.y, { scale: 1, open: 0.72 });
    }
    game.troughs.forEach((trough) => {
      drawActivityEllipseShadow(trough.x, trough.y + 18, 18, 6, 0.1);
      fillActivityRoundedRect(trough.x - 20, trough.y - 12, 40, 24, 6, "#98714d");
      fillActivityRoundedRect(trough.x - 16, trough.y - 8, 32, 14, 4, "#5f4833");
      if (trough.fillLevel > 0.02) {
        activityCtx.fillStyle = "#d8b967";
        const grainCount = Math.max(2, Math.round(9 * trough.fillLevel));
        for (let grain = 0; grain < grainCount; grain += 1) {
          const gx = trough.x - 12 + ((grain * 11) % 25);
          const gy = trough.y + 1 - Math.floor(grain / 3) * 3;
          activityCtx.beginPath();
          activityCtx.ellipse(gx, gy, 4, 2.2, (grain % 3) * 0.3, 0, Math.PI * 2);
          activityCtx.fill();
        }
      }
      activityCtx.strokeStyle = "rgba(111, 76, 49, 0.28)";
      activityCtx.lineWidth = 1.4;
      activityCtx.strokeRect(trough.x - 20, trough.y - 12, 40, 24);
      if (trough.reaction > 0) {
        activityCtx.strokeStyle = `rgba(255, 248, 235, ${trough.reaction * 0.35})`;
        activityCtx.lineWidth = 2 + trough.reaction * 2;
        activityCtx.strokeRect(trough.x - 22, trough.y - 16, 44, 32);
      }
    });
    game.animals.forEach(drawActivityAnimal);
  } else if (game.kind === "catchFish") {
    drawActivityStonePath(36, 46, 120, 274);
    fillActivityOrganicRegion(
      [[218, 82], [250, 54], [514, 58], [560, 94], [558, 270], [526, 312], [248, 318], [208, 282], [206, 118]],
      { top: "#bfd1a3", mid: "#abc18f", bottom: "#8faa78", shoulder: "rgba(76, 111, 72, 0.18)", glow: "rgba(226, 243, 218, 0.12)" }
    );
    drawActivityGrassTexture(228, 74, 308, 214, 48, "rgba(112, 144, 86, 0.18)");
    drawActivityPondSurface(game.pond.x, game.pond.y, game.pond.w, game.pond.h);
    for (let reed = 0; reed < 5; reed += 1) {
      activityCtx.strokeStyle = "#6b8f55";
      activityCtx.lineWidth = 2;
      activityCtx.beginPath();
      activityCtx.moveTo(game.pond.x + 18 + reed * 16, game.pond.y + game.pond.h - 16 + (reed % 2) * 4);
      activityCtx.quadraticCurveTo(game.pond.x + 18 + reed * 16 - 4, game.pond.y + game.pond.h - 34, game.pond.x + 16 + reed * 16 - 8, game.pond.y + game.pond.h - 52);
      activityCtx.stroke();
      activityCtx.beginPath();
      activityCtx.moveTo(game.pond.x + game.pond.w - 24 - reed * 14, game.pond.y + game.pond.h - 20 + (reed % 2) * 3);
      activityCtx.quadraticCurveTo(game.pond.x + game.pond.w - 24 - reed * 14 + 4, game.pond.y + game.pond.h - 38, game.pond.x + game.pond.w - 18 - reed * 14 + 8, game.pond.y + game.pond.h - 54);
      activityCtx.stroke();
    }
    drawActivityEllipseShadow(game.basket.x, game.basket.y + 14, 18, 5, 0.12);
    drawCanvasBasket(activityCtx, game.basket.x, game.basket.y, { scale: 1, stored: game.basket.stored });
    if (!game.net.taken) {
      drawActivityEllipseShadow(game.net.x + 6, game.net.y + 12, 16, 5, 0.1);
      activityCtx.fillStyle = "#8d6e49";
      activityCtx.fillRect(game.net.x - 12, game.net.y - 22, 8, 32);
      activityCtx.beginPath();
      activityCtx.arc(game.net.x + 6, game.net.y - 18, 14, 0, Math.PI * 2);
      activityCtx.strokeStyle = "#8d6e49";
      activityCtx.stroke();
      activityCtx.strokeStyle = "rgba(244, 232, 210, 0.4)";
      activityCtx.lineWidth = 1;
      activityCtx.beginPath();
      activityCtx.moveTo(game.net.x, game.net.y - 24);
      activityCtx.lineTo(game.net.x + 12, game.net.y - 12);
      activityCtx.moveTo(game.net.x, game.net.y - 12);
      activityCtx.lineTo(game.net.x + 12, game.net.y - 24);
      activityCtx.stroke();
      activityCtx.fillStyle = "rgba(255,255,255,0.18)";
      activityCtx.beginPath();
      activityCtx.arc(game.net.x + 6, game.net.y - 18, 5, 0, Math.PI * 2);
      activityCtx.fill();
    }
    drawActivityLabel(`바구니 ${game.basket.stored}/2`, game.basket.x, game.basket.y - 26);
    game.fish.forEach((fish, index) => {
      if (fish.caught) {
        return;
      }
      drawCanvasFish(activityCtx, fish.x, fish.y, {
        scale: 1 + fish.panic * 0.06,
        lively: fish.panic,
        palette: index % 2 === 0 ? ["#fff5e9", "#f7d9a2", "#7ba9b8"] : ["#f8e5bb", "#f1b972", "#7aa7bc"]
      });
      if (fish.panic > 0.08) {
        activityCtx.strokeStyle = `rgba(255,255,255,${fish.panic * 0.35})`;
        activityCtx.lineWidth = 1.5;
        activityCtx.beginPath();
        activityCtx.arc(fish.x, fish.y, 16 + fish.panic * 8, 0, Math.PI * 2);
        activityCtx.stroke();
      }
    });
  }

  drawActivityTargetHighlight(focusTarget);
  drawAutoNavigationGuide(activityCtx, "activity");
  drawActivityParticles(game);
  drawActivityPlayer(game);
  drawActivityExpression(game, focusTarget);
  if (state.device?.id === "desktop") {
    const uiScale = getActivityCanvasUiScale();
    const footerMessage = game.feedback || "이동: 방향키 · 행동: E 또는 스페이스 바";
    const footerFontSize = 13 * uiScale;
    activityCtx.font = `700 ${footerFontSize}px "Gowun Dodum", sans-serif`;
    const footerLines = wrapCanvasTextLines(activityCtx, footerMessage, game.width - 88, 2);
    const footerLineHeight = footerFontSize * 1.22;
    const footerHeight = Math.max(28 * uiScale, footerLineHeight * footerLines.length + 14 * uiScale);
    const footerTop = game.height - footerHeight - 12;
    fillActivityRoundedRect(24, footerTop, game.width - 48, footerHeight, footerHeight / 2, "rgba(255, 250, 241, 0.9)");
    activityCtx.fillStyle = "#4a6140";
    activityCtx.textAlign = "left";
    const footerTextTop = footerTop + footerHeight / 2 - ((footerLines.length - 1) * footerLineHeight) / 2;
    footerLines.forEach((line, index) => {
      activityCtx.fillText(line, 42, footerTextTop + index * footerLineHeight + footerFontSize * 0.34);
    });
  }
  drawActivityCompletion(game);
}

function startGame() {
  clearSavedGame();
  state.started = true;
  ui.startCard.classList.add("hidden");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  closeOptionalPanels();
  state.saveMessage = "첫걸음 저장 준비 완료";
  playSfx("uiStart");
  showToast(
    "첫 부탁",
    state.device?.isTouch
      ? state.controlMode === "tap"
        ? "화면의 이모를 누르면 가까이 걸어가서 자동으로 대화합니다."
        : "왼쪽 조이스틱으로 이모에게 가서 오른쪽 행동 버튼을 누르세요."
      : "방향키로 이모에게 가서 E 키를 누르세요."
  );
  renderSidebar();
  syncMobileViewportMode();
  persistGame("시작");
  if (!state.device?.isTouch) {
    canvas.focus({ preventScroll: true });
  }
}

function handleActionPress() {
  if (state.controlTutorial.open || state.portraitGate.open) {
    return;
  }
  if (!state.started) {
    if (loadSavedGame()?.started) {
      showToast("저장된 산책이 있습니다", "이어서 걷기 또는 새로 시작을 선택하세요.");
      focusOverlay(ui.startCard);
      return;
    }
    setPrompt("");
    startGame();
    return;
  }
  if (state.activeDialogue) {
    nextDialogue();
    return;
  }
  if (state.activeQuiz) {
    submitQuizAnswer();
    return;
  }
  if (state.activeMiniGame) {
    handleActivityAction();
    return;
  }
  state.interactQueued = true;
}

function releaseActionPress() {
  return;
}

function showCurrentRequest() {
  const currentStep = getCurrentStoryStep();
  if (!currentStep) {
    showToast("오늘의 부탁", "마을을 천천히 걸으며 다음 장면을 찾아보세요.");
    return;
  }
  showToast(currentStep.title, currentStep.body);
}

function deliverDinner() {
  const missing = getDinnerMissingItems();
  if (missing.length > 0) {
    showToast("상차림이 아직 비었습니다", `${missing.join(", ")}을 더 챙겨 와야 합니다.`);
    return;
  }
  if (state.flags.has("dinnerServed")) {
    showToast("저녁상 준비 완료", "식탁 위 재료들이 노을빛 아래 가지런히 놓여 있습니다.");
    return;
  }
  state.flags.add("dinnerServed");
  addBasketItem("저녁 한 상");
  awardWarmth(18);
  advanceDayCycleForAction(18, "저녁상을 차리는 사이");
  playSfx("taskComplete", {
    playbackRate: 0.92
  });
  showToast("저녁상을 차리다", "오늘 모은 것들이 집 앞 식탁 위에서 한 끼 풍경이 되었습니다.");
  advanceStoryProgress();
  renderSidebar();
  persistGame("상차림");
}

function interactWithZone(zone) {
  if (!zone) {
    return;
  }
  if (zone.type === "dialogue") {
    openDialogue(zone);
    return;
  }
  if (zone.type === "mood") {
    zone.onInteract?.(state);
    if (zone.id === "bench" && !state.flags.has("benchWarmth")) {
      state.flags.add("benchWarmth");
      awardWarmth(4);
    }
    if (zone.id === "lookout" && !state.flags.has("lookoutWarmth")) {
      state.flags.add("lookoutWarmth");
      awardWarmth(8);
    }
    if (zone.id === "lookout") {
      advanceDayCycleForAction(10, "언덕에서 마을을 바라보는 동안");
    }
    advanceStoryProgress();
    syncDayStage();
    renderSidebar();
    persistGame("풍경");
    return;
  }
  if (zone.type === "story") {
    showCurrentRequest();
    return;
  }
  if (zone.type === "delivery") {
    deliverDinner();
    return;
  }
  if (zone.type === "task") {
    if (zone.requires && !zone.requires(state)) {
      showToast("아직 이르다", "모종을 심고 잠깐 쉬었다 오면 더 좋은 타이밍이 옵니다.");
      return;
    }
    startMiniGame(zone);
  }
}

function handleWorldEvents() {
  if (state.player.y < 260 || state.player.x > 1520) {
    if (!state.unlockedMood.has("cleanAir")) {
      state.flags.add("cleanAirSeen");
      maybeUnlockMood("cleanAir");
      awardWarmth(4);
      startWorldExpressionMoment(
        "cleanAir",
        "공기가 맑다",
        "들판 끝까지 시야가 트이고, 바람이 지나갈 때마다 숨이 한층 가볍게 느껴집니다."
      );
      showToast("공기가 맑다", "들판 끝으로 갈수록 숨이 한층 가벼워집니다.");
      persistGame("발견");
    }
  }
}

function updateWorldPractice(dt) {
  const practice = state.worldPractice;
  const dayProfile = getDayProfile();
  practice.actionPose = Math.max(0, practice.actionPose - dt * 2.6);
  if (practice.feedbackTimer > 0) {
    practice.feedbackTimer -= dt;
    if (practice.feedbackTimer <= 0) {
      practice.feedback = "";
    }
  }

  practice.garden.shrubs.forEach((shrub) => {
    shrub.shake = Math.max(0, shrub.shake - dt * 2.8);
    if (shrub.trim >= 1 && shrub.resetTimer > 0) {
      shrub.resetTimer -= dt;
      if (shrub.resetTimer <= 0) {
        shrub.trim = 0;
      }
    }
  });
  practice.garden.topiaries.forEach((topiary) => {
    topiary.shake = Math.max(0, topiary.shake - dt * 2.4);
    if (topiary.trim >= 1 && topiary.resetTimer > 0) {
      topiary.resetTimer -= dt;
      if (topiary.resetTimer <= 0) {
        topiary.trim = 0;
      }
    }
  });

  const movementInput = hasMovementInput();

  if (practice.carriedTool === "mower") {
    const pose = getWorldPracticeToolPose();
    practice.lawn.source.x = pose.x + pose.dirX * 16;
    practice.lawn.source.y = pose.y + 18;
    practice.lawn.source.tilt = (state.player.facing === "left" ? -1 : state.player.facing === "right" ? 1 : 0) * 10;

    practice.lawn.lanes.forEach((lane) => {
      const cellTarget = getWorldPracticeRowCellTarget(lane, { x: practice.lawn.source.x, y: practice.lawn.source.y }, 18);
      if (!cellTarget || !movementInput) {
        lane.reaction = Math.max(0, lane.reaction - dt * 2.6);
        return;
      }
      if (lane.cells[cellTarget.index] < 1) {
        lane.cells[cellTarget.index] = clamp(lane.cells[cellTarget.index] + dt * (3.1 + dayProfile.lawnEase), 0, 1);
        lane.reaction = 1;
        playSfx("mowerPass", {
          playbackRate: 0.92 + dayProfile.lawnEase * 0.04,
          cooldownKey: "world-mower-pass"
        });
        if (Math.random() < dt * 18) {
          emitAmbientParticle(cellTarget.x + randomRange(-8, 8), lane.y + 10, {
            color: "rgba(168, 205, 112, 0.58)",
            vx: randomRange(-12, 12),
            vy: randomRange(-20, -6),
            size: randomRange(2, 3.4),
            life: randomRange(0.25, 0.45)
          });
        }
      } else {
        lane.reaction = Math.max(lane.reaction, 0.45);
      }
      lane.reaction = Math.max(0, lane.reaction - dt * 1.6);
    });
    practice.lawn.verges.forEach((patch) => {
      const nearPatch =
        Math.abs(practice.lawn.source.x - patch.x) < patch.w * 0.5 + 22 &&
        Math.abs(practice.lawn.source.y - patch.y) < patch.h * 0.5 + 18;
      if (nearPatch && movementInput) {
        patch.cut = clamp(patch.cut + dt * (2.2 + dayProfile.lawnEase), 0, 1);
        patch.reaction = 1;
        playSfx("mowerPass", {
          playbackRate: 0.96 + dayProfile.lawnEase * 0.03,
          cooldownKey: "world-mower-pass"
        });
        if (Math.random() < dt * 16) {
          emitAmbientParticle(patch.x + randomRange(-patch.w * 0.35, patch.w * 0.35), patch.y + 8, {
            color: "rgba(168, 205, 112, 0.6)",
            vx: randomRange(-12, 12),
            vy: randomRange(-18, -6),
            size: randomRange(2, 3.2),
            life: randomRange(0.25, 0.45)
          });
        }
        if (patch.cut >= 1 && patch.resetTimer <= 0) {
          patch.resetTimer = 10;
        }
      }
      patch.reaction = Math.max(0, patch.reaction - dt * 1.8);
    });
    if (practice.lawn.verges.every((patch) => patch.cut >= 1)) {
      markWorldPracticeMoment("worldPracticeVerges", "잔디를 깎다", "마당 밖 길가로 번진 풀도 잔디깎는 기계로 정리할 수 있게 되었습니다.");
    }
    if (practice.lawn.lanes.every((lane) => lane.cells.every((cell) => cell >= 1))) {
      if (practice.lawn.resetTimer <= 0) {
        practice.lawn.resetTimer = 8;
        markWorldPracticeMoment("worldPracticeLawn", "잔디를 깎다", "마당에서도 기계를 밀며 잔디가 실제로 밀려 나가도록 만들었습니다.");
        setWorldPracticeFeedback("잔디 결이 한 줄씩 반듯하게 정리됩니다.");
      }
    }
  } else {
    practice.lawn.source.x += (practice.lawn.source.xHome - practice.lawn.source.x) * 0.16;
    practice.lawn.source.y += (practice.lawn.source.yHome - practice.lawn.source.y) * 0.16;
    practice.lawn.source.tilt *= 0.84;
    practice.lawn.lanes.forEach((lane) => {
      lane.reaction = Math.max(0, lane.reaction - dt * 2.8);
    });
    practice.lawn.verges.forEach((patch) => {
      patch.reaction = Math.max(0, patch.reaction - dt * 2.2);
    });
  }

  if (practice.lawn.resetTimer > 0) {
    practice.lawn.resetTimer -= dt;
    if (practice.lawn.resetTimer <= 0) {
      practice.lawn.lanes.forEach((lane) => {
        lane.cells.fill(0);
        lane.reaction = 0;
      });
    }
  }
  practice.lawn.verges.forEach((patch) => {
    if (patch.resetTimer > 0) {
      patch.resetTimer -= dt;
      if (patch.resetTimer <= 0) {
        patch.cut = 0;
        patch.reaction = 0;
      }
    }
  });

  practice.vegetable.plots.forEach((plot) => {
    plot.pop = Math.max(0, plot.pop - dt * 1.8);
    plot.bounce = Math.max(0, plot.bounce - dt * 1.4);
  });
  practice.vegetable.planters.forEach((planter) => {
    planter.pop = Math.max(0, planter.pop - dt * 1.7);
    planter.bloom = Math.max(0, planter.bloom - dt * 0.5);
    if (planter.resetTimer > 0) {
      planter.resetTimer -= dt;
      if (planter.resetTimer <= 0) {
        planter.planted = false;
        planter.watered = false;
        planter.pop = 0;
        planter.bloom = 0;
      }
    }
  });
  if (practice.vegetable.resetTimer > 0) {
    practice.vegetable.resetTimer -= dt;
    if (practice.vegetable.resetTimer <= 0) {
      practice.vegetable.tray.seedlings = practice.vegetable.tray.maxSeedlings;
      practice.vegetable.bucket.water = 0;
      if (practice.carriedTool === "seedlings" || practice.carriedTool === "bucket") {
        clearWorldPracticeTool();
      }
      practice.vegetable.plots.forEach((plot) => {
        plot.planted = false;
        plot.watered = false;
        plot.pop = 0;
        plot.bounce = 0;
      });
    }
  }

  practice.field.rows.forEach((row) => {
    row.reaction = Math.max(0, row.reaction - dt * 2.2);
  });
  practice.field.sidePatches.forEach((patch) => {
    patch.reaction = Math.max(0, patch.reaction - dt * 2.2);
    if (patch.resetTimer > 0) {
      patch.resetTimer -= dt;
      if (patch.resetTimer <= 0) {
        patch.tilled = 0;
        patch.reaction = 0;
      }
    }
  });
  if (practice.field.resetTimer > 0) {
    practice.field.resetTimer -= dt;
    if (practice.field.resetTimer <= 0) {
      practice.field.rows.forEach((row) => {
        row.cells.fill(0);
        row.reaction = 0;
      });
    }
  }

  practice.barn.troughs.forEach((trough) => {
    trough.reaction = Math.max(0, trough.reaction - dt * 2.2);
    trough.fill = Math.max(0, trough.fill - dt * lerp(0.024, 0.046, clamp(dayProfile.feedGather / 1.2, 0, 1)));
  });
  practice.barn.feedSpots.forEach((spot) => {
    spot.reaction = Math.max(0, spot.reaction - dt * 2.2);
    spot.fill = Math.max(0, spot.fill - dt * lerp(0.018, 0.036, clamp(dayProfile.feedGather / 1.2, 0, 1)));
    if (spot.visitor === "cat" && spot.fill > 0.2) {
      state.ambient.cat.stretch = Math.max(state.ambient.cat.stretch, 0.36 + dayProfile.feedGather * 0.28);
    }
    if (spot.visitor === "birds" && spot.fill > 0.18) {
      state.ambient.fieldBirds.forEach((bird) => {
        bird.scare = Math.max(0, bird.scare - dt * 3.5);
      });
    }
  });
  if (practice.barn.troughs.every((trough) => trough.fill <= 0.02)) {
    practice.barn.source.servings = Math.max(practice.barn.source.servings, 2);
  }

  const fishToolPose = practice.carriedTool === "rod" ? getWorldFishingLurePose() : getWorldPracticeToolPose();
  practice.pond.fish.forEach((fish) => {
    if (fish.caught) {
      fish.respawn -= dt;
      if (fish.respawn <= 0) {
        fish.caught = false;
        fish.x = fish.baseX;
        fish.y = fish.baseY;
        fish.vx = 0;
        fish.vy = 0;
        fish.panic = 0;
      }
      return;
    }

    const driftX = fish.baseX + Math.cos(performance.now() / 900 + fish.seed) * 14;
    const driftY = fish.baseY + Math.sin(performance.now() / 780 + fish.seed) * 10;
    const shoreX = 1484 + Math.cos(performance.now() / 840 + fish.seed * 0.7) * 26;
    const targetDriftX = lerp(driftX, shoreX, dayProfile.fishShore);
    const lureDistance = Math.hypot(fishToolPose.x - fish.x, fishToolPose.y - fish.y);
    if (practice.carriedTool === "rod" && !practice.carryingCatch && lureDistance < lerp(96, 138, dayProfile.fishShore)) {
      fish.panic = Math.max(0, fish.panic - dt * 1.8);
      fish.vx += (fishToolPose.x - fish.x) * dt * (0.46 + dayProfile.fishShore * 0.38);
      fish.vy += (fishToolPose.y - fish.y) * dt * (0.36 + dayProfile.fishShore * 0.34);
      if (Math.random() < dt * 6) {
        emitAmbientParticle(fish.x, fish.y + 4, {
          color: "rgba(220, 244, 255, 0.55)",
          vx: randomRange(-10, 10),
          vy: randomRange(-18, -6),
          size: randomRange(1.6, 3),
          life: randomRange(0.25, 0.45),
          kind: "splash"
        });
      }
    } else {
      fish.panic = Math.max(0, fish.panic - dt * (1.1 + dayProfile.fishCalm * 0.3));
      fish.vx += (targetDriftX - fish.x) * dt * 1.2;
      fish.vy += (driftY - fish.y) * dt * 1.2;
    }
    fish.vx *= fish.panic > 0.08 ? 0.92 : 0.82;
    fish.vy *= fish.panic > 0.08 ? 0.92 : 0.82;
    fish.x = clamp(fish.x + fish.vx * dt, 1456, 1688);
    fish.y = clamp(fish.y + fish.vy * dt, 942, 1086);
  });
  practice.pond.skimmers.forEach((skimmer) => {
    skimmer.reaction = Math.max(0, skimmer.reaction - dt * 2.1);
    if (skimmer.cleared && skimmer.respawn > 0) {
      skimmer.respawn -= dt;
      if (skimmer.respawn <= 0) {
        skimmer.cleared = false;
        skimmer.reaction = 0;
      }
    }
  });
  if (practice.pond.cast.hookSoundTimer > 0) {
    practice.pond.cast.hookSoundTimer = Math.max(0, practice.pond.cast.hookSoundTimer - dt);
    if (practice.pond.cast.hookSoundTimer <= 0 && practice.pond.cast.hooked) {
      playSfx("fishHook", {
        playbackRate: randomRange(0.98, 1.12),
        cooldownKey: "world-fish-hook"
      });
    }
  }
  if (practice.pond.cast.timer > 0) {
    practice.pond.cast.timer = Math.max(0, practice.pond.cast.timer - dt);
    if (practice.pond.cast.timer <= 0) {
      practice.pond.cast.hooked = false;
    }
  }

  if (practice.pond.basket.resetTimer > 0) {
    practice.pond.basket.resetTimer -= dt;
    if (practice.pond.basket.resetTimer <= 0) {
      practice.pond.basket.stored = 0;
    }
  }
}

function updateMiniGame(dt) {
  if (!state.activeMiniGame) {
    return;
  }
  const game = state.activeMiniGame;
  updateActivityState(dt);
  if (isActivityComplete(game) && !game.completion.active) {
    beginActivityCompletion(game);
  }
  if (game.completion.active) {
    game.completion.timer = Math.max(0, game.completion.timer - dt);
  }
  updateMiniGameUi();
  if (game.completion.active && game.completion.timer <= 0) {
    completeTask(game.zone);
  }
}

function getFollowerTargetPosition(index) {
  const slot = followerFormation[index] ?? {
    back: 84 + Math.max(0, index - followerFormation.length + 1) * 14,
    side: index % 2 === 0 ? -16 : 16
  };
  const facing = getFacingVector(state.player.facing);
  const backX = -facing.x;
  const backY = -facing.y;
  const sideX = -backY;
  const sideY = backX;
  return {
    x: state.player.x + backX * slot.back + sideX * slot.side,
    y: state.player.y + 18 + backY * slot.back * 0.34 + sideY * slot.side * 0.86
  };
}

function updateFollowerCompanions(dt) {
  if (!state.followers.length) {
    return;
  }
  const isMoving = hasMovementInput(0.08);
  state.followers.forEach((entry, index) => {
    const target = getFollowerTargetPosition(index);
    const easing = 1 - Math.exp(-dt * (5.8 - Math.min(index, 4) * 0.35));
    entry.x += (target.x - entry.x) * easing;
    entry.y += (target.y - entry.y) * easing;
    entry.step += dt * (3.2 + (isMoving ? 4.1 : 1.1) + index * 0.12);
    entry.blink += dt * (0.9 + index * 0.04);
    entry.bob += dt * (2.1 + index * 0.08);
    entry.hop = Math.max(entry.hop - dt * 1.8, 0);
    if (isMoving && Math.sin(entry.step) > 0.98) {
      entry.hop = Math.max(entry.hop, 0.16 + index * 0.01);
    }
  });
}

function updateCamera() {
  const desiredX = clamp(state.player.x - canvas.width / 2, 0, world.width - canvas.width);
  const desiredY = clamp(state.player.y - canvas.height / 2, 0, world.height - canvas.height);
  state.camera.targetX = desiredX;
  state.camera.targetY = desiredY;
  state.camera.x += (desiredX - state.camera.x) * 0.12;
  state.camera.y += (desiredY - state.camera.y) * 0.12;
}

function update(dt) {
  if (state.toastTimer > 0) {
    state.toastTimer -= dt;
    if (state.toastTimer <= 0) {
      ui.toast.classList.add("hidden");
    }
  }

  if (
    state.started &&
    !state.controlTutorial.open &&
    !state.portraitGate.open &&
    !state.activeDialogue &&
    !state.activeQuiz &&
    !state.endingShown
  ) {
    advanceDayCycle(dt, { announce: !state.activeMiniGame });
  }

  const optionalPanelOpen =
    state.controlTutorial.open ||
    state.portraitGate.open ||
    state.uiPanels.heroExpanded ||
    state.uiPanels.storyOpen ||
    state.uiPanels.statsOpen ||
    state.uiPanels.journalOpen;
  const worldIsInteractive =
    !state.activeMiniGame &&
    !state.activeDialogue &&
    !state.activeQuiz &&
    !state.endingShown &&
    !optionalPanelOpen;
  if (worldIsInteractive) {
    updateAmbientLife(dt);
  }
  updateWorldExpressionMoment(dt);
  renderTimeHud();
  if (state.started && worldIsInteractive) {
    updateWorldPractice(dt);
  }
  if (state.started && worldIsInteractive) {
    updateFollowerCompanions(dt);
  }

  if (
    !state.started ||
    state.controlTutorial.open ||
    state.portraitGate.open ||
    state.activeDialogue ||
    state.activeQuiz ||
    state.endingShown
  ) {
    setPrompt("");
    state.hoveredPractice = null;
    updateTouchActionLabel();
    updateCamera();
    return;
  }

  if (!state.activeMiniGame) {
    movePlayer(dt);
    handleWorldEvents();
    state.hoveredZone = getNearestZone();
    state.hoveredPractice = getNearestWorldPracticeTarget();
    setPrompt(
      (state.autoNavigation.active && state.autoNavigation.scope === "world"
        ? `${state.autoNavigation.targetLabel}까지 이동 중 · 다른 곳을 누르면 경로가 바뀝니다`
        : "") ||
        state.worldPractice.feedback ||
        state.hoveredPractice?.prompt ||
        getWorldPracticeCarryPrompt() ||
        state.hoveredZone?.prompt ||
        ""
    );
    updateTouchActionLabel();

    if (state.interactQueued) {
      if (!handleWorldPracticeAction()) {
        interactWithZone(state.hoveredZone);
      }
      state.interactQueued = false;
    }
  } else {
    updateMiniGame(dt);
  }

  updateCamera();
}

function worldToScreen(x, y) {
  return { x: x - state.camera.x, y: y - state.camera.y };
}

function drawAutoNavigationGuide(targetContext, scope) {
  const navigation = state.autoNavigation;
  if (!navigation.active || navigation.scope !== scope || state.controlMode !== "tap") return;
  const remaining = navigation.waypoints.slice(navigation.waypointIndex);
  if (!remaining.length) return;
  const player = scope === "world" ? state.player : state.activeMiniGame?.player;
  if (!player) return;
  const convert = (point) => scope === "world" ? worldToScreen(point.x, point.y) : point;
  const start = convert(player);
  const pulse = 0.5 + Math.sin(performance.now() / 180) * 0.5;
  targetContext.save();
  targetContext.strokeStyle = "rgba(255, 250, 226, 0.9)";
  targetContext.lineWidth = scope === "world" ? 4 : 3;
  targetContext.setLineDash([8, 8]);
  targetContext.beginPath();
  targetContext.moveTo(start.x, start.y);
  remaining.forEach((point) => {
    const screen = convert(point);
    targetContext.lineTo(screen.x, screen.y);
  });
  targetContext.stroke();
  targetContext.setLineDash([]);
  const end = convert(remaining[remaining.length - 1]);
  targetContext.fillStyle = `rgba(217, 127, 86, ${0.72 + pulse * 0.2})`;
  targetContext.strokeStyle = "rgba(255, 252, 235, 0.95)";
  targetContext.lineWidth = 3;
  targetContext.beginPath();
  targetContext.arc(end.x, end.y, 12 + pulse * 4, 0, Math.PI * 2);
  targetContext.fill();
  targetContext.stroke();
  targetContext.restore();
}

function emitAmbientParticle(x, y, options = {}) {
  if (!shouldEmitEffect(options.spawnChance ?? 1)) {
    return;
  }
  const particle = {
    x,
    y,
    vx: options.vx ?? randomRange(-16, 16),
    vy: options.vy ?? randomRange(-28, -10),
    size: options.size ?? randomRange(2, 4),
    life: options.life ?? 0.8,
    maxLife: options.life ?? 0.8,
    color: options.color ?? "rgba(255, 244, 214, 0.72)",
    kind: options.kind ?? "dot"
  };
  state.ambient.particles.push(particle);
  const particleLimit = getAmbientParticleLimit();
  if (state.ambient.particles.length > particleLimit) {
    state.ambient.particles.shift();
  }
}

function isRoadSurface(x, y) {
  const verticalRoad = x > 180 && x < 272 && y > 80 && y < 1320;
  const mainRoad = y > 720 && y < 812 && x > 180 && x < 1080;
  const eastRoad = y > 720 && y < 796 && x > 1040 && x < 1540;
  return verticalRoad || mainRoad || eastRoad;
}

function updateAmbientParticles(dt) {
  state.ambient.particles = state.ambient.particles.filter((particle) => {
    particle.life -= dt;
    if (particle.life <= 0) {
      return false;
    }
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.98;
    particle.vy = particle.kind === "splash" ? particle.vy * 0.97 + 10 * dt : particle.vy * 0.97 + 20 * dt;
    return true;
  });
}

function updateInteractiveNature(dt, movementInput) {
  const player = state.player;

  state.ambient.nature.bushes.forEach((bush) => {
    bush.cooldown = Math.max(0, bush.cooldown - dt);
    bush.shake = Math.max(0, bush.shake - dt * 2.2);
    bush.brush = Math.max(0, bush.brush - dt * 2.8);
    bush.glow = Math.max(0, bush.glow - dt * 1.4);
    bush.dropTimer = Math.max(0, bush.dropTimer - dt);
    bush.visitorTimer = Math.max(0, bush.visitorTimer - dt);
    bush.sway += dt * (1 + bush.brush * 2.4 + bush.shake * 1.8);
    const distance = Math.hypot(player.x - bush.x, player.y - bush.y);
    if (state.started && movementInput && distance < 34) {
      bush.brush = Math.min(1, bush.brush + dt * 4.2);
      if (Math.random() < dt * 4) {
        emitAmbientParticle(bush.x + randomRange(-10, 10), bush.y - 6 + randomRange(-6, 4), {
          color: "rgba(157, 205, 115, 0.36)",
          vx: randomRange(-8, 8),
          vy: randomRange(-18, -6),
          size: randomRange(1.6, 2.8),
          life: randomRange(0.25, 0.45)
        });
      }
    }
  });

  state.ambient.nature.flowers.forEach((flower) => {
    flower.cooldown = Math.max(0, flower.cooldown - dt);
    flower.shake = Math.max(0, flower.shake - dt * 2.4);
    flower.brush = Math.max(0, flower.brush - dt * 2.8);
    flower.glow = Math.max(0, flower.glow - dt * 1.5);
    flower.dropTimer = Math.max(0, flower.dropTimer - dt);
    flower.visitorTimer = Math.max(0, flower.visitorTimer - dt);
    flower.sway += dt * (1.2 + flower.brush * 2.8 + flower.shake * 2);
    const distance = Math.hypot(player.x - flower.x, player.y - flower.y);
    if (state.started && movementInput && distance < 32) {
      flower.brush = Math.min(1, flower.brush + dt * 4.8);
      if (Math.random() < dt * 5) {
        emitAmbientParticle(flower.x + randomRange(-8, 8), flower.y - 10 + randomRange(-4, 4), {
          color: `${flower.palette[Math.floor(Math.random() * flower.palette.length)]}cc`,
          vx: randomRange(-7, 7),
          vy: randomRange(-16, -6),
          size: randomRange(1.4, 2.6),
          life: randomRange(0.25, 0.45)
        });
      }
    }
  });

  state.ambient.nature.trees.forEach((tree) => {
    tree.cooldown = Math.max(0, tree.cooldown - dt);
    tree.shake = Math.max(0, tree.shake - dt * 1.8);
    tree.brush = Math.max(0, tree.brush - dt * 2.2);
    tree.glow = Math.max(0, tree.glow - dt * 1.2);
    tree.dropTimer = Math.max(0, tree.dropTimer - dt);
    tree.visitorTimer = Math.max(0, tree.visitorTimer - dt);
    tree.sway += dt * (0.9 + tree.brush * 2 + tree.shake * 1.7);
    const distance = Math.hypot(player.x - tree.x, player.y - (tree.y + tree.trunkHeight + 10));
    if (state.started && movementInput && distance < 46) {
      tree.brush = Math.min(1, tree.brush + dt * 3.4);
      if (Math.random() < dt * 3) {
        emitAmbientParticle(tree.x + randomRange(-18, 18), tree.y - tree.trunkHeight + randomRange(-12, 8), {
          color: "rgba(164, 205, 122, 0.34)",
          vx: randomRange(-8, 8),
          vy: randomRange(-14, -4),
          size: randomRange(1.8, 3),
          life: randomRange(0.25, 0.5)
        });
      }
    }
  });
}

function updateAmbientLife(dt) {
  const now = performance.now() / 1000;
  const movementInput = hasMovementInput();
  const dayProfile = getDayProfile();

  updateAmbientParticles(dt);
  updateInteractiveNature(dt, movementInput);

  if (state.started && movementInput && !isRoadSurface(state.player.x, state.player.y) && !state.activeMiniGame) {
    if (Math.random() < dt * 10) {
      emitAmbientParticle(state.player.x + randomRange(-6, 6), state.player.y + 14, {
        color: "rgba(171, 205, 122, 0.38)",
        vx: randomRange(-12, 12),
        vy: randomRange(-26, -8),
        size: randomRange(2, 3.6),
        life: randomRange(0.35, 0.6)
      });
    }
  }

  const spinner = state.ambient.spinner;
  const spinnerDistance = Math.hypot(state.player.x - spinner.x, state.player.y - spinner.y);
  if (state.started && spinnerDistance < 94) {
    spinner.boost = Math.min(1.8, spinner.boost + dt * 3.2);
    if (Math.random() < dt * 7) {
      emitAmbientParticle(spinner.x, spinner.y - 14, {
        color: "rgba(247, 232, 197, 0.52)",
        vx: randomRange(-10, 10),
        vy: randomRange(-20, -8),
        size: randomRange(1.5, 2.8),
        life: randomRange(0.35, 0.7)
      });
    }
  } else {
    spinner.boost = Math.max(0, spinner.boost - dt * 1.1);
  }
  spinner.spin += dt * (1.6 + spinner.boost * 11);

  const laundry = state.ambient.laundry;
  const laundryDistance = Math.hypot(state.player.x - 560, state.player.y - 222);
  if (state.started && movementInput && laundryDistance < 150) {
    laundry.gust = Math.min(1.5, laundry.gust + dt * 3.4);
  } else {
    laundry.gust = Math.max(0, laundry.gust - dt * 0.65);
  }
  laundry.sway += dt * (1.5 + laundry.gust * 2.3);

  const windChime = state.ambient.windChime;
  const windChimeDistance = Math.hypot(state.player.x - windChime.x, state.player.y - (windChime.y + 28));
  if (state.started && windChimeDistance < 108 && movementInput) {
    windChime.ring = Math.min(1.6, windChime.ring + dt * 3.8);
    if (!state.flags.has("ambientWindChimeSeen")) {
      state.flags.add("ambientWindChimeSeen");
      showToast("풍경이 맑게 울린다", "마루 가까이를 지나가자 바람이 스치며 풍경이 가볍게 흔들립니다.");
    }
    if (Math.random() < dt * 6) {
      emitAmbientParticle(windChime.x + randomRange(-5, 5), windChime.y + 24, {
        color: "rgba(245, 236, 204, 0.54)",
        vx: randomRange(-8, 8),
        vy: randomRange(-18, -6),
        size: randomRange(1.4, 2.6),
        life: randomRange(0.3, 0.55)
      });
    }
  } else {
    windChime.ring = Math.max(0, windChime.ring - dt * 1.2);
  }
  windChime.phase += dt * (1.8 + windChime.ring * 5.4 + laundry.gust * 0.9);

  const mailbox = state.ambient.mailbox;
  const mailboxDistance = Math.hypot(state.player.x - mailbox.x, state.player.y - mailbox.y);
  if (state.started && mailboxDistance < 86) {
    mailbox.open = Math.min(1, mailbox.open + dt * 2.6);
    if (movementInput) {
      mailbox.bounce = Math.min(1, mailbox.bounce + dt * 3.2);
      if (!state.flags.has("ambientMailboxSeen")) {
        state.flags.add("ambientMailboxSeen");
        showToast("우편함이 달칵 열린다", "집 앞 우편함이 슬쩍 들썩이며 작은 생활감이 살아납니다.");
      }
    }
  } else {
    mailbox.open = Math.max(0, mailbox.open - dt * 1.7);
    mailbox.bounce = Math.max(0, mailbox.bounce - dt * 2.4);
  }

  const scarecrow = state.ambient.scarecrow;
  const scarecrowDistance = Math.hypot(state.player.x - scarecrow.x, state.player.y - scarecrow.y);
  if (state.started && scarecrowDistance < 132) {
    scarecrow.flutter = Math.min(1.4, scarecrow.flutter + dt * 2.8);
    if (!state.flags.has("ambientScarecrowSeen")) {
      state.flags.add("ambientScarecrowSeen");
      showToast("밭이 들썩인다", "허수아비 팔자락이 흔들리고 밭둑의 작은 새들이 퍼덕이며 날아오릅니다.");
    }
  } else {
    scarecrow.flutter = Math.max(0, scarecrow.flutter - dt * 1.1);
  }
  scarecrow.sway += dt * (1.1 + scarecrow.flutter * 1.6 + laundry.gust * 0.5);

  const cat = state.ambient.cat;
  cat.cooldown = Math.max(0, cat.cooldown - dt);
  cat.stretch = Math.max(0, cat.stretch - dt * (dayProfile.catWake < 0.45 ? 1 : 1.8));
  cat.nap += dt * (cat.cooldown > 0 ? 1.8 : 1.2) * (dayProfile.catWake < 0.45 ? 1.4 : 1);
  const catDistance = Math.hypot(state.player.x - cat.x, state.player.y - cat.y);
  if (state.started && catDistance < 84 && cat.cooldown <= 0 && dayProfile.catWake > 0.35) {
    cat.spotIndex = (cat.spotIndex + 1) % cat.spots.length;
    cat.cooldown = randomRange(3.4, 5.4);
    cat.stretch = 1;
    if (!state.flags.has("ambientCatSeen")) {
      state.flags.add("ambientCatSeen");
      showToast("고양이가 몸을 푼다", "집 앞 고양이가 기지개를 켜고 햇볕 좋은 자리로 사뿐히 옮겨 갑니다.");
    }
  }
  const catTarget = cat.spots[cat.spotIndex];
  cat.vx += (catTarget.x - cat.x) * dt * 2.6;
  cat.vy += (catTarget.y - cat.y) * dt * 2.6;
  cat.vx *= 0.82;
  cat.vy *= 0.82;
  cat.x += cat.vx * dt;
  cat.y += cat.vy * dt;
  if (Math.abs(cat.vx) > 1) {
    cat.heading = cat.vx >= 0 ? 1 : -1;
  }

  state.ambient.butterflies.forEach((butterfly, index) => {
    const hoverX = butterfly.homeX + Math.cos(now * 1.7 + butterfly.seed) * 14;
    const hoverY = butterfly.homeY + Math.sin(now * 2 + butterfly.seed) * 8;
    const distance = Math.hypot(state.player.x - butterfly.x, state.player.y - butterfly.y);
    if (state.started && dayProfile.butterflyWake > 0.18 && distance < 96) {
      butterfly.scare = Math.min(1.2, butterfly.scare + dt * 2.7);
      const awayAngle =
        Math.atan2(butterfly.y - state.player.y, butterfly.x - state.player.x) +
        Math.sin(now * 8 + butterfly.seed) * 0.34;
      butterfly.vx += Math.cos(awayAngle) * 220 * dt;
      butterfly.vy += (Math.sin(awayAngle) * 160 - 28) * dt;
      if (!state.flags.has("ambientButterfliesSeen")) {
        state.flags.add("ambientButterfliesSeen");
        showToast("꽃밭이 살아 있다", "가까이 다가가니 나비들이 한꺼번에 흩어졌다가 다시 내려앉습니다.");
      }
        if (Math.random() < dt * 9 * dayProfile.butterflyWake) {
          emitAmbientParticle(butterfly.x, butterfly.y, {
          color: index % 2 === 0 ? "rgba(255, 232, 182, 0.76)" : "rgba(255, 210, 222, 0.74)",
          vx: randomRange(-12, 12),
          vy: randomRange(-24, -6),
          size: randomRange(1.8, 3),
          life: randomRange(0.3, 0.55)
        });
      }
    } else {
      butterfly.scare = Math.max(0, butterfly.scare - dt * 1.2);
      butterfly.vx += (hoverX - butterfly.x) * dt * (1.8 + dayProfile.butterflyWake * 2.2);
      butterfly.vy += (hoverY - butterfly.y) * dt * (1.8 + dayProfile.butterflyWake * 2.2);
    }

    butterfly.vx *= butterfly.scare > 0.08 ? 0.92 : 0.9 - dayProfile.butterflyWake * 0.08;
    butterfly.vy *= butterfly.scare > 0.08 ? 0.92 : 0.9 - dayProfile.butterflyWake * 0.08;
    butterfly.x = clamp(butterfly.x + butterfly.vx * dt, 40, world.width - 40);
    butterfly.y = clamp(butterfly.y + butterfly.vy * dt, 60, world.height - 60);
  });

  state.ambient.dragonflies.forEach((dragonfly, index) => {
    const hoverX = dragonfly.homeX + Math.cos(now * 2.3 + dragonfly.seed) * 22;
    const hoverY = dragonfly.homeY + Math.sin(now * 2.9 + dragonfly.seed) * 12;
    const distance = Math.hypot(state.player.x - dragonfly.x, state.player.y - dragonfly.y);
    if (state.started && dayProfile.dragonflyWake > 0.14 && distance < 94) {
      dragonfly.scare = Math.min(1.4, dragonfly.scare + dt * 3.2);
      const awayAngle =
        Math.atan2(dragonfly.y - state.player.y, dragonfly.x - state.player.x) +
        Math.sin(now * 10 + dragonfly.seed + index) * 0.45;
      dragonfly.vx += Math.cos(awayAngle) * 240 * dt;
      dragonfly.vy += (Math.sin(awayAngle) * 180 - 26) * dt;
      if (!state.flags.has("ambientDragonfliesSeen")) {
        state.flags.add("ambientDragonfliesSeen");
        showToast("잠자리가 번쩍인다", "연못가 잠자리들이 물빛 위를 스치듯 날아올랐다가 다시 맴돕니다.");
      }
        if (Math.random() < dt * 7 * dayProfile.dragonflyWake) {
          emitAmbientParticle(dragonfly.x, dragonfly.y, {
          color: index % 2 === 0 ? "rgba(173, 226, 242, 0.48)" : "rgba(255, 245, 204, 0.44)",
          vx: randomRange(-10, 10),
          vy: randomRange(-16, -4),
          size: randomRange(1.2, 2.4),
          life: randomRange(0.2, 0.45)
        });
      }
    } else {
      dragonfly.scare = Math.max(0, dragonfly.scare - dt * 1.4);
      dragonfly.vx += (hoverX - dragonfly.x) * dt * (2 + dayProfile.dragonflyWake * 3.2);
      dragonfly.vy += (hoverY - dragonfly.y) * dt * (2 + dayProfile.dragonflyWake * 3.2);
    }
    dragonfly.vx *= dragonfly.scare > 0.08 ? 0.9 : 0.86 - dayProfile.dragonflyWake * 0.08;
    dragonfly.vy *= dragonfly.scare > 0.08 ? 0.9 : 0.86 - dayProfile.dragonflyWake * 0.08;
    dragonfly.x = clamp(dragonfly.x + dragonfly.vx * dt, 1380, 1740);
    dragonfly.y = clamp(dragonfly.y + dragonfly.vy * dt, 860, 1090);
  });

  state.ambient.chickens.forEach((chicken, index) => {
    const wanderX = chicken.homeX + Math.sin(now * 0.9 + index * 1.7) * 20;
    const wanderY = chicken.homeY + Math.cos(now * 1.2 + index * 1.4) * 10;
    const distance = Math.hypot(state.player.x - chicken.x, state.player.y - chicken.y);
    const filledTroughs = state.worldPractice.barn.troughs.filter((trough) => trough.fill > 0.12);
    const targetTrough =
      filledTroughs.length > 0
        ? filledTroughs.reduce((best, trough) =>
            !best ||
            Math.hypot(chicken.x - trough.x, chicken.y - trough.y) < Math.hypot(chicken.x - best.x, chicken.y - best.y)
              ? trough
              : best
          , null)
        : null;
    const roostX = 1438 + index * 42;
    const roostY = 522 + (index % 2) * 18;
    chicken.bob += dt * (1.2 + dayProfile.chickenWake * 1.4 + chicken.panic * 3);
    if (state.started && distance < 118) {
      chicken.panic = Math.min(1.2, chicken.panic + dt * 3.4);
      const awayAngle =
        Math.atan2(chicken.y - state.player.y, chicken.x - state.player.x) +
        Math.sin(now * 9 + index) * 0.28;
      chicken.vx += Math.cos(awayAngle) * 250 * dt;
      chicken.vy += Math.sin(awayAngle) * 210 * dt;
      chicken.heading = chicken.vx >= 0 ? 1 : -1;
      if (!state.flags.has("ambientChickensSeen")) {
        state.flags.add("ambientChickensSeen");
        showToast("마당이 분주하다", "닭들이 놀라 퍼졌다가 금세 다시 마당 한쪽으로 모입니다.");
      }
      if (Math.random() < dt * 8) {
        emitAmbientParticle(chicken.x, chicken.y + 10, {
          color: "rgba(188, 157, 116, 0.48)",
          vx: randomRange(-16, 16),
          vy: randomRange(-18, -4),
          size: randomRange(2, 3.6),
          life: randomRange(0.25, 0.5)
        });
      }
    } else if (state.dayStage === 4) {
      chicken.panic = Math.max(0, chicken.panic - dt * 2.4);
      chicken.vx += (roostX - chicken.x) * dt * 4.2;
      chicken.vy += (roostY - chicken.y) * dt * 4;
      if (Math.abs(chicken.vx) > 1.2) {
        chicken.heading = chicken.vx >= 0 ? 1 : -1;
      }
    } else if (state.started && targetTrough && dayProfile.chickenWake > 0.3) {
      chicken.panic = Math.max(0, chicken.panic - dt * 1.8);
      chicken.vx += (targetTrough.x - chicken.x) * dt * 3.8;
      chicken.vy += (targetTrough.y + 18 - chicken.y) * dt * 3.6;
      if (Math.abs(chicken.vx) > 2) {
        chicken.heading = chicken.vx >= 0 ? 1 : -1;
      }
      if (Math.random() < dt * 5) {
        emitAmbientParticle(chicken.x, chicken.y + 10, {
          color: "rgba(245, 217, 130, 0.46)",
          vx: randomRange(-10, 10),
          vy: randomRange(-12, -4),
          size: randomRange(1.8, 3),
          life: randomRange(0.25, 0.45)
        });
      }
    } else {
      chicken.panic = Math.max(0, chicken.panic - dt * 1.1);
      chicken.vx += (wanderX - chicken.x) * dt * 3;
      chicken.vy += (wanderY - chicken.y) * dt * 3;
      if (Math.abs(chicken.vx) > 2) {
        chicken.heading = chicken.vx >= 0 ? 1 : -1;
      }
    }

    chicken.vx *= chicken.panic > 0.1 ? 0.86 : 0.76;
    chicken.vy *= chicken.panic > 0.1 ? 0.86 : 0.76;
    chicken.x = clamp(chicken.x + chicken.vx * dt, chicken.homeX - 120, chicken.homeX + 120);
    chicken.y = clamp(chicken.y + chicken.vy * dt, chicken.homeY - 66, chicken.homeY + 66);
  });

  state.ambient.fieldBirds.forEach((bird, index) => {
    const hoverX = bird.homeX + Math.sin(now * 1.4 + bird.seed) * 8;
    const hoverY = bird.homeY + Math.cos(now * 1.8 + bird.seed) * 4;
    const distance = Math.hypot(state.player.x - bird.x, state.player.y - bird.y);
    if (state.started && dayProfile.birdWake > 0.18 && distance < 110) {
      bird.scare = Math.min(1.3, bird.scare + dt * 3);
      const angle =
        Math.atan2(bird.y - state.player.y, bird.x - state.player.x) -
        0.5 +
        Math.sin(now * 9 + bird.seed + index) * 0.35;
      bird.vx += Math.cos(angle) * 200 * dt;
      bird.vy += (Math.sin(angle) * 120 - 80) * dt;
    } else {
      bird.scare = Math.max(0, bird.scare - dt * 1.6);
      bird.vx += (hoverX - bird.x) * dt * (1.6 + dayProfile.birdWake * 2.2);
      bird.vy += (hoverY - bird.y) * dt * (1.6 + dayProfile.birdWake * 2.2);
    }
    bird.vx *= bird.scare > 0.08 ? 0.9 : 0.88 - dayProfile.birdWake * 0.1;
    bird.vy *= bird.scare > 0.08 ? 0.9 : 0.88 - dayProfile.birdWake * 0.1;
    bird.x = clamp(bird.x + bird.vx * dt, 520, 860);
    bird.y = clamp(bird.y + bird.vy * dt, 780, 1030);
    if (Math.abs(bird.vx) > 1.2) {
      bird.heading = bird.vx >= 0 ? 1 : -1;
    }
  });

  state.ambient.frogs.forEach((frog) => {
    frog.cooldown = Math.max(0, frog.cooldown - dt);
    frog.ripple = Math.max(0, frog.ripple - dt * 0.9);
    if (frog.hidden > 0) {
      frog.hidden -= dt;
      if (frog.hidden <= 0) {
        frog.x = frog.baseX + randomRange(-4, 4);
        frog.y = frog.baseY + randomRange(-3, 3);
      }
      return;
    }

    const distance = Math.hypot(state.player.x - frog.x, state.player.y - frog.y);
    if (state.started && frog.hop === 0 && frog.cooldown <= 0 && distance < 84 + dayProfile.frogWake * 28) {
      frog.hop = 0.001;
      if (!state.flags.has("ambientFrogsSeen")) {
        state.flags.add("ambientFrogsSeen");
        showToast("연못이 철퍽하다", "물가를 스치자 개구리들이 첨벙 뛰어들며 잔물결을 남깁니다.");
      }
    }

    if (frog.hop > 0) {
      frog.hop = Math.min(1, frog.hop + dt * 2.8);
      frog.x = frog.baseX + (frog.waterX - frog.baseX) * frog.hop;
      frog.y = frog.baseY + (frog.waterY - frog.baseY) * frog.hop - Math.sin(frog.hop * Math.PI) * 22;
      if (frog.hop >= 1) {
        frog.hop = 0;
        frog.hidden = randomRange(1.8, 3.2) / Math.max(dayProfile.frogWake, 0.8);
        frog.cooldown = randomRange(3.1, 4.8) / Math.max(dayProfile.frogWake, 0.8);
        frog.ripple = 1;
        emitAmbientParticle(frog.waterX, frog.waterY, {
          color: "rgba(224, 244, 255, 0.82)",
          vx: randomRange(-18, 18),
          vy: randomRange(-28, -10),
          size: randomRange(2.4, 4.6),
          life: randomRange(0.4, 0.7),
          kind: "splash"
        });
      }
    } else {
      frog.x = frog.baseX + Math.sin(now * 1.8 + frog.baseX * 0.01) * 2.5;
      frog.y = frog.baseY + Math.cos(now * 1.4 + frog.baseY * 0.01) * 1.6;
    }
  });
}

function drawAmbientParticles() {
  state.ambient.particles.forEach((particle) => {
    const { x, y } = worldToScreen(particle.x, particle.y);
    const alpha = clamp(particle.life / particle.maxLife, 0, 1);
    if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) {
      return;
    }
    ctx.fillStyle = particle.color.replace(/[\d.]+\)$/u, `${(particle.color.includes("rgba") ? alpha : 1)})`);
    if (particle.color.includes("rgba")) {
      const prefix = particle.color.slice(0, particle.color.lastIndexOf(",") + 1);
      ctx.fillStyle = `${prefix} ${Number(alpha.toFixed(2))})`;
    }
    if (particle.kind === "splash") {
      ctx.save();
      ctx.globalAlpha = alpha * 0.92;
      ctx.fillStyle = particle.color.includes("rgba") ? ctx.fillStyle : particle.color;
      ctx.beginPath();
      ctx.ellipse(x, y, particle.size, particle.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.beginPath();
      ctx.arc(x - particle.size * 0.16, y - particle.size * 0.16, particle.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha * 0.9;
    if (particle.size > 2.4) {
      drawStarburstOn(ctx, x, y, {
        outerRadius: particle.size * 0.86,
        innerRadius: particle.size * 0.34,
        fillStyle: ctx.fillStyle,
        alpha: 0.78,
        rotation: particle.x * 0.01 + particle.y * 0.008
      });
    } else {
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawButterfly(butterfly, index) {
  const { x, y } = worldToScreen(butterfly.x, butterfly.y);
  if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) {
    return;
  }
  const flap = Math.sin(performance.now() / 90 + butterfly.seed * 6);
  const wingColor = index % 2 === 0 ? "#f8d98a" : "#f5bdd0";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(butterfly.vy, butterfly.vx || 0.001) * 0.12);
  ctx.fillStyle = wingColor;
  ctx.beginPath();
  ctx.ellipse(-3.5, 0, 4 + flap * 0.7, 2.8, -0.4, 0, Math.PI * 2);
  ctx.ellipse(3.5, 0, 4 - flap * 0.7, 2.8, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6d5645";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(0, 3);
  ctx.stroke();
  ctx.restore();
}

function drawChicken(chicken) {
  const { x, y } = worldToScreen(chicken.x, chicken.y);
  if (x < -30 || x > canvas.width + 30 || y < -30 || y > canvas.height + 30) {
    return;
  }
  const bob = Math.sin(chicken.bob) * 1.2;
  drawEllipseShadow(x, y + 9, 10, 4, 0.12);
  ctx.fillStyle = "#f1e9dc";
  ctx.beginPath();
  ctx.ellipse(x, y + bob, 10, 7.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7ea";
  ctx.beginPath();
  ctx.arc(x + chicken.heading * 7, y - 4 + bob, 4.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cf694b";
  ctx.beginPath();
  ctx.arc(x + chicken.heading * 8, y - 9 + bob, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e4af55";
  ctx.beginPath();
  ctx.moveTo(x + chicken.heading * 12, y - 4 + bob);
  ctx.lineTo(x + chicken.heading * 17, y - 2 + bob);
  ctx.lineTo(x + chicken.heading * 12, y + 1 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#b78347";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 3, y + 7 + bob);
  ctx.lineTo(x - 4, y + 13 + bob);
  ctx.moveTo(x + 2, y + 7 + bob);
  ctx.lineTo(x + 3, y + 13 + bob);
  ctx.stroke();
}

function drawFrog(frog) {
  if (frog.hidden > 0) {
    return;
  }
  const { x, y } = worldToScreen(frog.x, frog.y);
  if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) {
    return;
  }
  drawEllipseShadow(x, y + 7, 8, 3, 0.1);
  ctx.fillStyle = "#73a256";
  ctx.beginPath();
  ctx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8ec06d";
  ctx.beginPath();
  ctx.arc(x - 3, y - 3, 2.4, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 3, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#22311d";
  ctx.beginPath();
  ctx.arc(x - 3, y - 3, 0.8, 0, Math.PI * 2);
  ctx.arc(x + 3, y - 3, 0.8, 0, Math.PI * 2);
  ctx.fill();
  if (frog.ripple > 0) {
    drawWaterRipple(x, y + 9, 8 + frog.ripple * 8, 0.14 * frog.ripple);
  }
}

function drawDragonfly(dragonfly, index) {
  const { x, y } = worldToScreen(dragonfly.x, dragonfly.y);
  if (x < -24 || x > canvas.width + 24 || y < -24 || y > canvas.height + 24) {
    return;
  }
  const flap = Math.sin(performance.now() / 80 + dragonfly.seed * 8);
  const bodyColor = index % 2 === 0 ? "#79b7ca" : "#f0c96c";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(dragonfly.vy, dragonfly.vx || 0.001) * 0.2);
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.beginPath();
  ctx.ellipse(-3, -2, 7 + flap * 0.8, 2.2, -0.5, 0, Math.PI * 2);
  ctx.ellipse(3, -1, 7 - flap * 0.8, 2.2, 0.5, 0, Math.PI * 2);
  ctx.ellipse(-2, 2, 5 + flap * 0.4, 1.8, -0.4, 0, Math.PI * 2);
  ctx.ellipse(2, 3, 5 - flap * 0.4, 1.8, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(9, 0, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFieldBird(bird, index) {
  const { x, y } = worldToScreen(bird.x, bird.y);
  if (x < -20 || x > canvas.width + 20 || y < -20 || y > canvas.height + 20) {
    return;
  }
  const bob = Math.sin(performance.now() / 180 + bird.seed * 6) * (bird.scare > 0.1 ? 0.6 : 0.3);
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(bird.heading, 1);
  ctx.fillStyle = index % 2 === 0 ? "#5e5146" : "#7b6654";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 4.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, -2, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#dfb061";
  ctx.beginPath();
  ctx.moveTo(8, -2);
  ctx.lineTo(12, -1);
  ctx.lineTo(8, 1);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawWindChime(cameraX, cameraY) {
  const chime = state.ambient.windChime;
  const x = chime.x - cameraX;
  const y = chime.y - cameraY;
  if (x < -40 || x > canvas.width + 40 || y < -60 || y > canvas.height + 80) {
    return;
  }
  const sway = Math.sin(chime.phase) * (3 + chime.ring * 7);
  ctx.strokeStyle = "#7c5c42";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x, y - 2);
  ctx.stroke();
  ctx.strokeStyle = "#d6c6a4";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x, y, 12, Math.PI, Math.PI * 2);
  ctx.stroke();
  [-8, 0, 8].forEach((offset, index) => {
    ctx.beginPath();
    ctx.moveTo(x + offset, y + 2);
    ctx.lineTo(x + offset + sway * (0.12 + index * 0.05), y + 18 + index * 2);
    ctx.stroke();
  });
  ctx.fillStyle = "#f4d38a";
  ctx.beginPath();
  ctx.arc(x - 8 + sway * 0.1, y + 20, 2.2, 0, Math.PI * 2);
  ctx.arc(x + sway * 0.16, y + 24, 2.2, 0, Math.PI * 2);
  ctx.arc(x + 8 + sway * 0.22, y + 20, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e7c9ab";
  ctx.beginPath();
  ctx.moveTo(x, y + 16);
  ctx.lineTo(x + sway * 0.5 + 7, y + 34);
  ctx.lineTo(x + sway * 0.5 - 7, y + 34);
  ctx.closePath();
  ctx.fill();
}

function drawMailbox(cameraX, cameraY) {
  const mailbox = state.ambient.mailbox;
  const x = mailbox.x - cameraX;
  const y = mailbox.y - cameraY;
  if (x < -40 || x > canvas.width + 40 || y < -40 || y > canvas.height + 60) {
    return;
  }
  const bounce = Math.sin(performance.now() / 150) * mailbox.bounce * 2.6;
  const lidLift = mailbox.open * 12 + bounce;
  drawEllipseShadow(x, y + 18, 15, 4, 0.1);
  ctx.fillStyle = "#7a5737";
  ctx.fillRect(x - 3, y + 2, 6, 24);
  drawRoundedRect(x - 16, y - 16 + bounce * 0.2, 32, 18, 6, "#d9d5cf");
  ctx.fillStyle = "#c86a56";
  ctx.beginPath();
  ctx.moveTo(x - 16, y - 16 + bounce * 0.2);
  ctx.lineTo(x - 14, y - 18 - lidLift * 0.2);
  ctx.lineTo(x + 14, y - 18 - lidLift * 0.2);
  ctx.lineTo(x + 16, y - 16 + bounce * 0.2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e9e4dd";
  ctx.fillRect(x + 12, y - 12 - mailbox.open * 4, 7, 3);
}

function drawScarecrow(cameraX, cameraY) {
  const scarecrow = state.ambient.scarecrow;
  const x = scarecrow.x - cameraX;
  const y = scarecrow.y - cameraY;
  if (x < -60 || x > canvas.width + 60 || y < -80 || y > canvas.height + 100) {
    return;
  }
  const sway = Math.sin(scarecrow.sway) * (2 + scarecrow.flutter * 4);
  drawEllipseShadow(x, y + 30, 18, 5, 0.1);
  ctx.strokeStyle = "#7a5737";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y - 18);
  ctx.lineTo(x, y + 26);
  ctx.moveTo(x - 18, y - 2 + sway * 0.2);
  ctx.lineTo(x + 18, y + 2 - sway * 0.2);
  ctx.stroke();
  ctx.fillStyle = "#f2dfbd";
  ctx.beginPath();
  ctx.arc(x, y - 22, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7a8f55";
  ctx.fillRect(x - 12, y - 16, 24, 4);
  ctx.fillStyle = "#b9744b";
  ctx.beginPath();
  ctx.moveTo(x - 14 + sway * 0.4, y + 4);
  ctx.lineTo(x, y - 8);
  ctx.lineTo(x + 14 - sway * 0.4, y + 4);
  ctx.lineTo(x + 8, y + 22);
  ctx.lineTo(x - 8, y + 22);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#f0d48f";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 8);
  ctx.lineTo(x + 10, y + 12);
  ctx.stroke();
}

function drawCat() {
  const cat = state.ambient.cat;
  const { x, y } = worldToScreen(cat.x, cat.y);
  if (x < -30 || x > canvas.width + 30 || y < -30 || y > canvas.height + 30) {
    return;
  }
  const stretch = cat.stretch;
  const curl = stretch > 0 ? 0.4 + stretch * 0.5 : 1;
  const bob = Math.sin(cat.nap * 1.8) * (stretch > 0 ? 0.4 : 0.9);
  drawEllipseShadow(x, y + 10, 13, 4, 0.1);
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(cat.heading, 1);
  ctx.fillStyle = "#d0b58d";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12 + stretch * 4, 6.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(10 + stretch * 2, -4, 4.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9e7e5d";
  ctx.beginPath();
  ctx.arc(8, -8, 1.6, 0, Math.PI * 2);
  ctx.arc(13, -8, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9e7e5d";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.quadraticCurveTo(-18, -8 * curl, -10, -14 * curl);
  ctx.stroke();
  ctx.restore();
}

function drawClothesline(cameraX, cameraY) {
  const left = worldToScreen(492, 192);
  const right = worldToScreen(620, 188);
  const gust = state.ambient.laundry.gust;
  const sway = Math.sin(state.ambient.laundry.sway * 2.2) * 5 + gust * 7;

  ctx.strokeStyle = "#8f6546";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(left.x, left.y);
  ctx.lineTo(left.x, left.y + 72);
  ctx.moveTo(right.x, right.y);
  ctx.lineTo(right.x, right.y + 78);
  ctx.stroke();

  ctx.strokeStyle = "#d6c6a4";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left.x, left.y + 8);
  ctx.quadraticCurveTo((left.x + right.x) / 2, left.y + 12 + sway, right.x, right.y + 10);
  ctx.stroke();

  const cloths = [
    { x: 520, y: 202, w: 26, h: 24, color: "#f4e9da", phase: 0.3 },
    { x: 555, y: 204, w: 22, h: 26, color: "#d7e4c5", phase: 1.4 },
    { x: 590, y: 200, w: 28, h: 22, color: "#e7c9ab", phase: 2.1 }
  ];

  cloths.forEach((cloth) => {
    const anchor = worldToScreen(cloth.x, cloth.y);
    const clothSway = Math.sin(state.ambient.laundry.sway * 2.8 + cloth.phase) * 4 + gust * 6;
    ctx.fillStyle = cloth.color;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(anchor.x + cloth.w, anchor.y);
    ctx.lineTo(anchor.x + cloth.w + clothSway, anchor.y + cloth.h);
    ctx.lineTo(anchor.x + clothSway * 0.4, anchor.y + cloth.h + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(123, 91, 62, 0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });
}

function drawSpinner() {
  const { x, y } = worldToScreen(state.ambient.spinner.x, state.ambient.spinner.y);
  if (x < -40 || x > canvas.width + 40 || y < -40 || y > canvas.height + 40) {
    return;
  }
  drawEllipseShadow(x, y + 18, 10, 3, 0.1);
  ctx.strokeStyle = "#7e5d41";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 22);
  ctx.stroke();

  ctx.save();
  ctx.translate(x, y - 8);
  ctx.rotate(state.ambient.spinner.spin);
  ["#f1b56b", "#d66f63", "#7eb46b", "#7eb0d0"].forEach((color, index) => {
    ctx.save();
    ctx.rotate((Math.PI / 2) * index);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(16, -3);
    ctx.lineTo(9, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  ctx.fillStyle = "#f7efdc";
  ctx.beginPath();
  ctx.arc(0, 0, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNatureVisitor(x, y, type, timer, phase = 0) {
  if (!type || type === "none" || timer <= 0) {
    return;
  }

  const flap = Math.sin(performance.now() / 90 + phase * 7);
  if (type === "butterfly") {
    ctx.save();
    ctx.translate(x, y + Math.sin(performance.now() / 140 + phase) * 2);
    ctx.rotate(Math.sin(performance.now() / 260 + phase) * 0.16);
    ctx.fillStyle = "rgba(255, 230, 191, 0.82)";
    ctx.beginPath();
    ctx.ellipse(-4, 0, 4.5 + flap * 0.6, 2.6, -0.4, 0, Math.PI * 2);
    ctx.ellipse(4, 0, 4.5 - flap * 0.6, 2.6, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6d5645";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (type === "bird") {
    drawBirdGlyph(ctx, x - 8, y - 2, 0.9, "rgba(98, 90, 78, 0.44)");
    drawBirdGlyph(ctx, x + 9, y + 2, 0.76, "rgba(98, 90, 78, 0.36)");
    return;
  }

  if (type === "sparkle") {
    for (let index = 0; index < 3; index += 1) {
      const angle = phase * 4 + index * ((Math.PI * 2) / 3) + performance.now() / 580;
      const px = x + Math.cos(angle) * (8 + index * 2);
      const py = y + Math.sin(angle) * (5 + index) - index * 2;
      ctx.fillStyle = `rgba(255, 247, 208, ${0.36 + timer * 0.2})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.6 + index * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawNatureBush(bush, options = {}) {
  const { foregroundPass = false } = options;
  const { x, y } = worldToScreen(bush.x, bush.y);
  if (!isOnScreen(x, y, 80)) {
    return;
  }

  const profile = getDayProfile();
  const sway = Math.sin(bush.sway + bush.readyPhase) * (1.2 + bush.brush * 2.4 + bush.shake * 3.4);
  const glow =
    bush.glow +
    profile.flowerGlow * 0.18 +
    (bush.cooldown <= 0 ? 0.08 + Math.sin(performance.now() / 360 + bush.readyPhase) * 0.03 : 0);
  if (!foregroundPass && glow > 0.04) {
    drawScaledGlow(ctx, x, y - 2, 28 * bush.scale, 18 * bush.scale, `rgba(218, 239, 177, ${Math.min(glow * 0.16, 0.22)})`, "rgba(218, 239, 177, 0)", 0);
  }

  if (!foregroundPass) {
    drawEllipseShadow(x, y + 16, 16 * bush.scale, 5 * bush.scale, 0.1);
  }
  ctx.fillStyle = bush.baseColor;
  ctx.beginPath();
  ctx.arc(x + sway, y + 2, 15 * bush.scale, 0, Math.PI * 2);
  ctx.arc(x - 10 * bush.scale + sway * 0.8, y + 6, 11 * bush.scale, 0, Math.PI * 2);
  ctx.arc(x + 10 * bush.scale + sway * 0.7, y + 8, 10 * bush.scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bush.accentColor;
  ctx.beginPath();
  ctx.arc(x - 6 * bush.scale + sway * 0.6, y - 2, 7 * bush.scale, 0, Math.PI * 2);
  ctx.arc(x + 8 * bush.scale + sway * 0.5, y + 2, 6.5 * bush.scale, 0, Math.PI * 2);
  ctx.fill();
  for (let index = 0; index < 3; index += 1) {
    const angle = index * 2.1 + bush.readyPhase;
    ctx.fillStyle = index % 2 === 0 ? bush.blossomColor : bush.berryColor;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * 8 * bush.scale + sway * 0.4, y + Math.sin(angle) * 5 * bush.scale, 2.2 + (index % 2) * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  if (bush.dropTimer > 0) {
    const alpha = Math.min(bush.dropTimer / 2.2, 1);
    ctx.fillStyle = `rgba(224, 138, 94, ${0.38 * alpha})`;
    ctx.beginPath();
    ctx.arc(x - 8, y + 20, 3.6, 0, Math.PI * 2);
    ctx.arc(x + 7, y + 18, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNatureVisitor(x + sway * 0.5, y - 14, bush.visitorType, bush.visitorTimer, bush.readyPhase);
}

function drawNatureFlowerPatch(flower, options = {}) {
  const { foregroundPass = false } = options;
  const { x, y } = worldToScreen(flower.x, flower.y);
  if (!isOnScreen(x, y, 80)) {
    return;
  }

  const profile = getDayProfile();
  const sway = Math.sin(flower.sway + flower.readyPhase) * (1.4 + flower.brush * 2.2 + flower.shake * 3);
  const glow =
    flower.glow +
    profile.flowerGlow * 0.28 +
    (flower.cooldown <= 0 ? 0.07 + Math.sin(performance.now() / 340 + flower.readyPhase) * 0.03 : 0);
  if (!foregroundPass && glow > 0.05) {
    drawScaledGlow(ctx, x, y - 10, 24 * flower.scale, 14 * flower.scale, `rgba(255, 245, 214, ${Math.min(glow * 0.18, 0.24)})`, "rgba(255, 245, 214, 0)", 0);
  }

  if (!foregroundPass) {
    drawEllipseShadow(x, y + 12, 14 * flower.scale, 4 * flower.scale, 0.08);
  }
  for (let index = 0; index < 5; index += 1) {
    const stemX = x - 16 + index * 8 + sway * (0.12 + index * 0.05);
    const stemHeight = 18 + (index % 2) * 6;
    ctx.strokeStyle = flower.stemColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(stemX, y + 10);
    ctx.lineTo(stemX + Math.sin(flower.sway * 1.2 + index) * 3, y - stemHeight);
    ctx.stroke();
    ctx.fillStyle = flower.palette[index % flower.palette.length];
    ctx.beginPath();
    ctx.arc(stemX + Math.sin(flower.sway * 1.2 + index) * 3, y - stemHeight, 4.2 + (index % 2) * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8ed";
    ctx.beginPath();
    ctx.arc(stemX + Math.sin(flower.sway * 1.2 + index) * 3, y - stemHeight, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (flower.dropTimer > 0) {
    const alpha = Math.min(flower.dropTimer / 2, 1);
    ctx.fillStyle = `rgba(255, 220, 210, ${0.34 * alpha})`;
    ctx.beginPath();
    ctx.arc(x - 6, y + 14, 2.8, 0, Math.PI * 2);
    ctx.arc(x + 8, y + 12, 2.4, 0, Math.PI * 2);
    ctx.arc(x + 2, y + 16, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const dewAmount = getMorningDewAmount();
  if (dewAmount > 0.08) {
    ctx.fillStyle = `rgba(214, 236, 247, ${(dewAmount * 0.48).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x - 10, y - 2, 2.1, 0, Math.PI * 2);
    ctx.arc(x + 2, y - 12, 1.8, 0, Math.PI * 2);
    ctx.arc(x + 11, y - 4, 1.9, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNatureVisitor(x, y - 24, flower.visitorType, flower.visitorTimer, flower.readyPhase);
}

function drawNatureTree(tree, options = {}) {
  const { foregroundPass = false } = options;
  const { x, y } = worldToScreen(tree.x, tree.y);
  if (!isOnScreen(x, y, 120)) {
    return;
  }

  const profile = getDayProfile();
  const sway = Math.sin(tree.sway + tree.readyPhase) * (1.6 + tree.brush * 2.2 + tree.shake * 4.6);
  const glow =
    tree.glow +
    profile.flowerGlow * 0.14 +
    (tree.cooldown <= 0 ? 0.05 + Math.sin(performance.now() / 420 + tree.readyPhase) * 0.03 : 0);
  if (!foregroundPass && glow > 0.04) {
    drawScaledGlow(ctx, x, y + 4, tree.size * 1.7, tree.size * 1.1, `rgba(220, 238, 181, ${Math.min(glow * 0.14, 0.2)})`, "rgba(220, 238, 181, 0)", 0);
  }

  drawTreeShape(x + sway, y, tree.size, tree.trunkHeight, tree.palette, tree.variant, tree.asset, { skipShadow: foregroundPass });
  const fruitPoints = [
    [x - tree.size * 0.35 + sway * 0.5, y + 2, 9],
    [x + tree.size * 0.28 + sway * 0.4, y + 10, 8.5],
    [x + sway * 0.3, y - tree.size * 0.18, 8]
  ];
  const drewFruit = false;
  if (!drewFruit) {
    ctx.fillStyle = tree.fruitColor;
    ctx.beginPath();
    fruitPoints.forEach(([fx, fy, size]) => {
      ctx.arc(fx, fy, size * 0.38, 0, Math.PI * 2);
    });
    ctx.fill();
  }

  if (tree.dropTimer > 0) {
    const alpha = Math.min(tree.dropTimer / 2.4, 1);
    const dropped = [
      [x - 10, y + tree.trunkHeight + 22],
      [x + 11, y + tree.trunkHeight + 18]
    ];
    const drewDroppedFruit = false;
    if (!drewDroppedFruit) {
      ctx.fillStyle = `rgba(231, 180, 101, ${0.34 * alpha})`;
      ctx.beginPath();
      ctx.arc(x - 10, y + tree.trunkHeight + 22, 4, 0, Math.PI * 2);
      ctx.arc(x + 11, y + tree.trunkHeight + 18, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawNatureVisitor(x + sway * 0.4, y - tree.size - 8, tree.visitorType, tree.visitorTimer, tree.readyPhase);
}

function drawInteractiveNature() {
  state.ambient.nature.bushes.forEach((bush) => drawNatureBush(bush));
  state.ambient.nature.flowers.forEach((flower) => drawNatureFlowerPatch(flower));
  state.ambient.nature.trees.forEach((tree) => drawNatureTree(tree));
}

function drawReactiveVillageLife(cameraX, cameraY) {
  drawInteractiveNature();
  drawMailbox(cameraX, cameraY);
  drawClothesline(cameraX, cameraY);
  drawWindChime(cameraX, cameraY);
  drawScarecrow(cameraX, cameraY);
  drawSpinner();
  drawCat();
  state.ambient.butterflies.forEach((butterfly, index) => {
    if (shouldRenderAmbientSlot(index, 0.78)) {
      drawButterfly(butterfly, index);
    }
  });
  state.ambient.dragonflies.forEach((dragonfly, index) => {
    if (shouldRenderAmbientSlot(index, 0.72)) {
      drawDragonfly(dragonfly, index);
    }
  });
  state.ambient.fieldBirds.forEach((bird, index) => {
    if (shouldRenderAmbientSlot(index, 0.68)) {
      drawFieldBird(bird, index);
    }
  });
  state.ambient.chickens.forEach((chicken) => drawChicken(chicken));
  state.ambient.frogs.forEach((frog) => drawFrog(frog));
  drawAmbientParticles();
}

function drawRoundedRect(x, y, w, h, radius, fillStyle) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundedRect(x, y, w, h, radius, strokeStyle, lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

let cachedWorldLightKey = "";
let cachedWorldLightProfile = null;

function getWorldLightProfile() {
  const { current, next, blend } = getCurrentDayBlendInfo();
  const cacheKey = String(state.dayCycle);
  if (cachedWorldLightProfile && cacheKey === cachedWorldLightKey) {
    return cachedWorldLightProfile;
  }
  const from = WORLD_LIGHT_PROFILES[current];
  const to = WORLD_LIGHT_PROFILES[next];
  cachedWorldLightKey = cacheKey;
  cachedWorldLightProfile = {
    x: lerp(from.x, to.x, blend),
    y: lerp(from.y, to.y, blend),
    length: lerp(from.length, to.length, blend),
    strength: lerp(from.strength, to.strength, blend)
  };
  return cachedWorldLightProfile;
}

function drawEllipseShadow(x, y, rx, ry, alpha = 0.14) {
  const light = getWorldLightProfile();
  ctx.save();
  ctx.translate(x + rx * light.x, y + ry * light.y);
  ctx.rotate(light.x * 0.12);
  ctx.fillStyle = `rgba(31, 47, 31, ${alpha * light.strength})`;
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * light.length, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHillLayer(baseY, peaks, fillStyle, parallax = 0.08) {
  const offsetX = -state.camera.x * parallax;
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(-80, canvas.height + 40);
  ctx.lineTo(-80, baseY);
  peaks.forEach(([x, y]) => {
    ctx.lineTo(x + offsetX, y);
  });
  ctx.lineTo(canvas.width + 80, baseY + 20);
  ctx.lineTo(canvas.width + 80, canvas.height + 40);
  ctx.closePath();
  ctx.fill();
}

function drawFenceSegment(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  const steps = Math.max(2, Math.floor(length / 28));
  const nx = dx / steps;
  const ny = dy / steps;
  ctx.strokeStyle = "#8e6846";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  for (let index = 0; index <= steps; index += 1) {
    const px = x1 + nx * index;
    const py = y1 + ny * index;
    ctx.strokeStyle = "#7b5637";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px, py - 10);
    ctx.lineTo(px, py + 12);
    ctx.stroke();
  }
}

function drawFlowerCluster(x, y, palette) {
  palette.forEach((color, index) => {
    const px = x + Math.cos(index * 1.7) * 10;
    const py = y + Math.sin(index * 2.3) * 5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, 4 + (index % 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7efdc";
    ctx.beginPath();
    ctx.arc(px, py, 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawReed(x, y, height = 24, tilt = 0.2) {
  ctx.strokeStyle = "#6b8f55";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + tilt * 14, y - height * 0.5, x + tilt * 20, y - height);
  ctx.stroke();
}

function drawBirdGlyph(targetCtx, x, y, scale = 1, color = "rgba(88, 95, 86, 0.28)") {
  targetCtx.strokeStyle = color;
  targetCtx.lineWidth = 1.8 * scale;
  targetCtx.beginPath();
  targetCtx.arc(x - 6 * scale, y, 7 * scale, Math.PI * 1.1, Math.PI * 1.9);
  targetCtx.arc(x + 6 * scale, y, 7 * scale, Math.PI * 1.1, Math.PI * 1.9);
  targetCtx.stroke();
}

function drawParallaxTreeLine(baseY, color, trunkColor = "rgba(83, 68, 48, 0.22)", parallax = 0.08, spacing = 122, scaleBias = 1) {
  const shift = (((-state.camera.x * parallax) % spacing) + spacing) % spacing;
  const count = Math.ceil(canvas.width / spacing) + 4;
  for (let index = -2; index < count; index += 1) {
    const x = index * spacing - shift;
    const scale = (0.8 + (index % 4) * 0.11) * scaleBias;
    const height = (34 + (index % 3) * 12) * scale;
    const trunkWidth = 4 * scale;
    ctx.fillStyle = trunkColor;
    ctx.fillRect(x - trunkWidth / 2, baseY - height * 0.28, trunkWidth, height * 0.42);
    ctx.fillStyle = color;
    if (index % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(x, baseY - height);
      ctx.lineTo(x - 16 * scale, baseY - height * 0.2);
      ctx.lineTo(x + 16 * scale, baseY - height * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, baseY - height * 0.72);
      ctx.lineTo(x - 18 * scale, baseY + 2);
      ctx.lineTo(x + 18 * scale, baseY + 2);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, baseY - height * 0.74, 12 * scale, 0, Math.PI * 2);
      ctx.arc(x - 12 * scale, baseY - height * 0.52, 10 * scale, 0, Math.PI * 2);
      ctx.arc(x + 13 * scale, baseY - height * 0.48, 11 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawDistantCottages(baseY, parallax = 0.06) {
  const offset = -state.camera.x * parallax;
  const cottages = [
    { x: 82, y: 0, w: 42, h: 24, wall: "rgba(206, 184, 148, 0.34)", roof: "rgba(170, 118, 88, 0.5)" },
    { x: 258, y: 12, w: 56, h: 30, wall: "rgba(219, 198, 163, 0.34)", roof: "rgba(142, 100, 79, 0.54)" },
    { x: 488, y: -6, w: 48, h: 26, wall: "rgba(216, 193, 154, 0.34)", roof: "rgba(154, 109, 83, 0.52)" },
    { x: 718, y: 8, w: 46, h: 24, wall: "rgba(204, 180, 141, 0.34)", roof: "rgba(125, 93, 72, 0.5)" }
  ];
  cottages.forEach((home) => {
    const x = home.x + offset;
    const y = baseY + home.y;
    drawRoundedRect(x, y, home.w, home.h, 6, home.wall);
    ctx.fillStyle = home.roof;
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 6);
    ctx.lineTo(x + home.w * 0.5, y - 10);
    ctx.lineTo(x + home.w + 4, y + 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255, 240, 219, 0.28)";
    ctx.fillRect(x + home.w * 0.28, y + 8, 10, 8);
  });
}

function drawActivityTreeLine(baseY, color, spacing = 82, trunkColor = "rgba(92, 74, 54, 0.2)") {
  for (let index = -1; index < Math.ceil(640 / spacing) + 2; index += 1) {
    const x = index * spacing + (index % 2) * 18;
    const scale = 0.72 + (index % 3) * 0.12;
    const height = (28 + (index % 4) * 9) * scale;
    activityCtx.fillStyle = trunkColor;
    activityCtx.fillRect(x - 1.8, baseY - height * 0.25, 3.6, height * 0.36);
    activityCtx.fillStyle = color;
    activityCtx.beginPath();
    activityCtx.arc(x, baseY - height * 0.76, 10 * scale, 0, Math.PI * 2);
    activityCtx.arc(x - 10 * scale, baseY - height * 0.52, 8 * scale, 0, Math.PI * 2);
    activityCtx.arc(x + 10 * scale, baseY - height * 0.52, 8 * scale, 0, Math.PI * 2);
    activityCtx.fill();
  }
}

function drawActivityBackdropAccent(game, palette = {}) {
  const horizonY = 186;
  const treeColor = palette.treeLine ?? "rgba(105, 128, 90, 0.24)";
  drawActivityTreeLine(horizonY + 18, treeColor, 82, palette.treeTrunk ?? "rgba(86, 68, 48, 0.18)");

  if (palette.feature === "cottage") {
    fillActivityRoundedRect(84, horizonY + 4, 60, 34, 10, palette.featureWall ?? "rgba(241, 231, 210, 0.74)");
    activityCtx.fillStyle = palette.featureRoof ?? "rgba(180, 114, 82, 0.76)";
    activityCtx.beginPath();
    activityCtx.moveTo(76, horizonY + 12);
    activityCtx.lineTo(114, horizonY - 8);
    activityCtx.lineTo(152, horizonY + 12);
    activityCtx.closePath();
    activityCtx.fill();
    activityCtx.fillStyle = "rgba(202, 221, 231, 0.54)";
    activityCtx.fillRect(96, horizonY + 16, 14, 12);
    activityCtx.fillRect(120, horizonY + 16, 14, 12);
    drawActivityFenceSegment(36, horizonY + 52, 210, horizonY + 52);
  } else if (palette.feature === "fields") {
    [
      { x: 40, y: horizonY + 18, w: 136, h: 30, color: "rgba(174, 186, 109, 0.36)" },
      { x: 192, y: horizonY + 10, w: 150, h: 34, color: "rgba(157, 170, 101, 0.34)" },
      { x: 364, y: horizonY + 16, w: 164, h: 28, color: "rgba(182, 160, 102, 0.28)" }
    ].forEach((patch) => {
      fillActivityRoundedRect(patch.x, patch.y, patch.w, patch.h, 16, patch.color);
      activityCtx.strokeStyle = "rgba(255, 248, 220, 0.12)";
      activityCtx.lineWidth = 1.2;
      for (let line = 0; line < 4; line += 1) {
        activityCtx.beginPath();
        activityCtx.moveTo(patch.x + 10, patch.y + 8 + line * 6);
        activityCtx.lineTo(patch.x + patch.w - 10, patch.y + 6 + line * 6);
        activityCtx.stroke();
      }
    });
    activityCtx.strokeStyle = "rgba(132, 101, 62, 0.28)";
    activityCtx.lineWidth = 2.4;
    activityCtx.beginPath();
    activityCtx.moveTo(528, horizonY + 48);
    activityCtx.lineTo(528, horizonY + 10);
    activityCtx.moveTo(512, horizonY + 24);
    activityCtx.lineTo(544, horizonY + 24);
    activityCtx.stroke();
  } else if (palette.feature === "barn") {
    fillActivityRoundedRect(468, horizonY + 10, 88, 44, 12, "rgba(208, 145, 101, 0.58)");
    activityCtx.fillStyle = "rgba(142, 78, 60, 0.72)";
    activityCtx.beginPath();
    activityCtx.moveTo(458, horizonY + 18);
    activityCtx.lineTo(512, horizonY - 10);
    activityCtx.lineTo(566, horizonY + 18);
    activityCtx.closePath();
    activityCtx.fill();
    fillActivityRoundedRect(154, horizonY + 22, 36, 22, 8, "rgba(198, 179, 112, 0.46)");
    fillActivityRoundedRect(196, horizonY + 26, 32, 20, 8, "rgba(194, 176, 108, 0.4)");
    drawActivityFenceSegment(326, horizonY + 58, 594, horizonY + 58);
  } else if (palette.feature === "pond") {
    activityCtx.fillStyle = "rgba(104, 155, 173, 0.26)";
    activityCtx.beginPath();
    activityCtx.ellipse(518, horizonY + 34, 78, 22, -0.06, 0, Math.PI * 2);
    activityCtx.fill();
    activityCtx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    activityCtx.lineWidth = 1.6;
    activityCtx.beginPath();
    activityCtx.ellipse(520, horizonY + 30, 58, 12, -0.08, 0, Math.PI * 2);
    activityCtx.stroke();
    for (let reed = 0; reed < 7; reed += 1) {
      const rx = 452 + reed * 18;
      activityCtx.strokeStyle = "rgba(106, 143, 90, 0.42)";
      activityCtx.lineWidth = 1.8;
      activityCtx.beginPath();
      activityCtx.moveTo(rx, horizonY + 50);
      activityCtx.quadraticCurveTo(rx - 3, horizonY + 32, rx - 7, horizonY + 16);
      activityCtx.stroke();
    }
  }

  drawBirdGlyph(activityCtx, 116, 74, 0.7, "rgba(92, 98, 92, 0.2)");
  drawBirdGlyph(activityCtx, 162, 88, 0.55, "rgba(92, 98, 92, 0.16)");
}

function drawSkyAndGround() {
  const skyPalettes = [
    { top: "#bdd6ef", mid: "#dceafd", bottom: "#d7e7c7", haze: "rgba(255, 247, 218, 0.18)", band: "rgba(255,255,255,0.08)" },
    { top: "#f0ddb6", mid: "#f8edc8", bottom: "#dfe5b6", haze: "rgba(255, 232, 181, 0.22)", band: "rgba(255,244,216,0.08)" },
    { top: "#cbdcf4", mid: "#e7f0fb", bottom: "#cfe0b0", haze: "rgba(255, 238, 203, 0.14)", band: "rgba(255,255,255,0.07)" },
    { top: "#d08b6d", mid: "#f0c18f", bottom: "#a6bd86", haze: "rgba(255, 210, 160, 0.2)", band: "rgba(255,224,194,0.08)" },
    { top: "#475374", mid: "#66759a", bottom: "#6b8264", haze: "rgba(185, 206, 255, 0.1)", band: "rgba(225,232,255,0.05)" }
  ];
  const { current, next, blend } = getCurrentDayBlendInfo();
  const skyPalette = {
    top: mixColor(skyPalettes[current].top, skyPalettes[next].top, blend),
    mid: mixColor(skyPalettes[current].mid, skyPalettes[next].mid, blend),
    bottom: mixColor(skyPalettes[current].bottom, skyPalettes[next].bottom, blend),
    haze: mixColor(skyPalettes[current].haze, skyPalettes[next].haze, blend),
    band: mixColor(skyPalettes[current].band, skyPalettes[next].band, blend)
  };

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, skyPalette.top);
  gradient.addColorStop(0.5, skyPalette.mid);
  gradient.addColorStop(1, skyPalette.bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const haze = ctx.createLinearGradient(0, canvas.height * 0.26, 0, canvas.height * 0.76);
  haze.addColorStop(0, "rgba(255,255,255,0)");
  haze.addColorStop(0.52, skyPalette.haze);
  haze.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const celestialStops = [
    { x: canvas.width * 0.78, y: 94, color: "rgba(255, 248, 216, 0.86)", radius: 98 },
    { x: canvas.width * 0.66, y: 86, color: "rgba(255, 236, 186, 0.8)", radius: 106 },
    { x: canvas.width * 0.56, y: 104, color: "rgba(255, 228, 190, 0.72)", radius: 94 },
    { x: canvas.width * 0.38, y: 148, color: "rgba(255, 192, 144, 0.54)", radius: 78 },
    { x: canvas.width * 0.72, y: 102, color: "rgba(225, 234, 255, 0.58)", radius: 64 }
  ];
  const currentBody = celestialStops[current];
  const nextBody = celestialStops[next];
  const sunX = lerp(currentBody.x, nextBody.x, blend);
  const sunY = lerp(currentBody.y, nextBody.y, blend);
  const sunColor = mixColor(currentBody.color, nextBody.color, blend);
  const sunRadius = lerp(currentBody.radius, nextBody.radius, blend);
  const nightAmount = getNightAmount();
  const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius);
  halo.addColorStop(0, sunColor);
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  const haloWide = ctx.createRadialGradient(sunX, sunY, 24, sunX, sunY, sunRadius * 1.7);
  haloWide.addColorStop(0, mixColor("rgba(255,255,255,0.08)", "rgba(214, 226, 255, 0.12)", getNightAmount()));
  haloWide.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = haloWide;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 1.7, 0, Math.PI * 2);
  ctx.fill();

  const diskSizes = [18, 20, 18, 16, 14];
  const diskColors = ["#fff3c6", "#ffe7a6", "#ffe4a4", "#ffd0a1", "#e8edff"];
  const diskRadius = lerp(diskSizes[current], diskSizes[next], blend);
  ctx.save();
  ctx.shadowColor = nightAmount > 0.45 ? "rgba(210, 224, 255, 0.52)" : "rgba(255, 225, 157, 0.44)";
  ctx.shadowBlur = 12 + nightAmount * 8;
  ctx.fillStyle = mixColor(diskColors[current], diskColors[next], blend);
  ctx.beginPath();
  ctx.arc(sunX, sunY, diskRadius, 0, Math.PI * 2);
  ctx.fill();
  if (nightAmount > 0.58) {
    ctx.globalAlpha = (nightAmount - 0.58) / 0.42;
    ctx.shadowBlur = 0;
    ctx.fillStyle = mixColor(skyPalette.top, skyPalette.mid, 0.42);
    ctx.beginPath();
    ctx.arc(sunX + diskRadius * 0.42, sunY - diskRadius * 0.18, diskRadius * 0.92, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  if (nightAmount > 0.08) {
    for (let index = 0; index < 18; index += 1) {
      const starX = 80 + ((index * 137) % (canvas.width - 160));
      const starY = 44 + ((index * 83) % 180);
      const starAlpha = 0.12 + (index % 3) * 0.05;
      ctx.fillStyle = `rgba(244, 244, 255, ${(nightAmount * starAlpha).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(starX, starY, 1.2 + (index % 2) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawHillLayer(canvas.height * 0.42, [[120, 242], [270, 214], [430, 236], [620, 205], [810, 226], [1040, 198]], "rgba(134, 164, 126, 0.55)", 0.04);
  drawHillLayer(canvas.height * 0.5, [[60, 312], [210, 286], [420, 326], [590, 276], [860, 314], [1080, 284]], "rgba(112, 144, 103, 0.5)", 0.07);
  drawHillLayer(canvas.height * 0.58, [[0, 370], [190, 332], [370, 366], [540, 324], [790, 358], [980, 338], [1160, 368]], "rgba(93, 121, 84, 0.36)", 0.1);
  drawParallaxTreeLine(canvas.height * 0.5, "rgba(108, 134, 93, 0.22)", "rgba(82, 68, 51, 0.14)", 0.05, 128, 0.94);
  drawDistantCottages(canvas.height * 0.49, 0.055);
  drawParallaxTreeLine(canvas.height * 0.58, "rgba(83, 111, 73, 0.24)", "rgba(71, 58, 42, 0.18)", 0.08, 112, 1);
  drawParallaxTreeLine(canvas.height * 0.66, "rgba(68, 93, 63, 0.2)", "rgba(54, 44, 34, 0.16)", 0.11, 104, 1.04);
  drawBirdGlyph(ctx, canvas.width * 0.2, 96, 0.95, "rgba(88, 95, 86, 0.2)");
  drawBirdGlyph(ctx, canvas.width * 0.26, 116, 0.72, "rgba(88, 95, 86, 0.16)");

  for (let i = 0; i < 28; i += 1) {
    const y = (i * 140 - state.camera.y * 0.25) % (canvas.height + 140);
    ctx.fillStyle = skyPalette.band;
    ctx.fillRect(0, y, canvas.width, 2);
  }

  const vignette = ctx.createLinearGradient(0, 0, 0, canvas.height);
  vignette.addColorStop(0, "rgba(255,255,255,0.04)");
  vignette.addColorStop(1, "rgba(27, 33, 22, 0.08)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawClouds() {
  const cloudStops = [
    { underside: "rgba(210, 228, 238, 0.24)", body: "rgba(255, 255, 255, 0.62)", top: "rgba(255, 255, 255, 0.22)" },
    { underside: "rgba(231, 214, 182, 0.22)", body: "rgba(255, 251, 239, 0.64)", top: "rgba(255, 255, 255, 0.18)" },
    { underside: "rgba(203, 218, 236, 0.2)", body: "rgba(248, 250, 255, 0.6)", top: "rgba(255, 255, 255, 0.18)" },
    { underside: "rgba(230, 188, 146, 0.22)", body: "rgba(255, 236, 220, 0.52)", top: "rgba(255, 255, 255, 0.16)" },
    { underside: "rgba(110, 126, 164, 0.24)", body: "rgba(216, 226, 255, 0.42)", top: "rgba(255, 255, 255, 0.12)" }
  ];
  const { current, next, blend } = getCurrentDayBlendInfo();
  const underside = mixColor(cloudStops[current].underside, cloudStops[next].underside, blend);
  const body = mixColor(cloudStops[current].body, cloudStops[next].body, blend);
  const topGlow = mixColor(cloudStops[current].top, cloudStops[next].top, blend);
  cloudAnchors.forEach((cloud, index) => {
    if (!shouldRenderAmbientSlot(index, 0.82)) {
      return;
    }
    const drift = (cloud.x + (performance.now() / 1000) * cloud.speed * 18) % (world.width + 220);
    const x = drift - state.camera.x - 110;
    const y = cloud.y - state.camera.y * 0.08;
    const scale = cloud.scale;

    ctx.fillStyle = topGlow;
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 16, 46 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = underside;
    ctx.beginPath();
    ctx.ellipse(x + 2, y + 12, 38 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 30 * scale, y + 16, 30 * scale, 11 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(x, y, 34 * scale, 20 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 28 * scale, y + 4, 28 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 28 * scale, y + 6, 26 * scale, 16 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = topGlow;
    ctx.beginPath();
    ctx.ellipse(x - 12 * scale, y - 8, 18 * scale, 7 * scale, -0.25, 0, Math.PI * 2);
    ctx.ellipse(x + 18 * scale, y - 6, 14 * scale, 6 * scale, 0.18, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawScaledGlow(targetCtx, x, y, rx, ry, innerColor, outerColor, rotation = 0) {
  if (
    targetCtx === ctx &&
    (x + rx < -12 || x - rx > canvas.width + 12 || y + ry < -12 || y - ry > canvas.height + 12)
  ) {
    return;
  }
  targetCtx.save();
  targetCtx.translate(x, y);
  targetCtx.rotate(rotation);
  targetCtx.scale(rx, ry);
  const gradient = targetCtx.createRadialGradient(0, 0, 0.08, 0, 0, 1);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  targetCtx.fillStyle = gradient;
  targetCtx.beginPath();
  targetCtx.arc(0, 0, 1, 0, Math.PI * 2);
  targetCtx.fill();
  targetCtx.restore();
}

function drawPebbleCluster(x, y, count = 6, spreadX = 22, spreadY = 12, palette = ["rgba(231, 222, 188, 0.32)", "rgba(139, 130, 108, 0.2)"]) {
  for (let index = 0; index < count; index += 1) {
    const px = x + Math.cos(index * 1.7) * (spreadX * (0.3 + (index % 3) * 0.18));
    const py = y + Math.sin(index * 1.4) * (spreadY * (0.35 + (index % 2) * 0.22));
    ctx.fillStyle = palette[index % palette.length];
    ctx.beginPath();
    ctx.ellipse(px, py, 4 + (index % 3), 2 + (index % 2) * 0.7, index * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSteppingStones(points, color = "#d8c8a9", shadowAlpha = 0.12) {
  points.forEach(([x, y, rx, ry, rotation = 0]) => {
    drawEllipseShadow(x, y + ry + 3, rx, ry * 0.4, shadowAlpha);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(116, 95, 70, 0.16)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });
}

function traceOrganicRegionPath(points) {
  if (!points?.length) {
    return;
  }
  const midpoint = (left, right) => [(left[0] + right[0]) / 2, (left[1] + right[1]) / 2];
  const start = midpoint(points[points.length - 1], points[0]);
  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  points.forEach((point, index) => {
    const next = points[(index + 1) % points.length];
    const end = midpoint(point, next);
    ctx.quadraticCurveTo(point[0], point[1], end[0], end[1]);
  });
  ctx.closePath();
}

function drawOrganicRegion(points, palette, options = {}) {
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);

  ctx.save();
  traceOrganicRegionPath(points);
  ctx.strokeStyle = options.shoulder ?? "rgba(73, 94, 64, 0.16)";
  ctx.lineWidth = (options.shoulderWidth ?? 18) * 0.72;
  ctx.lineJoin = "round";
  ctx.stroke();

  const surface = ctx.createLinearGradient(minX, minY, minX, maxY);
  surface.addColorStop(0, palette.top);
  surface.addColorStop(0.55, palette.mid ?? palette.top);
  surface.addColorStop(1, palette.bottom);
  ctx.fillStyle = surface;
  traceOrganicRegionPath(points);
  ctx.fill();
  ctx.strokeStyle = options.border ?? "rgba(255, 249, 219, 0.13)";
  ctx.lineWidth = 2.4;
  ctx.stroke();

  traceOrganicRegionPath(points);
  ctx.clip();
  const lightPool = ctx.createRadialGradient(
    minX + width * 0.34,
    minY + height * 0.24,
    12,
    minX + width * 0.34,
    minY + height * 0.24,
    width * 0.7
  );
  lightPool.addColorStop(0, options.glow ?? "rgba(255, 250, 218, 0.13)");
  lightPool.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = lightPool;
  ctx.fillRect(minX, minY, width, height);

  const lineCount = options.texture === "wetland" ? 5 : options.texture === "soil" ? 7 : 6;
  ctx.lineCap = "round";
  for (let line = 0; line < lineCount; line += 1) {
    const y = minY + height * (0.24 + line * (0.62 / Math.max(lineCount - 1, 1)));
    ctx.strokeStyle =
      options.texture === "soil"
        ? line % 2 === 0
          ? "rgba(84, 57, 35, 0.13)"
          : "rgba(238, 213, 164, 0.1)"
        : options.texture === "wetland"
          ? "rgba(220, 238, 209, 0.12)"
          : line % 2 === 0
            ? "rgba(239, 247, 208, 0.1)"
            : "rgba(88, 119, 74, 0.08)";
    ctx.lineWidth = options.texture === "soil" ? 3.4 : 2.4;
    ctx.beginPath();
    ctx.moveTo(minX - 18, y);
    ctx.bezierCurveTo(
      minX + width * 0.28,
      y - 9 + (line % 2) * 5,
      minX + width * 0.7,
      y + 9 - (line % 2) * 4,
      maxX + 18,
      y - 2
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawWorldRegionLayer(cameraX, cameraY) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  const regions = [
    {
      bounds: [24, 44, 634, 516],
      points: [[42, 98], [106, 48], [596, 44], [658, 122], [650, 472], [612, 548], [118, 560], [34, 500], [24, 196]],
      palette: { top: "#dcebb7", mid: "#cfe2a4", bottom: "#b9d092" },
      options: { shoulder: "rgba(74, 107, 67, 0.2)", shoulderWidth: 22, glow: "rgba(255, 250, 213, 0.18)" }
    },
    {
      bounds: [678, 112, 404, 270],
      points: [[712, 144], [760, 112], [1026, 120], [1082, 180], [1070, 326], [1012, 382], [736, 374], [678, 318], [680, 202]],
      palette: { top: "#d2e3a7", mid: "#c2d899", bottom: "#adc685" },
      options: { shoulder: "rgba(70, 105, 63, 0.16)", shoulderWidth: 18, glow: "rgba(247, 245, 200, 0.15)" }
    },
    {
      bounds: [922, 414, 382, 306],
      points: [[954, 454], [1018, 414], [1244, 420], [1298, 472], [1304, 652], [1258, 716], [994, 720], [922, 664], [924, 506]],
      palette: { top: "#876642", mid: "#785738", bottom: "#68492f" },
      options: { texture: "soil", shoulder: "rgba(66, 46, 29, 0.26)", shoulderWidth: 20, border: "rgba(238, 214, 168, 0.12)", glow: "rgba(231, 199, 144, 0.1)" }
    },
    {
      bounds: [506, 814, 358, 238],
      points: [[544, 844], [602, 814], [808, 816], [862, 858], [864, 996], [816, 1046], [570, 1052], [508, 1006], [506, 884]],
      palette: { top: "#88633a", mid: "#77532f", bottom: "#654426" },
      options: { texture: "soil", shoulder: "rgba(65, 46, 28, 0.28)", shoulderWidth: 20, border: "rgba(236, 209, 157, 0.12)", glow: "rgba(232, 194, 130, 0.1)" }
    },
    {
      bounds: [1392, 340, 280, 208],
      points: [[1424, 374], [1488, 340], [1622, 344], [1672, 392], [1670, 486], [1614, 548], [1448, 544], [1392, 498], [1392, 414]],
      palette: { top: "#ddcd9f", mid: "#c9b78b", bottom: "#ad986e" },
      options: { shoulder: "rgba(105, 91, 59, 0.2)", shoulderWidth: 18, glow: "rgba(255, 239, 196, 0.14)" }
    },
    {
      bounds: [1368, 864, 352, 256],
      points: [[1416, 904], [1490, 864], [1656, 866], [1720, 932], [1710, 1030], [1658, 1106], [1456, 1120], [1372, 1044], [1368, 958]],
      palette: { top: "#8eaa80", mid: "#789771", bottom: "#668767" },
      options: { texture: "wetland", shoulder: "rgba(72, 104, 68, 0.24)", shoulderWidth: 24, border: "rgba(221, 235, 197, 0.12)", glow: "rgba(214, 236, 215, 0.12)" }
    }
  ];
  regions.forEach((region) => {
    if (!isWorldRectVisible(...region.bounds, 40, cameraX, cameraY)) {
      return;
    }
    drawOrganicRegion(region.points, region.palette, region.options);
  });
  ctx.restore();
}

function strokeVillageRoad(points, width, strokeStyle) {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) {
    const point = points[index];
    const previous = points[index - 1];
    if (index < points.length - 1) {
      const next = points[index + 1];
      ctx.quadraticCurveTo(point[0], point[1], (point[0] + next[0]) / 2, (point[1] + next[1]) / 2);
    } else {
      ctx.lineTo(point[0], point[1]);
    }
  }
}

function drawVillageRoadBase(cameraX, cameraY) {
  const vertical = [[226, 78], [224, 364], [228, 748], [224, 1036], [226, 1318]];
  const cross = [[226, 760], [520, 756], [804, 764], [1070, 760]];
  const eastBranch = [[1056, 758], [1284, 756], [1538, 758]];
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  [vertical, cross].forEach((road) => {
    strokeVillageRoad(road, 122, "rgba(91, 76, 53, 0.22)");
    ctx.stroke();
    strokeVillageRoad(road, 104, "#dec99f");
    ctx.stroke();
    strokeVillageRoad(road, 92, "#ead9b3");
    ctx.stroke();
  });
  strokeVillageRoad(eastBranch, 104, "rgba(91, 76, 53, 0.22)");
  ctx.stroke();
  strokeVillageRoad(eastBranch, 88, "#dfcaa2");
  ctx.stroke();
  strokeVillageRoad(eastBranch, 76, "#ead9b5");
  ctx.stroke();
  const junctionGlow = ctx.createRadialGradient(228, 760, 10, 228, 760, 72);
  junctionGlow.addColorStop(0, "rgba(255, 240, 205, 0.28)");
  junctionGlow.addColorStop(1, "rgba(226, 206, 166, 0)");
  ctx.fillStyle = junctionGlow;
  ctx.beginPath();
  ctx.arc(228, 760, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCropRidges(x, y, w, h, rows = 5, baseColor = "#7b5535", alternateColor = "#6e482f") {
  for (let row = 0; row < rows; row += 1) {
    const rowY = y + 16 + row * (h / rows);
    const rowHeight = Math.max(24, h / rows - 18);
    ctx.fillStyle = row % 2 === 0 ? baseColor : alternateColor;
    ctx.beginPath();
    ctx.moveTo(x + 10, rowY + rowHeight);
    ctx.lineTo(x + 18, rowY);
    ctx.lineTo(x + w - 20, rowY + 4);
    ctx.lineTo(x + w - 10, rowY + rowHeight);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(219, 188, 135, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 22, rowY + rowHeight * 0.46);
    ctx.lineTo(x + w - 24, rowY + rowHeight * 0.46 + 4);
    ctx.stroke();
  }
}

function drawTreeShape(x, y, size, trunkHeight, palette, variant = 0, asset = null, options = {}) {
  void asset;
  const canopySize = size * 1.18;
  const trunkWidth = Math.max(10, size * 0.48);
  const trunkTop = y + canopySize * 0.2;
  const trunkBottom = y + trunkHeight + 24;
  if (!options.skipShadow) {
    drawEllipseShadow(x, trunkBottom + 2, canopySize * 1.18, 7 + size * 0.2, 0.13);
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.strokeStyle = palette.trunkShadow ?? "#5d422f";
  ctx.lineWidth = trunkWidth;
  ctx.beginPath();
  ctx.moveTo(x, trunkBottom);
  ctx.quadraticCurveTo(x + (variant % 2 ? -2 : 3), y + trunkHeight * 0.68, x, trunkTop);
  ctx.stroke();
  ctx.strokeStyle = palette.trunk ?? "#7a5637";
  ctx.lineWidth = trunkWidth * 0.62;
  ctx.beginPath();
  ctx.moveTo(x - trunkWidth * 0.12, trunkBottom - 1);
  ctx.quadraticCurveTo(x + (variant % 2 ? -1 : 2), y + trunkHeight * 0.66, x - 1, trunkTop);
  ctx.stroke();
  ctx.strokeStyle = palette.trunk ?? "#7a5637";
  ctx.lineWidth = Math.max(3, trunkWidth * 0.28);
  ctx.beginPath();
  ctx.moveTo(x, y + trunkHeight * 0.64);
  ctx.lineTo(x - canopySize * 0.48, y + canopySize * 0.06);
  ctx.moveTo(x + 1, y + trunkHeight * 0.58);
  ctx.lineTo(x + canopySize * 0.5, y - canopySize * 0.02);
  ctx.stroke();

  const baseGradient = ctx.createLinearGradient(x, y - canopySize, x, y + canopySize);
  baseGradient.addColorStop(0, palette.accent);
  baseGradient.addColorStop(0.46, palette.base);
  baseGradient.addColorStop(1, palette.shadow ?? mixColor(palette.base, "#29452d", 0.24));
  ctx.fillStyle = baseGradient;
  const lobeSets = [
    [-0.62, 0.12, 0.68],
    [0.64, 0.1, 0.7],
    [0, 0.25, 0.9],
    [-0.28, -0.38, 0.72],
    [0.34, -0.34, 0.7],
    [0, -0.62, 0.58]
  ];
  lobeSets.forEach(([offsetX, offsetY, scale]) => {
    ctx.beginPath();
    if (variant % 3 === 1 && offsetY < -0.3) {
      ctx.moveTo(x + offsetX * canopySize, y + (offsetY - scale) * canopySize);
      ctx.lineTo(x + (offsetX - scale * 0.72) * canopySize, y + (offsetY + scale * 0.68) * canopySize);
      ctx.lineTo(x + (offsetX + scale * 0.72) * canopySize, y + (offsetY + scale * 0.68) * canopySize);
      ctx.closePath();
    } else {
      ctx.ellipse(
        x + offsetX * canopySize,
        y + offsetY * canopySize,
        canopySize * scale,
        canopySize * scale * (0.72 + (variant % 2) * 0.06),
        offsetX * 0.12,
        0,
        Math.PI * 2
      );
    }
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255, 248, 205, 0.15)";
  ctx.beginPath();
  ctx.ellipse(x - canopySize * 0.28, y - canopySize * 0.48, canopySize * 0.42, canopySize * 0.2, -0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(33, 58, 34, 0.12)";
  ctx.beginPath();
  ctx.ellipse(x + canopySize * 0.12, y + canopySize * 0.55, canopySize * 0.74, canopySize * 0.2, 0.04, 0, Math.PI * 2);
  ctx.fill();
  for (let fleck = 0; fleck < 5; fleck += 1) {
    const angle = fleck * 2.31 + variant * 0.7;
    ctx.fillStyle = fleck % 2 === 0 ? "rgba(247, 238, 179, 0.24)" : "rgba(34, 69, 37, 0.13)";
    ctx.beginPath();
    ctx.arc(
      x + Math.cos(angle) * canopySize * (0.34 + (fleck % 2) * 0.22),
      y + Math.sin(angle) * canopySize * 0.42,
      Math.max(1.8, canopySize * 0.09),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
  ctx.restore();
}

function drawRoadTexture(cameraX, cameraY) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  const visible = (x, y, padding = 64) =>
    x >= cameraX - padding &&
    x <= cameraX + canvas.width + padding &&
    y >= cameraY - padding &&
    y <= cameraY + canvas.height + padding;
  const phoneLow = state.device?.id === "phone-low";

  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(126, 94, 59, 0.2)";
  ctx.lineWidth = phoneLow ? 4.6 : 3.2;
  [[202, 244], [740, 786]].forEach(([first, second], axis) => {
    [first, second].forEach((track, trackIndex) => {
      ctx.beginPath();
      if (axis === 0) {
        ctx.moveTo(track, 94);
        ctx.bezierCurveTo(track - 4 + trackIndex * 3, 430, track + 5 - trackIndex * 4, 930, track, 1308);
      } else {
        ctx.moveTo(190, track);
        ctx.bezierCurveTo(510, track + (trackIndex ? -3 : 3), 824, track - (trackIndex ? -4 : 4), 1074, track);
      }
      ctx.stroke();
    });
  });
  [742, 780].forEach((track, index) => {
    ctx.beginPath();
    ctx.moveTo(1052, track);
    ctx.quadraticCurveTo(1300, track + (index ? -3 : 3), 1530, track);
    ctx.stroke();
  });

  const pebbleCount = phoneLow ? 28 : 46;
  for (let index = 0; index < pebbleCount; index += 1) {
    const vertical = index % 3 !== 0;
    const x = vertical ? 190 + ((index * 17) % 72) : 202 + ((index * 59) % 1280);
    const y = vertical ? 104 + ((index * 47) % 1190) : 730 + ((index * 13) % 58);
    if (!visible(x, y, 28)) {
      continue;
    }
    ctx.fillStyle = index % 2 === 0 ? "rgba(119, 91, 60, 0.18)" : "rgba(255, 239, 205, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x, y, phoneLow ? 4.8 : 3.8 + (index % 3), phoneLow ? 2.4 : 1.8 + (index % 2), (index % 5) * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  const edgeTufts = phoneLow ? 20 : 34;
  ctx.strokeStyle = "rgba(78, 116, 67, 0.28)";
  ctx.lineWidth = phoneLow ? 2.8 : 1.8;
  for (let tuft = 0; tuft < edgeTufts; tuft += 1) {
    const edgeX = tuft % 2 === 0 ? 164 : 288;
    const y = 100 + ((tuft * 73) % 1190);
    if (!visible(edgeX, y, 24)) {
      continue;
    }
    const direction = tuft % 2 === 0 ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(edgeX, y + 5);
    ctx.quadraticCurveTo(edgeX + direction * 4, y - 4, edgeX + direction * 9, y - 12);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrassTexture(x, y, w, h, density = 18) {
  if (x + w < -32 || x > canvas.width + 32 || y + h < -32 || y > canvas.height + 32) {
    return;
  }
  ctx.strokeStyle = "rgba(107, 142, 78, 0.22)";
  ctx.lineWidth = 1.6;
  for (let index = 0; index < density; index += 1) {
    const px = x + ((index * 37) % w);
    const py = y + ((index * 51) % h);
    ctx.beginPath();
    ctx.moveTo(px, py + 6);
    ctx.lineTo(px + ((index % 3) - 1) * 3, py - 5);
    ctx.stroke();
  }
}

function drawWorldGroundFloor(cameraX, cameraY) {
  ctx.save();
  ctx.translate(-cameraX, -cameraY);
  const isVisibleWorldPoint = (x, y, padding = 48) =>
    x >= cameraX - padding &&
    x <= cameraX + canvas.width + padding &&
    y >= cameraY - padding &&
    y <= cameraY + canvas.height + padding;
  const isVisibleWorldRect = (x, y, width, height, padding = 64) =>
    x + width >= cameraX - padding &&
    x <= cameraX + canvas.width + padding &&
    y + height >= cameraY - padding &&
    y <= cameraY + canvas.height + padding;

  const { current, next, blend } = getCurrentDayBlendInfo();
  const groundStops = [
    { top: "#97af84", mid: "#809971", bottom: "#6e8663" },
    { top: "#a7b58c", mid: "#8f9d73", bottom: "#788669" },
    { top: "#96ab83", mid: "#81986f", bottom: "#6d845f" },
    { top: "#8f996f", mid: "#73825e", bottom: "#627356" },
    { top: "#62705f", mid: "#516150", bottom: "#435243" }
  ];
  const floorGradient = ctx.createLinearGradient(0, 220, 0, world.height);
  floorGradient.addColorStop(0, mixColor(groundStops[current].top, groundStops[next].top, blend));
  floorGradient.addColorStop(0.48, mixColor(groundStops[current].mid, groundStops[next].mid, blend));
  floorGradient.addColorStop(1, mixColor(groundStops[current].bottom, groundStops[next].bottom, blend));
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 220, world.width, world.height - 220);

  const fieldBands = [
    { y: 320, depth: 54, color: "rgba(132, 158, 118, 0.22)", wave: 24 },
    { y: 520, depth: 66, color: "rgba(117, 146, 105, 0.2)", wave: 20 },
    { y: 760, depth: 76, color: "rgba(106, 132, 94, 0.18)", wave: 26 },
    { y: 1040, depth: 88, color: "rgba(96, 120, 88, 0.16)", wave: 22 }
  ];

  fieldBands.forEach((band, bandIndex) => {
    if (!isVisibleWorldRect(0, band.y - band.wave - 12, world.width, band.depth + band.wave * 2 + 24)) {
      return;
    }
    ctx.fillStyle = band.color;
    ctx.beginPath();
    ctx.moveTo(-40, band.y + band.depth);
    ctx.lineTo(-40, band.y);
    for (let x = -40; x <= world.width + 80; x += 120) {
      const offsetY =
        Math.sin((x + bandIndex * 70) * 0.01) * band.wave +
        Math.cos((x + bandIndex * 50) * 0.017) * 10;
      ctx.lineTo(x, band.y + offsetY);
    }
    ctx.lineTo(world.width + 80, band.y + band.depth);
    ctx.closePath();
    ctx.fill();
  });

  const meadowPatches = [
    { x: 64, y: 262, w: 312, h: 140, color: "rgba(168, 186, 126, 0.12)" },
    { x: 640, y: 248, w: 248, h: 122, color: "rgba(188, 198, 138, 0.1)" },
    { x: 1218, y: 266, w: 220, h: 108, color: "rgba(170, 186, 124, 0.1)" },
    { x: 344, y: 894, w: 296, h: 126, color: "rgba(152, 171, 115, 0.12)" },
    { x: 1156, y: 908, w: 282, h: 128, color: "rgba(173, 186, 126, 0.1)" }
  ];
  meadowPatches.forEach((patch, index) => {
    if (!isVisibleWorldRect(patch.x, patch.y, patch.w, patch.h)) {
      return;
    }
    const glow = ctx.createRadialGradient(
      patch.x + patch.w * 0.5,
      patch.y + patch.h * 0.5,
      18,
      patch.x + patch.w * 0.5,
      patch.y + patch.h * 0.5,
      patch.w * 0.7
    );
    glow.addColorStop(0, patch.color);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(
      patch.x + patch.w * 0.5,
      patch.y + patch.h * 0.5,
      patch.w * 0.52,
      patch.h * (0.46 + (index % 2) * 0.04),
      -0.08 + index * 0.03,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(233, 244, 205, 0.08)";
  ctx.lineWidth = 2;
  for (let line = 0; line < 16; line += 1) {
    const y = 286 + line * 68;
    if (!isVisibleWorldPoint(cameraX + canvas.width / 2, y, 18)) {
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(world.width, y + Math.sin(line * 0.6) * 8);
    ctx.stroke();
  }

  for (let index = 0; index < 180; index += 1) {
    const x = 48 + ((index * 117) % (world.width - 96));
    const y = 252 + ((index * 83) % (world.height - 320));
    if (!isVisibleWorldPoint(x, y) || isRoadSurface(x, y)) {
      continue;
    }
    ctx.strokeStyle = index % 4 === 0 ? "rgba(121, 157, 89, 0.22)" : "rgba(102, 136, 76, 0.18)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + ((index % 3) - 1) * 3, y - 6);
    ctx.stroke();
  }

  for (let patch = 0; patch < 64; patch += 1) {
    const x = 72 + ((patch * 79) % (world.width - 144));
    const y = 246 + ((patch * 131) % (world.height - 332));
    if (!isVisibleWorldPoint(x, y, 72) || isRoadSurface(x, y)) {
      continue;
    }
    ctx.fillStyle = patch % 3 === 0 ? "rgba(87, 113, 70, 0.08)" : "rgba(203, 190, 144, 0.06)";
    ctx.beginPath();
    ctx.ellipse(x, y, 12 + (patch % 4) * 4, 6 + (patch % 3) * 2, (patch % 5) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let pebble = 0; pebble < 110; pebble += 1) {
    const x = 64 + ((pebble * 67) % (world.width - 128));
    const y = 238 + ((pebble * 107) % (world.height - 308));
    if (!isVisibleWorldPoint(x, y) || isRoadSurface(x, y)) {
      continue;
    }
    ctx.fillStyle = pebble % 2 === 0 ? "rgba(231, 222, 188, 0.12)" : "rgba(110, 126, 96, 0.1)";
    ctx.beginPath();
    ctx.ellipse(x, y, 2.8 + (pebble % 3), 1.5 + (pebble % 2) * 0.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let bloom = 0; bloom < 22; bloom += 1) {
    const x = 90 + ((bloom * 173) % (world.width - 180));
    const y = 300 + ((bloom * 149) % (world.height - 380));
    if (!isVisibleWorldPoint(x, y, 72) || isRoadSurface(x, y)) {
      continue;
    }
    drawFlowerCluster(x, y, ["#f1b56b", "#f7d6e0", "#f4f0d0"]);
  }

  ctx.restore();
}

function drawWaterRipple(x, y, radius, alpha = 0.16) {
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawWorldPracticeObjects(cameraX, cameraY) {
  const practice = state.worldPractice;

  if (state.completedTasks.has("gardenCare")) {
    const sourceX = practice.garden.source.x - cameraX;
    const sourceY = practice.garden.source.y - cameraY;
    drawEllipseShadow(sourceX, sourceY + 16, 18, 5, 0.1);
    fillRoundedRectOn(ctx, sourceX - 18, sourceY - 12, 36, 24, 6, "#a6784c");
    ctx.fillStyle = "rgba(111, 76, 49, 0.34)";
    ctx.fillRect(sourceX - 14, sourceY - 5, 28, 8);
    ctx.strokeStyle = "#d9dfe3";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(sourceX - 8, sourceY - 6);
    ctx.lineTo(sourceX + 6, sourceY - 1);
    ctx.moveTo(sourceX - 8, sourceY + 4);
    ctx.lineTo(sourceX + 6, sourceY + 1);
    ctx.stroke();
    ctx.strokeStyle = "#c15f3f";
    ctx.beginPath();
    ctx.arc(sourceX - 11, sourceY - 6, 3, 0, Math.PI * 2);
    ctx.arc(sourceX - 11, sourceY + 4, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(sourceX - 4, sourceY - 2, 8, 1.6);

    practice.garden.shrubs.forEach((shrub) => {
      const sx = shrub.x - cameraX + Math.sin(performance.now() / 45 + shrub.x * 0.02) * shrub.shake * 4;
      const sy = shrub.y - cameraY;
      const radius = 18 - shrub.trim * 5;
      drawEllipseShadow(sx, sy + 18, radius, 7, 0.1);
      ctx.fillStyle = shrub.trim >= 1 ? "#89b56d" : "#5f8d4d";
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shrub.trim >= 1 ? "#a8cf7e" : "#79ab60";
      ctx.beginPath();
      ctx.arc(sx - radius * 0.32, sy - 4, radius * 0.42, 0, Math.PI * 2);
      ctx.arc(sx + radius * 0.3, sy - 3, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();
    });
    practice.garden.topiaries.forEach((topiary, index) => {
      const sway = Math.sin(performance.now() / 60 + index) * topiary.shake * 4;
      const tx = topiary.x - cameraX + sway;
      const ty = topiary.y - cameraY;
      const topSize = 16 - topiary.trim * 4;
      drawEllipseShadow(tx, ty + 22, 16, 5, 0.1);
      ctx.fillStyle = topiary.trim >= 1 ? "#87b36b" : "#5f8d4d";
      ctx.fillRect(tx - 4, ty + 4, 8, 24);
      ctx.beginPath();
      ctx.arc(tx, ty - 6, topSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tx, ty + 10, topSize * 0.82, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = topiary.trim >= 1 ? "#a8cf7e" : "#79ab60";
      ctx.beginPath();
      ctx.arc(tx - 4, ty - 10, topSize * 0.32, 0, Math.PI * 2);
      ctx.arc(tx + 5, ty + 6, topSize * 0.28, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (state.completedTasks.has("lawnTrim")) {
    practice.lawn.lanes.forEach((lane) => {
      const cellWidth = lane.w / lane.cells.length;
      lane.cells.forEach((cell, index) => {
        const x = lane.x1 + index * cellWidth - cameraX;
        const y = lane.y - cameraY;
        ctx.fillStyle = cell > 0 ? "rgba(216, 224, 182, 0.92)" : "rgba(110, 152, 78, 0.14)";
        ctx.fillRect(x, y, cellWidth - 2, 24);
      });
      if (lane.reaction > 0) {
        ctx.fillStyle = `rgba(255, 248, 235, ${lane.reaction * 0.2})`;
        ctx.fillRect(lane.x1 - cameraX, lane.y - cameraY, lane.w, 24);
      }
    });
    const mowerX = practice.lawn.source.x - cameraX;
    const mowerY = practice.lawn.source.y - cameraY;
    drawEllipseShadow(mowerX, mowerY + 18, 28, 7, 0.14);
    ctx.save();
    ctx.translate(mowerX, mowerY);
    ctx.rotate(practice.lawn.source.tilt * 0.02);
    ctx.fillStyle = "#b95f3a";
    ctx.fillRect(-22, -12, 44, 24);
    ctx.fillStyle = "#f8efe1";
    ctx.fillRect(-18, -18, 30, 5);
    ctx.fillStyle = "#6d5443";
    ctx.beginPath();
    ctx.arc(-12, 12, 6, 0, Math.PI * 2);
    ctx.arc(12, 12, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    practice.lawn.verges.forEach((patch) => {
      const px = patch.x - cameraX;
      const py = patch.y - cameraY;
      const cutScale = 1 - patch.cut * 0.72;
      drawEllipseShadow(px, py + 16, patch.w * 0.34, 5, 0.08);
      ctx.fillStyle = patch.cut >= 1 ? "rgba(212, 219, 178, 0.9)" : "rgba(96, 146, 82, 0.22)";
      ctx.fillRect(px - patch.w * 0.5, py + 4, patch.w, 12);
      ctx.strokeStyle = patch.cut >= 1 ? "rgba(240, 232, 206, 0.44)" : "rgba(102, 145, 78, 0.42)";
      ctx.lineWidth = 2;
      for (let blade = 0; blade < 6; blade += 1) {
        const bx = px - patch.w * 0.35 + blade * (patch.w / 6.2);
        ctx.beginPath();
        ctx.moveTo(bx, py + 8);
        ctx.lineTo(bx + (blade % 2 === 0 ? -4 : 4), py - 10 * cutScale);
        ctx.stroke();
      }
      if (patch.reaction > 0) {
        ctx.fillStyle = `rgba(255, 248, 235, ${patch.reaction * 0.18})`;
        ctx.fillRect(px - patch.w * 0.5, py - 6, patch.w, 24);
      }
    });
  }

  if (state.completedTasks.has("vegetablePlant") && state.completedTasks.has("vegetableGrow")) {
    const trayX = practice.vegetable.tray.x - cameraX;
    const trayY = practice.vegetable.tray.y - cameraY;
    drawEllipseShadow(trayX, trayY + 14, 18, 5, 0.1);
    drawCanvasSeedlingCrate(ctx, trayX, trayY - 1, {
      scale: 1,
      sprouts: Math.max(practice.vegetable.tray.seedlings, 1)
    });
    const bucketX = practice.vegetable.bucket.x - cameraX;
    const bucketY = practice.vegetable.bucket.y - cameraY;
    drawEllipseShadow(bucketX, bucketY + 16, 14, 4, 0.1);
    drawCanvasBucket(ctx, bucketX, bucketY, {
      scale: 1,
      water: practice.vegetable.bucket.water > 0 ? 1 : 0
    });
    practice.vegetable.plots.forEach((plot, index) => {
      const px = plot.x - cameraX;
      const py = plot.y - cameraY;
      drawEllipseShadow(px, py + 16, plot.planted ? 10 : 14, 4, 0.08);
      ctx.fillStyle = plot.planted ? "#6d4a2f" : "#5a3b23";
      ctx.beginPath();
      ctx.ellipse(px, py + 6, 16, 8, -0.05, 0, Math.PI * 2);
      ctx.fill();
      if (plot.planted) {
        const bounce = Math.sin(plot.bounce * Math.PI) * 5;
        ctx.strokeStyle = "#588649";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, py + 8);
        ctx.lineTo(px, py - 8 - bounce);
        ctx.stroke();
        ctx.fillStyle = plot.watered ? "#72b259" : "#96ac64";
        ctx.beginPath();
        ctx.ellipse(px - 6, py - 10 - bounce, 7, plot.watered ? 6 : 4, -0.5, 0, Math.PI * 2);
        ctx.ellipse(px + 6, py - 10 - bounce, 7, plot.watered ? 6 : 4, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    practice.vegetable.planters.forEach((planter, index) => {
      const px = planter.x - cameraX;
      const py = planter.y - cameraY;
      drawEllipseShadow(px, py + 18, 20, 6, 0.1);
      drawRoundedRect(px - 22, py - 10, 44, 22, 6, "#8c6040");
      ctx.fillStyle = "rgba(104, 73, 48, 0.36)";
      ctx.fillRect(px - 17, py - 1, 34, 8);
      if (planter.planted) {
        const pop = Math.sin(planter.pop * Math.PI) * 4;
        ctx.strokeStyle = "#5b8b4b";
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py - 12 - pop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px - 4, py - 2);
        ctx.lineTo(px - 8, py - 10 - pop * 0.5);
        ctx.moveTo(px + 4, py - 1);
        ctx.lineTo(px + 8, py - 9 - pop * 0.5);
        ctx.stroke();
        ctx.fillStyle = planter.watered ? "#f3d98b" : "#7dc165";
        ctx.beginPath();
        ctx.arc(px - 5, py - 14 - pop * 0.4, 4 + planter.bloom * 2, 0, Math.PI * 2);
        ctx.arc(px + 5, py - 11 - pop * 0.3, 4 + planter.bloom * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  if (state.completedTasks.has("farmWork")) {
    const hoeX = practice.field.source.x - cameraX;
    const hoeY = practice.field.source.y - cameraY;
    drawEllipseShadow(hoeX + 2, hoeY + 14, 14, 4, 0.1);
    ctx.fillStyle = "#8d6e49";
    ctx.fillRect(hoeX - 4, hoeY - 18, 8, 28);
    ctx.fillStyle = "#d8bb7a";
    ctx.beginPath();
    ctx.moveTo(hoeX + 6, hoeY - 20);
    ctx.lineTo(hoeX + 22, hoeY - 18);
    ctx.lineTo(hoeX + 16, hoeY - 6);
    ctx.lineTo(hoeX + 6, hoeY - 8);
    ctx.closePath();
    ctx.fill();
    practice.field.rows.forEach((row) => {
      const cellWidth = row.w / row.cells.length;
      row.cells.forEach((cell, index) => {
        const x = row.x1 + index * cellWidth - cameraX;
        const y = row.y - cameraY;
        ctx.strokeStyle = cell > 0 ? "#d9bb7b" : "rgba(237, 215, 165, 0.18)";
        ctx.lineWidth = 7 + row.reaction * 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cellWidth - 5, y + 4);
        ctx.stroke();
      });
    });
    practice.field.sidePatches.forEach((patch) => {
      const px = patch.x - cameraX;
      const py = patch.y - cameraY;
      drawEllipseShadow(px, py + 16, 18, 5, 0.08);
      ctx.fillStyle = patch.tilled >= 1 ? "#8a5f3c" : "#6d472d";
      ctx.beginPath();
      ctx.ellipse(px, py + 6, 18, 10, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = patch.tilled >= 1 ? "#e1bf84" : "rgba(229, 201, 144, 0.22)";
      ctx.lineWidth = 2 + patch.reaction * 2;
      ctx.beginPath();
      ctx.moveTo(px - 12, py + 2);
      ctx.lineTo(px + 12, py + 6);
      ctx.stroke();
    });
  }

  if (state.completedTasks.has("raiseLivestock")) {
    const bagX = practice.barn.source.x - cameraX;
    const bagY = practice.barn.source.y - cameraY;
    drawEllipseShadow(bagX, bagY + 16, 15, 5, 0.1);
    drawCanvasFeedBag(ctx, bagX, bagY, {
      scale: 1,
      open: 0.72
    });
    practice.barn.troughs.forEach((trough) => {
      const tx = trough.x - cameraX;
      const ty = trough.y - cameraY;
      drawEllipseShadow(tx, ty + 16, 18, 5, 0.1);
      drawRoundedRect(tx - 18, ty - 12, 36, 22, 4, "#b8a15e");
      ctx.fillStyle = "#89b56d";
      ctx.fillRect(tx - 18, ty + 10 - 22 * trough.fill, 36, 22 * trough.fill);
      if (trough.reaction > 0) {
        ctx.strokeStyle = `rgba(255, 248, 235, ${trough.reaction * 0.35})`;
        ctx.lineWidth = 2 + trough.reaction * 2;
        ctx.strokeRect(tx - 22, ty - 16, 44, 30);
      }
    });
    practice.barn.feedSpots.forEach((spot) => {
      const sx = spot.x - cameraX;
      const sy = spot.y - cameraY;
      drawEllipseShadow(sx, sy + 14, 17, 5, 0.08);
      drawRoundedRect(sx - 18, sy - 8, 36, 16, 8, spot.visitor === "cat" ? "#b98f65" : "#b49b63");
      ctx.fillStyle = spot.visitor === "cat" ? "#6f5441" : "#8a6f3c";
      ctx.fillRect(sx - 14, sy - 1, 28, 5);
      if (spot.fill > 0.02) {
        ctx.fillStyle = "rgba(233, 210, 126, 0.86)";
        ctx.fillRect(sx - 13, sy + 3 - 8 * spot.fill, 26, 8 * spot.fill);
      }
      if (spot.visitor === "birds" && spot.fill > 0.16) {
        drawBirdGlyph(ctx, sx - 12, sy - 12, 0.45, "rgba(88, 95, 86, 0.26)");
        drawBirdGlyph(ctx, sx + 10, sy - 10, 0.36, "rgba(88, 95, 86, 0.2)");
      }
    });
  }

  if (state.completedTasks.has("catchFish")) {
    const rodX = practice.pond.source.x - cameraX;
    const rodY = practice.pond.source.y - cameraY;
    drawEllipseShadow(rodX + 4, rodY + 14, 20, 5, 0.1);
    drawRoundedRect(rodX - 18, rodY + 2, 20, 8, 4, "#7a5a3f");
    ctx.strokeStyle = "#8d6e49";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(rodX - 10, rodY + 8);
    ctx.quadraticCurveTo(rodX + 6, rodY - 26, rodX + 34, rodY - 44);
    ctx.stroke();
    ctx.strokeStyle = "rgba(244, 232, 210, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(rodX + 34, rodY - 44);
    ctx.lineTo(rodX + 44, rodY - 18);
    ctx.stroke();
    ctx.fillStyle = "#f7f0e2";
    ctx.beginPath();
    ctx.arc(rodX + 44, rodY - 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d46c4a";
    ctx.beginPath();
    ctx.arc(rodX + 44, rodY - 19, 4.1, Math.PI, 0);
    ctx.fill();

    const basketX = practice.pond.basket.x - cameraX;
    const basketY = practice.pond.basket.y - cameraY;
    drawEllipseShadow(basketX, basketY + 16, 20, 6, 0.12);
    drawCanvasBasket(ctx, basketX, basketY, {
      scale: 1,
      stored: practice.pond.basket.stored
    });

    practice.pond.fish.forEach((fish, index) => {
      if (fish.caught) {
        return;
      }
      const fx = fish.x - cameraX;
      const fy = fish.y - cameraY;
      drawCanvasFish(ctx, fx, fy, {
        scale: 1 + fish.panic * 0.08,
        lively: fish.panic,
        palette: index % 2 === 0 ? ["#fff5e9", "#f7d9a2", "#7ba9b8"] : ["#f8e5bb", "#f1b972", "#7aa7bc"]
      });
      if (fish.panic > 0.06) {
        drawWaterRipple(fx, fy + 8, 12 + fish.panic * 8, 0.12 * fish.panic);
      }
    });
    if (practice.pond.cast.timer > 0) {
      const castAlpha = practice.pond.cast.timer / 0.95;
      const castX = practice.pond.cast.x - cameraX;
      const castY = practice.pond.cast.y - cameraY;
      drawWaterRipple(castX, castY + 8, 14 + (1 - castAlpha) * 18, 0.12 * castAlpha);
      ctx.fillStyle = `rgba(247, 240, 226, ${0.72 * castAlpha})`;
      ctx.beginPath();
      ctx.arc(castX, castY + Math.sin(performance.now() / 180) * 1.6, 4.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(212, 108, 74, ${0.86 * castAlpha})`;
      ctx.beginPath();
      ctx.arc(castX, castY - 2 + Math.sin(performance.now() / 180) * 1.6, 4.4, Math.PI, 0);
      ctx.fill();
    }
    practice.pond.skimmers.forEach((skimmer, index) => {
      if (skimmer.cleared) {
        return;
      }
      const sx = skimmer.x - cameraX;
      const sy = skimmer.y - cameraY + Math.sin(performance.now() / 700 + skimmer.bob + index) * 3;
      drawWaterRipple(sx, sy + 4, 10 + skimmer.reaction * 4, 0.08 + skimmer.reaction * 0.08);
      if (skimmer.kind === "toy") {
        drawEllipseShadow(sx, sy + 10, 8, 3, 0.06);
        ctx.fillStyle = "#f6d98d";
        ctx.beginPath();
        ctx.arc(sx, sy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e08a5e";
        ctx.fillRect(sx - 3, sy - 8, 6, 5);
      } else {
        ctx.fillStyle = "#7aa45f";
        ctx.beginPath();
        ctx.ellipse(sx, sy, 10, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#9bcf75";
        ctx.beginPath();
        ctx.ellipse(sx - 2, sy - 1, 4, 2.4, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

function drawWorldPracticeHighlightLegacy() {
  if (!state.hoveredPractice) {
    return;
  }
  const { x, y } = worldToScreen(state.hoveredPractice.x, state.hoveredPractice.y);
  const pulse = Math.sin(performance.now() / 180) * 2;
  ctx.strokeStyle = "rgba(255, 247, 230, 0.72)";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x, y, 18 + pulse, 0, Math.PI * 2);
  ctx.stroke();
}

function isOnScreen(x, y, padding = 96) {
  return x > -padding && x < canvas.width + padding && y > -padding && y < canvas.height + padding;
}

function isWorldRectVisible(
  x,
  y,
  width,
  height,
  padding = 96,
  cameraX = state.camera.x,
  cameraY = state.camera.y
) {
  return (
    x + width >= cameraX - padding &&
    x <= cameraX + canvas.width + padding &&
    y + height >= cameraY - padding &&
    y <= cameraY + canvas.height + padding
  );
}

function getCanvasUiScale() {
  if (/^phone/.test(state.device?.id ?? "")) {
    const viewportWidth = Math.max(state.device.viewportWidth, 1);
    return clamp(canvas.width / viewportWidth, 1.36, 2.5);
  }
  if (state.device?.id === "tablet") {
    return state.device.isPortrait ? 1.28 : 1.12;
  }
  return 1;
}

function getWorldHudSafeRect() {
  const uiScale = getCanvasUiScale();
  const isPhone = /^phone/.test(state.device?.id ?? "");
  const isTablet = state.device?.id === "tablet";
  if (isPhone) {
    return {
      left: 32 * uiScale,
      right: canvas.width - 32 * uiScale,
      top: 66 * uiScale,
      bottom: canvas.height - 60 * uiScale
    };
  }

  const viewportScale = canvas.width / Math.max(state.device?.viewportWidth ?? canvas.width, 1);
  const touchReserve = state.device?.isTouch
    ? Math.max(state.device.touchActionHeight, state.device.touchButtonSize * 2.2) + 18
    : 0;
  return {
    left: 42,
    right: canvas.width - 42,
    top: isTablet ? 76 : 42,
    bottom: canvas.height - (isTablet ? Math.max(54, touchReserve * viewportScale + 18) : 42)
  };
}

function isInsideWorldHudSafeRect(x, y, rect = getWorldHudSafeRect()) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function getInteractionPalette(kind = "default") {
  if (kind === "dialogue") {
    return {
      glow: "rgba(255, 214, 157, 0.28)",
      ring: "rgba(255, 231, 198, 0.92)",
      outer: "rgba(155, 97, 58, 0.46)",
      dot: "#fff7ea",
      text: "#fff8ed"
    };
  }
  if (kind === "story") {
    return {
      glow: "rgba(255, 196, 146, 0.28)",
      ring: "rgba(255, 226, 194, 0.88)",
      outer: "rgba(181, 101, 63, 0.42)",
      dot: "#fff5e8",
      text: "#fff7ee"
    };
  }
  if (kind === "mood") {
    return {
      glow: "rgba(140, 198, 205, 0.26)",
      ring: "rgba(212, 247, 249, 0.88)",
      outer: "rgba(77, 125, 130, 0.4)",
      dot: "#f0ffff",
      text: "#f4ffff"
    };
  }
  if (kind === "delivery" || kind === "station") {
    return {
      glow: "rgba(205, 189, 149, 0.26)",
      ring: "rgba(244, 236, 214, 0.9)",
      outer: "rgba(120, 92, 54, 0.42)",
      dot: "#fff9ef",
      text: "#fff8ef"
    };
  }
  if (kind === "tool") {
    return {
      glow: "rgba(232, 213, 155, 0.24)",
      ring: "rgba(255, 244, 210, 0.9)",
      outer: "rgba(122, 98, 60, 0.42)",
      dot: "#fff9ee",
      text: "#fff9ef"
    };
  }
  if (kind === "work" || kind === "task") {
    return {
      glow: "rgba(160, 213, 154, 0.24)",
      ring: "rgba(230, 255, 226, 0.9)",
      outer: "rgba(74, 117, 69, 0.42)",
      dot: "#f5fff3",
      text: "#f6fff4"
    };
  }
  if (kind === "nature") {
    return {
      glow: "rgba(186, 219, 161, 0.24)",
      ring: "rgba(240, 255, 228, 0.9)",
      outer: "rgba(88, 126, 71, 0.42)",
      dot: "#f8fff1",
      text: "#f8fff2"
    };
  }
  if (kind === "quiz") {
    return {
      glow: "rgba(236, 198, 126, 0.24)",
      ring: "rgba(255, 245, 214, 0.92)",
      outer: "rgba(133, 96, 48, 0.44)",
      dot: "#fff8eb",
      text: "#fff8ef"
    };
  }
  return {
    glow: "rgba(255, 220, 172, 0.24)",
    ring: "rgba(255, 242, 218, 0.9)",
    outer: "rgba(116, 93, 67, 0.42)",
    dot: "#fff8ef",
    text: "#fff8ef"
  };
}

function drawInteractionTag(x, y, label, keycap, palette, compact = false) {
  const text = label || "";
  const keyText = keycap || "";
  const uiScale = getCanvasUiScale();
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(uiScale, uiScale);
  ctx.font = `${compact ? 11 : 12}px "Gowun Dodum", sans-serif`;
  const labelWidth = text ? Math.max(compact ? 44 : 52, ctx.measureText(text).width + (compact ? 14 : 18)) : 0;
  const keyWidth = keyText ? (compact ? 22 : 24) : 0;
  const gap = keyWidth && labelWidth ? 6 : 0;
  const totalWidth = Math.max(keyWidth + gap + labelWidth, keyWidth || labelWidth);
  const left = -totalWidth / 2;
  const tagY = -(compact ? 38 : 46);
  const keyY = tagY + (compact ? 2 : 3);

  ctx.strokeStyle = "rgba(255, 250, 239, 0.24)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, tagY + 22);
  ctx.stroke();

  if (keyWidth) {
    drawRoundedRect(left, keyY, keyWidth, compact ? 18 : 20, 8, "rgba(29, 35, 25, 0.86)");
    strokeRoundedRect(left, keyY, keyWidth, compact ? 18 : 20, 8, palette.ring, 1.2);
    ctx.fillStyle = palette.text;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(keyText, left + keyWidth / 2, keyY + (compact ? 9 : 10));
  }

  if (labelWidth) {
    const labelX = left + keyWidth + gap;
    drawRoundedRect(labelX, tagY, labelWidth, compact ? 22 : 24, 12, "rgba(28, 37, 27, 0.82)");
    strokeRoundedRect(labelX, tagY, labelWidth, compact ? 22 : 24, 12, palette.outer, 1.4);
    ctx.fillStyle = palette.text;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, labelX + labelWidth / 2, tagY + (compact ? 11 : 12));
  }
  ctx.restore();
}

function drawInteractionBeacon(x, y, options = {}) {
  const palette = options.palette ?? getInteractionPalette();
  const phoneMarkerScale = /^phone/.test(state.device?.id ?? "")
    ? clamp(getCanvasUiScale() / 1.36, 1, 1.5)
    : 1;
  const size = (options.size ?? 11) * phoneMarkerScale;
  const subtle = options.subtle ?? false;
  const showTag = options.showTag ?? false;
  const label = options.label ?? "";
  const keycap = options.keycap ?? "";
  const phase =
    (state.device?.prefersReducedMotion ? 0 : performance.now() / (subtle ? 280 : 210)) +
    x * 0.008 +
    y * 0.006;
  const pulse = Math.sin(phase);
  const rise = subtle ? 1.5 : 2.4;
  const markerY = y - 10 + pulse * rise;

  drawScaledGlow(
    ctx,
    x,
    markerY,
    size * (subtle ? 2.2 : 2.8),
    size * (subtle ? 1.5 : 1.85),
    palette.glow,
    "rgba(255,255,255,0)",
    -0.14
  );

  if (!subtle) {
    ctx.strokeStyle = "rgba(31, 42, 28, 0.42)";
    ctx.lineWidth = 4.6;
    ctx.beginPath();
    ctx.arc(x, markerY, size + 4 + pulse * 0.45, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.save();
  ctx.setLineDash(subtle ? [4, 8] : [6, 6]);
  ctx.strokeStyle = subtle ? palette.outer : palette.ring;
  ctx.lineWidth = subtle ? 1.15 : 1.9;
  ctx.beginPath();
  ctx.arc(x, markerY, size + 4 + pulse * 0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = subtle ? palette.ring : palette.outer;
  ctx.lineWidth = subtle ? 1.2 : 2;
  ctx.beginPath();
  ctx.arc(x, markerY, size + pulse * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = subtle ? palette.outer : palette.ring;
  ctx.beginPath();
  ctx.arc(x, markerY, subtle ? 3.5 : 5.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.dot;
  ctx.beginPath();
  ctx.arc(x, markerY, subtle ? 1.2 : 1.8, 0, Math.PI * 2);
  ctx.fill();

  if (showTag && (label || keycap)) {
    drawInteractionTag(x, markerY, label, keycap, palette, subtle);
  }
}

function drawWorldPracticeHighlight() {
  const targets = buildWorldPracticeTargets();
  if (!targets.length) {
    return;
  }
  const focusedId = state.hoveredPractice?.id ?? null;
  const nearbyTargetIds = new Set(
    targets
      .filter((target) => target.kind !== "nature")
      .sort((left, right) => left.distance - right.distance)
      .slice(0, 2)
      .map((target) => target.id)
  );

  targets.forEach((target) => {
    const isNature = target.kind === "nature";
    const isFocused = target.id === focusedId;
    if (isNature) {
      if (!isFocused || target.distance > Math.min(target.radius, 44)) {
        return;
      }
    } else if (!nearbyTargetIds.has(target.id) && !isFocused) {
      return;
    }
    const { x, y } = worldToScreen(target.x, target.y);
    if (!isOnScreen(x, y, 140)) {
      return;
    }
    const showNatureKeycap = isNature && isFocused && target.distance < Math.min(target.radius * 0.58, 24);
    const emphasized = isFocused && !isNature;
    const showNatureTag = showNatureKeycap && state.device?.isTouch;
    drawInteractionBeacon(x, y, {
      palette: getInteractionPalette(target.kind),
      size: isNature ? 5.6 : emphasized ? 15 : target.kind === "work" ? 8.5 : 10.5,
      subtle: isNature ? true : !emphasized,
      label: emphasized || showNatureTag ? target.label : "",
      keycap: state.device?.isTouch ? "" : emphasized || showNatureKeycap ? "E" : "",
      showTag: emphasized || showNatureKeycap
    });
  });
}

function drawWorld() {
  const cameraX = state.camera.x;
  const cameraY = state.camera.y;

  drawWorldGroundFloor(cameraX, cameraY);
  drawScaledGlow(ctx, 356 - cameraX, 316 - cameraY, 340, 220, "rgba(216, 232, 176, 0.3)", "rgba(216, 232, 176, 0)", -0.08);
  drawScaledGlow(ctx, 890 - cameraX, 252 - cameraY, 234, 130, "rgba(208, 224, 158, 0.22)", "rgba(208, 224, 158, 0)", 0.04);
  drawScaledGlow(ctx, 1108 - cameraX, 572 - cameraY, 228, 188, "rgba(118, 80, 50, 0.18)", "rgba(118, 80, 50, 0)", 0.02);
  drawScaledGlow(ctx, 686 - cameraX, 936 - cameraY, 242, 150, "rgba(121, 89, 52, 0.16)", "rgba(121, 89, 52, 0)", -0.04);
  drawScaledGlow(ctx, 1546 - cameraX, 986 - cameraY, 248, 162, "rgba(136, 171, 130, 0.22)", "rgba(136, 171, 130, 0)", 0);
  drawScaledGlow(ctx, 1536 - cameraX, 442 - cameraY, 198, 126, "rgba(206, 188, 142, 0.2)", "rgba(206, 188, 142, 0)", -0.12);
  drawWorldRegionLayer(cameraX, cameraY);
  drawVillageRoadBase(cameraX, cameraY);
  drawRoadTexture(cameraX, cameraY);
  drawFenceSegment(292 - cameraX, 546 - cameraY, 626 - cameraX, 546 - cameraY);
  drawFenceSegment(1074 - cameraX, 730 - cameraY, 1288 - cameraX, 730 - cameraY);
  drawFenceSegment(524 - cameraX, 1048 - cameraY, 848 - cameraX, 1048 - cameraY);

  drawSteppingStones(
    [
      [214 - cameraX, 1020 - cameraY, 18, 10, -0.08],
      [232 - cameraX, 972 - cameraY, 20, 11, 0.1],
      [252 - cameraX, 926 - cameraY, 18, 10, -0.06],
      [274 - cameraX, 876 - cameraY, 17, 9, 0.08],
      [294 - cameraX, 830 - cameraY, 16, 9, -0.04]
    ],
    "#d7c39f"
  );
  drawPebbleCluster(1464 - cameraX, 1052 - cameraY, 7, 32, 18, ["rgba(231, 222, 188, 0.34)", "rgba(136, 127, 104, 0.16)"]);
  drawPebbleCluster(1668 - cameraX, 932 - cameraY, 6, 24, 14, ["rgba(231, 222, 188, 0.28)", "rgba(136, 127, 104, 0.14)"]);
  drawGrassTexture(54 - cameraX, 70 - cameraY, 580, 460, 42);
  drawGrassTexture(704 - cameraX, 134 - cameraY, 350, 228, 26);

  drawHouse(cameraX, cameraY);
  drawBarn(cameraX, cameraY);
  drawVegetablePatch(cameraX, cameraY);
  drawField(cameraX, cameraY);
  drawPond(cameraX, cameraY);
  drawWorldPracticeObjects(cameraX, cameraY);
  drawQuizSigns(cameraX, cameraY);
  drawTrees(cameraX, cameraY);
  drawReactiveVillageLife(cameraX, cameraY);
  drawNoticeBoard(cameraX, cameraY);
  drawDinnerTable(cameraX, cameraY);
  drawNpc(cameraX, cameraY, 220, 1180, "#b95f3a");
  if (state.storyIndex >= 2) {
    drawNpc(cameraX, cameraY, 452, 476, "#b9744b");
  }
  drawNpc(cameraX, cameraY, 1390, 896, "#5c77a8");
  drawBench(cameraX, cameraY);
}

function drawHouse(cameraX, cameraY) {
  const x = 250 - cameraX;
  const y = 140 - cameraY;
  if (!isOnScreen(x + 120, y + 112, 260)) {
    return;
  }
  const windowPalette = getWindowPalette();
  drawScaledGlow(ctx, x + 118, y + 194, 168, 82, "rgba(255, 244, 224, 0.16)", "rgba(255, 244, 224, 0)", -0.12);
  drawEllipseShadow(x + 124, y + 222, 122, 24, 0.16);
  drawRoundedRect(x, y + 56, 240, 160, 18, "#f8f0dc");
  strokeRoundedRect(x, y + 56, 240, 160, 18, "rgba(122, 89, 60, 0.16)", 2);
  ctx.fillStyle = "rgba(172, 145, 120, 0.22)";
  ctx.fillRect(x + 6, y + 198, 228, 18);
  ctx.fillStyle = "#b56c46";
  ctx.beginPath();
  ctx.moveTo(x - 12, y + 66);
  ctx.lineTo(x + 120, y - 12);
  ctx.lineTo(x + 252, y + 66);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(102, 54, 40, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 120, y - 12);
  ctx.lineTo(x + 120, y + 66);
  ctx.stroke();
  for (let index = 0; index < 7; index += 1) {
    ctx.strokeStyle = "rgba(252, 215, 192, 0.16)";
    ctx.beginPath();
    ctx.moveTo(x + 12 + index * 32, y + 58 - Math.abs(3 - index) * 8);
    ctx.lineTo(x + 36 + index * 32, y + 58 - Math.abs(3 - index) * 8);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(124, 76, 56, 0.12)";
  ctx.lineWidth = 2;
  for (let panel = 0; panel < 4; panel += 1) {
    ctx.beginPath();
    ctx.moveTo(x + 18 + panel * 56, y + 70);
    ctx.lineTo(x + 18 + panel * 56, y + 212);
    ctx.stroke();
  }

  ctx.fillStyle = "#9d5b39";
  ctx.fillRect(x + 92, y + 124, 54, 92);
  ctx.fillStyle = "#c68660";
  ctx.fillRect(x + 114, y + 124, 8, 92);
  ctx.fillStyle = windowPalette.glass;
  ctx.fillRect(x + 36, y + 98, 48, 42);
  ctx.fillRect(x + 160, y + 98, 48, 42);
  ctx.strokeStyle = windowPalette.frame;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 36, y + 98, 48, 42);
  ctx.strokeRect(x + 160, y + 98, 48, 42);
  ctx.strokeStyle = windowPalette.streak;
  ctx.beginPath();
  ctx.moveTo(x + 42, y + 104);
  ctx.lineTo(x + 62, y + 122);
  ctx.moveTo(x + 166, y + 104);
  ctx.lineTo(x + 186, y + 122);
  ctx.stroke();
  ctx.fillStyle = "#8b6342";
  ctx.fillRect(x + 28, y + 94, 4, 50);
  ctx.fillRect(x + 84, y + 94, 4, 50);
  ctx.fillRect(x + 152, y + 94, 4, 50);
  ctx.fillRect(x + 208, y + 94, 4, 50);
  ctx.fillStyle = "#8b6342";
  ctx.fillRect(x + 76, y + 210, 94, 12);
  ctx.fillRect(x + 80, y + 216, 8, 14);
  ctx.fillRect(x + 158, y + 216, 8, 14);
  ctx.fillRect(x + 100, y + 210, 6, 22);
  ctx.fillRect(x + 140, y + 210, 6, 22);
  ctx.fillStyle = "#b56c46";
  ctx.fillRect(x + 184, y + 34, 20, 38);
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(x + 188, y + 24, 12, 12);
  ctx.fillStyle = "#dbc8a7";
  ctx.fillRect(x + 106, y + 224, 24, 10);
  ctx.fillRect(x + 96, y + 234, 44, 8);
  drawSteppingStones(
    [
      [x + 120, y + 254, 16, 9, 0.1],
      [x + 110, y + 282, 14, 8, -0.08],
      [x + 100, y + 310, 13, 8, 0.06]
    ],
    "#d6c29e",
    0.09
  );

  const gardenColor = state.completedTasks.has("gardenCare") ? "#d37e66" : "#8f7d59";
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = gardenColor;
    ctx.beginPath();
    ctx.arc(x + 46 + i * 34, y + 214 + Math.sin(i) * 4, 10 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(94, 132, 75, 0.18)";
  ctx.beginPath();
  ctx.ellipse(x + 38, y + 228, 18, 9, -0.2, 0, Math.PI * 2);
  ctx.ellipse(x + 202, y + 230, 22, 11, 0.12, 0, Math.PI * 2);
  ctx.fill();
  drawFenceSegment(x + 10, y + 236, x + 228, y + 236);
  drawFlowerCluster(x + 52, y + 210, ["#f1b56b", "#d66f63", "#f7e7a2"]);
  drawFlowerCluster(x + 116, y + 216, ["#d66f63", "#f7d6e0", "#f1b56b"]);
  drawFlowerCluster(x + 184, y + 212, ["#a0c46d", "#f7d6e0", "#f1b56b"]);
}

function drawBarn(cameraX, cameraY) {
  const x = 1380 - cameraX;
  const y = 340 - cameraY;
  if (!isOnScreen(x + 115, y + 102, 250)) {
    return;
  }
  const windowPalette = getWindowPalette();
  drawScaledGlow(ctx, x + 116, y + 188, 168, 86, "rgba(237, 211, 170, 0.14)", "rgba(237, 211, 170, 0)", -0.06);
  drawEllipseShadow(x + 112, y + 206, 108, 24, 0.16);
  drawRoundedRect(x, y + 50, 230, 150, 16, "#d48a5c");
  strokeRoundedRect(x, y + 50, 230, 150, 16, "rgba(101, 58, 39, 0.2)", 2);
  ctx.fillStyle = "rgba(115, 65, 44, 0.12)";
  ctx.fillRect(x + 10, y + 60, 210, 134);
  ctx.fillStyle = "#8c4b33";
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 52);
  ctx.lineTo(x + 116, y - 18);
  ctx.lineTo(x + 240, y + 52);
  ctx.closePath();
  ctx.fill();
  for (let index = 0; index < 6; index += 1) {
    ctx.strokeStyle = "rgba(244, 203, 182, 0.16)";
    ctx.beginPath();
    ctx.moveTo(x + 18 + index * 36, y + 54 - Math.abs(3 - index) * 7);
    ctx.lineTo(x + 42 + index * 36, y + 54 - Math.abs(3 - index) * 7);
    ctx.stroke();
  }
  ctx.fillStyle = mixColor("#f2dfbd", "#f5d48c", getLanternGlowAmount());
  ctx.fillRect(x + 94, y + 58, 36, 26);
  ctx.strokeStyle = windowPalette.frame;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 94, y + 58, 36, 26);
  ctx.beginPath();
  ctx.moveTo(x + 112, y + 58);
  ctx.lineTo(x + 112, y + 84);
  ctx.moveTo(x + 94, y + 71);
  ctx.lineTo(x + 130, y + 71);
  ctx.stroke();
  ctx.fillStyle = "#f5e8c7";
  ctx.fillRect(x + 82, y + 102, 60, 98);
  ctx.strokeStyle = "rgba(120, 85, 50, 0.28)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 82, y + 102);
  ctx.lineTo(x + 142, y + 200);
  ctx.moveTo(x + 142, y + 102);
  ctx.lineTo(x + 82, y + 200);
  ctx.stroke();
  for (let index = 0; index < 5; index += 1) {
    ctx.strokeStyle = "rgba(255, 240, 208, 0.15)";
    ctx.beginPath();
    ctx.moveTo(x + 18, y + 74 + index * 24);
    ctx.lineTo(x + 212, y + 74 + index * 24);
    ctx.stroke();
  }
  ctx.fillStyle = "#7a5739";
  ctx.fillRect(x + 24, y + 96, 8, 100);
  ctx.fillRect(x + 196, y + 96, 8, 100);

  ctx.fillStyle = state.completedTasks.has("raiseLivestock") ? "#89b56d" : "#b8a15e";
  ctx.fillRect(x + 18, y + 164, 42, 14);
  ctx.fillRect(x + 166, y + 164, 42, 14);
  drawRoundedRect(x + 148, y + 176, 48, 18, 6, "rgba(198, 179, 112, 0.62)");
  drawRoundedRect(x + 160, y + 192, 42, 16, 6, "rgba(186, 168, 102, 0.48)");
  drawRoundedRect(x + 26, y + 176, 32, 16, 6, "rgba(194, 177, 107, 0.44)");
  drawFenceSegment(x + 6, y + 206, x + 222, y + 206);

  drawAnimal(x + 42, y + 220, "#e9e5de");
  drawAnimal(x + 192, y + 214, "#ddd0a2");
}

function drawAnimal(x, y, color) {
  drawEllipseShadow(x + 4, y + 16, 20, 6, 0.12);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 251, 244, 0.34)";
  ctx.beginPath();
  ctx.ellipse(x + 5, y - 3, 7, 4.6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 16, y - 8, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 10, y - 13);
  ctx.lineTo(x + 13, y - 20);
  ctx.lineTo(x + 16, y - 14);
  ctx.closePath();
  ctx.moveTo(x + 19, y - 13);
  ctx.lineTo(x + 22, y - 20);
  ctx.lineTo(x + 25, y - 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#6d5443";
  ctx.beginPath();
  ctx.arc(x + 20, y - 10, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#d8874f";
  ctx.beginPath();
  ctx.moveTo(x + 26, y - 8);
  ctx.lineTo(x + 33, y - 5);
  ctx.lineTo(x + 26, y - 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#806048";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 8);
  ctx.lineTo(x - 6, y + 15);
  ctx.moveTo(x + 2, y + 8);
  ctx.lineTo(x + 1, y + 15);
  ctx.stroke();
}

function drawVegetablePatch(cameraX, cameraY) {
  const x = 930 - cameraX;
  const y = 420 - cameraY;
  if (!isOnScreen(x + 180, y + 150, 300)) {
    return;
  }
  drawScaledGlow(ctx, x + 182, y + 150, 214, 138, "rgba(122, 84, 52, 0.16)", "rgba(122, 84, 52, 0)", 0.02);
  drawEllipseShadow(x + 180, y + 314, 170, 28, 0.14);
  const soilGradient = ctx.createLinearGradient(x, y, x, y + 300);
  soilGradient.addColorStop(0, "#7a5536");
  soilGradient.addColorStop(1, "#684428");
  ctx.fillStyle = soilGradient;
  ctx.fillRect(x, y, 360, 300);
  strokeRoundedRect(x, y, 360, 300, 18, "rgba(43, 27, 15, 0.25)", 2);
  ctx.fillStyle = "#92724f";
  ctx.fillRect(x - 8, y - 8, 376, 12);
  ctx.fillRect(x - 8, y + 296, 376, 12);
  ctx.fillRect(x - 8, y, 12, 300);
  ctx.fillRect(x + 356, y, 12, 300);
  drawCropRidges(x + 4, y + 2, 352, 290, 5, "#7b5535", "#6e482f");
  ctx.fillStyle = "rgba(205, 182, 132, 0.18)";
  ctx.fillRect(x + 164, y + 8, 26, 284);
  drawRoundedRect(x + 130, y + 24, 26, 18, 6, "rgba(154, 120, 74, 0.66)");
  drawRoundedRect(x + 214, y + 252, 28, 20, 6, "rgba(154, 120, 74, 0.62)");
  drawRoundedRect(x + 248, y + 250, 24, 18, 6, "rgba(186, 153, 103, 0.54)");
  drawFenceSegment(x - 22, y + 14, x - 22, y + 284);
  drawFenceSegment(x + 382, y + 14, x + 382, y + 284);

  if (state.completedTasks.has("vegetablePlant")) {
    for (let i = 0; i < 12; i += 1) {
      const px = x + 40 + (i % 4) * 80;
      const py = y + 46 + Math.floor(i / 4) * 80;
      drawSprout(px, py, state.completedTasks.has("vegetableGrow"), VEGETABLE_ASSETS[i % VEGETABLE_ASSETS.length]);
    }
  }

  drawVillageWell(state.worldPractice.vegetable.well.x - cameraX, state.worldPractice.vegetable.well.y - cameraY);
}

function drawVillageWell(x, y) {
  const shimmer = Math.sin(performance.now() / 420) * 0.5 + 0.5;
  drawScaledGlow(ctx, x, y - 2, 54, 38, "rgba(159, 203, 218, 0.16)", "rgba(159, 203, 218, 0)", 0);
  drawEllipseShadow(x, y + 26, 34, 9, 0.14);
  ctx.fillStyle = "rgba(160, 147, 121, 0.42)";
  ctx.beginPath();
  ctx.ellipse(x, y + 24, 38, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#a68b6d";
  ctx.beginPath();
  ctx.moveTo(x - 30, y + 8);
  ctx.lineTo(x - 12, y + 18);
  ctx.lineTo(x + 24, y + 18);
  ctx.lineTo(x + 34, y + 6);
  ctx.lineTo(x + 18, y - 4);
  ctx.lineTo(x - 18, y - 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#836346";
  ctx.fillRect(x - 28, y + 8, 56, 14);
  ctx.fillStyle = "#6f4f32";
  ctx.fillRect(x - 31, y + 8, 3, 18);
  ctx.fillRect(x + 28, y + 8, 3, 18);

  ctx.fillStyle = "#c7b299";
  ctx.beginPath();
  ctx.ellipse(x, y + 6, 26, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#9d8267";
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 26, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#7bbfd2";
  ctx.beginPath();
  ctx.ellipse(x, y + 7, 17, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(232, 248, 255, ${0.22 + shimmer * 0.16})`;
  ctx.beginPath();
  ctx.ellipse(x - 4, y + 4, 8, 3, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8b6747";
  ctx.fillRect(x - 21, y - 30, 7, 42);
  ctx.fillRect(x + 14, y - 30, 7, 42);
  drawRoundedRect(x - 26, y - 38, 52, 8, 4, "#735235");

  ctx.strokeStyle = "rgba(250, 241, 224, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 8, y + 4);
  ctx.lineTo(x + 10, y + 4);
  ctx.stroke();

  ctx.strokeStyle = "#5e4028";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x + 1, y - 34);
  ctx.lineTo(x + 1, y - 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 1, y - 36, 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#6d5443";
  ctx.beginPath();
  ctx.arc(x + 12, y - 36, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(244, 236, 222, 0.84)";
  for (let stone = 0; stone < 4; stone += 1) {
    const stoneX = x - 26 + stone * 18;
    ctx.beginPath();
    ctx.ellipse(stoneX, y + 26 + (stone % 2 === 0 ? 2 : -1), 5.5, 3.5, 0.12 * stone, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSprout(x, y, grown, asset = null) {
  void asset;
  ctx.strokeStyle = "#588649";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 10);
  ctx.lineTo(x, y - 8);
  ctx.stroke();
  ctx.fillStyle = grown ? "#74b159" : "#9cc56c";
  ctx.beginPath();
  ctx.ellipse(x - 6, y - 10, 8, grown ? 6 : 4, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 6, y - 10, 8, grown ? 6 : 4, 0.5, 0, Math.PI * 2);
  ctx.fill();
  if (grown) {
    ctx.fillStyle = "#f1be54";
    ctx.beginPath();
    ctx.arc(x, y - 18, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawField(cameraX, cameraY) {
  const x = 520 - cameraX;
  const y = 820 - cameraY;
  if (!isOnScreen(x + 165, y + 110, 240)) {
    return;
  }
  drawScaledGlow(ctx, x + 164, y + 110, 190, 112, "rgba(130, 95, 58, 0.16)", "rgba(130, 95, 58, 0)", -0.04);
  drawEllipseShadow(x + 164, y + 232, 160, 22, 0.16);
  const fieldGradient = ctx.createLinearGradient(x, y, x, y + 220);
  fieldGradient.addColorStop(0, state.completedTasks.has("farmWork") ? "#8d6a3c" : "#775230");
  fieldGradient.addColorStop(1, state.completedTasks.has("farmWork") ? "#76562f" : "#654327");
  ctx.fillStyle = fieldGradient;
  ctx.fillRect(x, y, 330, 220);
  strokeRoundedRect(x, y, 330, 220, 18, "rgba(66, 45, 24, 0.18)", 2);
  drawCropRidges(x + 6, y + 10, 318, 188, 6, "#7c5a34", "#704c2b");
  ctx.strokeStyle = "rgba(237, 215, 165, 0.24)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x + 26, y + 30 + i * 36);
    ctx.lineTo(x + 304, y + 50 + i * 36);
    ctx.stroke();
  }
  ctx.fillStyle = "#92724f";
  ctx.fillRect(x - 8, y - 8, 346, 12);
  ctx.fillRect(x - 8, y + 216, 346, 12);
  drawRoundedRect(x + 18, y + 186, 26, 16, 6, "rgba(198, 176, 114, 0.54)");
  drawRoundedRect(x + 46, y + 194, 22, 14, 6, "rgba(185, 164, 102, 0.46)");
}

function drawPond(cameraX, cameraY) {
  const x = 1380 - cameraX;
  const y = 860 - cameraY;
  if (!isOnScreen(x + 160, y + 116, 240)) {
    return;
  }
  const { current, next, blend } = getCurrentDayBlendInfo();
  const waterStops = [
    { inner: "#97cbd2", outer: "#5f9dac" },
    { inner: "#8fc8d2", outer: "#5894a7" },
    { inner: "#82bdc9", outer: "#51899e" },
    { inner: "#87b2bd", outer: "#526f89" },
    { inner: "#728fa8", outer: "#405b79" }
  ];
  drawScaledGlow(ctx, x + 160, y + 122, 196, 144, "rgba(192, 210, 170, 0.16)", "rgba(192, 210, 170, 0)", 0);
  drawEllipseShadow(x + 160, y + 226, 138, 22, 0.1);
  ctx.fillStyle = "rgba(192, 175, 124, 0.34)";
  ctx.beginPath();
  ctx.ellipse(x + 160, y + 118, 170, 124, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(112, 142, 96, 0.34)";
  ctx.beginPath();
  ctx.ellipse(x + 160, y + 116, 166, 120, 0, 0, Math.PI * 2);
  ctx.fill();
  const pondGradient = ctx.createRadialGradient(x + 150, y + 118, 22, x + 160, y + 116, 164);
  pondGradient.addColorStop(0, mixColor(waterStops[current].inner, waterStops[next].inner, blend));
  pondGradient.addColorStop(1, mixColor(waterStops[current].outer, waterStops[next].outer, blend));
  ctx.fillStyle = pondGradient;
  ctx.beginPath();
  ctx.ellipse(x + 160, y + 116, 158, 112, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x + 160, y + 116, 156, 110, 0, 0, Math.PI * 2);
  ctx.clip();
  const rippleMotion = state.device?.prefersReducedMotion ? 0 : performance.now() / 900;
  for (let band = 0; band < 3; band += 1) {
    const bandY = y + 72 + band * 40 + Math.sin(rippleMotion + band * 1.7) * 3;
    ctx.strokeStyle = band % 2 === 0 ? "rgba(235, 248, 244, 0.2)" : "rgba(57, 105, 126, 0.16)";
    ctx.lineWidth = state.device?.id === "phone-low" ? 3.2 : 2.2;
    ctx.beginPath();
    ctx.moveTo(x + 34, bandY);
    ctx.bezierCurveTo(x + 98, bandY - 10, x + 214, bandY + 12, x + 292, bandY - 3);
    ctx.stroke();
  }
  const moonReflection = getNightAmount();
  if (moonReflection > 0.2) {
    const reflection = ctx.createLinearGradient(x + 190, y + 44, x + 162, y + 204);
    reflection.addColorStop(0, `rgba(226, 235, 255, ${(0.16 * moonReflection).toFixed(3)})`);
    reflection.addColorStop(0.56, `rgba(226, 235, 255, ${(0.08 * moonReflection).toFixed(3)})`);
    reflection.addColorStop(1, "rgba(226, 235, 255, 0)");
    ctx.fillStyle = reflection;
    ctx.beginPath();
    ctx.moveTo(x + 196, y + 48);
    ctx.lineTo(x + 228, y + 48);
    ctx.lineTo(x + 190, y + 204);
    ctx.lineTo(x + 138, y + 204);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.ellipse(x + 190, y + 90, 58, 18, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 104, y + 144, 36, 12, -0.2, 0, Math.PI * 2);
  ctx.fill();
  drawWaterRipple(x + 150, y + 156, 42, 0.1);
  drawWaterRipple(x + 218, y + 130, 24, 0.12);
  drawPebbleCluster(x + 48, y + 176, 6, 24, 12, ["rgba(238, 228, 196, 0.34)", "rgba(135, 125, 104, 0.18)"]);
  drawPebbleCluster(x + 256, y + 186, 5, 20, 10, ["rgba(238, 228, 196, 0.28)", "rgba(135, 125, 104, 0.16)"]);
  for (let index = 0; index < 5; index += 1) {
    drawReed(x + 40 + index * 18, y + 188 + (index % 2) * 6, 26 + (index % 3) * 6, -0.22);
    drawReed(x + 248 + index * 12, y + 178 + (index % 2) * 8, 24 + (index % 2) * 6, 0.22);
  }
  ctx.fillStyle = "#7aa45f";
  ctx.beginPath();
  ctx.arc(x + 112, y + 102, 10, 0, Math.PI * 2);
  ctx.arc(x + 210, y + 170, 8, 0, Math.PI * 2);
  ctx.fill();

  if (state.completedTasks.has("catchFish")) {
    ctx.fillStyle = "#fff9ef";
    ctx.beginPath();
    ctx.arc(x + 146, y + 116, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

const STATIC_TREE_POSITIONS = [
  [580, 146],
  [640, 210],
  [905, 126],
  [1295, 164],
  [1788, 330],
  [1840, 1010],
  [1250, 1230],
  [418, 1230],
  [894, 1178]
];

const STATIC_TREE_PALETTES = [
  { base: "#5c8d4c", accent: "#7fb067", trunk: "#7a5637" },
  { base: "#729f57", accent: "#8fbc73", trunk: "#6e5035" },
  { base: "#4f7d43", accent: "#79a564", trunk: "#6b4e33" }
];

function drawTrees(cameraX, cameraY) {
  STATIC_TREE_POSITIONS.forEach(([x, y], index) => {
    const sx = x - cameraX;
    const sy = y - cameraY;
    if (!isOnScreen(sx, sy + 24, 110)) {
      return;
    }
    const palette = STATIC_TREE_PALETTES[index % STATIC_TREE_PALETTES.length];
    drawTreeShape(sx, sy, 20 + (index % 3) * 3, 22 + (index % 2) * 4, palette, index, TREE_ASSETS[index % TREE_ASSETS.length]);
    if (index % 3 === 0) {
      drawFlowerCluster(sx - 6, sy + 2, ["#f7d6e0", "#f1b56b", "#f4f0d0"]);
    }
  });
}

function getWindowPalette() {
  const glowAmount = getLanternGlowAmount();
  return {
    glass: mixColor("#c9dfe8", "#f6d79b", glowAmount),
    frame: mixColor("rgba(90, 116, 135, 0.4)", "rgba(143, 98, 57, 0.35)", glowAmount),
    streak: mixColor("rgba(255,255,255,0.55)", "rgba(255, 244, 214, 0.34)", glowAmount)
  };
}

function drawWorldPersonFigure(x, y, options = {}) {
  const {
    bodyColor = "#c15f3f",
    accentColor = "#f4e8cf",
    hatColor = "#6a8e5a",
    skinColor = "#f8efe1",
    facing = "down",
    stride = 0,
    bob = 0,
    scale = 1,
    style = "villager"
  } = options;
  const dirX = facing === "left" ? -1 : facing === "right" ? 1 : 0;
  const dirY = facing === "up" ? -1 : facing === "down" ? 1 : 0;
  const stepLift = stride * 4 * scale;
  const torsoY = y + 2 + bob;
  const headY = y - 12 + bob;
  drawEllipseShadow(x, y + 24 * scale, 17 * scale, 6.4 * scale, 0.16);

  ctx.strokeStyle = "#6d4d37";
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x - 5.5 * scale, torsoY + 12 * scale);
  ctx.lineTo(x - 6.5 * scale + stepLift, torsoY + 25.5 * scale);
  ctx.moveTo(x + 5.5 * scale, torsoY + 12 * scale);
  ctx.lineTo(x + 6.5 * scale - stepLift, torsoY + 25.5 * scale);
  ctx.stroke();

  ctx.fillStyle = "#775238";
  ctx.beginPath();
  ctx.ellipse(x - 7 * scale + stepLift, torsoY + 26.5 * scale, 4.9 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 7 * scale - stepLift, torsoY + 26.5 * scale, 4.9 * scale, 2.2 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(111, 79, 57, 0.78)";
  ctx.lineWidth = 3.4 * scale;
  ctx.beginPath();
  ctx.moveTo(x - 12 * scale, torsoY - 2 * scale);
  ctx.lineTo(x - 16 * scale - dirX * 1.6 * scale, torsoY + 10 * scale + stepLift * 0.16);
  ctx.moveTo(x + 12 * scale, torsoY - 2 * scale);
  ctx.lineTo(x + 16 * scale + dirX * 1.6 * scale, torsoY + 10 * scale - stepLift * 0.16);
  ctx.stroke();

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(x, torsoY + 1 * scale, 16 * scale, 18 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 244, 230, 0.14)";
  ctx.beginPath();
  ctx.ellipse(x - 4 * scale, torsoY - 5 * scale, 8 * scale, 5 * scale, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accentColor;
  if (style === "child") {
    ctx.beginPath();
    ctx.ellipse(x, torsoY + 4 * scale, 10 * scale, 9 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(98, 124, 171, 0.5)";
    ctx.fillRect(x - 12 * scale, torsoY - 6 * scale, 4 * scale, 12 * scale);
    ctx.fillRect(x + 8 * scale, torsoY - 6 * scale, 4 * scale, 12 * scale);
    ctx.fillStyle = "rgba(255, 248, 228, 0.28)";
    ctx.fillRect(x - 2 * scale, torsoY - 2 * scale, 4 * scale, 10 * scale);
  } else {
    drawRoundedRect(x - 9 * scale, torsoY - 2 * scale, 18 * scale, 17 * scale, 6 * scale, accentColor);
    ctx.fillStyle = style === "player" ? "#7aa060" : "rgba(135, 103, 72, 0.48)";
    ctx.fillRect(x - 2.8 * scale, torsoY + 2 * scale, 5.6 * scale, 9 * scale);
    if (style === "player") {
      ctx.strokeStyle = "rgba(121, 157, 85, 0.72)";
      ctx.lineWidth = 2 * scale;
      ctx.beginPath();
      ctx.moveTo(x - 8 * scale, torsoY + 12 * scale);
      ctx.lineTo(x + 8 * scale, torsoY - 2 * scale);
      ctx.stroke();
      ctx.fillStyle = "#f1d48b";
      ctx.fillRect(x - 4 * scale, torsoY - 6 * scale, 8 * scale, 4 * scale);
    }
  }

  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.ellipse(x, headY, 9 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.24)";
  ctx.beginPath();
  ctx.ellipse(x - 2.6 * scale, headY - 3.8 * scale, 3.2 * scale, 2.2 * scale, -0.4, 0, Math.PI * 2);
  ctx.fill();

  if (style === "child") {
    ctx.fillStyle = "#5f7bb0";
    ctx.beginPath();
    ctx.ellipse(x, headY - 6 * scale, 10 * scale, 5 * scale, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 10 * scale, headY - 6 * scale, 20 * scale, 3 * scale);
    ctx.fillStyle = "#f2d26c";
    ctx.fillRect(x + dirX * 5 * scale, headY - 3 * scale, 5 * scale, 2 * scale);
  } else {
    ctx.fillStyle = "#6f4f38";
    ctx.beginPath();
    ctx.arc(x, headY - 2 * scale, 8.5 * scale, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hatColor;
    ctx.fillRect(x - 13 * scale + dirX * 1.5 * scale, headY - 14 * scale, 26 * scale, 4 * scale);
    ctx.fillStyle = "#7a5737";
    ctx.fillRect(x - 11 * scale, headY - 19 * scale, 22 * scale, 7 * scale);
    ctx.fillStyle = hatColor;
    ctx.fillRect(x - 11 * scale, headY - 17 * scale, 22 * scale, 3 * scale);
  }

  ctx.fillStyle = "rgba(110, 77, 56, 0.9)";
  if (facing !== "up") {
    const eyeOffsetX = 2.5 * scale + Math.abs(dirX) * 1.2 * scale;
    const eyeY = headY - 1 * scale + dirY * 0.8 * scale;
    ctx.beginPath();
    if (facing === "left") {
      ctx.arc(x - 4 * scale, eyeY, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else if (facing === "right") {
      ctx.arc(x + 4 * scale, eyeY, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.arc(x - eyeOffsetX, eyeY, 1.2 * scale, 0, Math.PI * 2);
      ctx.arc(x + eyeOffsetX, eyeY, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(181, 112, 98, 0.85)";
    ctx.lineWidth = 1.4 * scale;
    ctx.beginPath();
    ctx.arc(x + dirX * 1.5 * scale, headY + 3 * scale, 2.6 * scale, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(229, 175, 153, 0.6)";
  ctx.beginPath();
  ctx.arc(x - 5 * scale, headY + 2 * scale, 1.8 * scale, 0, Math.PI * 2);
  ctx.arc(x + 5 * scale, headY + 2 * scale, 1.8 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawWorldHeldTool(x, y, bob) {
  const practice = state.worldPractice;
  if (!practice.carriedTool) {
    return;
  }
  const dirX = state.player.facing === "left" ? -1 : state.player.facing === "right" ? 1 : 0;
  const dirY = state.player.facing === "up" ? -1 : state.player.facing === "down" ? 1 : 0;
  const handX = x + (dirX === 0 ? 14 : 18 * dirX);
  const handY = y - 2 + bob * 0.4 + dirY * 6;
  const toolAngle =
    state.player.facing === "left"
      ? -0.42
      : state.player.facing === "right"
        ? 0.42
        : state.player.facing === "up"
          ? -0.9
          : 0.9;

  ctx.save();
  ctx.translate(handX, handY);
  ctx.rotate(toolAngle + practice.actionPose * 0.2 * (dirX || 1));

  if (practice.carriedTool === "shears") {
    ctx.strokeStyle = "#d9dfe3";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-9, -6);
    ctx.lineTo(6, -1);
    ctx.moveTo(-9, 6);
    ctx.lineTo(6, 1);
    ctx.stroke();
    ctx.strokeStyle = "#c15f3f";
    ctx.beginPath();
    ctx.arc(-12, -7, 3.6, 0, Math.PI * 2);
    ctx.arc(-12, 7, 3.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.fillRect(-2, -2, 6, 1.2);
  } else if (practice.carriedTool === "mower") {
    ctx.fillStyle = "#b95f3a";
    ctx.fillRect(-22, -12, 34, 18);
    ctx.fillStyle = "#f8efe1";
    ctx.fillRect(-10, -18, 16, 4);
    ctx.fillStyle = "#6d5443";
    ctx.beginPath();
    ctx.arc(-12, 7, 5, 0, Math.PI * 2);
    ctx.arc(8, 7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(-18, -9, 10, 3);
  } else if (practice.carriedTool === "seedlings") {
    drawCanvasSeedlingCrate(ctx, 0, -1, {
      scale: 0.95,
      sprouts: Math.max(practice.toolCharges, 1)
    });
  } else if (practice.carriedTool === "bucket") {
    drawCanvasBucket(ctx, 0, 0, {
      scale: 1,
      water: practice.toolCharges > 0 ? 1 : 0,
      rotation: 0.04
    });
  } else if (practice.carriedTool === "hoe") {
    ctx.fillStyle = "#8d6e49";
    ctx.fillRect(-3, -18, 6, 34);
    ctx.fillStyle = "#d8bb7a";
    ctx.beginPath();
    ctx.moveTo(4, -18);
    ctx.lineTo(18, -15);
    ctx.lineTo(14, -5);
    ctx.lineTo(4, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.26)";
    ctx.fillRect(10, -13, 6, 2);
  } else if (practice.carriedTool === "feed") {
    drawCanvasFeedBag(ctx, 0, 0, {
      scale: 1,
      rotation: -0.05,
      open: 0.7
    });
  } else if (practice.carriedTool === "rod") {
    const bobberSwing = Math.sin(performance.now() / 220) * 2;
    ctx.strokeStyle = "#8d6e49";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-14, 12);
    ctx.quadraticCurveTo(0, -18, 24, -34);
    ctx.stroke();
    ctx.strokeStyle = "rgba(244, 232, 210, 0.78)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(24, -34);
    ctx.lineTo(30, -2 + bobberSwing);
    ctx.stroke();
    ctx.fillStyle = "#f7f0e2";
    ctx.beginPath();
    ctx.arc(30, -2 + bobberSwing, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d46c4a";
    ctx.beginPath();
    ctx.arc(30, -5 + bobberSwing, 4.3, Math.PI, 0);
    ctx.fill();
    if (practice.carryingCatch) {
      ctx.strokeStyle = "rgba(244, 232, 210, 0.9)";
      ctx.beginPath();
      ctx.moveTo(24, -34);
      ctx.lineTo(32, 0);
      ctx.stroke();
      ctx.fillStyle = "#fff5e9";
      ctx.beginPath();
      drawCanvasFish(ctx, 34, 10, {
        scale: 0.9,
        rotation: 0.14,
        palette: ["#fff5e9", "#f7d9a2", "#7ba9b8"]
      });
    }
  }

  ctx.restore();
}

function drawNpc(cameraX, cameraY, x, y, color) {
  const sx = x - cameraX;
  const sy = y - cameraY;
  if (!isOnScreen(sx, sy, 90)) {
    return;
  }
  const idle = Math.sin(performance.now() / 620 + (x + y) * 0.01) * 1.2;
  const stride = Math.sin(performance.now() / 360 + (x + y) * 0.02) * 0.3;
  const style = x > 1200 ? "child" : "villager";
  const facing = x > 1200 ? "left" : y > 1000 ? "right" : "down";
  drawWorldPersonFigure(sx, sy + idle, {
    bodyColor: color,
    accentColor: style === "child" ? "rgba(244, 231, 206, 0.95)" : "rgba(244, 235, 219, 0.92)",
    hatColor: style === "child" ? "#5f7bb0" : "#6b8f55",
    skinColor: "#fff6ea",
    facing,
    stride,
    bob: idle,
    scale: style === "child" ? 0.9 : 1,
    style
  });
}

function drawBench(cameraX, cameraY) {
  const x = 998 - cameraX;
  const y = 220 - cameraY;
  if (!isOnScreen(x + 30, y + 8, 80)) {
    return;
  }
  drawEllipseShadow(x + 30, y + 32, 28, 6, 0.12);
  ctx.fillStyle = "#6e4b30";
  ctx.fillRect(x + 6, y + 6, 6, 22);
  ctx.fillRect(x + 48, y + 6, 6, 22);
  ctx.fillRect(x + 8, y - 14, 6, 16);
  ctx.fillRect(x + 46, y - 14, 6, 16);
  ctx.fillStyle = "#876040";
  ctx.fillRect(x, y, 60, 10);
  ctx.fillRect(x, y - 12, 60, 8);
  ctx.fillRect(x + 4, y - 24, 52, 6);
  ctx.strokeStyle = "rgba(255, 228, 193, 0.18)";
  ctx.lineWidth = 2;
  for (let slat = 0; slat < 3; slat += 1) {
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 10 + slat * 11);
    ctx.lineTo(x + 54, y - 10 + slat * 11);
    ctx.stroke();
  }
  ctx.fillStyle = "#f0d48f";
  ctx.beginPath();
  ctx.arc(x + 14, y + 4, 1.6, 0, Math.PI * 2);
  ctx.arc(x + 46, y + 4, 1.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawNoticeBoard(cameraX, cameraY) {
  const x = 300 - cameraX;
  const y = 1000 - cameraY;
  if (!isOnScreen(x + 47, y + 30, 100)) {
    return;
  }
  drawEllipseShadow(x + 47, y + 62, 38, 8, 0.12);
  ctx.fillStyle = "#7f5a3d";
  ctx.fillRect(x + 12, y + 16, 12, 58);
  ctx.fillRect(x + 70, y + 16, 12, 58);
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 8);
  ctx.lineTo(x + 47, y - 14);
  ctx.lineTo(x + 98, y + 8);
  ctx.closePath();
  ctx.fillStyle = "#9d7048";
  ctx.fill();
  drawRoundedRect(x, y, 94, 52, 10, "#f0e4c8");
  strokeRoundedRect(x, y, 94, 52, 10, "rgba(124, 93, 64, 0.18)", 2);
  ctx.fillStyle = "#fbf4e6";
  ctx.fillRect(x + 10, y + 12, 28, 24);
  ctx.fillRect(x + 44, y + 10, 18, 28);
  ctx.fillRect(x + 66, y + 14, 16, 20);
  ctx.fillStyle = "#d66f63";
  ctx.beginPath();
  ctx.arc(x + 18, y + 18, 2.4, 0, Math.PI * 2);
  ctx.arc(x + 52, y + 16, 2.4, 0, Math.PI * 2);
  ctx.arc(x + 72, y + 18, 2.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(113, 87, 57, 0.28)";
  ctx.fillRect(x + 14, y + 24, 18, 3);
  ctx.fillRect(x + 14, y + 30, 16, 3);
  ctx.fillRect(x + 48, y + 24, 10, 3);
  ctx.fillRect(x + 68, y + 24, 10, 3);
  ctx.fillRect(x + 12, y + 42, 62, 4);
}

function drawDinnerTable(cameraX, cameraY) {
  if (state.storyIndex < 5 && !state.flags.has("dinnerServed")) {
    return;
  }
  const x = 510 - cameraX;
  const y = 474 - cameraY;
  if (!isOnScreen(x + 43, y + 24, 100)) {
    return;
  }
  drawEllipseShadow(x + 42, y + 54, 44, 8, 0.12);
  ctx.fillStyle = "#7a5336";
  ctx.fillRect(x + 6, y + 18, 10, 28);
  ctx.fillRect(x + 70, y + 18, 10, 28);
  ctx.fillStyle = "#8a613f";
  ctx.fillRect(x, y + 14, 86, 12);
  ctx.fillStyle = "rgba(255, 250, 243, 0.94)";
  ctx.fillRect(x + 8, y, 70, 18);
  ctx.strokeStyle = "rgba(207, 166, 120, 0.34)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 6);
  ctx.lineTo(x + 72, y + 6);
  ctx.moveTo(x + 14, y + 12);
  ctx.lineTo(x + 72, y + 12);
  ctx.stroke();
  if (state.flags.has("dinnerServed")) {
    ctx.fillStyle = "#f7f1e6";
    ctx.beginPath();
    ctx.arc(x + 24, y + 9, 10, 0, Math.PI * 2);
    ctx.arc(x + 49, y + 9, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#9bc567";
    ctx.beginPath();
    ctx.arc(x + 24, y + 9, 7, 0, Math.PI * 2);
    ctx.arc(x + 49, y + 9, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f8efe1";
    ctx.beginPath();
    ctx.arc(x + 66, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f0d48f";
    ctx.fillRect(x + 14, y + 2, 1.6, 12);
    ctx.fillRect(x + 16.8, y + 2, 1.6, 12);
    ctx.fillRect(x + 38, y + 2, 1.6, 12);
    ctx.fillRect(x + 40.8, y + 2, 1.6, 12);
    ctx.strokeStyle = "#e6d8bf";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 60, y + 6);
    ctx.lineTo(x + 72, y + 6);
    ctx.moveTo(x + 60, y + 10);
    ctx.lineTo(x + 72, y + 10);
    ctx.stroke();
  }
}

function drawQuizSigns(cameraX, cameraY) {
  quizSignDefinitions.forEach((quiz, index) => {
    const x = quiz.x - cameraX;
    const y = quiz.y - cameraY;
    if (!isOnScreen(x, y, 96)) {
      return;
    }
    const solved = state.solvedQuizSigns.has(quiz.id);
    const unlocked = solved || state.completedTasks.has(quiz.taskId);
    const sway = Math.sin(performance.now() / 620 + index * 0.7) * 0.03;
    const label = quiz.label.replace(" 팻말", "");
    drawEllipseShadow(x, y + 28, 22, 6, 0.1);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);
    ctx.globalAlpha = unlocked ? 1 : 0.42;
    ctx.fillStyle = "#8a613f";
    ctx.fillRect(-14, 2, 7, 54);
    ctx.fillRect(7, 2, 7, 54);
    drawRoundedRect(-30, -34, 60, 38, 10, solved ? "#f3e4ba" : unlocked ? "#f0d7a2" : "#c8bea7");
    strokeRoundedRect(-30, -34, 60, 38, 10, "rgba(115, 80, 48, 0.24)", 2);
    ctx.fillStyle = "rgba(255, 248, 233, 0.42)";
    ctx.fillRect(-24, -26, 48, 8);
    ctx.fillStyle = "#79512f";
    ctx.font = '10px "Gowun Dodum", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(label, 0, -11);
    ctx.fillStyle = solved ? "#7eb067" : unlocked ? "#d97f56" : "#8d887d";
    ctx.beginPath();
    ctx.arc(18, -22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff8eb";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (solved) {
      ctx.moveTo(14, -22);
      ctx.lineTo(17, -18);
      ctx.lineTo(22, -26);
    } else if (unlocked) {
      ctx.moveTo(18, -26);
      ctx.lineTo(18, -21);
      ctx.moveTo(18, -17);
      ctx.lineTo(18, -16);
    } else {
      ctx.arc(18, -22, 2.4, 0, Math.PI * 2);
    }
    ctx.stroke();
    ctx.restore();
  });
}

function drawLanterns(cameraX, cameraY) {
  const glowAmount = getLanternGlowAmount();
  if (glowAmount < 0.12) {
    return;
  }
  const lanterns = [
    [492, 196],
    [1478, 368],
    [1710, 954]
  ];
  lanterns.forEach(([x, y]) => {
    const sx = x - cameraX;
    const sy = y - cameraY;
    if (!isOnScreen(sx, sy, 72)) {
      return;
    }
    ctx.strokeStyle = "rgba(115, 85, 60, 0.6)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 16);
    ctx.lineTo(sx, sy - 6);
    ctx.stroke();
    drawScaledGlow(
      ctx,
      sx,
      sy,
      58,
      48,
      `rgba(255, 218, 132, ${(0.12 + glowAmount * 0.22).toFixed(3)})`,
      "rgba(255, 218, 132, 0)"
    );
    drawScaledGlow(
      ctx,
      sx,
      sy,
      28,
      24,
      `rgba(255, 239, 182, ${(0.18 + glowAmount * 0.3).toFixed(3)})`,
      "rgba(255, 239, 182, 0)"
    );
    drawRoundedRect(sx - 6, sy - 10, 12, 16, 4, "#f2ca72");
    ctx.strokeStyle = "rgba(145, 98, 57, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.strokeRect(sx - 5, sy - 9, 10, 14);
    ctx.fillStyle = mixColor("rgba(255, 243, 203, 0.2)", "rgba(255, 243, 203, 0.95)", glowAmount);
    ctx.fillRect(sx - 2, sy - 6, 4, 8);
    ctx.fillStyle = "#f0be61";
    ctx.beginPath();
    ctx.moveTo(sx - 2, sy + 6);
    ctx.lineTo(sx + 2, sy + 6);
    ctx.lineTo(sx, sy + 11);
    ctx.closePath();
    ctx.fill();
  });
}

function drawFireflies(cameraX, cameraY) {
  const fireflyAmount = getDayProfile().firefly;
  if (fireflyAmount < 0.12) {
    return;
  }
  const bugs = [
    [1120, 210],
    [1230, 262],
    [1510, 240],
    [1614, 858],
    [1730, 930],
    [610, 470]
  ];
  bugs.forEach(([x, y], index) => {
    if (!shouldRenderAmbientSlot(index, 0.74)) {
      return;
    }
    const sx = x - cameraX + Math.sin(performance.now() / 700 + index) * 6;
    const sy = y - cameraY + Math.cos(performance.now() / 900 + index) * 5;
    ctx.fillStyle = `rgba(248, 239, 174, ${(0.08 + fireflyAmount * 0.18).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(248, 239, 174, ${(0.34 + fireflyAmount * 0.56).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function getPlayerVisualScale() {
  const phoneProfile = /^phone/.test(state.device?.id ?? "");
  return phoneProfile ? 1.2 : state.device?.id === "tablet" ? 1.12 : 1.08;
}

function getPlayerMarkerPulse() {
  return state.device?.prefersReducedMotion ? 0 : Math.sin(performance.now() / 260) * 1.2;
}

function drawPlayer() {
  const { x, y } = worldToScreen(state.player.x, state.player.y);
  const bob = Math.sin(state.player.step * 5) * 1.8;
  const personScale = getPlayerVisualScale();

  drawWorldPersonFigure(x, y, {
    bodyColor: "#c15f3f",
    accentColor: "rgba(246, 232, 207, 0.96)",
    hatColor: "#6a8e5a",
    skinColor: "#f8efe1",
    facing: state.player.facing,
    stride: Math.sin(state.player.step * 5),
    bob,
    scale: personScale,
    style: "player"
  });
  drawWorldHeldTool(x, y, bob);
}

function drawPlayerFocusMarker() {
  if (state.device?.isTouch && (state.hoveredZone || state.hoveredPractice)) {
    return;
  }
  const { x, y } = worldToScreen(state.player.x, state.player.y);
  const personScale = getPlayerVisualScale();
  const markerPulse = getPlayerMarkerPulse();
  drawScaledGlow(
    ctx,
    x,
    y + 11,
    34 * personScale,
    16 * personScale,
    "rgba(255, 240, 202, 0.38)",
    "rgba(255, 255, 255, 0)"
  );
  ctx.strokeStyle = "rgba(116, 55, 35, 0.72)";
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.ellipse(x, y + 11, 23 * personScale + markerPulse, 9 * personScale + markerPulse * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 248, 225, 0.94)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(x, y + 11, 18 * personScale, 6.4 * personScale, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlayerDirectionMarker() {
  if (state.device?.isTouch && getCurrentTargetZones().length) {
    return;
  }
  const { x, y } = worldToScreen(state.player.x, state.player.y);
  const personScale = getPlayerVisualScale();
  const markerPulse = getPlayerMarkerPulse();
  const directionAngles = {
    up: 0,
    right: Math.PI / 2,
    down: Math.PI,
    left: -Math.PI / 2
  };
  ctx.save();
  ctx.translate(x, y - 54 * personScale + markerPulse * 0.25);
  ctx.rotate(directionAngles[state.player.facing] ?? 0);
  ctx.fillStyle = "rgba(255, 249, 225, 0.96)";
  ctx.strokeStyle = "rgba(123, 58, 37, 0.82)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(7, 6);
  ctx.lineTo(0, 3.5);
  ctx.lineTo(-7, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawForegroundOccluders() {
  const playerX = state.player.x;
  const playerY = state.player.y;
  const candidates = [];

  STATIC_TREE_POSITIONS.forEach(([x, y], index) => {
    const size = 20 + (index % 3) * 3;
    const trunkHeight = 22 + (index % 2) * 4;
    const baseY = y + trunkHeight;
    const depth = baseY - playerY;
    if (depth < -4 || depth > 92 || Math.abs(x - playerX) > size * 1.8 + 10) {
      return;
    }
    candidates.push({ type: "static", x, y, size, trunkHeight, baseY, index });
  });

  state.ambient.nature.trees.forEach((tree) => {
    const baseY = tree.y + tree.trunkHeight;
    const depth = baseY - playerY;
    if (depth < -4 || depth > 104 || Math.abs(tree.x - playerX) > tree.size * 1.9 + 12) {
      return;
    }
    candidates.push({ type: "nature", tree, baseY });
  });

  state.ambient.nature.bushes.forEach((bush) => {
    const baseY = bush.y + 16 * bush.scale;
    const depth = baseY - playerY;
    if (depth < -3 || depth > 52 || Math.abs(bush.x - playerX) > 34 * bush.scale) {
      return;
    }
    candidates.push({ type: "bush", bush, baseY });
  });

  state.ambient.nature.flowers.forEach((flower) => {
    const baseY = flower.y + 12 * flower.scale;
    const depth = baseY - playerY;
    if (depth < -2 || depth > 42 || Math.abs(flower.x - playerX) > 32 * flower.scale) {
      return;
    }
    candidates.push({ type: "flower", flower, baseY });
  });

  if (!candidates.length) {
    return;
  }

  ctx.save();
  candidates
    .sort((left, right) => left.baseY - right.baseY)
    .slice(0, 2)
    .forEach((candidate) => {
      if (candidate.type === "nature") {
        drawNatureTree(candidate.tree, { foregroundPass: true });
        return;
      }
      if (candidate.type === "bush") {
        drawNatureBush(candidate.bush, { foregroundPass: true });
        return;
      }
      if (candidate.type === "flower") {
        drawNatureFlowerPatch(candidate.flower, { foregroundPass: true });
        return;
      }
      const sx = candidate.x - state.camera.x;
      const sy = candidate.y - state.camera.y;
      drawTreeShape(
        sx,
        sy,
        candidate.size,
        candidate.trunkHeight,
        STATIC_TREE_PALETTES[candidate.index % STATIC_TREE_PALETTES.length],
        candidate.index,
        TREE_ASSETS[candidate.index % TREE_ASSETS.length],
        { skipShadow: true }
      );
    });
  ctx.restore();
}

function drawFollowerCompanion(entry) {
  const definition = followerDefinitions[entry.id];
  if (!definition) {
    return;
  }
  const { x, y } = worldToScreen(entry.x, entry.y);
  if (!isOnScreen(x, y, 72)) {
    return;
  }
  const body = definition.palette[0];
  const accent = definition.palette[1];
  const detail = definition.palette[2];
  const bob = Math.sin(entry.bob + performance.now() / 240) * 1.1 + Math.sin(entry.step * 4) * 0.7 - entry.hop * 6;
  const blink = Math.sin(entry.blink * 2.8) > 0.95;

  drawEllipseShadow(x, y + 12, 14, 4, 0.08);
  const imageSize = 36 * (definition.assetScale ?? 1);
  if (
    drawCenteredImageAsset(definition.asset, x, y + bob - 2, imageSize, imageSize, {
      flipX: Math.sin(entry.step) < 0
    })
  ) {
    return;
  }

  ctx.save();
  ctx.translate(x, y + bob);

  switch (definition.shape) {
    case "chick":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(0, 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(6, -6, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(-4, 1, 3, 0, Math.PI * 2);
      ctx.arc(3, 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = detail;
      ctx.beginPath();
      ctx.moveTo(12, -5);
      ctx.lineTo(19, -2);
      ctx.lineTo(12, 1);
      ctx.closePath();
      ctx.fill();
      break;
    case "bunny":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 4, 10, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(6, -4, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(2, -19, 4, 15);
      ctx.fillRect(10, -18, 4, 14);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(4, -19, 4, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(12, -18, 4, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "duck":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 3, 11, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(9, -3, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(14, -3);
      ctx.lineTo(21, -1);
      ctx.lineTo(14, 2);
      ctx.closePath();
      ctx.fill();
      break;
    case "cat":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(7, -4, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(2, -10);
      ctx.lineTo(5, -18);
      ctx.lineTo(8, -10);
      ctx.moveTo(10, -10);
      ctx.lineTo(13, -18);
      ctx.lineTo(16, -10);
      ctx.fill();
      ctx.strokeStyle = detail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-11, 4);
      ctx.quadraticCurveTo(-18, -4, -12, -12);
      ctx.stroke();
      break;
    case "lamb":
      ctx.fillStyle = body;
      [-5, 2, 8].forEach((offset, fluffyIndex) => {
        ctx.beginPath();
        ctx.arc(offset, fluffyIndex === 1 ? 0 : 4, 6.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(10, -3, 6, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.fill();
      break;
    case "puppy":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 4, 11, 8, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -2, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.ellipse(5, -10, 4, 7, -0.4, 0, Math.PI * 2);
      ctx.ellipse(12, -9, 4, 7, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = detail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-11, 5);
      ctx.quadraticCurveTo(-18, -2, -14, -10);
      ctx.stroke();
      break;
    case "frog":
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 4, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(-5, -6, 4.5, 0, Math.PI * 2);
      ctx.arc(5, -6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.ellipse(0, 4, 10, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(7, -4, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.fillStyle = detail;
  if (!blink) {
    ctx.beginPath();
    ctx.arc(5, -5, 1.3, 0, Math.PI * 2);
    ctx.arc(10, -5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(4, -5, 3, 1.2);
    ctx.fillRect(9, -5, 3, 1.2);
  }
  ctx.restore();
}

function drawFollowers() {
  state.followers.forEach(drawFollowerCompanion);
}

function getWorldExpressionMomentTheme(id) {
  if (id === "cleanAir") {
    return { panel: "rgba(36, 79, 86, 0.92)", border: "rgba(205, 242, 238, 0.72)", accent: "#cdeee9", wash: "rgba(159, 216, 224, 0.08)" };
  }
  if (id === "relaxed") {
    return { panel: "rgba(64, 78, 48, 0.92)", border: "rgba(239, 223, 164, 0.72)", accent: "#f0dda0", wash: "rgba(225, 206, 137, 0.08)" };
  }
  if (id === "peaceful") {
    return { panel: "rgba(43, 52, 70, 0.94)", border: "rgba(223, 228, 203, 0.64)", accent: "#e8e3b1", wash: "rgba(63, 78, 108, 0.1)" };
  }
  if (id === "loseTrack") {
    return { panel: "rgba(92, 59, 42, 0.94)", border: "rgba(255, 211, 146, 0.74)", accent: "#ffd392", wash: "rgba(215, 129, 79, 0.1)" };
  }
  if (id === "inconvenient") {
    return { panel: "rgba(82, 60, 45, 0.94)", border: "rgba(224, 196, 155, 0.7)", accent: "#e2c39a", wash: "rgba(103, 73, 50, 0.11)" };
  }
  if (id === "boring") {
    return { panel: "rgba(67, 65, 75, 0.94)", border: "rgba(218, 211, 221, 0.62)", accent: "#ddd3df", wash: "rgba(94, 91, 105, 0.08)" };
  }
  return { panel: "rgba(49, 69, 43, 0.94)", border: "rgba(247, 221, 153, 0.72)", accent: "#f6d88c", wash: "rgba(244, 199, 105, 0.08)" };
}

function drawWorldExpressionAtmosphere(moment, alpha, progress, theme) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = theme.wash;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const motion = state.device?.prefersReducedMotion ? 0 : performance.now() / 1000;

  if (moment.id === "cleanAir" || moment.id === "relaxed") {
    ctx.strokeStyle = moment.id === "cleanAir" ? "rgba(224, 249, 246, 0.46)" : "rgba(244, 232, 179, 0.34)";
    ctx.lineWidth = 2.2;
    for (let index = 0; index < 4; index += 1) {
      const y = canvas.height * (0.28 + index * 0.12);
      const offset = ((motion * (42 + index * 8) + index * 110) % (canvas.width + 180)) - 90;
      ctx.beginPath();
      ctx.moveTo(offset - 92, y);
      ctx.bezierCurveTo(offset - 34, y - 18, offset + 28, y + 18, offset + 92, y - 2);
      ctx.stroke();
    }
  } else if (moment.id === "peaceful") {
    for (let index = 0; index < 12; index += 1) {
      const x = ((index * 83 + 37) % Math.max(canvas.width, 1));
      const y = ((index * 47 + 96) % Math.max(canvas.height, 1));
      const twinkle = state.device?.prefersReducedMotion ? 0.52 : 0.38 + Math.sin(motion * 2 + index) * 0.2;
      ctx.fillStyle = `rgba(244, 232, 157, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + (index % 3) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (moment.id === "loseTrack") {
    const arcX = canvas.width * 0.5;
    const arcY = canvas.height * 0.72;
    ctx.strokeStyle = "rgba(255, 214, 146, 0.36)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(arcX, arcY, Math.min(canvas.width, canvas.height) * 0.28, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    const angle = Math.PI * (1.08 + 0.84 * progress);
    ctx.fillStyle = "rgba(255, 211, 132, 0.7)";
    ctx.beginPath();
    ctx.arc(arcX + Math.cos(angle) * Math.min(canvas.width, canvas.height) * 0.28, arcY + Math.sin(angle) * Math.min(canvas.width, canvas.height) * 0.28, 8, 0, Math.PI * 2);
    ctx.fill();
  } else if (moment.id === "inconvenient") {
    ctx.fillStyle = "rgba(100, 70, 46, 0.28)";
    for (let index = 0; index < 7; index += 1) {
      const x = canvas.width * 0.14 + index * canvas.width * 0.12;
      const y = canvas.height * 0.68 + (index % 2) * 18;
      ctx.beginPath();
      ctx.ellipse(x, y, 13, 7, index % 2 ? -0.28 : 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawWorldExpressionMoment() {
  const moment = state.expressionMoment;
  if (!moment) {
    return;
  }
  const progress = clamp(1 - moment.timer / Math.max(moment.duration, 0.01), 0, 1);
  const remaining = clamp(moment.timer / Math.max(moment.duration, 0.01), 0, 1);
  const alpha = Math.min(1, progress * 4.5, remaining * 4.5);
  const theme = getWorldExpressionMomentTheme(moment.id);
  drawWorldExpressionAtmosphere(moment, alpha, progress, theme);

  const safeRect = getWorldHudSafeRect();
  const uiScale = Math.min(getCanvasUiScale(), 1.58);
  const maxWidth = Math.max(180, safeRect.right - safeRect.left - 18 * uiScale);
  const cardWidth = Math.min(maxWidth, 500 * uiScale);
  const cardHeight = 104 * uiScale;
  const cardX = clamp((canvas.width - cardWidth) / 2, safeRect.left, Math.max(safeRect.left, safeRect.right - cardWidth));
  const safeHeight = Math.max(cardHeight, safeRect.bottom - safeRect.top);
  const cardY = clamp(safeRect.top + safeHeight * 0.26, safeRect.top, Math.max(safeRect.top, safeRect.bottom - cardHeight));

  ctx.save();
  ctx.globalAlpha = alpha;
  drawRoundedRect(cardX, cardY, cardWidth, cardHeight, 20 * uiScale, theme.panel);
  strokeRoundedRect(cardX, cardY, cardWidth, cardHeight, 20 * uiScale, theme.border, 2.2 * uiScale);
  ctx.textAlign = "center";
  ctx.fillStyle = theme.accent;
  ctx.font = `800 ${11.5 * uiScale}px "Gowun Dodum", sans-serif`;
  ctx.fillText("장면으로 느낀 표현", cardX + cardWidth / 2, cardY + 21 * uiScale);
  ctx.fillStyle = "#fff9ea";
  ctx.font = `900 ${25 * uiScale}px "Gowun Dodum", sans-serif`;
  ctx.fillText(moment.label, cardX + cardWidth / 2, cardY + 51 * uiScale);
  ctx.fillStyle = "rgba(255, 249, 234, 0.84)";
  ctx.font = `600 ${12.5 * uiScale}px "Gowun Dodum", sans-serif`;
  const lines = wrapCanvasTextLines(ctx, moment.detail, cardWidth - 38 * uiScale, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, cardX + cardWidth / 2, cardY + (73 + index * 17) * uiScale);
  });
  const progressWidth = (cardWidth - 32 * uiScale) * remaining;
  drawRoundedRect(cardX + 16 * uiScale, cardY + cardHeight - 7 * uiScale, cardWidth - 32 * uiScale, 3 * uiScale, 1.5 * uiScale, "rgba(255,255,255,0.14)");
  if (progressWidth > 1) {
    drawRoundedRect(cardX + 16 * uiScale, cardY + cardHeight - 7 * uiScale, progressWidth, 3 * uiScale, Math.min(1.5 * uiScale, progressWidth / 2), theme.accent);
  }
  ctx.restore();
}

function drawWorldColorGrade() {
  const nightAmount = getNightAmount();
  const { current, next, blend } = getCurrentDayBlendInfo();
  const morningStops = [1, 0.18, 0, 0, 0.32];
  const morningAmount = lerp(morningStops[current], morningStops[next], blend);
  const eveningStops = [0, 0, 0, 1, 0.15];
  const eveningAmount = lerp(eveningStops[current], eveningStops[next], blend);

  if (morningAmount > 0.04) {
    const morningWash = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    morningWash.addColorStop(0, `rgba(255, 225, 166, ${(0.035 * morningAmount).toFixed(3)})`);
    morningWash.addColorStop(0.5, "rgba(255, 236, 194, 0)");
    morningWash.addColorStop(1, `rgba(119, 151, 102, ${(0.025 * morningAmount).toFixed(3)})`);
    ctx.fillStyle = morningWash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (eveningAmount > 0.04) {
    const eveningWash = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    eveningWash.addColorStop(0, `rgba(255, 188, 137, ${(0.08 * eveningAmount).toFixed(3)})`);
    eveningWash.addColorStop(0.54, `rgba(155, 83, 58, ${(0.045 * eveningAmount).toFixed(3)})`);
    eveningWash.addColorStop(1, `rgba(75, 65, 54, ${(0.07 * eveningAmount).toFixed(3)})`);
    ctx.fillStyle = eveningWash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (nightAmount > 0.04) {
    const nightWash = ctx.createLinearGradient(0, 0, 0, canvas.height);
    nightWash.addColorStop(0, `rgba(29, 43, 82, ${(0.13 * nightAmount).toFixed(3)})`);
    nightWash.addColorStop(0.58, `rgba(22, 37, 68, ${(0.16 * nightAmount).toFixed(3)})`);
    nightWash.addColorStop(1, `rgba(14, 29, 48, ${(0.19 * nightAmount).toFixed(3)})`);
    ctx.fillStyle = nightWash;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const vignette = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height * 0.46,
      canvas.width * 0.18,
      canvas.width / 2,
      canvas.height * 0.5,
      canvas.width * 0.72
    );
    vignette.addColorStop(0, "rgba(16, 23, 46, 0)");
    vignette.addColorStop(1, `rgba(12, 20, 42, ${(0.1 * nightAmount).toFixed(3)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawCurrentRouteGuide() {
  if (!state.started) {
    return;
  }
  const target = getCurrentTargetZones()[0];
  if (!target) {
    return;
  }

  const start = worldToScreen(state.player.x, state.player.y + 10);
  const targetCenter = worldToScreen(target.x, target.y);
  const safeRect = getWorldHudSafeRect();
  if (!isInsideWorldHudSafeRect(targetCenter.x, targetCenter.y, safeRect)) {
    return;
  }
  const worldDx = state.player.x - target.x;
  const worldDy = state.player.y - target.y;
  const worldDistance = Math.max(1, Math.hypot(worldDx, worldDy));
  const approachDistance = Math.min(target.radius * 0.72, 78);
  const end = worldToScreen(
    target.x + (worldDx / worldDistance) * approachDistance,
    target.y + (worldDy / worldDistance) * approachDistance
  );
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const compactRoute = Boolean(state.device?.isTouch || /^phone/.test(state.device?.id ?? ""));
  if (distance < (compactRoute ? 148 : 92) || distance > Math.max(canvas.width, canvas.height) * (compactRoute ? 0.72 : 0.88)) {
    return;
  }

  const middleX = (start.x + end.x) / 2;
  const middleY = (start.y + end.y) / 2 - Math.min(34, distance * 0.08);
  const dashOffset = state.device?.prefersReducedMotion ? 0 : -(performance.now() / 90) % 18;

  ctx.save();
  ctx.setLineDash([4, 14]);
  ctx.lineDashOffset = dashOffset;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(49, 57, 36, 0.28)";
  ctx.lineWidth = 5.2;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.quadraticCurveTo(middleX, middleY, end.x, end.y);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 244, 205, 0.76)";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.restore();
}

function drawZoneHints() {
  const currentTargets = getCurrentTargetZones();
  const targetZoneIds = new Set(currentTargets.map((zone) => zone.id));
  const primaryTargetId = currentTargets[0]?.id ?? null;
  getAvailableZones().forEach((zone) => {
    const { x, y } = worldToScreen(zone.x, zone.y);
    if (!isOnScreen(x, y, 120)) {
      return;
    }
    const isTarget = targetZoneIds.has(zone.id);
    const isPrimaryTarget = zone.id === primaryTargetId;
    const isFocused = !state.hoveredPractice && state.hoveredZone?.id === zone.id;
    if (state.device?.isTouch && !isTarget && !isFocused) {
      return;
    }
    const distance = Math.hypot(state.player.x - zone.x, state.player.y - zone.y);
    const nearTouchTarget = state.device?.isTouch && distance <= zone.radius + getInteractionAssist("zone");
    const palette = getInteractionPalette(isTarget ? "story" : zone.type);
    drawInteractionBeacon(x, y, {
      palette,
      size: nearTouchTarget ? 9 : isFocused ? 18 : isPrimaryTarget ? 17 : isTarget ? 10 : 8,
      subtle: !isFocused && !isPrimaryTarget,
      label: nearTouchTarget ? "" : isFocused || isPrimaryTarget ? zone.label : "",
      keycap: isFocused && !state.device?.isTouch ? "E" : "",
      showTag: !nearTouchTarget && (isFocused || isPrimaryTarget)
    });
  });
}

function drawTargetPointers() {
  const target = getCurrentTargetZones()[0];
  if (!target) {
    return;
  }

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const safeRect = getWorldHudSafeRect();
  const leftMargin = safeRect.left;
  const rightEdge = safeRect.right;
  const topMargin = safeRect.top;
  const bottomEdge = safeRect.bottom;
  const { x, y } = worldToScreen(target.x, target.y);

  if (isInsideWorldHudSafeRect(x, y, safeRect)) {
    return;
  }

  const dx = x - centerX;
  const dy = y - centerY;
  const angle = Math.atan2(dy, dx);
  let rayScale = Infinity;
  if (dx > 0) {
    rayScale = Math.min(rayScale, (rightEdge - centerX) / dx);
  } else if (dx < 0) {
    rayScale = Math.min(rayScale, (leftMargin - centerX) / dx);
  }
  if (dy > 0) {
    rayScale = Math.min(rayScale, (bottomEdge - centerY) / dy);
  } else if (dy < 0) {
    rayScale = Math.min(rayScale, (topMargin - centerY) / dy);
  }
  if (!Number.isFinite(rayScale)) {
    return;
  }

  const px = centerX + dx * rayScale;
  const py = centerY + dy * rayScale;
  const uiScale = getCanvasUiScale();
  const iconRadius = 14 * uiScale;

  drawScaledGlow(
    ctx,
    px,
    py,
    iconRadius * 2.2,
    iconRadius * 2.2,
    "rgba(255, 207, 154, 0.34)",
    "rgba(255, 255, 255, 0)"
  );
  ctx.fillStyle = "rgba(31, 43, 29, 0.9)";
  ctx.strokeStyle = "rgba(255, 246, 221, 0.88)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(px, py, iconRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);
  ctx.fillStyle = "#e48958";
  ctx.beginPath();
  ctx.moveTo(iconRadius * 0.72, 0);
  ctx.lineTo(-iconRadius * 0.42, -iconRadius * 0.5);
  ctx.lineTo(-iconRadius * 0.2, 0);
  ctx.lineTo(-iconRadius * 0.42, iconRadius * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  const fontSize = 13 * uiScale;
  ctx.font = `700 ${fontSize}px "Gowun Dodum", sans-serif`;
  const maxLabelWidth = Math.max(96, rightEdge - leftMargin - 12);
  const labelWidth = Math.min(ctx.measureText(target.label).width + 22 * uiScale, maxLabelWidth);
  const labelHeight = 25 * uiScale;
  const placeBelow = py - iconRadius - labelHeight - 8 < topMargin;
  const labelCenterY = clamp(
    py + (placeBelow ? iconRadius + labelHeight / 2 + 7 : -iconRadius - labelHeight / 2 - 7),
    topMargin + labelHeight / 2,
    bottomEdge - labelHeight / 2
  );
  const labelCenterX = clamp(px, leftMargin + labelWidth / 2, rightEdge - labelWidth / 2);
  drawRoundedRect(
    labelCenterX - labelWidth / 2,
    labelCenterY - labelHeight / 2,
    labelWidth,
    labelHeight,
    labelHeight / 2,
    "rgba(29, 40, 27, 0.9)"
  );
  strokeRoundedRect(
    labelCenterX - labelWidth / 2,
    labelCenterY - labelHeight / 2,
    labelWidth,
    labelHeight,
    labelHeight / 2,
    "rgba(255, 242, 211, 0.34)",
    1.4
  );
  ctx.fillStyle = "#fff8e9";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(target.label, labelCenterX, labelCenterY + 0.5);
  ctx.restore();
}

function renderWorldScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSkyAndGround();
  drawClouds();
  drawWorld();
  drawFollowers();
  drawPlayer();
  drawForegroundOccluders();
  drawWorldColorGrade();
  drawLanterns(state.camera.x, state.camera.y);
  drawFireflies(state.camera.x, state.camera.y);
  drawCurrentRouteGuide();
  drawPlayerFocusMarker();
  drawPlayerDirectionMarker();
  drawZoneHints();
  drawTargetPointers();
  drawWorldPracticeHighlight();
  drawAutoNavigationGuide(ctx, "world");
  drawWorldExpressionMoment();
  if (!ui.statsPanel.classList.contains("hidden") && shouldRefreshMiniMap()) {
    renderMiniMap();
  }
}

function render() {
  if (state.activeMiniGame) {
    renderActivityScene();
    return;
  }
  if (state.activeDialogue || state.activeQuiz || state.endingShown) {
    return;
  }
  renderWorldScene();
}

function getTargetFrameRate() {
  const hasStaticOverlay =
    !state.started ||
    state.activeDialogue ||
    state.activeQuiz ||
    state.endingShown ||
    state.uiPanels.journalOpen ||
    state.uiPanels.storyOpen ||
    state.uiPanels.statsOpen ||
    state.uiPanels.heroExpanded;
  if (hasStaticOverlay && !state.activeMiniGame) {
    return 15;
  }
  if (state.device?.id === "phone-low") {
    return 30;
  }
  if (state.device?.id === "phone-high") {
    return 45;
  }
  return 60;
}

function loop(timestamp) {
  const frameRate = getTargetFrameRate();
  const frameInterval = 1000 / frameRate;
  if (!state.lastTimestamp) {
    state.lastTimestamp = timestamp;
  }
  const elapsed = Math.min(Math.max(timestamp - state.lastTimestamp, 0), 100);
  state.lastTimestamp = timestamp;
  state.frameAccumulator = Math.min(state.frameAccumulator + elapsed, frameInterval * 3);

  let updateCount = 0;
  while (state.frameAccumulator >= frameInterval && updateCount < 3) {
    update(frameInterval / 1000);
    state.frameAccumulator -= frameInterval;
    updateCount += 1;
  }
  if (updateCount > 0) {
    render();
  }
  requestAnimationFrame(loop);
}

function requestDestructiveAction(button, confirmLabel, action) {
  if (button.dataset.confirming === "true") {
    window.clearTimeout(button.confirmTimer);
    button.dataset.confirming = "false";
    button.classList.remove("is-confirming");
    button.textContent = button.dataset.originalLabel || button.textContent;
    delete button.dataset.originalLabel;
    action();
    return;
  }

  const originalLabel = button.textContent;
  button.dataset.originalLabel = originalLabel;
  button.dataset.confirming = "true";
  button.classList.add("is-confirming");
  button.textContent = confirmLabel;
  showToast("확인이 필요합니다", "진행 기록을 지우려면 같은 버튼을 한 번 더 누르세요.");
  window.clearTimeout(button.confirmTimer);
  button.confirmTimer = window.setTimeout(() => {
    button.dataset.confirming = "false";
    button.classList.remove("is-confirming");
    button.textContent = originalLabel;
    delete button.dataset.originalLabel;
  }, 4200);
}

function isGameKeyTarget(target) {
  if (!(target instanceof Element)) {
    return true;
  }
  return !target.closest("button, a, input, textarea, select, summary, [contenteditable='true']");
}

function setupInput() {
  let resizeTimer = null;
  let pendingForcedResize = false;
  let pendingRotationSave = false;
  const scheduleViewportSync = ({ force = false, persistRotation = false, delay = 100 } = {}) => {
    pendingForcedResize ||= force;
    pendingRotationSave ||= persistRotation;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncDeviceProfile({ force: pendingForcedResize });
      if (pendingRotationSave && state.started) {
        persistGame("화면 회전 저장");
      }
      syncPortraitRequirement();
      pendingForcedResize = false;
      pendingRotationSave = false;
    }, delay);
  };
  window.addEventListener("beforeunload", () => {
    if (state.started) {
      persistGame("산책");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.started) {
      persistGame("자동");
    }
  });

  document.addEventListener("fullscreenchange", syncFullscreenUi);
  document.addEventListener("webkitfullscreenchange", syncFullscreenUi);
  document.addEventListener("fullscreenerror", () => {
    setFullscreenStatus("전체화면 전환이 허용되지 않았어요. 현재 화면에서도 그대로 플레이할 수 있어요.", true);
  });
  document.addEventListener("webkitfullscreenerror", () => {
    setFullscreenStatus("전체화면 전환이 허용되지 않았어요. 현재 화면에서도 그대로 플레이할 수 있어요.", true);
  });

  window.setInterval(() => {
    if (state.started) {
      persistGame("자동 저장");
    }
  }, 10000);

  window.addEventListener("resize", () => {
    scheduleViewportSync({ delay: 100 });
  });

  window.addEventListener("orientationchange", () => {
    scheduleViewportSync({ force: true, persistRotation: true, delay: 140 });
  });

  window.screen?.orientation?.addEventListener?.("change", () => {
    scheduleViewportSync({ force: true, persistRotation: true, delay: 120 });
  });

  window.addEventListener("blur", resetTouchJoystick);

  window.addEventListener("keydown", (event) => {
    if (trapPortraitGateTab(event)) {
      return;
    }
    if (trapTutorialTab(event)) {
      return;
    }
    if (!isGameKeyTarget(event.target) && event.code !== "Escape") {
      return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyE", "Escape"].includes(event.code)) {
      event.preventDefault();
    }

    if (event.repeat && (event.code === "KeyE" || event.code === "Space")) {
      return;
    }

    state.keys.add(event.code);

    if (event.code === "KeyE" || event.code === "Space") {
      handleActionPress();
      return;
    }

    if (event.code === "Escape") {
      if (state.activeDialogue) {
        closeDialogue();
      } else if (state.activeQuiz) {
        closeQuiz();
      } else if (state.activeMiniGame) {
        pauseMiniGame();
      } else if (state.uiPanels.journalOpen) {
        state.uiPanels.journalOpen = false;
        syncUiPanels();
        restoreOverlayFocus();
      } else if (state.uiPanels.storyOpen || state.uiPanels.statsOpen || state.uiPanels.heroExpanded) {
        state.uiPanels.storyOpen = false;
        state.uiPanels.statsOpen = false;
        state.uiPanels.heroExpanded = false;
        syncUiPanels();
      }
    }
  });

  window.addEventListener("keyup", (event) => {
    state.keys.delete(event.code);
    if (event.code === "KeyE" || event.code === "Space") {
      releaseActionPress();
    }
  });

  const startJoystick = (event) => {
    if (
      !state.device?.isTouch ||
      state.portraitGate.open ||
      (state.controlTutorial.open && state.controlTutorial.step !== 0)
    ) {
      return;
    }
    event.preventDefault();
    navigator.vibrate?.(8);
    state.touchStick.active = true;
    state.touchStick.pointerId = event.pointerId;
    try {
      ui.touchJoystick?.setPointerCapture?.(event.pointerId);
    } catch {}
    updateTouchJoystickInput(event.clientX, event.clientY);
  };

  const moveJoystick = (event) => {
    if (!state.touchStick.active || state.touchStick.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    updateTouchJoystickInput(event.clientX, event.clientY);
  };

  const stopJoystick = (event) => {
    if (!state.touchStick.active || state.touchStick.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    const completedTutorialPractice =
      state.controlTutorial.open && state.controlTutorial.step === 0 && state.touchStick.magnitude >= 0.12;
    try {
      ui.touchJoystick?.releasePointerCapture?.(event.pointerId);
    } catch {}
    resetTouchJoystick();
    if (completedTutorialPractice) {
      advanceControlTutorial();
    }
  };

  ui.touchJoystick.addEventListener("pointerdown", startJoystick);
  ui.touchJoystick.addEventListener("pointermove", moveJoystick);
  ui.touchJoystick.addEventListener("pointerup", stopJoystick);
  ui.touchJoystick.addEventListener("pointerleave", stopJoystick);
  ui.touchJoystick.addEventListener("pointercancel", stopJoystick);

  const pressAction = (event) => {
    event.preventDefault();
    if (state.portraitGate.open) {
      return;
    }
    if (state.controlTutorial.open) {
      if (state.controlTutorial.step === 1) {
        navigator.vibrate?.(10);
        completeControlTutorial();
      }
      return;
    }
    navigator.vibrate?.(10);
    state.touchKeys.add("Action");
    handleActionPress();
  };
  const releaseAction = (event) => {
    event.preventDefault();
    state.touchKeys.delete("Action");
    releaseActionPress();
  };

  ui.touchAction.addEventListener("pointerdown", pressAction);
  ui.touchAction.addEventListener("pointerup", releaseAction);
  ui.touchAction.addEventListener("pointerleave", releaseAction);
  ui.touchAction.addEventListener("pointercancel", releaseAction);

  const handleTapNavigation = (event, targetCanvas, scope) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (!state.device?.isTouch || state.controlMode !== "tap" || state.portraitGate.open) return;
    const point = getCanvasPointerPoint(event, targetCanvas);
    if (!point) return;
    event.preventDefault();
    if (state.controlTutorial.open) {
      if (scope === "world" && state.controlTutorial.step === 0) {
        navigator.vibrate?.(8);
        advanceControlTutorial();
      }
      return;
    }
    if (!state.started || state.activeDialogue || state.activeQuiz || state.endingShown) return;
    if (scope === "world" && !state.activeMiniGame) {
      navigator.vibrate?.(6);
      beginWorldTapNavigation({ x: point.x + state.camera.x, y: point.y + state.camera.y });
    } else if (scope === "activity" && state.activeMiniGame && !state.activeMiniGame.completion?.active) {
      navigator.vibrate?.(6);
      beginActivityTapNavigation(point);
    }
  };
  canvas.addEventListener("pointerup", (event) => handleTapNavigation(event, canvas, "world"));
  ui.activityCanvas.addEventListener("pointerup", (event) => handleTapNavigation(event, ui.activityCanvas, "activity"));
  ui.tapTutorialTarget.addEventListener("click", () => {
    if (state.controlTutorial.open && state.controlMode === "tap" && state.controlTutorial.step === 1) {
      navigator.vibrate?.(10);
      completeControlTutorial();
    }
  });

  ui.dialogueNext.addEventListener("click", nextDialogue);
  ui.dialogueClose.addEventListener("click", closeDialogue);
  ui.miniGameClose.addEventListener("click", pauseMiniGame);
  ui.quizSubmit.addEventListener("click", submitQuizAnswer);
  ui.quizReset.addEventListener("click", () => resetQuizSelection(true));
  ui.quizClose.addEventListener("click", closeQuiz);
  ui.quizChoiceBank.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quiz-choice]");
    if (!button) {
      return;
    }
    appendQuizChoice(button.dataset.quizChoice);
  });
  ui.quizExpression.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quiz-slot]");
    if (!button) {
      return;
    }
    removeQuizChoice(Number(button.dataset.quizSlot));
  });
  ui.heroToggle.addEventListener("click", () => {
    state.uiPanels.heroExpanded = !state.uiPanels.heroExpanded;
    syncUiPanels();
    playSfx("uiClick", {
      volume: 0.26,
      playbackRate: state.uiPanels.heroExpanded ? 1.02 : 0.92
    });
  });
  ui.storyToggle.addEventListener("click", () => toggleUiPanel("storyOpen"));
  ui.statsToggle.addEventListener("click", () => toggleUiPanel("statsOpen"));
  ui.journalToggle.addEventListener("click", () => toggleUiPanel("journalOpen"));
  ui.journalClose.addEventListener("click", () => {
    state.uiPanels.journalOpen = false;
    syncUiPanels();
    restoreOverlayFocus();
    playSfx("uiClick", {
      volume: 0.24,
      playbackRate: 0.92
    });
  });
  ui.journalBackdrop.addEventListener("click", () => {
    state.uiPanels.journalOpen = false;
    syncUiPanels();
    restoreOverlayFocus();
    playSfx("uiClick", {
      volume: 0.22,
      playbackRate: 0.88
    });
  });
  ui.fullscreenToggle.addEventListener("click", toggleGameFullscreen);
  ui.controlModeSelector.addEventListener("change", (event) => {
    const input = event.target.closest("input[name='controlMode']");
    if (input) setControlMode(input.value, { savePreference: true, saveGame: false });
  });
  ui.controlModeToggle.addEventListener("click", () => {
    const nextMode = state.controlMode === "tap" ? "joystick" : "tap";
    closeOptionalPanels();
    setControlMode(nextMode, { announce: true });
    if (state.device?.isTouch && !hasSeenControlTutorial(nextMode)) {
      showControlTutorial(null);
    }
  });
  ui.fullscreenButton.addEventListener("click", beginFullscreenLaunch);
  ui.portraitRetry.addEventListener("click", retryPortraitMode);
  ui.portraitCancel.addEventListener("click", cancelPortraitGate);
  ui.tutorialReplay.addEventListener("click", () => {
    closeOptionalPanels();
    showControlTutorial(null);
  });
  ui.tutorialNext.addEventListener("click", advanceControlTutorial);
  ui.tutorialSkip.addEventListener("click", completeControlTutorial);
  ui.startButton.addEventListener("click", () => {
    if (loadSavedGame()?.started) {
      requestDestructiveAction(ui.startButton, "한 번 더 눌러 새로 시작", () => beginWindowLaunch("new"));
    } else {
      beginWindowLaunch("new");
    }
  });
  ui.continueButton.addEventListener("click", () => {
    const saved = loadSavedGame();
    if (!saved) {
      return;
    }
    if (hasSeenControlTutorial() || !state.device?.isTouch) {
      playSfx("uiStart", {
        playbackRate: 0.96
      });
    }
    beginWindowLaunch("continue");
  });
  ui.endingRestart.addEventListener("click", () => {
    requestDestructiveAction(ui.endingRestart, "한 번 더 눌러 다시 시작", () => {
      resetState();
      playSfx("uiClick", {
        volume: 0.3,
        playbackRate: 0.84
      });
    });
  });
  ui.endingContinue.addEventListener("click", () => {
    state.endingShown = false;
    ui.endingCard.classList.add("hidden");
    state.saveMessage = "노을 산책 이어가는 중";
    closeOptionalPanels();
    renderSidebar();
    playSfx("uiStart", {
      volume: 0.46,
      playbackRate: 0.9
    });
    persistGame("산책");
    restoreOverlayFocus();
  });
  ui.endingReview.addEventListener("click", () => {
    state.endingShown = false;
    ui.endingCard.classList.add("hidden");
    state.uiPanels.journalOpen = true;
    renderSidebar();
    syncUiPanels();
    persistGame("표현 복습");
    focusOverlay(ui.journalDrawer);
  });
  ui.resetButton.addEventListener("click", () => {
    requestDestructiveAction(ui.resetButton, "한 번 더 눌러 초기화", () => {
      resetState();
      playSfx("uiClick", {
        volume: 0.3,
        playbackRate: 0.84
      });
    });
  });
  ui.voiceToggle.addEventListener("click", () => {
    state.voiceEnabled = !state.voiceEnabled;
    if (!state.voiceEnabled) {
      stopAllAudio();
    } else {
      playSfx("uiClick", {
        volume: 0.26,
        playbackRate: 1.08
      });
    }
    updateVoiceButton();
    persistGame("소리 설정 저장");
  });
}

const initialSavedGame = loadSavedGame();
state.controlMode = normalizeControlMode(initialSavedGame?.controlMode ?? getStoredControlMode());
resetState({ clearSave: false });
applyDeviceCss(initialDeviceProfile);
applyResponsiveCanvasProfile();
setupInput();
setControlMode(state.controlMode, { savePreference: false, saveGame: false });
syncFullscreenUi();
syncDeviceProfile({ force: true });
renderSidebar();
updateTouchActionLabel();
updateSaveSummary(initialSavedGame);
requestAnimationFrame(loop);
