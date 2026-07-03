(function () {
  var DATA = window.REVIEW4_DATA;
  var AUDIO = window.REVIEW4_ORIGINAL_AUDIO;
  var practiceAnswers = {};

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function padNumber(value) {
    return String(value).padStart(2, "0");
  }

  function formatDuration(start, end) {
    var seconds = Math.max(0, Number(end || 0) - Number(start || 0));
    var minutes = Math.floor(seconds / 60);
    var remain = Math.round(seconds % 60);
    return minutes + ":" + String(remain).padStart(2, "0");
  }

  function optionLabel(index) {
    return String(index + 1);
  }

  function choiceText(choice) {
    return String(choice && choice.text ? choice.text : "");
  }

  function answerText(question) {
    var answer = question.choices.find(function (choice) {
      return choice.id === question.answer;
    });
    return choiceText(answer);
  }

  function usesImageOnlyPractice(question) {
    return question && (question.id === "l1" || question.id === "l2");
  }

  function updateLayout() {
    var width = window.innerWidth || document.documentElement.clientWidth || 0;
    var layout = width >= 1100 ? "desktop" : (width >= 700 ? "tablet" : "phone");
    document.documentElement.setAttribute("data-layout", layout);
    document.documentElement.setAttribute("data-layout-preference", "auto");
    document.body.setAttribute("data-view", "transcripts");
  }

  function clipById(id) {
    if (!AUDIO || !Array.isArray(AUDIO.clips)) {
      return null;
    }
    return AUDIO.clips.find(function (clip) {
      return clip.id === id;
    }) || null;
  }

  function renderTranscriptLines(question) {
    var transcript = question.audio && Array.isArray(question.audio.transcript)
      ? question.audio.transcript
      : [];
    return transcript.map(function (line) {
      return (
        '<div class="transcript-line">' +
        '<span class="speaker-badge">' + escapeHtml(line.speaker || "지문") + "</span>" +
        '<p>' + escapeHtml(line.text) + "</p>" +
        "</div>"
      );
    }).join("");
  }

  function renderPracticeOptions(question) {
    var selectedId = practiceAnswers[question.id] || "";
    var answered = Boolean(selectedId);
    var imageChoices = question.choices.some(function (choice) {
      return Boolean(choice.image);
    });
    return (
      '<div class="practice-options' + (imageChoices ? " practice-options--media" : "") + '">' +
      question.choices.map(function (choice, index) {
        var isSelected = selectedId === choice.id;
        var isCorrect = answered && choice.id === question.answer;
        var isWrong = answered && isSelected && choice.id !== question.answer;
        var imageOnly = usesImageOnlyPractice(question) && Boolean(choice.image);
        var classes = "practice-option option-button";
        if (choice.image) {
          classes += " option-button--image";
        }
        if (imageOnly) {
          classes += " practice-option--image-only";
        }
        if (isSelected) {
          classes += " is-selected";
        }
        if (isCorrect) {
          classes += " is-correct";
        }
        if (isWrong) {
          classes += " is-wrong";
        }
        return (
          '<button class="' + classes + '" type="button"' +
          (imageOnly ? ' aria-label="' + escapeHtml(optionLabel(index) + "번 " + choiceText(choice)) + '"' : "") +
          ' data-action="choose-practice" data-question="' + escapeHtml(question.id) + '" data-choice="' + escapeHtml(choice.id) + '">' +
          (choice.image
            ? '<span class="option-image-wrap"><img class="option-image" src="' + escapeHtml(choice.image) + '" alt="' + (imageOnly ? "" : escapeHtml(choiceText(choice))) + '"></span>'
            : "") +
          (imageOnly
            ? ""
            : '<span class="practice-option-copy">' +
              '<span class="option-index">' + optionLabel(index) + "</span>" +
              '<span class="option-text">' + escapeHtml(choiceText(choice)) + "</span>" +
              "</span>") +
          "</button>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderPracticeFeedback(question) {
    var selectedId = practiceAnswers[question.id] || "";
    if (!selectedId) {
      return '<p class="practice-hint">선택하면 바로 정오 판정이 표시됩니다.</p>';
    }
    var correct = selectedId === question.answer;
    return (
      '<div class="practice-feedback ' + (correct ? "correct" : "wrong") + '">' +
      '<span class="status-pill ' + (correct ? "correct" : "wrong") + '">' + (correct ? "정답" : "오답") + "</span>" +
      '<p><strong>정답 ' + escapeHtml(question.answer) + "번</strong>" + (usesImageOnlyPractice(question) ? "" : " " + escapeHtml(answerText(question))) + "</p>" +
      "</div>"
    );
  }

  function renderPractice(question) {
    return (
      '<section class="practice-panel" aria-label="간이 문제 풀이">' +
      '<div class="practice-panel__head">' +
      '<div>' +
      '<div class="eyebrow">PRACTICE</div>' +
      '<h3>간이 문제 풀기</h3>' +
      "</div>" +
      "</div>" +
      renderPracticeOptions(question) +
      renderPracticeFeedback(question) +
      "</section>"
    );
  }

  function renderCard(question, index) {
    var clip = clipById(question.id) || {};
    var number = index + 1;
    return (
      '<article class="transcript-card surface" id="' + escapeHtml(question.id) + '">' +
      '<div class="transcript-card__head">' +
      '<div class="question-number transcript-number">' + padNumber(number) + "</div>" +
      '<div class="transcript-card__title">' +
      '<div class="eyebrow">REVIEW 4 LISTENING</div>' +
      '<h2>' + number + "번</h2>" +
      "</div>" +
      "</div>" +
      '<p class="question-prompt transcript-prompt">' + escapeHtml(question.prompt) + "</p>" +
      '<div class="original-audio-panel">' +
      '<div class="audio-copy">' +
      '<div class="audio-title">' + escapeHtml(clip.label || (number + "번 원음")) + "</div>" +
      '<div class="audio-sub">구간 ' + formatDuration(clip.start, clip.end) + "</div>" +
      "</div>" +
      '<audio controls preload="none" src="' + escapeHtml(clip.file || "") + '" data-clip-id="' + escapeHtml(question.id) + '"></audio>' +
      "</div>" +
      '<div class="transcript-lines">' + renderTranscriptLines(question) + "</div>" +
      renderPractice(question) +
      "</article>"
    );
  }

  function practiceSummary(section) {
    var answered = 0;
    var correct = 0;
    section.questions.forEach(function (question) {
      var selectedId = practiceAnswers[question.id];
      if (selectedId) {
        answered += 1;
        if (selectedId === question.answer) {
          correct += 1;
        }
      }
    });
    return { answered: answered, correct: correct };
  }

  function renderPracticeSummary(section) {
    var summary = practiceSummary(section);
    return (
      '<section class="practice-summary surface" aria-label="간이 문제 풀이 현황">' +
      '<div class="practice-summary__copy">' +
      '<span class="homework-panel__badge">간이 풀이</span>' +
      '<strong>' + summary.correct + " / " + summary.answered + "</strong>" +
      '<span>저장 없이 이 화면에서만 채점합니다.</span>' +
      "</div>" +
      '<button class="secondary-button" type="button" data-action="reset-practice">초기화</button>' +
      "</section>"
    );
  }

  function bindAudioGuards() {
    var audios = Array.prototype.slice.call(document.querySelectorAll("audio[data-clip-id]"));
    audios.forEach(function (audio) {
      audio.addEventListener("play", function () {
        audios.forEach(function (other) {
          if (other !== audio) {
            other.pause();
          }
        });
      });
    });
  }

  function render() {
    updateLayout();
    var section = DATA && DATA.sections && DATA.sections.listening;
    if (!section || !AUDIO) {
      document.getElementById("app").innerHTML = '<main class="app-shell"><section class="hero-card surface"><h1 class="hero-title">데이터를 불러오지 못했습니다.</h1></section></main>';
      return;
    }

    document.getElementById("app").innerHTML =
      '<main class="app-shell transcript-shell">' +
      '<header class="topbar">' +
      '<div class="topbar-group"><a class="ghost-icon" href="index.html" aria-label="뒤로">홈</a></div>' +
      '<div class="topbar-group"><a class="text-button" href="listening.html">퀴즈</a></div>' +
      "</header>" +
      '<section class="hero-card surface transcript-hero">' +
      '<div class="eyebrow">복습 4</div>' +
      '<h1 class="hero-title">듣기 지문과 원음</h1>' +
      '<div class="section-meta">' +
      '<span class="chip"><strong>문항</strong>' + section.questions.length + "</span>" +
      '<span class="chip"><strong>음원</strong>' + escapeHtml(AUDIO.sourceFile) + "</span>" +
      '<span class="chip"><strong>형식</strong>MP3</span>' +
      "</div>" +
      "</section>" +
      renderPracticeSummary(section) +
      '<section class="transcript-list">' +
      section.questions.map(renderCard).join("") +
      "</section>" +
      "</main>";
    bindAudioGuards();
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    var action = target.getAttribute("data-action");
    if (action === "choose-practice") {
      practiceAnswers[target.getAttribute("data-question")] = target.getAttribute("data-choice");
      render();
    }
    if (action === "reset-practice") {
      practiceAnswers = {};
      render();
    }
  });

  window.addEventListener("resize", updateLayout);
  document.addEventListener("DOMContentLoaded", render);
})();
