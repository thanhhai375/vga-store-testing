import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { LayoutDashboard, ShoppingCart, Monitor, Tags, Tag, BookOpen, Star, Users, LogOut, Settings } from 'lucide-react';
import { usePendingPayments } from '../../hooks/usePendingPayments';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { count: pendingCount } = usePendingPayments();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const NAV_ITEMS = [
    {
      group: 'TỔNG QUAN',
      items: [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      group: 'QUẢN LÝ BÁN HÀNG',
      items: [
        { path: '/orders', label: 'Đơn hàng', icon: <ShoppingCart size={20} />, badge: pendingCount },
        { path: '/products', label: 'Sản phẩm', icon: <Monitor size={20} /> },
        { path: '/categories', label: 'Danh mục', icon: <Tags size={20} /> },
        { path: '/brands', label: 'Thương hiệu', icon: <Tag size={20} /> },
      ]
    },
    {
      group: 'QUẢN LÝ NỘI DUNG',
      items: [
        { path: '/blogs', label: 'Bài viết', icon: <BookOpen size={20} /> },
        { path: '/reviews', label: 'Đánh giá', icon: <Star size={20} /> },
      ]
    },
    {
      group: 'HỆ THỐNG',
      items: [
        { path: '/users', label: 'Người dùng', icon: <Users size={20} /> },
        { path: '/settings', label: 'Cài đặt', icon: <Settings size={20} /> },
      ]
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/images/logo.png" alt="VGA Store" className="sidebar-logo-img" />
        <div className="sidebar-logo-text">
          <div className="logo-title">VGA Store</div>
          <div className="logo-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="nav-group">
            <div className="nav-group-label">{group.group}</div>
            {group.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'A'}</div>
          <div className="user-info">
            <div className="user-name">{user?.username || 'Admin'}</div>
            <div className="user-role">{user?.role || 'ADMIN'}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
