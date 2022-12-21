from time import sleep
from chroma_case.Partition import Partition
from chroma_case.Note import Note
import sys
import select
import json
from mido import MidiFile

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12
TRANSPOSE_AMOUNT = OCTAVE_AMOUNT_KEYS * OCTAVE

class Scorometer():
	def __init__(self, midiFile) -> None:
		self.partition = self.getPartition(midiFile)
		pass
	def getPartition(self, midiFile):
		notes = []
		# notes will start to play at 3500 ms 
		s = 3500
		notes_on = {}
		prev_note_on = {}
		for msg in MidiFile(midiFile):
			d = msg.dict()
#		print(msg, s)
			s += d['time'] * 1000 * RATIO

			if d["type"] == "note_on":
				prev_note_on[d["note"]] = 0
				if d["note"] in notes_on:
					prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
				notes_on[d["note"]] = s # 0

			if d["type"] == "note_off":
				#duration = s - notes_on[d["note"]]
				duration = s - notes_on[d["note"]]
				note_start = notes_on[d["note"]]
				# time value is only used during debug
				notes.append(Note(note_start, {
					"time": note_start,
					"duration": duration - 10,
					#		"color": default_color if note_color[d["note"]] else (255, 100, 0),
					"key": d["note"]
					}))
				notes_on[d["note"]] = s # 500
		return Partition(midiFile, notes)


	def handleMessage(self, message: str):
		obj = json.loads(message)
		if "type" not in obj.keys():
			self.sendError(message)
			return
		if obj["type"] == "note_on" or obj["type"] == "note_off":
			pass
		if obj["type"] == "pause":
			pass

	def sendEnd(self, overall, difficulties):
		print(json.dumps({"overallScore": overall, "score": difficulties}))
		pass

	def sendError(self, message):
		print(json.dumps({"error": f"Could not handle message {message}"}))
		pass

	def gameLoop(self):
		while True:
			if select.select([sys.stdin, ], [], [], 0.0)[0]:
				line = sys.stdin.readline()
				if not line:
					break
				self.handleMessage(line.rstrip())
			else:
				pass
			sleep(0.5)
		self.sendEnd(0, {})

def main():
	start_message = json.loads(input())
	if start_message["type"] != "start" or "name" not in start_message.keys():
		print(json.dumps({"error": "Error with the start message"}))
		exit()
	song_name = start_message["name"]
	sc = Scorometer(song_name)
	sc.gameLoop()

if __name__ == "__main__":
	main()
