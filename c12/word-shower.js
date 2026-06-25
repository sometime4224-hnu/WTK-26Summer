(function () {
  "use strict";

  const STORAGE_KEY = "c12_word_shower_v1";
  const TOTAL_STAGES = 12;
  const BOARD_BOTTOM = 91;
  const COMBO_TIMEOUT_MS = 1100;

  function word(id, lesson, text, kind = "word", aliases = []) {
    return { id, lesson, text, kind, aliases };
  }

  const WORD_SHOWER_ITEMS = [
    word("c10-confess", "10과", "고백", "word", ["고백하다"]),
    word("c10-date", "10과", "사귀다"),
    word("c10-meet", "10과", "선보다"),
    word("c10-propose", "10과", "청혼", "word", ["청혼하다"]),
    word("c10-love", "10과", "연애", "word", ["연애하다"]),
    word("c10-impression", "10과", "인상"),
    word("c10-condition", "10과", "조건"),
    word("c10-charm", "10과", "매력"),
    word("c10-first", "10과", "첫눈에", "fragment", ["첫 눈에"]),
    word("c10-crush", "10과", "반하다", "fragment"),
    word("c10-hand", "10과", "손잡다", "fragment", ["손을 잡다", "손 잡다"]),
    word("c10-side", "10과", "나란히", "fragment"),
    word("c10-shoulder", "10과", "어깨"),
    word("c10-arm", "10과", "팔짱"),
    word("c10-heart", "10과", "두근", "fragment", ["두근거리다"]),
    word("c10-hall", "10과", "예식장"),
    word("c10-card", "10과", "청첩장"),
    word("c10-fall-love", "10과", "사랑에 빠지다", "expression"),
    word("c10-first-love", "10과", "첫눈에 반하다", "expression", ["첫 눈에 반하다"]),
    word("c10-kind", "10과", "마음씨가 착하다", "expression"),
    word("c10-match", "10과", "성격이 잘 맞다", "expression", ["마음이 잘 맞다", "성격이 맞다"]),

    word("c11-work", "11과", "업무"),
    word("c11-pay", "11과", "시급"),
    word("c11-gender", "11과", "성별"),
    word("c11-age", "11과", "연령"),
    word("c11-career", "11과", "경험"),
    word("c11-skill", "11과", "실력"),
    word("c11-office", "11과", "직장"),
    word("c11-boss", "11과", "상사"),
    word("c11-junior", "11과", "부하"),
    word("c11-coworker", "11과", "동료"),
    word("c11-night", "11과", "야근"),
    word("c11-vacation", "11과", "휴가"),
    word("c11-salary", "11과", "급여"),
    word("c11-benefit", "11과", "복지"),
    word("c11-interview", "11과", "면접"),
    word("c11-honest", "11과", "성실", "fragment", ["성실하다"]),
    word("c11-detail", "11과", "꼼꼼", "fragment", ["꼼꼼하다"]),
    word("c11-best", "11과", "최선", "fragment"),
    word("c11-many", "11과", "경험이 많다", "expression"),
    word("c11-able", "11과", "실력이 있다", "expression"),
    word("c11-fast", "11과", "이해가 빠르다", "expression"),
    word("c11-effort", "11과", "최선을 다하다", "expression"),
    word("c11-free-time", "11과", "출퇴근 시간이 자유롭다", "expression", ["출퇴근시간이 자유롭다"]),

    word("c12-health", "12과", "건강"),
    word("c12-stamina", "12과", "체력"),
    word("c12-posture", "12과", "자세"),
    word("c12-obesity", "12과", "비만"),
    word("c12-stairs", "12과", "계단"),
    word("c12-walk", "12과", "걷기"),
    word("c12-exercise", "12과", "운동"),
    word("c12-ache", "12과", "몸살"),
    word("c12-muscle", "12과", "근육"),
    word("c12-sweat", "12과", "땀"),
    word("c12-breath", "12과", "숨"),
    word("c12-cramp", "12과", "쥐"),
    word("c12-energy", "12과", "기운"),
    word("c12-fresh", "12과", "상쾌", "fragment", ["상쾌하다"]),
    word("c12-waist", "12과", "허리"),
    word("c12-neck", "12과", "목"),
    word("c12-light", "12과", "몸이 가볍다", "expression"),
    word("c12-heavy", "12과", "몸이 무겁다", "expression"),
    word("c12-hard-breath", "12과", "숨이 차다", "expression"),
    word("c12-cramp-full", "12과", "쥐가 나다", "expression"),
    word("c12-refresh", "12과", "기분이 상쾌하다", "expression"),
    word("c12-stress", "12과", "스트레스를 해소하다", "expression")
  ];

  const byId = Object.fromEntries(WORD_SHOWER_ITEMS.map((item) => [item.id, item]));

  function ids(list) {
    return list.map((id) => byId[id]).filter(Boolean);
  }

  const WORD_SHOWER_STAGES = [
    {
      id: "c10-short",
      lesson: "10과",
      title: "첫 만남 짧은 어휘",
      type: "짧은 어휘",
      target: 9,
      spawnMs: 1600,
      maxActive: 5,
      speed: 7.0,
      items: ids(["c10-confess", "c10-date", "c10-meet", "c10-propose", "c10-love", "c10-impression", "c10-condition", "c10-charm", "c10-hall", "c10-card"])
    },
    {
      id: "c10-fragment",
      lesson: "10과",
      title: "사랑 표현 조각",
      type: "표현 조각",
      target: 10,
      spawnMs: 1420,
      maxActive: 6,
      speed: 7.2,
      items: ids(["c10-first", "c10-crush", "c10-hand", "c10-side", "c10-shoulder", "c10-arm", "c10-heart", "c10-confess", "c10-date"])
    },
    {
      id: "c10-boss",
      lesson: "10과",
      title: "첫 만남 중간보스",
      type: "중간보스",
      bossTitle: "첫 만남 중간보스",
      bossParts: ["첫눈에 반하다", "사랑에 빠지다", "성격이 잘 맞다", "마음씨가 착하다"],
      speed: 1.8
    },
    {
      id: "c11-short",
      lesson: "11과",
      title: "직장 생활 짧은 어휘",
      type: "짧은 어휘",
      target: 10,
      spawnMs: 1360,
      maxActive: 7,
      speed: 7.3,
      items: ids(["c11-work", "c11-pay", "c11-gender", "c11-age", "c11-career", "c11-skill", "c11-office", "c11-boss", "c11-junior", "c11-coworker", "c11-night", "c11-vacation", "c11-salary", "c11-benefit", "c11-interview"])
    },
    {
      id: "c11-fragment",
      lesson: "11과",
      title: "지원 조건 표현 조각",
      type: "표현 조각",
      target: 11,
      spawnMs: 1240,
      maxActive: 8,
      speed: 7.5,
      items: ids(["c11-honest", "c11-detail", "c11-best", "c11-career", "c11-skill", "c11-benefit", "c11-vacation", "c11-office", "c11-interview"])
    },
    {
      id: "c11-boss",
      lesson: "11과",
      title: "면접 중간보스",
      type: "중간보스",
      bossTitle: "면접 중간보스",
      bossParts: ["경험이 많다", "실력이 있다", "이해가 빠르다", "최선을 다하다"],
      speed: 1.7
    },
    {
      id: "c12-short",
      lesson: "12과",
      title: "건강 짧은 어휘",
      type: "짧은 어휘",
      target: 11,
      spawnMs: 1230,
      maxActive: 8,
      speed: 7.7,
      items: ids(["c12-health", "c12-stamina", "c12-posture", "c12-obesity", "c12-stairs", "c12-walk", "c12-exercise", "c12-ache", "c12-muscle", "c12-sweat", "c12-breath", "c12-cramp", "c12-energy", "c12-waist", "c12-neck"])
    },
    {
      id: "c12-fragment",
      lesson: "12과",
      title: "몸 상태 표현 조각",
      type: "표현 조각",
      target: 12,
      spawnMs: 1120,
      maxActive: 9,
      speed: 7.9,
      items: ids(["c12-light", "c12-heavy", "c12-hard-breath", "c12-cramp-full", "c12-refresh", "c12-stress", "c12-fresh", "c12-stairs", "c12-walk", "c12-neck", "c12-waist"])
    },
    {
      id: "c12-boss",
      lesson: "12과",
      title: "건강 중간보스",
      type: "중간보스",
      bossTitle: "건강 중간보스",
      bossParts: ["몸이 가볍다", "기분이 상쾌하다", "스트레스를 해소하다", "건강을 유지하다"],
      speed: 1.6
    },
    {
      id: "mix-short",
      lesson: "종합",
      title: "10~12과 섞어 치기",
      type: "종합 어휘",
      target: 13,
      spawnMs: 1040,
      maxActive: 10,
      speed: 8.2,
      items: ids(["c10-confess", "c10-first", "c10-crush", "c11-work", "c11-pay", "c11-career", "c11-benefit", "c12-health", "c12-stamina", "c12-stairs", "c12-neck", "c12-fresh"])
    },
    {
      id: "mix-expression",
      lesson: "종합",
      title: "표현 조각 폭우",
      type: "종합 표현",
      target: 14,
      spawnMs: 940,
      maxActive: 11,
      speed: 8.4,
      items: ids(["c10-first-love", "c10-fall-love", "c10-match", "c11-many", "c11-able", "c11-fast", "c11-effort", "c12-light", "c12-heavy", "c12-refresh", "c12-stress"])
    },
    {
      id: "final-boss",
      lesson: "종합",
      title: "문장 소나기 보스",
      type: "스테이지 보스",
      bossTitle: "문장 소나기 보스",
      bossParts: [
        "처음 만난 사람에게 첫눈에 반해서 사랑에 빠졌어요.",
        "새 직장에서 업무를 배우며 최선을 다하고 있어요.",
        "건강을 위해 계단을 이용하고 스트레칭을 합니다.",
        "몸이 가벼워지고 기분이 상쾌해져서 계속 운동하려고 해요."
      ],
      speed: 1.2
    }
  ];

  const els = {};
  const state = {
    stageIndex: 0,
    running: false,
    paused: false,
    score: 0,
    combo: 0,
    bestCombo: 0,
    lives: 5,
    hits: 0,
    misses: 0,
    active: [],
    idSeq: 0,
    lastFrameAt: 0,
    lastSpawnAt: 0,
    comboTimer: 0,
    cleared: {},
    boss: null,
    overlay: "ready",
    audio: null
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[.,!?'"“”‘’~·…:;()\[\]{}<>]/g, "")
      .replace(/\s+/g, "")
      .trim();
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function currentStage() {
    return WORD_SHOWER_STAGES[state.stageIndex] || WORD_SHOWER_STAGES[0];
  }

  function isBossStage(stage = currentStage()) {
    return Array.isArray(stage.bossParts);
  }

  function itemLength(text) {
    return Array.from(normalize(text)).length;
  }

  function speedFor(item, stage) {
    const length = itemLength(item.text);
    const longFactor = length >= 6 ? 0.56 : length >= 5 ? 0.72 : 1.08;
    return Math.max(2.4, (stage.speed || 7) * longFactor + Math.random() * 0.8);
  }

  function scoreFor(item) {
    const length = itemLength(item.text);
    const kindBonus = item.kind === "expression" ? 90 : item.kind === "fragment" ? 45 : 20;
    return length * 18 + kindBonus + Math.min(150, state.combo * 8);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved) return;
      state.stageIndex = Math.min(TOTAL_STAGES - 1, Math.max(0, Number(saved.stageIndex || 0)));
      state.score = Math.max(0, Number(saved.score || 0));
      state.bestCombo = Math.max(0, Number(saved.bestCombo || 0));
      state.cleared = saved.cleared && typeof saved.cleared === "object" ? saved.cleared : {};
    } catch (error) {}
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      stageIndex: state.stageIndex,
      score: state.score,
      bestCombo: state.bestCombo,
      cleared: state.cleared,
      savedAt: Date.now()
    }));
    if (els.savedStatus) els.savedStatus.textContent = "저장됨";
  }

  function setFeedback(message, kind = "") {
    els.feedbackText.textContent = message;
    els.feedbackText.className = `feedback${kind ? ` is-${kind}` : ""}`;
  }

  function ensureAudio() {
    if (state.audio) return state.audio;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    try {
      state.audio = new AudioContext();
      return state.audio;
    } catch (error) {
      return null;
    }
  }

  function playHit(kind = "word") {
    const audio = ensureAudio();
    if (!audio) return;
    const now = audio.currentTime;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = kind === "boss" ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(kind === "boss" ? 132 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(kind === "boss" ? 74 : 820, now + 0.09);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "boss" ? 0.16 : 0.09, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  function renderStageList() {
    els.stageList.innerHTML = WORD_SHOWER_STAGES.map((stage, index) => {
      const classes = ["stage-chip"];
      if (index === state.stageIndex) classes.push("is-active");
      if (state.cleared[stage.id]) classes.push("is-done");
      return `
        <button class="${classes.join(" ")}" type="button" data-stage-index="${index}">
          <span class="stage-chip__index">${index + 1}</span>
          <span class="stage-chip__title">
            <strong>${escapeHtml(stage.title)}</strong>
            <span>${escapeHtml(stage.lesson)}</span>
          </span>
          <span class="stage-chip__type">${escapeHtml(stage.type)}</span>
        </button>
      `;
    }).join("");
  }

  function renderStats() {
    const stage = currentStage();
    const total = isBossStage(stage) ? stage.bossParts.length : stage.target;
    const completed = isBossStage(stage) && state.boss ? state.boss.partIndex : state.hits;
    els.scoreValue.textContent = String(state.score);
    els.comboValue.textContent = `${state.combo}x`;
    els.lifeValue.textContent = "❤".repeat(Math.max(0, state.lives)) || "0";
    els.hitValue.textContent = `${Math.min(completed, total)} / ${total}`;
    els.densityValue.textContent = isBossStage(stage) ? "보스" : `${stage.maxActive}개`;
    els.progressText.textContent = `${state.stageIndex + 1} / ${TOTAL_STAGES}`;
    els.completedCount.textContent = String(Object.keys(state.cleared).length);
    els.totalCount.textContent = String(TOTAL_STAGES);
    els.reportScore.textContent = String(state.score);
    els.reportBest.textContent = `${state.bestCombo}x`;
    els.reportCleared.textContent = `${Object.keys(state.cleared).length} / ${TOTAL_STAGES}`;
    els.reportMiss.textContent = String(state.misses);
  }

  function renderStageInfo() {
    const stage = currentStage();
    els.missionTitle.textContent = isBossStage(stage) ? stage.bossTitle : stage.title;
    els.stageKicker.textContent = `${stage.lesson} · ${stage.type}`;
    els.stageHint.textContent = isBossStage(stage)
      ? "보스 문장을 순서대로 입력하세요. 긴 문장은 천천히 다가옵니다."
      : "떨어지는 단어를 그대로 입력하고 Enter를 누르세요. 짧은 단어는 빠르고 긴 표현은 느립니다.";
    const samples = isBossStage(stage) ? stage.bossParts : stage.items.map((item) => item.text);
    els.targetList.innerHTML = samples.slice(0, 12).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  }

  function renderOverlay() {
    if (!state.overlay) {
      els.boardOverlay.hidden = true;
      return;
    }
    els.boardOverlay.hidden = false;
    if (state.overlay === "ready") {
      els.overlayTitle.textContent = "Enter를 눌러 단어 소나기 시작";
      els.overlayText.textContent = "10~12과 어휘가 떨어집니다. 정확히 입력해서 화면을 가볍게 비워 보세요.";
      return;
    }
    if (state.overlay === "clear") {
      els.overlayTitle.textContent = "스테이지 클리어";
      els.overlayText.textContent = "좋습니다. 다음 스테이지에서 더 많은 어휘가 한 화면에 쌓입니다.";
      return;
    }
    if (state.overlay === "gameover") {
      els.overlayTitle.textContent = "소나기 경보";
      els.overlayText.textContent = "놓친 어휘가 많습니다. 같은 스테이지를 다시 시작해 보세요.";
      return;
    }
  }

  function renderBoss() {
    if (!state.boss) {
      els.bossLayer.innerHTML = "";
      els.gameBoard.classList.remove("is-boss");
      return;
    }
    const stage = currentStage();
    const part = stage.bossParts[state.boss.partIndex] || "";
    const hp = Math.max(0, Math.round(((stage.bossParts.length - state.boss.partIndex) / stage.bossParts.length) * 100));
    const next = stage.bossParts.slice(state.boss.partIndex + 1, state.boss.partIndex + 3);
    els.gameBoard.classList.add("is-boss");
    els.bossLayer.innerHTML = `
      <article class="boss-card" style="--boss-y: ${state.boss.y}%" data-testid="boss-card">
        <div class="boss-top">
          <strong>${escapeHtml(stage.bossTitle)}</strong>
          <span class="small-note">${state.boss.partIndex + 1} / ${stage.bossParts.length}</span>
        </div>
        <div class="boss-health" aria-label="보스 체력"><span style="--hp: ${hp}%"></span></div>
        <p class="boss-part" data-testid="boss-part">${escapeHtml(part)}</p>
        <div class="boss-queue">${next.length ? `다음: ${escapeHtml(next.join(" · "))}` : "마지막 타격입니다."}</div>
      </article>
    `;
  }

  function renderActiveItems() {
    const existing = new Map([...els.fallLayer.querySelectorAll("[data-drop-id]")].map((node) => [node.dataset.dropId, node]));
    state.active.forEach((item) => {
      let node = existing.get(String(item.dropId));
      if (!node) {
        node = document.createElement("div");
        node.className = "falling-word";
        node.dataset.dropId = String(item.dropId);
        node.dataset.kind = item.kind;
        node.dataset.text = item.text;
        node.dataset.speed = String(item.speed.toFixed(2));
        node.textContent = item.text;
        els.fallLayer.appendChild(node);
      }
      node.style.setProperty("--x", `${item.x}%`);
      node.style.setProperty("--y", `${item.y}%`);
      node.style.setProperty("--size", `${itemLength(item.text) >= 7 ? 17 : 22}px`);
      existing.delete(String(item.dropId));
    });
    existing.forEach((node) => node.remove());
  }

  function renderAll() {
    renderStageList();
    renderStageInfo();
    renderStats();
    renderActiveItems();
    renderBoss();
    renderOverlay();
  }

  function pickItem(stage) {
    const pool = stage.items || [];
    return pool[Math.floor(Math.random() * pool.length)] || WORD_SHOWER_ITEMS[0];
  }

  function spawnItem(forcedText = "") {
    const stage = currentStage();
    if (isBossStage(stage) || !state.running || state.paused) return null;
    if (state.active.length >= stage.maxActive) return null;
    const base = forcedText
      ? (WORD_SHOWER_ITEMS.find((item) => item.text === forcedText) || word(`forced-${Date.now()}`, stage.lesson, forcedText))
      : pickItem(stage);
    const drop = {
      ...base,
      dropId: ++state.idSeq,
      x: 8 + Math.random() * 84,
      y: -5 - Math.random() * 8,
      speed: speedFor(base, stage),
      createdAt: performance.now()
    };
    state.active.push(drop);
    renderActiveItems();
    return drop;
  }

  function clearActiveItems(animate = false) {
    if (animate) {
      els.fallLayer.querySelectorAll(".falling-word").forEach((node) => {
        node.classList.add("is-missed");
        window.setTimeout(() => node.remove(), 260);
      });
    } else {
      els.fallLayer.innerHTML = "";
    }
    state.active = [];
  }

  function summonBoss() {
    const stage = currentStage();
    if (!isBossStage(stage)) return;
    clearActiveItems(true);
    state.boss = {
      partIndex: 0,
      y: 10,
      lastY: performance.now()
    };
    state.running = true;
    state.paused = false;
    state.overlay = "";
    setFeedback("보스 등장! 긴 표현은 천천히 다가옵니다.", "warn");
    renderAll();
  }

  function startStage(index = state.stageIndex) {
    state.stageIndex = Math.min(TOTAL_STAGES - 1, Math.max(0, Number(index) || 0));
    state.running = true;
    state.paused = false;
    state.lives = 5;
    state.hits = 0;
    state.combo = 0;
    state.boss = null;
    state.overlay = "";
    state.lastFrameAt = performance.now();
    state.lastSpawnAt = performance.now() - 9999;
    clearActiveItems();
    const stage = currentStage();
    setFeedback(isBossStage(stage) ? "보스 문장을 순서대로 입력하세요." : "단어를 입력하고 Enter를 누르세요.", "");
    if (isBossStage(stage)) {
      summonBoss();
    } else {
      spawnItem();
      renderAll();
    }
    els.answerInput.focus({ preventScroll: true });
    saveState();
  }

  function pauseStage() {
    if (!state.running) return;
    state.paused = !state.paused;
    state.lastFrameAt = performance.now();
    setFeedback(state.paused ? "잠시 멈춤" : "다시 시작", state.paused ? "warn" : "good");
    renderOverlay();
  }

  function completeStage() {
    const stage = currentStage();
    state.running = false;
    state.paused = false;
    state.overlay = "clear";
    state.cleared[stage.id] = true;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    clearActiveItems();
    state.boss = null;
    setFeedback("스테이지 클리어! 다음 단계로 넘어갈 수 있습니다.", "good");
    saveState();
    renderAll();
  }

  function gameOver() {
    state.running = false;
    state.paused = false;
    state.overlay = "gameover";
    clearActiveItems(true);
    state.boss = null;
    setFeedback("어휘가 너무 많이 바닥에 닿았습니다. 다시 도전하세요.", "danger");
    renderAll();
  }

  function nextStage() {
    if (state.stageIndex < TOTAL_STAGES - 1) {
      startStage(state.stageIndex + 1);
    } else {
      state.overlay = "clear";
      setFeedback("모든 단어 소나기를 통과했습니다.", "good");
      renderAll();
    }
  }

  function setStage(index) {
    state.stageIndex = Math.min(TOTAL_STAGES - 1, Math.max(0, Number(index) || 0));
    state.running = false;
    state.paused = false;
    state.overlay = "ready";
    state.combo = 0;
    state.hits = 0;
    state.lives = 5;
    state.boss = null;
    clearActiveItems();
    setFeedback("스테이지를 골랐습니다. Enter를 누르면 시작합니다.");
    renderAll();
    saveState();
  }

  function resetGame() {
    localStorage.removeItem(STORAGE_KEY);
    state.stageIndex = 0;
    state.running = false;
    state.paused = false;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.lives = 5;
    state.hits = 0;
    state.misses = 0;
    state.cleared = {};
    state.boss = null;
    state.overlay = "ready";
    clearActiveItems();
    setFeedback("처음부터 다시 시작합니다.");
    renderAll();
    els.answerInput.focus({ preventScroll: true });
  }

  function showImpact(x, y, text) {
    const node = document.createElement("div");
    node.className = "impact";
    node.style.setProperty("--x", `${x}%`);
    node.style.setProperty("--y", `${y}%`);
    node.textContent = text;
    els.impactLayer.appendChild(node);
    window.setTimeout(() => node.remove(), 720);
  }

  function flashCombo() {
    if (state.combo < 2) return;
    els.comboBanner.textContent = `${state.combo} COMBO`;
    els.comboBanner.classList.add("is-visible");
    window.clearTimeout(state.comboTimer);
    state.comboTimer = window.setTimeout(() => els.comboBanner.classList.remove("is-visible"), COMBO_TIMEOUT_MS);
  }

  function hitItem(drop) {
    const score = scoreFor(drop);
    state.score += score;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.hits += 1;
    state.active = state.active.filter((item) => item.dropId !== drop.dropId);
    const node = els.fallLayer.querySelector(`[data-drop-id="${drop.dropId}"]`);
    if (node) {
      node.classList.add("is-hit");
      window.setTimeout(() => node.remove(), 360);
    }
    els.gameBoard.classList.remove("is-hit");
    void els.gameBoard.offsetWidth;
    els.gameBoard.classList.add("is-hit");
    showImpact(drop.x, drop.y, `+${score}`);
    playHit("word");
    flashCombo();
    setFeedback(`${drop.text} 격파!`, "good");
    const stage = currentStage();
    if (state.hits >= stage.target) {
      completeStage();
    } else {
      renderStats();
    }
  }

  function hitBoss() {
    const stage = currentStage();
    if (!state.boss) return;
    const part = stage.bossParts[state.boss.partIndex];
    const gain = 260 + itemLength(part) * 14 + state.combo * 12;
    state.score += gain;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.boss.partIndex += 1;
    els.gameBoard.classList.remove("is-hit");
    void els.gameBoard.offsetWidth;
    els.gameBoard.classList.add("is-hit");
    showImpact(50, state.boss.y + 12, `BOSS -${gain}`);
    playHit("boss");
    flashCombo();
    const card = els.bossLayer.querySelector(".boss-card");
    if (card) {
      card.classList.remove("is-hit");
      void card.offsetWidth;
      card.classList.add("is-hit");
    }
    if (state.boss.partIndex >= stage.bossParts.length) {
      completeStage();
      return;
    }
    setFeedback("강타 성공! 다음 보스 표현을 입력하세요.", "good");
    renderBoss();
    renderStats();
  }

  function allAcceptedValues(item) {
    return [item.text, ...(item.aliases || [])].map(normalize);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = normalize(els.answerInput.value);
    if (!input) return;
    if (!state.running) {
      startStage();
      els.answerInput.value = "";
      return;
    }
    if (state.paused) return;

    if (state.boss) {
      const part = currentStage().bossParts[state.boss.partIndex] || "";
      if (normalize(part) === input) {
        els.answerInput.value = "";
        hitBoss();
      } else {
        state.combo = 0;
        setFeedback("보스 표현과 정확히 맞지 않습니다.", "warn");
        renderStats();
      }
      return;
    }

    const match = state.active
      .slice()
      .sort((a, b) => b.y - a.y)
      .find((item) => allAcceptedValues(item).includes(input));
    if (match) {
      els.answerInput.value = "";
      hitItem(match);
    } else {
      state.combo = 0;
      setFeedback("화면에 있는 어휘와 맞지 않습니다.", "warn");
      renderStats();
    }
  }

  function updateFrame(timestamp) {
    const delta = Math.min(0.08, Math.max(0, (timestamp - state.lastFrameAt) / 1000 || 0));
    state.lastFrameAt = timestamp;

    if (state.running && !state.paused) {
      const stage = currentStage();
      if (state.boss) {
        state.boss.y += (stage.speed || 3) * delta;
        if (state.boss.y > 67) {
          state.lives -= 1;
          state.boss.y = 12;
          state.combo = 0;
          state.misses += 1;
          setFeedback("보스가 가까이 왔습니다. 다시 밀어내세요.", "danger");
          if (state.lives <= 0) gameOver();
        }
        renderBoss();
        renderStats();
      } else if (!isBossStage(stage)) {
        if (timestamp - state.lastSpawnAt > stage.spawnMs && state.active.length < stage.maxActive) {
          spawnItem();
          state.lastSpawnAt = timestamp;
        }
        const missed = [];
        state.active.forEach((item) => {
          item.y += item.speed * delta;
          if (item.y >= BOARD_BOTTOM) missed.push(item);
        });
        if (missed.length) {
          missed.forEach((drop) => {
            state.active = state.active.filter((item) => item.dropId !== drop.dropId);
            const node = els.fallLayer.querySelector(`[data-drop-id="${drop.dropId}"]`);
            if (node) {
              node.classList.add("is-missed");
              window.setTimeout(() => node.remove(), 260);
            }
            state.lives -= 1;
            state.misses += 1;
            state.combo = 0;
          });
          setFeedback("놓친 어휘가 있습니다.", "danger");
          if (state.lives <= 0) gameOver();
        }
        renderActiveItems();
        renderStats();
      }
    }

    window.requestAnimationFrame(updateFrame);
  }

  function bindEvents() {
    els.inputForm.addEventListener("submit", handleSubmit);
    els.startButton.addEventListener("click", () => startStage());
    els.pauseButton.addEventListener("click", pauseStage);
    els.nextButton.addEventListener("click", nextStage);
    els.resetButton.addEventListener("click", resetGame);
    els.reportButton.addEventListener("click", () => {
      els.reportPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    document.addEventListener("click", (event) => {
      const stageButton = event.target.closest("[data-stage-index]");
      if (stageButton) setStage(stageButton.dataset.stageIndex);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (event.target === els.answerInput) return;
      event.preventDefault();
      if (state.overlay === "clear") nextStage();
      else startStage();
    });
  }

  function collectElements() {
    [
      "savedStatus",
      "stageTotal",
      "stageList",
      "missionTitle",
      "stageKicker",
      "stageHint",
      "progressText",
      "scoreValue",
      "comboValue",
      "lifeValue",
      "hitValue",
      "densityValue",
      "gameBoard",
      "fallLayer",
      "impactLayer",
      "bossLayer",
      "boardOverlay",
      "overlayTitle",
      "overlayText",
      "comboBanner",
      "inputForm",
      "answerInput",
      "feedbackText",
      "startButton",
      "pauseButton",
      "nextButton",
      "resetButton",
      "reportButton",
      "reportPanel",
      "reportScore",
      "reportBest",
      "reportCleared",
      "reportMiss",
      "targetList",
      "completedCount",
      "totalCount"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function init() {
    collectElements();
    loadState();
    els.stageTotal.textContent = `${TOTAL_STAGES} 스테이지`;
    setFeedback("Enter를 누르거나 시작 버튼을 눌러 단어 소나기를 시작하세요.");
    renderAll();
    bindEvents();
    window.requestAnimationFrame((timestamp) => {
      state.lastFrameAt = timestamp;
      state.lastSpawnAt = timestamp;
      window.requestAnimationFrame(updateFrame);
    });
    window.requestAnimationFrame(() => els.answerInput.focus({ preventScroll: true }));
  }

  window.__WORD_SHOWER__ = {
    getItems() {
      return JSON.parse(JSON.stringify(WORD_SHOWER_ITEMS));
    },
    getStages() {
      return JSON.parse(JSON.stringify(WORD_SHOWER_STAGES));
    },
    getState() {
      return JSON.parse(JSON.stringify({
        stageIndex: state.stageIndex,
        running: state.running,
        score: state.score,
        combo: state.combo,
        lives: state.lives,
        hits: state.hits,
        active: state.active,
        boss: state.boss,
        cleared: state.cleared
      }));
    },
    normalize,
    startStage,
    setStage,
    forceSpawn(text) {
      if (!state.running || isBossStage()) startStage(state.stageIndex);
      return spawnItem(text);
    },
    summonBoss,
    clearStorage() {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  window.__C12_WRITING_SHOWER__ = {
    getLevels() {
      return window.__WORD_SHOWER__.getStages();
    },
    getState() {
      return window.__WORD_SHOWER__.getState();
    },
    getSummary() {
      return {
        total: Object.keys(state.cleared).length,
        score: state.score,
        bestCombo: state.bestCombo
      };
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
