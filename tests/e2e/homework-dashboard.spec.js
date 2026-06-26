const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://www.gstatic.com/firebasejs/**', (route) => route.abort());
}

async function installDashboardMock(page) {
  await page.addInitScript(() => {
    const submissions = [
      {
        id: 'sub-1',
        assignmentId: 'c12-review-quiz-v1',
        studentName: '김학생',
        score: 22,
        total: 24,
        percent: 92,
        clientSubmittedAt: '2026-06-26T02:00:00.000Z',
        wrongQuestions: [3, 7],
        questionResults: [
          { number: 1, area: '어휘', correctAnswer: '살이 찌다', isCorrect: true },
          { number: 3, area: '어휘', correctAnswer: '(가슴을) 펴다', isCorrect: false },
          { number: 7, area: 'V-았더니/었더니', correctAnswer: '했더니', isCorrect: false }
        ]
      },
      {
        id: 'sub-2',
        assignmentId: 'c12-review-quiz-v1',
        studentName: '박학생',
        score: 18,
        total: 24,
        percent: 75,
        clientSubmittedAt: '2026-06-26T01:30:00.000Z',
        wrongQuestions: [3, 10, 12, 20, 22, 24],
        questionResults: [
          { number: 3, area: '어휘', correctAnswer: '(가슴을) 펴다', isCorrect: false },
          { number: 10, area: '얼마나 -(으)ㄴ/는지 모르다', correctAnswer: '좋아하는지', isCorrect: false }
        ]
      },
      {
        id: 'sub-3',
        assignmentId: 'c12-review-quiz-v1',
        studentName: '김학생',
        score: 20,
        total: 24,
        percent: 83,
        clientSubmittedAt: '2026-06-25T08:00:00.000Z',
        wrongQuestions: [2, 4, 6, 8],
        questionResults: []
      }
    ];

    window.__dashUser = null;
    window.__dashAuthCallback = null;
    window.HomeworkDashboardClient = {
      async signIn() {
        window.__dashUser = { email: 'teacher@example.com' };
        if (window.__dashAuthCallback) window.__dashAuthCallback(window.__dashUser);
        return window.__dashUser;
      },
      async signOut() {
        window.__dashUser = null;
        if (window.__dashAuthCallback) window.__dashAuthCallback(null);
      },
      async onAuthStateChanged(callback) {
        window.__dashAuthCallback = callback;
        callback(window.__dashUser);
        return () => {};
      },
      async loadSubmissions() {
        return submissions;
      }
    };
  });
}

test.describe('homework dashboard', () => {
  test('shows c12 dashboard summaries after teacher sign-in', async ({ page }) => {
    await blockExternalRequests(page);
    await installDashboardMock(page);
    await page.goto('/c12/review-quiz-results.html', { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('12과 어휘·문법 복습 제출 현황');
    await expect(page.locator('#signInButton')).toBeVisible();

    await page.locator('#signInButton').click();

    await expect(page.locator('.summary-card').first()).toContainText('2');
    await expect(page.locator('.score-bar')).toHaveCount(2);
    await expect(page.locator('.score-bar').first()).toContainText('김학생');
    await expect(page.locator('.weak-item').first()).toContainText('Q3');
    await expect(page.locator('tbody tr')).toHaveCount(2);

    await page.locator('#studentSearch').fill('박');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr')).toContainText('박학생');
  });

  test('links c12 hub to the teacher dashboard', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

    const link = page.locator('a[href="review-quiz-results.html"]').first();
    await expect(link).toBeVisible();
    await expect(link).toContainText('제출 현황 보기');
  });
});
