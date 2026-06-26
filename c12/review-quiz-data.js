(function () {
    "use strict";

    window.REVIEW_QUIZ_CONFIG = {
        chapter: "12",
        eyebrow: "Lesson 12 Review",
        title: "12과 어휘·문법 복습",
        subtitle: "몸 상태와 운동 동작 어휘, V-았더니/었더니, 얼마나 -(으)ㄴ/는지 모르다, -(으)ㄴ/는 모양이다, -아야/어야를 점검합니다.",
        tags: ["몸 상태", "스트레칭", "-았더니/었더니", "얼마나 -는지 모르다", "모양이다", "-아야/어야"],
        image: {
            src: "../assets/c12/misc/images/split-variants-35/full/n13.webp",
            alt: "목을 돌리는 스트레칭 동작 그림",
            width: 640,
            height: 420
        },
        rightsNote: "서울대 한국어 3B 워크북 12과 학습 목표를 바탕으로 새로 구성한 보조 문제입니다.",
        homework: {
            enabled: true,
            assignmentId: "c12-review-quiz-v1",
            requireStudentName: true
        },
        questions: [
            {
                id: "c12-mcq-01",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 0,
                prompt: "체중이 늘었어요. 어떤 말이에요?",
                answer: "살이 찌다",
                distractors: ["살이 빠지다", "몸이 가볍다", "기운이 나다"],
                explanation: "체중이 늘면 살이 찌다를 씁니다."
            },
            {
                id: "c12-mcq-02",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 1,
                prompt: "운동을 많이 해서 호흡이 가쁘고 힘들어요. 어떤 말이에요?",
                answer: "숨이 차다",
                distractors: ["땀이 나다", "쥐가 나다", "기분이 상쾌하다"],
                explanation: "호흡이 가쁘고 힘들면 숨이 차다라고 합니다."
            },
            {
                id: "c12-mcq-03",
                type: "mcq",
                area: "어휘",
                kind: "동작 선택",
                targetSlot: 2,
                prompt: "가슴을 넓게 벌리는 동작은?",
                answer: "(가슴을) 펴다",
                distractors: ["(목을) 돌리다", "(옆구리를) 굽히다", "(발뒤꿈치를) 들다"],
                explanation: "가슴을 넓게 벌리는 동작은 가슴을 펴다입니다."
            },
            {
                id: "c12-mcq-04",
                type: "mcq",
                area: "어휘",
                kind: "동작 선택",
                targetSlot: 3,
                prompt: "발의 뒷부분을 위로 올리는 동작은?",
                answer: "(발뒤꿈치를) 들다",
                distractors: ["(팔을) 뻗다", "(다리를) 벌리다", "(몸을) 젖히다"],
                explanation: "발의 뒷부분을 위로 올리면 발뒤꿈치를 들다를 씁니다."
            },
            {
                id: "c12-mcq-05",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 0,
                prompt: "근육이 갑자기 아파서 움직이기 어려워요. 어떤 말이에요?",
                answer: "쥐가 나다",
                distractors: ["기운이 나다", "몸이 좋아지다", "자세가 좋다"],
                explanation: "근육이 갑자기 수축해 아프면 쥐가 나다라고 합니다."
            },
            {
                id: "c12-mcq-06",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 1,
                prompt: "샤워하고 산책했더니 느낌이 시원하고 깨끗해요. 어떤 말이에요?",
                answer: "기분이 상쾌하다",
                distractors: ["몸이 무겁다", "힘이 약하다", "지치다"],
                explanation: "느낌이 시원하고 깨끗하면 기분이 상쾌하다라고 합니다."
            },
            {
                id: "c12-mcq-07",
                type: "mcq",
                area: "V-았더니/었더니",
                kind: "형태 선택",
                targetSlot: 2,
                prompt: "매일 아침 스트레칭을 ____ 몸이 한결 가벼워졌어요. (하다)",
                answer: "했더니",
                distractors: ["하더니", "해서", "하면"],
                explanation: "하다 + -였더니가 줄어서 했더니가 됩니다."
            },
            {
                id: "c12-mcq-08",
                type: "mcq",
                area: "V-았더니/었더니",
                kind: "의미 선택",
                targetSlot: 3,
                prompt: "V-았더니/었더니의 핵심 의미는?",
                answer: "직접 해 본 뒤 결과나 발견을 말한다",
                distractors: ["상대에게 명령한다", "막연한 미래 계획을 말한다", "단어를 나열한다"],
                explanation: "이 표현은 내가 직접 한 행동 뒤의 결과나 새롭게 알게 된 사실을 말합니다."
            },
            {
                id: "c12-mcq-09",
                type: "mcq",
                area: "얼마나 -(으)ㄴ/는지 모르다",
                kind: "형태 선택",
                targetSlot: 0,
                prompt: "이 케이크가 얼마나 _______ 몰라요. (맛있다)",
                answer: "맛있는지",
                distractors: ["맛있은지", "맛있던지", "맛있을지"],
                explanation: "맛있다는 있다형 형용사라 맛있는지가 맞습니다."
            },
            {
                id: "c12-mcq-10",
                type: "mcq",
                area: "얼마나 -(으)ㄴ/는지 모르다",
                kind: "형태 선택",
                targetSlot: 1,
                prompt: "친구가 선물을 받고 얼마나 _______ 몰라요. (좋아하다)",
                answer: "좋아하는지",
                distractors: ["좋아한지", "좋아할지", "좋아했는지"],
                explanation: "현재 동사는 -는지를 붙여 좋아하는지가 됩니다."
            },
            {
                id: "c12-mcq-11",
                type: "mcq",
                area: "-(으)ㄴ/는 모양이다",
                kind: "형태 선택",
                targetSlot: 2,
                prompt: "웃음소리가 크게 들려요. 재미있는 영화를 _______ 모양이에요.",
                answer: "보는",
                distractors: ["본", "볼", "보인"],
                explanation: "현재 동작을 추측할 때는 -는 모양이다를 씁니다."
            },
            {
                id: "c12-mcq-12",
                type: "mcq",
                area: "-(으)ㄴ/는 모양이다",
                kind: "형태 선택",
                targetSlot: 3,
                prompt: "하늘에 먹구름이 가득해요. 곧 비가 _______ 모양이에요. (오다)",
                answer: "올",
                distractors: ["오는", "온", "오인"],
                explanation: "앞으로 일어날 일을 추측할 때는 -(으)ㄹ 모양이다를 씁니다."
            },
            {
                id: "c12-mcq-13",
                type: "mcq",
                area: "-아야/어야",
                kind: "형태 선택",
                targetSlot: 0,
                prompt: "외국어를 잘하려면 꾸준히 _______ 해요.",
                answer: "해야",
                distractors: ["하아야", "하야", "하더니"],
                explanation: "하다의 -아야/어야 형태는 해야입니다."
            },
            {
                id: "c12-mcq-14",
                type: "mcq",
                area: "-아야/어야",
                kind: "명사 연결",
                targetSlot: 1,
                prompt: "도서관에 들어가려면 우리 학교 _______ 해요. (학생)",
                answer: "학생이어야",
                distractors: ["학생여야", "학생아야", "학생해야"],
                explanation: "받침 있는 명사에는 이어야를 붙입니다."
            },
            {
                id: "c12-mcq-15",
                type: "mcq",
                area: "-아야/어야",
                kind: "의미 선택",
                targetSlot: 2,
                prompt: "-아야/어야의 핵심 의미는?",
                answer: "필수 조건",
                distractors: ["과거 회상", "단순 명령", "근거 없는 추측"],
                explanation: "-아야/어야는 어떤 결과가 가능해지기 위한 필수 조건을 말합니다."
            },
            {
                id: "c12-mcq-16",
                type: "mcq",
                area: "-(으)ㄴ/는 모양이다",
                kind: "의미 선택",
                targetSlot: 3,
                prompt: "-(으)ㄴ/는 모양이다가 가장 잘 어울리는 상황은?",
                answer: "눈앞의 근거를 보고 추측할 때",
                distractors: ["계획을 약속할 때", "상대에게 부탁할 때", "아무 근거 없이 상상할 때"],
                explanation: "모양이다는 보이거나 들리는 근거를 바탕으로 조심스럽게 추측할 때 씁니다."
            },
            {
                id: "c12-short-17",
                type: "short",
                area: "어휘",
                kind: "단답",
                prompt: "몸이 둔하고 피곤해요. 몸이 ______.",
                answers: ["무거워요", "무겁습니다", "무겁다"],
                explanation: "몸이 둔하고 피곤하면 몸이 무겁다라고 합니다."
            },
            {
                id: "c12-short-18",
                type: "short",
                area: "어휘",
                kind: "단답",
                prompt: "체중이 줄었어요. 살이 ______.",
                answers: ["빠졌어요", "빠졌습니다", "빠지다"],
                explanation: "체중이 줄면 살이 빠지다를 씁니다."
            },
            {
                id: "c12-short-19",
                type: "short",
                area: "어휘",
                kind: "동작 쓰기",
                prompt: "스트레칭할 때 목을 천천히 ______. (돌리다)",
                answers: ["돌려요", "돌립니다", "돌리세요"],
                explanation: "목을 원을 그리며 움직이는 동작은 목을 돌리다입니다."
            },
            {
                id: "c12-short-20",
                type: "short",
                area: "V-았더니/었더니",
                kind: "형태 쓰기",
                prompt: "많이 ______ 다리가 아파요. (걷다)",
                answers: ["걸었더니"],
                explanation: "걷다에 -었더니를 붙이면 걸었더니가 됩니다."
            },
            {
                id: "c12-short-21",
                type: "short",
                area: "V-았더니/었더니",
                kind: "형태 쓰기",
                prompt: "식사량을 조금 ______ 살이 조금 빠졌어요. (줄이다)",
                answers: ["줄였더니"],
                explanation: "줄이다는 줄였더니로 활용합니다."
            },
            {
                id: "c12-short-22",
                type: "short",
                area: "얼마나 -(으)ㄴ/는지 모르다",
                kind: "형태 쓰기",
                prompt: "한국어 공부가 얼마나 ______ 몰라요. (어렵다)",
                answers: ["어려운지"],
                explanation: "어렵다는 ㅂ 불규칙이라 어려운지가 됩니다."
            },
            {
                id: "c12-short-23",
                type: "short",
                area: "-(으)ㄴ/는 모양이다",
                kind: "형태 쓰기",
                prompt: "친구가 계속 하품해요. 어젯밤에 잠을 잘 못 ______ 모양이에요. (자다)",
                answers: ["잔"],
                explanation: "과거 동작 추측은 -(으)ㄴ 모양이다를 써서 잔 모양이에요가 됩니다."
            },
            {
                id: "c12-short-24",
                type: "short",
                area: "-아야/어야",
                kind: "형태 쓰기",
                prompt: "옷을 사려면 옷이 몸에 잘 ______ 해요. (맞다)",
                answers: ["맞아야"],
                explanation: "맞다는 ㅏ 모음이 있으므로 맞아야가 됩니다."
            }
        ]
    };
}());
