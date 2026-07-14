(function semanticVisualSystemFactory(global) {
  "use strict";

  const COMPONENTS = Object.freeze([
    "SET_BOUNDARY",
    "PARTICIPANT_FOCUS",
    "RELATION_STATE",
    "CONTRAST_FORK",
    "ORDERED_SCALE",
    "STEP_SEQUENCE",
    "FEATURE_BUNDLE",
    "FORM_ASSEMBLER"
  ]);

  const STATE_CHANNELS = Object.freeze([
    "position",
    "order",
    "shape",
    "outline",
    "symbol",
    "connection",
    "quantity",
    "visibility",
    "sequence"
  ]);

  const POLICY = Object.freeze({
    allowedOrigins: Object.freeze(["CODE", "INLINE_SVG", "AI_GENERATED"]),
    generatedFormat: "WEBP",
    generatedMime: "image/webp",
    maxLongEdge: 960,
    maxFileBytes: 80 * 1024,
    maxImagesPerPage: 2,
    maxBytesPerPage: 160 * 1024,
    maxImagesPerBatch: 6,
    maxBytesPerBatch: 480 * 1024
  });

  const MARKUP = Object.freeze({
    SET_BOUNDARY: `
      <span class="sv-boundary" data-sv-part="boundary"></span>
      <span class="sv-token sv-token-a" data-sv-part="member-a"></span>
      <span class="sv-token sv-token-b" data-sv-part="member-b"></span>
      <span class="sv-token sv-token-c" data-sv-part="member-c"></span>
    `,
    PARTICIPANT_FOCUS: `
      <span class="sv-person sv-person-a" data-sv-part="participant-a"></span>
      <span class="sv-person sv-person-b" data-sv-part="participant-b"></span>
      <span class="sv-focus-ring" data-sv-part="focus"></span>
      <span class="sv-focus-link" data-sv-part="shared-link"></span>
    `,
    RELATION_STATE: `
      <span class="sv-node sv-node-a" data-sv-part="participant-a"></span>
      <span class="sv-node sv-node-b" data-sv-part="participant-b"></span>
      <span class="sv-relation-line" data-sv-part="relation"></span>
      <span class="sv-relation-mark" data-sv-part="relation-state"></span>
    `,
    CONTRAST_FORK: `
      <span class="sv-fork-stem" data-sv-part="source"></span>
      <span class="sv-branch sv-branch-a" data-sv-part="path-a"></span>
      <span class="sv-branch sv-branch-b" data-sv-part="path-b"></span>
      <span class="sv-path-marker sv-path-a" data-sv-part="result-a"></span>
      <span class="sv-path-marker sv-path-b" data-sv-part="result-b"></span>
    `,
    ORDERED_SCALE: `
      <span class="sv-scale-track" data-sv-part="scale"></span>
      <span class="sv-threshold" data-sv-part="threshold"></span>
      <span class="sv-value" data-sv-part="value"></span>
    `,
    STEP_SEQUENCE: `
      <span class="sv-sequence-line" data-sv-part="connection"></span>
      <span class="sv-step sv-step-a" data-sv-part="step-a"></span>
      <span class="sv-step sv-step-b" data-sv-part="step-b"></span>
      <span class="sv-step sv-step-c" data-sv-part="step-c"></span>
      <span class="sv-step sv-step-d" data-sv-part="step-d"></span>
    `,
    FEATURE_BUNDLE: `
      <span class="sv-feature-links" data-sv-part="connections"></span>
      <span class="sv-feature-core" data-sv-part="entity"></span>
      <span class="sv-feature sv-feature-a" data-sv-part="feature-a"></span>
      <span class="sv-feature sv-feature-b" data-sv-part="feature-b"></span>
      <span class="sv-feature sv-feature-c" data-sv-part="feature-c"></span>
      <span class="sv-feature sv-feature-d" data-sv-part="feature-d"></span>
    `,
    FORM_ASSEMBLER: `
      <span class="sv-meaning-shape" data-sv-part="meaning"></span>
      <span class="sv-assembly-arrow" data-sv-part="direction"></span>
      <span class="sv-slot sv-slot-a" data-sv-part="slot-a"></span>
      <span class="sv-slot sv-slot-b" data-sv-part="slot-b"></span>
      <span class="sv-slot sv-slot-c" data-sv-part="slot-c"></span>
      <span class="sv-tile sv-tile-a" data-sv-part="tile-a"></span>
      <span class="sv-tile sv-tile-b" data-sv-part="tile-b"></span>
      <span class="sv-tile sv-tile-c" data-sv-part="tile-c"></span>
    `
  });

  function elements(root, selector) {
    if (!root || typeof root.querySelectorAll !== "function") {
      return [];
    }
    return Array.from(root.querySelectorAll(selector));
  }

  function init(root) {
    const scope = root || global.document;
    elements(scope, "[data-semantic-visual]").forEach(initComponent);
    wireImageFallback(scope);
    return scope;
  }

  function initComponent(component) {
    const type = component.getAttribute("data-sv-component");
    const graphic = component.querySelector("[data-sv-graphic]");
    const initialState = component.getAttribute("data-visual-state") || "";
    const meaningRef = component.getAttribute("data-meaning-ref") || "";
    const accessibleFallbackRef = component.getAttribute("data-accessible-fallback-ref");

    if (accessibleFallbackRef && !component.getAttribute("aria-describedby")) {
      component.setAttribute("aria-describedby", accessibleFallbackRef);
    }

    if (graphic && COMPONENTS.includes(type)) {
      if (!graphic.children.length) {
        graphic.innerHTML = MARKUP[type];
      }
      graphic.setAttribute("data-meaning-ref", meaningRef);
      graphic.setAttribute("data-visual-state", initialState);
      graphic.setAttribute("data-copy-layer", graphic.getAttribute("data-copy-layer") || "PRIMARY");
      graphic.setAttribute("data-nontext-visual", "");
      graphic.setAttribute("aria-hidden", "true");
    }

    elements(component, "[data-sv-choice]").forEach((choice) => {
      if (choice.tagName === "BUTTON" && !choice.getAttribute("type")) {
        choice.setAttribute("type", "button");
      }
      if (!choice.getAttribute("data-copy-layer")) {
        choice.setAttribute("data-copy-layer", "PRIMARY");
      }
      choice.setAttribute(
        "aria-pressed",
        String(choice.getAttribute("data-state-value") === initialState)
      );
      if (choice.getAttribute("data-sv-bound") === "true") {
        return;
      }
      choice.setAttribute("data-sv-bound", "true");
      choice.addEventListener("pointerdown", (event) => {
        component.__svInputSource = event.pointerType || "pointer";
      });
      choice.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          component.__svInputSource = "keyboard";
        }
      });
      choice.addEventListener("click", () => {
        const nextState = choice.getAttribute("data-state-value");
        const source = component.__svInputSource || "activation";
        component.__svInputSource = "";
        applyState(component, nextState, source, choice);
      });
    });

    component.setAttribute("data-sv-ready", "true");
    return component;
  }

  function applyState(component, state, source, choice) {
    if (!component || !state || !/^[A-Za-z0-9_-]+$/.test(state)) {
      return false;
    }
    const before = component.getAttribute("data-visual-state") || "";
    const graphic = component.querySelector("[data-sv-graphic]");
    component.setAttribute("data-visual-state", state);
    if (graphic) {
      graphic.setAttribute("data-visual-state", state);
    }

    elements(component, "[data-sv-choice]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-state-value") === state)
      );
    });

    elements(component, "[data-sv-state-panel]").forEach((panel) => {
      const visibleStates = (panel.getAttribute("data-show-for") || "")
        .split(/\s+/)
        .filter(Boolean);
      panel.hidden = !visibleStates.includes(state);
    });

    const live = component.querySelector("[data-sv-live]");
    const announcement = choice && choice.getAttribute("data-state-announcement");
    if (live && announcement) {
      live.textContent = announcement;
    }

    const view = component.ownerDocument && component.ownerDocument.defaultView;
    const EventConstructor = view && view.CustomEvent;
    if (EventConstructor) {
      component.dispatchEvent(new EventConstructor("semanticvisualchange", {
        bubbles: true,
        detail: {
          before,
          state,
          source: source || "programmatic",
          component: component.getAttribute("data-sv-component"),
          meaningRef: component.getAttribute("data-meaning-ref"),
          interactionRef: component.getAttribute("data-interaction-ref")
        }
      }));
    }
    return true;
  }

  function wireImageFallback(root) {
    elements(root, "img[data-ai-generated]").forEach((image) => {
      if (image.getAttribute("data-sv-error-bound") === "true") {
        return;
      }
      image.setAttribute("data-sv-error-bound", "true");
      image.addEventListener("error", () => failImage(image));
    });
  }

  function failImage(image) {
    if (!image) {
      return false;
    }
    image.hidden = true;
    image.setAttribute("data-asset-failed", "true");
    const fallbackId = image.getAttribute("data-fallback-ref");
    const doc = image.ownerDocument;
    const fallback = fallbackId && doc && doc.getElementById(fallbackId);
    if (fallback) {
      fallback.hidden = false;
      fallback.setAttribute("data-image-fallback-active", "true");
      return true;
    }
    return false;
  }

  function forceImageFailure(root) {
    const scope = root || global.document;
    return elements(scope, "img[data-ai-generated]").map((image) => ({
      assetRef: image.getAttribute("data-asset-ref"),
      fallbackActivated: failImage(image)
    }));
  }

  function setCopyHidden(root, hidden) {
    const scope = root || global.document;
    const target = scope.documentElement || scope;
    if (!target || !target.classList) {
      return false;
    }
    target.classList.toggle("sv-qa-hide-copy", Boolean(hidden));
    return target.classList.contains("sv-qa-hide-copy");
  }

  function isRemote(value) {
    return /^(?:https?:)?\/\//i.test(String(value || "").trim());
  }

  function audit(root, manifest, options) {
    const scope = root || global.document;
    const records = Array.isArray(manifest)
      ? manifest
      : (manifest && Array.isArray(manifest.assets) ? manifest.assets : []);
    const settings = options || {};
    const findings = [];
    const add = (id, message, node) => {
      findings.push({
        id,
        message,
        element: node && node.outerHTML ? node.outerHTML.slice(0, 240) : null
      });
    };

    elements(scope, "[data-semantic-visual]").forEach((component) => {
      const type = component.getAttribute("data-sv-component");
      const channels = (component.getAttribute("data-state-change-channels") || "")
        .split(/\s+/)
        .filter(Boolean);
      const graphic = component.querySelector("[data-sv-graphic]");
      const fallbackRef = component.getAttribute("data-accessible-fallback-ref");
      const fallback = fallbackRef &&
        component.ownerDocument &&
        component.ownerDocument.getElementById(fallbackRef);
      if (!COMPONENTS.includes(type)) {
        add("visual:meaning-bearing", "Unknown semantic visual component.", component);
      }
      if (!component.getAttribute("data-meaning-ref") ||
          !component.getAttribute("data-interaction-ref") ||
          !component.getAttribute("data-visual-state")) {
        add("visual:meaning-bearing", "Meaning, interaction, or visual state ref is missing.", component);
      }
      if (!channels.some((channel) => STATE_CHANNELS.includes(channel))) {
        add("visual:observable-state-change", "No approved non-text state channel is declared.", component);
      }
      if (!graphic ||
          !graphic.hasAttribute("data-nontext-visual") ||
          !graphic.getAttribute("data-meaning-ref") ||
          !graphic.getAttribute("data-visual-state") ||
          !graphic.getAttribute("data-copy-layer")) {
        add("visual:meaning-bearing", "The observable graphic contract is incomplete.", component);
      }
      if (!fallbackRef || !fallback) {
        add("visual:meaning-bearing", "The approved accessible fallback is missing.", component);
      }

      const choices = elements(component, "[data-sv-choice]");
      const stateValues = choices.map((choice) => choice.getAttribute("data-state-value"));
      if (!choices.length || choices.some((choice) => choice.tagName !== "BUTTON")) {
        add("visual:keyboard-touch", "Use at least one native button choice.", component);
      }
      if (choices.some((choice) => !choice.getAttribute("data-copy-layer"))) {
        add("language:copy-inventory", "Every learner choice needs a copy layer.", component);
      }
      if (stateValues.some((state) => !state) ||
          new Set(stateValues).size !== stateValues.length) {
        add("visual:branch-states", "Each choice needs a unique visual state.", component);
      }
    });

    elements(scope, '[data-copy-layer="TEACHER_ONLY"]').forEach((node) => {
      add("language:teacher-only-hidden", "TEACHER_ONLY must be absent, not CSS-hidden.", node);
    });

    elements(scope, '[data-copy-layer="OPTIONAL_HELP"]').forEach((node) => {
      const details = node.closest && node.closest("details");
      if (!node.hidden && (!details || details.open)) {
        add("language:optional-help-default-closed", "Optional help is initially visible.", node);
      }
    });

    elements(scope, "video").forEach((node) => {
      add("media:no-video", "Video is forbidden.", node);
    });

    elements(scope, "img[src], source[src], source[srcset], link[href], script[src], image[href], use[href]")
      .forEach((node) => {
        const value = node.getAttribute("src") ||
          node.getAttribute("srcset") ||
          node.getAttribute("href") || "";
        if (isRemote(value)) {
          add("media:no-remote-visual-assets", "Remote visual, CSS, font, or script URL found.", node);
        }
      });

    const recordById = new Map();
    records.forEach((record) => {
      if (!record.id || recordById.has(record.id)) {
        add("visual:asset-policy", "Every asset needs a unique manifest id.");
      } else {
        recordById.set(record.id, record);
      }
    });
    elements(scope, "img").forEach((image) => {
      const assetRef = image.getAttribute("data-asset-ref");
      const record = recordById.get(assetRef);
      if (!assetRef || !record) {
        add("media:no-stock-photo", "Raster images require an AI_GENERATED manifest record.", image);
        return;
      }
      if (record.origin !== "AI_GENERATED") {
        add("media:no-stock-photo", "Raster image origin is not AI_GENERATED.", image);
      }
      if (!image.hasAttribute("data-ai-generated")) {
        add("media:generated-webp-only", "Generated raster image lacks its policy marker.", image);
      }
      const imageSource = image.getAttribute("src") || "";
      if (!/\.webp(?:[?#].*)?$/i.test(imageSource) || isRemote(imageSource)) {
        add("media:generated-webp-only", "Rendered generated image source must be local WebP.", image);
      }
      const normalizedSource = imageSource.replace(/^\.\//, "");
      const normalizedRecordPath = String(record.path || "").replace(/^\.\//, "");
      if (normalizedSource !== normalizedRecordPath) {
        add("visual:asset-policy", "Rendered image source does not match its manifest path.", image);
      }
      if (!image.hasAttribute("alt")) {
        add("visual:asset-fallback", "Generated image needs approved alt text.", image);
      }
      const fallbackId = image.getAttribute("data-fallback-ref");
      if (!fallbackId || !image.ownerDocument.getElementById(fallbackId)) {
        add("visual:asset-fallback", "Generated image has no code-native DOM fallback.", image);
      }
    });

    records.forEach((record) => {
      if (!POLICY.allowedOrigins.includes(record.origin)) {
        add("media:no-stock-photo", "Asset origin is not allowed.");
      }
      if (record.origin !== "AI_GENERATED") {
        return;
      }
      const path = String(record.path || "");
      if (isRemote(path)) {
        add("media:no-remote-visual-assets", "Generated image path is remote.");
      }
      if (!/\.webp$/i.test(path) ||
          String(record.format || "").toUpperCase() !== POLICY.generatedFormat ||
          String(record.mime || "").toLowerCase() !== POLICY.generatedMime) {
        add("media:generated-webp-only", "Generated image must be local WebP.");
      }
      if (!Number.isFinite(record.bytes) || record.bytes > POLICY.maxFileBytes) {
        add("media:generated-image-budget", "Generated image exceeds 80 KiB or has no byte size.");
      }
      if (!Number.isFinite(record.width) ||
          !Number.isFinite(record.height) ||
          Math.max(record.width, record.height) > POLICY.maxLongEdge) {
        add("media:generated-image-budget", "Generated image exceeds 960 px or lacks dimensions.");
      }
      if (!/^[a-f0-9]{64}$/.test(String(record.sha256 || "")) ||
          !record.prompt ||
          !record.tool ||
          !/^\d{4}-\d{2}-\d{2}$/.test(String(record.generation_date || "")) ||
          !Array.isArray(record.meaning_refs) ||
          !record.meaning_refs.length ||
          !record.alt_ref ||
          !record.fallback_ref) {
        add("visual:asset-policy", "Generated image manifest metadata is incomplete.");
      }
    });

    const generated = records.filter((record) => record.origin === "AI_GENERATED");
    const generatedBytes = generated.reduce(
      (total, record) => total + (Number.isFinite(record.bytes) ? record.bytes : 0),
      0
    );
    const imageLimit = settings.batch ? POLICY.maxImagesPerBatch : POLICY.maxImagesPerPage;
    const byteLimit = settings.batch ? POLICY.maxBytesPerBatch : POLICY.maxBytesPerPage;
    if (generated.length > imageLimit || generatedBytes > byteLimit) {
      add(
        "media:generated-image-budget",
        settings.batch
          ? "Seven-page generated-image batch exceeds six files or 480 KiB."
          : "Page exceeds two generated images or 160 KiB."
      );
    }

    return findings;
  }

  const api = Object.freeze({
    components: COMPONENTS,
    stateChannels: STATE_CHANNELS,
    policy: POLICY,
    init,
    applyState,
    audit,
    setCopyHidden,
    forceImageFailure
  });

  global.SemanticVisualSystem = api;

  if (global.document) {
    if (global.document.readyState === "loading") {
      global.document.addEventListener("DOMContentLoaded", () => init(global.document));
    } else {
      init(global.document);
    }
  }
}(typeof window !== "undefined" ? window : globalThis));
