import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  role:null,
  token:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
      console.log("+.+.+.+.+.",state.signupData);
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setRole(state,value){
      state.role = value.payload;
      console.log("role is : ",state.role)
    
    },
    setToken(state, value) {
      state.token = value.payload;
      console.log("Token:", state.token)
    },
  },
});

export const { setSignupData, setLoading,setRole, setToken } = authSlice.actions;

export default authSlice.reducer;