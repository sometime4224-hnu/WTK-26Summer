(function () {
    const config = window.LISTENING_WORKBOOK_CONFIG;
    if (!config || !Array.isArray(config.lessons)) return;

    function makeChunks(text, start, end) {
        const words = String(text || "").match(/\S+/g) || [];
        const duration = Math.max(Number(end) - Number(start), 0.1);
        const weights = words.map((word) => Math.max(word.replace(/[.,?!]/g, "").length, 1));
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || words.length || 1;
        let cursor = Number(start);
        return words.map((word, index) => {
            const isLast = index === words.length - 1;
            const chunkStart = Number(cursor.toFixed(3));
            const chunkEnd = isLast
                ? Number(Number(end).toFixed(3))
                : Number((cursor + duration * (weights[index] / totalWeight)).toFixed(3));
            cursor = chunkEnd;
            return { text: word, start: chunkStart, end: Math.max(chunkEnd, chunkStart) };
        });
    }

    function line(speaker, start, end, text, keywords) {
        return {
            speaker,
            start,
            end,
            text,
            keywords,
            chunks: makeChunks(text, start, end)
        };
    }

    function panel(imageSrc, start, end, title, note) {
        return { imageSrc, start, end, title, note, alt: title };
    }

    const track30Panels = "../assets/c12/listening/cuttoon/listening1/listening1-cuttoon-panel-";
    const track31Panels = "../assets/c12/listening/cuttoon/listening2/listening2-cuttoon-panel-";
    const webp = ".webp";

    const DATA = {
        track30: {
            audioTrackNumber: 30,
            audioSrc: "../assets/c12/listening/audio/Seoul Univ_3B_Trk_30.mp3",
            audioPreload: "metadata",
            audioInstruction: {
                text: "잘 듣고 질문에 답하세요.",
                start: 2.94,
                end: 6.48,
                bodyStart: 7.52
            },
            audioAnalysis: {
                source: "faster-whisper medium word/segment timestamps, checked against silence detection",
                duration: 85.708
            },
            transcript: [
                line("남자", 7.52, 14.34, "여러분, 안녕하십니까? 건강 상담 시간입니다. 먼저 시청자 한 분의 고민을 들어 보겠습니다.", ["건강 상담", "시청자", "고민"]),
                line("여자", 15.08, 35.14, "안녕하세요. 저는 인천에 사는 이민지라고 합니다. 백화점에서 판매 일을 하고 있는데요. 계속 서서 일을 했더니 몸이 안 좋아졌어요. 아침에 일어나면 다리가 퉁퉁 붓고 무릎이 아파서 계단을 올라가기도 힘들어요.", ["백화점", "판매 일", "다리", "무릎"]),
                line("남자", 35.5, 37.7, "규칙적으로 운동은 하고 계십니까?", ["규칙적", "운동"]),
                line("여자", 38.7, 44.38, "직장이 멀어서 집에 돌아오면 밤 10시가 넘어요. 운동할 시간이 없어요.", ["직장", "밤 10시", "시간"]),
                line("남자", 45.5, 66.34, "그래도 가장 좋은 방법은 운동입니다. 운동할 시간이 없다면 평소에 발목을 자주 움직여 주고, 자기 전에는 누워서 다리를 위로 올리고 가볍게 스트레칭하세요. 다리가 심하게 아플 때는 뜨거운 수건으로 마사지하는 것도 좋습니다.", ["운동", "발목", "스트레칭", "마사지"]),
                line("여자", 66.98, 72.5, "감사합니다, 선생님. 굽이 높은 구두도 다리 건강에는 나쁘죠?", ["굽", "구두", "다리 건강"]),
                line("남자", 73.48, 80.84, "물론입니다. 하지만 굽이 너무 낮은 구두도 안 좋습니다. 3cm 정도가 적당합니다.", ["낮은 구두", "3cm", "적당"]),
                line("여자", 80.84, 83.62, "네, 잘 알겠습니다.", ["알겠습니다"])
            ],
            cuttoonSync: {
                title: "건강 상담 컷툰",
                copy: "Track 30의 지시문은 2.94-6.48초, 실제 지문은 7.52초부터 시작합니다."
            },
            cuttoonPanels: [
                panel(`${track30Panels}01${webp}`, 7.52, 10.78, "건강 상담 방송 시작", "진행자가 건강 상담 시간을 시작합니다."),
                panel(`${track30Panels}02${webp}`, 11.52, 15.08, "시청자 고민 소개", "시청자의 고민을 들어 보겠다고 안내합니다."),
                panel(`${track30Panels}03${webp}`, 15.08, 23.2, "백화점 판매 일", "여자가 백화점에서 판매 일을 한다고 말합니다."),
                panel(`${track30Panels}04${webp}`, 24.02, 35.14, "다리와 무릎 통증", "오래 서서 일해 다리가 붓고 무릎이 아픕니다."),
                panel(`${track30Panels}05${webp}`, 35.5, 44.38, "운동할 시간이 없음", "퇴근이 늦어 운동할 시간이 없다고 말합니다."),
                panel(`${track30Panels}06${webp}`, 45.5, 54.42, "발목 자주 움직이기", "평소에 발목을 자주 움직이라고 조언합니다."),
                panel(`${track30Panels}07${webp}`, 54.42, 60.36, "다리 올리고 스트레칭", "자기 전에는 누워서 다리를 올리고 스트레칭합니다."),
                panel(`${track30Panels}08${webp}`, 60.6, 66.34, "뜨거운 수건 마사지", "다리가 심하게 아플 때는 뜨거운 수건으로 마사지합니다."),
                panel(`${track30Panels}09${webp}`, 66.98, 83.62, "구두 굽은 3cm 정도", "굽이 너무 높거나 낮은 구두는 좋지 않습니다.")
            ]
        },
        track31: {
            audioTrackNumber: 31,
            audioSrc: "../assets/c12/listening/audio/Seoul Univ_3B_Trk_31.mp3",
            audioPreload: "metadata",
            audioInstruction: {
                text: "잘 듣고 질문에 답하세요.",
                start: 3.08,
                end: 6.7,
                bodyStart: 7.8
            },
            audioAnalysis: {
                source: "faster-whisper medium word/segment timestamps, checked against silence detection",
                duration: 98.795
            },
            transcript: [
                line("남자", 7.8, 12.98, "선생님이 가르쳐 주신 대로 운동했더니 요즘 몸이 많이 좋아졌어요.", ["운동", "몸", "좋아졌어요"]),
                line("여자", 13.92, 18.74, "정말 많이 좋아지셨네요. 그동안 운동을 열심히 하신 모양이네요.", ["좋아지셨네요", "열심히"]),
                line("남자", 19.88, 32.32, "네. 하루도 빠짐없이 달리기도 하고 근육 운동도 했더니 배도 많이 들어갔어요. 그래서 이번에는 더 열심히 해서 복근도 만들어 보려고요.", ["달리기", "근육 운동", "복근"]),
                line("여자", 33.56, 37.46, "네, 지금까지 하던 대로 열심히 하시면 가능해요.", ["가능해요"]),
                line("남자", 38.38, 43.48, "복근을 만들려면 역시 윗몸 일으키기를 많이 하는 게 좋겠죠?", ["복근", "윗몸 일으키기"]),
                line("여자", 44.6, 60.44, "보통 그렇게 생각하기 쉬운데 윗몸 일으키기만 하면 복근을 만들 수 없어요. 줄넘기나 옆구리 운동을 함께 해야 돼요. 그리고 중요한 건 음식이에요. 술이나 단 음식은 절대 먹으면 안 돼요.", ["줄넘기", "옆구리 운동", "음식", "단 음식"]),
                line("남자", 61.6, 67.6, "그건 정말 곤란한데요. 제가 다니는 회사는 회식을 자주 해서요.", ["곤란", "회사", "회식"]),
                line("여자", 68.48, 81.44, "회식 때는 어쩔 수 없겠지만 그래도 한번 노력은 해 보세요. 그렇게 하면 효과를 더 빨리 얻을 수 있으니까요. 배에 복근이 생기면 얼마나 멋있는지 몰라요.", ["노력", "효과", "복근"]),
                line("남자", 81.44, 96.6, "그건 그래요. 운동을 시작하고 나서 회사에서 인기도 많아졌어요. 그리고 몸도 가볍고 기분이 상쾌해져서 일도 더 잘하게 되었어요. 계속 많이 도와주세요.", ["인기", "상쾌", "일", "도와주세요"])
            ],
            cuttoonSync: {
                title: "복근 운동 상담 컷툰",
                copy: "Track 31의 지시문은 3.08-6.70초, 실제 지문은 7.80초부터 시작합니다."
            },
            cuttoonFullscreen: {
                enabled: true,
                title: "듣기 2 전체화면",
                openLabel: "전체화면 듣기",
                playLabel: "재생",
                pauseLabel: "일시정지",
                closeLabel: "닫기"
            },
            cuttoonPanels: [
                panel(`${track31Panels}01${webp}`, 7.8, 18.74, "몸이 많이 좋아짐", "남자가 운동 후 몸이 좋아졌다고 말합니다."),
                panel(`${track31Panels}02${webp}`, 19.88, 26.96, "달리기와 근육 운동", "하루도 빠짐없이 달리기와 근육 운동을 했습니다."),
                panel(`${track31Panels}03${webp}`, 26.96, 37.46, "복근 만들기 목표", "이번에는 더 열심히 해서 복근을 만들고 싶어 합니다."),
                panel(`${track31Panels}04${webp}`, 38.38, 43.48, "윗몸 일으키기 질문", "복근에는 윗몸 일으키기가 좋은지 묻습니다."),
                panel(`${track31Panels}05${webp}`, 44.6, 60.44, "운동과 음식 조언", "줄넘기, 옆구리 운동, 음식 조절을 함께 해야 합니다."),
                panel(`${track31Panels}06${webp}`, 61.6, 67.6, "회식 때문에 곤란", "회사 회식이 잦아서 음식 조절이 어렵다고 말합니다."),
                panel(`${track31Panels}07${webp}`, 68.48, 81.44, "노력하면 효과", "그래도 노력하면 효과를 더 빨리 얻을 수 있다고 조언합니다."),
                panel(`${track31Panels}08${webp}`, 81.44, 96.6, "운동 후 회사 변화", "인기가 많아지고 몸과 기분, 일까지 좋아졌다고 말합니다.")
            ]
        }
    };

    config.lessons.forEach((lesson) => {
        const syncData = DATA[lesson.id];
        if (!syncData) return;
        Object.assign(lesson, syncData);
    });
})();
