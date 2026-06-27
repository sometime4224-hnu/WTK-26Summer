export const ROOM_LIMIT = 60;
export const ANSWER_LIMIT = 120;
export const NICKNAME_LIMIT = 12;
export const ROUND_SECONDS = 90;

export const STAGES = {
  lobby: "대기실",
  world: "키보드 캠퍼스",
  activity: "개인 활동",
  groupGame: "그룹 게임",
  prompt: "미션 공개",
  submit: "입력 중",
  vote: "투표",
  results: "결과"
};

export const GAME_TYPES = {
  randomBox: {
    id: "randomBox",
    label: "랜덤박스 문장 배틀",
    shortLabel: "랜덤박스"
  },
  escapeMission: {
    id: "escapeMission",
    label: "타이핑 탈출 미션",
    shortLabel: "탈출 미션"
  },
  typingCatchmind: {
    id: "typingCatchmind",
    label: "타이핑 캐치마인드",
    shortLabel: "캐치마인드"
  },
  typingGarticPhone: {
    id: "typingGarticPhone",
    label: "타이핑 갈틱폰",
    shortLabel: "갈틱폰"
  }
};

export const VOTE_CATEGORIES = [
  { id: "funny", label: "가장 웃김" },
  { id: "clever", label: "가장 기발함" },
  { id: "chaos", label: "가장 황당함" }
];

export const TRACKED_ACTIVITIES = [
  {
    id: "keyboard-lesson",
    label: "한글 자판 25분 수업",
    lesson: "keyboard",
    kind: "activity",
    path: "activities/korean-keyboard-practice-lesson/index.html",
    summary: "자판 확인, 홈키, 자모, 음절, 단어 리듬 입력"
  },
  {
    id: "keyboard-practice",
    label: "한글 자판 연습",
    lesson: "keyboard",
    kind: "activity",
    path: "activities/korean-keyboard-practice/index.html",
    summary: "자리 찾기, 음절 입력, 단어 입력"
  },
  {
    id: "c12-writing",
    label: "12과 표현 타이핑 연습",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-keyboard-builder.html",
    summary: "핵심 어휘, 확장 표현, 문법 문장, 회상 입력"
  },
  {
    id: "c12-grammar3-typing",
    label: "12과 문법3 활용형·문장 완성",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/grammar3-form-typing.html",
    summary: "모양이다 활용형 선택 후 말 조각으로 문장 완성"
  },
  {
    id: "c12-grammar4-typing",
    label: "12과 문법4 활용형·문장 완성",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/grammar4-form-typing.html",
    summary: "-아야/어야 활용형 선택 후 말 조각으로 조건 문장 완성"
  },
  {
    id: "c12-expression-learning",
    label: "12과 쓰기 주제 표현 학습",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-expression-learning.html",
    summary: "공감, 방법, 효과, 권유 표현 입력"
  },
  {
    id: "c12-expression-assembly",
    label: "12과 쓰기 표현 조립 연습",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-expression-assembly.html",
    summary: "표현 칩 조립과 짧은 답글 문단 작성"
  },
  {
    id: "c12-motion-typing",
    label: "12과 동작 표현 타이핑 연습",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-motion-typing.html",
    summary: "생활 운동 동작 표현 입력"
  },
  {
    id: "c12-motion-typing-game",
    label: "12과 어휘 표현 애니메이션 타이핑",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-motion-typing-game.html",
    summary: "건강 어휘와 생활 동작 표현 애니메이션 입력"
  },
  {
    id: "c12-writing-shower",
    label: "12과 단어 소나기",
    lesson: "12",
    kind: "activity",
    path: "activities/c12/writing-shower.html",
    summary: "10~12과 어휘와 표현을 치는 낙하 타이핑 게임"
  },
  {
    id: "c12-vocabulary-cards",
    label: "12과 어휘 카드",
    lesson: "12",
    kind: "resource",
    path: "../../c12/vocabulary.html",
    summary: "몸 상태와 운동 어휘 카드 자료"
  },
  {
    id: "c12-body-motion-reference",
    label: "12과 몸 상태·동작 자료",
    lesson: "12",
    kind: "resource",
    path: "../../c12/vocabulary-body-motion.html",
    summary: "몸 상태와 동작 표현 시각 자료"
  },
  {
    id: "c12-grammar1-visual",
    label: "12과 문법 1 자료",
    lesson: "12",
    kind: "resource",
    path: "../../c12/grammar1.html",
    summary: "V-았/었더니 시각 자료"
  },
  {
    id: "c12-grammar2-visual",
    label: "12과 문법 2 자료",
    lesson: "12",
    kind: "resource",
    path: "../../c12/grammar2.html",
    summary: "얼마나 -(으)ㄴ/는지 모르다 시각 자료"
  }
];

const RANDOM_BOX_PROMPTS = [
  {
    title: "급식실에서 생긴 일",
    keywords: ["양말", "교장실", "초콜릿"],
    instruction: "세 단어를 모두 넣어서 가장 이상한 한 문장을 만드세요."
  },
  {
    title: "비밀 작전 회의",
    keywords: ["슬리퍼", "엘리베이터", "김치"],
    instruction: "작전명처럼 들리는 웃긴 문장을 입력하세요."
  },
  {
    title: "오늘의 이상한 뉴스",
    keywords: ["우산", "노래방", "로봇"],
    instruction: "뉴스 자막처럼 짧고 강하게 쓰세요."
  },
  {
    title: "친구가 갑자기 변했다",
    keywords: ["가방", "떡볶이", "비밀번호"],
    instruction: "친구에게 무슨 일이 생겼는지 한 문장으로 쓰세요."
  }
];

const ESCAPE_PROMPTS = [
  {
    title: "교실 문이 잠겼다",
    situation: "쉬는 시간에 교실 문이 잠겼고, 칠판에는 이상한 힌트만 남아 있습니다.",
    requiredWord: "슬리퍼",
    condition: "10글자 이상",
    instruction: "반드시 필수 단어를 넣어 탈출 방법을 쓰세요."
  },
  {
    title: "편의점 냉장고 미션",
    situation: "편의점 냉장고 문을 열었더니 작은 탈출 버튼이 안쪽에서 반짝입니다.",
    requiredWord: "삼각김밥",
    condition: "한 가지 도구 사용",
    instruction: "도구 하나를 골라 탈출 방법을 쓰세요."
  },
  {
    title: "지하철 안내 방송 오류",
    situation: "안내 방송이 계속 같은 문장만 반복하고, 다음 역 이름이 사라졌습니다.",
    requiredWord: "이어폰",
    condition: "친구 한 명 등장",
    instruction: "친구와 함께 탈출하는 방법을 쓰세요."
  },
  {
    title: "도서관 비밀 서가",
    situation: "책 한 권을 뽑자 바닥이 조용히 내려가고 비밀 서가가 나타났습니다.",
    requiredWord: "라면",
    condition: "조용한 방법",
    instruction: "소리를 내지 않고 빠져나가는 방법을 쓰세요."
  }
];

export function createPrompt(gameType, index) {
  const source = gameType === "escapeMission" ? ESCAPE_PROMPTS : RANDOM_BOX_PROMPTS;
  const prompt = source[index % source.length];
  return {
    ...prompt,
    gameType,
    seedIndex: index
  };
}

export function getGameLabel(gameType) {
  return GAME_TYPES[gameType]?.label || GAME_TYPES.randomBox.label;
}

export function getShortGameLabel(gameType) {
  return GAME_TYPES[gameType]?.shortLabel || GAME_TYPES.randomBox.shortLabel;
}

export function getTrackedActivity(activityId) {
  return TRACKED_ACTIVITIES.find((activity) => activity.id === activityId) || null;
}
