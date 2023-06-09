// Inspired from OSMD example project
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
import React, { useEffect, useState } from 'react';
import { CursorType, Fraction, OpenSheetMusicDisplay as OSMD, IOSMDOptions, Note, Pitch } from 'opensheetmusicdisplay';
import useColorScheme from '../hooks/colorScheme';
import { useWindowDimensions } from 'react-native';
import SoundFont from 'soundfont-player';
import * as SAC from 'standardized-audio-context';

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
	const audioContext = new SAC.AudioContext();
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

	const playNotesUnderCursor = () => {
		osmd!.cursor.NotesUnderCursor()
			.filter((note) => note.isRest() == false)
			.filter((note) => note.Pitch) // Pitch Can be null, avoiding them
			.forEach((note) => {
				// Put your hands together for https://github.com/jimutt/osmd-audio-player/blob/master/src/internals/noteHelpers.ts
				const fixedKey = note.ParentVoiceEntry.ParentVoice.Parent.SubInstruments.at(0)?.fixedKey ?? 0;
				const midiNumber = note.halfTone - fixedKey * 12;
				// console.log('Expecting midi ' + midiNumber);
				let duration = getActualNoteLength(note);
				const gain = note.ParentVoiceEntry.ParentVoice.Volume;
				soundPlayer!.play(midiNumber.toString(), audioContext.currentTime, { duration, gain })
			});
	}
	const getShortedNoteUnderCursor = () => {
		return osmd!.cursor.NotesUnderCursor().sort((n1, n2) => n1.Length.CompareTo(n2.Length)).at(0);
	}

	useEffect(() => {
		const _osmd = new OSMD(OSMD_DIV_ID, options);
		Promise.all([
			SoundFont.instrument(audioContext as unknown as AudioContext, 'electric_piano_1'),
			_osmd.load(props.file)
		]).then(([player, __]) => {
				setSoundPlayer(player);
				_osmd.render();
				_osmd.cursor.hide();
				// Ty https://github.com/jimutt/osmd-audio-player/blob/ec205a6e46ee50002c1fa8f5999389447bba7bbf/src/PlaybackEngine.ts#LL77C12-L77C63
				const bpm = _osmd.Sheet.HasBPMInfo ? _osmd.Sheet.getExpressionsStartTempoInBPM() : 60;
				setWholeNoteLength(Math.round((60 / bpm) * 4000))
				props.onPartitionReady();
				// Do not show cursor before actuall start
			});
		setOsmd(_osmd);
	}, []);
	
	// Re-render manually (otherwise done by 'autoResize' option), to fix disappearing cursor
	useEffect(() => {
		if (osmd && osmd.IsReadyToRender()) {
			osmd.render();
			if (!osmd.cursor.hidden) {
				osmd.cursor.show();
			}
		}
	}, [dimensions])

	useEffect(() => {
		if (!osmd || !soundPlayer) {
			return;
		}
		if (props.timestamp > 0 && osmd.cursor.hidden && !osmd.cursor.iterator.EndReached) {
			osmd.cursor.show();
			playNotesUnderCursor();
			return;
		}
		let previousCursorPosition = -1;
		let currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
		let shortestNote = getShortedNoteUnderCursor();
		while(!osmd.cursor.iterator.EndReached && (shortestNote?.isRest
			? timestampToMs(shortestNote?.getAbsoluteTimestamp() ?? new Fraction(-1)) +
				timestampToMs(shortestNote?.Length ?? new Fraction(-1)) < props.timestamp
			: timestampToMs(shortestNote?.getAbsoluteTimestamp() ?? new Fraction(-1)) < props.timestamp)
		) {
			previousCursorPosition = currentCursorPosition;
			osmd.cursor.next();
			if (osmd.cursor.iterator.EndReached) {
				osmd.cursor.hide(); // Lousy fix for https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/issues/1338
				soundPlayer.stop();
				props.onEndReached();
			} else {
				// Shamelessly stolen from https://github.com/jimutt/osmd-audio-player/blob/ec205a6e46ee50002c1fa8f5999389447bba7bbf/src/PlaybackEngine.ts#LL223C7-L224C1
				playNotesUnderCursor();
				currentCursorPosition = osmd.cursor.cursorElement.offsetLeft;
				document.getElementById(OSMD_DIV_ID)?.scrollBy(currentCursorPosition - previousCursorPosition, 0)
				shortestNote = getShortedNoteUnderCursor();
			}
		}
	}, [props.timestamp]);

	return (<div id={OSMD_DIV_ID} style={{ width: '100%', overflow: 'hidden' }} />);
}

export default PartitionView;
