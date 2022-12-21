from time import sleep
from chroma_case.Partition import Partition
from chroma_case.Note import Note
import asyncio
import sys
import select
import json
from mido import MidiFile

RATIO = float(sys.argv[2] if len(sys.argv) > 2 else 1)
OCTAVE = 5
OCTAVE_AMOUNT_KEYS = 12
TRANSPOSE_AMOUNT = OCTAVE_AMOUNT_KEYS * OCTAVE

async def printing(data):
	print(f"key: {data['key']}, c:{data['color']} for {data['duration'] / 1000}s, time: {data['time']}")
	await asyncio.sleep(data['duration'] / 1000)
	print(f"end of {data['key']}")

def getPartition():
	notes = []
	# notes will start to play at 3500 ms 
	s = 3500

	notes_on = {}
	prev_note_on = {}

	for msg in MidiFile(sys.argv[1]):
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

	return Partition(sys.argv[1], notes)

def handleMessage(message: str):
	obj = json.loads(message)
	if "type" not in obj.keys():
		sendError(message)
		return
	if obj["type"] == "midi":
		pass
	if obj["type"] == "pause":
		pass

def sendEnd(overall, difficulties):
	print(json.dumps({"overallScore": overall, "score": difficulties}))
	pass

def sendError(message):
	print(json.dumps({"error": f"Could not handle message {message}"}))
	pass

def gameLoop(partition):
	while True:
		if select.select([sys.stdin, ], [], [], 0.0)[0]:
			line = sys.stdin.readline()
			if not line:
				break
			handleMessage(line.rstrip())
		else:
			pass
			sleep(0.5)
	sendEnd(0, {})

def main():
	p = getPartition()
	gameLoop(p)

if __name__ == "__main__":
	main()
