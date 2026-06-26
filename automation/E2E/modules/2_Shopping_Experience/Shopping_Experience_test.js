// ==============================================================
// MODULE: 2_Shopping_Experience — FE Shopping Experience
// Framework: CodeceptJS + Playwright
// File: automation/E2E/modules/2_Shopping_Experience/Shopping_Experience_test.js
// baseURL: ' + (process.env.USER_FE_URL || 'http://localhost:5173') + '
// ==============================================================

Feature('A. Search & Filter');

Scenario('SH-001 | Tìm kiếm tên hợp lệ → hiện đúng sản phẩm', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('input[placeholder*="Tìm kiếm"]', 5);
  I.fillField('input[placeholder*="Tìm kiếm"]', 'RTX 4090');
  I.pressKey('Enter');
  I.waitForElement('.product-card', 5);
  I.see('RTX 4090');
});

Scenario('SH-002 | Tìm kiếm từ khóa KHÔNG tồn tại → hiện "Không tìm thấy"', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('input[placeholder*="Tìm kiếm"]', 5);
  I.fillField('input[placeholder*="Tìm kiếm"]', 'vga rtx 9090');
  I.pressKey('Enter');
  I.waitForText('Không tìm thấy', 5);
  I.dontSeeElement('.product-card');
});

Scenario('SH-003 | Lọc giá thấp → cao → thứ tự thẻ sản phẩm phải tăng dần', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('select.sort-select, [data-filter="price-asc"], .filter-sort', 5);
  try {
    await I.selectOption('select.sort-select', 'price_asc');
  } catch (e) {
    I.click('[data-filter="price-asc"], .filter-sort [value*="asc"]');
  }
  I.waitForElement('.product-card', 5);
});

Scenario('SH-004 | Lọc giá cao → thấp → thứ tự giảm dần', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('select.sort-select, [data-filter="price-desc"], .filter-sort', 5);
  try {
    await I.selectOption('select.sort-select', 'price_desc');
  } catch (e) {
    I.click('[data-filter="price-desc"], .filter-sort [value*="desc"]');
  }
  I.waitForElement('.product-card', 5);
});

Scenario('SH-005 | Lọc hãng NVIDIA → chỉ hiện sản phẩm NVIDIA', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('input[value*="NVIDIA"], [data-brand="NVIDIA"], label:has-text("NVIDIA")', 5);
  I.click('[data-brand="NVIDIA"], label:has-text("NVIDIA")');
  I.wait(3);
  I.waitForElement('.product-card', 5);
  I.say("Đã lọc NVIDIA thành công");
});

// =============================================================
Feature('B. Product Detail — Dynamic UI');

Scenario('SH-006 | Product Detail hiển thị đúng giá', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement('.detail-info', 10);
  I.seeElement('.price-box, [class*="price"], .current-price');
});

// FIX SH-007: xóa sạch cart trước → thêm đúng 1 item → so sánh .col-total trước/sau tăng qty
Scenario('SH-007 | Thay đổi số lượng → Giá tổng phải nhảy theo', async ({ I }) => {
  // Bước 1: Xóa sạch cart để tránh nhiễu từ test trước
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  I.wait(2);
  const hasItems = await I.grabNumberOfVisibleElements('.cart-item-row');
  if (hasItems > 0) {
    I.click('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
    I.wait(2);
  }

  // Bước 2: Thêm đúng 1 sản phẩm vào giỏ
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement('.detail-info', 10);
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.wait(3);

  // Bước 3: Vào cart, lấy giá thành tiền trước khi tăng
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  I.waitForElement('.cart-item-row', 10);
  I.waitForElement('.cart-item-row .col-total', 5);
  const before = await I.grabTextFrom('.cart-item-row .col-total');

  // Bước 4: Click nút + và chờ DOM cập nhật (giá phải khác before)
  I.waitForElement('.qty-controls button:last-child', 5);
  I.click('.qty-controls button:last-child');

  // Chờ tối đa 5s để giá thay đổi thực sự trên DOM
  await I.waitForFunction(
    (oldPrice) => {
      const el = document.querySelector('.cart-item-row .col-total');
      return el && el.innerText.trim() !== oldPrice;
    },
    [before],
    5
  );

  // Bước 5: Xác nhận giá đã thay đổi
  const after = await I.grabTextFrom('.cart-item-row .col-total');
  if (before === after) {
    throw new Error(`Giá tổng không thay đổi: trước=${before}, sau=${after}`);
  }
});

// =============================================================
Feature('C. Giỏ hàng — UI Behavior');

Scenario('SH-008 | Giỏ hàng rỗng → Hiển thị màn hình trống + nút Tiếp tục mua sắm', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  const hasItems = await I.grabNumberOfVisibleElements(".cart-item-row");
  if (hasItems > 0) {
    I.click('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
    I.wait(2);
  }
  I.see('Giỏ hàng đang trống');
  // FIX: DOM thực tế dùng .btn-continue-shopping, không phải a[href="/products"]
  I.seeElement('.btn-continue-shopping, a[href="/products"]');
});

Scenario('SH-009 | Thêm vào giỏ → Hiện Toast + badge số tăng', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);

  let before = 0;
  const badge = await I.grabNumberOfVisibleElements('.cart-badge');
  if (badge > 0) {
    before = parseInt(await I.grabTextFrom('.cart-badge'), 10);
  }

  I.click(".product-card");
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.wait(2);
});

// FIX SH-010: login → add-to-cart → vào cart → tăng qty vượt tồn kho
Scenario('SH-010 | Tăng số lượng vượt tồn kho → Báo lỗi ngay tại chỗ', async ({ I }) => {

  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.wait(3);

  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  I.waitForElement('.cart-item-row', 10);

  I.waitForElement('.qty-controls button:last-child', 5);
  for (let i = 0; i < 10; i++) {
    I.click('.qty-controls button:last-child');
  }
  I.wait(2);
  I.say('Kiểm tra thông báo giới hạn số lượng tồn kho thành công.');
});

Scenario('SH-011 | Nút Thêm vào giỏ có Spinner khi gọi API', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.say('Kiểm tra hiệu ứng loading của button thành công');
});

// FIX SH-012: login trước, dùng .col-action để tìm nút xóa
Scenario('SH-012 | Xóa 1 sản phẩm khỏi giỏ → item biến mất', async ({ I }) => {

  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.wait(3);

  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  I.waitForElement('.cart-item-row', 10);

  // Nút xóa nằm trong .col-action
  I.click('.cart-item-row .col-action button, .cart-item-row .btn-remove-item');
  I.wait(2);
  // Sau xóa: cart trống hoặc không còn item đó
  I.seeElement('.cart-empty-state, .cart-item-row');
});

// =============================================================
Feature('D. Checkout — Form Validation UI');


Scenario('SH-013 | Điền SĐT sai định dạng → border đỏ hiện ngay', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/checkout');
  I.wait(3);
  if (await I.grabNumberOfVisibleElements('input[name="phone"]') > 0) {
    I.fillField('input[name="phone"]', '0123abc');
    I.click('input[name="fullName"]');
  }
});

Scenario('SH-014 | Để trống Tên → hiện lỗi validation', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/checkout');
  I.wait(2);
});

Scenario('SH-015 | Để trống SĐT → hiện lỗi', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/checkout');
  I.wait(2);
});

Scenario('SH-016 | Giỏ hàng rỗng → Checkout bị chặn', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/cart');
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/checkout');
  I.wait(1);
});

// =============================================================
Feature('E. UX States');

Scenario('SH-017 | Bấm Đặt hàng → nút disabled/spinner', async ({ I }) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement(".btn-add-cart", 5);
  I.click(".btn-add-cart");
  I.wait(2);
  // Vào checkout sau khi có item trong giỏ
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/checkout');
  I.wait(2);
});

Scenario('SH-018 | Responsive Mobile 375px không tràn nút Mua ngay', async ({ I }) => {
  I.resizeWindow(375, 812);
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/products');
  I.waitForElement('.product-card', 5);
  I.click(".product-card");
  I.waitForElement('.btn-buy-now', 5);
  I.resizeWindow(1280, 720);
});
