# 📚 Kế Hoạch & Phân Công Công Việc CodeceptJS

---

## 👨‍💻 Phần 1: Dành cho Trưởng Nhóm (Setup & Cấu hình)

Quy trình này do **Trưởng nhóm** chịu trách nhiệm thực hiện từ đầu.

- [ ] **Khởi tạo & Cài đặt**
  Cài đặt CodeceptJS và Playwright trong thư mục `fontend/e2e`. Đảm bảo các thư viện được lưu trong `package.json`.
- [ ] **Tạo cấu trúc thư mục chuẩn**
  Tạo sẵn các thư mục cần thiết: `pages/user`, `pages/admin`, `tests/user`, `tests/admin`, `output/`, `data/`.
- [ ] **Cấu hình `codecept.conf.js`**
  Thiết lập URL gốc (ví dụ: `http://localhost:3000`), cấu hình Playwright (trình duyệt, chế độ headless/show), và định dạng xuất report HTML.
- [ ] **Chuẩn bị tài liệu & Mẫu Code**
  Thêm file `DETAILED_CODECEPT_TEST_GUIDE.md` vào source code chứa hướng dẫn chuẩn và mẫu code (Page Object, Scenario).
- [ ] **Commit & Push lên Git**
  Commit toàn bộ các file setup, thư mục rỗng, file `package.json`, `codecept.conf.js` và push lên nhánh dùng chung để cả team có thể lấy về.

---

## 👥 Phần 2: Dành cho Thành Viên (Lấy code & Thực thi)

Các bước này dành cho **Thành viên trong team** sau khi Trưởng nhóm thông báo đã setup xong.

- [ ] **Pull Code & Cài đặt thư viện**
  Lấy code mới nhất từ Git về máy. Di chuyển vào thư mục `fontend/e2e` và chạy lệnh `npm ci` (hoặc `npm install`) để tự động tải các module cần thiết dựa trên setup của Trưởng nhóm.
- [ ] **Khởi động ứng dụng Local**
  Đảm bảo ứng dụng React/Frontend và Backend đang được chạy (thường là `http://localhost:3000`) trước khi bắt đầu viết test.
- [ ] **Tạo Page Object (PO) theo Task**
  Dựa trên task được giao (Admin hoặc User), tạo file `<TênPage>Page.js` trong thư mục `pages/` tương ứng. (Lưu ý: Nếu cần khai báo vào `codecept.conf.js` phần `include`, hãy trao đổi để Trưởng nhóm duyệt hoặc tự thêm vào).
- [ ] **Viết Test Scenario**
  Tạo file test `<tênFeature>_test.js` trong thư mục `tests/`. Kế thừa các phương thức từ PO, tránh việc hardcode URL, sử dụng tag (ví dụ: `@smoke`) để quản lý.
- [ ] **Chạy Test Cục Bộ**
  Thực thi lệnh `npx codeceptjs run --steps` để kiểm tra test script của mình. Đảm bảo tất cả các step đều pass màu xanh trên máy local.
- [ ] **Tạo Pull Request (PR)**
  Sau khi test chạy ổn định và không có lỗi lint, commit file PO và file Test vừa tạo, push lên nhánh cá nhân và tạo PR để review.

---

## 📝 Danh sách cần lưu ý chung

- [ ] Không ai được phép sửa đổi file `codecept.conf.js` ngoại trừ Trưởng nhóm (hoặc cần phải thông qua Trưởng nhóm).
- [ ] Các ảnh chụp màn hình khi lỗi trong thư mục `output/` không nên được commit lên Git (đã có trong `.gitignore`).
- [ ] Mọi URL cứng (hardcode `http://...`) trong file test sẽ bị từ chối khi review PR.
