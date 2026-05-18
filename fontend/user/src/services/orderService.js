import axiosClient from '../api/axiosClient';

export const orderService = {
  /**
   * Tạo đơn hàng mới (Buy Now hoặc từ giỏ hàng).
   * Backend sẽ tự tính giá từ DB — không truyền price từ FE để đảm bảo an toàn.
   */
  createOrder: async (orderData) => {
    const response = await axiosClient.post('/orders', orderData);
    return response?.data || response;
  },

  /**
   * Tạo bản ghi thanh toán và lấy URL redirect (VNPay/MoMo) nếu cần.
   * @param {number} orderId - ID của đơn hàng
   * @param {string} paymentMethod - 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER'
   */
  createPayment: async (orderId, paymentMethod) => {
    const response = await axiosClient.post(`/payments/orders/${orderId}`, {
      paymentMethod
    });
    return response?.data || response;
  },

  /**
   * Lấy danh sách đơn hàng của user hiện tại.
   * Hỗ trợ phân trang qua query params.
   */
  getMyOrders: async (page = 0, size = 10) => {
    try {
      const response = await axiosClient.get('/orders', {
        params: { page, size, sortBy: 'createdAt', direction: 'desc' }
      });
      // Hỗ trợ cả 2 format response: paginated và list thẳng
      if (response?.data?.content) return response.data.content;
      if (response?.data?.data?.content) return response.data.data.content;
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.data)) return response.data;
      return [];
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  /**
   * Lấy đơn hàng của user hiện tại (endpoint /orders/my — trả về list đơn giản).
   */
  getMyOrdersList: async () => {
    try {
      const response = await axiosClient.get('/orders/my');
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn hàng:', error);
      return [];
    }
  },

  /**
   * Lấy chi tiết một đơn hàng theo ID.
   */
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`/orders/${id}`);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy chi tiết đơn hàng ${id}:`, error);
      return null;
    }
  },

  /**
   * User yêu cầu hủy đơn hàng.
   * @param {number} orderId - ID của đơn hàng
   * @param {string} reason - Lý do hủy (tùy chọn)
   */
  cancelOrder: async (orderId, reason = '') => {
    const response = await axiosClient.put(
      `/orders/${orderId}/cancel`,
      null,
      { params: reason ? { reason } : {} }
    );
    return response?.data || response;
  },

  /**
   * Lấy thông tin thanh toán của một đơn hàng.
   */
  getPaymentByOrderId: async (orderId) => {
    try {
      const response = await axiosClient.get(`/payments/orders/${orderId}`);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      console.error(`Lỗi lấy thông tin thanh toán đơn ${orderId}:`, error);
      return null;
    }
  }
};
