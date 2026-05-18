import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  addToCart, decreaseCart, removeFromCart, clearCart,
  addToCartDb, updateCartItemDb, removeCartItemDbAction, clearCartDb
} from '../../redux/cartSlice';
import './Cart.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);

  const handleIncrease = (item) => {
    if (isAuthenticated) {
      dispatch(updateCartItemDb({ item, quantity: item.cartQuantity + 1 }));
      dispatch(addToCartDb({ product: item, quantity: 1 })); 

    } else {
      dispatch(addToCart(item));
    }
  };

  const handleDecrease = (item) => {
    if (isAuthenticated) {
      if (item.cartQuantity > 1) {
        dispatch(updateCartItemDb({ item, quantity: item.cartQuantity - 1 }));
      } else {
        dispatch(removeCartItemDbAction(item));
      }
    } else {
      dispatch(decreaseCart(item));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeCartItemDbAction(item));
  };

  const handleClear = () => {
    dispatch(clearCartDb());
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      import('../../redux/authSlice').then(({ openAuthModal }) => dispatch(openAuthModal()));
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <h2 className="cart-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d8282e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Giỏ hàng của bạn
        </h2>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <line x1="3" y1="3" x2="21" y2="21" stroke="#cbd5e1" strokeWidth="1.5"></line>
            </svg>
            <h3>Giỏ hàng đang trống</h3>
            <p>Hiện tại chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
            <Link to="/products" className="btn-continue-shopping">
              QUAY LẠI CỬA HÀNG
            </Link>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            <div className="cart-items-list">
              <div className="cart-header-row">
                <div className="col-product">Sản phẩm</div>
                <div className="col-price">Đơn giá</div>
                <div className="col-quantity">Số lượng</div>
                <div className="col-total">Thành tiền</div>
                <div className="col-action"></div>
              </div>

              {cartItems.map((item) => {
                const cardImage = item.imgUrl || item.img || item.thumbnail || '/images/products/gpu_original.png';
                return (
                  <div className="cart-item-row" key={item.id}>
                    <div className="col-product">
                      <img src={cardImage} alt={item.name} className="cart-item-img" />
                      <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                    </div>
                    <div className="col-price">{formatPrice(item.price)}</div>
                    <div className="col-quantity">
                      <div className="qty-controls">
                        <button onClick={() => handleDecrease(item)}>-</button>
                        <span className="qty-number">{item.cartQuantity}</span>
                        <button onClick={() => handleIncrease(item)}>+</button>
                      </div>
                    </div>
                    <div className="col-total">{formatPrice(item.price * item.cartQuantity)}</div>
                    <div className="col-action">
                      <button className="btn-remove-item" onClick={() => handleRemove(item)} title="Xóa sản phẩm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="cart-footer-actions">
                <button className="btn-clear-all" onClick={handleClear}>
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </div>

{/* Order */}
            <div className="cart-summary-box">
              <h3 className="summary-title">Tóm tắt đơn hàng</h3>
              <div className="summary-line">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="summary-line">
                <span>Phí vận chuyển:</span>
                <span>Chưa tính</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-line summary-total">
                <span>Tổng cộng:</span>
                <span className="final-price">{formatPrice(totalAmount)}</span>
              </div>
              <button className="btn-checkout-now" onClick={handleCheckoutClick}>
                TIẾN HÀNH THANH TOÁN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
