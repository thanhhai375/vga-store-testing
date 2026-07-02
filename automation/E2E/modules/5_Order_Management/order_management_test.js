const assert = require('assert');

Feature('Auto test - FE Order Management');

// ============================================================
// 1. Cau hinh dung chung
// ============================================================

const ADMIN_FE_URL = process.env.ADMIN_FE_URL || 'http://localhost:5174';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'hai123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hai123';

/*
 * Mac dinh bo test KHONG thay doi du lieu that.
 * Muon chay luong cap nhat trang thai that, dat:
 * ORDER_E2E_ALLOW_UPDATE=true
 */
const ALLOW_ORDER_MUTATION =
  String(process.env.ORDER_E2E_ALLOW_UPDATE).toLowerCase() === 'true';

const URLS = {
  login: `${ADMIN_FE_URL}/login`,
  orders: `${ADMIN_FE_URL}/orders`,
};

// Selector bam sat giao dien that trong Orders.jsx.
const SELECTORS = {
  login: {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    submit: 'button.login-btn',
  },

  layout: '.admin-layout',
  sidebarOrderLink: 'a.nav-item[href="/orders"]',
  activeSidebarOrderLink: 'a.nav-item.active[href="/orders"]',

  page: {
    header: '.page-header',
    title: '.page-title',
    subtitle: '.page-subtitle',
    card: '.card',
    toolbar: '.toolbar',
  },

  loading: '.spinner',
  filter: '.toolbar select.form-control',

  table: {
    root: '.table-wrapper table',
    headers: '.table-wrapper table thead th',
    rows: '.table-wrapper table tbody tr',
    firstRowCells: '.table-wrapper table tbody tr:first-child td',
    emptyCell: '.table-wrapper table tbody td[colspan="7"]',

    orderCodes: '.table-wrapper table tbody tr td:nth-child(1) strong',
    customerCells: '.table-wrapper table tbody tr td:nth-child(2)',
    phoneCells: '.table-wrapper table tbody tr td:nth-child(3)',
    totalCells: '.table-wrapper table tbody tr td:nth-child(4)',
    statusBadges: '.table-wrapper table tbody tr td:nth-child(5) .badge',
    dateCells: '.table-wrapper table tbody tr td:nth-child(6)',

    pendingPaymentRows: '.table-wrapper table tbody tr.row-pending-payment',
    pendingPaymentBadges:
      '.table-wrapper table tbody tr .badge-payment-pending',
    confirmPaymentButtons:
      '.table-wrapper table tbody .btn-confirm-payment',

    statusSelects: '.table-wrapper table tbody .status-select',
    enabledStatusSelects:
      '.table-wrapper table tbody .status-select:not([disabled])',
    disabledStatusSelects:
      '.table-wrapper table tbody .status-select:disabled',

    approveCancelButtons: '.table-wrapper table tbody .btn-approve',
    rejectCancelButtons: '.table-wrapper table tbody .btn-reject',
  },

  modal: {
    overlay: '.admin-modal-overlay',
    box: '.admin-modal-box',
    title: '.admin-modal-header h3',
    close: '.admin-modal-header .close-btn',
    print: '.admin-modal-header .btn-print',
    body: '.admin-modal-body',
    customerInfo: '.admin-info-box',
    itemsTable: '.admin-items-table',
    itemHeaders: '.admin-items-table thead th',
    total: '.admin-modal-total',
  },

  sweetAlert: {
    popup: '.swal2-popup',
    title: '.swal2-title',
    html: '.swal2-html-container',
    confirm: '.swal2-confirm',
    cancel: '.swal2-cancel',
  },
};

const STATUS_CASES = [
  { value: 'PENDING', label: 'Chờ xử lý' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Hoàn thành' },
  { value: 'CANCEL_REQUESTED', label: 'Khách Yêu Cầu Hủy' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const STATUS_SELECT_OPTIONS = [
  'Chờ xử lý',
  'Đã xác nhận',
  'Đang giao',
  'Hoàn thành',
  'Đã hủy',
];

// ============================================================
// 2. Ham ho tro
// ============================================================

function normalizeText(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function normalizeUpper(value) {
  return normalizeText(value).toLocaleUpperCase('vi-VN');
}

/**
 * Doi bang tai xong.
 * Chi doi spinner khi spinner dang hien de tranh lam moi test cham 5 giay.
 */
async function waitForOrdersTable(I) {
  const loadingVisible = await I.grabNumberOfVisibleElements(SELECTORS.loading);

  if (loadingVisible > 0) {
    I.waitForInvisible(SELECTORS.loading, 15);
  }

  I.waitForElement(SELECTORS.table.root, 15);
  I.wait(0.4);
}

/**
 * Dang nhap Admin neu trinh duyet chua co phien.
 */
async function loginAsAdmin(I) {
  I.amOnPage(URLS.orders);
  I.waitForElement('body', 10);
  I.wait(0.5);

  const loginVisible = await I.grabNumberOfVisibleElements(
    SELECTORS.login.username
  );

  if (loginVisible > 0) {
    I.fillField(SELECTORS.login.username, ADMIN_USERNAME);
    I.fillField(SELECTORS.login.password, ADMIN_PASSWORD);
    I.click(SELECTORS.login.submit);

    I.waitForElement(SELECTORS.layout, 15);
  }
}

/**
 * Mo trang Order Management va dua bo loc ve Tat ca trang thai.
 */
async function openOrdersPage(I) {
  await loginAsAdmin(I);

  I.amOnPage(URLS.orders);
  I.waitForElement(SELECTORS.page.title, 15);
  I.see('Đơn hàng', SELECTORS.page.title);

  await waitForOrdersTable(I);

  const filterValue = await I.grabValueFrom(SELECTORS.filter);
  if (filterValue !== '') {
    I.selectOption(SELECTORS.filter, '');
    await waitForOrdersTable(I);
  }
}

/**
 * Kiem tra bang dang hien empty state hay khong.
 */
async function isEmptyState(I) {
  return (
    (await I.grabNumberOfVisibleElements(SELECTORS.table.emptyCell)) > 0
  );
}

/**
 * Loc theo trang thai va doi bang tai lai.
 */
async function selectStatusFilter(I, statusValue) {
  I.selectOption(SELECTORS.filter, statusValue);
  await waitForOrdersTable(I);

  const selectedValue = await I.grabValueFrom(SELECTORS.filter);
  assert.strictEqual(
    selectedValue,
    statusValue,
    `Bo loc khong nhan gia tri ${statusValue}`
  );
}

/**
 * Kiem tra ket qua loc.
 * Neu database khong co du lieu trang thai do, UI phai hien empty state.
 */
async function assertFilteredStatus(I, statusValue, expectedLabel) {
  await selectStatusFilter(I, statusValue);

  if (await isEmptyState(I)) {
    I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
    I.say(`Khong co du lieu trang thai: ${expectedLabel}`);
    return;
  }

  const statusTexts = (
    await I.grabTextFromAll(SELECTORS.table.statusBadges)
  ).map(normalizeText);

  assert.ok(
    statusTexts.length > 0,
    `Khong tim thay badge trang thai ${expectedLabel}`
  );

  statusTexts.forEach((text) => {
    assert.strictEqual(
      text,
      expectedLabel,
      `Bo loc ${expectedLabel} tra ve dong co trang thai ${text}`
    );
  });
}

/**
 * Mo chi tiet don hang dau tien.
 * Tra ve false neu database khong co don hang.
 */
async function openFirstOrderDetails(I) {
  if (await isEmptyState(I)) {
    I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
    I.say('Database chua co don hang de mo chi tiet.');
    return false;
  }

  I.click(locate(SELECTORS.table.rows).first());
  I.waitForElement(SELECTORS.modal.overlay, 10);
  I.waitForText('Chi tiết đơn hàng', 10, SELECTORS.modal.title);
  I.waitForElement(SELECTORS.modal.customerInfo, 15);

  return true;
}

/**
 * Dong SweetAlert bang nut Huy de khong thay doi du lieu that.
 */
async function cancelSweetAlert(I) {
  I.seeElement(SELECTORS.sweetAlert.confirm);
  I.seeElement(SELECTORS.sweetAlert.cancel);

  I.click(SELECTORS.sweetAlert.cancel);
  I.waitForInvisible(SELECTORS.sweetAlert.popup, 5);
}

// ============================================================
// 3. Tien dieu kien cho tung test
// ============================================================

Before(async ({ I }) => {
  await openOrdersPage(I);
});

// ============================================================
// NHOM A - Bao mat, dang nhap va dieu huong
// ============================================================

Scenario(
  'ORD_UI_01 - Chua dang nhap phai bi chuyen ve trang login',
  async ({ I }) => {
    // Xoa session Admin tren trinh duyet.
    I.executeScript(() => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    });

    // Mo lai route bao ve de ung dung doc localStorage rong.
    I.amOnPage(URLS.orders);

    I.waitForElement(SELECTORS.login.username, 10);
    I.seeInCurrentUrl('/login');
    I.see('Đăng nhập quản trị');
  }
);

Scenario(
  'ORD_UI_02 - Admin dang nhap va truy cap trang don hang thanh cong',
  ({ I }) => {
    I.seeInCurrentUrl('/orders');
    I.see('Đơn hàng', SELECTORS.page.title);
    I.see('Theo dõi và xử lý đơn hàng', SELECTORS.page.subtitle);
    I.seeElement(SELECTORS.activeSidebarOrderLink);
  }
);

// ============================================================
// NHOM B - Kiem tra giao dien danh sach don hang
// ============================================================

Scenario(
  'ORD_UI_03 - Hien thi day du thanh phan chinh cua trang',
  ({ I }) => {
    I.seeElement(SELECTORS.page.header);
    I.seeElement(SELECTORS.page.card);
    I.seeElement(SELECTORS.page.toolbar);
    I.seeElement(SELECTORS.filter);
    I.seeElement(SELECTORS.table.root);
    I.seeElement(SELECTORS.sidebarOrderLink);
  }
);

Scenario(
  'ORD_UI_04 - Hien thi dung 7 cot cua bang don hang',
  async ({ I }) => {
    // Chuan hoa chu hoa/thuong de test noi dung, khong fail vi CSS text-transform.
    const actualHeaders = (
      await I.grabTextFromAll(SELECTORS.table.headers)
    ).map(normalizeUpper);

    const expectedHeaders = [
      '#MÃ ĐƠN',
      'KHÁCH HÀNG',
      'SĐT',
      'TỔNG TIỀN',
      'TRẠNG THÁI',
      'NGÀY ĐẶT',
      'HÀNH ĐỘNG',
    ];

    assert.deepStrictEqual(
      actualHeaders,
      expectedHeaders,
      'Bang Order Management thieu cot hoac sai thu tu cot'
    );
  }
);

Scenario(
  'ORD_UI_05 - Du lieu dong don hang dung dinh dang hien thi',
  async ({ I }) => {
    if (await isEmptyState(I)) {
      I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
      return;
    }

    const firstRowCellCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.firstRowCells
    );
    assert.strictEqual(
      firstRowCellCount,
      7,
      'Moi dong don hang phai co dung 7 cot'
    );

    const orderCode = normalizeText(
      await I.grabTextFrom(locate(SELECTORS.table.orderCodes).first())
    );
    const phone = normalizeText(
      await I.grabTextFrom(locate(SELECTORS.table.phoneCells).first())
    );
    const total = normalizeText(
      await I.grabTextFrom(locate(SELECTORS.table.totalCells).first())
    );
    const orderDate = normalizeText(
      await I.grabTextFrom(locate(SELECTORS.table.dateCells).first())
    );

    assert.match(
      orderCode,
      /^(VGA-|#)\S+/,
      `Ma don hang sai dinh dang: ${orderCode}`
    );

    assert.ok(
      phone === '--' || /^\d{9,11}$/.test(phone.replace(/\s+/g, '')),
      `So dien thoai sai dinh dang: ${phone}`
    );

    assert.ok(
      total === '--' || /^\d{1,3}(?:\.\d{3})*đ$/.test(total),
      `Tong tien sai dinh dang: ${total}`
    );

    assert.ok(
      orderDate === '--' || /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(orderDate),
      `Ngay dat sai dinh dang: ${orderDate}`
    );
  }
);

Scenario(
  'ORD_UI_06 - Dropdown bo loc co day du trang thai',
  async ({ I }) => {
    const optionTexts = (
      await I.grabTextFromAll(`${SELECTORS.filter} option`)
    ).map(normalizeText);

    const expectedOptions = [
      'Tất cả trạng thái',
      ...STATUS_CASES.map((status) => status.label),
    ];

    assert.deepStrictEqual(
      optionTexts,
      expectedOptions,
      'Danh sach trang thai trong bo loc khong dung'
    );
  }
);

// ============================================================
// NHOM C - Kiem thu bo loc trang thai
// ============================================================

Scenario(
  'ORD_UI_07 - Chon Tat ca trang thai hien thi bang hoac empty state',
  async ({ I }) => {
    await selectStatusFilter(I, '');

    I.seeElement(SELECTORS.table.root);
    I.seeElement(SELECTORS.table.rows);
  }
);

STATUS_CASES.forEach(({ value, label }, index) => {
  const testNumber = String(index + 8).padStart(2, '0');

  Scenario(
    `ORD_UI_${testNumber} - Loc don hang trang thai ${label}`,
    async ({ I }) => {
      await assertFilteredStatus(I, value, label);
    }
  );
});

// ============================================================
// NHOM D - Chi tiet don hang
// ============================================================

Scenario('ORD_UI_14 - Mo modal chi tiet don hang', async ({ I }) => {
  const opened = await openFirstOrderDetails(I);
  if (!opened) return;

  I.seeElement(SELECTORS.modal.box);
  I.seeElement(SELECTORS.modal.customerInfo);

  // Chuan hoa chu hoa/thuong vi giao dien hien THONG TIN KHACH HANG
  const customerInfoText = String(
    await I.grabTextFrom(SELECTORS.modal.customerInfo)
  )
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleUpperCase('vi-VN');

  assert.ok(
    customerInfoText.includes('THÔNG TIN KHÁCH HÀNG'),
    `Modal thieu muc THONG TIN KHACH HANG. Noi dung thuc te: ${customerInfoText}`
  );

  I.seeElement(SELECTORS.modal.itemsTable);
  I.seeElement(SELECTORS.modal.total);
  I.seeElement(SELECTORS.modal.print);
});

Scenario(
  'ORD_UI_15 - Modal chi tiet co dung cot san pham va tong tien',
  async ({ I }) => {
    const opened = await openFirstOrderDetails(I);
    if (!opened) return;

    const itemHeaders = (
      await I.grabTextFromAll(SELECTORS.modal.itemHeaders)
    ).map(normalizeUpper);

    assert.deepStrictEqual(
      itemHeaders,
      ['SẢN PHẨM', 'SL', 'ĐƠN GIÁ'],
      'Bang san pham trong modal bi thieu cot'
    );

    const totalText = normalizeText(
      await I.grabTextFrom(SELECTORS.modal.total)
    );

    assert.match(
      totalText,
      /Tổng tiền:\s*(?:\d{1,3}(?:\.\d{3})*đ|0đ)/i,
      `Tong tien trong modal sai dinh dang: ${totalText}`
    );
  }
);

Scenario(
  'ORD_UI_16 - Dong modal chi tiet bang nut X',
  async ({ I }) => {
    const opened = await openFirstOrderDetails(I);
    if (!opened) return;

    I.click(SELECTORS.modal.close);
    I.waitForInvisible(SELECTORS.modal.overlay, 5);
    I.dontSeeElement(SELECTORS.modal.overlay);
  }
);

// ============================================================
// NHOM E - Thanh toan va cap nhat trang thai
// ============================================================

Scenario(
  'ORD_UI_17 - Don cho thanh toan hien badge va nut Xac nhan TT',
  async ({ I }) => {
    await selectStatusFilter(I, 'PENDING');

    const buttonCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.confirmPaymentButtons
    );

    if (buttonCount === 0) {
      I.say('Khong co don cho thanh toan de kiem tra.');
      I.seeElement(SELECTORS.table.root);
      return;
    }

    I.seeElement(
      '.table-wrapper table tbody tr.row-pending-payment'
    );

    // Co the co nhieu don dang CHO TT
    const paymentBadgeTexts = (
      await I.grabTextFromAll(
        '.table-wrapper table tbody tr .badge-payment-pending'
      )
    ).map((text) =>
      String(text)
        .trim()
        .toLocaleUpperCase('vi-VN')
    );

    assert.ok(
      paymentBadgeTexts.length > 0,
      'Khong tim thay badge CHO TT'
    );

    paymentBadgeTexts.forEach((text) => {
      assert.strictEqual(
        text,
        'CHỜ TT',
        `Badge thanh toan hien sai noi dung: ${text}`
      );
    });

    assert.ok(
      buttonCount > 0,
      'Don cho thanh toan khong co nut Xac nhan TT'
    );
  }
);

Scenario(
  'ORD_UI_18 - Mo va huy xac nhan da nhan tien',
  async ({ I }) => {
    await selectStatusFilter(I, 'PENDING');

    const buttonCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.confirmPaymentButtons
    );

    if (buttonCount === 0) {
      I.say('Khong co don PENDING + UNPAID de mo modal Xac nhan TT.');
      return;
    }

    I.click(locate(SELECTORS.table.confirmPaymentButtons).first());
    I.waitForElement(SELECTORS.sweetAlert.popup, 5);

    I.see('Xác nhận đã nhận tiền?', SELECTORS.sweetAlert.title);
    I.see(
      'Đơn hàng sẽ chuyển sang trạng thái Đã xác nhận',
      SELECTORS.sweetAlert.html
    );

    // Bam Huy de test an toan, khong thay doi database.
    await cancelSweetAlert(I);
  }
);

Scenario(
  'ORD_UI_19 - Dropdown cap nhat co dung cac trang thai cho phep',
  async ({ I }) => {
    const enabledSelectCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.enabledStatusSelects
    );

    if (enabledSelectCount === 0) {
      I.say('Khong co don hang cho phep cap nhat trang thai.');
      return;
    }

    const optionTexts = (
      await I.grabTextFromAll(
        `${SELECTORS.table.enabledStatusSelects} option`
      )
    ).map(normalizeText);

    const uniqueOptionTexts = [...new Set(optionTexts)];

    assert.deepStrictEqual(
      uniqueOptionTexts,
      STATUS_SELECT_OPTIONS,
      'Dropdown cap nhat trang thai co lua chon sai'
    );

    assert.ok(
      !uniqueOptionTexts.includes('Khách Yêu Cầu Hủy'),
      'CANCEL_REQUESTED khong duoc la lua chon cap nhat truc tiep cua Admin'
    );
  }
);

Scenario(
  'ORD_UI_20 - Mo va huy xac nhan Huy don hang',
  async ({ I }) => {
    const enabledSelectCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.enabledStatusSelects
    );

    if (enabledSelectCount === 0) {
      I.say('Khong co don hang cho phep doi sang Da huy.');
      return;
    }

    I.selectOption(
      locate(SELECTORS.table.enabledStatusSelects).first(),
      'CANCELLED'
    );

    I.waitForElement(SELECTORS.sweetAlert.popup, 5);
    I.see('Hủy đơn hàng?', SELECTORS.sweetAlert.title);
    I.see('Số lượng sản phẩm sẽ được tự động hoàn về kho', SELECTORS.sweetAlert.html);

    // Bam Huy de giu nguyen du lieu that.
    await cancelSweetAlert(I);
  }
);

Scenario(
  'ORD_UI_21 - Don Khach Yeu Cau Huy co nut Duyet va Tu choi',
  async ({ I }) => {
    await selectStatusFilter(I, 'CANCEL_REQUESTED');

    if (await isEmptyState(I)) {
      I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
      return;
    }

    const rowCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.rows
    );
    const approveCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.approveCancelButtons
    );
    const rejectCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.rejectCancelButtons
    );

    assert.strictEqual(
      approveCount,
      rowCount,
      'Moi don yeu cau huy phai co nut Duyet Huy'
    );
    assert.strictEqual(
      rejectCount,
      rowCount,
      'Moi don yeu cau huy phai co nut Tu choi'
    );
  }
);

// ============================================================
// NHOM F - Trang thai ket thuc va do on dinh
// ============================================================

Scenario(
  'ORD_UI_22 - Don Hoan thanh khong cho cap nhat trang thai',
  async ({ I }) => {
    await selectStatusFilter(I, 'DELIVERED');

    if (await isEmptyState(I)) {
      I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
      return;
    }

    const rowCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.rows
    );
    const disabledSelectCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.disabledStatusSelects
    );

    assert.strictEqual(
      disabledSelectCount,
      rowCount,
      'Don Hoan thanh van cho phep thay doi trang thai'
    );
  }
);

Scenario(
  'ORD_UI_23 - Don Da huy khong cho cap nhat trang thai',
  async ({ I }) => {
    await selectStatusFilter(I, 'CANCELLED');

    if (await isEmptyState(I)) {
      I.see('Không có đơn hàng', SELECTORS.table.emptyCell);
      return;
    }

    const rowCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.rows
    );
    const disabledSelectCount = await I.grabNumberOfVisibleElements(
      SELECTORS.table.disabledStatusSelects
    );

    assert.strictEqual(
      disabledSelectCount,
      rowCount,
      'Don Da huy van cho phep thay doi trang thai'
    );
  }
);

Scenario(
  'ORD_UI_24 - Refresh trang van giu duoc phien Admin',
  ({ I }) => {
    I.refreshPage();
    I.waitForElement(SELECTORS.page.title, 15);

    I.seeInCurrentUrl('/orders');
    I.see('Đơn hàng', SELECTORS.page.title);
    I.seeElement(SELECTORS.table.root);
    I.dontSeeElement(SELECTORS.login.username);
  }
);

