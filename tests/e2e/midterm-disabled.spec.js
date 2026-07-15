const { test, expect } = require('@playwright/test');

test('midterm links are absent and retired pages return 404', async ({ page, request }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('a[href="midterm-exam/index.html"]')).toHaveCount(0);
  await expect(page.locator('a[href="exam/midterm-speaking-prep-3b-2026-summer.html"]')).toHaveCount(0);

  const hubResponse = await request.get('/midterm-exam/index.html');
  const speakingResponse = await request.get('/exam/midterm-speaking-prep-3b-2026-summer.html');

  expect(hubResponse.status()).toBe(404);
  expect(speakingResponse.status()).toBe(404);
});
