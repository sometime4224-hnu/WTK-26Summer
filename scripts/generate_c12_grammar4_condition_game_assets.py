from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE_DIR = ROOT / "backup" / "asset-sources" / "c12" / "grammar4-condition-game" / "source-sheets"
DEFAULT_OUTPUT_DIR = ROOT / "assets" / "c12" / "grammar" / "images" / "grammar4-condition-game" / "choices"
CARD_SIZE = (384, 384)
WEBP_QUALITY = 76
POSITIONS = ("tl", "tr", "bl", "br")


SHEETS: list[dict[str, Any]] = [
    {
        "roundId": "graduation",
        "sourceFile": "01-graduation.png",
        "items": [
            {"id": "graduation-credits", "slug": "graduation-credits", "label": "졸업 학점 채우기", "required": True},
            {"id": "graduation-exam", "slug": "graduation-exam", "label": "졸업시험 통과", "required": True},
            {"id": "library-books-return", "slug": "library-books-return", "label": "빌린 책 반납", "required": True},
            {"id": "club-party", "slug": "club-party", "label": "동아리 파티 참석", "required": False},
        ],
    },
    {
        "roundId": "international-student-work",
        "sourceFile": "02-international-student-work.png",
        "items": [
            {"id": "school-office-check", "slug": "school-office-check", "label": "학교 담당자 확인", "required": True},
            {"id": "korean-level-check", "slug": "korean-level-check", "label": "한국어 능력 기준 확인", "required": True},
            {"id": "work-permission", "slug": "work-permission", "label": "시간제 취업 허가", "required": True},
            {"id": "friend-recommendation", "slug": "friend-recommendation", "label": "친구 추천만 받기", "required": False},
        ],
    },
    {
        "roundId": "university-admission",
        "sourceFile": "03-university-admission.png",
        "items": [
            {"id": "application-form", "slug": "application-form", "label": "입학원서 제출", "required": True},
            {"id": "graduation-certificate", "slug": "graduation-certificate", "label": "졸업증명서", "required": True},
            {"id": "academic-transcript", "slug": "academic-transcript", "label": "성적증명서", "required": True},
            {"id": "concert-ticket", "slug": "concert-ticket", "label": "공연 티켓", "required": False},
        ],
    },
    {
        "roundId": "overseas-travel",
        "sourceFile": "04-overseas-travel.png",
        "items": [
            {"id": "passport", "slug": "passport", "label": "여권", "required": True},
            {"id": "entry-permission", "slug": "entry-permission", "label": "비자/입국허가 필요 여부", "required": True},
            {"id": "travel-safety", "slug": "travel-safety", "label": "여행 안전 정보 확인", "required": True},
            {"id": "expensive-sunglasses", "slug": "expensive-sunglasses", "label": "선글라스 준비", "required": False},
        ],
    },
    {
        "roundId": "library-entry",
        "sourceFile": "05-library-entry.png",
        "items": [
            {"id": "student-or-member-card", "slug": "student-or-member-card", "label": "학생증/회원증", "required": True},
            {"id": "seat-reservation", "slug": "seat-reservation", "label": "좌석 예약", "required": True},
            {"id": "snacks", "slug": "snacks", "label": "간식 준비", "required": False},
            {"id": "game-console", "slug": "game-console", "label": "쉬는 시간 게임기", "required": False},
        ],
    },
    {
        "roundId": "driving-in-korea",
        "sourceFile": "06-driving-in-korea.png",
        "items": [
            {"id": "valid-driver-license", "slug": "valid-driver-license", "label": "유효한 운전면허증", "required": True},
            {"id": "insured-car", "slug": "insured-car", "label": "보험 가입 차량", "required": True},
            {"id": "transit-card", "slug": "transit-card", "label": "교통카드", "required": False},
            {"id": "student-id", "slug": "student-id", "label": "학생증", "required": False},
        ],
    },
    {
        "roundId": "health-checkup",
        "sourceFile": "07-health-checkup.png",
        "items": [
            {"id": "appointment-confirmation", "slug": "appointment-confirmation", "label": "예약 확인", "required": True},
            {"id": "clinic-id-card", "slug": "clinic-id-card", "label": "신분증", "required": True},
            {"id": "comfortable-clothes", "slug": "comfortable-clothes", "label": "편한 옷", "required": False},
            {"id": "checkup-snack", "slug": "checkup-snack", "label": "간식", "required": False},
        ],
    },
    {
        "roundId": "concert-entry",
        "sourceFile": "08-concert-entry.png",
        "items": [
            {"id": "mobile-ticket", "slug": "mobile-ticket", "label": "모바일 티켓", "required": True},
            {"id": "cheering-light-stick", "slug": "cheering-light-stick", "label": "응원봉", "required": False},
            {"id": "camera", "slug": "camera", "label": "카메라", "required": False},
            {"id": "concert-snack", "slug": "concert-snack", "label": "간식", "required": False},
        ],
    },
    {
        "roundId": "gym-registration",
        "sourceFile": "09-gym-registration.png",
        "items": [
            {"id": "gym-membership", "slug": "gym-membership", "label": "회원권", "required": True},
            {"id": "indoor-shoes", "slug": "indoor-shoes", "label": "실내 운동화", "required": True},
            {"id": "coffee", "slug": "coffee", "label": "커피", "required": False},
            {"id": "gym-game-console", "slug": "gym-game-console", "label": "게임기", "required": False},
        ],
    },
    {
        "roundId": "bank-account",
        "sourceFile": "10-bank-account.png",
        "items": [
            {"id": "bank-id-card", "slug": "bank-id-card", "label": "신분증", "required": True},
            {"id": "working-phone", "slug": "working-phone", "label": "연락 가능한 휴대전화", "required": True},
            {"id": "gift-wrap", "slug": "gift-wrap", "label": "선물 포장", "required": False},
            {"id": "travel-suitcase", "slug": "travel-suitcase", "label": "여행 가방", "required": False},
        ],
    },
    {
        "roundId": "parcel-delivery",
        "sourceFile": "11-parcel-delivery.png",
        "items": [
            {"id": "package-box", "slug": "package-box", "label": "물건 포장", "required": True},
            {"id": "address-check", "slug": "address-check", "label": "주소 확인", "required": True},
            {"id": "shipping-payment", "slug": "shipping-payment", "label": "배송비 결제", "required": True},
            {"id": "decorative-stickers", "slug": "decorative-stickers", "label": "장식 스티커", "required": False},
        ],
    },
    {
        "roundId": "dormitory-move-in",
        "sourceFile": "12-dormitory-move-in.png",
        "items": [
            {"id": "move-in-confirmation", "slug": "move-in-confirmation", "label": "입사 확인서", "required": True},
            {"id": "payment-confirmation", "slug": "payment-confirmation", "label": "납부 확인", "required": True},
            {"id": "health-document", "slug": "health-document", "label": "건강 확인 서류", "required": True},
            {"id": "stuffed-doll", "slug": "stuffed-doll", "label": "인형", "required": False},
        ],
    },
    {
        "roundId": "online-exam",
        "sourceFile": "13-online-exam.png",
        "items": [
            {"id": "stable-internet", "slug": "stable-internet", "label": "안정적인 인터넷", "required": True},
            {"id": "exam-snack", "slug": "exam-snack", "label": "간식", "required": False},
            {"id": "new-outfit", "slug": "new-outfit", "label": "새 옷", "required": False},
            {"id": "music-app", "slug": "music-app", "label": "음악 앱", "required": False},
        ],
    },
    {
        "roundId": "restaurant-reservation",
        "sourceFile": "14-restaurant-reservation.png",
        "items": [
            {"id": "reservation-check", "slug": "reservation-check", "label": "예약 확인", "required": True},
            {"id": "arrive-on-time", "slug": "arrive-on-time", "label": "시간 맞춰 도착", "required": True},
            {"id": "flowers", "slug": "flowers", "label": "꽃다발", "required": False},
            {"id": "discount-coupon", "slug": "discount-coupon", "label": "할인 쿠폰", "required": False},
        ],
    },
    {
        "roundId": "hospital-registration",
        "sourceFile": "15-hospital-registration.png",
        "items": [
            {"id": "hospital-id-card", "slug": "hospital-id-card", "label": "신분증", "required": True},
            {"id": "symptom-explanation", "slug": "symptom-explanation", "label": "증상 설명", "required": True},
            {"id": "clinic-payment", "slug": "clinic-payment", "label": "진료비 결제 준비", "required": True},
            {"id": "magazine", "slug": "magazine", "label": "잡지", "required": False},
        ],
    },
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Slice C12 grammar4 condition game source sheets into WebP cards.")
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE_DIR)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    return parser.parse_args()


def crop_box(width: int, height: int, position: str) -> tuple[int, int, int, int]:
    half_w = width // 2
    half_h = height // 2
    if position == "tl":
        return (0, 0, half_w, half_h)
    if position == "tr":
        return (half_w, 0, width, half_h)
    if position == "bl":
        return (0, half_h, half_w, height)
    if position == "br":
        return (half_w, half_h, width, height)
    raise ValueError(f"Unknown position: {position}")


def build_filename(round_index: int, item_index: int, slug: str) -> str:
    return f"c12g4cg_{round_index:02d}_{item_index:02d}_{slug}.webp"


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    manifest_items: list[dict[str, Any]] = []

    for round_index, sheet in enumerate(SHEETS, start=1):
        source_path = args.source_dir / sheet["sourceFile"]
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        with Image.open(source_path) as source:
            source_rgb = source.convert("RGB")
            for item_index, (position, item) in enumerate(zip(POSITIONS, sheet["items"], strict=True), start=1):
                crop = source_rgb.crop(crop_box(source_rgb.width, source_rgb.height, position))
                card = crop.resize(CARD_SIZE, Image.Resampling.LANCZOS)
                filename = build_filename(round_index, item_index, item["slug"])
                output_path = args.output_dir / filename
                card.save(output_path, "WEBP", quality=WEBP_QUALITY, method=6)

                manifest_items.append(
                    {
                        "id": item["id"],
                        "roundId": sheet["roundId"],
                        "label": item["label"],
                        "required": item["required"],
                        "sourceFile": sheet["sourceFile"],
                        "sourceIndex": round_index,
                        "position": position,
                        "filename": filename,
                        "src": f"../assets/c12/grammar/images/grammar4-condition-game/choices/{filename}",
                        "width": CARD_SIZE[0],
                        "height": CARD_SIZE[1],
                        "bytes": output_path.stat().st_size,
                    }
                )
                print(f"{round_index:02d}-{item_index:02d} {item['label']} -> {output_path.relative_to(ROOT)}")

    manifest = {
        "activity": "c12-grammar4-condition-game",
        "cardSize": CARD_SIZE[0],
        "webpQuality": WEBP_QUALITY,
        "count": len(manifest_items),
        "totalBytes": sum(item["bytes"] for item in manifest_items),
        "items": manifest_items,
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Manifest -> {manifest_path.relative_to(ROOT)}")
    print(f"Total WebP bytes -> {manifest['totalBytes']}")


if __name__ == "__main__":
    main()
