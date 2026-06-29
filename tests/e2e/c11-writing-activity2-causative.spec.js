const { test, expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function openFresh(page) {
  await page.goto('/c11/writing-activity2-causative.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function fillSlot(page, tokenId, slotId) {
  await page.locator(`[data-testid="token-chip"][data-token="${tokenId}"]`).click();
  await page.locator(`[data-testid="slot"][data-slot="${slotId}"]`).click();
}

test('c11 writing activity2 loads as a visual slot writing page', async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await openFresh(page);

    await expect(page.getByTestId('counter')).toHaveText('1 / 28');
    await expect(page.getByTestId('suffix-button')).toHaveCount(8);
    await expect(page.locator('main p, main h1, main h2')).toHaveCount(0);
    await expect(page.getByTestId('drill-image')).toBeVisible();
    await expect.poll(() => page.getByTestId('drill-image').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByTestId('slot')).toHaveCount(2);
    await expect(page.getByTestId('token-chip')).toHaveCount(2);
    await expect(page.getByTestId('token-chip').last()).toHaveText('곰 인형');
    await expect(page.getByTestId('token-tray')).toHaveAttribute('data-step', '1');
    await expect(page.getByTestId('slot-board')).toHaveAttribute('data-step', '2');
    await expect(page.getByTestId('input-row')).toHaveAttribute('data-step', '3');
    await expect(page.getByTestId('sentence-input')).toBeDisabled();
    await expect(page.getByTestId('next-button')).toBeDisabled();
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 writing activity2 unlocks input after slots and checks the sentence', async ({ page }) => {
  await openFresh(page);

  await fillSlot(page, 'causer', 'causer');
  await fillSlot(page, 'target', 'target');
  await expect(page.getByTestId('sentence-input')).toBeEnabled();
  await expect(page.getByTestId('input-row')).toHaveClass(/is-active/);

  await page.getByTestId('sentence-input').fill('아이 가 곰인형 을 숨겨요.');
  await page.getByTestId('check-button').click();
  await expect(page.getByTestId('status-light')).toHaveClass(/is-good/);
  await expect(page.getByTestId('next-button')).toBeEnabled();
  await expect(page.getByTestId('next-button')).toHaveClass(/is-available/);
  await expect(page.getByTestId('flow-stage')).toHaveClass(/is-success/);

  await page.getByTestId('next-button').click();
  await expect(page.getByTestId('counter')).toHaveText('2 / 28');
  await expect(page.getByTestId('causative-verb')).toHaveText('씻기다');
});

test('c11 writing activity2 allows the next card after an incorrect checked answer', async ({ page }) => {
  await openFresh(page);

  await fillSlot(page, 'causer', 'causer');
  await fillSlot(page, 'target', 'target');
  await page.getByTestId('sentence-input').fill('아이가 곰 인형을 먹어요');
  await page.getByTestId('check-button').click();

  await expect(page.getByTestId('status-light')).toHaveClass(/is-bad/);
  await expect(page.getByTestId('next-button')).toBeEnabled();
  await expect(page.getByTestId('next-button')).toHaveClass(/is-available/);
  await expect(page.getByTestId('flow-stage')).not.toHaveClass(/is-success/);

  const snapshot = await page.evaluate(() => window.__C11_CAUSATIVE_WRITING.getState());
  expect(snapshot.done).not.toContain('hide');
  expect(snapshot.attempted).toContain('hide');

  await page.getByTestId('next-button').click();
  await expect(page.getByTestId('counter')).toHaveText('2 / 28');
  await expect(page.getByTestId('causative-verb')).toHaveText('씻기다');
});

test('c11 writing activity2 filters suffix groups and resets only the current card', async ({ page }) => {
  await openFresh(page);

  await page.locator('[data-testid="suffix-button"][data-suffix="-히"]').click();
  await expect(page.getByTestId('counter')).toHaveText('1 / 5');
  await expect(page.getByTestId('causative-verb')).toHaveText('눕히다');
  await expect(page.getByTestId('slot')).toHaveCount(2);

  await fillSlot(page, 'causer', 'causer');
  await fillSlot(page, 'target', 'target');
  await page.getByTestId('sentence-input').fill('엄마가 아기를 눕힌다');
  await page.getByTestId('check-button').click();
  await expect(page.getByTestId('next-button')).toBeEnabled();

  await page.getByTestId('reset-button').click();
  await expect(page.getByTestId('sentence-input')).toHaveValue('');
  await expect(page.getByTestId('sentence-input')).toBeDisabled();
  await expect(page.getByTestId('next-button')).toBeDisabled();
  await expect(page.locator('[data-testid="slot"].is-empty')).toHaveCount(2);
});

test('c11 writing activity2 persists current drill progress and exposes its API', async ({ page }) => {
  await openFresh(page);

  const drill = await page.evaluate(() => {
    window.__C11_CAUSATIVE_WRITING.setDrill('eat');
    return window.__C11_CAUSATIVE_WRITING.getCurrentDrill();
  });
  expect(drill.id).toBe('eat');
  expect(drill.causative).toBe('먹이다');
  await expect(page.getByTestId('causative-verb')).toHaveText('먹이다');
  await expect(page.getByTestId('slot')).toHaveCount(3);

  await fillSlot(page, 'causer', 'causer');
  await fillSlot(page, 'target', 'target');
  await fillSlot(page, 'object', 'object');
  await page.getByTestId('sentence-input').fill('엄마가 아이에게 밥을 먹인다');
  await page.getByTestId('check-button').click();

  const snapshot = await page.evaluate(() => ({
    state: window.__C11_CAUSATIVE_WRITING.getState(),
    normalized: window.__C11_CAUSATIVE_WRITING.normalizeSentence(' 엄마가  아이에게 밥을 먹인다. ')
  }));
  expect(snapshot.state.currentId).toBe('eat');
  expect(snapshot.state.done).toContain('eat');
  expect(snapshot.state.attempted).toContain('eat');
  expect(snapshot.normalized).toBe('엄마가 아이에게 밥을 먹인다');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('causative-verb')).toHaveText('먹이다');
  await expect(page.getByTestId('sentence-input')).toHaveValue('엄마가 아이에게 밥을 먹인다');
  await expect(page.getByTestId('next-button')).toBeEnabled();
});
