#!/usr/bin/python3
import itertools
import json
import logging
import operator
import os
import select
import sys
from dataclasses import dataclass
from typing import Literal, Tuple

import requests
from chroma_case.Key import Key
from chroma_case.Partition import Partition
from mido import MidiFile
from validated_dc import ValidatedDC, get_errors, is_valid

BACK_URL = os.environ.get("BACK_URL") or "http://back:3000"
MUSICS_FOLDER = os.environ.get("MUSICS_FOLDER") or "/musics/"

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12

# MODES
NORMAL = 0
PRACTICE = 1


@dataclass
class InvalidMessage:
	message: str


@dataclass
class StartMessage(ValidatedDC):
	id: int
	bearer: str
	mode: Literal["normal", "practice"]
	type: Literal["start"] = "start"


@dataclass
class EndMessage(ValidatedDC):
	type: Literal["end"] = "end"


@dataclass
class NoteOnMessage(ValidatedDC):
	time: int
	note: int
	id: int
	type: Literal["note_on"] = "note_on"


@dataclass
class NoteOffMessage(ValidatedDC):
	time: int
	note: int
	id: int
	type: Literal["note_off"] = "note_off"


@dataclass
class PauseMessage(ValidatedDC):
	paused: bool
	time: int
	type: Literal["pause"] = "pause"


message_map = {
	"start": StartMessage,
	"end": EndMessage,
	"note_on": NoteOnMessage,
	"note_off": NoteOffMessage,
	"pause": PauseMessage,
}


def getMessage() -> (
	Tuple[
		StartMessage
		| EndMessage
		| NoteOnMessage
		| NoteOffMessage
		| PauseMessage
		| InvalidMessage,
		str,
	]
):
	try:
		msg = input()
		obj = json.loads(msg)
		res = message_map[obj["type"]](**obj)
		if is_valid(res):
			return res, msg
		else:
			return InvalidMessage(str(get_errors(res))), msg
	except Exception as e:
		return InvalidMessage(str(e)), ""


def send(o):
	print(json.dumps(o), flush=True)


class Scorometer:
	def __init__(self, mode, midiFile, song_id, user_id) -> None:
		self.partition = self.getPartition(midiFile)
		self.keys_down = []
		self.mode = mode
		self.song_id = song_id
		self.user_id = user_id
		self.score = 0
		self.missed = 0
		self.perfect = 0
		self.great = 0
		self.good = 0
		self.difficulties = {}
		if mode == PRACTICE:
			get_start = operator.attrgetter("start")
			self.practice_partition = [
				list(g)
				for _, g in itertools.groupby(
					sorted(self.partition.notes, key=get_start), get_start
				)
			]
		else:
			self.practice_partition: list[list[Key]] = []

	def getPartition(self, midiFile):
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

	def handleNoteOn(self, message: NoteOnMessage):
		_key = message.note
		timestamp = message.time
		is_down = any(x[0] == _key for x in self.keys_down)
		if not is_down:
			self.keys_down.append((_key, timestamp))
			logging.debug({"note": _key})

	def handleNoteOff(self, message: NoteOffMessage):
		_key = message.note
		timestamp = message.time
		down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
		self.keys_down.remove((_key, down_since))
		key = Key(_key, down_since, (timestamp - down_since))
		# debug({key: key})
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
		_key = message.note
		timestamp = message.time
		is_down = any(x[0] == _key for x in self.keys_down)
		if not is_down:
			self.keys_down.append((_key, timestamp))
			logging.debug({"note": _key})

	def handleNoteOffPractice(self, message: NoteOffMessage):
		_key = message.note
		timestamp = message.time
		# is_down = any(x[0] == _key for x in self.keys_down)
		down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
		self.keys_down.remove((_key, down_since))
		key = Key(_key, down_since, (timestamp - down_since))
		keys_to_play = next(
			(i for i in self.practice_partition if any(x.done is not True for x in i)),
			None,
		)
		if keys_to_play is None:
			logging.info("Key sent but there is no keys to play")
			self.score -= 50
			return
		to_play = next(
			(i for i in keys_to_play if i.key == key.key and i.done is not True), None
		)
		if to_play is None:
			self.score -= 50
			logging.info("Invalid key.")
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
			timingScore = "perfect"
		elif tempo_percent < 0.5:
			timingScore = "great"
		else:
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
			if select.select(
				[
					sys.stdin,
				],
				[],
				[],
				0.0,
			)[0]:
				message, line = getMessage()
				logging.info(f"handling message {line}")
				self.handleMessage(message, line)
			else:
				pass

	def endGame(self):
		for i in self.partition.notes:
			if i.done is False:
				self.score -= 50
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
