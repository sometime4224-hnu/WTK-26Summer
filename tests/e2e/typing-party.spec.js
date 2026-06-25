const { test, expect } = require("@playwright/test");

async function createHostRoom(page) {
  await page.goto("/apps/typing-party/index.html?mock=1&reset=1");
  await page.locator('[data-testid="create-room"]').click();
  await expect(page.locator('[data-testid="room-code-display"]')).toHaveText(/[A-Z0-9]{6}/);
  return page.locator('[data-testid="room-code-display"]').textContent();
}

async function joinStudent(context, roomCode, nickname = "민수") {
  const student = await context.newPage();
  await student.goto(`/apps/typing-party/index.html?mock=1&room=${roomCode}`);
  await student.locator('[data-testid="nickname-input"]').fill(nickname);
  await student.locator('[data-testid="join-room"]').click();
  await expect(student.locator('[data-testid="stage-title"]')).toHaveText("대기실");
  return student;
}

test.describe("typing party multiplayer MVP", () => {
  test("loads the start screen in mock mode", async ({ page }) => {
    await page.goto("/apps/typing-party/index.html?mock=1&reset=1");

    await expect(page).toHaveTitle("타이핑 파티");
    await expect(page.locator("#pageTitle")).toContainText("방 코드");
    await expect(page.locator('[data-testid="create-room"]')).toBeVisible();
    await expect(page.locator('[data-testid="join-room"]')).toBeVisible();
    await expect(page.locator("#connectionChip")).toHaveText("Mock");
  });

  test("creates a room and lets a student join", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const student = await joinStudent(context, roomCode, "지아");

    await expect(host.locator('[data-testid="player-list"]')).toContainText("지아");
    await expect(student.locator('[data-testid="room-code-display"]')).toHaveText(roomCode);
    await context.close();
  });

  test("runs a random box round through submit, vote, and results", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const student = await joinStudent(context, roomCode, "민수");

    await host.locator('[data-testid="start-round"]').click();
    await expect(host.locator(".keyword-pill")).toHaveCount(3);
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("미션 공개");
    await expect(student.locator(".keyword-pill")).toHaveCount(3);

    await host.locator('[data-testid="open-submit"]').click();
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("입력 중");
    await student.locator('[data-testid="answer-input"]').fill("양말을 신고 교장실에서 초콜릿을 숨겼습니다");
    await student.locator('[data-testid="submit-answer"]').click();
    await expect(student.locator("#answerNote")).toContainText("제출 완료");

    await expect(host.locator('[data-testid="host-controls"]')).toContainText("제출 1");
    await host.locator('[data-testid="open-vote"]').click();
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("투표");
    await expect(student.locator('[data-testid="submissions-panel"]')).toContainText("초콜릿");

    for (const categoryId of ["funny", "clever", "chaos"]) {
      await student.locator(`[data-action="vote"][data-category-id="${categoryId}"]`).click();
    }

    await host.locator('[data-testid="show-results"]').click();
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("결과");
    await expect(student.locator('[data-testid="results-panel"]')).toContainText("가장 웃김");
    await expect(student.locator('[data-testid="results-panel"]')).toContainText("민수");
    await context.close();
  });

  test("runs an escape mission round with the required word condition", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const student = await joinStudent(context, roomCode, "수빈");

    await host.locator('[data-testid="game-select"]').selectOption("escapeMission");
    await host.locator('[data-testid="start-round"]').click();
    await expect(student.locator('[data-testid="prompt-panel"]')).toContainText("필수 단어");
    await expect(student.locator('[data-testid="prompt-panel"]')).toContainText("슬리퍼");

    await host.locator('[data-testid="open-submit"]').click();
    await student.locator('[data-testid="answer-input"]').fill("슬리퍼를 신고 칠판 뒤 버튼을 눌러 탈출합니다");
    await student.locator('[data-testid="submit-answer"]').click();
    await expect(student.locator("#answerNote")).toContainText("제출 완료");
    await context.close();
  });

  test("lets the teacher launch a copied typing activity and observe progress", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const student = await joinStudent(context, roomCode, "하준");

    await host.locator('[data-testid="activity-select"]').selectOption("c12-writing-shower");
    await host.locator('[data-testid="start-activity"]').click();
    await expect(host.locator('[data-testid="stage-title"]')).toHaveText("개인 활동");
    await expect(student.locator('[data-testid="activity-frame"]')).toBeVisible();
    await expect(student.frameLocator('[data-testid="activity-frame"]').locator("#missionTitle")).toContainText("초급 쓰기");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("하준");

    await student.evaluate(() => {
      window.postMessage({
        type: "typing-party-progress",
        status: "working",
        stageTitle: "초급 쓰기",
        detail: "문장 작성 중",
        completed: 2,
        total: 5
      }, "*");
    });

    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("작성 중");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("초급 쓰기");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("2 / 5");
    await context.close();
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/apps/typing-party/index.html?mock=1&reset=1");

    await expect(page.locator('[data-testid="create-room"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("is linked from both typing hubs", async ({ page }) => {
    await page.goto("/apps/index.html");
    const appHubLink = page.locator('a[href="typing-party/index.html"]');
    await expect(appHubLink).toHaveCount(1);
    await expect(appHubLink).toContainText("타이핑 파티");

    await page.goto("/apps/standalone-pages/korean-keyboard-writing-hub.html");
    const writingHubLink = page.locator('[data-hub-link="typing-party"]');
    await expect(writingHubLink).toHaveAttribute("href", "../typing-party/index.html");
    await expect(writingHubLink).toContainText("타이핑 파티");
  });
});
