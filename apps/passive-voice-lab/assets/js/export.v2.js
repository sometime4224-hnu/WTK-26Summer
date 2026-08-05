import { strToU8, unzipSync, zip } from "../vendor/fflate.esm.js";
import { getAllAttempts, getRecording } from "./db.v2.js";
const MAX_AUDIO = 25 * 1024 * 1024;
const zipAsync = (files) => new Promise((resolve, reject) => zip(files, { level: 6 }, (error, data) => error ? reject(error) : resolve(data)));
export function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.rel = "noopener"; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 2500); }
export function exportFilename() { return `pidong-explorers-v2-${new Date().toISOString().slice(0, 10)}.zip`; }
export function verifyResultArchive(verified) { for (const file of ["understanding-results.json", "free-production.json", "writing.txt"]) if (!verified[file]) throw new Error(`ZIP 확인 실패: ${file}`); return true; }
export async function createResultZipFrom(state, summaries, { attempts = [], recording = null } = {}) {
  const includeAudio = Boolean(recording?.blob && recording.blob.size <= MAX_AUDIO);
  const results = { contentVersion: state.contentVersion, exportedAt: new Date().toISOString(), understanding: { responses: state.responses, attempts, summaries }, freeProduction: { speaking: { ...state.speaking, recordingId: includeAudio ? "speaking.webm" : null }, writing: state.writing } };
  const files = { "understanding-results.json": strToU8(JSON.stringify(results.understanding, null, 2)), "free-production.json": strToU8(JSON.stringify(results.freeProduction, null, 2)), "writing.txt": strToU8(`[초고]\n${state.writing.draft || "(없음)"}\n\n[수정본]\n${state.writing.revised || "(없음)"}`), "README.txt": strToU8(`피동 탐험대 2.0 내보내기\ncontentVersion: ${state.contentVersion}\n이해 결과와 자유 산출은 분리되어 있습니다.`) };
  if (includeAudio) files["speaking.webm"] = [new Uint8Array(await recording.blob.arrayBuffer()), { level: 0 }];
  const bytes = await zipAsync(files); const verified = unzipSync(bytes); verifyResultArchive(verified);
  return { blob: new Blob([bytes], { type: "application/zip" }), recording, recordingIncluded: includeAudio, recordingTooLarge: Boolean(recording?.blob && !includeAudio) };
}
export async function createResultZip(state, summaries) { return createResultZipFrom(state, summaries, { attempts: await getAllAttempts().catch(() => []), recording: await getRecording(state.speaking.recordingId).catch(() => null) }); }
