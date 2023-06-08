import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LocalSettings from "../models/LocalSettings";

export const settingsSlice = createSlice({
	name: 'settings',
	initialState: {
		local: <LocalSettings>{
			deviceId: 0,
			micVolume: 0,
			colorScheme: 'system',
			lang: 'en',
			difficulty: 'beg',
			colorBlind: false,
			customAds: true,
			dataCollection: true
		},
	},
	reducers: {
		updateSettings: (state, action: PayloadAction<Partial<LocalSettings>>) => {
			state.local = { ...state.local, ...action.payload }; 
		}
	}
});
export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;