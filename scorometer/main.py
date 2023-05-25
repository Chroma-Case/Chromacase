#!/usr/bin/python3
import itertools
import json
import logging
import operator
import os
import sys
from typing import TypedDict

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
from chroma_case.song_check import getPartition
from mido import MidiFile


logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)


BACK_URL = os.environ.get("BACK_URL") or "http://back:3000"
MUSICS_FOLDER = os.environ.get("MUSICS_FOLDER") or "/musics/"

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12

# MODES
NORMAL = 0
PRACTICE = 1


class ScoroInfo(TypedDict):
	max_score: int
	score: int
	wrong: int
	missed: int
	perfect: int
	great: int
	good: int


def send(o):
	print(json.dumps(o), flush=True)


class Scorometer:
	def __init__(self, mode: int, midiFile: str, song_id: int, user_id: int) -> None:
		self.partition: Partition = getPartition(midiFile)
		self.practice_partition: list[list[Key]] = self.getPracticePartition(mode)
		logging.debug({"partition": self.partition.notes})
		self.keys_down = []
		self.mode: int = mode
		self.song_id: int = song_id
		self.user_id: int = user_id
		self.wrong_ids = []
		self.difficulties = {}
		self.info: ScoroInfo = {
			"max_score": len(self.partition.notes) * 100,
			"score": 0,
			"wrong": 0,
			"missed": 0,
			"perfect": 0,
			"great": 0,
			"good": 0,
		}

	def send(self, obj):
		obj["info"] = self.info
		send(obj)

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
		is_down = any(x[0] == message.note for x in self.keys_down)
		logging.debug({"note_on": message.note})
		if is_down:
			return
		self.keys_down.append((message.note, message.time))
		key = Key(key=message.note, start=message.time, duration=0)
		to_play = next(
			(
				i
				for i in self.partition.notes
				if i.key == key.key and self.is_timing_close(key, i) and i.done is False
			),
			None,
		)
		if to_play:
			perf = self.getTimingScore(key, to_play)
			self.info[perf] += 1
			logging.debug({"note_on": f"{perf} on {message.note}"})
			self.send({"type": "timing", "id": message.id, "timing": perf})
		else:
			self.info["score"] -= 50
			self.info["missed"] += 1
			self.wrong_ids += [message.id]
			logging.debug({"note_on": f"wrong key {message.note}"})
			self.send({"type": "timing", "id": message.id, "timing": "wrong"})

	def handleNoteOff(self, message: NoteOffMessage):
		logging.debug({"note_off": message.note})
		down_since = next(
			since for (h_key, since) in self.keys_down if h_key == message.note
		)
		self.keys_down.remove((message.note, down_since))
		if message.id in self.wrong_ids:
			logging.debug({"note_off": f"wrong key {message.note}"})
			self.send({"type": "duration", "id": message.id, "duration": "wrong"})
			return
		key = Key(
			key=message.note, start=down_since, duration=(message.time - down_since)
		)
		to_play = next(
			(
				i
				for i in self.partition.notes
				if i.key == key.key and self.is_timing_close(key, i) and i.done is False
			),
			None,
		)
		if to_play:
			perf = self.getDurationScore(key, to_play)
			self.info["score"] += (
				100
				if perf == "perfect"
				else 75
				if perf == "short" or perf == "long"
				else 50
			)
			logging.debug({"note_off": f"{perf} on {message.note}"})
			to_play.done = True
			self.send({"type": "duration", "id": message.id, "duration": perf})
		else:
			logging.warning("note_off: no key to play but it was not a wrong note_on")

	def handleNoteOnPractice(self, message: NoteOnMessage):
		is_down = any(x[0] == message.note for x in self.keys_down)
		logging.debug({"note_on": message.note})
		if is_down:
			return
		self.keys_down.append((message.note, message.time))
		key = Key(key=message.note, start=message.time, duration=0)
		keys_to_play = next(
			(i for i in self.practice_partition if any(x.done is not True for x in i)),
			None,
		)
		if keys_to_play is None:
			self.send({"type": "error", "error": "no keys should be played"})
			return
		to_play = next(
			(i for i in keys_to_play if i.key == key.key and i.done is not True), None
		)
		if to_play:
			perf = "practice"
			logging.debug({"note_on": f"{perf} on {message.note}"})
			self.send({"type": "timing", "id": message.id, "timing": perf})
		else:
			self.wrong_ids += [message.id]
			logging.debug({"note_on": f"wrong key {message.note}"})
			self.send({"type": "timing", "id": message.id, "timing": "wrong"})

	def handleNoteOffPractice(self, message: NoteOffMessage):
		logging.debug({"note_off": message.note})
		down_since = next(
			since for (h_key, since) in self.keys_down if h_key == message.note
		)
		self.keys_down.remove((message.note, down_since))
		if message.id in self.wrong_ids:
			logging.debug({"note_off": f"wrong key {message.note}"})
			self.send({"type": "duration", "id": message.id, "duration": "wrong"})
			self.info["wrong"] += 1;
			return
		key = Key(
			key=message.note, start=down_since, duration=(message.time - down_since)
		)
		keys_to_play = next(
			(i for i in self.practice_partition if any(x.done is not True for x in i)),
			None,
		)
		if keys_to_play is None:
			logging.info("Invalid key.")
			self.info["score"] -= 50
			# TODO: I dont think this if is right
			# self.sendScore(message.id, "wrong key", "wrong key")
			return
		to_play = next(
			(i for i in keys_to_play if i.key == key.key and i.done is not True), None
		)
		if to_play:
			perf = "practice"
			to_play.done = True
			logging.debug({"note_off": f"{perf} on {message.note}"})
			self.send({"type": "duration", "id": message.id, "duration": perf})
		else:
			self.send({"type": "duration", "id": message.id, "duration": "wrong"})

	def getDurationScore(self, key: Key, to_play: Key):
		tempo_percent = abs((key.duration / to_play.duration) - 1)
		if tempo_percent < 0.3:
			timingScore = "perfect"
		elif tempo_percent < 0.5:
			timingScore = "short" if key.duration < to_play.duration else "long"
		else:
			timingScore = "too short" if key.duration < to_play.duration else "too long"
		return timingScore

	def getTimingScore(self, key: Key, to_play: Key):
		return (
			"perfect"
			if abs(key.start - to_play.start) < 100
			else "great"
			if (key.start < to_play.start) < 300
			else "good"
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
				self.send({"error": f"Invalid message {line} with error: {error}"})
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

	def gameLoop(self):
		while True:
			message, line = getMessage()
			logging.debug(f"handling message {line}")
			self.handleMessage(message, line)

	def endGame(self):
		for i in self.partition.notes:
			if i.done is False:
				self.info["score"] -= 50
				self.info["missed"] += 1
		send(
			{
				"type": "end",
				"overallScore": self.info["score"],
				"score": {
					"missed": self.info["missed"],
					"good": self.info["good"],
					"great": self.info["great"],
					"perfect": self.info["perfect"],
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
					"score": self.info["score"],
					"info": self.info,
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
