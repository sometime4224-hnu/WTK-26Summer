const IMG_BASE = '../assets/c10/reading-writing/images/writing-cut/';
const STEP_LABELS = ["객관식", "어휘 넣기", "순서 배열", "빈칸 쓰기", "전체 문장 쓰기"];
const STEP_GUIDES = [
  "그림에 맞는 문장을 먼저 골라 보세요.",
  "알맞은 말을 빈칸에 넣어 문장을 완성해 보세요.",
  "주어진 어절을 순서대로 눌러 배열해 보세요.",
  "이제 빈칸에 들어갈 말을 직접 써 보세요.",
  "마지막으로 도움 없이 전체 문장을 완성해 보세요."
];

const RAW_CUTS = [
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
];

const cuts = RAW_CUTS.map((cut) => ({
  ...cut,
  mcqOptions: [cut.sentence, ...cut.distractors.map((index) => RAW_CUTS[index - 1].sentence)]
}));

const app = document.getElementById('app');
let floatingPreviewObserver = null;
const floatingPreviewMedia = window.matchMedia('(max-width: 860px)');
let shouldFocusPassageClose = false;
let shouldRestorePassageTrigger = false;

function shuffle(items) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function buildInitialState() {
  return {
    view: 'activity',
    currentCut: 0,
    currentStep: 0,
    activeSlot: 0,
    dragChoiceId: null,
    isPassageOpen: false,
    responses: cuts.map((cut) => ({
      step1: {
        selected: null,
        checked: false,
        correct: false,
        optionOrder: shuffle(cut.mcqOptions.map((label, index) => ({ id: index, label })))
      },
      step2: {
        placements: Array(cut.dropAnswers.length).fill(null),
        checked: false,
        correct: false,
        choiceOrder: shuffle(cut.dropChoices.map((label, index) => ({ id: index, label })))
      },
      step3: {
        arranged: [],
        checked: false,
        correct: false,
        bankOrder: shuffle(cut.orderTokens.map((label, index) => ({ id: index, label })))
      },
      step4: {
        inputs: Array(cut.fillBlanks.length).fill(''),
        checked: false,
        correct: false,
        correctCount: 0
      },
      step5: {
        text: '',
        checked: false,
        evaluation: null
      }
    }))
  };
}

let state = buildInitialState();

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,!?~]/g, '')
    .trim();
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCurrentCut() {
  return cuts[state.currentCut];
}

function getCurrentResponse() {
  return state.responses[state.currentCut];
}

function getStepResponse(response, stepIndex) {
  if (stepIndex === 0) return response.step1;
  if (stepIndex === 1) return response.step2;
  if (stepIndex === 2) return response.step3;
  if (stepIndex === 3) return response.step4;
  return response.step5;
}

function canGoNext() {
  if (state.view === 'summary') return false;
  const response = getCurrentResponse();
  return getStepResponse(response, state.currentStep).checked;
}

function findById(list, id) {
  return list.find((item) => String(item.id) === String(id));
}

function matchesAnswer(input, answers) {
  const normalized = normalizeText(input);
  return answers.some((answer) => normalized === normalizeText(answer));
}

function evaluateSentence(text, cut) {
  const raw = (text || '').trim();
  const matchedKeywords = cut.requiredKeywords.filter((keyword) =>
    normalizeText(raw).includes(normalizeText(keyword))
  );

  if (!raw) {
    return { level: 'empty', matchedKeywords, missingKeywords: cut.requiredKeywords };
  }

  if (normalizeText(raw) === normalizeText(cut.sentence)) {
    return { level: 'exact', matchedKeywords: cut.requiredKeywords, missingKeywords: [] };
  }

  if (cut.acceptedPatterns.some((pattern) => normalizeText(raw) === normalizeText(pattern))) {
    return { level: 'accepted', matchedKeywords, missingKeywords: [] };
  }

  if (matchedKeywords.length === cut.requiredKeywords.length) {
    return { level: 'strong', matchedKeywords, missingKeywords: [] };
  }

  if (matchedKeywords.length >= Math.max(2, cut.requiredKeywords.length - 1)) {
    return {
      level: 'partial',
      matchedKeywords,
      missingKeywords: cut.requiredKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
    };
  }

  return {
    level: 'weak',
    matchedKeywords,
    missingKeywords: cut.requiredKeywords.filter((keyword) => !matchedKeywords.includes(keyword))
  };
}

function feedbackBlock(type, title, body, extra = '') {
  return `
    <div id="step-feedback" class="feedback ${type}">
      <strong>${String(title).split(' / ')[0]}</strong>
      <div class="feedback-body">${body}</div>
      ${extra}
    </div>
  `;
}

function feedbackLine(ko, vi) {
  return `
    <div class="feedback-line">
      ${escapeHtml(ko)}
    </div>
  `;
}

function feedbackModelSentence(sentence) {
  return `
    <div class="feedback-model">
      <span>모범 문장</span>
      ${escapeHtml(sentence)}
    </div>
  `;
}

function renderGuideZone(content, label, tone = 'primary', compact = false) {
  return `
    <div class="guide-zone ${tone}${compact ? ' compact' : ''}">
      <div class="guide-callout ${tone}">${label}</div>
      ${content}
    </div>
  `;
}

function getStep1Feedback(cut, response) {
  if (!response.step1.checked) return '';
  if (response.step1.correct) {
    return feedbackBlock(
      'correct',
      '맞아요. / Đúng rồi.',
      `${feedbackLine('그림과 같은 문장을 골랐어요.', 'Bạn đã chọn đúng câu khớp với tranh.')}${feedbackModelSentence(cut.sentence)}`
    );
  }
  return feedbackBlock(
    'wrong',
    '아직 아니에요. / Chưa đúng.',
    `${feedbackLine('그림에 더 잘 맞는 문장을 다시 봐요.', 'Hãy xem lại câu phù hợp hơn với bức tranh.')}${feedbackModelSentence(cut.sentence)}`
  );
}

function getStep2Feedback(cut, response) {
  if (!response.step2.checked) return '';
  if (response.step2.correct) {
    return feedbackBlock(
      'correct',
      '좋아요. / Tốt lắm.',
      `${feedbackLine('두 낱말이 모두 맞아요.', 'Cả hai từ đều đúng.')}${feedbackModelSentence(cut.sentence)}`
    );
  }
  return feedbackBlock(
    'warn',
    '조금만 더. / Thêm một chút nữa.',
    `${feedbackLine('두 칸의 말을 다시 바꿔 넣어 보세요.', 'Hãy thử đổi lại hai từ vào ô trống.')}${feedbackModelSentence(cut.sentence)}`
  );
}

function getStep3Feedback(cut, response) {
  if (!response.step3.checked) return '';
  if (response.step3.correct) {
    return feedbackBlock(
      'correct',
      '순서가 맞아요. / Đúng thứ tự rồi.',
      feedbackLine('문장이 자연스럽게 이어져요.', 'Câu đã nối lại tự nhiên rồi.')
    );
  }
  return feedbackBlock(
    'warn',
    '순서를 다시 봐요. / Xem lại thứ tự nhé.',
    `${feedbackLine('처음부터 천천히 다시 놓아 보세요.', 'Hãy sắp xếp lại từ đầu, chậm thôi.')}${feedbackModelSentence(cut.sentence)}`
  );
}

function getStep4Feedback(cut, response) {
  if (!response.step4.checked) return '';
  if (response.step4.correct) {
    return feedbackBlock(
      'correct',
      '잘 썼어요. / Viết tốt lắm.',
      `${feedbackLine('빈칸 두 곳이 모두 맞아요.', 'Cả hai ô trống đều đúng.')}${feedbackModelSentence(cut.sentence)}`
    );
  }
  if (response.step4.correctCount > 0) {
    return feedbackBlock(
      'warn',
      '한 칸은 맞아요. / Một ô đúng rồi.',
      `${feedbackLine(
        `${response.step4.correctCount}개는 맞고, 나머지 하나를 다시 보면 돼요.`,
        `${response.step4.correctCount} ô đúng, bạn chỉ cần xem lại ô còn lại.`
      )}${feedbackModelSentence(cut.sentence)}`
    );
  }
  return feedbackBlock(
    'wrong',
    '다시 써 볼까요? / Thử viết lại nhé?',
    `${feedbackLine('핵심 낱말을 다시 보고 써 보세요.', 'Hãy nhìn lại từ khóa chính rồi viết lại nhé.')}${feedbackModelSentence(cut.sentence)}`
  );
}

function getStep5Feedback(cut, response) {
  if (!response.step5.checked || !response.step5.evaluation) return '';
  const result = response.step5.evaluation;
  if (result.level === 'exact') {
    return feedbackBlock(
      'correct',
      '아주 좋아요. / Rất tốt.',
      `${feedbackLine('문장이 거의 똑같아요.', 'Câu của bạn gần như giống hệt câu mẫu.')}${feedbackModelSentence(cut.sentence)}`
    );
  }
  if (result.level === 'accepted' || result.level === 'strong') {
    return feedbackBlock(
      'correct',
      '의미가 맞아요. / Đúng ý rồi.',
      `${feedbackLine('표현이 조금 달라도 괜찮아요.', 'Diễn đạt hơi khác cũng không sao.')}${feedbackModelSentence(cut.sentence)}`
    );
  }
  if (result.level === 'partial') {
    const missingKo = result.missingKeywords.length ? `빠진 말: ${result.missingKeywords.join(', ')}` : '핵심 말을 한 번 더 넣어 보세요.';
    const missingVi = result.missingKeywords.length
      ? `Từ còn thiếu: ${result.missingKeywords.join(', ')}`
      : 'Hãy thử thêm lại từ khóa chính.';
    return feedbackBlock(
      'warn',
      '조금만 더 쓰면 돼요. / Chỉ cần thêm một chút nữa.',
      `${feedbackLine(missingKo, missingVi)}${feedbackModelSentence(cut.sentence)}`
    );
  }
  return feedbackBlock(
    'wrong',
    '핵심어를 더 넣어 보세요. / Hãy thêm từ chính.',
    `${feedbackLine('그림의 핵심 말을 넣어 다시 써 보세요.', 'Hãy thêm từ khóa chính của bức tranh rồi viết lại.')}${feedbackModelSentence(cut.sentence)}`
  );
}

function renderStepPills() {
  return STEP_LABELS.map((label, index) => {
    const classNames = ['step-pill'];
    if (index < state.currentStep) classNames.push('done');
    if (index === state.currentStep) classNames.push('active');
    return `<div class="${classNames.join(' ')}">${index + 1}. ${label}</div>`;
  }).join('');
}

function renderCutPills() {
  return cuts.map((_, index) => {
    const classNames = ['cut-pill'];
    if (index < state.currentCut) classNames.push('done');
    if (index === state.currentCut) classNames.push('active');
    return `<div class="${classNames.join(' ')}">컷 ${index + 1}</div>`;
  }).join('');
}

function renderProgressActions(chipLabel) {
  return `
    <div class="progress-actions">
      <button type="button" class="passage-btn" data-action="open-passage" aria-haspopup="dialog" aria-controls="passage-dialog" aria-expanded="${state.isPassageOpen ? 'true' : 'false'}">
        전체 지문 보기
      </button>
      <span class="focus-chip">${chipLabel}</span>
    </div>
  `;
}

function renderPassageModal() {
  if (!state.isPassageOpen) return '';
  const activeIndex = state.view === 'activity' ? state.currentCut : -1;
  return `
    <section class="passage-modal" data-action="close-passage-backdrop" aria-label="전체 지문 팝업">
      <div id="passage-dialog" class="passage-dialog" role="dialog" aria-modal="true" aria-labelledby="passage-title" data-action="passage-panel" tabindex="-1">
        <div class="passage-head">
          <div>
            <h3 id="passage-title">전체 읽기 지문</h3>
            <p>문장 흐름을 한 번에 읽어 보세요.<br>Hãy đọc toàn bộ bài để nắm mạch nội dung.</p>
          </div>
          <button type="button" class="passage-close" data-action="close-passage" data-passage-close-button>닫기</button>
        </div>
        <div class="passage-body">
          ${cuts.map((cut, index) => `
            <article class="passage-item ${activeIndex === index ? 'active' : ''}">
              <strong>컷 ${index + 1}${activeIndex === index ? ' · 지금 보는 컷' : ''}</strong>
              <p>${escapeHtml(cut.sentence)}</p>
              <div class="passage-vi">Hãy đọc to câu này và kiểm tra mạch nội dung.</div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderImagePanel(cut) {
  return `
    <section class="panel" data-image-panel>
      <div class="panel-head">
        <div>
          <h3>컷 ${state.currentCut + 1}</h3>
          <p>그림을 먼저 보고, 표정과 행동에서 핵심 단서를 찾으세요.</p>
        </div>
        <span class="highlight-tag">그림 보기</span>
      </div>
      <div class="image-wrap">
        <img src="${IMG_BASE}${cut.imgFile}" alt="${escapeHtml(cut.alt)}" data-primary-image>
      </div>
      <div class="image-caption">그림 속 인물, 행동, 분위기를 먼저 보고 아래 키워드로 상황을 추측해 보세요.</div>
      <div class="support-row">
        ${cut.hints.map((hint) => `<span class="support-chip">${escapeHtml(hint)}</span>`).join('')}
      </div>
    </section>
  `;
}

function renderFloatingPreview(cut) {
  return `
    <button
      type="button"
      class="floating-image-preview"
      data-action="scroll-to-image"
      data-floating-preview
      aria-label="현재 그림으로 다시 이동하기"
    >
      <img src="${IMG_BASE}${cut.imgFile}" alt="">
      <span class="floating-image-preview__copy">
        <strong>현재 그림</strong>
        <span>컷 ${state.currentCut + 1} 다시 보려면 누르세요</span>
      </span>
    </button>
  `;
}

function renderStep1(cut, response) {
  const needsSelection = response.step1.selected === null;
  const needsCheck = response.step1.selected !== null && !response.step1.checked;
  const choicesBlock = `
    <div class="choice-list" data-step1-choice-list>
      ${response.step1.optionOrder.map((option) => {
        const classNames = ['choice-btn'];
        if (response.step1.selected === option.id) classNames.push('selected');
        if (response.step1.checked && option.label === cut.sentence) classNames.push('correct');
        if (response.step1.checked && response.step1.selected === option.id && option.label !== cut.sentence) classNames.push('wrong');
        return `
          <button type="button" class="${classNames.join(' ')}" data-action="select-choice" data-option-id="${option.id}">
            ${escapeHtml(option.label)}
          </button>
        `;
      }).join('')}
    </div>
  `;
  const actionsBlock = `
    <div class="actions">
      <button type="button" class="ghost-btn" data-action="check-step1" ${response.step1.selected === null ? 'disabled' : ''}>정답 확인</button>
    </div>
  `;
  return `
    <div class="instruction-card">
      <strong>지금 할 활동</strong>
      <span>그림에 맞는 문장 하나를 고르세요.</span>
    </div>
    ${needsSelection ? renderGuideZone(choicesBlock, '먼저 맞는 문장을 하나 누르세요') : choicesBlock}
    ${needsCheck ? renderGuideZone(actionsBlock, '선택했으면 정답 확인을 누르세요') : actionsBlock}
    ${getStep1Feedback(cut, response)}
  `;
}

function renderStep2(cut, response) {
  const usedIds = response.step2.placements.filter((value) => value !== null);
  const emptySlotIndex = response.step2.placements.findIndex((value) => value === null);
  const needsPlacement = emptySlotIndex !== -1;
  const slots = cut.dropSegments.map((segment, index) => {
    if (index === cut.dropSegments.length - 1) return escapeHtml(segment);
    const choiceId = response.step2.placements[index];
    const choice = choiceId === null ? null : findById(response.step2.choiceOrder, choiceId);
    const slotText = choice ? choice.label : `빈칸 ${index + 1}`;
    const classNames = ['drop-slot'];
    if (state.activeSlot === index) classNames.push('active');
    if (choice) classNames.push('filled');
    return `${escapeHtml(segment)}<button type="button" class="${classNames.join(' ')}" data-action="activate-slot" data-slot="${index}">${escapeHtml(slotText)}</button>`;
  }).join('');

  const workBlock = `
    <div class="template-box">
      <div class="template-line">${slots}</div>
    </div>
    <div class="word-bank">
      ${response.step2.choiceOrder.map((choice) => {
        const used = usedIds.includes(choice.id);
        return `
          <button
            type="button"
            class="word-chip ${used ? 'used' : ''}"
            data-action="use-word"
            data-choice-id="${choice.id}"
            draggable="${used ? 'false' : 'true'}"
            ${used ? 'disabled' : ''}
          >
            ${escapeHtml(choice.label)}
          </button>
        `;
      }).join('')}
    </div>
  `;
  const actionsBlock = `
    <div class="actions">
      <div class="action-group">
        <button type="button" class="ghost-btn" data-action="check-step2" ${response.step2.placements.includes(null) ? 'disabled' : ''}>확인</button>
        <button type="button" class="reset-btn" data-action="reset-step2">빈칸 비우기</button>
      </div>
    </div>
  `;
  return `
    <div class="instruction-card">
      <strong>지금 할 활동</strong>
      <span>알맞은 어휘를 끌어 놓거나 눌러서 빈칸에 넣으세요. 채워진 칸을 누르면 다시 비워집니다.</span>
    </div>
    ${needsPlacement ? renderGuideZone(workBlock, `빈칸 ${emptySlotIndex + 1}에 들어갈 말을 넣으세요`) : workBlock}
    ${!needsPlacement && !response.step2.checked ? renderGuideZone(actionsBlock, '모두 넣었으면 확인을 누르세요') : actionsBlock}
    ${getStep2Feedback(cut, response)}
  `;
}

function renderStep3(cut, response) {
  const arrangedItems = response.step3.arranged.map((id) => findById(response.step3.bankOrder, id));
  const bankItems = response.step3.bankOrder.filter((item) => !response.step3.arranged.includes(item.id));
  const needsOrdering = response.step3.arranged.length < cut.orderTokens.length;
  const orderLabel = response.step3.arranged.length === 0
    ? '아래 어절부터 눌러 위에 올리세요'
    : '남은 어절을 계속 눌러 문장을 완성하세요';
  const workBlock = `
    <div class="arranged-box">
      <div class="arranged-line">
        ${arrangedItems.length
          ? arrangedItems.map((item) => `<button type="button" class="order-chip" data-action="remove-order" data-order-id="${item.id}">${escapeHtml(item.label)}</button>`).join('')
          : '<span class="blank-inline">순서대로 놓아 보세요</span>'}
      </div>
    </div>
    <div class="order-bank">
      <div class="order-row">
        ${bankItems.map((item) => `<button type="button" class="order-chip" data-action="pick-order" data-order-id="${item.id}">${escapeHtml(item.label)}</button>`).join('')}
      </div>
    </div>
  `;
  const actionsBlock = `
    <div class="actions">
      <div class="action-group">
        <button type="button" class="ghost-btn" data-action="check-step3" ${response.step3.arranged.length !== cut.orderTokens.length ? 'disabled' : ''}>순서 확인</button>
        <button type="button" class="reset-btn" data-action="reset-step3">다시 배열하기</button>
      </div>
    </div>
  `;
  return `
    <div class="instruction-card">
      <strong>지금 할 활동</strong>
      <span>어절을 순서대로 눌러 문장을 만드세요. 위에 올라간 어절을 누르면 다시 아래로 돌아갑니다.</span>
    </div>
    ${needsOrdering ? renderGuideZone(workBlock, orderLabel) : workBlock}
    ${!needsOrdering && !response.step3.checked ? renderGuideZone(actionsBlock, '문장이 완성되면 순서 확인을 누르세요') : actionsBlock}
    ${getStep3Feedback(cut, response)}
  `;
}

function renderFillPrompt(prompt) {
  return escapeHtml(prompt)
    .replace('[1]', '<span class="blank-inline">빈칸 1</span>')
    .replace('[2]', '<span class="blank-inline">빈칸 2</span>');
}

function renderStep4(cut, response) {
  const needsWriting = response.step4.inputs.some((value) => !value.trim());
  const workBlock = `
    <div class="fill-preview">${renderFillPrompt(cut.fillPrompt)}</div>
    <div class="fill-grid">
      ${cut.fillBlanks.map((blank, index) => `
        <div class="fill-field">
          <label for="fill-${index}">${blank.label}</label>
          <input id="fill-${index}" type="text" data-action="fill-input" data-fill-index="${index}" value="${escapeHtml(response.step4.inputs[index])}" autocomplete="off">
        </div>
      `).join('')}
    </div>
  `;
  const actionsBlock = `
    <div class="actions">
      <button type="button" class="ghost-btn" data-action="check-step4" ${response.step4.inputs.some((value) => !value.trim()) ? 'disabled' : ''}>빈칸 확인</button>
    </div>
  `;
  return `
    <div class="instruction-card">
      <strong>지금 할 활동</strong>
      <span>이제 빈칸 두 곳에 들어갈 말을 직접 써 보세요.</span>
    </div>
    ${needsWriting ? renderGuideZone(workBlock, '빈칸 두 곳에 들어갈 말을 직접 쓰세요') : workBlock}
    ${!needsWriting && !response.step4.checked ? renderGuideZone(actionsBlock, '다 썼으면 빈칸 확인을 누르세요') : actionsBlock}
    ${getStep4Feedback(cut, response)}
  `;
}

function renderStep5(cut, response) {
  const needsSentenceWrite = !response.step5.text.trim();
  const workBlock = `
    <div class="fullwrite-box">
      <label for="full-sentence">전체 문장 쓰기</label>
      <textarea id="full-sentence" data-action="full-text" placeholder="그림을 보고 한 문장으로 써 보세요.">${escapeHtml(response.step5.text)}</textarea>
    </div>
    <div class="support-row">
      ${cut.hints.map((hint) => `<span class="support-chip">${escapeHtml(hint)}</span>`).join('')}
    </div>
  `;
  const actionsBlock = `
    <div class="actions">
      <button type="button" class="ghost-btn" data-action="check-step5" ${!response.step5.text.trim() ? 'disabled' : ''}>문장 확인</button>
    </div>
  `;
  return `
    <div class="instruction-card">
      <strong>지금 할 활동</strong>
      <span>도움 없이 전체 문장을 직접 써 보세요. 표현이 조금 달라도 핵심 의미가 맞으면 인정합니다.</span>
    </div>
    ${needsSentenceWrite ? renderGuideZone(workBlock, '전체 문장을 직접 써 보세요') : workBlock}
    ${!needsSentenceWrite && !response.step5.checked ? renderGuideZone(actionsBlock, '문장을 다 썼으면 확인을 누르세요') : actionsBlock}
    ${getStep5Feedback(cut, response)}
  `;
}

function renderStepPanel(cut, response) {
  let content = '';
  if (state.currentStep === 0) content = renderStep1(cut, response);
  if (state.currentStep === 1) content = renderStep2(cut, response);
  if (state.currentStep === 2) content = renderStep3(cut, response);
  if (state.currentStep === 3) content = renderStep4(cut, response);
  if (state.currentStep === 4) content = renderStep5(cut, response);

  let nextLabel = '다음 컷';
  if (state.currentCut === cuts.length - 1) {
    nextLabel = state.currentStep === STEP_LABELS.length - 1 ? '종합 피드백 보기' : '다음 단계';
  }

  const nextGuide = state.currentCut === cuts.length - 1
    ? (state.currentStep === STEP_LABELS.length - 1 ? '마지막이면 종합 피드백으로 넘어가세요' : '이 단계가 끝났어요. 다음 단계로 가세요')
    : '이 컷이 끝났어요. 다음 컷으로 가세요';
  const nextButton = `<button type="button" class="nav-btn" data-action="next" ${canGoNext() ? '' : 'disabled'}>${nextLabel}</button>`;

  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h3>${state.currentStep + 1}단계 · ${STEP_LABELS[state.currentStep]}</h3>
          <p>${STEP_GUIDES[state.currentStep]} 지금은 이 단계로 모든 컷을 차례대로 돌고 있습니다.</p>
        </div>
        <span class="highlight-tag">지금 하기</span>
      </div>
      ${content}
      <div class="actions">
        <div class="action-group">
          <button type="button" class="ghost-btn" data-action="prev" ${(state.currentCut === 0 && state.currentStep === 0) ? 'disabled' : ''}>이전</button>
          <button type="button" class="reset-btn" data-action="restart">처음부터</button>
        </div>
        ${canGoNext() ? renderGuideZone(nextButton, nextGuide, 'success', true) : nextButton}
      </div>
    </section>
  `;
}

function getStepMetricValue(stepIndex) {
  return state.responses.filter((response) => getStepResponse(response, stepIndex).correct).length;
}

function getSentenceSuccessCount() {
  return state.responses.filter((response, index) => {
    const result = response.step5.evaluation || evaluateSentence(response.step5.text, cuts[index]);
    return ['exact', 'accepted', 'strong'].includes(result.level);
  }).length;
}

function getSentenceLabel(result) {
  if (result.level === 'exact') return '매우 정확';
  if (result.level === 'accepted' || result.level === 'strong') return '의미 맞음';
  if (result.level === 'partial') return '부분 성공';
  if (result.level === 'empty') return '미작성';
  return '다시 보기';
}

function renderSummary() {
  const sentenceSuccess = getSentenceSuccessCount();
  const reviewTargets = state.responses
    .map((response, index) => ({
      index,
      result: response.step5.evaluation || evaluateSentence(response.step5.text, cuts[index])
    }))
    .filter((item) => !['exact', 'accepted', 'strong'].includes(item.result.level));

  return `
    <div class="progress-card">
      <div class="progress-top">
        <div>
          <div class="eyebrow">종합 피드백</div>
          <h2 class="progress-title">컷 문장 쓰기 결과를 확인해 보세요</h2>
          <p class="progress-desc">어떤 단계가 쉬웠는지, 어느 컷을 다시 보면 좋은지 한눈에 볼 수 있습니다.</p>
        </div>
        ${renderProgressActions('마무리')}
      </div>
    </div>

    <section class="summary-layout">
      <div class="summary-metrics">
        <div class="metric"><strong>${getStepMetricValue(0)} / ${cuts.length}</strong><span>객관식</span></div>
        <div class="metric"><strong>${getStepMetricValue(1)} / ${cuts.length}</strong><span>어휘 넣기</span></div>
        <div class="metric"><strong>${getStepMetricValue(2)} / ${cuts.length}</strong><span>순서 배열</span></div>
        <div class="metric"><strong>${getStepMetricValue(3)} / ${cuts.length}</strong><span>빈칸 쓰기</span></div>
        <div class="metric"><strong>${sentenceSuccess} / ${cuts.length}</strong><span>전체 문장 쓰기</span></div>
      </div>

      <div class="summary-card">
        <div class="panel-head">
          <div>
            <h3>컷별 확인</h3>
            <p>학생 문장과 모범 문장을 같이 보면서 다시 볼 컷을 고르세요.</p>
          </div>
          <span class="highlight-tag">다시 보기</span>
        </div>
        <div class="summary-list">
          ${state.responses.map((response, index) => {
            const cut = cuts[index];
            const result = response.step5.evaluation || evaluateSentence(response.step5.text, cut);
            const helper = result.missingKeywords && result.missingKeywords.length
              ? `보완하면 좋은 핵심어: ${escapeHtml(result.missingKeywords.join(', '))}`
              : '핵심 표현이 잘 들어갔습니다.';
            return `
              <div class="summary-item">
                <strong>컷 ${index + 1} · ${getSentenceLabel(result)}</strong>
                <p>내 문장: ${response.step5.text.trim() ? escapeHtml(response.step5.text.trim()) : '아직 쓰지 않았어요.'}</p>
                <p>모범 문장: ${escapeHtml(cut.sentence)}</p>
                <p>${helper}</p>
                <div class="actions">
                  <button type="button" class="ghost-btn" data-action="review-cut" data-cut-index="${index}">이 컷 다시 하기</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      ${reviewTargets.length ? `
        <div class="summary-card">
          <div class="panel-head">
            <div>
              <h3>우선 다시 보면 좋은 컷</h3>
              <p>핵심어가 빠진 컷부터 다시 보면 학습 효과가 큽니다.</p>
            </div>
          </div>
          <div class="summary-list">
            ${reviewTargets.map((item) => `
              <div class="summary-item">
                <strong>컷 ${item.index + 1}</strong>
                <p>보완하면 좋은 핵심어: ${escapeHtml(item.result.missingKeywords.join(', ') || '문장 전체 흐름')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="actions">
        <button type="button" class="nav-btn" data-action="restart">처음부터 다시 하기</button>
      </div>
    </section>
  `;
}

function renderActivity() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  return `
    <div class="activity-layout">
      <div class="activity-secondary">
        <div class="progress-card">
      <div class="progress-top">
        <div>
          <div class="eyebrow">${state.currentStep + 1}단계 / ${STEP_LABELS.length}단계</div>
          <h2 class="progress-title">${STEP_LABELS[state.currentStep]}</h2>
          <p class="progress-desc">현재 단계에서 컷 ${state.currentCut + 1} / ${cuts.length}를 진행 중입니다. 이번 단계를 모든 컷에 적용한 뒤 다음 단계로 넘어갑니다.</p>
        </div>
        ${renderProgressActions(`컷 ${state.currentCut + 1}`)}
      </div>
      <div class="step-pills">${renderStepPills()}</div>
      <div class="cut-pills">${renderCutPills()}</div>
        </div>
      </div>
      <div class="activity-primary">
        <div class="workspace">
      ${renderImagePanel(cut)}
      ${renderStepPanel(cut, response)}
        </div>
      </div>
    </div>
    ${renderFloatingPreview(cut)}
  `;
}

function renderApp() {
  app.innerHTML = `${state.view === 'summary' ? renderSummary() : renderActivity()}${renderPassageModal()}`;
  setupFloatingPreview();
  syncPassageUi();
}

function focusAfterRender(selector) {
  requestAnimationFrame(() => {
    const element = document.querySelector(selector);
    if (element) element.focus({ preventScroll: true });
  });
}

function syncPassageUi() {
  document.body.classList.toggle('passage-open', state.isPassageOpen);
  const navTrigger = document.querySelector('[data-nav-open-passage]');
  if (navTrigger) navTrigger.setAttribute('aria-expanded', state.isPassageOpen ? 'true' : 'false');

  if (shouldFocusPassageClose) {
    focusAfterRender('[data-passage-close-button]');
  } else if (shouldRestorePassageTrigger) {
    focusAfterRender('[data-action="open-passage"]');
  }

  shouldFocusPassageClose = false;
  shouldRestorePassageTrigger = false;
}

function handlePassageTabKey(event) {
  if (!state.isPassageOpen || event.key !== 'Tab') return;

  const dialog = document.getElementById('passage-dialog');
  if (!dialog) return;

  const focusableElements = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled && element.offsetParent !== null);

  if (!focusableElements.length) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (focusableElements.length === 1) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function teardownFloatingPreview() {
  if (floatingPreviewObserver) {
    floatingPreviewObserver.disconnect();
    floatingPreviewObserver = null;
  }
}

function setFloatingPreviewVisible(visible) {
  const preview = app.querySelector('[data-floating-preview]');
  if (preview) preview.classList.toggle('is-visible', visible);
}

function setupFloatingPreview() {
  teardownFloatingPreview();
  setFloatingPreviewVisible(false);

  if (state.view !== 'activity' || !floatingPreviewMedia.matches || typeof IntersectionObserver !== 'function') {
    return;
  }

  const imagePanel = app.querySelector('[data-image-panel]');
  const preview = app.querySelector('[data-floating-preview]');
  if (!imagePanel || !preview) return;

  floatingPreviewObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const shouldShow = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      preview.classList.toggle('is-visible', shouldShow);
    },
    {
      threshold: [0, 0.18, 0.45, 1],
      rootMargin: '-76px 0px 0px 0px'
    }
  );

  floatingPreviewObserver.observe(imagePanel);
}

function scrollToImagePanel() {
  const imagePanel = app.querySelector('[data-image-panel]');
  if (!imagePanel) return;
  setFloatingPreviewVisible(false);
  imagePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scheduleImagePanelScroll() {
  if (state.view !== 'activity' || typeof window.requestAnimationFrame !== 'function') return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      scrollToImagePanel();
    });
  });
}

function scrollRangeIntoView(startElement, endElement) {
  if (!startElement || !endElement) return;
  const topPadding = 92;
  const bottomPadding = 28;
  const startRect = startElement.getBoundingClientRect();
  const endRect = endElement.getBoundingClientRect();
  const rangeTop = Math.min(startRect.top, endRect.top);
  const rangeBottom = Math.max(startRect.bottom, endRect.bottom);
  const viewportTop = topPadding;
  const viewportBottom = window.innerHeight - bottomPadding;

  if (rangeTop >= viewportTop && rangeBottom <= viewportBottom) return;

  window.scrollTo({
    top: Math.max(window.scrollY + rangeTop - topPadding, 0),
    behavior: 'smooth'
  });
}

function scheduleRangeScroll(getElements) {
  if (state.view !== 'activity' || typeof window.requestAnimationFrame !== 'function') return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const { startElement, endElement } = getElements();
      scrollRangeIntoView(startElement, endElement);
    });
  });
}

function scheduleStep1SelectionScroll() {
  if (state.currentStep !== 0) return;
  scheduleRangeScroll(() => ({
    startElement: app.querySelector('[data-step1-choice-list]'),
    endElement: app.querySelector('[data-action="check-step1"]')
  }));
}

function scheduleCheckActionToNextScroll(checkAction) {
  scheduleRangeScroll(() => ({
    startElement: app.querySelector(`[data-action="${checkAction}"]`),
    endElement: app.querySelector('[data-action="next"]')
  }));
}

function resetStepFeedback() {
  const feedback = document.getElementById('step-feedback');
  if (feedback) feedback.remove();
  const nextButton = app.querySelector('[data-action="next"]');
  if (nextButton) nextButton.disabled = true;
}

function refreshLiveButtons() {
  const step4Button = app.querySelector('[data-action="check-step4"]');
  if (step4Button && state.view === 'activity' && state.currentStep === 3) {
    const response = getCurrentResponse();
    step4Button.disabled = response.step4.inputs.some((value) => !value.trim());
  }

  const step5Button = app.querySelector('[data-action="check-step5"]');
  if (step5Button && state.view === 'activity' && state.currentStep === 4) {
    const response = getCurrentResponse();
    step5Button.disabled = !response.step5.text.trim();
  }
}

function setStepUnchecked(stepData) {
  stepData.checked = false;
  if ('correct' in stepData) stepData.correct = false;
}

function selectChoice(optionId) {
  const response = getCurrentResponse();
  response.step1.selected = Number(optionId);
  setStepUnchecked(response.step1);
}

function checkStep1() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const selected = findById(response.step1.optionOrder, response.step1.selected);
  response.step1.checked = true;
  response.step1.correct = Boolean(selected && selected.label === cut.sentence);
}

function activateSlot(slotIndex) {
  const response = getCurrentResponse();
  const numericIndex = Number(slotIndex);
  if (response.step2.placements[numericIndex] !== null) {
    response.step2.placements[numericIndex] = null;
  }
  state.activeSlot = numericIndex;
  setStepUnchecked(response.step2);
}

function placeChoice(choiceId, preferredSlot = null) {
  const response = getCurrentResponse();
  const numericId = Number(choiceId);
  if (response.step2.placements.includes(numericId)) return;
  let targetSlot = preferredSlot === null ? state.activeSlot : Number(preferredSlot);
  if (response.step2.placements[targetSlot] !== null) {
    targetSlot = response.step2.placements.findIndex((value) => value === null);
  }
  if (targetSlot === -1) return;
  response.step2.placements[targetSlot] = numericId;
  state.activeSlot = Math.min(targetSlot + 1, response.step2.placements.length - 1);
  setStepUnchecked(response.step2);
}

function resetStep2() {
  const response = getCurrentResponse();
  response.step2.placements = Array(getCurrentCut().dropAnswers.length).fill(null);
  setStepUnchecked(response.step2);
  state.activeSlot = 0;
}

function checkStep2() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.step2.checked = true;
  response.step2.correct = response.step2.placements.every((choiceId, index) => {
    const choice = findById(response.step2.choiceOrder, choiceId);
    return choice && normalizeText(choice.label) === normalizeText(cut.dropAnswers[index]);
  });
}

function pickOrder(orderId) {
  const response = getCurrentResponse();
  const numericId = Number(orderId);
  if (response.step3.arranged.includes(numericId)) return;
  response.step3.arranged.push(numericId);
  setStepUnchecked(response.step3);
}

function removeOrder(orderId) {
  const response = getCurrentResponse();
  response.step3.arranged = response.step3.arranged.filter((id) => id !== Number(orderId));
  setStepUnchecked(response.step3);
}

function resetStep3() {
  const response = getCurrentResponse();
  response.step3.arranged = [];
  setStepUnchecked(response.step3);
}

function checkStep3() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.step3.checked = true;
  response.step3.correct = response.step3.arranged.length === cut.orderTokens.length &&
    response.step3.arranged.every((id, index) => id === index);
}

function updateFillInput(index, value) {
  const response = getCurrentResponse();
  response.step4.inputs[Number(index)] = value;
  setStepUnchecked(response.step4);
  response.step4.correctCount = 0;
  resetStepFeedback();
}

function checkStep4() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  const correctCount = cut.fillBlanks.filter((blank, index) =>
    matchesAnswer(response.step4.inputs[index], blank.answers)
  ).length;
  response.step4.checked = true;
  response.step4.correctCount = correctCount;
  response.step4.correct = correctCount === cut.fillBlanks.length;
}

function updateFullText(value) {
  const response = getCurrentResponse();
  response.step5.text = value;
  response.step5.checked = false;
  response.step5.evaluation = null;
  resetStepFeedback();
}

function checkStep5() {
  const cut = getCurrentCut();
  const response = getCurrentResponse();
  response.step5.checked = true;
  response.step5.evaluation = evaluateSentence(response.step5.text, cut);
}

function goPrev() {
  if (state.view === 'summary') {
    state.view = 'activity';
    state.currentCut = cuts.length - 1;
    state.currentStep = STEP_LABELS.length - 1;
    return;
  }
  if (state.currentCut > 0) {
    state.currentCut -= 1;
    return;
  }
  if (state.currentStep > 0) {
    state.currentStep -= 1;
    state.currentCut = cuts.length - 1;
    state.activeSlot = 0;
  }
}

function goNext() {
  if (!canGoNext()) return false;
  if (state.currentCut < cuts.length - 1) {
    state.currentCut += 1;
    state.activeSlot = 0;
    return true;
  }
  if (state.currentStep < STEP_LABELS.length - 1) {
    state.currentStep += 1;
    state.currentCut = 0;
    state.activeSlot = 0;
    return true;
  }
  state.view = 'summary';
  return false;
}

function restartAll() {
  state = buildInitialState();
}

function getReviewStartStep(cutIndex) {
  const response = state.responses[cutIndex];
  if (!response.step1.correct) return 0;
  if (!response.step2.correct) return 1;
  if (!response.step3.correct) return 2;
  if (!response.step4.correct) return 3;
  const finalResult = response.step5.evaluation || evaluateSentence(response.step5.text, cuts[cutIndex]);
  if (!['exact', 'accepted', 'strong'].includes(finalResult.level)) return 4;
  return 4;
}

function reviewCut(index) {
  state.view = 'activity';
  state.currentCut = Number(index);
  state.currentStep = getReviewStartStep(state.currentCut);
  state.activeSlot = 0;
}

function openPassage() {
  state.isPassageOpen = true;
  shouldFocusPassageClose = true;
  shouldRestorePassageTrigger = false;
}

function closePassage() {
  state.isPassageOpen = false;
  shouldRestorePassageTrigger = true;
  shouldFocusPassageClose = false;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const { action } = target.dataset;
  let shouldRender = true;
  let shouldScrollToImagePanel = false;
  let shouldScrollStep1Selection = false;
  let checkActionToScroll = '';

  if (action === 'select-choice') {
    selectChoice(target.dataset.optionId);
    shouldScrollStep1Selection = true;
  }
  else if (action === 'check-step1') {
    checkStep1();
    checkActionToScroll = action;
  }
  else if (action === 'activate-slot') activateSlot(target.dataset.slot);
  else if (action === 'use-word') placeChoice(target.dataset.choiceId);
  else if (action === 'check-step2') {
    checkStep2();
    checkActionToScroll = action;
  }
  else if (action === 'reset-step2') resetStep2();
  else if (action === 'pick-order') pickOrder(target.dataset.orderId);
  else if (action === 'remove-order') removeOrder(target.dataset.orderId);
  else if (action === 'check-step3') {
    checkStep3();
    checkActionToScroll = action;
  }
  else if (action === 'reset-step3') resetStep3();
  else if (action === 'check-step4') {
    checkStep4();
    checkActionToScroll = action;
  }
  else if (action === 'check-step5') {
    checkStep5();
    checkActionToScroll = action;
  }
  else if (action === 'prev') goPrev();
  else if (action === 'next') shouldScrollToImagePanel = goNext();
  else if (action === 'restart') restartAll();
  else if (action === 'review-cut') reviewCut(target.dataset.cutIndex);
  else if (action === 'scroll-to-image') {
    scrollToImagePanel();
    shouldRender = false;
  }
  else if (action === 'open-passage') openPassage();
  else if (action === 'close-passage' || action === 'close-passage-backdrop') closePassage();
  else if (action === 'passage-panel') shouldRender = false;
  else shouldRender = false;

  if (shouldRender) {
    renderApp();
    if (shouldScrollStep1Selection) {
      scheduleStep1SelectionScroll();
    }
    if (checkActionToScroll) {
      scheduleCheckActionToNextScroll(checkActionToScroll);
    }
    if (shouldScrollToImagePanel) {
      scheduleImagePanelScroll();
    }
  }
});

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.action === 'fill-input') {
    updateFillInput(target.dataset.fillIndex, target.value);
  }
  if (target.dataset.action === 'full-text') {
    updateFullText(target.value);
  }
  refreshLiveButtons();
});

app.addEventListener('dragstart', (event) => {
  const target = event.target.closest('[data-choice-id]');
  if (!target || target.disabled) return;
  state.dragChoiceId = target.dataset.choiceId;
  event.dataTransfer.setData('text/plain', target.dataset.choiceId);
});

app.addEventListener('dragover', (event) => {
  const slot = event.target.closest('[data-slot]');
  if (!slot) return;
  event.preventDefault();
});

app.addEventListener('drop', (event) => {
  const slot = event.target.closest('[data-slot]');
  if (!slot) return;
  event.preventDefault();
  const choiceId = event.dataTransfer.getData('text/plain') || state.dragChoiceId;
  if (!choiceId) return;
  placeChoice(choiceId, slot.dataset.slot);
  renderApp();
});

window.addEventListener('keydown', (event) => {
  handlePassageTabKey(event);
  if (event.key === 'Escape' && state.isPassageOpen) {
    closePassage();
    renderApp();
  }
});

document.addEventListener('click', (event) => {
  const navTrigger = event.target.closest('[data-nav-open-passage]');
  if (!navTrigger) return;
  event.preventDefault();
  openPassage();
  renderApp();
});

if (typeof floatingPreviewMedia.addEventListener === 'function') {
  floatingPreviewMedia.addEventListener('change', setupFloatingPreview);
} else if (typeof floatingPreviewMedia.addListener === 'function') {
  floatingPreviewMedia.addListener(setupFloatingPreview);
}

renderApp();
