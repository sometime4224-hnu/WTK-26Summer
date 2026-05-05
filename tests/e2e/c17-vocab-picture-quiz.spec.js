const { test, expect } = require("@playwright/test");

async function blockExternalRequests(page) {
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://cdnjs.cloudflare.com/**", (route) => route.abort());
}

test("c17 picture vocabulary quiz is linked from chapter and vocabulary pages", async ({ page }) => {
  await blockExternalRequests(page);

  await page.goto("/c17/index.html", { waitUntil: "domcontentloaded" });
  const chapterLink = page.locator('a[href="vocab-support-picture-quiz.html"]');
  await expect(chapterLink).toHaveCount(1);
  await expect(chapterLink).toContainText("그림 보고 어휘 고르기");

  await page.goto("/c17/vocabulary.html", { waitUntil: "domcontentloaded" });
  const vocabLink = page.locator('.topbar a[href="vocab-support-picture-quiz.html"]');
  await expect(vocabLink).toHaveCount(1);
  await expect(vocabLink).toContainText("그림퀴즈");
});

test("c17 picture vocabulary quiz masks card text and accepts a correct answer", async ({ page }) => {
  await blockExternalRequests(page);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().includes("/assets/c17/vocabulary/images/cards/") && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/c17/vocab-support-picture-quiz.html", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("그림 보고 어휘 고르기");
  await expect(page.locator(".option-btn")).toHaveCount(4);
  await expect(page.locator(".visual-mask--top")).toHaveCount(1);
  await page.waitForFunction(() => {
    const image = document.querySelector("#visualImage");
    return image && image.complete && image.naturalWidth > 0;
  });
  const src = await page.locator("#visualImage").evaluate((image) => image.currentSrc);
  expect(src).toContain("/assets/c17/vocabulary/images/cards/");

  const answer = await page.evaluate(() => {
    const quiz = window.C17_PICTURE_QUIZ;
    return quiz.state.questions[quiz.state.index].answer;
  });
  await page.getByRole("button", { name: new RegExp(answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }).click();
  await expect(page.locator("#feedbackText")).toContainText("정답");
  await expect(page.locator("#nextBtn")).toBeEnabled();
  await expect(page.locator(".option-btn.is-correct")).toHaveCount(1);
  expect(errors).toEqual([]);
});
