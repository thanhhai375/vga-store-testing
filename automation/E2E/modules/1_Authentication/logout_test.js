Feature('Logout - Authentication FE');

const {
  BASE_URL,
  SELECTORS,
  uniqueUser,
  resetAuthState,
  registerByUi,
  loginByUi,
  logoutFromHeader
} = require('./auth_helpers');

Before(({ I }) => {
  resetAuthState(I);
});

Scenario('FE-LO-001: Dang xuat xoa token va hien lai nut dang nhap', ({ I }) => {
  const user = uniqueUser('fe_logout');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  logoutFromHeader(I);

  I.waitForElement(SELECTORS.openAuthButton, 10);
  I.dontSeeElement(SELECTORS.userAvatar);
});

Scenario('FE-LO-002: Sau logout refresh trang van khong con session', ({ I }) => {
  const user = uniqueUser('fe_logout_refresh');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  logoutFromHeader(I);
  I.refreshPage();

  I.waitForFunction(() => !localStorage.getItem('token') && !localStorage.getItem('user'), [], 8);
  I.waitForElement(SELECTORS.openAuthButton, 10);
});

Scenario('FE-LO-003: Sau logout truy cap profile bi dua ve trang chu', ({ I }) => {
  const user = uniqueUser('fe_logout_profile');

  registerByUi(I, user);
  loginByUi(I, user.username, user.password);
  logoutFromHeader(I);
  I.amOnPage(`${BASE_URL}/profile`);

  I.waitForFunction(() => window.location.pathname === '/', [], 10);
  I.waitForElement(SELECTORS.openAuthButton, 10);
});
