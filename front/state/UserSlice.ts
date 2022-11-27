import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AuthToken from '../models/AuthToken';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
	token: undefined as AuthToken | undefined
  },
  reducers: {
    setUserToken: (state, action: PayloadAction<AuthToken>) => {
      state.token = action.payload;
    },
    unsetUserToken: (state) => {
      state.token = undefined;
    },
  },
});
export const { setUserToken, unsetUserToken } = userSlice.actions;
export default userSlice.reducer;