from __future__ import annotations

import asyncio
from pathlib import Path

import edge_tts


ROOT_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT_DIR / "audio"


LINES = [
    {
        "output": "bus-stop-1.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-4%",
        "pitch": "+0Hz",
        "text": "시골에 내려가자마자 흙냄새가 반기네. 이번 주말은 네 첫 주말농장이라고 생각하면 돼.",
    },
    {
        "output": "bus-stop-2.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-4%",
        "pitch": "+0Hz",
        "text": "처음 농사를 짓는 날이니까 정원부터 밭, 연못까지 천천히 한 바퀴 돌아보자. 직접 채소를 키우는 재미도 오늘 알게 될 거야.",
    },
    {
        "output": "pond-child-1.mp3",
        "voice": "ko-KR-HyunsuMultilingualNeural",
        "rate": "+3%",
        "pitch": "+8Hz",
        "text": "도시에 사는 사촌은 시골이 따분하다고 했지만, 나는 연못만 가도 하루가 금방 지나.",
    },
    {
        "output": "pond-child-2.mp3",
        "voice": "ko-KR-HyunsuMultilingualNeural",
        "rate": "+3%",
        "pitch": "+8Hz",
        "text": "물가에 오래 있으면 공기가 맑다는 말을 왜 하는지 바로 알 수 있어.",
    },
    {
        "output": "porch-aunt-midday-1.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-4%",
        "pitch": "+0Hz",
        "text": "마당이 조금씩 살아나는구나. 이런 날은 일하다 보면 시간 가는 줄 모르지.",
    },
    {
        "output": "porch-aunt-midday-2.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-4%",
        "pitch": "+0Hz",
        "text": "급하게 다 하려 하지 말고, 쉬었다가 다시 손을 대면 채소도 더 잘 큰단다.",
    },
    {
        "output": "porch-aunt-evening-1.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-5%",
        "pitch": "-5Hz",
        "text": "바구니가 묵직하네. 오늘은 정말 시골에 내려온 하루답게 보냈구나.",
    },
    {
        "output": "porch-aunt-evening-2.mp3",
        "voice": "ko-KR-SunHiNeural",
        "rate": "-5%",
        "pitch": "-5Hz",
        "text": "저녁상을 차리고 언덕에서 노을을 보면, 왜 이 동네가 평화롭다고 하는지 알게 될 거야.",
    },
]


async def generate_line(config: dict[str, str]) -> None:
    output_path = AUDIO_DIR / config["output"]
    communicator = edge_tts.Communicate(
        config["text"],
        config["voice"],
        rate=config["rate"],
        pitch=config["pitch"],
    )
    await communicator.save(str(output_path))
    print(f"generated {output_path.name}")


async def main() -> None:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    for line in LINES:
        await generate_line(line)


if __name__ == "__main__":
    asyncio.run(main())
