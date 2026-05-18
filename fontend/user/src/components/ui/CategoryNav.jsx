import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CategoryNav.css';

const CATEGORIES = [
  { label: 'Card Đồ Họa', value: 'gpu', icon: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="8" width="28" height="16" rx="2"/>
      <rect x="6" y="12" width="6" height="6" rx="1"/>
      <rect x="14" y="12" width="6" height="6" rx="1"/>
      <line x1="22" y1="4" x2="22" y2="8"/>
      <line x1="26" y1="4" x2="26" y2="8"/>
    </svg>
  )},
  { label: 'Phụ Kiện', value: 'phu-kien', icon: (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="10" width="24" height="14" rx="2"/>
      <path d="M10 10V8a2 2 0 012-2h8a2 2 0 012 2v2"/>
    </svg>
  )},
];

const CategoryNav = () => {
  const [active, setActive] = useState('gpu');

  return (
    <div className="cat-nav-bar">
      <div className="container cat-nav-inner">
        <div className="cat-tabs">
          {CATEGORIES.map(c => (
            <Link
              key={c.value}
              to={c.value === 'gpu' ? '/products' : `/products?cat=${c.value}`}
              className={`cat-tab ${active === c.value ? 'active' : ''}`}
              onClick={() => setActive(c.value)}
            >
              <span className="cat-tab-icon">{c.icon}</span>
              <span className="cat-tab-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
