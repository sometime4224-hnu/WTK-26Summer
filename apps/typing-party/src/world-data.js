export const WORLD_STEP = 5;

export const WORLD_SPAWN = {
  x: 50,
  y: 78
};

export const WORLD_AVATARS = [
  { id: "sky", label: "하늘", initial: "ㄱ", color: "#2563eb", soft: "#dbeafe" },
  { id: "mint", label: "민트", initial: "ㄴ", color: "#0f766e", soft: "#ccfbf1" },
  { id: "sun", label: "햇빛", initial: "ㄷ", color: "#b45309", soft: "#fffbeb" },
  { id: "rose", label: "장미", initial: "ㄹ", color: "#be123c", soft: "#fff1f2" },
  { id: "leaf", label: "잎새", initial: "ㅁ", color: "#047857", soft: "#ecfdf5" },
  { id: "slate", label: "먹색", initial: "ㅂ", color: "#475569", soft: "#f1f5f9" }
];

export const WORLD_STATIONS = [
  {
    id: "keyboard-plaza",
    label: "자판 광장",
    shortLabel: "자판",
    x: 18,
    y: 64,
    goal: "한글 자판",
    type: "typing",
    prompt: "한글 자판을 떠올리며 아래 칸에 '가나다'를 입력하세요.",
    answer: "가나다",
    successDetail: "가나다 입력 완료"
  },
  {
    id: "copy-lab",
    label: "복사 연구소",
    shortLabel: "복사",
    x: 42,
    y: 35,
    goal: "Ctrl+C",
    type: "hotkey",
    hotkey: "Ctrl+C",
    key: "c",
    prompt: "연구소의 문장 조각을 복사하는 느낌으로 Ctrl+C를 눌러 보세요.",
    taskText: "비밀 문장 조각: 키보드 캠퍼스",
    successDetail: "Ctrl+C 복사 완료"
  },
  {
    id: "paste-station",
    label: "붙여넣기 정류장",
    shortLabel: "붙여넣기",
    x: 63,
    y: 36,
    goal: "Ctrl+V",
    type: "hotkey",
    hotkey: "Ctrl+V",
    key: "v",
    prompt: "도착 안내판을 켜는 느낌으로 Ctrl+V를 눌러 보세요.",
    taskText: "정류장 안내판 대기 중",
    successDetail: "Ctrl+V 붙여넣기 완료"
  },
  {
    id: "select-stage",
    label: "전체선택 무대",
    shortLabel: "전체선택",
    x: 31,
    y: 22,
    goal: "Ctrl+A",
    type: "hotkey",
    hotkey: "Ctrl+A",
    key: "a",
    prompt: "무대 조명을 한 번에 켜듯 Ctrl+A를 눌러 보세요.",
    taskText: "무대 조명 전체 선택",
    successDetail: "Ctrl+A 전체선택 완료"
  },
  {
    id: "undo-room",
    label: "되돌리기 시간실",
    shortLabel: "되돌리기",
    x: 77,
    y: 23,
    goal: "Ctrl+Z",
    type: "hotkey",
    hotkey: "Ctrl+Z",
    key: "z",
    prompt: "실수한 장면을 되돌리는 느낌으로 Ctrl+Z를 눌러 보세요.",
    taskText: "시간 장치 대기 중",
    successDetail: "Ctrl+Z 되돌리기 완료"
  },
  {
    id: "free-plaza",
    label: "자유 광장",
    shortLabel: "놀이",
    x: 78,
    y: 68,
    goal: "상호작용",
    type: "social",
    prompt: "친구에게 안전 이모트나 응원을 보내며 잠깐 쉬어 가세요.",
    taskText: "인사, 박수, 응원, 하이파이브를 보내 보세요.",
    successDetail: "자유 광장 참여"
  }
];

export const WORLD_EMOTES = [
  { id: "hello", label: "인사" },
  { id: "clap", label: "박수" },
  { id: "cheer", label: "응원" },
  { id: "highfive", label: "하이파이브" }
];

export function getWorldAvatar(avatarId) {
  return WORLD_AVATARS.find((avatar) => avatar.id === avatarId) || WORLD_AVATARS[0];
}

export function getWorldStation(stationId) {
  return WORLD_STATIONS.find((station) => station.id === stationId) || WORLD_STATIONS[0];
}

export function createWorldState(previous = {}) {
  return {
    activeStationId: previous.activeStationId || WORLD_STATIONS[0].id,
    movementLocked: Boolean(previous.movementLocked),
    gatherSeq: Number(previous.gatherSeq || 0),
    stationSeq: Number(previous.stationSeq || 0) + 1,
    gatherAt: previous.gatherAt || { ...WORLD_SPAWN },
    teacherMessage: "키보드 캠퍼스에 오신 것을 환영합니다.",
    updatedAt: Date.now()
  };
}
