import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productData: null
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setProductData(state, value) {
      state.productData = value.payload;
    },
  },
});

export const { setProductData } = productSlice.actions;

export default productSlice.reducer;