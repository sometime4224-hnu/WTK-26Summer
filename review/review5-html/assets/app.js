(function () {
  "use strict";

  var DATA = window.REVIEW5_DATA;
  var PREFIX = "snukorean:review5";
  var VERSION = 2;
  var memory = { progress: {}, attempts: {}, notices: {}, layout: "auto", ui: {}, storageFailed: false, protection: {} };

  document.addEventListener("DOMContentLoaded", function () {
    memory.layout = safeGet(PREFIX + ":v2:layout") || "auto";
    if (document.body.dataset.section) initializeSection(document.body.dataset.section);
    applyLayout();
    window.addEventListener("resize", function () { if (memory.layout === "auto") applyLayout(); });
    document.getElementById("app").addEventListener("click", onClick);
    document.getElementById("app").addEventListener("input", onInput);
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
    exposeTestHelpers();
    render();
  });

  function onClick(event) {
    var button = event.target.closest("[data-action]");
    if (!button) return;
    var action = button.dataset.action;
    var sectionId = button.dataset.section || document.body.dataset.section;
    if (action === "layout") { memory.layout = button.dataset.layout; safeSet(PREFIX + ":v2:layout", memory.layout); applyLayout(); render(); return; }
    if (action === "start" || action === "new-attempt") { start(sectionId); return; }
    if (action === "resume") { ui(sectionId).view = "quiz"; render(); return; }
    if (action === "choice") { choose(sectionId, button.dataset.question, button.dataset.choice); return; }
    if (action === "next" || action === "previous") { navigate(sectionId, action === "next" ? 1 : -1); return; }
    if (action === "jump") { jump(sectionId, Number(button.dataset.index)); return; }
    if (action === "finish") { finish(sectionId); return; }
    if (action === "retry-submit") { retrySubmit(sectionId, button.dataset.attempt); return; }
    if (action === "result") { ui(sectionId).view = "result"; ui(sectionId).attemptId = button.dataset.attempt; render(); return; }
    if (action === "home") { ui(sectionId).view = "start"; render(); return; }
    if (action === "reset-request") { ui(sectionId).resetConfirm = true; render(); return; }
    if (action === "reset-confirm") { resetSection(sectionId); return; }
    if (action === "reset-cancel") { ui(sectionId).resetConfirm = false; render(); return; }
    if (action === "copy-recovery") { copyRecovery(sectionId); return; }
    if (action === "download-recovery") { downloadRecovery(sectionId); return; }
    if (action === "play-audio") { playAudio(sectionId, button.dataset.question); }
  }

  function onInput(event) {
    if (event.target.id !== "studentNameInput") return;
    var sectionId = document.body.dataset.section;
    var progress = memory.progress[sectionId];
    if (progress) { progress.studentName = String(event.target.value || "").trim().slice(0, 40); progress.updatedAt = Date.now(); saveProgress(sectionId); }
    else safeSet(PREFIX + ":v2:studentName", String(event.target.value || "").trim().slice(0, 40));
    ui(sectionId).status = "";
  }

  function isQuiz(section) { return Boolean(section && section.homework && section.homework.submissionKind === "quiz" && section.homework.assignmentId && Array.isArray(section.questions)); }
  function initializeSection(sectionId) {
    if (!isQuiz(DATA.sections[sectionId])) return;
    if (memory.progress.hasOwnProperty(sectionId)) return;
    memory.progress[sectionId] = null;
    memory.attempts[sectionId] = [];
    memory.protection[sectionId] = { progress: null, attempts: null };
    var pKey = v2Key("progress", sectionId), aKey = v2Key("attempts", sectionId);
    var v2Progress = readRecord(pKey, "progress", sectionId);
    var v2Attempts = readRecord(aKey, "attempts", sectionId);
    if (v2Progress.valid) memory.progress[sectionId] = v2Progress.value;
    else if (v2Progress.issue) { memory.protection[sectionId].progress = v2Progress.raw; loadFallback(sectionId, "progress"); }
    if (v2Attempts.valid) memory.attempts[sectionId] = v2Attempts.value;
    else if (v2Attempts.issue) { memory.protection[sectionId].attempts = v2Attempts.raw; loadFallback(sectionId, "attempts"); }
    if (v2Progress.issue || v2Attempts.issue || memory.storageFailed) notice(sectionId, "저장된 기록을 안전하게 읽지 못했습니다. 현재 작업은 계속할 수 있습니다.");
    if (!v2Progress.exists) migrateLegacy(sectionId, "progress");
    if (!v2Attempts.exists) migrateLegacy(sectionId, "attempts");
  }

  function readRecord(key, type, sectionId) {
    var raw = safeGet(key);
    if (raw === null) return { exists: false, valid: false, raw: raw };
    try {
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== VERSION) return { exists: true, valid: false, issue: true, raw: raw };
      if (type === "progress" && !validV2Progress(parsed, sectionId)) return { exists: true, valid: false, issue: true, raw: raw };
      if (type === "attempts" && !validV2Attempts(parsed, sectionId)) return { exists: true, valid: false, issue: true, raw: raw };
      return { exists: true, valid: true, value: type === "attempts" ? parsed.attempts : parsed, raw: raw };
    } catch (_) { return { exists: true, valid: false, issue: true, raw: raw }; }
  }
  function loadFallback(sectionId, type) {
    var fallback = readRecord(fallbackKey(type, sectionId), type, sectionId);
    if (fallback.valid) {
      if (type === "progress") memory.progress[sectionId] = fallback.value;
      else memory.attempts[sectionId] = fallback.value;
    } else if (fallback.exists) notice(sectionId, "복구용 저장 기록도 안전하게 읽지 못했습니다. 현재 작업은 화면에 유지됩니다.");
  }

  function migrateLegacy(sectionId, type) {
    var legacyKey = PREFIX + ":" + type + ":" + sectionId;
    var raw = safeGet(legacyKey);
    if (raw === null) return;
    try {
      var parsed = JSON.parse(raw), value;
      if (type === "progress") {
        if (!validLegacyProgress(parsed, sectionId)) { notice(sectionId, "이전 저장 기록의 형식을 확인할 수 없어 그대로 보관했습니다."); return; }
        value = normalizeProgress(sectionId, parsed);
        value.schemaVersion = VERSION;
        if (safeSet(v2Key(type, sectionId), JSON.stringify(value))) memory.progress[sectionId] = value;
      } else {
        if (!Array.isArray(parsed) || !parsed.every(function (attempt) { return normalizeLegacyAttempt(attempt, sectionId); })) { notice(sectionId, "이전 응시 기록의 형식을 확인할 수 없어 그대로 보관했습니다."); return; }
        value = parsed.map(function (attempt) { return normalizeLegacyAttempt(attempt, sectionId); });
        if (safeSet(v2Key(type, sectionId), JSON.stringify({ schemaVersion: VERSION, attempts: value }))) memory.attempts[sectionId] = value;
      }
    } catch (_) { notice(sectionId, "이전 저장 기록이 손상되어 그대로 보관했습니다."); }
  }

  function validV2Progress(value, sectionId) { var section = DATA.sections[sectionId]; return Boolean(isQuiz(section) && value && validV2Answers(value.answers, sectionId) && value.choiceOrder && isPlainObject(value.choiceOrder) && section.questions.every(function (question) { return validOrder(value.choiceOrder[question.id], question); }) && Number.isFinite(value.currentIndex) && Math.floor(value.currentIndex) === value.currentIndex && value.currentIndex >= 0 && value.currentIndex < section.questions.length && typeof value.studentName === "string" && value.studentName.length <= 40 && Number.isFinite(value.startedAt) && Number.isFinite(value.updatedAt)); }
  function validLegacyProgress(value, sectionId) { return value && validV2Answers(value.answers, sectionId); }
  function validAnswers(answers, sectionId) {
    var section = DATA.sections[sectionId];
    return Object.keys(answers).every(function (id) { return section.questions.some(function (q) { return q.id === id && q.choices.some(function (c) { return c.id === String(answers[id]); }); }); });
  }
  function isPlainObject(value) { return Boolean(value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype); }
  function validV2Answers(answers, sectionId) { return isPlainObject(answers) && Object.keys(answers).every(function (id) { return typeof answers[id] === "string" && DATA.sections[sectionId].questions.some(function (question) { return question.id === id && question.choices.some(function (choice) { return choice.id === answers[id]; }); }); }); }
  function normalizeProgress(sectionId, value) {
    var section = DATA.sections[sectionId], copy = Object.assign({}, value);
    copy.answers = Object.assign({}, value.answers || {});
    copy.choiceOrder = value.choiceOrder && typeof value.choiceOrder === "object" ? value.choiceOrder : choiceOrders(section);
    section.questions.forEach(function (q) { if (!validOrder(copy.choiceOrder[q.id], q)) copy.choiceOrder[q.id] = q.choices.map(function (c) { return c.id; }); });
    copy.currentIndex = Math.max(0, Math.min(Number(copy.currentIndex) || 0, section.questions.length - 1));
    copy.studentName = String(copy.studentName || safeGet(PREFIX + ":v2:studentName") || "").slice(0, 40);
    copy.startedAt = Number(copy.startedAt) || Date.now(); copy.updatedAt = Number(copy.updatedAt) || Date.now(); copy.schemaVersion = VERSION;
    return copy;
  }
  function validOrder(order, question) { return Array.isArray(order) && order.length === question.choices.length && order.slice().sort().join("|") === question.choices.map(function (c) { return c.id; }).sort().join("|"); }
  function validV2Attempts(wrapper, sectionId) { return wrapper && Array.isArray(wrapper.attempts) && wrapper.attempts.every(function (attempt) { return validV2Attempt(attempt, sectionId); }); }
  function validV2Attempt(attempt, sectionId) { var section = DATA.sections[sectionId]; if (!attempt || typeof attempt !== "object" || attempt.schemaVersion !== VERSION || typeof attempt.id !== "string" || !/^attempt-\d{1,16}-[a-z0-9]{6}$/.test(attempt.id) || typeof attempt.studentName !== "string" || attempt.studentName.length > 40 || !validTimestamp(attempt.finishedAt) || !Number.isInteger(attempt.score) || !Number.isInteger(attempt.total) || attempt.total !== section.questions.length || attempt.score < 0 || attempt.score > attempt.total || !Array.isArray(attempt.results) || attempt.results.length !== section.questions.length || !attempt.submission || typeof attempt.submission !== "object" || ["submitting", "success", "failed"].indexOf(attempt.submission.status) === -1) return false; var score = 0; for (var index = 0; index < section.questions.length; index += 1) { if (!validV2Result(attempt.results[index], section.questions[index], index)) return false; if (attempt.results[index].correct) score += 1; } return score === attempt.score; }
  function validV2Result(result, question, index) { var letterPattern = new RegExp("^[A-" + letter(question.choices.length - 1) + "]$"); return Boolean(result && typeof result === "object" && result.id === question.id && result.number === index + 1 && result.tag === question.tag && result.prompt === question.prompt && typeof result.selectedId === "string" && question.choices.some(function (choice) { return choice.id === result.selectedId; }) && result.selectedText === choiceText(question, result.selectedId) && letterPattern.test(result.selectedLetter) && result.answerId === question.answer && result.answerText === choiceText(question, question.answer) && letterPattern.test(result.correctLetter) && typeof result.correct === "boolean" && result.correct === (result.selectedId === question.answer) && result.feedback === (question.feedback || "")); }

  function render() { if (document.body.dataset.role === "hub") { document.body.dataset.view = "hub"; renderHub(); } else renderSection(document.body.dataset.section); }
  function renderHub() {
    var cards = DATA.order.map(function (id) {
      var s = DATA.sections[id], quiz = isQuiz(s), progress = quiz ? getProgress(id) : null, attempts = quiz ? getAttempts(id) : [];
      return '<article class="section-card"><p class="eyebrow">복습 5</p><h2>' + esc(s.title) + '</h2><p>' + esc(s.hero) + '</p><p class="chip">' + (quiz ? esc(s.countLabel) : "긴 글 쓰기") + '</p><a class="primary-button" href="' + esc(s.href) + '">' + (progress ? "이어 하기" : "열기") + '</a>' + (attempts.length ? '<span class="history-mini">최근 ' + attempts[0].score + '/' + attempts[0].total + '</span>' : '') + '</article>';
    }).join("");
    app('<main class="app-shell"><header class="topbar"><a href="../index.html" aria-label="복습 목록">⌂</a>' + layoutControls() + '</header><section class="hero-card"><p class="eyebrow">복습 5</p><h1>복습 5 과제</h1><p>원하는 과제를 열고, 이름을 입력한 뒤 바로 시작하세요.</p></section><section class="section-grid">' + cards + '</section></main>');
  }
  function renderSection(sectionId) {
    var section = DATA.sections[sectionId]; if (!isQuiz(section)) { location.href = "index.html"; return; }
    initializeSection(sectionId); var state = ui(sectionId), progress = getProgress(sectionId); document.body.dataset.view = state.view;
    if (state.view === "result") { renderResult(section); return; }
    if (state.view === "quiz" && progress) { renderQuiz(section, progress); return; }
    renderStart(section, progress);
  }
  function renderStart(section, progress) {
    var id = section.id, attempts = getAttempts(id), name = progress ? progress.studentName : safeGet(PREFIX + ":v2:studentName") || "";
    var action = progress ? "resume" : "start", label = progress ? "이어서 풀기" : "퀴즈 시작";
    var transcriptLink = section.transcriptHref ? '<a class="secondary-button" href="' + esc(section.transcriptHref) + '">지문 보며 듣기</a>' : '';
    app('<main class="app-shell"><header class="topbar"><a href="index.html" aria-label="복습 5">⌂</a>' + layoutControls() + '</header><section class="hero-card"><p class="eyebrow">복습 5</p><h1>' + esc(section.title) + '</h1><p>' + esc(section.hero) + '</p><label class="student-name-field" for="studentNameInput">학생 이름 <b>필수</b><input id="studentNameInput" maxlength="40" autocomplete="name" value="' + esc(name) + '" placeholder="이름을 입력하세요" aria-describedby="nameStatus"></label><p id="nameStatus" class="status" aria-live="polite">' + esc(ui(id).status || "이름을 입력한 뒤 시작하세요.") + '</p><div class="section-actions"><button class="primary-button" data-action="' + action + '" data-section="' + id + '">' + label + '</button>' + transcriptLink + '</div></section>' + recoveryPanel(id) + resetControl(id) + history(section, attempts) + '</main>');
  }
  function renderQuiz(section, progress) {
    var index = progress.currentIndex, question = section.questions[index], selected = progress.answers[question.id] || "", answered = Object.keys(progress.answers).length;
    var choices = orderChoices(question, progress.choiceOrder[question.id]).map(function (choice, ix) {
      var state = selected ? (choice.id === question.answer ? " correct" : choice.id === selected ? " wrong" : "") : "";
      return '<button class="option-button' + state + '" data-action="choice" data-section="' + section.id + '" data-question="' + question.id + '" data-choice="' + choice.id + '" aria-pressed="' + (choice.id === selected) + '"><span>' + letter(ix) + '</span> ' + (choice.image ? '<img src="' + esc(choice.image) + '" alt="' + esc(choice.text) + '">' : esc(choice.text)) + '</button>';
    }).join("");
    var audio = question.audio ? '<div class="section-actions"><button class="secondary-button" data-action="play-audio" data-section="' + section.id + '" data-question="' + question.id + '">▶ ' + esc(question.audio.label) + '</button>' + (section.transcriptHref ? '<a class="secondary-button" href="' + esc(section.transcriptHref) + '">지문 보며 듣기</a>' : '') + '</div>' : "";
    var feedback = selected ? '<div class="feedback-card ' + (selected === question.answer ? "correct" : "wrong") + '" role="status"><strong>' + (selected === question.answer ? "정답입니다." : "다시 확인하세요.") + '</strong><p>정답: ' + esc(choiceText(question, question.answer)) + '</p><p>' + esc(question.feedback || "") + '</p></div>' : "";
    var nav = index === section.questions.length - 1 ? '<button class="primary-button" data-action="finish" data-section="' + section.id + '">완료하고 제출</button>' : '<button class="primary-button" data-action="next" data-section="' + section.id + '">다음</button>';
    app('<main class="app-shell"><header class="topbar"><a href="index.html" aria-label="복습 5">⌂</a>' + layoutControls() + '</header><section class="quiz-header"><p class="eyebrow">' + esc(section.title) + '</p><p>' + (index + 1) + ' / ' + section.questions.length + ' · 답한 문항 ' + answered + '</p></section><section class="question-card"><h1><span class="sr-only">문항 </span>' + (index + 1) + '</h1>' + audio + '<p class="question-prompt">' + esc(question.prompt) + '</p>' + context(question.context) + '<div class="option-grid">' + choices + '</div>' + feedback + '</section><nav class="quiz-nav"><button class="secondary-button" data-action="previous" data-section="' + section.id + '"' + (index === 0 ? " disabled" : "") + '>이전</button>' + nav + '</nav>' + recoveryPanel(section.id) + '</main>');
  }
  function renderResult(section) {
    var attempt = findAttempt(section.id, ui(section.id).attemptId) || getAttempts(section.id)[0]; if (!attempt) { ui(section.id).view = "start"; render(); return; }
    var wrong = attempt.results.filter(function (r) { return !r.correct; });
    var submit = attempt.submission || {}, status = submit.status === "success" ? "온라인 제출이 완료되었습니다." : submit.status === "failed" ? "온라인 제출에 실패했습니다. 다시 제출해 주세요." : submit.status === "submitting" ? "온라인으로 제출하고 있습니다." : "제출을 준비하고 있습니다.";
    var review = (wrong.length ? wrong : attempt.results).map(function (r) { return '<article class="review-item ' + (r.correct ? "correct" : "wrong") + '"><p><strong>' + r.number + '. ' + esc(r.prompt) + '</strong></p><p>내 답: ' + esc(r.selectedText || "미응답") + '</p><p>정답: ' + esc(r.answerText) + '</p><p>' + esc(r.feedback || "") + '</p></article>'; }).join("");
    app('<main class="app-shell"><header class="topbar"><a href="index.html" aria-label="복습 5">⌂</a>' + layoutControls() + '</header><section class="result-card"><p class="eyebrow">결과</p><h1>' + attempt.score + ' / ' + attempt.total + '</h1><p>' + esc(formatDate(attempt.finishedAt)) + '</p><p class="status homework-status--result ' + esc(submit.status || "pending") + '" role="status">' + esc(status) + '</p>' + (submit.status === "failed" ? '<button class="primary-button" data-action="retry-submit" data-section="' + section.id + '" data-attempt="' + attempt.id + '">다시 제출</button>' : '') + '<button class="secondary-button" data-action="new-attempt" data-section="' + section.id + '">새 시도 시작</button><button class="secondary-button" data-action="home" data-section="' + section.id + '">기록으로 돌아가기</button></section><section class="review-list"><h2>' + (wrong.length ? "오답 확인" : "문항 확인") + '</h2>' + review + '</section>' + recoveryPanel(section.id) + '</main>');
  }
  function history(section, attempts) { return '<section class="history-list"><h2>응시 기록</h2>' + (attempts.length ? attempts.map(function (a) { return '<article class="history-card"><strong>' + a.score + '/' + a.total + '</strong><span>' + esc(formatDate(a.finishedAt)) + '</span><button class="secondary-button" data-action="result" data-section="' + section.id + '" data-attempt="' + a.id + '">결과 보기</button></article>'; }).join("") : '<p>아직 응시 기록이 없습니다.</p>') + '</section>'; }
  function recoveryPanel(id) { var n = memory.notices[id]; if (!n) return ""; var confirmed = ui(id).resetConfirm; return '<section class="recovery" role="alert"><p>' + esc(n) + '</p><p class="status" aria-live="polite">' + esc(ui(id).copyStatus || "") + '</p><textarea id="recoveryText" readonly aria-label="복구 기록">' + esc(recoveryData(id)) + '</textarea><div><button class="secondary-button" data-action="copy-recovery" data-section="' + id + '">기록 복사</button><button class="secondary-button" data-action="download-recovery" data-section="' + id + '">기록 내려받기</button>' + (confirmed ? '<button class="secondary-button" data-action="reset-confirm" data-section="' + id + '">정말 이 과제만 초기화</button><button class="secondary-button" data-action="reset-cancel" data-section="' + id + '">취소</button>' : '<button class="text-button" data-action="reset-request" data-section="' + id + '">이 과제 초기화</button>') + '</div></section>'; }
  function resetControl(id) { if (memory.notices[id]) return ""; return ui(id).resetConfirm ? '<section class="recovery"><p>이 과제의 현재 저장 기록과 응시 기록만 초기화할까요?</p><button class="secondary-button" data-action="reset-confirm" data-section="' + id + '">정말 이 과제만 초기화</button><button class="secondary-button" data-action="reset-cancel" data-section="' + id + '">취소</button></section>' : '<p class="reset-control"><button class="text-button" data-action="reset-request" data-section="' + id + '">이 과제 저장 기록 초기화</button></p>'; }
  function layoutControls() { return '<div class="layout-controls" role="group" aria-label="화면 전환"><button data-action="layout" data-layout="auto" aria-pressed="' + (memory.layout === "auto") + '">자동</button><button data-action="layout" data-layout="phone" aria-label="스마트폰" aria-pressed="' + (memory.layout === "phone") + '">스마트폰</button><button data-action="layout" data-layout="tablet" aria-label="태블릿" aria-pressed="' + (memory.layout === "tablet") + '">태블릿</button></div>'; }

  function start(id) { if (!studentName(id)) { ui(id).status = "이름을 먼저 입력해야 시작할 수 있습니다."; render(); return; } var p = createProgress(id); p.studentName = studentName(id); memory.progress[id] = p; saveProgress(id); ui(id).finishing = false; ui(id).view = "quiz"; render(); }
  function choose(id, qid, cid) { var p = getProgress(id); if (!p) return; p.answers[qid] = cid; p.updatedAt = Date.now(); saveProgress(id); render(); }
  function navigate(id, delta) { var p = getProgress(id); if (!p) return; p.currentIndex = Math.max(0, Math.min(p.currentIndex + delta, DATA.sections[id].questions.length - 1)); p.updatedAt = Date.now(); saveProgress(id); render(); }
  function jump(id, index) { var p = getProgress(id); if (!p) return; p.currentIndex = Math.max(0, Math.min(index, DATA.sections[id].questions.length - 1)); p.updatedAt = Date.now(); saveProgress(id); render(); }
  function finish(id) {
    var section = DATA.sections[id], p = getProgress(id); if (!p || ui(id).finishing) return;
    if (!studentName(id)) { ui(id).status = "이름을 먼저 입력해야 제출할 수 있습니다."; ui(id).view = "start"; render(); return; }
    var missing = section.questions.findIndex(function (q) { return !p.answers[q.id]; });
    if (missing >= 0) { p.currentIndex = missing; p.updatedAt = Date.now(); saveProgress(id); ui(id).status = "모든 문항에 답한 뒤 제출하세요."; render(); return; }
    ui(id).finishing = true; var attempt = buildAttempt(section, p); attempt.submission = { status: "submitting", requested: true, attempts: 1 }; memory.attempts[id].unshift(attempt); saveAttempts(id); memory.progress[id] = null; removeKey(writeKey("progress", id)); ui(id).view = "result"; ui(id).attemptId = attempt.id; render(); submitAttempt(id, attempt);
  }
  function retrySubmit(id, attemptId) { var attempt = findAttempt(id, attemptId); if (!attempt || attempt.submission.status === "submitting") return; attempt.submission = { status: "submitting", requested: true, attempts: (attempt.submission.attempts || 0) + 1 }; saveAttempts(id); render(); submitAttempt(id, attempt); }
  function submitAttempt(id, attempt) { var section = DATA.sections[id]; Promise.resolve().then(function () { if (!window.HomeworkSubmitter || typeof window.HomeworkSubmitter.submitHomework !== "function") throw new Error("제출 모듈을 찾을 수 없습니다."); return window.HomeworkSubmitter.submitHomework(payload(section, attempt)); }).then(function () { attempt.submission.status = "success"; attempt.submission.submittedAt = Date.now(); saveAttempts(id); render(); }, function () { attempt.submission.status = "failed"; saveAttempts(id); notice(id, "온라인 제출에 실패했습니다. 이 기기의 결과는 저장되었습니다. 다시 제출하거나 기록을 보관하세요."); render(); }); }
  function buildAttempt(section, progress) { var results = section.questions.map(function (q, i) { var selected = progress.answers[q.id] || ""; return { id: q.id, number: i + 1, tag: q.tag, prompt: q.prompt, selectedId: selected, selectedText: choiceText(q, selected), selectedLetter: choiceLetter(q, selected, progress.choiceOrder[q.id]), answerId: q.answer, answerText: choiceText(q, q.answer), correctLetter: choiceLetter(q, q.answer, progress.choiceOrder[q.id]), correct: selected === q.answer, feedback: q.feedback || "" }; }); var score = results.filter(function (r) { return r.correct; }).length; return { id: "attempt-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8), schemaVersion: VERSION, finishedAt: Date.now(), studentName: progress.studentName, score: score, total: results.length, results: results }; }
  function payload(section, attempt) { var qr = attempt.results.map(function (r) { return { number: r.number, area: r.tag || section.title, prompt: r.prompt, studentAnswer: r.selectedText, selectedLetter: r.selectedLetter, correctAnswer: r.answerText, correctLetter: r.correctLetter, isCorrect: r.correct }; }); return { assignmentId: section.homework.assignmentId, assignmentTitle: section.homework.title, chapter: "review5", sectionId: section.id, sectionTitle: section.title, studentName: attempt.studentName || studentName(section.id), score: attempt.score, total: attempt.total, percent: Math.round(attempt.score / attempt.total * 100), completed: true, answered: attempt.total, correctQuestions: qr.filter(function (x) { return x.isCorrect; }).map(function (x) { return x.number; }), wrongQuestions: qr.filter(function (x) { return !x.isCorrect; }).map(function (x) { return x.number; }), questionResults: qr, clientSubmittedAt: new Date().toISOString(), signatureHash: hash(section.homework.assignmentId + ":" + attempt.id + ":" + attempt.results.map(function (r) { return r.id + ":" + r.selectedId; }).join("|")) }; }

  function createProgress(id) { var s = DATA.sections[id]; return { schemaVersion: VERSION, answers: {}, choiceOrder: choiceOrders(s), currentIndex: 0, startedAt: Date.now(), updatedAt: Date.now(), studentName: safeGet(PREFIX + ":v2:studentName") || "" }; }
  function choiceOrders(section) { var o = {}; section.questions.forEach(function (q) { o[q.id] = q.choices.map(function (c) { return c.id; }); }); return o; }
  function getProgress(id) { initializeSection(id); return memory.progress[id]; }
  function getAttempts(id) { initializeSection(id); return memory.attempts[id] || []; }
  function saveProgress(id) { if (!safeSet(writeKey("progress", id), JSON.stringify(memory.progress[id]))) notice(id, "기기에 저장하지 못했습니다. 현재 작업은 화면에 유지됩니다."); }
  function saveAttempts(id) { if (!safeSet(writeKey("attempts", id), JSON.stringify({ schemaVersion: VERSION, attempts: memory.attempts[id] }))) notice(id, "기기에 저장하지 못했습니다. 현재 결과는 화면에 유지됩니다."); }
  function findAttempt(id, aid) { return getAttempts(id).find(function (a) { return a.id === aid; }); }
  function studentName(id) { return String((getProgress(id) && getProgress(id).studentName) || safeGet(PREFIX + ":v2:studentName") || "").trim(); }
  function ui(id) { if (!memory.ui[id]) memory.ui[id] = { view: "start", attemptId: "", status: "", resetConfirm: false }; return memory.ui[id]; }
  function v2Key(type, id) { return PREFIX + ":v2:" + type + ":" + id; }
  function fallbackKey(type, id) { return PREFIX + ":v2:recovery:" + type + ":" + id; }
  function writeKey(type, id) { return memory.protection[id] && memory.protection[id][type] !== null ? fallbackKey(type, id) : v2Key(type, id); }
  function readStorage(key) { try { return { ok: true, value: localStorage.getItem(key) }; } catch (_) { memory.storageFailed = true; return { ok: false, value: null }; } }
  function safeGet(key) { return readStorage(key).value; }
  function safeSet(key, value) { try { localStorage.setItem(key, value); return true; } catch (_) { memory.storageFailed = true; return false; } }
  function removeKey(key) { try { localStorage.removeItem(key); return true; } catch (_) { memory.storageFailed = true; return false; } }
  function notice(id, text) { memory.notices[id] = text; }
  function flush() { var id = document.body.dataset.section; if (id && memory.progress[id]) saveProgress(id); if (id && memory.attempts[id]) saveAttempts(id); }
  function resetSection(id) { var keys = [v2Key("progress", id), v2Key("attempts", id), fallbackKey("progress", id), fallbackKey("attempts", id), PREFIX + ":progress:" + id, PREFIX + ":attempts:" + id], snapshots = keys.map(function (key) { var read = readStorage(key); return { key: key, raw: read.value, ok: read.ok }; }), removed = [], failed = snapshots.some(function (entry) { return !entry.ok; }); snapshots.forEach(function (entry) { if (failed || entry.raw === null) return; if (removeKey(entry.key)) removed.push(entry); else failed = true; }); if (failed) { removed.forEach(function (entry) { safeSet(entry.key, entry.raw); }); notice(id, "초기화하지 못했습니다. 현재 작업과 저장 기록을 그대로 유지합니다."); ui(id).resetConfirm = false; render(); return; } memory.progress[id] = null; memory.attempts[id] = []; memory.protection[id] = { progress: null, attempts: null }; delete memory.notices[id]; ui(id).resetConfirm = false; ui(id).view = "start"; render(); }
  function recoveryData(id) { return JSON.stringify({ sectionId: id, progress: memory.progress[id], attempts: memory.attempts[id], protectedOriginal: memory.protection[id], notice: memory.notices[id], savedAt: new Date().toISOString() }, null, 2); }
  function copyRecovery(id) { var text = recoveryData(id), area = document.getElementById("recoveryText"); function fallback() { var node = area || document.createElement("textarea"); if (!area) { node.value = text; document.body.appendChild(node); } node.focus(); node.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (_) {} if (!area) node.remove(); ui(id).copyStatus = ok ? "기록을 복사했습니다." : "복사하지 못했습니다. 아래 기록을 선택해 복사하거나 내려받으세요."; render(); } if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { ui(id).copyStatus = "기록을 복사했습니다."; render(); }, fallback); else fallback(); }
  function downloadRecovery(id) { try { var blob = new Blob([recoveryData(id)], { type: "application/json" }), link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "review5-" + id + "-recovery.json"; link.click(); setTimeout(function () { URL.revokeObjectURL(link.href); }, 0); ui(id).copyStatus = "복구 기록을 내려받기 시작했습니다."; } catch (_) { ui(id).copyStatus = "내려받기를 시작하지 못했습니다. 아래 기록을 복사하세요."; } render(); }
  function applyLayout() { var wide = window.innerWidth >= 900, effective = memory.layout === "auto" ? (wide ? "desktop" : "phone") : memory.layout; document.documentElement.dataset.layout = effective; document.documentElement.dataset.layoutPreference = memory.layout; }
  function orderChoices(q, ids) { return (ids || []).map(function (id) { return q.choices.find(function (c) { return c.id === String(id); }); }).filter(Boolean); }
  function choiceText(q, id) { var c = q.choices.find(function (x) { return x.id === String(id); }); return c ? c.text : ""; }
  function choiceLetter(q, id, order) { var i = (order || []).indexOf(String(id)); return i < 0 ? "" : letter(i); }
  function letter(i) { return String.fromCharCode(65 + i); }
  function context(items) { return items && items.length ? '<div class="context">' + items.map(function (i) { return '<p>' + esc(i.text).replace(/\n/g, "<br>") + '</p>'; }).join("") + '</div>' : ""; }
  function playAudio(id, qid) { var q = DATA.sections[id].questions.find(function (x) { return x.id === qid; }); if (q && q.audio) { var audio = new Audio(q.audio.file || ("assets/audio/" + qid + ".mp3")); audio.play().catch(function () {}); } }
  function normalizeLegacyAttempt(attempt, sectionId) { var section = DATA.sections[sectionId]; if (!attempt || typeof attempt !== "object" || !Array.isArray(attempt.results) || attempt.results.length !== section.questions.length) return null; var results = []; for (var index = 0; index < section.questions.length; index += 1) { var source = attempt.results[index], question = section.questions[index], canonicalOrder = question.choices.map(function (choice) { return choice.id; }); if (!source || typeof source !== "object" || source.id !== question.id || !question.choices.some(function (choice) { return choice.id === String(source.selectedId); })) return null; var selectedId = String(source.selectedId); results.push({ id: question.id, number: index + 1, tag: question.tag, prompt: question.prompt, selectedId: selectedId, selectedText: choiceText(question, selectedId), selectedLetter: choiceLetter(question, selectedId, canonicalOrder), answerId: question.answer, answerText: choiceText(question, question.answer), correctLetter: choiceLetter(question, question.answer, canonicalOrder), correct: selectedId === question.answer, feedback: question.feedback || "" }); } var score = results.filter(function (result) { return result.correct; }).length, finishedAt = validTimestamp(attempt.finishedAt) ? attempt.finishedAt : Date.now(), safeId = /^attempt-\d{1,16}-[a-z0-9]{6}$/.test(attempt.id || "") ? attempt.id : "attempt-" + finishedAt + "-000000"; return { id: safeId, schemaVersion: VERSION, finishedAt: finishedAt, studentName: typeof attempt.studentName === "string" ? attempt.studentName.slice(0, 40) : "", score: score, total: section.questions.length, results: results, submission: { status: "failed", attempts: 0 } }; }
  function validTimestamp(value) { return Number.isFinite(value) && Math.abs(value) <= 8640000000000000 && Number.isFinite(new Date(value).getTime()); }
  function formatDate(value) { return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
  function hash(source) { var h = 2166136261; for (var i = 0; i < source.length; i++) { h ^= source.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function esc(v) { return String(v || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;"); }
  function app(html) { document.getElementById("app").innerHTML = html; }
  function exposeTestHelpers() { window.__review5App = { fillAnswers: function (id, correct) { initializeSection(id); var p = memory.progress[id] || createProgress(id); p.studentName = p.studentName || "테스트학생"; DATA.sections[id].questions.forEach(function (q) { p.answers[q.id] = correct === false ? q.choices.find(function (c) { return c.id !== q.answer; }).id : q.answer; }); p.currentIndex = DATA.sections[id].questions.length - 1; memory.progress[id] = p; saveProgress(id); if (document.body.dataset.section === id) render(); }, getState: function (id) { return { progress: memory.progress[id], attempts: memory.attempts[id], notice: memory.notices[id] }; }, reset: resetSection, storageKeys: function (id) { return { progress: v2Key("progress", id), attempts: v2Key("attempts", id) }; } }; }
}());
