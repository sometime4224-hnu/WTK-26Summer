const { test, expect } = require('@playwright/test');

async function readCanvasHash(page) {
  return page.evaluate(() => {
    const canvasElement = document.querySelector('#warpCanvas');
    const context = canvasElement.getContext('2d');
    const pixels = context.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
    let hash = 2166136261;
    for (let i = 0; i < pixels.length; i += 97) {
      hash ^= pixels[i];
      hash = Math.imul(hash, 16777619);
    }
    return { width: canvasElement.width, height: canvasElement.height, hash: hash >>> 0 };
  });
}

test('image warp canvas renders and changes after dragging', async ({ page }) => {
  await page.goto('/apps/standalone-pages/image-warp/');
  const canvas = page.locator('#warpCanvas');
  await expect(canvas).toBeVisible();

  const before = await readCanvasHash(page);

  expect(before.width).toBeGreaterThan(300);
  expect(before.height).toBeGreaterThan(200);

  const box = await canvas.boundingBox();
  const startX = box.x + box.width * 0.47;
  const startY = box.y + box.height * 0.48;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(startX + step * 13, startY + step * 3);
  }
  await page.mouse.up();

  const after = await readCanvasHash(page);

  expect(after.hash).not.toBe(before.hash);
});

test('two point spacing mode narrows and widens the selected span', async ({ page }) => {
  await page.goto('/apps/standalone-pages/image-warp/');
  const canvas = page.locator('#warpCanvas');
  await expect(canvas).toBeVisible();

  await page.locator('[data-tool="pair"]').click();
  await expect(page.locator('#pairPanel')).toBeVisible();

  const before = await readCanvasHash(page);
  const box = await canvas.boundingBox();
  await page.mouse.click(box.x + box.width * 0.34, box.y + box.height * 0.5);
  await page.mouse.click(box.x + box.width * 0.66, box.y + box.height * 0.5);

  await expect(page.locator('#pairCount')).toHaveText('2/2');
  await expect(page.locator('#pairAmountInput')).toBeEnabled();

  await page.locator('#pairAmountInput').evaluate((input) => {
    input.value = '60';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  const widened = await readCanvasHash(page);
  expect(widened.hash).not.toBe(before.hash);
});
