Feature('Change Password - Authentication FE');

const {
  SELECTORS,
  uniqueUser,
  resetAuthState,
  registerByUi,
  loginByUi,
  logoutFromHeader,
  goToChangePassword,
  fillChangePasswordForm
} = require('./auth_helpers');

Before(({ I }) => {
  resetAuthState(I);
});

Scenario('FE-CP-001: Doi mat khau thanh cong va dang nhap bang mat khau moi', ({ I }) => {
  const user = uniqueUser('fe_cp_success');
  const newPassword = 'NewPass123!';

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  fillChangePasswordForm(I, user.password, newPassword, newPassword);

  I.waitForVisible(SELECTORS.alertSuccess, 10);
  logoutFromHeader(I);

  loginByUi(I, user.username, newPassword);
  I.waitForElement(SELECTORS.userAvatar, 10);
});

Scenario('FE-CP-002: Sai mat khau cu thi hien loi va khong doi mat khau', ({ I }) => {
  const user = uniqueUser('fe_cp_wrong_old');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  fillChangePasswordForm(I, 'wrong-old-password', 'NewPass123!', 'NewPass123!');

  I.waitForVisible(SELECTORS.alertError, 10);
  I.seeElement(SELECTORS.profilePasswordForm);
});

Scenario('FE-CP-003: Xac nhan mat khau moi khong khop thi bi chan tren UI', ({ I }) => {
  const user = uniqueUser('fe_cp_mismatch');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  fillChangePasswordForm(I, user.password, 'NewPass123!', 'Different123!');

  I.waitForVisible(SELECTORS.alertError, 5);
  I.seeElement(SELECTORS.profilePasswordForm);
});

Scenario('FE-CP-004: Mat khau moi qua ngan thi HTML validation chan submit', ({ I }) => {
  const user = uniqueUser('fe_cp_short');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);

  I.fillField(SELECTORS.oldPassword, user.password);
  I.fillField(SELECTORS.newPassword, '123');
  I.fillField(SELECTORS.confirmPassword, '123');
  I.forceClick(SELECTORS.profileSubmit);

  I.waitForFunction((selector) => {
    const field = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return Boolean(field && !field.checkValidity());
  }, [SELECTORS.newPassword], 5);
  I.seeElement(SELECTORS.profilePasswordForm);
});

Scenario('FE-CP-005: Bo trong cac truong doi mat khau thi form bi chan submit', ({ I }) => {
  const user = uniqueUser('fe_cp_empty');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  goToChangePassword(I);
  I.forceClick(SELECTORS.profileSubmit);

  I.waitForFunction(() => {
    const fields = [...document.querySelectorAll('.password-form-box input[type="password"]')];
    return fields.length === 3 && fields.some((field) => !field.checkValidity());
  }, [], 5);
  I.seeElement(SELECTORS.profilePasswordForm);
});
