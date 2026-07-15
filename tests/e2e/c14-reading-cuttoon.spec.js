const { test, expect } = require('@playwright/test');

const PAGE_PATH = '/c14/reading-cuttoon.html';
const LOCAL_ORIGIN = 'http://127.0.0.1:4173';
const STORAGE_KEY = 'reading_cuttoon_c14_modern_v1';

const SENTENCES = [
  '옛날에 어떤 나무꾼이 나무를 하러 산에 갔다가 동굴을 발견했다.',
  '그 동굴은 입구는 작고 어두웠지만 들어가면 들어갈수록 점점 넓어지고 밝아졌다.',
  '그리고 동굴 안에서 수염이 긴 노인들이 바둑을 두고 있었다.',
  '나무꾼은 바둑이 하도 재미있어서 시간 가는 줄 모르고 구경을 했다.',
  '얼마 후 나무꾼은 집에 돌아가려고 도끼를 들다가 깜짝 놀랐다.',
  '그는 이상해하면서 자루가 없는 도끼를 들고 산을 내려왔다.',
  '마을에 도착해 보니 집들이 완전히 변해 있었고 아는 사람도 전혀 없었다.',
  '나무꾼의 집도 낡은 집이 되었고, 며칠 전에 심었던 나무가 크게 자라서 지붕을 덮고 있었다.',
  '나무꾼은 지나가는 사람에게 자기 이름을 말하면서 그 사람을 아느냐고 물어보았다.',
  '그 사람은 “그분은 제 아버지의 할아버지신데 나무하러 산에 갔다가 못 돌아오셨다고 들었습니다.” 하고 대답했다.',
  '나무꾼이 봤던 노인들은 신선들이었다.',
  '신선들의 바둑을 잠깐 구경하는 동안에 100년의 시간이 지난 것이다.'
];

const FALLBACKS = [
  '깊은 산 동굴 앞에 선 나무꾼',
  '작은 동굴 안쪽이 넓고 밝아지는 장면',
  '동굴 안에서 수염이 긴 노인들이 바둑을 두는 장면',
  '바둑이 재미있어서 시간 가는 줄 모르고 구경하는 나무꾼',
  '집에 돌아가려다 도끼를 보고 놀라는 나무꾼',
  '자루가 없는 도끼를 들고 산을 내려오는 나무꾼',
  '완전히 달라진 마을에 도착한 나무꾼',
  '낡은 집과 지붕을 덮은 큰 나무를 보는 나무꾼',
  '지나가는 사람에게 자기를 아느냐고 묻는 나무꾼',
  '지나가던 사람이 나무꾼에게 할아버지의 할아버지 이야기를 하는 장면',
  '나무꾼이 봤던 노인들이 신선들이었다는 장면',
  '신선들의 바둑을 구경하는 동안 100년이 지난 장면'
];

const CUT_IDS = SENTENCES.map((_, index) => `cut${String(index + 1).padStart(2, '0')}`);

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function watchPageProblems(page) {
  const remoteRequests = [];
  const webpRequests = [];
  const consoleErrors = [];
  const pageErrors = [];

  page.on('request', (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.origin !== LOCAL_ORIGIN) {
      remoteRequests.push(request.url());
    }
    if (/\.webp(?:$|[?#])/i.test(url.pathname)) {
      webpRequests.push(request.url());
    }
  });
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  return { remoteRequests, webpRequests, consoleErrors, pageErrors };
}

async function blockExternalRequests(page) {
  await page.route(/^https?:\/\//, (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== LOCAL_ORIGIN) return route.abort();
    return route.continue();
  });
}

async function openFresh(page) {
  await page.goto(PAGE_PATH, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload({ waitUntil: 'load' });
  await expect(page.locator('body')).toHaveAttribute('data-page', 'c14-reading-cuttoon');
}

async function expectCurrentCut(page, oneBasedIndex) {
  const cutId = CUT_IDS[oneBasedIndex - 1];
  const sentence = SENTENCES[oneBasedIndex - 1];
  const fallback = FALLBACKS[oneBasedIndex - 1];
  const sentenceChoice = page.locator('[data-sentence-choice][data-sentence-id]').nth(oneBasedIndex - 1);
  const sentenceId = await sentenceChoice.getAttribute('data-sentence-id');
  const expectedVisual = await page.evaluate((id) => {
    const cut = window.C14_READING_CUTTOON_DATA.cuts.find((item) => item.id === id);
    return cut && cut.visual ? {
      assetRef: cut.visual.assetRef,
      visualState: cut.visual.visualState
    } : null;
  }, cutId);

  expect(sentenceId).toBeTruthy();
  expect(expectedVisual).toBeTruthy();
  expect(expectedVisual.assetRef).toBeTruthy();
  await expect(page.locator('#scene-visual')).toHaveAttribute('data-cut-id', cutId);
  await expect(page.locator('#scene-visual')).toHaveAttribute('data-asset-ref', expectedVisual.assetRef);
  await expect(page.locator('#scene-visual')).toHaveAttribute('data-visual-state', cutId);
  await expect(page.locator('#scene-visual')).toHaveAttribute('data-image-status', /\S+/);
  await expect(page.locator('#current-sentence')).toHaveText(sentence);
  await expect(page.locator('#cut-progress')).toHaveText(`${oneBasedIndex}번 컷`);
  await expect(page.locator('#scene-fallback')).toHaveText(fallback);

  await expect.poll(async () => page.locator('[data-cut-choice][data-cut-id]').evaluateAll((elements) => {
    const selected = (element) => {
      const ariaCurrent = element.getAttribute('aria-current');
      return element.getAttribute('aria-pressed') === 'true'
        || element.getAttribute('aria-selected') === 'true'
        || Boolean(ariaCurrent && ariaCurrent !== 'false')
        || element.getAttribute('data-active') === 'true'
        || element.classList.contains('is-active');
    };
    return elements.filter(selected).map((element) => element.getAttribute('data-cut-id'));
  })).toEqual([cutId]);

  await expect.poll(async () => page.locator('[data-sentence-choice][data-sentence-id]').evaluateAll((elements) => {
    const selected = (element) => {
      const ariaCurrent = element.getAttribute('aria-current');
      return element.getAttribute('aria-pressed') === 'true'
        || element.getAttribute('aria-selected') === 'true'
        || Boolean(ariaCurrent && ariaCurrent !== 'false')
        || element.getAttribute('data-active') === 'true'
        || element.classList.contains('is-active');
    };
    return elements.filter(selected).map((element) => element.getAttribute('data-sentence-id'));
  })).toEqual([sentenceId]);
}

function backgroundUrl(backgroundImage) {
  const match = /url\(["']?(.*?)["']?\)/.exec(backgroundImage || '');
  return match ? new URL(match[1], LOCAL_ORIGIN).href : null;
}

async function captureSpriteScene(page) {
  return page.locator('#scene-visual').evaluate((root) => {
    const surface = root.querySelector('.scene-image-surface');
    const fallback = root.querySelector('.scene-code-fallback');
    const surfaceStyle = getComputedStyle(surface);
    const fallbackStyle = getComputedStyle(fallback);
    const surfaceBox = surface.getBoundingClientRect();
    const fallbackBox = fallback.getBoundingClientRect();
    const visible = (element, style, box) => !element.hidden
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number.parseFloat(style.opacity || '1') > 0.01
      && box.width > 0
      && box.height > 0;

    return {
      tagName: root.tagName,
      role: root.getAttribute('role'),
      cutId: root.getAttribute('data-cut-id'),
      assetRef: root.getAttribute('data-asset-ref'),
      visualState: root.getAttribute('data-visual-state'),
      imageStatus: root.getAttribute('data-image-status'),
      backgroundImage: surfaceStyle.backgroundImage,
      backgroundPosition: surfaceStyle.backgroundPosition,
      backgroundSize: surfaceStyle.backgroundSize,
      surfaceVisible: visible(surface, surfaceStyle, surfaceBox),
      fallbackVisible: visible(fallback, fallbackStyle, fallbackBox)
    };
  });
}

async function getControlledPanel(page, toggleSelector) {
  const toggle = page.locator(toggleSelector);
  const controlledId = await toggle.getAttribute('aria-controls');
  expect(controlledId).toBeTruthy();
  expect(controlledId).toMatch(/^[A-Za-z][\w:.-]*$/);
  const panel = page.locator(`#${controlledId}`);
  await expect(panel).toHaveCount(1);
  return { toggle, panel };
}

async function expectCollapsed(panel) {
  await expect.poll(async () => panel.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return element.hidden
      || element.getAttribute('aria-hidden') === 'true'
      || style.display === 'none'
      || style.visibility === 'hidden'
      || box.height <= 1;
  })).toBe(true);
}

test.describe('c14 읽기 컷툰', () => {
  test('12컷과 승인된 12문장을 정확히 연결하고 모든 선택 상태를 동기화한다', async ({ page }) => {
    await openFresh(page);

    await page.locator('[data-cut-choice][data-cut-id="cut01"]').click();
    await expect(page.locator('#live-feedback')).toHaveText('선택한 컷과 문장을 함께 보여 줍니다.');

    const cutChoices = page.locator('[data-cut-choice][data-cut-id]');
    const sentenceChoices = page.locator('[data-sentence-choice][data-sentence-id]');
    await expect(cutChoices).toHaveCount(12);
    await expect(sentenceChoices).toHaveCount(12);

    const cutIds = await cutChoices.evaluateAll((elements) => (
      elements.map((element) => element.getAttribute('data-cut-id'))
    ));
    expect(cutIds).toEqual(CUT_IDS);

    const sentenceInventory = await sentenceChoices.evaluateAll((elements) => elements.map((element) => ({
      id: element.getAttribute('data-sentence-id'),
      text: element.textContent.replace(/\s+/g, ' ').trim(),
      tag: element.tagName
    })));
    expect(new Set(sentenceInventory.map(({ id }) => id)).size).toBe(12);
    sentenceInventory.forEach(({ id, text, tag }, index) => {
      expect(id).toBeTruthy();
      expect(tag).toBe('BUTTON');
      expect(text).toContain(SENTENCES[index]);
    });
    expect(normalizeText(await page.locator('body').innerText()))
      .not.toContain('도낏자루가 다 썩어서 없어졌기 때문이다.');

    const cutTags = await cutChoices.evaluateAll((elements) => elements.map((element) => element.tagName));
    expect(cutTags).toEqual(Array(12).fill('BUTTON'));

    for (let index = 1; index <= 12; index += 1) {
      await cutChoices.nth(index - 1).click();
      await expectCurrentCut(page, index);
    }
  });

  test('기본 보기에서는 그림이 왼쪽에 있고 큰 그림 보기에서는 문장 위·그림 아래로 확대 탐색한다', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openFresh(page);

    const reader = page.locator('#reader-app');
    const visualPane = page.locator('#visual-pane');
    const textPane = page.locator('.text-pane');
    const layoutToggle = page.locator('#layout-toggle');
    const scene = page.locator('#scene-visual');
    const sentence = page.locator('.scene-footer');

    await expect(reader).toHaveAttribute('data-layout-mode', 'default');
    await expect(layoutToggle).toHaveAttribute('aria-pressed', 'false');
    await expect(layoutToggle).toContainText('큰 그림 보기');
    const defaultLayout = await page.evaluate(() => {
      const visual = document.querySelector('#visual-pane').getBoundingClientRect();
      const text = document.querySelector('.text-pane').getBoundingClientRect();
      const sceneBox = document.querySelector('#scene-visual').getBoundingClientRect();
      return { visualLeft: visual.left, textLeft: text.left, sceneWidth: sceneBox.width };
    });
    expect(defaultLayout.visualLeft).toBeLessThan(defaultLayout.textLeft);

    await layoutToggle.click();
    await expect(reader).toHaveAttribute('data-layout-mode', 'focus');
    await expect(layoutToggle).toHaveAttribute('aria-pressed', 'true');
    await expect(layoutToggle).toContainText('기본 보기');
    await expect(textPane).toBeHidden();
    await expect(scene).toBeVisible();
    await expect(sentence).toBeVisible();

    const focusLayout = await page.evaluate(() => {
      const sentenceBox = document.querySelector('.scene-footer').getBoundingClientRect();
      const sceneBox = document.querySelector('#scene-visual').getBoundingClientRect();
      return {
        sentenceBottom: sentenceBox.bottom,
        sceneTop: sceneBox.top,
        sceneWidth: sceneBox.width,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    expect(focusLayout.sentenceBottom).toBeLessThanOrEqual(focusLayout.sceneTop + 1);
    expect(focusLayout.sceneWidth).toBeGreaterThan(defaultLayout.sceneWidth * 1.6);
    expect(focusLayout.overflow).toBe(false);

    await page.locator('#next-cut').click();
    await expectCurrentCut(page, 2);
    await page.locator('#prev-cut').click();
    await expectCurrentCut(page, 1);

    await page.reload({ waitUntil: 'load' });
    await expect(reader).toHaveAttribute('data-layout-mode', 'focus');
    await expect(textPane).toBeHidden();

    await layoutToggle.click();
    await expect(reader).toHaveAttribute('data-layout-mode', 'default');
    await expect(textPane).toBeVisible();
    const restoredColumns = await page.evaluate(() => ({
      visualLeft: document.querySelector('#visual-pane').getBoundingClientRect().left,
      textLeft: document.querySelector('.text-pane').getBoundingClientRect().left
    }));
    expect(restoredColumns.visualLeft).toBeLessThan(restoredColumns.textLeft);
  });

  test('생성 이미지 스프라이트가 URL·크롭 위치·상태를 바꾸고 컷·문장 클릭을 함께 반영한다', async ({ page }) => {
    await openFresh(page);

    const visual = page.locator(
      '#scene-visual[role="img"][data-cut-id][data-asset-ref][data-visual-state][data-image-status][data-nontext-visual]'
    );
    await expect(visual).toHaveCount(1);
    await expect(visual).toHaveAttribute('data-copy-layer', 'PRIMARY');
    expect(await visual.evaluate((element) => element.tagName)).toBe('DIV');
    await expect(visual.locator('.scene-image-surface')).toHaveCount(1);
    await expect(visual.locator('.scene-code-fallback')).toHaveCount(1);

    const initial = await captureSpriteScene(page);
    expect(initial.cutId).toBe('cut01');
    expect(initial.visualState).toBe('cut01');
    expect(initial.assetRef).toBeTruthy();
    expect(initial.imageStatus).toEqual(expect.any(String));
    expect(initial.imageStatus.length).toBeGreaterThan(0);
    expect(initial.surfaceVisible).toBe(true);
    expect(initial.fallbackVisible).toBe(false);
    expect(backgroundUrl(initial.backgroundImage)).toMatch(/\.webp$/i);

    await page.locator('[data-sentence-choice][data-sentence-id]').nth(7).click();
    await expectCurrentCut(page, 8);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const selected = await captureSpriteScene(page);

    expect(selected.cutId).toBe('cut08');
    expect(selected.visualState).toBe('cut08');
    expect(selected.assetRef).toBeTruthy();
    expect(selected.imageStatus).toBe(initial.imageStatus);
    expect(selected.surfaceVisible).toBe(true);
    expect(selected.fallbackVisible).toBe(false);
    expect(backgroundUrl(selected.backgroundImage)).toMatch(/\.webp$/i);
    expect(`${selected.backgroundImage}|${selected.backgroundPosition}`)
      .not.toBe(`${initial.backgroundImage}|${initial.backgroundPosition}`);

    await page.locator('[data-cut-choice][data-cut-id="cut03"]').click();
    await expectCurrentCut(page, 3);
  });

  test('이전·다음과 좌우 방향키를 순환하고 Enter·Space 선택을 같은 상태로 연결한다', async ({ page }) => {
    await openFresh(page);

    await expect(page.locator('#prev-cut')).toHaveAttribute('type', 'button');
    await expect(page.locator('#next-cut')).toHaveAttribute('type', 'button');

    await page.locator('#prev-cut').click();
    await expectCurrentCut(page, 12);
    await page.locator('#next-cut').click();
    await expectCurrentCut(page, 1);

    await page.keyboard.press('ArrowLeft');
    await expectCurrentCut(page, 12);
    await page.keyboard.press('ArrowRight');
    await expectCurrentCut(page, 1);

    const fifthSentence = page.locator('[data-sentence-choice][data-sentence-id]').nth(4);
    await fifthSentence.focus();
    await page.keyboard.press('Enter');
    await expectCurrentCut(page, 5);
    await expect(fifthSentence).toBeFocused();

    const tenthCut = page.locator('[data-cut-choice][data-cut-id="cut10"]');
    await tenthCut.focus();
    await page.keyboard.press('Space');
    await expectCurrentCut(page, 10);
    await expect(tenthCut).toBeFocused();

    const examLink = page.locator('.topbar__nav a[href="mock-reading-exam.html"]');
    await examLink.focus();
    await page.keyboard.press('ArrowRight');
    await expectCurrentCut(page, 10);
    await expect(examLink).toBeFocused();
  });

  test('12개 스프라이트 썸네일을 4개씩 묶고 텍스트를 가려도 고유 크롭과 현재 윤곽을 남긴다', async ({ page }) => {
    await openFresh(page);

    const groups = page.locator('.cut-group[data-interaction-ref]');
    await expect(groups).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect(groups.nth(index).locator('[data-cut-choice]')).toHaveCount(4);
    }

    const thumbnails = page.locator('[data-cut-choice][data-cut-id] .cut-choice__visual');
    await expect(thumbnails).toHaveCount(12);
    const thumbnailAudit = await thumbnails.evaluateAll((elements) => {
      const records = elements.map((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const button = element.closest('[data-cut-choice][data-cut-id]');
        const match = /url\(["']?(.*?)["']?\)/.exec(style.backgroundImage);
        return {
          cutId: button && button.getAttribute('data-cut-id'),
          assetRef: element.getAttribute('data-asset-ref')
            || (button && button.getAttribute('data-asset-ref')),
          url: match ? new URL(match[1], location.href).href : null,
          position: style.backgroundPosition,
          size: style.backgroundSize,
          visible: !element.hidden
            && style.display !== 'none'
            && style.visibility !== 'hidden'
            && box.width > 0
            && box.height > 0
        };
      });
      return {
        orderedIds: records.map(({ cutId }) => cutId),
        uniqueUrls: [...new Set(records.map(({ url }) => url))],
        uniqueCrops: new Set(records.map(({ url, position }) => `${url}|${position}`)).size,
        allHaveAssetRefs: records.every(({ assetRef }) => Boolean(assetRef)),
        allVisible: records.every(({ visible }) => visible)
      };
    });
    expect(thumbnailAudit.orderedIds).toEqual(CUT_IDS);
    expect(thumbnailAudit.uniqueUrls).toHaveLength(2);
    expect(thumbnailAudit.uniqueUrls.every((url) => /\.webp$/i.test(url))).toBe(true);
    expect(thumbnailAudit.uniqueCrops).toBe(12);
    expect(thumbnailAudit.allHaveAssetRefs).toBe(true);
    expect(thumbnailAudit.allVisible).toBe(true);
    await expect(page.locator('.cut-choice__fallback')).toHaveCount(12);
    await expect(page.locator('.cut-choice__fallback:visible')).toHaveCount(0);

    await page.evaluate(() => window.C14ReadingCuttoonQA.setCopyHidden(true));
    const hiddenCopyAudit = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll('[data-cut-choice]')];
      const rectangles = buttons.map((button) => {
        const box = button.getBoundingClientRect();
        return { left: box.left, top: box.top };
      });
      const active = document.querySelector('[data-cut-choice][aria-pressed="true"]');
      const inactive = document.querySelector('[data-cut-choice][aria-pressed="false"]');
      return {
        visibleThumbnailCount: [...document.querySelectorAll('.cut-choice__visual')]
          .filter((element) => element.getBoundingClientRect().width > 0).length,
        distinctPositions: new Set(rectangles.map((box) => `${box.left}:${box.top}`)).size,
        activeBorder: getComputedStyle(active).borderTopWidth,
        inactiveBorder: getComputedStyle(inactive).borderTopWidth,
        activeTransform: getComputedStyle(active).transform,
        labelColor: getComputedStyle(active.querySelector('.cut-choice__label')).color
      };
    });
    expect(hiddenCopyAudit.visibleThumbnailCount).toBe(12);
    expect(hiddenCopyAudit.distinctPositions).toBe(12);
    expect(Number.parseFloat(hiddenCopyAudit.activeBorder)).toBeGreaterThan(Number.parseFloat(hiddenCopyAudit.inactiveBorder));
    expect(hiddenCopyAudit.activeTransform).not.toBe('none');
    expect(hiddenCopyAudit.labelColor).toMatch(/rgba\([^)]*,\s*0\)|transparent/);
  });

  test('copy layer와 접근 가능한 대체 설명을 보존하고 선택 도움말을 기본 닫힘으로 둔다', async ({ page }) => {
    await openFresh(page);

    await expect(page.locator('[data-cut-choice][data-copy-layer="PRIMARY"]')).toHaveCount(12);
    await expect(page.locator('[data-sentence-choice][data-copy-layer="PRIMARY"]')).toHaveCount(12);
    await expect(page.locator('#current-sentence')).toHaveAttribute('data-copy-layer', 'PRIMARY');
    await expect(page.locator('#scene-fallback')).toHaveAttribute('data-copy-layer', 'PRIMARY');
    await expect(page.locator('#scene-visual')).toHaveAttribute('role', 'img');
    await expect(page.locator('#scene-visual')).toHaveAttribute('aria-labelledby', 'scene-fallback');
    await expect(page.locator('#scene-visual')).toHaveAccessibleName(FALLBACKS[0]);
    await expect(page.locator('#scene-visual .scene-image-surface')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('.cut-choice__visual[aria-hidden="true"]')).toHaveCount(12);
    await expect(page.locator('[data-copy-layer="TEACHER_ONLY"]')).toHaveCount(0);

    const cutChoices = page.locator('[data-cut-choice][data-cut-id]');
    for (let index = 0; index < 12; index += 1) {
      const escapedAlt = FALLBACKS[index].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      await expect(cutChoices.nth(index)).toHaveAccessibleName(new RegExp(escapedAlt));
    }
    await cutChoices.nth(11).click();
    await expect(page.locator('#scene-visual')).toHaveAccessibleName(FALLBACKS[11]);

    const { toggle, panel } = await getControlledPanel(page, '#optional-help-toggle');
    await expect(toggle).toHaveAttribute('type', 'button');
    await expect(toggle).toHaveAttribute('data-copy-layer', 'PRIMARY');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleName('이동 도움말');
    await expect(toggle).not.toHaveAccessibleName('이전 컷과 다음 컷 버튼이나 좌우 방향키로 이동할 수 있어요.');
    await expect(panel).toHaveAttribute('data-copy-layer', 'OPTIONAL_HELP');
    await expect(panel).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();

    const source = await page.locator('html').evaluate((element) => element.outerHTML);
    expect(source).not.toMatch(/teacher_rationale|system_condition|data-copy-layer=["']TEACHER_ONLY/i);
  });

  test('두 생성 WebP 스프라이트의 데이터 매핑·실제 형식·크기·픽셀 예산과 로컬 전용 로딩을 지킨다', async ({ page }) => {
    const problems = watchPageProblems(page);
    await blockExternalRequests(page);
    await page.goto(PAGE_PATH, { waitUntil: 'load' });

    const audit = await page.evaluate(async () => {
      const data = window.C14_READING_CUTTOON_DATA;
      const assets = data.assets.map((asset) => ({
        id: asset.id,
        src: asset.src,
        kind: asset.kind,
        cuts: asset.cuts
      }));
      const cuts = data.cuts.map((cut) => ({
        id: cut.id,
        assetRef: cut.visual.assetRef,
        spriteCol: cut.visual.spriteCol,
        spriteRow: cut.visual.spriteRow,
        fallbackKind: cut.visual.fallbackKind
      }));
      const backgroundRecord = (element) => {
        const style = getComputedStyle(element);
        const match = /url\(["']?(.*?)["']?\)/.exec(style.backgroundImage);
        return {
          url: match ? new URL(match[1], location.href).href : null,
          position: style.backgroundPosition,
          size: style.backgroundSize
        };
      };
      const sceneRecord = backgroundRecord(document.querySelector('.scene-image-surface'));
      const thumbnailRecords = [...document.querySelectorAll('[data-cut-choice][data-cut-id] .cut-choice__visual')]
        .map((element) => ({
          cutId: element.closest('[data-cut-choice]').getAttribute('data-cut-id'),
          ...backgroundRecord(element)
        }));
      const assetUrls = assets.map((asset) => new URL(asset.src, location.href).href);
      const fileAudits = await Promise.all(assetUrls.map(async (url) => {
        const response = await fetch(url, { cache: 'no-store' });
        const blob = await response.blob();
        const bytes = new Uint8Array(await blob.arrayBuffer());
        const image = new Image();
        const dimensions = await new Promise((resolve, reject) => {
          image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
          image.onerror = () => reject(new Error(`Could not decode ${url}`));
          image.src = url;
        });
        const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
        return {
          url,
          ok: response.ok,
          contentType: response.headers.get('content-type') || blob.type,
          bytes: blob.size,
          width: dimensions.width,
          height: dimensions.height,
          webpSignature: ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP'
        };
      }));
      const attributeUrls = [...document.querySelectorAll('[src], [href], [poster]')]
        .flatMap((element) => ['src', 'href', 'poster']
          .map((attribute) => element.getAttribute(attribute))
          .filter(Boolean))
        .filter((value) => !value.startsWith('#'))
        .map((value) => new URL(value, location.href))
        .filter((url) => /^https?:$/.test(url.protocol));
      const resources = performance.getEntriesByType('resource').map((entry) => entry.name);
      const activeThumbnail = thumbnailRecords.find(({ cutId }) => (
        cutId === document.querySelector('#scene-visual').getAttribute('data-cut-id')
      ));

      return {
        assets,
        cuts,
        assetUrls,
        fileAudits,
        computedUrls: [...new Set([sceneRecord, ...thumbnailRecords].map(({ url }) => url))],
        thumbnailUniqueCrops: new Set(
          thumbnailRecords.map(({ url, position }) => `${url}|${position}`)
        ).size,
        sceneMatchesActiveThumbnail: Boolean(activeThumbnail
          && sceneRecord.url === activeThumbnail.url
          && sceneRecord.position === activeThumbnail.position),
        imageCount: document.querySelectorAll('img, picture').length,
        videoCount: document.querySelectorAll('video, video source').length,
        iframeCount: document.querySelectorAll('iframe').length,
        svgCount: document.querySelectorAll('svg').length,
        remoteAttributes: attributeUrls
          .filter((url) => url.origin !== location.origin)
          .map((url) => url.href),
        remoteResources: resources.filter((value) => new URL(value).origin !== location.origin)
      };
    });

    expect(audit.assets).toHaveLength(2);
    expect(new Set(audit.assets.map(({ id }) => id)).size).toBe(2);
    expect(new Set(audit.assets.map(({ src }) => src)).size).toBe(2);
    for (const asset of audit.assets) {
      expect(asset.id).toEqual(expect.any(String));
      expect(asset.id.length).toBeGreaterThan(0);
      expect(asset.kind).toEqual(expect.any(String));
      expect(asset.kind.length).toBeGreaterThan(0);
      expect(asset.src).toMatch(/\.webp$/i);
      expect(asset.cuts).toHaveLength(6);
    }
    expect(audit.assets.flatMap(({ cuts }) => cuts).sort()).toEqual([...CUT_IDS].sort());

    const assetIds = new Set(audit.assets.map(({ id }) => id));
    expect(audit.cuts).toHaveLength(12);
    expect(audit.cuts.map(({ id }) => id)).toEqual(CUT_IDS);
    expect(new Set(audit.cuts.map(({ assetRef, spriteCol, spriteRow }) => (
      `${assetRef}:${spriteCol}:${spriteRow}`
    ))).size).toBe(12);
    for (const cut of audit.cuts) {
      expect(assetIds.has(cut.assetRef), cut.id).toBe(true);
      expect([0, 1]).toContain(cut.spriteCol);
      expect([0, 1, 2]).toContain(cut.spriteRow);
      expect(cut.fallbackKind).toEqual(expect.any(String));
      expect(cut.fallbackKind.length).toBeGreaterThan(0);
      const asset = audit.assets.find(({ id }) => id === cut.assetRef);
      expect(asset.cuts, cut.id).toContain(cut.id);
    }

    const sortedAssetUrls = [...audit.assetUrls].sort();
    expect(sortedAssetUrls).toHaveLength(2);
    expect(sortedAssetUrls.every((url) => new URL(url).origin === LOCAL_ORIGIN)).toBe(true);
    expect(sortedAssetUrls.every((url) => /\.webp$/i.test(new URL(url).pathname))).toBe(true);
    expect([...audit.computedUrls].sort()).toEqual(sortedAssetUrls);
    expect(audit.thumbnailUniqueCrops).toBe(12);
    expect(audit.sceneMatchesActiveThumbnail).toBe(true);

    expect(audit.fileAudits).toHaveLength(2);
    for (const asset of audit.fileAudits) {
      expect(asset.ok, asset.url).toBe(true);
      expect(asset.contentType, asset.url).toMatch(/^image\/webp(?:;|$)/i);
      expect(asset.webpSignature, asset.url).toBe(true);
      expect(asset.bytes, asset.url).toBeGreaterThan(0);
      expect(asset.bytes, asset.url).toBeLessThanOrEqual(81_920);
      expect(asset.width, asset.url).toBeGreaterThan(0);
      expect(asset.height, asset.url).toBeGreaterThan(0);
      expect(Math.max(asset.width, asset.height), asset.url).toBeLessThanOrEqual(960);
    }
    expect(audit.fileAudits.reduce((sum, asset) => sum + asset.bytes, 0)).toBeLessThanOrEqual(163_840);

    expect(audit.imageCount).toBe(0);
    expect(audit.videoCount).toBe(0);
    expect(audit.iframeCount).toBe(0);
    expect(audit.svgCount).toBe(0);
    expect(audit.remoteAttributes).toEqual([]);
    expect(audit.remoteResources).toEqual([]);
    expect(problems.remoteRequests).toEqual([]);
    expect([...new Set(problems.webpRequests)].sort()).toEqual(sortedAssetUrls);
    expect(problems.consoleErrors).toEqual([]);
    expect(problems.pageErrors).toEqual([]);
  });

  test('생성 배경을 강제로 실패시키면 코드 대체가 나타나고 전환·접근성·이미지 복구를 유지한다', async ({ page }) => {
    await openFresh(page);

    const readyStatus = await page.locator('#scene-visual').getAttribute('data-image-status');
    expect(readyStatus).toBeTruthy();

    const qaContract = await page.evaluate(() => ({
      forceImageFailure: typeof window.C14ReadingCuttoonQA.forceImageFailure,
      restoreImages: typeof window.C14ReadingCuttoonQA.restoreImages
    }));
    expect(qaContract).toEqual({ forceImageFailure: 'function', restoreImages: 'function' });

    await page.evaluate(() => window.C14ReadingCuttoonQA.forceImageFailure());
    await expect.poll(() => page.locator('#scene-visual').getAttribute('data-image-status'))
      .not.toBe(readyStatus);
    const failedStatus = await page.locator('#scene-visual').getAttribute('data-image-status');
    expect(failedStatus).toBeTruthy();

    const failureAudit = await page.evaluate(() => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return !element.hidden
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0.01
          && box.width > 0
          && box.height > 0;
      };
      const backgroundIsHidden = (element) => {
        const style = getComputedStyle(element);
        return style.backgroundImage === 'none' || !isVisible(element);
      };
      const sceneSurface = document.querySelector('.scene-image-surface');
      const sceneFallback = document.querySelector('.scene-code-fallback');
      const cutVisuals = [...document.querySelectorAll('.cut-choice__visual')];
      const cutFallbacks = [...document.querySelectorAll('.cut-choice__fallback')];
      return {
        sceneBackgroundHidden: backgroundIsHidden(sceneSurface),
        sceneFallbackVisible: isVisible(sceneFallback),
        hiddenCutBackgrounds: cutVisuals.filter(backgroundIsHidden).length,
        visibleCutFallbacks: cutFallbacks.filter(isVisible).length
      };
    });
    expect(failureAudit).toEqual({
      sceneBackgroundHidden: true,
      sceneFallbackVisible: true,
      hiddenCutBackgrounds: 12,
      visibleCutFallbacks: 12
    });

    await page.locator('[data-sentence-choice][data-cut-id="cut10"]').click();
    await expectCurrentCut(page, 10);
    await expect(page.locator('#scene-visual')).toHaveAttribute('data-image-status', failedStatus);
    await expect(page.locator('.scene-code-fallback')).toBeVisible();
    await expect(page.locator('#scene-visual')).toHaveAccessibleName(FALLBACKS[9]);
    await page.locator('#next-cut').click();
    await expectCurrentCut(page, 11);
    await expect(page.locator('.scene-code-fallback')).toBeVisible();

    await page.evaluate(() => window.C14ReadingCuttoonQA.restoreImages());
    await expect(page.locator('#scene-visual')).toHaveAttribute('data-image-status', readyStatus);
    const restoredAudit = await page.evaluate(() => {
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return !element.hidden
          && style.display !== 'none'
          && style.visibility !== 'hidden'
          && Number.parseFloat(style.opacity || '1') > 0.01
          && box.width > 0
          && box.height > 0;
      };
      const surface = document.querySelector('.scene-image-surface');
      const style = getComputedStyle(surface);
      return {
        sceneVisible: isVisible(surface),
        sceneHasWebp: /\.webp/i.test(style.backgroundImage),
        sceneFallbackVisible: isVisible(document.querySelector('.scene-code-fallback')),
        visibleCutVisuals: [...document.querySelectorAll('.cut-choice__visual')].filter(isVisible).length,
        visibleCutFallbacks: [...document.querySelectorAll('.cut-choice__fallback')].filter(isVisible).length
      };
    });
    expect(restoredAudit).toEqual({
      sceneVisible: true,
      sceneHasWebp: true,
      sceneFallbackVisible: false,
      visibleCutVisuals: 12,
      visibleCutFallbacks: 0
    });
    await expectCurrentCut(page, 11);
  });

  test('현재 컷과 모바일 접힘을 저장·복원하고 손상되거나 차단된 저장소에서도 계속한다', async ({ browser }) => {
    const restoreContext = await browser.newContext({
      baseURL: LOCAL_ORIGIN,
      viewport: { width: 390, height: 844 }
    });
    const restorePage = await restoreContext.newPage();
    await openFresh(restorePage);
    await restorePage.locator('[data-cut-choice][data-cut-id="cut09"]').click();
    await expectCurrentCut(restorePage, 9);

    const mobile = await getControlledPanel(restorePage, '#mobile-toggle');
    await expect(mobile.toggle).toBeVisible();
    if (await mobile.toggle.getAttribute('aria-expanded') === 'false') {
      await mobile.toggle.click();
      await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'true');
    }
    await mobile.toggle.click();
    await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'false');
    await expectCollapsed(mobile.panel);

    await expect.poll(() => restorePage.evaluate((key) => localStorage.getItem(key), STORAGE_KEY))
      .not.toBeNull();
    const stored = await restorePage.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(typeof stored).toBe('object');

    await restorePage.reload({ waitUntil: 'load' });
    await expectCurrentCut(restorePage, 9);
    await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'false');
    await expectCollapsed(mobile.panel);

    await restorePage.evaluate(() => window.C14ReadingCuttoonQA.resetState());
    await expectCurrentCut(restorePage, 1);
    await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'true');
    const resetState = await restorePage.evaluate((key) => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
    expect(resetState).toEqual({ activeCutId: 'cut01', mobileCollapsed: false, layoutMode: 'default' });
    await restoreContext.close();

    const malformedContext = await browser.newContext({ baseURL: LOCAL_ORIGIN });
    const malformedPage = await malformedContext.newPage();
    await malformedPage.goto(PAGE_PATH, { waitUntil: 'domcontentloaded' });
    await malformedPage.evaluate((key) => localStorage.setItem(key, '{broken-json'), STORAGE_KEY);
    await malformedPage.reload({ waitUntil: 'load' });
    await expectCurrentCut(malformedPage, 1);
    await malformedPage.locator('#next-cut').click();
    await expectCurrentCut(malformedPage, 2);
    await malformedContext.close();

    const blockedContext = await browser.newContext({ baseURL: LOCAL_ORIGIN });
    await blockedContext.addInitScript(() => {
      for (const method of ['getItem', 'setItem', 'removeItem', 'clear']) {
        Storage.prototype[method] = () => {
          throw new DOMException('storage blocked for QA', 'SecurityError');
        };
      }
    });
    const blockedPage = await blockedContext.newPage();
    const blockedErrors = [];
    blockedPage.on('pageerror', (error) => blockedErrors.push(error.message));
    await blockedPage.goto(PAGE_PATH, { waitUntil: 'load' });
    await expectCurrentCut(blockedPage, 1);
    await blockedPage.locator('[data-sentence-choice][data-sentence-id]').nth(5).click();
    await expectCurrentCut(blockedPage, 6);
    await blockedPage.locator('#optional-help-toggle').click();
    await expect(blockedPage.locator('#optional-help-toggle')).toHaveAttribute('aria-expanded', 'true');
    expect(blockedErrors).toEqual([]);
    await blockedContext.close();
  });

  test('390px 터치와 reduced motion에서 접기·스프라이트 최종 상태·수평 안전·무오류를 유지한다', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: LOCAL_ORIGIN,
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    const problems = watchPageProblems(page);
    await blockExternalRequests(page);
    await page.goto(PAGE_PATH, { waitUntil: 'load' });
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload({ waitUntil: 'load' });

    await page.mouse.wheel(0, 1200);
    await expectCurrentCut(page, 1);
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();

    const twelfthCut = page.locator('[data-cut-choice][data-cut-id="cut12"]');
    await twelfthCut.tap();
    await expectCurrentCut(page, 12);

    const mobile = await getControlledPanel(page, '#mobile-toggle');
    await expect(mobile.toggle).toBeVisible();
    if (await mobile.toggle.getAttribute('aria-expanded') === 'false') {
      await mobile.toggle.tap();
      await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'true');
    }
    await mobile.toggle.tap();
    await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'false');
    await expectCollapsed(mobile.panel);
    await mobile.toggle.tap();
    await expect(mobile.toggle).toHaveAttribute('aria-expanded', 'true');

    const audit = await page.evaluate(() => {
      const toSeconds = (value) => {
        const trimmed = value.trim();
        if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed) / 1000;
        return Number.parseFloat(trimmed) || 0;
      };
      const durations = [...document.querySelectorAll('body, body *')].flatMap((element) => {
        const style = getComputedStyle(element);
        return [...style.animationDuration.split(','), ...style.transitionDuration.split(',')]
          .map(toSeconds);
      });
      const visualBox = document.querySelector('#scene-visual').getBoundingClientRect();

      return {
        maxMotionSeconds: Math.max(0, ...durations),
        scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        visualLeft: visualBox.left,
        visualRight: visualBox.right,
        visualWidth: visualBox.width
      };
    });

    expect(audit.maxMotionSeconds).toBeLessThanOrEqual(0.001);
    expect(audit.scrollBehavior).toBe('auto');
    expect(audit.documentWidth).toBeLessThanOrEqual(audit.viewportWidth + 1);
    expect(audit.visualLeft).toBeGreaterThanOrEqual(-1);
    expect(audit.visualRight).toBeLessThanOrEqual(audit.viewportWidth + 1);
    expect(audit.visualWidth).toBeGreaterThan(0);
    expect(problems.remoteRequests).toEqual([]);
    expect(problems.consoleErrors).toEqual([]);
    expect(problems.pageErrors).toEqual([]);
    await context.close();
  });

  test('320 CSS px에서도 읽기 순서와 조작 영역이 다시 흐른다', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: LOCAL_ORIGIN,
      hasTouch: true,
      isMobile: true,
      viewport: { width: 320, height: 720 }
    });
    const page = await context.newPage();
    const problems = watchPageProblems(page);
    await blockExternalRequests(page);
    await page.goto(PAGE_PATH, { waitUntil: 'load' });
    await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
    await page.reload({ waitUntil: 'load' });

    await page.locator('[data-sentence-choice][data-cut-id="cut10"]').tap();
    await expectCurrentCut(page, 10);

    const reflow = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const selectors = ['#reader', '#visual-pane', '#mobile-toggle', '#prev-cut', '#next-cut'];
      const boxes = selectors.map((selector) => {
        const element = document.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return { selector, left: rect.left, right: rect.right, width: rect.width };
      });

      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth,
        boxes
      };
    });

    expect(reflow.documentWidth).toBeLessThanOrEqual(reflow.viewportWidth + 1);
    for (const box of reflow.boxes) {
      expect(box.width, box.selector).toBeGreaterThan(0);
      expect(box.left, box.selector).toBeGreaterThanOrEqual(-1);
      expect(box.right, box.selector).toBeLessThanOrEqual(reflow.viewportWidth + 1);
    }
    expect(problems.remoteRequests).toEqual([]);
    expect(problems.consoleErrors).toEqual([]);
    expect(problems.pageErrors).toEqual([]);
    await context.close();
  });

  test('1024×768과 1440×900에서 2열 배치·긴 문장·다음 동작을 안전하게 유지한다', async ({ browser }) => {
    for (const viewport of [{ width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ baseURL: LOCAL_ORIGIN, viewport });
      const page = await context.newPage();
      const problems = watchPageProblems(page);
      await blockExternalRequests(page);
      await openFresh(page);
      await page.locator('[data-cut-choice][data-cut-id="cut10"]').click();
      await expectCurrentCut(page, 10);

      const audit = await page.evaluate(() => {
        const reader = document.querySelector('.reader-app');
        const sentence = document.querySelector('#current-sentence').getBoundingClientRect();
        const next = document.querySelector('#next-cut').getBoundingClientRect();
        return {
          columns: getComputedStyle(reader).gridTemplateColumns.split(' ').filter(Boolean).length,
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          sentenceWidth: sentence.width,
          nextWidth: next.width,
          nextLeft: next.left,
          nextRight: next.right
        };
      });
      expect(audit.columns).toBe(2);
      expect(audit.documentWidth).toBeLessThanOrEqual(audit.viewportWidth + 1);
      expect(audit.sentenceWidth).toBeGreaterThan(0);
      expect(audit.nextWidth).toBeGreaterThan(0);
      expect(audit.nextLeft).toBeGreaterThanOrEqual(-1);
      expect(audit.nextRight).toBeLessThanOrEqual(audit.viewportWidth + 1);
      expect(problems.remoteRequests).toEqual([]);
      expect(problems.consoleErrors).toEqual([]);
      expect(problems.pageErrors).toEqual([]);
      await context.close();
    }
  });

  test('1024×768 데스크톱의 200% 확대 지표에서 512 CSS px로 재배치되고 주 과제가 겹치지 않는다', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: LOCAL_ORIGIN,
      viewport: { width: 1024, height: 768 }
    });
    const page = await context.newPage();
    const session = await context.newCDPSession(page);
    await session.send('Emulation.setDeviceMetricsOverride', {
      width: 512,
      height: 384,
      deviceScaleFactor: 2,
      mobile: false,
      screenWidth: 1024,
      screenHeight: 768
    });
    const problems = watchPageProblems(page);
    await blockExternalRequests(page);
    await openFresh(page);
    await page.locator('[data-cut-choice][data-cut-id="cut10"]').click();
    await expectCurrentCut(page, 10);

    const zoomAudit = await page.evaluate(() => {
      const activeSentence = document.querySelector('[data-sentence-choice][aria-pressed="true"]').getBoundingClientRect();
      const viewer = document.querySelector('#visual-pane').getBoundingClientRect();
      const horizontallySafe = [activeSentence, viewer].every((box) => box.left >= -1 && box.right <= innerWidth + 1);
      const sentenceCovered = activeSentence.bottom > viewer.top && activeSentence.top < viewer.bottom;
      return {
        innerWidth,
        outerWidth,
        devicePixelRatio,
        screenWidth: screen.width,
        documentWidth: document.documentElement.scrollWidth,
        horizontallySafe,
        sentenceCovered
      };
    });

    expect(zoomAudit.outerWidth).toBe(1024);
    expect(zoomAudit.screenWidth).toBe(1024);
    expect(zoomAudit.innerWidth).toBe(512);
    expect(zoomAudit.devicePixelRatio).toBe(2);
    expect(zoomAudit.documentWidth).toBeLessThanOrEqual(zoomAudit.innerWidth + 1);
    expect(zoomAudit.horizontallySafe).toBe(true);
    expect(zoomAudit.sentenceCovered).toBe(false);
    expect(problems.remoteRequests).toEqual([]);
    expect(problems.consoleErrors).toEqual([]);
    expect(problems.pageErrors).toEqual([]);
    await context.close();
  });

  test('읽기 문제를 채점한 뒤에만 컷툰 복습 링크를 열고 컷툰 안에서는 읽기 형제 경로를 유지한다', async ({ page }) => {
    await blockExternalRequests(page);

    await page.goto('/c14/index.html', { waitUntil: 'domcontentloaded' });
    const readingCard = page.locator('article.path-card[data-tone="reading"]')
      .filter({ hasText: '도낏자루 썩는 줄 모른다' });
    await expect(readingCard).toHaveCount(1);
    await expect(readingCard.locator('a[href="reading.html"]')).toHaveCount(1);
    await expect(readingCard.locator('a[href="reading-cuttoon.html"]')).toHaveCount(0);
    await expect(readingCard.locator('a[href="mock-reading-exam.html"]')).toHaveCount(1);
    await expect(readingCard.locator('a[href="writing-cut.html"]')).toHaveCount(1);

    await page.goto('/c14/reading.html', { waitUntil: 'domcontentloaded' });
    const readingNav = page.locator('nav[aria-label="14과 읽기 관련 활동"]');
    await expect(readingNav.locator('a[href="reading-cuttoon.html"]')).toHaveCount(0);

    await page.goto('/c14/mock-reading-exam.html', { waitUntil: 'load' });
    await expect(page.locator('.topbar a[href="reading-cuttoon.html"]')).toHaveCount(0);
    await expect(page.locator('#summaryCard a[href="reading-cuttoon.html"]')).toHaveCount(0);
    await page.locator('[data-action="grade"]').first().click();
    await expect(page.locator('#summaryCard a[href="reading-cuttoon.html"]')).toContainText('읽기 컷툰 탐색');

    await page.goto('/c14/writing-cut.html', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="reading-cuttoon.html"]')).toHaveCount(0);

    await page.goto(PAGE_PATH, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('a[href="index.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="reading.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="reading-cuttoon.html"][aria-current="page"]')).toHaveCount(1);
    await expect(page.locator('a[href="mock-reading-exam.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="writing-cut.html"]')).toHaveCount(1);
  });
});
