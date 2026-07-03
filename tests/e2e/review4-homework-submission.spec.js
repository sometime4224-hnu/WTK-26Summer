const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.gstatic.com/firebasejs/**', (route) => route.abort());
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function installSubmitterMock(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    window.__homeworkPayloads = [];
    window.HomeworkSubmitter = {
      async submitHomework(payload) {
        window.__homeworkPayloads.push(payload);
        return {
          anonymousUid: 'mock-user',
          documentId: `${payload.assignmentId}-mock`,
          path: `homeworkAssignments/${payload.assignmentId}/submissions/mock`
        };
      }
    };
  });
}

const homeworkTargets = [
  {
    sectionId: 'listening',
    path: '/review/review4-html/listening.html',
    assignmentId: 'review4-listening-v1',
    title: '복습 4 듣기',
    total: 16
  },
  {
    sectionId: 'readingWriting',
    path: '/review/review4-html/reading-writing.html',
    assignmentId: 'review4-reading-writing-v1',
    title: '복습 4 읽기와 쓰기',
    total: 15
  }
];

test.describe('Review 4 homework submission', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await installSubmitterMock(page);
  });

  for (const target of homeworkTargets) {
    test(`blocks ${target.sectionId} until a student name is entered`, async ({ page }) => {
      await page.goto(target.path, { waitUntil: 'load' });

      await expect(page.locator('.homework-panel')).toBeVisible();
      await page.locator('[data-action="start"]').click();

      await expect(page.locator('body')).toHaveAttribute('data-view', 'start');
      await expect(page.locator('.question-card')).toHaveCount(0);
      await expect(page.locator('#homeworkStatus')).toHaveClass(/is-error/);
      await expect(page.locator('#homeworkStatus')).toContainText('이름');
    });

    test(`submits ${target.sectionId} with the standard homework payload`, async ({ page }) => {
      await page.goto(target.path, { waitUntil: 'load' });

      await page.locator('#studentNameInput').fill('김학생');
      await page.locator('[data-action="start"]').click();
      await expect(page.locator('.question-card')).toBeVisible();

      await page.evaluate((sectionId) => {
        window.__review4App.fillAnswers(sectionId, true);
      }, target.sectionId);

      await page.locator('[data-action="finish-section"]').dispatchEvent('click');
      await expect.poll(async () => page.evaluate(() => window.__homeworkPayloads.length)).toBe(1);

      const payload = await page.evaluate(() => window.__homeworkPayloads[0]);
      expect(payload).toMatchObject({
        assignmentId: target.assignmentId,
        assignmentTitle: target.title,
        chapter: 'review4',
        sectionId: target.sectionId,
        sectionTitle: target.title.replace('복습 4 ', ''),
        studentName: '김학생',
        score: target.total,
        total: target.total,
        percent: 100,
        completed: true,
        answered: target.total
      });
      expect(payload.signatureHash).toEqual(expect.any(String));
      expect(payload.correctQuestions).toHaveLength(target.total);
      expect(payload.wrongQuestions).toHaveLength(0);
      expect(payload.questionResults).toHaveLength(target.total);
      expect(payload.questionResults[0]).toEqual(expect.objectContaining({
        number: 1,
        area: expect.any(String),
        prompt: expect.any(String),
        studentAnswer: expect.any(String),
        selectedLetter: expect.any(String),
        correctAnswer: expect.any(String),
        correctLetter: expect.any(String),
        isCorrect: true
      }));

      await expect(page.locator('.homework-status--result')).toHaveClass(/is-success/);
      await expect(page.locator('.homework-status--result')).toContainText('온라인 제출이 완료되었습니다.');
    });
  }
});
