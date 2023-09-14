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

export type PianoScoreInfo = {
	score: number;
	streak: number;
};


export enum NoteTiming {
	Perfect = 'Perfect',
	Great = 'Great',
	Good = 'Good',
	Missed = 'Missed',
	Wrong = 'Wrong',
}

export type PianoCanvasMsg = {
	type: 'noteTiming' | 'scoreInfo' | 'gameUpdate';
	data: UpdateInfo | NoteTiming | PianoScoreInfo | number;
};

export type PianoCanvasContext = {
	messages: Array<PianoCanvasMsg>;
	// Timestamp of the play session, in miliseconds
	timestamp: number;
	pressedKeys: Map<number, number>;
};