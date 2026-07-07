const { test, expect } = require('@playwright/test');

const STORAGE_KEY = 'teacher-homework-checker-v1';

async function openFreshChecker(page) {
  await page.goto('/teacher-dashboard/homework-check.html', { waitUntil: 'load' });
  await page.evaluate((key) => {
    window.localStorage.removeItem(key);
  }, STORAGE_KEY);
  await page.reload({ waitUntil: 'load' });
}

test.describe('teacher homework checker', () => {
  test('shows the class rosters with five empty date columns by default', async ({ page }) => {
    await openFreshChecker(page);

    await expect(page.locator('h1')).toHaveText('숙제 확인표');
    await expect(page.locator('[data-date-input]')).toHaveCount(5);
    await expect(page.locator('[data-student-row]')).toHaveCount(25);
    await expect(page.locator('[data-student-row]').first()).toContainText('짠 하 로안 안');
    await expect(page.locator('[data-student-row]').last()).toContainText('원 티 응옥 린');

    await page.getByRole('tab', { name: '6반' }).click();

    await expect(page.locator('[data-date-input]')).toHaveCount(5);
    await expect(page.locator('[data-student-row]')).toHaveCount(25);
    await expect(page.locator('[data-student-row]').first()).toContainText('칭 텐 김');
    await expect(page.locator('[data-student-row]').last()).toContainText('이잉잉');
  });

  test('adds dates and only shows delete buttons in delete mode with confirmation', async ({ page }) => {
    await openFreshChecker(page);

    await expect(page.locator('[data-delete-date]')).toHaveCount(0);

    await page.getByRole('button', { name: '날짜 추가' }).click();
    await expect(page.locator('[data-date-input]')).toHaveCount(6);

    await page.locator('#deleteModeToggle').click();
    await expect(page.locator('#deleteModeToggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-delete-date]')).toHaveCount(6);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('삭제');
      await dialog.dismiss();
    });
    await page.locator('[data-delete-date]').first().click();
    await expect(page.locator('[data-date-input]')).toHaveCount(6);

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('삭제');
      await dialog.accept();
    });
    await page.locator('[data-delete-date]').first().click();
    await expect(page.locator('[data-date-input]')).toHaveCount(5);

    await page.locator('#deleteModeToggle').click();
    await expect(page.locator('[data-delete-date]')).toHaveCount(0);
  });

  test('cycles marks and keeps dates and marks after reload', async ({ page }) => {
    await openFreshChecker(page);

    await page.locator('[data-date-input]').first().fill('2026-07-07');

    const firstCell = page.locator('[data-mark-cell="0-date-1"]');
    await expect(firstCell).toHaveText('');

    await firstCell.click();
    await expect(page.locator('[data-mark-cell="0-date-1"]')).toHaveText('O');
    await expect(page.locator('.summary-card.is-done')).toContainText('1');

    await page.locator('[data-mark-cell="0-date-1"]').click();
    await expect(page.locator('[data-mark-cell="0-date-1"]')).toHaveText('X');
    await expect(page.locator('.summary-card.is-missing')).toContainText('1');

    await page.locator('[data-mark-cell="0-date-1"]').click();
    await expect(page.locator('[data-mark-cell="0-date-1"]')).toHaveText('');

    await page.locator('[data-mark-cell="0-date-1"]').click();
    await expect(page.locator('[data-mark-cell="0-date-1"]')).toHaveText('O');

    await page.reload({ waitUntil: 'load' });

    await expect(page.locator('[data-date-input]').first()).toHaveValue('2026-07-07');
    await expect(page.locator('[data-mark-cell="0-date-1"]')).toHaveText('O');
  });

  test('uses a portrait-phone layout without page-wide horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await openFreshChecker(page);

    await expect(page.locator('.checker-table-scroll')).toBeHidden();
    await expect(page.locator('[data-mobile-checker-board]')).toBeVisible();
    await expect(page.locator('[data-mobile-student-card]')).toHaveCount(25);
    await expect(page.locator('[data-mobile-student-card]').first()).toContainText('짠 하 로안 안');

    await page.locator('[data-mobile-date-input]').first().fill('7/7');
    await page.locator('[data-mobile-mark-cell="0-date-1"]').click();
    await expect(page.locator('[data-mobile-mark-cell="0-date-1"]')).toHaveText('O');

    const pageWidth = await page.evaluate(() => ({
      viewport: window.innerWidth,
      scroll: document.documentElement.scrollWidth
    }));
    expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.viewport + 1);
  });
});
