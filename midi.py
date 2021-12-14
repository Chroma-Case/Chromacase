from mido import MidiFile

for msg in MidiFile('new_song_1.mid').play():
    print(msg)