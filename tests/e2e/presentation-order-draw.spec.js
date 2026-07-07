const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

test('draws a full presentation order and enables copying', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/apps/standalone-pages/presentation-order-draw.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-action="start-draw"]')).toBeVisible();
  await expect(page.locator('#result-count')).toHaveText('0');

  await page.locator('[data-action="start-draw"]').click();
  await expect(page.locator('#status-pill')).toHaveText('섞는 중');

  await expect
    .poll(async () => page.locator('[data-result-item]').count(), { timeout: 8_000 })
    .toBe(25);

  await expect(page.locator('#status-pill')).toHaveText('완료');
  await expect(page.locator('[data-action="copy-result"]')).toBeEnabled();
  await expect(page.locator('#result-count')).toHaveText('25');
  await expect(page.locator('[data-mix-board] .chip.compact')).toHaveCount(25);

  const names = await page.locator('[data-result-item] .name').allTextContents();
  expect(new Set(names).size).toBe(25);
  expect(names).toContain('응오 티 번 니');
});

test('excludes checked students from the draw', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/apps/standalone-pages/presentation-order-draw.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-action="open-exclusions"]').click();
  await expect(page.locator('#exclusion-modal')).toHaveClass(/open/);
  await page.locator('[data-action="toggle-exclusion"][data-index="0"]').check();
  await page.locator('[data-action="toggle-exclusion"][data-index="5"]').check();
  await page.locator('[data-action="close-exclusions"]').click();

  await expect(page.locator('#active-count')).toHaveText('23');
  await expect(page.locator('#excluded-count')).toHaveText('2');
  await expect(page.locator('#result-total')).toHaveText('23');

  await page.locator('[data-action="start-draw"]').click();

  await expect
    .poll(async () => page.locator('[data-result-item]').count(), { timeout: 8_000 })
    .toBe(23);
  await expect(page.locator('[data-mix-board] .chip.compact')).toHaveCount(23);

  const names = await page.locator('[data-result-item] .name').allTextContents();
  expect(names).not.toContain('짠 하 로안 안');
  expect(names).not.toContain('응웬 반 람');
  expect(new Set(names).size).toBe(23);
});

test('uses the corrected class 7 roster spelling', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/apps/standalone-pages/presentation-order-draw.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-action="open-exclusions"]').click();
  await expect(page.locator('#roster-list')).toContainText('응오 티 번 니');
  await expect(page.locator('#roster-list')).not.toContainText('응으 티 번 니');
});

test('keeps final board names visible in a zoom-like pc viewport', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 1100, height: 560 });
  await page.goto('/apps/standalone-pages/presentation-order-draw.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-mix-board] .chip.compact')).toHaveCount(25);
  await page.waitForTimeout(500);

  const layoutProblems = await page.evaluate(() => {
    const board = document.querySelector('[data-mix-board]');
    const boardBox = board.getBoundingClientRect();
    const clippedNames = Array.from(document.querySelectorAll('.chip.compact .chip-label'))
      .filter((label) => label.scrollWidth > label.clientWidth + 1)
      .map((label) => label.textContent.trim());
    const chipBoxes = Array.from(document.querySelectorAll('.chip.compact')).map((chip) => ({
      text: chip.textContent.trim(),
      box: chip.getBoundingClientRect()
    }));
    const overflowingChips = Array.from(document.querySelectorAll('.chip.compact'))
      .filter((chip) => {
        const box = chip.getBoundingClientRect();
        return (
          box.left < boardBox.left - 1
          || box.right > boardBox.right + 1
          || box.top < boardBox.top - 1
          || box.bottom > boardBox.bottom + 1
        );
      })
      .map((chip) => chip.textContent.trim());
    const overlappingPairs = [];

    for (let index = 0; index < chipBoxes.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < chipBoxes.length; nextIndex += 1) {
        const first = chipBoxes[index];
        const second = chipBoxes[nextIndex];
        const separated = (
          first.box.right <= second.box.left + 1
          || second.box.right <= first.box.left + 1
          || first.box.bottom <= second.box.top + 1
          || second.box.bottom <= first.box.top + 1
        );

        if (!separated) {
          overlappingPairs.push(`${first.text} / ${second.text}`);
        }
      }
    }

    return { clippedNames, overflowingChips, overlappingPairs };
  });

  expect(layoutProblems).toEqual({ clippedNames: [], overflowingChips: [], overlappingPairs: [] });
});
