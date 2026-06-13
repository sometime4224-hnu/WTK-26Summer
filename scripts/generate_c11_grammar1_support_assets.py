from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\somet\Downloads")
OUTPUT_DIR = ROOT / "assets" / "c11" / "grammar" / "images" / "grammar1-support-material1"

PROFILES = {
    "standard": {
        "cardsDir": OUTPUT_DIR / "cards",
        "manifest": OUTPUT_DIR / "manifest.json",
        "targetWidth": 512,
        "webpQuality": 78,
        "description": "사동사 기본형과 사동형을 2칸 짝으로 보여 주는 표준 카드 이미지 세트입니다.",
    },
    "ultra": {
        "cardsDir": OUTPUT_DIR / "cards-ultra",
        "manifest": OUTPUT_DIR / "manifest-ultra.json",
        "targetWidth": 224,
        "webpQuality": 42,
        "description": "자주 불러오는 학생용 학습 페이지를 위한 태블릿 친화 초경량 카드 이미지 세트입니다.",
        "recommendedUse": "student learning pages and tablet-friendly inline cards where quick loading still matters",
    },
}

POSITIONS = ("TL", "TR", "BL", "BR")

SOURCE_NOTES = [
    {
        "sourceIndex": 12,
        "file": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (10).png",
        "duplicateOf": 1,
        "action": "skipped",
    },
    {
        "sourceIndex": 3,
        "file": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (3).png",
        "unusedPositions": ["BL", "BR"],
        "reason": "source sheet contains one full-height two-column pair",
    },
]

SHEETS = [
    {
        "sourceIndex": 1,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_18.png",
        "items": [
            ("숨다", "hide", "base", "-기"),
            ("숨기다", "hide-causative", "causative", "-기"),
            ("씻다", "wash", "base", "-기"),
            ("씻기다", "wash-causative", "causative", "-기"),
        ],
    },
    {
        "sourceIndex": 2,
        "source": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (2).png",
        "items": [
            ("타다", "ride", "base", "-우"),
            ("태우다", "ride-causative", "causative", "-우"),
            ("달다", "heat-up", "base", "-구"),
            ("달구다", "heat-up-causative", "causative", "-구"),
        ],
    },
    {
        "sourceIndex": 3,
        "source": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (3).png",
        "layout": "two-column",
        "items": [
            ("늦다", "be-late", "base", "-추"),
            ("늦추다", "delay", "causative", "-추"),
        ],
    },
    {
        "sourceIndex": 4,
        "source": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (4).png",
        "items": [
            ("솟다", "rise", "base", "-구"),
            ("솟구다", "rise-causative", "causative", "-구"),
            ("낮다", "low", "base", "-추"),
            ("낮추다", "lower", "causative", "-추"),
        ],
    },
    {
        "sourceIndex": 5,
        "source": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (5).png",
        "items": [
            ("서다", "stand", "base", "-우"),
            ("세우다", "stand-causative", "causative", "-우"),
            ("쓰다", "wear-hat", "base", "-우"),
            ("씌우다", "put-hat-on", "causative", "-우"),
        ],
    },
    {
        "sourceIndex": 6,
        "source": "ChatGPT Image 2026년 6월 13일 오후 01_02_57 (1).png",
        "items": [
            ("자다", "sleep", "base", "-우"),
            ("재우다", "put-to-sleep", "causative", "-우"),
            ("깨다", "wake-up", "base", "-우"),
            ("깨우다", "wake-causative", "causative", "-우"),
        ],
    },
    {
        "sourceIndex": 7,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (5).png",
        "items": [
            ("눕다", "lie-down", "base", "-히"),
            ("눕히다", "lay-down", "causative", "-히"),
            ("익다", "be-cooked", "base", "-히"),
            ("익히다", "cook", "causative", "-히"),
        ],
    },
    {
        "sourceIndex": 8,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (6).png",
        "items": [
            ("울다", "cry", "base", "-리"),
            ("울리다", "make-cry", "causative", "-리"),
            ("알다", "know", "base", "-리"),
            ("알리다", "inform", "causative", "-리"),
        ],
    },
    {
        "sourceIndex": 9,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (7).png",
        "items": [
            ("살다", "live", "base", "-리"),
            ("살리다", "save", "causative", "-리"),
            ("날다", "fly", "base", "-리"),
            ("날리다", "make-fly", "causative", "-리"),
        ],
    },
    {
        "sourceIndex": 10,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (8).png",
        "items": [
            ("돌다", "spin", "base", "-리"),
            ("돌리다", "turn", "causative", "-리"),
            ("웃다", "laugh", "base", "-기"),
            ("웃기다", "make-laugh", "causative", "-기"),
        ],
    },
    {
        "sourceIndex": 11,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (9).png",
        "items": [
            ("벗다", "take-off", "base", "-기"),
            ("벗기다", "take-off-causative", "causative", "-기"),
            ("신다", "wear-shoes", "base", "-기"),
            ("신기다", "put-shoes-on", "causative", "-기"),
        ],
    },
    {
        "sourceIndex": 13,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_28 (1).png",
        "items": [
            ("먹다", "eat", "base", "-이"),
            ("먹이다", "feed", "causative", "-이"),
            ("끓다", "boil", "base", "-이"),
            ("끓이다", "boil-causative", "causative", "-이"),
        ],
    },
    {
        "sourceIndex": 14,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_28 (2).png",
        "items": [
            ("줄다", "decrease", "base", "-이"),
            ("줄이다", "reduce", "causative", "-이"),
            ("붙다", "stick", "base", "-이"),
            ("붙이다", "attach", "causative", "-이"),
        ],
    },
    {
        "sourceIndex": 15,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_28 (3).png",
        "items": [
            ("높다", "high", "base", "-이"),
            ("높이다", "raise", "causative", "-이"),
            ("앉다", "sit", "base", "-히"),
            ("앉히다", "seat", "causative", "-히"),
        ],
    },
    {
        "sourceIndex": 16,
        "source": "ChatGPT Image 2026년 6월 13일 오후 12_57_29 (4).png",
        "items": [
            ("입다", "wear-clothes", "base", "-히"),
            ("입히다", "dress", "causative", "-히"),
            ("읽다", "read", "base", "-히"),
            ("읽히다", "make-read", "causative", "-히"),
        ],
    },
]


def crop_box(width: int, height: int, position: str) -> tuple[int, int, int, int]:
    half_w = width // 2
    half_h = height // 2
    boxes = {
        "L": (0, 0, half_w, height),
        "R": (half_w, 0, width, height),
        "TL": (0, 0, half_w, half_h),
        "TR": (half_w, 0, width, half_h),
        "BL": (0, half_h, half_w, height),
        "BR": (half_w, half_h, width, height),
    }
    return boxes[position]


def output_filename(card_index: int, slug: str) -> str:
    return f"cut{card_index:02d}-{slug}.webp"


def save_card(
    source: Image.Image,
    position: str,
    output_path: Path,
    target_width: int,
    webp_quality: int,
) -> tuple[int, int]:
    crop = source.crop(crop_box(source.width, source.height, position))
    height = round(crop.height * (target_width / crop.width))
    card = crop.resize((target_width, height), Image.Resampling.LANCZOS).convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    card.save(output_path, "WEBP", quality=webp_quality, method=6)
    return card.width, card.height


def build_profile(profile_name: str, profile: dict[str, object]) -> tuple[int, int, int]:
    cards_dir = profile["cardsDir"]
    manifest_path = profile["manifest"]
    target_width = int(profile["targetWidth"])
    webp_quality = int(profile["webpQuality"])

    cards: list[dict[str, object]] = []
    pairs: list[dict[str, object]] = []
    card_index = 1
    pair_index = 1

    for sheet in SHEETS:
        source_path = SOURCE_DIR / str(sheet["source"])
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        items = sheet["items"]
        if len(items) not in (2, 4):
            raise ValueError(f"Expected 2 or 4 items in sheet {sheet['sourceIndex']}, got {len(items)}")

        with Image.open(source_path) as source_image:
            source_image = source_image.convert("RGB")
            positions = ("L", "R") if sheet.get("layout") == "two-column" else POSITIONS
            for item_index, (word, slug, role, suffix) in enumerate(items):
                position = positions[item_index]
                filename = output_filename(card_index, slug)
                pair_id = f"g1s1-pair{pair_index + item_index // 2:02d}"
                card_id = f"g1s1-card{card_index:02d}"
                width, height = save_card(
                    source_image,
                    position,
                    cards_dir / filename,
                    target_width,
                    webp_quality,
                )
                cards.append(
                    {
                        "id": card_id,
                        "pairId": pair_id,
                        "word": word,
                        "role": role,
                        "suffix": suffix,
                        "src": f"../assets/c11/grammar/images/grammar1-support-material1/{cards_dir.name}/{filename}",
                        "width": width,
                        "height": height,
                        "sourceIndex": sheet["sourceIndex"],
                        "sourceFile": sheet["source"],
                        "position": position,
                    }
                )
                card_index += 1

        for pair_start in range(0, len(items), 2):
            base_word, _base_slug, _base_role, suffix = items[pair_start]
            causative_word, _causative_slug, _causative_role, _causative_suffix = items[pair_start + 1]
            pairs.append(
                {
                    "id": f"g1s1-pair{pair_index:02d}",
                    "base": base_word,
                    "causative": causative_word,
                    "suffix": suffix,
                    "cardIds": [
                        f"g1s1-card{card_index - len(items) + pair_start:02d}",
                        f"g1s1-card{card_index - len(items) + pair_start + 1:02d}",
                    ],
                }
            )
            pair_index += 1

    manifest = {
        "title": "11과 문법1 보조자료 1 - 사동사",
        "profile": profile_name,
        "description": profile["description"],
        "targetWidth": target_width,
        "webpQuality": webp_quality,
        "cardCount": len(cards),
        "pairCount": len(pairs),
        "totalBytes": sum((cards_dir / Path(str(card["src"])).name).stat().st_size for card in cards),
        "sourceNotes": SOURCE_NOTES,
        "pairs": pairs,
        "cards": cards,
    }

    if "recommendedUse" in profile:
        manifest["recommendedUse"] = profile["recommendedUse"]

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return len(cards), len(pairs), int(manifest["totalBytes"])


def main() -> None:
    for profile_name, profile in PROFILES.items():
        card_count, pair_count, total_bytes = build_profile(profile_name, profile)
        print(
            f"Generated {profile_name}: {card_count} cards, {pair_count} pairs, "
            f"{total_bytes / 1024:.1f} KB"
        )


if __name__ == "__main__":
    main()
