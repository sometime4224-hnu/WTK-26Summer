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
    const storageKey = config.storageKey || 'c15-speaking-pro-v1';

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
        sessionScores: [],
        sessionLog: []
    };

    init();

    function init() {
        renderHero();
        bindStaticEvents();
        renderWarnings();
        render();
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
            refs.pageSubtitle.textContent = config.subtitle || '';
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
        }
        if (refs.restartSessionBtn) {
            refs.restartSessionBtn.addEventListener('click', restartSession);
        }
    }

    function renderWarnings() {
        if (refs.browserWarn) {
            refs.browserWarn.classList.toggle('hidden', hasRecognition);
        }
        if (refs.httpsWarn) {
            refs.httpsWarn.classList.toggle('hidden', isSecureContextOrLocalhost() && canRecord);
        }
    }

    function render() {
        cleanupTransientState();
        const total = config.items.length;
        const isDone = state.idx >= total;

        refs.completeBadge.classList.toggle('hidden', !isDone);
        refs.sessionResult.classList.toggle('hidden', !isDone);
        updateProgress(isDone);

        if (isDone) {
            refs.mainArea.innerHTML = '';
            renderSessionSummary();
            window.setTimeout(function () {
                focusGuideStage('summary');
            }, 60);
            return;
        }

        refs.sessionResult.classList.add('hidden');
        state.hasHeardModel = false;
        const item = config.items[state.idx];
        refs.mainArea.innerHTML = buildCompactItemMarkup(item, state.idx === total - 1);
        bindItemEvents();
        updateStatus('마이크를 눌러 문장을 끝까지 따라 말해 보세요.', false);
        window.setTimeout(function () {
            focusGuideStage('listen');
        }, 60);
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
            '        <p class="sp-bubble-label">모범 답안</p>',
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
            '      <p id="statusText" class="text-sm font-semibold text-slate-700 safe m-0">마이크를 눌러 문장을 끝까지 따라 말해 보세요.</p>',
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
            '        <p class="sp-bubble-label">모범 답안</p>',
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
            '        <p id="statusText" class="sp-status-text safe m-0">마이크를 눌러 문장을 끝까지 따라 말해 보세요.</p>',
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
            '      <div id="audioWrap" class="hidden mt-3">',
            '        <p class="sp-bubble-label">녹음 다시 듣기</p>',
            '        <audio id="audioPlayer" class="w-full" controls></audio>',
            '      </div>',
            '    </div>',
            '    <div id="resultWrap" class="hidden sp-result-box"></div>',
            '    <div id="actionRow" class="grid grid-cols-2 gap-2">',
            '      <button id="retryBtn" class="sp-btn sp-btn-ghost" type="button">다시 시도</button>',
            '      <button id="nextBtn" class="sp-btn sp-btn-primary" type="button">' + (isLast ? '결과 보기' : '다음 문장') + '</button>',
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
        const toggleModelBtn = document.getElementById('toggleModelBtn');

        listenBtn.addEventListener('click', function () {
            speakCurrent(1, '모범 답안을 표준 속도로 들려드릴게요.');
        });
        slowBtn.addEventListener('click', function () {
            speakCurrent(0.8, '모범 답안을 천천히 들려드릴게요.');
        });
        recordBtn.addEventListener('click', toggleRecording);
        retryBtn.addEventListener('click', resetAttemptUi);
        nextBtn.addEventListener('click', nextItem);
        toggleModelBtn.addEventListener('click', toggleModelAnswer);
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
        if (state.isRecording) {
            stopRecording();
            return;
        }
        startRecording();
    }

    async function startRecording() {
        if (!canRecord) {
            updateStatus('이 환경에서는 마이크 녹음이 제한됩니다. HTTPS 또는 최신 Chrome에서 다시 시도해 보세요.', false);
            return;
        }

        resetAttemptUi(true);
        state.speechRequestId += 1;
        window.speechSynthesis?.cancel();

        try {
            state.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    channelCount: 1
                }
            });
        } catch (error) {
            updateStatus('마이크를 시작하지 못했어요. 브라우저 권한을 확인해 주세요.', false);
            console.error(error);
            return;
        }

        state.audioChunks = [];
        state.recordingItemId = getCurrentItem() ? getCurrentItem().id : '';
        state.liveTranscript = '';
        state.finalTranscript = '';

        try {
            const mimeType = chooseMimeType();
            state.mediaRecorder = mimeType
                ? new MediaRecorder(state.mediaStream, { mimeType: mimeType })
                : new MediaRecorder(state.mediaStream);
        } catch (error) {
            cleanupMediaStream();
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

        cleanupMediaStream();

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
            return;
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
        } catch (error) {
            console.error(error);
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
        persistHistory(entry);
        renderAttemptResult(entry);
        updateStatus(best.feedback, false);
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
            '<div class="sp-compare-grid mt-3">',
            '  <div class="sp-compare">',
            '    <p class="sp-bubble-label">목표 문장</p>',
            '    <p class="safe">' + entry.targetHtml + '</p>',
            '  </div>',
            '  <div class="sp-compare">',
            '    <p class="sp-bubble-label">인식 문장</p>',
            '    <p class="safe">' + entry.spokenHtml + '</p>',
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
        const attempts = state.sessionScores.length;
        const best = attempts ? Math.max.apply(null, state.sessionScores) : 0;
        const avg = attempts ? Math.round(state.sessionScores.reduce(function (sum, score) {
            return sum + score;
        }, 0) / attempts) : 0;

        refs.resAttempts.textContent = String(attempts);
        refs.resBest.textContent = attempts ? best + '점' : '-';
        refs.resAvg.textContent = attempts ? avg + '점' : '-';

        if (!state.sessionLog.length) {
            refs.logArea.innerHTML = '<div class="sp-log-item"><p class="text-sm text-slate-500 m-0 safe">이번 세션에서는 아직 저장된 말하기 기록이 없습니다. 듣기와 따라 말하기만 해도 괜찮아요.</p></div>';
            return;
        }

        refs.logArea.innerHTML = state.sessionLog.map(function (entry, index) {
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
                '</div>'
            ].join('');
        }).join('');
    }

    function nextItem() {
        if (state.isRecording) {
            stopRecording();
        }
        state.idx += 1;
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
        render();
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
        recordBtnText.textContent = recording ? '정지' : '말하기';
        recordBtn.setAttribute('aria-label', recording ? '말하기 정지' : '말하기 시작');
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

        const audioWrap = document.getElementById('audioWrap');
        const audioPlayer = document.getElementById('audioPlayer');
        if (!audioWrap || !audioPlayer) {
            return;
        }

        audioPlayer.src = state.audioUrl;
        audioWrap.classList.remove('hidden');
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

    function cleanupMediaStream() {
        if (state.mediaStream) {
            state.mediaStream.getTracks().forEach(function (track) {
                track.stop();
            });
            state.mediaStream = null;
        }
    }

    function cleanupTransientState() {
        stopRecognition();
        cleanupMediaStream();
        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
            try {
                state.mediaRecorder.stop();
            } catch (error) {
                console.error(error);
            }
        }
        state.mediaRecorder = null;
        state.isRecording = false;
        state.recordingItemId = '';
        clearAudioPlayer();
    }

    function cleanupAll() {
        cleanupTransientState();
        state.speechRequestId += 1;
        window.speechSynthesis?.cancel();
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

        autoScrollToTarget(stage.scrollTarget, stage.fitIds || []);
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
    }

    function closeHistoryModal() {
        refs.historyModal.classList.add('hidden');
    }

    function clearHistory() {
        if (!window.confirm('저장된 학습 기록을 모두 지울까요?')) {
            return;
        }
        localStorage.removeItem(storageKey);
        showHistoryModal();
    }

    function loadHistory() {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || {};
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    function saveHistory(data) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (error) {
            console.error(error);
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
