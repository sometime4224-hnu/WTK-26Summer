const { test, expect } = require('@playwright/test');

const fixturePath = '/tests/fixtures/c16-country-map-engine.html';
const storageKey = 'korean3bimprove:test:c16-country-map-engine';

async function openCleanFixture(page) {
  await page.goto(fixturePath, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test.describe('C16 country map common engine', () => {
  test('renders the grammar sentence, filters pins, and exposes exact search links', async ({ page }) => {
    await openCleanFixture(page);

    await expect(page.locator('#sentenceText')).toHaveText('서울은 경복궁으로 유명해요.');
    await expect(page.locator('[data-region="north"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.pin:visible')).toHaveCount(2);
    await expect(page.locator('.pin[hidden]')).toHaveCount(1);
    await expect(page.locator('#pinCount')).toHaveText('2 / 3');

    await page.locator('[data-tag="river"]').click();
    await expect(page.locator('#sentenceText')).toHaveText('서울은 한강으로 유명해요.');
    await expect(page.locator('[data-tag="river"]')).toHaveAttribute('aria-pressed', 'true');

    const mapHref = await page.locator('#mapAction').getAttribute('href');
    const imageHref = await page.locator('#photoAction').getAttribute('href');
    expect(new URL(mapHref).searchParams.get('query')).toBe('Han River Seoul');
    expect(new URL(imageHref).searchParams.get('q')).toBe('Han River Seoul');

    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
    expect(stored.schemaVersion).toBe(1);
    expect(stored.state).toEqual({
      region: 'north',
      targetId: 'seoul',
      tagId: 'river',
      zoomIndex: 0
    });
  });

  test('renders an optional display position without changing the real map coordinate', async ({ page }) => {
    await openCleanFixture(page);

    const pin = page.locator('.pin[data-target="seoul"]');
    const label = page.locator('.pin[data-target="seoul"] + .pin-label');
    const anchor = page.locator('.pin-anchor[data-anchor-target="seoul"]');
    const leader = page.locator('.pin-leader[data-leader-target="seoul"]');

    await expect(pin).toHaveCount(1);
    await expect(anchor).toHaveCount(1);
    await expect(leader).toHaveCount(1);
    await expect(label).toHaveAttribute('data-label-placement', 'top');

    const positions = await page.evaluate(() => {
      const button = document.querySelector('.pin[data-target="seoul"]');
      const anchorDot = document.querySelector('.pin-anchor[data-anchor-target="seoul"]');
      const line = document.querySelector(
        '.pin-leader[data-leader-target="seoul"] line'
      );
      return {
        displayX: button.style.getPropertyValue('--x'),
        displayY: button.style.getPropertyValue('--y'),
        anchorX: anchorDot.style.getPropertyValue('--anchor-x'),
        anchorY: anchorDot.style.getPropertyValue('--anchor-y'),
        lineX1: line.getAttribute('x1'),
        lineY1: line.getAttribute('y1'),
        lineX2: line.getAttribute('x2'),
        lineY2: line.getAttribute('y2')
      };
    });

    expect(positions).toMatchObject({
      displayX: '58%',
      displayY: '62%',
      anchorX: '32%',
      anchorY: '32%'
    });
    expect(parseFloat(positions.lineX1)).toBeCloseTo(32, 3);
    expect(parseFloat(positions.lineY1)).toBeCloseTo(32, 3);
    expect(parseFloat(positions.lineX2)).toBeCloseTo(58, 3);
    expect(parseFloat(positions.lineY2)).toBeCloseTo(62, 3);

    await page.locator('#zoomInBtn').click();
    const zoom = await page.evaluate(() => {
      const target = window.C16_COUNTRY_MAP_DATA?.targets?.find(
        (item) => item.id === 'seoul'
      ) || {
        x: 32,
        y: 32,
        displayX: 58,
        displayY: 62
      };
      const rect = document.querySelector('#mapCanvas').getBoundingClientRect();
      const matrix = new DOMMatrixReadOnly(
        getComputedStyle(document.querySelector('#mapLayer')).transform
      );
      const scale = 1.5;
      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
      const panFor = (x, y) => ({
        x: clamp(
          (rect.width / 2) - ((rect.width * x / 100) * scale),
          rect.width * (1 - scale),
          0
        ),
        y: clamp(
          (rect.height / 2) - ((rect.height * y / 100) * scale),
          rect.height * (1 - scale),
          0
        )
      });
      return {
        actual: { x: matrix.e, y: matrix.f },
        real: panFor(target.x, target.y),
        display: panFor(target.displayX, target.displayY),
        nearIds: [...document.querySelectorAll('[data-near]')].map(
          (button) => button.dataset.near
        )
      };
    });

    expect(zoom.actual.x).toBeCloseTo(zoom.real.x, 0);
    expect(zoom.actual.y).toBeCloseTo(zoom.real.y, 0);
    expect(
      Math.hypot(
        zoom.actual.x - zoom.display.x,
        zoom.actual.y - zoom.display.y
      )
    ).toBeGreaterThan(20);
    expect(zoom.nearIds).toEqual(['chuncheon']);
  });

  test('restores saved work without overwriting it during initialization', async ({ page }) => {
    await openCleanFixture(page);
    await page.locator('[data-target="chuncheon"]').click();
    await page.locator('#zoomInBtn').click();

    const beforeReload = await page.evaluate((key) => localStorage.getItem(key), storageKey);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const afterReload = await page.evaluate((key) => localStorage.getItem(key), storageKey);

    expect(afterReload).toBe(beforeReload);
    await expect(page.locator('#sentenceText')).toHaveText('춘천은 소양호로 유명해요.');
    await expect(page.locator('#zoomLevel')).toHaveText('150%');
    await expect(page.locator('#saveStatus')).toHaveText('이어서 시작했어요');
  });

  test('preserves focus when a keyboard selection rerenders its controls', async ({ page }) => {
    await openCleanFixture(page);
    const riverButton = page.locator('[data-tag="river"]');

    await riverButton.focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('[data-tag="river"]')).toBeFocused();
    await expect(page.locator('[data-tag="river"]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('protects unknown-version records until a confirmed page-scoped reset', async ({ page }) => {
    await openCleanFixture(page);
    const protectedRaw = JSON.stringify({
      schemaVersion: 99,
      state: {
        region: 'south',
        targetId: 'busan',
        tagId: 'beach',
        zoomIndex: 0
      }
    });
    await page.evaluate(({ key, raw }) => {
      localStorage.setItem(key, raw);
      localStorage.setItem('unrelated-key', 'keep-me');
    }, { key: storageKey, raw: protectedRaw });
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('#sentenceText')).toHaveText('서울은 경복궁으로 유명해요.');
    await expect(page.locator('#saveStatus')).toContainText('다른 버전');
    await page.locator('[data-tag="river"]').click();
    expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(protectedRaw);

    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('#resetActivityBtn').click();

    expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
    expect(await page.evaluate(() => localStorage.getItem('unrelated-key'))).toBe('keep-me');
    await expect(page.locator('#sentenceText')).toHaveText('서울은 경복궁으로 유명해요.');
  });

  test('leaves a corrupt record untouched and offers recovery', async ({ page }) => {
    await openCleanFixture(page);
    const corruptRaw = '{"schemaVersion":1,"state":';
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: storageKey,
      raw: corruptRaw
    });
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('#sentenceText')).toHaveText('서울은 경복궁으로 유명해요.');
    await expect(page.locator('#saveStatus')).toContainText('읽을 수 없어요');
    await page.locator('[data-tag="river"]').click();

    expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(corruptRaw);
  });

  test('keeps the in-memory selection and reports a failed write', async ({ page }) => {
    await openCleanFixture(page);
    await page.evaluate(() => {
      Storage.prototype.setItem = function blockedWrite() {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      };
    });

    await page.locator('[data-tag="river"]').click();

    await expect(page.locator('#sentenceText')).toHaveText('서울은 한강으로 유명해요.');
    await expect(page.locator('#saveStatus')).toHaveText('선택을 저장하지 못했어요');
    expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
  });

  test('remains usable when browser storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      const blocked = function blockedStorage() {
        throw new DOMException('Storage blocked', 'SecurityError');
      };
      Storage.prototype.getItem = blocked;
      Storage.prototype.setItem = blocked;
      Storage.prototype.removeItem = blocked;
    });
    await page.goto(fixturePath, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#sentenceText')).toHaveText('서울은 경복궁으로 유명해요.');
    await expect(page.locator('#saveStatus')).toContainText('저장할 수 없어요');
    await page.locator('[data-tag="river"]').click();
    await expect(page.locator('#sentenceText')).toHaveText('서울은 한강으로 유명해요.');
    await expect(page.locator('#saveStatus')).toHaveText('선택을 저장하지 못했어요');
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 844 }
  ]) {
    test(`keeps the target and first action usable at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openCleanFixture(page);

      const metrics = await page.evaluate(() => {
        const sentence = document.querySelector('#sentenceText').getBoundingClientRect();
        const firstAction = document.querySelector('[data-region]').getBoundingClientRect();
        return {
          sentenceTop: sentence.top,
          firstActionBottom: firstAction.bottom,
          viewportHeight: window.innerHeight,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });

      expect(metrics.sentenceTop).toBeLessThan(280);
      expect(metrics.firstActionBottom).toBeLessThanOrEqual(metrics.viewportHeight);
      expect(metrics.overflow).toBeLessThanOrEqual(1);
    });
  }
});
