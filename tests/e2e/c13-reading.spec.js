const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

test('c13 hub links to reading, reading quiz, reading cuttoon, and cut writing', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c13/index.html', { waitUntil: 'domcontentloaded' });

  const readingCard = page.locator('article.path-card[data-tone="reading"]').filter({ hasText: '동물 사랑 바자회' });
  await expect(readingCard).toHaveCount(1);
  await expect(readingCard.locator('a[href="reading.html"]')).toContainText('읽기');
  await expect(readingCard.locator('a[href="reading-quiz.html"]')).toContainText('읽기 문제 풀기');
  await expect(readingCard.locator('a[href="reading-cuttoon.html"]')).toContainText('읽기 컷툰 탐색');
  await expect(readingCard.locator('a[href="writing-cut.html"]')).toContainText('컷 쓰기 활동');
});

test('c13 reading page renders passage, quiz checks, and event blanks', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c13/reading.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h2').first()).toContainText('동물 사랑 바자회');
  await expect(page.locator('body')).toContainText('"동물 사랑 바자회"에 여러분을 초대합니다.');
  await expect(page.locator('body')).toContainText('동물 가죽이나 모피로 만든 옷을 입으신 분은 입장할 수 없습니다.');
  await expect(page.locator('body')).not.toContainText('Trung cap');
  await expect(page.locator('body')).not.toContainText('Tu vung');

  await page.getByRole('button', { name: /바자회를 통해 기금을 마련하고 새 주인을 찾아 준다/ }).click();
  await expect(page.locator('#q1-feedback')).toContainText('정답');

  await page.getByRole('button', { name: /다큐멘터리 "멸종 위기의 동물"을 본다/ }).click();
  await expect(page.locator('#q2-feedback')).toContainText('정답');

  await page.locator("[data-question='ox1'] [data-choice='O']").click();
  await expect(page.locator('#ox1-feedback')).toContainText('정답');

  await page.locator('#blank1').selectOption('correct');
  await page.locator('#blank2').selectOption('correct');
  await expect(page.locator('#blank-feedback')).toContainText('모두 맞았습니다');
});

test('c13 reading quiz page scores answers and resets state', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c13/reading-quiz.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('동물 사랑 바자회');
  await expect(page.locator('body')).toContainText('저희 "동사모"는 동물을 사랑하는 사람들이 모여서');
  await expect(page.locator('body')).toContainText('동대문 문화 공원');
  await expect(page.locator('[data-question-type="mc"]')).toHaveCount(4);
  await expect(page.locator('[data-question-type="mc"] [data-choice]')).toHaveCount(16);
  await expect(page.locator('[data-question-type="short"]')).toHaveCount(1);
  await expect(page.locator('[data-question-type="subjective"]')).toHaveCount(1);

  const multipleChoiceQuestions = page.locator('[data-question-type="mc"]');
  await multipleChoiceQuestions.nth(0).locator('[data-choice="2"]').click();
  await expect(multipleChoiceQuestions.nth(0)).toHaveClass(/is-correct/);
  await expect(page.locator('#score-label')).toContainText('1 / 5');

  await multipleChoiceQuestions.nth(1).locator('[data-choice="1"]').click();
  await expect(multipleChoiceQuestions.nth(1)).toHaveClass(/is-correct/);
  await multipleChoiceQuestions.nth(2).locator('[data-choice="2"]').click();
  await expect(multipleChoiceQuestions.nth(2)).toHaveClass(/is-correct/);
  await multipleChoiceQuestions.nth(3).locator('[data-choice="3"]').click();
  await expect(multipleChoiceQuestions.nth(3)).toHaveClass(/is-correct/);

  await page.locator('#short-answer').fill('동대문 문화 공원');
  await page.locator('#check-short').click();
  await expect(page.locator('#short-feedback')).toContainText(/맞았습니다|정답/);
  await expect(page.locator('#score-label')).toContainText('5 / 5');

  await page.locator('#essay-answer').fill('저는 동물 사진 전시를 보고 싶습니다. 멸종 위기 동물에 대해 더 알고 싶기 때문입니다.');
  await page.locator('#check-essay').click();
  await expect(page.locator('#essay-feedback')).toContainText(/좋습니다|확인/);
  await page.locator('#show-sample').click();
  await expect(page.locator('#sample-answer')).toBeVisible();

  await page.locator('#reset-quiz').click();
  await expect(page.locator('#score-label')).toContainText('0 / 5');
  await expect(page.locator('#short-answer')).toHaveValue('');
  await expect(page.locator('#essay-answer')).toHaveValue('');
  await expect(page.locator('#sample-answer')).toBeHidden();
});

test('c13 reading cuttoon renders 9 cuts and supports vocab and language interactions', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c13/reading-cuttoon.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('동물 사랑 바자회');
  await expect(page.locator('[data-mobile-cut-overlay]')).toBeHidden();
  await expect(page.locator('[data-thumb]')).toHaveCount(9);
  await expect(page.locator('[data-sentence]')).toHaveCount(9);
  await expect(page.locator('[data-thumb-placeholder]')).toHaveCount(9);
  await expect(page.locator('[data-thumb-placeholder]').first()).toBeHidden();
  await expect(page.locator('[data-stage-placeholder]')).toBeHidden();
  await expect(page.locator('#thumb-grid img[src]')).toHaveCount(9);
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /assets\/c13\/reading-writing\/images\/cuttoon\/c13-reading-cuttoon-01\.webp$/);

  const vocabCount = await page.locator('[data-vocab-id]').count();
  expect(vocabCount).toBeGreaterThanOrEqual(14);
  await expect(page.locator('[data-meaning-lang-option]')).toHaveCount(7);
  await expect(page.locator('[data-meaning-lang-option="none"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="en"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="ar"]')).toBeVisible();

  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('#cut-image, #thumb-grid img[src]'));
    return images.length === 10 && images.every((image) => image.complete && image.naturalWidth > 0);
  });

  const imageSources = await page.locator('#cut-image, #thumb-grid img[src]').evaluateAll((images) => (
    images.map((image) => image.getAttribute('src'))
  ));
  expect(imageSources).toHaveLength(10);
  expect(imageSources.every((src) => src.includes('../assets/c13/reading-writing/images/cuttoon/'))).toBe(true);

  await page.locator('#next-cut').click();
  await expect(page.locator('#progress-label')).toContainText('2 / 9');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c13-reading-cuttoon-02\.webp$/);

  await page.locator('[data-thumb]').nth(5).click();
  await expect(page.locator('[data-thumb]').nth(5)).toHaveClass(/is-active/);
  await expect(page.locator('#progress-label')).toContainText('6 / 9');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c13-reading-cuttoon-06\.webp$/);

  await page.locator('[data-sentence]').nth(7).click();
  await expect(page.locator('[data-sentence]').nth(7)).toHaveClass(/is-active/);
  await expect(page.locator('#progress-label')).toContainText('8 / 9');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c13-reading-cuttoon-08\.webp$/);

  const bazaarTarget = page.locator('[data-vocab-id]').filter({ hasText: '바자회' }).first();
  await expect(bazaarTarget).toBeVisible();
  await bazaarTarget.click();
  await expect(page.locator('#vocab-word')).toContainText('바자회');
  await expect(page.locator('#vocab-example')).toContainText('동물 사랑 바자회');
  const koreanMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(koreanMeaning.length).toBeGreaterThan(0);

  await page.locator('[data-meaning-lang-option="en"]').click();
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'ltr');
  const englishMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(englishMeaning.length).toBeGreaterThan(0);
  expect(englishMeaning).not.toBe(koreanMeaning);

  await page.locator('[data-meaning-lang-option="ar"]').click();
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'rtl');
  const arabicMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(arabicMeaning.length).toBeGreaterThan(0);
  expect(arabicMeaning).not.toBe(englishMeaning);

  const storedLang = await page.evaluate(() => localStorage.getItem('preferred-lang'));
  expect(storedLang).toBe('ar');
});

test('c13 reading cuttoon keeps the active cut visible while reading on a phone', async ({ page }) => {
  await blockExternalRequests(page);
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/c13/reading-cuttoon.html', { waitUntil: 'domcontentloaded' });

  const overlay = page.locator('[data-mobile-cut-overlay]');
  const overlayImage = page.locator('#mobile-cut-image');
  const overlayProgress = page.locator('#mobile-cut-progress');
  const overlayToggle = page.locator('#mobile-cut-toggle');

  await expect(overlay).not.toHaveClass(/is-visible/);
  await expect(overlay).toHaveCSS('opacity', '0');
  await expect(overlayProgress).toContainText('1 / 9');
  await expect(overlayImage).toHaveAttribute('src', /c13-reading-cuttoon-01\.webp$/);
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('#cut-image, #mobile-cut-image, #thumb-grid img[src]'));
    return images.length === 11 && images.every((image) => image.complete && image.naturalWidth > 0);
  });

  const targetSentence = page.locator('[data-sentence]').nth(7);
  await targetSentence.evaluate((node) => {
    node.scrollIntoView({ block: 'center', inline: 'nearest' });
    window.dispatchEvent(new Event('scroll'));
  });
  await targetSentence.click();
  await expect(overlay).toHaveClass(/is-visible/);
  await expect(overlay).toHaveCSS('opacity', '1');
  await expect(overlayProgress).toContainText('8 / 9');
  await expect(overlayImage).toHaveAttribute('src', /c13-reading-cuttoon-08\.webp$/);
  await expect(targetSentence).toHaveClass(/is-active/);

  const overlayBox = await overlay.boundingBox();
  expect(overlayBox).not.toBeNull();
  expect(overlayBox.x).toBeGreaterThanOrEqual(0);
  expect(overlayBox.y).toBeGreaterThanOrEqual(0);
  expect(overlayBox.x + overlayBox.width).toBeLessThanOrEqual(390);
  expect(overlayBox.y + overlayBox.height).toBeLessThanOrEqual(844);

  await overlayToggle.click();
  await expect(overlay).toHaveClass(/is-collapsed/);
  await expect(overlayToggle).toHaveAttribute('aria-expanded', 'false');

  await overlayToggle.click();
  await expect(overlay).not.toHaveClass(/is-collapsed/);
  await expect(overlayToggle).toHaveAttribute('aria-expanded', 'true');
});
