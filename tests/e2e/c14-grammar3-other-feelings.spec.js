const { test, expect } = require('@playwright/test');

const forms = [
  ['hot', '덥다', '더워', '더워요', '더워해요'],
  ['cold', '춥다', '추워', '추워요', '추워해요'],
  ['tasty', '맛있다', '맛있어', '맛있어요', '맛있어해요'],
  ['not-tasty', '맛없다', '맛없어', '맛없어요', '맛없어해요'],
  ['glad', '기쁘다', '기뻐', '기뻐요', '기뻐해요'],
  ['sad', '슬프다', '슬퍼', '슬퍼요', '슬퍼해요'],
  ['miss', '그립다', '그리워', '그리워요', '그리워해요'],
  ['bored', '심심하다', '심심해', '심심해요', '심심해해요'],
  ['dull', '따분하다', '따분해', '따분해요', '따분해해요'],
  ['uncomfortable', '불편하다', '불편해', '불편해요', '불편해해요'],
  ['tired-hard', '힘들다', '힘들어', '힘들어요', '힘들어해요'],
  ['difficult', '어렵다', '어려워', '어려워요', '어려워해요'],
  ['pleasant', '즐겁다', '즐거워', '즐거워요', '즐거워해요'],
  ['happy', '행복하다', '행복해', '행복해요', '행복해해요'],
  ['fatigued', '피곤하다', '피곤해', '피곤해요', '피곤해해요'],
  ['interesting', '재미있다', '재미있어', '재미있어요', '재미있어해요']
];

async function openFresh(page) {
  await page.goto('/c14/grammar3-other-feelings.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.removeItem('c14-grammar3-other-feelings-v2'));
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test('14과 허브의 문법 3 카드에서 보조 활동을 연다', async ({ page }) => {
  await page.goto('/c14/index.html', { waitUntil: 'domcontentloaded' });

  await page.getByRole('link', { name: '내 느낌 · 다른 사람의 느낌' }).click();

  await expect(page).toHaveURL(/\/c14\/grammar3-other-feelings\.html$/);
  await expect(page.getByTestId('c14-g3-other-feelings')).toBeVisible();
});

test('정식 활동은 그림 위에서 두 형태를 동시에 보여 주고 16개 형용사를 정확히 바꾼다', async ({ page }) => {
  await openFresh(page);

  await expect(page.getByTestId('c14-g3-scene-image')).toHaveAttribute('src', /minsu-self-base\.webp$/);
  await expect(page.locator('#selfContrast')).toHaveClass(/is-current/);
  await expect(page.locator('#otherContrast')).not.toHaveClass(/is-current/);
  await expect(page.locator('#reportedEnding')).toHaveClass(/target-form/);

  for (const [key, base, stem, direct, other] of forms) {
    await page.locator(`[data-adjective="${key}"]`).click();
    await expect(page.locator('#directStem')).toHaveText(stem);
    await expect(page.locator('#reportedStem')).toHaveText(stem);
    await expect(page.locator('#selfContrast')).toHaveText(`저는 ${direct}`);
    await expect(page.locator('#otherContrast')).toHaveText(`철수는 ${other}`);
    await expect(page.locator('#sentenceOutput')).toHaveAttribute('aria-label', `저는 ${direct}. 철수는 ${other}.`);
  }

  await page.locator('[data-person="cheolsu"]').click();
  await expect(page.getByTestId('c14-g3-scene-image')).toHaveAttribute('src', /minsu-cheolsu-neutral-base\.webp$/);
  await expect(page.locator('#selfContrast')).not.toHaveClass(/is-current/);
  await expect(page.locator('#otherContrast')).toHaveClass(/is-current/);
  await expect(page.locator('#sceneThought')).toBeVisible();
  await expect(page.locator('#sceneEnding')).toBeVisible();
  await expect(page.locator('#sceneEnding')).toHaveText('해요');
  await expect(page.locator('#liveAnnouncement')).toHaveText('철수 씨는 어때요? 철수는 재미있어해요');

  await page.locator('[data-adjective="miss"]').click();
  await expect(page.locator('#selfContrast')).toHaveText('저는 그리워요');
  await expect(page.locator('#otherContrast')).toHaveText('철수는 그리워해요');
  await expect(page.locator('#sceneThought')).toHaveText('그리워');
  await expect(page.locator('#helpCopy')).toContainText('그리워해요');
});

test('정식 활동은 키보드·저장·손상된 저장값을 처리한다', async ({ page }) => {
  await openFresh(page);

  await page.locator('[data-person="minsu"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-person="cheolsu"]')).toBeFocused();
  await expect(page.locator('[data-person="cheolsu"]')).toHaveAttribute('aria-pressed', 'true');

  await page.locator('[data-adjective="hot"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-adjective="cold"]')).toBeFocused();
  await expect(page.locator('#selfContrast')).toHaveText('저는 추워요');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-adjective="sad"]')).toBeFocused();
  await expect(page.locator('#otherContrast')).toHaveText('철수는 슬퍼해요');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-person="cheolsu"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#selfContrast')).toHaveText('저는 슬퍼요');

  await page.evaluate(() => localStorage.setItem('c14-grammar3-other-feelings-v2', '{broken'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-person="minsu"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#selfContrast')).toHaveText('저는 더워요');
});

test('이미지 오류 대체 장면이 나타나고 다른 분기로 바꾸면 정상 이미지가 복구된다', async ({ page }) => {
  await openFresh(page);

  await page.getByTestId('c14-g3-scene-image').evaluate((image) => { image.src = 'missing-scene.webp'; });
  await expect(page.getByTestId('c14-g3-scene-image')).toBeHidden();
  await expect(page.locator('#scene-code-fallback')).toBeVisible();
  await expect(page.locator('#fallbackAnswer')).toHaveText('더워요');

  await page.locator('[data-person="cheolsu"]').click();
  await expect(page.getByTestId('c14-g3-scene-image')).toBeVisible();
  await expect(page.getByTestId('c14-g3-scene-image')).toHaveAttribute('src', /minsu-cheolsu-neutral-base\.webp$/);
  await expect.poll(() => page.getByTestId('c14-g3-scene-image').evaluate((image) => image.complete && image.naturalWidth === 960)).toBe(true);
  await expect(page.locator('#scene-code-fallback')).toBeHidden();
});

test('말풍선 대사는 긴 형용사에서도 말풍선 안에 들어간다', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await openFresh(page);

    for (const person of ['minsu', 'cheolsu']) {
      await page.evaluate((nextPerson) => {
        window.C14Grammar3OtherFeelings.setState({ person: nextPerson, adjective: 'interesting' });
      }, person);

      const overflows = await page.evaluate(() => ['sceneQuestion', 'sceneReply', 'sceneThought']
        .map((id) => document.getElementById(id))
        .filter((element) => !element.hidden)
        .filter((element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight)
        .map((element) => element.id));
      expect(overflows).toEqual([]);
    }
  }
});

test('정식 활동은 의미 시각 감사와 주요 화면 폭을 통과한다', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
    { width: 1024, height: 768 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await openFresh(page);

    const audit = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('.branch-choice, .feeling-choice'));
      const output = document.querySelector('#sentenceOutput').getBoundingClientRect();
      const scene = document.querySelector('.scene-art').getBoundingClientRect();
      const stageTop = document.querySelector('.stage-panel').getBoundingClientRect().top;
      return {
        width: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        stageTop,
        outputAboveScene: output.bottom <= scene.top,
        minimumTarget: Math.min(...buttons.map((button) => button.getBoundingClientRect().height)),
        visualFindings: window.SemanticVisualSystem.audit(
          document,
          window.C14Grammar3OtherFeelings.assetManifest
        )
      };
    });

    expect(audit.scrollWidth).toBeLessThanOrEqual(audit.width + 1);
    expect(audit.minimumTarget).toBeGreaterThanOrEqual(44);
    expect(audit.visualFindings).toEqual([]);
    expect(audit.outputAboveScene).toBe(true);
    if (viewport.width <= 390) expect(audit.stageTop).toBeLessThan(viewport.height);
  }

  await page.setViewportSize({ width: 768, height: 900 });
  await openFresh(page);
  const zoomAudit = await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
    const buttons = Array.from(document.querySelectorAll('.branch-choice, .feeling-choice'));
    return {
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      minimumTarget: Math.min(...buttons.map((button) => button.getBoundingClientRect().height))
    };
  });
  expect(zoomAudit.scrollWidth).toBeLessThanOrEqual(zoomAudit.width + 1);
  expect(zoomAudit.minimumTarget).toBeGreaterThanOrEqual(44);
});
