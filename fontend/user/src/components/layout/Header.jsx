import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import AuthModal from '../AuthModal/AuthModal';
import axiosClient from '../../api/axiosClient';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);


  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.wishlistItems.length);
  const [pendingReviews, setPendingReviews] = useState(0);


  const { isAuthenticated, user, isAuthModalOpen } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  const handleCloseAuthModal = () => {
    import('../../redux/authSlice').then(({ closeAuthModal }) => {
      dispatch(closeAuthModal());
    });
  };

  const handleOpenAuthModal = () => {
    import('../../redux/authSlice').then(({ openAuthModal }) => {
      dispatch(openAuthModal());
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Login
  useEffect(() => {
    if (isAuthenticated) {
      import('../../redux/cartSlice').then(({ fetchCart }) => {
        dispatch(fetchCart());
      });
      // Order
      axiosClient.get('/reviews/pending').then(res => {
        const data = res?.data || res;
        setPendingReviews(Array.isArray(data) ? data.length : 0);
      }).catch(err => console.error("Lỗi lấy pending reviews:", err));
    } else {
      setPendingReviews(0);
    }
  }, [isAuthenticated, dispatch]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">

        <Link to="/" className="logo-brand">
          <img src="/images/logo.png" alt="VGA Store Logo" className="header-logo-img" />
        </Link>

        <nav className="nav-links">
          {[
            { to: '/', label: 'TRANG CHỦ' },
            { to: '/products', label: 'SẢN PHẨM' },
            { to: '/blog', label: 'TIN TỨC' },
            { to: '/service', label: 'DỊCH VỤ' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/track-order" className="cart-icon nav-action-item" title="Theo dõi đơn hàng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {pendingReviews > 0 && (
              <span className="cart-badge" style={{ background: '#f59e0b', right: '-5px', top: '-5px' }}>{pendingReviews}</span>
            )}
          </Link>

          <Link to="/wishlist" className="cart-icon" title="Yêu thích">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistCount > 0 ? "#e53935" : "none"} stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="cart-badge" style={{ background: '#e53935' }}>{wishlistCount}</span>
            )}
          </Link>

{/* User */}
          {isAuthenticated ? (
            <div className="user-logged-in-wrapper" ref={userMenuRef}>
              <div className="user-avatar-trigger" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <img src={user?.picture || '/default-avatar.png'} alt="Avatar" className="user-avatar-img" />
              </div>

              {isUserMenuOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-user-header">
                    <img src={user?.picture || '/default-avatar.png'} alt="Avatar" />
                    <div className="dropdown-user-info">
                      <span className="user-name">{user?.name}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    Tài khoản của tôi
                  </Link>
                  <Link to="/track-order" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Đơn mua
                  </Link>

                  <div className="dropdown-divider"></div>

                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-action-item" onClick={handleOpenAuthModal} title="Đăng nhập">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}

          <Link to="/cart" className="cart-icon" title="Giỏ hàng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartTotalQuantity > 0 && (
              <span className="cart-badge">{cartTotalQuantity}</span>
            )}
          </Link>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </header>
  );
};

export default Header;
