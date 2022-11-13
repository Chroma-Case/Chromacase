import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessToken } from '../API';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
	  accessToken: undefined as AccessToken | undefined
  },
  reducers: {
    setAccessToken: (state, action: PayloadAction<AccessToken>) => {
      state.accessToken = action.payload;
    },
    unsetAccessToken: (state) => {
      state.accessToken = undefined;
    },
  },
});
export const { setAccessToken, unsetAccessToken } = userSlice.actions;
export default userSlice.reducer;