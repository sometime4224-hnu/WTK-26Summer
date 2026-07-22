const { test, expect } = require('@playwright/test');

const targets = [
  { path: '/c15/grammar1-form-practice.html', title: 'V-게 하다', storageKey: 'korean3bimprove:c15:grammar1:form-practice:v1' },
  { path: '/c15/grammar2-form-practice.html', title: 'A/V-(으)ㄹ걸(요)', storageKey: 'korean3bimprove:c15:grammar2:form-practice:v1' },
  { path: '/c15/grammar3-form-practice.html', title: 'A/V-지 않으면 안 되다', storageKey: 'korean3bimprove:c15:grammar3:form-practice:v1' },
  { path: '/c15/grammar4-form-practice.html', title: 'V-는 길에', storageKey: 'korean3bimprove:c15:grammar4:form-practice:v1' }
];

test('C15 hub puts each form practice link directly after its workbook', async ({ page }) => {
  await page.goto('/c15/index.html', { waitUntil: 'domcontentloaded' });

  for (let grammar = 1; grammar <= 4; grammar += 1) {
    const card = page.locator('article.path-card').filter({
      has: page.getByText(`문법 ${grammar}`, { exact: false }).first()
    });
    const links = await card.locator('.lesson-list > a')
      .evaluateAll((all) => all.slice(0, 3).map((link) => link.getAttribute('href')));
    expect(links).toEqual([
      `grammar${grammar}.html`,
      `grammar${grammar}-workbook.html`,
      `grammar${grammar}-form-practice.html`
    ]);
  }
});

test('each C15 form practice page checks direct input and moves to the next question', async ({ page }) => {
  for (const target of targets) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    await page.evaluate((key) => localStorage.removeItem(key), target.storageKey);
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText(target.title);
    const answer = page.locator('#answerInput');
    await expect(answer).toBeVisible();
    const firstAnswer = await page.evaluate(() => window.C15GrammarFormPracticeConfig.items[0].answer);
    const firstPrompt = await page.locator('.fp-prompt').textContent();
    await answer.fill(firstAnswer);
    await answer.press('Enter');
    await expect(page.locator('#feedback')).toContainText('맞아요.');
    await page.locator('#nextBtn').click();
    await expect(page.locator('.fp-prompt')).not.toHaveText(firstPrompt || '');
    await expect(page.locator('#answerInput')).toBeVisible();
  }
});

test('wrong answers show the correct form and one-line rule before moving on', async ({ page }) => {
  const target = targets[1];
  await page.goto(target.path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), target.storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const expected = await page.evaluate(() => window.C15GrammarFormPracticeConfig.items[0]);
  await page.locator('#answerInput').fill('아니에요');
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedback')).toContainText(`정답: ${expected.answer}`);
  await expect(page.locator('#feedback')).toContainText(expected.rule);
  await expect(page.locator('#nextBtn')).toBeVisible();
  await page.locator('#nextBtn').click();
  await expect(page.locator('#answerInput')).toBeVisible();
});

test('form-practice prompts keep natural causee marking and cue-answer contracts', async ({ page }) => {
  await page.goto(targets[0].path, { waitUntil: 'domcontentloaded' });
  const grammar1Items = await page.evaluate(() => window.C15GrammarFormPracticeConfig.items);
  expect(grammar1Items.find((item) => item.id === 'g1-02').prompt).toBe('유치원 선생님, 아이가 친구들과 사이좋게 ____ 해 주세요.');
  expect(grammar1Items.find((item) => item.id === 'g1-08').prompt).toBe('저는 룸메이트가 아무 때나 남자 친구를 ____ 했어요.');
  expect(grammar1Items.find((item) => item.id === 'g1-12').prompt).toBe('비가 사람들에게 우산을 ____ 했어요.');

  await page.goto(targets[1].path, { waitUntil: 'domcontentloaded' });
  const item = await page.evaluate(() => window.C15GrammarFormPracticeConfig.items.find((candidate) => candidate.id === 'g2-03'));
  expect(item.cue).toBe('이해할 수 있다');
  expect(item.answer).toBe('이해할 수 있을걸요');
  expect(item.rule).toContain('마지막 용언 있다');
});

test('drafts restore with grammar-specific storage and reset is scoped to this practice page', async ({ page }) => {
  const grammar1 = targets[0];
  const grammar2 = targets[1];
  await page.goto(grammar1.path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), grammar1.storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#answerInput').fill('작성 중인 답');
  await page.locator('#answerInput').blur();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#answerInput')).toHaveValue('작성 중인 답');

  await page.goto(grammar2.path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#answerInput')).toHaveValue('');

  await page.goto(grammar1.path, { waitUntil: 'domcontentloaded' });
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#resetPractice').click();
  await expect(page.locator('#answerInput')).toHaveValue('');
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).version, grammar1.storageKey)).toBe(1);
});

test('corrupt saved data is retained until the learner explicitly resets this page', async ({ page }) => {
  const target = targets[2];
  await page.addInitScript((key) => localStorage.setItem(key, '{broken'), target.storageKey);
  await page.goto(target.path, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#storageStatus')).toContainText('안전하게 읽지 못해');
  await page.locator('#answerInput').fill('아끼지 않으면 안 돼요');
  await page.locator('#answerInput').blur();
  expect(await page.evaluate((key) => localStorage.getItem(key), target.storageKey)).toBe('{broken');

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#resetPractice').click();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).version, target.storageKey)).toBe(1);
});

test('the final page completes all twelve questions and returns to the C15 hub', async ({ page }) => {
  const target = targets[3];
  await page.goto(target.path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), target.storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  for (let index = 0; index < 12; index += 1) {
    const answer = await page.evaluate((questionIndex) => window.C15GrammarFormPracticeConfig.items[questionIndex].answer, index);
    await page.locator('#answerInput').fill(answer);
    await page.locator('#answerInput').press('Enter');
    await page.locator('#nextBtn').click();
  }

  await expect(page.locator('#finishPanel')).toBeVisible();
  await expect(page.locator('.fp-score')).toContainText('12 / 12');
  await expect(page.locator('#finishPanel a', { hasText: '15과 목록 →' })).toHaveAttribute('href', 'index.html');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#finishPanel')).toBeVisible();
  await expect(page.locator('.fp-score')).toContainText('12 / 12');
});

test('form practice remains usable on narrow screens and at 200 percent zoom', async ({ browser, page }) => {
  for (const target of targets) {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    await page.evaluate((key) => localStorage.removeItem(key), target.storageKey);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#answerInput')).toBeVisible();
    const layout = await page.evaluate(() => {
      const input = document.querySelector('#answerInput').getBoundingClientRect();
      return { bottom: input.bottom, height: window.innerHeight, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    expect(layout.bottom).toBeLessThanOrEqual(layout.height);
    expect(layout.overflow).toBe(false);
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const zoomPage = await context.newPage();
  for (const target of targets.slice(2)) {
    await zoomPage.goto(target.path, { waitUntil: 'domcontentloaded' });
    await zoomPage.evaluate(() => { document.body.style.zoom = '2'; });
    await expect(zoomPage.locator('#answerInput')).toBeVisible();
    expect(await zoomPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }
  await context.close();
});
