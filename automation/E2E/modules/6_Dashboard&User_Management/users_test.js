Feature('Admin User Management');

Before(({ I }) => {
  I.loginAsAdmin('hai123', 'hai123');
});

Scenario('Hiển thị danh sách Người dùng và các bộ lọc', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  
  I.see('Người dùng', 'h1');
  I.see('Quản lý tài khoản hệ thống');

  // Verify Table Headers
  I.see('STT');
  I.see('TÊN ĐĂNG NHẬP');
  I.see('EMAIL');
  I.see('VAI TRÒ');
  I.see('TRẠNG THÁI');
  I.see('HÀNH ĐỘNG');

  // Verify Search & Filter
  I.seeElement('input[placeholder="Tìm tài khoản..."]');
  I.seeElement('select.form-control');
});

Scenario('Tìm kiếm người dùng', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.fillField('input[placeholder="Tìm tài khoản..."]', 'admin');
  I.wait(2);
  I.see('admin');
});

Scenario('Lọc theo vai trò', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.selectOption('select.form-control', 'ADMIN');
  I.wait(2);
  I.seeElement('.badge-danger'); // Admin badge
});

Scenario('Thêm người dùng mới', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.see('Thêm Người Dùng Mới');
  
  // Fill the form
  let timestamp = Date.now();
  I.fillField('input[placeholder="Username"]', 'auto_user_' + timestamp);
  I.fillField('input[placeholder="Mật khẩu"]', '123456');
  I.fillField('input[placeholder="Email"]', 'auto_user_' + timestamp + '@test.com');
  I.fillField('input[placeholder="Họ và tên"]', 'Auto User ' + timestamp);
  I.selectOption('select', 'USER');
  
  I.click('Lưu tài khoản');
  
  // Verify user is added
  I.waitForText('Đã thêm người dùng thành công!', 10);
  I.dontSee('Thêm Người Dùng Mới');
  
  I.fillField('input[placeholder="Tìm tài khoản..."]', 'auto_user_' + timestamp);
  I.wait(3);
  I.see('auto_user_' + timestamp);
});

Scenario('Khóa và Mở khóa người dùng', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.selectOption('select.form-control', 'USER');
  I.wait(2);
  
  I.click(locate('button').withText('hóa').first());
  I.waitForText('Xác nhận', 5);
  
  I.click('Xóa ngay');
  I.waitForText('tài khoản', 10);
});

Scenario('Hủy Thêm người dùng', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  
  I.click('Hủy');
  I.dontSee('Thêm Người Dùng Mới');
});

Scenario('Phân trang Danh sách Người dùng', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  // Check if pagination exists, then click next page
  I.executeScript(() => {
    const nextBtn = document.querySelector('.pagination .page-btn:last-child');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    }
  });
  I.wait(2);
  I.seeElement('table');
});
