(() => {
  "use strict";

  const config = window.GE_HADA_CAFE_GAME;
  const storageKey = "c15.grammar1.geHadaCafe.v3";
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const walkDuration = 1600;
  const workerKeys = ["A", "B", "C"];
  const actorKeys = ["boss", "manager", ...workerKeys];
  const taskOptions = buildTaskOptions();
  const directMissionCount = Number(config.directMissionCount || 5);
  const managerPracticeCount = Number(config.managerPracticeCount || 5);

  const state = {
    missionIndex: 0,
    directMissions: [],
    completed: [],
    wrongCount: 0,
    running: false,
    finished: false,
    sandboxMode: false,
    zoneLabelsVisible: true,
    selectedWorker: "",
    managerSelection: {
      subject: "",
      object: "",
      action: ""
    },
    actorPositions: {}
  };

  const refs = {
    badge: document.getElementById("missionBadge"),
    progress: document.getElementById("missionProgress"),
    score: document.getElementById("scoreText"),
    title: document.getElementById("missionTitle"),
    situation: document.getElementById("missionSituation"),
    dialogueTitle: document.getElementById("dialogueTitle"),
    instruction: document.getElementById("instructionText"),
    choices: document.getElementById("choiceGrid"),
    stageChoice: document.getElementById("stageChoicePop"),
    success: document.getElementById("successBanner"),
    successText: document.getElementById("successText"),
    successEffect: document.getElementById("successEffect"),
    feedback: document.getElementById("feedbackBox"),
    start: document.getElementById("startBtn"),
    hint: document.getElementById("hintBtn"),
    sandbox: document.getElementById("sandboxBtn"),
    zoneLabelToggle: document.getElementById("zoneLabelToggle"),
    reset: document.getElementById("resetBtn"),
    flow: document.getElementById("flowSteps"),
    speech: document.getElementById("speechPop"),
    speechSpeaker: document.getElementById("speechSpeaker"),
    speechText: document.getElementById("speechText"),
    summary: document.getElementById("summaryPanel"),
    summaryGrid: document.getElementById("summaryGrid"),
    stage: document.getElementById("cafeStage"),
    actors: {
      boss: document.getElementById("boss"),
      manager: document.getElementById("manager"),
      A: document.getElementById("workerA"),
      B: document.getElementById("workerB"),
      C: document.getElementById("workerC")
    },
    zones: {
      table: document.querySelector(".zone-table"),
      coffee: document.querySelector(".zone-coffee"),
      floor: document.querySelector(".zone-floor"),
      trash: document.querySelector(".zone-trash"),
      shelf: document.querySelector(".zone-shelf")
    }
  };

  function missionPool() {
    return Array.isArray(config.directMissionPool) ? config.directMissionPool : [];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function shuffleAwayFromOriginal(items) {
    if (items.length < 2) return [...items];
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const shuffled = shuffle(items);
      if (shuffled.every((item, index) => item !== items[index])) return shuffled;
    }
    return [...items.slice(1), items[0]];
  }

  function randomizeActorPortraits() {
    const images = actorKeys
      .map((actorKey) => refs.actors[actorKey]?.querySelector(".actor-face img"))
      .filter(Boolean);
    const sources = images.map((image) => image.getAttribute("src")).filter(Boolean);
    if (images.length !== sources.length || sources.length < 2) return;

    shuffleAwayFromOriginal(sources).forEach((source, index) => {
      images[index].src = source;
    });
  }

  function buildDirectMissionPlan() {
    const pool = missionPool();
    const selected = [];
    const selectedIds = new Set();

    workerKeys.forEach((workerKey) => {
      const workerMissions = shuffle(pool.filter((mission) => mission.target === workerKey));
      const mission = workerMissions[0];
      if (!mission) return;
      selected.push(mission);
      selectedIds.add(mission.id);
    });

    shuffle(pool)
      .filter((mission) => !selectedIds.has(mission.id))
      .slice(0, Math.max(0, directMissionCount - selected.length))
      .forEach((mission) => {
        selected.push(mission);
        selectedIds.add(mission.id);
      });

    return shuffle(selected).slice(0, directMissionCount);
  }

  function resolveMissionPlan(ids) {
    const pool = missionPool();
    const byId = new Map(pool.map((mission) => [mission.id, mission]));
    const missions = Array.isArray(ids)
      ? ids.map((id) => byId.get(id)).filter(Boolean)
      : [];
    if (missions.length === directMissionCount) return missions;
    return buildDirectMissionPlan();
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) {
        state.directMissions = buildDirectMissionPlan();
        return;
      }
      if (typeof saved.zoneLabelsVisible === "boolean") {
        state.zoneLabelsVisible = saved.zoneLabelsVisible;
      }
      if (saved.actorPositions && typeof saved.actorPositions === "object") {
        workerKeys.forEach((actorKey) => {
          const position = saved.actorPositions[actorKey];
          if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return;
          state.actorPositions[actorKey] = {
            x: Number(position.x),
            y: Number(position.y)
          };
        });
      }
      state.directMissions = resolveMissionPlan(saved.directMissionIds);
      state.completed = Array.isArray(saved.completed) ? saved.completed : [];
      state.wrongCount = Number(saved.wrongCount || 0);
      state.completed = state.completed.slice(0, totalMissionCount());
      state.missionIndex = Math.min(completedDirectCount(), Math.max(0, state.directMissions.length - 1));
      state.finished = state.completed.length >= totalMissionCount();
    } catch (error) {
      // Local progress is optional.
      state.directMissions = buildDirectMissionPlan();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        directMissionIds: state.directMissions.map((mission) => mission.id),
        completed: state.completed,
        wrongCount: state.wrongCount,
        zoneLabelsVisible: state.zoneLabelsVisible,
        actorPositions: workerKeys.reduce((positions, actorKey) => {
          if (state.actorPositions[actorKey]) {
            positions[actorKey] = state.actorPositions[actorKey];
          }
          return positions;
        }, {}),
        savedAt: new Date().toISOString()
      }));
    } catch (error) {
      // Local progress is optional.
    }
  }

  function currentMission() {
    return state.directMissions[state.missionIndex];
  }

  function totalMissionCount() {
    return state.directMissions.length + managerPracticeCount;
  }

  function completedDirectCount() {
    return state.completed.filter((record) => record.mode === "direct").length;
  }

  function completedManagerCount() {
    return state.completed.filter((record) => record.mode === "manager").length;
  }

  function isDirectPhase() {
    return !state.sandboxMode && !state.finished && completedDirectCount() < state.directMissions.length;
  }

  function isManagerPhase() {
    return !state.sandboxMode && !state.finished && completedDirectCount() >= state.directMissions.length;
  }

  function canUseManagerBuilder() {
    return state.sandboxMode || isManagerPhase();
  }

  function partsFromBossOrder(order) {
    const body = String(order || "")
      .replace(/^[ABC]가\s+/, "")
      .replace(/\s*하세요\.$/, "")
      .trim();
    const parts = body.split(/\s+/);
    return {
      object: parts[0] || "",
      action: parts.slice(1).join(" ")
    };
  }

  function buildTaskOptions() {
    const options = new Map();
    missionPool().forEach((mission) => {
      const parts = partsFromBossOrder(mission.bossOrder);
      if (!parts.object || !parts.action) return;
      const key = `${parts.object}|${parts.action}`;
      if (options.has(key)) return;
      options.set(key, {
        object: parts.object,
        action: parts.action,
        destination: mission.destination,
        workClass: mission.workClass,
        actionLabel: mission.actionLabel,
        directRequest: mission.directRequest,
        workerReply: mission.workerReply,
        completion: mission.completion
      });
    });
    return Array.from(options.values());
  }

  function findTask(object, action) {
    return taskOptions.find((task) => task.object === object && task.action === action);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function grammarHtml(value) {
    const pattern = /(V-게 하다|-게 하다|-게 했어요|(?:닦|만들|쓸|버리|정리하|000)게(?:\s*(?:하다|하세요|했어요))?|게\s*(?:하다|하세요|했어요))/g;
    return escapeHtml(value).replace(pattern, '<span class="grammar-focus">$1</span>');
  }

  function setGrammarText(element, value) {
    if (!element) return;
    element.innerHTML = grammarHtml(value);
  }

  function applyZoneLabelVisibility() {
    refs.stage.classList.toggle("is-zone-labels-hidden", !state.zoneLabelsVisible);
    if (!refs.zoneLabelToggle) return;
    refs.zoneLabelToggle.checked = state.zoneLabelsVisible;
    refs.zoneLabelToggle.setAttribute("aria-checked", String(state.zoneLabelsVisible));
  }

  function managerOrderText(selection = state.managerSelection) {
    if (!selection.subject || !selection.object || !selection.action) return "";
    return `${selection.subject}가 ${selection.object} ${selection.action} 하세요.`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function stageBaseSize() {
    const size = config.stageSize || {};
    return {
      width: Number(size.width) || 720,
      height: Number(size.height) || 590
    };
  }

  function scalePosition(position) {
    const base = stageBaseSize();
    const stageWidth = refs.stage.clientWidth || base.width;
    const stageHeight = refs.stage.clientHeight || base.height;
    const scaleX = stageWidth / base.width;
    const scaleY = stageHeight / base.height;
    return {
      x: Math.round(position.x * scaleX),
      y: Math.round(position.y * scaleY)
    };
  }

  function applyActorPosition(actorKey) {
    const actor = refs.actors[actorKey];
    const position = state.actorPositions[actorKey];
    if (!actor || !position) return;
    const scaled = scalePosition(position);
    actor.style.setProperty("--x", `${scaled.x}px`);
    actor.style.setProperty("--y", `${scaled.y}px`);
  }

  function setActorPosition(actorKey, position) {
    if (!refs.actors[actorKey] || !position) return;
    state.actorPositions[actorKey] = position;
    applyActorPosition(actorKey);
  }

  function hasActorPosition(actorKey) {
    const position = state.actorPositions[actorKey];
    return Boolean(position && Number.isFinite(position.x) && Number.isFinite(position.y));
  }

  async function moveActor(actorKey, position, duration = walkDuration) {
    const actor = refs.actors[actorKey];
    if (!actor || !position) return;
    actor.classList.add("is-walking");
    setActorPosition(actorKey, position);
    await wait(duration);
    actor.classList.remove("is-walking");
  }

  function hideSpeech() {
    refs.speech.hidden = true;
  }

  function showSpeech(speaker, text) {
    refs.speechSpeaker.textContent = speaker;
    setGrammarText(refs.speechText, text);
    refs.speech.hidden = false;
  }

  function hideStageChoice() {
    refs.stageChoice.hidden = true;
    refs.stageChoice.innerHTML = "";
    refs.stageChoice.className = "stage-choice-pop";
    refs.stageChoice.removeAttribute("style");
  }

  function hideSuccess() {
    refs.success.hidden = true;
    refs.success.classList.remove("is-showing");
    refs.successEffect.hidden = true;
    refs.successEffect.classList.remove("is-showing");
  }

  function showSuccess(text) {
    setGrammarText(refs.successText, text);
    refs.success.hidden = false;
    refs.success.classList.remove("is-showing");
    refs.successEffect.hidden = false;
    refs.successEffect.classList.remove("is-showing");
    void refs.success.offsetWidth;
    refs.success.classList.add("is-showing");
    refs.successEffect.classList.add("is-showing");
  }

  function setFeedback(text, tone = "") {
    refs.feedback.className = tone ? `feedback ${tone}` : "feedback";
    setGrammarText(refs.feedback, text);
  }

  function clearZoneStates() {
    Object.values(refs.zones).forEach((zone) => {
      if (!zone) return;
      zone.classList.remove("is-target", "is-done");
    });
  }

  function setTargetZone(zoneKey) {
    clearZoneStates();
    const zone = refs.zones[zoneKey];
    if (zone) zone.classList.add("is-target");
  }

  function markZoneDone(zoneKey) {
    const zone = refs.zones[zoneKey];
    if (!zone) return;
    zone.classList.remove("is-target");
    zone.classList.add("is-done");
  }

  function updateFlow(stepIndex) {
    const items = Array.from(refs.flow.querySelectorAll("li"));
    items.forEach((item, index) => {
      item.classList.toggle("is-done", index < stepIndex);
      item.classList.toggle("is-current", index === stepIndex);
    });
  }

  function updateFlowLabels(managerPhase) {
    const labels = managerPhase
      ? [
          "매니저에게 지시문을 만들어요.",
          "매니저가 직원에게 부탁해요.",
          "직원이 행동하고 -게 했어요 문장을 확인해요."
        ]
      : [
          "직원을 고르고 부탁을 선택해요.",
          "직원이 부탁을 듣고 움직여요.",
          "행동 후 -게 했어요 문장을 확인해요."
        ];
    Array.from(refs.flow.querySelectorAll("li")).forEach((item, index) => {
      setGrammarText(item, labels[index] || "");
    });
  }

  function resetActorHighlights() {
    Object.values(refs.actors).forEach((actor) => {
      actor.classList.remove("is-active", "is-choice-target");
    });
  }

  function startPositionFor(actorKey) {
    if (actorKey === "boss" && (isManagerPhase() || state.sandboxMode)) {
      return config.positions.busyBoss || config.startPositions.boss;
    }
    return config.startPositions[actorKey];
  }

  function resetSupportActorsForScene() {
    ["boss", "manager"].forEach((actorKey) => {
      setActorPosition(actorKey, startPositionFor(actorKey));
      refs.actors[actorKey].classList.remove(
        "is-active",
        "is-choice-target",
        "is-walking",
        "is-working"
      );
    });
  }

  function resetActorsForMission(options = {}) {
    const resetWorkers = Boolean(options.resetWorkers);
    Object.keys(config.startPositions).forEach((actorKey) => {
      if (workerKeys.includes(actorKey) && !resetWorkers && hasActorPosition(actorKey)) {
        applyActorPosition(actorKey);
        return;
      }
      setActorPosition(actorKey, startPositionFor(actorKey));
    });
    Object.values(refs.actors).forEach((actor) => {
      actor.classList.remove(
        "is-active",
        "is-choice-target",
        "is-walking",
        "is-working",
        "is-cleaning",
        "is-coffee",
        "is-sweeping",
        "is-trash",
        "is-shelf"
      );
    });
    state.selectedWorker = "";
    state.managerSelection = {
      subject: "",
      object: "",
      action: ""
    };
    hideSpeech();
    hideStageChoice();
    hideSuccess();
  }

  function managerApproachPositionFor(actorKey) {
    const position = state.actorPositions[actorKey] || config.positions[actorKey] || config.startPositions[actorKey];
    const base = stageBaseSize();
    const offsetX = position.x < base.width * 0.28
      ? 84
      : position.x > base.width * 0.74
        ? -88
        : -82;
    const offsetY = position.y < base.height * 0.36 ? 58 : -18;
    return {
      x: Math.round(clamp(position.x + offsetX, 96, base.width - 128)),
      y: Math.round(clamp(position.y + offsetY, 120, base.height - 170))
    };
  }

  function requestOptionsFor(mission) {
    if (Array.isArray(mission.requestOptions) && mission.requestOptions.length) {
      return mission.requestOptions;
    }
    return [mission.directRequest].filter(Boolean);
  }

  function placeChoiceMenu() {
    const actor = refs.actors.boss;
    const position = state.actorPositions.boss || config.startPositions.boss;
    if (!actor || !position) return;

    const scaled = scalePosition(position);
    const base = stageBaseSize();
    const actorWidth = actor.offsetWidth || 64;
    const stageWidth = refs.stage.clientWidth || base.width;
    const stageHeight = refs.stage.clientHeight || base.height;
    const isBuilder = refs.stageChoice.classList.contains("is-builder");
    const menuWidth = refs.stageChoice.offsetWidth || (isBuilder ? 500 : 268);
    const minX = menuWidth / 2 + 12;
    const maxX = Math.max(minX, stageWidth - menuWidth / 2 - 12);
    const x = clamp(scaled.x + actorWidth / 2, minX, maxX);
    const menuHeight = refs.stageChoice.offsetHeight || 260;
    const menuMargin = 18;
    const y = isBuilder
      ? clamp(scaled.y + (actor.offsetHeight || 102) + 12, 24, stageHeight - menuHeight - 24)
      : clamp(scaled.y - 10, menuHeight + menuMargin, stageHeight - menuMargin);
    refs.stageChoice.style.setProperty("--choice-x", `${Math.round(x)}px`);
    refs.stageChoice.style.setProperty("--choice-y", `${Math.round(y)}px`);
  }

  function renderStageChoice(actorKey) {
    if (state.running || !workerKeys.includes(actorKey)) return;
    if (!isDirectPhase()) {
      const text = state.sandboxMode
        ? "샌드박스에서는 매니저에게 자유롭게 지시해 보세요."
        : "지금은 매니저에게 직원 관리를 부탁하세요.";
      setFeedback(text, "");
      showSpeech("나(사장)", text);
      return;
    }
    const mission = currentMission();
    const worker = config.workers[actorKey];

    state.selectedWorker = actorKey;
    resetActorHighlights();
    refs.actors[actorKey].classList.add("is-active", "is-choice-target");
    hideSuccess();
    hideSpeech();
    updateFlow(0);
    refs.actors.boss.classList.add("is-active");
    setFeedback(`나(사장)이 ${worker.name}에게 어떤 부탁을 할까요?`, "");
    setGrammarText(refs.instruction, "나(사장) 위 선택지에서 알맞은 부탁을 고르세요.");

    refs.stageChoice.innerHTML = "";
    refs.stageChoice.className = "stage-choice-pop";
    const title = document.createElement("strong");
    title.className = "stage-choice-title";
    title.textContent = `나(사장) -> ${worker.name}`;
    refs.stageChoice.appendChild(title);

    requestOptionsFor(mission).forEach((request) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-choice-button";
      setGrammarText(button, request);
      button.addEventListener("click", () => handleRequestChoice(request, button));
      refs.stageChoice.appendChild(button);
    });

    refs.stageChoice.hidden = false;
    placeChoiceMenu();
  }

  function setStageChoiceDisabled(disabled) {
    refs.stageChoice.querySelectorAll("button").forEach((button) => {
      button.disabled = disabled;
    });
  }

  function uniqueTaskValues(key) {
    return Array.from(new Set(taskOptions.map((task) => task[key]).filter(Boolean)));
  }

  function updateManagerPreview() {
    const preview = refs.stageChoice.querySelector("[data-manager-preview]");
    const submit = refs.stageChoice.querySelector("[data-submit-manager-order]");
    if (!preview || !submit) return;

    const subject = state.managerSelection.subject ? `${state.managerSelection.subject}가` : "00가";
    const object = state.managerSelection.object || "000을";
    const action = state.managerSelection.action || "000게";
    setGrammarText(preview, `매니저 님 ${subject} ${object} ${action} 하세요.`);
    submit.disabled = !(state.managerSelection.subject && state.managerSelection.object && state.managerSelection.action);
  }

  function selectManagerSlot(slot, value, button) {
    if (state.running || !canUseManagerBuilder()) return;
    refs.stageChoice.querySelectorAll(`[data-manager-slot="${slot}"]`).forEach((item) => {
      item.classList.remove("is-selected", "wrong", "correct");
    });
    button.classList.add("is-selected");
    state.managerSelection[slot] = value;
    refs.stageChoice.querySelectorAll(".manager-choice").forEach((item) => {
      item.classList.remove("wrong", "correct");
    });
    updateManagerPreview();
  }

  function appendManagerColumn(builder, titleText, slot, options, labelFor) {
    const column = document.createElement("div");
    column.className = "manager-slot-column";

    const title = document.createElement("h4");
    title.textContent = titleText;
    column.appendChild(title);

    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "manager-choice";
      button.dataset.managerSlot = slot;
      setGrammarText(button, labelFor(option));
      button.addEventListener("click", () => selectManagerSlot(slot, option, button));
      column.appendChild(button);
    });

    builder.appendChild(column);
  }

  function renderManagerBuilder() {
    if (state.running || !canUseManagerBuilder()) return;
    resetActorHighlights();
    hideSpeech();
    hideSuccess();
    updateFlow(0);
    refs.actors.boss.classList.add("is-active");
    refs.actors.manager.classList.add("is-active", "is-choice-target");
    setGrammarText(refs.instruction, "매니저에게 시킬 일을 조합하세요.");
    setFeedback("00가 / 000을 / 000게 하세요 구조를 완성하세요.", "");

    state.managerSelection = {
      subject: "",
      object: "",
      action: ""
    };

    refs.stageChoice.innerHTML = "";
    refs.stageChoice.className = "stage-choice-pop is-builder";

    const title = document.createElement("strong");
    title.className = "stage-choice-title";
    title.textContent = "나(사장) -> 매니저";
    refs.stageChoice.appendChild(title);

    const builder = document.createElement("div");
    builder.className = "manager-builder";

    const grid = document.createElement("div");
    grid.className = "manager-slot-grid";
    appendManagerColumn(grid, "누가?", "subject", workerKeys, (subject) => `${subject}가`);
    appendManagerColumn(grid, "무엇을?", "object", uniqueTaskValues("object"), (object) => object);
    appendManagerColumn(grid, "어떻게?", "action", uniqueTaskValues("action"), (action) => action);

    const preview = document.createElement("div");
    preview.className = "manager-preview";
    preview.innerHTML = `
      <span>완성 문장</span>
      <strong data-manager-preview>${grammarHtml("매니저 님 00가 000을 000게 하세요.")}</strong>
    `;

    const submit = document.createElement("button");
    submit.type = "button";
    submit.className = "btn manager-submit";
    submit.dataset.submitManagerOrder = "true";
    submit.textContent = "매니저에게 지시하기";
    submit.disabled = true;
    submit.addEventListener("click", handleManagerOrder);

    builder.appendChild(grid);
    builder.appendChild(preview);
    builder.appendChild(submit);
    refs.stageChoice.appendChild(builder);
    refs.stageChoice.hidden = false;
    placeChoiceMenu();
  }

  async function handleManagerOrder() {
    if (state.running || !canUseManagerBuilder()) return;
    const { subject, object, action } = state.managerSelection;
    const task = findTask(object, action);

    if (!task) {
      state.wrongCount += 1;
      refs.stageChoice.querySelectorAll(".is-selected").forEach((button) => button.classList.add("wrong"));
      setFeedback("목적어와 행동이 잘 맞는지 다시 조합해 보세요.", "bad");
      saveState();
      return;
    }

    refs.stageChoice.querySelectorAll(".is-selected").forEach((button) => button.classList.add("correct"));
    setStageChoiceDisabled(true);
    state.running = true;
    refs.start.disabled = true;
    refs.hint.disabled = true;
    refs.sandbox.disabled = true;
    setFeedback("좋아요. 매니저가 지시를 전달합니다.", "good");
    await wait(360);
    hideStageChoice();
    await runManagerSequence(subject, task);
  }

  function renderMission() {
    if (state.sandboxMode) {
      renderSandbox();
      return;
    }

    const total = totalMissionCount();
    const mission = currentMission();
    const completedCount = state.completed.length;
    const directCount = completedDirectCount();
    const managerCount = completedManagerCount();
    const managerPhase = isManagerPhase();

    clearZoneStates();
    hideStageChoice();
    hideSuccess();
    hideSpeech();
    updateFlow(-1);
    updateFlowLabels(managerPhase);
    refs.summary.hidden = !state.finished;
    refs.sandbox.classList.remove("is-active");
    refs.sandbox.textContent = "샌드박스";

    refs.badge.textContent = state.finished
      ? "Complete"
      : managerPhase
        ? `간접 ${Math.min(managerCount + 1, managerPracticeCount)} / ${managerPracticeCount}`
        : `직접 ${Math.min(directCount + 1, state.directMissions.length)} / ${state.directMissions.length}`;
    refs.progress.style.width = `${Math.round((completedCount / total) * 100)}%`;
    refs.score.textContent = `완료 ${completedCount} / ${total}`;
    refs.dialogueTitle.textContent = managerPhase ? "매니저에게 지시하기" : "직원에게 부탁하기";
    refs.title.textContent = state.finished
      ? "모든 지시 완료"
      : managerPhase
        ? "매니저에게 지시하세요"
        : mission?.title || "직접 지시 준비";
    setGrammarText(refs.situation, state.finished
      ? "카페 업무 지시를 모두 끝냈습니다."
      : managerPhase
        ? "직접 지시 5개를 마쳤어요. 너무 바빠요! 매니저에게 직원 관리를 부탁하세요!"
        : mission?.situation || "직원에게 직접 부탁할 상황을 준비하고 있어요.");
    refs.start.disabled = state.running || state.finished;
    refs.hint.disabled = state.running || state.finished;
    refs.sandbox.disabled = state.running;
    setGrammarText(refs.instruction, state.finished
      ? "아래 구조 정리를 확인하세요."
      : managerPhase
        ? "매니저를 클릭해 지시문을 조합하세요."
        : "상황을 보고 알맞은 직원을 클릭하세요.");
    refs.choices.innerHTML = "";

    if (state.finished) renderSummary();
  }

  function renderSandbox() {
    const total = totalMissionCount();
    const completedCount = state.completed.length;

    clearZoneStates();
    hideStageChoice();
    hideSuccess();
    hideSpeech();
    updateFlow(-1);
    updateFlowLabels(true);
    refs.summary.hidden = true;

    refs.badge.textContent = "Sandbox";
    refs.progress.style.width = `${Math.round((completedCount / total) * 100)}%`;
    refs.score.textContent = "자유 연습";
    refs.dialogueTitle.textContent = "샌드박스";
    refs.title.textContent = "샌드박스 모드";
    setGrammarText(refs.situation, "진행도와 상관없이 매니저에게 지시문을 자유롭게 만들어 보세요.");
    refs.start.disabled = state.running;
    refs.hint.disabled = state.running;
    refs.sandbox.disabled = state.running;
    refs.sandbox.classList.add("is-active");
    refs.sandbox.textContent = "게임으로 돌아가기";
    setGrammarText(refs.instruction, "매니저를 클릭해 지시문을 조합하세요.");
    refs.choices.innerHTML = "";
    setFeedback("샌드박스에서는 성공해도 진행도가 변하지 않습니다.");
  }

  function renderSummary() {
    refs.summary.hidden = false;
    refs.summaryGrid.innerHTML = "";
    state.completed.forEach((record, index) => {
      const card = document.createElement("article");
      card.className = "summary-card";
      const orderLine = record.mode === "manager"
        ? `<p>사장 -> 매니저: ${grammarHtml(record.bossOrder)}</p><p>매니저 -> ${escapeHtml(record.target)}: ${escapeHtml(record.target)} 씨, ${grammarHtml(record.directRequest)}</p>`
        : `<p>직접 부탁: ${escapeHtml(record.target)} 씨, ${grammarHtml(record.directRequest)}</p>`;
      card.innerHTML = `
        <strong>${index + 1}. ${escapeHtml(record.title)}</strong>
        ${orderLine}
        <p>결과 문장: ${grammarHtml(record.successText)}</p>
        <p>행동: ${grammarHtml(record.completion)}</p>
      `;
      refs.summaryGrid.appendChild(card);
    });
  }

  function focusMission() {
    if (state.running) return;
    if (state.sandboxMode) {
      resetActorHighlights();
      hideStageChoice();
      hideSpeech();
      hideSuccess();
      updateFlow(-1);
      setGrammarText(refs.instruction, "매니저를 클릭해 지시문을 조합하세요.");
      setFeedback("샌드박스: 매니저를 클릭하고 자유롭게 문장을 조합하세요.", "");
      return;
    }
    if (state.finished) return;
    const mission = currentMission();
    const managerPhase = isManagerPhase();
    resetActorHighlights();
    hideStageChoice();
    hideSpeech();
    hideSuccess();
    updateFlow(-1);
    setGrammarText(refs.instruction, managerPhase
      ? "매니저를 클릭해 지시문을 조합하세요."
      : "상황을 보고 알맞은 직원을 클릭하세요.");
    setFeedback(managerPhase
      ? "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!"
      : `상황: ${mission.situation}`, "");
  }

  async function handleRequestChoice(request, button) {
    if (state.running || !isDirectPhase()) return;
    const mission = currentMission();
    const isCorrect = state.selectedWorker === mission.target && request === mission.directRequest;

    if (!isCorrect) {
      state.wrongCount += 1;
      button.classList.add("wrong");
      saveState();
      setFeedback("상황 속 직원과 부탁을 다시 확인하세요.", "bad");
      showSpeech("나(사장)", "이 부탁이 맞을까요?");
      return;
    }

    button.classList.add("correct");
    setStageChoiceDisabled(true);
    state.running = true;
    refs.start.disabled = true;
    refs.hint.disabled = true;
    refs.sandbox.disabled = true;
    setFeedback("좋아요. 직원이 부탁을 듣고 행동합니다.", "good");
    await wait(360);
    hideStageChoice();
    await runMissionSequence(mission, request);
  }

  async function runMissionSequence(mission, request) {
    const worker = config.workers[mission.target];
    const workerActorKey = mission.target;
    const actor = refs.actors[workerActorKey];

    resetActorHighlights();
    actor.classList.add("is-active");
    showSpeech("나(사장)", `${worker.name} 씨, ${request}`);
    await wait(1000);

    showSpeech(`${worker.name} 씨`, mission.workerReply);
    await wait(760);

    updateFlow(1);
    setTargetZone(mission.destination);
    setFeedback(`${mission.target}가 작업 장소로 이동합니다.`);
    await moveActor(workerActorKey, config.positions[mission.destination]);
    markZoneDone(mission.destination);

    actor.classList.add("is-working", mission.workClass);
    showSpeech(`${worker.name} 씨`, mission.actionLabel);
    setFeedback(mission.completion, "good");
    await wait(1200);

    actor.classList.remove("is-active", "is-working", mission.workClass);
    hideSpeech();
    updateFlow(2);
    showSuccess(mission.successText);
    setFeedback(mission.successText, "good");
    await wait(1700);

    completeMission({
      id: mission.id,
      title: mission.title,
      mode: "direct",
      target: mission.target,
      directRequest: mission.directRequest,
      successText: mission.successText,
      completion: mission.completion
    });
  }

  async function runManagerSequence(subject, task) {
    const worker = config.workers[subject];
    const actor = refs.actors[subject];
    const order = managerOrderText({ subject, object: task.object, action: task.action });
    const bossSpeech = `매니저 님 ${order}`;
    const successText = `${subject}가 ${task.object} ${task.action} 했어요!`;
    const completion = task.completion.replace(/^[ABC]가/, `${subject}가`);

    resetActorHighlights();
    refs.actors.boss.classList.add("is-active");
    showSpeech("나(사장)", bossSpeech);
    await wait(1100);

    refs.actors.manager.classList.add("is-active");
    showSpeech("매니저", "네, 알겠습니다.");
    await wait(800);
    refs.actors.boss.classList.remove("is-active");

    updateFlow(1);
    setFeedback(`매니저가 ${subject}에게 이동합니다.`);
    await moveActor("manager", managerApproachPositionFor(subject));
    showSpeech("매니저", `${subject} 씨, ${task.directRequest}`);
    await wait(1000);

    actor.classList.add("is-active");
    showSpeech(`${worker.name} 씨`, task.workerReply || "네, 알겠습니다.");
    await wait(760);
    refs.actors.manager.classList.remove("is-active");

    setTargetZone(task.destination);
    setFeedback(`${subject}가 작업 장소로 이동합니다.`);
    await moveActor(subject, config.positions[task.destination]);
    markZoneDone(task.destination);

    actor.classList.add("is-working", task.workClass);
    showSpeech(`${worker.name} 씨`, task.actionLabel);
    setFeedback(completion, "good");
    await wait(1200);

    actor.classList.remove("is-active", "is-working", task.workClass);
    hideSpeech();
    updateFlow(2);
    showSuccess(successText);
    setFeedback(successText, "good");
    await wait(1700);

    if (state.sandboxMode) {
      state.running = false;
      refs.start.disabled = false;
      refs.hint.disabled = false;
      refs.sandbox.disabled = false;
      resetSupportActorsForScene();
      saveState();
      setFeedback("샌드박스 성공! 매니저를 클릭해 다른 조합도 만들어 보세요.", "good");
      setGrammarText(refs.instruction, "매니저를 클릭해 지시문을 조합하세요.");
      return;
    }

    completeMission({
      id: `manager-${state.completed.length + 1}`,
      title: "매니저에게 지시하세요",
      mode: "manager",
      target: subject,
      bossOrder: bossSpeech,
      directRequest: task.directRequest,
      successText,
      completion
    });
  }

  function completeMission(record) {
    state.completed.push(record);

    if (state.completed.length >= totalMissionCount()) {
      state.finished = true;
      state.running = false;
      resetActorsForMission();
      saveState();
      renderMission();
      setFeedback("모든 업무 지시가 끝났습니다. 아래에서 -게 하다 구조를 정리해 보세요.", "good");
      return;
    }

    state.missionIndex = Math.min(completedDirectCount(), Math.max(0, state.directMissions.length - 1));
    state.running = false;
    saveState();
    resetActorsForMission();
    renderMission();
    if (isManagerPhase()) {
      setFeedback(completedManagerCount() === 0
        ? "직접 지시 5개를 마쳤습니다. 이제 매니저에게 직원 관리를 부탁하세요!"
        : "성공! 매니저에게 다음 간접 지시를 해 보세요.", "good");
    } else {
      setFeedback("성공! 다음 직접 지시 상황을 보고 직원을 클릭하세요.", "good");
    }
  }

  function resetGame() {
    state.missionIndex = 0;
    state.directMissions = buildDirectMissionPlan();
    state.completed = [];
    state.wrongCount = 0;
    state.running = false;
    state.finished = false;
    state.sandboxMode = false;
    state.selectedWorker = "";
    state.actorPositions = {};
    refs.summary.hidden = true;
    refs.summaryGrid.innerHTML = "";
    resetActorsForMission({ resetWorkers: true });
    saveState();
    renderMission();
    setFeedback("처음부터 다시 시작합니다.");
  }

  function enterSandbox() {
    if (state.running) return;
    state.sandboxMode = true;
    state.selectedWorker = "";
    resetActorsForMission();
    renderMission();
  }

  function exitSandbox() {
    if (state.running) return;
    state.sandboxMode = false;
    state.selectedWorker = "";
    resetActorsForMission();
    renderMission();
    setFeedback(state.finished
      ? "게임 결과 화면으로 돌아왔습니다."
      : "게임 진행 화면으로 돌아왔습니다.", "");
  }

  refs.start.addEventListener("click", focusMission);
  refs.hint.addEventListener("click", () => {
    if (state.running) return;
    if (state.sandboxMode) {
      setFeedback("힌트: 'B가 + 커피를 + 만들게'처럼 직원, 일, 행동을 조합해 보세요.", "");
      return;
    }
    if (state.finished) return;
    const mission = currentMission();
    setFeedback(isManagerPhase()
      ? "힌트: A가 + 테이블을 + 닦게 + 하세요 처럼 조합하세요."
      : `힌트: ${mission.target}에게 "${mission.directRequest}"`, "");
  });
  refs.sandbox.addEventListener("click", () => {
    if (state.sandboxMode) {
      exitSandbox();
    } else {
      enterSandbox();
    }
  });
  refs.zoneLabelToggle.addEventListener("change", () => {
    state.zoneLabelsVisible = refs.zoneLabelToggle.checked;
    applyZoneLabelVisibility();
    saveState();
  });
  refs.reset.addEventListener("click", resetGame);
  refs.actors.boss.addEventListener("click", () => {
    if (state.running) return;
    if (state.sandboxMode) {
      showSpeech("나(사장)", "샌드박스에서는 매니저에게 자유롭게 지시해 보세요.");
      setFeedback("매니저를 클릭해 지시문을 조합하세요.");
      return;
    }
    if (state.finished) return;
    if (isManagerPhase()) {
      showSpeech("나(사장)", "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!");
      setFeedback("매니저를 클릭해 지시문을 조합하세요.");
      return;
    }
    showSpeech("나(사장)", "상황을 보고 알맞은 직원에게 부탁해 봅시다.");
    setFeedback("A, B, C 중 알맞은 직원을 클릭하세요.");
  });
  refs.actors.manager.addEventListener("click", () => {
    if (state.running) return;
    if (canUseManagerBuilder()) {
      renderManagerBuilder();
      return;
    }
    if (state.finished) return;
    showSpeech("매니저", "나중에는 제가 대신 전달하는 표현도 연습할 수 있어요.");
    setFeedback("이번 미션은 나(사장)이 직원에게 직접 부탁합니다.");
  });
  workerKeys.forEach((workerKey) => {
    refs.actors[workerKey].addEventListener("click", () => renderStageChoice(workerKey));
  });
  window.addEventListener("resize", () => {
    Object.keys(state.actorPositions).forEach(applyActorPosition);
    if (!refs.stageChoice.hidden) {
      placeChoiceMenu();
    }
  });

  loadState();
  randomizeActorPortraits();
  applyZoneLabelVisibility();
  resetActorsForMission();
  renderMission();
})();
