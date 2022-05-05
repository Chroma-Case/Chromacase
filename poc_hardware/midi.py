from mido import MidiFile

for msg in MidiFile('new_song_1.mid'):
    print(msg)