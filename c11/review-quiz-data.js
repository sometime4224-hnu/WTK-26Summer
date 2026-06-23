(function () {
    "use strict";

    window.REVIEW_QUIZ_CONFIG = {
        chapter: "11",
        eyebrow: "Lesson 11 Review",
        title: "11과 어휘·문법 복습",
        subtitle: "업무와 직장 생활 어휘, 사동 표현, 가정 표현, 무엇이든지·무슨 N(이)든지 표현을 점검합니다.",
        tags: ["업무", "근무 조건", "사동", "-(ㄴ/는)다면", "무엇이든지", "무슨 N(이)든지"],
        image: {
            src: "../assets/c11/vocabulary/images/split/c11_02_TL.webp",
            alt: "업무와 아르바이트 어휘를 나타내는 그림",
            width: 640,
            height: 420
        },
        rightsNote: "서울대 한국어 3B 워크북 11과 학습 목표를 바탕으로 새로 구성한 보조 문제입니다.",
        questions: [
            {
                id: "c11-mcq-01",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 0,
                prompt: "잠깐 하는 일입니다. 무엇이에요?",
                answer: "아르바이트",
                distractors: ["연봉", "부하", "승진"],
                explanation: "잠깐 또는 정해진 시간에 하는 일은 아르바이트입니다."
            },
            {
                id: "c11-mcq-02",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 1,
                prompt: "일하는 시간입니다. 무엇이에요?",
                answer: "근무 시간",
                distractors: ["휴가 기간", "지원 조건", "대인 관계"],
                explanation: "일하는 시간은 근무 시간입니다."
            },
            {
                id: "c11-mcq-03",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 2,
                prompt: "회사에서 하는 일입니다. 무엇이에요?",
                answer: "업무",
                distractors: ["성별", "연령", "연봉"],
                explanation: "회사에서 맡은 일은 업무입니다."
            },
            {
                id: "c11-mcq-04",
                type: "mcq",
                area: "어휘",
                kind: "뜻 고르기",
                targetSlot: 3,
                prompt: "한 시간 일하고 받는 돈입니다. 무엇이에요?",
                answer: "시급",
                distractors: ["직급", "업무", "휴가"],
                explanation: "한 시간마다 받는 돈은 시급입니다."
            },
            {
                id: "c11-mcq-05",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 0,
                prompt: "약속을 잘 지켜요. 일도 열심히 해요. 어떤 사람이에요?",
                answer: "성실하다",
                distractors: ["시끄럽다", "멀었다", "부담스럽다"],
                explanation: "일을 열심히 하고 약속을 잘 지키면 성실하다라고 합니다."
            },
            {
                id: "c11-mcq-06",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 1,
                prompt: "작은 것도 잘 확인해요. 어떤 사람이에요?",
                answer: "꼼꼼하다",
                distractors: ["급하다", "어색하다", "유명하다"],
                explanation: "작은 것도 잘 확인하면 꼼꼼하다라고 합니다."
            },
            {
                id: "c11-mcq-07",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 2,
                prompt: "동료들과 잘 지내요. 어떤 말이에요?",
                answer: "대인 관계가 원만하다",
                distractors: ["출퇴근 시간이 자유롭다", "연봉이 높다", "휴가가 길다"],
                explanation: "사람들과 잘 지내면 대인 관계가 원만하다라고 합니다."
            },
            {
                id: "c11-mcq-08",
                type: "mcq",
                area: "어휘",
                kind: "문맥 선택",
                targetSlot: 3,
                prompt: "할 수 있는 만큼 열심히 해요. 어떤 말이에요?",
                answer: "최선을 다하다",
                distractors: ["직급이 높다", "업무를 미루다", "성별을 적다"],
                explanation: "아주 열심히 하면 최선을 다하다라고 합니다."
            },
            {
                id: "c11-mcq-09",
                type: "mcq",
                area: "사동",
                kind: "형태 선택",
                targetSlot: 0,
                prompt: "\"먹다\"를 사동으로 바꾸면?",
                answer: "먹이다",
                distractors: ["먹히다", "먹었다", "먹으려면"],
                explanation: "다른 사람이 먹게 하면 먹이다를 씁니다."
            },
            {
                id: "c11-mcq-10",
                type: "mcq",
                area: "사동",
                kind: "형태 선택",
                targetSlot: 1,
                prompt: "\"앉다\"를 사동으로 바꾸면?",
                answer: "앉히다",
                distractors: ["앉기다", "앉리다", "앉우다"],
                explanation: "다른 사람이 앉게 하면 앉히다를 씁니다."
            },
            {
                id: "c11-mcq-11",
                type: "mcq",
                area: "사동",
                kind: "문장 완성",
                targetSlot: 2,
                prompt: "추워요. 아이에게 두꺼운 옷을 ___.",
                answer: "입혔어요",
                distractors: ["입었어요", "입었겠어요", "입잖아요"],
                explanation: "아이에게 옷을 입게 하므로 입혔어요가 맞습니다."
            },
            {
                id: "c11-mcq-12",
                type: "mcq",
                area: "사동",
                kind: "문장 완성",
                targetSlot: 3,
                prompt: "아기가 피곤해요. 일찍 ___.",
                answer: "재웠어요",
                distractors: ["잤어요", "자겠어요", "자는다면"],
                explanation: "아기가 자게 하면 재우다를 씁니다."
            },
            {
                id: "c11-mcq-13",
                type: "mcq",
                area: "-(ㄴ/는)다면",
                kind: "형태 선택",
                targetSlot: 0,
                prompt: "\"가다\"를 -다면으로 바꾸면?",
                answer: "간다면",
                distractors: ["가다면", "가는다면", "가이라면"],
                explanation: "가다 + ㄴ다면 = 간다면입니다."
            },
            {
                id: "c11-mcq-14",
                type: "mcq",
                area: "-다면",
                kind: "형태 선택",
                targetSlot: 1,
                prompt: "\"좋다\"를 -다면으로 바꾸면?",
                answer: "좋다면",
                distractors: ["좋는다면", "좋은다면", "좋이라면"],
                explanation: "좋다 + 다면 = 좋다면입니다."
            },
            {
                id: "c11-mcq-15",
                type: "mcq",
                area: "-(이)라면",
                kind: "형태 선택",
                targetSlot: 2,
                prompt: "\"학생\"에 붙이면?",
                answer: "학생이라면",
                distractors: ["학생라면", "학생다면", "학생은다면"],
                explanation: "학생은 받침이 있어서 학생이라면을 씁니다."
            },
            {
                id: "c11-mcq-16",
                type: "mcq",
                area: "무엇이든지",
                kind: "문장 완성",
                targetSlot: 3,
                prompt: "배고파요. 지금은 ______ 먹을 수 있어요.",
                answer: "무엇이든지",
                distractors: ["누구든지", "어디든지", "아무도"],
                explanation: "아무 음식이나 괜찮을 때 무엇이든지를 씁니다."
            },
            {
                id: "c11-short-17",
                type: "short",
                area: "어휘",
                kind: "단답",
                prompt: "회사에 새로 온 사람은 ______입니다.",
                answers: ["신입 사원", "신입사원"],
                explanation: "회사에 새로 온 사람은 신입 사원입니다."
            },
            {
                id: "c11-short-18",
                type: "short",
                area: "어휘",
                kind: "단답",
                prompt: "부서에서 가장 높은 사람은 보통 ______입니다.",
                answers: ["부장"],
                explanation: "부서에서 가장 높은 사람은 보통 부장입니다."
            },
            {
                id: "c11-short-19",
                type: "short",
                area: "어휘",
                kind: "단답",
                prompt: "1년 동안 받는 돈은 ______입니다.",
                answers: ["연봉"],
                explanation: "1년 동안 받는 돈은 연봉입니다."
            },
            {
                id: "c11-short-20",
                type: "short",
                area: "사동",
                kind: "형태 쓰기",
                prompt: "아이가 밥을 안 먹어요. 제가 조금 ______. (먹다)",
                answers: ["먹였어요", "먹였습니다"],
                explanation: "먹다의 사동은 먹이다이고, 과거형은 먹였어요입니다."
            },
            {
                id: "c11-short-21",
                type: "short",
                area: "사동",
                kind: "형태 쓰기",
                prompt: "선생님이 학생들을 앞자리에 ______. (앉다)",
                answers: ["앉혔어요", "앉혔습니다"],
                explanation: "앉다의 사동은 앉히다이고, 과거형은 앉혔어요입니다."
            },
            {
                id: "c11-short-22",
                type: "short",
                area: "-다면",
                kind: "형태 쓰기",
                prompt: "시간이 ______ 같이 일을 정리해요. (많다)",
                answers: ["많다면"],
                explanation: "많다 + 다면 = 많다면입니다."
            },
            {
                id: "c11-short-23",
                type: "short",
                area: "-(ㄴ/는)다면",
                kind: "형태 쓰기",
                prompt: "그 회사에 ______ 열심히 일하겠습니다. (들어가다)",
                answers: ["들어간다면"],
                explanation: "들어가다 + ㄴ다면 = 들어간다면입니다."
            },
            {
                id: "c11-short-24",
                type: "short",
                area: "무슨 N(이)든지",
                kind: "단답",
                prompt: "저는 ______ 괜찮아요. 일을 주세요. (일)",
                answers: ["무슨 일이든지"],
                explanation: "일을 넓게 말할 때 무슨 일이든지를 씁니다."
            },
            {
                id: "c11-scaffold-25",
                type: "scaffold",
                area: "업무 어휘",
                kind: "비계형",
                prompt: "아르바이트 광고를 2-3문장으로 쓰세요.",
                template: "___ 모집합니다. ___은/는 __입니다. ___은/는 한 시간에 __원입니다.",
                required: [
                    { label: "아르바이트", accepts: ["아르바이트"] },
                    { label: "근무 시간", accepts: ["근무시간"] },
                    { label: "시급", accepts: ["시급"] }
                ],
                example: "카페 아르바이트를 모집합니다. 근무 시간은 오후 2시부터 6시까지입니다. 시급은 시간당 12,000원입니다.",
                placeholder: "광고처럼 짧게 쓰세요.",
                explanation: "광고에는 일, 시간, 돈을 씁니다."
            },
            {
                id: "c11-scaffold-26",
                type: "scaffold",
                area: "역량·태도 어휘",
                kind: "비계형",
                prompt: "좋은 직원을 2-3문장으로 쓰세요.",
                template: "좋은 직원은 ___. 또 ___ 사람입니다. 일할 때 ___.",
                required: [
                    { label: "성실하다", accepts: ["성실"] },
                    { label: "꼼꼼하다", accepts: ["꼼꼼"] },
                    { label: "최선을 다하다", accepts: ["최선을다"] }
                ],
                example: "좋은 직원은 성실합니다. 또한 꼼꼼한 사람입니다. 맡은 일에는 항상 최선을 다합니다.",
                placeholder: "세 표현을 모두 쓰세요.",
                explanation: "좋은 직원의 모습을 쉬운 문장으로 씁니다."
            },
            {
                id: "c11-scaffold-27",
                type: "scaffold",
                area: "사동",
                kind: "비계형",
                prompt: "아이를 돌보는 일을 쓰세요.",
                template: "아침에 아이에게 옷을 ___. 그리고 밥을 ___. 밤에는 일찍 ___.",
                required: [
                    { label: "입다", accepts: ["입혔", "입히"] },
                    { label: "먹다", accepts: ["먹였", "먹이"] },
                    { label: "자다", accepts: ["재웠", "재우"] }
                ],
                example: "아침에 아이에게 옷을 입혔어요. 그리고 밥을 먹였어요. 밤에는 일찍 재웠어요.",
                placeholder: "기본형을 사동 표현으로 바꿔 쓰세요.",
                explanation: "입다, 먹다, 자다를 사동 표현으로 바꿔 씁니다."
            },
            {
                id: "c11-scaffold-28",
                type: "scaffold",
                area: "가정 / 든지",
                kind: "비계형",
                prompt: "새 회사에 들어가면 어떻게 할 거예요?",
                template: "만약 ___다면 __겠습니다. 무슨 ___이든지 __겠습니다.",
                required: [
                    { label: "-다면", accepts: ["다면"] },
                    { label: "무슨 N(이)든지", allOf: ["무슨", "든지"] },
                    { label: "최선을 다하다", accepts: ["최선을다"] }
                ],
                example: "만약 그 회사에 들어간다면 열심히 배우겠습니다. 무슨 일이든지 맡으면 최선을 다하겠습니다.",
                placeholder: "-다면과 -든지를 모두 쓰세요.",
                explanation: "상상하는 일에는 -다면, 아무거나 괜찮을 때는 -든지를 씁니다."
            }
        ]
    };
}());
