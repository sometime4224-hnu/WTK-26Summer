# 한국어 학습용 웹페이지 표준안 수립 계획

> 작성일: 2026-05-31
> 목적: 고려대 한국어 3B 학습 웹페이지의 재현 가능한 제작 표준 확립

---

## 1. 배경 및 목표

### 단계 구분

| 단계 | 과 | 성격 |
|------|-----|------|
| 초기 | c10, c11, c12 | 기능 탐색, 페이지 유형 실험 |
| 성숙기 | c13, c14 | 미니게임·보조 활동 추가, 구조 다양화 |
| 완숙기 | c15, c16, c17 | 일관된 구조, 공유 리소스, 데이터 주도 패턴 |

**표준안 기준 과**: c17 (가장 정제된 구조)
**어휘 메인 기준 구현**: c10 업그레이드 어휘 페이지 (뜻·초성·그림 퀴즈 포함)
**보완 검토 과**: c15, c16 (완숙기 전체), 필요시 c13~c14

### 표준안 수립의 핵심 목표
- 신규 과(예: 3A, 4B 등) 제작 시 일관된 품질을 빠르게 달성
- 페이지 유형별 템플릿을 명문화하여 재작업 최소화
- 완숙기에서 확인된 아키텍처 패턴(공유 CSS/JS, 데이터 주도)을 전면 채택

---

## 2. 분석 대상 현황

### 완숙기 핵심 파일 구조 (c17 기준)

```
c17/
├── index.html                   # 챕터 허브
├── grammar-main.css             # ★ 문법 페이지 공유 스타일
├── grammar-main.js              # ★ 문법 페이지 공유 로직
├── grammar1.html ~ grammar4.html        # 문법 메인 (학습+연습 탭)
├── grammar1-support-quiz.html          # 문법 보조 퀴즈
├── grammar2-support-quiz.html
├── grammar3-support-material1.html     # 문법 보조 자료
├── grammar4-support-material1.html
├── vocabulary.html              # 어휘 메인
├── vocab-support-*.html         # 어휘 보조 활동 (4종)
├── listening1.html / listening2.html   # 듣기
├── reading.html                 # 읽기
├── reading-cuttoon.html         # 읽기 웹툰
├── writing-cut.html / writing-cut.js   # 쓰기
└── listening-data.js            # 듣기 데이터 분리
```

### 완숙기에서 확인된 핵심 아키텍처 패턴

1. **데이터-뷰 분리**: `grammar1.html`은 `window.C17_GRAMMAR_PAGE` 설정 객체만 정의하고, 렌더링·인터랙션은 `grammar-main.js`가 담당
2. **공유 CSS**: `grammar-main.css`가 문법 4페이지 전체 스타일 통합
3. **공유 topbar**: `../shared/project-topbar-compact.css` 사용
4. **베트남어 토글**: `viToggle` 버튼으로 `.vi-text` 블록 표시/숨김
5. **학습-연습 탭**: `tabLearn` / `tabPractice` 탭 구조
6. **footer-nav**: 각 페이지 하단에 앞뒤 이동 + 보조 링크

---

## 3. 표준안 수립 작업 계획

### Phase 1 — 인벤토리 및 갭 분석 (착수 단계)

**목적**: 완숙기 3개 과(c15~c17)의 모든 페이지를 페이지 유형별로 분류하고, 과 간 불일치를 명확히 파악

**세부 작업**

| 번호 | 작업 | 산출물 |
|------|------|--------|
| 1-A | 페이지 유형 분류표 작성 | `INVENTORY.md` |
| 1-B | c15·c16과 c17의 동일 유형 페이지 구조 비교 | `GAP_ANALYSIS.md` |
| 1-C | 초기·성숙기에만 있는 유형 중 표준에 포함할 것 결정 | `GAP_ANALYSIS.md` |
| 1-D | 기존 가이드라인 문서 검토 (PAGE_DESIGN_GUIDELINES, CONTENT_MARKUP_GUIDELINES 등) | 검토 메모 |

**페이지 유형 분류 기준**

- **허브**: `index.html`
- **문법 메인**: `grammar*.html` (학습+연습 탭)
- **문법 보조**: `grammar*-support-*.html`
- **어휘 메인**: `vocabulary.html`
- **어휘 보조**: `vocab-support-*.html`
- **듣기**: `listening*.html`
- **읽기**: `reading.html`, `reading-cuttoon.html`
- **쓰기**: `writing-cut.html`
- **모의고사**: `mock-exam.html`
- **기타/실험**: 백업·게임 변형 파일

---

### Phase 2 — 디자인 토큰 및 공유 리소스 표준화

**목적**: CSS 변수, 색상 팔레트, 타이포그래피, 레이아웃 규칙을 단일 소스로 통합

**세부 작업**

| 번호 | 작업 | 산출물 |
|------|------|--------|
| 2-A | c17 `grammar-main.css`와 `index.html` 인라인 CSS의 토큰 추출 | 토큰 목록 |
| 2-B | c15·c16 인라인 CSS와의 차이점 파악 (불일치 변수, 색상 분기) | |
| 2-C | 통합 CSS 변수 표준 정의 (섹션별 색상 체계 포함) | `shared/design-tokens.css` |
| 2-D | `shared/` 폴더 현황 점검 및 추가 공유 리소스 계획 | |

**주요 검토 항목**
- 섹션별 색상 변수: `--vocab`, `--grammar`, `--listening`, `--reading`, `--writing`
- 배경 그라디언트 패턴 (c17 기준 통일 여부)
- `body::before / ::after` 장식 블롭 패턴의 일관성
- 반응형 브레이크포인트 규칙

---

### Phase 3 — 페이지 유형별 템플릿 명문화

**목적**: 각 페이지 유형의 HTML 구조·JavaScript 패턴을 재사용 가능한 템플릿으로 문서화

**세부 작업 (유형별)**

#### 3-1. 챕터 허브 (`index.html`)
- 섹션 카드 구성 (어휘·문법·듣기·읽기·쓰기)
- 진행 표시 방식
- 챕터 제목·주제 표시 패턴

#### 3-2. 문법 메인 (`grammar*.html` + `grammar-main.js/css`)
- c17에서 완성된 데이터-뷰 분리 패턴 확정
- `window.GRAMMAR_PAGE` 설정 객체 스키마 정의
- 학습 패널: 카드 구성 (Meaning / Form / Compare / Examples)
- 연습 패널: 퀴즈 구조 (prompt / hint / choices / feedback)
- 베트남어 토글 `.vi-text` 패턴
- footer-nav 링크 규칙

#### 3-3. 문법 보조 (`grammar*-support-*.html`)
- support-quiz vs support-material 구분 기준
- 퀴즈 유형 목록 (객관식, 빈칸, 순서 배열 등)

#### 3-4. 어휘 메인 (`vocabulary.html`)
- c10 업그레이드 구조를 기준으로 카드·정리·퀴즈 뷰 표준화
- 퀴즈 모드: 뜻·초성·그림 퀴즈를 표준 포함
- 초성 퀴즈는 이미지 파일 수정 없이 오버레이로 처리
- `VOCABULARY_CONFIG` 단일 데이터 스키마 확정

#### 3-5. 어휘 보조 (`vocab-support-*.html`)
- 보조 활동 유형 분류 (그림 퀴즈, 시퀀스, 게이지 등)
- 과당 권장 보조 활동 수

#### 3-6. 듣기 (`listening*.html`)
- 대본 표시 방식 (토글·숨김)
- 문항 구조 (선다형, 빈칸)
- 데이터 분리 (`listening-data.js`) 패턴

#### 3-7. 읽기 (`reading.html`, `reading-cuttoon.html`)
- 본문 제시 + 이해 문항 구조
- 웹툰(컷툰) 형식의 패널 구성 방식

#### 3-8. 쓰기 (`writing-cut.html`)
- 모범 답안 컷 제시 패턴
- 교사용 뷰 분기 여부

#### 3-9. 모의고사 (`mock-exam.html`)
- 포함 여부 및 구성 범위
- c15 두 개(mock-exam, mock-exam-2) 처리 방식

**산출물**: `TEMPLATE_SPEC.md` (유형별 상세 사양)

---

### Phase 4 — 네이밍 컨벤션 및 파일 구조 표준화

**목적**: 파일명·폴더명 규칙을 통일하여 자동화 및 링크 일관성 확보

**세부 작업**

| 번호 | 작업 |
|------|------|
| 4-A | 완숙기 실험/백업 파일 처리 규칙 정의 (예: `-backup`, `-v2` 파일) |
| 4-B | 과 폴더명 규칙 확정 (`c10`, `c11` … 또는 `lesson10` 등) |
| 4-C | 보조 파일 명명 규칙 (`vocab-support-[주제].html`, `grammar[N]-support-[유형][N].html`) |
| 4-D | 데이터 파일 명명 규칙 (`[유형]-data.js`) |
| 4-E | 교사용 파일 규칙 (`-teacher.html` suffix) |

**산출물**: `NAMING_CONVENTIONS.md`

---

### Phase 5 — 접근성·모바일 최적화 체크리스트

**목적**: 완숙기 전반에서 일관되게 적용되지 않은 항목을 체크리스트로 정립

**검토 항목**
- `aria-label`, `aria-pressed`, `role` 속성 사용 패턴
- `user-scalable=no` 사용 기준 (c17은 grammar에 적용, 나머지 과는?)
- 모바일 탭·버튼 최소 터치 영역 (44px)
- 고대비 모드 대응 여부
- 키보드 내비게이션 지원 범위

**산출물**: `ACCESSIBILITY_CHECKLIST.md`

---

### Phase 6 — 표준안 문서 통합 및 검증

**목적**: 모든 산출물을 단일 표준 문서로 통합하고, c17을 기준으로 적합성 검증

**세부 작업**

| 번호 | 작업 |
|------|------|
| 6-A | 모든 산출물을 `STANDARD_SPEC.md`로 통합 |
| 6-B | c17 전 페이지를 표준안 체크리스트로 검증 (적합·부적합·N/A) |
| 6-C | 기존 가이드라인 문서와의 충돌 여부 확인 및 갱신 목록 작성 |
| 6-D | "신규 과 제작 체크리스트" 작성 (제작자가 처음부터 따라갈 수 있는 순서) |

---

## 4. 우선순위 및 착수 순서

```
Phase 1 (인벤토리) → Phase 3 (템플릿) → Phase 2 (디자인 토큰)
                                      → Phase 4 (네이밍)
                                      → Phase 5 (접근성)
                    → Phase 6 (통합·검증)
```

Phase 1이 모든 후속 작업의 기반이므로 최우선 착수.
Phase 3은 가장 분량이 많으므로 페이지 유형별로 분할하여 순차 진행.

---

## 5. 주요 판단 사항 (착수 전 확인 필요)

아래 항목은 표준안 방향에 영향을 미치므로 사전 결정이 필요합니다.

| # | 질문 | 현재 상태 |
|---|------|-----------|
| Q1 | **베트남어 토글**을 모든 과의 표준으로 채택하는가? | c17 문법 페이지에만 적용됨 |
| Q2 | **모의고사 페이지**를 표준 구성에 포함하는가? | c15·c16에만 있음 |
| Q3 | **grammar-main.css/js 패턴**을 신규 과 전체에 적용하는가? | c17에서 처음 도입 |
| Q4 | **실험적 게임 페이지** (farming, RPG 등)를 표준 외 선택 항목으로 분류하는가? | c13·c14에 집중됨 |
| Q5 | **writing-cut 교사용**(`-teacher.html`)을 표준 구성에 포함하는가? | c15~c16에 있고 c17에는 없음 |

---

## 6. 산출물 목록 (최종)

| 파일 | 내용 |
|------|------|
| `INVENTORY.md` | 완숙기 페이지 유형 분류표 |
| `GAP_ANALYSIS.md` | 과 간 구조 불일치 목록 |
| `TEMPLATE_SPEC.md` | 페이지 유형별 HTML·JS 사양 |
| `shared/design-tokens.css` | 통합 CSS 변수 |
| `NAMING_CONVENTIONS.md` | 파일명·폴더명 규칙 |
| `ACCESSIBILITY_CHECKLIST.md` | 접근성·모바일 체크리스트 |
| `STANDARD_SPEC.md` | 최종 통합 표준안 |
| `NEW_LESSON_CHECKLIST.md` | 신규 과 제작 체크리스트 |
