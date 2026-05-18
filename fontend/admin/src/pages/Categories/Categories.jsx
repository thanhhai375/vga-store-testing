import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../services/categoryService';
import axiosClient from '../../api/axiosClient';
import { toastSuccess, toastError, confirmDelete } from '../../utils/alertUtils';

const Categories = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      const data = res.data || res;
      const arr = Array.isArray(data) ? data : (data.content || []);
      setItems(arr);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setForm({ name: '', description: '' }); setEditId(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ name: item.name, description: item.description || '' }); setEditId(item.id); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editId) {
        await categoryService.update(editId, form);
      } else {
        await categoryService.create(form);
      }
      setForm({ name: '', description: '' });
      setShowModal(false);
      fetchCategories();
      toastSuccess('Lưu thành công!');
    } catch (err) { toastError(err?.response?.data?.message || 'Lưu thất bại!'); }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete('Dữ liệu danh mục này sẽ bị xóa khỏi hệ thống.', 'Xác nhận xóa danh mục?');
    if (!isConfirmed) return;
    try { await categoryService.delete(id); fetchCategories(); toastSuccess('Xóa thành công!'); }
    catch (err) { toastError(err?.response?.data?.message || 'Xóa thất bại!'); }
  };

  const handlePinToTop = async (id) => {
    try {
      await axiosClient.put(`/admin/pin-top/category/${id}`);
      fetchCategories();
      toastSuccess('Đã đẩy danh mục lên đầu bảng!');
    } catch (e) {
      toastError('Không thể đẩy lên đầu!');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Danh mục</h1>
          <p className="page-subtitle">Quản lý danh mục sản phẩm</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Thêm danh mục
        </button>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>STT</th><th>Tên danh mục</th><th>Mô tả</th><th>Hành động</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Chưa có danh mục</td></tr>
                ) : items.map((item, index) => (
                  <tr key={item.id} className="clickable-row" onClick={() => navigate(`/products?search=${encodeURIComponent(item.name)}`)} title="Nhấn để xem các sản phẩm thuộc danh mục này">
                    <td>{index + 1}</td>
                    <td style={{fontWeight:600, color:'var(--text-primary)'}}>
                        {item.name}
                    </td>
                    <td>{item.description || '--'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); handlePinToTop(item.id); }} title="Đẩy lên đầu trang">
                          <ArrowUp size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); openEdit(item); }}><Edit2 size={14} /> Sửa</button>
                        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editId ? 'Sửa danh mục' : 'Thêm danh mục'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label>Tên danh mục *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nhập tên danh mục" />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mô tả ngắn" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
