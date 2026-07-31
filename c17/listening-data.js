(function () {
    "use strict";

    const lessons = [
        {
            id: "track85",
            compactSample: {
                removeDictoglossSection: true
            },
            label: "Track 85",
            audioTrackNumber: 85,
            title: "듣기 1: 운전 습관과 교통사고",
            summary: "뉴스 보도를 듣고 여성 운전자에 대한 고정관념과 실제 교통사고 원인을 구분하며, 사고의 원인이 성별이 아니라 운전 습관이라는 점을 정리합니다.",
            grammarLink: {
                href: "grammar4.html",
                title: "문법 연결",
                label: "N(이)라고 해서 다 A/V-는 것은 아니다",
                description: "듣기 지문에 나온 '여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다'처럼 일반화된 생각을 조심스럽게 반박하는 표현을 복습합니다."
            },
            audioSrc: null,
            audioSourceType: "original",
            activityImage: {
                src: "../assets/c17/listening/images/lesson17-listening1-cuts-optimized.webp?v=20260510-track85-new-source",
                alt: "운전 습관과 교통사고 뉴스 흐름을 정리한 10컷 컷툰",
                pendingLabel: "듣기 1 컷툰 이미지를 불러오는 중입니다.",
                pendingHint: "뉴스 흐름에 맞춰 정렬한 교재 소스 컷툰입니다.",
                caption: "새 이미지 소스를 10컷으로 분할해 본문 진행에 맞춰 구성했습니다."
            },
            syncVisual: {
                imageSrc: "../assets/c17/listening/images/lesson17-listening1-cuts-optimized.webp?v=20260510-track85-new-source",
                title: "컷툰으로 듣기 흐름 보기",
                copy: "Track 85를 재생하면 뉴스 흐름에 맞춰 컷이 한 장씩 넘어갑니다.",
                aspectRatio: "3.2 / 1",
                transitionMs: 0,
                frames: [
                    { start: 0, end: 6.34, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "뉴스 도입", caption: "여성이 남성보다 운전을 못하고 사고를 자주 내는지 질문을 던집니다." },
                    { start: 6.34, end: 13.19, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "오해 제기", caption: "뉴스를 보는 사람들의 고정관념이 오해였다고 이어 말합니다." },
                    { start: 13.19, end: 21.77, x: 0, y: 627, width: 1254, height: 627, label: "3", title: "사고 통계", caption: "남성 운전자의 사고가 여성 운전자보다 다섯 배 이상 많다는 통계가 나옵니다." },
                    { start: 21.77, end: 25.32, x: 1254, y: 627, width: 1254, height: 627, label: "4", title: "기자 연결", caption: "앵커가 기자에게 보도를 넘깁니다." },
                    { start: 25.32, end: 32.88, x: 0, y: 1254, width: 1254, height: 627, label: "5", title: "주차 장면", caption: "마트에서 힘들게 주차하는 여성 운전자를 남성이 답답하게 바라봅니다." },
                    { start: 32.88, end: 40.73, x: 1254, y: 1254, width: 1254, height: 627, label: "6", title: "경적 소리", caption: "기다리지 못하고 경적을 누르는 남성의 장면으로 이어집니다." },
                    { start: 40.73, end: 50.05, x: 0, y: 1881, width: 1254, height: 627, label: "7", title: "고정관념 반박", caption: "주차가 힘들다고 해서 사고를 많이 내는 것은 아니라고 설명합니다." },
                    { start: 50.05, end: 55.17, x: 1254, y: 1881, width: 1254, height: 627, label: "8", title: "남자도 예외 아님", caption: "남자라고 해서 누구나 주차를 잘하는 것도 아니라고 덧붙입니다." },
                    { start: 55.17, end: 64.41, x: 0, y: 2508, width: 1254, height: 627, label: "9", title: "안전 운전", caption: "여성 운전자는 조금 느려도 안전하게 운전하는 것을 중요하게 생각합니다." },
                    { start: 64.41, end: 79.38, x: 1254, y: 2508, width: 1254, height: 627, label: "10", title: "위험한 습관", caption: "속도를 높이거나 신호를 지키지 않는 남성 운전자들의 사고 원인을 보여 줍니다." },
                    { start: 79.38, end: 81.59, x: 0, y: 3135, width: 1254, height: 627, label: "11", title: "원인 확인", caption: "교통사고의 원인을 다시 짚기 시작합니다." },
                    { start: 81.59, end: 85.72, x: 1254, y: 3135, width: 1254, height: 627, label: "12", title: "성별보다 습관", caption: "사고의 원인은 남녀 차이가 아니라 운전 습관이라고 정리합니다." },
                    { start: 85.72, end: 87.48, x: 0, y: 3762, width: 1254, height: 627, label: "13", title: "안전이 실력", caption: "안전하게 운전하는 것이 운전을 제일 잘하는 것이라고 말합니다." },
                    { start: 87.48, end: 89.34, x: 1254, y: 3762, width: 1254, height: 627, label: "14", title: "보도 마무리", caption: "마지막 컷에서 보도의 핵심 메시지를 정리합니다." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황: 운전 실력에 대한 고정관념을 바로잡는 뉴스",
                caption: "앵커와 기자가 여성 운전자가 사고를 더 많이 낸다는 생각이 오해였다고 설명하고, 실제 원인을 운전 습관에서 찾습니다.",
                tags: ["뉴스", "여성 운전자", "교통사고", "운전 습관"]
            },
            preListening: {
                vocab: [
                    { ko: "운전이 서툴다", hint: "운전을 잘하지 못하다" },
                    { ko: "교통사고", hint: "차나 사람이 길에서 부딪혀 생기는 사고" },
                    { ko: "경적을 누르다", hint: "차의 소리 장치를 누르다" },
                    { ko: "속도를 높이다", hint: "더 빨리 가다" },
                    { ko: "신호를 지키다", hint: "빨간불, 초록불 같은 교통 신호를 따르다" },
                    { ko: "운전 습관", hint: "운전할 때 자주 하는 행동 방식" }
                ],
                relationshipOptions: [
                    { value: "anchor-reporter", label: "앵커와 기자" },
                    { value: "friends", label: "친구 사이" },
                    { value: "doctor-patient", label: "의사와 환자" }
                ],
                relationshipAnswer: "anchor-reporter",
                genreOptions: [
                    { value: "news", label: "뉴스 보도" },
                    { value: "consultation", label: "상담 대화" },
                    { value: "advertisement", label: "광고" }
                ],
                genreAnswer: "news",
                predictionNote: "듣기 전에 '여자가 운전을 못한다'는 말이 사실인지, 기자가 어떤 근거로 설명하는지 예상해 보세요.",
                backgroundPrompt: "운전을 잘한다는 것은 빨리 가는 것일까요, 안전하게 가는 것일까요?"
            },
            transcript: [
                { speaker: "앵커", text: "정말 여자는 남자보다 운전을 못하고", start: 0.00, end: 2.42, keywords: ["여자", "운전"] },
                { speaker: "앵커", text: "사고를 자주 낼까요?", start: 3.89, end: 4.86, keywords: ["사고"] },
                { speaker: "앵커", text: "지금 뉴스를 보고 계신 분들 중에도", start: 5.14, end: 6.34, keywords: ["뉴스"] },
                { speaker: "앵커", text: "여자는 운전이 서툴다고 생각하는 분들이 있을 텐데요.", start: 7.38, end: 10.13, keywords: ["여자", "운전이 서툴다"] },
                { speaker: "앵커", text: "모두 오해였던 것 같습니다.", start: 10.53, end: 12.03, keywords: ["오해"] },
                { speaker: "앵커", text: "지난해 일어난 교통사고를 보니", start: 13.19, end: 15.57, keywords: ["교통사고"] },
                { speaker: "앵커", text: "남성 운전자가 여성 운전자보다", start: 16.05, end: 19.34, keywords: ["남성 운전자", "여성 운전자"] },
                { speaker: "앵커", text: "다섯 배 이상 사고를 많이 냈습니다.", start: 19.84, end: 21.77, keywords: ["다섯 배 이상", "사고"] },
                { speaker: "앵커", text: "김지연 기자가 전해 드립니다.", start: 22.86, end: 24.90, keywords: ["김지연 기자"] },
                { speaker: "기자", text: "마트에서 힘들게 주차하고 있는 여성 운전자를 한 남성이 답답해하며 바라보고 있습니다.", start: 25.32, end: 30.27, keywords: ["마트", "주차", "여성 운전자"] },
                { speaker: "기자", text: "기다리지 못하고", start: 31.08, end: 32.88, keywords: ["기다리지 못하고"] },
                { speaker: "기자", text: "경적을 누르는 남성도 있습니다.", start: 33.92, end: 39.86, keywords: ["경적", "남성"] },
                { speaker: "기자", text: "하지만 여성 운전자가 주차를 힘들어 한다고 해서", start: 40.73, end: 43.64, keywords: ["여성 운전자", "주차"] },
                { speaker: "기자", text: "사고를 많이 내는 것은 아닙니다.", start: 44.65, end: 50.05, keywords: ["사고", "아닙니다"] },
                { speaker: "기자", text: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", start: 51.01, end: 54.14, keywords: ["남자라고 해서", "누구나", "주차"] },
                { speaker: "기자", text: "실제로 여성 운전자는 조금 느리게 가도 안전하게 운전하는 것을 중요하게 생각한다고 합니다.", start: 55.17, end: 61.49, keywords: ["여성 운전자", "안전하게", "중요하게"] },
                { speaker: "기자", text: "그래서 사고를 많이 내지 않습니다.", start: 62.36, end: 64.41, keywords: ["사고"] },
                { speaker: "기자", text: "자신이 운전을 잘한다고 생각해서 속도를 높이거나 빨리 가기 위해 신호를 지키지 않는", start: 65.47, end: 74.50, keywords: ["속도를 높이다", "빨리 가다", "신호"] },
                { speaker: "기자", text: "남성 운전자들이 사고를 더 자주 낸다고 합니다.", start: 75.53, end: 79.00, keywords: ["남성 운전자", "사고"] },
                { speaker: "기자", text: "교통사고의 원인은", start: 79.38, end: 80.77, keywords: ["교통사고의 원인"] },
                { speaker: "기자", text: "남성과 여성의 차이 때문이 아니라 운전 습관 때문입니다.", start: 81.59, end: 85.00, keywords: ["차이 때문이 아니라", "운전 습관"] },
                { speaker: "기자", text: "안전하게 운전하는 것이 운전을 제일 잘하는 것입니다.", start: 85.72, end: 87.48, keywords: ["안전하게", "운전을 잘하는 것"] }
            ],
            publicCues: [
                { speaker: "앵커", start: 0, end: 24.90, keywords: ["여자는 운전이 서툴다?", "오해", "남성 운전자 사고"], extraKeywords: ["뉴스 도입"] },
                { speaker: "기자", start: 40.73, end: 54.14, keywords: ["주차를 힘들어 한다고 해서", "사고를 많이 내는 것은 아니다"], extraKeywords: ["고정관념 반박"] },
                { speaker: "기자", start: 79.38, end: 87.48, keywords: ["성별 차이 때문이 아니라", "운전 습관 때문"], extraKeywords: ["결론"] }
            ],
            dictogloss: {
                prompt: "뉴스가 반박한 오해, 실제 통계, 교통사고의 진짜 원인을 3문장으로 정리해 보세요.",
                keywords: ["운전이 서툴다", "오해", "남성 운전자", "다섯 배 이상", "운전 습관", "안전하게 운전하다"],
                modelSummary: "여성 운전자가 남성보다 사고를 더 많이 낸다는 생각은 오해였습니다. 지난해 교통사고를 보면 남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈습니다. 교통사고의 원인은 성별 차이가 아니라 속도를 높이거나 신호를 지키지 않는 운전 습관입니다.",
                placeholder: "예: 여성 운전자에 대한 생각은 오해였습니다. 실제로는 남성 운전자가 사고를 더 많이 냈습니다. 사고의 원인은 성별이 아니라 운전 습관입니다."
            },
            sequenceTask: {
                title: "뉴스 내용 흐름 배열",
                guide: "뉴스에서 나온 내용을 순서대로 배열해 보세요.",
                checkLabel: "순서 확인",
                resetLabel: "다시 섞기",
                statusInitial: "항목을 움직여 뉴스의 전개 순서를 맞춰 보세요.",
                statusCorrect: "순서가 맞습니다. 오해 제기에서 실제 원인 설명까지 흐름을 잘 잡았습니다.",
                statusIncorrect: "앵커의 문제 제기 다음에 기자가 어떤 근거와 결론을 말하는지 다시 들어 보세요.",
                items: [
                    { id: "drive-1", label: "여성 운전자가 사고를 자주 낸다는 생각이 오해였다고 말한다." },
                    { id: "drive-2", label: "남성 운전자가 여성 운전자보다 사고를 더 많이 냈다는 통계를 소개한다." },
                    { id: "drive-3", label: "주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아니라고 설명한다." },
                    { id: "drive-4", label: "교통사고의 원인은 성별이 아니라 운전 습관이라고 정리한다." }
                ],
                answerOrder: ["drive-1", "drive-2", "drive-3", "drive-4"]
            },
            notePrompts: {
                keywords: "운전이 서툴다, 오해, 교통사고, 남성 운전자, 여성 운전자, 운전 습관",
                details: "뉴스에서 제시한 통계와 기자의 결론을 나누어 적기",
                questions: "왜 사고의 원인이 성별 차이가 아니라고 했는지 적기",
                cue: "오해 / 통계 / 반박 / 원인 / 결론",
                notes: "고정관념과 실제 원인을 구분해서 메모하기",
                summary: "뉴스 내용을 두 문장으로 요약하기"
            },
            clozeSection: {
                title: "핵심 문장 빈칸 채우기",
                guide: "교재 지문에 나온 핵심 표현을 떠올리며 빈칸을 채워 보세요."
            },
            clozeItems: [
                { sentence: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 _____ 것은 아닙니다.", blank: "내는", hint: "사고를 내다", explanation: "동사 '내다'가 관형형으로 바뀌어 '사고를 많이 내는 것'이 됩니다." },
                { sentence: "남자라고 해서 누구나 주차를 잘하는 _____ 아닙니다.", blank: "것도", hint: "것도 아니다", explanation: "앞 문장에 이어 또 다른 일반화를 반박하므로 '것도 아닙니다'가 자연스럽습니다." },
                { sentence: "교통사고의 원인은 남성과 여성의 차이 때문이 아니라 운전 _____ 때문입니다.", blank: "습관", hint: "원인", explanation: "기자는 사고의 원인을 성별이 아니라 운전 습관이라고 정리합니다." }
            ],
            speakingTask: {
                title: "말하기 출력",
                prompt: "고정관념을 바로 믿지 않고 근거를 들어 반박하는 말을 3~4문장으로 해 보세요.",
                placeholder: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다. 실제로 남성 운전자가 사고를 더 많이 냈습니다. 교통사고의 원인은 성별이 아니라 운전 습관입니다.",
                tips: ["-다고 해서", "것은 아니다", "오해", "실제로", "운전 습관"]
            },
            clarifications: [
                { ko: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다.", use: "하나의 장면만 보고 전체를 판단하지 말라고 할 때 씁니다." },
                { ko: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", use: "성별에 따른 일반화를 반박할 때 씁니다." },
                { ko: "교통사고의 원인은 운전 습관 때문입니다.", use: "뉴스의 결론을 간단히 정리할 때 씁니다." }
            ],
            clarificationPrompt: "고정관념을 듣고 '그렇다고 해서 다 그런 것은 아니다'라는 방식으로 반박해 보세요.",
            clarifyScenario: "예: '외국인이라고 해서 모두 한국 음식을 못 먹는 것은 아닙니다.'처럼 말해 보세요.",
            oralFeatures: [
                { term: "-다고 해서 ... 것은 아니다", type: "일반화 반박", note: "어떤 이유 하나만으로 전체를 판단할 수 없다고 말합니다." },
                { term: "때문이 아니라 ... 때문입니다", type: "원인 정정", note: "틀린 원인을 부정하고 진짜 원인을 제시합니다." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요."
            },
            tfQuestions: [
                { statement: "뉴스는 여성이 남성보다 사고를 더 많이 낸다고 설명했다.", answer: false, explanation: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈다고 했습니다." },
                { statement: "기자는 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아니라고 했다.", answer: true, explanation: "지문에 그대로 나온 핵심 반박 표현입니다." },
                { statement: "기자는 사고의 원인이 성별 차이가 아니라 운전 습관이라고 했다.", answer: true, explanation: "마지막 결론에서 운전 습관 때문이라고 정리했습니다." }
            ],
            quizTitle: "이해 점검",
            quizGuideKo: "뉴스의 핵심 오해, 실제 근거, 결론을 중심으로 정답을 고르세요.",
            questions: [
                {
                    prompt: "뉴스에서 바로잡은 오해는 무엇입니까?",
                    answer: "2",
                    explanation: "여성 운전자가 남성보다 사고를 자주 낸다는 생각이 오해였다고 했습니다.",
                    options: [
                        { value: "1", label: "남성 운전자는 주차를 전혀 못한다." },
                        { value: "2", label: "여성 운전자가 남성보다 사고를 자주 낸다." },
                        { value: "3", label: "교통사고는 모두 신호 때문만 생긴다." }
                    ]
                },
                {
                    prompt: "지난해 교통사고 자료에 따르면 누가 사고를 더 많이 냈습니까?",
                    answer: "1",
                    explanation: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈습니다.",
                    options: [
                        { value: "1", label: "남성 운전자" },
                        { value: "2", label: "여성 운전자" },
                        { value: "3", label: "남성과 여성이 똑같이" }
                    ]
                },
                {
                    prompt: "기자가 말한 교통사고의 진짜 원인은 무엇입니까?",
                    answer: "3",
                    explanation: "성별 차이가 아니라 운전 습관 때문이라고 했습니다.",
                    options: [
                        { value: "1", label: "성별의 차이" },
                        { value: "2", label: "차의 크기" },
                        { value: "3", label: "운전 습관" }
                    ]
                }
            ]
        },
        {
            id: "track86",
            compactSample: {
                removeDictoglossSection: true
            },
            label: "Track 86",
            audioTrackNumber: 86,
            title: "듣기 2: 건강 상식 확인하기",
            summary: "물을 많이 마시는 것, 어두운 곳에서 책을 읽는 것, 커피가 건강에 미치는 영향에 대한 질문과 답을 듣고, 일반적인 속설을 그대로 믿지 않는 표현을 연습합니다.",
            grammarLink: {
                href: "grammar4.html",
                title: "문법 연결",
                label: "A/V-다고 해서 다 A/V-는 것은 아니다",
                description: "듣기 지문에 나온 '물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다'처럼 건강 상식을 일반화하지 않는 표현을 복습합니다."
            },
            audioSrc: null,
            audioSourceType: "original",
            activityImage: {
                src: "../assets/c17/listening/images/lesson17-listening2-cuts-optimized.webp",
                alt: "물, 눈 건강, 커피에 대한 건강 상식 문답을 정리한 18컷 컷툰",
                pendingLabel: "듣기 2 컷툰 이미지를 불러오는 중입니다.",
                pendingHint: "건강 상식 문답 순서에 맞춰 정렬한 교재 소스 컷툰입니다.",
                caption: "교재 이미지의 상·하 컷을 각각 분할해 18컷을 한 컷씩 보도록 구성했습니다."
            },
            syncVisual: {
                imageSrc: "../assets/c17/listening/images/lesson17-listening2-cuts-optimized.webp",
                title: "컷툰으로 듣기 흐름 보기",
                copy: "Track 86을 재생하면 건강 상식 문답 흐름에 맞춰 컷이 한 장씩 넘어갑니다.",
                aspectRatio: "2 / 1",
                transitionMs: 0,
                frames: [
                    { start: 0, end: 6.21, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "물 질문", caption: "남자가 물을 많이 마시는 것이 건강에 좋은지 묻습니다." },
                    { start: 6.21, end: 12.91, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "더 마셔야 할까", caption: "건강을 위해 물을 더 많이 마셔야 하는지 다시 묻습니다." },
                    { start: 12.91, end: 16.29, x: 2508, y: 0, width: 1254, height: 627, label: "3", title: "물의 역할", caption: "박사가 물이 몸에 좋은 것은 맞다고 답합니다." },
                    { start: 16.29, end: 19.99, x: 0, y: 627, width: 1254, height: 627, label: "4", title: "몸의 70%", caption: "우리 몸의 70%가 물로 되어 있다고 설명합니다." },
                    { start: 19.99, end: 26.89, x: 1254, y: 627, width: 1254, height: 627, label: "5", title: "누구나 건강?", caption: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아니라고 말합니다." },
                    { start: 26.89, end: 41.89, x: 2508, y: 627, width: 1254, height: 627, label: "6", title: "8잔 이상 주의", caption: "음식에도 물이 있으므로 하루 8잔 이상은 소화 문제나 배탈을 일으킬 수 있습니다." },
                    { start: 41.89, end: 47.52, x: 0, y: 1254, width: 1254, height: 627, label: "7", title: "눈 질문", caption: "남자가 최근 눈이 많이 나빠졌다고 말합니다." },
                    { start: 47.52, end: 56.26, x: 1254, y: 1254, width: 1254, height: 627, label: "8", title: "어두운 곳에서 책", caption: "친구들이 어두운 곳에서 책을 읽어서 눈이 나빠졌다고 했는지 확인합니다." },
                    { start: 56.26, end: 60.98, x: 2508, y: 1254, width: 1254, height: 627, label: "9", title: "항상 나빠지진 않음", caption: "어두운 곳에서 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 설명합니다." },
                    { start: 60.98, end: 61.62, x: 0, y: 1881, width: 1254, height: 627, label: "10", title: "습관은 고치기", caption: "눈 건강에 좋은 습관은 아니므로 고치는 것이 좋다고 이어집니다." },
                    { start: 61.62, end: 67.13, x: 1254, y: 1881, width: 1254, height: 627, label: "11", title: "습관 점검", caption: "정확한 이유는 검사를 해 봐야 알 수 있다고 말합니다." },
                    { start: 67.13, end: 81.34, x: 2508, y: 1881, width: 1254, height: 627, label: "12", title: "스마트폰과 컴퓨터", caption: "스마트폰이나 컴퓨터를 오래 사용한 것이 원인일 수 있다고 짚습니다." },
                    { start: 81.34, end: 84.13, x: 0, y: 2508, width: 1254, height: 627, label: "13", title: "검진 조언", caption: "병원에 가서 검사를 받아 보라고 조언합니다." },
                    { start: 84.13, end: 84.56, x: 1254, y: 2508, width: 1254, height: 627, label: "14", title: "질문 전환", caption: "눈 건강 답변이 끝나고 커피 질문으로 넘어갑니다." },
                    { start: 84.56, end: 89.07, x: 2508, y: 2508, width: 1254, height: 627, label: "15", title: "커피 질문", caption: "남자가 커피를 아주 좋아한다고 말합니다." },
                    { start: 89.07, end: 91.72, x: 0, y: 3135, width: 1254, height: 627, label: "16", title: "몸에 안 좋다?", caption: "커피가 몸에 안 좋다는 말이 사실인지 묻습니다." },
                    { start: 91.72, end: 98.84, x: 1254, y: 3135, width: 1254, height: 627, label: "17", title: "2~3잔은 괜찮음", caption: "설탕이나 크림이 없는 커피는 하루 2~3잔이면 건강에 좋을 수 있습니다." },
                    { start: 98.84, end: 105.45, x: 2508, y: 3135, width: 1254, height: 627, label: "18", title: "예방과 다이어트", caption: "암 예방과 다이어트에 도움이 될 수 있으니 걱정하지 않아도 된다고 말합니다." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황: 건강 상식에 대한 질문과 답",
                caption: "남자가 물, 눈 건강, 커피에 대해 질문하고 박사가 잘못 알려진 건강 상식을 설명해 줍니다.",
                tags: ["건강", "물", "눈", "커피", "검사"]
            },
            preListening: {
                vocab: [
                    { ko: "소화가 잘 안되다", hint: "먹은 음식이 잘 내려가지 않다" },
                    { ko: "배탈이 나다", hint: "배가 아프거나 속이 불편하다" },
                    { ko: "눈이 나빠지다", hint: "시력이 떨어지다" },
                    { ko: "검사를 받다", hint: "병원에서 상태를 확인하다" },
                    { ko: "예방하다", hint: "나쁜 일이 생기기 전에 막다" },
                    { ko: "다이어트에 도움이 되다", hint: "살을 빼거나 몸을 관리하는 데 좋다" }
                ],
                relationshipOptions: [
                    { value: "host-expert", label: "진행자와 박사" },
                    { value: "friends", label: "친구 사이" },
                    { value: "clerk-customer", label: "직원과 손님" }
                ],
                relationshipAnswer: "host-expert",
                genreOptions: [
                    { value: "health-qa", label: "건강 상담/문답" },
                    { value: "traffic-news", label: "교통 뉴스" },
                    { value: "travel-plan", label: "여행 계획" }
                ],
                genreAnswer: "health-qa",
                predictionNote: "물, 어두운 곳에서 책 읽기, 커피에 대해 무엇이 사실이고 무엇이 오해인지 예상해 보세요.",
                backgroundPrompt: "건강에 좋다고 들은 말이 항상 모든 사람에게 맞을까요?"
            },
            transcript: [
                { speaker: "남", text: "박사님, 물을 많이 마시는 게 건강에 좋다고 하는데", start: 0.00, end: 2.42, keywords: ["물을 많이 마시다", "건강"] },
                { speaker: "남", text: "그게 사실인가요?", start: 3.91, end: 6.21, keywords: ["사실"] },
                { speaker: "남", text: "전 물을 별로 안 마시는데 건강을 위해서 더 많이 마셔야 할까요?", start: 7.32, end: 12.91, keywords: ["물을 별로 안 마시다", "더 많이"] },
                { speaker: "여", text: "물이 우리 몸에 좋은 것은 맞습니다.", start: 13.78, end: 15.84, keywords: ["물", "좋은 것"] },
                { speaker: "여", text: "우리 몸의 70%가 물로 되어 있고요.", start: 16.29, end: 18.91, keywords: ["70%", "물"] },
                { speaker: "여", text: "그런데 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", start: 19.99, end: 26.03, keywords: ["많이 마신다고 해서", "누구나", "건강해지는 것은 아닙니다"] },
                { speaker: "여", text: "우리가 평소에 먹는 음식에도 물이 들어 있기 때문에", start: 26.89, end: 31.53, keywords: ["음식", "물"] },
                { speaker: "여", text: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있습니다.", start: 32.18, end: 41.89, keywords: ["8잔 이상", "소화", "배탈"] },
                { speaker: "남", text: "질문이 하나 더 있는데요.", start: 42.92, end: 44.47, keywords: ["질문"] },
                { speaker: "남", text: "제가 요즘 눈이 많이 나빠졌어요.", start: 45.05, end: 47.52, keywords: ["눈", "나빠졌어요"] },
                { speaker: "남", text: "그런데 친구들이 제가 어두운 곳에서 책을 읽어서 나빠진 거래요.", start: 48.24, end: 53.51, keywords: ["어두운 곳", "책", "나빠진"] },
                { speaker: "남", text: "정말 그런가요?", start: 54.20, end: 55.08, keywords: ["정말"] },
                { speaker: "여", text: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", start: 56.26, end: 60.98, keywords: ["읽는다고 해서", "언제나", "아닙니다"] },
                { speaker: "여", text: "물론 눈 건강에 좋은 습관은 아니니까 고치시는 게 좋겠지요?", start: 61.62, end: 66.39, keywords: ["눈 건강", "습관", "고치다"] },
                { speaker: "여", text: "검사를 해 봐야 알겠지만 어두운 곳에서 책을 읽어서가 아니라", start: 67.13, end: 76.19, keywords: ["검사", "읽어서가 아니라"] },
                { speaker: "여", text: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 겁니다.", start: 76.85, end: 80.28, keywords: ["스마트폰", "컴퓨터", "오랜 시간"] },
                { speaker: "여", text: "병원에 가셔서 검사를 한번 받아 보시는 게 좋겠습니다.", start: 81.34, end: 84.13, keywords: ["병원", "검사"] },
                { speaker: "남", text: "그리고 저는 커피를 아주 좋아하는데 커피가 몸에 안 좋다고 들었어요. 정말이에요?", start: 84.56, end: 91.16, keywords: ["커피", "몸에 안 좋다", "정말"] },
                { speaker: "여", text: "커피가 건강에 나쁘다니요.", start: 91.72, end: 94.33, keywords: ["나쁘다니요"] },
                { speaker: "여", text: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.", start: 94.56, end: 98.22, keywords: ["설탕", "크림", "2~3잔", "건강에 좋습니다"] },
                { speaker: "여", text: "암을 예방할 수 있고 다이어트에도 도움을 주니까", start: 98.84, end: 101.94, keywords: ["암", "예방", "다이어트"] },
                { speaker: "여", text: "걱정하지 않으셔도 됩니다.", start: 102.15, end: 103.65, keywords: ["걱정하지 않다"] }
            ],
            publicCues: [
                { speaker: "남", start: 0, end: 12.91, keywords: ["물을 많이 마시다", "건강"], extraKeywords: ["첫 번째 질문"] },
                { speaker: "여", start: 19.99, end: 41.89, keywords: ["누구나 다 건강해지는 것은 아니다", "8잔 이상", "배탈"], extraKeywords: ["물에 대한 답"] },
                { speaker: "여", start: 56.26, end: 84.13, keywords: ["언제나 눈이 나빠지는 건 아니다", "스마트폰", "검사"], extraKeywords: ["눈 건강"] },
                { speaker: "여", start: 91.72, end: 103.65, keywords: ["커피가 건강에 나쁘다니요", "2~3잔", "건강에 좋다"], extraKeywords: ["커피"] }
            ],
            dictogloss: {
                prompt: "물, 눈 건강, 커피에 대한 세 가지 질문과 답을 각각 한 문장씩 정리해 보세요.",
                keywords: ["물을 많이 마시다", "8잔 이상", "어두운 곳", "스마트폰", "커피", "2~3잔"],
                modelSummary: "물을 많이 마시는 것이 건강에 좋지만 누구나 많이 마셔야 하는 것은 아니며 8잔 이상 마시면 배탈이 날 수도 있습니다. 어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니고 스마트폰이나 컴퓨터를 오래 사용한 것이 원인일 수 있습니다. 설탕이나 크림이 없는 커피를 하루 2~3잔 마시면 오히려 건강에 좋을 수 있습니다.",
                placeholder: "예: 물은 몸에 좋지만 너무 많이 마시면 배탈이 날 수 있습니다. 눈이 나빠진 것은 스마트폰이나 컴퓨터 때문일 수 있습니다. 설탕이나 크림이 없는 커피는 하루 2~3잔 정도 마시면 건강에 좋습니다."
            },
            sequenceTask: {
                title: "건강 정보 흐름 배열",
                guide: "대화에서 다룬 건강 정보를 나온 순서대로 배열해 보세요.",
                checkLabel: "순서 확인",
                resetLabel: "다시 섞기",
                statusInitial: "항목을 움직여 질문과 답의 순서를 맞춰 보세요.",
                statusCorrect: "순서가 맞습니다. 물, 눈, 커피의 흐름을 잘 정리했습니다.",
                statusIncorrect: "첫 질문이 물에 대한 내용이었다는 점부터 다시 들어 보세요.",
                items: [
                    { id: "health-1", label: "물을 많이 마시는 것이 항상 누구에게나 좋은 것은 아니라고 설명한다." },
                    { id: "health-2", label: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 말한다." },
                    { id: "health-3", label: "스마트폰이나 컴퓨터를 오래 사용한 것이 눈이 나빠진 원인일 수 있다고 말한다." },
                    { id: "health-4", label: "설탕이나 크림이 없는 커피는 하루 2~3잔 정도 마시면 건강에 좋을 수 있다고 말한다." }
                ],
                answerOrder: ["health-1", "health-2", "health-3", "health-4"]
            },
            notePrompts: {
                keywords: "물, 건강, 8잔 이상, 어두운 곳, 스마트폰, 컴퓨터, 커피, 2~3잔",
                details: "각 건강 상식의 사실과 오해를 나누어 적기",
                questions: "무엇이 항상 맞는 말은 아니라고 했는지 적기",
                cue: "질문 / 일반적인 생각 / 박사의 답 / 주의점",
                notes: "세 주제인 물, 눈, 커피를 표처럼 나누어 메모하기",
                summary: "세 가지 건강 상식을 한 문장씩 요약하기"
            },
            clozeSection: {
                title: "핵심 문장 빈칸 채우기",
                guide: "교재 지문에 나온 일반화 반박 표현을 완성해 보세요."
            },
            clozeItems: [
                { sentence: "물을 많이 마신다고 해서 누구나 다 _____ 것은 아닙니다.", blank: "건강해지는", hint: "건강해지다", explanation: "동사 '건강해지다'가 관형형으로 바뀌어 '건강해지는 것'이 됩니다." },
                { sentence: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 _____ 건 아닙니다.", blank: "나빠지는", hint: "눈이 나빠지다", explanation: "'언제나'와 함께 항상 그런 것은 아니라는 뜻을 나타냅니다." },
                { sentence: "커피가 건강에 _____니요.", blank: "나쁘다", hint: "A-다니요", explanation: "믿기 어려운 말을 듣고 되물을 때 '나쁘다니요'처럼 말합니다." }
            ],
            speakingTask: {
                title: "말하기 출력",
                prompt: "건강 상식을 하나 골라 '그렇다고 해서 항상 그런 것은 아니다'라는 방식으로 설명해 보세요.",
                placeholder: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다. 음식을 통해서도 물을 섭취하기 때문에 8잔 이상 마시면 배탈이 날 수도 있습니다.",
                tips: ["-다고 해서", "누구나 다", "언제나", "것은 아니다", "오히려"]
            },
            clarifications: [
                { ko: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", use: "건강 상식을 모든 사람에게 일반화하지 말라고 할 때 씁니다." },
                { ko: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", use: "항상 그런 것은 아니라는 점을 설명할 때 씁니다." },
                { ko: "커피가 건강에 나쁘다니요.", use: "들은 말이 뜻밖이거나 사실과 다르다고 생각할 때 되묻습니다." }
            ],
            clarificationPrompt: "물, 눈, 커피 중 하나를 골라 잘못 알려진 상식을 바로잡아 보세요.",
            clarifyScenario: "예: '커피가 건강에 나쁘다니요. 설탕이나 크림이 들어가지 않은 커피는 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.'",
            oralFeatures: [
                { term: "-다고 해서 ... 것은 아니다", type: "일반화 반박", note: "어떤 조건이 있어도 항상 같은 결과가 생기는 것은 아니라고 말합니다." },
                { term: "-다니요", type: "놀람 되묻기", note: "들은 말이 의외일 때 짧게 반응합니다." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요."
            },
            tfQuestions: [
                { statement: "박사는 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아니라고 했다.", answer: true, explanation: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있다고 했습니다." },
                { statement: "박사는 눈이 나빠진 원인이 스마트폰이나 컴퓨터를 오래 사용한 것일 수 있다고 했다.", answer: true, explanation: "어두운 곳에서 책을 읽어서가 아니라 스마트폰이나 컴퓨터를 오래 사용해서 나빠졌을 거라고 했습니다." },
                { statement: "박사는 설탕이나 크림이 없는 커피도 마시면 안 된다고 했다.", answer: false, explanation: "그런 커피는 하루 2~3잔 정도 마시면 오히려 건강에 좋다고 했습니다." }
            ],
            quizTitle: "이해 점검",
            quizGuideKo: "세 가지 건강 정보의 질문과 답을 중심으로 정답을 고르세요.",
            questions: [
                {
                    prompt: "물을 하루에 8잔 이상 마시면 어떤 문제가 생길 수도 있습니까?",
                    answer: "2",
                    explanation: "소화가 잘 안되거나 배탈이 날 수도 있다고 했습니다.",
                    options: [
                        { value: "1", label: "눈이 바로 좋아진다." },
                        { value: "2", label: "소화가 잘 안되거나 배탈이 날 수 있다." },
                        { value: "3", label: "커피를 마실 수 없게 된다." }
                    ]
                },
                {
                    prompt: "박사는 남자의 눈이 나빠진 원인으로 무엇을 말했습니까?",
                    answer: "1",
                    explanation: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 거라고 했습니다.",
                    options: [
                        { value: "1", label: "스마트폰이나 컴퓨터를 오래 사용한 것" },
                        { value: "2", label: "물을 너무 적게 마신 것" },
                        { value: "3", label: "커피를 마시지 않은 것" }
                    ]
                },
                {
                    prompt: "박사가 건강에 좋다고 한 커피는 어떤 커피입니까?",
                    answer: "3",
                    explanation: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 좋다고 했습니다.",
                    options: [
                        { value: "1", label: "설탕과 크림이 많이 들어간 커피" },
                        { value: "2", label: "하루에 8잔 이상 마시는 커피" },
                        { value: "3", label: "설탕이나 크림이 들어가지 않은 커피" }
                    ]
                }
            ]
        }
    ];

    function cloneLesson(lesson) {
        return JSON.parse(JSON.stringify(lesson));
    }

    const track85PreciseCutFrames = [
        { start: 0, end: 13.06, x: 0, y: 0, width: 1254, height: 392, label: "1", title: "뉴스 도입", caption: "안내 멘트가 끝난 뒤 앵커가 여성 운전자에 대한 고정관념과 사고 여부를 질문합니다." },
        { start: 13.06, end: 22.48, x: 1254, y: 0, width: 1254, height: 392, label: "2", title: "오해 바로잡기", caption: "뉴스를 보는 사람들의 생각을 짚고 모두 오해였던 것 같다고 말합니다." },
        { start: 22.48, end: 30.94, x: 0, y: 392, width: 1254, height: 392, label: "3", title: "사고 통계", caption: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈다는 통계를 제시합니다." },
        { start: 30.94, end: 33.78, x: 1254, y: 392, width: 1254, height: 392, label: "4", title: "기자 연결", caption: "김지연 기자가 마트 현장에서 보도를 이어 갑니다." },
        { start: 33.78, end: 40.70, x: 0, y: 784, width: 1254, height: 392, label: "5", title: "마트 주차 장면", caption: "마트에서 힘들게 주차하는 여성 운전자를 남성이 답답해하며 바라봅니다." },
        { start: 40.70, end: 44.52, x: 1254, y: 784, width: 1254, height: 392, label: "6", title: "경적을 누르는 남성", caption: "기다리지 못한 남성이 경적을 누르는 장면으로 이어집니다." },
        { start: 44.52, end: 65.44, x: 0, y: 1176, width: 1254, height: 392, label: "7", title: "안전 운전", caption: "주차가 힘들다고 사고를 많이 내는 것은 아니며 여성 운전자는 안전 운전을 중요하게 생각한다고 설명합니다." },
        { start: 65.44, end: 75.30, x: 1254, y: 1176, width: 1254, height: 392, label: "8", title: "위험한 운전 습관", caption: "속도를 높이거나 신호를 지키지 않는 운전 습관이 사고를 더 자주 낸다고 말합니다." },
        { start: 75.30, end: 81.12, x: 0, y: 1568, width: 1254, height: 392, label: "9", title: "원인은 운전 습관", caption: "교통사고의 원인은 성별 차이가 아니라 운전 습관이라고 정리합니다." },
        { start: 81.12, end: 89.55, x: 1254, y: 1568, width: 1254, height: 392, label: "10", title: "안전 운전 결론", caption: "안전하게 운전하는 것이 운전을 제일 잘하는 것이라고 마무리합니다." }
    ];

    const track85PreciseTranscript = [
        { speaker: "앵커", text: "정말 여자는 남자보다 운전을 못하고 사고를 자주 낼까요?", start: 6.84, end: 11.80, keywords: ["여자", "남자보다", "사고"] },
        { speaker: "앵커", text: "지금 뉴스를 보고 계신 분들 중에도 여자는 운전이 서툴다고 생각하는 분들이 있을 텐데요.", start: 13.06, end: 19.28, keywords: ["여자는", "운전이 서툴다"] },
        { speaker: "앵커", text: "모두 오해였던 것 같습니다.", start: 19.78, end: 21.48, keywords: ["오해"] },
        { speaker: "앵커", text: "지난해 일어난 교통사고를 보니 남성 운전자가 여성 운전자보다 5배 이상 사고를 많이 냈습니다.", start: 22.48, end: 30.14, keywords: ["교통사고", "남성 운전자", "5배 이상"] },
        { speaker: "앵커", text: "김지연 기자가 전해 드립니다.", start: 30.94, end: 32.82, keywords: ["기자"] },
        { speaker: "기자", text: "마트에서 힘들게 주차하고 있는 여성 운전자를 한 남성이 답답해하며 바라보고 있습니다.", start: 33.78, end: 39.54, keywords: ["마트", "주차", "답답해하며"] },
        { speaker: "기자", text: "기다리지 못하고 경적을 누르는 남성도 있습니다.", start: 40.70, end: 43.34, keywords: ["경적"] },
        { speaker: "기자", text: "하지만 여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다.", start: 44.52, end: 50.00, keywords: ["주차", "사고", "것은 아닙니다"] },
        { speaker: "기자", text: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", start: 51.00, end: 54.24, keywords: ["남자라고 해서", "누구나", "아닙니다"] },
        { speaker: "기자", text: "실제로 여성 운전자는 조금 느리게 가도 안전하게 운전하는 것을 중요하게 생각한다고 합니다.", start: 54.58, end: 61.28, keywords: ["여성 운전자", "안전하게 운전"] },
        { speaker: "기자", text: "그래서 사고를 많이 내지 않습니다.", start: 62.28, end: 64.30, keywords: ["사고", "많이 내지 않습니다"] },
        { speaker: "기자", text: "자신이 운전을 잘한다고 생각해서 속도를 높이거나 빨리 가기 위해 신호를 지키지 않는 남성 운전자들이 사고를 더 자주 낸다고 합니다.", start: 65.44, end: 74.30, keywords: ["속도", "신호", "사고"] },
        { speaker: "기자", text: "교통사고의 원인은 남성과 여성의 차이 때문이 아니라 운전 습관 때문입니다.", start: 75.30, end: 80.74, keywords: ["원인", "차이", "운전 습관"] },
        { speaker: "기자", text: "안전하게 운전하는 것이 운전을 제일 잘하는 것입니다.", start: 81.12, end: 84.82, keywords: ["안전하게 운전", "제일 잘하는 것"] },
        { speaker: "기자", text: "지금까지 김지연이었습니다.", start: 85.60, end: 87.36, keywords: ["김지연"] }
    ];

    const track85PrecisePublicCues = [
        { speaker: "앵커", start: 6.84, end: 21.48, keywords: ["여자는 운전이 서툴다", "오해"], extraKeywords: ["도입", "고정관념"] },
        { speaker: "앵커", start: 22.48, end: 32.82, keywords: ["교통사고", "5배 이상", "김지연 기자"], extraKeywords: ["통계"] },
        { speaker: "기자", start: 33.78, end: 43.34, keywords: ["마트", "주차", "경적"], extraKeywords: ["현장"] },
        { speaker: "기자", start: 44.52, end: 64.30, keywords: ["사고를 많이 내는 것은 아닙니다", "안전하게 운전"], extraKeywords: ["반박"] },
        { speaker: "기자", start: 65.44, end: 80.74, keywords: ["속도", "신호", "운전 습관"], extraKeywords: ["원인"] },
        { speaker: "기자", start: 81.12, end: 87.36, keywords: ["안전하게 운전", "제일 잘하는 것"], extraKeywords: ["결론"] }
    ];

    const track86PreciseCutFrames = [
        { start: 0, end: 13.78, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "물 질문 시작", caption: "안내 멘트가 끝난 뒤 남자가 물을 많이 마시는 것이 건강에 좋은지 묻습니다." },
        { start: 13.78, end: 19.99, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "더 마셔야 할까", caption: "물을 별로 안 마시는데 건강을 위해 더 많이 마셔야 하는지 다시 묻습니다." },
        { start: 19.99, end: 23.34, x: 2508, y: 0, width: 1254, height: 627, label: "3", title: "물은 몸에 좋다", caption: "박사가 물이 우리 몸에 좋은 것은 맞다고 답합니다." },
        { start: 23.34, end: 26.89, x: 0, y: 627, width: 1254, height: 627, label: "4", title: "몸의 70%", caption: "우리 몸의 70%가 물로 되어 있다고 설명합니다." },
        { start: 26.89, end: 32.18, x: 1254, y: 627, width: 1254, height: 627, label: "5", title: "많다고 다 좋은 건 아님", caption: "물을 많이 마신다고 해서 누구나 건강해지는 것은 아니라고 바로잡습니다." },
        { start: 32.18, end: 42.92, x: 2508, y: 627, width: 1254, height: 627, label: "6", title: "8잔 이상 주의", caption: "음식에도 물이 들어 있으므로 하루 8잔 이상 마시면 소화가 안 되거나 배탈이 날 수 있다고 말합니다." },
        { start: 42.92, end: 48.24, x: 0, y: 1254, width: 1254, height: 627, label: "7", title: "눈 질문", caption: "남자가 질문을 하나 더 하며 요즘 눈이 많이 나빠졌다고 말합니다." },
        { start: 48.24, end: 54.2, x: 1254, y: 1254, width: 1254, height: 627, label: "8", title: "어두운 곳에서 책", caption: "친구들이 어두운 곳에서 책을 읽어서 눈이 나빠졌다고 했다는 말을 전합니다." },
        { start: 54.2, end: 56.26, x: 2508, y: 1254, width: 1254, height: 627, label: "9", title: "정말 그런가요", caption: "남자가 정말 어두운 곳에서 책을 읽어서 눈이 나빠진 것인지 확인합니다." },
        { start: 56.26, end: 61.62, x: 0, y: 1881, width: 1254, height: 627, label: "10", title: "언제나 그런 건 아님", caption: "박사가 어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 답합니다." },
        { start: 61.62, end: 67.13, x: 1254, y: 1881, width: 1254, height: 627, label: "11", title: "좋은 습관은 아님", caption: "그래도 눈 건강에 좋은 습관은 아니므로 고치는 게 좋다고 덧붙입니다." },
        { start: 67.13, end: 76.85, x: 2508, y: 1881, width: 1254, height: 627, label: "12", title: "스마트폰과 컴퓨터", caption: "어두운 곳에서 책을 읽어서가 아니라 스마트폰이나 컴퓨터를 오래 사용해서 눈이 나빠졌을 거라고 설명합니다." },
        { start: 76.85, end: 81.34, x: 0, y: 2508, width: 1254, height: 627, label: "13", title: "병원 검사", caption: "병원에 가서 검사를 받아 보는 게 좋겠다고 권합니다." },
        { start: 81.34, end: 87.32, x: 1254, y: 2508, width: 1254, height: 627, label: "14", title: "커피를 좋아함", caption: "남자가 커피를 아주 좋아하지만 몸에 안 좋다고 들었다고 말합니다." },
        { start: 87.32, end: 89.07, x: 2508, y: 2508, width: 1254, height: 627, label: "15", title: "커피가 나쁜가요", caption: "커피가 정말 몸에 안 좋은지 묻는 질문으로 이어집니다." },
        { start: 89.07, end: 91.72, x: 0, y: 3135, width: 1254, height: 627, label: "16", title: "나쁘다니요", caption: "박사가 커피가 건강에 나쁘다는 말을 되묻습니다." },
        { start: 91.72, end: 98.84, x: 1254, y: 3135, width: 1254, height: 627, label: "17", title: "하루 2~3잔", caption: "설탕이나 크림이 들어가지 않은 커피를 하루 2~3잔 마시면 오히려 건강에 좋다고 말합니다." },
        { start: 98.84, end: 105.45, x: 2508, y: 3135, width: 1254, height: 627, label: "18", title: "예방과 다이어트", caption: "암 예방과 다이어트에도 도움이 되므로 걱정하지 않아도 된다고 마무리합니다." }
    ];

    const track86PreciseTranscript = [
        { speaker: "남", text: "박사님, 물을 많이 마시는 게 건강에 좋다고 하는데", start: 7.32, end: 11.51, keywords: ["물을 많이 마시는 게", "건강"] },
        { speaker: "남", text: "그게 사실인가요?", start: 11.79, end: 12.91, keywords: ["사실"] },
        { speaker: "남", text: "전 물을 별로 안 마시는데 건강을 위해서 더 많이 마셔야 할까요?", start: 13.78, end: 18.91, keywords: ["물을 별로 안 마시는데", "더 많이"] },
        { speaker: "여", text: "물이 우리 몸에 좋은 것은 맞습니다.", start: 19.99, end: 22.66, keywords: ["물", "좋은 것은"] },
        { speaker: "여", text: "우리 몸의 70%가 물로 되어 있고요.", start: 23.34, end: 26.03, keywords: ["70%", "물"] },
        { speaker: "여", text: "그런데 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", start: 26.89, end: 31.53, keywords: ["많이 마신다고 해서", "누구나", "것은 아닙니다"] },
        { speaker: "여", text: "우리가 평소에 먹는 음식에도 물이 들어 있기 때문에", start: 32.18, end: 36.26, keywords: ["음식", "물"] },
        { speaker: "여", text: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있습니다.", start: 36.48, end: 41.89, keywords: ["8잔 이상", "소화", "배탈"] },
        { speaker: "남", text: "질문이 하나 더 있는데요.", start: 42.92, end: 44.47, keywords: ["질문"] },
        { speaker: "남", text: "제가 요즘 눈이 많이 나빠졌어요.", start: 45.05, end: 47.52, keywords: ["눈", "나빠졌어요"] },
        { speaker: "남", text: "그런데 친구들이 제가 어두운 곳에서 책을 읽어서 나빠진 거래요.", start: 48.24, end: 53.51, keywords: ["어두운 곳", "책", "나빠진"] },
        { speaker: "남", text: "정말 그런가요?", start: 54.2, end: 55.08, keywords: ["정말"] },
        { speaker: "여", text: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", start: 56.26, end: 60.98, keywords: ["읽는다고 해서", "언제나", "아닙니다"] },
        { speaker: "여", text: "물론 눈 건강에 좋은 습관은 아니니까 고치시는 게 좋겠지요?", start: 61.62, end: 66.39, keywords: ["눈 건강", "습관", "고치시는"] },
        { speaker: "여", text: "검사를 해 봐야 알겠지만 어두운 곳에서 책을 읽어서가 아니라", start: 67.13, end: 71.51, keywords: ["검사", "읽어서가 아니라"] },
        { speaker: "여", text: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 겁니다.", start: 71.84, end: 76.19, keywords: ["스마트폰", "컴퓨터", "오랜 시간"] },
        { speaker: "여", text: "병원에 가셔서 검사를 한번 받아 보시는 게 좋겠습니다.", start: 76.85, end: 80.28, keywords: ["병원", "검사"] },
        { speaker: "남", text: "그리고 저는 커피를 아주 좋아하는데 커피가 몸에 안 좋다고 들었어요.", start: 81.34, end: 86.71, keywords: ["커피", "몸에 안 좋다"] },
        { speaker: "남", text: "정말이에요?", start: 87.32, end: 87.98, keywords: ["정말"] },
        { speaker: "여", text: "커피가 건강에 나쁘다니요.", start: 89.07, end: 91.16, keywords: ["나쁘다니요"] },
        { speaker: "여", text: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.", start: 91.72, end: 98.22, keywords: ["설탕", "크림", "2~3잔", "건강에 좋습니다"] },
        { speaker: "여", text: "암을 예방할 수 있고 다이어트에도 도움을 주니까", start: 98.84, end: 101.94, keywords: ["암", "예방", "다이어트"] },
        { speaker: "여", text: "걱정하지 않으셔도 됩니다.", start: 102.15, end: 103.65, keywords: ["걱정하지 않다"] }
    ];

    const track86PrecisePublicCues = [
        { speaker: "남", start: 7.32, end: 18.91, keywords: ["물을 많이 마시는 게", "건강", "더 많이 마셔야"], extraKeywords: ["첫 번째 질문"] },
        { speaker: "여", start: 19.99, end: 41.89, keywords: ["누구나 다 건강해지는 것은 아닙니다", "8잔 이상", "배탈"], extraKeywords: ["물에 대한 답"] },
        { speaker: "남", start: 42.92, end: 55.08, keywords: ["눈이 많이 나빠졌어요", "어두운 곳에서 책", "정말 그런가요"], extraKeywords: ["두 번째 질문"] },
        { speaker: "여", start: 56.26, end: 80.28, keywords: ["언제나 눈이 나빠지는 건 아닙니다", "스마트폰", "컴퓨터", "병원"], extraKeywords: ["눈 건강"] },
        { speaker: "남", start: 81.34, end: 87.98, keywords: ["커피", "몸에 안 좋다고", "정말이에요"], extraKeywords: ["세 번째 질문"] },
        { speaker: "여", start: 89.07, end: 103.65, keywords: ["나쁘다니요", "2~3잔", "건강에 좋습니다", "걱정하지"], extraKeywords: ["커피"] }
    ];

    function applyPreciseCutFrames(lesson) {
        if (!lesson || !lesson.syncVisual) return;
        if (lesson.id === "track85") {
            lesson.syncVisual.frames = track85PreciseCutFrames.map((frame) => ({ ...frame }));
            lesson.transcript = track85PreciseTranscript.map((line) => ({ ...line, keywords: [...(line.keywords || [])] }));
            lesson.publicCues = track85PrecisePublicCues.map((cue) => ({ ...cue, keywords: [...(cue.keywords || [])], extraKeywords: [...(cue.extraKeywords || [])] }));
        }
        if (lesson.id === "track86") {
            lesson.syncVisual.frames = track86PreciseCutFrames.map((frame) => ({ ...frame }));
            lesson.transcript = track86PreciseTranscript.map((line) => ({ ...line, keywords: [...(line.keywords || [])] }));
            lesson.publicCues = track86PrecisePublicCues.map((cue) => ({ ...cue, keywords: [...(cue.keywords || [])], extraKeywords: [...(cue.extraKeywords || [])] }));
        }
    }

    lessons.forEach(applyPreciseCutFrames);

    window.C17_LISTENING_LESSONS = lessons;
    window.createC17ListeningWorkbookConfig = function createC17ListeningWorkbookConfig(options) {
        const settings = options || {};
        const requestedIds = Array.isArray(settings.lessonIds) && settings.lessonIds.length ? settings.lessonIds : lessons.map((lesson) => lesson.id);
        const selectedLessons = requestedIds
            .map((id) => lessons.find((lesson) => lesson.id === id))
            .filter(Boolean)
            .map(cloneLesson);
        selectedLessons.forEach(applyPreciseCutFrames);

        return {
            kicker: "Chapter 17 Listening Lab",
            title: settings.title || "17과 듣기",
            description: settings.description || "교재 듣기 지문 Track 85, 86을 바탕으로 고정관념과 건강 상식을 비판적으로 듣고 정리하는 워크북입니다.",
            hideTranslations: true,
            layoutVariant: "audio-in-pre",
            sampleCompact: {
                enabled: true,
                defaults: {
                    hideSceneCard: true,
                    hideFeatureCards: true,
                    hideNoteSection: true,
                    hideOralFeaturesSection: true,
                    hideSpeakingSection: true,
                    moveBackgroundPromptIntoPrediction: true,
                    relocateQuizBelowSubtitle: true,
                    quizStartsCollapsed: true
                }
            },
            instructionLanguage: {
                enabled: false,
                default: "ko"
            },
            theme: {
                accent: "#0f766e",
                accentDark: "#115e59",
                soft: "#ccfbf1",
                surface: "rgba(255,255,255,0.94)",
                pageBackground: "linear-gradient(180deg, #f0fdfa 0%, #f8fafc 48%, #fff7ed 100%)"
            },
            featureList: [
                "상황 예측",
                "핵심어 보기",
                "흐름 배열",
                "빈칸 채우기",
                "이해 점검"
            ],
            lessons: selectedLessons
        };
    };
})();
