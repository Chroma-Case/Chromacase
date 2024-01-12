#!/bin/bash

# Iterate through subfolders
find . -type d | while read -r dir; do
    # Check if .midi file exists in the subfolder
    midi_file=$(find "$dir" -maxdepth 1 -type f -name '*.midi' | head -n 1)

    if [ -n "$midi_file" ]; then
        # Create output file name (melody.mp3) in the same subfolder
        output_file="${dir}/melody.mp3"

        # Run the given command
        #timidity "$midi_file" -Ow -o - | ffmpeg -i - -acodec libmp3lame -ab 64k "$output_file"
        fluidsynth -a alsa -T raw -F - "$midi_file" | ffmpeg -f s32le -i - "$output_file"

        echo "Converted: $midi_file to $output_file"
    fi
done

