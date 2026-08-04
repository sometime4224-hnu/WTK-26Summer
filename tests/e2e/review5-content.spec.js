const { test, expect } = require('@playwright/test');

test('Review 5 keeps its contracts and targets the approved C16 content', async ({ page }) => {
  await page.goto('/review/review5-html/index.html');
  const contract = await page.evaluate(() => {
    const data = window.REVIEW5_DATA;
    const pick = (sectionId, indexes) => indexes.map((index) => data.sections[sectionId].questions[index]);
    return {
      counts: Object.fromEntries(data.order.map((id) => [id, data.sections[id].questions.length])),
      homework: Object.fromEntries(data.order.map((id) => [id, data.sections[id].homework])),
      grammarChoices: data.sections.confirm.questions[10].choices.map((choice) => choice.text),
      confirm: pick('confirm', [0, 1, 14, 16]),
      evaluate: pick('evaluate', [0, 3, 11, 13, 14, 16]),
      readingWriting: pick('readingWriting', [0, 1, 2, 6, 7])
    };
  });

  expect(contract.counts).toEqual({ confirm: 19, evaluate: 17, listening: 16, readingWriting: 15, longWriting: 0 });
  expect(contract.homework.confirm).toMatchObject({ assignmentId: 'review5-confirm-v1', title: '복습 5 확인하기', sectionId: 'confirm', submissionKind: 'quiz', expectedQuestionCount: 19 });
  expect(contract.homework.evaluate).toMatchObject({ assignmentId: 'review5-evaluate-v1', title: '복습 5 평가하기', sectionId: 'evaluate', submissionKind: 'quiz', expectedQuestionCount: 17 });
  expect(contract.homework.listening).toMatchObject({ assignmentId: 'review5-listening-v1', title: '복습 5 듣기', sectionId: 'listening', submissionKind: 'quiz', expectedQuestionCount: 16 });
  expect(contract.homework.readingWriting).toMatchObject({ assignmentId: 'review5-reading-writing-v1', title: '복습 5 읽기와 쓰기', sectionId: 'readingWriting', submissionKind: 'quiz', expectedQuestionCount: 15 });
  expect(contract.grammarChoices).toEqual(['하도 A/V-아서/어서', 'A/V-(으)면 A/V-(으)ㄹ수록', 'V-게 하다', 'A/V-지 않으면 안 되다', 'A/V-(으)ㄹ걸(요)', 'N만 하다']);

  expect(contract.confirm.map((question) => [question.id, question.answer, question.choices.map((choice) => choice.text)])).toEqual([
    ['c1-c16', '1', ['피아노', '바이올린', '트럼펫', '드럼']],
    ['c2-c16', '3', ['눌러', '불어', '튕겨', '켜']],
    ['c15-c16', '6', contract.grammarChoices],
    ['c17-c16', '1', ['요즘 일이 너무 많아서 캠핑 갈 생각도 못 해요.', '요즘 일이 너무 많아서 캠핑 가 볼 만해요.', '요즘 일이 너무 많아서 캠핑 갈걸요.', '요즘 일이 너무 많아서 캠핑을 가게 해요.']]
  ]);
  expect(contract.confirm[2].feedback).toContain('가야금이 사람 키만 해요.');
  expect(contract.confirm[3].feedback).toContain('가다 → 갈 생각도 못 해요');

  expect(contract.evaluate.map((question) => [question.id, question.answer, question.choices.map((choice) => choice.text)])).toEqual([
    ['e1-c16', '1', ['마음이 편안해지다', '가슴이 뛰다', '힘이 나다', '신이 나다']],
    ['e4-c16', '2', ['매끄러워서', '울퉁불퉁해서', '평평해서', '부드러워서']],
    ['e12-c16', '1', ['사람 키만 해요', '사람 키만 했어요', '사람 키를 해요', '사람 키만이에요']],
    ['e14-c16', '2', ['불어', '켜서', '눌러', '쳐서']],
    ['e15-c16', '1', ['여행 갈 엄두도 못 내요.', '여행 갈 거예요.', '여행 가 볼 만해요.', '여행을 가게 해요.']],
    ['e17-c16', '1', ['학생증은 손바닥 정도 크기예요.', '학생증은 손바닥보다 훨씬 커요.', '학생증을 손바닥에 놓아요.', '학생증이 손바닥을 해요.']]
  ]);
  expect(contract.evaluate[2].prompt).toContain('지금 눈앞에 있는 가야금');

  expect(contract.readingWriting.map((question) => [question.id, question.answer, question.choices.map((choice) => choice.text)])).toEqual([
    ['r1-c16', '1', ['피아노', '바이올린', '트럼펫', '드럼']],
    ['r2-c16', '1', ['손에 걸리는 느낌이 적어서', '울퉁불퉁해서', '끝이 뾰족해서', '아주 딱딱해서']],
    ['r3-c16', '4', ['학생들은 피아노만 보고 직접 연주하지 않았어요.', '학생들은 바이올린과 트럼펫을 연주하지 않았어요.', '선생님은 악기 연주를 보여 주지 않았어요.', '학생들은 피아노, 바이올린, 트럼펫을 직접 연주해 봤어요.']],
    ['r7-c16', '1', ['사람 키만 해', '사람 키를 해', '사람 키만이', '사람 키에 해']],
    ['r8-c16', '2', ['가야금을 배우려면 줄을 많이 바꾸어야 한다.', '박물관에서 본 가야금의 모양과 크기, 그리고 소리가 인상적이었다.', '전통 음악 박물관에는 피아노만 전시되어 있다.', '연주자는 트럼펫을 불어서 큰 소리를 냈다.']]
  ]);
  expect(contract.readingWriting[3].context[0].text).toContain('가야금의 길이는 ( ㉠ ) 보였다.');
  expect(contract.readingWriting[4].context[0].text).toBe(contract.readingWriting[3].context[0].text);
  expect(contract.readingWriting[1].prompt).toContain('매끄러워서');
  expect(contract.readingWriting[3].feedback).toContain('"사람 키만 해 보였다"');
});
