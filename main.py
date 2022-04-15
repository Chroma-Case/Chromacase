from xmlrpc.client import TRANSPORT_ERROR
from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys
from mido import MidiFile

import board, neopixel

# on octave is 12
RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12
TRANSPOSE_AMOUNT = OCTAVE_AMOUNT_KEYS * OCTAVE

pixels = neopixel.NeoPixel(board.D18, 20, brightness=0.01)

notePixels = { 'si': [19],
            'la#': [18],
            'la': [17],
            'sol#':[15],
            'sol':[13],
            'fa#':[10],
            'fa':[9],
            'mi':[6],
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
    print(f"key: {data['key']}, c:{data['color']} for {data['duration'] / 1000}s, time: {data['time']}")
    await asyncio.sleep(data['duration'] / 1000)
    print(f"end of {data['key']}")


def midi_key_my_key(midi_key):
    keys = list(notePixels.keys())

    keys.reverse()

    key_index = midi_key - TRANSPOSE_AMOUNT
    if key_index >= len(keys):
        print("key out of leb barre", key_index)
        return "no_key"

    return keys[key_index]




async def main():

    default_duration = 900
    default_color = (255, 0, 0)

    notes = []
    # notes will start to play at 3500 ms (colors at the start takes this amount of time)
    s = 3500

    notes_on = {}
    prev_note_on = {}
    note_color = {}

    for msg in MidiFile(sys.argv[1]):
        d = msg.dict()
        print(msg, s)
        s += d['time'] * 1000 * RATIO
        
        if d["type"] == "note_on":
            prev_note_on[d["note"]] = 0
            if d["note"] in notes_on:
                prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
            notes_on[d["note"]] = s # 0
            if d["note"] not in note_color.keys():
                note_color[d["note"]] = 1
            note_color[d["note"]] = not note_color[d["note"]]
        
        if d["type"] == "note_off":
            #duration = s - notes_on[d["note"]]
            duration = s - notes_on[d["note"]]

            """notes.append(Note(
                s - min(s - prev_note_on[d["note"]], 500), 
                {
                    "duration": min(s - prev_note_on[d["note"]], 1000) / 2, 
                    "color": (255, 255, 0), 
                    "key": midi_key_my_key(d["note"]),
                    "announce": True
                }
            ))"""

            note_start = notes_on[d["note"]]
            # time value is only used during debug
            notes.append(Note(note_start, {"time": note_start, "duration": duration - 10, "color": default_color if note_color[d["note"]] else (255, 100, 0), "key": midi_key_my_key(d["note"])}))
            notes_on[d["note"]] = s # 500



    starting = []
    
    for i in notePixels.keys():
        starting += [
            Note(000, {"duration": default_duration, "color": (255, 0, 0), "key": i, "time": 0}),
            Note(1000, {"duration": default_duration, "color": (255, 255, 0), "key": i, "time": 0}),
            Note(2000, {"duration": default_duration, "color": (0, 255, 0), "key": i, "time": 0}),
    ]
    
    p = Partition("my_partition",
     starting + notes
    )

    await p.play(to_chroma_case)

    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
