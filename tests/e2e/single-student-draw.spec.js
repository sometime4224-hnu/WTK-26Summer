const { test, expect } = require('@playwright/test');

const studentNames = [
  '짠 하 로안 안',
  '즈엉 반 바오',
  '부 딩 프엉',
  '짠 티 김 응옥',
  '응웬 하 미',
  '응웬 반 람',
  '부 티 민 프엉',
  '짠 투안 아잉',
  '반 티 하이 옌',
  '딘 녓 주이',
  '부이 바오 옌',
  '응웬 반 퐁',
  '르엉 득 뚜',
  '팜 득 러이',
  '라님 알 하마드',
  '간바트 운졸',
  '호앙 후이 리에우',
  '레티느',
  '부 후옌 린',
  '응웬 티 김 풍',
  '응오 티 번 니',
  '황 티 탄 쭉',
  '보 후인 안',
  '도득흥',
  '원 티 응옥 린'
];

const class8StudentNames = [
  '칭 텐 김',
  '찡 황 칸 후엔',
  '응우엔 빈 빈',
  '응웬 반 짭',
  '응웬 티 홍 낫',
  '레 띠에우 방',
  '응웬 프엉 마이',
  '팜 티 응옥 니',
  '응우엔 티 후옌',
  '르우 반 뒤',
  '쯔엉 민 황안',
  '장티김아잉',
  '응웬 황 티 터',
  '쩐 부 바오',
  '응웬 반 팅',
  '베갈리나 말리카',
  '부티 탕 쭉',
  '응우옌 티 화이',
  '레 티 하이리',
  '반 티 튀 항',
  '팜 홍 타이',
  '응우옌 티 투 후에',
  '팜 쑤안 휘',
  '부 티 응아',
  '이잉잉'
];

async function drawOne(page) {
  await page.locator('#draw-button').click();
  return page.locator('#student-name').innerText();
}

test('draws exactly one student from the presentation roster', async ({ page }) => {
  await page.goto('/apps/standalone-pages/single-student-draw.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('#draw-button')).toHaveCount(1);
  await expect(page.locator('#draw-button')).toHaveText('뽑기');
  await expect(page.locator('#student-name')).toHaveText('');

  const pickedName = await drawOne(page);
  expect(studentNames).toContain(pickedName);
  expect(pickedName.length).toBeGreaterThan(0);
});

test('draws every presentation student once before the pool resets', async ({ page }) => {
  await page.goto('/apps/standalone-pages/single-student-draw.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  const drawnNames = [];

  for (let index = 0; index < 10; index += 1) {
    const pickedName = await drawOne(page);
    expect(studentNames).toContain(pickedName);
    expect(drawnNames).not.toContain(pickedName);
    drawnNames.push(pickedName);
  }

  await page.reload({ waitUntil: 'domcontentloaded' });

  while (drawnNames.length < studentNames.length) {
    const pickedName = await drawOne(page);
    expect(studentNames).toContain(pickedName);
    expect(drawnNames).not.toContain(pickedName);
    drawnNames.push(pickedName);
  }

  expect(new Set(drawnNames).size).toBe(studentNames.length);

  const lastNameFromFinishedPool = drawnNames[drawnNames.length - 1];
  const firstNameFromResetPool = await drawOne(page);

  expect(studentNames).toContain(firstNameFromResetPool);
  expect(firstNameFromResetPool).not.toBe(lastNameFromFinishedPool);
});

test('draws exactly one student from the 3B-8 roster', async ({ page }) => {
  await page.goto('/apps/standalone-pages/single-student-draw-3b8.html', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('.page-title')).toHaveText('3B-8반 한 명 뽑기');
  await expect(page.locator('#draw-button')).toHaveText('뽑기');

  const pickedName = await drawOne(page);
  expect(class8StudentNames).toContain(pickedName);
});
