import os

import glob
from chroma_case.Key import Key
from chroma_case.Partition import Partition
from mido import MidiFile



RATIO = 1.0

def getPartition(midiFile: str) -> Partition:
		notes = []
		s = 0
		notes_on = {}
		prev_note_on = {}
		for msg in MidiFile(midiFile):
			d = msg.dict()
			s += d["time"] * 1000 * RATIO
			if "velocity" not in d: continue
			if d["type"] == "note_on" and d["velocity"] != 0:
				prev_note_on[d["note"]] = 0
				if d["note"] in notes_on:
					prev_note_on[d["note"]] = notes_on[d["note"]]  # 500
				notes_on[d["note"]] = s  # 0

			if d["type"] == "note_off" or d["velocity"] == 0:
				duration = s - notes_on[d["note"]]
				note_start = notes_on[d["note"]]
				notes.append(Key(d["note"], note_start, duration - 10))
				notes_on[d["note"]] = s  # 500
		return Partition(midiFile, notes)



for file in glob.glob("../musics/**/*.ini", recursive=True):
		print(f"File found: {file}")
		path = os.path.splitext(file)[0]
		midi_path = path + ".midi"
		try:
			p = getPartition(midi_path)
			if len(p.notes) == 0: print(f"Empty partition: {midi_path}")
		except:
			print(f"Error: {midi_path}")
			continue



