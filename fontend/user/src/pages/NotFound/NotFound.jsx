import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-bg-glow"></div>

      <div className="notfound-content">
        <div className="notfound-code">
          <span className="code-4 left">4</span>
          <div className="code-0-wrapper">
            <div className="gpu-icon-placeholder">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="24" width="64" height="36" rx="6" fill="#1a1a1a" stroke="#e53935" strokeWidth="2"/>
                <rect x="16" y="32" width="18" height="20" rx="3" fill="#2d2d2d" stroke="#555" strokeWidth="1"/>
                <rect x="40" y="32" width="18" height="20" rx="3" fill="#2d2d2d" stroke="#555" strokeWidth="1"/>
                <line x1="16" y1="60" x2="16" y2="68" stroke="#e53935" strokeWidth="3" strokeLinecap="round"/>
                <line x1="28" y1="60" x2="28" y2="68" stroke="#e53935" strokeWidth="3" strokeLinecap="round"/>
                <line x1="40" y1="60" x2="40" y2="68" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
                <line x1="52" y1="60" x2="52" y2="68" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
                <line x1="64" y1="60" x2="64" y2="68" stroke="#888" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="40" cy="14" r="6" fill="none" stroke="#e53935" strokeWidth="2" strokeDasharray="3 2"/>
              </svg>
            </div>
          </div>
          <span className="code-4 right">4</span>
        </div>

        {/* Message */}
        <h1 className="notfound-title">Trang không tồn tại</h1>
        <p className="notfound-desc">
          Có vẻ như VGA bạn đang tìm đã cháy hàng hoặc đường dẫn không chính xác.<br />
          Hãy quay về trang chủ để khám phá những sản phẩm tuyệt vời khác!
        </p>

        {/* Error code badge */}
        <div className="notfound-error-tag">ERROR_CODE: 0x404_PAGE_NOT_FOUND</div>

        {/* CTA Buttons */}
        <div className="notfound-actions">
          <Link to="/" className="btn-notfound-home">
            🏠 Về Trang Chủ
          </Link>
          <Link to="/products" className="btn-notfound-shop">
            🛒 Xem Sản Phẩm
          </Link>
        </div>

        {/* Quick links */}
        <div className="notfound-quick-links">
          <span className="quick-links-label">Hoặc thử:</span>
          <Link to="/blog">Blog</Link>
          <span>·</span>
          <Link to="/service">Dịch vụ</Link>
          <span>·</span>
          <Link to="/track-order">Theo dõi đơn hàng</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
