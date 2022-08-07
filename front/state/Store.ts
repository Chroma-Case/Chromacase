import userReducer from '../state/UserSlice';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
	reducer: {
		user: userReducer,
	},
})