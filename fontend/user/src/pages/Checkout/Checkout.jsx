import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosClient from '../../api/axiosClient';
import { clearCart } from '../../redux/cartSlice';
import { orderService } from '../../services/orderService';
import cartService from '../../services/cartService';
import { userService } from '../../services/userService';
import './Checkout.css';

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { isAuthenticated } = useSelector((state) => state.auth) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    note: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [addressData, setAddressData] = useState({
    province: '',
    district: '',
    ward: '',
    street: ''
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const [error, setError] = useState('');

  // Address
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      userService.getProfile()
        .then(res => {
          if (res?.data?.addresses && res.data.addresses.length > 0) {
            setUserAddresses(res.data.addresses);
            const defaultAddr = res.data.addresses.find(a => a.isDefault) || res.data.addresses[0];
            handleSelectSavedAddress(defaultAddr);
          }
        })
        .catch(err => console.error('Failed to load address book:', err));
    }
  }, [isAuthenticated]);

  const handleSelectSavedAddress = (addr) => {
    if (addr === 'new') {
      setSelectedAddressId('new');
      setSelectedSavedAddress(null);
      setCustomerInfo({ ...customerInfo, fullName: '', phone: '' });
    } else {
      setSelectedAddressId(addr.id);
      setSelectedSavedAddress(addr);
      setCustomerInfo({ ...customerInfo, fullName: addr.recipientName, phone: addr.phone });
    }
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdOrderCode, setCreatedOrderCode] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const [bankInfo, setBankInfo] = useState({
    bankName: 'Đang tải...',
    accountNumber: '...',
    accountName: '...',
    bankId: ''
  });

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error('Failed to load provinces:', err));
  }, []);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setAddressData({ ...addressData, province: name, district: '', ward: '' });
    setDistricts([]);
    setWards([]);
    if (code) {
      axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`)
        .then(res => setDistricts(res.data.districts));
    }
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setAddressData({ ...addressData, district: name, ward: '' });
    setWards([]);
    if (code) {
      axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`)
        .then(res => setWards(res.data.wards));
    }
  };

  const handleWardChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setAddressData({ ...addressData, ward: name });
  };


  const currentProvinceStr = selectedSavedAddress ? selectedSavedAddress.detailedAddress : addressData.province;
  const canExpress = currentProvinceStr && (currentProvinceStr.toLowerCase().includes('hồ chí minh') || currentProvinceStr.toLowerCase().includes('ho chi minh'));

  useEffect(() => {
    if (!canExpress && shippingMethod === 'express') {
      setShippingMethod('standard');
    }
  }, [canExpress, shippingMethod]);


  const totalAmount = checkoutItems.reduce((total, item) => total + (item.price * (item.cartQuantity || 1)), 0);
  const shippingFee = shippingMethod === 'express' ? 50000 : 0;
  const finalTotal = totalAmount + shippingFee;

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

  useEffect(() => {
    axiosClient.get('/settings/public')
      .then(res => {
        const data = res.data || res || {};
        const getVal = (key) => data[key] || data[key.toLowerCase()] || data[key.toUpperCase()] || '';
        setBankInfo({
          bankId: getVal('BANK_ID'),
          accountNumber: getVal('BANK_ACC_NO'),
          accountName: getVal('BANK_ACC_NAME'),
          bankName: getVal('BANK_ID')
        });
      })
      .catch(err => console.error('Failed to load bank settings:', err));
  }, []);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Khoa dong bo de ngan hai lan submit lien tiep tao hai don hang.
    if (isSubmittingRef.current) return;

    if (checkoutItems.length === 0) return;

    const showError = (msg) => {
      setError(msg);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    let fullShippingAddress = '';
    if (selectedSavedAddress) {
      fullShippingAddress = selectedSavedAddress.detailedAddress;
    } else {
      fullShippingAddress = `${addressData.street ? addressData.street + ', ' : ''}${addressData.ward ? addressData.ward + ', ' : ''}${addressData.district ? addressData.district + ', ' : ''}${addressData.province}`.replace(/,\s*$/, "");
      if (!addressData.province || !addressData.district || !addressData.ward || !addressData.street) {
        showError('Please fill in Province, District, Ward and Street address.');
        return;
      }
    }

    if (!customerInfo.fullName || !customerInfo.phone) {
      showError('Please enter your full name and phone number.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      showError('Invalid phone number. Must be 10 digits (e.g. 0912345678).');
      return;
    }

    if (customerInfo.fullName.trim().length < 2) {
      showError('Please enter your real full name.');
      return;
    }

    // useRef cap nhat ngay lap tuc, khac voi state phai cho React render lai.
    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      // Payload gửi lên Backend — KHÔNG gửi price để tránh user chỉnh sửa giá
      // Backend sẽ tự lấy giá từ DB và tính lại totalAmount
      const orderPayload = {
        fullName: customerInfo.fullName,
        phone: customerInfo.phone,
        address: fullShippingAddress,
        shippingAddress: fullShippingAddress,
        note: customerInfo.note || '',
        shippingFee: shippingFee, // Phí ship gửi để backend ghi nhận
        items: checkoutItems.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity || 1,
          // Không gửi price — backend lấy từ DB để đảm bảo an toàn
        }))
      };

      const orderRes = await orderService.createOrder(orderPayload);
      const orderData = orderRes?.data?.data || orderRes?.data || orderRes || {};
      const orderId = orderData.orderId || orderData.id;
      const orderCode = orderData.orderCode || orderData.id || 'N/A';

      setCreatedOrderCode(orderCode);

      // Tạo bản ghi thanh toán
      let fetchedPaymentUrl = null;
      if (orderId) {
        try {
          const payRes = await orderService.createPayment(orderId, paymentMethod);
          const payData = payRes?.data?.data || payRes?.data || payRes || {};
          fetchedPaymentUrl = payData.paymentUrl;
        } catch (payErr) {
          console.error('Tạo payment error:', payErr);
        }
      }

      // For VNPay/MoMo: redirect to gateway immediately, do NOT clear cart yet
      if (paymentMethod === 'VNPAY' || paymentMethod === 'MOMO') {
        if (fetchedPaymentUrl) {
          sessionStorage.setItem('pendingOrderId', orderId);
          window.location.href = fetchedPaymentUrl;
          return;
        } else {
          showError('Lỗi lấy link thanh toán, vui lòng thử lại hoặc chọn phương thức khác.');
          setLoading(false);
          return;
        }
      }

      // For Bank Transfer: redirect to payment pending page with QR + countdown
      if (paymentMethod === 'BANK_TRANSFER') {
        if (!buyNowItem) {
          dispatch(clearCart());
          if (isAuthenticated) {
            try { await cartService.clearCart(); } catch (e) {}
          }
        }
        navigate(`/payment/pending?orderId=${orderId}&orderCode=${encodeURIComponent(orderCode)}&amount=${orderData.totalPrice || orderData.totalAmount || ''}`);
        return;
      }

      // For COD: clear cart and show success popup
      if (!buyNowItem) {
        dispatch(clearCart());
        if (isAuthenticated) {
          try { await cartService.clearCart(); } catch (e) {}
        }
      }

      setPaymentUrl(fetchedPaymentUrl || '');
      setShowSuccessPopup(true);

    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      showError(err?.response?.data?.message || err?.response?.data || 'Đã xảy ra lỗi hệ thống khi kết nối Backend!');
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  const handleFinishOrder = (path) => {
    navigate(path);
  };

  if (checkoutItems.length === 0 && !showSuccessPopup && !createdOrderCode) {
    return (
      <div className="checkout-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', marginBottom: '20px' }}>
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          <line x1="3" y1="3" x2="21" y2="21"></line>
        </svg>
        <h2>Giỏ hàng của bạn đang trống!</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Vui lòng thêm sản phẩm vào giỏ để tiến hành thanh toán.</p>
        <Link to="/products" className="btn-return-shop">QUAY LẠI MUA SẮM</Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-layout">
          <h2 className="checkout-title">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d8282e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            THANH TOÁN AN TOÀN
          </h2>

          <div className="checkout-content">
            <form className="checkout-form-column" onSubmit={handlePlaceOrder}>

              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">1</span>
                  <h3>Thông tin giao hàng</h3>
                </div>

{/* Address */}
                {isAuthenticated && userAddresses.length > 0 && (
                  <div className="saved-addresses-section">
                    <label className="section-sub-label">Sổ địa chỉ của bạn</label>
                    <div className="saved-address-cards">
                      {userAddresses.map(addr => (
                        <div key={addr.id} className={`address-mini-card ${selectedAddressId === addr.id ? 'selected' : ''}`} onClick={() => handleSelectSavedAddress(addr)}>
                          <div className="addr-name-phone"><strong>{addr.recipientName}</strong> | {addr.phone}</div>
                          <div className="addr-detail-text">{addr.detailedAddress}</div>
                          {addr.isDefault && <span className="default-badge">Mặc định</span>}
                        </div>
                      ))}
                      <div className={`address-mini-card add-new-card ${selectedAddressId === 'new' ? 'selected' : ''}`} onClick={() => handleSelectSavedAddress('new')}>
                        <span className="add-icon">+</span> Thêm địa chỉ mới
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-grid" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>Họ và tên *</label>
                    <input type="text" name="fullName" required placeholder="Ví dụ: Nguyễn Văn A" value={customerInfo.fullName} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại *</label>
                    <input type="tel" name="phone" required placeholder="Nhập số điện thoại" value={customerInfo.phone} onChange={handleChange} />
                  </div>
                </div>

{/* Address */}
                {selectedAddressId === 'new' && (
                  <>
                    <div className="address-selectors form-grid">
                  <div className="form-group">
                    <label>Tỉnh/Thành phố *</label>
                    <select required onChange={handleProvinceChange} defaultValue="">
                      <option value="" disabled>Chọn Tỉnh/Thành</option>
                      {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quận/Huyện *</label>
                    <select required onChange={handleDistrictChange} disabled={!addressData.province} defaultValue="">
                      <option value="" disabled>Chọn Quận/Huyện</option>
                      {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Phường/Xã *</label>
                    <select required onChange={handleWardChange} disabled={!addressData.district} defaultValue="">
                      <option value="" disabled>Chọn Phường/Xã</option>
                      {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số nhà, Tên đường *</label>
                    <input type="text" required placeholder="Số nhà, tên đường, tòa nhà..." onChange={e => setAddressData({ ...addressData, street: e.target.value })} />
                  </div>
                </div>
              </>
            )}

                <div className="form-group" style={{ marginBottom: 0, marginTop: '16px' }}>
                  <label>Ghi chú (Tùy chọn)</label>
                  <textarea name="note" rows="2" placeholder="Ghi chú thời gian nhận hàng, chỉ dẫn cho shipper..." onChange={handleChange}></textarea>
                </div>
              </div>

              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">2</span>
                  <h3>Phương thức vận chuyển</h3>
                </div>
                <div className="shipping-methods">
                  <label className={`method-card ${shippingMethod === 'standard' ? 'active' : ''}`}>
                    <input type="radio" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <div className="method-info">
                      <span className="method-name">Giao hàng tiêu chuẩn (Dự kiến 3-5 ngày)</span>
                      <span className="method-price text-green">Miễn phí</span>
                    </div>
                  </label>

                  <label className={`method-card ${!canExpress ? 'disabled' : ''} ${shippingMethod === 'express' ? 'active' : ''}`} title={!canExpress ? 'Chỉ áp dụng tại TP. HCM' : ''}>
                    <input type="radio" value="express" disabled={!canExpress} checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div className="method-info">
                      <span className="method-name">
                        Giao hàng hỏa tốc (Nhận trong 2-4h)
                        {!canExpress && <span style={{ display: 'block', fontSize: '12.5px', color: '#ef4444', marginTop: '4px' }}>* Tính năng Tự động kích hoạt cho khu vực TP. HCM</span>}
                      </span>
                      <span className="method-price text-red">50.000₫</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-section-block">
                <div className="section-header">
                  <span className="step-number">3</span>
                  <h3>Phương thức thanh toán</h3>
                </div>

                <div className="payment-methods">
                  <label className={`payment-method-card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Thanh toán khi nhận hàng (COD)</strong>
                      <span>Thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="BANK_TRANSFER" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} />
                    <div className="payment-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                    </div>
                    <div className="payment-info">
                      <strong>Chuyển khoản ngân hàng (Quét mã QR)</strong>
                      <span>Mã QR hiển thị ngay bên dưới để bạn thanh toán.</span>
                    </div>
                  </label>

                  <label className={`payment-method-card ${paymentMethod === 'VNPAY' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                    <div className="payment-icon vnpay-icon" style={{ background: 'transparent', padding: '0', overflow: 'hidden' }}>
                      <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" alt="VNPay" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    </div>
                    <div className="payment-info">
                      <strong>Thanh toán qua VNPAY</strong>
                      <span>Ví điện tử, thẻ ATM, thẻ quốc tế. Xác nhận tức thì.</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'BANK_TRANSFER' && (
                  <div className="bank-transfer-box">
                    <div className="bank-transfer-info">
                      <div className="bank-text-details">
                        <div className="bank-title-wrapper">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bank-shield-icon">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                          <h4 className="bank-transfer-title">Thông tin tài khoản</h4>
                        </div>
                        <p><strong>Ngân hàng:</strong> {bankInfo.bankName}</p>
                        <p><strong>Số tài khoản:</strong> {bankInfo.accountNumber}</p>
                        <p><strong>Chủ tài khoản:</strong> {bankInfo.accountName}</p>
                        <p className="qr-instruction">
                          Quét mã QR bên cạnh để thanh toán nhanh <strong>{formatPrice(finalTotal)}</strong>.
                        </p>
                      </div>

                      <div className="bank-qr-box">
                        {bankInfo.bankId ? (
                          <img
                            src={`https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${finalTotal}&accountName=${encodeURIComponent(bankInfo.accountName)}&addInfo=Thanh toan VGA STORE`}
                            alt="QR Chuyển khoản"
                            className="qr-code-img"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', padding: '20px' }}>Mã QR chưa sẵn sàng</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {error && <div className="checkout-error-msg">{error}</div>}

                <button type="submit" className="btn-place-order" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
                </button>
              </div>
            </form>

            <div className="checkout-summary-section">
              <h3>Đơn hàng của bạn ({checkoutItems.length} sản phẩm)</h3>
              <div className="checkout-items-list">
                {checkoutItems.map((item) => {
                  const cardImage = item.imgUrl || item.img || item.thumbnail || '/images/products/gpu_original.png';
                  return (
                    <div key={item.id} className="checkout-summary-item">
                      <img src={cardImage} alt={item.name} className="checkout-item-thumb" />
                      <div className="checkout-item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price-qty">
                          <span className="item-qty">SL: {item.cartQuantity || 1}</span>
                          <span className="item-price">{formatPrice(item.price * (item.cartQuantity || 1))}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="checkout-bill-details">
                <div className="checkout-total-line">
                  <span>Tạm tính</span><span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="checkout-total-line">
                  <span>Phí vận chuyển</span>
                  {shippingFee === 0
                    ? <span className="text-green">Miễn phí</span>
                    : <span className="text-red">+{formatPrice(shippingFee)}</span>}
                </div>
                <div className="checkout-total-line final">
                  <span>Tổng thanh toán</span>
                  <span className="final-price">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="checkout-popup-overlay">
          <div className="checkout-popup-content">
            <div className="popup-icon-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '36px', height: '36px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="popup-title">Đặt hàng thành công!</h3>
            {createdOrderCode && (
              <p className="popup-order-code">Mã đơn hàng: <strong>#{createdOrderCode}</strong></p>
            )}
            <p className="popup-message">
              {paymentMethod === 'BANK_TRANSFER'
                ? `Đơn hàng của bạn đã được ghi nhận. Hệ thống sẽ xử lý ngay khi nhận được thanh toán!`
                : 'Cảm ơn bạn đã tin tưởng mua sắm tại VGA STORE. Đơn hàng sẽ được xử lý sớm nhất.'}
            </p>

            <div className="popup-actions">
              <button className="popup-btn-track" onClick={() => handleFinishOrder('/track-order')}>
                Theo dõi đơn hàng
              </button>
              <button className="popup-btn-home" onClick={() => handleFinishOrder('/')}>
                Quay lại Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
