# 웹 교재 효율화 완료 보고서

작성일: 2026-06-06

## 범위

- 대상: 루트, `c10`부터 `c18`, `apps`, `review`, 표준 템플릿의 HTML/CSS/JS와 참조 이미지
- 제외: MP3 로컬 연결 정책 전환, C14 컷툰/농사 게임의 오디오 자동 로드 예외
- 원칙: 디자인과 기능은 유지하고, 느린 인터넷에서 초기 표시를 막는 요소를 줄임

## 완료한 작업

1. 이미지 최적화
   - C15 듣기 컷툰/커버 이미지를 같은 해상도의 `-optimized.webp`로 교체
   - C16 듣기 PNG 컷툰 2개를 WebP로 교체
   - C16 한국/베트남 지도 PNG를 WebP로 교체
   - C17 듣기 컷툰 이미지를 같은 해상도의 `-optimized.webp`로 교체
   - 사진 묘사 앱의 큰 사진 8개를 `-1600w.webp` 파생본으로 교체
   - 정적 `<img>` 170개 모두 `decoding`과 `loading` 또는 `fetchpriority` 정책을 갖도록 보강

2. 외부 리소스 정리
   - Noto 계열 단독 Google Fonts 호출을 제거하고 시스템 폰트 스택을 보강
   - 특수 디자인 폰트가 필요한 11개 Google Fonts 호출만 예외로 유지
   - Font Awesome 150개 호출을 렌더 차단 없는 비동기 stylesheet 방식으로 전환
   - Tailwind CDN 86개 스크립트에 `defer`를 적용

3. 공통/테스트 보강
   - 이미지/외부 리소스 정책 회귀 방지 테스트 추가
   - C17 어휘 페이지 상단에 보조 활동 링크를 보강
   - 현재 UI 구조에 맞게 C18 및 QR 관련 테스트 기대값 조정

## 최종 정적 지표

| 항목 | 결과 |
| --- | ---: |
| HTML 파일 | 277 |
| 이미지 파일 | 1,605 |
| 이미지 총량 | 320.06 MB |
| Google Fonts 호출 | 11 |
| Font Awesome 비동기 호출 | 150 |
| Font Awesome 동기 호출 | 0 |
| Tailwind CDN 호출 | 86 |
| Tailwind `defer` 적용 | 86 |
| 정적 `<img>` 태그 | 170 |
| 이미지 정책 누락 | 0 |

## 대표 이미지 절감

| 대상 | 이전 | 이후 |
| --- | ---: | ---: |
| C16 듣기 1 컷툰 | 2,503 KB PNG | 287 KB WebP |
| C16 듣기 2 컷툰 | 2,690 KB PNG | 325 KB WebP |
| C16 한국 지도 | 1,322 KB PNG | 110 KB WebP |
| C16 베트남 지도 | 1,332 KB PNG | 48 KB WebP |
| C15 듣기 1 커버 | 1,465 KB WebP | 120 KB WebP |
| C15 듣기 2 커버 | 1,416 KB WebP | 142 KB WebP |
| 사진 묘사 시장 사진 | 1,719 KB WebP | 401 KB WebP |
| 사진 묘사 거실 사진 | 1,189 KB WebP | 167 KB WebP |

## 검증

- `node --check shared/listening-workbook.js`
- `node --check shared/page-qr.js`
- `node --check c16/listening-data.js`
- `node --check c17/listening-data.js`
- `node --check tests/e2e/static-performance-policy.spec.js`
- `playwright test tests/e2e/static-performance-policy.spec.js`: 3 passed
- `playwright test`: 88 passed

브라우저 대표 확인:

- `/index.html`
- `/c15/listening1.html`
- `/c16/listening1.html`
- `/c16/grammar4-korea-map-match.html`
- `/c17/vocabulary.html`
- `/apps/writeclass/photo_description/index.html`

위 페이지에서 깨진 이미지 없음, 가로 오버플로 없음, Noto 단독 Google Fonts 없음, 동기 Tailwind 없음, Font Awesome 비동기 로드 확인.

## 남긴 예외

- MP3 직접/자동 로드 정책 정리는 이번 완료 범위에서 제외
- C14 컷툰 듣기와 C14 농사 게임의 MP3 자동 로드는 사용자가 현 단계 예외로 지정
- Tailwind CDN 자체 제거는 디자인 손실 위험이 커서 이번에는 `defer`까지만 적용
- 특수 분위기용 Google Fonts 11개는 디자인 보존을 위해 유지
