import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpChoose.css';

const HelpChoose = () => {
  const navigate = useNavigate();

  // User
  const [filters, setFilters] = useState({
    brand: '',
    chipsetBrand: '',
    chipsetModel: '',
    vram: '',
    memType: '',
    line: '',
    psu: '',
    price: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {

    const params = new URLSearchParams();
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.chipsetBrand) params.append('chipsetBrand', filters.chipsetBrand);
    if (filters.chipsetModel) params.append('chipset', filters.chipsetModel);
    if (filters.vram) params.append('vram', filters.vram);
    if (filters.memType) params.append('memType', filters.memType);
    if (filters.line) params.append('line', filters.line);
    if (filters.psu) params.append('psu', filters.psu);
    if (filters.price) params.append('price', filters.price);


    navigate(`/products?${params.toString()}`);
  };

  return (
    <section className="help-choose-section">
      <div className="container">
        <div className="help-header">
          <h2>GIÚP TÔI LỰA CHỌN</h2>
          <p>Hãy cho chúng tôi biết bạn đang cần gì. Chúng tôi sẽ giúp bạn chọn sản phẩm phù hợp.</p>
        </div>

        <div className="help-filter-grid">
          {/* Box 1 */}
          <select name="brand" value={filters.brand} onChange={handleChange} className="help-select-box">
            <option value="">THƯƠNG HIỆU</option>
            <option value="ASUS">ASUS</option>
            <option value="GIGABYTE">GIGABYTE</option>
            <option value="MSI">MSI</option>
          </select>

          {/* Box 2 */}
          <select name="chipsetBrand" value={filters.chipsetBrand} onChange={handleChange} className="help-select-box">
            <option value="">HÃNG CHIPSET</option>
            <option value="NVIDIA">NVIDIA</option>
            <option value="AMD">AMD</option>
            <option value="Intel">Intel</option>
          </select>

          {/* Box 3 */}
          <select name="chipsetModel" value={filters.chipsetModel} onChange={handleChange} className="help-select-box">
            <option value="">CẤU HÌNH CHIPSET</option>
            <option value="RTX 4090">RTX 4090</option>
            <option value="RTX 4080">RTX 4080</option>
            <option value="RTX 4070">RTX 4070</option>
            <option value="RTX 3060">RTX 3060</option>
            <option value="RX 7900">RX 7900</option>
          </select>

          {/* Box 4 */}
          <select name="vram" value={filters.vram} onChange={handleChange} className="help-select-box">
            <option value="">DUNG LƯỢNG VRAM</option>
            <option value="24GB">24GB</option>
            <option value="16GB">16GB</option>
            <option value="12GB">12GB</option>
            <option value="8GB">8GB</option>
          </select>

          {/* Box 5 */}
          <select name="memType" value={filters.memType} onChange={handleChange} className="help-select-box">
            <option value="">LOẠI BỘ NHỚ</option>
            <option value="GDDR6X">GDDR6X</option>
            <option value="GDDR6">GDDR6</option>
            <option value="GDDR5">GDDR5</option>
          </select>

          {/* Box 6 */}
          <select name="line" value={filters.line} onChange={handleChange} className="help-select-box">
            <option value="">DÒNG SẢN PHẨM</option>
            <option value="ROG">ROG</option>
            <option value="TUF">TUF</option>
            <option value="Dual">Dual</option>
            <option value="Gaming X">Gaming X</option>
          </select>

          {/* Box 7 */}
          <select name="psu" value={filters.psu} onChange={handleChange} className="help-select-box">
            <option value="">PSU ĐỀ XUẤT</option>
            <option value="1000W">1000W</option>
            <option value="850W">850W</option>
            <option value="750W">750W</option>
            <option value="650W">650W</option>
          </select>

          {/* Box 8 */}
          <select name="price" value={filters.price} onChange={handleChange} className="help-select-box">
            <option value="">MỨC GIÁ</option>
            <option value="under10">Dưới 10 triệu</option>
            <option value="10to20">Từ 10 - 20 triệu</option>
            <option value="20to40">Từ 20 - 40 triệu</option>
            <option value="above40">Trên 40 triệu</option>
          </select>
        </div>

        <div className="help-action">
          <button className="btn-red-action" onClick={handleSearch}>XEM SẢN PHẨM PHÙ HỢP</button>
        </div>
      </div>
    </section>
  );
};

export default HelpChoose;
