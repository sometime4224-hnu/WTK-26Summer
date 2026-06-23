(() => {
  "use strict";

  const TEXTS = {
    ko: {
      guideEyebrow: "Reason Map",
      guideTitle: "비교하면서 외우는 이유 문법",
      guideDesc:
        "많은 이유 문법을 한 번에 외우기보다, 비슷한 것끼리 먼저 구분하면 훨씬 빨리 정리됩니다.",
      stepsTitle: "추천 학습 흐름",
      steps: [
        "먼저 `가장 보편적인 이유` 4개로 기본 차이를 잡아요.",
        "카드를 눌러 제약과 예문을 보고, 쓰기 어려운 상황을 함께 확인해요.",
        "헷갈리는 조합은 바로 비교표로 열어서 차이를 눈으로 확인해요."
      ],
      presetsTitle: "추천 비교 세트",
      jumpTitle: "빠른 이동",
      jumpCommon: "공통 이유 4개",
      jumpSpecial: "특수 이유 8개",
      groupCommon: "공통 이유",
      groupSpecial: "특수 상황",
      openHint: "눌러서 제약과 예문 보기",
      modalQuick: "빠른 판별",
      modalCompareWith: "함께 비교하면 좋은 문법",
      compareHint: "2개 이상 고르면 비교표가 열립니다.",
      compareSummaryTitle: "이 조합은 이렇게 보면 빨라요",
      compareCommon: "공통점",
      compareDiff: "차이",
      compareFocus: "기억 포인트",
      compareModeAria: "문법 비교 모드 열기",
      compareCardsTab: "차이 카드",
      compareTableTab: "비교표",
      decisionQuestion: "먼저 이 질문",
      decisionChoose: "이럴 때 고르기",
      decisionCaution: "주의",
      decisionSample: "대표 예문"
    },
    en: {
      guideEyebrow: "Reason Map",
      guideTitle: "Learn reason grammar by comparing",
      guideDesc:
        "Instead of memorizing many forms at once, start by separating similar patterns first.",
      stepsTitle: "Recommended flow",
      steps: [
        "Start with the 4 common reason patterns to build the base map.",
        "Open each card to check constraints and example sentences together.",
        "Use the comparison table right away for confusing pairs."
      ],
      presetsTitle: "Suggested comparison sets",
      jumpTitle: "Quick jump",
      jumpCommon: "4 common reasons",
      jumpSpecial: "8 special cases",
      groupCommon: "Common",
      groupSpecial: "Specialized",
      openHint: "Open constraints and examples",
      modalQuick: "Quick guide",
      modalCompareWith: "Good patterns to compare with",
      compareHint: "Select at least 2 to open the comparison table.",
      compareSummaryTitle: "A faster way to compare this set",
      compareCommon: "In common",
      compareDiff: "Difference",
      compareFocus: "Remember",
      compareModeAria: "Open grammar compare mode",
      compareCardsTab: "Decision cards",
      compareTableTab: "Table",
      decisionQuestion: "Ask first",
      decisionChoose: "Choose this when",
      decisionCaution: "Watch out",
      decisionSample: "Example"
    },
    vi: {
      guideEyebrow: "Reason Map",
      guideTitle: "Học ngữ pháp lý do bằng cách so sánh",
      guideDesc:
        "Thay vì học thuộc tất cả cùng lúc, hãy tách các mẫu dễ nhầm trước để học nhanh hơn.",
      stepsTitle: "Trình tự gợi ý",
      steps: [
        "Bắt đầu với 4 mẫu lý do thông dụng để có khung cơ bản.",
        "Mở từng thẻ để xem điều kiện dùng và ví dụ.",
        "Với các cặp dễ nhầm, mở bảng so sánh ngay để nhìn sự khác nhau."
      ],
      presetsTitle: "Cặp so sánh gợi ý",
      jumpTitle: "Di chuyển nhanh",
      jumpCommon: "4 mẫu thông dụng",
      jumpSpecial: "8 mẫu đặc biệt",
      groupCommon: "Thông dụng",
      groupSpecial: "Tình huống đặc biệt",
      openHint: "Mở để xem điều kiện và ví dụ",
      modalQuick: "Phân biệt nhanh",
      modalCompareWith: "Nên so sánh cùng",
      compareHint: "Chọn từ 2 mẫu trở lên để mở bảng so sánh.",
      compareSummaryTitle: "Cách nhìn nhanh cho tổ hợp này",
      compareCommon: "Điểm chung",
      compareDiff: "Khác nhau",
      compareFocus: "Ghi nhớ",
      compareModeAria: "Mở chế độ so sánh ngữ pháp",
      compareCardsTab: "Thẻ khác biệt",
      compareTableTab: "Bảng so sánh",
      decisionQuestion: "Hỏi trước",
      decisionChoose: "Chọn khi",
      decisionCaution: "Lưu ý",
      decisionSample: "Ví dụ"
    }
  };

  Object.assign(TEXTS, {
    ja: {
      guideEyebrow: "Reason Map",
      guideTitle: "比較して覚える理由文法",
      guideDesc:
        "多くの理由表現を一度に覚えるより、似ている形を先に分けると整理しやすくなります。",
      stepsTitle: "おすすめ学習順序",
      steps: [
        "まず基本的な理由表現4つで全体像をつかみます。",
        "カードを開いて制約と例文を確認します。",
        "迷いやすい組み合わせは比較表ですぐ確認します。"
      ],
      presetsTitle: "おすすめ比較セット",
      jumpTitle: "クイック移動",
      jumpCommon: "共通理由4つ",
      jumpSpecial: "特殊理由8つ",
      groupCommon: "共通理由",
      groupSpecial: "特殊場面",
      openHint: "押して制約と例文を見る",
      modalQuick: "すばやく判別",
      modalCompareWith: "一緒に比較するとよい文法",
      compareHint: "2つ以上選ぶと比較表が開きます。",
      compareSummaryTitle: "この組み合わせはこう見ると速い",
      compareCommon: "共通点",
      compareDiff: "違い",
      compareFocus: "覚えるポイント",
      compareModeAria: "文法比較モードを開く",
      compareCardsTab: "判別カード",
      compareTableTab: "比較表",
      decisionQuestion: "まずこの質問",
      decisionChoose: "こういう時に選ぶ",
      decisionCaution: "注意",
      decisionSample: "代表例文"
    },
    zh: {
      guideEyebrow: "Reason Map",
      guideTitle: "通过比较学习原因语法",
      guideDesc:
        "与其一次记住许多原因语法，不如先区分相似形式，这样整理得更快。",
      stepsTitle: "推荐学习流程",
      steps: [
        "先从4个常用原因语法开始建立基本框架。",
        "打开卡片查看限制条件和例句。",
        "容易混淆的组合马上用比较表确认差异。"
      ],
      presetsTitle: "推荐比较组合",
      jumpTitle: "快速移动",
      jumpCommon: "4个常用原因",
      jumpSpecial: "8个特殊情况",
      groupCommon: "常用原因",
      groupSpecial: "特殊情况",
      openHint: "点击查看限制条件和例句",
      modalQuick: "快速判断",
      modalCompareWith: "适合一起比较的语法",
      compareHint: "选择2个以上即可打开比较表。",
      compareSummaryTitle: "这个组合可以这样快速比较",
      compareCommon: "共同点",
      compareDiff: "差异",
      compareFocus: "记忆重点",
      compareModeAria: "打开语法比较模式",
      compareCardsTab: "判断卡片",
      compareTableTab: "比较表",
      decisionQuestion: "先问这个问题",
      decisionChoose: "这种时候选择",
      decisionCaution: "注意",
      decisionSample: "代表例句"
    },
    ar: {
      guideEyebrow: "Reason Map",
      guideTitle: "تعلّم قواعد السبب بالمقارنة",
      guideDesc:
        "بدلا من حفظ صيغ كثيرة دفعة واحدة، ابدأ بتمييز الصيغ المتشابهة أولا.",
      stepsTitle: "مسار التعلم المقترح",
      steps: [
        "ابدأ بأربع صيغ سبب شائعة لتكوين الخريطة الأساسية.",
        "افتح كل بطاقة وتحقق من القيود والأمثلة.",
        "استخدم جدول المقارنة مباشرة عند وجود صيغ مربكة."
      ],
      presetsTitle: "مجموعات مقارنة مقترحة",
      jumpTitle: "انتقال سريع",
      jumpCommon: "4 أسباب شائعة",
      jumpSpecial: "8 حالات خاصة",
      groupCommon: "شائع",
      groupSpecial: "حالات خاصة",
      openHint: "افتح القيود والأمثلة",
      modalQuick: "تمييز سريع",
      modalCompareWith: "صيغ جيدة للمقارنة معها",
      compareHint: "اختر صيغتين على الأقل لفتح جدول المقارنة.",
      compareSummaryTitle: "طريقة أسرع لمقارنة هذه المجموعة",
      compareCommon: "المشترك",
      compareDiff: "الاختلاف",
      compareFocus: "تذكّر",
      compareModeAria: "افتح وضع مقارنة القواعد",
      compareCardsTab: "بطاقات القرار",
      compareTableTab: "الجدول",
      decisionQuestion: "اسأل أولا",
      decisionChoose: "اخترها عندما",
      decisionCaution: "انتبه",
      decisionSample: "مثال"
    },
    mn: {
      guideEyebrow: "Reason Map",
      guideTitle: "Шалтгааны дүрмийг харьцуулж сур",
      guideDesc:
        "Олон хэлбэрийг зэрэг цээжлэхийн оронд төстэй хэлбэрүүдийг эхлээд ялгавал хурдан цэгцэрнэ.",
      stepsTitle: "Санал болгох дараалал",
      steps: [
        "Эхлээд 4 түгээмэл шалтгааны хэлбэрээр үндсэн зураглалыг гарга.",
        "Карт бүрийг нээж, хэрэглэх нөхцөл ба жишээг шалга.",
        "Андуурагдах хосуудыг шууд харьцуулалтын хүснэгтээр хар."
      ],
      presetsTitle: "Санал болгох харьцуулалт",
      jumpTitle: "Хурдан очих",
      jumpCommon: "4 түгээмэл шалтгаан",
      jumpSpecial: "8 тусгай тохиолдол",
      groupCommon: "Түгээмэл",
      groupSpecial: "Тусгай нөхцөл",
      openHint: "Нээж нөхцөл ба жишээг харах",
      modalQuick: "Хурдан ялгах",
      modalCompareWith: "Хамт харьцуулахад сайн дүрэм",
      compareHint: "2-оос дээш дүрэм сонговол харьцуулалтын хүснэгт нээгдэнэ.",
      compareSummaryTitle: "Энэ багцыг ингэж харвал хурдан",
      compareCommon: "Ижил тал",
      compareDiff: "Ялгаа",
      compareFocus: "Санах зүйл",
      compareModeAria: "Дүрэм харьцуулах горим нээх",
      compareCardsTab: "Шийдэх карт",
      compareTableTab: "Хүснэгт",
      decisionQuestion: "Эхлээд асуу",
      decisionChoose: "Ийм үед сонго",
      decisionCaution: "Анхаарах",
      decisionSample: "Жишээ"
    },
    kk: {
      guideEyebrow: "Reason Map",
      guideTitle: "Себеп грамматикасын салыстырып үйрену",
      guideDesc:
        "Көп форманы бірден жаттағаннан гөрі, ұқсас үлгілерді алдымен ажырату жеңілірек.",
      stepsTitle: "Ұсынылатын оқу реті",
      steps: [
        "Алдымен 4 жиі қолданылатын себеп үлгісінен негізгі картаны жасаңыз.",
        "Әр картаны ашып, шектеулер мен мысалдарды тексеріңіз.",
        "Шатасатын жұптарды бірден салыстыру кестесінен қараңыз."
      ],
      presetsTitle: "Ұсынылатын салыстырулар",
      jumpTitle: "Жылдам өту",
      jumpCommon: "4 ортақ себеп",
      jumpSpecial: "8 арнайы жағдай",
      groupCommon: "Ортақ",
      groupSpecial: "Арнайы жағдай",
      openHint: "Шектеулер мен мысалдарды ашу",
      modalQuick: "Жылдам ажырату",
      modalCompareWith: "Бірге салыстыруға жақсы үлгілер",
      compareHint: "Кестені ашу үшін кемінде 2 үлгіні таңдаңыз.",
      compareSummaryTitle: "Бұл топты тез салыстыру жолы",
      compareCommon: "Ортақ белгі",
      compareDiff: "Айырмашылық",
      compareFocus: "Есте сақта",
      compareModeAria: "Грамматиканы салыстыру режимін ашу",
      compareCardsTab: "Шешім карталары",
      compareTableTab: "Кесте",
      decisionQuestion: "Алдымен сұра",
      decisionChoose: "Мына кезде таңда",
      decisionCaution: "Абай бол",
      decisionSample: "Мысал"
    },
    th: {
      guideEyebrow: "Reason Map",
      guideTitle: "เรียนไวยากรณ์เหตุผลด้วยการเปรียบเทียบ",
      guideDesc:
        "แทนที่จะท่องหลายรูปพร้อมกัน ให้เริ่มจากแยกรูปที่คล้ายกันก่อน",
      stepsTitle: "ลำดับที่แนะนำ",
      steps: [
        "เริ่มจากรูปเหตุผลทั่วไป 4 รูปเพื่อสร้างภาพรวม",
        "เปิดการ์ดแต่ละใบเพื่อตรวจข้อจำกัดและตัวอย่าง",
        "รูปที่สับสนให้เปิดตารางเปรียบเทียบทันที"
      ],
      presetsTitle: "ชุดเปรียบเทียบแนะนำ",
      jumpTitle: "ไปอย่างรวดเร็ว",
      jumpCommon: "เหตุผลทั่วไป 4 รูป",
      jumpSpecial: "กรณีพิเศษ 8 รูป",
      groupCommon: "ทั่วไป",
      groupSpecial: "สถานการณ์พิเศษ",
      openHint: "เปิดดูข้อจำกัดและตัวอย่าง",
      modalQuick: "แยกอย่างรวดเร็ว",
      modalCompareWith: "รูปที่ควรเปรียบเทียบด้วย",
      compareHint: "เลือกอย่างน้อย 2 รูปเพื่อเปิดตารางเปรียบเทียบ",
      compareSummaryTitle: "ดูชุดนี้แบบนี้จะเร็วขึ้น",
      compareCommon: "จุดร่วม",
      compareDiff: "ความต่าง",
      compareFocus: "จำไว้",
      compareModeAria: "เปิดโหมดเปรียบเทียบไวยากรณ์",
      compareCardsTab: "การ์ดตัดสินใจ",
      compareTableTab: "ตาราง",
      decisionQuestion: "ถามก่อน",
      decisionChoose: "เลือกเมื่อ",
      decisionCaution: "ระวัง",
      decisionSample: "ตัวอย่าง"
    }
  });

  const TAG_LABELS = {
    ko: {
      basic: "기본",
      answer: "답변형",
      subjective: "주관",
      command: "명령 가능",
      objective: "객관",
      explain: "설명형",
      formal: "격식",
      written: "문어",
      negative: "부정 결과",
      focus: "한 행동 집중",
      sudden: "돌발",
      chaos: "소란",
      blame: "탓함",
      direct: "직접 경험",
      result: "결과 발견",
      repeated: "반복",
      spoken: "회화",
      multi: "여러 이유",
      positive: "긍정 결과",
      thanks: "감사"
    },
    en: {
      basic: "basic",
      answer: "answer",
      subjective: "subjective",
      command: "command OK",
      objective: "objective",
      explain: "explanatory",
      formal: "formal",
      written: "written",
      negative: "negative result",
      focus: "one action",
      sudden: "sudden",
      chaos: "chaotic",
      blame: "blame",
      direct: "direct exp.",
      result: "result",
      repeated: "repeated",
      spoken: "spoken",
      multi: "multi-reason",
      positive: "positive result",
      thanks: "gratitude"
    },
    vi: {
      basic: "cơ bản",
      answer: "trả lời",
      subjective: "chủ quan",
      command: "dùng mệnh lệnh",
      objective: "khách quan",
      explain: "giải thích",
      formal: "trang trọng",
      written: "văn viết",
      negative: "kết quả xấu",
      focus: "một hành động",
      sudden: "đột ngột",
      chaos: "ồn ào",
      blame: "đổ lỗi",
      direct: "trải nghiệm trực tiếp",
      result: "kết quả",
      repeated: "lặp lại",
      spoken: "hội thoại",
      multi: "nhiều lý do",
      positive: "kết quả tốt",
      thanks: "biết ơn"
    }
  };

  Object.assign(TAG_LABELS, {
    ja: {
      basic: "基本",
      answer: "回答",
      subjective: "主観",
      command: "命令可",
      objective: "客観",
      explain: "説明",
      formal: "格式",
      written: "書き言葉",
      negative: "否定結果",
      focus: "一つの行動",
      sudden: "突発",
      chaos: "混乱",
      blame: "責任",
      direct: "直接経験",
      result: "結果発見",
      repeated: "反復",
      spoken: "会話",
      multi: "複数理由",
      positive: "肯定結果",
      thanks: "感謝"
    },
    zh: {
      basic: "基本",
      answer: "回答",
      subjective: "主观",
      command: "可接命令",
      objective: "客观",
      explain: "说明",
      formal: "正式",
      written: "书面语",
      negative: "负面结果",
      focus: "专注一事",
      sudden: "突发",
      chaos: "混乱",
      blame: "归咎",
      direct: "直接经验",
      result: "结果发现",
      repeated: "反复",
      spoken: "口语",
      multi: "多个理由",
      positive: "积极结果",
      thanks: "感谢"
    },
    ar: {
      basic: "أساسي",
      answer: "جواب",
      subjective: "ذاتي",
      command: "يقبل الأمر",
      objective: "موضوعي",
      explain: "تفسير",
      formal: "رسمي",
      written: "كتابي",
      negative: "نتيجة سلبية",
      focus: "تركيز على فعل",
      sudden: "مفاجئ",
      chaos: "فوضى",
      blame: "لوم",
      direct: "تجربة مباشرة",
      result: "نتيجة",
      repeated: "تكرار",
      spoken: "حديث",
      multi: "عدة أسباب",
      positive: "نتيجة جيدة",
      thanks: "امتنان"
    },
    mn: {
      basic: "үндсэн",
      answer: "хариулт",
      subjective: "субъектив",
      command: "захирах боломжтой",
      objective: "объектив",
      explain: "тайлбар",
      formal: "албан",
      written: "бичгийн",
      negative: "сөрөг үр дүн",
      focus: "нэг үйлдэл",
      sudden: "гэнэтийн",
      chaos: "эмх замбараагүй",
      blame: "буруутгах",
      direct: "шууд туршлага",
      result: "үр дүн",
      repeated: "давталт",
      spoken: "ярианы",
      multi: "олон шалтгаан",
      positive: "эерэг үр дүн",
      thanks: "талархал"
    },
    kk: {
      basic: "негізгі",
      answer: "жауап",
      subjective: "субъектив",
      command: "бұйрыққа болады",
      objective: "объектив",
      explain: "түсіндіру",
      formal: "ресми",
      written: "жазба",
      negative: "жағымсыз нәтиже",
      focus: "бір әрекет",
      sudden: "кенет",
      chaos: "абыр-сабыр",
      blame: "кінәлау",
      direct: "тікелей тәжірибе",
      result: "нәтиже",
      repeated: "қайталану",
      spoken: "ауызекі",
      multi: "бірнеше себеп",
      positive: "жақсы нәтиже",
      thanks: "алғыс"
    },
    th: {
      basic: "พื้นฐาน",
      answer: "คำตอบ",
      subjective: "ความเห็น",
      command: "ใช้คำสั่งได้",
      objective: "ข้อเท็จจริง",
      explain: "อธิบาย",
      formal: "ทางการ",
      written: "ภาษาเขียน",
      negative: "ผลลบ",
      focus: "ทำสิ่งเดียว",
      sudden: "กะทันหัน",
      chaos: "วุ่นวาย",
      blame: "โทษ",
      direct: "ประสบการณ์ตรง",
      result: "ผลลัพธ์",
      repeated: "ทำซ้ำ",
      spoken: "ภาษาพูด",
      multi: "หลายเหตุผล",
      positive: "ผลดี",
      thanks: "ขอบคุณ"
    }
  });

  const PRESETS = [
    {
      id: "basic-vs-judgment",
      grammars: ["-아/어서", "-(으)니까"],
      labels: {
        ko: "기본 이유 vs 판단 이유",
        en: "basic reason vs judgment",
        vi: "lý do cơ bản vs phán đoán"
      }
    },
    {
      id: "objective-vs-formal",
      grammars: ["-기 때문에", "-(으)므로"],
      labels: {
        ko: "객관 설명 vs 격식 문어",
        en: "objective vs formal",
        vi: "khách quan vs trang trọng"
      }
    },
    {
      id: "action-vs-accident",
      grammars: ["-느라고", "-는 바람에"],
      labels: {
        ko: "집중하다 생긴 문제 vs 돌발 사건",
        en: "focus problem vs sudden event",
        vi: "mải làm vs sự cố bất ngờ"
      }
    },
    {
      id: "experience-vs-repetition",
      grammars: ["-았더니/었더니", "-다 보니"],
      labels: {
        ko: "직접 해 본 결과 vs 계속하다 생긴 변화",
        en: "direct result vs repeated change",
        vi: "kết quả trực tiếp vs thay đổi lặp lại"
      }
    },
    {
      id: "blame-vs-thanks",
      grammars: ["-는 탓에", "-는 덕분에"],
      labels: {
        ko: "탓함 vs 덕분",
        en: "blame vs thanks",
        vi: "do lỗi vs nhờ"
      }
    }
  ];

  const PRESET_LABEL_EXTENSIONS = [
    {
      ja: "基本理由 vs 判断理由",
      zh: "基本原因 vs 判断原因",
      ar: "سبب أساسي مقابل سبب حكم",
      mn: "үндсэн шалтгаан vs дүгнэлт",
      kk: "негізгі себеп vs пайымдау",
      th: "เหตุผลพื้นฐาน vs การตัดสินใจ"
    },
    {
      ja: "客観説明 vs 格式ある書き言葉",
      zh: "客观说明 vs 正式书面语",
      ar: "تفسير موضوعي مقابل رسمي",
      mn: "объектив тайлбар vs албан бичгийн",
      kk: "объектив түсіндіру vs ресми жазба",
      th: "คำอธิบายจริง vs ภาษาเขียนทางการ"
    },
    {
      ja: "集中して起きた問題 vs 突発事件",
      zh: "专注导致的问题 vs 突发事件",
      ar: "مشكلة بسبب الانشغال مقابل حدث مفاجئ",
      mn: "анхаарал төвлөрснөөс үүссэн асуудал vs гэнэтийн үйл явдал",
      kk: "беріліп істеуден туған мәселе vs кенет оқиға",
      th: "มัวแต่ทำ vs เหตุการณ์กะทันหัน"
    },
    {
      ja: "直接試した結果 vs 続けて起きた変化",
      zh: "亲自尝试的结果 vs 持续后的变化",
      ar: "نتيجة تجربة مباشرة مقابل تغير متراكم",
      mn: "шууд хийж үзсэн үр дүн vs үргэлжилсэн өөрчлөлт",
      kk: "тікелей тәжірибе нәтижесі vs қайталанған өзгеріс",
      th: "ผลจากการลองเอง vs การเปลี่ยนจากการทำซ้ำ"
    },
    {
      ja: "責任にする vs おかげ",
      zh: "归咎 vs 多亏",
      ar: "لوم مقابل بفضل",
      mn: "буруутгах vs ачаар",
      kk: "кінәлау vs арқасында",
      th: "โทษ vs เพราะความช่วยเหลือ"
    }
  ];

  PRESETS.forEach((preset, index) => {
    Object.assign(preset.labels, PRESET_LABEL_EXTENSIONS[index] || {});
  });

  const GRAMMAR_META = {
    "-아/어서": { group: "common", tags: ["basic", "answer"] },
    "-(으)니까": { group: "common", tags: ["subjective", "command"] },
    "-기 때문에": { group: "common", tags: ["objective", "explain"] },
    "-(으)므로": { group: "common", tags: ["formal", "written"] },
    "-느라고": { group: "special", tags: ["negative", "focus"] },
    "-는 바람에": { group: "special", tags: ["negative", "sudden"] },
    "-는 통에": { group: "special", tags: ["negative", "chaos"] },
    "-는 탓에": { group: "special", tags: ["negative", "blame"] },
    "-았더니/었더니": { group: "special", tags: ["direct", "result"] },
    "-다 보니": { group: "special", tags: ["repeated", "result"] },
    "-고 해서": { group: "special", tags: ["spoken", "multi"] },
    "-는 덕분에": { group: "special", tags: ["positive", "thanks"] }
  };

  const MODAL_COMPARE_WITH = {
    "-아/어서": ["-(으)니까", "-기 때문에"],
    "-(으)니까": ["-아/어서", "-기 때문에"],
    "-기 때문에": ["-(으)니까", "-(으)므로"],
    "-(으)므로": ["-기 때문에"],
    "-느라고": ["-는 바람에", "-는 탓에"],
    "-는 바람에": ["-느라고", "-는 통에"],
    "-는 통에": ["-는 바람에", "-는 탓에"],
    "-는 탓에": ["-는 통에", "-는 덕분에"],
    "-았더니/었더니": ["-다 보니", "-아/어서"],
    "-다 보니": ["-았더니/었더니"],
    "-고 해서": ["-아/어서", "-(으)니까"],
    "-는 덕분에": ["-는 탓에"]
  };

  const PAIR_NOTES = {
    "-(으)니까||-아/어서": {
      ko: {
        common: "둘 다 가장 자주 쓰는 기본 이유 문법입니다.",
        diff: "`-아/어서`는 중립적인 설명, `-(으)니까`는 말하는 사람의 판단이나 권유가 더 잘 붙습니다.",
        focus: "상대에게 조언하거나 내 판단을 붙이면 `-(으)니까` 쪽을 먼저 떠올리세요."
      },
      en: {
        common: "Both are core reason patterns used very often.",
        diff: "`-아/어서` is more neutral, while `-(으)니까` fits speaker judgment or suggestions better.",
        focus: "If advice or the speaker's judgment is included, think of `-(으)니까` first."
      },
      vi: {
        common: "Cả hai đều là mẫu lý do cơ bản dùng rất nhiều.",
        diff: "`-아/어서` trung tính hơn, còn `-(으)니까` hợp với phán đoán hoặc lời khuyên của người nói.",
        focus: "Nếu có lời khuyên hoặc ý kiến của người nói, hãy nghĩ đến `-(으)니까` trước."
      }
    },
    "-(으)므로||-기 때문에": {
      ko: {
        common: "둘 다 객관적인 이유를 논리적으로 설명할 때 어울립니다.",
        diff: "`-기 때문에`는 설명문 전반에 쓰이고, `-(으)므로`는 훨씬 더 격식 있는 글말 느낌이 강합니다.",
        focus: "발표문, 공지문, 문어체 문장처럼 딱딱할수록 `-(으)므로` 쪽이 자연스럽습니다."
      },
      en: {
        common: "Both work well for objective, logical explanations.",
        diff: "`-기 때문에` is broader, while `-(으)므로` feels much more formal and written.",
        focus: "The more official and written the sentence is, the more natural `-(으)므로` becomes."
      },
      vi: {
        common: "Cả hai đều hợp khi giải thích nguyên nhân một cách khách quan và logic.",
        diff: "`-기 때문에` dùng rộng hơn, còn `-(으)므로` mang sắc thái văn viết trang trọng hơn nhiều.",
        focus: "Câu càng mang tính thông báo, phát biểu, văn bản thì `-(으)므로` càng tự nhiên."
      }
    },
    "-는 바람에||-느라고": {
      ko: {
        common: "둘 다 보통 부정적인 결과로 이어지는 이유를 말합니다.",
        diff: "`-느라고`는 내가 한 행동에 몰두해서 생긴 문제이고, `-는 바람에`는 갑작스럽거나 예상 밖 사건이 원인일 때 잘 맞습니다.",
        focus: "원인이 내 행동 집중인지, 외부 돌발 상황인지부터 먼저 나누면 헷갈림이 크게 줄어듭니다."
      },
      en: {
        common: "Both usually lead to negative results.",
        diff: "`-느라고` is about being absorbed in your own action, while `-는 바람에` fits sudden or unexpected events.",
        focus: "First ask whether the cause is my focused action or an outside sudden event."
      },
      vi: {
        common: "Cả hai thường dẫn đến kết quả tiêu cực.",
        diff: "`-느라고` là do mải làm một việc, còn `-는 바람에` hợp với nguyên nhân bất ngờ từ bên ngoài.",
        focus: "Trước hết hãy tách xem nguyên nhân là do mình mải làm hay do sự cố bất ngờ."
      }
    },
    "-다 보니||-았더니/었더니": {
      ko: {
        common: "둘 다 행동 뒤에 알게 된 결과나 변화를 말합니다.",
        diff: "`-았더니/었더니`는 직접 해 본 뒤의 발견, `-다 보니`는 계속 반복하다가 누적되어 생긴 결과에 더 가깝습니다.",
        focus: "한 번 해 보고 알게 된 일인지, 계속 하다 보니 변한 일인지 구분해 보세요."
      },
      en: {
        common: "Both describe results or discoveries after an action.",
        diff: "`-았더니/었더니` is for a direct result after doing something, while `-다 보니` fits accumulated change through repetition.",
        focus: "Check whether it was a one-time experience or a repeated process."
      },
      vi: {
        common: "Cả hai đều diễn tả kết quả hay điều nhận ra sau hành động.",
        diff: "`-았더니/었더니` gần với kết quả sau khi trực tiếp làm thử, còn `-다 보니` hợp với thay đổi tích lũy do lặp lại.",
        focus: "Hãy phân biệt giữa trải nghiệm một lần và quá trình lặp lại."
      }
    },
    "-는 덕분에||-는 탓에": {
      ko: {
        common: "둘 다 어떤 결과의 원인을 말합니다.",
        diff: "`-는 탓에`는 불만이나 비판이 느껴지고, `-는 덕분에`는 좋은 결과와 감사의 느낌이 있습니다.",
        focus: "결과가 나쁜지 좋은지 먼저 보면 둘은 거의 바로 갈립니다."
      },
      en: {
        common: "Both explain the cause of a result.",
        diff: "`-는 탓에` carries blame or complaint, while `-는 덕분에` carries gratitude and a positive result.",
        focus: "Start by checking whether the result is bad or good."
      },
      vi: {
        common: "Cả hai đều nói về nguyên nhân của một kết quả.",
        diff: "`-는 탓에` có sắc thái trách móc, còn `-는 덕분에` có sắc thái biết ơn và kết quả tốt.",
        focus: "Hãy nhìn kết quả là xấu hay tốt trước tiên."
      }
    }
  };

  Object.assign(PAIR_NOTES["-(으)니까||-아/어서"], {
    ja: {
      common: "どちらもよく使う基本的な理由文法です。",
      diff: "`-아/어서`は中立的な説明、`-(으)니까`は話し手の判断や助言に合います。",
      focus: "相手への助言や自分の判断が続くなら`-(으)니까`を先に考えましょう。"
    },
    zh: {
      common: "两者都是最常用的基本原因语法。",
      diff: "`-아/어서`更中立，`-(으)니까`更适合说话人的判断或建议。",
      focus: "如果后面有建议或说话人的判断，先想到`-(으)니까`。"
    },
    ar: {
      common: "كلاهما من صيغ السبب الأساسية كثيرة الاستعمال.",
      diff: "`-아/어서` أكثر حيادا، أما `-(으)니까` فيناسب حكم المتكلم أو النصيحة.",
      focus: "إذا كان في الجملة نصيحة أو حكم من المتكلم، فكر أولا في `-(으)니까`."
    },
    mn: {
      common: "Хоёулаа хамгийн түгээмэл үндсэн шалтгааны хэлбэр.",
      diff: "`-아/어서` илүү төвийг сахисан тайлбар, `-(으)니까` нь ярьж буй хүний дүгнэлт эсвэл зөвлөгөөнд тохирно.",
      focus: "Зөвлөгөө эсвэл өөрийн дүгнэлт орвол эхлээд `-(으)니까`-г бодоорой."
    },
    kk: {
      common: "Екеуі де жиі қолданылатын негізгі себеп үлгілері.",
      diff: "`-아/어서` бейтарап түсіндіруге жақын, ал `-(으)니까` сөйлеушінің пікірі не кеңесіне жақсы келеді.",
      focus: "Кеңес немесе сөйлеуші пайымы болса, алдымен `-(으)니까` үлгісін ойлаңыз."
    },
    th: {
      common: "ทั้งสองเป็นรูปบอกเหตุผลพื้นฐานที่ใช้บ่อย",
      diff: "`-아/어서` เป็นกลางกว่า ส่วน `-(으)니까` เหมาะกับความเห็นหรือคำแนะนำของผู้พูด",
      focus: "ถ้ามีคำแนะนำหรือการตัดสินใจของผู้พูด ให้นึกถึง `-(으)니까` ก่อน"
    }
  });

  Object.assign(PAIR_NOTES["-(으)므로||-기 때문에"], {
    ja: {
      common: "どちらも客観的な理由を論理的に説明する時に合います。",
      diff: "`-기 때문에`は幅広く、`-(으)므로`はより格式ある書き言葉です。",
      focus: "公告や報告のように硬い文ほど`-(으)므로`が自然です。"
    },
    zh: {
      common: "两者都适合客观、逻辑地说明原因。",
      diff: "`-기 때문에`适用范围更广，`-(으)므로`更正式、更像书面语。",
      focus: "越是公告、报告等正式书面场景，`-(으)므로`越自然。"
    },
    ar: {
      common: "كلاهما مناسب لتفسير سبب موضوعي ومنطقي.",
      diff: "`-기 때문에` أوسع استعمالا، أما `-(으)므로` فأكثر رسمية وكتابية.",
      focus: "كلما كان النص رسميا أو كتابيا أكثر، صار `-(으)므로` أنسب."
    },
    mn: {
      common: "Хоёулаа объектив шалтгааныг логикоор тайлбарлахад тохирно.",
      diff: "`-기 때문에` илүү өргөн хэрэглээтэй, `-(으)므로` нь илүү албан бичгийн өнгөтэй.",
      focus: "Зарлал, тайлан зэрэг бичгийн хэллэгт `-(으)므로` илүү байгалийн сонсогдоно."
    },
    kk: {
      common: "Екеуі де объектив себепті логикалық түсіндіруге жарайды.",
      diff: "`-기 때문에` кеңірек, ал `-(으)므로` әлдеқайда ресми жазба реңкті.",
      focus: "Мәтін неғұрлым ресми және жазбаша болса, `-(으)므로` соғұрлым табиғи."
    },
    th: {
      common: "ทั้งสองใช้กับการอธิบายเหตุผลที่เป็นข้อเท็จจริงและมีเหตุผล",
      diff: "`-기 때문에` ใช้กว้างกว่า ส่วน `-(으)므로` เป็นภาษาเขียนและทางการกว่า",
      focus: "ยิ่งเป็นประกาศ รายงาน หรือข้อความทางการ ยิ่งใช้ `-(으)므로` ได้เป็นธรรมชาติ"
    }
  });

  Object.assign(PAIR_NOTES["-는 바람에||-느라고"], {
    ja: {
      common: "どちらも多くの場合、否定的な結果につながる理由を表します。",
      diff: "`-느라고`は自分の行動に集中した問題、`-는 바람에`は突然の出来事が原因です。",
      focus: "原因が自分の集中か、外部の突発事件かを先に分けましょう。"
    },
    zh: {
      common: "两者通常都连接负面结果。",
      diff: "`-느라고`是因为专注于自己的行动，`-는 바람에`适合突发或意外事件。",
      focus: "先判断原因是自己忙于某事，还是外部突发事件。"
    },
    ar: {
      common: "كلاهما يؤدي غالبا إلى نتيجة سلبية.",
      diff: "`-느라고` بسبب الانشغال بفعل الشخص نفسه، و`-는 바람에` بسبب حدث مفاجئ أو غير متوقع.",
      focus: "ميّز أولا هل السبب فعل ركزت عليه أم حدث خارجي مفاجئ."
    },
    mn: {
      common: "Хоёулаа ихэвчлэн сөрөг үр дүнтэй холбогдоно.",
      diff: "`-느라고` нь өөрийн үйлдэлд төвлөрснөөс, `-는 바람에` нь гэнэтийн үйл явдлаас болсон үед тохирно.",
      focus: "Шалтгаан нь өөрийн анхаарал төвлөрөл үү, гаднын гэнэтийн явдал уу гэдгийг эхлээд ялга."
    },
    kk: {
      common: "Екеуі де көбіне жағымсыз нәтижеге әкелетін себепті білдіреді.",
      diff: "`-느라고` өз әрекетіне беріліп қалу, `-는 바람에` кенет не күтпеген оқиғаға сай.",
      focus: "Себеп өз әрекетіңе беріліп кету ме, әлде сыртқы кенет оқиға ма, алдымен соны ажыратыңыз."
    },
    th: {
      common: "ทั้งสองมักนำไปสู่ผลลัพธ์ด้านลบ",
      diff: "`-느라고` คือมัวแต่ทำสิ่งของตัวเอง ส่วน `-는 바람에` เหมาะกับเหตุการณ์กะทันหันหรือไม่คาดคิด",
      focus: "แยกก่อนว่าสาเหตุคือการมัวทำของเราเอง หรือเหตุการณ์ภายนอกที่เกิดขึ้นกะทันหัน"
    }
  });

  Object.assign(PAIR_NOTES["-다 보니||-았더니/었더니"], {
    ja: {
      common: "どちらも行動の後に分かった結果や変化を表します。",
      diff: "`-았더니/었더니`は直接やってみた後の発見、`-다 보니`は繰り返しによる累積変化です。",
      focus: "一度試して分かったのか、続けた結果なのかを区別しましょう。"
    },
    zh: {
      common: "两者都表示行动之后知道的结果或变化。",
      diff: "`-았더니/었더니`是亲自做了之后的发现，`-다 보니`更接近反复后的累积变化。",
      focus: "区分是一次亲自尝试后发现，还是持续做着做着发生变化。"
    },
    ar: {
      common: "كلاهما يصف نتيجة أو اكتشافا بعد فعل.",
      diff: "`-았더니/었더니` نتيجة تجربة مباشرة، أما `-다 보니` فتغير متراكم من التكرار.",
      focus: "تحقق هل هي تجربة واحدة مباشرة أم عملية متكررة."
    },
    mn: {
      common: "Хоёулаа үйлдлийн дараах үр дүн эсвэл олж мэдсэн зүйлийг хэлнэ.",
      diff: "`-았더니/었더니` нь шууд хийж үзээд мэдсэн зүйл, `-다 보니` нь давталтаас хуримтлагдсан өөрчлөлт.",
      focus: "Нэг удаа хийж мэдсэн үү, эсвэл үргэлжлүүлж байгаад өөрчлөгдсөн үү гэдгийг ялга."
    },
    kk: {
      common: "Екеуі де әрекеттен кейінгі нәтиже немесе байқауды білдіреді.",
      diff: "`-았더니/었더니` тікелей жасап көргеннен кейінгі нәтиже, `-다 보니` қайталанған әрекеттен жиналған өзгеріс.",
      focus: "Бір рет жасап байқау ма, әлде қайталана келе өзгеру ме, соны ажыратыңыз."
    },
    th: {
      common: "ทั้งสองบอกผลลัพธ์หรือสิ่งที่รู้หลังการกระทำ",
      diff: "`-았더니/었더니` คือผลหลังจากลองทำเอง ส่วน `-다 보니` คือการเปลี่ยนที่สะสมจากการทำซ้ำ",
      focus: "ดูว่าเป็นประสบการณ์ครั้งเดียว หรือเป็นกระบวนการที่ทำต่อเนื่อง"
    }
  });

  Object.assign(PAIR_NOTES["-는 덕분에||-는 탓에"], {
    ja: {
      common: "どちらも結果の原因を表します。",
      diff: "`-는 탓에`は不満や批判、`-는 덕분에`は良い結果と感謝を表します。",
      focus: "結果が悪いか良いかを先に見ればすぐ分かれます。"
    },
    zh: {
      common: "两者都说明某个结果的原因。",
      diff: "`-는 탓에`带有抱怨或责备，`-는 덕분에`表示好结果和感谢。",
      focus: "先看结果是不好还是好，就能很快区分。"
    },
    ar: {
      common: "كلاهما يشرح سبب نتيجة ما.",
      diff: "`-는 탓에` يحمل لوم أو شكوى، أما `-는 덕분에` فيحمل امتنانا ونتيجة جيدة.",
      focus: "ابدأ من طبيعة النتيجة: سيئة أم جيدة."
    },
    mn: {
      common: "Хоёулаа ямар нэг үр дүнгийн шалтгааныг хэлнэ.",
      diff: "`-는 탓에` нь гомдол, буруутгалтай, `-는 덕분에` нь сайн үр дүн ба талархлын өнгөтэй.",
      focus: "Үр дүн нь муу юу сайн уу гэдгийг эхлээд харвал амархан ялгагдана."
    },
    kk: {
      common: "Екеуі де нәтиженің себебін түсіндіреді.",
      diff: "`-는 탓에` кінәлау не реніш реңкін береді, `-는 덕분에` жақсы нәтиже мен алғысты білдіреді.",
      focus: "Алдымен нәтиже жаман ба, жақсы ма, соны қараңыз."
    },
    th: {
      common: "ทั้งสองใช้บอกสาเหตุของผลลัพธ์",
      diff: "`-는 탓에` มีนัยตำหนิหรือบ่น ส่วน `-는 덕분에` มีผลดีและความขอบคุณ",
      focus: "เริ่มจากดูว่าผลลัพธ์เป็นลบหรือบวก"
    }
  });

  const GENERIC_PAIR_NOTES = {
    ko: {
      allCommon: {
        common: "선택한 문법들은 모두 기본 이유를 설명할 때 자주 쓰입니다.",
        diff: "주관성, 격식, 명령문 가능 여부를 먼저 보면 차이가 빨리 보입니다.",
        focus: "중립적 설명인지, 화자의 판단이 들어가는지부터 체크해 보세요."
      },
      allSpecial: {
        common: "선택한 문법들은 모두 특정 장면에서 쓰는 특수 이유 문법입니다.",
        diff: "원인의 종류(돌발, 반복, 직접 경험, 환경)와 결과의 성격(긍정/부정)을 먼저 보세요.",
        focus: "카드에 붙은 태그를 먼저 읽으면 비교표가 훨씬 빨리 정리됩니다."
      },
      mixed: {
        common: "둘 다 이유를 말하지만 쓰임의 폭과 장면이 다릅니다.",
        diff: "하나는 범용 이유일 수 있고, 다른 하나는 특정 상황 전용일 수 있습니다.",
        focus: "먼저 일반적인 설명인지, 특별한 상황 묘사인지부터 구분해 보세요."
      }
    },
    en: {
      allCommon: {
        common: "The selected patterns are all common reason grammar.",
        diff: "Look first at subjectivity, formality, and whether commands fit.",
        focus: "Start by separating neutral explanation from speaker judgment."
      },
      allSpecial: {
        common: "The selected patterns are all specialized reason grammar.",
        diff: "First check the kind of cause and the tone of the result.",
        focus: "Reading the tag chips first makes the table much easier to scan."
      },
      mixed: {
        common: "Both express reasons, but their range of use is different.",
        diff: "One may be a broad reason pattern while another fits a special situation only.",
        focus: "Start by asking whether this is a general explanation or a special scene."
      }
    },
    vi: {
      allCommon: {
        common: "Các mẫu được chọn đều là mẫu lý do cơ bản.",
        diff: "Hãy nhìn trước vào mức độ chủ quan, trang trọng, và khả năng đi với mệnh lệnh.",
        focus: "Trước hết hãy phân biệt giữa giải thích trung tính và phán đoán của người nói."
      },
      allSpecial: {
        common: "Các mẫu được chọn đều là mẫu lý do cho tình huống đặc biệt.",
        diff: "Hãy nhìn loại nguyên nhân và tính chất của kết quả trước.",
        focus: "Đọc các thẻ tag trước sẽ giúp bảng so sánh dễ hiểu hơn nhiều."
      },
      mixed: {
        common: "Cả hai đều nói lý do nhưng phạm vi dùng khác nhau.",
        diff: "Một mẫu có thể là lý do chung, mẫu kia có thể chỉ dành cho tình huống cụ thể.",
        focus: "Hãy phân biệt giữa giải thích chung và mô tả tình huống đặc biệt."
      }
    },
    ja: {
      allCommon: {
        common: "選んだ文法はすべて基本的な理由説明でよく使います。",
        diff: "主観性、格式、命令文との相性を見ると違いが早く分かります。",
        focus: "中立的な説明か、話し手の判断かを先に確認しましょう。"
      },
      allSpecial: {
        common: "選んだ文法はすべて特定場面で使う理由文法です。",
        diff: "原因の種類と結果の性格を先に見ましょう。",
        focus: "タグを先に読むと比較表が整理しやすくなります。"
      },
      mixed: {
        common: "どちらも理由を表しますが、使える範囲と場面が違います。",
        diff: "一方は一般的な理由、もう一方は特殊な状況専用かもしれません。",
        focus: "一般説明か特殊場面かを先に分けましょう。"
      }
    },
    zh: {
      allCommon: {
        common: "所选语法都常用于说明基本原因。",
        diff: "先看主观性、正式程度以及能否接命令句，差异会更清楚。",
        focus: "先区分是中立说明，还是说话人的判断。"
      },
      allSpecial: {
        common: "所选语法都用于特定场景中的原因表达。",
        diff: "先看原因类型和结果性质。",
        focus: "先读卡片标签，比较表会更容易理解。"
      },
      mixed: {
        common: "两者都表示原因，但使用范围和场景不同。",
        diff: "一个可能是通用原因，另一个可能只适合特殊情况。",
        focus: "先区分是一般说明还是特殊场景描写。"
      }
    },
    ar: {
      allCommon: {
        common: "الصيغ المختارة كلها من قواعد السبب الشائعة.",
        diff: "انظر أولا إلى الذاتية والرسمية وإمكان استعمال الأمر.",
        focus: "ابدأ بالتمييز بين التفسير الحيادي وحكم المتكلم."
      },
      allSpecial: {
        common: "الصيغ المختارة كلها قواعد سبب لحالات خاصة.",
        diff: "تحقق أولا من نوع السبب ونبرة النتيجة.",
        focus: "قراءة الوسوم أولا تجعل جدول المقارنة أوضح."
      },
      mixed: {
        common: "كلاهما يعبر عن السبب، لكن مجال الاستعمال مختلف.",
        diff: "قد تكون إحداهما صيغة عامة والأخرى خاصة بموقف معين.",
        focus: "ابدأ بالسؤال: هل هذا تفسير عام أم مشهد خاص."
      }
    },
    mn: {
      allCommon: {
        common: "Сонгосон хэлбэрүүд бүгд түгээмэл шалтгааны дүрэм.",
        diff: "Субъектив байдал, албан өнгө, захирах өгүүлбэртэй тохирох эсэхийг эхлээд хар.",
        focus: "Төвийг сахисан тайлбар уу, ярьж буй хүний дүгнэлт үү гэдгийг ялга."
      },
      allSpecial: {
        common: "Сонгосон хэлбэрүүд бүгд тусгай нөхцөлд хэрэглэх шалтгааны дүрэм.",
        diff: "Шалтгааны төрөл ба үр дүнгийн өнгө аясыг эхлээд шалга.",
        focus: "Картын шошгыг түрүүлж уншвал хүснэгт илүү ойлгомжтой болно."
      },
      mixed: {
        common: "Хоёулаа шалтгаан хэлдэг ч хэрэглээний хүрээ ба нөхцөл нь өөр.",
        diff: "Нэг нь ерөнхий шалтгаан, нөгөө нь тусгай нөхцөлд зориулсан байж болно.",
        focus: "Ерөнхий тайлбар уу, тусгай нөхцөл үү гэдгийг эхлээд ялга."
      }
    },
    kk: {
      allCommon: {
        common: "Таңдалған үлгілердің бәрі ортақ себеп грамматикасы.",
        diff: "Субъективтілік, ресмилік және бұйрықпен үйлесуін алдымен қараңыз.",
        focus: "Бейтарап түсіндіру ме, сөйлеуші пайымы ма, соны ажыратыңыз."
      },
      allSpecial: {
        common: "Таңдалған үлгілердің бәрі арнайы жағдайдағы себеп грамматикасы.",
        diff: "Себеп түрі мен нәтиже реңкін алдымен тексеріңіз.",
        focus: "Карта тегтерін алдымен оқысаңыз, кесте тез түсініледі."
      },
      mixed: {
        common: "Екеуі де себеп білдіреді, бірақ қолданылу аясы мен жағдайы бөлек.",
        diff: "Бірі жалпы себеп, бірі арнайы жағдайға ғана сай болуы мүмкін.",
        focus: "Жалпы түсіндіру ме, ерекше жағдай ма, алдымен соны бөліңіз."
      }
    },
    th: {
      allCommon: {
        common: "รูปที่เลือกทั้งหมดเป็นไวยากรณ์เหตุผลทั่วไป",
        diff: "ดูความเป็นความเห็น ความเป็นทางการ และการใช้กับคำสั่งก่อน",
        focus: "เริ่มจากแยกว่าเป็นการอธิบายกลาง ๆ หรือการตัดสินของผู้พูด"
      },
      allSpecial: {
        common: "รูปที่เลือกทั้งหมดเป็นไวยากรณ์เหตุผลสำหรับสถานการณ์เฉพาะ",
        diff: "ตรวจชนิดของสาเหตุและน้ำเสียงของผลลัพธ์ก่อน",
        focus: "อ่านแท็กบนการ์ดก่อนจะช่วยให้ดูตารางได้เร็วขึ้น"
      },
      mixed: {
        common: "ทั้งสองบอกเหตุผล แต่ขอบเขตและสถานการณ์ที่ใช้ต่างกัน",
        diff: "รูปหนึ่งอาจเป็นเหตุผลทั่วไป ส่วนอีกรูปอาจใช้เฉพาะสถานการณ์",
        focus: "เริ่มจากถามว่าเป็นการอธิบายทั่วไปหรือฉากเฉพาะ"
      }
    }
  };

  const DECISION_GUIDES = {
    ko: {
      "-아/어서": {
        question: "그냥 가장 자연스럽게 이유를 설명하면 되나요?",
        choose: "중립적으로 이유를 연결하고 싶을 때 가장 먼저 떠올리면 좋습니다."
      },
      "-(으)니까": {
        question: "내 판단, 권유, 명령이 함께 따라오나요?",
        choose: "상대에게 조언하거나 화자의 판단을 실어 말할 때 잘 맞습니다."
      },
      "-기 때문에": {
        question: "객관적으로 원인을 설명하는 문장인가요?",
        choose: "설명문, 보고, 발표처럼 논리적으로 이유를 밝힐 때 고르기 좋습니다."
      },
      "-(으)므로": {
        question: "글말이나 공식 문장처럼 격식이 높은가요?",
        choose: "공지문, 보고서, 발표문처럼 딱딱하고 문어체인 장면에 잘 맞습니다."
      },
      "-느라고": {
        question: "내가 한 행동에 몰두하다가 다른 일이 안 됐나요?",
        choose: "한 행동에 집중하느라 부정 결과가 생겼을 때 고르기 좋습니다."
      },
      "-는 바람에": {
        question: "갑작스럽고 예상 못 한 일이 원인인가요?",
        choose: "돌발 사건 때문에 안 좋은 결과가 났을 때 가장 잘 맞습니다."
      },
      "-는 통에": {
        question: "시끄럽거나 정신없는 환경 때문에 문제가 생겼나요?",
        choose: "소란, 혼잡, 외부 환경 때문에 피해를 볼 때 잘 어울립니다."
      },
      "-는 탓에": {
        question: "원인을 탓하거나 불만을 드러내고 싶나요?",
        choose: "부정 결과의 책임을 어느 쪽에 돌리는 느낌을 낼 때 적합합니다."
      },
      "-았더니/었더니": {
        question: "직접 해 본 뒤 새 결과를 알게 됐나요?",
        choose: "한 번 실제로 해 보고 변화나 발견을 말할 때 자연스럽습니다."
      },
      "-다 보니": {
        question: "계속 반복하다가 누적된 결과가 생겼나요?",
        choose: "반복하거나 오래 지속한 끝에 생긴 변화에 잘 맞습니다."
      },
      "-고 해서": {
        question: "이유가 하나가 아니라 여러 개가 섞여 있나요?",
        choose: "회화에서 여러 이유를 가볍게 묶어 말할 때 편하게 쓸 수 있습니다."
      },
      "-는 덕분에": {
        question: "좋은 결과에 고마움이 함께 느껴지나요?",
        choose: "긍정 결과의 원인에 감사나 호의를 드러낼 때 고르기 좋습니다."
      }
    },
    en: {
      "-아/어서": {
        question: "Do you just need the most natural neutral reason?",
        choose: "Use it first when you simply want to connect a cause and result."
      },
      "-(으)니까": {
        question: "Does your judgment, advice, or command follow?",
        choose: "It works well when the speaker's opinion or suggestion is included."
      },
      "-기 때문에": {
        question: "Is this an objective explanation of the cause?",
        choose: "Good for logical explanation in reports, presentations, or formal explanation."
      },
      "-(으)므로": {
        question: "Is the sentence highly formal or written?",
        choose: "Best for notices, reports, and official written language."
      },
      "-느라고": {
        question: "Did focusing on one action cause another problem?",
        choose: "Use it when being absorbed in one action led to a negative result."
      },
      "-는 바람에": {
        question: "Was the cause sudden or unexpected?",
        choose: "Best when a sudden event caused a bad result."
      },
      "-는 통에": {
        question: "Did a noisy or chaotic environment cause the problem?",
        choose: "Good for confusion, crowding, or environmental disturbance."
      },
      "-는 탓에": {
        question: "Do you want to sound blaming or dissatisfied?",
        choose: "Use it when you want to place blame on the cause of a negative result."
      },
      "-았더니/었더니": {
        question: "Did you discover the result after trying it yourself?",
        choose: "Natural for changes or discoveries after a direct experience."
      },
      "-다 보니": {
        question: "Did the result build up through repetition?",
        choose: "Use it for changes that came from doing something repeatedly or continuously."
      },
      "-고 해서": {
        question: "Are there multiple reasons mixed together?",
        choose: "Good in conversation when loosely grouping more than one reason."
      },
      "-는 덕분에": {
        question: "Does the result feel positive and thankful?",
        choose: "Best when you want to show gratitude for a good result."
      }
    },
    vi: {
      "-아/어서": {
        question: "Bạn chỉ cần nói lý do một cách tự nhiên, trung tính phải không?",
        choose: "Hãy nghĩ đến mẫu này trước khi chỉ muốn nối nguyên nhân và kết quả."
      },
      "-(으)니까": {
        question: "Có kèm theo phán đoán, lời khuyên hay mệnh lệnh không?",
        choose: "Rất hợp khi có ý kiến của người nói hoặc muốn khuyên ai đó."
      },
      "-기 때문에": {
        question: "Đây có phải câu giải thích nguyên nhân một cách khách quan không?",
        choose: "Phù hợp khi giải thích logic trong bài nói, báo cáo, thuyết minh."
      },
      "-(으)므로": {
        question: "Câu này có mang sắc thái văn viết, trang trọng không?",
        choose: "Hợp nhất với thông báo, báo cáo và văn phong trang trọng."
      },
      "-느라고": {
        question: "Có phải vì mải làm một việc nên việc khác không được không?",
        choose: "Dùng khi tập trung vào một hành động dẫn đến kết quả xấu."
      },
      "-는 바람에": {
        question: "Nguyên nhân có phải là sự việc bất ngờ không?",
        choose: "Hợp nhất khi sự cố đột ngột gây ra kết quả không tốt."
      },
      "-는 통에": {
        question: "Có phải môi trường ồn ào hay hỗn loạn gây ra vấn đề không?",
        choose: "Phù hợp khi nguyên nhân là sự náo loạn, đông đúc hay môi trường xung quanh."
      },
      "-는 탓에": {
        question: "Bạn có muốn thể hiện sắc thái trách móc không?",
        choose: "Dùng khi muốn quy trách nhiệm cho nguyên nhân của kết quả xấu."
      },
      "-았더니/었더니": {
        question: "Bạn có trực tiếp làm rồi mới phát hiện kết quả không?",
        choose: "Tự nhiên khi nói về thay đổi hay phát hiện sau trải nghiệm trực tiếp."
      },
      "-다 보니": {
        question: "Kết quả có xuất hiện sau quá trình lặp lại không?",
        choose: "Hợp khi sự thay đổi đến từ việc làm liên tục hoặc lặp đi lặp lại."
      },
      "-고 해서": {
        question: "Có phải có nhiều lý do được nói cùng nhau không?",
        choose: "Dùng tiện trong hội thoại khi gom nhiều lý do lại một cách nhẹ nhàng."
      },
      "-는 덕분에": {
        question: "Kết quả có tích cực và mang sắc thái biết ơn không?",
        choose: "Rất hợp khi muốn nói lời cảm ơn cho một kết quả tốt."
      }
    }
  };

  Object.assign(DECISION_GUIDES, {
    ja: {
      "-아/어서": {
        question: "中立的に理由を説明するだけでよいですか。",
        choose: "原因と結果を自然につなげたい時にまず選びます。"
      },
      "-(으)니까": {
        question: "自分の判断、助言、命令が続きますか。",
        choose: "話し手の意見や相手への助言が入る時に合います。"
      },
      "-기 때문에": {
        question: "原因を客観的に説明していますか。",
        choose: "報告、発表、説明文のように論理的に理由を示す時に合います。"
      },
      "-(으)므로": {
        question: "書き言葉や公式文のように格式が高いですか。",
        choose: "公告、報告書、発表文など硬い文脈で自然です。"
      },
      "-느라고": {
        question: "一つの行動に集中して他のことができませんでしたか。",
        choose: "集中した行動が否定的な結果を生んだ時に使います。"
      },
      "-는 바람에": {
        question: "原因は急で予想外の出来事ですか。",
        choose: "突発事件のせいで悪い結果が出た時に合います。"
      },
      "-는 통에": {
        question: "うるさい、または慌ただしい環境が原因ですか。",
        choose: "騒音、混雑、周囲の混乱で困った時に合います。"
      },
      "-는 탓에": {
        question: "原因を責める気持ちを出したいですか。",
        choose: "否定的な結果の責任をある原因に向ける時に使います。"
      },
      "-았더니/었더니": {
        question: "自分でやってみた後に結果を知りましたか。",
        choose: "直接経験した後の変化や発見を言う時に自然です。"
      },
      "-다 보니": {
        question: "繰り返し続けた結果が積み重なりましたか。",
        choose: "継続や反復の末に起きた変化に合います。"
      },
      "-고 해서": {
        question: "理由が一つではなく複数ありますか。",
        choose: "会話で複数の理由を軽くまとめる時に便利です。"
      },
      "-는 덕분에": {
        question: "良い結果と感謝の気持ちがありますか。",
        choose: "肯定的な結果の原因に感謝を表す時に合います。"
      }
    },
    zh: {
      "-아/어서": {
        question: "只是中立地说明原因就可以吗？",
        choose: "想自然连接原因和结果时，优先想到这个。"
      },
      "-(으)니까": {
        question: "后面有自己的判断、建议或命令吗？",
        choose: "包含说话人的意见或给对方建议时很合适。"
      },
      "-기 때문에": {
        question: "这是客观说明原因的句子吗？",
        choose: "适合报告、发表、说明文等逻辑性解释。"
      },
      "-(으)므로": {
        question: "句子像书面语或正式句子一样正式吗？",
        choose: "适合公告、报告书、正式发表等较硬的场景。"
      },
      "-느라고": {
        question: "因为专注于一个动作而没能做别的事吗？",
        choose: "一个行动导致负面结果时使用。"
      },
      "-는 바람에": {
        question: "原因是突然且没预料到的事情吗？",
        choose: "突发事件导致不好结果时最合适。"
      },
      "-는 통에": {
        question: "是嘈杂或混乱的环境造成问题吗？",
        choose: "因噪音、拥挤、周围混乱而受影响时使用。"
      },
      "-는 탓에": {
        question: "想表达责备或不满吗？",
        choose: "想把负面结果的责任归到某个原因时使用。"
      },
      "-았더니/었더니": {
        question: "亲自做了以后才知道结果吗？",
        choose: "说直接体验后的变化或发现时自然。"
      },
      "-다 보니": {
        question: "结果是持续或反复后积累出来的吗？",
        choose: "适合不断做某事后产生的变化。"
      },
      "-고 해서": {
        question: "理由不是一个，而是多个混在一起吗？",
        choose: "口语中轻松概括多个理由时很好用。"
      },
      "-는 덕분에": {
        question: "结果积极，并带有感谢的感觉吗？",
        choose: "想表达好结果的原因和感谢时使用。"
      }
    },
    ar: {
      "-아/어서": {
        question: "هل تحتاج فقط إلى سبب حيادي وطبيعي؟",
        choose: "اخترها أولا عندما تريد وصل السبب والنتيجة ببساطة."
      },
      "-(으)니까": {
        question: "هل يتبعها حكمك أو نصيحتك أو أمر؟",
        choose: "تناسب عندما يظهر رأي المتكلم أو نصيحته."
      },
      "-기 때문에": {
        question: "هل تشرح السبب بشكل موضوعي؟",
        choose: "جيدة للتفسير المنطقي في التقارير والعروض والشرح الرسمي."
      },
      "-(으)므로": {
        question: "هل الجملة رسمية أو كتابية جدا؟",
        choose: "أفضل للإعلانات والتقارير واللغة الرسمية المكتوبة."
      },
      "-느라고": {
        question: "هل سبب المشكلة أنك انشغلت بفعل واحد؟",
        choose: "استعملها عندما يؤدي الانشغال بفعل إلى نتيجة سلبية."
      },
      "-는 바람에": {
        question: "هل السبب حدث مفاجئ أو غير متوقع؟",
        choose: "أفضل عندما يسبب حدث مفاجئ نتيجة سيئة."
      },
      "-는 통에": {
        question: "هل المشكلة بسبب بيئة صاخبة أو فوضوية؟",
        choose: "تناسب الضجيج أو الازدحام أو اضطراب البيئة المحيطة."
      },
      "-는 탓에": {
        question: "هل تريد إظهار لوم أو عدم رضا؟",
        choose: "استعملها عندما تنسب نتيجة سلبية إلى سبب تلومه."
      },
      "-았더니/었더니": {
        question: "هل اكتشفت النتيجة بعد أن جربت بنفسك؟",
        choose: "طبيعية للتغير أو الاكتشاف بعد تجربة مباشرة."
      },
      "-다 보니": {
        question: "هل ظهرت النتيجة من التكرار أو الاستمرار؟",
        choose: "تناسب التغير الناتج عن فعل متكرر أو مستمر."
      },
      "-고 해서": {
        question: "هل توجد عدة أسباب معا؟",
        choose: "مريحة في الحديث عندما تجمع أكثر من سبب بخفة."
      },
      "-는 덕분에": {
        question: "هل النتيجة جيدة وفيها امتنان؟",
        choose: "أفضل لإظهار الشكر على سبب أدى إلى نتيجة جيدة."
      }
    },
    mn: {
      "-아/어서": {
        question: "Зүгээр л төвийг сахисан шалтгаан хэлэх үү?",
        choose: "Шалтгаан ба үр дүнг энгийнээр холбох үед эхлээд сонго."
      },
      "-(으)니까": {
        question: "Дараа нь таны дүгнэлт, зөвлөгөө эсвэл захирамж байна уу?",
        choose: "Ярьж буй хүний бодол эсвэл зөвлөгөө орсон үед тохирно."
      },
      "-기 때문에": {
        question: "Шалтгааныг объектив тайлбарлаж байна уу?",
        choose: "Тайлан, илтгэл, тайлбар зэрэг логик шалтгаан хэлэх үед тохирно."
      },
      "-(으)므로": {
        question: "Өгүүлбэр албан эсвэл бичгийн хэлний өнгөтэй юу?",
        choose: "Зарлал, тайлан, албан бичгийн нөхцөлд хамгийн тохиромжтой."
      },
      "-느라고": {
        question: "Нэг үйлдэлд төвлөрөөд өөр зүйл болж чадаагүй юу?",
        choose: "Нэг үйлдэлд автсанаас сөрөг үр дүн гарсан үед хэрэглэ."
      },
      "-는 바람에": {
        question: "Шалтгаан нь гэнэтийн, санаандгүй зүйл үү?",
        choose: "Гэнэтийн явдлаас муу үр дүн гарсан үед тохирно."
      },
      "-는 통에": {
        question: "Дуу чимээтэй эсвэл эмх замбараагүй орчин асуудал үүсгэсэн үү?",
        choose: "Олон хүн, шуугиан, орчны саадтай үед хэрэглэ."
      },
      "-는 탓에": {
        question: "Шалтгааныг буруутгах эсвэл гомдоллох уу?",
        choose: "Сөрөг үр дүнгийн хариуцлагыг нэг шалтгаанд өгөх үед тохирно."
      },
      "-았더니/었더니": {
        question: "Өөрөө хийж үзээд үр дүнг мэдсэн үү?",
        choose: "Шууд туршлагын дараах өөрчлөлт, нээлтэд байгалийн."
      },
      "-다 보니": {
        question: "Давтаж хийснээр үр дүн хуримтлагдсан уу?",
        choose: "Үргэлжлүүлсэн эсвэл давтсан үйлдлээс гарсан өөрчлөлтөд тохирно."
      },
      "-고 해서": {
        question: "Шалтгаан нэг биш, хэд хэдэн зүйл холилдсон уу?",
        choose: "Ярианд олон шалтгааныг хөнгөн нэгтгэхэд хэрэглэ."
      },
      "-는 덕분에": {
        question: "Үр дүн сайн бөгөөд талархлын өнгөтэй юу?",
        choose: "Сайн үр дүнгийн шалтгаанд талархал илэрхийлэхэд тохирно."
      }
    },
    kk: {
      "-아/어서": {
        question: "Жай ғана бейтарап себепті айту жеткілікті ме?",
        choose: "Себеп пен нәтижені табиғи байланыстыру үшін алдымен осыны таңдаңыз."
      },
      "-(으)니까": {
        question: "Артынша пікір, кеңес немесе бұйрық келе ме?",
        choose: "Сөйлеушінің пікірі немесе ұсынысы бар кезде жақсы үйлеседі."
      },
      "-기 때문에": {
        question: "Бұл себепті объективті түсіндіретін сөйлем бе?",
        choose: "Баяндама, есеп, түсіндірме сияқты логикалық себеп айтуға қолайлы."
      },
      "-(으)므로": {
        question: "Сөйлем ресми немесе жазба тілге жақын ба?",
        choose: "Хабарлама, есеп, ресми мәтіндерде ең табиғи."
      },
      "-느라고": {
        question: "Бір әрекетке беріліп, басқа іс орындалмады ма?",
        choose: "Бір әрекетке шоғырлану жағымсыз нәтиже әкелсе қолданыңыз."
      },
      "-는 바람에": {
        question: "Себеп кенет және күтпеген оқиға ма?",
        choose: "Кенет оқиға жаман нәтиже тудырғанда жақсы келеді."
      },
      "-는 통에": {
        question: "Шулы немесе ретсіз орта мәселе тудырды ма?",
        choose: "Шу, көпшілік немесе сыртқы кедергі әсер еткенде қолайлы."
      },
      "-는 탓에": {
        question: "Кінәлау немесе реніш білдіргіңіз келе ме?",
        choose: "Жағымсыз нәтиженің жауапкершілігін бір себепке артқанда қолданыңыз."
      },
      "-았더니/었더니": {
        question: "Өзіңіз жасап көргеннен кейін нәтижені білдіңіз бе?",
        choose: "Тікелей тәжірибеден кейінгі өзгеріс немесе байқауға табиғи."
      },
      "-다 보니": {
        question: "Нәтиже қайталау немесе жалғастыру арқылы жиналды ма?",
        choose: "Үздіксіз не қайталанған әрекеттен туған өзгеріске сәйкес."
      },
      "-고 해서": {
        question: "Бірнеше себеп араласып тұр ма?",
        choose: "Ауызекі тілде бірнеше себепті жеңіл біріктіруге ыңғайлы."
      },
      "-는 덕분에": {
        question: "Нәтиже жақсы және алғыс реңкі бар ма?",
        choose: "Жақсы нәтижеге себеп болған нәрсеге алғыс білдіргенде қолайлы."
      }
    },
    th: {
      "-아/어서": {
        question: "แค่ต้องการบอกเหตุผลแบบเป็นกลางใช่ไหม",
        choose: "ใช้เมื่อต้องการเชื่อมสาเหตุและผลลัพธ์อย่างธรรมชาติ"
      },
      "-(으)니까": {
        question: "มีความเห็น คำแนะนำ หรือคำสั่งตามมาหรือไม่",
        choose: "เหมาะเมื่อมีความคิดเห็นหรือคำแนะนำของผู้พูด"
      },
      "-기 때문에": {
        question: "เป็นการอธิบายสาเหตุแบบข้อเท็จจริงหรือไม่",
        choose: "เหมาะกับรายงาน การนำเสนอ หรือคำอธิบายที่เป็นเหตุเป็นผล"
      },
      "-(으)므로": {
        question: "ประโยคเป็นทางการหรือเป็นภาษาเขียนมากไหม",
        choose: "เหมาะกับประกาศ รายงาน และข้อความทางการ"
      },
      "-느라고": {
        question: "มัวแต่ทำสิ่งหนึ่งจนเกิดปัญหาหรือไม่",
        choose: "ใช้เมื่อการจดจ่อกับการกระทำหนึ่งนำไปสู่ผลลบ"
      },
      "-는 바람에": {
        question: "สาเหตุเป็นเหตุการณ์กะทันหันหรือไม่คาดคิดหรือไม่",
        choose: "เหมาะเมื่อเหตุการณ์ฉับพลันทำให้เกิดผลไม่ดี"
      },
      "-는 통에": {
        question: "สภาพแวดล้อมที่เสียงดังหรือวุ่นวายเป็นปัญหาหรือไม่",
        choose: "ใช้กับเสียงดัง ความแออัด หรือความวุ่นวายรอบตัว"
      },
      "-는 탓에": {
        question: "ต้องการสื่อการตำหนิหรือความไม่พอใจไหม",
        choose: "ใช้เมื่อโยนความรับผิดชอบของผลลบไปยังสาเหตุหนึ่ง"
      },
      "-았더니/었더니": {
        question: "รู้ผลหลังจากลองทำเองหรือไม่",
        choose: "เหมาะกับการเปลี่ยนแปลงหรือสิ่งที่พบหลังประสบการณ์ตรง"
      },
      "-다 보니": {
        question: "ผลลัพธ์เกิดจากการทำซ้ำหรือทำต่อเนื่องหรือไม่",
        choose: "ใช้กับการเปลี่ยนแปลงที่เกิดจากการทำต่อเนื่อง"
      },
      "-고 해서": {
        question: "มีหลายเหตุผลรวมกันหรือไม่",
        choose: "ใช้สะดวกในบทสนทนาเมื่อต้องการรวมหลายเหตุผลเบา ๆ"
      },
      "-는 덕분에": {
        question: "ผลลัพธ์ดีและมีความรู้สึกขอบคุณหรือไม่",
        choose: "เหมาะเมื่อต้องการแสดงความขอบคุณต่อสาเหตุของผลดี"
      }
    }
  });

  function getLang() {
    return (
      document.querySelector(".lang-btn.active-lang")?.dataset.lang ||
      document.documentElement.lang ||
      "ko"
    );
  }

  function getText(lang) {
    return TEXTS[lang] || TEXTS.en;
  }

  function getTagLabel(lang, code) {
    const labels = TAG_LABELS[lang] || TAG_LABELS.en;
    return labels[code] || code;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function ensureStyle() {
    if (document.getElementById("reason-enhancer-style")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "reason-enhancer-style";
    style.textContent = `
      .reason-guide {
        margin-bottom: 24px;
        padding: 24px;
        border-radius: 28px;
        background:
          radial-gradient(circle at top right, rgba(59, 130, 246, 0.10), transparent 28%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(239, 246, 255, 0.95) 52%, rgba(248, 250, 252, 0.98) 100%);
        border: 1px solid rgba(191, 219, 254, 0.95);
        box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
      }
      .reason-guide__eyebrow {
        margin: 0 0 8px;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #2563eb;
      }
      .reason-guide__title {
        margin: 0;
        font-size: clamp(1.4rem, 2vw, 2rem);
        line-height: 1.15;
        color: #0f172a;
      }
      .reason-guide__desc {
        margin: 12px 0 0;
        max-width: 700px;
        color: #475569;
        line-height: 1.7;
      }
      .reason-guide__layout {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.9fr);
        gap: 18px;
        margin-top: 20px;
      }
      .reason-guide__panel {
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(191, 219, 254, 0.86);
        background: rgba(255, 255, 255, 0.84);
      }
      .reason-guide__panel h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 900;
        color: #1e3a8a;
      }
      .reason-guide__steps {
        margin: 14px 0 0;
        display: grid;
        gap: 10px;
      }
      .reason-guide__step {
        display: grid;
        grid-template-columns: 28px 1fr;
        gap: 10px;
        align-items: start;
        padding: 12px 14px;
        border-radius: 18px;
        background: #f8fbff;
        border: 1px solid rgba(219, 234, 254, 0.95);
      }
      .reason-guide__step-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 999px;
        background: #2563eb;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
      }
      .reason-guide__jump,
      .reason-guide__presets {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .reason-guide__btn,
      .reason-guide__preset {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 42px;
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid rgba(191, 219, 254, 0.95);
        background: #fff;
        color: #1e40af;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      }
      .reason-guide__btn:hover,
      .reason-guide__preset:hover,
      .reason-guide__btn:focus-visible,
      .reason-guide__preset:focus-visible {
        outline: none;
        transform: translateY(-1px);
        border-color: #60a5fa;
        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.12);
      }
      .reason-guide__side-list {
        margin: 14px 0 0;
        display: grid;
        gap: 10px;
      }
      .reason-guide__bucket {
        padding: 14px;
        border-radius: 18px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
      }
      .reason-guide__bucket-title {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 13px;
        font-weight: 900;
        color: #0f172a;
      }
      .reason-guide__bucket-title::before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: #2563eb;
      }
      .reason-guide__bucket--special .reason-guide__bucket-title::before {
        background: #6366f1;
      }
      .reason-guide__bucket p {
        margin: 8px 0 0;
        color: #475569;
        font-size: 13px;
        line-height: 1.6;
      }
      .reason-top-controls {
        margin-bottom: 18px;
        padding: 16px;
        border-radius: 22px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
      }
      .reason-top-controls .hide-scrollbar {
        margin-left: -4px;
        margin-right: -4px;
        padding-left: 4px;
        padding-right: 4px;
      }
      .reason-card-extra {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
      }
      .reason-card-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .reason-chip {
        display: inline-flex;
        align-items: center;
        padding: 5px 9px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        line-height: 1;
        border: 1px solid transparent;
      }
      .reason-chip--group-common {
        color: #1d4ed8;
        background: #dbeafe;
        border-color: #bfdbfe;
      }
      .reason-chip--group-special {
        color: #4338ca;
        background: #e0e7ff;
        border-color: #c7d2fe;
      }
      .reason-chip--basic,
      .reason-chip--answer,
      .reason-chip--objective,
      .reason-chip--explain,
      .reason-chip--result {
        color: #334155;
        background: #f1f5f9;
        border-color: #cbd5e1;
      }
      .reason-chip--subjective,
      .reason-chip--spoken,
      .reason-chip--multi {
        color: #7c2d12;
        background: #ffedd5;
        border-color: #fdba74;
      }
      .reason-chip--formal,
      .reason-chip--written {
        color: #374151;
        background: #e5e7eb;
        border-color: #cbd5e1;
      }
      .reason-chip--negative,
      .reason-chip--blame,
      .reason-chip--sudden,
      .reason-chip--chaos,
      .reason-chip--focus {
        color: #991b1b;
        background: #fee2e2;
        border-color: #fca5a5;
      }
      .reason-chip--positive,
      .reason-chip--thanks {
        color: #166534;
        background: #dcfce7;
        border-color: #86efac;
      }
      .reason-chip--direct,
      .reason-chip--repeated,
      .reason-chip--command {
        color: #5b21b6;
        background: #ede9fe;
        border-color: #c4b5fd;
      }
      .reason-card-hint {
        margin-top: 9px;
        font-size: 12px;
        color: #64748b;
      }
      .reason-modal-quick {
        margin-bottom: 16px;
        padding: 14px 16px;
        border-radius: 18px;
        border: 1px solid #bfdbfe;
        background: linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
      }
      .reason-modal-quick h3 {
        margin: 0;
        font-size: 13px;
        font-weight: 900;
        color: #1d4ed8;
      }
      .reason-modal-quick p {
        margin: 10px 0 0;
        font-size: 12px;
        line-height: 1.6;
        color: #475569;
      }
      .reason-modal-quick .reason-card-chips {
        margin-top: 10px;
      }
      .reason-compare-note {
        margin-bottom: 16px;
        padding: 16px;
        border-radius: 20px;
        border: 1px solid #bfdbfe;
        background: linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
      }
      .reason-compare-note h3 {
        margin: 0;
        font-size: 15px;
        font-weight: 900;
        color: #1e3a8a;
      }
      .reason-compare-note__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-top: 12px;
      }
      .reason-compare-note__item {
        padding: 12px 14px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(191, 219, 254, 0.9);
      }
      .reason-compare-note__item strong {
        display: block;
        font-size: 12px;
        font-weight: 900;
        color: #2563eb;
      }
      .reason-compare-note__item p {
        margin: 8px 0 0;
        font-size: 13px;
        line-height: 1.6;
        color: #334155;
      }
      .reason-compare-help {
        margin-right: auto;
        font-size: 12px;
        color: #64748b;
      }
      .reason-compare-tabs {
        display: flex;
        gap: 10px;
        padding: 12px 16px 0;
        border-bottom: 1px solid #e2e8f0;
        background: #fff;
      }
      .reason-compare-tab {
        appearance: none;
        border: 1px solid transparent;
        border-bottom: none;
        border-radius: 14px 14px 0 0;
        background: transparent;
        color: #64748b;
        font-size: 13px;
        font-weight: 800;
        padding: 10px 14px;
        cursor: pointer;
      }
      .reason-compare-tab.is-active {
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #bfdbfe;
      }
      .reason-compare-cards-wrapper {
        flex: 1;
        overflow: auto;
        padding: 16px;
        background: #f8fafc;
      }
      .reason-decision-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 14px;
      }
      .reason-decision-card {
        padding: 18px;
        border-radius: 22px;
        border: 1px solid #dbeafe;
        background:
          radial-gradient(circle at top right, rgba(59, 130, 246, 0.10), transparent 28%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
        box-shadow: 0 14px 28px rgba(15, 23, 42, 0.05);
      }
      .reason-decision-card__top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .reason-decision-card__title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 900;
        color: #0f172a;
      }
      .reason-decision-card__formula {
        display: inline-flex;
        margin-top: 8px;
        padding: 5px 9px;
        border-radius: 999px;
        background: #eff6ff;
        color: #1d4ed8;
        font-size: 11px;
        font-weight: 800;
        border: 1px solid #bfdbfe;
      }
      .reason-decision-card__sections {
        display: grid;
        gap: 12px;
        margin-top: 14px;
      }
      .reason-decision-card__section {
        padding: 12px 14px;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        background: rgba(255, 255, 255, 0.9);
      }
      .reason-decision-card__section strong {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 900;
        color: #2563eb;
      }
      .reason-decision-card__section p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #334155;
      }
      .reason-decision-card__sample {
        background: #f8fafc;
      }
      @media (max-width: 900px) {
        .reason-guide__layout {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .reason-guide {
          padding: 18px;
          border-radius: 24px;
        }
        .reason-guide__btn,
        .reason-guide__preset {
          width: 100%;
          justify-content: center;
        }
        .reason-compare-tabs {
          padding: 10px 12px 0;
          gap: 8px;
        }
        .reason-compare-tab {
          flex: 1;
          justify-content: center;
          text-align: center;
          padding: 10px 8px;
        }
        .reason-compare-note__grid {
          grid-template-columns: 1fr;
        }
        .reason-compare-help {
          display: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getMainContainer() {
    return document.querySelector("body > .container.mx-auto.px-4.py-6.max-w-5xl");
  }

  function getGuideTarget() {
    return document.getElementById("app-subtitle")?.nextElementSibling || null;
  }

  function moveTopControls() {
    const subtitle = document.getElementById("app-subtitle");
    const searchContainer = document.getElementById("search-container");
    const mobileToggle = document.getElementById("mobile-search-toggle");
    const langButton = document.querySelector(".lang-btn");
    const langBar = langButton?.parentElement || null;

    if (!subtitle || !searchContainer || !langBar) {
      return;
    }

    let wrapper = document.getElementById("reasonTopControls");
    if (!wrapper) {
      wrapper = document.createElement("section");
      wrapper.id = "reasonTopControls";
      wrapper.className = "reason-top-controls";
      subtitle.parentElement?.insertBefore(wrapper, subtitle);
    }

    if (langBar.parentElement !== wrapper) {
      wrapper.appendChild(langBar);
    }
    if (searchContainer.parentElement !== wrapper) {
      wrapper.appendChild(searchContainer);
    }

    langBar.classList.remove("-mx-4", "px-4", "md:mx-0", "md:px-0");
    langBar.classList.add("hide-scrollbar");
    searchContainer.classList.remove("hidden", "md:block");
    searchContainer.classList.add("mt-3");
    if (mobileToggle) {
      mobileToggle.classList.add("hidden");
    }
  }

  function createTagChip(label, extraClass) {
    return `<span class="reason-chip ${extraClass}">${escapeHtml(label)}</span>`;
  }

  function renderGuide() {
    const container = getMainContainer();
    const target = getGuideTarget();
    if (!container || !target) {
      return;
    }

    const lang = getLang();
    const text = getText(lang);
    let guide = document.getElementById("reason-guide");

    if (!guide) {
      guide = document.createElement("section");
      guide.id = "reason-guide";
      guide.className = "reason-guide";
      container.insertBefore(guide, target);
    }

    const presetsHtml = PRESETS.map((preset) => {
      const label = preset.labels[lang] || preset.labels.en;
      return `
        <button class="reason-guide__preset" type="button" data-reason-preset="${preset.id}">
          <i class="fas fa-balance-scale text-blue-500" aria-hidden="true"></i>
          <span>${escapeHtml(label)}</span>
        </button>
      `;
    }).join("");

    const stepsHtml = text.steps
      .map(
        (step, index) => `
          <div class="reason-guide__step">
            <span class="reason-guide__step-index">${index + 1}</span>
            <div>${step}</div>
          </div>
        `
      )
      .join("");

    guide.innerHTML = `
      <p class="reason-guide__eyebrow">${escapeHtml(text.guideEyebrow)}</p>
      <h2 class="reason-guide__title">${escapeHtml(text.guideTitle)}</h2>
      <p class="reason-guide__desc">${escapeHtml(text.guideDesc)}</p>
      <div class="reason-guide__layout">
        <div class="reason-guide__panel">
          <h3>${escapeHtml(text.stepsTitle)}</h3>
          <div class="reason-guide__steps">${stepsHtml}</div>
          <div class="reason-guide__jump">
            <button class="reason-guide__btn" type="button" data-reason-jump="common">
              <i class="fas fa-arrow-down text-blue-500" aria-hidden="true"></i>
              <span>${escapeHtml(text.jumpCommon)}</span>
            </button>
            <button class="reason-guide__btn" type="button" data-reason-jump="special">
              <i class="fas fa-arrow-down text-indigo-500" aria-hidden="true"></i>
              <span>${escapeHtml(text.jumpSpecial)}</span>
            </button>
          </div>
        </div>
        <div class="reason-guide__panel">
          <h3>${escapeHtml(text.presetsTitle)}</h3>
          <div class="reason-guide__presets">${presetsHtml}</div>
          <div class="reason-guide__side-list">
            <div class="reason-guide__bucket">
              <p class="reason-guide__bucket-title">${escapeHtml(text.groupCommon)}</p>
              <p>-아/어서, -(으)니까, -기 때문에, -(으)므로</p>
            </div>
            <div class="reason-guide__bucket reason-guide__bucket--special">
              <p class="reason-guide__bucket-title">${escapeHtml(text.groupSpecial)}</p>
              <p>-느라고, -는 바람에, -는 통에, -는 탓에, -았더니/었더니, -다 보니, -고 해서, -는 덕분에</p>
            </div>
          </div>
        </div>
      </div>
    `;

    bindGuideEvents();
  }

  function findCardByGrammar(grammar) {
    return Array.from(document.querySelectorAll(".grammar-card")).find(
      (card) => card.dataset.grammar === grammar
    );
  }

  function openPresetCompare(grammars) {
    const toggleButton = document.getElementById("toggle-compare-mode");
    const compareBar = document.getElementById("compare-fab-container");
    const compareButton = document.getElementById("compare-selected-btn");

    if (!toggleButton || !compareBar || !compareButton) {
      return;
    }

    if (compareBar.classList.contains("translate-y-full")) {
      toggleButton.click();
    }

    window.setTimeout(() => {
      document.querySelectorAll(".grammar-card.selected").forEach((card) => {
        card.click();
      });

      grammars.forEach((grammar) => {
        const card = findCardByGrammar(grammar);
        if (card && !card.classList.contains("selected")) {
          card.click();
        }
      });

      compareButton.click();
    }, 40);
  }

  function scrollToGroup(group) {
    const titleId = group === "common" ? "group1-title" : "group2-title";
    const title = document.getElementById(titleId);
    if (title) {
      title.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function bindGuideEvents() {
    document.querySelectorAll("[data-reason-preset]").forEach((button) => {
      if (button.dataset.reasonBound === "true") {
        return;
      }

      button.dataset.reasonBound = "true";
      button.addEventListener("click", () => {
        const preset = PRESETS.find((item) => item.id === button.dataset.reasonPreset);
        if (preset) {
          openPresetCompare(preset.grammars);
        }
      });
    });

    document.querySelectorAll("[data-reason-jump]").forEach((button) => {
      if (button.dataset.reasonBound === "true") {
        return;
      }

      button.dataset.reasonBound = "true";
      button.addEventListener("click", () => {
        scrollToGroup(button.dataset.reasonJump);
      });
    });
  }

  function enhanceCards() {
    const lang = getLang();
    const text = getText(lang);

    document.querySelectorAll(".grammar-card").forEach((card) => {
      if (card.dataset.reasonEnhanced === "true") {
        return;
      }

      const grammar = card.dataset.grammar;
      const meta = GRAMMAR_META[grammar];
      card.dataset.reasonEnhanced = "true";
      card.classList.add("group");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });

      if (!meta) {
        card.setAttribute("aria-label", grammar);
        return;
      }

      const groupLabel =
        meta.group === "common" ? text.groupCommon : text.groupSpecial;
      const tagLabels = meta.tags.map((tag) => getTagLabel(lang, tag));

      card.setAttribute(
        "aria-label",
        `${grammar}. ${groupLabel}. ${tagLabels.join(", ")}`
      );

      const footer = document.createElement("div");
      footer.className = "reason-card-extra";
      footer.innerHTML = `
        <div class="reason-card-chips">
          ${createTagChip(
            groupLabel,
            meta.group === "common"
              ? "reason-chip--group-common"
              : "reason-chip--group-special"
          )}
          ${meta.tags
            .map((tag) =>
              createTagChip(getTagLabel(lang, tag), `reason-chip--${tag}`)
            )
            .join("")}
        </div>
        <p class="reason-card-hint">${escapeHtml(text.openHint)}</p>
      `;
      card.appendChild(footer);
    });
  }

  function enhanceCompareBar() {
    const compareBar = document.getElementById("compare-fab-container");
    const toggleButton = document.getElementById("toggle-compare-mode");
    if (!compareBar || !toggleButton) {
      return;
    }

    const lang = getLang();
    const text = getText(lang);

    let helper = compareBar.querySelector(".reason-compare-help");
    if (!helper) {
      helper = document.createElement("div");
      helper.className = "reason-compare-help";
      compareBar.insertBefore(helper, compareBar.firstElementChild);
    }
    helper.textContent = text.compareHint;
    toggleButton.setAttribute("aria-label", text.compareModeAria);
    toggleButton.setAttribute("title", text.compareModeAria);
  }

  function enhanceInfoModal() {
    const modal = document.getElementById("grammarModal");
    const infoTab = document.getElementById("infoTab");
    const title = document.getElementById("modalTitle")?.textContent.trim();

    if (!modal || modal.classList.contains("hidden") || !infoTab || !title) {
      return;
    }

    const meta = GRAMMAR_META[title];
    if (!meta) {
      return;
    }

    const lang = getLang();
    const text = getText(lang);
    const compareWith = MODAL_COMPARE_WITH[title] || [];
    const existing = infoTab.querySelector(".reason-modal-quick");

    if (
      existing &&
      existing.dataset.reasonGrammar === title &&
      existing.dataset.reasonLang === lang
    ) {
      return;
    }

    existing?.remove();

    const quick = document.createElement("section");
    quick.className = "reason-modal-quick";
    quick.dataset.reasonGrammar = title;
    quick.dataset.reasonLang = lang;
    quick.innerHTML = `
      <h3>${escapeHtml(text.modalQuick)}</h3>
      <div class="reason-card-chips">
        ${createTagChip(
          meta.group === "common" ? text.groupCommon : text.groupSpecial,
          meta.group === "common"
            ? "reason-chip--group-common"
            : "reason-chip--group-special"
        )}
        ${meta.tags
          .map((tag) =>
            createTagChip(getTagLabel(lang, tag), `reason-chip--${tag}`)
          )
          .join("")}
      </div>
      ${
        compareWith.length
          ? `<p>${escapeHtml(text.modalCompareWith)}: ${compareWith
              .map(escapeHtml)
              .join(", ")}</p>`
          : ""
      }
    `;

    infoTab.insertBefore(quick, infoTab.children[1] || null);
  }

  function getPairNote(names, lang) {
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "ko"));
    const key = sorted.join("||");

    if (PAIR_NOTES[key]) {
      return PAIR_NOTES[key][lang] || PAIR_NOTES[key].en;
    }

    const metas = sorted.map((name) => GRAMMAR_META[name]).filter(Boolean);
    if (!metas.length) {
      return null;
    }

    const allCommon = metas.every((meta) => meta.group === "common");
    const allSpecial = metas.every((meta) => meta.group === "special");
    const generic = GENERIC_PAIR_NOTES[lang] || GENERIC_PAIR_NOTES.en;

    if (allCommon) {
      return generic.allCommon;
    }
    if (allSpecial) {
      return generic.allSpecial;
    }
    return generic.mixed;
  }

  function getCompareGrammarNames() {
    const content = document.getElementById("compareContent");
    if (!content) {
      return [];
    }

    return Array.from(
      content.querySelectorAll("div.bg-blue-50.font-bold.text-blue-700")
    )
      .map((cell) => cell.textContent.trim())
      .filter(Boolean);
  }

  function getGrammarStore(lang) {
    if (typeof langData === "undefined") {
      return null;
    }
    return langData[lang]?.grammars || null;
  }

  function getDecisionGuide(grammar, lang) {
    const guides = DECISION_GUIDES[lang] || DECISION_GUIDES.en;
    return guides[grammar] || { question: "", choose: "" };
  }

  function ensureCompareScaffold() {
    const tableWrapper = document.getElementById("compareContentWrapper");
    const host = tableWrapper?.parentElement;

    if (!tableWrapper || !host) {
      return null;
    }

    let tabs = document.getElementById("reasonCompareTabs");
    if (!tabs) {
      tabs = document.createElement("div");
      tabs.id = "reasonCompareTabs";
      tabs.className = "reason-compare-tabs";
      host.insertBefore(tabs, tableWrapper);
    }

    let cardsWrapper = document.getElementById("reasonCompareCardsWrapper");
    if (!cardsWrapper) {
      cardsWrapper = document.createElement("div");
      cardsWrapper.id = "reasonCompareCardsWrapper";
      cardsWrapper.className = "reason-compare-cards-wrapper hidden";
      host.insertBefore(cardsWrapper, tableWrapper);
    }

    return { tabs, cardsWrapper, tableWrapper };
  }

  function setCompareView(view) {
    const scaffold = ensureCompareScaffold();
    if (!scaffold) {
      return;
    }

    scaffold.cardsWrapper.classList.toggle("hidden", view !== "cards");
    scaffold.tableWrapper.classList.toggle("hidden", view !== "table");

    scaffold.tabs
      .querySelectorAll(".reason-compare-tab")
      .forEach((button) => {
        button.classList.toggle("is-active", button.dataset.view === view);
      });
  }

  function renderCompareTabs(lang) {
    const scaffold = ensureCompareScaffold();
    if (!scaffold) {
      return;
    }

    const text = getText(lang);
    scaffold.tabs.innerHTML = `
      <button class="reason-compare-tab" type="button" data-view="cards">${escapeHtml(
        text.compareCardsTab
      )}</button>
      <button class="reason-compare-tab" type="button" data-view="table">${escapeHtml(
        text.compareTableTab
      )}</button>
    `;

    scaffold.tabs.querySelectorAll(".reason-compare-tab").forEach((button) => {
      button.addEventListener("click", () => {
        setCompareView(button.dataset.view);
      });
    });
  }

  function enhanceCompareSummary() {
    const modal = document.getElementById("compareModal");
    const names = getCompareGrammarNames();

    if (!modal || modal.classList.contains("hidden") || !names.length) {
      return;
    }

    const lang = getLang();
    const text = getText(lang);
    const grammarStore = getGrammarStore(lang);
    const scaffold = ensureCompareScaffold();

    if (!grammarStore || !scaffold) {
      return;
    }

    renderCompareTabs(lang);

    const note = getPairNote(names, lang);
    const noteHtml = note
      ? `
        <section class="reason-compare-note">
          <h3>${escapeHtml(text.compareSummaryTitle)}</h3>
          <div class="reason-compare-note__grid">
            <div class="reason-compare-note__item">
              <strong>${escapeHtml(text.compareCommon)}</strong>
              <p>${escapeHtml(note.common)}</p>
            </div>
            <div class="reason-compare-note__item">
              <strong>${escapeHtml(text.compareDiff)}</strong>
              <p>${escapeHtml(note.diff)}</p>
            </div>
            <div class="reason-compare-note__item">
              <strong>${escapeHtml(text.compareFocus)}</strong>
              <p>${escapeHtml(note.focus)}</p>
            </div>
          </div>
        </section>
      `
      : "";

    const cardsHtml = names
      .map((name) => {
        const data = grammarStore[name];
        if (!data) {
          return "";
        }

        const meta = GRAMMAR_META[name] || { group: "common", tags: [] };
        const guide = getDecisionGuide(name, lang);
        const groupLabel =
          meta.group === "common" ? text.groupCommon : text.groupSpecial;
        const sample = data.examples?.[0] || "";

        return `
          <article class="reason-decision-card">
            <div class="reason-decision-card__top">
              <div>
                <h3 class="reason-decision-card__title">${escapeHtml(name)}</h3>
                <span class="reason-decision-card__formula">${escapeHtml(data.formula)}</span>
              </div>
            </div>
            <div class="reason-card-chips" style="margin-top:12px;">
              ${createTagChip(
                groupLabel,
                meta.group === "common"
                  ? "reason-chip--group-common"
                  : "reason-chip--group-special"
              )}
              ${meta.tags
                .map((tag) =>
                  createTagChip(getTagLabel(lang, tag), `reason-chip--${tag}`)
                )
                .join("")}
            </div>
            <div class="reason-decision-card__sections">
              <section class="reason-decision-card__section">
                <strong>${escapeHtml(text.decisionQuestion)}</strong>
                <p>${escapeHtml(guide.question || data.desc)}</p>
              </section>
              <section class="reason-decision-card__section">
                <strong>${escapeHtml(text.decisionChoose)}</strong>
                <p>${escapeHtml(guide.choose || data.desc)}</p>
              </section>
              <section class="reason-decision-card__section">
                <strong>${escapeHtml(text.decisionCaution)}</strong>
                <p>${escapeHtml(data.constraints)}</p>
              </section>
              <section class="reason-decision-card__section reason-decision-card__sample">
                <strong>${escapeHtml(text.decisionSample)}</strong>
                <p>${escapeHtml(sample)}</p>
              </section>
            </div>
          </article>
        `;
      })
      .join("");

    scaffold.cardsWrapper.innerHTML = `
      ${noteHtml}
      <section class="reason-decision-grid">
        ${cardsHtml}
      </section>
    `;

    setCompareView("cards");
  }

  function refreshAll() {
    ensureStyle();
    moveTopControls();
    renderGuide();
    enhanceCards();
    enhanceCompareBar();
    enhanceInfoModal();
    enhanceCompareSummary();
  }

  function observe(target, callback) {
    if (!target) {
      return;
    }

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(callback);
    });
    observer.observe(target, { childList: true, subtree: true });
  }

  function bindLanguageButtons() {
    document.querySelectorAll(".lang-btn").forEach((button) => {
      if (button.dataset.reasonLangBound === "true") {
        return;
      }

      button.dataset.reasonLangBound = "true";
      button.addEventListener("click", () => {
        window.setTimeout(refreshAll, 0);
      });
    });
  }

  function init() {
    refreshAll();
    bindLanguageButtons();
    observe(document.getElementById("grammar-group-1"), refreshAll);
    observe(document.getElementById("grammar-group-2"), refreshAll);
    observe(document.getElementById("infoTab"), enhanceInfoModal);
    observe(document.getElementById("compareContent"), enhanceCompareSummary);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
