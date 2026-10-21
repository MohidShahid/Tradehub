import { createSlice } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/toast";
const initialState = {
  wishlist: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addInWhishlist: (state, action) => {
      state.wishlist.push(action.payload);
      toast.add({
        type : "success",
        description : "Added in wishlist successfully"
      })
    },

    removeFromWhishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => {
        item.id !== action.payload;
      });
      toast.add({
        type : "success",
        description : "Removed from wishlist successfully"
      })
    },
  },
});


export const {addInWhishlist, removeFromWhishlist} = wishlistSlice.actions;

export default wishlistSlice.reducer;
