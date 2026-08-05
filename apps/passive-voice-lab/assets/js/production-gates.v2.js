export function koreanSentenceCount(value) { const text=String(value??"").trim(); if(!text)return 0; const terminal=text.split(/[.!?…。]+/).map((part)=>part.trim()).filter(Boolean); if(terminal.length>1||/[.!?…。]\s*$/.test(text))return terminal.length; return text.split(/\n+/).map((part)=>part.trim()).filter(Boolean).length||1; }
export function isFourToSixSentences(value) { const count=koreanSentenceCount(value); return count>=4&&count<=6; }
export function canDraftWriting(writing) { return Boolean(writing.reader&&writing.purpose); }
export function canOpenWritingModel(writing) { return canDraftWriting(writing)&&isFourToSixSentences(writing.draft); }
export function canStartWritingRevision(writing, checklist) { return Boolean(canOpenWritingModel(writing)&&writing.modelOpened&&checklist.every((item)=>writing.checklist?.includes(item.id))); }
export function canFinalizeWriting(writing, checklist) { return Boolean(canStartWritingRevision(writing,checklist)&&isFourToSixSentences(writing.revised)); }
