const STORAGE_KEY = "student-slide-studio-project-v1";
const THEMES = new Set(["paper", "mint", "coral", "night"]);
const LAYOUTS = new Set(["title", "text", "split", "image", "quote"]);

const elements = {
  addSlideButton: document.getElementById("addSlideButton"),
  bodyInput: document.getElementById("bodyInput"),
  closePresenterButton: document.getElementById("closePresenterButton"),
  deleteSlideButton: document.getElementById("deleteSlideButton"),
  duplicateSlideButton: document.getElementById("duplicateSlideButton"),
  exportButton: document.getElementById("exportButton"),
  imageAltInput: document.getElementById("imageAltInput"),
  imageInput: document.getElementById("imageInput"),
  importButton: document.getElementById("importButton"),
  importProjectInput: document.getElementById("importProjectInput"),
  kickerInput: document.getElementById("kickerInput"),
  layoutInput: document.getElementById("layoutInput"),
  moveDownButton: document.getElementById("moveDownButton"),
  moveUpButton: document.getElementById("moveUpButton"),
  notesInput: document.getElementById("notesInput"),
  presentButton: document.getElementById("presentButton"),
  presentNextButton: document.getElementById("presentNextButton"),
  presentPrevButton: document.getElementById("presentPrevButton"),
  presenter: document.getElementById("presenter"),
  presenterCounter: document.getElementById("presenterCounter"),
  presenterStage: document.getElementById("presenterStage"),
  projectTitleInput: document.getElementById("projectTitleInput"),
  removeImageButton: document.getElementById("removeImageButton"),
  saveProjectButton: document.getElementById("saveProjectButton"),
  selectedSlideLabel: document.getElementById("selectedSlideLabel"),
  slideCount: document.getElementById("slideCount"),
  slideList: document.getElementById("slideList"),
  slidePreview: document.getElementById("slidePreview"),
  status: document.getElementById("status"),
  themeInput: document.getElementById("themeInput"),
  titleInput: document.getElementById("titleInput")
};

let state = loadProject();
let selectedId = state.slides[0].id;
let presenterIndex = 0;
let presentationSession = 0;

renderAll();
bindEvents();

function bindEvents() {
  elements.addSlideButton.addEventListener("click", addSlide);
  elements.deleteSlideButton.addEventListener("click", deleteSelectedSlide);
  elements.duplicateSlideButton.addEventListener("click", duplicateSelectedSlide);
  elements.exportButton.addEventListener("click", exportDeck);
  elements.importButton.addEventListener("click", () => elements.importProjectInput.click());
  elements.moveDownButton.addEventListener("click", () => moveSelectedSlide(1));
  elements.moveUpButton.addEventListener("click", () => moveSelectedSlide(-1));
  elements.presentButton.addEventListener("click", startPresentation);
  elements.presentNextButton.addEventListener("click", () => movePresenter(1));
  elements.presentPrevButton.addEventListener("click", () => movePresenter(-1));
  elements.closePresenterButton.addEventListener("click", closePresentation);
  elements.removeImageButton.addEventListener("click", removeSelectedImage);
  elements.saveProjectButton.addEventListener("click", saveProjectFile);

  elements.importProjectInput.addEventListener("change", importProjectFile);
  elements.imageInput.addEventListener("change", addImageToSelectedSlide);

  elements.projectTitleInput.addEventListener("input", () => {
    state.title = elements.projectTitleInput.value;
    saveState();
    renderPreview();
  });

  elements.themeInput.addEventListener("change", () => {
    state.theme = safeTheme(elements.themeInput.value);
    saveState();
    renderPreview();
  });

  elements.layoutInput.addEventListener("change", () => {
    updateSelectedSlide({ layout: safeLayout(elements.layoutInput.value) });
  });

  elements.kickerInput.addEventListener("input", () => updateSelectedSlide({ kicker: elements.kickerInput.value }, false));
  elements.titleInput.addEventListener("input", () => updateSelectedSlide({ title: elements.titleInput.value }, false));
  elements.bodyInput.addEventListener("input", () => updateSelectedSlide({ body: elements.bodyInput.value }, false));
  elements.notesInput.addEventListener("input", () => updateSelectedSlide({ notes: elements.notesInput.value }, false));
  elements.imageAltInput.addEventListener("input", () => {
    const slide = getSelectedSlide();
    if (!slide.image) return;
    slide.image.alt = elements.imageAltInput.value;
    saveState();
    renderPreview();
  });

  document.addEventListener("keydown", (event) => {
    if (elements.presenter.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closePresentation();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      movePresenter(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      movePresenter(-1);
    }
  });
}

function loadProject() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeProject(JSON.parse(saved));
  } catch (error) {
    console.warn("Could not load saved slide project.", error);
  }

  return createDefaultProject();
}

function createDefaultProject() {
  return normalizeProject({
    title: "나의 발표",
    theme: "paper",
    slides: [
      {
        layout: "title",
        kicker: "한국어 발표",
        title: "나의 발표 제목",
        body: "이름 / 반 / 날짜",
        notes: ""
      },
      {
        layout: "text",
        kicker: "순서",
        title: "오늘 이야기할 것",
        body: "- 첫 번째 내용\n- 두 번째 내용\n- 마지막 생각",
        notes: ""
      },
      {
        layout: "split",
        kicker: "자료",
        title: "사진과 함께 설명하기",
        body: "핵심 문장을 짧게 쓰고 발표할 때 자세히 설명합니다.",
        notes: ""
      },
      {
        layout: "quote",
        kicker: "마무리",
        title: "끝",
        body: "들어 주셔서 감사합니다.",
        notes: ""
      }
    ]
  });
}

function normalizeProject(project) {
  const normalizedSlides = Array.isArray(project?.slides)
    ? project.slides.map(normalizeSlide)
    : [];

  if (!normalizedSlides.length) {
    normalizedSlides.push(createSlide({ title: "새 발표", layout: "title" }));
  }

  return {
    title: typeof project?.title === "string" ? project.title : "나의 발표",
    theme: safeTheme(project?.theme),
    slides: normalizedSlides
  };
}

function normalizeSlide(slide) {
  const image = slide?.image?.src
    ? {
        src: String(slide.image.src),
        alt: typeof slide.image.alt === "string" ? slide.image.alt : ""
      }
    : null;

  return {
    id: typeof slide?.id === "string" && slide.id ? slide.id : createId(),
    layout: safeLayout(slide?.layout),
    kicker: typeof slide?.kicker === "string" ? slide.kicker : "",
    title: typeof slide?.title === "string" ? slide.title : "새 슬라이드",
    body: typeof slide?.body === "string" ? slide.body : "",
    image,
    notes: typeof slide?.notes === "string" ? slide.notes : ""
  };
}

function createSlide(overrides = {}) {
  return normalizeSlide({
    id: createId(),
    layout: "text",
    kicker: "",
    title: "새 슬라이드",
    body: "여기에 내용을 씁니다.",
    notes: "",
    ...overrides
  });
}

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `slide-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function safeTheme(theme) {
  return THEMES.has(theme) ? theme : "paper";
}

function safeLayout(layout) {
  return LAYOUTS.has(layout) ? layout : "text";
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getSelectedIndex() {
  const index = state.slides.findIndex((slide) => slide.id === selectedId);
  return index === -1 ? 0 : index;
}

function getSelectedSlide() {
  const index = getSelectedIndex();
  selectedId = state.slides[index].id;
  return state.slides[index];
}

function renderAll() {
  const slide = getSelectedSlide();
  elements.projectTitleInput.value = state.title;
  elements.themeInput.value = state.theme;
  elements.layoutInput.value = slide.layout;
  elements.kickerInput.value = slide.kicker;
  elements.titleInput.value = slide.title;
  elements.bodyInput.value = slide.body;
  elements.notesInput.value = slide.notes;
  elements.imageAltInput.value = slide.image?.alt || "";
  elements.imageInput.value = "";

  renderSlideList();
  renderPreview();
  updateControls();
}

function renderSlideList() {
  const selectedIndex = getSelectedIndex();
  elements.slideCount.textContent = `${state.slides.length}장`;
  elements.slideList.innerHTML = "";

  state.slides.forEach((slide, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slide-card${index === selectedIndex ? " is-active" : ""}`;
    button.dataset.id = slide.id;
    button.setAttribute("aria-label", `${index + 1}번 슬라이드 선택`);
    button.innerHTML = `
      <span class="slide-card-number">${index + 1}</span>
      <span>
        <span class="slide-card-title">${escapeHtml(slide.title || "제목 없음")}</span>
        <span class="slide-card-meta">${layoutLabel(slide.layout)}${slide.image ? " · 이미지" : ""}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      selectedId = slide.id;
      renderAll();
    });
    item.append(button);
    elements.slideList.append(item);
  });
}

function renderPreview() {
  const selectedIndex = getSelectedIndex();
  elements.slidePreview.innerHTML = renderSlideMarkup(
    getSelectedSlide(),
    selectedIndex,
    state.slides.length,
    state.theme,
    state.title
  );
  elements.selectedSlideLabel.textContent = `${selectedIndex + 1}번 슬라이드`;
}

function updateControls() {
  const selectedIndex = getSelectedIndex();
  elements.moveUpButton.disabled = selectedIndex === 0;
  elements.moveDownButton.disabled = selectedIndex === state.slides.length - 1;
  elements.deleteSlideButton.disabled = state.slides.length === 1;
  elements.removeImageButton.disabled = !getSelectedSlide().image;
}

function updateSelectedSlide(patch, refreshForm = true) {
  Object.assign(getSelectedSlide(), patch);
  saveState();

  if (refreshForm) {
    renderAll();
    return;
  }

  renderSlideList();
  renderPreview();
  updateControls();
}

function addSlide() {
  const index = getSelectedIndex();
  const slide = createSlide();
  state.slides.splice(index + 1, 0, slide);
  selectedId = slide.id;
  saveState();
  renderAll();
  setStatus("슬라이드를 추가했습니다.");
}

function duplicateSelectedSlide() {
  const index = getSelectedIndex();
  const source = getSelectedSlide();
  const copy = normalizeSlide({
    ...source,
    id: createId(),
    title: `${source.title || "슬라이드"} 복사`
  });
  state.slides.splice(index + 1, 0, copy);
  selectedId = copy.id;
  saveState();
  renderAll();
  setStatus("슬라이드를 복제했습니다.");
}

function deleteSelectedSlide() {
  if (state.slides.length === 1) return;
  const index = getSelectedIndex();
  state.slides.splice(index, 1);
  selectedId = state.slides[Math.max(0, index - 1)].id;
  saveState();
  renderAll();
  setStatus("슬라이드를 삭제했습니다.");
}

function moveSelectedSlide(direction) {
  const index = getSelectedIndex();
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= state.slides.length) return;

  const [slide] = state.slides.splice(index, 1);
  state.slides.splice(nextIndex, 0, slide);
  selectedId = slide.id;
  saveState();
  renderAll();
}

function addImageToSelectedSlide(event) {
  const [file] = event.target.files;
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setStatus("이미지 파일만 넣을 수 있습니다.");
    elements.imageInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const slide = getSelectedSlide();
    const alt = elements.imageAltInput.value || file.name.replace(/\.[^.]+$/, "");
    slide.image = {
      src: String(reader.result),
      alt
    };
    saveState();
    renderAll();
    setStatus(file.size > 6 * 1024 * 1024 ? "이미지를 넣었습니다. 파일 크기가 조금 커질 수 있습니다." : "이미지를 넣었습니다.");
  });
  reader.readAsDataURL(file);
}

function removeSelectedImage() {
  const slide = getSelectedSlide();
  slide.image = null;
  saveState();
  renderAll();
  setStatus("이미지를 제거했습니다.");
}

function saveProjectFile() {
  const json = JSON.stringify(state, null, 2);
  downloadFile(`${safeFileName(state.title || "slide-project")}.json`, json, "application/json;charset=utf-8");
  setStatus("프로젝트 파일을 만들었습니다.");
}

function importProjectFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      state = normalizeProject(JSON.parse(String(reader.result)));
      selectedId = state.slides[0].id;
      saveState();
      renderAll();
      setStatus("프로젝트를 불러왔습니다.");
    } catch (error) {
      console.error(error);
      setStatus("프로젝트 파일을 읽지 못했습니다.");
    } finally {
      elements.importProjectInput.value = "";
    }
  });
  reader.readAsText(file, "utf-8");
}

function exportDeck() {
  const html = buildDeckHtml(state);
  downloadFile(`${safeFileName(state.title || "presentation")}.html`, html, "text/html;charset=utf-8");
  setStatus("발표용 HTML 파일을 만들었습니다.");
}

function downloadFile(fileName, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function safeFileName(name) {
  return String(name)
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 60) || "presentation";
}

function startPresentation() {
  const session = presentationSession + 1;
  presentationSession = session;
  presenterIndex = getSelectedIndex();
  elements.presenter.hidden = false;
  document.body.style.overflow = "hidden";
  renderPresenter();

  if (elements.presenter.requestFullscreen) {
    elements.presenter
      .requestFullscreen()
      .then(() => {
        if (presentationSession !== session || elements.presenter.hidden) exitPresenterFullscreen();
      })
      .catch(() => {});
  }
}

function closePresentation() {
  presentationSession += 1;
  elements.presenter.hidden = true;
  document.body.style.overflow = "";
  exitPresenterFullscreen();
  window.setTimeout(exitPresenterFullscreen, 180);
}

function exitPresenterFullscreen() {
  if (document.fullscreenElement === elements.presenter && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
}

function movePresenter(direction) {
  presenterIndex = Math.min(state.slides.length - 1, Math.max(0, presenterIndex + direction));
  renderPresenter();
}

function renderPresenter() {
  elements.presenterCounter.textContent = `${presenterIndex + 1} / ${state.slides.length}`;
  elements.presenterStage.innerHTML = renderSlideMarkup(
    state.slides[presenterIndex],
    presenterIndex,
    state.slides.length,
    state.theme,
    state.title
  );
  elements.presentPrevButton.disabled = presenterIndex === 0;
  elements.presentNextButton.disabled = presenterIndex === state.slides.length - 1;
}

function renderSlideMarkup(slide, index, total, theme, projectTitle) {
  const layout = safeLayout(slide.layout);
  let content = "";

  if (layout === "split") {
    content = `
      <div class="text-stack">${renderTextStack(slide)}</div>
      ${renderMedia(slide)}
    `;
  } else if (layout === "image") {
    content = `
      <div class="text-stack">${renderTextStack(slide)}</div>
      ${renderMedia(slide)}
    `;
  } else {
    content = renderTextStack(slide);
  }

  return `
    <article class="slide layout-${layout}" data-theme="${safeTheme(theme)}">
      <div class="slide-content">${content}</div>
      <footer class="slide-footer">
        <span>${escapeHtml(projectTitle || "발표")}</span>
        <span>${index + 1} / ${total}</span>
      </footer>
    </article>
  `;
}

function renderTextStack(slide) {
  const kicker = slide.kicker ? `<p class="slide-kicker">${escapeHtml(slide.kicker)}</p>` : "";
  const title = slide.title ? `<h2 class="slide-title">${escapeHtml(slide.title)}</h2>` : "";
  const body = slide.body ? `<div class="slide-body">${bodyToHtml(slide.body)}</div>` : "";
  return `${kicker}${title}${body}`;
}

function renderMedia(slide) {
  if (!slide.image?.src) {
    return `<div class="media-placeholder">이미지</div>`;
  }

  return `
    <figure class="slide-media">
      <img src="${escapeAttribute(slide.image.src)}" alt="${escapeAttribute(slide.image.alt || "")}">
    </figure>
  `;
}

function bodyToHtml(text) {
  const blocks = String(text)
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block
        .split(/\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      const isList = lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line));

      if (isList) {
        const items = lines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      return `<p>${lines.map(escapeHtml).join("<br>")}</p>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function layoutLabel(layout) {
  const labels = {
    title: "제목",
    text: "본문",
    split: "글 + 이미지",
    image: "이미지 중심",
    quote: "인용"
  };
  return labels[safeLayout(layout)];
}

function setStatus(message) {
  elements.status.textContent = message;
}

function buildDeckHtml(project) {
  const title = escapeHtml(project.title || "학생 발표");
  const slides = project.slides
    .map((slide, index) => {
      const markup = renderSlideMarkup(slide, index, project.slides.length, project.theme, project.title);
      return markup.replace("<article", `<article id="slide-${index + 1}"`);
    })
    .join("\n");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>${getDeckCss()}</style>
</head>
<body>
  <main class="deck-viewport" aria-live="polite">
    ${slides}
  </main>
  <nav class="deck-bar" aria-label="발표 조작">
    <strong id="deckCounter">1 / ${project.slides.length}</strong>
    <div class="deck-actions">
      <button id="printDeck" type="button">PDF</button>
      <button id="prevDeck" type="button">이전</button>
      <button id="nextDeck" type="button">다음</button>
    </div>
  </nav>
  <script>${getDeckScript()}</script>
</body>
</html>`;
}

function getDeckCss() {
  return `
:root {
  --ink: #202124;
  --bar: rgba(12, 13, 16, 0.88);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  background: #0c0d10;
  font-family: "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif;
}

button {
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 8px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  font: inherit;
  font-weight: 850;
  cursor: pointer;
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.deck-viewport {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 14px 14px 76px;
}

.deck-viewport .slide {
  display: none;
  width: min(100%, calc((100vh - 106px) * 16 / 9));
  height: auto;
  aspect-ratio: 16 / 9;
}

.deck-viewport .slide.is-active {
  display: grid;
}

.deck-bar {
  position: fixed;
  left: 14px;
  right: 14px;
  bottom: 14px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  color: #ffffff;
  background: var(--bar);
}

.deck-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.slide {
  --slide-bg: #fffefa;
  --slide-ink: #202124;
  --slide-muted: #606873;
  --slide-accent: #0f766e;
  --slide-soft: #eff8f6;
  --slide-line: rgba(32, 33, 36, 0.16);
  position: relative;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 54px;
  overflow: hidden;
  color: var(--slide-ink);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0)),
    var(--slide-bg);
  border: 1px solid var(--slide-line);
  border-radius: 8px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.24);
}

.slide[data-theme="paper"] {
  --slide-bg: #fffefa;
  --slide-ink: #202124;
  --slide-muted: #6b665c;
  --slide-accent: #9a6a13;
  --slide-soft: #f6edd7;
}

.slide[data-theme="mint"] {
  --slide-bg: #edf8f6;
  --slide-ink: #123332;
  --slide-muted: #47615f;
  --slide-accent: #0f766e;
  --slide-soft: #d7f0eb;
}

.slide[data-theme="coral"] {
  --slide-bg: #fff1eb;
  --slide-ink: #33201b;
  --slide-muted: #75584f;
  --slide-accent: #c8523b;
  --slide-soft: #ffe0d5;
}

.slide[data-theme="night"] {
  --slide-bg: #181a20;
  --slide-ink: #f5f1e8;
  --slide-muted: #c9c2b4;
  --slide-accent: #6ee7d8;
  --slide-soft: #232934;
  --slide-line: rgba(255, 255, 255, 0.2);
}

.slide::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 34%;
  height: 10px;
  background: linear-gradient(90deg, var(--slide-accent), transparent);
  opacity: 0.8;
}

.slide-content {
  min-height: 0;
  display: grid;
  align-content: center;
  gap: 18px;
}

.slide-kicker {
  margin: 0;
  color: var(--slide-accent);
  font-size: 1.02rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.slide-title {
  margin: 0;
  color: var(--slide-ink);
  font-size: 3rem;
  line-height: 1.1;
  letter-spacing: 0;
  overflow-wrap: anywhere;
}

.slide-body {
  color: var(--slide-ink);
  font-size: 1.28rem;
  line-height: 1.55;
}

.slide-body p,
.slide-body ul {
  margin: 0;
}

.slide-body p + p,
.slide-body ul + p,
.slide-body p + ul {
  margin-top: 0.7em;
}

.slide-body ul {
  padding-left: 1.2em;
}

.slide-body li + li {
  margin-top: 0.3em;
}

.slide-media,
.media-placeholder {
  width: 100%;
  min-height: 0;
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--slide-line);
  background: var(--slide-soft);
}

.slide-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-placeholder {
  min-height: 210px;
  display: grid;
  place-items: center;
  color: var(--slide-muted);
  font-weight: 800;
}

.slide-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--slide-muted);
  font-size: 0.9rem;
  font-weight: 800;
}

.layout-title .slide-content,
.layout-quote .slide-content {
  justify-items: center;
  text-align: center;
}

.layout-title .slide-title {
  max-width: 900px;
  font-size: 3.8rem;
}

.layout-title .slide-body {
  max-width: 780px;
  color: var(--slide-muted);
  font-size: 1.34rem;
}

.layout-text .slide-content {
  align-content: start;
}

.layout-text .slide-body {
  max-width: 900px;
}

.layout-split .slide-content {
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.85fr);
  align-items: center;
}

.layout-split .text-stack {
  display: grid;
  gap: 18px;
}

.layout-split .slide-title {
  font-size: 2.45rem;
}

.layout-split .slide-media,
.layout-split .media-placeholder {
  height: 100%;
  min-height: 330px;
}

.layout-image .slide-content {
  grid-template-rows: auto minmax(0, 1fr) auto;
  align-content: stretch;
}

.layout-image .slide-media,
.layout-image .media-placeholder {
  min-height: 360px;
}

.layout-image .slide-title {
  font-size: 2.4rem;
}

.layout-quote .slide-title {
  max-width: 860px;
  font-size: 2rem;
  color: var(--slide-accent);
}

.layout-quote .slide-body {
  max-width: 820px;
  font-size: 2rem;
  font-weight: 850;
  line-height: 1.35;
}

.layout-quote .slide-body p::before {
  content: "\\201C";
}

.layout-quote .slide-body p::after {
  content: "\\201D";
}

@media (max-width: 760px) {
  .deck-viewport {
    justify-content: start;
    overflow-x: auto;
  }

  .deck-viewport .slide {
    min-width: 560px;
  }

  .deck-bar {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media print {
  @page {
    size: 16in 9in;
    margin: 0;
  }

  body {
    background: #ffffff;
  }

  .deck-bar {
    display: none;
  }

  .deck-viewport {
    display: block;
    min-height: auto;
    padding: 0;
  }

  .deck-viewport .slide,
  .deck-viewport .slide.is-active {
    display: grid;
    width: 100vw;
    height: 100vh;
    min-width: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    break-after: page;
    page-break-after: always;
  }
}
`;
}

function getDeckScript() {
  return `
(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.getElementById("deckCounter");
  const prevButton = document.getElementById("prevDeck");
  const nextButton = document.getElementById("nextDeck");
  const printButton = document.getElementById("printDeck");
  let index = Math.max(0, Math.min(slides.length - 1, Number(location.hash.slice(1)) - 1 || 0));

  function show(nextIndex) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    counter.textContent = (index + 1) + " / " + slides.length;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    if (location.hash !== "#" + (index + 1)) {
      history.replaceState(null, "", "#" + (index + 1));
    }
  }

  prevButton.addEventListener("click", () => show(index - 1));
  nextButton.addEventListener("click", () => show(index + 1));
  printButton.addEventListener("click", () => window.print());

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
      event.preventDefault();
      show(index + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      show(index - 1);
    }
  });

  window.addEventListener("hashchange", () => {
    const hashIndex = Number(location.hash.slice(1)) - 1;
    if (Number.isFinite(hashIndex)) show(hashIndex);
  });

  show(index);
})();
`;
}
