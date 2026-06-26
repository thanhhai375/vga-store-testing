// E2E/steps_file.js
module.exports = function () {
  return actor({

    // ─────────────────────────────────────────────
    // Hàm đăng nhập nhanh dùng chung cho cả team
    // ─────────────────────────────────────────────

    /**
     * Đăng nhập với tài khoản thường (user)
     * Dùng trong Before() của các test cần trạng thái đã đăng nhập
     */
    loginAsUser() {
      this.amOnPage('/');
      this.waitForElement('button[title="Đăng nhập"]', 10);
      this.forceClick('button[title="Đăng nhập"]');
      this.waitForVisible('.auth-submit-btn', 5);
      this.fillField('input[placeholder="Nhập tài khoản hoặc email"]', 'hai123');
      this.fillField('input[placeholder="Nhập mật khẩu"]', 'hai123');
      this.forceClick('.auth-submit-btn');
      this.waitForElement('.user-avatar, [data-testid="user-menu"], .header-user', 10);
    },

    /**
     * Đăng nhập với tài khoản Admin
     * Admin app chạy riêng tại ' + (process.env.ADMIN_FE_URL || 'http://localhost:5174') + '
     */
    loginAsAdmin() {
      this.amOnPage((process.env.ADMIN_FE_URL || 'http://localhost:5174') + '/login');
      this.waitForElement('input[name="username"]', 10);
      this.fillField('input[name="username"]', 'hai123');
      this.fillField('input[name="password"]', 'hai123');
      this.forceClick('.login-btn');
      // Đợi sidebar admin xuất hiện — tức là đăng nhập thành công
      this.waitForElement('.admin-layout', 10);
    },

  });
};
