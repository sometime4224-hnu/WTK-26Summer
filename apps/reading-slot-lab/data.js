window.READING_SLOT_LAB_DATA = {
    components: [
        {
            id: "subject",
            label: "누가/무엇이",
            name: "주어",
            abbr: "S",
            hint: "문장의 주인공입니다.",
            particles: ["이/가"]
        },
        {
            id: "object",
            label: "무엇을/누구를",
            name: "목적어",
            abbr: "O",
            hint: "행동의 대상입니다.",
            particles: ["을/를"]
        },
        {
            id: "predicate",
            label: "무엇을 하다/어떻다",
            name: "동사/형용사",
            abbr: "V/Adj",
            hint: "행동이나 상태를 말합니다.",
            examples: ["하다", "좋다"]
        },
        {
            id: "complement",
            label: "무엇이 되다/아니다",
            name: "보어",
            abbr: "Comp",
            hint: "되다, 아니다 앞에 오는 말입니다.",
            particles: ["이/가"]
        },
        {
            id: "adnominal",
            label: "어떤/무슨",
            name: "관형어",
            abbr: "Adn",
            hint: "뒤의 이름을 꾸밉니다.",
            examples: ["좋은", "여러"]
        },
        {
            id: "adverbial",
            label: "언제/어디서/어떻게/왜",
            name: "부사어",
            abbr: "Adv",
            hint: "동작이나 상태를 자세히 말합니다.",
            particles: ["에", "에서", "(으)로"]
        },
        {
            id: "connective",
            label: "앞뒤 문장 연결",
            name: "연결 표현",
            abbr: "Conn",
            hint: "두 내용을 이어 줍니다.",
            examples: ["그리고", "-고"]
        }
    ],
    items: [
        {
            id: "c10-01",
            lesson: "10",
            sourceTitle: "사랑에도 유통 기한이 있을까요?",
            passage: [
                { text: "사랑에 빠진 연인들은 서로의 사랑이 영원할 거라고 생각합니다." },
                { before: "하지만 사랑에도 ", after: " 있다고 합니다." },
                { text: "시간이 지나면 손을 잡아도 가슴이 두근거리지 않는다고 합니다." }
            ],
            context: "사랑이 처음과 다르게 변할 수 있다는 부분입니다.",
            before: "하지만 사랑에도 ",
            after: " 있다고 합니다.",
            componentId: "subject",
            modelAnswers: ["유통 기한이"],
            clue: "있다 앞에서 무엇이 있는지 말합니다.",
            explanation: "무엇이 있다고 하는지 찾으면 됩니다. 그래서 이 자리는 주어입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "있다고 합니다", note: "무엇이 있다고 하는지 찾습니다." }
                ],
                logic: [
                    { line: 1, text: "영원할 거라고 생각합니다", note: "처음의 생각입니다." },
                    { line: 2, text: "하지만", note: "앞과 다른 이야기가 이어집니다." }
                ]
            }
        },
        {
            id: "c10-02",
            lesson: "10",
            sourceTitle: "사랑에도 유통 기한이 있을까요?",
            passage: [
                { text: "사랑에 빠진 연인들은 처음에는 서로를 자주 보고 싶어합니다." },
                { before: "", after: " 연애를 하던 사람들도 시간이 지나면 마음이 달라질 수 있습니다." },
                { text: "그래서 어떤 사람들은 사랑이 식었다고 생각합니다." }
            ],
            context: "처음 사랑할 때의 뜨거운 마음을 설명하는 부분입니다.",
            before: "",
            after: " 연애를 하던 사람들도 시간이 지나면 가슴이 두근거리지 않는다고 합니다.",
            componentId: "adverbial",
            modelAnswers: ["뜨겁게"],
            possibilities: [
                {
                    componentId: "adverbial",
                    answers: ["뜨겁게", "열정적으로", "오랫동안"],
                    note: "연애를 어떻게 했는지 말하면 부사어입니다."
                },
                {
                    componentId: "adnominal",
                    answers: ["행복한", "즐거운", "좋은"],
                    note: "어떤 연애인지 말하면 뒤의 연애를 꾸미는 관형어입니다."
                }
            ],
            reviewNote: "이 빈칸은 뒤의 '연애'를 직접 꾸밀 수도 있고, '연애를 하던' 행동 전체를 꾸밀 수도 있습니다.",
            clue: "어떻게 연애를 했는지 말합니다.",
            explanation: "원문은 부사어이지만, 자연스러운 문장을 만들면 관형어도 가능합니다.",
            hints: {
                syntax: [
                    { line: 2, text: "연애를 하던", note: "앞말이 연애나 하던을 꾸밀 수 있습니다." },
                    { line: 2, text: "하던", note: "행동의 모습을 말할 수도 있습니다." }
                ],
                logic: [
                    { line: 1, text: "처음에는 서로를 자주 보고 싶어합니다", note: "처음 마음이 어떤지 보여 줍니다." },
                    { line: 2, text: "마음이 달라질 수 있습니다", note: "시간이 지난 뒤의 변화입니다." }
                ]
            }
        },
        {
            id: "c10-03",
            lesson: "10",
            sourceTitle: "사랑에도 유통 기한이 있을까요?",
            passage: [
                { text: "처음에는 손을 잡기만 해도 마음이 설렙니다." },
                { before: "시간이 지나면 손을 잡거나 팔짱을 껴도 가슴이 ", after: " 않는다고 합니다." },
                { text: "이 때문에 사랑이 식었다고 생각하는 연인들이 많습니다." }
            ],
            context: "시간이 지나 마음의 반응이 약해지는 부분입니다.",
            before: "손을 잡거나 팔짱을 껴도 가슴이 ",
            after: " 않는다고 합니다.",
            componentId: "predicate",
            modelAnswers: ["두근거리지"],
            clue: "가슴이 어떻게 되지 않는지 말합니다.",
            explanation: "상태를 말하는 형용사/동사 자리입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "가슴이", note: "가슴이 어떻게 되는지 봅니다." },
                    { line: 2, text: "않는다고 합니다", note: "앞에 동사나 형용사가 필요합니다." }
                ],
                logic: [
                    { line: 1, text: "손을 잡기만 해도 마음이 설렙니다", note: "처음의 반응입니다." },
                    { line: 2, text: "시간이 지나면", note: "시간이 지난 뒤의 변화입니다." }
                ]
            }
        },
        {
            id: "c10-04",
            lesson: "10",
            sourceTitle: "사랑에도 유통 기한이 있을까요?",
            passage: [
                { text: "사랑을 오래 지키려면 서로의 노력이 필요합니다." },
                { text: "서로를 있는 그대로 이해해 주는 것도 중요합니다." },
                { before: "또 사랑하는 마음을 자주 ", after: "." }
            ],
            context: "오래 사랑하기 위한 방법 중 하나입니다.",
            before: "사랑하는 마음을 자주 ",
            after: ".",
            componentId: "predicate",
            modelAnswers: ["표현합니다"],
            clue: "사랑하는 마음을 어떻게 하는지 말합니다.",
            explanation: "행동을 말하는 동사 자리입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "사랑하는 마음을", note: "무엇을 어떻게 하는지 봅니다." },
                    { line: 2, text: "중요합니다", note: "문장을 끝내는 말이 필요합니다." }
                ],
                logic: [
                    { line: 1, text: "서로의 노력이 필요합니다", note: "사랑을 지키는 방법을 찾습니다." },
                    { line: 3, text: "사랑하는 마음을 자주", note: "마음을 자주 어떻게 하는지 생각합니다." }
                ]
            }
        },
        {
            id: "c10-05",
            lesson: "10",
            sourceTitle: "사랑에도 유통 기한이 있을까요?",
            passage: [
                { text: "사랑하는 사람과 오래 함께하려면 새로운 시간이 필요합니다." },
                { text: "둘이 같이 할 수 있는 활동이 있으면 관계가 더 편해집니다." },
                { before: "그래서 함께 할 수 있는 ", after: " 만듭니다." }
            ],
            context: "함께하는 시간을 만드는 방법입니다.",
            before: "함께 할 수 있는 ",
            after: " 만듭니다.",
            componentId: "object",
            modelAnswers: ["취미를"],
            clue: "무엇을 만드는지 찾습니다.",
            explanation: "만드는 대상이 무엇인지 묻는 자리입니다. 그래서 목적어입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "만듭니다", note: "무엇을 만드는지 찾습니다." }
                ],
                logic: [
                    { line: 2, text: "같이 할 수 있는 활동", note: "함께 할 수 있는 것을 말합니다." },
                    { line: 2, text: "관계가 더 편해집니다", note: "관계에 도움이 되는 내용입니다." }
                ]
            }
        },
        {
            id: "c11-01",
            lesson: "11",
            sourceTitle: "직장에서 성공하는 법",
            passage: [
                { text: "직장인이라면 회사에서 인정받고 싶어합니다." },
                { text: "그런 사람은 동료와 회사에 도움이 됩니다." },
                { before: "많은 직장인들은 회사에서 꼭 필요한 ", after: " 되고 싶어합니다." }
            ],
            context: "직장인이 되고 싶은 모습을 말하는 부분입니다.",
            before: "회사에서 꼭 필요한 ",
            after: " 되고 싶을 것이다.",
            componentId: "complement",
            modelAnswers: ["사람이"],
            clue: "무엇이 되고 싶은지 말합니다.",
            explanation: "되다 앞에서 무엇이 되는지 말합니다. 그래서 보어입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "되고 싶어합니다", note: "무엇이 되고 싶은지 봅니다." }
                ],
                logic: [
                    { line: 1, text: "인정받고 싶어합니다", note: "직장인이 바라는 모습입니다." },
                    { line: 2, text: "동료와 회사에 도움이 됩니다", note: "회사에 필요한 사람의 모습입니다." }
                ]
            }
        },
        {
            id: "c11-02",
            lesson: "11",
            sourceTitle: "직장에서 성공하는 법",
            passage: [
                { text: "회사에는 일을 잘 처리하는 사람이 있습니다." },
                { text: "그 사람은 어려운 일이 생겨도 주변의 도움을 잘 받습니다." },
                { before: "그래서 복잡한 문제도 쉽게 ", after: "." }
            ],
            context: "일을 잘 처리하는 사람을 설명하는 부분입니다.",
            before: "그 사람은 어려운 일이 생겨도 누군가의 도움을 받아 쉽게 ",
            after: ".",
            componentId: "predicate",
            modelAnswers: ["해결한다"],
            clue: "어려운 일을 어떻게 하는지 말합니다.",
            explanation: "행동을 말하는 동사 자리입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "쉽게", note: "쉽게 무엇을 하는지 찾습니다." }
                ],
                logic: [
                    { line: 2, text: "어려운 일이 생겨도", note: "어려운 상황이 나옵니다." },
                    { line: 3, text: "문제도", note: "처리해야 할 대상입니다." }
                ]
            }
        },
        {
            id: "c11-03",
            lesson: "11",
            sourceTitle: "직장에서 성공하는 법",
            passage: [
                { text: "복사기를 도와주고 서류를 들어 주는 것은 작은 친절입니다." },
                { before: "사람들은 이런 작은 친절을 오래 ", after: " 나중에 그 사람을 돕습니다." },
                { text: "그래서 친절한 사람은 성공할 가능성이 높습니다." }
            ],
            context: "친절을 기억하는 사람들의 행동입니다.",
            before: "사람들은 이런 작은 친절을 오래 ",
            after: " 나중에 그 사람을 돕는다.",
            componentId: "connective",
            modelAnswers: ["기억했다가"],
            clue: "기억한 뒤에 돕는다는 흐름을 이어 줍니다.",
            explanation: "앞의 행동과 뒤의 행동을 순서대로 연결합니다. 그래서 연결 표현입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "오래", note: "오래 한 뒤 다음 행동으로 이어집니다." },
                    { line: 2, text: "나중에 그 사람을 돕습니다", note: "뒤 행동과 이어지는 말이 필요합니다." }
                ],
                logic: [
                    { line: 1, text: "작은 친절", note: "사람들이 기억하는 내용입니다." },
                    { line: 2, text: "나중에", note: "시간 순서가 보입니다." }
                ]
            }
        },
        {
            id: "c11-04",
            lesson: "11",
            sourceTitle: "직장에서 성공하는 법",
            passage: [
                { text: "독서를 하는 사람은 업무에 도움이 되는 것을 배울 수 있습니다." },
                { text: "한국 직장인들은 경제 경영 서적도 많이 읽습니다." },
                { before: "경제 경영 서적을 읽으면 업무에 필요한 ", after: " 얻을 수 있습니다." }
            ],
            context: "책을 읽으면 얻을 수 있는 것을 말하는 부분입니다.",
            before: "경제 경영 서적을 읽으면 업무에 필요한 ",
            after: " 얻을 수 있다.",
            componentId: "object",
            modelAnswers: ["지식을"],
            clue: "무엇을 얻을 수 있는지 찾습니다.",
            explanation: "얻는 대상이 무엇인지 묻는 자리입니다. 그래서 목적어입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "얻을 수 있습니다", note: "무엇을 얻는지 찾습니다." }
                ],
                logic: [
                    { line: 1, text: "독서를 하는 사람", note: "책을 읽는 상황입니다." },
                    { line: 1, text: "업무에 도움이", note: "일에 필요한 내용입니다." },
                    { line: 2, text: "경제 경영 서적", note: "책의 종류가 이어집니다." }
                ]
            }
        },
        {
            id: "c11-05",
            lesson: "11",
            sourceTitle: "직장에서 성공하는 법",
            passage: [
                { text: "한 조사에서 한국 직장인의 평균 독서량은 16권으로 나왔습니다." },
                { before: "한국의 직장인들은 1년에 평균 ", after: " 책을 읽습니다." },
                { text: "가장 많이 읽는 책은 경제 경영 서적과 소설입니다." }
            ],
            context: "한국 직장인의 독서량을 말하는 부분입니다.",
            before: "한국의 직장인들은 1년에 평균 ",
            after: " 책을 읽는다.",
            componentId: "adnominal",
            modelAnswers: ["16권의"],
            clue: "뒤의 책을 수량으로 꾸밉니다.",
            explanation: "몇 권의 책인지 뒤의 말을 꾸며 줍니다. 그래서 관형어입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "책을 읽습니다", note: "뒤의 책을 꾸미는 말이 필요합니다." },
                    { line: 2, text: "1년에 평균", note: "수량을 말하는 자리입니다." }
                ],
                logic: [
                    { line: 1, text: "평균 독서량은 16권", note: "정확한 수량이 앞에 나옵니다." },
                    { line: 2, text: "1년에 평균", note: "같은 수량을 다시 말합니다." }
                ]
            }
        },
        {
            id: "c12-01",
            lesson: "12",
            sourceTitle: "여러분의 목 건강은 어떠십니까?",
            passage: [
                { text: "요즘 컴퓨터를 오래 보는 사람이 많습니다." },
                { text: "그 때문에 거북목 증후군을 걱정하는 사람도 많습니다." },
                { before: "여러분은 거북목 증후군에 대해 ", after: " 본 적이 있습니까?" }
            ],
            context: "글을 시작하며 병 이름을 묻는 부분입니다.",
            before: "거북목 증후군에 대해 ",
            after: " 본 적이 있습니까?",
            componentId: "predicate",
            modelAnswers: ["들어"],
            clue: "어떤 경험을 했는지 행동을 만듭니다.",
            explanation: "경험을 말하는 동사 자리입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "본 적이 있습니까", note: "경험을 묻는 말과 어울리는 행동이 필요합니다." }
                ],
                logic: [
                    { line: 1, text: "컴퓨터를 오래 보는", note: "목 건강 문제의 배경입니다." },
                    { line: 2, text: "거북목 증후군을 걱정", note: "묻고 싶은 병 이름이 나옵니다." }
                ]
            }
        },
        {
            id: "c12-02",
            lesson: "12",
            sourceTitle: "여러분의 목 건강은 어떠십니까?",
            passage: [
                { text: "많은 사람들이 컴퓨터를 볼 때 자세가 나빠집니다." },
                { before: "많은 사람들이 거북처럼 목을 앞으로 ", after: " 빼고 컴퓨터를 봅니다." },
                { text: "이런 자세로 오래 있으면 목 건강에 이상이 생깁니다." }
            ],
            context: "컴퓨터를 보는 자세를 설명하는 부분입니다.",
            before: "많은 사람들이 거북처럼 목을 앞으로 ",
            after: " 빼고 컴퓨터를 봅니다.",
            componentId: "adverbial",
            modelAnswers: ["길게"],
            clue: "목을 어떻게 빼는지 말합니다.",
            explanation: "동작의 모습을 자세히 말합니다. 그래서 부사어입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "목을 앞으로", note: "목을 어떻게 빼는지 찾습니다." },
                    { line: 2, text: "빼고", note: "동작의 모습을 자세히 말합니다." }
                ],
                logic: [
                    { line: 2, text: "거북처럼", note: "목 모양을 떠올리게 합니다." },
                    { line: 1, text: "자세가 나빠집니다", note: "나쁜 자세를 설명합니다." }
                ]
            }
        },
        {
            id: "c12-03",
            lesson: "12",
            sourceTitle: "여러분의 목 건강은 어떠십니까?",
            passage: [
                { text: "거북목 증후군에 걸리면 여러 증상이 생깁니다." },
                { before: "이 병에 걸리면 쉽게 ", after: " 목과 어깨가 아픕니다." },
                { text: "또 두통으로 고생할 수도 있습니다." }
            ],
            context: "거북목 증후군의 증상을 말하는 부분입니다.",
            before: "이 병에 걸리면 쉽게 ",
            after: " 목과 어깨가 아픕니다.",
            componentId: "connective",
            modelAnswers: ["피곤해지고"],
            clue: "피곤해지는 일과 아픈 일을 이어 줍니다.",
            explanation: "두 증상을 이어서 말합니다. 그래서 연결 표현입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "목과 어깨가 아픕니다", note: "다음 증상과 이어지는 말이 필요합니다." },
                    { line: 3, text: "또", note: "증상이 더 이어집니다." }
                ],
                logic: [
                    { line: 1, text: "여러 증상이 생깁니다", note: "증상들을 나열하는 흐름입니다." },
                    { line: 3, text: "두통", note: "또 다른 증상입니다." }
                ]
            }
        },
        {
            id: "c12-04",
            lesson: "12",
            sourceTitle: "여러분의 목 건강은 어떠십니까?",
            passage: [
                { text: "목 건강에는 걷기 운동이 도움이 됩니다." },
                { text: "하지만 회사에서 일하는 동안 밖에 나가기는 어렵습니다." },
                { before: "바쁜 업무 시간에 밖에 나가서 산책하는 일이 ", after: " 않을 겁니다." }
            ],
            context: "바쁜 업무 시간에는 밖에 나가기 어렵다는 부분입니다.",
            before: "바쁜 업무 시간에 밖에 나가서 산책하는 일이 ",
            after: " 않을 겁니다.",
            componentId: "predicate",
            modelAnswers: ["쉽지는"],
            clue: "산책하는 일이 어떤지 말합니다.",
            explanation: "상태를 말하는 형용사 자리입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "않을 겁니다", note: "앞에 상태를 말하는 표현이 필요합니다." }
                ],
                logic: [
                    { line: 2, text: "밖에 나가기는 어렵습니다", note: "산책하기 어려운 이유입니다." },
                    { line: 3, text: "바쁜 업무 시간", note: "시간 상황이 어렵습니다." }
                ]
            }
        },
        {
            id: "c12-05",
            lesson: "12",
            sourceTitle: "여러분의 목 건강은 어떠십니까?",
            passage: [
                { text: "자세가 나쁘면 목뼈 모양이 변할 수 있습니다." },
                { text: "바른 자세와 스트레칭은 몸을 편하게 해 줍니다." },
                { before: "자세가 좋아야 ", after: " 지킬 수 있습니다." }
            ],
            context: "바른 자세의 필요성을 말하는 부분입니다.",
            before: "자세가 좋아야 ",
            after: " 지킬 수 있습니다.",
            componentId: "object",
            modelAnswers: ["건강을"],
            clue: "무엇을 지키는지 찾습니다.",
            explanation: "지키는 대상이 무엇인지 묻는 자리입니다. 그래서 목적어입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "지킬 수 있습니다", note: "무엇을 지키는지 찾습니다." }
                ],
                logic: [
                    { line: 1, text: "목뼈 모양이 변할 수", note: "나쁜 자세의 문제입니다." },
                    { line: 2, text: "바른 자세와 스트레칭", note: "몸을 편하게 하는 방법입니다." }
                ]
            }
        },
        {
            id: "c13-01",
            lesson: "13",
            sourceTitle: "동물 사랑 바자회",
            passage: [
                { text: "동물 사랑 바자회에 여러분을 초대합니다." },
                { text: "동사모는 동물을 사랑하는 사람들의 모임입니다." },
                { before: "동사모는 동물을 사랑하는 사람들이 ", after: " 모임입니다." }
            ],
            context: "동사모가 어떤 모임인지 소개하는 부분입니다.",
            before: "동사모는 동물을 사랑하는 사람들이 ",
            after: " 모임입니다.",
            componentId: "adnominal",
            modelAnswers: ["모인"],
            clue: "뒤의 모임을 설명합니다.",
            explanation: "어떤 모임인지 뒤의 말을 꾸며 줍니다. 그래서 관형어입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "모임입니다", note: "뒤의 모임을 설명하는 말이 필요합니다." }
                ],
                logic: [
                    { line: 2, text: "사람들의 모임", note: "어떤 사람들이 모였는지 보입니다." },
                    { line: 3, text: "동물을 사랑하는 사람들이", note: "모임을 만든 사람들입니다." }
                ]
            }
        },
        {
            id: "c13-02",
            lesson: "13",
            sourceTitle: "동물 사랑 바자회",
            passage: [
                { text: "동사모는 매년 바자회를 엽니다." },
                { before: "매년 바자회를 열어서 동물 보호 기금도 ", after: " 버려진 동물에게 새 주인을 찾아 주고 있습니다." },
                { text: "모아진 돈은 동물을 위해 쓰입니다." }
            ],
            context: "바자회를 여는 목적을 말하는 부분입니다.",
            before: "매년 바자회를 열어서 동물 보호 기금도 ",
            after: " 버려진 동물에게 새 주인을 찾아 주고 있습니다.",
            componentId: "connective",
            modelAnswers: ["마련하고"],
            clue: "기금을 마련한 뒤 다른 일도 한다는 흐름입니다.",
            explanation: "앞의 일과 뒤의 일을 이어 줍니다. 그래서 연결 표현입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "버려진 동물에게 새 주인을 찾아 주고", note: "앞일과 뒤일을 이어 주는 말이 필요합니다." }
                ],
                logic: [
                    { line: 2, text: "동물 보호 기금", note: "바자회로 만들려는 것입니다." },
                    { line: 1, text: "매년 바자회", note: "기금을 모으는 행사입니다." }
                ]
            }
        },
        {
            id: "c13-03",
            lesson: "13",
            sourceTitle: "동물 사랑 바자회",
            passage: [
                { text: "동물을 좋아해도 돌본 경험이 없으면 걱정할 수 있습니다." },
                { before: "동물을 잘 돌볼 수 없을까 봐 ", after: " 분들을 위해 여러 가지 도움도 드립니다." },
                { text: "처음 동물을 만나는 사람도 바자회에서 안내를 받을 수 있습니다." }
            ],
            context: "동물을 잘 돌볼 수 있을지 걱정하는 사람들을 말합니다.",
            before: "동물을 잘 돌볼 수 없을까 봐 ",
            after: " 분들을 위해 여러 가지 도움도 드립니다.",
            componentId: "adnominal",
            modelAnswers: ["걱정하시는"],
            clue: "뒤의 분들을 설명합니다.",
            explanation: "어떤 분들인지 꾸며 주는 자리입니다. 그래서 관형어입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "분들을 위해", note: "어떤 분들인지 설명하는 말이 필요합니다." }
                ],
                logic: [
                    { line: 1, text: "돌본 경험이 없으면 걱정", note: "걱정하는 이유입니다." },
                    { line: 2, text: "없을까 봐", note: "불안한 마음을 보여 줍니다." }
                ]
            }
        },
        {
            id: "c13-04",
            lesson: "13",
            sourceTitle: "동물 사랑 바자회",
            passage: [
                { text: "바자회에서는 여러 활동을 준비했습니다." },
                { before: "낮 12시부터 2시까지는 밴드 음악을 ", after: " 채식 뷔페를 즐기실 수 있도록 했습니다." },
                { text: "또 동물 사진 전시도 볼 수 있습니다." }
            ],
            context: "낮 12시부터 2시까지 할 수 있는 활동입니다.",
            before: "밴드 음악을 ",
            after: " 채식 뷔페를 즐기실 수 있도록 했습니다.",
            componentId: "connective",
            modelAnswers: ["들으면서"],
            clue: "음악을 듣는 일과 뷔페를 즐기는 일을 함께 이어 줍니다.",
            explanation: "두 행동을 동시에 연결합니다. 그래서 연결 표현입니다.",
            hints: {
                syntax: [
                    { line: 2, text: "즐기실 수 있도록", note: "두 활동을 함께 이어 주는 말이 필요합니다." }
                ],
                logic: [
                    { line: 2, text: "밴드 음악", note: "할 수 있는 활동입니다." },
                    { line: 1, text: "여러 활동", note: "행사에서 준비한 활동입니다." }
                ]
            }
        },
        {
            id: "c13-05",
            lesson: "13",
            sourceTitle: "동물 사랑 바자회",
            passage: [
                { text: "바자회에서 물건을 사면 기금이 모입니다." },
                { text: "이 기금은 버려진 동물과 멸종 위기 동물을 돕는 데 사용됩니다." },
                { before: "모아진 돈은 모두 버려진 동물, 멸종 위기 동물을 위해 ", after: "." }
            ],
            context: "바자회에서 모은 돈의 사용처입니다.",
            before: "모아진 돈은 모두 버려진 동물, 멸종 위기 동물을 위해 ",
            after: ".",
            componentId: "predicate",
            modelAnswers: ["쓰입니다"],
            clue: "돈이 어떻게 되는지 말합니다.",
            explanation: "돈의 쓰임을 말하는 동사 자리입니다.",
            hints: {
                syntax: [
                    { line: 3, text: "돈은", note: "돈이 어떻게 되는지 찾습니다." },
                    { line: 2, text: "사용됩니다", note: "돈의 쓰임을 말하는 표현입니다." }
                ],
                logic: [
                    { line: 1, text: "기금이 모입니다", note: "바자회에서 돈이 모입니다." },
                    { line: 2, text: "동물을 돕는 데 사용됩니다", note: "돈의 사용처가 나옵니다." }
                ]
            }
        }
    ]
};
