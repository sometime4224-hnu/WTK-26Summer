const { test, expect } = require('@playwright/test');

const pages = [
  {
    path: '/c13/grammar1.html',
    title: 'A/V-(으)ㄹ까 봐',
    quizTotal: 10,
    resources: [
      { href: 'grammar1-wb-practice.html', text: '문법 1 WB 연습' },
      { href: 'grammar1-mini-game.html', text: '문법 1 미니 게임' }
    ],
    illustration: true,
    visualCards: 0,
    prev: null,
    next: 'grammar2.html'
  },
  {
    path: '/c13/grammar2.html',
    title: 'V-고 있다',
    quizTotal: 10,
    resources: [
      { href: 'grammar2-mini-game.html', text: '문법 2 미니 게임' },
      { href: 'grammar2-workbook-practice.html', text: '문법 2 WB 연습' },
      { href: 'grammar1-2-mini-game.html', text: '문법1·2 융합 미니 게임' },
      { href: 'grammar1-2-speaking.html', text: '문법1·2 융합 말하기' }
    ],
    illustration: true,
    visualCards: 0,
    prev: 'grammar1.html',
    next: 'grammar3.html'
  },
  {
    path: '/c13/grammar3.html',
    title: 'A/V-았/었어야 했는데',
    quizTotal: 10,
    resources: [
      { href: 'grammar3-wb-practice.html', text: '문법 3 WB 보조활동' },
      { href: 'grammar1-3-quiz.html', text: '문법 1+3 융합 퀴즈' }
    ],
    illustration: true,
    visualCards: 0,
    prev: 'grammar2.html',
    next: 'grammar4.html'
  },
  {
    path: '/c13/grammar4.html',
    title: 'V-도록',
    quizTotal: 12,
    resources: [
      { href: 'grammar4-dorok-lab.html', text: 'V-도록 의미 실험' },
      { href: 'grammar4-wb-practice.html', text: '문법 4 WB 보조활동' }
    ],
    illustration: false,
    visualCards: 4,
    prev: 'grammar3.html',
    next: 'index.html'
  }
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ar', name: 'العربية' },
  { code: 'mn', name: 'Монгол' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'th', name: 'ไทย' }
];

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

async function expectTranslationsOff(page) {
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'none');
  await expect(page.locator('.multilang-scaffold__box.lang-visible')).toHaveCount(0);
}

async function answerCurrentQuestionWrong(page) {
  if (await page.locator('#shortWrap:not(.hidden)').count()) {
    await page.locator('#shortInput').fill('__wrong__');
    await page.locator('#checkShortBtn').click();
    return;
  }

  const wrongChoice = await page.evaluate(() => {
    const prompt = document.getElementById('qText').textContent;
    const item = window.C13_GRAMMAR_PAGE.quiz.find((q) => q.q === prompt);
    const choices = Array.from(document.querySelectorAll('#choices button')).map((button) => button.textContent);
    return choices.find((choice) => choice !== item.answer) || choices[0];
  });
  await page.locator('#choices button').filter({ hasText: wrongChoice }).first().click();
}

test('c13 grammar main pages are responsive and expose the latest shared structure', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { name: 'desktop', width: 1280, height: 900 },
    { name: 'tablet-landscape-large', width: 1180, height: 820, tabletLandscape: true, tightHero: true },
    { name: 'tablet-landscape-medium', width: 1024, height: 768, tabletLandscape: true, tightHero: true },
    { name: 'tablet-landscape-edge', width: 900, height: 700, tabletLandscape: true },
    { name: 'tablet-portrait', width: 820, height: 1180 },
    { name: 'phone-portrait', width: 390, height: 844 }
  ];

  for (const target of pages) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(target.path, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('h1')).toContainText(target.title);
      await expect(page.locator('.hero-panel')).toBeVisible();
      await expect(page.locator('#learnPanel')).toBeVisible();
      await expect(page.locator('#tabLearn')).toBeVisible();
      await expect(page.locator('#tabDrill')).toBeVisible();
      await expect(page.locator('#tabQuiz')).toBeVisible();
      await expect(page.locator('.meaning-card')).toHaveCount(4);
      if (target.illustration) {
        const image = page.locator('.hero-illustration__image');
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('src', /main-illustrations/);
        await expect.poll(async () => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);

        const imageBox = await image.evaluate((node) => {
          const box = node.getBoundingClientRect();
          return { width: box.width, height: box.height };
        });
        const ratio = imageBox.width / imageBox.height;
        if (viewport.tabletLandscape) {
          expect(imageBox.height, `${viewport.name} image height`).toBeGreaterThanOrEqual(170);
          expect(imageBox.height, `${viewport.name} image height`).toBeLessThanOrEqual(290);
        } else {
          expect(Math.abs(ratio - (16 / 9))).toBeLessThan(0.04);
        }

        if (viewport.tightHero) {
          const layout = await page.evaluate(() => {
            const hero = document.querySelector('.hero-panel').getBoundingClientRect();
            const learn = document.querySelector('#learnPanel').getBoundingClientRect();
            return {
              heroHeight: Math.round(hero.height),
              learnTop: Math.round(learn.top)
            };
          });
          expect(layout.heroHeight, `${viewport.name} hero height`).toBeLessThanOrEqual(760);
          expect(layout.learnTop, `${viewport.name} learn panel top`).toBeLessThanOrEqual(viewport.height + 40);
        }
      } else {
        await expect(page.locator('.hero-illustration')).toHaveCount(0);
      }
      await expect(page.locator('.visual-card')).toHaveCount(target.visualCards);
      await expectNoHorizontalOverflow(page);
    }
  }
});

test('c13 grammar4 renders optimized dorok visual cards', async ({ page }) => {
  await blockExternalRequests(page);

  const viewports = [
    { width: 1280, height: 900 },
    { width: 820, height: 1180 },
    { width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/c13/grammar4.html', { waitUntil: 'domcontentloaded' });

    const cards = page.locator('.visual-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.locator('img')).toHaveCount(4);

    for (const image of await cards.locator('img').all()) {
      await expect(image).toHaveAttribute('src', /grammar4-dorok\/dorok-.+-640\.webp$/);
      await expect(image).toHaveAttribute('srcset', /grammar4-dorok\/dorok-.+-960\.webp 960w/);
      await expect(image).toHaveAttribute('alt', /.+/);
      await expect.poll(async () => image.evaluate((node) => node.complete && node.naturalWidth > 0)).toBe(true);
    }

    await expect(cards.locator('img').first()).toHaveAttribute('fetchpriority', 'high');
    await expect(cards.locator('img').nth(1)).toHaveAttribute('loading', 'lazy');
    await expectNoHorizontalOverflow(page);
  }
});

test('c13 grammar main pages expose existing support links and footer navigation', async ({ page }) => {
  await blockExternalRequests(page);

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.resource-link')).toHaveCount(target.resources.length);
    for (const resource of target.resources) {
      const link = page.locator(`.resource-link[href="${resource.href}"]`);
      await expect(link).toBeVisible();
      await expect(link).toContainText(resource.text);
    }
    if (!target.resources.length) {
      await expect(page.locator('.flow-panel')).toBeVisible();
    }

    await expect(page.locator('.footer-nav a[href="index.html"]').first()).toContainText('13과 목록');
    if (target.prev) {
      await expect(page.locator(`.footer-nav a[href="${target.prev}"]`)).toBeVisible();
    }
    if (target.next) {
      await expect(page.locator(`.footer-nav a[href="${target.next}"]`).first()).toBeVisible();
    }
  }
});

test('c13 grammar main pages support all scaffold languages', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });

  for (const target of pages) {
    await page.goto(target.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.multilang-scaffold')).toBeVisible();

    for (const lang of languages) {
      const button = page.locator(`[data-multilang-btn="${lang.code}"]`);
      await expect(button).toBeVisible();
      await expect(button).toContainText(lang.name);
      await button.click();
      await expectOnlyScaffoldLanguageVisible(page, lang.code);
      if (lang.code === 'vi') {
        await expect(page.locator('.multilang-scaffold__box[data-lang="vi"]')).toContainText('Hỗ trợ Tiếng Việt');
      }
      await expectNoHorizontalOverflow(page);
    }

    await expect(page.locator('.multilang-scaffold__box[data-lang="ar"]')).toHaveAttribute('dir', 'rtl');
    await page.locator('[data-multilang-btn="none"]').click();
    await expectTranslationsOff(page);
    await expectNoHorizontalOverflow(page);
  }
});

test('c13 grammar drill and quiz flows work on every main page', async ({ page }) => {
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
    await expect(page.locator('#quizProgress')).toContainText(`1 / ${target.quizTotal}`);

    for (let i = 0; i < target.quizTotal; i += 1) {
      await answerCurrentQuestionWrong(page);
      await expect(page.locator('#feedbackBox')).toBeVisible();
      await page.locator('#nextBtn').click();
    }

    await expect(page.locator('#resultPanel')).toBeVisible();
    await expect(page.locator('#restartQuizBtn')).toBeVisible();
    await expect(page.locator('#retryWrongBtn')).toBeEnabled();
  }
});
