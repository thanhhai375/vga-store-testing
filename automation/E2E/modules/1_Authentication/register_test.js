Feature('Module 7: Quản lý Hồ sơ Người dùng (User Profile) - VGA Store');

const selectors = {
    navbar: {
        // Đồng bộ với nút mở modal Đăng nhập ở module Login của bạn
        btnDangNhapHeader: 'button[title="Đăng nhập"]'
    },
    sidebar: {
        hoSoCaNhan: 'text="Hồ sơ cá nhân"',
        soDiaChi: 'text="Sổ địa chỉ"',
        doiMatKhau: 'text="Đổi mật khẩu"',
        donHangCuaToi: 'text="Đơn hàng của tôi"',
        dangXuat: 'text="Đăng xuất"'
    },
    profile: {
        inputHoVaTen: 'input[placeholder="tuminhvon"]', // Placeholder thực tế từ ảnh hồ sơ của bạn
        inputSoDienThoai: 'input[placeholder="Nhập số điện thoại..."]',
        inputNgaySinh: 'input[type="date"]',
        radioNam: 'input[value="Nam"]',
        btnLuuThayDoi: 'button:has-text("LƯU THAY ĐỔI")'
    },
    address: {
        btnThemDiaChi: 'button:has-text("+ Thêm địa chỉ")',
        btnHuyThemMoi: 'button:has-text("Hủy thêm mới")',
        inputNguoiNhan: 'input[placeholder="Nhập họ và tên người nhận..."]',
        inputSdtNhan: 'input[placeholder="Nhập số điện thoại nhận hàng..."]',
        textareaDiaChi: 'textarea[placeholder="Nhập địa chỉ chi tiết..."]',
        checkboxMacDinh: 'input[type="checkbox"]',
        btnLuuDiaChi: 'button:has-text("LƯU ĐỊA CHỈ")'
    },
    password: {
        inputMatKhauCu: 'input[placeholder="Nhập mật khẩu cũ..."]',
        inputMatKhauMoi: 'input[placeholder="Nhập mật khẩu mới..."]',
        inputXacNhanMatKhau: 'input[placeholder="Xác nhận mật khẩu mới..."]',
        btnXacNhanDoi: 'button:has-text("XÁC NHẬN ĐỔI")'
    }
};

// TỰ ĐỘNG ĐĂNG NHẬP TRƯỚC MỖI TEST CASE QUA MODAL POPUP
Before(({ I }) => {
<<<<<<< HEAD
  I.amOnPage('http://localhost:5173/');
  // Xóa session cũ để đảm bảo luôn ở trạng thái Guest
  I.executeScript(() => localStorage.clear());
  I.clearCookie();
  I.refreshPage();

  // Mở modal Đăng nhập/Đăng ký từ Header
  I.waitForElement('button[title="Đăng nhập"]', 10); 
  I.forceClick('button[title="Đăng nhập"]');
  
  // Chuyển sang Tab ĐĂNG KÝ trong Modal
  I.waitForVisible('.auth-modal', 5);
  I.forceClick('//button[contains(@class, "auth-tab") and text()="ĐĂNG KÝ"]');
  I.waitForVisible('.auth-submit-btn', 5);
  // Xóa HTML5 required để test validation Backend
  I.executeScript(() => {
    document.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
  });
  I.wait(1); // Đợi 1 giây để hiệu ứng chuyển tab hoàn thành hoàn toàn
=======
    I.amOnPage('/');
    I.waitForElement(selectors.navbar.btnDangNhapHeader, 10);
    I.forceClick(selectors.navbar.btnDangNhapHeader);
    I.waitForVisible('.auth-submit-btn', 5); // Đợi form đăng nhập hiển thị

    // Sử dụng đúng tài khoản/mật khẩu hợp lệ và selector giống module Login của bạn
    I.fillField('input[placeholder="Nhập tài khoản hoặc email"]', 'hai123');
    I.fillField('input[placeholder="Nhập mật khẩu"]', 'hai123');
    I.forceClick('.auth-submit-btn');

    // Chờ hệ thống xác thực và tự động điều hướng sang trang profile cá nhân
    I.waitInUrl('/profile', 5);
    I.wait(2); // Chờ API tải thông tin user và render sidebar ổn định
    I.waitForElement(selectors.sidebar.hoSoCaNhan, 10);
>>>>>>> origin/KCPM-116
});

// ==========================================
// TAB 1: HỒ SƠ CÁ NHÂN
// ==========================================
Scenario('TC01: Cập nhật thông tin hồ sơ cá nhân thành công (Happy Case)', ({ I }) => {
    I.click(selectors.sidebar.hoSoCaNhan);
    I.see('Hồ sơ cá nhân');

    I.fillField(selectors.profile.inputHoVaTen, 'tuminhvon updated'); 
    I.click(selectors.profile.radioNam); 
    I.fillField(selectors.profile.inputNgaySinh, '2005-06-18'); 
    I.fillField(selectors.profile.inputSoDienThoai, '0912345678'); 

<<<<<<< HEAD
// Test Cases: Khoảng trắng và Ký tự đặc biệt
registerData.add(['R-013', '   ', 'r013_space@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']); // Chỉ chứa khoảng trắng
registerData.add(['R-014', 'user name', 'r014_space@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']); // Chứa khoảng trắng ở giữa
registerData.add(['R-015', 'user!@#$', 'r015_special@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']); // Chứa ký tự đặc biệt
registerData.add(['R-016', 'validuser', 'r016_special@gmail.com', 'pass 123', 'User Name', 'Mật khẩu ít nhất 6 ký tự']); // Mật khẩu chứa khoảng trắng (tùy vào rule của backend)
registerData.add(['R-017', '<script>alert(1)</script>', 'r017_xss@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']); // Thẻ HTML/XSS

Data(registerData).Scenario('Kiểm thử Đăng ký các trường hợp lỗi', ({ I, current }) => {
  // Điền form dựa trên placeholder đã update chuẩn UI
  I.fillField('input[placeholder="Nhập tên đăng nhập"]', current.username);
  I.fillField('input[placeholder="Nhập email của bạn"]', current.email);
  I.fillField('input[placeholder="Nhập mật khẩu"]', current.password);
  I.fillField('input[placeholder="Nhập họ và tên của bạn"]', current.fullName);
  
  I.forceClick('.auth-submit-btn'); // Cần đổi selector nếu nút Đăng ký class khác
  I.waitForText(current.expectedMessage, 5); // Đợi tối đa 5s để Toast hoặc Error hiển thị
});

// Test case đăng ký thành công
Scenario('R-001: Đăng ký thành công', ({ I }) => {
  const uniqueUsername = 'user_' + Date.now(); // Tạo user động để không bị trùng sau nhiều lần chạy
  const uniqueEmail = 'email_' + Date.now() + '@gmail.com';

  I.fillField('input[placeholder="Nhập tên đăng nhập"]', uniqueUsername);
  I.fillField('input[placeholder="Nhập email của bạn"]', uniqueEmail);
  I.fillField('input[placeholder="Nhập mật khẩu"]', 'pass123456');
  I.fillField('input[placeholder="Nhập họ và tên của bạn"]', 'Test User');
  
  I.forceClick('.auth-submit-btn');
  I.waitForText('Đăng ký thành công', 5);
  I.dontSeeElement('.auth-modal');
=======
    I.click(selectors.profile.btnLuuThayDoi);
    I.wait(2);
});

Scenario('TC02: Kiểm tra trường Email liên kết bị vô hiệu hóa chỉnh sửa', ({ I }) => {
    I.click(selectors.sidebar.hoSoCaNhan);
    I.see('Đã xác minh');
    // Kiểm tra email không thể chỉnh sửa, hiển thị đúng giá trị tĩnh
    I.seeElement('input[value="vontm0715@ut.edu.vn"]');
>>>>>>> origin/KCPM-116
});

// ==========================================
// TAB 2: SỔ ĐỊA CHỈ
// ==========================================
Scenario('TC03: Kiểm tra giao diện Sổ địa chỉ trống và hủy thao tác thêm mới', ({ I }) => {
    I.click(selectors.sidebar.soDiaChi);
    I.see('Bạn chưa lưu địa chỉ nào.');
    
    I.click(selectors.address.btnThemDiaChi);
    I.see('Họ và Tên người nhận');
    
    I.click(selectors.address.btnHuyThemMoi);
    I.dontSee('Họ và Tên người nhận'); 
});

Scenario('TC04: Thêm địa chỉ nhận hàng mới và thiết lập mặc định thành công', ({ I }) => {
    I.click(selectors.sidebar.soDiaChi);
    I.click(selectors.address.btnThemDiaChi);
    
    I.fillField(selectors.address.inputNguoiNhan, 'Nguyễn Văn A'); 
    I.fillField(selectors.address.inputSdtNhan, '0987654321');   
    I.fillField(selectors.address.textareaDiaChi, '123 Đường ABC, Phường Thạnh Xuân, Quận 12, TP. Hồ Chí Minh'); 
    
    I.click(selectors.address.checkboxMacDinh);
    I.click(selectors.address.btnLuuDiaChi);
    I.wait(2);
});

// ==========================================
// TAB 3: ĐỔI MẬT KHẨU
// ==========================================
Scenario('TC05: Đổi mật khẩu thất bại do xác nhận mật khẩu mới không khớp (Negative Case)', ({ I }) => {
    I.click(selectors.sidebar.doiMatKhau);
    I.see('Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác');
    
    I.fillField(selectors.password.inputMatKhauCu, 'hai123');       
    I.fillField(selectors.password.inputMatKhauMoi, 'NewPass123!');     
    I.fillField(selectors.password.inputXacNhanMatKhau, 'WrongPass123!');   
    
    I.click(selectors.password.btnXacNhanDoi);
    I.wait(2);
});

Scenario('TC06: Đổi mật khẩu thành công (Happy Case)', ({ I }) => {
    I.click(selectors.sidebar.doiMatKhau);
    
    I.fillField(selectors.password.inputMatKhauCu, 'hai123');       
    I.fillField(selectors.password.inputMatKhauMoi, 'NewPass123!');     
    I.fillField(selectors.password.inputXacNhanMatKhau, 'NewPass123!');     
    
    I.click(selectors.password.btnXacNhanDoi);
    I.wait(2);
});

// ==========================================
// TAB 4: ĐĂNG XUẤT TÀI KHOẢN
// ==========================================
Scenario('TC07: Đăng xuất tài khoản khỏi hệ thống thành công', ({ I }) => {
    I.click(selectors.sidebar.dangXuat);
    I.wait(2);
    I.dontSee(selectors.sidebar.hoSoCaNhan);
});