import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../services/cartService';
import { toastError } from '../utils/alertUtils';

// Cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
  const state = getState();
  if (!state.auth?.isAuthenticated) return null;
  const res = await cartService.getCart();
  return res?.items || res?.data?.items || [];
});


export const addToCartDb = createAsyncThunk('cart/addToCartDb', async ({ product, quantity }, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    try {
      await cartService.addItem(product.id, quantity || 1);
      dispatch(fetchCart());
    } catch (e) {
      console.error('Lỗi khi addToCartDb:', e);
      return rejectWithValue(e.response?.data?.message || 'Lỗi liên kết máy chủ - Vui lòng đăng nhập lại!');
    }
  } else {
    dispatch(addToCart(product));
  }
  return { product, quantity };
});

// Update existing
export const updateCartItemDb = createAsyncThunk('cart/updateCartItemDb', async ({ item, quantity }, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    if (item.cartItemId) await cartService.updateItem(item.cartItemId, quantity);
    dispatch(fetchCart());
  } else {
    // Update existing
    // Process

  }
  return { item, quantity };
});

export const removeCartItemDbAction = createAsyncThunk('cart/removeCartItemDbAction', async (item, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    if (item.cartItemId) await cartService.removeItem(item.cartItemId);
    dispatch(fetchCart());
  } else {
    dispatch(removeFromCart(item));
  }
  return item;
});

// Delete
export const clearCartDb = createAsyncThunk('cart/clearCartDb', async (_, { dispatch, getState }) => {
  const state = getState();
  if (state.auth?.isAuthenticated) {
    await cartService.clearCart();
    dispatch(fetchCart());
  } else {
    dispatch(clearCart());
  }
});

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  loading: false,
};

const mapDbItemToLocal = (dbItem) => ({
  cartItemId: dbItem.id,
  id: dbItem.productId,
  name: dbItem.productName,
  price: dbItem.price,
  cartQuantity: dbItem.quantity,
  imgUrl: dbItem.productImage,
  subtotal: dbItem.subtotal
});

const calculateTotals = (state) => {
  state.cartTotalQuantity = state.cartItems.reduce((acc, item) => acc + (item.cartQuantity || 0), 0);
  state.cartTotalAmount = state.cartItems.reduce((acc, item) => acc + (item.cartQuantity * item.price), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Login
    addToCart(state, action) {
      const product = action.payload;
      const index = state.cartItems.findIndex(i => i.id === product.id);
      if (index >= 0) {
        state.cartItems[index].cartQuantity += 1;
      } else {
        state.cartItems.push({ ...product, cartQuantity: 1 });
      }
      calculateTotals(state);
    },
    decreaseCart(state, action) {
      const index = state.cartItems.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        if (state.cartItems[index].cartQuantity > 1) {
          state.cartItems[index].cartQuantity -= 1;
        } else {
          state.cartItems.splice(index, 1);
        }
      }
      calculateTotals(state);
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload.id);
      calculateTotals(state);
    },
    clearCart(state) {
      state.cartItems = [];
      calculateTotals(state);
    }
  },
  extraReducers: (builder) => {
    // Process
    builder.addCase(fetchCart.pending, (state) => { state.loading = true; });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.cartItems = action.payload.map(mapDbItemToLocal);
        calculateTotals(state);
      }
    });
    builder.addCase(fetchCart.rejected, (state) => { state.loading = false; });

    // Process
    builder.addCase(addToCartDb.rejected, (state, action) => {
      toastError(action.payload || 'Lỗi hệ thống khi thêm sản phẩm vào giỏ!');
    });
  }
});

export const { addToCart, decreaseCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
