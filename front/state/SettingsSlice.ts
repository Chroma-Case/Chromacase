import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
	enablePushNotifications: boolean,
	enableMailNotifications: boolean,
	enableLessongsReminders: boolean,
	enableReleaseAlerts: boolean,
	preferedLevel: number,
	colorBlind: boolean,
	micLevel: number,
	preferedInputName?: string
}

export const settingsSlice = createSlice({
	name: 'settings',
	initialState: <SettingsState>{
		enablePushNotifications: true,
		enableMailNotifications: true,
		enableLessongsReminders: true,
		enableReleaseAlerts: true,
		preferedLevel: 1,
		colorBlind: false,
		micLevel: 1
	},
	reducers: {
		udpateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
			state = { ...state, ...action }; 
		}
	}
});
export const { udpateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;