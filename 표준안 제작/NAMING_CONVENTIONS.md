# 네이밍 컨벤션

> 작성일: 2026-05-31

---

## 1. 과 폴더명

```
c[N]/          예) c10, c11, c17, c18
```

- 소문자 `c` + 과 번호 (두 자리 미만도 한 자리 그대로 사용)
- 새 교재(3A, 4B 등)는 접두사 추가: `3a-c01/`, `4b-c01/`

---

## 2. 페이지 파일명

모두 소문자 kebab-case. 공백·언더스코어 금지.

| 유형 | 파일명 패턴 | 예시 |
|------|------------|------|
| 챕터 허브 | `index.html` | `c17/index.html` |
| 문법 메인 | `grammar[N].html` | `grammar1.html` |
| 문법 보조 퀴즈 | `grammar[N]-support-quiz.html` | `grammar1-support-quiz.html` |
| 문법 보조 자료 | `grammar[N]-support-material[N].html` | `grammar3-support-material1.html` |
| 말하기 PRO | `grammar[N]-speaking-pro.html` | `grammar2-speaking-pro.html` |
| 어휘 메인 | `vocabulary.html` | — |
| 어휘 보조 | `vocab-support-[주제].html` | `vocab-support-rumor-flow.html` |
| 듣기 | `listening[N].html` | `listening1.html` |
| 읽기 메인 | `reading.html` | — |
| 읽기 웹툰 | `reading-cuttoon.html` | — |
| 쓰기 학생용 | `writing-cut.html` | — |
| 쓰기 교사용 | `writing-cut-teacher.html` | — |

### 규칙

- **`[N]`**: 1부터 시작하는 정수. 앞에 0 붙이지 않음 (`grammar1`, not `grammar01`)
- **`[주제]`**: 영어 단어 또는 한국어 로마자. 길어지면 2-3 단어 hyphon 연결 (`rumor-flow`, `home-issues`)
- **실험·게임 파일**: 표준 파일명에 suffix 추가. `-game`, `-animation` 등. 표준 폴더에 두되 표준 파일과 명확히 구분

---

## 3. 데이터·로직 파일명

| 용도 | 파일명 패턴 | 예시 |
|------|------------|------|
| 듣기 데이터 | `listening-data.js` | — |
| 어휘 데이터 (분리 시) | `vocabulary-data.js` | — |
| 쓰기 로직 | `writing-cut.js` | — |
| 문법 공유 스타일 | `grammar-main.css` | — |
| 문법 공유 로직 | `grammar-main.js` | — |
| 문법 보조퀴즈 공유 스타일 | `grammar-support-quiz.css` | — |
| 문법 보조퀴즈 공유 로직 | `grammar-support-quiz.js` | — |

---

## 4. 공유(shared) 파일명

`shared/` 폴더에 위치. 여러 과에서 참조.

| 파일 | 용도 |
|------|------|
| `design-tokens.css` | 통합 CSS 변수 |
| `project-topbar-compact.css` | 공통 topbar 오버라이드 |
| `multilang-toggle.css` | 다국어 토글 스타일 |
| `multilang-toggle.js` | 다국어 토글 로직 |
| `c15-speaking-pro.css` | 말하기 PRO 스타일 |
| `c15-speaking-pro.js` | 말하기 PRO 로직 |
| `listening-workbook.css` | 듣기 워크북 스타일 |
| `listening-workbook.js` | 듣기 워크북 로직 |
| `text-markup.js` | 인라인 `==...==` 렌더 |
| `site-copyright.js` | 저작권 주입 |

---

## 5. 에셋 경로

`ASSET_PATH_GUIDELINES.md` 참조. 요약:

```
assets/c[N]/vocabulary/images/
assets/c[N]/vocabulary/audio/
assets/c[N]/grammar/images/
assets/c[N]/listening/images/
assets/c[N]/listening/audio/
assets/c[N]/reading-writing/images/cuttoon/
assets/c[N]/reading-writing/images/writing-cut/
assets/c[N]/reading-writing/audio/
```

- 이미지 포맷: `.webp` 권장 (fallback `.png`/`.jpg` 허용)
- 파일명: `c[N]-[섹션]-[설명]-[순번].webp` (예: `c17-writing-cut-01.webp`)

---

## 6. JS 설정 객체명 컨벤션

| 유형 | 객체명 |
|------|--------|
| 문법 메인 | `window.GRAMMAR_PAGE_CONFIG` |
| 문법 보조퀴즈 | `window.GRAMMAR_SUPPORT_CONFIG` |
| 말하기 PRO | `window.SPEAKING_PRO_CONFIG` |
| 어휘 메인 | `window.VOCABULARY_CONFIG` |
| 듣기 | `window.LISTENING_DATA` (listening-data.js 내 정의) |

> **기존 과 호환 주의**: c17은 `window.C17_GRAMMAR_PAGE`, `window.C17_GRAMMAR_SUPPORT`를 사용.
> 신규 과부터 위 표준 명칭으로 전환. 공유 JS 파일이 두 명칭을 모두 지원하도록 작성할 것.

---

## 7. 금지 패턴

| 금지 | 이유 |
|------|------|
| `-backup`, `-original-backup` suffix | 실험 파일을 저장소에 남기지 않음. 백업은 `../backup/` 외부 폴더로 |
| `-v2`, `-improved`, `-pro` (비표준 suffix) | 버전 관리는 Git으로 |
| Tailwind CDN 로드 | 표준 CSS 변수 시스템과 충돌. 커스텀 CSS로 대체 |
| `localStorage` 없이 다국어 상태 관리 | 페이지 이동 시 상태 유실 |
