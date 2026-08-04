"""Cut Review 5 listening clips from the original WB Track 12 recording.

The source track contains the listening directions and the recorded content for
items 1-16, followed by material from the excluded pages 137-139.  The fixed
boundaries below stop each clip in the silent gap before the next item.  Items
13/14 and 15/16 intentionally use the same source ranges because the workbook
uses one dialogue for each pair.

Usage:
    python generate_listening_audio.py --dry-run
    python generate_listening_audio.py --extract
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "audio"
SOURCE_TRACK = Path(
    r"D:\My project 모음\00.my_app_project\서울대 한국어 웹 보조 교재 제작\교과서 소스\음원 모음\2B\00_트랙_전체\WB\Track12.mp3"
)


@dataclass(frozen=True)
class Clip:
    name: str
    source_start: float
    source_end: float
    shared_with: str | None = None


CLIPS = (
    Clip("l1", 0.000, 23.800),
    Clip("l2", 28.700, 43.600),
    Clip("l3", 48.600, 65.300),
    Clip("l4", 67.300, 75.800),
    Clip("l5", 77.800, 98.400),
    Clip("l6", 103.400, 124.500),
    Clip("l7", 126.500, 146.900),
    Clip("l8", 151.900, 175.600),
    Clip("l9", 177.600, 201.600),
    Clip("l10", 206.600, 244.800),
    Clip("l11", 249.700, 294.500),
    Clip("l12", 299.600, 335.700),
    Clip("l13", 340.700, 395.600, shared_with="l14"),
    Clip("l14", 340.700, 395.600, shared_with="l13"),
    Clip("l15", 400.600, 445.400, shared_with="l16"),
    Clip("l16", 400.600, 445.400, shared_with="l15"),
)

DURATION_RE = re.compile(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)")
AUDIO_RE = re.compile(
    r"Audio:\s*([^,]+),\s*(\d+)\s*Hz,\s*(\w+),\s*([^,]+),\s*([\d.]+)\s*kb/s"
)


def resolve_ffmpeg() -> str:
    configured = os.environ.get("REVIEW5_FFMPEG") or os.environ.get("FFMPEG")
    if configured:
        return configured
    discovered = shutil.which("ffmpeg")
    if discovered:
        return discovered
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception as error:  # pragma: no cover - environment-specific fallback
        raise SystemExit(
            "ffmpeg was not found; install ffmpeg or set REVIEW5_FFMPEG"
        ) from error


def run_ffmpeg(ffmpeg: str, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [ffmpeg, "-nostdin", *args],
        check=False,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )


def media_info(ffmpeg: str, path: Path) -> tuple[float, str]:
    result = run_ffmpeg(ffmpeg, "-hide_banner", "-i", str(path), "-f", "null", "-")
    combined = f"{result.stdout}\n{result.stderr}"
    duration_match = DURATION_RE.search(combined)
    if not duration_match:
        raise RuntimeError(f"could not read duration from {path}:\n{combined}")
    duration = (
        int(duration_match.group(1)) * 3600
        + int(duration_match.group(2)) * 60
        + float(duration_match.group(3))
    )
    audio_match = AUDIO_RE.search(combined)
    audio_summary = audio_match.group(0).strip() if audio_match else "audio stream detected"
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg could not decode {path}:\n{combined}")
    return duration, audio_summary


def validate_clips(source: Path, source_duration: float) -> None:
    if len(CLIPS) != 16:
        raise ValueError(f"expected 16 clip definitions, found {len(CLIPS)}")
    names = [clip.name for clip in CLIPS]
    expected_names = [f"l{index}" for index in range(1, 17)]
    if names != expected_names:
        raise ValueError(f"clip names are not contiguous: {names}")

    for clip in CLIPS:
        if clip.source_start < 0:
            raise ValueError(f"{clip.name} starts before the source: {clip.source_start}")
        if clip.source_end <= clip.source_start:
            raise ValueError(f"{clip.name} has a non-positive range")
        if clip.source_end > source_duration + 0.1:
            raise ValueError(
                f"{clip.name} ends at {clip.source_end:.3f}s beyond the "
                f"{source_duration:.3f}s source"
            )


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def output_path(out_dir: Path, clip: Clip) -> Path:
    return out_dir / f"{clip.name}.mp3"


def extract_clip(ffmpeg: str, source: Path, out_dir: Path, clip: Clip) -> Path:
    destination = output_path(out_dir, clip)
    out_dir.mkdir(parents=True, exist_ok=True)
    temporary_name: str | None = None
    try:
        with tempfile.NamedTemporaryFile(
            prefix=f".{clip.name}.", suffix=".mp3", dir=out_dir, delete=False
        ) as temporary:
            temporary_name = temporary.name
        result = run_ffmpeg(
            ffmpeg,
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-ss",
            f"{clip.source_start:.3f}",
            "-to",
            f"{clip.source_end:.3f}",
            "-map",
            "0:a:0",
            "-c",
            "copy",
            "-map_metadata",
            "0",
            temporary_name,
        )
        if result.returncode != 0:
            raise RuntimeError(
                f"ffmpeg failed for {clip.name}:\n{result.stdout}\n{result.stderr}"
            )
        os.replace(temporary_name, destination)
        temporary_name = None
        return destination
    finally:
        if temporary_name:
            Path(temporary_name).unlink(missing_ok=True)


def print_plan(source: Path, source_duration: float) -> None:
    print(f"source={source}")
    print(f"source_duration={source_duration:.3f}s")
    for clip in CLIPS:
        shared = f" shared_with={clip.shared_with}" if clip.shared_with else ""
        print(
            f"{clip.name}.mp3 source_start={clip.source_start:.3f} "
            f"source_end={clip.source_end:.3f} "
            f"duration={clip.source_end - clip.source_start:.3f}{shared}"
        )
    print(f"validated {len(CLIPS)} deterministic clip boundaries")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=SOURCE_TRACK)
    parser.add_argument("--output-dir", type=Path, default=OUT_DIR)
    parser.add_argument(
        "--extract",
        action="store_true",
        help="cut the 16 clips; without this flag only validation is performed",
    )
    parser.add_argument(
        "--dry-run",
        "--validate",
        action="store_true",
        help="validate and print the deterministic plan without writing clips",
    )
    args = parser.parse_args()

    source = args.source.resolve()
    if not source.is_file():
        raise SystemExit(f"source track not found: {source}")

    ffmpeg = resolve_ffmpeg()
    source_duration, source_audio = media_info(ffmpeg, source)
    validate_clips(source, source_duration)
    print_plan(source, source_duration)
    print(f"source_stream={source_audio}")

    if not args.extract:
        return

    for clip in CLIPS:
        destination = extract_clip(ffmpeg, source, args.output_dir, clip)
        duration, audio = media_info(ffmpeg, destination)
        print(
            f"created {destination.name} duration={duration:.3f}s "
            f"sha256={sha256(destination)} stream={audio}"
        )


if __name__ == "__main__":
    main()
