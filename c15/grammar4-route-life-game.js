(function () {
  "use strict";

  const SAVE_KEY = "korean3b.c15.grammar4.route-life-game";
  const SAVE_VERSION = 2;
  const DRAW_DURATION = 1500;
  const START_DELAY = 700;
  const MOVE_DURATION = 15000;
  const PAUSE_DURATION = 700;
  const PROXIMITY_DISTANCE = 11;
  const PASSED_DISTANCE = 4;

  const ROUTES = [
    {
      id: "home", label: "집", icon: "🏠", destination: { x: 15, y: 18 },
      actions: [
        action("milk", "🥛", "편의점", 40, 43, "우유를 사요.", "우유를 사고", "우유를 샀어요."),
        action("package", "📦", "택배함", 29, 34, "택배를 찾아요.", "택배를 찾고", "택배를 찾았어요."),
        action("trash", "♻️", "분리수거장", 21, 25, "쓰레기를 버려요.", "쓰레기를 버리고", "쓰레기를 버렸어요.")
      ]
    },
    {
      id: "school", label: "학교", icon: "🏫", destination: { x: 85, y: 18 },
      actions: [
        action("bread", "🥖", "빵집", 60, 42, "빵을 사요.", "빵을 사고", "빵을 샀어요."),
        action("notebook", "✏️", "문구점", 71, 33, "공책을 사요.", "공책을 사고", "공책을 샀어요."),
        action("call", "☎️", "전화 부스", 80, 25, "친구에게 전화해요.", "친구에게 전화하고", "친구에게 전화했어요.")
      ]
    },
    {
      id: "station", label: "대전역", icon: "🚉", destination: { x: 15, y: 76 },
      actions: [
        action("ticket", "🎫", "표 찾는 곳", 40, 57, "표를 찾아요.", "표를 찾고", "표를 찾았어요."),
        action("water", "🥤", "편의점", 29, 65, "물을 사요.", "물을 사고", "물을 샀어요."),
        action("exchange", "💱", "환전소", 21, 72, "환전해요.", "환전하고", "환전했어요.")
      ]
    },
    {
      id: "terminal", label: "버스터미널", icon: "🚌", destination: { x: 85, y: 76 },
      actions: [
        action("coffee", "☕", "카페", 60, 57, "커피를 사요.", "커피를 사고", "커피를 샀어요."),
        action("snack", "🍪", "간식 가게", 71, 65, "간식을 사요.", "간식을 사고", "간식을 샀어요."),
        action("restroom", "🚻", "화장실", 80, 72, "화장실에 들러요.", "화장실에 들르고", "화장실에 들렀어요.")
      ]
    },
    {
      id: "mart", label: "마트", icon: "🛒", destination: { x: 14, y: 48 },
      actions: [
        action("bank", "🏦", "은행", 40, 49, "은행에서 돈을 찾아요.", "은행에서 돈을 찾고", "은행에서 돈을 찾았어요."),
        action("medicine", "💊", "약국", 29, 48, "약을 사요.", "약을 사고", "약을 샀어요."),
        action("basket", "🧺", "생활용품점", 21, 48, "장바구니를 사요.", "장바구니를 사고", "장바구니를 샀어요.")
      ]
    },
    {
      id: "library", label: "도서관", icon: "📚", destination: { x: 86, y: 48 },
      actions: [
        action("letter", "✉️", "우체국", 60, 49, "우체국에서 편지를 부쳐요.", "우체국에서 편지를 부치고", "우체국에서 편지를 부쳤어요."),
        action("stationery", "✏️", "문구점", 71, 48, "문구점에서 공책을 사요.", "문구점에서 공책을 사고", "문구점에서 공책을 샀어요."),
        action("libraryCoffee", "☕", "카페", 80, 48, "카페에서 커피를 마셔요.", "카페에서 커피를 마시고", "카페에서 커피를 마셨어요.")
      ]
    }
  ];

  function action(id, icon, place, x, y, present, connective, past) {
    return { id, icon, place, x, y, present, connective, past };
  }

  const NEXT_DESTINATION = {
    home: "mart",
    mart: "school",
    school: "library",
    library: "station",
    station: "terminal",
    terminal: "home"
  };

  function makeSecondLeg(startId, nextId, actions) {
    const start = ROUTES.find((route) => route.id === startId);
    const next = ROUTES.find((route) => route.id === nextId);
    return {
      id: startId + "-to-" + nextId,
      startId,
      nextId,
      label: next.label,
      origin: start.destination,
      destination: next.destination,
      routePhrase: start.label + "에서 " + next.label + "에 가는 길에",
      actions
    };
  }

  const SECOND_LEGS = {
    home: makeSecondLeg("home", "mart", [
      action("homeMartBank", "🏦", "은행", 17, 29, "은행에서 돈을 찾아요.", "은행에서 돈을 찾고", "은행에서 돈을 찾았어요."),
      action("homeMartMedicine", "💊", "약국", 11, 39, "약을 사요.", "약을 사고", "약을 샀어요.")
    ]),
    mart: makeSecondLeg("mart", "school", [
      action("martSchoolBread", "🥖", "빵집", 38, 42, "빵을 사요.", "빵을 사고", "빵을 샀어요."),
      action("martSchoolNotebook", "✏️", "문구점", 63, 29, "공책을 사요.", "공책을 사고", "공책을 샀어요.")
    ]),
    school: makeSecondLeg("school", "library", [
      action("schoolLibraryLetter", "✉️", "우체국", 83, 29, "우체국에서 편지를 부쳐요.", "우체국에서 편지를 부치고", "우체국에서 편지를 부쳤어요."),
      action("schoolLibraryStationery", "✏️", "문구점", 89, 39, "문구점에서 공책을 사요.", "문구점에서 공책을 사고", "문구점에서 공책을 샀어요.")
    ]),
    library: makeSecondLeg("library", "station", [
      action("libraryStationTicket", "🎫", "표 찾는 곳", 62, 55, "표를 찾아요.", "표를 찾고", "표를 찾았어요."),
      action("libraryStationWater", "🥤", "편의점", 37, 68, "물을 사요.", "물을 사고", "물을 샀어요.")
    ]),
    station: makeSecondLeg("station", "terminal", [
      action("stationTerminalCoffee", "☕", "카페", 39, 70, "커피를 사요.", "커피를 사고", "커피를 샀어요."),
      action("stationTerminalSnack", "🍪", "간식 가게", 64, 70, "간식을 사요.", "간식을 사고", "간식을 샀어요.")
    ]),
    terminal: makeSecondLeg("terminal", "home", [
      action("terminalHomeMilk", "🥛", "편의점", 64, 60, "우유를 사요.", "우유를 사고", "우유를 샀어요."),
      action("terminalHomePackage", "📦", "택배함", 38, 35, "택배를 찾아요.", "택배를 찾고", "택배를 찾았어요.")
    ])
  };

  const refs = {
    map: document.getElementById("mapCanvas"),
    routeBase: document.getElementById("routeBase"),
    routePath: document.getElementById("routePath"),
    destinationLayer: document.getElementById("destinationLayer"),
    objectLayer: document.getElementById("objectLayer"),
    traveler: document.getElementById("traveler"),
    sentence: document.getElementById("sentenceOutput"),
    hint: document.getElementById("mapHint"),
    resumePanel: document.getElementById("resumePanel"),
    resumeButton: document.getElementById("resumeButton"),
    resultCard: document.getElementById("resultCard"),
    resultFirstSentence: document.getElementById("resultFirstSentence"),
    resultSentence: document.getElementById("resultSentence"),
    resultDetail: document.getElementById("resultDetail"),
    anotherRouteButton: document.getElementById("anotherRouteButton"),
    speedButton: document.getElementById("speedButton"),
    speedLabel: document.getElementById("speedLabel"),
    resetButton: document.getElementById("resetButton"),
    saveStatus: document.getElementById("saveStatus"),
    copyRecoveryButton: document.getElementById("copyRecoveryButton")
  };

  const state = {
    route: null,
    phase: "choose",
    selectedActionIds: [],
    completedRouteIds: [],
    journeyStartId: null,
    legIndex: 0,
    firstLeg: null,
    speed: 1,
    travelProgress: 0,
    lastFrameAt: 0,
    drawingTimer: null,
    startTimer: null,
    resumeTimer: null,
    frameId: null,
    storageBlocked: false,
    storageIssue: "",
    lastAutosaveAt: 0
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function routeFor(id) {
    return ROUTES.find((route) => route.id === id) || null;
  }

  function activeRouteFor(id) {
    return routeFor(id) || Object.values(SECOND_LEGS).find((route) => route.id === id) || null;
  }

  function objectForm(label) {
    const lastCode = label.charCodeAt(label.length - 1);
    const hasFinalConsonant = lastCode >= 0xAC00 && lastCode <= 0xD7A3 && (lastCode - 0xAC00) % 28 !== 0;
    return label + (hasFinalConsonant ? "을" : "를");
  }

  function timeFor(duration) {
    return duration / state.speed;
  }

  function interactionDistance() {
    return PROXIMITY_DISTANCE + (state.speed - 1) * 2;
  }

  function renderSpeed() {
    const nextSpeed = state.speed === 3 ? 1 : state.speed + 1;
    refs.speedLabel.textContent = state.speed + "×";
    refs.speedButton.setAttribute("aria-label", "이동 속도 " + state.speed + "배속, 눌러 " + nextSpeed + "배속으로 변경");
    refs.map.style.setProperty("--route-draw-duration", timeFor(DRAW_DURATION) + "ms");
  }

  function cycleSpeed() {
    state.speed = state.speed === 3 ? 1 : state.speed + 1;
    renderSpeed();
    setHint("이동 속도 " + state.speed + "배속");
    saveNow();
  }

  function getPoints(route) {
    return [route.origin || { x: 50, y: 50 }].concat(route.actions.map(({ x, y }) => ({ x, y })), [route.destination]);
  }

  function pointDistance(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  function getRouteMetrics(route) {
    const points = getPoints(route);
    const lengths = [];
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      const length = pointDistance(points[index - 1], points[index]);
      lengths.push(length);
      total += length;
    }
    let travelled = 0;
    const actionProgress = route.actions.map((item, index) => {
      travelled += lengths[index];
      return { id: item.id, progress: total ? travelled / total : 0 };
    });
    return { points, lengths, total, actionProgress };
  }

  function positionAt(route, progress) {
    const metrics = getRouteMetrics(route);
    const target = Math.max(0, Math.min(1, progress)) * metrics.total;
    let travelled = 0;
    for (let index = 0; index < metrics.lengths.length; index += 1) {
      const length = metrics.lengths[index];
      if (target <= travelled + length || index === metrics.lengths.length - 1) {
        const ratio = length ? Math.max(0, Math.min(1, (target - travelled) / length)) : 1;
        const from = metrics.points[index];
        const to = metrics.points[index + 1];
        return { x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio };
      }
      travelled += length;
    }
    return route.destination;
  }

  function setTravelerPosition(position) {
    refs.traveler.style.left = position.x + "%";
    refs.traveler.style.top = position.y + "%";
  }

  function getSelectedActions(route = state.route, actionIds = state.selectedActionIds) {
    if (!route) return [];
    return route.actions.filter((item) => actionIds.includes(item.id));
  }

  function makeSentenceParts(route = state.route, actionIds = state.selectedActionIds, past = false) {
    if (!route) return [{ text: "어디에", tone: "plain" }, { text: "가는 길에?", tone: "grammar" }];
    const prefix = route.routePhrase || route.label + "에 가는 길에";
    const selected = getSelectedActions(route, actionIds);
    if (!selected.length) {
      return past
        ? [{ text: prefix, tone: "grammar" }, { text: "바로 도착했어요.", tone: "past fresh" }]
        : [{ text: prefix, tone: "grammar" }];
    }
    return [{ text: prefix, tone: "grammar" }].concat(selected.map((item, index) => {
      const isLast = index === selected.length - 1;
      if (!isLast) return { text: item.connective, tone: "connector" };
      return { text: past ? item.past : item.present, tone: (past ? "past" : "action") + " fresh" };
    }));
  }

  function makeSentence(route = state.route, actionIds = state.selectedActionIds, past = false) {
    return makeSentenceParts(route, actionIds, past).map((part) => part.text).join(" ");
  }

  function renderSentence(element, parts) {
    const nodes = [];
    parts.forEach((part, index) => {
      if (index) nodes.push(document.createTextNode(" "));
      const element = document.createElement("span");
      element.className = "sentence-part " + part.tone.split(" ").map((tone) => "sentence-part--" + tone).join(" ");
      element.textContent = part.text;
      nodes.push(element);
    });
    element.replaceChildren(...nodes);
  }

  function setSentence() {
    renderSentence(refs.sentence, makeSentenceParts(state.route, state.selectedActionIds, ["awaiting-next", "arrived"].includes(state.phase)));
  }

  function setHint(text) {
    refs.hint.textContent = text;
  }

  function pathString(route) {
    return getPoints(route).map((point, index) => (index ? "L" : "M") + point.x + " " + point.y).join(" ");
  }

  function drawRoute(route, complete) {
    const value = pathString(route);
    refs.routeBase.setAttribute("d", value);
    refs.routePath.setAttribute("d", value);
    const length = refs.routePath.getTotalLength ? refs.routePath.getTotalLength() : 300;
    refs.routePath.style.strokeDasharray = String(length);
    refs.routePath.style.strokeDashoffset = complete ? "0" : String(length);
  }

  function renderDestinations() {
    const awaitingNext = state.phase === "awaiting-next";
    const nextId = awaitingNext ? NEXT_DESTINATION[state.journeyStartId] : null;
    const isInitialChoice = state.phase === "choose";
    refs.destinationLayer.querySelectorAll("[data-destination]").forEach((button) => {
      const id = button.dataset.destination;
      const route = routeFor(id);
      const completed = state.completedRouteIds.includes(id);
      const isNext = awaitingNext && id === nextId;
      button.disabled = !(isInitialChoice || isNext);
      button.classList.toggle("is-complete", completed);
      button.classList.toggle("is-next", isNext);
      button.setAttribute("aria-label", route.label + (completed ? " · 완료" : "") + (isNext ? " · 다음 길로 이동" : "") + " 선택");
    });
  }

  function actionProgressFor(id) {
    if (!state.route) return 0;
    const metric = getRouteMetrics(state.route).actionProgress.find((entry) => entry.id === id);
    return metric ? metric.progress : 0;
  }

  function activeObjectId(position) {
    if (state.phase !== "moving" || !state.route) return null;
    return state.route.actions
      .filter((item) => !state.selectedActionIds.includes(item.id) && !isObjectMissed(item))
      .filter((item) => pointDistance(position, item) <= interactionDistance())
      .sort((first, second) => pointDistance(position, first) - pointDistance(position, second))[0]?.id || null;
  }

  function isObjectNear(item, position) {
    return activeObjectId(position) === item.id;
  }

  function isObjectMissed(item) {
    return !state.selectedActionIds.includes(item.id)
      && ["moving", "paused", "awaiting-next", "arrived"].includes(state.phase)
      && state.travelProgress > actionProgressFor(item.id) + (PASSED_DISTANCE / 100);
  }

  function renderObjects() {
    if (!state.route) {
      refs.objectLayer.replaceChildren();
      delete refs.objectLayer.dataset.routeId;
      return;
    }
    if (refs.objectLayer.dataset.routeId !== state.route.id) {
      refs.objectLayer.replaceChildren();
      refs.objectLayer.dataset.routeId = state.route.id;
    }
    const player = positionAt(state.route, state.travelProgress);
    state.route.actions.forEach((item) => {
      const selected = state.selectedActionIds.includes(item.id);
      const missed = isObjectMissed(item);
      const nearby = isObjectNear(item, player);
      let button = refs.objectLayer.querySelector('[data-action-id="' + item.id + '"]');
      if (!button) {
        button = document.createElement("button");
        button.dataset.actionId = item.id;
        button.type = "button";
        button.innerHTML = '<span class="map-object__icon" aria-hidden="true">' + escapeHtml(item.icon) + '</span><span class="map-object__label">' + escapeHtml(item.place) + "</span>";
        refs.objectLayer.appendChild(button);
      }
      button.type = "button";
      button.className = "map-object" + (selected ? " is-done" : "") + (missed ? " is-missed" : "") + (nearby ? " is-near" : "");
      button.style.left = item.x + "%";
      button.style.top = item.y + "%";
      button.disabled = !nearby;
      button.setAttribute("aria-label", item.place + ": " + item.present.replace(".", "") + (selected ? " · 완료" : nearby ? " · 상호작용 가능" : ""));
      button.onclick = nearby ? () => selectAction(item.id) : null;
    });
  }

  function renderResult() {
    const firstArrival = state.phase === "awaiting-next";
    const finalArrival = state.phase === "arrived";
    refs.resultCard.hidden = !(firstArrival || finalArrival);
    if (!(firstArrival || finalArrival)) return;

    refs.resultFirstSentence.hidden = !finalArrival;
    refs.anotherRouteButton.hidden = !finalArrival;
    if (firstArrival) {
      const next = routeFor(NEXT_DESTINATION[state.journeyStartId]);
      renderSentence(refs.resultSentence, makeSentenceParts(state.route, state.selectedActionIds, true));
      refs.resultDetail.textContent = "파형 효과가 난 " + objectForm(next.label) + " 눌러 다음 길을 이어 가세요.";
      return;
    }

    if (state.firstLeg) {
      renderSentence(refs.resultFirstSentence, makeSentenceParts(routeFor(state.firstLeg.routeId), state.firstLeg.actionIds, true));
    }
    renderSentence(refs.resultSentence, makeSentenceParts(state.route, state.selectedActionIds, true));
    const selected = getSelectedActions();
    refs.resultDetail.textContent = selected.length
      ? "두 번째 길에서 " + selected.length + "개의 생활 행동을 문장에 연결했어요."
      : "두 번째 길에서 상호작용 없이 목적지에 도착했어요.";
  }

  function renderResumePanel() {
    refs.resumePanel.hidden = state.phase !== "resume";
  }

  function renderMap() {
    refs.map.dataset.phase = state.phase;
    if (state.route) drawRoute(state.route, state.phase !== "drawing");
    else {
      refs.routeBase.setAttribute("d", "");
      refs.routePath.setAttribute("d", "");
    }
    setTravelerPosition(state.route ? positionAt(state.route, state.travelProgress) : { x: 50, y: 50 });
    renderDestinations();
    renderObjects();
    renderResult();
    renderResumePanel();
    setSentence();
    renderSpeed();
  }

  function payload() {
    return {
      version: SAVE_VERSION,
      completedRouteIds: state.completedRouteIds.slice(),
      journeyStartId: state.journeyStartId,
      legIndex: state.legIndex,
      firstLeg: state.firstLeg ? { routeId: state.firstLeg.routeId, actionIds: state.firstLeg.actionIds.slice() } : null,
      speed: state.speed,
      activeRouteId: state.route ? state.route.id : null,
      phase: state.phase,
      selectedActionIds: state.selectedActionIds.slice(),
      travelProgress: Number(state.travelProgress.toFixed(4))
    };
  }

  function setStorageStatus(message, warning) {
    refs.saveStatus.textContent = message;
    refs.saveStatus.classList.toggle("is-warning", Boolean(warning));
    refs.copyRecoveryButton.hidden = !warning;
  }

  function saveNow() {
    if (state.storageBlocked) return false;
    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(payload()));
      setStorageStatus("이 기기에 진행 상황을 저장했어요.", false);
      return true;
    } catch (error) {
      state.storageBlocked = true;
      state.storageIssue = "저장할 수 없어요. 현재 진행을 복사해 보관하세요.";
      setStorageStatus(state.storageIssue, true);
      return false;
    }
  }

  function saveIfDue(now) {
    if (now - state.lastAutosaveAt >= 500) {
      state.lastAutosaveAt = now;
      saveNow();
    }
  }

  function stopAnimation() {
    if (state.frameId) window.cancelAnimationFrame(state.frameId);
    state.frameId = null;
    ["drawingTimer", "startTimer", "resumeTimer"].forEach((name) => {
      if (state[name]) window.clearTimeout(state[name]);
      state[name] = null;
    });
  }

  function beginMoving() {
    if (!state.route) return;
    state.phase = "moving";
    state.lastFrameAt = 0;
    setHint("가까운 생활 물체를 직접 누르세요.");
    renderMap();
    saveNow();
    state.frameId = window.requestAnimationFrame(moveFrame);
  }

  function moveFrame(now) {
    if (state.phase !== "moving" || !state.route) return;
    if (state.lastFrameAt) {
      state.travelProgress = Math.min(1, state.travelProgress + (now - state.lastFrameAt) / timeFor(MOVE_DURATION));
    }
    state.lastFrameAt = now;
    renderObjects();
    setTravelerPosition(positionAt(state.route, state.travelProgress));
    saveIfDue(now);
    if (state.travelProgress >= 1) {
      arrive();
      return;
    }
    state.frameId = window.requestAnimationFrame(moveFrame);
  }

  function startRoute(route) {
    stopAnimation();
    state.route = route;
    state.phase = "drawing";
    state.selectedActionIds = [];
    state.travelProgress = 0;
    setHint((route.routePhrase || route.label + "에 가는 길에") + " 길을 만들고 있어요.");
    renderMap();
    saveNow();
    window.requestAnimationFrame(() => {
      if (state.phase === "drawing") refs.routePath.style.strokeDashoffset = "0";
    });
    state.drawingTimer = window.setTimeout(() => {
      if (state.phase !== "drawing") return;
      state.startTimer = window.setTimeout(beginMoving, timeFor(START_DELAY));
    }, timeFor(DRAW_DURATION));
  }

  function selectDestination(id) {
    if (state.phase === "choose") {
      const route = routeFor(id);
      if (!route) return;
      state.journeyStartId = id;
      state.legIndex = 0;
      state.firstLeg = null;
      startRoute(route);
      return;
    }
    if (state.phase === "awaiting-next" && id === NEXT_DESTINATION[state.journeyStartId]) {
      state.legIndex = 1;
      startRoute(SECOND_LEGS[state.journeyStartId]);
    }
  }

  function selectAction(id) {
    if (state.phase !== "moving" || !state.route || state.selectedActionIds.includes(id)) return;
    const item = state.route.actions.find((actionItem) => actionItem.id === id);
    const position = positionAt(state.route, state.travelProgress);
    if (!item || !isObjectNear(item, position)) return;
    state.selectedActionIds.push(id);
    state.phase = "paused";
    if (state.frameId) window.cancelAnimationFrame(state.frameId);
    state.frameId = null;
    setHint(item.present.replace(".", "") + " · 잠시 머물렀다가 다시 걸어요.");
    renderMap();
    saveNow();
    state.resumeTimer = window.setTimeout(() => {
      if (state.phase !== "paused") return;
      beginMoving();
    }, timeFor(PAUSE_DURATION));
  }

  function arrive() {
    if (!state.route) return;
    if (state.frameId) window.cancelAnimationFrame(state.frameId);
    state.frameId = null;
    state.travelProgress = 1;
    if (state.legIndex === 0) {
      state.firstLeg = { routeId: state.route.id, actionIds: state.selectedActionIds.slice() };
      state.phase = "awaiting-next";
      if (!state.completedRouteIds.includes(state.journeyStartId)) state.completedRouteIds.push(state.journeyStartId);
      const next = routeFor(NEXT_DESTINATION[state.journeyStartId]);
      setHint(next.label + "에 파형 효과가 나타났어요. 그 목적지를 눌러 다음 길로 가세요.");
      renderMap();
      saveNow();
      window.requestAnimationFrame(() => {
        const nextButton = refs.destinationLayer.querySelector('[data-destination="' + next.id + '"]');
        if (nextButton) nextButton.focus();
      });
      return;
    }
    state.phase = "arrived";
    setHint(state.route.label + "에 도착했어요.");
    renderMap();
    saveNow();
    refs.anotherRouteButton.focus();
  }

  function returnToMap() {
    stopAnimation();
    state.route = null;
    state.phase = "choose";
    state.selectedActionIds = [];
    state.journeyStartId = null;
    state.legIndex = 0;
    state.firstLeg = null;
    state.travelProgress = 0;
    setHint("다음 목적지를 고르세요.");
    renderMap();
    saveNow();
  }

  function resetGame() {
    const confirmed = window.confirm("이 페이지의 길 기록을 모두 지우고 처음부터 시작할까요?");
    if (!confirmed) return;
    stopAnimation();
    try { window.localStorage.removeItem(SAVE_KEY); } catch (error) { /* memory-only reset remains available */ }
    state.storageBlocked = false;
    state.storageIssue = "";
    state.route = null;
    state.phase = "choose";
    state.selectedActionIds = [];
    state.completedRouteIds = [];
    state.journeyStartId = null;
    state.legIndex = 0;
    state.firstLeg = null;
    state.travelProgress = 0;
    setHint("목적지를 고르세요.");
    renderMap();
    saveNow();
  }

  function copyRecovery() {
    const value = JSON.stringify(payload(), null, 2);
    const fallback = () => window.prompt("아래 저장 내용을 복사하세요.", value);
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      fallback();
      return;
    }
    navigator.clipboard.writeText(value).then(() => {
      setStorageStatus("현재 진행 내용을 클립보드에 복사했어요.", true);
    }).catch(fallback);
  }

  function validFirstLeg(firstLeg) {
    return !firstLeg || (routeFor(firstLeg.routeId) && Array.isArray(firstLeg.actionIds));
  }

  function validSave(data) {
    if (!data || data.version !== SAVE_VERSION || !Array.isArray(data.completedRouteIds)) return false;
    if (!data.completedRouteIds.every((id) => Boolean(routeFor(id)))) return false;
    if (data.journeyStartId !== null && data.journeyStartId !== undefined && !routeFor(data.journeyStartId)) return false;
    if (data.activeRouteId !== null && data.activeRouteId !== undefined && !activeRouteFor(data.activeRouteId)) return false;
    if (!Array.isArray(data.selectedActionIds) || !Number.isFinite(data.travelProgress)) return false;
    if (data.speed !== undefined && ![1, 2, 3].includes(data.speed)) return false;
    return [0, 1].includes(data.legIndex) && validFirstLeg(data.firstLeg);
  }

  function migrateV1(data) {
    if (!data || data.version !== 1 || !Array.isArray(data.completedRouteIds)) return null;
    if (!data.completedRouteIds.every((id) => Boolean(routeFor(id)))) return null;
    const route = data.activeRouteId ? routeFor(data.activeRouteId) : null;
    if (data.activeRouteId && !route) return null;
    if (!Array.isArray(data.selectedActionIds) || !Number.isFinite(data.travelProgress)) return null;
    const arrived = data.phase === "arrived" && route;
    return {
      version: SAVE_VERSION,
      completedRouteIds: data.completedRouteIds.slice(),
      journeyStartId: route ? route.id : null,
      legIndex: 0,
      firstLeg: arrived ? { routeId: route.id, actionIds: data.selectedActionIds.slice() } : null,
      activeRouteId: route ? route.id : null,
      phase: arrived ? "awaiting-next" : data.phase,
      selectedActionIds: data.selectedActionIds.slice(),
      travelProgress: data.travelProgress
    };
  }

  function restoreSave() {
    let raw;
    try { raw = window.localStorage.getItem(SAVE_KEY); } catch (error) {
      state.storageBlocked = true;
      setStorageStatus("저장 공간을 사용할 수 없어요. 현재 진행을 복사할 수 있어요.", true);
      return;
    }
    if (!raw) return;
    let data;
    try { data = JSON.parse(raw); } catch (error) { data = null; }
    if (data && data.version === 1) data = migrateV1(data);
    if (!validSave(data)) {
      state.storageBlocked = true;
      setStorageStatus("기존 저장 기록을 불러올 수 없어요. 초기화하면 새로 저장할 수 있어요.", true);
      return;
    }
    state.completedRouteIds = data.completedRouteIds.slice();
    state.journeyStartId = data.journeyStartId || null;
    state.legIndex = data.legIndex;
    state.speed = [1, 2, 3].includes(data.speed) ? data.speed : 1;
    state.firstLeg = data.firstLeg && routeFor(data.firstLeg.routeId)
      ? { routeId: data.firstLeg.routeId, actionIds: data.firstLeg.actionIds.slice() }
      : null;
    if (!data.activeRouteId) return;
    const route = activeRouteFor(data.activeRouteId);
    const validActionIds = route.actions.map((item) => item.id);
    state.route = route;
    state.selectedActionIds = data.selectedActionIds.filter((id) => validActionIds.includes(id));
    state.travelProgress = Math.max(0, Math.min(1, data.travelProgress));
    state.phase = ["awaiting-next", "arrived"].includes(data.phase) ? data.phase : "resume";
    if (state.phase === "awaiting-next") {
      const next = routeFor(NEXT_DESTINATION[state.journeyStartId]);
      setHint(next.label + "에 파형 효과가 나타났어요. 그 목적지를 눌러 다음 길로 가세요.");
    } else if (state.phase === "arrived") {
      setHint(route.label + "에 도착했어요.");
    } else {
      setHint("저장한 길을 이어서 걸을 수 있어요.");
    }
  }

  function bindEvents() {
    refs.destinationLayer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-destination]");
      if (button) selectDestination(button.dataset.destination);
    });
    refs.resumeButton.addEventListener("click", beginMoving);
    refs.anotherRouteButton.addEventListener("click", returnToMap);
    refs.speedButton.addEventListener("click", cycleSpeed);
    refs.resetButton.addEventListener("click", resetGame);
    refs.copyRecoveryButton.addEventListener("click", copyRecovery);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveNow();
    });
    window.addEventListener("pagehide", saveNow);
    window.addEventListener("blur", saveNow);
  }

  restoreSave();
  renderMap();
  bindEvents();
})();
