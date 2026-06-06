const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
}

test('renders the c18 learning page set', async ({ page }) => {
  await blockExternalRequests(page);

  const pages = [
    ['/c18/index.html', '거울이 깨지고 말았어요'],
    ['/c18/vocabulary.html', '18'],
    ['/c18/vocab-support-stage-map.html', '무대 역할 지도'],
    ['/c18/vocab-support-script-lines.html', '대본과 대사 구분'],
    ['/c18/vocab-support-action-sequence.html', '무대 행동 순서 배열'],
    ['/c18/grammar1.html', '-다니까'],
    ['/c18/grammar2.html', 'V-고 말다'],
    ['/c18/listening.html', '연극을 보러 간 두 사람'],
    ['/c18/speaking.html', '거울 이야기 역할극'],
    ['/c18/reading.html', '대본 읽기와 역할극'],
    ['/c18/mock-exam.html', '18과 어휘·문법 모의고사']
  ];

  for (const [url, heading] of pages) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText(heading);
    await expect(page.locator('body')).not.toContainText('Not found');
  }

  const visualPages = [
    '/c18/index.html',
    '/c18/vocab-support-stage-map.html',
    '/c18/vocab-support-script-lines.html',
    '/c18/vocab-support-action-sequence.html',
    '/c18/grammar1.html',
    '/c18/grammar2.html',
    '/c18/listening.html',
    '/c18/speaking.html',
    '/c18/reading.html'
  ];

  for (const url of visualPages) {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.lesson-visual img')).toHaveCount(1);
    await page.waitForFunction(() => {
      const image = document.querySelector('.lesson-visual img');
      return image && image.complete && image.naturalWidth > 0;
    });
    const src = await page.locator('.lesson-visual img').evaluate((img) => img.currentSrc);
    expect(src).toContain('/assets/c18/page-visuals/webp/');
  }
});

test('c18 vocabulary filters and grammar quiz work', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c18/vocabulary.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.word-card')).toHaveCount(16);
  await expect(page.locator('.word-card__image')).toHaveCount(16);
  await page.waitForFunction(() => Array.from(document.querySelectorAll('.word-card__image')).every((img) => img.complete && img.naturalWidth > 0));
  const imageState = await page.locator('.word-card__image').evaluateAll((images) => images.map((img) => ({
    width: img.naturalWidth,
    src: img.currentSrc
  })));
  for (const image of imageState) {
    expect(image.width).toBeGreaterThan(0);
    expect(image.src).toContain('/assets/c18/vocabulary/images/cards/');
  }
  await page.locator('[data-category-id="object"]').click();
  await expect(page.locator('.word-card')).toHaveCount(4);
  await page.locator('[data-category-id="all"]').click();
  await page.locator('#search-input').fill('거울');
  await expect(page.locator('.word-card')).toHaveCount(4);

  await page.goto('/c18/grammar1.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-tab-target="practicePanel"]').click();
  await page.getByRole('button', { name: '좁다니까' }).click();
  await expect(page.locator('#feedback')).toContainText('정답');

  await page.goto('/c18/grammar2.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-tab-target="practicePanel"]').click();
  await page.getByRole('button', { name: '깨뜨리고 말았어요' }).click();
  await expect(page.locator('#feedback')).toContainText('정답');
});

test('c18 mock exam grades a perfect submission', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c18/mock-exam.html', { waitUntil: 'domcontentloaded' });

  const questions = await page.evaluate(() => window.C18_MOCK_EXAM.questions.map((question) => ({
    number: question.number,
    answer: question.answer
  })));

  expect(questions).toHaveLength(16);

  for (const question of questions) {
    await page.locator(`#q${question.number}-${question.answer}`).check({ force: true });
  }

  await page.locator('[data-action="grade"]').click();
  await expect(page.locator('#examResult')).toContainText('16 / 16');
});
