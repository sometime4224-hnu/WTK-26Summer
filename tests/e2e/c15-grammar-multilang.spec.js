const { test, expect } = require('@playwright/test');

const pages = [
  { path: '/c15/grammar1.html', title: 'V-게 하다' },
  { path: '/c15/grammar2.html', title: 'A/V-(으)ㄹ걸(요)' }
];

const languages = ['en', 'vi', 'ar', 'mn', 'kk', 'th'];

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

test('C15 grammar 1 and 2 use the shared multilingual scaffold instead of a Vietnamese-only control', async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => localStorage.removeItem('preferred-lang'));
  await page.setViewportSize({ width: 390, height: 844 });

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText(target.title);
    await expect(page.locator('#viToggle')).toHaveCount(0);
    await expect(page.locator('[data-multilang-btn]')).toHaveCount(7);
    await expect(page.locator('.multilang-scaffold__box')).toHaveCount(languages.length);

    const firstScreen = await page.evaluate(() => {
      const target = document.querySelector('h1').getBoundingClientRect();
      const action = document.querySelector('#tabLearn').getBoundingClientRect();
      return {
        actionBottom: action.bottom,
        targetTop: target.top,
        viewportHeight: window.innerHeight
      };
    });
    expect(firstScreen.targetTop).toBeLessThanOrEqual(280);
    expect(firstScreen.actionBottom).toBeLessThanOrEqual(firstScreen.viewportHeight);

    for (const code of languages) {
      await page.locator(`[data-multilang-btn="${code}"]`).click();
      await expect(page.locator('body')).toHaveAttribute('data-active-lang', code);
      await expect(page.locator(`.multilang-scaffold__box[data-lang="${code}"]`)).toBeVisible();
      await expect(page.locator('.multilang-scaffold__box.lang-visible')).toHaveCount(1);
    }

    await page.locator('[data-multilang-btn="none"]').click();
    await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
    await expect(page.locator('.multilang-scaffold__box.lang-visible')).toHaveCount(0);
    const hasHorizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > window.innerWidth + 1
    ));
    expect(hasHorizontalOverflow).toBe(false);
  }
});

test('C15 grammar 2 multilingual help matches its soft-guessing lesson target', async ({ page }) => {
  await blockExternalRequests(page);
  await page.addInitScript(() => localStorage.removeItem('preferred-lang'));
  await page.goto('/c15/grammar2.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-multilang-btn="en"]').click();
  const englishHelp = page.locator('.multilang-scaffold__box[data-lang="en"]');
  await expect(englishHelp).toContainText('light guess');
  await expect(englishHelp).toContainText('conversational response');
  await expect(englishHelp).not.toContainText('regret');
});
