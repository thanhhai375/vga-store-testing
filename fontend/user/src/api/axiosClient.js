import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // Đường link gốc của Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động nhét token vào header nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý data trả về cho gọn
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
             // Tuỳ theo API có bọc ApiResponse không
             return (response.data.success !== undefined) ? response.data : response.data;
        }
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Xóa session rớt/hết hạn để tránh bị kẹt 403 vĩnh viễn
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Tải lại trang để xóa sạch state Redux
            if(window.location.pathname !== '/login' && window.location.pathname !== '/') {
                 window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;

