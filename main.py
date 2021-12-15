from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys
from mido import MidiFile

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
notePixels = { 'si': [19],
            'la#': [18],
            'la': [15, 16, 17],
            'sol#':[14],
            'sol':[11, 12, 13],
            'fa#':[10],
            'fa':[8, 9],
            'mi':[6, 7],
            're#':[4, 5],
            're':[2, 3],
            'do#':[0, 1],
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

    r = hue_to_rgb(t1, t2, hue + 2) * 255
    g = hue_to_rgb(t1, t2, hue) * 255
    b = hue_to_rgb(t1, t2, hue - 2) * 255
    return [round(r), round(g), round(b)]

async def to_chroma_case(data):
    global pixels

    hsl_starting_color = [190, 1, 0]

    colored_pixels = notePixels[data["key"].lower()]
    """  for i in range(11):
        for pixelId in colored_pixels:
            pixels[pixelId] = hsl_to_rgb(hsl_starting_color[0], hsl_starting_color[1], hsl_starting_color[2])
            hsl_starting_color[2] += 0.01
        await asyncio.sleep(0.01) """
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
    default_color = (255, 0, 0)

    notes = []
    s = 3500

    notes_on = {}

    for msg in MidiFile('new_song_2.mid'):
        d = msg.dict()
        print(msg, d)
        s += d['time'] * 1000
        if d["type"] == "note_on":
            print(s)
            notes_on[d["note"]] = s
        if d["type"] == "note_off":
            notes.append(Note(s, {"duration": s - notes_on[d["note"]], "color": default_color, "key": midi_key_my_key(d["note"])}))

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
