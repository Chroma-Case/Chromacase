export enum Note {
	"C",
	"C#",
	"D",
	"D#",
	"E",
	"F",
	"F#",
	"G",
	"G#",
	"A",
	"A#",
	"B",
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
}
export type HighlightedKey = {
	key: PianoKey;
	// if not specified, the default color for highlighted notes will be used
	bgColor?: string;
};

export class PianoKey {
	public note: Note;
	public octave?: number;

	constructor(note: Note, octave?: number) {
		this.note = note;
		this.octave = octave;
	}

	public toString = () => {
		return (this.note as unknown as string) + (this.octave || "");
	};
}

export const strToKey = (str: string): PianoKey => {
	let note: Note;
	switch (str.substring(0, 2)) {
		case "C":
			note = Note.C;
			break;
		case "D":
			note = Note.D;
			break;
		case "E":
			note = Note.E;
			break;
		case "F":
			note = Note.F;
			break;
		case "G":
			note = Note.G;
			break;
		case "A":
			note = Note.A;
			break;
		case "B":
			note = Note.B;
			break;
		case "C#":
			note = Note["C#"];
			break;
		case "D#":
			note = Note["D#"];
			break;
		case "F#":
			note = Note["F#"];
			break;
		case "G#":
			note = Note["G#"];
			break;
		case "A#":
			note = Note["A#"];
			break;
		default:
			throw new Error("Invalid note name");
	}
	if (str.length < 3) {
		return new PianoKey(note);
	}
	const octave = parseInt(str[2] as unknown as string);
	return new PianoKey(note, octave);
};

export const keyToStr = (key: PianoKey, showOctave: boolean = true): string => {
	let s = "";
	switch (key.note) {
		case Note.C:
			s += "C";
			break;
		case Note.D:
			s += "D";
			break;
		case Note.E:
			s += "E";
			break;
		case Note.F:
			s += "F";
			break;
		case Note.G:
			s += "G";
			break;
		case Note.A:
			s += "A";
			break;
		case Note.B:
			s += "B";
			break;
		case Note["C#"]:
			s += "C#";
			break;
		case Note["D#"]:
			s += "D#";
			break;
		case Note["F#"]:
			s += "F#";
			break;
		case Note["G#"]:
			s += "G#";
			break;
		case Note["A#"]:
			s += "A#";
			break;
		default:
			throw new Error("Invalid note name");
	}
	if (showOctave && key.octave) {
		s += key.octave;
	}
	return s;
};

export const isAccidental = (key: PianoKey): boolean => {
	return (
		key.note === Note["C#"] ||
		key.note === Note["D#"] ||
		key.note === Note["F#"] ||
		key.note === Note["G#"] ||
		key.note === Note["A#"]
	);
};

export const octaveKeys: Array<PianoKey> = [
	new PianoKey(Note.C),
	new PianoKey(Note["C#"]),
	new PianoKey(Note.D),
	new PianoKey(Note["D#"]),
	new PianoKey(Note.E),
	new PianoKey(Note.F),
	new PianoKey(Note["F#"]),
	new PianoKey(Note.G),
	new PianoKey(Note["G#"]),
	new PianoKey(Note.A),
	new PianoKey(Note["A#"]),
	new PianoKey(Note.B),
];
