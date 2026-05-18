import axiosClient from '../api/axiosClient';

export const userService = {
  getProfile: async () => {
    const res = await axiosClient.get('/users/profile');
    return res;
  },

  updateProfile: async (data) => {
    const res = await axiosClient.put('/users/profile', data);
    return res;
  },

  changePassword: async (data) => {
    const res = await axiosClient.put('/users/change-password', data);
    return res;
  },

  addAddress: async (data) => {
    const res = await axiosClient.post('/users/addresses', data);
    return res;
  },

  deleteAddress: async (id) => {
    const res = await axiosClient.delete(`/users/addresses/${id}`);
    return res;
  }
};
