from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys

async def printing(key, color, duration):
    print(f"key: {key}, c:{color} for {duration / 1000}s")
    await asyncio.sleep(duration / 1000)
    print(f"end of {key}")



async def main():
    n = Note("fa", (0, 255, 0), 1000, 7000)

    p = Partition("test", 
    [n,
    Note("fa#", (234, 255, 0), 3000, 2000)]
    )

    await p.play(printing)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))