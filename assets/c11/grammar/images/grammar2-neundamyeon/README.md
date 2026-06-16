# 11과 문법2 이미지 에셋: -(으)면 vs -다면

## 위치

- AI 원본 삽화: `assets/c11/grammar/images/grammar2-neundamyeon/source-ai/`
- 무문자 WebP 삽화: `assets/c11/grammar/images/grammar2-neundamyeon/illustrations/`
- 한글 문구 포함 WebP 카드: `assets/c11/grammar/images/grammar2-neundamyeon/cards/`
- 구조화 목록: `assets/c11/grammar/images/grammar2-neundamyeon/manifest.json`
- 생성 스크립트: `scripts/generate_c11_grammar2_neundamyeon_assets.py`

## 제작 방식

- AI 이미지 생성으로 글자 없는 삽화를 먼저 만들었습니다.
- `illustrations/`는 글자 없는 삽화만 WebP로 경량화한 학생용 기본 자산입니다.
- `cards/`는 로컬 Pillow 렌더링으로 한국어 제목, 문법 라벨, 예문, 하단 설명을 합성한 보조 자산입니다.
- `c11/grammar2-visual-examples.html#visualExamples`는 무문자 삽화를 보여 주고, 예문과 해설은 HTML UI에서 공개합니다.

## 경량화 기준

- AI 원본: PNG, 총 15장, 합계 약 34.14MB
- 출력: WebP, 1408 x 768, quality 92
- 무문자 삽화 WebP 합계 약 4.45MB
- 한글 카드 WebP 합계 약 3.92MB

## 이미지 성격

| 파일 | 성격 | 문법 초점 | 내용 |
| --- | --- | --- | --- |
| `01-long-term-health-exercise.webp` | 장기 목표 | `-는다면` | 운동/건강 조건과 오래 살고 싶은 장기 목표 |
| `02-long-term-money-travel.webp` | 장기 목표 | `-는다면` | 저금 조건과 돈을 많이 모아 세계 여행을 가는 목표 |
| `03-long-term-korean-study-goal.webp` | 장기 목표 | `-는다면` | 한국어 공부/시험 조건과 통역사가 되고 싶은 목표 |
| `04-imagined-homework-game.webp` | 상상 가정 | `-는다면` | 숙제 후 게임 조건과 왕이 된다면 매일 놀고 싶은 상상 |
| `05-imagined-eat-tall.webp` | 상상 가정 | `-는다면` | 밥을 많이 먹으면 키가 크는 조건과 거인이 되는 상상 |
| `06-imagined-sale-shopping.webp` | 상상 가정 | `-는다면` | 세일/쇼핑 조건과 램프의 요정을 만나는 상상 |
| `07-imagined-snow-invisible.webp` | 상상 가정 | `-는다면` | 눈/눈사람 조건과 투명 인간이 되는 상상 |
| `08-imagined-tired-time-rewind.webp` | 상상 가정 | `-는다면` | 피곤하면 쉬는 조건과 시간을 돌리는 상상 |
| `09-if-rain-lottery.webp` | 기본 비교 | `-는다면` | 비/우산 조건과 복권 당첨 가정 |
| `10-if-traffic-bird.webp` | 기본 비교 | `-는다면` | 교통 체증/지하철 조건과 새라면 날고 싶은 가정 |
| `11-noun-if-rich-superman-cat.webp` | 형태 정리 | `N-(이)라면` | 부자, 슈퍼맨, 고양이 명사 가정 예문 |
| `12-verb-if-study-party-korea-taxi.webp` | 형태 정리 | `V-ㄴ다면`, `V-는다면` | 동사 어간별 가정 예문 |
| `13-adjective-if-tired-hungry-money.webp` | 형태 정리 | `A-다면` | 피곤하다, 배고프다, 돈이 많다 형용사 가정 예문 |
| `14-mixed-if-cold-travel-king.webp` | 형태 정리 | `A-다면`, `V-는다면`, `N-이라면` | 품사별 가정 형태 혼합 예문 |
| `15-summary-weather-lottery-king.webp` | 형태 요약 | `A-다면`, `V-는다면`, `N-이라면` | 날씨, 복권, 왕 예문으로 보는 품사별 요약 |
