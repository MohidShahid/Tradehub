import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user : null,
    isAuthenticated : false,

}
export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
      LoadUserRequest : (state) =>{
        state.loading = true;
      },
      LoadUserSuccess : (state, action)=>{
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      },
      LoadUserFail : (state, action) =>{
        state.isAuthenticated = false;
        state.error = action.payload
        state.loading = false;
      },
      cleanErrors : (state)=>{
        state.error = null;
      }
    }

})

export const {LoadUserRequest, LoadUserSuccess, LoadUserFail} = userSlice.actions;

export default userSlice.reducer;