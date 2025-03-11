import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userRoleReducer from "./userRoleSlice";
import userReducer from "./userSlice";
import cartCountReducer from "./cartCount";

const store = configureStore({
  reducer: {
    auth: authReducer,
    userRole: userRoleReducer,
    user: userReducer,
    cartCount: cartCountReducer,
  },
});

export default store;
