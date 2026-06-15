const { test, expect } = require('@playwright/test');

const splitPages = [
  { path: '/c10/writing-cut.html', stepIndex: 0, title: '1단계 객관식' },
  { path: '/c10/writing-cut-step2.html', stepIndex: 1, title: '2단계 어휘 넣기' },
  { path: '/c10/writing-cut-step3.html', stepIndex: 2, title: '3단계 순서 배열' },
  { path: '/c10/writing-cut-step4.html', stepIndex: 3, title: '4단계 빈칸 쓰기' },
  { path: '/c10/writing-cut-step5.html', stepIndex: 4, title: '5단계 전체 문장 쓰기' }
];

async function openSplitPage(page, path) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-image-panel]').waitFor();
}

async function solveStepOneCut(page) {
  const choices = page.locator('[data-action="select-choice"]');
  const totalChoices = await choices.count();

  for (let index = 0; index < totalChoices; index += 1) {
    await choices.nth(index).click();
    await page.locator('[data-action="check-current"]').click();

    if (await page.locator('[data-action="next-cut"]').isEnabled()) return;
  }

  throw new Error('No correct step 1 choice found.');
}

test.describe('c10 split writing cut pages', () => {
  for (const splitPage of splitPages) {
    test(`renders ${splitPage.path}`, async ({ page }) => {
      await openSplitPage(page, splitPage.path);

      await expect(page.locator('h1')).toHaveText(splitPage.title);
      await expect(page.locator('.cut-grid button')).toHaveCount(15);
      await expect(page.locator('[data-primary-image]')).toHaveAttribute('src', /assets\/c10\/reading-writing\/images\/writing-cut\/01_love_feels_forever\.webp$/);
      await expect(page.locator('.step-tabs a').nth(splitPage.stepIndex)).toHaveAttribute('aria-current', 'page');

      const runtimeStep = await page.evaluate(() => window.C10_WRITING_CUT_SPLIT.stepIndex);
      expect(runtimeStep).toBe(splitPage.stepIndex);
    });
  }

  test('keeps step answers connected across split files', async ({ page }) => {
    await openSplitPage(page, '/c10/writing-cut.html');
    await solveStepOneCut(page);

    await page.locator('[data-action="next-cut"]').click();
    await expect(page.locator('[data-image-panel] h3')).toHaveText('컷 2');

    const stepOneState = await page.evaluate(() => {
      const stored = JSON.parse(window.localStorage.getItem(window.C10_WRITING_CUT_SPLIT.storageKey));
      return {
        activeStepOneCut: stored.activeCuts[0],
        firstCutChecked: stored.responses[0].step1.checked
      };
    });
    expect(stepOneState).toEqual({ activeStepOneCut: 1, firstCutChecked: true });

    await page.goto('/c10/writing-cut-step2.html', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-image-panel]').waitFor();
    await expect(page.locator('.split-status')).toContainText('1단계 완료 1 / 15');

    const words = page.locator('[data-action="use-word"]:not([disabled])');
    await words.nth(0).click();
    await words.nth(1).click();
    await page.locator('[data-action="check-current"]').click();

    const stepTwoState = await page.evaluate(() => {
      const stored = JSON.parse(window.localStorage.getItem(window.C10_WRITING_CUT_SPLIT.storageKey));
      return stored.responses[0].step2.checked;
    });
    expect(stepTwoState).toBe(true);
    await expect(page.locator('[data-action="next-cut"]')).toBeEnabled();
  });
});
