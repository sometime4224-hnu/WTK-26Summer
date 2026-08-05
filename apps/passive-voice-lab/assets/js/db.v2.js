export const DB_NAME = "korean3b-passive-voice-v2";
let opening;
export function openCourseDb() {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { const db = request.result; db.createObjectStore("recordings", { keyPath: "id" }); db.createObjectStore("attempts", { keyPath: "id" }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("기기 저장소를 열지 못했어요."));
  });
  return opening;
}
function result(request) { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
export async function saveRecording(blob, mimeType) { const db = await openCourseDb(); const record = { id: `rec-v2-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`, blob, mimeType: mimeType || blob.type || "audio/webm", size: blob.size, createdAt: new Date().toISOString() }; const tx = db.transaction("recordings", "readwrite"); tx.objectStore("recordings").put(record); await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); }); return record; }
export async function getRecording(id) { if (!id) return null; const db = await openCourseDb(); return result(db.transaction("recordings").objectStore("recordings").get(id)); }
export async function deleteRecording(id) { if (!id) return; const db = await openCourseDb(); const tx = db.transaction("recordings", "readwrite"); tx.objectStore("recordings").delete(id); await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); }); }
export async function saveAttempt(attempt) { const db = await openCourseDb(); const tx = db.transaction("attempts", "readwrite"); tx.objectStore("attempts").put({ ...attempt, id: attempt.id ?? `attempt-v2-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`, savedAt: new Date().toISOString() }); await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); }); }
export async function getAllAttempts() { const db = await openCourseDb(); return result(db.transaction("attempts").objectStore("attempts").getAll()); }
