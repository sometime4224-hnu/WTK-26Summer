from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "c11" / "grammar" / "images" / "grammar2-neundamyeon"
SOURCE_AI_DIR = OUTPUT_DIR / "source-ai"
CARDS_DIR = OUTPUT_DIR / "cards"
ILLUSTRATIONS_DIR = OUTPUT_DIR / "illustrations"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

WIDTH = 1408
HEIGHT = 768
WEBP_QUALITY = 92
FONT_REGULAR = Path(r"C:\Windows\Fonts\malgun.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")


ASSETS = [
    {
        "id": "g2n-01",
        "filename": "01-long-term-health-exercise.webp",
        "source": "01-long-term-health-exercise-ai.png",
        "section": "long-term-goal",
        "sectionLabel": "장기 목표",
        "title": "운동을 하면 / 건강 관리를 잘한다면",
        "grammarFocus": "-는다면",
        "usageType": "조건과 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "미래 목표"],
        "sentences": ["운동을 하면 건강해져요.", "건강 관리를 잘한다면 오래 살고 싶어요."],
        "note": "미래 목표를 상상하며 말할 때 -다면을 씁니다.",
        "scene": "운동을 계속하면 건강해지는 현실적 조건과, 건강 관리를 잘하면 오래 살고 싶다는 장기 목표형 가정을 비교합니다.",
        "keywords": ["운동", "건강", "장기 목표", "조건", "가정"],
    },
    {
        "id": "g2n-02",
        "filename": "02-long-term-money-travel.webp",
        "source": "02-long-term-money-travel-ai.png",
        "section": "long-term-goal",
        "sectionLabel": "장기 목표",
        "title": "돈이 생기면 / 돈을 많이 모은다면",
        "grammarFocus": "-는다면",
        "usageType": "조건과 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "미래 목표"],
        "sentences": ["돈이 생기면 저금해요.", "돈을 많이 모은다면 세계 여행을 갈 거예요."],
        "note": "아직 이루지 않은 목표를 가정하고 계획을 말합니다.",
        "scene": "돈이 생기면 저금하는 현실적 조건과, 돈을 많이 모으면 세계 여행을 간다는 장기 목표형 가정을 비교합니다.",
        "keywords": ["돈", "저금", "세계 여행", "장기 목표", "가정"],
    },
    {
        "id": "g2n-03",
        "filename": "03-long-term-korean-study-goal.webp",
        "source": "03-long-term-korean-study-goal-ai.png",
        "section": "long-term-goal",
        "sectionLabel": "장기 목표",
        "title": "한국어를 공부하면 / 고급이 된다면",
        "grammarFocus": "-는다면",
        "usageType": "조건과 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "미래 목표"],
        "sentences": ["한국어를 열심히 공부하면 시험을 잘 봐요.", "한국어 능력이 고급이 된다면 통역사가 되고 싶어요."],
        "note": "노력의 결과를 가정하고 장래 희망을 말합니다.",
        "scene": "한국어를 열심히 공부하면 시험을 잘 본다는 조건과, 한국어 능력이 고급이 되면 통역사가 되고 싶다는 장기 목표형 가정을 비교합니다.",
        "keywords": ["한국어 공부", "시험", "통역사", "장기 목표", "가정"],
    },
    {
        "id": "g2n-04",
        "filename": "04-imagined-homework-game.webp",
        "source": "04-imagined-homework-game-ai.png",
        "section": "imagined-condition",
        "sectionLabel": "상상 가정",
        "title": "숙제를 다 하면 / 내가 왕이라면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 상상 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["숙제를 다 하면 게임을 해요.", "내가 왕이라면 매일 놀고 싶어요."],
        "note": "실제로 쉽지 않은 상황을 상상할 때 -다면을 씁니다.",
        "scene": "숙제를 다 하면 게임을 하는 현실적 조건과, 왕이 된다면 매일 놀고 싶다는 상상적 가정을 비교합니다.",
        "keywords": ["숙제", "게임", "왕", "상상", "가정"],
    },
    {
        "id": "g2n-05",
        "filename": "05-imagined-eat-tall.webp",
        "source": "05-imagined-eat-tall-ai.png",
        "section": "imagined-condition",
        "sectionLabel": "상상 가정",
        "title": "밥을 많이 먹으면 / 내가 거인이라면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 상상 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["밥을 많이 먹으면 키가 커요.", "내가 거인이라면 산을 옮길 거예요."],
        "note": "가능성이 낮은 상상을 문장 앞에 세웁니다.",
        "scene": "밥을 많이 먹으면 키가 크는 조건과, 거인이 된다면 산을 옮기고 싶다는 상상적 가정을 비교합니다.",
        "keywords": ["밥", "키", "거인", "상상", "가정"],
    },
    {
        "id": "g2n-06",
        "filename": "06-imagined-sale-shopping.webp",
        "source": "06-imagined-sale-shopping-ai.png",
        "section": "imagined-condition",
        "sectionLabel": "상상 가정",
        "title": "세일을 하면 / 램프의 요정을 만난다면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 상상 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["세일을 하면 옷을 살 거예요.", "램프의 요정을 만난다면 세 가지 소원을 빌 거예요."],
        "note": "상상 속 사건을 조건처럼 놓고 희망을 말합니다.",
        "scene": "세일을 하면 옷을 사는 조건과, 램프의 요정을 만난다면 세 가지 소원을 빌고 싶다는 상상적 가정을 비교합니다.",
        "keywords": ["세일", "옷", "램프", "소원", "상상"],
    },
    {
        "id": "g2n-07",
        "filename": "07-imagined-snow-invisible.webp",
        "source": "07-imagined-snow-invisible-ai.png",
        "section": "imagined-condition",
        "sectionLabel": "상상 가정",
        "title": "눈이 오면 / 투명 인간이 된다면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 상상 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["눈이 오면 눈사람을 만들어요.", "투명 인간이 된다면 여행을 갈 거예요."],
        "note": "현실 조건과 상상 가정을 나란히 비교합니다.",
        "scene": "눈이 오면 눈사람을 만드는 조건과, 투명 인간이 된다면 아무도 모르게 여행을 가고 싶다는 상상적 가정을 비교합니다.",
        "keywords": ["눈", "눈사람", "투명 인간", "여행", "상상"],
    },
    {
        "id": "g2n-08",
        "filename": "08-imagined-tired-time-rewind.webp",
        "source": "08-imagined-tired-time-rewind-ai.png",
        "section": "imagined-condition",
        "sectionLabel": "상상 가정",
        "title": "피곤하면 / 시간을 돌릴 수 있다면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 상상 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["피곤하면 좀 쉬세요.", "시간을 돌릴 수 있다면 어린 시절로 돌아가고 싶어요."],
        "note": "불가능에 가까운 일을 가정할 때도 -다면을 씁니다.",
        "scene": "피곤하면 쉬는 조건과, 시간을 돌릴 수 있다면 어린 시절로 돌아가고 싶다는 상상적 가정을 비교합니다.",
        "keywords": ["피곤하다", "쉬다", "시간", "어린 시절", "상상"],
    },
    {
        "id": "g2n-09",
        "filename": "09-if-rain-lottery.webp",
        "source": "09-if-rain-lottery-ai.png",
        "section": "basic-comparison",
        "sectionLabel": "기본 비교",
        "title": "비가 오면 / 복권에 당첨된다면",
        "grammarFocus": "-는다면",
        "usageType": "현실 조건과 가능성 낮은 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "가능성 낮은 가정"],
        "sentences": ["비가 오면 우산을 써요.", "복권에 당첨된다면 집을 살 거예요."],
        "note": "-(으)면은 실제 조건, -다면은 상상하거나 가능성이 낮은 가정입니다.",
        "scene": "비가 오면 우산을 쓰는 조건과, 복권에 당첨된다면 집을 사고 싶다는 가정을 비교합니다.",
        "keywords": ["비", "우산", "복권", "집", "가정"],
    },
    {
        "id": "g2n-10",
        "filename": "10-if-traffic-bird.webp",
        "source": "10-if-traffic-bird-ai.png",
        "section": "basic-comparison",
        "sectionLabel": "기본 비교",
        "title": "길이 막히면 / 내가 새라면",
        "grammarFocus": "-라면",
        "usageType": "현실 조건과 가능성 낮은 가정 비교",
        "layout": "two",
        "labels": ["현실 조건", "상상 가정"],
        "sentences": ["길이 막히면 지하철을 타요.", "내가 새라면 하늘을 날 거예요."],
        "note": "명사 뒤에는 받침에 따라 (이)라면을 씁니다.",
        "scene": "길이 막히면 지하철을 타는 조건과, 새라면 하늘을 날고 싶다는 가정을 비교합니다.",
        "keywords": ["교통", "지하철", "새", "하늘", "가정"],
    },
    {
        "id": "g2n-11",
        "filename": "11-noun-if-rich-superman-cat.webp",
        "source": "11-noun-if-rich-superman-cat-ai.png",
        "section": "form-overview",
        "sectionLabel": "형태 정리",
        "title": "명사 + (이)라면",
        "grammarFocus": "명사 가정",
        "usageType": "명사 가정 형태 예문",
        "layout": "three",
        "labels": ["부자라면", "슈퍼맨이라면", "고양이라면"],
        "sentences": ["내가 부자라면 기부할 거예요.", "내가 슈퍼맨이라면 날아다닐 거예요.", "내가 고양이라면 하루 종일 잘 거예요."],
        "note": "명사는 받침이 있으면 이라면, 받침이 없으면 라면을 씁니다.",
        "scene": "부자, 슈퍼맨, 고양이라는 명사 가정을 통해 N-(이)라면 형태를 보여 주는 예문 카드입니다.",
        "keywords": ["부자", "슈퍼맨", "고양이", "명사", "형태"],
    },
    {
        "id": "g2n-12",
        "filename": "12-verb-if-study-party-korea-taxi.webp",
        "source": "12-verb-if-study-party-korea-taxi-ai.png",
        "section": "form-overview",
        "sectionLabel": "형태 정리",
        "title": "동사 + ㄴ다면 / 는다면",
        "grammarFocus": "동사 가정",
        "usageType": "동사 가정 형태 예문",
        "layout": "four",
        "labels": ["시간이 된다면", "합격한다면", "한국에 간다면", "버스를 놓친다면"],
        "sentences": ["영화를 볼 거예요.", "파티를 할 거예요.", "택시를 탈 거예요.", "택시를 탈 거예요."],
        "note": "동사는 받침이 없으면 ㄴ다면, 받침이 있으면 는다면을 씁니다.",
        "scene": "시간이 되다, 시험에 합격하다, 한국에 가다, 버스를 놓치다를 통해 동사 어간별 -ㄴ다면/-는다면 형태를 보여 주는 예문 카드입니다.",
        "keywords": ["동사", "ㄴ다면", "는다면", "한국", "버스"],
    },
    {
        "id": "g2n-13",
        "filename": "13-adjective-if-tired-hungry-money.webp",
        "source": "13-adjective-if-tired-hungry-money-ai.png",
        "section": "form-overview",
        "sectionLabel": "형태 정리",
        "title": "형용사 + 다면",
        "grammarFocus": "형용사 가정",
        "usageType": "형용사 가정 형태 예문",
        "layout": "three",
        "labels": ["피곤하다면", "배고프다면", "돈이 많다면"],
        "sentences": ["좀 쉬세요.", "밥을 먹어요.", "기부할 거예요."],
        "note": "형용사는 받침과 관계없이 다면을 붙입니다.",
        "scene": "피곤하다, 배고프다, 돈이 많다를 통해 A-다면 형태와 일부 혼합 예문을 보여 주는 카드입니다.",
        "keywords": ["피곤하다", "배고프다", "돈이 많다", "형용사", "형태"],
    },
    {
        "id": "g2n-14",
        "filename": "14-mixed-if-cold-travel-king.webp",
        "source": "14-mixed-if-cold-travel-king-ai.png",
        "section": "form-overview",
        "sectionLabel": "형태 정리",
        "title": "품사별 가정 형태",
        "grammarFocus": "형용사·동사·명사",
        "usageType": "품사별 가정 형태 혼합 예문",
        "layout": "three",
        "labels": ["날씨가 춥다면", "복권에 당첨된다면", "내가 왕이라면"],
        "sentences": ["난방을 켤 거예요.", "세계 여행을 갈 거예요.", "백성들을 도울 거예요."],
        "note": "형용사, 동사, 명사는 붙는 형태가 다릅니다.",
        "scene": "날씨가 춥다, 복권에 당첨되다, 왕이라는 가정을 한 장에서 비교하는 혼합 형태 카드입니다.",
        "keywords": ["춥다", "복권", "여행", "왕", "품사별 형태"],
    },
    {
        "id": "g2n-15",
        "filename": "15-summary-weather-lottery-king.webp",
        "source": "15-summary-weather-lottery-king-ai.png",
        "section": "form-overview",
        "sectionLabel": "형태 요약",
        "title": "가정 표현 요약",
        "grammarFocus": "형용사·동사·명사",
        "usageType": "품사별 가정 형태 요약 카드",
        "layout": "three",
        "labels": ["춥다면", "당첨된다면", "왕이라면"],
        "sentences": ["따뜻한 음식을 먹어요.", "집을 살 거예요.", "사람들을 도울 거예요."],
        "note": "상황을 가정하고 뒤 문장에 바람이나 계획을 말합니다.",
        "scene": "날씨가 춥다면, 복권에 당첨된다면, 내가 왕이라면을 통해 형용사·동사·명사 가정 형태를 요약합니다.",
        "keywords": ["날씨", "복권", "왕", "요약", "품사별 형태"],
    },
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size=size)


def rounded_rectangle(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int,
    fill: tuple[int, int, int, int],
    outline: tuple[int, int, int, int] | None = None,
    width: int = 1,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def fit_cover(image: Image.Image, width: int, height: int) -> Image.Image:
    ratio = max(width / image.width, height / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = (resized.width - width) // 2
    top = (resized.height - height) // 2
    return resized.crop((left, top, left + width, top + height))


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    chunks = text.split(" ")
    lines: list[str] = []
    current = ""
    for chunk in chunks:
        candidate = chunk if not current else f"{current} {chunk}"
        if draw.textbbox((0, 0), candidate, font=font_obj)[2] <= max_width:
            current = candidate
            continue
        if current:
            lines.append(current)
        current = chunk
    if current:
        lines.append(current)
    return lines


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font_obj: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
    line_gap: int = 8,
) -> None:
    x1, y1, x2, y2 = box
    max_width = x2 - x1 - 24
    lines = wrap_text(draw, text, font_obj, max_width)
    heights = [draw.textbbox((0, 0), line, font=font_obj)[3] for line in lines]
    total_h = sum(heights) + line_gap * (len(lines) - 1)
    y = y1 + ((y2 - y1 - total_h) // 2)
    for line, line_h in zip(lines, heights):
        bbox = draw.textbbox((0, 0), line, font=font_obj)
        x = x1 + ((x2 - x1 - (bbox[2] - bbox[0])) // 2)
        draw.text((x, y), line, font=font_obj, fill=fill)
        y += line_h + line_gap


def draw_header(draw: ImageDraw.ImageDraw, item: dict[str, object]) -> None:
    rounded_rectangle(draw, (36, 28, WIDTH - 36, 104), 24, (255, 255, 255, 232), (203, 213, 225, 230), 2)
    draw.text((70, 48), str(item["title"]), font=font(32, True), fill=(15, 23, 42, 255))
    chip_text = f"{item['sectionLabel']} · {item['grammarFocus']}"
    chip_font = font(22, True)
    chip_w = draw.textbbox((0, 0), chip_text, font=chip_font)[2] + 38
    rounded_rectangle(draw, (WIDTH - 70 - chip_w, 48, WIDTH - 70, 88), 18, (239, 246, 255, 245), (147, 197, 253, 220), 2)
    draw.text((WIDTH - 51 - chip_w, 55), chip_text, font=chip_font, fill=(29, 78, 216, 255))


def draw_note(draw: ImageDraw.ImageDraw, note: str) -> None:
    rounded_rectangle(draw, (120, 700, WIDTH - 120, 744), 20, (15, 23, 42, 232), None)
    draw_centered_text(draw, (140, 700, WIDTH - 140, 744), note, font(22, True), (255, 255, 255, 255), 4)


def draw_two_panel_overlay(draw: ImageDraw.ImageDraw, item: dict[str, object]) -> None:
    labels = list(item["labels"])
    sentences = list(item["sentences"])
    regions = [(66, 122, 666, 676), (742, 122, 1342, 676)]
    card_boxes = [(94, 560, 638, 646), (770, 560, 1314, 646)]

    for index, region in enumerate(regions):
        x1, y1, x2, _y2 = region
        label_box = (x1 + 20, y1 + 18, x1 + 228, y1 + 64)
        fill = (219, 234, 254, 235) if index == 0 else (237, 233, 254, 235)
        outline = (147, 197, 253, 220) if index == 0 else (196, 181, 253, 220)
        text_color = (30, 64, 175, 255) if index == 0 else (88, 28, 135, 255)
        rounded_rectangle(draw, label_box, 18, fill, outline, 2)
        draw_centered_text(draw, label_box, labels[index], font(22, True), text_color)
        rounded_rectangle(draw, card_boxes[index], 22, (255, 255, 255, 238), outline, 2)
        draw_centered_text(draw, card_boxes[index], sentences[index], font(28, True), (15, 23, 42, 255), 6)


def draw_multi_panel_overlay(draw: ImageDraw.ImageDraw, item: dict[str, object], count: int) -> None:
    labels = list(item["labels"])
    sentences = list(item["sentences"])
    margin = 42
    gap = 14
    panel_w = (WIDTH - margin * 2 - gap * (count - 1)) // count

    for index in range(count):
        x1 = margin + index * (panel_w + gap)
        x2 = x1 + panel_w
        label_box = (x1 + 14, 118, x2 - 14, 170)
        sentence_box = (x1 + 14, 582, x2 - 14, 674)
        rounded_rectangle(draw, label_box, 18, (248, 250, 252, 238), (203, 213, 225, 230), 2)
        rounded_rectangle(draw, sentence_box, 20, (255, 255, 255, 240), (203, 213, 225, 230), 2)
        draw_centered_text(draw, label_box, labels[index], font(24, True), (30, 41, 59, 255), 4)
        draw_centered_text(draw, sentence_box, sentences[index], font(22, True), (15, 23, 42, 255), 5)


def build_card(item: dict[str, object]) -> dict[str, object]:
    source_path = SOURCE_AI_DIR / str(item["source"])
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    base = Image.open(source_path).convert("RGB")
    canvas = fit_cover(base, WIDTH, HEIGHT).convert("RGBA")
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)

    # A very light veil gives the Korean teaching labels enough contrast while preserving the AI illustration.
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(255, 255, 255, 24))
    draw_header(draw, item)

    if item["layout"] == "two":
        draw_two_panel_overlay(draw, item)
    elif item["layout"] == "three":
        draw_multi_panel_overlay(draw, item, 3)
    elif item["layout"] == "four":
        draw_multi_panel_overlay(draw, item, 4)
    else:
        raise ValueError(f"Unknown layout: {item['layout']}")

    draw_note(draw, str(item["note"]))
    combined = Image.alpha_composite(canvas, overlay).convert("RGB")
    combined = combined.filter(ImageFilter.UnsharpMask(radius=1, percent=115, threshold=3))

    output_path = CARDS_DIR / str(item["filename"])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    combined.save(output_path, "WEBP", quality=WEBP_QUALITY, method=6)

    return {
        "id": item["id"],
        "order": int(str(item["id"]).split("-")[-1]),
        "section": item["section"],
        "grammarFocus": item["grammarFocus"],
        "usageType": item["usageType"],
        "scene": item["scene"],
        "keywords": item["keywords"],
        "src": f"../assets/c11/grammar/images/grammar2-neundamyeon/cards/{item['filename']}",
        "filename": item["filename"],
        "width": WIDTH,
        "height": HEIGHT,
        "bytes": output_path.stat().st_size,
        "sourceFile": item["source"],
        "sourceKind": "ai-generated text-free illustration with Korean-only local overlay",
        "labels": item["labels"],
        "sentences": item["sentences"],
        "note": item["note"],
    }


def build_illustration(item: dict[str, object]) -> dict[str, object]:
    source_path = SOURCE_AI_DIR / str(item["source"])
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    base = Image.open(source_path).convert("RGB")
    illustration = fit_cover(base, WIDTH, HEIGHT)
    illustration = illustration.filter(ImageFilter.UnsharpMask(radius=1, percent=110, threshold=3))

    output_path = ILLUSTRATIONS_DIR / str(item["filename"])
    output_path.parent.mkdir(parents=True, exist_ok=True)
    illustration.save(output_path, "WEBP", quality=WEBP_QUALITY, method=6)

    return {
        "id": item["id"],
        "order": int(str(item["id"]).split("-")[-1]),
        "section": item["section"],
        "grammarFocus": item["grammarFocus"],
        "usageType": item["usageType"],
        "scene": item["scene"],
        "keywords": item["keywords"],
        "src": f"../assets/c11/grammar/images/grammar2-neundamyeon/illustrations/{item['filename']}",
        "filename": item["filename"],
        "width": WIDTH,
        "height": HEIGHT,
        "bytes": output_path.stat().st_size,
        "sourceFile": item["source"],
        "sourceKind": "ai-generated text-free illustration",
    }


def build_assets() -> dict[str, object]:
    illustrations = [build_illustration(item) for item in ASSETS]
    cards = [build_card(item) for item in ASSETS]
    manifest = {
        "title": "11과 문법2 이미지 에셋 - 무문자 AI 삽화와 한글 카드",
        "lesson": "c11 grammar2",
        "grammarPoints": ["-(으)면", "-ㄴ다면", "-는다면", "-다면", "-(이)라면"],
        "description": "조건 표현 -(으)면과 가정 표현 -다면 계열을 설명하는 수업용 이미지 세트입니다. 비주얼 예시 페이지는 무문자 삽화를 사용하고, 한글 카드 버전은 보조 자산으로 보존합니다.",
        "sourceAiDir": SOURCE_AI_DIR.relative_to(ROOT).as_posix(),
        "outputDir": OUTPUT_DIR.relative_to(ROOT).as_posix(),
        "cardsDir": CARDS_DIR.relative_to(ROOT).as_posix(),
        "illustrationsDir": ILLUSTRATIONS_DIR.relative_to(ROOT).as_posix(),
        "targetWidth": WIDTH,
        "targetHeight": HEIGHT,
        "webpQuality": WEBP_QUALITY,
        "cardCount": len(cards),
        "illustrationCount": len(illustrations),
        "totalSourceBytes": sum((SOURCE_AI_DIR / str(item["source"])).stat().st_size for item in ASSETS),
        "totalCardBytes": sum(int(card["bytes"]) for card in cards),
        "totalIllustrationBytes": sum(int(illustration["bytes"]) for illustration in illustrations),
        "totalOptimizedBytes": sum(int(card["bytes"]) for card in cards),
        "textPolicy": "Illustration assets contain no teaching text. Card assets contain Korean-only local overlays.",
        "sections": [
            {
                "id": "basic-comparison",
                "label": "기본 비교",
                "description": "-(으)면의 현실적 조건과 -다면 계열의 가능성 낮은 가정을 나란히 비교하는 이미지입니다.",
            },
            {
                "id": "imagined-condition",
                "label": "상상 가정",
                "description": "현실에서 바로 가능한 조건과 상상적 상황을 대비해 -다면의 느낌을 강화하는 이미지입니다.",
            },
            {
                "id": "long-term-goal",
                "label": "장기 목표",
                "description": "장기간 노력하거나 미래 목표를 상상하는 맥락에서 -다면을 쓰는 이미지입니다.",
            },
            {
                "id": "form-overview",
                "label": "형태 정리",
                "description": "동사, 형용사, 명사에 붙는 -다면 계열 형태를 한글 예문 카드로 정리한 이미지입니다.",
            },
        ],
        "illustrations": illustrations,
        "cards": cards,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    manifest = build_assets()
    print(f"Generated {manifest['illustrationCount']} text-free AI illustration WebP files")
    print(f"Generated {manifest['cardCount']} Korean-only AI illustration cards")
    print(f"AI source total: {manifest['totalSourceBytes'] / 1024 / 1024:.2f} MB")
    print(f"Text-free illustration WebP total: {manifest['totalIllustrationBytes'] / 1024 / 1024:.2f} MB")
    print(f"Korean card WebP total: {manifest['totalCardBytes'] / 1024 / 1024:.2f} MB")
    print(f"Manifest: {MANIFEST_PATH.relative_to(ROOT).as_posix()}")


if __name__ == "__main__":
    main()
