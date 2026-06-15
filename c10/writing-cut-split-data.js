// Generated from the original c10 writing-cut data before the step-split promotion.
// The legacy source files are preserved under c10/_backup/20260611-writing-cut-legacy/.
(function () {
  window.C10_WRITING_CUT_SPLIT_DATA = {
    imgBase: '../assets/c10/reading-writing/images/writing-cut/',
    stepLabels: ["객관식", "어휘 넣기", "순서 배열", "빈칸 쓰기", "전체 문장 쓰기"],
    stepGuides: [
  "그림에 맞는 문장을 먼저 골라 보세요.",
  "알맞은 말을 빈칸에 넣어 문장을 완성해 보세요.",
  "주어진 어절을 순서대로 눌러 배열해 보세요.",
  "이제 빈칸에 들어갈 말을 직접 써 보세요.",
  "마지막으로 도움 없이 전체 문장을 완성해 보세요."
],
    rawCuts: [
  {
    "id": "cut01",
    "imgFile": "01_love_feels_forever.webp",
    "alt": "벚꽃길에서 서로 안으며 사랑이 영원할 거라고 믿는 연인들",
    "sentence": "사랑에 빠진 연인들은 서로의 사랑이 영원할 거라고 생각합니다.",
    "distractors": [
      4,
      9,
      12
    ],
    "dropSegments": [
      "",
      " 연인들은 서로의 사랑이 ",
      " 거라고 생각합니다."
    ],
    "dropAnswers": [
      "사랑에 빠진",
      "영원할"
    ],
    "dropChoices": [
      "사랑에 빠진",
      "영원할",
      "비교하지",
      "헤어지는"
    ],
    "orderTokens": [
      "사랑에 빠진",
      "연인들은",
      "서로의 사랑이",
      "영원할 거라고",
      "생각합니다."
    ],
    "fillPrompt": "[1] 연인들은 서로의 사랑이 [2] 거라고 생각합니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "사랑에 빠진"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "영원할"
        ]
      }
    ],
    "hints": [
      "연인",
      "벚꽃길",
      "영원"
    ],
    "requiredKeywords": [
      "사랑",
      "연인",
      "영원"
    ],
    "acceptedPatterns": [
      "사랑에 빠진 연인들은 서로의 사랑이 영원하다고 생각합니다."
    ]
  },
  {
    "id": "cut02",
    "imgFile": "02_love_has_expiration_date.webp",
    "alt": "사랑에도 유통 기한이 있다는 비유를 달력과 상자로 보여 주는 장면",
    "sentence": "하지만 사랑에도 유통 기한이 있다고 합니다.",
    "distractors": [
      5,
      8,
      13
    ],
    "dropSegments": [
      "하지만 사랑에도 ",
      " ",
      "이 있다고 합니다."
    ],
    "dropAnswers": [
      "유통",
      "기한"
    ],
    "dropChoices": [
      "유통",
      "기한",
      "노력",
      "표현"
    ],
    "orderTokens": [
      "하지만",
      "사랑에도",
      "유통 기한이",
      "있다고 합니다."
    ],
    "fillPrompt": "하지만 사랑에도 [1] [2]이 있다고 합니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "유통"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "기한"
        ]
      }
    ],
    "hints": [
      "유통 기한",
      "달력",
      "비유"
    ],
    "requiredKeywords": [
      "사랑",
      "유통",
      "기한"
    ],
    "acceptedPatterns": []
  },
  {
    "id": "cut03",
    "imgFile": "03_no_more_heart_pounding.webp",
    "alt": "벤치에 앉아 손을 잡고 있어도 예전처럼 설레지 않는 커플",
    "sentence": "뜨겁게 연애를 하던 사람들도 18개월에서 30개월이 지나면 더 이상 손을 잡거나 팔짱을 껴도 가슴이 두근거리지 않는다고 합니다.",
    "distractors": [
      2,
      10,
      14
    ],
    "dropSegments": [
      "뜨겁게 연애를 하던 사람들도 ",
      "이 지나면 더 이상 손을 잡거나 팔짱을 껴도 가슴이 ",
      " 않는다고 합니다."
    ],
    "dropAnswers": [
      "18개월에서 30개월",
      "두근거리지"
    ],
    "dropChoices": [
      "18개월에서 30개월",
      "두근거리지",
      "영원할",
      "이해해"
    ],
    "orderTokens": [
      "뜨겁게 연애를 하던 사람들도",
      "18개월에서 30개월이 지나면",
      "더 이상",
      "손을 잡거나 팔짱을 껴도",
      "가슴이",
      "두근거리지 않는다고 합니다."
    ],
    "fillPrompt": "뜨겁게 연애를 하던 사람들도 [1]이 지나면 가슴이 [2] 않는다고 합니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "18개월에서 30개월"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "두근거리지"
        ]
      }
    ],
    "hints": [
      "벤치",
      "시간 경과",
      "설렘 감소"
    ],
    "requiredKeywords": [
      "18개월",
      "30개월",
      "두근거리지"
    ],
    "acceptedPatterns": [
      "18개월에서 30개월이 지나면 더 이상 손을 잡아도 가슴이 두근거리지 않는다고 합니다.",
      "18개월에서 30개월이 지나면 더 이상 가슴이 두근거리지 않습니다."
    ]
  },
  {
    "id": "cut04",
    "imgFile": "04_break_up_after_love_cools.webp",
    "alt": "비 오는 날 사랑이 식었다고 말하며 멀어지는 두 사람",
    "sentence": "이 때문에 사랑이 식었다고 생각해서 헤어지는 연인들이 많습니다.",
    "distractors": [
      1,
      6,
      11
    ],
    "dropSegments": [
      "이 때문에 사랑이 ",
      " 생각해서 ",
      " 연인들이 많습니다."
    ],
    "dropAnswers": [
      "식었다고",
      "헤어지는"
    ],
    "dropChoices": [
      "식었다고",
      "헤어지는",
      "함께할",
      "소개"
    ],
    "orderTokens": [
      "이 때문에",
      "사랑이 식었다고",
      "생각해서",
      "헤어지는",
      "연인들이 많습니다."
    ],
    "fillPrompt": "이 때문에 사랑이 [1] 생각해서 [2] 연인들이 많습니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "식었다고"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "헤어지는"
        ]
      }
    ],
    "hints": [
      "비",
      "이별",
      "사랑이 식음"
    ],
    "requiredKeywords": [
      "사랑",
      "식었다",
      "헤어지는"
    ],
    "acceptedPatterns": [
      "사랑이 식었다고 생각해서 헤어지는 연인들이 많습니다."
    ]
  },
  {
    "id": "cut05",
    "imgFile": "05_love_has_many_stages.webp",
    "alt": "만남부터 이별까지 사랑의 여러 단계를 아이콘과 화살표로 보여 주는 장면",
    "sentence": "그러나 이런 변화는 사랑의 여러 가지 단계 중의 하나입니다.",
    "distractors": [
      2,
      7,
      15
    ],
    "dropSegments": [
      "그러나 이런 변화는 사랑의 ",
      " 단계 중의 ",
      "입니다."
    ],
    "dropAnswers": [
      "여러 가지",
      "하나"
    ],
    "dropChoices": [
      "여러 가지",
      "하나",
      "오랫동안",
      "비교하지"
    ],
    "orderTokens": [
      "그러나",
      "이런 변화는",
      "사랑의 여러 가지",
      "단계 중의",
      "하나입니다."
    ],
    "fillPrompt": "그러나 이런 변화는 사랑의 [1] 단계 중의 [2]입니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "여러 가지"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "하나"
        ]
      }
    ],
    "hints": [
      "단계",
      "변화",
      "연애 흐름"
    ],
    "requiredKeywords": [
      "변화",
      "단계",
      "하나"
    ],
    "acceptedPatterns": []
  },
  {
    "id": "cut06",
    "imgFile": "06_love_grows_with_effort.webp",
    "alt": "두 사람이 함께 하트 화분을 가꾸며 사랑을 키우는 장면",
    "sentence": "서로의 노력으로 사랑은 더 커질 수 있습니다.",
    "distractors": [
      4,
      8,
      12
    ],
    "dropSegments": [
      "서로의 ",
      " 사랑은 더 ",
      " 수 있습니다."
    ],
    "dropAnswers": [
      "노력으로",
      "커질"
    ],
    "dropChoices": [
      "노력으로",
      "커질",
      "표현",
      "기한"
    ],
    "orderTokens": [
      "서로의",
      "노력으로",
      "사랑은",
      "더 커질 수",
      "있습니다."
    ],
    "fillPrompt": "서로의 [1] 사랑은 더 [2] 수 있습니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "노력으로"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "커질"
        ]
      }
    ],
    "hints": [
      "노력",
      "하트 화분",
      "함께 키움"
    ],
    "requiredKeywords": [
      "노력",
      "사랑",
      "커질"
    ],
    "acceptedPatterns": [
      "서로 노력하면 사랑은 더 커질 수 있습니다."
    ]
  },
  {
    "id": "cut07",
    "imgFile": "07_think_about_lifelong_together.webp",
    "alt": "침대에 누워 평생 함께할 미래를 고민하는 사람의 생각 풍선",
    "sentence": "지금 곁에 있는 사람과 평생을 함께할 생각입니까?",
    "distractors": [
      3,
      9,
      14
    ],
    "dropSegments": [
      "지금 ",
      " 사람과 ",
      " 함께할 생각입니까?"
    ],
    "dropAnswers": [
      "곁에 있는",
      "평생을"
    ],
    "dropChoices": [
      "곁에 있는",
      "평생을",
      "다른 사람과",
      "유통"
    ],
    "orderTokens": [
      "지금",
      "곁에 있는",
      "사람과",
      "평생을 함께할",
      "생각입니까?"
    ],
    "fillPrompt": "지금 [1] 사람과 [2] 함께할 생각입니까?",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "곁에 있는"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "평생을"
        ]
      }
    ],
    "hints": [
      "밤",
      "미래",
      "결혼"
    ],
    "requiredKeywords": [
      "곁",
      "사람",
      "평생"
    ],
    "acceptedPatterns": [
      "지금 곁에 있는 사람과 평생 함께할 생각입니까?"
    ]
  },
  {
    "id": "cut08",
    "imgFile": "08_introducing_ways_to_keep_love.webp",
    "alt": "칠판 앞에서 오래 사랑하는 방법을 소개하는 발표자",
    "sentence": "오랫동안 사랑을 지킬 수 있는 방법 몇 가지를 소개하겠습니다.",
    "distractors": [
      2,
      6,
      15
    ],
    "dropSegments": [
      "오랫동안 사랑을 ",
      " 방법 몇 가지를 ",
      "하겠습니다."
    ],
    "dropAnswers": [
      "지킬 수 있는",
      "소개"
    ],
    "dropChoices": [
      "지킬 수 있는",
      "소개",
      "비교하지",
      "이해해"
    ],
    "orderTokens": [
      "오랫동안",
      "사랑을 지킬 수 있는",
      "방법 몇 가지를",
      "소개하겠습니다."
    ],
    "fillPrompt": "오랫동안 사랑을 [1] 방법 몇 가지를 [2]하겠습니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "지킬 수 있는"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "소개"
        ]
      }
    ],
    "hints": [
      "방법",
      "칠판",
      "소개"
    ],
    "requiredKeywords": [
      "오랫동안",
      "방법",
      "소개"
    ],
    "acceptedPatterns": [
      "오랫동안 사랑을 지키는 방법 몇 가지를 소개하겠습니다."
    ]
  },
  {
    "id": "cut09",
    "imgFile": "09_understand_as_they_are.webp",
    "alt": "실수한 상대를 다독이며 있는 그대로 이해해 주는 장면",
    "sentence": "첫째, 서로를 있는 그대로 이해해 줍니다.",
    "distractors": [
      10,
      11,
      13
    ],
    "dropSegments": [
      "첫째, 서로를 ",
      " ",
      " 줍니다."
    ],
    "dropAnswers": [
      "있는 그대로",
      "이해해"
    ],
    "dropChoices": [
      "있는 그대로",
      "이해해",
      "비교하지",
      "식었다고"
    ],
    "orderTokens": [
      "첫째,",
      "서로를",
      "있는 그대로",
      "이해해",
      "줍니다."
    ],
    "fillPrompt": "첫째, 서로를 [1] [2] 줍니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "있는 그대로"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "이해해"
        ]
      }
    ],
    "hints": [
      "첫째",
      "다독임",
      "있는 그대로"
    ],
    "requiredKeywords": [
      "첫째",
      "있는 그대로",
      "이해"
    ],
    "acceptedPatterns": [
      "첫째, 서로를 있는 그대로 이해합니다."
    ]
  },
  {
    "id": "cut10",
    "imgFile": "10_express_love_often.webp",
    "alt": "도시락을 건네며 사랑하는 마음을 자주 표현하는 장면",
    "sentence": "둘째, 사랑하는 마음을 자주 표현합니다.",
    "distractors": [
      9,
      11,
      12
    ],
    "dropSegments": [
      "둘째, 사랑하는 ",
      "을 자주 ",
      "합니다."
    ],
    "dropAnswers": [
      "마음",
      "표현"
    ],
    "dropChoices": [
      "마음",
      "표현",
      "기한",
      "소개"
    ],
    "orderTokens": [
      "둘째,",
      "사랑하는 마음을",
      "자주",
      "표현합니다."
    ],
    "fillPrompt": "둘째, 사랑하는 [1]을 자주 [2]합니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "마음"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "표현"
        ]
      }
    ],
    "hints": [
      "둘째",
      "도시락",
      "사랑해"
    ],
    "requiredKeywords": [
      "둘째",
      "마음",
      "표현"
    ],
    "acceptedPatterns": [
      "둘째, 사랑하는 마음을 자주 표현해요."
    ]
  },
  {
    "id": "cut11",
    "imgFile": "11_do_not_tell_lies.webp",
    "alt": "거짓말을 고민하다가 결국 솔직하게 말하는 장면",
    "sentence": "셋째, 거짓말을 하면 안 됩니다.",
    "distractors": [
      4,
      10,
      13
    ],
    "dropSegments": [
      "셋째, ",
      " 하면 ",
      " 됩니다."
    ],
    "dropAnswers": [
      "거짓말을",
      "안"
    ],
    "dropChoices": [
      "거짓말을",
      "안",
      "오래",
      "함께"
    ],
    "orderTokens": [
      "셋째,",
      "거짓말을",
      "하면",
      "안 됩니다."
    ],
    "fillPrompt": "셋째, [1] 하면 [2] 됩니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "거짓말을",
          "거짓말"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "안"
        ]
      }
    ],
    "hints": [
      "셋째",
      "솔직함",
      "거짓말 금지"
    ],
    "requiredKeywords": [
      "셋째",
      "거짓말",
      "안"
    ],
    "acceptedPatterns": [
      "셋째, 거짓말하면 안 됩니다.",
      "셋째, 거짓말을 하면 안 돼요."
    ]
  },
  {
    "id": "cut12",
    "imgFile": "12_make_a_shared_hobby.webp",
    "alt": "함께 요리를 하며 공유할 취미를 만드는 커플",
    "sentence": "넷째, 함께 할 수 있는 취미를 만듭니다.",
    "distractors": [
      6,
      10,
      13
    ],
    "dropSegments": [
      "넷째, ",
      " ",
      " 만듭니다."
    ],
    "dropAnswers": [
      "함께 할 수 있는",
      "취미를"
    ],
    "dropChoices": [
      "함께 할 수 있는",
      "취미를",
      "유통 기한을",
      "오해를"
    ],
    "orderTokens": [
      "넷째,",
      "함께 할 수 있는",
      "취미를",
      "만듭니다."
    ],
    "fillPrompt": "넷째, [1] [2] 만듭니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "함께 할 수 있는",
          "같이 할 수 있는"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "취미를",
          "취미"
        ]
      }
    ],
    "hints": [
      "넷째",
      "쿠킹 클래스",
      "함께 하는 취미"
    ],
    "requiredKeywords": [
      "넷째",
      "함께",
      "취미"
    ],
    "acceptedPatterns": [
      "넷째, 같이 할 수 있는 취미를 만듭니다."
    ]
  },
  {
    "id": "cut13",
    "imgFile": "13_do_not_compare_with_others.webp",
    "alt": "휴대폰 속 다른 커플과 비교하지 않고 우리 관계에 집중하는 장면",
    "sentence": "다섯째, 다른 사람과 비교하지 않습니다.",
    "distractors": [
      2,
      9,
      12
    ],
    "dropSegments": [
      "다섯째, ",
      " ",
      " 않습니다."
    ],
    "dropAnswers": [
      "다른 사람과",
      "비교하지"
    ],
    "dropChoices": [
      "다른 사람과",
      "비교하지",
      "지킬 수 있는",
      "두근거리지"
    ],
    "orderTokens": [
      "다섯째,",
      "다른 사람과",
      "비교하지",
      "않습니다."
    ],
    "fillPrompt": "다섯째, [1] [2] 않습니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "다른 사람과"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "비교하지"
        ]
      }
    ],
    "hints": [
      "다섯째",
      "휴대폰",
      "비교하지 않기"
    ],
    "requiredKeywords": [
      "다섯째",
      "다른 사람",
      "비교"
    ],
    "acceptedPatterns": [
      "다섯째, 다른 사람과 비교하면 안 됩니다."
    ]
  },
  {
    "id": "cut14",
    "imgFile": "14_changed_heart_or_bad_match.webp",
    "alt": "여자는 마음이 변했다고 느끼고 남자는 성격이 안 맞는다고 느끼는 대비 장면",
    "sentence": "여자는 남자의 마음이 변했다고 느낄 때 헤어질 생각을 하고, 남자는 여자와 성격이 안 맞을 때 이별을 생각한다고 합니다.",
    "distractors": [
      3,
      7,
      15
    ],
    "dropSegments": [
      "여자는 남자의 ",
      " 느낄 때 헤어질 생각을 하고, 남자는 여자와 ",
      " 때 이별을 생각한다고 합니다."
    ],
    "dropAnswers": [
      "마음이 변했다고",
      "성격이 안 맞을"
    ],
    "dropChoices": [
      "마음이 변했다고",
      "성격이 안 맞을",
      "영원할",
      "비교하지"
    ],
    "orderTokens": [
      "여자는",
      "남자의 마음이 변했다고",
      "느낄 때 헤어질 생각을 하고,",
      "남자는",
      "여자와 성격이 안 맞을 때",
      "이별을 생각한다고 합니다."
    ],
    "fillPrompt": "여자는 남자의 [1] 느낄 때 헤어질 생각을 하고, 남자는 여자와 [2] 때 이별을 생각한다고 합니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "마음이 변했다고"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "성격이 안 맞을"
        ]
      }
    ],
    "hints": [
      "마음이 변함",
      "성격 차이",
      "이별 생각"
    ],
    "requiredKeywords": [
      "마음이 변했다",
      "성격",
      "이별"
    ],
    "acceptedPatterns": [
      "여자는 남자의 마음이 변했다고 느낄 때 헤어질 생각을 하고 남자는 여자와 성격이 안 맞을 때 이별을 생각한다고 합니다."
    ]
  },
  {
    "id": "cut15",
    "imgFile": "15_stay_together_longer.webp",
    "alt": "가을길을 함께 걸으며 오래 함께할 수 있음을 보여 주는 커플",
    "sentence": "위의 방법대로 하면 사랑하는 사람과 오래 함께할 수 있을 겁니다.",
    "distractors": [
      5,
      8,
      14
    ],
    "dropSegments": [
      "위의 방법대로 하면 사랑하는 사람과 ",
      " ",
      " 수 있을 겁니다."
    ],
    "dropAnswers": [
      "오래",
      "함께할"
    ],
    "dropChoices": [
      "오래",
      "함께할",
      "소개",
      "변했다고"
    ],
    "orderTokens": [
      "위의 방법대로 하면",
      "사랑하는 사람과",
      "오래",
      "함께할 수 있을",
      "겁니다."
    ],
    "fillPrompt": "위의 방법대로 하면 사랑하는 사람과 [1] [2] 수 있을 겁니다.",
    "fillBlanks": [
      {
        "label": "빈칸 1",
        "answers": [
          "오래"
        ]
      },
      {
        "label": "빈칸 2",
        "answers": [
          "함께할"
        ]
      }
    ],
    "hints": [
      "가을길",
      "함께 걷기",
      "오래 함께"
    ],
    "requiredKeywords": [
      "방법",
      "오래",
      "함께"
    ],
    "acceptedPatterns": [
      "위의 방법대로 하면 사랑하는 사람과 오래 함께할 수 있습니다."
    ]
  }
]
  };
})();
