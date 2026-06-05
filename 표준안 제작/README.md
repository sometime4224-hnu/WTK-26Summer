# 한국어 학습 웹페이지 표준안 패키지

> 버전: 1.1 | 작성일: 2026-05-31 | 기준 과: c17

이 폴더는 신규 과 제작 시 바로 사용할 수 있는 **완결된 제작 키트**입니다.
원본 과 폴더(c10~c17)는 건드리지 않고 이 폴더 안에서 모든 작업을 수행합니다.

---

## 폴더 구조

```
표준안 제작/
│
├── README.md                    ← 지금 읽고 계신 이 파일 (시작점)
│
├── 📋 사양 문서
│   ├── STANDARD_SPEC.md         ← 표준안 전체 요약 (핵심 결정사항·아키텍처)
│   ├── TEMPLATE_SPEC.md         ← 12개 페이지 유형별 HTML·JS 사양
│   ├── NAMING_CONVENTIONS.md    ← 파일명·폴더명·설정 객체명 규칙
│   ├── ACCESSIBILITY_CHECKLIST.md ← 접근성·모바일 체크리스트
│   ├── NEW_LESSON_CHECKLIST.md  ← 신규 과 제작 단계별 체크리스트 ★자주 사용
│   ├── INVENTORY.md             ← 완숙기(c15~c17) 페이지 유형 분류표
│   ├── GAP_ANALYSIS.md          ← 과 간 구조 불일치 9건 분석
│   └── STANDARD_PLAN.md        ← 표준안 수립 계획서 (참고용)
│
├── 📁 shared/                       ← 공유 CSS·JS (신규 과 폴더의 ../shared/ 에 복사)
│   ├── design-tokens.css            ← CSS 변수 통합 정의 (모든 페이지 필수)
│   ├── multilang-toggle.js          ← 다국어 토글 로직
│   ├── multilang-toggle.css         ← 다국어 토글 스타일
│   ├── project-topbar-compact.css   ← topbar 공통 오버라이드
│   ├── site-copyright.js            ← 저작권 주입
│   ├── c15-speaking-pro.css         ← 말하기 PRO 스타일
│   ├── c15-speaking-pro.js          ← 말하기 PRO 로직
│   ├── listening-workbook.css       ← 듣기 워크북 스타일
│   ├── listening-workbook.js        ← 듣기 워크북 로직
│   └── text-markup.js               ← ==...== 밑줄 마크업 렌더
│
└── 📁 templates/                    ← HTML·JS 샘플 파일 (복사 후 ★ 채우기)
    ├── index-hub.html               ← 챕터 허브 (T-01)
    ├── grammar-main.html            ← 문법 메인 (T-02) ★핵심
    ├── grammar-main.js              ← 문법 메인 공유 로직 (표준 명칭 적용)
    ├── grammar-main.css             ← 문법 메인 공유 스타일 (c17 기준)
    ├── grammar-support-quiz.html    ← 문법 보조퀴즈 (T-03)
    ├── grammar-support-quiz.js      ← 문법 보조퀴즈 공유 로직
    ├── grammar-support-quiz.css     ← 문법 보조퀴즈 공유 스타일
    ├── grammar-support-material.html ← 문법 보조자료 (T-04)
    ├── vocabulary.html              ← 어휘 메인 (T-05, 카드·정리·뜻/초성/그림 퀴즈)
    ├── vocab-support.html           ← 어휘 보조 (T-06, 5가지 활동 유형 포함)
    ├── listening.html               ← 듣기 (T-07) + listening-data.js 스키마 내장
    ├── reading.html                 ← 읽기 메인 (T-08)
    ├── reading-cuttoon.html         ← 읽기 컷툰 (T-09)
    ├── writing-cut.html             ← 쓰기 학생용 (T-10)
    ├── writing-cut-teacher.html     ← 쓰기 교사용 (T-11)
    └── speaking-pro.html            ← 말하기 PRO (T-12)
```

---

## 빠른 시작 — 신규 과 제작

### 1단계: 폴더 생성

```
korean3Bimprove/
└── c[N]/          ← 새 폴더 생성
```

### 2단계: 공유 파일 확인

원본 `shared/` 폴더에 아래 파일이 있는지 확인:

| 파일 | 없으면 |
|------|--------|
| `shared/design-tokens.css` | `표준안 제작/shared/` 에서 복사 |
| `shared/multilang-toggle.js` | `표준안 제작/shared/` 에서 복사 |
| `shared/multilang-toggle.css` | `표준안 제작/shared/` 에서 복사 |
| `shared/project-topbar-compact.css` | 기존 파일 사용 |
| `shared/c15-speaking-pro.css/js` | 기존 파일 사용 |
| `shared/listening-workbook.css/js` | 기존 파일 사용 |

### 3단계: 템플릿 복사

`templates/` 폴더의 파일을 `c[N]/` 폴더에 복사 후 ★ 표시 부분 교체:

```bash
# 예시 (파일 탐색기로 해도 됩니다)
cp templates/grammar-main.html    c[N]/grammar1.html
cp templates/grammar-main.js      c[N]/grammar-main.js
cp templates/grammar-main.css     c[N]/grammar-main.css
cp templates/grammar-support-quiz.html  c[N]/grammar1-support-quiz.html
cp templates/grammar-support-quiz.js    c[N]/grammar-support-quiz.js
cp templates/grammar-support-quiz.css   c[N]/grammar-support-quiz.css
cp templates/index-hub.html        c[N]/index.html
cp templates/vocabulary.html       c[N]/vocabulary.html
cp templates/reading.html          c[N]/reading.html
cp templates/writing-cut-teacher.html c[N]/writing-cut-teacher.html
```

### 4단계: ★ 표시 채우기

각 템플릿 파일에서 `★` 표시를 실제 내용으로 교체합니다.
자세한 항목은 `TEMPLATE_SPEC.md`를 참조하세요.

### 5단계: 제작 완료 후 검수

`NEW_LESSON_CHECKLIST.md`를 복사해 `c[N]/ACCESSIBILITY_REVIEW.md`로 저장하고
각 항목에 ✅ / ❌ / N/A 를 기입합니다.

---

## 핵심 규칙 요약

### 다국어 토글
```html
<!-- 버튼 바 삽입 위치에 이 한 줄 -->
<div data-multilang-bar></div>

<!-- 번역 블록 -->
<p data-lang="vi" class="lang-box">베트남어 번역</p>
<p data-lang="en" class="lang-box">English</p>
```
언어 선택은 `localStorage("preferred-lang")`에 저장되어 페이지 이동 후에도 유지됩니다.

### 어휘 메인

`templates/vocabulary.html`은 c10 업그레이드 페이지를 기준으로 확정한 표준입니다.

- 데이터 객체: `window.VOCABULARY_CONFIG`
- 기본 뷰: 카드 / 정리 / 퀴즈
- 퀴즈 모드: 뜻 / 초성 / 그림
- 초성 퀴즈: 이미지 파일을 수정하지 않고 이미지 위 오버레이로 표시
- 그림 퀴즈: `quizImage` 또는 `image`가 있는 단어가 1개 이상일 때 자동 활성화
- 카드 이미지에 글자 힌트가 있으면 `quizImage`로 글자 없는 이미지를 별도 연결
- 이미지가 없는 단어: 카드·목록·퀴즈에서 placeholder로 유지

### 문법 페이지 설정 객체
```js
window.GRAMMAR_PAGE_CONFIG = {
    quizTitle: "문법 N 확인",
    summary:   "완료 메시지",
    summaryHint: "핵심 정리",
    quiz: [
        { prompt: "문제", hint: "힌트", choices: ["a","b","c","d"], answer: 0, feedback: "해설" }
    ]
};
```

### HEAD 공유 파일 로드 순서
```html
<link rel="stylesheet" href="../shared/design-tokens.css" />
<link rel="stylesheet" href="../shared/project-topbar-compact.css" />
<link rel="stylesheet" href="../shared/multilang-toggle.css" />
<!-- 페이지 전용 CSS -->
```

### BODY 스크립트 로드 순서
```html
<script>window.GRAMMAR_PAGE_CONFIG = { ... };</script>
<script src="grammar-main.js"></script>
<script src="../shared/multilang-toggle.js"></script>
<script src="../shared/site-copyright.js"></script>
```

---

## 문서 읽는 순서

처음 사용한다면 이 순서로 읽으세요:

1. **이 README** — 전체 구조 파악
2. **STANDARD_SPEC.md** — 핵심 결정사항·아키텍처 요약
3. **NEW_LESSON_CHECKLIST.md** — 실제 제작 흐름
4. **TEMPLATE_SPEC.md** — 만들 페이지 유형의 상세 사양
5. **NAMING_CONVENTIONS.md** — 파일명 결정 시
6. **ACCESSIBILITY_CHECKLIST.md** — 완성 후 검수

---

## 참고: c17과의 관계

c17은 이 표준안의 **기준 과**입니다.
표준안과 c17의 차이점:

| 항목 | c17 현재 | 표준안 |
|------|----------|--------|
| 문법 설정 객체명 | `C17_GRAMMAR_PAGE` | `GRAMMAR_PAGE_CONFIG` (폴백 지원) |
| 다국어 토글 | `vi-text` + `viToggle` | `data-lang` + `multilang-toggle.js` |
| 어휘 다국어 | 없음 | `data-lang` 방식 |

`templates/grammar-main.js`는 구 명칭(`C17_GRAMMAR_PAGE`)도 폴백으로 지원하므로
c17 기존 파일을 수정하지 않아도 동작합니다.
