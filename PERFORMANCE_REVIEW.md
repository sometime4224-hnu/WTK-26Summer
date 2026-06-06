# Performance Review

Date: 2026-06-06

## Goal

저속 인터넷 환경에서도 웹 교재가 수업 중 빠르게 열리도록 병목을 확인하고, 디자인과 기능 손실이 작은 개선부터 적용한다.

## Scope

- HTML pages excluding `node_modules`, `.git`, `.codex_tmp`, `backup`, `tmp`, `test-results`, `output`
- Local server: `http://127.0.0.1:4173`
- Browser measurement: Playwright Chromium
- Slow network profile: 350 ms latency, 50 KB/s download, 20 KB/s upload, cache disabled

## Repository Inventory

| Item | Count or Size |
| --- | ---: |
| Files scanned | 2,214 |
| Total scanned size | 398.10 MB |
| HTML pages | 277 |
| Image files | 309.03 MB |
| Audio files | 57.19 MB |
| PDF | 10.79 MB |
| HTML total | 8.07 MB |
| JS total | 5.30 MB |

Largest categories:

| Type | Size |
| --- | ---: |
| `.png` | 241.44 MB |
| `.webp` | 67.59 MB |
| `.mp3` | 56.72 MB |
| `.pdf` | 10.79 MB |
| `.html` | 8.07 MB |
| `.js` | 5.30 MB |

Top directories:

| Directory | Size |
| --- | ---: |
| `assets` | 292.23 MB |
| `apps` | 53.41 MB |
| `review` | 27.77 MB |
| root PDF | 10.79 MB |

## External Dependencies

| Dependency | Pages or References |
| --- | ---: |
| Google Fonts pages | 235 |
| Font Awesome pages | 150 |
| Tailwind CDN pages | 86 |
| `fonts.googleapis.com` references | 425 |
| `fonts.gstatic.com` references | 183 |
| `cdnjs.cloudflare.com` references | 151 |
| `cdn.tailwindcss.com` references | 86 |

Risk: these external resources dominate first paint on slow networks even when local page content is small.

## Media Loading State

| Item | Count |
| --- | ---: |
| Static `<img>` tags | 170 |
| With `loading="lazy"` | 86 |
| With `decoding="async"` | 81 |
| Static `<audio>` tags | 7 |
| With `preload="metadata"` | 3 |
| With `preload="auto"` before pilot | 1 |
| Missing audio preload before pilot | 3 |

## Baseline Measurements

Measurements below were taken after the earlier duplicate-CDN cleanup, before the C14 media pilot.

| Page | Slow 4G Load | FCP | Declared Initial Size | Main Cause |
| --- | ---: | ---: | ---: | --- |
| `/index.html` | 18.4 s | 6.3 s | 791 KB | GTM, fonts, chapter fetches |
| `/c10/grammar3.html` | 24.1 s | 12.3 s | 713 KB | Tailwind CDN, GTM, fonts, multilingual JS |
| `/c14/reading.html` | 29.2 s | 17.2 s | 1,237 KB | fonts, GTM, all story images |
| `/c14/listening1.html` | 115.4 s | 10.6 s | 7,902 KB | 4.1 MB image, 2.7 MB audio, workbook JS |
| `/c15/grammar3-must-do-mission.html` | 19.1 s | 7.4 s | 608 KB | fonts, GTM, 100 KB HTML |
| `/c16/vocab-support-instrument-play.html` | 15.6 s | 6.4 s | 599 KB | fonts, GTM, 159 KB HTML |
| `/c17/vocabulary.html` | 53.3 s | 15.7 s | 2,095 KB | 1.1 MB card images, fonts |
| `/apps/korean-survivor-loopr/index.html` | 39.8 s | 38.7 s | 1,872 KB | 1.17 MB Phaser bundle |

## Completed Pilot Changes

1. C14 listening image derivatives:
   - Added `assets/c14/listening/images/listening1-illustration-1600w.webp`
   - Added `assets/c14/listening/images/listening2-illustration-1600w.webp`
   - Original files remain untouched.

2. C14 listening pages:
   - `c14/listening1.html` and `c14/listening2.html` now use the 1600px WebP derivatives.
   - Added `audioPreload: "none"` so MP3 files are not downloaded during initial page load.

3. Shared listening workbook:
   - `shared/listening-workbook.js` now supports configurable audio preload.
   - Default remains `metadata`, so existing pages keep their behavior unless they opt in.

4. C14 reading page:
   - Hero image keeps priority.
   - Below-the-fold story and sequence images use `loading="lazy"` and `decoding="async"`.

5. C15 writing listening page:
   - Changed narration audio from `preload="auto"` to `preload="none"`.

## Pilot Results

| Page | Before Slow 4G Load | After Slow 4G Load | Before Size | After Size | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `/c14/listening1.html` | 115.4 s | 34.3 s | 7,902 KB | 1,234 KB | Initial MP3 download removed, image reduced from 4.1 MB to 207 KB |
| `/c14/listening2.html` | Not in baseline set | 34.2 s | Similar risk | 1,231 KB | Same optimization pattern |
| `/c14/reading.html` | 29.2 s | 26.7 s | 1,237 KB | 1,103 KB | Lower sequence images now deferred |
| `/c15/writing-cut-listening.html` | Not in baseline set | 3.6 s | N/A | 92 KB | Audio stays unloaded until needed |

The C14 listening pilot reduced initial declared load by about 84 percent and cut slow-network load time by about 70 percent.

## Verification

- `node --check shared/listening-workbook.js`
- `node --check c14/listening-cuttoon-data.js`
- `playwright test tests/e2e/c14-reading.spec.js tests/e2e/c15-writing-cut-listening.spec.js`
- Browser sanity check:
  - `/c14/listening1.html`: `audio preload="none"`, optimized image loaded, no horizontal overflow
  - `/c14/reading.html`: hero image loaded, below-the-fold images deferred, no horizontal overflow

