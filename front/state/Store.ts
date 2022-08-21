import userReducer from '../state/UserSlice';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './LanguageSlice';

export default configureStore({
	reducer: {
		user: userReducer,
		language: languageReducer
	},
})