Feature('Protected Route - Authentication FE');

const {
  BASE_URL,
  SELECTORS,
  uniqueUser,
  resetAuthState,
  registerByUi,
  loginByUi
} = require('./auth_helpers');

Before(({ I }) => {
  resetAuthState(I);
});

Scenario('FE-PR-001: Chua dang nhap truy cap profile thi bi dua ve trang chu', ({ I }) => {
  I.amOnPage(`${BASE_URL}/profile`);

  I.waitForFunction(() => window.location.pathname === '/', [], 10);
  I.waitForElement(SELECTORS.openAuthButton, 10);
  I.dontSeeElement(SELECTORS.profileSidebar);
});

Scenario('FE-PR-002: Da dang nhap truy cap profile thanh cong', ({ I }) => {
  const user = uniqueUser('fe_profile');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  I.amOnPage(`${BASE_URL}/profile`);

  I.waitForElement(SELECTORS.profileSidebar, 15);
  I.waitForElement(SELECTORS.profileContent, 10);
});

Scenario('FE-PR-003: Da dang nhap truy cap tab doi mat khau thanh cong', ({ I }) => {
  const user = uniqueUser('fe_profile_password');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  I.amOnPage(`${BASE_URL}/profile?tab=password`);

  I.waitForElement(SELECTORS.profileSidebar, 15);
  I.waitForElement(SELECTORS.profilePasswordForm, 10);
});
