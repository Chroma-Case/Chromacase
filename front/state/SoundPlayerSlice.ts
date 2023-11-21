import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Audio } from 'expo-av';

type MidiNumber = number;

// Source: https://computermusicresource.com/midikeys.html
// Deserve an extra credit for ding this by hand
export const PianoNotes = {
	33: 'a0',
	45: 'a1',
	57: 'a2',
	69: 'a3',
	81: 'a4',
	93: 'a5',
	105: 'a6',
	117: 'a7',
	44: 'ab1',
	56: 'ab2',
	68: 'ab3',
	80: 'ab4',
	92: 'ab5',
	104: 'ab6',
	116: 'ab7',
	35: 'b0',
	47: 'b1',
	59: 'b2',
	71: 'b3',
	83: 'b4',
	95: 'b5',
	107: 'b6',
	119: 'b7',
	34: 'bb0',
	46: 'bb1',
	58: 'bb2',
	70: 'bb3',
	82: 'bb4',
	94: 'bb5',
	106: 'bb6',
	118: 'bb7',
	36: 'c1',
	48: 'c2',
	60: 'c3',
	72: 'c4',
	84: 'c5',
	96: 'c6',
	108: 'c7',
	120: 'c8',
	38: 'd1',
	50: 'd2',
	62: 'd3',
	74: 'd4',
	86: 'd5',
	98: 'd6',
	110: 'd7',
	37: 'db1',
	49: 'db2',
	61: 'db3',
	73: 'db4',
	85: 'db5',
	97: 'db6',
	109: 'db7',
	40: 'e1',
	52: 'e2',
	64: 'e3',
	76: 'e4',
	88: 'e5',
	100: 'e6',
	112: 'e7',
	39: 'eb1',
	51: 'eb2',
	63: 'eb3',
	75: 'eb4',
	87: 'eb5',
	99: 'eb6',
	111: 'eb7',
	41: 'f1',
	53: 'f2',
	65: 'f3',
	77: 'f4',
	89: 'f5',
	101: 'f6',
	113: 'f7',
	43: 'g1',
	55: 'g2',
	67: 'g3',
	79: 'g4',
	91: 'g5',
	103: 'g6',
	115: 'g7',
	42: 'gb1',
	54: 'gb2',
	66: 'gb3',
	78: 'gb4',
	90: 'gb5',
	102: 'gb6',
	114: 'gb7',
} as const;

export type Sounds = Record<MidiNumber, Audio.Sound>;

export const soundPlayerSlice = createSlice({
	name: 'soundPlayer',
	initialState: {
		sounds: undefined as Sounds | undefined,
	},
	reducers: {
		setSounds: (state, action: PayloadAction<Sounds>) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			state.sounds = action.payload;
		},
		unsetSounds: (state) => {
			Object.entries(state.sounds ?? {}).map((sound) => sound[1].unloadAsync());
			state.sounds = undefined;
		},
	},
});
export const { setSounds, unsetSounds } = soundPlayerSlice.actions;
export default soundPlayerSlice.reducer;
