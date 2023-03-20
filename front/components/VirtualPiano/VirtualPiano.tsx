import { Row, Box } from "native-base";
import React, { useState, useEffect } from "react";
import Octave from "./Octave";
import {
	Note,
	PianoKey,
	NoteNameBehavior,
	KeyPressStyle,
	keyToStr,
	strToKey,
	HighlightedKey,
} from "../../models/Piano";

type VirtualPianoProps = Parameters<typeof Row>[0] & {
	onNoteDown: (note: PianoKey) => void;
	onNoteUp: (note: PianoKey) => void;
	startOctave: number;
	startNote: Note;
	endOctave: number;
	endNote: Note;
	showNoteNames: NoteNameBehavior; // default "onpress"
	highlightedNotes: Array<HighlightedKey>;
	showOctaveNumbers: boolean;
};

const VirtualPiano = ({
	onNoteDown,
	onNoteUp,
	startOctave,
	startNote,
	endOctave,
	endNote,
	showNoteNames,
	highlightedNotes,
	showOctaveNumbers,
}: VirtualPianoProps) => {
	const notesList: Array<Note> = [
		Note.C,
		Note.D,
		Note.E,
		Note.F,
		Note.G,
		Note.A,
		Note.B,
	];
	const octaveList = [];

	for (let octaveNum = startOctave; octaveNum <= endOctave; octaveNum++) {
		octaveList.push(octaveNum);
	}

	return (
		<Row>
			{octaveList.map((octaveNum) => {
				return (
					<Octave
						width={"350px"}
						height={"200px"}
						key={octaveNum}
						number={octaveNum}
						showNoteNames={showNoteNames}
						showOctaveNumber={showOctaveNumbers}
						highlightedNotes={highlightedNotes.filter(
							(n) => n.key.octave ? n.key.octave == octaveNum : true
						)}
						startNote={octaveNum == startOctave ? startNote : notesList[0]}
						endNote={
							octaveNum == endOctave ? endNote : notesList[notesList.length - 1]
						}
						onNoteDown={onNoteDown}
						onNoteUp={onNoteUp}
					/>
				);
			})}
		</Row>
	);
};

VirtualPiano.defaultProps = {
	onNoteDown: (n) => {
		console.log("Note down: " + keyToStr(n));
	},
	onNoteUp: (n) => {
		console.log("Note up: " + keyToStr(n));
	},
	startOctave: 2,
	startNote: Note.C,
	endOctave: 6,
	endNote: Note.C,
	showNoteNames: NoteNameBehavior.onpress,
	highlightedNotes: [
		{ key: strToKey("D3") },
		{ key: strToKey("A#"), bgColor: "#00FF00" },
	],
	showOctaveNumbers: true,
};

export default VirtualPiano;
