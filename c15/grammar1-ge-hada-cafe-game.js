(() => {
  "use strict";

  const config = window.GE_HADA_CAFE_GAME;
  const storageKey = "c15.grammar1.geHadaCafe.v1";
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const walkDuration = 1600;
  const workerKeys = ["A", "B", "C"];
  const taskOptions = buildTaskOptions();

  const state = {
    missionIndex: 0,
    completed: [],
    wrongCount: 0,
    running: false,
    finished: false,
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

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (!saved) return;
      state.completed = Array.isArray(saved.completed) ? saved.completed : [];
      state.wrongCount = Number(saved.wrongCount || 0);
      state.missionIndex = Math.min(state.completed.length, config.missions.length - 1);
      state.finished = state.completed.length >= config.missions.length;
    } catch (error) {
      // Local progress is optional.
    }
  }

  function saveState() {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        completed: state.completed,
        wrongCount: state.wrongCount,
        savedAt: new Date().toISOString()
      }));
    } catch (error) {
      // Local progress is optional.
    }
  }

  function currentMission() {
    return config.missions[state.missionIndex];
  }

  function isManagerPhase() {
    return !state.finished && state.completed.length >= 1;
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
    config.missions.forEach((mission) => {
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

  function managerOrderText(selection = state.managerSelection) {
    if (!selection.subject || !selection.object || !selection.action) return "";
    return `${selection.subject}가 ${selection.object} ${selection.action} 하세요.`;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function scalePosition(position) {
    const stageWidth = refs.stage.clientWidth || 720;
    const stageHeight = refs.stage.clientHeight || 590;
    const scaleX = stageWidth / 720;
    const scaleY = stageHeight / 590;
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
    refs.speechText.textContent = text;
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
    refs.successText.textContent = text;
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
    refs.feedback.textContent = text;
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
      item.textContent = labels[index] || "";
    });
  }

  function resetActorHighlights() {
    Object.values(refs.actors).forEach((actor) => {
      actor.classList.remove("is-active", "is-choice-target");
    });
  }

  function startPositionFor(actorKey) {
    if (actorKey === "boss" && isManagerPhase()) {
      return config.positions.busyBoss || config.startPositions.boss;
    }
    return config.startPositions[actorKey];
  }

  function resetActorsForMission() {
    Object.keys(config.startPositions).forEach((actorKey) => {
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
    const actorWidth = actor.offsetWidth || 78;
    const stageWidth = refs.stage.clientWidth || 720;
    const stageHeight = refs.stage.clientHeight || 590;
    const isBuilder = refs.stageChoice.classList.contains("is-builder");
    const x = clamp(scaled.x + actorWidth / 2, 126, stageWidth - 126);
    const menuHeight = refs.stageChoice.offsetHeight || 260;
    const y = isBuilder
      ? clamp(scaled.y + (actor.offsetHeight || 120) + 12, 24, stageHeight - menuHeight - 24)
      : Math.max(24, scaled.y - 10);
    refs.stageChoice.style.setProperty("--choice-x", `${Math.round(x)}px`);
    refs.stageChoice.style.setProperty("--choice-y", `${Math.round(y)}px`);
  }

  function renderStageChoice(actorKey) {
    if (state.running || state.finished || !workerKeys.includes(actorKey)) return;
    if (isManagerPhase()) {
      setFeedback("지금은 매니저에게 직원 관리를 부탁하세요.", "");
      showSpeech("나(사장)", "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!");
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
    refs.instruction.textContent = "나(사장) 위 선택지에서 알맞은 부탁을 고르세요.";

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
      button.textContent = request;
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
    preview.textContent = `매니저 님 ${subject} ${object} ${action} 하세요.`;
    submit.disabled = !(state.managerSelection.subject && state.managerSelection.object && state.managerSelection.action);
  }

  function selectManagerSlot(slot, value, button) {
    if (state.running || state.finished || !isManagerPhase()) return;
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
      button.textContent = labelFor(option);
      button.addEventListener("click", () => selectManagerSlot(slot, option, button));
      column.appendChild(button);
    });

    builder.appendChild(column);
  }

  function renderManagerBuilder() {
    if (state.running || state.finished || !isManagerPhase()) return;
    resetActorHighlights();
    hideSpeech();
    hideSuccess();
    updateFlow(0);
    refs.actors.boss.classList.add("is-active");
    refs.actors.manager.classList.add("is-active", "is-choice-target");
    refs.instruction.textContent = "매니저에게 시킬 일을 조합하세요.";
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
      <strong data-manager-preview>매니저 님 00가 000을 000게 하세요.</strong>
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
    if (state.running || state.finished || !isManagerPhase()) return;
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
    setFeedback("좋아요. 매니저가 지시를 전달합니다.", "good");
    await wait(360);
    hideStageChoice();
    await runManagerSequence(subject, task);
  }

  function renderMission() {
    const total = config.missions.length;
    const mission = currentMission();
    const completedCount = state.completed.length;
    const managerPhase = isManagerPhase();

    clearZoneStates();
    hideStageChoice();
    hideSuccess();
    hideSpeech();
    updateFlow(-1);
    updateFlowLabels(managerPhase);

    refs.badge.textContent = state.finished ? "Complete" : `Mission ${Math.min(state.missionIndex + 1, total)} / ${total}`;
    refs.progress.style.width = `${Math.round((completedCount / total) * 100)}%`;
    refs.score.textContent = `완료 ${completedCount} / ${total}`;
    refs.dialogueTitle.textContent = managerPhase ? "매니저에게 지시하기" : "직원에게 부탁하기";
    refs.title.textContent = state.finished
      ? "모든 지시 완료"
      : managerPhase
        ? "매니저에게 지시하세요"
        : mission.title;
    refs.situation.textContent = state.finished
      ? "카페 업무 지시를 모두 끝냈습니다."
      : managerPhase
        ? "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!"
        : mission.situation;
    refs.start.disabled = state.running || state.finished;
    refs.hint.disabled = state.running || state.finished;
    refs.instruction.textContent = state.finished
      ? "아래 구조 정리를 확인하세요."
      : managerPhase
        ? "매니저를 클릭해 지시문을 조합하세요."
        : "상황을 보고 알맞은 직원을 클릭하세요.";
    refs.choices.innerHTML = "";

    if (state.finished) renderSummary();
  }

  function renderSummary() {
    refs.summary.hidden = false;
    refs.summaryGrid.innerHTML = "";
    state.completed.forEach((record, index) => {
      const card = document.createElement("article");
      card.className = "summary-card";
      const orderLine = record.mode === "manager"
        ? `<p>사장 -> 매니저: ${record.bossOrder}</p><p>매니저 -> ${record.target}: ${record.target} 씨, ${record.directRequest}</p>`
        : `<p>직접 부탁: ${record.target} 씨, ${record.directRequest}</p>`;
      card.innerHTML = `
        <strong>${index + 1}. ${record.title}</strong>
        ${orderLine}
        <p>결과 문장: ${record.successText}</p>
        <p>행동: ${record.completion}</p>
      `;
      refs.summaryGrid.appendChild(card);
    });
  }

  function focusMission() {
    if (state.running || state.finished) return;
    const mission = currentMission();
    const managerPhase = isManagerPhase();
    resetActorHighlights();
    hideStageChoice();
    hideSpeech();
    hideSuccess();
    updateFlow(-1);
    refs.instruction.textContent = managerPhase
      ? "매니저를 클릭해 지시문을 조합하세요."
      : "상황을 보고 알맞은 직원을 클릭하세요.";
    setFeedback(managerPhase
      ? "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!"
      : `상황: ${mission.situation}`, "");
  }

  async function handleRequestChoice(request, button) {
    if (state.running || state.finished) return;
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
    await moveActor("manager", config.positions[`managerTo${subject}`] || config.positions[subject]);
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

    if (state.completed.length >= config.missions.length) {
      state.finished = true;
      state.running = false;
      saveState();
      renderMission();
      setFeedback("모든 업무 지시가 끝났습니다. 아래에서 -게 하다 구조를 정리해 보세요.", "good");
      return;
    }

    state.missionIndex += 1;
    state.running = false;
    saveState();
    resetActorsForMission();
    renderMission();
    if (isManagerPhase()) {
      setFeedback(state.completed.length === 1
        ? "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!"
        : "성공! 매니저에게 다음 지시를 해 보세요.", "good");
    } else {
      setFeedback("성공! 다음 상황을 보고 직원을 클릭하세요.", "good");
    }
  }

  function resetGame() {
    state.missionIndex = 0;
    state.completed = [];
    state.wrongCount = 0;
    state.running = false;
    state.finished = false;
    state.selectedWorker = "";
    refs.summary.hidden = true;
    refs.summaryGrid.innerHTML = "";
    resetActorsForMission();
    saveState();
    renderMission();
    setFeedback("처음부터 다시 시작합니다.");
  }

  refs.start.addEventListener("click", focusMission);
  refs.hint.addEventListener("click", () => {
    if (state.running || state.finished) return;
    const mission = currentMission();
    setFeedback(isManagerPhase()
      ? "힌트: A가 + 테이블을 + 닦게 + 하세요 처럼 조합하세요."
      : `힌트: ${mission.target}에게 "${mission.directRequest}"`, "");
  });
  refs.reset.addEventListener("click", resetGame);
  refs.actors.boss.addEventListener("click", () => {
    if (state.running || state.finished) return;
    if (isManagerPhase()) {
      showSpeech("나(사장)", "너무 바빠요! 매니저에게 직원 관리를 부탁하세요!");
      setFeedback("매니저를 클릭해 지시문을 조합하세요.");
      return;
    }
    showSpeech("나(사장)", "상황을 보고 알맞은 직원에게 부탁해 봅시다.");
    setFeedback("A, B, C 중 알맞은 직원을 클릭하세요.");
  });
  refs.actors.manager.addEventListener("click", () => {
    if (state.running || state.finished) return;
    if (isManagerPhase()) {
      renderManagerBuilder();
      return;
    }
    showSpeech("매니저", "나중에는 제가 대신 전달하는 표현도 연습할 수 있어요.");
    setFeedback("이번 미션은 나(사장)이 직원에게 직접 부탁합니다.");
  });
  workerKeys.forEach((workerKey) => {
    refs.actors[workerKey].addEventListener("click", () => renderStageChoice(workerKey));
  });
  window.addEventListener("resize", () => {
    Object.keys(state.actorPositions).forEach(applyActorPosition);
    if (state.selectedWorker && !refs.stageChoice.hidden) {
      placeChoiceMenu();
    }
  });

  loadState();
  resetActorsForMission();
  renderMission();
})();
