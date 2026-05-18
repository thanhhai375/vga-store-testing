# Kế Hoạch Kiểm Thử (Test Plan) - VGA Store

## 1. Mục tiêu kiểm thử
Mục tiêu của đợt kiểm thử này là đảm bảo chất lượng và độ ổn định của hệ thống thương mại điện tử VGA Store trước khi đưa vào sử dụng thực tế. Đợt kiểm thử tập trung xác minh các luồng nghiệp vụ cốt lõi (Mua hàng, Giỏ hàng, Xác thực người dùng) hoạt động chính xác dựa trên cấu trúc API (Postman Collection) và logic giao diện thực tế. Đồng thời, quá trình kiểm thử sẽ giúp phát hiện sớm các khiếm khuyết (Defects) liên quan đến giao diện hiển thị (UI), logic nghiệp vụ (Functional) và độ chính xác của API Backend.

## 2. Phạm vi kiểm thử (Scope)
### 2.1. In-scope (Các chức năng SẼ kiểm thử)
- Module Xác thực (Đăng nhập, Đăng ký, Cập nhật hồ sơ)
- Module Sản phẩm (Xem danh sách, Tìm kiếm, Lọc, Xem chi tiết)
- Module Giỏ hàng (Thêm, sửa số lượng, xóa sản phẩm)
- Module Thanh toán (Điền thông tin, Đặt hàng)
- Module Admin (Quản lý sản phẩm, đơn hàng)

### 2.2. Out-scope (Các chức năng KHÔNG kiểm thử)
- Quá trình giao dịch tiền thật trên các cổng thanh toán bên thứ 3 (ZaloPay, Momo, VNPay).
- Trạng thái phản hồi thực của các dịch vụ bên ngoài (Ví dụ: Dịch vụ gửi SMS OTP hoặc Email tự động).
- Kiểm thử bảo mật chuyên sâu (Penetration Testing) chống lại các cuộc tấn công mạng, chống DDoS.

## 3. Yêu cầu về môi trường
### 3.1. Môi trường Máy chủ (Server/Backend)
- Hệ điều hành: Windows 10/11 hoặc Ubuntu Linux (thông qua máy ảo/WSL).
- Database: PostgreSQL (triển khai thông qua Docker image).
- Công cụ triển khai: Docker, Docker Compose.

### 3.2. Môi trường Khách (Client/Frontend)
- Trình duyệt (Browser): Google Chrome (phiên bản mới nhất), Microsoft Edge.
- Độ phân giải màn hình: 1920x1080 (PC/Laptop).

---
*(Phần dưới này dành cho Task 2 - KCPM-8)*
## 4. Chiến lược kiểm thử (Test Strategy)
## 5. Tiêu chí kiểm thử (Criteria)
## 6. Đánh giá rủi ro (Risks)
