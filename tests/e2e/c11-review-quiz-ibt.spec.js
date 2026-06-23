const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function openFreshIbt(page, seed) {
  await page.goto(`/c11/review-quiz-ibt.html?seed=${seed}`, { waitUntil: 'load' });
  await page.evaluate(() => window.__reviewQuizIbt.clearStorage());
  await page.reload({ waitUntil: 'load' });
}

test.describe('c11 IBT TOPIK-style review quiz', () => {
  test('renders the 28-question IBT flow with the expected question mix', async ({ page }) => {
    await blockExternalRequests(page);
    await openFreshIbt(page, 'ibt-render');

    await expect(page.locator('h1')).toHaveText('11과 어휘·문법 복습 IBT');
    await expect(page.locator('#startIbtButton')).toBeVisible();

    const counts = await page.evaluate(() => window.__reviewQuizIbt.getQuestionCounts());
    expect(counts).toEqual({ total: 28, mcq: 16, short: 8, scaffold: 4 });

    await page.locator('#startIbtButton').click();
    await expect(page.locator('.ibt-dot-button')).toHaveCount(28);
    await expect(page.locator('[data-ibt-question-card]')).toHaveCount(1);
    await expect(page.locator('[data-ibt-question-card]')).toHaveAttribute('data-type', 'mcq');
    await expect(page.locator('.ibt-question-number')).toHaveText('01');
  });

  test('moves between questions and restores saved answers after reload', async ({ page }) => {
    await blockExternalRequests(page);
    await openFreshIbt(page, 'ibt-persist');
    await page.locator('#startIbtButton').click();

    const first = await page.evaluate(() => {
      const question = window.__reviewQuizIbt.currentAttempt().questions[0];
      return { id: question.id, answer: question.answer };
    });

    await page.locator(`[data-question-id="${first.id}"] input[value="${first.answer}"]`).check();
    await page.locator('[data-action="next"]').click();
    await expect(page.locator('[data-ibt-question-card]')).toHaveAttribute('data-question-id', 'c11-mcq-02');

    await page.locator('[data-action="prev"]').click();
    await expect(page.locator(`[data-question-id="${first.id}"] input[value="${first.answer}"]`)).toBeChecked();

    await page.locator('.ibt-dot-button').nth(16).click();
    await expect(page.locator('[data-ibt-question-card]')).toHaveAttribute('data-question-id', 'c11-short-17');
    await page.locator('.ibt-text-answer').fill('신입 사원');

    let progress = await page.evaluate(() => window.__reviewQuizIbt.readProgress());
    expect(progress.answered).toBe(2);
    expect(progress.answers['c11-short-17']).toBe('신입 사원');

    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('#resumeIbtButton')).toBeVisible();
    await page.locator('#resumeIbtButton').click();
    await expect(page.locator('[data-ibt-question-card]')).toHaveAttribute('data-question-id', 'c11-short-17');
    await expect(page.locator('.ibt-text-answer')).toHaveValue('신입 사원');
  });

  test('grades a perfect submission and shows result review', async ({ page }) => {
    await blockExternalRequests(page);
    await openFreshIbt(page, 'ibt-perfect');
    await page.locator('#startIbtButton').click();

    await page.evaluate(() => {
      const answers = {};
      for (const question of window.__reviewQuizIbt.currentAttempt().questions) {
        if (question.type === 'mcq') {
          answers[question.id] = question.answer;
        } else if (question.type === 'short') {
          answers[question.id] = question.answers[0];
        } else {
          answers[question.id] = question.example;
        }
      }
      window.__reviewQuizIbt.setAnswers(answers);
    });

    await page.locator('[data-action="finish"]').click();
    await expect(page.locator('.ibt-result-hero h1')).toHaveText('28/28점');
    await expect(page.locator('.ibt-review-item')).toHaveCount(28);
    await expect(page.locator('.ibt-status-pill').first()).toHaveText('정답');

    const logs = await page.evaluate(() => window.__reviewQuizIbt.readScoreLogs());
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ score: 28, total: 28, percent: 100 });
  });

  test('is linked from the c11 hub while the original review remains available', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('a[href="review-quiz-ibt.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="review-quiz.html"]')).toHaveCount(1);

    await page.locator('a[href="review-quiz-ibt.html"]').click();
    await expect(page).toHaveURL(/\/c11\/review-quiz-ibt\.html$/);
    await expect(page.locator('h1')).toHaveText('11과 어휘·문법 복습 IBT');
  });

  test('fits mobile without horizontal overflow', async ({ page }) => {
    await blockExternalRequests(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await openFreshIbt(page, 'ibt-mobile');

    await expectNoHorizontalOverflow(page);
    await page.locator('#startIbtButton').click();
    await expect(page.locator('[data-ibt-question-card]')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
