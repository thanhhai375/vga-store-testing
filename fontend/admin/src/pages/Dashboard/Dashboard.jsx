import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart
} from 'recharts';
import { Package, ShoppingBag, DollarSign, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { isOrderNew } from '../../utils/orderNewUtils';
import './Dashboard.css';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + '₫';

// Statistics
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-header">
      <h3 className="dash-stat-title">{title}</h3>
      <div className={`dash-stat-icon ${colorClass}`}>{icon}</div>
    </div>
    <div className="dash-stat-value">{value ?? '...'}</div>
  </div>
);

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', cls: 'badge-warning' },
  CONFIRMED: { label: 'Đã xác nhận', cls: 'badge-info' },
  SHIPPING: { label: 'Đang giao', cls: 'badge-primary' },
  DELIVERED: { label: 'Hoàn thành', cls: 'badge-success' },
  CANCEL_REQUESTED: { label: 'Yêu cầu Hủy', cls: 'badge-danger' },
  CANCELLED: { label: 'Đã hủy', cls: 'badge-dark' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const [period, setPeriod] = useState('6months');
  const [chartsData, setChartsData] = useState({ chartData: [], brandData: [] });

  const [loadingTop, setLoadingTop] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);

  // Total
  useEffect(() => {
    const fetchTopData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axiosClient.get('/admin/dashboard/stats'),
          axiosClient.get('/admin/orders', { params: { page: 0, size: 8, sortBy: 'createdAt', direction: 'desc', status: 'PENDING' } }),
        ]);
        const statsData = statsRes?.data?.data || statsRes?.data || statsRes;
        setStats(statsData);
        const ordersData = ordersRes?.data?.data || ordersRes?.data || ordersRes;
        const list = Array.isArray(ordersData) ? ordersData : (ordersData.content || []);
        setRecentOrders(list.slice(0, 8));
      } catch (err) { console.error('Dashboard stats error:', err); }
      finally { setLoadingTop(false); }
    };
    fetchTopData();
  }, []);


  useEffect(() => {
    const fetchCharts = async () => {
      setLoadingChart(true);
      try {
        const res = await axiosClient.get(`/admin/dashboard/charts?period=${period}`);
        setChartsData(res.data?.data || res.data || res);
      } catch (err) { console.error(err); }
      finally { setLoadingChart(false); }
    };
    fetchCharts();
  }, [period]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>VGA Store Performance Dashboard</h1>
          <p>Tổng quan tình hình kinh doanh</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="dash-stats-grid">
        <StatCard
          title="Tổng đơn hàng"
          value={stats?.totalOrders || 0}
          colorClass="icon-purple"
          icon={<ShoppingBag size={22} />}
        />
        <StatCard
          title="Đơn mới hôm nay"
          value={stats?.todayOrders || 0}
          colorClass="icon-yellow"
          icon={<Package size={22} />}
        />
        <StatCard
          title="Tổng doanh thu"
          value={stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '0₫'}
          colorClass="icon-green"
          icon={<DollarSign size={22} />}
        />
        <StatCard
          title="Doanh thu hôm nay"
          value={stats?.todayRevenue ? formatPrice(stats.todayRevenue) : '0₫'}
          colorClass="icon-blue"
          icon={<Activity size={22} />}
        />
      </div>

      <div className="dash-charts-grid">
        {loadingChart ? (
          <div className="spinner" style={{ gridColumn: '1 / -1', margin: '100px auto' }}></div>
        ) : (
          <>
            <div className="dash-chart-card lg-col">
              <div className="chart-header-flex">
                <h3 className="chart-title">Tiến độ doanh thu</h3>
                <select className="dash-filter-select" value={period} onChange={e => setPeriod(e.target.value)}>
                  <option value="today">Hôm nay (24h)</option>
                  <option value="7days">7 ngày qua</option>
                  <option value="1month">30 ngày qua</option>
                  <option value="6months">6 tháng qua</option>
                  <option value="1year">1 năm qua</option>
                </select>
              </div>

              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartsData.chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => val > 0 ? `${(val / 1000000).toFixed(1)}M` : '0'} />
                    <Tooltip formatter={(value) => formatPrice(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-chart-card">
              <div className="chart-header-flex">
                <h3 className="chart-title">Hoàn thành & Hủy đơn</h3>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartsData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="cancelled" barSize={12} fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Hủy đơn" />
                    <Bar dataKey="delivered" barSize={12} fill="#10b981" radius={[4, 4, 0, 0]} name="Hoàn thành" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-chart-card">
              <div className="chart-header-flex">
                <h3 className="chart-title">Lượng bán theo Hãng</h3>
              </div>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  {chartsData.brandData && chartsData.brandData.length > 0 ? (
                    <BarChart data={chartsData.brandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="sold" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} name="Đã bán (cái)" />
                    </BarChart>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: '13px' }}>Chưa có dữ liệu</div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dash-recent-orders">
        <div className="recent-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={22} color="#f59e0b" /> Đơn hàng chờ xử lý
          </h3>
          <a href="/orders" className="view-all-link" onClick={(e) => { e.preventDefault(); navigate('/orders'); }}>Xem tất cả ›</a>
        </div>

        {loadingTop ? (
          <div className="spinner" style={{ margin: '40px auto' }}></div>
        ) : recentOrders.length === 0 ? (
          <p className="no-data">Chưa có dữ liệu đơn hàng</p>
        ) : (
          <div className="table-responsive">
            <table className="recent-table">
              <thead>
                <tr>
                  <th>MÃ ĐƠN HÀNG</th>
                  <th>KHÁCH HÀNG</th>
                  <th>NGÀY ĐẶT</th>
                  <th>TRẠNG THÁI</th>
                  <th style={{ textAlign: 'right' }}>TỔNG TIỀN</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => {
                  const st = STATUS_MAP[o.status] || { label: o.status, cls: 'badge-secondary' };
                  const isNew = isOrderNew(o.orderId || o.id);
                  return (
                    <tr
                      key={o.orderId || o.id}
                      className={isNew ? 'row-new-order' : ''}
                      onClick={() => navigate('/orders')}
                      style={{ cursor: 'pointer' }}
                      title="Nhấn để xem quản lý đơn hàng"
                    >
                      <td className="fw-500">
                        {o.orderCode || `#${o.orderId || o.id}`}
                        {isNew && <span className="badge-new">MỚI</span>}
                      </td>
                      <td>{o.fullName || o.user?.username || '--'}</td>
                      <td className="text-muted">{o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                      <td><span className={`status-dot ${st.cls}`}>{st.label}</span></td>
                      <td className="text-right fw-600">{o.totalAmount ? formatPrice(o.totalAmount) : '--'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
