from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path


SCRIPT_PATH = Path(__file__).resolve()
REVIEW_ROOT = SCRIPT_PATH.parents[1]
APP_PROJECT_ROOT = SCRIPT_PATH.parents[4]
MANIFEST_PATH = REVIEW_ROOT / "assets" / "listening-original-audio.js"
DEFAULT_SOURCE = (
    APP_PROJECT_ROOT
    / "서울대 한국어 웹 보조 교재 제작"
    / "교과서 소스"
    / "음원 모음"
    / "3B"
    / "00_트랙_전체"
    / "WB"
    / "Seoul Univ_3B_Work Book_Trk_05.mp3"
)
DEFAULT_OUT_DIR = REVIEW_ROOT / "assets" / "audio" / "original"

BITRATES = {
    ("1", "1"): [None, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, None],
    ("1", "2"): [None, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, None],
    ("1", "3"): [None, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, None],
    ("2", "1"): [None, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, None],
    ("2", "2"): [None, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, None],
    ("2", "3"): [None, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, None],
}
SAMPLE_RATES = {
    "1": [44100, 48000, 32000, None],
    "2": [22050, 24000, 16000, None],
    "2.5": [11025, 12000, 8000, None],
}
SAMPLES_PER_FRAME = {
    ("1", "1"): 384,
    ("1", "2"): 1152,
    ("1", "3"): 1152,
    ("2", "1"): 384,
    ("2", "2"): 1152,
    ("2", "3"): 576,
    ("2.5", "1"): 384,
    ("2.5", "2"): 1152,
    ("2.5", "3"): 576,
}


@dataclass
class Frame:
    offset: int
    end: int
    start_time: float
    end_time: float


def load_manifest(path: Path) -> dict:
    source = path.read_text(encoding="utf-8")
    match = re.search(r"window\.REVIEW4_ORIGINAL_AUDIO\s*=\s*(\{.*?\});", source, re.S)
    if not match:
        raise ValueError(f"Cannot find REVIEW4_ORIGINAL_AUDIO object in {path}")
    return json.loads(match.group(1))


def ffmpeg_path() -> str | None:
    return shutil.which("ffmpeg")


def split_with_ffmpeg(source: Path, out_dir: Path, clips: list[dict], force: bool) -> bool:
    ffmpeg = ffmpeg_path()
    if not ffmpeg:
        return False

    out_dir.mkdir(parents=True, exist_ok=True)
    for clip in clips:
        output = out_dir / Path(clip["file"]).name
        if output.exists() and not force:
            print(f"kept {output.name}")
            continue
        duration = float(clip["end"]) - float(clip["start"])
        subprocess.run(
            [
                ffmpeg,
                "-y",
                "-ss",
                f"{float(clip['start']):.3f}",
                "-i",
                str(source),
                "-t",
                f"{duration:.3f}",
                "-c",
                "copy",
                str(output),
            ],
            check=True,
            capture_output=True,
        )
        print(f"created {output.name} via ffmpeg")
    return True


def skip_id3(data: bytes) -> int:
    if data[:3] != b"ID3" or len(data) < 10:
        return 0
    size = 0
    for value in data[6:10]:
        size = (size << 7) | (value & 0x7F)
    return 10 + size


def parse_frames(data: bytes) -> list[Frame]:
    index = skip_id3(data)
    current_time = 0.0
    frames: list[Frame] = []

    while index + 4 <= len(data):
        if data[index] != 0xFF or (data[index + 1] & 0xE0) != 0xE0:
            index += 1
            continue

        version_bits = (data[index + 1] >> 3) & 0x03
        layer_bits = (data[index + 1] >> 1) & 0x03
        bitrate_index = (data[index + 2] >> 4) & 0x0F
        sample_index = (data[index + 2] >> 2) & 0x03
        padding = (data[index + 2] >> 1) & 0x01

        version = {0: "2.5", 2: "2", 3: "1"}.get(version_bits)
        layer = {1: "3", 2: "2", 3: "1"}.get(layer_bits)
        if not version or not layer:
            index += 1
            continue

        bitrate_key = ("2" if version in ("2", "2.5") else "1", layer)
        bitrate = BITRATES[bitrate_key][bitrate_index]
        sample_rate = SAMPLE_RATES[version][sample_index]
        if not bitrate or not sample_rate:
            index += 1
            continue

        bitrate_bps = bitrate * 1000
        if layer == "1":
            frame_length = int((12 * bitrate_bps / sample_rate + padding) * 4)
        else:
            coefficient = 72 if version in ("2", "2.5") and layer == "3" else 144
            frame_length = int(coefficient * bitrate_bps / sample_rate + padding)
        if frame_length <= 4 or index + frame_length > len(data):
            index += 1
            continue

        frame_duration = SAMPLES_PER_FRAME[(version, layer)] / sample_rate
        frames.append(Frame(index, index + frame_length, current_time, current_time + frame_duration))
        current_time += frame_duration
        index += frame_length

    if not frames:
        raise ValueError("No MP3 frames found")
    return frames


def split_by_frames(source: Path, out_dir: Path, clips: list[dict], force: bool) -> None:
    data = source.read_bytes()
    frames = parse_frames(data)
    out_dir.mkdir(parents=True, exist_ok=True)

    for clip in clips:
        output = out_dir / Path(clip["file"]).name
        if output.exists() and not force:
            print(f"kept {output.name}")
            continue

        start = float(clip["start"])
        end = float(clip["end"])
        selected = [frame for frame in frames if frame.end_time > start and frame.start_time < end]
        if not selected:
            raise ValueError(f"No frames selected for {clip['id']}")

        output.write_bytes(data[selected[0].offset : selected[-1].end])
        actual_duration = selected[-1].end_time - selected[0].start_time
        print(f"created {output.name} via frame split ({actual_duration:.2f}s)")


def main() -> None:
    parser = argparse.ArgumentParser(description="Slice review 4 listening original audio into question clips.")
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Original WB Track 05 MP3")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR, help="Output folder")
    parser.add_argument("--force", action="store_true", help="Overwrite existing clips")
    args = parser.parse_args()

    manifest = load_manifest(MANIFEST_PATH)
    clips = manifest.get("clips") or []
    if not clips:
        raise SystemExit("No clips found in manifest")

    source = args.source
    if not source.exists():
        raise SystemExit(f"Source audio not found: {source}")

    if split_with_ffmpeg(source, args.out_dir, clips, args.force):
        return

    print("ffmpeg not found; using MP3 frame-boundary fallback")
    split_by_frames(source, args.out_dir, clips, args.force)


if __name__ == "__main__":
    main()
