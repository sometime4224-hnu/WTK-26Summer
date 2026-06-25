const { test, expect } = require("@playwright/test");

async function createHostRoom(page) {
  await page.goto("/apps/typing-party/index.html?mock=1&reset=1");
  await page.locator('[data-testid="teacher-pin-input"]').fill("3b67");
  await page.locator('[data-testid="unlock-teacher"]').click();
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

async function drawStroke(page, selector = 'canvas[data-can-draw="1"]') {
  const canvas = page.locator(selector).first();
  await expect(canvas).toBeVisible();
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.25);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.35);
  await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.72);
  await page.mouse.up();
}

async function catchmindGroupLabel(page) {
  const text = await page.locator('[data-testid="catchmind-student"] .category-badge').first().textContent();
  return text.split("·").pop().trim();
}

async function anyCanvasHasInk(page) {
  return page.locator("canvas").evaluateAll((canvases) => canvases.some((canvas) => {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 0; index < data.length; index += 4) {
      if (data[index] < 245 || data[index + 1] < 245 || data[index + 2] < 245) return true;
    }
    return false;
  }));
}

test.describe("typing party multiplayer MVP", () => {
  test("loads the start screen in mock mode", async ({ page }) => {
    await page.goto("/apps/typing-party/index.html?mock=1&reset=1");

    await expect(page).toHaveTitle("타이핑 파티");
    await expect(page.locator("#pageTitle")).toContainText("방 코드");
    await expect(page.locator('[data-testid="create-room"]')).toBeHidden();
    await expect(page.locator('[data-testid="teacher-pin-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="join-room"]')).toBeVisible();
    await expect(page.locator("#connectionChip")).toHaveText("Mock");
  });

  test("unlocks the teacher room creation panel with the classroom PIN", async ({ page }) => {
    await page.goto("/apps/typing-party/index.html?mock=1&reset=1");

    await expect(page.locator('[data-testid="create-room"]')).toBeHidden();
    await page.locator('[data-testid="teacher-pin-input"]').fill("0000");
    await page.locator('[data-testid="unlock-teacher"]').click();
    await expect(page.locator("#startStatus")).toContainText("맞지 않습니다");

    await page.locator('[data-testid="teacher-pin-input"]').fill("3b67");
    await page.locator('[data-testid="unlock-teacher"]').click();
    await expect(page.locator('[data-testid="create-room"]')).toBeVisible();
    await expect(page.locator('[data-testid="create-room"]')).toBeEnabled();
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
    await expect(student.locator('[data-testid="activity-launch"]')).toBeVisible();
    await expect(student.locator('[data-testid="activity-launch"]')).toContainText("ENTER를 눌러 시작");

    await student.keyboard.press("Enter");
    await student.waitForLoadState("domcontentloaded");
    await expect(student).toHaveURL(/activity\.html/);
    await expect(student.locator('[data-testid="activity-runner-frame"]')).toBeVisible();
    await expect(student.frameLocator('[data-testid="activity-runner-frame"]').locator("#missionTitle")).toContainText("첫 만남 짧은 어휘");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("하준");

    await student.evaluate(() => {
      window.postMessage({
        type: "typing-party-progress",
        status: "working",
        stageTitle: "첫 만남 짧은 어휘",
        detail: "단어 소나기 진행 중",
        completed: 2,
        total: 12
      }, "*");
    });

    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("작성 중");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("첫 만남 짧은 어휘");
    await expect(host.locator('[data-testid="activity-monitor"]')).toContainText("2 / 12");

    await host.locator('[data-testid="close-activity"]').click();
    await expect(student).toHaveURL(/index\.html/);
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("대기실");
    await expect(student.locator('[data-testid="activity-launch"]')).toHaveCount(0);
    await context.close();
  });

  test("opens the keyboard campus world with movement, stations, and safe reactions", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const student = await joinStudent(context, roomCode, "지우");

    await host.locator('[data-testid="start-world"]').click();
    await expect(host.locator('[data-testid="stage-title"]')).toHaveText("키보드 캠퍼스");
    await expect(student.locator('[data-testid="world-avatar-picker"]')).toBeVisible();

    await student.locator('[data-action="select-world-avatar"][data-avatar-id="mint"]').click();
    await student.locator('[data-testid="world-avatar-enter"]').click();
    const hostAvatar = host.locator('[data-world-nickname="지우"]');
    await expect(hostAvatar).toBeVisible();

    const beforeMove = await hostAvatar.evaluate((node) => getComputedStyle(node).getPropertyValue("--x").trim());
    await student.keyboard.press("ArrowRight");
    await expect.poll(async () => hostAvatar.evaluate((node) => getComputedStyle(node).getPropertyValue("--x").trim())).not.toBe(beforeMove);

    await host.locator('[data-testid="world-station-select"]').selectOption("copy-lab");
    await host.locator('[data-testid="open-world-station"]').click();
    await expect(student.locator('[data-testid="world-active-station"]')).toContainText("복사 연구소");
    await student.locator('[data-testid="world-portal-copy-lab"]').click();
    await student.keyboard.press("Control+C");
    await expect(host.locator('[data-testid="world-progress-monitor"]')).toContainText("Ctrl+C 복사 완료");
    await expect(host.locator('[data-testid="world-progress-monitor"]')).toContainText("완료");

    await student.locator('[data-testid="world-emote-cheer"]').click();
    await expect(hostAvatar).toContainText("응원");
    await student.locator('[data-testid="world-help"]').click();
    await expect(host.locator('[data-testid="world-progress-monitor"]')).toContainText("도움 요청");

    await host.locator('[data-testid="world-lock-toggle"]').click();
    await expect(student.locator('[data-testid="world-student"] .stage-chip')).toContainText("이동 잠금");
    const lockedX = await hostAvatar.evaluate((node) => getComputedStyle(node).getPropertyValue("--x").trim());
    await student.keyboard.press("ArrowRight");
    await student.waitForTimeout(180);
    await expect.poll(async () => hostAvatar.evaluate((node) => getComputedStyle(node).getPropertyValue("--x").trim())).toBe(lockedX);
    await context.close();
  });

  test("runs a grouped typing catchmind round with balanced groups, drawing, and a correct guess", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const names = ["지아", "민수", "수빈", "하준", "지우", "도윤", "서연"];
    const students = [];
    for (const name of names) {
      students.push(await joinStudent(context, roomCode, name));
    }

    await host.locator('[data-testid="start-catchmind"]').click();
    await expect(host.locator('[data-testid="stage-title"]')).toHaveText("그룹 게임");
    await expect(host.locator('[data-testid="catchmind-group-card"]')).toHaveCount(2);

    const sizes = await host.locator('[data-testid="catchmind-group-card"] .category-badge').evaluateAll((nodes) =>
      nodes.map((node) => Number((node.textContent || "").match(/·\s*(\d+)명/)?.[1] || 0))
    );
    expect(Math.max(...sizes)).toBeLessThanOrEqual(6);
    expect(sizes.reduce((sum, size) => sum + size, 0)).toBe(7);

    for (const student of students) {
      await expect(student.locator('[data-testid="catchmind-student"]')).toBeVisible();
    }

    let drawer = null;
    let drawerGroup = "";
    for (const student of students) {
      if (await student.locator('[data-testid="catchmind-drawer-answer"]').count()) {
        drawer = student;
        drawerGroup = await catchmindGroupLabel(student);
        break;
      }
    }
    expect(drawer).toBeTruthy();

    let guesser = null;
    for (const student of students) {
      if (student === drawer) continue;
      if (await student.locator('[data-testid="catchmind-guess-input"]').count()) {
        const group = await catchmindGroupLabel(student);
        if (group === drawerGroup) {
          guesser = student;
          break;
        }
      }
    }
    expect(guesser).toBeTruthy();
    await expect(guesser.locator('[data-testid="catchmind-drawer-answer"]')).toHaveCount(0);

    const answer = (await drawer.locator('[data-testid="catchmind-drawer-answer"] strong').textContent()).trim();
    await drawer.locator('[data-action="select-drawing-tool"][data-tool="eraser"]').click();
    await expect(drawer.locator('[data-action="select-drawing-size"][data-size="30"]')).toHaveClass(/is-selected/);
    const cursorCanvas = drawer.locator('canvas[data-can-draw="1"]').first();
    await cursorCanvas.scrollIntoViewIfNeeded();
    const cursorBox = await cursorCanvas.boundingBox();
    await drawer.mouse.move(cursorBox.x + cursorBox.width * 0.5, cursorBox.y + cursorBox.height * 0.5);
    await expect.poll(async () => drawer.locator(".drawing-cursor").first().evaluate((node) => getComputedStyle(node).width)).toBe("30px");
    await drawer.locator('[data-action="select-drawing-tool"][data-tool="pen"]').click();
    await drawStroke(drawer);
    await expect.poll(async () => anyCanvasHasInk(host)).toBe(true);

    await drawer.keyboard.press("Control+Z");
    await expect.poll(async () => anyCanvasHasInk(host)).toBe(false);
    await drawStroke(drawer);
    await expect.poll(async () => anyCanvasHasInk(host)).toBe(true);

    await guesser.locator('[data-testid="catchmind-guess-input"]').fill(answer);
    await guesser.locator('[data-testid="catchmind-submit-guess"]').click();
    await expect(host.locator('[data-testid="group-game-host"]')).toContainText("정답");
    await expect(guesser.locator('[data-testid="catchmind-student"]')).toContainText(`정답: ${answer}`);
    await context.close();
  });

  test("runs the typing gartic phone prompt, draw, guess, and reveal phases", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    const roomCode = await createHostRoom(host);
    const students = [];
    for (const name of ["가온", "나래", "다온"]) {
      students.push(await joinStudent(context, roomCode, name));
    }

    await host.locator('[data-testid="start-gartic-phone"]').click();
    await expect(host.locator('[data-testid="gartic-phone-host"]')).toContainText("문장 작성");
    for (const [index, student] of students.entries()) {
      await expect(student.locator('[data-testid="gartic-phone-prompt"]')).toBeVisible();
      await student.locator('[data-testid="phone-prompt-input"]').fill(`라면을 든 친구 ${index + 1}`);
      await student.locator('[data-testid="phone-submit-prompt"]').click();
    }

    await host.locator('[data-testid="advance-gartic-phone"]').click();
    await expect(students[0].locator('[data-testid="gartic-phone-draw"]')).toBeVisible();
    await drawStroke(students[0]);

    await host.locator('[data-testid="advance-gartic-phone"]').click();
    await expect(students[0].locator('[data-testid="gartic-phone-guess"]')).toBeVisible();
    await students[0].locator('[data-testid="phone-guess-input"]').fill("라면을 들고 뛰는 친구");
    await students[0].locator('[data-testid="phone-submit-guess"]').click();

    await host.locator('[data-testid="advance-gartic-phone"]').click();
    await expect(students[0].locator('[data-testid="gartic-phone-reveal"]')).toBeVisible();
    await expect(students[0].locator('[data-testid="phone-chain-card"]').first()).toBeVisible();
    await context.close();
  });

  test("fits on a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await createHostRoom(page);

    await page.locator('[data-testid="start-world"]').click();
    await expect(page.locator('[data-testid="world-map"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
  });

  test("keeps grouped game controls within a phone viewport", async ({ browser }) => {
    const context = await browser.newContext();
    const host = await context.newPage();
    await host.setViewportSize({ width: 390, height: 844 });
    const roomCode = await createHostRoom(host);
    await joinStudent(context, roomCode, "모바일");

    await host.locator('[data-testid="start-catchmind"]').click();
    await expect(host.locator('[data-testid="group-game-host"]')).toBeVisible();
    const overflow = await host.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(2);
    await context.close();
  });

  test("loads the local demo page with seeded teacher and student previews", async ({ page }) => {
    await page.goto("/apps/typing-party/demo.html");
    await expect(page).toHaveTitle("타이핑 파티 데모");
    await expect(page.locator("#hostFrame")).toBeVisible();

    const host = page.frameLocator("#hostFrame");
    const student = page.frameLocator("#studentFrameA");
    await expect(host.locator('[data-testid="stage-title"]')).toHaveText("대기실");
    await expect(host.locator('[data-testid="player-list"]')).toContainText("지아");
    await expect(student.locator('[data-testid="stage-title"]')).toHaveText("대기실");

    await host.locator('[data-testid="start-catchmind"]').click();
    await expect(host.locator('[data-testid="group-game-host"]')).toBeVisible();
    await expect(student.locator('[data-testid="catchmind-student"]')).toBeVisible();
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
