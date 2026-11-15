import { createSlice } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/toast";
import { getProductId } from "@/utils/helpers";

const initialState = {
  Items: [],
};    

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemsCart: (state, action) => {
      const payloadId = getProductId(action.payload);
      const index = state.Items.findIndex(
        (item) => getProductId(item) === payloadId
      );

      if (index !== -1) {
        state.Items[index].quantity = (state.Items[index].quantity || 1) + 1;
      } else {
        state.Items.push({
          ...action.payload,
          quantity: action.payload?.quantity || 1,
        });
      }

      toast.add({
        type: "success",
        description: "Added to Cart Successfully",
      });
    },

    removeItemsCart: (state, action) => {
      const payloadId = getProductId(action.payload);
      const index = state.Items.findIndex(
        (item) => getProductId(item) === payloadId
      );

      if (index !== -1) {
        if (state.Items[index].quantity > 1) {
          state.Items[index].quantity -= 1;
        } else {
          state.Items.splice(index, 1);
        }

        toast.add({
          type: "success",
          description: "Removed from Cart Successfully",
        });
      }
    },

    deleteItemCart: (state, action) => {
      const payloadId = getProductId(action.payload);
      state.Items = state.Items.filter(
        (item) => getProductId(item) !== payloadId
      );
      toast.add({
        type: "success",
        description: "Removed from Cart Successfully",
      });
    },

    clearCart: (state) => {
      state.Items = [];
    },
  },
});

export const { addItemsCart, removeItemsCart, deleteItemCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
