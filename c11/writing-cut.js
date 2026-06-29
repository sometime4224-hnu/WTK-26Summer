const DATA = window.C11_READING_CUTTOON_DATA;
const IS_TEACHER = Boolean(window.C11_WRITING_CUT_TEACHER);
const IMG_BASE = DATA?.assetBase || '../assets/c11/reading-writing/images/cuttoon/';
const LS_KEY = IS_TEACHER ? 'writing_cut_c11_writer_teacher_v2' : 'writing_cut_c11_writer_v2';
const PHASE_LABELS = ['단서 모으기', '한 문장 쓰기', '비교 후 고쳐쓰기'];

const FALLBACK_SENTENCES = [
  '직장인이라면 누구든지 회사에서 꼭 필요한 사람이 되고 싶을 것이다.',
  '그런 사람이 되려면 어떤 노력을 해야 할까?',
  "만약 회사에서 성공하고 싶다면 항상 '친절'과 '독서'를 실천해야 한다.",
  '회사에는 일을 맡기면 다른 사람보다 빨리 잘 해결하는 사람이 있다.',
  '그 사람은 어려운 일이 생겨도 누군가의 도움을 받아 쉽게 해결한다.',
  '사람들은 그가 운이 좋다고 말한다.',
  '왜 그 사람에게만 좋은 일이 자주 생길까?',
  '그 이유는 평소의 작은 친절 때문이다.',
  '복사기를 도와주고 서류를 함께 들어 주고 우산을 빌려주는 것은 아주 작은 일이다.',
  '사람들은 이런 작은 친절을 오래 기억했다가 나중에 그 사람을 돕는다.',
  '그래서 친절한 사람이 그렇지 않은 사람보다 성공할 가능성이 높다.',
  '독서를 하는 사람이 성공한다.',
  '한국의 직장인들은 1년에 평균 16권의 책을 읽는다.',
  '가장 많이 읽는 책의 종류는 경제 경영 서적과 소설이다.',
  '경제 경영 서적을 읽으면 업무에 필요한 지식을 얻을 수 있다.'
];

const FALLBACK_CUTS = FALLBACK_SENTENCES.map((sentence, index) => ({
  id: `cut${String(index + 1).padStart(2, '0')}`,
  label: String(index + 1),
  title: `컷 ${index + 1}`,
  image: `c11-reading-cuttoon-${String(index + 1).padStart(2, '0')}.webp`,
  keywords: [],
  note: sentence,
  sentence
}));

const sentenceMap = new Map((DATA?.sentences || []).map((sentence) => [sentence.id, sentence]));

function flattenSentence(sentence) {
  if (!sentence) return '';
  if (typeof sentence === 'string') return sentence;
  return sentence.segments.map((segment) => segment.text).join('');
}

function buildSentenceFrame(sentence) {
  if (!sentence || !Array.isArray(sentence.segments)) return '';
  return sentence.segments.map((segment) => (segment.id ? '____' : segment.text)).join('').replace(/_{4}(\s+_{4})+/g, '____');
}

function getSectionTitle(sentenceId) {
  const section = (DATA?.passageLayout || []).find((block) => block.sentenceIds.includes(sentenceId));
  return section?.title || '';
}

const cuts = (DATA?.cuts || FALLBACK_CUTS).map((cut, index) => {
  const sentenceId = cut.sentenceIds?.[0];
  const sentence = flattenSentence(sentenceMap.get(sentenceId)) || cut.sentence || FALLBACK_SENTENCES[index] || '';
  return {
    id: cut.id || `cut${String(index + 1).padStart(2, '0')}`,
    label: cut.label || String(index + 1),
    title: cut.title || `컷 ${index + 1}`,
    imgFile: cut.image || `c11-reading-cuttoon-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `${cut.label || index + 1}번 컷, ${cut.title || sentence}`,
    sentence,
    frame: buildSentenceFrame(sentenceMap.get(sentenceId)),
    sectionTitle: getSectionTitle(sentenceId),
    keywords: cut.keywords?.length ? cut.keywords : sentence.split(/\s+/).slice(0, 3),
    note: cut.note || sentence
  };
});

const PASSAGE_FULL_PARAGRAPHS = DATA?.passageLayout
  ? DATA.passageLayout.map((block) => block.sentenceIds.map((id) => flattenSentence(sentenceMap.get(id))).join(' '))
  : [
      "직장인이라면 누구든지 회사에서 꼭 필요한 사람이 되고 싶을 것이다. 그런 사람이 되려면 어떤 노력을 해야 할까? 만약 회사에서 성공하고 싶다면 항상 '친절'과 '독서'를 실천해야 한다.",
      '회사에는 일을 맡기면 다른 사람보다 빨리 잘 해결하는 사람이 있다. 그 사람은 어려운 일이 생겨도 누군가의 도움을 받아 쉽게 해결한다. 사람들은 그가 운이 좋다고 말한다. 왜 그 사람에게만 좋은 일이 자주 생길까? 그 이유는 평소의 작은 친절 때문이다. 복사기를 도와주고 서류를 함께 들어 주고 우산을 빌려주는 것은 아주 작은 일이다. 사람들은 이런 작은 친절을 오래 기억했다가 나중에 그 사람을 돕는다. 그래서 친절한 사람이 그렇지 않은 사람보다 성공할 가능성이 높다.',
      '독서를 하는 사람이 성공한다. 한국의 직장인들은 1년에 평균 16권의 책을 읽는다. 가장 많이 읽는 책의 종류는 경제 경영 서적과 소설이다. 경제 경영 서적을 읽으면 업무에 필요한 지식을 얻을 수 있다.'
    ];

const PASSAGE_SECTIONS = DATA?.passageLayout
  ? DATA.passageLayout.map((block) => ({
      title: block.title,
      body: block.sentenceIds.map((id) => flattenSentence(sentenceMap.get(id))).join(' ')
    }))
  : [
      { title: '도입', body: PASSAGE_FULL_PARAGRAPHS[0] },
      { title: '1. 친절한 사람이 성공한다.', body: PASSAGE_FULL_PARAGRAPHS[1] },
      { title: '2. 독서를 하는 사람이 성공한다.', body: PASSAGE_FULL_PARAGRAPHS[2] }
    ];

const app = document.getElementById('app');
let floatingPreviewObserver = null;
const floatingPreviewMedia = window.matchMedia('(max-width: 960px)');
let shouldFocusPassageClose = false;
let shouldRestorePassageTrigger = false;

function buildInitialState() {
  return {
    view: 'activity',
    currentCut: 0,
    passageOpen: false,
    responses: cuts.map(() => ({
      clueNote: '',
      openedHints: {
        keywords: false,
        frame: false,
        model: false
      },
      draftText: '',
      draftEvaluation: null,
      revisionText: '',
      revisionEvaluation: null
    }))
  };
}

function isUsableSavedState(candidate) {
  return Boolean(
    candidate &&
    Array.isArray(candidate.responses) &&
    candidate.responses.length === cuts.length &&
    typeof candidate.currentCut === 'number' &&
    candidate.responses.every((response) =>
      response &&
      typeof response.clueNote === 'string' &&
      response.openedHints &&
      typeof response.draftText === 'string' &&
      typeof response.revisionText === 'string'
    )
  );
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return buildInitialState();
    const parsed = JSON.parse(raw);
    return isUsableSavedState(parsed) ? parsed : buildInitialState();
  } catch {
    return buildInitialState();
  }
}

function saveState() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // The page remains usable without localStorage.
  }
}

let state = loadState();
if (typeof state.passageOpen !== 'boolean') state.passageOpen = false;

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[\s.,!?~'"“”‘’`()[\]{}:;·]/g, '')
    .trim();
}

function getCurrentCut() {
  return cuts[state.currentCut];
}

function getCurrentResponse() {
  return state.responses[state.currentCut];
}

function getImageSrc(cut) {
  return `${IMG_BASE}${cut.imgFile}`;
}

function evaluateWriting(text, cut) {
  const raw = (text || '').trim();
  const normalized = normalizeText(raw);
  const matchedKeywords = cut.keywords.filter((keyword) => normalized.includes(normalizeText(keyword)));
  const missingKeywords = cut.keywords.filter((keyword) => !matchedKeywords.includes(keyword));

  if (!raw) {
    return { level: 'empty', matchedKeywords, missingKeywords };
  }
  if (normalized === normalizeText(cut.sentence)) {
    return { level: 'exact', matchedKeywords: cut.keywords, missingKeywords: [] };
  }
  if (cut.keywords.length && matchedKeywords.length === cut.keywords.length) {
    return { level: 'strong', matchedKeywords, missingKeywords: [] };
  }
  if (matchedKeywords.length >= Math.max(2, Math.ceil(cut.keywords.length / 2))) {
    return { level: 'partial', matchedKeywords, missingKeywords };
  }
  if (matchedKeywords.length > 0) {
    return { level: 'weak', matchedKeywords, missingKeywords };
  }
  return { level: 'weak', matchedKeywords, missingKeywords };
}

function isSuccessfulEvaluation(evaluation) {
  return Boolean(evaluation && ['exact', 'strong'].includes(evaluation.level));
}

function needsRevision(response) {
  return Boolean(response.draftEvaluation && !isSuccessfulEvaluation(response.draftEvaluation));
}

function canGoNext() {
  if (IS_TEACHER) return state.view !== 'summary';
  if (state.view === 'summary') return false;
  const response = getCurrentResponse();
  if (!response.draftEvaluation) return false;
  if (!needsRevision(response)) return true;
  return Boolean(response.revisionEvaluation);
}

function getEvaluationLabel(evaluation) {
  if (!evaluation) return '미확인';
  if (evaluation.level === 'exact') return '원문과 거의 같음';
  if (evaluation.level === 'strong') return '의미 전달 성공';
  if (evaluation.level === 'partial') return '조금만 보완';
  if (evaluation.level === 'weak') return '핵심어 보완 필요';
  return '미작성';
}

function feedbackBlock(tone, title, ...items) {
  return `
    <div class="feedback ${tone}" aria-live="polite">
      <strong>${escapeHtml(title)}</strong>
      ${items.filter(Boolean).map((item) => `<div class="feedback-body">${item}</div>`).join('')}
    </div>
  `;
}

function renderKeywordList(keywords) {
  return `<div class="support-row">${keywords.map((keyword) => `<span class="support-chip">${escapeHtml(keyword)}</span>`).join('')}</div>`;
}

function renderFrame(frame) {
  if (!frame) return '<p class="hint-copy">이 컷은 그림과 핵심어를 바탕으로 자유롭게 문장을 만들어 보세요.</p>';
  const html = escapeHtml(frame).replace(/____/g, '<span class="blank-inline">빈칸</span>');
  return `<div class="sentence-frame">${html}</div>`;
}

function renderHintDrawer(type, title, response, content, locked = false) {
  const opened = Boolean(response.openedHints[type]);
  const status = locked ? '잠김' : (opened ? '닫기' : '열기');
  return `
    <section class="hint-drawer ${opened ? 'is-open' : ''} ${locked ? 'is-locked' : ''}" data-hint-drawer data-hint-type="${type}">
      <button
        type="button"
        class="hint-toggle"
        data-action="toggle-hint"
        data-hint="${type}"
        aria-expanded="${opened ? 'true' : 'false'}"
        ${locked ? 'disabled' : ''}
      >
        <span>${escapeHtml(title)}</span>
        <small>${status}</small>
      </button>
      ${opened && !locked ? `<div class="hint-body">${content}</div>` : ''}
    </section>
  `;
}

function getDraftFeedback(cut, response) {
  const result = response.draftEvaluation;
  if (!result) return '';
  if (result.level === 'exact') {
    return feedbackBlock(
      'correct',
      '아주 정확하게 썼어요.',
      `원문 문장: ${escapeHtml(cut.sentence)}`
    );
  }
  if (result.level === 'strong') {
    return feedbackBlock(
      'correct',
      '의미가 잘 전달됐어요.',
      '원문과 표현이 조금 달라도 핵심어가 모두 들어갔습니다.'
    );
  }
  return feedbackBlock(
    result.level === 'partial' ? 'warn' : 'wrong',
    `${getEvaluationLabel(result)} 상태입니다.`,
    result.missingKeywords.length
      ? `더 넣어 보면 좋은 말: ${escapeHtml(result.missingKeywords.join(', '))}`
      : '문장 흐름을 조금 더 분명하게 다듬어 보세요.',
    '아래 비교 영역에서 한 번 고쳐 쓰면 다음 컷으로 갈 수 있습니다.'
  );
}

function getRevisionFeedback(cut, response) {
  const result = response.revisionEvaluation;
  if (!result) return '';
  if (isSuccessfulEvaluation(result)) {
    return feedbackBlock(
      'correct',
      '고쳐 쓴 문장이 좋아졌어요.',
      `확인한 핵심어: ${escapeHtml(result.matchedKeywords.join(', ') || cut.keywords.join(', '))}`
    );
  }
  return feedbackBlock(
    'warn',
    '수정 문장을 확인했어요.',
    result.missingKeywords.length
      ? `아직 빠진 말: ${escapeHtml(result.missingKeywords.join(', '))}`
      : '의미는 이어졌습니다. 다음 컷에서 다시 더 자연스럽게 써 봅시다.'
  );
}

function renderStepPills() {
  return PHASE_LABELS.map((label, index) => `<div class="step-pill ${index === 1 ? 'active' : ''}">${index + 1}. ${escapeHtml(label)}</div>`).join('');
}

function renderCutPills() {
  return cuts.map((_, index) => {
    const response = state.responses[index];
    const done = Boolean(response.draftEvaluation);
    const active = index === state.currentCut;
    if (IS_TEACHER) {
      return `<button type="button" class="cut-pill ${done ? 'done' : ''} ${active ? 'active' : ''}" data-action="jump-to-cut" data-cut-index="${index}" aria-current="${active ? 'page' : 'false'}">컷 ${index + 1}</button>`;
    }
    return `<div class="cut-pill ${done ? 'done' : ''} ${active ? 'active' : ''}">컷 ${index + 1}</div>`;
  }).join('');
}

function renderTopTools(label) {
  return `
    <div class="top-tools">
      <button type="button" class="passage-open-btn" data-action="open-passage" aria-haspopup="dialog" aria-controls="passage-dialog" aria-expanded="${state.passageOpen ? 'true' : 'false'}">
        <span class="passage-open-btn__label">전체 지문 보기</span>
        <span class="passage-open-btn__hint">필요할 때만 확인</span>
      </button>
      <span class="focus-chip">${escapeHtml(label)}</span>
    </div>
  `;
}

function renderPassageModal() {
  return `
    <div class="passage-backdrop" data-action="close-passage"></div>
    <section id="passage-dialog" class="passage-modal" role="dialog" aria-modal="true" aria-labelledby="passage-title" tabindex="-1">
      <div class="passage-head">
        <div>
          <div class="eyebrow">11과 읽기 지문</div>
          <h2 id="passage-title" class="passage-title">${escapeHtml(DATA?.title || '직장에서 성공하는 법')}</h2>
          <p class="passage-subtitle">문장을 쓰다가 전체 흐름을 확인하고 싶을 때 열어 보세요.</p>
        </div>
        <button type="button" class="ghost-btn" data-action="close-passage" data-passage-close-button>닫기</button>
      </div>
      <div class="passage-body">
        <div class="passage-card passage-overview">
          <strong>전체 지문</strong>
          ${PASSAGE_FULL_PARAGRAPHS.map((paragraph) => `<p class="passage-copy">${escapeHtml(paragraph)}</p>`).join('')}
        </div>
        <div class="eyebrow passage-section-label">문단별로 다시 보기</div>
        ${PASSAGE_SECTIONS.map((section) => `
          <div class="passage-card">
            <strong>${escapeHtml(section.title)}</strong>
            <p>${escapeHtml(section.body)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderImagePanel(cut) {
  return `
    <section class="panel" data-image-panel>
      <div class="panel-head">
        <div>
          <h3>컷 ${state.currentCut + 1}</h3>
          <p>${escapeHtml(cut.title)}</p>
        </div>
        <span class="highlight-tag">최신 컷툰</span>
      </div>
      <div class="image-wrap">
        <img src="${getImageSrc(cut)}" alt="${escapeHtml(cut.alt)}" data-primary-image>
      </div>
      <div class="image-caption">${escapeHtml(cut.note)}</div>
    </section>
  `;
}

function renderFloatingPreview(cut) {
  return `
    <button type="button" class="floating-image-preview" data-action="scroll-to-image" data-floating-preview aria-label="현재 그림으로 다시 이동하기">
      <img src="${getImageSrc(cut)}" alt="">
      <span class="floating-image-preview__copy">
        <strong>현재 그림</strong>
        <span>컷 ${state.currentCut + 1} 다시 보기</span>
      </span>
    </button>
  `;
}

function renderWritingPanel(cut, response) {
  const modelLocked = !IS_TEACHER && !response.draftEvaluation;
  const revisionLocked = !response.draftEvaluation;
  const revisionRequired = needsRevision(response);
  return `
    <section class="panel writing-panel">
      <div class="panel-head">
        <div>
          <h3>컷 ${state.currentCut + 1} 쓰기</h3>
          <p>그림의 의미를 살려 한 문장으로 재구성합니다.</p>
        </div>
        <span class="highlight-tag">${IS_TEACHER ? '교사용' : '쓰기 중심'}</span>
      </div>

      ${IS_TEACHER ? `
        <div class="teacher-actions">
          <button type="button" class="show-answer-btn" data-action="show-answer">정답 보기</button>
        </div>
      ` : ''}

      <div class="writing-stack">
        <section class="writing-section" data-writing-section="clues">
          <div class="writing-section__head">
            <strong>1. 단서 모으기</strong>
            <span>${escapeHtml(cut.sectionTitle || '읽기 지문')}</span>
          </div>
          <label class="field-label" for="clue-note">그림에서 보이는 단서</label>
          <textarea id="clue-note" class="clue-textarea" data-action="clue-note" placeholder="인물, 행동, 물건, 분위기를 짧게 메모해 보세요.">${escapeHtml(response.clueNote)}</textarea>
          <div class="hint-grid">
            ${renderHintDrawer('keywords', '키워드 힌트', response, renderKeywordList(cut.keywords))}
            ${renderHintDrawer('frame', '문장 틀 힌트', response, renderFrame(cut.frame))}
            ${renderHintDrawer('model', '모범 문장', response, `<p class="model-sentence" data-model-sentence>${escapeHtml(cut.sentence)}</p>`, modelLocked)}
          </div>
        </section>

        <section class="writing-section" data-writing-section="draft">
          <div class="writing-section__head">
            <strong>2. 한 문장 쓰기</strong>
            <span>${response.draftEvaluation ? getEvaluationLabel(response.draftEvaluation) : '초안'}</span>
          </div>
          <label class="field-label" for="draft-text">초안</label>
          <textarea id="draft-text" class="full-textarea" data-action="draft-text" placeholder="그림을 보고 한 문장으로 써 보세요.">${escapeHtml(response.draftText)}</textarea>
          <div class="actions">
            <button type="button" class="nav-btn" data-action="check-draft" ${response.draftText.trim() ? '' : 'disabled'}>초안 확인</button>
          </div>
          ${getDraftFeedback(cut, response)}
        </section>

        <section class="writing-section ${revisionLocked ? 'is-locked' : ''}" data-writing-section="revision">
          <div class="writing-section__head">
            <strong>3. 비교 후 고쳐쓰기</strong>
            <span>${revisionRequired ? '수정 필요' : (response.draftEvaluation ? '선택 활동' : '초안 확인 후')}</span>
          </div>
          ${response.draftEvaluation ? `
            <div class="comparison-grid">
              <div>
                <span class="comparison-label">내 초안</span>
                <p>${escapeHtml(response.draftText)}</p>
              </div>
              <div>
                <span class="comparison-label">원문 비교</span>
                <p>${escapeHtml(cut.sentence)}</p>
              </div>
            </div>
          ` : '<p class="locked-copy">초안을 먼저 확인하면 비교와 고쳐쓰기가 열립니다.</p>'}
          <label class="field-label" for="revision-text">수정 문장</label>
          <textarea id="revision-text" class="full-textarea" data-action="revision-text" placeholder="비교한 뒤 더 자연스럽게 고쳐 써 보세요." ${revisionLocked ? 'disabled' : ''}>${escapeHtml(response.revisionText)}</textarea>
          <div class="actions">
            <button type="button" class="ghost-btn" data-action="check-revision" ${!response.revisionText.trim() || revisionLocked ? 'disabled' : ''}>수정 확인</button>
          </div>
          ${getRevisionFeedback(cut, response)}
        </section>
      </div>
    </section>
  `;
}

function renderActivity() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const progressDescription = IS_TEACHER
    ? `교사용 화면입니다. 현재 컷 ${state.currentCut + 1} / ${cuts.length}을 보고 있으며, 아래 컷 번호로 바로 이동할 수 있습니다.`
    : `현재 컷 ${state.currentCut + 1} / ${cuts.length}을 보고 한 문장 쓰기와 고쳐쓰기를 진행하고 있습니다.`;
  return `
    <div class="activity-layout">
      <div class="activity-secondary">
        <div class="progress-card">
          <div class="progress-top">
            <div>
              <div class="eyebrow">컷 ${state.currentCut + 1} / ${cuts.length}</div>
              <h2 class="progress-title">${escapeHtml(cut.title)}</h2>
              <p class="progress-desc">${progressDescription}</p>
            </div>
            ${renderTopTools(`컷 ${state.currentCut + 1}`)}
          </div>
          <div class="step-pills">${renderStepPills()}</div>
          <div class="cut-pills">${renderCutPills()}</div>
        </div>
      </div>
      <div class="activity-primary">
        <div class="workspace">
          ${renderImagePanel(cut)}
          ${renderWritingPanel(cut, response)}
        </div>
      </div>
      ${renderNavigation()}
    </div>
    ${renderFloatingPreview(cut)}
  `;
}

function renderNavigation() {
  let nextLabel = '다음 컷';
  if (state.currentCut === cuts.length - 1) nextLabel = '종합 피드백 보기';
  const nextHelp = canGoNext()
    ? (state.currentCut === cuts.length - 1 ? '마지막 정리로 이동합니다.' : '다음 컷으로 이동합니다.')
    : '초안을 확인하고, 필요한 경우 수정 문장을 한 번 확인하면 이동할 수 있습니다.';
  return `
    <section class="panel navigation-panel">
      <div class="actions">
        <div class="action-group">
          <button type="button" class="ghost-btn" data-action="prev" ${state.currentCut === 0 ? 'disabled' : ''}>이전</button>
          <button type="button" class="reset-btn" data-action="restart">처음부터</button>
        </div>
        <div class="next-box">
          <span>${escapeHtml(nextHelp)}</span>
          <button type="button" class="nav-btn" data-action="next" ${canGoNext() ? '' : 'disabled'}>${nextLabel}</button>
        </div>
      </div>
    </section>
  `;
}

function getDraftSuccessCount() {
  return state.responses.filter((response) => isSuccessfulEvaluation(response.draftEvaluation)).length;
}

function getCheckedCount() {
  return state.responses.filter((response) => response.draftEvaluation).length;
}

function getRevisionCount() {
  return state.responses.filter((response) => response.revisionEvaluation).length;
}

function renderSummary() {
  return `
    <section class="summary-page">
      <div class="summary-card">
        <div class="panel-head">
          <div>
            <div class="eyebrow">쓰기 결과</div>
            <h2>15컷 문장 쓰기 정리</h2>
            <p>초안과 수정 문장을 원문과 비교하면서 다시 보고 싶은 컷을 골라 보세요.</p>
          </div>
          ${renderTopTools('종합')}
        </div>
        <div class="summary-metrics">
          <div class="metric"><strong>${getCheckedCount()} / ${cuts.length}</strong><span>초안 확인</span></div>
          <div class="metric"><strong>${getDraftSuccessCount()} / ${cuts.length}</strong><span>의미 전달 성공</span></div>
          <div class="metric"><strong>${getRevisionCount()} / ${cuts.length}</strong><span>고쳐쓰기 확인</span></div>
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-list">
          ${state.responses.map((response, index) => {
            const cut = cuts[index];
            const result = response.revisionEvaluation || response.draftEvaluation;
            return `
              <div class="summary-item">
                <strong>컷 ${index + 1} · ${escapeHtml(cut.title)} · ${getEvaluationLabel(result)}</strong>
                <p>초안: ${response.draftText.trim() ? escapeHtml(response.draftText.trim()) : '아직 쓰지 않았습니다.'}</p>
                ${response.revisionText.trim() ? `<p>수정: ${escapeHtml(response.revisionText.trim())}</p>` : ''}
                <p>원문: ${escapeHtml(cut.sentence)}</p>
                <div class="actions">
                  <button type="button" class="ghost-btn" data-action="review-cut" data-cut-index="${index}">이 컷 다시 보기</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="actions">
          <button type="button" class="nav-btn" data-action="restart">처음부터 다시 하기</button>
        </div>
      </div>
    </section>
  `;
}

function renderApp() {
  app.innerHTML = `${state.view === 'summary' ? renderSummary() : renderActivity()}${state.passageOpen ? renderPassageModal() : ''}`;
  setupFloatingPreview();
  refreshLiveButtons();
  syncPassageUi();
  saveState();
}

function focusAfterRender(selector) {
  requestAnimationFrame(() => {
    const element = document.querySelector(selector);
    if (element) element.focus({ preventScroll: true });
  });
}

function syncPassageUi() {
  document.body.classList.toggle('passage-open', state.passageOpen);
  const navTrigger = document.querySelector('[data-nav-open-passage]');
  if (navTrigger) navTrigger.setAttribute('aria-expanded', state.passageOpen ? 'true' : 'false');

  if (shouldFocusPassageClose) {
    focusAfterRender('[data-passage-close-button]');
  } else if (shouldRestorePassageTrigger) {
    focusAfterRender('[data-nav-open-passage]');
  }

  shouldFocusPassageClose = false;
  shouldRestorePassageTrigger = false;
}

function handlePassageTabKey(event) {
  if (!state.passageOpen || event.key !== 'Tab') return;
  const dialog = document.getElementById('passage-dialog');
  if (!dialog) return;
  const focusableElements = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled && element.offsetParent !== null);
  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function teardownFloatingPreview() {
  if (floatingPreviewObserver) {
    floatingPreviewObserver.disconnect();
    floatingPreviewObserver = null;
  }
}

function setFloatingPreviewVisible(visible) {
  const preview = app.querySelector('[data-floating-preview]');
  if (preview) preview.classList.toggle('is-visible', visible);
}

function setupFloatingPreview() {
  teardownFloatingPreview();
  setFloatingPreviewVisible(false);
  if (state.view !== 'activity' || !floatingPreviewMedia.matches || typeof IntersectionObserver !== 'function') return;

  const imagePanel = app.querySelector('[data-image-panel]');
  const preview = app.querySelector('[data-floating-preview]');
  if (!imagePanel || !preview) return;

  floatingPreviewObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const shouldShow = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      preview.classList.toggle('is-visible', shouldShow);
    },
    {
      threshold: [0, 0.18, 0.45, 1],
      rootMargin: '-76px 0px 0px 0px'
    }
  );

  floatingPreviewObserver.observe(imagePanel);
}

function scrollToImagePanel() {
  const imagePanel = app.querySelector('[data-image-panel]');
  if (!imagePanel) return;
  setFloatingPreviewVisible(false);
  imagePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scheduleImagePanelScroll() {
  if (state.view !== 'activity' || typeof window.requestAnimationFrame !== 'function') return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollToImagePanel);
  });
}

function refreshLiveButtons() {
  const response = getCurrentResponse();
  const draftButton = app.querySelector('[data-action="check-draft"]');
  if (draftButton) draftButton.disabled = !response.draftText.trim();

  const revisionButton = app.querySelector('[data-action="check-revision"]');
  if (revisionButton) revisionButton.disabled = !response.draftEvaluation || !response.revisionText.trim();
}

function toggleHint(type) {
  const response = getCurrentResponse();
  if (!response.openedHints[type]) response.openedHints[type] = true;
  else response.openedHints[type] = false;
}

function updateClueNote(value) {
  getCurrentResponse().clueNote = value;
}

function updateDraftText(value) {
  const response = getCurrentResponse();
  response.draftText = value;
  response.draftEvaluation = null;
  response.revisionEvaluation = null;
}

function updateRevisionText(value) {
  const response = getCurrentResponse();
  response.revisionText = value;
  response.revisionEvaluation = null;
}

function checkDraft() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.draftEvaluation = evaluateWriting(response.draftText, cut);
  response.openedHints.model = true;
}

function checkRevision() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.revisionEvaluation = evaluateWriting(response.revisionText, cut);
}

function showAnswer() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.clueNote = cut.keywords.join(', ');
  response.openedHints = { keywords: true, frame: true, model: true };
  response.draftText = cut.sentence;
  response.draftEvaluation = evaluateWriting(cut.sentence, cut);
  response.revisionText = cut.sentence;
  response.revisionEvaluation = evaluateWriting(cut.sentence, cut);
}

function goPrev() {
  if (state.view === 'summary') {
    state.view = 'activity';
    state.currentCut = cuts.length - 1;
    return;
  }
  if (state.currentCut > 0) state.currentCut -= 1;
}

function goNext() {
  if (!canGoNext()) return false;
  if (state.currentCut < cuts.length - 1) {
    state.currentCut += 1;
    return true;
  }
  state.view = 'summary';
  return false;
}

function restartAll() {
  localStorage.removeItem(LS_KEY);
  state = buildInitialState();
}

function reviewCut(index) {
  state.view = 'activity';
  state.currentCut = Number(index);
}

function jumpToCut(index) {
  state.view = 'activity';
  state.currentCut = Number(index);
}

function openPassage() {
  state.passageOpen = true;
  shouldFocusPassageClose = true;
  shouldRestorePassageTrigger = false;
}

function closePassage() {
  state.passageOpen = false;
  shouldFocusPassageClose = false;
  shouldRestorePassageTrigger = true;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action } = target.dataset;
  let shouldRender = true;
  let shouldScrollToImagePanel = false;

  if (action === 'toggle-hint') toggleHint(target.dataset.hint);
  else if (action === 'check-draft') checkDraft();
  else if (action === 'check-revision') checkRevision();
  else if (action === 'show-answer') showAnswer();
  else if (action === 'prev') goPrev();
  else if (action === 'next') shouldScrollToImagePanel = goNext();
  else if (action === 'restart') restartAll();
  else if (action === 'review-cut') reviewCut(target.dataset.cutIndex);
  else if (action === 'jump-to-cut') {
    jumpToCut(target.dataset.cutIndex);
    shouldScrollToImagePanel = true;
  }
  else if (action === 'scroll-to-image') {
    scrollToImagePanel();
    shouldRender = false;
  }
  else if (action === 'open-passage') openPassage();
  else if (action === 'close-passage') closePassage();
  else shouldRender = false;

  if (shouldRender) {
    renderApp();
    if (shouldScrollToImagePanel) scheduleImagePanelScroll();
  }
});

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.action === 'clue-note') updateClueNote(target.value);
  if (target.dataset.action === 'draft-text') updateDraftText(target.value);
  if (target.dataset.action === 'revision-text') updateRevisionText(target.value);
  refreshLiveButtons();
  saveState();
});

document.addEventListener('keydown', (event) => {
  handlePassageTabKey(event);
  if (event.key === 'Escape' && state.passageOpen) {
    closePassage();
    renderApp();
  }
});

document.addEventListener('click', (event) => {
  const navTrigger = event.target.closest('[data-nav-open-passage]');
  if (!navTrigger) return;
  event.preventDefault();
  openPassage();
  renderApp();
});

if (typeof floatingPreviewMedia.addEventListener === 'function') {
  floatingPreviewMedia.addEventListener('change', setupFloatingPreview);
} else if (typeof floatingPreviewMedia.addListener === 'function') {
  floatingPreviewMedia.addListener(setupFloatingPreview);
}

window.__C11_WRITING_CUT = {
  getCurrentSentence: () => getCurrentCut().sentence,
  getCurrentCutIndex: () => state.currentCut,
  getCutCount: () => cuts.length
};

renderApp();
