from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "backup" / "asset-sources" / "c16-vocabulary-images" / "generated-sheets-v2"
OUTPUT_DIR = ROOT / "assets" / "c16" / "vocabulary" / "images" / "cards-v2"
TARGET_SIZE = (256, 256)
POSITION_ORDER = ("tl", "tr", "bl", "br")

# Each source is a 2×2 contact sheet. The sequence deliberately preserves the
# separate instrument/bowing and playing-action groupings used by the lesson.
SHEETS: list[tuple[str, tuple[int, int, int, int]]] = [
    ("sheet01_emotions-a.png", (1, 2, 3, 4)),
    ("sheet02_emotions-b-instruments.png", (5, 6, 7, 8)),
    ("sheet03_instruments-bowing.png", (9, 10, 11, 16)),
    ("sheet04-playing-actions.png", (12, 13, 14, 15)),
    ("sheet05-basic-shapes.png", (17, 18, 19, 20)),
    ("sheet06-form-descriptors.png", (21, 22, 23, 24)),
    ("sheet07-texture-descriptors.png", (25, 26, 27, 28)),
]


def quadrant_box(width: int, height: int, position: str) -> tuple[int, int, int, int]:
    """Return a panel crop that excludes the contact-sheet gutter, preserving a small safe margin."""
    half_width = width // 2
    half_height = height // 2
    trim_x = max(8, round(width * 0.0096))
    trim_y = max(8, round(height * 0.0096))

    if position == "tl":
        return (trim_x, trim_y, half_width - trim_x, half_height - trim_y)
    if position == "tr":
        return (half_width + trim_x, trim_y, width - trim_x, half_height - trim_y)
    if position == "bl":
        return (trim_x, half_height + trim_y, half_width - trim_x, height - trim_y)
    if position == "br":
        return (half_width + trim_x, half_height + trim_y, width - trim_x, height - trim_y)
    raise ValueError(f"Unsupported panel position: {position}")


def save_card(image: Image.Image, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.convert("RGB").save(destination, format="WEBP", quality=82, method=6)


def main() -> None:
    for sheet_name, vocab_ids in SHEETS:
        source_path = SOURCE_DIR / sheet_name
        if not source_path.exists():
            raise FileNotFoundError(f"Missing source sheet: {source_path}")

        with Image.open(source_path) as source:
            for position, vocab_id in zip(POSITION_ORDER, vocab_ids, strict=True):
                card = source.crop(quadrant_box(source.width, source.height, position)).resize(
                    TARGET_SIZE,
                    Image.Resampling.LANCZOS,
                )
                output_path = OUTPUT_DIR / f"c16-vocab-{vocab_id:02d}.webp"
                save_card(card, output_path)
                print(f"saved {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
