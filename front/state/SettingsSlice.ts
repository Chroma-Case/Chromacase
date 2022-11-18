import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingsState = {
	colorScheme: "dark" | "light" | "system",
	enablePushNotifications: boolean,
	enableMailNotifications: boolean,
	enableLessongsReminders: boolean,
	enableReleaseAlerts: boolean,
	preferedLevel: 'easy' | 'medium' | 'hard',
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
		preferedLevel: 'easy',
		colorBlind: false,
		micLevel: 50,
		colorScheme: "system"
	},
	reducers: {
		updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
			state = { ...state, ...action }; 
		}
	}
});
export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;