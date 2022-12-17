#!/usr/bin/python3

import board
import neopixel
import time
import sys
import asyncio

colorToFill = (0, 0, 0)
pixels = neopixel.NeoPIxel(board.D18, 20, brightness=0.01)

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

def playNote(color, secondsToStay, pixelsToFill):
    for pixelIndex in pixelsToFill:
        pixels[pixelIndex] = color
    time.sleep(secondsToStay)





def launchMusic(noteList):
    
    pixels.fill(0,0,0)
    pixels.write()

    for notes, tempo in noteList:
        for note in notes:
            playNote((255, 0, 0), tempo, notePixels[note.lower()])
        pixels.fill(colorToFill)
        pixels.write()

music = [
        (['sol'], 1),
        (['sol'], 1),
        (['sol'], 1),
        (['re#'], 1),
        (['la#'], 0.5),
        (['sol'], 0.5),
        (['re#'], 1),
        (['la#'], 0.5),
         ]

launchMusic(music)
