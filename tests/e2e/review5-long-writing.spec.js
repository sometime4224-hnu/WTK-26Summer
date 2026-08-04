const { test, expect } = require('@playwright/test');

test.describe('Review 5 long writing', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('__preserveLongWritingStorage') !== '1') localStorage.clear();
      window.__writingPayloads = [];
      window.HomeworkSubmitter = { submitHomework: async (payload) => { window.__writingPayloads.push(payload); return {}; } };
    });
    await page.goto('/review/review5-html/long-writing.html');
  });

  test('mirrors Korean manuscript text and submits the exact writing shape', async ({ page }) => {
    const writing = '가'.repeat(400);
    await page.locator('#manuscriptInput').fill(writing);
    await expect(page.locator('#characterCount')).toContainText('400 / 400~500자');
    await expect(page.locator('.manuscript-cell').filter({ hasText: '가' })).toHaveCount(400);
    await expect(page.locator('#submitWritingButton')).toBeDisabled();
    await page.locator('#studentName').fill(' 김  학생 ');
    await expect(page.locator('#submitWritingButton')).toBeEnabled();
    await page.locator('#submitWritingButton').click();
    await expect.poll(() => page.evaluate(() => window.__writingPayloads.length)).toBe(1);
    const payload = await page.evaluate(() => window.__writingPayloads[0]);
    expect(Object.keys(payload).sort()).toEqual([
      'assignmentId', 'assignmentTitle', 'chapter', 'sectionId', 'sectionTitle', 'submissionKind',
      'studentName', 'responseText', 'responseCharacterCount', 'minCharacterCount', 'maxCharacterCount',
      'completed', 'clientSubmittedAt', 'signatureHash'
    ].sort());
    expect(payload).toMatchObject({ assignmentId: 'review5-long-writing-v1', submissionKind: 'writing', studentName: '김 학생', responseCharacterCount: 400 });
  });

  test('signs only the normalized assignment and final body, not the learner name', async ({ page }) => {
    const signatures = await page.evaluate(() => {
      const editor = document.getElementById('manuscriptInput');
      const name = document.getElementById('studentName');
      editor.value = '가\r\n나'; name.value = '김학생';
      const first = window.__review5LongWriting.signature(editor.value);
      name.value = '이학생';
      const renamed = window.__review5LongWriting.signature(editor.value);
      editor.value = '가\n다';
      return { first, renamed, changed: window.__review5LongWriting.signature(editor.value) };
    });
    expect(signatures.renamed).toBe(signatures.first);
    expect(signatures.changed).not.toBe(signatures.first);
  });

  test('normalizes line endings, permits 500 characters, and truncates the 501st', async ({ page }) => {
    await page.locator('#manuscriptInput').fill('가'.repeat(500) + '나');
    await expect(page.locator('#manuscriptInput')).toHaveValue('가'.repeat(500));
    await expect(page.locator('#characterCount')).toContainText('500 / 400~500자');
    const result = await page.evaluate(() => ({ lf: window.__review5LongWriting.normalize('가\r\n나'), count: window.__review5LongWriting.count('가\n 나') }));
    expect(result).toEqual({ lf: '가\n나', count: 3 });
  });

  test('opens and closes mobile help without horizontal overflow', async ({ page }) => {
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/review/review5-html/long-writing.html');
      expect(await page.locator('link[href="assets/long-writing.css?v=review5-v2"]').count()).toBe(1);
      expect(await page.evaluate(() => Array.from(document.scripts, (script) => script.getAttribute('src')))).toEqual(expect.arrayContaining([
        'assets/data.js?v=review5-v2',
        'assets/long-writing.js?v=review5-v2'
      ]));
      await expect(page.locator('#writingHelp')).toHaveAttribute('aria-hidden', 'true');
      await expect.poll(() => page.locator('#writingHelp').evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= window.innerHeight || rect.bottom <= 0;
      })).toBeTruthy();
      await page.locator('#helpOpenButton').click();
      await expect(page.locator('#writingHelp')).toHaveAttribute('aria-hidden', 'false');
      await expect.poll(() => page.locator('#writingHelp').evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      })).toBeTruthy();
      await page.keyboard.press('Escape');
      await expect(page.locator('#writingHelp')).toHaveAttribute('aria-hidden', 'true');
      await expect.poll(() => page.locator('#writingHelp').evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top >= window.innerHeight || rect.bottom <= 0;
      })).toBeTruthy();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });

  test('keeps corrupt and unknown-version raw records byte-for-byte while autosaving a fallback', async ({ page }) => {
    for (const raw of ['{not valid json}', '{"version":3,"responseText":"원본 <raw>"}']) {
      await page.addInitScript(({ storageKey, record }) => {
        window.__preserveLongWritingStorage = true;
        localStorage.setItem(storageKey, record);
      }, { storageKey: 'review5-long-writing:longWriting:v2', record: raw });
      await page.goto('/review/review5-html/long-writing.html');
      await expect(page.locator('#recoveryNotice')).toBeVisible();
      await page.locator('#studentName').fill('김학생');
      await page.locator('#manuscriptInput').fill('새 글');
      await page.locator('#manuscriptInput').blur();
      await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
      const stored = await page.evaluate(() => ({
        raw: localStorage.getItem('review5-long-writing:longWriting:v2'),
        fallback: localStorage.getItem('review5-long-writing:longWriting:recovery-v2')
      }));
      expect(stored.raw).toBe(raw);
      expect(JSON.parse(stored.fallback)).toMatchObject({ version: 2, studentName: '김학생', responseText: '새 글' });
    }
  });

  test('keeps the old suffix when an over-limit Hangul composition ends in the middle', async ({ page }) => {
    const original = '가'.repeat(250) + '나'.repeat(250);
    await page.locator('#manuscriptInput').fill(original);
    await page.evaluate(() => {
      const editor = document.getElementById('manuscriptInput');
      editor.focus();
      editor.setSelectionRange(250, 250);
      editor.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true, data: '' }));
      editor.value = editor.value.slice(0, 250) + '다' + editor.value.slice(250);
      editor.setSelectionRange(251, 251);
      editor.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '다' }));
    });
    await expect(page.locator('#manuscriptInput')).toHaveValue(original);
    await expect(page.locator('#writingStatus')).toContainText('501번째');
  });

  test('copies the preserved raw recovery value and offers current-state recovery after storage failure', async ({ page }) => {
    const raw = '{"version":99,"private":"그대로 <보존>"}';
    await page.addInitScript(({ storageKey, record }) => {
      window.__preserveLongWritingStorage = true;
      localStorage.setItem(storageKey, record);
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText(value) { window.__copiedWriting = value; return Promise.resolve(); } } });
      URL.createObjectURL = (blob) => { window.__downloadedWritingBlob = blob; return 'blob:writing-test'; };
      HTMLAnchorElement.prototype.click = function () { window.__downloadedWritingName = this.download; };
    }, { storageKey: 'review5-long-writing:longWriting:v2', record: raw });
    await page.goto('/review/review5-html/long-writing.html');
    await page.locator('#copyRecoveryButton').click();
    expect(await page.evaluate(() => window.__copiedWriting)).toBe(raw);
    await page.locator('#downloadRecoveryButton').click();
    expect(await page.evaluate(() => window.__downloadedWritingBlob.text())).toBe(raw);

    await page.evaluate(() => { Storage.prototype.setItem = function () { throw new Error('quota'); }; });
    await page.locator('#planningNotes').fill('계획 메모');
    await page.locator('#planningNotes').blur();
    await expect(page.locator('#saveFailureRecovery')).toBeVisible();
    await page.locator('#copyCurrentRecoveryButton').click();
    expect(await page.evaluate(() => window.__copiedWriting)).toContain('계획 메모');
    expect(await page.evaluate(() => window.__copiedWriting)).toContain('최종 글');
  });

  test('does not clear in-memory work when page-only reset cannot reach storage', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('메모');
    await page.locator('#manuscriptInput').fill('현재 글');
    await page.evaluate(() => {
      localStorage.setItem('unrelated-quiz-progress', 'keep');
      window.confirm = () => true;
      Storage.prototype.removeItem = function () { throw new Error('unavailable'); };
    });
    await page.locator('#resetWritingButton').click();
    await expect(page.locator('#studentName')).toHaveValue('김학생');
    await expect(page.locator('#planningNotes')).toHaveValue('메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('현재 글');
    await expect(page.locator('#writingStatus')).toContainText('초기화하지 못했습니다');
    expect(await page.evaluate(() => localStorage.getItem('unrelated-quiz-progress'))).toBe('keep');
  });

  test('rolls back both writing keys if the second page-only reset deletion fails', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('남아야 할 메모');
    await page.locator('#manuscriptInput').fill('남아야 할 원고');
    await page.waitForTimeout(550);
    await page.locator('#resetWritingButton').focus();
    const storage = await page.evaluate(() => {
      const primaryKey = window.__review5LongWriting.storageKey;
      const fallbackKey = window.__review5LongWriting.fallbackKey;
      localStorage.setItem(primaryKey, 'primary raw bytes');
      localStorage.setItem(fallbackKey, 'fallback raw bytes');
      localStorage.setItem('unrelated-quiz-progress', 'keep');
      window.confirm = () => true;
      const remove = Storage.prototype.removeItem;
      let calls = 0;
      Storage.prototype.removeItem = function (key) {
        calls += 1;
        if (calls === 2) throw new Error('second remove failed');
        return remove.call(this, key);
      };
      return { primaryKey, fallbackKey };
    });
    await page.locator('#resetWritingButton').click();
    await expect(page.locator('#studentName')).toHaveValue('김학생');
    await expect(page.locator('#planningNotes')).toHaveValue('남아야 할 메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('남아야 할 원고');
    await expect(page.locator('#saveFailureRecovery')).toBeVisible();
    expect(await page.evaluate(({ primaryKey, fallbackKey }) => ({
      primary: localStorage.getItem(primaryKey), fallback: localStorage.getItem(fallbackKey), unrelated: localStorage.getItem('unrelated-quiz-progress')
    }), storage)).toEqual({ primary: 'primary raw bytes', fallback: 'fallback raw bytes', unrelated: 'keep' });
  });

  test('keeps memory and recovery controls when reset rollback itself also fails', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('복구할 메모');
    await page.locator('#manuscriptInput').fill('복구할 원고');
    await page.waitForTimeout(550);
    await page.locator('#resetWritingButton').focus();
    const storage = await page.evaluate(() => {
      const primaryKey = window.__review5LongWriting.storageKey;
      const fallbackKey = window.__review5LongWriting.fallbackKey;
      localStorage.setItem(primaryKey, 'primary raw bytes');
      localStorage.setItem(fallbackKey, 'fallback raw bytes');
      localStorage.setItem('unrelated-quiz-progress', 'keep');
      window.confirm = () => true;
      const remove = Storage.prototype.removeItem;
      let calls = 0;
      Storage.prototype.removeItem = function (key) {
        calls += 1;
        if (calls === 2) throw new Error('second remove failed');
        return remove.call(this, key);
      };
      Storage.prototype.setItem = function () { throw new Error('rollback failed'); };
      return { fallbackKey };
    });
    await page.locator('#resetWritingButton').click();
    await expect(page.locator('#studentName')).toHaveValue('김학생');
    await expect(page.locator('#planningNotes')).toHaveValue('복구할 메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('복구할 원고');
    await expect(page.locator('#saveFailureRecovery')).toBeVisible();
    await expect(page.locator('#writingStatus')).toContainText('초기화하지 못했습니다');
    expect(await page.evaluate(({ fallbackKey }) => ({ fallback: localStorage.getItem(fallbackKey), unrelated: localStorage.getItem('unrelated-quiz-progress') }), storage)).toEqual({ fallback: 'fallback raw bytes', unrelated: 'keep' });
  });

  test('a cancelled reset pointer interaction never suppresses autosave', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('취소 뒤에도 저장할 메모');
    await page.locator('#manuscriptInput').fill('취소 뒤에도 저장할 원고');
    await page.locator('#resetWritingButton').dispatchEvent('pointerdown');
    await page.locator('#resetWritingButton').dispatchEvent('pointercancel');
    await page.locator('#manuscriptInput').blur();
    await page.waitForTimeout(550);
    await page.evaluate(() => sessionStorage.setItem('__preserveLongWritingStorage', '1'));
    await page.reload();
    await expect(page.locator('#studentName')).toHaveValue('김학생');
    await expect(page.locator('#planningNotes')).toHaveValue('취소 뒤에도 저장할 메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('취소 뒤에도 저장할 원고');
  });

  test('reports copy fallback failure honestly and preserves the current work', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('남아야 할 메모');
    await page.locator('#manuscriptInput').fill('남아야 할 원고');
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText() { return Promise.reject(new Error('blocked')); } } });
      document.execCommand = () => false;
    });
    await page.locator('#copyTextButton').click();
    await expect(page.locator('#writingStatus')).toHaveText('복사하지 못했습니다. 내려받기를 이용하세요.');
    await expect(page.locator('#planningNotes')).toHaveValue('남아야 할 메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('남아야 할 원고');
  });

  test('keeps submission failure and retry success visible while preserving work', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#planningNotes').fill('남겨야 할 메모');
    await page.locator('#manuscriptInput').fill('가'.repeat(400));
    await page.evaluate(() => {
      let attempts = 0;
      window.HomeworkSubmitter = { submitHomework: async (payload) => {
        window.__writingPayloads.push(payload);
        attempts += 1;
        if (attempts === 1) throw new Error('network error from Firebase');
        return {};
      } };
    });
    await page.locator('#submitWritingButton').click();
    await expect(page.locator('#writingStatus')).toHaveText('온라인 제출에 실패했습니다. 원고는 이 기기에 남아 있습니다. 다시 시도하세요.');
    await expect(page.locator('#writingStatus')).not.toContainText('network error from Firebase');
    await expect(page.locator('#submitWritingButton')).toBeEnabled();
    await expect(page.locator('#planningNotes')).toHaveValue('남겨야 할 메모');
    await expect(page.locator('#manuscriptInput')).toHaveValue('가'.repeat(400));
    await page.locator('#submitWritingButton').click();
    await expect(page.locator('#writingStatus')).toHaveText('온라인 제출이 완료되었습니다.');
    expect(await page.evaluate(() => window.__writingPayloads.length)).toBe(2);
  });

  test('allows only one submitter call for rapid double activation', async ({ page }) => {
    await page.locator('#studentName').fill('김학생');
    await page.locator('#manuscriptInput').fill('가'.repeat(400));
    await page.evaluate(() => {
      window.__submitResolve = null;
      window.HomeworkSubmitter = { submitHomework: (payload) => {
        window.__writingPayloads.push(payload);
        return new Promise((resolve) => { window.__submitResolve = resolve; });
      } };
      const button = document.getElementById('submitWritingButton');
      button.click(); button.click();
    });
    expect(await page.evaluate(() => window.__writingPayloads.length)).toBe(1);
    await page.evaluate(() => window.__submitResolve({}));
    await expect(page.locator('#writingStatus')).toHaveText('온라인 제출이 완료되었습니다.');
  });
});
