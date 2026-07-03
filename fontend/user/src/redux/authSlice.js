import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')) || null;
const token = localStorage.getItem('token') || sessionStorage.getItem('token') || null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
  isAuthModalOpen: false, // Login
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      const storage = action.payload.rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(action.payload.user));
      storage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(state.user));
      } else if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const {
  loginStart, loginSuccess, loginFailure,
  logout, updateUser,
  registerStart, registerSuccess, registerFailure,
  openAuthModal, closeAuthModal
} = authSlice.actions;

export default authSlice.reducer;
