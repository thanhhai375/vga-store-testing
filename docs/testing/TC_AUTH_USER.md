# Test Cases Xác Thực Người Dùng

## 1. Mục đích
Viết kịch bản kiểm thử chức năng Đăng nhập, Đăng ký, Cập nhật Profile, Quên mật khẩu bằng kỹ thuật Phân vùng tương đương và Giá trị biên.

## 2. Ghi chú chung
- Áp dụng phân vùng tương đương cho từng trường đầu vào quan trọng.
- Áp dụng giá trị biên cho độ dài chuỗi và các giá trị giới hạn.
- Mỗi test case nêu rõ:
  - Nhóm dữ liệu
  - Trường hợp kiểm thử
  - Kết quả mong đợi

---

## 3. Kịch bản kiểm thử

### 3.1 Đăng nhập

| ID | Mô tả | Dữ liệu | Kỹ thuật | Kết quả mong đợi |
|---|---|---|---|---|
| LI-01 | Đăng nhập thành công với email và mật khẩu hợp lệ | Email đúng định dạng, mật khẩu đúng đúng tài khoản | EP | Hệ thống cho phép đăng nhập và chuyển tới trang chính |
| LI-02 | Email sai định dạng | `user@domain`, `userdomain.com`, `@domain.com` | EP | Hiển thị lỗi "Email không đúng định dạng" |
| LI-03 | Mật khẩu sai | Email hợp lệ, mật khẩu không đúng | EP | Hiển thị lỗi đăng nhập thất bại |
| LI-04 | Trường email để trống | Email = "" | EP | Hiển thị lỗi trường bắt buộc |
| LI-05 | Trường mật khẩu để trống | Mật khẩu = "" | EP | Hiển thị lỗi trường bắt buộc |
| LI-06 | Độ dài mật khẩu tại biên tối thiểu | Mật khẩu 6 ký tự (nếu yêu cầu tối thiểu 6) | BVA | Quy trình vẫn xử lý hợp lệ hoặc báo lỗi theo quy định |
| LI-07 | Độ dài mật khẩu vượt biên | Mật khẩu 1 ký tự hoặc > 255 ký tự | BVA | Nếu nhỏ hơn yêu cầu, hiển thị lỗi; nếu quá dài, hiển thị lỗi hoặc cắt theo quy định |

### 3.2 Đăng ký

| ID | Mô tả | Dữ liệu | Kỹ thuật | Kết quả mong đợi |
|---|---|---|---|---|
| RG-01 | Đăng ký thành công với dữ liệu hợp lệ | Name, email, password, confirm password hợp lệ | EP | Tạo tài khoản, gửi xác nhận / chuyển sang trang đăng nhập thành công |
| RG-02 | Email sai định dạng | `user@domain`, `userdomain.com`, `@domain.com` | EP | Hiển thị lỗi "Email không đúng định dạng" |
| RG-03 | Email đã tồn tại | Email đã đăng ký | EP | Hiển thị lỗi "Email đã được sử dụng" |
| RG-04 | Mật khẩu quá ngắn | Mật khẩu 1-5 ký tự (nếu yêu cầu tối thiểu 6) | BVA | Hiển thị lỗi yêu cầu mật khẩu tối thiểu |
| RG-05 | Mật khẩu và xác nhận không khớp | Password = `abc123`, Confirm = `abc124` | EP | Hiển thị lỗi "Mật khẩu không khớp" |
| RG-06 | Tên để trống | Name = "" | EP | Hiển thị lỗi trường bắt buộc |
| RG-07 | Email để trống | Email = "" | EP | Hiển thị lỗi trường bắt buộc |
| RG-08 | Xác nhận mật khẩu để trống | Confirm password = "" | EP | Hiển thị lỗi trường bắt buộc |
| RG-09 | Độ dài tên tại biên tối thiểu | Name 1 ký tự | BVA | Nếu hợp lệ, cho phép; nếu không, báo lỗi theo yêu cầu |
| RG-10 | Độ dài tên tại biên tối đa | Name 255 ký tự (hoặc giới hạn hệ thống) | BVA | Hệ thống chấp nhận nếu trong giới hạn hoặc báo lỗi nếu vượt quá |
| RG-11 | Độ dài email tại biên tối đa | Email gần 254 ký tự hợp lệ | BVA | Hệ thống chấp nhận định dạng hợp lệ hoặc báo lỗi nếu vượt giới hạn |

### 3.3 Cập nhật Profile

| ID | Mô tả | Dữ liệu | Kỹ thuật | Kết quả mong đợi |
|---|---|---|---|---|
| UP-01 | Cập nhật thành công tên, số điện thoại, địa chỉ hợp lệ | Tên hợp lệ, số điện thoại 10 số, địa chỉ hợp lệ | EP | Lưu cập nhật và hiển thị thông báo thành công |
| UP-02 | Tên để trống | Name = "" | EP | Hiển thị lỗi trường bắt buộc |
| UP-03 | Số điện thoại sai định dạng | `01234`, `abcdefghij`, `12345678901` | EP | Hiển thị lỗi "Số điện thoại không hợp lệ" |
| UP-04 | Địa chỉ quá dài | Địa chỉ > 200 ký tự (nếu giới hạn 200) | BVA | Hiển thị lỗi giới hạn độ dài |
| UP-05 | Tên tại biên tối thiểu | Name 1 ký tự | BVA | Hệ thống chấp nhận nếu hợp lệ |
| UP-06 | Tên tại biên tối đa | Name 255 ký tự | BVA | Hệ thống chấp nhận nếu trong giới hạn hoặc báo lỗi nếu vượt quá |
| UP-07 | Số điện thoại tại biên | Số điện thoại đúng 10 hoặc 11 chữ số (theo quy định) | BVA | Chấp nhận nếu đúng chiều dài; báo lỗi nếu ngắn hơn hoặc dài hơn |
| UP-08 | Không thay đổi dữ liệu | Không cập nhật bất kỳ trường nào | EP | Hệ thống không báo lỗi, giữ nguyên thông tin hiện tại |

### 3.4 Quên mật khẩu

| ID | Mô tả | Dữ liệu | Kỹ thuật | Kết quả mong đợi |
|---|---|---|---|---|
| FP-01 | Yêu cầu quên mật khẩu với email đã đăng ký | Email hợp lệ đã tồn tại | EP | Gửi yêu cầu thành công, hiển thị thông báo kiểm tra email |
| FP-02 | Email chưa đăng ký | Email hợp lệ nhưng không tồn tại | EP | Hiển thị thông báo email không tìm thấy hoặc hướng dẫn đăng ký |
| FP-03 | Email sai định dạng | `user@domain`, `userdomain.com` | EP | Hiển thị lỗi "Email không đúng định dạng" |
| FP-04 | Email để trống | Email = "" | EP | Hiển thị lỗi trường bắt buộc |
| FP-05 | Email tại biên tối thiểu | Email hợp lệ ngắn nhất (`a@b.co`) | BVA | Hệ thống xử lý nếu đúng định dạng |
| FP-06 | Email tại biên tối đa | Email độ dài 254 ký tự hợp lệ | BVA | Hệ thống xử lý hoặc báo lỗi nếu vượt giới hạn |

---

## 4. Ghi chú thêm
- Nếu hệ thống có giới hạn cụ thể ở frontend/backend (ví dụ password >= 6, email max 254 ký tự), các giá trị biên phải được điều chỉnh theo quy định đó.
- Với các trường hợp `Email đã tồn tại`, nên chuẩn bị dữ liệu test trước bằng cách đăng ký một tài khoản thử nghiệm.
- Nếu chức năng Quên mật khẩu gửi email thực tế, có thể mô phỏng kiểm thử bằng logging hoặc kiểm tra trạng thái thành công của API mà không cần email thật.
