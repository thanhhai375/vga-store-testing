// ==============================================================
// MODULE: 3_Cart&Payment — FE Payment
// Framework: CodeceptJS + Playwright
// File: automation/E2E/modules/3_Cart&Payment/payment_test.js
// baseURL: http://localhost:5173
// Account: hai123 / hai123
// ==============================================================

const BASE_URL = 'http://localhost:5173';

const TEST_USER = 'hai123';
const TEST_PASSWORD = 'hai123';

const DATA = {
fullName: 'Nguyễn Ngọc Thanh',
shortName: 'A',
validPhone: '0912345678',
invalidPhoneLength: '123456789',
invalidPhonePrefix: '0612345678',
invalidPhoneLetters: '09abc45678',
street: '123 Nguyễn Huệ',
};

const EL = {
// Đăng nhập
authModal: '.auth-modal',

authAccount:
'(//div[contains(@class,"auth-modal")]//input[not(@type="password")])[1]',

authPassword:
'(//div[contains(@class,"auth-modal")]//input[@type="password"])[1]',

authSubmit: '.auth-submit-btn',

// Sản phẩm dùng để chuẩn bị dữ liệu thanh toán
firstProductLink:
'(//a[starts-with(@href, "/product/")])[1]',

addToCart: '.btn-add-cart',
addPopup: '.custom-popup-content',
goToCartFromPopup: '.popup-btn-close',

// Giỏ hàng chỉ dùng để chuẩn bị dữ liệu
cartRow: '.cart-item-row',
clearCart: '.btn-clear-all',
checkoutButton: '.btn-checkout-now',

// Checkout
checkoutForm: '.checkout-form-column',

fullName:
'input[name="fullName"]',

phone:
'input[name="phone"]',

street:
'input[placeholder="Số nhà, tên đường, tòa nhà..."]',

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

// ==============================================================
// HELPER: Chỉ giữ lại một tab trình duyệt
// ==============================================================

async function keepOnlyOneTab(I) {
const numberOfTabs =
await I.grabNumberOfOpenTabs();

if (numberOfTabs > 1) {
await I.closeOtherTabs();
}

await I.waitForNumberOfTabs(1, 5);
}

// ==============================================================
// HELPER: Đăng nhập nếu modal xuất hiện
// ==============================================================

async function loginIfModalAppears(I) {
const modalCount =
await I.grabNumberOfVisibleElements(
EL.authModal
);

if (modalCount === 0) {
return false;
}

I.waitForElement(
EL.authAccount,
10
);

I.fillField(
EL.authAccount,
TEST_USER
);

I.fillField(
EL.authPassword,
TEST_PASSWORD
);

I.click(
EL.authSubmit
);

I.waitForInvisible(
EL.authModal,
20
);

I.wait(1);

return true;
}

// ==============================================================
// HELPER: Đăng nhập và đưa giỏ hàng về trạng thái rỗng
// ==============================================================

async function loginAndClearCart(I) {
// Bước 1: Mở trang danh sách sản phẩm
I.amOnPage(
BASE_URL + '/products'
);

I.waitForElement(
EL.firstProductLink,
20
);

I.click(
EL.firstProductLink
);

// Bước 2: Bấm thêm giỏ để kiểm tra đăng nhập
I.waitForElement(
EL.addToCart,
20
);

I.scrollTo(
EL.addToCart
);

I.click(
EL.addToCart
);

I.wait(1);

// Bước 3: Đăng nhập nếu modal xuất hiện
await loginIfModalAppears(I);

// Không bấm thêm sản phẩm lần thứ hai ở đây.
// Chuyển thẳng tới giỏ hàng để xóa dữ liệu cũ.
I.amOnPage(
BASE_URL + '/cart'
);

I.wait(2);

// Bước 4: Xóa toàn bộ dữ liệu giỏ hàng cũ
const clearButtonCount =
await I.grabNumberOfVisibleElements(
EL.clearCart
);

if (clearButtonCount > 0) {
I.click(
EL.clearCart
);

I.waitForText(
  'Giỏ hàng đang trống',
  20
);

}

await keepOnlyOneTab(I);
}

// ==============================================================
// HELPER: Thêm đúng một sản phẩm và mở Checkout
// ==============================================================

async function openCheckoutWithOneProduct(I) {
// Bước 1: Đăng nhập và xóa dữ liệu giỏ hàng cũ
await loginAndClearCart(I);

// Bước 2: Mở sản phẩm đầu tiên
I.amOnPage(
BASE_URL + '/products'
);

I.waitForElement(
EL.firstProductLink,
20
);

I.click(
EL.firstProductLink
);

// Bước 3: Thêm sản phẩm vào giỏ
I.waitForElement(
EL.addToCart,
20
);

I.scrollTo(
EL.addToCart
);

I.click(
EL.addToCart
);

I.wait(1);

// Đăng nhập lại nếu phiên đăng nhập không còn
const loggedInAgain =
await loginIfModalAppears(I);

if (loggedInAgain) {
I.waitForElement(
EL.addToCart,
20
);

I.scrollTo(
  EL.addToCart
);

I.click(
  EL.addToCart
);

}

// Bước 4: Kiểm tra popup thêm sản phẩm
I.waitForElement(
EL.addPopup,
20
);

I.see(
'Đã thêm sản phẩm vào giỏ hàng'
);

I.click(
EL.goToCartFromPopup
);

// Dùng URL tuyệt đối để không bị lấy nhầm cổng 5174
I.waitInUrl(
BASE_URL + '/cart',
20
);

I.waitForElement(
EL.cartRow,
20
);

// Bước 5: Mở trang Checkout
I.waitForElement(
EL.checkoutButton,
20
);

I.click(
EL.checkoutButton
);

I.waitInUrl(
BASE_URL + '/checkout',
20
);

I.waitForElement(
EL.checkoutForm,
20
);

await keepOnlyOneTab(I);
}

// ==============================================================
// HELPER: Chọn option đầu tiên trong dropdown địa chỉ
//
// 0 = Tỉnh/Thành phố
// 1 = Quận/Huyện
// 2 = Phường/Xã
// ==============================================================

async function selectFirstAddressOption(
I,
selectIndex
) {
await I.waitForFunction(
(index) => {
const selects =
document.querySelectorAll(
'.checkout-form-column select'
);

  const select =
    selects[index];

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

await I.executeScript(
(index) => {
const select =
document.querySelectorAll(
'.checkout-form-column select'
)[index];

  select.selectedIndex = 1;

  select.dispatchEvent(
    new Event(
      'change',
      {
        bubbles: true,
      }
    )
  );
},
selectIndex

);

I.wait(1);
}

// ==============================================================
// HELPER: Điền địa chỉ giao hàng hợp lệ
// ==============================================================

async function fillValidAddress(I) {
await selectFirstAddressOption(
I,
0
);

await selectFirstAddressOption(
I,
1
);

await selectFirstAddressOption(
I,
2
);

I.fillField(
EL.street,
DATA.street
);
}

// ==============================================================
// HELPER: Tắt validation required mặc định của HTML
// để kiểm tra thông báo validation của ứng dụng
// ==============================================================

async function disableNativeRequiredValidation(I) {
await I.executeScript(() => {
document
.querySelectorAll(
'.checkout-form-column [required]'
)
.forEach((element) => {
element.removeAttribute(
'required'
);
});
});
}

// ==============================================================
// Sau mỗi test đóng các tab phụ nếu có
// ==============================================================

// ==============================================================
// A. CHECKOUT STATE
// ==============================================================

Feature('A. Checkout State');

Scenario(
'FE_PAYMENT_01 | Giỏ hàng trống → Không hiển thị form Checkout',
async ({ I }) => {
// Bước 1: Đăng nhập và làm rỗng giỏ hàng
await loginAndClearCart(I);

// Bước 2: Truy cập trang Checkout
I.amOnPage(
  BASE_URL + '/checkout'
);

// Bước 3: Kiểm tra trạng thái giỏ hàng trống
I.waitForElement(
  EL.checkoutEmpty,
  20
);

I.see(
  'Giỏ hàng của bạn đang trống!'
);

I.see(
  'Vui lòng thêm sản phẩm vào giỏ để tiến hành thanh toán.'
);

I.seeElement(
  EL.returnShop
);

I.dontSeeElement(
  EL.checkoutForm
);

}
);

Scenario(
'FE_PAYMENT_02 | Có sản phẩm → Hiển thị đầy đủ form Checkout',
async ({ I }) => {
// Bước 1: Chuẩn bị một sản phẩm và mở Checkout
await openCheckoutWithOneProduct(I);

// Bước 2: Kiểm tra các thành phần của form
I.seeElement(
  EL.checkoutForm
);

I.seeElement(
  EL.fullName
);

I.seeElement(
  EL.phone
);

I.seeElement(
  EL.street
);

I.seeElement(
  EL.standardShipping
);

I.seeElement(
  EL.expressShipping
);

I.seeElement(
  EL.codPayment
);

I.seeElement(
  EL.bankTransferPayment
);

I.seeElement(
  EL.placeOrder
);

}
);

// ==============================================================
// B. CHECKOUT FORM VALIDATION
// ==============================================================

Feature('B. Checkout Form Validation');

Scenario(
'FE_PAYMENT_03 | Thiếu địa chỉ giao hàng → Hiển thị lỗi',
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

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_04 | Thiếu họ tên và số điện thoại → Hiển thị lỗi',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await fillValidAddress(I);
await disableNativeRequiredValidation(I);

I.clearField(
  EL.fullName
);

I.clearField(
  EL.phone
);

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_05 | Số điện thoại không đủ 10 chữ số → Hiển thị lỗi',
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

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_06 | Đầu số điện thoại không hợp lệ → Hiển thị lỗi',
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

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_07 | Họ tên chỉ có một ký tự → Hiển thị lỗi',
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

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_08 | Số điện thoại chứa chữ → Hiển thị lỗi',
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
  DATA.invalidPhoneLetters
);

I.click(
  EL.placeOrder
);

I.waitForElement(
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
'FE_PAYMENT_09 | Đã chọn khu vực nhưng bỏ trống số nhà tên đường → Hiển thị lỗi',
async ({ I }) => {
await openCheckoutWithOneProduct(I);
await disableNativeRequiredValidation(I);

// Chọn Tỉnh, Quận và Phường
await selectFirstAddressOption(
  I,
  0
);

await selectFirstAddressOption(
  I,
  1
);

await selectFirstAddressOption(
  I,
  2
);

// Điền thông tin cá nhân
I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.validPhone
);

// Bỏ trống số nhà, tên đường
I.clearField(
  EL.street
);

I.click(
  EL.placeOrder
);

I.waitForElement(
  EL.checkoutError,
  20
);

I.see(
  'Please fill in Province, District, Ward and Street address',
  EL.checkoutError
);

}
);

// ==============================================================
// C. SHIPPING METHOD
// ==============================================================

Feature('C. Shipping Method');

Scenario(
'FE_PAYMENT_10 | Vận chuyển tiêu chuẩn mặc định là miễn phí',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.seeCheckboxIsChecked(
  EL.standardShipping
);

I.see(
  'Miễn phí'
);

}
);

Scenario(
'FE_PAYMENT_11 | Hỏa tốc bị khóa khi chưa chọn khu vực TP.HCM',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.seeElement(
  EL.expressShipping +
  '[disabled]'
);

I.see(
  'Tự động kích hoạt cho khu vực TP. HCM'
);

}
);

// ==============================================================
// D. PAYMENT METHOD
// ==============================================================

Feature('D. Payment Method');

Scenario(
'FE_PAYMENT_12 | Chọn thanh toán COD → Radio COD được đánh dấu',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.checkOption(
  EL.codPayment
);

I.seeCheckboxIsChecked(
  EL.codPayment
);

}
);

Scenario(
'FE_PAYMENT_13 | Chọn chuyển khoản ngân hàng → Radio được đánh dấu',
async ({ I }) => {
await openCheckoutWithOneProduct(I);

I.checkOption(
  EL.bankTransferPayment
);

I.seeCheckboxIsChecked(
  EL.bankTransferPayment
);

}
);

// ==============================================================
// E. CHECKOUT NAVIGATION
// ==============================================================

Feature('E. Checkout Navigation');

Scenario(
'FE_PAYMENT_14 | Giỏ hàng trống → Nút quay lại mở trang sản phẩm',
async ({ I }) => {
// Bước 1: Đăng nhập và làm rỗng giỏ hàng
await loginAndClearCart(I);

// Bước 2: Mở trang Checkout
I.amOnPage(
  BASE_URL + '/checkout'
);

I.waitForElement(
  EL.returnShop,
  20
);

// Bước 3: Bấm quay lại mua sắm
I.click(
  EL.returnShop
);

// Bước 4: Kiểm tra chuyển về trang sản phẩm
I.waitInUrl(
  BASE_URL + '/products',
  20
);

I.seeInCurrentUrl(
  '/products'
);

}
);

// ==============================================================
// F. PLACE ORDER
// ==============================================================

Feature('F. Place Order');

Scenario(
'FE_PAYMENT_15 | Đặt hàng COD thành công → Giỏ hàng được làm trống',
async ({ I }) => {
// Bước 1: Chuẩn bị sản phẩm và mở Checkout
await openCheckoutWithOneProduct(I);

// Bước 2: Điền địa chỉ hợp lệ
await fillValidAddress(I);

// Bước 3: Điền thông tin khách hàng
I.fillField(
  EL.fullName,
  DATA.fullName
);

I.fillField(
  EL.phone,
  DATA.validPhone
);

// Bước 4: Chọn COD và đặt hàng
I.checkOption(
  EL.codPayment
);

I.click(
  EL.placeOrder
);

// Bước 5: Kiểm tra popup đặt hàng thành công
I.waitForElement(
  EL.successPopup,
  30
);

I.see(
  'Đặt hàng thành công'
);

I.seeElement(
  EL.orderCode
);

// Bước 6: Kiểm tra giỏ hàng được làm trống
I.amOnPage(
  BASE_URL + '/cart'
);

I.waitForText(
  'Giỏ hàng đang trống',
  20
);

I.dontSeeElement(
  EL.cartRow
);

}
);
