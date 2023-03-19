export enum Note {
	"C",
	"D",
	"E",
	"F",
	"G",
	"A",
	"B",
}

export enum Accidental {
	"#",
	"b",
	"##",
	"bb",
}

export enum NoteNameBehavior {
	"always",
	"onpress",
	"onhighlight",
	"onhover",
	"never",
}
export enum KeyPressStyle {
	"subtle",
	"vivid",
};
export type HighlightedKey = {
	key: PianoKey;
	// if not specified, the default color for highlighted notes will be used
	bgColor?: string;
};

export class PianoKey {
	public note: Note;
	public accidental?: Accidental;
	public octave?: number;

	constructor(note: Note, accidental?: Accidental, octave?: number) {
		this.note = note;
		this.accidental = accidental;
		this.octave = octave;
	}

	public toString = () => {
		return this.note as unknown as string + (this.accidental || "") + (this.octave || "");
	};
}

export const strToKey = (str: string): PianoKey => {
    let note : Note;
    switch (str[0]) {
        case "C": note = Note.C; break;
        case "D": note = Note.D; break;
        case "E": note = Note.E; break;
        case "F": note = Note.F; break;
        case "G": note = Note.G; break;
        case "A": note = Note.A; break;
        case "B": note = Note.B; break;
        default: throw new Error("Invalid note name");
    }
    if (str.length === 1) {
        return new PianoKey(note);
    }
    let accidental : Accidental;
    switch (str[1]) {
        case "#": accidental = Accidental["#"]; break;
        case "b": accidental = Accidental["b"]; break;
        case "x": accidental = Accidental["##"]; break;
        case "n": accidental = Accidental["bb"]; break;
        default: throw new Error("Invalid accidental");
    }
    if (str.length === 2) {
        return new PianoKey(note, accidental);
    }
    const octave = parseInt(str[2] as unknown as string);
    return new PianoKey(note, accidental, octave);
};

export const keyToStr = (key: PianoKey, showOctave: boolean = true): string => {
    let s = "";
    switch (key.note) {
        case Note.C: s += "C"; break;
        case Note.D: s += "D"; break;
        case Note.E: s += "E"; break;
        case Note.F: s += "F"; break;
        case Note.G: s += "G"; break;
        case Note.A: s += "A"; break;
        case Note.B: s += "B"; break;
    }
    if (key.accidental !== undefined) {
        switch (key.accidental) {
            default: s += "#"; break;
        }
    }
    if (showOctave && key.octave) {
        s += key.octave;
    }
    return s;
};

export const octaveKeys: Array<PianoKey> = [
	new PianoKey(Note.C),
	new PianoKey(Note.C, Accidental["#"]),
    new PianoKey(Note.D),
    new PianoKey(Note.D, Accidental["#"]),
    new PianoKey(Note.E),
    new PianoKey(Note.F),
    new PianoKey(Note.F, Accidental["#"]),
    new PianoKey(Note.G),
    new PianoKey(Note.G, Accidental["#"]),
    new PianoKey(Note.A),
    new PianoKey(Note.A, Accidental["#"]),
    new PianoKey(Note.B),
];