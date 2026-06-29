(function () {
    "use strict";

    const assignments = {
        "1": {
            assignmentId: "vocab-grammar-mock-round1-v1",
            assignmentTitle: "3B 중간 모의고사 1회차",
            roundId: "1",
            roundLabel: "1회차",
            totalQuestions: 26
        },
        "2": {
            assignmentId: "vocab-grammar-mock-round2-v1",
            assignmentTitle: "3B 중간 모의고사 2회차",
            roundId: "2",
            roundLabel: "2회차",
            totalQuestions: 25
        },
        "3": {
            assignmentId: "vocab-grammar-mock-round3-v1",
            assignmentTitle: "3B 중간 모의고사 3회차",
            roundId: "3",
            roundLabel: "3회차",
            totalQuestions: 25
        },
        "4": {
            assignmentId: "vocab-grammar-mock-round4-v1",
            assignmentTitle: "3B 중간 모의고사 4회차",
            roundId: "4",
            roundLabel: "4회차",
            totalQuestions: 25
        },
        marathon30: {
            assignmentId: "vocab-grammar-mock-marathon30-v1",
            assignmentTitle: "3B 중간 모의고사 30문제 마라톤",
            roundId: "marathon30",
            roundLabel: "30문제 마라톤",
            totalQuestions: 30
        }
    };

    function normalizeRoundId(value) {
        const normalized = String(value || "").trim().toLowerCase();
        if (normalized === "marathon" || normalized === "marathon30") return "marathon30";
        if (Object.prototype.hasOwnProperty.call(assignments, normalized)) return normalized;
        return "1";
    }

    function currentRoundId() {
        const params = new URLSearchParams(window.location.search);
        return normalizeRoundId(document.body?.dataset.roundId || params.get("round") || "1");
    }

    function getAssignment(roundId) {
        return assignments[normalizeRoundId(roundId)];
    }

    window.VOCAB_GRAMMAR_HOMEWORK_CONFIG = {
        chapter: "midterm-3b",
        studentNameKey: "vocab-grammar-mock-homework-name",
        assignments,
        currentRoundId,
        getAssignment
    };

    const baseConfig = window.HOMEWORK_FIREBASE_CONFIG || {};
    const current = getAssignment(currentRoundId());
    window.HOMEWORK_FIREBASE_CONFIG = Object.assign({}, baseConfig, {
        collectionRoot: baseConfig.collectionRoot || "homeworkAssignments",
        dashboard: Object.assign({}, baseConfig.dashboard || {}, {
            assignmentId: current.assignmentId,
            assignmentTitle: current.assignmentTitle,
            chapter: "midterm-3b",
            totalQuestions: current.totalQuestions,
            roster: []
        })
    });
}());
