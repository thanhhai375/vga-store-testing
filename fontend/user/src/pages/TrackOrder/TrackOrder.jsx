import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import axiosClient from '../../api/axiosClient';
import './TrackOrder.css';

// Status
const STATUS_MAP = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao thành công',
  CANCEL_REQUESTED: 'Yêu cầu hủy (Chờ duyệt)',
  CANCELLED: 'Đã hủy',
};

const STATUS_CLASS_MAP = {
  PENDING: 'status-pending',
  CONFIRMED: 'status-processing',
  SHIPPING: 'status-delivering',
  DELIVERED: 'status-success',
  CANCEL_REQUESTED: 'status-cancel-request',
  CANCELLED: 'status-cancelled',
};

const TABS = ['Tất cả', 'Chờ duyệt', 'Đang xử lý', 'Đang giao hàng', 'Đã giao thành công', 'Yêu cầu hủy (Chờ duyệt)', 'Đã hủy'];

const formatPrice = (num) => {
  if (!num) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(num) + '₫';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const TrackOrder = () => {
  const { isAuthenticated } = useSelector((state) => state.auth) || {};
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelModalData, setCancelModalData] = useState({ isOpen: false, orderId: null });
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const loadOrders = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await orderService.getMyOrders();
      const data = res?.data?.data || res?.data || res;
      const items = data?.content || data || [];
      setOrders(Array.isArray(items) ? items : []);
      
      // List
      try {
        const pendRes = await axiosClient.get('/reviews/pending');
        const pendData = pendRes?.data || pendRes;
        setPendingReviews(Array.isArray(pendData) ? pendData.map(p => p.id) : []);
      } catch (err) {
        console.error("Lỗi lấy pending reviews:", err);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const tabFilteredOrders = activeTab === 'Tất cả'
    ? orders
    : orders.filter(o => STATUS_MAP[o.status] === activeTab || o.status === activeTab);

  const displayOrders = hasSearched ? searchResults : tabFilteredOrders;

  const handleSearch = () => {
    if (!searchQuery.trim()) { setHasSearched(false); setSearchResults([]); return; }
    const results = orders.filter(o =>
      (o.orderCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(o.orderId || '').includes(searchQuery)
    );
    setSearchResults(results);
    setHasSearched(true);
  };

  const clearSearch = () => { setSearchQuery(''); setHasSearched(false); setSearchResults([]); };

  const openCancelModal = (orderId, e) => {
    if (e) e.stopPropagation();
    setCancelModalData({ isOpen: true, orderId });
    setCancelReason(''); setOtherReason('');
    setSelectedOrder(null);
  };

  const submitCancelRequest = async () => {
    if (!cancelReason) { showToast('Vui lòng chọn một lý do hủy đơn!', 'error'); return; }
    const finalReason = cancelReason === 'Khác' ? otherReason : cancelReason;
    if (cancelReason === 'Khác' && !finalReason.trim()) {
      showToast('Vui lòng nhập lý do cụ thể!', 'error'); return;
    }

    setCancelLoading(true);
    try {

      await axiosClient.put(`/orders/${cancelModalData.orderId}/cancel?reason=${encodeURIComponent(finalReason)}`);

      showToast('Đã gửi yêu cầu hủy đơn hàng thành công!', 'success');
      setCancelModalData({ isOpen: false, orderId: null });
      loadOrders(); // List
    } catch (err) {
      showToast(err?.response?.data?.message || 'Không thể hủy đơn. Vui lòng thử lại.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  // Product
  const openOrderDetail = async (orderSummary) => {
    // Status
    setSelectedOrder({ ...orderSummary, loadingDetails: true });
    try {
      const orderId = orderSummary.orderId || orderSummary.id;
      const res = await orderService.getOrderById(orderId);
      const fullData = res?.data?.data || res?.data || res;
      setSelectedOrder(fullData);
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
      showToast('Không tải được chi tiết sản phẩm.', 'error');
      setSelectedOrder(orderSummary); // Fallback
    }
  };

  const getStatusLabel = (status) => STATUS_MAP[status] || status;
  const getStatusClass = (status) => STATUS_CLASS_MAP[status] || 'status-default';

  const cancelReasonsList = [
    "Muốn thay đổi địa chỉ / Số điện thoại nhận hàng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Thay đổi ý định, không muốn mua nữa",
    "Thời gian giao hàng dự kiến quá lâu",
    "Khác"
  ];

  if (!isAuthenticated) {
    return (
      <div className="track-order-page">
        <div className="track-order-layout">
          <div className="track-login-prompt">
            <h2>Vui lòng đăng nhập</h2>
            <Link to="/" className="btn-login-prompt">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          <div className="toast-icon">{toast.type === 'success' ? '✓' : '⚠'}</div>
          {toast.message}
        </div>
      )}

      <div className="track-order-page">
        <div className="track-order-layout">

          <div className="track-search-section">
            <h2 className="track-title">Tra cứu trạng thái đơn hàng</h2>
            <div className="track-search-box">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng..."
                className="track-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="track-btn" onClick={handleSearch}>KIỂM TRA</button>
            </div>
          </div>

          <div className="track-history-section">
            <div className="history-header-flex">
              <h3 className="history-title">{hasSearched ? `Kết quả cho: "${searchQuery}"` : 'Lịch sử đơn hàng'}</h3>
              {hasSearched && <button className="clear-search-btn" onClick={clearSearch}>Quay lại</button>}
            </div>
            <hr className="history-divider" />

            {!hasSearched && (
              <div className="order-tabs">
                {TABS.map(tab => (
                  <button key={tab} className={`order-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
            )}

            <div className="history-table-wrapper">
              {loading ? (
                <div className="empty-orders">Đang tải đơn hàng...</div>
              ) : displayOrders.length > 0 ? (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th style={{ textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map((order) => (
                      <tr key={order.orderId || order.id} onClick={() => openOrderDetail(order)} className="clickable-row">
                        <td><strong className="order-id-link">{order.orderCode || `#${order.orderId}`}</strong></td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td><span className="order-price">{formatPrice(order.totalAmount || order.totalPrice)}</span></td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          {order.status === 'PENDING' && order.paymentStatus === 'UNPAID' && (
                            <span className="pay-status-badge unpaid">Chưa thanh toán</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {['PENDING', 'CONFIRMED'].includes(order.status) && order.paymentStatus !== 'UNPAID' ? (
                            <button onClick={(e) => openCancelModal(order.orderId || order.id, e)} className="btn-cancel-sm">
                              Hủy đơn
                            </button>
                          ) : order.status === 'PENDING' && order.paymentStatus === 'UNPAID' ? (
                            <button
                              className="btn-pay-now-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/payment/pending?orderId=${order.orderId || order.id}&orderCode=${encodeURIComponent(order.orderCode)}&amount=${order.totalAmount || 0}`);
                              }}
                            >
                              🏦 Thanh toán
                            </button>
                          ) : order.status === 'DELIVERED' && order.productIds && order.productIds.some(id => pendingReviews.includes(id)) ? (
                            <button 
                              onClick={(e) => { e.stopPropagation(); openOrderDetail(order); }} 
                              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              ⭐ Đánh giá
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#888' }}>-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-orders">Bạn chưa có đơn hàng nào.</div>
              )}
            </div>
          </div>
        </div>

        {cancelModalData.isOpen && (
          <div className="order-detail-overlay">
            <div className="cancel-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="cancel-modal-header">
                <h3>Yêu cầu hủy đơn hàng</h3>
                <button className="close-modal" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>✕</button>
              </div>
              <div className="cancel-modal-body">
                <div className="cancel-reasons-list">
                  {cancelReasonsList.map((reason, idx) => (
                    <label key={idx} className={`reason-radio-card ${cancelReason === reason ? 'active' : ''}`}>
                      <input type="radio" name="cancelReason" value={reason} checked={cancelReason === reason} onChange={(e) => setCancelReason(e.target.value)} />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
                {cancelReason === 'Khác' && (
                  <textarea className="other-reason-input" placeholder="Nhập lý do cụ thể..." rows="3" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
                )}
              </div>
              <div className="cancel-modal-footer">
                <button className="btn-cancel-action outline" onClick={() => setCancelModalData({ isOpen: false, orderId: null })}>Quay lại</button>
                <button className="btn-cancel-action primary" onClick={submitCancelRequest} disabled={cancelLoading}>
                  {cancelLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu Hủy'}
                </button>
              </div>
            </div>
          </div>
        )}

{/* Order */}
        {selectedOrder && !cancelModalData.isOpen && (
          <div className="order-detail-overlay" onClick={() => setSelectedOrder(null)}>
            <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Chi tiết đơn hàng: <span style={{ color: '#2563eb' }}>{selectedOrder.orderCode || `#${selectedOrder.orderId}`}</span></h3>
                <button className="close-modal" onClick={() => setSelectedOrder(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-status-box">
                  <span style={{ fontWeight: 600 }}>Trạng thái:</span>
                  <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>

                {selectedOrder.loadingDetails ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Đang tải chi tiết...</div>
                ) : (
                  <>
                    <div className="detail-customer-box">
                      <h4>Thông tin giao hàng</h4>
                      <p><strong>Khách hàng:</strong> {selectedOrder.fullName || 'N/A'}</p>
                      <p><strong>Điện thoại:</strong> {selectedOrder.phone || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                      <p style={{ marginTop: '8px' }}><strong>Thanh toán:</strong>{' '}
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: selectedOrder.paymentMethod === 'COD' ? '#fef3c7' : selectedOrder.paymentMethod === 'VNPAY' ? '#dbeafe' : selectedOrder.paymentMethod === 'MOMO' ? '#fce7f3' : '#f0fdf4',
                          color: selectedOrder.paymentMethod === 'COD' ? '#92400e' : selectedOrder.paymentMethod === 'VNPAY' ? '#1e40af' : selectedOrder.paymentMethod === 'MOMO' ? '#9d174d' : '#166534',
                        }}>
                          {selectedOrder.paymentMethod === 'COD' ? '💵 Tiền mặt (COD)' : selectedOrder.paymentMethod === 'VNPAY' ? '🏦 VNPay' : selectedOrder.paymentMethod === 'MOMO' ? '💜 MoMo' : selectedOrder.paymentMethod === 'BANK_TRANSFER' ? '🏦 Chuyển khoản' : selectedOrder.paymentMethod || 'Chưa rõ'}
                        </span>
                        {' '}
                        {selectedOrder.status === 'PENDING' && (
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: selectedOrder.paymentStatus === 'PAID' ? '#dcfce7' : '#fef2f2',
                            color: selectedOrder.paymentStatus === 'PAID' ? '#15803d' : '#b91c1c',
                          }}>
                            {selectedOrder.paymentStatus === 'PAID' ? '✅ Đã thanh toán' : '⚠️ Chưa thanh toán'}
                          </span>
                        )}
                      </p>
                      {selectedOrder.note && <p style={{ marginTop: '8px' }}><strong>Ghi chú:</strong> {selectedOrder.note}</p>}
                    </div>
                    <div className="detail-items-box">
                      <h4>Sản phẩm đã đặt</h4>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        <ul className="detail-item-list">
                          {selectedOrder.items.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <div className="item-name">{item.productName || item.name} <b>x{item.quantity || item.cartQuantity}</b></div>
                                <div className="item-price">{formatPrice((item.price || 0) * (item.quantity || item.cartQuantity || 1))}</div>
                              </div>
                              {selectedOrder.status === 'DELIVERED' && pendingReviews.includes(item.productId || item.id) && (
                                <Link 
                                  to={`/product/${item.productId || item.id}#reviews`} 
                                  style={{ background: '#f59e0b', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                                >
                                  ⭐ Đánh giá ngay
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : <p>Không có thông tin sản phẩm.</p>}
                      <div className="detail-total-row">
                        <span>Tổng thanh toán:</span>
                        <span className="total-red">{formatPrice(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </>
                )}

                {selectedOrder.status === 'PENDING' && selectedOrder.paymentStatus === 'UNPAID' && selectedOrder.paymentMethod === 'BANK_TRANSFER' && (
                  <div className="pending-pay-banner">
                    <span>🏦 Đơn hàng chưa được thanh toán. Tiếp tục để hoàn tất.</span>
                    <button
                      className="btn-pay-now-lg"
                      onClick={() => navigate(`/payment/pending?orderId=${selectedOrder.id || selectedOrder.orderId}&orderCode=${encodeURIComponent(selectedOrder.orderCode)}&amount=${selectedOrder.totalAmount || 0}`)}
                    >
                      Tiếp tục thanh toán
                    </button>
                  </div>
                )}

                {['PENDING', 'CONFIRMED'].includes(selectedOrder.status) && selectedOrder.paymentStatus !== 'UNPAID' && (
                  <button className="btn-cancel-lg" onClick={(e) => openCancelModal(selectedOrder.orderId || selectedOrder.id, e)}>
                    Yêu cầu hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TrackOrder;
