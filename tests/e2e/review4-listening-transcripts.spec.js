const fs = require('node:fs');
const path = require('node:path');
const { test, expect } = require('@playwright/test');

test.describe('Review 4 listening transcript audio page', () => {
  test('links to the transcript audio page from the listening start screen', async ({ page }) => {
    await page.goto('/review/review4-html/listening.html', { waitUntil: 'load' });

    const transcriptLink = page.getByRole('link', { name: '듣기 지문 보기' });
    await expect(transcriptLink).toBeVisible();
    await expect(transcriptLink).toContainText('듣기 지문 보기');
    await expect(page.locator('#listeningTranscriptFallback')).toBeHidden();

    await transcriptLink.click();
    await expect(page).toHaveURL(/listening-transcripts\.html$/);
    await expect(page.getByRole('heading', { name: '듣기 지문과 원음' })).toBeVisible();
  });

  test('renders all transcript cards with original audio clips', async ({ page }) => {
    await page.goto('/review/review4-html/listening-transcripts.html', { waitUntil: 'load' });

    await expect(page.locator('.app-shell')).toBeVisible();
    await expect(page.locator('.transcript-card')).toHaveCount(16);
    await expect(page.locator('.practice-panel')).toHaveCount(16);
    await expect(page.locator('audio')).toHaveCount(16);
    await expect(page.locator('audio').first()).toHaveAttribute('preload', 'none');
    await expect(page.locator('body')).toContainText('직장인들이 가장 싫어하는 회식');
    await expect(page.locator('body')).toContainText('은행장님, 우리나라에서 여성이 은행장이 되신 것은 처음인데요.');
    await expect(page.locator('#l1 .transcript-lines')).toBeVisible();
    await expect(page.locator('#l1 .practice-panel')).toBeVisible();

    const transcriptBeforePractice = await page.locator('#l1').evaluate((card) => {
      const transcript = card.querySelector('.transcript-lines');
      const practice = card.querySelector('.practice-panel');
      return Boolean(transcript && practice && transcript.compareDocumentPosition(practice) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(transcriptBeforePractice).toBe(true);

    const clips = await page.evaluate(() => window.REVIEW4_ORIGINAL_AUDIO.clips);
    expect(clips).toHaveLength(16);
    expect(clips[0]).toMatchObject({
      id: 'l1',
      file: 'assets/audio/original/l01.mp3'
    });
    expect(clips[12].file).toContain('l13.mp3');
    expect(clips[13].file).toContain('l14.mp3');
    expect(clips[12].start).toBe(clips[13].start);
    expect(clips[14].start).toBe(clips[15].start);

    const pageRoot = path.resolve(__dirname, '..', '..', 'review', 'review4-html');
    for (const clip of clips) {
      const filePath = path.join(pageRoot, clip.file);
      expect(fs.existsSync(filePath), `${clip.file} should exist`).toBeTruthy();
      expect(fs.statSync(filePath).size, `${clip.file} should not be empty`).toBeGreaterThan(1000);
    }
  });

  test('checks lightweight practice answers without submission', async ({ page }) => {
    await page.goto('/review/review4-html/listening-transcripts.html', { waitUntil: 'load' });

    const card = page.locator('#l3');
    await card.getByRole('button', { name: /졸업을 한다고/ }).click();
    await expect(card.locator('.practice-feedback')).toHaveClass(/wrong/);
    await expect(card.locator('.practice-feedback')).toContainText('오답');
    await expect(page.locator('.practice-summary')).toContainText('0 / 1');

    await card.getByRole('button', { name: /외국 회사에 취직할 생각이야/ }).click();
    await expect(card.locator('.practice-feedback')).toHaveClass(/correct/);
    await expect(card.locator('.practice-feedback')).toContainText('정답');
    await expect(page.locator('.practice-summary')).toContainText('1 / 1');

    await page.getByRole('button', { name: '초기화' }).click();
    await expect(page.locator('.practice-summary')).toContainText('0 / 0');
    await expect(card.locator('.practice-hint')).toContainText('선택하면 바로 정오 판정');
  });

  test('fits the transcript page on mobile and desktop', async ({ page }) => {
    for (const viewport of [
      { width: 390, height: 844, layout: 'phone' },
      { width: 1366, height: 768, layout: 'desktop' }
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/review/review4-html/listening-transcripts.html', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-layout', viewport.layout);
      const overflow = await page.evaluate(() => (
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
      ));
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
