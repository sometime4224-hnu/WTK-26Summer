const { test, expect } = require('@playwright/test');

const PAGE = '/review/review5-html/listening-transcripts.html';
const KEY = 'snukorean:review5:listening-transcripts:v2:state';
const LEGACY_KEY = 'snukorean:review5:listening-transcripts:v1:state';

async function noOverflow(page) {
  expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
}

test('lists the 14 canonical listening units and links from the listening quiz only', async ({ page }) => {
  await page.goto('/review/review5-html/listening.html');
  await expect(page.getByRole('link', { name: '지문 보며 듣기' })).toHaveCount(1);
  await page.goto('/review/review5-html/confirm.html');
  await expect(page.getByRole('link', { name: '지문 보며 듣기' })).toHaveCount(0);
  await page.goto(PAGE);
  await expect(page.locator('#trackSelect option')).toHaveCount(14);
  await expect(page.locator('#trackSelect option')).toHaveText(['1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번', '9번', '10번', '11번', '12번', '13–14번', '15–16번']);
  const units = await page.evaluate(() => window.__review5TranscriptApp.getUnits());
  expect(units.map((unit) => unit.id)).toEqual(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'l13-14', 'l15-16']);
  expect(units.flatMap((unit) => unit.questionIds)).toEqual(['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'l13', 'l14', 'l15', 'l16']);
});

test('keeps all 198 analyzed phrases aligned with the approved transcript text', async ({ page }) => {
  await page.goto(PAGE);
  const contract = await page.evaluate(() => {
    const data = window.REVIEW5_DATA.sections.listening.questions;
    const alignment = window.REVIEW5_TRANSCRIPT_ALIGNMENT;
    const sourceUnits = [
      ...data.slice(0, 12).map((question) => [question.id, question]),
      ['l13-14', data[12]],
      ['l15-16', data[14]]
    ];
    const errors = [];
    let phraseCount = 0;
    for (const [unitId, question] of sourceUnits) {
      const unit = alignment.units[unitId];
      if (!unit) {
        errors.push(`${unitId}: 정렬 없음`);
        continue;
      }
      if (unit.lines.length !== question.audio.transcript.length) errors.push(`${unitId}: 줄 수 불일치`);
      unit.lines.forEach((phrases, lineIndex) => {
        phraseCount += phrases.length;
        const expected = question.audio.transcript[lineIndex]?.text;
        if (phrases.map((phrase) => phrase[0]).join(' ') !== expected) errors.push(`${unitId}:${lineIndex}: 지문 불일치`);
        phrases.forEach((phrase, phraseIndex) => {
          if (!(typeof phrase[0] === 'string' && phrase[0].length && Number.isFinite(phrase[1]) && Number.isFinite(phrase[2]) && phrase[2] > phrase[1])) {
            errors.push(`${unitId}:${lineIndex}:${phraseIndex}: 잘못된 구`);
          }
        });
      });
    }
    return { version: alignment.version, method: alignment.method, unitCount: Object.keys(alignment.units).length, phraseCount, errors };
  });
  expect(contract).toEqual({
    version: 1,
    method: 'faster-whisper-word-timestamps-refined-with-silero-vad',
    unitCount: 14,
    phraseCount: 198,
    errors: []
  });
});

test('reuses the listening questions for a saved quick quiz with immediate feedback', async ({ page }) => {
  await page.goto(PAGE);
  await expect(page.getByRole('heading', { name: '간이 문제 풀기' })).toBeVisible();
  await expect(page.locator('[data-practice-question="l1"]')).toHaveCount(1);
  await expect(page.locator('[data-practice-question="l1"] .practice-option')).toHaveCount(4);
  await expect(page.locator('[data-practice-question="l1"] img')).toHaveCount(4);

  await page.locator('[data-practice-question="l1"] .practice-option').first().click();
  await expect(page.locator('[data-practice-question="l1"] .practice-feedback')).toContainText('다시 확인해 보세요.');
  await expect(page.locator('[data-practice-question="l1"] .practice-feedback')).toContainText('정답: 넥타이를 찾는 사람들');
  await page.locator('[data-practice-question="l1"] .practice-option').nth(1).focus();
  await page.locator('[data-practice-question="l1"] .practice-option').nth(1).press('Enter');
  await expect(page.locator('[data-practice-question="l1"] .practice-feedback')).toContainText('정답입니다.');
  await page.reload();
  await expect(page.locator('[data-practice-question="l1"] .practice-option').nth(1)).toHaveAttribute('aria-pressed', 'true');

  await page.selectOption('#trackSelect', 'l13-14');
  await expect(page.locator('.practice-question')).toHaveCount(2);
  await expect(page.locator('.practice-question').first()).toContainText('여자는 누구입니까?');
  await expect(page.locator('.practice-question').nth(1)).toContainText('들은 내용과 맞는 것을 고르십시오.');
});

test('uses analyzed phrase cues, highlights the current phrase, and seeks from phrase buttons', async ({ page }) => {
  await page.goto(PAGE);
  const units = await page.evaluate(() => window.__review5TranscriptApp.getUnits());
  for (const unit of units) {
    await page.selectOption('#trackSelect', unit.id);
    await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && audio.duration)).toBeTruthy();
    const verification = await page.evaluate((unit) => {
      const duration = document.querySelector('#transcriptAudio').duration;
      const app = window.__review5TranscriptApp;
      const cues = app.getCues(unit.id, duration);
      return { duration, cues, active: cues.map((cue) => app.getActiveIndex(unit.id, (cue.start + cue.end) / 2, duration)), before: app.getActiveIndex(unit.id, 0, duration), after: app.getActiveIndex(unit.id, cues.at(-1).end + .01, duration) };
    }, unit);
    expect(verification.cues).toHaveLength(unit.phraseCount);
    expect(verification.cues.length).toBeGreaterThan(unit.transcriptLength);
    expect(verification.cues[0].start).toBeGreaterThan(0);
    expect(verification.cues.at(-1).end).toBeLessThan(verification.duration);
    for (let index = 0; index < verification.cues.length; index += 1) {
      expect(verification.cues[index].end).toBeGreaterThan(verification.cues[index].start);
      if (index) expect(verification.cues[index].start).toBeGreaterThanOrEqual(verification.cues[index - 1].end);
    }
    expect(verification.active).toEqual(verification.cues.map((cue) => cue.index));
    expect(verification.before).toBe(-1);
    expect(verification.after).toBe(-1);
  }
  await page.selectOption('#trackSelect', 'l1');
  await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && audio.duration)).toBeTruthy();
  await page.evaluate(() => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = 0;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  await expect(page.locator('.transcript-phrase.is-current')).toHaveCount(0);
  const l1Cues = await page.evaluate(() => {
    const duration = document.querySelector('#transcriptAudio').duration;
    return window.__review5TranscriptApp.getCues('l1', duration);
  });
  await page.evaluate((cue) => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = (cue.start + cue.end) / 2;
    audio.dispatchEvent(new Event('timeupdate'));
  }, l1Cues[0]);
  await expect(page.locator('.transcript-phrase.is-current')).toHaveCount(1);
  await expect(page.locator('.transcript-phrase.is-current')).toHaveAttribute('aria-current', 'true');
  await page.locator('.transcript-phrase').nth(1).focus();
  await page.locator('.transcript-phrase').nth(1).press('Enter');
  await expect.poll(() => page.locator('.transcript-phrase.is-current').evaluate((node) => node.getAttribute('data-cue-index'))).toBe('1');
  await page.evaluate(() => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = audio.duration;
    audio.dispatchEvent(new Event('ended'));
  });
  await expect(page.locator('.transcript-phrase.is-current')).toHaveCount(0);
});

test('precise l1 and l7 boundaries leave instructions silent and replace the old late cues', async ({ page }) => {
  await page.goto(PAGE);
  await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && audio.duration)).toBeTruthy();
  await page.evaluate(() => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = 5;
    audio.dispatchEvent(new Event('timeupdate'));
  });
  await expect(page.locator('.transcript-phrase.is-current')).toHaveCount(0);
  const cues = await page.evaluate(() => window.__review5TranscriptApp.getCues('l1', document.querySelector('#transcriptAudio').duration));
  expect(cues[0].start).toBeGreaterThan(8.2);
  expect(cues[0].start).toBeLessThan(9.2);
  await page.evaluate((cue) => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = (cue.start + cue.end) / 2;
    audio.dispatchEvent(new Event('timeupdate'));
  }, cues[0]);
  await expect(page.locator('.transcript-phrase.is-current')).toHaveAttribute('data-cue-index', '0');
  await expect(page.locator('.transcript-phrase.is-current')).toContainText('여보, 저기 옷장에서 까만');
  await page.evaluate((cue) => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = (cue.start + cue.end) / 2;
    audio.dispatchEvent(new Event('timeupdate'));
  }, cues[2]);
  await expect(page.locator('.transcript-phrase.is-current')).toHaveAttribute('data-cue-index', '2');

  await page.selectOption('#trackSelect', 'l7');
  await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && audio.duration)).toBeTruthy();
  const l7Cues = await page.evaluate(() => window.__review5TranscriptApp.getCues('l7', document.querySelector('#transcriptAudio').duration));
  expect(l7Cues[0].start).toBeGreaterThan(1.1);
  expect(l7Cues[0].start).toBeLessThan(1.6);
});

test('clears phrase emphasis during a real pause between analyzed phrases', async ({ page }) => {
  await page.goto(PAGE);
  await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && audio.duration)).toBeTruthy();
  const gapTime = await page.evaluate(() => {
    const audio = document.querySelector('#transcriptAudio');
    const cues = window.__review5TranscriptApp.getCues('l1', audio.duration);
    const gapIndex = cues.findIndex((cue, index) => index && cue.start - cues[index - 1].end > .3);
    return (cues[gapIndex - 1].end + cues[gapIndex].start) / 2;
  });
  await page.evaluate((time) => {
    const audio = document.querySelector('#transcriptAudio');
    audio.currentTime = time;
    audio.dispatchEvent(new Event('timeupdate'));
  }, gapTime);
  await expect(page.locator('.transcript-phrase.is-current')).toHaveCount(0);
});

test('loads metadata for every canonical audio asset without browser errors', async ({ page }) => {
  const errors = [];
  const audioResponses = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.url().includes('/review5-html/assets/audio/')) audioResponses.push(response.status()); });
  await page.goto(PAGE);
  const units = await page.locator('#trackSelect option').evaluateAll((options) => options.map((option) => option.value));
  for (const unit of units) {
    await page.selectOption('#trackSelect', unit);
    await expect.poll(() => page.locator('#transcriptAudio').evaluate((audio) => audio.readyState >= 1 && Number.isFinite(audio.duration) && audio.duration > 0)).toBe(true);
  }
  expect(audioResponses.length).toBeGreaterThanOrEqual(units.length);
  expect(audioResponses.every((status) => status === 200 || status === 206)).toBe(true);
  expect(errors).toEqual([]);
});

test('restores valid transcript-page state', async ({ page }) => {
  await page.addInitScript(([key]) => localStorage.setItem(key, JSON.stringify({ schemaVersion: 2, unitId: 'l3', position: 2, playbackRate: 1, answers: { l3: '4' }, updatedAt: Date.now() })), [KEY]);
  await page.goto(PAGE);
  await expect(page.locator('#trackSelect')).toHaveValue('l3');
  await expect(page.locator('[data-practice-question="l3"] .practice-option[data-choice-id="4"]')).toHaveAttribute('aria-pressed', 'true');
});

test('migrates a compatible v1 state without deleting the legacy record', async ({ page }) => {
  const legacy = JSON.stringify({ schemaVersion: 1, unitId: 'l6', position: 3, playbackRate: 1, updatedAt: 123 });
  await page.addInitScript(([key, raw]) => localStorage.setItem(key, raw), [LEGACY_KEY, legacy]);
  await page.goto(PAGE);
  await expect(page.locator('#trackSelect')).toHaveValue('l6');
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)).schemaVersion, KEY)).toBe(2);
  expect(await page.evaluate((key) => localStorage.getItem(key), LEGACY_KEY)).toBe(legacy);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).answers, KEY)).toEqual({});
});

test('preserves malformed or unknown-version records until confirmed reset', async ({ page }) => {
  const raw = '{"schemaVersion":99,"unitId":"l1"}';
  await page.goto('/review/review5-html/index.html');
  await page.evaluate(([key, value]) => {
    localStorage.setItem(key, value);
    localStorage.setItem('snukorean:review5:unrelated', '보존');
  }, [KEY, raw]);
  await page.goto(PAGE);
  await expect(page.getByText('저장된 기록을 안전하게 읽지 못해 그대로 보관하고 있습니다.')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(raw);
  await page.getByRole('button', { name: '이 페이지 저장 기록 초기화' }).click();
  await page.getByRole('button', { name: '정말 이 페이지만 초기화' }).click();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), KEY)).not.toBe(raw);
  expect(await page.evaluate(() => localStorage.getItem('snukorean:review5:unrelated'))).toBe('보존');
});

for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 844 }, { width: 1440, height: 900 }]) {
  test(`transcript page keeps its first action visible at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(PAGE);
    await expect(page.locator('#trackSelect')).toBeVisible();
    await expect(page.locator('#transcriptAudio')).toBeVisible();
    await noOverflow(page);
  });
}

test('200% zoom equivalent keeps the track chooser and native audio control reachable', async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto(PAGE);
  const select = await page.locator('#trackSelect').boundingBox();
  const audio = await page.locator('#transcriptAudio').boundingBox();
  expect(select.y).toBeGreaterThanOrEqual(0);
  expect(audio.y + audio.height).toBeLessThanOrEqual(450);
  await page.locator('#trackSelect').focus();
  await noOverflow(page);
});
