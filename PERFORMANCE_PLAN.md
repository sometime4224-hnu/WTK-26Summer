# Performance Plan

Date: 2026-06-06

## Objective

저속 인터넷에서도 교재 첫 화면이 빨리 뜨고, 듣기/그림/게임 자료는 필요한 시점에 자연스럽게 로드되도록 한다. 품질 손실은 최소화하고, 원본 자료는 가능한 보존한다.

## Priority 1: Low-Risk Wins

1. **Audio preload policy**
   - Apply `preload="none"` to audio that is not required for first paint.
   - Keep `metadata` only where duration must be visible immediately.
   - Candidate files: listening workbook pages, cuttoon audio players, standalone listening activities.

2. **Large image derivatives**
   - Keep original source images.
   - Add display-sized WebP derivatives such as `1600w`, `1280w`, or thumbnails.
   - Update page references to the derivative when the display area does not need the full source size.
   - First targets:
     - `assets/c14/listening/images/*-illustration.webp`
     - large `assets/c17/*/source/*.png`
     - large `assets/c18/page-visuals/source/*.png`
     - `apps/writeclass/**/generated/*.png`

3. **Lazy loading pass**
   - Add `loading="lazy"` and `decoding="async"` to below-the-fold images.
   - Keep hero/first-screen images eager or add `fetchpriority="high"`.
   - Update tests to scroll lazy images before asserting loaded dimensions.

4. **Remove remaining audio auto-load**
   - Search regularly for `preload="auto"`.
   - Default new templates to `none` or `metadata`.

## Priority 2: External Dependency Reduction

1. **Tailwind CDN**
   - 86 pages still use `https://cdn.tailwindcss.com`.
   - Slow 4G pages spend many seconds waiting for external script and generated styles.
   - Recommended route:
     - Keep page design unchanged.
     - Generate local CSS per page family or shared template family.
     - Replace CDN script with local stylesheet gradually.

2. **Google Fonts**
   - 235 pages use Google Fonts.
   - Limit weights per page family.
   - Add or preserve `display=swap`.
   - Consider local font subset only after measuring licensing and file size tradeoffs.

3. **Font Awesome**
   - 150 pages load Font Awesome.
   - For pages using only home/folder/language icons, replace with inline text/icon alternatives or local subset.
   - Avoid broad replacement until screenshots confirm no design loss.

4. **GTM**
   - GTM adds about 280 KB declared script weight in representative measurements.
   - Consider disabling analytics in local/classroom builds or deferring GTM until idle.

## Priority 3: Shared JS and Page Architecture

1. **Listening workbook split**
   - `shared/listening-workbook.js` is about 292 KB.
   - Split optional teacher/local-audio and advanced sync features if they are not needed immediately.
   - Keep current single file until tests cover more listening pages.

2. **Multilingual data loading**
   - Grammar pages load multiple language data files even when translation is off.
   - Defer secondary language files until the language toggle is used.

3. **QR overlay**
   - Already improved: scroll/resize listeners are active only while the QR panel is open.
   - Next possible step: load QR UI CSS only when the trigger is visible or used.

4. **Game bundles**
   - Phaser game loads about 1.87 MB initial JS under slow 4G.
   - Add a lightweight start screen and load Phaser after the user starts the game.

## Priority 4: Deployment and Cache Strategy

1. **Static cache headers**
   - Current test server uses `Cache-Control: no-store`.
   - Production should use long cache for hashed/static assets and shorter cache for HTML.

2. **Service worker option**
   - Consider only after the core file-size work.
   - Useful for classrooms with repeated page visits.
   - Must include a clear cache refresh strategy for updated lessons.

3. **Asset naming**
   - Use derivative suffixes: `-1280w.webp`, `-1600w.webp`, `-thumb.webp`.
   - Keep source files under `source/` or with `source` in the name where possible.

## Next Execution Batch

1. Apply the C14 listening image/audio pattern to C15, C16, C17 listening pages.
2. Generate a report of large images referenced by current public pages, excluding unused source-only assets.
3. Convert the largest first-load images to display-sized derivatives.
4. Measure `/c17/vocabulary.html` after image strategy changes.
5. Prototype local CSS replacement for one Tailwind CDN grammar page.

## Acceptance Criteria

- No visible layout regression on desktop and mobile screenshots.
- E2E tests pass or are updated to reflect intentional lazy loading.
- Slow 4G declared initial load is reduced by at least 50 percent on media-heavy pages.
- First contentful paint should improve or remain stable.
- Original high-resolution source assets are preserved.

