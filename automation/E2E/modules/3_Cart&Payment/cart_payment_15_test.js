const assert = require('assert');

Feature('KCPM-83 - FE E2E Cart & Payment (15 test cases)');

const TEST_USER = 'thanh123';
const TEST_PASSWORD = 'thanh123';

const ROUTE = {
products: '/products',
cart: '/cart',
checkout: '/checkout',
};

const EL = {
// Đăng nhập
authModal: '.auth-modal',
  authAccount: '(//div[contains(@class,"auth-modal")]//input[not(@type="password")])[1]',
  authPassword: '(//div[contains(@class,"auth-modal")]//input[@type="password"])[1]',
authSubmit: '.auth-submit-btn',

// Sản phẩm
firstProductLink: '(//a[starts-with(@href, "/product/")])[1]',
addToCart: '.btn-add-cart',
addPopup: '.custom-popup-content',
goToCartFromPopup: '.popup-btn-close',

// Giỏ hàng
cartRow: '.cart-item-row',
productName: '.cart-item-name',
quantity: '.qty-number',
increaseQuantity: '.qty-controls button:last-child',
clearCart: '.btn-clear-all',
cartTotal: '.cart-summary-box .final-price',
checkoutButton: '.btn-checkout-now',

// Checkout
checkoutForm: '.checkout-form-column',
fullName: 'input[name="fullName"]',
phone: 'input[name="phone"]',
street: 'input[placeholder="Số nhà, tên đường, tòa nhà..."]',

standardShipping:
'input[type="radio"][value="standard"]',

expressShipping:
'input[type="radio"][value="express"]',

codPayment:
'input[name="payment"][value="COD"]',

bankTransferPayment:
'input[name="payment"][value="BANK_TRANSFER"]',

placeOrder: '.btn-place-order',
checkoutError: '.checkout-error-msg',
checkoutEmpty: '.checkout-empty',
returnShop: '.btn-return-shop',
successPopup: '.checkout-popup-content',
orderCode: '.popup-order-code',
};

const DATA = {
fullName: 'Nguyễn Ngọc Thanh',
shortName: 'A',
validPhone: '0912345678',
invalidPhoneLength: '123456789',
invalidPhonePrefix: '0612345678',
street: '123 Nguyễn Huệ',
};

/**

* Chỉ giữ lại một tab trình duyệt.
  */
  async function keepOnlyOneTab(I) {
  const numberOfTabs = await I.grabNumberOfOpenTabs();

if (numberOfTabs > 1) {
await I.closeOtherTabs();
}

await I.waitForNumberOfTabs(1, 5);
}

/**

* Trước mỗi test:
* * Xóa phiên đăng nhập cũ.
* * Mở sản phẩm đầu tiên.
* * Bấm thêm vào giỏ để hiện modal đăng nhập.
* * Đăng nhập lại bằng tài khoản test.
    */
    async function loginBeforeEachTest(I) {
  I.amOnPage('/');

  // X�a to�n b? phi�n dang nh?p cu d? m?i test dang nh?p l?i.
  I.clearCookie();

  await I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  I.refreshPage();

  // M? s?n ph?m v� b?m th�m gi? h�ng d? hi?n modal dang nh?p.
  I.amOnPage(ROUTE.products);
  I.waitForVisible(EL.firstProductLink, 20);
  I.click(EL.firstProductLink);

  I.waitForVisible(EL.addToCart, 20);
  I.click(EL.addToCart);

  I.waitForVisible(EL.authModal, 20);

  I.fillField(EL.authAccount, TEST_USER);
  I.fillField(EL.authPassword, TEST_PASSWORD);
  I.click(EL.authSubmit);

  I.waitForInvisible(EL.authModal, 20);

  await keepOnlyOneTab(I);
}
async function loginIfModalAppears(I) {
  const modalCount =
  await I.grabNumberOfVisibleElements(EL.authModal);

if (modalCount === 0) {
return false;
}

I.fillField(EL.authAccount, TEST_USER);
I.fillField(EL.authPassword, TEST_PASSWORD);
I.click(EL.authSubmit);

I.waitForInvisible(EL.authModal, 20);

return true;
}

/**

* Xóa toàn bộ sản phẩm nếu giỏ hàng đang có dữ liệu.
  */
  async function clearCartIfNeeded(I) {
  I.amOnPage(ROUTE.cart);
  I.waitForText('Giỏ hàng của bạn', 20);

const clearButtonCount =
await I.grabNumberOfVisibleElements(EL.clearCart);

if (clearButtonCount > 0) {
I.click(EL.clearCart);
I.waitForText('Giỏ hàng đang trống', 20);
}

await keepOnlyOneTab(I);
}

/**

* Thêm sản phẩm đầu tiên vào giỏ hàng.
  */
  async function addFirstProductToCart(I, openCart = true) {
  I.amOnPage(ROUTE.products);

I.waitForVisible(EL.firstProductLink, 20);
I.click(EL.firstProductLink);

I.waitForVisible(EL.addToCart, 20);
I.click(EL.addToCart);
I.wait(1);

const loggedInAgain = await loginIfModalAppears(I);

if (loggedInAgain) {
I.waitForVisible(EL.addToCart, 20);
I.click(EL.addToCart);
}

I.waitForVisible(EL.addPopup, 20);
I.see('Đã thêm sản phẩm vào giỏ hàng');

if (openCart) {
I.click(EL.goToCartFromPopup);

I.waitInUrl(ROUTE.cart, 20);
I.waitForVisible(EL.cartRow, 20);

}

await keepOnlyOneTab(I);
}

/**

* Chuẩn bị trang Checkout với một sản phẩm.
  */
  async function openCheckoutWithOneProduct(I) {
  await clearCartIfNeeded(I);
  await addFirstProductToCart(I, true);

I.click(EL.checkoutButton);
I.wait(1);

const loggedInAgain = await loginIfModalAppears(I);

if (loggedInAgain) {
I.waitForVisible(EL.checkoutButton, 20);
I.click(EL.checkoutButton);
}

I.waitInUrl(ROUTE.checkout, 20);
I.waitForVisible(EL.checkoutForm, 20);

await keepOnlyOneTab(I);
}

/**

* Chọn option đầu tiên có dữ liệu trong dropdown địa chỉ.
*
* selectIndex:
* 0 = Tỉnh/Thành phố
* 1 = Quận/Huyện
* 2 = Phường/Xã
  */
  async function selectFirstAvailableAddressOption(
  I,
  selectIndex
  ) {
  await I.waitForFunction(
  (index) => {
  const select = document.querySelectorAll(
  '.checkout-form-column select'
  )[index];

  return Boolean(
  select &&
  !select.disabled &&
  select.options &&
  select.options.length > 1
  );
  },
  [selectIndex],
  25
  );

await I.executeScript((index) => {
const select = document.querySelectorAll(
'.checkout-form-column select'
)[index];

select.selectedIndex = 1;

select.dispatchEvent(
  new Event('change', {
    bubbles: true,
  })
);

}, selectIndex);

I.wait(1);
}

/**

* Điền một địa chỉ hợp lệ.
  */
  async function fillValidAddress(I) {
  await selectFirstAvailableAddressOption(I, 0);
  await selectFirstAvailableAddressOption(I, 1);
  await selectFirstAvailableAddressOption(I, 2);

I.fillField(EL.street, DATA.street);
}

/**

* Tắt validation required mặc định của HTML.
* Việc này giúp kiểm tra thông báo lỗi của ứng dụng.
  */
  async function disableNativeRequiredValidation(I) {
  await I.executeScript(() => {
  document
  .querySelectorAll(
  '.checkout-form-column [required]'
  )
  .forEach((element) => {
  element.removeAttribute('required');
  });
  });
  }

/**

* Before chạy trước từng Scenario.
* Mỗi test đều phải đăng nhập lại.
  */
  Before(async ({ I }) => {
  await keepOnlyOneTab(I);
  await loginBeforeEachTest(I);
  });

/**

* Sau mỗi test, đóng mọi tab phụ.
  */
  After(async ({ I }) => {
  await keepOnlyOneTab(I);
  });

/* =========================================================

* CART — 5 TEST CASES
* ======================================================= */

Scenario(
'FE_CART_01 - Thêm sản phẩm vào giỏ hàng thành công',
async ({ I }) => {
await clearCartIfNeeded(I);
await addFirstProductToCart(I, true);

I.seeElement(EL.cartRow);
I.seeElement(EL.productName);
I.seeTextEquals('1', EL.quantity);

}
);

Scenario(
'FE_CART_02 - Hiển thị popup sau khi thêm sản phẩm',
async ({ I }) => {
await clearCartIfNeeded(I);
await addFirstProductToCart(I, false);

I.seeElement(EL.addPopup);
I.see('Đã thêm sản phẩm vào giỏ hàng');

}
);

Scenario(
'FE_CART_03 - Tăng số lượng sản phẩm từ 1 lên 2',
async ({ I }) => {
await clearCartIfNeeded(I);
await addFirstProductToCart(I, true);

I.click(EL.increaseQuantity);

I.waitForText('2', 20, EL.quantity);
I.seeTextEquals('2', EL.quantity);

}
);

Scenario(
'FE_CART_04 - Xóa toàn bộ sản phẩm trong giỏ hàng',
async ({ I }) => {
await clearCartIfNeeded(I);
await addFirstProductToCart(I, true);

I.click(EL.clearCart);

I.waitForText('Giỏ hàng đang trống', 20);
I.dontSeeElement(EL.cartRow);

}
);

Scenario(
'FE_CART_05 - Tổng tiền thay đổi khi tăng số lượng',
async ({ I }) => {
await clearCartIfNeeded(I);
await addFirstProductToCart(I, true);

const totalBefore =
  await I.grabTextFrom(EL.cartTotal);

I.click(EL.increaseQuantity);

I.waitForText('2', 20, EL.quantity);
I.wait(1);

const totalAfter =
  await I.grabTextFrom(EL.cartTotal);

assert.notStrictEqual(
  totalAfter,
  totalBefore,
  'Tổng tiền không thay đổi sau khi tăng số lượng'
);

}
);

/* =========================================================

* PAYMENT — 10 TEST CASES
* ======================================================= */

Scenario(
'FE_PAYMENT_01 - Không hiển thị form khi giỏ hàng trống',
async ({ I }) => {
await clearCartIfNeeded(I);

I.amOnPage(ROUTE.checkout);

I.waitForText(
  'Giỏ hàng của bạn đang trống!',
  20
);

I.seeElement(EL.checkoutEmpty);

I.see(
  'Vui lòng thêm sản phẩm vào giỏ để tiến hành thanh toán.'
);

I.seeElement(EL.returnShop);
I.dontSeeElement(EL.checkoutForm);

}
);

Scenario(
'FE_PAYMENT_02 - Hiển thị đầy đủ form Checkout',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.seeElement(EL.fullName);
I.seeElement(EL.phone);
I.seeElement(EL.street);
I.seeElement(EL.standardShipping);
I.seeElement(EL.expressShipping);
I.seeElement(EL.codPayment);
I.seeElement(EL.bankTransferPayment);
I.seeElement(EL.placeOrder);

}
);

Scenario(
'FE_PAYMENT_03 - Báo lỗi khi thiếu địa chỉ giao hàng',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await disableNativeRequiredValidation(I);

I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.validPhone
);

I.click(EL.placeOrder);

I.waitForVisible(
  EL.checkoutError,
  20
);

I.see(
  'Please fill in Province, District, Ward and Street address',
  EL.checkoutError
);

}
);

Scenario(
'FE_PAYMENT_04 - Báo lỗi khi thiếu họ tên và số điện thoại',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);
await disableNativeRequiredValidation(I);

I.clearField(EL.fullName);
I.clearField(EL.phone);

I.click(EL.placeOrder);

I.waitForVisible(
  EL.checkoutError,
  20
);

I.see(
  'Please enter your full name and phone number',
  EL.checkoutError
);

}
);

Scenario(
'FE_PAYMENT_05 - Báo lỗi khi số điện thoại không đủ 10 chữ số',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);
await disableNativeRequiredValidation(I);

I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.invalidPhoneLength
);

I.click(EL.placeOrder);

I.waitForVisible(
  EL.checkoutError,
  20
);

I.see(
  'Invalid phone number',
  EL.checkoutError
);

I.see(
  'Must be 10 digits',
  EL.checkoutError
);

}
);

Scenario(
'FE_PAYMENT_06 - Báo lỗi khi đầu số điện thoại không hợp lệ',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);
await disableNativeRequiredValidation(I);

I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.invalidPhonePrefix
);

I.click(EL.placeOrder);

I.waitForVisible(
  EL.checkoutError,
  20
);

I.see(
  'Invalid phone number',
  EL.checkoutError
);

}
);

Scenario(
'FE_PAYMENT_07 - Báo lỗi khi họ tên chỉ có một ký tự',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);
await disableNativeRequiredValidation(I);

I.fillField(
  EL.fullName,
  DATA.shortName
);

I.fillField(
  EL.phone,
  DATA.validPhone
);

I.click(EL.placeOrder);

I.waitForVisible(
  EL.checkoutError,
  20
);

I.see(
  'Please enter your real full name',
  EL.checkoutError
);

}
);

Scenario(
'FE_PAYMENT_08 - Vận chuyển tiêu chuẩn mặc định là miễn phí',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.seeCheckboxIsChecked(
  EL.standardShipping
);

I.see('Miễn phí');

}
);

Scenario(
'FE_PAYMENT_09 - Hỏa tốc bị khóa khi chưa chọn khu vực TP.HCM',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.seeElement(
  `${EL.expressShipping}[disabled]`
);

I.see(
  'Tự động kích hoạt cho khu vực TP. HCM'
);

}
);

Scenario(
'FE_PAYMENT_10 - Đặt hàng COD thành công và xóa giỏ hàng',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);

I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.validPhone
);

I.checkOption(EL.codPayment);
I.click(EL.placeOrder);

I.waitForVisible(
  EL.successPopup,
  30
);

I.see('Đặt hàng thành công');
I.seeElement(EL.orderCode);

I.amOnPage(ROUTE.cart);

I.waitForText(
  'Giỏ hàng đang trống',
  20
);

I.dontSeeElement(EL.cartRow);

}
);
