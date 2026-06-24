const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function openActivity(page, path = '/c12/grammar1-form-typing.html', viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await blockExternalRequests(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

async function expectNoHorizontalOverflow(page) {
  await expect.poll(async () => (
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)
  )).toBe(true);
}

async function currentAnswer(page) {
  return page.evaluate(() => {
    const data = window.__C12_GRAMMAR_FORM_TYPING_DATA__;
    const state = window.__C12_GRAMMAR_FORM_TYPING__.getState();
    return data.items.filter((item) => item.grammar === state.grammar)[state.index].answer;
  });
}

test('c12 grammar form typing page opens responsively', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1180, height: 820 },
    { width: 1280, height: 900 }
  ];

  for (const viewport of viewports) {
    await openActivity(page, '/c12/grammar1-form-typing.html', viewport);
    await expect(page.locator('h1')).toContainText('활용형 쓰기');
    await expect(page.locator('#promptText')).toContainText('____');
    await expect(page.locator('#answerInput')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await openActivity(page, '/c12/grammar2-form-typing.html', viewport);
    await expect(page.locator('h1')).toContainText('활용형 쓰기');
    await expect(page.locator('#promptText')).toContainText('____');
    await expect(page.locator('#answerInput')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test('exposes expanded separate item data shapes', async ({ page }) => {
  await openActivity(page, '/c12/grammar1-form-typing.html');

  const grammar1Shape = await page.evaluate(() => {
    const items = window.__C12_GRAMMAR_FORM_TYPING_DATA__.items;
    return {
      total: items.length,
      grammar: window.__C12_GRAMMAR_FORM_TYPING_DATA__.grammar.key,
      levels: ['guide', 'partial', 'independent'].map((level) => items.filter((item) => item.level === level).length),
      keys: Object.keys(items[0]).sort()
    };
  });

  expect(grammar1Shape).toEqual({
    total: 24,
    grammar: 'grammar1',
    levels: [4, 8, 12],
    keys: ['accepted', 'answer', 'cue', 'grammar', 'guide', 'id', 'level', 'prompt', 'rule'].sort()
  });

  await openActivity(page, '/c12/grammar2-form-typing.html');

  const grammar2Shape = await page.evaluate(() => {
    const items = window.__C12_GRAMMAR_FORM_TYPING_DATA__.items;
    return {
      total: items.length,
      grammar: window.__C12_GRAMMAR_FORM_TYPING_DATA__.grammar.key,
      levels: ['guide', 'partial', 'independent'].map((level) => items.filter((item) => item.level === level).length),
      firstCue: items[0].cue
    };
  });

  expect(grammar2Shape).toEqual({
    total: 20,
    grammar: 'grammar2',
    levels: [4, 8, 8],
    firstCue: '맛있다'
  });
});

test('independent pages do not render grammar tabs and link to each other', async ({ page }) => {
  await openActivity(page, '/c12/grammar1-form-typing.html');
  await expect(page.locator('[role="tab"]')).toHaveCount(0);
  await expect(page.locator('#grammarBadge')).toContainText('문법 1');
  await expect(page.getByRole('link', { name: /문법 2 활용형/ }).first()).toHaveAttribute('href', 'grammar2-form-typing.html');

  await openActivity(page, '/c12/grammar2-form-typing.html');
  await expect(page.locator('[role="tab"]')).toHaveCount(0);
  await expect(page.locator('#grammarBadge')).toContainText('문법 2');
  await expect(page.getByRole('link', { name: /문법 1 활용형/ }).first()).toHaveAttribute('href', 'grammar1-form-typing.html');
});

test('typing accepts correct forms and completes grammar1', async ({ page }) => {
  await openActivity(page, '/c12/grammar1-form-typing.html');

  const total = await page.evaluate(() => window.__C12_GRAMMAR_FORM_TYPING_DATA__.items.length);
  for (let index = 0; index < total; index += 1) {
    await page.locator('#answerInput').fill(await currentAnswer(page));
    await page.locator('#checkBtn').click();
    await expect(page.locator('#feedback')).toHaveClass(/ok/);
    await page.locator('#nextBtn').click();
  }

  await expect(page.locator('#finishCard')).toBeVisible();
  await expect(page.locator('.finish-score')).toContainText(`${total} / ${total}`);
});

test('wrong answers show the correct form and one short rule', async ({ page }) => {
  await openActivity(page, '/c12/grammar1-form-typing.html');

  await page.locator('#answerInput').fill('하더니');
  await page.locator('#checkBtn').click();

  await expect(page.locator('#feedback')).toHaveClass(/bad/);
  await expect(page.locator('#feedback')).toContainText('정답: 했더니');
  await expect(page.locator('#feedback')).toContainText('하다는 했더니로 줄어듭니다.');
  await expect(page.locator('#nextBtn')).toBeVisible();
});

test('enter submits answers and ascii input warns about keyboard state', async ({ page }) => {
  await openActivity(page, '/c12/grammar1-form-typing.html');

  await page.locator('#answerInput').fill('haetdeoni');
  await page.keyboard.press('Enter');
  await expect(page.locator('#feedback')).toHaveClass(/warn/);
  await expect(page.locator('#feedback')).toContainText('한/영 키를 확인하세요.');
  await expect(page.locator('#answerInput')).toBeEnabled();

  await page.locator('#answerInput').fill('했더니');
  await page.keyboard.press('Enter');
  await expect(page.locator('#feedback')).toHaveClass(/ok/);
  await expect(page.locator('#progressText')).toContainText('2 / 24');
});

test('hub and grammar pages link to the form typing activity', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await blockExternalRequests(page);

  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });
  const hubLinks = page.getByRole('link', { name: /활용형 쓰기/ });
  await expect(hubLinks).toHaveCount(2);
  await expect(hubLinks.nth(0)).toHaveAttribute('href', 'grammar1-form-typing.html');
  await expect(hubLinks.nth(1)).toHaveAttribute('href', 'grammar2-form-typing.html');

  await page.goto('/c12/grammar1.html', { waitUntil: 'domcontentloaded' });
  const grammar1Link = page.getByRole('link', { name: '활용형 쓰기' }).first();
  await expect(grammar1Link).toBeVisible();
  await grammar1Link.click();
  await expect(page).toHaveURL(/\/c12\/grammar1-form-typing\.html$/);

  await page.goto('/c12/grammar2.html', { waitUntil: 'domcontentloaded' });
  const grammar2Link = page.getByRole('link', { name: '활용형 쓰기' }).first();
  await expect(grammar2Link).toBeVisible();
  await grammar2Link.click();
  await expect(page).toHaveURL(/\/c12\/grammar2-form-typing\.html$/);
});
