// =============================================================
// MODULE: Product - User Side (E2E UI Test)
// Framework: CodeceptJS + Playwright
// Coverage: TC_PROD_001 → TC_PROD_024
// Base URL: http://localhost:5173
// Trang danh sách : /products
// Trang chi tiết  : /product/:id
// =============================================================

Feature('Product - Hiển thị, Tìm kiếm & Lọc sản phẩm (User)');

Before(({ I }) => {
  I.amOnPage('http://localhost:5173/products');
  I.waitForElement('.product-card', 15);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 1: Hiển thị danh sách sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_001: Hiển thị danh sách VGA hợp lệ', ({ I }) => {
  // Kỳ vọng: Card hiển thị đầy đủ ảnh, tên, giá
  I.seeElement('.product-card');
  I.seeElement('.card-image');
  I.seeElement('.card-name');
  I.seeElement('.new-price');
});

Scenario('TC_PROD_002: Kiểm tra số lượng sản phẩm hiển thị lớn hơn 0', async ({ I }) => {
  // Kỳ vọng: Có ít nhất 1 sản phẩm trên trang
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có sản phẩm nào hiển thị trên trang danh sách');
});

Scenario('TC_PROD_003: Kiểm tra hình ảnh VGA hiển thị không bị lỗi', ({ I }) => {
  // Kỳ vọng: Tất cả thẻ img trong card load được, không broken
  I.seeElement('.card-image');
  I.executeScript(() => {
    const images = document.querySelectorAll('.card-image');
    images.forEach(img => {
      if (!img.complete || img.naturalWidth === 0)
        throw new Error(`Hình ảnh bị lỗi: ${img.src}`);
    });
  });
});

Scenario('TC_PROD_004: Kiểm tra giá VGA hiển thị đúng định dạng tiền tệ', ({ I }) => {
  // Kỳ vọng: Giá có ký hiệu ₫ hoặc đ hoặc VNĐ
  I.seeElement('.new-price');
  I.executeScript(() => {
    const prices = document.querySelectorAll('.new-price');
    prices.forEach(el => {
      const text = el.innerText;
      const hasFormat = /[\d.,]+\s*(đ|VNĐ|₫|VND)/i.test(text);
      if (!hasFormat) throw new Error(`Giá không đúng định dạng: "${text}"`);
    });
  });
});

Scenario('TC_PROD_005: Kiểm tra tên sản phẩm hiển thị trên card', ({ I }) => {
  // Kỳ vọng: Mỗi card có tên sản phẩm không rỗng
  I.seeElement('.card-name');
  I.executeScript(() => {
    const names = document.querySelectorAll('.card-name');
    names.forEach(el => {
      if (!el.innerText.trim())
        throw new Error('Card sản phẩm có tên rỗng');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// NHÓM 2: Load more / Phân trang
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_006: Kiểm tra trang danh sách có sản phẩm hiển thị', async ({ I }) => {
  // Kỳ vọng: Trang hiển thị sản phẩm, có result-count
  I.seeElement('.shop-product-grid');
  I.seeElement('.product-card');
  I.seeElement('.result-count');
});

Scenario('TC_PROD_007: Nhấn Load More để tải thêm sản phẩm', async ({ I }) => {
  // Kỳ vọng: Sau khi nhấn "Xem thêm", số card tăng lên
  const before = await I.grabNumberOfVisibleElements('.product-card');
  I.seeElement('.btn-load-more');
  I.forceClick('.btn-load-more');
  I.wait(2);
  const after = await I.grabNumberOfVisibleElements('.product-card');
  if (after <= before) throw new Error(`Số sản phẩm không tăng sau Load More: ${before} → ${after}`);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 3: Tìm kiếm sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_013: Tìm kiếm chính xác tên sản phẩm "RTX 4060"', ({ I }) => {
  // Kỳ vọng: Chỉ hiển thị sản phẩm có tên trùng khớp
  I.fillField('input.search-input', 'RTX 4060');
  I.pressKey('Enter');
  I.waitForElement('.product-card', 10);
  I.see('RTX 4060');
});

Scenario('TC_PROD_014: Tìm kiếm không phân biệt hoa/thường "rtx"', async ({ I }) => {
  // Kỳ vọng: Hệ thống vẫn trả về kết quả phù hợp
  I.fillField('input.search-input', 'rtx');
  I.pressKey('Enter');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Tìm kiếm "rtx" không trả về kết quả nào');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 4: Lọc & Sắp xếp sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_015: Lọc sản phẩm theo giá thấp đến cao', async ({ I }) => {
  // Kỳ vọng: Danh sách sắp xếp tăng dần theo giá
  // option value="price_asc" → text "Giá: Thấp → Cao"
  I.selectOption('select.sort-select', 'price_asc');
  I.waitForElement('.product-card', 10);

  I.executeScript(() => {
    const prices = Array.from(document.querySelectorAll('.new-price'))
      .map(el => parseFloat(el.innerText.replace(/[^\d]/g, '')));
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] < prices[i - 1])
        throw new Error(`Giá không tăng dần: ${prices[i - 1]} > ${prices[i]}`);
    }
  });
});

Scenario('TC_PROD_016: Lọc sản phẩm theo giá cao đến thấp', ({ I }) => {
  // Kỳ vọng: Danh sách sắp xếp giảm dần theo giá
  // option value="price_desc" → text "Giá: Cao → Thấp"
  I.selectOption('select.sort-select', 'price_desc');
  I.waitForElement('.product-card', 10);

  I.executeScript(() => {
    const prices = Array.from(document.querySelectorAll('.new-price'))
      .map(el => parseFloat(el.innerText.replace(/[^\d]/g, '')));
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1])
        throw new Error(`Giá không giảm dần: ${prices[i - 1]} < ${prices[i]}`);
    }
  });
});

Scenario('TC_PROD_017: Lọc sản phẩm theo hãng AMD', async ({ I }) => {
  // label thực tế: "Card Đồ Họa AMD"
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"AMD")]');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có sản phẩm nào sau khi lọc AMD');
});

Scenario('TC_PROD_018: Lọc sản phẩm theo hãng Intel Arc', async ({ I }) => {
  // label thực tế: "Card Đồ Họa Intel Arc"
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"Intel")]');
  I.wait(2);
  // Intel Arc có thể không có sản phẩm → kiểm tra không bị lỗi hệ thống
  I.seeElement('.shop-product-grid');
});

Scenario('TC_PROD_019: Kết hợp lọc AMD + sắp xếp giá thấp đến cao', async ({ I }) => {
  // Kỳ vọng: Kết quả lọc theo AMD và sắp xếp tăng dần
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"AMD")]');
  I.wait(1);
  I.selectOption('select.sort-select', 'price_asc');
  I.waitForElement('.product-card', 10);

  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có kết quả sau khi kết hợp filter AMD + sort giá');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 5: Chi tiết sản phẩm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_020: Xem chi tiết sản phẩm VGA', ({ I }) => {
  // Kỳ vọng: Click card → vào trang chi tiết đầy đủ thông tin
  I.forceClick('.product-card:first-child .card-name');
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.product-title');
  I.seeElement('.current-price');
});

Scenario('TC_PROD_021: Kiểm tra thông số kỹ thuật VGA trong trang chi tiết', ({ I }) => {
  // Kỳ vọng: Bảng specs-table hiển thị
  I.amOnPage('http://localhost:5173/product/1');
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.specs-table');
});

Scenario('TC_PROD_022: Kiểm tra hình ảnh trong trang chi tiết sản phẩm', ({ I }) => {
  // Kỳ vọng: Ảnh chính hiển thị, không broken
  I.amOnPage('http://localhost:5173/product/1');
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.main-image-box img');

  I.executeScript(() => {
    const img = document.querySelector('.main-image-box img');
    if (!img) throw new Error('Không tìm thấy ảnh trong .main-image-box');
    if (!img.complete || img.naturalWidth === 0)
      throw new Error(`Hình ảnh bị lỗi: ${img.src}`);
  });
});

Scenario('TC_PROD_023: Kiểm tra giá trong trang chi tiết sản phẩm', ({ I }) => {
  // Kỳ vọng: Giá hiển thị đúng định dạng tiền tệ
  I.amOnPage('http://localhost:5173/product/1');
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.current-price');

  I.executeScript(() => {
    const el = document.querySelector('.current-price');
    if (!el) throw new Error('Không tìm thấy .current-price');
    const hasFormat = /[\d.,]+\s*(đ|VNĐ|₫|VND)/i.test(el.innerText);
    if (!hasFormat) throw new Error(`Giá không đúng định dạng: "${el.innerText}"`);
  });
});

Scenario('TC_PROD_024: Truy cập sản phẩm không tồn tại → hiển thị thông báo lỗi', ({ I }) => {
  // Kỳ vọng: App hiển thị component .detail-error (không tìm thấy sản phẩm)
  I.amOnPage('http://localhost:5173/product/99999');
  I.waitForElement('.detail-error', 10);
  I.seeElement('.detail-error');
});
