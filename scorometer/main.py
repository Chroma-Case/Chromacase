#!/usr/bin/python3
import logging
from chroma_case.Partition import Partition
from chroma_case.Key import Key
import sys
import select
import json
from mido import MidiFile

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12

class Scorometer():
	def __init__(self, midiFile) -> None:
		self.partition = self.getPartition(midiFile)
		self.keys_down = []
		self.score = 0
		pass
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
			self.sendDebug({"note": _key})
		elif status == "note_off" or is_down:
			down_since = next(since for (h_key, since) in self.keys_down if h_key == _key)
			self.keys_down.remove((_key, down_since))
			key = Key(_key, down_since, (timestamp - down_since))
			self.sendDebug({key: key})
		if key is None:
			return
		to_play = next((i for i in self.partition.notes if i.key == key.key and self.is_timing_close(key, i)), None)
		if to_play == None:
			pass
			## TODO handle invalid key 
			#points -= 50
			#print(f"Invalid key.")
		else:
			# 500 / 490 0.9 - 1
			timingScore, timingInformation = self.getTiming(key, to_play)
			timingInformation = self.getTimingInfo(key, to_play)
			self.sendScore(obj["id"], timingScore, timingInformation)
	
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

	def is_timing_close(self, key: Key, i: Key):
		return abs(i.start - key.start) < 500

	def handleMessage(self, message: str):
		obj = json.loads(message)
		if "type" not in obj.keys():
			self.sendError(message)
			return
		if obj["type"] == "note_on" or obj["type"] == "note_off":
			self.handleNote(obj)
		if obj["type"] == "pause":
			pass

	def sendDebug(self, obj):
		print(json.dumps({ "type": "debug", "msg": obj}), flush=True)

	def sendEnd(self, overall, difficulties):
		print(json.dumps({"overallScore": overall, "score": difficulties}), flush=True)

	def sendError(self, message):
		print(json.dumps({"error": f"Could not handle message {message}"}), flush=True)

	def sendScore(self, id, timingScore, timingInformation):
		print(json.dumps({"id": id, "timingScore": timingScore, "timingInformation": timingInformation}), flush=True)

	def gameLoop(self):
		while True:
			if select.select([sys.stdin, ], [], [], 0.0)[0]:
				line = input()
				if not line:
					break
				logging.info("handling message")
				self.handleMessage(line.rstrip())
			else:
				pass
		self.sendEnd(0, {})

def main():
	try:
		start_message = json.loads(input())
		if "type" not in start_message.keys() or start_message["type"] != "start" or "name" not in start_message.keys():
			print(json.dumps({"error": "Error with the start message"}), flush=True)
			exit()
		song_name = start_message["name"]
		logging.info(f"started {song_name}")
		print(json.dumps({"song_launched": song_name}), flush=True)
		sc = Scorometer(f"partitions/{song_name}.midi")
		sc.gameLoop()
	except Exception as error:
		print({ "error": error }, flush=True)

if __name__ == "__main__":
	main()
