Feature('Admin Dashboard');

Before(({ I }) => {
  I.loginAsAdmin('hai123', 'hai123');
});

Scenario('Hiển thị đầy đủ thông tin thống kê trên Dashboard', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  
  // Verify Dashboard title
  I.see('VGA Store Performance Dashboard');
  I.see('Tổng quan tình hình kinh doanh');

  // Verify Stat Cards
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

Scenario('Thao tác Lọc thời gian trên Dashboard', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  
  // Verify default is today
  I.seeElement('select.dash-filter-select');
  
  // Change filter to 7days, 1month, 1year
  I.selectOption('.dash-filter-select', '7days');
  I.wait(1);
  I.selectOption('.dash-filter-select', '1month');
  I.wait(1);
  I.selectOption('.dash-filter-select', '1year');
  I.wait(1);
  
  I.seeElement('.dash-filter-select');
});

Scenario('Điều hướng từ Dashboard sang Quản lý Đơn hàng', ({ I }) => {
  I.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/');
  I.see('Xem tất cả ›');
  I.click('Xem tất cả ›');
  
  // Verify it navigates to /orders
  I.seeInCurrentUrl('/orders');
});
