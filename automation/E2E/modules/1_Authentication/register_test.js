Feature('Register - Authentication');

Before(({ I }) => {
  I.amOnPage('/');
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

Data(registerData).Scenario('Kiểm thử Đăng ký các trường hợp lỗi', ({ I, current }) => {
  // Điền form dựa trên placeholder đã update chuẩn UI
  if (current.username) I.fillField('input[placeholder="Nhập tên đăng nhập"]', current.username);
  if (current.email) I.fillField('input[placeholder="Nhập email của bạn"]', current.email);
  if (current.password) I.fillField('input[placeholder="Nhập mật khẩu"]', current.password);
  if (current.fullName) I.fillField('input[placeholder="Nhập họ và tên của bạn"]', current.fullName);
  
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
  // I.see('Đăng ký thành công');
});
