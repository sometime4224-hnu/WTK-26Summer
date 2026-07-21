const { test, expect } = require('@playwright/test');

const targets = [
  { path: '/c15/grammar1-workbook.html', title: 'V-게 하다', firstLabel: '부탁하기 1번 답', storageKey: 'korean3bimprove:c15:grammar1:workbook:v1' },
  { path: '/c15/grammar2-workbook.html', title: 'A/V-(으)ㄹ걸(요)', firstLabel: '근거를 보고 대답하기 1번 답', storageKey: 'korean3bimprove:c15:grammar2:workbook:v1' }
];

test('C15 hub places each workbook immediately after its grammar main page', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/c15/index.html', { waitUntil: 'domcontentloaded' });

  const grammar1Card = page.locator('article.path-card').filter({
    has: page.getByRole('heading', { name: 'V-게 하다', exact: true })
  });
  const grammar2Card = page.locator('article.path-card').filter({
    has: page.getByRole('heading', { name: 'A/V-(으)ㄹ걸(요)', exact: true })
  });

  const grammar1Links = await grammar1Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));
  const grammar2Links = await grammar2Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));

  expect(grammar1Links).toEqual(['grammar1.html', 'grammar1-workbook.html']);
  expect(grammar2Links).toEqual(['grammar2.html', 'grammar2-workbook.html']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('C15 workbook pages keep the first response usable on narrow portrait screens', async ({ page }) => {
  for (const target of targets) {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    await page.evaluate((key) => localStorage.removeItem(key), target.storageKey);
    await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText(target.title);
  await expect(page.getByLabel(target.firstLabel)).toBeVisible();

    const layout = await page.evaluate(() => {
      const firstInput = document.querySelector('input, textarea').getBoundingClientRect();
      return {
        firstInputBottom: firstInput.bottom,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        viewportHeight: window.innerHeight
      };
    });
    expect(layout.firstInputBottom).toBeLessThanOrEqual(layout.viewportHeight);
    expect(layout.horizontalOverflow).toBe(false);
  }
});

test('C15 grammar 1 workbook grades, restores, and page-scoped resets answers', async ({ page }) => {
  const storageKey = targets[0].storageKey;
  await page.goto(targets[0].path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-item="g1-ex1-0"] .wb-verb-hint')).toHaveText(/지내다/);
  await expect(page.locator('[data-item="g1-ex2-0"] .wb-verb-hint')).toHaveText(/자다/);
  await expect(page.locator('[data-item="g1-ex3-3"] .wb-verb-hint')).toHaveText(/소개해 주다/);

  const answer = page.getByLabel('부탁하기 1번 답');
  await answer.fill('지내');
  await page.getByRole('button', { name: '부탁하기 답 확인' }).click();
  await expect(page.locator('[data-item="g1-ex1-0"] .wb-item__feedback')).toHaveText('맞아요.');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel('부탁하기 1번 답')).toHaveValue('지내');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '이 워크북 초기화' }).click();
  await expect(page.getByLabel('부탁하기 1번 답')).toHaveValue('');
});

test('C15 grammar 2 workbook checks a source-based response', async ({ page }) => {
  const storageKey = targets[1].storageKey;
  await page.goto(targets[1].path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-item="g2-ex1-1"] .wb-verb-hint')).toHaveText(/어렵다/);
  await expect(page.locator('[data-item="g2-ex2-0"] .wb-verb-hint')).toHaveText(/고쳐 주다/);
  await expect(page.locator('[data-item="g2-ex3-0"] .wb-verb-hint')).toHaveText(/바쁘다/);

  await page.getByLabel('근거를 보고 대답하기 1번 답').fill('인터넷으로 낼 수 있을걸요');
  await page.getByRole('button', { name: '근거를 보고 대답하기 답 확인' }).click();
  await expect(page.locator('[data-item="g2-ex1-0"] .wb-item__feedback')).toHaveText('맞아요.');
});
