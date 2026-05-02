const IMG_BASE = '../assets/c16/reading-writing/images/writing-cut/';
const IMG_VERSION = '?v=1';
const IS_TEACHER = Boolean(window.C16_WRITING_CUT_TEACHER);
const LS_KEY = IS_TEACHER ? 'writing_cut_c16_teacher_v1' : 'writing_cut_c16_modern_v1';
const STEP_LABELS = ['문장 고르기', '어휘 넣기', '순서 배열', '빈칸 쓰기', '전체 문장 쓰기'];
const STEP_GUIDES = [
  '그림에 맞는 문장을 먼저 찾아 보세요.',
  '핵심 어휘 두 개를 문장에 넣어 보세요.',
  '어절을 순서대로 눌러 문장을 완성해 보세요.',
  '이제 빈칸 두 곳에 들어갈 말을 직접 써 보세요.',
  '마지막으로 도움 없이 전체 문장을 직접 써 보세요.'
];

const PASSAGE_FULL_PARAGRAPHS = [
  '서울 시민의 산책 장소로 유명한 한강공원이 야외 활동의 천국이라는 사실을 아는 사람은 많지 않다. 도시에서는 생각도 못 했던 활동들을 한강에서는 즐길 수 있다. 서울시는 이번 봄에 한강공원에서 즐길 수 있는 특별한 활동을 추천하고 있다.',
  '먼저 뚝섬 한강공원에 가면 높이가 다른 네모 모양의 울퉁불퉁한 벽을 볼 수 있는데 그게 바로 인공 암벽장이다. 인공 암벽장은 누구나 무료로 이용할 수 있고 암벽 등반도 무료로 배울 수 있다. 이용 시간은 성수기(3~11월)에는 오전 9시부터 오후 9시까지, 비수기(12~2월)에는 오전 9시부터 오후 5시까지이다.',
  '광나루 한강공원에서는 자전거와 레일바이크를 즐길 수 있다. 자전거 이용 요금은 20분에 1,000원이고, 만 6세 미만 어린이는 무료다. 레일바이크는 약 10분 동안 탈 수 있는 길이인데 2인용 좌석 사이에 작은 의자가 있어서 어린이와 함께 온 가족도 이용할 만하다. 총 10대가 마련돼 있으며 이용 요금은 2,000원이다.'
];

const PASSAGE_SECTIONS = [
  { title: '도입: 한강공원의 숨은 활동', body: PASSAGE_FULL_PARAGRAPHS[0] },
  { title: '뚝섬 한강공원: 인공 암벽장', body: PASSAGE_FULL_PARAGRAPHS[1] },
  { title: '광나루 한강공원: 자전거와 레일바이크', body: PASSAGE_FULL_PARAGRAPHS[2] }
];

const SENTENCES = [
  '서울 시민의 산책 장소로 유명한 한강공원이 야외 활동의 천국이라는 사실을 아는 사람은 많지 않다.',
  '도시에서는 생각도 못 했던 활동들을 한강에서는 즐길 수 있다.',
  '서울시는 이번 봄에 한강공원에서 즐길 수 있는 특별한 활동을 추천하고 있다.',
  '먼저 뚝섬 한강공원에 가면 높이가 다른 네모 모양의 울퉁불퉁한 벽을 볼 수 있는데 그게 바로 인공 암벽장이다.',
  '인공 암벽장은 누구나 무료로 이용할 수 있고 암벽 등반도 무료로 배울 수 있다.',
  '이용 시간은 성수기(3~11월)에는 오전 9시부터 오후 9시까지, 비수기(12~2월)에는 오전 9시부터 오후 5시까지이다.',
  '광나루 한강공원에서는 자전거와 레일바이크를 즐길 수 있다.',
  '자전거 이용 요금은 20분에 1,000원이고, 만 6세 미만 어린이는 무료다.',
  '레일바이크는 약 10분 동안 탈 수 있는 길이인데 2인용 좌석 사이에 작은 의자가 있어서 어린이와 함께 온 가족도 이용할 만하다.',
  '총 10대가 마련돼 있으며 이용 요금은 2,000원이다.'
];

const RAW_CUTS = [
  {
    imgFile: 'c16-cut01.webp',
    alt: '한강공원을 보며 야외 활동의 천국이라는 사실에 놀라는 장면',
    distractors: [2, 4, 7],
    dropSegments: ['서울 시민의 ', '로 유명한 한강공원이 ', '이라는 사실을 아는 사람은 많지 않다.'],
    dropAnswers: ['산책 장소', '야외 활동의 천국'],
    dropChoices: ['산책 장소', '야외 활동의 천국', '인공 암벽장', '이용 요금'],
    orderTokens: ['서울 시민의 산책 장소로 유명한', '한강공원이', '야외 활동의 천국이라는 사실을', '아는 사람은 많지 않다.'],
    fillPrompt: '서울 시민의 [1]로 유명한 한강공원이 [2]이라는 사실을 아는 사람은 많지 않다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['산책 장소', '산책장소'] },
      { label: '빈칸 2', answers: ['야외 활동의 천국', '야외활동의천국', '야외 활동 천국'] }
    ],
    hints: ['한강공원', '산책 장소', '야외 활동의 천국'],
    requiredKeywords: ['한강공원', '산책 장소', '천국'],
    acceptedPatterns: ['서울 시민의 산책 장소로 유명한 한강공원이 야외 활동의 천국이라는 사실을 아는 사람은 많지 않습니다.']
  },
  {
    imgFile: 'c16-cut02.webp',
    alt: '한강에서 암벽 등반, 자전거, 레일바이크를 즐기는 장면',
    distractors: [0, 5, 8],
    dropSegments: ['도시에서는 ', ' 활동들을 한강에서는 ', '.'],
    dropAnswers: ['생각도 못 했던', '즐길 수 있다'],
    dropChoices: ['생각도 못 했던', '즐길 수 있다', '무료로 배울 수 있다', '이용할 만하다'],
    orderTokens: ['도시에서는', '생각도 못 했던 활동들을', '한강에서는', '즐길 수 있다.'],
    fillPrompt: '도시에서는 [1] 활동들을 한강에서는 [2].',
    fillBlanks: [
      { label: '빈칸 1', answers: ['생각도 못 했던', '생각도 못했던', '생각 못 했던'] },
      { label: '빈칸 2', answers: ['즐길 수 있다', '즐길수있다'] }
    ],
    hints: ['도시', '생각도 못 하다', '즐기다'],
    requiredKeywords: ['도시', '생각도 못', '즐길'],
    acceptedPatterns: ['도시에서는 생각하지 못했던 활동들을 한강에서는 즐길 수 있다.']
  },
  {
    imgFile: 'c16-cut03.webp',
    alt: '한강공원 봄 특별 활동 추천 안내판을 보는 장면',
    distractors: [1, 6, 9],
    dropSegments: ['서울시는 ', '에 한강공원에서 즐길 수 있는 ', '을 추천하고 있다.'],
    dropAnswers: ['이번 봄', '특별한 활동'],
    dropChoices: ['이번 봄', '특별한 활동', '만 6세 미만', '총 10대'],
    orderTokens: ['서울시는 이번 봄에', '한강공원에서 즐길 수 있는', '특별한 활동을', '추천하고 있다.'],
    fillPrompt: '서울시는 [1]에 한강공원에서 즐길 수 있는 [2]을 추천하고 있다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['이번 봄', '이번봄'] },
      { label: '빈칸 2', answers: ['특별한 활동', '특별한활동'] }
    ],
    hints: ['서울시', '이번 봄', '특별한 활동'],
    requiredKeywords: ['서울시', '이번 봄', '특별한 활동'],
    acceptedPatterns: ['서울시는 이번 봄 한강공원에서 즐길 수 있는 특별한 활동을 추천하고 있다.']
  },
  {
    imgFile: 'c16-cut04.webp',
    alt: '뚝섬 한강공원 인공 암벽장을 바라보는 장면',
    distractors: [2, 5, 7],
    dropSegments: ['먼저 ', '에 가면 높이가 다른 네모 모양의 울퉁불퉁한 벽을 볼 수 있는데 그게 바로 ', '이다.'],
    dropAnswers: ['뚝섬 한강공원', '인공 암벽장'],
    dropChoices: ['뚝섬 한강공원', '인공 암벽장', '광나루 한강공원', '자전거 대여소'],
    orderTokens: ['먼저 뚝섬 한강공원에 가면', '높이가 다른 네모 모양의', '울퉁불퉁한 벽을 볼 수 있는데', '그게 바로 인공 암벽장이다.'],
    fillPrompt: '먼저 [1]에 가면 높이가 다른 네모 모양의 울퉁불퉁한 벽을 볼 수 있는데 그게 바로 [2]이다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['뚝섬 한강공원', '뚝섬한강공원'] },
      { label: '빈칸 2', answers: ['인공 암벽장', '인공암벽장'] }
    ],
    hints: ['뚝섬', '네모 모양', '울퉁불퉁한 벽'],
    requiredKeywords: ['뚝섬', '네모', '인공 암벽장'],
    acceptedPatterns: ['먼저 뚝섬 한강공원에 가면 높이가 다른 네모 모양의 울퉁불퉁한 벽이 있는데 그게 바로 인공 암벽장이다.']
  },
  {
    imgFile: 'c16-cut05.webp',
    alt: '인공 암벽장을 무료로 이용하고 등반을 배우는 장면',
    distractors: [0, 6, 9],
    dropSegments: ['인공 암벽장은 누구나 ', '할 수 있고 암벽 등반도 ', ' 수 있다.'],
    dropAnswers: ['무료로 이용', '무료로 배울'],
    dropChoices: ['무료로 이용', '무료로 배울', '20분에 이용', '2,000원에 탈'],
    orderTokens: ['인공 암벽장은 누구나', '무료로 이용할 수 있고', '암벽 등반도', '무료로 배울 수 있다.'],
    fillPrompt: '인공 암벽장은 누구나 [1]할 수 있고 암벽 등반도 [2] 수 있다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['무료로 이용', '무료 이용'] },
      { label: '빈칸 2', answers: ['무료로 배울', '무료로배울', '무료 배울'] }
    ],
    hints: ['인공 암벽장', '무료 이용', '암벽 등반'],
    requiredKeywords: ['인공 암벽장', '무료', '암벽 등반'],
    acceptedPatterns: ['인공 암벽장은 누구나 무료로 이용할 수 있고 암벽 등반도 무료로 배울 수 있습니다.']
  },
  {
    imgFile: 'c16-cut06.webp',
    alt: '인공 암벽장 성수기와 비수기 이용 시간을 안내하는 표지판',
    distractors: [3, 7, 8],
    dropSegments: ['이용 시간은 ', '에는 오전 9시부터 오후 9시까지, ', '에는 오전 9시부터 오후 5시까지이다.'],
    dropAnswers: ['성수기(3~11월)', '비수기(12~2월)'],
    dropChoices: ['성수기(3~11월)', '비수기(12~2월)', '20분에 1,000원', '약 10분 동안'],
    orderTokens: ['이용 시간은 성수기(3~11월)에는', '오전 9시부터 오후 9시까지,', '비수기(12~2월)에는', '오전 9시부터 오후 5시까지이다.'],
    fillPrompt: '이용 시간은 [1]에는 오전 9시부터 오후 9시까지, [2]에는 오전 9시부터 오후 5시까지이다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['성수기(3~11월)', '성수기', '성수기 3~11월', '3~11월'] },
      { label: '빈칸 2', answers: ['비수기(12~2월)', '비수기', '비수기 12~2월', '12~2월'] }
    ],
    hints: ['성수기', '비수기', '오전 9시'],
    requiredKeywords: ['성수기', '오후 9시', '비수기', '오후 5시'],
    acceptedPatterns: ['이용 시간은 성수기에는 오전 9시부터 오후 9시까지, 비수기에는 오전 9시부터 오후 5시까지이다.']
  },
  {
    imgFile: 'c16-cut07.webp',
    alt: '광나루 한강공원에서 자전거와 레일바이크를 함께 즐기는 장면',
    distractors: [1, 4, 8],
    dropSegments: ['', '에서는 자전거와 ', '를 즐길 수 있다.'],
    dropAnswers: ['광나루 한강공원', '레일바이크'],
    dropChoices: ['광나루 한강공원', '레일바이크', '뚝섬 한강공원', '암벽 등반'],
    orderTokens: ['광나루 한강공원에서는', '자전거와', '레일바이크를', '즐길 수 있다.'],
    fillPrompt: '[1]에서는 자전거와 [2]를 즐길 수 있다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['광나루 한강공원', '광나루한강공원'] },
      { label: '빈칸 2', answers: ['레일바이크', '레일 바이크'] }
    ],
    hints: ['광나루', '자전거', '레일바이크'],
    requiredKeywords: ['광나루', '자전거', '레일바이크'],
    acceptedPatterns: ['광나루 한강공원에서 자전거와 레일바이크를 즐길 수 있다.']
  },
  {
    imgFile: 'c16-cut08.webp',
    alt: '자전거 이용 요금과 만 6세 미만 어린이 무료 안내판을 보는 장면',
    distractors: [2, 5, 9],
    dropSegments: ['자전거 이용 요금은 ', '이고, ', ' 어린이는 무료다.'],
    dropAnswers: ['20분에 1,000원', '만 6세 미만'],
    dropChoices: ['20분에 1,000원', '만 6세 미만', '오전 9시부터', '총 10대'],
    orderTokens: ['자전거 이용 요금은', '20분에 1,000원이고,', '만 6세 미만 어린이는', '무료다.'],
    fillPrompt: '자전거 이용 요금은 [1]이고, [2] 어린이는 무료다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['20분에 1,000원', '20분에 1000원', '20분 1,000원', '20분 1000원'] },
      { label: '빈칸 2', answers: ['만 6세 미만', '만6세미만', '6세 미만'] }
    ],
    hints: ['자전거 요금', '20분', '어린이 무료'],
    requiredKeywords: ['자전거', '20분', '1,000원', '무료'],
    acceptedPatterns: ['자전거 이용 요금은 20분에 1000원이고, 만 6세 미만 어린이는 무료다.']
  },
  {
    imgFile: 'c16-cut09.webp',
    alt: '가족이 함께 레일바이크를 타는 장면',
    distractors: [0, 4, 7],
    dropSegments: ['레일바이크는 ', ' 탈 수 있는 길이인데 2인용 좌석 사이에 ', '가 있어서 어린이와 함께 온 가족도 이용할 만하다.'],
    dropAnswers: ['약 10분 동안', '작은 의자'],
    dropChoices: ['약 10분 동안', '작은 의자', '오후 5시까지', '울퉁불퉁한 벽'],
    orderTokens: ['레일바이크는 약 10분 동안', '탈 수 있는 길이인데', '2인용 좌석 사이에 작은 의자가 있어서', '어린이와 함께 온 가족도', '이용할 만하다.'],
    fillPrompt: '레일바이크는 [1] 탈 수 있는 길이인데 2인용 좌석 사이에 [2]가 있어서 어린이와 함께 온 가족도 이용할 만하다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['약 10분 동안', '약10분동안', '10분 동안'] },
      { label: '빈칸 2', answers: ['작은 의자', '작은의자'] }
    ],
    hints: ['레일바이크', '약 10분', '이용할 만하다'],
    requiredKeywords: ['레일바이크', '10분', '작은 의자', '이용할 만하다'],
    acceptedPatterns: ['레일바이크는 약 10분 동안 탈 수 있고 2인용 좌석 사이에 작은 의자가 있어서 온 가족도 이용할 만하다.']
  },
  {
    imgFile: 'c16-cut10.webp',
    alt: '총 10대의 레일바이크와 2,000원 이용 요금을 보여 주는 장면',
    distractors: [3, 5, 8],
    dropSegments: ['', '가 마련돼 있으며 이용 요금은 ', '이다.'],
    dropAnswers: ['총 10대', '2,000원'],
    dropChoices: ['총 10대', '2,000원', '20분', '오전 9시'],
    orderTokens: ['총 10대가 마련돼 있으며', '이용 요금은', '2,000원이다.'],
    fillPrompt: '[1]가 마련돼 있으며 이용 요금은 [2]이다.',
    fillBlanks: [
      { label: '빈칸 1', answers: ['총 10대', '총10대', '10대'] },
      { label: '빈칸 2', answers: ['2,000원', '2000원'] }
    ],
    hints: ['레일바이크', '총 10대', '2,000원'],
    requiredKeywords: ['총 10대', '이용 요금', '2,000원'],
    acceptedPatterns: ['총 10대가 마련되어 있으며 이용 요금은 2,000원이다.', '총 10대가 마련돼 있으며 이용 요금은 2000원이다.']
  }
];
const cuts = RAW_CUTS.map(({ distractors, ...cut }, index) => ({
  id: `cut${String(index + 1).padStart(2, '0')}`,
  sentence: SENTENCES[index],
  mcqOptions: [SENTENCES[index], ...distractors.map((choiceIndex) => SENTENCES[choiceIndex])],
  ...cut
}));

const app = document.getElementById('app');
let floatingPreviewObserver = null;
const floatingPreviewMedia = window.matchMedia('(max-width: 960px)');
let shouldFocusPassageClose = false;
let shouldRestorePassageTrigger = false;

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildInitialState() {
  return {
    view: 'activity',
    currentCut: 0,
    currentStep: 0,
    passageOpen: false,
    activeSlot: 0,
    responses: cuts.map((cut) => ({
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
    }))
  };
}

function isUsableSavedState(candidate) {
  return Boolean(
    candidate &&
    Array.isArray(candidate.responses) &&
    candidate.responses.length === cuts.length &&
    typeof candidate.currentCut === 'number' &&
    typeof candidate.currentStep === 'number'
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
    // Storage can fail in private browsing; the activity still works without it.
  }
}

let state = loadState();
if (typeof state.passageOpen !== 'boolean') state.passageOpen = false;

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[\s.,!?~'"“”‘’]/g, '')
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

function getCurrentCut() {
  return cuts[state.currentCut];
}

function getCurrentResponse() {
  return state.responses[state.currentCut];
}

function getImageSrc(cut) {
  return `${IMG_BASE}${cut.imgFile}${IMG_VERSION}`;
}

function getStepResponse(response, stepIndex) {
  return response[`step${stepIndex + 1}`];
}

function canGoNext() {
  if (IS_TEACHER) return state.view !== 'summary';
  if (state.view === 'summary') return false;
  return getStepResponse(getCurrentResponse(), state.currentStep).checked;
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
  const normalizedRaw = normalizeText(raw);
  const matchedKeywords = cut.requiredKeywords.filter((keyword) =>
    normalizedRaw.includes(normalizeText(keyword))
  );

  if (!raw) {
    return { level: 'empty', matchedKeywords, missingKeywords: cut.requiredKeywords };
  }

  if (normalizedRaw === normalizeText(cut.sentence)) {
    return { level: 'exact', matchedKeywords: cut.requiredKeywords, missingKeywords: [] };
  }

  if (cut.acceptedPatterns.some((pattern) => normalizedRaw === normalizeText(pattern))) {
    return { level: 'accepted', matchedKeywords, missingKeywords: [] };
  }

  if (matchedKeywords.length === cut.requiredKeywords.length) {
    return { level: 'strong', matchedKeywords, missingKeywords: [] };
  }

  return {
    level: matchedKeywords.length >= Math.max(2, cut.requiredKeywords.length - 1) ? 'partial' : 'weak',
    matchedKeywords,
    missingKeywords: cut.requiredKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
  };
}

function feedbackBlock(type, title, body, extra = '') {
  return `
    <div id="step-feedback" class="feedback ${type}">
      <strong>${title}</strong>
      <div>${body}</div>
      ${extra ? `<div>${extra}</div>` : ''}
    </div>
  `;
}

function renderTopTools(label) {
  return `
    <div class="top-tools">
      <button type="button" class="passage-open-btn" data-action="open-passage" aria-haspopup="dialog" aria-controls="passage-dialog">
        <span class="passage-open-btn__label">전체 글 보기</span>
        <span class="passage-open-btn__hint">${label}을 쓰다가 지문을 확인할 수 있어요</span>
      </button>
    </div>
  `;
}

function renderGuideZone(buttonMarkup, message, tone = 'primary', compact = false) {
  return `
    <div class="guide-zone ${compact ? 'compact' : ''}">
      <div class="guide-callout ${tone}">${escapeHtml(message)}</div>
      ${buttonMarkup}
    </div>
  `;
}

function renderStepPills() {
  return STEP_LABELS.map((label, index) => {
    const done = state.responses.every((response) => getStepResponse(response, index).checked);
    const active = index === state.currentStep;
    if (IS_TEACHER) {
      return `<button type="button" class="step-pill ${done ? 'done' : ''} ${active ? 'active' : ''}" data-action="jump-to-step" data-step-index="${index}" aria-current="${active ? 'step' : 'false'}">${index + 1}. ${escapeHtml(label)}</button>`;
    }
    return `<div class="step-pill ${done ? 'done' : ''} ${active ? 'active' : ''}">${index + 1}. ${escapeHtml(label)}</div>`;
  }).join('');
}

function renderCutPills() {
  return cuts.map((cut, index) => {
    const response = state.responses[index];
    const done = getStepResponse(response, state.currentStep).checked;
    const active = index === state.currentCut;
    if (IS_TEACHER) {
      return `<button type="button" class="cut-pill ${done ? 'done' : ''} ${active ? 'active' : ''}" data-action="jump-to-cut" data-cut-index="${index}" aria-current="${active ? 'page' : 'false'}">컷 ${index + 1}</button>`;
    }
    return `<div class="cut-pill ${done ? 'done' : ''} ${active ? 'active' : ''}">컷 ${index + 1}</div>`;
  }).join('');
}

function renderPassageModal() {
  return `
    <div class="passage-backdrop" data-action="close-passage"></div>
    <section id="passage-dialog" class="passage-modal" role="dialog" aria-modal="true" aria-labelledby="passage-title" tabindex="-1">
      <div class="passage-head">
        <div>
          <div class="eyebrow">16과 읽기 지문</div>
          <h2 id="passage-title" class="passage-title">한강공원의 숨은 재미를 찾아서!</h2>
          <p class="passage-subtitle">문장을 쓰다가 원문 흐름을 확인하고 싶을 때 열어 보세요.</p>
        </div>
        <button type="button" class="ghost-btn" data-action="close-passage" data-passage-close-button>닫기</button>
      </div>
      <div class="passage-body">
        <div class="passage-card">
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
  const wideLabel = state.currentCut === 6 || state.currentCut === 13 ? '와이드 컷' : '그림 보기';
  return `
    <section class="panel" data-image-panel>
      <div class="panel-head">
        <div>
          <h3>컷 ${state.currentCut + 1}</h3>
          <p>그림을 먼저 보고, 인물과 행동, 핵심 장면을 떠올려 보세요.</p>
        </div>
        <span class="highlight-tag">${wideLabel}</span>
      </div>
      <div class="image-wrap">
        <img src="${getImageSrc(cut)}" alt="${escapeHtml(cut.alt)}" data-primary-image>
      </div>
      <div class="image-caption">그림 속 장면을 읽고, 아래 힌트로 어떤 문장이 어울리는지 추측해 보세요.</div>
      <div class="support-row">
        ${cut.hints.map((hint) => `<span class="support-chip">${escapeHtml(hint)}</span>`).join('')}
      </div>
    </section>
  `;
}

function renderFloatingPreview(cut) {
  return `
    <button type="button" class="floating-image-preview" data-action="scroll-to-image" data-floating-preview aria-label="현재 그림으로 다시 이동하기">
      <img src="${getImageSrc(cut)}" alt="">
      <span class="floating-image-preview__copy">
        <strong>현재 그림</strong>
        <span>컷 ${state.currentCut + 1} 다시 보려면 누르세요</span>
      </span>
    </button>
  `;
}

function renderStep1(cut, response) {
  const feedback = !response.step1.checked ? '' : response.step1.correct
    ? feedbackBlock('correct', '좋아요. 그림과 문장이 잘 맞습니다.', `정답 문장: ${escapeHtml(cut.sentence)}`)
    : feedbackBlock('warn', '그림과 문장을 한 번 더 비교해 보세요.', `모범 문장: ${escapeHtml(cut.sentence)}`);

  return `
    <div class="instruction-card">
      <strong>1단계</strong>
      <span>컷을 보고 가장 잘 맞는 문장을 고르세요.</span>
    </div>
    <div class="choice-list" data-step1-choice-list>
      ${response.step1.optionOrder.map((option) => {
        const selected = response.step1.selected === option.id;
        const correct = response.step1.checked && option.label === cut.sentence;
        const wrong = response.step1.checked && selected && !correct;
        return `
          <button type="button" class="choice-btn ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-action="select-choice" data-option-id="${option.id}" aria-pressed="${selected ? 'true' : 'false'}">
            ${escapeHtml(option.label)}
          </button>
        `;
      }).join('')}
    </div>
    ${feedback}
    <div class="actions">
      <button type="button" class="nav-btn" data-action="check-step1" ${response.step1.selected === null ? 'disabled' : ''}>확인하기</button>
    </div>
  `;
}

function renderTemplateLine(cut, response) {
  return cut.dropSegments.map((segment, index) => {
    const choice = findById(response.step2.choiceOrder, response.step2.placements[index]);
    const slot = index < cut.dropAnswers.length
      ? `<button type="button" class="drop-slot ${state.activeSlot === index ? 'active' : ''} ${choice ? 'filled' : ''}" data-action="activate-slot" data-slot="${index}">${choice ? escapeHtml(choice.label) : `빈칸 ${index + 1}`}</button>`
      : '';
    return `${escapeHtml(segment)}${slot}`;
  }).join('');
}

function renderStep2(cut, response) {
  const complete = response.step2.placements.every((value) => value !== null);
  const feedback = !response.step2.checked ? '' : response.step2.correct
    ? feedbackBlock('correct', '핵심 어휘가 정확합니다.', '이제 같은 문장을 순서대로 배열해 볼 수 있어요.')
    : feedbackBlock('warn', '어휘 위치를 다시 확인해 보세요.', `정답 어휘: ${cut.dropAnswers.map(escapeHtml).join(', ')}`);

  return `
    <div class="instruction-card">
      <strong>2단계</strong>
      <span>빈칸을 누른 뒤 알맞은 어휘를 넣어 문장을 완성하세요.</span>
    </div>
    <div class="template-box">
      <div class="template-line">${renderTemplateLine(cut, response)}</div>
    </div>
    <div class="word-bank">
      ${response.step2.choiceOrder.map((choice) => {
        const used = response.step2.placements.includes(choice.id);
        return `<button type="button" class="word-chip ${used ? 'used' : ''}" data-action="use-word" data-choice-id="${choice.id}" ${used ? 'disabled' : ''}>${escapeHtml(choice.label)}</button>`;
      }).join('')}
    </div>
    ${feedback}
    <div class="actions">
      <button type="button" class="ghost-btn" data-action="reset-step2">다시 놓기</button>
      <button type="button" class="nav-btn" data-action="check-step2" ${complete ? '' : 'disabled'}>확인하기</button>
    </div>
  `;
}

function renderStep3(cut, response) {
  const complete = response.step3.arranged.length === cut.orderTokens.length;
  const arrangedItems = response.step3.arranged.map((id) => findById(response.step3.bankOrder, id)).filter(Boolean);
  const feedback = !response.step3.checked ? '' : response.step3.correct
    ? feedbackBlock('correct', '문장 순서가 정확합니다.', '이 흐름을 기억하고 빈칸 쓰기로 넘어가 보세요.')
    : feedbackBlock('warn', '어절 순서를 다시 배열해 보세요.', `정답: ${escapeHtml(cut.sentence)}`);

  return `
    <div class="instruction-card">
      <strong>3단계</strong>
      <span>아래 어절을 눌러 올바른 문장 순서로 배열하세요.</span>
    </div>
    <div class="arranged-box">
      <div class="arranged-line">
        ${arrangedItems.length ? arrangedItems.map((item) => `<button type="button" class="order-chip" data-action="remove-order" data-order-id="${item.id}">${escapeHtml(item.label)}</button>`).join('') : '<span class="blank-inline">여기에 순서대로 쌓입니다</span>'}
      </div>
    </div>
    <div class="order-row">
      ${response.step3.bankOrder.map((item) => {
        const used = response.step3.arranged.includes(item.id);
        return `<button type="button" class="order-chip ${used ? 'used' : ''}" data-action="pick-order" data-order-id="${item.id}" ${used ? 'disabled' : ''}>${escapeHtml(item.label)}</button>`;
      }).join('')}
    </div>
    ${feedback}
    <div class="actions">
      <button type="button" class="ghost-btn" data-action="reset-step3">다시 배열</button>
      <button type="button" class="nav-btn" data-action="check-step3" ${complete ? '' : 'disabled'}>확인하기</button>
    </div>
  `;
}

function renderStep4(cut, response) {
  const feedback = !response.step4.checked ? '' : response.step4.correct
    ? feedbackBlock('correct', '빈칸을 모두 정확히 썼습니다.', '마지막 단계에서는 문장 전체를 도움 없이 써 보세요.')
    : feedbackBlock('warn', `${response.step4.correctCount} / ${cut.fillBlanks.length}개가 맞았습니다.`, `정답: ${cut.fillBlanks.map((blank) => escapeHtml(blank.answers[0])).join(', ')}`);

  return `
    <div class="instruction-card">
      <strong>4단계</strong>
      <span>힌트를 보지 않고 빈칸에 들어갈 말을 직접 써 보세요.</span>
    </div>
    <div class="fill-preview">${escapeHtml(cut.fillPrompt)}</div>
    <div class="fill-grid">
      ${cut.fillBlanks.map((blank, index) => `
        <div class="fill-field">
          <label for="fill-${index}">${escapeHtml(blank.label)}</label>
          <input id="fill-${index}" type="text" value="${escapeHtml(response.step4.inputs[index])}" data-action="fill-input" data-fill-index="${index}" autocomplete="off">
        </div>
      `).join('')}
    </div>
    ${feedback}
    <div class="actions">
      <button type="button" class="nav-btn" data-action="check-step4" ${response.step4.inputs.some((value) => !value.trim()) ? 'disabled' : ''}>확인하기</button>
    </div>
  `;
}

function getSentenceLabel(result) {
  if (result.level === 'exact' || result.level === 'accepted') return '정확';
  if (result.level === 'strong') return '핵심 표현 포함';
  if (result.level === 'partial') return '부분 완성';
  if (result.level === 'weak') return '보완 필요';
  return '미작성';
}

function renderStep5(cut, response) {
  const result = response.step5.evaluation;
  const feedback = !response.step5.checked ? '' : (() => {
    if (['exact', 'accepted', 'strong'].includes(result.level)) {
      return feedbackBlock('correct', `좋아요. ${getSentenceLabel(result)}입니다.`, `모범 문장: ${escapeHtml(cut.sentence)}`);
    }
    return feedbackBlock('warn', `조금 더 보완해 보세요. ${getSentenceLabel(result)} 상태입니다.`, `빠진 핵심 표현: ${escapeHtml(result.missingKeywords.join(', ') || '문장 흐름')}`, `모범 문장: ${escapeHtml(cut.sentence)}`);
  })();

  return `
    <div class="instruction-card">
      <strong>5단계</strong>
      <span>그림만 보고 문장 전체를 직접 써 보세요. 원문과 완전히 같지 않아도 핵심 표현을 살리면 됩니다.</span>
    </div>
    <div class="fullwrite-box">
      <label for="full-text">전체 문장</label>
      <textarea id="full-text" data-action="full-text" placeholder="여기에 문장을 써 보세요.">${escapeHtml(response.step5.text)}</textarea>
    </div>
    ${feedback}
    <div class="actions">
      <button type="button" class="nav-btn" data-action="check-step5" ${response.step5.text.trim() ? '' : 'disabled'}>확인하기</button>
    </div>
  `;
}

function renderStepPanel(cut, response) {
  const renderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];
  const content = renderers[state.currentStep](cut, response);
  let nextLabel = '다음 컷';
  if (state.currentCut === cuts.length - 1) {
    nextLabel = state.currentStep === STEP_LABELS.length - 1 ? '종합 피드백 보기' : '다음 단계';
  }

  const nextGuide = state.currentCut === cuts.length - 1
    ? (state.currentStep === STEP_LABELS.length - 1 ? '마지막이면 종합 피드백으로 넘어갑니다' : '이 단계가 끝나면 다음 단계로 이동합니다')
    : '이 컷이 끝나면 다음 컷으로 이동합니다';
  const nextButton = `<button type="button" class="nav-btn" data-action="next" ${canGoNext() ? '' : 'disabled'}>${nextLabel}</button>`;
  const nextGuideMessage = IS_TEACHER || canGoNext()
    ? nextGuide
    : '먼저 위 활동을 끝내면 진행할 수 있어요';
  const nextGuideTone = IS_TEACHER || canGoNext() ? 'success' : 'primary';

  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h3>${state.currentStep + 1}단계 · ${STEP_LABELS[state.currentStep]}</h3>
          <p>${STEP_GUIDES[state.currentStep]} ${IS_TEACHER ? '교사용 페이지에서는 진행도와 상관없이 모든 단계와 컷을 바로 열 수 있습니다.' : '지금은 이 단계로 모든 컷을 차례대로 연습하는 중입니다.'}</p>
        </div>
        <span class="highlight-tag">${IS_TEACHER ? '교사용' : '지금 하기'}</span>
      </div>
      ${content}
      <div class="actions">
        <div class="action-group">
          <button type="button" class="ghost-btn" data-action="prev" ${(state.currentCut === 0 && state.currentStep === 0) ? 'disabled' : ''}>이전</button>
          <button type="button" class="reset-btn" data-action="restart">처음부터</button>
          ${IS_TEACHER ? '<button type="button" class="show-answer-btn" data-action="show-answer">정답 보기</button>' : ''}
        </div>
        ${renderGuideZone(nextButton, nextGuideMessage, nextGuideTone, true)}
      </div>
    </section>
  `;
}

function getStepMetricValue(stepIndex) {
  return state.responses.filter((response) => getStepResponse(response, stepIndex).checked).length;
}

function renderSummary() {
  const sentenceSuccess = state.responses.filter((response, index) => {
    const result = response.step5.evaluation || evaluateSentence(response.step5.text, cuts[index]);
    return ['exact', 'accepted', 'strong'].includes(result.level);
  }).length;

  return `
    <section class="summary-card">
      <div class="panel-head">
        <div>
          <div class="eyebrow">16과 컷 쓰기 완료</div>
          <h2 class="progress-title">한강공원의 숨은 재미를 끝까지 다시 썼습니다</h2>
          <p>필요한 컷은 다시 돌아가서 문장을 보완할 수 있습니다.</p>
        </div>
        ${renderTopTools('마무리')}
      </div>

      <div class="summary-metrics">
        <div class="metric"><strong>${getStepMetricValue(0)} / ${cuts.length}</strong><span>문장 고르기</span></div>
        <div class="metric"><strong>${getStepMetricValue(1)} / ${cuts.length}</strong><span>어휘 넣기</span></div>
        <div class="metric"><strong>${getStepMetricValue(2)} / ${cuts.length}</strong><span>순서 배열</span></div>
        <div class="metric"><strong>${getStepMetricValue(3)} / ${cuts.length}</strong><span>빈칸 쓰기</span></div>
        <div class="metric"><strong>${sentenceSuccess} / ${cuts.length}</strong><span>전체 문장 쓰기</span></div>
      </div>
    </section>

    <section class="summary-card">
      <div class="panel-head">
        <div>
          <h3>컷별 문장 확인</h3>
          <p>내가 쓴 문장과 모범 문장을 비교해 보세요.</p>
        </div>
        <span class="highlight-tag">다시 보기</span>
      </div>
      <div class="summary-list">
        ${state.responses.map((response, index) => {
          const cut = cuts[index];
          const result = response.step5.evaluation || evaluateSentence(response.step5.text, cut);
          return `
            <div class="summary-item">
              <strong>컷 ${index + 1} · ${getSentenceLabel(result)}</strong>
              <p>내 문장: ${response.step5.text.trim() ? escapeHtml(response.step5.text.trim()) : '아직 쓰지 않았습니다.'}</p>
              <p>모범 문장: ${escapeHtml(cut.sentence)}</p>
              <div class="actions">
                <button type="button" class="ghost-btn" data-action="review-cut" data-cut-index="${index}">이 컷 다시 하기</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="actions">
        <button type="button" class="nav-btn" data-action="restart">처음부터 다시 하기</button>
      </div>
    </section>
  `;
}

function renderActivity() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const progressDescription = IS_TEACHER
    ? `교사용 바로가기입니다. 현재 ${state.currentStep + 1}단계에서 컷 ${state.currentCut + 1} / ${cuts.length}을 보고 있으며, 아래 단계와 컷을 모두 바로 열 수 있습니다.`
    : `현재 컷 ${state.currentCut + 1} / ${cuts.length}을 ${STEP_LABELS[state.currentStep]} 단계에서 연습하고 있습니다. 모든 컷이 끝나면 다음 단계로 넘어갑니다.`;
  return `
    <div class="activity-layout">
      <div class="activity-secondary">
        <div class="progress-card">
          <div class="progress-top">
            <div>
              <div class="eyebrow">${state.currentStep + 1}단계 / ${STEP_LABELS.length}단계</div>
              <h2 class="progress-title">${STEP_LABELS[state.currentStep]}</h2>
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
          ${renderStepPanel(cut, response)}
        </div>
      </div>
    </div>
    ${renderFloatingPreview(cut)}
  `;
}

function renderApp() {
  const mainView = state.view === 'summary' ? renderSummary() : renderActivity();
  app.innerHTML = `${mainView}${state.passageOpen ? renderPassageModal() : ''}`;
  setupFloatingPreview();
  refreshLiveButtons();
  markAttentionTargets();
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

function scrollRangeIntoView(startElement, endElement) {
  if (!startElement || !endElement) return;
  const isDesktop = window.matchMedia('(min-width: 961px)').matches;
  const topPadding = isDesktop ? 20 : 92;
  const bottomPadding = 28;
  const startRect = startElement.getBoundingClientRect();
  const endRect = endElement.getBoundingClientRect();
  const rangeTop = Math.min(startRect.top, endRect.top);
  const rangeBottom = Math.max(startRect.bottom, endRect.bottom);
  const viewportBottom = window.innerHeight - bottomPadding;

  if (!isDesktop && rangeTop >= topPadding && rangeBottom <= viewportBottom) return;
  if (isDesktop && rangeTop <= topPadding && rangeBottom <= viewportBottom) return;

  window.scrollTo({
    top: Math.max(window.scrollY + rangeTop - topPadding, 0),
    behavior: isDesktop ? 'auto' : 'smooth'
  });
}

function scheduleRangeScroll(getElements) {
  if (state.view !== 'activity' || typeof window.requestAnimationFrame !== 'function') return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const { startElement, endElement } = getElements();
      scrollRangeIntoView(startElement, endElement);
    });
  });
}

function scheduleStep1SelectionScroll() {
  if (state.currentStep !== 0) return;
  scheduleRangeScroll(() => ({
    startElement: app.querySelector('[data-step1-choice-list]'),
    endElement: app.querySelector('[data-action="check-step1"]')
  }));
}

function scheduleCheckActionToNextScroll(checkAction) {
  scheduleRangeScroll(() => ({
    startElement: app.querySelector(`[data-action="${checkAction}"]`),
    endElement: app.querySelector('[data-action="next"]')
  }));
}

function clearAttentionWaves() {
  app.querySelectorAll('[data-attention-wave="true"]').forEach((element) => {
    element.classList.remove('attention-wave');
    element.removeAttribute('data-attention-wave');
  });
}

function setAttentionWave(elements) {
  [...elements].forEach((element) => {
    if (!element || element.disabled) return;
    element.classList.add('attention-wave');
    element.setAttribute('data-attention-wave', 'true');
  });
}

function markAttentionTargets() {
  clearAttentionWaves();
  if (state.view !== 'activity' || state.passageOpen) return;

  const response = getCurrentResponse();
  const stepResponse = getStepResponse(response, state.currentStep);
  const floatingPreview = app.querySelector('[data-floating-preview]');

  if (stepResponse.checked) {
    setAttentionWave([app.querySelector('[data-action="next"]'), floatingPreview]);
    return;
  }

  if (state.currentStep === 0) {
    if (response.step1.selected === null) {
      setAttentionWave([app.querySelector('[data-step1-choice-list]')]);
    } else {
      setAttentionWave([app.querySelector('[data-action="check-step1"]')]);
    }
  } else if (state.currentStep === 1) {
    const complete = response.step2.placements.every((value) => value !== null);
    if (complete) {
      setAttentionWave([app.querySelector('[data-action="check-step2"]')]);
    } else {
      setAttentionWave([
        app.querySelector(`[data-action="activate-slot"][data-slot="${state.activeSlot}"]`)
      ]);
      setAttentionWave(app.querySelectorAll('[data-action="use-word"]:not(:disabled)'));
    }
  } else if (state.currentStep === 2) {
    const complete = response.step3.arranged.length === getCurrentCut().orderTokens.length;
    if (complete) {
      setAttentionWave([app.querySelector('[data-action="check-step3"]')]);
    } else {
      setAttentionWave(app.querySelectorAll('[data-action="pick-order"]:not(:disabled)'));
    }
  } else if (state.currentStep === 3) {
    const complete = !response.step4.inputs.some((value) => !value.trim());
    if (complete) setAttentionWave([app.querySelector('[data-action="check-step4"]')]);
  } else if (state.currentStep === 4) {
    if (response.step5.text.trim()) setAttentionWave([app.querySelector('[data-action="check-step5"]')]);
  }

  setAttentionWave([floatingPreview]);
}

function refreshLiveButtons() {
  const step4Button = app.querySelector('[data-action="check-step4"]');
  if (step4Button && state.view === 'activity' && state.currentStep === 3) {
    step4Button.disabled = getCurrentResponse().step4.inputs.some((value) => !value.trim());
  }

  const step5Button = app.querySelector('[data-action="check-step5"]');
  if (step5Button && state.view === 'activity' && state.currentStep === 4) {
    step5Button.disabled = !getCurrentResponse().step5.text.trim();
  }
}

function setStepUnchecked(stepData) {
  stepData.checked = false;
  if ('correct' in stepData) stepData.correct = false;
}

function selectChoice(optionId) {
  const response = getCurrentResponse();
  response.step1.selected = Number(optionId);
  setStepUnchecked(response.step1);
}

function checkStep1() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const selected = findById(response.step1.optionOrder, response.step1.selected);
  response.step1.checked = true;
  response.step1.correct = Boolean(selected && selected.label === cut.sentence);
}

function activateSlot(slotIndex) {
  const response = getCurrentResponse();
  const numericIndex = Number(slotIndex);
  if (response.step2.placements[numericIndex] !== null) {
    response.step2.placements[numericIndex] = null;
  }
  state.activeSlot = numericIndex;
  setStepUnchecked(response.step2);
}

function placeChoice(choiceId) {
  const response = getCurrentResponse();
  const numericId = Number(choiceId);
  if (response.step2.placements.includes(numericId)) return;
  let targetSlot = state.activeSlot;
  if (response.step2.placements[targetSlot] !== null) {
    targetSlot = response.step2.placements.findIndex((value) => value === null);
  }
  if (targetSlot === -1) return;
  response.step2.placements[targetSlot] = numericId;
  state.activeSlot = Math.min(targetSlot + 1, response.step2.placements.length - 1);
  setStepUnchecked(response.step2);
}

function resetStep2() {
  const response = getCurrentResponse();
  response.step2.placements = Array(getCurrentCut().dropAnswers.length).fill(null);
  state.activeSlot = 0;
  setStepUnchecked(response.step2);
}

function checkStep2() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.step2.checked = true;
  response.step2.correct = response.step2.placements.every((choiceId, index) => {
    const choice = findById(response.step2.choiceOrder, choiceId);
    return choice && normalizeText(choice.label) === normalizeText(cut.dropAnswers[index]);
  });
}

function pickOrder(orderId) {
  const response = getCurrentResponse();
  const numericId = Number(orderId);
  if (response.step3.arranged.includes(numericId)) return;
  response.step3.arranged.push(numericId);
  setStepUnchecked(response.step3);
}

function removeOrder(orderId) {
  const response = getCurrentResponse();
  response.step3.arranged = response.step3.arranged.filter((id) => id !== Number(orderId));
  setStepUnchecked(response.step3);
}

function resetStep3() {
  const response = getCurrentResponse();
  response.step3.arranged = [];
  setStepUnchecked(response.step3);
}

function checkStep3() {
  const response = getCurrentResponse();
  response.step3.checked = true;
  response.step3.correct = response.step3.arranged.length === getCurrentCut().orderTokens.length &&
    response.step3.arranged.every((id, index) => id === index);
}

function updateFillInput(index, value) {
  const response = getCurrentResponse();
  response.step4.inputs[Number(index)] = value;
  response.step4.checked = false;
  response.step4.correct = false;
  response.step4.correctCount = 0;
}

function checkStep4() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const correctCount = cut.fillBlanks.filter((blank, index) => matchesAnswer(response.step4.inputs[index], blank.answers)).length;
  response.step4.checked = true;
  response.step4.correctCount = correctCount;
  response.step4.correct = correctCount === cut.fillBlanks.length;
}

function updateFullText(value) {
  const response = getCurrentResponse();
  response.step5.text = value;
  response.step5.checked = false;
  response.step5.evaluation = null;
}

function checkStep5() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.step5.checked = true;
  response.step5.evaluation = evaluateSentence(response.step5.text, cut);
}

function goPrev() {
  if (state.view === 'summary') {
    state.view = 'activity';
    state.currentCut = cuts.length - 1;
    state.currentStep = STEP_LABELS.length - 1;
    return;
  }
  if (state.currentCut > 0) {
    state.currentCut -= 1;
    return;
  }
  if (state.currentStep > 0) {
    state.currentStep -= 1;
    state.currentCut = cuts.length - 1;
    state.activeSlot = 0;
  }
}

function goNext() {
  if (!canGoNext()) return false;
  if (state.currentCut < cuts.length - 1) {
    state.currentCut += 1;
    state.activeSlot = 0;
    return true;
  }
  if (state.currentStep < STEP_LABELS.length - 1) {
    state.currentStep += 1;
    state.currentCut = 0;
    state.activeSlot = 0;
    return true;
  }
  state.view = 'summary';
  return false;
}

function restartAll() {
  localStorage.removeItem(LS_KEY);
  state = buildInitialState();
}

function jumpToStep(stepIndex) {
  state.view = 'activity';
  state.currentStep = Number(stepIndex);
  state.activeSlot = 0;
}

function jumpToCut(cutIndex) {
  state.view = 'activity';
  state.currentCut = Number(cutIndex);
  state.activeSlot = 0;
}

function showAnswer() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();

  if (state.currentStep === 0) {
    const correctOption = response.step1.optionOrder.find((option) => option.label === cut.sentence);
    if (correctOption) response.step1.selected = correctOption.id;
    checkStep1();
  } else if (state.currentStep === 1) {
    response.step2.placements = cut.dropAnswers.map((answer) => {
      const match = response.step2.choiceOrder.find((choice) => normalizeText(choice.label) === normalizeText(answer));
      return match ? match.id : null;
    });
    checkStep2();
  } else if (state.currentStep === 2) {
    response.step3.arranged = cut.orderTokens.map((_, index) => index);
    checkStep3();
  } else if (state.currentStep === 3) {
    response.step4.inputs = cut.fillBlanks.map((blank) => blank.answers[0]);
    checkStep4();
  } else if (state.currentStep === 4) {
    response.step5.text = cut.sentence;
    checkStep5();
  }
}

function reviewCut(index) {
  state.view = 'activity';
  state.currentCut = Number(index);
  state.currentStep = 0;
  state.activeSlot = 0;
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
  let shouldScrollStep1Selection = false;
  let checkActionToScroll = '';

  if (action === 'select-choice') {
    selectChoice(target.dataset.optionId);
    shouldScrollStep1Selection = true;
  } else if (action === 'check-step1') {
    checkStep1();
    checkActionToScroll = action;
  } else if (action === 'activate-slot') {
    activateSlot(target.dataset.slot);
  } else if (action === 'use-word') {
    placeChoice(target.dataset.choiceId);
  } else if (action === 'check-step2') {
    checkStep2();
    checkActionToScroll = action;
  } else if (action === 'reset-step2') {
    resetStep2();
  } else if (action === 'pick-order') {
    pickOrder(target.dataset.orderId);
  } else if (action === 'remove-order') {
    removeOrder(target.dataset.orderId);
  } else if (action === 'check-step3') {
    checkStep3();
    checkActionToScroll = action;
  } else if (action === 'reset-step3') {
    resetStep3();
  } else if (action === 'check-step4') {
    checkStep4();
    checkActionToScroll = action;
  } else if (action === 'check-step5') {
    checkStep5();
    checkActionToScroll = action;
  } else if (action === 'prev') {
    goPrev();
  } else if (action === 'next') {
    shouldScrollToImagePanel = goNext();
  } else if (action === 'restart') {
    restartAll();
  } else if (action === 'review-cut') {
    reviewCut(target.dataset.cutIndex);
  } else if (action === 'jump-to-step') {
    jumpToStep(target.dataset.stepIndex);
  } else if (action === 'jump-to-cut') {
    jumpToCut(target.dataset.cutIndex);
    shouldScrollToImagePanel = true;
  } else if (action === 'show-answer') {
    showAnswer();
    checkActionToScroll = `check-step${state.currentStep + 1}`;
  } else if (action === 'scroll-to-image') {
    scrollToImagePanel();
    shouldRender = false;
  } else if (action === 'open-passage') {
    openPassage();
  } else if (action === 'close-passage') {
    closePassage();
  } else {
    shouldRender = false;
  }

  if (shouldRender) {
    renderApp();
    if (shouldScrollStep1Selection) scheduleStep1SelectionScroll();
    if (checkActionToScroll) scheduleCheckActionToNextScroll(checkActionToScroll);
    if (shouldScrollToImagePanel) scheduleImagePanelScroll();
  }
});

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.action === 'fill-input') {
    updateFillInput(target.dataset.fillIndex, target.value);
  }
  if (target.dataset.action === 'full-text') {
    updateFullText(target.value);
  }
  refreshLiveButtons();
  markAttentionTargets();
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

renderApp();

