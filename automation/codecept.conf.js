const fs = require('fs');
const localChromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const isHeadless = String(process.env.HEADLESS).toLowerCase() === 'true';

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './E2E/**/*_test.js',
  output: './E2E/output',
  helpers: {
    Playwright: {
      url: process.env.USER_FE_URL || process.env.FE_URL || 'http://localhost:5173',
      show: !isHeadless,
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
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  },
  name: 'automation'
}
