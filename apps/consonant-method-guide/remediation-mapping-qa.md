# 보강 에셋 앱 매핑 QA

검수일: 2026-06-11

## 적용 범위

- `generated-remediation-manifest.json`의 후보 에셋 54개를 정식 `manifest.json`과 `manifest.js`에 병합했다.
- 기본 자음 지도 앱의 핵심 오류 영역을 새 에셋으로 교체했다.
- 상단 움직임 보드를 4열 압축형에서 2x2 확대형으로 조정했다.

## 교체된 주요 매핑

| 화면 | 적용 에셋 |
| --- | --- |
| 초성 ㄱ | `sequence-velar-soft-stop-*`, `tongue-back-approach-clean`, `glottis-neutral-lenis` |
| 초성 ㅋ | `sequence-velar-aspirated-stop-*`, `place-velar-contact-clean` |
| 초성 ㅇ | `zero-onset-open-vocal-tract`, `zero-onset-vowel-start` |
| 된소리 ㄲ | `sequence-velar-tense-stop-*`, `place-velar-contact-clean` |
| 된소리 ㅃ | `mouth-bilabial-tense-closure` |
| 된소리 ㅆ | `sequence-front-tense-fricative-*` |
| 된소리 ㅉ | `sequence-palatal-tense-affricate-*` |
| 받침 ㄱ | `sequence-velar-coda-stop-*`, `closure-held-final` |
| 받침 ㄷ | `sequence-front-coda-stop-*`, `closure-held-final` |
| 받침 ㅂ | `sequence-bilabial-coda-stop-*`, `closure-held-final` |
| 받침 ㅇ | `sequence-velar-nasal-coda-*` |

## 자동 점검

- 앱에서 참조하는 이미지 ID가 모두 정식 매니페스트에 존재함.
- 정식 매니페스트의 모든 이미지 파일이 실제 경로에 존재함.
- 브라우저 검수에서 대상 화면의 깨진 이미지 없음.
- 확대 모달은 이미지 클릭 시 중앙에 열리고, 닫기 버튼으로 정상 종료됨.

## 브라우저 확인

확인 주소: `http://127.0.0.1:4173/apps/consonant-method-guide/index.html`

확인 대상:

- 초성: ㄱ, ㅋ, ㅇ
- 된소리: ㄲ, ㅃ, ㅆ, ㅉ
- 받침: ㄱ, ㄷ, ㅂ, ㅇ

결과:

- ㄱ/ㅋ/ㄲ은 뒤혀-연구개 계열 에셋으로 교체되어 치조 접촉 오해가 줄었다.
- 받침 ㄱ/ㄷ/ㅂ은 마지막 단계에서 외부 방출 카드 대신 닫힘 유지 계열 에셋을 사용한다.
- 받침 ㅇ은 뒤혀-연구개 접촉과 코울림 흐름을 함께 보여 준다.
- ㅆ/ㅉ은 된소리 전용 시퀀스로 바뀌어 거센소리식 큰 기식과 구분된다.
- 초성 ㅇ은 폐쇄 없는 열린 성도/모음 시작 이미지로 바뀌었다.

## 테스트

명령:

```powershell
npx playwright test tests/e2e/consonant-method-guide.spec.js
```

결과: 7개 테스트 모두 통과.

## 남은 확장 과제

- ㅃ, ㄸ의 4단계 전용 시퀀스는 아직 별도 생성 대상이다.
- `airflow-no-release-stop`은 현재 대표 매핑에서 제외하고 보조 카드 후보로만 유지한다.
