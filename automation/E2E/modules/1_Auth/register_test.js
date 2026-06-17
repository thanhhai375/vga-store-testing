Feature('Register - Authentication');

Before(({ I }) => {
  I.amOnPage('/');
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
registerData.add(['R-002', '', 'r002_empty_user@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']);
registerData.add(['R-003', 'r003_user', '', 'pass123456', 'User Name', 'Email không được trống']);
registerData.add(['R-004', 'r004_user', 'r004_empty_pass@gmail.com', '', 'User Name', 'Mật khẩu ít nhất 6 ký tự']);
registerData.add(['R-006', 'ab', 'r006_short_user@gmail.com', 'pass123456', 'User Name', 'Tên đăng nhập từ 3-50 ký tự']);
registerData.add(['R-010', 'r010_user', 'invalidgmail', 'pass123456', 'User Name', 'Email không hợp lệ']);
registerData.add(['R-012', 'hai123', 'r012_taken@gmail.com', 'pass123456', 'Another User', 'Username is already taken']);

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
});
