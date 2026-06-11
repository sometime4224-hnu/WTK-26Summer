const canvas = document.querySelector("#warpCanvas");
const ctx = canvas.getContext("2d");
const sourceCanvas = document.createElement("canvas");
const sourceCtx = sourceCanvas.getContext("2d");

const dropZone = document.querySelector("#dropZone");
const brushCursor = document.querySelector("#brushCursor");
const statusText = document.querySelector("#statusText");
const imageInput = document.querySelector("#imageInput");
const uploadButton = document.querySelector("#uploadButton");
const sampleButton = document.querySelector("#sampleButton");
const downloadButton = document.querySelector("#downloadButton");
const resetButton = document.querySelector("#resetButton");
const undoButton = document.querySelector("#undoButton");
const redoButton = document.querySelector("#redoButton");
const radiusInput = document.querySelector("#radiusInput");
const radiusValue = document.querySelector("#radiusValue");
const strengthInput = document.querySelector("#strengthInput");
const strengthValue = document.querySelector("#strengthValue");
const pairPanel = document.querySelector("#pairPanel");
const pairCount = document.querySelector("#pairCount");
const pairAmountInput = document.querySelector("#pairAmountInput");
const pairAmountValue = document.querySelector("#pairAmountValue");
const pairClearButton = document.querySelector("#pairClearButton");
const meshToggle = document.querySelector("#meshToggle");
const toolButtons = Array.from(document.querySelectorAll("[data-tool]"));
const qualityButtons = Array.from(document.querySelectorAll("[data-quality]"));

const MAX_EDGE = 1200;
const HISTORY_LIMIT = 28;

const state = {
  tool: "pull",
  meshStep: 26,
  points: [],
  cols: 0,
  rows: 0,
  dragging: false,
  lastPoint: null,
  frame: 0,
  history: [],
  redo: [],
  pairPoints: [],
  pairBase: null,
  pairHistoryCommitted: false,
  sourceName: "샘플 이미지"
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createSampleImage() {
  const width = 1000;
  const height = 640;
  sourceCanvas.width = width;
  sourceCanvas.height = height;

  const sky = sourceCtx.createLinearGradient(0, 0, width, height);
  sky.addColorStop(0, "#dff3ff");
  sky.addColorStop(0.48, "#f7fbff");
  sky.addColorStop(1, "#eaf7ef");
  sourceCtx.fillStyle = sky;
  sourceCtx.fillRect(0, 0, width, height);

  sourceCtx.fillStyle = "#f6d56f";
  sourceCtx.beginPath();
  sourceCtx.arc(825, 112, 64, 0, Math.PI * 2);
  sourceCtx.fill();

  sourceCtx.fillStyle = "#a7d8a3";
  sourceCtx.beginPath();
  sourceCtx.moveTo(0, 390);
  sourceCtx.bezierCurveTo(210, 285, 420, 450, 610, 340);
  sourceCtx.bezierCurveTo(770, 250, 910, 330, 1000, 288);
  sourceCtx.lineTo(1000, 640);
  sourceCtx.lineTo(0, 640);
  sourceCtx.closePath();
  sourceCtx.fill();

  sourceCtx.fillStyle = "#5fb4d6";
  sourceCtx.beginPath();
  sourceCtx.moveTo(0, 520);
  sourceCtx.bezierCurveTo(250, 465, 428, 562, 640, 512);
  sourceCtx.bezierCurveTo(784, 480, 904, 526, 1000, 490);
  sourceCtx.lineTo(1000, 640);
  sourceCtx.lineTo(0, 640);
  sourceCtx.closePath();
  sourceCtx.fill();

  sourceCtx.fillStyle = "rgba(255, 255, 255, 0.86)";
  drawCloud(170, 112, 1.1);
  drawCloud(470, 82, 0.82);
  drawCloud(680, 166, 0.92);

  drawBall(296, 337, 126, "#f97316", "#2563eb");
  drawBall(548, 290, 100, "#14b8a6", "#be123c");
  drawFace(704, 376, 134);

  sourceCtx.fillStyle = "rgba(23, 32, 51, 0.1)";
  sourceCtx.fillRect(78, 548, 844, 10);
  for (let i = 0; i < 8; i += 1) {
    const x = 94 + i * 106;
    sourceCtx.fillStyle = i % 2 === 0 ? "#ffffff" : "#f97316";
    sourceCtx.fillRect(x, 556, 74, 46);
  }

  setSourceFromCanvas("샘플 이미지");
}

function drawCloud(x, y, scale) {
  sourceCtx.beginPath();
  sourceCtx.arc(x, y, 34 * scale, 0, Math.PI * 2);
  sourceCtx.arc(x + 38 * scale, y - 18 * scale, 42 * scale, 0, Math.PI * 2);
  sourceCtx.arc(x + 82 * scale, y, 32 * scale, 0, Math.PI * 2);
  sourceCtx.rect(x - 5 * scale, y, 104 * scale, 26 * scale);
  sourceCtx.fill();
}

function drawBall(x, y, radius, colorA, colorB) {
  sourceCtx.save();
  sourceCtx.translate(x, y);
  sourceCtx.fillStyle = colorA;
  sourceCtx.beginPath();
  sourceCtx.arc(0, 0, radius, 0, Math.PI * 2);
  sourceCtx.fill();
  sourceCtx.clip();

  sourceCtx.strokeStyle = "rgba(255,255,255,0.9)";
  sourceCtx.lineWidth = 12;
  for (let i = -3; i <= 3; i += 1) {
    sourceCtx.beginPath();
    sourceCtx.arc(i * radius * 0.34, 0, radius * 0.84, 0, Math.PI * 2);
    sourceCtx.stroke();
  }

  sourceCtx.fillStyle = colorB;
  sourceCtx.globalAlpha = 0.72;
  sourceCtx.beginPath();
  sourceCtx.ellipse(radius * 0.2, -radius * 0.15, radius * 0.78, radius * 0.32, -0.58, 0, Math.PI * 2);
  sourceCtx.fill();
  sourceCtx.restore();
}

function drawFace(x, y, radius) {
  sourceCtx.save();
  sourceCtx.translate(x, y);
  sourceCtx.fillStyle = "#ffd8a8";
  sourceCtx.beginPath();
  sourceCtx.arc(0, 0, radius, 0, Math.PI * 2);
  sourceCtx.fill();

  sourceCtx.fillStyle = "#172033";
  sourceCtx.beginPath();
  sourceCtx.arc(-42, -28, 11, 0, Math.PI * 2);
  sourceCtx.arc(42, -28, 11, 0, Math.PI * 2);
  sourceCtx.fill();

  sourceCtx.strokeStyle = "#be123c";
  sourceCtx.lineWidth = 10;
  sourceCtx.lineCap = "round";
  sourceCtx.beginPath();
  sourceCtx.arc(0, 20, 58, 0.18, Math.PI - 0.18);
  sourceCtx.stroke();

  sourceCtx.fillStyle = "rgba(190,18,60,0.16)";
  sourceCtx.beginPath();
  sourceCtx.arc(-66, 12, 24, 0, Math.PI * 2);
  sourceCtx.arc(66, 12, 24, 0, Math.PI * 2);
  sourceCtx.fill();
  sourceCtx.restore();
}

function setSourceFromCanvas(name) {
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  state.sourceName = name;
  state.history = [];
  state.redo = [];
  clearPairSelection({ rerender: false });
  buildMesh();
  render();
  updateStatus();
  updateButtons();
}

function buildMesh() {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const cols = Math.ceil(width / state.meshStep);
  const rows = Math.ceil(height / state.meshStep);
  const points = [];

  for (let y = 0; y <= rows; y += 1) {
    const py = (y / rows) * height;
    for (let x = 0; x <= cols; x += 1) {
      const px = (x / cols) * width;
      points.push({ x: px, y: py, ox: px, oy: py });
    }
  }

  state.cols = cols;
  state.rows = rows;
  state.points = points;
}

function pointAt(x, y) {
  return state.points[y * (state.cols + 1) + x];
}

function scheduleRender() {
  if (state.frame) return;
  state.frame = requestAnimationFrame(() => {
    state.frame = 0;
    render();
  });
}

function render() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  for (let y = 0; y < state.rows; y += 1) {
    for (let x = 0; x < state.cols; x += 1) {
      const p00 = pointAt(x, y);
      const p10 = pointAt(x + 1, y);
      const p01 = pointAt(x, y + 1);
      const p11 = pointAt(x + 1, y + 1);
      drawTexturedTriangle(p00, p10, p11);
      drawTexturedTriangle(p00, p11, p01);
    }
  }

  if (meshToggle.checked) drawMeshOverlay();
  if (state.tool === "pair" && state.pairPoints.length) drawPairOverlay();
}

function drawTexturedTriangle(a, b, c) {
  const inflated = inflateTriangle([a, b, c], 0.8);
  const matrix = affineFromTriangles(
    [{ x: a.ox, y: a.oy }, { x: b.ox, y: b.oy }, { x: c.ox, y: c.oy }],
    [a, b, c]
  );

  if (!matrix) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(inflated[0].x, inflated[0].y);
  ctx.lineTo(inflated[1].x, inflated[1].y);
  ctx.lineTo(inflated[2].x, inflated[2].y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.restore();
}

function inflateTriangle(points, amount) {
  const cx = (points[0].x + points[1].x + points[2].x) / 3;
  const cy = (points[0].y + points[1].y + points[2].y) / 3;
  return points.map((point) => {
    const dx = point.x - cx;
    const dy = point.y - cy;
    const length = Math.hypot(dx, dy) || 1;
    return {
      x: point.x + (dx / length) * amount,
      y: point.y + (dy / length) * amount
    };
  });
}

function affineFromTriangles(source, target) {
  const [s0, s1, s2] = source;
  const [t0, t1, t2] = target;
  const denominator =
    s0.x * (s1.y - s2.y) +
    s1.x * (s2.y - s0.y) +
    s2.x * (s0.y - s1.y);

  if (Math.abs(denominator) < 0.00001) return null;

  return {
    a: (t0.x * (s1.y - s2.y) + t1.x * (s2.y - s0.y) + t2.x * (s0.y - s1.y)) / denominator,
    b: (t0.y * (s1.y - s2.y) + t1.y * (s2.y - s0.y) + t2.y * (s0.y - s1.y)) / denominator,
    c: (t0.x * (s2.x - s1.x) + t1.x * (s0.x - s2.x) + t2.x * (s1.x - s0.x)) / denominator,
    d: (t0.y * (s2.x - s1.x) + t1.y * (s0.x - s2.x) + t2.y * (s1.x - s0.x)) / denominator,
    e: (
      t0.x * (s1.x * s2.y - s2.x * s1.y) +
      t1.x * (s2.x * s0.y - s0.x * s2.y) +
      t2.x * (s0.x * s1.y - s1.x * s0.y)
    ) / denominator,
    f: (
      t0.y * (s1.x * s2.y - s2.x * s1.y) +
      t1.y * (s2.x * s0.y - s0.x * s2.y) +
      t2.y * (s0.x * s1.y - s1.x * s0.y)
    ) / denominator
  };
}

function drawMeshOverlay() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = "rgba(23, 32, 51, 0.24)";
  ctx.lineWidth = Math.max(1, canvas.width / 1000);

  for (let y = 0; y <= state.rows; y += 1) {
    ctx.beginPath();
    for (let x = 0; x <= state.cols; x += 1) {
      const point = pointAt(x, y);
      if (x === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  for (let x = 0; x <= state.cols; x += 1) {
    ctx.beginPath();
    for (let y = 0; y <= state.rows; y += 1) {
      const point = pointAt(x, y);
      if (y === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();
  }

  ctx.restore();
}

function drawPairOverlay() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.lineWidth = Math.max(2, canvas.width / 500);
  ctx.font = `${Math.max(14, canvas.width / 68)}px "Noto Sans KR", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (state.pairPoints.length === 2) {
    const [first, second] = state.pairPoints;
    ctx.strokeStyle = "rgba(37, 99, 235, 0.86)";
    ctx.setLineDash([12, 9]);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    ctx.lineTo(second.x, second.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  state.pairPoints.forEach((point, index) => {
    const radius = Math.max(11, canvas.width / 70);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = index === 0 ? "#0f766e" : "#be123c";
    ctx.lineWidth = Math.max(3, canvas.width / 420);
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.fillText(String(index + 1), point.x, point.y + 1);
  });

  ctx.restore();
}

function getCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

function applyBrush(point, dx, dy) {
  const radius = Number(radiusInput.value);
  const strength = Number(strengthInput.value) / 100;
  const moveLength = Math.hypot(dx, dy);
  const limitX = canvas.width * 0.3;
  const limitY = canvas.height * 0.3;

  state.points.forEach((meshPoint) => {
    const distance = Math.hypot(meshPoint.x - point.x, meshPoint.y - point.y);
    if (distance > radius) return;

    const normalized = 1 - distance / radius;
    const falloff = normalized * normalized * (3 - 2 * normalized);

    if (state.tool === "pull") {
      meshPoint.x += dx * falloff * strength * 1.35;
      meshPoint.y += dy * falloff * strength * 1.35;
    }

    if (state.tool === "inflate" || state.tool === "pinch") {
      const safeDistance = distance || 1;
      const sign = state.tool === "inflate" ? 1 : -1;
      const amount = sign * (moveLength + 4) * falloff * strength * 0.9;
      meshPoint.x += ((meshPoint.x - point.x) / safeDistance) * amount;
      meshPoint.y += ((meshPoint.y - point.y) / safeDistance) * amount;
    }

    if (state.tool === "restore") {
      meshPoint.x += (meshPoint.ox - meshPoint.x) * falloff * strength * 0.38;
      meshPoint.y += (meshPoint.oy - meshPoint.y) * falloff * strength * 0.38;
    }

    meshPoint.x = clamp(meshPoint.x, -limitX, canvas.width + limitX);
    meshPoint.y = clamp(meshPoint.y, -limitY, canvas.height + limitY);
  });
}

function updateBrushCursor(point) {
  if (state.tool === "pair") {
    brushCursor.classList.remove("is-visible");
    return;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const stageRect = dropZone.getBoundingClientRect();
  const scale = canvasRect.width / canvas.width;
  const size = Number(radiusInput.value) * 2 * scale;

  brushCursor.style.width = `${size}px`;
  brushCursor.style.height = `${size}px`;
  brushCursor.style.left = `${canvasRect.left - stageRect.left + point.x * scale}px`;
  brushCursor.style.top = `${canvasRect.top - stageRect.top + point.y * scale}px`;
}

function snapshot() {
  return state.points.map((point) => [point.x, point.y]);
}

function cloneSnapshot(saved) {
  return saved.map(([x, y]) => [x, y]);
}

function restoreSnapshot(saved) {
  saved.forEach(([x, y], index) => {
    state.points[index].x = x;
    state.points[index].y = y;
  });
  render();
}

function pushHistory() {
  state.history.push(snapshot());
  if (state.history.length > HISTORY_LIMIT) state.history.shift();
  state.redo = [];
  updateButtons();
}

function pushHistorySnapshot(saved) {
  state.history.push(cloneSnapshot(saved));
  if (state.history.length > HISTORY_LIMIT) state.history.shift();
  state.redo = [];
  updateButtons();
}

function resetMesh({ withHistory = true } = {}) {
  if (withHistory) pushHistory();
  clearPairSelection({ rerender: false });
  state.points.forEach((point) => {
    point.x = point.ox;
    point.y = point.oy;
  });
  render();
  updateButtons();
}

function updateButtons() {
  undoButton.disabled = state.history.length === 0;
  redoButton.disabled = state.redo.length === 0;
}

function formatSignedValue(value) {
  return value > 0 ? `+${value}` : String(value);
}

function clearPairSelection({ rerender = true } = {}) {
  state.pairPoints = [];
  state.pairBase = null;
  state.pairHistoryCommitted = false;
  pairAmountInput.value = "0";
  updatePairControls();
  if (rerender) render();
}

function updatePairControls() {
  pairPanel.hidden = state.tool !== "pair";
  pairCount.textContent = `${state.pairPoints.length}/2`;
  pairAmountValue.textContent = formatSignedValue(Number(pairAmountInput.value));
  pairAmountInput.disabled = state.pairPoints.length !== 2;
  pairClearButton.disabled = state.pairPoints.length === 0;
}

function selectPairPoint(point) {
  if (state.pairPoints.length >= 2) {
    state.pairPoints = [point];
    state.pairBase = null;
    state.pairHistoryCommitted = false;
    pairAmountInput.value = "0";
  } else {
    state.pairPoints.push(point);
  }

  if (state.pairPoints.length === 2) {
    state.pairBase = snapshot();
    state.pairHistoryCommitted = false;
    pairAmountInput.value = "0";
  }

  updatePairControls();
  render();
}

function distanceToSegment(point, first, second) {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = clamp(((point.x - first.x) * dx + (point.y - first.y) * dy) / lengthSquared, 0, 1);
  const projectionX = first.x + dx * t;
  const projectionY = first.y + dy * t;
  return Math.hypot(point.x - projectionX, point.y - projectionY);
}

function smoothFalloff(value) {
  const normalized = clamp(value, 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

function applyPairTransform() {
  const amount = Number(pairAmountInput.value) / 100;
  pairAmountValue.textContent = formatSignedValue(Number(pairAmountInput.value));

  if (state.pairPoints.length !== 2 || !state.pairBase) return;
  if (amount === 0 && !state.pairHistoryCommitted) {
    render();
    return;
  }

  if (!state.pairHistoryCommitted) {
    pushHistorySnapshot(state.pairBase);
    state.pairHistoryCommitted = true;
  }

  const [first, second] = state.pairPoints;
  const axisX = second.x - first.x;
  const axisY = second.y - first.y;
  const length = Math.hypot(axisX, axisY);
  if (length < 4) return;

  const unitX = axisX / length;
  const unitY = axisY / length;
  const middleX = (first.x + second.x) / 2;
  const middleY = (first.y + second.y) / 2;
  const halfLength = length / 2;
  const radius = Number(radiusInput.value);
  const maxShift = length * 0.45 * amount;
  const limitX = canvas.width * 0.3;
  const limitY = canvas.height * 0.3;

  state.points.forEach((meshPoint, index) => {
    const [baseX, baseY] = state.pairBase[index];
    const centeredX = baseX - middleX;
    const centeredY = baseY - middleY;
    const along = centeredX * unitX + centeredY * unitY;
    const side = Math.tanh(along / Math.max(halfLength * 0.3, 1));
    const outside = Math.max(0, Math.abs(along) - halfLength);
    const segmentDistance = distanceToSegment({ x: baseX, y: baseY }, first, second);
    const alongFalloff = smoothFalloff(1 - outside / Math.max(radius, 1));
    const widthFalloff = smoothFalloff(1 - segmentDistance / Math.max(radius * 1.25, 1));
    const shift = maxShift * side * alongFalloff * widthFalloff;

    meshPoint.x = clamp(baseX + unitX * shift, -limitX, canvas.width + limitX);
    meshPoint.y = clamp(baseY + unitY * shift, -limitY, canvas.height + limitY);
  });

  render();
}

function updateStatus() {
  const megapixels = ((sourceCanvas.width * sourceCanvas.height) / 1000000).toFixed(2);
  statusText.textContent = `${state.sourceName} · ${sourceCanvas.width}×${sourceCanvas.height} · ${megapixels}MP`;
}

function setTool(nextTool) {
  state.tool = nextTool;
  toolButtons.forEach((button) => {
    const active = button.dataset.tool === nextTool;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (nextTool === "pair") brushCursor.classList.remove("is-visible");
  updatePairControls();
  render();
}

function setQuality(nextStep) {
  state.meshStep = nextStep;
  buildMesh();
  state.history = [];
  state.redo = [];
  clearPairSelection({ rerender: false });
  render();
  qualityButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.quality) === nextStep);
  });
  updateButtons();
}

async function loadImageFile(file) {
  if (!file || !file.type.startsWith("image/")) return;

  const url = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const scale = Math.min(1, MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    sourceCanvas.width = width;
    sourceCanvas.height = height;
    sourceCtx.clearRect(0, 0, width, height);
    sourceCtx.imageSmoothingEnabled = true;
    sourceCtx.imageSmoothingQuality = "high";
    sourceCtx.drawImage(image, 0, 0, width, height);

    URL.revokeObjectURL(url);
    setSourceFromCanvas(file.name);
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    statusText.textContent = "이미지를 열 수 없습니다";
  };

  image.src = url;
}

function downloadImage() {
  render();
  const link = document.createElement("a");
  link.download = "image-warp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function handlePointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();

  if (state.tool === "pair") {
    selectPairPoint(getCanvasPoint(event));
    return;
  }

  canvas.setPointerCapture(event.pointerId);
  state.dragging = true;
  state.lastPoint = getCanvasPoint(event);
  pushHistory();
  updateBrushCursor(state.lastPoint);
  brushCursor.classList.add("is-visible");
}

function handlePointerMove(event) {
  const point = getCanvasPoint(event);
  updateBrushCursor(point);

  if (state.tool === "pair" || !state.dragging || !state.lastPoint) return;

  event.preventDefault();
  const dx = point.x - state.lastPoint.x;
  const dy = point.y - state.lastPoint.y;
  applyBrush(point, dx, dy);
  state.lastPoint = point;
  scheduleRender();
}

function handlePointerUp(event) {
  state.dragging = false;
  state.lastPoint = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  updateButtons();
}

function bindEvents() {
  if (window.lucide) window.lucide.createIcons();

  uploadButton.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", () => loadImageFile(imageInput.files[0]));
  sampleButton.addEventListener("click", createSampleImage);
  downloadButton.addEventListener("click", downloadImage);
  resetButton.addEventListener("click", () => resetMesh());

  undoButton.addEventListener("click", () => {
    if (!state.history.length) return;
    state.redo.push(snapshot());
    restoreSnapshot(state.history.pop());
    clearPairSelection({ rerender: false });
    updateButtons();
  });

  redoButton.addEventListener("click", () => {
    if (!state.redo.length) return;
    state.history.push(snapshot());
    restoreSnapshot(state.redo.pop());
    clearPairSelection({ rerender: false });
    updateButtons();
  });

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => setTool(button.dataset.tool));
  });

  qualityButtons.forEach((button) => {
    button.addEventListener("click", () => setQuality(Number(button.dataset.quality)));
  });

  radiusInput.addEventListener("input", () => {
    radiusValue.textContent = radiusInput.value;
    if (state.lastPoint) updateBrushCursor(state.lastPoint);
    if (state.tool === "pair" && state.pairPoints.length === 2 && Number(pairAmountInput.value) !== 0) {
      applyPairTransform();
    }
  });

  strengthInput.addEventListener("input", () => {
    strengthValue.textContent = strengthInput.value;
  });

  pairAmountInput.addEventListener("input", applyPairTransform);
  pairClearButton.addEventListener("click", () => clearPairSelection());

  meshToggle.addEventListener("change", render);

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);
  canvas.addEventListener("pointercancel", handlePointerUp);
  canvas.addEventListener("pointerenter", (event) => {
    updateBrushCursor(getCanvasPoint(event));
    if (state.tool !== "pair") brushCursor.classList.add("is-visible");
  });
  canvas.addEventListener("pointerleave", () => {
    if (!state.dragging) brushCursor.classList.remove("is-visible");
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("is-drop-target");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("is-drop-target");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-drop-target");
    loadImageFile(event.dataTransfer.files[0]);
  });

  document.addEventListener("paste", (event) => {
    const file = Array.from(event.clipboardData?.files || []).find((item) => item.type.startsWith("image/"));
    if (file) loadImageFile(file);
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && key === "z") {
      event.preventDefault();
      undoButton.click();
    }
    if ((event.ctrlKey || event.metaKey) && (key === "y" || (event.shiftKey && key === "z"))) {
      event.preventDefault();
      redoButton.click();
    }
  });
}

bindEvents();
createSampleImage();
