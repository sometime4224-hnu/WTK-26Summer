const { test, expect } = require('@playwright/test');

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test('c11 causative construction lab keeps the requested minimal layout responsive', async ({ page }) => {
  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar1-causative-construction-lab.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('nav, h1, h2, p')).toHaveCount(0);
    await expect(page.getByTestId('sentence-pattern')).toContainText('____');
    await expect(page.locator('#verbWord')).toHaveText('먹이다');
    await expect(page.getByTestId('verb-button')).toHaveCount(8);
    await expect(page.getByTestId('diagram-board')).toBeVisible();
    await expect(page.getByTestId('object-smaller')).toHaveText('-');
    await expect(page.getByTestId('object-bigger')).toHaveText('+');
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 causative construction lab changes verbs and fills the sentence blank', async ({ page }) => {
  await page.goto('/c11/grammar1-causative-construction-lab.html', { waitUntil: 'domcontentloaded' });

  await page.getByRole('button', { name: '입히다' }).click();
  await expect(page.locator('#verbWord')).toHaveText('입히다');

  await page.locator('.palette-token[data-token="rice"]').click();
  await page.getByTestId('sentence-blank').click();
  await expect(page.getByTestId('sentence-blank')).toHaveText('밥');

  const coffeeBox = await page.locator('.palette-token[data-token="coffee"]').boundingBox();
  const blankBox = await page.getByTestId('sentence-blank').boundingBox();
  expect(coffeeBox).not.toBeNull();
  expect(blankBox).not.toBeNull();

  await page.mouse.move(coffeeBox.x + coffeeBox.width / 2, coffeeBox.y + coffeeBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(blankBox.x + blankBox.width / 2, blankBox.y + blankBox.height / 2, { steps: 8 });
  await page.mouse.up();

  await expect(page.getByTestId('sentence-blank')).toHaveText('커피');
});

test('c11 causative construction lab places diagram tokens and resizes arrows', async ({ page }) => {
  await page.goto('/c11/grammar1-causative-construction-lab.html', { waitUntil: 'domcontentloaded' });

  const board = page.getByTestId('diagram-board');
  const boardBox = await board.boundingBox();
  expect(boardBox).not.toBeNull();

  await page.locator('.palette-token[data-token="friend"]').click();
  await page.mouse.click(boardBox.x + boardBox.width * 0.58, boardBox.y + boardBox.height * 0.52);
  const friendToken = page.locator('.board-token[data-token="friend"]');
  await expect(friendToken).toBeVisible();
  await expect(friendToken).not.toContainText('친구');
  await expect(friendToken.locator('.token-label')).toHaveCount(0);

  const beforeSize = await friendToken.boundingBox();
  expect(beforeSize).not.toBeNull();
  await page.getByTestId('object-bigger').click();
  const afterSize = await friendToken.boundingBox();
  expect(afterSize).not.toBeNull();
  expect(afterSize.width).toBeGreaterThan(beforeSize.width);

  await friendToken.dblclick();
  await expect(page.locator('.board-token[data-token="friend"]')).toHaveCount(0);

  await page.locator('.arrow-tool[data-arrow-type="solid"]').click();
  await expect(page.locator('.diagram-arrow')).toHaveCount(1);

  const arrow = page.locator('.diagram-arrow').first();
  const beforeX2 = Number(await arrow.getAttribute('data-x2'));
  const endHandle = page.locator('.arrow-handle[data-handle="end"]').first();
  const endBox = await endHandle.boundingBox();
  expect(endBox).not.toBeNull();

  await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(endBox.x + endBox.width / 2 - 110, endBox.y + endBox.height / 2 + 60, { steps: 8 });
  await page.mouse.up();

  const afterX2 = Number(await arrow.getAttribute('data-x2'));
  expect(afterX2).not.toBe(beforeX2);

  const beforeX1 = Number(await arrow.getAttribute('data-x1'));
  const beforeCenterX2 = Number(await arrow.getAttribute('data-x2'));
  const centerHandle = page.locator('.arrow-handle[data-handle="center"]').first();
  const centerBox = await centerHandle.boundingBox();
  expect(centerBox).not.toBeNull();

  await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(centerBox.x + centerBox.width / 2 + 70, centerBox.y + centerBox.height / 2 + 35, { steps: 8 });
  await page.mouse.up();

  expect(Number(await arrow.getAttribute('data-x1'))).not.toBe(beforeX1);
  expect(Number(await arrow.getAttribute('data-x2'))).not.toBe(beforeCenterX2);
});

test('c11 causative construction lab reset restores the initial screen', async ({ page }) => {
  await page.goto('/c11/grammar1-causative-construction-lab.html', { waitUntil: 'domcontentloaded' });

  const board = page.getByTestId('diagram-board');
  const boardBox = await board.boundingBox();
  expect(boardBox).not.toBeNull();

  await page.getByRole('button', { name: '태우다' }).click();
  await page.locator('.palette-token[data-token="water"]').click();
  await page.getByTestId('sentence-blank').click();
  await page.mouse.click(boardBox.x + boardBox.width * 0.52, boardBox.y + boardBox.height * 0.48);
  await page.locator('.arrow-tool[data-arrow-type="dashed"]').click();
  await page.getByTestId('object-bigger').click();

  await expect(page.locator('#verbWord')).toHaveText('태우다');
  await expect(page.getByTestId('sentence-blank')).toHaveText('물');
  await expect(page.locator('.board-token')).toHaveCount(1);
  await expect(page.locator('.diagram-arrow')).toHaveCount(1);

  await page.getByTestId('reset-button').click();

  await expect(page.locator('#verbWord')).toHaveText('먹이다');
  await expect(page.getByTestId('sentence-blank')).toHaveText('____');
  await expect(page.locator('.board-token')).toHaveCount(0);
  await expect(page.locator('.diagram-arrow')).toHaveCount(0);
  await expect.poll(() => (
    board.evaluate((element) => getComputedStyle(element).getPropertyValue('--object-scale').trim())
  )).toBe('1.00');
});
