const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
}

async function expectImagesLoaded(page) {
  const brokenImages = await page.locator('img').evaluateAll(async (images) => {
    const urls = Array.from(
      new Set(images.map((image) => image.currentSrc || image.src).filter(Boolean))
    );

    const results = await Promise.all(
      urls.map(
        (url) =>
          new Promise((resolve) => {
            const probe = new Image();
            probe.onload = () => resolve(null);
            probe.onerror = () => resolve(url);
            probe.src = url;

            if (probe.complete) {
              resolve(probe.naturalWidth > 0 ? null : url);
            }
          })
      )
    );

    return results.filter(Boolean).map((url) => new URL(url, window.location.href).pathname);
  });
  expect(brokenImages).toEqual([]);
}

async function dragFirstWorkScenarioOption(page, nextState) {
  const decisionZone = page.locator('#decision-zone');
  const firstOption = page.locator('.option-card').first();
  await expect(firstOption).toBeVisible();
  await firstOption.dragTo(decisionZone);
  await nextState();
}

async function chooseEnglish(page) {
  const englishButton = page.getByRole('button', { name: 'English' });
  await expect(englishButton).toBeVisible();
  await englishButton.click();
  await expect(page.locator('body')).toHaveAttribute('data-active-lang', 'en');
}

const supportPages = [
  { path: '/c11/vocab-support-job-posting.html', visual: '.job-company-img' },
  { path: '/c11/vocab-support-org-chart.html', visual: '.chip-img' },
  { path: '/c11/vocab-support-welfare-balance.html', visual: '.balancer-icon' },
  { path: '/c11/vocab-support-work-scenario.html', visual: '.char-avatar img' }
];

const layoutViewports = [
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 390, height: 844 }
];

test.describe('Chapter 11 Vocabulary Support Activities', () => {
  
  test('index page lists vocabulary support pages inside drawer', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/index.html', { waitUntil: 'domcontentloaded' });

    const drawer = page.locator('details.support-drawer').filter({ hasText: '어휘 보조 활동 및 자료' });
    await expect(drawer).toHaveCount(1);
    
    // Open drawer
    await drawer.locator('summary.support-drawer__summary').click();
    await expect(drawer).toHaveAttribute('open', '');
    await expect(drawer.locator('.support-drawer__links .lesson-link')).toHaveCount(7);
  });

  test('job-posting page matches candidate to job via click-to-select', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-job-posting.html', { waitUntil: 'domcontentloaded' });
    
    // Wait for dynamic render() to finish and settle
    await page.waitForTimeout(500);

    // Click candidate 1 (Kim Ji-woo) -> click Cafe job (job-3)
    const candidate = page.locator('.candidate-card[data-id="cand-1"]');
    const dropzone = page.locator('.job-card[data-id="job-3"]');
    
    await candidate.click();
    await page.waitForTimeout(200);
    await dropzone.click();

    // Verify it is matched
    await expect(dropzone).toHaveClass(/matched/);
    await expect(dropzone.locator('.matched-applicant')).toBeVisible();
  });

  test('org-chart page allows placing rank chip via drag-and-drop', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-org-chart.html', { waitUntil: 'domcontentloaded' });

    const chip = page.locator('.rank-chip[data-rank="부장"]');
    const slot = page.locator('#slot-manager');
    
    await chip.dragTo(slot);

    // Verify slot is filled and chip is placed
    await expect(slot).toHaveClass(/filled/);
    await expect(page.locator('#val-manager')).toHaveText('부장');
    await expect(chip).toHaveClass(/placed/);
  });

  test('welfare-balance page generates essay', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-welfare-balance.html', { waitUntil: 'domcontentloaded' });

    const textarea = page.locator('#paragraph-textbox');
    await expect(textarea).not.toBeEmpty();
    const val = await textarea.inputValue();
    expect(val).toContain('취업을 한다면');
  });

  test('work-scenario page steps through game via drag-and-drop and displays results', async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/c11/vocab-support-work-scenario.html', { waitUntil: 'domcontentloaded' });

    await dragFirstWorkScenarioOption(page, async () => {
      await expect(page.locator('#scene-progress')).toHaveText('2 / 3 단계');
    });
    await dragFirstWorkScenarioOption(page, async () => {
      await expect(page.locator('#scene-progress')).toHaveText('3 / 3 단계');
    });
    await dragFirstWorkScenarioOption(page, async () => {
      await expect(page.locator('#result-panel')).toBeVisible();
    });

    await expect(page.locator('#result-panel')).toBeVisible();
    await expect(page.locator('#result-title')).not.toBeEmpty();
  });

  test('multilingual mode keeps Korean learning text and translates only UI hints', async ({ page }) => {
    await blockExternalRequests(page);

    await page.goto('/c11/vocab-support-job-posting.html', { waitUntil: 'domcontentloaded' });
    await chooseEnglish(page);
    await expect(page.locator('#page-instruct')).toContainText('Drag and drop');
    await expect(page.locator('#candidate-list')).toContainText('가게와 식당');
    await expect(page.locator('#job-list')).toContainText('근무 시간');
    await expect(page.locator('#job-list')).toContainText('연봉이 높다');

    await page.goto('/c11/vocab-support-org-chart.html', { waitUntil: 'domcontentloaded' });
    await chooseEnglish(page);
    await expect(page.locator('#activity-instruct')).toContainText('Drag and drop');
    await expect(page.locator('#prompt-scen-1')).toContainText('[신입 사원]');
    await expect(page.locator('#prompt-scen-1')).toContainText('Which expression');
    await page.locator('.rank-chip[data-rank="부장"]').dragTo(page.locator('#slot-manager'));
    await expect(page.locator('#val-manager')).toHaveText('부장');
    await expect(page.locator('#slot-manager')).toContainText('Department Head');

    await page.goto('/c11/vocab-support-welfare-balance.html', { waitUntil: 'domcontentloaded' });
    await chooseEnglish(page);
    await expect(page.locator('#paragraph-note')).toContainText('Copy only the Korean paragraph');
    const paragraph = await page.locator('#paragraph-textbox').inputValue();
    expect(paragraph).toContain('취업을 한다면');
    expect(paragraph).not.toContain('Translation:');
    expect(paragraph).not.toContain('If I get a job');
    expect(paragraph).not.toContain('Dịch:');

    await page.goto('/c11/vocab-support-work-scenario.html', { waitUntil: 'domcontentloaded' });
    await chooseEnglish(page);
    await expect(page.locator('#decision-label')).toHaveText('Drag your choice card here');
    await expect(page.locator('#scene-time')).toContainText('오전 09:00');
    await expect(page.locator('#story-text')).toContainText('회사에 처음으로 출근했습니다');
    await expect(page.locator('.option-card').first()).toContainText('부장님의 설명');
  });

  test('work-scenario honors stored multilingual choice on first render without translating story text', async ({ page }) => {
    await blockExternalRequests(page);
    await page.addInitScript(() => {
      localStorage.setItem('preferred-lang', 'en');
    });
    await page.goto('/c11/vocab-support-work-scenario.html', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#decision-label')).toHaveText('Drag your choice card here');
    await expect(page.locator('#scene-time')).toContainText('오전 09:00');
    await expect(page.locator('#story-text')).toContainText('회사에 처음으로 출근했습니다');
    await expect(page.locator('.option-card').first()).toContainText('부장님의 설명');
  });

  test('support pages use generated support images as meaningful visual cues', async ({ page }) => {
    for (const supportPage of supportPages) {
      await blockExternalRequests(page);
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(supportPage.path, { waitUntil: 'domcontentloaded' });
      await page.locator(supportPage.visual).first().waitFor();

      const visualBox = await page.locator(supportPage.visual).first().boundingBox();
      expect(visualBox).toBeTruthy();
      expect(Math.min(visualBox.width, visualBox.height)).toBeGreaterThanOrEqual(80);

      const supportImageCount = await page.locator('img[src*="/support-"]').count();
      expect(supportImageCount).toBeGreaterThan(0);
      await expectImagesLoaded(page);
    }
  });

  test('support pages avoid horizontal overflow on tablet, pc, and phone viewports', async ({ page }) => {
    for (const supportPage of supportPages) {
      for (const viewport of layoutViewports) {
        await blockExternalRequests(page);
        await page.setViewportSize(viewport);
        await page.goto(supportPage.path, { waitUntil: 'domcontentloaded' });
        await page.locator(supportPage.visual).first().waitFor();
        await expectNoHorizontalOverflow(page);
      }
    }
  });
});
