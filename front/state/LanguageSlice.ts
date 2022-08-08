import { createSlice } from "@reduxjs/toolkit";
import { DefaultLanguage } from "../i18n/i18n";


export const languageSlice = createSlice({
	name: 'language',
	initialState: {
		value: DefaultLanguage
	},
	reducers: {
		useLanguage: (state, action) => {
			state.value = action.payload;
		},
		resetLanguage: (state) => {
			state.value = DefaultLanguage;
		},
	},
});
export const { useLanguage, resetLanguage } = languageSlice.actions;
export default languageSlice.reducer;