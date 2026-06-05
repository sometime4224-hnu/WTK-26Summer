# 다국어 기능 구현 상태

작성일: 2026-06-05

## 완료

### 문법 본 페이지

대상: `c10`부터 `c18`까지의 문법 본 페이지 33개

- `c10/grammar1.html` - `c10/grammar4.html`
- `c11/grammar1.html` - `c11/grammar3.html`
- `c12/grammar1.html` - `c12/grammar4.html`
- `c13/grammar1.html` - `c13/grammar4.html`
- `c14/grammar1.html` - `c14/grammar4.html`
- `c15/grammar1.html` - `c15/grammar4.html`
- `c16/grammar1.html` - `c16/grammar4.html`
- `c17/grammar1.html` - `c17/grammar4.html`
- `c18/grammar1.html` - `c18/grammar2.html`

완료 언어:

- 영어 `en`
- 베트남어 `vi`
- 아랍어 `ar`
- 몽골어 `mn`
- 카자흐어 `kk`
- 태국어 `th`

구현 방식:

- `shared/multilang-page-data.js`: 영어와 베트남어 공통 데이터
- `shared/multilang-page-data-ar.js`: 아랍어 데이터
- `shared/multilang-page-data-mn.js`: 몽골어 데이터
- `shared/multilang-page-data-kk.js`: 카자흐어 데이터
- `shared/multilang-page-data-th.js`: 태국어 데이터
- `shared/multilang-page-scaffold.js`: 페이지별 공통 비계 패널 렌더러
- `shared/multilang-toggle.js`: 언어 토글
- `shared/multilang-toggle.css`: 언어별 패널 및 버튼 스타일

검증:

- 33개 문법 본 페이지에서 `번역 끄기`, `English`, `Tiếng Việt`, `العربية`, `Монгол`, `Қазақша`, `ไทย` 버튼 확인
- 각 언어 버튼 클릭 시 해당 언어 블록만 표시됨
- `번역 끄기` 클릭 시 번역 블록 숨김
- 아랍어 RTL 및 한국어 문법 표지 LTR 보호 확인
- 대표 페이지 데스크톱/모바일 폭 가로 넘침 없음
- 기존 베트남어 전용 버튼은 공통 베트남어 패널 제공 페이지에서 화면 숨김 처리

검증 명령:

```powershell
node --check shared/multilang-toggle.js
node --check shared/multilang-page-data.js
node --check shared/multilang-page-data-ar.js
node --check shared/multilang-page-data-mn.js
node --check shared/multilang-page-data-kk.js
node --check shared/multilang-page-data-th.js
node --check shared/multilang-page-scaffold.js
```

브라우저 검증:

- 전체 문법 본 페이지 33개 순회
- 대표 페이지: `c10/grammar1.html`, `c14/grammar4.html`, `c17/grammar1.html`, `c18/grammar2.html`
- 데스크톱 폭: `1280x900`
- 모바일 폭: `390x844`

## 다음 단계

### 읽기 페이지

대상 11개:

- `c10/reading.html`
- `c11/reading.html`
- `c12/reading.html`
- `c13/reading.html`
- `c14/reading.html`
- `c15/reading-cuttoon.html`
- `c16/reading.html`
- `c16/reading-cuttoon.html`
- `c17/reading.html`
- `c17/reading-cuttoon.html`
- `c18/reading.html`

완료 언어:

- 영어 `en`
- 베트남어 `vi`
- 아랍어 `ar`
- 몽골어 `mn`
- 카자흐어 `kk`
- 태국어 `th`

적용 원칙:

- 본문 전체 번역은 제공하지 않는다.
- 활동 지시, 읽기 목표, 어려운 표현, 질문 이해 보조 중심으로 제공한다.
- 문법 본 페이지와 같은 언어 순서 `en -> vi -> ar -> mn -> kk -> th`를 유지한다.

구현 방식:

- `shared/multilang-reading-data.js`: 읽기 페이지별 6개 언어 비계 데이터
- `shared/multilang-page-scaffold.js`: 공통 비계 패널 재사용
- `shared/multilang-toggle.js`: 언어 토글 재사용

검증:

- 11개 읽기 페이지에서 `번역 끄기`, `English`, `Tiếng Việt`, `العربية`, `Монгол`, `Қазақша`, `ไทย` 버튼 확인
- 각 언어 버튼 클릭 시 해당 언어 블록만 표시됨
- `번역 끄기` 클릭 시 번역 블록 숨김
- 아랍어 RTL 확인
- 대표 페이지 데스크톱/모바일 폭 가로 넘침 없음
- `c17/reading.html`의 기존 베트남어 전용 버튼은 공통 패널 제공 시 화면 숨김 처리

검증 명령:

```powershell
node --check shared/multilang-reading-data.js
```

### 제외 유지

- 듣기 페이지: 다국어 데이터 생성 대상 아님
- 어휘 페이지: 별도 작업
- 쓰기/말하기/게임/보조자료: 별도 작업
