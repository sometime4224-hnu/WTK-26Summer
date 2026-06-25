const STORAGE_KEY = "typingParty.mock.rooms.v1";
const ROOM_CODE = "DEMO25";
const HOST_UID = "demo_host";

const STUDENTS = [
  ["demo_s01", "지아"],
  ["demo_s02", "민수"],
  ["demo_s03", "수빈"],
  ["demo_s04", "하준"],
  ["demo_s05", "지우"],
  ["demo_s06", "도윤"],
  ["demo_s07", "서연"],
  ["demo_s08", "가온"],
  ["demo_s09", "나래"],
  ["demo_s10", "다온"],
  ["demo_s11", "유준"],
  ["demo_s12", "하린"]
];

const frames = {
  host: document.getElementById("hostFrame"),
  a: document.getElementById("studentFrameA"),
  b: document.getElementById("studentFrameB"),
  c: document.getElementById("studentFrameC")
};

function now() {
  return Date.now();
}

function readRooms() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function writeRooms(rooms) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  window.dispatchEvent(new CustomEvent("typing-party-mock-change"));
}

function player(uid, nickname, role, joinedAt) {
  return {
    uid,
    nickname,
    role,
    active: true,
    joinedAt
  };
}

function createDemoRoom() {
  const createdAt = now();
  const players = {
    [HOST_UID]: player(HOST_UID, "선생님", "host", createdAt)
  };
  STUDENTS.forEach(([uid, nickname], index) => {
    players[uid] = player(uid, nickname, "student", createdAt + index + 1);
  });

  return {
    meta: {
      roomCode: ROOM_CODE,
      hostUid: HOST_UID,
      status: "lobby",
      gameType: "randomBox",
      currentActivityId: "",
      currentActivityRunId: "",
      currentGroupSessionId: "",
      groupGameType: "",
      groupRoundIndex: 0,
      currentRoundId: "",
      roundIndex: 0,
      limitSeconds: 90,
      roomLimit: 60,
      createdAt,
      expiresAt: createdAt + 1000 * 60 * 60 * 8,
      phaseStartedAt: createdAt
    },
    players,
    rounds: {},
    submissions: {},
    votes: {},
    progress: {},
    groups: {},
    groupSessions: {},
    drawings: {},
    groupGuesses: {},
    groupProgress: {},
    groupPhone: {}
  };
}

function seedDemoRoom() {
  const rooms = readRooms();
  rooms[ROOM_CODE] = createDemoRoom();
  writeRooms(rooms);
}

function appUrl(uid, nickname = "") {
  const url = new URL("index.html", window.location.href);
  url.searchParams.set("mock", "1");
  url.searchParams.set("room", ROOM_CODE);
  url.searchParams.set("uid", uid);
  if (nickname) {
    url.searchParams.set("nickname", nickname);
    url.searchParams.set("autojoin", "1");
  }
  return url.href;
}

function setFrames() {
  frames.host.src = appUrl(HOST_UID);
  frames.a.src = appUrl(STUDENTS[0][0], STUDENTS[0][1]);
  frames.b.src = appUrl(STUDENTS[1][0], STUDENTS[1][1]);
  frames.c.src = appUrl(STUDENTS[6][0], STUDENTS[6][1]);
}

function renderLinks() {
  const links = [
    ["교사 새 탭", appUrl(HOST_UID)],
    ["학생 지아", appUrl(STUDENTS[0][0], STUDENTS[0][1])],
    ["학생 민수", appUrl(STUDENTS[1][0], STUDENTS[1][1])],
    ["학생 서연", appUrl(STUDENTS[6][0], STUDENTS[6][1])]
  ];
  document.getElementById("demoLinks").innerHTML = links
    .map(([label, href]) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`)
    .join("");
}

function resetDemo() {
  seedDemoRoom();
  setFrames();
  renderLinks();
}

document.getElementById("resetDemoButton").addEventListener("click", resetDemo);
resetDemo();
