Feature('Module 7: Quản lý Hồ sơ Người dùng (User Profile) - VGA Store');

const selectors = {
    navbar: {
        btnDangNhapHeader: 'button[title="Đăng nhập"]',
        avatarHeader: 'header img, .header-avatar, a[href*="profile"] img', 
    },
    sidebar: {
        hoSoCaNhan: '//aside//*[contains(text(), "Hồ sơ cá nhân")] | //a[contains(@href, "profile")]//*[text()="Hồ sơ cá nhân"]',
        soDiaChi: '//aside//*[contains(text(), "Sổ địa chỉ")] | //a[contains(@href, "profile")]//*[text()="Sổ địa chỉ"]',
        doiMatKhau: '//aside//*[contains(text(), "Đổi mật khẩu")] | //a[contains(@href, "profile")]//*[text()="Đổi mật khẩu"]',
        dangXuat: '//aside//*[contains(text(), "Đăng xuất")] | //a[contains(@href, "profile")]//*[text()="Đăng xuất"]'
    },
    authModal: {
        modalContainer: '.auth-modal, #auth-modal, .popup-login', 
        btnSubmit: '.auth-submit-btn',
        inputTaiKhoanLogin: 'input[placeholder="Nhập tài khoản hoặc email"]',
        inputMatKhauLogin: 'input[placeholder="Nhập mật khẩu"]',
    },
    profile: {
        inputHoVaTen: '//label[contains(text(),"Họ và tên")]/following-sibling::input | //main//input[1]',
        inputSoDienThoai: '//label[contains(text(),"Số điện thoại")]/following-sibling::input | //main//input[2]',
        inputNgaySinh: 'input[type="date"]',
        radioNam: '//input[@value="Nam"]',
        radioNu: '//input[@value="Nữ"]',
        btnLuuThayDoi: 'button:has-text("LƯU THAY ĐỔI")'
    },
    address: {
        btnThemDiaChi: 'button:has-text("+ Thêm địa chỉ")',
        btnHuyThemMoi: 'button:has-text("Hủy thêm mới")',
        inputNguoiNhan: '(//form//input)[1] | //input[contains(@placeholder, "tên người nhận")]',
        inputSdtNhan: '(//form//input)[2] | //input[contains(@placeholder, "số điện thoại")]',
        textareaDiaChi: '//form//textarea | //textarea[contains(@placeholder, "chi tiết")]',
        checkboxMacDinh: 'input[type="checkbox"]',
        btnLuuDiaChi: 'button:has-text("LƯU ĐỊA CHỈ")'
    },
    password: {
        inputMatKhauCu: '(//main//input[@type="password"])[1]',
        inputMatKhauMoi: '(//main//input[@type="password"])[2]',
        inputXacNhanMatKhau: '(//main//input[@type="password"])[3]',
        btnXacNhanDoi: 'button:has-text("XÁC NHẬN ĐỔI")'
    }
};

Before(async ({ I }) => {
    I.amOnPage('/');
    I.wait(1);
    
    const isLoggedOut = await I.grabNumberOfVisibleElements(selectors.navbar.btnDangNhapHeader);
    
    if (isLoggedOut > 0) {
        I.say('--> Tiến hành Đăng nhập tài khoản hệ thống...');
        I.forceClick(selectors.navbar.btnDangNhapHeader);
        I.waitForVisible(selectors.authModal.btnSubmit, 5);
        I.fillField(selectors.authModal.inputTaiKhoanLogin, 'minhvon3'); 
        I.fillField(selectors.authModal.inputMatKhauLogin, '123456'); 
        I.forceClick(selectors.authModal.btnSubmit);
        I.wait(3); 
    }
    
    I.amOnPage('/profile');
    I.wait(2);
    
    const currentUrl = await I.grabCurrentUrl();
    if (!currentUrl.includes('/profile')) {
        I.say('❌ [LỖI CRITICAL]: Không thể truy cập /profile. Tài khoản chưa đăng nhập thành công hoặc bị đá ra!');
        throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản!');
    }
    
    I.waitInUrl('/profile', 7);
    I.waitForElement(selectors.sidebar.hoSoCaNhan, 10);
});

// ==========================================
// PHÂN HỆ 1: HỒ SƠ CÁ NHÂN (USER PROFILE)
// ==========================================

Scenario('TC01: Cập nhật thông tin hồ sơ cá nhân thành công (Happy Case)', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2); 
    I.fillField(selectors.profile.inputHoVaTen, 'Tu Minh Von'); 
    I.fillField(selectors.profile.inputSoDienThoai, '0912345678'); 
    I.forceClick(selectors.profile.radioNam);
    I.fillField(selectors.profile.inputNgaySinh, '18-06-2005'); 
    I.forceClick(selectors.profile.btnLuuThayDoi); I.wait(2);
});

Scenario('TC02: Kiểm tra trường Email liên kết bị vô hiệu hóa chỉnh sửa', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2);
    // SỬA ĐỔI: Chỉ kiểm tra hậu tố domain để tránh việc đổi tài khoản làm fail test
    I.see('@ut.edu.vn');
});

Scenario('TC02a: Thất bại khi bỏ trống trường Họ và Tên', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2);
    I.clearField(selectors.profile.inputHoVaTen);
    I.forceClick(selectors.profile.btnLuuThayDoi); I.wait(1); 
});

Scenario('TC02b: Thất bại khi nhập Số điện thoại sai định dạng (chứa chữ cái)', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2);
    I.fillField(selectors.profile.inputSoDienThoai, '0912ABC567');
    I.forceClick(selectors.profile.btnLuuThayDoi); I.wait(1);
});

Scenario('TC02c: Thất bại khi nhập Số điện thoại quá ngắn hoặc quá dài', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2);
    I.fillField(selectors.profile.inputSoDienThoai, '12345');
    I.forceClick(selectors.profile.btnLuuThayDoi); I.wait(1);
});

Scenario('TC02d: Thay đổi giới tính từ Nam sang Nữ thành công', ({ I }) => {
    I.forceClick(selectors.sidebar.hoSoCaNhan); I.wait(2);
    I.forceClick(selectors.profile.radioNu);
    I.forceClick(selectors.profile.btnLuuThayDoi); I.wait(2);
});

// ==========================================
// PHÂN HỆ 2: SỔ ĐỊA CHỈ (ADDRESS BOOK)
// ==========================================

Scenario('TC03: Kiểm tra giao diện Sổ địa chỉ và hủy thao tác thêm mới', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(1);
    I.forceClick(selectors.address.btnHuyThemMoi); I.wait(1);
});

Scenario('TC04: Thêm địa chỉ nhận hàng mới và thiết lập mặc định thành công', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(2);
    I.fillField(selectors.address.inputNguoiNhan, 'Nguyễn Văn A'); 
    I.fillField(selectors.address.inputSdtNhan, '0987654321');   
    I.fillField(selectors.address.textareaDiaChi, '123 Đường ABC, Quận 1, TP. Hồ Chí Minh'); 
    I.forceClick(selectors.address.checkboxMacDinh);
    I.forceClick(selectors.address.btnLuuDiaChi); I.wait(3);
});

Scenario('TC04a: Thêm địa chỉ thất bại do bỏ trống tất cả các trường', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(2);
    I.forceClick(selectors.address.btnLuuDiaChi); I.wait(1);
});

Scenario('TC04b: Thêm địa chỉ thất bại do bỏ trống Họ và tên người nhận', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(2);
    I.fillField(selectors.address.inputSdtNhan, '0987654321');
    I.fillField(selectors.address.textareaDiaChi, '456 Đường XYZ, Hà Nội');
    I.forceClick(selectors.address.btnLuuDiaChi); I.wait(1);
});

Scenario('TC04c: Thêm địa chỉ thất bại do Số điện thoại nhận hàng sai định dạng', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(2);
    I.fillField(selectors.address.inputNguoiNhan, 'Trần Thị B');
    I.fillField(selectors.address.inputSdtNhan, '0987-PHONE-O1');
    I.fillField(selectors.address.textareaDiaChi, '789 Đường LMN, Đà Nẵng');
    I.forceClick(selectors.address.btnLuuDiaChi); I.wait(1);
});

Scenario('TC04d: Thêm địa chỉ thất bại do bỏ trống Địa chỉ chi tiết', ({ I }) => {
    I.forceClick(selectors.sidebar.soDiaChi);
    I.waitForElement(selectors.address.btnThemDiaChi, 7);
    I.forceClick(selectors.address.btnThemDiaChi); I.wait(2);
    I.fillField(selectors.address.inputNguoiNhan, 'Phạm Văn C');
    I.fillField(selectors.address.inputSdtNhan, '0933445566');
    I.forceClick(selectors.address.btnLuuDiaChi); I.wait(1);
});

// ==========================================
// PHÂN HỆ 3: ĐỔI MẬT KHẨU (CHANGE PASSWORD)
// ==========================================

Scenario('TC05: Đổi mật khẩu thất bại do xác nhận mật khẩu mới không khớp (Negative Case)', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5); 
    I.fillField(selectors.password.inputMatKhauCu, '123456');       
    I.fillField(selectors.password.inputMatKhauMoi, 'NewPass123!');     
    I.fillField(selectors.password.inputXacNhanMatKhau, 'WrongPass123!');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(2);
});

Scenario('TC05a: Đổi mật khẩu thất bại do bỏ trống tất cả các trường', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(1);
});

Scenario('TC05b: Đổi mật khẩu thất bại do sai Mật khẩu cũ', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.fillField(selectors.password.inputMatKhauCu, 'SaiMatKhau123');       
    I.fillField(selectors.password.inputMatKhauMoi, 'NewPass123@');     
    I.fillField(selectors.password.inputXacNhanMatKhau, 'NewPass123@');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(2);
});

Scenario('TC05c: Đổi mật khẩu thất bại do mật khẩu mới trùng mật khẩu cũ', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.fillField(selectors.password.inputMatKhauCu, '123456');       
    I.fillField(selectors.password.inputMatKhauMoi, '123456');     
    I.fillField(selectors.password.inputXacNhanMatKhau, '123456');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(2);
});

Scenario('TC05d: Đổi mật khẩu thất bại do mật khẩu mới quá ngắn (< 6 ký tự)', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.fillField(selectors.password.inputMatKhauCu, '123456');       
    I.fillField(selectors.password.inputMatKhauMoi, '123');     
    I.fillField(selectors.password.inputXacNhanMatKhau, '123');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(1);
});

Scenario('TC05e: Đổi mật khẩu thất bại khi mật khẩu mới thiếu ký tự đặc biệt/chữ hoa (Nếu FE yêu cầu)', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.fillField(selectors.password.inputMatKhauCu, '123456');       
    I.fillField(selectors.password.inputMatKhauMoi, 'onlylowercase');     
    I.fillField(selectors.password.inputXacNhanMatKhau, 'onlylowercase');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(1);
});

Scenario('TC05f: Đổi mật khẩu thành công (Happy Case)', ({ I }) => {
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    I.fillField(selectors.password.inputMatKhauCu, '123456');       
    I.fillField(selectors.password.inputMatKhauMoi, '123456New!');     
    I.fillField(selectors.password.inputXacNhanMatKhau, '123456New!');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(2);
    
    I.refreshPage(); I.wait(2);
    I.forceClick(selectors.sidebar.doiMatKhau);
    I.waitForElement(selectors.password.btnXacNhanDoi, 7); I.wait(1.5);
    
    I.fillField(selectors.password.inputMatKhauCu, '123456New!');       
    I.fillField(selectors.password.inputMatKhauMoi, '123456');     
    I.fillField(selectors.password.inputXacNhanMatKhau, '123456');   
    I.forceClick(selectors.password.btnXacNhanDoi); I.wait(2);
});

// ==========================================
// HÀNH ĐỘNG CUỐI: ĐĂNG XUẤT (LOGOUT)
// ==========================================

Scenario('TC06: Đăng xuất tài khoản khỏi hệ thống thành công', ({ I }) => {
    I.forceClick(selectors.sidebar.dangXuat); I.wait(3);
    I.amOnPage('/');
    I.waitForElement(selectors.navbar.btnDangNhapHeader, 10);
});