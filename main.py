from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys
from mido import MidiFile

import board, neopixel

pixels = neopixel.NeoPixel(board.D18, 20, brightness=0.01)

notePixels = { 'si': [19],
            'la#': [18],
            'la': [17],
            'sol#':[15],
            'sol':[13],
            'fa#':[10],
            'fa':[8],
            'mi':[7],
            're#':[5],
            're':[3],
            'do#':[1],
            'do':[0]}


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

    r = hue_to_rgb(t1, t2, hue + 2) * 255
    g = hue_to_rgb(t1, t2, hue) * 255
    b = hue_to_rgb(t1, t2, hue - 2) * 255
    return [round(r), round(g), round(b)]

async def to_chroma_case(data):
    global pixels

    hsl_starting_color = [100, 100, 50]

    colored_pixels = notePixels[data["key"].lower()]
    #if "announce" in data:
    tmp = 1.0
    c = data["color"]
    """for i in range(5):
        for pixelId in colored_pixels:
            pixels[pixelId] = (c[0], int(c[1] * tmp), c[2])
        tmp -= 0.2
        await asyncio.sleep(data["duration"] / (5 * 1000))"""
    """for i in range(11):
        for pixelId in colored_pixels:
            pixels[pixelId] = hsl_to_rgb(hsl_starting_color[0], hsl_starting_color[1], hsl_starting_color[2])
            hsl_starting_color[2] += 0.01
        await asyncio.sleep(0.01)"""
    for pixelId in colored_pixels:
        pixels[pixelId] = data["color"]
    await asyncio.sleep(data['duration'] / 1000)
    for pixelId in colored_pixels:
        pixels[pixelId] = 0
        

async def printing(data):
    print(f"key: {data['key']}, c:{data['color']} for {data['duration'] / 1000}s")
    await asyncio.sleep(data['duration'] / 1000)
    print(f"end of {data['key']}")


def midi_key_my_key(midi_key):
    keys = list(notePixels.keys())

    keys.reverse()

    return keys[midi_key - 60]




async def main():

    default_duration = 900
    default_color = (255, 255, 0)

    notes = []
    s = 3500

    notes_on = {}
    prev_note_on = {}

    for msg in MidiFile(sys.argv[1]):
        d = msg.dict()
        print(msg, d)
        s += d['time'] * 1000
        if d["type"] == "note_on":
            print(s)
            prev_note_on[d["note"]] = 0
            if d["note"] in notes_on:
                prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
            notes_on[d["note"]] = s # 0
        if d["type"] == "note_off":
            duration = s - notes_on[d["note"]]
            notes_on[d["note"]] = s # 500
            """notes.append(Note(
                s - min(s - prev_note_on[d["note"]], 500), 
                {
                    "duration": min(s - prev_note_on[d["note"]], 1000) / 2, 
                    "color": (255, 255, 0), 
                    "key": midi_key_my_key(d["note"]),
                    "announce": True
                }
            ))"""
            notes.append(Note(s, {"duration": duration, "color": default_color, "key": midi_key_my_key(d["note"])}))

    starting = []
    for i in notePixels.keys():
        starting += [
            Note(000, {"duration": default_duration, "color": default_color, "key": i}),
            Note(1000, {"duration": default_duration, "color": (255, 255, 0), "key": i}),
            Note(2000, {"duration": default_duration, "color": (0, 255, 0), "key": i}),
    ]
    
    p = Partition("test",
     starting + notes
    )

    await p.play(to_chroma_case)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
