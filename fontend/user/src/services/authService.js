import axiosClient from '../api/axiosClient';

const authService = {
  login: async (username, password) => {
    const res = await axiosClient.post('/auth/login', { username, password });
    return res;
  },

  register: async (data) => {
    const res = await axiosClient.post('/auth/register', data);
    return res;
  },

  googleLogin: async (userInfo) => {
    const res = await axiosClient.post('/auth/google', userInfo);
    return res;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default authService;
