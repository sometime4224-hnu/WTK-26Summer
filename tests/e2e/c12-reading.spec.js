const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

async function answerMultipleChoiceCorrectly(question) {
  const choices = question.locator('[data-choice]');
  const choiceCount = await choices.count();

  for (let index = 0; index < choiceCount; index += 1) {
    const choice = choices.nth(index);
    await choice.click();

    const questionClass = (await question.getAttribute('class')) || '';
    const choiceClass = (await choice.getAttribute('class')) || '';
    const feedbackText = (await question.locator('[data-feedback]').innerText()).trim();
    const isCorrect = /is-correct|correct-answer/.test(`${questionClass} ${choiceClass}`)
      || /정답|맞았습니다/.test(feedbackText);

    if (isCorrect) {
      return;
    }
  }

  throw new Error('Could not find a correct multiple-choice answer.');
}

test('c12 hub links to reading, reading quiz, reading cuttoon, and cut writing', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  const readingCard = page.locator('article.path-card[data-tone="reading"]').filter({ hasText: '읽기 활동' });
  await expect(readingCard).toHaveCount(1);
  await expect(readingCard.locator('a[href="reading.html"]')).toContainText('읽기');
  await expect(readingCard.locator('a[href="reading-quiz.html"]')).toContainText('읽기 문제 풀기');
  await expect(readingCard.locator('a[href="reading-cuttoon.html"]')).toContainText('읽기 컷툰 탐색');
  await expect(readingCard.locator('a[href="writing-cut.html"]')).toContainText('컷 쓰기 활동');
});

test('c12 reading page renders passage, quiz checks, and blanks', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c12/reading.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h2').first()).toContainText('여러분의 목 건강은 어떠십니까?');
  await expect(page.locator('body')).toContainText("여러분, '거북목 증후군'에 대해 들어 본 적이 있습니까?");
  await expect(page.locator('body')).toContainText('하루에 5분만 스트레칭을 해도 몸이 좋아지는 것을 느끼실 수 있을 겁니다.');

  await page.getByRole('button', { name: /목 건강을 지키는 스트레칭 방법/ }).click();
  await expect(page.locator('#q1-feedback')).toContainText('정답');

  await page.getByRole('button', { name: /목과 어깨가 아프고 두통이 생긴다/ }).click();
  await expect(page.locator('#q2-feedback')).toContainText('정답');

  await page.locator("[onclick=\"checkOX(this, true, 'ox1')\"]").click();
  await expect(page.locator('#ox1-feedback')).toContainText('정답');

  await page.locator('#blank1').selectOption('correct');
  await page.locator('#blank2').selectOption('correct');
  await expect(page.locator('#blank-feedback')).toContainText('모두 맞았습니다');
});

test('c12 reading quiz page scores answers and resets state', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c12/reading-quiz.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('여러분의 목 건강은 어떠십니까?');
  await expect(page.locator('body')).toContainText('거북처럼 목을 앞으로 길게 빼고 컴퓨터를 봅니다.');
  await expect(page.locator('body')).toContainText('하루에 5분만 스트레칭을 해도 몸이 좋아지는 것을 느끼실 수 있을 겁니다.');
  await expect(page.locator('[data-question-type="mc"]')).toHaveCount(4);
  await expect(page.locator('[data-question-type="mc"] [data-choice]')).toHaveCount(16);
  await expect(page.locator('[data-question-type="short"]')).toHaveCount(1);
  await expect(page.locator('[data-question-type="subjective"]')).toHaveCount(1);

  const multipleChoiceQuestions = page.locator('[data-question-type="mc"]');
  await answerMultipleChoiceCorrectly(multipleChoiceQuestions.nth(0));
  await expect(page.locator('#score-label')).toContainText('1 / 5');

  for (let index = 1; index < 4; index += 1) {
    await answerMultipleChoiceCorrectly(multipleChoiceQuestions.nth(index));
  }

  await page.locator('#short-answer').fill('하루에 5분만 스트레칭');
  await page.locator('#check-short').click();
  await expect(page.locator('#short-feedback')).toContainText(/맞았습니다|정답/);
  await expect(page.locator('#score-label')).toContainText('5 / 5');

  await page.locator('#essay-answer').fill('쉬는 시간마다 고개를 천천히 돌리겠습니다. 짧은 스트레칭도 목 건강을 지키는 데 도움이 되기 때문입니다.');
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

test('c12 reading cuttoon renders 18 cuts and supports vocab and language interactions', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c12/reading-cuttoon.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('여러분의 목 건강은 어떠십니까?');
  await expect(page.locator('[data-thumb]')).toHaveCount(18);
  await expect(page.locator('[data-sentence]')).toHaveCount(18);
  await expect(page.locator('[data-thumb-placeholder]')).toHaveCount(0);
  await expect(page.locator('[data-stage-placeholder]')).toBeHidden();
  await expect(page.locator('#thumb-grid img[src]')).toHaveCount(18);
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /assets\/c12\/reading-writing\/images\/cuttoon\/c12-reading-cuttoon-01\.webp$/);

  const vocabCount = await page.locator('[data-vocab-id]').count();
  expect(vocabCount).toBeGreaterThanOrEqual(12);
  await expect(page.locator('[data-meaning-lang-option]')).toHaveCount(7);
  await expect(page.locator('[data-meaning-lang-option="none"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="en"]')).toBeVisible();
  await expect(page.locator('[data-meaning-lang-option="ar"]')).toBeVisible();

  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('#cut-image, #thumb-grid img[src]'));
    return images.length === 19 && images.every((image) => image.complete && image.naturalWidth > 0);
  });

  const imageSources = await page.locator('#cut-image, #thumb-grid img[src]').evaluateAll((images) => (
    images.map((image) => image.getAttribute('src'))
  ));
  expect(imageSources).toHaveLength(19);
  expect(imageSources.every((src) => src.includes('../assets/c12/reading-writing/images/cuttoon/'))).toBe(true);

  await page.locator('#next-cut').click();
  await expect(page.locator('#progress-label')).toContainText('2 / 18');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c12-reading-cuttoon-02\.webp$/);

  await page.locator('[data-thumb]').nth(9).click();
  await expect(page.locator('[data-thumb]').nth(9)).toHaveClass(/is-active/);
  await expect(page.locator('#progress-label')).toContainText('10 / 18');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c12-reading-cuttoon-10\.webp$/);

  await page.locator('[data-sentence]').nth(14).click();
  await expect(page.locator('[data-sentence]').nth(14)).toHaveClass(/is-active/);
  await expect(page.locator('#progress-label')).toContainText('15 / 18');
  await expect(page.locator('#cut-image')).toHaveAttribute('src', /c12-reading-cuttoon-15\.webp$/);

  const stretchTarget = page.locator('[data-vocab-id]').filter({ hasText: '스트레칭' }).first();
  await expect(stretchTarget).toBeVisible();
  await stretchTarget.click();
  await expect(page.locator('#vocab-word')).toContainText('스트레칭');
  await expect(page.locator('#vocab-example')).toContainText('스트레칭');
  const koreanMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(koreanMeaning.length).toBeGreaterThan(0);

  await page.locator('[data-meaning-lang-option="en"]').click();
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'ltr');
  const englishMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(englishMeaning.length).toBeGreaterThan(0);
  expect(englishMeaning).not.toBe(koreanMeaning);
  await expect(page.locator('#vocab-example')).toContainText('스트레칭');

  await page.locator('[data-meaning-lang-option="ar"]').click();
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#vocab-meaning')).toHaveAttribute('dir', 'rtl');
  const arabicMeaning = (await page.locator('#vocab-meaning').innerText()).trim();
  expect(arabicMeaning.length).toBeGreaterThan(0);
  expect(arabicMeaning).not.toBe(englishMeaning);
  await expect(page.locator('#vocab-example')).toContainText('스트레칭');

  const storedLang = await page.evaluate(() => localStorage.getItem('preferred-lang'));
  expect(storedLang).toBe('ar');
});
