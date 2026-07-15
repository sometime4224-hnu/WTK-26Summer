const { test, expect } = require('@playwright/test');

const pagePath = '/c14/grammar1-2-speaking.html';
const storageKey = 'c14-grammar1-2-speaking-v1';

async function openFresh(page) {
  await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test('C14 문법 1·2 융합 말하기는 장면·문법 판정·저장을 제공한다', async ({ page }) => {
  await openFresh(page);

  await expect(page).toHaveTitle('14과 문법 1·2 융합 말하기');
  await expect(page.locator('h1')).toHaveText('강한 경험을 말하고, 그 기억을 다시 꺼내 말해요');
  await expect(page.locator('body')).not.toContainText('???');
  await expect(page.locator('body')).not.toContainText('13과');
  await expect(page.locator('.section-kicker').first()).toContainText('사이클 1');

  const sceneImage = page.locator('.scene-card img');
  await expect(sceneImage).toHaveAttribute('src', /spicy-stew-memory\.webp$/);
  await expect(sceneImage).toHaveAttribute('alt', /김치찌개/);
  await expect.poll(() => sceneImage.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.locator('.token-guide')).toHaveText('섞인 어절을 눌러 문장의 순서를 직접 만들어 보세요.');
  await expect(page.locator('.token-btn')).not.toHaveText(['김치찌개가', '하도', '매워서', '물을', '많이', '마셨어요.']);

  await page.locator('#draftInput').fill('음식이 모자랄까 봐 상을 차렸어요.');
  await page.getByRole('button', { name: '문장 확인', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('문법 틀과 장면의 핵심 낱말');

  await page.getByRole('button', { name: '모범 문장', exact: true }).click();
  await page.getByRole('button', { name: '문장 확인', exact: true }).click();
  await expect(page.locator('#feedback')).toContainText('목표 문장을 정확하게');
  await page.getByRole('button', { name: '문법 2로 이어 가기', exact: true }).click();

  await expect(page.locator('h2')).toHaveText('지난주에 먹은 김치찌개를 기억하며 말해 보세요.');
  await expect(page.locator('#progressText')).toContainText('1단계 완료');
  await expect.poll(() => page.evaluate((key) => Boolean(localStorage.getItem(key)), storageKey)).toBe(true);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('h2')).toHaveText('지난주에 먹은 김치찌개를 기억하며 말해 보세요.');
  await expect(page.locator('#saveState')).toHaveText('저장된 진행을 불러왔어요');

  await page.getByRole('button', { name: '모범 문장', exact: true }).click();
  await page.getByRole('button', { name: '문장 확인', exact: true }).click();
  await page.getByRole('button', { name: '두 문장 말하기로 이어 가기', exact: true }).click();
  await expect(page.locator('h2')).toHaveText('앞에서 만든 두 문장을 소리 내어 이어 말해 보세요.');

  await page.getByRole('button', { name: '모범 발음 듣기', exact: true }).click();
  await expect(page.getByRole('button', { name: '다음 문장', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: '다음 문장', exact: true }).click();
  await expect(page.locator('.target-sentence')).toHaveText('지난주에 먹었던 김치찌개가 아직도 생각나요.');
});

test('C14 융합 말하기는 스마트폰 폭에서 가로 넘침 없이 시작한다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openFresh(page);

  const viewportAudit = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    headingTop: document.querySelector('#workspace h2').getBoundingClientRect().top
  }));

  expect(viewportAudit.documentWidth).toBeLessThanOrEqual(viewportAudit.viewportWidth + 1);
  expect(viewportAudit.headingTop).toBeGreaterThanOrEqual(0);
  await expect(page.locator('.token-btn').first()).toBeVisible();
  await expect.poll(() => page.locator('.scene-card img').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  const phoneScene = await page.locator('.scene-card').evaluate((card) => ({
    height: card.getBoundingClientRect().height,
    imageHeight: card.querySelector('img').getBoundingClientRect().height
  }));
  expect(phoneScene.height).toBeLessThanOrEqual(160);
  expect(phoneScene.imageHeight).toBeLessThanOrEqual(144);
});

test('C14 융합 말하기는 태블릿 가로에서 그림 높이를 제한한다', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await openFresh(page);

  const tabletLayout = await page.evaluate(() => {
    const image = document.querySelector('.scene-card img').getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      imageHeight: image.height,
      imageTop: image.top
    };
  });

  expect(tabletLayout.documentWidth).toBeLessThanOrEqual(tabletLayout.viewportWidth + 1);
  expect(tabletLayout.imageHeight).toBeLessThanOrEqual(176);
  expect(tabletLayout.imageTop).toBeGreaterThanOrEqual(0);
});
