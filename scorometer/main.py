#!/usr/bin/python3
import itertools
import json
import logging
import operator
import os
import select
import sys

import requests
from chroma_case.Key import Key
from chroma_case.Message import (
    EndMessage,
    InvalidMessage,
    NoteOffMessage,
    NoteOnMessage,
    PauseMessage,
    StartMessage,
    getMessage,
)
from chroma_case.Partition import Partition
from mido import MidiFile

BACK_URL = os.environ.get("BACK_URL") or "http://back:3000"
MUSICS_FOLDER = os.environ.get("MUSICS_FOLDER") or "/musics/"

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12

# MODES
NORMAL = 0
PRACTICE = 1


def send(o):
    print(json.dumps(o), flush=True)


class Scorometer:
    def __init__(self, mode: int, midiFile: str, song_id: int, user_id: int) -> None:
        self.partition: Partition = self.getPartition(midiFile)
        self.practice_partition: list[list[Key]] = self.getPracticePartition(mode)
        self.keys_down = []
        self.mode: int = mode
        self.song_id: int = song_id
        self.user_id: int = user_id
        self.score: int = 0
        self.missed: int = 0
        self.perfect: int = 0
        self.great: int = 0
        self.good: int = 0
        self.difficulties = {}

    def getPartition(self, midiFile: str):
        notes = []
        s = 3500
        notes_on = {}
        prev_note_on = {}
        for msg in MidiFile(midiFile):
            d = msg.dict()
            s += d["time"] * 1000 * RATIO

            if d["type"] == "note_on":
                prev_note_on[d["note"]] = 0
                if d["note"] in notes_on:
                    prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
                notes_on[d["note"]] = s  # 0

            if d["type"] == "note_off":
                duration = s - notes_on[d["note"]]
                note_start = notes_on[d["note"]]
                notes.append(Key(d["note"], note_start, duration - 10))
                notes_on[d["note"]] = s  # 500
        return Partition(midiFile, notes)

    def getPracticePartition(self, mode: int) -> list[list[Key]]:
        get_start = operator.attrgetter("start")
        return (
            [
                list(g)
                for _, g in itertools.groupby(
                    sorted(self.partition.notes, key=get_start), get_start
                )
            ]
            if mode == PRACTICE
            else []
        )

    def handleNoteOn(self, message: NoteOnMessage):
        key = message.note
        is_down = any(x[0] == key for x in self.keys_down)
        if not is_down:
            self.keys_down.append((key, message.time))
            logging.debug({"note": key})

    def handleNoteOff(self, message: NoteOffMessage):
        _key = message.note
        timestamp = message.time
        down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
        self.keys_down.remove((_key, down_since))
        key = Key(_key, down_since, (timestamp - down_since))
        to_play = next(
            (
                i
                for i in self.partition.notes
                if i.key == key.key and self.is_timing_close(key, i) and i.done is False
            ),
            None,
        )
        if to_play is None:
            self.score -= 50
            logging.info("Invalid key.")
            self.sendScore(message.id, "wrong key", "wrong key")
        else:
            timingScore, timingInformation = self.getTiming(key, to_play)
            self.score += (
                100
                if timingScore == "perfect"
                else 75
                if timingScore == "great"
                else 50
            )
            to_play.done = True
            self.sendScore(message.id, timingScore, timingInformation)

    def handleNoteOnPractice(self, message: NoteOnMessage):
        key = message.note
        is_down = any(x[0] == key for x in self.keys_down)
        if not is_down:
            self.keys_down.append((key, message.time))
            logging.debug({"note": key})

    def handleNoteOffPractice(self, message: NoteOffMessage):
        _key = message.note
        down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
        self.keys_down.remove((_key, down_since))
        key = Key(_key, down_since, (message.time - down_since))
        keys_to_play = next(
            (i for i in self.practice_partition if any(x.done is not True for x in i)),
            None,
        )
        if keys_to_play is None:
            logging.info("Invalid key.")
            self.score -= 50
            self.sendScore(message.id, "wrong key", "wrong key")
            return
        to_play = next(
            (i for i in keys_to_play if i.key == key.key and i.done is not True), None
        )
        if to_play is None:
            logging.info(f"Wrong key sent: {message.note} with id {message.id}")
            self.score -= 50
            self.sendScore(message.id, "wrong key", "wrong key")
        else:
            timingScore, _ = self.getTiming(key, to_play)
            self.score += (
                100
                if timingScore == "perfect"
                else 75
                if timingScore == "great"
                else 50
            )
            to_play.done = True
            self.sendScore(message.id, timingScore, "practice")

    def getTiming(self, key: Key, to_play: Key):
        return self.getTimingScore(key, to_play), self.getTimingInfo(key, to_play)

    def getTimingScore(self, key: Key, to_play: Key):
        tempo_percent = abs((key.duration / to_play.duration) - 1)
        if tempo_percent < 0.3:
            self.perfect += 1
            timingScore = "perfect"
        elif tempo_percent < 0.5:
            self.great += 1
            timingScore = "great"
        else:
            self.good += 1
            timingScore = "good"
        return timingScore

    def getTimingInfo(self, key: Key, to_play: Key):
        return (
            "perfect"
            if abs(key.start - to_play.start) < 200
            else "fast"
            if key.start < to_play.start
            else "late"
        )

    # is it in the 500 ms range
    def is_timing_close(self, key: Key, i: Key):
        return abs(i.start - key.start) < 500

    def handleMessage(
        self,
        message: StartMessage
        | EndMessage
        | NoteOnMessage
        | NoteOffMessage
        | PauseMessage
        | InvalidMessage,
        line: str,
    ):
        match message:
            case InvalidMessage(error):
                logging.warning(f"Invalid message {line} with error: {error}")
                send({"error": f"Invalid message {line} with error: {error}"})
            case NoteOnMessage():
                if self.mode == NORMAL:
                    self.handleNoteOn(message)
                elif self.mode == PRACTICE:
                    self.handleNoteOnPractice(message)
            case NoteOffMessage():
                if self.mode == NORMAL:
                    self.handleNoteOff(message)
                elif self.mode == PRACTICE:
                    self.handleNoteOffPractice(message)
            case PauseMessage():
                pass
            case EndMessage():
                self.endGame()
            case _:
                logging.warning(
                    f"Expected note_on note_off or pause message but got {message.type} instead"
                )

    def sendScore(self, id, timingScore, timingInformation):
        send(
            {
                "id": id,
                "timingScore": timingScore,
                "timingInformation": timingInformation,
            }
        )

    def gameLoop(self):
        while True:
            message, line = getMessage()
            logging.info(f"handling message {line}")
            self.handleMessage(message, line)

    def endGame(self):
        for i in self.partition.notes:
            if i.done is False:
                self.score -= 50
                self.missed += 1
        send(
            {
                "overallScore": self.score,
                "score": {
                    "missed": self.missed,
                    "good": self.good,
                    "great": self.great,
                    "perfect": self.perfect,
                    "maxScore": len(self.partition.notes) * 100,
                },
            }
        )
        if self.user_id != -1:
            requests.post(
                f"{BACK_URL}/history",
                json={
                    "songID": self.song_id,
                    "userID": self.user_id,
                    "score": self.score,
                    "difficulties": self.difficulties,
                },
            )
        exit()


def handleStartMessage(start_message: StartMessage):
    mode = PRACTICE if start_message.mode == "practice" else NORMAL
    song_id = start_message.id
    user_id = -1
    try:
        if start_message.bearer != "":
            r = requests.get(
                f"{BACK_URL}/auth/me",
                headers={"Authorization": f"Bearer {start_message.bearer}"},
            )
            r.raise_for_status()
            user_id = r.json()["id"]
    except Exception as e:
        logging.fatal("Could not get user id with given bearer", exc_info=e)
        send({"error": "Could not get user id with given bearer"})
        exit()

    try:
        r = requests.get(f"{BACK_URL}/song/{song_id}")
        r.raise_for_status()
        song_path = r.json()["midiPath"]
        song_path = song_path.replace("/musics/", MUSICS_FOLDER)
    except Exception as e:
        logging.fatal("Invalid song id", exc_info=e)
        send({"error": "Invalid song id, song does not exist"})
        exit()
    return mode, song_path, song_id, user_id


def startGame(start_message: StartMessage):
    mode, song_path, song_id, user_id = handleStartMessage(start_message)
    sc = Scorometer(mode, song_path, song_id, user_id)
    sc.gameLoop()


def main():
    try:
        msg, _ = getMessage()
        match msg:
            case StartMessage():
                startGame(msg)
            case EndMessage():
                logging.info("scorometer ended before a start message")
                send({"error": "Did not receive a start message"})
                exit()
            case InvalidMessage(error):
                logging.warning(f"invalid message with error: {error}")
                send({"error": "Invalid input, expected a start message"})
            case _:
                logging.warning(f"invalid message with type: {msg.type}")
                send({"error": "Invalid input, expected a start message"})
    except Exception as e:
        logging.fatal("error", exc_info=e)
        send({"error": "a fatal error occured"})


if __name__ == "__main__":
    main()
