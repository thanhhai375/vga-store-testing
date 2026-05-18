import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import settingService from '../../services/settingService';
import { toastSuccess, toastError } from '../../utils/alertUtils';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    BANK_ID: '',
    BANK_ACC_NO: '',
    BANK_ACC_NAME: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingService.getSettings();
        const data = res.data || res;
        setSettings(s => ({ ...s, ...data }));
      } catch (err) {
        console.error('Failed to fetch settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingService.updateSettings(settings);
      toastSuccess('Lưu cài đặt thành công!');
    } catch (err) {
      toastError('Lưu cài đặt thất bại!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cài đặt Hệ thống</h1>
          <p className="page-subtitle">Quản lý các cấu hình chung của Cửa hàng</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="settings-grid">
{/* Configuration */}
        <div className="card settings-card">
          <div className="card-header">
            <h2 className="card-title">Cấu hình Thanh toán QR</h2>
            <p className="card-sub">Thông tin tài khoản nhận chuyển khoản</p>
          </div>
          
          <div className="form-group">
            <label>Ngân hàng nhận (Mã Ngân hàng hoặc Tên Ngắn)</label>
            <input 
              type="text" 
              className="form-control" 
              name="BANK_ID" 
              value={settings.BANK_ID || ''} 
              onChange={handleChange}
              placeholder="VD: Vietcombank, Techcombank, MB, 970436..." 
            />
            <small className="help-text">Nhập tên ngắn (như VCB, MB) hoặc ID BIN Ngân hàng để VietQR nhận diện.</small>
          </div>

          <div className="form-group">
            <label>Số tài khoản</label>
            <input 
              type="text" 
              className="form-control" 
              name="BANK_ACC_NO" 
              value={settings.BANK_ACC_NO || ''} 
              onChange={handleChange}
              placeholder="VD: 190312345678" 
            />
          </div>

          <div className="form-group">
            <label>Tên Chủ tài khoản</label>
            <input 
              type="text" 
              className="form-control" 
              name="BANK_ACC_NAME" 
              value={settings.BANK_ACC_NAME || ''} 
              onChange={handleChange}
              placeholder="VD: NGUYEN VAN A" 
            />
          </div>
        </div>

        <div className="card settings-preview-card">
          <div className="card-header">
            <h2 className="card-title">Preview VietQR</h2>
            <p className="card-sub">Khách hàng sẽ nhìn thấy mã này khi thanh toán đơn hàng.</p>
          </div>
          
          <div className="qr-preview-box">
            {settings.BANK_ID && settings.BANK_ACC_NO ? (
              <img 
                src={`https://img.vietqr.io/image/${settings.BANK_ID}-${settings.BANK_ACC_NO}-compact2.png?amount=1000000&accountName=${encodeURIComponent(settings.BANK_ACC_NAME)}&addInfo=VGA_DEMO`} 
                alt="Preview QR" 
                className="qr-img"
              />
            ) : (
              <div className="qr-img-placeholder">
                <SettingsIcon size={40} color="var(--text-muted)" />
                <p>Vui lòng nhập đủ Mã ngân hàng và Số tài khoản.</p>
              </div>
            )}
            <div className="qr-preview-info">
              <p>Mã QR tự động tạo (Auto-Gen)</p>
              <span>Số tiền và Nội dung chuyển khoản sẽ được <strong>thay đổi linh hoạt</strong> tương ứng từng đơn hàng khách đặt.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
