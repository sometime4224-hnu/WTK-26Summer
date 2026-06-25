export const ROOM_LIMIT = 60;
export const ANSWER_LIMIT = 120;
export const NICKNAME_LIMIT = 12;
export const ROUND_SECONDS = 90;

export const STAGES = {
  lobby: "대기실",
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
  }
};

export const VOTE_CATEGORIES = [
  { id: "funny", label: "가장 웃김" },
  { id: "clever", label: "가장 기발함" },
  { id: "chaos", label: "가장 황당함" }
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
