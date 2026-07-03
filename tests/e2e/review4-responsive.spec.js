const { test, expect } = require('@playwright/test');

const viewports = [
  { name: 'phone', width: 390, height: 844, layout: 'phone' },
  { name: 'tablet portrait', width: 820, height: 1180, layout: 'tablet' },
  { name: 'tablet landscape', width: 1024, height: 768, layout: 'tablet' },
  { name: 'desktop', width: 1366, height: 768, layout: 'desktop' },
  { name: 'wide desktop', width: 1600, height: 900, layout: 'desktop' }
];

const pages = [
  { name: 'hub', path: '/review/review4-html/index.html', quiz: false },
  { name: 'confirm', path: '/review/review4-html/confirm.html', quiz: true },
  { name: 'evaluate', path: '/review/review4-html/evaluate.html', quiz: true },
  { name: 'listening', path: '/review/review4-html/listening.html', quiz: true },
  { name: 'reading writing', path: '/review/review4-html/reading-writing.html', quiz: true }
];

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => (
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  ));
  expect(overflow).toBeLessThanOrEqual(1);
}

async function startQuizIfNeeded(page, target) {
  if (!target.quiz) return;
  const nameInput = page.locator('#studentNameInput');
  if (await nameInput.count()) {
    await nameInput.fill('테스트학생');
  }
  await page.locator('[data-action="start"], [data-action="resume"]').first().click();
  await expect(page.locator('.question-card')).toBeVisible();
}

test.describe('Review 4 responsive layout', () => {
  test('fits hub and section quiz screens across viewport sizes', async ({ browser }) => {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      await context.addInitScript(() => localStorage.clear());
      const page = await context.newPage();

      for (const target of pages) {
        await page.goto(target.path, { waitUntil: 'load' });
        await expect(page.locator('.app-shell')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('data-layout', viewport.layout);
        await expectNoHorizontalOverflow(page);

        if (target.quiz) {
          await startQuizIfNeeded(page, target);
          await expect(page.locator('body')).toHaveAttribute('data-view', 'quiz');
          await expectNoHorizontalOverflow(page);
        }
      }

      await context.close();
    }
  });

  test('uses the wider learning layout on desktop auto mode', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/review/review4-html/confirm.html', { waitUntil: 'load' });
    await page.locator('[data-action="start"]').click();

    const metrics = await page.evaluate(() => {
      const shell = document.querySelector('.app-shell').getBoundingClientRect();
      const layout = document.querySelector('.question-layout');
      const style = getComputedStyle(layout);
      return {
        layout: document.documentElement.getAttribute('data-layout'),
        preference: document.documentElement.getAttribute('data-layout-preference'),
        shellWidth: Math.round(shell.width),
        columns: style.gridTemplateColumns.split(' ').filter(Boolean).length
      };
    });

    expect(metrics).toMatchObject({
      layout: 'desktop',
      preference: 'auto',
      columns: 2
    });
    expect(metrics.shellWidth).toBeGreaterThanOrEqual(1050);
  });

  test('keeps manual phone and tablet previews while auto returns to desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/review/review4-html/confirm.html', { waitUntil: 'load' });

    await page.getByLabel('태블릿').click();
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'tablet');
    await expect(page.locator('html')).toHaveAttribute('data-layout-preference', 'tablet');

    await page.getByLabel('스마트폰').click();
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'phone');
    await expect(page.locator('html')).toHaveAttribute('data-layout-preference', 'phone');

    await page.getByLabel('자동').click();
    await expect(page.locator('html')).toHaveAttribute('data-layout', 'desktop');
    await expect(page.locator('html')).toHaveAttribute('data-layout-preference', 'auto');
    await expectNoHorizontalOverflow(page);
  });
});
