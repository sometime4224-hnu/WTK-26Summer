const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

const reviewPages = [
  {
    chapter: '10',
    path: '/c10/review-quiz.html?seed=e2e-c10',
    indexPath: '/c10/index.html',
    title: '10과 어휘·문법 복습'
  },
  {
    chapter: '11',
    path: '/c11/review-quiz.html?seed=e2e-c11',
    indexPath: '/c11/index.html',
    title: '11과 어휘·문법 복습'
  }
];

async function fillAllCorrect(page) {
  await page.evaluate(() => {
    const attempt = window.__reviewQuiz.currentAttempt();
    for (const question of attempt.questions) {
      const card = document.querySelector(`[data-question-id="${question.id}"]`);
      if (!card) continue;

      if (question.type === 'mcq') {
        const input = Array.from(card.querySelectorAll('input[type="radio"]')).find((control) => (
          control.value === question.answer
        ));
        if (input) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (question.type === 'short') {
        const input = card.querySelector('.text-answer');
        input.value = question.answers[0];
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        const textarea = card.querySelector('.scaffold-answer');
        textarea.value = question.example;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
}

test.describe('workbook vocabulary and grammar review quizzes', () => {
  test('render 28-question review pages with balanced multiple-choice answers', async ({ page }) => {
    await blockExternalRequests(page);

    for (const target of reviewPages) {
      await page.goto(target.path, { waitUntil: 'load' });

      await expect(page.locator('h1')).toHaveText(target.title);
      await expect(page.locator('.question-card')).toHaveCount(28);
      await expect(page.locator('.question-card[data-type="mcq"]')).toHaveCount(16);
      await expect(page.locator('.question-card[data-type="short"]')).toHaveCount(8);
      await expect(page.locator('.question-card[data-type="scaffold"]')).toHaveCount(4);
      await expect(page.locator('#clearScoreLogsButton')).toHaveCount(0);
      await expect(page.locator('#bottomCheckAllButton')).toBeAttached();

      const audit = await page.evaluate(() => {
        const seeds = ['alpha', 'beta', 'gamma', 'delta'];
        const source = JSON.stringify(window.__reviewQuiz.config);
        const cards = Array.from(document.querySelectorAll('.question-card'));
        const bottomButton = document.querySelector('#bottomCheckAllButton');
        const lastCard = cards[cards.length - 1];
        return {
          counts: window.__reviewQuiz.getQuestionCounts(),
          currentSlots: window.__reviewQuiz.getAnswerSlotCounts(),
          seededSlots: seeds.map((seed) => window.__reviewQuiz.getAnswerSlotCounts(
            window.__reviewQuiz.buildAttempt(seed)
          )),
          looseNominalDunjiAnswers: /어떤 일이든지|\"일이든지\"/.test(source),
          bottomButtonAfterLastQuestion: Boolean(
            lastCard && bottomButton && (lastCard.compareDocumentPosition(bottomButton) & Node.DOCUMENT_POSITION_FOLLOWING)
          ),
          imageLoaded: (() => {
            const image = document.querySelector('.review-media img');
            return image.complete && image.naturalWidth > 0;
          })()
        };
      });

      expect(audit.counts).toEqual({ total: 28, mcq: 16, short: 8, scaffold: 4 });
      expect(audit.currentSlots).toEqual({ A: 4, B: 4, C: 4, D: 4 });
      expect(audit.seededSlots).toEqual([
        { A: 4, B: 4, C: 4, D: 4 },
        { A: 4, B: 4, C: 4, D: 4 },
        { A: 4, B: 4, C: 4, D: 4 },
        { A: 4, B: 4, C: 4, D: 4 }
      ]);
      expect(audit.bottomButtonAfterLastQuestion).toBe(true);
      if (target.chapter === '11') {
        expect(audit.looseNominalDunjiAnswers).toBe(false);
      }
      expect(audit.imageLoaded).toBe(true);
    }
  });

  test('grades multiple-choice, short-answer, and scaffolded answers', async ({ page }) => {
    await blockExternalRequests(page);

    for (const target of reviewPages) {
      await page.goto(target.path, { waitUntil: 'load' });

      const sample = await page.evaluate(() => {
        const attempt = window.__reviewQuiz.currentAttempt();
        const mcq = attempt.questions.find((question) => question.type === 'mcq');
        const short = attempt.questions.find((question) => question.type === 'short');
        const scaffold = attempt.questions.find((question) => question.type === 'scaffold');
        return {
          mcqId: mcq.id,
          shortId: short.id,
          shortAnswer: short.answers[0],
          scaffoldId: scaffold.id,
          scaffoldAnswer: scaffold.example,
          directWrong: {
            mcq: window.__reviewQuiz.gradeAnswer(mcq, '__wrong__').ok,
            short: window.__reviewQuiz.gradeAnswer(short, '__wrong__').ok,
            scaffold: window.__reviewQuiz.gradeAnswer(scaffold, '__wrong__').ok
          }
        };
      });

      expect(sample.directWrong).toEqual({ mcq: false, short: false, scaffold: false });

      await page.locator(`[data-question-id="${sample.mcqId}"] [data-correct="true"] input`).check();
      await page.locator(`[data-question-id="${sample.shortId}"] .text-answer`).fill(sample.shortAnswer);
      await page.locator(`[data-question-id="${sample.scaffoldId}"] .scaffold-answer`).fill(sample.scaffoldAnswer);
      await page.locator('#checkAllButton').click();

      await expect(page.locator('#scoreMain')).toHaveText('3 / 28점');
      await expect(page.locator(`[data-question-id="${sample.mcqId}"]`)).toHaveClass(/is-correct/);
      await expect(page.locator(`[data-question-id="${sample.shortId}"]`)).toHaveClass(/is-correct/);
      await expect(page.locator(`[data-question-id="${sample.scaffoldId}"]`)).toHaveClass(/is-correct/);
      await expect(page.locator(`[data-question-id="${sample.scaffoldId}"] .required-list li.is-met`)).not.toHaveCount(0);

      if (target.chapter === '11') {
        const dunjiAudit = await page.evaluate(() => {
          const attempt = window.__reviewQuiz.currentAttempt();
          const mcq = attempt.questions.find((question) => question.id === 'c11-mcq-16');
          const short = attempt.questions.find((question) => question.id === 'c11-short-24');
          const scaffold = attempt.questions.find((question) => question.id === 'c11-scaffold-28');
          return {
            mcqAnswer: mcq.answer,
            shortAnswers: short.answers,
            missingDunji: window.__reviewQuiz.gradeAnswer(scaffold, '만약 그 회사에 들어간다면 열심히 하겠습니다. 무슨 일도 하겠습니다.').ok,
            missingMuseun: window.__reviewQuiz.gradeAnswer(scaffold, '만약 그 회사에 들어간다면 열심히 하겠습니다. 일이든지 하겠습니다.').ok,
            exactForm: window.__reviewQuiz.gradeAnswer(scaffold, scaffold.example).ok
          };
        });
        expect(dunjiAudit.mcqAnswer).toBe('무엇이든지');
        expect(dunjiAudit.shortAnswers).toEqual(['무슨 일이든지']);
        expect(dunjiAudit.missingDunji).toBe(false);
        expect(dunjiAudit.missingMuseun).toBe(false);
        expect(dunjiAudit.exactForm).toBe(true);

        const causativeHintAudit = await page.evaluate(() => {
          const card = document.querySelector('[data-question-id="c11-scaffold-27"]');
          const labels = Array.from(card.querySelectorAll('.required-list li')).map((item) => item.textContent.trim());
          return {
            labels,
            hiddenFormsExposed: labels.some((label) => ['입히다', '먹이다', '재우다'].includes(label))
          };
        });
        expect(causativeHintAudit.labels).toEqual(['입다', '먹다', '자다']);
        expect(causativeHintAudit.hiddenFormsExposed).toBe(false);
      }
    }
  });

  test('review pages are reachable from chapter hubs', async ({ page }) => {
    await blockExternalRequests(page);

    for (const target of reviewPages) {
      await page.goto(target.indexPath, { waitUntil: 'domcontentloaded' });
      const link = page.locator('a[href="review-quiz.html"]').first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/c${target.chapter}/review-quiz\\.html$`));
      await expect(page.locator('h1')).toHaveText(target.title);
    }
  });

  test('review pages fit mobile without horizontal overflow', async ({ page }) => {
    await blockExternalRequests(page);
    await page.setViewportSize({ width: 390, height: 844 });

    for (const target of reviewPages) {
      await page.goto(target.path, { waitUntil: 'load' });
      await expect(page.locator('#checkAllButton')).toBeVisible();
      await expect(page.locator('.question-card').first()).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });

  test('saves progress, records score logs by attempt, and shows completion stamp', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c10/review-quiz.html?seed=persist-c10', { waitUntil: 'load' });
    await page.evaluate(() => window.__reviewQuiz.clearStorage());

    const sample = await page.evaluate(() => {
      const attempt = window.__reviewQuiz.currentAttempt();
      const mcq = attempt.questions.find((question) => question.type === 'mcq');
      const short = attempt.questions.find((question) => question.type === 'short');
      return {
        mcqId: mcq.id,
        mcqAnswer: mcq.answer,
        shortId: short.id,
        shortAnswer: short.answers[0],
        keys: window.__reviewQuiz.getStorageKeys()
      };
    });

    await page.locator(`[data-question-id="${sample.mcqId}"] input[value="${sample.mcqAnswer}"]`).check();
    await page.locator(`[data-question-id="${sample.shortId}"] .text-answer`).fill(sample.shortAnswer);

    let stored = await page.evaluate((keys) => JSON.parse(localStorage.getItem(keys.progressKey)), sample.keys);
    expect(stored.answered).toBe(2);
    expect(stored.answers[sample.shortId]).toBe(sample.shortAnswer);

    await page.reload({ waitUntil: 'load' });
    await expect(page.locator(`[data-question-id="${sample.mcqId}"] input[value="${sample.mcqAnswer}"]`)).toBeChecked();
    await expect(page.locator(`[data-question-id="${sample.shortId}"] .text-answer`)).toHaveValue(sample.shortAnswer);
    await expect(page.locator('#completionStamp')).toBeHidden();

    await fillAllCorrect(page);
    await page.locator('#bottomCheckAllButton').click();
    await expect(page.locator('#scoreMain')).toHaveText('28 / 28점');
    await expect(page.locator('#completionStamp')).toBeVisible();
    await expect(page.locator('#completionStamp')).toContainText('잘했어요');
    await expect(page.locator('.score-log-item')).toHaveCount(1);

    let logs = await page.evaluate(() => window.__reviewQuiz.readScoreLogs());
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ score: 28, total: 28, percent: 100 });

    await page.locator('#newAttemptButton').click();
    await fillAllCorrect(page);
    await page.locator('#bottomCheckAllButton').click();
    await expect(page.locator('.score-log-item')).toHaveCount(2);
    await expect(page.locator('.score-log-item').first()).toContainText('2회차');

    logs = await page.evaluate(() => window.__reviewQuiz.readScoreLogs());
    expect(logs).toHaveLength(2);
  });
});
