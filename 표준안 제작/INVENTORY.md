# 완숙기 페이지 유형 인벤토리 (c15~c17)

> 작성일: 2026-05-31
> 분석 범위: c15(완숙기 초), c16(완숙기 중), c17(완숙기 말 / 표준 기준)
> 실험·백업·모의고사 파일은 별도 구분

---

## 1. 표준 구성 파일 목록

아래 표에서 ✅ = 존재, ❌ = 없음, ⚠️ = 존재하나 구조 차이 있음

### 1-1. 핵심 페이지

| 유형 | 파일명 | c15 | c16 | c17 | 표준 포함 | 비고 |
|------|--------|-----|-----|-----|-----------|------|
| 챕터 허브 | `index.html` | ✅ | ✅ | ✅ | ✅ | |
| 문법 메인 1~4 | `grammar[N].html` | ✅ | ✅ | ✅ | ✅ | c17이 공유 JS/CSS 도입 |
| 어휘 메인 | `vocabulary.html` | ⚠️ | ⚠️ | ✅ | ✅ | 구현 방식 차이 큼 (§3 참조) |
| 듣기 1~2 | `listening[N].html` | ✅ | ✅ | ✅ | ✅ | |
| 읽기 메인 | `reading.html` | ❌ | ✅ | ✅ | ✅ | c15 누락 |
| 읽기 웹툰 | `reading-cuttoon.html` | ✅ | ✅ | ✅ | ✅ | |
| 쓰기 | `writing-cut.html` | ✅ | ✅ | ✅ | ✅ | |
| 쓰기 교사용 | `writing-cut-teacher.html` | ✅ | ✅ | ❌ | ✅ | c17에서 누락됨 |

### 1-2. 보조 페이지

| 유형 | 파일 패턴 | c15 | c16 | c17 | 표준 포함 | 비고 |
|------|-----------|-----|-----|-----|-----------|------|
| 문법 보조 퀴즈 | `grammar[N]-support-quiz.html` | ❌ | ❌ | ✅ (1,2) | ✅ | c17 신규 도입 |
| 문법 보조 자료 | `grammar[N]-support-material[N].html` | ❌ | ❌ | ✅ (3,4) | ✅ | c17 신규 도입 |
| 말하기 PRO | `grammar[N]-speaking-pro.html` | ✅ (1,2) | ✅ (1~4) | ❌ | ✅ | shared 구현 있음 |
| 어휘 보조 활동 | `vocab-support-[주제].html` | ✅ (4종) | ✅ (4종) | ✅ (6종) | ✅ | 주제별 다양 |
| 듣기 학생용 | `listening-student.html` | ✅ | ❌ | ❌ | 검토 | c15 단독, 그림+오디오 뷰 |
| 쓰기 컷+듣기 | `writing-cut-listening.html` | ✅ | ❌ | ❌ | 검토 | c15 단독, 음성 지원 쓰기 |

### 1-3. 데이터·공유 파일

| 파일 | c15 | c16 | c17 | 비고 |
|------|-----|-----|-----|------|
| `grammar-main.css` | ❌ | ❌ | ✅ | 문법 4페이지 공유 스타일 |
| `grammar-main.js` | ❌ | ❌ | ✅ | 문법 4페이지 공유 로직 |
| `grammar-support-quiz.css` | ❌ | ❌ | ✅ | 문법 보조퀴즈 공유 스타일 |
| `grammar-support-quiz.js` | ❌ | ❌ | ✅ | 문법 보조퀴즈 공유 로직 |
| `listening-data.js` | ❌ | ✅ | ✅ | 듣기 데이터 분리 |
| `writing-cut.js` | ✅ | ✅ | ✅ | 쓰기 로직 |
| `lesson-outline.md` | ✅ | ✅ | ❌ | 단원 기획 메모 |

### 1-4. 표준 외 파일 (모의고사·실험·백업)

| 파일 | 과 | 분류 |
|------|-----|------|
| `mock-exam.html`, `mock-exam-2.html` | c15 | 모의고사 (부록) |
| `mock-exam.html`, `mock16.html` | c16 | 모의고사 (부록) |
| `mock-exam-data.js`, `mock-exam-2-data.js`, `mock-exam.css`, `mock-exam.js` | c15 | 모의고사 지원 파일 |
| `grammar1-ge-hada-game*.html` (4종) | c15 | 실험적 게임 |
| `grammar2-bubble-sort-game.html` | c15 | 실험적 게임 |
| `grammar3-must-do-mission.html` | c15 | 실험적 게임 |
| `grammar4-route-animation*.html` (4종) | c15 | 실험적 게임·백업 |
| `grammar1-size-match.html` | c16 | 실험적 게임 |
| `grammar2-umdu-gauge.html`, `grammar3-threshold-animation.html` 등 | c16 | 실험적 게임 |
| `grammar4-*-map-*.html` (6종) | c16 | 실험적 지도 게임 |
| `rumor-game-next/` | c17 | 실험적 게임 폴더 |

---

## 2. 표준 구성 파일 트리 (확정안)

```
cXX/
├── index.html                          # 챕터 허브
│
├── grammar-main.css                    # ★ 문법 공유 스타일
├── grammar-main.js                     # ★ 문법 공유 로직
├── grammar-support-quiz.css            # ★ 문법 보조퀴즈 공유 스타일
├── grammar-support-quiz.js             # ★ 문법 보조퀴즈 공유 로직
│
├── grammar1.html                       # 문법 메인 1 (데이터만 정의)
├── grammar2.html                       # 문법 메인 2
├── grammar3.html                       # 문법 메인 3
├── grammar4.html                       # 문법 메인 4
│
├── grammar1-support-quiz.html          # 문법 1 보조퀴즈
├── grammar2-support-quiz.html          # 문법 2 보조퀴즈
├── grammar3-support-material1.html     # 문법 3 보조자료
├── grammar4-support-material1.html     # 문법 4 보조자료
│
├── grammar1-speaking-pro.html          # 문법 1 말하기 PRO  ← c15·c16 패턴 복원
├── grammar2-speaking-pro.html          # 문법 2 말하기 PRO
├── grammar3-speaking-pro.html          # 문법 3 말하기 PRO
├── grammar4-speaking-pro.html          # 문법 4 말하기 PRO
│
├── vocabulary.html                     # 어휘 메인
├── vocab-support-[주제1].html          # 어휘 보조 1
├── vocab-support-[주제2].html          # 어휘 보조 2
├── vocab-support-[주제3].html          # 어휘 보조 3
├── vocab-support-[주제4].html          # 어휘 보조 4 (최소 4종 권장)
│
├── listening-data.js                   # 듣기 데이터
├── listening1.html                     # 듣기 1
├── listening2.html                     # 듣기 2
│
├── reading.html                        # 읽기 메인
├── reading-cuttoon.html                # 읽기 웹툰
│
├── writing-cut.js                      # 쓰기 로직
├── writing-cut.html                    # 쓰기 학생용
└── writing-cut-teacher.html            # 쓰기 교사용
```

> **검토 보류**: `listening-student.html`, `writing-cut-listening.html`
> 두 파일은 특정 콘텐츠 특성(오디오 내장 쓰기 컷, 그림 중심 듣기)으로 c15에만 존재.
> 모든 과에 해당되는지 검토 후 표준 포함 여부 결정.

---

## 3. 과별 파일 수 요약

| 과 | 표준 파일 | 보조·실험 파일 | 합계 |
|----|-----------|----------------|------|
| c15 | 12 | 20 | 32 |
| c16 | 12 | 22 | 34 |
| c17 | 18 | 3 | 21 |

c17이 파일 수는 가장 적지만 **표준 파일 비율**이 가장 높음(86%).

---

## 4. shared/ 폴더 현황

| 파일 | 용도 | 사용 과 |
|------|------|---------|
| `project-topbar-compact.css` | 공통 topbar | c17 |
| `c15-speaking-pro.css` | 말하기 PRO 스타일 | c15, c16 |
| `c15-speaking-pro.js` | 말하기 PRO 로직 | c15, c16 |
| `listening-workbook.css` | 듣기 워크북 스타일 | c15 |
| `listening-workbook.js` | 듣기 워크북 로직 | c15 |
| `listening-cuttoon-sync.css` | 듣기 컷툰 동기화 | c15 |
| `listening-cuttoon-sync.js` | 듣기 컷툰 동기화 | c15 |
| `listening-cuttoon.css` | 듣기 컷툰 스타일 | c14? |
| `listening-cuttoon.js` | 듣기 컷툰 로직 | c14? |
| `text-markup.js` | 인라인 마크업 렌더 | 공통 |
| `site-copyright.js` | 저작권 주입 | c17 |
| `pc-mode.js` | PC 모드 전환 | ? |
| `speaking-lab.css/js` | 말하기 랩 | ? |
| `vietnamese-pronunciation-lab.css/js` | 베트남어 발음 랩 | ? |
| `grammar-bilingual-layout.js` | 이중언어 문법 레이아웃 | ? |
