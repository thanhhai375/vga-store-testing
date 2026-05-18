import axiosClient from '../api/axiosClient';

const settingService = {
  getSettings: () => axiosClient.get('/admin/settings'),
  updateSettings: (data) => axiosClient.put('/admin/settings', data),
};

export default settingService;
