(() => {
    "use strict";

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const STT_SUPPORTED = Boolean(
        SpeechRecognitionClass &&
        (window.isSecureContext || ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:")
    );

    const CHOSEONG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const JUNGSEONG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
    const JONGSEONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

    const QUIZ_ITEMS = [
        {
            id: "bored",
            mode: "write",
            originalWord: "따분하다",
            focusWord: "따분하다",
            targetExpression: "따분해하다",
            sceneNote: "직접 -아/어하다로 바꾸기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-07.webp",
            alt: "지루해 보이는 학생 그림",
            taskPrompt: "아이의 상태가 드러나도록 한 문장으로 써 보세요.",
            cueWords: ["아이", "따분하다"],
            frame: "아이가 ____.",
            answers: [
                "아이가 따분해해요.",
                "아이는 따분해해요.",
                "학생이 따분해해요.",
                "학생은 따분해해요."
            ],
            checkpoints: [
                { label: "사람", variants: ["아이", "학생"], required: true },
                { label: "반응", variants: ["따분해해"], required: true }
            ],
            tip: "내 감정이면 “따분해요”, 다른 사람의 감정이면 “따분해해요”처럼 말해요."
        },
        {
            id: "uncomfortable",
            mode: "speak",
            originalWord: "불편하다",
            focusWord: "불편하다",
            targetExpression: "불편해하다",
            sceneNote: "장면 속 사람의 상태를 보고 반응을 말해 보기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-10.webp",
            alt: "길이 불편해 보이는 장면 그림",
            taskPrompt: "그림 속 사람의 상태를 말로 표현해 보세요.",
            cueWords: ["이 사람", "길", "불편하다"],
            frame: "이 사람이 길이 불편해서 ____.",
            answers: [
                "이 사람이 길이 불편해서 불편해해요.",
                "사람이 길이 불편해서 불편해해요."
            ],
            checkpoints: [
                { label: "사람", variants: ["이사람", "사람"], required: true },
                { label: "길", variants: ["길"], required: true },
                { label: "반응", variants: ["불편해해"], required: true }
            ],
            tip: "장면의 상태를 한 번 말하고, 그 상태 때문에 사람이 어떻게 느끼는지 이어 주면 더 자연스러워요."
        },
        {
            id: "clean-air",
            mode: "write",
            originalWord: "공기가 맑다",
            focusWord: "좋다",
            targetExpression: "좋아하다",
            sceneNote: "그림의 분위기를 보고 누군가의 선호를 말하기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-05.webp",
            alt: "공기가 맑은 시골 풍경 그림",
            taskPrompt: "이 풍경을 본 민수 씨의 반응을 써 보세요.",
            cueWords: ["민수 씨", "시골 공기", "좋다"],
            frame: "민수 씨가 시골 공기를 ____.",
            answers: [
                "민수 씨가 시골 공기를 좋아해요.",
                "민수 씨는 시골 공기를 좋아해요."
            ],
            checkpoints: [
                { label: "민수", variants: ["민수"], required: true },
                { label: "시골 공기", variants: ["시골공기"], required: true },
                { label: "반응", variants: ["좋아해", "좋아하"], required: true }
            ],
            tip: "풍경 그림은 사람을 직접 보여 주지 않아도, 누군가가 그 장면을 보고 어떻게 느끼는지 말할 수 있어요."
        },
        {
            id: "pollution",
            mode: "speak",
            originalWord: "공해가 심하다",
            focusWord: "싫다",
            targetExpression: "싫어하다",
            sceneNote: "도시 환경을 보고 부정적 반응을 말하기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-06.webp",
            alt: "공해가 심한 도시 장면 그림",
            taskPrompt: "이 장면을 본 민수 씨의 반응을 말해 보세요.",
            cueWords: ["민수 씨", "도시 공기", "싫다"],
            frame: "민수 씨가 도시 공기를 ____.",
            answers: [
                "민수 씨가 도시 공기를 싫어해요.",
                "민수 씨는 도시 공기를 싫어해요."
            ],
            checkpoints: [
                { label: "민수", variants: ["민수"], required: true },
                { label: "도시 공기", variants: ["도시공기"], required: true },
                { label: "반응", variants: ["싫어해", "싫어하"], required: true }
            ],
            tip: "좋은 장면에는 “좋아하다”, 불편한 장면에는 “싫어하다”를 연결해 보세요."
        },
        {
            id: "garden",
            mode: "write",
            originalWord: "정원",
            focusWord: "좋다",
            targetExpression: "좋아하다",
            sceneNote: "장소 카드도 사람의 선호를 말하는 연습에 잘 어울립니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-11.webp",
            alt: "정원 그림",
            taskPrompt: "유진 씨가 이 장면을 보면 어떻게 반응할지 써 보세요.",
            cueWords: ["유진 씨", "정원", "좋다"],
            frame: "유진 씨가 정원을 ____.",
            answers: [
                "유진 씨가 정원을 좋아해요.",
                "유진 씨는 정원을 좋아해요."
            ],
            checkpoints: [
                { label: "유진", variants: ["유진"], required: true },
                { label: "정원", variants: ["정원"], required: true },
                { label: "반응", variants: ["좋아해", "좋아하"], required: true }
            ],
            tip: "사람 이름과 장소 이름만 주어져도 “좋아하다” 문장을 안정적으로 만들 수 있어요."
        },
        {
            id: "farming",
            mode: "speak",
            originalWord: "농사",
            focusWord: "신기하다",
            targetExpression: "신기해하다",
            sceneNote: "새로운 경험을 보고 느끼는 반응을 말하기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-14.webp",
            alt: "농사 장면 그림",
            taskPrompt: "아이의 반응이 드러나도록 말해 보세요.",
            cueWords: ["아이", "농사", "신기하다"],
            frame: "아이가 농사를 ____.",
            answers: [
                "아이가 농사를 신기해해요.",
                "아이는 농사를 신기해해요."
            ],
            checkpoints: [
                { label: "아이", variants: ["아이"], required: true },
                { label: "농사", variants: ["농사"], required: true },
                { label: "반응", variants: ["신기해해"], required: true }
            ],
            tip: "새롭거나 처음 보는 장면에는 “신기해하다”를 자주 연결할 수 있어요."
        },
        {
            id: "livestock",
            mode: "write",
            originalWord: "가축",
            focusWord: "무섭다",
            targetExpression: "무서워하다",
            sceneNote: "동물 그림은 감정 반응을 끌어내기 좋습니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-15.webp",
            alt: "가축 그림",
            taskPrompt: "동생의 감정이 드러나게 써 보세요.",
            cueWords: ["동생", "가축", "무섭다"],
            frame: "동생이 가축을 ____.",
            answers: [
                "동생이 가축을 무서워해요.",
                "동생은 가축을 무서워해요."
            ],
            checkpoints: [
                { label: "동생", variants: ["동생"], required: true },
                { label: "가축", variants: ["가축"], required: true },
                { label: "반응", variants: ["무서워해", "무서워하"], required: true }
            ],
            tip: "무섭거나 부담스러운 대상은 “무서워하다”로 자연스럽게 이어집니다."
        },
        {
            id: "peaceful",
            mode: "speak",
            originalWord: "평화롭다",
            focusWord: "그립다",
            targetExpression: "그리워하다",
            sceneNote: "14과의 고향 주제와 연결해 회상 반응을 끌어내기 좋은 카드입니다.",
            image: "../assets/c14/vocabulary/images/cards/c14-04.webp",
            alt: "평화로운 시골 풍경 그림",
            taskPrompt: "아버지의 마음을 떠올리며 말해 보세요.",
            cueWords: ["아버지", "이런 시골", "그립다"],
            frame: "아버지는 이런 시골을 ____.",
            answers: [
                "아버지는 이런 시골을 그리워하세요.",
                "아버지는 이런 시골을 그리워해요.",
                "우리 아버지는 이런 시골을 그리워하세요.",
                "우리 아버지는 이런 시골을 그리워해요."
            ],
            checkpoints: [
                { label: "아버지", variants: ["아버지"], required: true },
                { label: "시골", variants: ["이런시골", "시골"], required: true },
                { label: "반응", variants: ["그리워하"], required: true }
            ],
            tip: "14과 주제와 연결하면 “그리워하다”를 장면 반응으로도 자연스럽게 쓸 수 있어요."
        }
    ];

    const refs = {
        progressText: document.getElementById("progressText"),
        scoreText: document.getElementById("scoreText"),
        supportNote: document.getElementById("supportNote"),
        progressBar: document.getElementById("progressBar"),
        workspace: document.getElementById("workspace"),
        roundBadge: document.getElementById("roundBadge"),
        modePill: document.getElementById("modePill"),
        sceneImage: document.getElementById("sceneImage"),
        sceneWord: document.getElementById("sceneWord"),
        sceneNote: document.getElementById("sceneNote"),
        taskEyebrow: document.getElementById("taskEyebrow"),
        taskTitle: document.getElementById("taskTitle"),
        taskPrompt: document.getElementById("taskPrompt"),
        cueWords: document.getElementById("cueWords"),
        sentenceFrame: document.getElementById("sentenceFrame"),
        speechArea: document.getElementById("speechArea"),
        speechMeta: document.getElementById("speechMeta"),
        transcriptBox: document.getElementById("transcriptBox"),
        micBtn: document.getElementById("micBtn"),
        micBtnText: document.getElementById("micBtnText"),
        manualZone: document.querySelector(".input-area"),
        inputLabel: document.getElementById("inputLabel"),
        manualInput: document.getElementById("manualInput"),
        manualHint: document.getElementById("manualHint"),
        submitBtn: document.getElementById("submitBtn"),
        retryBtn: document.getElementById("retryBtn"),
        modelBtn: document.getElementById("modelBtn"),
        nextBtn: document.getElementById("nextBtn"),
        feedbackBox: document.getElementById("feedbackBox"),
        modelWrap: document.getElementById("modelWrap"),
        modelSentence: document.getElementById("modelSentence"),
        resultPanel: document.getElementById("resultPanel")
    };

    const state = {
        index: 0,
        answered: false,
        isListening: false,
        recognition: null,
        transcript: "",
        finalTranscript: "",
        results: new Map()
    };

    bootstrap();

    function bootstrap() {
        bindEvents();
        renderSupportState();
        renderCurrentItem();
        window.speechSynthesis?.getVoices();
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }
    }

    function bindEvents() {
        refs.submitBtn.addEventListener("click", checkInputAnswer);
        refs.retryBtn.addEventListener("click", () => resetCurrentAttempt(true));
        refs.modelBtn.addEventListener("click", speakModelSentence);
        refs.nextBtn.addEventListener("click", goNext);
        refs.micBtn.addEventListener("click", toggleListening);
        refs.manualInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                checkInputAnswer();
            }
        });
    }

    function renderSupportState() {
        refs.supportNote.textContent = STT_SUPPORTED ? "마이크 사용 가능" : "마이크 없이 입력만 사용";
    }

    function currentItem() {
        return QUIZ_ITEMS[state.index];
    }

    function renderCurrentItem() {
        if (state.index >= QUIZ_ITEMS.length) {
            renderSummary();
            return;
        }

        const item = currentItem();
        refs.resultPanel.classList.add("hidden");
        refs.workspace.classList.remove("hidden");
        refs.roundBadge.textContent = `${state.index + 1} / ${QUIZ_ITEMS.length}`;
        refs.modePill.textContent = item.mode === "write" ? "쓰기" : "말하기";
        refs.modePill.className = `mode-pill ${item.mode === "write" ? "mode-pill--write" : "mode-pill--speak"}`;
        refs.sceneImage.src = item.image;
        refs.sceneImage.alt = item.alt;
        refs.sceneWord.textContent = item.focusWord || item.originalWord;
        refs.sceneNote.textContent = item.originalWord;
        refs.taskEyebrow.textContent = item.mode === "write" ? "쓰기 차례" : "말하기 차례";
        refs.taskTitle.textContent = item.mode === "write" ? "그림을 보고 문장을 써 보세요." : "그림을 보고 문장을 말해 보세요.";
        refs.taskPrompt.textContent = item.taskPrompt;
        refs.sentenceFrame.textContent = item.frame;
        refs.modelSentence.textContent = item.answers[0];
        refs.inputLabel.textContent = item.mode === "write" ? "문장을 써 보세요." : "마이크가 안 되면 직접 입력해도 됩니다.";
        refs.manualInput.placeholder = item.answers[0];
        refs.manualHint.textContent = item.mode === "write"
            ? "쓰기 차례에서는 힌트를 보고 한 문장으로 써 보세요."
            : STT_SUPPORTED
                ? "말하기 차례에서는 먼저 말해 보고, 필요하면 입력으로 한 번 더 확인해도 됩니다."
                : "현재 마이크를 쓸 수 없어서 입력으로 대신합니다.";
        refs.submitBtn.textContent = "확인";
        refs.retryBtn.textContent = "다시";
        refs.modelBtn.textContent = "듣기";
        refs.nextBtn.textContent = "다음";
        refs.speechArea.classList.toggle("hidden", item.mode !== "speak");
        renderCueWords(item.cueWords);
        updateProgress();
        updateScore();
        resetCurrentAttempt(false);
    }

    function renderCueWords(words) {
        refs.cueWords.innerHTML = words
            .map((word) => `<span class="cue-chip">${escapeHtml(word)}</span>`)
            .join("");
    }

    function updateProgress() {
        const ratio = Math.min((state.index + 1) / QUIZ_ITEMS.length, 1);
        refs.progressText.textContent = state.index < QUIZ_ITEMS.length
            ? `${state.index + 1} / ${QUIZ_ITEMS.length}`
            : `${QUIZ_ITEMS.length} / ${QUIZ_ITEMS.length}`;
        refs.progressBar.style.width = `${ratio * 100}%`;
    }

    function updateScore() {
        const results = [...state.results.values()];
        const correct = results.filter((result) => result.correct).length;
        refs.scoreText.textContent = `${correct} / ${results.length}`;
    }

    function resetCurrentAttempt(removeSavedResult) {
        stopListening(true);
        if (removeSavedResult && state.index < QUIZ_ITEMS.length) {
            state.results.delete(currentItem().id);
            updateScore();
        }

        state.answered = false;
        state.transcript = "";
        state.finalTranscript = "";
        refs.manualInput.disabled = false;
        refs.manualInput.value = "";
        refs.submitBtn.disabled = false;
        refs.retryBtn.disabled = false;
        refs.micBtn.disabled = currentItem().mode !== "speak" || !STT_SUPPORTED;
        refs.micBtn.classList.remove("is-listening");
        refs.micBtnText.textContent = "말하기 시작";
        refs.feedbackBox.className = "feedback-box hidden";
        refs.feedbackBox.innerHTML = "";
        refs.modelWrap.classList.add("hidden");
        refs.nextBtn.classList.add("hidden");
        refs.transcriptBox.textContent = "...";
        refs.transcriptBox.classList.add("is-placeholder");
        refs.speechMeta.textContent = currentItem().mode === "speak"
            ? (STT_SUPPORTED ? "●" : "⌨")
            : "";
        syncActionEmphasis();
    }

    function checkInputAnswer() {
        if (state.answered) {
            return;
        }

        const inputText = normalizeSpacing(refs.manualInput.value);
        if (inputText) {
            stopListening(true);
            if (currentItem().mode === "speak") {
                refs.transcriptBox.textContent = inputText;
                refs.transcriptBox.classList.remove("is-placeholder");
            }
            evaluateAttempt(inputText, currentItem().mode === "write" ? "write" : "manual");
            return;
        }

        if (currentItem().mode === "speak" && state.transcript) {
            evaluateAttempt(state.transcript, "speech");
            return;
        }

        refs.manualInput.focus();
    }

    function toggleListening() {
        if (currentItem().mode !== "speak" || !STT_SUPPORTED) {
            refs.speechMeta.textContent = currentItem().mode === "speak" ? "입력 사용" : "쓰기 차례";
            return;
        }

        if (state.isListening) {
            stopListening();
            return;
        }

        startListening();
    }

    function startListening() {
        if (state.index >= QUIZ_ITEMS.length || currentItem().mode !== "speak") {
            return;
        }

        stopListening(true);
        state.transcript = "";
        state.finalTranscript = "";
        refs.transcriptBox.textContent = "...";
        refs.transcriptBox.classList.add("is-placeholder");
        refs.speechMeta.textContent = "듣는 중";

        try {
            const recognition = new SpeechRecognitionClass();
            recognition.lang = "ko-KR";
            recognition.interimResults = true;
            recognition.continuous = false;
            recognition.maxAlternatives = 3;

            recognition.onstart = () => {
                state.isListening = true;
                refs.micBtn.classList.add("is-listening");
                refs.micBtnText.textContent = "말하기 종료";
                refs.speechMeta.textContent = "듣는 중";
            };

            recognition.onresult = (event) => {
                let finalText = state.finalTranscript;
                let interimText = "";

                for (let index = event.resultIndex; index < event.results.length; index += 1) {
                    const result = event.results[index];
                    const chosen = pickBestAlternative(result, currentItem().answers);
                    if (!chosen) {
                        continue;
                    }
                    if (result.isFinal) {
                        finalText = normalizeSpacing(`${finalText} ${chosen}`);
                    } else {
                        interimText = normalizeSpacing(`${interimText} ${chosen}`);
                    }
                }

                state.finalTranscript = finalText;
                state.transcript = normalizeSpacing(`${finalText} ${interimText}`);
                refs.transcriptBox.textContent = state.transcript || "...";
                refs.transcriptBox.classList.toggle("is-placeholder", !state.transcript);
            };

            recognition.onerror = (event) => {
                state.isListening = false;
                state.recognition = null;
                syncListeningUi();
                refs.speechMeta.textContent = buildRecognitionError(event.error);
            };

            recognition.onend = () => {
                state.isListening = false;
                state.recognition = null;
                syncListeningUi();
                if (state.transcript && !state.answered) {
                    refs.speechMeta.textContent = "확인";
                    evaluateAttempt(state.transcript, "speech");
                } else if (!state.transcript) {
                    refs.speechMeta.textContent = "다시";
                }
            };

            state.recognition = recognition;
            recognition.start();
        } catch (error) {
            console.error(error);
            state.isListening = false;
            state.recognition = null;
            syncListeningUi();
            refs.speechMeta.textContent = "입력 사용";
        }
    }

    function stopListening(silent = false) {
        if (state.recognition) {
            try {
                state.recognition.stop();
            } catch (error) {
                console.error(error);
            }
        }

        state.isListening = false;
        syncListeningUi();
        if (!silent && currentItem().mode === "speak") {
            refs.speechMeta.textContent = "중지";
        }
    }

    function syncListeningUi() {
        refs.micBtn.classList.toggle("is-listening", state.isListening);
        refs.micBtnText.textContent = state.isListening ? "멈춤" : "말하기";
        syncActionEmphasis();
    }

    function syncActionEmphasis() {
        const item = currentItem();
        if (!item) {
            refs.manualZone.classList.remove("wave-focus");
            refs.submitBtn.classList.remove("wave-focus");
            refs.speechArea.classList.remove("wave-focus");
            refs.micBtn.classList.remove("wave-focus");
            refs.nextBtn.classList.remove("wave-focus");
            return;
        }

        const speakingPrimary = item.mode === "speak" && STT_SUPPORTED && !state.answered;
        const writingPrimary = !speakingPrimary && !state.answered;

        refs.manualZone.classList.toggle("wave-focus", writingPrimary);
        refs.submitBtn.classList.toggle("wave-focus", writingPrimary);
        refs.speechArea.classList.toggle("wave-focus", speakingPrimary);
        refs.micBtn.classList.toggle("wave-focus", speakingPrimary);
        refs.nextBtn.classList.toggle("wave-focus", state.answered);
    }

    function evaluateAttempt(text, source) {
        if (state.answered) {
            return;
        }

        const item = currentItem();
        const spoken = normalizeSpacing(text);
        const bestMatch = bestReferenceMatch(spoken, item.answers);
        const checkpoints = item.checkpoints.map((checkpoint) => ({
            ...checkpoint,
            matched: checkpoint.variants.some((variant) => normalizeText(spoken).includes(normalizeText(variant)))
        }));
        const requiredMissing = checkpoints.filter((checkpoint) => checkpoint.required && !checkpoint.matched);
        const matchedCount = checkpoints.filter((checkpoint) => checkpoint.matched).length;
        const coverage = Math.round((matchedCount / checkpoints.length) * 100);
        const exact = item.answers.some((answer) => normalizeText(answer) === normalizeText(spoken));
        const threshold = item.mode === "speak" ? 48 : 58;
        const correct = requiredMissing.length === 0 && (bestMatch.score >= threshold || exact);
        const almost = !correct && requiredMissing.length <= 1 && bestMatch.score >= 38;

        state.answered = true;
        state.results.set(item.id, {
            itemId: item.id,
            spoken,
            source,
            correct,
            almost,
            coverage,
            score: bestMatch.score,
            missingLabels: requiredMissing.map((checkpoint) => checkpoint.label),
            modelSentence: item.answers[0]
        });

        refs.manualInput.disabled = true;
        refs.submitBtn.disabled = true;
        refs.micBtn.disabled = true;
        refs.modelWrap.classList.remove("hidden");
        refs.nextBtn.classList.remove("hidden");
        renderFeedback(item, { spoken, source, correct, almost, coverage, score: bestMatch.score, missingLabels: requiredMissing.map((checkpoint) => checkpoint.label) });
        updateScore();
        syncActionEmphasis();
    }

    function renderFeedback(item, result) {
        const tone = result.correct ? "good" : result.almost ? "mid" : "bad";
        const headline = result.correct ? "정답" : result.almost ? "거의" : "다시";
        const message = result.missingLabels.length ? result.missingLabels.join(" · ") : "";

        refs.feedbackBox.className = `feedback-box feedback-box--${tone}`;
        refs.feedbackBox.innerHTML = `
            <p class="feedback-title">${escapeHtml(headline)}</p>
            <p class="feedback-body"><strong>내 답:</strong> ${escapeHtml(result.spoken || "(무응답)")}</p>
            <p class="feedback-body"><strong>모범 답:</strong> ${escapeHtml(item.answers[0])}</p>
            ${message ? `<p class="feedback-body">${escapeHtml(message)}</p>` : ""}
            <div class="feedback-meta">
                <span>유사도 ${result.score}</span>
                <span>핵심 단서 ${result.coverage}%</span>
                <span>${escapeHtml(result.source === "speech" ? "말하기" : result.source === "write" ? "쓰기" : "입력")}</span>
            </div>
        `;
    }

    function goNext() {
        if (!state.answered) {
            return;
        }
        state.index += 1;
        renderCurrentItem();
    }

    function renderSummary() {
        stopListening(true);
        refs.workspace.classList.add("hidden");
        refs.resultPanel.classList.remove("hidden");
        refs.progressText.textContent = `${QUIZ_ITEMS.length} / ${QUIZ_ITEMS.length}`;
        refs.progressBar.style.width = "100%";

        const results = QUIZ_ITEMS.map((item) => ({
            item,
            result: state.results.get(item.id)
        }));
        const correct = results.filter(({ result }) => result?.correct).length;
        const wrongItems = results.filter(({ result }) => !result?.correct);

        refs.resultPanel.innerHTML = `
            <div class="result-hero">
                <div class="result-card">
                    <h3>최종 점수</h3>
                    <p>${correct} / ${QUIZ_ITEMS.length}</p>
                </div>
                <div class="result-card">
                    <h3>다시 보기</h3>
                    <p>${wrongItems.length ? `${wrongItems.length}개 다시 보기` : "모두 성공"}</p>
                </div>
                <div class="result-card">
                    <h3>모드</h3>
                    <p>쓰기·말하기 교차</p>
                </div>
            </div>
            <div class="result-list">
                ${wrongItems.length ? wrongItems.map(({ item, result }) => `
                    <article class="result-item">
                        <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.alt)}" />
                        <div>
                            <h4>${escapeHtml(item.focusWord || item.originalWord)}</h4>
                            <p><strong>모범 문장:</strong> ${escapeHtml(item.answers[0])}</p>
                            ${result?.spoken ? `<p><strong>내 답:</strong> ${escapeHtml(result.spoken)}</p>` : ""}
                        </div>
                    </article>
                `).join("") : `
                    <article class="result-item">
                        <img src="${escapeAttr(QUIZ_ITEMS[0].image)}" alt="${escapeAttr(QUIZ_ITEMS[0].alt)}" />
                        <div>
                            <h4>모든 그림을 자연스럽게 표현했어요.</h4>
                        </div>
                    </article>
                `}
            </div>
            <div class="result-actions">
                <button id="restartBtn" class="btn btn-primary" type="button">처음부터 다시 하기</button>
                <a class="btn btn-soft" href="grammar3.html">문법 3으로 돌아가기</a>
            </div>
        `;

        const restartBtn = document.getElementById("restartBtn");
        if (restartBtn) {
            restartBtn.addEventListener("click", restartQuiz);
        }
    }

    function restartQuiz() {
        state.index = 0;
        state.answered = false;
        state.transcript = "";
        state.finalTranscript = "";
        state.results = new Map();
        renderCurrentItem();
    }

    function speakModelSentence() {
        if (state.index >= QUIZ_ITEMS.length) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(currentItem().answers[0]);
        utterance.lang = "ko-KR";
        utterance.rate = 0.92;
        const voices = window.speechSynthesis?.getVoices?.() || [];
        const koreanVoice = voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("ko"));
        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }
        window.speechSynthesis?.cancel();
        window.speechSynthesis?.speak(utterance);
    }

    function pickBestAlternative(result, answers) {
        let bestText = "";
        let bestScore = -1;

        for (let index = 0; index < result.length; index += 1) {
            const candidate = normalizeSpacing(result[index]?.transcript || "");
            if (!candidate) {
                continue;
            }
            const score = bestReferenceMatch(candidate, answers).score;
            if (score > bestScore) {
                bestText = candidate;
                bestScore = score;
            }
        }

        return bestText;
    }

    function bestReferenceMatch(spoken, answers) {
        return answers.reduce((best, answer) => {
            const scored = compareSentences(spoken, answer);
            return scored.score > best.score ? scored : best;
        }, { score: 0, accuracy: 0, completeness: 0 });
    }

    function compareSentences(spoken, answer) {
        const target = decomposeHangul(normalizeText(answer));
        const output = decomposeHangul(normalizeText(spoken));
        if (!target.length || !output.length) {
            return { score: 0, accuracy: 0, completeness: 0 };
        }

        const common = longestCommonSubsequence(target, output);
        const accuracy = Math.round((common / target.length) * 100);
        const completeness = Math.round((common / Math.max(target.length, output.length || 1)) * 100);
        return {
            accuracy,
            completeness,
            score: Math.round((accuracy * 0.65) + (completeness * 0.35))
        };
    }

    function longestCommonSubsequence(left, right) {
        const rows = left.length + 1;
        const cols = right.length + 1;
        const table = Array.from({ length: rows }, () => new Array(cols).fill(0));

        for (let row = 1; row < rows; row += 1) {
            for (let col = 1; col < cols; col += 1) {
                if (left[row - 1] === right[col - 1]) {
                    table[row][col] = table[row - 1][col - 1] + 1;
                } else {
                    table[row][col] = Math.max(table[row - 1][col], table[row][col - 1]);
                }
            }
        }

        return table[left.length][right.length];
    }

    function decomposeHangul(value) {
        let output = "";
        for (const char of value) {
            const code = char.charCodeAt(0);
            if (code >= 0xac00 && code <= 0xd7a3) {
                const offset = code - 0xac00;
                const jong = offset % 28;
                const jung = ((offset - jong) / 28) % 21;
                const cho = Math.floor((offset - jong) / 28 / 21);
                output += CHOSEONG[cho] + JUNGSEONG[jung] + (jong ? JONGSEONG[jong] : "");
            } else {
                output += char;
            }
        }
        return output;
    }

    function normalizeSpacing(value) {
        return String(value || "").replace(/\s+/g, " ").trim();
    }

    function normalizeText(value) {
        return normalizeSpacing(value)
            .toLowerCase()
            .replace(/[.?!,]/g, "")
            .replace(/\s/g, "");
    }

    function buildRecognitionError(errorCode) {
        if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
            return "마이크 허용";
        }
        if (errorCode === "no-speech") {
            return "다시 말하기";
        }
        return "입력 사용";
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttr(value) {
        return escapeHtml(value);
    }
})();
