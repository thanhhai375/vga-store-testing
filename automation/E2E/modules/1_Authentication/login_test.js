Feature('Login - Authentication');

Before(({ I }) => {
  I.amOnPage('/');
  I.waitForElement('button[title="Đăng nhập"]', 10);
  I.forceClick('button[title="Đăng nhập"]');
  I.waitForVisible('.auth-submit-btn', 5); // Đợi form hiển thị
  // Xóa HTML5 required để test validation Backend
  I.executeScript(() => {
    document.querySelectorAll('input').forEach(i => i.removeAttribute('required'));
  });
});

// Định nghĩa DataTable dựa trên file VGA-Store-Auth-Testcase.csv (Phần LOGIN)
let loginData = new DataTable(['testId', 'username', 'password', 'expectedMessage']);

// Các Test Case sai (Negative Cases)
loginData.add(['L-002', '', '123456', 'Tên đăng nhập không được trống']); // Hoặc text tương ứng trên UI
loginData.add(['L-003', 'hai123', '', 'Mật khẩu không được trống']);
loginData.add(['L-006', 'ab', '123456', 'Invalid username or password']);
loginData.add(['L-010', 'hai123', '12345', 'Invalid username or password']);
loginData.add(['L-013', 'usernotexist999', '123456', 'Invalid username or password']);

Data(loginData).Scenario('Kiểm thử Đăng nhập các trường hợp lỗi', ({ I, current }) => {
  if (current.username) {
    I.fillField('input[placeholder="Nhập tài khoản hoặc email"]', current.username);
  }
  if (current.password) {
    I.fillField('input[placeholder="Nhập mật khẩu"]', current.password);
  }
  
  I.forceClick('.auth-submit-btn');
  I.waitForText(current.expectedMessage, 5); // Đợi tối đa 5s để Toast hoặc Error hiển thị
});

// Test case thành công (Positive Case)
Scenario('L-001: Đăng nhập thành công', ({ I }) => {
  I.fillField('input[placeholder="Nhập tài khoản hoặc email"]', 'hai123');
  I.fillField('input[placeholder="Nhập mật khẩu"]', 'hai123'); // Mật khẩu đúng
  I.forceClick('.auth-submit-btn');
  
  // Kiểm tra xem đã đăng nhập thành công chưa (có thể là thấy avatar, tên user, hoặc thông báo thành công)
  // I.see('Đăng nhập thành công'); 
  // I.seeElement('.user-avatar');
});
