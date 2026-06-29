const { test, expect } = require('@playwright/test');

const quizPages = [
  { path: '/apps/vocab-grammar-mock/round1.html', count: 26 },
  { path: '/apps/vocab-grammar-mock/round2.html', count: 25 },
  { path: '/apps/vocab-grammar-mock/round3.html', count: 25 },
  { path: '/apps/vocab-grammar-mock/round4.html', count: 25 },
  { path: '/apps/vocab-grammar-mock/marathon30.html', count: 30, marathon: true }
];

async function blockExternalRequests(page) {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
  await page.route('https://www.gstatic.com/firebasejs/**', (route) => route.abort());
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > window.innerWidth + 1
  ));
  expect(hasOverflow).toBe(false);
}

async function auditRenderedQuiz(page) {
  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.question-card'));
    const answerLetters = cards.map((card) => (
      card.querySelector('.option[data-correct="true"]')?.dataset.displayChoice || ''
    ));
    const counts = answerLetters.reduce((result, letter) => {
      result[letter] = (result[letter] || 0) + 1;
      return result;
    }, {});
    const maxRun = answerLetters.reduce((state, letter) => {
      const run = letter === state.last ? state.run + 1 : 1;
      return {
        last: letter,
        run,
        max: Math.max(state.max, run)
      };
    }, { last: '', run: 0, max: 0 }).max;

    return {
      count: cards.length,
      answerLetters,
      counts,
      maxRun,
      optionCounts: cards.map((card) => card.querySelectorAll('.option').length),
      invalidCorrectCount: cards.filter((card) => card.querySelectorAll('.option[data-correct="true"]').length !== 1).length,
      displayLetters: cards.map((card) => Array.from(card.querySelectorAll('.option')).map((option) => option.dataset.displayChoice)),
      orders: cards.map((card) => Array.from(card.querySelectorAll('.option')).map((option) => option.dataset.choice).join(''))
    };
  });
}

async function getAttemptState(page) {
  return page.evaluate(() => {
    const key = Object.keys(localStorage).find((item) => item.startsWith('vocab-grammar-mock-attempt-'));
    return key ? JSON.parse(localStorage.getItem(key)) : null;
  });
}

async function answerAllCorrect(page) {
  const answers = await page.evaluate(() => Array.from(document.querySelectorAll('.question-card')).map((card) => {
    const correct = card.querySelector('.option[data-correct="true"]');
    return {
      number: card.dataset.question,
      original: correct.dataset.choice
    };
  }));

  for (const answer of answers) {
    await page.locator(`#q${answer.number}-${answer.original}`).evaluate((input) => {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

async function answerFirstCorrect(page, count) {
  const answers = await page.evaluate((limit) => Array.from(document.querySelectorAll('.question-card')).slice(0, limit).map((card) => {
    const correct = card.querySelector('.option[data-correct="true"]');
    return {
      number: card.dataset.question,
      original: correct.dataset.choice
    };
  }), count);

  for (const answer of answers) {
    await page.locator(`#q${answer.number}-${answer.original}`).evaluate((input) => {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

async function enterStudentName(page, name = '테스트 학생') {
  await expect(page.locator('#studentNameInput')).toBeVisible();
  await page.locator('#studentNameInput').fill(name);
  await expect(page.locator('body')).not.toHaveClass(/homework-locked/);
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

async function installDashboardMock(page) {
  await page.addInitScript(() => {
    const submissionsByAssignment = {
      'vocab-grammar-mock-round2-v1': [
        {
          id: 'round2-sub-1',
          assignmentId: 'vocab-grammar-mock-round2-v1',
          studentName: '김학생',
          score: 23,
          total: 25,
          percent: 92,
          clientSubmittedAt: '2026-06-29T01:00:00.000Z',
          wrongQuestions: [1, 5],
          questionResults: [
            { number: 1, area: '1부. 어휘', correctAnswer: '소개팅하다', isCorrect: false },
            { number: 5, area: '1부. 어휘', correctAnswer: '매력이 있다', isCorrect: false }
          ]
        },
        {
          id: 'round2-sub-2',
          assignmentId: 'vocab-grammar-mock-round2-v1',
          studentName: '박학생',
          score: 25,
          total: 25,
          percent: 100,
          clientSubmittedAt: '2026-06-29T01:10:00.000Z',
          wrongQuestions: [],
          questionResults: []
        }
      ],
      'vocab-grammar-mock-marathon30-v1': [
        {
          id: 'marathon-sub-1',
          assignmentId: 'vocab-grammar-mock-marathon30-v1',
          studentName: '마라톤학생',
          score: 28,
          total: 30,
          percent: 93,
          clientSubmittedAt: '2026-06-29T01:20:00.000Z',
          wrongQuestions: [7, 18],
          questionResults: [
            { number: 7, area: '1부. 기출 핵심 어휘', correctAnswer: '나다', isCorrect: false }
          ]
        }
      ]
    };

    window.__dashUser = null;
    window.__dashAuthCallback = null;
    window.HomeworkDashboardClient = {
      async signIn() {
        window.__dashUser = { email: 'teacher@example.com' };
        if (window.__dashAuthCallback) window.__dashAuthCallback(window.__dashUser);
        return window.__dashUser;
      },
      async signOut() {
        window.__dashUser = null;
        if (window.__dashAuthCallback) window.__dashAuthCallback(null);
      },
      async onAuthStateChanged(callback) {
        window.__dashAuthCallback = callback;
        callback(window.__dashUser);
        return () => {};
      },
      async loadSubmissions() {
        const assignmentId = window.HOMEWORK_FIREBASE_CONFIG.dashboard.assignmentId;
        return submissionsByAssignment[assignmentId] || [];
      }
    };
  });
}

test.beforeEach(async ({ page }) => {
  await blockExternalRequests(page);
});

test('vocab grammar mock landing exposes only the visible rounds', async ({ page }) => {
  await page.goto('/apps/vocab-grammar-mock/index.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.round-card')).toHaveCount(5);
  await expect(page.locator('.round-card[href="./marathon30.html"]')).toContainText('30문제 마라톤');
  await expect(page.locator('body')).not.toContainText('5회차');
});

test('vocab grammar mock pages render balanced shuffled choices responsively', async ({ page }) => {
  const viewports = [
    { width: 390, height: 844 },
    { width: 1180, height: 820 }
  ];

  for (const quizPage of quizPages) {
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(quizPage.path, { waitUntil: 'domcontentloaded' });

      await expect(page.locator('.question-card')).toHaveCount(quizPage.count);
      await expect(page.locator('#questionPalette')).toBeVisible();
      await expectNoHorizontalOverflow(page);

      const audit = await auditRenderedQuiz(page);
      expect(audit.optionCounts.every((count) => count === 4)).toBe(true);
      expect(audit.invalidCorrectCount).toBe(0);
      expect(audit.displayLetters.every((letters) => letters.join('') === 'ABCD')).toBe(true);

      const values = Object.values(audit.counts);
      expect(Math.max(...values) - Math.min(...values)).toBeLessThanOrEqual(1);
      expect(audit.maxRun).toBeLessThanOrEqual(2);
    }
  }
});

test('vocab grammar mock desktop layout keeps the first section close to progress controls', async ({ page }) => {
  await page.setViewportSize({ width: 1310, height: 900 });
  await page.goto('/apps/vocab-grammar-mock/round4.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  await enterStudentName(page, '공백 확인');

  const gap = await page.evaluate(() => {
    const progress = document.querySelector('.progress-track').getBoundingClientRect();
    const section = document.querySelector('.section-card').getBoundingClientRect();
    return Math.round(section.top - progress.bottom);
  });

  expect(gap).toBeLessThan(90);
});

test('vocab grammar mock keeps a shuffled attempt stable across reload and creates a new one on reset', async ({ page }) => {
  await page.goto('/apps/vocab-grammar-mock/round2.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  await enterStudentName(page);

  const firstAudit = await auditRenderedQuiz(page);
  const firstAttempt = await getAttemptState(page);
  await page.locator('.question-card[data-question="1"] .option-input').first().check({ force: true });

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  const reloadedAudit = await auditRenderedQuiz(page);
  const reloadedAttempt = await getAttemptState(page);

  expect(reloadedAudit.orders).toEqual(firstAudit.orders);
  expect(reloadedAttempt.seed).toBe(firstAttempt.seed);
  await expect(page.locator('.question-card[data-question="1"] .option-input:checked')).toHaveCount(1);

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#resetButton').click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('.question-card')).toHaveCount(25);

  const resetAudit = await auditRenderedQuiz(page);
  const resetAttempt = await getAttemptState(page);
  expect(resetAttempt.seed).not.toBe(firstAttempt.seed);
  expect(resetAudit.orders).not.toEqual(firstAudit.orders);
});

test('vocab grammar mock grades perfect submissions including marathon summary', async ({ page }) => {
  await installHomeworkMock(page);

  for (const quizPage of quizPages) {
    await page.goto(quizPage.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.question-card')).toHaveCount(quizPage.count);
    await enterStudentName(page, '만점 학생');
    await answerAllCorrect(page);
    await page.locator('[data-action="grade"]').first().click();

    await expect(page.locator('#progressText')).toHaveText(`${quizPage.count} / ${quizPage.count}`);
    await expect(page.locator('#summaryModalScore')).toContainText(`${quizPage.count}문항 중 ${quizPage.count}문항 정답`);
    await expect(page.locator('#homeworkStatus')).toContainText('완료');

    if (quizPage.marathon) {
      await expect(page.locator('#coachSummary')).toBeVisible();
      await expect(page.locator('#summaryModalCoach')).toBeVisible();
    }
  }
});

test('vocab grammar mock locks the quiz until a student name is entered and keeps it after reload', async ({ page }) => {
  await page.goto('/apps/vocab-grammar-mock/round1.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(26);

  await expect(page.locator('body')).toHaveClass(/homework-locked/);
  await expect(page.locator('#homeworkPanel')).toHaveClass(/is-name-missing/);
  await expect(page.locator('#studentNameInput')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#homeworkStatus')).toContainText('이름을 입력하면');
  await expect(page.locator('.question-card[data-question="1"] .option-input').first()).toBeDisabled();

  await page.locator('.question-card[data-question="1"]').click();
  await expect(page.locator('#homeworkStatus')).toContainText('이름을 먼저 입력');

  await enterStudentName(page, '저장 학생');
  await expect(page.locator('#homeworkPanel')).not.toHaveClass(/is-name-missing/);
  await expect(page.locator('#studentNameInput')).toHaveAttribute('aria-invalid', 'false');
  await expect(page.locator('.question-card[data-question="1"] .option-input').first()).toBeEnabled();

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#studentNameInput')).toHaveValue('저장 학생');
  await expect(page.locator('body')).not.toHaveClass(/homework-locked/);
});

test('vocab grammar mock autosaves progress and guides completed students to grading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/apps/vocab-grammar-mock/round2.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  await enterStudentName(page, '자동저장 학생');
  await answerFirstCorrect(page, 3);

  const savedCount = await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('vocab-grammar-mock-round-2') || '{}');
    return Object.keys(saved).length;
  });
  expect(savedCount).toBe(3);

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.option-input:checked')).toHaveCount(3);

  await answerAllCorrect(page);
  await expect(page.locator('#homeworkStatus')).toContainText('채점 버튼');
  await expect(page.locator('[data-action="grade"]').first()).toHaveClass(/is-ready-to-submit/);
  await expect.poll(async () => page.locator('.toolbar--bottom [data-action="grade"]').evaluate((button) => {
    const rect = button.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  })).toBe(true);
});

test('vocab grammar mock submits round payload with answer details', async ({ page }) => {
  await installHomeworkMock(page);
  await page.goto('/apps/vocab-grammar-mock/round2.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  await enterStudentName(page, '김학생');
  await answerAllCorrect(page);

  const wrongQuestion = await page.evaluate(() => {
    const card = document.querySelector('.question-card[data-question="1"]');
    const correct = card.querySelector('.option[data-correct="true"]');
    const wrong = Array.from(card.querySelectorAll('.option')).find((option) => option !== correct);
    const input = wrong.querySelector('.option-input');
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return {
      selectedLetter: wrong.dataset.displayChoice,
      selectedOriginalLetter: wrong.dataset.choice,
      correctLetter: correct.dataset.displayChoice,
      correctOriginalLetter: correct.dataset.choice,
      correctAnswer: correct.querySelector('.option-text').textContent.trim(),
      studentAnswer: wrong.querySelector('.option-text').textContent.trim()
    };
  });

  await page.locator('[data-action="grade"]').first().click();
  await expect(page.locator('#homeworkStatus')).toContainText('완료');

  const submission = await page.evaluate(() => window.__homeworkSubmissions[0]);
  expect(submission).toMatchObject({
    assignmentId: 'vocab-grammar-mock-round2-v1',
    assignmentTitle: '3B 중간 모의고사 2회차',
    chapter: 'midterm-3b',
    roundId: '2',
    roundLabel: '2회차',
    studentName: '김학생',
    score: 24,
    total: 25,
    percent: 96,
    completed: true,
    answered: 25
  });
  expect(submission.signatureHash).toEqual(expect.any(String));
  expect(submission.correctQuestions).toHaveLength(24);
  expect(submission.wrongQuestions).toEqual([1]);
  expect(submission.questionResults).toHaveLength(25);
  expect(submission.questionResults[0]).toMatchObject({
    number: 1,
    area: '1부. 어휘',
    selectedLetter: wrongQuestion.selectedLetter,
    selectedOriginalLetter: wrongQuestion.selectedOriginalLetter,
    correctLetter: wrongQuestion.correctLetter,
    correctOriginalLetter: wrongQuestion.correctOriginalLetter,
    studentAnswer: wrongQuestion.studentAnswer,
    correctAnswer: wrongQuestion.correctAnswer,
    isCorrect: false
  });
});

test('vocab grammar mock submits marathon with its own assignment id', async ({ page }) => {
  await installHomeworkMock(page);
  await page.goto('/apps/vocab-grammar-mock/marathon30.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(30);
  await enterStudentName(page, '마라톤 학생');
  await answerAllCorrect(page);
  await page.locator('[data-action="grade"]').first().click();
  await expect(page.locator('#homeworkStatus')).toContainText('완료');

  const submission = await page.evaluate(() => window.__homeworkSubmissions[0]);
  expect(submission).toMatchObject({
    assignmentId: 'vocab-grammar-mock-marathon30-v1',
    roundId: 'marathon30',
    roundLabel: '30문제 마라톤',
    studentName: '마라톤 학생',
    score: 30,
    total: 30,
    percent: 100
  });
});

test('vocab grammar mock keeps local grading visible when online submission fails', async ({ page }) => {
  await installHomeworkMock(page, { fail: true });
  await page.goto('/apps/vocab-grammar-mock/round3.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.question-card')).toHaveCount(25);
  await enterStudentName(page, '오류 학생');
  await answerAllCorrect(page);
  await page.locator('[data-action="grade"]').first().click();

  await expect(page.locator('#progressText')).toHaveText('25 / 25');
  await expect(page.locator('#summaryModalScore')).toContainText('25문항 중 25문항 정답');
  await expect(page.locator('#homeworkStatus')).toContainText('온라인 제출 실패');
  const submissions = await page.evaluate(() => window.__homeworkSubmissions);
  expect(submissions).toHaveLength(0);
});

test('vocab grammar mock dashboard switches assignments by round query', async ({ page }) => {
  await installDashboardMock(page);
  await page.goto('/apps/vocab-grammar-mock/results.html?round=2', { waitUntil: 'load' });

  await expect(page.locator('h1')).toHaveText('3B 중간 모의고사 2회차 제출 현황');
  await page.locator('#signInButton').click();
  await expect(page.locator('.summary-card').first()).toContainText('2');
  await expect(page.locator('.score-bar')).toHaveCount(2);
  await expect(page.locator('.score-bar')).toContainText(['김학생', '박학생']);
  await expect(page.locator('.weak-item').first()).toContainText('Q1');

  await page.goto('/apps/vocab-grammar-mock/results.html?round=marathon30', { waitUntil: 'load' });
  await expect(page.locator('h1')).toHaveText('3B 중간 모의고사 30문제 마라톤 제출 현황');
  await page.locator('#signInButton').click();
  await expect(page.locator('.summary-card').first()).toContainText('1');
  await expect(page.locator('.score-bar').first()).toContainText('마라톤학생');
});
