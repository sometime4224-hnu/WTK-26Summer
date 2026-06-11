(function () {
  "use strict";

  const WAVE_WIDTH = 560;
  const WAVE_HEIGHT = 170;
  const ASSET_ROOT = "assets/articulation/split/";

  const soundModels = [
    {
      id: "plain",
      letter: "ㄱ",
      syllables: ["가", "고", "구", "기", "개"],
      airflow: 0.38,
      tension: 0.32,
      burst: 0.46,
      release: 0.54,
      voiceDelay: 0.065,
      pitch: 212,
      feedback: ["같은 자리", "부드럽게", "숨 보통"],
      frames: [
        { id: "base-neutral", label: "준비", file: "base-neutral.webp" },
        { id: "velar-contact-highlight", label: "자리", file: "velar-contact-highlight.webp" },
        { id: "airflow-soft-out", label: "숨", file: "airflow-soft-out.webp" },
        { id: "tongue-b-rest-side", label: "마침", file: "tongue-b-rest-side.webp" },
      ],
    },
    {
      id: "aspirated",
      letter: "ㅋ",
      syllables: ["카", "코", "쿠", "키", "캐"],
      airflow: 0.92,
      tension: 0.45,
      burst: 0.72,
      release: 0.9,
      voiceDelay: 0.155,
      pitch: 252,
      feedback: ["같은 자리", "숨 크게", "길게"],
      frames: [
        { id: "velar-contact-highlight", label: "자리", file: "velar-contact-highlight.webp" },
        { id: "air-burst-outside", label: "터짐", file: "air-burst-outside.webp" },
        { id: "aspiration-inside-strong", label: "기식", file: "aspiration-inside-strong.webp" },
        { id: "airflow-strong-out", label: "숨", file: "airflow-strong-out.webp" },
      ],
    },
    {
      id: "tense",
      letter: "ㄲ",
      syllables: ["까", "꼬", "꾸", "끼", "깨"],
      airflow: 0.22,
      tension: 0.92,
      burst: 0.9,
      release: 0.28,
      voiceDelay: 0.028,
      pitch: 250,
      feedback: ["같은 자리", "힘", "짧게"],
      frames: [
        { id: "velar-contact-highlight", label: "자리", file: "velar-contact-highlight.webp" },
        { id: "tongue-b-high-back-emphasis", label: "힘", file: "tongue-b-high-back-emphasis.webp" },
        { id: "vocal-fold-tension-cue", label: "긴장", file: "vocal-fold-tension-cue.webp" },
        { id: "airflow-contact-short", label: "짧게", file: "airflow-contact-short.webp" },
      ],
    },
  ];

  const state = {
    soundId: "plain",
    vowelIndex: 0,
    compare: false,
    slow: false,
    startTime: performance.now(),
    raf: 0,
    stepOverride: null,
    audioContext: null,
    recording: false,
    mediaRecorder: null,
    recordStream: null,
    recordChunks: [],
    liveContext: null,
    liveAnalyser: null,
    liveData: null,
    liveSource: null,
    liveRaf: 0,
    recordingUrl: "",
    recordedSamples: null,
    sampleRate: 44100,
  };

  const els = {
    visualStage: document.getElementById("visualStage"),
    singleView: document.getElementById("singleView"),
    compareView: document.getElementById("compareView"),
    primaryCueImage: document.getElementById("primaryCueImage"),
    primaryBadge: document.getElementById("primaryBadge"),
    stepStrip: document.getElementById("stepStrip"),
    visualTimeline: document.getElementById("visualTimeline"),
    waveCanvas: document.getElementById("waveCanvas"),
    currentSyllable: document.getElementById("currentSyllable"),
    soundButtons: Array.from(document.querySelectorAll(".sound-button")),
    syllableButtons: Array.from(document.querySelectorAll(".syllable-chip")),
    airGauge: document.getElementById("airGauge"),
    tensionGauge: document.getElementById("tensionGauge"),
    burstGauge: document.getElementById("burstGauge"),
    playCueButton: document.getElementById("playCueButton"),
    replayButton: document.getElementById("replayButton"),
    slowButton: document.getElementById("slowButton"),
    compareButton: document.getElementById("compareButton"),
    recordButton: document.getElementById("recordButton"),
    playRecordingButton: document.getElementById("playRecordingButton"),
    clearRecordingButton: document.getElementById("clearRecordingButton"),
    feedbackStrip: document.getElementById("feedbackStrip"),
    voiceAir: document.getElementById("voiceAir"),
    voiceImpact: document.getElementById("voiceImpact"),
    voiceLength: document.getElementById("voiceLength"),
  };

  const waveCtx = els.waveCanvas.getContext("2d");

  function currentModel() {
    return soundModels.find((model) => model.id === state.soundId) || soundModels[0];
  }

  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }

  function assetUrl(file) {
    return ASSET_ROOT + file;
  }

  function resizeCanvas(canvas, ctx, width, height) {
    const ratio = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function cycleProgress(now) {
    const cycle = state.slow ? 5200 : 3200;
    return ((now - state.startTime) % cycle) / cycle;
  }

  function frameIndexFor(model, progress) {
    if (state.stepOverride !== null && !state.compare) return state.stepOverride;
    return Math.min(model.frames.length - 1, Math.floor(progress * model.frames.length));
  }

  function setFeedback(items) {
    els.feedbackStrip.innerHTML = "";
    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      els.feedbackStrip.appendChild(chip);
    });
  }

  function renderStepStrip(model) {
    els.stepStrip.innerHTML = "";
    model.frames.forEach((frame, index) => {
      const button = document.createElement("button");
      button.className = "step-button";
      button.type = "button";
      button.dataset.step = String(index);
      button.innerHTML = `
        <img src="${assetUrl(frame.file)}" alt="">
        <span>${frame.label}</span>
      `;
      button.addEventListener("click", () => {
        state.stepOverride = index;
        renderVisual(performance.now());
      });
      els.stepStrip.appendChild(button);
    });
  }

  function renderCompareView() {
    els.compareView.innerHTML = "";
    soundModels.forEach((model) => {
      const scene = document.createElement("article");
      scene.className = "compare-scene";
      scene.dataset.sound = model.id;
      scene.innerHTML = `
        <strong>${model.letter}</strong>
        <img src="${assetUrl(model.frames[0].file)}" alt="${model.letter} 조음 이미지">
        <div class="compare-mini-bars" aria-hidden="true">
          <span><b style="--value: ${model.airflow}"></b></span>
          <span><b style="--value: ${model.tension}"></b></span>
          <span><b style="--value: ${model.burst}"></b></span>
        </div>
      `;
      els.compareView.appendChild(scene);
    });
  }

  function updateUi() {
    const model = currentModel();
    document.body.dataset.sound = model.id;
    els.currentSyllable.textContent = model.syllables[state.vowelIndex];
    els.primaryBadge.textContent = model.letter;
    els.airGauge.style.width = `${Math.round(model.airflow * 100)}%`;
    els.tensionGauge.style.width = `${Math.round(model.tension * 100)}%`;
    els.burstGauge.style.width = `${Math.round(model.burst * 100)}%`;
    setFeedback(model.feedback);

    els.soundButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.sound === model.id);
    });

    els.syllableButtons.forEach((button) => {
      const index = Number(button.dataset.vowel);
      button.textContent = model.syllables[index];
      button.classList.toggle("is-selected", index === state.vowelIndex);
    });

    renderStepStrip(model);
    renderCompareView();
    renderMode();
  }

  function renderMode() {
    els.singleView.hidden = state.compare;
    els.compareView.hidden = !state.compare;
  }

  function setImageIfNeeded(img, frame, letter) {
    const nextSrc = assetUrl(frame.file);
    if (!img.getAttribute("src").endsWith(frame.file)) img.src = nextSrc;
    img.alt = `${letter} ${frame.label}`;
    img.dataset.frame = frame.id;
  }

  function renderSingle(now) {
    const model = currentModel();
    const progress = cycleProgress(now);
    const index = frameIndexFor(model, progress);
    const frame = model.frames[index];
    setImageIfNeeded(els.primaryCueImage, frame, model.letter);
    els.visualTimeline.style.width = `${Math.round(progress * 100)}%`;

    Array.from(els.stepStrip.children).forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === index);
    });
  }

  function renderCompare(now) {
    const progress = cycleProgress(now);
    els.compareView.querySelectorAll(".compare-scene").forEach((scene) => {
      const model = soundModels.find((item) => item.id === scene.dataset.sound);
      if (!model) return;
      const index = Math.min(model.frames.length - 1, Math.floor(progress * model.frames.length));
      const img = scene.querySelector("img");
      setImageIfNeeded(img, model.frames[index], model.letter);
      scene.classList.toggle("is-active", model.id === state.soundId);
    });
  }

  function renderVisual(now) {
    if (state.compare) renderCompare(now);
    else renderSingle(now);
  }

  function animate(now) {
    if (state.stepOverride === null || state.compare) renderVisual(now);
    state.raf = requestAnimationFrame(animate);
  }

  function resetAnimation() {
    state.startTime = performance.now();
    state.stepOverride = null;
    renderVisual(state.startTime);
  }

  function audioContext() {
    if (!state.audioContext) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return null;
      state.audioContext = new Context();
    }
    if (state.audioContext.state === "suspended") state.audioContext.resume();
    return state.audioContext;
  }

  function makeNoiseBuffer(ctx, seconds) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function playCue() {
    const ctx = audioContext();
    if (!ctx) return;
    const model = currentModel();
    const now = ctx.currentTime + 0.02;
    const burstDuration = 0.035 + model.airflow * 0.1;
    const burstGain = 0.12 + model.burst * 0.28;

    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx, burstDuration);
    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 1100;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(burstGain, now + 0.012);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + burstDuration);
    noise.connect(highpass).connect(noiseGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + burstDuration + 0.02);

    const vowel = ctx.createOscillator();
    const vowelGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    vowel.type = "sawtooth";
    vowel.frequency.setValueAtTime(model.pitch, now + model.voiceDelay);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1100 + model.tension * 360, now);
    vowelGain.gain.setValueAtTime(0.0001, now);
    vowelGain.gain.exponentialRampToValueAtTime(0.12 + model.tension * 0.035, now + model.voiceDelay + 0.03);
    vowelGain.gain.exponentialRampToValueAtTime(0.0001, now + model.voiceDelay + 0.46);
    vowel.connect(filter).connect(vowelGain).connect(ctx.destination);
    vowel.start(now + model.voiceDelay);
    vowel.stop(now + model.voiceDelay + 0.5);

    resetAnimation();
  }

  function drawEmptyWave() {
    resizeCanvas(els.waveCanvas, waveCtx, WAVE_WIDTH, WAVE_HEIGHT);
    waveCtx.fillStyle = "#fff";
    waveCtx.fillRect(0, 0, WAVE_WIDTH, WAVE_HEIGHT);
    waveCtx.strokeStyle = "rgba(24,33,43,0.08)";
    waveCtx.lineWidth = 1;
    for (let x = 0; x < WAVE_WIDTH; x += 28) {
      waveCtx.beginPath();
      waveCtx.moveTo(x, 0);
      waveCtx.lineTo(x, WAVE_HEIGHT);
      waveCtx.stroke();
    }
    waveCtx.strokeStyle = "rgba(24,33,43,0.16)";
    waveCtx.beginPath();
    waveCtx.moveTo(0, WAVE_HEIGHT / 2);
    waveCtx.lineTo(WAVE_WIDTH, WAVE_HEIGHT / 2);
    waveCtx.stroke();
  }

  function drawWaveform(samples) {
    drawEmptyWave();
    if (!samples || !samples.length) return;

    const step = Math.max(1, Math.floor(samples.length / WAVE_WIDTH));
    waveCtx.strokeStyle = "#2d9db4";
    waveCtx.lineWidth = 2;
    waveCtx.beginPath();
    for (let x = 0; x < WAVE_WIDTH; x += 1) {
      let min = 1;
      let max = -1;
      const start = x * step;
      for (let j = 0; j < step && start + j < samples.length; j += 1) {
        const value = samples[start + j];
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
      const y1 = WAVE_HEIGHT / 2 + min * 64;
      const y2 = WAVE_HEIGHT / 2 + max * 64;
      waveCtx.moveTo(x, y1);
      waveCtx.lineTo(x, y2);
    }
    waveCtx.stroke();
  }

  function drawLiveWave() {
    if (!state.recording || !state.liveAnalyser || !state.liveData) return;
    state.liveAnalyser.getByteTimeDomainData(state.liveData);
    drawEmptyWave();
    waveCtx.strokeStyle = "#d65f45";
    waveCtx.lineWidth = 2;
    waveCtx.beginPath();
    for (let i = 0; i < state.liveData.length; i += 1) {
      const x = (i / (state.liveData.length - 1)) * WAVE_WIDTH;
      const y = WAVE_HEIGHT / 2 + ((state.liveData[i] - 128) / 128) * 64;
      if (i === 0) waveCtx.moveTo(x, y);
      else waveCtx.lineTo(x, y);
    }
    waveCtx.stroke();
    state.liveRaf = requestAnimationFrame(drawLiveWave);
  }

  function stopLiveAudio() {
    cancelAnimationFrame(state.liveRaf);
    if (state.liveContext) {
      state.liveContext.close();
      state.liveContext = null;
    }
    state.liveAnalyser = null;
    state.liveData = null;
    state.liveSource = null;
    if (state.recordStream) {
      state.recordStream.getTracks().forEach((track) => track.stop());
      state.recordStream = null;
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setFeedback(["브라우저", "녹음 제한"]);
      return;
    }

    try {
      state.recordStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "";
      state.mediaRecorder = new MediaRecorder(state.recordStream, mimeType ? { mimeType } : undefined);
      state.recordChunks = [];
      state.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size) state.recordChunks.push(event.data);
      };
      state.mediaRecorder.onstop = handleRecordingStop;

      const Context = window.AudioContext || window.webkitAudioContext;
      state.liveContext = new Context();
      state.liveAnalyser = state.liveContext.createAnalyser();
      state.liveAnalyser.fftSize = 1024;
      state.liveData = new Uint8Array(state.liveAnalyser.fftSize);
      state.liveSource = state.liveContext.createMediaStreamSource(state.recordStream);
      state.liveSource.connect(state.liveAnalyser);

      state.recording = true;
      els.recordButton.classList.add("is-recording");
      els.recordButton.textContent = "■";
      els.playRecordingButton.disabled = true;
      els.clearRecordingButton.disabled = true;
      setFeedback(["녹음 중"]);
      state.mediaRecorder.start();
      drawLiveWave();
      window.setTimeout(() => {
        if (state.recording) stopRecording();
      }, 4200);
    } catch (error) {
      setFeedback(["마이크", "권한 확인"]);
      stopLiveAudio();
    }
  }

  function stopRecording() {
    if (!state.recording) return;
    state.recording = false;
    els.recordButton.classList.remove("is-recording");
    els.recordButton.textContent = "●";
    if (state.mediaRecorder && state.mediaRecorder.state !== "inactive") {
      state.mediaRecorder.stop();
    } else {
      stopLiveAudio();
    }
  }

  async function handleRecordingStop() {
    stopLiveAudio();
    const blob = new Blob(state.recordChunks, { type: state.mediaRecorder ? state.mediaRecorder.mimeType : "audio/webm" });
    if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl);
    state.recordingUrl = URL.createObjectURL(blob);
    els.playRecordingButton.disabled = false;
    els.clearRecordingButton.disabled = false;

    try {
      const buffer = await blob.arrayBuffer();
      const ctx = audioContext();
      const decoded = await ctx.decodeAudioData(buffer.slice(0));
      const samples = decoded.getChannelData(0);
      state.sampleRate = decoded.sampleRate;
      state.recordedSamples = samples;
      drawWaveform(samples);
      updateVoiceHints(samples, decoded.sampleRate);
    } catch (error) {
      setFeedback(["파형", "재생 가능"]);
    }
  }

  function updateVoiceHints(samples, sampleRate) {
    let peak = 0;
    for (let i = 0; i < samples.length; i += 1) peak = Math.max(peak, Math.abs(samples[i]));
    const threshold = Math.max(0.018, peak * 0.12);
    let onset = 0;
    while (onset < samples.length && Math.abs(samples[onset]) < threshold) onset += 1;
    let end = samples.length - 1;
    while (end > onset && Math.abs(samples[end]) < threshold) end -= 1;

    const firstWindow = Math.min(samples.length, onset + Math.floor(sampleRate * 0.28));
    let zeroCrossings = 0;
    let previous = samples[onset] || 0;
    for (let i = onset + 1; i < firstWindow; i += 1) {
      const current = samples[i];
      if ((previous <= 0 && current > 0) || (previous >= 0 && current < 0)) zeroCrossings += 1;
      previous = current;
    }
    const zcr = zeroCrossings / Math.max(1, firstWindow - onset);
    const breath = clamp((zcr * sampleRate - 1400) / 3600);
    const impact = clamp(peak * 2.4);
    const length = clamp((end - onset) / sampleRate / 1.2);

    els.voiceAir.style.width = `${Math.round(breath * 100)}%`;
    els.voiceImpact.style.width = `${Math.round(impact * 100)}%`;
    els.voiceLength.style.width = `${Math.round(length * 100)}%`;

    const model = currentModel();
    const hints = [];
    if (model.airflow > 0.72 && breath < 0.42) hints.push("숨 ↑");
    if (model.airflow < 0.35 && breath > 0.62) hints.push("숨 ↓");
    if (model.tension > 0.72 && impact < 0.42) hints.push("힘 ↑");
    if (model.tension < 0.45 && impact > 0.78) hints.push("힘 ↓");
    if (model.release < 0.38 && length > 0.72) hints.push("짧게");
    if (!hints.length) hints.push("다시 보기");
    setFeedback(hints);
  }

  function playRecording() {
    if (!state.recordingUrl) return;
    const audio = new Audio(state.recordingUrl);
    audio.play();
  }

  function clearRecording() {
    if (state.recordingUrl) URL.revokeObjectURL(state.recordingUrl);
    state.recordingUrl = "";
    state.recordedSamples = null;
    els.playRecordingButton.disabled = true;
    els.clearRecordingButton.disabled = true;
    els.voiceAir.style.width = "0%";
    els.voiceImpact.style.width = "0%";
    els.voiceLength.style.width = "0%";
    setFeedback(currentModel().feedback);
    drawEmptyWave();
  }

  function bindEvents() {
    els.soundButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.soundId = button.dataset.sound;
        state.stepOverride = null;
        updateUi();
        resetAnimation();
      });
    });

    els.syllableButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.vowelIndex = Number(button.dataset.vowel);
        updateUi();
      });
    });

    els.playCueButton.addEventListener("click", playCue);
    els.replayButton.addEventListener("click", resetAnimation);
    els.slowButton.addEventListener("click", () => {
      state.slow = !state.slow;
      els.slowButton.setAttribute("aria-pressed", String(state.slow));
      resetAnimation();
    });
    els.compareButton.addEventListener("click", () => {
      state.compare = !state.compare;
      els.compareButton.setAttribute("aria-pressed", String(state.compare));
      state.stepOverride = null;
      renderMode();
      resetAnimation();
    });
    els.recordButton.addEventListener("click", () => {
      if (state.recording) stopRecording();
      else startRecording();
    });
    els.playRecordingButton.addEventListener("click", playRecording);
    els.clearRecordingButton.addEventListener("click", clearRecording);

    window.addEventListener("resize", () => {
      drawEmptyWave();
      if (state.recordedSamples) drawWaveform(state.recordedSamples);
    });
  }

  updateUi();
  bindEvents();
  drawEmptyWave();
  renderVisual(performance.now());
  state.raf = requestAnimationFrame(animate);
})();
