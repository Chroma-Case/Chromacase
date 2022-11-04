import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import API from '../API';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
	  apiAccess: undefined as API | undefined
  },
  reducers: {
    setAPIAccess: (state, action: PayloadAction<API>) => {
      state.apiAccess = action.payload;
    },
    unsetAPIAccess: (state) => {
      state.apiAccess = undefined;
    },
  },
});
export const { setAPIAccess, unsetAPIAccess } = userSlice.actions;
export default userSlice.reducer;