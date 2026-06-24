Feature('Login - Authentication');

Before(({ I }) => {
  I.amOnPage('http://localhost:5173/');
  // Xóa session cũ để đảm bảo luôn ở trạng thái Guest (chưa đăng nhập)
  I.executeScript(() => localStorage.clear());
  I.clearCookie();
  I.refreshPage(); // Reload lại trang để áp dụng trạng thái Guest

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

// Test Cases: Khoảng trắng và Ký tự đặc biệt
loginData.add(['L-014', '   ', '123456', 'Tên đăng nhập không được trống']); // Chỉ chứa khoảng trắng
loginData.add(['L-015', 'hai 123', '123456', 'Invalid username or password']); // Chứa khoảng trắng ở giữa username
loginData.add(['L-016', 'hai!@#', '123456', 'Invalid username or password']); // Username chứa ký tự đặc biệt
loginData.add(['L-017', 'hai123', '   ', 'Mật khẩu không được trống']); // Mật khẩu chỉ chứa khoảng trắng
loginData.add(['L-018', "' OR 1=1 --", '123456', 'Invalid username or password']); // Chứa ký tự đặc biệt (Dạng SQL Injection)

Data(loginData).Scenario('Kiểm thử Đăng nhập các trường hợp lỗi', ({ I, current }) => {
  I.fillField('input[placeholder="Nhập tài khoản hoặc email"]', current.username);
  I.fillField('input[placeholder="Nhập mật khẩu"]', current.password);
  
  I.forceClick('.auth-submit-btn');
  I.waitForText(current.expectedMessage, 5); // Đợi tối đa 5s để Toast hoặc Error hiển thị
});

// Test case thành công (Positive Case)
Scenario('L-001: Đăng nhập thành công', ({ I }) => {
  I.fillField('input[placeholder="Nhập tài khoản hoặc email"]', 'hai123');
  I.fillField('input[placeholder="Nhập mật khẩu"]', 'hai123'); // Mật khẩu đúng
  I.forceClick('.auth-submit-btn');
  
  // Kiểm tra xem đã đăng nhập thành công chưa
  I.waitForFunction(() => Boolean(localStorage.getItem('token')), [], 5);
  I.dontSeeElement('.auth-modal'); // Đảm bảo form đăng nhập đã đóng
});
