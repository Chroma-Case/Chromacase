/* eslint-disable no-mixed-spaces-and-tabs */
// Inspired from OSMD example project
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
import React, { useEffect } from 'react';
import {
	CursorType,
	Fraction,
	OpenSheetMusicDisplay as OSMD,
	IOSMDOptions,
	Note,
} from 'opensheetmusicdisplay';
import useColorScheme from '../hooks/colorScheme';
import { PianoCursorPosition } from './PartitionVisualizer/PhaserCanvas';

type PartitionViewProps = {
	// The Buffer of the MusicXML file retreived from the API
	file: string;
	onPartitionReady: (base64data: string, cursorInfos: PianoCursorPosition[]) => void;
	onEndReached: () => void;
	// Timestamp of the play session, in milisecond
	timestamp: number;
};

const PartitionView = (props: PartitionViewProps) => {
	const colorScheme = useColorScheme();
	const OSMD_DIV_ID = 'osmd-div';
	const options: IOSMDOptions = {
		darkMode: colorScheme == 'dark',
		backend: 'canvas',
		drawComposer: false,
		drawCredits: false,
		drawLyrics: false,
		drawPartNames: false,
		followCursor: false,
		renderSingleHorizontalStaffline: true,
		cursorsOptions: [{ type: CursorType.Standard, color: 'green', alpha: 0.5, follow: false }],
		autoResize: false,
	};
	// Turns note.Length or timestamp in ms
	const timestampToMs = (timestamp: Fraction, wholeNoteLength: number) => {
		return timestamp.RealValue * wholeNoteLength;
	};
	const getActualNoteLength = (note: Note, wholeNoteLength: number) => {
		let duration = timestampToMs(note.Length, wholeNoteLength);
		if (note.NoteTie) {
			const firstNote = note.NoteTie.Notes.at(1);
			if (Object.is(note.NoteTie.StartNote, note) && firstNote) {
				duration += timestampToMs(firstNote.Length, wholeNoteLength);
			} else {
				duration = 0;
			}
		}
		return duration;
	};

	useEffect(() => {
		const _osmd = new OSMD(OSMD_DIV_ID, options);
		Promise.all([_osmd.load(props.file)]).then(() => {
			_osmd.render();
			_osmd.cursor.show();
			const bpm = _osmd.Sheet.HasBPMInfo ? _osmd.Sheet.getExpressionsStartTempoInBPM() : 60;
			const wholeNoteLength = Math.round((60 / bpm) * 4000);
			const curPos = [];
			while (!_osmd.cursor.iterator.EndReached) {
				const notesToPlay = _osmd.cursor
					.NotesUnderCursor()
					.filter((note) => {
						return note.isRest() == false && note.Pitch;
					})
					.map((note) => {
						return {
							note: note,
							duration: getActualNoteLength(note, wholeNoteLength),
						};
					});
				const shortestNotes = _osmd!.cursor
					.NotesUnderCursor()
					.sort((n1, n2) => n1.Length.CompareTo(n2.Length))
					.at(0);
				const ts = timestampToMs(
					shortestNotes?.getAbsoluteTimestamp() ?? new Fraction(-1),
					wholeNoteLength
				);
				const sNL = timestampToMs(
					shortestNotes?.Length ?? new Fraction(-1),
					wholeNoteLength
				);
				curPos.push({
					offset: _osmd.cursor.cursorElement.offsetLeft,
					notes: notesToPlay,
					shortedNotes: shortestNotes,
					sNinfos: {
						ts,
						sNL,
						isRest: shortestNotes?.isRest(),
					},
				});
				_osmd.cursor.next();
			}
			// console.log('curPos', curPos);
			_osmd.cursor.reset();
			_osmd.cursor.hide();
			// console.log('timestamp cursor', _osmd.cursor.iterator.CurrentSourceTimestamp);
			// console.log('timestamp cursor', _osmd.cursor.iterator.CurrentVoiceEntries);
			// console.log('current measure index', _osmd.cursor.iterator.CurrentMeasureIndex);
			const osmdCanvas = document.querySelector('#' + OSMD_DIV_ID + ' canvas');
			// Ty https://github.com/jimutt/osmd-audio-player/blob/ec205a6e46ee50002c1fa8f5999389447bba7bbf/src/PlaybackEngine.ts#LL77C12-L77C63
			props.onPartitionReady(
				osmdCanvas.toDataURL(),
				curPos.map((pos) => {
					return {
						x: pos.offset,
						timing: pos.sNinfos.sNL,
						timestamp: pos.sNinfos.ts,
						notes: pos.notes,
					};
				})
			);
			// Do not show cursor before actuall start
		});
	}, []);

	return <div id={OSMD_DIV_ID} style={{ width: '100%', overflow: 'hidden' }} />;
};

export default PartitionView;
