const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function openActivity(page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto('/c12/grammar2-degree-challenge.html', { waitUntil: 'domcontentloaded' });
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  )).toBe(true);
}

test('c12 grammar2 thermometer degree activity opens responsively', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1280, height: 900 }
  ];

  for (const viewport of viewports) {
    await openActivity(page, viewport);

    await expect(page.locator('h1').first()).toContainText('온도계 정도 활동');
    await expect(page.locator('#stageExplore')).toHaveClass(/is-active/);
    await expect(page.locator('#thermometer')).toHaveAttribute('role', 'slider');
    await expect(page.locator('#thermometer')).toHaveAttribute('aria-valuenow', '0');
    await expect(page.locator('.top-burst')).toHaveCount(1);
    await expect(page.locator('.usage-note')).toContainText('전통적으로는 부정적인 표현에 주로 썼습니다');

    const dataShape = await page.evaluate(() => ({
      verbs: window.__c12Grammar2DegreeActivityData.items.verbs.length,
      adjectives: window.__c12Grammar2DegreeActivityData.items.adjectives.length,
      choice: window.__c12Grammar2DegreeActivityData.choicePractice.length,
      typing: window.__c12Grammar2DegreeActivityData.typingPractice.length
    }));
    expect(dataShape).toEqual({ verbs: 5, adjectives: 5, choice: 15, typing: 10 });
    await expectNoHorizontalOverflow(page);
  }
});

test('c12 hub links to the thermometer degree activity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await blockExternalRequests(page);
  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  const link = page.getByRole('link', { name: /온도계 정도 활동/ });
  await expect(link).toBeVisible();
  await expect(link).toContainText('온도계를 움직이며 정도 표현 바꾸기');

  await link.click();
  await expect(page).toHaveURL(/\/c12\/grammar2-degree-challenge\.html$/);
  await expect(page.locator('h1').first()).toContainText('온도계 정도 활동');
});

test('thermometer click and item chips change the expression', async ({ page }) => {
  await openActivity(page, { width: 1280, height: 900 });

  await page.locator('#verbModeBtn').click();
  await page.getByRole('button', { name: /기다리다/ }).click();
  await expect(page.locator('#expressionText')).toContainText('온도계를 올려 보세요.');

  const box = await page.locator('#thermometer').boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box.x + box.width / 2, box.y + 18);

  await expect(page.locator('#thermometer')).toHaveAttribute('aria-valuenow', '5');
  await expect(page.locator('#expressionText')).toContainText('버스를 얼마나 오래 기다렸는지 몰라요.');

  await page.mouse.click(box.x + box.width / 2, box.y + box.height - 18);

  await expect(page.locator('#thermometer')).toHaveAttribute('aria-valuenow', '0');
  await expect(page.locator('#expressionText')).toContainText('온도계를 올려 보세요.');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 18);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 18, { steps: 6 });
  await page.mouse.up();

  await expect(page.locator('#thermometer')).toHaveAttribute('aria-valuenow', '5');
  await expect(page.locator('#expressionText')).toContainText('버스를 얼마나 오래 기다렸는지 몰라요.');
});

test('raising thermometer to five can trigger a break effect', async ({ page }) => {
  await openActivity(page, { width: 1280, height: 900 });
  await page.evaluate(() => {
    Math.random = () => 0.1;
  });

  const box = await page.locator('#thermometer').boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.click(box.x + box.width / 2, box.y + 18);

  await expect(page.locator('#thermometer')).toHaveAttribute('aria-valuenow', '5');
  await expect(page.locator('#thermometer')).toHaveClass(/is-breaking/);
  await expect(page.locator('.top-burst .burst-ray')).toHaveCount(5);
  await expect(page.locator('.top-burst .burst-dot')).toHaveCount(5);
  await expect(page.locator('#breakMessage')).toContainText('온도계가 잠깐 깨졌어요');
});

test('15 expression choices advance to typing practice', async ({ page }) => {
  await openActivity(page);
  await page.locator('#goChoiceBtn').click();

  for (let index = 0; index < 15; index += 1) {
    await page.evaluate(() => window.__c12Grammar2DegreeActivity.answerChoiceCorrectly());
    await expect(page.locator('#choiceFeedback')).toBeVisible();
    await page.locator('#choiceNextBtn').click();
  }

  await expect(page.locator('#stageTyping')).toHaveClass(/is-active/);
  await expect(page.locator('#typingProgress')).toContainText('1 / 10');
  await expect(page.locator('#choiceFinalScore')).toHaveCount(1);
});

test('typing practice accepts grammar forms and completes in the same screen', async ({ page }) => {
  await openActivity(page);
  await page.evaluate(() => window.__c12Grammar2DegreeActivity.goToStage('typing'));

  for (let index = 0; index < 10; index += 1) {
    const answer = await page.evaluate(() => (
      window.__c12Grammar2DegreeActivityData.typingPractice[
        window.__c12Grammar2DegreeActivity.getState().typingIndex
      ].answers[0]
    ));
    await page.locator('#typingInput').fill(answer);
    await page.locator('#typingCheckBtn').click();
    await expect(page.locator('#typingFeedback')).toBeVisible();
    await page.locator('#typingNextBtn').click();
  }

  await expect(page.locator('#summaryBody')).toBeVisible();
  await expect(page.locator('#typingFinalScore')).toContainText('10 / 10');
  await expect(page.locator('#restartBtn')).toBeVisible();
});

test('primary visible UI avoids old activity wording', async ({ page }) => {
  await openActivity(page, { width: 1280, height: 900 });

  const visibleText = await page.locator('body').evaluate((body) => body.innerText);
  expect(visibleText).not.toContain('퀴즈');
  expect(visibleText).not.toContain('챌린지');
});
