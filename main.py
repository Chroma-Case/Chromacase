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

def hue_to_rgb(t1, t2, hue):
    if hue < 0: hue += 6
    if hue >= 6: hue -= 6
    if hue < 1: return (t2 - t1) * hue + t1
    if hue < 3: return t2
    if hue < 4: return (t2 - t1) * (4 - hue) + t1
    return t1

def hsl_to_rgb(hue, sat, light):
    hue /= 60
    if light <= 0.5:
        t2 = light * (sat + 1)
    else:
        t2 = light + sat - (light * sat)
    t1 = light * 2 - t2

    r = hue_to_rgb(t1, t2, hue + 2) * 255,
    g = hue_to_rgb(t1, t2, hue) * 255,
    b = hue_to_rgb(t1, t2, hue - 2) * 255
    return (round(r), round(g), round(b))

async def to_chroma_case(data):
    global pixels

    hsl_starting_color = (55, 1, 0)

    colored_pixels = notePixels[data["key"].lower()]
    for i in range(11):
        for pixelId in colored_pixels:
            pixels[pixelId] = hsl_to_rgb(hsl_starting_color[0], hsl_starting_color[1], hsl_starting_color[2])
            hsl_starting_color[2] += 0.1 
        await asyncio.sleep(0.1)
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

    default_duration = 900
    default_color = (255, 0, 0)

    p = Partition("test", 
        [
            Note(000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(1000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(2000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(3000, {"duration": default_duration, "color": default_color, "key": "re#"}),
            Note(4000, {"duration": default_duration, "color": default_color, "key": "la#"}),
            Note(5000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(6000, {"duration": default_duration, "color": default_color, "key": "re#"}),
            Note(7000, {"duration": default_duration, "color": default_color, "key": "la#"}),

            Note(8000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(9000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(10000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(11000, {"duration": default_duration, "color": default_color, "key": "re#"}),
            Note(12000, {"duration": default_duration, "color": default_color, "key": "la#"}),
            Note(13000, {"duration": default_duration, "color": default_color, "key": "sol"}),
            Note(14000, {"duration": default_duration, "color": default_color, "key": "re#"}),
            Note(15000, {"duration": default_duration, "color": default_color, "key": "la#"}),

        ]
    )

    await p.play(to_chroma_case)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))