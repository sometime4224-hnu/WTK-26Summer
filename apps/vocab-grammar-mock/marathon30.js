(function () {
    function isMarathonMode() {
        return document.body?.dataset.feedbackMode === "marathon";
    }

    if (!isMarathonMode()) return;

    const baseRenderQuiz = window.renderQuiz;
    const baseWireQuizInteractions = window.wireQuizInteractions;
    const baseGradeQuiz = window.gradeQuiz;
    const baseBuildFeedbackHtml = window.buildFeedbackHtml;
    const baseShowGradeSummaryModal = window.showGradeSummaryModal;

    const REVIEW_HINTS = [
        { pattern: /행사 어휘/, label: "행사 어휘", tip: "행사 이름은 상황 단서로 빠르게 구별하세요. 1년 축하 = 돌잔치, 집 초대 = 집들이예요." },
        { pattern: /직장 어휘/, label: "직장 어휘", tip: "직장 문제는 사람, 시간, 조건을 나눠서 보면 훨씬 빨리 풀 수 있어요." },
        { pattern: /연애\/관계 어휘/, label: "연애/관계 어휘", tip: "만남 단계와 관계 표현을 묶어서 보세요. 소개팅 - 사귀다 - 청혼하다 흐름이 자주 나옵니다." },
        { pattern: /성격\/태도 어휘/, label: "성격/태도 어휘", tip: "인상, 마음씨, 매력 같은 평가는 쓰이는 맥락이 달라요. 행동 근거가 나오면 마음씨를 먼저 떠올리세요." },
        { pattern: /결합 표현/, label: "결합 표현", tip: "쥐가 나다, 숨이 차다처럼 통째로 외워야 실수하지 않아요." },
        { pattern: /조건 표현/, label: "조건 표현", tip: "하려면, 들어가려면 같은 말이 보이면 조건 표현을 먼저 확인하세요." },
        { pattern: /관형사형 -던/, label: "관형사형 -던", tip: "옛날에 자주 하던 행동을 떠올릴 때는 -던을 먼저 떠올리세요." },
        { pattern: /걱정 표현/, label: "걱정 표현", tip: "걱정이나 염려가 나오면 -(으)ㄹ까 봐를 바로 체크하세요." },
        { pattern: /후회 표현/, label: "후회 표현", tip: "이미 지나간 일에 대한 아쉬움은 -았/었어야 했는데로 정리하면 안정적이에요." },
        { pattern: /가정 표현/, label: "가정 표현", tip: "만약, 그렇다면 같은 단서가 나오면 -다면을 먼저 보세요." },
        { pattern: /사동 표현/, label: "사동 표현", tip: "앉히다, 입히다, 신기다처럼 형태가 바뀌는 사동은 세트로 외우세요." },
        { pattern: /-더니/, label: "-더니", tip: "직접 경험한 뒤 나온 결과인지 먼저 확인하면 -더니 문제를 안정적으로 풀 수 있어요." },
        { pattern: /-잖아요/, label: "-잖아요", tip: "상대도 이미 아는 사실을 다시 말하는 문맥이면 -잖아요가 강해집니다." },
        { pattern: /추측 표현/, label: "추측 표현", tip: "눈앞 단서가 먼저 제시되면 -(으)ㄴ/는 모양이다 가능성을 높게 보세요." },
        { pattern: /목적 표현/, label: "목적 표현", tip: "읽게 하다, 찾게 하다처럼 목적이 나오면 -도록과 연결해 보세요." },
        { pattern: /진행 표현/, label: "진행 표현", tip: "지금 하고 있는 장면이면 -고 있다를 먼저 떠올리는 습관이 좋아요." },
        { pattern: /선택 표현/, label: "선택 표현", tip: "둘 중 무엇이든 괜찮다는 뜻이면 -든지 패턴을 확인하세요." },
        { pattern: /허락 표현/, label: "허락 표현", tip: "괜찮다, 해도 된다가 보이면 -아/어도 표현이 자연스럽습니다." },
        { pattern: /계획 표현/, label: "계획 표현", tip: "앞으로 하려는 일은 계획이다, 예정이다처럼 미래 계획 표현으로 정리하세요." },
        { pattern: /감탄 표현/, label: "감탄 표현", tip: "직접 보고 놀란 느낌이면 얼마나 ...지 모르다 패턴이 자주 쓰여요." },
        { pattern: /유의어/, label: "유의어", tip: "유의어 문제는 완전 같은 단어보다 문맥에서 바꿔 넣어도 자연스러운지를 보세요." },
        { pattern: /읽기 적용/, label: "읽기 적용", tip: "읽기 문항은 글의 주장 한 줄을 먼저 잡고 보기로 내려오면 훨씬 빠릅니다." }
    ];

    window.renderQuiz = function renderMarathonQuiz(quiz) {
        window.__marathonQuiz = quiz;
        baseRenderQuiz(quiz);
        trimLeadCards(quiz);
        syncQuestionMetadata();
        primeCoachSummary();
    };

    window.wireQuizInteractions = function wireMarathonQuizInteractions(quiz) {
        baseWireQuizInteractions(quiz);

        const root = document.getElementById("quizSections");
        if (root) {
            root.addEventListener("change", () => {
                hideCoachSummary();
            }, true);
        }

        document.querySelectorAll('[data-action="reset"]').forEach((button) => {
            button.addEventListener("click", () => {
                window.setTimeout(() => {
                    hideCoachSummary();
                }, 0);
            });
        });
    };

    window.buildFeedbackHtml = function buildMarathonFeedbackHtml(args) {
        if (!isMarathonMode()) return baseBuildFeedbackHtml(args);

        const hint = pickReviewHint(args.explanation, args.correctText);
        const easyReason = window.buildEasyFeedbackText
            ? window.buildEasyFeedbackText(args.correctText, args.explanation)
            : args.explanation;

        const signal = args.status === "correct"
            ? "정답 유지"
            : args.status === "incorrect"
                ? "바로 보완"
                : "먼저 채우기";

        const heading = args.status === "correct"
            ? "정답입니다."
            : args.status === "incorrect"
                ? "오답입니다."
                : "미응답입니다.";

        const guide = args.status === "correct"
            ? "맞은 문제도 기준을 한 번 더 확인하면 같은 유형에서 흔들리지 않아요."
            : args.status === "incorrect"
                ? "정답 근거와 오답 차이를 같이 보면 바로 정리할 수 있어요."
                : "빈칸을 남긴 문제는 정답 표현을 먼저 고정해 두는 것이 좋아요.";

        const answerText = args.status === "unanswered"
            ? "아직 고르지 않았어요."
            : `<code>${window.escapeHtml(args.selectedLetter)}</code> ${window.renderInline(args.selectedText)}`;

        const compareText = args.status === "correct"
            ? `다음에도 같은 유형이 나오면 먼저 \`${args.correctText}\`를 떠올린 뒤 보기와 비교하세요.`
            : args.status === "incorrect"
                ? `내 답 \`${args.selectedText || "미응답"}\`보다 정답 \`${args.correctText}\`가 문맥에 더 정확하게 맞아요.`
                : `이 문항은 \`${args.correctText}\`를 먼저 고정하고 문장 뜻을 다시 읽어 보는 연습이 필요해요.`;

        return `
            <div class="feedback-signal feedback-signal--${args.status}">${signal}</div>
            <div class="feedback-heading">${heading}</div>
            <p class="feedback-guide">${guide}</p>
            <div class="feedback-row">
                <span class="feedback-label">정답</span>
                <span class="feedback-value"><code>${window.escapeHtml(args.correctLetter)}</code> ${window.renderInline(args.correctText)}</span>
            </div>
            <div class="feedback-row">
                <span class="feedback-label">내 답</span>
                <span class="feedback-value">${answerText}</span>
            </div>
            <div class="feedback-callout">
                <div class="feedback-callout__label">핵심 유형</div>
                <div class="feedback-callout__value">${window.escapeHtml(hint.label)}</div>
            </div>
            <div class="feedback-row feedback-row--stack">
                <span class="feedback-label">설명</span>
                <span class="feedback-value">${window.renderInline(easyReason)}</span>
            </div>
            <details class="feedback-more">
                <summary>${args.status === "correct" ? "같은 유형 유지 팁" : "오답 포인트 더 보기"}</summary>
                <div class="feedback-more__body">
                    <p class="feedback-more__text">${window.renderInline(compareText)}</p>
                    <p class="feedback-more__text">${window.renderInline(hint.tip)}</p>
                </div>
            </details>
        `;
    };

    window.gradeQuiz = function gradeMarathonQuiz(answerMap) {
        const result = baseGradeQuiz(answerMap);
        if (!isMarathonMode()) return result;

        const enriched = enrichResult(result);
        renderCoachSummary(enriched);
        return enriched;
    };

    window.showGradeSummaryModal = function showMarathonGradeSummary(result) {
        baseShowGradeSummaryModal(result);
        if (!isMarathonMode()) return;
        decorateSummaryModal(result);
    };

    function syncQuestionMetadata() {
        document.querySelectorAll(".section-card").forEach((sectionCard) => {
            const sectionTitle = sectionCard.querySelector(".section-card__header h2")?.textContent.trim() || "";
            sectionCard.querySelectorAll(".question-card").forEach((card) => {
                card.dataset.sectionTitle = sectionTitle;
            });
        });
    }

    function primeCoachSummary() {
        const panel = document.getElementById("coachSummary");
        const body = panel?.querySelector(".coach-card__body");
        if (!panel || !body) return;

        panel.classList.remove("is-ready");
        panel.hidden = true;
        body.innerHTML = "";
    }

    function hideCoachSummary() {
        primeCoachSummary();
    }

    function trimLeadCards(quiz) {
        const intro = document.getElementById("quizIntro");
        const focusCard = document.getElementById("focusCard");
        const focusList = document.getElementById("focusList");

        if (intro) {
            intro.innerHTML = `<h2>${window.escapeHtml(quiz.title)}</h2>`;
        }

        if (focusCard) {
            focusCard.hidden = true;
        }

        if (focusList) {
            focusList.innerHTML = "";
        }
    }

    function enrichResult(result) {
        const answerMap = window.__marathonQuiz?.answers;
        const questionResults = result.questionResults.map((item) => {
            const card = document.querySelector(`.question-card[data-question="${item.number}"]`);
            const answer = answerMap?.get(item.number);
            const selectedOriginalLetter = card?.querySelector(".option-input:checked")?.value || "";
            const correctOriginalLetter = answer?.correct || "";
            const correctLetter = card && correctOriginalLetter && window.getDisplayLetter
                ? window.getDisplayLetter(card, correctOriginalLetter)
                : correctOriginalLetter;
            const selectedLetter = card && selectedOriginalLetter && window.getDisplayLetter
                ? window.getDisplayLetter(card, selectedOriginalLetter)
                : selectedOriginalLetter;
            const correctText = card && correctOriginalLetter ? window.getOptionText(card, correctOriginalLetter) : correctOriginalLetter;
            const selectedText = card && selectedOriginalLetter ? window.getOptionText(card, selectedOriginalLetter) : "";
            const hint = pickReviewHint(answer?.explanation || "", correctText);

            return {
                ...item,
                sectionTitle: card?.dataset.sectionTitle || "",
                tag: hint.label,
                tip: hint.tip,
                correctLetter,
                correctText,
                selectedLetter,
                selectedText
            };
        });

        return {
            ...result,
            questionResults,
            band: getPerformanceBand(result.percent),
            sectionBreakdown: buildSectionBreakdown(questionResults),
            weakTags: buildWeakTags(questionResults)
        };
    }

    function renderCoachSummary(result) {
        const panel = document.getElementById("coachSummary");
        const body = panel?.querySelector(".coach-card__body");
        if (!panel || !body) return;

        const reviewItems = buildReviewItems(result);

        body.innerHTML = `
            <div class="coach-band">
                <div class="coach-band__label">${window.escapeHtml(result.band.label)}</div>
                <div class="coach-band__score">${result.correctCount} / ${result.totalCount} · ${result.percent}%</div>
                <div class="coach-band__guide">${window.escapeHtml(result.band.guide)}</div>
            </div>
            <div class="coach-breakdown">
                <div class="coach-block__title">섹션별 결과</div>
                <div class="coach-chip-grid">
                    ${result.sectionBreakdown.map((section) => `
                        <div class="coach-chip">
                            <div class="coach-chip__title">${window.escapeHtml(section.title)}</div>
                            <div class="coach-chip__value">${section.correct} / ${section.total}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
            <div class="coach-breakdown">
                <div class="coach-block__title">약한 유형</div>
                <div class="coach-chip-grid">
                    ${(result.weakTags.length ? result.weakTags : [{ label: "약한 유형 없음", count: 0 }]).map((tag) => `
                        <div class="coach-chip">
                            <div class="coach-chip__title">${window.escapeHtml(tag.label)}</div>
                            <div class="coach-chip__value">${tag.count === 0 ? "안정적" : `${tag.count}문항`}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
            <div class="coach-review">
                <div class="coach-block__title">다시 볼 순서</div>
                <ol class="coach-review-list">
                    ${reviewItems.map((item) => `<li>${window.escapeHtml(item)}</li>`).join("")}
                </ol>
            </div>
        `;

        panel.classList.add("is-ready");
        panel.hidden = false;
    }

    function decorateSummaryModal(result) {
        const modal = document.getElementById("gradeSummaryModal");
        if (!modal) return;

        const title = modal.querySelector("#summaryModalTitle");
        const guide = modal.querySelector("#summaryModalGuide");
        const body = modal.querySelector(".summary-modal__body");

        if (title) {
            title.textContent = "30문제 마라톤 결과";
        }

        if (guide) {
            guide.textContent = `${result.band.label}. ${result.band.guide}`;
        }

        if (!body) return;

        let coach = modal.querySelector("#summaryModalCoach");
        if (!coach) {
            coach = document.createElement("div");
            coach.id = "summaryModalCoach";
            coach.className = "summary-coach";
            body.appendChild(coach);
        }

        coach.innerHTML = `
            <div class="summary-coach__title">섹션별 결과</div>
            <div class="summary-breakdown">
                ${result.sectionBreakdown.map((section) => `
                    <div class="summary-breakdown__item">
                        <strong>${window.escapeHtml(section.title)}</strong>
                        <span>${section.correct} / ${section.total}</span>
                    </div>
                `).join("")}
            </div>
            <div class="summary-coach__title">우선 복습 추천</div>
            <ol class="summary-review-list">
                ${buildReviewItems(result).map((item) => `<li>${window.escapeHtml(item)}</li>`).join("")}
            </ol>
        `;
    }

    function buildSectionBreakdown(questionResults) {
        const sectionMap = new Map();

        questionResults.forEach((item) => {
            const title = item.sectionTitle || "기타";
            const current = sectionMap.get(title) || { title, correct: 0, total: 0 };
            current.total += 1;
            if (item.isCorrect) current.correct += 1;
            sectionMap.set(title, current);
        });

        return [...sectionMap.values()];
    }

    function buildWeakTags(questionResults) {
        const tagMap = new Map();

        questionResults
            .filter((item) => !item.isCorrect)
            .forEach((item) => {
                const current = tagMap.get(item.tag) || { label: item.tag, count: 0 };
                current.count += 1;
                tagMap.set(item.tag, current);
            });

        return [...tagMap.values()]
            .sort((left, right) => right.count - left.count)
            .slice(0, 3);
    }

    function buildReviewItems(result) {
        const wrongQuestions = result.questionResults.filter((item) => !item.isCorrect);
        if (!wrongQuestions.length) {
            return [
                "모든 문항을 맞혔습니다. 지금은 2부 기출 핵심 문법만 한 번 더 훑고 마무리하세요.",
                "문항별 피드백에서 내가 고민했던 보기만 짧게 다시 확인하면 실전 안정감이 더 올라갑니다."
            ];
        }

        const byTag = new Map();
        wrongQuestions.forEach((item) => {
            const current = byTag.get(item.tag) || [];
            current.push(item.number);
            byTag.set(item.tag, current);
        });

        const tagReviews = [...byTag.entries()]
            .sort((left, right) => right[1].length - left[1].length)
            .slice(0, 2)
            .map(([tag, numbers]) => `${tag}부터 다시 보세요. Q${numbers.join(", Q")}에서 흔들렸습니다.`);

        const sectionReview = result.sectionBreakdown
            .slice()
            .sort((left, right) => (left.correct / left.total) - (right.correct / right.total))[0];

        const sectionLine = sectionReview
            ? `${sectionReview.title}가 가장 약했습니다. 이 구간을 먼저 다시 푼 뒤 다른 문항으로 넘어가세요.`
            : "틀린 문항부터 다시 보면 됩니다.";

        return [sectionLine, ...tagReviews];
    }

    function getPerformanceBand(percent) {
        if (percent >= 90) {
            return {
                label: "안정권",
                guide: "실전에서 흔들릴 가능성이 낮은 점수대입니다. 틀린 문항의 근거만 짧게 정리하면 좋습니다."
            };
        }

        if (percent >= 75) {
            return {
                label: "실전권",
                guide: "전체 흐름은 좋지만 특정 유형에서 점수가 빠질 수 있습니다. 약한 유형만 다시 보면 효율이 높습니다."
            };
        }

        if (percent >= 60) {
            return {
                label: "보완 필요",
                guide: "핵심 유형은 잡혀 있지만 반복 실수가 보입니다. 약한 섹션부터 짧게 재풀이하는 것이 좋습니다."
            };
        }

        return {
            label: "재정리 필요",
            guide: "지금은 전 범위보다 기출 핵심 문법과 결합 표현을 먼저 고정하는 쪽이 더 효과적입니다."
        };
    }

    function pickReviewHint(explanation, correctText) {
        const source = `${explanation} ${correctText}`;
        return REVIEW_HINTS.find((item) => item.pattern.test(source)) || {
            label: "핵심 표현",
            tip: "정답 표현을 문장째로 다시 읽어 보고, 왜 다른 보기가 안 되는지 한 번만 비교해 보세요."
        };
    }
})();
