# 신규 과 제작 체크리스트

> 이 체크리스트를 순서대로 따라가면 표준안에 부합하는 과를 처음부터 제작할 수 있다.

---

## 0단계 — 준비

- [ ] `c[N]/` 폴더 생성
- [ ] `lesson-outline.md` 작성 (어휘 범주, 문법 목록, 듣기 주제, 읽기 주제)
- [ ] 에셋 폴더 생성
  ```
  assets/c[N]/vocabulary/images/
  assets/c[N]/grammar/images/
  assets/c[N]/listening/images/
  assets/c[N]/listening/audio/
  assets/c[N]/reading-writing/images/cuttoon/
  assets/c[N]/reading-writing/images/writing-cut/
  assets/c[N]/reading-writing/audio/
  ```

---

## 1단계 — 공유 파일 확인

- [ ] `shared/design-tokens.css` 최신 버전 확인
- [ ] `shared/multilang-toggle.js` / `multilang-toggle.css` 존재 확인
- [ ] `shared/project-topbar-compact.css` 존재 확인
- [ ] `shared/grammar-main.css` / `grammar-main.js` 존재 확인 (또는 c[N]/ 폴더에 복사)
- [ ] `shared/grammar-support-quiz.css` / `grammar-support-quiz.js` 존재 확인
- [ ] `shared/c15-speaking-pro.css` / `c15-speaking-pro.js` 존재 확인
- [ ] `shared/listening-workbook.css` / `listening-workbook.js` 존재 확인

---

## 2단계 — 어휘 (`vocabulary.html` + `vocab-support-*.html`)

- [ ] `vocabulary.html` 작성
  - [ ] `window.VOCABULARY_CONFIG` 데이터 입력 (`ko`, `meaning`, `vi`, `en`, `ja`, `zh`, `image` 필드)
  - [ ] 범주(category) 2~4개 설정
  - [ ] 뷰 모드 3종 (카드·정리·퀴즈) 동작 확인
  - [ ] 퀴즈 모드 3종 (뜻·초성·그림) 동작 확인
  - [ ] 초성 퀴즈가 이미지 위 오버레이로 표시되는지 확인
  - [ ] 이미지가 없는 단어는 placeholder로 표시되는지 확인
  - [ ] 카드 이미지에 글자가 들어간 경우 `quizImage`에 글자 없는 이미지를 별도 연결
  - [ ] `image`가 없는 과에서는 그림 퀴즈 버튼이 숨겨지는지 확인
  - [ ] `[data-multilang-bar]` 삽입 + `preferred-lang` 연동 확인
- [ ] 어휘 보조 활동 4종 이상 작성 (`vocab-support-[주제].html`)
  - [ ] topbar + footer-nav 포함
  - [ ] 다국어 토글 필요 시 적용

---

## 3단계 — 문법 (`grammar[N].html` × 4 + 보조 × 4 + 말하기 × 4)

문법 1~4 각각:

- [ ] `grammar[N].html` 작성
  - [ ] `window.GRAMMAR_PAGE_CONFIG` 설정 (quizTitle, summary, summaryHint, quiz 4~6문항)
  - [ ] 학습 패널 카드 4개 (Meaning / Form / Compare / Examples)
  - [ ] 각 카드에 `[data-lang="vi"]` 번역 블록
  - [ ] `[data-multilang-bar]` hero 내에 삽입
  - [ ] footer-nav: 목록·보조퀴즈·다음문법 링크

- [ ] `grammar[N]-support-quiz.html` (문법 1~2) 또는 `grammar[N]-support-material1.html` (문법 3~4) 작성
  - [ ] `window.GRAMMAR_SUPPORT_CONFIG` 3단계 구조 입력
  - [ ] stage 3 contextKo / contextVi 입력

- [ ] `grammar[N]-speaking-pro.html` 작성
  - [ ] `window.SPEAKING_PRO_CONFIG` 상황 3~5개 입력
  - [ ] vi 번역 입력

---

## 4단계 — 듣기 (`listening-data.js` + `listening1.html` + `listening2.html`)

- [ ] `listening-data.js` 작성
  - [ ] `window.LISTENING_DATA` 스키마 준수
  - [ ] 컷 이미지 timeStart/timeEnd 입력
  - [ ] 듣기 전·중·후 문항 입력
  - [ ] 대본(transcript) 입력
  - [ ] vi 번역 입력 (선택)
- [ ] `listening1.html`, `listening2.html` 작성 (각각 `listening-workbook.js` 연결)

---

## 5단계 — 읽기 (`reading.html` + `reading-cuttoon.html`)

- [ ] `reading.html` 작성
  - [ ] 읽기 전 준비 카드 2개
  - [ ] 본문 + 이해 문항
  - [ ] `[data-multilang-bar]` + vi 번역 블록
- [ ] `reading-cuttoon.html` 작성
  - [ ] 컷 이미지 + figcaption + vi 번역

---

## 6단계 — 쓰기 (`writing-cut.html` + `writing-cut-teacher.html`)

- [ ] 컷 이미지 에셋 준비 (webp)
- [ ] `writing-cut.js` 데이터 입력 (컷별 단계 데이터)
- [ ] `writing-cut.html` 작성
  - [ ] `.practice` > `.rail` + `.workbench` 구조
  - [ ] `[data-multilang-bar]` 적용 (번역 있는 경우)
- [ ] `writing-cut-teacher.html` 작성
  - [ ] `body.teacher-mode` + `.teacher-banner`
  - [ ] `writing-cut.js` 공유

---

## 7단계 — 챕터 허브 (`index.html`)

- [ ] `index.html` 작성
  - [ ] `body.hub-bg`
  - [ ] hero: 단원 번호·제목·chip 요약
  - [ ] 섹션별 `.path-card` (vocab·grammar·listening·reading·speaking)
  - [ ] 모든 완성 페이지 `lesson-link` 연결
  - [ ] 미완성 항목 `lesson-link--coming` 표시

---

## 8단계 — 검수

- [ ] 모든 링크 동작 확인 (topbar·footer-nav·허브 링크)
- [ ] 다국어 토글: 베트남어 선택 시 모든 `[data-lang="vi"]` 블록 표시 확인
- [ ] `localStorage` 언어 유지: 페이지 이동 후 선택 언어 유지 확인
- [ ] 모바일(360px) 뷰포트에서 가로 스크롤 없음 확인
- [ ] `ACCESSIBILITY_CHECKLIST.md` 기준으로 항목 검토 후 `c[N]/ACCESSIBILITY_REVIEW.md` 작성
- [ ] `grammar-main.js` 퀴즈 4문항 이상 동작 확인
- [ ] 교사용(`writing-cut-teacher.html`) 교사 배너·모드 분기 확인
