from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = Path(r"C:\Users\somet\Downloads")
OUTPUT_BASE = ROOT / "assets" / "c11" / "vocabulary" / "images"
RANK_SOURCE = ROOT / "backup" / "asset-sources" / "c11" / "vocabulary" / "rank-hierarchy-source.png"
TARGET_SIZE = 512
WEBP_QUALITY = 72
POSITIONS = ("TL", "TR", "BL", "BR")
FONT_BOLD = Path(r"C:\Windows\Fonts\malgunbd.ttf")

SHEETS = {
    1: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_20 (6).png",
        "words": ["부장", "대기업", "중소기업", "연봉이 높다"],
    },
    2: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_18 (1).png",
        "words": ["아르바이트", "근무 시간", "업무", "시급"],
    },
    3: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_18 (2).png",
        "words": ["성별", "연령", "성실하다", "꼼꼼하다"],
    },
    4: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_19 (3).png",
        "words": ["경험이 많다", "실력이 있다", "이해가 빠르다", "최선을 다하다"],
    },
    5: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_19 (4).png",
        "words": ["보고서 작성을 잘하다", "대인 관계가 원만하다", "신입 사원", "동료"],
    },
    6: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_19 (5).png",
        "words": ["직장 상사", "부하 직원", "대리", "과장"],
    },
    7: {
        "source": "ChatGPT Image 2026년 6월 10일 오후 04_55_20 (7).png",
        "words": ["출퇴근 시간이 자유롭다", "승진 기회가 많다", "휴가가 길다", ""],
    },
}

RANK_REPLACEMENTS = {
    (1, "TL"): ("TL", "부장"),
    (6, "BL"): ("BL", "대리"),
    (6, "BR"): ("TR", "과장"),
}

INITIALS = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
]


def source_path(sheet_number: int) -> Path:
    return SOURCE_DIR / str(SHEETS[sheet_number]["source"])


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


def detect_label_rect(image: Image.Image) -> tuple[int, int, int, int]:
    arr = np.asarray(image.convert("RGB"))
    height, width, _ = arr.shape
    search_w = min(width, int(width * 0.58))
    search_h = min(height, int(height * 0.22))
    search = arr[:search_h, :search_w]
    hsv = cv2.cvtColor(search, cv2.COLOR_RGB2HSV)
    white_mask = ((hsv[:, :, 1] < 52) & (hsv[:, :, 2] > 222)).astype(np.uint8) * 255
    kernel = np.ones((5, 5), np.uint8)
    white_mask = cv2.morphologyEx(white_mask, cv2.MORPH_CLOSE, kernel)
    contours, _ = cv2.findContours(white_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    candidates: list[tuple[float, tuple[int, int, int, int]]] = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = float(cv2.contourArea(contour))
        if area < 900:
            continue
        if not (55 <= w <= int(width * 0.55) and 30 <= h <= int(height * 0.16)):
            continue
        if x > int(width * 0.18) or y > int(height * 0.08):
            continue
        score = area + (int(width * 0.5) - x) * 2 - y * 8
        candidates.append((score, (x, y, x + w, y + h)))

    if candidates:
        _, (left, top, right, bottom) = max(candidates, key=lambda item: item[0])
    else:
        left, top = int(width * 0.025), int(height * 0.02)
        right, bottom = int(width * 0.42), int(height * 0.13)

    pad_x = int(width * 0.018)
    pad_y = int(height * 0.018)
    return (
        max(0, left - pad_x),
        max(0, top - pad_y),
        min(width, right + pad_x),
        min(height, bottom + pad_y),
    )


def remove_label(image: Image.Image, word: str) -> Image.Image:
    if not word:
        return image.convert("RGB")
    rgb = image.convert("RGB")
    left, top, right, bottom = detect_label_rect(rgb)
    visual_len = sum(0.6 if char == " " else 1 for char in word)
    expected_width = int(min(rgb.width * 0.68, max(right - left, 80 + visual_len * 30)))
    right = min(rgb.width, max(right, left + expected_width))
    bottom = min(rgb.height, max(bottom, top + int(rgb.height * 0.13)))
    arr = cv2.cvtColor(np.asarray(rgb), cv2.COLOR_RGB2BGR)
    mask = np.zeros(arr.shape[:2], dtype=np.uint8)
    mask[top:bottom, left:right] = 255
    mask = cv2.dilate(mask, np.ones((7, 7), np.uint8), iterations=1)
    inpainted = cv2.inpaint(arr, mask, 4, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(inpainted, cv2.COLOR_BGR2RGB))


def extract_initials(text: str) -> str:
    parts: list[str] = []
    for char in text:
        code = ord(char)
        if char == " ":
            parts.append(" ")
        elif 0xAC00 <= code <= 0xD7A3:
            parts.append(INITIALS[(code - 0xAC00) // 588])
        else:
            parts.append(char)
    return "".join(parts)


def choose_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD), size=size)


def font_for_text(draw: ImageDraw.ImageDraw, text: str, max_width: int) -> ImageFont.FreeTypeFont:
    for size in range(42, 21, -2):
        font = choose_font(size)
        width = draw.textbbox((0, 0), text, font=font)[2]
        if width <= max_width:
            return font
    return choose_font(22)


def apply_choseong_overlay(image: Image.Image, word: str) -> Image.Image:
    if not word:
        return image.copy()
    result = image.copy()
    draw = ImageDraw.Draw(result)
    text = f"[{extract_initials(word)}]"
    x = int(result.width * 0.04)
    y = int(result.height * 0.045)
    font = font_for_text(draw, text, int(result.width * 0.78))
    draw.text((x, y), text, fill=(20, 20, 20), font=font, stroke_width=4, stroke_fill=(255, 255, 255))
    return result


def save_webp(image: Image.Image, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image.save(output_path, format="WEBP", quality=WEBP_QUALITY, method=6)


def build_card(sheet_number: int, position: str, word: str) -> Image.Image:
    rank_replacement = RANK_REPLACEMENTS.get((sheet_number, position))
    if rank_replacement:
        rank_position, expected_word = rank_replacement
        if word != expected_word:
            raise ValueError(f"Rank replacement mismatch: expected {expected_word}, got {word}")
        if not RANK_SOURCE.exists():
            raise FileNotFoundError(RANK_SOURCE)
        with Image.open(RANK_SOURCE) as source:
            source = source.convert("RGB")
            crop = source.crop(crop_box(source.width, source.height, rank_position))
        return crop.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)

    with Image.open(source_path(sheet_number)) as source:
        source = source.convert("RGB")
        crop = source.crop(crop_box(source.width, source.height, position))
    cleaned = remove_label(crop, word)
    return cleaned.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)


def main() -> None:
    generated = 0
    for sheet_number, sheet in SHEETS.items():
        path = source_path(sheet_number)
        if not path.exists():
            raise FileNotFoundError(path)
        for position, word in zip(POSITIONS, sheet["words"], strict=True):
            base_name = f"c11_{sheet_number:02d}_{position}.webp"
            card = build_card(sheet_number, position, word)
            save_webp(card, OUTPUT_BASE / "split" / base_name)
            save_webp(card, OUTPUT_BASE / "masked" / base_name.replace(".webp", "_masked.webp"))
            save_webp(apply_choseong_overlay(card, word), OUTPUT_BASE / "choseong" / base_name)
            generated += 3
            print(f"{sheet_number:02d}_{position} {word or '(unused)'}")

    print(f"Generated {generated} c11 vocabulary WebP assets.")


if __name__ == "__main__":
    main()
