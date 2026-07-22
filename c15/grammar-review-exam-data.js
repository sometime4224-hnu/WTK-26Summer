(function () {
    "use strict";

    window.REVIEW_QUIZ_CONFIG = {
        chapter: "15",
        eyebrow: "Lesson 15 Grammar",
        title: "15과 문법 복습 시험",
        titleSuffix: "",
        subtitle: "네 가지 핵심 문법의 형태, 의미, 상황 적용, 오류 구별을 점검합니다.",
        tags: ["V-게 하다", "A/V-(으)ㄹ걸(요)", "A/V-지 않으면 안 되다", "V-는 길에"],
        recommendedMinutes: 15,
        ibtStorageKey: "snu3b.c15.grammarReviewExam.v1",
        links: [
            { href: "index.html", label: "15과 목록" },
            { href: "mock-exam.html", label: "기존 어휘·문법 모의고사" }
        ],
        rightsNote: "서울대 한국어 3B 15과의 네 가지 핵심 문법을 바탕으로 새로 구성한 보조 평가입니다.",
        questions: [
            {
                id: "c15-grammar-exam-01",
                type: "mcq",
                area: "V-게 하다",
                kind: "형태 선택",
                grammarId: "c15-grammar-1",
                targetSlot: 0,
                prompt: "건물 관리자가 수리 기사에게 누수 원인을 확인하도록 했습니다. 빈칸에 알맞은 말은?",
                support: "관리자는 수리 기사에게 누수 원인을 ________.",
                answer: "확인하게 했어요",
                distractors: ["확인했을걸요", "확인하지 않으면 안 돼요", "확인하러 가는 길이에요"],
                explanation: "관리자가 기사에게 확인하도록 했으므로 확인하게 했어요가 맞습니다."
            },
            {
                id: "c15-grammar-exam-02",
                type: "mcq",
                area: "V-게 하다",
                kind: "의미 구별",
                grammarId: "c15-grammar-1",
                targetSlot: 1,
                prompt: "“집주인이 세입자에게 매일 창문을 열게 했어요.”의 뜻으로 가장 알맞은 것은?",
                answer: "집주인이 세입자가 매일 창문을 열도록 했어요.",
                distractors: ["집주인이 매일 세입자의 창문을 열었어요.", "세입자가 집주인에게 창문을 열지 말라고 했어요.", "집주인과 세입자가 창문을 열지 않았어요."],
                explanation: "V-게 하다는 주체가 다른 사람이 그 행동을 하도록 만드는 뜻입니다."
            },
            {
                id: "c15-grammar-exam-03",
                type: "mcq",
                area: "V-게 하다",
                kind: "상황 적용",
                grammarId: "c15-grammar-1",
                targetSlot: 2,
                prompt: "공용 복도에서 자전거를 타지 못하도록 관리인이 규칙을 만들었습니다. 가장 자연스러운 문장은?",
                answer: "관리인은 아이들이 복도에서 자전거를 타지 못하게 했어요.",
                distractors: ["관리인은 아이들이 복도에서 자전거를 탈 거라고 예상했어요.", "관리인은 아이들이 복도에서 자전거를 타지 않으면 안 된다고 했어요.", "복도로 가는 길에 아이들이 자전거를 탔어요."],
                explanation: "행동을 하지 못하도록 막을 때는 V-지 못하게 하다를 씁니다."
            },
            {
                id: "c15-grammar-exam-04",
                type: "mcq",
                area: "V-게 하다",
                kind: "오류 구별",
                grammarId: "c15-grammar-1",
                targetSlot: 3,
                prompt: "주민들은 갑자기 날씨가 추워져서 두꺼운 옷을 입었습니다. 원인과 행동 주체가 자연스럽게 연결된 문장은?",
                answer: "갑작스러운 추위가 주민들에게 두꺼운 옷을 입게 했어요.",
                distractors: ["주민들이 갑작스러운 추위를 입게 했어요.", "두꺼운 옷이 추위에게 주민들을 입게 했어요.", "갑작스러운 추위가 두꺼운 옷에게 주민들을 입게 했어요."],
                explanation: "추위가 원인이고 주민들이 실제로 옷을 입으므로 정답 문장의 역할 관계가 올바릅니다."
            },
            {
                id: "c15-grammar-exam-05",
                type: "mcq",
                area: "A/V-(으)ㄹ걸(요)",
                kind: "형태 선택",
                grammarId: "c15-grammar-2",
                targetSlot: 0,
                prompt: "사진을 보니 침대 하나만 들어갈 것 같아요. ‘좁다’를 사용해 조심스럽게 추측한 말은?",
                answer: "지하층 방은 좁을걸요.",
                distractors: ["지하층 방은 좁게 만들었어요.", "지하층 방은 좁지 않으면 안 돼요.", "지하층 방을 보러 가는 길이에요."],
                explanation: "좁다의 어간 좁-에 -을걸요가 붙어 좁을걸요가 됩니다."
            },
            {
                id: "c15-grammar-exam-06",
                type: "mcq",
                area: "A/V-(으)ㄹ걸(요)",
                kind: "과거 추측",
                grammarId: "c15-grammar-2",
                targetSlot: 1,
                prompt: "관리실 문이 잠겨 있고 점검 도구도 없어요. 기사가 이미 점검을 끝냈다고 추측할 때 알맞은 말은?",
                answer: "수리 기사가 벌써 점검을 마쳤을걸요.",
                distractors: ["수리 기사가 벌써 점검을 마치게 했어요.", "수리 기사가 점검을 마치지 않으면 안 돼요.", "수리 기사가 점검을 마치는 길에 왔어요."],
                explanation: "이미 끝난 일을 추측할 때는 마치다의 과거형에 -을걸요를 붙입니다."
            },
            {
                id: "c15-grammar-exam-07",
                type: "mcq",
                area: "A/V-(으)ㄹ걸(요)",
                kind: "의미 구별",
                grammarId: "c15-grammar-2",
                targetSlot: 2,
                prompt: "“이번 달 수도 요금은 지난달보다 적게 나올걸요.”에 들어 있는 말하는 사람의 태도는?",
                answer: "근거를 바탕으로 확신하지 않고 예상해요.",
                distractors: ["이미 확인한 정보를 단정적으로 알려 줘요.", "수도 요금을 반드시 줄이라고 명령해요.", "수도 요금을 줄이는 중의 이동 경로를 말해요."],
                explanation: "-(으)ㄹ걸(요)는 상황을 보고 확신하지 않은 상태에서 부드럽게 추측하는 표현입니다."
            },
            {
                id: "c15-grammar-exam-08",
                type: "mcq",
                area: "A/V-(으)ㄹ걸(요)",
                kind: "상황 적용",
                grammarId: "c15-grammar-2",
                targetSlot: 3,
                prompt: "친구가 “토요일 아침에 경기장 근처 도로가 막힐까?”라고 묻습니다. 근처에서 큰 마라톤 대회가 열릴 예정일 때 알맞은 답은?",
                answer: "대회가 있으니까 경기장 근처는 많이 막힐걸요.",
                distractors: ["대회가 있으니까 관계자가 도로를 막히게 했어요.", "대회가 있으니까 도로가 막히지 않으면 안 돼요.", "경기장에 가는 길에 도로가 막혔어요."],
                explanation: "대회 일정을 근거로 교통 상황을 추측하므로 많이 막힐걸요가 알맞습니다."
            },
            {
                id: "c15-grammar-exam-09",
                type: "mcq",
                area: "A/V-지 않으면 안 되다",
                kind: "형태 선택",
                grammarId: "c15-grammar-3",
                targetSlot: 0,
                prompt: "퇴실 전에 해야 하는 일을 ‘반납하다’로 표현하려고 합니다. 빈칸에 알맞은 말은?",
                support: "계약이 끝나면 열쇠를 ________.",
                answer: "반납하지 않으면 안 돼요",
                distractors: ["반납할걸요", "반납하게 했어요", "반납하러 가는 길이에요"],
                explanation: "반드시 반납해야 함을 나타낼 때 반납하지 않으면 안 돼요를 씁니다."
            },
            {
                id: "c15-grammar-exam-10",
                type: "mcq",
                area: "A/V-지 않으면 안 되다",
                kind: "의미 구별",
                grammarId: "c15-grammar-3",
                targetSlot: 1,
                prompt: "“관리실 연락처를 저장하지 않으면 안 됩니다.”의 뜻으로 가장 가까운 것은?",
                answer: "관리실 연락처를 반드시 저장해야 합니다.",
                distractors: ["관리실 연락처를 저장하면 안 됩니다.", "관리실 연락처를 아마 저장할 것 같습니다.", "관리실로 가는 길에 연락처를 저장합니다."],
                explanation: "-지 않으면 안 되다는 해당 행동이 꼭 필요하다는 의무를 나타냅니다."
            },
            {
                id: "c15-grammar-exam-11",
                type: "mcq",
                area: "A/V-지 않으면 안 되다",
                kind: "상황 적용",
                grammarId: "c15-grammar-3",
                targetSlot: 2,
                prompt: "오늘이 원룸 계약의 마지막 날이고, 오늘 안에 열쇠를 돌려줘야 합니다. 가장 자연스러운 말은?",
                answer: "오늘 안에 열쇠를 돌려주지 않으면 안 돼요.",
                distractors: ["오늘 안에 열쇠를 돌려줄걸요.", "오늘 안에 열쇠를 돌려주게 했어요.", "오늘 안에 열쇠를 돌려주러 가는 길이에요."],
                explanation: "계약 만료일에 필수로 해야 하는 일이므로 -지 않으면 안 돼요가 알맞습니다."
            },
            {
                id: "c15-grammar-exam-12",
                type: "mcq",
                area: "A/V-지 않으면 안 되다",
                kind: "오류 구별",
                grammarId: "c15-grammar-3",
                targetSlot: 3,
                prompt: "공과금 납부일을 잊지 않으려고 달력에 반드시 적어 두어야 합니다. 의미가 맞는 문장은?",
                answer: "납부일을 달력에 적어 두지 않으면 안 돼요.",
                distractors: ["납부일을 달력에 적어 두면 안 돼요.", "납부일을 달력에 적어 둘걸요.", "납부일을 달력에 적어 두게 했어요."],
                explanation: "반드시 적어 두어야 하므로 적어 두지 않으면 안 돼요가 맞습니다."
            },
            {
                id: "c15-grammar-exam-13",
                type: "mcq",
                area: "V-는 길에",
                kind: "상황 적용",
                grammarId: "c15-grammar-4",
                targetSlot: 0,
                prompt: "마트로 이동하는 도중에 세탁소에 들러 옷을 찾았습니다. 가장 자연스러운 문장은?",
                answer: "마트에 가는 길에 세탁소에서 옷을 찾았어요.",
                distractors: ["마트에 간 뒤 세탁소에서 옷을 찾았어요.", "마트에 가려면 세탁소에서 옷을 찾아야 해요.", "세탁소 직원이 저를 마트에 가게 했어요."],
                explanation: "마트로 가는 이동 경로 중에 세탁소에 들렀으므로 V-는 길에가 맞습니다."
            },
            {
                id: "c15-grammar-exam-14",
                type: "mcq",
                area: "V-는 길에",
                kind: "의미 구별",
                grammarId: "c15-grammar-4",
                targetSlot: 1,
                prompt: "“도서관에 가는 길에 우체국에서 소포를 보냈어요.”의 뜻으로 가장 가까운 것은?",
                answer: "도서관으로 이동하는 도중에 우체국에 들렀어요.",
                distractors: ["도서관에 도착한 뒤 하루 종일 우체국에 있었어요.", "도서관에 가려면 소포를 반드시 보내야 해요.", "우체국 직원이 도서관에 가도록 했어요."],
                explanation: "V-는 길에는 어떤 곳으로 가거나 오는 도중에 다른 일을 하는 뜻입니다."
            },
            {
                id: "c15-grammar-exam-15",
                type: "mcq",
                area: "V-는 길에",
                kind: "오류 구별",
                grammarId: "c15-grammar-4",
                targetSlot: 2,
                prompt: "다음 중 실제 이동 경로가 분명해서 V-는 길에가 자연스러운 문장은?",
                answer: "친구를 만나러 가는 길에 꽃집에서 꽃을 샀어요.",
                distractors: ["점심을 먹는 길에 음식이 맛있었어요.", "잠을 자는 길에 꿈을 꾸었어요.", "회의가 끝나는 길에 의견을 말했어요."],
                explanation: "친구를 만나러 가는 실제 이동 도중에 꽃집에 들렀으므로 정답 문장이 자연스럽습니다."
            }
        ]
    };
}());
