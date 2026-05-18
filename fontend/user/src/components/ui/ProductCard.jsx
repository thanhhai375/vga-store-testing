import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartDb } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import { toggleCompare } from "../../redux/compareSlice";
import "./ProductCard.css";

// Initialization
const currencyFormatter = new Intl.NumberFormat("vi-VN");

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);

  // Retrieve all
  // Validation
  const wishlistItems = useSelector(state => state.wishlist?.wishlistItems || []);
  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

  const compareItems = useSelector(state => state.compare?.compareItems || []);
  const isCompared = product ? compareItems.some(item => item.id === product.id) : false;


  if (!product) return null;

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }

    dispatch(toggleWishlist(product));
  };

  const formatPrice = (price) => {
    return currencyFormatter.format(price) + "₫";
  };

  const currentPrice = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);
  let discountPercent = 0;
  if (oldPrice > currentPrice) {
    discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  }

  // Image
  const dbImageUrl =
    product.imageUrl ||
    product.imgUrl ||
    product.img_url ||
    product.image ||
    (product.images && product.images.length > 0 && product.images[0]?.url);

  // Process
  let formattedImageUrl = dbImageUrl;
  if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
    formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
  }

  // Error handling
  const fallbackImage = '/images/products/gpu_original.png';
  const finalImageUrl = (imgError || !formattedImageUrl) ? fallbackImage : formattedImageUrl;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      thumbnail: finalImageUrl,
    };

    dispatch(addToCartDb({ product: itemToAdd, quantity: 1 }));
    setShowPopup(true);
  };

  return (
    <>

      <Link to={`/product/${product.id}`} className="product-card">

        {product.badge && <div className="card-badge-hot">{product.badge}</div>}

        <button
          className={`btn-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>

        <button
          className={`btn-wishlist ${isCompared ? 'wishlisted' : ''}`}
          style={{ top: '60px' }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleCompare(product)); }}
          title={isCompared ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'}
        >
          ⚖️
        </button>

        <div className="card-image-wrapper">
          <img
            src={finalImageUrl}
            alt={product.name}
            className="card-image"
            onError={() => {
              if (!imgError) setImgError(true);
            }}
          />
        </div>

        <div className="card-info">
          <h3 className="card-name" title={product.name}>{product.name}</h3>

          <div className="card-price-area">
            {oldPrice > currentPrice && (
              <div className="old-price-group">
                <span className="old-price">{formatPrice(oldPrice)}</span>
              </div>
            )}
            <div className="new-price-group">
              <span className="new-price">{formatPrice(currentPrice)}</span>
              {discountPercent > 0 && <span className="discount-percent">-{discountPercent}%</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
            <div className="card-rating" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px', marginTop: 0 }}>
              <span className="stars" style={{ color: '#fbbf24' }}>
                {'⭐'.repeat(Math.max(1, Math.round(Number(product.averageRating || 5))))} 
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>
                  {(product.averageRating || 5.0).toFixed(1)}
                </span>
              </span>
              <span className="review-count">({product.reviewCount || 0} đánh giá)</span>
            </div>

            <button
              className="btn-quick-add"
              onClick={handleQuickAdd}
            >
              MUA
            </button>
          </div>
        </div>
      </Link>

{/* Cart */}
      {showPopup && (
        <div className="custom-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="custom-popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-corner-close" onClick={() => setShowPopup(false)}>✕</button>
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="popup-title">Đã thêm sản phẩm vào giỏ hàng!</h3>
            <div className="popup-actions">
              <button className="popup-btn-continue" onClick={() => setShowPopup(false)}>Tiếp tục mua sắm</button>
              <button className="popup-btn-close" onClick={() => navigate('/cart')}>Đi đến giỏ hàng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
