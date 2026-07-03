import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSuccess } from '../../redux/authSlice';
import { toastError, toastSuccess, toastInfo } from '../../utils/alertUtils';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(true);
      setShowPassword(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setUsername('');
      setRememberMe(true);
    }
  }, [isOpen]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await res.json();

        const { default: authService } = await import('../../services/authService');
        const beRes = await authService.googleLogin({
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        });

        const payload = beRes.data || beRes;
        
        dispatch(loginSuccess({
          user: payload.user || userInfo,
          token: payload.token,
          rememberMe: true
        }));

        onClose();
      } catch (error) {
        console.error("Lỗi lấy thông tin user từ google:", error);
        toastError(error.response?.data?.message || "Hệ thống bảo mật từ chối đăng nhập Google tạm thời!");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => console.error('Login Failed:', error)
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: authService } = await import('../../services/authService');
      
      if (isLogin) {
        const res = await authService.login(email, password);
        const payload = res.data || res;

        const userObj = payload.user || {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName || payload.username
        };
        dispatch(loginSuccess({ user: userObj, token: payload.token, rememberMe }));
        onClose();
      } else {
        if (password !== confirmPassword) {
          toastError('Mật khẩu xác nhận không khớp!');
          setLoading(false);
          return;
        }
        await authService.register({ username: username, email, password, fullName });
        toastSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setUsername('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Lỗi Auth:', err);
      let errorMsg = err.response?.data?.message || err.message || (isLogin ? 'Tài khoản hoặc mật khẩu không đúng!' : 'Đăng ký thất bại!');
      if (err.response?.data?.data && typeof err.response.data.data === 'object') {
        const errorDetails = Object.values(err.response.data.data);
        if (errorDetails.length > 0) {
          errorMsg = errorDetails.join(', ');
        }
      }
      toastError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = () => {
    if (email || password || confirmPassword || fullName || username) return;
    onClose();
  };

  return (
    <div className="auth-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        <button className="auth-close-btn" onClick={onClose} title="Đóng">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-header">
          <div className="auth-tabs">
            <button type="button" className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>ĐĂNG NHẬP</button>
            <button type="button" className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>ĐĂNG KÝ</button>
          </div>
        </div>

        <div className="auth-body">
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="auth-input-group">
                  <label>Tên đăng nhập</label>
                  <input type="text" placeholder="Nhập tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="auth-input-group">
                  <label>Họ và Tên</label>
                  <input type="text" placeholder="Nhập họ và tên của bạn" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              </>
            )}

            {isLogin ? (
              <div className="auth-input-group">
                <label>Tài khoản / Email</label>
                <input type="text" placeholder="Nhập tài khoản hoặc email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            ) : (
              <div className="auth-input-group">
                <label>Email</label>
                <input type="email" placeholder="Nhập email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            )}

            <div className="auth-input-group">
              <label>Mật khẩu</label>
              <div className="password-wrapper">
                <input type={showPassword ? 'text' : 'password'} placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="auth-input-group">
                <label>Xác nhận mật khẩu (Confirm password)</label>
                <div className="password-wrapper">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Xac nhan mat khau" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="auth-options">
                <label className="auth-remember"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /><span>Ghi nhớ đăng nhập</span></label>
                <a href="#forgot" className="auth-forgot" onClick={(e) => e.preventDefault()}>Quên mật khẩu?</a>
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : (isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN')}
            </button>
          </form>

          <div className="auth-divider"><span>Hoặc đăng nhập bằng</span></div>

          <div className="auth-social">
            <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin} disabled={loading}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Google
            </button>
            <button type="button" className="social-btn facebook-btn" onClick={() => toastInfo("Tính năng Đăng nhập bằng Facebook đang được thiết lập!")} disabled aria-disabled="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
