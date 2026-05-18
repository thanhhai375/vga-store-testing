import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  compareItems: [], // Max 3 items
  isCompareModalOpen: false,
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare: (state, action) => {
      const product = action.payload;
      const existsIndex = state.compareItems.findIndex(item => item.id === product.id);
      
      if (existsIndex >= 0) {
        // Remove if already exists
        state.compareItems.splice(existsIndex, 1);
      } else {
        // Add if not exists, max 3
        if (state.compareItems.length < 3) {
          state.compareItems.push(product);
        } else {
          // Optional: replace the first item or alert user (we'll just replace the first item for simplicity)
          state.compareItems.shift();
          state.compareItems.push(product);
        }
      }
    },
    removeFromCompare: (state, action) => {
      state.compareItems = state.compareItems.filter(item => item.id !== action.payload);
    },
    clearCompare: (state) => {
      state.compareItems = [];
    },
    setCompareModalOpen: (state, action) => {
      state.isCompareModalOpen = action.payload;
    }
  },
});

export const { toggleCompare, removeFromCompare, clearCompare, setCompareModalOpen } = compareSlice.actions;
export default compareSlice.reducer;
