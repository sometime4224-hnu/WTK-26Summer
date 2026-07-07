const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
});

test('reading slot lab renders 20-item practice set', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('h1')).toHaveText('빈칸 성분 연습');
  await expect(page.locator('.rail-button')).toHaveCount(20);
  await expect(page.locator('.component-button')).toHaveCount(7);
  await expect(page.locator('[data-component-option="subject"]')).toContainText('주어 (S)');
  await expect(page.locator('[data-component-option="predicate"]')).toContainText('동사/형용사 (V/Adj)');
  await expect(page.locator('[data-component-option="adverbial"]')).toContainText('부사어 (Adv)');
  await expect(page.locator('[data-component-option="subject"] .component-support')).toContainText('조사');
  await expect(page.locator('[data-component-option="subject"] .support-chip')).toContainText('이/가');
  await expect(page.locator('[data-component-option="object"] .support-chip')).toContainText('을/를');
  await expect(page.locator('[data-component-option="adverbial"] .support-chip')).toContainText(['에', '에서', '(으)로']);
  await expect(page.locator('[data-component-option="predicate"] .component-support')).toContainText('예');
  await expect(page.locator('[data-component-option="predicate"] .support-chip')).toContainText(['하다', '좋다']);
  await expect(page.locator('[data-component-option="connective"] .support-chip')).toContainText(['그리고', '-고']);
  await expect(page.locator('#itemCountText')).toHaveText('전체 20문항');

  const dataAudit = await page.evaluate(() => ({
    itemCount: window.READING_SLOT_LAB_DATA.items.length,
    lessons: window.READING_SLOT_LAB_DATA.items.reduce((result, item) => {
        result[item.lesson] = (result[item.lesson] || 0) + 1;
        return result;
    }, {}),
    shortPassageItems: window.READING_SLOT_LAB_DATA.items
      .filter((item) => !Array.isArray(item.passage) || item.passage.length < 3)
      .map((item) => item.id),
    invalidTargetItems: window.READING_SLOT_LAB_DATA.items
      .filter((item) => item.passage.filter((line) => (
        Object.prototype.hasOwnProperty.call(line, 'before') || Object.prototype.hasOwnProperty.call(line, 'after')
      )).length !== 1)
      .map((item) => item.id),
    exposedParticleItems: window.READING_SLOT_LAB_DATA.items
      .filter((item) => /^(은|는|이|가|을|를|의)\s*/.test(item.after.trim()))
      .map((item) => item.id),
    hintProblems: window.READING_SLOT_LAB_DATA.items.flatMap((item) => {
      const lineTexts = item.passage.map((line) => (
        Object.prototype.hasOwnProperty.call(line, 'text')
          ? line.text
          : `${line.before || ''}${line.after || ''}`
      ));
      return ['syntax', 'logic'].flatMap((type) => {
        const hints = item.hints?.[type];
        if (!Array.isArray(hints) || !hints.length) {
          return [`${item.id}:${type}:missing`];
        }
        return hints
          .filter((hint) => !lineTexts[hint.line - 1]?.includes(hint.text))
          .map((hint) => `${item.id}:${type}:${hint.line}:${hint.text}`);
      });
    })
  }));
  expect(dataAudit.itemCount).toBe(20);
  expect(dataAudit.lessons).toEqual({ 10: 5, 11: 5, 12: 5, 13: 5 });
  expect(dataAudit.shortPassageItems).toEqual([]);
  expect(dataAudit.invalidTargetItems).toEqual([]);
  expect(dataAudit.exposedParticleItems).toEqual([]);
  expect(dataAudit.hintProblems).toEqual([]);
  await expect(page.locator('.passage-sentence')).toHaveCount(3);
  await expect(page.locator('.passage-sentence.is-target')).toHaveCount(1);
});

test('midterm hub links to reading slot lab', async ({ page }) => {
  await page.goto('/midterm-exam/index.html', { waitUntil: 'domcontentloaded' });

  const card = page.locator('a[href="../apps/reading-slot-lab/index.html"]');
  await expect(card).toContainText('빈칸 성분 연습');
  await expect(card).toContainText('읽기 지문의 빈칸에 들어갈 말의 성분과 근거를 연습합니다.');

  await card.click();
  await expect(page).toHaveURL(/\/apps\/reading-slot-lab\/index\.html$/);
  await expect(page.locator('h1')).toHaveText('빈칸 성분 연습');
});

test('reading slot lab highlights syntax and logic hints', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.hint-button')).toHaveCount(2);
  await page.locator('[data-hint-type="logic"]').click();
  await expect(page.locator('[data-hint-type="logic"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-hint-type="syntax"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hint-mark--logic')).toHaveCount(2);
  await expect(page.locator('.hint-mark--logic')).toContainText([
    '영원할 거라고 생각합니다',
    '하지만'
  ]);
  await expect(page.locator('.hint-note')).toContainText('내용 단서');

  await page.locator('[data-hint-type="syntax"]').click();
  await expect(page.locator('[data-hint-type="syntax"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-hint-type="logic"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.hint-mark--logic')).toHaveCount(0);
  await expect(page.locator('.hint-mark--syntax')).toHaveText('있다고 합니다');
  await expect(page.locator('.hint-note')).toContainText('성분 단서');

  await page.locator('#nextButton').click();
  await expect(page.locator('#questionTitle')).toHaveText('2번');
  await expect(page.locator('.hint-mark')).toHaveCount(0);
  await expect(page.locator('[data-hint-type="syntax"]')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-hint-type="logic"]')).toHaveAttribute('aria-pressed', 'false');
});

test('reading slot lab filters lessons and scores only component choices', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-filter="10"]').click();
  await expect(page.locator('.rail-button')).toHaveCount(5);
  await expect(page.locator('#itemCountText')).toHaveText('10과 5문항');
  await expect(page.locator('#sourceLabel')).toContainText('10과 읽기');

  await page.locator('#draftInput').fill('다른 답');
  await page.locator('[data-component-option="subject"]').click();
  await page.locator('#checkButton').click();

  await expect(page.locator('#feedbackPanel')).toContainText('맞았습니다.');
  await expect(page.locator('#feedbackPanel')).toContainText('유통 기한이');
  await expect(page.locator('#feedbackPanel')).toContainText('누가/무엇이 - 주어 (S)');
  await expect(page.locator('#feedbackPanel')).toContainText('내 답: 다른 답');
  await expect(page.locator('#scoreText')).toHaveText('1 / 20');
});

test('reading slot lab accepts reviewed alternative components for flexible blanks', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await page.locator('.rail-button').nth(1).click();
  await expect(page.locator('#questionTitle')).toHaveText('2번');
  await page.locator('#draftInput').fill('행복한');
  await page.locator('[data-component-option="adnominal"]').click();
  await page.locator('#checkButton').click();

  await expect(page.locator('#feedbackPanel')).toContainText('가능합니다.');
  await expect(page.locator('#feedbackPanel')).toContainText('언제/어디서/어떻게/왜 - 부사어 (Adv)');
  await expect(page.locator('#feedbackPanel')).toContainText('어떤/무슨 - 관형어 (Adn)');
  await expect(page.locator('#feedbackPanel')).toContainText('행복한');
  await expect(page.locator('#feedbackPanel')).toContainText('좋은');
  await expect(page.locator('#scoreText')).toHaveText('1 / 20');
  await expect(page.locator('.rail-button').nth(1)).toHaveClass(/is-correct/);
});

test('reading slot lab restores saved progress after reload', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await page.locator('.rail-button').nth(10).click();
  await expect(page.locator('#sourceLabel')).toContainText('12과 읽기');
  await page.locator('#draftInput').fill('들어');
  await page.locator('[data-component-option="predicate"]').click();
  await page.locator('#checkButton').click();
  await expect(page.locator('#feedbackPanel')).toContainText('맞았습니다.');

  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('#sourceLabel')).toContainText('12과 읽기');
  await expect(page.locator('#draftInput')).toHaveValue('들어');
  await expect(page.locator('[data-component-option="predicate"]')).toHaveClass(/is-selected/);
  await expect(page.locator('#feedbackPanel')).toContainText('맞았습니다.');
  await expect(page.locator('#scoreText')).toHaveText('1 / 20');
});

test('reading slot lab marks wrong component without grading the draft answer', async ({ page }) => {
  await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-component-option="object"]').click();
  await page.locator('#draftInput').fill('유통 기한이');
  await page.locator('#checkButton').click();

  await expect(page.locator('#feedbackPanel')).toContainText('다시 보세요.');
  await expect(page.locator('#feedbackPanel')).toContainText('가능한 분류: 누가/무엇이 - 주어 (S)');
  await expect(page.locator('#scoreText')).toHaveText('0 / 20');
  await expect(page.locator('.rail-button').first()).toHaveClass(/is-wrong/);
});

test('reading slot lab fits mobile and desktop without horizontal overflow', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1180, height: 820 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto('/apps/reading-slot-lab/index.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.rail-button')).toHaveCount(20);
    await expect(page.locator('.component-button')).toHaveCount(7);
    await page.locator('[data-hint-type="logic"]').click();
    await expectNoHorizontalOverflow(page);

    const layout = await page.evaluate(() => {
      const workArea = document.querySelector('.work-area').getBoundingClientRect();
      const panel = document.querySelector('.practice-panel').getBoundingClientRect();
      const firstChoice = document.querySelector('.component-button').getBoundingClientRect();
      const tallestChoice = Math.max(...Array.from(document.querySelectorAll('.component-button')).map((button) => button.getBoundingClientRect().height));
      return {
        workAreaTop: workArea.top,
        panelWidth: panel.width,
        choiceWidth: firstChoice.width,
        tallestChoice,
        viewportWidth: window.innerWidth
      };
    });

    expect(layout.workAreaTop).toBeLessThan(260);
    expect(layout.panelWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.choiceWidth).toBeGreaterThan(120);
    expect(layout.tallestChoice).toBeLessThanOrEqual(viewport.width < 700 ? 76 : 88);
  }
});
