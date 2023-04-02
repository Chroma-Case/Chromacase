import { Row, Box } from "native-base";
import React, { useState, useEffect } from "react";
import Octave from "./Octave";
import { StyleProp, ViewStyle } from "react-native";
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
	style: StyleProp<ViewStyle>;
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
	style,
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

    const octaveWidthExpr = `calc(100% / ${octaveList.length})`;

	return (
		<Row style={style}>
			{octaveList.map((octaveNum) => {
				return (
					<Octave
						style={{ width: octaveWidthExpr, height: "100%" }}
						key={octaveNum}
						number={octaveNum}
						showNoteNames={showNoteNames}
						showOctaveNumber={showOctaveNumbers}
						highlightedNotes={highlightedNotes.filter((n) =>
							n.key.octave ? n.key.octave == octaveNum : true
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
	onNoteDown: (_n: PianoKey) => {},
	onNoteUp: (_n: PianoKey) => {},
	startOctave: 2,
	startNote: Note.C,
	endOctave: 6,
	endNote: Note.C,
	showNoteNames: NoteNameBehavior.onpress,
	highlightedNotes: [],
	showOctaveNumbers: true,
    style: {},
};

export default VirtualPiano;
