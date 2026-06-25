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
import { createFirebaseClient } from "./firebase-client.js";

const params = new URLSearchParams(window.location.search);
const useMock = params.get("mock") === "1";
const resetMock = params.get("reset") === "1";

const state = {
  client: null,
  room: null,
  roomCode: "",
  role: "",
  nickname: "",
  selectedGame: "randomBox",
  selectedActivity: "keyboard-lesson",
  unsubscribe: null
};

const els = {
  startScreen: document.getElementById("startScreen"),
  roomScreen: document.getElementById("roomScreen"),
  connectionChip: document.getElementById("connectionChip"),
  createRoomButton: document.getElementById("createRoomButton"),
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
}

function setEntryDisabled(disabled) {
  els.createRoomButton.disabled = disabled;
  els.joinForm.querySelector("button").disabled = disabled;
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

  let body = "";
  if (stage === "lobby") {
    body = `
      <label>
        <span>게임 선택</span>
        <select id="gameTypeSelect" data-testid="game-select">${gameOptions}</select>
      </label>
      <button class="primary-button" type="button" data-action="start-round" data-testid="start-round">라운드 준비</button>
      <label>
        <span>개인 활동 선택</span>
        <select id="activitySelect" data-testid="activity-select">${activityOptions}</select>
      </label>
      <button class="secondary-button" type="button" data-action="start-activity" data-testid="start-activity">선택 활동 띄우기</button>
    `;
  } else if (stage === "activity") {
    const activity = currentActivity();
    body = `
      <p class="field-note">${escapeHtml(activity?.label || "개인 활동")} 진행 상황을 관찰하는 중입니다.</p>
      <button class="primary-button" type="button" data-action="next-lobby" data-testid="close-activity">활동 종료 · 대기실</button>
    `;
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

function buildActivityUrl(activity, runId) {
  const url = new URL(activity.path, window.location.href);
  url.searchParams.set("partyRoom", state.roomCode);
  url.searchParams.set("activityRun", runId || "");
  if (useMock) url.searchParams.set("mock", "1");
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

  const frameUrl = buildActivityUrl(activity, runId);
  if (els.promptPanel.dataset.activityRunId === runId && els.promptPanel.querySelector(".activity-frame")) {
    return;
  }

  els.promptPanel.dataset.activityRunId = runId || "";
  els.promptPanel.innerHTML = `
    <section class="activity-student" data-testid="activity-student">
      <div class="activity-monitor__head">
        <div>
          <span class="category-badge">지금 할 활동</span>
          <h2>${escapeHtml(activity.label)}</h2>
          <p>${escapeHtml(activity.summary)}</p>
        </div>
        <a class="secondary-button" href="${escapeHtml(frameUrl)}" target="_blank" rel="noopener">새 탭</a>
      </div>
      <iframe class="activity-frame" data-testid="activity-frame" src="${escapeHtml(frameUrl)}" title="${escapeHtml(activity.label)}"></iframe>
    </section>
  `;
}

function renderRoom() {
  const room = state.room;
  if (!room?.meta) return;
  const stage = room.meta.status || "lobby";
  const round = currentRound(room);
  const activity = currentActivity(room);
  const joinUrl = buildJoinUrl(state.roomCode);

  els.roleLabel.textContent = state.role === "host" ? "Teacher" : "Student";
  els.roomTitle.textContent = state.role === "host" ? "교사용 진행 화면" : "학생 참가 화면";
  els.roomSubtitle.textContent = stage === "lobby"
    ? "참가자를 기다리는 중입니다."
    : stage === "activity"
      ? `${activity?.label || "개인 활동"} 진행 중입니다.`
      : `${getGameLabel(round?.gameType)} 진행 중입니다.`;
  els.roomCodeDisplay.textContent = state.roomCode;
  els.joinLink.href = joinUrl;
  els.joinLink.textContent = "입장 링크";
  els.roundKicker.textContent = stage === "activity" ? "Tracked Activity" : round ? getGameLabel(round.gameType) : "Lobby";
  els.stageTitle.textContent = STAGES[stage] || STAGES.lobby;
  els.stageChip.textContent = stage;

  renderPlayers();
  renderHostControls(stage, round);
  if (stage === "activity") {
    renderActivityPanel(activity, room.meta.currentActivityRunId);
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

async function startRound() {
  const room = state.room;
  if (!room?.meta || state.role !== "host") return;
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

function bindEvents() {
  els.createRoomButton.addEventListener("click", async () => {
    if (!ensureClientReady()) return;
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
  });

  document.addEventListener("change", (event) => {
    if (event.target.id === "gameTypeSelect") {
      state.selectedGame = event.target.value;
    }
    if (event.target.id === "activitySelect") {
      state.selectedActivity = event.target.value;
    }
  });

  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "typing-party-progress") return;
    reportActivityProgress(event.data).catch((error) => setStartStatus(error.message));
  });

  els.roomCodeInput.addEventListener("input", () => {
    els.roomCodeInput.value = normalizeRoomCode(els.roomCodeInput.value);
  });
}

async function initClient() {
  if (useMock) {
    const { createMockClient } = await import("./mock-realtime.js");
    return createMockClient({ reset: resetMock });
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
  if (room) {
    els.nicknameInput.focus();
  } else {
    setStartStatus("방 코드를 확인하고 닉네임을 입력하세요.");
  }
}

init();
