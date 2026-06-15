const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

const examples = [
  {
    label: '먹이다',
    base: '아이가 밥을 먹는다.',
    causative: '엄마가 아이에게 밥을 먹인다.',
    pattern: 'A가 B에게 C를 먹이다',
    causer: '엄마',
    causee: '아이',
    result: '밥을 먹음'
  },
  {
    label: '입히다',
    base: '아이가 옷을 입는다.',
    causative: '엄마가 아이에게 옷을 입힌다.',
    pattern: 'A가 B에게 C를 입히다',
    causer: '엄마',
    causee: '아이',
    result: '옷을 입음'
  },
  {
    label: '앉히다',
    base: '아이가 의자에 앉는다.',
    causative: '선생님이 아이를 의자에 앉힌다.',
    pattern: 'A가 B를 C에 앉히다',
    causer: '선생님',
    causee: '아이',
    result: '의자에 앉음'
  },
  {
    label: '눕히다',
    base: '아이가 침대에 눕는다.',
    causative: '아빠가 아이를 침대에 눕힌다.',
    pattern: 'A가 B를 C에 눕히다',
    causer: '아빠',
    causee: '아이',
    result: '침대에 누움'
  },
  {
    label: '깨우다',
    base: '동생이 잠에서 깬다.',
    causative: '누나가 동생을 깨운다.',
    pattern: 'A가 B를 깨우다',
    causer: '누나',
    causee: '동생',
    result: '잠에서 깸'
  },
  {
    label: '웃기다',
    base: '민수가 웃는다.',
    causative: '친구가 민수를 웃긴다.',
    pattern: 'A가 B를 웃기다',
    causer: '친구',
    causee: '민수',
    result: '웃음'
  }
];

test('causative diagram is responsive without horizontal overflow', async ({ page }) => {
  await blockExternalRequests(page);

  for (const viewport of [
    { width: 1280, height: 900 },
    { width: 390, height: 844 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/c11/grammar1-causative-diagram.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('사동 의미 구조 도식');
    await expect(page.getByTestId('flow-board')).toBeVisible();
    await expect(page.getByTestId('structure-board')).toBeVisible();
    await expect(page.locator('main img')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  }
});

test('causative diagram switches through six representative examples', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-diagram.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('example-button')).toHaveCount(6);

  for (const item of examples) {
    await page.getByRole('button', { name: item.label }).click();
    await expect(page.locator('#baseText')).toHaveText(item.base);
    await expect(page.locator('#causativeText')).toHaveText(item.causative);
    await expect(page.getByTestId('pattern-text')).toHaveText(item.pattern);
    await expect(page.getByTestId('causer-node')).toContainText(item.causer);
    await expect(page.getByTestId('causee-node')).toContainText(item.causee);
    await expect(page.getByTestId('result-node')).toContainText(item.result);
    await expect(page.locator('#boardCauser')).toHaveText(item.causer);
    await expect(page.locator('#boardCausee')).toHaveText(item.causee);
    await expect(page.locator('#boardResult')).toHaveText(item.result);
    await expect(page.locator('main img')).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  }
});

test('replay button restarts the flow animation state', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c11/grammar1-causative-diagram.html', { waitUntil: 'domcontentloaded' });

  await page.getByTestId('flow-board').evaluate((board) => board.classList.remove('is-replaying'));
  await page.getByTestId('structure-board').evaluate((board) => board.classList.remove('is-replaying'));
  await expect(page.getByTestId('flow-board')).not.toHaveClass(/is-replaying/);
  await expect(page.getByTestId('structure-board')).not.toHaveClass(/is-replaying/);
  await page.getByTestId('replay-button').click();
  await expect(page.getByTestId('flow-board')).toHaveClass(/is-replaying/);
  await expect(page.getByTestId('structure-board')).toHaveClass(/is-replaying/);
});

test('causative diagram honors reduced motion while keeping content visible', async ({ page }) => {
  await blockExternalRequests(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/c11/grammar1-causative-diagram.html', { waitUntil: 'domcontentloaded' });

  await expect(page.getByTestId('flow-board')).toBeVisible();
  await expect(page.getByTestId('causer-node')).toContainText('엄마');
  await expect(page.getByTestId('causee-node')).toContainText('아이');
  await expect(page.getByTestId('result-node')).toContainText('밥을 먹음');
  await expect(page.getByTestId('structure-board')).toContainText('밥을 먹음');
  await expect(page.locator('main img')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});
