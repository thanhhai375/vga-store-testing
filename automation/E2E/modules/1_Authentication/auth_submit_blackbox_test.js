Feature('Auth UI Black-box Submit Behavior');

const {
  BASE_URL,
  SELECTORS,
  uniqueUser,
  resetAuthState,
  openLoginForm,
  openRegisterForm,
  fillRegisterConfirmPassword,
  registerByUi,
  loginByUi,
  goToChangePassword,
  fillChangePasswordForm
} = require('./auth_helpers');

const submitAuthForm = (I) => {
  I.waitForVisible(SELECTORS.submit, 5);
  I.forceClick(SELECTORS.submit);
};

const expectAuthModalStillOpen = (I) => {
  I.waitForVisible(SELECTORS.modal, 5);
};

const expectNoSession = (I) => {
  I.waitForFunction(() => !localStorage.getItem('token'), [], 5);
};

const expectRegisterStillEditable = (I) => {
  I.waitForVisible(SELECTORS.registerUsername, 5);
  I.waitForVisible(SELECTORS.email, 5);
  I.waitForVisible(SELECTORS.password, 5);
};

const expectPasswordFormStillOpen = (I) => {
  I.waitForVisible(SELECTORS.profilePasswordForm, 5);
};

Before(({ I }) => {
  resetAuthState(I);
});

Scenario('UI-LG-006: Login voi password qua ngan bi tu choi sau submit', ({ I }) => {
  openLoginForm(I);
  I.fillField(SELECTORS.loginUsername, 'hai123');
  I.fillField(SELECTORS.password, '123');
  submitAuthForm(I);

  expectNoSession(I);
  expectAuthModalStillOpen(I);
  I.seeInField(SELECTORS.loginUsername, 'hai123');
});

Scenario('UI-RG-010: Register voi password qua ngan bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_rg_short_pwd');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, '123');
  fillRegisterConfirmPassword(I, '123');
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
  I.seeInField(SELECTORS.registerUsername, user.username);
});

Scenario('UI-RG-011: Register voi password thieu chu hoa bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_rg_no_upper');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, 'password123!');
  fillRegisterConfirmPassword(I, 'password123!');
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
});

Scenario('UI-RG-012: Register voi password thieu chu thuong bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_rg_no_lower');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, 'PASSWORD123!');
  fillRegisterConfirmPassword(I, 'PASSWORD123!');
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
});

Scenario('UI-RG-013: Register voi password thieu so bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_rg_no_number');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, 'Password!');
  fillRegisterConfirmPassword(I, 'Password!');
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
});

Scenario('UI-RG-014: Register voi password thieu ky tu dac biet bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_rg_no_special');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, 'Password123');
  fillRegisterConfirmPassword(I, 'Password123');
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
});

Scenario('UI-RG-016: Register voi email da ton tai bi tu choi sau submit', ({ I }) => {
  const existingUser = uniqueUser('ui_rg_dup_email_src');
  const duplicateUser = uniqueUser('ui_rg_dup_email_new');

  registerByUi(I, existingUser);
  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, duplicateUser.username);
  I.fillField(SELECTORS.fullName, duplicateUser.fullName);
  I.fillField(SELECTORS.email, existingUser.email);
  I.fillField(SELECTORS.password, duplicateUser.password);
  fillRegisterConfirmPassword(I, duplicateUser.password);
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
  I.seeInField(SELECTORS.email, existingUser.email);
});

Scenario('UI-RG-018: Register fail khong xoa du lieu nguoi dung da nhap', ({ I }) => {
  const user = uniqueUser('ui_rg_keep_input');

  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, 'invalidgmail');
  I.fillField(SELECTORS.password, user.password);
  fillRegisterConfirmPassword(I, user.password);
  submitAuthForm(I);

  expectAuthModalStillOpen(I);
  expectRegisterStillEditable(I);
  I.seeInField(SELECTORS.registerUsername, user.username);
  I.seeInField(SELECTORS.fullName, user.fullName);
  I.seeInField(SELECTORS.email, 'invalidgmail');
});

Scenario('UI-CP-007: New password trung old password bi tu choi sau submit', ({ I }) => {
  const user = uniqueUser('ui_cp_same_old');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  fillChangePasswordForm(I, user.password, user.password, user.password);

  expectPasswordFormStillOpen(I);
  I.dontSeeElement(SELECTORS.openAuthButton);
});

Scenario('UI-CP-008: Doi password fail khong dong form', ({ I }) => {
  const user = uniqueUser('ui_cp_keep_form');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  fillChangePasswordForm(I, 'wrong-old-password', 'NewPass123!', 'NewPass123!');

  expectPasswordFormStillOpen(I);
});

Scenario('UI-SE-006: Token sai trong localStorage khong duoc vao profile', ({ I }) => {
  I.amOnPage(`${BASE_URL}/`);
  I.executeScript(() => {
    localStorage.setItem('token', 'invalid-token');
    localStorage.setItem('user', JSON.stringify({ username: 'fake-user' }));
  });
  I.amOnPage(`${BASE_URL}/profile`);

  I.waitForFunction(() => window.location.pathname === '/' || !document.querySelector('.profile-sidebar'), [], 10);
  I.dontSeeElement(SELECTORS.profilePasswordForm);
});
