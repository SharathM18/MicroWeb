import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";
import axiosInstanceProducts from "../utils/axiosInstanceProducts";

const initialState = {
  isAuthenticated: false,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },

    signup: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.token = null;
      localStorage.removeItem("token");
      axiosInstance.defaults.headers.common["x-auth-token"] = null;
      axiosInstanceProducts.defaults.headers.common["x-auth-token"] = null;
    },
  },
});

export const { login, signup, logout } = authSlice.actions;
export default authSlice.reducer;
