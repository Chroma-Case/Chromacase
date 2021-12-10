from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys

def printing(key, color, duration):
    print(f"key: {key}, c:{color} for {duration / 1000}s")


def main():
    n = Note("fa", (0, 255, 0), 1000, 1000)

    p = Partition("test", [n])

    p.play(printing)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))