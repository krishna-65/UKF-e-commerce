import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productData: localStorage.getItem('product') ? JSON.parse(localStorage.getItem("product")) : null
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setProductData(state, value) {
      state.productData = value.payload;
      localStorage.setItem("product", JSON.stringify(state.productData))
    },
  },
});

export const { setProductData } = productSlice.actions;

export default productSlice.reducer;