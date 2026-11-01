import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice"
import cartReducer from "../features/cartSlice"
import wishlistReducer from "../features/wishlistSlice"
import shopReducer from "../features/shopSlice"

export const store  = configureStore({
    reducer : {
        user : userReducer,
        cart : cartReducer,
        wishlist : wishlistReducer,
        shop : shopReducer,
    }
});