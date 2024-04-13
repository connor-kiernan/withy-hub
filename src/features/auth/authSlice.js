import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { userSub: null, token: null},
  reducers: {
    setCredentials: (state, action) => {
      const {accessToken, userSub} = action.payload;
      state.token = accessToken;
      state.userSub = userSub;
    },
    logOut: (state) => {
      state.userSub = null;
      state.token = null;
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer;

export const selectCurrentUser = (state) => {
  return state.auth.userSub;
};
export const selectCurrentToken = (state) => state.auth.token;