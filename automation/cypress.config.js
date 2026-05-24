const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Giả sử User Frontend của bạn đang chạy ở cổng Vite mặc định là 5173
    baseUrl: 'http://localhost:5173', 
    supportFile: false
  },
});
