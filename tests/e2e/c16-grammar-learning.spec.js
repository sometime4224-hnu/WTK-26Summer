const { test, expect } = require('@playwright/test');

const grammarRoutes = [
  '/c16/grammar1.html',
  '/c16/grammar1-size-match.html',
  '/c16/grammar1-speaking-pro.html',
  '/c16/grammar2.html',
  '/c16/grammar2-umdu-gauge.html',
  '/c16/grammar2-card-builder-pro.html',
  '/c16/grammar2-speaking-pro.html',
  '/c16/grammar3.html',
  '/c16/grammar3-worth-gauge.html',
  '/c16/grammar3-threshold-animation.html',
  '/c16/grammar3-speaking-pro.html',
  '/c16/grammar4.html',
  '/c16/grammar4-workbook-sentence-quiz.html',
  '/c16/grammar4-korea-map-match.html',
  '/c16/grammar4-korea-then-now-map.html',
  '/c16/grammar4-vietnam-map-match.html',
  '/c16/grammar4-vietnam-then-now-map.html',
  '/c16/grammar4-speaking-pro.html',
  // Retained legacy files are intentionally not linked from the learner flow,
  // but still receive accessibility and zoom-regression checks.
  '/c16/grammar4-fame-tag-match.html',
  '/c16/grammar4-fame-tag-match-vietnam.html',
  '/c16/grammar4-vietnam-map-music-match.html'
];

async function blockExternalRequests(page) {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173(?:\/|$))/, (route) => route.abort());
}

function watchLocalFailures(page) {
  const failures = [];
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  return failures;
}

async function chooseUntilResolved(page, choices, nextButton) {
  for (let index = 0; index < 3; index += 1) {
    if (await nextButton.isEnabled()) return;
    const availableIndex = await choices.evaluateAll((buttons) => buttons.findIndex((button) => !button.disabled));
    if (availableIndex < 0) break;
    await choices.nth(availableIndex).click();
  }
}

async function assertVietnamPinCentersSelectTheirTarget(page) {
  await page.locator('.map-image').evaluate((image) => image.decode());
  await page.evaluate(() => document.fonts?.ready);

  const regions = await page.locator('[data-region]').evaluateAll(
    (buttons) => buttons.map((button) => button.dataset.region)
  );

  for (const regionId of regions) {
    await page.locator(`[data-region="${regionId}"]`).click();
    const targets = await page.locator('.pin').evaluateAll((pins) => (
      pins.map((pin) => ({
        id: pin.dataset.target,
        name: pin.getAttribute('aria-label')
      }))
    ));
    expect(targets.length, `${regionId} 필터에는 핀이 있어야 합니다.`).toBeGreaterThan(0);

    for (const target of targets) {
      await page.locator(`[data-region="${regionId}"]`).click();
      const pin = page.locator(`.pin[data-target="${target.id}"]`);
      await pin.evaluate((element) => {
        for (let pass = 0; pass < 2; pass += 1) {
          const rect = element.getBoundingClientRect();
          window.scrollTo(
            window.scrollX,
            window.scrollY + rect.top + (rect.height / 2) - (window.innerHeight / 2)
          );
        }
      });
      const box = await pin.boundingBox();
      expect(box, `${target.id} 핀이 화면에 배치되어야 합니다.`).not.toBeNull();
      expect(box.width, `${target.id} 핀의 터치 폭`).toBeGreaterThanOrEqual(44);
      expect(box.height, `${target.id} 핀의 터치 높이`).toBeGreaterThanOrEqual(44);
      const hit = await page.evaluate((targetId) => {
        const element = document.querySelector(
          `.pin[data-target="${CSS.escape(targetId)}"]`
        );
        for (let pass = 0; pass < 2; pass += 1) {
          const currentRect = element.getBoundingClientRect();
          window.scrollTo(
            window.scrollX,
            window.scrollY + currentRect.top + (currentRect.height / 2) - (window.innerHeight / 2)
          );
        }
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + (rect.width / 2);
        const clientY = rect.top + (rect.height / 2);
        const hitElement = document.elementFromPoint(clientX, clientY);
        if (!hitElement) {
          return {
            clientX,
            clientY,
            hitTarget: null,
            hitTag: null,
            scrollY: window.scrollY,
            scrollMax: document.documentElement.scrollHeight - window.innerHeight
          };
        }
        hitElement.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: 1,
          clientX,
          clientY
        }));
        return {
          clientX,
          clientY,
          hitTarget: hitElement.closest('.pin')?.dataset.target || null,
          hitTag: hitElement.tagName,
          scrollY: window.scrollY,
          scrollMax: document.documentElement.scrollHeight - window.innerHeight
        };
      }, target.id);
      expect(hit.hitTag, `${target.id} 핀 중심 적중 정보: ${JSON.stringify(hit)}`)
        .not.toBeNull();
      await expect(page.locator('#placeName')).toHaveText(target.name);
    }
  }
}

test('C16 문법 메인 1~4는 재시도/정답 확인 뒤에만 다음으로 갈 수 있다', async ({ page }) => {
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);
  const routes = [
    { path: '/c16/grammar1.html', choices: '#quizChoices button', next: '#nextQuizBtn', reveal: '#revealQuizBtn' },
    { path: '/c16/grammar2.html', choices: '#choices button', next: '#nextBtn', reveal: '#revealBtn' },
    { path: '/c16/grammar3.html', choices: '#choices button', next: '#nextBtn', reveal: '#revealBtn' },
    { path: '/c16/grammar4.html', choices: '#choices button', next: '#nextBtn', reveal: '#revealBtn' }
  ];

  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    const choices = page.locator(route.choices);
    const next = page.locator(route.next);
    await expect(choices).toHaveCount(3);
    await expect(next).toBeDisabled();

    await chooseUntilResolved(page, choices, next);
    if (await next.isDisabled()) {
      await expect(page.locator(route.reveal)).toBeVisible();
      await page.locator(route.reveal).click();
    }
    await expect(next).toBeEnabled();
    await expect(page.locator('#quizFeedback, #feedback').first()).not.toHaveText('');
  }
  expect(failures).toEqual([]);
});

test('문법 4 워크북 복습은 특징형과 명사형 문장을 검증하고 로/으로을 구별한다', async ({ page }) => {
  await page.goto('/c16/grammar4-workbook-sentence-quiz.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.removeItem('korean3b.c16.grammar.grammar4-workbook-sentence-quiz'));
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('h1')).toContainText('유명하다');
  await expect(page.locator('#answerInput')).toBeVisible();
  await page.locator('#answerInput').fill('옷이 싸요');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('목표 표현');
  await page.locator('#answerInput').fill('옷이 싸기로 유명해요');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('맞아요');

  // Resolve the remaining feature prompts and move to the first noun prompt.
  for (let index = 0; index < 4; index += 1) {
    await page.locator('#primaryAction').click();
    if (index < 3) {
      const answer = await page.evaluate(() => {
        const hook = window.__c16WorkbookReview;
        return hook.config.items[hook.currentState().currentIndex].answer;
      });
      await page.locator('#answerInput').fill(answer);
      await page.locator('#primaryAction').click();
    }
  }
  await expect(page.locator('[data-review-progress-label]')).toHaveText('5 / 20');
  await page.locator('#answerInput').fill('울릉도는 오징어으로 유명해요');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('목표 표현');
  await page.locator('#answerInput').fill('울릉도는 오징어로 유명해요');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('맞아요');

  await page.locator('#primaryAction').click();
  await page.locator('#answerInput').fill('전주는 비빔밥으로 유명해요');
  await page.locator('#primaryAction').click();
  await expect(page.locator('#reviewFeedback')).toContainText('맞아요');
});

test('문법 4 워크북 퀴즈는 손상된 기록을 덮어쓰지 않고 복구 선택지를 보여 준다', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('korean3b.c16.grammar.grammar4-workbook-sentence-quiz', '{broken');
  });
  await page.goto('/c16/grammar4-workbook-sentence-quiz.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.c16-state-tools')).toContainText('읽을 수 없습니다');
  await expect(page.locator('.c16-state-tools')).toContainText('기록 내려받기');
  expect(await page.evaluate(() => localStorage.getItem('korean3b.c16.grammar.grammar4-workbook-sentence-quiz'))).toBe('{broken');
});

test('문법 1 크기 맞추기는 완료 요약을 다시 열어도 복원한다', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('korean3b.c16.grammar.grammar1-size-match', JSON.stringify({
      version: 1,
      page: 'grammar1-size-match',
      state: {
        index: 14,
        selectedId: null,
        currentScale: 1,
        locked: false,
        completedIds: ['round-1', 'round-2'],
        attemptsByRound: { 'round-1': 2, 'round-2': 1 },
        summary: true
      }
    }));
  });
  await page.goto('/c16/grammar1-size-match.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#resultSummary')).toBeVisible();
  await expect(page.locator('#gameCard')).toBeHidden();
  await expect(page.locator('#resultAttempts')).toHaveText('3');
});

test('문법 2 보조 활동은 이미지 실패 대체와 완료형 직접 입력 검증을 제공한다', async ({ page }) => {
  await page.route('**/assets/c16/grammar2/umdu-gauge/*.webp', (route) => route.abort());
  await page.goto('/c16/grammar2-umdu-gauge.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sceneFallback')).toBeVisible();
  await page.locator('#levelControls button[data-level="1"]').click();
  await expect(page.locator('#levelControls button[data-level="1"]')).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/c16/grammar2-card-builder-pro.html', { waitUntil: 'domcontentloaded' });
  await page.locator('#customReasonInput').fill('시간이 없어서');
  await page.locator('#customActionInput').fill('운동하다');
  await page.locator('#customApplyBtn').click();
  await expect(page.locator('#customFeedback')).toContainText('사전형');
  await page.locator('#customActionInput').fill('운동할');
  await page.locator('#customApplyBtn').click();
  await expect(page.locator('#customFeedback')).toContainText('내 문장을 만들었어요');
  await expect(page.locator('#practiceActions')).toBeVisible();
});

test('문법 1~4 말하기 화면은 문법별 제목과 입력 대체 응답을 제공한다', async ({ page }) => {
  const pages = [
    { path: '/c16/grammar1-speaking-pro.html', title: 'N만 하다 말하기' },
    { path: '/c16/grammar2-speaking-pro.html', title: '생각도 못 하다 말하기' },
    { path: '/c16/grammar3-speaking-pro.html', title: '만하다 말하기' },
    { path: '/c16/grammar4-speaking-pro.html', title: '유명한 것을 소개해요' }
  ];
  for (const item of pages) {
    await page.goto(item.path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText(item.title);
    await page.locator('#typedResponseInput').fill('직접 입력한 응답입니다.');
    await page.locator('#typedSubmitBtn').click();
    await expect(page.locator('#nextBtn')).toBeEnabled();
  }
});

test('한국 문화 지도는 모든 대표 태그의 지도·이미지 탐색을 바로 제공하고 확인 흐름을 유지한다', async ({ page }) => {
  await page.goto('/c16/grammar4-korea-map-match.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#pinLayer .pin')).toHaveCount(3);
  await expect(page.locator('#mapAction')).toBeVisible();
  await expect(page.locator('#photoAction')).toBeVisible();
  await expect(page.locator('#tagGrid .tag-actions')).toHaveCount(6);

  const audit = await page.evaluate(() => {
    const hasSecureBlankTarget = (link) => {
      if (!link || link.target !== '_blank') return false;
      const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean));
      return rel.has('noopener') && rel.has('noreferrer');
    };
    const pairs = [];
    const domLinkIssues = [];

    for (const target of targets) {
      state.region = target.region;
      state.targetId = target.id;
      state.tagId = target.tags[0];
      state.confirmed = false;
      render();

      if (mapAction.hidden || photoAction.hidden) {
        domLinkIssues.push(`${target.id}: output links`);
      }

      for (const tagId of target.tags) {
        const mapHref = mapsUrl(target, tagId);
        const imageHref = photosUrl(target, tagId);
        const mapUrl = mapHref ? new URL(mapHref) : null;
        const imageUrl = imageHref ? new URL(imageHref) : null;
        const tile = document.querySelector(
          `[data-tag="${CSS.escape(tagId)}"]`
        )?.closest('.tag-tile');
        const mapLinkElement = tile?.querySelector('a.map-link');
        const imageLinkElement = tile?.querySelector('a.photo-link');

        pairs.push({
          targetId: target.id,
          tagId,
          mapHost: mapUrl?.hostname || '',
          mapPath: mapUrl?.pathname || '',
          mapApi: mapUrl?.searchParams.get('api') || '',
          mapQuery: mapUrl?.searchParams.get('query') || '',
          imageHost: imageUrl?.hostname || '',
          imageMode: imageUrl?.searchParams.get('tbm') || '',
          imageQuery: imageUrl?.searchParams.get('q') || ''
        });

        if (
          !mapLinkElement
          || mapLinkElement.href !== mapHref
          || !hasSecureBlankTarget(mapLinkElement)
        ) {
          domLinkIssues.push(`${target.id}/${tagId}: map link`);
        }
        if (
          !imageLinkElement
          || imageLinkElement.href !== imageHref
          || !hasSecureBlankTarget(imageLinkElement)
        ) {
          domLinkIssues.push(`${target.id}/${tagId}: image link`);
        }
      }
    }

    const seoul = targets.find((target) => target.id === 'seoul');
    const jeju = targets.find((target) => target.id === 'jeju');
    return {
      pairCount: pairs.length,
      invalidMaps: pairs.filter((item) => (
        item.mapHost !== 'www.google.com'
        || item.mapPath !== '/maps/search/'
        || item.mapApi !== '1'
        || !item.mapQuery
      )),
      invalidImages: pairs.filter((item) => (
        item.imageHost !== 'www.google.com'
        || item.imageMode !== 'isch'
        || !item.imageQuery
      )),
      domLinkIssues,
      preciseQueries: {
        towerMap: new URL(mapsUrl(seoul, 'nSeoulTower')).searchParams.get('query'),
        towerImage: new URL(photosUrl(seoul, 'nSeoulTower')).searchParams.get('q'),
        tangerineMap: new URL(mapsUrl(jeju, 'tangerine')).searchParams.get('query'),
        tangerineImage: new URL(photosUrl(jeju, 'tangerine')).searchParams.get('q')
      }
    };
  });

  expect(audit.pairCount).toBe(78);
  expect(audit.invalidMaps).toEqual([]);
  expect(audit.invalidImages).toEqual([]);
  expect(audit.domLinkIssues).toEqual([]);
  expect(audit.preciseQueries).toEqual({
    towerMap: 'N서울타워 서울',
    towerImage: 'N서울타워 서울 대한민국',
    tangerineMap: '제주 감귤체험농장',
    tangerineImage: '제주 감귤 과수원 대한민국'
  });

  await page.locator('[data-region="capital"]').click();
  await page.locator('[data-region="gangwon"]').click();
  await expect(page.locator('[data-region="gangwon"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#pinLayer .pin')).toHaveCount(2);
  await expect(page.locator('#pinLayer .is-muted')).toHaveCount(0);
  await page.locator('[data-tag]').first().focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-tag]').first()).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#checkSentenceBtn').click();
  await expect(page.locator('#mapFeedback')).toContainText('확인했어요');
  await expect(page.locator('#mapAction')).toBeVisible();
  await expect(page.locator('#photoAction')).toBeVisible();
});

test('베트남 지도는 확인 전에도 탐색 링크를 제공하고 선택 상태를 복원한다', async ({ page }) => {
  await page.goto('/c16/grammar4-vietnam-map-match.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#mapAction')).toBeVisible();
  await expect(page.locator('#photoAction')).toBeVisible();
  await expect(page.locator('#tagGrid .tag-actions')).not.toHaveCount(0);
  await page.locator('[data-region="central"]').click();
  await expect(page.locator('[data-region="central"]')).toBeFocused();
  await expect(page.locator('#mapAction')).toBeVisible();
  await expect(page.locator('#photoAction')).toBeVisible();
  await page.locator('#checkSentenceBtn').click();
  await expect(page.locator('#mapFeedback')).toContainText('확인했어요');
  await expect(page.locator('#mapAction')).toBeVisible();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-region="central"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#mapAction')).toBeVisible();
});

test('베트남 지도는 모든 사용 태그의 이미지 검색과 실제·표시 좌표를 구분한다', async ({ page }) => {
  await page.goto('/c16/grammar4-vietnam-map-match.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-region="all"]').click();

  const audit = await page.evaluate(() => {
    const pairs = targets.flatMap((target) => (
      target.tags.map((tagId) => {
        const href = photosUrl(target, tagId);
        const url = href ? new URL(href) : null;
        const query = url?.searchParams.get('q') || '';
        const mapHref = mapsUrl(target, tagId);
        const mapUrl = mapHref ? new URL(mapHref) : null;
        const expectedMapQuery = mapQueries[tagId]
          ? `${mapQueries[tagId]}, ${target.vi}, Vietnam`
          : '';
        const isFood = Object.prototype.hasOwnProperty.call(foodMapQueries, tagId);
        return {
          targetId: target.id,
          tagId,
          href,
          host: url?.hostname || '',
          imageMode: url?.searchParams.get('tbm') || '',
          query,
          mapHref,
          mapHost: mapUrl?.hostname || '',
          mapPath: mapUrl?.pathname || '',
          mapApi: mapUrl?.searchParams.get('api') || '',
          mapQuery: mapUrl?.searchParams.get('query') || '',
          expectedMapQuery,
          isFood
        };
      })
    ));
    const correctedIds = ['condao', 'kontum', 'camau', 'baclieu'];
    const shifted = targets.filter((target) => (
      Number.isFinite(target.displayX) || Number.isFinite(target.displayY)
    ));
    const domLinkIssues = [];
    const hasSecureBlankTarget = (link) => {
      if (!link || link.target !== '_blank') return false;
      const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean));
      return rel.has('noopener') && rel.has('noreferrer');
    };

    for (const target of targets) {
      state.region = target.region;
      state.targetId = target.id;
      state.tagId = target.tags[0];
      state.confirmed = true;
      render();

      const actualNearIds = [...document.querySelectorAll('[data-near]')]
        .map((button) => button.dataset.near);
      const expectedNearIds = targets
        .filter((item) => item.region === target.region && item.id !== target.id)
        .sort((a, b) => (
          Math.hypot(a.x - target.x, a.y - target.y)
          - Math.hypot(b.x - target.x, b.y - target.y)
        ))
        .slice(0, actualNearIds.length)
        .map((item) => item.id);
      if (actualNearIds.join('|') !== expectedNearIds.join('|')) {
        domLinkIssues.push(`${target.id}: nearby order`);
      }

      for (const tagId of target.tags) {
        const tile = document.querySelector(
          `[data-tag="${CSS.escape(tagId)}"]`
        )?.closest('.tag-tile');
        const photo = tile?.querySelector('a.photo-link');
        const map = tile?.querySelector('a.map-link');
        const expectedPhotoHref = photosUrl(target, tagId);
        const expectedMapHref = mapsUrl(target, tagId);
        const context = `${target.id}/${tagId}`;

        if (
          !photo
          || photo.href !== expectedPhotoHref
          || !hasSecureBlankTarget(photo)
        ) {
          domLinkIssues.push(`${context}: image link`);
        }
        if (!expectedMapHref) {
          if (map) domLinkIssues.push(`${context}: unexpected map`);
        } else if (
          !map
          || map.href !== expectedMapHref
          || !hasSecureBlankTarget(map)
        ) {
          domLinkIssues.push(`${context}: map link`);
        }
      }
    }

    state.region = 'all';
    state.targetId = targets[0].id;
    state.tagId = targets[0].tags[0];
    state.confirmed = true;
    render();

    return {
      pairCount: pairs.length,
      missingImages: pairs.filter((item) => (
        !item.href
        || item.host !== 'www.google.com'
        || item.imageMode !== 'isch'
        || !item.query
      )),
      invalidMaps: pairs.filter((item) => (
        item.expectedMapQuery
          ? (
              !item.mapHref
              || item.mapHost !== 'www.google.com'
              || item.mapPath !== '/maps/search/'
              || item.mapApi !== '1'
              || item.mapQuery !== item.expectedMapQuery
            )
          : Boolean(item.mapHref)
      )),
      domLinkIssues,
      nonFoodWithFoodSuffix: pairs.filter((item) => (
        !item.isFood && /Vietnam food$/i.test(item.query)
      )),
      foodWithoutFoodSuffix: pairs.filter((item) => (
        item.isFood && !/Vietnam food$/i.test(item.query)
      )),
      coolWeather: pairs.find((item) => (
        item.targetId === 'dalat' && item.tagId === 'coolWeather'
      )),
      coolWeatherMap: mapsUrl(
        targets.find((target) => target.id === 'dalat'),
        'coolWeather'
      ),
      preservedMapQueries: {
        bunCha: mapQueries.bunCha,
        coconut: mapQueries.coconut,
        tea: mapQueries.tea
      },
      bunChaMapUrl: mapsUrl(
        targets.find((target) => target.id === 'hanoi'),
        'bunCha'
      ),
      bunChaImageUrl: photosUrl(
        targets.find((target) => target.id === 'hanoi'),
        'bunCha'
      ),
      correctedCoordinates: Object.fromEntries(correctedIds.map((id) => {
        const target = targets.find((item) => item.id === id);
        return [id, { x: target.x, y: target.y }];
      })),
      shiftedIds: shifted.map((target) => target.id),
      shiftedDomIsValid: shifted.every((target) => {
        const pin = document.querySelector(
          `.pin[data-target="${CSS.escape(target.id)}"]`
        );
        const anchor = document.querySelector(
          `.pin-anchor[data-anchor-target="${CSS.escape(target.id)}"]`
        );
        const leader = document.querySelector(
          `.pin-leader[data-leader-target="${CSS.escape(target.id)}"]`
        );
        const label = pin?.nextElementSibling;
        if (!pin || !anchor || !leader || !label) return false;
        return parseFloat(pin.style.getPropertyValue('--display-x'))
            === (target.displayX ?? target.x)
          && parseFloat(pin.style.getPropertyValue('--display-y'))
            === (target.displayY ?? target.y)
          && parseFloat(anchor.style.getPropertyValue('--x')) === target.x
          && parseFloat(anchor.style.getPropertyValue('--y')) === target.y
          && (!['left', 'above', 'below'].includes(target.labelPlacement)
            || label.classList.contains(`is-${target.labelPlacement}`));
      })
    };
  });

  expect(audit.pairCount).toBeGreaterThan(280);
  expect(audit.missingImages).toEqual([]);
  expect(audit.invalidMaps).toEqual([]);
  expect(audit.domLinkIssues).toEqual([]);
  expect(audit.nonFoodWithFoodSuffix).toEqual([]);
  expect(audit.foodWithoutFoodSuffix).toEqual([]);
  expect(audit.coolWeather).toMatchObject({
    query: 'Da Lat cool weather Vietnam',
    isFood: false
  });
  expect(audit.coolWeatherMap).toBe('');
  expect(audit.preservedMapQueries).toEqual({
    bunCha: 'Bun Cha Huong Lien',
    coconut: 'coconut village',
    tea: 'tea plantation'
  });
  expect(
    new URL(audit.bunChaMapUrl).searchParams.get('query')
  ).toBe('Bun Cha Huong Lien, Hà Nội, Vietnam');
  expect(
    new URL(audit.bunChaImageUrl).searchParams.get('q')
  ).toBe('Bun Cha Huong Lien, Hà Nội, Vietnam food');
  expect(audit.correctedCoordinates).toEqual({
    condao: { x: 52.8, y: 95 },
    kontum: { x: 60, y: 57.5 },
    camau: { x: 36, y: 95.5 },
    baclieu: { x: 45, y: 91 }
  });
  expect(audit.shiftedIds.length).toBeGreaterThan(0);
  expect(audit.shiftedDomIsValid).toBe(true);

  await page.locator('[data-region="north"]').click();
  await page.locator('#checkSentenceBtn').click();
  await expect(page.locator('#photoAction')).toBeVisible();
  await expect(page.locator('#photoAction')).toHaveAttribute(
    'aria-label',
    /이미지 검색 결과 보기$/
  );
  await expect(page.locator('#photoAction')).not.toHaveAttribute(
    'aria-label',
    /음식 사진/
  );
  await expect(page.locator('#photoAction')).toHaveAttribute('target', '_blank');
  await expect(page.locator('#photoAction')).toHaveAttribute(
    'rel',
    /^(?=.*\bnoopener\b)(?=.*\bnoreferrer\b).+$/
  );

  await page.locator('[data-region="all"]').click();
  await page.locator('.pin[data-target="quangtri"]').click();
  await page.locator('#zoomInBtn').click();
  const zoom = await page.evaluate(() => {
    const target = targets.find((item) => item.id === 'quangtri');
    const rect = document.querySelector('#mapCanvas').getBoundingClientRect();
    const mapLayer = document.querySelector('#mapLayer');
    const matrix = new DOMMatrixReadOnly(mapLayer.style.transform);
    const scale = 1.35;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const panFor = (x, y) => ({
      x: clamp(
        (rect.width / 2) - ((rect.width * x / 100) * scale),
        rect.width * (1 - scale),
        0
      ),
      y: clamp(
        (rect.height / 2) - ((rect.height * y / 100) * scale),
        rect.height * (1 - scale),
        0
      )
    });
    return {
      actual: { x: matrix.e, y: matrix.f },
      real: panFor(target.x, target.y),
      display: panFor(target.displayX, target.displayY),
      nearIds: [...document.querySelectorAll('[data-near]')].map(
        (button) => button.dataset.near
      ),
      expectedNearIds: targets
        .filter((item) => item.region === target.region && item.id !== target.id)
        .sort((a, b) => (
          Math.hypot(a.x - target.x, a.y - target.y)
          - Math.hypot(b.x - target.x, b.y - target.y)
        ))
        .slice(0, 6)
        .map((item) => item.id)
    };
  });
  expect(zoom.actual.x).toBeCloseTo(zoom.real.x, 0);
  expect(zoom.actual.y).toBeCloseTo(zoom.real.y, 0);
  expect(
    Math.hypot(
      zoom.actual.x - zoom.display.x,
      zoom.actual.y - zoom.display.y
    )
  ).toBeGreaterThan(3);
  expect(zoom.nearIds).toEqual(zoom.expectedNearIds);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 844 },
  { width: 720, height: 450 }
]) {
  test(`베트남 모든 지역 필터의 핀 중심은 ${viewport.width}px에서 올바른 장소를 선택한다`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/c16/grammar4-vietnam-map-match.html', {
      waitUntil: 'domcontentloaded'
    });
    await assertVietnamPinCentersSelectTheirTarget(page);
  });
}

test('한국·베트남 과거와 현재 비교 지도는 확인 뒤에만 사진 탐색 링크를 만든다', async ({ page }) => {
  const maps = [
    { path: '/c16/grammar4-korea-then-now-map.html', region: 'gangwon' },
    { path: '/c16/grammar4-vietnam-then-now-map.html', region: 'central' }
  ];
  for (const map of maps) {
    await page.goto(map.path, { waitUntil: 'domcontentloaded' });
    const externalLinks = page.locator('main a[href^="https://www.google."]');
    await expect(externalLinks).toHaveCount(0);
    await page.locator(`[data-region="${map.region}"]`).click();
    await expect(page.locator(`[data-region="${map.region}"]`)).toBeFocused();
    await page.locator('#checkSentenceBtn').click();
    await expect(page.locator('#mapFeedback')).toContainText('확인했어요');
    await expect(externalLinks).not.toHaveCount(0);
  }
});

test('문법 3 기준선은 박물관의 부정 근거를 올바르게 판단한다', async ({ page }) => {
  await page.goto('/c16/grammar3-worth-gauge.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-activity="5"]').click();
  await expect(page.locator('#reasonLabel')).toHaveText('부정 근거');
  await page.locator('[data-decision="not-worth"]').click();
  await expect(page.locator('#feedback')).toContainText('맞아요');
  await expect(page.locator('#sentenceText')).toContainText('만하지 않아요');
});

test('문법 3 기준 충족 활동은 선택 상태와 reduced-motion 안전 제어를 제공한다', async ({ page }) => {
  await page.goto('/c16/grammar3-threshold-animation.html', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-index="1"]').click();
  await expect(page.locator('[data-index="1"]')).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#playBtn').click();
  await expect(page.locator('#statusBadge')).not.toHaveText('');
});

test('C16 말하기는 직접 입력 응답 또는 건너뜀을 구분하고, 기록 창은 키보드로 닫힌다', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/c16/grammar3-speaking-pro.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1')).toContainText('말하기');
  await expect(page.locator('#sessionResult')).toBeHidden();
  await expect(page.locator('#completeBadge')).toBeHidden();
  const next = page.locator('#nextBtn');
  await expect(next).toBeDisabled();
  await page.locator('#typedResponseInput').fill('진해 벚꽃 길은 정말 가 볼 만해요.');
  await page.locator('#typedSubmitBtn').click();
  await expect(next).toBeEnabled();
  await expect(page.locator('#skipBtn')).toBeHidden();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#nextBtn')).toBeEnabled();

  await page.locator('#historyButton').click();
  await expect(page.locator('#historyModal')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('#closeHistoryBtn')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#historyModal')).toHaveClass(/hidden/);

  await page.locator('#nextBtn').click();
  await page.locator('#skipBtn').click();
  // A skipped item does not expose the completion badge as a completed learning session.
  for (let index = 0; index < 6; index += 1) await page.locator('#skipBtn').click();
  await expect(page.locator('#sessionResult')).toBeVisible();
  await expect(page.locator('#completeBadge')).toHaveClass(/hidden/);
});

test('C16 말하기는 손상된 세션을 덮어쓰지 않고 복구·초기화 경로를 제공한다', async ({ page }) => {
  const key = 'korean3b.c16.grammar.grammar3-speaking-pro';
  await page.addInitScript((sessionKey) => {
    localStorage.setItem(sessionKey, '{broken');
  }, key);
  await page.goto('/c16/grammar3-speaking-pro.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#sessionRecovery')).toContainText('이전 세션 기록을 읽을 수 없어요');
  await expect(page.locator('#sessionRecovery')).toContainText('기록 복사');
  await expect(page.locator('#sessionRecovery')).toContainText('기록 내려받기');
  expect(await page.evaluate((sessionKey) => localStorage.getItem(sessionKey), key)).toBe('{broken');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-session-recovery-reset]').click();
  await expect(page.locator('#sessionRecovery')).toHaveCount(0);
  await expect(page.locator('#typedResponseInput')).toBeVisible();
  expect(await page.evaluate((sessionKey) => localStorage.getItem(sessionKey), key)).not.toBe('{broken');
});

test('C16 말하기는 IndexedDB에 저장한 녹음을 세션 결과에서 다시 불러온다', async ({ page }) => {
  const sessionKey = 'korean3b.c16.grammar.grammar3-speaking-pro';
  const recordingKey = 'c16-grammar3-manhada-pro-v1:g3-1';
  await page.goto('/c16/grammar3-speaking-pro.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async ({ sessionKey, recordingKey }) => {
    localStorage.setItem(sessionKey, JSON.stringify({
      version: 1,
      idx: 8,
      selectedSpeaker: '',
      selectedSpeakerLabel: '',
      sessionScores: [100],
      sessionLog: [{
        id: 'g3-1', scene: '진해 벚꽃 길', spoken: '진해 벚꽃 길은 정말 가 볼 만해요.',
        score: 100, accuracy: 100, completeness: 100, feedback: '좋아요.',
        target: '진해 벚꽃 길은 정말 가 볼 만해요.'
      }],
      skippedItemIds: [],
      savedRecordingItemId: 'g3-1',
      savedRecordingItemIds: ['g3-1']
    }));
    await new Promise((resolve, reject) => {
      const request = indexedDB.open('korean3b-c16-speaking-recordings', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('recordings')) {
          request.result.createObjectStore('recordings');
        }
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('recordings', 'readwrite');
        transaction.objectStore('recordings').put(new Blob(['saved-audio'], { type: 'audio/webm' }), recordingKey);
        transaction.onerror = () => { db.close(); reject(transaction.error); };
        transaction.oncomplete = () => { db.close(); resolve(); };
      };
    });
  }, { sessionKey, recordingKey });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('.sp-session-audio__player')).toHaveCount(1);
});

test('C16 건너뛰기 링크는 키보드 초점을 실제 학습 영역으로 옮긴다', async ({ page }) => {
  const cases = [
    { path: '/c16/grammar1.html', skip: '.c16-skip-link', target: '#learning-task' },
    { path: '/c16/grammar3-worth-gauge.html', skip: '.c16-skip-link', target: '#main-content' },
    { path: '/c16/grammar3-speaking-pro.html', skip: '.sp-c16-skip', target: '#main-content' }
  ];
  for (const item of cases) {
    await page.goto(item.path, { waitUntil: 'domcontentloaded' });
    const skip = page.locator(item.skip).first();
    await expect(skip).toBeAttached();
    await skip.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(item.target)).toBeFocused();
  }
});

test('핵심 C16 문법 동선은 320/390 및 200% 확대 환경에서 목표와 첫 행동을 함께 보여 준다', async ({ page }) => {
  test.setTimeout(90_000);
  await blockExternalRequests(page);
  const cdp = await page.context().newCDPSession(page);
  const cases = [
    { width: 320, height: 844, dpr: 1 },
    { width: 390, height: 844, dpr: 1 },
    { width: 720, height: 450, dpr: 2 }
  ];
  const flows = [
    { path: '/c16/grammar1.html', action: '#quizChoices button' },
    { path: '/c16/grammar2.html', action: '#choices button' },
    { path: '/c16/grammar3.html', action: '#choices button' },
    { path: '/c16/grammar4.html', action: '#choices button' },
    { path: '/c16/grammar4-workbook-sentence-quiz.html', action: '#answerInput' },
    { path: '/c16/grammar1-size-match.html', action: '#choiceList .choice-card' },
    { path: '/c16/grammar2-card-builder-pro.html', action: '[data-reason]' },
    { path: '/c16/grammar3-worth-gauge.html', action: '[data-activity]' },
    { path: '/c16/grammar4-korea-map-match.html', action: '[data-region]' },
    { path: '/c16/grammar4-vietnam-map-match.html', action: '[data-region]' },
    { path: '/c16/grammar4-speaking-pro.html', action: '#recordBtn' }
  ];

  for (const viewport of cases) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      screenWidth: viewport.width * (viewport.dpr === 2 ? 2 : 1),
      screenHeight: viewport.height * (viewport.dpr === 2 ? 2 : 1),
      deviceScaleFactor: viewport.dpr,
      mobile: false
    });
    for (const flow of flows) {
      await page.goto(flow.path, { waitUntil: 'domcontentloaded' });
      const action = page.locator(flow.action).first();
      await expect(action).toBeVisible();
      // Let deferred focus guidance run before checking the first viewport.
      await page.waitForTimeout(140);
      const layout = await action.evaluate((element) => {
        const heading = document.querySelector('h1');
        const actionRect = element.getBoundingClientRect();
        const headingRect = heading.getBoundingClientRect();
        return {
          actionTop: actionRect.top,
          actionBottom: actionRect.bottom,
          headingTop: headingRect.top,
          overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          height: window.innerHeight
        };
      });
      expect(layout.headingTop).toBeLessThanOrEqual(280);
      expect(layout.actionTop).toBeGreaterThanOrEqual(0);
      expect(layout.actionBottom, `${flow.path} at ${viewport.width}×${viewport.height}`).toBeLessThanOrEqual(layout.height + 1);
      expect(layout.overflows).toBe(false);
    }
  }
});

test('C16 문법 페이지는 확대 제한/QR 없이 로컬 자원을 정상 로드하고 가로로 넘치지 않는다', async ({ page }) => {
  test.setTimeout(90_000);
  await blockExternalRequests(page);
  const failures = watchLocalFailures(page);
  await page.setViewportSize({ width: 390, height: 844 });

  for (const route of grammarRoutes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toHaveCount(1);
    const metrics = await page.evaluate(() => ({
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      qrImports: [...document.scripts].filter((script) => String(script.src).includes('page-qr')).length
    }));
    expect(metrics.viewport).not.toMatch(/maximum-scale|user-scalable/i);
    expect(metrics.horizontalOverflow).toBe(false);
    expect(metrics.qrImports).toBe(0);
  }
  expect(failures).toEqual([]);
});
