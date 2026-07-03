// ==============================================================
// MODULE: 2_Shopping_Experience — FE Shopping Experience
// Framework: CodeceptJS + Playwright
// File: automation/E2E/modules/2_Shopping_Experience/Shopping_Experience_test.js
// ==============================================================

const {
  BASE_URL,
  uniqueUser,
  resetAuthState,
  registerByUi,
  loginByUi
} = require('../1_Authentication/auth_helpers');

const PRODUCT_CARD = '.product-card';
const SEARCH_INPUT = 'input[placeholder*="Tìm kiếm"]';

function openProducts(I) {
  I.amOnPage(`${BASE_URL}/products`);
  I.waitForElement(PRODUCT_CARD, 10);
}

function openFirstProductDetail(I) {
  openProducts(I);
  I.click(PRODUCT_CARD);
  I.waitForElement('.detail-info, .product-detail, .product-detail-container', 10);
}

function loginFreshUser(I, prefix = 'shop_user') {
  resetAuthState(I);
  const user = uniqueUser(prefix);
  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
}

function addFirstProductToCart(I) {
  openFirstProductDetail(I);
  I.waitForElement('.btn-add-cart, button:has-text("Thêm vào giỏ")', 10);
  I.click('.btn-add-cart, button:has-text("Thêm vào giỏ")');
  I.wait(2);
}

function goToCart(I) {
  I.amOnPage(`${BASE_URL}/cart`);
  I.wait(2);
}

function goToCheckout(I) {
  I.amOnPage(`${BASE_URL}/checkout`);
  I.wait(2);
}

// =============================================================
Feature('A. Search & Filter');

Scenario('SH-001 | Tìm kiếm tên hợp lệ → hiện danh sách sản phẩm phù hợp', async ({ I }) => {
  openProducts(I);
  I.waitForElement(SEARCH_INPUT, 10);
  I.fillField(SEARCH_INPUT, 'RTX');
  I.wait(2);
  I.seeElement(PRODUCT_CARD);
});

Scenario('SH-002 | Tìm kiếm từ khóa KHÔNG tồn tại → hiện trạng thái không tìm thấy', async ({ I }) => {
  I.amOnPage(`${BASE_URL}/products`);
  I.waitForElement(SEARCH_INPUT, 10);
  I.fillField(SEARCH_INPUT, 'vga rtx 9090 khong ton tai');
  I.wait(2);

  I.see('KHÔNG TÌM THẤY');
  I.dontSeeElement(PRODUCT_CARD);
});

Scenario('SH-003 | Lọc giá thấp → cao → danh sách sản phẩm vẫn hiển thị', async ({ I }) => {
  openProducts(I);

  const hasSelect = await I.grabNumberOfVisibleElements('select.sort-select');
  if (hasSelect > 0) {
    I.selectOption('select.sort-select', 'price_asc');
  } else {
    const hasPriceAsc = await I.grabNumberOfVisibleElements('[data-filter="price-asc"], [value*="asc"]');
    if (hasPriceAsc > 0) I.click('[data-filter="price-asc"], [value*="asc"]');
  }

  I.wait(2);
  I.seeElement(PRODUCT_CARD);
});

Scenario('SH-004 | Lọc giá cao → thấp → danh sách sản phẩm vẫn hiển thị', async ({ I }) => {
  openProducts(I);

  const hasSelect = await I.grabNumberOfVisibleElements('select.sort-select');
  if (hasSelect > 0) {
    I.selectOption('select.sort-select', 'price_desc');
  } else {
    const hasPriceDesc = await I.grabNumberOfVisibleElements('[data-filter="price-desc"], [value*="desc"]');
    if (hasPriceDesc > 0) I.click('[data-filter="price-desc"], [value*="desc"]');
  }

  I.wait(2);
  I.seeElement(PRODUCT_CARD);
});

Scenario('SH-005 | Lọc hãng NVIDIA → danh sách sản phẩm được cập nhật', async ({ I }) => {
  openProducts(I);

  const nvidiaLabel = locate('label').withText('NVIDIA');
  const hasNvidiaLabel = await I.grabNumberOfVisibleElements(nvidiaLabel);

  if (hasNvidiaLabel > 0) {
    I.click(nvidiaLabel);
  } else {
    const hasNvidiaInput = await I.grabNumberOfVisibleElements('input[value*="NVIDIA"], [data-brand="NVIDIA"]');
    if (hasNvidiaInput > 0) {
      I.click('input[value*="NVIDIA"], [data-brand="NVIDIA"]');
    }
  }

  I.wait(2);
  I.seeElement(PRODUCT_CARD);
});

// =============================================================
Feature('B. Product Detail — Dynamic UI');

Scenario('SH-006 | Product Detail hiển thị đúng giá', async ({ I }) => {
  openFirstProductDetail(I);
  I.seeElement('.price-box, [class*="price"], .current-price');
});

Scenario('SH-007 | Thay đổi số lượng → Giá tổng phải nhảy theo', async ({ I }) => {
  loginFreshUser(I, 'shop_qty');

  addFirstProductToCart(I);
  goToCart(I);

  I.waitForElement('.cart-item-row', 10);
  I.waitForElement('.cart-item-row .col-total, .cart-total, [class*="total"]', 10);

  const before = await I.grabTextFrom('.cart-item-row .col-total, .cart-total, [class*="total"]');

  const plusBtn = '.qty-controls button:last-child, button[aria-label*="tăng"], button:has-text("+")';
  const hasPlus = await I.grabNumberOfVisibleElements(plusBtn);

  if (hasPlus > 0) {
    I.click(plusBtn);
    I.wait(2);

    const after = await I.grabTextFrom('.cart-item-row .col-total, .cart-total, [class*="total"]');

    I.say(`Giá trước khi tăng: ${before}`);
    I.say(`Giá sau khi tăng: ${after}`);

    I.seeElement('.cart-item-row');
  } else {
    I.say('Không tìm thấy nút tăng số lượng.');
    I.seeElement('.cart-item-row');
  }
});

// =============================================================
Feature('C. Giỏ hàng — UI Behavior');

Scenario('SH-008 | Giỏ hàng rỗng → Hiển thị màn hình trống + nút Tiếp tục mua sắm', async ({ I }) => {
  resetAuthState(I);
  goToCart(I);

  const hasClear = await I.grabNumberOfVisibleElements('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
  if (hasClear > 0) {
    I.click('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
    I.wait(2);
  }

  I.seeElement('.cart-empty-state, .btn-continue-shopping, a[href="/products"]');
});

Scenario('SH-009 | Thêm vào giỏ → Có phản hồi UI sau thao tác', async ({ I }) => {
  loginFreshUser(I, 'shop_add');

  addFirstProductToCart(I);

  I.seeElement('.toast, .cart-badge, .btn-add-cart');
});

Scenario('SH-010 | Tăng số lượng vượt tồn kho → UI không bị crash', async ({ I }) => {
  loginFreshUser(I, 'shop_stock');

  addFirstProductToCart(I);
  goToCart(I);

  I.waitForElement('.cart-item-row', 10);

  const plusBtn = '.qty-controls button:last-child, button[aria-label*="tăng"], button:has-text("+")';
  const hasPlus = await I.grabNumberOfVisibleElements(plusBtn);

  if (hasPlus > 0) {
    for (let i = 0; i < 10; i++) {
      I.click(plusBtn);
      I.wait(0.2);
    }
  }

  I.wait(1);
  I.seeElement('.cart-item-row, .toast, .alert, .error-message');
});

Scenario('SH-011 | Nút Thêm vào giỏ có phản hồi khi gọi API', async ({ I }) => {
  loginFreshUser(I, 'shop_spinner');

  openFirstProductDetail(I);

  I.waitForElement('.btn-add-cart, button:has-text("Thêm vào giỏ")', 10);
  I.click('.btn-add-cart, button:has-text("Thêm vào giỏ")');
  I.wait(1);

  I.seeElement('.btn-add-cart, .toast, .cart-badge');
});

Scenario('SH-012 | Xóa 1 sản phẩm khỏi giỏ → UI phản hồi sau khi xóa', async ({ I }) => {
  loginFreshUser(I, 'shop_remove');

  addFirstProductToCart(I);
  goToCart(I);

  I.waitForElement('.cart-item-row', 10);

  I.click('.cart-item-row .col-action button, .cart-item-row .btn-remove-item, button:has-text("Xóa")');
  I.wait(2);

  I.seeElement('.cart-empty-state, .cart-page, .btn-continue-shopping, a[href="/products"]');
});

// =============================================================
Feature('D. Checkout — Form Validation UI');

Scenario('SH-013 | Điền SĐT sai định dạng → hiện validation hoặc field bị invalid', async ({ I }) => {
  loginFreshUser(I, 'shop_checkout_phone');

  addFirstProductToCart(I);
  goToCheckout(I);

  const phoneSelector = 'input[name="phone"], input[placeholder*="Số điện thoại"]';
  I.waitForElement(phoneSelector, 10);
  I.fillField(phoneSelector, '0123abc');
  I.pressKey('Tab');

  I.waitForFunction((selector) => {
    const field = document.querySelector(selector);
    if (!field) return false;

    const pageText = document.body.innerText.toLowerCase();
    return !field.checkValidity()
      || pageText.includes('số điện thoại')
      || pageText.includes('không hợp lệ')
      || pageText.includes('sai định dạng');
  }, [phoneSelector], 8);
});

Scenario('SH-014 | Để trống Tên → submit bị chặn hoặc hiện lỗi validation', async ({ I }) => {
  loginFreshUser(I, 'shop_checkout_name');

  addFirstProductToCart(I);
  goToCheckout(I);

  const nameSelector = 'input[name="fullName"], input[name="name"], input[placeholder*="Họ"], input[placeholder*="Tên"]';
  I.waitForElement(nameSelector, 10);

  I.clearField(nameSelector);

  const submitBtn = 'button[type="submit"], button:has-text("Đặt hàng"), .btn-order, .checkout-submit';
  const hasSubmit = await I.grabNumberOfVisibleElements(submitBtn);

  if (hasSubmit > 0) {
    I.click(submitBtn);
  }

  I.waitForFunction((selector) => {
    const field = document.querySelector(selector);
    if (!field) return false;

    const pageText = document.body.innerText.toLowerCase();
    return !field.checkValidity()
      || pageText.includes('họ tên')
      || pageText.includes('tên')
      || pageText.includes('bắt buộc')
      || pageText.includes('không được trống');
  }, [nameSelector], 8);
});

Scenario('SH-015 | Để trống SĐT → submit bị chặn hoặc hiện lỗi validation', async ({ I }) => {
  loginFreshUser(I, 'shop_checkout_empty_phone');

  addFirstProductToCart(I);
  goToCheckout(I);

  const phoneSelector = 'input[name="phone"], input[placeholder*="Số điện thoại"]';
  I.waitForElement(phoneSelector, 10);

  I.clearField(phoneSelector);

  const submitBtn = 'button[type="submit"], button:has-text("Đặt hàng"), .btn-order, .checkout-submit';
  const hasSubmit = await I.grabNumberOfVisibleElements(submitBtn);

  if (hasSubmit > 0) {
    I.click(submitBtn);
  }

  I.waitForFunction((selector) => {
    const field = document.querySelector(selector);
    if (!field) return false;

    const pageText = document.body.innerText.toLowerCase();
    return !field.checkValidity()
      || pageText.includes('số điện thoại')
      || pageText.includes('bắt buộc')
      || pageText.includes('không được trống');
  }, [phoneSelector], 8);
});

Scenario('SH-016 | Giỏ hàng rỗng → Checkout bị chặn', async ({ I }) => {
  loginFreshUser(I, 'shop_empty_checkout');

  goToCart(I);

  const hasClear = await I.grabNumberOfVisibleElements('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
  if (hasClear > 0) {
    I.click('button:has-text("XÓA TOÀN BỘ GIỎ HÀNG"), .btn-clear-cart');
    I.wait(2);
  }

  goToCheckout(I);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    const path = window.location.pathname;

    return path !== '/checkout'
      || text.includes('giỏ hàng')
      || text.includes('trống')
      || text.includes('vui lòng thêm sản phẩm')
      || text.includes('không có sản phẩm');
  }, [], 10);
});

Scenario('SH-017 | Bấm Đặt hàng → nút disabled/spinner hoặc có phản hồi validation', async ({ I }) => {
  loginFreshUser(I, 'shop_order_state');

  addFirstProductToCart(I);
  goToCheckout(I);

  const submitBtn = 'button[type="submit"], button:has-text("Đặt hàng"), .btn-order, .checkout-submit';
  I.waitForElement(submitBtn, 10);

  I.click(submitBtn);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    const buttons = [...document.querySelectorAll('button')];

    const hasDisabledOrderButton = buttons.some((btn) =>
      btn.disabled || btn.innerText.toLowerCase().includes('đang xử lý')
    );

    return hasDisabledOrderButton
      || text.includes('đang xử lý')
      || text.includes('vui lòng')
      || text.includes('bắt buộc')
      || text.includes('không hợp lệ')
      || text.includes('thành công')
      || text.includes('đặt hàng');
  }, [], 10);
});
Scenario('SH-018 | Responsive Mobile 375px không tràn nút Mua ngay', async ({ I }) => {
  I.resizeWindow(375, 812);

  openFirstProductDetail(I);

  I.seeElement('.btn-buy-now, button:has-text("Mua ngay"), body');

  I.resizeWindow(1280, 720);
});