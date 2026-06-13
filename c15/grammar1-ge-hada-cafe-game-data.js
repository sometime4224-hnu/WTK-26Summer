window.GE_HADA_CAFE_GAME = {
  startPositions: {
    boss: { x: 318, y: 286 },
    manager: { x: 560, y: 226 },
    A: { x: 96, y: 410 },
    B: { x: 520, y: 300 },
    C: { x: 520, y: 420 }
  },
  positions: {
    busyBoss: { x: 342, y: 118 },
    managerToA: { x: 128, y: 400 },
    managerToB: { x: 500, y: 294 },
    managerToC: { x: 500, y: 414 },
    table: { x: 302, y: 322 },
    coffee: { x: 348, y: 110 },
    floor: { x: 344, y: 482 },
    trash: { x: 144, y: 196 },
    shelf: { x: 560, y: 96 },
    A: { x: 96, y: 410 },
    B: { x: 520, y: 300 },
    C: { x: 520, y: 420 }
  },
  workers: {
    A: { name: "A", actorId: "workerA" },
    B: { name: "B", actorId: "workerB" },
    C: { name: "C", actorId: "workerC" }
  },
  missions: [
    {
      id: "clean-table",
      title: "테이블 정리",
      situation: "손님이 떠난 뒤 테이블이 더러워요. A에게 테이블을 닦게 하세요.",
      target: "A",
      destination: "table",
      workClass: "is-cleaning",
      actionLabel: "테이블 닦는 중",
      bossOrder: "A가 테이블을 닦게 하세요.",
      directRequest: "테이블을 닦아 주세요.",
      successText: "A가 테이블을 닦게 했어요!",
      workerReply: "네, 알겠습니다.",
      completion: "A가 테이블을 닦았어요.",
      hint: "A가 + 테이블을 닦다 + 게 하세요",
      requestOptions: [
        "테이블을 닦아 주세요.",
        "커피를 만들어 주세요.",
        "바닥을 쓸어 주세요."
      ],
      choices: [
        "A가 테이블을 닦게 하세요.",
        "B가 커피를 만들게 하세요.",
        "C가 바닥을 쓸게 하세요."
      ]
    },
    {
      id: "make-coffee",
      title: "커피 준비",
      situation: "손님 주문이 들어왔어요. B에게 커피를 만들게 하세요.",
      target: "B",
      destination: "coffee",
      workClass: "is-coffee",
      actionLabel: "커피 만드는 중",
      bossOrder: "B가 커피를 만들게 하세요.",
      directRequest: "커피를 만들어 주세요.",
      successText: "B가 커피를 만들게 했어요!",
      workerReply: "네, 바로 만들겠습니다.",
      completion: "B가 커피를 만들었어요.",
      hint: "B가 + 커피를 만들다 + 게 하세요",
      requestOptions: [
        "쓰레기를 버려 주세요.",
        "커피를 만들어 주세요.",
        "컵을 정리해 주세요."
      ],
      choices: [
        "A가 쓰레기를 버리게 하세요.",
        "B가 커피를 만들게 하세요.",
        "C가 컵을 정리하게 하세요."
      ]
    },
    {
      id: "sweep-floor",
      title: "바닥 청소",
      situation: "입구 쪽 바닥에 먼지가 보여요. C에게 바닥을 쓸게 하세요.",
      target: "C",
      destination: "floor",
      workClass: "is-sweeping",
      actionLabel: "바닥 쓰는 중",
      bossOrder: "C가 바닥을 쓸게 하세요.",
      directRequest: "바닥을 쓸어 주세요.",
      successText: "C가 바닥을 쓸게 했어요!",
      workerReply: "네, 청소하겠습니다.",
      completion: "C가 바닥을 쓸었어요.",
      hint: "C가 + 바닥을 쓸다 + 게 하세요",
      requestOptions: [
        "바닥을 닦아 주세요.",
        "바닥을 쓸어 주세요.",
        "커피를 만들어 주세요."
      ],
      choices: [
        "B가 바닥을 닦게 하세요.",
        "C가 바닥을 쓸게 하세요.",
        "A가 커피를 만들게 하세요."
      ]
    },
    {
      id: "take-trash",
      title: "쓰레기 버리기",
      situation: "카운터 옆 쓰레기통이 가득 찼어요. A에게 쓰레기를 버리게 하세요.",
      target: "A",
      destination: "trash",
      workClass: "is-trash",
      actionLabel: "쓰레기 버리는 중",
      bossOrder: "A가 쓰레기를 버리게 하세요.",
      directRequest: "쓰레기를 버려 주세요.",
      successText: "A가 쓰레기를 버리게 했어요!",
      workerReply: "네, 다녀오겠습니다.",
      completion: "A가 쓰레기를 버렸어요.",
      hint: "A가 + 쓰레기를 버리다 + 게 하세요",
      requestOptions: [
        "쓰레기를 버려 주세요.",
        "테이블을 닦아 주세요.",
        "커피를 만들어 주세요."
      ],
      choices: [
        "A가 쓰레기를 버리게 하세요.",
        "B가 테이블을 닦게 하세요.",
        "C가 커피를 만들게 하세요."
      ]
    },
    {
      id: "arrange-cups",
      title: "컵 정리",
      situation: "컵 진열대가 어지러워요. B에게 컵을 정리하게 하세요.",
      target: "B",
      destination: "shelf",
      workClass: "is-shelf",
      actionLabel: "컵 정리하는 중",
      bossOrder: "B가 컵을 정리하게 하세요.",
      directRequest: "컵을 정리해 주세요.",
      successText: "B가 컵을 정리하게 했어요!",
      workerReply: "네, 정리하겠습니다.",
      completion: "B가 컵을 정리했어요.",
      hint: "B가 + 컵을 정리하다 + 게 하세요",
      requestOptions: [
        "컵을 정리해 주세요.",
        "바닥을 쓸어 주세요.",
        "테이블을 닦아 주세요."
      ],
      choices: [
        "C가 컵을 정리하게 하세요.",
        "A가 바닥을 쓸게 하세요.",
        "B가 컵을 정리하게 하세요."
      ]
    }
  ]
};
