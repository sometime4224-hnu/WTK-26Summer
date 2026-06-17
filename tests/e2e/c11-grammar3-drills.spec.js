const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function openDrill(page, path) {
  await blockExternalRequests(page);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

async function expectLayoutColumns(page, expectedWide) {
  const count = await page.locator('[data-testid="drill-layout"]').evaluate((el) => {
    const columns = getComputedStyle(el).gridTemplateColumns.trim();
    return columns ? columns.split(/\s+/).length : 0;
  });
  if (expectedWide) {
    expect(count).toBeGreaterThan(1);
  } else {
    expect(count).toBe(1);
  }
}

async function chooseAndCheck(page, firstSelector, secondSelector) {
  await page.locator(firstSelector).click();
  await page.locator(secondSelector).click();
  await page.locator('#checkBtn').click();
}

test('c11 grammar3 drill pages fit desktop, tablet landscape, and mobile', async ({ page }) => {
  const pages = [
    { path: '/c11/grammar3-drill1.html', title: '의문사 + 든지/도' },
    { path: '/c11/grammar3-drill2.html', title: '명사 + (이)든지 / 아무 N도' }
  ];
  const viewports = [
    { width: 1280, height: 900, wide: true },
    { width: 1024, height: 768, wide: true },
    { width: 390, height: 844, wide: false }
  ];

  for (const target of pages) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openDrill(page, target.path);

      await expect(page.locator('h1')).toContainText(target.title);
      await expect(page.getByTestId('question-card')).toBeVisible();
      await expectNoHorizontalOverflow(page);
      await expectLayoutColumns(page, viewport.wide);
    }
  }
});

test('c11 grammar3 drill1 exposes natural forms and handles target, accepted, and wrong answers', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openDrill(page, '/c11/grammar3-drill1.html');

  const audit = await page.evaluate(() => {
    const api = window.__c11Grammar3Drills;
    const openQuestion = api.data.find((item) => item.id === 'g31-open-question');
    const personNegative = api.data.find((item) => item.id === 'g31-person-negative');
    return {
      count: api.data.length,
      drill: api.drill,
      negativeForms: [
        api.combine('무엇', '도'),
        api.combine('누구', '도'),
        api.combine('어디', '도')
      ],
      target: api.isAcceptedAnswer(openQuestion, '무엇', '든지'),
      accepted: api.isAcceptedAnswer(openQuestion, '언제', '든지'),
      wrong: api.isAcceptedAnswer(personNegative, '누구', '든지')
    };
  });

  expect(audit.count).toBe(16);
  expect(audit.drill).toBe('grammar3-drill1');
  expect(audit.negativeForms).toEqual(['아무것도', '아무도', '아무 데도']);
  expect(audit.target).toMatchObject({ ok: true, kind: 'target', userPhrase: '무엇이든지' });
  expect(audit.accepted).toMatchObject({ ok: true, kind: 'accepted', userPhrase: '언제든지', targetPhrase: '무엇이든지' });
  expect(audit.wrong).toMatchObject({ ok: false, userPhrase: '누구든지', targetPhrase: '아무도' });

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g31-open-question'));
  await chooseAndCheck(page, '[data-wh="언제"]', '[data-suffix="든지"]');
  await expect(page.locator('#feedback')).toContainText('가능한 답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 언제든지');
  await expect(page.locator('#feedback')).toContainText('목표 정답: 무엇이든지');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g31-person-negative'));
  await chooseAndCheck(page, '[data-wh="누구"]', '[data-suffix="도"]');
  await expect(page.locator('#feedback')).toContainText('정답입니다.');
  await expect(page.locator('#feedback')).toContainText('아무도');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g31-person-negative'));
  await chooseAndCheck(page, '[data-wh="누구"]', '[data-suffix="든지"]');
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#feedback')).toContainText('목표 정답: 아무도');
});

test('c11 grammar3 drill1 lets students change and recheck the current answer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openDrill(page, '/c11/grammar3-drill1.html');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g31-person-negative'));
  await chooseAndCheck(page, '[data-wh="누구"]', '[data-suffix="든지"]');
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#scoreNow')).toContainText('점수 0');
  await expect(page.locator('#checkBtn')).toContainText('다시 확인');

  await page.locator('[data-suffix="도"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedback')).toContainText('정답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 아무도');
  await expect(page.locator('#scoreNow')).toContainText('점수 1');

  await page.locator('[data-wh="언제"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 아무 때도');
  await expect(page.locator('#scoreNow')).toContainText('점수 0');
});

test('c11 grammar3 drill2 exposes noun forms and handles target, accepted, and wrong answers', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openDrill(page, '/c11/grammar3-drill2.html');

  const audit = await page.evaluate(() => {
    const api = window.__c11Grammar3Drills;
    const person = api.data.find((item) => item.id === 'g32-person-negative');
    const sound = api.data.find((item) => item.id === 'g32-sound-negative');
    const ready = api.data.find((item) => item.id === 'g32-ready-no-issue');
    const food = api.data.find((item) => item.id === 'g32-food-positive');
    return {
      count: api.data.length,
      drill: api.drill,
      positiveForms: [
        api.combine('학생', '든지'),
        api.combine('영화', '든지')
      ],
      negativeForms: [
        api.combine('사람', '도', person),
        api.combine('소리', '도', sound)
      ],
      target: api.isAcceptedAnswer(food, '음식', '든지'),
      accepted: api.isAcceptedAnswer(ready, '걱정', '도'),
      wrong: api.isAcceptedAnswer(food, '사람', '도')
    };
  });

  expect(audit.count).toBe(18);
  expect(audit.drill).toBe('grammar3-drill2');
  expect(audit.positiveForms).toEqual(['학생이든지', '영화든지']);
  expect(audit.negativeForms).toEqual(['아무도', '아무 소리도']);
  expect(audit.target).toMatchObject({ ok: true, kind: 'target', userPhrase: '음식이든지' });
  expect(audit.accepted).toMatchObject({ ok: true, kind: 'accepted', userPhrase: '아무 걱정도', targetPhrase: '아무 문제도' });
  expect(audit.wrong).toMatchObject({ ok: false, userPhrase: '아무도', targetPhrase: '음식이든지' });

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g32-ready-no-issue'));
  await chooseAndCheck(page, '[data-noun="걱정"]', '[data-suffix="도"]');
  await expect(page.locator('#feedback')).toContainText('가능한 답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 아무 걱정도');
  await expect(page.locator('#feedback')).toContainText('목표 정답: 아무 문제도');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g32-food-positive'));
  await chooseAndCheck(page, '[data-noun="음식"]', '[data-suffix="든지"]');
  await expect(page.locator('#feedback')).toContainText('정답입니다.');
  await expect(page.locator('#feedback')).toContainText('음식이든지');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g32-food-positive'));
  await chooseAndCheck(page, '[data-noun="사람"]', '[data-suffix="도"]');
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#feedback')).toContainText('목표 정답: 음식이든지');
});

test('c11 grammar3 drill2 lets students change and recheck the current answer', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openDrill(page, '/c11/grammar3-drill2.html');

  await page.evaluate(() => window.__c11Grammar3Drills.setQuestionById('g32-food-positive'));
  await chooseAndCheck(page, '[data-noun="사람"]', '[data-suffix="도"]');
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#scoreNow')).toContainText('점수 0');
  await expect(page.locator('#checkBtn')).toContainText('다시 확인');

  await page.locator('[data-noun="음식"]').click();
  await page.locator('[data-suffix="든지"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedback')).toContainText('정답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 음식이든지');
  await expect(page.locator('#scoreNow')).toContainText('점수 1');

  await page.locator('[data-noun="사람"]').click();
  await page.locator('[data-suffix="도"]').click();
  await page.locator('#checkBtn').click();
  await expect(page.locator('#feedback')).toContainText('오답입니다.');
  await expect(page.locator('#feedback')).toContainText('내 답: 아무도');
  await expect(page.locator('#scoreNow')).toContainText('점수 0');
});
