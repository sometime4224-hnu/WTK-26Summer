(function () {
  'use strict';

  var config = window.C15GrammarFormPracticeConfig;
  var root = document.getElementById('formPracticeApp');

  if (!config || !root || !Array.isArray(config.items) || !config.items.length) {
    return;
  }

  var STORAGE_VERSION = 1;
  var total = config.items.length;
  var state = createEmptyState();
  var saveTimer = null;
  var storageBlocked = false;
  var storageError = false;
  var recoveryValue = '';

  function createEmptyState() {
    return {
      version: STORAGE_VERSION,
      index: 0,
      score: 0,
      logs: [],
      draft: '',
      answered: false,
      complete: false
    };
  }

  function normalise(value) {
    return String(value || '')
      .replace(/[\s\u00a0]/g, '')
      .replace(/[.?!,]/g, '');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function isValidLog(log) {
    return log && typeof log.id === 'string' && typeof log.user === 'string' &&
      typeof log.correct === 'string' && typeof log.rule === 'string' &&
      typeof log.ok === 'boolean';
  }

  function isValidState(candidate) {
    if (!(candidate && candidate.version === STORAGE_VERSION &&
      Number.isInteger(candidate.index) && candidate.index >= 0 && candidate.index <= total &&
      Number.isInteger(candidate.score) && candidate.score >= 0 && candidate.score <= total &&
      Array.isArray(candidate.logs) && candidate.logs.every(isValidLog) &&
      typeof candidate.draft === 'string' && typeof candidate.answered === 'boolean' &&
      typeof candidate.complete === 'boolean' &&
      (candidate.complete ? candidate.index === total : candidate.index < total) &&
      candidate.logs.length <= total)) {
      return false;
    }

    var expectedLogCount = candidate.complete ? total : candidate.index + (candidate.answered ? 1 : 0);
    if (candidate.logs.length !== expectedLogCount ||
      candidate.score !== candidate.logs.filter(function (log) { return log.ok; }).length ||
      (candidate.complete && (candidate.answered || candidate.draft !== ''))) {
      return false;
    }

    return candidate.logs.every(function (log, index) {
      var item = config.items[index];
      return log.id === item.id && log.prompt === item.prompt && log.cue === item.cue &&
        log.correct === item.answer && log.rule === item.rule;
    });
  }

  function readSavedState() {
    var raw;
    try {
      raw = window.localStorage.getItem(config.storageKey);
    } catch (error) {
      storageError = true;
      return;
    }

    if (raw == null) {
      return;
    }

    try {
      var candidate = JSON.parse(raw);
      if (isValidState(candidate)) {
        state = candidate;
        return;
      }
    } catch (error) {
      // Preserve the raw value instead of replacing potentially useful data.
    }

    storageBlocked = true;
    recoveryValue = raw;
  }

  function writeNow() {
    if (storageBlocked || storageError) {
      return;
    }

    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(state));
    } catch (error) {
      storageError = true;
      renderStorageStatus();
    }
  }

  function scheduleSave() {
    if (storageBlocked || storageError) {
      return;
    }
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(writeNow, 350);
  }

  function currentItem() {
    return config.items[state.index];
  }

  function currentLog() {
    var item = currentItem();
    if (!item) {
      return null;
    }
    for (var index = state.logs.length - 1; index >= 0; index -= 1) {
      if (state.logs[index].id === item.id) {
        return state.logs[index];
      }
    }
    return null;
  }

  function isCorrect(item, answer) {
    var options = [item.answer].concat(item.accepted || []);
    var typed = normalise(answer);
    return options.some(function (option) {
      return normalise(option) === typed;
    });
  }

  function makeItemMarkup(item, log) {
    var answerMode = state.answered && log;
    var feedback = '';
    if (answerMode) {
      feedback = log.ok
        ? '<p class="fp-feedback fp-feedback--correct" id="feedback" role="status">맞아요. 다음 문항도 활용형만 써 보세요.</p>'
        : '<div class="fp-feedback fp-feedback--wrong" id="feedback" role="status">' +
          '<strong>다시 확인해 보세요.</strong><span>정답: ' + escapeHtml(log.correct) + '</span><span>' + escapeHtml(log.rule) + '</span></div>';
    } else {
      feedback = '<p class="fp-feedback" id="feedback" aria-live="polite"></p>';
    }

    return '<section class="fp-task" id="taskPanel" aria-labelledby="questionHeading">' +
      '<div class="fp-step"><span>' + escapeHtml(item.level) + '</span><strong>' + (state.index + 1) + ' / ' + total + '</strong></div>' +
      '<h2 id="questionHeading">빈칸에 들어갈 활용형을 써 보세요.</h2>' +
      '<p class="fp-prompt">' + escapeHtml(item.prompt) + '</p>' +
      '<div class="fp-cue" aria-label="기본형 힌트"><span>기본형</span><strong>' + escapeHtml(item.cue) + '</strong></div>' +
      '<label class="fp-answer-label" for="answerInput">' + escapeHtml(config.grammar.number) + ' 활용형</label>' +
      '<input id="answerInput" class="fp-answer-input" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" value="' + escapeHtml(state.draft) + '"' + (answerMode ? ' disabled' : '') + '>' +
      '<p class="fp-input-note">문장 전체가 아니라 빈칸에 들어갈 부분만 입력하세요.</p>' +
      feedback +
      '<div class="fp-task-actions">' +
      (answerMode
        ? '<button class="fp-button fp-button--primary" type="button" id="nextBtn">' + (state.index + 1 === total ? '완료 화면 보기' : '다음 문항') + '</button>'
        : '<button class="fp-button fp-button--primary" type="button" id="checkBtn">확인</button>') +
      '</div></section>';
  }

  function makeFinishMarkup() {
    var wrongLogs = state.logs.filter(function (log) { return !log.ok; });
    var review = wrongLogs.length
      ? '<section class="fp-review" aria-labelledby="reviewHeading"><h2 id="reviewHeading">오답 복습</h2>' +
        wrongLogs.map(function (log) {
          return '<article><p>' + escapeHtml(log.prompt || log.id) + '</p><dl><div><dt>내 답</dt><dd>' + escapeHtml(log.user || '입력 안 함') + '</dd></div><div><dt>정답</dt><dd>' + escapeHtml(log.correct) + '</dd></div></dl><small>' + escapeHtml(log.rule) + '</small></article>';
        }).join('') + '</section>'
      : '<p class="fp-perfect">모든 문항을 맞혔어요. 이 문법의 활용형을 잘 쓸 수 있어요.</p>';

    return '<section class="fp-finish" id="finishPanel" aria-labelledby="finishHeading">' +
      '<p class="fp-finish-kicker">완료</p><h2 id="finishHeading">형태 활용 연습을 마쳤어요.</h2>' +
      '<p class="fp-score"><strong>' + state.score + '</strong> <span>/ ' + total + '</span></p>' +
      '<p class="fp-score-note">맞힌 문항 수</p>' + review +
      '<div class="fp-finish-actions"><button class="fp-button fp-button--primary" type="button" id="restartBtn">다시 하기</button>' +
      '<a class="fp-button fp-button--secondary" href="' + escapeHtml(config.grammar.nextHref) + '">' + escapeHtml(config.grammar.nextLabel) + '</a></div></section>';
  }

  function storageStatusMarkup() {
    if (storageBlocked) {
      return '<p class="fp-storage-status fp-storage-status--warn" id="storageStatus" role="status">기존 저장 자료를 안전하게 읽지 못해 자동 저장을 멈췄습니다. 내 답을 복사한 뒤 초기화할 수 있어요.</p>';
    }
    if (storageError) {
      return '<p class="fp-storage-status fp-storage-status--warn" id="storageStatus" role="status">자동 저장을 하지 못했습니다. 아래에서 내 답을 복사해 보관하세요.</p>';
    }
    return '<p class="fp-storage-status" id="storageStatus" role="status">이 문항의 답과 진행 상황은 이 기기에 자동 저장됩니다.</p>';
  }

  function renderStorageStatus() {
    var target = document.getElementById('storageStatus');
    if (target) {
      var temporary = document.createElement('div');
      temporary.innerHTML = storageStatusMarkup();
      target.replaceWith(temporary.firstChild);
    }
  }

  function render() {
    var atFinish = state.complete || state.index >= total;
    if (atFinish) {
      state.complete = true;
      state.index = total;
      state.answered = false;
      state.draft = '';
    }

    var current = currentItem();
    var progress = atFinish ? total : state.index;
    var taskMarkup = atFinish ? makeFinishMarkup() : makeItemMarkup(current, currentLog());

    root.innerHTML = '<div class="fp-progress" aria-label="진행 상황"><div class="fp-progress-row"><span id="progressText">' + (atFinish ? '완료' : (state.index + 1) + '번 문항') + '</span><strong id="scoreText">점수 ' + state.score + ' / ' + total + '</strong></div><div class="fp-progress-track" aria-hidden="true"><span id="progressBar" style="width:' + ((progress / total) * 100) + '%"></span></div></div>' +
      taskMarkup + '<details class="fp-rule-box"><summary>활용 규칙 다시 보기</summary><p>' + escapeHtml(config.tip) + '</p></details>' +
      storageStatusMarkup() +
      '<div class="fp-bottom-actions"><button type="button" id="copyAnswers">내 답 복사</button><button type="button" id="resetPractice">이 활용 연습 초기화</button></div>';

    bindEvents();
    var input = document.getElementById('answerInput');
    if (input && !state.answered) {
      input.focus();
    }
  }

  function saveInput(event) {
    state.draft = event.target.value;
    scheduleSave();
  }

  function showMessage(message) {
    var feedback = document.getElementById('feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = 'fp-feedback fp-feedback--wrong';
    }
  }

  function checkAnswer() {
    var item = currentItem();
    var input = document.getElementById('answerInput');
    if (!item || !input || state.answered) {
      return;
    }

    var user = input.value.trim();
    if (!user) {
      showMessage('먼저 활용형을 적어 보세요.');
      input.focus();
      return;
    }
    if (/[A-Za-z]/.test(user)) {
      showMessage('한/영 키를 확인하고 한글 활용형을 입력해 보세요.');
      input.focus();
      return;
    }

    var ok = isCorrect(item, user);
    state.logs = state.logs.filter(function (log) { return log.id !== item.id; });
    state.logs.push({
      id: item.id,
      prompt: item.prompt,
      cue: item.cue,
      user: user,
      correct: item.answer,
      rule: item.rule,
      ok: ok
    });
    if (ok) {
      state.score += 1;
    }
    state.draft = user;
    state.answered = true;
    writeNow();
    render();
  }

  function moveNext() {
    if (!state.answered) {
      return;
    }
    if (state.index + 1 >= total) {
      state.index = total;
      state.complete = true;
      state.draft = '';
      state.answered = false;
    } else {
      state.index += 1;
      state.draft = '';
      state.answered = false;
    }
    writeNow();
    render();
  }

  function restartPractice() {
    state = createEmptyState();
    writeNow();
    render();
  }

  function resetPractice() {
    var prompt = storageBlocked
      ? '읽지 못한 기존 저장 자료를 지우고 이 활용 연습을 새로 시작할까요?'
      : '이 활용 연습의 저장된 답과 점수를 지우고 새로 시작할까요?';
    if (!window.confirm(prompt)) {
      return;
    }
    try {
      window.localStorage.removeItem(config.storageKey);
      storageBlocked = false;
      storageError = false;
      recoveryValue = '';
      state = createEmptyState();
      writeNow();
      render();
    } catch (error) {
      storageError = true;
      renderStorageStatus();
    }
  }

  function copyAnswers() {
    var lines = [config.grammar.title, '점수: ' + state.score + ' / ' + total];
    if (recoveryValue) {
      lines.push('보호된 기존 저장값: ' + recoveryValue);
    }
    state.logs.forEach(function (log, index) {
      lines.push((index + 1) + '. ' + log.prompt + ' | 내 답: ' + log.user + ' | 정답: ' + log.correct);
    });
    if (state.draft && !state.answered) {
      lines.push('작성 중인 답: ' + state.draft);
    }
    var text = lines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showCopyMessage('내 답을 복사했어요.');
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    window.prompt('아래 내용을 복사해 보관하세요.', text);
  }

  function showCopyMessage(message) {
    var status = document.getElementById('storageStatus');
    if (status) {
      status.textContent = message;
    }
  }

  function bindEvents() {
    var input = document.getElementById('answerInput');
    var check = document.getElementById('checkBtn');
    var next = document.getElementById('nextBtn');
    var restart = document.getElementById('restartBtn');
    var copy = document.getElementById('copyAnswers');
    var reset = document.getElementById('resetPractice');

    if (input) {
      input.addEventListener('input', saveInput);
      input.addEventListener('blur', writeNow);
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (state.answered) {
            moveNext();
          } else {
            checkAnswer();
          }
        }
      });
    }
    if (check) check.addEventListener('click', checkAnswer);
    if (next) next.addEventListener('click', moveNext);
    if (restart) restart.addEventListener('click', restartPractice);
    if (copy) copy.addEventListener('click', copyAnswers);
    if (reset) reset.addEventListener('click', resetPractice);
  }

  window.addEventListener('pagehide', writeNow);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      writeNow();
    }
  });

  window.__C15GrammarFormPractice__ = {
    getState: function () { return JSON.parse(JSON.stringify(state)); },
    getCurrentAnswer: function () { return currentItem() ? currentItem().answer : null; },
    storageKey: config.storageKey
  };

  readSavedState();
  render();
}());
