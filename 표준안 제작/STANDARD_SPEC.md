# 한국어 학습 웹페이지 표준안 (STANDARD_SPEC)

> 버전: 1.0
> 작성일: 2026-05-31
> 기준 과: c17 (완숙기)
> 작업 폴더: `표준안 제작/`
> 원본 훼손 금지: c10~c17 원본 폴더는 읽기 전용 참조

이 문서는 하위 사양 문서들의 핵심을 요약하고, 표준안의 전체 구조를 한눈에 파악할 수 있도록 한다.
각 항목의 상세 내용은 링크된 세부 문서를 참조한다.

---

## 1. 핵심 결정사항

| # | 항목 | 결정 |
|---|------|------|
| Q1 | 다국어 토글 | **전면 채택** — `data-lang` 기반, 영어·일본어·중국어 확장 대비 설계 |
| Q2 | 모의고사 | **표준 외** — 선택 부록 |
| Q3 | grammar-main 패턴 | **전면 채택** — 효율적이면 다른 유형에도 적용 |
| Q4 | 실험적 게임 | **표준 제외** — 참조 사례로만 |
| Q5 | 교사용 쓰기 | **표준 포함** — `writing-cut-teacher.html` |

---

## 2. 표준 파일 구성

한 과(cXX/)의 완성 파일 목록. → 상세: `INVENTORY.md`

```
cXX/
├── index.html                          # 챕터 허브
├── grammar-main.css                    # 문법 공유 스타일
├── grammar-main.js                     # 문법 공유 로직
├── grammar-support-quiz.css            # 문법 보조퀴즈 공유 스타일
├── grammar-support-quiz.js             # 문법 보조퀴즈 공유 로직
├── grammar1~4.html                     # 문법 메인 (×4)
├── grammar1~2-support-quiz.html        # 문법 보조퀴즈 (×2)
├── grammar3~4-support-material1.html   # 문법 보조자료 (×2)
├── grammar1~4-speaking-pro.html        # 말하기 PRO (×4)
├── vocabulary.html                     # 어휘 메인
├── vocab-support-[주제].html           # 어휘 보조 활동 (4종 이상)
├── listening-data.js                   # 듣기 데이터
├── listening1.html / listening2.html   # 듣기
├── reading.html                        # 읽기 메인
├── reading-cuttoon.html                # 읽기 웹툰
├── writing-cut.js                      # 쓰기 로직
├── writing-cut.html                    # 쓰기 학생용
└── writing-cut-teacher.html            # 쓰기 교사용
```

**총 26개 표준 파일** (어휘 보조 4종 기준)

---

## 3. 아키텍처 패턴

### 3-1. 데이터-뷰 분리 (핵심 원칙)

HTML 파일은 **데이터 설정 객체만** 정의한다.
렌더링·인터랙션은 **공유 JS 파일**이 담당한다.

```
grammar1.html         →  window.GRAMMAR_PAGE_CONFIG = {...}
                          + <script src="grammar-main.js">

grammar1-support-quiz.html  →  window.GRAMMAR_SUPPORT_CONFIG = {...}
                                + <script src="grammar-support-quiz.js">

listening1.html       →  <div id="listening-workbook-app">
                          + <script src="listening-data.js">
                          + <script src="listening-workbook.js">
```

### 3-2. 표준 설정 객체명

| 페이지 유형 | 객체명 |
|------------|--------|
| 문법 메인 | `window.GRAMMAR_PAGE_CONFIG` |
| 문법 보조퀴즈 | `window.GRAMMAR_SUPPORT_CONFIG` |
| 말하기 PRO | `window.SPEAKING_PRO_CONFIG` |
| 어휘 메인 | `window.VOCABULARY_CONFIG` |
| 듣기 | `window.LISTENING_DATA` |

> c17 기존 파일(`C17_GRAMMAR_PAGE` 등)은 공유 JS가 두 명칭 모두 지원하도록 작성

### 3-3. 다국어 토글 표준

**구현 파일**: `shared/multilang-toggle.js` + `shared/multilang-toggle.css`

```html
<!-- 버튼 바 자동 생성 위치 -->
<div data-multilang-bar></div>

<!-- 번역 블록 -->
<p data-lang="vi" class="lang-box">…베트남어…</p>
<p data-lang="en" class="lang-box">…영어…</p>
```

- 언어 선택은 `localStorage("preferred-lang")`에 저장
- 지원 언어: `vi` (베트남어), `en` (영어), `ja` (일본어), `zh` (중국어)
- 페이지별 제한: `window.MULTILANG_CONFIG = { langs: ["vi", "en"] }`
- 기존 `vi-text` / `viToggle` 패턴은 폐기 → `data-lang` 방식으로 교체

---

### 3-4. 어휘 메인 표준

**기준 구현**: c10 업그레이드 어휘 페이지
**템플릿**: `templates/vocabulary.html` (T-05)

- 데이터: `window.VOCABULARY_CONFIG`
- 필수 필드: `ko`, `meaning`, `category`
- 권장 필드: `vi`, `en`, `ja`, `zh`, `example`, `pos`, `image`, `imageAlt`
- 기본 뷰: 카드 / 정리 / 퀴즈
- 퀴즈 모드: 뜻 / 초성 / 그림
- 초성 퀴즈는 이미지 파일을 수정하지 않고 오버레이로 초성을 표시
- 그림 퀴즈는 `quizImage` 또는 `image`가 있는 단어가 1개 이상일 때만 활성화
- 카드 이미지에 표제어나 힌트가 포함된 경우 `quizImage`로 글자 없는 퀴즈 이미지를 별도 지정
- 이미지가 없는 단어는 카드·목록·퀴즈에서 placeholder로 유지

---

## 4. 디자인 시스템

→ 상세: `shared/design-tokens.css`

### 4-1. 핵심 CSS 변수

```css
--ink:      #172033   /* 본문 텍스트 */
--muted:    #64748b   /* 보조 텍스트 */
--bg:       #f8fbfd   /* 기본 배경 */
--surface:  rgba(255,255,255,0.95)  /* 카드 배경 */
--line:     #d7e0ea   /* 테두리 */
--shadow:   0 18px 42px rgba(15,23,42,0.08)
```

### 4-2. 섹션 색상

| 섹션 | 변수 | 색상 |
|------|------|------|
| 어휘 | `--vocab` | `#fb923c` 주황 |
| 문법 | `--grammar` | `#4f46e5` 인디고 |
| 듣기 | `--listening` | `#0f766e` 틸 |
| 읽기 | `--reading` | `#be123c` 로즈 |
| 쓰기 | `--writing` | `#7c3aed` 바이올렛 |
| 말하기 | `--speaking` | `#0369a1` 스카이 |

### 4-3. 배경 클래스

| 페이지 | body 클래스 |
|--------|------------|
| 챕터 허브 | `hub-bg` |
| 문법 | `grammar-bg` |
| 어휘 | `vocab-bg` |
| 듣기 | `listening-bg` |
| 읽기/쓰기 | `reading-bg` / `writing-bg` |

### 4-4. HEAD 공유 파일 로드 순서

```html
<link rel="stylesheet" href="../shared/design-tokens.css" />
<link rel="stylesheet" href="../shared/project-topbar-compact.css" />
<link rel="stylesheet" href="../shared/multilang-toggle.css" />
<!-- 유형별 공유 CSS (grammar-main.css 등) -->
```

---

## 5. 페이지 유형별 사양

→ 상세: `TEMPLATE_SPEC.md`

| 코드 | 유형 | 공유 JS |
|------|------|---------|
| T-01 | 챕터 허브 | 없음 |
| T-02 | 문법 메인 | `grammar-main.js` |
| T-03 | 문법 보조퀴즈 | `grammar-support-quiz.js` |
| T-04 | 문법 보조자료 | 없음 |
| T-05 | 어휘 메인 | `VOCABULARY_CONFIG` + 인라인 JS (뜻·초성·그림 퀴즈) |
| T-06 | 어휘 보조 | 활동별 |
| T-07 | 듣기 | `listening-workbook.js` |
| T-08 | 읽기 메인 | 없음 |
| T-09 | 읽기 웹툰 | 없음 |
| T-10 | 쓰기 학생용 | `writing-cut.js` |
| T-11 | 쓰기 교사용 | `writing-cut.js` 공유 |
| T-12 | 말하기 PRO | `c15-speaking-pro.js` |

---

## 6. 네이밍 규칙 요약

→ 상세: `NAMING_CONVENTIONS.md`

- 과 폴더: `c[N]/` (소문자)
- 파일명: 소문자 kebab-case
- 설정 객체: `window.[TYPE]_CONFIG` (대문자 스네이크)
- 실험·백업 파일: 저장소 외부(`../backup/`)로 분리
- Tailwind CDN 금지

---

## 7. 접근성 기준

→ 상세: `ACCESSIBILITY_CHECKLIST.md`

핵심 항목:
- `<html lang="ko">` 필수
- 모든 `<nav>`에 `aria-label`
- 버튼 최소 44×44px
- 퀴즈 결과 영역에 `aria-live="polite"`
- `user-scalable=no`는 게임·인터랙티브 페이지만 허용
- 색상 대비비 본문 ≥ 4.5:1

---

## 8. 산출물 목록

| 파일 | 위치 | 상태 |
|------|------|------|
| `STANDARD_PLAN.md` | `표준안 제작/` | ✅ |
| `INVENTORY.md` | `표준안 제작/` | ✅ |
| `GAP_ANALYSIS.md` | `표준안 제작/` | ✅ |
| `TEMPLATE_SPEC.md` | `표준안 제작/` | ✅ |
| `NAMING_CONVENTIONS.md` | `표준안 제작/` | ✅ |
| `ACCESSIBILITY_CHECKLIST.md` | `표준안 제작/` | ✅ |
| `NEW_LESSON_CHECKLIST.md` | `표준안 제작/` | ✅ |
| `shared/design-tokens.css` | `표준안 제작/shared/` | ✅ |
| `shared/multilang-toggle.js` | `표준안 제작/shared/` | ✅ |
| `shared/multilang-toggle.css` | `표준안 제작/shared/` | ✅ |
| `STANDARD_SPEC.md` (이 파일) | `표준안 제작/` | ✅ |

---

## 9. 다음 단계 (표준안 적용)

표준안이 확정되면 아래 순서로 실제 파일에 적용한다.

1. **`shared/` 폴더 갱신**: `design-tokens.css`, `multilang-toggle.js/css`를 원본 `shared/`에 추가
2. **c17 보완**: `writing-cut-teacher.html`, `grammar1~4-speaking-pro.html` 추가, `vi-text` → `data-lang` 마이그레이션
3. **c15·c16 보완**: `reading.html` 추가 (c15), `listening-data.js` 분리 (c15), topbar 통일
4. **신규 과 제작**: `NEW_LESSON_CHECKLIST.md` 순서대로 진행
