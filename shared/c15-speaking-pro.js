(() => {
    const config = window.C15SpeakingProConfig;
    if (!config) {
        return;
    }

    const RecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasRecognition = !!RecognitionClass;
    const canRecord = !!(
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        window.MediaRecorder
    );
    const recognitionOnlyMode = hasRecognition;
    const storageKey = config.storageKey || 'c15-speaking-pro-v1';
    // C16 pages opt in to the stricter learner flow below.  Keeping it opt-in
    // preserves the established behaviour of the older speaking pages.
    const isC16Enhanced = config.c16Enhanced === true;
    const allowTypedFallback = isC16Enhanced && config.typedFallback !== false;
    const requiresAttempt = isC16Enhanced && config.requireAttempt !== false;
    const shouldPersistSession = isC16Enhanced && config.persistSession !== false;
    const c16SessionPageId = isC16Enhanced
        ? (config.c16StatePageId || (location.pathname.split('/').pop() || 'speaking-pro').replace(/\.html$/i, ''))
        : '';
    const legacySessionStorageKey = storageKey + '-session';
    const sessionStorageKey = isC16Enhanced
        ? 'korean3b.c16.grammar.' + c16SessionPageId
        : legacySessionStorageKey;
    const recordingStoreName = 'korean3b-c16-speaking-recordings';
    const originalItems = Array.isArray(config.items) ? config.items.slice() : [];
    const speakerChoices = (config.speakerSelect && Array.isArray(config.speakerSelect.choices))
        ? config.speakerSelect.choices
        : [];

    const refs = {
        pageEyebrow: document.getElementById('pageEyebrow'),
        pageTitle: document.getElementById('pageTitle'),
        pageSubtitle: document.getElementById('pageSubtitle'),
        pageFormula: document.getElementById('pageFormula'),
        pageEmoji: document.getElementById('pageEmoji'),
        heroChips: document.getElementById('heroChips'),
        stepGuide: document.getElementById('stepGuide'),
        progressLabel: document.getElementById('progressLabel'),
        progressPct: document.getElementById('progressPct'),
        progressBar: document.getElementById('progressBar'),
        browserWarn: document.getElementById('browserWarn'),
        httpsWarn: document.getElementById('httpsWarn'),
        completeBadge: document.getElementById('completeBadge'),
        historyButton: document.getElementById('historyButton'),
        mainArea: document.getElementById('mainArea'),
        sessionResult: document.getElementById('sessionResult'),
        resAttempts: document.getElementById('resAttempts'),
        resBest: document.getElementById('resBest'),
        resAvg: document.getElementById('resAvg'),
        logArea: document.getElementById('logArea'),
        restartSessionBtn: document.getElementById('restartSessionBtn'),
        historyModal: document.getElementById('historyModal'),
        historyContent: document.getElementById('historyContent'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn'),
        closeHistoryBtn: document.getElementById('closeHistoryBtn')
    };

    const state = {
        idx: 0,
        isRecording: false,
        isStartingRecording: false,
        recognition: null,
        mediaRecorder: null,
        mediaStream: null,
        audioChunks: [],
        audioUrl: '',
        recordingItemId: '',
        liveTranscript: '',
        finalTranscript: '',
        hasHeardModel: false,
        speechRequestId: 0,
        guideStage: '',
        guideScrollTimer: 0,
        selectedSpeaker: '',
        selectedSpeakerLabel: '',
        sessionScores: [],
        sessionLog: [],
        itemResponded: false,
        skippedItemIds: [],
        savedRecordingItemId: '',
        savedRecordingItemIds: [],
        summaryAudioUrls: [],
        sessionStorageBlocked: false,
        sessionRecoveryIssue: '',
        sessionRawRecord: '',
        sessionRecordKey: '',
        historyStorageBlocked: false,
        lastFocusedElement: null,
        hasRenderedItem: false
    };

    init();

    function init() {
        renderHero();
        bindStaticEvents();
        renderWarnings();
        restoreSession();
        if (hasSpeakerSelect()) {
            if (state.selectedSpeaker && config.items.length) {
                render();
            } else {
                renderSpeakerSelect();
            }
        } else {
            render();
        }
        renderSessionRecovery();
        window.addEventListener('beforeunload', cleanupAll);
    }

    function renderHero() {
        if (refs.pageEyebrow) {
            refs.pageEyebrow.textContent = config.eyebrow || '';
        }
        if (refs.pageTitle) {
            refs.pageTitle.textContent = config.title || '';
        }
        if (refs.pageSubtitle) {
            refs.pageSubtitle.textContent = isC16Enhanced
                ? (config.actionLabel || '첫 행동: 모범 문장을 듣고 말하거나 직접 입력하세요.')
                : (config.subtitle || '');
        }
        if (refs.pageFormula) {
            refs.pageFormula.textContent = config.formula || '';
        }
        if (refs.pageEmoji) {
            refs.pageEmoji.textContent = config.emoji || '🗣️';
        }

        if (refs.heroChips) {
            refs.heroChips.innerHTML = (config.heroChips || [])
                .map((chip) => '<span class="sp-chip">' + escapeHtml(chip) + '</span>')
                .join('');
        }

        if (refs.stepGuide) {
            refs.stepGuide.innerHTML = (config.steps || [])
                .map((step, index) => (
                    '<div class="sp-step-row">'
                    + '<span class="sp-step-num">' + (index + 1) + '</span>'
                    + '<p class="text-sm text-slate-700 safe m-0">' + escapeHtml(step) + '</p>'
                    + '</div>'
                ))
                .join('');
        }
    }

    function bindStaticEvents() {
        if (refs.historyButton) {
            refs.historyButton.addEventListener('click', showHistoryModal);
        }
        if (refs.clearHistoryBtn) {
            refs.clearHistoryBtn.addEventListener('click', clearHistory);
        }
        if (refs.closeHistoryBtn) {
            refs.closeHistoryBtn.addEventListener('click', closeHistoryModal);
        }
        if (refs.historyModal) {
            refs.historyModal.addEventListener('click', function (event) {
                if (event.target === refs.historyModal) {
                    closeHistoryModal();
                }
            });
            refs.historyModal.setAttribute('role', 'dialog');
            refs.historyModal.setAttribute('aria-modal', 'true');
            refs.historyModal.setAttribute('tabindex', '-1');
            refs.historyModal.querySelectorAll('[onclick]').forEach(function (button) {
                button.removeAttribute('onclick');
                button.addEventListener('click', closeHistoryModal);
            });
        }
        if (refs.restartSessionBtn) {
            refs.restartSessionBtn.addEventListener('click', restartSession);
        }
        document.addEventListener('keydown', handleModalKeydown);
    }

    function renderWarnings() {
        if (refs.browserWarn) {
            refs.browserWarn.classList.toggle('hidden', hasRecognition);
        }
        if (refs.httpsWarn) {
            refs.httpsWarn.classList.toggle('hidden', isSecureContextOrLocalhost() && (recognitionOnlyMode || canRecord));
        }
    }

    function hasSpeakerSelect() {
        return speakerChoices.length > 0;
    }

    function renderSpeakerSelect() {
        cleanupAll();
        config.items = originalItems;
        state.idx = 0;
        state.selectedSpeaker = '';
        state.selectedSpeakerLabel = '';
        state.sessionScores = [];
        state.sessionLog = [];
        state.itemResponded = false;
        state.skippedItemIds = [];
        state.savedRecordingItemId = '';
        state.savedRecordingItemIds = [];
        state.hasRenderedItem = false;
        saveSession();

        refs.completeBadge.classList.add('hidden');
        refs.sessionResult.classList.add('hidden');
        if (refs.progressLabel) {
            refs.progressLabel.textContent = '역할 선택';
        }
        if (refs.progressPct) {
            refs.progressPct.textContent = '0%';
        }
        if (refs.progressBar) {
            refs.progressBar.style.width = '0%';
        }

        refs.mainArea.innerHTML = buildSpeakerSelectMarkup();
        bindSpeakerSelectEvents();
    }

    function buildSpeakerSelectMarkup() {
        const speakerSelect = config.speakerSelect || {};
        const choiceMarkup = speakerChoices.map(function (choice) {
            return [
                '<button class="sp-speaker-card" type="button" data-speaker-id="' + escapeHtml(choice.id || '') + '">',
                '  <span class="sp-speaker-card__icon">' + escapeHtml(choice.icon || '🗣️') + '</span>',
                '  <span class="sp-speaker-card__body">',
                '    <span class="sp-speaker-card__label">' + escapeHtml(choice.label || choice.id || '') + '</span>',
                '    <span class="sp-speaker-card__desc safe">' + escapeHtml(choice.description || '') + '</span>',
                '  </span>',
                '  <span class="sp-speaker-card__badge">' + escapeHtml(choice.badge || '') + '</span>',
                '</button>'
            ].join('');
        }).join('');

        return [
            '<section class="sp-card sp-speaker-select p-5 mb-4">',
            '  <div class="sp-speaker-select__head">',
            '    <p class="sp-mini-badge">' + escapeHtml(speakerSelect.eyebrow || config.grammarLabel || '역할 선택') + '</p>',
            '    <h2 class="sp-speaker-select__title safe">' + escapeHtml(speakerSelect.title || '연습할 인물을 선택하세요') + '</h2>',
            '    <p class="sp-speaker-select__subtitle safe">' + escapeHtml(speakerSelect.subtitle || '선택한 인물의 대사만 순서대로 연습합니다.') + '</p>',
            '  </div>',
            '  <div class="sp-speaker-grid">',
            choiceMarkup,
            '  </div>',
            '</section>'
        ].join('');
    }

    function bindSpeakerSelectEvents() {
        document.querySelectorAll('[data-speaker-id]').forEach(function (button) {
            button.addEventListener('click', function () {
                selectSpeaker(button.dataset.speakerId || '');
            });
        });
    }

    function selectSpeaker(speakerId) {
        const choice = speakerChoices.find(function (candidate) {
            return candidate.id === speakerId;
        });
        const selectedItems = originalItems.filter(function (item) {
            return item.speaker === speakerId;
        });

        if (!choice || !selectedItems.length) {
            return;
        }

        cleanupAll();
        state.idx = 0;
        state.selectedSpeaker = speakerId;
        state.selectedSpeakerLabel = choice.label || speakerId;
        state.sessionScores = [];
        state.sessionLog = [];
        state.itemResponded = false;
        state.skippedItemIds = [];
        state.savedRecordingItemId = '';
        state.savedRecordingItemIds = [];
        state.hasRenderedItem = false;
        config.items = selectedItems;
        saveSession();
        render();
    }

    function buildSpeakerContextMarkup() {
        if (!state.selectedSpeaker) {
            return '';
        }

        return [
            '<div class="sp-role-bar" id="speakerRoleBar">',
            '  <div>',
            '    <span class="sp-role-bar__label">현재 역할</span>',
            '    <strong class="sp-role-bar__name">' + escapeHtml(state.selectedSpeakerLabel || state.selectedSpeaker) + '</strong>',
            '    <span class="sp-role-bar__count">' + config.items.length + '문장</span>',
            '  </div>',
            hasSpeakerSelect() ? '  <button id="changeSpeakerBtn" class="sp-inline-btn" type="button">역할 바꾸기</button>' : '',
            '</div>'
        ].join('');
    }

    function render() {
        cleanupTransientState();
        clearSessionSummaryRecordings();
        const total = config.items.length;
        const isDone = state.idx >= total;
        const isCompleted = isDone && (!isC16Enhanced || (
            state.skippedItemIds.length === 0 && state.sessionLog.length > 0
        ));

        refs.completeBadge.classList.toggle('hidden', !isCompleted);
        refs.sessionResult.classList.toggle('hidden', !isDone);
        updateProgress(isDone);

        if (isDone) {
            cleanupMediaStream();
            refs.mainArea.innerHTML = '';
            renderSessionSummary();
            window.setTimeout(function () {
                focusGuideStage('summary');
            }, 60);
            return;
        }

        refs.sessionResult.classList.add('hidden');
        const isInitialItemRender = !state.hasRenderedItem;
        state.hasHeardModel = false;
        state.itemResponded = wasCurrentItemAnswered();
        const item = config.items[state.idx];
        refs.mainArea.innerHTML = buildSpeakerContextMarkup() + buildCompactItemMarkup(item, state.idx === total - 1);
        bindItemEvents();
        restoreRecordingForCurrentItem();
        updateNextAvailability();
        updateStatus(state.itemResponded
            ? '응답을 저장했어요. 다시 시도하거나 다음 문장으로 갈 수 있어요.'
            : (isC16Enhanced
                ? '말하기 버튼을 누르거나, 마이크가 어렵다면 문장을 직접 입력해 보세요.'
                : '말하기 버튼을 눌러 문장을 끝까지 따라 말해 보세요.'), false);
        saveSession();
        window.setTimeout(function () {
            focusGuideStage('listen', {
                skipAutoScroll: isC16Enhanced && isInitialItemRender
            });
        }, 60);
        state.hasRenderedItem = true;
    }

    function buildItemMarkup(item, isLast) {
        const chips = (item.pronunciationTips || [])
            .map((tip) => '<span class="sp-chip">' + escapeHtml(tip) + '</span>')
            .join('');

        return [
            '<section class="sp-card p-5 mb-4">',
            '  <div class="flex items-start justify-between gap-3">',
            '    <div>',
            '      <div class="flex flex-wrap gap-2">',
            '        <span class="sp-mini-badge">' + escapeHtml(config.grammarLabel || '') + '</span>',
            '        <span class="sp-mini-badge sp-mini-badge--soft">' + escapeHtml(item.concept || '') + '</span>',
            '      </div>',
            '      <h2 class="mt-3 text-xl font-black text-slate-800 leading-snug safe">' + escapeHtml(item.scene || '') + '</h2>',
            '      <p class="mt-1 text-sm text-slate-500 safe">' + escapeHtml(item.sceneHint || '') + '</p>',
            '    </div>',
            '    <div class="text-4xl mt-1">' + escapeHtml(item.sceneIcon || '🗣️') + '</div>',
            '  </div>',
            '  <div class="grid gap-3 mt-4">',
            '    <div id="questionBox" class="sp-question-box">',
            '      <p class="sp-bubble-label">상황 질문</p>',
            '      <p class="text-[15px] font-semibold text-slate-800 leading-7 safe m-0">' + escapeHtml(item.question || '') + '</p>',
            '    </div>',
            '    <div id="answerBox" class="sp-answer-box">',
            '      <div class="flex items-center justify-between gap-2">',
            '        <p class="sp-bubble-label">' + escapeHtml(config.modelLabel || '모범 답안') + '</p>',
            '        <button id="toggleModelBtn" class="sp-inline-btn" type="button">가리기</button>',
            '      </div>',
            '      <p id="modelAnswer" class="text-[15px] font-bold text-slate-800 leading-7 safe m-0">' + highlightHtml(item.target || '', item.highlights || []) + '</p>',
            '    </div>',
            '  </div>',
            '  <details class="sp-tip-details mt-4">',
            '    <summary class="sp-tip-summary">말하기 포인트</summary>',
            '    <div class="sp-tip-box mt-2">',
            '      <p class="mt-0 text-sm text-slate-700 safe m-0">' + escapeHtml(item.tip || '') + '</p>',
            chips ? '      <div class="flex flex-wrap gap-2 mt-3">' + chips + '</div>' : '',
            '    </div>',
            '  </details>',
            '  <div class="grid gap-3 mt-4">',
            '    <div id="listenActionArea" class="grid grid-cols-2 gap-2">',
            '      <button id="listenBtn" class="sp-btn sp-btn-soft" type="button">모범답안 듣기</button>',
            '      <button id="slowBtn" class="sp-btn sp-btn-warm" type="button">천천히 듣기</button>',
            '    </div>',
            '    <div id="statusBox" class="sp-status-box">',
            '      <p class="sp-bubble-label">말하기 상태</p>',
            '      <p id="statusText" class="text-sm font-semibold text-slate-700 safe m-0">말하기 버튼을 눌러 문장을 끝까지 따라 말해 보세요.</p>',
            '    </div>',
            '    <div id="recordArea" class="rounded-[20px] border border-slate-200 bg-white p-4">',
            '      <div class="flex items-center gap-4">',
            '        <button id="recordBtn" class="sp-btn sp-record-button" type="button" aria-label="말하기 시작">',
            '          <span id="recordBtnText">말하기</span>',
            '        </button>',
            '        <div class="min-w-0 flex-1">',
            '          <p class="sp-bubble-label">인식 문장</p>',
            '          <div id="transcriptBox" class="sp-transcript safe">아직 인식된 문장이 없습니다.</div>',
            '        </div>',
            '      </div>',
            '      <div id="audioWrap" class="hidden mt-4">',
            '        <p class="sp-bubble-label">녹음 다시 듣기</p>',
            '        <audio id="audioPlayer" class="w-full" controls></audio>',
            '      </div>',
            '    </div>',
            '    <div id="resultWrap" class="hidden sp-result-box"></div>',
            '    <div id="actionRow" class="grid grid-cols-2 gap-2">',
            '      <button id="retryBtn" class="sp-btn sp-btn-ghost" type="button">다시 시도</button>',
            '      <button id="nextBtn" class="sp-btn sp-btn-primary" type="button">' + (isLast ? '결과 보기' : '다음 문장') + '</button>',
            '    </div>',
            '  </div>',
            '</section>'
        ].join('');
    }

    function buildCompactItemMarkup(item, isLast) {
        const chips = (item.pronunciationTips || [])
            .map((tip) => '<span class="sp-chip">' + escapeHtml(tip) + '</span>')
            .join('');

        return [
            '<section class="sp-card sp-item-card p-4 mb-4">',
            '  <div class="sp-scene-head flex items-start justify-between gap-3">',
            '    <div class="min-w-0 flex-1">',
            '      <div class="flex flex-wrap gap-2">',
            '        <span class="sp-mini-badge">' + escapeHtml(config.grammarLabel || '') + '</span>',
            '        <span class="sp-mini-badge sp-mini-badge--soft">' + escapeHtml(item.concept || '') + '</span>',
            '      </div>',
            '      <h2 class="sp-scene-title mt-2 text-xl font-black text-slate-800 leading-snug safe">' + escapeHtml(item.scene || '') + '</h2>',
            '    </div>',
            '    <div class="sp-scene-icon text-3xl">' + escapeHtml(item.sceneIcon || '💬') + '</div>',
            '  </div>',
            '  <div class="sp-prompt-grid grid gap-2 mt-3">',
            '    <div id="questionBox" class="sp-question-box">',
            '      <p class="sp-bubble-label">상황 질문</p>',
            '      <p class="sp-question-text safe m-0">' + escapeHtml(item.question || '') + '</p>',
            '    </div>',
            '    <div id="answerBox" class="sp-answer-box">',
            '      <div class="flex items-center justify-between gap-2">',
            '        <p class="sp-bubble-label">' + escapeHtml(config.modelLabel || '모범 답안') + '</p>',
            '        <button id="toggleModelBtn" class="sp-inline-btn" type="button">가리기</button>',
            '      </div>',
            '      <p id="modelAnswer" class="sp-answer-text safe m-0">' + highlightHtml(item.target || '', item.highlights || []) + '</p>',
            '    </div>',
            '  </div>',
            '  <div class="sp-activity-grid grid gap-2 mt-3">',
            '    <div id="listenActionArea" class="grid grid-cols-2 gap-2">',
            '      <button id="listenBtn" class="sp-btn sp-btn-soft" type="button">모범답안 듣기</button>',
            '      <button id="slowBtn" class="sp-btn sp-btn-warm" type="button">천천히 듣기</button>',
            '    </div>',
            '    <div id="recordArea" class="sp-record-area">',
            '      <div id="statusBox" class="sp-status-box">',
            '        <p class="sp-bubble-label">말하기 상태</p>',
            '        <p id="statusText" class="sp-status-text safe m-0" role="status" aria-live="polite">말하기 버튼을 눌러 문장을 끝까지 따라 말해 보세요.</p>',
            '      </div>',
            '      <div class="sp-record-main flex items-center gap-3">',
            '        <button id="recordBtn" class="sp-btn sp-record-button" type="button" aria-label="말하기 시작">',
            '          <span id="recordBtnText">말하기</span>',
            '        </button>',
            '        <div class="min-w-0 flex-1">',
            '          <p class="sp-bubble-label">인식 문장</p>',
            '          <div id="transcriptBox" class="sp-transcript safe">아직 인식된 문장이 없습니다.</div>',
            '        </div>',
            '      </div>',
            allowTypedFallback ? [
                '      <div class="sp-typed-fallback">',
                '        <label for="typedResponseInput" class="sp-typed-fallback__label">마이크가 어렵다면 문장으로 답하기</label>',
                '        <div class="sp-typed-fallback__row">',
                '          <input id="typedResponseInput" class="sp-typed-fallback__input" type="text" autocomplete="off" placeholder="말한 문장을 입력하세요" />',
                '          <button id="typedSubmitBtn" class="sp-inline-btn" type="button">입력 확인</button>',
                '        </div>',
                '      </div>'
            ].join('') : '',
            '      <div id="audioWrap" class="hidden mt-3">',
            '        <p class="sp-bubble-label">녹음 다시 듣기</p>',
            '        <audio id="audioPlayer" class="w-full" controls></audio>',
            '      </div>',
            '    </div>',
            '    <div id="resultWrap" class="hidden sp-result-box"></div>',
            '    <div id="actionRow" class="grid ' + (isC16Enhanced ? 'grid-cols-3' : 'grid-cols-2') + ' gap-2">',
            '      <button id="retryBtn" class="sp-btn sp-btn-ghost" type="button">다시 시도</button>',
            isC16Enhanced ? '      <button id="skipBtn" class="sp-btn sp-btn-ghost" type="button">건너뛰기</button>' : '',
            '      <button id="nextBtn" class="sp-btn sp-btn-primary" type="button"' + (requiresAttempt ? ' disabled aria-disabled="true"' : '') + '>' + (isLast ? '결과 보기' : '다음 문장') + '</button>',
            '    </div>',
            '    <details class="sp-tip-details mt-1">',
            '      <summary class="sp-tip-summary">말하기 포인트</summary>',
            '      <div class="sp-tip-box mt-2">',
            '        <p class="mt-0 text-sm text-slate-700 safe m-0">' + escapeHtml(item.tip || '') + '</p>',
            chips ? '        <div class="flex flex-wrap gap-2 mt-3">' + chips + '</div>' : '',
            '      </div>',
            '    </details>',
            '  </div>',
            '</section>'
        ].join('');
    }

    function bindItemEvents() {
        const listenBtn = document.getElementById('listenBtn');
        const slowBtn = document.getElementById('slowBtn');
        const recordBtn = document.getElementById('recordBtn');
        const retryBtn = document.getElementById('retryBtn');
        const nextBtn = document.getElementById('nextBtn');
        const skipBtn = document.getElementById('skipBtn');
        const typedResponseInput = document.getElementById('typedResponseInput');
        const typedSubmitBtn = document.getElementById('typedSubmitBtn');
        const toggleModelBtn = document.getElementById('toggleModelBtn');
        const changeSpeakerBtn = document.getElementById('changeSpeakerBtn');

        listenBtn.addEventListener('click', function () {
            speakCurrent(1, '모범 답안을 표준 속도로 들려드릴게요.');
        });
        slowBtn.addEventListener('click', function () {
            speakCurrent(0.8, '모범 답안을 천천히 들려드릴게요.');
        });
        recordBtn.addEventListener('click', toggleRecording);
        retryBtn.addEventListener('click', resetAttemptUi);
        nextBtn.addEventListener('click', nextItem);
        if (skipBtn) {
            skipBtn.addEventListener('click', skipCurrentItem);
        }
        if (typedSubmitBtn && typedResponseInput) {
            typedSubmitBtn.addEventListener('click', submitTypedResponse);
            typedResponseInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    submitTypedResponse();
                }
            });
        }
        toggleModelBtn.addEventListener('click', toggleModelAnswer);
        if (changeSpeakerBtn) {
            changeSpeakerBtn.addEventListener('click', renderSpeakerSelect);
        }
    }

    function submitTypedResponse() {
        const input = document.getElementById('typedResponseInput');
        const spokenText = input ? input.value.trim() : '';
        if (!spokenText) {
            updateStatus('문장을 입력한 뒤 입력 확인을 눌러 주세요.', false);
            if (input) {
                input.focus();
            }
            return;
        }
        if (state.isRecording) {
            stopRecording();
        }
        updateTranscript(spokenText);
        finishAttempt(spokenText);
    }

    function updateProgress(isDone) {
        const total = config.items.length;
        const currentCount = isDone ? total : Math.min(state.idx + 1, total);
        const progress = isDone ? 100 : Math.round((state.idx / total) * 100);

        if (refs.progressLabel) {
            refs.progressLabel.textContent = currentCount + ' / ' + total;
        }
        if (refs.progressPct) {
            refs.progressPct.textContent = progress + '%';
        }
        if (refs.progressBar) {
            refs.progressBar.style.width = progress + '%';
        }
    }

    function getCurrentItem() {
        return config.items[state.idx];
    }

    function toggleModelAnswer() {
        const answerEl = document.getElementById('modelAnswer');
        const toggleBtn = document.getElementById('toggleModelBtn');
        if (!answerEl || !toggleBtn) {
            return;
        }

        const hidden = answerEl.dataset.hidden === 'true';
        if (hidden) {
            answerEl.dataset.hidden = 'false';
            answerEl.innerHTML = highlightHtml(getCurrentItem().target || '', getCurrentItem().highlights || []);
            toggleBtn.textContent = '가리기';
        } else {
            answerEl.dataset.hidden = 'true';
            answerEl.textContent = '모범 답안을 가렸습니다. 먼저 직접 말해 보고 다시 확인하세요.';
            toggleBtn.textContent = '보기';
        }
    }

    function speakCurrent(rate, statusMessage) {
        const item = getCurrentItem();
        if (!item || !window.speechSynthesis) {
            return;
        }

        state.hasHeardModel = true;
        state.speechRequestId += 1;
        const speechRequestId = state.speechRequestId;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.target);
        utterance.lang = 'ko-KR';
        utterance.rate = rate;
        const voices = window.speechSynthesis.getVoices();
        const koreanVoice = voices.find(function (voice) {
            return String(voice.lang || '').toLowerCase().startsWith('ko');
        });
        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }
        utterance.onend = function () {
            if (speechRequestId !== state.speechRequestId) {
                return;
            }
            const currentItem = getCurrentItem();
            if (!currentItem || currentItem.id !== item.id || state.isRecording || isResultVisible()) {
                return;
            }
            updateStatus('이제 말하기 버튼을 눌러 직접 말해 보세요.', false);
            focusGuideStage('record-ready');
        };
        window.speechSynthesis.speak(utterance);
        updateStatus(statusMessage, false);
        focusGuideStage('listen');
    }

    function toggleRecording() {
        if (state.isStartingRecording) {
            return;
        }
        if (state.isRecording) {
            stopRecording();
            return;
        }
        startRecording();
    }

    function streamTracks(stream) {
        if (!stream) {
            return [];
        }
        if (typeof stream.getAudioTracks === 'function') {
            return stream.getAudioTracks();
        }
        if (typeof stream.getTracks === 'function') {
            return stream.getTracks();
        }
        return [];
    }

    function hasLiveMicrophone() {
        return streamTracks(state.mediaStream).some(function (track) {
            return track.readyState !== 'ended';
        });
    }

    async function ensureMediaStream() {
        if (hasLiveMicrophone()) {
            return state.mediaStream;
        }

        cleanupMediaStream();
        state.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                channelCount: 1
            }
        });
        streamTracks(state.mediaStream).forEach(function (track) {
            track.onended = handleMicrophoneEnded;
        });
        return state.mediaStream;
    }

    async function startRecording() {
        if (!hasRecognition && !canRecord) {
            updateStatus('이 환경에서는 음성 인식이 제한됩니다. HTTPS 또는 최신 Chrome에서 다시 시도해 보세요.', false);
            return;
        }

        resetAttemptUi(true);
        state.speechRequestId += 1;
        window.speechSynthesis?.cancel();

        try {
            state.isStartingRecording = true;
            updateRecordButton(false, true);
            updateStatus('음성 인식을 준비하고 있어요. 허용하면 바로 평가가 시작됩니다.', false);
            if (!recognitionOnlyMode) {
                updateStatus(
                    hasLiveMicrophone()
                        ? '마이크 입력을 확인하고 있어요.'
                        : '마이크 권한을 확인하고 있어요. 허용하면 바로 녹음이 시작됩니다.',
                    false
                );
                state.mediaStream = await ensureMediaStream();
            }
        } catch (error) {
            state.isStartingRecording = false;
            updateRecordButton(false, false);
            updateStatus('마이크를 시작하지 못했어요. 브라우저 권한을 확인해 주세요.', false);
            console.error(error);
            return;
        }

        state.isStartingRecording = false;
        state.audioChunks = [];
        state.recordingItemId = getCurrentItem() ? getCurrentItem().id : '';
        state.liveTranscript = '';
        state.finalTranscript = '';

        if (recognitionOnlyMode) {
            if (!startRecognition()) {
                state.isStartingRecording = false;
                updateRecordButton(false);
                return;
            }
            state.isRecording = true;
            updateRecordButton(true);
            updateTranscript('듣고 있습니다. 문장을 끝까지 또박또박 말해 보세요.');
            updateStatus('음성 인식 중이에요. 문장을 끝까지 말한 뒤 정지를 눌러 평가하세요.', true);
            focusGuideStage('recording');
            return;
        }

        try {
            const mimeType = chooseMimeType();
            state.mediaRecorder = mimeType
                ? new MediaRecorder(state.mediaStream, { mimeType: mimeType })
                : new MediaRecorder(state.mediaStream);
        } catch (error) {
            state.mediaRecorder = null;
            updateRecordButton(false, false);
            updateStatus('이 브라우저에서는 녹음 형식을 준비하지 못했어요.', false);
            console.error(error);
            return;
        }

        state.mediaRecorder.addEventListener('dataavailable', function (event) {
            if (event.data && event.data.size > 0) {
                state.audioChunks.push(event.data);
            }
        });
        state.mediaRecorder.addEventListener('stop', applyRecordedAudio);
        state.mediaRecorder.start(250);
        startRecognition();

        state.isRecording = true;
        updateRecordButton(true);
        updateTranscript('듣고 있습니다. 문장을 끝까지 또박또박 말해 보세요.');
        updateStatus(hasRecognition
            ? '녹음 중이에요. 숨을 고르고 문장을 끝까지 말해 보세요.'
            : '녹음 중이에요. 이 브라우저는 음성 인식이 제한적이라 녹음만 남길 수 있습니다.',
        true);
        focusGuideStage('recording');
    }

    function stopRecording() {
        if (!state.isRecording) {
            return;
        }

        state.isRecording = false;
        updateRecordButton(false);
        stopRecognition();

        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
            try {
                state.mediaRecorder.stop();
            } catch (error) {
                console.error(error);
            }
        }

        const transcript = (state.finalTranscript || state.liveTranscript || '').trim();
        if (!transcript) {
            updateStatus(hasRecognition
                ? '말한 내용이 잘 잡히지 않았어요. 천천히 다시 말해 보세요.'
                : '녹음은 저장됐어요. 음성 인식이 없어 점수는 표시되지 않습니다.',
            false);
            focusGuideStage('record-ready');
            return;
        }

        finishAttempt(transcript);
    }

    function startRecognition() {
        if (!hasRecognition) {
            return false;
        }

        state.recognition = new RecognitionClass();
        state.recognition.lang = 'ko-KR';
        state.recognition.continuous = true;
        state.recognition.interimResults = true;
        state.recognition.maxAlternatives = 1;

        state.recognition.onresult = function (event) {
            let live = '';
            let final = state.finalTranscript ? state.finalTranscript + ' ' : '';

            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                const phrase = String(event.results[index][0].transcript || '').trim();
                if (!phrase) {
                    continue;
                }
                if (event.results[index].isFinal) {
                    final += phrase + ' ';
                } else {
                    live += phrase + ' ';
                }
            }

            state.finalTranscript = final.trim();
            state.liveTranscript = (state.finalTranscript || live).trim();
            updateTranscript(state.liveTranscript || '아직 인식된 문장이 없습니다.');
        };

        state.recognition.onerror = function (event) {
            if (event.error === 'aborted' || event.error === 'no-speech') {
                return;
            }
            console.error(event);
        };

        try {
            state.recognition.start();
            return true;
        } catch (error) {
            console.error(error);
            updateStatus('음성 인식을 시작하지 못했어요. 브라우저 권한을 확인한 뒤 다시 시도해 주세요.', false);
            state.recognition = null;
            return false;
        }
    }

    function stopRecognition() {
        if (!state.recognition) {
            return;
        }
        try {
            state.recognition.stop();
        } catch (error) {
            console.error(error);
        }
        state.recognition = null;
    }

    function finishAttempt(spokenText) {
        const item = getCurrentItem();
        const answers = [item.target].concat(item.aliases || []);
        const best = answers
            .map(function (answer) {
                const comparison = compareSentences(answer, spokenText);
                comparison.reference = answer;
                return comparison;
            })
            .sort(function (left, right) {
                return right.score - left.score;
            })[0];

        const entry = {
            id: item.id,
            scene: item.scene,
            spoken: spokenText,
            score: best.score,
            accuracy: best.accuracy,
            completeness: best.completeness,
            feedback: best.feedback,
            target: item.target,
            comparedTarget: best.reference,
            targetHtml: best.targetHtml,
            spokenHtml: best.spokenHtml,
            createdAt: new Date().toISOString()
        };

        state.sessionScores.push(best.score);
        state.sessionLog.push(entry);
        state.itemResponded = true;
        persistHistory(entry);
        saveSession();
        renderAttemptResult(entry);
        updateStatus(best.feedback, false);
        updateNextAvailability();
    }

    function renderAttemptResult(entry) {
        const resultWrap = document.getElementById('resultWrap');
        if (!resultWrap) {
            return;
        }

        const toneClass = entry.score >= 90 ? 'good' : (entry.score >= 70 ? 'mid' : 'low');
        resultWrap.className = 'sp-result-box ' + toneClass;
        resultWrap.classList.remove('hidden');
        resultWrap.innerHTML = [
            '<div class="sp-result-summary">',
            '  <div class="sp-result-scorecard">',
            '    <span class="sp-result-scorecard__label">종합</span>',
            '    <strong class="sp-result-scorecard__value">' + entry.score + '점</strong>',
            '  </div>',
            '  <div class="sp-result-summary__side">',
            '    <div class="sp-result-mini-grid">',
            '      <div class="sp-result-mini">',
            '        <span class="sp-result-mini__label">일치도</span>',
            '        <strong class="sp-result-mini__value">' + entry.accuracy + '</strong>',
            '      </div>',
            '      <div class="sp-result-mini">',
            '        <span class="sp-result-mini__label">완성도</span>',
            '        <strong class="sp-result-mini__value">' + entry.completeness + '</strong>',
            '      </div>',
            '    </div>',
            '    <p class="sp-result-feedback safe">' + escapeHtml(entry.feedback) + '</p>',
            '  </div>',
            '</div>',
            '<div class="sp-diff-legend" aria-label="글자별 피드백 범례">',
            '  <span><i class="sp-legend-dot sp-legend-dot--ok"></i>맞음</span>',
            '  <span><i class="sp-legend-dot sp-legend-dot--err"></i>다름/빠짐</span>',
            '  <span><i class="sp-legend-dot sp-legend-dot--ext"></i>추가 인식</span>',
            '</div>',
            '<div class="sp-compare-grid mt-3">',
            '  <div class="sp-compare">',
            '    <p class="sp-bubble-label">목표 문장</p>',
            '    <p class="safe sp-diff-line">' + entry.targetHtml + '</p>',
            '  </div>',
            '  <div class="sp-compare">',
            '    <p class="sp-bubble-label">인식 문장</p>',
            '    <p class="safe sp-diff-line">' + entry.spokenHtml + '</p>',
            '  </div>',
            '</div>',
            '<p class="sp-note mt-2">공백과 구두점은 줄여서 비교한 참고 점수입니다.</p>'
        ].join('');

        window.setTimeout(function () {
            focusGuideStage('result', {
                preferRetry: entry.score < 80
            });
        }, 60);
    }

    function renderSessionSummary() {
        clearSessionSummaryRecordings();
        const attempts = state.sessionScores.length;
        const best = attempts ? Math.max.apply(null, state.sessionScores) : 0;
        const avg = attempts ? Math.round(state.sessionScores.reduce(function (sum, score) {
            return sum + score;
        }, 0) / attempts) : 0;
        const skipped = state.skippedItemIds.length;

        refs.resAttempts.textContent = String(attempts);
        refs.resBest.textContent = attempts ? best + '점' : '-';
        refs.resAvg.textContent = attempts ? avg + '점' : '-';

        if (isC16Enhanced) {
            const resultHeading = refs.sessionResult && refs.sessionResult.querySelector('h2');
            const resultDescription = refs.sessionResult && refs.sessionResult.querySelector('p');
            if (resultHeading) {
                resultHeading.textContent = skipped ? '연습 결과' : '말하기 연습 완료';
            }
            if (resultDescription) {
                resultDescription.textContent = skipped
                    ? `응답 ${attempts}회 · 건너뜀 ${skipped}문장입니다. 건너뛴 문장은 다시 연습해 보세요.`
                    : '응답한 문장을 저장했어요. 필요하면 다시 연습할 수 있어요.';
            }
        }

        if (!state.sessionLog.length) {
            refs.logArea.innerHTML = isC16Enhanced
                ? '<div class="sp-log-item"><p class="text-sm text-slate-500 m-0 safe">이번 세션에는 응답이 없습니다. 건너뜀은 학습 완료로 기록되지 않아요.</p></div>'
                : '<div class="sp-log-item"><p class="text-sm text-slate-500 m-0 safe">이번 세션에서는 아직 저장된 말하기 기록이 없습니다. 듣기와 따라 말하기만 해도 괜찮아요.</p></div>';
            return;
        }

        refs.logArea.innerHTML = state.sessionLog.map(function (entry, index) {
            const hasRecording = isC16Enhanced && state.savedRecordingItemIds.includes(entry.id);
            return [
                '<div class="sp-log-item mt-3">',
                '  <div class="flex items-start justify-between gap-3">',
                '    <div>',
                '      <p class="text-sm font-black text-slate-800 m-0">' + (index + 1) + '. ' + escapeHtml(entry.scene) + '</p>',
                '      <p class="text-xs text-slate-500 mt-1 mb-0 safe"><b>내 답:</b> ' + escapeHtml(entry.spoken) + '</p>',
                '      <p class="text-xs text-slate-500 mt-1 mb-0 safe"><b>모범 답안:</b> ' + escapeHtml(entry.target) + '</p>',
                '    </div>',
                '    <span class="sp-score-pill">' + entry.score + '점</span>',
                '  </div>',
                hasRecording
                    ? '  <div class="sp-session-audio" data-session-recording-id="' + escapeHtml(entry.id) + '"><p class="sp-note m-0">녹음 불러오는 중…</p></div>'
                    : '',
                '</div>'
            ].join('');
        }).join('') + (isC16Enhanced && skipped
            ? '<div class="sp-log-item mt-3"><p class="text-sm text-slate-600 m-0 safe"><b>건너뜀:</b> ' + skipped + '문장 · 다음 학습 때 다시 응답해 보세요.</p></div>'
            : '');
        if (isC16Enhanced) {
            restoreSessionSummaryRecordings();
        }
    }

    function restoreSessionSummaryRecordings() {
        if (!shouldPersistSession || !refs.logArea) {
            return;
        }
        refs.logArea.querySelectorAll('[data-session-recording-id]').forEach(function (container) {
            const itemId = container.dataset.sessionRecordingId;
            loadRecordingBlob(itemId).then(function (blob) {
                if (!blob || !container.isConnected) {
                    if (container.isConnected) {
                        container.innerHTML = '<p class="sp-note m-0">저장된 녹음을 찾지 못했어요.</p>';
                    }
                    return;
                }
                const url = URL.createObjectURL(blob);
                state.summaryAudioUrls.push(url);
                container.innerHTML = [
                    '<p class="sp-bubble-label">내 녹음 다시 듣기</p>',
                    '<audio class="sp-session-audio__player" controls src="' + url + '"></audio>'
                ].join('');
            }).catch(function () {
                if (container.isConnected) {
                    container.innerHTML = '<p class="sp-note m-0">저장된 녹음을 불러오지 못했어요.</p>';
                }
            });
        });
    }

    function nextItem() {
        if (state.isRecording) {
            stopRecording();
        }
        if (requiresAttempt && !state.itemResponded) {
            updateStatus('말하거나 문장을 입력한 뒤 다음으로 갈 수 있어요. 필요하면 건너뛰기를 선택하세요.', false);
            const typedInput = document.getElementById('typedResponseInput');
            (typedInput || document.getElementById('recordBtn'))?.focus();
            return;
        }
        state.idx += 1;
        state.itemResponded = false;
        saveSession();
        render();
    }

    function skipCurrentItem() {
        if (!isC16Enhanced) {
            return;
        }
        // A real response should advance as a response, never be counted as
        // both a response and a skip.
        if (state.itemResponded) {
            nextItem();
            return;
        }
        const item = getCurrentItem();
        if (!item) {
            return;
        }
        if (!state.skippedItemIds.includes(item.id)) {
            state.skippedItemIds.push(item.id);
        }
        state.idx += 1;
        state.itemResponded = false;
        saveSession();
        render();
    }

    function resetAttemptUi(keepStatus) {
        if (state.isRecording) {
            stopRecording();
            return;
        }

        state.liveTranscript = '';
        state.finalTranscript = '';
        clearAudioPlayer();
        updateTranscript('아직 인식된 문장이 없습니다.');

        const resultWrap = document.getElementById('resultWrap');
        if (resultWrap) {
            resultWrap.className = 'hidden sp-result-box';
            resultWrap.innerHTML = '';
        }

        if (!keepStatus) {
            updateStatus('다시 한 번 또박또박 말해 보세요.', false);
            focusGuideStage(state.hasHeardModel ? 'record-ready' : 'listen');
        }
    }

    function restartSession() {
        cleanupAll();
        state.idx = 0;
        state.sessionScores = [];
        state.sessionLog = [];
        state.itemResponded = false;
        state.skippedItemIds = [];
        state.savedRecordingItemId = '';
        state.savedRecordingItemIds = [];
        state.hasRenderedItem = false;
        saveSession();
        render();
    }

    function wasCurrentItemAnswered() {
        const item = getCurrentItem();
        if (!item) {
            return false;
        }
        return state.sessionLog.some(function (entry) {
            return entry.id === item.id;
        });
    }

    function updateNextAvailability() {
        const nextBtn = document.getElementById('nextBtn');
        if (!nextBtn) {
            return;
        }
        const enabled = !requiresAttempt || state.itemResponded;
        nextBtn.disabled = !enabled;
        nextBtn.setAttribute('aria-disabled', String(!enabled));
        const skipBtn = document.getElementById('skipBtn');
        if (isC16Enhanced && skipBtn) {
            skipBtn.hidden = state.itemResponded;
            skipBtn.disabled = state.itemResponded;
        }
    }

    function updateStatus(message, recording) {
        const statusBox = document.getElementById('statusBox');
        const statusText = document.getElementById('statusText');
        if (!statusBox || !statusText) {
            return;
        }
        statusText.textContent = message;
        statusBox.classList.toggle('is-recording', !!recording);
    }

    function updateTranscript(text) {
        const transcriptBox = document.getElementById('transcriptBox');
        if (transcriptBox) {
            transcriptBox.textContent = text;
        }
    }

    function updateRecordButton(recording) {
        const recordBtn = document.getElementById('recordBtn');
        const recordBtnText = document.getElementById('recordBtnText');
        if (!recordBtn || !recordBtnText) {
            return;
        }
        recordBtn.classList.toggle('is-recording', !!recording);
        recordBtn.disabled = !!state.isStartingRecording;
        recordBtnText.textContent = state.isStartingRecording ? '준비' : (recording ? '정지' : '말하기');
        recordBtn.setAttribute('aria-label', state.isStartingRecording ? '마이크 준비 중' : (recording ? '말하기 정지' : '말하기 시작'));
    }

    function applyRecordedAudio() {
        if (!state.audioChunks.length) {
            return;
        }

        const blob = new Blob(state.audioChunks, { type: state.audioChunks[0].type || 'audio/webm' });
        state.audioChunks = [];
        const currentItem = getCurrentItem();

        if (!currentItem || currentItem.id !== state.recordingItemId) {
            return;
        }

        clearAudioPlayer();
        state.audioUrl = URL.createObjectURL(blob);
        if (shouldPersistSession) {
            state.savedRecordingItemId = currentItem.id;
            if (!state.savedRecordingItemIds.includes(currentItem.id)) {
                state.savedRecordingItemIds.push(currentItem.id);
            }
            saveSession();
            saveRecordingBlob(currentItem.id, blob);
        }

        const audioWrap = document.getElementById('audioWrap');
        const audioPlayer = document.getElementById('audioPlayer');
        if (!audioWrap || !audioPlayer) {
            return;
        }

        audioPlayer.src = state.audioUrl;
        audioWrap.classList.remove('hidden');
    }

    function restoreRecordingForCurrentItem() {
        if (!shouldPersistSession || !state.savedRecordingItemIds.length) {
            return;
        }
        const item = getCurrentItem();
        if (!item || !state.savedRecordingItemIds.includes(item.id)) {
            return;
        }
        loadRecordingBlob(item.id).then(function (blob) {
            if (!blob || !getCurrentItem() || getCurrentItem().id !== item.id) {
                return;
            }
            clearAudioPlayer();
            state.audioUrl = URL.createObjectURL(blob);
            const audioWrap = document.getElementById('audioWrap');
            const audioPlayer = document.getElementById('audioPlayer');
            if (audioWrap && audioPlayer) {
                audioPlayer.src = state.audioUrl;
                audioWrap.classList.remove('hidden');
            }
        }).catch(function () {
            // Audio recovery is optional.  The text response remains saved.
        });
    }

    function clearAudioPlayer() {
        const audioWrap = document.getElementById('audioWrap');
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.pause();
            audioPlayer.removeAttribute('src');
            audioPlayer.load();
        }
        if (audioWrap) {
            audioWrap.classList.add('hidden');
        }
        if (state.audioUrl) {
            URL.revokeObjectURL(state.audioUrl);
            state.audioUrl = '';
        }
    }

    function clearSessionSummaryRecordings() {
        state.summaryAudioUrls.forEach(function (url) {
            URL.revokeObjectURL(url);
        });
        state.summaryAudioUrls = [];
    }

    function cleanupMediaStream() {
        if (state.mediaStream) {
            streamTracks(state.mediaStream).forEach(function (track) {
                track.onended = null;
                track.stop();
            });
            state.mediaStream = null;
        }
    }

    function cleanupTransientState() {
        stopRecognition();
        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
            try {
                if (!recognitionOnlyMode) {
                    state.mediaRecorder.stop();
                }
            } catch (error) {
                console.error(error);
            }
        }
        state.mediaRecorder = null;
        state.isRecording = false;
        state.isStartingRecording = false;
        state.recordingItemId = '';
        clearAudioPlayer();
    }

    function cleanupAll() {
        cleanupTransientState();
        cleanupMediaStream();
        clearSessionSummaryRecordings();
        state.speechRequestId += 1;
        window.speechSynthesis?.cancel();
    }

    function handleMicrophoneEnded() {
        if (hasLiveMicrophone()) {
            return;
        }
        if (state.isRecording || state.isStartingRecording) {
            state.isRecording = false;
            state.isStartingRecording = false;
            stopRecognition();
            if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
                try {
                    state.mediaRecorder.stop();
                } catch (error) {
                    console.error(error);
                }
            }
            state.mediaRecorder = null;
            updateRecordButton(false, false);
            updateStatus('마이크 연결이 끊겼어요. 말하기 버튼을 다시 눌러 주세요.', false);
            focusGuideStage('record-ready');
        }
        state.mediaStream = null;
    }

    function focusGuideStage(stageKey, options) {
        const stage = buildGuideStage(stageKey, options || {});
        if (!stage) {
            return;
        }

        state.guideStage = stageKey;
        clearGuideHighlights();

        (stage.highlights || []).forEach(function (highlight) {
            markGuideTarget(highlight.id, highlight.mode);
        });

        if (!options || !options.skipAutoScroll) {
            autoScrollToTarget(stage.scrollTarget, stage.fitIds || []);
        }
    }

    function buildGuideStage(stageKey, options) {
        const preferRetry = !!options.preferRetry;

        const stages = {
            listen: {
                scrollTarget: 'answerBox',
                fitIds: ['questionBox', 'answerBox', 'listenActionArea', 'recordArea'],
                highlights: [
                    { id: 'answerBox', mode: 'view' },
                    { id: 'listenBtn', mode: 'action' }
                ]
            },
            'record-ready': {
                scrollTarget: 'recordArea',
                fitIds: ['questionBox', 'answerBox', 'listenActionArea', 'recordArea'],
                highlights: [
                    { id: 'answerBox', mode: 'view' },
                    { id: 'recordBtn', mode: 'action' }
                ]
            },
            recording: {
                scrollTarget: 'recordArea',
                fitIds: ['questionBox', 'answerBox', 'recordArea'],
                highlights: [
                    { id: 'transcriptBox', mode: 'view' },
                    { id: 'recordBtn', mode: 'action' }
                ]
            },
            result: {
                scrollTarget: 'resultWrap',
                fitIds: ['questionBox', 'answerBox', 'resultWrap', 'actionRow'],
                highlights: [
                    { id: 'resultWrap', mode: 'view' },
                    { id: preferRetry ? 'retryBtn' : 'nextBtn', mode: 'action' }
                ]
            },
            summary: {
                scrollTarget: 'sessionResult',
                fitIds: ['sessionResult'],
                highlights: [
                    { id: 'sessionResult', mode: 'view' },
                    { id: 'restartSessionBtn', mode: 'action' }
                ]
            }
        };

        return stages[stageKey] || null;
    }

    function clearGuideHighlights() {
        [
            'questionBox',
            'answerBox',
            'listenBtn',
            'slowBtn',
            'listenActionArea',
            'statusBox',
            'recordArea',
            'recordBtn',
            'transcriptBox',
            'resultWrap',
            'retryBtn',
            'nextBtn',
            'sessionResult',
            'restartSessionBtn'
        ].forEach(function (id) {
            const element = document.getElementById(id);
            if (!element) {
                return;
            }
            element.classList.remove('sp-guided', 'sp-guided-view', 'sp-guided-action');
        });
    }

    function markGuideTarget(id, mode) {
        const element = document.getElementById(id);
        if (!element) {
            return;
        }

        element.classList.add('sp-guided');
        if (mode === 'action') {
            element.classList.add('sp-guided-action');
        } else {
            element.classList.add('sp-guided-view');
        }
    }

    function autoScrollToTarget(id, fitIds) {
        const target = document.getElementById(id);
        if (!target) {
            return;
        }

        window.clearTimeout(state.guideScrollTimer);
        state.guideScrollTimer = window.setTimeout(function () {
            const topPadding = 80;
            const bottomPadding = 16;
            const fitElements = (fitIds || [])
                .map(function (fitId) {
                    return document.getElementById(fitId);
                })
                .filter(Boolean);
            let top;

            if (fitElements.length) {
                const bounds = fitElements.map(function (element) {
                    const rect = element.getBoundingClientRect();
                    return {
                        top: rect.top + window.scrollY,
                        bottom: rect.bottom + window.scrollY
                    };
                });
                const regionTop = Math.min.apply(null, bounds.map(function (bound) {
                    return bound.top;
                }));
                const regionBottom = Math.max.apply(null, bounds.map(function (bound) {
                    return bound.bottom;
                }));
                const availableHeight = Math.max(window.innerHeight - topPadding - bottomPadding, 120);
                const regionHeight = regionBottom - regionTop;

                top = regionTop - topPadding;
                if (regionHeight > availableHeight) {
                    top = Math.min(top, regionBottom - window.innerHeight + bottomPadding);
                }
            } else {
                top = target.getBoundingClientRect().top + window.scrollY - topPadding;
            }

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        }, 40);
    }

    function isResultVisible() {
        const resultWrap = document.getElementById('resultWrap');
        return !!(resultWrap && !resultWrap.classList.contains('hidden') && resultWrap.innerHTML.trim());
    }

    function restoreSession() {
        if (!shouldPersistSession) {
            return;
        }
        const saved = loadSession();
        if (!saved) {
            return;
        }
        state.idx = saved.idx;
        state.selectedSpeaker = saved.selectedSpeaker;
        state.selectedSpeakerLabel = saved.selectedSpeakerLabel;
        state.sessionScores = saved.sessionScores;
        state.sessionLog = saved.sessionLog;
        state.skippedItemIds = saved.skippedItemIds;
        state.savedRecordingItemId = saved.savedRecordingItemId;
        state.savedRecordingItemIds = saved.savedRecordingItemIds;

        if (hasSpeakerSelect() && state.selectedSpeaker) {
            const choice = speakerChoices.find(function (candidate) {
                return candidate.id === state.selectedSpeaker;
            });
            const selectedItems = originalItems.filter(function (item) {
                return item.speaker === state.selectedSpeaker;
            });
            if (!choice || !selectedItems.length) {
                state.selectedSpeaker = '';
                state.selectedSpeakerLabel = '';
                state.idx = 0;
            } else {
                state.selectedSpeakerLabel = choice.label || state.selectedSpeaker;
                config.items = selectedItems;
                state.idx = Math.min(state.idx, selectedItems.length);
            }
        } else {
            state.idx = Math.min(state.idx, originalItems.length);
        }
    }

    function loadSession() {
        let record;
        try {
            const primaryRaw = localStorage.getItem(sessionStorageKey);
            if (primaryRaw !== null) {
                record = { key: sessionStorageKey, raw: primaryRaw };
            } else if (isC16Enhanced && legacySessionStorageKey !== sessionStorageKey) {
                const legacyRaw = localStorage.getItem(legacySessionStorageKey);
                if (legacyRaw !== null) {
                    record = { key: legacySessionStorageKey, raw: legacyRaw };
                }
            }
            if (!record) {
                return null;
            }
            const parsed = JSON.parse(record.raw);
            if (!parsed || parsed.version !== 1 || !Number.isInteger(parsed.idx)
                || !Array.isArray(parsed.sessionScores) || !Array.isArray(parsed.sessionLog)
                || !Array.isArray(parsed.skippedItemIds)) {
                markSessionStorageBlocked('corrupt', record);
                return null;
            }
            return {
                idx: Math.max(0, parsed.idx),
                selectedSpeaker: typeof parsed.selectedSpeaker === 'string' ? parsed.selectedSpeaker : '',
                selectedSpeakerLabel: typeof parsed.selectedSpeakerLabel === 'string' ? parsed.selectedSpeakerLabel : '',
                sessionScores: parsed.sessionScores.filter(function (score) { return Number.isFinite(score); }),
                sessionLog: parsed.sessionLog.filter(function (entry) { return entry && typeof entry.id === 'string' && typeof entry.spoken === 'string'; }),
                skippedItemIds: parsed.skippedItemIds.filter(function (id) { return typeof id === 'string'; }),
                savedRecordingItemId: typeof parsed.savedRecordingItemId === 'string' ? parsed.savedRecordingItemId : '',
                savedRecordingItemIds: Array.isArray(parsed.savedRecordingItemIds)
                    ? parsed.savedRecordingItemIds.filter(function (id) { return typeof id === 'string'; })
                    : (typeof parsed.savedRecordingItemId === 'string' && parsed.savedRecordingItemId
                        ? [parsed.savedRecordingItemId]
                        : [])
            };
        } catch (error) {
            markSessionStorageBlocked(record ? 'corrupt' : 'unavailable', record || { key: sessionStorageKey, raw: '' });
            return null;
        }
    }

    function saveSession() {
        if (!shouldPersistSession || state.sessionStorageBlocked) {
            return;
        }
        try {
            localStorage.setItem(sessionStorageKey, JSON.stringify(getSessionSnapshot()));
        } catch (error) {
            let raw = '';
            try {
                raw = localStorage.getItem(sessionStorageKey) || '';
            } catch (readError) {
                // The recovery panel still offers a copy of the in-memory session.
            }
            markSessionStorageBlocked('write', { key: sessionStorageKey, raw: raw });
            updateStatus('현재 세션을 저장하지 못했어요. 이 페이지를 열어 둔 채 계속할 수 있어요.', false);
            renderSessionRecovery();
        }
    }

    function getSessionSnapshot() {
        return {
            version: 1,
            idx: state.idx,
            selectedSpeaker: state.selectedSpeaker,
            selectedSpeakerLabel: state.selectedSpeakerLabel,
            sessionScores: state.sessionScores,
            sessionLog: state.sessionLog,
            skippedItemIds: state.skippedItemIds,
            savedRecordingItemId: state.savedRecordingItemId,
            savedRecordingItemIds: state.savedRecordingItemIds,
            updatedAt: new Date().toISOString()
        };
    }

    function markSessionStorageBlocked(issue, record) {
        state.sessionStorageBlocked = true;
        state.sessionRecoveryIssue = issue || 'write';
        state.sessionRecordKey = record && record.key ? record.key : sessionStorageKey;
        state.sessionRawRecord = record && typeof record.raw === 'string' ? record.raw : '';
    }

    function renderSessionRecovery() {
        const existing = document.getElementById('sessionRecovery');
        if (existing) {
            existing.remove();
        }
        if (!isC16Enhanced || !state.sessionStorageBlocked || !refs.mainArea) {
            return;
        }

        const issueText = state.sessionRecoveryIssue === 'corrupt'
            ? '이전 세션 기록을 읽을 수 없어요. 원본은 그대로 보관하고 있어요.'
            : (state.sessionRecoveryIssue === 'unavailable'
                ? '이 기기에서는 현재 세션을 저장할 수 없어요. 이 페이지를 열어 둔 채 계속 연습할 수 있어요.'
                : '현재 세션을 저장하지 못했어요. 원본을 덮어쓰지 않고, 이 페이지에서 계속 연습할 수 있어요.');
        const recovery = document.createElement('section');
        recovery.id = 'sessionRecovery';
        recovery.className = 'sp-session-recovery';
        recovery.setAttribute('role', 'alert');
        recovery.innerHTML = [
            '<p class="sp-session-recovery__title">저장 기록을 복구할 수 있어요</p>',
            '<p class="sp-session-recovery__copy">' + escapeHtml(issueText) + '</p>',
            '<div class="sp-session-recovery__actions">',
            '  <button class="sp-inline-btn" type="button" data-session-recovery-copy>기록 복사</button>',
            '  <button class="sp-inline-btn" type="button" data-session-recovery-download>기록 내려받기</button>',
            '  <button class="sp-inline-btn sp-session-recovery__reset" type="button" data-session-recovery-reset>이 페이지 세션 초기화</button>',
            '</div>',
            '<p class="sp-session-recovery__status" data-session-recovery-status aria-live="polite"></p>'
        ].join('');
        refs.mainArea.parentNode.insertBefore(recovery, refs.mainArea);
        recovery.querySelector('[data-session-recovery-copy]').addEventListener('click', function () {
            copySessionRecovery(recovery);
        });
        recovery.querySelector('[data-session-recovery-download]').addEventListener('click', function () {
            downloadSessionRecovery(recovery);
        });
        recovery.querySelector('[data-session-recovery-reset]').addEventListener('click', resetSessionRecovery);
    }

    function buildSessionRecoveryExport() {
        return JSON.stringify({
            page: c16SessionPageId,
            storageKey: state.sessionRecordKey || sessionStorageKey,
            issue: state.sessionRecoveryIssue || 'write',
            preservedRecord: state.sessionRawRecord,
            currentSession: getSessionSnapshot()
        }, null, 2);
    }

    function setSessionRecoveryStatus(recovery, message) {
        const status = recovery && recovery.querySelector('[data-session-recovery-status]');
        if (status) {
            status.textContent = message;
        }
    }

    function copySessionRecovery(recovery) {
        const payload = buildSessionRecoveryExport();
        const copied = function () {
            setSessionRecoveryStatus(recovery, '복사했어요. 필요하면 메모장에 붙여 넣어 보관하세요.');
        };
        const fallback = function () {
            const textarea = document.createElement('textarea');
            textarea.value = payload;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                copied();
            } catch (error) {
                setSessionRecoveryStatus(recovery, '복사하지 못했어요. 기록 내려받기를 사용하세요.');
            }
            textarea.remove();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(payload).then(copied).catch(fallback);
        } else {
            fallback();
        }
    }

    function downloadSessionRecovery(recovery) {
        const blob = new Blob([buildSessionRecoveryExport()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (c16SessionPageId || 'c16-speaking-session') + '-recovery.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
        setSessionRecoveryStatus(recovery, '복구 기록을 내려받기 시작했어요.');
    }

    function resetSessionRecovery() {
        if (!window.confirm('이 페이지의 저장 세션만 초기화할까요? 복사하거나 내려받지 않은 손상 기록은 복구할 수 없습니다.')) {
            return;
        }
        try {
            localStorage.removeItem(state.sessionRecordKey || sessionStorageKey);
        } catch (error) {
            const recovery = document.getElementById('sessionRecovery');
            setSessionRecoveryStatus(recovery, '초기화하지 못했어요. 기록 복사 또는 내려받기를 사용하세요.');
            return;
        }
        state.sessionStorageBlocked = false;
        state.sessionRecoveryIssue = '';
        state.sessionRawRecord = '';
        state.sessionRecordKey = '';
        renderSessionRecovery();
        saveSession();
        updateStatus('이 페이지의 저장 세션을 초기화했어요. 지금부터 새로 저장합니다.', false);
    }

    function openRecordingDb() {
        return new Promise(function (resolve, reject) {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB is not available.'));
                return;
            }
            const request = window.indexedDB.open(recordingStoreName, 1);
            request.onupgradeneeded = function () {
                const db = request.result;
                if (!db.objectStoreNames.contains('recordings')) {
                    db.createObjectStore('recordings');
                }
            };
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error || new Error('Unable to open IndexedDB.')); };
        });
    }

    function recordingKey(itemId) {
        return storageKey + ':' + itemId;
    }

    function saveRecordingBlob(itemId, blob) {
        return openRecordingDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const transaction = db.transaction('recordings', 'readwrite');
                transaction.objectStore('recordings').put(blob, recordingKey(itemId));
                transaction.oncomplete = function () { db.close(); resolve(); };
                transaction.onerror = function () { db.close(); reject(transaction.error || new Error('Unable to save recording.')); };
            });
        }).catch(function () {
            // A recording is helpful but should never block the learning flow.
        });
    }

    function loadRecordingBlob(itemId) {
        return openRecordingDb().then(function (db) {
            return new Promise(function (resolve, reject) {
                const transaction = db.transaction('recordings', 'readonly');
                const request = transaction.objectStore('recordings').get(recordingKey(itemId));
                request.onsuccess = function () { resolve(request.result || null); };
                request.onerror = function () { reject(request.error || new Error('Unable to load recording.')); };
                transaction.oncomplete = function () { db.close(); };
            });
        });
    }

    function persistHistory(entry) {
        const data = loadHistory();
        const prev = data[entry.id] || {};
        data[entry.id] = {
            scene: entry.scene,
            target: entry.target,
            attempts: (prev.attempts || 0) + 1,
            best: Math.max(prev.best || 0, entry.score),
            lastScore: entry.score,
            lastSpoken: entry.spoken,
            updatedAt: entry.createdAt
        };
        saveHistory(data);
    }

    function showHistoryModal() {
        state.lastFocusedElement = document.activeElement;
        const data = loadHistory();
        const items = config.items.map(function (item) {
            return {
                config: item,
                history: data[item.id] || null
            };
        });

        refs.historyContent.innerHTML = items.map(function (item) {
            if (!item.history) {
                return [
                    '<div class="sp-history-item mt-3">',
                    '  <p class="text-sm font-black text-slate-800 m-0">' + escapeHtml(item.config.scene) + '</p>',
                    '  <p class="sp-history-meta mt-2 mb-0">아직 저장된 시도가 없습니다.</p>',
                    '</div>'
                ].join('');
            }

            return [
                '<div class="sp-history-item mt-3">',
                '  <div class="flex items-start justify-between gap-3">',
                '    <div>',
                '      <p class="text-sm font-black text-slate-800 m-0">' + escapeHtml(item.history.scene) + '</p>',
                '      <p class="sp-history-meta mt-2 mb-0">최고 점수 ' + item.history.best + '점 · 총 ' + item.history.attempts + '회</p>',
                '      <p class="sp-history-meta mt-1 mb-0 safe"><b>최근 인식:</b> ' + escapeHtml(item.history.lastSpoken || '') + '</p>',
                '    </div>',
                '    <span class="sp-score-pill">' + item.history.best + '점</span>',
                '  </div>',
                '</div>'
            ].join('');
        }).join('');

        refs.historyModal.classList.remove('hidden');
        window.setTimeout(function () {
            (refs.closeHistoryBtn || refs.clearHistoryBtn || refs.historyModal).focus();
        }, 0);
    }

    function closeHistoryModal() {
        refs.historyModal.classList.add('hidden');
        if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
            state.lastFocusedElement.focus();
        }
        state.lastFocusedElement = null;
    }

    function handleModalKeydown(event) {
        if (!refs.historyModal || refs.historyModal.classList.contains('hidden')) {
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            closeHistoryModal();
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }
        const focusable = Array.from(refs.historyModal.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(function (element) {
            return !element.closest('.hidden');
        });
        if (!focusable.length) {
            event.preventDefault();
            refs.historyModal.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function clearHistory() {
        const prompt = state.historyStorageBlocked
            ? '손상되어 읽을 수 없는 기록을 초기화할까요?'
            : '저장된 학습 기록을 모두 지울까요?';
        if (!window.confirm(prompt)) {
            return;
        }
        localStorage.removeItem(storageKey);
        state.historyStorageBlocked = false;
        showHistoryModal();
    }

    function loadHistory() {
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                return {};
            }
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                state.historyStorageBlocked = true;
                return {};
            }
            return parsed;
        } catch (error) {
            state.historyStorageBlocked = true;
            return {};
        }
    }

    function saveHistory(data) {
        if (state.historyStorageBlocked) {
            return;
        }
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            state.historyStorageBlocked = true;
            updateStatus('기록을 저장하지 못했어요. 현재 페이지에서는 계속 연습할 수 있어요.', false);
        }
    }

    function compareSentences(reference, spoken) {
        const cleanReference = normalize(reference);
        const cleanSpoken = normalize(spoken);
        const diff = diffCharacters(cleanReference, cleanSpoken);
        const maxLen = Math.max(cleanReference.length, cleanSpoken.length, 1);
        const accuracyRatio = Math.max(0, 1 - diff.distance / maxLen);
        const completenessRatio = cleanReference.length
            ? Math.min(cleanSpoken.length / cleanReference.length, 1)
            : 1;
        const score = Math.max(0, Math.min(100, Math.round((accuracyRatio * 0.8 + completenessRatio * 0.2) * 100)));

        return {
            distance: diff.distance,
            score: score,
            accuracy: Math.round(accuracyRatio * 100),
            completeness: Math.round(completenessRatio * 100),
            feedback: feedbackFromScore(score),
            targetHtml: diff.targetHtml || escapeHtml(cleanReference),
            spokenHtml: diff.spokenHtml || escapeHtml(cleanSpoken || '(무응답)')
        };
    }

    function diffCharacters(reference, spoken) {
        const rows = reference.length + 1;
        const cols = spoken.length + 1;
        const dp = Array.from({ length: rows }, function () {
            return Array(cols).fill(0);
        });

        for (let row = 0; row < rows; row += 1) {
            dp[row][0] = row;
        }
        for (let col = 0; col < cols; col += 1) {
            dp[0][col] = col;
        }

        for (let row = 1; row < rows; row += 1) {
            for (let col = 1; col < cols; col += 1) {
                const cost = reference[row - 1] === spoken[col - 1] ? 0 : 1;
                dp[row][col] = Math.min(
                    dp[row - 1][col] + 1,
                    dp[row][col - 1] + 1,
                    dp[row - 1][col - 1] + cost
                );
            }
        }

        const targetMarkup = [];
        const spokenMarkup = [];
        let row = reference.length;
        let col = spoken.length;

        while (row > 0 || col > 0) {
            const same = row > 0 && col > 0 && reference[row - 1] === spoken[col - 1];
            if (row > 0 && col > 0 && dp[row][col] === dp[row - 1][col - 1] + (same ? 0 : 1)) {
                if (same) {
                    targetMarkup.unshift('<span class="ch-ok">' + escapeHtml(reference[row - 1]) + '</span>');
                    spokenMarkup.unshift('<span class="ch-ok">' + escapeHtml(spoken[col - 1]) + '</span>');
                } else {
                    targetMarkup.unshift('<span class="ch-err">' + escapeHtml(reference[row - 1]) + '</span>');
                    spokenMarkup.unshift('<span class="ch-ext">' + escapeHtml(spoken[col - 1]) + '</span>');
                }
                row -= 1;
                col -= 1;
                continue;
            }

            if (row > 0 && dp[row][col] === dp[row - 1][col] + 1) {
                targetMarkup.unshift('<span class="ch-err">' + escapeHtml(reference[row - 1]) + '</span>');
                row -= 1;
                continue;
            }

            if (col > 0) {
                spokenMarkup.unshift('<span class="ch-ext">' + escapeHtml(spoken[col - 1]) + '</span>');
                col -= 1;
            }
        }

        return {
            distance: dp[reference.length][spoken.length],
            targetHtml: targetMarkup.join('') || escapeHtml(reference),
            spokenHtml: spokenMarkup.join('') || escapeHtml(spoken || '(무응답)')
        };
    }

    function feedbackFromScore(score) {
        if (score >= 92) {
            return '아주 좋아요. 핵심 표현이 또렷하게 들렸어요.';
        }
        if (score >= 80) {
            return '좋아요. 조금만 더 또박또박 말하면 더 자연스럽게 들릴 거예요.';
        }
        if (score >= 65) {
            return '핵심은 잡혔어요. 모범 답안을 다시 듣고 끊어 읽듯이 말해 보세요.';
        }
        return '한 번 더 해 볼까요? 문장을 짧게 끊어 들은 뒤 그대로 따라 말해 보세요.';
    }

    function chooseMimeType() {
        const candidates = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4'
        ];
        for (let index = 0; index < candidates.length; index += 1) {
            if (MediaRecorder.isTypeSupported(candidates[index])) {
                return candidates[index];
            }
        }
        return '';
    }

    function normalize(text) {
        return String(text || '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[.,!?~"'“”‘’·:;()[\]{}]/g, '');
    }

    function highlightHtml(text, highlights) {
        let html = escapeHtml(text);
        (highlights || []).forEach(function (highlight) {
            if (!highlight) {
                return;
            }
            html = html.replace(
                new RegExp(escapeRegExp(escapeHtml(highlight)), 'g'),
                '<span class="sp-highlight">' + escapeHtml(highlight) + '</span>'
            );
        });
        return html;
    }

    function escapeHtml(text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeRegExp(text) {
        return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function isSecureContextOrLocalhost() {
        return location.protocol === 'https:'
            || location.hostname === 'localhost'
            || location.hostname === '127.0.0.1';
    }
})();
