const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function openChallenge(page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto('/c12/grammar2-degree-challenge.html', { waitUntil: 'domcontentloaded' });
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  )).toBe(true);
}

async function startChallenge(page) {
  await page.locator('#startBtn').click();
  await expect(page.locator('#screenGame')).toHaveClass(/active/);
}

test('c12 grammar2 degree challenge opens responsively', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1280, height: 900 }
  ];

  for (const viewport of viewports) {
    await openChallenge(page, viewport);

    await expect(page.locator('h1').first()).toContainText('얼마나 온도계 챌린지');
    await expect(page.locator('#startBtn')).toBeVisible();
    await expect(page.locator('#thermometer')).toHaveCount(1);

    const dataLength = await page.evaluate(() => window.__c12Grammar2DegreeChallengeData.length);
    expect(dataLength).toBe(12);
    await expectNoHorizontalOverflow(page);
  }
});

test('c12 hub links to the grammar2 degree challenge', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await blockExternalRequests(page);
  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  const link = page.getByRole('link', { name: /얼마나 온도계 챌린지/ });
  await expect(link).toBeVisible();
  await expect(link).toContainText('감정의 강도를 올리며 강조 문장 만들기');

  await link.click();
  await expect(page).toHaveURL(/\/c12\/grammar2-degree-challenge\.html$/);
  await expect(page.locator('h1').first()).toContainText('얼마나 온도계 챌린지');
});

test('c12 grammar2 degree challenge gives feedback for a round 1 answer', async ({ page }) => {
  await openChallenge(page);
  await startChallenge(page);

  const answer = await page.evaluate(() => window.__c12Grammar2DegreeChallengeData[0].answer);
  await page.getByRole('button', { name: answer, exact: true }).click();

  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다.');
  await expect(page.locator('#feedbackBox')).toContainText('왜 이 형태인지');
  await expect(page.locator('#nextBtn')).toBeVisible();
});

test('c12 grammar2 degree challenge assembles a round 3 sentence with word chips', async ({ page }) => {
  await openChallenge(page, { width: 820, height: 1180 });

  await page.evaluate(() => window.__c12Grammar2DegreeChallenge.goToQuestion(8));
  await expect(page.locator('#screenGame')).toHaveClass(/active/);
  await expect(page.locator('#questionType')).toContainText('단어 칩 조립');

  const tokens = await page.evaluate(() => window.__c12Grammar2DegreeChallengeData[8].tokens);
  for (const token of tokens) {
    await page.locator('#wordBank').getByRole('button', { name: token, exact: true }).click();
  }

  await page.locator('#checkBuildBtn').click();
  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다.');
  await expect(page.locator('#feedbackBox')).toContainText('어제 이사해서 얼마나 피곤했는지 몰라요.');
});

test('c12 grammar2 degree challenge can finish all questions', async ({ page }) => {
  await openChallenge(page);
  await startChallenge(page);

  for (let index = 0; index < 12; index += 1) {
    await page.evaluate(() => window.__c12Grammar2DegreeChallenge.answerCurrentCorrectly());
    await expect(page.locator('#feedbackBox')).toBeVisible();
    await page.locator('#nextBtn').click();
  }

  await expect(page.locator('#screenResult')).toHaveClass(/active/);
  await expect(page.locator('#finalScore')).toContainText('12 / 12');
  await expect(page.locator('#restartBtn')).toBeVisible();
});

test('c12 grammar2 degree challenge keeps the expected challenge data shape', async ({ page }) => {
  await openChallenge(page);

  const unexpectedKeys = await page.evaluate(() => {
    const allowedKeys = new Set([
      'id',
      'round',
      'roundTitle',
      'type',
      'scene',
      'simple',
      'prompt',
      'hintKo',
      'answer',
      'sentence',
      'options',
      'tokens',
      'choices',
      'explainKo'
    ]);

    return window.__c12Grammar2DegreeChallengeData.flatMap((question) => (
      Object.keys(question).filter((key) => !allowedKeys.has(key))
    ));
  });
  expect(unexpectedKeys).toEqual([]);
});
