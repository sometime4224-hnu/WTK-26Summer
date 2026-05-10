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
            titleVi: "Nghe 1: Thoi quen lai xe va tai nan giao thong",
            summary: "뉴스 보도를 듣고 여성 운전자에 대한 고정관념과 실제 교통사고 원인을 구분하며, 사고의 원인이 성별이 아니라 운전 습관이라는 점을 정리합니다.",
            summaryVi: "Nghe ban tin va phan biet dinh kien ve nguoi lai xe nu voi nguyen nhan tai nan thuc te.",
            grammarLink: {
                href: "grammar4.html",
                title: "문법 연결",
                titleVi: "Lien ket ngu phap",
                label: "N(이)라고 해서 다 A/V-는 것은 아니다",
                labelVi: "Khong phai cu la N thi deu...",
                description: "듣기 지문에 나온 '여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다'처럼 일반화된 생각을 조심스럽게 반박하는 표현을 복습합니다.",
                descriptionVi: "On lai cach phan bac viec ket luan chung nhu 'khong phai cu nhu vay thi deu...'."
            },
            audioSrc: null,
            audioSourceType: "original",
            activityImage: {
                src: "../assets/c17/listening/images/lesson17-listening1-cuts.webp?v=20260510-track85-new-source",
                alt: "운전 습관과 교통사고 뉴스 흐름을 정리한 10컷 컷툰",
                altVi: "Khung 10 tranh tom tat dong ban tin ve thoi quen lai xe va tai nan giao thong",
                pendingLabel: "듣기 1 컷툰 이미지를 불러오는 중입니다.",
                pendingLabelVi: "Dang tai tranh cattoon cho bai nghe 1.",
                pendingHint: "뉴스 흐름에 맞춰 정렬한 교재 소스 컷툰입니다.",
                pendingHintVi: "Tranh cattoon duoc sap xep theo mach ban tin.",
                caption: "새 이미지 소스를 10컷으로 분할해 본문 진행에 맞춰 구성했습니다.",
                captionVi: "Anh moi duoc tach thanh 10 tranh theo mach bai nghe."
            },
            syncVisual: {
                imageSrc: "../assets/c17/listening/images/lesson17-listening1-cuts.webp?v=20260510-track85-new-source",
                title: "컷툰으로 듣기 흐름 보기",
                titleVi: "Xem mach bai nghe bang cattoon",
                copy: "Track 85를 재생하면 뉴스 흐름에 맞춰 컷이 한 장씩 넘어갑니다.",
                copyVi: "Khi phat Track 85, tung tranh se chuyen theo mach ban tin.",
                aspectRatio: "3.2 / 1",
                transitionMs: 0,
                frames: [
                    { start: 0, end: 6.34, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "뉴스 도입", titleVi: "Mo dau ban tin", caption: "여성이 남성보다 운전을 못하고 사고를 자주 내는지 질문을 던집니다.", captionVi: "Dat cau hoi ve dinh kien phu nu lai xe kem va hay gay tai nan." },
                    { start: 6.34, end: 13.19, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "오해 제기", titleVi: "Neu hieu lam", caption: "뉴스를 보는 사람들의 고정관념이 오해였다고 이어 말합니다.", captionVi: "Noi rang dinh kien cua nguoi xem co ve la hieu lam." },
                    { start: 13.19, end: 21.77, x: 0, y: 627, width: 1254, height: 627, label: "3", title: "사고 통계", titleVi: "Thong ke tai nan", caption: "남성 운전자의 사고가 여성 운전자보다 다섯 배 이상 많다는 통계가 나옵니다.", captionVi: "Thong ke cho thay tai xe nam gay tai nan nhieu hon gap hon nam lan." },
                    { start: 21.77, end: 25.32, x: 1254, y: 627, width: 1254, height: 627, label: "4", title: "기자 연결", titleVi: "Noi voi phong vien", caption: "앵커가 기자에게 보도를 넘깁니다.", captionVi: "Nguoi dan chu chuyen sang phong vien." },
                    { start: 25.32, end: 32.88, x: 0, y: 1254, width: 1254, height: 627, label: "5", title: "주차 장면", titleVi: "Canh do xe", caption: "마트에서 힘들게 주차하는 여성 운전자를 남성이 답답하게 바라봅니다.", captionVi: "Mot nguoi nam nhin nguoi phu nu dang kho khan khi do xe." },
                    { start: 32.88, end: 40.73, x: 1254, y: 1254, width: 1254, height: 627, label: "6", title: "경적 소리", titleVi: "Bam coi", caption: "기다리지 못하고 경적을 누르는 남성의 장면으로 이어집니다.", captionVi: "Canh nguoi nam khong doi duoc va bam coi." },
                    { start: 40.73, end: 50.05, x: 0, y: 1881, width: 1254, height: 627, label: "7", title: "고정관념 반박", titleVi: "Phan bac dinh kien", caption: "주차가 힘들다고 해서 사고를 많이 내는 것은 아니라고 설명합니다.", captionVi: "Kho do xe khong co nghia la hay gay tai nan." },
                    { start: 50.05, end: 55.17, x: 1254, y: 1881, width: 1254, height: 627, label: "8", title: "남자도 예외 아님", titleVi: "Nam gioi cung khong phai tat ca", caption: "남자라고 해서 누구나 주차를 잘하는 것도 아니라고 덧붙입니다.", captionVi: "Khong phai cu la nam gioi thi ai cung do xe gioi." },
                    { start: 55.17, end: 64.41, x: 0, y: 2508, width: 1254, height: 627, label: "9", title: "안전 운전", titleVi: "Lai xe an toan", caption: "여성 운전자는 조금 느려도 안전하게 운전하는 것을 중요하게 생각합니다.", captionVi: "Tai xe nu coi trong lai xe an toan du di cham hon." },
                    { start: 64.41, end: 79.38, x: 1254, y: 2508, width: 1254, height: 627, label: "10", title: "위험한 습관", titleVi: "Thoi quen nguy hiem", caption: "속도를 높이거나 신호를 지키지 않는 남성 운전자들의 사고 원인을 보여 줍니다.", captionVi: "Cho thay thoi quen tang toc va khong theo den tin hieu cua mot so tai xe nam." },
                    { start: 79.38, end: 81.59, x: 0, y: 3135, width: 1254, height: 627, label: "11", title: "원인 확인", titleVi: "Xac dinh nguyen nhan", caption: "교통사고의 원인을 다시 짚기 시작합니다.", captionVi: "Bat dau nhac lai nguyen nhan tai nan giao thong." },
                    { start: 81.59, end: 85.72, x: 1254, y: 3135, width: 1254, height: 627, label: "12", title: "성별보다 습관", titleVi: "Thoi quen hon gioi tinh", caption: "사고의 원인은 남녀 차이가 아니라 운전 습관이라고 정리합니다.", captionVi: "Ket luan nguyen nhan la thoi quen lai xe, khong phai gioi tinh." },
                    { start: 85.72, end: 87.48, x: 0, y: 3762, width: 1254, height: 627, label: "13", title: "안전이 실력", titleVi: "An toan la gioi", caption: "안전하게 운전하는 것이 운전을 제일 잘하는 것이라고 말합니다.", captionVi: "Noi lai xe an toan moi la lai xe gioi nhat." },
                    { start: 87.48, end: 89.34, x: 1254, y: 3762, width: 1254, height: 627, label: "14", title: "보도 마무리", titleVi: "Ket thuc ban tin", caption: "마지막 컷에서 보도의 핵심 메시지를 정리합니다.", captionVi: "Khung cuoi tom tat thong diep chinh cua ban tin." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황: 운전 실력에 대한 고정관념을 바로잡는 뉴스",
                titleVi: "Tinh huong: ban tin sua dinh kien ve lai xe",
                caption: "앵커와 기자가 여성 운전자가 사고를 더 많이 낸다는 생각이 오해였다고 설명하고, 실제 원인을 운전 습관에서 찾습니다.",
                captionVi: "Phat thanh vien va phong vien giai thich rang dinh kien ve nguoi lai xe nu la hieu lam.",
                tags: ["뉴스", "여성 운전자", "교통사고", "운전 습관"]
            },
            preListening: {
                vocab: [
                    { ko: "운전이 서툴다", vi: "lai xe chua thanh thao", hint: "운전을 잘하지 못하다" },
                    { ko: "교통사고", vi: "tai nan giao thong", hint: "차나 사람이 길에서 부딪혀 생기는 사고" },
                    { ko: "경적을 누르다", vi: "bam coi xe", hint: "차의 소리 장치를 누르다" },
                    { ko: "속도를 높이다", vi: "tang toc", hint: "더 빨리 가다" },
                    { ko: "신호를 지키다", vi: "tuan thu den tin hieu", hint: "빨간불, 초록불 같은 교통 신호를 따르다" },
                    { ko: "운전 습관", vi: "thoi quen lai xe", hint: "운전할 때 자주 하는 행동 방식" }
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
                predictionNoteVi: "Truoc khi nghe, hay du doan cau noi 'phu nu lai xe kem' co dung khong va phong vien dua ra can cu nao.",
                backgroundPrompt: "운전을 잘한다는 것은 빨리 가는 것일까요, 안전하게 가는 것일까요?",
                backgroundPromptVi: "Lai xe gioi la di nhanh hay di an toan?"
            },
            transcript: [
                { speaker: "앵커", text: "정말 여자는 남자보다 운전을 못하고", vi: "Phu nu co that lai xe kem hon nam gioi khong?", start: 0.00, end: 2.42, keywords: ["여자", "운전"] },
                { speaker: "앵커", text: "사고를 자주 낼까요?", vi: "Va co hay gay tai nan hon khong?", start: 3.89, end: 4.86, keywords: ["사고"] },
                { speaker: "앵커", text: "지금 뉴스를 보고 계신 분들 중에도", vi: "Trong so nhung nguoi dang xem ban tin", start: 5.14, end: 6.34, keywords: ["뉴스"] },
                { speaker: "앵커", text: "여자는 운전이 서툴다고 생각하는 분들이 있을 텐데요.", vi: "co le co nguoi nghi phu nu lai xe chua gioi.", start: 7.38, end: 10.13, keywords: ["여자", "운전이 서툴다"] },
                { speaker: "앵커", text: "모두 오해였던 것 같습니다.", vi: "Tat ca co ve la hieu lam.", start: 10.53, end: 12.03, keywords: ["오해"] },
                { speaker: "앵커", text: "지난해 일어난 교통사고를 보니", vi: "Theo cac vu tai nan giao thong nam ngoai,", start: 13.19, end: 15.57, keywords: ["교통사고"] },
                { speaker: "앵커", text: "남성 운전자가 여성 운전자보다", vi: "tai xe nam so voi tai xe nu", start: 16.05, end: 19.34, keywords: ["남성 운전자", "여성 운전자"] },
                { speaker: "앵커", text: "다섯 배 이상 사고를 많이 냈습니다.", vi: "gay tai nan nhieu hon gap hon nam lan.", start: 19.84, end: 21.77, keywords: ["다섯 배 이상", "사고"] },
                { speaker: "앵커", text: "김지연 기자가 전해 드립니다.", vi: "Phong vien Kim Jiyeon dua tin.", start: 22.86, end: 24.90, keywords: ["김지연 기자"] },
                { speaker: "기자", text: "마트에서 힘들게 주차하고 있는 여성 운전자를 한 남성이 답답해하며 바라보고 있습니다.", vi: "Tai sieu thi, mot nguoi dan ong nhin nguoi phu nu dang kho khan khi do xe.", start: 25.32, end: 30.27, keywords: ["마트", "주차", "여성 운전자"] },
                { speaker: "기자", text: "기다리지 못하고", vi: "Khong doi duoc,", start: 31.08, end: 32.88, keywords: ["기다리지 못하고"] },
                { speaker: "기자", text: "경적을 누르는 남성도 있습니다.", vi: "cung co nguoi nam bam coi.", start: 33.92, end: 39.86, keywords: ["경적", "남성"] },
                { speaker: "기자", text: "하지만 여성 운전자가 주차를 힘들어 한다고 해서", vi: "Nhung khong phai cu phu nu kho do xe", start: 40.73, end: 43.64, keywords: ["여성 운전자", "주차"] },
                { speaker: "기자", text: "사고를 많이 내는 것은 아닙니다.", vi: "thi hay gay tai nan.", start: 44.65, end: 50.05, keywords: ["사고", "아닙니다"] },
                { speaker: "기자", text: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", vi: "Cung khong phai cu la nam gioi thi ai cung do xe gioi.", start: 51.01, end: 54.14, keywords: ["남자라고 해서", "누구나", "주차"] },
                { speaker: "기자", text: "실제로 여성 운전자는 조금 느리게 가도 안전하게 운전하는 것을 중요하게 생각한다고 합니다.", vi: "Thuc te, nguoi lai xe nu coi trong viec lai xe an toan du co di cham hon.", start: 55.17, end: 61.49, keywords: ["여성 운전자", "안전하게", "중요하게"] },
                { speaker: "기자", text: "그래서 사고를 많이 내지 않습니다.", vi: "Vi vay ho khong gay nhieu tai nan.", start: 62.36, end: 64.41, keywords: ["사고"] },
                { speaker: "기자", text: "자신이 운전을 잘한다고 생각해서 속도를 높이거나 빨리 가기 위해 신호를 지키지 않는", vi: "Nguoi nghi minh lai gioi nen tang toc hoac khong tuan thu tin hieu de di nhanh", start: 65.47, end: 74.50, keywords: ["속도를 높이다", "빨리 가다", "신호"] },
                { speaker: "기자", text: "남성 운전자들이 사고를 더 자주 낸다고 합니다.", vi: "la nhung tai xe nam gay tai nan thuong hon.", start: 75.53, end: 79.00, keywords: ["남성 운전자", "사고"] },
                { speaker: "기자", text: "교통사고의 원인은", vi: "Nguyen nhan tai nan giao thong la", start: 79.38, end: 80.77, keywords: ["교통사고의 원인"] },
                { speaker: "기자", text: "남성과 여성의 차이 때문이 아니라 운전 습관 때문입니다.", vi: "khong phai su khac biet nam nu ma la thoi quen lai xe.", start: 81.59, end: 85.00, keywords: ["차이 때문이 아니라", "운전 습관"] },
                { speaker: "기자", text: "안전하게 운전하는 것이 운전을 제일 잘하는 것입니다.", vi: "Lai xe an toan moi la lai xe gioi nhat.", start: 85.72, end: 87.48, keywords: ["안전하게", "운전을 잘하는 것"] }
            ],
            publicCues: [
                { speaker: "앵커", start: 0, end: 24.90, keywords: ["여자는 운전이 서툴다?", "오해", "남성 운전자 사고"], extraKeywords: ["뉴스 도입"] },
                { speaker: "기자", start: 40.73, end: 54.14, keywords: ["주차를 힘들어 한다고 해서", "사고를 많이 내는 것은 아니다"], extraKeywords: ["고정관념 반박"] },
                { speaker: "기자", start: 79.38, end: 87.48, keywords: ["성별 차이 때문이 아니라", "운전 습관 때문"], extraKeywords: ["결론"] }
            ],
            dictogloss: {
                prompt: "뉴스가 반박한 오해, 실제 통계, 교통사고의 진짜 원인을 3문장으로 정리해 보세요.",
                promptVi: "Tom tat bang 3 cau: hieu lam bi phan bac, thong ke thuc te va nguyen nhan that su cua tai nan.",
                keywords: ["운전이 서툴다", "오해", "남성 운전자", "다섯 배 이상", "운전 습관", "안전하게 운전하다"],
                modelSummary: "여성 운전자가 남성보다 사고를 더 많이 낸다는 생각은 오해였습니다. 지난해 교통사고를 보면 남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈습니다. 교통사고의 원인은 성별 차이가 아니라 속도를 높이거나 신호를 지키지 않는 운전 습관입니다.",
                placeholder: "예: 여성 운전자에 대한 생각은 오해였습니다. 실제로는 남성 운전자가 사고를 더 많이 냈습니다. 사고의 원인은 성별이 아니라 운전 습관입니다.",
                placeholderVi: "Vi du: Dinh kien ve nguoi lai xe nu la hieu lam. Thuc te nam gioi gay nhieu tai nan hon. Nguyen nhan la thoi quen lai xe."
            },
            sequenceTask: {
                title: "뉴스 내용 흐름 배열",
                titleVi: "Sap xep mach ban tin",
                guide: "뉴스에서 나온 내용을 순서대로 배열해 보세요.",
                guideVi: "Sap xep noi dung ban tin theo dung thu tu.",
                checkLabel: "순서 확인",
                checkLabelVi: "Kiem tra thu tu",
                resetLabel: "다시 섞기",
                resetLabelVi: "Tron lai",
                statusInitial: "항목을 움직여 뉴스의 전개 순서를 맞춰 보세요.",
                statusInitialVi: "Hay di chuyen cac muc de sap xep dung.",
                statusCorrect: "순서가 맞습니다. 오해 제기에서 실제 원인 설명까지 흐름을 잘 잡았습니다.",
                statusCorrectVi: "Dung thu tu.",
                statusIncorrect: "앵커의 문제 제기 다음에 기자가 어떤 근거와 결론을 말하는지 다시 들어 보세요.",
                statusIncorrectVi: "Hay nghe lai can cu va ket luan cua phong vien.",
                items: [
                    { id: "drive-1", label: "여성 운전자가 사고를 자주 낸다는 생각이 오해였다고 말한다.", labelVi: "Noi rang dinh kien ve phu nu lai xe la hieu lam" },
                    { id: "drive-2", label: "남성 운전자가 여성 운전자보다 사고를 더 많이 냈다는 통계를 소개한다.", labelVi: "Gioi thieu thong ke nam gioi gay tai nan nhieu hon" },
                    { id: "drive-3", label: "주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아니라고 설명한다.", labelVi: "Giai thich kho do xe khong co nghia la hay gay tai nan" },
                    { id: "drive-4", label: "교통사고의 원인은 성별이 아니라 운전 습관이라고 정리한다.", labelVi: "Ket luan nguyen nhan la thoi quen lai xe" }
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
            notePromptsVi: {
                keywords: "Lai xe chua thanh thao, hieu lam, tai nan giao thong, thoi quen lai xe",
                details: "Ghi thong ke va ket luan cua phong vien",
                questions: "Ghi vi sao nguyen nhan khong phai la gioi tinh",
                cue: "Hieu lam / thong ke / phan bac / nguyen nhan / ket luan",
                notes: "Tach dinh kien va nguyen nhan thuc te",
                summary: "Tom tat ban tin bang hai cau"
            },
            clozeSection: {
                title: "핵심 문장 빈칸 채우기",
                titleVi: "Dien vao cau chinh",
                guide: "교재 지문에 나온 핵심 표현을 떠올리며 빈칸을 채워 보세요.",
                guideVi: "Hay dien bieu hien chinh trong bai nghe."
            },
            clozeItems: [
                { sentence: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 _____ 것은 아닙니다.", sentenceVi: "Khong phai cu phu nu kho do xe thi se _____ nhieu tai nan.", blank: "내는", hint: "사고를 내다", hintVi: "gay tai nan", explanation: "동사 '내다'가 관형형으로 바뀌어 '사고를 많이 내는 것'이 됩니다.", explanationVi: "Dong tu dung dang dinh ngu la '내는'." },
                { sentence: "남자라고 해서 누구나 주차를 잘하는 _____ 아닙니다.", sentenceVi: "Cung khong phai cu la nam gioi thi ai cung do xe gioi.", blank: "것도", hint: "것도 아니다", hintVi: "cung khong phai", explanation: "앞 문장에 이어 또 다른 일반화를 반박하므로 '것도 아닙니다'가 자연스럽습니다.", explanationVi: "Dung de phan bac them mot ket luan chung." },
                { sentence: "교통사고의 원인은 남성과 여성의 차이 때문이 아니라 운전 _____ 때문입니다.", sentenceVi: "Nguyen nhan tai nan khong phai do khac biet nam nu ma do ____ lai xe.", blank: "습관", hint: "원인", hintVi: "thoi quen", explanation: "기자는 사고의 원인을 성별이 아니라 운전 습관이라고 정리합니다.", explanationVi: "Phong vien ket luan nguyen nhan la thoi quen lai xe." }
            ],
            speakingTask: {
                title: "말하기 출력",
                titleVi: "Dau ra noi",
                prompt: "고정관념을 바로 믿지 않고 근거를 들어 반박하는 말을 3~4문장으로 해 보세요.",
                promptVi: "Hay noi 3-4 cau de phan bac mot dinh kien bang can cu.",
                placeholder: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다. 실제로 남성 운전자가 사고를 더 많이 냈습니다. 교통사고의 원인은 성별이 아니라 운전 습관입니다.",
                placeholderVi: "Vi du: Khong phai cu phu nu kho do xe thi hay gay tai nan. Thuc te nam gioi gay tai nan nhieu hon. Nguyen nhan la thoi quen lai xe.",
                tips: ["-다고 해서", "것은 아니다", "오해", "실제로", "운전 습관"]
            },
            clarifications: [
                { ko: "여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다.", vi: "Khong phai cu phu nu kho do xe thi hay gay tai nan.", use: "하나의 장면만 보고 전체를 판단하지 말라고 할 때 씁니다.", useVi: "Dung khi khuyen khong nen ket luan chung tu mot canh." },
                { ko: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", vi: "Khong phai cu la nam gioi thi ai cung do xe gioi.", use: "성별에 따른 일반화를 반박할 때 씁니다.", useVi: "Dung de phan bac viec khai quat theo gioi tinh." },
                { ko: "교통사고의 원인은 운전 습관 때문입니다.", vi: "Nguyen nhan tai nan la thoi quen lai xe.", use: "뉴스의 결론을 간단히 정리할 때 씁니다.", useVi: "Dung de tom tat ket luan cua ban tin." }
            ],
            clarificationPrompt: "고정관념을 듣고 '그렇다고 해서 다 그런 것은 아니다'라는 방식으로 반박해 보세요.",
            clarificationPromptVi: "Hay luyen phan bac dinh kien bang mau 'khong phai cu nhu vay thi deu...'.",
            clarifyScenario: "예: '외국인이라고 해서 모두 한국 음식을 못 먹는 것은 아닙니다.'처럼 말해 보세요.",
            oralFeatures: [
                { term: "-다고 해서 ... 것은 아니다", type: "일반화 반박", typeVi: "Phan bac ket luan chung", note: "어떤 이유 하나만으로 전체를 판단할 수 없다고 말합니다.", noteVi: "Noi rang khong the danh gia tat ca chi tu mot ly do." },
                { term: "때문이 아니라 ... 때문입니다", type: "원인 정정", typeVi: "Sua nguyen nhan", note: "틀린 원인을 부정하고 진짜 원인을 제시합니다.", noteVi: "Phu dinh nguyen nhan sai va dua ra nguyen nhan dung." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                titleVi: "Dung hay sai",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요.",
                guideVi: "Neu dung voi noi dung da nghe thi chon O, neu khong thi chon X."
            },
            tfQuestions: [
                { statement: "뉴스는 여성이 남성보다 사고를 더 많이 낸다고 설명했다.", statementVi: "Ban tin noi phu nu gay tai nan nhieu hon nam gioi.", answer: false, explanation: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈다고 했습니다.", explanationVi: "Ban tin noi nam gioi gay tai nan nhieu hon nam gioi gap nam lan." },
                { statement: "기자는 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아니라고 했다.", statementVi: "Phong vien noi kho do xe khong co nghia la hay gay tai nan.", answer: true, explanation: "지문에 그대로 나온 핵심 반박 표현입니다.", explanationVi: "Day la cau phan bac chinh trong bai nghe." },
                { statement: "기자는 사고의 원인이 성별 차이가 아니라 운전 습관이라고 했다.", statementVi: "Phong vien noi nguyen nhan la thoi quen lai xe, khong phai gioi tinh.", answer: true, explanation: "마지막 결론에서 운전 습관 때문이라고 정리했습니다.", explanationVi: "Ket luan la do thoi quen lai xe." }
            ],
            quizTitle: "이해 점검",
            quizTitleVi: "Kiem tra muc do hieu",
            quizGuideKo: "뉴스의 핵심 오해, 실제 근거, 결론을 중심으로 정답을 고르세요.",
            quizGuideVi: "Chon dap an dung dua tren hieu lam, can cu va ket luan cua ban tin.",
            questions: [
                {
                    prompt: "뉴스에서 바로잡은 오해는 무엇입니까?",
                    promptVi: "Hieu lam nao duoc ban tin sua lai?",
                    answer: "2",
                    explanation: "여성 운전자가 남성보다 사고를 자주 낸다는 생각이 오해였다고 했습니다.",
                    explanationVi: "Ban tin noi dinh kien phu nu hay gay tai nan hon la hieu lam.",
                    options: [
                        { value: "1", label: "남성 운전자는 주차를 전혀 못한다.", labelVi: "Nam gioi hoan toan khong do xe duoc" },
                        { value: "2", label: "여성 운전자가 남성보다 사고를 자주 낸다.", labelVi: "Phu nu gay tai nan thuong hon nam gioi" },
                        { value: "3", label: "교통사고는 모두 신호 때문만 생긴다.", labelVi: "Moi tai nan deu chi do tin hieu giao thong" }
                    ]
                },
                {
                    prompt: "지난해 교통사고 자료에 따르면 누가 사고를 더 많이 냈습니까?",
                    promptVi: "Theo du lieu nam ngoai, ai gay tai nan nhieu hon?",
                    answer: "1",
                    explanation: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈습니다.",
                    explanationVi: "Nam gioi gay tai nan nhieu hon phu nu gap hon nam lan.",
                    options: [
                        { value: "1", label: "남성 운전자", labelVi: "Nguoi lai xe nam" },
                        { value: "2", label: "여성 운전자", labelVi: "Nguoi lai xe nu" },
                        { value: "3", label: "남성과 여성이 똑같이", labelVi: "Nam va nu bang nhau" }
                    ]
                },
                {
                    prompt: "기자가 말한 교통사고의 진짜 원인은 무엇입니까?",
                    promptVi: "Nguyen nhan that su cua tai nan la gi?",
                    answer: "3",
                    explanation: "성별 차이가 아니라 운전 습관 때문이라고 했습니다.",
                    explanationVi: "Khong phai gioi tinh ma la thoi quen lai xe.",
                    options: [
                        { value: "1", label: "성별의 차이", labelVi: "Khac biet gioi tinh" },
                        { value: "2", label: "차의 크기", labelVi: "Kich thuoc xe" },
                        { value: "3", label: "운전 습관", labelVi: "Thoi quen lai xe" }
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
            titleVi: "Nghe 2: Kiem tra kien thuc suc khoe",
            summary: "물을 많이 마시는 것, 어두운 곳에서 책을 읽는 것, 커피가 건강에 미치는 영향에 대한 질문과 답을 듣고, 일반적인 속설을 그대로 믿지 않는 표현을 연습합니다.",
            summaryVi: "Nghe hoi dap ve nuoc, doc sach noi toi va ca phe de kiem tra cac thong tin suc khoe thuong gap.",
            grammarLink: {
                href: "grammar4.html",
                title: "문법 연결",
                titleVi: "Lien ket ngu phap",
                label: "A/V-다고 해서 다 A/V-는 것은 아니다",
                labelVi: "Khong phai cu A/V thi deu...",
                description: "듣기 지문에 나온 '물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다'처럼 건강 상식을 일반화하지 않는 표현을 복습합니다.",
                descriptionVi: "On lai cach noi khong nen khai quat hoa cac kien thuc suc khoe."
            },
            audioSrc: null,
            audioSourceType: "original",
            activityImage: {
                src: "../assets/c17/listening/images/lesson17-listening2-cuts.webp",
                alt: "물, 눈 건강, 커피에 대한 건강 상식 문답을 정리한 18컷 컷툰",
                altVi: "Khung 18 tranh tom tat hoi dap ve nuoc, mat va ca phe",
                pendingLabel: "듣기 2 컷툰 이미지를 불러오는 중입니다.",
                pendingLabelVi: "Dang tai tranh cattoon cho bai nghe 2.",
                pendingHint: "건강 상식 문답 순서에 맞춰 정렬한 교재 소스 컷툰입니다.",
                pendingHintVi: "Tranh cattoon duoc sap xep theo thu tu hoi dap suc khoe.",
                caption: "교재 이미지의 상·하 컷을 각각 분할해 18컷을 한 컷씩 보도록 구성했습니다.",
                captionVi: "Moi khung tren/duoi cua anh sach giao khoa duoc tach rieng thanh 18 tranh."
            },
            syncVisual: {
                imageSrc: "../assets/c17/listening/images/lesson17-listening2-cuts.webp",
                title: "컷툰으로 듣기 흐름 보기",
                titleVi: "Xem mach bai nghe bang cattoon",
                copy: "Track 86을 재생하면 건강 상식 문답 흐름에 맞춰 컷이 한 장씩 넘어갑니다.",
                copyVi: "Khi phat Track 86, tung tranh se chuyen theo thu tu hoi dap suc khoe.",
                aspectRatio: "2 / 1",
                transitionMs: 0,
                frames: [
                    { start: 0, end: 6.21, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "물 질문", titleVi: "Hoi ve nuoc", caption: "남자가 물을 많이 마시는 것이 건강에 좋은지 묻습니다.", captionVi: "Nguoi nam hoi uong nhieu nuoc co tot cho suc khoe khong." },
                    { start: 6.21, end: 12.91, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "더 마셔야 할까", titleVi: "Co nen uong hon khong", caption: "건강을 위해 물을 더 많이 마셔야 하는지 다시 묻습니다.", captionVi: "Anh hoi co nen uong nhieu hon vi suc khoe khong." },
                    { start: 12.91, end: 16.29, x: 2508, y: 0, width: 1254, height: 627, label: "3", title: "물의 역할", titleVi: "Vai tro cua nuoc", caption: "박사가 물이 몸에 좋은 것은 맞다고 답합니다.", captionVi: "Bac si noi nuoc tot cho co the la dung." },
                    { start: 16.29, end: 19.99, x: 0, y: 627, width: 1254, height: 627, label: "4", title: "몸의 70%", titleVi: "70 phan tram co the", caption: "우리 몸의 70%가 물로 되어 있다고 설명합니다.", captionVi: "Giai thich khoang 70% co the la nuoc." },
                    { start: 19.99, end: 26.89, x: 1254, y: 627, width: 1254, height: 627, label: "5", title: "누구나 건강?", titleVi: "Ai cung khoe hon?", caption: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아니라고 말합니다.", captionVi: "Khong phai ai uong nhieu nuoc cung khoe hon." },
                    { start: 26.89, end: 41.89, x: 2508, y: 627, width: 1254, height: 627, label: "6", title: "8잔 이상 주의", titleVi: "Can than hon 8 ly", caption: "음식에도 물이 있으므로 하루 8잔 이상은 소화 문제나 배탈을 일으킬 수 있습니다.", captionVi: "Thuc an cung co nuoc, uong hon 8 ly co the kho tieu hoac dau bung." },
                    { start: 41.89, end: 47.52, x: 0, y: 1254, width: 1254, height: 627, label: "7", title: "눈 질문", titleVi: "Hoi ve mat", caption: "남자가 최근 눈이 많이 나빠졌다고 말합니다.", captionVi: "Nguoi nam noi gan day mat minh kem di." },
                    { start: 47.52, end: 56.26, x: 1254, y: 1254, width: 1254, height: 627, label: "8", title: "어두운 곳에서 책", titleVi: "Doc sach o noi toi", caption: "친구들이 어두운 곳에서 책을 읽어서 눈이 나빠졌다고 했는지 확인합니다.", captionVi: "Anh hoi co phai vi doc sach trong toi khong." },
                    { start: 56.26, end: 60.98, x: 2508, y: 1254, width: 1254, height: 627, label: "9", title: "항상 나빠지진 않음", titleVi: "Khong phai luc nao", caption: "어두운 곳에서 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 설명합니다.", captionVi: "Doc o noi toi khong phai luc nao cung lam mat kem." },
                    { start: 60.98, end: 61.62, x: 0, y: 1881, width: 1254, height: 627, label: "10", title: "습관은 고치기", titleVi: "Nen sua thoi quen", caption: "눈 건강에 좋은 습관은 아니므로 고치는 것이 좋다고 이어집니다.", captionVi: "Do khong phai thoi quen tot cho mat nen sua thi tot hon." },
                    { start: 61.62, end: 67.13, x: 1254, y: 1881, width: 1254, height: 627, label: "11", title: "습관 점검", titleVi: "Kiem tra thoi quen", caption: "정확한 이유는 검사를 해 봐야 알 수 있다고 말합니다.", captionVi: "Noi can kiem tra moi biet chinh xac." },
                    { start: 67.13, end: 81.34, x: 2508, y: 1881, width: 1254, height: 627, label: "12", title: "스마트폰과 컴퓨터", titleVi: "Dien thoai va may tinh", caption: "스마트폰이나 컴퓨터를 오래 사용한 것이 원인일 수 있다고 짚습니다.", captionVi: "Dung dien thoai hoac may tinh lau co the la nguyen nhan." },
                    { start: 81.34, end: 84.13, x: 0, y: 2508, width: 1254, height: 627, label: "13", title: "검진 조언", titleVi: "Loi khuyen kiem tra", caption: "병원에 가서 검사를 받아 보라고 조언합니다.", captionVi: "Khuyen den benh vien kiem tra mat." },
                    { start: 84.13, end: 84.56, x: 1254, y: 2508, width: 1254, height: 627, label: "14", title: "질문 전환", titleVi: "Chuyen cau hoi", caption: "눈 건강 답변이 끝나고 커피 질문으로 넘어갑니다.", captionVi: "Ket thuc phan ve mat va chuyen sang cau hoi ve ca phe." },
                    { start: 84.56, end: 89.07, x: 2508, y: 2508, width: 1254, height: 627, label: "15", title: "커피 질문", titleVi: "Hoi ve ca phe", caption: "남자가 커피를 아주 좋아한다고 말합니다.", captionVi: "Nguoi nam noi minh rat thich ca phe." },
                    { start: 89.07, end: 91.72, x: 0, y: 3135, width: 1254, height: 627, label: "16", title: "몸에 안 좋다?", titleVi: "Khong tot cho co the?", caption: "커피가 몸에 안 좋다는 말이 사실인지 묻습니다.", captionVi: "Anh hoi ca phe co that su khong tot cho co the khong." },
                    { start: 91.72, end: 98.84, x: 1254, y: 3135, width: 1254, height: 627, label: "17", title: "2~3잔은 괜찮음", titleVi: "2-3 ly co the tot", caption: "설탕이나 크림이 없는 커피는 하루 2~3잔이면 건강에 좋을 수 있습니다.", captionVi: "Ca phe khong duong va kem, 2-3 ly moi ngay, co the tot cho suc khoe." },
                    { start: 98.84, end: 105.45, x: 2508, y: 3135, width: 1254, height: 627, label: "18", title: "예방과 다이어트", titleVi: "Phong tranh va giam can", caption: "암 예방과 다이어트에 도움이 될 수 있으니 걱정하지 않아도 된다고 말합니다.", captionVi: "No co the giup phong tranh ung thu va ho tro giam can nen khong can lo." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황: 건강 상식에 대한 질문과 답",
                titleVi: "Tinh huong: hoi dap ve kien thuc suc khoe",
                caption: "남자가 물, 눈 건강, 커피에 대해 질문하고 박사가 잘못 알려진 건강 상식을 설명해 줍니다.",
                captionVi: "Nguoi nam hoi ve nuoc, mat va ca phe; chuyen gia giai thich lai thong tin suc khoe.",
                tags: ["건강", "물", "눈", "커피", "검사"]
            },
            preListening: {
                vocab: [
                    { ko: "소화가 잘 안되다", vi: "tieu hoa khong tot", hint: "먹은 음식이 잘 내려가지 않다" },
                    { ko: "배탈이 나다", vi: "dau bung, roi loan tieu hoa", hint: "배가 아프거나 속이 불편하다" },
                    { ko: "눈이 나빠지다", vi: "mat kem di", hint: "시력이 떨어지다" },
                    { ko: "검사를 받다", vi: "di kham, kiem tra", hint: "병원에서 상태를 확인하다" },
                    { ko: "예방하다", vi: "phong tranh", hint: "나쁜 일이 생기기 전에 막다" },
                    { ko: "다이어트에 도움이 되다", vi: "co ich cho viec giam can", hint: "살을 빼거나 몸을 관리하는 데 좋다" }
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
                predictionNoteVi: "Hay du doan thong tin nao ve nuoc, doc sach noi toi va ca phe la dung hay la hieu lam.",
                backgroundPrompt: "건강에 좋다고 들은 말이 항상 모든 사람에게 맞을까요?",
                backgroundPromptVi: "Dieu nghe noi tot cho suc khoe co phai luc nao cung dung voi moi nguoi khong?"
            },
            transcript: [
                { speaker: "남", text: "박사님, 물을 많이 마시는 게 건강에 좋다고 하는데", vi: "Thua bac si, nghe noi uong nhieu nuoc tot cho suc khoe.", start: 0.00, end: 2.42, keywords: ["물을 많이 마시다", "건강"] },
                { speaker: "남", text: "그게 사실인가요?", vi: "Dieu do co dung khong?", start: 3.91, end: 6.21, keywords: ["사실"] },
                { speaker: "남", text: "전 물을 별로 안 마시는데 건강을 위해서 더 많이 마셔야 할까요?", vi: "Toi khong uong nhieu nuoc, vay co nen uong nhieu hon vi suc khoe khong?", start: 7.32, end: 12.91, keywords: ["물을 별로 안 마시다", "더 많이"] },
                { speaker: "여", text: "물이 우리 몸에 좋은 것은 맞습니다.", vi: "Nuoc tot cho co the la dung.", start: 13.78, end: 15.84, keywords: ["물", "좋은 것"] },
                { speaker: "여", text: "우리 몸의 70%가 물로 되어 있고요.", vi: "Khoang 70% co the chung ta la nuoc.", start: 16.29, end: 18.91, keywords: ["70%", "물"] },
                { speaker: "여", text: "그런데 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", vi: "Nhung khong phai ai uong nhieu nuoc cung khoe hon.", start: 19.99, end: 26.03, keywords: ["많이 마신다고 해서", "누구나", "건강해지는 것은 아닙니다"] },
                { speaker: "여", text: "우리가 평소에 먹는 음식에도 물이 들어 있기 때문에", vi: "Vi thuc an hang ngay cung co nuoc,", start: 26.89, end: 31.53, keywords: ["음식", "물"] },
                { speaker: "여", text: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있습니다.", vi: "neu uong hon 8 ly mot ngay, co the kho tieu hoac dau bung.", start: 32.18, end: 41.89, keywords: ["8잔 이상", "소화", "배탈"] },
                { speaker: "남", text: "질문이 하나 더 있는데요.", vi: "Toi con mot cau hoi nua.", start: 42.92, end: 44.47, keywords: ["질문"] },
                { speaker: "남", text: "제가 요즘 눈이 많이 나빠졌어요.", vi: "Gan day mat toi kem di.", start: 45.05, end: 47.52, keywords: ["눈", "나빠졌어요"] },
                { speaker: "남", text: "그런데 친구들이 제가 어두운 곳에서 책을 읽어서 나빠진 거래요.", vi: "Ban be noi do toi doc sach o noi toi.", start: 48.24, end: 53.51, keywords: ["어두운 곳", "책", "나빠진"] },
                { speaker: "남", text: "정말 그런가요?", vi: "Co that khong?", start: 54.20, end: 55.08, keywords: ["정말"] },
                { speaker: "여", text: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", vi: "Khong phai cu doc sach o noi toi thi luc nao cung mat kem.", start: 56.26, end: 60.98, keywords: ["읽는다고 해서", "언제나", "아닙니다"] },
                { speaker: "여", text: "물론 눈 건강에 좋은 습관은 아니니까 고치시는 게 좋겠지요?", vi: "Tat nhien do khong phai thoi quen tot cho mat, nen sua thi tot hon.", start: 61.62, end: 66.39, keywords: ["눈 건강", "습관", "고치다"] },
                { speaker: "여", text: "검사를 해 봐야 알겠지만 어두운 곳에서 책을 읽어서가 아니라", vi: "Can kiem tra moi biet, nhung khong phai vi doc sach o noi toi,", start: 67.13, end: 76.19, keywords: ["검사", "읽어서가 아니라"] },
                { speaker: "여", text: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 겁니다.", vi: "ma co le vi dung dien thoai hoac may tinh lau.", start: 76.85, end: 80.28, keywords: ["스마트폰", "컴퓨터", "오랜 시간"] },
                { speaker: "여", text: "병원에 가셔서 검사를 한번 받아 보시는 게 좋겠습니다.", vi: "Nen den benh vien kiem tra mot lan.", start: 81.34, end: 84.13, keywords: ["병원", "검사"] },
                { speaker: "남", text: "그리고 저는 커피를 아주 좋아하는데 커피가 몸에 안 좋다고 들었어요. 정말이에요?", vi: "Toi rat thich ca phe, nhung nghe noi ca phe khong tot cho co the. Co that khong?", start: 84.56, end: 91.16, keywords: ["커피", "몸에 안 좋다", "정말"] },
                { speaker: "여", text: "커피가 건강에 나쁘다니요.", vi: "Ca phe co hai cho suc khoe sao?", start: 91.72, end: 94.33, keywords: ["나쁘다니요"] },
                { speaker: "여", text: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.", vi: "Ca phe khong duong va kem, uong 2-3 ly moi ngay thi con tot cho suc khoe.", start: 94.56, end: 98.22, keywords: ["설탕", "크림", "2~3잔", "건강에 좋습니다"] },
                { speaker: "여", text: "암을 예방할 수 있고 다이어트에도 도움을 주니까", vi: "No co the giup phong tranh ung thu va ho tro giam can,", start: 98.84, end: 101.94, keywords: ["암", "예방", "다이어트"] },
                { speaker: "여", text: "걱정하지 않으셔도 됩니다.", vi: "nen khong can lo lang.", start: 102.15, end: 103.65, keywords: ["걱정하지 않다"] }
            ],
            publicCues: [
                { speaker: "남", start: 0, end: 12.91, keywords: ["물을 많이 마시다", "건강"], extraKeywords: ["첫 번째 질문"] },
                { speaker: "여", start: 19.99, end: 41.89, keywords: ["누구나 다 건강해지는 것은 아니다", "8잔 이상", "배탈"], extraKeywords: ["물에 대한 답"] },
                { speaker: "여", start: 56.26, end: 84.13, keywords: ["언제나 눈이 나빠지는 건 아니다", "스마트폰", "검사"], extraKeywords: ["눈 건강"] },
                { speaker: "여", start: 91.72, end: 103.65, keywords: ["커피가 건강에 나쁘다니요", "2~3잔", "건강에 좋다"], extraKeywords: ["커피"] }
            ],
            dictogloss: {
                prompt: "물, 눈 건강, 커피에 대한 세 가지 질문과 답을 각각 한 문장씩 정리해 보세요.",
                promptVi: "Tom tat moi cau hoi ve nuoc, mat va ca phe bang mot cau.",
                keywords: ["물을 많이 마시다", "8잔 이상", "어두운 곳", "스마트폰", "커피", "2~3잔"],
                modelSummary: "물을 많이 마시는 것이 건강에 좋지만 누구나 많이 마셔야 하는 것은 아니며 8잔 이상 마시면 배탈이 날 수도 있습니다. 어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니고 스마트폰이나 컴퓨터를 오래 사용한 것이 원인일 수 있습니다. 설탕이나 크림이 없는 커피를 하루 2~3잔 마시면 오히려 건강에 좋을 수 있습니다.",
                placeholder: "예: 물은 몸에 좋지만 너무 많이 마시면 배탈이 날 수 있습니다. 눈이 나빠진 것은 스마트폰이나 컴퓨터 때문일 수 있습니다. 설탕이나 크림이 없는 커피는 하루 2~3잔 정도 마시면 건강에 좋습니다.",
                placeholderVi: "Vi du: Nuoc tot nhung uong qua nhieu co the dau bung. Mat kem co the do dung dien thoai hoac may tinh. Ca phe khong duong/kem 2-3 ly co the tot."
            },
            sequenceTask: {
                title: "건강 정보 흐름 배열",
                titleVi: "Sap xep thong tin suc khoe",
                guide: "대화에서 다룬 건강 정보를 나온 순서대로 배열해 보세요.",
                guideVi: "Sap xep cac thong tin suc khoe theo thu tu xuat hien.",
                checkLabel: "순서 확인",
                checkLabelVi: "Kiem tra thu tu",
                resetLabel: "다시 섞기",
                resetLabelVi: "Tron lai",
                statusInitial: "항목을 움직여 질문과 답의 순서를 맞춰 보세요.",
                statusInitialVi: "Hay di chuyen cac muc de sap xep dung.",
                statusCorrect: "순서가 맞습니다. 물, 눈, 커피의 흐름을 잘 정리했습니다.",
                statusCorrectVi: "Dung thu tu.",
                statusIncorrect: "첫 질문이 물에 대한 내용이었다는 점부터 다시 들어 보세요.",
                statusIncorrectVi: "Hay nghe lai tu cau hoi dau tien ve nuoc.",
                items: [
                    { id: "health-1", label: "물을 많이 마시는 것이 항상 누구에게나 좋은 것은 아니라고 설명한다.", labelVi: "Giai thich uong nhieu nuoc khong phai luc nao cung tot cho moi nguoi" },
                    { id: "health-2", label: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 말한다.", labelVi: "Noi doc sach noi toi khong phai luc nao cung lam mat kem" },
                    { id: "health-3", label: "스마트폰이나 컴퓨터를 오래 사용한 것이 눈이 나빠진 원인일 수 있다고 말한다.", labelVi: "Noi dung dien thoai/may tinh lau co the la nguyen nhan" },
                    { id: "health-4", label: "설탕이나 크림이 없는 커피는 하루 2~3잔 정도 마시면 건강에 좋을 수 있다고 말한다.", labelVi: "Noi ca phe khong duong/kem 2-3 ly co the tot cho suc khoe" }
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
            notePromptsVi: {
                keywords: "Nuoc, suc khoe, tren 8 ly, noi toi, dien thoai, may tinh, ca phe, 2-3 ly",
                details: "Ghi dieu dung va dieu hieu lam cua tung thong tin suc khoe",
                questions: "Ghi thong tin nao khong phai luc nao cung dung",
                cue: "Cau hoi / suy nghi chung / cau tra loi / luu y",
                notes: "Chia ghi chu thanh nuoc, mat va ca phe",
                summary: "Tom tat ba kien thuc suc khoe bang moi cau mot y"
            },
            clozeSection: {
                title: "핵심 문장 빈칸 채우기",
                titleVi: "Dien vao cau chinh",
                guide: "교재 지문에 나온 일반화 반박 표현을 완성해 보세요.",
                guideVi: "Hoan thanh cau phan bac viec khai quat trong bai nghe."
            },
            clozeItems: [
                { sentence: "물을 많이 마신다고 해서 누구나 다 _____ 것은 아닙니다.", sentenceVi: "Khong phai ai uong nhieu nuoc thi cung se _____.", blank: "건강해지는", hint: "건강해지다", hintVi: "tro nen khoe manh", explanation: "동사 '건강해지다'가 관형형으로 바뀌어 '건강해지는 것'이 됩니다.", explanationVi: "Dong tu dung dang dinh ngu la '건강해지는'." },
                { sentence: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 _____ 건 아닙니다.", sentenceVi: "Khong phai cu doc sach noi toi thi luc nao mat cung _____.", blank: "나빠지는", hint: "눈이 나빠지다", hintVi: "mat kem di", explanation: "'언제나'와 함께 항상 그런 것은 아니라는 뜻을 나타냅니다.", explanationVi: "Ket hop voi 'luc nao' de noi khong phai luon nhu vay." },
                { sentence: "커피가 건강에 _____니요.", sentenceVi: "Ca phe co hai cho suc khoe sao?", blank: "나쁘다", hint: "A-다니요", hintVi: "phan ung khi bat ngo", explanation: "믿기 어려운 말을 듣고 되물을 때 '나쁘다니요'처럼 말합니다.", explanationVi: "Dung khi bat ngo va hoi lai thong tin kho tin." }
            ],
            speakingTask: {
                title: "말하기 출력",
                titleVi: "Dau ra noi",
                prompt: "건강 상식을 하나 골라 '그렇다고 해서 항상 그런 것은 아니다'라는 방식으로 설명해 보세요.",
                promptVi: "Hay chon mot kien thuc suc khoe va giai thich bang mau 'khong phai luc nao cung nhu vay'.",
                placeholder: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다. 음식을 통해서도 물을 섭취하기 때문에 8잔 이상 마시면 배탈이 날 수도 있습니다.",
                placeholderVi: "Vi du: Khong phai ai uong nhieu nuoc cung khoe hon. Vi trong do an cung co nuoc nen uong tren 8 ly co the dau bung.",
                tips: ["-다고 해서", "누구나 다", "언제나", "것은 아니다", "오히려"]
            },
            clarifications: [
                { ko: "물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", vi: "Khong phai ai uong nhieu nuoc cung khoe hon.", use: "건강 상식을 모든 사람에게 일반화하지 말라고 할 때 씁니다.", useVi: "Dung khi khong muon khai quat thong tin suc khoe cho moi nguoi." },
                { ko: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", vi: "Khong phai cu doc sach noi toi thi luc nao mat cung kem.", use: "항상 그런 것은 아니라는 점을 설명할 때 씁니다.", useVi: "Dung de noi khong phai luc nao cung nhu vay." },
                { ko: "커피가 건강에 나쁘다니요.", vi: "Ca phe co hai cho suc khoe sao?", use: "들은 말이 뜻밖이거나 사실과 다르다고 생각할 때 되묻습니다.", useVi: "Dung khi bat ngo hoac nghi thong tin khong dung." }
            ],
            clarificationPrompt: "물, 눈, 커피 중 하나를 골라 잘못 알려진 상식을 바로잡아 보세요.",
            clarificationPromptVi: "Hay chon nuoc, mat hoac ca phe va sua mot thong tin suc khoe bi hieu sai.",
            clarifyScenario: "예: '커피가 건강에 나쁘다니요. 설탕이나 크림이 들어가지 않은 커피는 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.'",
            oralFeatures: [
                { term: "-다고 해서 ... 것은 아니다", type: "일반화 반박", typeVi: "Phan bac khai quat", note: "어떤 조건이 있어도 항상 같은 결과가 생기는 것은 아니라고 말합니다.", noteVi: "Noi rang co dieu kien do khong co nghia la luon co ket qua do." },
                { term: "-다니요", type: "놀람 되묻기", typeVi: "Hoi lai vi bat ngo", note: "들은 말이 의외일 때 짧게 반응합니다.", noteVi: "Dung khi nghe thong tin bat ngo." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                titleVi: "Dung hay sai",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요.",
                guideVi: "Neu dung voi noi dung da nghe thi chon O, neu khong thi chon X."
            },
            tfQuestions: [
                { statement: "박사는 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아니라고 했다.", statementVi: "Chuyen gia noi khong phai ai uong nhieu nuoc cung khoe hon.", answer: true, explanation: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있다고 했습니다.", explanationVi: "Uong tren 8 ly co the kho tieu hoac dau bung." },
                { statement: "박사는 눈이 나빠진 원인이 스마트폰이나 컴퓨터를 오래 사용한 것일 수 있다고 했다.", statementVi: "Chuyen gia noi co the mat kem do dung dien thoai hoac may tinh lau.", answer: true, explanation: "어두운 곳에서 책을 읽어서가 아니라 스마트폰이나 컴퓨터를 오래 사용해서 나빠졌을 거라고 했습니다.", explanationVi: "Khong phai do doc sach noi toi ma co the do dung thiet bi lau." },
                { statement: "박사는 설탕이나 크림이 없는 커피도 마시면 안 된다고 했다.", statementVi: "Chuyen gia noi khong nen uong ca phe khong duong/kem.", answer: false, explanation: "그런 커피는 하루 2~3잔 정도 마시면 오히려 건강에 좋다고 했습니다.", explanationVi: "Ca phe khong duong/kem 2-3 ly co the tot hon cho suc khoe." }
            ],
            quizTitle: "이해 점검",
            quizTitleVi: "Kiem tra muc do hieu",
            quizGuideKo: "세 가지 건강 정보의 질문과 답을 중심으로 정답을 고르세요.",
            quizGuideVi: "Chon dap an dung dua tren ba thong tin suc khoe.",
            questions: [
                {
                    prompt: "물을 하루에 8잔 이상 마시면 어떤 문제가 생길 수도 있습니까?",
                    promptVi: "Neu uong tren 8 ly nuoc moi ngay co the co van de gi?",
                    answer: "2",
                    explanation: "소화가 잘 안되거나 배탈이 날 수도 있다고 했습니다.",
                    explanationVi: "Co the kho tieu hoac dau bung.",
                    options: [
                        { value: "1", label: "눈이 바로 좋아진다.", labelVi: "Mat tot len ngay" },
                        { value: "2", label: "소화가 잘 안되거나 배탈이 날 수 있다.", labelVi: "Co the kho tieu hoac dau bung" },
                        { value: "3", label: "커피를 마실 수 없게 된다.", labelVi: "Khong the uong ca phe" }
                    ]
                },
                {
                    prompt: "박사는 남자의 눈이 나빠진 원인으로 무엇을 말했습니까?",
                    promptVi: "Chuyen gia noi nguyen nhan mat kem co the la gi?",
                    answer: "1",
                    explanation: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 거라고 했습니다.",
                    explanationVi: "Co the do dung dien thoai hoac may tinh lau.",
                    options: [
                        { value: "1", label: "스마트폰이나 컴퓨터를 오래 사용한 것", labelVi: "Dung dien thoai hoac may tinh lau" },
                        { value: "2", label: "물을 너무 적게 마신 것", labelVi: "Uong qua it nuoc" },
                        { value: "3", label: "커피를 마시지 않은 것", labelVi: "Khong uong ca phe" }
                    ]
                },
                {
                    prompt: "박사가 건강에 좋다고 한 커피는 어떤 커피입니까?",
                    promptVi: "Loai ca phe nao chuyen gia noi co the tot cho suc khoe?",
                    answer: "3",
                    explanation: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 좋다고 했습니다.",
                    explanationVi: "Ca phe khong duong hoac kem, moi ngay 2-3 ly.",
                    options: [
                        { value: "1", label: "설탕과 크림이 많이 들어간 커피", labelVi: "Ca phe co nhieu duong va kem" },
                        { value: "2", label: "하루에 8잔 이상 마시는 커피", labelVi: "Ca phe uong tren 8 ly moi ngay" },
                        { value: "3", label: "설탕이나 크림이 들어가지 않은 커피", labelVi: "Ca phe khong co duong hay kem" }
                    ]
                }
            ]
        }
    ];

    function cloneLesson(lesson) {
        return JSON.parse(JSON.stringify(lesson));
    }

    const track85PreciseCutFrames = [
        { start: 0, end: 13.06, x: 0, y: 0, width: 1254, height: 392, label: "1", title: "뉴스 도입", titleVi: "Mo dau ban tin", caption: "안내 멘트가 끝난 뒤 앵커가 여성 운전자에 대한 고정관념과 사고 여부를 질문합니다.", captionVi: "Sau loi huong dan, nguoi dan chu dat cau hoi ve dinh kien phu nu lai xe kem va hay gay tai nan." },
        { start: 13.06, end: 22.48, x: 1254, y: 0, width: 1254, height: 392, label: "2", title: "오해 바로잡기", titleVi: "Sua hieu lam", caption: "뉴스를 보는 사람들의 생각을 짚고 모두 오해였던 것 같다고 말합니다.", captionVi: "Noi ve suy nghi cua nguoi xem va sua lai rang do la hieu lam." },
        { start: 22.48, end: 30.94, x: 0, y: 392, width: 1254, height: 392, label: "3", title: "사고 통계", titleVi: "Thong ke tai nan", caption: "남성 운전자가 여성 운전자보다 다섯 배 이상 사고를 많이 냈다는 통계를 제시합니다.", captionVi: "Thong ke cho thay tai xe nam gay tai nan nhieu hon phu nu hon nam lan." },
        { start: 30.94, end: 33.78, x: 1254, y: 392, width: 1254, height: 392, label: "4", title: "기자 연결", titleVi: "Noi voi phong vien", caption: "김지연 기자가 마트 현장에서 보도를 이어 갑니다.", captionVi: "Phong vien Kim Jiyeon tiep tuc ban tin tai sieu thi." },
        { start: 33.78, end: 40.70, x: 0, y: 784, width: 1254, height: 392, label: "5", title: "마트 주차 장면", titleVi: "Canh do xe o sieu thi", caption: "마트에서 힘들게 주차하는 여성 운전자를 남성이 답답해하며 바라봅니다.", captionVi: "Mot nguoi nam nhin nguoi phu nu dang kho khan khi do xe o sieu thi." },
        { start: 40.70, end: 44.52, x: 1254, y: 784, width: 1254, height: 392, label: "6", title: "경적을 누르는 남성", titleVi: "Bam coi", caption: "기다리지 못한 남성이 경적을 누르는 장면으로 이어집니다.", captionVi: "Nguoi nam khong doi duoc va bam coi." },
        { start: 44.52, end: 65.44, x: 0, y: 1176, width: 1254, height: 392, label: "7", title: "안전 운전", titleVi: "Lai xe an toan", caption: "주차가 힘들다고 사고를 많이 내는 것은 아니며 여성 운전자는 안전 운전을 중요하게 생각한다고 설명합니다.", captionVi: "Kho do xe khong co nghia la hay gay tai nan; tai xe nu coi trong lai xe an toan." },
        { start: 65.44, end: 75.30, x: 1254, y: 1176, width: 1254, height: 392, label: "8", title: "위험한 운전 습관", titleVi: "Thoi quen nguy hiem", caption: "속도를 높이거나 신호를 지키지 않는 운전 습관이 사고를 더 자주 낸다고 말합니다.", captionVi: "Thoi quen tang toc va khong theo tin hieu co the gay tai nan thuong xuyen hon." },
        { start: 75.30, end: 81.12, x: 0, y: 1568, width: 1254, height: 392, label: "9", title: "원인은 운전 습관", titleVi: "Nguyen nhan la thoi quen", caption: "교통사고의 원인은 성별 차이가 아니라 운전 습관이라고 정리합니다.", captionVi: "Ket luan nguyen nhan tai nan la thoi quen lai xe, khong phai gioi tinh." },
        { start: 81.12, end: 89.55, x: 1254, y: 1568, width: 1254, height: 392, label: "10", title: "안전 운전 결론", titleVi: "Ket luan ve lai xe an toan", caption: "안전하게 운전하는 것이 운전을 제일 잘하는 것이라고 마무리합니다.", captionVi: "Ket thuc bang y rang lai xe an toan moi la lai xe gioi nhat." }
    ];

    const track85PreciseTranscript = [
        { speaker: "앵커", text: "정말 여자는 남자보다 운전을 못하고 사고를 자주 낼까요?", vi: "Co that phu nu lai xe kem hon nam gioi va hay gay tai nan hon khong?", start: 6.84, end: 11.80, keywords: ["여자", "남자보다", "사고"] },
        { speaker: "앵커", text: "지금 뉴스를 보고 계신 분들 중에도 여자는 운전이 서툴다고 생각하는 분들이 있을 텐데요.", vi: "Trong so nguoi dang xem tin tuc, co le co nguoi nghi phu nu lai xe chua gioi.", start: 13.06, end: 19.28, keywords: ["여자는", "운전이 서툴다"] },
        { speaker: "앵커", text: "모두 오해였던 것 같습니다.", vi: "Tat ca co le la hieu lam.", start: 19.78, end: 21.48, keywords: ["오해"] },
        { speaker: "앵커", text: "지난해 일어난 교통사고를 보니 남성 운전자가 여성 운전자보다 5배 이상 사고를 많이 냈습니다.", vi: "Theo cac vu tai nan giao thong nam ngoai, tai xe nam gay tai nan nhieu hon tai xe nu hon nam lan.", start: 22.48, end: 30.14, keywords: ["교통사고", "남성 운전자", "5배 이상"] },
        { speaker: "앵커", text: "김지연 기자가 전해 드립니다.", vi: "Phong vien Kim Jiyeon se dua tin.", start: 30.94, end: 32.82, keywords: ["기자"] },
        { speaker: "기자", text: "마트에서 힘들게 주차하고 있는 여성 운전자를 한 남성이 답답해하며 바라보고 있습니다.", vi: "O sieu thi, mot nguoi nam nhin nguoi phu nu dang kho khan khi do xe.", start: 33.78, end: 39.54, keywords: ["마트", "주차", "답답해하며"] },
        { speaker: "기자", text: "기다리지 못하고 경적을 누르는 남성도 있습니다.", vi: "Cung co nguoi nam khong doi duoc va bam coi.", start: 40.70, end: 43.34, keywords: ["경적"] },
        { speaker: "기자", text: "하지만 여성 운전자가 주차를 힘들어 한다고 해서 사고를 많이 내는 것은 아닙니다.", vi: "Nhung khong phai phu nu do xe kho thi hay gay tai nan.", start: 44.52, end: 50.00, keywords: ["주차", "사고", "것은 아닙니다"] },
        { speaker: "기자", text: "남자라고 해서 누구나 주차를 잘하는 것도 아닙니다.", vi: "Khong phai cu la nam gioi thi ai cung do xe gioi.", start: 51.00, end: 54.24, keywords: ["남자라고 해서", "누구나", "아닙니다"] },
        { speaker: "기자", text: "실제로 여성 운전자는 조금 느리게 가도 안전하게 운전하는 것을 중요하게 생각한다고 합니다.", vi: "Thuc te, tai xe nu coi trong viec lai xe an toan du di cham mot chut.", start: 54.58, end: 61.28, keywords: ["여성 운전자", "안전하게 운전"] },
        { speaker: "기자", text: "그래서 사고를 많이 내지 않습니다.", vi: "Vi vay ho khong gay nhieu tai nan.", start: 62.28, end: 64.30, keywords: ["사고", "많이 내지 않습니다"] },
        { speaker: "기자", text: "자신이 운전을 잘한다고 생각해서 속도를 높이거나 빨리 가기 위해 신호를 지키지 않는 남성 운전자들이 사고를 더 자주 낸다고 합니다.", vi: "Tai xe nam nghi minh lai gioi, tang toc hoac khong theo tin hieu de di nhanh, gay tai nan thuong xuyen hon.", start: 65.44, end: 74.30, keywords: ["속도", "신호", "사고"] },
        { speaker: "기자", text: "교통사고의 원인은 남성과 여성의 차이 때문이 아니라 운전 습관 때문입니다.", vi: "Nguyen nhan tai nan giao thong khong phai khac biet nam nu ma la thoi quen lai xe.", start: 75.30, end: 80.74, keywords: ["원인", "차이", "운전 습관"] },
        { speaker: "기자", text: "안전하게 운전하는 것이 운전을 제일 잘하는 것입니다.", vi: "Lai xe an toan moi la lai xe gioi nhat.", start: 81.12, end: 84.82, keywords: ["안전하게 운전", "제일 잘하는 것"] },
        { speaker: "기자", text: "지금까지 김지연이었습니다.", vi: "Vua roi la Kim Jiyeon.", start: 85.60, end: 87.36, keywords: ["김지연"] }
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
        { start: 0, end: 13.78, x: 0, y: 0, width: 1254, height: 627, label: "1", title: "물 질문 시작", titleVi: "Bat dau hoi ve nuoc", caption: "안내 멘트가 끝난 뒤 남자가 물을 많이 마시는 것이 건강에 좋은지 묻습니다.", captionVi: "Sau loi huong dan, nguoi nam hoi uong nhieu nuoc co tot cho suc khoe khong." },
        { start: 13.78, end: 19.99, x: 1254, y: 0, width: 1254, height: 627, label: "2", title: "더 마셔야 할까", titleVi: "Co nen uong hon khong", caption: "물을 별로 안 마시는데 건강을 위해 더 많이 마셔야 하는지 다시 묻습니다.", captionVi: "Anh hoi co can uong nhieu nuoc hon vi suc khoe khong." },
        { start: 19.99, end: 23.34, x: 2508, y: 0, width: 1254, height: 627, label: "3", title: "물은 몸에 좋다", titleVi: "Nuoc tot cho co the", caption: "박사가 물이 우리 몸에 좋은 것은 맞다고 답합니다.", captionVi: "Chuyen gia noi nuoc dung la tot cho co the." },
        { start: 23.34, end: 26.89, x: 0, y: 627, width: 1254, height: 627, label: "4", title: "몸의 70%", titleVi: "70 phan tram co the", caption: "우리 몸의 70%가 물로 되어 있다고 설명합니다.", captionVi: "Giai thich 70 phan tram co the la nuoc." },
        { start: 26.89, end: 32.18, x: 1254, y: 627, width: 1254, height: 627, label: "5", title: "많다고 다 좋은 건 아님", titleVi: "Nhieu khong phai luon tot", caption: "물을 많이 마신다고 해서 누구나 건강해지는 것은 아니라고 바로잡습니다.", captionVi: "Sua hieu lam rang khong phai ai uong nhieu nuoc cung khoe hon." },
        { start: 32.18, end: 42.92, x: 2508, y: 627, width: 1254, height: 627, label: "6", title: "8잔 이상 주의", titleVi: "Can than tren 8 ly", caption: "음식에도 물이 들어 있으므로 하루 8잔 이상 마시면 소화가 안 되거나 배탈이 날 수 있다고 말합니다.", captionVi: "Do do an cung co nuoc, tren 8 ly moi ngay co the kho tieu hoac dau bung." },
        { start: 42.92, end: 48.24, x: 0, y: 1254, width: 1254, height: 627, label: "7", title: "눈 질문", titleVi: "Hoi ve mat", caption: "남자가 질문을 하나 더 하며 요즘 눈이 많이 나빠졌다고 말합니다.", captionVi: "Nguoi nam hoi them va noi gan day mat kem di." },
        { start: 48.24, end: 54.2, x: 1254, y: 1254, width: 1254, height: 627, label: "8", title: "어두운 곳에서 책", titleVi: "Doc sach noi toi", caption: "친구들이 어두운 곳에서 책을 읽어서 눈이 나빠졌다고 했다는 말을 전합니다.", captionVi: "Anh ke ban be noi mat kem vi doc sach noi toi." },
        { start: 54.2, end: 56.26, x: 2508, y: 1254, width: 1254, height: 627, label: "9", title: "정말 그런가요", titleVi: "Co dung vay khong", caption: "남자가 정말 어두운 곳에서 책을 읽어서 눈이 나빠진 것인지 확인합니다.", captionVi: "Anh hoi dieu do co dung khong." },
        { start: 56.26, end: 61.62, x: 0, y: 1881, width: 1254, height: 627, label: "10", title: "언제나 그런 건 아님", titleVi: "Khong phai luon nhu vay", caption: "박사가 어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 것은 아니라고 답합니다.", captionVi: "Chuyen gia noi khong phai cu doc sach noi toi thi mat luon kem." },
        { start: 61.62, end: 67.13, x: 1254, y: 1881, width: 1254, height: 627, label: "11", title: "좋은 습관은 아님", titleVi: "Khong phai thoi quen tot", caption: "그래도 눈 건강에 좋은 습관은 아니므로 고치는 게 좋다고 덧붙입니다.", captionVi: "Tuy vay do khong phai thoi quen tot cho mat nen nen sua." },
        { start: 67.13, end: 76.85, x: 2508, y: 1881, width: 1254, height: 627, label: "12", title: "스마트폰과 컴퓨터", titleVi: "Dien thoai va may tinh", caption: "어두운 곳에서 책을 읽어서가 아니라 스마트폰이나 컴퓨터를 오래 사용해서 눈이 나빠졌을 거라고 설명합니다.", captionVi: "Co the mat kem do dung dien thoai hoac may tinh lau, khong phai do doc sach noi toi." },
        { start: 76.85, end: 81.34, x: 0, y: 2508, width: 1254, height: 627, label: "13", title: "병원 검사", titleVi: "Kham o benh vien", caption: "병원에 가서 검사를 받아 보는 게 좋겠다고 권합니다.", captionVi: "Khuyen anh nen den benh vien kiem tra." },
        { start: 81.34, end: 87.32, x: 1254, y: 2508, width: 1254, height: 627, label: "14", title: "커피를 좋아함", titleVi: "Thich ca phe", caption: "남자가 커피를 아주 좋아하지만 몸에 안 좋다고 들었다고 말합니다.", captionVi: "Nguoi nam noi minh rat thich ca phe nhung nghe noi ca phe khong tot." },
        { start: 87.32, end: 89.07, x: 2508, y: 2508, width: 1254, height: 627, label: "15", title: "커피가 나쁜가요", titleVi: "Ca phe co xau khong", caption: "커피가 정말 몸에 안 좋은지 묻는 질문으로 이어집니다.", captionVi: "Cau hoi tiep tuc: ca phe co that su khong tot khong." },
        { start: 89.07, end: 91.72, x: 0, y: 3135, width: 1254, height: 627, label: "16", title: "나쁘다니요", titleVi: "Khong tot sao", caption: "박사가 커피가 건강에 나쁘다는 말을 되묻습니다.", captionVi: "Chuyen gia hoi lai y rang ca phe khong tot cho suc khoe." },
        { start: 91.72, end: 98.84, x: 1254, y: 3135, width: 1254, height: 627, label: "17", title: "하루 2~3잔", titleVi: "Moi ngay 2-3 ly", caption: "설탕이나 크림이 들어가지 않은 커피를 하루 2~3잔 마시면 오히려 건강에 좋다고 말합니다.", captionVi: "Ca phe khong duong hoac kem, moi ngay 2-3 ly, co the tot hon cho suc khoe." },
        { start: 98.84, end: 105.45, x: 2508, y: 3135, width: 1254, height: 627, label: "18", title: "예방과 다이어트", titleVi: "Phong ngua va giam can", caption: "암 예방과 다이어트에도 도움이 되므로 걱정하지 않아도 된다고 마무리합니다.", captionVi: "Noi ca phe co the giup phong ngua ung thu va giam can nen khong can lo." }
    ];

    const track86PreciseTranscript = [
        { speaker: "남", text: "박사님, 물을 많이 마시는 게 건강에 좋다고 하는데", vi: "Thua bac si, nghe noi uong nhieu nuoc tot cho suc khoe.", start: 7.32, end: 11.51, keywords: ["물을 많이 마시는 게", "건강"] },
        { speaker: "남", text: "그게 사실인가요?", vi: "Dieu do co dung khong?", start: 11.79, end: 12.91, keywords: ["사실"] },
        { speaker: "남", text: "전 물을 별로 안 마시는데 건강을 위해서 더 많이 마셔야 할까요?", vi: "Toi khong uong nhieu nuoc, vay co nen uong nhieu hon vi suc khoe khong?", start: 13.78, end: 18.91, keywords: ["물을 별로 안 마시는데", "더 많이"] },
        { speaker: "여", text: "물이 우리 몸에 좋은 것은 맞습니다.", vi: "Nuoc tot cho co the la dung.", start: 19.99, end: 22.66, keywords: ["물", "좋은 것은"] },
        { speaker: "여", text: "우리 몸의 70%가 물로 되어 있고요.", vi: "Khoang 70% co the chung ta la nuoc.", start: 23.34, end: 26.03, keywords: ["70%", "물"] },
        { speaker: "여", text: "그런데 물을 많이 마신다고 해서 누구나 다 건강해지는 것은 아닙니다.", vi: "Nhung khong phai ai uong nhieu nuoc cung khoe hon.", start: 26.89, end: 31.53, keywords: ["많이 마신다고 해서", "누구나", "것은 아닙니다"] },
        { speaker: "여", text: "우리가 평소에 먹는 음식에도 물이 들어 있기 때문에", vi: "Vi thuc an hang ngay cung co nuoc,", start: 32.18, end: 36.26, keywords: ["음식", "물"] },
        { speaker: "여", text: "하루에 8잔 이상 마시면 소화가 잘 안되거나 배탈이 날 수도 있습니다.", vi: "neu uong hon 8 ly mot ngay, co the kho tieu hoac dau bung.", start: 36.48, end: 41.89, keywords: ["8잔 이상", "소화", "배탈"] },
        { speaker: "남", text: "질문이 하나 더 있는데요.", vi: "Toi con mot cau hoi nua.", start: 42.92, end: 44.47, keywords: ["질문"] },
        { speaker: "남", text: "제가 요즘 눈이 많이 나빠졌어요.", vi: "Gan day mat toi kem di.", start: 45.05, end: 47.52, keywords: ["눈", "나빠졌어요"] },
        { speaker: "남", text: "그런데 친구들이 제가 어두운 곳에서 책을 읽어서 나빠진 거래요.", vi: "Ban be noi do toi doc sach o noi toi.", start: 48.24, end: 53.51, keywords: ["어두운 곳", "책", "나빠진"] },
        { speaker: "남", text: "정말 그런가요?", vi: "Co that khong?", start: 54.2, end: 55.08, keywords: ["정말"] },
        { speaker: "여", text: "어두운 곳에서 책을 읽는다고 해서 언제나 눈이 나빠지는 건 아닙니다.", vi: "Khong phai cu doc sach o noi toi thi luc nao cung mat kem.", start: 56.26, end: 60.98, keywords: ["읽는다고 해서", "언제나", "아닙니다"] },
        { speaker: "여", text: "물론 눈 건강에 좋은 습관은 아니니까 고치시는 게 좋겠지요?", vi: "Tat nhien do khong phai thoi quen tot cho mat, nen sua thi tot hon.", start: 61.62, end: 66.39, keywords: ["눈 건강", "습관", "고치시는"] },
        { speaker: "여", text: "검사를 해 봐야 알겠지만 어두운 곳에서 책을 읽어서가 아니라", vi: "Can kiem tra moi biet, nhung khong phai vi doc sach o noi toi,", start: 67.13, end: 71.51, keywords: ["검사", "읽어서가 아니라"] },
        { speaker: "여", text: "스마트폰이나 컴퓨터를 오랜 시간 사용해서 나빠졌을 겁니다.", vi: "ma co le vi dung dien thoai hoac may tinh lau.", start: 71.84, end: 76.19, keywords: ["스마트폰", "컴퓨터", "오랜 시간"] },
        { speaker: "여", text: "병원에 가셔서 검사를 한번 받아 보시는 게 좋겠습니다.", vi: "Nen den benh vien kiem tra mot lan.", start: 76.85, end: 80.28, keywords: ["병원", "검사"] },
        { speaker: "남", text: "그리고 저는 커피를 아주 좋아하는데 커피가 몸에 안 좋다고 들었어요.", vi: "Toi rat thich ca phe, nhung nghe noi ca phe khong tot cho co the.", start: 81.34, end: 86.71, keywords: ["커피", "몸에 안 좋다"] },
        { speaker: "남", text: "정말이에요?", vi: "Co that khong?", start: 87.32, end: 87.98, keywords: ["정말"] },
        { speaker: "여", text: "커피가 건강에 나쁘다니요.", vi: "Ca phe co hai cho suc khoe sao?", start: 89.07, end: 91.16, keywords: ["나쁘다니요"] },
        { speaker: "여", text: "설탕이나 크림이 들어가지 않은 커피를 하루에 2~3잔 정도 마시면 오히려 건강에 좋습니다.", vi: "Ca phe khong duong va kem, uong 2-3 ly moi ngay thi con tot cho suc khoe.", start: 91.72, end: 98.22, keywords: ["설탕", "크림", "2~3잔", "건강에 좋습니다"] },
        { speaker: "여", text: "암을 예방할 수 있고 다이어트에도 도움을 주니까", vi: "No co the giup phong tranh ung thu va ho tro giam can,", start: 98.84, end: 101.94, keywords: ["암", "예방", "다이어트"] },
        { speaker: "여", text: "걱정하지 않으셔도 됩니다.", vi: "nen khong can lo lang.", start: 102.15, end: 103.65, keywords: ["걱정하지 않다"] }
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
            titleVi: settings.titleVi || "Luyen nghe bai 17",
            description: settings.description || "교재 듣기 지문 Track 85, 86을 바탕으로 고정관념과 건강 상식을 비판적으로 듣고 정리하는 워크북입니다.",
            descriptionVi: settings.descriptionVi || "Workbook nghe bai 17 dua tren Track 85 va 86.",
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
                enabled: true,
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
            featureListVi: [
                "Du doan tinh huong",
                "Xem tu khoa",
                "Sap xep dong",
                "Dien vao cho trong",
                "Kiem tra muc do hieu"
            ],
            lessons: selectedLessons
        };
    };
})();
