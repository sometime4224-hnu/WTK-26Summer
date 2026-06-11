(function () {
  "use strict";

  const MANIFEST_URL = "../articulation-cue-lab/assets/articulation/manifest.json";
  const ASSET_BASE = "../articulation-cue-lab/assets/articulation/";

  const placeLabels = {
    lip: "입술",
    front: "앞혀 · 잇몸",
    palatal: "앞혀 · 경구개",
    back: "뒤혀 · 연구개",
    throat: "목",
    open: "초성 없음",
  };

  const modeLabels = {
    onset: "초성 기본",
    tense: "된소리",
    coda: "받침",
  };

  const channelLabels = {
    lips: "입술",
    tongue: "혀",
    air: "공기",
    throat: "목",
  };

  const familyDetails = {
    lip: "두 입술을 닫거나 모읍니다.",
    front: "혀끝과 앞쪽 입천장 사이를 씁니다.",
    palatal: "혀 앞쪽이 경구개 쪽으로 올라갑니다.",
    back: "혀 뒤쪽이 연구개 쪽으로 올라갑니다.",
    throat: "목 안쪽에서 숨이 스칩니다.",
    open: "초성 ㅇ은 막거나 터뜨리는 자리가 없습니다.",
  };

  function step(asset, label, note) {
    return { asset, label, note };
  }

  function frame(parent, index, label, note) {
    return step(`${parent}-frame-${String(index).padStart(2, "0")}`, label, note);
  }

  function frameSet(parent, labels, notes) {
    return labels.map((label, index) => frame(parent, index + 1, label, notes[index]));
  }

  function channel(asset, state) {
    return { asset, state };
  }

  const inventories = {
    onset: [
      {
        id: "onset-giyeok",
        letter: "ㄱ",
        place: "back",
        manner: "파열음",
        energy: "예사소리",
        cue: "혀 뒤쪽이 연구개에 닿아 잠깐 막고, 큰 숨 없이 짧게 열립니다.",
        contrast: "ㅋ보다 숨이 작고, ㄲ보다 긴장이 약합니다.",
        tags: ["뒤혀", "연구개", "짧은 열림", "약한 숨"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "뒤 모음에 따라 따라갑니다."),
          tongue: channel("tongue-back-approach-clean", "혀 뒤쪽이 연구개로 올라갑니다."),
          air: channel("sequence-velar-soft-stop-frame-04", "짧고 작은 구강 방출"),
          throat: channel("glottis-neutral-lenis", "긴장·강한 기식 없음"),
        },
        timeline: frameSet(
          "sequence-velar-soft-stop",
          ["준비", "접근", "막힘", "방출"],
          ["혀는 낮게 시작", "혀 뒤쪽 상승", "연구개 접촉", "작게 열림"]
        ),
      },
      {
        id: "onset-nieun",
        letter: "ㄴ",
        place: "front",
        manner: "비음",
        energy: "울림 있음",
        cue: "혀끝은 앞쪽에 닿고 연구개가 내려가 공기가 코로 빠집니다.",
        contrast: "ㄷ처럼 막지만 터뜨리지 않고, ㄹ처럼 스치지 않습니다.",
        tags: ["혀끝 접촉", "코길", "울림", "무파열"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "입술은 모음 모양을 준비"),
          tongue: channel("front-contact-close-highlight", "혀끝이 앞쪽에 닿음"),
          air: channel("nasal-route-blue", "비강으로 흐름"),
          throat: channel("voice-channel-purple", "성대 울림 유지"),
        },
        timeline: frameSet(
          "sequence-front-nasal-voice-route",
          ["준비", "접촉", "코길", "울림"],
          ["앞혀 준비", "혀끝 닿음", "연구개 하강", "코로 울림"]
        ),
      },
      {
        id: "onset-digeut",
        letter: "ㄷ",
        place: "front",
        manner: "파열음",
        energy: "예사소리",
        cue: "혀끝이 앞쪽을 막았다가 짧게 열리며 작은 공기가 나옵니다.",
        contrast: "ㄴ과 같은 자리지만 코길이 닫히고, ㄹ보다 완전히 막습니다.",
        tags: ["혀끝 접촉", "구강 막힘", "짧은 파열", "약한 숨"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "모음에 맞춰 열림"),
          tongue: channel("front-place-palate-reference", "혀끝과 치조 부근"),
          air: channel("micro-air-front-release", "짧은 구강 방출"),
          throat: channel("glottis-open-breath-front", "큰 기식 없음"),
        },
        timeline: frameSet(
          "sequence-front-stop-release",
          ["준비", "접촉", "막힘", "방출"],
          ["앞혀 준비", "혀끝 닿음", "압력 형성", "짧게 열림"]
        ),
      },
      {
        id: "onset-rieul",
        letter: "ㄹ",
        place: "front",
        manner: "유음",
        energy: "울림 있음",
        cue: "혀끝이 앞쪽에 가볍게 닿거나 스치며, 공기가 완전히 막히지 않습니다.",
        contrast: "ㄴ처럼 코로 가지 않고, ㄷ처럼 세게 막아 터뜨리지 않습니다.",
        tags: ["가벼운 접촉", "스침", "옆 흐름", "울림"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "모음 모양 유지"),
          tongue: channel("front-tongue-raised-contact", "혀끝이 가볍게 접근"),
          air: channel("sequence-front-liquid-vibration-frame-04", "막힘보다 스침"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-front-liquid-vibration",
          ["준비", "접근", "가벼운 접촉", "울림"],
          ["앞혀 준비", "혀끝 접근", "짧게 스침", "울림 유지"]
        ),
      },
      {
        id: "onset-mieum",
        letter: "ㅁ",
        place: "lip",
        manner: "비음",
        energy: "울림 있음",
        cue: "두 입술을 닫고 연구개가 내려가 공기가 코로 빠집니다.",
        contrast: "ㅂ처럼 입술을 닫지만 터뜨리지 않고 코로 울립니다.",
        tags: ["입술 닫힘", "코길", "울림", "무파열"],
        channels: {
          lips: channel("front-closure-neutral", "두 입술 닫힘"),
          tongue: channel("base-neutral", "혀는 모음 준비 위치"),
          air: channel("nasal-route-blue", "비강 흐름"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-bilabial-nasal",
          ["준비", "닫힘", "코길", "울림"],
          ["입술 준비", "두 입술 닫힘", "연구개 하강", "코로 울림"]
        ),
      },
      {
        id: "onset-bieup",
        letter: "ㅂ",
        place: "lip",
        manner: "파열음",
        energy: "예사소리",
        cue: "두 입술을 닫았다가 큰 숨 없이 짧게 엽니다.",
        contrast: "ㅍ보다 숨이 작고, ㅁ처럼 코로 울리지 않습니다.",
        tags: ["입술 닫힘", "구강 압력", "작은 파열", "약한 숨"],
        channels: {
          lips: channel("front-closure-neutral", "두 입술이 닫힘"),
          tongue: channel("base-neutral", "혀는 모음 준비 위치"),
          air: channel("oral-front-air-arrow", "입술 앞 작은 방출"),
          throat: channel("glottis-open-breath-front", "기식 약함"),
        },
        timeline: frameSet(
          "sequence-bilabial-soft-stop",
          ["준비", "닫힘", "압력", "방출"],
          ["입술 준비", "두 입술 닫힘", "입안 압력", "작게 열림"]
        ),
      },
      {
        id: "onset-siot",
        letter: "ㅅ",
        place: "front",
        manner: "마찰음",
        energy: "마찰 숨",
        cue: "혀 앞쪽과 잇몸 사이를 좁혀 공기가 가늘게 스치게 합니다.",
        contrast: "ㄷ처럼 완전히 막지 않고, ㅈ처럼 먼저 막아 터뜨리지 않습니다.",
        tags: ["좁은 틈", "마찰", "앞혀", "지속 흐름"],
        channels: {
          lips: channel("mouth-front-smile-open", "입술은 살짝 벌어짐"),
          tongue: channel("front-tongue-raised-contact", "혀 앞쪽 접근"),
          air: channel("sequence-front-fricative-release-frame-04", "좁은 틈 통과"),
          throat: channel("glottis-open-breath-front", "울림보다 기류가 중심"),
        },
        timeline: frameSet(
          "sequence-front-fricative-release",
          ["준비", "좁힘", "마찰", "이동"],
          ["앞혀 준비", "틈 만들기", "가느다란 숨", "모음으로 이동"]
        ),
      },
      {
        id: "onset-ieung",
        letter: "ㅇ",
        place: "open",
        manner: "초성 없음",
        energy: "모음 시작",
        cue: "초성 자리에서는 입안 어딘가를 막지 않고 바로 모음 모양으로 갑니다.",
        contrast: "받침 ㅇ은 뒤혀가 닫혀 코로 울리지만, 초성 ㅇ은 소리가 없습니다.",
        tags: ["막힘 없음", "모음 시작", "열림", "무파열"],
        channels: {
          lips: channel("mouth-front-wide-open", "뒤따르는 모음 모양"),
          tongue: channel("zero-onset-open-vocal-tract", "혀와 입천장이 막지 않음"),
          air: channel("zero-onset-vowel-start", "막힘 없는 모음 흐름"),
          throat: channel("voice-channel-purple", "모음 울림 시작"),
        },
        timeline: [
          step("zero-onset-open-vocal-tract", "준비", "막힘 없는 성도"),
          step("zero-onset-open-vocal-tract", "열림", "혀·입술 폐쇄 없음"),
          step("zero-onset-vowel-start", "흐름", "구강 통과"),
          step("voice-channel-purple", "모음", "울림 시작"),
        ],
      },
      {
        id: "onset-jieut",
        letter: "ㅈ",
        place: "palatal",
        manner: "파찰음",
        energy: "예사소리",
        cue: "앞쪽을 잠깐 막은 뒤 좁은 틈으로 스치며 짧게 나옵니다.",
        contrast: "ㅅ보다 먼저 막힘이 있고, ㅊ보다 숨이 약합니다.",
        tags: ["막힘", "좁은 틈", "파찰", "약한 숨"],
        channels: {
          lips: channel("mouth-front-smile-open", "입술은 자연스럽게 벌어짐"),
          tongue: channel("place-front-tongue-broad-contact", "혀 앞쪽이 경구개 쪽"),
          air: channel("sequence-palatal-affricate-soft-frame-04", "짧은 파찰 흐름"),
          throat: channel("glottis-open-breath-front", "강한 기식 없음"),
        },
        timeline: frameSet(
          "sequence-palatal-affricate-soft",
          ["준비", "막힘", "틈", "파찰"],
          ["앞쪽 준비", "짧게 닫힘", "틈으로 전환", "스치며 방출"]
        ),
      },
      {
        id: "onset-chieut",
        letter: "ㅊ",
        place: "palatal",
        manner: "파찰음",
        energy: "거센소리",
        cue: "ㅈ과 같은 앞쪽 위치에서 시작하지만, 더 큰 숨이 함께 터집니다.",
        contrast: "ㅈ과 같은 자리, 다른 점은 강한 기식입니다.",
        tags: ["막힘", "파찰", "강한 숨", "기식"],
        channels: {
          lips: channel("mouth-front-wide-open", "뒤 모음 쪽으로 크게 열림"),
          tongue: channel("place-front-tongue-broad-contact", "혀 앞쪽이 올라감"),
          air: channel("sequence-palatal-affricate-strong-frame-04", "강한 파찰 방출"),
          throat: channel("glottis-open-breath-front", "성문이 넓게 열림"),
        },
        timeline: frameSet(
          "sequence-palatal-affricate-strong",
          ["준비", "막힘", "틈", "큰 숨"],
          ["앞쪽 준비", "짧게 닫힘", "틈으로 전환", "강하게 방출"]
        ),
      },
      {
        id: "onset-kieuk",
        letter: "ㅋ",
        place: "back",
        manner: "파열음",
        energy: "거센소리",
        cue: "ㄱ과 같은 뒤혀 위치에서 막고, 성문이 넓게 열려 큰 숨이 나옵니다.",
        contrast: "ㄱ과 같은 자리, 다른 점은 강한 기식입니다.",
        tags: ["뒤혀", "연구개", "강한 숨", "파열"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "모음 모양으로 이동"),
          tongue: channel("place-velar-contact-clean", "뒤혀가 연구개 접촉"),
          air: channel("sequence-velar-aspirated-stop-frame-04", "큰 파열 방출"),
          throat: channel("glottis-open-breath-front", "성문 넓게 열림"),
        },
        timeline: frameSet(
          "sequence-velar-aspirated-stop",
          ["준비", "막힘", "압력", "큰 숨"],
          ["혀 낮게 시작", "뒤혀 닫힘", "압력 형성", "강한 기식"]
        ),
      },
      {
        id: "onset-tieut",
        letter: "ㅌ",
        place: "front",
        manner: "파열음",
        energy: "거센소리",
        cue: "ㄷ과 같은 앞혀 위치에서 막고, 더 큰 숨을 내며 엽니다.",
        contrast: "ㄷ과 같은 자리, 다른 점은 강한 기식입니다.",
        tags: ["앞혀", "막힘", "강한 숨", "파열"],
        channels: {
          lips: channel("mouth-front-wide-open", "모음 쪽으로 크게 열림"),
          tongue: channel("front-contact-close-highlight", "혀끝이 앞쪽 접촉"),
          air: channel("airflow-card-strong", "강한 구강 방출"),
          throat: channel("glottis-open-breath-front", "성문 넓게 열림"),
        },
        timeline: [
          step("front-place-palate-reference", "준비", "앞혀 준비"),
          step("front-contact-close-highlight", "막힘", "혀끝 접촉"),
          step("place-front-contact-burst-highlight", "열림", "접촉 해제"),
          step("airflow-card-strong", "큰 숨", "강하게 방출"),
        ],
      },
      {
        id: "onset-pieup",
        letter: "ㅍ",
        place: "lip",
        manner: "파열음",
        energy: "거센소리",
        cue: "ㅂ과 같은 입술 위치에서 막고, 더 큰 숨을 내며 엽니다.",
        contrast: "ㅂ과 같은 자리, 다른 점은 강한 기식입니다.",
        tags: ["입술 닫힘", "파열", "강한 숨", "기식"],
        channels: {
          lips: channel("front-closure-neutral", "두 입술 닫힘"),
          tongue: channel("base-neutral", "혀는 모음 준비 위치"),
          air: channel("airflow-card-strong", "입술 앞 강한 방출"),
          throat: channel("glottis-open-breath-front", "성문 넓게 열림"),
        },
        timeline: frameSet(
          "sequence-bilabial-aspirated-stop",
          ["준비", "닫힘", "압력", "큰 숨"],
          ["입술 준비", "두 입술 닫힘", "압력 형성", "강하게 열림"]
        ),
      },
      {
        id: "onset-hieut",
        letter: "ㅎ",
        place: "throat",
        manner: "마찰음",
        energy: "거친 숨",
        cue: "목 안쪽 성문에서 숨이 먼저 스치고, 뒤따르는 모음 입모양으로 갑니다.",
        contrast: "혀나 입술을 막지 않고 목에서 시작하는 숨이 핵심입니다.",
        tags: ["성문", "숨", "마찰", "모음 이동"],
        channels: {
          lips: channel("mouth-front-wide-open", "뒤 모음 모양"),
          tongue: channel("tongue-b-rest-side", "혀는 막지 않음"),
          air: channel("larynx-to-oral-airflow-route", "목에서 입으로 흐름"),
          throat: channel("glottis-open-breath-front", "성문에서 숨 시작"),
        },
        timeline: frameSet(
          "sequence-larynx-to-oral-route",
          ["목", "시작", "통과", "모음"],
          ["성문 준비", "숨 시작", "구강 통과", "모음으로 이동"]
        ),
      },
    ],
    tense: [
      {
        id: "tense-ssanggiyeok",
        letter: "ㄲ",
        place: "back",
        manner: "파열음",
        energy: "된소리",
        cue: "ㄱ과 같은 뒤혀 위치에서 더 단단히 닫고, 큰 숨 없이 짧게 엽니다.",
        contrast: "ㅋ처럼 숨을 크게 내지 않고, 닫힘의 긴장이 강합니다.",
        tags: ["뒤혀", "긴장", "공기 억제", "짧은 방출"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "모음 모양 준비"),
          tongue: channel("place-velar-contact-clean", "뒤혀 접촉이 단단함"),
          air: channel("sequence-velar-tense-stop-frame-04", "짧고 억제된 방출"),
          throat: channel("sequence-velar-tense-stop-frame-03", "성문 긴장"),
        },
        timeline: frameSet(
          "sequence-velar-tense-stop",
          ["준비", "닫힘", "긴장", "짧게"],
          ["뒤혀 긴장", "단단히 막음", "성문 힘", "공기 억제"]
        ),
      },
      {
        id: "tense-ssangdigeut",
        letter: "ㄸ",
        place: "front",
        manner: "파열음",
        energy: "된소리",
        cue: "ㄷ과 같은 앞혀 위치에서 더 강하게 닫고, 숨을 크게 내지 않습니다.",
        contrast: "ㅌ처럼 큰 숨이 아니라, 앞쪽 닫힘의 힘이 핵심입니다.",
        tags: ["앞혀", "긴장", "짧은 닫힘", "공기 억제"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "모음 모양 준비"),
          tongue: channel("front-contact-close-highlight", "혀끝 접촉이 단단함"),
          air: channel("airflow-contact-short", "공기 방출 작음"),
          throat: channel("glottis-vibration-and-tension", "성문 긴장"),
        },
        timeline: [
          step("front-place-palate-reference", "준비", "앞혀 준비"),
          step("front-contact-close-highlight", "닫힘", "단단한 접촉"),
          step("glottis-vibration-and-tension", "긴장", "목 힘"),
          step("airflow-contact-short", "짧게", "작게 열림"),
        ],
      },
      {
        id: "tense-ssangbieup",
        letter: "ㅃ",
        place: "lip",
        manner: "파열음",
        energy: "된소리",
        cue: "ㅂ과 같은 입술 위치에서 더 단단히 닫고, 숨을 크게 내지 않습니다.",
        contrast: "ㅍ처럼 큰 숨을 터뜨리지 않고, 입술 닫힘의 힘이 큽니다.",
        tags: ["입술", "긴장", "공기 억제", "짧은 방출"],
        channels: {
          lips: channel("mouth-bilabial-tense-closure", "입술 닫힘이 단단함"),
          tongue: channel("base-neutral", "혀는 모음 준비 위치"),
          air: channel("oral-front-air-arrow", "짧고 작은 방출"),
          throat: channel("glottis-vibration-and-tension", "성문 긴장"),
        },
        timeline: [
          step("mouth-open-close-reference-pair", "준비", "입술 준비"),
          step("mouth-bilabial-tense-closure", "닫힘", "두 입술 힘"),
          step("glottis-vibration-and-tension", "긴장", "목 힘"),
          step("airflow-contact-short", "짧게", "공기 억제"),
        ],
      },
      {
        id: "tense-ssangsiot",
        letter: "ㅆ",
        place: "front",
        manner: "마찰음",
        energy: "된소리",
        cue: "ㅅ과 같은 좁은 통로를 더 단단히 만들고, 공기를 얇고 세게 유지합니다.",
        contrast: "ㅅ보다 통로가 더 팽팽하고 긴장된 마찰입니다.",
        tags: ["좁은 틈", "긴장", "마찰", "공기 억제"],
        channels: {
          lips: channel("mouth-front-smile-open", "입술 살짝 벌림"),
          tongue: channel("sequence-front-tense-fricative-frame-02", "앞혀가 더 팽팽함"),
          air: channel("sequence-front-tense-fricative-frame-04", "가느다란 마찰 흐름"),
          throat: channel("sequence-front-tense-fricative-frame-03", "성문 긴장"),
        },
        timeline: frameSet(
          "sequence-front-tense-fricative",
          ["준비", "좁힘", "긴장", "마찰"],
          ["입술 벌림", "앞혀 통로", "힘 유지", "얇게 지속"]
        ),
      },
      {
        id: "tense-ssangjieut",
        letter: "ㅉ",
        place: "palatal",
        manner: "파찰음",
        energy: "된소리",
        cue: "ㅈ과 같은 앞쪽 위치에서 더 단단히 닫고, 큰 숨 없이 짧게 파찰됩니다.",
        contrast: "ㅊ처럼 큰 숨이 아니라, 짧고 긴장된 막힘과 파찰입니다.",
        tags: ["경구개", "긴장", "파찰", "짧은 방출"],
        channels: {
          lips: channel("mouth-front-smile-open", "입술 자연 벌림"),
          tongue: channel("sequence-palatal-tense-affricate-frame-02", "앞쪽 접촉이 단단함"),
          air: channel("sequence-palatal-tense-affricate-frame-04", "짧은 방출"),
          throat: channel("sequence-palatal-tense-affricate-frame-03", "성문 긴장"),
        },
        timeline: frameSet(
          "sequence-palatal-tense-affricate",
          ["준비", "닫힘", "긴장", "짧게"],
          ["혀 앞쪽 상승", "단단히 막음", "목 힘", "파찰 방출"]
        ),
      },
    ],
    coda: [
      {
        id: "coda-giyeok",
        letter: "ㄱ",
        place: "back",
        manner: "불파 파열음",
        energy: "받침 닫힘",
        cue: "혀 뒤쪽이 연구개에 닿은 채로 끝나며, 초성처럼 터뜨리지 않습니다.",
        contrast: "ㅋ, ㄲ 받침도 실제 끝소리는 ㄱ 닫힘으로 정리됩니다.",
        tags: ["뒤혀", "연구개", "닫고 끝", "무방출"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "앞 모음 뒤 자연 닫힘"),
          tongue: channel("place-velar-contact-clean", "뒤혀가 닫힘"),
          air: channel("closure-held-final", "방출하지 않음"),
          throat: channel("voice-channel-purple", "앞 모음 울림 뒤 닫힘"),
        },
        timeline: frameSet(
          "sequence-velar-coda-stop",
          ["모음", "접근", "닫힘", "끝"],
          ["열린 상태", "뒤혀 상승", "연구개 접촉", "터뜨리지 않음"]
        ),
      },
      {
        id: "coda-nieun",
        letter: "ㄴ",
        place: "front",
        manner: "비음",
        energy: "받침 울림",
        cue: "혀끝이 앞쪽에 닿고, 연구개가 내려가 코로 울리며 끝납니다.",
        contrast: "ㄷ 받침과 같은 앞쪽 닫힘이지만 코길이 열립니다.",
        tags: ["혀끝", "코길", "울림", "무방출"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "입술은 모음 뒤 안정"),
          tongue: channel("front-contact-close-highlight", "혀끝 닫힘"),
          air: channel("nasal-route-blue", "비강 흐름"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-front-nasal-voice-route",
          ["모음", "접촉", "코길", "끝"],
          ["앞혀 접근", "혀끝 닫힘", "코로 이동", "울리며 끝"]
        ),
      },
      {
        id: "coda-digeut",
        letter: "ㄷ",
        place: "front",
        manner: "불파 파열음",
        energy: "받침 닫힘",
        cue: "혀끝이 앞쪽을 닫은 채로 끝나며, 터지는 공기가 거의 없습니다.",
        contrast: "ㅅ, ㅆ, ㅈ, ㅊ, ㅌ, ㅎ 받침도 끝소리는 ㄷ 닫힘으로 정리됩니다.",
        tags: ["앞혀", "닫고 끝", "무방출", "대표 받침"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "앞 모음 뒤 안정"),
          tongue: channel("front-contact-close-highlight", "혀끝 닫힘"),
          air: channel("closure-held-final", "방출 없음"),
          throat: channel("voice-channel-purple", "앞 모음 뒤 닫힘"),
        },
        timeline: frameSet(
          "sequence-front-coda-stop",
          ["모음", "접근", "닫힘", "끝"],
          ["앞혀 준비", "혀끝 상승", "치조 접촉", "터뜨리지 않음"]
        ),
      },
      {
        id: "coda-rieul",
        letter: "ㄹ",
        place: "front",
        manner: "유음",
        energy: "받침 울림",
        cue: "혀끝이 앞쪽에 닿고, 공기가 옆으로 빠지며 울림이 남습니다.",
        contrast: "ㄷ처럼 닫지만 압력을 터뜨리지 않고 울림이 이어집니다.",
        tags: ["혀끝", "옆 흐름", "울림", "무파열"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "입술은 모음 뒤 안정"),
          tongue: channel("front-tongue-raised-contact", "혀끝 접촉"),
          air: channel("sequence-front-liquid-vibration-frame-04", "옆으로 흐름"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-front-liquid-vibration",
          ["모음", "접근", "접촉", "울림"],
          ["혀끝 준비", "앞쪽 접근", "가볍게 닿음", "옆으로 울림"]
        ),
      },
      {
        id: "coda-mieum",
        letter: "ㅁ",
        place: "lip",
        manner: "비음",
        energy: "받침 울림",
        cue: "두 입술을 닫고 코로 울리며 끝납니다.",
        contrast: "ㅂ 받침과 같은 입술 닫힘이지만 코길이 열립니다.",
        tags: ["입술", "코길", "울림", "무방출"],
        channels: {
          lips: channel("front-closure-neutral", "두 입술 닫힘"),
          tongue: channel("base-neutral", "혀는 모음 뒤 안정"),
          air: channel("nasal-route-blue", "비강 흐름"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-bilabial-nasal",
          ["모음", "입술", "코길", "끝"],
          ["열린 상태", "두 입술 닫힘", "코로 이동", "울리며 끝"]
        ),
      },
      {
        id: "coda-bieup",
        letter: "ㅂ",
        place: "lip",
        manner: "불파 파열음",
        energy: "받침 닫힘",
        cue: "두 입술이 닫힌 채로 끝나며, 초성 ㅂ처럼 터뜨리지 않습니다.",
        contrast: "ㅍ 받침도 실제 끝소리는 ㅂ 닫힘으로 정리됩니다.",
        tags: ["입술", "닫고 끝", "무방출", "대표 받침"],
        channels: {
          lips: channel("sequence-bilabial-coda-stop-frame-03", "두 입술 닫힘"),
          tongue: channel("base-neutral", "혀는 모음 뒤 안정"),
          air: channel("closure-held-final", "방출 없음"),
          throat: channel("voice-channel-purple", "앞 모음 뒤 닫힘"),
        },
        timeline: frameSet(
          "sequence-bilabial-coda-stop",
          ["모음", "접근", "닫힘", "끝"],
          ["입 벌림", "입술 가까움", "두 입술 접촉", "터뜨리지 않음"]
        ),
      },
      {
        id: "coda-ieung",
        letter: "ㅇ",
        place: "back",
        manner: "비음",
        energy: "받침 울림",
        cue: "혀 뒤쪽이 연구개에 닿고, 연구개가 내려가 코로 울리며 끝납니다.",
        contrast: "초성 ㅇ과 달리 받침 ㅇ은 실제 뒤혀 닫힘과 코울림이 있습니다.",
        tags: ["뒤혀", "연구개", "코길", "울림"],
        channels: {
          lips: channel("mouth-open-close-reference-pair", "입술은 모음 뒤 안정"),
          tongue: channel("sequence-velar-nasal-coda-frame-02", "뒤혀 닫힘"),
          air: channel("sequence-velar-nasal-coda-frame-04", "비강 흐름"),
          throat: channel("voice-channel-purple", "울림 유지"),
        },
        timeline: frameSet(
          "sequence-velar-nasal-coda",
          ["모음", "뒤혀", "코길", "끝"],
          ["열린 상태", "뒤혀 접근", "연구개 하강", "코로 울림"]
        ),
      },
    ],
  };

  const placeOrder = ["lip", "front", "palatal", "back", "throat", "open"];

  const state = {
    assets: new Map(),
    selectedId: "onset-giyeok",
    filter: "all",
    mode: "onset",
    lastFocus: null,
  };

  const els = {
    focusPanel: document.querySelector(".focus-panel"),
    letterGrid: document.getElementById("letterGrid"),
    filterButtons: Array.from(document.querySelectorAll(".mode-button")),
    viewButtons: Array.from(document.querySelectorAll(".view-button")),
    focusLetter: document.getElementById("focusLetter"),
    focusFamily: document.getElementById("focusFamily"),
    focusName: document.getElementById("focusName"),
    focusCue: document.getElementById("focusCue"),
    visualBoard: document.getElementById("visualBoard"),
    channelGrid: document.getElementById("channelGrid"),
    cueStrip: document.getElementById("cueStrip"),
    placeValue: document.getElementById("placeValue"),
    mannerValue: document.getElementById("mannerValue"),
    energyValue: document.getElementById("energyValue"),
    contrastValue: document.getElementById("contrastValue"),
    tagCloud: document.getElementById("tagCloud"),
    familyGrid: document.getElementById("familyGrid"),
    imageLightbox: document.getElementById("imageLightbox"),
    lightboxBackdrop: document.getElementById("lightboxBackdrop"),
    lightboxClose: document.getElementById("lightboxClose"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxCaption: document.getElementById("lightboxCaption"),
  };

  function activeItems() {
    return inventories[state.mode];
  }

  function assetUrl(assetId) {
    const asset = state.assets.get(assetId);
    return asset ? ASSET_BASE + asset.file : "";
  }

  function selectedItem() {
    return activeItems().find((item) => item.id === state.selectedId) || activeItems()[0];
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function cueImage(assetId, alt) {
    const asset = state.assets.get(assetId);
    if (!asset) return "";
    const url = ASSET_BASE + asset.file;
    const safeUrl = escapeHtml(url);
    const safeAlt = escapeHtml(alt);
    const safeId = escapeHtml(assetId);
    const className = asset.role === "frame" ? "cue-image-button is-frame-cue" : "cue-image-button";
    return `
      <button class="${className}" type="button" data-image-id="${safeId}" data-image-src="${safeUrl}" data-image-alt="${safeAlt}" aria-label="${safeAlt} 크게 보기">
        <img src="${safeUrl}" alt="${safeAlt}">
      </button>
    `;
  }

  function markImageOrientation(image) {
    const button = image.closest(".cue-image-button");
    if (!button || !image.naturalWidth) return;
    button.classList.toggle("is-portrait-source", image.naturalHeight / image.naturalWidth > 1.22);
  }

  function prepareCueImages() {
    els.focusPanel.querySelectorAll(".cue-image-button img").forEach((image) => {
      if (image.complete) {
        markImageOrientation(image);
      } else {
        image.addEventListener("load", () => markImageOrientation(image), { once: true });
      }
    });
  }

  function openImageLightbox(button) {
    state.lastFocus = document.activeElement;
    const alt = button.dataset.imageAlt || "";
    els.lightboxImage.src = button.dataset.imageSrc;
    els.lightboxImage.alt = alt;
    els.lightboxCaption.textContent = alt;
    els.imageLightbox.hidden = false;
    document.body.classList.add("has-lightbox");
    els.lightboxClose.focus();
  }

  function closeImageLightbox() {
    if (els.imageLightbox.hidden) return;
    els.imageLightbox.hidden = true;
    document.body.classList.remove("has-lightbox");
    els.lightboxImage.removeAttribute("src");
    els.lightboxImage.alt = "";
    els.lightboxCaption.textContent = "";
    if (state.lastFocus && typeof state.lastFocus.focus === "function") {
      state.lastFocus.focus();
    }
    state.lastFocus = null;
  }

  function renderLetters() {
    els.letterGrid.innerHTML = "";
    activeItems().forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "letter-button";
      button.dataset.id = item.id;
      button.dataset.place = item.place;
      button.classList.toggle("is-selected", item.id === state.selectedId);
      button.classList.toggle("is-hidden", state.filter !== "all" && item.place !== state.filter);
      button.innerHTML = `
        <span class="letter-symbol">${item.letter}</span>
        <span class="letter-meta">
          <strong>${item.manner}</strong>
          <span>${placeLabels[item.place]} · ${item.energy}</span>
        </span>
      `;
      button.addEventListener("click", () => {
        state.selectedId = item.id;
        renderAll();
      });
      els.letterGrid.appendChild(button);
    });
  }

  function renderFocus() {
    const item = selectedItem();
    els.focusLetter.textContent = item.letter;
    els.focusFamily.textContent = `${modeLabels[state.mode]} · ${placeLabels[item.place]}`;
    els.focusName.textContent = `${item.letter} · ${item.manner}`;
    els.focusCue.textContent = item.cue;
    els.placeValue.textContent = placeLabels[item.place];
    els.mannerValue.textContent = item.manner;
    els.energyValue.textContent = item.energy;
    els.contrastValue.textContent = item.contrast;

    els.visualBoard.innerHTML = item.timeline
      .map((entry, index) => `
        <section class="motion-frame">
          ${cueImage(entry.asset, `${item.letter} ${entry.label}`)}
          <div>
            <strong>${index + 1}. ${entry.label}</strong>
            <span>${entry.note}</span>
          </div>
        </section>
      `)
      .join("");

    els.channelGrid.innerHTML = Object.entries(channelLabels)
      .map(([key, label]) => {
        const channelData = item.channels[key];
        return `
          <section class="channel-card">
            <strong>${label}</strong>
            ${cueImage(channelData.asset, `${item.letter} ${label}`)}
            <span>${channelData.state}</span>
          </section>
        `;
      })
      .join("");

    els.cueStrip.innerHTML = item.timeline
      .map((entry) => `
        <section class="step-card">
          ${cueImage(entry.asset, `${item.letter} ${entry.label}`)}
          <div>
            <strong>${entry.label}</strong>
            <span>${entry.note}</span>
          </div>
        </section>
      `)
      .join("");

    prepareCueImages();
    els.tagCloud.innerHTML = item.tags.map((tag) => `<span class="tag-chip">${tag}</span>`).join("");
  }

  function renderFilters() {
    els.viewButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === state.mode);
    });
    els.filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === state.filter);
    });
  }

  function renderFamilies() {
    const items = activeItems();
    els.familyGrid.innerHTML = "";
    placeOrder
      .filter((place) => items.some((item) => item.place === place))
      .forEach((place) => {
        const groupItems = items.filter((item) => item.place === place);
        const card = document.createElement("section");
        card.className = "family-card";
        card.innerHTML = `
          <strong>${placeLabels[place]}</strong>
          <span>${familyDetails[place]}</span>
          <div class="family-letters"></div>
        `;
        const letters = card.querySelector(".family-letters");
        groupItems.forEach((item) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "family-letter";
          button.classList.toggle("is-active", item.id === state.selectedId);
          button.textContent = item.letter;
          button.addEventListener("click", () => {
            state.selectedId = item.id;
            state.filter = "all";
            renderAll();
          });
          letters.appendChild(button);
        });
        els.familyGrid.appendChild(card);
      });
  }

  function bindEvents() {
    els.focusPanel.addEventListener("click", (event) => {
      const button = event.target.closest(".cue-image-button");
      if (button && els.focusPanel.contains(button)) {
        openImageLightbox(button);
      }
    });

    els.lightboxBackdrop.addEventListener("click", closeImageLightbox);
    els.lightboxClose.addEventListener("click", closeImageLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeImageLightbox();
      }
    });

    els.viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        state.filter = "all";
        state.selectedId = activeItems()[0].id;
        renderAll();
      });
    });

    els.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        const selected = selectedItem();
        if (state.filter !== "all" && selected.place !== state.filter) {
          const firstMatch = activeItems().find((item) => item.place === state.filter);
          if (firstMatch) state.selectedId = firstMatch.id;
        }
        renderAll();
      });
    });
  }

  function renderAll() {
    renderFilters();
    renderLetters();
    renderFocus();
    renderFamilies();
  }

  async function loadAssetManifest() {
    if (window.ARTICULATION_ASSET_MANIFEST) {
      return window.ARTICULATION_ASSET_MANIFEST;
    }

    const response = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load articulation manifest: ${response.status}`);
    }
    return response.json();
  }

  async function init() {
    const manifest = await loadAssetManifest();
    state.assets = new Map(manifest.assets.map((asset) => [asset.id, asset]));
    bindEvents();
    renderAll();
  }

  init().catch(() => {
    els.visualBoard.innerHTML = '<div class="motion-frame"><strong>에셋 로드 실패</strong></div>';
  });
})();
