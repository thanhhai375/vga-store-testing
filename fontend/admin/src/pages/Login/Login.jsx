import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice';
import authService from '../../services/authService';
import './Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authService.login(form.username, form.password);
      const payload = res.data || res;

      if (!['ADMIN', 'STAFF'].includes(payload.role)) {
        setError('Tài khoản này không có quyền truy cập trang quản trị!');
        setLoading(false);
        return;
      }

      dispatch(loginSuccess({
        user: {
          username: payload.username,
          email: payload.email,
          role: payload.role,
          userId: payload.userId,
        },
        token: payload.token,
      }));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <img src="/images/logo.png" alt="VGA Store" className="login-logo-img" />
        </div>

        <h2 className="login-heading">Đăng nhập quản trị</h2>
        <p className="login-desc">Chỉ dành cho tài khoản Admin / Staff</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              className="form-control"
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? (
              <><span className="btn-spinner"></span> Đang đăng nhập...</>
            ) : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
