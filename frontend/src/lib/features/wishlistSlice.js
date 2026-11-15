import { createSlice } from "@reduxjs/toolkit";
import { toast } from "@/components/ui/toast";
import { getProductId } from "@/utils/helpers";

const initialState = {
  wishlist: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addInWhishlist: (state, action) => {
      const payloadId = getProductId(action.payload);
      if (!payloadId) return;

      const exists = state.wishlist.some(
        (item) => getProductId(item) === payloadId
      );
      if (!exists) {
        state.wishlist.push(action.payload);
        toast.add({
          type: "success",
          description: "Added to wishlist successfully",
        });
      }
    },

    removeFromWhishlist: (state, action) => {
      const payloadId = getProductId(action.payload);
      const prevLength = state.wishlist.length;
      state.wishlist = state.wishlist.filter(
        (item) => getProductId(item) !== payloadId
      );
      if (state.wishlist.length < prevLength) {
        toast.add({
          type: "success",
          description: "Removed from wishlist successfully",
        });
      }
    },

    clearWishlist: (state) => {
      if (state.wishlist.length > 0) {
        state.wishlist = [];
        toast.add({
          type: "success",
          description: "Wishlist cleared successfully",
        });
      }
    },
  },
});

export const { addInWhishlist, removeFromWhishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
