import axiosClient from '../api/axiosClient';

const authService = {
  login: async (username, password) => {
    const res = await axiosClient.post('/auth/login', { username, password });
    return res;
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
};

export default authService;
