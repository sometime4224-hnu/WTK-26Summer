const { test, expect } = require('@playwright/test');

const routes = [
  {
    path: '/c16/grammar1-workbook-review.html',
    pageId: 'grammar1-workbook-review',
    main: '/c16/grammar1.html',
    previous: '',
    next: 'grammar2-workbook-review.html',
    title: 'N만 하다'
  },
  {
    path: '/c16/grammar2-workbook-review.html',
    pageId: 'grammar2-workbook-review',
    main: '/c16/grammar2.html',
    previous: 'grammar1-workbook-review.html',
    next: 'grammar3-workbook-review.html',
    title: 'V-(으)ㄹ 생각도 못 하다'
  },
  {
    path: '/c16/grammar3-workbook-review.html',
    pageId: 'grammar3-workbook-review',
    main: '/c16/grammar3.html',
    previous: 'grammar2-workbook-review.html',
    next: 'grammar4-workbook-sentence-quiz.html',
    title: 'V-(으)ㄹ 만하다'
  },
  {
    path: '/c16/grammar4-workbook-sentence-quiz.html',
    pageId: 'grammar4-workbook-sentence-quiz',
    main: '/c16/grammar4.html',
    previous: 'grammar3-workbook-review.html',
    next: '',
    title: '유명하다'
  }
];

function storageKey(pageId) {
  return `korean3b.c16.grammar.${pageId}`;
}

async function clearCurrentReview(page) {
  const key = await page.evaluate(() => window.__c16WorkbookReview.storageKey);
  await page.evaluate((reviewKey) => localStorage.removeItem(reviewKey), key);
  await page.reload({ waitUntil: 'domcontentloaded' });
  return key;
}

async function reviewConfig(page) {
  return page.evaluate(() => window.__c16WorkbookReview.config);
}

async function advanceToIndex(page, config, targetIndex) {
  for (let index = 0; index < targetIndex; index += 1) {
    expect(await page.evaluate(() => window.__c16WorkbookReview.currentState().currentIndex)).toBe(index);
    await page.evaluate((answer) => window.__c16WorkbookReview.answerCurrent(answer), config.items[index].answer);
    await page.locator('#primaryAction').click();
  }
}

test('four Chapter 16 workbook reviews have six configured items and keep the first response visible on phones', async ({ page }) => {
  const failures = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`);
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const key = await clearCurrentReview(page);
      const config = await reviewConfig(page);
      expect(config.pageId).toBe(route.pageId);
      expect(config.items).toHaveLength(6);
      expect(key).toBe(storageKey(route.pageId));
      await expect(page.locator('h1')).toContainText(route.title);
      await expect(page.locator('[data-review-progress-label]')).toHaveText('1 / 6');
      await expect(page.locator('#answerInput')).toBeVisible();
      await expect(page.locator('#primaryAction')).toHaveText('답 확인');

      const layout = await page.evaluate(() => {
        const target = document.querySelector('h1').getBoundingClientRect();
        const input = document.querySelector('#answerInput').getBoundingClientRect();
        const cue = document.querySelector('[data-review-cue]').getBoundingClientRect();
        const form = document.querySelector('.c16-wb-response-form').getBoundingClientRect();
        const primary = document.querySelector('#primaryAction').getBoundingClientRect();
        return {
          targetTop: target.top,
          inputTop: input.top,
          inputBottom: input.bottom,
          inputWidth: input.width,
          cueTop: cue.top,
          cueWidth: cue.width,
          formWidth: form.width,
          primaryTop: primary.top,
          primaryBottom: primary.bottom,
          viewportHeight: window.innerHeight,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        };
      });
      expect(layout.targetTop).toBeLessThanOrEqual(280);
      expect(layout.inputTop).toBeGreaterThanOrEqual(0);
      expect(layout.inputBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
      expect(layout.inputWidth).toBeGreaterThanOrEqual(180);
      expect(layout.cueTop).toBeGreaterThanOrEqual(layout.inputBottom);
      expect(layout.cueWidth).toBeLessThanOrEqual(layout.formWidth + 1);
      expect(layout.primaryTop).toBeGreaterThanOrEqual(0);
      expect(layout.primaryBottom).toBeLessThanOrEqual(layout.viewportHeight + 1);
      expect(layout.overflow).toBe(false);
    }
  }

  expect(failures).toEqual([]);
});

test('every review presents an explicit dialogue, a parenthesized cue, and no duplicate page explanations or bottom navigation', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await clearCurrentReview(page);
    await expect(page.locator('.c16-wb-question')).toContainText('가:');
    await expect(page.locator('.c16-wb-response-label')).toContainText('나:');
    await expect(page.locator('.c16-wb-response-form > [data-review-cue]')).toHaveText(/^\(.+\)$/);
    await expect(page.locator('.c16-wb-response-line [data-review-cue]')).toHaveCount(0);
    await expect(page.locator('#answerInput')).toHaveAttribute('placeholder', '핵심 표현 입력');
    await expect(page.locator('.c16-wb-instruction')).toHaveText('대화를 읽고 핵심 표현을 입력하세요.');
    await expect(page.locator('.c16-wb-progress-row')).not.toContainText('자동 저장');
    await expect(page.locator('.c16-wb-eyebrow, .c16-wb-input-note, .c16-wb-explanation, .c16-wb-attribution, .c16-wb-nav')).toHaveCount(0);
    await expect(page.locator('.c16-state-tools__status')).toBeHidden();
    await expect(page.getByRole('button', { name: '이 페이지 기록 초기화' })).toBeVisible();
  }
});

test('the shared review remains usable at 200% desktop zoom without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await clearCurrentReview(page);
    await page.evaluate(() => { document.body.style.zoom = '2'; });
    await expect(page.locator('#answerInput')).toBeVisible();
    await expect(page.locator('#primaryAction')).toBeVisible();

    const metrics = await page.evaluate(() => {
      const input = document.querySelector('#answerInput').getBoundingClientRect();
      const primary = document.querySelector('#primaryAction').getBoundingClientRect();
      return {
        inputBottom: input.bottom,
        primaryBottom: primary.bottom,
        viewportHeight: window.innerHeight,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    });
    expect(metrics.inputBottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
    expect(metrics.primaryBottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
    expect(metrics.overflow).toBe(false);
  }
});

test('Enter checks a correct response and two wrong checks unlock an explicitly revealed answer', async ({ page }) => {
  await page.goto('/c16/grammar1-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);

  await page.locator('#answerInput').fill(`  ${config.items[0].answer}  `);
  await page.keyboard.press('Enter');
  await expect(page.locator('#reviewFeedback')).toContainText('맞아요');
  await expect(page.locator('#primaryAction')).toHaveText('다음 문제');
  expect(await page.evaluate(() => window.__c16WorkbookReview.currentState().correct['g1-1'])).toBe(true);

  await page.locator('#primaryAction').click();
  await page.locator('#answerInput').fill('틀린 답');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('괄호 속 말과 목표 표현');
  await expect(page.locator('#reviewFeedback')).not.toContainText('아직 아니에요');
  await expect(page.locator('#revealButton')).toBeHidden();
  await page.locator('#answerInput').fill('또 틀린 답');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('한 번 더 써 보거나');
  await expect(page.locator('#revealButton')).toBeVisible();
  await page.locator('#revealButton').click();
  await expect(page.locator('#answerReveal')).toContainText(config.items[1].answer);
  expect(await page.evaluate(() => {
    const state = window.__c16WorkbookReview.currentState();
    return {
      attempts: state.attempts['g1-2'],
      correct: state.correct['g1-2'],
      revealed: state.revealed['g1-2']
    };
  })).toEqual({ attempts: 2, correct: false, revealed: true });
});

test('Grammar 1 item 6 accepts the core expression without requiring the complete source sentence', async ({ page }) => {
  await page.goto('/c16/grammar1-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);
  const item = config.items[5];
  expect(item.answer).toBe('친구의 집은 아주 크고 방이 얼마나 넓은지 축구장만 했어요.');
  await advanceToIndex(page, config, 5);

  const coreIsAccepted = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g1-6'];
  }, '  축구장만, 했어요!! ');
  expect(coreIsAccepted).toBe(true);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "이 페이지 기록 초기화" }).click();
  await advanceToIndex(page, config, 5);
  const missingGrammarIsRejected = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g1-6'];
  }, '축구장처럼 넓었어요.');
  expect(missingGrammarIsRejected).toBe(false);

  const canonicalIsAccepted = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g1-6'];
  }, item.answer);
  expect(canonicalIsAccepted).toBe(true);
});

test('core grammar and cue content are enough across all four reviews', async ({ page }) => {
  const examples = [
    { path: routes[0].path, id: 'g1-1', answer: '우산만, 해요!' },
    { path: routes[1].path, id: 'g2-1', answer: '비싸서 살 생각도 못 해요!' },
    { path: routes[2].path, id: 'g3-1', answer: '올라가 볼 만해요~' },
    { path: routes[3].path, id: 'g4-1', answer: '옷이 싸기로 유명해요!' }
  ];

  for (const example of examples) {
    await page.goto(example.path, { waitUntil: 'domcontentloaded' });
    await clearCurrentReview(page);
    const accepted = await page.evaluate((answer) => {
      const hook = window.__c16WorkbookReview;
      const state = hook.answerCurrent(answer);
      return state.correct[hook.config.items[0].id];
    }, example.answer);
    expect(accepted, `${example.id} should accept its core expression`).toBe(true);
  }
});

test('Grammar 2 item 1 accepts the source-derived 비싸서 variant as well as the existing answer', async ({ page }) => {
  await page.goto('/c16/grammar2-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);
  const sourceVariantIsAccepted = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-1'];
  }, '비싸서 새 컴퓨터를 살 생각도 못 해요.');
  expect(sourceVariantIsAccepted).toBe(true);

  await clearCurrentReview(page);
  const existingAnswerIsAccepted = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-1'];
  }, config.items[0].answer);
  expect(existingAnswerIsAccepted).toBe(true);
});

test('Grammar 2 source-faithful conditional items accept the workbook answers and reject the inverted answers', async ({ page }) => {
  await page.goto('/c16/grammar2-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);
  const item5 = config.items.find((item) => item.id === 'g2-5');
  const item6 = config.items.find((item) => item.id === 'g2-6');
  expect(item5.answer).toBe('미리 비행기 표를 사지 않으면 휴가를 갈 생각도 못 해요.');
  expect(item6.answer).toBe('민수 씨가 도와주지 않으면 그 일을 끝낼 생각도 못 해요.');

  for (let index = 0; index < 4; index += 1) {
    await page.evaluate((answer) => window.__c16WorkbookReview.answerCurrent(answer), config.items[index].answer);
    await page.locator('#primaryAction').click();
  }
  expect(await page.evaluate(() => window.__c16WorkbookReview.currentState().currentIndex)).toBe(4);

  for (const rejected of [
    '아직 휴가 갈 생각도 못 하는데 표부터 샀어요.',
    '휴가를 갈 생각도 못 해요.',
    '휴가를 갈 생각도 못 해요. 표를 사지 않으면요.'
  ]) {
    const accepted = await page.evaluate((answer) => {
      const state = window.__c16WorkbookReview.answerCurrent(answer);
      return state.correct['g2-5'];
    }, rejected);
    expect(accepted, `Grammar 2 item 5 must reject: ${rejected}`).toBe(false);
  }
  const acceptedItem5 = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-5'];
  }, item5.answer);
  expect(acceptedItem5).toBe(true);
  await page.locator('#primaryAction').click();

  for (const rejected of [
    '제 일도 못 끝내서 민수 씨를 도와줄 생각도 못 해요.',
    '그 일을 끝낼 생각도 못 해요.',
    '그 일을 끝낼 생각도 못 해요. 민수 씨가 도와주지 않으면요.',
    '제가 민수 씨를 도와주지 않으면 그 일을 끝낼 생각도 못 해요.'
  ]) {
    const accepted = await page.evaluate((answer) => {
      const state = window.__c16WorkbookReview.answerCurrent(answer);
      return state.correct['g2-6'];
    }, rejected);
    expect(accepted, `Grammar 2 item 6 must reject: ${rejected}`).toBe(false);
  }
  const acceptedItem6 = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-6'];
  }, item6.answer);
  expect(acceptedItem6).toBe(true);
});

test('Grammar 2 conditional items accept ordered formal and possessive-help variants', async ({ page }) => {
  await page.goto('/c16/grammar2-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);
  await advanceToIndex(page, config, 4);

  const formalItem5 = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-5'];
  }, '표를 미리 사지 않으면 휴가를 갈 생각도 못 합니다.');
  expect(formalItem5).toBe(true);
  await page.locator('#primaryAction').click();

  const formalItem6 = await page.evaluate((answer) => {
    const state = window.__c16WorkbookReview.answerCurrent(answer);
    return state.correct['g2-6'];
  }, '민수의 도움이 없으면 그 일을 끝낼 생각도 못 합니다.');
  expect(formalItem6).toBe(true);
});

test('Grammar 4 uses the correct 로 guidance for 오징어', async ({ page }) => {
  await page.goto('/c16/grammar4-workbook-sentence-quiz.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);
  await advanceToIndex(page, config, 4);
  await page.locator('#hintButton').click();
  await page.locator('#hintButton').click();
  await expect(page.locator('#reviewHint')).toContainText('모음으로 끝난 명사 뒤에는 ‘로 유명해요’를 붙여 보세요.');
  await expect(page.locator('#reviewHint')).not.toContainText('오징어으로');
});

test('Grammar 4 migrates only exact source-equivalent legacy work without recovery warnings', async ({ page }) => {
  const key = storageKey('grammar4-workbook-sentence-quiz');
  const unrelatedKey = storageKey('grammar3-workbook-review');
  const legacyPayload = {
    version: 1,
    page: 'grammar4-workbook-sentence-quiz',
    updatedAt: '2026-08-03T00:00:00.000Z',
    state: {
      index: 4,
      completed: false,
      records: {
        dongdaemun: { selectedType: 'feature', value: '쇼핑이 편리하기로', attempts: 1, hintLevel: 1, correct: true, revealed: false },
        'east-sea': { selectedType: 'feature', value: '바다가 깨끗하기로', attempts: 4, hintLevel: 3, correct: true, revealed: false },
        korea: { selectedType: 'feature', value: '인터넷 속도가 빠르기로', attempts: 2, hintLevel: 2, correct: true, revealed: false },
        ulleungdo: { selectedType: 'noun', value: '오징어', attempts: 2, hintLevel: 1, correct: false, revealed: true },
        jeonju: { selectedType: 'noun', value: '전주비빔밥', attempts: 121, hintLevel: 3, correct: true, revealed: false }
      }
    }
  };

  await page.goto('/c16/grammar4-workbook-sentence-quiz.html', { waitUntil: 'domcontentloaded' });
  await page.addInitScript(({ reviewKey, otherKey, payload }) => {
    localStorage.setItem(reviewKey, JSON.stringify(payload));
    localStorage.setItem(otherKey, 'unrelated-storage');
  }, { reviewKey: key, otherKey: unrelatedKey, payload: legacyPayload });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('.c16-state-tools')).not.toContainText('읽을 수 없습니다');
  const migration = await page.evaluate(({ reviewKey, otherKey }) => {
    const state = window.__c16WorkbookReview.currentState();
    const stored = JSON.parse(localStorage.getItem(reviewKey));
    return {
      state,
      payload: { version: stored.version, page: stored.page },
      other: localStorage.getItem(otherKey)
    };
  }, { reviewKey: key, otherKey: unrelatedKey });
  expect(migration.payload).toEqual({ version: 1, page: 'grammar4-workbook-sentence-quiz' });
  expect(migration.other).toBe('unrelated-storage');
  expect(migration.state).toMatchObject({
    currentIndex: 0,
    completed: false,
    correct: { 'g4-1': false, 'g4-2': true, 'g4-3': false, 'g4-4': false, 'g4-5': false, 'g4-6': true },
    revealed: { 'g4-1': false, 'g4-2': false, 'g4-3': false, 'g4-4': false, 'g4-5': true, 'g4-6': false },
    attempts: { 'g4-2': 4, 'g4-5': 2, 'g4-6': 99 },
    hints: { 'g4-2': 2, 'g4-5': 1, 'g4-6': 2 }
  });
  expect(migration.state.responses).toMatchObject({
    'g4-2': '바다가 깨끗하기로 유명하거든요.',
    'g4-5': '울릉도는 오징어로 유명해요.',
    'g4-6': '전주는 비빔밥으로 유명해요.'
  });
});

for (const adversarialLegacyRecord of [
  {
    label: 'unresolved 오징어으로',
    index: 3,
    id: 'ulleungdo',
    record: { selectedType: 'noun', value: '오징어으로', attempts: 1, hintLevel: 1, correct: false, revealed: false }
  },
  {
    label: 'arbitrary unresolved wrong text',
    index: 1,
    id: 'east-sea',
    record: { selectedType: 'feature', value: '바다가 유명하기로', attempts: 2, hintLevel: 1, correct: false, revealed: false }
  }
]) {
  test(`Grammar 4 leaves ${adversarialLegacyRecord.label} byte-for-byte untouched`, async ({ page }) => {
    const key = storageKey('grammar4-workbook-sentence-quiz');
    const unrelatedKey = storageKey('grammar3-workbook-review');
    const rawRecord = JSON.stringify({
      version: 1,
      page: 'grammar4-workbook-sentence-quiz',
      updatedAt: '2026-08-03T00:00:00.000Z',
      state: {
        index: adversarialLegacyRecord.index,
        completed: false,
        records: { [adversarialLegacyRecord.id]: adversarialLegacyRecord.record }
      }
    });

    await page.goto('/c16/grammar4-workbook-sentence-quiz.html', { waitUntil: 'domcontentloaded' });
    await page.addInitScript(({ reviewKey, otherKey, raw }) => {
      localStorage.setItem(reviewKey, raw);
      localStorage.setItem(otherKey, 'unrelated-storage');
    }, { reviewKey: key, otherKey: unrelatedKey, raw: rawRecord });
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('.c16-state-tools')).toContainText('읽을 수 없습니다');
    const stored = await page.evaluate(({ reviewKey, otherKey }) => ({
      review: localStorage.getItem(reviewKey),
      other: localStorage.getItem(otherKey)
    }), { reviewKey: key, otherKey: unrelatedKey });
    expect(stored.review).toBe(rawRecord);
    expect(stored.other).toBe('unrelated-storage');
  });
}

test('check and hint transitions keep keyboard focus on the next visible control', async ({ page }) => {
  await page.goto('/c16/grammar1-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  const config = await reviewConfig(page);

  await page.locator('#answerInput').fill(config.items[0].answer);
  await page.keyboard.press('Enter');
  await expect(page.locator('#primaryAction')).toBeFocused();
  await page.locator('#primaryAction').click();

  await page.locator('#answerInput').fill(config.items[1].answer);
  await page.locator('#primaryAction').click();
  await expect(page.locator('#primaryAction')).toBeFocused();
  await page.locator('#primaryAction').click();

  await page.locator('#answerInput').fill('틀린 답');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#answerInput')).toBeFocused();
  await page.locator('#hintButton').click();
  await expect(page.locator('#hintButton')).toBeFocused();
  await page.locator('#hintButton').click();
  await expect(page.locator('#revealButton')).toBeVisible();
  await expect(page.locator('#revealButton')).toBeFocused();
});

test('skip links move keyboard focus to the main review landmark on every route', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.activeElement.blur());
    await page.keyboard.press('Tab');
    await expect(page.locator('.c16-wb-skip-link.c16-skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  }
});

test('partial text, a completed review, and its independent/revealed counts restore after reload', async ({ page }) => {
  await page.goto('/c16/grammar2-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  await page.locator('#answerInput').fill('시간이 없어서 김치를');
  await page.locator('#answerInput').blur();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#answerInput')).toHaveValue('시간이 없어서 김치를');
  expect(await page.evaluate(() => window.__c16WorkbookReview.currentState().responses['g2-1']))
    .toBe('시간이 없어서 김치를');

  await page.goto('/c16/grammar3-workbook-review.html', { waitUntil: 'domcontentloaded' });
  await clearCurrentReview(page);
  for (let index = 0; index < 6; index += 1) {
    const answer = await page.evaluate(() => {
      const hook = window.__c16WorkbookReview;
      const state = hook.currentState();
      return hook.config.items[state.currentIndex].answer;
    });
    await page.locator('#answerInput').fill(answer);
    await page.keyboard.press('Enter');
    await page.locator('#primaryAction').click();
  }
  await expect(page.locator('[data-review-summary]')).toBeVisible();
  await expect(page.locator('[data-review-summary-text]')).toContainText('스스로 맞힌 문항 6개');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-review-summary]')).toBeVisible();
  expect(await page.evaluate(() => window.__c16WorkbookReview.currentState().completed)).toBe(true);
});

test('a malformed or unknown record is preserved until confirmed page-scoped recovery reset, without touching another key', async ({ page }) => {
  const target = routes[0];
  const targetKey = storageKey(target.pageId);
  const otherKey = storageKey(routes[1].pageId);
  const rawRecord = JSON.stringify({
    version: 1,
    page: target.pageId,
    state: { unknownSavedField: true }
  });

  await page.goto(target.path, { waitUntil: 'domcontentloaded' });
  await page.addInitScript(({ reviewKey, untouchedKey, raw }) => {
    localStorage.setItem(reviewKey, raw);
    localStorage.setItem(untouchedKey, 'other-review-work');
  }, { reviewKey: targetKey, untouchedKey: otherKey, raw: rawRecord });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('.c16-state-tools')).toContainText('읽을 수 없습니다');
  await expect(page.locator('.c16-state-tools')).toContainText('현재 기록 복사');
  await expect(page.locator('.c16-state-tools')).toContainText('기록 내려받기');
  await page.locator('#answerInput').fill('네, 우산만 해요.');
  await page.locator('#answerInput').blur();
  expect(await page.evaluate((reviewKey) => localStorage.getItem(reviewKey), targetKey)).toBe(rawRecord);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '이 페이지 기록 초기화' }).click();
  expect(await page.evaluate(({ reviewKey, untouchedKey }) => ({
    target: localStorage.getItem(reviewKey),
    other: localStorage.getItem(untouchedKey)
  }), { reviewKey: targetKey, untouchedKey: otherKey })).toEqual({
    target: null,
    other: 'other-review-work'
  });
  await expect(page.locator('#answerInput')).toHaveValue('');
});

test('hub and grammar main pages expose each workbook review while review pages rely only on the top navigation', async ({ page }) => {
  await page.goto('/c16/index.html', { waitUntil: 'domcontentloaded' });
  for (const route of routes) {
    const href = route.path.replace('/c16/', '');
    const link = page.locator(`a[href="${href}"]`).first();
    await expect(link).toBeVisible();
    await expect(link).toContainText('워크북 복습');
    await expect(link).toContainText('6문항 대화 복습');
    await expect(link).toHaveClass(/lesson-link--main/);
  }

  for (const route of routes) {
    await page.goto(route.main, { waitUntil: 'domcontentloaded' });
    const href = route.path.replace('/c16/', '');
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    const topbar = page.locator('.c16-wb-topbar');
    await expect(topbar.locator(`a[href="${route.main.replace('/c16/', '')}"]`)).toBeVisible();
    await expect(topbar.locator('a[href="index.html"]')).toBeVisible();
    await expect(page.locator('.c16-wb-nav')).toHaveCount(0);
  }
});
