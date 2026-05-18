import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ShoppingCart, AlertTriangle, CreditCard } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { countNewOrders } from '../../utils/orderNewUtils';
import { usePendingPayments, refreshPendingPayments } from '../../hooks/usePendingPayments';
import './Topbar.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/products': 'Quản lý sản phẩm',
  '/categories': 'Quản lý danh mục',
  '/brands': 'Quản lý thương hiệu',
  '/orders': 'Quản lý đơn hàng',
  '/users': 'Quản lý người dùng',
  '/blogs': 'Quản lý bài viết',
  '/reviews': 'Quản lý đánh giá',
  '/settings': 'Cài đặt',
};

const Topbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useSelector(state => state.auth);
  const title     = PAGE_TITLES[location.pathname] || 'Admin';

  const [newOrderCount,      setNewOrderCount]      = useState(0);
  const [regularNotifs,      setRegularNotifs]      = useState([]);
  const [showNotifications,  setShowNotifications]  = useState(false);

  const { count: pendingPayCount, orders: pendingPayOrders } = usePendingPayments();

  const totalBadge = newOrderCount + pendingPayCount;

  const fetchNewOrders = useCallback(async () => {
    try {
      const res    = await axiosClient.get('/admin/orders', { params: { page: 0, size: 50, sortBy: 'createdAt', direction: 'desc' } });
      const data   = res?.data?.data || res?.data || res;
      const orders = Array.isArray(data) ? data : (data.content || []);

      const pendingNew = orders.filter(o => o.status === 'PENDING' && o.paymentStatus !== 'UNPAID');
      setNewOrderCount(countNewOrders(pendingNew));

      const recentNotifs = orders
        .filter(o => ['CANCEL_REQUESTED', 'CANCELLED'].includes(o.status))
        .slice(0, 6);
      setRegularNotifs(recentNotifs);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNewOrders();
    const interval = setInterval(fetchNewOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchNewOrders]);

  useEffect(() => {
    if (location.pathname === '/orders') {
      setTimeout(() => { fetchNewOrders(); refreshPendingPayments(); }, 1000);
    }
  }, [location.pathname, fetchNewOrders]);

  const allNotifications = [
    ...pendingPayOrders.slice(0, 5).map(o => ({ ...o, _type: 'PAYMENT_PENDING' })),
    ...regularNotifs.map(o => ({ ...o, _type: o.status })),
  ];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-notification-container">
          <div
            className="topbar-notification"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Thông báo"
          >
            <Bell size={20} color={totalBadge > 0 ? '#f59e0b' : 'var(--text-secondary)'} />
            {totalBadge > 0 && (
              <span className="notification-badge notification-badge--pulse">{totalBadge}</span>
            )}
          </div>

          {showNotifications && (
            <>
              <div className="notification-backdrop" onClick={() => setShowNotifications(false)} />
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Thông báo</h4>
                  {pendingPayCount > 0 && (
                    <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                      {pendingPayCount} đơn chờ xác nhận TT
                    </span>
                  )}
                </div>
                <div className="notification-list">
                  {allNotifications.length > 0 ? allNotifications.map(notif => (
                    <div
                      key={`${notif._type}-${notif.id}`}
                      className={`notification-item${notif._type === 'PAYMENT_PENDING' ? ' notif-payment' : ''}`}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/orders', { state: { openOrderId: notif.id } });
                      }}
                    >
                      <div className="notification-icon">
                        {notif._type === 'PAYMENT_PENDING'
                          ? <CreditCard size={18} color="#ef4444" />
                          : notif._type === 'CANCEL_REQUESTED'
                            ? <AlertTriangle size={18} color="#dc2626" />
                            : <ShoppingCart size={18} color="#2563eb" />
                        }
                      </div>
                      <div className="notification-content">
                        {notif._type === 'PAYMENT_PENDING' ? (
                          <p>
                            🏦 Đơn <strong>#{notif.orderCode}</strong> của{' '}
                            <strong>{notif.fullName || 'Khách'}</strong> chờ xác nhận chuyển khoản
                          </p>
                        ) : notif._type === 'CANCEL_REQUESTED' ? (
                          <p>
                            Đơn <strong>#{notif.orderCode}</strong> — khách yêu cầu hủy
                          </p>
                        ) : (
                          <p>
                            Đơn <strong>#{notif.orderCode}</strong> của{' '}
                            <strong>{notif.fullName || 'Khách'}</strong> vừa đặt
                          </p>
                        )}
                        <span className="notification-time">
                          {new Date(notif.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="notification-empty">Không có thông báo nào</div>
                  )}
                </div>
                <div className="notification-footer" onClick={() => { setShowNotifications(false); navigate('/orders'); }}>
                  Xem tất cả đơn hàng →
                </div>
              </div>
            </>
          )}
        </div>

        <div className="topbar-time">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        <div className="topbar-user">
          <div className="topbar-avatar">{user?.username?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div className="topbar-username">{user?.username || 'Admin'}</div>
            <div className="topbar-role">{user?.role || 'ADMIN'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
