import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import './PaymentPending.css';

const POLL_INTERVAL  = 5000;
const EXPIRE_MINUTES = 15;

/* ── Inline SVG Icons ── */
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#f0fdf4" />
    <path d="M13 27l10 10 17-19" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBank = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconQR = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
    <line x1="17" y1="17" x2="21" y2="17"/><line x1="21" y1="14" x2="21" y2="17"/>
  </svg>
);

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();

  const orderId   = searchParams.get('orderId');
  const orderCode = searchParams.get('orderCode');
  const amount    = searchParams.get('amount');

  const [bankInfo,     setBankInfo]     = useState({});
  const [secondsLeft,  setSecondsLeft]  = useState(EXPIRE_MINUTES * 60);
  const [showSuccess,  setShowSuccess]  = useState(false);
  const [expired,      setExpired]      = useState(false);
  const [copiedField,  setCopiedField]  = useState('');

  const pollRef  = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    axiosClient.get('/settings/public')
      .then(res => {
        const d   = res.data || res || {};
        const get = k => d[k] || d[k.toLowerCase()] || d[k.toUpperCase()] || '';
        setBankInfo({ bankId: get('BANK_ID'), accountNumber: get('BANK_ACC_NO'), accountName: get('BANK_ACC_NAME') });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const check = async () => {
      try {
        const res  = await axiosClient.get(`/orders/${orderId}`);
        const data = res?.data?.data || res?.data || res || {};
        if (data.paymentStatus === 'PAID' || data.status === 'CONFIRMED') { setShowSuccess(true); return; }
        if (data.status === 'CANCELLED') { setExpired(true); return; }
        if (data.createdAt) {
          const rem = Math.max(0, Math.floor((new Date(data.createdAt).getTime() + EXPIRE_MINUTES * 60_000 - Date.now()) / 1000));
          if (rem <= 0) { setExpired(true); return; }
          setSecondsLeft(rem);
        }
      } catch {}
    };
    check();
    pollRef.current = setInterval(async () => {
      try {
        const res  = await axiosClient.get(`/orders/${orderId}`);
        const data = res?.data?.data || res?.data || res || {};
        if (data.paymentStatus === 'PAID' || data.status === 'CONFIRMED') {
          clearInterval(pollRef.current); clearInterval(timerRef.current); setShowSuccess(true);
        } else if (data.status === 'CANCELLED') {
          clearInterval(pollRef.current); clearInterval(timerRef.current); setExpired(true);
        }
      } catch {}
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [orderId]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); clearInterval(pollRef.current); setExpired(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = ((EXPIRE_MINUTES * 60 - secondsLeft) / (EXPIRE_MINUTES * 60)) * 100;

  const copy = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const qrUrl = bankInfo.bankId && bankInfo.accountNumber
    ? `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-qr_only.png?amount=${amount || 0}&addInfo=${orderCode || ''}&accountName=${encodeURIComponent(bankInfo.accountName || '')}`
    : null;

  /* ── SUCCESS ── */
  if (showSuccess) return (
    <div className="pp-scene">
      <div className="pp-result-card">
        <div className="pp-result-icon pp-result-icon--success"><IconCheck /></div>
        <h2 className="pp-result-title">Thanh toán thành công</h2>
        <p className="pp-result-sub">Đơn hàng <strong>{orderCode}</strong> đã được xác nhận và đang được xử lý.</p>
        <div className="pp-result-order-box">
          <span>Mã đơn hàng</span>
          <strong>{orderCode}</strong>
        </div>
        <button className="pp-btn-primary" onClick={() => navigate('/track-order')}>Xem trạng thái đơn hàng</button>
      </div>
    </div>
  );

  /* ── EXPIRED ── */
  if (expired) return (
    <div className="pp-scene">
      <div className="pp-result-card">
        <div className="pp-result-icon pp-result-icon--expired">
          <IconClock />
        </div>
        <h2 className="pp-result-title">Hết thời gian thanh toán</h2>
        <p className="pp-result-sub">Phiên thanh toán đã hết hiệu lực. Đơn hàng của bạn đã bị hủy và hàng đã được hoàn kho.</p>
        <button className="pp-btn-primary" onClick={() => navigate('/track-order')}>Xem đơn hàng</button>
        <button className="pp-btn-ghost" onClick={() => navigate('/products')}>Tiếp tục mua sắm</button>
      </div>
    </div>
  );

  /* ── MAIN ── */
  return (
    <div className="pp-scene">
      <div className="pp-wrapper">

        {/* Header */}
        <div className="pp-topbar">
          <div className="pp-topbar-brand">
            <span className="pp-topbar-logo">VGA Store</span>
          </div>
          <div className="pp-topbar-secure">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Thanh toán bảo mật
          </div>
        </div>

        {/* Main content */}
        <div className="pp-main">

          {/* LEFT — QR */}
          <div className="pp-left">
            <div className="pp-qr-card">
              <div className="pp-qr-label">
                <span className="pp-qr-icon"><IconQR /></span>
                <span>Quét mã QR để thanh toán</span>
              </div>

              <div className="pp-qr-frame">
                {qrUrl
                  ? <img src={qrUrl} alt="QR thanh toán" className="pp-qr-img" />
                  : (
                    <div className="pp-qr-skeleton">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" width="40" height="40">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      <span>Đang tải...</span>
                    </div>
                  )
                }
              </div>

              <p className="pp-qr-apps">Mở app ngân hàng · Chọn Quét QR · Thanh toán</p>
            </div>

            {/* Timer */}
            <div className={`pp-timer-card${secondsLeft < 60 ? ' pp-timer-card--urgent' : ''}`}>
              <div className="pp-timer-row">
                <span className="pp-timer-label">Thời gian còn lại</span>
                <span className="pp-timer-value">{fmt(secondsLeft)}</span>
              </div>
              <div className="pp-progress-track">
                <div className="pp-progress-fill" style={{ width: `${100 - pct}%` }} />
              </div>
            </div>
          </div>

          {/* RIGHT — Bank info */}
          <div className="pp-right">
            <div className="pp-info-card">
              <div className="pp-info-header">
                <span className="pp-info-header-icon"><IconBank /></span>
                <div>
                  <h3 className="pp-info-title">Thông tin chuyển khoản</h3>
                  <p className="pp-info-sub">Chuyển khoản đúng thông tin bên dưới</p>
                </div>
              </div>

              <div className="pp-fields">
                <div className="pp-field">
                  <span className="pp-field-label">Ngân hàng</span>
                  <div className="pp-field-value">
                    <strong>{bankInfo.bankId || '—'}</strong>
                  </div>
                </div>

                <div className="pp-field">
                  <span className="pp-field-label">Số tài khoản</span>
                  <div className="pp-field-value pp-field-value--copy" onClick={() => copy(bankInfo.accountNumber, 'acc')}>
                    <strong>{bankInfo.accountNumber || '—'}</strong>
                    <button className={`pp-copy-btn${copiedField === 'acc' ? ' pp-copy-btn--done' : ''}`} title="Sao chép">
                      {copiedField === 'acc'
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <IconCopy />
                      }
                    </button>
                  </div>
                </div>

                <div className="pp-field">
                  <span className="pp-field-label">Chủ tài khoản</span>
                  <div className="pp-field-value">
                    <strong>{bankInfo.accountName || '—'}</strong>
                  </div>
                </div>

                <div className="pp-field pp-field--highlight">
                  <span className="pp-field-label">Số tiền</span>
                  <div className="pp-field-value">
                    <strong className="pp-amount">{Number(amount || 0).toLocaleString('vi-VN')}₫</strong>
                  </div>
                </div>

                <div className="pp-field">
                  <span className="pp-field-label">Nội dung CK</span>
                  <div className="pp-field-value pp-field-value--copy" onClick={() => copy(orderCode, 'code')}>
                    <strong className="pp-transfer-note">{orderCode}</strong>
                    <button className={`pp-copy-btn${copiedField === 'code' ? ' pp-copy-btn--done' : ''}`} title="Sao chép">
                      {copiedField === 'code'
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <IconCopy />
                      }
                    </button>
                  </div>
                </div>
              </div>

              <div className="pp-notice">
                <span className="pp-notice-icon"><IconInfo /></span>
                <p>Nhập <strong>chính xác</strong> nội dung chuyển khoản để đơn hàng được xác nhận tự động.</p>
              </div>
            </div>

            {/* Polling status */}
            <div className="pp-status-bar">
              <span className="pp-pulse-dot" />
              <span>Đang theo dõi thanh toán — tự động cập nhật</span>
            </div>
          </div>
        </div>

        {/* Order badge */}
        <div className="pp-order-footer">
          Mã đơn hàng: <strong>{orderCode}</strong>
        </div>

      </div>
    </div>
  );
}
