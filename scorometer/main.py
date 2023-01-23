#!/usr/bin/python3
from chroma_case.Partition import Partition
from chroma_case.Key import Key
import sys
import select
import itertools
import operator
import json
from mido import MidiFile

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12

# MODES
NORMAL = 0
PRACTICE = 1


def send(o):
	print(json.dumps(o), flush=True)

def log(level, message):
	send({"type": "log", "level": level, "message": message})

def debug(message):
	log("DEBUG", message)

def info(message):
	log("INFO", message)

def warn(message):
	log("WARN", message)

def fatal(message):
	log("FATAL", message)

class Scorometer():
	def __init__(self, mode, midiFile) -> None:
		self.partition = self.getPartition(midiFile)
		self.keys_down = []
		self.score = 0
		self.mode = mode
		if mode == PRACTICE:
			get_start = operator.attrgetter("start")
			self.practice_partition = [list(g) for _, g in itertools.groupby(sorted(self.partition.notes, key=get_start), get_start)]
		else:
			self.practice_partition: list[list[Key]] = []

	def getPartition(self, midiFile):
		notes = []
		s = 3500
		notes_on = {}
		prev_note_on = {}
		for msg in MidiFile(midiFile):
			d = msg.dict()
			s += d['time'] * 1000 * RATIO

			if d["type"] == "note_on":
				prev_note_on[d["note"]] = 0
				if d["note"] in notes_on:
					prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
				notes_on[d["note"]] = s # 0

			if d["type"] == "note_off":
				duration = s - notes_on[d["note"]]
				note_start = notes_on[d["note"]]
				notes.append(Key(d["note"], note_start, duration - 10))
				notes_on[d["note"]] = s # 500
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
			down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
			self.keys_down.remove((_key, down_since))
			key = Key(_key, down_since, (timestamp - down_since))
			#debug({key: key})
		if key is None:
			warn("Note off sent but did not receive earlier note on")
			return
		to_play = next((i for i in self.partition.notes if i.key == key.key and self.is_timing_close(key, i) and i.done == False), None)
		if to_play == None:
			self.score -= 50
			debug(f"Invalid key.")
		else:
			timingScore, timingInformation = self.getTiming(key, to_play)
			self.score += 100 if timingScore == "perfect" else 75 if timingScore == "great" else 50
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
			down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
			self.keys_down.remove((_key, down_since))
			key = Key(_key, down_since, (timestamp - down_since))
			#debug({key: key})
		if key is None:
			warn("Note off sent but did not receive earlier note on")
			return
		keys_to_play = next((i for i in self.practice_partition if any(x.done != True for x in i)), None)
		if keys_to_play is None:
			warn("Key sent but there is no keys to play")
			return
		to_play = next((i for i in keys_to_play if i.key == key.key and i.done != True), None)
		if to_play == None:
			self.score -= 50
			debug(f"Invalid key.")
		else:
			timingScore, _ = self.getTiming(key, to_play)
			self.score += 100 if timingScore == "perfect" else 75 if timingScore == "great" else 50
			to_play.done = True
			self.sendScore(obj["id"], timingScore, "practice")

	def getTiming(self, key: Key, to_play: Key):
		return self.getTimingScore(key, to_play), self.getTimingInfo(key, to_play)

	def getTimingScore(self, key: Key, to_play: Key):
		tempo_percent = abs((key.duration / to_play.duration) - 1)
		if tempo_percent < .3 : 
			timingScore = "perfect"
		elif tempo_percent < .5:
			timingScore = f"great"
		else:
			timingScore = "good"
		return timingScore

	def getTimingInfo(self, key: Key, to_play: Key):
		return "perfect" if abs(key.start - to_play.start) < 200 else "fast" if key.start < to_play.start else "late"

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

	def sendEnd(self, overall, difficulties):
		send({"overallScore": overall, "score": difficulties})

	def sendScore(self, id, timingScore, timingInformation):
		send({"id": id, "timingScore": timingScore, "timingInformation": timingInformation})

	def gameLoop(self):
		while True:
			if select.select([sys.stdin, ], [], [], 0.0)[0]:
				line = input()
				if not line:
					break
				info(f"handling message {line}")
				self.handleMessage(line.rstrip())
			else:
				pass
		self.sendEnd(self.score, {})

def handleStartMessage(start_message):
	if "type" not in start_message.keys():
		raise Exception("type of start message not specified")
	if start_message["type"] != "start":
		raise Exception("start message is not of type start")
	if "name" not in start_message.keys():
		raise Exception("name of song not specified in start message")
	if "mode" not in start_message.keys():
		raise Exception("mode of song not specified in start message")
	mode = PRACTICE if start_message["mode"] == "practice" else NORMAL
	# TODO get song path from the API
	song_path = f"partitions/{start_message['name']}.midi"
	return mode, song_path


def main():
	try:
		start_message = json.loads(input())
		mode, song_path = handleStartMessage(start_message)
		sc = Scorometer(mode, song_path)
		sc.gameLoop()
	except Exception as error:
		send({ "error": error })

if __name__ == "__main__":
	main()
