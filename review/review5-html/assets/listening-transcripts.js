(function () {
  "use strict";

  var DATA = window.REVIEW5_DATA;
  var ALIGNMENT = window.REVIEW5_TRANSCRIPT_ALIGNMENT;
  var STORAGE_KEY = "snukorean:review5:listening-transcripts:v2:state";
  var LEGACY_STORAGE_KEY = "snukorean:review5:listening-transcripts:v1:state";
  var VERSION = 2;
  var units = buildUnits();
  var selectedUnit = units[0];
  var state = defaultState();
  var protectedRecord = null;
  var storageUnavailable = false;
  var lastSavedPosition = -1;
  var audio;
  var select;
  var lines;
  var practice;
  var status;
  var currentCues = [];
  var suppressSave = false;
  var syncFrame = 0;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    select = document.getElementById("trackSelect");
    audio = document.getElementById("transcriptAudio");
    lines = document.getElementById("transcriptLines");
    practice = document.getElementById("practiceQuestions");
    status = document.getElementById("trackStatus");
    restoreState();
    selectedUnit = units.find(function (unit) { return unit.id === state.unitId; }) || units[0];
    state.unitId = selectedUnit.id;
    renderOptions();
    bindEvents();
    select.value = selectedUnit.id;
    loadUnit(false);
    renderRecovery();
    exposeTestHelpers();
  }

  function buildUnits() {
    var questions = DATA && DATA.sections && DATA.sections.listening && DATA.sections.listening.questions || [];
    var single = questions.slice(0, 12).map(function (question, index) { return unit(question, String(index + 1) + "번", null, [question]); });
    var shared = [
      unit(questions[12], "13–14번", "l13-14", questions.slice(12, 14)),
      unit(questions[14], "15–16번", "l15-16", questions.slice(14, 16))
    ];
    return single.concat(shared).filter(function (item) { return item && item.audio && Array.isArray(item.transcript); });
  }

  function unit(question, label, id, questions) {
    if (!question || !question.audio) return null;
    var unitId = id || question.id;
    return { id: unitId, label: label, audio: question.audio.file, trackLabel: question.audio.label, transcript: question.audio.transcript, questions: questions || [question], alignment: ALIGNMENT && ALIGNMENT.units && ALIGNMENT.units[unitId] };
  }

  function defaultState() { return { schemaVersion: VERSION, unitId: units[0] ? units[0].id : "l1", position: 0, playbackRate: 1, answers: {}, updatedAt: Date.now() }; }

  function renderOptions() {
    select.innerHTML = units.map(function (unit) { return '<option value="' + escapeHtml(unit.id) + '">' + escapeHtml(unit.label) + '</option>'; }).join("");
  }

  function bindEvents() {
    select.addEventListener("change", function () {
      var next = units.find(function (unit) { return unit.id === select.value; });
      if (!next) return;
      saveState();
      selectedUnit = next;
      state.unitId = next.id;
      state.position = 0;
      lastSavedPosition = -1;
      loadUnit(true);
      saveState(true);
    });
    audio.addEventListener("loadedmetadata", onMetadata);
    audio.addEventListener("timeupdate", onTimeChange);
    audio.addEventListener("seeking", updateCurrentPhrase);
    audio.addEventListener("play", startPhraseSync);
    audio.addEventListener("playing", startPhraseSync);
    audio.addEventListener("ended", function () { stopPhraseSync(); updateCurrentPhrase(); saveState(true); });
    audio.addEventListener("pause", function () { stopPhraseSync(); updateCurrentPhrase(); if (!suppressSave) saveState(true); });
    audio.addEventListener("ratechange", function () { state.playbackRate = validRate(audio.playbackRate) ? audio.playbackRate : 1; saveState(true); });
    audio.addEventListener("error", function () { status.textContent = "음원을 불러오지 못했습니다."; updateCurrentPhrase(); });
    lines.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-cue-index]");
      if (!button) return;
      seekToCue(Number(button.dataset.cueIndex));
    });
    practice.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-question-id][data-choice-id]");
      if (!button) return;
      choosePracticeAnswer(button.dataset.questionId, button.dataset.choiceId);
    });
    window.addEventListener("pagehide", function () { stopPhraseSync(); saveState(true); });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") saveState(true); });
    document.getElementById("recoveryNotice").addEventListener("click", onRecoveryAction);
  }

  function loadUnit(announce) {
    document.getElementById("trackLabel").textContent = selectedUnit.label;
    status.textContent = announce ? selectedUnit.label + "을 선택했습니다." : "";
    currentCues = cueBoundaries(selectedUnit, 0);
    renderLines();
    renderPractice();
    suppressSave = true;
    audio.pause();
    audio.src = selectedUnit.audio;
    audio.playbackRate = state.playbackRate;
    audio.load();
    suppressSave = false;
  }

  function onMetadata() {
    var duration = audio.duration;
    currentCues = cueBoundaries(selectedUnit, duration);
    var position = boundedPosition(state.position, duration);
    if (position > 0) {
      try { audio.currentTime = position; } catch (_) {}
    }
    renderLines();
    updateCurrentPhrase();
    saveState(true);
  }

  function onTimeChange() {
    updateCurrentPhrase();
    if (Math.abs((Number(audio.currentTime) || 0) - lastSavedPosition) >= 1) saveState(false);
  }

  function cueBoundaries(unit, duration) {
    var alignment = unit && unit.alignment;
    if (!alignment || !Number.isFinite(alignment.duration) || alignment.duration <= 0 || !Array.isArray(alignment.lines) || alignment.lines.length !== unit.transcript.length) return [];
    var scale = Number.isFinite(duration) && duration > 0 ? duration / alignment.duration : 1;
    var cues = [];
    alignment.lines.forEach(function (phrases, lineIndex) {
      if (!Array.isArray(phrases)) return;
      phrases.forEach(function (phrase, phraseIndex) {
        if (!Array.isArray(phrase) || typeof phrase[0] !== "string" || !Number.isFinite(phrase[1]) || !Number.isFinite(phrase[2]) || phrase[2] <= phrase[1]) return;
        cues.push({ index: cues.length, lineIndex: lineIndex, phraseIndex: phraseIndex, text: phrase[0], start: phrase[1] * scale, end: phrase[2] * scale });
      });
    });
    return cues;
  }

  function renderLines() {
    lines.innerHTML = selectedUnit.transcript.map(function (line, lineIndex) {
      var cues = currentCues.filter(function (cue) { return cue.lineIndex === lineIndex; });
      var text = cues.length ? cues.map(function (cue) {
        return '<button type="button" class="transcript-phrase" data-cue-index="' + cue.index + '" aria-label="' + escapeHtml(cue.text) + '부터 듣기">' + escapeHtml(cue.text) + '</button>';
      }).join('<span class="phrase-space" aria-hidden="true"> </span>') : '<span>' + escapeHtml(line.text) + '</span>';
      return '<li class="transcript-line"><span class="speaker">' + escapeHtml(line.speaker || "") + '</span><span class="transcript-text">' + text + '</span></li>';
    }).join("");
  }

  function renderPractice() {
    practice.innerHTML = selectedUnit.questions.map(function (question, questionIndex) {
      var selected = state.answers[question.id] || "";
      var selectedChoice = question.choices.find(function (choice) { return choice.id === selected; });
      var correctChoice = question.choices.find(function (choice) { return choice.id === question.answer; });
      var options = question.choices.map(function (choice, choiceIndex) {
        var chosen = choice.id === selected;
        var resultClass = selected ? (choice.id === question.answer ? " is-correct" : chosen ? " is-wrong" : "") : "";
        var image = choice.image ? '<img src="' + escapeHtml(choice.image) + '" alt="' + escapeHtml(choice.text) + '">' : "";
        return '<button type="button" class="practice-option' + (choice.image ? " has-image" : "") + resultClass + '" data-question-id="' + escapeHtml(question.id) + '" data-choice-id="' + escapeHtml(choice.id) + '" aria-pressed="' + chosen + '"><span class="choice-letter">' + letter(choiceIndex) + '</span><span>' + escapeHtml(choice.text) + '</span>' + image + '</button>';
      }).join("");
      var feedback = "";
      if (selectedChoice && correctChoice) {
        var correct = selected === question.answer;
        feedback = '<p class="practice-feedback ' + (correct ? "correct" : "wrong") + '" role="status"><strong>' + (correct ? "정답입니다." : "다시 확인해 보세요.") + '</strong>' + (correct ? "" : '<span>정답: ' + escapeHtml(correctChoice.text) + '</span>') + '<span>' + escapeHtml(question.feedback || "") + '</span></p>';
      }
      return '<article class="practice-question" data-practice-question="' + escapeHtml(question.id) + '"><p class="practice-number">' + (selectedUnit.questions.length > 1 ? selectedUnit.label + " · " + (questionIndex + 1) : selectedUnit.label) + '</p><p class="practice-prompt">' + escapeHtml(question.prompt) + '</p><div class="practice-options">' + options + '</div>' + feedback + '</article>';
    }).join("");
  }

  function choosePracticeAnswer(questionId, choiceId) {
    var question = selectedUnit.questions.find(function (item) { return item.id === questionId; });
    if (!question || !question.choices.some(function (choice) { return choice.id === choiceId; })) return;
    state.answers[questionId] = choiceId;
    saveState(true);
    renderPractice();
  }

  function letter(index) { return String.fromCharCode(65 + index); }

  function updateCurrentPhrase() {
    var index = activeCueIndex(Number(audio.currentTime) || 0, currentCues, Number(audio.duration));
    Array.prototype.forEach.call(lines.querySelectorAll(".transcript-phrase"), function (button) {
      var current = Number(button.dataset.cueIndex) === index;
      button.classList.toggle("is-current", current);
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  function startPhraseSync() {
    if (syncFrame) return;
    function tick() {
      updateCurrentPhrase();
      if (!audio.paused && !audio.ended) syncFrame = window.requestAnimationFrame(tick);
      else syncFrame = 0;
    }
    syncFrame = window.requestAnimationFrame(tick);
  }

  function stopPhraseSync() {
    if (!syncFrame) return;
    window.cancelAnimationFrame(syncFrame);
    syncFrame = 0;
  }

  function activeCueIndex(time, cues, duration) {
    if (!cues.length || !Number.isFinite(time) || time < 0) return -1;
    for (var index = 0; index < cues.length; index += 1) {
      if (time >= cues[index].start && time < cues[index].end) return index;
    }
    return -1;
  }

  function seekToCue(index) {
    var cue = currentCues[index];
    if (!cue) return;
    try { audio.currentTime = cue.start; } catch (_) { return; }
    updateCurrentPhrase();
    saveState(true);
    var play = audio.play();
    if (play && typeof play.catch === "function") play.catch(function () {});
  }

  function restoreState() {
    var record = readStorage(STORAGE_KEY);
    if (!record.ok) { storageUnavailable = true; return; }
    if (record.raw !== null) {
      try {
        var current = JSON.parse(record.raw);
        if (!validState(current)) { protectedRecord = { key: STORAGE_KEY, raw: record.raw }; return; }
        state = current;
      } catch (_) { protectedRecord = { key: STORAGE_KEY, raw: record.raw }; }
      return;
    }
    var legacy = readStorage(LEGACY_STORAGE_KEY);
    if (!legacy.ok) { storageUnavailable = true; return; }
    if (legacy.raw === null) return;
    try {
      var parsed = JSON.parse(legacy.raw);
      if (!validLegacyState(parsed)) { protectedRecord = { key: LEGACY_STORAGE_KEY, raw: legacy.raw }; return; }
      state = { schemaVersion: VERSION, unitId: parsed.unitId, position: parsed.position, playbackRate: parsed.playbackRate, answers: {}, updatedAt: parsed.updatedAt };
    } catch (_) { protectedRecord = { key: LEGACY_STORAGE_KEY, raw: legacy.raw }; }
  }

  function validState(value) {
    return Boolean(validBaseState(value, VERSION) && validAnswers(value.answers));
  }

  function validLegacyState(value) { return validBaseState(value, 1); }

  function validBaseState(value, version) {
    return Boolean(value && value.schemaVersion === version && units.some(function (unit) { return unit.id === value.unitId; }) && Number.isFinite(value.position) && value.position >= 0 && validRate(value.playbackRate) && Number.isFinite(value.updatedAt));
  }

  function validAnswers(answers) {
    if (!isPlainObject(answers)) return false;
    var questions = DATA.sections.listening.questions;
    return Object.keys(answers).every(function (questionId) {
      var question = questions.find(function (item) { return item.id === questionId; });
      return Boolean(question && typeof answers[questionId] === "string" && question.choices.some(function (choice) { return choice.id === answers[questionId]; }));
    });
  }

  function isPlainObject(value) { return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype); }

  function validRate(rate) { return Number.isFinite(rate) && rate >= 0.5 && rate <= 4; }

  function boundedPosition(position, duration) {
    var safe = Number.isFinite(position) && position >= 0 ? position : 0;
    return Number.isFinite(duration) && duration > 0 ? Math.min(safe, duration) : safe;
  }

  function saveState(force) {
    state.position = boundedPosition(Number(audio && audio.currentTime) || state.position, Number(audio && audio.duration));
    state.playbackRate = audio && validRate(audio.playbackRate) ? audio.playbackRate : state.playbackRate;
    state.updatedAt = Date.now();
    if (!validAnswers(state.answers)) state.answers = {};
    if (protectedRecord !== null || storageUnavailable) return false;
    if (!force && Math.abs(state.position - lastSavedPosition) < 1) return true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSavedPosition = state.position;
      return true;
    } catch (_) {
      storageUnavailable = true;
      renderRecovery();
      return false;
    }
  }

  function readStorage(key) {
    try { return { ok: true, raw: localStorage.getItem(key) }; } catch (_) { return { ok: false, raw: null }; }
  }

  function renderRecovery() {
    var panel = document.getElementById("recoveryNotice");
    if (protectedRecord === null && !storageUnavailable) { panel.hidden = true; return; }
    var message = protectedRecord !== null ? "저장된 기록을 안전하게 읽지 못해 그대로 보관하고 있습니다." : "이 기기에 저장하지 못했습니다. 현재 상태는 화면에서 계속 사용할 수 있습니다.";
    panel.hidden = false;
    panel.innerHTML = '<details open><summary>저장 기록 안내</summary><p>' + message + '</p><div class="recovery-actions"><button type="button" data-recovery="copy">기록 복사</button><button type="button" data-recovery="download">기록 내려받기</button><button type="button" class="danger" data-recovery="reset-request">이 페이지 저장 기록 초기화</button></div></details>';
  }

  function onRecoveryAction(event) {
    var button = event.target.closest("button[data-recovery]");
    if (!button) return;
    var action = button.dataset.recovery;
    if (action === "copy") copyRecovery();
    if (action === "download") downloadRecovery();
    if (action === "reset-request") {
      button.dataset.recovery = "reset-confirm";
      button.textContent = "정말 이 페이지만 초기화";
    } else if (action === "reset-confirm") resetPageState();
  }

  function recoveryData() { return JSON.stringify({ state: state, protectedOriginal: protectedRecord, savedAt: new Date().toISOString() }, null, 2); }

  function copyRecovery() {
    var text = recoveryData();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    else fallbackCopy(text);
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    try { document.execCommand("copy"); } catch (_) {}
    area.remove();
  }

  function downloadRecovery() {
    try {
      var link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([recoveryData()], { type: "application/json" }));
      link.download = "review5-listening-transcripts-recovery.json";
      link.click();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 0);
    } catch (_) {}
  }

  function resetPageState() {
    var keys = [STORAGE_KEY, LEGACY_STORAGE_KEY];
    var snapshots = [];
    try {
      keys.forEach(function (key) { snapshots.push({ key: key, raw: localStorage.getItem(key) }); });
      keys.forEach(function (key) { localStorage.removeItem(key); });
    } catch (_) {
      snapshots.forEach(function (snapshot) { try { if (snapshot.raw !== null) localStorage.setItem(snapshot.key, snapshot.raw); } catch (_) {} });
      storageUnavailable = true;
      renderRecovery();
      return;
    }
    protectedRecord = null;
    storageUnavailable = false;
    state = defaultState();
    selectedUnit = units[0];
    select.value = selectedUnit.id;
    loadUnit(true);
    saveState(true);
    renderRecovery();
  }

  function escapeHtml(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function exposeTestHelpers() {
    window.__review5TranscriptApp = Object.freeze({
      getState: function () { return JSON.parse(JSON.stringify(state)); },
      getUnits: function () { return units.map(function (unit) { return { id: unit.id, label: unit.label, audio: unit.audio, transcriptLength: unit.transcript.length, phraseCount: cueBoundaries(unit, 0).length, questionIds: unit.questions.map(function (question) { return question.id; }) }; }); },
      getCues: function (unitId, duration) { var unit = units.find(function (item) { return item.id === unitId; }) || selectedUnit; return cueBoundaries(unit, duration).map(function (cue) { return { index: cue.index, lineIndex: cue.lineIndex, phraseIndex: cue.phraseIndex, text: cue.text, start: cue.start, end: cue.end }; }); },
      getActiveIndex: function (unitId, time, duration) { var unit = units.find(function (item) { return item.id === unitId; }) || selectedUnit; return activeCueIndex(time, cueBoundaries(unit, duration), duration); },
      storageKey: STORAGE_KEY,
      legacyStorageKey: LEGACY_STORAGE_KEY
    });
  }
}());
