const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

test('c11 hub keeps grammar1 support materials collapsed until opened', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  const drawer = page.locator('details.support-drawer').filter({ hasText: '문법 1 보조 자료' });
  await expect(drawer).toHaveCount(1);
  await expect(drawer).not.toHaveAttribute('open', '');
  await expect(page.locator('a[href="grammar1.html"]')).toBeVisible();
  await expect(page.locator('a[href="grammar1-causative-influence-lab.html"]')).toBeHidden();

  await drawer.locator('summary.support-drawer__summary').click();

  await expect(drawer).toHaveAttribute('open', '');
  await expect(drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(6);
  await expect(page.locator('a[href="grammar1-causative-influence-lab.html"]')).toBeVisible();
});
