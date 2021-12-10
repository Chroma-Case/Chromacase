from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys

import board, neopixel

pixels = neopixel.NeoPixel(board.D18, 20, brightness=0.1)

notePixels = { 'si': [0, 1],
            'la#': [2, 3],
            'la': [4, 5],
            'sol#':[6],
            'sol':[7, 8, 9],
            'fa#':[10],
            'fa':[11, 12, 13],
            'mi':[14, 15, 16],
            're#':[17],
            're':[18, 19],
            'do#':[],
            'do':[]}

async def to_chroma_case(data):
    global pixels

    colored_pixels = notePixels[data["key"].lower()]
    for pixelId in colored_pixels:
        pixels[pixelId] = data["color"]
    await asyncio.sleep(data['duration'] / 1000)
    for pixelId in colored_pixels:
        pixels[pixelId] = 0
        

async def printing(data):
    print(f"key: {data['key']}, c:{data['color']} for {data['duration'] / 1000}s")
    await asyncio.sleep(data['duration'] / 1000)
    print(f"end of {data['key']}")

async def main():
    n = Note(1000, {
        "duration": 1500,
        "color": (0, 255, 0),
        "key": "fa",
    })

    p = Partition("test", 
        [
            n,
            Note(1500, {
                "duration": 2000,
                "color": (255, 0, 0),
                "key": "fa lo",
            })
        ]
    )

    await p.play(to_chroma_case)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))