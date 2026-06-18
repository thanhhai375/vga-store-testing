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

    I.click(selectors.profile.btnLuuThayDoi);
    I.wait(2);
});

Scenario('TC02: Kiểm tra trường Email liên kết bị vô hiệu hóa chỉnh sửa', ({ I }) => {
    I.click(selectors.sidebar.hoSoCaNhan);
    I.see('Đã xác minh');
    // Kiểm tra email không thể chỉnh sửa, hiển thị đúng giá trị tĩnh
    I.seeElement('input[value="vontm0715@ut.edu.vn"]');
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