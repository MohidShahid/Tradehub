import { createSlice } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/toast";
const initialState = {
  Items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemsCart: (state, action) => {
      state.Items.push(action.payload);
      toast.add({
        type : "success",
        description : "Added in Cart Successfully"
      })
    },

    removeItemsCart: (state, action) => {
      state.Items = state.Items.filter((item) => {
        item.id !== action.payload;
      });
      toast.add({
        type : "success",
        description : "Removed from Cart Successfully"
      })
    },
  },
});


export const {addItemsCart, removeItemsCart} = cartSlice.actions;

export default cartSlice.reducer;
