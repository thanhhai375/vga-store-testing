import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './ProductDetail.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartDb } from '../../redux/cartSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';
import RelatedProducts from './RelatedProducts';
import { toastError } from '../../utils/alertUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const reviewsSectionRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState('specs');
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [canReview, setCanReview] = useState(false);

  // Fix error
  const authState = useSelector(state => state.auth) || {};
  const { user, isAuthenticated } = authState;

  // Fix error
  const wishlistItems = useSelector(state => state.wishlist?.wishlistItems || []);
  const isWishlisted = product ? wishlistItems.some(i => i.id === product.id) : false;

  const compareItems = useSelector(state => state.compare?.compareItems || []);
  const isCompared = product ? compareItems.some(i => i.id === product.id) : false;

  const handleToggleCompareDetail = () => {
    import('../../redux/compareSlice').then(({ toggleCompare }) => dispatch(toggleCompare(product)));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiResponse = await axiosClient.get(`/products/${id}`);
        // Xử lý an toàn dữ liệu từ axios
        const pData = apiResponse?.data || apiResponse;

        if (!pData || !pData.id) {
          setError('Không tìm thấy sản phẩm này!');
          return;
        }

        setProduct(pData);

        // Build image gallery
        let images = [];
        if (pData.imagesJson) {
          try {
            const parsed = JSON.parse(pData.imagesJson);
            images = Array.isArray(parsed) ? parsed : [pData.imagesJson];
          } catch {
            images = [pData.imagesJson];
          }
        }

        // Resolve standard image URL
        const dbImageUrl = pData.imageUrl || pData.imgUrl || pData.img_url || pData.image;
        let formattedImageUrl = dbImageUrl;
        if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
          formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
        }
        
        const fallbackDBImage = formattedImageUrl || '/images/products/gpu_original.png';
        if (images.length === 0 && fallbackDBImage) images = [fallbackDBImage];

        setGallery(images);
        // Set default image
        setMainImage(images[0] || '/images/products/gpu_original.png');

        // Safe load reviews
        try {
          const rev = await axiosClient.get(`/reviews/product/${id}`);
          const revData = rev?.data || rev;
          setReviews(Array.isArray(revData) ? revData : []);
        } catch {
          setReviews([]);
        }

        // Check review permissions
        if (isAuthenticated) {
          try {
            const canRevRes = await axiosClient.get(`/reviews/can-review/${id}`);
            const canRevData = canRevRes?.data !== undefined ? canRevRes.data : canRevRes;
            setCanReview(canRevData === true || canRevData?.data === true);
          } catch (err) {
            console.error("Lỗi kiểm tra quyền đánh giá:", err);
            setCanReview(false);
          }
        }

      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };
    fetchProduct();
  }, [id, isAuthenticated]);

  // Auto-switch to reviews tab
  useEffect(() => {
    if (location.hash === '#reviews') {
      setActiveTab('reviews');
      // Dùng timeout nhỏ để chờ component render xong rồi mới scroll
      setTimeout(() => {
        if (reviewsSectionRef.current) {
          reviewsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 600);
    }
  }, [location.hash, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }
    dispatch(addToCartDb({ product: { id: product.id, name: product.name, price: Number(product.price || 0), thumbnail: mainImage, cartQuantity: 1 }, quantity: 1 }));
    setAddedToCart(true);
    setShowPopup(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }
    navigate('/checkout', { 
      state: { 
        buyNowItem: { 
          id: product.id, 
          name: product.name, 
          price: Number(product.price || 0), 
          thumbnail: mainImage, 
          cartQuantity: 1 
        } 
      } 
    });
  };

  const handleToggleWishlistDetail = () => {
    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }
    dispatch(toggleWishlist(product));
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      // userId có thể nằm ở user.id (mới) hoặc user.userId (cũ - AuthResponse)
      const userId = user?.id || user?.userId || null;
      const displayName = isAuthenticated && user
        ? (user.fullName || user.username || 'Người dùng')
        : (guestName?.trim() || 'Khách hàng');

      const rev = {
        product: { id: parseInt(id) },
        comment: newComment,
        rating: newRating,
        guestName: displayName
      };

      if (isAuthenticated && userId) {
        rev.user = { id: userId };
      }

      const saved = await axiosClient.post('/reviews', rev);
      // axiosClient interceptor unwrap: saved IS the Map DTO already
      const savedData = saved?.data || saved;
      setReviews(prev => [savedData, ...prev]);
      toastSuccess('Đăng đánh giá thành công!');
      setNewComment('');
      setGuestName('');
      setNewRating(5);
    } catch (err) {
      console.error('Lỗi đăng review:', err);
      toastError('Có lỗi khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '0.0';

  // Fix error
  const validAvgRating = isNaN(Number(avgRating)) ? 5 : Number(avgRating);
  const starCount = Math.max(1, Math.round(validAvgRating));

  if (loading) {
    return (
      <div className="detail-loading" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner"></div>
        <p>Đang tải thông số sản phẩm...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-error" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>⚠️ {error || 'Không tìm thấy sản phẩm!'}</h2>
        <Link to="/products" className="btn-back-link">← Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">

      {/* ── HERO: ẢNH + GIÁ ─────────────────────────────────── */}
      <div className="detail-hero">
        <div className="container">
          <button className="btn-back" onClick={() => navigate('/products')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
            ← Quay lại cửa hàng
          </button>

          <div className="detail-grid">
            {/* CỘT TRÁI: ẢNH */}
            <div className="detail-gallery">
              <div className="main-image-box">
                <img
                  src={mainImage || '/images/products/gpu_original.png'}
                  alt={product.name}
                  onError={e => { e.target.onerror = null; e.target.src = '/images/products/gpu_original.png'; }}
                />
              </div>
              {gallery.length > 1 && (
                <div className="thumb-strip">
                  {gallery.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${i + 1}`}
                      className={`thumb-img ${mainImage === img ? 'active' : ''}`}
                      onClick={() => setMainImage(img)}
                      onError={e => { e.target.onerror = null; e.target.src = '/images/products/gpu_original.png'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CỘT PHẢI: THÔNG TIN */}
            <div className="detail-info">
              <div className="brand-tag">
                {product.category?.name || 'Card Đồ Họa'} • {product.brand?.name || 'VGA'}
              </div>
              <h1 className="product-title">{product.name}</h1>
              <div className="rating-row">
                <span className="stars-display">{'⭐'.repeat(starCount)}</span>
                <span className="avg-score">{avgRating}/5</span>
                <span className="review-cnt">({reviews.length} đánh giá)</span>
              </div>
              <div className="sku-code">
                Mã SP: <span>{product.sku || 'Đang cập nhật'}</span> &nbsp;|&nbsp;
                {product.stock > 0
                  ? <span className="in-stock">Còn {product.stock} hàng</span>
                  : <span className="out-stock">Hết hàng</span>
                }
              </div>

              <div className="price-box">
                <span className="current-price">
                  {new Intl.NumberFormat('vi-VN').format(product.price || 0)}đ
                </span>
                {product.oldPrice > product.price && (
                  <>
                    <span className="old-price">
                      {new Intl.NumberFormat('vi-VN').format(product.oldPrice)}đ
                    </span>
                    <span className="discount-badge">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <div className="policy-box">
                <ul>
                  <li>✅ Đổi trả trong 7 ngày nếu lỗi nhà sản xuất.</li>
                  <li>✅ Miễn phí giao hàng toàn quốc (Hóa đơn trên 1tr).</li>
                  <li>✅ Bảo hành chính hãng 36 tháng.</li>
                </ul>
              </div>

              <div className="action-buttons">
                <button className="btn-buy-now" disabled={product.stock <= 0} onClick={handleBuyNow}>
                  MUA NGAY
                </button>
                <div className="sub-actions">
                  <button
                    className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
                    disabled={product.stock <= 0}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ'}
                  </button>
                  <button
                    className={`btn-wishlist-detail ${isWishlisted ? 'wishlisted' : ''}`}
                    onClick={handleToggleWishlistDetail}
                  >
                    {isWishlisted ? '❤️ Đã yêu thích' : '🤍 Yêu Thích'}
                  </button>
                  <button
                    className={`btn-wishlist-detail ${isCompared ? 'wishlisted' : ''}`}
                    onClick={handleToggleCompareDetail}
                    style={{ marginLeft: '10px' }}
                  >
                    {isCompared ? '⚖️ Đang so sánh' : '⚖️ So sánh'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────────── */}
      <div className="detail-tabs-section">
        <div className="container">
          <div className="tab-headers">
            <button className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`} onClick={() => setActiveTab('specs')}>
              Thông Số Kỹ Thuật
            </button>
            <button className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`} onClick={() => setActiveTab('desc')}>
              Mô Tả Sản Phẩm
            </button>
            <button className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              Đánh Giá ({reviews.length})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'specs' && (
              <div className="specs-table-wrapper">
                <table className="specs-table">
                  <tbody>
                    <tr><td>Model GPU</td><td>{product.gpuModel || 'Đang cập nhật'}</td></tr>
                    <tr><td>Dung lượng VRAM</td><td>{product.vram || 'Đang cập nhật'}</td></tr>
                    <tr><td>Loại bộ nhớ</td><td>{product.memoryType || 'GDDR6'}</td></tr>
                    <tr><td>Hệ thống tản nhiệt</td><td>{product.coolingType || 'Đang cập nhật'}</td></tr>
                    <tr><td>PSU khuyến cáo</td><td>{product.recommendedPsu || 'Đang cập nhật'}</td></tr>
                    <tr><td>Đầu cấp nguồn</td><td>{product.powerConnectors || 'Đang cập nhật'}</td></tr>
                    <tr><td>Kích thước</td><td>{product.dimension || 'Đang cập nhật'}</td></tr>
                    <tr><td>Thương hiệu</td><td>{product.brand?.name || 'Đang cập nhật'}</td></tr>
                    <tr><td>Danh mục</td><td>{product.category?.name || 'Đang cập nhật'}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'desc' && (
              <div
                className="article-content"
                dangerouslySetInnerHTML={{
                  __html: product.description || '<p>Đang cập nhật mô tả chi tiết sản phẩm.</p>'
                }}
              />
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section" ref={reviewsSectionRef}>
                <div className="review-summary">
                  <div className="avg-big">{avgRating}</div>
                  <div>
                    <div className="stars-big">{'⭐'.repeat(starCount)}</div>
                    <div className="review-total">Dựa trên {reviews.length} đánh giá</div>
                  </div>
                </div>

                {canReview ? (
                  <form className="review-form" onSubmit={handlePostReview}>
                    <h4>✍️ Viết đánh giá của bạn</h4>
                    <div className="rating-picker">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" className={`star-btn ${n <= newRating ? 'active' : ''}`} onClick={() => setNewRating(n)}>⭐</button>
                      ))}
                      <span>{newRating}/5 sao</span>
                    </div>

                    <textarea
                      placeholder="Nhận xét của bạn về sản phẩm này..."
                      rows="4"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn-submit-review" disabled={submitting}>
                      {submitting ? 'ĐANG GỬI...' : 'GỬI ĐÁNH GIÁ'}
                    </button>
                  </form>
                ) : (
                  <div className="review-form-disabled" style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', marginBottom: '20px' }}>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
                      <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>🔒</span>
                      Chỉ khách hàng đã mua và nhận sản phẩm này mới có quyền đánh giá.
                    </p>
                  </div>
                )}

                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                  ) : reviews.map((r, i) => (
                    <div key={i} className="review-item">
                      <div className="review-avatar">
                        {r.avatar ? (
                          <img src={r.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + (r.guestName || 'U') + '&background=random'; }} />
                        ) : (
                          <img src={'https://ui-avatars.com/api/?name=' + (r.user?.fullName || r.user?.username || r.guestName || 'Khách hàng') + '&background=random'} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div className="review-body">
                        <div className="review-header">
                          <strong>
                            {r.user?.fullName || r.user?.username || r.guestName || 'Khách hàng'}
                          </strong>
                          <span className="review-stars">
                            {'⭐'.repeat(Math.max(1, Math.round(Number(r.rating || 5))))}
                          </span>
                          <span className="review-date">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : ''}
                          </span>
                        </div>
                        <p>{r.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SẢN PHẨM KHÁC ────────────────────────────────── */}
      <div className="related-section">
        <div className="container">
          <h2 className="related-title">Sản Phẩm Tương Tự</h2>
          <RelatedProducts categoryId={product.category?.id} currentId={product.id} />
        </div>
      </div>

      {/* POPUP THÊM VÀO GIỎ */}
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
              <button className="popup-btn-continue" onClick={() => setShowPopup(false)} style={{ background: '#f1f5f9', color: '#475569', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Tiếp tục mua sắm</button>
              <button className="popup-btn-close" onClick={() => navigate('/cart')} style={{ background: '#d8282e', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Đi đến giỏ hàng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
