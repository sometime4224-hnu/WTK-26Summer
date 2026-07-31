const { test, expect } = require('@playwright/test');

const pages = [
  {
    country: 'mongolia',
    path: '/c16/grammar4-mongolia-map-match.html',
    storageKey: 'korean3bimprove:c16:grammar4:mongolia-map-match:v1',
    sentence: '울란바토르는 수흐바타르 광장으로 유명해요.',
    targetCount: 17,
    tagCount: 74,
    asset: 'mongolia-region-map.webp',
    expectsShiftedPins: true
  },
  {
    country: 'kazakhstan',
    path: '/c16/grammar4-kazakhstan-map-match.html',
    storageKey: 'korean3bimprove:c16:grammar4-kazakhstan-map:v1',
    sentence: '아스타나는 바이테렉 기념탑으로 유명해요.',
    targetCount: 17,
    tagCount: 84,
    asset: 'kazakhstan-region-map.webp',
    expectsShiftedPins: true
  },
  {
    country: 'syria',
    path: '/c16/grammar4-syria-map-match.html',
    storageKey: 'korean3bimprove:c16:grammar4:syria-map:v1',
    sentence: '다마스쿠스는 고대 구시가지로 유명해요.',
    targetCount: 17,
    tagCount: 85,
    asset: 'syria-region-map.webp',
    expectsShiftedPins: true
  },
  {
    country: 'thailand',
    path: '/c16/grammar4-thailand-map-match.html',
    storageKey: 'korean3bimprove:c16:grammar4:thailand-map-match:v1',
    sentence: '방콕은 왕궁으로 유명해요.',
    targetCount: 17,
    tagCount: 85,
    asset: 'thailand-region-map.webp',
    expectsShiftedPins: true
  }
];

const requiredViewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 844 },
  { width: 720, height: 450 }
];

async function openClean(page, config) {
  await page.goto(config.path, { waitUntil: 'domcontentloaded' });
  await page.evaluate((key) => localStorage.removeItem(key), config.storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function assertFilteredPinCentersSelectTheirTarget(page) {
  await page.locator('.map-image').evaluate((image) => image.decode());
  await page.evaluate(() => document.fonts?.ready);

  const regions = await page.locator('[data-region]').evaluateAll(
    (buttons) => buttons.map((button) => button.dataset.region)
  );

  for (const regionId of regions) {
    const regionButton = page.locator(`[data-region="${regionId}"]`);
    await regionButton.click();
    const targets = await page.locator('.pin:visible').evaluateAll((pins) => (
      pins.map((pin) => ({
        id: pin.dataset.target,
        name: pin.getAttribute('aria-label')
      }))
    ));

    expect(targets.length, `${regionId} 필터에는 핀이 있어야 합니다.`).toBeGreaterThan(0);

    for (const target of targets) {
      // Clicking a pin reached from "전체" narrows the state to that pin's
      // region, so restore the requested filter before each hit test.
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
      const touchSize = await pin.evaluate((element) => {
        const style = getComputedStyle(element, '::after');
        return {
          width: parseFloat(style.width),
          height: parseFloat(style.height)
        };
      });
      expect(touchSize.width, `${target.id} 핀의 터치 폭`).toBeGreaterThanOrEqual(44);
      expect(touchSize.height, `${target.id} 핀의 터치 높이`).toBeGreaterThanOrEqual(44);
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

for (const config of pages) {
  test.describe(`${config.country} country map page`, () => {
    test('renders complete content, a valid generated map, and exact search actions', async ({ page }) => {
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await openClean(page, config);
      await expect(page.locator('#sentenceText')).toHaveText(config.sentence);
      await expect(page.locator('.pin')).toHaveCount(config.targetCount);
      await expect(page.locator('#photoAction')).toBeVisible();

      const snapshot = await page.evaluate(() => {
        const data = window.C16_COUNTRY_MAP_DATA;
        const image = document.querySelector('.map-image');
        const initialTarget = data.targets.find(
          (target) => target.id === data.initialState.targetId
        );
        const initialTag = data.tags[data.initialState.tagId];
        return {
          countryId: data.countryId,
          targetCount: data.targets.length,
          tagCount: Object.keys(data.tags).length,
          allTagsHaveImages: Object.values(data.tags).every(
            (tag) => typeof tag.imageQuery === 'string' && tag.imageQuery.length > 0
          ),
          validReferences: data.targets.every(
            (target) => target.tagIds.every((tagId) => data.tags[tagId])
          ),
          noTautologicalPlaceTags: data.targets.every(
            (target) => target.tagIds.every(
              (tagId) => data.tags[tagId].label.trim() !== target.name.trim()
            )
          ),
          imageComplete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          expectedImageQuery: initialTag.imageQuery,
          expectedMapQuery: initialTag.mapQuery || null,
          expectedRegion: initialTarget.region,
          shiftedTargets: data.targets
            .filter((target) => (
              Number.isFinite(target.displayX)
              || Number.isFinite(target.displayY)
            ))
            .map((target) => target.id),
          validDisplayCoordinates: data.targets.every((target) => (
            (target.displayX === undefined
              || (Number.isFinite(target.displayX)
                && target.displayX >= 0
                && target.displayX <= 100))
            && (target.displayY === undefined
              || (Number.isFinite(target.displayY)
                && target.displayY >= 0
                && target.displayY <= 100))
          )),
          validShiftDecorations: data.targets.every((target) => {
            const shifted = Number.isFinite(target.displayX)
              || Number.isFinite(target.displayY);
            const anchor = document.querySelector(
              `.pin-anchor[data-anchor-target="${CSS.escape(target.id)}"]`
            );
            const leader = document.querySelector(
              `.pin-leader[data-leader-target="${CSS.escape(target.id)}"]`
            );
            if (!shifted) return !anchor && !leader;
            if (!anchor || !leader) return false;
            const pin = document.querySelector(
              `.pin[data-target="${CSS.escape(target.id)}"]`
            );
            return parseFloat(pin.style.getPropertyValue('--x'))
                === (target.displayX ?? target.x)
              && parseFloat(pin.style.getPropertyValue('--y'))
                === (target.displayY ?? target.y)
              && parseFloat(anchor.style.getPropertyValue('--anchor-x')) === target.x
              && parseFloat(anchor.style.getPropertyValue('--anchor-y')) === target.y;
          }),
          validLabelPlacements: data.targets.every((target) => {
            const label = document.querySelector(
              `.pin[data-target="${CSS.escape(target.id)}"] + .pin-label`
            );
            return label.dataset.labelPlacement
              === (target.labelPlacement || 'right');
          })
        };
      });

      expect(snapshot).toMatchObject({
        countryId: config.country,
        targetCount: config.targetCount,
        tagCount: config.tagCount,
        allTagsHaveImages: true,
        validReferences: true,
        noTautologicalPlaceTags: true,
        imageComplete: true,
        validDisplayCoordinates: true,
        validShiftDecorations: true,
        validLabelPlacements: true
      });
      if (config.expectsShiftedPins) {
        expect(snapshot.shiftedTargets.length).toBeGreaterThan(0);
      } else {
        expect(snapshot.shiftedTargets).toEqual([]);
      }
      expect(snapshot.naturalWidth).toBeGreaterThan(800);
      expect(snapshot.naturalHeight).toBeGreaterThan(800);

      const photoUrl = new URL(await page.locator('#photoAction').getAttribute('href'));
      expect(photoUrl.hostname).toBe('www.google.com');
      expect(photoUrl.searchParams.get('tbm')).toBe('isch');
      expect(photoUrl.searchParams.get('q')).toBe(snapshot.expectedImageQuery);

      if (snapshot.expectedMapQuery) {
        const mapUrl = new URL(await page.locator('#mapAction').getAttribute('href'));
        expect(mapUrl.pathname).toBe('/maps/search/');
        expect(mapUrl.searchParams.get('query')).toBe(snapshot.expectedMapQuery);
      }

      await page.locator('[data-region="all"]').click();
      await expect(page.locator('.pin:visible')).toHaveCount(config.targetCount);
      await expect(page.locator('[data-region="all"]')).toHaveAttribute('aria-pressed', 'true');

      expect(pageErrors).toEqual([]);
    });

    test('audits every generated Maps and Images URL and link security attribute', async ({ page }) => {
      await openClean(page, config);

      const audit = await page.evaluate(() => {
        const data = window.C16_COUNTRY_MAP_DATA;
        const issues = [];
        let pairCount = 0;
        let mapCount = 0;

        const checkSecurity = (link, context) => {
          if (link.target !== '_blank') {
            issues.push(`${context}: target`);
          }
          const rel = new Set((link.rel || '').split(/\s+/).filter(Boolean));
          if (!rel.has('noopener') || !rel.has('noreferrer')) {
            issues.push(`${context}: rel`);
          }
        };

        for (const target of data.targets) {
          document.querySelector('[data-region="all"]').click();
          document.querySelector(`.pin[data-target="${CSS.escape(target.id)}"]`).click();
          const actualNearIds = [...document.querySelectorAll('[data-near]')]
            .map((button) => button.dataset.near);
          const expectedNearIds = data.targets
            .filter((item) => item.region === target.region && item.id !== target.id)
            .sort((a, b) => (
              Math.hypot(a.x - target.x, a.y - target.y)
              - Math.hypot(b.x - target.x, b.y - target.y)
            ))
            .slice(0, actualNearIds.length)
            .map((item) => item.id);
          if (actualNearIds.join('|') !== expectedNearIds.join('|')) {
            issues.push(`${target.id}: nearby order`);
          }

          for (const tagId of target.tagIds) {
            pairCount += 1;
            const tag = data.tags[tagId];
            const button = document.querySelector(
              `[data-tag="${CSS.escape(tagId)}"]`
            );
            const tile = button?.closest('.tag-tile');
            const photo = tile?.querySelector('a.photo-link');
            const map = tile?.querySelector('a.map-link');
            const context = `${target.id}/${tagId}`;

            if (!photo) {
              issues.push(`${context}: missing image`);
            } else {
              checkSecurity(photo, `${context} image`);
              const url = new URL(photo.href);
              if (
                url.hostname !== 'www.google.com'
                || url.pathname !== '/search'
                || url.searchParams.get('tbm') !== 'isch'
                || url.searchParams.get('q') !== tag.imageQuery
              ) {
                issues.push(`${context}: image URL`);
              }
            }

            if (!tag.mapQuery) {
              if (map) issues.push(`${context}: unexpected map`);
              continue;
            }

            mapCount += 1;
            if (!map) {
              issues.push(`${context}: missing map`);
              continue;
            }
            checkSecurity(map, `${context} map`);
            const url = new URL(map.href);
            if (
              url.hostname !== 'www.google.com'
              || url.pathname !== '/maps/search/'
              || url.searchParams.get('api') !== '1'
              || url.searchParams.get('query') !== tag.mapQuery
            ) {
              issues.push(`${context}: map URL`);
            }
          }
        }

        return { issues, pairCount, mapCount };
      });

      expect(audit.pairCount).toBeGreaterThan(0);
      expect(audit.mapCount).toBeGreaterThan(0);
      expect(audit.issues).toEqual([]);
    });

    for (const viewport of requiredViewports) {
      test(`keeps the learning target and first action usable at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openClean(page, config);

        const metrics = await page.evaluate(() => {
          const sentence = document.querySelector('#sentenceText').getBoundingClientRect();
          const firstRegion = document.querySelector('[data-region]').getBoundingClientRect();
          const reset = document.querySelector('#resetActivityBtn').getBoundingClientRect();
          const sentenceLink = document.querySelector('.chip-row a').getBoundingClientRect();
          const sourceSummary = document.querySelector('.source-note summary').getBoundingClientRect();
          return {
            sentenceTop: sentence.top,
            firstRegionBottom: firstRegion.bottom,
            resetWidth: reset.width,
            resetHeight: reset.height,
            sentenceLinkWidth: sentenceLink.width,
            sentenceLinkHeight: sentenceLink.height,
            sourceSummaryHeight: sourceSummary.height,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        });

        expect(metrics.sentenceTop).toBeLessThan(290);
        expect(metrics.firstRegionBottom).toBeLessThanOrEqual(viewport.height);
        expect(metrics.resetWidth).toBeGreaterThanOrEqual(44);
        expect(metrics.resetHeight).toBeGreaterThanOrEqual(44);
        expect(metrics.sentenceLinkWidth).toBeGreaterThanOrEqual(44);
        expect(metrics.sentenceLinkHeight).toBeGreaterThanOrEqual(44);
        expect(metrics.sourceSummaryHeight).toBeGreaterThanOrEqual(44);
        expect(metrics.overflow).toBeLessThanOrEqual(1);
        await expect(page.getByRole('button', { name: '이 활동을 처음부터 시작하기' })).toBeVisible();
      });

      test(`keeps every filtered pin center selectable at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await openClean(page, config);
        await assertFilteredPinCentersSelectTheirTarget(page);
      });
    }
  });
}

test('keeps the reviewed country search queries and intentional map omissions', async ({ page }) => {
  await openClean(page, pages[0]);
  const mongolia = await page.evaluate(() => ({
    camels: Object.values(window.C16_COUNTRY_MAP_DATA.tags)
      .filter((tag) => tag.label === '쌍봉낙타'),
    viewingDeck: window.C16_COUNTRY_MAP_DATA.tags['tsonjin-viewing-deck']
  }));
  expect(mongolia.camels.length).toBeGreaterThan(0);
  for (const camel of mongolia.camels) {
    expect(camel.imageQuery).toBe(
      'domestic Bactrian camel South Gobi Mongolia'
    );
  }
  expect(mongolia.viewingDeck.mapQuery).toBe(
    'Chinggis Khaan Statue Complex Tsonjin Boldog Mongolia'
  );

  await openClean(page, pages[1]);
  const atyrauMarker = await page.evaluate(() => (
    window.C16_COUNTRY_MAP_DATA.tags['atyrau-europe-asia-marker']
  ));
  expect(atyrauMarker.mapQuery).toBeFalsy();
  expect(atyrauMarker.imageQuery).toBe(
    'Еуропа Азия шекарасы Атырау, Қазақстан'
  );
  await page.locator('[data-region="all"]').click();
  await page.locator('.pin[data-target="atyrau"]').click();
  await page.locator('[data-tag="atyrau-europe-asia-marker"]').click();
  await expect(page.locator('#mapAction')).toBeHidden();
  await expect(page.locator('#mapAction')).not.toHaveAttribute('href', /.+/);

  await openClean(page, pages[2]);
  const nonWorldHeritageQueries = await page.evaluate(() => {
    const ids = [
      'shahbaRomanCity',
      'hauranLandscape',
      'homsOldCity',
      'tellBrakSite',
      'tellBrakUrbanization',
      'tellBrakSealings'
    ];
    return Object.fromEntries(ids.map((id) => [
      id,
      window.C16_COUNTRY_MAP_DATA.tags[id].imageQuery
    ]));
  });
  for (const query of Object.values(nonWorldHeritageQueries)) {
    expect(query).not.toMatch(/\bUNESCO\b/i);
  }

  await openClean(page, pages[3]);
  const railway = await page.evaluate(() => (
    window.C16_COUNTRY_MAP_DATA.tags['kanchanaburi-thailand-burma-railway']
  ));
  expect(railway).toMatchObject({
    label: '태국-버마 철도의 역사',
    imageQuery:
      'Burma-Thailand Railway forced labour POW romusha memorial Kanchanaburi history'
  });
  expect(railway.mapQuery).toBeFalsy();

  await page.locator('[data-region="all"]').click();
  await page.locator('.pin[data-target="kanchanaburi"]').click();
  await page.locator('[data-tag="kanchanaburi-thailand-burma-railway"]').click();
  await expect(page.locator('#mapAction')).toBeHidden();
  await expect(page.locator('#mapAction')).not.toHaveAttribute('href', /.+/);
  const railwayImageUrl = new URL(
    await page.locator('#photoAction').getAttribute('href')
  );
  expect(railwayImageUrl.searchParams.get('q')).toBe(railway.imageQuery);
});

test('restores one country without leaking state into another country', async ({ page }) => {
  const mongolia = pages[0];
  const thailand = pages[3];

  await openClean(page, mongolia);
  await page.locator('[data-region="all"]').click();
  await page.locator('[data-target="dalanzadgad"]').click();
  await page.locator('#zoomInBtn').click();
  const mongoliaState = await page.evaluate(
    (key) => localStorage.getItem(key),
    mongolia.storageKey
  );

  await openClean(page, thailand);
  expect(await page.evaluate((key) => localStorage.getItem(key), thailand.storageKey)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), mongolia.storageKey)).toBe(
    mongoliaState
  );

  await page.goto(mongolia.path, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#saveStatus')).toHaveText('이어서 시작했어요');
  await expect(page.locator('#zoomLevel')).toHaveText('135%');
  await expect(page.locator('#placeName')).toHaveText('달란자드가드');
});

test('shows Syria learning-only guidance and heritage classifications', async ({ page }) => {
  await openClean(page, pages[2]);
  await expect(page.locator('.country-note')).toContainText(
    '현재 방문 가능 여부나 여행 안전을 안내하지 않습니다.'
  );
  await expect(page.locator('#placeMeta')).toHaveAttribute(
    'data-badge',
    '세계유산 · 위험목록'
  );
  await expect(page.locator('#placeMeta .place-badge')).toHaveText(
    '세계유산 · 위험목록'
  );

  await page.locator('[data-region="all"]').click();
  await page.locator('[data-target="maaloula"]').click();
  await expect(page.locator('#placeMeta')).toHaveAttribute(
    'data-badge',
    '세계유산 잠정목록'
  );
  await expect(page.locator('#placeMeta .place-badge')).toHaveText(
    '세계유산 잠정목록'
  );

  const northernPinDistance = await page.evaluate(() => {
    const targets = window.C16_COUNTRY_MAP_DATA.targets;
    const villages = targets.find((target) => target.id === 'ancientVillages');
    const ebla = targets.find((target) => target.id === 'ebla');
    return Math.hypot(villages.x - ebla.x, villages.y - ebla.y);
  });
  expect(northernPinDistance).toBeGreaterThan(7);

  await page.locator('[data-region="north"]').click();
  const northernOverlap = await page.evaluate(() => {
    const villagesPin = document.querySelector('[data-target="ancientVillages"]');
    const eblaPin = document.querySelector('[data-target="ebla"]');
    const villagesLabel = villagesPin.nextElementSibling;
    const eblaLabel = eblaPin.nextElementSibling;
    const overlaps = (first, second) => {
      const a = first.getBoundingClientRect();
      const b = second.getBoundingClientRect();
      return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    };
    return {
      pins: overlaps(villagesPin, eblaPin),
      labels: overlaps(villagesLabel, eblaLabel)
    };
  });
  expect(northernOverlap).toEqual({ pins: false, labels: false });

  await page.locator('[data-region="coast"]').click();
  await page.locator('[data-target="saladinCastle"]').click();
  await expect(page.locator('#sentenceText')).toHaveText(
    '살라딘 성채는 암반 위 중세 요새로 유명해요.'
  );
});

test('exposes all four country activities from both C16 entry pages', async ({ page }) => {
  const hrefs = pages.map((config) => config.path.split('/').pop());

  for (const entryPath of ['/c16/index.html', '/c16/grammar4.html']) {
    await page.goto(entryPath, { waitUntil: 'domcontentloaded' });
    for (const href of hrefs) {
      await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
  }
});
