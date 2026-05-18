import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';
import productReducer from './productSlice';
import compareReducer from './compareSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    product: productReducer,
    compare: compareReducer,
  },
});