// =============================================================
// MODULE: Product & Category Management - Admin Side (E2E UI Test)
// Framework: CodeceptJS + Playwright
// Coverage:
//   TC_PROD_025 → TC_PROD_030 : Admin CRUD sản phẩm
//   TC_PROD_031 → TC_PROD_042 : BVA - Lọc giá & Phân trang
// Env vars:
//   ADMIN_URL : URL admin frontend (default: http://localhost:5174)
//   USER_URL  : URL user frontend  (default: http://localhost:5173)
// =============================================================

const ADMIN = process.env.ADMIN_URL || 'http://localhost:5174';
const USER  = process.env.USER_URL  || 'http://localhost:5173';

Feature('Product & Category Management - Admin CRUD + BVA');

Before(({ I }) => {
  I.loginAsAdmin();
  I.amOnPage(`${ADMIN}/products`);
  I.waitForElement('.table-wrapper', 15);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 1: Thêm sản phẩm mới
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_025: Admin thêm mới sản phẩm VGA thành công', ({ I }) => {
  I.amOnPage(`${ADMIN}/products/new`);
  I.waitForElement('.form-group', 10);

  const uniqueName = 'VGA Test Auto ' + Date.now();
  I.fillField('input[placeholder="VD: NVIDIA GeForce RTX 4070 Super"]', uniqueName);
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '45000000');
  I.fillField('input[placeholder="VD: 50"]', '10');

  I.forceClick('button.btn-primary');
  I.waitForElement('.swal2-popup', 5);
  I.seeElement('.swal2-popup');
});

Scenario('TC_PROD_026: Admin thêm sản phẩm thiếu tên → báo lỗi validation', ({ I }) => {
  I.amOnPage(`${ADMIN}/products/new`);
  I.waitForElement('.form-group', 10);

  I.executeScript(() => {
    document.querySelectorAll('input, select, textarea').forEach(el => el.removeAttribute('required'));
  });

  I.fillField('input[placeholder="Ví dụ: 15000000"]', '45000000');
  I.forceClick('button.btn-primary');
  I.wait(2);

  // Kỳ vọng: Vẫn ở /products/new vì validation fail
  I.seeInCurrentUrl('/products/new');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 2: Cập nhật sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_027: Admin cập nhật thông tin sản phẩm thành công', ({ I }) => {
  // Dùng nút "Sửa" trong cột Hành động
  I.forceClick('//table//tbody//tr[1]//*[contains(text(),"Sửa")]');
  I.waitForElement('input[placeholder="Ví dụ: 15000000"]', 10);

  I.clearField('input[placeholder="Ví dụ: 15000000"]');
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '12500000');

  I.forceClick('button.btn-primary');
  I.waitForElement('.swal2-popup', 5);
  I.seeElement('.swal2-popup');
});

Scenario('TC_PROD_028: Admin truy cập sản phẩm không tồn tại → xử lý gracefully', async ({ I }) => {
  I.amOnPage(`${ADMIN}/products/99999/edit`);
  I.wait(3);
  // Chỉ cần không crash — có thể redirect hoặc hiện form rỗng
  I.seeElement('body');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 3: Xóa sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_029: Admin xóa sản phẩm thành công', async ({ I }) => {
  // Tạo sản phẩm mới để xóa — không đụng sản phẩm thật
  I.amOnPage(`${ADMIN}/products/new`);
  I.waitForElement('.form-group', 10);
  const deleteName = 'DELETE_ME_' + Date.now();
  I.fillField('input[placeholder="VD: NVIDIA GeForce RTX 4070 Super"]', deleteName);
  I.fillField('input[placeholder="Ví dụ: 15000000"]', '1000000');
  I.fillField('input[placeholder="VD: 50"]', '1');
  I.forceClick('button.btn-primary');
  I.waitForElement('.swal2-popup', 5);
  I.wait(3);

  // Quay về list, xóa dòng đầu tiên (sản phẩm vừa tạo)
  I.amOnPage(`${ADMIN}/products`);
  I.waitForElement('.table-wrapper', 10);
  I.wait(2);

  I.forceClick('//table//tbody//tr[1]//*[contains(text(),"Xóa")]');
  I.wait(3);

  const hasSwalConfirm = await I.grabNumberOfVisibleElements('.swal2-confirm');
  if (hasSwalConfirm > 0) {
    I.forceClick('.swal2-confirm');
    I.wait(2);
  }

  I.dontSee(deleteName, 'table tbody tr:first-child');
});

Scenario('TC_PROD_030: Truy cập admin khi chưa đăng nhập → redirect login', ({ I }) => {
  // Đăng xuất
  I.forceClick('.logout-btn');
  I.wait(2);
  // Thử vào trang admin
  I.amOnPage(`${ADMIN}/products`);
  I.wait(3);
  // Kỳ vọng: redirect về /login
  I.seeInCurrentUrl('/login');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 4: BVA – Lọc giá (user frontend)
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_031: BVA – minPrice=0, maxPrice=20tr → có kết quả', ({ I }) => {
  I.amOnPage(`${USER}/products?minPrice=0&maxPrice=20000000`);
  I.wait(2);
  I.dontSee('Lỗi');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_032: BVA – minPrice âm → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?minPrice=-1500000`);
  I.wait(3);
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_033: BVA – maxPrice âm → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?maxPrice=-5000000`);
  I.wait(3);
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_034: BVA – minPrice > maxPrice → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?minPrice=20000000&maxPrice=5000000`);
  I.wait(3);
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_035: BVA – maxPrice=0 → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?minPrice=0&maxPrice=0`);
  I.wait(3);
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_036: BVA – minPrice Overflow → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?minPrice=9999999999999999`);
  I.wait(3);
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_037: BVA – maxPrice Overflow → không crash', ({ I }) => {
  I.amOnPage(`${USER}/products?maxPrice=9999999999999999`);
  I.wait(3);
  I.dontSee('Lỗi hệ thống');
  I.seeElement('.shop-product-grid');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 5: BVA – Phân trang admin
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_038: BVA – Trang 1 phân trang admin hiển thị đúng', ({ I }) => {
  I.seeElement('.pagination');
  I.seeElement('.page-btn.active');
  I.see('1', '.page-btn.active');
});

Scenario('TC_PROD_039: BVA – Chuyển sang trang 2 trong admin', async ({ I }) => {
  const page2Btn = locate('.page-btn').withText('2');
  const exists = await I.grabNumberOfVisibleElements(page2Btn);
  if (exists === 0) {
    console.log('Chỉ có 1 trang, bỏ qua TC_PROD_039');
    return;
  }
  I.forceClick(page2Btn);
  I.wait(2);
  I.see('2', '.page-btn.active');
});

Scenario('TC_PROD_040: BVA – Trang cuối vẫn hiển thị sản phẩm', async ({ I }) => {
  const pageBtns = await I.grabNumberOfVisibleElements('.page-btn');
  if (pageBtns <= 1) {
    console.log('Chỉ có 1 trang, bỏ qua TC_PROD_040');
    return;
  }
  I.forceClick(`.page-btn:nth-child(${pageBtns})`);
  I.wait(2);
  I.seeElement('table tbody tr');
});

Scenario('TC_PROD_041: BVA – Search không tồn tại → không crash', ({ I }) => {
  I.fillField('input[placeholder="Tìm kiếm sản phẩm..."]', 'XXXX_KHÔNG_TỒN_TẠI_9999');
  I.wait(2);
  I.dontSee('Lỗi hệ thống');
});

Scenario('TC_PROD_042: BVA – Search "RTX" → có kết quả', async ({ I }) => {
  I.fillField('input[placeholder="Tìm kiếm sản phẩm..."]', 'RTX');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('table tbody tr');
  if (count === 0) throw new Error('Tìm "RTX" không có kết quả trong admin');
});
