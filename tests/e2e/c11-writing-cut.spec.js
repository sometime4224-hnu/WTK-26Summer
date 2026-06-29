const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

async function openPage(page, path) {
  await blockExternalRequests(page);
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-image-panel]').waitFor();
}

test('c11 writing cut uses latest cuttoon assets and one-stop writing sections', async ({ page }) => {
  await openPage(page, '/c11/writing-cut.html');

  await expect(page.locator('h1')).toContainText('한 문장씩 쓰기');
  await expect(page.locator('[data-primary-image]')).toHaveAttribute('src', /assets\/c11\/reading-writing\/images\/cuttoon\/c11-reading-cuttoon-01\.webp$/);
  await expect(page.locator('[data-hint-drawer]')).toHaveCount(3);
  await expect(page.locator('[data-writing-section]')).toHaveCount(3);
  await expect(page.locator('[data-action="show-answer"]')).toHaveCount(0);
  await expect(page.locator('[data-hint-type="model"] [data-action="toggle-hint"]')).toBeDisabled();

  await page.locator('[data-action="toggle-hint"][data-hint="keywords"]').click();
  await expect(page.locator('[data-hint-type="keywords"]')).toContainText('회사에서');

  await page.locator('[data-action="draft-text"]').fill('회사에서 일하고 싶어요.');
  await page.locator('[data-action="check-draft"]').click();

  await expect(page.locator('[data-hint-type="model"] [data-action="toggle-hint"]')).toBeEnabled();
  await expect(page.locator('[data-model-sentence]')).toContainText('직장인이라면 누구든지 회사에서 꼭 필요한 사람이 되고 싶을 것이다.');
  await expect(page.locator('.feedback').first()).toContainText('핵심어 보완 필요');
  await expect(page.locator('[data-action="next"]')).toBeDisabled();

  const sentence = await page.evaluate(() => window.__C11_WRITING_CUT.getCurrentSentence());
  await page.locator('[data-action="revision-text"]').fill(sentence);
  await page.locator('[data-action="check-revision"]').click();
  await expect(page.locator('[data-action="next"]')).toBeEnabled();

  await page.locator('[data-action="next"]').click();
  await expect(page.locator('[data-primary-image]')).toHaveAttribute('src', /c11-reading-cuttoon-02\.webp$/);
});

test('c11 writing cut lets strong meaning reconstruction proceed without revision', async ({ page }) => {
  await openPage(page, '/c11/writing-cut.html');

  await page.locator('[data-action="draft-text"]').fill('회사에서 필요한 사람이 되고 싶어요.');
  await page.locator('[data-action="check-draft"]').click();

  await expect(page.locator('.feedback').first()).toContainText('의미가 잘 전달');
  await expect(page.locator('[data-action="next"]')).toBeEnabled();
});

test('c11 writing cut teacher page jumps to cuts and stores teacher progress separately', async ({ page }) => {
  await openPage(page, '/c11/writing-cut-teacher.html');

  await expect(page.locator('.teacher-banner')).toContainText('교사용 버전');
  await expect(page.locator('[data-action="jump-to-cut"]')).toHaveCount(15);
  await expect(page.locator('[data-action="show-answer"]')).toBeVisible();
  await expect(page.locator('[data-hint-type="model"] [data-action="toggle-hint"]')).toBeEnabled();

  await page.locator('[data-action="jump-to-cut"][data-cut-index="14"]').click();
  await expect(page.locator('[data-primary-image]')).toHaveAttribute('src', /c11-reading-cuttoon-15\.webp$/);

  await page.locator('[data-action="show-answer"]').click();
  await expect(page.locator('[data-action="draft-text"]')).toHaveValue('경제 경영 서적을 읽으면 업무에 필요한 지식을 얻을 수 있다.');
  await expect(page.locator('[data-action="revision-text"]')).toHaveValue('경제 경영 서적을 읽으면 업무에 필요한 지식을 얻을 수 있다.');

  const storageKeys = await page.evaluate(() => ({
    teacher: window.localStorage.getItem('writing_cut_c11_writer_teacher_v2'),
    student: window.localStorage.getItem('writing_cut_c11_writer_v2')
  }));
  expect(storageKeys.teacher).toBeTruthy();
  expect(storageKeys.student).toBeNull();
});
