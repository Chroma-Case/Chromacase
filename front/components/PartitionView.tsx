// Inspired from OSMD example project
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
import React, { useEffect, useState } from 'react';
import { CursorType, Fraction, OpenSheetMusicDisplay as OSMD, IOSMDOptions, Note, Pitch } from 'opensheetmusicdisplay';
import useColorScheme from '../hooks/colorScheme';
import { useWindowDimensions } from 'react-native';
import SoundFont from 'soundfont-player';

type PartitionViewProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: () => void;
	onEndReached: () => void;
	// Timestamp of the play session, in milisecond 
	timestamp: number;
}

const PartitionView = (props: PartitionViewProps) => {
	const [osmd, setOsmd] = useState<OSMD>();
	const [soundPlayer, setSoundPlayer] = useState<SoundFont.Player>();
	const audioContext = new AudioContext();
	const [wholeNoteLength, setWholeNoteLength] = useState(0); // Length of Whole note, in ms (?)
	const colorScheme = useColorScheme();
	const dimensions = useWindowDimensions();
	const OSMD_DIV_ID = 'osmd-div';
	const options: IOSMDOptions = {
		darkMode: colorScheme == 'dark',
		drawComposer: false,
		drawCredits: false,
		drawLyrics: false,
		drawPartNames: false,
		followCursor: false,
		renderSingleHorizontalStaffline: true,
		cursorsOptions: [{ type: CursorType.Standard, color: 'green', alpha: 0.5, follow: false }],
		autoResize: false,
	}
	// Turns note.Length or timestamp in ms
	const timestampToMs = (timestamp: Fraction) => {
		return timestamp.RealValue * wholeNoteLength;
	}
	const getActualNoteLength = (note: Note) => {
		let duration = timestampToMs(note.Length)
		if (note.NoteTie) {
			const firstNote = note.NoteTie.Notes.at(1)
			if (Object.is(note.NoteTie.StartNote, note) && firstNote) {
				duration += timestampToMs(firstNote.Length);
			} else {
				duration = 0;
			}
		}
		return duration;
	}

	useEffect(() => {
		const _osmd = new OSMD(OSMD_DIV_ID, options);
		Promise.all([
			SoundFont.instrument(audioContext, 'electric_piano_1'),
			_osmd.load(props.file)
		]).then(([player, __]) => {
				setSoundPlayer(player);
				_osmd.render();
				// Ty https://github.com/jimutt/osmd-audio-player/blob/ec205a6e46ee50002c1fa8f5999389447bba7bbf/src/PlaybackEngine.ts#LL77C12-L77C63
				setWholeNoteLength(Math.round((60 / _osmd.Sheet.getExpressionsStartTempoInBPM()) * 4000))
				props.onPartitionReady();
				_osmd.cursor.show();
			});
		setOsmd(_osmd);
	}, []);
	
	// Re-render manually (otherwise done by 'autoResize' option), to fix disappearing cursor
	useEffect(() => {
		if (osmd && osmd.IsReadyToRender()) {
			osmd.render();
			osmd.cursor.show();
		}
	}, [dimensions])

	useEffect(() => {
		if (!osmd || !soundPlayer) {
			return;
		}
		let previousCursorPosition = -1;
		let currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
		while(!osmd.cursor.iterator.EndReached && timestampToMs(osmd.cursor.NotesUnderCursor().at(0)?.getAbsoluteTimestamp() ?? new Fraction(-1)) < props.timestamp) {
			previousCursorPosition = currentCursorPosition;
			osmd.cursor.next();
			osmd.cursor.show();
			if (osmd.cursor.iterator.EndReached) {
				osmd.cursor.hide(); // Lousy fix for https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/issues/1338
				props.onEndReached();
			}
			// Shamelessly stolen from https://github.com/jimutt/osmd-audio-player/blob/ec205a6e46ee50002c1fa8f5999389447bba7bbf/src/PlaybackEngine.ts#LL223C7-L224C1
			osmd.cursor.NotesUnderCursor()
				.filter((note) => note.isRest() == false)
				.filter((note) => note.Pitch) // Pitch Can be null, avoiding them
				.forEach((note) => {
					// Put your hands together for https://github.com/jimutt/osmd-audio-player/blob/master/src/internals/noteHelpers.ts
					const fixedKey = note.ParentVoiceEntry.ParentVoice.Parent.SubInstruments.at(0)?.fixedKey ?? 0;
					const midiNumber = note.halfTone - fixedKey * 12;
					let duration = getActualNoteLength(note);
					const gain = note.ParentVoiceEntry.ParentVoice.Volume;
					soundPlayer.play(midiNumber, audioContext.currentTime, { duration, gain })

				});
			currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
			document.getElementById(OSMD_DIV_ID).scrollBy(currentCursorPosition - previousCursorPosition, 0)
		}
	}, [props.timestamp]);

	return (<div id={OSMD_DIV_ID} style={{ width: '100%', overflow: 'hidden' }} />);
}

export default PartitionView;
