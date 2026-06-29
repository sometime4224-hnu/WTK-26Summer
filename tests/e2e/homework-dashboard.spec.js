const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://www.gstatic.com/firebasejs/**', (route) => route.abort());
}

async function installDashboardMock(page) {
  await page.addInitScript(() => {
    const submissionsByAssignment = {
      'c12-review-quiz-v1': [
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
      ],
      'vocab-grammar-mock-round2-v1': [
        {
          id: 'round2-sub-1',
          assignmentId: 'vocab-grammar-mock-round2-v1',
          studentName: '최학생',
          score: 23,
          total: 25,
          percent: 92,
          clientSubmittedAt: '2026-06-29T01:30:00.000Z',
          wrongQuestions: [5, 8],
          questionResults: [
            { number: 5, area: '1부. 어휘', correctAnswer: '매력이 있다', isCorrect: false },
            { number: 8, area: '2부. 문법', correctAnswer: '-더니', isCorrect: false }
          ]
        },
        {
          id: 'round2-sub-2',
          assignmentId: 'vocab-grammar-mock-round2-v1',
          studentName: '한학생',
          score: 25,
          total: 25,
          percent: 100,
          clientSubmittedAt: '2026-06-29T01:40:00.000Z',
          wrongQuestions: [],
          questionResults: []
        }
      ]
    };

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
        const params = new URLSearchParams(window.location.search);
        const assignmentId = params.get('assignment')
          || window.HOMEWORK_FIREBASE_CONFIG.dashboard.assignmentId;
        return submissionsByAssignment[assignmentId] || [];
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

  test('keeps teacher dashboard off the c12 hub and available from the root corner', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('a[href="review-quiz-results.html"]')).toHaveCount(0);

    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

    const link = page.locator('a[href="teacher-dashboard/index.html"].teacher-dashboard-corner');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('aria-label', '제출 통계');
  });

  test('shows the integrated assignment hub and opens a selected dashboard', async ({ page }) => {
    await blockExternalRequests(page);
    await installDashboardMock(page);
    await page.goto('/teacher-dashboard/index.html', { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('제출 통계');
    await expect(page.locator('[data-assignment-card]')).toHaveCount(6);
    await expect(page.locator('[data-assignment-card="c12-review-quiz-v1"]')).toContainText('12과 어휘·문법 복습');
    await expect(page.locator('[data-assignment-card="vocab-grammar-mock-marathon30-v1"]')).toContainText('30문제 마라톤');

    await page.locator('[data-assignment-link="vocab-grammar-mock-round2-v1"]').click();

    await expect(page).toHaveURL(/assignment=vocab-grammar-mock-round2-v1/);
    await expect(page.locator('h1')).toHaveText('3B 중간 모의고사 2회차 제출 현황');
    await expect(page.locator('#signInButton')).toBeVisible();

    await page.locator('#signInButton').click();

    await expect(page.locator('.summary-card').first()).toContainText('2');
    await expect(page.locator('.score-bar')).toHaveCount(2);
    await expect(page.locator('.weak-item').first()).toContainText('Q5');
  });

  test('supports direct assignment queries and unknown assignment fallback', async ({ page }) => {
    await blockExternalRequests(page);
    await installDashboardMock(page);
    await page.goto('/teacher-dashboard/index.html?assignment=vocab-grammar-mock-round2-v1', { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('3B 중간 모의고사 2회차 제출 현황');
    await expect(page.locator('.dashboard-context')).toContainText('통계 목록');

    await page.goto('/teacher-dashboard/index.html?assignment=missing-assignment', { waitUntil: 'load' });

    await expect(page.locator('h1')).toHaveText('제출 통계');
    await expect(page.locator('.dashboard-alert')).toContainText('등록되지 않은 통계 항목입니다');
    await expect(page.locator('[data-assignment-card]')).toHaveCount(6);
  });
});
