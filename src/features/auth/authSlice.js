import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { userSub: null, userRoles: null, token: null},
  reducers: {
    setCredentials: (state, action) => {
      const {accessToken, userSub, userRoles} = action.payload;
      state.token = accessToken;
      state.userSub = userSub;
      state.userRoles = userRoles;
    },
    logOut: (state) => {
      state.userSub = null;
      state.userRoles = null;
      state.token = null;
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer;

export const selectCurrentUser = (state) => {
  return state.auth.userSub;
};

export const selectCurrentRoles = (state) => {
  return state.auth.userRoles;
}

export const selectCurrentToken = (state) => state.auth.token;