import axiosClient from '../api/axiosClient.js';

export const productService = {
  getAll: async (params = {}) => {
    try {
      const apiResponse = await axiosClient.get('/products', { params });
      const pageData = apiResponse?.data;
      if (pageData && Array.isArray(pageData.content)) return pageData.content;
      if (Array.isArray(pageData)) return pageData;
      return [];
    } catch (error) {
      console.error('Lỗi gọi API sản phẩm:', error.message);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const apiResponse = await axiosClient.get(`/products/${id}`);
      const product = apiResponse?.data;
      if (product && product.id) return product;
      return null;
    } catch (error) {
      console.error('Lỗi lấy chi tiết sản phẩm:', error.message);
      return null;
    }
  },
};