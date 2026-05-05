from __future__ import annotations

import asyncio
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
DATA_JS = ROOT / "assets" / "data.js"
OUT_DIR = ROOT / "assets" / "audio"
FFMPEG = shutil.which("ffmpeg")
VOICE_PROFILES = {
    "\uc5ec": {"voice": "ko-KR-SunHiNeural", "rate": "-3%", "volume": "+4%", "pitch": "-6Hz"},
    "\ub0a8": {"voice": "ko-KR-InJoonNeural", "rate": "-4%", "volume": "+3%", "pitch": "-2Hz"},
    "default": {"voice": "ko-KR-HyunsuMultilingualNeural", "rate": "-3%", "volume": "+2%", "pitch": "+0Hz"},
}
TURN_PAUSE_SECONDS = 0.46
SENTENCE_PAUSE_SECONDS = 0.24
LONG_SENTENCE_THRESHOLD = 72


NODE_DUMP_SCRIPT = r"""
const fs = require("fs");
const vm = require("vm");
global.window = {};
const file = process.argv[1];
const source = fs.readFileSync(file, "utf8");
vm.runInThisContext(source, { filename: file });
const questions = window.REVIEW5_DATA.sections.listening.questions.map((question) => ({
  id: question.id,
  audio: question.audio || null,
}));
console.log(JSON.stringify(questions));
"""


def load_listening_questions() -> list[dict]:
    completed = subprocess.run(
        ["node", "-e", NODE_DUMP_SCRIPT, str(DATA_JS)],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    questions = json.loads(completed.stdout)
    return [question for question in questions if question.get("audio", {}).get("transcript")]


def speaker_voice(speaker: str) -> str:
    return VOICE_PROFILES.get(speaker, VOICE_PROFILES["default"])["voice"]

def speaker_profile(speaker: str) -> dict:
    return VOICE_PROFILES.get(speaker, VOICE_PROFILES["default"])


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def split_sentences(text: str) -> list[str]:
    normalized = normalize_text(text)
    pieces = [piece.strip() for piece in re.split(r"(?<=[.!?])\s+", normalized) if piece.strip()]
    refined: list[str] = []
    for piece in pieces:
        if len(piece) > LONG_SENTENCE_THRESHOLD and "," in piece:
            sub_pieces = [chunk.strip() for chunk in piece.split(",") if chunk.strip()]
            for index, chunk in enumerate(sub_pieces):
                refined.append(chunk + ("," if index < len(sub_pieces) - 1 else ""))
        else:
            refined.append(piece)
    return refined or [normalized]


async def synthesize_segment(text: str, profile: dict, out_path: Path) -> None:
    communicate = edge_tts.Communicate(
        text=normalize_text(text),
        voice=profile["voice"],
        rate=profile["rate"],
        volume=profile["volume"],
        pitch=profile["pitch"],
    )
    await communicate.save(str(out_path))


def write_concat_list(files: list[Path], list_path: Path) -> None:
    lines = []
    for file_path in files:
        escaped = file_path.resolve().as_posix().replace("'", r"'\''")
        lines.append(f"file '{escaped}'")
    list_path.write_text("\n".join(lines), encoding="utf-8")


def make_silence_file(path: Path, seconds: float) -> None:
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            str(seconds),
            "-q:a",
            "9",
            "-acodec",
            "libmp3lame",
            str(path),
        ],
        check=True,
        capture_output=True,
    )


def concat_audio(parts: list[Path], output_path: Path, list_path: Path) -> None:
    write_concat_list(parts, list_path)
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_path),
            "-af",
            "loudnorm=I=-16:LRA=10:TP=-1.5",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "160k",
            "-ar",
            "44100",
            str(output_path),
        ],
        check=True,
        capture_output=True,
    )


async def build_question_audio(question: dict, temp_dir: Path, short_silence: Path, turn_silence: Path) -> Path:
    question_id = question["id"]
    transcript = question["audio"]["transcript"]
    parts: list[Path] = []
    segment_index = 0
    for turn_index, item in enumerate(transcript):
        profile = speaker_profile(item.get("speaker", ""))
        sentences = split_sentences(item["text"])
        for sentence_index, sentence in enumerate(sentences):
            segment_path = temp_dir / f"{question_id}_{segment_index:03d}.mp3"
            await synthesize_segment(sentence, profile, segment_path)
            parts.append(segment_path)
            segment_index += 1
            if sentence_index < len(sentences) - 1:
                parts.append(short_silence)
        if turn_index < len(transcript) - 1:
            parts.append(turn_silence)
    output_path = OUT_DIR / f"{question_id}.mp3"
    concat_audio(parts, output_path, temp_dir / f"{question_id}_concat.txt")
    return output_path


async def main() -> None:
    if not FFMPEG:
        raise SystemExit("ffmpeg not found on PATH")

    questions = load_listening_questions()
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="review5_audio_") as temp_root:
        temp_dir = Path(temp_root)
        short_silence = temp_dir / "pause_short.mp3"
        turn_silence = temp_dir / "pause_turn.mp3"
        make_silence_file(short_silence, SENTENCE_PAUSE_SECONDS)
        make_silence_file(turn_silence, TURN_PAUSE_SECONDS)

        for question in questions:
            output_path = await build_question_audio(question, temp_dir, short_silence, turn_silence)
            print(f"created {output_path.name}")


if __name__ == "__main__":
    asyncio.run(main())
