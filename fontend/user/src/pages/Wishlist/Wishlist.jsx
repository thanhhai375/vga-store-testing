import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../../redux/wishlistSlice';
import { addToCartDb } from '../../redux/cartSlice';
import './Wishlist.css';

const Wishlist = () => {
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);
  const dispatch = useDispatch();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-layout">
        <div className="wishlist-header">
          <h1 className="wishlist-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Danh sách yêu thích
            <span className="wishlist-count">({wishlistItems.length} sản phẩm)</span>
          </h1>
          {wishlistItems.length > 0 && (
            <button className="btn-clear-wishlist" onClick={() => dispatch(clearWishlist())}>
              Xóa tất cả
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-heart-icon">
{/* Status */}
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3>Danh sách yêu thích của bạn đang trống</h3>
            <p>Hãy khám phá sản phẩm và nhấn trái tim để lưu lại những VGA bạn thích!</p>
            <Link to="/products" className="btn-go-shop">Khám phá ngay</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => {

              // Image
              const cardImage = item.imgUrl || item.img || item.thumbnail || '/images/products/gpu_original.png';

              return (
                <div key={item.id} className="wishlist-card">

{/* Delete */}
                  <button
                    className="btn-remove-wish"
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    title="Xóa khỏi danh sách"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <Link to={`/product/${item.id}`} className="wish-img-wrapper">
                    <img src={cardImage} alt={item.name} className="wish-img" />
                  </Link>

                  <div className="wish-info">
                    <div className="wish-brand">{item.brand?.name || item.brand || 'ASUS'}</div>
                    <Link to={`/product/${item.id}`} className="wish-name">{item.name}</Link>
                    <div className="wish-price">{formatPrice(item.price)}</div>

                    {item.badge && <span className="wish-badge">{item.badge}</span>}

                    <div className="wish-actions">

{/* Cart */}
                      <button
                        className="btn-add-to-cart-wish"
                        onClick={() => {
                          dispatch(addToCartDb({ product: { ...item, thumbnail: cardImage }, quantity: 1 }));
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        Thêm vào giỏ
                      </button>
                      <Link to={`/product/${item.id}`} className="btn-view-detail-wish">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
