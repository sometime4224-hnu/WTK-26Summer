const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function expectImagesLoad(page, selector) {
  const imageSources = await page.locator(selector).evaluateAll((images) => (
    images.map((image) => image.getAttribute('src')).filter(Boolean)
  ));

  const brokenImages = await page.evaluate(async (sources) => {
    const probes = sources.map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(null);
      image.onerror = () => resolve(src);
      image.src = src;
    }));

    return (await Promise.all(probes)).filter(Boolean);
  }, imageSources);

  expect(brokenImages).toEqual([]);
}

async function placePanel(page, panelId, slotIndex) {
  await page.locator(`.card-bank .picture-card[data-panel-id="${panelId}"]`).click();
  await page.locator(`.drop-slot[data-slot-index="${slotIndex}"]`).click();
}

async function expectSlotPanel(page, slotIndex, panelId) {
  await expect(page.locator(`.drop-slot[data-slot-index="${slotIndex}"] .picture-card`)).toHaveAttribute('data-panel-id', panelId);
}

async function expectNoVietnameseListeningUi(page) {
  await expect(page.locator('[data-action="set-instruction-language"]')).toHaveCount(0);
  await expect(page.locator('[data-quiz-language="vi"]')).toHaveCount(0);
  await expect(page.locator('[data-stage="3"]')).toHaveCount(0);

  const visibleText = await page.locator('body').evaluate((body) => body.innerText);
  expect(visibleText).not.toContain('Tiếng Việt');
  expect(visibleText).not.toContain('한국어 + 베트남어');
  expect(visibleText).not.toContain('sưng');
  expect(visibleText).not.toContain('cơ bụng');
  expect(visibleText).not.toContain('Kiểm tra');
}

test('c12 hub links to upgraded listening student quiz pages', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/index.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('a[href="listening-student-quiz.html"]')).toContainText('듣기 학생 퀴즈');
  await expect(page.locator('a[href="listening1-student-quiz.html"]')).toContainText('듣기 1 경량 컷툰 퀴즈');
  await expect(page.locator('a[href="listening2-student-quiz.html"]')).toContainText('듣기 2 경량 컷툰 퀴즈');
});

test('c12 listening workbooks render transcript lines and PDF quiz prompts', async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto('/c12/listening1.html', { waitUntil: 'domcontentloaded' });
  await expectNoVietnameseListeningUi(page);
  await expect(page.locator('.lw-line-card')).toHaveCount(8);
  await expect(page.locator('.lw-line-card').first()).toContainText('문장 1');
  await expect(page.locator('body')).toContainText('건강 상담');
  await expect(page.locator('body')).toContainText('무슨 프로그램입니까?');
  await expect(page.locator('body')).toContainText('자기 전에 가볍게 스트레칭을 한다.');
  await expect(page.locator('body')).toContainText('Seoul Univ_3B_Trk_30.mp3');
  await expect(page.locator('.lw-cuttoon-card')).toHaveCount(9);
  await expect(page.locator('[data-action="open-cuttoon-fullscreen"]')).toHaveCount(0);
  const listen1Sync = await page.evaluate(() => {
    const lesson = window.LISTENING_WORKBOOK_CONFIG.lessons[0];
    return {
      audioSrc: lesson.audioSrc,
      bodyStart: lesson.audioInstruction.bodyStart,
      firstLine: lesson.transcript[0].text,
      firstChunkStart: lesson.transcript[0].chunks[0].start,
      panels: lesson.cuttoonPanels.length
    };
  });
  expect(listen1Sync.audioSrc).toContain('Seoul Univ_3B_Trk_30.mp3');
  expect(listen1Sync.bodyStart).toBeCloseTo(7.52, 2);
  expect(listen1Sync.firstLine).toContain('건강 상담 시간입니다');
  expect(listen1Sync.firstChunkStart).toBeCloseTo(7.52, 2);
  expect(listen1Sync.panels).toBe(9);

  await page.goto('/c12/listening2.html', { waitUntil: 'domcontentloaded' });
  await expectNoVietnameseListeningUi(page);
  await expect(page.locator('.lw-line-card')).toHaveCount(9);
  await expect(page.locator('.lw-line-card').first()).toContainText('문장 1');
  await expect(page.locator('body')).toContainText('복근');
  await expect(page.locator('body')).toContainText('남자가 말한 내용과 다른 것은 무엇입니까?');
  await expect(page.locator('body')).toContainText('여자 친구가 생겼다.');
  await expect(page.locator('body')).toContainText('Seoul Univ_3B_Trk_31.mp3');
  await expect(page.locator('.lw-cuttoon-card')).toHaveCount(8);
  await expect(page.locator('[data-action="open-cuttoon-fullscreen"][data-lesson-id="track31"]')).toBeVisible();
  const listen2Sync = await page.evaluate(() => {
    const lesson = window.LISTENING_WORKBOOK_CONFIG.lessons[0];
    return {
      audioSrc: lesson.audioSrc,
      bodyStart: lesson.audioInstruction.bodyStart,
      adviceLine: lesson.transcript[5].text,
      panels: lesson.cuttoonPanels.length
    };
  });
  expect(listen2Sync.audioSrc).toContain('Seoul Univ_3B_Trk_31.mp3');
  expect(listen2Sync.bodyStart).toBeCloseTo(7.8, 2);
  expect(listen2Sync.adviceLine).toContain('윗몸 일으키기만');
  expect(listen2Sync.panels).toBe(8);
});

test('c12 listening audio sync highlights cuttoon panels and supports seek clicks', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/listening1.html', { waitUntil: 'domcontentloaded' });

  await page.locator('audio').evaluate((audio) => {
    audio.currentTime = 55;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  await expect(page.locator('.lw-cuttoon-card.is-active')).toContainText('다리 올리고 스트레칭');

  await page.locator('.lw-cuttoon-card').nth(8).click();
  await expect.poll(() => page.locator('audio').evaluate((audio) => audio.currentTime)).toBeGreaterThan(66);

  await page.evaluate(() => {
    localStorage.setItem('korean3b.listening.v3:/c12/listening1.html:track30:listens', '3');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-action="set-stage"][data-lesson-id="track30"][data-stage="2"]').click();
  await expect(page.locator('.lw-line-chunk[data-action="seek-audio"]').first()).toBeVisible();

  await page.locator('.lw-line-chunk[data-action="seek-audio"]').first().click();
  await expect.poll(() => page.locator('audio').evaluate((audio) => audio.currentTime)).toBeLessThan(10);
});

test('c12 listening2 fullscreen cuttoon mode keeps synced playback controls', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c12/listening2.html', { waitUntil: 'domcontentloaded' });

  await page.locator('[data-action="open-cuttoon-fullscreen"][data-lesson-id="track31"]').click();
  const overlay = page.locator('#cuttoon-fullscreen-track31');
  await expect(overlay).toBeVisible();

  const playButton = page.locator('[data-action="toggle-cuttoon-fullscreen-audio"][data-lesson-id="track31"]');
  await expect(playButton).toBeVisible();
  const overlayBox = await overlay.boundingBox();
  const playBox = await playButton.boundingBox();
  expect(overlayBox).not.toBeNull();
  expect(playBox).not.toBeNull();
  expect(playBox.x + playBox.width / 2).toBeGreaterThan(overlayBox.x + overlayBox.width * 0.72);
  expect(playBox.y + playBox.height / 2).toBeGreaterThan(overlayBox.y + overlayBox.height * 0.72);

  await page.locator('audio').evaluate((audio) => {
    audio.currentTime = 45;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  await expect(page.locator('#cuttoon-fullscreen-title-track31')).toContainText('운동과 음식 조언');

  await playButton.click();
  await expect.poll(() => page.locator('audio').evaluate((audio) => audio.paused)).toBe(false);
  await expect(playButton).toHaveClass(/is-playing/);

  await page.locator('[data-action="close-cuttoon-fullscreen"][data-lesson-id="track31"]').click();
  await expect(overlay).toBeHidden();
});

const quizPages = [
  {
    name: 'listening1',
    url: '/c12/listening1-student-quiz.html',
    firstPanel: 'l1-1',
    secondPanel: 'l1-2',
    panelCount: 9,
    prompt: '무슨 프로그램입니까?',
    imagePattern: /assets\/c12\/listening\/cuttoon\/listening1\/listening1-cuttoon-panel-/
  },
  {
    name: 'listening2',
    url: '/c12/listening2-student-quiz.html',
    firstPanel: 'l2-1',
    secondPanel: 'l2-2',
    panelCount: 8,
    prompt: '남자가 말한 내용과 다른 것은 무엇입니까?',
    imagePattern: /assets\/c12\/listening\/cuttoon\/listening2\/listening2-cuttoon-panel-/
  }
];

for (const quizPage of quizPages) {
  test(`c12 ${quizPage.name} student quiz uses lightweight cue cards`, async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto(quizPage.url, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('.drop-slot')).toHaveCount(quizPage.panelCount);
    await expect(page.locator('.picture-card')).toHaveCount(quizPage.panelCount);
    await expect(page.locator('body')).toContainText(quizPage.prompt);
    await expect(page.locator('.picture-card img').first()).toHaveAttribute('src', quizPage.imagePattern);
    await expectImagesLoad(page, '.picture-card img');

    await placePanel(page, quizPage.firstPanel, 0);
    await placePanel(page, quizPage.secondPanel, 1);
    await expectSlotPanel(page, 0, quizPage.firstPanel);
    await expectSlotPanel(page, 1, quizPage.secondPanel);

    await page.locator(`.drop-slot[data-slot-index="0"] .picture-card[data-panel-id="${quizPage.firstPanel}"]`).click();
    await page.locator(`.drop-slot[data-slot-index="1"] .picture-card[data-panel-id="${quizPage.secondPanel}"]`).click();

    await expectSlotPanel(page, 0, quizPage.secondPanel);
    await expectSlotPanel(page, 1, quizPage.firstPanel);

    await page.locator(`.drop-slot[data-slot-index="1"] .picture-card[data-panel-id="${quizPage.firstPanel}"]`).click();
    await page.locator('.drop-slot[data-slot-index="2"]').click();

    await expect(page.locator('.drop-slot[data-slot-index="1"] .empty-slot')).toBeVisible();
    await expectSlotPanel(page, 2, quizPage.firstPanel);
  });
}
