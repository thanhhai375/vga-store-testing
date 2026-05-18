import axiosClient from '../api/axiosClient';

const orderService = {
  getAll: (params) => axiosClient.get('/admin/orders', { params }),
  getPendingCount: () => axiosClient.get('/admin/orders', { params: { status: 'PENDING', size: 1 } }),
  getById: (id) => axiosClient.get(`/admin/orders/${id}`),
  updateStatus: (id, status) => axiosClient.put(`/admin/orders/${id}/status`, { status }),
  delete: (id) => axiosClient.delete(`/admin/orders/${id}`),
};

export default orderService;
