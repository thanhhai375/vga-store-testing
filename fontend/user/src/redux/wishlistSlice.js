import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const exists = state.wishlistItems.find(i => i.id === item.id);
      if (exists) {
        state.wishlistItems = state.wishlistItems.filter(i => i.id !== item.id);
      } else {
        state.wishlistItems.push(item);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(i => i.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
