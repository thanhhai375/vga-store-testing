import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="rog-footer">
      <div className="footer-container">
        <div className="footer-main">

          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/images/logo.png" alt="VGA Store Logo" className="footer-logo-img" />
            </div>

            <p className="footer-desc">
              Chuyên cung cấp Card đồ họa chính hãng.<br />
              Bảo hành uy tín — Giao hàng toàn quốc.
            </p>

            <div className="footer-contact-brief">
              <p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <em>Cập nhật sau</em>
              </p>
              <p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <em>Cập nhật sau</em>
              </p>
              <p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                8:00 – 21:00 mỗi ngày
              </p>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">VỀ CHÚNG TÔI</h4>
            <nav className="footer-nav">
              <Link to="/service?tab=gioi-thieu">Giới thiệu VGA Store</Link>
              <Link to="/service?tab=he-thong-cua-hang">Hệ thống Showroom</Link>
              <Link to="/service?tab=ho-tro-ky-thuat">Dịch vụ kỹ thuật tại nhà</Link>
              <Link to="/service?tab=thu-cu-doi-moi">Thu cũ đổi mới</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">CHÍNH SÁCH</h4>
            <nav className="footer-nav">
              <Link to="/service?tab=chinh-sach-bao-hanh">Chính sách Bảo hành</Link>
              <Link to="/service?tab=chinh-sach-giao-hang">Chính sách Giao hàng</Link>
              <Link to="/service?tab=tra-gop">Mua trả góp 0%</Link>
              <Link to="/service?tab=thanh-toan">Hướng dẫn Thanh toán</Link>
              <Link to="/service?tab=huong-dan-mua-hang">Hướng dẫn Đặt hàng</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">NHẬN ƯU ĐÃI</h4>
            <p className="footer-desc" style={{ marginBottom: '14px' }}>
              Đăng ký nhận khuyến mãi & sản phẩm mới nhất.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email của bạn..."
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className="btn-subscribe" type="submit">
                {subscribed ? '✓' : 'ĐĂNG KÝ'}
              </button>
            </form>

            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" title="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" title="X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2025 VGA Store. Tất cả quyền được bảo lưu.</span>
          <div className="footer-bottom-links">
            <Link to="/service?tab=bao-mat">Chính sách Bảo mật</Link>
            <Link to="/track-order">Tra cứu Đơn hàng</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
