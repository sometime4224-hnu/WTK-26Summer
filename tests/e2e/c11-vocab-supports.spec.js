const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

test.describe('Chapter 11 Vocabulary Support Activities', () => {
  
  test('index page lists vocabulary support pages inside drawer', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

    const drawer = page.locator('details.support-drawer').filter({ hasText: '어휘 보조 활동 및 자료' });
    await expect(drawer).toHaveCount(1);
    
    // Open drawer
    await drawer.locator('summary.support-drawer__summary').click();
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(7);
  });

  test('job-posting page matches candidate to job via click-to-select', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-job-posting.html', { waitUntil: 'domcontentloaded' });
    
    // Wait for dynamic render() to finish and settle
    await page.waitForTimeout(500);

    // Click candidate 1 (Kim Ji-woo) -> click Cafe job (job-3)
    const candidate = page.locator('.candidate-card[data-id="cand-1"]');
    const dropzone = page.locator('.job-card[data-id="job-3"]');
    
    await candidate.click();
    await page.waitForTimeout(200);
    await dropzone.click();

    // Verify it is matched
    await expect(dropzone).toHaveClass(/matched/);
    await expect(dropzone.locator('.matched-applicant')).toBeVisible();
  });

  test('org-chart page allows placing rank chip via drag-and-drop', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-org-chart.html', { waitUntil: 'domcontentloaded' });

    const chip = page.locator('.rank-chip[data-rank="부장"]');
    const slot = page.locator('#slot-manager');
    
    await chip.dragTo(slot);

    // Verify slot is filled and chip is placed
    await expect(slot).toHaveClass(/filled/);
    await expect(page.locator('#val-manager')).toHaveText('부장');
    await expect(chip).toHaveClass(/placed/);
  });

  test('welfare-balance page generates essay', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-welfare-balance.html', { waitUntil: 'domcontentloaded' });

    const textarea = page.locator('#paragraph-textbox');
    await expect(textarea).not.toBeEmpty();
    const val = await textarea.inputValue();
    expect(val).toContain('취업을 한다면');
  });

  test('work-scenario page steps through game via drag-and-drop and displays results', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-work-scenario.html', { waitUntil: 'domcontentloaded' });

    const decisionZone = page.locator('#decision-zone');

    // Drag first option of stage 1 to decision zone
    await page.locator('.option-card').first().dragTo(decisionZone);
    await page.waitForTimeout(1300); // Wait for floating animation / transition

    // Drag first option of stage 2
    await page.locator('.option-card').first().dragTo(decisionZone);
    await page.waitForTimeout(1300);

    // Drag first option of stage 3
    await page.locator('.option-card').first().dragTo(decisionZone);
    await page.waitForTimeout(1300);

    // Result panel should now be visible
    await expect(page.locator('#result-panel')).toBeVisible();
    await expect(page.locator('#result-title')).not.toBeEmpty();
  });
});
