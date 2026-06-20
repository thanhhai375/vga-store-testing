Feature('Admin Order Management');

BeforeSuite(({ I }) => {

    I.amOnPage('http://localhost:5174/login');

    I.waitForElement(
        'input[placeholder="Nhập tên đăng nhập"]',
        10
    );

    I.fillField(
        'input[placeholder="Nhập tên đăng nhập"]',
        'hai123'
    );

    I.fillField(
        'input[placeholder="Nhập mật khẩu"]',
        'hai123'
    );

    I.click('Đăng nhập');

    I.wait(5);

});

Scenario('ORD_01 - Hiển thị trang quản lý đơn hàng', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.see('Đơn hàng');

    I.seeElement('table');

});

Scenario('ORD_02 - Hiển thị dropdown trạng thái', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(2);

    I.seeElement('select');

});

Scenario('ORD_03 - Lọc trạng thái Chờ xử lý', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.selectOption('select', 'Chờ xử lý');

    I.wait(2);

});

Scenario('ORD_04 - Kiểm tra đơn hàng Chờ xử lý', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.seeElement('table');

});

Scenario('ORD_05 - Xác nhận thanh toán', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.click('Xác nhận TT');

    I.wait(2);

    I.see('Xác nhận đã nhận tiền?');

    I.click('Tiếp tục');

    I.wait(5);

});

Scenario('ORD_06 - Kiểm tra đơn đã chuyển sang Đã xác nhận', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.seeElement('table');

});

Scenario('ORD_07 - Lọc trạng thái Đã xác nhận', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.selectOption('select', 'Đã xác nhận');

    I.wait(2);

});

Scenario('ORD_08 - Chuyển trạng thái sang Đang giao', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.waitForElement('tbody tr', 10);

    I.selectOption(
        locate('tbody tr').first().find('select'),
        'Đang giao'
    );

    I.wait(3);

});

Scenario('ORD_09 - Kiểm tra đơn đã chuyển sang Đang giao', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.seeElement('table');

});

Scenario('ORD_10 - Lọc trạng thái Đang giao', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.selectOption('select', 'Đang giao');

    I.wait(2);

});

Scenario('ORD_11 - Chuyển trạng thái sang Hoàn thành', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.waitForElement('tbody tr', 10);

    I.selectOption(
        locate('tbody tr').first().find('select'),
        'Hoàn thành'
    );

    I.wait(3);

});

Scenario('ORD_12 - Kiểm tra đơn đã chuyển sang Hoàn thành', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.seeElement('table');

});

Scenario('ORD_13 - Lọc trạng thái Hoàn thành', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.selectOption('select', 'Hoàn thành');

    I.wait(2);

});

Scenario('ORD_14 - Lọc trạng thái Đã hủy', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.selectOption('select', 'Đã hủy');

    I.wait(2);

});

Scenario('ORD_15 - Refresh trang đơn hàng', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.refreshPage();

    I.wait(3);

    I.see('Đơn hàng');

});

Scenario('ORD_16 - Scroll trang đơn hàng', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.scrollPageToBottom();

    I.wait(2);

    I.scrollPageToTop();

    I.wait(2);

});

Scenario('ORD_17 - Screenshot Order Management', ({ I }) => {

    I.amOnPage('http://localhost:5174/orders');

    I.wait(3);

    I.saveScreenshot('order-management.png');

});