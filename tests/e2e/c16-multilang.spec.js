const { test, expect } = require('@playwright/test');

const LANGUAGE_CODES = ['en', 'vi', 'ar', 'mn', 'kk', 'th'];
const BUTTON_CODES = ['none', ...LANGUAGE_CODES];
const BUTTON_LABELS = ['번역 끄기', 'English', 'Tiếng Việt', 'العربية', 'Монгол', 'Қазақша', 'ไทย'];

const SCAFFOLD_PAGES = [
  { path: '/c16/grammar1.html', label: '문법 1', anchor: '.glass-card.hero-card', ariaLabel: '다국어 문법 도움말', grammar: true },
  { path: '/c16/grammar2.html', label: '문법 2', anchor: '.hero', ariaLabel: '다국어 문법 도움말', grammar: true },
  { path: '/c16/grammar3.html', label: '문법 3', anchor: '.hero', ariaLabel: '다국어 문법 도움말', grammar: true },
  { path: '/c16/grammar4.html', label: '문법 4', anchor: '.hero', ariaLabel: '다국어 문법 도움말', grammar: true },
  { path: '/c16/reading.html', label: '읽기', anchor: '.hero', ariaLabel: '다국어 읽기 도움말' },
  { path: '/c16/reading-cuttoon.html', label: '읽기 컷툰', anchor: '.hero', ariaLabel: '다국어 읽기 도움말' },
  { path: '/c16/listening1.html', label: '듣기 1', anchor: '.lw-hero', ariaLabel: '다국어 듣기 도움말', listening: true },
  { path: '/c16/listening2.html', label: '듣기 2', anchor: '.lw-hero', ariaLabel: '다국어 듣기 도움말', listening: true }
];

const LISTENING_PAGES = [
  { path: '/c16/listening1.html', track: 'track74', koreanLine: '질문에 답하세요' },
  { path: '/c16/listening2.html', track: 'track75', koreanLine: '질문에 답하세요' }
];

const RESPONSIVE_PAGES = [
  { path: '/c16/grammar1.html', action: '#quizChoices button' },
  { path: '/c16/reading.html', action: '.hero-actions .action-link' },
  { path: '/c16/vocabulary.html', action: '.word-card' },
  { path: '/c16/listening1.html', action: '[data-action="set-stage"]' }
];

async function blockExternalRequests(page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173(?:\/|$))/, (route) => route.abort());
}

function watchLocalFailures(page) {
  const failures = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    // External analytics/CDN requests are deliberately aborted in this suite.
    if (/Failed to load resource: net::ERR_FAILED/i.test(text)) return;
    failures.push(`console.error: ${text}`);
  });
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  return failures;
}

async function expectStandardButtonOrder(page) {
  const buttons = page.locator('[data-multilang-btn]');
  await expect(buttons).toHaveCount(BUTTON_CODES.length);
  expect(await buttons.evaluateAll((items) => items.map((item) => item.dataset.multilangBtn))).toEqual(BUTTON_CODES);
  expect((await buttons.allTextContents()).map((text) => text.trim())).toEqual(BUTTON_LABELS);
}

for (const target of SCAFFOLD_PAGES) {
  test(`C16 ${target.label}은 표준 6개 언어 비계만 표시한다`, async ({ page }) => {
    await blockExternalRequests(page);
    const failures = watchLocalFailures(page);
    await page.addInitScript(() => {
      try {
        localStorage.removeItem('preferred-lang');
      } catch (error) {}
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    await expectStandardButtonOrder(page);
    const scaffold = page.locator('[data-multilang-scaffold="auto"]');
    await expect(scaffold).toHaveCount(1);
    await expect(scaffold).toHaveAttribute('aria-label', target.ariaLabel);
    await expect(scaffold.locator('.lang-box')).toHaveCount(LANGUAGE_CODES.length);
    expect(await scaffold.locator('.lang-box').evaluateAll((boxes) => boxes.map((box) => box.dataset.lang))).toEqual(LANGUAGE_CODES);
    await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
    await expect(scaffold.locator('.lang-box.lang-visible')).toHaveCount(0);

    const isImmediatelyAfterAnchor = await scaffold.evaluate((panel, anchorSelector) => {
      const anchor = document.querySelector(anchorSelector);
      return Boolean(anchor && anchor.parentElement === panel.parentElement && anchor.nextElementSibling === panel);
    }, target.anchor);
    expect(isImmediatelyAfterAnchor).toBe(true);

    for (const code of LANGUAGE_CODES) {
      await page.locator(`[data-multilang-btn="${code}"]`).click();
      await expect(page.locator('body')).toHaveAttribute('data-active-lang', code);
      await expect(scaffold.locator('.lang-box.lang-visible')).toHaveCount(1);
      const box = scaffold.locator(`.lang-box[data-lang="${code}"]`);
      await expect(box).toBeVisible();
      await expect(box).toHaveAttribute('lang', code);
      await expect(box.locator('p')).not.toHaveText('');
      if (code === 'ar') await expect(box).toHaveAttribute('dir', 'rtl');
    }

    await page.locator('[data-multilang-btn="none"]').click();
    await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
    await expect(scaffold.locator('.lang-box.lang-visible')).toHaveCount(0);

    if (target.grammar) {
      await expect(page.locator('[data-vi-toggle], [data-vi-panel], .translation-toggle, .vi-panel')).toHaveCount(0);
    }
    if (target.listening) {
      await expect(page.locator('[data-action="set-instruction-language"], [data-action="set-quiz-language"], .lw-quiz-language-bar')).toHaveCount(0);
    }

    const layout = await page.evaluate(() => ({
      h1Top: document.querySelector('h1')?.getBoundingClientRect().top ?? Infinity,
      overflows: document.documentElement.scrollWidth > window.innerWidth + 1
    }));
    expect(layout.h1Top).toBeLessThanOrEqual(280);
    expect(layout.overflows).toBe(false);
    expect(failures).toEqual([]);
  });
}

test('C16 언어 선택은 페이지 사이에서 유지되고 잘못된 저장값은 번역 끄기로 폴백한다', async ({ page }) => {
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);

  await page.goto('/c16/grammar1.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-multilang-btn="kk"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'kk');
  expect(await page.evaluate(() => localStorage.getItem('preferred-lang'))).toBe('kk');

  await page.goto('/c16/reading.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'kk');
  await expect(page.locator('.lang-box.lang-visible')).toHaveCount(1);
  await expect(page.locator('.lang-box[data-lang="kk"]')).toBeVisible();

  await page.goto('/c16/vocabulary.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'kk');
  await expect(page.locator('.word-card').first().locator('.word-card__translation')).toHaveAttribute('lang', 'kk');

  await page.evaluate(() => localStorage.setItem('preferred-lang', 'unsupported-language'));
  await page.goto('/c16/reading-cuttoon.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
  await expect(page.locator('[data-multilang-btn="none"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.lang-box.lang-visible')).toHaveCount(0);
  expect(failures).toEqual([]);
});

test('C16 대표 페이지는 320px와 390px, 1440×900 200% 환경에서 가로로 넘치지 않는다', async ({ page }) => {
  test.setTimeout(90_000);
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);
  const cdp = await page.context().newCDPSession(page);
  const viewportCases = [
    { physicalWidth: 320, physicalHeight: 844, cssWidth: 320, cssHeight: 844, deviceScaleFactor: 1 },
    { physicalWidth: 390, physicalHeight: 844, cssWidth: 390, cssHeight: 844, deviceScaleFactor: 1 },
    // A 1440×900 display at 200% browser zoom has an effective 720×450 CSS viewport.
    { physicalWidth: 1440, physicalHeight: 900, cssWidth: 720, cssHeight: 450, deviceScaleFactor: 2 }
  ];

  for (const viewport of viewportCases) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.cssWidth,
      height: viewport.cssHeight,
      screenWidth: viewport.physicalWidth,
      screenHeight: viewport.physicalHeight,
      deviceScaleFactor: viewport.deviceScaleFactor,
      mobile: false
    });

    for (const target of RESPONSIVE_PAGES) {
      await page.goto(target.path, { waitUntil: 'domcontentloaded' });
      const metrics = await page.evaluate(() => ({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        h1Top: document.querySelector('h1')?.getBoundingClientRect().top ?? Infinity,
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      }));
      expect(metrics.innerWidth).toBe(viewport.cssWidth);
      expect(metrics.innerHeight).toBe(viewport.cssHeight);
      expect(metrics.devicePixelRatio).toBe(viewport.deviceScaleFactor);
      expect(metrics.h1Top).toBeLessThanOrEqual(280);
      expect(metrics.overflows).toBe(false);

      const action = page.locator(target.action).first();
      await expect(action).toBeVisible();
      await action.scrollIntoViewIfNeeded();
      const actionBox = await action.boundingBox();
      expect(actionBox).not.toBeNull();
      expect(actionBox.y).toBeGreaterThanOrEqual(0);
      expect(actionBox.y + actionBox.height).toBeLessThanOrEqual(viewport.cssHeight + 1);
    }
  }
  expect(failures).toEqual([]);
});

test('C16 문법 퀴즈, 읽기 이동, 듣기 자막은 키보드와 포인터로 동작한다', async ({ page }) => {
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/c16/grammar1.html', { waitUntil: 'domcontentloaded' });
  const correctGrammarChoice = page.locator('#quizChoices button').first();
  await correctGrammarChoice.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#quizFeedback')).toContainText('정답!');
  await expect(page.locator('#nextQuizBtn')).toBeEnabled();

  await page.goto('/c16/reading.html', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: '컷툰 보기' }).click();
  await expect(page).toHaveURL(/\/c16\/reading-cuttoon\.html$/);
  await expect(page.locator('h1')).toContainText('한강공원의 숨은 재미');

  await page.evaluate(() => {
    const prefix = 'korean3b.listening.v3:/c16/listening1.html:track74';
    localStorage.setItem(`${prefix}:listens`, JSON.stringify(2));
    localStorage.setItem(`${prefix}:stage`, JSON.stringify(0));
  });
  await page.goto('/c16/listening1.html', { waitUntil: 'domcontentloaded' });
  const fullTranscriptStage = page.locator('[data-action="set-stage"][data-lesson-id="track74"][data-stage="2"]');
  await fullTranscriptStage.click();
  await expect(fullTranscriptStage).toHaveClass(/is-active/);
  await expect(page.locator('#transcript-track74 .lw-transcript-line').first()).toContainText('질문에 답하세요');
  expect(failures).toEqual([]);
});

test('C16 어휘 28개는 6개 번역과 정확한 lang/dir 메타데이터를 제공한다', async ({ page }) => {
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('preferred-lang');
    } catch (error) {}
  });
  await page.goto('/c16/vocabulary.html', { waitUntil: 'domcontentloaded' });

  await expectStandardButtonOrder(page);
  const coverage = await page.evaluate((languages) => {
    const words = window.VOCABULARY_CONFIG.words;
    return {
      configLanguages: window.VOCABULARY_CONFIG.languages,
      toggleLanguages: window.MULTILANG_CONFIG.langs,
      wordCount: words.length,
      missing: words.flatMap((word) => languages
        .filter((language) => !String(word[language] || '').trim())
        .map((language) => `${word.id}:${language}`))
    };
  }, LANGUAGE_CODES);
  expect(coverage.configLanguages).toEqual(LANGUAGE_CODES);
  expect(coverage.toggleLanguages).toEqual(LANGUAGE_CODES);
  expect(coverage.wordCount).toBe(28);
  expect(coverage.missing).toEqual([]);
  await expect(page.locator('.word-card')).toHaveCount(28);

  const firstCard = page.locator('.word-card').first();
  const cardTranslation = firstCard.locator('.word-card__translation');
  await expect(cardTranslation).toHaveAttribute('lang', 'ko');
  await expect(cardTranslation).toHaveAttribute('dir', 'ltr');
  await firstCard.focus();
  await page.keyboard.press('Enter');
  await expect(firstCard).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Space');
  await expect(firstCard).toHaveAttribute('aria-pressed', 'false');

  for (const code of LANGUAGE_CODES) {
    await page.locator(`[data-multilang-btn="${code}"]`).click();
    await expect(cardTranslation).toHaveAttribute('lang', code);
    await expect(cardTranslation).toHaveAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
    const expectedText = await page.evaluate((language) => window.VOCABULARY_CONFIG.words[0][language], code);
    await expect(cardTranslation.locator('.word-card__translation-text')).toHaveText(expectedText);
  }

  await page.locator('[data-view="list"]').click();
  const firstListTranslations = page.locator('.list-item').first().locator('.translation-cell');
  await expect(firstListTranslations).toHaveCount(LANGUAGE_CODES.length);
  expect(await firstListTranslations.evaluateAll((cells) => cells.map((cell) => ({
    lang: cell.lang,
    dir: cell.dir
  })))).toEqual(LANGUAGE_CODES.map((code) => ({
    lang: code,
    dir: code === 'ar' ? 'rtl' : 'ltr'
  })));

  await page.locator('[data-multilang-btn="ar"]').click();
  await page.locator('[data-view="quiz"]').click();
  const quizOptions = page.locator('.quiz-option');
  await expect(quizOptions).toHaveCount(4);
  expect(await quizOptions.evaluateAll((options) => options.map((option) => ({
    lang: option.lang,
    dir: option.dir
  })))).toEqual(Array(4).fill({ lang: 'ar', dir: 'rtl' }));
  await page.locator('.quiz-option[data-correct="false"]').first().click();
  await expect(page.locator('#quiz-feedback')).toHaveAttribute('lang', 'ko');
  await expect(page.locator('#quiz-feedback')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#quiz-feedback span')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#quiz-feedback span')).toHaveAttribute('dir', 'rtl');

  await page.locator('[data-multilang-btn="none"]').click();
  await expect(page.locator('.quiz-option')).toHaveCount(4);
  await expect(page.locator('.quiz-option').first()).toHaveAttribute('lang', 'ko');
  await expect(page.locator('.quiz-option').first()).toHaveAttribute('dir', 'ltr');
  expect(await page.locator('.quiz-option').evaluateAll((options) => options.map((option) => ({
    lang: option.lang,
    dir: option.dir
  })))).toEqual(Array(4).fill({ lang: 'ko', dir: 'ltr' }));
  expect(failures).toEqual([]);
});

for (const target of LISTENING_PAGES) {
  test(`C16 ${target.track}은 한국어 학습 계약과 기존 진행 상태를 보존한다`, async ({ page }) => {
    await blockExternalRequests(page);
    const failures = watchLocalFailures(page);
    await page.addInitScript(({ path, track }) => {
      try {
        const prefix = `korean3b.listening.v3:${path}`;
        localStorage.removeItem('preferred-lang');
        localStorage.setItem(`${prefix}:page:instruction-language`, JSON.stringify('vi'));
        localStorage.setItem(`${prefix}:${track}:quiz-language`, JSON.stringify('vi'));
        localStorage.setItem(`${prefix}:${track}:listens`, JSON.stringify(2));
        localStorage.setItem(`${prefix}:${track}:stage`, JSON.stringify(2));
        localStorage.setItem(`${prefix}:${track}:speed`, JSON.stringify(0.8));
      } catch (error) {}
    }, target);
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    const configAudit = await page.evaluate(() => {
      const legacyFields = [];
      const visit = (value, path = 'config') => {
        if (!value || typeof value !== 'object') return;
        Object.entries(value).forEach(([key, child]) => {
          const childPath = `${path}.${key}`;
          if (key === 'vi' || /Vi$/.test(key)) legacyFields.push(childPath);
          visit(child, childPath);
        });
      };
      visit(window.LISTENING_WORKBOOK_CONFIG);
      return {
        instructionLanguage: window.LISTENING_WORKBOOK_CONFIG.instructionLanguage,
        translationScaffold: window.LISTENING_WORKBOOK_CONFIG.translationScaffold,
        legacyFields
      };
    });
    expect(configAudit.instructionLanguage).toEqual({ enabled: false, default: 'ko' });
    expect(configAudit.translationScaffold).toEqual(expect.objectContaining({
      mode: 'minimal',
      localizeLearnerContent: false,
      hideTranslations: true,
      maxSubtitleStage: 2
    }));
    expect(configAudit.legacyFields).toEqual([]);

    await expect(page.locator('[data-action="set-instruction-language"], [data-action="set-quiz-language"], .lw-quiz-language-bar')).toHaveCount(0);
    expect(await page.locator(`[data-action="set-stage"][data-lesson-id="${target.track}"]`).evaluateAll((buttons) => (
      buttons.map((button) => Number(button.dataset.stage))
    ))).toEqual([0, 1, 2]);
    await expect(page.locator(`[data-action="set-stage"][data-stage="3"][data-lesson-id="${target.track}"]`)).toHaveCount(0);
    await expect(page.locator(`#transcript-${target.track} .lw-transcript-line`).first()).toContainText(target.koreanLine);
    await expect(page.locator(`#transcript-${target.track} .lw-line-translation`)).toHaveCount(0);
    await expect(page.locator(`[data-action="set-speed"][data-speed="0.8"][data-lesson-id="${target.track}"]`).first()).toHaveClass(/is-active/);

    const keywordStage = page.locator(`[data-action="set-stage"][data-lesson-id="${target.track}"][data-stage="1"]`);
    await keywordStage.click();
    await expect(keywordStage).toHaveClass(/is-active/);
    const fullTranscriptStage = page.locator(`[data-action="set-stage"][data-lesson-id="${target.track}"][data-stage="2"]`);
    await fullTranscriptStage.focus();
    await page.keyboard.press('Enter');
    await expect(fullTranscriptStage).toHaveClass(/is-active/);
    await expect(page.locator(`#transcript-${target.track} .lw-transcript-line`).first()).toContainText(target.koreanLine);

    const oldStorage = await page.evaluate(({ path, track }) => {
      const prefix = `korean3b.listening.v3:${path}`;
      return {
        instruction: localStorage.getItem(`${prefix}:page:instruction-language`),
        quiz: localStorage.getItem(`${prefix}:${track}:quiz-language`),
        listens: localStorage.getItem(`${prefix}:${track}:listens`),
        stage: localStorage.getItem(`${prefix}:${track}:stage`),
        speed: localStorage.getItem(`${prefix}:${track}:speed`)
      };
    }, target);
    expect(oldStorage).toEqual({
      instruction: JSON.stringify('vi'),
      quiz: JSON.stringify('vi'),
      listens: JSON.stringify(2),
      stage: JSON.stringify(2),
      speed: JSON.stringify(0.8)
    });

    const foldBody = page.locator(`#quiz-fold-body-${target.track}`);
    if (await foldBody.count() && !(await foldBody.isVisible())) {
      await page.locator(`[data-action="toggle-quiz-fold"][data-lesson-id="${target.track}"]`).click();
    }
    const answers = await page.evaluate(() => (
      window.LISTENING_WORKBOOK_CONFIG.lessons[0].questions.map((question) => question.answer)
    ));
    for (let index = 0; index < answers.length; index += 1) {
      await page.locator(`#quiz-card-${target.track}-${index} input[value="${answers[index]}"]`).check();
    }
    await page.locator(`#quiz-submit-${target.track}`).click();
    await expect(page.locator(`#quiz-status-${target.track}`)).toContainText(`${answers.length}문항 중 ${answers.length}문항 정답`);
    expect(failures).toEqual([]);
  });
}
