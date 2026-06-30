const BASE_URL = process.env.USER_FE_URL || process.env.FE_URL || 'http://localhost:5173';

const SELECTORS = {
  openAuthButton: 'button[title="Dang nhap"], button[title="Đăng nhập"], button.nav-action-item',
  modal: '.auth-modal',
  loginTab: '.auth-tab:nth-child(1)',
  registerTab: '.auth-tab:nth-child(2)',
  loginUsername: 'input[placeholder="Nhập tài khoản hoặc email"]',
  registerUsername: 'input[placeholder="Nhập tên đăng nhập"]',
  fullName: 'input[placeholder="Nhập họ và tên của bạn"]',
  email: 'input[placeholder="Nhập email của bạn"]',
  password: 'input[placeholder="Nhập mật khẩu"]',
  submit: '.auth-submit-btn',
  close: '.auth-close-btn',
  userAvatar: '.user-avatar-trigger',
  logoutButton: '.logout-btn',
  profileSidebar: '.profile-sidebar',
  profileContent: '.profile-content-area',
  profilePasswordForm: '.password-form-box',
  oldPassword: '(//form[contains(@class,"password-form-box")]//input[@type="password"])[1]',
  newPassword: '(//form[contains(@class,"password-form-box")]//input[@type="password"])[2]',
  confirmPassword: '(//form[contains(@class,"password-form-box")]//input[@type="password"])[3]',
  profileSubmit: '.btn-submit-profile',
  alertSuccess: '.alert-message.success',
  alertError: '.alert-message.error'
};

const uniqueUser = (prefix = 'fe_auth') => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  return {
    username: `${prefix}_${suffix}`,
    fullName: 'FE Auth Test User',
    email: `${prefix}_${suffix}@gmail.com`,
    password: 'Pass123456!'
  };
};

const resetAuthState = (I) => {
  I.amOnPage(`${BASE_URL}/`);
  I.clearCookie();
  I.executeScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  I.refreshPage();
};

const openAuthModal = (I) => {
  I.waitForElement(SELECTORS.openAuthButton, 10);
  I.forceClick(SELECTORS.openAuthButton);
  I.waitForVisible(SELECTORS.modal, 5);
};

const openLoginForm = (I) => {
  openAuthModal(I);
  I.forceClick(SELECTORS.loginTab);
  I.waitForVisible(SELECTORS.loginUsername, 5);
};

const openRegisterForm = (I) => {
  openAuthModal(I);
  I.forceClick(SELECTORS.registerTab);
  I.waitForVisible(SELECTORS.registerUsername, 5);
};

const submitAuthForm = (I) => {
  I.waitForVisible(SELECTORS.submit, 5);
  I.forceClick(SELECTORS.submit);
};

const registerByUi = (I, user) => {
  openRegisterForm(I);
  I.fillField(SELECTORS.registerUsername, user.username);
  I.fillField(SELECTORS.fullName, user.fullName);
  I.fillField(SELECTORS.email, user.email);
  I.fillField(SELECTORS.password, user.password);
  submitAuthForm(I);
  I.waitForVisible(SELECTORS.loginUsername, 10);
};

const loginByUi = (I, username, password) => {
  openLoginForm(I);
  I.fillField(SELECTORS.loginUsername, username);
  I.fillField(SELECTORS.password, password);
  submitAuthForm(I);
  I.waitForFunction(() => Boolean(localStorage.getItem('token')), [], 20);
  I.waitForInvisible(SELECTORS.modal, 8);
};

const logoutFromHeader = (I) => {
  I.waitForElement(SELECTORS.userAvatar, 10);
  I.forceClick(SELECTORS.userAvatar);
  I.waitForVisible(SELECTORS.logoutButton, 5);
  I.forceClick(SELECTORS.logoutButton);
  I.waitForFunction(() => !localStorage.getItem('token'), [], 8);
};

const goToChangePassword = (I) => {
  I.amOnPage(`${BASE_URL}/profile?tab=password`);
  I.waitForElement(SELECTORS.profileSidebar, 15);
  I.waitForElement(SELECTORS.profilePasswordForm, 10);
};

const fillChangePasswordForm = (I, oldPassword, newPassword, confirmPassword) => {
  I.fillField(SELECTORS.oldPassword, oldPassword);
  I.fillField(SELECTORS.newPassword, newPassword);
  I.fillField(SELECTORS.confirmPassword, confirmPassword);
  I.forceClick(SELECTORS.profileSubmit);
};

module.exports = {
  BASE_URL,
  SELECTORS,
  uniqueUser,
  resetAuthState,
  openLoginForm,
  openRegisterForm,
  registerByUi,
  loginByUi,
  logoutFromHeader,
  goToChangePassword,
  fillChangePasswordForm
};
