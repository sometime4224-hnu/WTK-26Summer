const STORAGE_KEY = "typingParty.mock.rooms.v1";
const UID_KEY = "typingParty.mock.uid.v1";
const CHANNEL_NAME = "typingParty.mock.broadcast.v1";

function createUid() {
  return `mock_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function normalizeUid(value) {
  return String(value || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 96);
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

function setByPath(target, path, value) {
  const parts = path.split("/").filter(Boolean);
  let cursor = target;
  parts.slice(0, -1).forEach((part) => {
    if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
    cursor = cursor[part];
  });
  cursor[parts[parts.length - 1]] = value;
}

export async function createMockClient({ reset = false, uid: requestedUid = "" } = {}) {
  if (reset) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  let uid = normalizeUid(requestedUid) || window.sessionStorage.getItem(UID_KEY);
  if (!uid) {
    uid = createUid();
  }
  window.sessionStorage.setItem(UID_KEY, uid);

  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

  function notify() {
    if (channel) channel.postMessage({ type: "change" });
  }

  function mutate(mutator) {
    const rooms = readRooms();
    mutator(rooms);
    writeRooms(rooms);
    notify();
  }

  return {
    uid,
    mode: "mock",

    async createRoom(roomCode, room) {
      mutate((rooms) => {
        rooms[roomCode] = room;
      });
    },

    async getRoom(roomCode) {
      return readRooms()[roomCode] || null;
    },

    async updateRoom(roomCode, updates) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        Object.entries(updates).forEach(([path, value]) => setByPath(rooms[roomCode], path, value));
      });
    },

    async setPlayer(roomCode, player) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].players) rooms[roomCode].players = {};
        rooms[roomCode].players[uid] = player;
      });
    },

    async setSubmission(roomCode, roundId, submission) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].submissions) rooms[roomCode].submissions = {};
        if (!rooms[roomCode].submissions[roundId]) rooms[roomCode].submissions[roundId] = {};
        rooms[roomCode].submissions[roundId][uid] = submission;
      });
    },

    async setVote(roomCode, roundId, categoryId, targetUid) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].votes) rooms[roomCode].votes = {};
        if (!rooms[roomCode].votes[roundId]) rooms[roomCode].votes[roundId] = {};
        if (!rooms[roomCode].votes[roundId][categoryId]) rooms[roomCode].votes[roundId][categoryId] = {};
        rooms[roomCode].votes[roundId][categoryId][uid] = targetUid;
      });
    },

    async setProgress(roomCode, runId, progress) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].progress) rooms[roomCode].progress = {};
        if (!rooms[roomCode].progress[runId]) rooms[roomCode].progress[runId] = {};
        rooms[roomCode].progress[runId][uid] = progress;
      });
    },

    async setWorldPlayer(roomCode, playerState) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].world) rooms[roomCode].world = {};
        if (!rooms[roomCode].world.players) rooms[roomCode].world.players = {};
        rooms[roomCode].world.players[uid] = playerState;
      });
    },

    async setWorldProgress(roomCode, stationId, progress) {
      mutate((rooms) => {
        if (!rooms[roomCode]) rooms[roomCode] = {};
        if (!rooms[roomCode].world) rooms[roomCode].world = {};
        if (!rooms[roomCode].world.progress) rooms[roomCode].world.progress = {};
        if (!rooms[roomCode].world.progress[stationId]) rooms[roomCode].world.progress[stationId] = {};
        rooms[roomCode].world.progress[stationId][uid] = progress;
      });
    },

    async removeRoom(roomCode) {
      mutate((rooms) => {
        delete rooms[roomCode];
      });
    },

    subscribeRoom(roomCode, onChange) {
      const emit = () => onChange(readRooms()[roomCode] || null);
      const onStorage = (event) => {
        if (event.key === STORAGE_KEY) emit();
      };
      const onCustom = () => emit();
      const onBroadcast = () => emit();

      window.addEventListener("storage", onStorage);
      window.addEventListener("typing-party-mock-change", onCustom);
      if (channel) channel.addEventListener("message", onBroadcast);
      emit();

      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("typing-party-mock-change", onCustom);
        if (channel) channel.removeEventListener("message", onBroadcast);
      };
    }
  };
}
