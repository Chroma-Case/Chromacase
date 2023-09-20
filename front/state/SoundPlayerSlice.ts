import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SplendidGrandPiano } from 'smplr';

export const soundPlayerSlice = createSlice({
	name: 'soundPlayer',
	initialState: {
		soundPlayer: undefined as SplendidGrandPiano | undefined,
	},
	reducers: {
		setSoundPlayer: (state, action: PayloadAction<SplendidGrandPiano>) => {
			state.soundPlayer = action.payload;
		},
		unsetSoundPlayer: (state) => {
			state.soundPlayer = undefined;
		},
	},
});
export const { setSoundPlayer, unsetSoundPlayer } = soundPlayerSlice.actions;
export default soundPlayerSlice.reducer;
