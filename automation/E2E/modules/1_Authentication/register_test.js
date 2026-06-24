Feature('Register - Authentication');

Before(({ I }) => {
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
});

// Định nghĩa DataTable dựa trên file VGA-Store-Auth-Testcase.csv (Phần REGISTER)
let registerData = new DataTable(['testId', 'username', 'email', 'password', 'fullName', 'expectedMessage']);

// Các Test Case lỗi phổ biến
registerData.add(['R-002', '   ', 'r002_empty_user@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập không được trống']);
registerData.add(['R-003', 'r003_user', '', 'pass123456', 'User Name', 'Email không được trống']);
registerData.add(['R-004', 'r004_user', 'r004_empty_pass@gmail.com', '', 'User Name', 'Mật khẩu không được trống']);
registerData.add(['R-006', 'ab', 'r006_short_user@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']);
registerData.add(['R-010', 'r010_user', 'invalidgmail', 'pass123456', 'User Name', 'Email không hợp lệ']);
registerData.add(['R-012', 'hai123', 'r012_taken@gmail.com', 'pass123456', 'Another User', 'Username is already taken']);

// Test Cases: Khoảng trắng và Ký tự đặc biệt

Data(registerData).Scenario('Kiểm thử Đăng ký các trường hợp lỗi', ({ I, current }) => {
    // Điền form dựa trên placeholder đã update chuẩn UI
    I.fillField('input[placeholder="Nhập tên đăng nhập"]', current.username);
    I.fillField('input[placeholder="Nhập email của bạn"]', current.email);
    I.fillField('input[placeholder="Nhập mật khẩu"]', current.password);
    I.fillField('input[placeholder="Nhập họ và tên của bạn"]', current.fullName);

    if (current.testId === 'R-004') {
        I.executeScript(() => {
            const passwordInput = document.querySelector('input[placeholder="Nhập mật khẩu"]');
            if (passwordInput) passwordInput.setAttribute('required', '');
        });
        I.forceClick('.auth-submit-btn');
        I.waitForFunction(() => {
            const passwordInput = document.querySelector('input[placeholder="Nhập mật khẩu"]');
            return Boolean(passwordInput && !passwordInput.checkValidity());
        }, [], 5);
        return;
    }

    I.executeScript(() => {
        document.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    });
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

    I.executeScript(() => {
        document.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
    });
    I.forceClick('.auth-submit-btn');
    I.waitForText('Đăng ký thành công', 5);
    I.seeElement('input[placeholder="Nhập tài khoản hoặc email"]');
});
