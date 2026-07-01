(function () {
    "use strict";

    window.HOMEWORK_DASHBOARD_REGISTRY = {
        title: "제출 통계",
        description: "Firebase로 수집한 복습 퀴즈와 모의고사 제출 현황을 활동별로 확인합니다.",
        groups: [
            {
                id: "chapter-review",
                title: "단원 복습",
                assignments: [
                    {
                        assignmentId: "c12-review-quiz-v1",
                        title: "12과 어휘·문법 복습",
                        chapter: "12",
                        totalQuestions: 24,
                        activityHref: "c12/review-quiz.html"
                    }
                ]
            },
            {
                id: "midterm-vocab-grammar",
                title: "중간 모의고사",
                assignments: [
                    {
                        assignmentId: "vocab-grammar-mock-round1-v1",
                        title: "3B 중간 모의고사 1회차",
                        chapter: "midterm-3b",
                        totalQuestions: 26,
                        anonymousModeEnabled: true,
                        activityHref: "apps/vocab-grammar-mock/round1.html"
                    },
                    {
                        assignmentId: "vocab-grammar-mock-round2-v1",
                        title: "3B 중간 모의고사 2회차",
                        chapter: "midterm-3b",
                        totalQuestions: 25,
                        activityHref: "apps/vocab-grammar-mock/round2.html"
                    },
                    {
                        assignmentId: "vocab-grammar-mock-round3-v1",
                        title: "3B 중간 모의고사 3회차",
                        chapter: "midterm-3b",
                        totalQuestions: 25,
                        activityHref: "apps/vocab-grammar-mock/round3.html"
                    },
                    {
                        assignmentId: "vocab-grammar-mock-round4-v1",
                        title: "3B 중간 모의고사 4회차",
                        chapter: "midterm-3b",
                        totalQuestions: 25,
                        activityHref: "apps/vocab-grammar-mock/round4.html"
                    },
                    {
                        assignmentId: "vocab-grammar-mock-marathon30-v1",
                        title: "3B 중간 모의고사 30문제 마라톤",
                        chapter: "midterm-3b",
                        totalQuestions: 30,
                        activityHref: "apps/vocab-grammar-mock/marathon30.html"
                    }
                ]
            }
        ]
    };
}());
