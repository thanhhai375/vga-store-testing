const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
const fs = require('fs');
const localChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

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
      url: process.env.FE_URL || 'http://admin-frontend',
      show: false,
      browser: 'chromium',
      restart: 'session',
      keepBrowserState: true,
      keepCookies: true,
      chromium: {
        executablePath: fs.existsSync(localChromePath) ? localChromePath : undefined,
        slowMo: 0 // Đã tắt slowMo để test chạy nhanh hơn (trước đó là 1000ms = 1s/thao tác)
      }
    }
  },
  include: {
    I: './E2E/steps_file.js'
  },
  name: 'automation'
}
