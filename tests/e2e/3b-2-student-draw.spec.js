const { test, expect } = require('@playwright/test');

const studentNames = [
  '쿠엇반탕',
  '응우엔 득 만',
  '팜티아잉',
  '응웬 꾸옥 중',
  '짠 황 아인 휘',
  '판 티 끼에우 비',
  '팜 티 투 니',
  '응웬 티 응웻 응아',
  '응웬 티 낫 하',
  '응웬 타잉 프엉 응아',
  '응웬 티 타오',
  '루 득 아잉',
  '응우엔 응옥 뚜',
  '황 티 끼에우 와잉',
  '형 광 루안',
  '응웬 티 이엔 니',
  '도 응우엔 특 니',
  '호 티 김 느',
  '레 띠엔 중',
  '응엔 중 득',
  '응웬 티 누 이',
  '휜 꾸옥 응이아',
  '보 꽁 닛 호앙',
  '하 반 쯔엉',
  '응웬 꾸옥 칸',
  '판 티 미 협',
  '응웬 티 느 꾸잉'
];

const drawPagePath = '/apps/standalone-pages/3B-2%EB%B0%98%EB%BD%91%EA%B8%B0.html';

async function blockExternalRequests(page) {
  await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
}

async function drawOne(page) {
  await page.locator('#drawButton').click();
  return page.locator('#result').innerText();
}

test('draws every 3B-2 student once before the pool resets', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto(drawPagePath, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('#drawButton')).toHaveText('뽑기');

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
