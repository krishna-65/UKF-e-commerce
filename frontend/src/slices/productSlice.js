import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productData: localStorage.getItem('product') ? JSON.parse(localStorage.getItem("product")) : null,
  productWithoutLogin: null,
  isOpen : false,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setProductData(state, value) {
      state.productData = value.payload;
      localStorage.setItem("product", JSON.stringify(state.productData))
    },
    setProductWithoutLogin(state,value){
      state.productWithoutLogin = value.payload;
    },
    setIsOpen(state){
      state.isOpen = !state.isOpen;
    }
  },
});

export const { setProductData, setIsOpen, setProductWithoutLogin } = productSlice.actions;

export default productSlice.reducer;