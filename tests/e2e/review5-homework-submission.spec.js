const { test, expect } = require('@playwright/test');

const targets = [
  ['confirm', '/review/review5-html/confirm.html', 'review5-confirm-v1', '복습 5 확인하기', 19],
  ['evaluate', '/review/review5-html/evaluate.html', 'review5-evaluate-v1', '복습 5 평가하기', 17],
  ['listening', '/review/review5-html/listening.html', 'review5-listening-v1', '복습 5 듣기', 16],
  ['readingWriting', '/review/review5-html/reading-writing.html', 'review5-reading-writing-v1', '복습 5 읽기와 쓰기', 15]
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    window.__payloads = [];
    window.HomeworkSubmitter = { submitHomework: async (payload) => { window.__payloads.push(payload); return { documentId: 'mock' }; } };
  });
});

for (const [sectionId, path, assignmentId, title, total] of targets) {
  test(`${sectionId} requires a name and submits the Review 5 quiz contract once`, async ({ page }) => {
    await page.goto(path);
    await page.locator('[data-action="start"]').click();
    await expect(page.locator('body')).toHaveAttribute('data-view', 'start');
    await expect(page.locator('#nameStatus')).toContainText('이름');
    await page.locator('#studentNameInput').fill('김학생');
    await page.locator('[data-action="start"]').click();
    await expect(page.locator('.question-card')).toBeVisible();
    await page.evaluate(([id]) => window.__review5App.fillAnswers(id, true), [sectionId]);
    await page.locator('[data-action="finish"]').click();
    await expect.poll(() => page.evaluate(() => window.__payloads.length)).toBe(1);
    const payload = await page.evaluate(() => window.__payloads[0]);
    expect(payload).toMatchObject({ assignmentId, assignmentTitle: title, chapter: 'review5', sectionId, studentName: '김학생', score: total, total, percent: 100, completed: true, answered: total });
    expect(payload.signatureHash).toEqual(expect.any(String));
    expect(payload.questionResults).toHaveLength(total);
    expect(payload.questionResults[0]).toEqual(expect.objectContaining({ number: 1, area: expect.any(String), prompt: expect.any(String), studentAnswer: expect.any(String), selectedLetter: expect.any(String), correctAnswer: expect.any(String), correctLetter: expect.any(String), isCorrect: true }));
    await page.locator('[data-action="new-attempt"]').click();
    await expect(page.locator('.question-card')).toBeVisible();
    await page.evaluate(([id]) => window.__review5App.fillAnswers(id, true), [sectionId]);
    await page.locator('[data-action="finish"]').click();
    await expect.poll(() => page.evaluate(() => window.__payloads.length)).toBe(2);
  });
}

test('shows immediate Korean feedback without removing the choice', async ({ page }) => {
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.locator('.option-button').first().click();
  await expect(page.locator('.feedback-card')).toBeVisible();
  await expect(page.locator('.feedback-card')).toContainText('정답');
  await expect(page.locator('[data-question="c1-c16"]')).toHaveCount(4);
});

test('only submits once for a rapid double finish and retries a failed attempt once', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    window.__calls = 0;
    window.HomeworkSubmitter = { submitHomework: async () => { window.__calls += 1; if (window.__calls === 1) throw new Error('실패'); return {}; } };
  });
  await page.goto('/review/review5-html/confirm.html');
  await page.locator('#studentNameInput').fill('김학생');
  await page.locator('[data-action="start"]').click();
  await page.evaluate(() => window.__review5App.fillAnswers('confirm', true));
  await page.evaluate(() => { const button = document.querySelector('[data-action="finish"]'); button.click(); button.click(); });
  await expect.poll(() => page.evaluate(() => window.__calls)).toBe(1);
  await expect(page.locator('[data-action="retry-submit"]')).toBeVisible();
  await page.locator('[data-action="retry-submit"]').click();
  await expect.poll(() => page.evaluate(() => window.__calls)).toBe(2);
  await expect(page.locator('.homework-status--result')).toContainText('완료');
});
