// Auth test for user side using Page Object Model
const LoginPage = require('../../pages/user/LoginPage');

Feature('User Authentication');

Scenario('User can login with valid credentials @login @user', ({ I }) => {
  // Open login page
  LoginPage.open(I);

  // Verify login page visible
  LoginPage.seeLoginPage(I);

  // Perform login
  LoginPage.login(I, 'admin', 'password');

  // Verify successful login – adjust selector as needed
  I.see('Welcome', 'h1');
});
