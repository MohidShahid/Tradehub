import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"
import cartReducer from "../features/cartSlice"
import wishlistReducer from "../features/wishlistSlice"

export const store  = configureStore({
    reducer : {
        user : userReducer,
        cart : cartReducer,
        wishlist : wishlistReducer,
    }
});