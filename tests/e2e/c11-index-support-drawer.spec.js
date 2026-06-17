const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

test('c11 hub keeps grammar support materials collapsed until opened', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  const grammar1Drawer = page.locator('details.support-drawer').filter({ hasText: '문법 1 보조 자료' });
  const grammar2Drawer = page.locator('details.support-drawer').filter({ hasText: '문법 2 보조 자료' });
  const grammar3Drawer = page.locator('details.support-drawer').filter({ hasText: '문법 3 보조 자료' });

  await expect(grammar1Drawer).toHaveCount(1);
  await expect(grammar2Drawer).toHaveCount(1);
  await expect(grammar3Drawer).toHaveCount(1);
  await expect(grammar1Drawer).not.toHaveAttribute('open', '');
  await expect(grammar2Drawer).not.toHaveAttribute('open', '');
  await expect(grammar3Drawer).not.toHaveAttribute('open', '');

  await expect(page.locator('a[href="grammar1.html"]')).toBeVisible();
  await expect(page.locator('a[href="grammar1-causative-influence-lab.html"]')).toBeHidden();
  await expect(page.locator('a[href="grammar2-if-balance-game.html"]')).toBeHidden();
  await expect(page.locator('a[href="grammar3-drill1.html"]')).toBeHidden();

  await grammar1Drawer.locator('summary.support-drawer__summary').click();

  await expect(grammar1Drawer).toHaveAttribute('open', '');
  await expect(grammar1Drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(8);
  await expect(page.locator('a[href="grammar1-causative-influence-lab.html"]')).toBeVisible();
  await expect(page.locator('a[href="grammar1-causative-patterns.html"]')).toBeVisible();

  await grammar2Drawer.locator('summary.support-drawer__summary').click();

  await expect(grammar2Drawer).toHaveAttribute('open', '');
  await expect(grammar2Drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(5);
  await expect(page.locator('a[href="grammar2-if-balance-game.html"]')).toBeVisible();

  await grammar3Drawer.locator('summary.support-drawer__summary').click();

  await expect(grammar3Drawer).toHaveAttribute('open', '');
  await expect(grammar3Drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(5);
  await expect(page.locator('a[href="grammar3-drill1.html"]')).toBeVisible();
});

test('c11 causative pattern support page loads the representative groups', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-patterns.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('heading', { name: '단형 사동 형태 규칙성' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ㄹ 받침' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '모음 끝' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '몸/상태 변화' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '반응/동작' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '단어쌍 암기' })).toBeVisible();
});
