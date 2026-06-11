(function () {
  "use strict";

  const MANIFEST_URL = "../articulation-cue-lab/assets/articulation/manifest.json";
  const ASSET_BASE = "../articulation-cue-lab/assets/articulation/";
  const STORAGE_KEY = "articulation-asset-sandbox-layers-v1";

  const presets = {
    plain: ["base-neutral", "velar-contact-highlight", "airflow-soft-out"],
    aspirated: ["velar-contact-highlight", "aspiration-inside-strong", "airflow-strong-out"],
    tense: ["tongue-b-high-back-emphasis", "vocal-fold-tension-cue", "airflow-contact-short"],
    compare: ["airflow-soft-out", "airflow-strong-out", "tongue-b-high-back-emphasis"],
  };

  const categoryLabels = {
    base: "기본",
    tongue: "혀",
    air: "숨",
    voice: "목",
    mouth: "입술",
    nasal: "코",
    place: "위치",
    sequence: "순서",
  };

  const state = {
    assets: [],
    layers: [],
    selectedId: null,
    filter: "all",
    search: "",
    drag: null,
    nextLayerId: 1,
  };

  const els = {
    assetGrid: document.getElementById("assetGrid"),
    assetSearch: document.getElementById("assetSearch"),
    filterButtons: Array.from(document.querySelectorAll(".filter-button")),
    presetButtons: Array.from(document.querySelectorAll(".preset-button")),
    stage: document.getElementById("assetStage"),
    selectedPreview: document.getElementById("selectedPreview"),
    selectedTitle: document.getElementById("selectedTitle"),
    selectedMeta: document.getElementById("selectedMeta"),
    xControl: document.getElementById("xControl"),
    yControl: document.getElementById("yControl"),
    scaleControl: document.getElementById("scaleControl"),
    rotateControl: document.getElementById("rotateControl"),
    opacityControl: document.getElementById("opacityControl"),
    bringForwardButton: document.getElementById("bringForwardButton"),
    sendBackwardButton: document.getElementById("sendBackwardButton"),
    duplicateButton: document.getElementById("duplicateButton"),
    deleteButton: document.getElementById("deleteButton"),
    clearButton: document.getElementById("clearButton"),
    exportButton: document.getElementById("exportButton"),
    layerList: document.getElementById("layerList"),
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function assetUrl(asset) {
    return ASSET_BASE + asset.file;
  }

  function categoryFor(asset) {
    if (asset.category && categoryLabels[asset.category]) return asset.category;
    if (asset.role === "base" || asset.id.includes("base")) return "base";
    if (asset.id.includes("mouth") || asset.id.includes("lip")) return "mouth";
    if (asset.id.includes("nasal")) return "nasal";
    if (asset.id.includes("place") || asset.id.includes("palate") || asset.id.includes("velum")) return "place";
    if (asset.id.includes("template") || asset.id.includes("sequence") || asset.id.includes("scale")) return "sequence";
    if (asset.id.includes("larynx") || asset.id.includes("vocal")) return "voice";
    if (asset.id.includes("air") || asset.id.includes("aspiration")) return "air";
    return "tongue";
  }

  function labelFor(asset) {
    return asset.id
      .replace(/^airflow-/, "air-")
      .replace(/^tongue-/, "tongue-")
      .replace(/-/g, " ");
  }

  function selectedLayer() {
    return state.layers.find((layer) => layer.layerId === state.selectedId) || null;
  }

  function saveLayers() {
    const snapshot = state.layers.map(({ layerId, assetId, x, y, scale, rotate, opacity, z }) => ({
      layerId,
      assetId,
      x,
      y,
      scale,
      rotate,
      opacity,
      z,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }

  function restoreLayers() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value) return false;
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) return false;
      state.layers = parsed
        .map((item) => {
          const asset = state.assets.find((candidate) => candidate.id === item.assetId);
          if (!asset) return null;
          return {
            layerId: Number(item.layerId),
            assetId: asset.id,
            x: Number(item.x),
            y: Number(item.y),
            scale: Number(item.scale),
            rotate: Number(item.rotate),
            opacity: Number(item.opacity),
            z: Number(item.z),
          };
        })
        .filter(Boolean);
      state.nextLayerId = Math.max(1, ...state.layers.map((layer) => layer.layerId + 1));
      state.selectedId = state.layers.length ? state.layers[state.layers.length - 1].layerId : null;
      return state.layers.length > 0;
    } catch (error) {
      return false;
    }
  }

  function addAsset(assetId, options = {}) {
    const asset = state.assets.find((item) => item.id === assetId);
    if (!asset) return null;
    const z = state.layers.length ? Math.max(...state.layers.map((layer) => layer.z)) + 1 : 1;
    const layer = {
      layerId: state.nextLayerId,
      assetId: asset.id,
      x: options.x ?? 50,
      y: options.y ?? 50,
      scale: options.scale ?? (asset.role === "base" ? 70 : 46),
      rotate: options.rotate ?? 0,
      opacity: options.opacity ?? 100,
      z,
    };
    state.nextLayerId += 1;
    state.layers.push(layer);
    state.selectedId = layer.layerId;
    renderStage();
    saveLayers();
    return layer;
  }

  function loadPreset(name) {
    const ids = presets[name] || presets.plain;
    state.layers = [];
    state.selectedId = null;
    const layouts = {
      plain: [
        { x: 37, y: 51, scale: 50 },
        { x: 64, y: 48, scale: 38, opacity: 86 },
        { x: 76, y: 52, scale: 32 },
      ],
      aspirated: [
        { x: 32, y: 50, scale: 42 },
        { x: 60, y: 50, scale: 42 },
        { x: 80, y: 50, scale: 36 },
      ],
      tense: [
        { x: 34, y: 50, scale: 42 },
        { x: 60, y: 50, scale: 42 },
        { x: 80, y: 50, scale: 34 },
      ],
      compare: [
        { x: 26, y: 50, scale: 35 },
        { x: 50, y: 50, scale: 35 },
        { x: 74, y: 50, scale: 35 },
      ],
    };
    ids.forEach((assetId, index) => addAsset(assetId, layouts[name][index]));
    state.selectedId = state.layers.length ? state.layers[state.layers.length - 1].layerId : null;
    renderAll();
    saveLayers();
  }

  function renderAssetGrid() {
    const term = state.search.trim().toLowerCase();
    const filtered = state.assets.filter((asset) => {
      const category = categoryFor(asset);
      const text = `${asset.id} ${asset.description || ""} ${categoryLabels[category] || category}`.toLowerCase();
      return (state.filter === "all" || category === state.filter) && (!term || text.includes(term));
    });

    els.assetGrid.innerHTML = "";
    filtered.forEach((asset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "asset-card";
      button.dataset.assetId = asset.id;
      button.innerHTML = `
        <img src="${assetUrl(asset)}" alt="">
        <span>${labelFor(asset)}</span>
      `;
      button.addEventListener("click", () => addAsset(asset.id));
      els.assetGrid.appendChild(button);
    });
  }

  function layerElement(layer) {
    const asset = state.assets.find((item) => item.id === layer.assetId);
    const element = document.createElement("div");
    element.className = "stage-layer";
    element.dataset.layerId = String(layer.layerId);
    element.style.setProperty("--x", layer.x);
    element.style.setProperty("--y", layer.y);
    element.style.setProperty("--scale", layer.scale);
    element.style.setProperty("--rotate", layer.rotate);
    element.style.setProperty("--opacity", layer.opacity / 100);
    element.style.zIndex = String(layer.z);
    element.innerHTML = `<img src="${assetUrl(asset)}" alt="">`;
    element.classList.toggle("is-selected", layer.layerId === state.selectedId);
    element.addEventListener("pointerdown", (event) => startDrag(event, layer.layerId));
    return element;
  }

  function renderStage() {
    els.stage.innerHTML = "";
    state.layers
      .slice()
      .sort((a, b) => a.z - b.z)
      .forEach((layer) => {
        els.stage.appendChild(layerElement(layer));
      });
    renderControls();
    renderLayerList();
  }

  function renderControls() {
    const layer = selectedLayer();
    const asset = layer ? state.assets.find((item) => item.id === layer.assetId) : null;
    const controls = [els.xControl, els.yControl, els.scaleControl, els.rotateControl, els.opacityControl];
    controls.forEach((control) => {
      control.disabled = !layer;
    });
    [els.bringForwardButton, els.sendBackwardButton, els.duplicateButton, els.deleteButton].forEach((button) => {
      button.disabled = !layer;
    });

    if (!layer || !asset) {
      els.selectedPreview.removeAttribute("src");
      els.selectedTitle.textContent = "선택 없음";
      els.selectedMeta.textContent = "에셋을 선택하세요";
      return;
    }

    els.selectedPreview.src = assetUrl(asset);
    els.selectedTitle.textContent = labelFor(asset);
    els.selectedMeta.textContent = categoryLabels[categoryFor(asset)] || categoryFor(asset);
    els.xControl.value = String(Math.round(layer.x));
    els.yControl.value = String(Math.round(layer.y));
    els.scaleControl.value = String(Math.round(layer.scale));
    els.rotateControl.value = String(Math.round(layer.rotate));
    els.opacityControl.value = String(Math.round(layer.opacity));
  }

  function renderLayerList() {
    els.layerList.innerHTML = "";
    state.layers
      .slice()
      .sort((a, b) => b.z - a.z)
      .forEach((layer) => {
        const asset = state.assets.find((item) => item.id === layer.assetId);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "layer-item";
        button.classList.toggle("is-selected", layer.layerId === state.selectedId);
        button.innerHTML = `
          <img src="${assetUrl(asset)}" alt="">
          <span>${labelFor(asset)}</span>
        `;
        button.addEventListener("click", () => {
          state.selectedId = layer.layerId;
          renderStage();
        });
        els.layerList.appendChild(button);
      });
  }

  function renderFilters() {
    els.filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === state.filter);
    });
  }

  function renderAll() {
    renderFilters();
    renderAssetGrid();
    renderStage();
  }

  function updateSelected(updates) {
    const layer = selectedLayer();
    if (!layer) return;
    Object.assign(layer, updates);
    renderStage();
    saveLayers();
  }

  function startDrag(event, layerId) {
    const layer = state.layers.find((item) => item.layerId === layerId);
    if (!layer) return;
    state.selectedId = layerId;
    const rect = els.stage.getBoundingClientRect();
    const pointer = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
    state.drag = {
      layerId,
      offsetX: pointer.x - layer.x,
      offsetY: pointer.y - layer.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    renderStage();
  }

  function handlePointerMove(event) {
    if (!state.drag) return;
    const layer = state.layers.find((item) => item.layerId === state.drag.layerId);
    if (!layer) return;
    const rect = els.stage.getBoundingClientRect();
    layer.x = clamp(((event.clientX - rect.left) / rect.width) * 100 - state.drag.offsetX, 0, 100);
    layer.y = clamp(((event.clientY - rect.top) / rect.height) * 100 - state.drag.offsetY, 0, 100);
    const element = els.stage.querySelector(`[data-layer-id="${layer.layerId}"]`);
    if (element) {
      element.style.setProperty("--x", layer.x);
      element.style.setProperty("--y", layer.y);
    }
    renderControls();
  }

  function handlePointerUp() {
    if (!state.drag) return;
    state.drag = null;
    saveLayers();
  }

  function moveZ(delta) {
    const layer = selectedLayer();
    if (!layer) return;
    layer.z += delta;
    const sorted = state.layers.slice().sort((a, b) => a.z - b.z);
    sorted.forEach((item, index) => {
      item.z = index + 1;
    });
    renderStage();
    saveLayers();
  }

  function duplicateSelected() {
    const layer = selectedLayer();
    if (!layer) return;
    const duplicate = addAsset(layer.assetId, {
      x: clamp(layer.x + 5, 0, 100),
      y: clamp(layer.y + 5, 0, 100),
      scale: layer.scale,
      rotate: layer.rotate,
      opacity: layer.opacity,
    });
    if (duplicate) state.selectedId = duplicate.layerId;
    renderStage();
    saveLayers();
  }

  function deleteSelected() {
    const layer = selectedLayer();
    if (!layer) return;
    state.layers = state.layers.filter((item) => item.layerId !== layer.layerId);
    state.selectedId = state.layers.length ? state.layers[state.layers.length - 1].layerId : null;
    renderStage();
    saveLayers();
  }

  function clearAll() {
    state.layers = [];
    state.selectedId = null;
    localStorage.removeItem(STORAGE_KEY);
    renderStage();
  }

  async function exportPng() {
    const rect = els.stage.getBoundingClientRect();
    const width = 1600;
    const height = Math.round(width * (rect.height / rect.width));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fbf7ee");
    gradient.addColorStop(0.6, "#f3f8f6");
    gradient.addColorStop(1, "#fff2e4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const layers = state.layers.slice().sort((a, b) => a.z - b.z);
    for (const layer of layers) {
      const asset = state.assets.find((item) => item.id === layer.assetId);
      if (!asset) continue;
      const img = await loadImage(assetUrl(asset));
      const drawWidth = width * (layer.scale / 100);
      const drawHeight = drawWidth * (img.naturalHeight / img.naturalWidth);
      const x = width * (layer.x / 100);
      const y = height * (layer.y / 100);
      ctx.save();
      ctx.globalAlpha = layer.opacity / 100;
      ctx.translate(x, y);
      ctx.rotate((layer.rotate * Math.PI) / 180);
      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();
    }

    const link = document.createElement("a");
    link.download = "articulation-sandbox.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  function bindEvents() {
    els.assetSearch.addEventListener("input", () => {
      state.search = els.assetSearch.value;
      renderAssetGrid();
    });

    els.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        renderFilters();
        renderAssetGrid();
      });
    });

    els.presetButtons.forEach((button) => {
      button.addEventListener("click", () => loadPreset(button.dataset.preset));
    });

    els.stage.addEventListener("pointermove", handlePointerMove);
    els.stage.addEventListener("pointerup", handlePointerUp);
    els.stage.addEventListener("pointercancel", handlePointerUp);
    els.stage.addEventListener("pointerleave", handlePointerUp);

    els.xControl.addEventListener("input", () => updateSelected({ x: Number(els.xControl.value) }));
    els.yControl.addEventListener("input", () => updateSelected({ y: Number(els.yControl.value) }));
    els.scaleControl.addEventListener("input", () => updateSelected({ scale: Number(els.scaleControl.value) }));
    els.rotateControl.addEventListener("input", () => updateSelected({ rotate: Number(els.rotateControl.value) }));
    els.opacityControl.addEventListener("input", () => updateSelected({ opacity: Number(els.opacityControl.value) }));

    els.bringForwardButton.addEventListener("click", () => moveZ(2));
    els.sendBackwardButton.addEventListener("click", () => moveZ(-2));
    els.duplicateButton.addEventListener("click", duplicateSelected);
    els.deleteButton.addEventListener("click", deleteSelected);
    els.clearButton.addEventListener("click", clearAll);
    els.exportButton.addEventListener("click", exportPng);
  }

  async function loadAssetManifest() {
    if (window.ARTICULATION_ASSET_MANIFEST) {
      return window.ARTICULATION_ASSET_MANIFEST;
    }

    const response = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load articulation manifest: ${response.status}`);
    }
    return response.json();
  }

  async function init() {
    const manifest = await loadAssetManifest();
    state.assets = manifest.assets.map((asset) => ({
      ...asset,
      category: categoryFor(asset),
    }));
    bindEvents();
    if (!restoreLayers()) loadPreset("plain");
    renderAll();
  }

  init().catch(() => {
    els.assetGrid.innerHTML = '<div class="asset-card"><span>에셋 로드 실패</span></div>';
  });
})();
