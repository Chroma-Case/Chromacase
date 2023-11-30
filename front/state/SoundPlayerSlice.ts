import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Audio } from 'expo-av';

type MidiNumber = number;

// Source: https://computermusicresource.com/midikeys.html
// Deserve an extra credit for doing this by hand
// The value is the value returned by `required`, needed by Expo to load/play the sound
export const PianoNotes = {
	33: require('../assets/piano/a0.mp3'),
	45: require('../assets/piano/a1.mp3'),
	57: require('../assets/piano/a2.mp3'),
	69: require('../assets/piano/a3.mp3'),
	81: require('../assets/piano/a4.mp3'),
	93: require('../assets/piano/a5.mp3'),
	105: require('../assets/piano/a6.mp3'),
	117: require('../assets/piano/a7.mp3'),
	44: require('../assets/piano/ab1.mp3'),
	56: require('../assets/piano/ab2.mp3'),
	68: require('../assets/piano/ab3.mp3'),
	80: require('../assets/piano/ab4.mp3'),
	92: require('../assets/piano/ab5.mp3'),
	104: require('../assets/piano/ab6.mp3'),
	116: require('../assets/piano/ab7.mp3'),
	35: require('../assets/piano/b0.mp3'),
	47: require('../assets/piano/b1.mp3'),
	59: require('../assets/piano/b2.mp3'),
	71: require('../assets/piano/b3.mp3'),
	83: require('../assets/piano/b4.mp3'),
	95: require('../assets/piano/b5.mp3'),
	107: require('../assets/piano/b6.mp3'),
	119: require('../assets/piano/b7.mp3'),
	34: require('../assets/piano/bb0.mp3'),
	46: require('../assets/piano/bb1.mp3'),
	58: require('../assets/piano/bb2.mp3'),
	70: require('../assets/piano/bb3.mp3'),
	82: require('../assets/piano/bb4.mp3'),
	94: require('../assets/piano/bb5.mp3'),
	106: require('../assets/piano/bb6.mp3'),
	118: require('../assets/piano/bb7.mp3'),
	36: require('../assets/piano/c1.mp3'),
	48: require('../assets/piano/c2.mp3'),
	60: require('../assets/piano/c3.mp3'),
	72: require('../assets/piano/c4.mp3'),
	84: require('../assets/piano/c5.mp3'),
	96: require('../assets/piano/c6.mp3'),
	108: require('../assets/piano/c7.mp3'),
	120: require('../assets/piano/c8.mp3'),
	38: require('../assets/piano/d1.mp3'),
	50: require('../assets/piano/d2.mp3'),
	62: require('../assets/piano/d3.mp3'),
	74: require('../assets/piano/d4.mp3'),
	86: require('../assets/piano/d5.mp3'),
	98: require('../assets/piano/d6.mp3'),
	110: require('../assets/piano/d7.mp3'),
	37: require('../assets/piano/db1.mp3'),
	49: require('../assets/piano/db2.mp3'),
	61: require('../assets/piano/db3.mp3'),
	73: require('../assets/piano/db4.mp3'),
	85: require('../assets/piano/db5.mp3'),
	97: require('../assets/piano/db6.mp3'),
	109: require('../assets/piano/db7.mp3'),
	40: require('../assets/piano/e1.mp3'),
	52: require('../assets/piano/e2.mp3'),
	64: require('../assets/piano/e3.mp3'),
	76: require('../assets/piano/e4.mp3'),
	88: require('../assets/piano/e5.mp3'),
	100: require('../assets/piano/e6.mp3'),
	112: require('../assets/piano/e7.mp3'),
	39: require('../assets/piano/eb1.mp3'),
	51: require('../assets/piano/eb2.mp3'),
	63: require('../assets/piano/eb3.mp3'),
	75: require('../assets/piano/eb4.mp3'),
	87: require('../assets/piano/eb5.mp3'),
	99: require('../assets/piano/eb6.mp3'),
	111: require('../assets/piano/eb7.mp3'),
	41: require('../assets/piano/f1.mp3'),
	53: require('../assets/piano/f2.mp3'),
	65: require('../assets/piano/f3.mp3'),
	77: require('../assets/piano/f4.mp3'),
	89: require('../assets/piano/f5.mp3'),
	101: require('../assets/piano/f6.mp3'),
	113: require('../assets/piano/f7.mp3'),
	43: require('../assets/piano/g1.mp3'),
	55: require('../assets/piano/g2.mp3'),
	67: require('../assets/piano/g3.mp3'),
	79: require('../assets/piano/g4.mp3'),
	91: require('../assets/piano/g5.mp3'),
	103: require('../assets/piano/g6.mp3'),
	115: require('../assets/piano/g7.mp3'),
	42: require('../assets/piano/gb1.mp3'),
	54: require('../assets/piano/gb2.mp3'),
	66: require('../assets/piano/gb3.mp3'),
	78: require('../assets/piano/gb4.mp3'),
	90: require('../assets/piano/gb5.mp3'),
	102: require('../assets/piano/gb6.mp3'),
	114: require('../assets/piano/gb7.mp3'),
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
