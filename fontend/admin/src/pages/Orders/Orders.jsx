import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import orderService from '../../services/orderService';
import { toastSuccess, toastError, confirmAction } from '../../utils/alertUtils';
import axiosClient from '../../api/axiosClient';
import { markOrdersAsSeen, isOrderNew } from '../../utils/orderNewUtils';
import { refreshPendingPayments } from '../../hooks/usePendingPayments';
import './Orders.css';

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', cls: 'badge-warning' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'badge-info' },
  SHIPPING: { label: 'Đang giao', cls: 'badge-primary' },
  DELIVERED: { label: 'Hoàn thành', cls: 'badge-success' },
  CANCEL_REQUESTED: { label: 'Khách Yêu Cầu Hủy', cls: 'badge-danger' },
  CANCELLED: { label: 'Đã hủy', cls: 'badge-dark' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');

  // Details
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const SIZE = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAll({ page, size: SIZE, status: filter || undefined });

      const raw = res?.data?.data || res?.data || res;
      const list = Array.isArray(raw) ? raw : (raw.content || []);
      const totalPg = raw.totalPages || (Array.isArray(raw) ? 1 : 1);
      setOrders(list);
      setTotal(totalPg);
      // Retrieve all
      markOrdersAsSeen(list.map(o => o.orderId || o.id));
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const location = useLocation();

  useEffect(() => { fetchOrders(); }, [page, filter]);

  useEffect(() => {
    if (location.state?.openOrderId) {
      viewOrderDetails(location.state.openOrderId);
      window.history.replaceState({}, document.title); // Delete
    }
  }, [location.state?.openOrderId]);

  const handleStatusChange = async (id, status) => {
    if (status === 'CANCELLED') {
      const ok = await confirmAction('Hủy đơn hàng?', 'Duyệt HỦY đơn hàng này? Số lượng sản phẩm sẽ được tự động hoàn về kho.');
      if (!ok) return;
    } else if (status === 'PENDING') {
      const ok = await confirmAction('Từ chối Hủy?', 'Từ chối yêu cầu hủy? Đơn hàng sẽ quay về trạng thái Chờ xử lý.');
      if (!ok) return;
    }
    try {
      await orderService.updateStatus(id, status);
      if (status === 'CANCELLED') toastSuccess('Đã duyệt Hủy đơn hàng và hoàn kho!');
      fetchOrders();
      if (isModalOpen) setIsModalOpen(false);
    } catch { toastError('Cập nhật thất bại!'); }
  };

  const handleConfirmPayment = async (orderId, paymentId) => {
    const ok = await confirmAction(
      'Xác nhận đã nhận tiền?',
      'Bạn xác nhận đã nhận được tiền chuyển khoản? Đơn hàng sẽ chuyển sang trạng thái Đã xác nhận.'
    );
    if (!ok) return;
    try {
      if (paymentId) {
        await axiosClient.post(`/payments/admin/${paymentId}/status?status=SUCCESS`);
      } else {
        await orderService.updateStatus(orderId, 'CONFIRMED');
      }
      toastSuccess('Đã xác nhận thanh toán thành công!');
      refreshPendingPayments();
      fetchOrders();
      if (isModalOpen) viewOrderDetails(orderId);
    } catch { toastError('Xác nhận thất bại!'); }
  };

  // Details
  const viewOrderDetails = async (id) => {
    setIsModalOpen(true);
    setSelectedOrder({ loading: true, id });
    try {
      const res = await axiosClient.get(`/admin/orders/${id}`);
      const data = res.data?.data || res.data || res;
      setSelectedOrder(data);
    } catch (err) {
      toastError("Không thể tải chi tiết đơn hàng");
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đơn hàng</h1>
          <p className="page-subtitle">Theo dõi và xử lý đơn hàng</p>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <select className="form-control" style={{ width: 'auto' }} value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#MÃ ĐƠN</th>
                  <th>Khách hàng</th>
                  <th>SĐT</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Không có đơn hàng</td></tr>
                ) : orders.map(o => {
                  const st = STATUS_MAP[o.status] || { label: o.status, cls: 'badge-secondary' };
                  const orderIsNew = isOrderNew(o.orderId || o.id);
                  return (
                    <tr key={o.orderId || o.id}
                      onClick={() => viewOrderDetails(o.orderId || o.id)}
                      style={{ cursor: 'pointer' }}
                      className={[
                        orderIsNew ? 'row-new-order' : '',
                        (o.status === 'PENDING' && o.paymentStatus === 'UNPAID') ? 'row-pending-payment' : ''
                      ].filter(Boolean).join(' ')}
                    >
                      <td>
                        <strong style={{ color: '#2563eb' }}>{o.orderCode || `#${o.orderId}`}</strong>
                        {orderIsNew && <span className="badge-new">MỚI</span>}
                        {(o.status === 'PENDING' && o.paymentStatus === 'UNPAID') && (
                          <span className="badge-payment-pending">Chờ TT</span>
                        )}
                      </td>
                      <td>{o.fullName || o.user?.username || '--'}</td>
                      <td>{o.phone || o.phoneNumber || '--'}</td>
                      <td>{o.totalAmount ? `${Number(o.totalAmount).toLocaleString('vi-VN')}đ` : '--'}</td>
                      <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                      <td onClick={e => e.stopPropagation()}>
                        {(o.status === 'PENDING' && o.paymentStatus === 'UNPAID') ? (
                          <button
                            className="btn-confirm-payment"
                            onClick={() => handleConfirmPayment(o.orderId || o.id, null)}
                          >
                            ✓ Xác nhận TT
                          </button>
                        ) : o.status === 'CANCEL_REQUESTED' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button onClick={() => handleStatusChange(o.orderId || o.id, 'CANCELLED')} className="btn-approve">✓ Duyệt Hủy</button>
                            <button onClick={() => handleStatusChange(o.orderId || o.id, 'PENDING')} className="btn-reject">✕ Từ chối</button>
                          </div>
                        ) : (
                          <select
                            className="form-control status-select"
                            value={o.status}
                            onChange={e => handleStatusChange(o.orderId || o.id, e.target.value)}
                            disabled={o.status === 'CANCELLED' || o.status === 'DELIVERED'}
                          >
                            {Object.entries(STATUS_MAP).filter(([k]) => k !== 'CANCEL_REQUESTED').map(([k, v]) => (
                              <option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

{/* Order */}
        {isModalOpen && selectedOrder && (
          <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="admin-modal-box" onClick={e => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h3>Chi tiết đơn hàng {selectedOrder.orderCode ? `#${selectedOrder.orderCode}` : ''}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    onClick={() => {
                      const maskPhone = (p) => p && p.length >= 8 ? p.substring(0, 3) + '****' + p.substring(p.length - 3) : 'N/A';
                      const maskEmail = (e) => {
                        if (!e || e === 'Không có' || e === 'Khách Vãng Lai' || !e.includes('@')) return 'N/A';
                        const [name, domain] = e.split('@');
                        if (name.length <= 3) return `${name[0]}***@${domain}`;
                        return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
                      };

                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>In đơn hàng ${selectedOrder.orderCode || selectedOrder.orderId}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 10px; }
                              .header h2 { margin: 0; font-size: 24px; text-transform: uppercase; }
                              .header p { margin: 5px 0; font-size: 14px; color: #666; }
                              .info-section { margin-bottom: 20px; }
                              .info-section p { margin: 5px 0; font-size: 14px; }
                              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
                              th { background-color: #f8fafc; font-weight: bold; text-transform: uppercase; }
                              .total-section { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
                              .note-section { margin-top: 30px; padding: 15px; border: 1px dashed #ccc; background: #fafafa; font-size: 14px; }
                            </style>
                          </head>
                          <body onload="window.print();window.close()">
                            <div class="header">
                              <h2>VGA STORE - PHIẾU GIAO HÀNG</h2>
                              <p>Ngày in: ${new Date().toLocaleString('vi-VN')}</p>
                            </div>
                            <div class="info-section">
                              <p><strong>Mã đơn hàng:</strong> ${selectedOrder.orderCode || '#' + selectedOrder.orderId}</p>
                              <p><strong>Người nhận:</strong> ${selectedOrder.fullName || 'Khách hàng'}</p>
                              <p><strong>Số điện thoại:</strong> ${maskPhone(selectedOrder.phone)}</p>
                              <p><strong>Địa chỉ giao hàng:</strong> ${selectedOrder.shippingAddress || 'N/A'}</p>
                              <p><strong>Email Tài khoản:</strong> ${maskEmail(selectedOrder.email)}</p>
                            </div>
                            <table>
                              <thead>
                                <tr>
                                  <th>STT</th>
                                  <th>Sản phẩm</th>
                                  <th style="text-align: center;">SL</th>
                                  <th style="text-align: right;">Đơn giá</th>
                                  <th style="text-align: right;">Thành tiền</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${selectedOrder.items?.map((item, idx) => `
                                  <tr>
                                    <td style="text-align: center;">${idx + 1}</td>
                                    <td>${item.productName || item.name}</td>
                                    <td style="text-align: center;">${item.quantity || item.cartQuantity || 1}</td>
                                    <td style="text-align: right;">${Number(item.price).toLocaleString('vi-VN')}đ</td>
                                    <td style="text-align: right;">${Number(item.price * (item.quantity || item.cartQuantity || 1)).toLocaleString('vi-VN')}đ</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                            <div class="total-section">
                              TỔNG THANH TOÁN: ${Number(selectedOrder.totalAmount).toLocaleString('vi-VN')}đ
                            </div>
                            ${selectedOrder.note && !selectedOrder.note.includes('[LÝ DO HỦY]') ? `
                            <div class="note-section">
                              <strong>Ghi chú của khách hàng:</strong><br/>
                              ${selectedOrder.note}
                            </div>
                            ` : ''}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }} 
                    className="btn-print" 
                    title="In phiếu giao hàng"
                  >
                    🖨️ In Đơn
                  </button>
                  <button className="close-btn" style={{ padding: '4px', fontSize: '20px' }} onClick={() => setIsModalOpen(false)}>✕</button>
                </div>
              </div>

              <div className="admin-modal-body">
                {selectedOrder.loading ? (
                  <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu...</p>
                ) : (
                  <>
                    {selectedOrder.note && selectedOrder.note.includes('[LÝ DO HỦY]') && (
                      <div className="admin-cancel-reason">
                        <strong>Lý do khách yêu cầu hủy:</strong> {selectedOrder.note.split('[LÝ DO HỦY]:')[1]}
                      </div>
                    )}

                    <div className="admin-info-grid">
                      <div className="admin-info-box">
                        <h4>Thông tin Khách hàng</h4>
                        <p><strong>Tên:</strong> {selectedOrder.fullName || 'N/A'}</p>
                        <p><strong>SĐT:</strong> {selectedOrder.phone || 'N/A'}</p>
                        <p><strong>Email Tài Khoản:</strong> {selectedOrder.email || 'Khách Vãng Lai'}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress || 'N/A'}</p>
                        <p><strong>Thanh toán:</strong>{' '}
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: selectedOrder.paymentMethod === 'COD' ? '#fef3c7' : selectedOrder.paymentMethod === 'VNPAY' ? '#dbeafe' : selectedOrder.paymentMethod === 'MOMO' ? '#fce7f3' : '#f3f4f6',
                            color: selectedOrder.paymentMethod === 'COD' ? '#92400e' : selectedOrder.paymentMethod === 'VNPAY' ? '#1e40af' : selectedOrder.paymentMethod === 'MOMO' ? '#9d174d' : '#374151',
                          }}>
                            {selectedOrder.paymentMethod === 'COD' ? '💵 Tiền mặt (COD)' : selectedOrder.paymentMethod === 'VNPAY' ? '🏦 VNPay' : selectedOrder.paymentMethod === 'MOMO' ? '💜 MoMo' : selectedOrder.paymentMethod || 'Chưa rõ'}
                          </span>
                        </p>
                        {selectedOrder.note && !selectedOrder.note.includes('[LÝ DO HỦY]') && (
                          <p><strong>Ghi chú:</strong> {selectedOrder.note}</p>
                        )}
                      </div>
                    </div>

                    <h4>Danh sách Sản phẩm</h4>
                    <table className="admin-items-table">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>SL</th>
                          <th>Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.productName || item.name}</td>
                            <td>{item.quantity || 1}</td>
                            <td>{item.price ? `${Number(item.price).toLocaleString('vi-VN')}đ` : '0đ'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="admin-modal-total">
                      Tổng tiền: <span>{selectedOrder.totalAmount ? `${Number(selectedOrder.totalAmount).toLocaleString('vi-VN')}đ` : '0đ'}</span>
                    </div>

                    {selectedOrder.paymentStatus === 'UNPAID' && selectedOrder.status === 'PENDING' && (
                      <div style={{ marginTop: 20, padding: '16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10 }}>
                        <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 10 }}>⚠️ Đơn hàng này đang chờ xác nhận thanh toán chuyển khoản</p>
                        <button
                          className="btn-confirm-payment"
                          style={{ width: '100%', padding: '12px' }}
                          onClick={() => handleConfirmPayment(selectedOrder.id || selectedOrder.orderId, selectedOrder.paymentId)}
                        >
                          ✓ Xác nhận đã nhận tiền chuyển khoản
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
