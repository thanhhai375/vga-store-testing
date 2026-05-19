# Kế Hoạch Kiểm Thử (Test Plan) - VGA Store
> Tài liệu định nghĩa phạm vi, cấu hình và chiến lược kiểm thử.

## 1. Mục tiêu kiểm thử
Mục tiêu của đợt kiểm thử này là đảm bảo chất lượng và độ ổn định của hệ thống thương mại điện tử VGA Store trước khi đưa vào sử dụng thực tế. Đợt kiểm thử tập trung xác minh các luồng nghiệp vụ cốt lõi (Mua hàng, Giỏ hàng, Xác thực người dùng) hoạt động chính xác theo tài liệu đặc tả hệ thống. Đồng thời, quá trình kiểm thử sẽ giúp phát hiện sớm các khiếm khuyết (Defects) liên quan đến giao diện hiển thị (UI), logic nghiệp vụ (Functional) và độ chính xác của API Backend.

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

## 4. Chiến lược kiểm thử (Test Strategy)

### 4.1. Mục đích chiến lược kiểm thử
Chiến lược kiểm thử được xây dựng nhằm xác định phương pháp kiểm thử, loại kiểm thử và công cụ sử dụng trong quá trình đánh giá chất lượng hệ thống VGA Store. Việc áp dụng chiến lược kiểm thử phù hợp giúp phát hiện sớm lỗi hệ thống, đảm bảo các chức năng hoạt động ổn định và giảm thiểu rủi ro trước khi triển khai thực tế.

Quá trình kiểm thử sẽ được thực hiện theo hướng kiểm thử chức năng kết hợp kiểm thử giao diện và kiểm thử API nhằm đảm bảo tính đồng bộ giữa Frontend, Backend và Database.

### 4.2. Các loại kiểm thử áp dụng

#### 4.2.1. Functional Testing
Kiểm thử chức năng được sử dụng để xác minh các chức năng của hệ thống hoạt động đúng theo yêu cầu đặc tả. Các luồng nghiệp vụ chính cần kiểm thử bao gồm:

- Đăng ký tài khoản người dùng
- Đăng nhập và đăng xuất
- Tìm kiếm sản phẩm
- Xem chi tiết sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Cập nhật số lượng sản phẩm trong giỏ hàng
- Xóa sản phẩm khỏi giỏ hàng
- Đặt hàng và thanh toán
- Quản lý sản phẩm và đơn hàng trong trang Admin

Kiểm thử chức năng sẽ tập trung kiểm tra:
- Dữ liệu nhập hợp lệ và không hợp lệ
- Thông báo lỗi hiển thị
- Điều hướng giữa các trang
- Logic xử lý nghiệp vụ của hệ thống

#### 4.2.2. UI Testing
Kiểm thử giao diện nhằm đảm bảo giao diện người dùng hiển thị chính xác và thân thiện trên các trình duyệt được hỗ trợ.

Các nội dung kiểm thử giao diện bao gồm:
- Kiểm tra bố cục trang web
- Kiểm tra màu sắc, font chữ và hình ảnh
- Kiểm tra responsive trên nhiều kích thước màn hình
- Kiểm tra hoạt động của button, form và menu điều hướng
- Kiểm tra thông báo lỗi và thông báo thành công hiển thị đúng

#### 4.2.3. API Testing
Kiểm thử API được thực hiện để đảm bảo Backend xử lý request chính xác và trả về dữ liệu đúng định dạng.

Các nội dung kiểm thử API gồm:
- Kiểm tra HTTP status code
- Kiểm tra dữ liệu response
- Kiểm tra xác thực người dùng bằng token
- Kiểm tra xử lý dữ liệu đầu vào không hợp lệ
- Kiểm tra khả năng kết nối với Database

#### 4.2.4. Integration Testing
Kiểm thử tích hợp được sử dụng để đánh giá khả năng phối hợp giữa các thành phần của hệ thống.

Các thành phần cần kiểm thử tích hợp:
- Frontend và Backend
- Backend và Database PostgreSQL
- Chức năng xác thực người dùng
- Luồng đặt hàng và cập nhật dữ liệu đơn hàng

Mục tiêu của kiểm thử tích hợp là đảm bảo dữ liệu được truyền chính xác giữa các module và không phát sinh lỗi trong quá trình giao tiếp.

#### 4.2.5. Regression Testing
Sau khi sửa lỗi hoặc cập nhật chức năng mới, nhóm sẽ thực hiện kiểm thử hồi quy để đảm bảo các chức năng cũ vẫn hoạt động ổn định và không bị ảnh hưởng bởi các thay đổi mới trong source code.

### 4.3. Công cụ kiểm thử sử dụng

| Công cụ | Mục đích sử dụng |
|---|---|
| Postman | Kiểm thử API Backend |
| Docker | Khởi tạo môi trường kiểm thử |
| Docker Compose | Quản lý và chạy nhiều service |
| GitHub | Quản lý source code và theo dõi thay đổi |
| Google Chrome DevTools | Kiểm tra giao diện và debug frontend |
| Jest/Vitest | Kiểm thử Unit Test cho hàm xử lý |
| React Testing Library | Kiểm thử component frontend |

---

## 5. Tiêu chí Bắt đầu/Kết thúc kiểm thử

### 5.1. Entry Criteria (Tiêu chí bắt đầu kiểm thử)

Quá trình kiểm thử chỉ được bắt đầu khi đáp ứng đầy đủ các điều kiện sau:

- Source code mới nhất đã được cập nhật đầy đủ trên GitHub repository.
- Các thành viên hoàn thành chức năng được phân công.
- Hệ thống Backend, Frontend và Database có thể khởi động thành công bằng Docker Compose.
- Database PostgreSQL hoạt động ổn định và có dữ liệu mẫu phục vụ kiểm thử.
- Tài liệu yêu cầu hệ thống và tài liệu thiết kế cơ bản đã được hoàn thiện.
- Môi trường kiểm thử đã được cấu hình đầy đủ.
- Các API chính đã có thể truy cập và phản hồi dữ liệu.

Nếu một trong các điều kiện trên chưa được đáp ứng thì quá trình kiểm thử có thể bị trì hoãn hoặc kết quả kiểm thử không đảm bảo độ chính xác.

### 5.2. Exit Criteria (Tiêu chí kết thúc kiểm thử)

Quá trình kiểm thử được xem là hoàn thành khi đạt được các điều kiện sau:

- Tất cả các test case quan trọng đã được thực thi.
- Các chức năng chính hoạt động đúng theo yêu cầu hệ thống.
- Không còn lỗi nghiêm trọng mức Critical hoặc High.
- Các lỗi mức Medium và Low đã được ghi nhận đầy đủ.
- Các lỗi đã sửa được kiểm thử lại thành công.
- Hệ thống có thể hoạt động ổn định trong môi trường kiểm thử.
- Báo cáo kết quả kiểm thử đã được hoàn thành và lưu trữ.

Trong trường hợp vẫn còn lỗi nghiêm trọng chưa được xử lý, hệ thống sẽ chưa đủ điều kiện để triển khai chính thức.

---

## 6. Rủi ro (Risks)

Trong quá trình kiểm thử hệ thống VGA Store có thể xuất hiện một số rủi ro như sau:

### 6.1. Rủi ro môi trường
- Docker hoặc Docker Compose có thể gặp lỗi cấu hình làm hệ thống không khởi động được.
- Database PostgreSQL có thể xảy ra lỗi kết nối hoặc mất dữ liệu mẫu.
- Sự khác biệt môi trường giữa các thành viên có thể gây lỗi không đồng nhất.

### 6.2. Rủi ro về tiến độ
- Chức năng chưa hoàn thiện đúng thời hạn dẫn đến chậm kiểm thử.
- Việc sửa lỗi liên tục có thể ảnh hưởng đến lịch trình kiểm thử của nhóm.
- Thiếu thời gian kiểm thử hồi quy trước khi bàn giao sản phẩm.

### 6.3. Rủi ro kỹ thuật
- API Backend thay đổi trong quá trình phát triển làm test case không còn phù hợp.
- Lỗi tích hợp giữa Frontend và Backend gây sai lệch dữ liệu.
- Một số lỗi có thể khó tái hiện do phụ thuộc dữ liệu hoặc môi trường.

### 6.4. Rủi ro dữ liệu
- Thiếu dữ liệu kiểm thử thực tế dẫn đến kết quả kiểm thử chưa toàn diện.
- Dữ liệu không hợp lệ có thể gây lỗi hệ thống ngoài dự kiến.

### 6.5. Biện pháp giảm thiểu rủi ro
Để giảm thiểu các rủi ro trên, nhóm sẽ:
- Sử dụng Docker để đồng bộ môi trường phát triển.
- Theo dõi thay đổi source code thông qua GitHub.
- Thực hiện kiểm thử thường xuyên sau mỗi lần cập nhật chức năng.
- Chuẩn bị dữ liệu mẫu phục vụ kiểm thử từ sớm.
- Ghi nhận lỗi đầy đủ để dễ dàng theo dõi và xử lý.





