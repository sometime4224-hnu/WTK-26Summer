export const ACTIVE_RECORDER_STATES=new Set(["requesting","recording","stopping","persisting"]);
export function isRecorderActive(recorder) { return Boolean(recorder&&ACTIVE_RECORDER_STATES.has(recorder.state)); }
export class SpeakingOperationGate {
  constructor() { this.token = 0; this.busy = false; }
  begin() { if (this.busy) return null; this.busy = true; return ++this.token; }
  isCurrent(token) { return this.busy && token === this.token; }
  finish(token) { if (!this.isCurrent(token)) return false; this.busy = false; return true; }
  invalidate() { this.token += 1; this.busy = false; }
}
export async function replaceRecordingTransaction({oldMetadata,newRecord,apply,restore,flush,deleteBlob,addPending}) { apply(newRecord); if(!await flush()){restore(oldMetadata); try{await deleteBlob(newRecord.id)}catch{addPending(newRecord.id)}return {ok:false,reason:"flush-failed"};}if(!oldMetadata.recordingId)return {ok:true};try{await deleteBlob(oldMetadata.recordingId);return {ok:true};}catch{addPending(oldMetadata.recordingId);return {ok:true,pendingDeletionId:oldMetadata.recordingId};} }
export async function clearRecordingTransaction({oldMetadata,clear,restore,flush,deleteBlob,addPending}) { clear(); if(!await flush()){restore(oldMetadata);return {ok:false,reason:"flush-failed"};}if(!oldMetadata.recordingId)return {ok:true};try{await deleteBlob(oldMetadata.recordingId);return {ok:true};}catch{addPending(oldMetadata.recordingId);return {ok:true,pendingDeletionId:oldMetadata.recordingId};} }
export async function retryPendingDeletions(ids, deleteBlob) { const pending=[];for(const id of ids??[]){try{await deleteBlob(id)}catch{pending.push(id)}}return pending; }
export function pendingIdsAfterSpeakingReset(existingIds, failedCurrentId = null) { return [...new Set([...(existingIds??[]),...(failedCurrentId?[failedCurrentId]:[])])]; }
export function canAttachRequestedRecording(requestedId, currentId, renderedId) { return Boolean(requestedId&&requestedId===currentId&&requestedId===renderedId); }
export async function persistSelfCheckTransaction({prior,apply,restore,flush}) { apply();if(await flush())return {ok:true};restore(prior);return {ok:false,reason:"flush-failed"}; }
