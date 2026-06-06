(function () {
    "use strict";

    const lessons = [
        {
            id: "track74",
            compactSample: {
                removeDictoglossSection: true
            },
            label: "Track 74",
            audioTrackNumber: 74,
            title: "듣기 1: 보고서를 안 가져왔어요",
            titleVi: "Nghe 1: Em quen mang bao cao",
            summary: "남자가 오늘까지 내야 하는 보고서를 집에 두고 와서 어머니에게 전화를 합니다. 남자는 외장 하드 디스크의 모양을 설명하고 파일을 이메일로 보내 달라고 부탁하지만, 어머니가 파일 보내는 방법을 몰라 결국 직접 가지러 가기로 합니다.",
            summaryVi: "Nguoi nam quen bao cao o nha. Anh nho me tim o cung ngoai va gui file qua email, nhung me khong biet gui file nen anh se ve lay.",
            grammarLink: {
                href: "grammar1.html",
                title: "문법 연결",
                titleVi: "Lien ket ngu phap",
                label: "N만 하다",
                labelVi: "N-man hada",
                description: "듣기 속 '휴대폰만한데'처럼 물건의 크기를 익숙한 대상과 비교하는 표현을 문법 1과 연결해 복습합니다.",
                descriptionVi: "On lai cach so sanh kich thuoc nhu 'bang dien thoai' trong bai nghe."
            },
            activityImage: {
                src: "../assets/c16/listening/images/lesson16-listening1-cuttoon.webp",
                alt: "남자가 어머니에게 전화해 외장 하드 디스크를 설명하는 열 컷 컷툰",
                altVi: "Khung tranh tam cho hoi thoai nguoi nam goi me va mo ta o cung ngoai",
                pendingLabel: "듣기 1 컷툰 이미지를 불러오고 있습니다.",
                pendingLabelVi: "Dang tai tranh cat cho bai nghe 1.",
                pendingHint: "이미지 파일이 없으면 에셋 경로를 확인하세요.",
                pendingHintVi: "Neu khong thay hinh, hay kiem tra duong dan asset.",
                caption: "원음 흐름에 맞춰 10컷 컷툰을 한 컷씩 확대해서 볼 수 있습니다.",
                captionVi: "Co the xem 10 khung tranh theo dong audio."
            },
            audioSrc: null,
            audioSourceType: "original",
            syncVisual: {
                imageSrc: "../assets/c16/listening/images/lesson16-listening1-cuttoon.webp",
                coverImageSrc: "",
                coverAlt: "듣기 1 컷 보기 커버 자리",
                coverAltVi: "Anh bia tam cho bai nghe 1",
                title: "그림 컷 보기",
                titleVi: "Xem theo tung khung tranh",
                copy: "원음 Track 74의 흐름에 맞춰 10컷 컷툰이 한 컷씩 전환되도록 시간 구간을 잡아 두었습니다.",
                copyVi: "10 khung tranh duoc gan voi moc thoi gian cua Track 74.",
                aspectRatio: "1.72 / 1",
                transitionMs: 480,
                coverRevealAt: 0,
                frames: [
                    { start: 0, end: 17.4, x: 6, y: 6, width: 517, height: 301, label: "1", title: "전화를 걸어 위치 확인", titleVi: "Goi dien hoi me", caption: "남자가 어머니에게 전화해 집에 계신지 확인합니다.", captionVi: "Nguoi nam goi dien hoi me co o nha khong." },
                    { start: 17.4, end: 26.9, x: 531, y: 6, width: 518, height: 301, label: "2", title: "급히 도움 요청", titleVi: "Nho giup gap", caption: "남자는 시간이 없다며 도와 달라고 하고, 어머니는 무엇을 두고 갔는지 묻습니다.", captionVi: "Anh noi khong co thoi gian va nho me giup." },
                    { start: 26.9, end: 34.6, x: 6, y: 318, width: 517, height: 284, label: "3", title: "깜빡 잊는 습관", titleVi: "Hay quen", caption: "어머니는 남자가 원래 깜빡 잘 잊어버리기로 유명하다고 말합니다.", captionVi: "Me noi anh noi tieng la hay quen." },
                    { start: 34.6, end: 45.6, x: 531, y: 318, width: 518, height: 284, label: "4", title: "보고서를 두고 옴", titleVi: "Quen bao cao", caption: "남자는 오늘까지 내야 하는 보고서를 집에 두고 왔다고 말합니다.", captionVi: "Anh de quen bao cao phai nop hom nay o nha." },
                    { start: 45.6, end: 54.9, x: 6, y: 610, width: 517, height: 284, label: "5", title: "외장 하드 디스크 부탁", titleVi: "Nho tim o cung", caption: "남자는 방 책상 위의 외장 하드 디스크를 찾아 달라고 부탁합니다.", captionVi: "Anh nho me tim o cung ngoai tren ban." },
                    { start: 54.9, end: 59.8, x: 531, y: 610, width: 518, height: 284, label: "6", title: "컴퓨터인지 확인", titleVi: "Hoi co phai may tinh", caption: "어머니는 하드 디스크가 컴퓨터를 말하는 것인지 헷갈려 합니다.", captionVi: "Me khong ro co phai may tinh khong." },
                    { start: 59.8, end: 76.4, x: 6, y: 903, width: 517, height: 274, label: "7", title: "물건 모양 설명", titleVi: "Mo ta hinh dang", caption: "남자는 노트북 옆의 긴 네모 모양, 까만색, 휴대폰만한 물건이라고 설명합니다.", captionVi: "Anh mo ta vat mau den, hinh chu nhat dai, bang dien thoai." },
                    { start: 76.4, end: 88.8, x: 531, y: 903, width: 518, height: 274, label: "8", title: "외장 하드 발견", titleVi: "Tim thay o cung", caption: "어머니는 디스크가 둥근 모양이 아니라 사각형인 것을 보고 물건을 찾습니다.", captionVi: "Me tim thay vat hinh chu nhat, khong phai dia tron." },
                    { start: 88.8, end: 93.8, x: 6, y: 1185, width: 517, height: 299, label: "9", title: "이메일 부탁", titleVi: "Nho gui email", caption: "남자는 하드 디스크 안의 파일 하나를 이메일로 보내 달라고 부탁합니다.", captionVi: "Anh nho me gui mot file qua email." },
                    { start: 93.8, end: 107.8, x: 531, y: 1185, width: 518, height: 299, label: "10", title: "직접 가지러 감", titleVi: "Tu ve lay", caption: "어머니가 파일을 보내는 방법을 몰라 남자는 결국 직접 가겠다고 합니다.", captionVi: "Me khong biet gui file, nen anh se ve lay." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황 그림: 보고서 파일을 부탁하는 전화",
                titleVi: "Tinh huong: goi dien nho gui file bao cao",
                caption: "학교에 있는 남자가 오늘까지 내야 할 보고서를 집에 두고 와서 어머니에게 외장 하드 디스크를 찾아 달라고 전화합니다.",
                captionVi: "Nguoi nam o truong goi me vi quen bao cao o nha va nho tim o cung ngoai.",
                tags: ["전화", "보고서", "외장 하드 디스크", "모양 설명"]
            },
            preListening: {
                vocab: [
                    { ko: "보고서", vi: "bao cao", hint: "조사하거나 공부한 내용을 정리한 글" },
                    { ko: "외장 하드 디스크", vi: "o cung ngoai", hint: "컴퓨터 밖에 연결해 파일을 저장하는 장치" },
                    { ko: "깜빡 잊다", vi: "quen mat", hint: "해야 할 일이나 물건을 순간적으로 잊다" },
                    { ko: "휴대폰만하다", vi: "to bang dien thoai", hint: "크기를 휴대폰과 비슷하게 비교하는 말" },
                    { ko: "이메일로 보내다", vi: "gui qua email", hint: "파일을 이메일로 전달하다" }
                ],
                relationshipOptions: [
                    { value: "mother-son", label: "어머니와 아들" },
                    { value: "teacher-student", label: "선생님과 학생" },
                    { value: "shop-customer", label: "가게 직원과 손님" }
                ],
                relationshipAnswer: "mother-son",
                genreOptions: [
                    { value: "phone-request", label: "전화 부탁" },
                    { value: "lost-found", label: "분실물 방송" },
                    { value: "shopping", label: "물건 구입" }
                ],
                genreAnswer: "phone-request",
                predictionNote: "왜 전화를 했는지, 어떤 물건을 찾고 있는지, 마지막에 남자가 무엇을 하기로 하는지 순서대로 들어 보세요.",
                predictionNoteVi: "Hay nghe theo thu tu: ly do goi dien, mon do can tim, va viec nguoi nam se lam cuoi cung.",
                backgroundPrompt: "중요한 파일을 집에 두고 왔다면 누구에게 어떻게 부탁할 수 있을까요?",
                backgroundPromptVi: "Neu de quen file quan trong o nha, em se nho ai va noi the nao?"
            },
            transcript: [
                { speaker: "안내", text: "잘 듣고, 질문에 답하세요.", vi: "Hay nghe ky va tra loi cau hoi.", start: 3.32, end: 7.10, keywords: ["질문에 답하세요"] },
                { speaker: "남자", text: "여보세요? 엄마, 지금 어디 계세요? 집이세요?", vi: "Alo? Me dang o dau? O nha a?", start: 10.54, end: 14.62, keywords: ["엄마", "집이세요"] },
                { speaker: "어머니", text: "어, 집인데.", vi: "Uh, me o nha.", start: 15.66, end: 16.98, keywords: ["집"] },
                { speaker: "남자", text: "엄마, 저 좀 도와주세요. 시간이 없어서 그래요.", vi: "Me oi, giup con voi. Con khong co thoi gian.", start: 18.06, end: 21.48, keywords: ["도와주세요", "시간이 없어서"] },
                { speaker: "어머니", text: "왜? 뭐 두고 갔니?", vi: "Sao? Con de quen gi a?", start: 22.56, end: 24.52, keywords: ["두고 갔니"] },
                { speaker: "남자", text: "엄마, 어떻게 아셨어요?", vi: "Sao me biet vay?", start: 25.34, end: 26.78, keywords: ["어떻게 아셨어요"] },
                { speaker: "어머니", text: "아이고, 내가 왜 몰라? 내가 원래 깜빡 잘 잊어버리기로 유명하지 않니?", vi: "Troi, sao me lai khong biet? Me noi tieng la hay quen ma.", start: 27.90, end: 33.78, keywords: ["깜빡", "유명하지"] },
                { speaker: "남자", text: "네. 보고서를 깜빡 잊고 집에 두고 왔어요. 오늘까지 내야 하는데.", vi: "Vang. Con de quen bao cao o nha. Hom nay phai nop.", start: 35.14, end: 40.84, keywords: ["보고서", "집에 두고 왔어요"] },
                { speaker: "어머니", text: "그래? 어떡하니? 내가 갖다 줄까?", vi: "Vay a? Lam sao day? Me mang den cho con nhe?", start: 41.94, end: 45.22, keywords: ["갖다 줄까"] },
                { speaker: "남자", text: "아니요. 외장 하드 디스크를 안 가져왔으니까 우선 하드 디스크 좀 찾아봐 주세요. 제 방 책상 위에 있을 거예요.", vi: "Khong a. Con khong mang o cung ngoai, nen me tim giup con truoc. Chac o tren ban trong phong con.", start: 46.28, end: 54.86, keywords: ["외장 하드 디스크", "제 방", "책상 위"] },
                { speaker: "어머니", text: "하드 디스크? 컴퓨터 말이니?", vi: "O cung? La may tinh a?", start: 54.86, end: 58.70, keywords: ["컴퓨터"] },
                { speaker: "남자", text: "그게 아니고요. 엄마, 책상 위 노트북 옆에 긴 네모 모양의 물건이 하나 있을 거예요.", vi: "Khong phai. Tren ban, canh laptop se co mot vat hinh chu nhat dai.", start: 59.82, end: 66.88, keywords: ["노트북 옆", "긴 네모 모양"] },
                { speaker: "남자", text: "색깔은 까만색이고 크기는 휴대폰만한데 휴대폰보다는 좀 두꺼워요. 짧은 전선이 달려 있고요.", vi: "Mau den, to bang dien thoai nhung day hon mot chut. Co day ngan nua.", start: 67.78, end: 76.00, keywords: ["까만색", "휴대폰만한데", "짧은 전선"] },
                { speaker: "어머니", text: "까맣고 휴대폰만한 물건이라고 했지?", vi: "Con noi la do mau den, to bang dien thoai dung khong?", start: 76.92, end: 80.34, keywords: ["휴대폰만한"] },
                { speaker: "어머니", text: "그래, 여기 있구나. 디스크라고 해서 둥근 모양인 줄 알았더니 사각형이네. 이걸 어떻게 할까?", vi: "A, day roi. Me tuong dia thi tron, hoa ra hinh vuong. Lam gi voi cai nay?", start: 80.34, end: 88.34, keywords: ["사각형", "어떻게 할까"] },
                { speaker: "남자", text: "엄마, 거기에 있는 파일 하나만 이메일로 보내 주세요.", vi: "Me gui giup con mot file trong do qua email nhe.", start: 89.22, end: 93.40, keywords: ["파일", "이메일로 보내 주세요"] },
                { speaker: "어머니", text: "파일? 얘, 내가 파일은 한 번도 안 보내 봤는데. 어떻게 하는 거니?", vi: "File a? Me chua tung gui file bao gio. Lam the nao?", start: 94.20, end: 100.78, keywords: ["한 번도", "어떻게"] },
                { speaker: "남자", text: "아, 할 수 없네요. 그냥 두세요. 제가 갈게요.", vi: "A, khong con cach nao. Me cu de day. Con se ve.", start: 101.82, end: 105.66, keywords: ["할 수 없네요", "제가 갈게요"] }
            ],
            publicCues: [
                { speaker: "남자", start: 35.14, end: 40.84, keywords: ["보고서", "깜빡 잊고", "집에 두고 왔어요"], extraKeywords: ["전화 이유"] },
                { speaker: "남자", start: 59.82, end: 76.00, keywords: ["긴 네모 모양", "까만색", "휴대폰만한데", "짧은 전선"], extraKeywords: ["물건 묘사"] },
                { speaker: "남자", start: 89.22, end: 105.66, keywords: ["이메일로 보내 주세요", "할 수 없네요", "제가 갈게요"], extraKeywords: ["마지막 행동"] }
            ],
            dictogloss: {
                prompt: "남자가 전화한 이유, 찾는 물건의 모양, 마지막 결정까지 3문장으로 다시 구성해 보세요.",
                promptVi: "Tom tat ly do goi dien, hinh dang mon do va quyet dinh cuoi cung.",
                keywords: ["보고서", "외장 하드 디스크", "긴 네모 모양", "휴대폰만하다", "이메일", "제가 갈게요"],
                modelSummary: "남자는 오늘까지 내야 하는 보고서를 집에 두고 와서 어머니에게 전화를 했다. 그는 책상 위 노트북 옆에 있는 까맣고 휴대폰만한 외장 하드 디스크를 찾아 달라고 했다. 어머니가 파일을 이메일로 보내는 방법을 몰라서 남자는 직접 가지러 가기로 했다.",
                placeholder: "핵심어를 활용해 전화 상황을 3문장으로 정리해 보세요.",
                placeholderVi: "Dung tu khoa de tom tat hoi thoai bang 3 cau."
            },
            sequenceTask: {
                title: "전화 부탁 흐름 배열",
                titleVi: "Sap xep dong hoi thoai",
                guide: "대화에서 일이 진행된 순서대로 항목을 배열해 보세요.",
                guideVi: "Sap xep cac viec theo thu tu xuat hien.",
                checkLabel: "순서 확인",
                checkLabelVi: "Kiem tra thu tu",
                resetLabel: "다시 섞기",
                resetLabelVi: "Tron lai",
                statusInitial: "항목을 움직여 전화 부탁의 흐름을 맞춰 보세요.",
                statusInitialVi: "Hay di chuyen cac muc de sap xep dung.",
                statusCorrect: "순서가 맞습니다. 문제, 물건 설명, 부탁, 결과를 잘 잡았습니다.",
                statusCorrectVi: "Dung thu tu.",
                statusIncorrect: "다시 들으며 물건 설명 뒤에 어떤 부탁과 결과가 나오는지 확인해 보세요.",
                statusIncorrectVi: "Nghe lai phan sau khi mo ta mon do.",
                items: [
                    { id: "file-1", label: "보고서를 집에 두고 와서 어머니에게 전화한다.", labelVi: "Quen bao cao nen goi cho me" },
                    { id: "file-2", label: "외장 하드 디스크의 위치와 모양을 설명한다.", labelVi: "Mo ta vi tri va hinh dang o cung ngoai" },
                    { id: "file-3", label: "파일을 이메일로 보내 달라고 부탁한다.", labelVi: "Nho gui file qua email" },
                    { id: "file-4", label: "어머니가 파일 보내는 방법을 몰라 남자가 직접 간다.", labelVi: "Me khong biet gui file nen nguoi nam ve lay" }
                ],
                answerOrder: ["file-1", "file-2", "file-3", "file-4"]
            },
            notePrompts: {
                keywords: "보고서, 외장 하드 디스크, 책상 위, 노트북 옆, 까만색, 휴대폰만하다, 이메일, 제가 갈게요",
                details: "전화 이유, 물건 위치와 모양, 마지막 결정 나누어 적기",
                questions: "어머니가 왜 파일을 보내지 못했는지 적기",
                cue: "왜 / 어디 / 어떤 모양 / 부탁 / 결과",
                notes: "찾을 물건과 해야 할 일을 분리해서 메모하기",
                summary: "대화 내용을 두 문장으로 요약하기"
            },
            notePromptsVi: {
                keywords: "Bao cao, o cung ngoai, tren ban, canh laptop, mau den, bang dien thoai, email, se ve lay",
                details: "Ghi ly do goi, vi tri va hinh dang mon do, quyet dinh cuoi",
                questions: "Ghi ly do me khong gui duoc file",
                cue: "Vi sao / o dau / hinh dang / nho / ket qua",
                notes: "Tach mon do can tim va viec can lam",
                summary: "Tom tat bang hai cau"
            },
            clozeSection: {
                title: "표현 빈칸 채우기",
                titleVi: "Dien vao cho trong",
                guide: "원음에서 들은 핵심 표현을 떠올리며 빈칸을 채워 보세요.",
                guideVi: "Nho lai cau da nghe va dien bieu hien chinh."
            },
            clozeItems: [
                { sentence: "보고서를 깜빡 _____ 집에 두고 왔어요.", sentenceVi: "Con _____ bao cao va de o nha.", blank: "잊고", hint: "깜빡 + 동사", hintVi: "quen mat", explanation: "남자는 보고서를 깜빡 잊고 집에 두고 왔다고 말합니다.", explanationVi: "Nguoi nam noi minh de quen bao cao o nha." },
                { sentence: "크기는 _____ 휴대폰보다는 좀 두꺼워요.", sentenceVi: "Kich thuoc bang _____ nhung day hon.", blank: "휴대폰만한데", hint: "N만 하다", hintVi: "to bang dien thoai", explanation: "물건의 크기를 휴대폰과 비교해 설명합니다.", explanationVi: "Anh so sanh kich thuoc voi dien thoai." },
                { sentence: "거기에 있는 파일 하나만 _____ 보내 주세요.", sentenceVi: "Hay gui mot file trong do qua _____.", blank: "이메일로", hint: "보내는 방법", hintVi: "qua email", explanation: "남자는 파일 하나를 이메일로 보내 달라고 부탁합니다.", explanationVi: "Anh nho gui file qua email." }
            ],
            speakingTask: {
                title: "말하기 출력",
                titleVi: "Dau ra noi",
                prompt: "물건을 찾기 위해 전화로 위치와 모양을 설명하는 상황을 3~4문장으로 말해 보세요.",
                promptVi: "Hay noi 3-4 cau de mo ta vi tri va hinh dang mon do khi goi dien nho tim.",
                placeholder: "제 방 책상 위에 있는 외장 하드 디스크를 찾아 주세요. 노트북 옆에 있고, 까만색에 휴대폰만해요. 짧은 전선이 달려 있어요. 파일 하나만 이메일로 보내 주세요.",
                placeholderVi: "Vi du: Hay tim giup em cai o cung tren ban. No o canh laptop, mau den va to bang dien thoai.",
                tips: ["책상 위", "노트북 옆", "긴 네모 모양", "휴대폰만하다", "이메일로 보내 주세요"],
                tipsVi: ["Tren ban", "Canh laptop", "Hinh chu nhat dai", "Bang dien thoai", "Gui qua email"]
            },
            clarifications: [
                { ko: "뭐 두고 갔니?", vi: "Con de quen gi a?", use: "상대가 무엇을 빠뜨렸는지 물을 때 씁니다.", useVi: "Dung khi hoi nguoi kia de quen gi." },
                { ko: "휴대폰만한데 휴대폰보다는 좀 두꺼워요.", vi: "Bang dien thoai nhung day hon mot chut.", use: "크기를 비교해 물건을 설명할 때 씁니다.", useVi: "Dung khi so sanh kich thuoc." },
                { ko: "그냥 두세요. 제가 갈게요.", vi: "Cu de day. Con se ve.", use: "부탁이 어려워졌을 때 직접 해결하겠다고 말합니다.", useVi: "Dung khi tu minh se giai quyet." }
            ],
            clarificationPrompt: "모양 확인, 크기 비교, 파일 부탁, 직접 해결하기 표현을 상황에 맞게 골라 연습해 보세요.",
            clarificationPromptVi: "Luyen cach hoi hinh dang, so sanh kich thuoc, nho gui file va tu giai quyet.",
            clarifyScenario: "예: '책상 위 노트북 옆에 있는 까만색 물건이에요. 휴대폰만한데 좀 두꺼워요. 파일을 보내기 어려우시면 제가 갈게요.'처럼 말해 보세요.",
            clarifyScenarioVi: "Noi ca vi tri, hinh dang va cach giai quyet cuoi cung.",
            oralFeatures: [
                { term: "깜빡 잊고", type: "문제 설명", typeVi: "Neu van de", note: "실수로 잊은 일을 자연스럽게 설명합니다.", noteVi: "Noi viec minh quen mat." },
                { term: "휴대폰만한데", type: "크기 비교", typeVi: "So sanh kich thuoc", note: "익숙한 물건과 비교해 크기를 설명합니다.", noteVi: "So sanh voi vat quen thuoc." },
                { term: "보내 주세요", type: "부탁 표현", typeVi: "Loi nho", note: "상대에게 필요한 행동을 공손하게 부탁합니다.", noteVi: "Nho doi phuong lam gi mot cach lich su." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                titleVi: "Dung hay sai",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요.",
                guideVi: "Neu dung voi noi dung da nghe thi chon O, neu khong thi chon X."
            },
            tfQuestions: [
                { statement: "남자는 보고서를 집에 두고 와서 전화를 했다.", statementVi: "Nguoi nam goi vi de quen bao cao o nha.", answer: true, explanation: "남자는 보고서를 깜빡 잊고 집에 두고 왔다고 말합니다.", explanationVi: "Anh noi da de quen bao cao o nha." },
                { statement: "남자가 찾는 물건은 까만색이고 짧은 전선이 달려 있다.", statementVi: "Mon do mau den va co day ngan.", answer: true, explanation: "남자는 색깔이 까만색이고 짧은 전선이 달려 있다고 설명합니다.", explanationVi: "Anh noi no mau den va co day ngan." },
                { statement: "남자는 어머니가 보낸 이메일을 기다리기로 했다.", statementVi: "Nguoi nam se doi email cua me.", answer: false, explanation: "어머니가 파일 보내는 방법을 몰라 남자가 직접 가겠다고 합니다.", explanationVi: "Me khong biet gui file nen anh se ve lay." }
            ],
            quizTitle: "이해 점검",
            quizTitleVi: "Kiem tra muc do hieu",
            quizGuideKo: "전화 이유, 찾는 물건, 마지막 행동을 중심으로 정답을 골라 보세요.",
            quizGuideVi: "Chon dap an dung dua tren ly do goi, mon do can tim va hanh dong cuoi.",
            questions: [
                {
                    prompt: "남자는 왜 어머니에게 전화를 했습니까?",
                    promptVi: "Vi sao nguoi nam goi cho me?",
                    answer: "1",
                    explanation: "남자는 오늘까지 내야 하는 보고서를 집에 두고 왔습니다.",
                    explanationVi: "Anh de quen bao cao phai nop hom nay o nha.",
                    options: [
                        { value: "1", label: "보고서를 집에 두고 와서", labelVi: "Vi de quen bao cao o nha" },
                        { value: "2", label: "컴퓨터가 고장 나서", labelVi: "Vi may tinh bi hong" },
                        { value: "3", label: "어머니가 학교에 오시기로 해서", labelVi: "Vi me se den truong" }
                    ]
                },
                {
                    prompt: "남자가 어머니에게 찾아 달라고 한 물건은 무엇입니까?",
                    promptVi: "Nguoi nam nho me tim mon do gi?",
                    answer: "2",
                    explanation: "남자는 제 방 책상 위에 있는 외장 하드 디스크를 찾아 달라고 부탁합니다.",
                    explanationVi: "Anh nho me tim o cung ngoai tren ban trong phong.",
                    options: [
                        { value: "1", label: "휴대폰", labelVi: "Dien thoai" },
                        { value: "2", label: "외장 하드 디스크", labelVi: "O cung ngoai" },
                        { value: "3", label: "둥근 디스크", labelVi: "Cai dia tron" }
                    ]
                },
                {
                    prompt: "마지막에 남자는 어떻게 하기로 했습니까?",
                    promptVi: "Cuoi cung nguoi nam quyet dinh lam gi?",
                    answer: "1",
                    explanation: "어머니가 파일을 보내는 방법을 몰라 남자는 직접 가겠다고 말합니다.",
                    explanationVi: "Me khong biet gui file nen anh noi se ve lay.",
                    options: [
                        { value: "1", label: "직접 집에 가기로 했다.", labelVi: "Se tu ve nha lay" },
                        { value: "2", label: "어머니의 이메일을 기다리기로 했다.", labelVi: "Se doi email cua me" },
                        { value: "3", label: "어머니에게 학교로 가져오라고 했다.", labelVi: "Nho me mang den truong" }
                    ]
                }
            ]
        },
        {
            id: "track75",
            compactSample: {
                removeDictoglossSection: true
            },
            label: "Track 75",
            audioTrackNumber: 75,
            title: "듣기 2: 연을 만들어 보겠어요",
            titleVi: "Nghe 2: Lam dieu",
            summary: "두 사람이 한국의 연 모양에 대해 이야기하고 네모 모양의 연을 만듭니다. 종이 가운데 CD만 하게 구멍을 내고, 뒤쪽에 대나무를 붙이고 실을 묶은 뒤 밖에 나가 연을 날려 보기로 합니다.",
            summaryVi: "Hai nguoi noi ve cac hinh dang cua dieu Han Quoc, lam mot cai dieu hinh vuong, khoet lo bang dia CD, gan tre va buoc day roi ra ngoai tha dieu.",
            grammarLink: {
                href: "grammar1.html",
                title: "문법 연결",
                titleVi: "Lien ket ngu phap",
                label: "N만 하다",
                labelVi: "N-man hada",
                description: "듣기 속 'CD만 하게'처럼 크기를 비교해 설명하는 표현을 문법 1과 연결해 복습합니다.",
                descriptionVi: "On lai cach noi kich thuoc nhu 'bang dia CD' trong bai nghe."
            },
            activityImage: {
                src: "../assets/c16/listening/images/lesson16-listening2-cuttoon.webp",
                alt: "두 사람이 네모 모양의 연을 만드는 열 컷 컷툰",
                altVi: "Khung tranh tam cho hoi thoai lam dieu hinh vuong",
                pendingLabel: "듣기 2 컷툰 이미지를 불러오고 있습니다.",
                pendingLabelVi: "Dang tai tranh cat cho bai nghe 2.",
                pendingHint: "이미지 파일이 없으면 에셋 경로를 확인하세요.",
                pendingHintVi: "Neu khong thay hinh, hay kiem tra duong dan asset.",
                caption: "원음 흐름에 맞춰 10컷 컷툰을 한 컷씩 확대해서 볼 수 있습니다.",
                captionVi: "Co the xem 10 khung tranh theo dong audio."
            },
            audioSrc: null,
            audioSourceType: "original",
            syncVisual: {
                imageSrc: "../assets/c16/listening/images/lesson16-listening2-cuttoon.webp",
                coverImageSrc: "",
                coverAlt: "듣기 2 컷 보기 커버 자리",
                coverAltVi: "Anh bia tam cho bai nghe 2",
                title: "그림 컷 보기",
                titleVi: "Xem theo tung khung tranh",
                copy: "원음 Track 75의 흐름에 맞춰 10컷 컷툰이 한 컷씩 전환되도록 시간 구간을 잡아 두었습니다.",
                copyVi: "10 khung tranh duoc gan voi moc thoi gian cua Track 75.",
                aspectRatio: "1.6 / 1",
                transitionMs: 480,
                coverRevealAt: 0,
                frames: [
                    { start: 0, end: 13.5, x: 5, y: 5, width: 518, height: 332, label: "1", title: "연 만들기 시작", titleVi: "Bat dau lam dieu", caption: "여자는 오늘 연을 만들어 보겠다고 말하고 한국에서 만들어 본 적이 있는지 묻습니다.", captionVi: "Nguoi nu noi hom nay se lam dieu va hoi ve kinh nghiem." },
                    { start: 13.5, end: 20.4, x: 528, y: 5, width: 522, height: 332, label: "2", title: "연날리기 경험", titleVi: "Kinh nghiem thay dieu", caption: "남자는 만들어 본 적은 없지만 한강공원에서 아이들이 연날리기 하는 것을 봤다고 말합니다.", captionVi: "Nguoi nam chua lam nhung da thay tre em tha dieu." },
                    { start: 20.4, end: 27.8, x: 5, y: 344, width: 518, height: 289, label: "3", title: "마름모 연 질문", titleVi: "Hoi ve dieu hinh thoi", caption: "남자는 본 연이 마름모 모양이고 꼬리가 길었다며 한국 연이 다 그런지 묻습니다.", captionVi: "Nguoi nam hoi co phai tat ca dieu deu hinh thoi va co duoi dai khong." },
                    { start: 27.8, end: 42.6, x: 528, y: 344, width: 522, height: 289, label: "4", title: "네모 모양 연 확인", titleVi: "Xac nhan dieu hinh vuong", caption: "여자는 여러 가지 모양이 있다고 설명하고, 오늘 만들 연은 네모 모양임을 확인합니다.", captionVi: "Nguoi nu giai thich co nhieu hinh va hom nay lam dieu hinh vuong." },
                    { start: 42.6, end: 51.7, x: 5, y: 640, width: 518, height: 276, label: "5", title: "가운데 구멍 내기", titleVi: "Khoet lo o giua", caption: "여자는 먼저 종이 가운데 동그랗게 구멍을 내라고 설명합니다.", captionVi: "Nguoi nu noi hay khoet mot lo tron o giua giay." },
                    { start: 51.7, end: 64.3, x: 528, y: 640, width: 522, height: 276, label: "6", title: "CD만 하게 자르기", titleVi: "Cat bang dia CD", caption: "구멍은 음악 CD만 하게 만들고, CD를 놓고 동그라미를 그린 뒤 자릅니다.", captionVi: "Lam lo bang dia CD, ve vong tron roi cat." },
                    { start: 64.3, end: 67.8, x: 5, y: 922, width: 518, height: 237, label: "7", title: "구멍 확인", titleVi: "Kiem tra lo", caption: "남자가 이렇게 하면 되는지 묻고, 여자는 좋다고 확인합니다.", captionVi: "Nguoi nam hoi lam vay duoc khong, nguoi nu noi tot." },
                    { start: 67.8, end: 72.8, x: 528, y: 922, width: 522, height: 237, label: "8", title: "대나무와 실 묶기", titleVi: "Gan tre va buoc day", caption: "뒤쪽에 대나무를 붙이고 실을 묶으면 연이 완성됩니다.", captionVi: "Gan tre o mat sau va buoc day la xong." },
                    { start: 72.8, end: 81.5, x: 5, y: 1167, width: 518, height: 318, label: "9", title: "밖에서 날려 보기", titleVi: "Ra ngoai tha dieu", caption: "두 사람은 밖에 나가 연을 날려 보고 누가 잘하는지 보기로 합니다.", captionVi: "Hai nguoi ra ngoai tha dieu va xem ai gioi hon." },
                    { start: 81.5, end: 89.5, x: 528, y: 1167, width: 522, height: 318, label: "10", title: "연날리기 자신감", titleVi: "Tu tin tha dieu", caption: "남자는 고향에서 연날리기를 잘하기로 유명했다며 자신 있게 말합니다.", captionVi: "Nguoi nam noi minh noi tieng la tha dieu gioi o que." }
                ]
            },
            scene: {
                emoji: "",
                title: "상황 그림: 네모 모양의 연 만들기",
                titleVi: "Tinh huong: lam dieu hinh vuong",
                caption: "두 사람이 한국의 연 모양과 만드는 방법을 들으며 종이, CD, 대나무, 실을 이용해 연을 만듭니다.",
                captionVi: "Hai nguoi hoc hinh dang va cach lam dieu bang giay, CD, tre va day.",
                tags: ["연", "마름모", "네모 모양", "CD만 하게", "대나무"]
            },
            preListening: {
                vocab: [
                    { ko: "연", vi: "dieu", hint: "바람을 이용해 하늘에 띄우는 놀이 도구" },
                    { ko: "연날리기", vi: "tha dieu", hint: "연을 하늘에 띄우는 활동" },
                    { ko: "마름모", vi: "hinh thoi", hint: "다이아몬드처럼 기울어진 네모 모양" },
                    { ko: "CD만 하게", vi: "to bang dia CD", hint: "크기를 CD와 비슷하게 비교하는 표현" },
                    { ko: "대나무", vi: "tre", hint: "연의 뼈대로 붙이는 가늘고 긴 나무" }
                ],
                relationshipOptions: [
                    { value: "teacher-student", label: "선생님과 학생" },
                    { value: "mother-son", label: "어머니와 아들" },
                    { value: "shop-customer", label: "가게 직원과 손님" }
                ],
                relationshipAnswer: "teacher-student",
                genreOptions: [
                    { value: "making-instructions", label: "만들기 설명" },
                    { value: "phone-request", label: "전화 부탁" },
                    { value: "travel-plan", label: "여행 계획" }
                ],
                genreAnswer: "making-instructions",
                predictionNote: "무엇을 만드는지, 연의 모양은 어떤지, 구멍을 얼마나 크게 만드는지 들어 보세요.",
                predictionNoteVi: "Hay nghe xem ho lam gi, hinh dang cua dieu la gi, va lo lon bang gi.",
                backgroundPrompt: "연이나 장난감을 직접 만들어 본 적이 있나요? 어떤 순서로 만들었나요?",
                backgroundPromptVi: "Em da tung tu lam dieu hay do choi chua? Da lam theo thu tu nao?"
            },
            transcript: [
                { speaker: "안내", text: "잘 듣고 질문에 답하세요.", vi: "Hay nghe ky va tra loi cau hoi.", start: 3.22, end: 6.42, keywords: ["질문에 답하세요"] },
                { speaker: "여자", text: "오늘은 연을 만들어 보겠어요.", vi: "Hom nay chung ta se thu lam dieu.", start: 7.44, end: 9.92, keywords: ["연", "만들어 보겠어요"] },
                { speaker: "여자", text: "한국에서 연을 만들어 본 적이 있어요?", vi: "Ban da tung lam dieu o Han Quoc chua?", start: 10.62, end: 13.26, keywords: ["만들어 본 적"] },
                { speaker: "남자", text: "아니요. 하지만 한강공원에서 아이들이 연날리기 하는 걸 본 적이 있어요.", vi: "Chua. Nhung toi da tung thay tre em tha dieu o cong vien Hangang.", start: 14.34, end: 19.88, keywords: ["한강공원", "연날리기"] },
                { speaker: "남자", text: "연이 마름모 모양이고 꼬리가 길던데요.", vi: "Cai dieu co hinh thoi va duoi dai.", start: 20.82, end: 24.34, keywords: ["마름모 모양", "꼬리"] },
                { speaker: "남자", text: "한국의 연은 다 그렇게 생겼나요?", vi: "Tat ca dieu Han Quoc deu nhu vay a?", start: 24.54, end: 26.76, keywords: ["다 그렇게"] },
                { speaker: "여자", text: "그렇지 않아요.", vi: "Khong phai vay.", start: 27.80, end: 28.70, keywords: ["그렇지 않아요"] },
                { speaker: "여자", text: "세모, 네모, 마름모 등 여러 가지 모양이 있어요.", vi: "Co nhieu hinh dang nhu tam giac, vuong, hinh thoi.", start: 28.70, end: 33.36, keywords: ["세모", "네모", "마름모"] },
                { speaker: "여자", text: "오늘은 이 연을 만들어 봐요.", vi: "Hom nay chung ta lam cai dieu nay.", start: 34.28, end: 36.40, keywords: ["이 연"] },
                { speaker: "남자", text: "이건 네모 모양이네요.", vi: "Cai nay hinh vuong nhi.", start: 37.32, end: 38.78, keywords: ["네모 모양"] },
                { speaker: "여자", text: "그래요. 이제 만들어 볼까요?", vi: "Dung vay. Bay gio bat dau lam nhe?", start: 39.90, end: 42.28, keywords: ["만들어 볼까요"] },
                { speaker: "여자", text: "먼저 종이 가운데 동그랗게 구멍을 내세요.", vi: "Truoc tien hay khoet mot lo tron o giua to giay.", start: 43.26, end: 47.44, keywords: ["종이 가운데", "구멍"] },
                { speaker: "여자", text: "연의 구멍을 만들어 주면 연이 잘 날거든요.", vi: "Neu lam lo cho dieu thi no bay tot.", start: 47.74, end: 51.34, keywords: ["잘 날거든요"] },
                { speaker: "남자", text: "구멍은 얼마나 크게 만들어야 해요?", vi: "Phai lam lo to den muc nao?", start: 51.88, end: 54.16, keywords: ["얼마나 크게"] },
                { speaker: "여자", text: "이 음악 CD만 하게 만들면 돼요.", vi: "Lam to bang dia CD nhac nay la duoc.", start: 55.20, end: 57.68, keywords: ["CD만 하게"] },
                { speaker: "여자", text: "CD를 줄 테니까 종이 위에 놓고 동그라미를 그린 후에 자르세요.", vi: "Toi dua CD, hay dat len giay, ve vong tron roi cat.", start: 57.68, end: 64.08, keywords: ["동그라미", "자르세요"] },
                { speaker: "남자", text: "이렇게 하면 되나요?", vi: "Lam nhu the nay duoc khong?", start: 64.42, end: 65.62, keywords: ["이렇게"] },
                { speaker: "여자", text: "네, 좋아요.", vi: "Vang, tot.", start: 66.66, end: 67.48, keywords: ["좋아요"] },
                { speaker: "여자", text: "이제 뒤쪽에 대나무를 붙이고 실을 묶으면 돼요.", vi: "Bay gio gan tre o mat sau va buoc day la duoc.", start: 68.24, end: 72.34, keywords: ["대나무", "실을 묶으면"] },
                { speaker: "남자", text: "어서 날려 보고 싶어요.", vi: "Toi muon tha thu ngay.", start: 73.42, end: 74.92, keywords: ["날려 보고 싶어요"] },
                { speaker: "여자", text: "그럼 나가서 한번 날려 봐요.", vi: "Vay chung ta ra ngoai tha thu di.", start: 75.98, end: 78.60, keywords: ["나가서", "날려 봐요"] },
                { speaker: "여자", text: "누가 연날리기를 잘하는지 볼까요?", vi: "Thu xem ai tha dieu gioi hon nhe?", start: 78.80, end: 80.88, keywords: ["누가", "잘하는지"] },
                { speaker: "남자", text: "제가 이길걸요.", vi: "Chac toi se thang day.", start: 81.96, end: 83.34, keywords: ["이길걸요"] },
                { speaker: "남자", text: "제가 고향에서 연날리기 잘하기로 유명했거든요.", vi: "O que toi, toi noi tieng la tha dieu gioi.", start: 83.82, end: 87.30, keywords: ["고향", "연날리기", "유명했거든요"] }
            ],
            publicCues: [
                { speaker: "여자", start: 7.44, end: 13.26, keywords: ["연을 만들어 보겠어요", "만들어 본 적"], extraKeywords: ["활동 시작"] },
                { speaker: "남자", start: 20.82, end: 38.78, keywords: ["마름모 모양", "여러 가지 모양", "네모 모양"], extraKeywords: ["연 모양"] },
                { speaker: "여자", start: 43.26, end: 72.34, keywords: ["구멍을 내세요", "CD만 하게", "대나무", "실"], extraKeywords: ["만드는 순서"] },
                { speaker: "남자", start: 81.96, end: 87.30, keywords: ["제가 이길걸요", "연날리기 잘하기로 유명"], extraKeywords: ["마지막 내용"] }
            ],
            dictogloss: {
                prompt: "연의 모양, 만드는 순서, 마지막에 두 사람이 하려는 일을 3문장으로 정리해 보세요.",
                promptVi: "Tom tat hinh dang cua dieu, thu tu lam va viec hai nguoi se lam cuoi cung.",
                keywords: ["연", "마름모", "네모 모양", "CD만 하게", "대나무", "실", "날려 봐요"],
                modelSummary: "두 사람은 한국의 연에는 세모, 네모, 마름모 등 여러 가지 모양이 있다고 이야기한다. 오늘 만드는 연은 네모 모양이고, 종이 가운데 CD만 하게 구멍을 낸 뒤 뒤쪽에 대나무를 붙이고 실을 묶는다. 만든 후에는 밖에 나가서 누가 연날리기를 잘하는지 보기로 한다.",
                placeholder: "핵심어를 활용해 만드는 순서와 마지막 행동을 정리해 보세요.",
                placeholderVi: "Dung tu khoa de tom tat thu tu lam va hanh dong cuoi."
            },
            sequenceTask: {
                title: "연 만들기 흐름 배열",
                titleVi: "Sap xep thu tu lam dieu",
                guide: "대화에서 나온 만들기와 활동의 순서를 배열해 보세요.",
                guideVi: "Sap xep cac viec theo thu tu xuat hien.",
                checkLabel: "순서 확인",
                checkLabelVi: "Kiem tra thu tu",
                resetLabel: "다시 섞기",
                resetLabelVi: "Tron lai",
                statusInitial: "항목을 움직여 연 만들기 흐름을 맞춰 보세요.",
                statusInitialVi: "Di chuyen cac muc de sap xep dung dong hoi thoai.",
                statusCorrect: "순서가 맞습니다. 모양 확인부터 연날리기까지 흐름을 잘 잡았습니다.",
                statusCorrectVi: "Dung thu tu.",
                statusIncorrect: "다시 들으며 모양을 확인한 뒤 만드는 순서가 어떻게 이어지는지 확인해 보세요.",
                statusIncorrectVi: "Nghe lai thu tu sau khi xac nhan hinh dang.",
                items: [
                    { id: "kite-1", label: "한국에서 연을 만들어 본 적이 있는지 묻는다.", labelVi: "Hoi da tung lam dieu o Han Quoc chua" },
                    { id: "kite-2", label: "한국의 연에는 여러 가지 모양이 있다고 설명한다.", labelVi: "Giai thich dieu co nhieu hinh dang" },
                    { id: "kite-3", label: "종이 가운데 CD만 하게 구멍을 낸다.", labelVi: "Khoet lo o giua giay bang dia CD" },
                    { id: "kite-4", label: "대나무를 붙이고 실을 묶은 뒤 밖에서 날려 본다.", labelVi: "Gan tre, buoc day, roi ra ngoai tha thu" }
                ],
                answerOrder: ["kite-1", "kite-2", "kite-3", "kite-4"]
            },
            notePrompts: {
                keywords: "연, 한강공원, 마름모, 네모, CD만 하게, 구멍, 대나무, 실, 연날리기",
                details: "연의 모양과 만드는 순서를 나누어 적기",
                questions: "구멍을 왜 만드는지, 얼마나 크게 만드는지 적기",
                cue: "무엇 / 경험 / 모양 / 순서 / 결과",
                notes: "재료와 동작을 순서대로 메모하기",
                summary: "연 만드는 방법을 두 문장으로 요약하기"
            },
            notePromptsVi: {
                keywords: "Dieu, cong vien Hangang, hinh thoi, hinh vuong, bang CD, lo, tre, day, tha dieu",
                details: "Ghi hinh dang va thu tu lam dieu",
                questions: "Ghi vi sao lam lo va lo to bang gi",
                cue: "Cai gi / kinh nghiem / hinh dang / thu tu / ket qua",
                notes: "Ghi vat lieu va hanh dong theo thu tu",
                summary: "Tom tat cach lam dieu bang hai cau"
            },
            clozeSection: {
                title: "표현 빈칸 채우기",
                titleVi: "Dien vao cho trong",
                guide: "원음에서 들은 핵심 표현을 떠올리며 빈칸을 채워 보세요.",
                guideVi: "Nho lai cau da nghe va dien bieu hien chinh."
            },
            clozeItems: [
                { sentence: "오늘은 연을 _____ 보겠어요.", sentenceVi: "Hom nay chung ta se thu _____ dieu.", blank: "만들어", hint: "V-아/어 보다", hintVi: "thu lam", explanation: "대화는 연을 만들어 보겠다는 말로 시작합니다.", explanationVi: "Hoi thoai bat dau bang viec thu lam dieu." },
                { sentence: "이 음악 CD만 _____ 만들면 돼요.", sentenceVi: "Lam to _____ dia CD la duoc.", blank: "하게", hint: "N만 하게", hintVi: "bang", explanation: "구멍의 크기를 음악 CD와 비교해 설명합니다.", explanationVi: "Kich thuoc lo duoc so sanh voi dia CD." },
                { sentence: "제가 고향에서 연날리기 _____ 유명했거든요.", sentenceVi: "O que toi, toi noi tieng la _____ dieu gioi.", blank: "잘하기로", hint: "A/V-기로 유명하다", hintVi: "noi tieng la", explanation: "마지막에 남자가 연날리기를 잘하기로 유명했다고 말합니다.", explanationVi: "Cuoi bai, nguoi nam noi minh noi tieng la tha dieu gioi." }
            ],
            speakingTask: {
                title: "말하기 출력",
                titleVi: "Dau ra noi",
                prompt: "연이나 간단한 물건을 만드는 방법을 재료와 순서가 드러나게 3~4문장으로 말해 보세요.",
                promptVi: "Hay noi 3-4 cau ve cach lam mot mon do, gom vat lieu va thu tu.",
                placeholder: "먼저 종이 가운데 CD만 하게 구멍을 내세요. 그다음 뒤쪽에 대나무를 붙이세요. 마지막으로 실을 묶으면 돼요. 다 만들면 밖에서 한번 날려 보세요.",
                placeholderVi: "Vi du: Truoc tien khoet lo bang CD. Sau do gan tre o mat sau. Cuoi cung buoc day va ra ngoai tha thu.",
                tips: ["먼저", "CD만 하게", "그린 후에 자르세요", "대나무를 붙이다", "실을 묶다"],
                tipsVi: ["Truoc tien", "Bang CD", "Ve roi cat", "Gan tre", "Buoc day"]
            },
            clarifications: [
                { ko: "한국의 연은 다 그렇게 생겼나요?", vi: "Tat ca dieu Han Quoc deu nhu vay a?", use: "모양이 모두 같은지 확인할 때 씁니다.", useVi: "Dung khi hoi tat ca co giong vay khong." },
                { ko: "얼마나 크게 만들어야 해요?", vi: "Phai lam to den muc nao?", use: "크기 기준을 다시 물을 때 씁니다.", useVi: "Dung khi hoi tieu chuan kich thuoc." },
                { ko: "제가 이길걸요.", vi: "Chac toi se thang day.", use: "자신 있게 예상할 때 씁니다.", useVi: "Dung khi du doan mot cach tu tin." }
            ],
            clarificationPrompt: "모양 확인, 크기 기준 묻기, 자신 있게 예상하기 표현을 상황에 맞게 골라 연습해 보세요.",
            clarificationPromptVi: "Luyen hoi hinh dang, hoi kich thuoc va du doan tu tin.",
            clarifyScenario: "예: '구멍은 얼마나 크게 만들어야 해요? CD만 하게 만들면 돼요. 제가 연날리기는 잘할걸요.'처럼 말해 보세요.",
            clarifyScenarioVi: "Luyen noi ve kich thuoc va du doan ket qua.",
            oralFeatures: [
                { term: "만들어 보겠어요", type: "시도 표현", typeVi: "Thu lam", note: "새로운 활동을 해 보겠다고 말합니다.", noteVi: "Noi se thu lam mot viec moi." },
                { term: "CD만 하게", type: "크기 비교", typeVi: "So sanh kich thuoc", note: "크기를 익숙한 물건과 비교합니다.", noteVi: "So sanh kich thuoc voi vat quen thuoc." },
                { term: "잘하기로 유명했거든요", type: "유명함 표현", typeVi: "Noi tieng la", note: "어떤 일을 잘하는 것으로 알려졌다고 말합니다.", noteVi: "Noi minh noi tieng ve mot kha nang." }
            ],
            tfSection: {
                title: "맞아요 / 아니에요",
                titleVi: "Dung hay sai",
                guide: "들은 내용과 맞으면 O, 맞지 않으면 X를 고르세요.",
                guideVi: "Neu dung voi noi dung da nghe thi chon O, neu khong thi chon X."
            },
            tfQuestions: [
                { statement: "남자는 한국에서 연을 만들어 본 적이 있다.", statementVi: "Nguoi nam da tung lam dieu o Han Quoc.", answer: false, explanation: "남자는 만들어 본 적은 없고, 한강공원에서 아이들이 연날리기 하는 것을 본 적이 있다고 말합니다.", explanationVi: "Nguoi nam chua lam dieu, chi da thay tre em tha dieu." },
                { statement: "오늘 만드는 연은 네모 모양이다.", statementVi: "Cai dieu hom nay co hinh vuong.", answer: true, explanation: "여자는 '이건 네모 모양이네요'라고 말합니다.", explanationVi: "Nguoi nu noi cai nay hinh vuong." },
                { statement: "종이 가운데 CD만 하게 구멍을 낸다.", statementVi: "Khoet lo o giua giay to bang dia CD.", answer: true, explanation: "남자는 음악 CD만 하게 구멍을 만들면 된다고 설명합니다.", explanationVi: "Nguoi nam noi lam lo to bang dia CD." }
            ],
            quizTitle: "이해 점검",
            quizTitleVi: "Kiem tra muc do hieu",
            quizGuideKo: "무엇을 하는지, 오늘 만드는 연의 모양, 마지막 내용까지 확인해 보세요.",
            quizGuideVi: "Kiem tra ho dang lam gi, hinh dang cai dieu, va noi dung cuoi.",
            questions: [
                {
                    prompt: "두 사람은 지금 무엇을 하고 있습니까?",
                    promptVi: "Hai nguoi dang lam gi?",
                    answer: "2",
                    explanation: "처음에 '오늘은 연을 만들어 보겠어요'라고 말합니다.",
                    explanationVi: "Dau bai noi hom nay se thu lam dieu.",
                    options: [
                        { value: "1", label: "연을 날리고 있다.", labelVi: "Dang tha dieu" },
                        { value: "2", label: "연을 만들고 있다.", labelVi: "Dang lam dieu" },
                        { value: "3", label: "연날리기를 구경하고 있다.", labelVi: "Dang xem tha dieu" }
                    ]
                },
                {
                    prompt: "오늘 만드는 연은 다음 중 어느 것입니까?",
                    promptVi: "Cai dieu hom nay la cai nao?",
                    answer: "1",
                    explanation: "대화에서 오늘 만드는 연은 네모 모양이라고 말합니다.",
                    explanationVi: "Hoi thoai noi cai dieu hom nay co hinh vuong.",
                    options: [
                        { value: "1", label: "네모 모양의 연", labelVi: "Dieu hinh vuong" },
                        { value: "2", label: "마름모 모양에 꼬리가 긴 연", labelVi: "Dieu hinh thoi co duoi dai" },
                        { value: "3", label: "상자 모양의 입체 연", labelVi: "Dieu hinh hop" }
                    ]
                },
                {
                    prompt: "들은 내용과 맞는 것을 고르세요.",
                    promptVi: "Hay chon cau dung voi noi dung nghe.",
                    answer: "1",
                    explanation: "마지막에 남자는 고향에서 연날리기를 잘하기로 유명했다고 합니다.",
                    explanationVi: "Cuoi bai, nguoi nam noi minh noi tieng la tha dieu gioi o que.",
                    options: [
                        { value: "1", label: "남자는 고향에서 연날리기를 잘하기로 유명했다.", labelVi: "Nguoi nam noi tieng la tha dieu gioi o que" },
                        { value: "2", label: "남자는 한강공원에서 연날리기를 해 본 적이 있다.", labelVi: "Nguoi nam da tung tha dieu o cong vien Hangang" },
                        { value: "3", label: "두 사람은 연날리기를 하러 한강공원에 갈 것이다.", labelVi: "Hai nguoi se den cong vien Hangang tha dieu" }
                    ]
                }
            ]
        }
    ];

    function cloneLesson(lesson) {
        return JSON.parse(JSON.stringify(lesson));
    }

    window.C16_LISTENING_LESSONS = lessons;
    window.createC16ListeningWorkbookConfig = function createC16ListeningWorkbookConfig(options) {
        const settings = options || {};
        const requestedIds = Array.isArray(settings.lessonIds) && settings.lessonIds.length ? settings.lessonIds : lessons.map((lesson) => lesson.id);
        const selectedLessons = requestedIds
            .map((id) => lessons.find((lesson) => lesson.id === id))
            .filter(Boolean)
            .map(cloneLesson);

        return {
            kicker: "Chapter 16 Listening Lab",
            title: settings.title || "16과 듣기",
            titleVi: settings.titleVi || "Luyen nghe bai 16",
            description: settings.description || "16과 듣고 말하기 Track 74, 75를 바탕으로 물건 모양 설명과 연 만들기 대화를 연습하는 워크북입니다.",
            descriptionVi: settings.descriptionVi || "Workbook nghe bai 16 dua tren Track 74 va 75.",
            layoutVariant: "audio-in-pre",
            sampleCompact: {
                enabled: true,
                defaults: {
                    hideSceneCard: true,
                    hideRoutine: true,
                    hideFeatureCards: true,
                    hideNoteSection: true,
                    hideClarificationSection: true,
                    hideSpeakingTask: true,
                    relocateQuizBelowSubtitle: true,
                    quizStartsCollapsed: true
                }
            },
            instructionLanguage: {
                enabled: true,
                default: "ko"
            },
            lessons: selectedLessons
        };
    };
})();
