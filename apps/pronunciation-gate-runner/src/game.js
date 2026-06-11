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
  let recognitionPrepareResolver = null;
  let recognitionPrepareTimer = 0;

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
      if (!recognitionShouldRun || state.phase === "result") return;
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
    state.phase = "success";
    state.openAmount = 0;
    state.score += 100 + Math.max(0, MAX_ATTEMPTS - state.attempt) * 25 + state.streak * 10;
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

  function drawDiamond(ctx, cx, cy, width, height, fill, stroke) {
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
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function roadCenter(y) {
    return LOGICAL_WIDTH / 2 + (y - 330) * 0.19;
  }

  function drawScene(ctx, progress, openAmount, heroStep, gate) {
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    sky.addColorStop(0, "#b9d9df");
    sky.addColorStop(0.48, "#dcebc7");
    sky.addColorStop(1, "#8fb87e");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    drawHills(ctx);
    drawTileField(ctx, progress);
    drawRoad(ctx, progress);

    const gateY = 146 + progress * 210;
    const gateX = roadCenter(gateY);
    const gateScale = 0.72 + progress * 0.34;
    drawGate(ctx, gateX, gateY, gateScale, openAmount, gate);
    drawHero(ctx, LOGICAL_WIDTH / 2 - 38, 474, heroStep, progress);
  }

  function drawHills(ctx) {
    ctx.fillStyle = "rgba(108, 154, 95, 0.52)";
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.bezierCurveTo(170, 160, 290, 238, 430, 180);
    ctx.bezierCurveTo(570, 120, 680, 210, 960, 142);
    ctx.lineTo(960, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(46, 107, 153, 0.16)";
    ctx.fillRect(0, 236, 960, 10);
  }

  function drawTileField(ctx, progress) {
    const offset = (progress * 76) % 76;
    for (let row = -2; row < 10; row += 1) {
      const y = 166 + row * 76 + offset;
      for (let col = -5; col < 7; col += 1) {
        const x = roadCenter(y) + col * 138 - 52;
        const fill = (row + col) % 2 === 0 ? "rgba(244, 231, 186, 0.42)" : "rgba(180, 210, 150, 0.28)";
        drawDiamond(ctx, x, y, 136, 58, fill, "rgba(255, 255, 255, 0.22)");
      }
    }
  }

  function drawRoad(ctx, progress) {
    const offset = (progress * 92) % 92;
    for (let row = -2; row < 9; row += 1) {
      const y = 146 + row * 92 + offset;
      const scale = 0.62 + y / 920;
      const x = roadCenter(y);
      const fill = row % 2 === 0 ? "#ead8a9" : "#dfc98f";
      drawDiamond(ctx, x, y, 322 * scale, 92 * scale, fill, "rgba(118, 96, 56, 0.2)");
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.fillRect(x - 4, y - 33 * scale, 8, 66 * scale);
    }
  }

  function drawGate(ctx, x, y, scale, openAmount, gate) {
    const width = 226 * scale;
    const height = 142 * scale;
    const postW = 22 * scale;
    const baseY = y + 52 * scale;
    const open = Math.min(openAmount, 1) * 54 * scale;
    const alpha = Math.min(1, Math.max(0.22, scale));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(29, 39, 50, 0.18)";
    ctx.beginPath();
    ctx.ellipse(x, baseY + 10 * scale, width * 0.58, 16 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#875f3a";
    roundRect(ctx, x - width / 2, baseY - height, postW, height, 6 * scale);
    roundRect(ctx, x + width / 2 - postW, baseY - height, postW, height, 6 * scale);

    ctx.fillStyle = "#df6b52";
    roundRect(ctx, x - width / 2 + postW, baseY - height + 12 * scale, width - postW * 2, 32 * scale, 7 * scale);

    ctx.fillStyle = "#fff8e7";
    ctx.strokeStyle = "rgba(23, 32, 42, 0.18)";
    ctx.lineWidth = 2 * scale;
    roundRect(ctx, x - 78 * scale - open, baseY - 92 * scale, 74 * scale, 92 * scale, 5 * scale, true);
    roundRect(ctx, x + 4 * scale + open, baseY - 92 * scale, 74 * scale, 92 * scale, 5 * scale, true);

    ctx.fillStyle = "#17202a";
    ctx.font = `900 ${Math.max(18, 26 * scale)}px "Malgun Gothic", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(gate ? gate.prompt : "사과", x, baseY - height + 28 * scale);
    ctx.restore();
  }

  function drawHero(ctx, x, y, step, progress) {
    const bob = Math.sin(step) * 4;
    const lean = Math.sin(step * 0.5) * 1.5;
    const dash = progress > 0.94 ? (progress - 0.94) * 160 : 0;
    const hx = x + dash;
    const hy = y - dash * 0.42 + bob;

    ctx.fillStyle = "rgba(29, 39, 50, 0.2)";
    ctx.beginPath();
    ctx.ellipse(hx + 6, hy + 64, 38, 10, -0.08, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#21364c";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(hx - 8, hy + 42);
    ctx.lineTo(hx - 24 + lean, hy + 60);
    ctx.moveTo(hx + 12, hy + 42);
    ctx.lineTo(hx + 28 - lean, hy + 60);
    ctx.stroke();

    ctx.fillStyle = "#2e6b99";
    roundRect(ctx, hx - 22, hy + 12, 48, 42, 14);
    ctx.fillStyle = "#f1c59b";
    ctx.beginPath();
    ctx.arc(hx + 2, hy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#17202a";
    ctx.fillRect(hx - 9, hy - 4, 5, 5);
    ctx.fillRect(hx + 9, hy - 4, 5, 5);
    ctx.fillStyle = "#3d2b24";
    ctx.beginPath();
    ctx.ellipse(hx + 1, hy - 20, 23, 10, 0.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#f1c59b";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(hx - 19, hy + 24);
    ctx.lineTo(hx - 38 - lean, hy + 36);
    ctx.moveTo(hx + 25, hy + 24);
    ctx.lineTo(hx + 42 + lean, hy + 34);
    ctx.stroke();
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
    drawScene(ctx, progress, gameState.openAmount, gameState.heroStep, gate);
  }

  function drawPreview() {
    resizeCanvas(els.previewCanvas, previewCtx, 520, 420);
    let frame = 0;

    function paint() {
      const previewState = {
        approach: 0.62 + Math.sin(frame / 80) * 0.18,
        openAmount: Math.max(0, Math.sin(frame / 90) - 0.2),
        heroStep: frame / 8,
      };

      previewCtx.save();
      previewCtx.scale(520 / LOGICAL_WIDTH, 420 / LOGICAL_HEIGHT);
      drawScene(previewCtx, previewState.approach, previewState.openAmount, previewState.heroStep, gates[0]);
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
