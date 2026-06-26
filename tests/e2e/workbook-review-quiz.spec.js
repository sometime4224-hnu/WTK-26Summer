const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
  await page.route('https://cdnjs.cloudflare.com/**', (route) => route.abort());
  await page.route('https://cdn.tailwindcss.com/**', (route) => route.abort());
  await page.route('https://www.gstatic.com/firebasejs/**', (route) => route.abort());
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
    title: '10과 어휘·문법 복습',
    expected: { total: 28, mcq: 16, short: 8, scaffold: 4 }
  },
  {
    chapter: '11',
    path: '/c11/review-quiz.html?seed=e2e-c11',
    indexPath: '/c11/index.html',
    title: '11과 어휘·문법 복습',
    expected: { total: 28, mcq: 16, short: 8, scaffold: 4 }
  },
  {
    chapter: '12',
    path: '/c12/review-quiz.html?seed=e2e-c12',
    indexPath: '/c12/index.html',
    title: '12과 어휘·문법 복습',
    expected: { total: 24, mcq: 16, short: 8, scaffold: 0 }
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

async function fillAllWrong(page) {
  await page.evaluate(() => {
    const attempt = window.__reviewQuiz.currentAttempt();
    for (const question of attempt.questions) {
      const card = document.querySelector(`[data-question-id="${question.id}"]`);
      if (!card) continue;

      if (question.type === 'mcq') {
        const input = Array.from(card.querySelectorAll('input[type="radio"]')).find((control) => (
          control.value !== question.answer
        ));
        if (input) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (question.type === 'short') {
        const input = card.querySelector('.text-answer');
        input.value = '__wrong__';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        const textarea = card.querySelector('.scaffold-answer');
        textarea.value = '__wrong__ answer';
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  });
}

async function fillAllCorrectExcept(page, missingIndex) {
  await page.evaluate((targetMissingIndex) => {
    const attempt = window.__reviewQuiz.currentAttempt();
    for (const [index, question] of attempt.questions.entries()) {
      if (index === targetMissingIndex) continue;
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
  }, missingIndex);
}

async function installHomeworkMock(page, options = {}) {
  await page.addInitScript((settings) => {
    window.__homeworkSubmissions = [];
    window.HomeworkSubmitter = {
      async submitHomework(payload) {
        if (settings.fail) {
          throw new Error('mock firebase failure');
        }
        const storedPayload = Object.assign({}, payload, {
          anonymousUid: 'mock-uid',
          submittedAt: 'mock-server-timestamp'
        });
        window.__homeworkSubmissions.push(storedPayload);
        return {
          anonymousUid: 'mock-uid',
          documentId: `mock-uid_${payload.signatureHash}`,
          path: `homeworkAssignments/${payload.assignmentId}/submissions/mock-uid_${payload.signatureHash}`
        };
      }
    };
  }, options);
}

test.describe('workbook vocabulary and grammar review quizzes', () => {
  test('render review pages with balanced multiple-choice answers', async ({ page }) => {
    await blockExternalRequests(page);

    for (const target of reviewPages) {
      await page.goto(target.path, { waitUntil: 'load' });

      await expect(page.locator('h1')).toHaveText(target.title);
      await expect(page.locator('.question-card')).toHaveCount(target.expected.total);
      await expect(page.locator('.question-card[data-type="mcq"]')).toHaveCount(target.expected.mcq);
      await expect(page.locator('.question-card[data-type="short"]')).toHaveCount(target.expected.short);
      await expect(page.locator('.question-card[data-type="scaffold"]')).toHaveCount(target.expected.scaffold);
      await expect(page.locator('[data-section="scaffold"]')).toHaveCount(target.expected.scaffold ? 1 : 0);
      await expect(page.locator('#clearScoreLogsButton')).toHaveCount(0);
      await expect(page.locator('#bottomCheckAllButton')).toBeAttached();
      await expect(page.locator('#bottomCheckAllButton')).toHaveText('완료 / 제출하기');
      await expect(page.locator('#submitHint')).toContainText('자동 저장');
      await expect(page.locator('#studentNameInput')).toHaveCount(target.chapter === '12' ? 1 : 0);
      await expect(page.locator('.homework-panel')).toHaveCount(target.chapter === '12' ? 1 : 0);

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

      expect(audit.counts).toEqual(target.expected);
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
    await installHomeworkMock(page);

    for (const target of reviewPages) {
      await page.goto(target.path, { waitUntil: 'load' });
      if (target.chapter === '12') {
        await page.locator('#studentNameInput').fill('테스트 학생');
      }

      const sample = await page.evaluate(() => {
        const attempt = window.__reviewQuiz.currentAttempt();
        const mcq = attempt.questions.find((question) => question.type === 'mcq');
        const short = attempt.questions.find((question) => question.type === 'short');
        const scaffold = attempt.questions.find((question) => question.type === 'scaffold') || null;
        return {
          mcqId: mcq.id,
          shortId: short.id,
          shortAnswer: short.answers[0],
          scaffoldId: scaffold && scaffold.id,
          scaffoldAnswer: scaffold && scaffold.example,
          directWrong: {
            mcq: window.__reviewQuiz.gradeAnswer(mcq, '__wrong__').ok,
            short: window.__reviewQuiz.gradeAnswer(short, '__wrong__').ok,
            scaffold: scaffold ? window.__reviewQuiz.gradeAnswer(scaffold, '__wrong__').ok : null
          }
        };
      });

      expect(sample.directWrong.mcq).toBe(false);
      expect(sample.directWrong.short).toBe(false);
      if (sample.scaffoldId) {
        expect(sample.directWrong.scaffold).toBe(false);
      }

      await fillAllWrong(page);
      await page.locator(`[data-question-id="${sample.mcqId}"] [data-correct="true"] input`).check();
      await page.locator(`[data-question-id="${sample.shortId}"] .text-answer`).fill(sample.shortAnswer);
      if (sample.scaffoldId) {
        await page.locator(`[data-question-id="${sample.scaffoldId}"] .scaffold-answer`).fill(sample.scaffoldAnswer);
      }
      await page.locator('#checkAllButton').click();

      const expectedCorrect = sample.scaffoldId ? 3 : 2;
      await expect(page.locator('#scoreMain')).toHaveText(`${expectedCorrect} / ${target.expected.total}점`);
      await expect(page.locator(`[data-question-id="${sample.mcqId}"]`)).toHaveClass(/is-correct/);
      await expect(page.locator(`[data-question-id="${sample.shortId}"]`)).toHaveClass(/is-correct/);
      if (sample.scaffoldId) {
        await expect(page.locator(`[data-question-id="${sample.scaffoldId}"]`)).toHaveClass(/is-correct/);
        await expect(page.locator(`[data-question-id="${sample.scaffoldId}"] .required-list li.is-met`)).not.toHaveCount(0);
      }

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

  test('blocks submission with missing answers and scrolls to the first unanswered question', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c12/review-quiz.html?seed=incomplete-c12', { waitUntil: 'load' });
    await page.evaluate(() => window.__reviewQuiz.clearStorage());

    const missingIndex = 16;
    const missingId = await page.evaluate((targetMissingIndex) => (
      window.__reviewQuiz.currentAttempt().questions[targetMissingIndex].id
    ), missingIndex);

    await fillAllCorrectExcept(page, missingIndex);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.locator('#checkAllButton').click();

    await expect(page.locator('#scoreMain')).toContainText('미제출');
    await expect(page.locator('#scoreSub')).toContainText('안 푼 문제 1개');
    await expect(page.locator('#submissionAlert')).toBeVisible();
    await expect(page.locator('#submissionAlert')).toContainText('미제출');
    await expect(page.locator('#submitHint')).toContainText('미제출 상태');
    await expect(page.locator(`[data-question-id="${missingId}"]`)).toHaveClass(/is-first-unanswered/);
    await expect(page.locator(`[data-question-id="${missingId}"] .feedback`)).toContainText('제출할 수 없습니다');
    await expect(page.locator('#completionStamp')).toBeHidden();

    await expect.poll(async () => page.evaluate((questionId) => {
      const card = document.querySelector(`[data-question-id="${questionId}"]`);
      const rect = card.getBoundingClientRect();
      return rect.top >= 70 && rect.top < window.innerHeight - 90;
    }, missingId)).toBe(true);

    const logs = await page.evaluate(() => window.__reviewQuiz.readScoreLogs());
    expect(logs).toHaveLength(0);
  });

  test('blocks c12 homework submission until the student name is entered', async ({ page }) => {
    await blockExternalRequests(page);
    await installHomeworkMock(page);
    await page.goto('/c12/review-quiz.html?seed=homework-name-c12', { waitUntil: 'load' });
    await page.evaluate(() => window.__reviewQuiz.clearStorage());

    await fillAllCorrect(page);
    await page.locator('#bottomCheckAllButton').click();

    await expect(page.locator('#scoreMain')).toContainText('이름을 입력');
    await expect(page.locator('#submissionAlert')).toContainText('이름을 입력');
    await expect(page.locator('#homeworkStatus')).toContainText('이름을 입력');
    await expect(page.locator('body')).toHaveClass(/homework-name-blocked/);

    const activeId = await page.evaluate(() => document.activeElement && document.activeElement.id);
    expect(activeId).toBe('studentNameInput');

    const submissions = await page.evaluate(() => window.__homeworkSubmissions);
    expect(submissions).toHaveLength(0);
  });

  test('submits c12 homework payload with answers, correct questions, and wrong questions', async ({ page }) => {
    await blockExternalRequests(page);
    await installHomeworkMock(page);
    await page.goto('/c12/review-quiz.html?seed=homework-success-c12', { waitUntil: 'load' });
    await page.evaluate(() => window.__reviewQuiz.clearStorage());

    await page.locator('#studentNameInput').fill('김학생');
    await fillAllCorrect(page);
    const wrongQuestion = await page.evaluate(() => {
      const question = window.__reviewQuiz.currentAttempt().questions[0];
      const card = document.querySelector(`[data-question-id="${question.id}"]`);
      const wrongInput = Array.from(card.querySelectorAll('input[type="radio"]')).find((control) => (
        control.value !== question.answer
      ));
      wrongInput.checked = true;
      wrongInput.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        id: question.id,
        answer: question.answer,
        wrongAnswer: wrongInput.value
      };
    });

    await page.locator('#bottomCheckAllButton').click();

    await expect(page.locator('#scoreMain')).toHaveText('23 / 24점');
    await expect(page.locator('#scoreSub')).toContainText('온라인 제출');
    await expect(page.locator('#homeworkStatus')).toContainText('완료');

    const submission = await page.evaluate(() => window.__homeworkSubmissions[0]);
    expect(submission).toMatchObject({
      assignmentId: 'c12-review-quiz-v1',
      assignmentTitle: '12과 어휘·문법 복습',
      chapter: '12',
      studentName: '김학생',
      anonymousUid: 'mock-uid',
      score: 23,
      total: 24,
      percent: 96,
      completed: true,
      answered: 24
    });
    expect(submission.signatureHash).toEqual(expect.any(String));
    expect(submission.correctQuestions).toHaveLength(23);
    expect(submission.wrongQuestions).toEqual([1]);
    expect(submission.questionResults).toHaveLength(24);
    expect(submission.questionResults[0]).toMatchObject({
      number: 1,
      id: wrongQuestion.id,
      type: 'mcq',
      area: '어휘',
      studentAnswer: wrongQuestion.wrongAnswer,
      correctAnswer: wrongQuestion.answer,
      correctLetter: 'A',
      isCorrect: false
    });
    expect(submission.questionResults[0].selectedLetter).not.toBe('');
  });

  test('keeps local c12 score visible when online homework submission fails', async ({ page }) => {
    await blockExternalRequests(page);
    await installHomeworkMock(page, { fail: true });
    await page.goto('/c12/review-quiz.html?seed=homework-failure-c12', { waitUntil: 'load' });
    await page.evaluate(() => window.__reviewQuiz.clearStorage());

    await page.locator('#studentNameInput').fill('오류 학생');
    await fillAllCorrect(page);
    await page.locator('#bottomCheckAllButton').click();

    await expect(page.locator('#scoreMain')).toHaveText('24 / 24점');
    await expect(page.locator('#scoreSub')).toContainText('온라인 제출에 실패');
    await expect(page.locator('#homeworkStatus')).toContainText('온라인 제출 실패');

    const logs = await page.evaluate(() => window.__reviewQuiz.readScoreLogs());
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ score: 24, total: 24, percent: 100 });
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
    await expect(page.locator('#scoreSub')).toContainText('완료 / 제출하기');
    await expect(page.locator('#submitHint')).toContainText('점수를 저장');
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
