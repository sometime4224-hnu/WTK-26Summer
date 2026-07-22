(function () {
    "use strict";

    window.REVIEW_QUIZ_CONFIG = {
        chapter: "14",
        eyebrow: "14과 문법 복습 시험",
        title: "14과 문법 복습 시험",
        titleSuffix: "",
        subtitle: "네 가지 문법의 형태와 쓰임을 15문제로 확인합니다.",
        tags: ["문법 1~4", "15문항", "4지선다"],
        recommendedMinutes: 15,
        ibtStorageKey: "snu3b.c14.grammarReviewExam.v1",
        links: [
            { href: "index.html", label: "14과 목록" },
            { href: "mock-exam.html", label: "기존 통합 시험" }
        ],
        rightsNote: "서울대 한국어 3B 14과 학습 목표를 바탕으로 새로 구성한 보조 문제입니다.",
        questions: [
            {
                id: "c14-grammar-review-01",
                type: "mcq",
                area: "하도 A/V-아서/어서",
                kind: "의미 구별",
                grammarId: "grammar1",
                targetSlot: 0,
                prompt: "‘하도 A/V-아서/어서’가 나타내는 관계로 알맞은 것을 고르세요.",
                answer: "정도가 매우 심해서 어떤 결과가 생긴다.",
                distractors: [
                    "과거에 했던 일을 지금 떠올린다.",
                    "두 가지 상태가 함께 점점 달라진다.",
                    "다른 사람이 느끼는 감정을 관찰한다."
                ],
                explanation: "‘하도’는 정도가 매우 심하고 그 때문에 뒤의 결과가 생겼음을 강조합니다."
            },
            {
                id: "c14-grammar-review-02",
                type: "mcq",
                area: "하도 A/V-아서/어서",
                kind: "형태 선택",
                grammarId: "grammar1",
                targetSlot: 1,
                prompt: "빈칸에 들어갈 알맞은 말을 고르세요.\n눈이 하도 ______ 길이 막혔어요.",
                answer: "많이 와서",
                distractors: ["많이 오면", "많이 왔던", "많이 와할수록"],
                explanation: "‘오다’는 ‘와서’로 활용하여 심한 정도와 그 결과를 연결합니다."
            },
            {
                id: "c14-grammar-review-03",
                type: "mcq",
                area: "하도 A/V-아서/어서",
                kind: "상황 적용",
                grammarId: "grammar1",
                targetSlot: 2,
                prompt: "‘왜 목이 쉬었어요?’에 가장 자연스러운 대답을 고르세요.",
                answer: "어제 응원을 하도 크게 해서 목소리가 잘 안 나와요.",
                distractors: [
                    "어제 응원을 크게 했던 목소리예요.",
                    "어제 응원을 크게 해할수록 목소리가 나와요.",
                    "어제 응원을 크게 해해서 친구가 힘들어해요."
                ],
                explanation: "응원을 매우 크게 한 원인과 목이 쉰 결과가 자연스럽게 이어집니다."
            },
            {
                id: "c14-grammar-review-04",
                type: "mcq",
                area: "하도 A/V-아서/어서",
                kind: "오류 찾기",
                grammarId: "grammar1",
                targetSlot: 3,
                prompt: "‘하도 A/V-아서/어서’를 어색하게 쓴 문장을 고르세요.",
                answer: "비가 하도 많이 오아서 길이 막혔어요.",
                distractors: [
                    "음악이 하도 커서 잠을 못 잤어요.",
                    "버스를 하도 오래 기다려서 다리가 아팠어요.",
                    "방이 하도 어두워서 글씨가 안 보였어요."
                ],
                explanation: "‘오다’는 ‘-아서/어서’와 결합할 때 ‘오아서’가 아니라 ‘와서’로 활용합니다."
            },
            {
                id: "c14-grammar-review-05",
                type: "mcq",
                area: "A/V-았던/었던",
                kind: "의미 구별",
                grammarId: "grammar2",
                targetSlot: 0,
                prompt: "‘어릴 때 살았던 집’의 뜻으로 알맞은 것을 고르세요.",
                answer: "과거에 산 경험을 떠올리며 그 집을 설명한다.",
                distractors: [
                    "지금 살고 있는 집의 모습을 설명한다.",
                    "앞으로 살 집을 예상해서 설명한다.",
                    "집이 달라질수록 생기는 결과를 설명한다."
                ],
                explanation: "‘살았던’은 과거의 경험을 떠올리며 뒤의 명사 ‘집’을 꾸밉니다."
            },
            {
                id: "c14-grammar-review-06",
                type: "mcq",
                area: "A/V-았던/었던",
                kind: "형태 선택",
                grammarId: "grammar2",
                targetSlot: 1,
                prompt: "‘예전에 우리 가족을 돕다’라는 기억으로 이웃을 설명하세요.",
                answer: "우리 가족을 도왔던 이웃",
                distractors: [
                    "우리 가족을 돕았던 이웃",
                    "우리 가족을 도와하는 이웃",
                    "우리 가족을 도우면 이웃"
                ],
                explanation: "‘돕다’는 과거 회상 관형형에서 ‘도왔던’으로 활용합니다."
            },
            {
                id: "c14-grammar-review-07",
                type: "mcq",
                area: "A/V-았던/었던",
                kind: "상황 적용",
                grammarId: "grammar2",
                targetSlot: 2,
                prompt: "책장을 정리하다 작년에 끝까지 읽은 소설을 발견했습니다. 가장 자연스러운 말을 고르세요.",
                answer: "작년에 끝까지 읽었던 소설이 여기 있었네요.",
                distractors: [
                    "작년에 끝까지 읽을 소설이 여기 있었네요.",
                    "작년에 끝까지 읽어하는 소설이 여기 있었네요.",
                    "작년에 끝까지 읽으면 읽을수록 소설이 여기 있었네요."
                ],
                explanation: "이미 끝난 독서 경험 속 대상을 떠올리므로 ‘읽었던 소설’이 알맞습니다."
            },
            {
                id: "c14-grammar-review-08",
                type: "mcq",
                area: "A/V-았던/었던",
                kind: "오류 찾기",
                grammarId: "grammar2",
                targetSlot: 3,
                prompt: "A/V-았던/었던의 형태가 잘못된 문장을 고르세요.",
                answer: "지난주에 가었던 식당이 다시 생각나요.",
                distractors: [
                    "어릴 때 작았던 방이 지금은 넓어 보여요.",
                    "전에 자주 들었던 노래를 다시 찾았어요.",
                    "작년에 배웠던 표현을 오늘 사용했어요."
                ],
                explanation: "‘가다’는 ‘가었던’이 아니라 줄어든 형태인 ‘갔던’을 씁니다."
            },
            {
                id: "c14-grammar-review-09",
                type: "mcq",
                area: "A-아/어하다",
                kind: "의미 구별",
                grammarId: "grammar3",
                targetSlot: 0,
                prompt: "‘동생이 외로워해요’에서 ‘-어하다’를 쓴 이유를 고르세요.",
                answer: "말하는 사람이 다른 사람의 감정을 관찰해서 말하기 때문이다.",
                distractors: [
                    "말하는 사람 자신의 감정을 직접 말하기 때문이다.",
                    "과거에 느꼈던 감정을 명사 앞에서 꾸미기 때문이다.",
                    "감정의 정도가 점점 커지는 것을 비교하기 때문이다."
                ],
                explanation: "다른 사람인 동생의 감정을 관찰해 말할 때 ‘외로워하다’를 씁니다."
            },
            {
                id: "c14-grammar-review-10",
                type: "mcq",
                area: "A-아/어하다",
                kind: "형태 선택",
                grammarId: "grammar3",
                targetSlot: 1,
                prompt: "‘기쁘다’를 A-아/어하다 형태로 바꾼 것을 고르세요.",
                answer: "기뻐하다",
                distractors: ["기쁘해하다", "기뻐해하다", "기뻤던"],
                explanation: "‘기쁘다’는 ‘ㅡ’가 탈락한 ‘기뻐’에 ‘하다’를 붙여 ‘기뻐하다’가 됩니다."
            },
            {
                id: "c14-grammar-review-11",
                type: "mcq",
                area: "A-아/어하다",
                kind: "상황 적용",
                grammarId: "grammar3",
                targetSlot: 2,
                prompt: "강아지가 낯선 소리를 듣고 침대 밑으로 숨었습니다. 알맞은 문장을 고르세요.",
                answer: "강아지가 낯선 소리를 무서워해서 숨었어요.",
                distractors: [
                    "제가 낯선 소리를 무서워해서 강아지예요.",
                    "강아지가 낯선 소리를 무서웠던 숨었어요.",
                    "강아지가 낯선 소리를 무서우면 무서울수록 숨었어요."
                ],
                explanation: "관찰한 강아지의 감정과 그 결과를 ‘무서워해서’로 연결할 수 있습니다."
            },
            {
                id: "c14-grammar-review-12",
                type: "mcq",
                area: "A-아/어하다",
                kind: "오류 찾기",
                grammarId: "grammar3",
                targetSlot: 3,
                prompt: "감정을 나타내는 방식이 어색한 문장을 고르세요.",
                answer: "저는 가족이 보고 싶어해요.",
                distractors: [
                    "제 친구는 시험 결과를 궁금해해요.",
                    "아이들이 긴 여행을 지루해했어요.",
                    "저는 오늘 정말 행복해요."
                ],
                explanation: "자기 자신의 마음은 보통 ‘저는 가족이 보고 싶어요’처럼 직접 말합니다."
            },
            {
                id: "c14-grammar-review-13",
                type: "mcq",
                area: "A/V-(으)면 A/V-(으)ㄹ수록",
                kind: "의미 구별",
                grammarId: "grammar4",
                targetSlot: 0,
                prompt: "‘연습하면 연습할수록 발음이 자연스러워져요’의 뜻을 고르세요.",
                answer: "연습의 양이 늘면서 발음도 더 자연스러워진다.",
                distractors: [
                    "연습을 끝낸 뒤 과거의 발음을 떠올린다.",
                    "연습이 너무 힘들어서 발음을 포기한다.",
                    "다른 사람이 연습을 싫어하는지 관찰한다."
                ],
                explanation: "한쪽의 정도가 커질수록 다른 상태도 함께 달라지는 비례 관계입니다."
            },
            {
                id: "c14-grammar-review-14",
                type: "mcq",
                area: "A/V-(으)면 A/V-(으)ㄹ수록",
                kind: "형태 선택",
                grammarId: "grammar4",
                targetSlot: 1,
                prompt: "빈칸에 들어갈 알맞은 말을 고르세요.\n날씨가 ______ 따뜻한 차를 더 자주 마셔요.",
                answer: "추우면 추울수록",
                distractors: ["추우면 춥수록", "추웠던", "하도 추워해서"],
                explanation: "‘춥다’는 ‘추우면 추울수록’으로 활용하고 같은 어간을 반복합니다."
            },
            {
                id: "c14-grammar-review-15",
                type: "mcq",
                area: "A/V-(으)면 A/V-(으)ㄹ수록",
                kind: "오류 찾기",
                grammarId: "grammar4",
                targetSlot: 2,
                prompt: "A/V-(으)면 A/V-(으)ㄹ수록을 잘못 쓴 문장을 고르세요.",
                answer: "책을 읽으면 들을수록 생각이 많아져요.",
                distractors: [
                    "대화하면 대화할수록 자신감이 생겨요.",
                    "길이 좁으면 좁을수록 천천히 가야 해요.",
                    "시간이 지나면 지날수록 기억이 선명해져요."
                ],
                explanation: "앞뒤에 같은 어간을 반복해야 하므로 ‘읽으면 읽을수록’이 맞습니다."
            }
        ]
    };
}());
