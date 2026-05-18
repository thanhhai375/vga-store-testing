import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { toastSuccess, toastError, confirmDelete } from '../../utils/alertUtils';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/admin/reviews');
      // ApiResponse wrapper: { success, message, data: [...] }
      const data = res?.data?.data || res?.data || res;
      setReviews(Array.isArray(data) ? data : data.content || []);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete('Khách hàng sẽ không còn thấy đánh giá này nữa.', 'Xóa đánh giá này?');
    if (!isConfirmed) return;
    try { await axiosClient.delete(`/admin/reviews/${id}`); fetch(); toastSuccess('Xóa đánh giá thành công!'); }
    catch { toastError('Xóa thất bại!'); }
  };

  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Đánh giá</h1>
          <p className="page-subtitle">Kiểm duyệt đánh giá sản phẩm</p>
        </div>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>ID</th><th>Sản phẩm</th><th>Người dùng</th><th>Điểm</th><th>Nội dung</th><th>Ngày</th><th>Hành động</th></tr></thead>
              <tbody>
                {reviews.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Chưa có đánh giá</td></tr>
                ) : reviews.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.product?.name || `#${r.productId}`}</td>
                    <td>{r.guestName || r.user?.fullName || r.user?.username || 'Khách ẩn danh'}</td>
                    <td style={{color:'#fbbf24', letterSpacing:1}}>{renderStars(r.rating || 0)}</td>
                    <td style={{maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{r.comment || '--'}</td>
                    <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : '--'}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={14} /> Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
