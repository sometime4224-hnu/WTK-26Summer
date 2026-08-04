const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const rulesPath = path.join(__dirname, '..', '..', 'shared', 'homework-firestore-rules.example.rules');
const rules = fs.readFileSync(rulesPath, 'utf8');

function representativeWriting(payload) {
  const only = ['assignmentId', 'assignmentTitle', 'chapter', 'sectionId', 'sectionTitle', 'submissionKind', 'studentName', 'responseText', 'responseCharacterCount', 'minCharacterCount', 'maxCharacterCount', 'completed', 'clientSubmittedAt', 'signatureHash', 'anonymousUid', 'submittedAt'];
  const stripped = String(payload.responseText || '').replace(/\r|\n/g, '');
  return Object.keys(payload).every((key) => only.includes(key))
    && payload.assignmentId === 'review5-long-writing-v1'
    && payload.chapter === 'review5' && payload.sectionId === 'longWriting'
    && payload.submissionKind === 'writing' && payload.completed === true
    && Number.isInteger(payload.responseCharacterCount)
    && payload.minCharacterCount === 400 && payload.maxCharacterCount === 500
    && stripped.length >= 400 && stripped.length <= 500 && stripped.length === payload.responseCharacterCount;
}

test('Review 5 rules contain exact quiz mappings and a strict writing contract', () => {
  for (const [id, section, total] of [['review5-confirm-v1', 'confirm', 19], ['review5-evaluate-v1', 'evaluate', 17], ['review5-listening-v1', 'listening', 16], ['review5-reading-writing-v1', 'readingWriting', 15]]) {
    expect(rules).toContain(`"${id}"`);
    expect(rules).toContain(`"${section}"`);
    expect(rules).toContain(`? ${total}`);
  }
  expect(rules).toContain('keys().hasAll([');
  expect(rules).toContain('keys().hasOnly([');
  expect(rules).toContain('responseText.replace("\\r", "").replace("\\n", "").size()');
  expect(rules).toContain('request.resource.data.submissionKind == "writing"');
});

test('offline contract examples reject the invalid writing shapes (no emulator is used)', () => {
  const valid = { assignmentId: 'review5-long-writing-v1', assignmentTitle: '복습 5 장문 쓰기', chapter: 'review5', sectionId: 'longWriting', sectionTitle: '장문 쓰기', submissionKind: 'writing', studentName: '김학생', responseText: '가'.repeat(400), responseCharacterCount: 400, minCharacterCount: 400, maxCharacterCount: 500, completed: true, clientSubmittedAt: '2026-01-01T00:00:00.000Z', signatureHash: 'x', anonymousUid: 'u', submittedAt: 'timestamp' };
  expect(representativeWriting(valid)).toBeTruthy();
  expect(representativeWriting({ ...valid, assignmentId: 'wrong' })).toBeFalsy();
  expect(representativeWriting({ ...valid, sectionId: 'confirm' })).toBeFalsy();
  expect(representativeWriting({ ...valid, responseCharacterCount: 399 })).toBeFalsy();
  expect(representativeWriting({ ...valid, responseText: '가'.repeat(399), responseCharacterCount: 399 })).toBeFalsy();
  expect(representativeWriting({ ...valid, score: 100 })).toBeFalsy();
});
