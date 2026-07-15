const { test, expect } = require('@playwright/test');

const activities = [
  {
    name: '점진 변화 사본',
    path: '/c14/grammar4-gradual-change-candidate.html',
    storageKey: 'c14-grammar4-gradual-change-candidate-v1',
    cardCount: 13,
    firstCardId: 'care-grow',
    totalPrefix: '변화'
  },
  {
    name: '공용 에셋 점진 변화 사본',
    path: '/c14/grammar4-gradual-change-assets-candidate.html',
    storageKey: 'c14-grammar4-gradual-change-assets-candidate-v1',
    cardCount: 16,
    firstCardId: 'flower-garden-assets',
    totalPrefix: '에셋 변화'
  }
];

async function openFresh(page, activity) {
  await page.goto(activity.path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), activity.storageKey);
  await page.reload({ waitUntil: 'load' });
}

for (const activity of activities) {
  test(`${activity.name}은 변화 상태·포커스·자동 저장을 보존한다`, async ({ page }) => {
    await openFresh(page, activity);

    const card = page.locator(`.motion-card[data-card-id="${activity.firstCardId}"]`);
    const advance = card.locator('[data-action="advance"]');
    const reset = card.locator('[data-action="reset"]');

    await expect(card).toHaveAttribute('data-stage', '0');
    await expect(card).toHaveAttribute('data-visual-state', 'initial');
    await expect(card.locator('[data-nontext-visual]')).toHaveAttribute('data-visual-state', 'initial');

    await advance.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveAttribute('data-stage', '1');
    await expect(card).toHaveAttribute('data-visual-state', 'changing');
    await expect(card.locator('[data-nontext-visual]')).toHaveAttribute('data-visual-state', 'changing');
    await expect(advance).toBeFocused();
    await expect(page.locator('#totalProgress')).toContainText(`${activity.totalPrefix} 1회`);

    await page.keyboard.press('Space');
    await expect(card).toHaveAttribute('data-stage', '2');
    await expect(advance).toBeFocused();

    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), activity.storageKey);
    expect(saved.version).toBe(1);
    expect(saved.stages[activity.firstCardId]).toBe(2);

    await page.reload({ waitUntil: 'load' });
    await expect(card).toHaveAttribute('data-stage', '2');
    await expect(card).toHaveAttribute('data-visual-state', 'changing');

    await reset.focus();
    await page.keyboard.press('Enter');
    await expect(card).toHaveAttribute('data-stage', '0');
    await expect(card).toHaveAttribute('data-visual-state', 'initial');
    await expect(advance).toBeFocused();
  });

  test(`${activity.name}은 손상·차단된 저장소에서도 계속 동작한다`, async ({ browser }) => {
    const malformedContext = await browser.newContext();
    const malformedPage = await malformedContext.newPage();
    await malformedPage.goto(activity.path, { waitUntil: 'domcontentloaded' });
    await malformedPage.evaluate(([key]) => localStorage.setItem(key, '{broken'), [activity.storageKey]);
    await malformedPage.reload({ waitUntil: 'domcontentloaded' });
    await expect(malformedPage.locator('.motion-card').first()).toHaveAttribute('data-stage', '0');
    await malformedPage.locator('.motion-card').first().locator('[data-action="advance"]').click();
    await expect(malformedPage.locator('.motion-card').first()).toHaveAttribute('data-stage', '1');
    await malformedContext.close();

    const blockedContext = await browser.newContext();
    await blockedContext.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('storage blocked'); };
      Storage.prototype.setItem = () => { throw new Error('storage blocked'); };
    });
    const blockedPage = await blockedContext.newPage();
    const pageErrors = [];
    blockedPage.on('pageerror', (error) => pageErrors.push(error.message));
    await blockedPage.goto(activity.path, { waitUntil: 'domcontentloaded' });
    await blockedPage.locator('.motion-card').first().locator('[data-action="advance"]').click();
    await expect(blockedPage.locator('.motion-card').first()).toHaveAttribute('data-stage', '1');
    expect(pageErrors).toEqual([]);
    await blockedContext.close();
  });

  test(`${activity.name}은 이미지 오류 뒤에도 코드 기반 변화와 조작을 유지한다`, async ({ page }) => {
    await openFresh(page, activity);

    const card = page.locator('.motion-card').first();
    if (await card.locator('img').count() === 0) {
      await card.locator('[data-action="advance"]').click();
      await expect(card).toHaveAttribute('data-stage', '1');
    }
    const image = card.locator('img').first();
    await expect(image).toHaveCount(1);
    await image.evaluate((element) => { element.src = 'missing-candidate-asset.webp'; });

    await expect(image).toBeHidden();
    await expect(card.locator('.media-frame')).toHaveClass(/is-asset-error/);
    await expect(card.locator('.media-frame')).toHaveAttribute('data-asset-fallback', 'true');
    await card.locator('[data-action="advance"]').click();
    await expect(card).toHaveAttribute('data-stage', activity.firstCardId === 'flower-garden-assets' ? '2' : '1');
    await expect(card.locator('[data-nontext-visual]')).toHaveAttribute('data-visual-state', 'changing');
  });
}

test('두 사본은 모바일·태블릿·데스크톱·200% 확대에서 주요 동작이 보인다', async ({ page }) => {
  const viewports = [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ];

  for (const activity of activities) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await openFresh(page, activity);

      const audit = await page.evaluate(() => {
        const board = document.querySelector('#board');
        const firstAction = document.querySelector('.motion-card [data-action="advance"]');
        const firstActionBox = firstAction.getBoundingClientRect();
        const actionHeights = Array.from(document.querySelectorAll('button'))
          .filter((button) => !button.hidden)
          .map((button) => button.getBoundingClientRect().height);
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          firstActionTop: firstActionBox.top,
          firstActionVisible: firstActionBox.top < window.innerHeight,
          minimumActionHeight: Math.min(...actionHeights),
          boardHasRail: board.scrollWidth > board.clientWidth + 1,
          boardOverflowY: getComputedStyle(board).overflowY,
          teacherOnlyCount: document.querySelectorAll('[data-copy-layer="TEACHER_ONLY"]').length,
          videoCount: document.querySelectorAll('video').length
        };
      });

      expect(audit.documentWidth).toBeLessThanOrEqual(audit.viewportWidth + 1);
      expect(audit.minimumActionHeight).toBeGreaterThanOrEqual(44);
      expect(audit.teacherOnlyCount).toBe(0);
      expect(audit.videoCount).toBe(0);
      if (viewport.width <= 390) {
        expect(audit.firstActionVisible).toBe(true);
        expect(audit.firstActionTop).toBeGreaterThanOrEqual(0);
        expect(audit.boardHasRail).toBe(true);
        expect(audit.boardOverflowY).toBe('hidden');
      }
    }

    await page.setViewportSize({ width: 768, height: 900 });
    await openFresh(page, activity);
    const zoomAudit = await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
      const action = document.querySelector('.motion-card [data-action="advance"]');
      action.scrollIntoView({ block: 'center', inline: 'nearest' });
      const box = action.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        actionHeight: box.height,
        actionVisible: box.top < window.innerHeight
      };
    });
    expect(zoomAudit.documentWidth).toBeLessThanOrEqual(zoomAudit.viewportWidth + 1);
    expect(zoomAudit.actionHeight).toBeGreaterThanOrEqual(44);
    expect(zoomAudit.actionVisible).toBe(true);
  }
});

test('두 사본은 감속 모션·터치·로컬 전용 요청을 지킨다', async ({ browser }) => {
  for (const activity of activities) {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const remoteRequests = [];
    const consoleErrors = [];
    const pageErrors = [];

    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.origin !== 'http://127.0.0.1:4173') remoteRequests.push(request.url());
    });
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(activity.path, { waitUntil: 'load' });
    const button = page.locator('.motion-card').first().locator('[data-action="advance"]');
    await button.tap();
    await expect(page.locator('.motion-card').first()).toHaveAttribute('data-stage', '1');

    const motionAudit = await page.evaluate(() => {
      const values = Array.from(document.querySelectorAll('*')).flatMap((element) => {
        const style = getComputedStyle(element);
        return [style.animationDuration, style.transitionDuration];
      });
      const seconds = values.flatMap((value) => value.split(',')).map((value) => {
        const trimmed = value.trim();
        return trimmed.endsWith('ms') ? parseFloat(trimmed) / 1000 : parseFloat(trimmed) || 0;
      });
      return Math.max(...seconds);
    });

    expect(motionAudit).toBeLessThanOrEqual(0.001);
    expect(remoteRequests).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    await context.close();
  }
});

test('두 사본의 로컬 이미지와 카드 수가 완전하다', async ({ page }) => {
  for (const activity of activities) {
    await openFresh(page, activity);
    await expect(page.locator('.motion-card')).toHaveCount(activity.cardCount);

    const imageAudit = await page.locator('img').evaluateAll((images) => images.map((image) => ({
      src: image.getAttribute('src'),
      complete: image.complete,
      width: image.naturalWidth
    })));
    expect(imageAudit.length).toBeGreaterThan(0);
    expect(imageAudit.filter((image) => !image.complete || image.width <= 0)).toEqual([]);
    expect(imageAudit.filter((image) => /^https?:\/\//.test(image.src || ''))).toEqual([]);
  }
});
