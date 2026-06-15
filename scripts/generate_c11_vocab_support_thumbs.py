from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "assets" / "c11" / "vocabulary" / "images" / "split"
OUTPUTS = {
    160: ROOT / "assets" / "c11" / "vocabulary" / "images" / "support-160",
    320: ROOT / "assets" / "c11" / "vocabulary" / "images" / "support-320",
}
WEBP_QUALITY = {
    160: 72,
    320: 76,
}


def save_resized(source_path: Path, size: int) -> None:
    output_dir = OUTPUTS[size]
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / source_path.name
    with Image.open(source_path) as source:
        image = source.convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
        image.save(output_path, "WEBP", quality=WEBP_QUALITY[size], method=6)


def main() -> None:
    if not SOURCE_DIR.exists():
        raise FileNotFoundError(SOURCE_DIR)

    source_files = sorted(SOURCE_DIR.glob("*.webp"))
    if not source_files:
        raise RuntimeError(f"No WebP files found in {SOURCE_DIR}")

    for source_path in source_files:
        for size in OUTPUTS:
            save_resized(source_path, size)

    print(f"generated {len(source_files)} files for each support size")


if __name__ == "__main__":
    main()
