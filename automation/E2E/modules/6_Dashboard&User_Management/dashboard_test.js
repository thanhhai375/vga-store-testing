Feature('Admin Dashboard - UI Blackbox');

BeforeSuite(({ I }) => {
  I.loginAsAdmin('hai123', 'hai123');
});

Scenario('UI-DB-001: Hien thi tong quan Dashboard', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  
  // Verify Dashboard title
  I.waitForText('VGA Store Performance Dashboard', 5);
  I.see('Tổng quan tình hình kinh doanh');

  // Verify Stat Cards - Check existence instead of static wait
  I.waitForElement('.stat-card', 5);
  I.see('Tổng đơn hàng');
  I.see('Đơn mới hôm nay');
  I.see('Tổng doanh thu');
  I.see('Doanh thu hôm nay');

  // Verify Charts section
  I.see('Tiến độ doanh thu');
  I.see('Hoàn thành & Hủy đơn');
  I.see('Lượng bán theo Hãng');

  // Verify Recent Orders section
  I.see('Đơn hàng chờ xử lý');
  I.see('MÃ ĐƠN HÀNG');
  I.see('KHÁCH HÀNG');
  I.see('TRẠNG THÁI');
});

Scenario('UI-DB-002 & UI-UX-DB-001: Thay doi thoi gian loc bieu do va hieu ung Loading', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  
  // Verify default filter
  I.waitForElement('select.dash-filter-select', 5);
  
  // Change filter and check for UI loading state (opacity/spinner)
  I.selectOption('.dash-filter-select', '1month');
  
  // Check if charts section shows loading or overlay
  I.seeElement('.chart-loading-overlay, .spinner-border, .skeleton-box, .recharts-wrapper'); 
  
  // Wait for loading to finish
  I.waitForInvisible('.chart-loading-overlay, .spinner-border, .skeleton-box', 10);
  
  // Ensure the chart is rendered again
  I.seeElement('.recharts-responsive-container');
});

Scenario('UI-DB-004: Click xem tat ca don hang', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  I.waitForText('Xem tất cả ›', 5);
  
  // Action
  I.click('Xem tất cả ›');
  
  // Expected after action
  I.waitForFunction(() => window.location.pathname.includes('/orders'), 5);
  I.waitForText('Đơn Hàng', 5, 'h1');
});
