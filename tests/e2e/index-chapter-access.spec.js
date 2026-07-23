const { test, expect } = require('@playwright/test');

test('메인 허브에서 16과는 활성화되어 단원 페이지로 이동한다', async ({ page }) => {
  await page.goto('/index.html', { waitUntil: 'domcontentloaded' });

  const chapter16 = page.locator('a.chapter-card[data-chapter="c16"]');
  await expect(chapter16).toHaveCount(1);
  await expect(chapter16).not.toHaveClass(/disabled/);
  await expect(chapter16).not.toHaveAttribute('aria-disabled', 'true');
  await expect(chapter16.locator('.status-badge')).toHaveCount(0);

  await chapter16.click();
  await expect(page).toHaveURL(/\/c16\/index\.html$/);
});
