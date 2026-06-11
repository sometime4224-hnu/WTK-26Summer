(function () {
  "use strict";

  const LOGICAL_WIDTH = 960;
  const LOGICAL_HEIGHT = 600;
  const MAX_ATTEMPTS = 3;
  const WAIT_SECONDS = 12;

  const gates = [
    {
      kind: "어휘 관문",
      prompt: "사과",
      focus: "ㅅ을 또렷하게 말해 보세요.",
      acceptable: ["사과", "사과요"],
      required: ["사과"],
    },
    {
      kind: "어휘 관문",
      prompt: "우유",
      focus: "두 음절을 천천히 이어 말해 보세요.",
      acceptable: ["우유", "우유요"],
      required: ["우유"],
    },
    {
      kind: "어휘 관문",
      prompt: "학교",
      focus: "받침 ㄱ 뒤의 ㄱ 소리에 집중해요.",
      acceptable: ["학교"],
      required: ["학교"],
    },
    {
      kind: "어휘 관문",
      prompt: "친구",
      focus: "첫소리 ㅊ을 분명하게 말해요.",
      acceptable: ["친구", "친구요"],
      required: ["친구"],
    },
    {
      kind: "발음 관문",
      prompt: "파도",
      focus: "바도가 아니라 파도입니다.",
      acceptable: ["파도"],
      required: ["파도"],
    },
    {
      kind: "발음 관문",
      prompt: "라디오",
      focus: "ㄹ 소리를 가볍게 시작해요.",
      acceptable: ["라디오"],
      required: ["라디오"],
    },
    {
      kind: "문장 관문",
      prompt: "저는 사과를 좋아해요",
      focus: "핵심어는 저는, 사과, 좋아해요입니다.",
      acceptable: ["저는 사과를 좋아해요", "나는 사과를 좋아해요", "사과를 좋아해요"],
      required: ["사과", "좋아"],
    },
    {
      kind: "대화 관문",
      prompt: "김밥 주세요",
      focus: "주문하듯 자연스럽게 말해요.",
      acceptable: ["김밥 주세요", "김밥 하나 주세요", "김밥을 주세요", "저는 김밥 주세요"],
      required: ["김밥"],
    },
  ];

  const state = {
    mode: "practice",
    phase: "setup",
    score: 0,
    streak: 0,
    bestStreak: 0,
    gateIndex: 0,
    approach: 0,
    openAmount: 0,
    heroStep: 0,
    attempt: 1,
    waitLeft: WAIT_SECONDS,
    lastTime: 0,
    raf: 0,
    speechSupported: false,
    results: [],
    currentTranscript: "",
    currentFinal: "",
    lastFeedback: "",
    speechSession: 0,
    demoMode: new URLSearchParams(window.location.search).get("demo") === "1",
    successBurst: 0,
    failPulse: 0,
    scoreFloat: 0,
    scoreFloatText: "",
  };

  const mic = {
    stream: null,
    context: null,
    analyser: null,
    data: null,
    level: 0,
    peak: 0,
    speaking: false,
    animationId: 0,
  };

  const els = {
    setupView: document.getElementById("setupView"),
    gameView: document.getElementById("gameView"),
    resultView: document.getElementById("resultView"),
    setupStatus: document.getElementById("setupStatus"),
    prepareMicButton: document.getElementById("prepareMicButton"),
    startGameButton: document.getElementById("startGameButton"),
    previewCanvas: document.getElementById("previewCanvas"),
    gameCanvas: document.getElementById("gameCanvas"),
    gateCard: document.getElementById("gateCard"),
    gateKind: document.getElementById("gateKind"),
    gatePrompt: document.getElementById("gatePrompt"),
    gateFocus: document.getElementById("gateFocus"),
    attemptLabel: document.getElementById("attemptLabel"),
    timerLabel: document.getElementById("timerLabel"),
    scoreValue: document.getElementById("scoreValue"),
    streakValue: document.getElementById("streakValue"),
    gateCount: document.getElementById("gateCount"),
    speechStatus: document.getElementById("speechStatus"),
    transcriptText: document.getElementById("transcriptText"),
    meterFill: document.getElementById("meterFill"),
    micDot: document.getElementById("micDot"),
    fallbackForm: document.getElementById("fallbackForm"),
    fallbackInput: document.getElementById("fallbackInput"),
    resultTitle: document.getElementById("resultTitle"),
    resultScore: document.getElementById("resultScore"),
    passedCount: document.getElementById("passedCount"),
    practiceCount: document.getElementById("practiceCount"),
    bestStreak: document.getElementById("bestStreak"),
    reviewList: document.getElementById("reviewList"),
    retryButton: document.getElementById("retryButton"),
  };

  const gameCtx = els.gameCanvas.getContext("2d");
  const previewCtx = els.previewCanvas.getContext("2d");
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let activeRecognition = null;
  let recognitionRunning = false;
  let recognitionShouldRun = false;
  let recognitionRestartTimer = 0;
  let recognitionRestartCount = 0;
  let recognitionRestartGateIndex = -1;
  let recognitionPrepareResolver = null;
  let recognitionPrepareTimer = 0;
  const MAX_RESTARTS_PER_GATE = 1;

  function setSetupStatus(text) {
    els.setupStatus.textContent = text;
  }

  function setSpeechStatus(title, detail) {
    els.speechStatus.textContent = title;
    els.transcriptText.textContent = detail || "";
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^0-9a-z가-힣ㄱ-ㅎㅏ-ㅣ]/g, "");
  }

  function levenshtein(a, b) {
    const first = normalize(a);
    const second = normalize(b);
    if (!first && !second) return 0;
    if (!first) return second.length;
    if (!second) return first.length;

    const costs = Array.from({ length: second.length + 1 }, (_, index) => index);
    for (let i = 1; i <= first.length; i += 1) {
      let previous = costs[0];
      costs[0] = i;
      for (let j = 1; j <= second.length; j += 1) {
        const temp = costs[j];
        costs[j] =
          first[i - 1] === second[j - 1]
            ? previous
            : Math.min(previous + 1, costs[j] + 1, costs[j - 1] + 1);
        previous = temp;
      }
    }
    return costs[second.length];
  }

  function similarity(a, b) {
    const first = normalize(a);
    const second = normalize(b);
    const maxLength = Math.max(first.length, second.length, 1);
    return 1 - levenshtein(first, second) / maxLength;
  }

  function evaluateSpeech(gate, spoken) {
    const heard = normalize(spoken);
    if (!heard) return { passed: false, confidence: 0, reason: "아직 들리지 않았습니다." };

    const acceptable = gate.acceptable.map(normalize);
    const exact = acceptable.some((answer) => heard.includes(answer) || answer.includes(heard));
    const requiredHits = gate.required.filter((word) => heard.includes(normalize(word))).length;
    const requiredScore = gate.required.length ? requiredHits / gate.required.length : 0;
    const bestSimilarity = Math.max(...gate.acceptable.map((answer) => similarity(answer, heard)));
    const confidence = Math.round(Math.max(exact ? 1 : 0, requiredScore * 0.82, bestSimilarity * 0.72) * 100);

    return {
      passed: exact || requiredScore >= 1 || confidence >= 72,
      confidence,
      reason: exact || requiredScore >= 1 ? "좋아요. 문이 열립니다." : "조금만 더 또렷하게 말해 볼까요?",
    };
  }

  function createRecognition() {
    if (!Recognition) return null;
    const recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    return recognition;
  }

  function resolveSpeechPreparation(value) {
    if (!recognitionPrepareResolver) return;
    const resolve = recognitionPrepareResolver;
    recognitionPrepareResolver = null;
    window.clearTimeout(recognitionPrepareTimer);
    resolve(value);
  }

  function prepareSpeechRecognition() {
    state.speechSupported = !!Recognition;
    if (!Recognition) {
      els.fallbackForm.hidden = false;
      return Promise.resolve("fallback");
    }

    return new Promise((resolve) => {
      if (recognitionRunning) {
        resolve("ready");
        return;
      }

      recognitionShouldRun = true;
      ensureRecognition();
      recognitionPrepareResolver = resolve;
      window.clearTimeout(recognitionPrepareTimer);
      recognitionPrepareTimer = window.setTimeout(() => {
        if (recognitionRunning) {
          resolveSpeechPreparation("ready");
          return;
        }
        state.speechSupported = false;
        els.fallbackForm.hidden = false;
        recognitionShouldRun = false;
        resolveSpeechPreparation("fallback");
      }, 6000);
      startRecognitionLoop();
    });
  }

  async function prepareMic() {
    if (state.demoMode) {
      state.speechSupported = false;
      els.fallbackForm.hidden = false;
      els.prepareMicButton.hidden = true;
      els.startGameButton.hidden = false;
      setSetupStatus("데모 모드입니다. 입력 보조로 관문을 확인합니다.");
      els.startGameButton.focus();
      return;
    }

    els.prepareMicButton.disabled = true;
    setSetupStatus("마이크와 음성 인식을 준비하는 중입니다.");

    if (!window.isSecureContext) {
      setSetupStatus("마이크는 HTTPS 또는 localhost 환경에서 사용할 수 있습니다.");
      els.prepareMicButton.disabled = false;
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSetupStatus("이 브라우저에서는 마이크 스트림을 사용할 수 없습니다.");
      els.prepareMicButton.disabled = false;
      return;
    }

    try {
      mic.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      mic.context = new AudioContext();
      const source = mic.context.createMediaStreamSource(mic.stream);
      mic.analyser = mic.context.createAnalyser();
      mic.analyser.fftSize = 1024;
      mic.data = new Uint8Array(mic.analyser.fftSize);
      source.connect(mic.analyser);
      updateMicMeter();

      setSetupStatus("음성 인식을 켜는 중입니다. 브라우저 창이 나오면 허용해 주세요.");
      const speechState = await prepareSpeechRecognition();
      if (speechState === "blocked") {
        state.speechSupported = false;
        els.fallbackForm.hidden = false;
        setSetupStatus("마이크는 준비되었습니다. 음성 인식은 입력 보조로 진행합니다.");
      } else if (speechState === "fallback") {
        state.speechSupported = false;
        els.fallbackForm.hidden = false;
        setSetupStatus("마이크는 준비되었습니다. 이 브라우저에서는 입력 보조를 함께 사용합니다.");
      } else {
        setSetupStatus("준비되었습니다. 게임을 시작하세요.");
      }

      els.prepareMicButton.hidden = true;
      els.startGameButton.hidden = false;
      els.startGameButton.focus();
    } catch (error) {
      setSetupStatus("마이크를 사용할 수 없습니다. 브라우저 권한을 확인해 주세요.");
      els.prepareMicButton.disabled = false;
    }
  }

  function updateMicMeter() {
    if (mic.analyser && mic.data) {
      mic.analyser.getByteTimeDomainData(mic.data);
      let sum = 0;
      for (let i = 0; i < mic.data.length; i += 1) {
        const value = (mic.data[i] - 128) / 128;
        sum += value * value;
      }
      mic.level = Math.sqrt(sum / mic.data.length);
      mic.peak = Math.max(mic.peak * 0.94, mic.level);
      mic.speaking = mic.level > 0.045;
      els.meterFill.style.width = `${Math.min(100, Math.round(mic.level * 420))}%`;
      els.micDot.classList.toggle("is-live", !mic.speaking);
      els.micDot.classList.toggle("is-speaking", mic.speaking);
    }
    mic.animationId = window.requestAnimationFrame(updateMicMeter);
  }

  function startGateRecognition() {
    if (!state.speechSupported || !Recognition) {
      els.fallbackForm.hidden = false;
      setSpeechStatus("입력 보조 대기", "음성 인식이 지원되지 않는 브라우저입니다.");
      return;
    }

    if (recognitionRestartGateIndex !== state.gateIndex) {
      recognitionRestartGateIndex = state.gateIndex;
      recognitionRestartCount = 0;
    }

    ensureRecognition();
    startRecognitionLoop();

    if (recognitionRunning) {
      setSpeechStatus("듣는 중", "목표 발음을 말해 보세요.");
    } else {
      setSpeechStatus("음성 인식 준비 중", "잠시 후 목표 발음을 말해 보세요.");
    }
  }

  function ensureRecognition() {
    if (activeRecognition || !state.speechSupported || !Recognition) return;

    activeRecognition = createRecognition();
    activeRecognition.onstart = () => {
      recognitionRunning = true;
      resolveSpeechPreparation("ready");
      if (state.phase === "waiting") {
        setSpeechStatus("듣는 중", "목표 발음을 말해 보세요.");
      }
    };
    activeRecognition.onresult = (event) => {
      if (state.phase !== "waiting") return;
      const gate = gates[state.gateIndex];
      const options = [];
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        for (let j = 0; j < result.length; j += 1) {
          options.push(result[j].transcript);
        }
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      const shown = (finalText || interimText || options[0] || "").trim();
      if (shown) {
        state.currentTranscript = shown;
        setSpeechStatus(finalText ? "확인 중" : "듣는 중", shown);
      }

      const passedOption = options.find((option) => evaluateSpeech(gate, option).passed);
      if (passedOption) {
        passGate(passedOption);
        return;
      }

      if (finalText.trim()) {
        const result = evaluateSpeech(gate, finalText);
        state.currentFinal = finalText;
        if (!result.passed) failAttempt(result.reason, finalText);
      }
    };
    activeRecognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        state.speechSupported = false;
        els.fallbackForm.hidden = false;
        recognitionShouldRun = false;
        resolveSpeechPreparation("blocked");
        setSpeechStatus("입력 보조 대기", "음성 인식 권한이 꺼져 있습니다.");
        return;
      }

      if (state.phase === "waiting") {
        setSpeechStatus("다시 듣는 중", event.error || "음성 인식이 잠시 멈췄습니다.");
      }
    };
    activeRecognition.onend = () => {
      recognitionRunning = false;
      if (!recognitionShouldRun || state.phase !== "waiting") return;
      if (recognitionRestartGateIndex !== state.gateIndex) {
        recognitionRestartGateIndex = state.gateIndex;
        recognitionRestartCount = 0;
      }
      if (recognitionRestartCount >= MAX_RESTARTS_PER_GATE) {
        els.fallbackForm.hidden = false;
        setSpeechStatus("입력 보조 대기", "음성 인식이 반복 종료되어 입력 보조로 진행합니다.");
        return;
      }
      recognitionRestartCount += 1;
      window.clearTimeout(recognitionRestartTimer);
      recognitionRestartTimer = window.setTimeout(startRecognitionLoop, 320);
    };
  }

  function startRecognitionLoop() {
    if (!recognitionShouldRun || recognitionRunning || !activeRecognition) return;
    try {
      activeRecognition.start();
    } catch (error) {
      if (error && error.name === "InvalidStateError") {
        recognitionRunning = true;
        resolveSpeechPreparation("ready");
        return;
      }
      els.fallbackForm.hidden = false;
      resolveSpeechPreparation("fallback");
      setSpeechStatus("입력 보조 대기", "음성 인식 시작이 지연되었습니다.");
    }
  }

  function shutdownRecognition() {
    recognitionShouldRun = false;
    recognitionRunning = false;
    window.clearTimeout(recognitionRestartTimer);
    window.clearTimeout(recognitionPrepareTimer);
    recognitionPrepareResolver = null;
    recognitionRestartCount = 0;
    recognitionRestartGateIndex = -1;
    if (!activeRecognition) return;
    activeRecognition.onstart = null;
    activeRecognition.onresult = null;
    activeRecognition.onerror = null;
    activeRecognition.onend = null;
    try {
      activeRecognition.stop();
    } catch (error) {
      // The recognizer may already be stopped.
    }
    activeRecognition = null;
  }

  function updateHud() {
    els.scoreValue.textContent = String(state.score);
    els.streakValue.textContent = String(state.streak);
    els.gateCount.textContent = `${Math.min(state.gateIndex + 1, gates.length)} / ${gates.length}`;
  }

  function setGateCardVisible(visible) {
    els.gateCard.classList.toggle("is-visible", visible);
  }

  function showCurrentGate() {
    const gate = gates[state.gateIndex];
    els.gateKind.textContent = gate.kind;
    els.gatePrompt.textContent = gate.prompt;
    els.gateFocus.textContent = gate.focus;
    els.attemptLabel.textContent = `시도 ${state.attempt} / ${MAX_ATTEMPTS}`;
    els.timerLabel.textContent = `${Math.ceil(state.waitLeft)}초`;
    setGateCardVisible(true);
  }

  function startGame() {
    if (mic.context && mic.context.state === "suspended") {
      mic.context.resume();
    }

    if (state.speechSupported && Recognition) {
      recognitionShouldRun = true;
      ensureRecognition();
      startRecognitionLoop();
    }
    state.phase = "playing";
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.gateIndex = 0;
    state.approach = 0;
    state.openAmount = 0;
    state.heroStep = 0;
    state.attempt = 1;
    state.waitLeft = WAIT_SECONDS;
    state.results = [];
    state.currentTranscript = "";
    state.currentFinal = "";
    state.lastFeedback = "";
    state.successBurst = 0;
    state.failPulse = 0;
    state.scoreFloat = 0;
    state.scoreFloatText = "";

    els.setupView.hidden = true;
    els.resultView.hidden = true;
    els.gameView.hidden = false;
    setGateCardVisible(false);
    els.fallbackInput.value = "";
    setSpeechStatus("출발합니다.", "관문 앞에서 자동으로 듣습니다.");
    updateHud();
    resizeCanvas(els.gameCanvas, gameCtx, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    state.lastTime = performance.now();
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(loop);
  }

  function enterGate() {
    state.phase = "waiting";
    state.waitLeft = WAIT_SECONDS;
    state.currentTranscript = "";
    state.currentFinal = "";
    state.lastFeedback = "";
    showCurrentGate();
    setSpeechStatus("듣는 중", "목표 발음을 말해 보세요.");
    startGateRecognition();
  }

  function passGate(spoken) {
    if (state.phase !== "waiting") return;
    const gate = gates[state.gateIndex];
    const result = evaluateSpeech(gate, spoken);
    const earned = 100 + Math.max(0, MAX_ATTEMPTS - state.attempt) * 25 + state.streak * 10;
    state.phase = "success";
    state.openAmount = 0;
    state.successBurst = 1;
    state.scoreFloat = 1;
    state.scoreFloatText = `+${earned}`;
    state.score += earned;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.results.push({
      prompt: gate.prompt,
      kind: gate.kind,
      passed: true,
      helped: false,
      attempts: state.attempt,
      transcript: spoken,
      confidence: result.confidence,
    });
    updateHud();
    setSpeechStatus("통과", `${spoken.trim()} · ${result.confidence}점`);
    els.gateFocus.textContent = "문이 열립니다.";
  }

  function failAttempt(message, spoken) {
    if (state.phase !== "waiting") return;
    state.lastFeedback = message;
    state.currentFinal = spoken || "";
    state.streak = 0;
    updateHud();

    if (state.mode === "practice" && state.attempt >= MAX_ATTEMPTS) {
      helpPassGate(spoken);
      return;
    }

    state.phase = "retry";
    state.failPulse = 1;
    setSpeechStatus("다시 시도", spoken ? `${spoken} · ${message}` : message);
    els.gateFocus.textContent = message;

    window.setTimeout(() => {
      if (state.phase !== "retry") return;
      state.attempt = Math.min(MAX_ATTEMPTS, state.attempt + 1);
      enterGate();
    }, 1100);
  }

  function helpPassGate(spoken) {
    const gate = gates[state.gateIndex];
    state.phase = "success";
    state.openAmount = 0;
    state.successBurst = 0.72;
    state.scoreFloat = 1;
    state.scoreFloatText = "연습";
    state.results.push({
      prompt: gate.prompt,
      kind: gate.kind,
      passed: false,
      helped: true,
      attempts: state.attempt,
      transcript: spoken || state.currentTranscript,
      confidence: 0,
    });
    setSpeechStatus("도움 통과", `${gate.prompt} · 다음 관문으로 갑니다.`);
    els.gateFocus.textContent = "연습 기록에 남겼습니다.";
  }

  function nextGate() {
    state.gateIndex += 1;
    state.approach = 0;
    state.openAmount = 0;
    state.attempt = 1;
    state.waitLeft = WAIT_SECONDS;
    state.currentTranscript = "";
    state.currentFinal = "";
    state.failPulse = 0;
    state.successBurst = 0;
    state.scoreFloat = 0;
    setGateCardVisible(false);

    if (state.gateIndex >= gates.length) {
      finishGame();
      return;
    }

    state.phase = "playing";
    setSpeechStatus("다음 관문", "앞으로 이동합니다.");
    updateHud();
  }

  function finishGame() {
    cancelAnimationFrame(state.raf);
    shutdownRecognition();
    state.phase = "result";
    els.gameView.hidden = true;
    els.resultView.hidden = false;

    const passed = state.results.filter((item) => item.passed).length;
    const helped = state.results.filter((item) => item.helped || !item.passed).length;
    els.resultTitle.textContent = passed === gates.length ? "모든 관문 통과" : "완주 성공";
    els.resultScore.textContent = `${state.score}점`;
    els.passedCount.textContent = `${passed}개`;
    els.practiceCount.textContent = `${helped}개`;
    els.bestStreak.textContent = `${state.bestStreak}`;
    els.reviewList.innerHTML = "";

    state.results.forEach((item) => {
      const row = document.createElement("div");
      row.className = "review-item";
      const left = document.createElement("strong");
      left.textContent = item.prompt;
      const right = document.createElement("span");
      right.textContent = item.passed ? `통과 · ${item.attempts}회` : "다시 연습";
      row.append(left, right);
      els.reviewList.append(row);
    });
  }

  function update(dt) {
    state.heroStep += dt * 7.5;
    state.successBurst = Math.max(0, state.successBurst - dt * 0.85);
    state.failPulse = Math.max(0, state.failPulse - dt * 1.55);
    state.scoreFloat = Math.max(0, state.scoreFloat - dt * 0.72);

    if (state.phase === "playing") {
      state.approach += dt * 0.48;
      if (state.approach >= 1) {
        state.approach = 1;
        enterGate();
      }
    } else if (state.phase === "waiting") {
      state.waitLeft -= dt;
      els.timerLabel.textContent = `${Math.max(0, Math.ceil(state.waitLeft))}초`;
      if (state.waitLeft <= 0) {
        failAttempt("시간이 지났습니다.", state.currentTranscript);
      }
    } else if (state.phase === "success") {
      state.openAmount += dt * 1.5;
      if (state.openAmount >= 1.25) {
        nextGate();
      }
    }
  }

  function loop(now) {
    const dt = Math.min(0.08, Math.max(0, (now - state.lastTime) / 1000));
    state.lastTime = now;
    update(dt);
    drawGame(gameCtx, state);
    if (state.phase !== "result") {
      state.raf = requestAnimationFrame(loop);
    }
  }

  function resizeCanvas(canvas, ctx, logicalWidth, logicalHeight) {
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(logicalWidth * ratio);
    canvas.height = Math.round(logicalHeight * ratio);
    canvas.style.aspectRatio = `${logicalWidth} / ${logicalHeight}`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function easeOut(value) {
    const t = clamp(value);
    return 1 - Math.pow(1 - t, 3);
  }

  function drawDiamond(ctx, cx, cy, width, height, fill, stroke, lineWidth = 2) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - height / 2);
    ctx.lineTo(cx + width / 2, cy);
    ctx.lineTo(cx, cy + height / 2);
    ctx.lineTo(cx - width / 2, cy);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function roadCenter(y) {
    return LOGICAL_WIDTH / 2 + (y - 330) * 0.17;
  }

  function drawScene(ctx, progress, openAmount, heroStep, gate, gameState = {}) {
    const phase = gameState.phase || "preview";
    const success = gameState.successBurst || 0;
    const fail = gameState.failPulse || 0;
    const scoreFloat = gameState.scoreFloat || 0;
    const scoreText = gameState.scoreFloatText || "";
    const motion = phase === "playing" || phase === "preview" ? heroStep : progress * 11;
    const visualProgress = phase === "success" ? 1 : progress;

    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    drawSky(ctx, motion);
    drawDistantWorld(ctx, motion);
    drawTileField(ctx, visualProgress, motion);
    drawRoad(ctx, visualProgress, motion, phase);

    const gateY = 112 + visualProgress * 222;
    const gateScale = 0.76 + visualProgress * 0.42;
    const failShake = fail > 0 ? Math.sin(fail * 34) * 8 * fail : 0;
    const gateX = roadCenter(gateY) + failShake;

    drawGateGlow(ctx, gateX, gateY, gateScale, openAmount, success, fail);
    drawGate(ctx, gateX, gateY, gateScale, openAmount, gate, phase, fail);
    drawSuccessEffects(ctx, gateX, gateY, gateScale, openAmount, success, motion);
    drawHero(ctx, LOGICAL_WIDTH / 2 - 34, 488, heroStep, visualProgress, phase, openAmount, success, fail);
    drawFloatingScore(ctx, gateX, gateY, scoreFloat, scoreText);
    drawForeground(ctx, phase, success, fail);
  }

  function drawSky(ctx, motion) {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    sky.addColorStop(0, "#8fcdd7");
    sky.addColorStop(0.38, "#d8eac7");
    sky.addColorStop(1, "#7aa76f");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    ctx.fillStyle = "rgba(255, 255, 255, 0.36)";
    for (let i = 0; i < 4; i += 1) {
      const x = ((i * 290 - motion * 6) % 1180) - 110;
      const y = 60 + (i % 2) * 36;
      ctx.beginPath();
      ctx.ellipse(x, y, 116, 28, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 78, y + 10, 88, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawDistantWorld(ctx, motion) {
    ctx.fillStyle = "rgba(68, 113, 122, 0.18)";
    ctx.fillRect(0, 225, LOGICAL_WIDTH, 12);

    ctx.fillStyle = "rgba(255, 246, 209, 0.28)";
    ctx.beginPath();
    ctx.moveTo(0, 270);
    ctx.lineTo(160, 184);
    ctx.lineTo(302, 270);
    ctx.lineTo(430, 196);
    ctx.lineTo(620, 270);
    ctx.lineTo(770, 178);
    ctx.lineTo(960, 270);
    ctx.lineTo(960, 360);
    ctx.lineTo(0, 360);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(82, 138, 87, 0.52)";
    ctx.beginPath();
    ctx.moveTo(0, 306);
    ctx.bezierCurveTo(170, 210, 282, 292, 428, 218);
    ctx.bezierCurveTo(600, 130, 724, 250, 960, 190);
    ctx.lineTo(960, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    const mist = ctx.createLinearGradient(0, 210, 0, 352);
    mist.addColorStop(0, "rgba(255,255,255,0.28)");
    mist.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = mist;
    ctx.fillRect(0, 210 + Math.sin(motion * 0.16) * 3, LOGICAL_WIDTH, 150);
  }

  function drawTileField(ctx, progress, motion) {
    const offset = (motion * 22 + progress * 54) % 74;
    for (let row = -3; row < 11; row += 1) {
      const y = 142 + row * 74 + offset;
      const depth = clamp((y - 120) / 520, 0.18, 1);
      for (let col = -6; col < 8; col += 1) {
        const x = roadCenter(y) + col * 128 - 60;
        const alpha = 0.18 + depth * 0.22;
        const fill = (row + col) % 2 === 0
          ? `rgba(232, 228, 174, ${alpha})`
          : `rgba(170, 211, 150, ${alpha})`;
        drawDiamond(ctx, x, y, 128 * depth, 54 * depth, fill, "rgba(255,255,255,0.18)", 1.4);
      }
    }
  }

  function drawRoad(ctx, progress, motion, phase) {
    const moving = phase === "playing" || phase === "preview";
    const offset = ((moving ? motion * 46 : progress * 80) % 94);

    for (let row = -2; row < 9; row += 1) {
      const y = 124 + row * 94 + offset;
      const scale = 0.58 + y / 760;
      const x = roadCenter(y);
      const width = 280 * scale;
      const height = 82 * scale;
      const fill = row % 2 === 0 ? "#f1d98d" : "#e5c778";

      ctx.fillStyle = "rgba(35, 46, 36, 0.13)";
      ctx.beginPath();
      ctx.ellipse(x + 6, y + height * 0.42, width * 0.55, height * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      drawDiamond(ctx, x, y, width, height, fill, "rgba(120, 92, 44, 0.24)", 2.4 * scale);

      ctx.save();
      ctx.globalAlpha = 0.36;
      ctx.strokeStyle = "#fff6cc";
      ctx.lineWidth = Math.max(3, 8 * scale);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y - height * 0.31);
      ctx.lineTo(x, y + height * 0.31);
      ctx.stroke();
      ctx.restore();
    }

    const rail = ctx.createLinearGradient(0, 260, 0, 600);
    rail.addColorStop(0, "rgba(81, 80, 53, 0)");
    rail.addColorStop(1, "rgba(81, 80, 53, 0.16)");
    ctx.fillStyle = rail;
    ctx.beginPath();
    ctx.moveTo(roadCenter(204) - 120, 204);
    ctx.lineTo(roadCenter(590) - 250, 600);
    ctx.lineTo(roadCenter(590) + 250, 600);
    ctx.lineTo(roadCenter(204) + 120, 204);
    ctx.closePath();
    ctx.fill();
  }

  function drawGateGlow(ctx, x, y, scale, openAmount, success, fail) {
    const open = easeOut(openAmount);
    const glowAlpha = 0.18 + open * 0.5 + success * 0.45;
    const gradient = ctx.createRadialGradient(x, y + 22 * scale, 10, x, y + 22 * scale, 180 * scale);
    gradient.addColorStop(0, `rgba(255, 244, 172, ${glowAlpha})`);
    gradient.addColorStop(0.56, `rgba(242, 188, 89, ${glowAlpha * 0.22})`);
    gradient.addColorStop(1, "rgba(242, 188, 89, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y + 20 * scale, 190 * scale, 0, Math.PI * 2);
    ctx.fill();

    if (fail > 0) {
      ctx.strokeStyle = `rgba(223, 83, 68, ${0.48 * fail})`;
      ctx.lineWidth = 8 * scale;
      ctx.beginPath();
      ctx.arc(x, y + 20 * scale, 136 * scale + fail * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawGate(ctx, x, y, scale, openAmount, gate, phase, fail) {
    const width = 268 * scale;
    const height = 178 * scale;
    const baseY = y + 70 * scale;
    const open = easeOut(openAmount) * 72 * scale;
    const postW = 26 * scale;
    const signH = 46 * scale;

    ctx.save();
    ctx.fillStyle = "rgba(24, 33, 44, 0.2)";
    ctx.beginPath();
    ctx.ellipse(x + 8 * scale, baseY + 12 * scale, width * 0.64, 20 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    const postGradient = ctx.createLinearGradient(x - width / 2, 0, x - width / 2 + postW, 0);
    postGradient.addColorStop(0, "#6f4d33");
    postGradient.addColorStop(0.42, "#9b7046");
    postGradient.addColorStop(1, "#5d3c28");
    ctx.fillStyle = postGradient;
    roundRect(ctx, x - width / 2, baseY - height, postW, height, 8 * scale);
    roundRect(ctx, x + width / 2 - postW, baseY - height, postW, height, 8 * scale);

    ctx.fillStyle = "rgba(64, 43, 28, 0.16)";
    roundRect(ctx, x - width / 2 + 6 * scale, baseY - height + 8 * scale, 8 * scale, height - 16 * scale, 4 * scale);
    roundRect(ctx, x + width / 2 - postW + 6 * scale, baseY - height + 8 * scale, 8 * scale, height - 16 * scale, 4 * scale);

    ctx.fillStyle = "#dd6b53";
    roundRect(ctx, x - width / 2 + postW - 5 * scale, baseY - height + 10 * scale, width - postW * 2 + 10 * scale, signH, 10 * scale);
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    roundRect(ctx, x - width / 2 + postW + 2 * scale, baseY - height + 15 * scale, width - postW * 2 - 4 * scale, 10 * scale, 5 * scale);

    const doorY = baseY - height + signH + 12 * scale;
    const doorH = height - signH - 16 * scale;
    const doorW = 82 * scale;
    drawDoor(ctx, x - doorW - 6 * scale - open, doorY, doorW, doorH, scale, false);
    drawDoor(ctx, x + 6 * scale + open, doorY, doorW, doorH, scale, true);

    ctx.fillStyle = "#16202b";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.max(22, 30 * scale)}px "Malgun Gothic", sans-serif`;
    ctx.fillText(gate ? gate.prompt : "사과", x, baseY - height + 34 * scale);

    const tagText = phase === "waiting" ? "말하면 열립니다" : phase === "retry" ? "다시 도전" : phase === "success" ? "통과" : "다가가는 중";
    ctx.font = `800 ${Math.max(10, 12 * scale)}px "Malgun Gothic", sans-serif`;
    ctx.fillStyle = fail > 0 ? "#b9342c" : "rgba(22, 32, 43, 0.62)";
    ctx.fillText(tagText, x, baseY - height + 62 * scale);
    ctx.restore();
  }

  function drawDoor(ctx, x, y, width, height, scale, flipped) {
    ctx.save();
    if (flipped) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }

    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, "#fffdf1");
    gradient.addColorStop(0.62, "#fff3ce");
    gradient.addColorStop(1, "#e4ca8b");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(121, 92, 44, 0.34)";
    ctx.lineWidth = 3 * scale;
    roundRect(ctx, x, y, width, height, 10 * scale, true);

    ctx.fillStyle = "rgba(255, 255, 255, 0.46)";
    roundRect(ctx, x + 10 * scale, y + 10 * scale, width - 22 * scale, 16 * scale, 6 * scale);
    ctx.fillStyle = "#bb8745";
    ctx.beginPath();
    ctx.arc(x + width - 18 * scale, y + height * 0.54, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSuccessEffects(ctx, x, y, scale, openAmount, success, motion) {
    const open = easeOut(openAmount);
    if (open <= 0.02 && success <= 0.02) return;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 22; i += 1) {
      const angle = i * 0.74 + motion * 0.42;
      const radius = (58 + i * 2.5 + open * 42) * scale;
      const alpha = (open * 0.34 + success * 0.48) * (0.55 + Math.sin(motion + i) * 0.35);
      ctx.fillStyle = `rgba(255, 239, 150, ${clamp(alpha, 0, 0.82)})`;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle) * radius, y + 12 * scale + Math.sin(angle) * radius * 0.58, (3 + (i % 4)) * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = `rgba(255, 246, 177, ${0.42 * success})`;
    ctx.lineWidth = 6 * scale;
    ctx.beginPath();
    ctx.arc(x, y + 18 * scale, (120 + (1 - success) * 90) * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawHero(ctx, x, y, step, progress, phase, openAmount, success, fail) {
    const pass = phase === "success" ? easeOut((openAmount - 0.42) / 0.82) : 0;
    const waitPose = phase === "waiting" ? 1 : 0;
    const bob = Math.sin(step) * (phase === "waiting" ? 2 : 5);
    const legSwing = Math.sin(step) * (phase === "waiting" ? 0.5 : 1);
    const armSwing = Math.sin(step + Math.PI) * (phase === "waiting" ? 0.4 : 1);
    const shake = fail > 0 ? Math.sin(fail * 30) * 6 * fail : 0;
    const hx = x + pass * 175 + shake;
    const hy = y - pass * 84 + bob;
    const scale = 1 - pass * 0.08 + success * 0.03;

    ctx.save();
    ctx.translate(hx, hy);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(24, 33, 44, 0.22)";
    ctx.beginPath();
    ctx.ellipse(42, 66, 46, 13, -0.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#163752";
    ctx.beginPath();
    ctx.moveTo(25, 42);
    ctx.lineTo(10 - legSwing * 9, 66);
    ctx.moveTo(56, 42);
    ctx.lineTo(74 + legSwing * 9, 66);
    ctx.stroke();

    const bodyGradient = ctx.createLinearGradient(14, 4, 68, 58);
    bodyGradient.addColorStop(0, "#3390c4");
    bodyGradient.addColorStop(1, "#1f5f91");
    ctx.fillStyle = bodyGradient;
    roundRect(ctx, 14, 0, 58, 52, 17);

    ctx.strokeStyle = "#f4c49a";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(16, 14);
    ctx.lineTo(-4 - armSwing * 8, 30 + waitPose * 4);
    ctx.moveTo(70, 14);
    ctx.lineTo(88 + armSwing * 8, 30 + waitPose * 4);
    ctx.stroke();

    ctx.fillStyle = "#f5c293";
    ctx.beginPath();
    ctx.arc(42, -22, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#34221d";
    ctx.beginPath();
    ctx.ellipse(42, -43, 27, 12, -0.02, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#101821";
    ctx.fillRect(30, -24, 5, 7);
    ctx.fillRect(50, -24, 5, 7);
    ctx.strokeStyle = phase === "retry" ? "#9d4437" : "#b75d4a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (phase === "retry") {
      ctx.moveTo(35, -8);
      ctx.lineTo(52, -8);
    } else {
      ctx.arc(42, -11, 10, 0.15, Math.PI - 0.15);
    }
    ctx.stroke();

    if (phase === "waiting") {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      roundRect(ctx, 72, -62, 56, 28, 8);
      ctx.fillStyle = "#2f6f9f";
      ctx.font = '900 13px "Malgun Gothic", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("듣는 중", 100, -48);
    }

    ctx.restore();
  }

  function drawFloatingScore(ctx, x, y, scoreFloat, text) {
    if (!scoreFloat || !text) return;
    const p = 1 - scoreFloat;
    ctx.save();
    ctx.globalAlpha = clamp(scoreFloat * 1.4, 0, 1);
    ctx.translate(x, y - 92 - p * 70);
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    roundRect(ctx, -54, -24, 108, 46, 8);
    ctx.fillStyle = "#dd6b53";
    ctx.font = '900 26px "Malgun Gothic", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function drawForeground(ctx, phase, success, fail) {
    const vignette = ctx.createRadialGradient(LOGICAL_WIDTH / 2, 300, 160, LOGICAL_WIDTH / 2, 300, 620);
    vignette.addColorStop(0, "rgba(255,255,255,0)");
    vignette.addColorStop(1, "rgba(20,40,46,0.14)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    if (phase === "waiting") {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    }

    if (success > 0) {
      ctx.fillStyle = `rgba(255, 244, 188, ${0.12 * success})`;
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    }

    if (fail > 0) {
      ctx.fillStyle = `rgba(223, 83, 68, ${0.08 * fail})`;
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    }
  }

  function roundRect(ctx, x, y, width, height, radius, shouldStroke) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
    if (shouldStroke) ctx.stroke();
  }

  function drawGame(ctx, gameState) {
    const gate = gates[Math.min(gameState.gateIndex, gates.length - 1)];
    const progress = gameState.phase === "waiting" || gameState.phase === "retry" || gameState.phase === "success"
      ? 1
      : gameState.approach;
    drawScene(ctx, progress, gameState.openAmount, gameState.heroStep, gate, gameState);
  }

  function drawPreview() {
    resizeCanvas(els.previewCanvas, previewCtx, 520, 420);
    let frame = 0;

    function paint() {
      const previewState = {
        approach: 0.62 + Math.sin(frame / 80) * 0.18,
        openAmount: Math.max(0, Math.sin(frame / 90) - 0.2),
        heroStep: frame / 8,
        phase: "preview",
        successBurst: Math.max(0, Math.sin(frame / 90) - 0.2),
        failPulse: 0,
        scoreFloat: 0,
      };

      previewCtx.save();
      previewCtx.scale(520 / LOGICAL_WIDTH, 420 / LOGICAL_HEIGHT);
      drawScene(previewCtx, previewState.approach, previewState.openAmount, previewState.heroStep, gates[0], previewState);
      previewCtx.restore();
      frame += 1;
      requestAnimationFrame(paint);
    }

    paint();
  }

  function handleFallbackSubmit(event) {
    event.preventDefault();
    const value = els.fallbackInput.value.trim();
    if (!value || state.phase !== "waiting") return;
    const gate = gates[state.gateIndex];
    const result = evaluateSpeech(gate, value);
    els.fallbackInput.value = "";
    if (result.passed) {
      passGate(value);
    } else {
      failAttempt(result.reason, value);
    }
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll(".mode-button").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.mode === mode);
    });
  }

  els.prepareMicButton.addEventListener("click", prepareMic);
  els.startGameButton.addEventListener("click", startGame);
  els.retryButton.addEventListener("click", () => {
    els.resultView.hidden = true;
    els.setupView.hidden = false;
    if (mic.stream) {
      els.prepareMicButton.hidden = true;
      els.startGameButton.hidden = false;
      setSetupStatus("준비되었습니다. 게임을 시작하세요.");
    }
  });
  els.fallbackForm.addEventListener("submit", handleFallbackSubmit);
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  window.addEventListener("resize", () => {
    if (!els.gameView.hidden) {
      resizeCanvas(els.gameCanvas, gameCtx, LOGICAL_WIDTH, LOGICAL_HEIGHT);
      drawGame(gameCtx, state);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      shutdownRecognition();
    } else if (state.phase === "waiting") {
      recognitionShouldRun = true;
      startGateRecognition();
    }
  });

  if (state.demoMode) {
    els.prepareMicButton.textContent = "데모 시작";
  }

  drawPreview();
})();
