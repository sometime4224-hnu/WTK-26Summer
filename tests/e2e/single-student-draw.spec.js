const { test, expect } = require('@playwright/test');

const studentNames = [
  '도안 티 응엣 하',
  '팜 반 탄',
  '황 티 튀 드엉',
  '호 티 화이',
  '응웬 팜 드엉 비',
  '버 탄 쩡',
  '당 반 빔',
  '응웬 휴 득',
  '보 쑤안 타이',
  '짠 바오 응옥',
  '짠 낫 란',
  '레 딘 하이',
  '또 자 하오',
  '훤 티 홍 깜',
  '응웬 티 응옥 즈앙',
  '부 티 비',
  '까오 티 응아',
  '응웬 당 코이',
  '레 반 러이',
  '응웬 티 엔 찌',
  '응우엔 티 호앙 후이 히에우',
  '당 티 미 디엔',
  '응웬 프엉 아잉',
  '팜 티 프엉 웬',
  '응웬 티 타잉 후에',
  '팜 티 응억 란',
  '레 득 한',
  '까어 쩐 뜨어 뜨',
  '다오 티 투 짱'
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
  expect(pickedName.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(3);
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
