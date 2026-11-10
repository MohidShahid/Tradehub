import { createSlice } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/toast";

const initialState = {
  Items: [],
};

const getItemId = (item) => {
  if (!item) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(item._id || item.id || "");
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemsCart: (state, action) => {
      const payloadId = getItemId(action.payload);
      const index = state.Items.findIndex(
        (item) => getItemId(item) === payloadId
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
      const payloadId = getItemId(action.payload);
      const index = state.Items.findIndex(
        (item) => getItemId(item) === payloadId
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
      const payloadId = getItemId(action.payload);
      state.Items = state.Items.filter(
        (item) => getItemId(item) !== payloadId
      );
      toast.add({
        type: "success",
        description: "Removed from Cart Successfully",
      });
    },
  },
});

export const { addItemsCart, removeItemsCart, deleteItemCart } =
  cartSlice.actions;

export default cartSlice.reducer;
