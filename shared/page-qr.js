(function () {
  "use strict";

  if (window.__pageQrInstalled) return;
  window.__pageQrInstalled = true;

  const currentScript = document.currentScript;
  const DEPLOY_BASE = "https://sometime4224-hnu.github.io/WTK-26Summer/";
  const QR_VENDOR_PATH = "vendor/qrcode-generator.js";
  const STORAGE_SIZE = "korean3b.pageQr.size.v1";
  const STORAGE_POSITION = "korean3b.pageQr.position.v1";
  const MIN_SIZE = 150;
  const MAX_SIZE = 420;
  const SIZE_STEP = 30;
  const DEFAULT_SIZE = 220;
  const DEFAULT_POSITION = "top-left";

  const NAV_SELECTOR = [
    "nav.topbar",
    ".topbar",
    "#injected-global-nav",
    ".injected-global-nav",
    ".global-nav",
    ".c11-global-nav",
    ".c12-nav",
    ".c12-global-nav",
    ".sp-nav",
    ".lc-nav",
    ".top-nav",
    ".sticky-nav",
    "nav[aria-label]",
    "nav"
  ].join(",");

  const state = {
    button: null,
    panel: null,
    topbar: null,
    qrReady: false,
    desktopOnly: true,
    targetUrl: ""
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function readNumber(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (error) {}
  }

  function readPosition() {
    try {
      const value = window.localStorage.getItem(STORAGE_POSITION);
      if (["top-left", "top-center", "top-right"].includes(value)) return value;
    } catch (error) {}
    return DEFAULT_POSITION;
  }

  function getScriptUrl() {
    try {
      const src = currentScript && currentScript.getAttribute("src");
      return src ? new URL(src, window.location.href) : null;
    } catch (error) {
      return null;
    }
  }

  function getRelativePath() {
    let current;
    try {
      current = new URL(window.location.href);
    } catch (error) {
      return "index.html";
    }

    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
      const marker = "/shared/page-qr.js";
      const markerIndex = scriptUrl.pathname.lastIndexOf(marker);
      if (markerIndex >= 0) {
        const rootPath = scriptUrl.pathname.slice(0, markerIndex + 1);
        if (current.pathname.startsWith(rootPath)) {
          const relative = current.pathname.slice(rootPath.length);
          return relative || "index.html";
        }
      }
    }

    const repoMarker = "/WTK-26Summer/";
    const repoIndex = current.pathname.indexOf(repoMarker);
    if (repoIndex >= 0) {
      const relative = current.pathname.slice(repoIndex + repoMarker.length);
      return relative || "index.html";
    }

    const appMarker = "/korean3Bimprove/";
    const appIndex = current.pathname.indexOf(appMarker);
    if (appIndex >= 0) {
      const relative = current.pathname.slice(appIndex + appMarker.length);
      return relative || "index.html";
    }

    const fallback = current.pathname.replace(/^\/+/, "");
    return fallback || "index.html";
  }

  function getTargetUrl() {
    let current;
    try {
      current = new URL(window.location.href);
    } catch (error) {
      return DEPLOY_BASE;
    }

    const relativePath = getRelativePath();
    return new URL(relativePath + current.search + current.hash, DEPLOY_BASE).href;
  }

  function isDesktopScreen() {
    return (
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(hover: hover)").matches &&
      window.matchMedia("(pointer: fine)").matches
    );
  }

  function getVendorUrl() {
    const scriptUrl = getScriptUrl();
    if (scriptUrl) return new URL(QR_VENDOR_PATH, scriptUrl).href;
    return new URL(`shared/${QR_VENDOR_PATH}`, window.location.href).href;
  }

  function injectStyle() {
    if (document.getElementById("page-qr-style")) return;
    const style = document.createElement("style");
    style.id = "page-qr-style";
    style.textContent = `
      .page-qr-trigger {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        min-width: 32px;
        padding: 0;
        border: 1px solid rgba(15, 23, 42, 0.16);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.94);
        color: #0f172a;
        font: 900 11px/1 "Noto Sans KR", system-ui, sans-serif;
        letter-spacing: 0;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
        transition: transform 0.14s ease, box-shadow 0.14s ease, background 0.14s ease;
      }

      .page-qr-trigger:hover {
        background: #ffffff;
        box-shadow: 0 5px 16px rgba(15, 23, 42, 0.18);
        transform: translateY(-1px);
      }

      .page-qr-trigger:active {
        transform: translateY(0) scale(0.96);
      }

      .page-qr-trigger[aria-pressed="true"] {
        border-color: rgba(37, 99, 235, 0.42);
        color: #1d4ed8;
      }

      .page-qr-trigger--fixed {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 2147483000;
      }

      .page-qr-panel {
        --page-qr-size: ${DEFAULT_SIZE}px;
        position: fixed;
        top: var(--page-qr-top, 56px);
        left: 12px;
        width: max-content;
        max-width: calc(100vw - 24px);
        padding: 10px;
        border: 1px solid rgba(148, 163, 184, 0.38);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.98);
        color: #0f172a;
        box-shadow: 0 18px 50px rgba(15, 23, 42, 0.24);
        z-index: 2147483001;
      }

      .page-qr-panel[hidden] {
        display: none !important;
      }

      .page-qr-panel[data-position="top-center"] {
        left: 50%;
        transform: translateX(-50%);
      }

      .page-qr-panel[data-position="top-right"] {
        right: 12px;
        left: auto;
      }

      .page-qr-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .page-qr-title {
        font: 900 12px/1.2 "Noto Sans KR", system-ui, sans-serif;
        color: #334155;
      }

      .page-qr-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: 0;
        border-radius: 7px;
        background: #f1f5f9;
        color: #334155;
        font: 900 15px/1 system-ui, sans-serif;
        cursor: pointer;
      }

      .page-qr-close:hover {
        background: #e2e8f0;
      }

      .page-qr-code {
        position: relative;
        display: grid;
        place-items: center;
        width: var(--page-qr-size);
        height: var(--page-qr-size);
        max-width: min(72vw, ${MAX_SIZE}px);
        max-height: min(72vw, ${MAX_SIZE}px);
        padding: 8px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #ffffff;
        box-sizing: border-box;
      }

      .page-qr-code canvas,
      .page-qr-code img {
        width: 100%;
        height: 100%;
        display: block;
      }

      .page-qr-code canvas[hidden],
      .page-qr-code img[hidden],
      .page-qr-loading[hidden] {
        display: none !important;
      }

      .page-qr-loading {
        position: absolute;
        inset: 8px;
        display: grid;
        place-items: center;
        border-radius: 7px;
        background: #f8fafc;
        color: #475569;
        font: 800 12px/1.2 "Noto Sans KR", system-ui, sans-serif;
      }

      .page-qr-url {
        display: block;
        width: var(--page-qr-size);
        max-width: min(72vw, ${MAX_SIZE}px);
        margin: 7px 0 0;
        overflow: hidden;
        color: #475569;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-decoration: none;
        font: 700 10px/1.3 system-ui, sans-serif;
      }

      .page-qr-url:hover {
        color: #1d4ed8;
      }

      .page-qr-controls {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 5px;
        margin-top: 8px;
      }

      .page-qr-controls button,
      .page-qr-size-readout {
        min-width: 0;
        min-height: 28px;
        border: 1px solid #dbeafe;
        border-radius: 7px;
        background: #eff6ff;
        color: #1d4ed8;
        font: 900 11px/1 "Noto Sans KR", system-ui, sans-serif;
      }

      .page-qr-controls button {
        cursor: pointer;
      }

      .page-qr-controls button:hover,
      .page-qr-controls button[aria-pressed="true"] {
        background: #dbeafe;
      }

      .page-qr-size-readout {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #334155;
        background: #f8fafc;
        border-color: #e2e8f0;
      }

      @media (max-width: 520px) {
        .page-qr-panel {
          top: 48px;
          left: 8px;
          right: 8px;
          width: auto;
          max-width: none;
        }

        .page-qr-panel[data-position="top-center"],
        .page-qr-panel[data-position="top-right"] {
          left: 8px;
          right: 8px;
          transform: none;
        }

        .page-qr-code,
        .page-qr-url {
          width: min(var(--page-qr-size), 100%);
          margin-left: auto;
          margin-right: auto;
        }
      }

      @media (max-width: 1023px), (hover: none), (pointer: coarse) {
        .page-qr-trigger[data-desktop-only="true"],
        .page-qr-panel[data-desktop-only="true"] {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function findTopbar() {
    return document.querySelector(NAV_SELECTOR);
  }

  function getInsertionHost(topbar) {
    if (!topbar) return null;
    return (
      topbar.querySelector(":scope > .topbar__links") ||
      topbar.querySelector(":scope > .global-nav-links") ||
      topbar.querySelector(":scope > .lc-nav__links") ||
      topbar
    );
  }

  function createButton() {
    const button = document.createElement("button");
    button.id = "page-qr-trigger";
    button.className = "page-qr-trigger";
    button.type = "button";
    button.textContent = "QR";
    button.title = "QR";
    button.setAttribute("aria-label", "QR");
    button.setAttribute("aria-controls", "page-qr-panel");
    button.setAttribute("aria-pressed", "false");
    if (state.desktopOnly) button.dataset.desktopOnly = "true";
    button.addEventListener("click", togglePanel);
    return button;
  }

  function createPanel() {
    const size = clamp(readNumber(STORAGE_SIZE, DEFAULT_SIZE), MIN_SIZE, MAX_SIZE);
    const position = readPosition();
    const panel = document.createElement("section");
    panel.id = "page-qr-panel";
    panel.className = "page-qr-panel";
    panel.dataset.position = position;
    panel.style.setProperty("--page-qr-size", `${size}px`);
    panel.setAttribute("aria-label", "QR");
    panel.hidden = true;
    if (state.desktopOnly) panel.dataset.desktopOnly = "true";
    panel.innerHTML = `
      <div class="page-qr-head">
        <strong class="page-qr-title">QR</strong>
        <button class="page-qr-close" type="button" aria-label="닫기">x</button>
      </div>
      <div class="page-qr-code">
        <canvas id="page-qr-canvas" width="512" height="512" aria-label="page qr"></canvas>
        <img id="page-qr-img" alt="page qr" hidden>
        <div class="page-qr-loading" id="page-qr-loading">...</div>
      </div>
      <a class="page-qr-url" id="page-qr-url" target="_blank" rel="noopener"></a>
      <div class="page-qr-controls" aria-label="QR controls">
        <button type="button" data-qr-size="-">-</button>
        <span class="page-qr-size-readout" id="page-qr-size-readout">${size}px</span>
        <button type="button" data-qr-size="+">+</button>
        <button class="page-qr-pos" type="button" data-qr-position="top-left">좌</button>
        <button class="page-qr-pos" type="button" data-qr-position="top-center">중</button>
        <button class="page-qr-pos" type="button" data-qr-position="top-right">우</button>
      </div>
    `;

    panel.querySelector(".page-qr-close").addEventListener("click", closePanel);
    panel.querySelectorAll("[data-qr-size]").forEach((button) => {
      button.addEventListener("click", () => changeSize(button.dataset.qrSize === "+" ? SIZE_STEP : -SIZE_STEP));
    });
    panel.querySelectorAll("[data-qr-position]").forEach((button) => {
      button.addEventListener("click", () => setPosition(button.dataset.qrPosition));
    });

    document.body.appendChild(panel);
    updatePositionButtons();
    return panel;
  }

  function setPosition(position) {
    if (!["top-left", "top-center", "top-right"].includes(position)) return;
    state.panel.dataset.position = position;
    writeStorage(STORAGE_POSITION, position);
    updatePositionButtons();
    placePanel();
  }

  function updatePositionButtons() {
    if (!state.panel) return;
    const position = state.panel.dataset.position || DEFAULT_POSITION;
    state.panel.querySelectorAll("[data-qr-position]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.qrPosition === position));
    });
  }

  function changeSize(delta) {
    if (!state.panel) return;
    const current = clamp(readNumber(STORAGE_SIZE, DEFAULT_SIZE), MIN_SIZE, MAX_SIZE);
    const next = clamp(current + delta, MIN_SIZE, MAX_SIZE);
    state.panel.style.setProperty("--page-qr-size", `${next}px`);
    const readout = state.panel.querySelector("#page-qr-size-readout");
    if (readout) readout.textContent = `${next}px`;
    writeStorage(STORAGE_SIZE, next);
  }

  function placePanel() {
    if (!state.panel || state.panel.hidden) return;
    const rect = state.topbar ? state.topbar.getBoundingClientRect() : null;
    const top = rect && rect.bottom > 0 ? Math.ceil(rect.bottom + 8) : 12;
    state.panel.style.setProperty("--page-qr-top", `${top}px`);
  }

  function loadQrLibrary() {
    if (
      (window.QRCode && typeof window.QRCode.toCanvas === "function") ||
      typeof window.qrcode === "function"
    ) {
      return Promise.resolve(window.QRCode || window.qrcode);
    }
    if (window.__pageQrLibraryPromise) return window.__pageQrLibraryPromise;

    window.__pageQrLibraryPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = getVendorUrl();
      script.async = true;
      script.onload = () => {
        if (window.QRCode && typeof window.QRCode.toCanvas === "function") {
          resolve(window.QRCode);
        } else if (typeof window.qrcode === "function") {
          resolve(window.qrcode);
        } else {
          reject(new Error("QRCode library unavailable"));
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return window.__pageQrLibraryPromise;
  }

  function drawQrWithGenerator(canvas, text) {
    if (!canvas || typeof window.qrcode !== "function") {
      throw new Error("qrcode-generator unavailable");
    }

    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();

    const ctx = canvas.getContext("2d");
    const size = 512;
    const quiet = 4;
    const count = qr.getModuleCount();
    const moduleCount = count + quiet * 2;
    const cell = size / moduleCount;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#0f172a";

    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        if (!qr.isDark(row, col)) continue;
        ctx.fillRect(
          Math.round((col + quiet) * cell),
          Math.round((row + quiet) * cell),
          Math.ceil(cell),
          Math.ceil(cell)
        );
      }
    }
  }

  function showFallbackImage() {
    const canvas = state.panel.querySelector("#page-qr-canvas");
    const image = state.panel.querySelector("#page-qr-img");
    const loading = state.panel.querySelector("#page-qr-loading");
    if (canvas) canvas.hidden = true;
    if (image) {
      image.hidden = false;
      image.src = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&margin=8&data=${encodeURIComponent(state.targetUrl)}`;
    }
    if (loading) loading.hidden = true;
  }

  async function renderQr() {
    if (state.qrReady || !state.panel) return;
    const canvas = state.panel.querySelector("#page-qr-canvas");
    const loading = state.panel.querySelector("#page-qr-loading");
    try {
      const QRCode = await loadQrLibrary();
      if (QRCode && typeof QRCode.toCanvas === "function") {
        await QRCode.toCanvas(canvas, state.targetUrl, {
          width: 512,
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff"
          }
        });
      } else {
        drawQrWithGenerator(canvas, state.targetUrl);
      }
      canvas.dataset.qrUrl = state.targetUrl;
      if (loading) loading.hidden = true;
      state.qrReady = true;
    } catch (error) {
      showFallbackImage();
      state.qrReady = true;
    }
  }

  function openPanel() {
    if (!state.panel) state.panel = createPanel();
    if (state.desktopOnly && !isDesktopScreen()) return;

    const urlLink = state.panel.querySelector("#page-qr-url");
    if (urlLink) {
      urlLink.href = state.targetUrl;
      urlLink.textContent = state.targetUrl;
      urlLink.title = state.targetUrl;
    }

    state.panel.hidden = false;
    state.button.setAttribute("aria-pressed", "true");
    placePanel();
    renderQr();
  }

  function closePanel() {
    if (!state.panel) return;
    state.panel.hidden = true;
    if (state.button) state.button.setAttribute("aria-pressed", "false");
  }

  function togglePanel() {
    if (state.panel && !state.panel.hidden) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function onResizeOrScroll() {
    if (state.desktopOnly && !isDesktopScreen()) closePanel();
    placePanel();
  }

  function init() {
    const bodyMode = document.body && document.body.dataset.pageQrDesktopOnly;
    const scriptMode = currentScript && currentScript.dataset.pageQrDesktopOnly;
    state.desktopOnly = bodyMode === "false" || scriptMode === "false" ? false : true;
    state.targetUrl = getTargetUrl();

    injectStyle();

    state.topbar = findTopbar();
    state.button = createButton();

    const host = getInsertionHost(state.topbar);
    if (host) {
      host.insertBefore(state.button, host.firstChild);
    } else {
      state.button.classList.add("page-qr-trigger--fixed");
      document.body.appendChild(state.button);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanel();
    });
    window.addEventListener("resize", onResizeOrScroll, { passive: true });
    window.addEventListener("scroll", onResizeOrScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
