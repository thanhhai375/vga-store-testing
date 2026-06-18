const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './E2E/**/*_test.js',
  output: './E2E/output',
  helpers: {
    Playwright: {
      url: 'http://localhost:5173',
      show: true,
      browser: 'chromium',
      restart: 'session',
      keepBrowserState: true,
      keepCookies: true,
      chromium: {
        slowMo: 1000 // Chậm lại 1 giây cho mỗi thao tác
      }
    }
  },
  include: {
    I: './E2E/steps_file.js'
  },
  name: 'automation'
}
