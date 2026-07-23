const { test, expect } = require('@playwright/test');

const pagePath = '/c16/vocab-support-shape-texture.html';
const storageKey = 'c16-shape-texture-v2';

function choice(page, category, word) {
  return page.locator(`.choice-button[data-category="${category}"][data-word="${word}"]`);
}

function storagePayload(overrides = {}) {
  return {
    version: 2,
    currentRound: 0,
    selections: Array.from({ length: 10 }, () => ({ shape: '', form: '', touch: '' })),
    solvedRounds: [],
    completed: false,
    ...overrides
  };
}

function watchLocalFailures(page) {
  const failures = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (/Failed to load resource: net::ERR_FAILED/i.test(text)) return;
    failures.push(`console.error: ${text}`);
  });
  return failures;
}

test('C16 모양·형태·촉감은 첫 화면에 사진과 바로 고를 수 있는 세 범주를 보여 준다', async ({ page }) => {
  const failures = watchLocalFailures(page);

  for (const viewport of [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 720, height: 450 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: '모양·형태·촉감 설명하기' })).toBeVisible();
    await expect(page.locator('.instruction')).toHaveText('사진을 보고 각 줄에서 알맞은 말 하나를 고르세요.');
    await expect(page.locator('.choice-group')).toHaveCount(3);
    await expect(choice(page, 'shape', '세모')).toHaveAttribute('aria-pressed', 'false');
    await expect(choice(page, 'form', '울퉁불퉁하다')).toBeVisible();
    await expect(choice(page, 'touch', '매끄럽다')).toBeVisible();

    const audit = await page.evaluate(() => {
      const firstChoice = document.querySelector('.choice-group[data-category="shape"]');
      const title = document.querySelector('#pageTitle');
      const box = firstChoice.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();
      return {
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        titleVisible: titleBox.top >= 0 && titleBox.bottom <= window.innerHeight,
        firstActionVisible: box.top >= 0 && box.bottom <= window.innerHeight
      };
    });
    expect(audit).toEqual({ overflowX: false, titleVisible: true, firstActionVisible: true });
  }

  await expect(page.locator('#roundImage')).toHaveJSProperty('complete', true);
  expect(failures).toEqual([]);
});

test('C16 모양·형태·촉감은 세 번째 선택에서 자동 채점하고 정답 뒤에만 다음으로 진행한다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

  await choice(page, 'shape', '세모').click();
  await choice(page, 'form', '둥글다').click();
  await choice(page, 'touch', '매끄럽다').click();
  await expect(page.locator('#feedback')).toHaveText('아닌 단어가 있어요. 고친 뒤 다시 고르세요.');
  await expect(page.locator('.choice-group[data-category="shape"]')).toHaveClass(/is-correct/);
  await expect(page.locator('.choice-group[data-category="form"]')).toHaveClass(/is-wrong/);
  await expect(page.locator('.choice-group[data-category="touch"]')).toHaveClass(/is-correct/);
  await expect(page.locator('#nextButton')).toBeHidden();

  await choice(page, 'form', '뾰족하다').focus();
  await choice(page, 'form', '뾰족하다').press('Enter');
  await expect(page.locator('#feedback')).toHaveText('좋아요. 세모 · 뾰족하다 · 매끄럽다');
  await expect(page.locator('#objectName')).toHaveText('세모 금속 조각');
  await expect(page.locator('#objectName')).toBeVisible();
  await expect(page.locator('#nextButton')).toBeVisible();

  await page.locator('#nextButton').click();
  await expect(page.locator('#progressLabel')).toHaveText('2 / 10');
  await expect(page.locator('#nextButton')).toBeHidden();
  await expect(choice(page, 'shape', '네모')).toHaveAttribute('aria-pressed', 'false');
  expect(failures).toEqual([]);
});

test('C16 모양·형태·촉감은 열 장을 모두 맞히면 완료 상태로 끝난다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  const answers = [
    ['세모', '평평하다', '딱딱하다'],
    ['네모', '평평하다', '매끄럽다'],
    ['동그라미', '둥글다', '부드럽다'],
    ['마름모', '울퉁불퉁하다', '거칠다'],
    ['세모', '뾰족하다', '거칠다'],
    ['네모', '둥글다', '부드럽다'],
    ['세모', '평평하다', '부드럽다'],
    ['네모', '울퉁불퉁하다', '거칠다'],
    ['동그라미', '둥글다', '매끄럽다'],
    ['마름모', '평평하다', '매끄럽다']
  ];

  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  for (const [index, [shape, form, touch]] of answers.entries()) {
    await choice(page, 'shape', shape).click();
    await choice(page, 'form', form).click();
    await choice(page, 'touch', touch).click();
    await expect(page.locator('#feedback')).toHaveClass(/is-good/);
    await expect.poll(() => page.locator('#roundImage').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);

    if (index === answers.length - 1) {
      await expect(page.locator('#nextButton')).toHaveText('완료하기');
      await page.locator('#nextButton').click();
      await expect(page.getByRole('heading', { name: '10장 완료!' })).toBeVisible();
    } else {
      await page.locator('#nextButton').click();
      await expect(page.locator('#progressLabel')).toHaveText(`${index + 2} / 10`);
    }
  }
  expect(failures).toEqual([]);
});

test('C16 모양·형태·촉감은 부분 선택과 완료 기록을 복원하고 페이지 기록만 초기화한다', async ({ page }) => {
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await choice(page, 'shape', '세모').click();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(choice(page, 'shape', '세모')).toHaveAttribute('aria-pressed', 'true');

  await page.addInitScript(({ key, payload }) => {
    localStorage.setItem('unrelated-page-state', 'keep-me');
    localStorage.setItem(key, JSON.stringify(payload));
  }, {
    key: storageKey,
    payload: storagePayload({
      currentRound: 9,
      solvedRounds: Array.from({ length: 10 }, (_, index) => index),
      completed: true
    })
  });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '10장 완료!' })).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '처음부터 다시 하기' }).click();
  await expect(page.locator('#progressLabel')).toHaveText('1 / 10');
  await expect(page.locator('#activityCard')).toBeVisible();
  await expect(page.locator('#completeCard')).toBeHidden();
  const storage = await page.evaluate((key) => ({
    page: JSON.parse(localStorage.getItem(key)),
    unrelated: localStorage.getItem('unrelated-page-state')
  }), storageKey);
  expect(storage.page.version).toBe(2);
  expect(storage.page.solvedRounds).toEqual([]);
  expect(storage.unrelated).toBe('keep-me');
});

test('C16 모양·형태·촉감은 손상·알 수 없는 저장 기록을 덮어쓰지 않고 명시적 초기화를 요구한다', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'not-json'), storageKey);
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#storageNotice')).toBeVisible();
  await expect(page.locator('#storageMessage')).toContainText('저장된 학습 기록을 읽을 수 없어요');
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe('not-json');

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#resetStoredProgress').click();
  await expect(page.locator('#storageNotice')).toBeHidden();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).version, storageKey)).toBe(2);

  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({ version: 99 })), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#storageNotice')).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).version, storageKey)).toBe(99);
});

test('C16 모양·형태·촉감은 저장 실패를 알리고 다음 선택에서 저장을 다시 시도한다', async ({ page }) => {
  await page.addInitScript((key) => {
    const originalSetItem = Storage.prototype.setItem;
    let failuresLeft = 1;
    Storage.prototype.setItem = function patchedSetItem(name, value) {
      if (name === key && failuresLeft > 0) {
        failuresLeft -= 1;
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      return originalSetItem.call(this, name, value);
    };
  }, storageKey);
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

  await choice(page, 'shape', '세모').click();
  await expect(page.locator('#storageNotice')).toBeVisible();
  await expect(page.locator('#storageMessage')).toContainText('저장하지 못했어요');

  await choice(page, 'form', '평평하다').click();
  await expect(page.locator('#storageNotice')).toBeHidden();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
  expect(saved.selections[0]).toEqual({ shape: '세모', form: '평평하다', touch: '' });
});
