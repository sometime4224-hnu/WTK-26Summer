const { test, expect } = require('@playwright/test');

async function placePanel(page, panelId, slotIndex) {
  await page.locator(`.card-bank .picture-card[data-panel-id="${panelId}"]`).click();
  await page.locator(`.drop-slot[data-slot-index="${slotIndex}"]`).click();
}

async function expectSlotPanel(page, slotIndex, panelId) {
  await expect(page.locator(`.drop-slot[data-slot-index="${slotIndex}"] .picture-card`)).toHaveAttribute('data-panel-id', panelId);
}

const quizPages = [
  {
    name: 'listening1',
    url: '/c10/listening1-student-quiz.html',
    firstPanel: 'l1-1',
    secondPanel: 'l1-2'
  },
  {
    name: 'listening2',
    url: '/c10/listening2-student-quiz.html',
    firstPanel: 'l2-1',
    secondPanel: 'l2-2'
  }
];

for (const quizPage of quizPages) {
  test(`c10 ${quizPage.name} swaps and moves placed picture cards`, async ({ page }) => {
    await page.goto(quizPage.url, { waitUntil: 'domcontentloaded' });

    await placePanel(page, quizPage.firstPanel, 0);
    await placePanel(page, quizPage.secondPanel, 1);

    await expectSlotPanel(page, 0, quizPage.firstPanel);
    await expectSlotPanel(page, 1, quizPage.secondPanel);

    await page.locator(`.drop-slot[data-slot-index="0"] .picture-card[data-panel-id="${quizPage.firstPanel}"]`).click();
    await page.locator(`.drop-slot[data-slot-index="1"] .picture-card[data-panel-id="${quizPage.secondPanel}"]`).click();

    await expectSlotPanel(page, 0, quizPage.secondPanel);
    await expectSlotPanel(page, 1, quizPage.firstPanel);
    await expect(page.locator(`.card-bank .picture-card[data-panel-id="${quizPage.firstPanel}"]`)).toHaveCount(0);
    await expect(page.locator(`.card-bank .picture-card[data-panel-id="${quizPage.secondPanel}"]`)).toHaveCount(0);

    await page.locator(`.drop-slot[data-slot-index="1"] .picture-card[data-panel-id="${quizPage.firstPanel}"]`).click();
    await page.locator('.drop-slot[data-slot-index="2"]').click();

    await expect(page.locator('.drop-slot[data-slot-index="1"] .empty-slot')).toBeVisible();
    await expectSlotPanel(page, 2, quizPage.firstPanel);
  });
}
