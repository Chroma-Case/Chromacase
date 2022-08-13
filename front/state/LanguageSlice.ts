import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import i18n, { AvailableLanguages, DefaultLanguage } from "../i18n/i18n";


export const languageSlice = createSlice({
	name: 'language',
	initialState: {
		value: DefaultLanguage
	},
	reducers: {
		useLanguage: (state, action: PayloadAction<AvailableLanguages>) => {
			state.value = action.payload;
			i18n.changeLanguage(state.value);
		},
		resetLanguage: (state) => {
			state.value = DefaultLanguage;
			i18n.changeLanguage(DefaultLanguage);
		},
	},
});
export const { useLanguage, resetLanguage } = languageSlice.actions;
export default languageSlice.reducer;