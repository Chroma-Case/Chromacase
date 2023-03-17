

export type Note = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "#" | "b" | "##" | "bb";

export type NoteNameBehavior = "always" | "onpress" | "onhighlight" | "never";
export type KeyPressStyle = "subtle" | "vivid";

export class PianoKey {
    public note: Note;
    public accidental?: Accidental;
    public octave?: number;

    constructor(note: Note, accidental?: Accidental, octave?: number) {
        this.note = note;
        this.accidental = accidental;
        this.octave = octave;
    };

    public toString = () => {
        return this.note + (this.accidental || "") + (this.octave || "");
    }
};

export const octaveKeys: Array<PianoKey> = [
    new PianoKey("C", undefined),
    new PianoKey("C", "#"),
    new PianoKey("D", undefined),
    new PianoKey("D", "#"),
    new PianoKey("E", undefined),
    new PianoKey("F", undefined),
    new PianoKey("F", "#"),
    new PianoKey("G", undefined),
    new PianoKey("G", "#"),
    new PianoKey("A", undefined),
    new PianoKey("A", "#"),
    new PianoKey("B", undefined),
];