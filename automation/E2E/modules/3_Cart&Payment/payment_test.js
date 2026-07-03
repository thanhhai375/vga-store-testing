// ==============================================================
// MODULE: 3_Cart&Payment — FE Payment
// Framework: CodeceptJS + Playwright
// Jira: KCPM-83
// ==============================================================

const assert = require('assert');

const BASE_URL = process.env.USER_FE_URL || 'http://localhost:5173';
const TEST_USER = process.env.TEST_USER || 'hai123';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'hai123';

const DATA = {
  fullName: 'Nguyễn Ngọc Thanh',
  shortName: 'A',
  validPhone: '0912345678',
  invalidPhoneBoundary: '091234567',
  street: '123 Nguyễn Huệ',
};

const EL = {
  authModal: '.auth-modal',
  authAccount:
    '(//div[contains(@class,"auth-modal")]//input[not(@type="password")])[1]',
  authPassword:
    '(//div[contains(@class,"auth-modal")]//input[@type="password"])[1]',
  authSubmit: '.auth-submit-btn',

  firstProductLink: '(//a[starts-with(@href, "/product/")])[1]',
  addToCart: '.btn-add-cart',
  addPopup: '.custom-popup-content',
  goToCartFromPopup: '.popup-btn-close',

  cartRow: '.cart-item-row',
  clearCart: '.btn-clear-all',
  checkoutButton: '.btn-checkout-now',

  checkoutForm: '.checkout-form-column',
  checkoutEmpty: '.checkout-empty',
  returnShop: '.btn-return-shop',

  fullName: 'input[name="fullName"]',
  phone: 'input[name="phone"]',
  province: '(//form[contains(@class,"checkout-form-column")]//select)[1]',
  district: '(//form[contains(@class,"checkout-form-column")]//select)[2]',
  ward: '(//form[contains(@class,"checkout-form-column")]//select)[3]',
  street: 'input[placeholder="Số nhà, tên đường, tòa nhà..."]',
  newAddressCard: '.add-new-card',

  standardShipping: 'input[type="radio"][value="standard"]',
  expressShipping: 'input[type="radio"][value="express"]',

  codPayment: 'input[name="payment"][value="COD"]',
  bankTransferPayment: 'input[name="payment"][value="BANK_TRANSFER"]',
  vnpayPayment: 'input[name="payment"][value="VNPAY"]',
  bankTransferBox: '.bank-transfer-box',

  placeOrder: '.btn-place-order',
  checkoutError: '.checkout-error-msg',
  successPopup: '.checkout-popup-content',
  orderCode: '.popup-order-code',

  summarySection: '.checkout-summary-section',
  summaryItem: '.checkout-summary-item',
  itemQty: '.checkout-summary-item .item-qty',
  itemPrice: '.checkout-summary-item .item-price',

  subtotalValue:
    '//div[contains(@class,"checkout-total-line")][span[normalize-space()="Tạm tính"]]/span[last()]',

  shippingValue:
    '//div[contains(@class,"checkout-total-line")][span[normalize-space()="Phí vận chuyển"]]/span[last()]',

  finalPrice: '.final-price',
};

function currencyToNumber(text) {
  return Number(String(text).replace(/[^0-9]/g, ''));
}

async function keepOnlyOneTab(I) {
  const numberOfTabs = await I.grabNumberOfOpenTabs();

  if (numberOfTabs > 1) {
    await I.closeOtherTabs();
  }

  await I.waitForNumberOfTabs(1, 5);
}

async function loginIfModalAppears(I) {
  const modalCount = await I.grabNumberOfVisibleElements(EL.authModal);

  if (modalCount === 0) {
    return false;
  }

  I.waitForElement(EL.authAccount, 10);
  I.fillField(EL.authAccount, TEST_USER);
  I.fillField(EL.authPassword, TEST_PASSWORD);
  I.click(EL.authSubmit);
  I.waitForInvisible(EL.authModal, 20);

  return true;
}

async function loginAndClearCart(I) {
  I.amOnPage(`${BASE_URL}/products`);
  I.waitForElement(EL.firstProductLink, 20);
  I.click(EL.firstProductLink);

  I.waitForElement(EL.addToCart, 20);
  I.scrollTo(EL.addToCart);
  I.click(EL.addToCart);

  await loginIfModalAppears(I);

  I.amOnPage(`${BASE_URL}/cart`);
  I.wait(1);

  const clearButtonCount =
    await I.grabNumberOfVisibleElements(EL.clearCart);

  if (clearButtonCount > 0) {
    I.click(EL.clearCart);
    I.waitForText('Giỏ hàng đang trống', 20);
  }

  await keepOnlyOneTab(I);
}

async function openCheckoutWithOneProduct(I) {
  await loginAndClearCart(I);

  I.amOnPage(`${BASE_URL}/products`);
  I.waitForElement(EL.firstProductLink, 20);
  I.click(EL.firstProductLink);

  I.waitForElement(EL.addToCart, 20);
  I.scrollTo(EL.addToCart);
  I.click(EL.addToCart);

  const loggedInAgain = await loginIfModalAppears(I);

  if (loggedInAgain) {
    I.waitForElement(EL.addToCart, 20);
    I.scrollTo(EL.addToCart);
    I.click(EL.addToCart);
  }

  I.waitForElement(EL.addPopup, 20);
  I.see('Đã thêm sản phẩm vào giỏ hàng', EL.addPopup);
  I.click(EL.goToCartFromPopup);

  I.waitInUrl('/cart', 20);
  I.waitForElement(EL.cartRow, 20);
  I.waitForElement(EL.checkoutButton, 20);
  I.click(EL.checkoutButton);

  I.waitInUrl('/checkout', 20);
  I.waitForElement(EL.checkoutForm, 20);

  await keepOnlyOneTab(I);
}

async function ensureNewAddressForm(I) {
  const addNewCount =
    await I.grabNumberOfVisibleElements(EL.newAddressCard);

  if (addNewCount > 0) {
    I.click(EL.newAddressCard);
  }

  I.waitForElement(EL.province, 20);
}

async function selectFirstAvailableOption(
  I,
  selectIndex,
  selectLocator
) {
  await I.waitForFunction(
    (index) => {
      const select =
        document.querySelectorAll(
          '.checkout-form-column select'
        )[index];

      return Boolean(
        select &&
          !select.disabled &&
          Array.from(select.options).some(
            (option) =>
              !option.disabled && option.value
          )
      );
    },
    [selectIndex],
    25
  );

  const optionLocator =
    `(${selectLocator}/option[` +
    `not(@disabled) and string-length(@value) > 0` +
    `])[1]`;

  const optionValue =
    await I.grabAttributeFrom(optionLocator, 'value');

  I.selectOption(selectLocator, optionValue);
}

async function fillHcmAddressByUserActions(I) {
  await ensureNewAddressForm(I);

  await I.waitForFunction(
    () => {
      const select =
        document.querySelectorAll(
          '.checkout-form-column select'
        )[0];

      return Boolean(
        select &&
          Array.from(select.options).some(
            (option) =>
              /Hồ Chí Minh/i.test(
                option.textContent || ''
              )
          )
      );
    },
    [],
    25
  );

  I.selectOption(
    EL.province,
    'Thành phố Hồ Chí Minh'
  );

  await selectFirstAvailableOption(
    I,
    1,
    EL.district
  );

  await selectFirstAvailableOption(
    I,
    2,
    EL.ward
  );

  I.fillField(EL.street, DATA.street);
}

async function fillValidCustomer(I) {
  I.fillField(EL.fullName, DATA.fullName);
  I.fillField(EL.phone, DATA.validPhone);
}

async function installOrderErrorMock(
  I,
  status,
  message
) {
  await I.usePlaywrightTo(
    'mock create-order failure',
    async ({ page }) => {
      await page.route(
        '**/api/orders',
        async (route) => {
          if (route.request().method() !== 'POST') {
            await route.continue();
            return;
          }

          await route.fulfill({
            status,
            contentType: 'application/json',
            body: JSON.stringify({ message }),
          });
        }
      );
    }
  );
}

Feature('KCPM-83 - Payment FE E2E');

After(async ({ I }) => {
  await keepOnlyOneTab(I);
});

Scenario(
  'FE_PAYMENT_01 | Giỏ hàng trống → Không hiển thị form Checkout',
  async ({ I }) => {
    await loginAndClearCart(I);

    I.amOnPage(`${BASE_URL}/checkout`);

    I.waitForElement(EL.checkoutEmpty, 20);
    I.see('Giỏ hàng của bạn đang trống!');
    I.dontSeeElement(EL.checkoutForm);
  }
);

Scenario(
  'FE_PAYMENT_02 | Có sản phẩm → Hiển thị đầy đủ form và phương thức thanh toán',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);

    I.seeElement(EL.checkoutForm);
    I.seeElement(EL.fullName);
    I.seeElement(EL.phone);
    I.seeElement(EL.standardShipping);
    I.seeElement(EL.expressShipping);
    I.seeElement(EL.codPayment);
    I.seeElement(EL.bankTransferPayment);
    I.seeElement(EL.vnpayPayment);
    I.seeElement(EL.placeOrder);
  }
);

Scenario(
  'FE_PAYMENT_03 | Tóm tắt đơn hàng → Đúng tạm tính và tổng tiền giao tiêu chuẩn',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);

    I.seeElement(EL.summaryItem);
    I.see('SL: 1', EL.summarySection);
    I.seeCheckboxIsChecked(EL.standardShipping);

    const itemPrice = currencyToNumber(
      await I.grabTextFrom(EL.itemPrice)
    );

    const subtotal = currencyToNumber(
      await I.grabTextFrom(EL.subtotalValue)
    );

    const finalTotal = currencyToNumber(
      await I.grabTextFrom(EL.finalPrice)
    );

    assert.strictEqual(
      subtotal,
      itemPrice,
      'Tạm tính phải bằng giá sản phẩm với số lượng 1'
    );

    assert.strictEqual(
      finalTotal,
      subtotal,
      'Giao tiêu chuẩn miễn phí nên tổng phải bằng tạm tính'
    );

    I.see('Miễn phí', EL.summarySection);
  }
);

Scenario(
  'FE_PAYMENT_04 | Bỏ trống trường bắt buộc → Trình duyệt chặn submit',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await ensureNewAddressForm(I);

    I.clearField(EL.fullName);
    I.clearField(EL.phone);
    I.clearField(EL.street);

    const validation =
      await I.executeScript(() => {
        const form =
          document.querySelector(
            '.checkout-form-column'
          );

        const invalidFields = Array.from(
          form.querySelectorAll('[required]')
        ).filter(
          (element) =>
            !element.checkValidity()
        ).length;

        return {
          formValid: form.checkValidity(),
          invalidFields,
        };
      });

    assert.strictEqual(
      validation.formValid,
      false
    );

    assert.ok(
      validation.invalidFields >= 3,
      'Phải có các trường bắt buộc chưa hợp lệ'
    );

    I.click(EL.placeOrder);
    I.dontSeeElement(EL.successPopup);
  }
);

Scenario(
  'FE_PAYMENT_05 | Số điện thoại 9 chữ số → Hiển thị lỗi',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);

    I.fillField(
      EL.fullName,
      DATA.fullName
    );

    I.fillField(
      EL.phone,
      DATA.invalidPhoneBoundary
    );

    I.click(EL.placeOrder);

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
  'FE_PAYMENT_06 | Họ tên chỉ có một ký tự → Hiển thị lỗi',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);

    I.fillField(
      EL.fullName,
      DATA.shortName
    );

    I.fillField(
      EL.phone,
      DATA.validPhone
    );

    I.click(EL.placeOrder);

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
  'FE_PAYMENT_07 | Địa chỉ TP.HCM → Hỏa tốc cộng đúng 50.000₫',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);

    I.dontSeeElement(
      `${EL.expressShipping}[disabled]`
    );

    I.checkOption(EL.expressShipping);
    I.seeCheckboxIsChecked(EL.expressShipping);

    const subtotal = currencyToNumber(
      await I.grabTextFrom(EL.subtotalValue)
    );

    const shippingFee = currencyToNumber(
      await I.grabTextFrom(EL.shippingValue)
    );

    const finalTotal = currencyToNumber(
      await I.grabTextFrom(EL.finalPrice)
    );

    assert.strictEqual(
      shippingFee,
      50000,
      'Phí giao hỏa tốc phải là 50.000₫'
    );

    assert.strictEqual(
      finalTotal,
      subtotal + shippingFee,
      'Tổng tiền phải bằng tạm tính cộng phí vận chuyển'
    );
  }
);

Scenario(
  'FE_PAYMENT_08 | Đặt hàng COD → Thành công và làm trống giỏ hàng',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    I.checkOption(EL.codPayment);
    I.click(EL.placeOrder);

    I.waitForElement(
      EL.successPopup,
      30
    );

    I.see(
      'Đặt hàng thành công',
      EL.successPopup
    );

    I.seeElement(EL.orderCode);

    I.amOnPage(`${BASE_URL}/cart`);

    I.waitForText(
      'Giỏ hàng đang trống',
      20
    );

    I.dontSeeElement(EL.cartRow);
  }
);

Scenario(
  'FE_PAYMENT_09 | Chuyển khoản ngân hàng → Chuyển sang trang chờ thanh toán',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    I.checkOption(EL.bankTransferPayment);

    I.waitForElement(
      EL.bankTransferBox,
      20
    );

    I.see(
      'THÔNG TIN TÀI KHOẢN',
      EL.bankTransferBox
    );

    I.see(
      'Quét mã QR',
      EL.bankTransferBox
    );

    I.click(EL.placeOrder);

    I.waitInUrl(
      '/payment/pending',
      30
    );

    I.see('Quét mã QR để thanh toán');
    I.see('Thời gian còn lại');
    I.see('Mã đơn hàng:');
  }
);

Scenario(
  'FE_PAYMENT_10 | VNPAY → Gửi đúng phương thức và chuyển đến paymentUrl',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    await I.usePlaywrightTo(
      'mock order and VNPAY payment APIs',
      async ({ page }) => {
        await page.route(
          '**/api/orders',
          async (route) => {
            if (
              route.request().method() !==
              'POST'
            ) {
              await route.continue();
              return;
            }

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                success: true,
                data: {
                  orderId: 9901,
                  orderCode: 'KCPM83-VNPAY',
                  totalAmount: 100000,
                },
              }),
            });
          }
        );

        await page.route(
          '**/api/payments/orders/*',
          async (route) => {
            if (
              route.request().method() !==
              'POST'
            ) {
              await route.continue();
              return;
            }

            const body =
              route.request().postDataJSON();

            assert.strictEqual(
              body.paymentMethod,
              'VNPAY'
            );

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                success: true,
                data: {
                  paymentUrl:
                    `${BASE_URL}/fake-vnpay-gateway` +
                    `?transaction=KCPM83`,
                },
              }),
            });
          }
        );
      }
    );

    I.checkOption(EL.vnpayPayment);
    I.seeCheckboxIsChecked(EL.vnpayPayment);

    I.click(EL.placeOrder);

    I.waitInUrl(
      '/fake-vnpay-gateway',
      20
    );

    const pendingOrderId =
      await I.executeScript(
        () =>
          sessionStorage.getItem(
            'pendingOrderId'
          )
      );

    assert.strictEqual(
      pendingOrderId,
      '9901'
    );
  }
);

Scenario(
  'FE_PAYMENT_11 | Sản phẩm hết hàng → Hiển thị lỗi và không báo thành công',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    await installOrderErrorMock(
      I,
      409,
      'Sản phẩm đã hết hàng hoặc không đủ tồn kho'
    );

    I.click(EL.placeOrder);

    I.waitForElement(
      EL.checkoutError,
      20
    );

    I.see(
      'hết hàng',
      EL.checkoutError
    );

    I.dontSeeElement(EL.successPopup);
  }
);

Scenario(
  'FE_PAYMENT_12 | Backend mất kết nối → Hiển thị lỗi hệ thống',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    await I.usePlaywrightTo(
      'abort create-order request',
      async ({ page }) => {
        await page.route(
          '**/api/orders',
          async (route) => {
            if (
              route.request().method() !==
              'POST'
            ) {
              await route.continue();
              return;
            }

            await route.abort('failed');
          }
        );
      }
    );

    I.click(EL.placeOrder);

    I.waitForElement(
      EL.checkoutError,
      20
    );

    I.see(
      'Đã xảy ra lỗi hệ thống khi kết nối Backend',
      EL.checkoutError
    );

    I.dontSeeElement(EL.successPopup);
  }
);

Scenario(
  'FE_PAYMENT_13 | Đổi BANK_TRANSFER về COD → Ẩn thông tin chuyển khoản',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);

    I.checkOption(EL.bankTransferPayment);

    I.seeCheckboxIsChecked(
      EL.bankTransferPayment
    );

    I.waitForElement(
      EL.bankTransferBox,
      20
    );

    I.see(
      'THÔNG TIN TÀI KHOẢN',
      EL.bankTransferBox
    );

    I.see(
      'Quét mã QR',
      EL.bankTransferBox
    );

    I.checkOption(EL.codPayment);

    I.seeCheckboxIsChecked(EL.codPayment);

    I.dontSeeCheckboxIsChecked(
      EL.bankTransferPayment
    );

    I.waitForInvisible(
      EL.bankTransferBox,
      10
    );
  }
);

Scenario(
  'FE_PAYMENT_14 | Địa chỉ ngoài TP.HCM → Không cho chọn giao hỏa tốc',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await ensureNewAddressForm(I);

    await I.waitForFunction(
      () => {
        const province =
          document.querySelectorAll(
            '.checkout-form-column select'
          )[0];

        return Boolean(
          province &&
            Array.from(
              province.options
            ).some((option) => {
              const text =
                option.textContent || '';

              return (
                option.value &&
                !option.disabled &&
                !/Hồ Chí Minh/i.test(text)
              );
            })
        );
      },
      [],
      25
    );

    const nonHcmProvinceValue =
      await I.executeScript(() => {
        const province =
          document.querySelectorAll(
            '.checkout-form-column select'
          )[0];

        const option = Array.from(
          province.options
        ).find((item) => {
          const text =
            item.textContent || '';

          return (
            item.value &&
            !item.disabled &&
            !/Hồ Chí Minh/i.test(text)
          );
        });

        return option ? option.value : null;
      });

    assert.ok(
      nonHcmProvinceValue,
      'Phải tìm thấy ít nhất một tỉnh/thành ngoài TP.HCM'
    );

    I.selectOption(
      EL.province,
      nonHcmProvinceValue
    );

    I.wait(1);

    const expressDisabled =
      await I.executeScript(() => {
        const express =
          document.querySelector(
            'input[type="radio"][value="express"]'
          );

        return Boolean(
          express && express.disabled
        );
      });

    assert.strictEqual(
      expressDisabled,
      true,
      'Giao hỏa tốc phải bị vô hiệu hóa ngoài TP.HCM'
    );

    I.seeCheckboxIsChecked(
      EL.standardShipping
    );
  }
);

Scenario(
  'FE_PAYMENT_15 | Nhấn đặt hàng liên tiếp → Không tạo trùng đơn hàng',
  async ({ I }) => {
    await openCheckoutWithOneProduct(I);
    await fillHcmAddressByUserActions(I);
    await fillValidCustomer(I);

    I.checkOption(EL.codPayment);

    await I.usePlaywrightTo(
      'mock APIs and count create-order requests',
      async ({ page }) => {
        page.__kcpm83OrderRequestCount = 0;

        await page.route(
          '**/api/orders',
          async (route) => {
            if (route.request().method() !== 'POST') {
              await route.continue();
              return;
            }

            page.__kcpm83OrderRequestCount += 1;

            await new Promise((resolve) =>
              setTimeout(resolve, 500)
            );

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                success: true,
                data: {
                  orderId: 9915,
                  orderCode: 'KCPM83-NO-DUPLICATE',
                  totalAmount: 100000,
                },
              }),
            });
          }
        );

        await page.route(
          '**/api/payments/orders/*',
          async (route) => {
            if (route.request().method() !== 'POST') {
              await route.continue();
              return;
            }

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                success: true,
                data: {
                  paymentId: 8815,
                  orderId: 9915,
                  paymentMethod: 'COD',
                  paymentStatus: 'PENDING',
                },
              }),
            });
          }
        );
      }
    );

    await I.usePlaywrightTo(
      'click place-order button twice rapidly',
      async ({ page }) => {
        const button = page.locator('.btn-place-order');

        await button.evaluate((element) => {
          element.click();
          element.click();
        });
      }
    );

    I.wait(2);

    const requestCount =
      await I.usePlaywrightTo(
        'read create-order request count',
        async ({ page }) => {
          return page.__kcpm83OrderRequestCount;
        }
      );

    assert.strictEqual(
      requestCount,
      1,
      `Mong đợi 1 request tạo Order nhưng nhận được ${requestCount}`
    );
  }
);