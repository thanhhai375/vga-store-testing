import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16}}>
    <div style={{fontSize:72}}>404</div>
    <h1 style={{fontSize:24, fontWeight:700, color:'var(--text-primary)'}}>Trang không tồn tại</h1>
    <p style={{color:'var(--text-muted)'}}>Đường dẫn bạn truy cập không hợp lệ.</p>
    <Link to="/" className="btn btn-primary">Về Dashboard</Link>
  </div>
);

export default NotFound;
