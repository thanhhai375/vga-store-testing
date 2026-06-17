// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    loginAsAdmin: function(username = 'hai123', password = 'hai123') {
      this.amOnPage('/login');
      this.fillField('username', username);
      this.fillField('password', password);
      this.click('Đăng nhập');
      this.wait(2);
    }

  });
}
