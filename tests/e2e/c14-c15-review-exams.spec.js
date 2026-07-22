const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..', '..');

const C14_VOCABULARY = [
  '여유가 있다', '여유가 없다', '활기차다', '평화롭다', '공기가 맑다', '공해가 심하다',
  '따분하다', '시간 가는 줄 모르다', '편의 시설이 잘되어 있다', '불편하다', '정원', '잔디',
  '채소', '농사', '가축', '물고기', '가꾸다', '깎다', '심다', '키우다', '짓다', '잡다',
  '사라지다', '생기다', '변하다', '몰라보다', '상상이 되다', '상상이 안 되다'
];

const C15_VOCABULARY = [
  '수돗물이 안 나오다', '전기가 나가다', '변기가 막히다', '물이 새다', '소음이 심하다',
  '난방이 안 되다', '이상한 냄새가 나다', '물이 안 내려가다', '계약서', '보증금', '포함되다',
  '계약 기간', '공과금', '납부하다', '계약하다', '연체료', '밀리다', '지출', '수입', '늘다',
  '줄다', '아끼다', '절약하다', '낭비하다', '저축하다'
];

const EXAMS = [
  {
    id: 'c14-vocabulary',
    url: '/c14/vocabulary-review-exam.html',
    file: 'c14/vocabulary-review-exam-data.js',
    title: '14과 어휘 복습 시험',
    count: 30,
    slotCounts: [8, 8, 7, 7],
    vocabulary: C14_VOCABULARY,
    contrastCount: 2,
    oldFiles: ['c14/mock-exam-data.js']
  },
  {
    id: 'c14-grammar',
    url: '/c14/grammar-review-exam.html',
    file: 'c14/grammar-review-exam-data.js',
    title: '14과 문법 복습 시험',
    count: 15,
    slotCounts: [4, 4, 4, 3],
    grammarCounts: [3, 4, 4, 4],
    oldFiles: ['c14/mock-exam-data.js']
  },
  {
    id: 'c15-vocabulary',
    url: '/c15/vocabulary-review-exam.html',
    file: 'c15/vocabulary-review-exam-data.js',
    title: '15과 어휘 복습 시험',
    count: 30,
    slotCounts: [8, 8, 7, 7],
    vocabulary: C15_VOCABULARY,
    contrastCount: 5,
    oldFiles: ['c15/mock-exam-data.js', 'c15/mock-exam-2-data.js']
  },
  {
    id: 'c15-grammar',
    url: '/c15/grammar-review-exam.html',
    file: 'c15/grammar-review-exam-data.js',
    title: '15과 문법 복습 시험',
    count: 15,
    slotCounts: [4, 4, 4, 3],
    grammarCounts: [3, 4, 4, 4],
    oldFiles: ['c15/mock-exam-data.js', 'c15/mock-exam-2-data.js']
  }
];

function loadWindowScript(relativePath) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: relativePath });
  return context.window;
}

function normalizeSentence(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function oldQuestionStems(files) {
  return new Set(files.flatMap((file) => {
    const globals = loadWindowScript(file);
    const exam = Object.values(globals)[0];
    return (exam.sections || []).flatMap((section) => section.questions || []).map((question) => (
      normalizeSentence(question.stem)
    ));
  }));
}

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function openFresh(page, exam, seed) {
  await page.goto(`${exam.url}?seed=${seed}`, { waitUntil: 'load' });
  await page.evaluate(() => window.__reviewQuizIbt.clearStorage());
  await page.reload({ waitUntil: 'load' });
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
}

test.describe('C14·C15 과별 복습 시험 데이터', () => {
  for (const exam of EXAMS) {
    test(`${exam.id}: 문항 수·정답·범위 계약이 완전하다`, () => {
      const config = loadWindowScript(exam.file).REVIEW_QUIZ_CONFIG;
      const questions = config.questions;

      expect(config.title).toBe(exam.title);
      expect(questions).toHaveLength(exam.count);
      expect(new Set(questions.map((question) => question.id)).size).toBe(exam.count);
      expect(new Set(questions.map((question) => normalizeSentence(question.prompt))).size).toBe(exam.count);

      for (const question of questions) {
        expect(question.type).toBe('mcq');
        expect(question.answer.trim().length).toBeGreaterThan(0);
        expect(question.distractors).toHaveLength(3);
        expect(new Set([question.answer, ...question.distractors]).size).toBe(4);
        expect(question.explanation.trim().length).toBeGreaterThan(0);
        expect(question.targetSlot).toBeGreaterThanOrEqual(0);
        expect(question.targetSlot).toBeLessThanOrEqual(3);
      }

      const slotCounts = [0, 1, 2, 3].map((slot) => (
        questions.filter((question) => question.targetSlot === slot).length
      ));
      expect(slotCounts).toEqual(exam.slotCounts);

      if (exam.vocabulary) {
        const baseQuestions = questions.filter((question) => Array.isArray(question.targets) && question.targets.length);
        const contrastQuestions = questions.filter((question) => Array.isArray(question.contrastTargets));
        expect(baseQuestions.flatMap((question) => question.targets).sort()).toEqual([...exam.vocabulary].sort());
        expect(contrastQuestions).toHaveLength(exam.contrastCount);
        expect(contrastQuestions.every((question) => question.targets.length === 0)).toBe(true);
      } else {
        const counts = new Map();
        for (const question of questions) {
          expect(typeof question.grammarId).toBe('string');
          expect(question.grammarId.length).toBeGreaterThan(0);
          counts.set(question.grammarId, (counts.get(question.grammarId) || 0) + 1);
        }
        expect(counts.size).toBe(4);
        expect([...counts.values()].sort((a, b) => a - b)).toEqual(exam.grammarCounts);
      }

      const oldStems = oldQuestionStems(exam.oldFiles);
      expect(questions.filter((question) => oldStems.has(normalizeSentence(question.prompt)))).toHaveLength(0);
    });
  }
});

test.describe('C14·C15 과별 복습 시험 브라우저 흐름', () => {
  for (const exam of EXAMS) {
    test(`${exam.id}: 한 문제씩 풀고 만점 채점·복원한다`, async ({ page }) => {
      await blockExternalRequests(page);
      const consoleErrors = [];
      const failedLocalResponses = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('response', (response) => {
        if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) {
          failedLocalResponses.push(`${response.status()} ${response.url()}`);
        }
      });

      await openFresh(page, exam, `flow-${exam.id}`);
      await expect(page.locator('h1')).toHaveText(exam.title);
      await expect(page.locator('.ibt-hero-media')).toHaveCount(0);
      await expect(page.locator('#startIbtButton')).toBeVisible();
      expect(await page.evaluate(() => window.__reviewQuizIbt.getQuestionCounts())).toEqual({
        total: exam.count,
        mcq: exam.count,
        short: 0,
        scaffold: 0
      });

      await page.locator('#startIbtButton').click();
      await expect(page.locator('.ibt-dot-button')).toHaveCount(exam.count);
      await expect(page.locator('[data-ibt-question-card]')).toHaveCount(1);
      await expect(page.locator('.ibt-choice input')).toHaveCount(4);

      await page.evaluate(() => {
        const answers = Object.fromEntries(
          window.__reviewQuizIbt.currentAttempt().questions.map((question) => [question.id, question.answer])
        );
        window.__reviewQuizIbt.setAnswers(answers);
      });
      await page.locator('[data-action="finish"]').click();
      await expect(page.locator('.ibt-result-hero h1')).toHaveText(`${exam.count}/${exam.count}점`);
      await expect(page.locator('.ibt-review-item')).toHaveCount(exam.count);
      await expect(page.locator('.ibt-area-scores span').first()).toBeVisible();

      const records = await page.evaluate(() => {
        const keys = window.__reviewQuizIbt.getStorageKeys();
        return {
          progress: JSON.parse(localStorage.getItem(keys.progressKey)),
          logs: JSON.parse(localStorage.getItem(keys.scoreLogKey))
        };
      });
      expect(records.progress).toMatchObject({ version: 1, quizId: expect.any(String) });
      expect(records.progress.data.completed).toBe(true);
      expect(records.logs).toMatchObject({ version: 1, quizId: expect.any(String) });
      expect(records.logs.entries).toHaveLength(1);

      await page.reload({ waitUntil: 'load' });
      await page.locator('[data-action="show-results"]').click();
      await expect(page.locator('.ibt-result-hero h1')).toHaveText(`${exam.count}/${exam.count}점`);
      expect(consoleErrors).toEqual([]);
      expect(failedLocalResponses).toEqual([]);
    });
  }

  test('미응답을 차단하고 포인터·키보드 이동과 즉시 저장을 지원한다', async ({ page }) => {
    const exam = EXAMS[0];
    await blockExternalRequests(page);
    await openFresh(page, exam, 'input-flow');
    await page.locator('#startIbtButton').click();

    await page.locator('.ibt-choice input').first().focus();
    await page.keyboard.press('Space');
    const firstQuestionId = await page.locator('[data-ibt-question-card]').getAttribute('data-question-id');
    const saved = await page.evaluate(() => window.__reviewQuizIbt.readProgress());
    expect(saved.answers[firstQuestionId]).toBeTruthy();
    expect(saved.answered).toBe(1);

    await page.locator('[data-action="next"]').click();
    await expect(page.locator('.ibt-question-number')).toHaveText('02');
    await page.locator('[data-action="finish"]').click();
    await expect(page.locator('.ibt-notice')).toContainText('2번 문항');
    await expect(page.locator('.ibt-question-number')).toHaveText('02');

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.ibt-question-number')).toHaveText('03');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.ibt-question-number')).toHaveText('02');
  });

  test('시험별 저장 키를 격리하고 부분 진행을 복원한다', async ({ page }) => {
    await blockExternalRequests(page);
    const vocab = EXAMS[0];
    const grammar = EXAMS[1];
    await openFresh(page, vocab, 'isolated-vocab');
    await page.locator('#startIbtButton').click();
    await page.locator('.ibt-choice input').first().check();
    const vocabKeys = await page.evaluate(() => window.__reviewQuizIbt.getStorageKeys());

    await page.goto(`${grammar.url}?seed=isolated-grammar`, { waitUntil: 'load' });
    const grammarKeys = await page.evaluate(() => window.__reviewQuizIbt.getStorageKeys());
    expect(grammarKeys.progressKey).not.toBe(vocabKeys.progressKey);
    await expect(page.locator('#resumeIbtButton')).toHaveCount(0);

    await page.goto(`${vocab.url}?seed=isolated-vocab`, { waitUntil: 'load' });
    await expect(page.locator('#resumeIbtButton')).toBeVisible();
    await page.locator('#resumeIbtButton').click();
    await expect(page.locator('.ibt-choice input:checked')).toHaveCount(1);
  });

  test('손상·미지원 저장값을 보존하고 복사·확인 후 초기화한다', async ({ page }) => {
    const exam = EXAMS[2];
    await blockExternalRequests(page);
    await page.goto(`${exam.url}?seed=recovery`, { waitUntil: 'load' });
    const keys = await page.evaluate(() => window.__reviewQuizIbt.getStorageKeys());
    const unsupported = JSON.stringify({ version: 99, quizId: 'future-record', data: {} });
    await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
      key: keys.progressKey,
      value: unsupported
    });
    await page.reload({ waitUntil: 'load' });

    await expect(page.locator('.ibt-storage-status')).toContainText('지원하지 않는 버전');
    await page.locator('#startIbtButton').click();
    await page.locator('.ibt-choice input').first().check();
    expect(await page.evaluate((key) => localStorage.getItem(key), keys.progressKey)).toBe(unsupported);

    await page.locator('[data-action="start"]').click();
    await page.locator('[data-action="copy-storage"]').click();
    await expect(page.locator('.ibt-recovery-text')).toContainText('future-record');
    page.once('dialog', (dialog) => dialog.accept());
    await page.locator('.ibt-storage-status [data-action="reset-storage"]').click();
    expect(await page.evaluate((key) => localStorage.getItem(key), keys.progressKey)).toBeNull();

    await page.evaluate(({ key }) => localStorage.setItem(key, '{broken-json'), { key: keys.progressKey });
    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('.ibt-storage-status')).toContainText('손상');
    expect(await page.evaluate((key) => localStorage.getItem(key), keys.progressKey)).toBe('{broken-json');
  });

  test('저장 실패 중에도 현재 답을 메모리에 유지한다', async ({ page }) => {
    const exam = EXAMS[3];
    await blockExternalRequests(page);
    await openFresh(page, exam, 'write-failure');
    await page.evaluate(() => {
      Storage.prototype.setItem = function setItemBlocked() {
        throw new DOMException('blocked', 'QuotaExceededError');
      };
    });
    await page.locator('#startIbtButton').click();
    await page.locator('.ibt-choice input').first().check();
    await expect(page.locator('.ibt-storage-inline')).toContainText('저장하지 못했습니다');
    await page.locator('[data-action="next"]').click();
    await page.locator('[data-action="prev"]').click();
    await expect(page.locator('.ibt-choice input:checked')).toHaveCount(1);
  });
});

test.describe('C15 허브와 반응형 접근성', () => {
  test('C15 복습 영역에 신규 4개와 기존 모의고사 2개를 유지한다', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c15/index.html', { waitUntil: 'domcontentloaded' });
    const review = page.locator('section[aria-labelledby="review-title"]');
    await expect(review).toBeVisible();
    await expect(review.locator('a[href="../c14/vocabulary-review-exam.html"]')).toHaveCount(1);
    await expect(review.locator('a[href="../c14/grammar-review-exam.html"]')).toHaveCount(1);
    await expect(review.locator('a[href="vocabulary-review-exam.html"]')).toHaveCount(1);
    await expect(review.locator('a[href="grammar-review-exam.html"]')).toHaveCount(1);
    await expect(review.locator('a[href="mock-exam.html"]')).toHaveCount(1);
    await expect(review.locator('a[href="mock-exam-2.html"]')).toHaveCount(1);

    await review.locator('a[href="../c14/vocabulary-review-exam.html"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/c14\/vocabulary-review-exam\.html$/);
    await expect(page.locator('h1')).toHaveText('14과 어휘 복습 시험');
  });

  for (const viewport of [{ width: 320, height: 844 }, { width: 390, height: 844 }]) {
    test(`${viewport.width}×${viewport.height}에서 목표와 시작 행동이 보이고 넘치지 않는다`, async ({ page }) => {
      await blockExternalRequests(page);
      await page.setViewportSize(viewport);
      for (const exam of EXAMS) {
        await page.goto(exam.url, { waitUntil: 'load' });
        const titleBox = await page.locator('h1').boundingBox();
        const startBox = await page.locator('#startIbtButton').boundingBox();
        expect(titleBox.y).toBeLessThanOrEqual(280);
        expect(startBox.y + startBox.height).toBeLessThanOrEqual(viewport.height);
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test('1440×900 200% 확대에서도 시작과 답 선택이 가능하다', async ({ page }) => {
    await blockExternalRequests(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const exam of EXAMS) {
      await page.goto(exam.url, { waitUntil: 'load' });
      await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
      await expect(page.locator('#startIbtButton')).toBeVisible();
      const startBox = await page.locator('#startIbtButton').boundingBox();
      expect(startBox.y + startBox.height).toBeLessThanOrEqual(900);
      await expectNoHorizontalOverflow(page);
      await page.locator('#startIbtButton').click();
      await expect(page.locator('.ibt-choice input').first()).toBeAttached();
      await page.locator('.ibt-choice').first().click();
      await expect(page.locator('.ibt-choice input').first()).toBeChecked();
      await expectNoHorizontalOverflow(page);
    }
  });
});
