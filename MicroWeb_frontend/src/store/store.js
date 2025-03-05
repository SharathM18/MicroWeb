import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userRoleReducer from "./userRoleSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userRole: userRoleReducer,
    user: userReducer,
  },
});

export default store;
