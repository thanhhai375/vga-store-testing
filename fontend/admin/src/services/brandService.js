import axiosClient from '../api/axiosClient';

const brandService = {
  getAll: () => axiosClient.get('/brands'),
  getById: (id) => axiosClient.get(`/brands/${id}`),
  create: (data) => axiosClient.post('/admin/brands', data),
  update: (id, data) => axiosClient.put(`/admin/brands/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/brands/${id}`),
};

export default brandService;
