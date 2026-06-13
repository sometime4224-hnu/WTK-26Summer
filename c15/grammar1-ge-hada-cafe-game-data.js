window.GE_HADA_CAFE_GAME = {
  stageSize: { width: 1672, height: 941 },
  directMissionCount: 5,
  managerPracticeCount: 5,
  startPositions: {
    boss: { x: 815, y: 360 },
    manager: { x: 650, y: 450 },
    A: { x: 260, y: 600 },
    B: { x: 835, y: 430 },
    C: { x: 1280, y: 600 }
  },
  positions: {
    busyBoss: { x: 1130, y: 280 },
    managerToA: { x: 330, y: 575 },
    managerToB: { x: 770, y: 430 },
    managerToC: { x: 1210, y: 585 },
    table: { x: 420, y: 520 },
    coffee: { x: 1110, y: 280 },
    floor: { x: 820, y: 585 },
    trash: { x: 510, y: 380 },
    shelf: { x: 1265, y: 205 },
    A: { x: 260, y: 600 },
    B: { x: 835, y: 430 },
    C: { x: 1280, y: 600 }
  },
  workers: {
    A: { name: "A", actorId: "workerA" },
    B: { name: "B", actorId: "workerB" },
    C: { name: "C", actorId: "workerC" }
  },
  directMissionPool: [
    {
      id: "a-clean-window-table",
      title: "창가 테이블 정리",
      situation: "왼쪽 창가 테이블에 컵 자국이 남아 있어요. A에게 테이블을 닦게 하세요.",
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
        "쓰레기를 버려 주세요."
      ]
    },
    {
      id: "a-empty-trash",
      title: "쓰레기통 비우기",
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
        "컵을 정리해 주세요.",
        "쓰레기를 버려 주세요.",
        "바닥을 쓸어 주세요."
      ]
    },
    {
      id: "a-sweep-entry",
      title: "입구 바닥 청소",
      situation: "입구 매트 주변에 먼지가 보여요. A에게 바닥을 쓸게 하세요.",
      target: "A",
      destination: "floor",
      workClass: "is-sweeping",
      actionLabel: "바닥 쓰는 중",
      bossOrder: "A가 바닥을 쓸게 하세요.",
      directRequest: "바닥을 쓸어 주세요.",
      successText: "A가 바닥을 쓸게 했어요!",
      workerReply: "네, 청소하겠습니다.",
      completion: "A가 바닥을 쓸었어요.",
      hint: "A가 + 바닥을 쓸다 + 게 하세요",
      requestOptions: [
        "바닥을 쓸어 주세요.",
        "테이블을 닦아 주세요.",
        "커피를 만들어 주세요."
      ]
    },
    {
      id: "a-arrange-display-cups",
      title: "컵 진열대 정리",
      situation: "상단 컵 진열대의 컵이 흐트러졌어요. A에게 컵을 정리하게 하세요.",
      target: "A",
      destination: "shelf",
      workClass: "is-shelf",
      actionLabel: "컵 정리하는 중",
      bossOrder: "A가 컵을 정리하게 하세요.",
      directRequest: "컵을 정리해 주세요.",
      successText: "A가 컵을 정리하게 했어요!",
      workerReply: "네, 정리하겠습니다.",
      completion: "A가 컵을 정리했어요.",
      hint: "A가 + 컵을 정리하다 + 게 하세요",
      requestOptions: [
        "쓰레기를 버려 주세요.",
        "컵을 정리해 주세요.",
        "바닥을 쓸어 주세요."
      ]
    },
    {
      id: "b-make-order-coffee",
      title: "커피 주문 준비",
      situation: "새 주문이 들어왔어요. B에게 커피를 만들게 하세요.",
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
      ]
    },
    {
      id: "b-arrange-cups",
      title: "컵 진열 정리",
      situation: "컵 진열대에 빈 컵이 섞여 있어요. B에게 컵을 정리하게 하세요.",
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
      ]
    },
    {
      id: "b-clean-center-table",
      title: "가운데 테이블 정리",
      situation: "가운데 테이블을 다음 손님이 쓰려고 해요. B에게 테이블을 닦게 하세요.",
      target: "B",
      destination: "table",
      workClass: "is-cleaning",
      actionLabel: "테이블 닦는 중",
      bossOrder: "B가 테이블을 닦게 하세요.",
      directRequest: "테이블을 닦아 주세요.",
      successText: "B가 테이블을 닦게 했어요!",
      workerReply: "네, 알겠습니다.",
      completion: "B가 테이블을 닦았어요.",
      hint: "B가 + 테이블을 닦다 + 게 하세요",
      requestOptions: [
        "테이블을 닦아 주세요.",
        "쓰레기를 버려 주세요.",
        "커피를 만들어 주세요."
      ]
    },
    {
      id: "b-take-counter-trash",
      title: "계산대 주변 정리",
      situation: "계산대 아래 쓰레기가 보여요. B에게 쓰레기를 버리게 하세요.",
      target: "B",
      destination: "trash",
      workClass: "is-trash",
      actionLabel: "쓰레기 버리는 중",
      bossOrder: "B가 쓰레기를 버리게 하세요.",
      directRequest: "쓰레기를 버려 주세요.",
      successText: "B가 쓰레기를 버리게 했어요!",
      workerReply: "네, 다녀오겠습니다.",
      completion: "B가 쓰레기를 버렸어요.",
      hint: "B가 + 쓰레기를 버리다 + 게 하세요",
      requestOptions: [
        "커피를 만들어 주세요.",
        "쓰레기를 버려 주세요.",
        "컵을 정리해 주세요."
      ]
    },
    {
      id: "c-sweep-hall",
      title: "홀 바닥 청소",
      situation: "홀 중앙 바닥에 먼지가 보여요. C에게 바닥을 쓸게 하세요.",
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
        "바닥을 쓸어 주세요.",
        "컵을 정리해 주세요.",
        "테이블을 닦아 주세요."
      ]
    },
    {
      id: "c-clean-right-table",
      title: "오른쪽 테이블 정리",
      situation: "오른쪽 원형 테이블이 어질러져 있어요. C에게 테이블을 닦게 하세요.",
      target: "C",
      destination: "table",
      workClass: "is-cleaning",
      actionLabel: "테이블 닦는 중",
      bossOrder: "C가 테이블을 닦게 하세요.",
      directRequest: "테이블을 닦아 주세요.",
      successText: "C가 테이블을 닦게 했어요!",
      workerReply: "네, 알겠습니다.",
      completion: "C가 테이블을 닦았어요.",
      hint: "C가 + 테이블을 닦다 + 게 하세요",
      requestOptions: [
        "커피를 만들어 주세요.",
        "테이블을 닦아 주세요.",
        "쓰레기를 버려 주세요."
      ]
    },
    {
      id: "c-make-group-coffee",
      title: "단체 주문 준비",
      situation: "단체 손님 주문이 들어왔어요. C에게 커피를 만들게 하세요.",
      target: "C",
      destination: "coffee",
      workClass: "is-coffee",
      actionLabel: "커피 만드는 중",
      bossOrder: "C가 커피를 만들게 하세요.",
      directRequest: "커피를 만들어 주세요.",
      successText: "C가 커피를 만들게 했어요!",
      workerReply: "네, 바로 만들겠습니다.",
      completion: "C가 커피를 만들었어요.",
      hint: "C가 + 커피를 만들다 + 게 하세요",
      requestOptions: [
        "컵을 정리해 주세요.",
        "커피를 만들어 주세요.",
        "바닥을 쓸어 주세요."
      ]
    },
    {
      id: "c-take-closing-trash",
      title: "마감 쓰레기 정리",
      situation: "퇴근 전 쓰레기를 비워야 해요. C에게 쓰레기를 버리게 하세요.",
      target: "C",
      destination: "trash",
      workClass: "is-trash",
      actionLabel: "쓰레기 버리는 중",
      bossOrder: "C가 쓰레기를 버리게 하세요.",
      directRequest: "쓰레기를 버려 주세요.",
      successText: "C가 쓰레기를 버리게 했어요!",
      workerReply: "네, 다녀오겠습니다.",
      completion: "C가 쓰레기를 버렸어요.",
      hint: "C가 + 쓰레기를 버리다 + 게 하세요",
      requestOptions: [
        "쓰레기를 버려 주세요.",
        "테이블을 닦아 주세요.",
        "커피를 만들어 주세요."
      ]
    }
  ]
};
