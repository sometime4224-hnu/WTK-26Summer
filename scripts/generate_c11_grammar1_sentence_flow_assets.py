from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\somet\Downloads")
OUTPUT_DIR = ROOT / "assets" / "c11" / "grammar" / "images" / "causative-sentence-flow"
SLIDES_DIR = OUTPUT_DIR / "slides"
THUMBS_DIR = OUTPUT_DIR / "thumbs"

SLIDE_QUALITY = 82
THUMB_QUALITY = 70
THUMB_WIDTH = 360

ITEMS = [
    {
        "order": 1,
        "title": "B만 있어도 되는 말",
        "summary": "사람이나 동물 하나만 있어도 완성되는 기본 문장을 확인합니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_00 (2).png",
        "filename": "01-b-only-sentence.webp",
    },
    {
        "order": 2,
        "title": "B가 C를 하는 말",
        "summary": "사람과 대상이 함께 있어야 자연스러운 문장을 확인합니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_01 (3).png",
        "filename": "02-b-c-action-sentence.webp",
    },
    {
        "order": 3,
        "title": "이 행동에는 무엇이 필요해요?",
        "summary": "B만 있는 문장과 B+C 문장을 비교하고 A 도입을 준비합니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_23_58 (1).png",
        "filename": "03-sentence-shape-check.webp",
    },
    {
        "order": 4,
        "title": "A가 들어오면 이렇게 바뀌어요",
        "summary": "B만 있던 문장에 A가 들어오면 B가 B를로 바뀌는 흐름을 봅니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_01 (4).png",
        "filename": "04-add-a-to-b-only.webp",
    },
    {
        "order": 5,
        "title": "모양 1: A가 B를 하게 해요",
        "summary": "B가 행동하던 문장이 A가 B를 하게 하는 문장으로 바뀝니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_02 (5).png",
        "filename": "05-pattern-a-makes-b.webp",
    },
    {
        "order": 6,
        "title": "B와 C가 있는 문장에 A가 들어와요",
        "summary": "B가 C를 하던 문장에 A가 들어올 때의 변화를 확인합니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_02 (6).png",
        "filename": "06-add-a-to-b-c.webp",
    },
    {
        "order": 7,
        "title": "모양 2: A가 B에게 C를 하게 해요",
        "summary": "B가 C를 하던 문장이 A가 B에게 C를 하게 하는 문장으로 바뀝니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_02 (7).png",
        "filename": "07-pattern-a-makes-b-do-c.webp",
    },
    {
        "order": 8,
        "title": "두 모양을 비교해요",
        "summary": "A가 들어올 때 생기는 두 가지 문장 모양을 나란히 정리합니다.",
        "source": "ChatGPT Image 2026년 6월 17일 오후 09_24_03 (8).png",
        "filename": "08-two-patterns-comparison.webp",
    },
]


def save_webp(source_path: Path, output_path: Path, quality: int, width: int | None = None) -> tuple[int, int, int]:
    with Image.open(source_path) as image:
        image = image.convert("RGB")
        if width is not None:
            height = round(image.height * width / image.width)
            image = image.resize((width, height), Image.Resampling.LANCZOS)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(output_path, "WEBP", quality=quality, method=6)
        return image.width, image.height, output_path.stat().st_size


def main() -> None:
    manifest_items = []

    for item in ITEMS:
        source_path = SOURCE_DIR / item["source"]
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        slide_path = SLIDES_DIR / item["filename"]
        thumb_path = THUMBS_DIR / item["filename"]

        slide_width, slide_height, slide_bytes = save_webp(source_path, slide_path, SLIDE_QUALITY)
        thumb_width, thumb_height, thumb_bytes = save_webp(
            source_path,
            thumb_path,
            THUMB_QUALITY,
            THUMB_WIDTH,
        )

        manifest_items.append(
            {
                "order": item["order"],
                "title": item["title"],
                "summary": item["summary"],
                "sourceFile": item["source"],
                "slide": f"slides/{item['filename']}",
                "thumb": f"thumbs/{item['filename']}",
                "slideWidth": slide_width,
                "slideHeight": slide_height,
                "slideBytes": slide_bytes,
                "thumbWidth": thumb_width,
                "thumbHeight": thumb_height,
                "thumbBytes": thumb_bytes,
            }
        )

    manifest = {
        "title": "11과 문법1 사동 문장 만들기 흐름",
        "description": "B 기본 문장에서 A가 들어오는 사동 문장 변화까지 8단계로 보여 주는 보조자료입니다.",
        "slideQuality": SLIDE_QUALITY,
        "thumbQuality": THUMB_QUALITY,
        "thumbWidth": THUMB_WIDTH,
        "count": len(manifest_items),
        "totalSlideBytes": sum(item["slideBytes"] for item in manifest_items),
        "totalThumbBytes": sum(item["thumbBytes"] for item in manifest_items),
        "items": manifest_items,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        "Generated {count} sentence-flow slides: {slides:.1f} KB slides, {thumbs:.1f} KB thumbs".format(
            count=len(manifest_items),
            slides=manifest["totalSlideBytes"] / 1024,
            thumbs=manifest["totalThumbBytes"] / 1024,
        )
    )


if __name__ == "__main__":
    main()
