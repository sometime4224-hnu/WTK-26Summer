export const GROUP_GAME_MAX_SIZE = 6;
export const CATCHMIND_SECONDS = 120;

export const DRAWING_COLORS = ["#172033", "#2563eb", "#0f766e", "#b45309", "#be123c"];
export const DRAWING_SIZES = [4, 8, 13];

export const PARTY_WORD_POOL = [
  { id: "c10-confess", lesson: "10과", answer: "고백하다", aliases: ["고백"], clue: "좋아하는 마음을 말로 전하기", difficulty: "easy", drawable: true },
  { id: "c10-heart", lesson: "10과", answer: "가슴이 두근거리다", aliases: ["두근거리다", "심장이 두근거리다"], clue: "좋아하거나 긴장해서 심장이 빨리 뛰는 모습", difficulty: "easy", drawable: true },
  { id: "c10-hands", lesson: "10과", answer: "손을 잡다", aliases: ["손잡다"], clue: "두 사람이 손을 마주 잡는 행동", difficulty: "easy", drawable: true },
  { id: "c10-propose", lesson: "10과", answer: "청혼하다", aliases: ["프로포즈하다", "결혼하자고 말하다"], clue: "결혼하자고 말하는 장면", difficulty: "medium", drawable: true },
  { id: "c10-wedding", lesson: "10과", answer: "예식장", aliases: ["결혼식장"], clue: "결혼식을 하는 장소", difficulty: "easy", drawable: true },
  { id: "c10-invitation", lesson: "10과", answer: "청첩장", aliases: ["초대장"], clue: "결혼식에 초대하는 카드", difficulty: "medium", drawable: true },
  { id: "c11-parttime", lesson: "11과", answer: "아르바이트", aliases: ["알바"], clue: "정해진 시간 동안 임시로 하는 일", difficulty: "easy", drawable: true },
  { id: "c11-work-time", lesson: "11과", answer: "근무 시간", aliases: ["일하는 시간"], clue: "일을 하는 정해진 시간", difficulty: "medium", drawable: true },
  { id: "c11-salary", lesson: "11과", answer: "시급", aliases: ["시간당 돈", "시간급"], clue: "한 시간 일하고 받는 돈", difficulty: "medium", drawable: true },
  { id: "c11-resume", lesson: "11과", answer: "이력서", aliases: ["지원서"], clue: "일을 구할 때 쓰는 서류", difficulty: "easy", drawable: true },
  { id: "c11-boss", lesson: "11과", answer: "사장님", aliases: ["사장"], clue: "가게나 회사의 대표", difficulty: "easy", drawable: true },
  { id: "c11-colleague", lesson: "11과", answer: "동료", aliases: ["직장 동료"], clue: "같이 일하는 사람", difficulty: "easy", drawable: true },
  { id: "c12-water", lesson: "12과", answer: "물을 많이 마시다", aliases: ["물 마시다", "물 많이 마시다"], clue: "건강을 위해 자주 하는 습관", difficulty: "easy", drawable: true },
  { id: "c12-stretch", lesson: "12과", answer: "스트레칭을 하다", aliases: ["스트레칭하다", "몸을 풀다"], clue: "몸을 쭉쭉 늘이는 운동", difficulty: "easy", drawable: true },
  { id: "c12-walk", lesson: "12과", answer: "가까운 거리는 걸어가다", aliases: ["걸어가다", "걷다"], clue: "짧은 거리를 운동처럼 이동하기", difficulty: "easy", drawable: true },
  { id: "c12-sleep", lesson: "12과", answer: "충분히 잠을 자다", aliases: ["잠을 충분히 자다", "잠자다"], clue: "건강을 위해 밤에 푹 쉬기", difficulty: "easy", drawable: true },
  { id: "c12-jump", lesson: "12과", answer: "제자리 뛰기를 하다", aliases: ["제자리 뛰기", "뛰다"], clue: "한 자리에서 통통 뛰는 운동", difficulty: "easy", drawable: true },
  { id: "c12-sweat", lesson: "12과", answer: "땀이 나다", aliases: ["땀나다"], clue: "운동하면 몸에서 물방울이 나는 상태", difficulty: "easy", drawable: true },
  { id: "daily-umbrella", lesson: "일상", answer: "우산", aliases: [], clue: "비가 올 때 쓰는 물건", difficulty: "easy", drawable: true },
  { id: "daily-ramyeon", lesson: "일상", answer: "라면", aliases: ["라면 먹기"], clue: "냄비나 컵에 끓여 먹는 음식", difficulty: "easy", drawable: true },
  { id: "daily-bus", lesson: "일상", answer: "버스", aliases: [], clue: "여러 사람이 타는 큰 차", difficulty: "easy", drawable: true },
  { id: "daily-library", lesson: "일상", answer: "도서관", aliases: ["책방"], clue: "조용히 책을 읽는 장소", difficulty: "easy", drawable: true },
  { id: "daily-backpack", lesson: "일상", answer: "가방", aliases: ["책가방"], clue: "책이나 물건을 넣고 메는 것", difficulty: "easy", drawable: true },
  { id: "daily-kimbap", lesson: "일상", answer: "김밥", aliases: [], clue: "김에 밥과 재료를 넣고 만 음식", difficulty: "easy", drawable: true }
];

export function normalizeGuess(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.,!?~'"“”‘’]/g, "");
}

export function getPartyWord(wordId) {
  return PARTY_WORD_POOL.find((item) => item.id === wordId) || PARTY_WORD_POOL[0];
}

export function getPartyWordByIndex(index) {
  return PARTY_WORD_POOL[Math.abs(Number(index) || 0) % PARTY_WORD_POOL.length];
}

export function isCorrectGuess(value, word) {
  const normalized = normalizeGuess(value);
  const accepted = [word?.answer, ...(word?.aliases || [])].map(normalizeGuess).filter(Boolean);
  return accepted.includes(normalized);
}
