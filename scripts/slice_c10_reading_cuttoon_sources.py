from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DOWNLOADS = Path.home() / "Downloads"
OUT_DIR = ROOT / "assets" / "c10" / "reading-writing" / "images" / "cuttoon"

SOURCE_SHEETS = [
    "ChatGPT Image 2026년 6월 10일 오후 03_39_36 (4).png",
    "ChatGPT Image 2026년 6월 10일 오후 03_39_35 (1).png",
    "ChatGPT Image 2026년 6월 10일 오후 03_39_35 (2).png",
    "ChatGPT Image 2026년 6월 10일 오후 03_39_35 (3).png",
]

PANEL_SIZE = 627
WEBP_QUALITY = 84

SUGGESTED_READING_SEQUENCE = [
    {
        "cut": "cut01",
        "panel": "sheet02-panel01",
        "sentenceId": "love-feels-forever",
        "note": "사랑에 빠진 연인들은 서로의 사랑이 영원할 거라고 생각합니다.",
    },
    {
        "cut": "cut02",
        "panel": "sheet02-panel02",
        "sentenceId": "love-has-expiration-date",
        "note": "하지만 사랑에도 유통 기한이 있다고 합니다.",
    },
    {
        "cut": "cut03",
        "panel": "sheet02-panel03",
        "sentenceId": "no-more-heart-pounding",
        "note": "18개월에서 30개월이 지나면 더 이상 가슴이 두근거리지 않습니다.",
    },
    {
        "cut": "cut04",
        "panel": "sheet02-panel04",
        "sentenceId": "break-up-after-love-cools",
        "note": "사랑이 식었다고 생각해서 헤어지는 연인들이 많습니다.",
    },
    {
        "cut": "cut05",
        "panel": "sheet03-panel01",
        "sentenceId": "love-has-many-stages",
        "note": "이런 변화는 사랑의 여러 가지 단계 중의 하나입니다.",
    },
    {
        "cut": "cut06",
        "panel": "sheet03-panel02",
        "sentenceId": "love-grows-with-effort",
        "note": "서로의 노력으로 사랑은 더 커질 수 있습니다.",
    },
    {
        "cut": "cut07",
        "panel": "sheet03-panel03",
        "sentenceId": "think-about-lifelong-together",
        "note": "지금 곁에 있는 사람과 평생을 함께할 생각입니까?",
    },
    {
        "cut": "cut08",
        "panel": "sheet03-panel04",
        "sentenceId": "introducing-ways-to-keep-love",
        "note": "오랫동안 사랑을 지킬 수 있는 방법 몇 가지를 소개하겠습니다.",
    },
    {
        "cut": "cut09",
        "panel": "sheet01-panel02",
        "sentenceId": "understand-as-they-are",
        "note": "첫째, 서로를 있는 그대로 이해해 줍니다.",
    },
    {
        "cut": "cut10",
        "panel": "sheet04-panel02",
        "sentenceId": "express-love-often",
        "note": "둘째, 사랑하는 마음을 자주 표현합니다.",
    },
    {
        "cut": "cut11",
        "panel": "sheet04-panel03",
        "sentenceId": "do-not-tell-lies",
        "note": "셋째, 거짓말을 하면 안 됩니다.",
    },
    {
        "cut": "cut12",
        "panel": "sheet04-panel04",
        "sentenceId": "make-a-shared-hobby",
        "note": "넷째, 함께 할 수 있는 취미를 만듭니다.",
    },
    {
        "cut": "cut13",
        "panel": "sheet01-panel01",
        "sentenceId": "do-not-compare-with-others",
        "note": "다섯째, 다른 사람과 비교하지 않습니다.",
    },
    {
        "cut": "cut14",
        "panel": "sheet01-panel03",
        "sentenceId": "changed-heart-or-bad-match",
        "note": "여자는 마음이 변했다고 느낄 때, 남자는 성격이 안 맞을 때 이별을 생각합니다.",
    },
    {
        "cut": "cut15",
        "panel": "sheet01-panel04",
        "sentenceId": "stay-together-longer",
        "note": "위의 방법대로 하면 사랑하는 사람과 오래 함께할 수 있을 겁니다.",
    },
    {
        "cut": "extra01",
        "panel": "sheet04-panel01",
        "sentenceId": "shared-hobby-options",
        "note": "함께 할 수 있는 취미를 고르는 보조 컷입니다.",
    },
]


def save_webp(image: Image.Image, output_path: Path) -> None:
    image.convert("RGB").save(
        output_path,
        format="WEBP",
        quality=WEBP_QUALITY,
        method=6,
    )


def panel_id(sheet_index: int, panel_index: int) -> str:
    return f"sheet{sheet_index:02d}-panel{panel_index:02d}"


def panel_file(sheet_index: int, panel_index: int) -> str:
    return f"c10-reading-cuttoon-sheet-{sheet_index:02d}-panel-{panel_index:02d}.webp"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    sheets = []
    panels = []

    for sheet_index, filename in enumerate(SOURCE_SHEETS, start=1):
        source_path = DOWNLOADS / filename
        if not source_path.exists():
            raise FileNotFoundError(f"Missing source sheet: {source_path}")

        with Image.open(source_path) as source:
            sheet = source.convert("RGB")
            sheet_output = f"c10-reading-cuttoon-sheet-{sheet_index:02d}.webp"
            save_webp(sheet, OUT_DIR / sheet_output)
            sheets.append(
                {
                    "id": f"sheet{sheet_index:02d}",
                    "sourceFile": filename,
                    "file": sheet_output,
                    "size": [sheet.width, sheet.height],
                }
            )

            panel_index = 1
            for row in range(2):
                for col in range(2):
                    left = col * PANEL_SIZE
                    top = row * PANEL_SIZE
                    crop_box = (left, top, left + PANEL_SIZE, top + PANEL_SIZE)
                    output_file = panel_file(sheet_index, panel_index)
                    save_webp(sheet.crop(crop_box), OUT_DIR / output_file)
                    panels.append(
                        {
                            "id": panel_id(sheet_index, panel_index),
                            "sheet": f"sheet{sheet_index:02d}",
                            "file": output_file,
                            "crop": list(crop_box),
                            "size": [PANEL_SIZE, PANEL_SIZE],
                        }
                    )
                    panel_index += 1

    manifest = {
        "chapter": "c10",
        "kind": "reading-cuttoon",
        "assetBase": "assets/c10/reading-writing/images/cuttoon/",
        "sheets": sheets,
        "panels": panels,
        "suggestedReadingSequence": SUGGESTED_READING_SEQUENCE,
    }
    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Saved {len(sheets)} sheets, {len(panels)} panels, and {manifest_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
