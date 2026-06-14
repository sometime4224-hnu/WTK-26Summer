const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function setRange(page, selector, value) {
  await page.locator(selector).evaluate((input, nextValue) => {
    input.value = String(nextValue);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function dragCauseeTo(page, xPercent, yPercent = 64) {
  const board = await page.getByTestId('stage-board').boundingBox();
  const causee = await page.getByTestId('causee-node').boundingBox();
  expect(board).not.toBeNull();
  expect(causee).not.toBeNull();

  await page.mouse.move(causee.x + causee.width / 2, causee.y + causee.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    board.x + board.width * xPercent / 100,
    board.y + board.height * yPercent / 100,
    { steps: 8 }
  );
  await page.mouse.up();
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c11 index links to causative influence lab', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  await page.getByRole('link', { name: /사동 영향력 실험실/ }).click();

  await expect(page).toHaveURL(/grammar1-causative-influence-lab\.html$/);
  await expect(page.locator('h1')).toContainText('사동 영향력 실험실');
});

test('causative influence lab switches between base, short, long, and no influence', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-influence-lab.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('result-word')).toHaveText('먹다');
  await expect(page.getByTestId('result-word')).toHaveClass(/is-pending/);
  await expect(page.getByTestId('result-badge')).toHaveText('결과 대기');
  await expect(page.locator('#imageFrame')).toHaveClass(/is-pending/);
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-base\.webp$/);
  await expect(page.locator('.question-cloud span')).toHaveCount(7);
  await expect(page.locator('.result-panel')).toHaveCount(0);
  const resultInsideBoard = await page.evaluate(() => (
    document.getElementById('stageBoard').contains(document.getElementById('resultWord'))
  ));
  expect(resultInsideBoard).toBe(true);

  await setRange(page, '[data-testid="power-slider"]', 92);
  await dragCauseeTo(page, 42);
  await expect(page.getByTestId('result-word')).toHaveText('먹다');
  await expect(page.getByTestId('result-word')).toHaveClass(/is-pending/);
  await expect(page.locator('#imageFrame')).toHaveClass(/is-pending/);
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-base\.webp$/);
  await page.getByTestId('causer-node').click();
  await expect(page.getByTestId('result-word')).toHaveText('먹이다');
  await expect(page.getByTestId('result-badge')).toHaveText('직접 개입');
  await expect(page.getByTestId('sentence-line')).toContainText('엄마가 아이에게 밥을 먹였다.');
  await expect(page.locator('#imageFrame')).toHaveAttribute('data-focus', 'short');
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-short\.webp$/);
  await expect(page.locator('.focus-box')).toHaveCount(0);

  await dragCauseeTo(page, 72);
  await expect(page.getByTestId('result-word')).toHaveText('먹다');
  await expect(page.getByTestId('result-badge')).toHaveText('결과 대기');
  await expect(page.locator('#imageFrame')).toHaveClass(/is-pending/);
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-base\.webp$/);
  await page.getByTestId('trigger-button').click();
  await expect(page.getByTestId('result-word')).toHaveText('먹게 하다');
  await expect(page.getByTestId('result-badge')).toHaveText('간접 지시/환경');
  await expect(page.getByTestId('sentence-line')).toContainText('엄마가 아이에게 밥을 먹게 했다.');
  await expect(page.locator('#imageFrame')).toHaveAttribute('data-focus', 'long');
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-long\.webp$/);

  await setRange(page, '[data-testid="power-slider"]', 20);
  await dragCauseeTo(page, 90);
  await page.getByTestId('trigger-button').click();
  await expect(page.getByTestId('result-word')).toHaveText('먹다');
  await expect(page.getByTestId('result-badge')).toHaveText('영향 없음');
  await expect(page.getByTestId('sentence-line')).toContainText('영향이 닿지 않아');
  await expect(page.locator('#imageFrame')).toHaveAttribute('data-focus', 'none');
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /eat-base\.webp$/);
});

test('representative verbs show main-verb scenes before influence is sent', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-influence-lab.html', { waitUntil: 'domcontentloaded' });

  const baseScenes = [
    ['입다', /wear-base\.webp$/, '아이가 스스로 옷을 입음'],
    ['앉다', /sit-base\.webp$/, '아이가 스스로 의자에 앉음'],
    ['눕다', /lie-base\.webp$/, '아이가 스스로 침대에 누움'],
    ['깨다', /wake-base\.webp$/, '아이가 스스로 잠에서 깸'],
    ['웃다', /laugh-base\.webp$/, '아이가 스스로 웃음']
  ];

  for (const [verb, imagePattern, sceneText] of baseScenes) {
    await page.getByRole('button', { name: verb }).click();
    await expect(page.getByTestId('result-word')).toHaveText(verb);
    await expect(page.getByTestId('result-word')).toHaveClass(/is-pending/);
    await expect(page.getByTestId('result-badge')).toHaveText('결과 대기');
    await expect(page.locator('#imageFrame')).toHaveClass(/is-pending/);
    await expect(page.locator('#sceneImage')).toHaveAttribute('src', imagePattern);
    await expect(page.locator('#sceneText')).toHaveText(sceneText);
  }
});

test('unregistered verbs only show safe long causative output', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-influence-lab.html', { waitUntil: 'domcontentloaded' });

  await page.getByTestId('verb-input').fill('읽다');
  await expect(page.locator('#registeredReadout')).toHaveText('미등록 동사');

  await setRange(page, '[data-testid="power-slider"]', 95);
  await dragCauseeTo(page, 42);
  await page.getByTestId('trigger-button').click();

  await expect(page.getByTestId('result-word')).toHaveText('읽게 하다');
  await expect(page.getByTestId('result-badge')).toHaveText('등록된 단형 사동 없음');
  await expect(page.getByTestId('note-line')).toContainText('단형 사동을 자동으로 만들지 않습니다');
  await expect(page.getByTestId('result-word')).not.toHaveText('읽히다');
});

test('causative influence lab is responsive without horizontal overflow', async ({ page }) => {
  await blockExternalRequests(page);

  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar1-causative-influence-lab.html', { waitUntil: 'domcontentloaded' });

    await expect(page.getByTestId('stage-board')).toBeVisible();
    await expect(page.getByTestId('result-word')).toBeVisible();
    await expect(page.locator('#evidenceTitle')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});
