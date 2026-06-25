const FIREBASE_VERSION = "12.15.0";

function assertConfig(config) {
  if (!config || !config.apiKey || config.apiKey.includes("YOUR_")) {
    throw new Error("Firebase 설정이 없습니다. src/firebase-config.js를 만들어 주세요.");
  }
}

function trimSlashes(value) {
  return String(value || "typingParty").replace(/^\/+|\/+$/g, "") || "typingParty";
}

export async function createFirebaseClient() {
  const configModule = await import("./firebase-config.js").catch(() => {
    throw new Error("Firebase 설정 파일을 찾을 수 없습니다. src/firebase-config.example.js를 복사해 src/firebase-config.js를 만드세요.");
  });

  const { firebaseConfig, databaseRoot } = configModule;
  assertConfig(firebaseConfig);

  const [{ initializeApp }, authModule, databaseModule] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
  ]);

  const { getAuth, signInAnonymously } = authModule;
  const { getDatabase, ref, set, update, get, onValue, off, remove } = databaseModule;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const credential = await signInAnonymously(auth);
  const database = getDatabase(app);
  const root = trimSlashes(databaseRoot);
  const uid = credential.user.uid;

  function roomPath(roomCode) {
    return `${root}/rooms/${roomCode}`;
  }

  return {
    uid,
    mode: "firebase",

    async createRoom(roomCode, room) {
      await set(ref(database, roomPath(roomCode)), room);
    },

    async getRoom(roomCode) {
      const snapshot = await get(ref(database, roomPath(roomCode)));
      return snapshot.exists() ? snapshot.val() : null;
    },

    async updateRoom(roomCode, updates) {
      await update(ref(database, roomPath(roomCode)), updates);
    },

    async setPlayer(roomCode, player) {
      await set(ref(database, `${roomPath(roomCode)}/players/${uid}`), player);
    },

    async setSubmission(roomCode, roundId, submission) {
      await set(ref(database, `${roomPath(roomCode)}/submissions/${roundId}/${uid}`), submission);
    },

    async setVote(roomCode, roundId, categoryId, targetUid) {
      await set(ref(database, `${roomPath(roomCode)}/votes/${roundId}/${categoryId}/${uid}`), targetUid);
    },

    async setProgress(roomCode, runId, progress) {
      await set(ref(database, `${roomPath(roomCode)}/progress/${runId}/${uid}`), progress);
    },

    async setWorldPlayer(roomCode, playerState) {
      await set(ref(database, `${roomPath(roomCode)}/world/players/${uid}`), playerState);
    },

    async setWorldProgress(roomCode, stationId, progress) {
      await set(ref(database, `${roomPath(roomCode)}/world/progress/${stationId}/${uid}`), progress);
    },

    async setDrawingStroke(roomCode, sessionId, groupId, drawingId, strokeId, stroke) {
      await set(ref(database, `${roomPath(roomCode)}/drawings/${sessionId}/${groupId}/${drawingId}/strokes/${strokeId}`), stroke);
    },

    async removeDrawingStroke(roomCode, sessionId, groupId, drawingId, strokeId) {
      await remove(ref(database, `${roomPath(roomCode)}/drawings/${sessionId}/${groupId}/${drawingId}/strokes/${strokeId}`));
    },

    async clearGroupDrawing(roomCode, sessionId, groupId, drawingId) {
      await set(ref(database, `${roomPath(roomCode)}/drawings/${sessionId}/${groupId}/${drawingId}`), {
        clearedAt: Date.now(),
        clearedBy: uid,
        strokes: {}
      });
    },

    async setGroupGuess(roomCode, sessionId, groupId, guess) {
      await set(ref(database, `${roomPath(roomCode)}/groupGuesses/${sessionId}/${groupId}/${uid}`), guess);
    },

    async setGroupProgress(roomCode, sessionId, groupId, progress) {
      await set(ref(database, `${roomPath(roomCode)}/groupProgress/${sessionId}/${groupId}/${uid}`), progress);
    },

    async setGroupPhoneEntry(roomCode, sessionId, groupId, entry) {
      await set(ref(database, `${roomPath(roomCode)}/groupPhone/${sessionId}/${groupId}/${uid}`), entry);
    },

    async removeRoom(roomCode) {
      await remove(ref(database, roomPath(roomCode)));
    },

    subscribeRoom(roomCode, onChange) {
      const roomRef = ref(database, roomPath(roomCode));
      const unsubscribe = onValue(roomRef, (snapshot) => {
        onChange(snapshot.exists() ? snapshot.val() : null);
      });
      return unsubscribe || (() => off(roomRef));
    }
  };
}
