// E2E/steps_file.js
module.exports = function() {
  return actor({

    async loginAsUser() {
      this.amOnPage('/');
      this.clearCookie();
      this.refreshPage();
      this.wait(2);

      // Kiểm tra đã login chưa (nếu đã login thì có div.user-logged-in-wrapper)
      const loggedIn = await this.grabNumberOfVisibleElements('div.user-logged-in-wrapper');
      if (loggedIn > 0) return; // Đã login rồi, bỏ qua

      // Chưa login → mở modal và đăng nhập
      this.waitForElement('button.nav-action-item[title="Đăng nhập"]', 10);
      this.click('button.nav-action-item[title="Đăng nhập"]');
      this.waitForElement('.auth-modal', 10);
      this.wait(1);
      this.waitForElement('.auth-form input[type="text"], .auth-form input[type="email"]', 10);
      this.fillField('.auth-form input[type="text"], .auth-form input[type="email"]', 'hai123');
      this.fillField('.auth-form input[type="password"]', 'hai123');
      this.click('.auth-form button[type="submit"]');
      this.waitForInvisible('.auth-modal', 10);
      this.wait(1);
    },

  });
};
