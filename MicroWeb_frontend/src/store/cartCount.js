import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
};

const cartCountSlice = createSlice({
  name: "cartCount",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const { setCartCount, se } = cartCountSlice.actions;
export default cartCountSlice.reducer;
