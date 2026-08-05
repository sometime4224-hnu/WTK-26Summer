const { test, expect } = require('@playwright/test');

const GAME_URL = '/c16/instrument-delivery-chaos/index.html';
const STORAGE_KEY = 'korean3b:c16:instrument-delivery-chaos';

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().includes('/c16/instrument-delivery-chaos/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

async function finishRound(page, distance) {
  await page.evaluate((value) => {
    window.C16InstrumentDelivery.quickLaunch(.72, 44);
    window.C16InstrumentDelivery.useSpecial();
    window.C16InstrumentDelivery.finishFlight(value);
  }, distance);
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'transition');
  await expect(page.locator('#relayToast')).toBeVisible();
}

test('C16 허브에서 두 번째 순수 게임으로 진입할 수 있다', async ({ page }) => {
  await page.goto('/c16/index.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.hero__chip')).toContainText(['순수 게임 2개']);
  const gameLink = page.locator('a[href="instrument-delivery-chaos/index.html"]');
  await expect(gameLink).toHaveCount(1);
  await expect(gameLink).toContainText('커다란 악기를 던져 황당하게 배달하기');
});

for (const viewport of [
  { name: '390px mobile', width: 390, height: 844, titleTopLimit: 280 },
  { name: '320px mobile', width: 320, height: 844, titleTopLimit: 280 },
  { name: 'desktop 200 percent equivalent', width: 720, height: 450, titleTopLimit: 150 }
]) {
  test(`${viewport.name}에서 제목과 첫 행동이 첫 화면 안에 있다`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

    const layout = await page.evaluate(() => {
      const title = document.querySelector('#gameTitle').getBoundingClientRect();
      const start = document.querySelector('#startGame').getBoundingClientRect();
      return {
        titleTop: title.top,
        startTop: start.top,
        startBottom: start.bottom,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      };
    });

    expect(layout.titleTop).toBeLessThanOrEqual(viewport.titleTopLimit);
    expect(layout.startTop).toBeGreaterThanOrEqual(0);
    expect(layout.startBottom).toBeLessThanOrEqual(layout.viewportHeight);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    await expect(page.getByRole('button', { name: '던지기 시작' })).toBeVisible();
  });
}

test('조작이 이어지고 다섯 악기가 결과 창 없이 릴레이로 완주한다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle('생각도 못 한 악기 배달');
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await page.getByRole('button', { name: '던지기 시작' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'aiming');
  await expect(page.locator('#roundValue')).toHaveText('1');

  const action = page.locator('#actionButton');
  await action.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0 });
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'charging');
  await page.waitForTimeout(140);
  await action.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'mouse', button: 0 });
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'flying');

  await page.waitForTimeout(80);
  await action.click();
  let actionState = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  await expect(action).toContainText(actionState.actionVerb);
  expect(actionState.aftershockCharges).toBeGreaterThanOrEqual(2);
  expect(actionState.aftershockCharges).toBeLessThanOrEqual(3);
  await page.waitForTimeout(240);
  const beforeNudge = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  await action.click();
  actionState = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(actionState.actionCount).toBe(beforeNudge.actionCount + 1);
  expect(actionState.aftershockCharges).toBeLessThanOrEqual(3);

  await page.getByRole('button', { name: '게임 일시정지' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'paused');
  await page.getByRole('button', { name: '다시 던지기' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'flying');

  await page.evaluate(() => window.C16InstrumentDelivery.finishFlight(43));
  await expect(page.locator('#relayTitle')).toHaveText(/43m/);
  await expect(page.locator('#roundResultScreen')).toHaveCount(0);
  await action.click();
  await expect(page.locator('#roundValue')).toHaveText('2');

  await finishRound(page, 71);
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'aiming', { timeout: 2_500 });
  await expect(page.locator('#roundValue')).toHaveText('3');

  await finishRound(page, 118);
  await action.click();
  await expect(page.locator('#roundValue')).toHaveText('4');

  await finishRound(page, 64);
  await action.click();
  await expect(page.locator('#roundValue')).toHaveText('5');

  await finishRound(page, 92);
  await expect(action).toContainText('사고 보고서 바로 보기');
  await action.click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'final');
  await expect(page.locator('#finalTitle')).toHaveText('주차장 안에서만 유명한 밴드');
  await expect(page.getByRole('button', { name: '한 판 더' })).toBeVisible();

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.schemaVersion).toBe(1);
  expect(saved.plays).toBe(1);
  expect(saved.bestDistance).toBe(118);
  expect(saved.activeRun).toBeNull();

  await page.getByRole('button', { name: '한 판 더' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'aiming');
  await expect(page.locator('#roundValue')).toHaveText('1');
  expect(errors).toEqual([]);
});

test('다섯 악기의 서로 다른 특수 기술을 모두 사용할 수 있다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  const ids = ['piano', 'trumpet', 'guitar', 'drum', 'violin'];

  for (const [index, id] of ids.entries()) {
    const state = await page.evaluate(({ instrumentId, offset }) => {
      const others = ['piano', 'trumpet', 'guitar', 'drum', 'violin'].filter((item) => item !== instrumentId);
      window.C16InstrumentDelivery.startWithOrder([instrumentId, others[0], others[1]]);
      window.C16InstrumentDelivery.quickLaunch(.7, 42 + offset);
      const used = window.C16InstrumentDelivery.useSpecial();
      return { used, ...window.C16InstrumentDelivery.getState() };
    }, { instrumentId: id, offset: index });

    expect(state.instrumentId).toBe(id);
    expect(state.state).toBe('flying');
    expect(state.used).toBe(true);
    expect(state.specialAvailable).toBe(false);
    expect(state.aftershockCharges).toBeGreaterThanOrEqual(2);
    expect(state.aftershockCharges).toBeLessThanOrEqual(3);
  }
  expect(errors).toEqual([]);
});

test('다섯 악기의 고유 강점이 안내와 실제 물리 효과로 분명히 갈린다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  const profiles = [
    { id: 'piano', owner: '피아노', verb: '치다', strength: '건반 치기 충격파', mode: 'pianoSmashActive' },
    { id: 'trumpet', owner: '트럼펫', verb: '불다', strength: '숨 불기 바람포', mode: 'blowActive' },
    { id: 'guitar', owner: '기타', verb: '튕기다', strength: '줄 튕기기 새총', mode: 'pluckActive' },
    { id: 'drum', owner: '드럼', verb: '차다', strength: '큰북 차기 연타', mode: 'kickActive' },
    { id: 'violin', owner: '바이올린', verb: '켜다', strength: '활 켜기 비행선', mode: 'bowActive' }
  ];
  const launches = {};
  const specials = {};

  for (const profile of profiles) {
    const state = await page.evaluate((instrumentId) => {
      const all = ['piano', 'trumpet', 'guitar', 'drum', 'violin'];
      window.C16InstrumentDelivery.startWithOrder([instrumentId, ...all.filter((id) => id !== instrumentId)]);
      window.C16InstrumentDelivery.quickLaunch(.68, 42);
      const launch = window.C16InstrumentDelivery.getState();
      const labelBefore = document.querySelector('#actionLabel').textContent;
      window.C16InstrumentDelivery.useSpecial();
      const special = window.C16InstrumentDelivery.getState();
      const impactText = document.querySelector('#impactLabel').textContent;
      return { launch, special, labelBefore, impactText };
    }, profile.id);

    await expect(page.locator('#strengthOwner')).toContainText(profile.owner);
    await expect(page.locator('#strengthOwner')).toContainText(profile.verb);
    await expect(page.locator('#strengthName')).toContainText(profile.strength);
    expect(state.special.strengthName).toBe(profile.strength);
    expect(state.special.actionVerb).toBe(profile.verb);
    expect(state.labelBefore).toContain(profile.verb);
    expect(state.impactText).toContain(profile.verb);
    expect(state.special.projectileSpeed).toBeGreaterThan(state.launch.projectileSpeed);
    expect(Boolean(state.special[profile.mode])).toBe(true);
    expect(state.special.actionCount).toBeGreaterThanOrEqual(1);
    expect(state.special.actionPulse).toBeGreaterThan(0);
    launches[profile.id] = state.launch.projectileSpeed;
    specials[profile.id] = state.special.projectileSpeed;
  }

  expect(launches.trumpet).toBeGreaterThan(launches.piano);
  expect(launches.trumpet).toBeGreaterThan(launches.guitar);
  expect(Math.min(...Object.values(specials))).toBeGreaterThan(850);
  expect(errors).toEqual([]);
});

test('치다·불다·튕기다·차다·켜다가 서로 다른 움직임으로 이어진다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  const actions = await page.evaluate(() => {
    const ids = ['piano', 'trumpet', 'guitar', 'drum', 'violin'];
    return Object.fromEntries(ids.map((instrumentId) => {
      window.C16InstrumentDelivery.startWithOrder([instrumentId, ...ids.filter((id) => id !== instrumentId)]);
      window.C16InstrumentDelivery.quickLaunch(.68, 42);
      window.C16InstrumentDelivery.useSpecial();
      if (instrumentId === 'piano') window.C16InstrumentDelivery.triggerObstacle();
      return [instrumentId, window.C16InstrumentDelivery.getState()];
    }));
  });

  expect(actions.piano.actionVerb).toBe('치다');
  expect(actions.piano.currentDestroyed).toBeGreaterThanOrEqual(1);
  expect(actions.trumpet.actionVerb).toBe('불다');
  expect(actions.trumpet.blowActive).toBe(true);
  expect(actions.trumpet.projectileVx).toBeGreaterThan(1400);
  expect(actions.guitar.actionVerb).toBe('튕기다');
  expect(actions.guitar.pluckActive).toBe(true);
  expect(actions.guitar.guitarCombo).toBeGreaterThanOrEqual(3);
  expect(actions.drum.actionVerb).toBe('차다');
  expect(actions.drum.kickActive).toBe(true);
  expect(actions.drum.projectileVy).toBeLessThanOrEqual(-250);
  expect(actions.violin.actionVerb).toBe('켜다');
  expect(actions.violin.bowActive).toBe(true);
  expect(actions.violin.gravityMultiplier).toBeLessThan(.6);
  expect(errors).toEqual([]);
});

test('피아노는 연쇄 철거하고 기타는 충돌할수록 콤보가 오른다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  const piano = await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'guitar', 'drum', 'violin']);
    window.C16InstrumentDelivery.quickLaunch(.65, 40);
    window.C16InstrumentDelivery.useSpecial();
    window.C16InstrumentDelivery.triggerObstacle(3);
    return window.C16InstrumentDelivery.getState();
  });
  expect(piano.currentDestroyed).toBeGreaterThanOrEqual(3);
  expect(piano.pianoSmashActive).toBe(true);

  const guitar = await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['guitar', 'piano', 'trumpet', 'drum', 'violin']);
    window.C16InstrumentDelivery.quickLaunch(.65, 40);
    window.C16InstrumentDelivery.triggerObstacle();
    window.C16InstrumentDelivery.triggerObstacle();
    return window.C16InstrumentDelivery.getState();
  });
  expect(guitar.guitarCombo).toBeGreaterThanOrEqual(2);
  await expect(page.locator('#strengthName')).toContainText('× 2');
  expect(errors).toEqual([]);
});

test('가벼운·강력한·말도 안 되는 도움 효과가 실제 추진력을 단계별로 키운다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  const effects = await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'guitar', 'drum', 'violin']);
    window.C16InstrumentDelivery.quickLaunch(.65, 45);
    const before = window.C16InstrumentDelivery.getState();
    const lightUsed = window.C16InstrumentDelivery.triggerHelper('light');
    const light = window.C16InstrumentDelivery.getState();
    const strongUsed = window.C16InstrumentDelivery.triggerHelper('strong');
    const strong = window.C16InstrumentDelivery.getState();
    const absurdUsed = window.C16InstrumentDelivery.triggerHelper('absurd');
    const absurd = window.C16InstrumentDelivery.getState();
    return { before, lightUsed, light, strongUsed, strong, absurdUsed, absurd };
  });

  expect(effects.lightUsed).toBe(true);
  expect(effects.strongUsed).toBe(true);
  expect(effects.absurdUsed).toBe(true);
  expect(effects.light.projectileSpeed).toBeGreaterThan(effects.before.projectileSpeed);
  expect(effects.strong.projectileSpeed).toBeGreaterThan(effects.light.projectileSpeed);
  expect(effects.absurd.projectileSpeed).toBeGreaterThan(effects.strong.projectileSpeed);
  expect(effects.absurd.helperHits).toEqual({ light: 1, strong: 1, absurd: 1 });
  expect(effects.absurd.aftershockCharges).toBe(3);
  expect(effects.absurd.absurdActive).toBe(true);
  await expect(page.locator('#speechText')).toContainText('UFO');
  expect(errors).toEqual([]);
});

for (const view of [
  { name: '휴대폰 세로', width: 390, height: 844, mode: 'portrait', maxScale: .96, rightLimit: .685 },
  { name: '휴대폰 가로', width: 844, height: 390, mode: 'landscape', maxScale: .97, rightLimit: .765 },
  { name: '태블릿', width: 1024, height: 768, mode: 'tablet', maxScale: .975, rightLimit: .765 },
  { name: '데스크톱', width: 1440, height: 900, mode: 'desktop', maxScale: .98, rightLimit: .805 }
]) {
  test(`${view.name} 화면에서는 초고속 악기도 줌 아웃과 선행 카메라 안에 남는다`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: view.width, height: view.height });
    await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

    const state = await page.evaluate(() => {
      const game = window.C16InstrumentDelivery;
      game.startWithOrder(['trumpet', 'piano', 'guitar', 'drum', 'violin']);
      game.quickLaunch(.9, 40);
      game.useSpecial();
      game.triggerHelper('strong');
      game.triggerHelper('absurd');
      game.advanceFlight(.8);
      return game.getState();
    });

    expect(state.state).toBe('flying');
    expect(state.projectileSpeed).toBeGreaterThan(2000);
    expect(state.viewMode).toBe(view.mode);
    expect(state.viewScale).toBeLessThan(view.maxScale);
    expect(state.projectileScreenX).toBeGreaterThanOrEqual(0);
    expect(state.projectileScreenX).toBeLessThanOrEqual(state.viewportWidth * view.rightLimit);
    expect(errors).toEqual([]);
  });
}

test('보통 발사로 첫 응원 풍선에 자연스럽게 닿는다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'guitar', 'drum', 'violin']);
    window.C16InstrumentDelivery.quickLaunch(.65, 45);
  });

  await page.waitForFunction(() => window.C16InstrumentDelivery.getState().helperHits.light > 0);
  const state = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(state.helperHits.light).toBeGreaterThan(0);
  expect(state.score).toBeGreaterThanOrEqual(80);
  expect(errors).toEqual([]);
});

test('서로 다른 이름과 물리 규칙을 가진 다섯 스테이지가 차례로 이어진다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  const expectedNames = [
    '끝없는 주차장 탈출',
    '거품 폭풍 비눗방울 대로',
    '안전모 없는 로켓 공사장',
    '중력 분실 놀이공원',
    '은하계 외계인 공연장'
  ];
  const seen = [];

  await page.evaluate(() => window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'guitar', 'drum', 'violin']));
  for (let index = 0; index < expectedNames.length; index += 1) {
    const stage = await page.evaluate(() => window.C16InstrumentDelivery.getState());
    seen.push({
      index: stage.stageIndex,
      name: stage.stageName,
      total: stage.totalStages,
      physics: `${stage.stageGravity}/${stage.stageWind}/${stage.obstacleCount}`,
      helpers: [...new Set(stage.helpersRemaining)].sort(),
      goal: stage.goalDistance,
      worldEnd: stage.worldEnd,
      timeLimit: stage.timeLimit,
      surfaces: stage.surfacePattern.join(',')
    });
    if (index < expectedNames.length - 1) {
      await page.evaluate(() => {
        window.C16InstrumentDelivery.quickLaunch(.6, 40);
        window.C16InstrumentDelivery.finishFlight(55);
      });
      if (index === 1) await expect(page.locator('#actionButton')).toContainText('로켓 공사장으로 바로');
      await page.locator('#actionButton').click();
    }
  }

  expect(seen.map((stage) => stage.index)).toEqual([0, 1, 2, 3, 4]);
  expect(seen.map((stage) => stage.name)).toEqual(expectedNames);
  expect(seen.every((stage) => stage.total === 5)).toBe(true);
  expect(new Set(seen.map((stage) => stage.physics)).size).toBe(5);
  expect(seen.every((stage) => stage.helpers.join(',') === 'absurd,light,strong')).toBe(true);
  expect(seen.map((stage) => stage.goal)).toEqual([800, 950, 1100, 1300, 1550]);
  expect(seen.map((stage) => stage.timeLimit)).toEqual([19, 21, 22, 24, 26]);
  expect(seen.every((stage, index) => index === 0 || stage.worldEnd > seen[index - 1].worldEnd)).toBe(true);
  expect(new Set(seen.map((stage) => stage.surfaces)).size).toBe(5);
  await expect(page.locator('#stageName')).toHaveText('외계 공연장');
  expect(errors).toEqual([]);
});

test('모든 악기가 목표를 돌파한 뒤 무한 가속을 이어 가고 원할 때 기록을 확정한다', async ({ page }) => {
  const errors = collectErrors(page);
  const instruments = ['piano', 'trumpet', 'guitar', 'drum', 'violin'];
  const results = [];

  for (let shift = 0; shift < instruments.length; shift += 1) {
    const order = instruments.map((_, index) => instruments[(index + shift) % instruments.length]);
    await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate((ids) => window.C16InstrumentDelivery.startWithOrder(ids), order);

    for (let stageIndex = 0; stageIndex < 5; stageIndex += 1) {
      const state = await page.evaluate(() => {
        const game = window.C16InstrumentDelivery;
        game.quickLaunch(.65, 45);
        game.useSpecial();
        game.advanceFlight(18);
        return game.getState();
      });
      if (shift === 0 && stageIndex === 0) {
        await expect(page.locator('#targetDistanceValue')).toHaveText('∞');
        await expect(page.getByRole('button', { name: '이 기록으로 다음 스테이지 →' })).toBeVisible();
      }
      results.push({
        instrument: order[stageIndex],
        stageIndex,
        goal: state.goalDistance,
        state: state.state,
        distance: state.distance,
        reachedGoal: state.goalReached,
        endlessDistance: state.endlessDistance,
        endlessCombo: state.endlessCombo,
        checkpointIndex: state.checkpointIndex,
        helperCount: Object.values(state.helperHits).reduce((sum, count) => sum + count, 0)
      });
      await page.getByRole('button', { name: '이 기록으로 다음 스테이지 →' }).click();
      const result = await page.evaluate(() => window.C16InstrumentDelivery.getState().currentResult);
      expect(result.reachedGoal).toBe(true);
      expect(result.endlessDistance).toBeGreaterThan(0);
      if (stageIndex < 4) await page.locator('#actionButton').click();
    }
  }

  expect(results).toHaveLength(25);
  expect(results.every((result) => result.reachedGoal)).toBe(true);
  expect(results.every((result) => result.state === 'flying')).toBe(true);
  expect(results.every((result) => result.distance >= result.goal)).toBe(true);
  expect(results.every((result) => result.endlessDistance > 0)).toBe(true);
  expect(results.every((result) => result.endlessCombo > 0)).toBe(true);
  expect(results.every((result) => result.checkpointIndex === 3)).toBe(true);
  expect(results.every((result) => result.helperCount > 0)).toBe(true);
  expect(new Set(results.map((result) => result.instrument))).toEqual(new Set(instruments));
  expect(errors).toEqual([]);
});

test('약하게 던져 바로 떨어져도 특수 기술 입력 시간을 보장한다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'drum']);
    window.C16InstrumentDelivery.quickLaunch(.25, 68);
  });

  await page.waitForTimeout(2400);
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'flying');
  await expect(page.locator('#actionButton')).toContainText('피아노 건반을 세게 치다!');
  await page.locator('#actionButton').click();
  await expect(page.locator('#actionButton')).toContainText('건반을 또 치다');
  const state = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(state.specialAvailable).toBe(false);
  expect(state.aftershockCharges).toBeGreaterThanOrEqual(2);
  expect(state.aftershockCharges).toBeLessThanOrEqual(3);
  expect(errors).toEqual([]);
});

test('마우스를 오래 눌러 발사해도 특수 기술이 동시에 발동하지 않는다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '던지기 시작' }).click();

  const action = page.locator('#actionButton');
  await action.click({ delay: 700 });
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'flying');
  let state = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(state.specialAvailable).toBe(true);
  await expect(page.locator('#actionLabel')).toHaveText(state.specialLabel);

  await action.click();
  state = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(state.specialAvailable).toBe(false);
  await expect(action).toContainText(state.actionVerb);
  expect(errors).toEqual([]);
});

test('클릭 도중 초고속 골인해도 같은 클릭으로 다음 스테이지가 발사되지 않는다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  const state = await page.evaluate(() => {
    window.C16InstrumentDelivery.startWithOrder(['piano', 'trumpet', 'guitar', 'drum', 'violin']);
    window.C16InstrumentDelivery.quickLaunch(.7, 42);
    const button = document.querySelector('#actionButton');
    button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 19, pointerType: 'mouse' }));
    window.C16InstrumentDelivery.finishFlight(160);
    button.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 19, pointerType: 'mouse' }));
    button.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    return window.C16InstrumentDelivery.getState();
  });

  expect(state.state).toBe('transition');
  expect(state.stageIndex).toBe(0);
  await expect(page.locator('#relayToast')).toBeVisible();
  expect(errors).toEqual([]);
});

test('액션 버튼에 초점이 있어도 스페이스를 누르는 동안 힘이 모인다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '던지기 시작' }).click();

  const action = page.locator('#actionButton');
  await action.focus();
  await page.keyboard.down('Space');
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'charging');
  await page.waitForTimeout(700);
  const chargingState = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(chargingState.power).toBeGreaterThan(.55);
  await expect(page.locator('#powerLabel')).not.toHaveText('힘 25%');

  await page.keyboard.up('Space');
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'flying');
  const flyingState = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(flyingState.specialAvailable).toBe(true);
  expect(errors).toEqual([]);
});

test('정상 기록은 첫 로드에서 덮어쓰지 않고 그대로 복원한다', async ({ page }) => {
  const seededRecord = {
    schemaVersion: 1,
    bestScore: 4321,
    bestDistance: 127,
    plays: 6,
    lastRun: { score: 3210, maxDistance: 92, destroyed: 9, finishedAt: '2026-08-05T00:00:00.000Z' },
    activeRun: null,
    settings: { muted: true, reducedEffects: true }
  };
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, value);
  }, { key: STORAGE_KEY, value: JSON.stringify(seededRecord) });

  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#menuBestScore')).toHaveText('4321');
  await expect(page.locator('#menuBestDistance')).toHaveText('127');
  await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#effectsToggle')).toHaveAttribute('aria-pressed', 'true');

  const rawAfterInit = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(rawAfterInit).toBe(JSON.stringify(seededRecord));
});

test('중간에 닫아도 두 번째 악기부터 이어서 배달한다', async ({ page }) => {
  const activeRun = {
    order: ['piano', 'trumpet', 'drum'],
    roundIndex: 1,
    totalScore: 640,
    totalDestroyed: 2,
    maxDistance: 52,
    results: [{ instrumentId: 'piano', distance: 52, score: 640, destroyed: 2 }],
    startedAt: '2026-08-05T00:00:00.000Z'
  };
  const seededRecord = {
    schemaVersion: 1,
    bestScore: 1000,
    bestDistance: 70,
    plays: 1,
    lastRun: null,
    activeRun,
    settings: { muted: false, reducedEffects: false }
  };
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), {
    key: STORAGE_KEY,
    value: JSON.stringify(seededRecord)
  });

  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('button', { name: '배달 이어하기' })).toBeVisible();
  await page.getByRole('button', { name: '배달 이어하기' }).click();
  await expect(page.locator('#roundValue')).toHaveText('2');
  await expect(page.locator('#scoreValue')).toHaveText('640');
  const state = await page.evaluate(() => window.C16InstrumentDelivery.getState());
  expect(state.instrumentId).toBe('trumpet');
  await expect(page.locator('#relayStrip span')).toHaveCount(5);
});

for (const invalidValue of ['{broken-json', JSON.stringify({ schemaVersion: 99, futureData: 'keep-me' })]) {
  test(`읽을 수 없는 기록을 보존하고 확인 뒤 이 게임만 초기화한다: ${invalidValue.slice(0, 12)}`, async ({ page }) => {
    await page.addInitScript(({ key, value }) => {
      localStorage.setItem(key, value);
      localStorage.setItem('korean3b:unrelated-delivery-test', 'keep-me');
    }, { key: STORAGE_KEY, value: invalidValue });

    await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#saveStatus')).toContainText('보존 중');
    const rawBeforeReset = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(rawBeforeReset).toBe(invalidValue);

    await page.getByRole('button', { name: '기록 초기화' }).click();
    await expect(page.locator('#resetDialog')).toBeVisible();
    await page.getByRole('button', { name: '기록 지우기' }).click();
    await expect(page.locator('#resetDialog')).toBeHidden();

    const storageAfterReset = await page.evaluate((key) => ({
      game: JSON.parse(localStorage.getItem(key)),
      unrelated: localStorage.getItem('korean3b:unrelated-delivery-test')
    }), STORAGE_KEY);
    expect(storageAfterReset.game.schemaVersion).toBe(1);
    expect(storageAfterReset.game.bestScore).toBe(0);
    expect(storageAfterReset.unrelated).toBe('keep-me');
  });
}

test('저장 용량 오류가 나도 설정과 현재 게임은 계속된다', async ({ page }) => {
  await page.addInitScript((key) => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function patchedSetItem(storageKey, value) {
      if (storageKey === key) throw new DOMException('quota full', 'QuotaExceededError');
      return originalSetItem.call(this, storageKey, value);
    };
  }, STORAGE_KEY);

  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: '소리 끄기' }).click();
  await expect(page.locator('#saveStatus')).toContainText('저장 실패');
  await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '던지기 시작' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'aiming');
});
