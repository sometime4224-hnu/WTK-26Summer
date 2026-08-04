(function () {
  "use strict";
  const HOMEWORK = window.REVIEW5_DATA && window.REVIEW5_DATA.sections.longWriting.homework;
  const ROWS = 25, COLUMNS = 20, MAX_CELLS = ROWS * COLUMNS;
  const STORAGE_KEY = "review5-long-writing:longWriting:v2";
  const FALLBACK_KEY = "review5-long-writing:longWriting:recovery-v2";
  const $ = (id) => document.getElementById(id);
  const input = $("manuscriptInput"), nameInput = $("studentName"), notesInput = $("planningNotes"), grid = $("manuscriptGrid");
  const countEl = $("characterCount"), statusEl = $("writingStatus"), submitButton = $("submitWritingButton");
  let saveTimer = 0, composing = false, submitting = false, recoveryRaw = "", lastTrigger = null, limitAttempted = false, compositionSnapshot = null, submissionResult = null;

  function normalize(value) { return String(value == null ? "" : value).replace(/\r\n?/g, "\n").normalize("NFC"); }
  function codePoints(value) { return Array.from(normalize(value)); }
  function count(value) { return codePoints(value).filter((character) => character !== "\n").length; }
  function layout(value) {
    let row = 0, column = 0, accepted = "", overflow = false;
    for (const character of codePoints(value)) {
      if (character === "\n") { if (row >= ROWS - 1) { overflow = true; break; } accepted += character; row += 1; column = 0; continue; }
      if (row >= ROWS) { overflow = true; break; }
      accepted += character; column += 1;
      if (column === COLUMNS) { column = 0; row += 1; }
    }
    return { text: accepted, overflow, count: count(accepted), row, column, fits: !overflow && count(accepted) <= MAX_CELLS };
  }
  function setStatus(message, error) { statusEl.textContent = message; statusEl.classList.toggle("is-error", Boolean(error)); }
  function activeIndex(value, selection) {
    const before = normalize(value).slice(0, selection); let row = 0, col = 0;
    for (const character of Array.from(before)) { if (character === "\n") { row += 1; col = 0; } else { col += 1; if (col === COLUMNS) { row += 1; col = 0; } } }
    return Math.min(MAX_CELLS - 1, Math.max(0, row * COLUMNS + col));
  }
  function render() {
    const model = layout(input.value); if (input.value !== model.text) { const caret = Math.min(input.selectionStart, model.text.length); input.value = model.text; input.setSelectionRange(caret, caret); }
    const cells = Array(MAX_CELLS).fill(""); let row = 0, col = 0;
    for (const character of codePoints(model.text)) { if (character === "\n") { row += 1; col = 0; continue; } if (row < ROWS) cells[row * COLUMNS + col] = character; col += 1; if (col === COLUMNS) { row += 1; col = 0; } }
    const active = activeIndex(input.value, input.selectionStart);
    grid.replaceChildren(...cells.map((character, index) => { const cell = document.createElement("span"); cell.className = "manuscript-cell" + (index === active ? " is-active" : ""); cell.textContent = character; return cell; }));
    const characterCount = model.count;
    countEl.textContent = `${characterCount} / ${HOMEWORK.minCharacterCount}~${HOMEWORK.maxCharacterCount}자`;
    const valid = characterCount >= HOMEWORK.minCharacterCount && characterCount <= HOMEWORK.maxCharacterCount && model.fits && normalize(nameInput.value).trim().length > 0;
    submitButton.disabled = !valid || submitting;
    if (submissionResult) setStatus(submissionResult.message, submissionResult.error);
    else if (limitAttempted || model.overflow || characterCount > HOMEWORK.maxCharacterCount) setStatus("500칸까지만 쓸 수 있습니다. 501번째 글자는 넣지 않았습니다.", true);
    else if (characterCount === 399) setStatus("399자입니다. 한 자를 더 쓰면 제출할 수 있습니다.");
    else if (characterCount === 400) setStatus("400자입니다. 이제 제출할 수 있습니다.");
    else if (characterCount === 500) setStatus("500자입니다. 마지막 한 칸까지 썼습니다.");
    else if (characterCount < HOMEWORK.minCharacterCount) setStatus(`${HOMEWORK.minCharacterCount - characterCount}자를 더 쓰세요.`);
    else setStatus("제출할 수 있습니다.");
  }
  function currentRecord() { return { version: 2, studentName: normalize(nameInput.value), planningNotes: normalize(notesInput.value), responseText: normalize(input.value) }; }
  function currentRecoveryText() { const record = currentRecord(); return `복습 5 장문 쓰기 현재 작업\n\n이름\n${record.studentName}\n\n계획 메모\n${record.planningNotes}\n\n최종 글\n${record.responseText}`; }
  function showSaveFailure() { $("saveFailureRecovery").hidden = false; setStatus("이 기기에 저장하지 못했습니다. 현재 작업을 복사하거나 내려받아 보관하세요.", true); }
  function showResetFailure() { $("saveFailureRecovery").hidden = false; setStatus("이 페이지를 초기화하지 못했습니다. 현재 작업을 복사하거나 내려받아 보관하세요.", true); }
  function flush() { clearTimeout(saveTimer); try { localStorage.setItem(recoveryRaw ? FALLBACK_KEY : STORAGE_KEY, JSON.stringify(currentRecord())); return true; } catch (error) { showSaveFailure(); return false; } }
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 450); }
  function applyRecord(raw) { const record = JSON.parse(raw); if (!record || record.version !== 2) throw new Error("version"); nameInput.value = normalize(record.studentName); notesInput.value = normalize(record.planningNotes); input.value = layout(record.responseText).text; }
  function restore() {
    let raw = "", fallback = "";
    try { raw = localStorage.getItem(STORAGE_KEY); fallback = localStorage.getItem(FALLBACK_KEY); }
    catch (error) { showSaveFailure(); return; }
    if (raw) {
      try { applyRecord(raw); return; }
      catch (error) { recoveryRaw = raw; $("recoveryNotice").hidden = false; }
    }
    if (fallback) {
      try { applyRecord(fallback); }
      catch (error) { showSaveFailure(); }
    }
  }
  function isFit(text) { return layout(text).text === normalize(text) && !layout(text).overflow; }
  function insertRespectingSuffix(insertion, snapshot) {
    const source = snapshot || { value: input.value, start: input.selectionStart, end: input.selectionEnd };
    const before = source.value.slice(0, source.start), after = source.value.slice(source.end);
    let accepted = "";
    for (const character of Array.from(normalize(insertion))) { if (isFit(before + accepted + character + after)) accepted += character; else { limitAttempted = true; break; } }
    input.value = before + accepted + after;
    const next = before.length + accepted.length;
    input.setSelectionRange(next, next);
    render(); scheduleSave();
  }
  function handleBeforeInput(event) {
    if (composing || event.isComposing || !event.inputType.startsWith("insert") || event.data == null) return;
    const before = input.value.slice(0, input.selectionStart), after = input.value.slice(input.selectionEnd), insertion = normalize(event.data);
    if (!isFit(before + insertion + after)) { event.preventDefault(); insertRespectingSuffix(insertion); }
  }
  function onInput() { if (composing) return; const model = layout(input.value); limitAttempted = model.text !== normalize(input.value); if (limitAttempted) { const caret = Math.min(input.selectionStart, model.text.length); input.value = model.text; input.setSelectionRange(caret, caret); } render(); scheduleSave(); }
  function finishComposition() {
    composing = false;
    const snapshot = compositionSnapshot;
    compositionSnapshot = null;
    if (!snapshot) { onInput(); return; }
    const before = snapshot.value.slice(0, snapshot.start), after = snapshot.value.slice(snapshot.end);
    const composed = normalize(input.value);
    const insertion = composed.startsWith(before) && composed.endsWith(after)
      ? composed.slice(before.length, composed.length - after.length)
      : "";
    if (!isFit(before + insertion + after)) {
      input.value = snapshot.value;
      input.setSelectionRange(snapshot.start, snapshot.end);
      insertRespectingSuffix(insertion, snapshot);
      return;
    }
    onInput();
  }
  function normalizeName(value) { return normalize(value).trim().replace(/\s+/g, " "); }
  function signature(value) { let hash = 2166136261; const text = `${HOMEWORK.assignmentId}\u001f${normalize(value)}`; for (const unit of text) { hash ^= unit.codePointAt(0); hash = Math.imul(hash, 16777619); } return `lw2-${(hash >>> 0).toString(16).padStart(8, "0")}`; }
  function payload() { const text = normalize(input.value), characterCount = count(text); return { assignmentId: HOMEWORK.assignmentId, assignmentTitle: HOMEWORK.title, chapter: "review5", sectionId: HOMEWORK.sectionId, sectionTitle: "장문 쓰기", submissionKind: "writing", studentName: normalizeName(nameInput.value), responseText: text, responseCharacterCount: characterCount, minCharacterCount: HOMEWORK.minCharacterCount, maxCharacterCount: HOMEWORK.maxCharacterCount, completed: true, clientSubmittedAt: new Date().toISOString(), signatureHash: signature(text) }; }
  async function submit() {
    flush();
    const data = payload();
    if (submitButton.disabled || submitting) { setStatus("이름과 400~500자를 확인하세요.", true); return; }
    submissionResult = null;
    submitting = true;
    render();
    try {
      if (!window.HomeworkSubmitter || typeof window.HomeworkSubmitter.submitHomework !== "function") throw new Error("제출 기능을 준비하지 못했습니다.");
      await window.HomeworkSubmitter.submitHomework(data);
      submissionResult = { message: "온라인 제출이 완료되었습니다.", error: false };
    } catch (error) {
      submissionResult = { message: "온라인 제출에 실패했습니다. 원고는 이 기기에 남아 있습니다. 다시 시도하세요.", error: true };
    } finally {
      submitting = false;
      render();
    }
  }
  function fallbackCopy(value) {
    const temporary = document.createElement("textarea");
    try {
      temporary.value = String(value);
      temporary.setAttribute("aria-hidden", "true");
      temporary.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(temporary);
      temporary.focus();
      temporary.select();
      return document.execCommand("copy") === true;
    } catch (error) {
      return false;
    } finally {
      temporary.remove();
    }
  }
  async function copyText(value) {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus("복사했습니다.");
      return true;
    } catch (error) {
      if (fallbackCopy(value)) { setStatus("복사했습니다."); return true; }
      setStatus("복사하지 못했습니다. 내려받기를 이용하세요.", true);
      return false;
    }
  }
  function download(value, filename) { const blob = new Blob([value], { type: "text/plain;charset=utf-8" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 0); }
  function closeHelp() { $("writingHelp").setAttribute("aria-hidden", "true"); $("helpBackdrop").hidden = true; (lastTrigger || $("helpOpenButton")).focus(); }
  function openHelp() { lastTrigger = document.activeElement; $("writingHelp").setAttribute("aria-hidden", "false"); $("helpBackdrop").hidden = false; $("helpCloseButton").focus(); }
  function resetPage() {
    clearTimeout(saveTimer);
    if (!window.confirm("이 페이지의 이름, 메모, 최종 글을 초기화할까요?")) { flush(); return; }
    let primarySnapshot, fallbackSnapshot;
    try {
      primarySnapshot = localStorage.getItem(STORAGE_KEY);
      fallbackSnapshot = localStorage.getItem(FALLBACK_KEY);
    } catch (error) { showResetFailure(); return; }
    function restoreSnapshot(key, value) {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FALLBACK_KEY);
    } catch (error) {
      try {
        restoreSnapshot(STORAGE_KEY, primarySnapshot);
        restoreSnapshot(FALLBACK_KEY, fallbackSnapshot);
      } catch (rollbackError) {
        // Storage may be unavailable, but the current in-memory work is still safe.
      }
      showResetFailure();
      return;
    }
    recoveryRaw = "";
    $("recoveryNotice").hidden = true;
    nameInput.value = notesInput.value = input.value = "";
    render(); setStatus("이 페이지의 저장 내용만 초기화했습니다.");
  }
  if (matchMedia("(max-width: 760px)").matches) $("writingHelp").setAttribute("aria-hidden", "true");
  restore(); render();
  [input, nameInput, notesInput].forEach((element) => { element.addEventListener("input", () => { submissionResult = null; if (element !== input || !composing) { render(); scheduleSave(); } }); element.addEventListener("blur", flush); });
  input.addEventListener("beforeinput", handleBeforeInput); input.addEventListener("compositionstart", () => { composing = true; compositionSnapshot = { value: input.value, start: input.selectionStart, end: input.selectionEnd }; }); input.addEventListener("compositionend", finishComposition); input.addEventListener("select", render); input.addEventListener("keyup", render); input.addEventListener("paste", (event) => { const pasted = event.clipboardData && event.clipboardData.getData("text"); if (pasted != null) { event.preventDefault(); insertRespectingSuffix(pasted); } else setTimeout(onInput, 0); });
  $("submitWritingButton").addEventListener("click", submit); $("copyTextButton").addEventListener("click", () => copyText(normalize(input.value))); $("downloadTextButton").addEventListener("click", () => download(normalize(input.value), "review5-long-writing.txt")); $("printTextButton").addEventListener("click", () => window.print()); $("resetWritingButton").addEventListener("click", resetPage); $("copyRecoveryButton").addEventListener("click", () => copyText(recoveryRaw)); $("downloadRecoveryButton").addEventListener("click", () => download(recoveryRaw, "review5-long-writing-recovery.txt")); $("copyCurrentRecoveryButton").addEventListener("click", () => copyText(currentRecoveryText())); $("downloadCurrentRecoveryButton").addEventListener("click", () => download(currentRecoveryText(), "review5-long-writing-current-recovery.txt"));
  $("helpOpenButton").addEventListener("click", openHelp); $("helpCloseButton").addEventListener("click", closeHelp); $("helpBackdrop").addEventListener("click", closeHelp); document.addEventListener("keydown", (event) => { const help = $("writingHelp"); if (help.getAttribute("aria-hidden") !== "false" || !matchMedia("(max-width: 760px)").matches) return; if (event.key === "Escape") { closeHelp(); return; } if (event.key === "Tab") { const controls = Array.from(help.querySelectorAll("button, textarea, input, a[href]")).filter((element) => !element.disabled); const first = controls[0], last = controls[controls.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); }); window.addEventListener("pagehide", flush);
  window.__review5LongWriting = { normalize, count, layout, state: () => currentRecord(), flush, submit, payload, signature, storageKey: STORAGE_KEY, fallbackKey: FALLBACK_KEY, currentRecoveryText, copyText };
}());
