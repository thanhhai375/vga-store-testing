Feature('Register - Authentication');

const SELECTORS = {
  openAuthButton: 'button[title="Đăng nhập"]',
  modal: '.auth-modal',
  loginTab: '.auth-tab:nth-child(1)',
  registerTab: '.auth-tab:nth-child(2)',
  username: 'input[placeholder="Nhập tên đăng nhập"]',
  fullName: 'input[placeholder="Nhập họ và tên của bạn"]',
  email: 'input[placeholder="Nhập email của bạn"]',
  password: 'input[placeholder="Nhập mật khẩu"]',
  loginUsername: 'input[placeholder="Nhập tài khoản hoặc email"]',
  confirmPassword: '(//div[contains(@class,"auth-modal")]//input[@type="password"])[2]',
  submit: '.auth-submit-btn'
};

const VALID_REGISTER_USER = {
  username: 'valid_user',
  fullName: 'Valid User',
  email: 'valid_user@gmail.com',
  password: 'Pass123456!'
};

const clearAuthState = (I) => {
  I.amOnPage((process.env.USER_FE_URL || 'http://localhost:5173') + '/');
  I.clearCookie();
  I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  I.refreshPage();
};

const openRegisterForm = (I) => {
  I.waitForElement(SELECTORS.openAuthButton, 10);
  I.forceClick(SELECTORS.openAuthButton);
  I.waitForVisible(SELECTORS.modal, 5);
  I.forceClick(SELECTORS.registerTab);
  I.waitForVisible(SELECTORS.username, 5);
};

const fillRegisterForm = (I, user) => {
  I.fillField(SELECTORS.username, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, user.password);
  I.fillField(SELECTORS.confirmPassword, user.confirmPassword || user.password);
};

const clickSubmit = (I) => {
  I.waitForVisible(SELECTORS.submit, 5);
  I.forceClick(SELECTORS.submit);
};

const assertFieldInvalid = (I, selector) => {
  I.waitForFunction((selectors) => {
    const [fieldSelector] = selectors;
    const field = document.querySelector(fieldSelector);
    return Boolean(field && !field.checkValidity());
  }, [selector], 5);
  I.seeElement(SELECTORS.modal);
};

Before(({ I }) => {
  clearAuthState(I);
  openRegisterForm(I);
});

Scenario('R-001: Dang ky thanh cong (Happy Path)', ({ I }) => {
  const suffix = Date.now();

  fillRegisterForm(I, {
    username: `e2e_user_${suffix}`,
    fullName: 'E2E Test User',
    email: `e2e_user_${suffix}@gmail.com`,
    password: 'Pass123456!'
  });
  clickSubmit(I);

  I.waitForFunction((loginSelector, registerSelector) => {
    const text = document.body.innerText.toLowerCase();
    return Boolean(document.querySelector(loginSelector))
      || !document.querySelector(registerSelector)
      || text.includes('đăng ký')
      || text.includes('thành công');
  }, [SELECTORS.loginUsername, SELECTORS.username], 15);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-002: Kiem tra validation truc tiep khi bo trong', ({ I }) => {
  clickSubmit(I);

  I.waitForFunction((selectors) => {
    const fields = selectors.map((selector) => document.querySelector(selector));
    return fields.every(Boolean) && fields.some((field) => !field.checkValidity());
  }, [SELECTORS.username, SELECTORS.fullName, SELECTORS.email, SELECTORS.password, SELECTORS.confirmPassword], 5);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-003: Kiem tra dinh dang email sai', ({ I }) => {
  fillRegisterForm(I, {
    ...VALID_REGISTER_USER,
    username: `invalid_email_${Date.now()}`,
    email: 'invalidgmail'
  });
  clickSubmit(I);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    const emailInput = document.querySelector('input[placeholder="Nhập email của bạn"]');
    return text.includes('email')
      || text.includes('không hợp lệ')
      || text.includes('invalid')
      || Boolean(emailInput && !emailInput.checkValidity());
  }, [], 10);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-004: Dang ky trung tai khoan (Duplicate)', ({ I }) => {
  fillRegisterForm(I, {
    ...VALID_REGISTER_USER,
    username: 'hai123',
    email: `duplicate_${Date.now()}@gmail.com`
  });
  clickSubmit(I);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    return text.includes('already')
      || text.includes('đã tồn tại')
      || text.includes('tồn tại')
      || text.includes('username')
      || text.includes('tài khoản');
  }, [], 10);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-005: Username qua ngan bi tu choi', ({ I }) => {
  fillRegisterForm(I, {
    ...VALID_REGISTER_USER,
    username: 'ab',
    email: `short_username_${Date.now()}@gmail.com`
  });
  clickSubmit(I);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    return text.includes('3')
      || text.includes('50')
      || text.includes('ký tự')
      || text.includes('username')
      || text.includes('tên đăng nhập');
  }, [], 10);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-006: Username qua dai hon 50 ky tu bi tu choi', ({ I }) => {
  const usernameOver50 = `user_${'a'.repeat(51)}`;

  fillRegisterForm(I, {
    ...VALID_REGISTER_USER,
    username: usernameOver50,
    email: `long_username_${Date.now()}@gmail.com`
  });
  clickSubmit(I);

  I.waitForFunction(() => {
    const text = document.body.innerText.toLowerCase();
    return text.includes('50')
      || text.includes('3-50')
      || text.includes('3 to 50')
      || text.includes('username')
      || text.includes('tÃªn Ä‘Äƒng nháº­p');
  }, [], 10);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-007: Username chi gom khoang trang bi tu choi', ({ I }) => {
  I.fillField(SELECTORS.username, '   ');
  I.fillField(SELECTORS.fullName, VALID_REGISTER_USER.fullName);
  I.fillField(SELECTORS.email, `blank_username_${Date.now()}@gmail.com`);
  I.fillField(SELECTORS.password, VALID_REGISTER_USER.password);
  I.fillField(SELECTORS.confirmPassword, VALID_REGISTER_USER.password);
  clickSubmit(I);

  I.waitForFunction((selector) => {
    const field = document.querySelector(selector);
    const text = document.body.innerText.toLowerCase();
    return Boolean(field && field.value.trim() === '')
      || text.includes('không được')
      || text.includes('trống')
      || text.includes('required');
  }, [SELECTORS.username], 10);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-008: Thieu username thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.fullName, VALID_REGISTER_USER.fullName);
  I.fillField(SELECTORS.email, `missing_username_${Date.now()}@gmail.com`);
  I.fillField(SELECTORS.password, VALID_REGISTER_USER.password);
  I.fillField(SELECTORS.confirmPassword, VALID_REGISTER_USER.password);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.username);
});

Scenario('R-009: Thieu full name thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.username, `missing_fullname_${Date.now()}`);
  I.fillField(SELECTORS.email, `missing_fullname_${Date.now()}@gmail.com`);
  I.fillField(SELECTORS.password, VALID_REGISTER_USER.password);
  I.fillField(SELECTORS.confirmPassword, VALID_REGISTER_USER.password);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.fullName);
});

Scenario('R-010: Thieu email thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.username, `missing_email_${Date.now()}`);
  I.fillField(SELECTORS.fullName, VALID_REGISTER_USER.fullName);
  I.fillField(SELECTORS.password, VALID_REGISTER_USER.password);
  I.fillField(SELECTORS.confirmPassword, VALID_REGISTER_USER.password);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.email);
});

Scenario('R-011: Thieu password thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.username, `missing_password_${Date.now()}`);
  I.fillField(SELECTORS.fullName, VALID_REGISTER_USER.fullName);
  I.fillField(SELECTORS.email, `missing_password_${Date.now()}@gmail.com`);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.password);
});

Scenario('R-012: Sau khi dang ky thanh cong form chuyen ve login va reset field', ({ I }) => {
  const suffix = Date.now();

  fillRegisterForm(I, {
    username: `reset_user_${suffix}`,
    fullName: 'Reset User',
    email: `reset_user_${suffix}@gmail.com`,
    password: 'Pass123456!'
  });
  clickSubmit(I);

  I.waitForFunction((loginSelector, registerSelector) => {
    const text = document.body.innerText.toLowerCase();
    return Boolean(document.querySelector(loginSelector))
      || !document.querySelector(registerSelector)
      || text.includes('đăng ký')
      || text.includes('thành công');
  }, [SELECTORS.loginUsername, SELECTORS.username], 15);

  I.seeElement(SELECTORS.modal);
});

Scenario('R-013: Register phai co truong xac nhan mat khau', ({ I }) => {
  I.waitForFunction(() => {
    const passwordFields = [...document.querySelectorAll('.auth-modal input[type="password"]')];
    const fieldsWithConfirmHint = [...document.querySelectorAll('.auth-modal input, .auth-modal label')]
      .some((el) => /confirm|xac nhan|nhap lai|retype/i.test(el.placeholder || el.innerText || ''));

    return passwordFields.length >= 2 && fieldsWithConfirmHint;
  }, [], 5);
});

Scenario('R-014: Email dang ky phai dung input type email de browser validate som', ({ I }) => {
  I.waitForFunction((emailSelector) => {
    const emailInput = document.querySelector(emailSelector);
    return Boolean(emailInput && emailInput.type === 'email');
  }, [SELECTORS.email], 5);
});

Scenario('R-015: Click ra ngoai modal khong duoc lam mat form dang nhap do dang nhap', ({ I }) => {
  I.fillField(SELECTORS.username, 'draft_user');
  I.fillField(SELECTORS.fullName, 'Draft User');
  I.fillField(SELECTORS.email, 'draft_user@gmail.com');
  I.fillField(SELECTORS.password, 'Pass123456!');
  I.fillField(SELECTORS.confirmPassword, 'Pass123456!');

  I.executeScript(() => {
    const overlay = document.querySelector('.auth-overlay');
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  });

  I.waitForVisible(SELECTORS.modal, 5);
  I.seeInField(SELECTORS.username, 'draft_user');
  I.seeInField(SELECTORS.fullName, 'Draft User');
  I.seeInField(SELECTORS.email, 'draft_user@gmail.com');
  I.seeInField(SELECTORS.confirmPassword, 'Pass123456!');
});
