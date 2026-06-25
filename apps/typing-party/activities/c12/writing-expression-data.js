(function () {
  "use strict";

  const langs = ["vi", "mn", "ar", "kk", "th", "en", "ja", "zh"];

  function tx(vi, en, ar) {
    return {
      vi,
      mn: en,
      ar,
      kk: en,
      th: en,
      en,
      ja: en,
      zh: en
    };
  }

  function expr(id, category, target, meaningKo, usageKo, exampleKo, paragraphRole, translations) {
    return { id, category, target, meaningKo, usageKo, exampleKo, paragraphRole, translations };
  }

  const categories = [
    { id: "all", label: "전체", description: "쓰기 주제 표현 전체" },
    { id: "health", label: "건강 노력", description: "건강을 위해 평소에 하는 행동" },
    { id: "method", label: "생활 운동 방법", description: "시간이 없어도 할 수 있는 운동 방법" },
    { id: "effect", label: "운동 효과", description: "운동을 하면 생기는 좋은 변화" },
    { id: "empathy", label: "공감", description: "고민 글을 읽고 먼저 인정하는 표현" },
    { id: "advice", label: "권유", description: "상대에게 부드럽게 제안하는 표현" },
    { id: "link", label: "연결 표현", description: "문장과 문장을 자연스럽게 이어 주는 표현" }
  ];

  const expressions = [
    expr("health-water", "건강 노력", "물을 많이 마시다", "건강을 위해 평소에 하는 노력", "매일 쉽게 실천할 수 있는 건강 습관입니다.", "저는 건강을 위해 물을 많이 마십니다.", "건강 노력 예시", tx("Uống nhiều nước", "Drink plenty of water", "شرب الكثير من الماء")),
    expr("health-vegetable", "건강 노력", "채소와 과일을 많이 먹다", "건강한 식습관을 말할 때", "먹는 습관을 설명하는 문장에 잘 어울립니다.", "채소와 과일을 많이 먹으면 건강에 좋습니다.", "건강 노력 예시", tx("Ăn nhiều rau và trái cây", "Eat plenty of vegetables and fruit", "تناول الكثير من الخضار والفواكه")),
    expr("health-regular", "건강 노력", "규칙적으로 생활하다", "생활 습관을 정리할 때", "운동뿐 아니라 수면과 식사까지 포함하는 표현입니다.", "건강을 유지하려면 규칙적으로 생활해야 합니다.", "건강 관리 이유", tx("Sống điều độ", "Live regularly", "العيش بنظام منتظم")),
    expr("health-sleep", "건강 노력", "충분히 잠을 자다", "회복과 피로를 말할 때", "몸이 지쳤을 때 필요한 행동을 말합니다.", "충분히 잠을 자면 기운이 납니다.", "건강 노력 예시", tx("Ngủ đủ giấc", "Get enough sleep", "النوم بشكل كاف")),
    expr("health-time", "건강 노력", "시간을 정해서 운동하다", "운동을 계속하는 방법", "바쁜 사람에게 현실적인 방법으로 권할 수 있습니다.", "시간을 정해서 운동하면 꾸준히 할 수 있습니다.", "실천 방법 제안", tx("Đặt thời gian để tập thể dục", "Set a time to exercise", "تحديد وقت لممارسة الرياضة")),
    expr("health-stretch-often", "건강 노력", "시간이 있을 때마다 스트레칭을 하다", "틈새 시간을 활용하는 노력", "생활 속 운동과 바로 연결되는 표현입니다.", "시간이 있을 때마다 스트레칭을 해 보세요.", "생활 운동 방법", tx("Giãn cơ mỗi khi có thời gian", "Stretch whenever you have time", "التمدد كلما توفر الوقت")),

    expr("method-jump", "생활 운동 방법", "제자리 뛰기를 하다", "밖에 나가지 않고 하는 운동", "짧은 시간에 몸을 움직일 수 있는 방법입니다.", "교통 신호를 기다리면서 제자리 뛰기를 할 수 있습니다.", "구체적 운동 방법", tx("Chạy tại chỗ", "Jog in place", "الجري في المكان")),
    expr("method-walk-short", "생활 운동 방법", "가까운 거리는 걸어가다", "짧은 이동을 운동으로 바꾸기", "시간이 없을 때도 실천하기 쉽습니다.", "가까운 거리는 걸어가는 것이 좋습니다.", "구체적 운동 방법", tx("Đi bộ những quãng đường gần", "Walk short distances", "المشي للمسافات القريبة")),
    expr("method-bus", "생활 운동 방법", "버스 한 정거장 전에 내려서 걷다", "출퇴근길에 운동하기", "일상 이동을 운동으로 바꾸는 표현입니다.", "버스 한 정거장 전에 내려서 걸어 보세요.", "구체적 운동 방법", tx("Xuống trước một trạm và đi bộ", "Get off one stop early and walk", "النزول قبل محطة والمشي")),
    expr("method-chair-leg", "생활 운동 방법", "의자에 앉아서 다리를 들었다 내리다", "앉아서 하는 간단한 운동", "사무실이나 교실에서 할 수 있는 동작입니다.", "의자에 앉아서 다리를 들었다 내리면 좋습니다.", "구체적 운동 방법", tx("Nâng và hạ chân khi ngồi", "Lift and lower your legs while sitting", "رفع الساقين وإنزالهما أثناء الجلوس")),
    expr("method-break", "생활 운동 방법", "쉬는 시간마다 몸을 풀다", "쉬는 시간을 활용하기", "오래 앉아 있는 사람에게 권하기 좋습니다.", "쉬는 시간마다 몸을 풀면 덜 피곤합니다.", "구체적 운동 방법", tx("Thả lỏng cơ thể vào mỗi giờ nghỉ", "Loosen up during every break", "تحريك الجسم في كل استراحة")),
    expr("method-back", "생활 운동 방법", "오래 앉아 있을 때 허리를 펴다", "자세를 바로잡는 방법", "나쁜 자세가 걱정되는 사람에게 쓸 수 있습니다.", "오래 앉아 있을 때 허리를 펴는 것이 중요합니다.", "구체적 운동 방법", tx("Duỗi thẳng lưng khi ngồi lâu", "Straighten your back when sitting for a long time", "فرد الظهر عند الجلوس طويلا")),
    expr("method-light", "생활 운동 방법", "틈틈이 가벼운 운동을 하다", "시간이 부족할 때 하는 운동", "생활 속 운동의 중심 표현입니다.", "운동할 시간이 없더라도 틈틈이 가벼운 운동을 해 보세요.", "중심 권유 방법", tx("Thỉnh thoảng vận động nhẹ", "Do light exercise from time to time", "ممارسة تمارين خفيفة بين الحين والآخر")),

    expr("effect-stress", "운동 효과", "스트레스가 풀리다", "운동 후 마음의 변화", "걷기나 스트레칭의 장점을 말할 때 씁니다.", "운동을 하면 스트레스가 풀립니다.", "운동 효과 근거", tx("Căng thẳng được giải tỏa", "Stress is relieved", "يزول التوتر")),
    expr("effect-light", "운동 효과", "몸이 가벼워지다", "운동 후 몸의 느낌", "경험 뒤 결과 문장에 잘 맞습니다.", "스트레칭을 했더니 몸이 가벼워졌습니다.", "운동 효과 근거", tx("Cơ thể nhẹ nhõm hơn", "The body feels lighter", "يشعر الجسم بالخفة")),
    expr("effect-less-tired", "운동 효과", "쉽게 지치지 않다", "체력이 좋아진 결과", "꾸준히 운동한 뒤의 변화를 설명합니다.", "꾸준히 운동하면 쉽게 지치지 않습니다.", "운동 효과 근거", tx("Không dễ mệt", "Do not get tired easily", "لا تتعب بسهولة")),
    expr("effect-stamina", "운동 효과", "체력이 좋아지다", "운동의 대표 효과", "생활 운동을 권유하는 근거가 됩니다.", "계단을 이용하면 체력이 좋아집니다.", "운동 효과 근거", tx("Thể lực tốt lên", "Stamina improves", "تتحسن اللياقة")),
    expr("effect-shape", "운동 효과", "몸매가 좋아지다", "체중과 몸의 변화", "고민 글의 체중 걱정과 연결됩니다.", "가벼운 운동을 계속하면 몸매가 좋아질 수 있습니다.", "체중 걱정 해결", tx("Dáng người đẹp hơn", "Body shape improves", "يتحسن شكل الجسم")),
    expr("effect-posture", "운동 효과", "자세를 교정할 수 있다", "자세 문제의 해결", "읽기 주제와 연결되는 효과 표현입니다.", "스트레칭을 하면 자세를 교정할 수 있습니다.", "운동 효과 근거", tx("Có thể sửa tư thế", "You can correct your posture", "يمكن تصحيح وضعية الجسم")),
    expr("effect-refresh", "운동 효과", "기분이 상쾌해지다", "운동 뒤 기분 변화", "좋은 느낌을 강조할 때 씁니다.", "걷기 운동을 하면 기분이 상쾌해집니다.", "운동 효과 근거", tx("Tâm trạng sảng khoái hơn", "Feel refreshed", "تصبح النفس منتعشة")),
    expr("effect-health", "운동 효과", "건강을 지킬 수 있다", "운동의 최종 목적", "답글의 마무리에 쓰기 좋습니다.", "생활 속 운동으로 건강을 지킬 수 있습니다.", "마무리 효과", tx("Có thể giữ sức khỏe", "You can protect your health", "يمكن الحفاظ على الصحة")),

    expr("empathy-worry", "공감", "많이 걱정되시겠어요", "상대의 걱정에 공감하기", "답글 첫 문장에 쓰기 좋습니다.", "요즘 건강 때문에 많이 걱정되시겠어요.", "답글 시작", tx("Chắc bạn lo lắng nhiều", "You must be very worried", "لا بد أنك قلق كثيرا")),
    expr("empathy-busy", "공감", "운동할 시간을 내기가 어렵지요", "바쁜 상황 인정하기", "상대가 느끼는 어려움을 먼저 받아 줍니다.", "바쁘면 운동할 시간을 내기가 어렵지요.", "답글 시작", tx("Khó dành thời gian tập thể dục", "It is hard to make time to exercise", "من الصعب تخصيص وقت للرياضة")),
    expr("empathy-heavy", "공감", "몸이 무겁고 쉽게 지치는 모양이에요", "상태를 보고 추측하기", "고민 글의 내용을 정리하며 쓸 수 있습니다.", "운동을 못 해서 몸이 무겁고 쉽게 지치는 모양이에요.", "문제 정리", tx("Có vẻ cơ thể nặng nề và dễ mệt", "It seems your body feels heavy and gets tired easily", "يبدو أن جسمك ثقيل وتتعب بسهولة")),

    expr("advice-easy", "권유", "먼저 쉬운 운동부터 시작해 보세요", "부담을 줄여 권유하기", "답글에서 자연스럽고 부드러운 조언입니다.", "먼저 쉬운 운동부터 시작해 보세요.", "권유 문장", tx("Hãy bắt đầu bằng bài tập dễ", "Start with easy exercise first", "ابدأ بتمارين سهلة أولا")),
    expr("advice-little", "권유", "무리하지 말고 조금씩 해 보세요", "천천히 시작하게 권하기", "운동을 두려워하는 사람에게 좋습니다.", "무리하지 말고 조금씩 해 보세요.", "권유 문장", tx("Đừng quá sức, hãy làm từng chút", "Do not overdo it; try little by little", "لا ترهق نفسك وجرب قليلا قليلا")),
    expr("advice-five", "권유", "하루에 5분만이라도 스트레칭을 해 보세요", "짧은 실천 제안", "시간이 없는 사람에게 현실적입니다.", "하루에 5분만이라도 스트레칭을 해 보세요.", "권유 문장", tx("Hãy giãn cơ dù chỉ 5 phút mỗi ngày", "Try stretching even for five minutes a day", "جرب التمدد ولو خمس دقائق يوميا")),
    expr("advice-keep", "권유", "매일 조금씩 계속하는 것이 중요합니다", "꾸준함 강조하기", "마지막 조언 문장으로 잘 맞습니다.", "운동은 매일 조금씩 계속하는 것이 중요합니다.", "마무리 조언", tx("Điều quan trọng là tiếp tục từng chút mỗi ngày", "It is important to keep going little by little every day", "المهم هو الاستمرار قليلا كل يوم")),

    expr("link-example", "연결 표현", "예를 들어", "예시를 시작할 때", "방법을 구체적으로 보여 줄 때 씁니다.", "예를 들어, 가까운 거리는 걸어가 보세요.", "예시 연결", tx("Ví dụ", "For example", "على سبيل المثال")),
    expr("link-especially", "연결 표현", "특히", "중요한 내용을 강조할 때", "여러 효과 중 하나를 강조합니다.", "특히 스트레칭은 쉽게 할 수 있습니다.", "강조 연결", tx("Đặc biệt", "Especially", "خصوصا")),
    expr("link-so", "연결 표현", "그래서", "이유 뒤에 결과를 이을 때", "문장과 문장을 자연스럽게 이어 줍니다.", "그래서 생활 속 운동을 추천합니다.", "결과 연결", tx("Vì vậy", "So", "لذلك")),
    expr("link-result", "연결 표현", "이렇게 하면", "방법 뒤 효과를 말할 때", "권유한 방법의 좋은 점을 이어 줍니다.", "이렇게 하면 건강을 지킬 수 있습니다.", "효과 연결", tx("Nếu làm như vậy", "If you do this", "إذا فعلت ذلك")),
    expr("link-hard", "연결 표현", "처음에는 힘들 수 있지만", "양보하며 격려할 때", "상대의 부담을 인정하고 다음 문장으로 이어 갑니다.", "처음에는 힘들 수 있지만 곧 익숙해질 겁니다.", "격려 연결", tx("Ban đầu có thể khó nhưng", "It may be hard at first, but", "قد يكون صعبا في البداية ولكن")),
    expr("link-no-time", "연결 표현", "운동할 시간이 없더라도", "조건을 인정하고 조언할 때", "교재 고민 글과 직접 연결됩니다.", "운동할 시간이 없더라도 생활 속에서 움직일 수 있습니다.", "조건 연결", tx("Dù không có thời gian tập", "Even if you do not have time to exercise", "حتى لو لم يكن لديك وقت للرياضة")),
    expr("link-health", "연결 표현", "건강을 위해서는", "목적을 먼저 말할 때", "조언 문장의 시작으로 쓰기 좋습니다.", "건강을 위해서는 꾸준히 움직여야 합니다.", "목적 연결", tx("Để khỏe mạnh", "For your health", "من أجل الصحة"))
  ];

  const byId = Object.fromEntries(expressions.map((item) => [item.id, item]));

  const assemblyGroups = {
    empathy: ["empathy-worry", "empathy-busy", "empathy-heavy"].map((id) => byId[id].target),
    problem: ["요즘 바빠서", "운동을 못 해서", "건강이 나빠진 것 같아서", "살도 찐 것 같아서"],
    method: ["method-walk-short", "method-bus", "method-break", "method-back", "method-light", "health-stretch-often"].map((id) => byId[id].target),
    effect: ["effect-stress", "effect-light", "effect-less-tired", "effect-stamina", "effect-posture", "effect-health"].map((id) => byId[id].target),
    advice: ["advice-easy", "advice-little", "advice-keep", "link-no-time", "link-result", "link-health"].map((id) => byId[id].target)
  };

  const scenario = {
    ko: "바빠서 운동할 시간이 없는 사람에게 생활 속 운동을 권유하는 답글 쓰기",
    translations: tx(
      "Viết trả lời khuyên người bận rộn tập vận động trong đời sống hằng ngày.",
      "Write a reply recommending daily-life exercise to someone who is too busy to exercise.",
      "كتابة رد ينصح شخصا مشغولا بممارسة الرياضة في الحياة اليومية."
    )
  };

  window.C12_WRITING_TOPIC_DATA = {
    langs,
    categories,
    expressions,
    assemblyGroups,
    scenario
  };
})();
