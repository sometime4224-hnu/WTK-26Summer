(function () {
  var DATA = window.REVIEW4_DATA;
  var FEEDBACK_I18N = window.REVIEW4_FEEDBACK_I18N || {};
  var STORAGE_PREFIX = "snukorean:review4";
  var STUDENT_NAME_KEY = "homeworkStudentName";
  var CHOICE_LABELS = ["1", "2", "3", "4"];
  var runtime = {
    layoutPreference: normalizeLayoutPreference(loadText("layoutPreference") || "auto"),
    activeLayout: "",
    sectionUi: {},
    speakingQuestionId: "",
    audioElement: null
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyLayout();
    document.getElementById("app").addEventListener("click", onClick);
    document.getElementById("app").addEventListener("input", onInput);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    window.addEventListener("beforeunload", stopAudio);
    render();
  });

  function onClick(event) {
    var target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    var action = target.getAttribute("data-action");
    var sectionId = target.getAttribute("data-section") || document.body.dataset.section;
    var ui = sectionId ? getUi(sectionId) : null;

    if (action === "set-layout") {
      runtime.layoutPreference = normalizeLayoutPreference(target.getAttribute("data-layout"));
      saveText("layoutPreference", runtime.layoutPreference);
      applyLayout();
      render();
      return;
    }

    if (action === "start" || action === "restart") {
      if (sectionId) {
        if (!ensureHomeworkName(sectionId)) {
          return;
        }
        stopAudio();
        clearProgress(sectionId);
        setProgress(sectionId, createProgress(sectionId));
        ui.view = "quiz";
        ui.activeAttemptId = "";
        ui.modalAttemptId = "";
        ui.filter = "incorrect";
        render();
      }
      return;
    }

    if (action === "resume") {
      if (sectionId) {
        if (!ensureHomeworkName(sectionId)) {
          return;
        }
        stopAudio();
        ui.view = "quiz";
        ui.activeAttemptId = "";
        ui.modalAttemptId = "";
        render();
      }
      return;
    }

    if (action === "select-choice") {
      updateChoice(sectionId, target.getAttribute("data-question"), target.getAttribute("data-choice"));
      return;
    }

    if (action === "prev-question") {
      moveQuestion(sectionId, -1);
      return;
    }

    if (action === "next-question") {
      moveQuestion(sectionId, 1);
      return;
    }

    if (action === "jump-question") {
      jumpQuestion(sectionId, Number(target.getAttribute("data-index")));
      return;
    }

    if (action === "finish-section") {
      finishSection(sectionId);
      return;
    }

    if (action === "play-audio") {
      toggleAudio(sectionId, target.getAttribute("data-question"));
      return;
    }

    if (action === "view-attempt") {
      ui.modalAttemptId = target.getAttribute("data-attempt");
      render();
      return;
    }

    if (action === "close-modal") {
      if (ui) {
        ui.modalAttemptId = "";
      }
      render();
      return;
    }

    if (action === "show-result") {
      if (ui) {
        ui.activeAttemptId = target.getAttribute("data-attempt");
        ui.view = "result";
      }
      render();
      return;
    }

    if (action === "back-to-start") {
      if (ui) {
        stopAudio();
        ui.view = "start";
        ui.activeAttemptId = "";
      }
      render();
      return;
    }

    if (action === "set-filter") {
      if (ui) {
        ui.filter = target.getAttribute("data-filter");
      }
      render();
    }
  }

  function onInput(event) {
    if (event.target && event.target.id === "studentNameInput") {
      saveStudentName(event.target.value);
      if (document.body.dataset.section && readStudentName()) {
        clearHomeworkStatus(document.body.dataset.section);
      }
      updateHomeworkPanelState(event.target.closest(".homework-panel"), readStudentName());
    }
  }

  function render() {
    if (document.body.dataset.role === "hub") {
      renderHub();
      return;
    }
    renderSection(document.body.dataset.section);
  }

  function renderHub() {
    setViewState("hub");
    var activeProgressCount = 0;
    var totalAttemptCount = 0;
    var cards = DATA.order.map(function (sectionId) {
      var section = DATA.sections[sectionId];
      var progress = getProgress(sectionId);
      var attempts = getAttempts(sectionId);
      var latest = attempts[0];
      var best = getBestAttempt(attempts);
      var answered = progress ? Object.keys(progress.answers).length : 0;
      if (answered) {
        activeProgressCount += 1;
      }
      totalAttemptCount += attempts.length;
      var progressLabel = answered ? answered + "/" + section.questions.length : "새로 시작";
      var latestLabel = latest ? formatScore(latest) : "기록 없음";
      var bestLabel = best ? formatScore(best) : "기록 없음";
      var description = section.hero;
      return (
        '<article class="section-card">' +
        '<div class="section-row">' +
        '<div>' +
        '<div class="eyebrow">REVIEW 4</div>' +
        '<h2 class="section-title">' + escapeHtml(section.title) + "</h2>" +
        '<p class="section-copy">' + escapeHtml(description) + "</p>" +
        "</div>" +
        "</div>" +
        '<div class="section-meta">' +
        '<span class="chip"><strong>진행</strong>' + escapeHtml(progressLabel) + "</span>" +
        '<span class="chip"><strong>최근</strong>' + escapeHtml(latestLabel) + "</span>" +
        '<span class="chip"><strong>최고</strong>' + escapeHtml(bestLabel) + "</span>" +
        '<span class="chip"><strong>기록</strong>' + String(attempts.length) + "</span>" +
        "</div>" +
        '<div class="section-actions">' +
        '<a class="primary-button" href="' + escapeHtml(section.href) + '">열기</a>' +
        "</div>" +
        "</article>"
      );
    }).join("");

    document.getElementById("app").innerHTML =
      '<main class="app-shell">' +
      renderTopbar("../index.html") +
      '<section class="hero-card surface">' +
      '<div class="eyebrow">복습 4</div>' +
      '<h1 class="hero-title">하위 단원별 퀴즈</h1>' +
      '<p class="hero-copy">풀던 답안과 응시 점수가 이 기기에 자동 저장됩니다.</p>' +
      '<div class="stats-grid">' +
      '<div class="stats-card"><span class="stat-label">단원</span><span class="stat-value">4</span></div>' +
      '<div class="stats-card"><span class="stat-label">진행 중</span><span class="stat-value">' + activeProgressCount + "</span></div>" +
      '<div class="stats-card"><span class="stat-label">응시 기록</span><span class="stat-value">' + totalAttemptCount + "</span></div>" +
      "</div>" +
      "</section>" +
      '<section class="section-grid">' + cards + "</section>" +
      "</main>";
  }

  function renderSection(sectionId) {
    var section = DATA.sections[sectionId];
    var ui = getUi(sectionId);
    var progress = getProgress(sectionId);
    if (ui.view === "quiz" && !progress) {
      ui.view = "start";
    }

    if (ui.view === "result") {
      renderResult(section);
      return;
    }

    if (ui.view === "quiz" && progress) {
      renderQuiz(section, progress);
      return;
    }

    renderStart(section, progress);
  }

  function isHomeworkEnabled(section) {
    return Boolean(section && section.homework && section.homework.enabled && section.homework.assignmentId);
  }

  function readStudentName() {
    return String(loadText(STUDENT_NAME_KEY) || "").trim();
  }

  function saveStudentName(value) {
    saveText(STUDENT_NAME_KEY, String(value || "").trim().slice(0, 40));
  }

  function homeworkStatusText(section, studentName) {
    if (!studentName) {
      return "이름을 입력하면 퀴즈를 시작할 수 있습니다.";
    }
    return "이름이 저장되었습니다. 모든 문항을 푼 뒤 온라인으로 제출됩니다.";
  }

  function renderHomeworkPanel(section) {
    if (!isHomeworkEnabled(section)) {
      return "";
    }
    var ui = getUi(section.id);
    var studentName = readStudentName();
    var statusKind = ui.homeworkStatusKind || (studentName ? "idle" : "pending");
    var statusText = ui.homeworkStatusText || homeworkStatusText(section, studentName);
    var attentionClass = !studentName || statusKind === "error" ? " is-name-missing" : "";
    var cueClass = studentName ? " is-complete" : "";
    return (
      '<section class="homework-panel surface' + attentionClass + '" aria-labelledby="homeworkPanelTitle">' +
      '<div class="homework-panel__text">' +
      '<span class="homework-panel__badge">온라인 제출</span>' +
      '<h2 id="homeworkPanelTitle">먼저 이름을 입력하세요</h2>' +
      '<p>' + escapeHtml(section.homework.assignmentTitle || section.title) + " 결과가 선생님 대시보드에 제출됩니다.</p>" +
      "</div>" +
      '<label class="student-name-field' + cueClass + '" for="studentNameInput">' +
      '<span class="student-name-label">학생 이름 <b>필수</b></span>' +
      '<span class="name-wave-cue" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><em>이름 쓰는 곳</em></span>' +
      '<input id="studentNameInput" type="text" maxlength="40" autocomplete="name" value="' + escapeHtml(studentName) + '" placeholder="여기에 이름 입력" aria-describedby="nameInputGuide homeworkStatus">' +
      '<span id="nameInputGuide" class="name-input-guide">여기에 이름을 쓰고 시작하세요.</span>' +
      "</label>" +
      '<p id="homeworkStatus" class="homework-status is-' + escapeHtml(statusKind) + '">' + escapeHtml(statusText) + "</p>" +
      "</section>"
    );
  }

  function renderHomeworkQuizNotice(section) {
    if (!isHomeworkEnabled(section)) {
      return "";
    }
    var ui = getUi(section.id);
    var studentName = readStudentName();
    if (!ui.homeworkStatusText && studentName) {
      return "";
    }
    var kind = ui.homeworkStatusKind || (studentName ? "idle" : "error");
    var text = ui.homeworkStatusText || "이름을 먼저 입력해야 제출할 수 있습니다.";
    return '<p class="homework-status homework-status--quiz is-' + escapeHtml(kind) + '">' + escapeHtml(text) + "</p>";
  }

  function updateHomeworkPanelState(panel, studentName) {
    if (!panel) {
      return;
    }
    var hasName = Boolean(String(studentName || "").trim());
    var status = panel.querySelector("#homeworkStatus");
    var field = panel.querySelector(".student-name-field");
    panel.classList.toggle("is-name-missing", !hasName);
    if (field) {
      field.classList.toggle("is-complete", hasName);
    }
    if (status) {
      status.className = "homework-status is-" + (hasName ? "idle" : "pending");
      status.textContent = hasName
        ? "이름이 저장되었습니다. 모든 문항을 푼 뒤 온라인으로 제출됩니다."
        : "이름을 입력하면 퀴즈를 시작할 수 있습니다.";
    }
  }

  function showMissingHomeworkName(sectionId) {
    var ui = getUi(sectionId);
    ui.homeworkStatusKind = "error";
    ui.homeworkStatusText = "이름을 먼저 입력해야 시작하거나 제출할 수 있습니다.";
    render();
  }

  function clearHomeworkStatus(sectionId) {
    var ui = getUi(sectionId);
    ui.homeworkStatusKind = "";
    ui.homeworkStatusText = "";
  }

  function ensureHomeworkName(sectionId) {
    var section = DATA.sections[sectionId];
    if (!isHomeworkEnabled(section) || !section.homework.requireStudentName) {
      return true;
    }
    if (readStudentName()) {
      clearHomeworkStatus(sectionId);
      return true;
    }
    showMissingHomeworkName(sectionId);
    return false;
  }

  function renderStart(section, progress) {
    setViewState("start");
    var sectionId = section.id;
    var ui = getUi(sectionId);
    var attempts = getAttempts(sectionId);
    var latest = attempts[0];
    var best = getBestAttempt(attempts);
    var answered = progress ? Object.keys(progress.answers).length : 0;
    var stats = latest
      ? '<div class="stats-grid">' +
        '<div class="stats-card"><span class="stat-label">최근 점수</span><span class="stat-value">' + formatScore(latest) + "</span></div>" +
        '<div class="stats-card"><span class="stat-label">최고 점수</span><span class="stat-value">' + formatScore(best) + "</span></div>" +
        '<div class="stats-card"><span class="stat-label">응시 기록</span><span class="stat-value">' + attempts.length + "</span></div>" +
        "</div>"
      : '<div class="empty-card">아직 기록이 없습니다. 첫 응시가 자동으로 저장됩니다.</div>';

    var progressAction = answered
      ? '<button class="primary-button" data-action="resume" data-section="' + sectionId + '">이어 풀기</button>'
      : '<button class="primary-button" data-action="start" data-section="' + sectionId + '">시작</button>';

    var resetAction = answered
      ? '<button class="secondary-button" data-action="restart" data-section="' + sectionId + '">새 시도</button>'
      : "";

    var historyHtml = attempts.length
      ? attempts.map(function (attempt) {
          return (
            '<article class="history-card">' +
            '<div class="history-head">' +
            '<div>' +
            '<div class="history-score">' + attempt.score + "/" + attempt.total + "</div>" +
            '<div class="history-date">' + escapeHtml(formatDate(attempt.finishedAt)) + "</div>" +
            "</div>" +
            '<span class="chip"><strong>오답</strong>' + String(attempt.total - attempt.score) + "</span>" +
            "</div>" +
            '<div class="history-actions">' +
            '<button class="secondary-button" data-action="show-result" data-section="' + sectionId + '" data-attempt="' + attempt.id + '">결과</button>' +
            '<button class="secondary-button" data-action="view-attempt" data-section="' + sectionId + '" data-attempt="' + attempt.id + '">복기</button>' +
            "</div>" +
            "</article>"
          );
        }).join("")
      : "";

    document.getElementById("app").innerHTML =
      '<main class="app-shell">' +
      renderTopbar("index.html") +
      renderHomeworkPanel(section) +
      '<section class="hero-card surface">' +
      '<div class="eyebrow">REVIEW 4</div>' +
      '<h1 class="hero-title">' + escapeHtml(section.title) + "</h1>" +
      '<p class="hero-copy">' + escapeHtml(section.hero) + "</p>" +
      '<div class="section-meta">' +
      '<span class="chip"><strong>문항</strong>' + escapeHtml(section.countLabel) + "</span>" +
      '<span class="chip"><strong>진행</strong>' + (answered ? answered + "/" + section.questions.length : "0/" + section.questions.length) + "</span>" +
      '<span class="chip"><strong>저장</strong>' + (isHomeworkEnabled(section) ? "온라인" : "로컬") + "</span>" +
      "</div>" +
      '<div class="section-actions">' + progressAction + resetAction + "</div>" +
      "</section>" +
      stats +
      '<div class="divider-title"><h2>기록</h2></div>' +
      (historyHtml ? '<section class="history-list">' + historyHtml + "</section>" : "") +
      "</main>" +
      renderAttemptModal(section, ui.modalAttemptId);
  }

  function renderQuiz(section, progress) {
    setViewState("quiz");
    var sectionId = section.id;
    var ui = getUi(sectionId);
    var index = clamp(progress.currentIndex, 0, section.questions.length - 1);
    if (index !== progress.currentIndex) {
      progress.currentIndex = index;
      setProgress(sectionId, progress);
    }
    var question = section.questions[index];
    var selected = progress.answers[question.id] || "";
    var answeredCount = Object.keys(progress.answers).length;
    var isLast = index === section.questions.length - 1;
    var percent = Math.round(((index + 1) / section.questions.length) * 100);
    var feedback = selected ? renderFeedback(question, selected) : "";
    var optionClass = question.imageChoices ? " option-grid--media" : (isWideChoices(question) ? " option-grid--wide" : "");
    var shakeClass = ui.shakeQuestionId === question.id ? " is-shake" : "";

    document.getElementById("app").innerHTML =
      '<main class="app-shell">' +
      renderTopbar("index.html") +
      renderHomeworkQuizNotice(section) +
      '<section class="progress-card surface">' +
      '<div class="progress-bar"><div class="progress-fill" style="width:' + percent + '%"></div></div>' +
      '<div class="progress-meta"><span>' + escapeHtml(section.title) + '</span><span>' + (index + 1) + " / " + section.questions.length + "</span></div>" +
      '<div class="dot-strip">' + renderDots(section, progress) + "</div>" +
      "</section>" +
      '<section class="question-card' + shakeClass + '">' +
      '<div class="question-layout">' +
      '<div class="question-main">' +
      '<div class="eyebrow">' + escapeHtml(question.tag) + "</div>" +
      '<div class="question-number">' + String(index + 1).padStart(2, "0") + "</div>" +
      (question.audio ? renderAudio(question) : "") +
      '<p class="question-prompt">' + escapeHtml(question.prompt) + "</p>" +
      renderContext(question.context) +
      "</div>" +
      '<div class="answer-panel">' +
      '<div class="option-grid' + optionClass + '">' + renderOptions(question, selected, progress.choiceOrder && progress.choiceOrder[question.id]) + "</div>" +
      feedback +
      "</div>" +
      "</div>" +
      "</section>" +
      '<nav class="nav-bar">' +
      '<button class="nav-button" data-action="prev-question" data-section="' + sectionId + '"' + (index === 0 ? " disabled" : "") + ' aria-label="이전">' + icon("left") + "</button>" +
      '<div class="nav-center"></div>' +
      (
        isLast
          ? '<button class="nav-button is-primary' + (selected ? " is-pulse" : "") + '" data-action="finish-section" data-section="' + sectionId + '" aria-label="완료">' + icon("check") + "</button>"
          : '<button class="nav-button is-primary' + (selected ? " is-pulse" : "") + '" data-action="next-question" data-section="' + sectionId + '" aria-label="다음">' + icon("right") + "</button>"
      ) +
      "</nav>" +
      '<div class="divider-title"><h3>진행</h3><span class="chip"><strong>완료</strong>' + answeredCount + "</span></div>" +
      "</main>";
  }

  function renderResult(section) {
    setViewState("result");
    var sectionId = section.id;
    var ui = getUi(sectionId);
    var attempt = findAttempt(sectionId, ui.activeAttemptId) || getAttempts(sectionId)[0];
    if (!attempt) {
      ui.view = "start";
      render();
      return;
    }
    ui.activeAttemptId = attempt.id;

    var incorrectCount = attempt.total - attempt.score;
    var ratio = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
    var ringDegree = Math.round((ratio / 100) * 360);
    var filter = ui.filter || "incorrect";
    var items = attempt.results.filter(function (item) {
      return filter === "all" ? true : !item.correct;
    });
    if (!items.length) {
      items = attempt.results;
    }

    document.getElementById("app").innerHTML =
      '<main class="app-shell">' +
      renderTopbar("index.html") +
      '<section class="result-card surface">' +
      '<div class="eyebrow">RESULT</div>' +
      '<h1 class="result-title">' + escapeHtml(section.title) + "</h1>" +
      '<div class="score-wrap">' +
      '<div class="score-ring" style="--ring-degree:' + ringDegree + 'deg"><div class="score-value">' + ratio + "%</div></div>" +
      '<div class="score-copy">' +
      '<p class="muted-copy">' + escapeHtml(formatDate(attempt.finishedAt)) + "</p>" +
      '<p class="question-prompt">' + attempt.score + " / " + attempt.total + "</p>" +
      '<div class="section-meta">' +
      '<span class="chip"><strong>정답</strong>' + attempt.score + "</span>" +
      '<span class="chip"><strong>오답</strong>' + incorrectCount + "</span>" +
      '<span class="chip"><strong>응시</strong>' + getAttempts(sectionId).length + "</span>" +
      "</div>" +
      renderSubmissionStatus(attempt) +
      "</div>" +
      "</div>" +
      '<div class="result-actions">' +
      '<button class="secondary-button" data-action="set-filter" data-section="' + sectionId + '" data-filter="incorrect">오답만</button>' +
      '<button class="secondary-button" data-action="set-filter" data-section="' + sectionId + '" data-filter="all">전체 보기</button>' +
      '<button class="secondary-button" data-action="back-to-start" data-section="' + sectionId + '">처음 화면</button>' +
      '<button class="primary-button" data-action="restart" data-section="' + sectionId + '">다시 풀기</button>' +
      "</div>" +
      (section.nextHref ? '<div class="section-actions" style="margin-top:12px;"><a class="text-button" href="' + escapeHtml(section.nextHref) + '">다음 단원</a></div>' : "") +
      "</section>" +
      '<section class="review-list">' + renderReviewItems(attempt, items) + "</section>" +
      "</main>";
  }

  function renderSubmissionStatus(attempt) {
    if (!attempt || !attempt.submission) {
      return "";
    }
    var status = attempt.submission.status || "pending";
    var message = attempt.submission.message || "";
    return '<p class="homework-status homework-status--result is-' + escapeHtml(status) + '">' + escapeHtml(message) + "</p>";
  }

  function renderAttemptModal(section, attemptId) {
    if (!attemptId) {
      return "";
    }
    var attempt = findAttempt(section.id, attemptId);
    if (!attempt) {
      return "";
    }
    return (
      '<div class="modal">' +
      '<div class="modal-panel surface">' +
      '<div class="modal-close"><button class="ghost-icon" data-action="close-modal" data-section="' + section.id + '" aria-label="닫기">' + icon("close") + '</button></div>' +
      '<div class="eyebrow">기록 복기</div>' +
      '<h2 class="section-title">' + escapeHtml(section.title) + "</h2>" +
      '<p class="muted-copy">' + escapeHtml(formatDate(attempt.finishedAt)) + " · " + attempt.score + "/" + attempt.total + "</p>" +
      '<section class="review-list">' + renderReviewItems(attempt, attempt.results) + "</section>" +
      "</div>" +
      "</div>"
    );
  }

  function renderReviewItems(attempt, results) {
    return results.map(function (item) {
      var contextHtml = renderContext(item.context, true);
      var feedback = normalizeStoredFeedback(item.id, item.feedback);
      var transcriptHtml = item.audio && item.audio.transcript
        ? '<div class="review-context"><div class="transcript-box">' + item.audio.transcript.map(function (part) {
            return "<div><strong>" + escapeHtml(part.speaker || "지문") + ":</strong> " + escapeHtml(part.text) + "</div>";
          }).join("") + "</div></div>"
        : "";
      return (
        '<article class="review-item ' + (item.correct ? "correct" : "wrong") + '">' +
        '<div class="review-head">' +
        '<span class="status-pill ' + (item.correct ? "correct" : "wrong") + '">' + (item.correct ? "정답" : "오답") + "</span>" +
        '<span class="review-sub">' + escapeHtml(item.tag) + "</span>" +
        "</div>" +
        '<p class="review-prompt"><strong>' + escapeHtml(item.number) + ".</strong> " + escapeHtml(item.prompt) + "</p>" +
        contextHtml +
        transcriptHtml +
        '<p class="review-answer"><strong>내 답</strong> ' + escapeHtml(item.selectedText || "미응답") + "</p>" +
        '<p class="review-answer"><strong>정답</strong> ' + escapeHtml(item.answerText) + "</p>" +
        renderBilingualFeedback(feedback) +
        "</article>"
      );
    }).join("");
  }

  function renderFeedback(question, selectedId) {
    var correct = selectedId === question.answer;
    var feedback = getFeedbackEntry(question.id, question.feedback);
    return (
      '<div class="feedback-card ' + (correct ? "correct" : "wrong") + '">' +
      '<div class="feedback-top">' +
      '<span class="status-pill ' + (correct ? "correct" : "wrong") + '">' + (correct ? "정답" : "오답") + "</span>" +
      '<span class="review-sub">정답 · ' + escapeHtml(choiceText(question, question.answer)) + "</span>" +
      "</div>" +
      '<p class="feedback-answer"><strong>내 답</strong> ' + escapeHtml(choiceText(question, selectedId)) + "</p>" +
      renderBilingualFeedback(feedback) +
      "</div>"
    );
  }

  function renderOptions(question, selectedId, choiceOrder) {
    var orderedChoices = getOrderedChoices(question, choiceOrder);
    return orderedChoices.map(function (choice, displayIndex) {
      var className = "option-button" + (choice.image ? " option-button--image" : "");
      if (selectedId) {
        if (choice.id === selectedId && choice.id === question.answer) {
          className += " is-correct";
        } else if (choice.id === selectedId) {
          className += " is-wrong";
        } else if (choice.id === question.answer) {
          className += " is-correct";
        }
      } else if (choice.id === selectedId) {
        className += " is-selected";
      }

      return (
        '<button class="' + className + '" data-action="select-choice" data-question="' + question.id + '" data-choice="' + choice.id + '" data-section="' + document.body.dataset.section + '">' +
        '<span class="option-index">' + (displayIndex + 1) + "</span>" +
        (choice.image
          ? '<span class="option-image-wrap"><img class="option-image" src="' + escapeHtml(choice.image) + '" alt="' + escapeHtml(choice.text) + '"></span><span class="sr-only">' + escapeHtml(choice.text) + "</span>"
          : '<span class="option-text">' + escapeHtml(choice.text) + "</span>") +
        "</button>"
      );
    }).join("");
  }

  function renderContext(context, compact) {
    if (!context || !context.length) {
      return "";
    }
    return (
      '<div class="context-stack">' +
      context.map(function (block) {
        var type = block.type === "passage" ? " passage" : "";
        return '<div class="context-block' + type + '">' + escapeHtml(block.text).replace(/\n/g, "<br>") + "</div>";
      }).join("") +
      "</div>"
    );
  }

  function renderAudio(question) {
    var isPlaying = runtime.speakingQuestionId === question.id;
    return (
      '<div class="audio-panel' + (isPlaying ? " is-playing" : "") + '">' +
      '<button class="audio-button" data-action="play-audio" data-question="' + question.id + '" data-section="' + document.body.dataset.section + '" aria-label="재생">' + icon(isPlaying ? "stop" : "play") + "</button>" +
      '<div class="audio-copy">' +
      '<div class="audio-title">' + escapeHtml(question.audio.label) + "</div>" +
      '<div class="audio-sub">탭해서 듣기</div>' +
      '<div class="audio-wave"><span></span><span></span><span></span><span></span></div>' +
      "</div>" +
      "</div>"
    );
  }

  function renderDots(section, progress) {
    return section.questions.map(function (question, index) {
      var classes = "dot-button";
      if (progress.answers[question.id]) {
        classes += " is-answered";
      }
      if (index === progress.currentIndex) {
        classes += " is-current";
      }
      return '<button class="' + classes + '" data-action="jump-question" data-section="' + section.id + '" data-index="' + index + '" aria-label="' + (index + 1) + '"></button>';
    }).join("");
  }

  function renderTopbar(backHref) {
    return (
      '<header class="topbar">' +
      '<div class="topbar-group">' +
      (backHref ? '<a class="ghost-icon" href="' + escapeHtml(backHref) + '" aria-label="뒤로">' + icon("home") + "</a>" : '<div class="ghost-icon" aria-hidden="true">' + icon("home") + "</div>") +
      "</div>" +
      '<div class="topbar-group">' + renderDeviceToggle() + "</div>" +
      "</header>"
    );
  }

  function renderDeviceToggle() {
    return (
      '<div class="device-toggle" role="group" aria-label="화면 전환">' +
      '<button class="device-button' + (runtime.layoutPreference === "auto" ? " is-active" : "") + '" data-action="set-layout" data-layout="auto" aria-label="자동">' + icon("auto") + "</button>" +
      '<button class="device-button' + (runtime.layoutPreference === "phone" ? " is-active" : "") + '" data-action="set-layout" data-layout="phone" aria-label="스마트폰">' + icon("phone") + "</button>" +
      '<button class="device-button' + (runtime.layoutPreference === "tablet" ? " is-active" : "") + '" data-action="set-layout" data-layout="tablet" aria-label="태블릿">' + icon("tablet") + "</button>" +
      "</div>"
    );
  }

  function updateChoice(sectionId, questionId, choiceId) {
    var progress = getProgress(sectionId);
    if (!progress) {
      progress = createProgress(sectionId);
    }
    progress.answers[questionId] = choiceId;
    progress.updatedAt = Date.now();
    setProgress(sectionId, progress);
    render();
  }

  function moveQuestion(sectionId, delta) {
    var progress = getProgress(sectionId);
    if (!progress) {
      return;
    }
    stopAudio();
    progress.currentIndex = clamp(progress.currentIndex + delta, 0, DATA.sections[sectionId].questions.length - 1);
    progress.updatedAt = Date.now();
    setProgress(sectionId, progress);
    render();
  }

  function jumpQuestion(sectionId, index) {
    var progress = getProgress(sectionId);
    if (!progress) {
      return;
    }
    stopAudio();
    progress.currentIndex = clamp(index, 0, DATA.sections[sectionId].questions.length - 1);
    progress.updatedAt = Date.now();
    setProgress(sectionId, progress);
    render();
  }

  async function finishSection(sectionId) {
    var section = DATA.sections[sectionId];
    var progress = getProgress(sectionId);
    var ui = getUi(sectionId);
    if (!progress) {
      return;
    }
    var firstMissing = section.questions.findIndex(function (question) {
      return !progress.answers[question.id];
    });
    if (firstMissing !== -1) {
      progress.currentIndex = firstMissing;
      progress.updatedAt = Date.now();
      setProgress(sectionId, progress);
      ui.shakeQuestionId = section.questions[firstMissing].id;
      render();
      setTimeout(function () {
        ui.shakeQuestionId = "";
        render();
      }, 260);
      return;
    }

    if (!ensureHomeworkName(sectionId)) {
      return;
    }

    stopAudio();
    var attempt = buildAttempt(section, progress);
    if (isHomeworkEnabled(section)) {
      attempt.startedAt = progress.startedAt || Date.now();
      attempt.submission = {
        status: "pending",
        message: "온라인 제출 중입니다..."
      };
    }
    saveAttempt(sectionId, attempt);
    clearProgress(sectionId);
    ui.view = "result";
    ui.activeAttemptId = attempt.id;
    ui.filter = "incorrect";
    render();

    if (!isHomeworkEnabled(section)) {
      return;
    }

    try {
      var response = await submitHomeworkAttempt(section, attempt);
      attempt.submission = {
        status: "success",
        message: "온라인 제출이 완료되었습니다.",
        path: response && response.path ? response.path : ""
      };
    } catch (error) {
      attempt.submission = {
        status: "error",
        message: "온라인 제출 실패: " + (error && error.message ? error.message : "알 수 없는 오류")
      };
    }
    updateAttempt(sectionId, attempt);
    render();
  }

  function toggleAudio(sectionId, questionId) {
    var question = findQuestion(sectionId, questionId);
    var src = getAudioSrc(question);
    if (!question || !question.audio || !src) {
      return;
    }

    if (runtime.speakingQuestionId === questionId && runtime.audioElement && !runtime.audioElement.paused) {
      stopAudio();
      render();
      return;
    }

    stopAudio();
    runtime.audioElement = new Audio(src);
    runtime.speakingQuestionId = questionId;
    runtime.audioElement.onended = function () {
      stopAudio();
      render();
    };
    runtime.audioElement.onerror = function () {
      stopAudio();
      render();
    };
    render();
    runtime.audioElement.play().catch(function () {
      runtime.speakingQuestionId = "";
      runtime.audioElement = null;
      render();
    });
  }

  function stopAudio() {
    if (runtime.audioElement) {
      runtime.audioElement.pause();
      runtime.audioElement.currentTime = 0;
      runtime.audioElement.onended = null;
      runtime.audioElement.onerror = null;
      runtime.audioElement = null;
    }
    runtime.speakingQuestionId = "";
  }

  function buildAttempt(section, progressOrAnswers) {
    var answers = progressOrAnswers && progressOrAnswers.answers ? progressOrAnswers.answers : (progressOrAnswers || {});
    var choiceOrderMap = progressOrAnswers && progressOrAnswers.choiceOrder ? progressOrAnswers.choiceOrder : {};
    var results = section.questions.map(function (question, index) {
      var selectedId = answers[question.id] || "";
      var choiceOrder = choiceOrderMap[question.id];
      return {
        id: question.id,
        number: index + 1,
        tag: question.tag,
        prompt: question.prompt,
        context: question.context || [],
        audio: question.audio || null,
        selectedId: selectedId,
        selectedText: choiceText(question, selectedId),
        selectedLetter: choiceDisplayLabel(question, selectedId, choiceOrder),
        answerId: question.answer,
        answerText: choiceText(question, question.answer),
        correctLetter: choiceDisplayLabel(question, question.answer, choiceOrder),
        correct: selectedId === question.answer,
        feedback: getFeedbackEntry(question.id, question.feedback)
      };
    });
    var score = results.filter(function (item) {
      return item.correct;
    }).length;
    return {
      id: "attempt-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8),
      finishedAt: Date.now(),
      score: score,
      total: results.length,
      results: results
    };
  }

  function signatureHash(signature) {
    var hash = 2166136261;
    var source = String(signature || "");
    for (var index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function buildHomeworkSignature(section, attempt) {
    return [
      section.homework.assignmentId,
      attempt.id,
      attempt.results.map(function (item) {
        return item.id + ":" + item.selectedId;
      }).join("|")
    ].join(":");
  }

  function buildHomeworkPayload(section, attempt) {
    var score = Number(attempt.score || 0);
    var total = Number(attempt.total || 0);
    var percent = total ? Math.round((score / total) * 100) : 0;
    var questionResults = attempt.results.map(function (item) {
      return {
        number: item.number,
        area: item.tag || section.title,
        prompt: item.prompt || "",
        studentAnswer: item.selectedText || "",
        selectedLetter: item.selectedLetter || "",
        correctAnswer: item.answerText || "",
        correctLetter: item.correctLetter || "",
        isCorrect: Boolean(item.correct)
      };
    });
    return {
      assignmentId: section.homework.assignmentId,
      assignmentTitle: section.homework.assignmentTitle || section.title,
      chapter: "review4",
      sectionId: section.id,
      sectionTitle: section.title,
      studentName: readStudentName(),
      anonymousUid: "",
      seed: attempt.id,
      signatureHash: signatureHash(buildHomeworkSignature(section, attempt)),
      score: score,
      total: total,
      percent: percent,
      completed: true,
      answered: total,
      correctQuestions: questionResults
        .filter(function (item) { return item.isCorrect; })
        .map(function (item) { return item.number; }),
      wrongQuestions: questionResults
        .filter(function (item) { return !item.isCorrect; })
        .map(function (item) { return item.number; }),
      questionResults: questionResults,
      clientSubmittedAt: new Date().toISOString()
    };
  }

  async function submitHomeworkAttempt(section, attempt) {
    var submitter = window.HomeworkSubmitter;
    if (!submitter || typeof submitter.submitHomework !== "function") {
      throw new Error("온라인 제출 모듈을 찾을 수 없습니다.");
    }
    if (!readStudentName()) {
      throw new Error("학생 이름이 없습니다.");
    }
    return submitter.submitHomework(buildHomeworkPayload(section, attempt));
  }

  function createProgress(sectionId) {
    var section = DATA.sections[sectionId];
    return {
      answers: {},
      choiceOrder: createChoiceOrderMap(section),
      currentIndex: 0,
      startedAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  function findQuestion(sectionId, questionId) {
    return DATA.sections[sectionId].questions.find(function (question) {
      return question.id === questionId;
    });
  }

  function findAttempt(sectionId, attemptId) {
    return getAttempts(sectionId).find(function (attempt) {
      return attempt.id === attemptId;
    });
  }

  function getUi(sectionId) {
    if (!runtime.sectionUi[sectionId]) {
      runtime.sectionUi[sectionId] = {
        view: "start",
        activeAttemptId: "",
        modalAttemptId: "",
        filter: "incorrect",
        shakeQuestionId: "",
        homeworkStatusKind: "",
        homeworkStatusText: ""
      };
    }
    return runtime.sectionUi[sectionId];
  }

  function getProgress(sectionId) {
    var progress = loadJson(storageKey("progress", sectionId));
    if (!progress) {
      return null;
    }
    return normalizeProgress(sectionId, progress);
  }

  function setProgress(sectionId, value) {
    saveJson(storageKey("progress", sectionId), value);
  }

  function clearProgress(sectionId) {
    localStorage.removeItem(storageKey("progress", sectionId));
  }

  function getAttempts(sectionId) {
    return loadJson(storageKey("attempts", sectionId)) || [];
  }

  function saveAttempt(sectionId, attempt) {
    var attempts = getAttempts(sectionId);
    attempts.unshift(attempt);
    saveJson(storageKey("attempts", sectionId), attempts.slice(0, 12));
  }

  function updateAttempt(sectionId, attempt) {
    var attempts = getAttempts(sectionId).map(function (item) {
      return item.id === attempt.id ? attempt : item;
    });
    saveJson(storageKey("attempts", sectionId), attempts.slice(0, 12));
  }

  function getBestAttempt(attempts) {
    if (!attempts || !attempts.length) {
      return null;
    }
    return attempts.slice().sort(function (a, b) {
      var aRatio = a.total ? a.score / a.total : 0;
      var bRatio = b.total ? b.score / b.total : 0;
      if (bRatio !== aRatio) {
        return bRatio - aRatio;
      }
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.finishedAt - a.finishedAt;
    })[0];
  }

  function formatScore(attempt) {
    if (!attempt) {
      return "기록 없음";
    }
    var ratio = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
    return attempt.score + "/" + attempt.total + " · " + ratio + "%";
  }

  function storageKey(type, id) {
    return STORAGE_PREFIX + ":" + type + ":" + id;
  }

  function loadJson(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadText(key) {
    try {
      return localStorage.getItem(STORAGE_PREFIX + ":" + key);
    } catch (error) {
      return "";
    }
  }

  function saveText(key, value) {
    localStorage.setItem(STORAGE_PREFIX + ":" + key, value);
  }

  function onViewportChange() {
    if (runtime.layoutPreference !== "auto") {
      return;
    }
    var previousLayout = runtime.activeLayout;
    applyLayout();
    if (previousLayout !== runtime.activeLayout) {
      render();
    }
  }

  function applyLayout() {
    var layout = resolveLayout(runtime.layoutPreference);
    runtime.activeLayout = layout;
    document.documentElement.setAttribute("data-layout", layout);
    document.documentElement.setAttribute("data-layout-preference", runtime.layoutPreference);
  }

  function resolveLayout(preference) {
    if (preference === "phone" || preference === "tablet") {
      return preference;
    }
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    var height = window.innerHeight || document.documentElement.clientHeight || 0;
    var isPortrait = height >= width;
    if (width >= 1100) {
      return "desktop";
    }
    if (isPortrait && width < 640) {
      return "phone";
    }
    if (width >= 700 || (isPortrait && width >= 640)) {
      return "tablet";
    }
    return "phone";
  }

  function setViewState(view) {
    document.body.dataset.view = view;
  }

  function normalizeLayoutPreference(value) {
    var normalized = String(value || "").toLowerCase();
    return normalized === "phone" || normalized === "tablet" || normalized === "auto" ? normalized : "auto";
  }

  function choiceText(question, choiceId) {
    var choice = question.choices.find(function (item) {
      return item.id === String(choiceId);
    });
    return choice ? choice.text : "";
  }

  function getOrderedChoices(question, choiceOrder) {
    if (!choiceOrder || !choiceOrder.length) {
      return question.choices.slice();
    }
    return choiceOrder.map(function (choiceId) {
      return question.choices.find(function (choice) {
        return choice.id === String(choiceId);
      });
    }).filter(Boolean);
  }

  function choiceDisplayLabel(question, choiceId, choiceOrder) {
    if (!choiceId) {
      return "";
    }
    var index = getOrderedChoices(question, choiceOrder).findIndex(function (choice) {
      return choice.id === String(choiceId);
    });
    return index >= 0 ? (CHOICE_LABELS[index] || String(index + 1)) : "";
  }

  function getFeedbackEntry(questionId, fallbackText) {
    var entry = FEEDBACK_I18N[questionId] || {};
    return {
      ko: entry.ko || fallbackText || "",
      vi: entry.vi || ""
    };
  }

  function normalizeStoredFeedback(questionId, feedback) {
    if (feedback && typeof feedback === "object" && (feedback.ko || feedback.vi)) {
      return feedback;
    }
    return getFeedbackEntry(questionId, typeof feedback === "string" ? feedback : "");
  }

  function normalizeProgress(sectionId, progress) {
    var changed = false;
    var section = DATA.sections[sectionId];
    if (!progress.answers || typeof progress.answers !== "object") {
      progress.answers = {};
      changed = true;
    }
    if (!progress.choiceOrder || typeof progress.choiceOrder !== "object") {
      progress.choiceOrder = createChoiceOrderMap(section);
      changed = true;
    }

    section.questions.forEach(function (question) {
      var saved = progress.choiceOrder[question.id];
      if (!Array.isArray(saved) || saved.length !== question.choices.length || !sameChoiceSet(saved, question.choices)) {
        progress.choiceOrder[question.id] = shuffleArray(question.choices.map(function (choice) {
          return choice.id;
        }));
        changed = true;
      }
    });

    if (changed) {
      saveJson(storageKey("progress", sectionId), progress);
    }
    return progress;
  }

  function createChoiceOrderMap(section) {
    var map = {};
    section.questions.forEach(function (question) {
      map[question.id] = shuffleArray(question.choices.map(function (choice) {
        return choice.id;
      }));
    });
    return map;
  }

  function sameChoiceSet(savedOrder, choices) {
    var expected = choices.map(function (choice) {
      return String(choice.id);
    }).sort();
    var actual = savedOrder.map(function (choiceId) {
      return String(choiceId);
    }).sort();
    return expected.length === actual.length && expected.every(function (value, index) {
      return value === actual[index];
    });
  }

  function shuffleArray(items) {
    var copy = items.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }
    return copy;
  }

  function renderBilingualFeedback(feedback) {
    var ko = feedback && feedback.ko ? feedback.ko : "";
    var vi = feedback && feedback.vi ? feedback.vi : "";
    return (
      '<div class="review-feedback-grid">' +
      (ko ? '<div class="feedback-block"><div class="feedback-label">쉬운 한국어</div><p class="review-feedback">' + escapeHtml(ko) + "</p></div>" : "") +
      (vi ? '<div class="feedback-block"><div class="feedback-label">Tiếng Việt</div><p class="review-feedback">' + escapeHtml(vi) + "</p></div>" : "") +
      "</div>"
    );
  }

  function isWideChoices(question) {
    return question.choices.every(function (choice) {
      return choice.text.length < 22;
    });
  }

  function getAudioSrc(question) {
    if (!question || !question.audio) {
      return "";
    }
    if (question.audio.file) {
      return question.audio.file;
    }
    return "assets/audio/" + question.id + ".mp3";
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(timestamp));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function icon(type) {
    var common = 'viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    if (type === "home") {
      return '<svg ' + common + '><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V21h14V9.8"/><path d="M9.5 21v-6h5v6"/></svg>';
    }
    if (type === "auto") {
      return '<svg ' + common + '><path d="M4.5 12a7.5 7.5 0 0 1 12.7-5.4"/><path d="M17.2 3.7v3.1h-3.1"/><path d="M19.5 12a7.5 7.5 0 0 1-12.7 5.4"/><path d="M6.8 20.3v-3.1h3.1"/><path d="M8.5 12h7"/></svg>';
    }
    if (type === "phone") {
      return '<svg ' + common + '><rect x="7" y="2.8" width="10" height="18.4" rx="2.2"/><path d="M11 18h2"/></svg>';
    }
    if (type === "tablet") {
      return '<svg ' + common + '><rect x="4.5" y="3.2" width="15" height="17.6" rx="2.2"/><path d="M11 17.7h2"/></svg>';
    }
    if (type === "left") {
      return '<svg ' + common + '><path d="M15 18 9 12l6-6"/></svg>';
    }
    if (type === "right") {
      return '<svg ' + common + '><path d="m9 18 6-6-6-6"/></svg>';
    }
    if (type === "check") {
      return '<svg ' + common + '><path d="M5 12.5 9.2 17 19 7"/></svg>';
    }
    if (type === "play") {
      return '<svg ' + common + '><path d="m9 7 8 5-8 5Z" fill="currentColor" stroke="none"/></svg>';
    }
    if (type === "stop") {
      return '<svg ' + common + '><rect x="8" y="8" width="8" height="8" rx="1.2" fill="currentColor" stroke="none"/></svg>';
    }
    return '<svg ' + common + '><path d="M6 6 18 18"/><path d="M18 6 6 18"/></svg>';
  }

  window.__review4App = {
    readStudentName: readStudentName,
    saveStudentName: saveStudentName,
    getProgress: getProgress,
    getAttempts: getAttempts,
    buildHomeworkPayload: buildHomeworkPayload,
    fillAnswers: function (sectionId, correct) {
      var section = DATA.sections[sectionId];
      if (!section) {
        return;
      }
      var progress = getProgress(sectionId) || createProgress(sectionId);
      section.questions.forEach(function (question) {
        progress.answers[question.id] = correct === false
          ? question.choices.find(function (choice) { return choice.id !== question.answer; }).id
          : question.answer;
      });
      progress.currentIndex = section.questions.length - 1;
      progress.updatedAt = Date.now();
      setProgress(sectionId, progress);
      render();
    }
  };
})();
