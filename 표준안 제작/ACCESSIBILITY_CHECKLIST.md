# 접근성·모바일 최적화 체크리스트

> 작성일: 2026-05-31
> 근거: 완숙기(c15~c17) 실제 구현 패턴 검토 + WCAG 2.1 AA 핵심 항목

신규 과 완성 후 이 체크리스트를 항목별로 검토한다.
✅ = 적합  ❌ = 수정 필요  N/A = 해당 없음

---

## 1. 메타·뷰포트

| # | 항목 | 기준 |
|---|------|------|
| 1-1 | `<html lang="ko">` 설정 | 모든 페이지 필수 |
| 1-2 | viewport meta에 `width=device-width, initial-scale=1.0` | 필수 |
| 1-3 | `maximum-scale=1.0, user-scalable=no` 사용 제한 | 게임·인터랙티브 페이지에만 허용. 일반 학습 페이지는 금지 |
| 1-4 | `<title>` 페이지별 고유 | `[N]과 [섹션] \| [주제]` 형식 |

---

## 2. 시맨틱 마크업

| # | 항목 | 기준 |
|---|------|------|
| 2-1 | `<nav aria-label="…">` 모든 네비게이션에 레이블 | topbar, footer-nav, 단계 네비 등 |
| 2-2 | `<main>` 태그 페이지당 1개 | 콘텐츠 시작점 |
| 2-3 | 제목 계층 (`h1 → h2 → h3`) 논리적 순서 유지 | h1 건너뛰기 금지 |
| 2-4 | `<section>`, `<article>`, `<aside>` 의미에 맞게 사용 | div 남용 금지 |
| 2-5 | 버튼/링크 구분: 동작은 `<button>`, 이동은 `<a>` | |

---

## 3. 이미지·미디어

| # | 항목 | 기준 |
|---|------|------|
| 3-1 | 모든 `<img>`에 `alt` 속성 | 장식용 이미지는 `alt=""` |
| 3-2 | 컷툰·쓰기 컷 이미지 alt에 장면 설명 포함 | "서동요 컷 3: 바람이 퍼지는 장면" |
| 3-3 | 오디오 플레이어에 `<audio controls>` 또는 커스텀 버튼의 `aria-label` | |
| 3-4 | 이미지 `loading="lazy"` (첫 화면 제외) | 첫 컷/히어로 이미지는 `loading="eager"` |
| 3-5 | 어휘 이미지가 없을 때 placeholder 제공 | 이미지가 없어도 카드·초성퀴즈가 비어 보이지 않도록 |

---

## 4. 인터랙티브 요소

| # | 항목 | 기준 |
|---|------|------|
| 4-1 | 모든 `<button>`에 텍스트 또는 `aria-label` | 아이콘 전용 버튼은 `aria-label` 필수 |
| 4-2 | 토글 버튼에 `aria-pressed` 상태 반영 | 다국어 버튼, 학습/연습 탭 |
| 4-3 | 탭 목록에 `role="tablist"` + 각 탭에 `role="tab"` | segmented 탭 컨트롤 |
| 4-4 | 퀴즈 정답/오답 피드백 영역에 `aria-live="polite"` | 동적 결과 영역 |
| 4-5 | 비활성 버튼에 `disabled` 또는 `aria-disabled="true"` | 다음 버튼 비활성 상태 |
| 4-6 | `hidden` 패널은 `hidden` 속성 또는 `display:none` | `visibility:hidden` 단독 사용 금지 |
| 4-7 | 퀴즈 모드 탭에 `role="tab"` + `aria-selected` 반영 | 뜻·초성·그림 퀴즈 |

---

## 5. 키보드 내비게이션

| # | 항목 | 기준 |
|---|------|------|
| 5-1 | Tab 키로 모든 인터랙티브 요소 접근 가능 | |
| 5-2 | `:focus-visible` CSS 스타일 정의 | `outline: 2px solid currentColor` 권장 |
| 5-3 | 퀴즈 선택지 Enter/Space로 선택 가능 | `<button>` 사용 시 자동 처리됨 |
| 5-4 | 모달·오버레이 열릴 때 포커스 이동, 닫힐 때 원위치 | |
| 5-5 | 어휘 카드 뒤집기 Enter/Space로 가능 | `role="button"` 카드에 keydown 처리 |

---

## 6. 색상·대비

| # | 항목 | 기준 |
|---|------|------|
| 6-1 | 본문 텍스트(`--ink` on `--bg`) 대비비 ≥ 4.5:1 | #172033 on #f8fbfd → ✅ 약 14:1 |
| 6-2 | 보조 텍스트(`--muted`) 대비비 ≥ 3:1 (large text 기준) | #64748b on #f8fbfd → 약 4.6:1 ✅ |
| 6-3 | 정답(--ok)·오답(--bad) 색상만으로 상태를 전달하지 않음 | 아이콘 또는 텍스트 함께 제공 |
| 6-4 | 다국어 번역 박스 색상 대비 확인 | vi 박스: #7c2d12 on #fff7ed → ✅ |

---

## 7. 터치·모바일

| # | 항목 | 기준 |
|---|------|------|
| 7-1 | 버튼 최소 터치 영역 44×44px | `min-height: 44px` 또는 `padding` 으로 확보 |
| 7-2 | 탭 버튼 최소 44px | `.tab-btn`, `.multilang-btn` |
| 7-3 | 인접 버튼 사이 여백 ≥ 8px | 오터치 방지 |
| 7-4 | 가로 스크롤 없음 (360px 뷰포트 기준) | |
| 7-5 | 첫 모바일 뷰포트에 핵심 활동 요소 노출 | 대형 hero로 활동 영역 밀리지 않도록 |

---

## 8. 다국어 토글 (multilang-toggle)

| # | 항목 | 기준 |
|---|------|------|
| 8-1 | `[data-multilang-bar]` 컨테이너 존재 (번역 블록이 있는 페이지) | |
| 8-2 | `[data-lang]` 블록이 기본 숨김 상태 | `.lang-visible` 없는 상태에서 `display:none` |
| 8-3 | 언어 선택이 `localStorage`에 저장됨 | 새 탭·페이지 이동 후에도 유지 |
| 8-4 | 각 언어 버튼에 `aria-pressed` 상태 반영 | `multilang-toggle.js` 자동 처리 |
| 8-5 | 번역 없는 페이지에 토글 바 없음 | 불필요한 UI 노출 금지 |

---

## 9. 성능

| # | 항목 | 기준 |
|---|------|------|
| 9-1 | 이미지 포맷 `.webp` 사용 | 폴백 `<picture>` 태그 선택 적용 |
| 9-2 | 첫 화면 외 이미지 `loading="lazy"` | |
| 9-3 | 폰트 `preconnect` + `display=swap` | `<link rel="preconnect">` HEAD에 포함 |
| 9-4 | Tailwind CDN 미사용 | 커스텀 CSS 변수 시스템 사용 |
| 9-5 | 외부 스크립트 최소화 | Font Awesome CDN + Google Fonts 외 추가 CDN 지양 |

---

## 사용법

신규 과 완성 후 이 체크리스트를 복사하여 `c[N]/ACCESSIBILITY_REVIEW.md`로 저장하고 각 항목에 ✅/❌/N/A를 기입한다.

```markdown
| 1-1 | `<html lang="ko">` | ✅ |
| 1-2 | viewport meta | ✅ |
| 1-3 | user-scalable 제한 | N/A (게임 없음) |
…
```
