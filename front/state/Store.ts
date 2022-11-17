import userReducer from '../state/UserSlice';
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './LanguageSlice';
import { TypedUseSelectorHook, useDispatch as reduxDispatch, useSelector as reduxSelector } from 'react-redux'
import createSecureStore from "redux-persist-expo-securestore";
import { persistStore, persistCombineReducers } from "redux-persist";

// Secure storage
const storage = createSecureStore();

const persistConfig = {
	key: 'root',
	storage
}

let store = configureStore({
	reducer: persistCombineReducers(persistConfig, {
		user: userReducer,
		language: languageReducer
	}),
})
let persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch: () => AppDispatch = reduxDispatch
export const useSelector: TypedUseSelectorHook<RootState> = reduxSelector

export default store
export { persistor }