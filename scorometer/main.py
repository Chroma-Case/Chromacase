#!/usr/bin/python3
import itertools
import json
import logging
import operator
import os
import select
import sys
from dataclasses import dataclass
from typing import Literal

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


def send(o):
	print(json.dumps(o), flush=True)


class Scorometer:
	def __init__(self, mode, midiFile) -> None:
		self.partition = self.getPartition(midiFile)
		self.keys_down = []
		self.score = 0
		self.mode = mode
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

	def handleNote(self, obj):
		_key = obj["note"]
		status = obj["type"]
		timestamp = obj["time"]
		is_down = any(x[0] == _key for x in self.keys_down)
		key = None
		if status == "note_on" and not is_down:
			self.keys_down.append((_key, timestamp))
			debug({"note": _key})
		elif status == "note_off" or is_down:
			down_since = next(
				since for (h_key, since) in self.keys_down if h_key == _key
			)
			self.keys_down.remove((_key, down_since))
			key = Key(_key, down_since, (timestamp - down_since))
			# debug({key: key})
		if key is None:
			return
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
			debug("Invalid key.")
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
			self.sendScore(obj["id"], timingScore, timingInformation)

	def handleNotePractice(self, obj):
		_key = obj["note"]
		status = obj["type"]
		timestamp = obj["time"]
		is_down = any(x[0] == _key for x in self.keys_down)
		key = None
		if status == "note_on" and not is_down:
			self.keys_down.append((_key, timestamp))
			debug({"note": _key})
		elif status == "note_off" or is_down:
			down_since = next(
				since for (h_key, since) in self.keys_down if h_key == _key
			)
			self.keys_down.remove((_key, down_since))
			key = Key(_key, down_since, (timestamp - down_since))
			# debug({key: key})
		if key is None:
			return
		keys_to_play = next(
			(i for i in self.practice_partition if any(x.done != True for x in i)), None
		)
		if keys_to_play is None:
			warn("Key sent but there is no keys to play")
			self.score -= 50
			return
		to_play = next(
			(i for i in keys_to_play if i.key == key.key and i.done != True), None
		)
		if to_play == None:
			self.score -= 50
			debug(f"Invalid key.")
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
			self.sendScore(obj["id"], timingScore, "practice")

	def getTiming(self, key: Key, to_play: Key):
		return self.getTimingScore(key, to_play), self.getTimingInfo(key, to_play)

	def getTimingScore(self, key: Key, to_play: Key):
		tempo_percent = abs((key.duration / to_play.duration) - 1)
		if tempo_percent < 0.3:
			timingScore = "perfect"
		elif tempo_percent < 0.5:
			timingScore = f"great"
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

	def handleMessage(self, message: str):
		obj = json.loads(message)
		if "type" not in obj.keys():
			warn(f"Could not handle message {message}")
			return
		if obj["type"] == "note_on" or obj["type"] == "note_off":
			if self.mode == NORMAL:
				self.handleNote(obj)
			elif self.mode == PRACTICE:
				self.handleNotePractice(obj)
		if obj["type"] == "pause":
			pass

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
				line = input()
				if not line:
					break
				info(f"handling message {line}")
				self.handleMessage(line.rstrip())
			else:
				pass
		for i in self.partition.notes:
			if i.done == False:
				self.score -= 50
		return self.score, {}


def handleStartMessage(start_message):
	for key in ["type", "id", "mode", "bearer"]:
		if key not in start_message.keys():
			raise Exception(f"{key} is not specified in start message")
	if start_message["type"] != "start":
		raise Exception("start message is not of type start")
	mode = PRACTICE if start_message["mode"] == "practice" else NORMAL
	song_id = start_message["id"]
	bearer = start_message["bearer"]
	try:
		r = requests.get(f"{BACK_URL}/auth/me")
		r.raise_for_status()
		user_id = r.json()["id"]
	except Exception:
		fatal("Could not get user id with given bearer")
		send({"error": "Could not get user id with given bearer"})
		exit()

	try:
		r = requests.get(f"{BACK_URL}/song/{song_id}")
		r.raise_for_status()
		song_path = r.json()["midiPath"]
		song_path = song_path.replace("/musics/", MUSICS_FOLDER)
	except Exception:
		fatal("Invalid song id")
		send({"error": "Invalid song id"})
		exit()
	return mode, song_path, song_id, user_id


def sendScore(score, difficulties, song_id, user_id):
	send({"overallScore": score, "score": difficulties})
	requests.post(
		f"{BACK_URL}/history",
		json={
			"songID": song_id,
			"userID": user_id,
			"score": score,
			"difficulties": difficulties,
		},
	)


message_map = {
	"start": StartMessage,
	"end": EndMessage,
	"note_on": NoteOnMessage,
	"note_off": NoteOffMessage,
	"pause": PauseMessage,
}


def getMessage() -> (
	StartMessage
	| EndMessage
	| NoteOnMessage
	| NoteOffMessage
	| PauseMessage
	| InvalidMessage
):
	try:
		msg = input()
		obj = json.loads(msg)
		res = message_map[obj["type"]](**obj)
		if is_valid(res):
			return res
		else:
			return InvalidMessage(get_errors(res))
	except Exception as e:
		return InvalidMessage(str(e))


def main():
	try:
		while True:
			msg = getMessage()
			match msg:
				case StartMessage(mode, song_id, bearer):
					print("start", song_id, mode, bearer)
				case EndMessage():
					print("end")
				case NoteOnMessage(id, note, time):
					print("note_on", id, note, time)
				case NoteOffMessage():
					print("note_off")
				case PauseMessage():
					print("pause")
				case InvalidMessage(error):
					print(error)
		exit()
		mode, song_path, song_id, user_id = handleStartMessage(start_message)
		sc = Scorometer(mode, song_path)
		score, difficulties = sc.gameLoop()
		sendScore(score, difficulties, song_id, user_id)
	except Exception as e:
		logging.fatal("error", exc_info=e)
		send({"error": "a fatal error occured"})


if __name__ == "__main__":
	main()
