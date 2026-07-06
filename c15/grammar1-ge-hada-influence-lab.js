(function () {
  "use strict";

  const STORAGE_KEY = "c15.grammar1.geHadaInfluenceLab.v1";
  const ASSET_BASE = "../assets/c15/grammar/images/ge-hada-influence-lab/";

  const cases = [
    {
      id: "homework",
      kind: "지시/부담",
      causer: "선생님",
      causerPhrase: "선생님이",
      causee: "학생",
      causeePhrase: "학생에게",
      baseAction: "숙제를 하다",
      resultPhrase: "숙제를 하게 했다",
      formulaResult: "숙제를 하게 하다",
      sentence: "선생님이 학생에게 숙제를 하게 했어요.",
      targetLabel: "숙제 자리",
      targetAction: "숙제를 하다",
      causerSymbol: "선",
      causeeSymbol: "학",
      causerArt: "teacher.webp",
      causeeArt: "student.webp",
      image: "bg-classroom.webp",
      wave: "#ea580c",
      resistance: 1.08,
      drift: 0.00012,
      avoidance: true,
      causerPos: { x: 19, y: 60 },
      causeeStart: { x: 59, y: 64 },
      targetPos: { x: 81, y: 56 }
    },
    {
      id: "medicine",
      kind: "돌봄/필요",
      causer: "엄마",
      causerPhrase: "엄마가",
      causee: "아이",
      causeePhrase: "아이에게",
      baseAction: "약을 먹다",
      resultPhrase: "약을 먹게 했다",
      formulaResult: "약을 먹게 하다",
      sentence: "엄마가 아이에게 약을 먹게 했어요.",
      targetLabel: "약 자리",
      targetAction: "약을 먹다",
      causerSymbol: "엄",
      causeeSymbol: "아",
      causerArt: "mother.webp",
      causeeArt: "child.webp",
      image: "bg-medicine.webp",
      wave: "#10b981",
      resistance: 0.9,
      drift: 0.00008,
      causerPos: { x: 20, y: 58 },
      causeeStart: { x: 56, y: 66 },
      targetPos: { x: 82, y: 55 }
    },
    {
      id: "laugh",
      kind: "감정/긍정",
      causer: "친구",
      causerPhrase: "친구가",
      causee: "민수",
      causeePhrase: "민수를",
      baseAction: "웃다",
      resultPhrase: "웃게 했다",
      formulaResult: "웃게 하다",
      sentence: "친구가 민수를 웃게 했어요.",
      targetLabel: "웃음 자리",
      targetAction: "웃다",
      causerSymbol: "친",
      causeeSymbol: "민",
      causerArt: "friend.webp",
      causeeArt: "minsu.webp",
      image: "bg-laugh.webp",
      wave: "#f59e0b",
      resistance: 0.78,
      drift: 0.00004,
      causerPos: { x: 22, y: 56 },
      causeeStart: { x: 52, y: 62 },
      targetPos: { x: 78, y: 52 }
    },
    {
      id: "wind",
      kind: "자연/물리",
      causer: "바람",
      causerPhrase: "바람이",
      causee: "배",
      causeePhrase: "배를",
      baseAction: "가다",
      resultPhrase: "가게 했다",
      formulaResult: "가게 하다",
      sentence: "바람이 배를 가게 했어요.",
      targetLabel: "항해 자리",
      targetAction: "가다",
      causerSymbol: "바",
      causeeSymbol: "배",
      causerArt: "wind.webp",
      causeeArt: "boat.webp",
      image: "bg-sea.webp",
      wave: "#0284c7",
      resistance: 0.72,
      drift: 0.00002,
      causerPos: { x: 17, y: 35 },
      causeeStart: { x: 49, y: 66 },
      targetPos: { x: 82, y: 58 }
    },
    {
      id: "music",
      kind: "분위기/유도",
      causer: "음악",
      causerPhrase: "음악이",
      causee: "사람들",
      causeePhrase: "사람들을",
      baseAction: "춤추다",
      resultPhrase: "춤추게 했다",
      formulaResult: "춤추게 하다",
      sentence: "음악이 사람들을 춤추게 했어요.",
      targetLabel: "춤 자리",
      targetAction: "춤추다",
      causerSymbol: "음",
      causeeSymbol: "춤",
      causerArt: "music.webp",
      causeeArt: "people.webp",
      image: "bg-music.webp",
      wave: "#8b5cf6",
      resistance: 0.82,
      drift: 0.00003,
      causerPos: { x: 18, y: 49 },
      causeeStart: { x: 52, y: 65 },
      targetPos: { x: 80, y: 52 }
    },
    {
      id: "guard",
      kind: "금지/방지",
      causer: "경비원",
      causerPhrase: "경비원이",
      causee: "사람들",
      causeePhrase: "사람들이",
      baseAction: "들어가지 못하다",
      resultPhrase: "들어가지 못하게 했다",
      formulaResult: "들어가지 못하게 하다",
      sentence: "경비원이 사람들이 들어가지 못하게 했어요.",
      targetLabel: "멈춤 자리",
      targetAction: "들어가지 못하다",
      causerSymbol: "경",
      causeeSymbol: "사",
      causerArt: "guard.webp",
      causeeArt: "crowd.webp",
      image: "bg-gate.webp",
      wave: "#475569",
      resistance: 2,
      drift: 0.00005,
      blockBounce: true,
      causerPos: { x: 28, y: 55 },
      causeeStart: { x: 66, y: 61 },
      targetPos: { x: 42, y: 61 },
      bouncePos: { x: 72, y: 63 }
    }
  ];

  const refs = {
    saveState: document.getElementById("saveState"),
    caseKind: document.getElementById("caseKind"),
    stageTitle: document.getElementById("stageTitle"),
    causerPhrase: document.getElementById("causerPhrase"),
    causeePhrase: document.getElementById("causeePhrase"),
    baseAction: document.getElementById("baseAction"),
    resultPhrase: document.getElementById("resultPhrase"),
    causerPiece: document.getElementById("causerPiece"),
    resultPiece: document.getElementById("resultPiece"),
    stageBoard: document.getElementById("stageBoard"),
    sceneImage: document.getElementById("sceneImage"),
    pathLine: document.getElementById("pathLine"),
    waveField: document.getElementById("waveField"),
    targetZone: document.getElementById("targetZone"),
    targetLabel: document.getElementById("targetLabel"),
    targetAction: document.getElementById("targetAction"),
    causerNode: document.getElementById("causerNode"),
    causeeNode: document.getElementById("causeeNode"),
    causerSymbol: document.getElementById("causerSymbol"),
    causeeSymbol: document.getElementById("causeeSymbol"),
    causerPortrait: document.getElementById("causerPortrait"),
    causeePortrait: document.getElementById("causeePortrait"),
    causerArt: document.getElementById("causerArt"),
    causeeArt: document.getElementById("causeeArt"),
    causerLabel: document.getElementById("causerLabel"),
    causeeLabel: document.getElementById("causeeLabel"),
    causerToken: document.getElementById("causerToken"),
    causeeToken: document.getElementById("causeeToken"),
    holdButton: document.getElementById("holdButton"),
    retryButton: document.getElementById("retryButton"),
    powerFill: document.getElementById("powerFill"),
    feedbackText: document.getElementById("feedbackText"),
    scenarioList: document.getElementById("scenarioList"),
    progressText: document.getElementById("progressText"),
    sentenceLine: document.getElementById("sentenceLine"),
    formulaBase: document.getElementById("formulaBase"),
    formulaResult: document.getElementById("formulaResult")
  };

  const state = {
    selectedId: cases[0].id,
    progress: {},
    completed: {},
    causerPositions: {},
    escapeOffsets: {},
    power: 0,
    charging: false,
    dragging: null,
    lastTime: 0,
    rafId: 0,
    saveTimer: 0
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function currentCase() {
    return cases.find(function (item) {
      return item.id === state.selectedId;
    }) || cases[0];
  }

  function readProgress(id) {
    return clamp(Number(state.progress[id] || 0), 0, 1);
  }

  function isDone(id) {
    return Boolean(state.completed[id]);
  }

  function readEscape(id) {
    return clamp(Number(state.escapeOffsets[id] || 0), 0, 1);
  }

  function currentCauserPosition(item) {
    return state.causerPositions[item.id] || item.causerPos;
  }

  function saveSoon() {
    clearTimeout(state.saveTimer);
    refs.saveState.textContent = "저장 중";
    state.saveTimer = window.setTimeout(function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          selectedId: state.selectedId,
          progress: state.progress,
          completed: state.completed
        }));
        refs.saveState.textContent = "저장됨";
      } catch (error) {
        refs.saveState.textContent = "저장 실패";
      }
    }, 120);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (cases.some(function (item) { return item.id === saved.selectedId; })) {
        state.selectedId = saved.selectedId;
      }
      state.progress = saved.progress && typeof saved.progress === "object" ? saved.progress : {};
      state.completed = saved.completed && typeof saved.completed === "object" ? saved.completed : {};
    } catch (error) {
      state.progress = {};
      state.completed = {};
    }
  }

  function actorPosition(item) {
    const progress = readProgress(item.id);
    if (item.blockBounce) {
      const bounceStart = 0.74;
      if (progress <= bounceStart) {
        const approach = progress / bounceStart;
        return {
          x: lerp(item.causeeStart.x, item.targetPos.x, approach),
          y: lerp(item.causeeStart.y, item.targetPos.y, approach)
        };
      }
      const bounce = clamp((progress - bounceStart) / (1 - bounceStart), 0, 1);
      const eased = 1 - Math.pow(1 - bounce, 3);
      const hop = Math.sin(bounce * Math.PI) * -5;
      return {
        x: lerp(item.targetPos.x, item.bouncePos.x, eased),
        y: clamp(lerp(item.targetPos.y, item.bouncePos.y, eased) + hop, 18, 84)
      };
    }
    const base = {
      x: lerp(item.causeeStart.x, item.targetPos.x, progress),
      y: lerp(item.causeeStart.y, item.targetPos.y, progress)
    };
    const escape = readEscape(item.id);
    if (!item.avoidance || escape <= 0 || progress >= 1) {
      return base;
    }
    const dx = item.causeeStart.x - item.targetPos.x;
    const dy = item.causeeStart.y - item.targetPos.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const escapeDistance = 16 * escape * (1 - progress);
    return {
      x: clamp(base.x + dx / length * escapeDistance, 10, 90),
      y: clamp(base.y + dy / length * escapeDistance, 18, 84)
    };
  }

  function setNodePosition(node, pos) {
    node.style.left = pos.x + "%";
    node.style.top = pos.y + "%";
  }

  function updateLine(item) {
    const board = refs.stageBoard.getBoundingClientRect();
    const causerPos = currentCauserPosition(item);
    const start = {
      x: board.width * causerPos.x / 100,
      y: board.height * causerPos.y / 100
    };
    const endPos = actorPosition(item);
    const end = {
      x: board.width * endPos.x / 100,
      y: board.height * endPos.y / 100
    };
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    refs.pathLine.style.width = length + "px";
    refs.pathLine.style.transform = "translate(" + start.x + "px, " + start.y + "px) rotate(" + angle + "deg)";
  }

  function distanceBoost(item) {
    const causerPos = currentCauserPosition(item);
    const causeePos = actorPosition(item);
    const dx = causeePos.x - causerPos.x;
    const dy = causeePos.y - causerPos.y;
    const distanceRatio = Math.sqrt(dx * dx + dy * dy) / 100;
    return clamp(1.9 - distanceRatio * 1.4, 0.65, 1.9);
  }

  function updateScene() {
    const item = currentCase();
    const progress = readProgress(item.id);
    const done = isDone(item.id);
    const causerPos = currentCauserPosition(item);
    const causeePos = actorPosition(item);
    const boost = distanceBoost(item);

    document.documentElement.style.setProperty("--wave", item.wave);
    document.documentElement.style.setProperty("--power", state.power.toFixed(3));
    refs.stageBoard.style.setProperty("--causer-x", causerPos.x + "%");
    refs.stageBoard.style.setProperty("--causer-y", causerPos.y + "%");
    refs.stageBoard.style.setProperty("--target-x", item.targetPos.x + "%");
    refs.stageBoard.style.setProperty("--target-y", item.targetPos.y + "%");

    setNodePosition(refs.causerNode, causerPos);
    setNodePosition(refs.causeeNode, causeePos);
    refs.causeeNode.style.setProperty("--progress", progress.toFixed(3));
    refs.powerFill.parentElement.style.setProperty("--power", state.power.toFixed(3));
    refs.stageBoard.dataset.progress = progress.toFixed(3);
    refs.stageBoard.dataset.escape = readEscape(item.id).toFixed(3);
    refs.stageBoard.dataset.distanceBoost = boost.toFixed(3);
    refs.stageBoard.dataset.causerX = causerPos.x.toFixed(2);
    refs.stageBoard.dataset.causerY = causerPos.y.toFixed(2);
    refs.stageBoard.dataset.causeeX = causeePos.x.toFixed(2);
    refs.stageBoard.dataset.causeeY = causeePos.y.toFixed(2);
    refs.stageBoard.dataset.blockBounce = item.blockBounce ? "true" : "false";

    refs.targetZone.classList.toggle("is-complete", done);
    refs.resultPiece.classList.toggle("is-complete", done);
    refs.causeeNode.classList.toggle("is-moving", state.charging && !done);
    refs.causeeNode.classList.toggle("is-bouncing", Boolean(item.blockBounce && (progress > 0.74 || done)));
    refs.causerNode.classList.toggle("is-active", state.charging);
    refs.causerPiece.classList.toggle("is-active", state.charging);
    refs.stageBoard.classList.toggle("is-charging", state.charging);
    refs.causerNode.classList.toggle("is-dragging", Boolean(state.dragging && state.dragging.active));
    refs.holdButton.classList.toggle("is-pressed", state.charging);

    updateLine(item);
  }

  function updateScenarioCards() {
    Array.from(refs.scenarioList.children).forEach(function (button) {
      const id = button.dataset.id;
      button.setAttribute("aria-pressed", id === state.selectedId ? "true" : "false");
      button.classList.toggle("is-done", isDone(id));
    });
    const doneCount = cases.filter(function (item) { return isDone(item.id); }).length;
    refs.progressText.textContent = doneCount + " / " + cases.length;
  }

  function renderCase() {
    const item = currentCase();
    const done = isDone(item.id);

    refs.caseKind.textContent = item.kind;
    refs.stageTitle.textContent = item.sentence;
    refs.causerPhrase.textContent = item.causerPhrase;
    refs.causeePhrase.textContent = item.causeePhrase;
    refs.baseAction.textContent = item.baseAction;
    refs.resultPhrase.textContent = item.resultPhrase;
    refs.causerLabel.textContent = item.causer;
    refs.causeeLabel.textContent = item.causee;
    refs.causerToken.textContent = item.causerPhrase;
    refs.causeeToken.textContent = item.causeePhrase;
    refs.causerSymbol.textContent = item.causerSymbol;
    refs.causeeSymbol.textContent = item.causeeSymbol;
    setPortrait(refs.causerPortrait, refs.causerArt, item.causerArt);
    setPortrait(refs.causeePortrait, refs.causeeArt, item.causeeArt);
    refs.targetLabel.textContent = item.targetLabel;
    refs.targetAction.textContent = item.targetAction;
    refs.sentenceLine.textContent = item.sentence;
    refs.formulaBase.textContent = item.baseAction;
    refs.formulaResult.textContent = item.formulaResult;
    refs.causerNode.setAttribute("aria-label", item.causerPhrase + " 영향 주기");
    refs.causeeNode.setAttribute("aria-label", item.causeePhrase + " 위치");
    refs.sceneImage.src = ASSET_BASE + item.image;
    refs.sceneImage.alt = "";
    refs.stageBoard.classList.remove("has-image-error");

    refs.feedbackText.textContent = done
      ? item.resultPhrase + " 결과를 확인했어요."
      : "사동주를 눌러 보세요.";

    updateScenarioCards();
    updateScene();
  }

  function setPortrait(portrait, image, fileName) {
    portrait.classList.remove("has-image");
    image.onload = function () {
      portrait.classList.add("has-image");
    };
    image.onerror = function () {
      portrait.classList.remove("has-image");
    };
    image.src = ASSET_BASE + "sprites/" + fileName;
    if (image.complete && image.naturalWidth > 0) {
      portrait.classList.add("has-image");
    }
  }

  function renderScenarioList() {
    refs.scenarioList.innerHTML = "";
    cases.forEach(function (item) {
      const button = document.createElement("button");
      button.className = "scenario-card";
      button.type = "button";
      button.dataset.id = item.id;
      button.setAttribute("aria-pressed", item.id === state.selectedId ? "true" : "false");
      button.innerHTML = "<span>" + item.kind + "</span><strong>" + item.resultPhrase + "</strong><small>" + item.causer + " → " + item.causee + "</small>";
      button.addEventListener("click", function () {
        state.selectedId = item.id;
        state.power = 0;
        stopCharging();
        renderCase();
        if (item.avoidance && !isDone(item.id)) {
          ensureTick();
        }
        saveSoon();
      });
      refs.scenarioList.appendChild(button);
    });
  }

  function completeCurrentCase() {
    const item = currentCase();
    state.progress[item.id] = 1;
    state.completed[item.id] = true;
    state.escapeOffsets[item.id] = 0;
    state.power = 1;
    refs.feedbackText.textContent = item.resultPhrase + " 완성!";
    updateScenarioCards();
    saveSoon();
  }

  function tick(now) {
    const item = currentCase();
    const previous = state.lastTime || now;
    const delta = Math.min(now - previous, 80);
    state.lastTime = now;

    if (state.charging && !isDone(item.id)) {
      state.power = clamp(state.power + delta * 0.00072, 0, 1);
      const current = readProgress(item.id);
      state.escapeOffsets[item.id] = clamp(readEscape(item.id) - delta * 0.0026, 0, 1);
      const push = delta * (0.00024 + state.power * 0.00064) * distanceBoost(item) / item.resistance;
      state.progress[item.id] = clamp(current + push, 0, 1);
      if (state.progress[item.id] >= 1) {
        completeCurrentCase();
      }
    } else if (!state.charging && !isDone(item.id)) {
      const current = readProgress(item.id);
      state.power = clamp(state.power - delta * 0.00055, 0, 1);
      state.progress[item.id] = clamp(current - delta * item.drift, 0, 1);
      if (item.avoidance && current <= 0.04) {
        state.escapeOffsets[item.id] = clamp(readEscape(item.id) + delta * 0.001, 0, 1);
      } else {
        state.escapeOffsets[item.id] = clamp(readEscape(item.id) - delta * 0.0012, 0, 1);
      }
    }

    updateScene();
    if (state.charging || state.power > 0 || (!isDone(item.id) && (readProgress(item.id) > 0 || (item.avoidance && readEscape(item.id) < 1)))) {
      state.rafId = window.requestAnimationFrame(tick);
    } else {
      state.rafId = 0;
    }
  }

  function ensureTick() {
    if (!state.rafId) {
      state.lastTime = performance.now();
      state.rafId = window.requestAnimationFrame(tick);
    }
  }

  function startCharging(event) {
    if (event) {
      event.preventDefault();
    }
    state.charging = true;
    refs.feedbackText.textContent = currentCase().causerPhrase + " 영향이 퍼지고 있어요.";
    ensureTick();
    updateScene();
  }

  function stopCharging() {
    state.charging = false;
    updateScene();
  }

  function resetCurrentCase() {
    const item = currentCase();
    state.progress[item.id] = 0;
    state.completed[item.id] = false;
    state.escapeOffsets[item.id] = 0;
    delete state.causerPositions[item.id];
    state.power = 0;
    stopCharging();
    refs.feedbackText.textContent = "다시 시작해요.";
    renderCase();
    if (item.avoidance) {
      ensureTick();
    }
    saveSoon();
  }

  function boardPointFromEvent(event) {
    const rect = refs.stageBoard.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) / rect.width * 100, 8, 92),
      y: clamp((event.clientY - rect.top) / rect.height * 100, 16, 86)
    };
  }

  function bindCauserControl() {
    refs.causerNode.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      refs.causerNode.setPointerCapture(event.pointerId);
      state.dragging = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        active: false,
        chargeTimer: window.setTimeout(function () {
          if (state.dragging && !state.dragging.active) {
            startCharging();
          }
        }, 140)
      };
    });

    refs.causerNode.addEventListener("pointermove", function (event) {
      if (!state.dragging || state.dragging.pointerId !== event.pointerId) {
        return;
      }
      const dx = event.clientX - state.dragging.startX;
      const dy = event.clientY - state.dragging.startY;
      if (!state.dragging.active && Math.sqrt(dx * dx + dy * dy) >= 8) {
        window.clearTimeout(state.dragging.chargeTimer);
        state.dragging.active = true;
        stopCharging();
        refs.feedbackText.textContent = "사동주를 옮겨 보세요.";
      }
      if (state.dragging.active) {
        const item = currentCase();
        state.causerPositions[item.id] = boardPointFromEvent(event);
        updateScene();
        ensureTick();
      }
    });

    function finishPointer(event) {
      if (!state.dragging || state.dragging.pointerId !== event.pointerId) {
        return;
      }
      window.clearTimeout(state.dragging.chargeTimer);
      const wasDragging = state.dragging.active;
      state.dragging = null;
      stopCharging();
      refs.causerNode.classList.remove("is-dragging");
      const item = currentCase();
      refs.feedbackText.textContent = isDone(item.id)
        ? item.resultPhrase + " 완성!"
        : wasDragging ? "가까이 두면 더 빨라져요." : "사동주를 눌러 보세요.";
      updateScene();
    }

    refs.causerNode.addEventListener("pointerup", finishPointer);
    refs.causerNode.addEventListener("pointercancel", finishPointer);
    refs.causerNode.addEventListener("keydown", function (event) {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        startCharging(event);
      }
    });
    refs.causerNode.addEventListener("keyup", function (event) {
      if (event.key === " " || event.key === "Enter") {
        stopCharging();
      }
    });
    refs.causerNode.addEventListener("blur", stopCharging);
  }

  function bindHoldControl(element) {
    element.addEventListener("pointerdown", startCharging);
    element.addEventListener("pointerup", stopCharging);
    element.addEventListener("pointercancel", stopCharging);
    element.addEventListener("pointerleave", function (event) {
      if (event.buttons) {
        stopCharging();
      }
    });
    element.addEventListener("keydown", function (event) {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        startCharging(event);
      }
    });
    element.addEventListener("keyup", function (event) {
      if (event.key === " " || event.key === "Enter") {
        stopCharging();
      }
    });
    element.addEventListener("blur", stopCharging);
  }

  function bindEvents() {
    bindCauserControl();
    bindHoldControl(refs.holdButton);
    refs.retryButton.addEventListener("click", resetCurrentCase);
    refs.sceneImage.addEventListener("error", function () {
      refs.stageBoard.classList.add("has-image-error");
    });
    window.addEventListener("resize", function () {
      updateScene();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopCharging();
        saveSoon();
      }
    });
  }

  loadState();
  renderScenarioList();
  bindEvents();
  renderCase();
  if (currentCase().avoidance && !isDone(currentCase().id)) {
    ensureTick();
  }
}());
