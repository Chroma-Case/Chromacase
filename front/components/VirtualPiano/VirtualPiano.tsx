import { Row, Box } from "native-base";
import React, { useState, useEffect } from "react";
import Octave from "./Octave";

export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "#" | "b" | "##" | "bb";

export type NoteValue = {
	note: Note;
	accidental?: Accidental;
	octave?: number;
};

export type NoteNameBehavior = "always" | "onpress" | "onhighlight" | "never";
export type KeyPressStyle = "subtle" | "vivid";

type VirtualPianoProps = Parameters<typeof Row>[0] & {
	onNoteDown: (note: Note) => void;
	onNoteUp: (note: Note) => void;
	startOctave: number;
	startNote: Note;
	endOctave: number;
	endNote: Note;
	showNoteNames: NoteNameBehavior; // default "onpress"
	highlightedNotes: Array<NoteValue | string>;
	highlightColor: string;
	specialHighlightedNotes: Array<NoteValue | string>;
	specialHighlightColor: string;
	showOctaveNumbers: boolean;
	keyPressStyle: KeyPressStyle;
	vividKeyPressColor: string;
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
    highlightColor,
    specialHighlightedNotes,
    specialHighlightColor,
    showOctaveNumbers,
    keyPressStyle,
    vividKeyPressColor,
}: VirtualPianoProps) => {
	const notesList: Array<Note> = ["C", "D", "E", "F", "G", "A", "B"];
    const nbOctaves = endOctave - startOctave;
	const nbWhiteKeys =
		notesList.length * (endOctave - startOctave) -
		notesList.indexOf(startNote) -
		(notesList.length - notesList.indexOf(endNote) + 1);
    const octaveList = [];

    for (let octaveNum = startOctave; octaveNum <= endOctave; octaveNum++) {
        octaveList.push(octaveNum);
    };



	return (
		<Row>
            {octaveList.map((octaveNum) => {
                return (
                    <Octave
                        key={octaveNum}
                        number={octaveNum}
                        startNote={octaveNum == startOctave ? startNote : notesList[0]}
                        endNote={octaveNum == endOctave ? endNote : notesList[notesList.length - 1]}
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
        console.log("Note down: " + n);
    },
    onNoteUp: (n) => {
        console.log("Note up: " + n);
    },
	startOctave: 2,
	startNote: "C",
	endOctave: 6,
	endNote: "C",
	showNoteNames: "onpress",
	highlightedNotes: [],
	highlightColor: "red",
	specialHighlightedNotes: [],
	specialHighlightColor: "blue",
	showOctaveNumbers: true,
	keyPressStyle: "subtle",
	vividKeyPressColor: "red",
};

export default VirtualPiano;
