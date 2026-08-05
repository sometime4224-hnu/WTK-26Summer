const { test, expect } = require('@playwright/test');
const itemData = require('../../apps/passive-voice-lab/data/items.v2.json');
const feedbackData = require('../../apps/passive-voice-lab/data/feedback.v2.json');

const STATE_KEY = 'korean3b:apps:passive-voice:v2:state';

test.describe('피동 탐험대 프로그램 허브 통합', () => {
  test('프로그램 허브에서 피동 이야기로 이동한다', async ({ page }) => {
    await page.goto('/apps/index.html');
    const card = page.locator('[data-app="passive-voice-lab"]');
    await expect(card).toContainText('피동 탐험대');
    await card.click();
    await expect(page).toHaveURL(/\/apps\/passive-voice-lab\/source-story\.html$/);
    await expect(page.locator('h1')).toHaveText('누구를 중심에 둘까요?');
  });

  for (const width of [390, 320]) {
    test(`${width}px에서 첫 학습 행동과 응답이 보이고 가로로 넘치지 않는다`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/apps/passive-voice-lab/index.html');
      await expect(page.locator('.first-action')).toBeInViewport();
      await expect(page.locator('[data-choice]').first()).toBeInViewport();
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        targetTop: document.querySelector('h1').getBoundingClientRect().top
      }));
      expect(metrics.overflow).toBeLessThanOrEqual(2);
      expect(metrics.targetTop).toBeLessThan(280);
    });
  }

  for (const width of [390, 320]) {
    test(`이야기 첫 화면은 ${width}px에서 목표와 다음 행동이 보인다`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/apps/passive-voice-lab/source-story.html');
      await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '1');
      await expect(page.locator('[data-story-next]')).toBeInViewport();
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        targetTop: document.querySelector('h1').getBoundingClientRect().top
      }));
      expect(metrics.overflow).toBeLessThanOrEqual(2);
      expect(metrics.targetTop).toBeLessThan(280);
    });
  }

  test('이야기는 35개 장면을 다음·이전·키보드로 이동하고 현재 장면을 복원한다', async ({ page }) => {
    const storyKey = 'korean3b:apps:passive-voice:source-story:v1:state';
    await page.goto('/apps/passive-voice-lab/source-story.html');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '1');
    for (let frame = 2; frame <= 35; frame += 1) {
      await page.locator('[data-story-next]').click();
      await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', String(frame));
      if (frame === 5) {
        await expect(page.locator('[data-story-table] tbody tr')).toHaveCount(5);
        for (const row of await page.locator('[data-story-table] tbody tr').all()) {
          await expect(row.locator('td')).toHaveCount(4);
        }
        await expect(page.locator('[data-story-table]')).toContainText('바뀌다');
        await expect(page.locator('[data-story-table]')).toContainText('들리다');
        await expect(page.locator('[data-story-table]')).toContainText('담기다');
      }
      if (frame === 8) {
        const arrow = page.locator('[data-object="arrow-one"]');
        await page.waitForTimeout(900);
        await expect(arrow).toBeVisible();
        await expect(arrow).toHaveText('→');
        expect(await arrow.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
      }
      if (frame === 24) {
        await page.waitForTimeout(900);
        expect(await page.locator('[data-object="arrow-one"]').evaluate((element) => getComputedStyle(element).transform)).toBe('none');
      }
      if (frame === 32) {
        const story = page.locator('[data-story-scene]');
        const target = story.locator('[data-object="role-subject"]');
        const agent = story.locator('[data-object="role-agent"]');
        const passive = story.locator('[data-object="role-passive"]');
        await expect(target).toBeVisible();
        await expect(agent).toBeVisible();
        await expect(passive).toBeVisible();
        await expect(target).toContainText(/대상\s*이\/가/);
        await expect(agent).toContainText(/주어\s*에게/);
        await expect(passive).toContainText('피동사');
        await page.waitForTimeout(900);
        const boxes = await Promise.all([target.boundingBox(), agent.boundingBox(), passive.boundingBox()]);
        expect(boxes.every(Boolean)).toBe(true);
        expect(boxes[0].x + boxes[0].width).toBeLessThanOrEqual(boxes[1].x);
        expect(boxes[1].x + boxes[1].width).toBeLessThanOrEqual(boxes[2].x);
      }
    }
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '35');
    await expect(page.locator('[data-story-next]')).toBeHidden();
    await expect(page.locator('.story-finish [data-story-continue]')).toHaveAttribute('href', 'index.html');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '35');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '34');
    await page.keyboard.press('End');
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('.reset-link').click();
    await page.locator('[data-story-scene]').focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('Space');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '2');
    await page.reload();
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '2');
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storyKey);
    expect(saved.currentFrame).toBe(2);
    expect(saved.schemaVersion).toBe(1);
  });

  test('완료한 이야기는 이전 장면 기록이 있어도 진단으로 계속할 수 있는 마지막 장면을 연다', async ({ page }) => {
    const storyKey = 'korean3b:apps:passive-voice:source-story:v1:state';
    await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify({
      schemaVersion: 1, currentFrame: 34, completed: true, updatedAt: new Date().toISOString()
    })), storyKey);
    await page.goto('/apps/passive-voice-lab/source-story.html');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '35');
    await expect(page.locator('.story-finish')).toBeVisible();
    await expect(page.locator('.story-finish [data-story-continue]')).toHaveAttribute('href', 'index.html');
  });

  test('320px에서도 피동 역할 세 장이 겹치지 않고 왼쪽에서 오른쪽으로 놓인다', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto('/apps/passive-voice-lab/source-story.html');
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '32');
    await page.waitForTimeout(900);
    const metrics = await page.evaluate(() => {
      const visual = document.querySelector('.visual-scene').getBoundingClientRect();
      const cards = ['role-subject', 'role-agent', 'role-passive'].map((name) => document.querySelector(`[data-object="${name}"]`).getBoundingClientRect());
      return { visual: { left: visual.left, right: visual.right }, cards: cards.map((card) => ({ left: card.left, right: card.right })) };
    });
    expect(metrics.cards[0].left).toBeGreaterThanOrEqual(metrics.visual.left);
    expect(metrics.cards[2].right).toBeLessThanOrEqual(metrics.visual.right);
    expect(metrics.cards[0].right).toBeLessThanOrEqual(metrics.cards[1].left);
    expect(metrics.cards[1].right).toBeLessThanOrEqual(metrics.cards[2].left);
  });

  test('버튼에 초점이 있을 때 Space는 이야기 단축키 대신 버튼의 기본 동작을 따른다', async ({ page }) => {
    await page.goto('/apps/passive-voice-lab/source-story.html');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '2');
    await page.locator('[data-story-back]').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '1');

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '3');
    await page.locator('.reset-link').focus();
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.keyboard.press('Space');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '3');
    page.once('dialog', (dialog) => dialog.accept());
    await page.keyboard.press('Space');
    await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', '1');
  });

  test('이야기의 손상되거나 알 수 없는 기록은 초기화 전까지 보존한다', async ({ page }) => {
    const storyKey = 'korean3b:apps:passive-voice:source-story:v1:state';
    const unknownRaw = JSON.stringify({ schemaVersion: 99, currentFrame: 8 });
    const nonCanonicalZero = JSON.stringify({ schemaVersion: 1, currentFrame: 8, completed: false, updatedAt: '0' });
    const nonCanonicalDate = JSON.stringify({ schemaVersion: 1, currentFrame: 8, completed: false, updatedAt: 'Aug 5 2026' });
    for (const raw of ['{broken', unknownRaw, nonCanonicalZero, nonCanonicalDate]) {
      await page.addInitScript(([key, value]) => localStorage.setItem(key, value), [storyKey, raw]);
      await page.goto('/apps/passive-voice-lab/source-story.html');
      await expect(page.locator('.storage-recovery')).toBeVisible();
      await page.locator('[data-story-next]').click();
      expect(await page.evaluate((key) => localStorage.getItem(key), storyKey)).toBe(raw);
      page.once('dialog', (dialog) => dialog.accept());
      await page.locator('.storage-recovery [data-story-reset]').click();
      expect(await page.evaluate((key) => localStorage.getItem(key), storyKey)).toBeNull();
    }
  });

  test('이야기는 줄어든 모션과 좁거나 낮은 화면에서도 안전하게 표시된다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 720, height: 450 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.url().includes('/apps/passive-voice-lab/') && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    await page.goto('/apps/passive-voice-lab/source-story.html');
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      actionBottom: document.querySelector('[data-story-next]').getBoundingClientRect().bottom,
      transition: getComputedStyle(document.querySelector('[data-object="me"]')).transitionDuration
    }));
    expect(metrics.overflow).toBeLessThanOrEqual(2);
    expect(metrics.actionBottom).toBeLessThanOrEqual(450);
    expect(metrics.transition).toBe('0.001s');
    expect(errors).toEqual([]);
  });

  test('720×450의 모든 이야기 장면은 보이는 객체와 이동 제어를 화면 안에 유지한다', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 720, height: 450 });
    await page.goto('/apps/passive-voice-lab/source-story.html');
    for (let frame = 1; frame <= 35; frame += 1) {
      if (frame > 1) await page.locator('[data-story-next]').click();
      await page.waitForTimeout(20);
      await expect(page.locator('[data-story-scene]')).toHaveAttribute('data-frame', String(frame));
      const metrics = await page.evaluate(() => {
        const visual = document.querySelector('.visual-scene').getBoundingClientRect();
        const visibleObjects = Array.from(document.querySelectorAll('[data-object]'))
          .filter((element) => {
            const style = getComputedStyle(element);
            return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.05;
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { name: element.dataset.object, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          });
        const next = document.querySelector('[data-story-next]');
        const back = document.querySelector('[data-story-back]').getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          visual: { left: visual.left, right: visual.right, top: visual.top, bottom: visual.bottom },
          visibleObjects,
          back: { top: back.top, bottom: back.bottom },
          next: next && !next.hidden ? (() => { const rect = next.getBoundingClientRect(); return { top: rect.top, bottom: rect.bottom }; })() : null
        };
      });
      expect(metrics.overflow).toBeLessThanOrEqual(2);
      expect(metrics.back.top).toBeGreaterThanOrEqual(0);
      expect(metrics.back.bottom).toBeLessThanOrEqual(450);
      if (metrics.next) {
        expect(metrics.next.top).toBeGreaterThanOrEqual(0);
        expect(metrics.next.bottom).toBeLessThanOrEqual(450);
      }
      for (const object of metrics.visibleObjects) {
        expect(object.left, `${frame}: ${object.name} left`).toBeGreaterThanOrEqual(metrics.visual.left);
        expect(object.right, `${frame}: ${object.name} right`).toBeLessThanOrEqual(metrics.visual.right);
        expect(object.top, `${frame}: ${object.name} top`).toBeGreaterThanOrEqual(metrics.visual.top);
        expect(object.bottom, `${frame}: ${object.name} bottom`).toBeLessThanOrEqual(metrics.visual.bottom);
      }
    }
    await page.locator('.story-finish [data-story-continue]').scrollIntoViewIfNeeded();
    await expect(page.locator('.story-finish [data-story-continue]')).toBeVisible();
  });

  test('응답을 앱 전용 키에 저장하고 새로고침 뒤 복원한다', async ({ page }) => {
    await page.goto('/apps/passive-voice-lab/index.html');
    await page.locator('[data-choice]').first().click();
    await expect(page.locator('.feedback-box')).toBeVisible();
    const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STATE_KEY);
    expect(saved.schemaVersion).toBe(2);
    expect(saved.responses['diag-01'].submitted).toBe(true);
    expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then((items) => items.length))).toBe(0);
    await page.reload();
    await expect(page.locator('.feedback-box')).toBeVisible();
  });

  test('손상된 기록을 덮어쓰지 않고 복구와 앱 전용 초기화를 제공한다', async ({ page }) => {
    await page.addInitScript(([key, raw]) => {
      if (sessionStorage.getItem('passive-corrupt-seeded')) return;
      localStorage.setItem(key, raw);
      sessionStorage.setItem('passive-corrupt-seeded', 'true');
    }, [STATE_KEY, '{broken']);
    await page.goto('/apps/passive-voice-lab/index.html');
    await expect(page.locator('.storage-recovery')).toContainText('기존 기록은 건드리지 않고');
    expect(await page.evaluate((key) => localStorage.getItem(key), STATE_KEY)).toBe('{broken');
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('[data-reset-storage]').click();
    await expect(page.locator('[data-choice]').first()).toBeVisible();
    const state = await page.evaluate((key) => localStorage.getItem(key), STATE_KEY);
    expect(state).not.toBe('{broken');
  });

  test('모든 단계가 하위 경로 자산으로 열리고 주요 피드백 상태가 작동한다', async ({ page }) => {
    const browserErrors = [];
    page.on('pageerror', (error) => browserErrors.push(error.message));
    page.on('response', (response) => {
      if (response.url().includes('/apps/passive-voice-lab/') && response.status() >= 400) {
        browserErrors.push(`${response.status()} ${response.url()}`);
      }
    });
    const routes = [
      ['index.html', '[data-choice]'],
      ['source-story.html', '[data-story-next]'],
      ['01-perspective.html', '[data-choice]'],
      ['02-roles.html', '[data-choice], [data-token]'],
      ['03-forms.html', '[data-choice]'],
      ['04-agent.html', '[data-choice]'],
      ['05-choice.html', '[data-choice]'],
      ['06-distinguish.html', '[data-choice]'],
      ['07-speaking.html', '[data-keyword]'],
      ['08-writing.html', 'input[name="reader"]'],
      ['09-review.html', '[data-choice]']
    ];
    const baseState = {
      schemaVersion: 2,
      contentVersion: '2.0.0',
      responses: {},
      completedPageIds: ['index', 'perspective', 'roles', 'forms', 'agent', 'choice', 'distinguish', 'speaking', 'writing']
    };

    await page.addInitScript(([key, state]) => {
      if (sessionStorage.getItem('passive-route-seeded')) return;
      localStorage.setItem(key, JSON.stringify(state));
      sessionStorage.setItem('passive-route-seeded', 'true');
    }, [STATE_KEY, baseState]);
    for (const [route, selector] of routes) {
      await page.goto(`/apps/passive-voice-lab/${route}`);
      if (route !== 'source-story.html') await expect(page.locator('#lesson-app')).not.toContainText('활동을 열지 못했어요');
      await expect(page.locator(selector).first()).toBeVisible();
    }

    for (const outcome of ['target', 'conditional', 'discouraged', 'incorrect']) {
      const item = itemData.items.find((candidate) =>
        candidate.track === 'core' && candidate.options?.some((option) => option.state === outcome)
      );
      const option = item.options.find((candidate) => candidate.state === outcome);
      const prior = itemData.items
        .filter((candidate) => candidate.track === 'core' && candidate.pageId === item.pageId)
        .findIndex((candidate) => candidate.id === item.id);
      const state = { ...baseState, pageCursor: { [item.pageId]: prior }, responses: {} };
      await page.goto('/apps/index.html');
      await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [STATE_KEY, state]);
      const pageFile = {
        index: 'index.html', perspective: '01-perspective.html', roles: '02-roles.html', forms: '03-forms.html',
        agent: '04-agent.html', choice: '05-choice.html', distinguish: '06-distinguish.html'
      }[item.pageId];
      await page.goto(`/apps/passive-voice-lab/${pageFile}`);
      const choice = page.locator(`[data-choice="${option.value}"]`);
      await choice.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.feedback-box')).toContainText(feedbackData.states[outcome].label);
    }
    expect(browserErrors).toEqual([]);
  });

  test('쓰기 초고와 수정본을 단계별로 자동 저장하고 복원한다', async ({ page }) => {
    const state = {
      schemaVersion: 2,
      contentVersion: '2.0.0',
      responses: {},
      completedPageIds: ['index', 'perspective', 'roles', 'forms', 'agent', 'choice', 'distinguish', 'speaking']
    };
    await page.goto('/apps/index.html');
    await page.evaluate(([key, value]) => localStorage.setItem(key, JSON.stringify(value)), [STATE_KEY, state]);
    await page.goto('/apps/passive-voice-lab/08-writing.html');

    await page.locator('input[name="reader"]').first().check();
    await page.locator('input[name="purpose"]').first().check();
    const draft = '의자가 놓였습니다. 안내문이 쓰였습니다. 문이 열렸습니다. 선물이 담겼습니다.';
    const revised = '의자가 무대 앞에 놓였습니다. 안내문이 새로 쓰였습니다. 출입문이 열렸습니다. 선물이 상자에 담겼습니다.';
    await page.locator('#draft').fill(draft);
    await page.locator('#draft').blur();
    await page.locator('[data-model]').click();
    for (const check of await page.locator('[data-w-check]').all()) await check.check();
    await expect(page.locator('#revised')).toBeEnabled();
    await page.locator('#revised').fill(revised);
    await page.locator('#revised').blur();
    await expect(page.locator('[data-save-w]')).toBeEnabled();
    await page.locator('[data-save-w]').click();
    await expect(page.locator('#toast')).toContainText('저장했어요');

    await page.reload();
    await expect(page.locator('#draft')).toHaveValue(draft);
    await expect(page.locator('#revised')).toHaveValue(revised);
    await expect(page.locator('[data-w-check]:checked')).toHaveCount(5);
  });

  test('1440×900의 200% 확대와 동일한 720×450 CSS 화면에서도 목표가 위쪽에 유지된다', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 450 });
    await page.goto('/apps/passive-voice-lab/index.html');
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      targetTop: document.querySelector('h1').getBoundingClientRect().top,
      actionBottom: document.querySelector('.first-action').getBoundingClientRect().bottom
    }));
    expect(metrics.overflow).toBeLessThanOrEqual(2);
    expect(metrics.targetTop).toBeLessThan(280);
    expect(metrics.actionBottom).toBeLessThanOrEqual(450);
  });
});
