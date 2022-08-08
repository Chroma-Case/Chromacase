import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
	token: undefined as string | undefined
  },
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    unsetUserToken: (state) => {
      state.token = undefined;
    },
  },
});
export const { setUserToken, unsetUserToken } = userSlice.actions;
export default userSlice.reducer;