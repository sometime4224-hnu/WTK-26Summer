(function () {
  "use strict";

  var DATA = window.REVIEW5_DATA;
  var STORAGE_KEY = "snukorean:review5:listening-transcripts:v2:state";
  var LEGACY_STORAGE_KEY = "snukorean:review5:listening-transcripts:v1:state";
  var VERSION = 2;
  /*
   * Inspected speech spans in seconds. These were placed from each MP3's
   * silencedetect boundaries (−35 dB) and the utterance order in the approved
   * transcript. Intro/question prompts and trailing material are deliberately
   * not cued. The values use the encoded clips' nominal durations; a very small
   * duration scale below absorbs container/decoder variance without moving the
   * relative boundaries.
   */
  var INSPECTED_CUES = {
    l1: [[12.03, 13.85], [14.90, 16.48], [17.53, 23.06], [24.12, 26.58]],
    l2: [[12.23, 25.69]],
    l3: [[12.50, 15.95], [16.72, 19.56]],
    l4: [[1.98, 4.45], [5.15, 12.08]],
    l5: [[1.79, 4.43], [4.98, 13.17]],
    l6: [[9.05, 13.58], [14.64, 19.83], [20.55, 22.95], [24.01, 28.65]],
    l7: [[6.82, 9.46], [10.32, 17.49], [18.56, 21.78]],
    l8: [[7.58, 9.22], [9.83, 12.16], [13.24, 15.79], [16.32, 18.88]],
    l9: [[14.95, 17.39], [17.91, 19.42], [20.48, 22.84], [23.93, 26.21], [26.85, 28.45], [29.49, 30.01], [30.62, 36.52]],
    l10: [[16.25, 21.69], [22.22, 34.20]],
    l11: [[12.06, 23.39], [24.43, 48.25]],
    l12: [[13.04, 27.38], [28.11, 45.18]],
    "l13-14": [[25.70, 30.54], [31.35, 36.31], [37.44, 45.24], [46.34, 48.51], [49.40, 51.50], [52.62, 55.63]],
    "l15-16": [[16.91, 34.41], [35.45, 47.05], [48.06, 55.97]]
  };
  var NOMINAL_DURATIONS = { l1: 27.12, l2: 26.23, l3: 20.11, l4: 12.62, l5: 13.71, l6: 34.32, l7: 24.45, l8: 22.54, l9: 39.16, l10: 34.74, l11: 48.80, l12: 45.74, "l13-14": 58.75, "l15-16": 56.50 };
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
    return { id: id || question.id, label: label, audio: question.audio.file, trackLabel: question.audio.label, transcript: question.audio.transcript, questions: questions || [question] };
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
    audio.addEventListener("seeking", updateCurrentLine);
    audio.addEventListener("ended", function () { updateCurrentLine(); saveState(true); });
    audio.addEventListener("pause", function () { if (!suppressSave) saveState(true); });
    audio.addEventListener("ratechange", function () { state.playbackRate = validRate(audio.playbackRate) ? audio.playbackRate : 1; saveState(true); });
    audio.addEventListener("error", function () { status.textContent = "음원을 불러오지 못했습니다."; updateCurrentLine(); });
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
    window.addEventListener("pagehide", function () { saveState(true); });
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
    updateCurrentLine();
    saveState(true);
  }

  function onTimeChange() {
    updateCurrentLine();
    if (Math.abs((Number(audio.currentTime) || 0) - lastSavedPosition) >= 1) saveState(false);
  }

  function cueBoundaries(unit, duration) {
    var spans = unit && INSPECTED_CUES[unit.id];
    var nominal = unit && NOMINAL_DURATIONS[unit.id];
    if (!spans || !nominal || spans.length !== unit.transcript.length) return [];
    var scale = Number.isFinite(duration) && duration > 0 ? duration / nominal : 1;
    return spans.map(function (span, index) { return { index: index, start: span[0] * scale, end: span[1] * scale }; });
  }

  function renderLines() {
    lines.innerHTML = selectedUnit.transcript.map(function (line, index) {
      return '<li><button type="button" class="transcript-line" data-cue-index="' + index + '"><span class="speaker">' + escapeHtml(line.speaker || "") + '</span><span>' + escapeHtml(line.text) + '</span></button></li>';
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

  function updateCurrentLine() {
    var index = activeCueIndex(Number(audio.currentTime) || 0, currentCues, Number(audio.duration));
    Array.prototype.forEach.call(lines.querySelectorAll(".transcript-line"), function (button, buttonIndex) {
      var current = buttonIndex === index;
      button.classList.toggle("is-current", current);
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
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
    updateCurrentLine();
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
      getUnits: function () { return units.map(function (unit) { return { id: unit.id, label: unit.label, audio: unit.audio, transcriptLength: unit.transcript.length, questionIds: unit.questions.map(function (question) { return question.id; }) }; }); },
      getCues: function (unitId, duration) { var unit = units.find(function (item) { return item.id === unitId; }) || selectedUnit; return cueBoundaries(unit, duration).map(function (cue) { return { index: cue.index, start: cue.start, end: cue.end }; }); },
      getActiveIndex: function (unitId, time, duration) { var unit = units.find(function (item) { return item.id === unitId; }) || selectedUnit; return activeCueIndex(time, cueBoundaries(unit, duration), duration); },
      storageKey: STORAGE_KEY,
      legacyStorageKey: LEGACY_STORAGE_KEY
    });
  }
}());
