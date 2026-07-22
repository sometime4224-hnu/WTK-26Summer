const { test, expect } = require('@playwright/test');

const targets = [
  { path: '/c15/grammar1-workbook.html', title: 'V-게 하다', firstLabel: '부탁하기 1번 답', storageKey: 'korean3bimprove:c15:grammar1:workbook:v1' },
  { path: '/c15/grammar2-workbook.html', title: 'A/V-(으)ㄹ걸(요)', firstLabel: '근거를 보고 대답하기 1번 답', storageKey: 'korean3bimprove:c15:grammar2:workbook:v1' },
  { path: '/c15/grammar3-workbook.html', title: 'A/V-지 않으면 안 되다', firstLabel: '꼭 필요한 조건 1번 답', storageKey: 'korean3bimprove:c15:grammar3:workbook:v1' },
  { path: '/c15/grammar4-workbook.html', title: 'V-는 길에', firstLabel: '가는 길 대화 1번 답', storageKey: 'korean3bimprove:c15:grammar4:workbook:v1' }
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
  const grammar3Card = page.locator('article.path-card').filter({
    has: page.getByRole('heading', { name: 'A/V-지 않으면 안 되다', exact: true })
  });
  const grammar4Card = page.locator('article.path-card').filter({
    has: page.getByRole('heading', { name: 'V-는 길에', exact: true })
  });

  const grammar1Links = await grammar1Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));
  const grammar2Links = await grammar2Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));
  const grammar3Links = await grammar3Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));
  const grammar4Links = await grammar4Card.locator('.lesson-list > a')
    .evaluateAll((links) => links.slice(0, 2).map((link) => link.getAttribute('href')));

  expect(grammar1Links).toEqual(['grammar1.html', 'grammar1-workbook.html']);
  expect(grammar2Links).toEqual(['grammar2.html', 'grammar2-workbook.html']);
  expect(grammar3Links).toEqual(['grammar3.html', 'grammar3-workbook.html']);
  expect(grammar4Links).toEqual(['grammar4.html', 'grammar4-workbook.html']);
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

test('C15 grammar 3 and 4 workbooks remain usable at 200% zoom', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const zoomPage = await context.newPage();

  for (const target of targets.slice(2)) {
    await zoomPage.goto(target.path, { waitUntil: 'domcontentloaded' });
    await zoomPage.evaluate(() => { document.body.style.zoom = '2'; });
    await expect(zoomPage.locator('h1')).toContainText(target.title);
    await expect(zoomPage.getByLabel(target.firstLabel)).toBeVisible();
    expect(await zoomPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  }

  await context.close();
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

test('C15 grammar 3 workbook checks and restores a source-based response', async ({ page }) => {
  const storageKey = targets[2].storageKey;
  await page.goto(targets[2].path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-item="g3-ex1-0"] .wb-verb-hint')).toHaveText(/성격이 잘 맞다/);
  await expect(page.locator('[data-item="g3-ex2-1"] .wb-verb-hint')).toHaveText(/쓰레기봉투에 넣어서 버리다/);

  const answer = page.getByLabel('꼭 필요한 조건 1번 답');
  await answer.fill('성격이 잘 맞지 않으면 안 돼요');
  await page.getByRole('button', { name: '꼭 필요한 조건 답 확인' }).click();
  await expect(page.locator('[data-item="g3-ex1-0"] .wb-item__feedback')).toHaveText('맞아요.');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(answer).toHaveValue('성격이 잘 맞지 않으면 안 돼요');

  await page.getByLabel('친구와 이야기하기 1번 답').fill('회사 동료가 집들이를 해서 거기에 안 가면 안 될 것 같아.');
  await page.getByRole('button', { name: '친구와 이야기하기 답 확인' }).click();
  await expect(page.locator('[data-item="g3-ex3-0"] .wb-item__feedback')).toHaveText('좋아요. 목표 표현을 넣어 답을 만들었어요.');

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '이 워크북 초기화' }).click();
  await expect(page.getByLabel('꼭 필요한 조건 1번 답')).toHaveValue('');
});

test('C15 grammar 3 open responses require the matching obligation, not only 안 될', async ({ page }) => {
  const storageKey = targets[2].storageKey;
  await page.goto(targets[2].path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  const responses = [
    '회사 동료 집들이에 가면 안 될 것 같아.',
    '몸살이 나서 쉬지 않으면 안 될 것 같아.',
    '부모님이 편찮으셔서 고향에 안 내려가면 안 될 것 같아.',
    '월요일 회의 때문에 주말에 준비하지 않으면 안 될 것 같아.'
  ];
  for (let index = 0; index < responses.length; index += 1) {
    await page.getByLabel(`친구와 이야기하기 ${index + 1}번 답`).fill(responses[index]);
  }

  await page.getByRole('button', { name: '친구와 이야기하기 답 확인' }).click();
  await expect(page.locator('[data-item="g3-ex3-0"] .wb-item__feedback')).toContainText('가지 않으면 안 될');
  for (let index = 1; index < responses.length; index += 1) {
    await expect(page.locator(`[data-item="g3-ex3-${index}"] .wb-item__feedback`)).toHaveText('좋아요. 목표 표현을 넣어 답을 만들었어요.');
  }

  await page.getByLabel('친구와 이야기하기 1번 답').fill('회사 동료 집들이에 안 가면 안 될 것 같아.');
  await page.getByRole('button', { name: '친구와 이야기하기 답 확인' }).click();
  await expect(page.locator('[data-item="g3-ex3-0"] .wb-item__feedback')).toHaveText('좋아요. 목표 표현을 넣어 답을 만들었어요.');
});

test('C15 grammar 4 workbook checks a source-based response', async ({ page }) => {
  const storageKey = targets[3].storageKey;
  await page.goto(targets[3].path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-item="g4-ex1-0"] .wb-verb-hint')).toHaveText(/퇴근하다/);
  await expect(page.locator('[data-item="g4-ex3-1"] .wb-verb-hint')).toHaveText(/운동 갔다 오다/);

  await page.getByLabel('가는 길 대화 1번 답').fill('퇴근하는 길에');
  await page.getByRole('button', { name: '가는 길 대화 답 확인' }).click();
  await expect(page.locator('[data-item="g4-ex1-0"] .wb-item__feedback')).toHaveText('맞아요.');

  await page.getByLabel('친구 문제 해결하기 1번 답').fill('퇴근하는 길에');
  await page.getByRole('button', { name: '친구 문제 해결하기 답 확인' }).click();
  await expect(page.locator('[data-item="g4-ex2-0"] .wb-item__feedback')).toHaveText('좋아요. 목표 표현을 넣어 답을 만들었어요.');
});
