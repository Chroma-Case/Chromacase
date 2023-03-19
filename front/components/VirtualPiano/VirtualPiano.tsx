import { Row, Box } from "native-base";
import React, { useState, useEffect } from "react";
import Octave from "./Octave";
import { Note, PianoKey, NoteNameBehavior, KeyPressStyle, octaveKeys } from "../../models/Piano";

type VirtualPianoProps = Parameters<typeof Row>[0] & {
	onNoteDown: (note: PianoKey) => void;
	onNoteUp: (note: PianoKey) => void;
	startOctave: number;
	startNote: Note;
	endOctave: number;
	endNote: Note;
	showNoteNames: NoteNameBehavior; // default "onpress"
	highlightedNotes: Array<PianoKey | string>;
	highlightColor: string;
	specialHighlightedNotes: Array<PianoKey | string>;
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
    const octaveList = [];

    for (let octaveNum = startOctave; octaveNum <= endOctave; octaveNum++) {
        octaveList.push(octaveNum);
    };

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
	endOctave: 2,
	endNote: "B",
	showNoteNames: "onhover",
	highlightedNotes: [],
	highlightColor: "red",
	specialHighlightedNotes: [],
	specialHighlightColor: "blue",
	showOctaveNumbers: true,
	keyPressStyle: "subtle",
	vividKeyPressColor: "red",
};

export default VirtualPiano;
