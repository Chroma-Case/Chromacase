import { Note } from 'opensheetmusicdisplay';

export type PianoCursorNote = {
	note: Note;
	duration: number;
};

export type PianoCursorPosition = {
	// offset in pixels
	x: number;
	// timestamp in ms
	timing: number;
	timestamp: number;
	notes: PianoCursorNote[];
};

export type UpdateInfo = {
	currentTimestamp: number;
	status: 'playing' | 'paused' | 'stopped';
};

export enum NoteTiming {
	Perfect = 'Perfect',
	Great = 'Great',
	Good = 'Good',
	Missed = 'Missed',
	Wrong = 'Wrong',
}

export type PianoCanvasMsg = {
	type: 'noteTiming' | 'score' | 'gameUpdate';
	data: UpdateInfo | NoteTiming | number;
};

export type PianoCanvasContext = {
	messages: Array<PianoCanvasMsg>;
	// Timestamp of the play session, in miliseconds
	timestamp: number;
	pressedKeys: Map<number, number>;
};