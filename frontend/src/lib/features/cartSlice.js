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
      const found = state.Items.some((item)=> item.id == action.payload.id);
      if(found){
         const index = state.Items.findIndex((item)=> item.id = action.payload.id);
         state.Items[index].quantity +=1
      }else{
          state.Items.push({...action.payload, quantity : 1});
      }

      toast.add({
        type : "success",
        description : "Added in Cart Successfully"
      })
    },

    removeItemsCart: (state, action) => {
            const found = state.Items.some((item)=> item.id == action.payload.id);
            const index = state.Items.findIndex((item)=> item.id = action.payload.id);
      if(found && state.Items[index].quantity > 1){
         
         state.Items[index].quantity -=1
      }else{
      state.Items = state.Items.filter((item) => {
        item.id !== action.payload;
      });
    }
      toast.add({
        type : "success",
        description : "Removed from Cart Successfully"
      })
    },
  },
});


export const {addItemsCart, removeItemsCart} = cartSlice.actions;

export default cartSlice.reducer;
