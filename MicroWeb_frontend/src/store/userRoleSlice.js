import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userCurrentRole: "buyer",
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState,
  reducers: {
    toggleUserRole: (state) => {
      state.userCurrentRole =
        state.userCurrentRole === "buyer" ? "seller" : "buyer";
    },
  },
});

export const { toggleUserRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
