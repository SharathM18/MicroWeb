import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  address: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setUser, setAddress } = userSlice.actions;
export default userSlice.reducer;
