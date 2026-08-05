export function recordingControlState(recorderState, keywordCount, canStartRecording = true) {
  return {
    startDisabled: !canStartRecording || keywordCount !== 3 || !["idle", "saved", "error"].includes(recorderState),
    stopDisabled: recorderState !== "recording"
  };
}

export class SpeakingRecorder {
  constructor({ onState, onSaved, onError }) {
    this.onState = onState;
    this.onSaved = onSaved;
    this.onError = onError;
    this.state = "idle";
    this.stream = null;
    this.recorder = null;
    this.parts = [];
    this.stoppedStreams = new WeakSet();
    this.operation = 0;
    this.failed = false;
  }

  setState(state, detail = {}) { this.state = state; this.onState?.(state, detail); }
  isCurrent(token) { return token === this.operation; }
  stopTracks(stream = this.stream) {
    if (stream && !this.stoppedStreams.has(stream)) {
      stream.getTracks().forEach((track) => track.stop());
      this.stoppedStreams.add(stream);
    }
    if (stream === this.stream) this.stream = null;
  }
  fail(error, { notify = true } = {}) {
    this.failed = true;
    this.stopTracks();
    this.setState("error", { error });
    if (notify) this.onError?.(error);
  }
  invalidateRequest() {
    this.operation += 1;
    this.failed = true;
    this.stopTracks();
    if (this.state === "requesting" || this.state === "stopping") this.setState("idle");
  }

  async start() {
    if (["requesting", "recording", "stopping", "persisting"].includes(this.state)) return false;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      this.fail(new Error("이 브라우저에서는 녹음할 수 없어요."));
      return false;
    }
    const token = ++this.operation;
    this.failed = false;
    this.setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!this.isCurrent(token) || this.state !== "requesting") { this.stopTracks(stream); return false; }
      const operationStream = stream;
      const operationRecorder = new MediaRecorder(operationStream);
      const parts = [];
      const started = Date.now();
      this.stream = operationStream;
      this.recorder = operationRecorder;
      operationRecorder.ondataavailable = (event) => { if (this.isCurrent(token) && event.data.size) parts.push(event.data); };
      operationRecorder.onerror = (event) => { if (this.isCurrent(token)) this.fail(event.error ?? new Error("녹음 중 문제가 생겼어요.")); };
      operationRecorder.onstop = async () => {
        if (!this.isCurrent(token) || this.failed) { this.stopTracks(operationStream); return; }
        const blob = new Blob(parts, { type: operationRecorder.mimeType || "audio/webm" });
        this.stopTracks(operationStream);
        if (!blob.size) { this.fail(new Error("녹음된 소리가 없어요.")); return; }
        this.setState("persisting");
        try {
          const result = await this.onSaved?.({ blob, mimeType: blob.type, durationMs: Date.now() - started });
          if (!this.isCurrent(token)) return;
          if (result?.ok === false) { this.fail(new Error("녹음 저장에 실패했어요."), { notify: false }); return; }
          this.setState("saved");
        } catch (error) {
          if (this.isCurrent(token)) this.fail(error, { notify: false });
        }
      };
      operationRecorder.start();
      this.setState("recording");
      return true;
    } catch (error) {
      if (this.isCurrent(token)) this.fail(error);
      return false;
    }
  }

  stop() {
    if (this.state !== "recording" || !this.recorder) return;
    this.setState("stopping");
    try { this.recorder.stop(); } catch (error) { this.fail(error); }
  }
  stopForHide() { if (this.state === "requesting" || this.state === "stopping") this.invalidateRequest(); else this.stop(); }
  dispose() { if (this.state === "requesting" || this.state === "stopping") this.invalidateRequest(); else if (this.state === "recording") this.stop(); else if (this.state !== "persisting") this.stopTracks(); }
}
