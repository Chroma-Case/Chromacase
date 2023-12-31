import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { Audio } from 'expo-av';

type MidiNumber = number;

// Source: https://computermusicresource.com/midikeys.html
// Deserve an extra credit for doing this by hand
// The value is the value returned by `required`, needed by Expo to load/play the sound
export const PianoNotes = {
	33: 'a0.mp3',
	45: 'a1.mp3',
	57: 'a2.mp3',
	69: 'a3.mp3',
	81: 'a4.mp3',
	93: 'a5.mp3',
	105: 'a6.mp3',
	117: 'a7.mp3',
	44: 'ab1.mp3',
	56: 'ab2.mp3',
	68: 'ab3.mp3',
	80: 'ab4.mp3',
	92: 'ab5.mp3',
	104: 'ab6.mp3',
	116: 'ab7.mp3',
	35: 'b0.mp3',
	47: 'b1.mp3',
	59: 'b2.mp3',
	71: 'b3.mp3',
	83: 'b4.mp3',
	95: 'b5.mp3',
	107: 'b6.mp3',
	119: 'b7.mp3',
	34: 'bb0.mp3',
	46: 'bb1.mp3',
	58: 'bb2.mp3',
	70: 'bb3.mp3',
	82: 'bb4.mp3',
	94: 'bb5.mp3',
	106: 'bb6.mp3',
	118: 'bb7.mp3',
	36: 'c1.mp3',
	48: 'c2.mp3',
	60: 'c3.mp3',
	72: 'c4.mp3',
	84: 'c5.mp3',
	96: 'c6.mp3',
	108: 'c7.mp3',
	120: 'c8.mp3',
	38: 'd1.mp3',
	50: 'd2.mp3',
	62: 'd3.mp3',
	74: 'd4.mp3',
	86: 'd5.mp3',
	98: 'd6.mp3',
	110: 'd7.mp3',
	37: 'db1.mp3',
	49: 'db2.mp3',
	61: 'db3.mp3',
	73: 'db4.mp3',
	85: 'db5.mp3',
	97: 'db6.mp3',
	109: 'db7.mp3',
	40: 'e1.mp3',
	52: 'e2.mp3',
	64: 'e3.mp3',
	76: 'e4.mp3',
	88: 'e5.mp3',
	100: 'e6.mp3',
	112: 'e7.mp3',
	39: 'eb1.mp3',
	51: 'eb2.mp3',
	63: 'eb3.mp3',
	75: 'eb4.mp3',
	87: 'eb5.mp3',
	99: 'eb6.mp3',
	111: 'eb7.mp3',
	41: 'f1.mp3',
	53: 'f2.mp3',
	65: 'f3.mp3',
	77: 'f4.mp3',
	89: 'f5.mp3',
	101: 'f6.mp3',
	113: 'f7.mp3',
	43: 'g1.mp3',
	55: 'g2.mp3',
	67: 'g3.mp3',
	79: 'g4.mp3',
	91: 'g5.mp3',
	103: 'g6.mp3',
	115: 'g7.mp3',
	42: 'gb1.mp3',
	54: 'gb2.mp3',
	66: 'gb3.mp3',
	78: 'gb4.mp3',
	90: 'gb5.mp3',
	102: 'gb6.mp3',
	114: 'gb7.mp3',
} as const;

export type Sounds = Record<MidiNumber, string>;

export const soundPlayerSlice = createSlice({
	name: 'soundPlayer',
	initialState: {
		sounds: undefined as Sounds | undefined,
	},
	reducers: {
		setSounds: (state, action: PayloadAction<Sounds>) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			state.sounds = action.payload;
		},
		unsetSounds: (state) => {
			// Object.entries(state.sounds ?? {}).map((sound) => sound[1].unloadAsync());
			state.sounds = undefined;
		},
	},
});
export const { setSounds, unsetSounds } = soundPlayerSlice.actions;
export default soundPlayerSlice.reducer;
