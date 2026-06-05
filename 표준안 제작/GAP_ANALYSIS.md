# 갭 분석 — 완숙기 과 간 구조 불일치

> 작성일: 2026-05-31
> 기준: c17 (표준)
> 비교: c15, c16 및 기존 가이드라인 문서

---

## 1. 파일 존재 갭

### GAP-01 | `reading.html` c15 누락

| 항목 | 내용 |
|------|------|
| **현황** | c16·c17에 있음. c15에는 `reading-cuttoon.html`만 있고 `reading.html` 없음 |
| **표준 결정** | 표준 구성에 포함 |
| **조치** | c15 표준화 작업 시 `reading.html` 추가 필요 |

---

### GAP-02 | `writing-cut-teacher.html` c17 누락

| 항목 | 내용 |
|------|------|
| **현황** | c15·c16에 있음(`body.teacher-mode`, `.teacher-banner`). c17에서 누락 |
| **표준 결정** | 표준 구성에 포함 (결정사항 Q5) |
| **c15·c16 구현** | 별도 HTML 파일, `body.teacher-mode` 클래스로 교사 뷰 분기 |
| **조치** | c17에 `writing-cut-teacher.html` 추가 필요 |

---

### GAP-03 | `grammar[N]-speaking-pro.html` c17 누락

| 항목 | 내용 |
|------|------|
| **현황** | c15 문법 1~2, c16 문법 1~4에 있음. c17에 없음 |
| **기존 가이드라인** | `SPEAKING_PAGE_GUIDELINES.md`에서 c15 형식을 공식 표준으로 지정 (`shared/c15-speaking-pro.css/js`) |
| **표준 결정** | 표준 구성에 포함 (말하기 PRO 4개) |
| **조치** | c17에 grammar1~4-speaking-pro.html 추가 필요. shared 구현 그대로 활용 |

---

### GAP-04 | `listening-data.js` c15 누락

| 항목 | 내용 |
|------|------|
| **현황** | c16·c17에서 듣기 데이터를 `listening-data.js`로 분리. c15는 HTML 내 인라인 |
| **표준 결정** | 데이터 분리 패턴(`listening-data.js`) 표준 채택 |
| **조치** | c15 표준화 시 데이터 추출 필요 |

---

## 2. 다국어 토글 갭 (가장 중요)

### GAP-05 | 다국어 구현 방식 불통일

완숙기 3개 과에서 다국어 지원 방식이 모두 다름.

| 페이지 유형 | c15 | c16 | c17 |
|-------------|-----|-----|-----|
| 어휘 메인 | ✅ 5개 언어 버튼 (`data-lang`) Tailwind 기반 | ⚠️ 미확인 | ❌ 다국어 없음 |
| 문법 메인 | ❌ | ❌ | ✅ `viToggle` 버튼 + `.vi-text` (베트남어만) |
| 읽기 메인 | ❌ | ❌ | ✅ `viToggle` + `.vi-text` |
| 듣기 | ❌ | ❌ | ❌ |
| 쓰기 | ❌ | ❌ | ❌ |
| 읽기 웹툰 | ❌ | ❌ | ❌ |

**문제점**
1. `data-lang` 방식(c15 어휘)과 `vi-text` 클래스 방식(c17 문법·읽기)이 혼재
2. c17 어휘 메인에는 다국어 기능이 아예 없음 (c15보다 퇴보)
3. 듣기·쓰기·읽기 웹툰에는 어느 과도 다국어 없음

**표준 결정**
- 방식을 `data-lang` 속성 기반으로 통일, `vi-text` 패턴은 폐기
- 적용 범위: **전 페이지 유형** (어휘·문법·읽기·듣기·쓰기·읽기웹툰)
- 영어·일본어·중국어 확장을 위한 구조 설계 (c15 어휘의 5개 버튼 방식이 선례)
- 현재 언어 선택을 `localStorage`에 저장하여 페이지 이동 후에도 유지
- 공유 구현: `shared/multilang-toggle.js` + `shared/multilang-toggle.css` 신규 작성 필요

---

## 3. 아키텍처 갭

### GAP-06 | 문법 공유 JS/CSS c17에만 존재

| 항목 | 내용 |
|------|------|
| **현황** | `grammar-main.css`, `grammar-main.js`, `grammar-support-quiz.css`, `grammar-support-quiz.js`는 c17에서 처음 도입 |
| **c15·c16** | 각 grammar HTML 파일에 인라인 CSS + JS로 전부 내장 |
| **표준 결정** | c17의 데이터-뷰 분리 패턴 전면 채택 |
| **구조** | `grammar[N].html`은 `window.GRAMMAR_PAGE` 설정 객체만 정의, 뷰·인터랙션은 공유 파일이 담당 |
| **조치** | 기존 과 리팩터링 시 공유 파일 추출. 신규 과는 처음부터 이 패턴으로 제작 |

---

### GAP-07 | vocabulary.html 구현 방식 이질성

| 항목 | c15 | c17 |
|------|-----|-----|
| **CSS 프레임워크** | Tailwind CDN | 커스텀 인라인 CSS |
| **다국어** | 5개 언어 버튼 | 없음 |
| **뷰 모드** | 카드·퀴즈·초성퀴즈·그림퀴즈·떨어지는 카드 게임 | 카드·리스트·퀴즈 (세그먼트 탭) |
| **데이터 구조** | 언어별 객체 `allVocabulary[lang]` | 단일 어휘 배열 |

**표준 결정**
- Tailwind 제거, 커스텀 CSS 기반으로 통일
- 기준 구현: c10 업그레이드 어휘 페이지를 T-05 표준으로 채택
- 뷰 모드: 카드·정리·퀴즈 3종 유지
- 퀴즈 모드: 뜻·초성·그림 퀴즈를 표준 포함 (`quizModes: ["meaning", "choseong", "image"]`)
- 초성 퀴즈: 이미지를 수정하지 않고 오버레이로 초성을 표시
- 그림 퀴즈: `quizImage` 또는 `image`가 1개 이상 있을 때 자동 활성화, 이미지가 없으면 시스템은 placeholder로 유지
- 카드 이미지에 표제어나 힌트가 포함된 경우 `quizImage`로 글자 없는 이미지를 별도 연결
- 다국어: `data-multilang-bar` + `preferred-lang` 기반 표준 토글과 연동
- 데이터 구조: 단일 어휘 배열에 각 언어 번역 필드 추가 (`{ ko, meaning, vi, en, ja, zh, image }`)
- 어휘 데이터가 커지면 `vocabulary-data.js`로 분리

---

### GAP-08 | topbar 구현 방식 불통일

| 항목 | c15 | c16 | c17 |
|------|-----|-----|-----|
| **topbar** | `id="injected-global-nav"` 인라인 스타일 | 동일 | `class="topbar"` + `../shared/project-topbar-compact.css` |

**표준 결정**
- c17의 `shared/project-topbar-compact.css` 방식 채택
- `injected-global-nav` 패턴 폐기

---

## 4. 기존 가이드라인 문서와의 충돌

### CONFLICT-01 | `SPEAKING_PAGE_GUIDELINES.md`

| 항목 | 내용 |
|------|------|
| **현재 내용** | c15 speaking-pro를 공식 표준으로 지정 |
| **c17 현황** | speaking-pro 페이지 없음 |
| **충돌** | 가이드라인과 최신 과(c17)의 실제 구성이 불일치 |
| **조치** | c17에 speaking-pro 복원. 가이드라인 내용은 유지 (올바른 방향) |

---

### CONFLICT-02 | `PAGE_DESIGN_GUIDELINES.md`

| 항목 | 내용 |
|------|------|
| **현재 내용** | meta-description 금지, topbar 컴팩트 유지, 히어로 카드 최소화 |
| **c15·c16 현황** | 일부 페이지에 대형 hero 카드, 긴 안내 문구 잔존 |
| **충돌** | 없음 (가이드라인 방향 옳음, 준수 정도의 차이) |
| **조치** | 표준 템플릿에서 가이드라인 반영 확인 |

---

### CONFLICT-03 | `CONTENT_MARKUP_GUIDELINES.md`

| 항목 | 내용 |
|------|------|
| **현재 내용** | `==...==` 밑줄 마크업, `shared/text-markup.js` 사용 규정 |
| **c17 현황** | `writing-cut.js`에서 사용 확인 필요 |
| **조치** | 표준 템플릿에 `shared/text-markup.js` 사용 명시 |

---

## 5. 신규 공유 파일 필요 목록

표준안 구현을 위해 새로 작성해야 할 공유 파일:

| 파일 | 용도 | 우선순위 |
|------|------|----------|
| `shared/multilang-toggle.js` | 다국어 토글 공통 로직 (localStorage 포함) | 🔴 높음 |
| `shared/multilang-toggle.css` | 다국어 토글 공통 스타일 | 🔴 높음 |
| `shared/design-tokens.css` | 통합 CSS 변수 | 🟡 중간 |

---

## 6. 갭 요약표

| ID | 항목 | 심각도 | 표준 조치 |
|----|------|--------|-----------|
| GAP-01 | `reading.html` c15 누락 | 🟡 중간 | 추가 |
| GAP-02 | `writing-cut-teacher.html` c17 누락 | 🟡 중간 | 추가 |
| GAP-03 | `speaking-pro` c17 누락 | 🟡 중간 | 추가 |
| GAP-04 | `listening-data.js` c15 누락 | 🟢 낮음 | 데이터 분리 |
| GAP-05 | 다국어 토글 방식 불통일 | 🔴 높음 | `data-lang` 통일 + 공유 파일 신규 작성 |
| GAP-06 | 문법 공유 JS/CSS c17에만 존재 | 🔴 높음 | 전면 채택 (신규 과부터 적용) |
| GAP-07 | vocabulary 구현 방식 이질성 | 🔴 높음 | c17 구조 + 다국어 추가 |
| GAP-08 | topbar 방식 불통일 | 🟡 중간 | `shared/project-topbar-compact.css` 통일 |
| CONFLICT-01 | speaking 가이드라인 ↔ c17 불일치 | 🟡 중간 | c17에 speaking-pro 복원 |
