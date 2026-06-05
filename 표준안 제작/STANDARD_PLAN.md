# 한국어 학습용 웹페이지 표준안 수립 계획

> 작성일: 2026-05-31
> 목적: 고려대 한국어 3B 학습 웹페이지의 재현 가능한 제작 표준 확립
> 작업 폴더: `표준안 제작/` (원본 과 폴더 c10~c17은 읽기 전용으로 참조)

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

## 2. 주요 판단 사항 (확정)

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| Q1 | 다국어 토글 | **전면 채택** | 베트남어 기준, 영어·일본어·중국어 확장 가능 구조로 설계 |
| Q2 | 모의고사 페이지 | **표준 구성 불포함** | 선택 부록으로 분류 |
| Q3 | grammar-main.css/js 패턴 | **전면 채택** | 효율적이면 다른 페이지 유형에도 동일 패턴 적용 검토 |
| Q4 | 실험적 게임 페이지 | **표준 제외** | 선택 확장 사례로만 참조 |
| Q5 | 교사용 페이지 | **표준 구성 포함** | `writing-cut-teacher.html` 등 `-teacher` 파일 포함 |

### Q1 다국어 토글 설계 방침
- 현재: `.vi-text` 클래스 + `viToggle` 버튼 (베트남어 전용)
- 표준: 언어 코드 기반으로 확장 (`data-lang="vi"`, `data-lang="en"` 등)
- 활성 언어를 `localStorage`에 저장하여 페이지 이동 후에도 유지
- 버튼은 언어 선택 드롭다운 또는 복수 토글 버튼으로 구성 가능하도록 설계

---

## 3. 분석 대상 현황

### 완숙기 핵심 파일 구조 (c17 기준)

```
c17/
├── index.html                        # 챕터 허브
├── grammar-main.css                  # ★ 문법 페이지 공유 스타일
├── grammar-main.js                   # ★ 문법 페이지 공유 로직
├── grammar1.html ~ grammar4.html     # 문법 메인 (학습+연습 탭)
├── grammar1-support-quiz.html        # 문법 보조 퀴즈
├── grammar2-support-quiz.html
├── grammar3-support-material1.html   # 문법 보조 자료
├── grammar4-support-material1.html
├── vocabulary.html                   # 어휘 메인
├── vocab-support-*.html              # 어휘 보조 활동 (4종)
├── listening1.html / listening2.html # 듣기
├── listening-data.js                 # 듣기 데이터 분리
├── reading.html                      # 읽기
├── reading-cuttoon.html              # 읽기 웹툰
├── writing-cut.html / writing-cut.js # 쓰기
└── (writing-cut-teacher.html)        # ★ 교사용 — 표준에 포함
```

### 완숙기에서 확인된 핵심 아키텍처 패턴

1. **데이터-뷰 분리**: `grammar1.html`은 `window.C17_GRAMMAR_PAGE` 설정 객체만 정의, 렌더링·인터랙션은 `grammar-main.js`가 담당
2. **공유 CSS**: `grammar-main.css`가 문법 4페이지 전체 스타일 통합
3. **공유 topbar**: `../shared/project-topbar-compact.css` 사용
4. **다국어 토글**: `viToggle` 버튼 → 확장형 다국어 토글로 표준화
5. **학습-연습 탭**: `tabLearn` / `tabPractice` 탭 구조
6. **footer-nav**: 각 페이지 하단에 앞뒤 이동 + 보조 링크

---

## 4. 작업 계획 (6단계)

### Phase 1 — 인벤토리 및 갭 분석

**목적**: 완숙기 3개 과(c15~c17)의 모든 페이지를 유형별로 분류하고 과 간 불일치 파악

| 번호 | 작업 | 산출물 |
|------|------|--------|
| 1-A | 페이지 유형 분류표 작성 | `INVENTORY.md` |
| 1-B | c15·c16과 c17의 동일 유형 페이지 구조 비교 | `GAP_ANALYSIS.md` |
| 1-C | 초기·성숙기에만 있는 유형 중 표준 포함 여부 결정 | `GAP_ANALYSIS.md` |
| 1-D | 기존 가이드라인 문서 검토 및 충돌 사전 파악 | `GAP_ANALYSIS.md` |

**페이지 유형 분류 기준**

| 유형 | 파일 패턴 | 표준 포함 |
|------|-----------|-----------|
| 허브 | `index.html` | ✅ |
| 문법 메인 | `grammar[N].html` | ✅ |
| 문법 보조 | `grammar[N]-support-*.html` | ✅ |
| 어휘 메인 | `vocabulary.html` | ✅ |
| 어휘 보조 | `vocab-support-*.html` | ✅ |
| 듣기 | `listening[N].html` | ✅ |
| 읽기 | `reading.html`, `reading-cuttoon.html` | ✅ |
| 쓰기 | `writing-cut.html` | ✅ |
| 교사용 | `*-teacher.html` | ✅ |
| 모의고사 | `mock-exam.html` | ❌ (부록) |
| 실험·게임 | 각종 변형 파일 | ❌ (참조만) |

---

### Phase 2 — 디자인 토큰 및 공유 리소스 표준화

**목적**: CSS 변수, 색상, 타이포그래피, 레이아웃 규칙을 단일 소스로 통합

| 번호 | 작업 | 산출물 |
|------|------|--------|
| 2-A | c17 토큰 추출 (`grammar-main.css` + `index.html` 인라인) | 토큰 목록 |
| 2-B | c15·c16 인라인 CSS와의 불일치 파악 | |
| 2-C | 통합 CSS 변수 정의 (섹션별 색상·다국어 토글 상태 포함) | `shared/design-tokens.css` |
| 2-D | `shared/` 폴더 현황 점검 및 추가 공유 리소스 계획 | |

**주요 검토 항목**
- 섹션별 색상: `--vocab`, `--grammar`, `--listening`, `--reading`, `--writing`
- 배경 그라디언트·블롭 장식 패턴의 통일 기준
- 반응형 브레이크포인트
- 다국어 토글 관련 CSS 변수 및 상태 클래스

---

### Phase 3 — 페이지 유형별 템플릿 명문화

**목적**: 각 유형의 HTML 구조·JS 패턴을 재사용 가능한 템플릿으로 문서화

#### 3-1. 챕터 허브 (`index.html`)
- 섹션 카드 구성 (어휘·문법·듣기·읽기·쓰기), 카드 링크 목록
- 챕터 제목·주제 표시 패턴

#### 3-2. 문법 메인 (`grammar[N].html` + `grammar-main.js/css`)
- 데이터-뷰 분리: `window.GRAMMAR_PAGE` 설정 객체 스키마 확정
- 학습 패널 카드 구성 (Meaning / Form / Compare / Examples)
- 연습 패널 퀴즈 구조 (prompt / hint / choices / feedback)
- **다국어 토글**: `data-lang` 속성 기반 확장형 구조
- footer-nav 링크 규칙

#### 3-3. 문법 보조 (`grammar[N]-support-*.html`)
- support-quiz / support-material 구분 기준
- 퀴즈 유형 목록 (객관식·빈칸·순서 배열 등)

#### 3-4. 어휘 메인 (`vocabulary.html`)
- c10 업그레이드 구조를 기준으로 카드·정리·퀴즈 뷰 표준화
- 퀴즈 모드: 뜻·초성·그림 퀴즈를 표준 포함
- 초성 퀴즈는 이미지 파일 수정 없이 오버레이로 처리
- `VOCABULARY_CONFIG` 단일 데이터 스키마 확정

#### 3-5. 어휘 보조 (`vocab-support-*.html`)
- 보조 활동 유형 분류 (그림 퀴즈·시퀀스·게이지·플로우 등)
- 과당 권장 보조 활동 수 및 유형 다양성 기준

#### 3-6. 듣기 (`listening[N].html` + `listening-data.js`)
- 데이터 분리 패턴 (c17의 `listening-data.js` 방식)
- 대본 표시 방식, 문항 구조 (선다형·빈칸)

#### 3-7. 읽기 (`reading.html`, `reading-cuttoon.html`)
- 본문 + 이해 문항 구조
- 웹툰(컷툰) 형식 패널 구성 방식

#### 3-8. 쓰기 (`writing-cut.html`, `writing-cut-teacher.html`)
- 모범 답안 컷 제시 패턴
- 교사용 뷰 분기 방식 (별도 파일 vs 쿼리스트링 분기)

**산출물**: `TEMPLATE_SPEC.md`

---

### Phase 4 — 네이밍 컨벤션 및 파일 구조 표준화

| 번호 | 작업 |
|------|------|
| 4-A | 실험/백업 파일 처리 규칙 (`-backup`, `-v2` 등) |
| 4-B | 과 폴더명 규칙 확정 (현행 `c10` 형식 유지 여부) |
| 4-C | 보조 파일 명명 규칙 (`vocab-support-[주제].html`) |
| 4-D | 데이터 파일 명명 규칙 (`[유형]-data.js`) |
| 4-E | 교사용 파일 규칙 (`-teacher` suffix 확정) |

**산출물**: `NAMING_CONVENTIONS.md`

---

### Phase 5 — 접근성·모바일 최적화 체크리스트

**검토 항목**
- `aria-label`, `aria-pressed`, `role` 속성 사용 패턴
- `user-scalable=no` 사용 기준
- 모바일 터치 영역 최소 44px
- 키보드 내비게이션 지원 범위

**산출물**: `ACCESSIBILITY_CHECKLIST.md`

---

### Phase 6 — 표준안 문서 통합 및 검증

| 번호 | 작업 |
|------|------|
| 6-A | 모든 산출물을 `STANDARD_SPEC.md`로 통합 |
| 6-B | c17 전 페이지를 표준안으로 검증 (적합·부적합·N/A) |
| 6-C | 기존 가이드라인 문서와 충돌 여부 확인 및 갱신 목록 작성 |
| 6-D | 신규 과 제작 체크리스트 작성 (`NEW_LESSON_CHECKLIST.md`) |

---

## 5. 착수 순서

```
Phase 1 (인벤토리)
    └─→ Phase 3 (템플릿) ─→ Phase 2 (디자인 토큰)
                          ─→ Phase 4 (네이밍)
                          ─→ Phase 5 (접근성)
                              └─→ Phase 6 (통합·검증)
```

---

## 6. 산출물 목록

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
