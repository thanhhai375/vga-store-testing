import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import { productService } from '../../services/productService';
import axiosClient from '../../api/axiosClient';
import './Shop.css';

const ITEMS_PER_PAGE = 12;

const Shop = () => {
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [selectedLines, setSelectedLines] = useState([]);
  const [selectedChipsets, setSelectedChipsets] = useState([]);
  const [selectedVRAMs, setSelectedVRAMs] = useState([]);
  const [selectedMemTypes, setSelectedMemTypes] = useState([]);
  const [selectedPSUs, setSelectedPSUs] = useState([]);
  const [selectedPorts, setSelectedPorts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const products = await productService.getAll({ size: 100 });
        setAllProducts(products);

        const brandRes = await axiosClient.get('/brands', { params: { size: 50 } });
        setBrands(brandRes?.data?.content || []);

        const catRes = await axiosClient.get('/categories', { params: { size: 50 } });
        setCategories(catRes?.data?.content || []);
      } catch (error) {
        console.error('Lỗi fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const brandParam = queryParams.get('brand');
    const categoryParam = queryParams.get('cat');
    const chipsetBrandParam = queryParams.get('chipsetBrand');
    const chipsetParam = queryParams.get('chipset');
    const vramParam = queryParams.get('vram');
    const memTypeParam = queryParams.get('memType');

    const lineParam = queryParams.get('line') || queryParams.get('series');
    const psuParam = queryParams.get('psu');
    const priceParam = queryParams.get('price');

    if (brandParam) setSelectedBrands([brandParam]); else setSelectedBrands([]);

    if (categoryParam) {
      const matchedCat = categories.find(
        c => c.name.toLowerCase() === categoryParam.toLowerCase() ||
          c.name.toLowerCase() === categoryParam.replace('-', ' ').toLowerCase()
      );
      if (matchedCat) setSelectedCategories([matchedCat.name]);
      else setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }

    if (chipsetBrandParam) setSelectedChipsets([chipsetBrandParam]);
    else if (chipsetParam) setSelectedChipsets([chipsetParam]);
    else setSelectedChipsets([]);

    if (vramParam) setSelectedVRAMs([vramParam]); else setSelectedVRAMs([]);
    if (memTypeParam) setSelectedMemTypes([memTypeParam]); else setSelectedMemTypes([]);
    if (lineParam) setSelectedLines([lineParam]); else setSelectedLines([]);
    if (psuParam) setSelectedPSUs([psuParam]); else setSelectedPSUs([]);
    if (priceParam) setPriceRange(priceParam); else setPriceRange('all');

    setDisplayCount(ITEMS_PER_PAGE);
  }, [location.search, categories]);

  const toggleArrayItem = (array, item) => array.includes(item) ? array.filter(v => v !== item) : [...array, item];

  const handleBrandChange = (val) => { setSelectedBrands(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handleCategoryChange = (val) => { setSelectedCategories(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handleLineChange = (val) => { setSelectedLines(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handleChipsetChange = (val) => { setSelectedChipsets(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handleVRAMChange = (val) => { setSelectedVRAMs(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handleMemTypeChange = (val) => { setSelectedMemTypes(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handlePSUChange = (val) => { setSelectedPSUs(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handlePortChange = (val) => { setSelectedPorts(prev => toggleArrayItem(prev, val)); setDisplayCount(ITEMS_PER_PAGE); };
  const handlePriceChange = (val) => { setPriceRange(val); setDisplayCount(ITEMS_PER_PAGE); };

  const handleResetSidebar = () => {
    setSelectedBrands([]); setSelectedCategories([]); setSelectedLines([]);
    setSelectedChipsets([]); setSelectedVRAMs([]); setSelectedMemTypes([]);
    setSelectedPSUs([]); setSelectedPorts([]); setPriceRange('all');
    setSearchTerm(''); setDisplayCount(ITEMS_PER_PAGE);
  };

  let displayProducts = allProducts.filter((product) => {
    const nameUpper = (product.name || '').toUpperCase();
    const descUpper = (product.description || '').toUpperCase();
    const fullText = nameUpper + ' ' + descUpper;

    const matchName = fullText.includes(searchTerm.toUpperCase());
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.name);
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category?.name);

    let matchPrice = true;
    const p = Number(product.price);
    if (priceRange === 'under10') matchPrice = p < 10_000_000;
    else if (priceRange === '10to20') matchPrice = p >= 10_000_000 && p < 20_000_000;
    else if (priceRange === '20to40') matchPrice = p >= 20_000_000 && p < 40_000_000;
    else if (priceRange === 'above40') matchPrice = p >= 40_000_000;

    let matchLine = true;
    if (selectedLines.length > 0) { matchLine = selectedLines.some(line => nameUpper.includes(line.toUpperCase())); }

    let matchChipset = true;
    if (selectedChipsets.length > 0) {
      matchChipset = selectedChipsets.some(chip => {
        if (chip === 'NVIDIA') return nameUpper.includes('RTX') || nameUpper.includes('GTX') || nameUpper.includes('NVIDIA');
        if (chip === 'AMD') return nameUpper.includes('RX ') || nameUpper.includes('RADEON') || nameUpper.includes('AMD');
        if (chip === 'Intel') return nameUpper.includes('ARC') || nameUpper.includes('INTEL');
        return nameUpper.includes(chip.toUpperCase());
      });
    }

    let matchVRAM = true;
    if (selectedVRAMs.length > 0) {
      matchVRAM = selectedVRAMs.some(vram => {
        const v1 = vram.toUpperCase();
        const v2 = v1.replace('GB', 'G');
        return nameUpper.includes(v1) || nameUpper.includes(` ${v2}`);
      });
    }

    let matchMem = true;
    if (selectedMemTypes.length > 0) {
      matchMem = selectedMemTypes.some(mem => fullText.includes(mem.toUpperCase()));
    }

    let matchPSU = true;
    if (selectedPSUs.length > 0) {
      matchPSU = selectedPSUs.some(psu => fullText.includes(psu.toUpperCase()));
    }

    let matchPort = true;
    if (selectedPorts.length > 0) {
      matchPort = selectedPorts.some(port => fullText.includes(port.toUpperCase()));
    }

    return matchName && matchBrand && matchCategory && matchPrice && matchLine && matchChipset && matchVRAM && matchMem && matchPSU && matchPort;
  });

  if (sortOrder === 'price_asc') {
    displayProducts = [...displayProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder === 'price_desc') {
    displayProducts = [...displayProducts].sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortOrder === 'name_asc') {
    displayProducts = [...displayProducts].sort((a, b) => a.name?.localeCompare(b.name));
  }

  const visibleProducts = displayProducts.slice(0, displayCount);
  const hasMore = displayCount < displayProducts.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + ITEMS_PER_PAGE);
      setLoadingMore(false);
    }, 400);
  };

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container shop-hero-inner">
          <div className="shop-hero-text">
            <span className="shop-hero-badge">SẢN PHẨM</span>
            <h1 className="shop-hero-title">Khám Phá Toàn Bộ <br /><span>Linh Kiện PC</span></h1>
            <p className="shop-hero-desc">Bổ sung sức mạnh cho cỗ máy của bạn</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside className="shop-sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-main-title">BỘ LỌC TÌM KIẾM</h3>
              <button className="sidebar-reset-btn" onClick={handleResetSidebar}>Xóa tất cả</button>
            </div>

            {categories.length > 0 && (
              <details className="sidebar-section" open>
                <summary className="sidebar-title">Danh Mục</summary>
                <div className="sidebar-content">
                  {categories.map(c => (
                    <label key={c.id} className="filter-checkbox">
                      <input type="checkbox" checked={selectedCategories.includes(c.name)} onChange={() => handleCategoryChange(c.name)} />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </details>
            )}

            <details className="sidebar-section" open>
              <summary className="sidebar-title">Thương Hiệu</summary>
              <div className="sidebar-content">
                {brands.map(b => (
                  <label key={b.id} className="filter-checkbox">
                    <input type="checkbox" checked={selectedBrands.includes(b.name)} onChange={() => handleBrandChange(b.name)} />
                    <span>{b.name}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section" open>
              <summary className="sidebar-title">Mức Giá</summary>
              <div className="sidebar-content">
                {[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'under10', label: 'Dưới 10 triệu' },
                  { value: '10to20', label: '10 - 20 triệu' },
                  { value: '20to40', label: '20 - 40 triệu' },
                  { value: 'above40', label: 'Trên 40 triệu' },
                ].map(opt => (
                  <label key={opt.value} className="filter-checkbox">
                    <input type="radio" name="priceSidebar" checked={priceRange === opt.value} onChange={() => handlePriceChange(opt.value)} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section" open>
              <summary className="sidebar-title">Theo Dòng Sản Phẩm</summary>
              <div className="sidebar-content">
{/* Details */}
                {['ROG', 'ROG Strix', 'ROG Matrix', 'ROG Astral', 'TUF', 'ProArt', 'Dual', 'Gaming X', 'Ventus', 'AERO', 'iGame'].map(line => (
                  <label key={line} className="filter-checkbox">
                    <input type="checkbox" checked={selectedLines.includes(line)} onChange={() => handleLineChange(line)} />
                    <span>{line}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section">
              <summary className="sidebar-title">Thương Hiệu Chipset</summary>
              <div className="sidebar-content">
                {['NVIDIA', 'AMD', 'Intel'].map(chip => (
                  <label key={chip} className="filter-checkbox">
                    <input type="checkbox" checked={selectedChipsets.includes(chip)} onChange={() => handleChipsetChange(chip)} />
                    <span>{chip}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section">
              <summary className="sidebar-title">Cấu hình Chipset</summary>
              <div className="sidebar-content">
                {['RTX 4090', 'RTX 4080', 'RTX 4070', 'RTX 4060', 'RTX 3060', 'RX 7900', 'RX 7800'].map(c => (
                  <label key={c} className="filter-checkbox">
                    <input type="checkbox" checked={selectedChipsets.includes(c)} onChange={() => handleChipsetChange(c)} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section">
              <summary className="sidebar-title">Dung Lượng Bộ Nhớ</summary>
              <div className="sidebar-content">
                {['24GB', '16GB', '12GB', '8GB', '6GB'].map(v => (
                  <label key={v} className="filter-checkbox">
                    <input type="checkbox" checked={selectedVRAMs.includes(v)} onChange={() => handleVRAMChange(v)} />
                    <span>{v}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section">
              <summary className="sidebar-title">Loại Bộ Nhớ</summary>
              <div className="sidebar-content">
                {['GDDR6X', 'GDDR6', 'GDDR5'].map(m => (
                  <label key={m} className="filter-checkbox">
                    <input type="checkbox" checked={selectedMemTypes.includes(m)} onChange={() => handleMemTypeChange(m)} />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </details>

            <details className="sidebar-section">
              <summary className="sidebar-title">PSU Khuyến Cáo</summary>
              <div className="sidebar-content">
                {['1000W', '850W', '750W', '650W', '550W'].map(p => (
                  <label key={p} className="filter-checkbox">
                    <input type="checkbox" checked={selectedPSUs.includes(p)} onChange={() => handlePSUChange(p)} />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </details>

          </aside>

          <main className="shop-main">
            <div className="shop-toolbar" style={{ marginTop: '0', marginBottom: '30px' }}>
              <div className="toolbar-left">
                <div className="search-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="search-input styled-input"
                    placeholder="Tìm kiếm linh kiện..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setDisplayCount(ITEMS_PER_PAGE); }}
                  />
                </div>
              </div>

              <div className="toolbar-right">
                <span className="result-count">
                  {displayProducts.length} sản phẩm
                </span>
                <select className="sort-select styled-input" value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setDisplayCount(ITEMS_PER_PAGE); }}>
                  <option value="default">Xếp theo: Nổi bật</option>
                  <option value="price_asc">Giá: Thấp → Cao</option>
                  <option value="price_desc">Giá: Cao → Thấp</option>
                  <option value="name_asc">Tên: A → Z</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="shop-loading">
                <div className="loading-dots"><span /><span /><span /></div>
                <p>Đang tải thông số kỹ thuật...</p>
              </div>
            ) : (
              <>
                {displayProducts.length > 0 ? (
                  <>
                    <div className="shop-product-grid">
                      {visibleProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {hasMore && (
                      <div className="shop-load-more">
                        <div className="load-more-info">
                          Đang hiển thị <strong>{visibleProducts.length}</strong> / <strong>{displayProducts.length}</strong> sản phẩm
                        </div>
                        <button
                          className="btn-load-more glass-btn"
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                        >
                          {loadingMore ? (
                            <span className="btn-loading"><span className="dot-spin" /> Đang tải...</span>
                          ) : (
                            `XEM THÊM CÁC SẢN PHẨM KHÁC`
                          )}
                        </button>
                      </div>
                    )}
                    {!hasMore && displayProducts.length > ITEMS_PER_PAGE && (
                      <div className="shop-end-message">✅ Đã hiển thị tất cả {displayProducts.length} sản phẩm</div>
                    )}
                  </>
                ) : (
                  <div className="shop-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M8 15s1.5 2 4 2 4-2 4-2"></path>
                      <line x1="9" y1="9" x2="9.01" y2="9"></line>
                      <line x1="15" y1="9" x2="15.01" y2="9"></line>
                    </svg>
                    <h3>Không tìm thấy linh kiện phù hợp</h3>
                    <p>Hãy thử giảm bớt các điều kiện lọc thông số</p>
                    <button className="btn-reset-filter" onClick={handleResetSidebar}>Xóa tất cả bộ lọc</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
