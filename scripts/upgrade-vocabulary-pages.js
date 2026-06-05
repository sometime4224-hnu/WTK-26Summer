const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = process.cwd();
const templatePath = path.join(root, "표준안 제작", "templates", "vocabulary.html");
const template = fs.readFileSync(templatePath, "utf8");

const languageMap = {
  english: "en",
  vietnamese: "vi",
  japanese: "ja",
  chinese: "zh"
};

const c12ImageFilesByWord = {
  "살이 찌다/빠지다": "s06_tl_n01.webp",
  "힘이 세다/약하다": "s06_tr_n02.webp",
  "자세가 좋다/나쁘다": "s06_bl_n03.webp",
  "몸이 무겁다/가볍다": "s06_br_n04.webp",
  "숨이 차다": "s05_tl_n05.webp",
  "땀이 나다": "s05_tr_n06.webp",
  "쥐가 나다": "s05_bl_n07.webp",
  "지치다": "s05_br_n08.webp",
  "기분이 상쾌하다": "s04_tl_n09.webp",
  "기운이 나다": "s04_tr_n10.webp",
  "몸이 좋아지다": "s04_bl_n11.webp",
  "근육이 생기다": "s04_br_n12.webp",
  "(목을) 돌리다": "s03_tl_n13.webp",
  "(옆구리를) 굽히다": "s03_tr_n14.webp",
  "(가슴을) 펴다": "s03_bl_n15.webp",
  "(몸을) 젖히다": "s03_br_n16.webp",
  "(손을 허리에) 대다": "s01_tl_n17.webp",
  "(팔을) 뻗다": "s01_tr_n18.webp",
  "(다리를) 벌리다": "s01_bl_n19.webp",
  "(발뒤꿈치를) 들다": "s01_br_n20.webp"
};

const lessonMeta = {
  10: {
    topic: "첫 만남부터 고백까지",
    subtitle: "첫 만남과 연애 표현을 익힙니다."
  },
  11: {
    topic: "일과 직장 생활",
    subtitle: "일과 직장 생활에 필요한 어휘를 익힙니다."
  },
  12: {
    topic: "몸 상태와 운동",
    subtitle: "몸 상태와 운동 동작 표현을 익힙니다.",
    categories: [
      { id: "body", label: "몸 변화", from: 1, to: 4 },
      { id: "condition", label: "피로·회복", from: 5, to: 12 },
      { id: "movement", label: "스트레칭 동작", from: 13, to: 20 }
    ]
  },
  13: {
    topic: "모임과 옷차림",
    subtitle: "모임 준비와 옷차림 표현을 익힙니다.",
    categories: [
      { id: "event", label: "모임", from: 1, to: 5 },
      { id: "prep", label: "준비·대접", from: 6, to: 13 },
      { id: "clothes", label: "옷차림", from: 14, to: 20 }
    ]
  },
  14: {
    topic: "도시와 시골",
    subtitle: "도시와 시골 생활, 자연과 변화 표현을 익힙니다.",
    categories: [
      { id: "environment", label: "생활 환경", from: 1, to: 10 },
      { id: "nature", label: "자연·농촌", from: 11, to: 16 },
      { id: "care", label: "가꾸기·동작", from: 17, to: 24 },
      { id: "change", label: "변화·상상", from: 25, to: 28 }
    ]
  },
  15: {
    topic: "주거 생활",
    subtitle: "주거 문제, 계약, 생활비 표현을 익힙니다.",
    categories: [
      { id: "problem", label: "주거 문제", from: 1, to: 8 },
      { id: "contract", label: "계약·공과금", from: 9, to: 16 },
      { id: "money", label: "수입·지출", from: 17, to: 25 }
    ]
  },
  16: {
    topic: "가야금이 사람 키만 해요",
    subtitle: "감정, 악기, 모양과 감촉 표현을 익힙니다.",
    categories: [
      { id: "feeling", label: "감정·기분", from: 1, to: 6 },
      { id: "instrument", label: "악기", from: 7, to: 11 },
      { id: "play", label: "연주 동작", from: 12, to: 16 },
      { id: "shape", label: "모양", from: 17, to: 20 },
      { id: "texture", label: "성질·감촉", from: 21, to: 28 }
    ]
  },
  17: {
    topic: "두 사람이 연인 사이래요?",
    subtitle: "소문, 가능성, 태도, 오해와 화해 표현을 익힙니다."
  },
  18: {
    topic: "거울이 깨지고 말았어요",
    subtitle: "연극과 사건, 몸짓 표현을 익힙니다."
  }
};

function readLesson(lesson) {
  return fs.readFileSync(path.join(root, `c${lesson}`, "vocabulary.html"), "utf8");
}

function writeLesson(lesson, html) {
  fs.writeFileSync(path.join(root, `c${lesson}`, "vocabulary.html"), html, "utf8");
}

function extractAssignedExpression(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const equalIndex = source.indexOf("=", markerIndex);
  let start = equalIndex + 1;
  while (/\s/.test(source[start])) start += 1;

  const opening = source[start];
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : null;
  if (!closing) {
    throw new Error(`Expected object or array after ${marker}`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === opening) depth += 1;
    if (char === closing) depth -= 1;
    if (depth === 0) return source.slice(start, i + 1);
  }

  throw new Error(`Could not parse expression after ${marker}`);
}

function extractStringConst(source, name) {
  const match = source.match(new RegExp(`const\\s+${name}\\s*=\\s*([\"'])(.*?)\\1`));
  if (!match) return null;
  return match[2];
}

function evaluateExpression(expression, context = {}) {
  return vm.runInNewContext(`(${expression})`, context);
}

function existingConfig(source) {
  if (!source.includes("window.VOCABULARY_CONFIG =")) return null;
  return evaluateExpression(extractAssignedExpression(source, "window.VOCABULARY_CONFIG ="));
}

function categoriesFromRanges(ranges) {
  return [
    { id: "all", label: "전체" },
    ...ranges.map(({ id, label }) => ({ id, label }))
  ];
}

function categoryForIndex(index, ranges) {
  const found = ranges.find((range) => index >= range.from && index <= range.to);
  return found?.id || ranges[0]?.id || "all";
}

function pathExistsFromLesson(lesson, relativePath) {
  if (!relativePath) return false;
  return fs.existsSync(path.resolve(root, `c${lesson}`, relativePath));
}

function safeImage(lesson, relativePath) {
  return pathExistsFromLesson(lesson, relativePath) ? relativePath : null;
}

function maskedFromFull(lesson, imagePath) {
  if (!imagePath) return null;
  const candidates = [
    imagePath.replace("/full/", "/masked/"),
    imagePath.replace("/full-female/", "/masked-female/"),
    imagePath.replace("/full-male/", "/masked-male/")
  ];
  return candidates.find((candidate) => pathExistsFromLesson(lesson, candidate)) || null;
}

function c12ImageMap() {
  const base = "../assets/c12/vocabulary/images/split-variants";
  return Object.fromEntries(
    Object.entries(c12ImageFilesByWord).map(([word, file]) => [word, `${base}/full/${file}`])
  );
}

function applyC12Images(config) {
  const imageMap = c12ImageMap();
  return {
    ...config,
    words: config.words.map((word) => {
      const image = safeImage(12, imageMap[word.ko] || null);
      return {
        ...word,
        image,
        imageAlt: image ? `${word.ko} 그림 카드` : word.imageAlt || "",
        quizImage: maskedFromFull(12, image),
        quizImageAlt: image ? `${word.ko} 그림 카드` : word.quizImageAlt || ""
      };
    })
  };
}

function posFor(word) {
  const text = String(word || "");
  if (/[()\/\s]/.test(text)) return "표현";
  if (text.endsWith("하다") || text.endsWith("되다") || text.endsWith("나다") || text.endsWith("다")) return "표현";
  return "명사";
}

function buildWordsFromAllVocabulary(lesson, allVocabulary, ranges, imageMap = {}) {
  const korean = allVocabulary.korean.data;
  const langKeys = Object.keys(allVocabulary).filter((key) => key !== "korean" && languageMap[key]);
  return korean.map((item, index) => {
    const ko = item.korean;
    const image = safeImage(lesson, imageMap[ko] || null);
    const word = {
      id: `c${lesson}-vocab-${String(index + 1).padStart(2, "0")}`,
      ko,
      meaning: item.foreign || "",
      pos: posFor(ko),
      category: categoryForIndex(index + 1, ranges),
      example: item.example || "",
      image,
      imageAlt: image ? `${ko} 그림 카드` : "",
      quizImage: maskedFromFull(lesson, image),
      quizImageAlt: image ? `${ko} 그림 카드` : ""
    };

    for (const key of langKeys) {
      const lang = languageMap[key];
      word[lang] = allVocabulary[key].data[index]?.foreign || "";
    }

    return word;
  });
}

function buildConfig(lesson, categories, words, languages) {
  const meta = lessonMeta[lesson];
  return {
    chapter: String(lesson),
    title: `${lesson}과 어휘 학습`,
    subtitle: meta.subtitle,
    languages,
    defaultLang: "none",
    quizModes: ["meaning", "choseong", "image"],
    storageKey: `c${lesson}-vocabulary-standard`,
    categories,
    words
  };
}

function extractImageMap(lesson, source) {
  const baseName = `c${lesson}ImageBasePath`;
  const base = extractStringConst(source, baseName);
  if (!base) return {};

  const marker = source.includes("const koreanCardImageMap")
    ? "const koreanCardImageMap"
    : "const koreanDefaultCardImageMap";
  const mapExpression = extractAssignedExpression(source, marker);
  return evaluateExpression(mapExpression, { [baseName]: base });
}

function configFromC10() {
  const lesson = 10;
  const source = readLesson(lesson);
  const existing = existingConfig(source);
  if (existing) return { ...existing, storageKey: "c10-vocabulary-standard" };

  const categories = evaluateExpression(extractAssignedExpression(source, "const categories"));
  const words = evaluateExpression(extractAssignedExpression(source, "const words")).map((item, index) => ({
    id: `c10-vocab-${String(index + 1).padStart(2, "0")}`,
    ko: item.ko,
    meaning: item.meaning || "",
    pos: posFor(item.ko),
    category: item.category || "all",
    example: item.example || "",
    vi: item.vi || "",
    ja: item.ja || "",
    zh: item.zh || "",
    image: safeImage(lesson, item.image),
    imageAlt: `${item.ko} 그림 카드`,
    quizImage: null,
    quizImageAlt: ""
  }));
  return buildConfig(lesson, categories, words, ["vi", "ja", "zh"]);
}

function configFromC11() {
  const source = readLesson(11);
  const config = evaluateExpression(extractAssignedExpression(source, "window.VOCABULARY_CONFIG ="));
  return {
    ...config,
    title: "11과 어휘 학습",
    subtitle: lessonMeta[11].subtitle,
    storageKey: "c11-vocabulary-standard"
  };
}

function configFromAllVocabularyLesson(lesson) {
  const source = readLesson(lesson);
  const existing = existingConfig(source);
  if (existing) {
    const config = { ...existing, storageKey: `c${lesson}-vocabulary-standard` };
    return lesson === 12 ? applyC12Images(config) : config;
  }

  const allVocabulary = evaluateExpression(extractAssignedExpression(source, "const allVocabulary"));
  const meta = lessonMeta[lesson];
  const categories = categoriesFromRanges(meta.categories);
  const imageMap = lesson === 12 ? c12ImageMap() : extractImageMap(lesson, source);
  const words = buildWordsFromAllVocabulary(lesson, allVocabulary, meta.categories, imageMap);
  const languages = Object.keys(allVocabulary)
    .filter((key) => key !== "korean" && languageMap[key])
    .map((key) => languageMap[key]);
  return buildConfig(lesson, categories, words, languages);
}

function configFromC17() {
  const lesson = 17;
  const source = readLesson(lesson);
  const existing = existingConfig(source);
  if (existing) return { ...existing, storageKey: "c17-vocabulary-standard" };

  const cardImageBasePath = extractStringConst(source, "cardImageBasePath");
  const vocabulary = evaluateExpression(extractAssignedExpression(source, "const vocabulary"), { cardImageBasePath });
  const categories = evaluateExpression(extractAssignedExpression(source, "const categories"));
  const words = vocabulary.map((item, index) => ({
    id: `c17-vocab-${String(index + 1).padStart(2, "0")}`,
    ko: item.korean,
    meaning: item.meaning || "",
    pos: posFor(item.korean),
    category: item.category || "all",
    example: item.example || "",
    en: item.english || "",
    image: safeImage(lesson, item.image),
    imageAlt: `${item.korean} 그림 카드`,
    quizImage: null,
    quizImageAlt: ""
  }));
  return buildConfig(lesson, categories, words, ["en"]);
}

function configFromC18() {
  const lesson = 18;
  const source = readLesson(lesson);
  const existing = existingConfig(source);
  if (existing) return { ...existing, storageKey: "c18-vocabulary-standard" };

  const c18VocabImageBase = extractStringConst(source, "c18VocabImageBase");
  const vocabulary = evaluateExpression(extractAssignedExpression(source, "window.C18_VOCABULARY"), { c18VocabImageBase });
  const seen = new Map();
  for (const item of vocabulary) {
    if (!seen.has(item.category)) seen.set(item.category, item.categoryLabel || item.category);
  }
  const categories = [{ id: "all", label: "전체" }, ...Array.from(seen, ([id, label]) => ({ id, label }))];
  const words = vocabulary.map((item, index) => ({
    id: `c18-vocab-${String(index + 1).padStart(2, "0")}`,
    ko: item.term,
    meaning: item.meaning || "",
    pos: posFor(item.term),
    category: item.category || "all",
    example: item.example || "",
    vi: item.vi || "",
    image: safeImage(lesson, item.image),
    imageAlt: item.imageAlt || `${item.term} 그림 카드`,
    quizImage: null,
    quizImageAlt: item.imageAlt || ""
  }));
  return buildConfig(lesson, categories, words, ["vi"]);
}

function configForLesson(lesson) {
  if (lesson === 10) return configFromC10();
  if (lesson === 11) return configFromC11();
  if (lesson >= 12 && lesson <= 16) return configFromAllVocabularyLesson(lesson);
  if (lesson === 17) return configFromC17();
  if (lesson === 18) return configFromC18();
  throw new Error(`Unsupported lesson c${lesson}`);
}

function replaceConfigBlock(html, config) {
  const marker = "window.VOCABULARY_CONFIG =";
  const start = html.indexOf(marker);
  if (start < 0) throw new Error("VOCABULARY_CONFIG block not found in template");
  const expression = extractAssignedExpression(html, marker);
  const expressionStart = html.indexOf(expression, start);
  const expressionEnd = expressionStart + expression.length;
  const js = JSON.stringify(config, null, 8)
    .replace(/"([^"]+)":/g, "$1:");
  return `${html.slice(0, expressionStart)}${js}${html.slice(expressionEnd)}`;
}

function renderPage(lesson, config) {
  const meta = lessonMeta[lesson];
  const pageTitle = `${lesson}과 어휘 | ${meta.topic}`;
  return replaceConfigBlock(template, config)
    .replaceAll("★[N]과 어휘 | ★[단원 주제]", pageTitle)
    .replaceAll("★[N]과 목록", `${lesson}과 목록`)
    .replaceAll("Chapter ★[N] Vocabulary", `Chapter ${lesson} Vocabulary`)
    .replaceAll("★[N]과 어휘 학습", `${lesson}과 어휘 학습`)
    .replaceAll("★[어휘 범주 설명 — 한 줄]", meta.subtitle)
    .replaceAll("★N", String(lesson))
    .replaceAll("★ 어휘 데이터", "어휘 데이터")
    .replaceAll("★ 표시", "과 데이터");
}

function summarize(config) {
  const imageCount = config.words.filter((word) => word.image).length;
  const quizImageCount = config.words.filter((word) => word.quizImage || word.image).length;
  return {
    words: config.words.length,
    languages: config.languages.join(","),
    categories: config.categories.length,
    images: imageCount,
    quizImages: quizImageCount
  };
}

function main() {
  const results = [];
  for (let lesson = 10; lesson <= 18; lesson += 1) {
    console.log(`upgrading c${lesson}...`);
    const config = configForLesson(lesson);
    const html = renderPage(lesson, config);
    writeLesson(lesson, html);
    results.push({ lesson: `c${lesson}`, ...summarize(config) });
  }
  console.table(results);
}

main();
