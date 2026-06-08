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
