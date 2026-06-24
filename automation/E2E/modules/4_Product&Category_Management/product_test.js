// =============================================================
// MODULE: Product - User Side (E2E UI Test)
// Framework: CodeceptJS + Playwright
// Coverage: TC_PROD_001 → TC_PROD_024
// Base URL: http://localhost:5173
// Backend : http://localhost:8080
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
  I.seeElement('.product-card');
  I.seeElement('.card-image');
  I.seeElement('.card-name');
  I.seeElement('.new-price');
});

Scenario('TC_PROD_002: Số lượng sản phẩm hiển thị lớn hơn 0', async ({ I }) => {
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có sản phẩm nào hiển thị');
});

Scenario('TC_PROD_003: Hình ảnh VGA không bị lỗi', ({ I }) => {
  I.seeElement('.card-image');
  I.executeScript(() => {
    document.querySelectorAll('.card-image').forEach(img => {
      if (!img.complete || img.naturalWidth === 0)
        throw new Error(`Hình ảnh bị lỗi: ${img.src}`);
    });
  });
});

Scenario('TC_PROD_004: Giá VGA đúng định dạng tiền tệ', ({ I }) => {
  I.seeElement('.new-price');
  I.executeScript(() => {
    document.querySelectorAll('.new-price').forEach(el => {
      if (!/[\d.,]+\s*(đ|VNĐ|₫|VND)/i.test(el.innerText))
        throw new Error(`Giá không đúng định dạng: "${el.innerText}"`);
    });
  });
});

Scenario('TC_PROD_005: Tên sản phẩm không rỗng trên card', ({ I }) => {
  I.seeElement('.card-name');
  I.executeScript(() => {
    document.querySelectorAll('.card-name').forEach(el => {
      if (!el.innerText.trim()) throw new Error('Card có tên sản phẩm rỗng');
    });
  });
});

// ─────────────────────────────────────────────────────────────
// NHÓM 2: Load More
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_006: Trang danh sách có sản phẩm và result-count', ({ I }) => {
  I.seeElement('.product-card');
  I.seeElement('.result-count');
});

Scenario('TC_PROD_007: Load More tải thêm sản phẩm', async ({ I }) => {
  const before = await I.grabNumberOfVisibleElements('.product-card');
  I.seeElement('.btn-load-more');
  I.forceClick('.btn-load-more');
  I.wait(2);
  const after = await I.grabNumberOfVisibleElements('.product-card');
  if (after <= before) throw new Error(`Số sản phẩm không tăng: ${before} → ${after}`);
});

// ─────────────────────────────────────────────────────────────
// NHÓM 3: Tìm kiếm
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_013: Tìm kiếm chính xác "RTX 4060"', ({ I }) => {
  I.fillField('input.search-input', 'RTX 4060');
  I.pressKey('Enter');
  I.waitForElement('.product-card', 10);
  I.see('RTX 4060');
});

Scenario('TC_PROD_014: Tìm kiếm không phân biệt hoa/thường "rtx"', async ({ I }) => {
  I.fillField('input.search-input', 'rtx');
  I.pressKey('Enter');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Tìm "rtx" không có kết quả');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 4: Lọc & Sắp xếp
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_015: Sắp xếp giá thấp → cao', ({ I }) => {
  I.selectOption('select.sort-select', 'price_asc');
  I.waitForElement('.product-card', 10);
  I.executeScript(() => {
    const prices = Array.from(document.querySelectorAll('.new-price'))
      .map(el => parseFloat(el.innerText.replace(/[^\d]/g, '')));
    for (let i = 1; i < prices.length; i++)
      if (prices[i] < prices[i - 1])
        throw new Error(`Giá không tăng dần: ${prices[i-1]} > ${prices[i]}`);
  });
});

Scenario('TC_PROD_016: Sắp xếp giá cao → thấp', ({ I }) => {
  I.selectOption('select.sort-select', 'price_desc');
  I.waitForElement('.product-card', 10);
  I.executeScript(() => {
    const prices = Array.from(document.querySelectorAll('.new-price'))
      .map(el => parseFloat(el.innerText.replace(/[^\d]/g, '')));
    for (let i = 1; i < prices.length; i++)
      if (prices[i] > prices[i - 1])
        throw new Error(`Giá không giảm dần: ${prices[i-1]} < ${prices[i]}`);
  });
});

Scenario('TC_PROD_017: Lọc hãng AMD có kết quả', async ({ I }) => {
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"AMD")]');
  I.wait(2);
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có sản phẩm AMD');
});

Scenario('TC_PROD_018: Lọc hãng Intel Arc không crash', ({ I }) => {
  // Intel Arc có thể không có sản phẩm → chỉ cần trang không crash
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"Intel")]');
  I.wait(2);
  I.seeElement('.shop-layout');
});

Scenario('TC_PROD_019: Kết hợp lọc AMD + sắp xếp giá tăng dần', async ({ I }) => {
  I.forceClick('//label[contains(@class,"filter-checkbox") and contains(.,"AMD")]');
  I.wait(1);
  I.selectOption('select.sort-select', 'price_asc');
  I.waitForElement('.product-card', 10);
  const count = await I.grabNumberOfVisibleElements('.product-card');
  if (count === 0) throw new Error('Không có kết quả sau khi kết hợp filter');
});

// ─────────────────────────────────────────────────────────────
// NHÓM 5: Chi tiết sản phẩm — dùng API để lấy ID thực tế
// ─────────────────────────────────────────────────────────────

Scenario('TC_PROD_020: Xem chi tiết sản phẩm VGA', ({ I }) => {
  I.forceClick('.product-card:first-child .card-name');
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.product-title');
  I.seeElement('.current-price');
});

// Helper dùng chung để lấy ID sản phẩm đầu tiên từ API
async function getFirstProductId(I) {
  const id = await I.executeScript(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products?size=1&page=0');
      const data = await res.json();
      // Spring Boot thường trả: { content: [...], totalElements: ... }
      // hoặc { data: { content: [...] } } hoặc { products: [...] }
      const list = data?.content || data?.data?.content || data?.products || data?.data || data;
      if (Array.isArray(list) && list.length > 0) return list[0].id;
      return null;
    } catch (e) { return null; }
  });
  return id;
}

Scenario('TC_PROD_021: Thông số kỹ thuật hiển thị trong trang chi tiết', async ({ I }) => {
  const id = await getFirstProductId(I);
  if (!id) throw new Error('Không lấy được ID sản phẩm từ API');
  I.amOnPage(`http://localhost:5173/product/${id}`);
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.specs-table');
});

Scenario('TC_PROD_022: Hình ảnh trong trang chi tiết không bị lỗi', async ({ I }) => {
  const id = await getFirstProductId(I);
  if (!id) throw new Error('Không lấy được ID sản phẩm từ API');
  I.amOnPage(`http://localhost:5173/product/${id}`);
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.main-image-box img');
  I.executeScript(() => {
    const img = document.querySelector('.main-image-box img');
    if (!img || !img.complete || img.naturalWidth === 0)
      throw new Error(`Hình ảnh bị lỗi: ${img?.src}`);
  });
});

Scenario('TC_PROD_023: Giá trong trang chi tiết đúng định dạng', async ({ I }) => {
  const id = await getFirstProductId(I);
  if (!id) throw new Error('Không lấy được ID sản phẩm từ API');
  I.amOnPage(`http://localhost:5173/product/${id}`);
  I.waitForElement('.product-detail-page', 10);
  I.seeElement('.current-price');
  I.executeScript(() => {
    const el = document.querySelector('.current-price');
    if (!el || !/[\d.,]+\s*(đ|VNĐ|₫|VND)/i.test(el.innerText))
      throw new Error(`Giá không đúng định dạng: "${el?.innerText}"`);
  });
});

Scenario('TC_PROD_024: Sản phẩm không tồn tại hiển thị lỗi', ({ I }) => {
  I.amOnPage('http://localhost:5173/product/99999');
  I.waitForElement('.detail-error', 10);
  I.seeElement('.detail-error');
});
