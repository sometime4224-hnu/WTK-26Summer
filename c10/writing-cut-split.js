(function () {
  const root = document.getElementById('splitWritingCutApp');
  const data = window.C10_WRITING_CUT_SPLIT_DATA;
  if (!root || !data) return;

  const STORE_KEY = 'writing_cut_c10_split_steps_v1';
  const STEP_FILES = [
    'writing-cut.html',
    'writing-cut-step2.html',
    'writing-cut-step3.html',
    'writing-cut-step4.html',
    'writing-cut-step5.html'
  ];
  const STEP_KEYS = ['step1', 'step2', 'step3', 'step4', 'step5'];
  const STEP_INDEX = Math.max(0, Math.min(4, Number(window.C10_WRITING_CUT_SPLIT_STEP ?? root.dataset.stepIndex ?? 0)));
  const STEP_LABELS = data.stepLabels;
  const STEP_GUIDES = data.stepGuides;
  const rawCuts = data.rawCuts;
  const cuts = rawCuts.map((cut) => ({
    ...cut,
    mcqOptions: [cut.sentence, ...cut.distractors.map((index) => rawCuts[index - 1].sentence)]
  }));

  function shuffle(items) {
    const next = [...items];
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    return next;
  }

  function buildCutResponse(cut) {
    return {
      step1: {
        selected: null,
        checked: false,
        correct: false,
        optionOrder: shuffle(cut.mcqOptions.map((label, index) => ({ id: index, label })))
      },
      step2: {
        placements: Array(cut.dropAnswers.length).fill(null),
        checked: false,
        correct: false,
        choiceOrder: shuffle(cut.dropChoices.map((label, index) => ({ id: index, label })))
      },
      step3: {
        arranged: [],
        checked: false,
        correct: false,
        bankOrder: shuffle(cut.orderTokens.map((label, index) => ({ id: index, label })))
      },
      step4: {
        inputs: Array(cut.fillBlanks.length).fill(''),
        checked: false,
        correct: false,
        correctCount: 0
      },
      step5: {
        text: '',
        checked: false,
        evaluation: null
      }
    };
  }

  function buildInitialState() {
    return {
      version: 1,
      activeCuts: Array(STEP_LABELS.length).fill(0),
      responses: cuts.map(buildCutResponse)
    };
  }

  function isUsableSavedState(candidate) {
    return Boolean(
      candidate &&
      Array.isArray(candidate.activeCuts) &&
      candidate.activeCuts.length === STEP_LABELS.length &&
      Array.isArray(candidate.responses) &&
      candidate.responses.length === cuts.length &&
      candidate.responses.every((response) => STEP_KEYS.every((key) => response && response[key]))
    );
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return buildInitialState();
      const parsed = JSON.parse(raw);
      return isUsableSavedState(parsed) ? parsed : buildInitialState();
    } catch {
      return buildInitialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      // The page still works if browser storage is unavailable.
    }
  }

  let state = loadState();

  function normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[.,!?~'"“”‘’]/g, '')
      .trim();
  }

  function escapeHtml(text) {
    return String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function findById(list, id) {
    return list.find((item) => String(item.id) === String(id));
  }

  function matchesAnswer(input, answers) {
    const normalized = normalizeText(input);
    return answers.some((answer) => normalized === normalizeText(answer));
  }

  function evaluateSentence(text, cut) {
    const raw = (text || '').trim();
    const matchedKeywords = cut.requiredKeywords.filter((keyword) =>
      normalizeText(raw).includes(normalizeText(keyword))
    );

    if (!raw) {
      return { level: 'empty', matchedKeywords, missingKeywords: cut.requiredKeywords };
    }

    if (normalizeText(raw) === normalizeText(cut.sentence)) {
      return { level: 'exact', matchedKeywords: cut.requiredKeywords, missingKeywords: [] };
    }

    if (cut.acceptedPatterns.some((pattern) => normalizeText(raw) === normalizeText(pattern))) {
      return { level: 'accepted', matchedKeywords, missingKeywords: [] };
    }

    if (matchedKeywords.length === cut.requiredKeywords.length) {
      return { level: 'strong', matchedKeywords, missingKeywords: [] };
    }

    if (matchedKeywords.length >= Math.max(2, cut.requiredKeywords.length - 1)) {
      return {
        level: 'partial',
        matchedKeywords,
        missingKeywords: cut.requiredKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
      };
    }

    return {
      level: 'weak',
      matchedKeywords,
      missingKeywords: cut.requiredKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
    };
  }

  function getActiveCutIndex() {
    return Math.max(0, Math.min(cuts.length - 1, Number(state.activeCuts[STEP_INDEX]) || 0));
  }

  function setActiveCutIndex(index) {
    state.activeCuts[STEP_INDEX] = Math.max(0, Math.min(cuts.length - 1, Number(index) || 0));
  }

  function getCurrentCut() {
    return cuts[getActiveCutIndex()];
  }

  function getCurrentResponse() {
    return state.responses[getActiveCutIndex()];
  }

  function getStepResponse(response, stepIndex) {
    return response[STEP_KEYS[stepIndex]];
  }

  function getCurrentStepResponse() {
    return getStepResponse(getCurrentResponse(), STEP_INDEX);
  }

  function getStepCheckedCount(stepIndex) {
    return state.responses.filter((response) => getStepResponse(response, stepIndex).checked).length;
  }

  function isStepComplete(stepIndex) {
    return getStepCheckedCount(stepIndex) === cuts.length;
  }

  function getCorrectText(stepData) {
    return stepData.correct ? '정답입니다.' : '다시 확인해 보세요.';
  }

  function renderStepTabs() {
    return STEP_LABELS.map((label, index) => {
      const classes = [];
      if (index === STEP_INDEX) classes.push('active');
      if (isStepComplete(index)) classes.push('done');
      const current = index === STEP_INDEX ? ' aria-current="page"' : '';
      return `<a class="${classes.join(' ')}" href="./${STEP_FILES[index]}"${current}>${index + 1}단계<br>${escapeHtml(label)}</a>`;
    }).join('');
  }

  function renderCutRail() {
    const activeIndex = getActiveCutIndex();
    return `
      <aside class="split-card cut-rail" aria-label="컷 선택">
        <h2>컷 선택</h2>
        <div class="cut-grid">
          ${cuts.map((_, index) => {
            const stepData = getStepResponse(state.responses[index], STEP_INDEX);
            const classes = [];
            if (stepData.checked) classes.push('done');
            if (index === activeIndex) classes.push('active');
            const current = index === activeIndex ? ' aria-current="true"' : '';
            return `<button type="button" class="${classes.join(' ')}" data-action="jump-cut" data-cut-index="${index}"${current}>${index + 1}</button>`;
          }).join('')}
        </div>
      </aside>
    `;
  }

  function renderImagePanel(cut) {
    const activeIndex = getActiveCutIndex();
    return `
      <section class="split-card image-panel" data-image-panel>
        <h3>컷 ${activeIndex + 1}</h3>
        <figure>
          <img src="${data.imgBase}${cut.imgFile}" alt="${escapeHtml(cut.alt)}" loading="eager" decoding="async" data-primary-image>
          <figcaption>${escapeHtml(cut.alt)}</figcaption>
        </figure>
      </section>
    `;
  }

  function renderFeedback(stepData, correctBody, wrongBody) {
    if (!stepData.checked) {
      return '<div class="feedback">확인하면 결과와 모범 문장이 여기에 표시됩니다.</div>';
    }

    const tone = stepData.correct ? 'correct' : 'wrong';
    return `
      <div class="feedback ${tone}">
        <strong>${getCorrectText(stepData)}</strong>
        <div>${stepData.correct ? correctBody : wrongBody}</div>
        <div class="model-sentence">${escapeHtml(getCurrentCut().sentence)}</div>
      </div>
    `;
  }

  function renderStep1(cut, response) {
    const stepData = response.step1;
    return `
      <p class="task-guide">${escapeHtml(STEP_GUIDES[0])}</p>
      <div class="choice-list" data-choice-list>
        ${stepData.optionOrder.map((option) => `
          <button
            type="button"
            class="${String(stepData.selected) === String(option.id) ? 'selected' : ''}"
            data-action="select-choice"
            data-option-id="${option.id}"
          >${escapeHtml(option.label)}</button>
        `).join('')}
      </div>
      ${renderFeedback(stepData, '그림과 문장이 잘 연결되었습니다.', '그림의 핵심 장면과 문장 내용을 다시 비교하세요.')}
    `;
  }

  function renderTemplateLine(cut, response) {
    return `
      <div class="template-line">
        ${cut.dropSegments.map((segment, index) => {
          const slot = index < cut.dropAnswers.length
            ? renderBlankSlot(response, index)
            : '';
          return `${escapeHtml(segment)}${slot}`;
        }).join('')}
      </div>
    `;
  }

  function renderBlankSlot(response, index) {
    const choiceId = response.step2.placements[index];
    const choice = findById(response.step2.choiceOrder, choiceId);
    const label = choice ? choice.label : `빈칸 ${index + 1}`;
    const classes = ['blank-slot'];
    if (!choice) classes.push('empty');
    if (state.activeSlot === index) classes.push('active');
    return `
      <button type="button" class="${classes.join(' ')}" data-action="activate-slot" data-slot="${index}">
        ${escapeHtml(label)}
      </button>
    `;
  }

  function renderStep2(cut, response) {
    const stepData = response.step2;
    const usedChoices = new Set(stepData.placements.filter((choiceId) => choiceId !== null));
    return `
      <p class="task-guide">${escapeHtml(STEP_GUIDES[1])}</p>
      ${renderTemplateLine(cut, response)}
      <div class="word-bank">
        ${stepData.choiceOrder.map((choice) => `
          <button
            type="button"
            data-action="use-word"
            data-choice-id="${choice.id}"
            ${usedChoices.has(choice.id) ? 'disabled' : ''}
          >${escapeHtml(choice.label)}</button>
        `).join('')}
      </div>
      ${renderFeedback(stepData, '두 빈칸의 핵심어가 모두 맞았습니다.', '빈칸 앞뒤 표현과 선택한 말을 다시 연결해 보세요.')}
    `;
  }

  function renderStep3(cut, response) {
    const stepData = response.step3;
    const arrangedSet = new Set(stepData.arranged);
    return `
      <p class="task-guide">${escapeHtml(STEP_GUIDES[2])}</p>
      <div class="arranged-list" aria-label="배열한 어절">
        ${stepData.arranged.length
          ? stepData.arranged.map((id) => `<button type="button" data-action="remove-order" data-order-id="${id}">${escapeHtml(cut.orderTokens[id])}</button>`).join('')
          : '<div class="feedback">아래 어절을 순서대로 눌러 문장을 만드세요.</div>'}
      </div>
      <div class="token-bank" aria-label="어절 목록">
        ${stepData.bankOrder.map((token) => `
          <button
            type="button"
            data-action="pick-order"
            data-order-id="${token.id}"
            ${arrangedSet.has(token.id) ? 'disabled' : ''}
          >${escapeHtml(token.label)}</button>
        `).join('')}
      </div>
      ${renderFeedback(stepData, '문장 순서가 자연스럽게 완성되었습니다.', '한국어 문장의 흐름을 다시 읽고 어절 순서를 조정하세요.')}
    `;
  }

  function renderFillPrompt(prompt) {
    return escapeHtml(prompt).replace(/\[(\d+)\]/g, '<strong>[$1]</strong>');
  }

  function renderStep4(cut, response) {
    const stepData = response.step4;
    return `
      <p class="task-guide">${escapeHtml(STEP_GUIDES[3])}</p>
      <div class="fill-preview">${renderFillPrompt(cut.fillPrompt)}</div>
      <div class="input-list">
        ${cut.fillBlanks.map((blank, index) => `
          <label>
            ${escapeHtml(blank.label)}
            <input
              type="text"
              data-action="fill-input"
              data-fill-index="${index}"
              value="${escapeHtml(stepData.inputs[index] || '')}"
              autocomplete="off"
            >
          </label>
        `).join('')}
      </div>
      ${renderFeedback(
        stepData,
        '빈칸 답을 모두 정확히 썼습니다.',
        `${stepData.correctCount}/${cut.fillBlanks.length}개가 맞았습니다. 철자와 띄어쓰기를 다시 확인하세요.`
      )}
    `;
  }

  function getSentenceFeedback(result) {
    if (!result || result.level === 'empty') return '문장을 입력한 뒤 확인하세요.';
    if (['exact', 'accepted', 'strong'].includes(result.level)) return '핵심 내용이 충분히 들어갔습니다.';
    if (result.level === 'partial') return `좋습니다. 빠진 핵심어: ${result.missingKeywords.join(', ')}`;
    return `핵심어를 더 넣어 보세요: ${result.missingKeywords.join(', ')}`;
  }

  function renderStep5(cut, response) {
    const stepData = response.step5;
    const result = stepData.evaluation;
    const correct = result && ['exact', 'accepted', 'strong'].includes(result.level);
    return `
      <p class="task-guide">${escapeHtml(STEP_GUIDES[4])}</p>
      <div class="keyword-row">
        ${cut.requiredKeywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join('')}
      </div>
      <textarea class="full-text" data-action="full-text" placeholder="그림을 보고 전체 문장을 써 보세요.">${escapeHtml(stepData.text)}</textarea>
      ${stepData.checked
        ? `<div class="feedback ${correct ? 'correct' : 'wrong'}">
            <strong>${correct ? '좋습니다.' : '조금 더 다듬어 보세요.'}</strong>
            <div>${escapeHtml(getSentenceFeedback(result))}</div>
            <div class="model-sentence">${escapeHtml(cut.sentence)}</div>
          </div>`
        : '<div class="feedback">확인하면 핵심어 포함 여부와 모범 문장이 표시됩니다.</div>'}
    `;
  }

  function canCheckCurrent() {
    const response = getCurrentResponse();
    if (STEP_INDEX === 0) return response.step1.selected !== null;
    if (STEP_INDEX === 1) return response.step2.placements.every((choiceId) => choiceId !== null);
    if (STEP_INDEX === 2) return response.step3.arranged.length === getCurrentCut().orderTokens.length;
    if (STEP_INDEX === 3) return response.step4.inputs.every((input) => input.trim());
    return response.step5.text.trim().length > 0;
  }

  function renderTaskPanel(cut, response) {
    const renderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
    return `
      <section class="split-card task-panel" data-task-panel>
        <h3>${STEP_INDEX + 1}단계 · ${escapeHtml(STEP_LABELS[STEP_INDEX])}</h3>
        ${renderers[STEP_INDEX](cut, response)}
        ${renderActions()}
      </section>
    `;
  }

  function renderActions() {
    const activeIndex = getActiveCutIndex();
    const currentStepData = getCurrentStepResponse();
    const checked = currentStepData.checked;
    const isLastCut = activeIndex === cuts.length - 1;
    const readyForNextStage = isStepComplete(STEP_INDEX);
    const nextStepUrl = STEP_INDEX < STEP_FILES.length - 1 ? `./${STEP_FILES[STEP_INDEX + 1]}` : '';
    const prevStepUrl = STEP_INDEX > 0 ? `./${STEP_FILES[STEP_INDEX - 1]}` : '';

    return `
      <div class="actions">
        <div class="action-group">
          <button type="button" class="action-btn" data-action="prev-cut" ${activeIndex === 0 ? 'disabled' : ''}>이전 컷</button>
          <button type="button" class="action-btn warning" data-action="reset-current">현재 컷 다시</button>
          <button type="button" class="action-btn primary" data-action="check-current" ${canCheckCurrent() ? '' : 'disabled'}>확인</button>
        </div>
        <div class="action-group">
          ${prevStepUrl ? `<a class="step-link" href="${prevStepUrl}">이전 단계</a>` : ''}
          ${isLastCut
            ? (nextStepUrl
              ? (readyForNextStage
                ? `<a class="step-link" href="${nextStepUrl}">다음 단계</a>`
                : '<span class="step-link" aria-disabled="true">다음 단계</span>')
              : '<a class="step-link" href="./writing-cut.html">1단계로 돌아가기</a>')
            : `<button type="button" class="nav-btn primary" data-action="next-cut" ${checked ? '' : 'disabled'}>다음 컷</button>`}
        </div>
      </div>
    `;
  }

  function renderApp() {
    const activeIndex = getActiveCutIndex();
    const cut = getCurrentCut();
    const response = getCurrentResponse();
    const checkedCount = getStepCheckedCount(STEP_INDEX);
    const meterWidth = Math.round((checkedCount / cuts.length) * 100);
    const prevStepNote = STEP_INDEX === 0
      ? '첫 단계입니다.'
      : `${STEP_INDEX}단계 완료 ${getStepCheckedCount(STEP_INDEX - 1)} / ${cuts.length}`;

    root.innerHTML = `
      <section class="split-stage">
        <section class="split-card split-status">
          <div class="split-status__top">
            <div>
              <h2>${STEP_INDEX + 1}단계 · ${escapeHtml(STEP_LABELS[STEP_INDEX])}</h2>
              <p>현재 컷 ${activeIndex + 1} / ${cuts.length}. ${escapeHtml(prevStepNote)}</p>
            </div>
            <p>${checkedCount} / ${cuts.length} 완료</p>
          </div>
          <nav class="step-tabs" aria-label="단계 이동">${renderStepTabs()}</nav>
          <div class="split-meter" style="--meter-width:${meterWidth}%"><span></span></div>
        </section>
        <div class="workspace">
          ${renderCutRail()}
          <div class="work-area">
            ${renderImagePanel(cut)}
            ${renderTaskPanel(cut, response)}
          </div>
        </div>
      </section>
    `;

    window.C10_WRITING_CUT_SPLIT = {
      stepIndex: STEP_INDEX,
      cuts,
      getState: () => state,
      storageKey: STORE_KEY
    };
  }

  function selectChoice(optionId) {
    const stepData = getCurrentResponse().step1;
    stepData.selected = Number(optionId);
    stepData.checked = false;
    stepData.correct = false;
  }

  function checkStep1() {
    const cut = getCurrentCut();
    const stepData = getCurrentResponse().step1;
    const selected = findById(stepData.optionOrder, stepData.selected);
    stepData.checked = true;
    stepData.correct = Boolean(selected && selected.label === cut.sentence);
  }

  function activateSlot(slotIndex) {
    state.activeSlot = Number(slotIndex);
  }

  function placeChoice(choiceId) {
    const stepData = getCurrentResponse().step2;
    const activeSlot = Number.isInteger(state.activeSlot) ? state.activeSlot : 0;
    const alreadyUsed = stepData.placements.includes(Number(choiceId));
    if (alreadyUsed) return;
    stepData.placements[activeSlot] = Number(choiceId);
    state.activeSlot = Math.min(activeSlot + 1, stepData.placements.length - 1);
    stepData.checked = false;
    stepData.correct = false;
  }

  function checkStep2() {
    const cut = getCurrentCut();
    const stepData = getCurrentResponse().step2;
    stepData.checked = true;
    stepData.correct = stepData.placements.every((choiceId, index) => {
      const choice = findById(stepData.choiceOrder, choiceId);
      return choice && normalizeText(choice.label) === normalizeText(cut.dropAnswers[index]);
    });
  }

  function pickOrder(orderId) {
    const stepData = getCurrentResponse().step3;
    const numericId = Number(orderId);
    if (stepData.arranged.includes(numericId)) return;
    stepData.arranged.push(numericId);
    stepData.checked = false;
    stepData.correct = false;
  }

  function removeOrder(orderId) {
    const stepData = getCurrentResponse().step3;
    stepData.arranged = stepData.arranged.filter((id) => id !== Number(orderId));
    stepData.checked = false;
    stepData.correct = false;
  }

  function checkStep3() {
    const cut = getCurrentCut();
    const stepData = getCurrentResponse().step3;
    stepData.checked = true;
    stepData.correct = stepData.arranged.length === cut.orderTokens.length &&
      stepData.arranged.every((id, index) => id === index);
  }

  function updateFillInput(index, value) {
    const stepData = getCurrentResponse().step4;
    stepData.inputs[Number(index)] = value;
    stepData.checked = false;
    stepData.correct = false;
    stepData.correctCount = 0;
  }

  function checkStep4() {
    const cut = getCurrentCut();
    const stepData = getCurrentResponse().step4;
    stepData.correctCount = cut.fillBlanks.filter((blank, index) =>
      matchesAnswer(stepData.inputs[index], blank.answers)
    ).length;
    stepData.checked = true;
    stepData.correct = stepData.correctCount === cut.fillBlanks.length;
  }

  function updateFullText(value) {
    const stepData = getCurrentResponse().step5;
    stepData.text = value;
    stepData.checked = false;
    stepData.evaluation = null;
  }

  function checkStep5() {
    const cut = getCurrentCut();
    const stepData = getCurrentResponse().step5;
    stepData.checked = true;
    stepData.evaluation = evaluateSentence(stepData.text, cut);
  }

  function checkCurrentStep() {
    if (!canCheckCurrent()) return;
    if (STEP_INDEX === 0) checkStep1();
    else if (STEP_INDEX === 1) checkStep2();
    else if (STEP_INDEX === 2) checkStep3();
    else if (STEP_INDEX === 3) checkStep4();
    else checkStep5();
  }

  function resetCurrentStep() {
    const response = getCurrentResponse();
    const cut = getCurrentCut();
    const replacement = buildCutResponse(cut)[STEP_KEYS[STEP_INDEX]];
    response[STEP_KEYS[STEP_INDEX]] = replacement;
    state.activeSlot = 0;
  }

  function refreshCheckButton() {
    const button = root.querySelector('[data-action="check-current"]');
    if (button) button.disabled = !canCheckCurrent();
  }

  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    let shouldRender = true;

    if (action === 'jump-cut') setActiveCutIndex(target.dataset.cutIndex);
    else if (action === 'prev-cut') setActiveCutIndex(getActiveCutIndex() - 1);
    else if (action === 'next-cut') {
      if (getCurrentStepResponse().checked) setActiveCutIndex(getActiveCutIndex() + 1);
    } else if (action === 'reset-current') resetCurrentStep();
    else if (action === 'check-current') checkCurrentStep();
    else if (action === 'select-choice') selectChoice(target.dataset.optionId);
    else if (action === 'activate-slot') activateSlot(target.dataset.slot);
    else if (action === 'use-word') placeChoice(target.dataset.choiceId);
    else if (action === 'pick-order') pickOrder(target.dataset.orderId);
    else if (action === 'remove-order') removeOrder(target.dataset.orderId);
    else shouldRender = false;

    if (shouldRender) {
      saveState();
      renderApp();
    }
  });

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target.dataset.action === 'fill-input') {
      updateFillInput(target.dataset.fillIndex, target.value);
      saveState();
      refreshCheckButton();
    } else if (target.dataset.action === 'full-text') {
      updateFullText(target.value);
      saveState();
      refreshCheckButton();
    }
  });

  renderApp();
})();
