const { test, expect } = require('@playwright/test');

const pages = [
  {
    path: '/c12/grammar1.html',
    title: 'V-았더니/었더니',
    visual: true,
    storyCount: 5,
    resources: [
      'grammar1-card-game.html',
      'grammar1-reason.html',
      'grammar1-2-speaking.html'
    ]
  },
  {
    path: '/c12/grammar2.html',
    title: '얼마나 -(으)ㄴ/는지 모르다',
    visual: true,
    storyCount: 6,
    resources: [
      'grammar2-degree-challenge.html',
      'grammar1-2-speaking.html',
      'grammar2-classic.html'
    ]
  },
  { path: '/c12/grammar3.html', title: '-(으)ㄴ/는 모양이다' },
  { path: '/c12/grammar4.html', title: '-아야/어야' }
];

const scaffoldPages = pages.filter((page) => !page.visual);

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
  { code: 'mn', name: 'Монгол' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'th', name: 'ไทย' }
];

const nonVietnameseLanguages = languages.filter((lang) => lang.code !== 'vi');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function expectOnlyScaffoldLanguageVisible(page, activeCode) {
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', activeCode);

  for (const lang of languages) {
    const box = page.locator(`.multilang-scaffold__box[data-lang="${lang.code}"]`);
    if (lang.code === activeCode) {
      await expect(box).toHaveClass(/lang-visible/);
      await expect(box).toBeVisible();
    } else {
      await expect(box).not.toHaveClass(/lang-visible/);
      await expect(box).toBeHidden();
    }
  }
}

async function expectOnlyStoryLanguageVisible(page, target, activeCode) {
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', activeCode);

  for (const lang of languages) {
    const boxes = page.locator(`.story-card .lang-box[data-lang="${lang.code}"]`);
    if (lang.code === activeCode) {
      await expect(boxes).toHaveCount(target.storyCount);
      await expect(page.locator(`.story-card .lang-box[data-lang="${lang.code}"].lang-visible`)).toHaveCount(target.storyCount);
    } else {
      await expect(page.locator(`.story-card .lang-box[data-lang="${lang.code}"].lang-visible`)).toHaveCount(0);
    }
  }
}

async function expectSelectedLanguageVisible(page, target, activeCode) {
  if (target.visual) {
    await expectOnlyStoryLanguageVisible(page, target, activeCode);
    return;
  }
  await expectOnlyScaffoldLanguageVisible(page, activeCode);
}

async function expectTranslationsOff(page) {
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
  await expect(page.locator('.multilang-scaffold__box.lang-visible')).toHaveCount(0);
  await expect(page.locator('.story-card .lang-box.lang-visible')).toHaveCount(0);
  await expect(page.locator('.quiz-translation.lang-visible')).toHaveCount(0);
}

async function answerCurrentQuestionWrong(page) {
  if (await page.locator('#shortWrap:not(.hidden)').count()) {
    await page.locator('#shortInput').fill('__wrong__');
    await page.locator('#checkShortBtn').click();
    return;
  }

  const wrongChoice = await page.evaluate(() => {
    const prompt = document.getElementById('qText').textContent;
    const config = window.C12_GRAMMAR_PAGE || window.C12_GRAMMAR1_VISUAL_PROTOTYPE || window.C12_GRAMMAR2_VISUAL_PAGE;
    const item = config.quiz.find((q) => q.q === prompt);
    const choices = Array.from(document.querySelectorAll('#choices button')).map((button) => button.textContent);
    return choices.find((choice) => choice !== item.answer) || choices[0];
  });
  await page.locator('#choices button').filter({ hasText: wrongChoice }).first().click();
}

test('c12 grammar main pages are responsive and expose the shared structure', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const target of pages) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(target.path, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('h1')).toContainText(target.title);
      if (target.visual) {
        await expect(page.locator('.story-card')).toHaveCount(target.storyCount);
        await expect(page.locator('.fullscreen-btn')).toHaveCount(target.storyCount);
        await expect(page.locator('.translation-bar')).toBeVisible();
      } else {
        await expect(page.locator('.hero-panel')).toBeVisible();
        await expect(page.locator('#learnPanel')).toBeVisible();
        await expect(page.locator('#tabLearn')).toBeVisible();
      }
      await expect(page.locator('#tabDrill')).toBeVisible();
      await expect(page.locator('#tabQuiz')).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  }
});

test('c12 grammar1 exposes the existing support activities only', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar1.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.resource-link')).toHaveCount(3);
  for (const href of pages[0].resources) {
    await expect(page.locator(`.resource-link[href="${href}"]`)).toBeVisible();
  }
});

test('c12 grammar2 exposes the visual support activities', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar2.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.resource-link')).toHaveCount(3);
  for (const href of pages[1].resources) {
    await expect(page.locator(`.resource-link[href="${href}"]`)).toBeVisible();
  }
});

test('c12 grammar1 classic version remains available with the old structure', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar1-classic.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('V-았더니/었더니');
  await expect(page.locator('.hero-panel')).toBeVisible();
  await expect(page.locator('#learnPanel')).toBeVisible();
  await expect(page.locator('#tabLearn')).toBeVisible();
  await expect(page.locator('a[href="grammar1.html"]')).toContainText('새 버전');

  await expect(page.locator('[data-multilang-btn="vi"]')).toBeVisible();
  await page.locator('[data-multilang-btn="vi"]').click();
  await expectOnlyScaffoldLanguageVisible(page, 'vi');
});

test('c12 grammar2 classic version remains available with the old structure', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/grammar2-classic.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('얼마나 -(으)ㄴ/는지 모르다');
  await expect(page.locator('.hero-panel')).toBeVisible();
  await expect(page.locator('#learnPanel')).toBeVisible();
  await expect(page.locator('#tabLearn')).toBeVisible();
  await expect(page.locator('a[href="grammar2.html"]')).toContainText('새 버전');

  await expect(page.locator('[data-multilang-btn="vi"]')).toBeVisible();
  await page.locator('[data-multilang-btn="vi"]').click();
  await expectOnlyScaffoldLanguageVisible(page, 'vi');
});

test('c12 grammar main pages support all scaffold languages', async ({ page }) => {
  await blockExternalRequests(page);

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    for (const lang of languages) {
      const button = page.locator(`[data-multilang-btn="${lang.code}"]`);
      await expect(button).toBeVisible();
      await expect(button).toContainText(lang.name);
      await button.click();
      await expectSelectedLanguageVisible(page, target, lang.code);

      if (lang.code === 'vi' && !target.visual) {
        await expect(page.locator('.multilang-scaffold__box[data-lang="vi"]')).toContainText('Hỗ trợ Tiếng Việt');
      }
    }

    if (target.visual) {
      await expect(page.locator('.story-card .lang-box[data-lang="ar"]').first()).toHaveAttribute('dir', 'rtl');
    } else {
      await expect(page.locator('.multilang-scaffold__box[data-lang="ar"]')).toHaveAttribute('dir', 'rtl');
    }
    await page.locator('[data-multilang-btn="none"]').click();
    await expectTranslationsOff(page);
  }
});

test('c12 grammar dynamic Vietnamese helpers follow the selected language', async ({ page }) => {
  await blockExternalRequests(page);

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-multilang-btn="vi"]').click();
    await expectSelectedLanguageVisible(page, target, 'vi');

    await page.locator('#tabDrill').click();
    await page.locator('#drillFace').click();
    await expect(page.locator('#drillFace .quiz-translation[data-lang="vi"]')).toBeVisible();

    await page.locator('#tabQuiz').click();
    await expect(page.locator('#qHintVi')).toBeVisible();
    await answerCurrentQuestionWrong(page);
    await expect(page.locator('#feedbackBox .quiz-translation[data-lang="vi"]')).toBeVisible();

    await page.locator('[data-multilang-btn="none"]').click();
    await expectTranslationsOff(page);
  }
});

test('c12 grammar dynamic Vietnamese helpers stay hidden for non-Vietnamese languages', async ({ page }) => {
  await blockExternalRequests(page);

  for (const target of pages) {
    for (const lang of nonVietnameseLanguages) {
      await page.goto(target.path, { waitUntil: 'domcontentloaded' });
      await page.locator(`[data-multilang-btn="${lang.code}"]`).click();
      await expectSelectedLanguageVisible(page, target, lang.code);

      await page.locator('#tabDrill').click();
      await page.locator('#drillFace').click();
      await expect(page.locator('#drillFace .quiz-translation[data-lang="vi"]')).toBeHidden();

      await page.locator('#tabQuiz').click();
      await expect(page.locator('#qHintVi')).toBeHidden();
      await answerCurrentQuestionWrong(page);
      await expect(page.locator('#feedbackBox .quiz-translation[data-lang="vi"]')).toBeHidden();
    }
  }
});

test('c12 grammar multilingual controls fit on mobile', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    if (target.visual) {
      await expect(page.locator('.translation-bar')).toBeVisible();
    } else {
      await expect(page.locator('.multilang-scaffold')).toBeVisible();
    }

    for (const lang of languages) {
      await page.locator(`[data-multilang-btn="${lang.code}"]`).click();
      await expectSelectedLanguageVisible(page, target, lang.code);
      await expectNoHorizontalOverflow(page);
    }

    await page.locator('[data-multilang-btn="none"]').click();
    await expectTranslationsOff(page);
    await expectNoHorizontalOverflow(page);
  }
});

test('c12 grammar drill and quiz flows work on every main page', async ({ page }) => {
  await blockExternalRequests(page);

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    await page.locator('#tabDrill').click();
    await expect(page.locator('#drillPanel')).toBeVisible();
    await expect(page.locator('#drillProgress')).toContainText('1 / 8');
    await page.locator('#drillFace').click();
    await expect(page.locator('#drillActions')).toBeVisible();

    for (let i = 0; i < 8; i += 1) {
      if (!(await page.locator('#drillActions:not(.hidden)').count())) {
        await page.locator('#drillFace').click();
      }
      await page.locator('#drillRetryBtn').click();
    }
    await expect(page.locator('#drillResult')).toBeVisible();
    await expect(page.locator('#restartDrillBtn')).toBeVisible();
    await expect(page.locator('#reviewDrillBtn')).toBeEnabled();

    await page.locator('#tabQuiz').click();
    await expect(page.locator('#quizPanel')).toBeVisible();
    await expect(page.locator('#quizProgress')).toContainText('1 / 8');

    for (let i = 0; i < 8; i += 1) {
      await answerCurrentQuestionWrong(page);
      await expect(page.locator('#feedbackBox')).toBeVisible();
      await page.locator('#nextBtn').click();
    }

    await expect(page.locator('#resultPanel')).toBeVisible();
    await expect(page.locator('#restartQuizBtn')).toBeVisible();
    await expect(page.locator('#retryWrongBtn')).toBeEnabled();
  }
});
