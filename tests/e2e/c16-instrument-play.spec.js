const { test, expect } = require('@playwright/test');

const pagePath = '/c16/vocab-support-instrument-play.html';

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

test('C16 악기 연주는 선택·키보드 대체·동사 피드백을 제공한다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#instrumentCanvas')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.instrument-rail')).toHaveAttribute('role', 'group');
  await expect(page.locator('.instrument-btn')).toHaveCount(5);
  await expect(page.locator('[data-action="play-current"]')).toHaveCount(1);
  await expect(page.locator('body')).toHaveAttribute('data-instrument', 'piano');
  await expect(page.locator('.instrument-btn[data-instrument="piano"]')).toHaveAttribute('aria-pressed', 'true');

  const instrumentVerbs = [
    ['piano', '치다'],
    ['violin', '켜다'],
    ['trumpet', '불다'],
    ['guitar', '튕기다'],
    ['drums', '치다']
  ];

  for (const [instrument, verb] of instrumentVerbs) {
    await page.locator(`.instrument-btn[data-instrument="${instrument}"]`).click();
    await expect(page.locator('body')).toHaveAttribute('data-instrument', instrument);
    await expect(page.locator(`.instrument-btn[data-instrument="${instrument}"]`)).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-action="play-current"]').click();
    await expect(page.locator('[data-feedback]')).toContainText(verb);
  }

  const pianoButton = page.locator('.instrument-btn[data-instrument="piano"]');
  await pianoButton.focus();
  await pianoButton.press('Enter');
  await expect(page.locator('body')).toHaveAttribute('data-instrument', 'piano');
  const playButton = page.locator('[data-action="play-current"]');
  await playButton.focus();
  await playButton.press('Enter');
  await expect(page.locator('[data-feedback]')).toContainText('치다');

  const canvasBox = await page.locator('#instrumentCanvas').boundingBox();
  expect(canvasBox).not.toBeNull();
  await page.mouse.click(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height * 0.55);
  await expect(page.locator('[data-feedback]')).toContainText('치다');
  expect(failures).toEqual([]);
});

test('C16 악기 연주는 소리·마이크 폴백·초기화 상태를 유지한다', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
  });
  const failures = watchLocalFailures(page);
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

  const sound = page.locator('#soundBtn');
  await expect(sound).toHaveAttribute('aria-pressed', 'true');
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
  await sound.click();
  await expect(sound).toHaveAttribute('aria-pressed', 'true');

  await page.locator('.instrument-btn[data-instrument="trumpet"]').click();
  await expect(page.locator('#micBtn')).toBeVisible();
  await page.locator('#micBtn').click();
  await expect(page.locator('#toast')).toContainText('길게 터치해서 불어요');

  await page.locator('.instrument-btn[data-instrument="guitar"]').click();
  await page.locator('[data-action="play-current"]').click();
  await expect(page.locator('[data-feedback]')).toContainText('튕기다');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-instrument', 'piano');
  await expect(page.locator('.instrument-btn[data-instrument="piano"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-feedback]')).toHaveText('');
  expect(failures).toEqual([]);
});

test('C16 기타는 줄을 당겨 놓으면 튕기다, 줄 밖에서 긁으면 치다를 표시한다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.locator('.instrument-btn[data-instrument="guitar"]').click();
  await page.waitForTimeout(100);

  const canvasBox = await page.locator('#instrumentCanvas').boundingBox();
  expect(canvasBox).not.toBeNull();

  const stringX = canvasBox.x + canvasBox.width * 0.55;
  const stringY = canvasBox.y + canvasBox.height * 0.55;
  await page.mouse.move(stringX, stringY);
  await page.mouse.down();
  await page.mouse.move(stringX, stringY + canvasBox.height * 0.07, { steps: 4 });
  await page.mouse.up();
  await expect(page.locator('[data-feedback]')).toContainText('튕기다');

  await page.mouse.move(canvasBox.x + canvasBox.width * 0.2, canvasBox.y + canvasBox.height * 0.46);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width * 0.58, canvasBox.y + canvasBox.height * 0.64, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator('[data-feedback]')).toContainText('치다');
  expect(failures).toEqual([]);
});

test('C16 기타의 고무줄과 스프링은 당겼다가 놓아 튕길 수 있다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.locator('.instrument-btn[data-instrument="guitar"]').click();
  await page.waitForTimeout(100);

  const canvasBox = await page.locator('#instrumentCanvas').boundingBox();
  expect(canvasBox).not.toBeNull();
  const r = Math.max(26, Math.min(44, Math.min(canvasBox.width, canvasBox.height) * 0.065));
  const keepTop = Math.max(r + 22, canvasBox.height * 0.14);
  const keepBottom = Math.min(canvasBox.height - r - 26, canvasBox.height * 0.82);
  const rubberband = {
    x: canvasBox.x + r + 24 + r * 1.8,
    y: canvasBox.y + keepBottom - r * 0.7
  };
  const spring = {
    x: canvasBox.x + canvasBox.width - r - 24 - r * 1.7,
    y: canvasBox.y + keepTop + r * 0.65
  };

  await page.mouse.move(rubberband.x, rubberband.y);
  await page.mouse.down();
  await page.mouse.move(rubberband.x + r * 1.8, rubberband.y - r * 1.1, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('[data-feedback]')).toContainText('튕기다');

  await page.mouse.move(spring.x, spring.y);
  await page.mouse.down();
  await page.mouse.move(spring.x - r * 1.45, spring.y + r * 1.35, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('[data-feedback]')).toContainText('튕기다');
  expect(failures).toEqual([]);
});

test('C16 바이올린은 활을 줄 위로 드래그해 켜다를 표시한다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.locator('.instrument-btn[data-instrument="violin"]').click();
  await page.waitForTimeout(100);

  const canvasBox = await page.locator('#instrumentCanvas').boundingBox();
  expect(canvasBox).not.toBeNull();
  const bowLength = Math.max(150, Math.min(270, Math.min(canvasBox.width, canvasBox.height) * 0.38));
  const bowHome = {
    x: Math.max(bowLength * 0.55 + 16, Math.min(canvasBox.width - bowLength * 0.55 - 16, canvasBox.width * 0.84)),
    y: Math.max(86, Math.min(canvasBox.height - 120, canvasBox.height * 0.48))
  };
  await page.mouse.move(canvasBox.x + bowHome.x, canvasBox.y + bowHome.y);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height * 0.59, { steps: 8 });
  await expect(page.locator('[data-feedback]')).toContainText('켜다');
  await page.mouse.up();
  expect(failures).toEqual([]);
});

test('C16 드럼은 한 번 치기와 드래그 연주, 좌하단 박수를 제공한다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.locator('.instrument-btn[data-instrument="drums"]').click();
  await page.waitForTimeout(100);

  const canvasBox = await page.locator('#instrumentCanvas').boundingBox();
  expect(canvasBox).not.toBeNull();
  const r = Math.max(44, Math.min(92, 72 * Math.min(canvasBox.width / 900, canvasBox.height / 560)));
  const centerX = canvasBox.x + canvasBox.width / 2;
  const centerY = canvasBox.y + canvasBox.height * 0.56;
  const snare = { x: centerX - r * 1.45, y: centerY };
  const tom = { x: centerX + r * 1.35, y: centerY - r * 0.08 };
  const kick = { x: centerX, y: centerY + r * 1.25 };

  await page.mouse.click(snare.x, snare.y);
  await expect(page.locator('[data-feedback]')).toContainText('치다');

  await page.mouse.move(snare.x, snare.y);
  await page.mouse.down();
  await page.mouse.move(tom.x, tom.y, { steps: 6 });
  await page.mouse.move(kick.x, kick.y, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator('[data-feedback]')).toContainText('치다');

  const funR = Math.max(26, Math.min(44, Math.min(canvasBox.width, canvasBox.height) * 0.065));
  const clap = {
    x: canvasBox.x + funR + 24 + funR * 1.55,
    y: canvasBox.y + Math.min(canvasBox.height - funR - 26, canvasBox.height * 0.82) - funR * 0.7
  };
  await page.mouse.click(clap.x, clap.y);
  await expect(page.locator('[data-feedback]')).toContainText('치다');
  expect(failures).toEqual([]);
});

test('C16 악기 연주는 모바일과 확대 화면에서 첫 행동을 가리지 않는다', async ({ page }) => {
  const failures = watchLocalFailures(page);
  const viewports = [
    { width: 320, height: 844 },
    { width: 390, height: 844 },
    { width: 720, height: 450 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
    const audit = await page.evaluate(() => {
      const canvas = document.querySelector('#instrumentCanvas').getBoundingClientRect();
      const play = document.querySelector('[data-action="play-current"]').getBoundingClientRect();
      return {
        overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        canvasVisible: canvas.top >= 0 && canvas.bottom > canvas.top,
        playVisible: play.top >= 0 && play.bottom <= window.innerHeight + 1
          && play.left >= 0 && play.right <= window.innerWidth + 1
      };
    });
    expect(audit.overflows).toBe(false);
    expect(audit.canvasVisible).toBe(true);
    expect(audit.playVisible).toBe(true);
  }
  expect(failures).toEqual([]);
});
