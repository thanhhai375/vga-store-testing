Feature('User Management - Add User (UI Blackbox)');

BeforeSuite(({ I }) => {
  I.loginAsAdmin('hai123', 'hai123');
});

Scenario('UI-UM-004: Bo trong tat ca truong khi Them User (EG)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  
  // Submit empty form
  I.click('Lưu tài khoản');
  
  // Verify UI-UX-UM-001: Required warnings show up near fields (HTML5 validation or custom text)
  // Check if modal stays open and submission is blocked
  I.see('Thêm Người Dùng Mới');
  // Check for expected validation error texts or invalid input states
  I.seeElement('input:invalid, .text-danger, .invalid-feedback'); 
});

Scenario('UI-UM-006: Username qua ngan (BVA)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  
  // Input 2 chars
  I.fillField('input[placeholder="Username"]', 'ab');
  I.fillField('input[placeholder="Mật khẩu"]', '123456');
  I.fillField('input[placeholder="Email"]', 'short@test.com');
  I.fillField('input[placeholder="Họ và tên"]', 'Short Name');
  
  I.click('Lưu tài khoản');
  
  // Expect validation error
  I.see('Thêm Người Dùng Mới'); // Modal should still be open
  I.seeElement('input:invalid, .text-danger, .invalid-feedback');
});

Scenario('UI-UM-007: Email sai dinh dang (EP)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  
  // Invalid email
  I.fillField('input[placeholder="Username"]', 'validuser123');
  I.fillField('input[placeholder="Mật khẩu"]', '123456');
  I.fillField('input[placeholder="Email"]', 'invalidemail');
  I.fillField('input[placeholder="Họ và tên"]', 'Invalid Email User');
  
  I.click('Lưu tài khoản');
  
  // Expected to block submit
  I.see('Thêm Người Dùng Mới');
  I.seeElement('input[type="email"]:invalid, .text-danger, .invalid-feedback');
});

Scenario('UI-UM-005 & UI-UX-UM-002: Them User thanh cong voi Loading state', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  
  let timestamp = Date.now();
  let uniqueUser = 'auto_user_' + timestamp;
  
  I.fillField('input[placeholder="Username"]', uniqueUser);
  I.fillField('input[placeholder="Mật khẩu"]', '12345678');
  I.fillField('input[placeholder="Email"]', uniqueUser + '@test.com');
  I.fillField('input[placeholder="Họ và tên"]', 'Auto User ' + timestamp);
  I.selectOption('select', 'USER');
  
  I.click('Lưu tài khoản');
  
  // UI-UX-UM-002: Verify submit button loading/disabled
  // This happens fast, so we check if disabled right away
  I.seeElement('button[disabled], .spinner-border');
  
  // Wait for success toast
  I.waitForText('thành công', 10);
  I.waitForInvisible('Thêm Người Dùng Mới', 5);
  
  // Verify in list
  I.fillField('input[placeholder="Tìm tài khoản..."]', uniqueUser);
  I.waitForText(uniqueUser, 5);
});

Scenario('UI-UM-008: Username da ton tai', ({ I }) => {
  const timestamp = Date.now();
  const duplicateUser = 'dup_user_' + timestamp;

  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);

  I.fillField('input[placeholder="Username"]', duplicateUser);
  I.fillField('input[placeholder="Mật khẩu"]', '12345678');
  I.fillField('input[placeholder="Email"]', duplicateUser + '@test.com');
  I.fillField('input[placeholder="Họ và tên"]', 'Duplicate User Seed');
  I.selectOption('select', 'USER');
  I.click('Lưu tài khoản');
  I.waitForText('thành công', 10);
  I.waitForInvisible('Thêm Người Dùng Mới', 5);

  I.click('+ Thêm người dùng');
  I.waitForText('Thêm Người Dùng Mới', 5);
  I.fillField('input[placeholder="Username"]', duplicateUser);
  I.fillField('input[placeholder="Mật khẩu"]', '12345678');
  I.fillField('input[placeholder="Email"]', duplicateUser + '_new@test.com');
  I.fillField('input[placeholder="Họ và tên"]', 'Admin Dup');
  
  I.click('Lưu tài khoản');
  
  // Verify error toast/message without losing form data
  I.waitForText('tồn tại', 10);
  I.see('Thêm Người Dùng Mới'); // modal remains open
  // Values should be preserved
  I.seeInField('input[placeholder="Username"]', duplicateUser);
});
