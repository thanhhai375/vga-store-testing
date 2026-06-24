Feature('Login - Authentication');

const SELECTORS = {
  openAuthButton: 'button[title="Đăng nhập"]',
  modal: '.auth-modal',
  username: 'input[placeholder="Nhập tài khoản hoặc email"]',
  password: 'input[placeholder="Nhập mật khẩu"]',
  togglePassword: '.toggle-password',
  submit: '.auth-submit-btn',
  close: '.auth-close-btn',
  userAvatar: '.user-avatar-trigger',
  logoutButton: '.logout-btn'
};

const VALID_USER = {
  username: 'hai123',
  password: 'hai123'
};

const clearAuthState = (I) => {
  I.amOnPage('http://localhost:5173/');
  I.clearCookie();
  I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  I.refreshPage();
};

const openLoginForm = (I) => {
  I.waitForElement(SELECTORS.openAuthButton, 10);
  I.forceClick(SELECTORS.openAuthButton);
  I.waitForVisible(SELECTORS.modal, 5);
  I.waitForVisible(SELECTORS.submit, 5);
};

const loginSuccessfully = (I) => {
  I.fillField(SELECTORS.username, VALID_USER.username);
  I.fillField(SELECTORS.password, VALID_USER.password);
  clickSubmit(I);
  I.waitForFunction(() => Boolean(localStorage.getItem('token')), [], 20);
  I.waitForInvisible(SELECTORS.modal, 5);
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
  openLoginForm(I);
});

Scenario('L-001: Dang nhap thanh cong (Happy Path)', ({ I }) => {
  loginSuccessfully(I);
});

Scenario('L-002: Dang nhap that bai khi sai username hoac password', ({ I }) => {
  I.fillField(SELECTORS.username, 'usernotexist999');
  I.fillField(SELECTORS.password, 'wrong-password');
  clickSubmit(I);

  I.waitForText('Invalid username or password', 10);
  I.seeElement(SELECTORS.modal);
});

Scenario('L-003: Trang thai form khi thieu du lieu bat buoc', ({ I }) => {
  clickSubmit(I);

  I.waitForFunction((selectors) => {
    const [usernameSelector, passwordSelector] = selectors;
    const username = document.querySelector(usernameSelector);
    const password = document.querySelector(passwordSelector);
    return Boolean(username && password && (!username.checkValidity() || !password.checkValidity()));
  }, [SELECTORS.username, SELECTORS.password], 5);
  I.seeElement(SELECTORS.modal);
});

Scenario('L-004: An hien mat khau', ({ I }) => {
  I.fillField(SELECTORS.password, 'secret123');
  I.seeAttributesOnElements(SELECTORS.password, { type: 'password' });

  I.forceClick(SELECTORS.togglePassword);
  I.seeAttributesOnElements(SELECTORS.password, { type: 'text' });

  I.forceClick(SELECTORS.togglePassword);
  I.seeAttributesOnElements(SELECTORS.password, { type: 'password' });
});

Scenario('L-005: Dang nhap bang phim Enter', ({ I }) => {
  I.fillField(SELECTORS.username, VALID_USER.username);
  I.fillField(SELECTORS.password, VALID_USER.password);
  I.pressKey('Enter');

  I.waitForFunction(() => Boolean(localStorage.getItem('token')), [], 20);
  I.waitForInvisible(SELECTORS.modal, 5);
});

Scenario('L-006: Thieu username thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.password, VALID_USER.password);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.username);
});

Scenario('L-007: Thieu password thi form bi chan submit', ({ I }) => {
  I.fillField(SELECTORS.username, VALID_USER.username);
  clickSubmit(I);

  assertFieldInvalid(I, SELECTORS.password);
});

Scenario('L-008: Sai password voi username ton tai', ({ I }) => {
  I.fillField(SELECTORS.username, VALID_USER.username);
  I.fillField(SELECTORS.password, 'wrong-password');
  clickSubmit(I);

  I.waitForText('Invalid username or password', 10);
  I.seeElement(SELECTORS.modal);
});

Scenario('L-009: Toggle password khong lam mat gia tri da nhap', ({ I }) => {
  I.fillField(SELECTORS.password, 'secret123');
  I.forceClick(SELECTORS.togglePassword);

  I.seeInField(SELECTORS.password, 'secret123');
});

Scenario('L-010: Dong modal bang nut close', ({ I }) => {
  I.forceClick(SELECTORS.close);

  I.waitForInvisible(SELECTORS.modal, 5);
});

Scenario('L-011: Session van duoc giu sau khi reload trang', ({ I }) => {
  loginSuccessfully(I);
  I.refreshPage();

  I.waitForElement(SELECTORS.userAvatar, 10);
  I.waitForFunction(() => Boolean(localStorage.getItem('token')), [], 5);
});

Scenario('L-012: Dang xuat xoa token va hien lai nut dang nhap', ({ I }) => {
  loginSuccessfully(I);
  I.forceClick(SELECTORS.userAvatar);
  I.waitForVisible(SELECTORS.logoutButton, 5);
  I.forceClick(SELECTORS.logoutButton);

  I.waitForFunction(() => !localStorage.getItem('token'), [], 5);
  I.waitForElement(SELECTORS.openAuthButton, 10);
});
