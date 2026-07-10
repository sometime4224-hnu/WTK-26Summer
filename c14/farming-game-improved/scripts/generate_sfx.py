from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT_DIR / "audio"
SAMPLE_RATE = 44_100


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def envelope(time: float, duration: float, attack: float = 0.004, release: float = 0.05) -> float:
    if duration <= 0:
        return 0.0
    attack = min(attack, duration * 0.5)
    release = min(release, duration * 0.75)
    sustain = max(duration - attack - release, 0.0)

    if time < attack:
        return time / max(attack, 1e-6)
    if time < attack + sustain:
        return 1.0
    fade_time = time - attack - sustain
    return max(0.0, 1.0 - fade_time / max(release, 1e-6))


def synth_tone(
    duration: float,
    start_freq: float,
    end_freq: float | None = None,
    volume: float = 1.0,
    attack: float = 0.004,
    release: float = 0.06,
    vibrato: float = 0.0,
    waveform: str = "sine",
) -> list[float]:
    end_freq = start_freq if end_freq is None else end_freq
    count = max(1, int(duration * SAMPLE_RATE))
    samples: list[float] = []
    phase = 0.0
    for index in range(count):
      time = index / SAMPLE_RATE
      progress = index / max(count - 1, 1)
      frequency = start_freq + (end_freq - start_freq) * progress
      if vibrato:
          frequency *= 1.0 + math.sin(time * math.tau * 5.5) * vibrato
      phase += math.tau * frequency / SAMPLE_RATE
      if waveform == "triangle":
          base = 2.0 * abs(2.0 * ((phase / math.tau) % 1.0) - 1.0) - 1.0
      elif waveform == "softsquare":
          base = math.tanh(math.sin(phase) * 2.8)
      else:
          base = math.sin(phase)
      amp = envelope(time, duration, attack, release) * volume
      samples.append(base * amp)
    return samples


def synth_noise(
    duration: float,
    volume: float = 1.0,
    attack: float = 0.002,
    release: float = 0.05,
    smooth: float = 0.22,
    seed: int = 0,
) -> list[float]:
    count = max(1, int(duration * SAMPLE_RATE))
    rng = random.Random(seed)
    samples: list[float] = []
    filtered = 0.0
    smooth = clamp(smooth, 0.01, 0.95)
    for index in range(count):
        time = index / SAMPLE_RATE
        raw = rng.uniform(-1.0, 1.0)
        filtered += (raw - filtered) * smooth
        amp = envelope(time, duration, attack, release) * volume
        samples.append(filtered * amp)
    return samples


def pitch_drop_click(duration: float, start_freq: float, end_freq: float, volume: float) -> list[float]:
    return synth_tone(duration, start_freq, end_freq, volume=volume, attack=0.001, release=duration * 0.7)


def mix_layers(duration: float, layers: list[tuple[list[float], float]]) -> list[float]:
    count = max(1, int(duration * SAMPLE_RATE))
    mixed = [0.0] * count
    for samples, offset in layers:
        start = int(offset * SAMPLE_RATE)
        if start >= count:
            continue
        for index, sample in enumerate(samples):
            target = start + index
            if target >= count:
                break
            mixed[target] += sample
    peak = max(max(abs(sample) for sample in mixed), 1e-6)
    scale = 0.9 / peak
    return [sample * scale for sample in mixed]


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for sample in samples:
            frames.extend(struct.pack("<h", int(clamp(sample, -1.0, 1.0) * 32767)))
        wav_file.writeframes(frames)


def make_ui_click() -> list[float]:
    duration = 0.13
    return mix_layers(
        duration,
        [
            (synth_tone(0.08, 880, 1080, volume=0.7, release=0.04), 0.0),
            (synth_tone(0.05, 1460, 1320, volume=0.3, release=0.03), 0.025),
        ],
    )


def make_ui_start() -> list[float]:
    duration = 0.48
    return mix_layers(
        duration,
        [
            (synth_tone(0.14, 520, 560, volume=0.48, release=0.08), 0.0),
            (synth_tone(0.14, 660, 710, volume=0.5, release=0.08), 0.12),
            (synth_tone(0.18, 830, 920, volume=0.56, release=0.1), 0.24),
            (synth_tone(0.24, 260, 320, volume=0.18, release=0.18), 0.06),
        ],
    )


def make_day_chime() -> list[float]:
    duration = 0.68
    return mix_layers(
        duration,
        [
            (synth_tone(0.56, 620, 620, volume=0.42, release=0.42, vibrato=0.004), 0.0),
            (synth_tone(0.46, 930, 930, volume=0.24, release=0.32, vibrato=0.006), 0.02),
            (synth_tone(0.36, 1240, 1240, volume=0.16, release=0.24, vibrato=0.004), 0.04),
        ],
    )


def make_task_complete() -> list[float]:
    duration = 0.56
    return mix_layers(
        duration,
        [
            (synth_tone(0.12, 620, 700, volume=0.5, release=0.08), 0.0),
            (synth_tone(0.12, 790, 880, volume=0.56, release=0.08), 0.13),
            (synth_tone(0.2, 980, 1160, volume=0.62, release=0.14), 0.26),
            (synth_tone(0.26, 490, 620, volume=0.2, release=0.18), 0.14),
        ],
    )


def make_equip_tool() -> list[float]:
    duration = 0.2
    return mix_layers(
        duration,
        [
            (pitch_drop_click(0.12, 240, 120, 0.44), 0.0),
            (synth_noise(0.08, volume=0.18, release=0.04, smooth=0.18, seed=11), 0.018),
            (synth_tone(0.05, 980, 860, volume=0.16, release=0.03), 0.045),
        ],
    )


def make_shears_trim() -> list[float]:
    duration = 0.16
    return mix_layers(
        duration,
        [
            (pitch_drop_click(0.05, 2100, 1460, 0.36), 0.0),
            (pitch_drop_click(0.05, 1760, 1180, 0.3), 0.04),
            (synth_noise(0.08, volume=0.18, release=0.04, smooth=0.12, seed=21), 0.01),
        ],
    )


def make_mower_pass() -> list[float]:
    duration = 0.28
    return mix_layers(
        duration,
        [
            (synth_tone(0.26, 126, 98, volume=0.38, release=0.09, vibrato=0.05, waveform="softsquare"), 0.0),
            (synth_noise(0.24, volume=0.18, release=0.08, smooth=0.06, seed=31), 0.0),
            (synth_tone(0.12, 420, 340, volume=0.14, release=0.06), 0.05),
        ],
    )


def make_plant_pop() -> list[float]:
    duration = 0.2
    return mix_layers(
        duration,
        [
            (pitch_drop_click(0.1, 220, 110, 0.4), 0.0),
            (synth_noise(0.06, volume=0.18, release=0.04, smooth=0.18, seed=41), 0.016),
            (synth_tone(0.06, 660, 760, volume=0.16, release=0.03), 0.035),
        ],
    )


def make_water_pour() -> list[float]:
    duration = 0.38
    return mix_layers(
        duration,
        [
            (synth_noise(0.34, volume=0.18, release=0.1, smooth=0.08, seed=51), 0.0),
            (pitch_drop_click(0.09, 460, 180, 0.18), 0.09),
            (pitch_drop_click(0.08, 540, 210, 0.14), 0.18),
            (pitch_drop_click(0.07, 380, 160, 0.12), 0.27),
        ],
    )


def make_hoe_dig() -> list[float]:
    duration = 0.24
    return mix_layers(
        duration,
        [
            (synth_noise(0.12, volume=0.22, release=0.05, smooth=0.08, seed=61), 0.0),
            (pitch_drop_click(0.1, 280, 120, 0.34), 0.03),
            (synth_tone(0.06, 720, 560, volume=0.12, release=0.03), 0.06),
        ],
    )


def make_feed_pour() -> list[float]:
    duration = 0.28
    layers: list[tuple[list[float], float]] = []
    for index, offset in enumerate([0.02, 0.06, 0.1, 0.135, 0.17]):
        layers.append((pitch_drop_click(0.06, 520 - index * 34, 180, 0.14), offset))
    layers.append((synth_noise(0.18, volume=0.18, release=0.08, smooth=0.15, seed=71), 0.03))
    layers.append((pitch_drop_click(0.1, 240, 110, 0.26), 0.0))
    return mix_layers(duration, layers)


def make_fish_cast() -> list[float]:
    duration = 0.42
    return mix_layers(
        duration,
        [
            (synth_noise(0.24, volume=0.2, release=0.08, smooth=0.05, seed=81), 0.0),
            (pitch_drop_click(0.12, 620, 180, 0.2), 0.2),
            (synth_tone(0.08, 840, 620, volume=0.1, release=0.05), 0.16),
        ],
    )


def make_fish_hook() -> list[float]:
    duration = 0.34
    return mix_layers(
        duration,
        [
            (synth_tone(0.12, 420, 660, volume=0.28, release=0.08), 0.0),
            (synth_noise(0.18, volume=0.16, release=0.08, smooth=0.06, seed=91), 0.08),
            (pitch_drop_click(0.1, 560, 200, 0.18), 0.11),
        ],
    )


def make_basket_drop() -> list[float]:
    duration = 0.24
    return mix_layers(
        duration,
        [
            (pitch_drop_click(0.11, 300, 120, 0.34), 0.0),
            (synth_noise(0.08, volume=0.12, release=0.04, smooth=0.12, seed=101), 0.03),
            (pitch_drop_click(0.08, 520, 180, 0.12), 0.06),
        ],
    )


def make_nature_rustle() -> list[float]:
    duration = 0.34
    return mix_layers(
        duration,
        [
            (synth_noise(0.28, volume=0.18, release=0.08, smooth=0.08, seed=111), 0.0),
            (pitch_drop_click(0.07, 920, 420, 0.12), 0.06),
            (pitch_drop_click(0.06, 740, 320, 0.1), 0.16),
        ],
    )


def make_nature_shimmer() -> list[float]:
    duration = 0.42
    return mix_layers(
        duration,
        [
            (synth_tone(0.12, 1280, 1420, volume=0.22, release=0.08), 0.0),
            (synth_tone(0.1, 1580, 1740, volume=0.16, release=0.07), 0.1),
            (synth_tone(0.12, 1900, 2080, volume=0.12, release=0.08), 0.2),
            (synth_tone(0.28, 760, 860, volume=0.08, release=0.18, vibrato=0.01), 0.04),
        ],
    )


def make_bird_flutter() -> list[float]:
    duration = 0.24
    layers: list[tuple[list[float], float]] = []
    for index, offset in enumerate([0.0, 0.03, 0.06, 0.09, 0.12]):
        layers.append((synth_noise(0.035, volume=0.12, release=0.015, smooth=0.04, seed=121 + index), offset))
    layers.append((synth_tone(0.08, 960, 1220, volume=0.14, release=0.05), 0.1))
    return mix_layers(duration, layers)


SFX_BUILDERS = {
    "sfx-ui-click.wav": make_ui_click,
    "sfx-ui-start.wav": make_ui_start,
    "sfx-day-chime.wav": make_day_chime,
    "sfx-task-complete.wav": make_task_complete,
    "sfx-equip-tool.wav": make_equip_tool,
    "sfx-shears-trim.wav": make_shears_trim,
    "sfx-mower-pass.wav": make_mower_pass,
    "sfx-plant-pop.wav": make_plant_pop,
    "sfx-water-pour.wav": make_water_pour,
    "sfx-hoe-dig.wav": make_hoe_dig,
    "sfx-feed-pour.wav": make_feed_pour,
    "sfx-fish-cast.wav": make_fish_cast,
    "sfx-fish-hook.wav": make_fish_hook,
    "sfx-basket-drop.wav": make_basket_drop,
    "sfx-nature-rustle.wav": make_nature_rustle,
    "sfx-nature-shimmer.wav": make_nature_shimmer,
    "sfx-bird-flutter.wav": make_bird_flutter,
}


def main() -> None:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    for name, builder in SFX_BUILDERS.items():
        output_path = AUDIO_DIR / name
        write_wav(output_path, builder())
        print(f"generated {output_path.name}")


if __name__ == "__main__":
    main()
