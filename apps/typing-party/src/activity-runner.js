import { getTrackedActivity } from "./game-data.js";
import { createFirebaseClient } from "./firebase-client.js";

const CHANNEL_NAME = "typingParty.activity.progress.v1";
const params = new URLSearchParams(window.location.search);
const useMock = params.get("mock") === "1";
const roomCode = normalizeRoomCode(params.get("room") || params.get("partyRoom"));
const activityId = params.get("activity") || "";
const runId = params.get("activityRun") || "";
const mockUid = params.get("uid") || "";

const state = {
  client: null,
  activity: null,
  nickname: params.get("nickname") || "참가자",
  channel: "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null,
  unsubscribeRoom: null,
  returning: false
};

const els = {
  title: document.getElementById("activityTitle"),
  status: document.getElementById("runnerStatus"),
  frame: document.getElementById("activityFrame"),
  returnLink: document.getElementById("returnLink")
};

function normalizeRoomCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

function setStatus(message, kind = "") {
  els.status.textContent = message;
  els.status.classList.toggle("is-error", kind === "error");
  els.status.classList.toggle("is-ready", kind === "ready");
}

function buildReturnUrl() {
  const url = new URL("index.html", window.location.href);
  if (roomCode) url.searchParams.set("room", roomCode);
  if (state.nickname) {
    url.searchParams.set("nickname", state.nickname);
    url.searchParams.set("autojoin", "1");
  }
  if (useMock) url.searchParams.set("mock", "1");
  if (useMock && mockUid) url.searchParams.set("uid", mockUid);
  return url.href;
}

function buildActivityUrl(activity) {
  const url = new URL(activity.path, window.location.href);
  url.searchParams.set("partyRoom", roomCode);
  url.searchParams.set("activityRun", runId);
  if (useMock) url.searchParams.set("mock", "1");
  return url.href;
}

async function initClient() {
  if (useMock) {
    const { createMockClient } = await import("./mock-realtime.js");
    return createMockClient({ uid: mockUid });
  }
  return createFirebaseClient();
}

async function hydrateNickname() {
  if (!state.client || !roomCode) return;
  const room = await state.client.getRoom(roomCode);
  const player = room?.players?.[state.client.uid];
  if (player?.nickname) state.nickname = player.nickname;
}

function relayProgress(payload) {
  const message = {
    type: "typing-party-progress-relay",
    roomCode,
    runId,
    activityId,
    payload
  };
  if (state.channel) state.channel.postMessage(message);
}

function returnToRoom(reason = "대기실로 돌아가는 중") {
  if (state.returning) return;
  state.returning = true;
  if (state.unsubscribeRoom) state.unsubscribeRoom();
  setStatus(reason, "ready");
  window.location.replace(buildReturnUrl());
}

function subscribeRoomControl() {
  if (!state.client || !roomCode) return;
  if (state.unsubscribeRoom) state.unsubscribeRoom();
  state.unsubscribeRoom = state.client.subscribeRoom(roomCode, (room) => {
    if (!room?.meta) {
      returnToRoom("방으로 돌아가는 중");
      return;
    }
    const currentRunId = room.meta.currentActivityRunId || "";
    if (room.meta.status !== "activity" || currentRunId !== runId) {
      returnToRoom("활동 종료");
    }
  });
}

async function reportProgress(payload) {
  if (!state.client || !state.activity || !roomCode || !runId) return;
  const progress = {
    uid: state.client.uid,
    nickname: state.nickname || "참가자",
    activityId: state.activity.id,
    runId,
    status: payload.status || "opened",
    stageTitle: String(payload.stageTitle || state.activity.label).slice(0, 80),
    detail: String(payload.detail || "").slice(0, 120),
    completed: Math.max(0, Number(payload.completed || 0)),
    total: Math.max(0, Number(payload.total || 0)),
    updatedAt: Date.now()
  };
  await state.client.setProgress(roomCode, runId, progress);
  relayProgress(progress);
  setStatus("진행 기록 중", "ready");
}

async function init() {
  els.returnLink.href = buildReturnUrl();
  state.activity = getTrackedActivity(activityId);
  if (!state.activity || !roomCode || !runId) {
    els.title.textContent = "활동을 열 수 없음";
    setStatus("주소 확인", "error");
    return;
  }

  els.title.textContent = state.activity.label;
  document.title = `${state.activity.label} · 타이핑 파티`;

  try {
    state.client = await initClient();
    await hydrateNickname();
    els.returnLink.href = buildReturnUrl();
    await reportProgress({
      status: "opened",
      stageTitle: state.activity.label,
      detail: "활동 화면 열림",
      completed: 0,
      total: 0
    });
    subscribeRoomControl();
    els.frame.src = buildActivityUrl(state.activity);
  } catch (error) {
    setStatus("설정 필요", "error");
    els.title.textContent = error.message;
  }
}

window.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "typing-party-progress") return;
  reportProgress(event.data).catch((error) => setStatus(error.message, "error"));
});

init();
