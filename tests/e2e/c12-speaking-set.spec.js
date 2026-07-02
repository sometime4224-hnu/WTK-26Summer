const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

async function disableSpeechRecognition(page) {
  await page.addInitScript(() => {
    localStorage.removeItem('c12-pronunciation-help-lang');
    Object.defineProperty(window, 'SpeechRecognition', { configurable: true, value: undefined });
    Object.defineProperty(window, 'webkitSpeechRecognition', { configurable: true, value: undefined });
  });
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => (
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  ));
  expect(overflow).toBeLessThanOrEqual(2);
}

test.describe('c12 speaking set', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await disableSpeechRecognition(page);
  });

  test('hub exposes the three public speaking pages and keeps support links elsewhere', async ({ page }) => {
    await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

    const speakingCard = page.locator('article.path-card[data-tone="speaking"]').filter({ hasText: '발음 PRO' });
    await expect(speakingCard).toHaveCount(1);
    await expect(speakingCard.locator('a[href="speaking-pronunciation.html"]')).toContainText('말하기 발음 PRO');
    await expect(speakingCard.locator('a[href="speaking-pair.html"]')).toContainText('건강과 운동 조언 함께하기');
    await expect(speakingCard.locator('a[href="speaking-conversation.html"]')).toContainText('권유하기 회화');
    await expect(speakingCard.locator('a[href="grammar1-2-speaking.html"]')).toHaveCount(0);

    await expect(page.locator('a[href="grammar1-2-speaking.html"]')).toHaveCount(1);
    await expect(page.locator('a[href="vocabulary-speaking.html"]')).toHaveCount(1);

    await page.locator('a[href="speaking-pair.html"]').click();
    await expect(page).toHaveURL(/\/c12\/speaking-pair\.html$/);
  });

  test('pronunciation PRO loads and reaches the speaking step without speech recognition', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/c12/speaking-pronunciation.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('발음 PRO');
    await expect(page.locator('#helpLangStatus')).toContainText('한국어만 표시');
    await expect(page.locator('#heroLangText')).toHaveText('');
    await expect(page.locator('.bubble-q .lang-guide')).toHaveCount(0);
    await expect(page.locator('#progressLabel')).toContainText('1 / 8');
    await expect(page.locator('#mainArea')).toContainText('목을 천천히 돌렸더니');
    await expect(page.locator('#browserWarn')).toContainText('음성 인식');
    await expect(page.locator('.step-guide-item p')).toHaveCount(4);
    await expect(page.locator('.step-guide-item p').first()).toContainText('A 듣기');
    await expect(page.locator('.step-guide-item p').first()).toBeVisible();
    await expect(page.locator('.dialogue-card')).toBeVisible();

    const initialState = await page.evaluate(() => ({
      scrollY: Math.round(window.scrollY),
      hiddenGuideCount: [...document.querySelectorAll('.step-guide-item p')]
        .filter((el) => el.hidden || getComputedStyle(el).display === 'none').length
    }));
    expect(initialState.scrollY).toBe(0);
    expect(initialState.hiddenGuideCount).toBe(0);

    await page.locator('[data-help-lang="en"]').click();
    await expect(page.locator('#helpLangStatus')).toContainText('English help on');
    await expect(page.locator('#heroLangText')).toContainText('Practice pronunciation');
    await expect(page.locator('.bubble-q .lang-guide')).toContainText('How do you feel');
    await expect(page.locator('#stepPanel .step-guide')).toContainText('Press "A 듣기"');

    await page.locator('[data-help-lang="vi"]').click();
    await expect(page.locator('#helpLangStatus')).toContainText('Tiếng Việt');
    await expect(page.locator('#heroLangText')).toContainText('Luyện phát âm');
    await expect(page.locator('.bubble-q .lang-guide')).toContainText('Sau khi xoay cổ');

    await page.locator('[data-help-lang="none"]').click();
    await expect(page.locator('#helpLangStatus')).toContainText('한국어만 표시');
    await expect(page.locator('#heroLangText')).toHaveText('');
    await expect(page.locator('.bubble-q .lang-guide')).toHaveCount(0);

    await page.locator('#speakBtn').click();
    await expect(page.locator('#stepLabel')).toContainText('말하기');
    await expect(page.locator('#micBtn')).toBeVisible();
    await expect(page.locator('#recognizedText')).toContainText('—');

    await page.locator('#micBtn').click();
    await expect(page.locator('#recognizedText')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('pronunciation PRO adapts to tablet portrait without empty guide space', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/c12/speaking-pronunciation.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.step-guide-item p').first()).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const layout = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        const box = element.getBoundingClientRect();
        return {
          top: Math.round(box.top),
          left: Math.round(box.left),
          right: Math.round(box.right),
          width: Math.round(box.width),
          height: Math.round(box.height)
        };
      };
      return {
        scrollY: Math.round(window.scrollY),
        main: rect('main'),
        dialogue: rect('.dialogue-card'),
        stepPanel: rect('#stepPanel'),
        hiddenGuideCount: [...document.querySelectorAll('.step-guide-item p')]
          .filter((el) => el.hidden || getComputedStyle(el).display === 'none').length
      };
    });

    expect(layout.scrollY).toBe(0);
    expect(layout.main.width).toBeGreaterThan(700);
    expect(Math.abs(layout.dialogue.top - layout.stepPanel.top)).toBeLessThanOrEqual(4);
    expect(layout.stepPanel.left).toBeGreaterThan(layout.dialogue.left);
    expect(layout.hiddenGuideCount).toBe(0);
  });

  test('PAIR page supports manual practice when speech recognition is unavailable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/c12/speaking-pair.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('건강과 운동 조언 함께하기');
    await expect(page.locator('#startBtn')).toBeDisabled();
    await expect(page.locator('#micState')).toContainText('음성 인식 미지원');
    await expect(page.locator('#liveTranscript')).toContainText('수동 다음 버튼');
    await expect(page.locator('#progressLabel')).toContainText('1 / 10');
    await expect(page.locator('#scriptList [data-line-index]')).toHaveCount(10);
    await expect(page.locator('.script-line.is-current')).toHaveAttribute('data-line-index', '0');

    await page.locator('#swapSidesBtn').click();
    await expect(page.locator('#leftSpeakerName')).toContainText('민수');
    await expect(page.locator('#rightSpeakerName')).toContainText('리나');

    await page.locator('#nextBtn').click();
    await expect(page.locator('#progressLabel')).toContainText('2 / 10');
    await expect(page.locator('.script-line.is-current')).toHaveAttribute('data-line-index', '1');

    await page.locator('#resetBtn').click();
    await expect(page.locator('#progressLabel')).toContainText('1 / 10');

    for (let index = 0; index < 10; index += 1) {
      await page.locator('#manualDoneBtn').click();
    }

    await expect(page.locator('#summaryPanel')).toHaveClass(/is-visible/);
    await expect(page.locator('#summaryText')).toContainText('10개 문장');
    await expect(page.locator('#progressPercent')).toContainText('100%');
    await expectNoHorizontalOverflow(page);
  });

  test('conversation page moves from model sentence building to speaking fallback and summary', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/c12/speaking-conversation.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('h1')).toContainText('친구에게 자연스럽게 권유하기');
    await expect(page.locator('#phaseBuildBtn')).toBeVisible();
    await expect(page.locator('#phaseSpeakBtn')).toBeDisabled();

    for (let scenario = 1; scenario <= 5; scenario += 1) {
      await expect(page.locator('#draftInput')).toBeVisible();
      await page.locator('#loadTargetBtn').click();
      await expect(page.locator('#workspace')).toContainText('모범 문장을 불러왔어요');
      await expect(page.locator('#toSpeakingBtn')).toBeEnabled();
      await page.locator('#toSpeakingBtn').click();
      await expect(page.locator('#micBtn')).toBeDisabled();
      await expect(page.locator('#workspace')).toContainText('음성 인식');
      await expect(page.locator('#listenSpeakBtn')).toBeVisible();
      await expect(page.locator('#slowSpeakBtn')).toBeVisible();

      await page.locator('#nextScenarioBtn').click();
    }

    await expect(page.locator('#workspace')).toContainText('권유하기 회화 연습을 모두 마쳤어요');
    await expect(page.locator('#restartBtn')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('grammar fusion speaking avoids horizontal overflow through writing and speaking steps', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/c12/grammar1-2-speaking.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#workspace')).toBeVisible();
    await expect(page.locator('#stepTabs')).toBeVisible();
    await expect(page.locator('#cycleTitle')).toBeVisible();
    await expect(page.locator('#overallProgressText')).toBeVisible();
    await expect(page.locator('#builderInput')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.locator('#builderInput').focus();
    const tokens = await page.locator('[data-token]').all();
    await tokens[0].click({ force: true });
    await tokens[1].click({ force: true });
    await expectNoHorizontalOverflow(page);

    await page.locator('#loadTargetBtn').click();
    await page.locator('#nextStageBtn').click({ force: true });
    await expect(page.locator('#builderInput')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.locator('#loadTargetBtn').click();
    await page.locator('#nextStageBtn').click({ force: true });
    await expect(page.locator('#listenBtn')).toBeVisible();
    await expect(page.locator('#slowBtn')).toBeVisible();
    await expect(page.locator('#micBtn')).toBeDisabled();
    await expect(page.locator('#nextSpeechBtn')).toBeEnabled();
    await expectNoHorizontalOverflow(page);

    await page.locator('#nextSpeechBtn').click({ force: true });
    await expect(page.locator('[data-speech-index="1"]')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.locator('#nextSpeechBtn').click({ force: true });
    await expect(page.locator('#builderInput')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
