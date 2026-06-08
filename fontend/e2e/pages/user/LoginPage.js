class LoginPage {
  // Selectors – use data-testid if possible for stability
  get usernameField() { return '#username'; }
  get passwordField() { return '#password'; }
  get submitButton()   { return '#loginBtn'; }
  get loginHeader()   { return 'h1'; }

  /**
   * Open the login page (baseUrl is defined in codecept.conf.js)
   */
  open(I) {
    I.amOnPage('/login');
  }

  /**
   * Perform login with given credentials
   */
  login(I, username, password) {
    I.fillField(this.usernameField, username);
    I.fillField(this.passwordField, password);
    I.click(this.submitButton);
  }

  /**
   * Verify that login page is displayed
   */
  seeLoginPage(I) {
    I.see('Login', this.loginHeader);
  }
}

module.exports = new LoginPage();
