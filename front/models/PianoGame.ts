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
