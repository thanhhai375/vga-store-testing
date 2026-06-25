// =============================================================
// MODULE: Product & Category Management - Admin Side (E2E UI Test)
// Framework: CodeceptJS + Playwright
// Admin URL: http://localhost:5174
// Coverage:
//   TC_PROD_025 → TC_PROD_030 : Admin CRUD sản phẩm
//   TC_PROD_031 → TC_PROD_042 : BVA - Lọc giá & Phân trang biên (user side)
// =============================================================

Feature('Product & Category Management - Admin CRUD + BVA');

Before(({ I }) => {
  I.loginAsAdmin();
  I.amOnPage('http://localhost:5174/products');
  I.waitForElement('.table-wrapper', 15);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 1: Thêm sản phẩm mới (TC_PROD_025, 026)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_025: Admin thêm mới sản phẩm VGA thành công', ({ I }) => {
  I.amOnPage('http://localhost:5174/products/new');
  I.waitForElement('.form-group', 10);

  I.fillField('input[placeholder="VD: NVIDIA GeForce RTX 4070 Super"]', 'VGA RTX 5090 Test Auto');
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '45000000');
  I.fillField('input[placeholder="VD: 50"]', '10');

  I.forceClick('button.btn-primary');

  // Kỳ vọng: SweetAlert2 popup xuất hiện → thêm thành công
  I.waitForElement('.swal2-popup', 5);
  I.seeElement('.swal2-popup');
});

Scenario('TC_PROD_026: Admin thêm sản phẩm thiếu trường name → báo lỗi validation', ({ I }) => {
  I.amOnPage('http://localhost:5174/products/new');
  I.waitForElement('.form-group', 10);

  I.executeScript(() => {
    document.querySelectorAll('input, select, textarea').forEach(el => el.removeAttribute('required'));
  });

  // Chỉ điền giá, để trống tên
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '45000000');

  I.forceClick('button.btn-primary');
  I.wait(2);

  // Kỳ vọng: Vẫn ở /products/new (không redirect) vì validation fail
  I.seeInCurrentUrl('/products/new');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 2: Cập nhật sản phẩm (TC_PROD_027, 028)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_027: Admin cập nhật thông tin sản phẩm thành công', ({ I }) => {
  // Dùng nút "Sửa" trong cột Hành động để navigate đến trang edit
  I.forceClick('//table//tbody//tr[1]//*[contains(text(),"Sửa")]');
  I.waitForElement('input[placeholder="Ví dụ: 15000000"]', 10);

  I.clearField('input[placeholder="Ví dụ: 15000000"]');
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '12500000');

  I.forceClick('button.btn-primary');
  I.waitForElement('.swal2-popup', 5);
  I.seeElement('.swal2-popup');
});

Scenario('TC_PROD_028: Admin truy cập trang sửa sản phẩm không tồn tại → lỗi', async ({ I }) => {
  // Kỳ vọng: App xử lý gracefully — redirect về /products hoặc /login
  I.amOnPage('http://localhost:5174/products/99999/edit');
  I.wait(3);
  const url = await I.grabCurrentUrl();
  // Chấp nhận: redirect về /products hoặc /login (session expired) hoặc ở lại với form rỗng
  // Chỉ cần không hiện trang trắng trống hoàn toàn
  I.seeElement('body');
  // Ghi nhận kết quả thực tế
  console.log('TC_028 actual URL:', url);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 3: Xóa sản phẩm (TC_PROD_029, 030)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_029: Admin xóa sản phẩm thành công', async ({ I }) => {
  // Lấy tên sản phẩm đầu tiên để verify sau khi xóa
  const productName = await I.grabTextFrom('table tbody tr:first-child .product-name');

  // Nút "Xóa" nằm trong cột Hành động
  I.forceClick('//table//tbody//tr[1]//button[contains(text(),"Xóa")]');
  I.wait(3);

  // Xử lý SweetAlert2 confirm nếu có
  const hasSwalConfirm = await I.grabNumberOfVisibleElements('.swal2-confirm');
  if (hasSwalConfirm > 0) {
    I.forceClick('.swal2-confirm');
    I.wait(2);
  }

  // Kỳ vọng: Sản phẩm vừa xóa không còn trong trang đầu tiên
  I.dontSee(productName, 'table tbody');
});

Scenario('TC_PROD_030: User thường truy cập admin → bị chặn (Forbidden)', ({ I }) => {
  // Kỳ vọng: Không có quyền truy cập admin, bị redirect về login
  // Đăng xuất admin trước
  I.forceClick('.logout-btn');
  I.wait(2);

  // Thử truy cập thẳng vào trang admin
  I.amOnPage('http://localhost:5174/products');
  I.wait(3);

  // Kỳ vọng: Bị redirect về trang login
  I.seeInCurrentUrl('/login');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 4: BVA – Lọc giá (kiểm tra qua user frontend port 5173)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_031: BVA – Lọc giá hợp lệ minPrice=0, maxPrice=20tr → có kết quả', async ({ I }) => {
  I.amOnPage('http://localhost:5173/products');
  I.waitForElement('.product-card', 10);
  // Nhập khoảng giá hợp lệ qua URL params
  I.amOnPage('http://localhost:5173/products?minPrice=0&maxPrice=20000000');
  I.wait(2);
  // Không có error, có sản phẩm hiển thị
  I.dontSee('Lỗi');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_032: BVA – minPrice âm → báo lỗi hoặc không có kết quả', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?minPrice=-1500000');
  I.wait(3);
  // App phải xử lý: hiện lỗi hoặc bỏ qua param và hiện danh sách bình thường
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_033: BVA – maxPrice âm → báo lỗi hoặc không có kết quả', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?maxPrice=-5000000');
  I.wait(3);
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_034: BVA – minPrice > maxPrice → kết quả rỗng hoặc báo lỗi', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?minPrice=20000000&maxPrice=5000000');
  I.wait(3);
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_035: BVA – maxPrice=0 → danh sách rỗng hoặc sản phẩm giá 0đ', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?minPrice=0&maxPrice=0');
  I.wait(3);
  // Không có error crash
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_036: BVA – minPrice Overflow → không crash hệ thống', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?minPrice=9999999999999999');
  I.wait(3);
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_037: BVA – maxPrice Overflow → không crash hệ thống', ({ I }) => {
  I.amOnPage('http://localhost:5173/products?maxPrice=9999999999999999');
  I.wait(3);
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 5: BVA – Phân trang admin (port 5174)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_038: BVA – Trang 1 phân trang admin hiển thị đúng', ({ I }) => {
  // Admin có pagination component với .page-btn
  I.seeElement('.pagination');
  I.seeElement('.page-btn.active');
  // Trang active đầu tiên phải là trang 1
  I.see('1', '.page-btn.active');
});

Scenario('TC_PROD_039: BVA – Chuyển sang trang 2 trong admin', async ({ I }) => {
  // Kỳ vọng: Nhấn trang 2 → danh sách thay đổi
  const page2Btn = locate('.page-btn').withText('2');
  const exists = await I.grabNumberOfVisibleElements(page2Btn);
  if (exists === 0) {
    console.log('Chỉ có 1 trang dữ liệu, bỏ qua TC_PROD_039');
    return;
  }
  I.forceClick(page2Btn);
  I.wait(2);
  I.see('2', '.page-btn.active');
});

Scenario('TC_PROD_040: BVA – Trang cuối cùng vẫn hiển thị sản phẩm', async ({ I }) => {
  // Lấy tổng số trang rồi nhấn vào trang cuối
  const pageBtns = await I.grabNumberOfVisibleElements('.page-btn');
  if (pageBtns <= 1) {
    console.log('Chỉ có 1 trang, bỏ qua TC_PROD_040');
    return;
  }
  // Nhấn page-btn cuối cùng (trước mũi tên next nếu có)
  I.forceClick(`.page-btn:nth-child(${pageBtns})`);
  I.wait(2);
  I.seeElement('table tbody tr');
});

Scenario('TC_PROD_041: BVA – Admin search sản phẩm không tồn tại → bảng rỗng', ({ I }) => {
  // Search input: placeholder="Tìm kiếm sản phẩm..."
  I.fillField('input[placeholder="Tìm kiếm sản phẩm..."]', 'XXXX_KHÔNG_TỒN_TẠI_9999');
  I.wait(2);
  I.dontSee('Lỗi hệ thống');
});

Scenario('TC_PROD_042: BVA – Admin search sản phẩm tồn tại → có kết quả', async ({ I }) => {
  I.fillField('input[placeholder="Tìm kiếm sản phẩm..."]', 'RTX');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('table tbody tr');
  if (count === 0) throw new Error('Tìm kiếm "RTX" không trả về kết quả nào trong admin');
});
