#!/usr/bin/env python3

import sys
import os
from typing import List

import pygame as pg
from pygame.constants import KEYDOWN
import pygame.midi
from mido import MidiFile

# Status definitions
TOUCH_DOWN = 144
TOUCH_UP   = 128


class Key:
    def __init__(self, key: int, start: int, duration: int):
        self.key = key
        self.start = start
        self.duration = duration

    def __str__(self):
        return f"{self.key} ({self.start} - {self.duration})"


def read_midi(file):
    notes = []
    notes_on = {}
    s = 0
    for msg in MidiFile(file):
        d = msg.dict()
        s += d['time'] * 1000
        if d["type"] == "note_on":
            notes_on[d["note"]] = s
        if d["type"] == "note_off":
            duration = s - notes_on[d["note"]]
            notes_on[d["note"]] = s
            notes.append(Key(d["note"], s, duration))
    return notes


keys_to_play = read_midi(sys.argv[1])
for i in map(lambda x: str(x), keys_to_play):
    print(str(i))
tempo = 1000 # The duration of a black key in ms.

# List of keys currently holded. Format: (key, timestamp)
keys_down = []

points = 0


def print_device_info():
    pygame.midi.init()
    _print_device_info()
    pygame.midi.quit()


def _print_device_info():
    for i in range(pygame.midi.get_count()):
        r = pygame.midi.get_device_info(i)
        (interf, name, input, output, opened) = r

        in_out = ""
        if input:
            in_out = "(input)"
        if output:
            in_out = "(output)"

        print(
            "%2i: interface :%s:, name :%s:, opened :%s:  %s"
            % (i, interf, name, opened, in_out)
        )

def poll(midi):
    if midi.poll():
        [((status, key, intensity, data3), timestamp)] = midi.read(1)
        # For status, see STATUS DEFINITIONS up there (either TOUCH_DOWN, TOUCH_UP or others for pedals)
        # The key is between 21 and 108, C5 is 60
        # The itensity is how strong the key got struck (between 1 and 130ish)
        # data3 seems to always be 0
        # timestamp seems to be a unix timestamp since the midi has been oppened.

        # Sometimes, status is always TOUCH_DOWN so if the key is already down, we consider it the same as a key up
        is_down = any(x[0] == key for x in keys_down)
        if status == TOUCH_DOWN and not is_down:
            keys_down.append((key, timestamp))
            # print(f"Midi: {status} - {key} - {intensity} - {data3} at {timestamp}")
        elif status == TOUCH_UP or is_down:
            down_since = next(since for (h_key, since) in keys_down if h_key == key)
            keys_down.remove((key, down_since))
            return Key(key, down_since, (timestamp - down_since) / tempo)

def is_timing_close(key, i):
    return abs(i.start - key.start) < 500

def run(midi):
    global points
    clock_now = 0
    while sorted(keys_to_play, key=lambda x: x.start)[-1].start > clock_now:
        key = poll(midi)
        if key is None:
            continue
        clock_now = key.start
        print(f"Clock at: {clock_now}")

        to_play = next((i for i in keys_to_play if i.key == key.key and is_timing_close(key, i)), None)
        print(str(to_play))
        if to_play == None:
            print(f"Invalid key. Got {key.key}")
        else:
            tempo_percent = 100 - abs(key.duration - to_play.duration) * 100
            if tempo_percent < 80:
                points += tempo_percent / 2
                print("Too short" if key.duration < to_play.duration else "Too long")
            elif tempo_percent < 90:
                points += tempo_percent
                print(f"GREAT. {int(tempo_percent)}pts")
            else:
                points += tempo_percent * 2
                print(f"EXCELLENT. {int(tempo_percent * 2)}pts")


def input_main(device_id=None):
    pg.init()
    pygame.midi.init()

    _print_device_info()

    if device_id is None:
        input_id = pygame.midi.get_default_input_id()
    else:
        input_id = device_id

    print("using input_id :%s:" % input_id)
    i = pygame.midi.Input(input_id)

    pg.display.set_mode((1, 1))
    try:
        run(i)
    except KeyboardInterrupt:
        pass
    print(f"You got: {int(points)}pts")
    pygame.midi.quit()


if __name__ == '__main__':
    exit(input_main(int(sys.argv[2]) if len(sys.argv) == 3 else None))
