import axiosClient from '../api/axiosClient';

const categoryService = {
  getAll: () => axiosClient.get('/categories'),
  getById: (id) => axiosClient.get(`/categories/${id}`),
  create: (data) => axiosClient.post('/admin/categories', data),
  update: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/admin/categories/${id}`),
};

export default categoryService;
