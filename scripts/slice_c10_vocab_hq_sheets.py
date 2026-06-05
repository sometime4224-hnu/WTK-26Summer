from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "c10" / "vocabulary" / "images" / "source-sheets"
OUTPUT_DIR = ROOT / "assets" / "c10" / "vocabulary" / "images" / "split-hq"
TARGET_SIZE = 720
WEBP_QUALITY = 78


ITEMS = [
    ("고백하다", "c10_vocab_01_confess.webp", 1, "TL"),
    ("가슴이 두근거리다", "c10_vocab_02_heart_pounding.webp", 1, "TR"),
    ("나란히 앉다", "c10_vocab_03_side_by_side.webp", 1, "BL"),
    ("마음씨가 착하다", "c10_vocab_04_kind_heart.webp", 1, "BR"),
    ("말(생각)이 잘 통하다", "c10_vocab_05_understand.webp", 2, "TL"),
    ("매력이 있다", "c10_vocab_06_charming.webp", 2, "TR"),
    ("사랑에 빠지다", "c10_vocab_07_fall_in_love.webp", 2, "BL"),
    ("사귀다", "c10_vocab_08_date.webp", 2, "BR"),
    ("성격(마음)이 잘 맞다", "c10_vocab_09_good_match.webp", 3, "TL"),
    ("선보다", "c10_vocab_10_matchmaking.webp", 3, "TR"),
    ("소개팅하다", "c10_vocab_11_blind_date.webp", 3, "BL"),
    ("손을 잡다", "c10_vocab_12_hold_hands.webp", 3, "BR"),
    ("어깨에 기대다", "c10_vocab_13_lean_shoulder.webp", 4, "TL"),
    ("얼굴이 빨개지다", "c10_vocab_14_blush.webp", 4, "TR"),
    ("연애하다", "c10_vocab_15_relationship.webp", 4, "BL"),
    ("인상이 좋다", "c10_vocab_16_good_impression.webp", 4, "BR"),
    ("조건이 맞다", "c10_vocab_17_conditions_match.webp", 5, "TL"),
    ("첫눈에 반하다", "c10_vocab_18_love_at_first_sight.webp", 5, "TR"),
    ("팔짱을 끼다", "c10_vocab_19_arm_in_arm.webp", 5, "BL"),
]


def crop_box(width: int, height: int, position: str) -> tuple[int, int, int, int]:
    half_w = width // 2
    half_h = height // 2
    boxes = {
        "TL": (0, 0, half_w, half_h),
        "TR": (half_w, 0, width, half_h),
        "BL": (0, half_h, half_w, height),
        "BR": (half_w, half_h, width, height),
    }
    return boxes[position]


def save_card(source_path: Path, position: str, output_path: Path) -> None:
    with Image.open(source_path) as source:
        source = source.convert("RGB")
        crop = source.crop(crop_box(source.width, source.height, position))
        crop.thumbnail((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)
        card = Image.new("RGB", (TARGET_SIZE, TARGET_SIZE), "white")
        x = (TARGET_SIZE - crop.width) // 2
        y = (TARGET_SIZE - crop.height) // 2
        card.paste(crop, (x, y))
        card.save(output_path, "WEBP", quality=WEBP_QUALITY, method=6)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    missing_sheets = set()
    generated = 0

    for word, filename, sheet_number, position in ITEMS:
        source_path = SOURCE_DIR / f"c10_vocab_sheet_{sheet_number:02d}.png"
        if not source_path.exists():
            missing_sheets.add(source_path.name)
            continue
        output_path = OUTPUT_DIR / filename
        save_card(source_path, position, output_path)
        generated += 1
        manifest.append(
            {
                "word": word,
                "src": f"../assets/c10/vocabulary/images/split-hq/{filename}",
                "sheet": source_path.name,
                "position": position,
            }
        )

    (OUTPUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"Generated {generated} WebP cards in {OUTPUT_DIR}")
    if missing_sheets:
        print("Missing source sheets:")
        for name in sorted(missing_sheets):
            print(f"  - {name}")


if __name__ == "__main__":
    main()
