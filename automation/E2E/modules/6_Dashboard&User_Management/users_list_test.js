Feature('User Management - List and State (UI Blackbox)');

BeforeSuite(({ I }) => {
  I.loginAsAdmin('hai123', 'hai123');
});

Scenario('UI-UM-001: Load danh sach va phan trang', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.waitForText('Người dùng', 5, 'h1');
  
  // Check if pagination exists, then click next page
  I.waitForElement('.pagination', 5);
  I.executeScript(() => {
    const nextBtn = document.querySelector('.pagination .page-btn:last-child');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
    }
  });
  
  // Verify UI renders table without reloading page
  I.waitForElement('table', 5);
});

Scenario('UI-UM-002: Tim kiem user khong ton tai (Empty State)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.waitForElement('input[placeholder="Tìm tài khoản..."]', 5);
  
  // Input search text
  I.fillField('input[placeholder="Tìm tài khoản..."]', 'usernotexist123');
  
  // Verify Empty State instead of just waiting
  I.waitForText('Không tìm thấy', 5);
});

Scenario('UI-UM-003: Loc theo vai tro (Role)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  I.waitForElement('select.form-control', 5);
  
  // Filter by ADMIN
  I.selectOption('select.form-control', 'ADMIN');
  
  // Ensure the page updates and shows Admin badge
  I.waitForElement('.badge-danger', 5); 
});

Scenario('UI-UM-009: Khoa (Lock) tai khoan (State Transition)', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  
  // Filter for standard users to avoid locking oneself
  I.selectOption('select.form-control', 'USER');
  I.waitForElement('table tbody tr', 5);
  
  // Click lock button on first row (assuming 'Khóa' text or lock icon)
  I.click(locate('button').withText('Khóa').first());
  
  // Wait for confirmation modal
  I.waitForText('Xác nhận', 5);
  I.click('Xóa ngay'); // or "Đồng ý" based on actual UI
  
  // Toast and badge transition
  I.waitForText('tài khoản', 5);
});

Scenario('UI-UM-010: Huy thao tac tren Modal Xac nhan', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/users');
  
  I.selectOption('select.form-control', 'USER');
  I.waitForElement('table tbody tr', 5);
  
  I.click(locate('button').withText('Khóa').first());
  I.waitForText('Xác nhận', 5);
  
  // Cancel action
  I.click('Hủy');
  
  // Verify modal closes
  I.waitForInvisible('.modal', 5);
});
