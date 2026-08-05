const { test, expect } = require('@playwright/test');

const GAME_URL = '/c16/chaos-orchestra/index.html';
const STORAGE_KEY = 'korean3b:c16:chaos-orchestra';

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().includes('/c16/chaos-orchestra/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  return errors;
}

async function startGame(page) {
  await page.getByRole('button', { name: '무대 난입' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'running', { timeout: 5_000 });
}

test('c16 허브에서 카오스 오케스트라로 진입할 수 있다', async ({ page }) => {
  await page.goto('/c16/index.html', { waitUntil: 'domcontentloaded' });
  const gameLink = page.locator('a[href="chaos-orchestra/index.html"]');
  await expect(gameLink).toHaveCount(1);
  await expect(gameLink).toContainText('악기 네 레인');
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
    await expect(page.getByRole('button', { name: '무대 난입' })).toBeVisible();
  });
}

test('카운트다운, 키보드·터치, 일시정지, 결과와 재시작 흐름이 이어진다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveTitle('C16 카오스 오케스트라');
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.getByRole('button', { name: '게임 일시정지' })).toBeHidden();
  await startGame(page);

  const mobilePlayingLayout = await page.evaluate(() => {
    const mood = document.querySelector('.mood').getBoundingClientRect();
    const track = document.querySelector('.track-ribbon').getBoundingClientRect();
    const controls = document.querySelector('.touch-controls').getBoundingClientRect();
    return { moodBottom: mood.bottom, trackTop: track.top, controlsBottom: controls.bottom, viewportHeight: innerHeight };
  });
  expect(mobilePlayingLayout.moodBottom).toBeLessThanOrEqual(mobilePlayingLayout.trackTop);
  expect(mobilePlayingLayout.controlsBottom).toBeLessThanOrEqual(mobilePlayingLayout.viewportHeight);

  await expect(page.locator('.lane-button')).toHaveCount(4);
  await expect(page.locator('.lane-button').first()).toBeVisible();
  await page.keyboard.press('d');
  await page.locator('.lane-button').nth(1).click();

  await page.keyboard.press('p');
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'paused');
  const pausedTime = await page.locator('#timeValue').innerText();
  await page.waitForTimeout(220);
  await expect(page.locator('#timeValue')).toHaveText(pausedTime);
  await page.getByRole('button', { name: '다시 연주' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'running');

  await page.evaluate(() => window.C16ChaosOrchestra.finishNow());
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'result');
  await expect(page.locator('#resultTitle')).toContainText('데뷔');
  await expect(page.getByRole('button', { name: '한 판 더' })).toBeVisible();

  const savedAfterFinish = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(savedAfterFinish.schemaVersion).toBe(1);
  expect(savedAfterFinish.plays).toBe(1);

  await page.reload({ waitUntil: 'domcontentloaded' });
  const savedAfterReload = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(savedAfterReload.plays).toBe(1);
  expect(errors).toEqual([]);
});

test('키보드 탐색에서 시작 버튼의 초점이 선명하게 보인다', async ({ page }) => {
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('#songSelect')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#startGame')).toBeFocused();
  const focusStyle = await page.locator('#startGame').evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
  });
  expect(focusStyle.outlineStyle).toBe('solid');
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(3);
});

test('퍼블릭 도메인 클래식 6곡을 고르고 선택한 곡을 기억한다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  const songs = [
    { id: 'ode-to-joy', title: '환희의 송가', composer: 'L. v. 베토벤', bpm: 100, sourceId: '528' },
    { id: 'fur-elise', title: '엘리제를 위하여', composer: 'L. v. 베토벤', bpm: 92, sourceId: '931' },
    { id: 'eine-kleine', title: '아이네 클라이네 나흐트무지크', composer: 'W. A. 모차르트', bpm: 132, sourceId: '900' },
    { id: 'turkish-march', title: '터키 행진곡', composer: 'W. A. 모차르트', bpm: 116, sourceId: '108' },
    { id: 'bach-prelude', title: '프렐류드 C장조', composer: 'J. S. 바흐', bpm: 90, sourceId: '2206' },
    { id: 'symphony-five', title: '운명 교향곡', composer: 'L. v. 베토벤', bpm: 108, sourceId: '941' }
  ];

  await expect(page.locator('#songSelect option')).toHaveCount(6);
  expect((await page.evaluate(() => window.C16ChaosOrchestra.getState())).librarySize).toBe(6);

  for (const song of songs) {
    await page.locator('#songSelect').selectOption(song.id);
    await expect(page.locator('#menuSongTitle')).toContainText(song.title);
    await expect(page.locator('#trackTitle')).toContainText(song.title);
    await expect(page.locator('#scoreSource')).toHaveAttribute('href', new RegExp(`id=${song.sourceId}$`));

    const state = await page.evaluate(() => window.C16ChaosOrchestra.getState());
    expect(state.song.id).toBe(song.id);
    expect(state.song.title).toBe(song.title);
    expect(state.song.composer).toBe(song.composer);
    expect(state.song.bpm).toBe(song.bpm);
    expect(state.song.chartSteps).toBeGreaterThan(150);
    expect(state.song.chartNotes).toBeGreaterThan(20);
  }

  await page.locator('#songSelect').selectOption('turkish-march');
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  expect(saved.settings.selectedSong).toBe('turkish-march');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#songSelect')).toHaveValue('turkish-march');
  await expect(page.locator('#menuSongTitle')).toContainText('터키 행진곡');
  expect(errors).toEqual([]);
});

test('네 악기 연주자가 입력에 반응하고 연주동사 활자를 보여 준다', async ({ page }) => {
  const errors = collectErrors(page);
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });

  const expectedBand = [
    { instrument: '기타', verb: '튕기다!', input: () => page.keyboard.press('d') },
    { instrument: '피아노', verb: '누르다!', input: () => page.locator('.lane-button').nth(1).click() },
    { instrument: '바이올린', verb: '켜다!', input: () => page.keyboard.press('j') },
    { instrument: '드럼', verb: '치다!', input: () => page.locator('.lane-button').nth(3).click() }
  ];

  await expect(page.locator('[data-performer-lane]')).toHaveCount(4);
  await expect(page.locator('.lane-preview span')).toContainText(['기타', '피아노', '바이올린', '드럼']);
  await expect(page.locator('.track-ribbon')).toContainText('베토벤 · 환희의 송가');
  await expect(page.locator('.track-credit')).toContainText('PD 악보');
  await startGame(page);

  for (let lane = 0; lane < expectedBand.length; lane += 1) {
    const performer = page.locator(`[data-performer-lane="${lane}"]`);
    await expect(performer).toHaveAttribute('data-instrument', expectedBand[lane].instrument);
    await expectedBand[lane].input();
    await expect(performer).toHaveClass(/is-playing/);
    await expect(performer.locator('.performer__verb')).toHaveText(expectedBand[lane].verb);
  }

  const rhythmState = await page.evaluate(() => window.C16ChaosOrchestra.getState());
  expect(rhythmState.song.title).toBe('환희의 송가');
  expect(rhythmState.song.composer).toBe('L. v. 베토벤');
  expect(rhythmState.song.bpm).toBe(100);
  expect(rhythmState.song.chartSteps).toBe(192);
  expect(rhythmState.song.arrangementSteps).toBe(192);
  expect(rhythmState.song.chartNotes).toBe(92);
  expect(rhythmState.song.step).toBeGreaterThan(0);
  expect(await page.locator('#trackProgress').evaluate((element) => element.value)).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test('정상 기록은 첫 로드에서 덮어쓰지 않고 그대로 복원한다', async ({ page }) => {
  const seededRecord = {
    schemaVersion: 1,
    bestScore: 4321,
    bestCombo: 27,
    plays: 6,
    lastResult: { score: 3210, combo: 19, perfect: 12, playedAt: '2026-08-05T00:00:00.000Z' },
    settings: { muted: true, reducedEffects: true }
  };
  await page.addInitScript(({ key, value }) => {
    localStorage.setItem(key, value);
  }, { key: STORAGE_KEY, value: JSON.stringify(seededRecord) });

  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#menuBestScore')).toHaveText('4,321');
  await expect(page.locator('#menuBestCombo')).toHaveText('27');
  await expect(page.locator('#soundToggle')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#effectsToggle')).toHaveAttribute('aria-pressed', 'true');

  const rawAfterInit = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(rawAfterInit).toBe(JSON.stringify(seededRecord));
});

test('손상된 기록은 보존하고 이 게임의 기록만 확인 후 초기화한다', async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.setItem(key, '{broken-json');
    localStorage.setItem('korean3b:unrelated-test-record', 'keep-me');
  }, { key: STORAGE_KEY });

  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#saveStatus')).toContainText('기존 기록을 읽지 못함');
  const rawBeforeReset = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(rawBeforeReset).toBe('{broken-json');

  await page.getByRole('button', { name: '기록 초기화' }).click();
  await expect(page.locator('#resetDialog')).toBeVisible();
  await page.getByRole('button', { name: '기록 지우기' }).click();
  await expect(page.locator('#resetDialog')).toBeHidden();

  const storageAfterReset = await page.evaluate((key) => ({
    game: localStorage.getItem(key),
    unrelated: localStorage.getItem('korean3b:unrelated-test-record')
  }), STORAGE_KEY);
  expect(storageAfterReset.game).toBeNull();
  expect(storageAfterReset.unrelated).toBe('keep-me');
  await expect(page.locator('#menuBestScore')).toHaveText('0');
});

test('저장 용량 오류가 나도 현재 게임과 설정 조작은 계속된다', async ({ page }) => {
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
  await page.getByRole('button', { name: '무대 난입' }).click();
  await expect(page.locator('#gameRoot')).toHaveAttribute('data-game-state', 'running', { timeout: 5_000 });
});
