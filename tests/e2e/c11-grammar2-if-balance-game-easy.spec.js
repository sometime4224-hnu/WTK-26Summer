const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://unpkg.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function openEasyGame(page) {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar2-if-balance-game-easy.html', { waitUntil: 'domcontentloaded' });
}

async function clickWord(page, token) {
  await page.locator('#wordPool').getByRole('button', { name: token, exact: true }).click();
}

test('c11 grammar2 easy balance game page is responsive', async ({ page }) => {
  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await openEasyGame(page);

    await expect(page.locator('h1')).toContainText('쉬운 만약 밸런스 게임');
    await expect(page.locator('#selectBoard')).toBeVisible();
    await expect(page.locator('#roundTab1')).toBeVisible();
    await expect(page.locator('#dilemmaTitle')).toContainText('비가 많이 온다면?');
    await expectNoHorizontalOverflow(page);
  }
});

test('c11 grammar2 easy balance game assembles option A with the selected prompt snapshot', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await openEasyGame(page);

  await page.locator('#optACard').click();
  await expect(page.locator('#builderBoard')).toBeVisible();
  await expect(page.locator('#clauseHintText')).toContainText('비가 많이 온다.');
  await expect(page.locator('#pickedSummary')).toContainText('집에 있을래요');

  for (const token of ['비가', '많이', '온다면', '집에', '있을래요']) {
    await clickWord(page, token);
  }

  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedbackBox')).toBeVisible();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다!');
  await expect(page.locator('#feedbackBox')).toContainText('비가 많이 온다면 집에 있을래요');
});

test('c11 grammar2 easy balance game keeps option B content separate from option A', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await openEasyGame(page);

  await page.locator('#optBCard').click();
  await expect(page.locator('#builderBoard')).toBeVisible();
  await expect(page.locator('#clauseHintText')).toContainText('비가 많이 온다.');
  await expect(page.locator('#pickedSummary')).toContainText('우산을 쓰고 나갈래요');

  await expect(page.locator('#wordPool').getByRole('button', { name: '우산을', exact: true })).toBeVisible();
  await expect(page.locator('#wordPool').getByRole('button', { name: '쓰고', exact: true })).toBeVisible();
  await expect(page.locator('#wordPool').getByRole('button', { name: '나갈래요', exact: true })).toBeVisible();
  await expect(page.locator('#wordPool').getByRole('button', { name: '집에', exact: true })).toHaveCount(0);

  for (const token of ['비가', '많이', '온다면', '우산을', '쓰고', '나갈래요']) {
    await clickWord(page, token);
  }

  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedbackBox')).toContainText('정답입니다!');
  await expect(page.locator('#feedbackBox')).toContainText('비가 많이 온다면 우산을 쓰고 나갈래요');
});

test('c11 grammar2 easy balance game opens round 2 at question 6', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await openEasyGame(page);

  await page.locator('#roundTab2').click();
  await expect(page.locator('#selectBoard')).toBeVisible();
  await expect(page.locator('#dilemmaTitle')).toContainText('매일 일찍 일어난다면?');
  await expect(page.locator('#activeRoundBadge')).toContainText('2라운드');
});

test('c11 grammar2 easy balance game prompt snapshots match the selected data object', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await openEasyGame(page);

  const audit = await page.evaluate(() => {
    return window.__easyBalanceGameData.flatMap((dilemma, index) => (
      ['A', 'B'].map((choiceKey) => {
        const choice = dilemma.choices[choiceKey];
        const prompt = window.__easyBalanceGame.createActivePromptForTest(index, choiceKey);
        return {
          questionIdMatches: prompt.questionId === dilemma.id,
          choiceKeyMatches: prompt.choiceKey === choiceKey,
          titleMatches: prompt.title === dilemma.title,
          choiceTextMatches: prompt.choiceText === choice.text,
          targetMatches: prompt.targetTokens.join('|') === choice.targetTokens.join('|'),
          hintMatches: prompt.hintText === choice.hintText,
          distractorsMatch: prompt.distractors.join('|') === choice.distractors.join('|')
        };
      })
    ));
  });

  expect(audit).toHaveLength(20);
  for (const row of audit) {
    expect(row).toEqual({
      questionIdMatches: true,
      choiceKeyMatches: true,
      titleMatches: true,
      choiceTextMatches: true,
      targetMatches: true,
      hintMatches: true,
      distractorsMatch: true
    });
  }
});
