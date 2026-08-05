import { strToU8, unzipSync, zip } from "../vendor/fflate.esm.js";
import { V1_STATE_KEY } from "./storage.v2.js";
const legacyDb = "kr-passive-v1";
const zipAsync = (files) => new Promise((resolve, reject) => zip(files, { level: 6 }, (error, data) => error ? reject(error) : resolve(data)));
function dbRead(storeName) { return new Promise((resolve) => { const request = indexedDB.open(legacyDb); request.onerror = () => resolve([]); request.onsuccess = () => { const db = request.result; if (!db.objectStoreNames.contains(storeName)) return resolve([]); const tx = db.transaction(storeName, "readonly"); const get = tx.objectStore(storeName).getAll(); get.onsuccess = () => resolve(get.result ?? []); get.onerror = () => resolve([]); }; }); }
export function detectLegacyState() { try { const raw = localStorage.getItem(V1_STATE_KEY); if (!raw) return null; try { return { raw, state: JSON.parse(raw) }; } catch { return { raw, state: {} }; } } catch { return null; } }
export function verifyLegacyArchive(verified) { for (const name of ["v1-state.json", "v1-attempts.json", "v1-writing.json"]) if (!verified[name]) throw new Error(`보관 ZIP 확인 실패: ${name}`); return true; }
export async function createLegacyBackupFrom(legacy, { attempts = [], recordings = [] } = {}) {
  if (!legacy?.raw) throw new Error("이전 학습 기록을 찾지 못했어요.");
  const files = { "v1-state.json": strToU8(legacy.raw), "v1-attempts.json": strToU8(JSON.stringify(attempts, null, 2)), "v1-writing.json": strToU8(JSON.stringify(legacy.state.writing ?? {}, null, 2)), "README.txt": strToU8("피동 탐험대 1.x 보관본입니다. 원래 기록은 삭제되지 않았습니다.") };
  const recording = recordings.find((entry) => entry.id === legacy.state.speaking?.recordingId);
  if (recording?.blob) files["v1-speaking.webm"] = [new Uint8Array(await recording.blob.arrayBuffer()), { level: 0 }];
  const bytes = await zipAsync(files); const verified = unzipSync(bytes); verifyLegacyArchive(verified);
  return { blob: new Blob([bytes], { type: "application/zip" }), recoveryJson: legacy.raw, includedRecording: Boolean(recording?.blob) };
}
export async function createLegacyBackup() { const legacy = detectLegacyState(); return createLegacyBackupFrom(legacy, { attempts: await dbRead("attempts"), recordings: await dbRead("recordings") }); }
