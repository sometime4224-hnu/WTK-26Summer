# 조음 이미지 보강 에셋 검수 보고서

검수일: 2026-06-11

목표: `articulation-image-audit.md`의 수정 대상 중 우선 1-5번 범위에 해당하는 새 이미지 후보를 이미지 생성으로 제작하고, 앱 매핑 교체 전에 목적 적합성을 확인한다.

## 산출물

- 프롬프트 원본: `apps/consonant-method-guide/remediation-asset-prompts.md`
- 생성 원본: `apps/articulation-cue-lab/assets/articulation/source/generated-remediation/`
- 앱 적용 후보: `apps/articulation-cue-lab/assets/articulation/split/generated-remediation/`
- 후보 매니페스트: `apps/articulation-cue-lab/assets/articulation/generated-remediation-manifest.json`
- 검수 컨택트시트: `apps/articulation-cue-lab/assets/articulation/preview/generated-remediation/generated-remediation-contact-sheet.png`

생성 원본은 18장이다. 4단계 시퀀스 9장은 원본 카드와 4개 프레임으로 분할했고, 단일 카드 9장은 627x627 카드로 정규화했다. 최종 후보 매니페스트에는 54개 에셋이 등록되어 있다.

## 검수 기준

- 연구개음 계열: 혀끝/치조가 아니라 혀 뒤쪽과 연구개 접촉 또는 접근이 보여야 한다.
- 받침 불파 계열: 닫힘 이후 입 밖으로 터지는 방출이 없어야 한다.
- 받침 ㅇ: 혀 뒤쪽-연구개 접촉으로 입길은 막히고, 비강 흐름이 코로 나가야 한다.
- 된소리 계열: 조음 긴장과 짧고 약한 방출이 핵심이며, 거센소리처럼 큰 기식 화살표가 나오면 안 된다.
- 초성 ㅇ: 특정 폐쇄 지점 없이 열린 성도로 모음이 시작되어야 한다.
- 예사소리 보조: 강한 성문 긴장이나 큰 기식이 아니라 중립 성문과 약한 기류여야 한다.

## 에셋별 판정

| 에셋 | 판정 | 용도와 조정 메모 |
| --- | --- | --- |
| `sequence-velar-soft-stop` | 통과 | ㄱ 초성 파열음의 준비-접근-폐쇄-약한 방출 시퀀스로 사용. 접근/폐쇄가 뒤혀-연구개 위치에 있어 기존 오류 교체에 적합. |
| `sequence-velar-aspirated-stop` | 통과 | ㅋ 초성 파열음용. 마지막 프레임의 강한 기식 방출이 ㄱ/ㄲ와 대비된다. |
| `sequence-velar-tense-stop` | 통과 | ㄲ 초성 파열음용. 폐쇄와 성문/혀 긴장을 보여 주고 방출이 짧아 ㅋ과 구분된다. |
| `tongue-back-approach-clean` | 통과 | ㄱ/ㅋ/ㄲ 접근 단계 또는 뒤혀 채널 단일 카드에 적합. 앞혀/치조 접촉 오해를 줄인다. |
| `place-velar-contact-clean` | 통과 | 연구개 접촉 위치 설명 카드로 적합. |
| `sequence-velar-nasal-coda` | 통과 | 받침 ㅇ용. 뒤혀-연구개 접촉과 비강 흐름이 보인다. 스타일이 약간 더 해부학 도감형이므로 같은 받침 ㅇ 묶음 안에서 우선 사용한다. |
| `sequence-velar-coda-stop` | 통과 | 받침 ㄱ용. 마지막 프레임에 입 밖 방출이 없어 불파 설명에 적합. |
| `sequence-front-coda-stop` | 통과 | 받침 ㄷ용. 치조 닫힘 후 유지가 명확하다. |
| `sequence-bilabial-coda-stop` | 조건부 통과 | 받침 ㅂ용. 입 밖 방출은 없지만 일부 내부 파란 단서는 압력/기류로만 설명해야 한다. 방출 카드로 쓰면 안 된다. |
| `airflow-no-release-stop` | 제한 사용 | 불파 보조 카드로 쓸 수 있으나 범용 불파라기보다 특정 닫힘 장면처럼 보인다. 받침 전체 대표 카드보다는 보조 카드로 제한한다. |
| `closure-held-final` | 통과 | 받침의 닫힘 유지 범용 카드로 적합. |
| `sequence-front-tense-fricative` | 통과 | ㅆ용. 좁고 팽팽한 마찰 흐름이 보이고 큰 기식이 아니다. |
| `sequence-palatal-tense-affricate` | 통과 | ㅉ용. 경구개 쪽 넓은 접촉과 짧은 파찰 흐름이 보인다. |
| `mouth-bilabial-tense-closure` | 통과 | ㅃ의 입술 긴장 닫힘 단일 카드로 적합. 전체 4단계 시퀀스가 필요하면 별도 생성이 필요하다. |
| `zero-onset-vowel-start` | 통과 | 초성 ㅇ의 모음 시작 단서로 적합. 폐쇄 위치가 강조되지 않는다. |
| `zero-onset-open-vocal-tract` | 통과 | 초성 ㅇ의 열린 성도 카드로 적합. |
| `glottis-neutral-lenis` | 통과 | 예사소리 성문 보조 카드로 적합. 강한 긴장이나 큰 기식이 아니다. |
| `glottis-soft-breath` | 통과 | 예사소리 약한 기류 보조 카드로 적합. |

## 앱 매핑 교체 제안

- ㄱ 초성: `sequence-velar-soft-stop`과 각 프레임을 기본 시퀀스로 교체한다. 특히 접근 단계는 `tongue-back-approach-clean`을 함께 쓴다.
- ㅋ 초성: `sequence-velar-aspirated-stop`을 사용하고 마지막 방출 프레임을 거센소리 대비 카드로 노출한다.
- ㄲ 초성: `sequence-velar-tense-stop`을 사용하고 성문/혀 긴장 프레임을 핵심 큐로 둔다.
- 받침 ㄱ: `sequence-velar-coda-stop`, `closure-held-final`을 사용한다. 기존에 입 밖 방출이 보이는 카드는 제거한다.
- 받침 ㄷ: `sequence-front-coda-stop`을 사용한다.
- 받침 ㅂ: `sequence-bilabial-coda-stop`을 사용하되, 내부 파란 단서는 압력 단서로만 설명한다.
- 받침 ㅇ: `sequence-velar-nasal-coda`를 사용한다. 입 밖 파열이 아니라 코로 흐르는 울림을 강조한다.
- ㅆ: `sequence-front-tense-fricative`를 사용한다.
- ㅉ: `sequence-palatal-tense-affricate`를 사용한다.
- ㅃ: 현재는 `mouth-bilabial-tense-closure`만 충분하다. 앱에서 4단계 순서를 보여 주려면 ㅃ 전용 시퀀스 추가 생성이 필요하다.
- 초성 ㅇ: `zero-onset-vowel-start`, `zero-onset-open-vocal-tract`를 사용한다.
- 예사/거센/된소리 대비 보조: `glottis-neutral-lenis`, `glottis-soft-breath`를 예사 보조로 두고, ㅋ/ㅊ/ㅌ/ㅍ 쪽의 강한 기식 카드와 대비한다.

## 남은 주의점

- 후보 매니페스트는 아직 정식 `manifest.json`에 병합하지 않았다. 다음 작업은 앱 데이터의 자음별 이미지 매핑을 후보 에셋으로 교체한 뒤 브라우저에서 전수 확인하는 것이다.
- `airflow-no-release-stop`은 보조 카드로만 쓴다. 대표 이미지가 필요하면 조음 위치가 없는 추상형 불파 카드를 새로 생성하는 편이 낫다.
- ㅃ, ㄸ 등 된파열음 전체 시퀀스는 아직 충분하지 않다. 이번 범위에서는 기존 오류가 큰 항목을 우선 보강했고, 확장 단계에서 된파열음 전체 시퀀스를 추가 생성하는 것이 좋다.
