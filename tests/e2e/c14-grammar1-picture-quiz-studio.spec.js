const { test, expect } = require('@playwright/test');

const STUDIO_PATH = '/c14/grammar1-picture-quiz-studio.html';
const ORIGINAL_PATH = '/c14/grammar1-picture-quiz.html';

const ANSWERS = [
  '하도 많이 먹어서 배가 아파요.',
  '하도 달려서 땀이 많이 나요.',
  '하도 울어서 눈이 부었어요.',
  '하도 자서 학교에 늦었어요.',
  '떡볶이가 하도 매워서 물을 마셨어요.',
  '영화가 하도 무서워서 TV를 껐어요.',
  '케이크가 하도 달아서 커피를 마셨어요.',
  '하도 심심해서 휴대폰을 보고 있어요.',
  '하도 추워서 몸이 떨려요.',
  '라면이 하도 뜨거워서 천천히 먹어요.',
  '일이 하도 힘들어서 한숨이 나와요.',
  '하도 심심해서 TV를 켰어요.',
  '친구를 하도 기다려서 커피를 다 마셨어요.',
  '하도 쇼핑해서 팔이 아파요.',
  '하도 운동해서 온몸에 땀이 났어요.',
  '하도 여행해서 발이 아파요.'
];

async function openStudio(page, viewport = { width: 1024, height: 768 }) {
  await page.setViewportSize(viewport);
  await page.goto(STUDIO_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /g1pq_01_eat\.webp/);
}

async function answerCurrent(page, answer) {
  await page.locator('#manualInput').fill(answer);
  await page.locator('#manualCheckBtn').click();
}

test('studio is a separate local-only visual copy and the original remains available', async ({ page }) => {
  await openStudio(page);

  await expect(page).toHaveTitle('14과 문법 1 개선 활동 | 그림 말하기 스튜디오');
  await expect(page.getByRole('heading', { level: 1, name: '그림 말하기 스튜디오' })).toBeVisible();
  await expect(page.locator('link[href^="http"], script[src^="http"], video')).toHaveCount(0);
  await expect(page.locator('link[href="grammar1-picture-quiz-studio.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="grammar1-picture-quiz.js"]')).toHaveCount(1);
  await expect(page.locator('script[src="grammar1-picture-quiz-studio.js"]')).toHaveCount(1);

  const progress = page.locator('#progressBar');
  await expect(progress).toHaveAttribute('role', 'progressbar');
  await expect(progress).toHaveAttribute('aria-valuenow', '1');
  await expect(progress).toHaveAttribute('aria-valuemax', '16');
  await expect(page.locator('label[for="manualInput"]')).toHaveCount(1);

  await page.goto(ORIGINAL_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle('14과 문법 1 보조자료 2 | 그림 말하기 퀴즈');
  await expect(page.locator('script[src="grammar1-picture-quiz.js"]')).toHaveCount(1);
  await expect(page.locator('link[href="grammar1-picture-quiz-studio.css"]')).toHaveCount(0);
});

test('studio is linked next to the preserved original from both C14 entry points', async ({ page }) => {
  await page.goto('/c14/index.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a[href="grammar1-picture-quiz.html"]')).toHaveCount(1);
  await expect(page.locator('a[href="grammar1-picture-quiz-studio.html"]')).toHaveCount(1);
  await expect(page.locator('a[href="grammar1-picture-quiz-studio.html"]')).toContainText('개선 활동');
  await expect(page.locator('a[href="grammar1-picture-quiz-studio.html"]')).toContainText('그림 말하기 스튜디오');

  await page.goto('/c14/grammar1.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a[href="grammar1-picture-quiz.html"]')).toHaveCount(1);
  await expect(page.locator('a[href="grammar1-picture-quiz-studio.html"]')).toHaveCount(1);
});

test('manual answer keeps the original correct, model, retry, and next flow', async ({ page }) => {
  await openStudio(page, { width: 390, height: 844 });

  await answerCurrent(page, ANSWERS[0]);
  await expect(page.locator('#feedbackBox')).toContainText('정답');
  await expect(page.locator('#modelSentence')).toHaveText(ANSWERS[0]);
  await expect(page.locator('#modelWrap')).toBeVisible();
  await expect(page.locator('#correctCount')).toHaveText('1');
  await expect(page.locator('#nextBtn')).toBeEnabled();

  await page.locator('#nextBtn').click();
  await expect(page.locator('#progressText')).toHaveText('2 / 16');
  await expect(page.locator('#progressBar')).toHaveAttribute('aria-valuenow', '2');
  await expect(page.locator('#sceneImage')).toHaveAttribute('src', /g1pq_02_run\.webp/);
  await expect(page.locator('#sceneTitle')).toBeFocused();
  await expect(page.locator('#modelWrap')).toBeHidden();

  const view = await page.locator('#sceneTitle').evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    scrollY: window.scrollY
  }));
  expect(view.top).toBeGreaterThanOrEqual(0);
  expect(view.top).toBeLessThan(844);
});

test('Ctrl+Enter checks the visible manual input path', async ({ page }) => {
  await openStudio(page, { width: 390, height: 844 });
  await page.locator('#manualInput').fill(ANSWERS[0]);
  await page.locator('#manualInput').press(process.platform === 'darwin' ? 'Meta+Enter' : 'Control+Enter');
  await expect(page.locator('#feedbackBox')).toContainText('정답');
  await expect(page.locator('#nextBtn')).toBeEnabled();
});

test('speech-unavailable mode exposes direct input as the primary action', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'SpeechRecognition', { configurable: true, value: undefined });
    Object.defineProperty(window, 'webkitSpeechRecognition', { configurable: true, value: undefined });
  });
  await openStudio(page, { width: 390, height: 844 });

  await expect(page.locator('#micBtn')).toBeDisabled();
  await expect(page.locator('#micBtn')).toBeHidden();
  await expect(page.locator('#manualFocusBtn')).toBeVisible();
  await expect(page.locator('#manualTools')).toHaveAttribute('open', '');
  await page.locator('#manualFocusBtn').click();
  await expect(page.locator('#manualInput')).toBeFocused();
});

test('image failure reveals a code fallback without blocking the activity', async ({ page }) => {
  await openStudio(page);
  await page.locator('#sceneImage').evaluate((image) => {
    image.src = '../assets/c14/grammar/images/g1-picture-quiz/missing-scene.webp';
  });

  await expect(page.locator('#sceneImageFallback')).toBeVisible();
  await expect(page.locator('#sceneImage')).toBeHidden();
  await expect(page.locator('#leadWords .word-pill')).toHaveCount(2);
  await answerCurrent(page, ANSWERS[0]);
  await expect(page.locator('#feedbackBox')).toContainText('정답');
});

for (const viewport of [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 640, height: 800 },
  { width: 768, height: 1024 },
  { width: 960, height: 768 },
  { width: 961, height: 768 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
]) {
  test(`primary action and layout fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await openStudio(page, viewport);
    const layout = await page.evaluate(() => {
      const primary = document.querySelector('#manualFocusBtn:not([hidden]), #micBtn:not([hidden])');
      const box = primary?.getBoundingClientRect();
      return {
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        actionTop: box?.top ?? Number.POSITIVE_INFINITY,
        actionBottom: box?.bottom ?? Number.POSITIVE_INFINITY,
        wordBreaks: [...document.querySelectorAll('.word-pill')].map((pill) => ({
          width: pill.getBoundingClientRect().width,
          height: pill.getBoundingClientRect().height,
          lineHeight: Number.parseFloat(getComputedStyle(pill).lineHeight)
        }))
      };
    });

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.actionTop).toBeGreaterThanOrEqual(0);
    expect(layout.actionTop).toBeLessThan(viewport.height);
    expect(layout.actionBottom).toBeLessThanOrEqual(viewport.height + 2);
    for (const pill of layout.wordBreaks) {
      expect(pill.height).toBeLessThanOrEqual(Math.max(40, pill.lineHeight * 1.8));
    }
  });
}

test('reduced motion keeps the final state without animated transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openStudio(page);
  const motion = await page.evaluate(() => ({
    progressTransition: getComputedStyle(document.querySelector('#progressBar')).transitionDuration,
    pillAnimation: getComputedStyle(document.querySelector('.word-pill')).animationDuration,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior
  }));
  const toSeconds = (value) => value.endsWith('ms') ? Number.parseFloat(value) / 1000 : Number.parseFloat(value);
  expect(toSeconds(motion.progressTransition)).toBeLessThanOrEqual(0.001);
  expect(toSeconds(motion.pillAnimation)).toBeLessThanOrEqual(0.001);
  expect(motion.scrollBehavior).toBe('auto');
});

test('normal interaction completes without browser console or page errors', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await openStudio(page, { width: 390, height: 844 });
  await answerCurrent(page, ANSWERS[0]);
  await page.locator('#nextBtn').click();
  await expect(page.locator('#progressText')).toHaveText('2 / 16');
  expect(errors).toEqual([]);
});

test('all sixteen preserved model answers reach the focused summary and restart', async ({ page }) => {
  test.slow();
  await openStudio(page, { width: 1024, height: 768 });

  for (let index = 0; index < ANSWERS.length; index += 1) {
    await answerCurrent(page, ANSWERS[index]);
    await expect(page.locator('#nextBtn')).toBeEnabled();
    await page.locator('#nextBtn').click();
  }

  await expect(page.locator('#summaryPanel')).toBeVisible();
  await expect(page.locator('#summaryTitle')).toBeFocused();
  await expect(page.locator('#summaryCorrect')).toHaveText('16 / 16');
  await expect(page.locator('#summaryRate')).toHaveText('100%');
  await expect(page.locator('#summaryRetry')).toContainText('ALL CLEAR');

  await page.locator('#restartBtn').click();
  await expect(page.locator('#progressText')).toHaveText('1 / 16');
  await expect(page.locator('#sceneTitle')).toBeFocused();
  await expect(page.locator('#summaryPanel')).toBeHidden();
});
