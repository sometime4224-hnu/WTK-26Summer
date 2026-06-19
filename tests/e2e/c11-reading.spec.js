const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

test('c11 hub links to reading, reading cuttoon, and cut writing', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

  const readingCard = page.locator('article.path-card[data-tone="reading"]').filter({ hasText: '읽기 활동' });
  await expect(readingCard.locator('a[href="reading.html"]')).toContainText('읽기');
  await expect(readingCard.locator('a[href="reading-cuttoon.html"]')).toContainText('읽기 컷툰 탐색');
  await expect(readingCard.locator('a[href="writing-cut.html"]')).toContainText('컷 쓰기 활동');
});

test('c11 reading page renders the completed passage and grades checks', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c11/reading.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h2').first()).toContainText('직장에서 성공하는 법');
  await expect(page.locator('body')).toContainText('경제 경영 서적을 읽으면 업무에 필요한 지식을 얻을 수 있다.');
  await expect(page.locator('body')).not.toContainText('읽으면……');

  await page.locator('[data-question="q1"] [data-choice="2"]').click();
  await expect(page.locator('[data-question="q1"] [data-feedback]')).toContainText('정답');

  await page.locator('[data-question="q3"] [data-choice="2"]').click();
  await expect(page.locator('[data-question="q3"] [data-feedback]')).toContainText('정답');

  await page.locator('#blank-answer').fill('독서');
  await page.getByRole('button', { name: '정답 확인' }).click();
  await expect(page.locator('#blank-feedback')).toContainText('맞았습니다');
});

test('c11 reading cuttoon renders webp images and sentence navigation', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c11/reading-cuttoon.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('직장에서 성공하는 법');
  await expect(page.locator('[data-thumb]')).toHaveCount(15);
  await expect(page.locator('[data-sentence]')).toHaveCount(15);
  await expect(page.locator('[data-thumb-placeholder]')).toHaveCount(0);
  await expect(page.locator('[data-stage-placeholder]')).toBeHidden();
  await expect(page.locator('#thumb-grid img[src]')).toHaveCount(15);
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /assets\/c11\/reading-writing\/images\/cuttoon\/c11-reading-cuttoon-01\.webp$/);
  await expect(page.locator('[data-vocab-id]')).toHaveCount(21);
  await expect(page.locator('[data-vocab-id="seg-company"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-reason"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-because"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-umbrella"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-kindness"]')).toHaveCount(1);
  await expect(page.locator('[data-vocab-id="seg-reading"]')).toHaveCount(1);
  await expect(page.locator('[data-vocab-id="seg-copy-machine"]')).toHaveCount(1);
  await expect(page.locator('[data-vocab-id="seg-novels"]')).toHaveCount(1);
  await expect(page.locator('[data-vocab-id="seg-small-kindness"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-this-kindness"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-reading-person"]')).toHaveCount(0);
  await expect(page.locator('[data-vocab-id="seg-business-books-read"]')).toHaveCount(0);
  await expect(page.locator('#vocab-word')).toContainText('필요한 사람');
  await expect(page.locator('#vocab-meaning')).toContainText('없으면 일이 힘들어지는 중요한 사람');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('[data-meaning-lang-option]')).toHaveCount(7);
  await expect(page.locator('[data-meaning-lang-option="none"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="en"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="ar"]')).toBeVisible();

  await page.locator('[data-meaning-lang-option="en"]').click();
  await expect(page.locator('#vocab-word')).toContainText('필요한 사람');
  await expect(page.locator('#vocab-meaning')).toContainText('An important person whose absence makes work harder');
  await expect(page.locator('#vocab-example')).toContainText('지수 씨는 우리 팀에 꼭 필요한 사람입니다');

  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('#cut-image, #thumb-grid img[src]'));
    return images.length === 16 && images.every((image) => image.complete && image.naturalWidth > 0);
  });

  const cuttoonImageSrcs = await page.locator('#cut-image, #thumb-grid img[src]').evaluateAll((images) => (
    images.map((image) => image.getAttribute('src'))
  ));
  expect(cuttoonImageSrcs).toHaveLength(16);
  expect(cuttoonImageSrcs.every((src) => src.includes('../assets/c11/reading-writing/images/cuttoon/'))).toBe(true);

  await expect(page.locator('#cut-title')).toContainText('필요한 사람이 되고 싶습니다');
  await page.locator('#next-cut').click();
  await expect(page.locator('#cut-title')).toContainText('어떤 노력을 해야 할까요');
  await expect(page.locator('#progress-label')).toContainText('2 / 15');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c11-reading-cuttoon-02\.webp$/);

  await page.locator('[data-thumb][data-cut-id="cut10"]').click();
  await expect(page.locator('#cut-title')).toContainText('친절을 오래 기억합니다');
  await expect(page.locator('[data-thumb][data-cut-id="cut10"]')).toHaveClass(/is-active/);
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c11-reading-cuttoon-10\.webp$/);

  await page.locator('[data-sentence-id="s14"]').click();
  await expect(page.locator('#cut-title')).toContainText('경제 경영 서적과 소설');
  await expect(page.locator('#progress-label')).toContainText('14 / 15');
  await expect(page.locator('[data-sentence-id="s14"]')).toHaveClass(/is-active/);
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c11-reading-cuttoon-14\.webp$/);

  await page.locator('[data-vocab-id="seg-business-books"]').click();
  await expect(page.locator('#vocab-word')).toContainText('경제 경영 서적');
  await expect(page.locator('#vocab-meaning')).toContainText('Books about money, companies, and ways to work');
  await expect(page.locator('#vocab-example')).toContainText('출근길에 경제 경영 서적을 읽습니다');
  await expect(page.locator('[data-vocab-id="seg-business-books"]')).toHaveClass(/is-vocab-active/);

  await page.locator('[data-meaning-lang-option="ar"]').click();
  await expect(page.locator('#vocab-meaning')).toContainText('كتب عن المال والشركات وطرق العمل');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#vocab-meaning')).toHaveCSS('text-align', 'left');
  await expect(page.locator('#vocab-example')).toContainText('출근길에 경제 경영 서적을 읽습니다');

  const storedLang = await page.evaluate(() => localStorage.getItem('preferred-lang'));
  expect(storedLang).toBe('ar');
});
