import {
  ANSWER_LIMIT,
  GAME_TYPES,
  NICKNAME_LIMIT,
  ROOM_LIMIT,
  ROUND_SECONDS,
  STAGES,
  TRACKED_ACTIVITIES,
  VOTE_CATEGORIES,
  createPrompt,
  getGameLabel,
  getShortGameLabel,
  getTrackedActivity
} from "./game-data.js";
import {
  CATCHMIND_SECONDS,
  DRAWING_COLORS,
  DRAWING_SIZES,
  ERASER_DEFAULT_SIZE,
  GROUP_GAME_MAX_SIZE,
  getPartyWord,
  getPartyWordByIndex,
  isCorrectGuess
} from "./group-game-data.js";
import { createFirebaseClient } from "./firebase-client.js";
import {
  WORLD_AVATARS,
  WORLD_EMOTES,
  WORLD_SPAWN,
  WORLD_STATIONS,
  WORLD_STEP,
  createWorldState,
  getWorldAvatar,
  getWorldStation
} from "./world-data.js";

const params = new URLSearchParams(window.location.search);
const useMock = params.get("mock") === "1";
const resetMock = params.get("reset") === "1";
const mockUid = params.get("uid") || "";
const TEACHER_PIN = "3b67";
const ACTIVITY_PROGRESS_CHANNEL = "typingParty.activity.progress.v1";

const state = {
  client: null,
  room: null,
  roomCode: "",
  role: "",
  nickname: "",
  selectedGame: "randomBox",
  selectedActivity: "keyboard-lesson",
  selectedWorldStation: "keyboard-plaza",
  selectedWorldAvatar: WORLD_AVATARS[0].id,
  drawingTool: "pen",
  drawingColor: DRAWING_COLORS[0],
  drawingSize: DRAWING_SIZES[0],
  activeStroke: null,
  lastDrawingPointerAt: 0,
  lastWorldSyncAt: 0,
  lastWorldGatherSeq: 0,
  activityProgressChannel: null,
  teacherUnlocked: false,
  unsubscribe: null
};

const els = {
  startScreen: document.getElementById("startScreen"),
  roomScreen: document.getElementById("roomScreen"),
  connectionChip: document.getElementById("connectionChip"),
  createRoomButton: document.getElementById("createRoomButton"),
  teacherPinForm: document.getElementById("teacherPinForm"),
  teacherPinInput: document.getElementById("teacherPinInput"),
  teacherCreateBox: document.getElementById("teacherCreateBox"),
  joinForm: document.getElementById("joinForm"),
  roomCodeInput: document.getElementById("roomCodeInput"),
  nicknameInput: document.getElementById("nicknameInput"),
  startStatus: document.getElementById("startStatus"),
  roleLabel: document.getElementById("roleLabel"),
  roomTitle: document.getElementById("roomTitle"),
  roomSubtitle: document.getElementById("roomSubtitle"),
  roomCodeDisplay: document.getElementById("roomCodeDisplay"),
  joinLink: document.getElementById("joinLink"),
  playerCount: document.getElementById("playerCount"),
  playerList: document.getElementById("playerList"),
  roundKicker: document.getElementById("roundKicker"),
  stageTitle: document.getElementById("stageTitle"),
  stageChip: document.getElementById("stageChip"),
  hostControls: document.getElementById("hostControls"),
  roomStatus: document.getElementById("roomStatus"),
  promptPanel: document.getElementById("promptPanel"),
  submitPanel: document.getElementById("submitPanel"),
  submissionsPanel: document.getElementById("submissionsPanel"),
  resultsPanel: document.getElementById("resultsPanel")
};

function now() {
  return Date.now();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeRoomCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

function normalizeNickname(value) {
  return String(value || "").trim().slice(0, NICKNAME_LIMIT);
}

function setConnection(message, kind = "") {
  els.connectionChip.textContent = message;
  els.connectionChip.classList.toggle("is-error", kind === "error");
  els.connectionChip.classList.toggle("is-ready", kind === "ready");
}

function setStartStatus(message) {
  els.startStatus.textContent = message || "";
  if (els.roomStatus) {
    els.roomStatus.textContent = message || "";
  }
}

function setEntryDisabled(disabled) {
  els.createRoomButton.disabled = disabled || !state.teacherUnlocked;
  els.joinForm.querySelector("button").disabled = disabled;
}

function setTeacherUnlocked(unlocked) {
  state.teacherUnlocked = unlocked;
  els.teacherPinForm.hidden = unlocked;
  els.teacherCreateBox.hidden = !unlocked;
  els.createRoomButton.disabled = !unlocked || !state.client;
}

function ensureClientReady() {
  if (state.client) return true;
  setStartStatus("Firebase 연결을 준비하는 중입니다. 잠시 후 다시 눌러 주세요.");
  return false;
}

function setFieldNote(message, kind = "") {
  const note = document.getElementById("answerNote");
  if (!note) return;
  note.textContent = message || "";
  note.classList.toggle("is-error", kind === "error");
  note.classList.toggle("is-good", kind === "good");
}

function playerEntries(room = state.room) {
  return Object.entries(room?.players || {}).sort(([, a], [, b]) => (a.joinedAt || 0) - (b.joinedAt || 0));
}

function currentRound(room = state.room) {
  const roundId = room?.meta?.currentRoundId;
  return roundId ? room?.rounds?.[roundId] || null : null;
}

function currentSubmissions(room = state.room, round = currentRound(room)) {
  if (!round) return [];
  const source = room?.submissions?.[round.id] || {};
  return Object.entries(source)
    .map(([uid, submission]) => ({ uid, ...submission }))
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

function currentActivity(room = state.room) {
  return getTrackedActivity(room?.meta?.currentActivityId);
}

function currentProgress(room = state.room) {
  const runId = room?.meta?.currentActivityRunId;
  return runId ? room?.progress?.[runId] || {} : {};
}

function currentWorldState(room = state.room) {
  return room?.world?.state || {};
}

function worldPlayer(uid = state.client?.uid, room = state.room) {
  return uid ? room?.world?.players?.[uid] || null : null;
}

function worldPlayerEntries(room = state.room) {
  return Object.entries(room?.world?.players || {}).sort(([, a], [, b]) => (a.enteredAt || 0) - (b.enteredAt || 0));
}

function currentWorldStation(room = state.room) {
  return getWorldStation(currentWorldState(room).activeStationId);
}

function worldProgressFor(stationId, room = state.room) {
  return room?.world?.progress?.[stationId] || {};
}

function currentGroupSession(room = state.room) {
  const sessionId = room?.meta?.currentGroupSessionId;
  return sessionId ? room?.groupSessions?.[sessionId] || null : null;
}

function groupEntries(room = state.room) {
  return Object.entries(room?.groups || {}).sort(([, a], [, b]) => (a.index || 0) - (b.index || 0));
}

function groupForPlayer(uid = state.client?.uid, room = state.room) {
  if (!uid) return null;
  return groupEntries(room).map(([, group]) => group).find((group) => (group.memberUids || []).includes(uid)) || null;
}

function sessionGroup(groupId, session = currentGroupSession()) {
  return groupId ? session?.groups?.[groupId] || null : null;
}

function groupGuessesFor(sessionId, groupId, room = state.room) {
  return room?.groupGuesses?.[sessionId]?.[groupId] || {};
}

function groupProgressFor(sessionId, groupId, room = state.room) {
  return room?.groupProgress?.[sessionId]?.[groupId] || {};
}

function groupPhoneFor(sessionId, groupId, room = state.room) {
  return room?.groupPhone?.[sessionId]?.[groupId] || {};
}

function drawingFor(sessionId, groupId, drawingId, room = state.room) {
  return room?.drawings?.[sessionId]?.[groupId]?.[drawingId] || { strokes: {} };
}

function strokesForDrawing(drawing) {
  return Object.entries(drawing?.strokes || {})
    .map(([id, stroke]) => ({ id, ...stroke }))
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

function correctGuessFor(sessionId, groupId, word, room = state.room) {
  const guesses = Object.values(groupGuessesFor(sessionId, groupId, room));
  return guesses
    .flatMap((guess) => guess.attempts || [])
    .filter((attempt) => attempt.isCorrect || isCorrectGuess(attempt.text, word))
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))[0] || null;
}

function buildJoinUrl(roomCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomCode);
  url.searchParams.delete("reset");
  if (useMock) url.searchParams.set("mock", "1");
  return url.href;
}

function replaceUrlWithRoom(roomCode) {
  const url = new URL(window.location.href);
  url.searchParams.set("room", roomCode);
  url.searchParams.delete("reset");
  if (useMock) url.searchParams.set("mock", "1");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function showStart() {
  if (state.unsubscribe) state.unsubscribe();
  state.unsubscribe = null;
  state.room = null;
  state.roomCode = "";
  state.role = "";
  const url = new URL(window.location.href);
  url.searchParams.delete("room");
  url.searchParams.delete("reset");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  els.roomScreen.hidden = true;
  els.startScreen.hidden = false;
}

function showRoom() {
  els.startScreen.hidden = true;
  els.roomScreen.hidden = false;
}

function createPlayer(nickname, role) {
  return {
    uid: state.client.uid,
    nickname,
    role,
    active: true,
    joinedAt: now()
  };
}

async function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let code = "";
    for (let index = 0; index < 6; index += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const existing = await state.client.getRoom(code);
    if (!existing) return code;
  }
  throw new Error("방 코드를 만들지 못했습니다. 다시 시도해 주세요.");
}

async function createRoom() {
  setStartStatus("");
  if (!ensureClientReady()) return;
  if (!state.teacherUnlocked) {
    setStartStatus("교사용 PIN을 먼저 입력하세요.");
    return;
  }
  const roomCode = await generateRoomCode();
  const createdAt = now();
  const hostPlayer = createPlayer("선생님", "host");
  const room = {
    meta: {
      roomCode,
      hostUid: state.client.uid,
      status: "lobby",
      gameType: "randomBox",
      currentActivityId: "",
      currentActivityRunId: "",
      currentGroupSessionId: "",
      groupGameType: "",
      groupRoundIndex: 0,
      currentRoundId: "",
      roundIndex: 0,
      limitSeconds: ROUND_SECONDS,
      roomLimit: ROOM_LIMIT,
      createdAt,
      expiresAt: createdAt + 1000 * 60 * 60 * 8,
      phaseStartedAt: createdAt
    },
    players: {
      [state.client.uid]: hostPlayer
    },
    rounds: {},
    submissions: {},
    votes: {}
  };

  await state.client.createRoom(roomCode, room);
  state.nickname = hostPlayer.nickname;
  replaceUrlWithRoom(roomCode);
  enterRoom(roomCode, "host");
}

async function joinRoom(roomCodeValue, nicknameValue) {
  if (!ensureClientReady()) return;
  const roomCode = normalizeRoomCode(roomCodeValue);
  const nickname = normalizeNickname(nicknameValue);
  if (roomCode.length !== 6) {
    setStartStatus("방 코드는 6자리입니다.");
    return;
  }
  if (!nickname) {
    setStartStatus("닉네임을 입력하세요.");
    return;
  }

  const room = await state.client.getRoom(roomCode);
  if (!room?.meta) {
    setStartStatus("방을 찾을 수 없습니다.");
    return;
  }
  if (room.meta.expiresAt && room.meta.expiresAt < now()) {
    setStartStatus("이 방은 시간이 지나 닫혔습니다.");
    return;
  }
  if (playerEntries(room).length >= (room.meta.roomLimit || ROOM_LIMIT)) {
    setStartStatus("방 정원이 가득 찼습니다.");
    return;
  }

  const role = room.meta.hostUid === state.client.uid ? "host" : "student";
  state.nickname = role === "host" ? "선생님" : nickname;
  await state.client.setPlayer(roomCode, createPlayer(state.nickname, role));
  replaceUrlWithRoom(roomCode);
  enterRoom(roomCode, role);
}

function enterRoom(roomCode, role) {
  if (state.unsubscribe) state.unsubscribe();
  state.roomCode = roomCode;
  state.role = role;
  state.selectedWorldStation = "keyboard-plaza";
  state.lastWorldSyncAt = 0;
  state.lastWorldGatherSeq = 0;
  showRoom();
  state.unsubscribe = state.client.subscribeRoom(roomCode, (room) => {
    if (!room) {
      showStart();
      setStartStatus("방이 삭제되었습니다.");
      return;
    }
    state.room = room;
    if (room.meta?.hostUid === state.client.uid) state.role = "host";
    renderRoom();
  });
}

function renderPlayers() {
  const players = playerEntries();
  els.playerCount.textContent = String(players.length);
  els.playerList.innerHTML = players.length
    ? players
        .map(([, player]) => {
          const role = player.role === "host" ? "진행" : "참가";
          return `
            <div class="player-chip">
              <span>${escapeHtml(player.nickname)}</span>
              <b>${role}</b>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-note">아직 참가자가 없습니다.</div>`;
}

function renderHostControls(stage, round) {
  if (state.role !== "host") {
    els.hostControls.hidden = true;
    els.hostControls.innerHTML = "";
    return;
  }

  els.hostControls.hidden = false;
  const submittedCount = currentSubmissions().length;
  const studentCount = playerEntries().filter(([, player]) => player.role !== "host").length;
  const gameOptions = Object.values(GAME_TYPES)
    .map((game) => `<option value="${game.id}" ${state.selectedGame === game.id ? "selected" : ""}>${game.label}</option>`)
    .join("");
  const activityOptions = TRACKED_ACTIVITIES
    .map((activity) => `<option value="${activity.id}" ${state.selectedActivity === activity.id ? "selected" : ""}>${activity.label}</option>`)
    .join("");
  const worldState = currentWorldState();
  const groupSession = currentGroupSession();
  const stationOptions = WORLD_STATIONS
    .map((station) => `<option value="${station.id}" ${state.selectedWorldStation === station.id ? "selected" : ""}>${station.label} · ${station.goal}</option>`)
    .join("");

  let body = "";
  if (stage === "lobby") {
    body = `
      <button class="primary-button" type="button" data-action="start-world" data-testid="start-world">키보드 캠퍼스 월드 열기</button>
      <label>
        <span>게임 선택</span>
        <select id="gameTypeSelect" data-testid="game-select">${gameOptions}</select>
      </label>
      <button class="primary-button" type="button" data-action="start-round" data-testid="start-round">선택 게임 시작</button>
      <div class="group-quick-actions">
        <button class="secondary-button" type="button" data-action="start-catchmind" data-testid="start-catchmind">캐치마인드 시작</button>
        <button class="secondary-button" type="button" data-action="start-gartic-phone" data-testid="start-gartic-phone">갈틱폰 시작</button>
      </div>
      <label>
        <span>개인 활동 선택</span>
        <select id="activitySelect" data-testid="activity-select">${activityOptions}</select>
      </label>
      <button class="secondary-button" type="button" data-action="start-activity" data-testid="start-activity">선택 활동 띄우기</button>
    `;
  } else if (stage === "world") {
    body = `
      <label>
        <span>열 스테이션</span>
        <select id="worldStationSelect" data-testid="world-station-select">${stationOptions}</select>
      </label>
      <button class="primary-button" type="button" data-action="open-world-station" data-testid="open-world-station">스테이션 열기</button>
      <button class="secondary-button" type="button" data-action="gather-world" data-testid="gather-world">모두 모으기</button>
      <button class="secondary-button" type="button" data-action="toggle-world-lock" data-testid="world-lock-toggle">${worldState.movementLocked ? "이동 잠금 해제" : "이동 잠금"}</button>
      <button class="secondary-button" type="button" data-action="next-lobby" data-testid="close-world">활동 종료 · 대기실</button>
    `;
  } else if (stage === "activity") {
    const activity = currentActivity();
    body = `
      <p class="field-note">${escapeHtml(activity?.label || "개인 활동")} 진행 상황을 관찰하는 중입니다.</p>
      <button class="primary-button" type="button" data-action="next-lobby" data-testid="close-activity">활동 종료 · 대기실</button>
    `;
  } else if (stage === "groupGame") {
    if (groupSession?.type === "typingGarticPhone") {
      const nextLabel = groupSession.phonePhase === "reveal" ? "새 갈틱폰 시작" : "다음 단계";
      body = `
        <p class="field-note">${escapeHtml(getGameLabel(groupSession.type))} 그룹 세션이 진행 중입니다.</p>
        <button class="primary-button" type="button" data-action="advance-gartic-phone" data-testid="advance-gartic-phone">${nextLabel}</button>
        <button class="secondary-button" type="button" data-action="start-gartic-phone" data-testid="restart-gartic-phone">그룹 다시 묶기</button>
        <button class="secondary-button" type="button" data-action="next-lobby" data-testid="close-group-game">대기실로 돌아가기</button>
      `;
    } else {
      body = `
        <p class="field-note">${escapeHtml(getGameLabel(groupSession?.type || "typingCatchmind"))} 그룹 세션이 진행 중입니다.</p>
        <button class="primary-button" type="button" data-action="next-catchmind-round" data-testid="next-catchmind-round">다음 캐치마인드 라운드</button>
        <button class="secondary-button" type="button" data-action="start-catchmind" data-testid="restart-catchmind">그룹 다시 묶기</button>
        <button class="secondary-button" type="button" data-action="next-lobby" data-testid="close-group-game">대기실로 돌아가기</button>
      `;
    }
  } else if (stage === "prompt") {
    body = `
      <p class="field-note">${escapeHtml(getGameLabel(round?.gameType))} 미션이 공개되었습니다.</p>
      <button class="primary-button" type="button" data-action="open-submit" data-testid="open-submit">입력 시작</button>
    `;
  } else if (stage === "submit") {
    body = `
      <p class="field-note">제출 ${submittedCount} / ${Math.max(studentCount, 1)}</p>
      <button class="primary-button" type="button" data-action="open-vote" data-testid="open-vote">제출 공개 · 투표 시작</button>
    `;
  } else if (stage === "vote") {
    body = `
      <p class="field-note">투표가 진행 중입니다.</p>
      <button class="primary-button" type="button" data-action="show-results" data-testid="show-results">결과 발표</button>
    `;
  } else if (stage === "results") {
    body = `
      <p class="field-note">결과가 공개되었습니다.</p>
      <button class="primary-button" type="button" data-action="next-lobby" data-testid="next-lobby">다음 라운드</button>
    `;
  }

  els.hostControls.innerHTML = `
    <div class="host-action-grid">${body}</div>
    <button class="danger-button" type="button" data-action="remove-room" data-testid="remove-room">방 삭제/초기화</button>
  `;
}

function renderPrompt(stage, round) {
  if (!round) {
    els.promptPanel.innerHTML = `<div class="empty-note">교사가 라운드를 시작하면 미션이 나타납니다.</div>`;
    return;
  }

  const prompt = round.prompt || {};
  const isRandomBox = round.gameType === "randomBox";
  const pills = isRandomBox
    ? (prompt.keywords || []).map((keyword) => `<span class="keyword-pill">${escapeHtml(keyword)}</span>`).join("")
    : `
      <span class="keyword-pill">필수 단어: ${escapeHtml(prompt.requiredWord)}</span>
      <span class="condition-pill">${escapeHtml(prompt.condition)}</span>
    `;
  const text = isRandomBox ? prompt.instruction : prompt.situation;
  const detail = isRandomBox ? "키워드 3개를 모두 넣으세요." : prompt.instruction;

  els.promptPanel.innerHTML = `
    <article class="prompt-card">
      <span class="category-badge">${escapeHtml(getShortGameLabel(round.gameType))}</span>
      <strong class="prompt-title">${escapeHtml(prompt.title)}</strong>
      <p class="prompt-text">${escapeHtml(text)}</p>
      <div class="pill-row">${pills}</div>
      <p class="field-note">${escapeHtml(detail)} ${stage === "prompt" ? "곧 입력이 시작됩니다." : ""}</p>
    </article>
  `;
}

function renderSubmit(stage, round) {
  if (state.role === "host" || stage !== "submit" || !round) {
    els.submitPanel.innerHTML = "";
    return;
  }

  const previous = state.room?.submissions?.[round.id]?.[state.client.uid]?.text || "";
  els.submitPanel.innerHTML = `
    <section class="answer-card" aria-labelledby="answerTitle">
      <h2 id="answerTitle">내 답변</h2>
      <form class="answer-form" id="answerForm">
        <textarea id="answerInput" maxlength="${ANSWER_LIMIT}" placeholder="여기에 답변을 입력하세요." data-testid="answer-input">${escapeHtml(previous)}</textarea>
        <p class="field-note" id="answerNote">${previous ? "제출 완료. 투표 전까지 다시 제출할 수 있습니다." : ""}</p>
        <button class="primary-button" type="submit" data-testid="submit-answer">제출</button>
      </form>
    </section>
  `;
}

function renderSubmissions(stage, round) {
  const submissions = currentSubmissions();
  if (!round || !["vote", "results"].includes(stage)) {
    els.submissionsPanel.innerHTML = "";
    return;
  }

  const cards = submissions.length
    ? submissions
        .map((submission) => `
          <article class="submission-card" data-submission-uid="${escapeHtml(submission.uid)}">
            <div class="submission-head">
              <span class="category-badge">${escapeHtml(submission.nickname || "참가자")}</span>
              ${submission.uid === state.client.uid ? `<span class="condition-pill">내 답변</span>` : ""}
            </div>
            <p>${escapeHtml(submission.text)}</p>
            <span class="submission-meta">${escapeHtml(getShortGameLabel(submission.gameType))}</span>
          </article>
        `)
        .join("")
    : `<div class="empty-note">아직 공개할 제출이 없습니다.</div>`;

  const votePanel = stage === "vote" && state.role !== "host" ? renderVotePanel(submissions, round) : "";
  els.submissionsPanel.innerHTML = `
    <h2>제출 모음</h2>
    <div class="submission-grid">${cards}</div>
    ${votePanel}
  `;
}

function renderVotePanel(submissions, round) {
  if (!submissions.length) return "";
  return VOTE_CATEGORIES.map((category) => {
    const selectedUid = state.room?.votes?.[round.id]?.[category.id]?.[state.client.uid] || "";
    const buttons = submissions
      .map((submission) => `
        <button
          class="vote-button ${selectedUid === submission.uid ? "is-selected" : ""}"
          type="button"
          data-action="vote"
          data-category-id="${escapeHtml(category.id)}"
          data-target-uid="${escapeHtml(submission.uid)}"
        >
          ${escapeHtml(submission.nickname || "참가자")}
        </button>
      `)
      .join("");
    return `
      <section class="vote-card">
        <strong>${escapeHtml(category.label)}</strong>
        <div class="vote-row">${buttons}</div>
      </section>
    `;
  }).join("");
}

function renderResults(stage, round) {
  if (stage !== "results" || !round) {
    els.resultsPanel.innerHTML = "";
    return;
  }

  const submissions = currentSubmissions();
  const byUid = new Map(submissions.map((submission) => [submission.uid, submission]));
  const resultCards = VOTE_CATEGORIES.map((category) => {
    const votes = Object.values(state.room?.votes?.[round.id]?.[category.id] || {});
    const counts = votes.reduce((acc, uid) => {
      acc[uid] = (acc[uid] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [winnerUid, count] = sorted[0] || [];
    const winner = byUid.get(winnerUid);
    if (!winner) {
      return `
        <article class="result-card">
          <strong>${escapeHtml(category.label)}</strong>
          <p>아직 표가 없습니다.</p>
        </article>
      `;
    }
    return `
      <article class="result-card">
        <strong>${escapeHtml(category.label)} · ${escapeHtml(winner.nickname || "참가자")} · ${count}표</strong>
        <p>${escapeHtml(winner.text)}</p>
      </article>
    `;
  }).join("");

  els.resultsPanel.innerHTML = `
    <h2>결과</h2>
    <div class="results-grid">${resultCards}</div>
  `;
}

function statusLabel(status) {
  if (status === "completed") return "완료";
  if (status === "working") return "작성 중";
  if (status === "opened") return "열람";
  return "대기";
}

function formatAgo(timestamp) {
  if (!timestamp) return "-";
  const seconds = Math.max(0, Math.round((now() - timestamp) / 1000));
  if (seconds < 5) return "방금";
  if (seconds < 60) return `${seconds}초 전`;
  return `${Math.round(seconds / 60)}분 전`;
}

function buildActivityRunnerUrl(activity, runId) {
  const url = new URL("activity.html", window.location.href);
  url.searchParams.set("room", state.roomCode);
  url.searchParams.set("activity", activity.id);
  url.searchParams.set("activityRun", runId || "");
  url.searchParams.set("nickname", state.nickname || "참가자");
  if (useMock) {
    url.searchParams.set("mock", "1");
    url.searchParams.set("uid", state.client.uid);
  }
  return url.href;
}

function renderActivityPanel(activity, runId) {
  if (!activity) {
    els.promptPanel.innerHTML = `<div class="empty-note">활동을 찾을 수 없습니다.</div>`;
    return;
  }

  if (state.role === "host") {
    const progress = currentProgress();
    const students = playerEntries().filter(([, player]) => player.role !== "host");
    const rows = students.length
      ? students.map(([uid, player]) => {
        const item = progress[uid] || {};
        const total = Number(item.total || 0);
        const completed = Number(item.completed || 0);
        const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
        return `
          <tr>
            <td><strong>${escapeHtml(player.nickname)}</strong></td>
            <td><span class="progress-status progress-status--${escapeHtml(item.status || "waiting")}">${statusLabel(item.status)}</span></td>
            <td>${escapeHtml(item.stageTitle || "-")}</td>
            <td>${total > 0 ? `${completed} / ${total}` : "-"}</td>
            <td><div class="mini-meter"><span style="width: ${percent}%"></span></div></td>
            <td>${formatAgo(item.updatedAt)}</td>
          </tr>
        `;
      }).join("")
      : `<tr><td colspan="6">학생이 입장하면 진행 상태가 여기에 표시됩니다.</td></tr>`;

    els.promptPanel.innerHTML = `
      <section class="activity-monitor" data-testid="activity-monitor">
        <div class="activity-monitor__head">
          <div>
            <span class="category-badge">개인 활동</span>
            <h2>${escapeHtml(activity.label)}</h2>
            <p>${escapeHtml(activity.summary)}</p>
          </div>
          <a class="secondary-button" href="${escapeHtml(activity.path)}" target="_blank" rel="noopener">사본 열기</a>
        </div>
        <div class="progress-table-wrap">
          <table class="progress-table">
            <thead>
              <tr>
                <th>학생</th>
                <th>상태</th>
                <th>현재 화면</th>
                <th>진도</th>
                <th>막대</th>
                <th>업데이트</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>
    `;
    return;
  }

  const runnerUrl = buildActivityRunnerUrl(activity, runId);
  if (els.promptPanel.dataset.activityRunId === runId && els.promptPanel.querySelector(".activity-launch-card")) {
    return;
  }

  els.promptPanel.dataset.activityRunId = runId || "";
  els.promptPanel.innerHTML = `
    <section class="activity-student activity-launch-card" data-testid="activity-student">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">지금 할 활동</span>
          <h2>${escapeHtml(activity.label)}</h2>
          <p>${escapeHtml(activity.summary)}</p>
        </div>
        <div class="activity-launch-actions">
          <a class="primary-button activity-enter-button" href="${escapeHtml(runnerUrl)}" data-testid="activity-launch" data-enter-activity-start="1">ENTER를 눌러 시작</a>
          <a class="secondary-button" href="${escapeHtml(runnerUrl)}" target="_blank" rel="noopener" data-testid="activity-launch-new">새 탭으로 열기</a>
        </div>
      </div>
      <div class="activity-open-card">
        <span class="category-badge">Full Activity</span>
        <strong>${escapeHtml(activity.label)}</strong>
        <p>Enter 키를 누르면 기존 활동 화면이 넓은 실행 화면으로 열립니다.</p>
      </div>
    </section>
  `;
}

function clampWorldPosition(value) {
  return Math.max(4, Math.min(96, Math.round(Number(value) || 0)));
}

function renderWorldMap({ interactive = false } = {}) {
  const worldState = currentWorldState();
  const activeStationId = worldState.activeStationId || WORLD_STATIONS[0].id;
  const portals = WORLD_STATIONS.map((station) => {
    const isOpen = station.id === activeStationId;
    const actionAttrs = interactive && isOpen ? `data-action="enter-world-station"` : "";
    return `
      <button
        class="world-portal ${isOpen ? "is-open" : ""}"
        type="button"
        style="--x: ${station.x}; --y: ${station.y};"
        data-station-id="${escapeHtml(station.id)}"
        data-testid="world-portal-${escapeHtml(station.id)}"
        ${actionAttrs}
        ${interactive && isOpen ? "" : "disabled"}
      >
        <span>${escapeHtml(station.shortLabel)}</span>
        <b>${escapeHtml(station.goal)}</b>
      </button>
    `;
  }).join("");

  const avatars = worldPlayerEntries()
    .map(([uid, player]) => {
      const avatar = getWorldAvatar(player.avatarId);
      const x = clampWorldPosition(player.x || WORLD_SPAWN.x);
      const y = clampWorldPosition(player.y || WORLD_SPAWN.y);
      const bubble = player.help ? "도움 요청" : player.emote || "";
      return `
        <div
          class="world-avatar ${player.help ? "needs-help" : ""}"
          style="--x: ${x}; --y: ${y}; --avatar-color: ${avatar.color}; --avatar-soft: ${avatar.soft};"
          data-world-nickname="${escapeHtml(player.nickname || "참가자")}"
          data-testid="world-player"
        >
          ${bubble ? `<span class="world-bubble">${escapeHtml(bubble)}</span>` : ""}
          <span class="world-face">${escapeHtml(avatar.initial)}</span>
          <strong>${escapeHtml(player.nickname || "참가자")}</strong>
        </div>
      `;
    })
    .join("");

  return `
    <div class="world-map" data-testid="world-map">
      <div class="world-lane world-lane--horizontal"></div>
      <div class="world-lane world-lane--vertical"></div>
      <div class="world-map-label">Keyboard Campus</div>
      ${portals}
      ${avatars}
    </div>
  `;
}

function renderAvatarPicker() {
  const buttons = WORLD_AVATARS.map((avatar) => `
    <button
      class="avatar-choice ${state.selectedWorldAvatar === avatar.id ? "is-selected" : ""}"
      type="button"
      data-action="select-world-avatar"
      data-avatar-id="${escapeHtml(avatar.id)}"
      style="--avatar-color: ${avatar.color}; --avatar-soft: ${avatar.soft};"
    >
      <span>${escapeHtml(avatar.initial)}</span>
      <b>${escapeHtml(avatar.label)}</b>
    </button>
  `).join("");

  return `
    <section class="world-card world-avatar-picker" data-testid="world-avatar-picker">
      <span class="category-badge">아바타 선택</span>
      <h2>키보드 캠퍼스에 들어가기</h2>
      <p class="field-note">마음에 드는 색을 고르고 월드에 입장하세요.</p>
      <div class="avatar-choice-grid">${buttons}</div>
      <button class="primary-button" type="button" data-action="enter-world-avatar" data-testid="world-avatar-enter">월드 입장</button>
    </section>
  `;
}

function renderWorldTask(station, progress) {
  const isCompleted = progress.status === "completed";
  const statusText = isCompleted ? "완료" : progress.status === "working" ? "진행 중" : "대기";
  const keyboardPractice = getTrackedActivity("keyboard-practice");

  let body = "";
  if (station.type === "typing") {
    body = `
      <form class="world-task-form" id="worldTypingForm">
        <label>
          <span>입력 미션</span>
          <input id="worldTypingAnswer" autocomplete="off" placeholder="${escapeHtml(station.answer)}" ${isCompleted ? "disabled" : ""}>
        </label>
        <button class="primary-button" type="submit" data-testid="world-typing-submit" ${isCompleted ? "disabled" : ""}>확인</button>
      </form>
      ${keyboardPractice ? `<a class="secondary-button" href="${escapeHtml(keyboardPractice.path)}" target="_blank" rel="noopener">자판 연습 새 탭</a>` : ""}
    `;
  } else if (station.type === "hotkey") {
    body = `
      <div class="world-hotkey-pad" tabindex="0" data-testid="world-hotkey-pad">
        <span>${escapeHtml(station.taskText)}</span>
        <strong>${escapeHtml(station.hotkey)}</strong>
      </div>
      <p class="field-note">이 화면에서 ${escapeHtml(station.hotkey)}를 누르면 완료됩니다.</p>
    `;
  } else {
    body = `
      <p class="field-note">${escapeHtml(station.taskText)}</p>
      <button class="secondary-button" type="button" data-action="complete-world-social" data-testid="world-social-complete" ${isCompleted ? "disabled" : ""}>참여 체크</button>
    `;
  }

  return `
    <section class="world-card world-task-card" data-testid="world-active-station">
      <div class="world-card-head">
        <div>
          <span class="category-badge">${escapeHtml(station.goal)}</span>
          <h2>${escapeHtml(station.label)}</h2>
        </div>
        <span class="progress-status progress-status--${escapeHtml(progress.status || "waiting")}">${statusText}</span>
      </div>
      <p>${escapeHtml(station.prompt)}</p>
      ${body}
    </section>
  `;
}

function renderWorldStudentTools(player) {
  const emotes = WORLD_EMOTES.map((emote) => `
    <button class="secondary-button" type="button" data-action="world-emote" data-emote="${escapeHtml(emote.label)}" data-testid="world-emote-${escapeHtml(emote.id)}">${escapeHtml(emote.label)}</button>
  `).join("");

  return `
    <section class="world-card world-tools">
      <div>
        <span class="category-badge">상호작용</span>
        <h2>안전 반응 보내기</h2>
      </div>
      <div class="world-action-row">
        ${emotes}
        <button class="danger-button" type="button" data-action="toggle-world-help" data-testid="world-help">${player.help ? "도움 해결" : "도움 요청"}</button>
      </div>
      <div class="world-move-pad" aria-label="이동 패드">
        <button class="secondary-button" type="button" data-action="move-world" data-dir="up" data-testid="world-move-up">위</button>
        <button class="secondary-button" type="button" data-action="move-world" data-dir="left" data-testid="world-move-left">왼쪽</button>
        <button class="secondary-button" type="button" data-action="move-world" data-dir="down" data-testid="world-move-down">아래</button>
        <button class="secondary-button" type="button" data-action="move-world" data-dir="right" data-testid="world-move-right">오른쪽</button>
      </div>
    </section>
  `;
}

function renderWorldHostMonitor() {
  const activeStation = currentWorldStation();
  const activeProgress = worldProgressFor(activeStation.id);
  const students = playerEntries().filter(([, player]) => player.role !== "host");
  const rows = students.length
    ? students.map(([uid, player]) => {
      const world = worldPlayer(uid);
      const progress = activeProgress[uid] || {};
      const total = Number(progress.total || 0);
      const completed = Number(progress.completed || 0);
      const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      return `
        <tr>
          <td><strong>${escapeHtml(player.nickname)}</strong></td>
          <td>${world ? escapeHtml(world.status || "월드 입장") : "아바타 대기"}</td>
          <td>${world?.help ? `<span class="progress-status progress-status--working">도움 요청</span>` : "-"}</td>
          <td>${escapeHtml(progress.detail || "-")}</td>
          <td>${total > 0 ? `${completed} / ${total}` : "-"}</td>
          <td><div class="mini-meter"><span style="width: ${percent}%"></span></div></td>
          <td>${formatAgo(world?.updatedAt || progress.updatedAt)}</td>
        </tr>
      `;
    }).join("")
    : `<tr><td colspan="7">학생이 월드에 들어오면 위치와 진행 상태가 표시됩니다.</td></tr>`;

  return `
    <section class="world-card world-monitor" data-testid="world-progress-monitor">
      <div class="world-card-head">
        <div>
          <span class="category-badge">교사용 관찰</span>
          <h2>${escapeHtml(activeStation.label)} 진행 현황</h2>
        </div>
      </div>
      <div class="progress-table-wrap">
        <table class="progress-table">
          <thead>
            <tr>
              <th>학생</th>
              <th>월드 상태</th>
              <th>도움</th>
              <th>현재 미션</th>
              <th>진도</th>
              <th>막대</th>
              <th>업데이트</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function applyWorldCommands() {
  if (state.role !== "student") return;
  const player = worldPlayer();
  const worldState = currentWorldState();
  const gatherSeq = Number(worldState.gatherSeq || 0);
  if (!player || !gatherSeq || gatherSeq <= state.lastWorldGatherSeq) return;

  state.lastWorldGatherSeq = gatherSeq;
  updateWorldPlayer({
    x: clampWorldPosition(worldState.gatherAt?.x || WORLD_SPAWN.x),
    y: clampWorldPosition(worldState.gatherAt?.y || WORLD_SPAWN.y),
    direction: "down",
    status: "집합 위치로 이동"
  }).catch((error) => setStartStatus(error.message));
}

function renderWorldPanel() {
  applyWorldCommands();
  const worldState = currentWorldState();
  const station = currentWorldStation();
  const message = worldState.teacherMessage || "교사가 스테이션을 열면 포털이 활성화됩니다.";
  const map = renderWorldMap({ interactive: state.role === "student" && Boolean(worldPlayer()) });

  if (state.role === "host") {
    els.promptPanel.innerHTML = `
      <section class="world-shell" data-testid="world-host">
        <div class="activity-monitor__head">
          <div>
            <span class="category-badge">키보드 캠퍼스</span>
            <h2>${escapeHtml(station.label)}</h2>
            <p>${escapeHtml(message)}</p>
          </div>
          <span class="stage-chip">${worldState.movementLocked ? "이동 잠금" : "이동 가능"}</span>
        </div>
        ${map}
        ${renderWorldHostMonitor()}
      </section>
    `;
    return;
  }

  const player = worldPlayer();
  if (!player) {
    els.promptPanel.innerHTML = `
      <section class="world-shell" data-testid="world-student">
        <div class="activity-monitor__head">
          <div>
            <span class="category-badge">키보드 캠퍼스</span>
            <h2>${escapeHtml(station.label)}</h2>
            <p>${escapeHtml(message)}</p>
          </div>
        </div>
        ${map}
        ${renderAvatarPicker()}
      </section>
    `;
    return;
  }

  const progress = worldProgressFor(station.id)[state.client.uid] || {};
  els.promptPanel.innerHTML = `
    <section class="world-shell" data-testid="world-student">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">지금 열린 포털</span>
          <h2>${escapeHtml(station.label)}</h2>
          <p>${escapeHtml(message)}</p>
        </div>
        <span class="stage-chip">${worldState.movementLocked ? "이동 잠금" : "이동 가능"}</span>
      </div>
      ${map}
      <div class="world-student-grid">
        ${renderWorldTask(station, progress)}
        ${renderWorldStudentTools(player)}
      </div>
    </section>
  `;
}

function groupLabel(index) {
  return `${String.fromCharCode(65 + index)}팀`;
}

function studentEntries(room = state.room) {
  return playerEntries(room).filter(([, player]) => player.role !== "host");
}

function shuffledEntries(entries) {
  return entries
    .map((entry) => ({ entry, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.entry);
}

function createBalancedGroups(entries, maxSize = GROUP_GAME_MAX_SIZE) {
  const students = shuffledEntries(entries);
  const groupCount = Math.max(1, Math.ceil(students.length / maxSize));
  const groups = Array.from({ length: groupCount }, (_, index) => ({
    id: `g${index + 1}`,
    index,
    label: groupLabel(index),
    memberUids: [],
    createdAt: now()
  }));

  students.forEach(([uid], index) => {
    groups[index % groupCount].memberUids.push(uid);
  });
  return groups;
}

function membersForGroup(group, room = state.room) {
  return (group?.memberUids || [])
    .map((uid) => [uid, room?.players?.[uid]])
    .filter(([, player]) => Boolean(player));
}

function memberName(uid, room = state.room) {
  return room?.players?.[uid]?.nickname || "참가자";
}

function adjacentUid(group, uid, offset) {
  const uids = group?.memberUids || [];
  const index = uids.indexOf(uid);
  if (index < 0 || !uids.length) return "";
  return uids[(index + offset + uids.length) % uids.length];
}

function buildDrawingCanvas(sessionId, groupId, drawingId, canDraw = false, label = "그림") {
  return `
    <div class="drawing-board ${canDraw ? "is-interactive" : ""}">
      <canvas
        data-drawing-canvas="1"
        data-session-id="${escapeHtml(sessionId)}"
        data-group-id="${escapeHtml(groupId)}"
        data-drawing-id="${escapeHtml(drawingId)}"
        data-can-draw="${canDraw ? "1" : "0"}"
        aria-label="${escapeHtml(label)}"
      ></canvas>
      <span class="drawing-cursor" aria-hidden="true"></span>
    </div>
  `;
}

function renderDrawingControls(sessionId, groupId, drawingId) {
  const colors = DRAWING_COLORS.map((color) => `
    <button
      class="drawing-swatch ${state.drawingColor === color ? "is-selected" : ""}"
      type="button"
      style="--swatch: ${color};"
      data-action="select-drawing-color"
      data-color="${escapeHtml(color)}"
      aria-label="색상 선택"
    ></button>
  `).join("");
  const sizes = DRAWING_SIZES.map((size) => `
    <button
      class="secondary-button drawing-size-button ${state.drawingSize === size ? "is-selected" : ""}"
      type="button"
      data-action="select-drawing-size"
      data-size="${size}"
      aria-label="굵기 ${size}"
    ><span style="--preview-size: ${Math.max(8, Math.min(30, size))}px"></span></button>
  `).join("");

  return `
    <div class="drawing-tools" data-testid="drawing-tools">
      <div class="drawing-tool-row">
        <button class="secondary-button ${state.drawingTool === "pen" ? "is-selected" : ""}" type="button" data-action="select-drawing-tool" data-tool="pen">펜</button>
        <button class="secondary-button ${state.drawingTool === "eraser" ? "is-selected" : ""}" type="button" data-action="select-drawing-tool" data-tool="eraser">지우개</button>
        <div class="drawing-swatches">${colors}</div>
        <div class="drawing-sizes">${sizes}</div>
      </div>
      <div class="drawing-tool-row">
        <button class="secondary-button" type="button" data-action="undo-drawing-stroke" data-session-id="${escapeHtml(sessionId)}" data-group-id="${escapeHtml(groupId)}" data-drawing-id="${escapeHtml(drawingId)}" data-testid="drawing-undo">되돌리기</button>
        <button class="danger-button" type="button" data-action="clear-drawing" data-session-id="${escapeHtml(sessionId)}" data-group-id="${escapeHtml(groupId)}" data-drawing-id="${escapeHtml(drawingId)}" data-testid="drawing-clear">전체 지우기</button>
      </div>
    </div>
  `;
}

function guessAttempts(guessRecord) {
  return (guessRecord?.attempts || []).slice(-5);
}

function renderCatchmindHost(session) {
  const cards = groupEntries()
    .filter(([groupId]) => session.groups?.[groupId])
    .map(([groupId, group]) => {
      const sGroup = session.groups[groupId];
      const word = getPartyWord(sGroup.promptId);
      const correct = correctGuessFor(session.id, groupId, word);
      const guesses = Object.values(groupGuessesFor(session.id, groupId));
      const attempts = guesses.reduce((sum, guess) => sum + (guess.attempts?.length || 0), 0);
      const status = correct ? `정답 · ${correct.nickname || "참가자"}` : "진행 중";
      const members = membersForGroup(group)
        .map(([, player]) => `<span class="mini-member">${escapeHtml(player.nickname)}</span>`)
        .join("");
      return `
        <article class="group-card" data-testid="catchmind-group-card">
          <div class="group-card-head">
            <div>
              <span class="category-badge">${escapeHtml(group.label)} · ${membersForGroup(group).length}명</span>
              <h2>${escapeHtml(word.answer)}</h2>
              <p>${escapeHtml(word.lesson)} · ${escapeHtml(word.clue)}</p>
            </div>
            <span class="progress-status progress-status--${correct ? "completed" : "working"}">${escapeHtml(status)}</span>
          </div>
          ${buildDrawingCanvas(session.id, groupId, sGroup.drawingId, false, `${group.label} 그림`)}
          <div class="group-meta-grid">
            <span>출제자 <strong>${escapeHtml(memberName(sGroup.drawerUid))}</strong></span>
            <span>시도 <strong>${attempts}</strong></span>
            <span>소요 <strong>${correct ? `${Math.max(1, Math.round((correct.createdAt - session.phaseStartedAt) / 1000))}초` : "-"}</strong></span>
          </div>
          <div class="mini-member-row">${members}</div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="group-game-shell" data-testid="group-game-host">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">타이핑 캐치마인드</span>
          <h2>그룹별 그림 추측 라운드</h2>
          <p>출제자만 정답을 보고, 같은 그룹 학생들이 타이핑으로 맞힙니다.</p>
        </div>
        <span class="stage-chip">라운드 ${session.roundIndex}</span>
      </div>
      <div class="group-card-grid">${cards}</div>
    </section>
  `;
}

function renderCatchmindStudent(session) {
  const group = groupForPlayer();
  const sGroup = sessionGroup(group?.id, session);
  if (!group || !sGroup) {
    return `<div class="empty-note">이번 그룹 게임에 아직 배정되지 않았습니다.</div>`;
  }

  const word = getPartyWord(sGroup.promptId);
  const isDrawer = sGroup.drawerUid === state.client.uid;
  const correct = correctGuessFor(session.id, group.id, word);
  const myGuess = groupGuessesFor(session.id, group.id)[state.client.uid] || {};
  const attempts = guessAttempts(myGuess);
  const attemptList = attempts.length
    ? attempts.map((attempt) => `<li class="${attempt.isCorrect ? "is-correct" : ""}">${escapeHtml(attempt.text)} ${attempt.isCorrect ? "· 정답" : ""}</li>`).join("")
    : `<li>아직 입력한 추측이 없습니다.</li>`;

  const answerBlock = isDrawer
    ? `
      <div class="catchmind-answer" data-testid="catchmind-drawer-answer">
        <span class="category-badge">${escapeHtml(word.lesson)}</span>
        <strong>${escapeHtml(word.answer)}</strong>
        <p>${escapeHtml(word.clue)}</p>
      </div>
    `
    : `
      <div class="catchmind-answer">
        <span class="category-badge">${escapeHtml(group.label)}</span>
        <strong>${correct ? `정답: ${word.answer}` : "그림을 보고 맞혀 보세요"}</strong>
        <p>${correct ? `${correct.nickname || "친구"} 님이 맞혔습니다.` : `${memberName(sGroup.drawerUid)} 님이 그리고 있습니다.`}</p>
      </div>
    `;

  const inputBlock = isDrawer
    ? renderDrawingControls(session.id, group.id, sGroup.drawingId)
    : `
      <form class="answer-form" id="catchmindGuessForm">
        <label>
          <span>추측 입력</span>
          <input id="catchmindGuessInput" autocomplete="off" placeholder="정답을 타이핑하세요" data-testid="catchmind-guess-input" ${correct ? "disabled" : ""}>
        </label>
        <button class="primary-button" type="submit" data-testid="catchmind-submit-guess" ${correct ? "disabled" : ""}>맞히기</button>
      </form>
      <ul class="guess-list">${attemptList}</ul>
    `;

  return `
    <section class="group-game-shell" data-testid="catchmind-student">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">타이핑 캐치마인드 · ${escapeHtml(group.label)}</span>
          <h2>${isDrawer ? "내가 그릴 차례" : "친구 그림 맞히기"}</h2>
          <p>${membersForGroup(group).map(([, player]) => player.nickname).join(", ")}</p>
        </div>
        <span class="stage-chip">${correct ? "완료" : "진행 중"}</span>
      </div>
      <div class="catchmind-layout">
        <section class="group-card">
          ${answerBlock}
          ${buildDrawingCanvas(session.id, group.id, sGroup.drawingId, isDrawer && !correct, "캐치마인드 그림판")}
          ${inputBlock}
        </section>
      </div>
    </section>
  `;
}

function renderPhonePromptForm(session, group, existing) {
  return `
    <section class="group-card" data-testid="gartic-phone-prompt">
      <span class="category-badge">${escapeHtml(group.label)} · 1단계</span>
      <h2>시작 문장 쓰기</h2>
      <p class="field-note">친구가 그림으로 표현할 수 있는 짧은 문장을 씁니다.</p>
      <form class="answer-form" id="phonePromptForm">
        <textarea id="phonePromptInput" maxlength="80" placeholder="예: 버스에서 라면을 먹는 사장님" data-testid="phone-prompt-input">${escapeHtml(existing?.prompt || "")}</textarea>
        <button class="primary-button" type="submit" data-testid="phone-submit-prompt">문장 제출</button>
      </form>
    </section>
  `;
}

function renderPhoneDrawStep(session, group, existing) {
  const sourceUid = adjacentUid(group, state.client.uid, -1);
  const source = groupPhoneFor(session.id, group.id)[sourceUid] || {};
  const drawingId = `phone_${state.client.uid}`;
  return `
    <section class="group-card" data-testid="gartic-phone-draw">
      <span class="category-badge">${escapeHtml(group.label)} · 2단계</span>
      <h2>문장을 그림으로 바꾸기</h2>
      <div class="catchmind-answer">
        <strong>${escapeHtml(source.prompt || "친구 문장을 기다리는 중입니다.")}</strong>
        <p>${escapeHtml(memberName(sourceUid))} 님의 문장입니다.</p>
      </div>
      ${buildDrawingCanvas(session.id, group.id, drawingId, Boolean(source.prompt), "갈틱폰 그림")}
      ${source.prompt ? renderDrawingControls(session.id, group.id, drawingId) : ""}
      <p class="field-note">${existing?.drawnAt ? "그림 저장됨" : "획을 그리면 자동 저장됩니다."}</p>
    </section>
  `;
}

function renderPhoneGuessStep(session, group, existing) {
  const sourceUid = adjacentUid(group, state.client.uid, -1);
  const drawingId = `phone_${sourceUid}`;
  return `
    <section class="group-card" data-testid="gartic-phone-guess">
      <span class="category-badge">${escapeHtml(group.label)} · 3단계</span>
      <h2>그림을 문장으로 추측하기</h2>
      <p class="field-note">${escapeHtml(memberName(sourceUid))} 님의 그림을 보고 문장을 씁니다.</p>
      ${buildDrawingCanvas(session.id, group.id, drawingId, false, "갈틱폰 추측 그림")}
      <form class="answer-form" id="phoneGuessForm">
        <textarea id="phoneGuessInput" maxlength="80" placeholder="그림을 보고 떠오르는 문장" data-testid="phone-guess-input">${escapeHtml(existing?.guess || "")}</textarea>
        <button class="primary-button" type="submit" data-testid="phone-submit-guess">추측 제출</button>
      </form>
    </section>
  `;
}

function renderPhoneReveal(session, group) {
  const phone = groupPhoneFor(session.id, group.id);
  const cards = (group.memberUids || []).map((uid) => {
    const drawerUid = adjacentUid(group, uid, 1);
    const guesserUid = adjacentUid(group, uid, 2);
    const original = phone[uid]?.prompt || "문장 없음";
    const guess = phone[guesserUid]?.guess || "추측 없음";
    return `
      <article class="phone-chain-card" data-testid="phone-chain-card">
        <span class="category-badge">${escapeHtml(memberName(uid))}의 시작</span>
        <strong>${escapeHtml(original)}</strong>
        ${buildDrawingCanvas(session.id, group.id, `phone_${drawerUid}`, false, "갈틱폰 공개 그림")}
        <p><b>${escapeHtml(memberName(guesserUid))}의 추측</b> ${escapeHtml(guess)}</p>
      </article>
    `;
  }).join("");

  return `
    <section class="group-game-shell" data-testid="gartic-phone-reveal">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">타이핑 갈틱폰 · ${escapeHtml(group.label)}</span>
          <h2>변신 결과 공개</h2>
          <p>문장이 그림을 거쳐 어떻게 바뀌었는지 봅니다.</p>
        </div>
      </div>
      <div class="phone-chain-grid">${cards}</div>
    </section>
  `;
}

function renderGarticPhoneStudent(session) {
  const group = groupForPlayer();
  if (!group) return `<div class="empty-note">이번 갈틱폰에 아직 배정되지 않았습니다.</div>`;
  const existing = groupPhoneFor(session.id, group.id)[state.client.uid] || {};
  if (session.phonePhase === "draw") return renderPhoneDrawStep(session, group, existing);
  if (session.phonePhase === "guess") return renderPhoneGuessStep(session, group, existing);
  if (session.phonePhase === "reveal") return renderPhoneReveal(session, group);
  return renderPhonePromptForm(session, group, existing);
}

function renderGarticPhoneHost(session) {
  const phaseLabel = {
    prompt: "문장 작성",
    draw: "그림 변환",
    guess: "문장 추측",
    reveal: "최종 공개"
  }[session.phonePhase || "prompt"];
  const cards = groupEntries()
    .filter(([groupId]) => session.groups?.[groupId])
    .map(([groupId, group]) => {
      const phone = groupPhoneFor(session.id, groupId);
      const promptCount = Object.values(phone).filter((item) => item.prompt).length;
      const guessCount = Object.values(phone).filter((item) => item.guess).length;
      const drawingCount = (group.memberUids || []).filter((uid) => strokesForDrawing(drawingFor(session.id, groupId, `phone_${uid}`)).length).length;
      return `
        <article class="group-card" data-testid="gartic-phone-group-card">
          <div class="group-card-head">
            <div>
              <span class="category-badge">${escapeHtml(group.label)} · ${membersForGroup(group).length}명</span>
              <h2>${escapeHtml(phaseLabel)}</h2>
              <p>${membersForGroup(group).map(([, player]) => player.nickname).join(", ")}</p>
            </div>
            <span class="progress-status progress-status--working">${escapeHtml(phaseLabel)}</span>
          </div>
          <div class="group-meta-grid">
            <span>문장 <strong>${promptCount}</strong></span>
            <span>그림 <strong>${drawingCount}</strong></span>
            <span>추측 <strong>${guessCount}</strong></span>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="group-game-shell" data-testid="gartic-phone-host">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">타이핑 갈틱폰</span>
          <h2>${escapeHtml(phaseLabel)}</h2>
          <p>같은 그룹 안에서 문장, 그림, 추측을 차례로 넘깁니다.</p>
        </div>
        <span class="stage-chip">라운드 ${session.roundIndex}</span>
      </div>
      <div class="group-card-grid">${cards}</div>
    </section>
  `;
}

function renderGroupGamePanel() {
  const session = currentGroupSession();
  if (!session) {
    els.promptPanel.innerHTML = `<div class="empty-note">그룹 게임 세션을 찾을 수 없습니다.</div>`;
    return;
  }

  if (session.type === "typingGarticPhone") {
    els.promptPanel.innerHTML = state.role === "host" ? renderGarticPhoneHost(session) : renderGarticPhoneStudent(session);
  } else {
    els.promptPanel.innerHTML = state.role === "host" ? renderCatchmindHost(session) : renderCatchmindStudent(session);
  }
  requestAnimationFrame(renderDrawingCanvases);
}

function renderRoom() {
  const room = state.room;
  if (!room?.meta) return;
  const stage = room.meta.status || "lobby";
  const round = currentRound(room);
  const activity = currentActivity(room);
  const groupSession = currentGroupSession(room);
  const joinUrl = buildJoinUrl(state.roomCode);

  els.roleLabel.textContent = state.role === "host" ? "Teacher" : "Student";
  els.roomTitle.textContent = state.role === "host" ? "교사용 진행 화면" : "학생 참가 화면";
  els.roomSubtitle.textContent = stage === "lobby"
    ? "참가자를 기다리는 중입니다."
    : stage === "world"
      ? `${currentWorldStation(room).label} 포털이 열려 있습니다.`
    : stage === "activity"
      ? `${activity?.label || "개인 활동"} 진행 중입니다.`
    : stage === "groupGame"
      ? `${getGameLabel(groupSession?.type || "typingCatchmind")} 그룹 게임 중입니다.`
      : `${getGameLabel(round?.gameType)} 진행 중입니다.`;
  els.roomCodeDisplay.textContent = state.roomCode;
  els.joinLink.href = joinUrl;
  els.joinLink.textContent = "입장 링크";
  els.roundKicker.textContent = stage === "world" ? "Keyboard Campus" : stage === "activity" ? "Tracked Activity" : stage === "groupGame" ? getGameLabel(groupSession?.type || "typingCatchmind") : round ? getGameLabel(round.gameType) : "Lobby";
  els.stageTitle.textContent = STAGES[stage] || STAGES.lobby;
  els.stageChip.textContent = stage;

  renderPlayers();
  renderHostControls(stage, round);
  if (stage === "world") {
    delete els.promptPanel.dataset.activityRunId;
    renderWorldPanel();
    els.submitPanel.innerHTML = "";
    els.submissionsPanel.innerHTML = "";
    els.resultsPanel.innerHTML = "";
    return;
  }
  if (stage === "activity") {
    renderActivityPanel(activity, room.meta.currentActivityRunId);
    els.submitPanel.innerHTML = "";
    els.submissionsPanel.innerHTML = "";
    els.resultsPanel.innerHTML = "";
    return;
  }
  if (stage === "groupGame") {
    delete els.promptPanel.dataset.activityRunId;
    renderGroupGamePanel();
    els.submitPanel.innerHTML = "";
    els.submissionsPanel.innerHTML = "";
    els.resultsPanel.innerHTML = "";
    return;
  }
  delete els.promptPanel.dataset.activityRunId;
  renderPrompt(stage, round);
  renderSubmit(stage, round);
  renderSubmissions(stage, round);
  renderResults(stage, round);
}

function groupsObjectFromList(groups) {
  return Object.fromEntries(groups.map((group) => [group.id, group]));
}

function groupsForNewSession({ reuseGroups = false } = {}) {
  const existing = groupEntries().map(([, group]) => group).filter((group) => group.memberUids?.length);
  if (reuseGroups && existing.length) return existing;
  return createBalancedGroups(studentEntries());
}

function buildSessionGroups(groups, gameType, roundIndex) {
  return Object.fromEntries(groups.map((group, index) => {
    const memberUids = group.memberUids || [];
    const drawerUid = memberUids.length ? memberUids[(roundIndex - 1) % memberUids.length] : "";
    const word = getPartyWordByIndex(roundIndex + index * 5);
    return [group.id, {
      groupId: group.id,
      drawerUid,
      drawerNickname: memberName(drawerUid),
      promptId: word.id,
      drawingId: gameType === "typingCatchmind" ? `catch_${group.id}_${roundIndex}` : `phone_${group.id}_${roundIndex}`,
      startedAt: now()
    }];
  }));
}

async function startGroupGame(gameType, { reuseGroups = false } = {}) {
  if (state.role !== "host") return;
  const students = studentEntries();
  if (!students.length) {
    setStartStatus("학생이 1명 이상 입장해야 그룹 게임을 시작할 수 있습니다.");
    return;
  }

  const groups = groupsForNewSession({ reuseGroups });
  const roundIndex = Number(state.room?.meta?.groupRoundIndex || 0) + 1;
  const sessionId = `${gameType === "typingGarticPhone" ? "gp" : "cm"}_${now()}`;
  const timestamp = now();
  const session = {
    id: sessionId,
    type: gameType,
    roundIndex,
    stage: "playing",
    phonePhase: gameType === "typingGarticPhone" ? "prompt" : "",
    maxGroupSize: GROUP_GAME_MAX_SIZE,
    limitSeconds: gameType === "typingCatchmind" ? CATCHMIND_SECONDS : 0,
    groupIds: groups.map((group) => group.id),
    groups: buildSessionGroups(groups, gameType, roundIndex),
    startedAt: timestamp,
    phaseStartedAt: timestamp
  };

  const updates = {
    "meta/status": "groupGame",
    "meta/currentRoundId": "",
    "meta/currentActivityId": "",
    "meta/currentActivityRunId": "",
    "meta/currentGroupSessionId": sessionId,
    "meta/groupGameType": gameType,
    "meta/groupRoundIndex": roundIndex,
    "meta/phaseStartedAt": timestamp,
    [`groupSessions/${sessionId}`]: session
  };

  Object.entries(groupsObjectFromList(groups)).forEach(([groupId, group]) => {
    updates[`groups/${groupId}`] = group;
  });

  await state.client.updateRoom(state.roomCode, updates);
}

async function nextCatchmindRound() {
  await startGroupGame("typingCatchmind", { reuseGroups: true });
}

async function advanceGarticPhone() {
  if (state.role !== "host") return;
  const session = currentGroupSession();
  if (!session || session.type !== "typingGarticPhone") return;
  if (session.phonePhase === "reveal") {
    await startGroupGame("typingGarticPhone", { reuseGroups: true });
    return;
  }
  const nextPhase = session.phonePhase === "prompt" ? "draw" : session.phonePhase === "draw" ? "guess" : "reveal";
  await state.client.updateRoom(state.roomCode, {
    [`groupSessions/${session.id}/phonePhase`]: nextPhase,
    [`groupSessions/${session.id}/phaseStartedAt`]: now(),
    "meta/phaseStartedAt": now()
  });
}

async function startRound() {
  const room = state.room;
  if (!room?.meta || state.role !== "host") return;
  if (state.selectedGame === "typingCatchmind" || state.selectedGame === "typingGarticPhone") {
    await startGroupGame(state.selectedGame);
    return;
  }
  const roundIndex = Number(room.meta.roundIndex || 0) + 1;
  const roundId = `r_${now()}`;
  const gameType = state.selectedGame;
  const round = {
    id: roundId,
    index: roundIndex,
    gameType,
    stage: "prompt",
    prompt: createPrompt(gameType, roundIndex - 1),
    limitSeconds: ROUND_SECONDS,
    startedAt: now()
  };

  await state.client.updateRoom(state.roomCode, {
    [`rounds/${roundId}`]: round,
    "meta/status": "prompt",
    "meta/gameType": gameType,
    "meta/currentRoundId": roundId,
    "meta/roundIndex": roundIndex,
    "meta/phaseStartedAt": now()
  });
}

async function startActivity() {
  const activity = getTrackedActivity(state.selectedActivity);
  if (!activity || state.role !== "host") return;
  const runId = `a_${now()}`;
  await state.client.updateRoom(state.roomCode, {
    "meta/status": "activity",
    "meta/currentActivityId": activity.id,
    "meta/currentActivityRunId": runId,
    "meta/currentRoundId": "",
    "meta/phaseStartedAt": now()
  });
}

async function startWorld() {
  if (state.role !== "host") return;
  const existingWorldState = currentWorldState();
  const nextWorldState = createWorldState(existingWorldState);
  state.selectedWorldStation = nextWorldState.activeStationId;
  await state.client.updateRoom(state.roomCode, {
    "meta/status": "world",
    "meta/currentRoundId": "",
    "meta/currentActivityId": "",
    "meta/currentActivityRunId": "",
    "meta/phaseStartedAt": now(),
    "world/state": nextWorldState
  });
}

async function openWorldStation() {
  if (state.role !== "host") return;
  const station = getWorldStation(state.selectedWorldStation);
  const worldState = currentWorldState();
  await state.client.updateRoom(state.roomCode, {
    "world/state/activeStationId": station.id,
    "world/state/stationSeq": Number(worldState.stationSeq || 0) + 1,
    "world/state/teacherMessage": `${station.label} 포털이 열렸습니다.`,
    "world/state/updatedAt": now()
  });
}

async function gatherWorldPlayers() {
  if (state.role !== "host") return;
  const worldState = currentWorldState();
  await state.client.updateRoom(state.roomCode, {
    "world/state/gatherSeq": Number(worldState.gatherSeq || 0) + 1,
    "world/state/gatherAt": { ...WORLD_SPAWN },
    "world/state/teacherMessage": "선생님이 모두를 자판 광장 앞으로 모았습니다.",
    "world/state/updatedAt": now()
  });
}

async function toggleWorldLock() {
  if (state.role !== "host") return;
  const worldState = currentWorldState();
  const movementLocked = !worldState.movementLocked;
  await state.client.updateRoom(state.roomCode, {
    "world/state/movementLocked": movementLocked,
    "world/state/teacherMessage": movementLocked ? "잠시 이동을 멈추고 선생님 화면을 봅니다." : "다시 이동할 수 있습니다.",
    "world/state/updatedAt": now()
  });
}

async function updateWorldPlayer(updates) {
  const existing = worldPlayer() || {};
  const avatar = getWorldAvatar(updates.avatarId || existing.avatarId || state.selectedWorldAvatar);
  await state.client.setWorldPlayer(state.roomCode, {
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    avatarId: avatar.id,
    x: clampWorldPosition(updates.x ?? existing.x ?? WORLD_SPAWN.x),
    y: clampWorldPosition(updates.y ?? existing.y ?? WORLD_SPAWN.y),
    direction: updates.direction || existing.direction || "down",
    status: String(updates.status || existing.status || "월드 입장").slice(0, 40),
    emote: String(updates.emote ?? existing.emote ?? "").slice(0, 20),
    help: Boolean(updates.help ?? existing.help ?? false),
    enteredAt: existing.enteredAt || now(),
    updatedAt: now()
  });
}

async function enterWorldAvatar() {
  if (state.role !== "student") return;
  await updateWorldPlayer({
    avatarId: state.selectedWorldAvatar,
    x: WORLD_SPAWN.x + Math.floor(Math.random() * 5) - 2,
    y: WORLD_SPAWN.y + Math.floor(Math.random() * 5) - 2,
    direction: "down",
    status: "월드 입장",
    emote: "",
    help: false
  });
}

async function setWorldProgress(station, status, detail, completed = 0) {
  await state.client.setWorldProgress(state.roomCode, station.id, {
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    stationId: station.id,
    stationLabel: station.label,
    status,
    detail: String(detail || "").slice(0, 80),
    completed,
    total: 1,
    updatedAt: now()
  });
}

async function enterWorldStation(stationId) {
  if (state.role !== "student") return;
  const station = getWorldStation(stationId);
  const worldState = currentWorldState();
  if (worldState.activeStationId !== station.id || !worldPlayer()) return;
  await Promise.all([
    setWorldProgress(station, "working", `${station.shortLabel} 미션 확인`, 0),
    updateWorldPlayer({ status: `${station.shortLabel} 미션 중`, help: false })
  ]);
}

async function completeWorldStation(station, detail = station.successDetail) {
  if (state.role !== "student" || !worldPlayer()) return;
  await Promise.all([
    setWorldProgress(station, "completed", detail, 1),
    updateWorldPlayer({ status: `${station.shortLabel} 완료`, emote: "완료", help: false })
  ]);
}

async function moveWorldPlayer(direction) {
  const player = worldPlayer();
  const worldState = currentWorldState();
  if (state.role !== "student" || !player || worldState.movementLocked) return;
  const timestamp = now();
  if (timestamp - state.lastWorldSyncAt < 120) return;
  state.lastWorldSyncAt = timestamp;

  const next = {
    x: player.x || WORLD_SPAWN.x,
    y: player.y || WORLD_SPAWN.y
  };
  if (direction === "left") next.x -= WORLD_STEP;
  if (direction === "right") next.x += WORLD_STEP;
  if (direction === "up") next.y -= WORLD_STEP;
  if (direction === "down") next.y += WORLD_STEP;

  await updateWorldPlayer({
    x: next.x,
    y: next.y,
    direction,
    status: "이동 중"
  });
}

async function toggleWorldHelp() {
  const player = worldPlayer();
  if (state.role !== "student" || !player) return;
  const help = !player.help;
  await updateWorldPlayer({
    help,
    status: help ? "도움 요청" : "도움 해결",
    emote: help ? "" : player.emote
  });
}

async function sendWorldEmote(label) {
  if (state.role !== "student" || !worldPlayer()) return;
  await updateWorldPlayer({
    emote: label,
    help: false,
    status: `${label} 보내기`
  });
}

async function setStage(nextStage) {
  const round = currentRound();
  if (!round || state.role !== "host") return;
  await state.client.updateRoom(state.roomCode, {
    "meta/status": nextStage,
    "meta/phaseStartedAt": now(),
    [`rounds/${round.id}/stage`]: nextStage
  });
}

async function nextLobby() {
  if (state.role !== "host") return;
  await state.client.updateRoom(state.roomCode, {
    "meta/status": "lobby",
    "meta/currentRoundId": "",
    "meta/currentActivityId": "",
    "meta/currentActivityRunId": "",
    "meta/currentGroupSessionId": "",
    "meta/groupGameType": "",
    "meta/phaseStartedAt": now()
  });
}

function validateAnswer(text, round) {
  const value = text.trim();
  if (!value) return "답변을 입력하세요.";
  if ([...value].length > ANSWER_LIMIT) return `${ANSWER_LIMIT}자 안으로 입력하세요.`;

  const prompt = round.prompt || {};
  if (round.gameType === "randomBox") {
    const missing = (prompt.keywords || []).filter((keyword) => !value.includes(keyword));
    if (missing.length) return `빠진 단어: ${missing.join(", ")}`;
  }

  if (round.gameType === "escapeMission") {
    if (prompt.requiredWord && !value.includes(prompt.requiredWord)) {
      return `필수 단어 "${prompt.requiredWord}"를 넣으세요.`;
    }
    if (prompt.condition?.includes("10글자") && [...value].length < 10) {
      return "10글자 이상 입력하세요.";
    }
  }

  return "";
}

async function submitAnswer(event) {
  event.preventDefault();
  const round = currentRound();
  const input = document.getElementById("answerInput");
  if (!round || !input) return;
  const text = input.value.trim();
  const error = validateAnswer(text, round);
  if (error) {
    setFieldNote(error, "error");
    return;
  }

  await state.client.setSubmission(state.roomCode, round.id, {
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    text,
    gameType: round.gameType,
    roundId: round.id,
    createdAt: now()
  });
  setFieldNote("제출 완료. 투표 전까지 다시 제출할 수 있습니다.", "good");
}

async function submitWorldTyping(event) {
  event.preventDefault();
  const station = currentWorldStation();
  const input = document.getElementById("worldTypingAnswer");
  if (!input || station.type !== "typing") return;
  const value = String(input.value || "").trim();
  if (value !== station.answer) {
    setStartStatus(`'${station.answer}'를 정확히 입력해 보세요.`);
    input.select();
    return;
  }
  setStartStatus("");
  await completeWorldStation(station, station.successDetail);
}

function drawingCanvasKey(canvas) {
  return `${canvas.dataset.sessionId}/${canvas.dataset.groupId}/${canvas.dataset.drawingId}`;
}

function pointForCanvas(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.max(0, Math.min(1000, Math.round(((event.clientX - rect.left) / rect.width) * 1000)));
  const y = Math.max(0, Math.min(1000, Math.round(((event.clientY - rect.top) / rect.height) * 1000)));
  return { x, y };
}

function updateDrawingCursor(event, canvas) {
  const board = canvas?.closest?.(".drawing-board");
  if (!board || canvas.dataset.canDraw !== "1") return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    board.classList.remove("is-cursor-visible");
    return;
  }
  const size = Math.max(4, Number(state.drawingSize || DRAWING_SIZES[0]));
  board.style.setProperty("--cursor-x", `${x}px`);
  board.style.setProperty("--cursor-y", `${y}px`);
  board.style.setProperty("--cursor-size", `${size}px`);
  board.style.setProperty("--cursor-color", state.drawingTool === "eraser" ? "#be123c" : state.drawingColor);
  board.classList.add("is-cursor-visible");
  board.classList.toggle("is-eraser-cursor", state.drawingTool === "eraser");
}

function hideDrawingCursor(event) {
  const board = event.target?.closest?.(".drawing-board");
  if (!board || board.contains(event.relatedTarget)) return;
  board.classList.remove("is-cursor-visible");
}

function drawingPointerId(event) {
  return event.pointerId ?? "mouse";
}

function compactPoints(points) {
  if (points.length <= 140) return points;
  const step = Math.ceil(points.length / 140);
  return points.filter((_, index) => index % step === 0 || index === points.length - 1);
}

function drawStroke(ctx, stroke, width, height, scale = 1) {
  const points = stroke?.points || [];
  if (points.length < 1) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Number(stroke.size || 4) * scale;
  if (stroke.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)";
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = stroke.color || DRAWING_COLORS[0];
  }
  ctx.beginPath();
  points.forEach((point, index) => {
    const x = (Number(point.x || 0) / 1000) * width;
    const y = (Number(point.y || 0) / 1000) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  if (points.length === 1) {
    const point = points[0];
    ctx.arc((point.x / 1000) * width, (point.y / 1000) * height, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  } else {
    ctx.stroke();
  }
  ctx.restore();
}

function renderDrawingCanvases() {
  document.querySelectorAll("[data-drawing-canvas]").forEach((canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    const drawing = drawingFor(canvas.dataset.sessionId, canvas.dataset.groupId, canvas.dataset.drawingId);
    strokesForDrawing(drawing).forEach((stroke) => drawStroke(ctx, stroke, width, height, ratio));
    if (state.activeStroke?.key === drawingCanvasKey(canvas)) {
      drawStroke(ctx, state.activeStroke, width, height, ratio);
    }
  });
}

function handleDrawingPointerDown(event) {
  const canvas = event.target.closest?.("[data-drawing-canvas]");
  if (!canvas || canvas.dataset.canDraw !== "1") return;
  if (event.type === "mousedown" && now() - state.lastDrawingPointerAt < 500) return;
  if (event.type === "pointerdown") state.lastDrawingPointerAt = now();
  event.preventDefault();
  updateDrawingCursor(event, canvas);
  if (event.pointerId !== undefined) canvas.setPointerCapture?.(event.pointerId);
  state.activeStroke = {
    key: drawingCanvasKey(canvas),
    pointerId: drawingPointerId(event),
    sessionId: canvas.dataset.sessionId,
    groupId: canvas.dataset.groupId,
    drawingId: canvas.dataset.drawingId,
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    tool: state.drawingTool,
    color: state.drawingColor,
    size: state.drawingSize,
    points: [pointForCanvas(event, canvas)],
    createdAt: now()
  };
  renderDrawingCanvases();
}

function handleDrawingPointerMove(event) {
  const hoverCanvas = event.target.closest?.("[data-drawing-canvas]");
  if (hoverCanvas) updateDrawingCursor(event, hoverCanvas);
  if (!state.activeStroke || state.activeStroke.pointerId !== drawingPointerId(event)) return;
  const canvas = [...document.querySelectorAll("[data-drawing-canvas]")].find((item) =>
    item.dataset.sessionId === state.activeStroke.sessionId
    && item.dataset.groupId === state.activeStroke.groupId
    && item.dataset.drawingId === state.activeStroke.drawingId
  );
  if (!canvas) return;
  event.preventDefault();
  const nextPoint = pointForCanvas(event, canvas);
  const previous = state.activeStroke.points[state.activeStroke.points.length - 1];
  const distance = Math.hypot(nextPoint.x - previous.x, nextPoint.y - previous.y);
  if (distance < 3) return;
  state.activeStroke.points.push(nextPoint);
  renderDrawingCanvases();
}

async function handleDrawingPointerEnd(event) {
  if (!state.activeStroke || state.activeStroke.pointerId !== drawingPointerId(event)) return;
  const stroke = {
    uid: state.activeStroke.uid,
    nickname: state.activeStroke.nickname,
    tool: state.activeStroke.tool,
    color: state.activeStroke.color,
    size: state.activeStroke.size,
    points: compactPoints(state.activeStroke.points),
    createdAt: now()
  };
  const { sessionId, groupId, drawingId } = state.activeStroke;
  state.activeStroke = null;
  renderDrawingCanvases();
  if (stroke.points.length < 1) return;
  const strokeId = `s_${now()}_${Math.random().toString(36).slice(2, 7)}`;
  await state.client.setDrawingStroke(state.roomCode, sessionId, groupId, drawingId, strokeId, stroke);
  const session = currentGroupSession();
  if (session?.type === "typingGarticPhone") {
    await state.client.setGroupPhoneEntry(state.roomCode, sessionId, groupId, {
      ...(groupPhoneFor(sessionId, groupId)[state.client.uid] || {}),
      uid: state.client.uid,
      nickname: state.nickname || "참가자",
      drawnAt: now(),
      updatedAt: now()
    });
  }
}

async function undoDrawingStroke(sessionId, groupId, drawingId) {
  const drawing = drawingFor(sessionId, groupId, drawingId);
  const ownStrokes = strokesForDrawing(drawing).filter((stroke) => stroke.uid === state.client.uid);
  const last = ownStrokes[ownStrokes.length - 1];
  if (!last) return;
  await state.client.removeDrawingStroke(state.roomCode, sessionId, groupId, drawingId, last.id);
}

async function clearDrawing(sessionId, groupId, drawingId) {
  await state.client.clearGroupDrawing(state.roomCode, sessionId, groupId, drawingId);
}

async function submitCatchmindGuess(event) {
  event.preventDefault();
  const session = currentGroupSession();
  const group = groupForPlayer();
  const sGroup = sessionGroup(group?.id, session);
  const input = document.getElementById("catchmindGuessInput");
  if (!session || !group || !sGroup || !input) return;
  const text = String(input.value || "").trim();
  if (!text) return;
  const word = getPartyWord(sGroup.promptId);
  const previous = groupGuessesFor(session.id, group.id)[state.client.uid] || {};
  const attempt = {
    text,
    isCorrect: isCorrectGuess(text, word),
    nickname: state.nickname || "참가자",
    uid: state.client.uid,
    createdAt: now()
  };
  const attempts = [...(previous.attempts || []), attempt].slice(-12);
  await Promise.all([
    state.client.setGroupGuess(state.roomCode, session.id, group.id, {
      uid: state.client.uid,
      nickname: state.nickname || "참가자",
      sessionId: session.id,
      groupId: group.id,
      text,
      isCorrect: attempt.isCorrect,
      attempts,
      updatedAt: now()
    }),
    state.client.setGroupProgress(state.roomCode, session.id, group.id, {
      uid: state.client.uid,
      nickname: state.nickname || "참가자",
      status: attempt.isCorrect ? "completed" : "working",
      detail: attempt.isCorrect ? "정답" : "추측 중",
      completed: attempt.isCorrect ? 1 : 0,
      total: 1,
      updatedAt: now()
    })
  ]);
  input.value = "";
}

async function submitPhonePrompt(event) {
  event.preventDefault();
  const session = currentGroupSession();
  const group = groupForPlayer();
  const input = document.getElementById("phonePromptInput");
  if (!session || !group || !input) return;
  const prompt = String(input.value || "").trim().slice(0, 80);
  if (!prompt) return;
  await state.client.setGroupPhoneEntry(state.roomCode, session.id, group.id, {
    ...(groupPhoneFor(session.id, group.id)[state.client.uid] || {}),
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    prompt,
    promptAt: now(),
    updatedAt: now()
  });
}

async function submitPhoneGuess(event) {
  event.preventDefault();
  const session = currentGroupSession();
  const group = groupForPlayer();
  const input = document.getElementById("phoneGuessInput");
  if (!session || !group || !input) return;
  const guess = String(input.value || "").trim().slice(0, 80);
  if (!guess) return;
  await state.client.setGroupPhoneEntry(state.roomCode, session.id, group.id, {
    ...(groupPhoneFor(session.id, group.id)[state.client.uid] || {}),
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    guess,
    guessAt: now(),
    updatedAt: now()
  });
}

async function reportActivityProgress(payload) {
  const room = state.room;
  if (!room?.meta || state.role !== "student" || room.meta.status !== "activity") return;
  const activity = currentActivity(room);
  const runId = room.meta.currentActivityRunId;
  if (!activity || !runId || !state.client?.setProgress) return;

  await state.client.setProgress(state.roomCode, runId, {
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    activityId: activity.id,
    runId,
    status: payload.status || "opened",
    stageTitle: String(payload.stageTitle || activity.label).slice(0, 80),
    detail: String(payload.detail || "").slice(0, 120),
    completed: Math.max(0, Number(payload.completed || 0)),
    total: Math.max(0, Number(payload.total || 0)),
    updatedAt: now()
  });
}

async function removeRoom() {
  if (state.role !== "host") return;
  if (!window.confirm("이 방을 삭제할까요?")) return;
  await state.client.removeRoom(state.roomCode);
  showStart();
}

async function handleAction(button) {
  const action = button.dataset.action;
  try {
    if (action === "start-world") await startWorld();
    if (action === "open-world-station") await openWorldStation();
    if (action === "gather-world") await gatherWorldPlayers();
    if (action === "toggle-world-lock") await toggleWorldLock();
    if (action === "select-world-avatar") {
      state.selectedWorldAvatar = button.dataset.avatarId || WORLD_AVATARS[0].id;
      renderWorldPanel();
    }
    if (action === "enter-world-avatar") await enterWorldAvatar();
    if (action === "enter-world-station") await enterWorldStation(button.dataset.stationId);
    if (action === "move-world") await moveWorldPlayer(button.dataset.dir);
    if (action === "toggle-world-help") await toggleWorldHelp();
    if (action === "world-emote") await sendWorldEmote(button.dataset.emote || "");
    if (action === "complete-world-social") await completeWorldStation(currentWorldStation());
    if (action === "start-catchmind") await startGroupGame("typingCatchmind");
    if (action === "start-gartic-phone") await startGroupGame("typingGarticPhone");
    if (action === "next-catchmind-round") await nextCatchmindRound();
    if (action === "advance-gartic-phone") await advanceGarticPhone();
    if (action === "select-drawing-tool") {
      state.drawingTool = button.dataset.tool || "pen";
      if (state.drawingTool === "eraser" && state.drawingSize < ERASER_DEFAULT_SIZE) {
        state.drawingSize = ERASER_DEFAULT_SIZE;
      }
      renderGroupGamePanel();
    }
    if (action === "select-drawing-color") {
      state.drawingColor = button.dataset.color || DRAWING_COLORS[0];
      state.drawingTool = "pen";
      renderGroupGamePanel();
    }
    if (action === "select-drawing-size") {
      state.drawingSize = Number(button.dataset.size || DRAWING_SIZES[0]);
      renderGroupGamePanel();
    }
    if (action === "undo-drawing-stroke") await undoDrawingStroke(button.dataset.sessionId, button.dataset.groupId, button.dataset.drawingId);
    if (action === "clear-drawing") await clearDrawing(button.dataset.sessionId, button.dataset.groupId, button.dataset.drawingId);
    if (action === "start-round") await startRound();
    if (action === "start-activity") await startActivity();
    if (action === "open-submit") await setStage("submit");
    if (action === "open-vote") await setStage("vote");
    if (action === "show-results") await setStage("results");
    if (action === "next-lobby") await nextLobby();
    if (action === "remove-room") await removeRoom();
    if (action === "vote") {
      const round = currentRound();
      if (round) await state.client.setVote(state.roomCode, round.id, button.dataset.categoryId, button.dataset.targetUid);
    }
  } catch (error) {
    setStartStatus(error.message);
  }
}

function handleWorldKeydown(event) {
  if (state.role !== "student" || state.room?.meta?.status !== "world") return;
  const key = String(event.key || "").toLowerCase();
  const directionByKey = {
    arrowleft: "left",
    a: "left",
    arrowright: "right",
    d: "right",
    arrowup: "up",
    w: "up",
    arrowdown: "down",
    s: "down"
  };

  if (!event.ctrlKey && directionByKey[key]) {
    const tagName = event.target?.tagName;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(tagName)) return;
    event.preventDefault();
    moveWorldPlayer(directionByKey[key]).catch((error) => setStartStatus(error.message));
    return;
  }

  if (!event.ctrlKey || !worldPlayer()) return;
  const station = currentWorldStation();
  if (station.type !== "hotkey" || key !== station.key) return;
  event.preventDefault();
  completeWorldStation(station, station.successDetail).catch((error) => setStartStatus(error.message));
}

function isTypingTarget(target) {
  const tagName = target?.tagName;
  return target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(tagName);
}

function handleActivityStartKeydown(event) {
  if (state.role !== "student" || state.room?.meta?.status !== "activity") return;
  if (event.key !== "Enter" || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
  if (isTypingTarget(event.target)) return;

  const launch = document.querySelector("[data-enter-activity-start]");
  if (!launch?.href) return;
  event.preventDefault();
  window.location.href = launch.href;
}

function bindEvents() {
  els.teacherPinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pin = String(els.teacherPinInput.value || "").trim();
    if (pin !== TEACHER_PIN) {
      setTeacherUnlocked(false);
      setStartStatus("교사 PIN이 맞지 않습니다.");
      els.teacherPinInput.select();
      return;
    }
    setStartStatus("");
    setTeacherUnlocked(true);
  });

  els.createRoomButton.addEventListener("click", async () => {
    if (!ensureClientReady()) return;
    if (!state.teacherUnlocked) {
      setStartStatus("교사용 PIN을 먼저 입력하세요.");
      return;
    }
    try {
      els.createRoomButton.disabled = true;
      await createRoom();
    } catch (error) {
      setStartStatus(error.message);
    } finally {
      els.createRoomButton.disabled = false;
    }
  });

  els.joinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ensureClientReady()) return;
    await joinRoom(els.roomCodeInput.value, els.nicknameInput.value);
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (button) handleAction(button);
  });

  document.addEventListener("submit", (event) => {
    if (event.target.id === "answerForm") submitAnswer(event);
    if (event.target.id === "worldTypingForm") submitWorldTyping(event);
    if (event.target.id === "catchmindGuessForm") submitCatchmindGuess(event);
    if (event.target.id === "phonePromptForm") submitPhonePrompt(event);
    if (event.target.id === "phoneGuessForm") submitPhoneGuess(event);
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "gameTypeSelect") {
      state.selectedGame = event.target.value;
    }
    if (event.target.id === "activitySelect") {
      state.selectedActivity = event.target.value;
    }
    if (event.target.id === "worldStationSelect") {
      state.selectedWorldStation = event.target.value;
    }
  });

  document.addEventListener("keydown", handleActivityStartKeydown);
  document.addEventListener("keydown", handleWorldKeydown);
  document.addEventListener("pointerdown", handleDrawingPointerDown);
  document.addEventListener("pointermove", handleDrawingPointerMove);
  document.addEventListener("pointerout", hideDrawingCursor);
  document.addEventListener("pointerup", (event) => {
    handleDrawingPointerEnd(event).catch((error) => setStartStatus(error.message));
  });
  document.addEventListener("pointercancel", (event) => {
    handleDrawingPointerEnd(event).catch((error) => setStartStatus(error.message));
  });
  document.addEventListener("mousedown", handleDrawingPointerDown);
  document.addEventListener("mousemove", handleDrawingPointerMove);
  document.addEventListener("mouseout", hideDrawingCursor);
  document.addEventListener("mouseup", (event) => {
    handleDrawingPointerEnd(event).catch((error) => setStartStatus(error.message));
  });

  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "typing-party-progress") return;
    reportActivityProgress(event.data).catch((error) => setStartStatus(error.message));
  });

  if ("BroadcastChannel" in window) {
    state.activityProgressChannel = new BroadcastChannel(ACTIVITY_PROGRESS_CHANNEL);
    state.activityProgressChannel.addEventListener("message", (event) => {
      const message = event.data || {};
      if (message.type !== "typing-party-progress-relay") return;
      if (message.roomCode !== state.roomCode) return;
      if (message.runId !== state.room?.meta?.currentActivityRunId) return;
      reportActivityProgress(message.payload || {}).catch((error) => setStartStatus(error.message));
    });
  }

  els.roomCodeInput.addEventListener("input", () => {
    els.roomCodeInput.value = normalizeRoomCode(els.roomCodeInput.value);
  });
}

async function initClient() {
  if (useMock) {
    const { createMockClient } = await import("./mock-realtime.js");
    return createMockClient({ reset: resetMock, uid: mockUid });
  }
  return createFirebaseClient();
}

async function init() {
  bindEvents();
  setEntryDisabled(true);
  const roomFromUrl = normalizeRoomCode(params.get("room"));
  if (roomFromUrl) els.roomCodeInput.value = roomFromUrl;

  try {
    setConnection("연결 중");
    state.client = await initClient();
    setConnection(useMock ? "Mock" : "Firebase", "ready");
    setEntryDisabled(false);
  } catch (error) {
    setConnection("설정 필요", "error");
    setStartStatus(error.message);
    setEntryDisabled(true);
    return;
  }

  if (!roomFromUrl) return;
  const room = await state.client.getRoom(roomFromUrl);
  if (room?.meta?.hostUid === state.client.uid) {
    state.nickname = "선생님";
    enterRoom(roomFromUrl, "host");
    return;
  }
  const autoJoinNickname = normalizeNickname(params.get("nickname"));
  if (useMock && params.get("autojoin") === "1" && room && autoJoinNickname) {
    await joinRoom(roomFromUrl, autoJoinNickname);
    return;
  }
  if (room) {
    els.nicknameInput.focus();
  } else {
    setStartStatus("방 코드를 확인하고 닉네임을 입력하세요.");
  }
}

init();
