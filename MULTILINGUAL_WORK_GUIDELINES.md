# 전 과 다국어 기능 작업 지침

작성일: 2026-06-05

## 목표

`c10`부터 `c18`까지의 문법 본 페이지에 한국어 학습을 보조하는 다국어 비계 기능을 구현한다. 다국어 기능은 전체 번역이 아니라 활동 지시, 문법 의미, 형태 결합, 사용 맥락을 짧게 보조하는 기능이다.

## 지원 언어

- 기본 언어: 한국어 `ko`
- 추가 언어: 영어 `en`, 베트남어 `vi`, 몽골어 `mn`, 아랍어 `ar`, 카자흐어 `kk`, 태국어 `th`

작업은 반드시 한 언어씩 진행한다. 한 언어의 데이터 입력, 화면 적용, 검증이 끝난 뒤 다음 언어로 넘어간다.

## 1차 구현 범위

문법 본 페이지를 우선 구현한다.

- `c10/grammar1.html` - `c10/grammar4.html`
- `c11/grammar1.html` - `c11/grammar3.html`
- `c12/grammar1.html` - `c12/grammar4.html`
- `c13/grammar1.html` - `c13/grammar4.html`
- `c14/grammar1.html` - `c14/grammar4.html`
- `c15/grammar1.html` - `c15/grammar4.html`
- `c16/grammar1.html` - `c16/grammar4.html`
- `c17/grammar1.html` - `c17/grammar4.html`
- `c18/grammar1.html` - `c18/grammar2.html`

## 제외 범위

이번 구현에서는 다음 페이지에 새 다국어 데이터를 만들지 않는다.

- 듣기: `listening*.html`, `listening-data.js`, `shared/listening-*.js`
- 어휘: `vocabulary.html`, `vocab-support-*.html`
- 쓰기: `writing*.html`, `writing*.js`
- 말하기/게임/보조자료: `grammar*-speaking*.html`, `grammar*-game*.html`, `grammar*-support*.html`, `grammar*-quiz*.html`
- 읽기: 문법 본 페이지 완료 후 별도 검토한다.

## 공통 구현 원칙

1. 공통 UI는 `shared/multilang-toggle.js`와 `shared/multilang-toggle.css`를 사용한다.
2. 전 과 문법 본 페이지에는 `shared/multilang-page-data.js`와 `shared/multilang-page-scaffold.js`를 사용해 공통 비계 패널을 삽입한다.
3. 페이지별 번역 데이터는 `cNN/grammarN.html` 경로 키로 관리한다.
4. 언어 순서는 `en -> vi -> ar -> mn -> kk -> th`이다.
5. 문법 표지, 조사, 어미, 학생이 답해야 하는 한국어 표현은 번역하지 않는다.
6. 아랍어 작업에서는 한국어 문법 표지를 `class="ko-term" lang="ko" dir="ltr"` 규칙으로 보호한다.
7. 듣기 페이지는 번역 버튼을 생략한 상태로 유지한다.
8. 한 언어 작업 중 다른 언어 데이터를 함께 추가하지 않는다.

## 언어별 완료 기준

한 언어는 아래 조건을 모두 만족해야 완료로 본다.

- 1차 구현 범위의 모든 문법 본 페이지에 해당 언어 비계 데이터가 있다.
- 언어 버튼을 눌렀을 때 해당 언어 패널만 보인다.
- 번역 끄기를 누르면 한국어 기본 화면만 남는다.
- 한국어 문법 표지가 번역되거나 방향이 뒤집히지 않는다.
- 데스크톱과 모바일 폭에서 패널, 버튼, 카드가 겹치지 않는다.
- 관련 스크립트가 `node --check`를 통과한다.
- 브라우저에서 대표 단원과 현재 작업 단원을 직접 확인한다.

## 구현 순서

### 0단계: 공통 구조

1. 전 과 문법 본 페이지 목록을 확인한다.
2. 공통 다국어 패널 렌더러를 만든다.
3. 문법 본 페이지에 공통 스크립트를 연결한다.
4. 기존 베트남어 데이터는 삭제하지 않는다.

### 1단계: 영어 `en`

1. 전 과 문법 본 페이지의 영어 비계 데이터를 입력한다.
2. 영어 버튼과 번역 끄기 버튼을 검증한다.
3. 기존 베트남어 토글과 충돌하지 않는지 확인한다.
4. 영어 완료 기록을 남긴다.

### 2단계: 베트남어 `vi`

1. 기존 베트남어 데이터가 있는 페이지는 내용을 재사용하되 공통 구조에 맞춘다.
2. 기존 페이지별 베트남어 토글은 공통 토글과 충돌하지 않게 정리한다.
3. 베트남어 완료 기록을 남긴다.

### 3단계: 아랍어 `ar`

1. 아랍어 번역을 추가한다.
2. RTL과 한국어 문법 표지 방향을 검증한다.
3. 아랍어 완료 기록을 남긴다.

### 4단계: 몽골어 `mn`

몽골어 번역을 추가하고 화면 넘침을 검증한다.

### 5단계: 카자흐어 `kk`

카자흐어 번역을 추가하고 키릴 문자와 한국어 문법 표지 결합을 검증한다.

### 6단계: 태국어 `th`

태국어 번역을 추가하고 모바일 줄바꿈을 검증한다.

## 검증 명령

```powershell
node --check shared/multilang-toggle.js
node --check shared/multilang-page-data.js
node --check shared/multilang-page-scaffold.js
```

## 작업 기록

각 언어 완료 후 다음을 기록한다.

- 완료 언어
- 적용 페이지 수
- 수정 파일
- 브라우저 확인 URL
- 남은 문제
- 다음 언어
