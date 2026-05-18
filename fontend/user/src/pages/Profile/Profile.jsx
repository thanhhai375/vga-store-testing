import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import { logout, updateUser } from '../../redux/authSlice';
import { toastSuccess, toastError, confirmDelete } from "../../utils/alertUtils";
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('info');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-layout">

        {/* ================= SIDEBAR ================= */}
        <aside className="profile-sidebar">
          <div className="sidebar-user-card">
            <img
              src={user?.picture || user?.avatar || '/default-avatar.png'}
              alt="User Avatar"
              className="user-avatar-img-large"
              onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + (user?.name || user?.username || 'U') + '&background=random' }}
            />
            <div className="user-short-info">
              <h3 className="user-display-name">{user?.name || user?.username}</h3>
              <p className="user-display-role">{user?.email}</p>
            </div>
          </div>

          <div className="sidebar-divider"></div>

          <nav className="profile-nav">
            <button className={`nav-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Hồ sơ cá nhân
            </button>
            <button className={`nav-btn ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Sổ địa chỉ
            </button>
            <button className={`nav-btn ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Đổi mật khẩu
            </button>
            <button className="nav-btn" onClick={() => navigate('/track-order')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Đơn hàng của tôi
            </button>

            <div className="sidebar-divider"></div>

            <button className="nav-btn logout-nav-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="profile-content-area">
          {activeTab === 'info'     && <ProfileInfo user={user} dispatch={dispatch} />}
          {activeTab === 'address'  && <ProfileAddress />}
          {activeTab === 'password' && <ProfilePassword />}
        </main>

      </div>
    </div>
  );
};

// ==========================================

// ==========================================
const ProfileInfo = ({ user, dispatch }) => {
  const [formData, setFormData] = useState({
    username: user?.username || user?.name || '',
    phone: user?.phone || '',
    gender: user?.gender || 'Nam',
    dob: user?.dob || ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res?.success) {
          const profile = res.data;
          setFormData({
            username: profile.username || profile.name || '',
            phone: profile.phone || '',
            gender: profile.gender || 'Nam',
            dob: profile.dob || ''
          });
          dispatch(updateUser(profile));
        }
      } catch (error) {
        console.error("Lỗi khi fetch profile", error);
      }
    };
    fetchProfile();
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await userService.updateProfile(formData);
      if (res?.success) {
        setMsg({ type: 'success', text: 'Cập nhật thông tin thành công!' });
        dispatch(updateUser(res.data));
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div className="tab-header">
        <h2 className="tab-title">Hồ sơ cá nhân</h2>
        <p className="tab-desc">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      {msg.text && <div className={`alert-message ${msg.type}`}>{msg.text}</div>}

      <form className="profile-form-grid" onSubmit={handleUpdate}>
        <div className="form-col-left">
          <div className="form-group">
            <label>Họ và Tên</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email liên kết</label>
            <div className="readonly-field">
              <span className="text-val">{user?.email || 'Chưa liên kết email'}</span>
              <span className="verify-badge">Đã xác minh</span>
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nhập số điện thoại..." />
          </div>
        </div>

        <div className="form-col-right">
          <div className="form-group">
            <label>Giới tính</label>
            <div className="radio-group-inline">
              <label className="radio-label">
                <input type="radio" name="gender" value="Nam" checked={formData.gender === 'Nam'} onChange={handleChange} />
                <span className="radio-text">Nam</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Nữ" checked={formData.gender === 'Nữ'} onChange={handleChange} />
                <span className="radio-text">Nữ</span>
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Khác" checked={formData.gender === 'Khác'} onChange={handleChange} />
                <span className="radio-text">Khác</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
        </div>

        <div className="form-full-width">
          <button type="submit" className="btn-submit-profile" disabled={loading}>
            {loading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// Address
// ==========================================
const ProfileAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ recipientName: '', phone: '', detailedAddress: '', isDefault: false });

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await userService.getProfile();
      if (res?.success && res.data.addresses) setAddresses(res.data.addresses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      toastError('Số điện thoại không hợp lệ! Phải là 10 số (vd: 0912345678).');
      return;
    }

    if (formData.recipientName.trim().length < 2) {
      toastError('Vui lòng nhập đầy đủ Họ tên thực!');
      return;
    }

    try {
      const res = await userService.addAddress(formData);
      if (res?.success) {
        setAddresses(res.data.addresses);
        setShowForm(false);
        setFormData({ recipientName: '', phone: '', detailedAddress: '', isDefault: false });
        fetchAddresses();
        toastSuccess("Thêm địa chỉ thành công!");
      }
    } catch (err) {
      toastError("Lỗi khi thêm địa chỉ!");
    }
  };

  const handleDeleteAddress = async (id) => {
    const isConfirmed = await confirmDelete("Bạn có chắc chắn muốn xóa địa chỉ này?");
    if (!isConfirmed) return;
    try {
      const res = await userService.deleteAddress(id);
      if (res?.success) {
        fetchAddresses();
        toastSuccess("Xóa địa chỉ thành công!");
      }
    } catch (err) {
      toastError("Xóa thất bại!");
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div className="tab-header flex-between">
        <div>
          <h2 className="tab-title">Sổ địa chỉ</h2>
          <p className="tab-desc">Quản lý danh sách địa chỉ nhận hàng của bạn</p>
        </div>
        <button className="btn-add-new" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hủy thêm mới' : '+ Thêm địa chỉ'}
        </button>
      </div>

      {showForm && (
        <form className="address-form-panel" onSubmit={handleAdd}>
          <div className="form-row-2">
            <div className="form-group">
              <label>Họ và Tên người nhận</label>
              <input type="text" value={formData.recipientName} onChange={e => setFormData({ ...formData, recipientName: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label>Địa chỉ chi tiết (Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/TP)</label>
            <textarea rows="3" value={formData.detailedAddress} onChange={e => setFormData({ ...formData, detailedAddress: e.target.value })} required></textarea>
          </div>
          <label className="checkbox-wrap">
            <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({ ...formData, isDefault: e.target.checked })} />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>
          <div className="form-actions-right">
            <button type="submit" className="btn-submit-profile sm">LƯU ĐỊA CHỈ</button>
          </div>
        </form>
      )}

      <div className="address-card-list">
        {loading ? <p className="text-muted">Đang tải dữ liệu...</p> : addresses.length === 0 ? <div className="empty-state">Bạn chưa lưu địa chỉ nào.</div> : (
          addresses.map(addr => (
            <div key={addr.id} className={`address-card-item ${addr.isDefault ? 'is-default' : ''}`}>
              <div className="addr-content">
                <div className="addr-head">
                  <span className="addr-name">{addr.recipientName}</span>
                  <span className="addr-separator">|</span>
                  <span className="addr-phone">{addr.phone}</span>
                </div>
                <p className="addr-detail-text">{addr.detailedAddress}</p>
                {addr.isDefault && <span className="default-tag">Mặc định</span>}
              </div>
              <div className="addr-actions">
                <button className="btn-text-danger" onClick={() => handleDeleteAddress(addr.id)}>Xóa</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// Password
// ==========================================
const ProfilePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp!' });
    }
    setLoading(true);
    try {
      const res = await userService.changePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
      if (res?.success) {
        setMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || err.message || 'Mật khẩu cũ không chính xác!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade-in">
      <div className="tab-header">
        <h2 className="tab-title">Đổi mật khẩu</h2>
        <p className="tab-desc">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
      </div>

      {msg.text && <div className={`alert-message ${msg.type}`}>{msg.text}</div>}

      <form className="password-form-box" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mật khẩu cũ</label>
          <input type="password" value={formData.oldPassword} onChange={e => setFormData({ ...formData, oldPassword: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input type="password" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} required minLength={6} />
        </div>
        <div className="form-group">
          <label>Xác nhận mật khẩu mới</label>
          <input type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
        </div>
        <button type="submit" className="btn-submit-profile mt-3" disabled={loading}>
          {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐỔI'}
        </button>
      </form>
    </div>
  );
};

// ==========================================
// Orders
// ==========================================
const ORDER_STATUS_LABEL = {
  PENDING:          { label: 'Chờ xử lý',         color: '#f59e0b' },
  CONFIRMED:        { label: 'Đã xác nhận',        color: '#2563eb' },
  SHIPPING:         { label: 'Đang giao',          color: '#7c3aed' },
  DELIVERED:        { label: 'Hoàn thành',         color: '#16a34a' },
  CANCEL_REQUESTED: { label: 'Yêu cầu hủy',       color: '#dc2626' },
  CANCELLED:        { label: 'Đã hủy',             color: '#6b7280' },
};

const ProfileOrders = ({ navigate }) => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/orders', { params: { page: 0, size: 50, sortBy: 'createdAt', direction: 'desc' } })
      .then(res => {
        const data = res?.data?.data || res?.data || res;
        setOrders(Array.isArray(data) ? data : (data.content || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isPaymentExpired = (order) => {
    if (!order.createdAt) return false;
    const created = new Date(order.createdAt).getTime();
    return Date.now() - created > 15 * 60 * 1000;
  };

  const handlePayAgain = (order) => {
    navigate(`/payment/pending?orderId=${order.id || order.orderId}&orderCode=${encodeURIComponent(order.orderCode)}&amount=${order.totalAmount || 0}`);
  };

  return (
    <div className="tab-pane fade-in">
      <div className="tab-header">
        <h2 className="tab-title">Đơn hàng của tôi</h2>
        <p className="tab-desc">Theo dõi trạng thái và lịch sử đơn hàng</p>
      </div>

      {loading ? (
        <p className="text-muted">Đang tải...</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => {
            const id          = order.id || order.orderId;
            const isPending   = order.status === 'PENDING' && order.paymentStatus === 'UNPAID';
            const isCancelled = order.status === 'CANCELLED' && order.note?.includes('[SYSTEM]: Payment expired');
            const statusInfo  = ORDER_STATUS_LABEL[order.status] || { label: order.status, color: '#6b7280' };

            return (
              <div key={id} className={`order-item-card${isPending ? ' order-item--pending-pay' : ''}`}>
                <div className="order-item-header">
                  <div>
                    <span className="order-code">{order.orderCode || `#${id}`}</span>
                    {isCancelled && <span className="badge-expired">Hết thời gian TT</span>}
                    {isPending   && <span className="badge-waiting-pay">Chờ thanh toán</span>}
                  </div>
                  <span className="order-status" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
                </div>

                <div className="order-item-info">
                  <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>{order.totalItems || 0} sản phẩm</span>
                  <strong className="order-total">{Number(order.totalAmount || 0).toLocaleString('vi-VN')}₫</strong>
                </div>

                {isPending && !isPaymentExpired(order) && (
                  <button className="btn-pay-again" onClick={() => handlePayAgain(order)}>
                    🏦 Tiếp tục thanh toán
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
