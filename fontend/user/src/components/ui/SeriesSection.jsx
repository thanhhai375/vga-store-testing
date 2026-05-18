import React from 'react';
import { Link } from 'react-router-dom';
import './SeriesSection.css';

const seriesData = [
  {
    id: 1,
    name: "ROG MATRIX",
    tagline: "Tản Nhiệt Vô Cực",
    img: "https://dlcdnwebimgs.asus.com/gain/DC190BF7-5FB1-4C95-9E01-1E7B7B2206FF/w750/h470/fwebp",
    filterParam: "ROG Matrix"
  },
  {
    id: 2,
    name: "ROG ASTRAL",
    tagline: "Tiên Phong Công Nghệ",
    img: "https://dlcdnwebimgs.asus.com/gain/91DFD65E-42E7-45E1-91A5-2376F4E6889E/w750/h470/fwebp",
    filterParam: "ROG Astral"
  },
  {
    id: 3,
    name: "ROG STRIX",
    tagline: "Thống Lĩnh Cuộc Chơi",
    img: "https://dlcdnwebimgs.asus.com/gain/5DEF33D2-B9E4-4983-BE85-F93C4E4AD5FC/w750/h470/fwebp",
    filterParam: "ROG Strix"
  },
];

const SeriesSection = () => {
  return (
    <section id="series-section" className="series-section">
      <div className="container">
        <div className="series-header-center">
          <h1 className="series-huge-title">CARD ĐỒ HỌA</h1>

{/* Delete */}

          <Link to="/products" className="series-link-red">XEM TẤT CẢ CARD ĐỒ HỌA ›</Link>
        </div>

        <div className="series-grid">
          {seriesData.map(s => (
            <Link key={s.id} to={`/products?line=${s.filterParam}`} className="series-card-solid">
              <div className="series-img-wrap">
                <img src={s.img} alt={s.name} className="series-card-img" />
              </div>
              <div className="series-card-info">
                <h3 className="series-card-name">{s.name}</h3>
                <p className="series-card-tag">{s.tagline}</p>
                <span className="series-card-action">XEM THÊM ›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeriesSection;
