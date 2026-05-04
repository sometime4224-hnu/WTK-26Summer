(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const ui = {
    questTitle: document.getElementById("questTitle"),
    questDetail: document.getElementById("questDetail"),
    clockText: document.getElementById("clockText"),
    stageText: document.getElementById("stageText"),
    warmthText: document.getElementById("warmthText"),
    basketText: document.getElementById("basketText"),
    miniMap: document.getElementById("miniMap"),
    prompt: document.getElementById("prompt"),
    toast: document.getElementById("toast"),
    dialogue: document.getElementById("dialogue"),
    speakerName: document.getElementById("speakerName"),
    dialogueText: document.getElementById("dialogueText"),
    dialogueNext: document.getElementById("dialogueNext"),
    finishCard: document.getElementById("finishCard"),
    finishSummary: document.getElementById("finishSummary"),
    restartButton: document.getElementById("restartButton"),
    questList: document.getElementById("questList"),
    saveStatus: document.getElementById("saveStatus"),
    continueButton: document.getElementById("continueButton"),
    resetRunButton: document.getElementById("resetRunButton"),
    expressionList: document.getElementById("expressionList"),
    skillSummary: document.getElementById("skillSummary"),
    actionLog: document.getElementById("actionLog"),
    moveButtons: Array.from(document.querySelectorAll("[data-action='move']")),
    interactButton: document.querySelector("[data-action='interact']")
  };

  const miniMapCtx = ui.miniMap.getContext("2d");
  const BASE = { width: 960, height: 640 };
  const world = { width: 1440, height: 960, tile: 96 };
  const SAVE_KEY = "sodam-village-next-save-v2";
  const DAY_STAGES = [
    { at: 360, label: "아침" },
    { at: 660, label: "낮" },
    { at: 960, label: "저녁" },
    { at: 1200, label: "밤" }
  ];
  const ASSET_ROOT = "../farming-game/assets/images";
  const assets = {
    carrot: `${ASSET_ROOT}/vegetables/produce-vegetable-02-carrot.png`,
    lettuce: `${ASSET_ROOT}/vegetables/produce-vegetable-12-lettuce.png`,
    fern: `${ASSET_ROOT}/plants/plant-24-fern.png`,
    flower: `${ASSET_ROOT}/plants/plant-12-pink-cosmos.png`,
    grass: `${ASSET_ROOT}/plants/plant-25-lawn-tuft.png`,
    appleTree: `${ASSET_ROOT}/trees/medium-plant-08-apple-tree.png`,
    mapleTree: `${ASSET_ROOT}/trees/medium-plant-02-maple-tree.png`,
    pineTree: `${ASSET_ROOT}/trees/medium-plant-03-pine-tree.png`,
    cow: `${ASSET_ROOT}/livestock/farm-01-cow.png`,
    chick: `${ASSET_ROOT}/livestock/baby-04-chick.png`
  };

  const mapRows = [
    "GGGGGGGGGGGGGGG",
    "GGGOTOGGGGGGGGG",
    "GGGGRRGGGGGGGGG",
    "GGGGRRGGGFFFWWW",
    "GGGRRRGGGFFFWWW",
    "RRRRRGGGGFFFWWW",
    "GGGRRRGGGGGGWWW",
    "GGGGRRRRRRGGGGG",
    "GGGGGGGGRRGGGGG",
    "GGGGGGGGRRGGGGG"
  ];

  const expressions = [
    { id: "goCountryside", label: "시골에 내려가다", detail: "이모와 첫 대화에서 만나는 표현" },
    { id: "gardenCare", label: "정원을 가꾸다", detail: "집 앞 꽃밭과 덤불을 손질하기" },
    { id: "lawnTrim", label: "잔디를 깎다", detail: "길가의 긴 풀을 반듯하게 정리하기" },
    { id: "plantVegetables", label: "채소를 심다", detail: "빈 고랑에 모종을 옮겨 심기" },
    { id: "growVegetables", label: "채소를 키우다", detail: "우물물을 길어 밭에 주기" },
    { id: "raiseLivestock", label: "가축을 키우다", detail: "외양간 동물에게 먹이를 나누어 주기" },
    { id: "catchFish", label: "물고기를 잡다", detail: "연못의 물결을 보고 뜰채로 건지기" },
    { id: "prepareDinner", label: "저녁상을 차리다", detail: "수확한 채소를 식탁에 올리기" }
  ];

  const quests = [
    {
      title: "이모에게 오늘 일을 듣기",
      detail: "버스 정류장 옆 이모에게 다가가 Space를 누르세요."
    },
    {
      title: "집 앞 정원을 가꾸기",
      detail: "꽃밭 주변의 손질 지점에 다가가 Space를 누르세요."
    },
    {
      title: "길가 잔디를 깎기",
      detail: "길가의 긴 풀 앞에서 Space를 눌러 잔디를 정리하세요."
    },
    {
      title: "빈 고랑에 채소를 심기",
      detail: "밭의 빛나는 빈 자리에 가서 Space를 누르세요."
    },
    {
      title: "우물물로 채소를 키우기",
      detail: "심은 채소에 물을 주면 시간이 지나며 잎이 자랍니다."
    },
    {
      title: "다 자란 채소를 바구니에 담기",
      detail: "밝게 흔들리는 작물 앞에서 Space를 누르세요."
    },
    {
      title: "가축에게 먹이를 주기",
      detail: "외양간 근처 동물에게 다가가 Space를 누르세요."
    },
    {
      title: "연못에서 물고기를 잡기",
      detail: "반짝이는 물결 앞에서 Space를 눌러 물고기를 건지세요."
    },
    {
      title: "집 앞 식탁에 저녁상을 차리기",
      detail: "수확한 바구니를 들고 집 앞 식탁으로 가세요."
    }
  ];

  const imageCache = new Map();

  function loadImage(src) {
    if (imageCache.has(src)) {
      return imageCache.get(src);
    }
    const image = new Image();
    const record = { image, ready: false, failed: false };
    image.onload = () => {
      record.ready = true;
    };
    image.onerror = () => {
      record.failed = true;
    };
    image.src = src;
    imageCache.set(src, record);
    return record;
  }

  Object.values(assets).forEach(loadImage);

  const initialCrops = [
    { id: "crop-1", x: 920, y: 378 },
    { id: "crop-2", x: 1016, y: 378 },
    { id: "crop-3", x: 1112, y: 378 },
    { id: "crop-4", x: 920, y: 474 },
    { id: "crop-5", x: 1016, y: 474 },
    { id: "crop-6", x: 1112, y: 474 }
  ];

  const initialGardenTasks = [
    { id: "garden-1", x: 330, y: 312, label: "꽃밭 손질" },
    { id: "garden-2", x: 424, y: 314, label: "덤불 다듬기" },
    { id: "garden-3", x: 518, y: 336, label: "화분 정리" }
  ];

  const initialLawnTasks = [
    { id: "lawn-1", x: 612, y: 640, label: "긴 잔디" },
    { id: "lawn-2", x: 700, y: 658, label: "길가 풀" },
    { id: "lawn-3", x: 796, y: 638, label: "마당 끝 풀" }
  ];

  const initialFishSpots = [
    { id: "fish-1", x: 1246, y: 396, label: "연못 물결" },
    { id: "fish-2", x: 1334, y: 522, label: "작은 물결" }
  ];

  const props = [
    { kind: "tree", asset: "appleTree", x: 304, y: 170, w: 110, h: 132 },
    { kind: "tree", asset: "mapleTree", x: 224, y: 250, w: 116, h: 138 },
    { kind: "tree", asset: "pineTree", x: 604, y: 178, w: 116, h: 142 },
    { kind: "flower", asset: "flower", x: 424, y: 314, w: 54, h: 54 },
    { kind: "flower", asset: "fern", x: 518, y: 336, w: 58, h: 58 },
    { kind: "animal", asset: "cow", x: 1018, y: 730, w: 124, h: 92 },
    { kind: "animal", asset: "chick", x: 1132, y: 774, w: 48, h: 48 }
  ];

  const zones = {
    aunt: {
      x: 220,
      y: 542,
      radius: 72,
      label: "이모와 이야기하기",
      lines: [
        "잘 내려왔구나. 오늘은 채소를 심고, 물을 주고, 저녁상까지 차려 보자.",
        "이 동네에서는 단어를 외우기보다 몸으로 먼저 기억하면 오래 남는단다."
      ]
    },
    dinner: {
      x: 492,
      y: 286,
      radius: 88,
      label: "저녁상 차리기"
    }
  };

  const state = {
    player: { x: 142, y: 610, r: 18, speed: 230, facing: "down", step: 0 },
    camera: { x: 0, y: 0 },
    keys: new Set(),
    touch: { up: false, down: false, left: false, right: false },
    questIndex: 0,
    warmth: 0,
    basket: 0,
    minutes: 380,
    dialogue: null,
    dialogueIndex: 0,
    completedExpressions: new Set(),
    crops: [],
    gardenTasks: [],
    lawnTasks: [],
    fishSpots: [],
    livestockFeed: 0,
    actionJob: null,
    actionLog: [],
    particles: [],
    companion: { unlocked: false, x: 114, y: 640, step: 0 },
    prompt: "",
    toast: "",
    toastTimer: 0,
    saveMessage: "자동 저장 준비",
    saveTimer: 0,
    finished: false,
    lastTime: performance.now()
  };

  function serializeState() {
    return {
      player: {
        x: state.player.x,
        y: state.player.y,
        facing: state.player.facing
      },
      questIndex: state.questIndex,
      warmth: state.warmth,
      basket: state.basket,
      minutes: state.minutes,
      completedExpressions: [...state.completedExpressions],
      crops: state.crops.map((crop) => ({
        id: crop.id,
        stage: crop.stage,
        growth: crop.growth,
        wave: crop.wave
      })),
      gardenTasks: state.gardenTasks.map((task) => ({
        id: task.id,
        done: task.done,
        wave: task.wave
      })),
      lawnTasks: state.lawnTasks.map((task) => ({
        id: task.id,
        done: task.done,
        wave: task.wave
      })),
      fishSpots: state.fishSpots.map((spot) => ({
        id: spot.id,
        caught: spot.caught,
        wave: spot.wave
      })),
      livestockFeed: state.livestockFeed,
      actionLog: state.actionLog,
      companion: { ...state.companion },
      finished: state.finished
    };
  }

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  function updateSaveUi() {
    const saved = loadSavedState();
    ui.continueButton.classList.toggle("hidden", !saved);
    ui.saveStatus.textContent = state.saveMessage;
  }

  function persistGame(reason = "자동 저장") {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
      state.saveMessage = `${reason}됨`;
    } catch (_) {
      state.saveMessage = "저장 실패";
    }
    updateSaveUi();
  }

  function clearSavedState() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (_) {
      // Ignore localStorage cleanup errors.
    }
    updateSaveUi();
  }

  function applySavedState(data) {
    if (!data) {
      return false;
    }
    state.player.x = data.player?.x ?? 142;
    state.player.y = data.player?.y ?? 610;
    state.player.facing = data.player?.facing ?? "down";
    state.player.step = 0;
    state.questIndex = data.questIndex ?? 0;
    state.warmth = data.warmth ?? 0;
    state.basket = data.basket ?? 0;
    state.minutes = data.minutes ?? 380;
    state.dialogue = null;
    state.dialogueIndex = 0;
    state.completedExpressions = new Set(data.completedExpressions ?? []);
    state.crops = initialCrops.map((crop) => {
      const savedCrop = data.crops?.find((item) => item.id === crop.id);
      return {
        ...crop,
        stage: savedCrop?.stage ?? "empty",
        growth: savedCrop?.growth ?? 0,
        wave: savedCrop?.wave ?? Math.random() * Math.PI * 2
      };
    });
    state.gardenTasks = initialGardenTasks.map((task) => {
      const savedTask = data.gardenTasks?.find((item) => item.id === task.id);
      return { ...task, done: Boolean(savedTask?.done), wave: savedTask?.wave ?? Math.random() * Math.PI * 2 };
    });
    state.lawnTasks = initialLawnTasks.map((task) => {
      const savedTask = data.lawnTasks?.find((item) => item.id === task.id);
      return { ...task, done: Boolean(savedTask?.done), wave: savedTask?.wave ?? Math.random() * Math.PI * 2 };
    });
    state.fishSpots = initialFishSpots.map((spot) => {
      const savedSpot = data.fishSpots?.find((item) => item.id === spot.id);
      return { ...spot, caught: Boolean(savedSpot?.caught), wave: savedSpot?.wave ?? Math.random() * Math.PI * 2 };
    });
    state.livestockFeed = data.livestockFeed ?? 0;
    state.actionJob = null;
    state.actionLog = Array.isArray(data.actionLog) ? data.actionLog.slice(0, 18) : [];
    state.companion = {
      unlocked: Boolean(data.companion?.unlocked),
      x: data.companion?.x ?? state.player.x - 36,
      y: data.companion?.y ?? state.player.y + 28,
      step: data.companion?.step ?? 0
    };
    state.particles = [];
    state.prompt = "";
    state.toast = "";
    state.toastTimer = 0;
    state.finished = Boolean(data.finished);
    ui.dialogue.classList.add("hidden");
    ui.finishCard.classList.toggle("hidden", !state.finished);
    state.saveMessage = "저장 불러오기 완료";
    showToast("저장 불러오기", "이전 산책 지점으로 돌아왔습니다.");
    updateQuestProgress();
    syncUi();
    return true;
  }

  function resetPrototype(options = {}) {
    const { clearSave = true } = options;
    if (clearSave) {
      clearSavedState();
    }
    state.player.x = 142;
    state.player.y = 610;
    state.player.facing = "down";
    state.player.step = 0;
    state.questIndex = 0;
    state.warmth = 0;
    state.basket = 0;
    state.minutes = 380;
    state.dialogue = null;
    state.dialogueIndex = 0;
    state.completedExpressions = new Set();
    state.crops = initialCrops.map((crop) => ({
      ...crop,
      stage: "empty",
      growth: 0,
      wave: Math.random() * Math.PI * 2
    }));
    state.gardenTasks = initialGardenTasks.map((task) => ({
      ...task,
      done: false,
      wave: Math.random() * Math.PI * 2
    }));
    state.lawnTasks = initialLawnTasks.map((task) => ({
      ...task,
      done: false,
      wave: Math.random() * Math.PI * 2
    }));
    state.fishSpots = initialFishSpots.map((spot) => ({
      ...spot,
      caught: false,
      wave: Math.random() * Math.PI * 2
    }));
    state.livestockFeed = 0;
    state.actionJob = null;
    state.actionLog = [];
    state.particles = [];
    state.companion = { unlocked: false, x: 114, y: 640, step: 0 };
    state.prompt = "";
    state.toast = "";
    state.toastTimer = 0;
    state.saveMessage = clearSave ? "새 산책 시작" : "자동 저장 준비";
    state.saveTimer = 0;
    state.finished = false;
    ui.dialogue.classList.add("hidden");
    ui.finishCard.classList.add("hidden");
    showToast("소담한 마을 NEXT", "목표 표시와 미니맵을 따라 첫 일을 시작하세요.");
    syncUi();
    if (clearSave) {
      persistGame("새 시작");
    } else {
      updateSaveUi();
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function unlockExpression(id) {
    if (!state.completedExpressions.has(id)) {
      state.completedExpressions.add(id);
      state.warmth += 8;
      if (id === "goCountryside") {
        state.companion.unlocked = true;
        state.companion.x = state.player.x - 38;
        state.companion.y = state.player.y + 28;
      }
      burst(state.player.x, state.player.y - 20, "#f4c65b", 18);
    }
  }

  function burst(x, y, color, count = 12) {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.24;
      const speed = 42 + Math.random() * 82;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 38,
        life: 0.7 + Math.random() * 0.45,
        maxLife: 1.1,
        color
      });
    }
  }

  function showToast(title, detail) {
    state.toast = `${title} · ${detail}`;
    state.toastTimer = 3.2;
    ui.toast.textContent = state.toast;
    ui.toast.classList.remove("hidden");
  }

  const actionProfiles = {
    garden: {
      title: "정원을 가꾸는 중",
      color: "#e9b86f",
      tool: "rake",
      steps: ["잡초를 골라 뽑아요", "꽃 주변 흙을 고르게 펴요", "마른 잎을 바구니에 담아요"]
    },
    lawn: {
      title: "잔디를 깎는 중",
      color: "#83b86b",
      tool: "sickle",
      steps: ["긴 풀을 눕혀 방향을 잡아요", "낫을 낮게 휘둘러 깎아요", "남은 풀 더미를 한쪽으로 모아요"]
    },
    plant: {
      title: "채소를 심는 중",
      color: "#7ab25d",
      tool: "seed",
      steps: ["호미로 얕은 홈을 내요", "씨앗을 톡톡 떨어뜨려요", "흙을 덮고 살짝 눌러요"]
    },
    water: {
      title: "채소에 물 주는 중",
      color: "#5caed6",
      tool: "watering",
      steps: ["물뿌리개를 기울여요", "줄기 주변을 촉촉하게 적셔요"]
    },
    harvest: {
      title: "채소를 수확하는 중",
      color: "#f0a94c",
      tool: "basket",
      steps: ["잎을 살짝 젖혀 확인해요", "익은 채소를 조심히 뽑아요", "흙을 털고 바구니에 담아요"]
    },
    livestock: {
      title: "가축에게 먹이 주는 중",
      color: "#dca15c",
      tool: "feed",
      steps: ["먹이통을 가까이 놓아요", "사료를 한 줌씩 부어요", "동물이 먹는지 기다려요"]
    },
    fish: {
      title: "물고기를 잡는 중",
      color: "#74bdd0",
      tool: "fishing",
      steps: ["뜰채를 물결 아래로 넣어요", "반짝이는 움직임을 따라가요", "타이밍에 맞춰 들어 올려요"]
    },
    deliver: {
      title: "저녁상을 차리는 중",
      color: "#df7b52",
      tool: "dinner",
      steps: ["수확한 재료를 식탁에 올려요", "그릇을 가지런히 놓아요", "이모와 함께 앉을 자리를 만들어요"]
    }
  };

  function getInteractionTargetId(interaction) {
    if (interaction.task) return `${interaction.type}:${interaction.task.id}`;
    if (interaction.crop) return `${interaction.type}:${interaction.crop.id}`;
    if (interaction.spot) return `${interaction.type}:${interaction.spot.id}`;
    return interaction.type;
  }

  function getInteractionPoint(interaction) {
    if (interaction.task) return interaction.task;
    if (interaction.crop) return interaction.crop;
    if (interaction.spot) return interaction.spot;
    if (interaction.type === "livestock") return { x: 1018, y: 730 };
    if (interaction.type === "deliver") return zones.dinner;
    return state.player;
  }

  function makeActionPrompt(job) {
    const nextStep = job.steps[Math.min(job.progress, job.steps.length - 1)];
    return `${getInteractionModeLabel(job.mode)} · Space/E - ${nextStep} · 노란 구간에 맞춰 누르기 (${job.progress}/${job.steps.length})`;
  }

  function getActionNeedle(job, now = performance.now()) {
    const elapsed = Math.max(0, (now - job.startedAt) / 1000);
    return (job.skillSeed + elapsed * job.skillSpeed) % 1;
  }

  function getSkillDistance(value, target) {
    const rawDistance = Math.abs(value - target);
    return Math.min(rawDistance, 1 - rawDistance);
  }

  function scoreActionPress(job) {
    const needle = getActionNeedle(job);
    const distanceFromTarget = getSkillDistance(needle, job.skillTarget);
    let grade = { id: "ok", label: "보통", score: 1, color: "#fffaf0" };
    if (distanceFromTarget <= 0.055) {
      grade = { id: "perfect", label: "정확", score: 3, color: "#fff0a6" };
    } else if (distanceFromTarget <= 0.14) {
      grade = { id: "good", label: "좋음", score: 2, color: "#cfeaa1" };
    }
    job.score += grade.score;
    job.hits.push(grade.id);
    job.lastQuality = {
      ...grade,
      needle,
      age: 0
    };
    return grade;
  }

  function getActionWarmthBonus(job) {
    if (!job || !job.hits.length) {
      return 0;
    }
    const average = job.score / job.hits.length;
    if (average >= 2.8) return 3;
    if (average >= 2) return 2;
    return 1;
  }

  function getActionLabel(type) {
    return {
      garden: "정원 가꾸기",
      lawn: "잔디 깎기",
      plant: "채소 심기",
      water: "물 주기",
      harvest: "수확하기",
      livestock: "먹이 주기",
      fish: "물고기 잡기",
      deliver: "저녁상 차리기"
    }[type] ?? "마을 일";
  }

  function getInteractionModeLabel(mode) {
    return mode === "quest" ? "추천 목표" : "자유 활동";
  }

  function getActionGrade(job) {
    if (!job || !job.hits.length) {
      return { label: "기록 없음", tone: "calm" };
    }
    const average = job.score / job.hits.length;
    if (average >= 2.8) return { label: "정확한 손맛", tone: "perfect" };
    if (average >= 2) return { label: "좋은 흐름", tone: "good" };
    return { label: "차분한 마무리", tone: "ok" };
  }

  function recordActionResult(interaction, job, bonus) {
    if (!job) {
      return;
    }
    const grade = getActionGrade(job);
    const minuteOfDay = Math.floor(state.minutes % 1440);
    state.actionLog.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: interaction.type,
      mode: interaction.mode ?? "free",
      label: getActionLabel(interaction.type),
      grade: grade.label,
      score: job.score,
      steps: job.steps.length,
      bonus,
      minute: minuteOfDay
    });
    state.actionLog = state.actionLog.slice(0, 18);
  }

  function getSkillStats() {
    const totalScore = state.actionLog.reduce((sum, item) => sum + (item.score ?? 0), 0);
    const totalBonus = state.actionLog.reduce((sum, item) => sum + (item.bonus ?? 0), 0);
    const perfectCount = state.actionLog.filter((item) => item.grade === "정확한 손맛").length;
    return {
      count: state.actionLog.length,
      totalScore,
      totalBonus,
      perfectCount
    };
  }

  function getFinishSummaryText() {
    const stats = getSkillStats();
    if (!stats.count) {
      return "아직 기록된 손맛이 없습니다.";
    }
    const mood = stats.perfectCount >= 4 ? "아주 섬세한 하루" : stats.totalScore >= 26 ? "흐름이 좋은 하루" : "차근차근 완성한 하루";
    return `${mood} · 활동 ${stats.count}개 · 손맛 ${stats.totalScore} · 온기 보너스 ${stats.totalBonus}`;
  }

  function formatLogTime(minute) {
    const hours = Math.floor(minute / 60) % 24;
    const minutes = Math.floor(minute % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function showActionPulse(job, grade) {
    const point = job.point;
    const color = grade?.color ?? job.color;
    burst(point.x, point.y - 14, color, 7 + job.progress * 2 + (grade?.score ?? 0));
    state.player.step += 0.9;
  }

  function beginActionJob(interaction) {
    const profile = actionProfiles[interaction.type];
    if (!profile) {
      return false;
    }
    const point = getInteractionPoint(interaction);
    state.actionJob = {
      type: interaction.type,
      targetId: getInteractionTargetId(interaction),
      mode: interaction.mode ?? "free",
      title: profile.title,
      tool: profile.tool,
      color: profile.color,
      steps: profile.steps,
      progress: 0,
      score: 0,
      hits: [],
      lastQuality: null,
      skillSeed: Math.random(),
      skillSpeed: 0.46 + Math.random() * 0.16,
      skillTarget: 0.72,
      skillWindow: 0.16,
      point: { x: point.x, y: point.y },
      startedAt: performance.now()
    };
    advanceActionJob(interaction);
    return true;
  }

  function cancelActionJob() {
    if (!state.actionJob) {
      return;
    }
    const title = state.actionJob.title;
    state.actionJob = null;
    showToast(title, "작업 위치에서 벗어나 잠시 멈췄습니다.");
  }

  function advanceActionJob(interaction) {
    const job = state.actionJob;
    if (!job) {
      return;
    }
    if (!interaction || getInteractionTargetId(interaction) !== job.targetId) {
      cancelActionJob();
      return;
    }

    const grade = scoreActionPress(job);
    job.progress = Math.min(job.progress + 1, job.steps.length);
    showActionPulse(job, grade);

    if (job.progress < job.steps.length) {
      return;
    }

    const completedJob = {
      ...job,
      hits: [...job.hits],
      lastQuality: job.lastQuality ? { ...job.lastQuality } : null
    };
    state.actionJob = null;
    completeInteraction(interaction, completedJob);
  }

  function getNearestCrop(predicate, maxDistance = 62) {
    let best = null;
    let bestDistance = Infinity;
    for (const crop of state.crops) {
      if (!predicate(crop)) {
        continue;
      }
      const d = distance(state.player, crop);
      if (d < maxDistance && d < bestDistance) {
        best = crop;
        bestDistance = d;
      }
    }
    return best;
  }

  function getNearestTask(collection, predicate, maxDistance = 68) {
    let best = null;
    let bestDistance = Infinity;
    for (const task of collection) {
      if (!predicate(task)) {
        continue;
      }
      const d = distance(state.player, task);
      if (d < maxDistance && d < bestDistance) {
        best = task;
        bestDistance = d;
      }
    }
    return best;
  }

  function getQuestInteraction() {
    if (state.questIndex === 0 && distance(state.player, zones.aunt) < zones.aunt.radius) {
      return { type: "aunt", mode: "quest", label: "Space - 이모와 이야기한다" };
    }
    if (state.questIndex === 1) {
      const task = getNearestTask(state.gardenTasks, (item) => !item.done);
      if (task) return { type: "garden", mode: "quest", task, label: "Space - 정원을 가꾸다" };
    }
    if (state.questIndex === 2) {
      const task = getNearestTask(state.lawnTasks, (item) => !item.done);
      if (task) return { type: "lawn", mode: "quest", task, label: "Space - 잔디를 깎다" };
    }
    if (state.questIndex === 3) {
      const crop = getNearestCrop((item) => item.stage === "empty");
      if (crop) return { type: "plant", mode: "quest", crop, label: "Space - 채소를 심다" };
    }
    if (state.questIndex === 4) {
      const crop = getNearestCrop((item) => item.stage === "planted");
      if (crop) return { type: "water", mode: "quest", crop, label: "Space - 채소를 키우다" };
    }
    if (state.questIndex === 5) {
      const crop = getNearestCrop((item) => item.stage === "ripe");
      if (crop) return { type: "harvest", mode: "quest", crop, label: "Space - 바구니에 담다" };
    }
    if (state.questIndex === 6 && state.livestockFeed < 2 && distance(state.player, { x: 1018, y: 730 }) < 100) {
      return { type: "livestock", mode: "quest", label: "Space - 가축을 키우다" };
    }
    if (state.questIndex === 7) {
      const spot = getNearestTask(state.fishSpots, (item) => !item.caught, 86);
      if (spot) return { type: "fish", mode: "quest", spot, label: "Space - 물고기를 잡다" };
    }
    if (state.questIndex === 8 && state.basket >= 3 && distance(state.player, zones.dinner) < zones.dinner.radius) {
      return { type: "deliver", mode: "quest", label: "Space - 저녁상을 차리다" };
    }
    return null;
  }

  function getFreeInteraction() {
    if (distance(state.player, zones.aunt) < zones.aunt.radius && state.questIndex === 0) {
      return { type: "aunt", mode: "quest", label: "Space - 이모와 이야기한다" };
    }

    const gardenTask = getNearestTask(state.gardenTasks, (item) => !item.done);
    if (gardenTask) return { type: "garden", mode: "free", task: gardenTask, label: "Space - 정원을 가꾸다" };

    const lawnTask = getNearestTask(state.lawnTasks, (item) => !item.done);
    if (lawnTask) return { type: "lawn", mode: "free", task: lawnTask, label: "Space - 잔디를 깎다" };

    const harvestCrop = getNearestCrop((item) => item.stage === "ripe");
    if (harvestCrop) return { type: "harvest", mode: "free", crop: harvestCrop, label: "Space - 바구니에 담다" };

    const waterCrop = getNearestCrop((item) => item.stage === "planted");
    if (waterCrop) return { type: "water", mode: "free", crop: waterCrop, label: "Space - 채소를 키우다" };

    const emptyCrop = getNearestCrop((item) => item.stage === "empty");
    if (emptyCrop) return { type: "plant", mode: "free", crop: emptyCrop, label: "Space - 채소를 심다" };

    if (state.livestockFeed < 2 && distance(state.player, { x: 1018, y: 730 }) < 100) {
      return { type: "livestock", mode: "free", label: "Space - 가축을 키우다" };
    }

    const fishSpot = getNearestTask(state.fishSpots, (item) => !item.caught, 86);
    if (fishSpot) return { type: "fish", mode: "free", spot: fishSpot, label: "Space - 물고기를 잡다" };

    if (state.basket >= 3 && distance(state.player, zones.dinner) < zones.dinner.radius) {
      return { type: "deliver", mode: "free", label: "Space - 저녁상을 차리다" };
    }

    return null;
  }

  function getCurrentInteraction() {
    if (state.finished || state.dialogue) {
      return null;
    }

    return getQuestInteraction() ?? getFreeInteraction();
  }

  function updateQuestProgress() {
    const emptyCount = state.crops.filter((crop) => crop.stage === "empty").length;
    const wateredCount = state.crops.filter((crop) => crop.stage === "watered" || crop.stage === "ripe").length;
    const ripeCount = state.crops.filter((crop) => crop.stage === "ripe").length;
    const gardenDone = state.gardenTasks.filter((task) => task.done).length;
    const lawnDone = state.lawnTasks.filter((task) => task.done).length;
    const fishCaught = state.fishSpots.filter((spot) => spot.caught).length;

    if (state.questIndex === 1 && gardenDone >= state.gardenTasks.length) {
      state.questIndex = 2;
    }
    if (state.questIndex === 2 && lawnDone >= state.lawnTasks.length) {
      state.questIndex = 3;
    }
    if (state.questIndex === 3 && emptyCount <= 3) {
      state.questIndex = 4;
    }
    if (state.questIndex === 4 && wateredCount >= 3) {
      state.questIndex = 5;
    }
    if (state.questIndex === 5 && state.basket >= 3) {
      state.questIndex = 6;
    }
    if (state.questIndex === 6 && state.livestockFeed >= 2) {
      state.questIndex = 7;
    }
    if (state.questIndex === 7 && fishCaught >= 1) {
      state.questIndex = 8;
    }

    if (state.questIndex === 1) {
      ui.questDetail.textContent = `정원 손질 ${gardenDone}/${state.gardenTasks.length} · 빛나는 지점을 찾아가세요.`;
    } else if (state.questIndex === 2) {
      ui.questDetail.textContent = `잔디 정리 ${lawnDone}/${state.lawnTasks.length} · 긴 풀 앞에서 행동하세요.`;
    } else if (state.questIndex === 3) {
      ui.questDetail.textContent = `밭의 빈 자리 ${Math.max(0, emptyCount - 3)}곳을 더 심으면 다음 단계로 넘어갑니다.`;
    } else if (state.questIndex === 4) {
      ui.questDetail.textContent = `물을 준 채소 ${wateredCount}/3 · 밝은 잎이 올라올 때까지 기다리세요.`;
    } else if (state.questIndex === 5) {
      ui.questDetail.textContent = `수확 가능한 채소 ${ripeCount}개 · 바구니 목표 ${state.basket}/3`;
    } else if (state.questIndex === 6) {
      ui.questDetail.textContent = `먹이 주기 ${state.livestockFeed}/2 · 외양간의 동물에게 다가가세요.`;
    } else if (state.questIndex === 7) {
      ui.questDetail.textContent = `물고기 ${fishCaught}/1 · 반짝이는 물결 앞에서 뜰채를 써 보세요.`;
    } else {
      ui.questDetail.textContent = quests[state.questIndex]?.detail ?? "";
    }

    ui.questTitle.textContent = quests[state.questIndex]?.title ?? "실험 완료";
  }

  function completeInteraction(interaction, actionJob = null) {
    const actionBonus = getActionWarmthBonus(actionJob);
    if (actionBonus > 0) {
      state.warmth += actionBonus;
    }
    recordActionResult(interaction, actionJob, actionBonus);

    if (interaction.type === "garden") {
      interaction.task.done = true;
      unlockExpression("gardenCare");
      state.warmth += 2;
      burst(interaction.task.x, interaction.task.y - 14, "#e9b86f", 14);
      updateQuestProgress();
      showToast("정원을 가꾸다", `${interaction.task.label}을 손질했습니다.`);
      persistGame("정원 저장");
      return;
    }

    if (interaction.type === "lawn") {
      interaction.task.done = true;
      unlockExpression("lawnTrim");
      state.warmth += 2;
      burst(interaction.task.x, interaction.task.y - 8, "#83b86b", 14);
      updateQuestProgress();
      showToast("잔디를 깎다", `${interaction.task.label}이 반듯해졌습니다.`);
      persistGame("잔디 저장");
      return;
    }

    if (interaction.type === "plant") {
      interaction.crop.stage = "planted";
      interaction.crop.growth = 0.08;
      unlockExpression("plantVegetables");
      burst(interaction.crop.x, interaction.crop.y - 12, "#7ab25d", 14);
      updateQuestProgress();
      showToast("채소를 심다", "흙을 덮은 자리에 작은 모종이 앉았습니다.");
      persistGame("심기 저장");
      return;
    }

    if (interaction.type === "water") {
      interaction.crop.stage = "watered";
      interaction.crop.growth = 0.24;
      unlockExpression("growVegetables");
      burst(interaction.crop.x, interaction.crop.y - 8, "#5caed6", 18);
      updateQuestProgress();
      showToast("채소를 키우다", "촉촉해진 흙에서 잎이 조금씩 올라옵니다.");
      persistGame("물주기 저장");
      return;
    }

    if (interaction.type === "harvest") {
      interaction.crop.stage = "harvested";
      state.basket += 1;
      state.warmth += 4;
      burst(interaction.crop.x, interaction.crop.y - 18, "#f0a94c", 18);
      updateQuestProgress();
      showToast("바구니", `수확한 채소 ${state.basket}/3개를 담았습니다.`);
      persistGame("수확 저장");
      return;
    }

    if (interaction.type === "livestock") {
      state.livestockFeed += 1;
      unlockExpression("raiseLivestock");
      state.warmth += 4;
      burst(1018, 710, "#dca15c", 18);
      updateQuestProgress();
      showToast("가축을 키우다", `먹이통 ${Math.min(state.livestockFeed, 2)}/2칸을 채웠습니다.`);
      persistGame("가축 저장");
      return;
    }

    if (interaction.type === "fish") {
      interaction.spot.caught = true;
      unlockExpression("catchFish");
      state.basket += 1;
      state.warmth += 4;
      burst(interaction.spot.x, interaction.spot.y - 6, "#74bdd0", 22);
      updateQuestProgress();
      showToast("물고기를 잡다", "타이밍 좋게 뜰채를 들어 물고기를 건졌습니다.");
      persistGame("낚시 저장");
      return;
    }

    if (interaction.type === "deliver") {
      unlockExpression("prepareDinner");
      state.finished = true;
      ui.finishCard.classList.remove("hidden");
      burst(zones.dinner.x, zones.dinner.y - 30, "#df7b52", 30);
      showToast("저녁상을 차리다", "첫 실험 구역의 하루가 완성되었습니다.");
      persistGame("완료 저장");
    }
  }

  function handleInteract() {
    const interaction = getCurrentInteraction();

    if (state.actionJob) {
      advanceActionJob(interaction);
      return;
    }

    if (!interaction) {
      return;
    }

    if (interaction.type !== "aunt") {
      beginActionJob(interaction);
      return;
    }

    if (interaction.type === "aunt") {
      state.dialogue = zones.aunt;
      state.dialogueIndex = 0;
      unlockExpression("goCountryside");
      ui.speakerName.textContent = "이모";
      ui.dialogueText.textContent = state.dialogue.lines[0];
      ui.dialogue.classList.remove("hidden");
      showToast("시골에 내려가다", "이모와 첫 대화를 시작했습니다.");
      persistGame("대화 저장");
      return;
    }

    if (interaction.type === "garden") {
      interaction.task.done = true;
      unlockExpression("gardenCare");
      state.warmth += 2;
      burst(interaction.task.x, interaction.task.y - 14, "#e9b86f", 12);
      updateQuestProgress();
      showToast("정원을 가꾸다", `${interaction.task.label}을 마쳤습니다.`);
      persistGame("정원 저장");
      return;
    }

    if (interaction.type === "lawn") {
      interaction.task.done = true;
      unlockExpression("lawnTrim");
      state.warmth += 2;
      burst(interaction.task.x, interaction.task.y - 8, "#83b86b", 12);
      updateQuestProgress();
      showToast("잔디를 깎다", `${interaction.task.label}이 반듯해졌습니다.`);
      persistGame("잔디 저장");
      return;
    }

    if (interaction.type === "plant") {
      interaction.crop.stage = "planted";
      interaction.crop.growth = 0.08;
      unlockExpression("plantVegetables");
      burst(interaction.crop.x, interaction.crop.y - 12, "#7ab25d", 12);
      updateQuestProgress();
      showToast("채소를 심다", "빈 고랑에 모종이 자리를 잡았습니다.");
      persistGame("심기 저장");
      return;
    }

    if (interaction.type === "water") {
      interaction.crop.stage = "watered";
      interaction.crop.growth = 0.24;
      unlockExpression("growVegetables");
      burst(interaction.crop.x, interaction.crop.y - 8, "#5caed6", 16);
      updateQuestProgress();
      showToast("채소를 키우다", "물을 머금은 잎이 조금씩 올라옵니다.");
      persistGame("물주기 저장");
      return;
    }

    if (interaction.type === "harvest") {
      interaction.crop.stage = "harvested";
      state.basket += 1;
      state.warmth += 4;
      burst(interaction.crop.x, interaction.crop.y - 18, "#f0a94c", 14);
      updateQuestProgress();
      showToast("바구니", `수확한 채소 ${state.basket}/3개를 담았습니다.`);
      persistGame("수확 저장");
      return;
    }

    if (interaction.type === "livestock") {
      state.livestockFeed += 1;
      unlockExpression("raiseLivestock");
      state.warmth += 4;
      burst(1018, 710, "#dca15c", 16);
      updateQuestProgress();
      showToast("가축을 키우다", `먹이통 ${Math.min(state.livestockFeed, 2)}/2칸을 채웠습니다.`);
      persistGame("가축 저장");
      return;
    }

    if (interaction.type === "fish") {
      interaction.spot.caught = true;
      unlockExpression("catchFish");
      state.basket += 1;
      state.warmth += 4;
      burst(interaction.spot.x, interaction.spot.y - 6, "#74bdd0", 18);
      updateQuestProgress();
      showToast("물고기를 잡다", "반짝이는 물결에서 물고기를 건졌습니다.");
      persistGame("낚시 저장");
      return;
    }

    if (interaction.type === "deliver") {
      unlockExpression("prepareDinner");
      state.finished = true;
      ui.finishCard.classList.remove("hidden");
      burst(zones.dinner.x, zones.dinner.y - 30, "#df7b52", 28);
      showToast("저녁상을 차리다", "첫 실험 구역의 흐름이 완성되었습니다.");
      persistGame("완료 저장");
    }
  }

  function nextDialogue() {
    if (!state.dialogue) {
      return;
    }
    state.dialogueIndex += 1;
    if (state.dialogueIndex >= state.dialogue.lines.length) {
      state.dialogue = null;
      state.questIndex = Math.max(state.questIndex, 1);
      ui.dialogue.classList.add("hidden");
      updateQuestProgress();
      persistGame("대화 저장");
      return;
    }
    ui.dialogueText.textContent = state.dialogue.lines[state.dialogueIndex];
  }

  function getMoveIntent() {
    let x = 0;
    let y = 0;
    if (state.keys.has("ArrowLeft") || state.keys.has("KeyA") || state.touch.left) x -= 1;
    if (state.keys.has("ArrowRight") || state.keys.has("KeyD") || state.touch.right) x += 1;
    if (state.keys.has("ArrowUp") || state.keys.has("KeyW") || state.touch.up) y -= 1;
    if (state.keys.has("ArrowDown") || state.keys.has("KeyS") || state.touch.down) y += 1;
    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }
    return { x, y };
  }

  function update(dt) {
    state.minutes += dt * 1.8;
    if (state.toastTimer > 0) {
      state.toastTimer -= dt;
      if (state.toastTimer <= 0) {
        ui.toast.classList.add("hidden");
      }
    }

    state.saveTimer += dt;
    if (state.saveTimer >= 8) {
      state.saveTimer = 0;
      persistGame("자동 저장");
    }

    state.crops.forEach((crop) => {
      crop.wave += dt * 2;
      if (crop.stage === "watered") {
        crop.growth = Math.min(1, crop.growth + dt * 0.18);
        if (crop.growth >= 1) {
          crop.stage = "ripe";
          burst(crop.x, crop.y - 20, "#75ad54", 10);
        }
      }
    });

    state.gardenTasks.forEach((task) => {
      task.wave += dt * (task.done ? 1.2 : 2.4);
    });
    state.lawnTasks.forEach((task) => {
      task.wave += dt * (task.done ? 0.8 : 2.8);
    });
    state.fishSpots.forEach((spot) => {
      spot.wave += dt * (spot.caught ? 0.6 : 3.2);
    });

    if (state.companion.unlocked) {
      const targetX = state.player.x - (state.player.facing === "right" ? 44 : state.player.facing === "left" ? -44 : 34);
      const targetY = state.player.y + 34;
      const ease = 1 - Math.exp(-dt * 5.6);
      state.companion.x += (targetX - state.companion.x) * ease;
      state.companion.y += (targetY - state.companion.y) * ease;
      state.companion.step += dt * 5.2;
    }

    state.particles = state.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx * dt,
        y: particle.y + particle.vy * dt,
        vy: particle.vy + 110 * dt,
        life: particle.life - dt
      }))
      .filter((particle) => particle.life > 0);

    if (!state.dialogue && !state.finished && !state.actionJob) {
      const intent = getMoveIntent();
      if (intent.x || intent.y) {
        state.player.x = clamp(state.player.x + intent.x * state.player.speed * dt, 56, world.width - 56);
        state.player.y = clamp(state.player.y + intent.y * state.player.speed * dt, 88, world.height - 56);
        state.player.step += dt * 8;
        if (Math.abs(intent.x) > Math.abs(intent.y)) {
          state.player.facing = intent.x > 0 ? "right" : "left";
        } else {
          state.player.facing = intent.y > 0 ? "down" : "up";
        }
      }
    }

    state.camera.x += (clamp(state.player.x - BASE.width / 2, 0, world.width - BASE.width) - state.camera.x) * 0.12;
    state.camera.y += (clamp(state.player.y - BASE.height / 2, 0, world.height - BASE.height) - state.camera.y) * 0.12;

    const interaction = getCurrentInteraction();
    state.prompt = state.actionJob ? makeActionPrompt(state.actionJob) : (interaction?.label ?? "");
    updateQuestProgress();
    syncUi();
  }

  function drawImageAsset(name, x, y, w, h, options = {}) {
    const record = loadImage(assets[name]);
    if (!record.ready || record.failed) {
      return false;
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(x, y);
    if (options.flip) {
      ctx.scale(-1, 1);
    }
    ctx.globalAlpha = options.alpha ?? 1;
    ctx.drawImage(record.image, -w / 2, -h, w, h);
    ctx.restore();
    return true;
  }

  function roundRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawTile(tile, x, y, time) {
    const size = world.tile;
    if (tile === "R") {
      ctx.fillStyle = "#c9b48d";
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "rgba(108, 91, 61, 0.08)";
      for (let i = 0; i < 7; i += 1) {
        ctx.fillRect(x + ((i * 31 + y) % size), y + 14 + i * 11, 18, 3);
      }
      return;
    }
    if (tile === "F") {
      ctx.fillStyle = "#8b6440";
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = "rgba(67, 39, 22, 0.22)";
      ctx.lineWidth = 3;
      for (let row = 18; row < size; row += 22) {
        ctx.beginPath();
        ctx.moveTo(x + 8, y + row + Math.sin(time * 2 + row) * 1.5);
        ctx.lineTo(x + size - 8, y + row);
        ctx.stroke();
      }
      return;
    }
    if (tile === "W") {
      const wave = Math.sin(time * 1.8 + x * 0.02 + y * 0.01) * 5;
      ctx.fillStyle = "#74bdd0";
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.lineWidth = 2;
      for (let row = 24; row < size; row += 28) {
        ctx.beginPath();
        ctx.moveTo(x + 10, y + row + wave);
        ctx.quadraticCurveTo(x + size / 2, y + row - 8, x + size - 12, y + row + wave * 0.4);
        ctx.stroke();
      }
      return;
    }
    if (tile === "O") {
      ctx.fillStyle = "#79af64";
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "rgba(243, 212, 95, 0.2)";
      ctx.beginPath();
      ctx.ellipse(x + 46, y + 50, 36, 20, -0.2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    if (tile === "T") {
      ctx.fillStyle = "#7cad64";
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "rgba(255, 250, 240, 0.18)";
      ctx.fillRect(x + 14, y + 14, size - 28, size - 28);
      return;
    }
    ctx.fillStyle = (x / size + y / size) % 2 === 0 ? "#8fbd74" : "#86b56f";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    for (let i = 0; i < 8; i += 1) {
      const bladeX = x + ((i * 23 + y * 0.4) % size);
      const bladeY = y + ((i * 37 + x * 0.2) % size);
      ctx.fillRect(bladeX, bladeY, 3, 12);
    }
  }

  function drawHouse() {
    const x = zones.dinner.x - state.camera.x;
    const y = zones.dinner.y - state.camera.y;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(52, 43, 31, 0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 54, 112, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f4dfb8";
    roundRect(-74, -28, 148, 92, 14);
    ctx.fill();
    ctx.fillStyle = "#be6a46";
    ctx.beginPath();
    ctx.moveTo(-90, -24);
    ctx.lineTo(0, -92);
    ctx.lineTo(92, -24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#7a4c34";
    roundRect(-18, 18, 36, 46, 6);
    ctx.fill();
    ctx.fillStyle = "#85b9cf";
    roundRect(28, -2, 34, 28, 6);
    ctx.fill();
    ctx.fillStyle = "#d98b51";
    roundRect(-54, 68, 112, 22, 8);
    ctx.fill();
    ctx.restore();
  }

  function drawNpc(x, y) {
    const sx = x - state.camera.x;
    const sy = y - state.camera.y;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(33, 30, 25, 0.14)";
    ctx.beginPath();
    ctx.ellipse(0, 21, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#704733";
    ctx.beginPath();
    ctx.arc(0, -22, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffd6b2";
    ctx.beginPath();
    ctx.arc(0, -18, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6e496d";
    roundRect(-17, -4, 34, 42, 15);
    ctx.fill();
    ctx.fillStyle = "#fffaf0";
    ctx.fillRect(-10, 2, 20, 5);
    ctx.restore();
  }

  function drawCrop(crop) {
    const sx = crop.x - state.camera.x;
    const sy = crop.y - state.camera.y;
    const wobble = Math.sin(crop.wave) * 2;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(43, 34, 24, 0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 15, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    if (crop.stage === "empty") {
      ctx.strokeStyle = "rgba(255, 242, 176, 0.58)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 7]);
      ctx.beginPath();
      ctx.ellipse(0, 4, 28, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (crop.stage === "planted") {
      drawImageAsset("fern", sx, sy + 9, 34, 34, { alpha: 0.8 });
    } else if (crop.stage === "watered") {
      const size = 38 + crop.growth * 28;
      drawImageAsset("lettuce", sx + wobble, sy + 14, size, size, { alpha: 0.9 });
      ctx.strokeStyle = "rgba(96, 164, 202, 0.42)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 2, 24 + crop.growth * 20, -Math.PI * 0.1, Math.PI * 1.25);
      ctx.stroke();
    } else if (crop.stage === "ripe") {
      drawImageAsset("carrot", sx + wobble, sy + 18, 56, 56);
      ctx.strokeStyle = "rgba(255, 242, 176, 0.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 32 + Math.sin(crop.wave * 1.7) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawGardenTask(task) {
    const sx = task.x - state.camera.x;
    const sy = task.y - state.camera.y;
    const pulse = Math.sin(task.wave) * 2;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(43, 34, 24, 0.13)";
    ctx.beginPath();
    ctx.ellipse(0, 12, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    if (task.done) {
      drawImageAsset(task.id === "garden-2" ? "fern" : "flower", sx + pulse, sy + 18, 48, 48);
    } else {
      ctx.strokeStyle = "rgba(255, 242, 176, 0.64)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 3, 28, 16, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#587045";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * 9, 11);
        ctx.quadraticCurveTo(i * 9 + pulse, -4, i * 14, -16);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawLawnTask(task) {
    const sx = task.x - state.camera.x;
    const sy = task.y - state.camera.y;
    const sway = Math.sin(task.wave) * 3;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(43, 34, 24, 0.1)";
    ctx.beginPath();
    ctx.ellipse(0, 14, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = task.done ? "#6f9b53" : "#3f6f3f";
    ctx.lineWidth = task.done ? 3 : 5;
    ctx.lineCap = "round";
    const height = task.done ? 16 : 34;
    for (let i = -3; i <= 3; i += 1) {
      ctx.beginPath();
      ctx.moveTo(i * 7, 14);
      ctx.quadraticCurveTo(i * 7 + sway, 8 - height / 2, i * 5 + sway, 14 - height);
      ctx.stroke();
    }
    if (!task.done) {
      ctx.strokeStyle = "rgba(255, 242, 176, 0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 33, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFishSpot(spot) {
    const sx = spot.x - state.camera.x;
    const sy = spot.y - state.camera.y;
    const ripple = 18 + Math.sin(spot.wave) * 5;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.strokeStyle = spot.caught ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.62)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, ripple, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, ripple * 0.55, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
    if (!spot.caught) {
      ctx.fillStyle = "rgba(255, 238, 150, 0.78)";
      ctx.beginPath();
      ctx.arc(Math.sin(spot.wave) * 16, -5, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLivestockProgress() {
    const sx = 1018 - state.camera.x;
    const sy = 782 - state.camera.y;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(77, 51, 31, 0.2)";
    roundRect(-40, -10, 80, 20, 8);
    ctx.fill();
    ctx.fillStyle = "#dca15c";
    roundRect(-35, -7, 35 * Math.min(state.livestockFeed, 2), 14, 7);
    ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    const sx = state.player.x - state.camera.x;
    const sy = state.player.y - state.camera.y;
    const walk = Math.sin(state.player.step) * 3;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(33, 30, 25, 0.18)";
    ctx.beginPath();
    ctx.ellipse(0, 25, 25, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#314535";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-8, 21);
    ctx.lineTo(-12, 34 + walk);
    ctx.moveTo(8, 21);
    ctx.lineTo(12, 34 - walk);
    ctx.stroke();
    ctx.fillStyle = "#2d796f";
    roundRect(-18, -8, 36, 42, 15);
    ctx.fill();
    ctx.fillStyle = "#ffd7b5";
    ctx.beginPath();
    ctx.arc(0, -22, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b4034";
    ctx.beginPath();
    ctx.arc(0, -28, 15, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffaf0";
    const eyeX = state.player.facing === "left" ? -5 : state.player.facing === "right" ? 5 : 0;
    ctx.fillRect(-6 + eyeX, -23, 4, 3);
    ctx.fillRect(5 + eyeX, -23, 4, 3);
    ctx.restore();
  }

  function drawActionTool(job, time) {
    const sx = job.point.x - state.camera.x;
    const sy = job.point.y - state.camera.y;
    const swing = Math.sin(time * 12 + job.progress * 0.7);
    ctx.save();

    if (job.tool === "fishing") {
      const px = state.player.x - state.camera.x;
      const py = state.player.y - state.camera.y - 12;
      ctx.strokeStyle = "rgba(45, 75, 67, 0.82)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px + 10, py);
      ctx.quadraticCurveTo((px + sx) / 2, Math.min(py, sy) - 70, sx, sy - 10 + swing * 6);
      ctx.stroke();
      ctx.fillStyle = "#fff4a6";
      ctx.beginPath();
      ctx.arc(sx, sy - 10 + swing * 6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.translate(sx, sy - 26);
    ctx.rotate(swing * 0.18);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (job.tool === "rake") {
      ctx.strokeStyle = "#7b4a31";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-26, -48);
      ctx.lineTo(18, 4);
      ctx.stroke();
      ctx.strokeStyle = job.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(7, -8);
      ctx.lineTo(30, 16);
      for (let i = 0; i < 4; i += 1) {
        ctx.moveTo(18 + i * 5, 4 + i * 3);
        ctx.lineTo(13 + i * 5, 18 + i * 3);
      }
      ctx.stroke();
    } else if (job.tool === "sickle") {
      ctx.strokeStyle = "#7b4a31";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-8, -38);
      ctx.lineTo(6, 18);
      ctx.stroke();
      ctx.strokeStyle = job.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(12, -12, 28, Math.PI * 0.2, Math.PI * 1.12);
      ctx.stroke();
    } else if (job.tool === "seed") {
      ctx.fillStyle = "#7b4a31";
      ctx.beginPath();
      ctx.ellipse(-14, -8, 18, 10, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = job.color;
      for (let i = 0; i < 5; i += 1) {
        ctx.beginPath();
        ctx.arc(-4 + i * 7, 8 + Math.sin(time * 8 + i) * 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.tool === "watering") {
      ctx.fillStyle = "#5caed6";
      roundRect(-26, -28, 38, 24, 8);
      ctx.fill();
      ctx.strokeStyle = "#5caed6";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(16, -16, 12, -0.8, 1.2);
      ctx.stroke();
      ctx.fillStyle = "rgba(92, 174, 214, 0.75)";
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.arc(10 + i * 8, 6 + Math.sin(time * 11 + i) * 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.tool === "basket") {
      ctx.fillStyle = "#9a613b";
      roundRect(-28, -8, 56, 28, 10);
      ctx.fill();
      ctx.strokeStyle = "#744328";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -8, 22, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = job.color;
      ctx.beginPath();
      ctx.arc(6 + swing * 4, -22, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (job.tool === "feed") {
      ctx.fillStyle = "#8d5c35";
      roundRect(-30, 0, 60, 18, 9);
      ctx.fill();
      ctx.fillStyle = job.color;
      for (let i = 0; i < 10; i += 1) {
        ctx.beginPath();
        ctx.arc(-22 + i * 5, -5 + Math.sin(time * 9 + i) * 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.tool === "dinner") {
      ctx.fillStyle = "#fffaf0";
      ctx.beginPath();
      ctx.ellipse(-16, -4, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(18, 2, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = job.color;
      ctx.beginPath();
      ctx.arc(2, -12 + swing * 3, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawActionSkillMeter(job, panelWidth, y) {
    const meterX = -panelWidth / 2 + 30;
    const meterW = panelWidth - 60;
    const meterH = 13;
    const sweetW = meterW * job.skillWindow;
    const sweetCenter = meterX + meterW * job.skillTarget;
    const sweetX = sweetCenter - sweetW / 2;
    const needleX = meterX + meterW * getActionNeedle(job);

    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    roundRect(meterX, y, meterW, meterH, 7);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 225, 112, 0.9)";
    roundRect(sweetX, y - 1, sweetW, meterH + 2, 7);
    ctx.fill();

    ctx.strokeStyle = "#fffaf0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(needleX, y - 7);
    ctx.lineTo(needleX, y + meterH + 7);
    ctx.stroke();

    ctx.fillStyle = job.lastQuality?.color ?? "rgba(255, 250, 240, 0.74)";
    ctx.font = '800 11px "Malgun Gothic", sans-serif';
    ctx.fillText(job.lastQuality ? `${job.lastQuality.label} · 손맛 ${job.score}` : "노란 구간을 노려 보세요", 0, y + 34);
  }

  function drawActionProgressScene(job, panelWidth, y) {
    const sceneX = -panelWidth / 2 + 28;
    const sceneW = panelWidth - 56;
    const sceneH = 48;
    const progress = clamp(job.progress / job.steps.length, 0, 1);
    const done = job.progress;
    const total = job.steps.length;
    const pulse = job.lastQuality?.id === "perfect" ? 1 : job.lastQuality?.id === "good" ? 0.7 : 0.35;

    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    roundRect(sceneX, y, sceneW, sceneH, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    roundRect(sceneX, y, sceneW, sceneH, 14);
    ctx.clip();

    if (job.type === "lawn") {
      ctx.fillStyle = "#6ea85f";
      ctx.fillRect(sceneX, y + sceneH - 13, sceneW, 13);
      const blades = 20;
      for (let i = 0; i < blades; i += 1) {
        const x = sceneX + 11 + (i / (blades - 1)) * (sceneW - 22);
        const isCut = i < Math.round(progress * blades);
        const h = isCut ? 9 + (i % 3) : 28 + (i % 5);
        ctx.strokeStyle = isCut ? "#b7d58a" : "#2f6b31";
        ctx.lineWidth = isCut ? 3 : 4;
        ctx.beginPath();
        ctx.moveTo(x, y + sceneH - 8);
        ctx.quadraticCurveTo(x + (i % 2 ? 4 : -4), y + sceneH - h, x + (i % 2 ? 7 : -7), y + sceneH - h - 4);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255, 238, 153, 0.78)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sceneX + 10, y + sceneH - 18);
      ctx.lineTo(sceneX + 10 + sceneW * progress, y + sceneH - 18);
      ctx.stroke();
    } else if (job.type === "garden") {
      ctx.fillStyle = "#8d6840";
      roundRect(sceneX + 10, y + 16, sceneW - 20, 22, 10);
      ctx.fill();
      const patches = 9;
      for (let i = 0; i < patches; i += 1) {
        const x = sceneX + 25 + i * ((sceneW - 50) / (patches - 1));
        const cleaned = i < Math.round(progress * patches);
        if (cleaned) {
          ctx.fillStyle = i % 2 ? "#d887ad" : "#f2d876";
          ctx.beginPath();
          ctx.arc(x, y + 19 + (i % 3), 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#5d9b58";
          ctx.fillRect(x - 1, y + 23, 2, 8);
        } else {
          ctx.strokeStyle = "#345f32";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, y + 34);
          ctx.lineTo(x - 5, y + 20);
          ctx.moveTo(x, y + 34);
          ctx.lineTo(x + 6, y + 21);
          ctx.stroke();
        }
      }
    } else if (job.type === "plant") {
      ctx.fillStyle = "#7c5734";
      ctx.fillRect(sceneX + 12, y + 24, sceneW - 24, 12);
      for (let i = 0; i < total; i += 1) {
        const x = sceneX + 52 + i * ((sceneW - 104) / Math.max(1, total - 1));
        const planted = i < done;
        ctx.fillStyle = "#4f3522";
        ctx.beginPath();
        ctx.ellipse(x, y + 29, 21, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        if (planted) {
          ctx.fillStyle = "#7ab25d";
          ctx.beginPath();
          ctx.arc(x, y + 18, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#4f934f";
          ctx.fillRect(x - 1, y + 21, 2, 10);
        }
      }
    } else if (job.type === "water") {
      ctx.fillStyle = "#7c5734";
      ctx.fillRect(sceneX + 12, y + 30, sceneW - 24, 8);
      const plants = 3;
      for (let i = 0; i < plants; i += 1) {
        const x = sceneX + 54 + i * ((sceneW - 108) / (plants - 1));
        const grown = i < Math.max(1, done);
        const h = grown ? 18 + progress * 8 : 11;
        ctx.strokeStyle = "#4f934f";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y + 31);
        ctx.lineTo(x, y + 31 - h);
        ctx.stroke();
        ctx.fillStyle = grown ? "#79bf68" : "#6c9f58";
        ctx.beginPath();
        ctx.ellipse(x - 5, y + 24 - h * 0.35, 7, 4, -0.6, 0, Math.PI * 2);
        ctx.ellipse(x + 5, y + 22 - h * 0.45, 7, 4, 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(116, 189, 208, 0.82)";
      for (let i = 0; i < 9; i += 1) {
        const x = sceneX + 28 + ((i * 31) % Math.max(1, sceneW - 56));
        const dropY = y + 11 + ((i + done) % 3) * 5;
        ctx.beginPath();
        ctx.arc(x, dropY, i < progress * 9 ? 3 : 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.type === "harvest") {
      ctx.fillStyle = "#7c5734";
      ctx.fillRect(sceneX + 12, y + 30, sceneW - 24, 8);
      const plants = 6;
      for (let i = 0; i < plants; i += 1) {
        const x = sceneX + 20 + i * ((sceneW - 120) / Math.max(1, plants - 1));
        const picked = i < Math.round(progress * plants);
        if (!picked) {
          ctx.fillStyle = "#f0a94c";
          ctx.beginPath();
          ctx.arc(x, y + 22, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#5f9f4e";
          ctx.fillRect(x - 1, y + 23, 2, 10);
        }
      }
      ctx.fillStyle = "#9a613b";
      roundRect(sceneX + sceneW - 78, y + 18, 58, 20, 9);
      ctx.fill();
      ctx.fillStyle = "#f0a94c";
      for (let i = 0; i < Math.round(progress * 5); i += 1) {
        ctx.beginPath();
        ctx.arc(sceneX + sceneW - 64 + i * 9, y + 18 - (i % 2) * 3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.type === "livestock") {
      ctx.fillStyle = "#8d5c35";
      roundRect(sceneX + 36, y + 24, sceneW - 72, 16, 8);
      ctx.fill();
      ctx.fillStyle = "#dca15c";
      roundRect(sceneX + 42, y + 27, (sceneW - 84) * progress, 10, 5);
      ctx.fill();
      ctx.fillStyle = "#fff1c7";
      ctx.beginPath();
      ctx.arc(sceneX + sceneW - 44, y + 19, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6e4f35";
      ctx.fillRect(sceneX + sceneW - 51, y + 29, 14, 11);
      ctx.fillStyle = "#dca15c";
      for (let i = 0; i < Math.round(progress * 12); i += 1) {
        ctx.beginPath();
        ctx.arc(sceneX + 48 + i * 13, y + 19 + (i % 3), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (job.type === "fish") {
      ctx.fillStyle = "#69b2c8";
      ctx.fillRect(sceneX, y, sceneW, sceneH);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.ellipse(sceneX + 40 + i * 62, y + 18 + (i % 2) * 8, 22, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      const fishX = sceneX + 34 + (sceneW - 68) * progress;
      ctx.fillStyle = progress >= 1 ? "#f0a94c" : "#fff0a6";
      ctx.beginPath();
      ctx.ellipse(fishX, y + 27, 13, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fishX - 13, y + 27);
      ctx.lineTo(fishX - 24, y + 20);
      ctx.lineTo(fishX - 24, y + 34);
      ctx.closePath();
      ctx.fill();
    } else if (job.type === "deliver") {
      ctx.fillStyle = "#9c6745";
      roundRect(sceneX + 30, y + 12, sceneW - 60, 28, 10);
      ctx.fill();
      const slots = [
        { x: sceneX + 72, color: "#fffaf0" },
        { x: sceneX + sceneW / 2, color: "#f0a94c" },
        { x: sceneX + sceneW - 72, color: "#74bdd0" }
      ];
      slots.forEach((slot, index) => {
        if (index < done) {
          ctx.fillStyle = slot.color;
          ctx.beginPath();
          ctx.ellipse(slot.x, y + 25, 20, 11, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(83, 54, 35, 0.28)";
          ctx.stroke();
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.32)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(slot.x, y + 25, 20, 11, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    if (job.lastQuality) {
      ctx.strokeStyle = job.lastQuality.color;
      ctx.lineWidth = 2 + pulse;
      ctx.globalAlpha = 0.45 + pulse * 0.2;
      roundRect(sceneX + 4, y + 4, sceneW - 8, sceneH - 8, 12);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawActionJob() {
    if (!state.actionJob) {
      return;
    }
    const job = state.actionJob;
    const time = performance.now() / 1000;
    drawActionTool(job, time);

    const progressRatio = job.progress / job.steps.length;
    const panelWidth = 348;
    const panelHeight = 190;
    const sx = clamp(job.point.x - state.camera.x, panelWidth / 2 + 18, BASE.width - panelWidth / 2 - 18);
    const sy = clamp(job.point.y - state.camera.y - 156, 220, BASE.height - 202);
    const currentStep = job.steps[Math.min(job.progress, job.steps.length - 1)];

    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = "rgba(20, 33, 27, 0.86)";
    roundRect(-panelWidth / 2, -panelHeight / 2, panelWidth, panelHeight, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#fffaf0";
    ctx.textAlign = "center";
    ctx.font = '800 17px "Malgun Gothic", sans-serif';
    ctx.fillText(job.title, 0, -73);
    ctx.fillStyle = job.mode === "quest" ? "#fff0a6" : "#cfeaa1";
    ctx.font = '800 11px "Malgun Gothic", sans-serif';
    ctx.fillText(getInteractionModeLabel(job.mode), 0, -58);
    ctx.fillStyle = "rgba(255, 250, 240, 0.82)";
    ctx.font = '700 13px "Malgun Gothic", sans-serif';
    ctx.fillText(currentStep, 0, -40);

    drawActionProgressScene(job, panelWidth, -24);

    ctx.fillStyle = "rgba(255, 250, 240, 0.74)";
    ctx.font = '800 11px "Malgun Gothic", sans-serif';
    ctx.fillText(`행동 ${job.progress}/${job.steps.length}`, 0, 28);
    drawActionSkillMeter(job, panelWidth, 48);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = job.color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.48 + Math.sin(time * 9) * 0.12;
    ctx.beginPath();
    ctx.ellipse(job.point.x - state.camera.x, job.point.y - state.camera.y, 42 + progressRatio * 8, 22 + progressRatio * 4, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawCompanion() {
    if (!state.companion.unlocked) {
      return;
    }
    const sx = state.companion.x - state.camera.x;
    const sy = state.companion.y - state.camera.y;
    const hop = Math.max(0, Math.sin(state.companion.step) * 4);
    ctx.save();
    ctx.fillStyle = "rgba(33, 30, 25, 0.13)";
    ctx.beginPath();
    ctx.ellipse(sx, sy + 18, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    if (!drawImageAsset("chick", sx, sy + 24 - hop, 42, 42)) {
      ctx.translate(sx, sy - hop);
      ctx.fillStyle = "#f3c84d";
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBeacon(target) {
    const sx = target.x - state.camera.x;
    const sy = target.y - state.camera.y;
    const pulse = 1 + Math.sin(performance.now() / 220) * 0.08;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(pulse, pulse);
    ctx.strokeStyle = "rgba(255, 245, 180, 0.78)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 245, 180, 0.16)";
    ctx.fill();
    ctx.restore();
  }

  function getQuestTarget() {
    if (state.questIndex === 0) return zones.aunt;
    if (state.questIndex === 1) return state.gardenTasks.find((task) => !task.done);
    if (state.questIndex === 2) return state.lawnTasks.find((task) => !task.done);
    if (state.questIndex === 3) return state.crops.find((crop) => crop.stage === "empty");
    if (state.questIndex === 4) return state.crops.find((crop) => crop.stage === "planted");
    if (state.questIndex === 5) return state.crops.find((crop) => crop.stage === "ripe");
    if (state.questIndex === 6) return { x: 1018, y: 730 };
    if (state.questIndex === 7) return state.fishSpots.find((spot) => !spot.caught);
    if (state.questIndex === 8) return zones.dinner;
    return null;
  }

  function drawTargetGuide(target) {
    if (!target) {
      return;
    }
    const playerScreen = {
      x: state.player.x - state.camera.x,
      y: state.player.y - state.camera.y
    };
    const targetScreen = {
      x: target.x - state.camera.x,
      y: target.y - state.camera.y
    };
    const margin = 48;
    const onScreen =
      targetScreen.x >= margin &&
      targetScreen.x <= BASE.width - margin &&
      targetScreen.y >= margin &&
      targetScreen.y <= BASE.height - margin;

    if (onScreen) {
      return;
    }

    const dx = targetScreen.x - playerScreen.x;
    const dy = targetScreen.y - playerScreen.y;
    const angle = Math.atan2(dy, dx);
    const pointerX = clamp(playerScreen.x + Math.cos(angle) * 210, margin, BASE.width - margin);
    const pointerY = clamp(playerScreen.y + Math.sin(angle) * 150, margin + 66, BASE.height - margin);

    ctx.save();
    ctx.translate(pointerX, pointerY);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(210, 113, 72, 0.95)";
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-12, -11);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-12, 11);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(34, 48, 38, 0.78)";
    ctx.font = '12px "Malgun Gothic", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("목표", pointerX, pointerY - 18);
  }

  function renderMiniMap() {
    const w = ui.miniMap.width;
    const h = ui.miniMap.height;
    const scaleX = w / world.width;
    const scaleY = h / world.height;
    miniMapCtx.clearRect(0, 0, w, h);
    miniMapCtx.fillStyle = "#89b873";
    miniMapCtx.fillRect(0, 0, w, h);

    for (let row = 0; row < mapRows.length; row += 1) {
      for (let col = 0; col < mapRows[row].length; col += 1) {
        const tile = mapRows[row][col];
        const x = col * world.tile * scaleX;
        const y = row * world.tile * scaleY;
        const tw = world.tile * scaleX + 0.5;
        const th = world.tile * scaleY + 0.5;
        miniMapCtx.fillStyle =
          tile === "R"
            ? "#c9b48d"
            : tile === "F"
              ? "#8b6440"
              : tile === "W"
                ? "#69b2c8"
                : tile === "O" || tile === "T"
                  ? "#78a95f"
                  : "#8dbc72";
        miniMapCtx.fillRect(x, y, tw, th);
      }
    }

    state.crops.forEach((crop) => {
      miniMapCtx.fillStyle = crop.stage === "ripe" ? "#f0a94c" : crop.stage === "empty" ? "#f4df9d" : "#4f934f";
      miniMapCtx.beginPath();
      miniMapCtx.arc(crop.x * scaleX, crop.y * scaleY, 2.4, 0, Math.PI * 2);
      miniMapCtx.fill();
    });

    state.gardenTasks.forEach((task) => {
      miniMapCtx.fillStyle = task.done ? "#d887ad" : "#f2d876";
      miniMapCtx.fillRect(task.x * scaleX - 2, task.y * scaleY - 2, 4, 4);
    });
    state.lawnTasks.forEach((task) => {
      miniMapCtx.fillStyle = task.done ? "#5b934f" : "#315f32";
      miniMapCtx.fillRect(task.x * scaleX - 2, task.y * scaleY - 2, 4, 4);
    });
    state.fishSpots.forEach((spot) => {
      miniMapCtx.fillStyle = spot.caught ? "#b7d9e2" : "#f5e47b";
      miniMapCtx.beginPath();
      miniMapCtx.arc(spot.x * scaleX, spot.y * scaleY, 2.5, 0, Math.PI * 2);
      miniMapCtx.fill();
    });

    const target = getQuestTarget();
    if (target) {
      miniMapCtx.strokeStyle = "#d67148";
      miniMapCtx.lineWidth = 2;
      miniMapCtx.beginPath();
      miniMapCtx.arc(target.x * scaleX, target.y * scaleY, 5.5, 0, Math.PI * 2);
      miniMapCtx.stroke();
    }

    miniMapCtx.fillStyle = "#1f554f";
    miniMapCtx.beginPath();
    miniMapCtx.arc(state.player.x * scaleX, state.player.y * scaleY, 4.2, 0, Math.PI * 2);
    miniMapCtx.fill();

    miniMapCtx.strokeStyle = "rgba(255, 255, 255, 0.72)";
    miniMapCtx.lineWidth = 1;
    miniMapCtx.strokeRect(state.camera.x * scaleX, state.camera.y * scaleY, BASE.width * scaleX, BASE.height * scaleY);
  }

  function render() {
    const time = performance.now() / 1000;
    const gradient = ctx.createLinearGradient(0, 0, 0, BASE.height);
    gradient.addColorStop(0, "#b6dcf0");
    gradient.addColorStop(0.46, "#d7eab8");
    gradient.addColorStop(1, "#ecd3a6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, BASE.width, BASE.height);

    ctx.save();
    ctx.translate(-state.camera.x, -state.camera.y);
    for (let row = 0; row < mapRows.length; row += 1) {
      for (let col = 0; col < mapRows[row].length; col += 1) {
        drawTile(mapRows[row][col], col * world.tile, row * world.tile, time);
      }
    }
    ctx.restore();

    const target = getQuestTarget();
    drawTargetGuide(target);
    if (target) {
      drawBeacon(target);
    }

    const drawables = [
      { y: zones.dinner.y + 90, draw: drawHouse },
      { y: zones.aunt.y + 40, draw: () => drawNpc(zones.aunt.x, zones.aunt.y) },
      ...props.map((prop) => ({
        y: prop.y,
        draw: () => drawImageAsset(prop.asset, prop.x - state.camera.x, prop.y - state.camera.y, prop.w, prop.h)
      })),
      ...state.gardenTasks.map((task) => ({ y: task.y + 28, draw: () => drawGardenTask(task) })),
      ...state.lawnTasks.map((task) => ({ y: task.y + 30, draw: () => drawLawnTask(task) })),
      ...state.fishSpots.map((spot) => ({ y: spot.y + 8, draw: () => drawFishSpot(spot) })),
      { y: 788, draw: drawLivestockProgress },
      ...state.crops.map((crop) => ({ y: crop.y + 28, draw: () => drawCrop(crop) })),
      { y: state.companion.y + 32, draw: drawCompanion },
      { y: state.player.y + 42, draw: drawPlayer }
    ];

    drawables.sort((a, b) => a.y - b.y).forEach((item) => item.draw());

    state.particles.forEach((particle) => {
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.fillStyle = particle.color.replace(")", `, ${alpha})`).replace("rgb", "rgba");
      ctx.beginPath();
      ctx.arc(particle.x - state.camera.x, particle.y - state.camera.y, 4 * alpha, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(255, 210, 114, 0.08)";
    ctx.fillRect(0, 0, BASE.width, BASE.height);
    drawActionJob();
    renderMiniMap();
  }

  function getDayStageLabel() {
    const minuteOfDay = state.minutes % 1440;
    let label = DAY_STAGES[0].label;
    DAY_STAGES.forEach((stage) => {
      if (minuteOfDay >= stage.at) {
        label = stage.label;
      }
    });
    return label;
  }

  function syncUi() {
    const hours = Math.floor(state.minutes / 60) % 24;
    const minutes = Math.floor(state.minutes % 60);
    ui.clockText.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    ui.stageText.textContent = getDayStageLabel();
    ui.warmthText.textContent = String(state.warmth);
    ui.basketText.textContent = String(state.basket);
    ui.saveStatus.textContent = state.saveMessage;
    ui.interactButton.classList.toggle("is-working", Boolean(state.actionJob));
    ui.interactButton.textContent = state.actionJob ? "계속" : "행동";
    if (!ui.questDetail.textContent) {
      ui.questDetail.textContent = quests[state.questIndex]?.detail ?? "";
    }

    if (state.prompt) {
      ui.prompt.textContent = state.prompt;
      ui.prompt.classList.remove("hidden");
    } else {
      ui.prompt.classList.add("hidden");
    }

    const skillStats = getSkillStats();
    if (ui.skillSummary) {
      ui.skillSummary.innerHTML = `
        <div class="skill-summary__item">
          <strong>${skillStats.count}</strong>
          <span>활동 기록</span>
        </div>
        <div class="skill-summary__item">
          <strong>${skillStats.totalScore}</strong>
          <span>손맛 점수</span>
        </div>
        <div class="skill-summary__item">
          <strong>${skillStats.totalBonus}</strong>
          <span>온기 보너스</span>
        </div>
      `;
    }

    if (ui.actionLog) {
      ui.actionLog.innerHTML = state.actionLog.length
        ? state.actionLog
            .map((item) => {
              const bonus = item.bonus ? `+${item.bonus}` : "+0";
              return `
                <li>
                  <div>
                    <strong>${escapeHtml(item.label)}</strong>
                    <span>${formatLogTime(item.minute)} · ${getInteractionModeLabel(item.mode)} · ${escapeHtml(item.grade)} · 손맛 ${item.score}</span>
                  </div>
                  <em>${bonus}</em>
                </li>
              `;
            })
            .join("")
        : `<li><div><strong>아직 기록 없음</strong><span>작업을 완료하면 손맛이 쌓입니다.</span></div><em>+0</em></li>`;
    }

    if (ui.finishSummary) {
      ui.finishSummary.textContent = getFinishSummaryText();
    }

    ui.expressionList.innerHTML = expressions
      .map(
        (item) => `
          <li class="${state.completedExpressions.has(item.id) ? "is-complete" : ""}">
            <strong>${item.label}</strong>
            <span>${item.detail}</span>
          </li>
        `
      )
      .join("");

    ui.questList.innerHTML = quests
      .map((quest, index) => {
        const complete = state.finished || index < state.questIndex;
        const current = !state.finished && index === state.questIndex;
        return `
          <li class="${complete ? "is-complete" : ""} ${current ? "is-current" : ""}">
            <div>
              <strong>${quest.title}</strong>
              <span>${complete ? "완료" : current ? "진행 중" : "예정"}</span>
            </div>
          </li>
        `;
      })
      .join("");
  }

  function setupInput() {
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyA", "KeyS", "KeyD", "KeyE"].includes(event.code)) {
        event.preventDefault();
      }
      state.keys.add(event.code);
      if (!event.repeat && (event.code === "Space" || event.code === "KeyE")) {
        if (state.dialogue) {
          nextDialogue();
        } else {
          handleInteract();
        }
      }
    });
    window.addEventListener("keyup", (event) => {
      state.keys.delete(event.code);
    });

    ui.dialogueNext.addEventListener("click", nextDialogue);
    ui.restartButton.addEventListener("click", () => resetPrototype({ clearSave: true }));
    ui.resetRunButton.addEventListener("click", () => resetPrototype({ clearSave: true }));
    ui.continueButton.addEventListener("click", () => {
      applySavedState(loadSavedState());
    });
    ui.interactButton.addEventListener("click", () => {
      if (state.dialogue) {
        nextDialogue();
      } else {
        handleInteract();
      }
    });

    ui.moveButtons.forEach((button) => {
      const direction = button.dataset.dir;
      const setDirection = (value) => {
        state.touch[direction] = value;
      };
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        setDirection(true);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((type) => {
        button.addEventListener(type, () => setDirection(false));
      });
    });
  }

  function loop(now) {
    const dt = Math.min((now - state.lastTime) / 1000 || 0, 0.033);
    state.lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  window.FARMING_NEXT_PROTOTYPE = {
    state,
    getInteraction: getCurrentInteraction,
    loadSavedState,
    applySavedState
  };

  resetPrototype({ clearSave: false });
  if (loadSavedState()) {
    state.saveMessage = "저장된 산책 있음";
    updateSaveUi();
  }
  setupInput();
  requestAnimationFrame(loop);
})();
