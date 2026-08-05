/* Shared sequential workbook review controller for Chapter 16 grammar. */
(function () {
    "use strict";

    const SAVE_DEBOUNCE_MS = 300;

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function normalizeText(value) {
        return String(value == null ? "" : value)
            .normalize("NFC")
            .trim()
            .replace(/[.。!?！？…]+$/u, "")
            .trim()
            .replace(/\s+/gu, " ");
    }

    // Korean learners commonly vary word spacing while typing. Keep content
    // checking strict, but do not turn harmless spacing or final punctuation
    // into an error. A comma after an initial 네 is equally non-substantive.
    function answerKey(value) {
        return normalizeText(value)
            .replace(/\s+/gu, "")
            .replace(/^네,?/, "네");
    }

    function coreKey(value) {
        return normalizeText(value).replace(/[\p{P}\p{S}\s]+/gu, "");
    }

    function coreSequence(options) {
        const optionKeys = options.map(function (parts) {
            return parts.map(coreKey).filter(Boolean);
        });
        return function (value) {
            const key = coreKey(value);
            return optionKeys.some(function (parts) {
                let cursor = 0;
                return parts.every(function (part) {
                    const index = key.indexOf(part, cursor);
                    if (index < 0) return false;
                    cursor = index + part.length;
                    return true;
                });
            });
        };
    }

    function coreAnswer(parts) {
        return coreSequence([parts]);
    }

    function item(id, prompt, cue, answer, hints, accepts, section) {
        return Object.freeze({
            id: id,
            prompt: prompt,
            cue: cue,
            answer: answer,
            hints: Object.freeze(hints.slice(0, 2)),
            accepts: accepts,
            section: section || "문형 연습"
        });
    }

    const CONFIGS = Object.freeze({
        grammar1: Object.freeze({
            pageId: "grammar1-workbook-review",
            grammar: "문법 1",
            target: "N만 하다",
            items: Object.freeze([
                item(
                    "g1-1",
                    "그 꽃이 그렇게 커요?",
                    "(우산)",
                    "네, 우산만 해요.",
                    ["비교 기준 ‘우산’ 뒤에 ‘만 해요’를 붙여 보세요.", "대답은 ‘네’로 시작할 수 있어요."],
                    coreAnswer(["우산", "만 해"])
                ),
                item(
                    "g1-2",
                    "그 강아지가 그렇게 작아요?",
                    "(작은 쥐)",
                    "네, 작은 쥐만 해요.",
                    ["비교 기준 ‘작은 쥐’ 뒤에 ‘만 해요’를 붙여 보세요.", "대답은 ‘네’로 시작할 수 있어요."],
                    coreAnswer(["작은 쥐", "만 해"])
                ),
                item(
                    "g1-3",
                    "곰 인형이 그렇게 커요?",
                    "(사람)",
                    "네, 사람만 해요.",
                    ["비교 기준 ‘사람’ 뒤에 ‘만 해요’를 붙여 보세요.", "대답은 ‘네’로 시작할 수 있어요."],
                    coreAnswer(["사람", "만 해"])
                ),
                item(
                    "g1-4",
                    "스마트폰이 그렇게 작아요?",
                    "(명함)",
                    "네, 명함만 해요.",
                    ["비교 기준 ‘명함’ 뒤에 ‘만 해요’를 붙여 보세요.", "대답은 ‘네’로 시작할 수 있어요."],
                    coreAnswer(["명함", "만 해"])
                ),
                item(
                    "g1-5",
                    "수박이 그렇게 커요?",
                    "(농구공)",
                    "네, 농구공만 해요.",
                    ["비교 기준 ‘농구공’ 뒤에 ‘만 해요’를 붙여 보세요.", "대답은 ‘네’로 시작할 수 있어요."],
                    coreAnswer(["농구공", "만 해"])
                ),
                item(
                    "g1-6",
                    "친구 집의 방이 얼마나 넓었어요?",
                    "(축구장)",
                    "친구의 집은 아주 크고 방이 얼마나 넓은지 축구장만 했어요.",
                    ["‘축구장’ 뒤에 ‘만 했어요’를 붙여 보세요.", "과거 상황이므로 ‘만 했어요’를 써요."],
                    coreAnswer(["축구장", "만 했"])
                ),
                item(
                    "g1-7",
                    "잃어버린 지갑이 어떻게 생겼어요?",
                    "(직사각형 / 수첩)",
                    "직사각형 모양인데 크기는 수첩만 해요.",
                    ["크기를 비교할 기준은 ‘수첩’이에요.", "‘수첩만 해요’로 문장을 마무리해 보세요."],
                    coreAnswer(["수첩", "만 해"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-8",
                    "여기에 굉장히 큰 공원을 만든다고 들었어요.",
                    "(여의도 / 공원)",
                    "네, 여의도만 한 공원을 만들 거래요.",
                    ["뒤에 ‘공원’이 오므로 ‘만 한’을 써요.", "‘여의도만 한 공원’ 순서로 이어 보세요."],
                    coreAnswer(["여의도", "만 한", "공원"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-9",
                    "동물원에서 본 호랑이가 얼마나 컸어요?",
                    "(책상)",
                    "크기가 책상만 했어요.",
                    ["비교 기준은 ‘책상’이에요.", "지난 경험이므로 ‘책상만 했어요’를 써요."],
                    coreAnswer(["책상", "만 했"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-10",
                    "산에서 잡힌 멧돼지가 얼마나 컸대요?",
                    "(호랑이)",
                    "크기가 호랑이만 하던데요.",
                    ["멧돼지의 크기를 ‘호랑이’와 비교해요.", "‘호랑이만 하던데요’로 말해 보세요."],
                    coreAnswer(["호랑이", "만 하"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-11",
                    "왜 갑자기 소리를 질러요?",
                    "(손가락 / 바퀴벌레)",
                    "여기 손가락만 한 바퀴벌레가 있어요.",
                    ["뒤에 ‘바퀴벌레’가 오므로 ‘만 한’을 써요.", "‘손가락만 한 바퀴벌레’라고 말해 보세요."],
                    coreAnswer(["손가락", "만 한", "바퀴벌레"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-12",
                    "이 아주 작은 프라이팬은 어디에 쓰는 거예요?",
                    "(손바닥)",
                    "이 손바닥만 한 프라이팬은 달걀을 부칠 때 써요.",
                    ["프라이팬 앞에서 크기를 꾸며 주세요.", "‘손바닥만 한 프라이팬’을 넣어 보세요."],
                    coreAnswer(["손바닥", "만 한", "프라이팬"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-13",
                    "이번에 새로 나온 노트북은 얼마나 얇아요?",
                    "(얇은 공책)",
                    "진짜 얇은 공책만 해요.",
                    ["노트북의 크기를 ‘얇은 공책’과 비교해요.", "‘얇은 공책만 해요’를 써 보세요."],
                    coreAnswer(["얇은 공책", "만 해"]),
                    "워크북 연습 1 · 모양과 크기"
                ),
                item(
                    "g1-14",
                    "새 교과서에 이름을 얼마나 작게 썼어요?",
                    "(모기 / 작게)",
                    "이름을 모기만 하게 썼어요.",
                    ["아주 작다는 과장 표현은 ‘모기만 하다’예요.", "동작 ‘쓰다’를 꾸미므로 ‘모기만 하게’를 써요."],
                    coreAnswer(["모기", "만 하게"]),
                    "워크북 연습 2 · 과장 표현"
                ),
                item(
                    "g1-15",
                    "한 달 월급을 모아 집을 살 수 있을까요?",
                    "(쥐꼬리 / 월급)",
                    "쥐꼬리만 한 월급을 모아 언제 집을 살 수 있을지 걱정이에요.",
                    ["아주 적다는 과장 표현은 ‘쥐꼬리만 하다’예요.", "월급 앞에 ‘쥐꼬리만 한’을 붙여 보세요."],
                    coreAnswer(["쥐꼬리", "만 한", "월급"]),
                    "워크북 연습 2 · 과장 표현"
                ),
                item(
                    "g1-16",
                    "시험 시간에 친구가 얼마나 작은 목소리로 말했어요?",
                    "(모기 / 목소리)",
                    "친구가 모기만 한 목소리로 말했어요.",
                    ["아주 작다는 과장 표현 ‘모기만 하다’를 써요.", "목소리 앞에 ‘모기만 한’을 붙여 보세요."],
                    coreAnswer(["모기", "만 한", "목소리"]),
                    "워크북 연습 2 · 과장 표현"
                ),
                item(
                    "g1-17",
                    "영화에 나온 고래가 얼마나 커 보였어요?",
                    "(대문짝 / 고래)",
                    "대문짝만 한 고래가 바다에서 뛰어올랐어요.",
                    ["아주 크다는 과장 표현은 ‘대문짝만 하다’예요.", "고래 앞에 ‘대문짝만 한’을 붙여 보세요."],
                    coreAnswer(["대문짝", "만 한", "고래"]),
                    "워크북 연습 2 · 과장 표현"
                ),
                item(
                    "g1-18",
                    "고향에서 본 아주 큰 음식을 친구에게 소개해 보세요.",
                    "(팬케이크 / 큰 쟁반)",
                    "팬케이크 하나가 큰 쟁반만 해요.",
                    ["음식의 크기를 익숙한 물건과 비교해요.", "‘큰 쟁반만 해요’로 말해 보세요."],
                    coreAnswer(["큰 쟁반", "만 해"]),
                    "워크북 연습 3 · 나의 예"
                )
            ])
        }),
        grammar2: Object.freeze({
            pageId: "grammar2-workbook-review",
            grammar: "문법 2",
            target: "V-(으)ㄹ 생각도 못 하다",
            items: Object.freeze([
                item(
                    "g2-1",
                    "새 컴퓨터를 살 생각이에요?",
                    "(비싸다 / 새 컴퓨터를 사다)",
                    "너무 비싸서 새 컴퓨터를 살 생각도 못 해요.",
                    ["이유를 먼저 말하고 ‘-아서/어서’를 붙여 보세요.", "‘새 컴퓨터를 살 생각도 못 해요’로 마무리해요."],
                    coreAnswer(["비싸", "살 생각도 못"])
                ),
                item(
                    "g2-2",
                    "집에서 김치를 담가 먹어요?",
                    "(시간이 없다 / 김치를 담그다)",
                    "시간이 없어서 김치를 담글 생각도 못 해요.",
                    ["‘시간이 없어서’로 이유를 먼저 말해 보세요.", "김치를 ‘담글 생각도 못 해요’가 목표 표현이에요."],
                    coreAnswer(["시간이 없", "담글 생각도 못"])
                ),
                item(
                    "g2-3",
                    "서울에서도 운전을 해요?",
                    "(길이 복잡하다 / 운전하다)",
                    "길이 복잡해서 서울에서 운전할 생각도 못 해요.",
                    ["길이 복잡한 이유를 먼저 말해 보세요.", "‘서울에서 운전할 생각도 못 해요’로 이어 보세요."],
                    coreAnswer(["길이 복잡", "운전할 생각도 못"])
                ),
                item(
                    "g2-4",
                    "이번 연휴에 여행 갈 거예요?",
                    "(일이 많다 / 여행 가다)",
                    "일이 많아서 이번 연휴에 여행 갈 생각도 못 해요.",
                    ["‘일이 많아서’로 이유를 먼저 말해 보세요.", "이번 연휴의 ‘여행 갈 생각도 못 해요’를 넣어 보세요."],
                    coreAnswer(["일이 많", "여행 갈 생각도 못"])
                ),
                item(
                    "g2-5",
                    "휴가가 두 달이나 남았는데 왜 미리 비행기 표를 사요?",
                    "(비행기 표를 사다 / 휴가를 가다)",
                    "미리 비행기 표를 사지 않으면 휴가를 갈 생각도 못 해요.",
                    ["비행기 표를 미리 사야 하는 조건을 ‘-지 않으면’으로 먼저 말해 보세요.", "‘표를 사지 않으면’ 뒤에 ‘휴가를 갈 생각도 못 해요’를 붙여 보세요."],
                    coreSequence([
                        ["미리 비행기 표를 사지 않으면", "휴가를 갈 생각도 못"],
                        ["비행기 표를 미리 사지 않으면", "휴가를 갈 생각도 못"],
                        ["표를 미리 사지 않으면", "휴가를 갈 생각도 못"],
                        ["표를 사지 않으면", "휴가를 갈 생각도 못"],
                        ["미리 사지 않으면", "휴가를 갈 생각도 못"]
                    ])
                ),
                item(
                    "g2-6",
                    "민수 씨에게 그 일을 도와 달라고 했어요?",
                    "(민수 씨가 도와주다 / 일을 끝내다)",
                    "민수 씨가 도와주지 않으면 그 일을 끝낼 생각도 못 해요.",
                    ["민수 씨의 도움이 필요한 조건을 ‘-지 않으면’으로 먼저 말해 보세요.", "‘민수 씨가 도와주지 않으면’ 뒤에 ‘그 일을 끝낼 생각도 못 해요’를 붙여 보세요."],
                    coreSequence([
                        ["민수 씨가 도와주지 않으면", "일을 끝낼 생각도 못"],
                        ["민수가 도와주지 않으면", "일을 끝낼 생각도 못"],
                        ["민수 씨의 도움이 없으면", "일을 끝낼 생각도 못"],
                        ["민수의 도움이 없으면", "일을 끝낼 생각도 못"]
                    ])
                ),
                item(
                    "g2-7",
                    "왜 그렇게 열심히 돈을 모아요?",
                    "(돈이 부족하다 / 집을 사다)",
                    "돈이 부족해서 지금은 집을 살 생각도 못 해요.",
                    ["돈이 부족한 이유를 먼저 말해 보세요.", "‘집을 살 생각도 못 해요’로 마무리해요."],
                    coreAnswer(["돈이 부족", "집을 살 생각도 못"]),
                    "워크북 연습 1 · 이유 말하기"
                ),
                item(
                    "g2-8",
                    "오늘은 왜 구두를 안 신어요?",
                    "(발이 아프다 / 구두를 신다)",
                    "발이 아파서 구두를 신을 생각도 못 해요.",
                    ["‘발이 아파서’로 이유를 말해요.", "구두는 ‘신을 생각도 못 해요’라고 이어 보세요."],
                    coreAnswer(["발이 아파", "구두를 신을 생각도 못"]),
                    "워크북 연습 2 · 그림 상황"
                ),
                item(
                    "g2-9",
                    "호수에 악어가 많다는 표지판을 봤어요. 수영할 거예요?",
                    "(악어가 많다 / 수영하다)",
                    "악어가 많아서 수영할 생각도 못 해요.",
                    ["위험한 이유 ‘악어가 많아서’를 먼저 써요.", "‘수영할 생각도 못 해요’로 이어 보세요."],
                    coreAnswer(["악어가 많", "수영할 생각도 못"]),
                    "워크북 연습 2 · 그림 상황"
                ),
                item(
                    "g2-10",
                    "저 무거운 역기를 들어 볼래요?",
                    "(너무 무겁다 / 역기를 들다)",
                    "너무 무거워서 역기를 들 생각도 못 해요.",
                    ["무거운 이유를 ‘-어서’로 연결해요.", "‘역기를 들 생각도 못 해요’를 넣어 보세요."],
                    coreAnswer(["무거워", "역기를 들 생각도 못"]),
                    "워크북 연습 2 · 그림 상황"
                ),
                item(
                    "g2-11",
                    "배가 아픈데 아이스크림을 먹을 거예요?",
                    "(배가 아프다 / 아이스크림을 먹다)",
                    "배가 아파서 아이스크림을 먹을 생각도 못 해요.",
                    ["몸 상태를 이유로 먼저 말해요.", "‘아이스크림을 먹을 생각도 못 해요’로 마무리해요."],
                    coreAnswer(["배가 아파", "아이스크림을 먹을 생각도 못"]),
                    "워크북 연습 2 · 그림 상황"
                ),
                item(
                    "g2-12",
                    "우리나라 공원에서 허용되지 않는 행동을 말해 보세요.",
                    "(공원 / 술을 마시다)",
                    "우리나라에서는 공원에서 술을 마실 생각도 못 해요.",
                    ["장소 ‘공원에서’를 넣어 보세요.", "금지되거나 어려운 행동에 ‘생각도 못 해요’를 써요."],
                    coreAnswer(["공원에서", "술을 마실 생각도 못"]),
                    "워크북 연습 4 · 문장 확장"
                ),
                item(
                    "g2-13",
                    "어릴 때는 상상하기 어려웠던 일을 말해 보세요.",
                    "(내가 어렸을 때 / 휴대폰으로 영상을 보다)",
                    "내가 어렸을 때는 휴대폰으로 영상을 볼 생각도 못 했어요.",
                    ["과거이므로 마지막을 ‘못 했어요’로 바꿔요.", "‘휴대폰으로 영상을 볼 생각도 못 했어요’를 써 보세요."],
                    coreAnswer(["어렸을 때", "영상을 볼 생각도 못 했"]),
                    "워크북 연습 4 · 문장 확장"
                ),
                item(
                    "g2-14",
                    "수업 시간에 하면 안 되는 행동을 말해 보세요.",
                    "(수업 시간 / 휴대폰을 사용하다)",
                    "수업 시간에는 휴대폰을 사용할 생각도 못 해요.",
                    ["‘수업 시간에는’으로 시작해요.", "행동 ‘휴대폰을 사용하다’를 목표 표현에 연결해요."],
                    coreAnswer(["수업 시간", "휴대폰을 사용할 생각도 못"]),
                    "워크북 연습 4 · 문장 확장"
                ),
                item(
                    "g2-15",
                    "우리 집에서 하면 안 되는 행동을 말해 보세요.",
                    "(우리 집 / 신발을 신고 들어가다)",
                    "우리 집에서는 신발을 신고 들어갈 생각도 못 해요.",
                    ["장소 ‘우리 집에서는’을 먼저 써요.", "‘신발을 신고 들어갈 생각도 못 해요’로 이어 보세요."],
                    coreAnswer(["우리 집", "신발을 신고 들어갈 생각도 못"]),
                    "워크북 연습 4 · 문장 확장"
                ),
                item(
                    "g2-16",
                    "돈이 없으면 하기 어려운 일을 말해 보세요.",
                    "(돈이 없다 / 해외여행을 가다)",
                    "돈이 없어서 해외여행을 갈 생각도 못 해요.",
                    ["주어진 시작 ‘돈이 없어서’를 그대로 활용해요.", "‘해외여행을 갈 생각도 못 해요’로 마무리해요."],
                    coreAnswer(["돈이 없", "해외여행을 갈 생각도 못"]),
                    "워크북 연습 4 · 문장 확장"
                ),
                item(
                    "g2-17",
                    "먹지 못하는 음식과 그 이유를 말해 보세요.",
                    "(알레르기가 있다 / 고기를 먹다)",
                    "저는 알레르기가 있어서 고기를 먹을 생각도 못 해요.",
                    ["‘알레르기가 있어서’로 이유를 말해요.", "‘고기를 먹을 생각도 못 해요’로 이어 보세요."],
                    coreAnswer(["알레르기가 있", "고기를 먹을 생각도 못"]),
                    "워크북 연습 3 · 주제 말하기"
                ),
                item(
                    "g2-18",
                    "집에서 하기 어려운 악기 연주와 그 이유를 말해 보세요.",
                    "(방음이 안 되다 / 드럼을 치다)",
                    "집은 방음이 안 돼서 드럼을 칠 생각도 못 해요.",
                    ["‘방음이 안 돼서’로 이유를 말해요.", "드럼은 ‘칠 생각도 못 해요’라고 해요."],
                    coreAnswer(["방음이 안 돼", "드럼을 칠 생각도 못"]),
                    "워크북 연습 3 · 주제 말하기"
                ),
                item(
                    "g2-19",
                    "요즘 하기 어려운 취미와 그 이유를 말해 보세요.",
                    "(시간이 없다 / 캠핑을 가다)",
                    "요즘은 시간이 없어서 캠핑을 갈 생각도 못 해요.",
                    ["‘시간이 없어서’로 이유를 말해요.", "‘캠핑을 갈 생각도 못 해요’로 이어 보세요."],
                    coreAnswer(["시간이 없", "캠핑을 갈 생각도 못"]),
                    "워크북 연습 3 · 주제 말하기"
                ),
                item(
                    "g2-20",
                    "하기 어려운 운동과 그 이유를 말해 보세요.",
                    "(무릎이 아프다 / 축구를 하다)",
                    "무릎이 아파서 축구를 할 생각도 못 해요.",
                    ["몸 상태 ‘무릎이 아파서’를 먼저 말해요.", "‘축구를 할 생각도 못 해요’로 마무리해요."],
                    coreAnswer(["무릎이 아파", "축구를 할 생각도 못"]),
                    "워크북 연습 3 · 주제 말하기"
                )
            ])
        }),
        grammar3: Object.freeze({
            pageId: "grammar3-workbook-review",
            grammar: "문법 3",
            target: "V-(으)ㄹ 만하다",
            items: Object.freeze([
                item(
                    "g3-1",
                    "그 산에 올라가 보니까 어때요?",
                    "(올라가 보다)",
                    "정말 올라가 볼 만해요.",
                    ["‘올라가 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요.", "추천하는 느낌을 위해 ‘정말’을 앞에 넣어 보세요."],
                    coreAnswer(["올라가 볼 만"])
                ),
                item(
                    "g3-2",
                    "레일바이크를 타 보니까 어때요?",
                    "(타 보다)",
                    "정말 타 볼 만해요.",
                    ["‘타 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요.", "추천하는 느낌을 위해 ‘정말’을 앞에 넣어 보세요."],
                    coreAnswer(["타 볼 만"])
                ),
                item(
                    "g3-3",
                    "사막에 가 보니까 어때요?",
                    "(가 보다)",
                    "정말 가 볼 만해요.",
                    ["‘가 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요.", "추천하는 느낌을 위해 ‘정말’을 앞에 넣어 보세요."],
                    coreAnswer(["가 볼 만"])
                ),
                item(
                    "g3-4",
                    "가야금을 배워 보니까 어때요?",
                    "(배워 보다)",
                    "정말 배워 볼 만해요.",
                    ["‘배워 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요.", "추천하는 느낌을 위해 ‘정말’을 앞에 넣어 보세요."],
                    coreAnswer(["배워 볼 만"])
                ),
                item(
                    "g3-5",
                    "남대문시장에서 먹을 만한 게 뭐가 있을까요?",
                    "(갈치조림 / 먹어 보다)",
                    "갈치조림이 먹어 볼 만해요.",
                    ["음식 ‘갈치조림’을 주어로 시작해 보세요.", "‘먹어 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요."],
                    coreAnswer(["갈치조림", "먹어 볼 만"])
                ),
                item(
                    "g3-6",
                    "제주도에 가서 뭘 하면 좋을까요?",
                    "(올레길 / 걸어 보다)",
                    "올레길을 걸어 볼 만해요.",
                    ["‘올레길’을 목적어로 먼저 말해 보세요.", "‘걸어 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여 보세요."],
                    coreAnswer(["올레길", "걸어 볼 만"])
                ),
                item(
                    "g3-7",
                    "외국인이 배울 만한 전통 악기가 있을까요?",
                    "(장구 / 배우다)",
                    "장구를 배울 만해요.",
                    ["전통 악기 ‘장구’를 먼저 넣어요.", "‘배우다’는 ‘배울 만해요’로 바꿔요."],
                    coreAnswer(["장구", "배울 만"]),
                    "워크북 연습 1 · 추천하기"
                ),
                item(
                    "g3-8",
                    "요즘 볼 만한 재미있는 TV 프로그램이 있어요?",
                    "(2박 3일 / 보다)",
                    "‘2박 3일’이 볼 만해요.",
                    ["프로그램 이름 ‘2박 3일’을 먼저 말해요.", "‘보다’를 ‘볼 만해요’로 바꿔요."],
                    coreAnswer(["2박 3일", "볼 만"]),
                    "워크북 연습 1 · 추천하기"
                ),
                item(
                    "g3-9",
                    "바다에서 뭘 하고 놀면 좋을까요?",
                    "(수상 스키 / 타 보다)",
                    "수상 스키를 타 볼 만해요.",
                    ["활동 ‘수상 스키’를 먼저 넣어요.", "‘타 보다’ 뒤에 ‘-ㄹ 만해요’를 붙여요."],
                    coreAnswer(["수상 스키", "타 볼 만"]),
                    "워크북 연습 1 · 추천하기"
                ),
                item(
                    "g3-10",
                    "간장을 많이 넣어서 불고기가 너무 짜지 않아요?",
                    "(조금 짜다 / 먹다)",
                    "괜찮아요. 조금 짜지만 먹을 만해요.",
                    ["먼저 ‘조금 짜지만’으로 양보해요.", "그 뒤에 ‘먹을 만해요’를 써요."],
                    coreAnswer(["짜지만", "먹을 만"]),
                    "워크북 연습 2 · 평가하기"
                ),
                item(
                    "g3-11",
                    "한국어 공부하는 게 너무 어렵지 않아요?",
                    "(어렵다 / 공부하다)",
                    "어렵지만 공부할 만해요.",
                    ["‘어렵지만’으로 반대 내용을 연결해요.", "‘공부하다’를 ‘공부할 만해요’로 바꿔요."],
                    coreAnswer(["어렵지만", "공부할 만"]),
                    "워크북 연습 2 · 평가하기"
                ),
                item(
                    "g3-12",
                    "외국에서 혼자 생활하기가 너무 불편하지 않아요?",
                    "(조금 불편하다 / 생활하다)",
                    "조금 불편하지만 생활할 만해요.",
                    ["불편한 점을 인정하고 ‘-지만’으로 연결해요.", "‘생활할 만해요’로 평가해 보세요."],
                    coreAnswer(["불편하지만", "생활할 만"]),
                    "워크북 연습 2 · 평가하기"
                ),
                item(
                    "g3-13",
                    "커피가 너무 진하지 않아요? 물을 더 넣을까요?",
                    "(조금 진하다 / 마시다)",
                    "괜찮아요. 조금 진하지만 마실 만해요.",
                    ["‘조금 진하지만’으로 시작해요.", "커피는 ‘마실 만해요’라고 평가해요."],
                    coreAnswer(["진하지만", "마실 만"]),
                    "워크북 연습 2 · 평가하기"
                ),
                item(
                    "g3-14",
                    "부산에는 해운대, 광안리, 태종대처럼 어떤 곳이 많아요?",
                    "(구경하다 / 곳)",
                    "부산에는 구경할 만한 곳이 많이 있어요.",
                    ["‘구경하다’를 관형형 ‘구경할’로 바꿔요.", "‘구경할 만한 곳’으로 묶어 보세요."],
                    coreAnswer(["구경할 만한 곳"]),
                    "워크북 연습 3 · 부산 소개"
                ),
                item(
                    "g3-15",
                    "해운대에는 수상 오토바이와 바나나 보트가 있어요.",
                    "(타 보다 / 것)",
                    "해운대에는 타 볼 만한 것도 많아요.",
                    ["‘타 보다’를 ‘타 볼’로 바꿔요.", "명사 ‘것’ 앞에서 ‘타 볼 만한’을 써요."],
                    coreAnswer(["타 볼 만한 것"]),
                    "워크북 연습 3 · 부산 소개"
                ),
                item(
                    "g3-16",
                    "바다를 보며 분위기 좋은 카페를 찾는다면 어디가 좋아요?",
                    "(달맞이 고개 / 가 보다)",
                    "달맞이 고개가 가 볼 만해요.",
                    ["장소 ‘달맞이 고개’를 먼저 말해요.", "추천은 ‘가 볼 만해요’로 표현해요."],
                    coreAnswer(["달맞이 고개", "가 볼 만"]),
                    "워크북 연습 3 · 부산 소개"
                ),
                item(
                    "g3-17",
                    "고향 수원에서 가 볼 만한 곳을 소개해 보세요.",
                    "(화성 / 구경하다)",
                    "수원에서는 화성이 구경할 만해요.",
                    ["추천할 장소 ‘화성’을 먼저 말해요.", "‘구경할 만해요’로 평가해 보세요."],
                    coreAnswer(["화성", "구경할 만"]),
                    "워크북 연습 4 · 고향 추천"
                ),
                item(
                    "g3-18",
                    "고향 수원에서 먹을 만한 음식을 소개해 보세요.",
                    "(갈비 / 먹어 보다)",
                    "수원에서는 갈비가 먹어 볼 만해요.",
                    ["추천할 음식 ‘갈비’를 넣어요.", "‘먹어 볼 만해요’로 평가해 보세요."],
                    coreAnswer(["갈비", "먹어 볼 만"]),
                    "워크북 연습 4 · 고향 추천"
                )
            ])
        }),
        grammar4: Object.freeze({
            // The public page previously used this key. Retaining it protects
            // existing learner work while the URL is redesigned as a review.
            pageId: "grammar4-workbook-sentence-quiz",
            grammar: "문법 4",
            target: "A/V-기로 유명하다 · N(으)로 유명하다",
            items: Object.freeze([
                item(
                    "g4-1",
                    "왜 동대문시장에 가려고 해요?",
                    "(옷이 싸다)",
                    "옷이 싸기로 유명하거든요.",
                    ["특징 ‘옷이 싸다’ 뒤에 ‘-기로 유명하다’를 붙여 보세요.", "‘왜?’에 대답하므로 ‘유명하거든요’로 마무리해 보세요."],
                    coreAnswer(["옷이 싸", "기로 유명"])
                ),
                item(
                    "g4-2",
                    "왜 동해에 가려고 해요?",
                    "(바다가 깨끗하다)",
                    "바다가 깨끗하기로 유명하거든요.",
                    ["특징 ‘바다가 깨끗하다’ 뒤에 ‘-기로 유명하다’를 붙여 보세요.", "‘왜?’에 대답하므로 ‘유명하거든요’로 마무리해 보세요."],
                    coreAnswer(["바다가 깨끗", "기로 유명"])
                ),
                item(
                    "g4-3",
                    "왜 영덕에 가려고 해요?",
                    "(게가 맛있다)",
                    "게가 맛있기로 유명하거든요.",
                    ["특징 ‘게가 맛있다’ 뒤에 ‘-기로 유명하다’를 붙여 보세요.", "‘왜?’에 대답하므로 ‘유명하거든요’로 마무리해 보세요."],
                    coreAnswer(["게가 맛있", "기로 유명"])
                ),
                item(
                    "g4-4",
                    "왜 경주에 가려고 해요?",
                    "(박물관이 많다)",
                    "박물관이 많기로 유명하거든요.",
                    ["특징 ‘박물관이 많다’ 뒤에 ‘-기로 유명하다’를 붙여 보세요.", "‘왜?’에 대답하므로 ‘유명하거든요’로 마무리해 보세요."],
                    coreAnswer(["박물관이 많", "기로 유명"])
                ),
                item(
                    "g4-5",
                    "울릉도는 무엇으로 유명해요?",
                    "(오징어)",
                    "울릉도는 오징어로 유명해요.",
                    ["울릉도의 대표 명사 ‘오징어’를 넣어 보세요.", "모음으로 끝난 명사 뒤에는 ‘로 유명해요’를 붙여 보세요."],
                    coreAnswer(["오징어로 유명"])
                ),
                item(
                    "g4-6",
                    "전주는 무엇으로 유명해요?",
                    "(비빔밥)",
                    "전주는 비빔밥으로 유명해요.",
                    ["전주의 대표 명사 ‘비빔밥’을 넣어 보세요.", "명사 뒤에 ‘-으로 유명해요’를 붙여 보세요."],
                    coreAnswer(["비빔밥으로 유명"])
                ),
                item(
                    "g4-7",
                    "동대문시장은 어떤 점으로 유명해요?",
                    "(쇼핑이 편리하다)",
                    "동대문시장은 쇼핑이 편리하기로 유명해요.",
                    ["특징 ‘쇼핑이 편리하다’를 활용해요.", "‘편리하다’는 ‘편리하기로’로 바꿔요."],
                    coreAnswer(["쇼핑이 편리", "기로 유명"]),
                    "워크북 연습 1 · 지역 특징"
                ),
                item(
                    "g4-8",
                    "한국은 어떤 점으로 유명해요?",
                    "(인터넷 속도가 빠르다)",
                    "한국은 인터넷 속도가 빠르기로 유명해요.",
                    ["특징 전체를 먼저 써요.", "‘빠르다’ 뒤에 ‘-기로 유명해요’를 붙여요."],
                    coreAnswer(["인터넷 속도가 빠르", "기로 유명"]),
                    "워크북 연습 1 · 지역 특징"
                ),
                item(
                    "g4-9",
                    "대구는 어떤 점으로 유명해요?",
                    "(사과가 맛있다)",
                    "대구는 사과가 맛있기로 유명해요.",
                    ["‘사과가 맛있다’를 활용해요.", "‘맛있기로 유명해요’로 바꿔 보세요."],
                    coreAnswer(["사과가 맛있", "기로 유명"]),
                    "워크북 연습 1 · 지역 특징"
                ),
                item(
                    "g4-10",
                    "제주도는 어떤 점으로 유명해요?",
                    "(돌, 바람, 여자가 많다)",
                    "제주도는 돌, 바람, 여자가 많기로 유명해요.",
                    ["세 명사 뒤에 ‘많다’를 연결해요.", "‘많다’는 ‘많기로 유명해요’로 바꿔요."],
                    coreAnswer(["돌", "바람", "여자", "많기로 유명"]),
                    "워크북 연습 1 · 지역 특징"
                ),
                item(
                    "g4-11",
                    "‘친구’라는 노래로 어떤 가수가 된 사람을 소개하려고 해요?",
                    "(‘친구’라는 노래 / 유명한 가수)",
                    "‘친구’라는 노래로 유명한 가수 한 분을 소개하려고 합니다.",
                    ["명사 ‘노래’ 뒤에는 ‘로 유명하다’를 써요.", "가수 앞에서 ‘노래로 유명한’으로 바꿔요."],
                    coreAnswer(["친구", "노래로 유명한", "가수"]),
                    "워크북 연습 2 · 가수 소개"
                ),
                item(
                    "g4-12",
                    "그 가수는 어렸을 때부터 무엇으로 유명했어요?",
                    "(노래를 잘 부르다)",
                    "어렸을 때부터 노래를 잘 부르기로 유명했어요.",
                    ["능력 ‘노래를 잘 부르다’를 활용해요.", "‘부르다’는 ‘부르기로 유명했어요’로 바꿔요."],
                    coreAnswer(["노래를 잘 부르", "기로 유명"]),
                    "워크북 연습 2 · 가수 소개"
                ),
                item(
                    "g4-13",
                    "그 가수는 춤 실력도 좋아요?",
                    "(춤을 잘 추다 / -도)",
                    "게다가 춤을 잘 추기로도 유명해요.",
                    ["추가 정보이므로 ‘-도’를 넣어요.", "‘춤을 잘 추기로도 유명해요’라고 말해요."],
                    coreAnswer(["춤을 잘 추", "기로도 유명"]),
                    "워크북 연습 2 · 가수 소개"
                ),
                item(
                    "g4-14",
                    "직접 노래 가사를 쓰기 시작한 뒤 어떻게 되었어요?",
                    "(더 / 유명해지다)",
                    "노래 가사를 직접 써서 더 유명해졌어요.",
                    ["변화를 나타내는 ‘유명해지다’를 써요.", "과거이므로 ‘더 유명해졌어요’로 마무리해요."],
                    coreAnswer(["가사를 직접 써", "더 유명해졌"]),
                    "워크북 연습 2 · 가수 소개"
                ),
                item(
                    "g4-15",
                    "이번 노랫말은 어떤 점으로 유명해요?",
                    "(아름답다)",
                    "이번 노랫말은 아름답기로 유명해요.",
                    ["형용사 ‘아름답다’를 활용해요.", "‘아름답기로 유명해요’로 바꿔 보세요."],
                    coreAnswer(["노랫말", "아름답기로 유명"]),
                    "워크북 연습 2 · 가수 소개"
                ),
                item(
                    "g4-16",
                    "수원은 무엇으로 유명해요?",
                    "(화성)",
                    "수원은 화성으로 유명해요.",
                    ["수원의 대표 장소 ‘화성’을 넣어요.", "받침 있는 명사 뒤에는 ‘으로 유명해요’를 써요."],
                    coreAnswer(["화성으로 유명"]),
                    "워크북 연습 3 · 지도 말하기"
                ),
                item(
                    "g4-17",
                    "우리나라의 대표 음식을 소개해 보세요.",
                    "(한국 / 김치)",
                    "한국은 김치로 유명해요.",
                    ["대표 명사 ‘김치’를 넣어요.", "모음으로 끝난 명사 뒤에는 ‘로 유명해요’를 써요."],
                    coreAnswer(["한국", "김치로 유명"]),
                    "워크북 연습 4 · 나라와 고향"
                ),
                item(
                    "g4-18",
                    "우리나라의 특징을 소개해 보세요.",
                    "(한국 / 대중교통이 편리하다)",
                    "한국은 대중교통이 편리하기로 유명해요.",
                    ["특징 ‘대중교통이 편리하다’를 활용해요.", "‘편리하기로 유명해요’로 바꿔 보세요."],
                    coreAnswer(["한국", "대중교통이 편리", "기로 유명"]),
                    "워크북 연습 4 · 나라와 고향"
                ),
                item(
                    "g4-19",
                    "고향 수원의 대표 장소를 소개해 보세요.",
                    "(수원 / 화성)",
                    "수원은 화성으로 유명해요.",
                    ["고향과 대표 장소를 함께 넣어요.", "‘화성으로 유명해요’로 마무리해요."],
                    coreAnswer(["수원", "화성으로 유명"]),
                    "워크북 연습 4 · 나라와 고향"
                ),
                item(
                    "g4-20",
                    "고향 수원의 음식 특징을 소개해 보세요.",
                    "(수원 / 갈비가 맛있다)",
                    "수원은 갈비가 맛있기로 유명해요.",
                    ["특징 ‘갈비가 맛있다’를 활용해요.", "‘맛있기로 유명해요’로 바꿔 보세요."],
                    coreAnswer(["수원", "갈비가 맛있", "기로 유명"]),
                    "워크북 연습 4 · 나라와 고향"
                )
            ])
        })
    });

    function isPlainObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value)
            && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
    }

    function sameKeys(record, keys) {
        if (!isPlainObject(record)) return false;
        const actual = Object.keys(record).sort();
        const expected = keys.slice().sort();
        return actual.length === expected.length && actual.every(function (key, index) {
            return key === expected[index];
        });
    }

    function initialState(config) {
        const state = {
            currentIndex: 0,
            responses: {},
            attempts: {},
            checked: {},
            correct: {},
            revealed: {},
            hints: {},
            completed: false
        };
        config.items.forEach(function (reviewItem) {
            state.responses[reviewItem.id] = "";
            state.attempts[reviewItem.id] = 0;
            state.checked[reviewItem.id] = false;
            state.correct[reviewItem.id] = false;
            state.revealed[reviewItem.id] = false;
            state.hints[reviewItem.id] = 0;
        });
        return state;
    }

    const LEGACY_GRAMMAR4_PAGE_ID = "grammar4-workbook-sentence-quiz";
    const LEGACY_GRAMMAR4_RECORD_FIELDS = Object.freeze([
        "selectedType", "value", "attempts", "hintLevel", "correct", "revealed"
    ]);
    const LEGACY_GRAMMAR4_ITEMS = Object.freeze({
        dongdaemun: Object.freeze({ type: "feature", answer: "쇼핑이 편리하기로" }),
        "east-sea": Object.freeze({ type: "feature", answer: "바다가 깨끗하기로" }),
        korea: Object.freeze({ type: "feature", answer: "인터넷 속도가 빠르기로" }),
        ulleungdo: Object.freeze({ type: "noun", answer: "오징어" }),
        jeonju: Object.freeze({ type: "noun", answer: "전주비빔밥" })
    });
    const LEGACY_GRAMMAR4_MAPPINGS = Object.freeze([
        Object.freeze({ legacyId: "east-sea", reviewId: "g4-2" }),
        Object.freeze({ legacyId: "ulleungdo", reviewId: "g4-5" }),
        Object.freeze({ legacyId: "jeonju", reviewId: "g4-6" })
    ]);

    // Treat unrecognized fields as a corrupt record rather than silently
    // "repairing" them. C16GrammarState then preserves the raw stored value
    // until the learner confirms this page's reset control.
    function validateState(saved, config) {
        const ids = config.items.map(function (reviewItem) { return reviewItem.id; });
        const stateKeys = ["currentIndex", "responses", "attempts", "checked", "correct", "revealed", "hints", "completed"];
        if (!sameKeys(saved, stateKeys)) return false;
        if (!Number.isInteger(saved.currentIndex) || saved.currentIndex < 0 || saved.currentIndex >= ids.length) return false;
        if (typeof saved.completed !== "boolean") return false;
        if (!sameKeys(saved.responses, ids) || !sameKeys(saved.attempts, ids)
            || !sameKeys(saved.checked, ids) || !sameKeys(saved.correct, ids)
            || !sameKeys(saved.revealed, ids) || !sameKeys(saved.hints, ids)) return false;

        for (const id of ids) {
            if (typeof saved.responses[id] !== "string" || saved.responses[id].length > 2000) return false;
            if (!Number.isInteger(saved.attempts[id]) || saved.attempts[id] < 0 || saved.attempts[id] > 99) return false;
            if (typeof saved.checked[id] !== "boolean" || typeof saved.correct[id] !== "boolean"
                || typeof saved.revealed[id] !== "boolean") return false;
            if (!Number.isInteger(saved.hints[id]) || saved.hints[id] < 0 || saved.hints[id] > 2) return false;
            if (saved.correct[id] && saved.revealed[id]) return false;
            if ((saved.correct[id] || saved.revealed[id]) && !saved.checked[id]) return false;
            if (!saved.checked[id] && saved.attempts[id] !== 0) return false;
            if (saved.checked[id] && !saved.correct[id] && !saved.revealed[id] && saved.attempts[id] < 1) return false;
        }

        if (saved.completed) {
            if (saved.currentIndex !== ids.length - 1) return false;
            if (!ids.every(function (id) { return saved.correct[id] || saved.revealed[id]; })) return false;
        }
        return true;
    }

    const PREVIOUS_REVIEW_ITEM_COUNT = 6;

    function migrateExpandedReviewRecord(config) {
        if (config.items.length <= PREVIOUS_REVIEW_ITEM_COUNT) return;
        const storageKey = "korean3b.c16.grammar." + config.pageId;
        let payload;
        try {
            const rawRecord = window.localStorage.getItem(storageKey);
            if (!rawRecord) return;
            payload = JSON.parse(rawRecord);
        } catch (error) {
            return;
        }

        const topLevelKeys = ["version", "page", "updatedAt", "state"];
        if (!sameKeys(payload, topLevelKeys)
            || payload.version !== window.C16GrammarState.VERSION
            || payload.page !== config.pageId
            || typeof payload.updatedAt !== "string"
            || !Number.isFinite(Date.parse(payload.updatedAt))) return;

        const previousConfig = { items: config.items.slice(0, PREVIOUS_REVIEW_ITEM_COUNT) };
        if (!validateState(payload.state, previousConfig)) return;

        const next = initialState(config);
        const previousIds = previousConfig.items.map(function (reviewItem) { return reviewItem.id; });
        ["responses", "attempts", "checked", "correct", "revealed", "hints"].forEach(function (field) {
            previousIds.forEach(function (id) {
                next[field][id] = payload.state[field][id];
            });
        });
        next.currentIndex = payload.state.completed
            ? PREVIOUS_REVIEW_ITEM_COUNT
            : payload.state.currentIndex;
        next.completed = false;

        if (!validateState(next, config)) return;
        try {
            window.localStorage.setItem(storageKey, JSON.stringify({
                version: window.C16GrammarState.VERSION,
                page: config.pageId,
                updatedAt: new Date().toISOString(),
                state: next
            }));
        } catch (error) {
            // Leave the exact previous record untouched when migration cannot
            // be written. The state helper will then expose its recovery UI.
        }
    }

    function isPristineLegacyGrammar4Record(record) {
        return record.selectedType === ""
            && record.value === ""
            && record.attempts === 0
            && record.hintLevel === 0
            && !record.correct
            && !record.revealed;
    }

    function legacyRecordMatchesExpected(record, expected) {
        return record.selectedType === expected.type && record.value === expected.answer;
    }

    function isExactLegacyGrammar4Record(record) {
        if (!sameKeys(record, LEGACY_GRAMMAR4_RECORD_FIELDS)) return false;
        if (!["", "feature", "noun"].includes(record.selectedType)) return false;
        if (typeof record.value !== "string" || record.value.length > 2000) return false;
        if (!Number.isSafeInteger(record.attempts) || record.attempts < 0) return false;
        if (!Number.isSafeInteger(record.hintLevel) || record.hintLevel < 0 || record.hintLevel > 3) return false;
        if (typeof record.correct !== "boolean" || typeof record.revealed !== "boolean") return false;
        return !(record.correct && record.revealed);
    }

    function isExactLegacyGrammar4Payload(payload, config) {
        const topLevelKeys = ["version", "page", "updatedAt", "state"];
        const stateKeys = ["index", "records", "completed"];
        if (!sameKeys(payload, topLevelKeys)) return false;
        if (payload.version !== window.C16GrammarState.VERSION || payload.page !== config.pageId) return false;
        if (typeof payload.updatedAt !== "string" || !Number.isFinite(Date.parse(payload.updatedAt))) return false;
        if (!sameKeys(payload.state, stateKeys)) return false;

        const legacyState = payload.state;
        const legacyIds = Object.keys(LEGACY_GRAMMAR4_ITEMS);
        if (!Number.isInteger(legacyState.index) || legacyState.index < 0 || legacyState.index >= legacyIds.length) return false;
        if (typeof legacyState.completed !== "boolean" || !isPlainObject(legacyState.records)) return false;
        if (!Object.keys(legacyState.records).every(function (id) { return legacyIds.includes(id); })) return false;

        for (const id of Object.keys(legacyState.records)) {
            const record = legacyState.records[id];
            if (!isExactLegacyGrammar4Record(record)) return false;
            if (!isPristineLegacyGrammar4Record(record)
                && !legacyRecordMatchesExpected(record, LEGACY_GRAMMAR4_ITEMS[id])) {
                return false;
            }
        }

        if (legacyState.completed) {
            if (legacyState.index !== legacyIds.length - 1) return false;
            if (!legacyIds.every(function (id) {
                const record = legacyState.records[id];
                return record && (record.correct || record.revealed);
            })) return false;
        }
        return true;
    }

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function migrateLegacyGrammar4State(legacyState, config) {
        const next = initialState(config);
        for (const mapping of LEGACY_GRAMMAR4_MAPPINGS) {
            const legacyRecord = legacyState.records[mapping.legacyId];
            if (!legacyRecord) continue;
            const reviewItem = config.items.find(function (candidate) { return candidate.id === mapping.reviewId; });
            if (!reviewItem) return null;

            next.attempts[mapping.reviewId] = clamp(legacyRecord.attempts, 0, 99);
            next.hints[mapping.reviewId] = clamp(legacyRecord.hintLevel, 0, 2);
            if (legacyRecord.correct || legacyRecord.revealed) {
                next.responses[mapping.reviewId] = reviewItem.answer;
                next.checked[mapping.reviewId] = true;
                next.correct[mapping.reviewId] = legacyRecord.correct;
                next.revealed[mapping.reviewId] = legacyRecord.revealed;
            } else if (legacyRecord.attempts > 0) {
                next.checked[mapping.reviewId] = true;
            }
        }

        const earliestUnresolved = config.items.findIndex(function (reviewItem) {
            return !next.correct[reviewItem.id] && !next.revealed[reviewItem.id];
        });
        next.currentIndex = earliestUnresolved === -1 ? config.items.length - 1 : earliestUnresolved;
        next.completed = earliestUnresolved === -1;
        return next;
    }

    // Grammar 4 kept its previous URL/key. Convert only an exact legacy state
    // before the shared helper reads it; every other raw value is left intact
    // for the helper's page-scoped recovery/reset flow.
    function migrateLegacyGrammar4Record(config) {
        if (config.pageId !== LEGACY_GRAMMAR4_PAGE_ID) return;
        const storageKey = "korean3b.c16.grammar." + config.pageId;
        let rawRecord;
        let payload;
        try {
            rawRecord = window.localStorage.getItem(storageKey);
            if (!rawRecord) return;
            payload = JSON.parse(rawRecord);
        } catch (error) {
            return;
        }
        if (!isExactLegacyGrammar4Payload(payload, config)) return;

        const migratedState = migrateLegacyGrammar4State(payload.state, config);
        if (!migratedState || !validateState(migratedState, config)) return;
        const migratedPayload = {
            version: window.C16GrammarState.VERSION,
            page: config.pageId,
            updatedAt: new Date().toISOString(),
            state: migratedState
        };
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(migratedPayload));
        } catch (error) {
            // A failed migration is intentionally non-destructive: the helper
            // will report its normal storage recovery state after this return.
        }
    }

    function publicConfig(config) {
        return Object.freeze({
            pageId: config.pageId,
            grammar: config.grammar,
            target: config.target,
            items: Object.freeze(config.items.map(function (reviewItem) {
                return Object.freeze({
                    id: reviewItem.id,
                    prompt: reviewItem.prompt,
                    cue: reviewItem.cue,
                    answer: reviewItem.answer,
                    section: reviewItem.section
                });
            }))
        });
    }

    function init() {
        const page = document.body && document.body.dataset.c16WorkbookReview;
        const config = CONFIGS[page];
        const root = document.querySelector("[data-c16-workbook-review-root]");
        if (!config || !root || !window.C16GrammarState) return;

        const progressLabel = root.querySelector("[data-review-progress-label]");
        const progressFill = root.querySelector("[data-review-progress-fill]");
        const task = root.querySelector("[data-review-task]");
        const taskLabel = root.querySelector("[data-review-task-label]");
        const question = root.querySelector("[data-review-question]");
        const cue = root.querySelector("[data-review-cue]");
        const answerLabel = root.querySelector("[data-review-answer-label]");
        const answerInput = root.querySelector("#answerInput");
        const primaryAction = root.querySelector("#primaryAction");
        const feedback = root.querySelector("#reviewFeedback");
        const hintButton = root.querySelector("#hintButton");
        const hint = root.querySelector("#reviewHint");
        const revealButton = root.querySelector("#revealButton");
        const answerReveal = root.querySelector("#answerReveal");
        const summary = root.querySelector("[data-review-summary]");
        const summaryText = root.querySelector("[data-review-summary-text]");
        const stateTools = document.querySelector("[data-c16-state-tools]");
        const initial = initialState(config);
        let state;
        let saveTimer = 0;

        if (!progressLabel || !progressFill || !task || !taskLabel || !question || !cue || !answerLabel
            || !answerInput || !primaryAction || !feedback || !hintButton || !hint || !revealButton
            || !answerReveal || !summary || !summaryText) return;

        migrateLegacyGrammar4Record(config);
        migrateExpandedReviewRecord(config);
        const store = window.C16GrammarState.create(config.pageId, initial, {
            validate: function (saved) { return validateState(saved, config); },
            onReset: function (fresh) {
                clearScheduledSave();
                state = fresh;
                render();
            }
        });
        state = store.get();

        function clearScheduledSave() {
            if (saveTimer) window.clearTimeout(saveTimer);
            saveTimer = 0;
        }

        function flushSave() {
            clearScheduledSave();
            store.save(state);
        }

        function scheduleSave() {
            clearScheduledSave();
            saveTimer = window.setTimeout(flushSave, SAVE_DEBOUNCE_MS);
        }

        function currentItem() {
            return config.items[state.currentIndex];
        }

        function isResolved(id) {
            return state.correct[id] || state.revealed[id];
        }

        function resolvedCount() {
            return config.items.filter(function (reviewItem) {
                return isResolved(reviewItem.id);
            }).length;
        }

        function correctCount() {
            return config.items.filter(function (reviewItem) {
                return state.correct[reviewItem.id];
            }).length;
        }

        function revealedCount() {
            return config.items.filter(function (reviewItem) {
                return state.revealed[reviewItem.id];
            }).length;
        }

        function canReveal(id) {
            return !isResolved(id) && (state.attempts[id] >= 2 || state.hints[id] >= 2);
        }

        function setFeedback(kind, text) {
            feedback.className = "c16-wb-feedback c16-wb-feedback--" + kind;
            feedback.textContent = text;
        }

        function renderProgress() {
            const visibleStep = state.completed ? config.items.length : state.currentIndex + 1;
            progressLabel.textContent = state.completed
                ? "완료 · " + config.items.length + " / " + config.items.length
                : visibleStep + " / " + config.items.length;
            const amount = state.completed ? config.items.length : Math.max(visibleStep, resolvedCount());
            progressFill.style.width = Math.round((amount / config.items.length) * 100) + "%";
        }

        function renderFeedback(reviewItem) {
            const id = reviewItem.id;
            if (state.correct[id]) {
                setFeedback("correct", "맞아요.");
            } else if (state.revealed[id]) {
                setFeedback("correct", "정답을 확인했어요.");
            } else if (state.checked[id]) {
                setFeedback(
                    "hint",
                    state.attempts[id] >= 2
                        ? "한 번 더 써 보거나 정답을 확인하세요."
                        : "괄호 속 말과 목표 표현을 확인해 보세요."
                );
            } else if (state.hints[id] > 0) {
                setFeedback("hint", "힌트를 참고해 다시 써 보세요.");
            } else {
                feedback.className = "c16-wb-feedback";
                feedback.textContent = "";
            }
        }

        function renderTask() {
            const reviewItem = currentItem();
            const id = reviewItem.id;
            const resolved = isResolved(id);
            task.hidden = false;
            summary.hidden = true;
            taskLabel.textContent = reviewItem.section + " · " + (state.currentIndex + 1) + "번";
            question.textContent = reviewItem.prompt;
            cue.textContent = reviewItem.cue;
            cue.hidden = !reviewItem.cue;
            answerLabel.textContent = (state.currentIndex + 1) + "번 답";
            answerInput.setAttribute("aria-label", config.target + " " + (state.currentIndex + 1) + "번 답");
            answerInput.value = state.responses[id];
            answerInput.disabled = resolved;
            answerInput.placeholder = "핵심 표현 입력";
            primaryAction.textContent = resolved
                ? (state.currentIndex === config.items.length - 1 ? "결과 보기" : "다음 문제")
                : "답 확인";
            hintButton.hidden = resolved || state.hints[id] >= 2;
            hintButton.textContent = state.hints[id] === 0 ? "힌트 보기" : "힌트 더 보기";
            hint.hidden = resolved || state.hints[id] === 0;
            hint.textContent = state.hints[id] > 0
                ? "힌트 " + state.hints[id] + ": " + reviewItem.hints[state.hints[id] - 1]
                : "";
            revealButton.hidden = !canReveal(id);
            answerReveal.hidden = !state.revealed[id];
            answerReveal.textContent = state.revealed[id] ? "정답: " + reviewItem.answer : "";
            renderFeedback(reviewItem);

            answerInput.oninput = function () {
                state.responses[id] = answerInput.value;
                scheduleSave();
            };
            answerInput.onblur = flushSave;
            answerInput.onkeydown = function (event) {
                if (event.key !== "Enter") return;
                event.preventDefault();
                if (isResolved(id)) advanceCurrent();
                else checkCurrent(answerInput.value);
            };
            primaryAction.onclick = function () {
                if (isResolved(id)) advanceCurrent();
                else checkCurrent(answerInput.value);
            };
            hintButton.onclick = showNextHint;
            revealButton.onclick = revealCurrent;
        }

        function renderCompletion() {
            task.hidden = true;
            summary.hidden = false;
            summary.querySelector("h2").textContent = config.items.length + "문항 복습을 마쳤어요";
            summaryText.textContent = "스스로 맞힌 문항 " + correctCount() + "개 · 답을 확인한 문항 " + revealedCount() + "개";
        }

        function render() {
            renderProgress();
            if (state.completed) renderCompletion();
            else renderTask();
        }

        function checkCurrent(value) {
            if (state.completed) return clone(state);
            const reviewItem = currentItem();
            const id = reviewItem.id;
            if (isResolved(id)) return clone(state);
            const response = String(value == null ? "" : value);
            state.responses[id] = response;
            if (!normalizeText(response)) {
                flushSave();
                setFeedback("hint", "괄호 속 말을 활용해 핵심 표현을 입력하세요.");
                answerInput.focus();
                return clone(state);
            }

            state.attempts[id] += 1;
            state.checked[id] = true;
            if (reviewItem.accepts(response)) state.correct[id] = true;
            flushSave();
            render();
            if (state.correct[id]) primaryAction.focus();
            else answerInput.focus();
            return clone(state);
        }

        function showNextHint() {
            if (state.completed) return;
            const id = currentItem().id;
            if (isResolved(id) || state.hints[id] >= 2) return;
            state.hints[id] += 1;
            flushSave();
            render();
            if (canReveal(id)) revealButton.focus();
            else hintButton.focus();
        }

        function revealCurrent() {
            if (state.completed) return;
            const reviewItem = currentItem();
            const id = reviewItem.id;
            if (!canReveal(id)) return;
            state.revealed[id] = true;
            state.checked[id] = true;
            state.responses[id] = reviewItem.answer;
            flushSave();
            render();
            primaryAction.focus();
        }

        function advanceCurrent() {
            if (state.completed) return;
            const id = currentItem().id;
            if (!isResolved(id)) return;
            if (state.currentIndex === config.items.length - 1) {
                state.completed = true;
            } else {
                state.currentIndex += 1;
            }
            flushSave();
            render();
            if (state.completed) {
                summary.querySelector("h2")?.focus();
            } else {
                taskLabel.focus();
            }
        }

        store.mount(stateTools, function () { return state; });
        store.track(function () { return state; });
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") flushSave();
        });
        window.addEventListener("pagehide", flushSave);

        const testConfig = publicConfig(config);
        window.__c16WorkbookReview = Object.freeze({
            currentState: function () { return clone(state); },
            config: testConfig,
            storageKey: store.key,
            answerCurrent: function (value) { return checkCurrent(value); }
        });

        render();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
