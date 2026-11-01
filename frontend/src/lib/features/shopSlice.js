import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    shop : null,
}
export const shopSlice = createSlice({
    name : "shop",
    initialState,

    reducers : {
        setShopDetails : (state, action)=>{
            state.shop = action.payload;
        }
    }

})

export const {setShopDetails} = shopSlice.actions;

export default shopSlice.reducer;
