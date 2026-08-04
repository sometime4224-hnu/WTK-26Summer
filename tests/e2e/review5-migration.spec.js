const { test, expect } = require('@playwright/test');

test('migrates compatible versionless progress without deleting legacy data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:progress:confirm', JSON.stringify({ answers: { c1: '1' }, currentIndex: 0, choiceOrder: { c1: ['1', '2', '3', '4', '5', '6'] } }));
    localStorage.setItem('snukorean:review5:attempts:confirm', JSON.stringify([]));
  });
  await page.goto('/review/review5-html/confirm.html');
  const state = await page.evaluate(() => ({ legacy: localStorage.getItem('snukorean:review5:progress:confirm'), v2: JSON.parse(localStorage.getItem('snukorean:review5:v2:progress:confirm')) }));
  expect(state.legacy).toContain('"c1"');
  expect(state.v2.schemaVersion).toBe(2);
  expect(state.v2.answers.c1).toBe('1');
});

test('confirmed reset removes migrated legacy records so reload does not resurrect work', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.__review5LegacyResetSetup) {
      sessionStorage.__review5LegacyResetSetup = '1';
      localStorage.clear();
      localStorage.setItem('snukorean:review5:progress:confirm', JSON.stringify({ answers: { c1: '1' }, currentIndex: 0, choiceOrder: { c1: ['1', '2', '3', '4', '5', '6'] } }));
      localStorage.setItem('snukorean:review5:attempts:confirm', JSON.stringify([]));
    }
  });
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('[data-action="resume"]')).toBeVisible();
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  expect(await page.evaluate(() => [localStorage.getItem('snukorean:review5:progress:confirm'), localStorage.getItem('snukorean:review5:attempts:confirm')])).toEqual([null, null]);
  await page.reload();
  await expect(page.locator('[data-action="start"]')).toBeVisible();
  await expect(page.locator('[data-action="resume"]')).toHaveCount(0);
});

test('leaves unknown and corrupt v2 values byte-identical', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:v2:progress:confirm', '{not json');
    localStorage.setItem('snukorean:review5:v2:attempts:confirm', JSON.stringify({ schemaVersion: 9, attempts: [] }));
  });
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('.recovery')).toBeVisible();
  const raw = await page.evaluate(() => [localStorage.getItem('snukorean:review5:v2:progress:confirm'), localStorage.getItem('snukorean:review5:v2:attempts:confirm')]);
  expect(raw[0]).toBe('{not json');
  expect(JSON.parse(raw[1]).schemaVersion).toBe(9);
});

test('routes malformed v2 progress shape to protected fallback without crashing', async ({ page }) => {
  const malformed = JSON.stringify({ schemaVersion: 2, answers: { c1: '1' }, choiceOrder: { c1: ['1'] }, currentIndex: 1.5, studentName: 7, startedAt: 'now', updatedAt: null });
  await page.addInitScript((raw) => { localStorage.clear(); localStorage.setItem('snukorean:review5:v2:progress:confirm', raw); }, malformed);
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('.recovery')).toBeVisible();
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.locator('.option-button').first().click();
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toBe(malformed);
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:recovery:progress:confirm'))).toContain('"choiceOrder"');
});

test('routes malformed v2 attempt result to protected fallback without crashing', async ({ page }) => {
  const malformed = JSON.stringify({ schemaVersion: 2, attempts: [{ id: 'bad', studentName: '김학생', finishedAt: 1, score: 0, total: 19, submission: { status: 'success' }, results: [null] }] });
  await page.addInitScript((raw) => { localStorage.clear(); localStorage.setItem('snukorean:review5:v2:attempts:confirm', raw); }, malformed);
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('.recovery')).toBeVisible();
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.evaluate(() => window.__review5App.fillAnswers('confirm', true));
  await page.locator('[data-action="finish"]').click();
  await expect(page.locator('.result-card')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:attempts:confirm'))).toBe(malformed);
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:recovery:attempts:confirm'))).toContain('"results"');
});

for (const [name, answers] of [['array answers', []], ['numeric answer', { c1: 1 }]]) {
  test(`protects ${name} in a v2 progress record`, async ({ page }) => {
    const raw = JSON.stringify({ schemaVersion: 2, answers, choiceOrder: {}, currentIndex: 0, studentName: '', startedAt: 1, updatedAt: 1 });
    await page.addInitScript((value) => { localStorage.clear(); localStorage.setItem('snukorean:review5:v2:progress:confirm', value); }, raw);
    await page.goto('/review/review5-html/confirm.html');
    await expect(page.locator('.recovery')).toBeVisible();
    await page.locator('#studentNameInput').fill('김학생');
    await page.locator('[data-action="start"]').click();
    await page.locator('.option-button').first().click();
    expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toBe(raw);
    expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:recovery:progress:confirm'))).toContain('"answers"');
  });
}

test('rejects missing attempt schema and injected canonical result text while current attempts restore', async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.__review5AttemptSetup) { sessionStorage.__review5AttemptSetup = '1'; localStorage.clear(); } window.HomeworkSubmitter = { submitHomework: async () => ({}) }; });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.evaluate(() => window.__review5App.fillAnswers('confirm', true));
  await page.locator('[data-action="finish"]').click();
  await expect(page.locator('.result-card')).toBeVisible();
  const valid = await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:attempts:confirm'));
  await page.reload();
  await expect(page.locator('.history-card')).toBeVisible();
  const missingSchema = JSON.parse(valid); delete missingSchema.attempts[0].schemaVersion;
  await page.evaluate((raw) => localStorage.setItem('snukorean:review5:v2:attempts:confirm', raw), JSON.stringify(missingSchema));
  const protectedPage = await page.context().newPage();
  await protectedPage.goto('/review/review5-html/confirm.html');
  await expect(protectedPage.locator('.recovery')).toBeVisible();
  expect(await protectedPage.evaluate(() => localStorage.getItem('snukorean:review5:v2:attempts:confirm'))).toBe(JSON.stringify(missingSchema));
  const injected = JSON.parse(valid); injected.attempts[0].results[0].prompt = '주입된 문항';
  await protectedPage.evaluate((raw) => localStorage.setItem('snukorean:review5:v2:attempts:confirm', raw), JSON.stringify(injected));
  const injectedPage = await page.context().newPage();
  await injectedPage.goto('/review/review5-html/confirm.html');
  await expect(injectedPage.locator('.recovery')).toBeVisible();
  expect(await injectedPage.evaluate(() => localStorage.getItem('snukorean:review5:v2:attempts:confirm'))).toBe(JSON.stringify(injected));
});

test('restores a current empty-answer progress record and rejects unsafe attempt id/date', async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.__review5EmptySetup) { sessionStorage.__review5EmptySetup = '1'; localStorage.clear(); } window.HomeworkSubmitter = { submitHomework: async () => ({}) }; });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.reload();
  await expect(page.locator('[data-action="resume"]')).toBeVisible();
  await page.locator('[data-action="resume"]').click();
  await page.evaluate(() => window.__review5App.fillAnswers('confirm', true));
  await page.locator('[data-action="finish"]').click();
  const unsafe = await page.evaluate(() => { const wrapper = JSON.parse(localStorage.getItem('snukorean:review5:v2:attempts:confirm')); wrapper.attempts[0].id = '" onfocus="x'; wrapper.attempts[0].finishedAt = 9e15; return JSON.stringify(wrapper); });
  await page.evaluate((raw) => localStorage.setItem('snukorean:review5:v2:attempts:confirm', raw), unsafe);
  const protectedPage = await page.context().newPage();
  await protectedPage.goto('/review/review5-html/confirm.html');
  await expect(protectedPage.locator('.recovery')).toBeVisible();
  expect(await protectedPage.evaluate(() => localStorage.getItem('snukorean:review5:v2:attempts:confirm'))).toBe(unsafe);
});

test('migrates a normal legacy attempt into a strict v2 attempt that restores on reload', async ({ page }) => {
  await page.addInitScript(() => { if (!sessionStorage.__review5LegacyAttemptSetup) { sessionStorage.__review5LegacyAttemptSetup = '1'; localStorage.clear(); } window.HomeworkSubmitter = { submitHomework: async () => ({}) }; });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.evaluate(() => window.__review5App.fillAnswers('confirm', true));
  await page.locator('[data-action="finish"]').click();
  const legacy = await page.evaluate(() => { const wrapper = JSON.parse(localStorage.getItem('snukorean:review5:v2:attempts:confirm')); return JSON.stringify(wrapper.attempts.map((attempt) => { const copy = Object.assign({}, attempt); copy.results = copy.results.map((result) => Object.assign({}, result)); Object.assign(copy.results[2], { tag: '예전 영역', prompt: '예전 c3 문항', selectedText: '예전 선택지', selectedLetter: 'Z', answerText: '예전 정답', correctLetter: 'Z', feedback: '예전 피드백' }); delete copy.schemaVersion; delete copy.submission; return copy; })); });
  await page.evaluate((raw) => { localStorage.removeItem('snukorean:review5:v2:attempts:confirm'); localStorage.setItem('snukorean:review5:attempts:confirm', raw); }, legacy);
  const migrated = await page.context().newPage();
  await migrated.goto('/review/review5-html/confirm.html');
  await expect(migrated.locator('.history-card')).toBeVisible();
  const canonical = await migrated.evaluate(() => { const attempt = JSON.parse(localStorage.getItem('snukorean:review5:v2:attempts:confirm')).attempts[0], question = window.REVIEW5_DATA.sections.confirm.questions[2], result = attempt.results[2]; return { id: attempt.id, result, question, selected: question.choices.find((choice) => choice.id === result.selectedId) }; });
  expect(canonical.id).toMatch(/^attempt-\d+-[a-z0-9]{6}$/);
  expect(canonical.result).toMatchObject({ tag: canonical.question.tag, prompt: canonical.question.prompt, selectedText: canonical.selected.text, answerText: canonical.question.choices.find((choice) => choice.id === canonical.question.answer).text, feedback: canonical.question.feedback });
  const reloaded = await page.context().newPage();
  await reloaded.goto('/review/review5-html/confirm.html');
  await expect(reloaded.locator('.history-card')).toBeVisible();
});

test('keeps protected raw records byte-identical while fallback work survives reload', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.__review5ProtectedSetup) {
      sessionStorage.__review5ProtectedSetup = '1';
      localStorage.clear();
      localStorage.setItem('snukorean:review5:v2:progress:confirm', '{손상}');
      localStorage.setItem('snukorean:review5:v2:attempts:confirm', JSON.stringify({ schemaVersion: 7, attempts: [] }));
    }
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.locator('.option-button').first().click();
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')));
  const before = await page.evaluate(() => [localStorage.getItem('snukorean:review5:v2:progress:confirm'), localStorage.getItem('snukorean:review5:v2:attempts:confirm'), localStorage.getItem('snukorean:review5:v2:recovery:progress:confirm')]);
  expect(before[0]).toBe('{손상}');
  expect(JSON.parse(before[1]).schemaVersion).toBe(7);
  expect(JSON.parse(before[2]).answers.c1).toBeTruthy();
  await page.reload();
  await expect(page.locator('[data-action="resume"]')).toBeVisible();
  const after = await page.evaluate(() => [localStorage.getItem('snukorean:review5:v2:progress:confirm'), localStorage.getItem('snukorean:review5:v2:attempts:confirm')]);
  expect(after).toEqual(before.slice(0, 2));
});

test('offers Korean recovery copy fallback and does not clear work when reset storage fails', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:v2:progress:confirm', '{손상}');
    window.__remove = Storage.prototype.removeItem;
    document.execCommand = () => true;
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.locator('#recoveryText')).toBeVisible();
  await page.locator('[data-action="copy-recovery"]').click();
  await expect(page.locator('.recovery .status')).toContainText('복사');
  await page.evaluate(() => { Storage.prototype.removeItem = () => { throw new Error('용량 오류'); }; });
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  await expect(page.locator('.recovery')).toContainText('초기화하지 못했습니다');
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toBe('{손상}');
});

test('keeps in-memory work and exposes recovery when storage is full', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:v2:progress:confirm', '{손상}');
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('용량 초과', 'QuotaExceededError'); }; });
  await page.locator('[data-action="start"]').click();
  await page.locator('.option-button').first().click();
  await expect(page.locator('.recovery')).toContainText('저장하지 못했습니다');
  await expect(page.locator('#recoveryText')).toContainText('c1');
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toBe('{손상}');
});

test('confirmed reset affects only current section v2 data', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:v2:progress:confirm', JSON.stringify({ schemaVersion: 2, answers: {}, choiceOrder: {}, currentIndex: 0 }));
    localStorage.setItem('snukorean:review5:v2:progress:evaluate', 'other-section');
    localStorage.setItem('unrelated', 'keep');
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  const values = await page.evaluate(() => [localStorage.getItem('snukorean:review5:v2:progress:confirm'), localStorage.getItem('snukorean:review5:v2:progress:evaluate'), localStorage.getItem('unrelated')]);
  expect(values).toEqual([null, 'other-section', 'keep']);
});

test('confirmed reset removes protected originals and returns to normal v2 saving after reload', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.__review5ResetSuccessSetup) {
      sessionStorage.__review5ResetSuccessSetup = '1';
      localStorage.clear();
      localStorage.setItem('snukorean:review5:v2:progress:confirm', '{손상}');
      localStorage.setItem('snukorean:review5:v2:recovery:progress:confirm', JSON.stringify({ schemaVersion: 2, answers: { c1: '1' }, choiceOrder: { c1: ['1', '2', '3', '4', '5', '6'] }, currentIndex: 0 }));
    }
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:recovery:progress:confirm'))).toBeNull();
  await page.reload();
  await expect(page.locator('.recovery')).toHaveCount(0);
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.locator('.option-button').first().click();
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:v2:progress:confirm'))).toContain('"schemaVersion":2');
});

test('partial reset failure rolls back keys and keeps protected work', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('snukorean:review5:v2:progress:confirm', '{손상}');
    localStorage.setItem('snukorean:review5:v2:attempts:confirm', JSON.stringify({ schemaVersion: 8, attempts: [] }));
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.evaluate(() => { let count = 0; const remove = Storage.prototype.removeItem; Storage.prototype.removeItem = function (key) { count += 1; if (count === 2) throw new Error('부분 실패'); return remove.call(this, key); }; });
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  await expect(page.locator('.recovery')).toContainText('초기화하지 못했습니다');
  const values = await page.evaluate(() => [localStorage.getItem('snukorean:review5:v2:progress:confirm'), localStorage.getItem('snukorean:review5:v2:attempts:confirm')]);
  expect(values[0]).toBe('{손상}');
  expect(JSON.parse(values[1]).schemaVersion).toBe(8);
});

test('partial reset failure rolls back v2, fallback, and legacy records byte-for-byte', async ({ page }) => {
  const values = ['{원본진행}', '{원본기록}', '{복구진행}', '{복구기록}', '{레거시진행}', '{레거시기록}'];
  await page.addInitScript((items) => {
    localStorage.clear();
    ['snukorean:review5:v2:progress:confirm', 'snukorean:review5:v2:attempts:confirm', 'snukorean:review5:v2:recovery:progress:confirm', 'snukorean:review5:v2:recovery:attempts:confirm', 'snukorean:review5:progress:confirm', 'snukorean:review5:attempts:confirm'].forEach((key, index) => localStorage.setItem(key, items[index]));
  }, values);
  await page.goto('/review/review5-html/confirm.html');
  await page.evaluate(() => { let count = 0; const remove = Storage.prototype.removeItem; Storage.prototype.removeItem = function (key) { count += 1; if (count === 5) throw new Error('부분 실패'); return remove.call(this, key); }; });
  await page.locator('[data-action="reset-request"]').click();
  await page.locator('[data-action="reset-confirm"]').click();
  await expect(page.locator('.recovery')).toContainText('초기화하지 못했습니다');
  const restored = await page.evaluate(() => ['snukorean:review5:v2:progress:confirm', 'snukorean:review5:v2:attempts:confirm', 'snukorean:review5:v2:recovery:progress:confirm', 'snukorean:review5:v2:recovery:attempts:confirm', 'snukorean:review5:progress:confirm', 'snukorean:review5:attempts:confirm'].map((key) => localStorage.getItem(key)));
  expect(restored).toEqual(values);
});
