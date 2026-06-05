# 페이지 유형별 템플릿 사양 (TEMPLATE_SPEC)

> 작성일: 2026-05-31
> 기준 과: c17
> 보완 참조: c15, c16

이 문서는 각 페이지 유형의 HTML 구조·JavaScript 패턴·데이터 스키마를 규정한다.
신규 과를 제작할 때 이 사양을 따르면 일관된 품질을 달성할 수 있다.

---

## 공통 규칙

모든 페이지에 공통 적용되는 규칙.

### HEAD 로드 순서

```html
<!-- 1. Google Tag Manager -->
<script>...</script>

<!-- 2. 메타 -->
<meta charset="UTF-8" />
<!--
  viewport 규칙 (ACCESSIBILITY_CHECKLIST 1-3 참조):
  - 일반 학습 페이지 (허브·문법·어휘·읽기·쓰기·듣기):
      content="width=device-width, initial-scale=1.0"
  - 말하기 PRO 등 인터랙티브·게임 페이지만:
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
-->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>[N]과 [섹션] | [주제/문법명]</title>

<!-- 3. 폰트 -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800;900&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- 4. 공유 스타일 (의존 순서 유지) -->
<link rel="stylesheet" href="../shared/design-tokens.css" />
<link rel="stylesheet" href="../shared/project-topbar-compact.css" />
<link rel="stylesheet" href="../shared/multilang-toggle.css" />

<!-- 5. 페이지/유형별 스타일 -->
<link rel="stylesheet" href="[page-specific].css" />   <!-- 공유 CSS가 있는 경우 -->
<style>/* 페이지 고유 인라인 CSS */</style>
```

### BODY 마지막 스크립트 순서

```html
<!-- 1. 데이터 -->
<script>window.PAGE_CONFIG = { ... };</script>
<!-- 2. 공유 로직 -->
<script src="[shared-logic].js"></script>
<!-- 3. 다국어 토글 -->
<script src="../shared/multilang-toggle.js"></script>
<!-- 4. 저작권 -->
<script src="../shared/site-copyright.js"></script>
```

### Topbar 마크업

```html
<nav class="topbar" aria-label="상단 이동">
    <a href="../index.html"><i class="fa-solid fa-house"></i> 메인</a>
    <span>|</span>
    <a href="index.html">[N]과 목록</a>
    <span>|</span>
    <strong>[현재 페이지명]</strong>
</nav>
```

### 다국어 토글 바 삽입 위치

- **히어로 카드 내부** 또는 **히어로 바로 아래**에 배치
- `<div data-multilang-bar></div>` 한 줄로 삽입 (JS가 버튼 자동 생성)

### Footer Nav 마크업

```html
<nav class="footer-nav" aria-label="페이지 이동">
    <a class="btn" href="[이전 페이지]"><i class="fa-solid fa-arrow-left"></i> 이전</a>
    <a class="btn" href="index.html">[N]과 목록 <i class="fa-solid fa-list"></i></a>
    <a class="btn primary" href="[다음 페이지]">다음 <i class="fa-solid fa-arrow-right"></i></a>
</nav>
```

---

## T-01. 챕터 허브 (`index.html`)

**역할**: 한 과의 모든 페이지로 연결되는 진입점.

### 구조 개요

```
<body class="hub-bg">
  <header class="topbar"> … </header>
  <main class="shell">
    <section class="hero">          <!-- 단원 제목·칩 요약 -->
    <section class="section" data-tone="vocab">    <!-- 어휘 섹션 -->
    <section class="section" data-tone="grammar">  <!-- 문법 섹션 -->
    <section class="section" data-tone="listening"><!-- 듣기 섹션 -->
    <section class="section" data-tone="reading">  <!-- 읽기·쓰기 섹션 -->
    <section class="section" data-tone="speaking"> <!-- 말하기 섹션 -->
    <footer class="hub-footer"> … </footer>
  </main>
```

### Hero 섹션

```html
<section class="hero">
    <span class="hero__badge"><i class="fa-solid fa-bolt"></i> [N]과</span>
    <h1>[단원 제목]</h1>
    <div class="hero__chips">
        <span class="hero__chip">어휘 자료 [N]개</span>
        <span class="hero__chip">문법 4개</span>
        <span class="hero__chip">듣기 메인</span>
        <span class="hero__chip">읽고 쓰기</span>
        <span class="hero__chip">말하기 PRO</span>
    </div>
    <!-- 단원 설명 문단 (선택, 50자 이내) -->
</section>
```

### 섹션 카드 구조

```html
<section class="section">
    <div class="section__head">
        <div>
            <p class="section__eyebrow">[Vocabulary|Grammar|Listening|Reading|Speaking]</p>
            <h2>[어휘|문법|듣기|읽기·쓰기|말하기]</h2>
        </div>
    </div>
    <div class="path-grid">
        <article class="path-card" data-tone="[vocab|grammar|listening|reading|speaking]">
            <span class="path-card__badge"><i class="fa-solid fa-[아이콘]"></i> [배지 텍스트]</span>
            <h3>[카드 제목]</h3>
            <div class="lesson-list">
                <a class="lesson-link lesson-link--main" href="[메인 페이지].html">
                    <div>
                        <span class="lesson-kind">핵심</span>
                        <span class="lesson-title">[링크 제목]</span>
                    </div>
                    <i class="fa-solid fa-chevron-right lesson-arrow"></i>
                </a>
                <a class="lesson-link" href="[보조 페이지].html">
                    <div>
                        <span class="lesson-kind">보조 자료 [N]</span>
                        <span class="lesson-title">[링크 제목]</span>
                    </div>
                    <i class="fa-solid fa-chevron-right lesson-arrow"></i>
                </a>
                <!-- 미완성 항목 -->
                <span class="lesson-link lesson-link--coming">
                    <div>
                        <span class="lesson-kind">준비 중</span>
                        <span class="lesson-title">[예정 항목]</span>
                    </div>
                </span>
            </div>
        </article>
    </div>
</section>
```

### `data-tone` 값과 색상 대응

| data-tone   | CSS 변수      | 색상   |
|-------------|---------------|--------|
| `vocab`     | `--vocab`     | 주황   |
| `grammar`   | `--grammar`   | 인디고 |
| `listening` | `--listening` | 틸     |
| `reading`   | `--reading`   | 로즈   |
| `speaking`  | `--speaking`  | 스카이 |

---

## T-02. 문법 메인 (`grammar[N].html`)

**역할**: 문법 설명(학습 탭) + 빠른 확인 퀴즈(연습 탭).
**패턴**: 데이터-뷰 분리. HTML은 `window.GRAMMAR_PAGE_CONFIG` 설정 객체만 정의하고,
뷰·인터랙션은 `grammar-main.js`가 담당.

### 공유 파일

```html
<link rel="stylesheet" href="grammar-main.css" />
…
<script src="grammar-main.js"></script>
```

### HTML 뼈대

```html
<body class="grammar-bg">
  <nav class="topbar" aria-label="상단 이동">…</nav>

  <main id="page" class="shell">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Grammar [N]</p>
          <h1>[문법 형태]</h1>
          <p class="lead">[한 문장 의미 설명]</p>
          <div class="chips">
            <span class="chip">[핵심 개념 1]</span>
            <span class="chip">[핵심 개념 2]</span>
            <span class="chip">[핵심 개념 3]</span>
          </div>
        </div>
        <!-- 다국어 토글 바 -->
        <div data-multilang-bar></div>
      </div>
      <div class="tabs">
        <button id="tabLearn"    class="tab-btn active" type="button">학습</button>
        <button id="tabPractice" class="tab-btn"        type="button">연습</button>
      </div>
    </section>

    <!-- 학습 패널 -->
    <section id="learnPanel" class="panel">
      <div class="learn-grid">
        <!-- 카드 구성: Meaning / Form / Compare / Examples (4개 권장) -->
        <article class="card">
          <p class="eyebrow">Meaning</p>
          <h2>[의미 제목]</h2>
          <p>[한국어 설명]</p>
          <div data-lang="vi" class="lang-box">…베트남어…</div>
          <div data-lang="en" class="lang-box">…영어…</div>
        </article>
        <article class="card">
          <p class="eyebrow">Form</p>
          <h2>[형태 설명]</h2>
          <ul>…활용 예…</ul>
          <div data-lang="vi" class="lang-box">…</div>
        </article>
        <article class="card">
          <p class="eyebrow">Compare</p>
          <h2>[비교 대상]과의 차이</h2>
          <p>…</p>
          <div data-lang="vi" class="lang-box">…</div>
        </article>
        <article class="card">
          <p class="eyebrow">Examples</p>
          <h2>[예문 주제]</h2>
          <div class="example-list">
            <div class="example">…</div>
          </div>
          <div data-lang="vi" class="lang-box">…</div>
        </article>
      </div>
    </section>

    <!-- 연습 패널 (grammar-main.js가 렌더링) -->
    <section id="practicePanel" class="panel" hidden>
      <article class="quiz-card" aria-labelledby="quizTitle">
        <div class="quiz-head">
          <div>
            <p class="eyebrow">Quick Check</p>
            <h2 id="quizTitle" class="quiz-title">빠른 확인</h2>
          </div>
          <span id="quizCount" class="quiz-count">1 / 4</span>
        </div>
        <div class="progress"><div id="progressBar" class="progress-bar"></div></div>
        <p id="prompt" class="prompt"></p>
        <p id="hint"   class="hint"></p>
        <div id="choices"  class="choices"></div>
        <div id="feedback" class="feedback"></div>
        <div class="actions">
          <button id="resetBtn" class="btn"         type="button"><i class="fa-solid fa-rotate-left"></i> 처음부터</button>
          <button id="nextBtn"  class="btn primary" type="button" disabled>다음 <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </article>
      <article id="resultCard" class="result-card"></article>
    </section>

    <nav class="footer-nav" aria-label="문법 이동">
      <a class="btn"         href="index.html"><i class="fa-solid fa-list"></i> [N]과 목록</a>
      <a class="btn"         href="grammar[N]-support-quiz.html">보조 퀴즈</a>
      <a class="btn primary" href="grammar[N+1].html">문법 [N+1] <i class="fa-solid fa-arrow-right"></i></a>
    </nav>
  </main>

  <!-- 설정 객체 -->
  <script>
  window.GRAMMAR_PAGE_CONFIG = { /* 아래 스키마 참조 */ };
  </script>
  <script src="grammar-main.js"></script>
  <script src="../shared/multilang-toggle.js"></script>
  <script src="../shared/site-copyright.js"></script>
</body>
```

### `window.GRAMMAR_PAGE_CONFIG` 스키마

```js
window.GRAMMAR_PAGE_CONFIG = {
    quizTitle:   "문법 N 빠른 확인",    // 연습 탭 제목
    summary:     "전체 완료 후 메시지", // 결과 카드 본문
    summaryHint: "핵심 정리 한 줄",     // 결과 카드 힌트
    quiz: [
        {
            prompt:   "문제 문장 (HTML 가능)",
            hint:     "힌트 문장",
            choices:  ["선택지1", "선택지2", "선택지3", "선택지4"],
            answer:   0,                      // choices 인덱스 (0-based)
            feedback: "해설 (HTML 가능)"
        },
        // … 4~6문항 권장
    ]
};
```

---

## T-03. 문법 보조 퀴즈 (`grammar[N]-support-quiz.html`)

**역할**: 3단계 비계(scaffold) 퀴즈. 뜻 → 형태 → 문맥 순으로 심화.
**패턴**: `window.GRAMMAR_SUPPORT_CONFIG` + `grammar-support-quiz.js`

### HTML 뼈대

```html
<main class="shell">
  <section class="hero">
    <p class="eyebrow">Grammar [N] Support Quiz</p>
    <h1>문법 [N] 보조 퀴즈: [문법명]</h1>
    <p class="lead">…</p>
    <div class="hero-actions">
      <a class="link-btn" href="grammar[N].html">문법 [N] 학습</a>
      <a class="link-btn primary" href="grammar[N+1]-support-quiz.html">문법 [N+1] 퀴즈</a>
    </div>
  </section>

  <nav id="stageNav" class="stage-nav" aria-label="3단계 비계"></nav>

  <section class="layout">
    <section id="quizPanel" class="quiz-panel" aria-live="polite">
      <div class="quiz-head">
        <div>
          <p id="stageLabel" class="eyebrow"></p>
          <h2 id="stageTitle" class="quiz-title"></h2>
          <p id="stageFocus" class="quiz-focus"></p>
        </div>
        <span id="questionCount" class="counter"></span>
      </div>
      <div class="progress"><div id="progressBar" class="progress-bar"></div></div>
      <!-- 상황 컨텍스트 (stage 3에서 활성화) -->
      <div id="contextGrid" class="context-grid" hidden>
        <article class="context-box ko">
          <span class="context-label">쉬운 한국어 상황</span>
          <p id="contextKo" class="context-text"></p>
        </article>
        <article class="context-box vi">
          <span class="context-label">Tiếng Việt</span>
          <p id="contextVi" class="context-text"></p>
        </article>
      </div>
      <p id="prompt"   class="prompt"></p>
      <p id="hint"     class="hint"></p>
      <div id="choices"  class="choices"></div>
      <div id="feedback" class="feedback"></div>
      <div class="actions">
        <button id="resetBtn" type="button">이 단계 다시</button>
        <button id="nextBtn"  type="button" disabled>다음 문제</button>
      </div>
    </section>
    <section id="resultCard" class="result-card"></section>
  </section>
</main>
```

### `window.GRAMMAR_SUPPORT_CONFIG` 스키마

```js
window.GRAMMAR_SUPPORT_CONFIG = {
    grammar: "[N]",
    title:   "문법 [N] 보조 퀴즈: [문법명]",
    stages: [
        {
            id:    "meaning",
            label: "Stage 1",
            title: "뜻 파악",
            focus: "이 문법의 핵심 의미를 고르세요.",
            questions: [
                {
                    prompt:   "문제",
                    hint:     "힌트",
                    choices:  ["a","b","c","d"],
                    answer:   0,
                    feedback: "해설",
                    contextKo: null,   // Stage 3에서만 사용
                    contextVi: null
                }
            ]
        },
        { id: "form",    label: "Stage 2", title: "형태 만들기", focus: "…", questions: [] },
        { id: "context", label: "Stage 3", title: "문맥 속에서", focus: "…", questions: [] }
    ]
};
```

---

## T-04. 문법 보조 자료 (`grammar[N]-support-material[N].html`)

**역할**: 문법 사용 예시·비교표·상황 카드 등 읽기용 보조 자료.
**패턴**: JS 없이 정적 HTML. 다국어 토글만 적용.

```html
<main class="shell">
  <section class="hero">
    <h1>문법 [N] 보조 자료: [주제]</h1>
    <div data-multilang-bar></div>
  </section>
  <!-- 카드 그리드로 자료 제시 -->
  <section class="panel">
    <article class="card">…</article>
  </section>
  <nav class="footer-nav">…</nav>
</main>
```

---

## T-05. 어휘 메인 (`vocabulary.html`)

**역할**: 어휘 카드·정리 리스트·뜻/초성/그림 퀴즈를 하나의 페이지에서 제공.
**기준 구현**: c10 업그레이드 어휘 페이지에서 검증한 구조를 T-05 표준으로 채택.
**패턴**: `window.VOCABULARY_CONFIG` + 인라인 JS. 데이터가 복잡할 경우 `vocabulary-data.js`로 분리.

### 표준 기능

| 기능 | 표준 |
|------|------|
| 기본 뷰 | 카드 / 정리 / 퀴즈 |
| 카드 앞면 | 이미지 또는 placeholder, 선택적으로 표제어 오버레이 |
| 카드 뒷면 | 한국어 표제어 + 현재 선택 언어의 뜻/번역 + 범주 |
| 다국어 | `data-multilang-bar` + `preferred-lang` 연동 |
| 검색 | 한국어, 한국어 뜻, 예문, 번역, 범주명 전체 검색 |
| 범주 | `categories` 배열 기반 자동 버튼 생성 |
| 퀴즈 | 뜻 퀴즈 / 초성 퀴즈 / 그림 퀴즈 |
| 초성 퀴즈 | 이미지 위에 초성 오버레이 표시. 이미지 자체를 수정하지 않음 |
| 그림 퀴즈 | `image`가 있는 단어가 1개 이상일 때만 버튼 표시 |
| 이미지 없음 | 카드·목록·퀴즈 모두 placeholder로 유지 |
| 별도 퀴즈 이미지 | 카드 이미지에 글자가 포함될 경우 `quizImage`로 글자 없는 이미지를 지정 |

### 구조 개요

```html
<body>
  <nav class="topbar">…</nav>
  <main class="shell">
    <header class="hero">
      <p class="eyebrow">Chapter [N] Vocabulary</p>
      <h1>[N]과 어휘 학습</h1>
      <p class="hero__subtitle">…</p>
      <div data-multilang-bar></div>
    </header>

    <section class="toolbar" aria-label="학습 보기 선택">
      <div class="segmented" role="tablist">
        <button class="active" data-view="cards" type="button">카드</button>
        <button data-view="list"  type="button">정리</button>
        <button data-view="quiz"  type="button">퀴즈</button>
      </div>
      <div class="search">
        <input id="search-input" type="search" placeholder="어휘 검색">
      </div>
      <button id="front-headword-toggle" role="switch">표제어 표시</button>
      <button id="shuffle-btn" type="button">섞기</button>
    </section>

    <section class="toolbar" aria-label="어휘 범주 선택">
      <div id="category-filter" class="category-filter"></div>
    </section>

    <!-- 카드 뷰 -->
    <div id="cards-view" class="view active">
      <div id="word-grid" class="word-grid"></div>
    </div>
    <!-- 정리 뷰 -->
    <div id="list-view" class="view">
      <div id="list-panel" class="list-panel"></div>
    </div>
    <!-- 퀴즈 뷰 -->
    <div id="quiz-view" class="view">
      <div id="quiz-mode-selector" role="tablist"></div>
      <div id="quiz-question"></div>
      <div id="quiz-options"></div>
    </div>
  </main>
</body>
```

### `window.VOCABULARY_CONFIG` 스키마

```js
window.VOCABULARY_CONFIG = {
    chapter: "N",
    title: "[N]과 어휘 학습",
    subtitle: "[어휘 범주 설명]",
    languages: ["vi", "en", "ja", "zh"],   // 다국어 토글 표시 언어
    defaultLang: "none",                    // "none"이면 한국어 뜻 표시
    quizModes: ["meaning", "choseong", "image"],
    categories: [
        { id: "all", label: "전체" },
        { id: "cat1", label: "[범주명]" },
        { id: "cat2", label: "[범주명]" }
    ],
    words: [
        {
            ko: "단어",                         // 한국어 표제어 (필수)
            meaning: "한국어 뜻 설명",           // 기본 뜻 퀴즈 정답
            pos: "동사",                        // 선택
            category: "cat1",                   // categories.id 중 하나
            example: "예문입니다.",              // 선택
            vi: "nghĩa tiếng Việt",             // 선택
            en: "English meaning",              // 선택
            ja: "日本語の意味",                  // 선택
            zh: "中文意思",                      // 선택
            image: "../assets/c[N]/vocabulary/images/[파일명].webp", // 카드 이미지, 선택, null 가능
            imageAlt: "이미지 설명",             // 선택
            quizImage: "../assets/c[N]/vocabulary/images/[파일명-quiz].webp", // 선택
            quizImageAlt: "그림퀴즈 이미지 설명" // 선택
        }
    ]
};
```

### 퀴즈 모드 규칙

| 모드 | 질문 | 선택지 | 비고 |
|------|------|--------|------|
| `meaning` | 이미지 + 한국어 표제어 | 현재 선택 언어 번역. 언어가 `none`이면 `meaning` | 기본값 |
| `choseong` | 이미지 + 초성 오버레이 | 한국어 표제어 | 이미지가 없어도 placeholder 위에 표시 |
| `image` | 이미지 | 한국어 표제어 | `quizImage` 또는 `image`가 있는 단어가 있을 때만 버튼 표시 |

### 이미지 표준

- 권장 경로: `../assets/c[N]/vocabulary/images/[파일명].webp`
- 이미지가 준비되지 않은 단어는 `image: null` 유지
- 카드 이미지에 표제어나 힌트 글자가 들어가면 그림 퀴즈용으로 `quizImage`를 별도 지정한다.
- 이미지가 없어도 카드, 목록, 뜻 퀴즈, 초성 퀴즈는 동작해야 한다.
- 그림 퀴즈는 `quizImage` 또는 `image`가 있는 단어만 출제한다.

---

## T-06. 어휘 보조 활동 (`vocab-support-[주제].html`)

**역할**: 어휘를 특정 맥락·활동으로 심화 연습.
**패턴**: 활동 유형에 따라 자유 설계. 다국어 토글과 공통 topbar·footer-nav는 적용 필수.

**권장 활동 유형 (과당 4종 이상)**

| 유형 | 설명 | c17 사례 |
|------|------|----------|
| 흐름 도식 | 어휘 간 관계를 시각적 흐름으로 제시 | `vocab-support-rumor-flow.html` |
| 가능성/강도 측정 | 슬라이더·게이지로 어휘 뉘앙스 체험 | `vocab-support-possibility-meter.html` |
| 순서 배열 | 사건·이야기 순서 맞추기 | `vocab-support-misunderstanding-sequence.html` |
| 부사/어조 비교 | 비슷한 어휘의 뉘앙스 대조 | `vocab-support-adverb-tone.html` |
| 그림 퀴즈 | 이미지 보고 어휘 선택 | `vocab-support-picture-quiz.html` |
| 장면 재현 | 상황 일러스트와 어휘 매핑 | `vocab-support-rumor-scene.html` |

**필수 마크업 패턴**

```html
<body>
  <nav class="topbar">…[N]과 목록 링크 포함…</nav>
  <main class="shell">
    <header class="hero">
      <h1>[활동 제목]</h1>
      <div data-multilang-bar></div>  <!-- 활동에 번역 블록이 있는 경우 -->
    </header>
    <!-- 활동 콘텐츠 -->
    <nav class="footer-nav">
      <a href="vocabulary.html">어휘 메인</a>
      <a href="index.html">[N]과 목록</a>
    </nav>
  </main>
</body>
```

---

## T-07. 듣기 (`listening[N].html`)

**역할**: 듣기 전·중·후 활동 (이미지 컷 + 문항).
**패턴**: `shared/listening-workbook.js`가 `#listening-workbook-app`에 UI 전체를 렌더링.
콘텐츠 데이터는 `listening-data.js`로 분리.

```html
<body class="listening-bg">
  <nav id="injected-global-nav" class="injected-global-nav">
    <a href="../index.html">메인으로</a> |
    <a href="index.html">[N]과 목록</a> |
    <a href="listening2.html">듣기 2</a>   <!-- listening2의 경우 역방향 -->
  </nav>

  <div id="listening-workbook-app"></div>

  <script src="listening-data.js"></script>
  <script src="../shared/listening-workbook.js?v=[버전]"></script>
  <script src="../shared/multilang-toggle.js"></script>
  <script src="../shared/site-copyright.js"></script>
</body>
```

### `listening-data.js` 스키마

```js
window.LISTENING_DATA = {
    chapter: "[N]",
    tracks: [
        {
            id:      "track1",
            title:   "[듣기 제목]",
            audioSrc: "../assets/c[N]/listening/audio/[파일명].mp3",
            // 컷툰 이미지 시퀀스
            cuts: [
                { src: "../assets/c[N]/listening/images/[파일명].webp", caption: "…", timeStart: 0, timeEnd: 12 }
            ],
            // 듣기 전 활동
            preTasks: [
                { type: "discussion", prompt: "…", options: ["…", "…"] }
            ],
            // 듣기 중 문항
            duringTasks: [
                { type: "multiple-choice", prompt: "…", choices: [], answer: 0, feedback: "…" }
            ],
            // 듣기 후 활동
            postTasks: [
                { type: "discussion", prompt: "…" }
            ],
            // 대본
            transcript: [
                { speaker: "남", text: "…", start: 0, end: 8 }
            ],
            // 다국어 번역 (선택)
            translations: {
                vi: [ "…" ],
                en: [ "…" ]
            }
        }
    ]
};
```

---

## T-08. 읽기 메인 (`reading.html`)

**역할**: 본문 읽기 + 이해 문항 + 읽기 전 준비 활동.
**패턴**: 대부분 정적 HTML. 다국어 토글 적용.

```html
<body class="reading-bg">
  <nav class="topbar">…</nav>
  <main id="page" class="shell">

    <section class="hero">
      <div class="hero-main">
        <p class="eyebrow">Reading & Writing</p>
        <h1>[읽기 제목]</h1>
        <p class="lead">…</p>
        <div class="hero-actions">
          <a class="btn" href="#reading">읽기</a>
          <a class="btn secondary" href="reading-cuttoon.html">컷툰</a>
          <a class="btn secondary" href="writing-cut.html">컷 쓰기</a>
          <a class="btn secondary" href="#check">문제</a>
        </div>
        <div data-multilang-bar></div>
      </div>
    </section>

    <!-- 읽기 전 준비 -->
    <section class="section grid-2" aria-label="읽기 전 준비">
      <article class="card">
        <span class="badge">준비</span>
        <p>…준비 질문…</p>
        <div data-lang="vi" class="lang-box">…</div>
      </article>
      <article class="card">
        <span class="badge amber">읽기 목표</span>
        <p>…목표…</p>
        <div data-lang="vi" class="lang-box">…</div>
      </article>
    </section>

    <!-- 본문 -->
    <section id="reading" class="section">
      <article class="reading-panel">
        <!-- 본문 단락. 핵심 어휘에 <ruby> 태그 사용 가능 -->
      </article>
    </section>

    <!-- 이해 확인 문항 -->
    <section id="check" class="section" aria-label="이해 확인">
      <!-- 객관식 문항 -->
    </section>

    <nav class="footer-nav">…</nav>
  </main>
  <script src="../shared/multilang-toggle.js"></script>
</body>
```

---

## T-09. 읽기 웹툰 (`reading-cuttoon.html`)

**역할**: 읽기 지문을 컷툰(만화 컷) 형식으로 재구성하여 내용 이해 보조.

```html
<body>
  <nav class="topbar">…</nav>
  <main class="shell">
    <header class="hero">
      <h1>[N]과 컷툰</h1>
      <div data-multilang-bar></div>
    </header>
    <!-- 컷 그리드 -->
    <section class="cuttoon-grid">
      <figure class="cut">
        <img src="../assets/c[N]/reading-writing/images/cuttoon/[파일명].webp" alt="[장면 설명]" loading="lazy">
        <figcaption>
          <p class="cut-caption">…</p>
          <p data-lang="vi" class="lang-box">…</p>
        </figcaption>
      </figure>
    </section>
    <nav class="footer-nav">…</nav>
  </main>
  <script src="../shared/multilang-toggle.js"></script>
</body>
```

---

## T-10. 쓰기 학생용 (`writing-cut.html`)

**역할**: 컷 이미지를 보며 단계별(선택→핵심어→어순→빈칸) 쓰기 연습.
**패턴**: `window.WRITING_CUT_CONFIG` + `writing-cut.js`.

```html
<body class="writing-bg">
  <nav class="topbar">…</nav>
  <main class="shell">
    <section class="hero">
      <p class="eyebrow">Cut Writing</p>
      <h1>[제목] 컷 쓰기</h1>
      <p class="lead">…</p>
      <div class="actions">
        <a class="btn" href="reading.html">지문 읽기</a>
        <a class="btn primary" href="reading-cuttoon.html">컷툰 보기</a>
      </div>
      <div data-multilang-bar></div>
    </section>

    <section class="practice" aria-label="컷 쓰기 연습">
      <aside class="rail" aria-label="컷 선택">
        <h2>컷 선택</h2>
        <div id="cutRail"></div>
      </aside>
      <section class="workbench" aria-live="polite">
        <div class="stage-head">
          <div class="stage-title">
            <p class="eyebrow" id="stageEyebrow">Step</p>
            <h2 id="stageTitle">연습 준비</h2>
          </div>
          <div class="progress-dots" id="progressDots"></div>
        </div>
        <div class="mode-row" id="modeRow"></div>
        <div class="work-grid">
          <figure class="image-panel">
            <img id="cutImage" src="" alt="">
            <figcaption class="caption" id="cutCaption"></figcaption>
          </figure>
          <div class="task-panel">
            <article class="answer-card">
              <h3 id="taskHeading"></h3>
              <p  id="taskGuide"></p>
              <div id="taskBody"></div>
              <div class="feedback" id="feedback"></div>
              <div class="answer-text" id="answerText"></div>
              <div class="button-row">
                <button id="prevBtn"       class="btn">이전</button>
                <button id="checkBtn"      class="btn">확인</button>
                <button id="showAnswerBtn" class="btn">정답 보기</button>
                <button id="nextBtn"       class="btn rose">다음</button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </section>

    <nav class="footer-nav">
      <a class="btn" href="reading-cuttoon.html">컷툰 보기</a>
      <a class="btn primary" href="index.html">[N]과 목록</a>
    </nav>
  </main>

  <script src="writing-cut.js"></script>
  <script src="../shared/multilang-toggle.js"></script>
  <script src="../shared/site-copyright.js"></script>
</body>
```

---

## T-11. 쓰기 교사용 (`writing-cut-teacher.html`)

**역할**: 교사가 수업 중 컷·모범 답안을 화면에 표시하는 뷰.
**패턴**: `writing-cut.html`과 같은 `writing-cut.js` 공유. `body.teacher-mode`로 분기.

```html
<body class="teacher-mode">
  <!-- 교사용 배너 -->
  <div class="teacher-banner">
    <i class="fa-solid fa-chalkboard-teacher"></i>
    <span>교사용 화면</span>
  </div>

  <nav class="global-nav" aria-label="페이지 이동">
    <div class="global-nav-links">
      <a href="../index.html">메인</a>
      <a href="index.html">[N]과 목록</a>
      <a href="writing-cut.html">학생용</a>
      <a href="writing-cut-teacher.html" aria-current="page">교사용</a>
    </div>
  </nav>

  <main class="page-shell">
    <div id="app" class="app-root"></div>
  </main>

  <script src="writing-cut.js"></script>
  <script src="../shared/site-copyright.js"></script>
</body>
```

**teacher-mode CSS 규칙 (writing-cut.html 내 또는 공유 CSS에 포함)**

```css
.teacher-banner {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #1e3a5f;
    color: #ffffff;
    font-size: 13px;
    font-weight: 900;
}

/* 교사 모드에서 pill 버튼 강조 */
.teacher-mode .step-pill.active,
.teacher-mode .cut-pill.active {
    background: #1e3a5f;
    color: #ffffff;
}
```

---

## T-12. 말하기 PRO (`grammar[N]-speaking-pro.html`)

**역할**: 문법 항목별 말하기 연습. 상황 제시 → 모범 답 확인 → 녹음 반복.
**패턴**: `shared/c15-speaking-pro.css` + `shared/c15-speaking-pro.js`.
데이터는 `window.SPEAKING_PRO_CONFIG`로 정의 (기존 패턴 유지).

```html
<head>
  <link rel="stylesheet" href="../shared/design-tokens.css" />
  <link rel="stylesheet" href="../shared/project-topbar-compact.css" />
  <link rel="stylesheet" href="../shared/c15-speaking-pro.css" />
</head>
<body class="speaking-pro-page">
  <nav class="sp-nav">…</nav>
  <main>
    <script>
    window.SPEAKING_PRO_CONFIG = {
        storageKey: 'c[N]-grammar[M]-speaking-pro-v1',
        title:      '[N]과 문법 [M] 말하기 연습 PRO',
        grammar:    '[문법 형태]',
        situations: [
            {
                id:       "s1",
                scene:    "상황 설명",
                cue:      "제시 문장/그림 설명",
                model:    "모범 답",
                // 다국어 번역
                vi:       "베트남어 번역"
            }
        ]
    };
    </script>
    <script src="../shared/c15-speaking-pro.js"></script>
    <script src="../shared/multilang-toggle.js"></script>
  </main>
</body>
```

---

## 요약: 유형별 핵심 파일·패턴 대응표

| 유형 | HTML | 공유 CSS | 공유 JS | 데이터 객체 |
|------|------|----------|---------|------------|
| 허브 | `index.html` | `design-tokens.css` | — | 없음 (인라인) |
| 문법 메인 | `grammar[N].html` | `grammar-main.css` | `grammar-main.js` | `GRAMMAR_PAGE_CONFIG` |
| 문법 보조퀴즈 | `grammar[N]-support-quiz.html` | `grammar-support-quiz.css` | `grammar-support-quiz.js` | `GRAMMAR_SUPPORT_CONFIG` |
| 문법 보조자료 | `grammar[N]-support-material[N].html` | `design-tokens.css` | — | 없음 |
| 말하기 PRO | `grammar[N]-speaking-pro.html` | `c15-speaking-pro.css` | `c15-speaking-pro.js` | `SPEAKING_PRO_CONFIG` |
| 어휘 메인 | `vocabulary.html` | `design-tokens.css` | `VOCABULARY_CONFIG` + 인라인 JS (뜻·초성·그림 퀴즈) | `VOCABULARY_CONFIG` |
| 어휘 보조 | `vocab-support-[주제].html` | `design-tokens.css` | 활동별 인라인 | 활동별 |
| 듣기 | `listening[N].html` | `design-tokens.css` | `listening-workbook.js` | `LISTENING_DATA` (외부 파일) |
| 읽기 메인 | `reading.html` | `design-tokens.css` | — | 없음 |
| 읽기 웹툰 | `reading-cuttoon.html` | `design-tokens.css` | — | 없음 |
| 쓰기 학생 | `writing-cut.html` | `design-tokens.css` | `writing-cut.js` | 인라인 |
| 쓰기 교사 | `writing-cut-teacher.html` | `design-tokens.css` | `writing-cut.js` | 공유 |
