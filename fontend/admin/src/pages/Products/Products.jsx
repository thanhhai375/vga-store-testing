import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Monitor, ArrowUp } from 'lucide-react';
import productService from '../../services/productService';
import axiosClient from '../../api/axiosClient';
import { toastSuccess, toastError, confirmDelete } from '../../utils/alertUtils';
import './Products.css';

const Products = () => {
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const SIZE = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAll({ page, size: SIZE, search });
      const pageData = res.data || res;
      if (pageData.content) {
        setProducts(pageData.content);
        setTotal(pageData.totalPages || 1);
      } else if (Array.isArray(pageData)) {
        setProducts(pageData);
        setTotal(1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Process
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('/uploads/')) return `http://localhost:8080${imgUrl}`;
    // Image
    if (imgUrl.startsWith('/images/')) return `http://localhost:5173${imgUrl}`;

    return imgUrl;
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get('search');
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
      setPage(0);
    }
  }, [location.search]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirmDelete('Dữ liệu sản phẩm sẽ bị xóa khỏi hệ thống.', 'Xác nhận xóa sản phẩm?');
    if (!isConfirmed) return;
    try {
      await productService.delete(id);
      fetchProducts();
      toastSuccess('Đã xóa sản phẩm thành công!');
    } catch (e) {
      toastError('Xóa sản phẩm thất bại!');
    }
  };

  const handlePinToTop = async (id) => {
    try {
      await axiosClient.put(`/admin/pin-top/product/${id}`);
      fetchProducts();
      toastSuccess('Đã đẩy sản phẩm lên đầu bảng!');
    } catch (e) {
      toastError('Không thể đẩy lên đầu!');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sản phẩm</h1>
          <p className="page-subtitle">Quản lý toàn bộ sản phẩm VGA Store</p>
        </div>
        <a href="/products/new" className="btn btn-primary">
          <Plus size={16} /> Thêm sản phẩm
        </a>
      </div>

      <div className="card">
        {/* Search */}
        <div className="toolbar">
          <div className="search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? <div className="spinner"></div> : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan="7" style={{textAlign:'center', padding:'40px', color:'var(--text-muted)'}}>Không có sản phẩm</td></tr>
                ) : products.map((p, index) => (
                  <tr key={p.productId || p.id}>
                    <td>{page * SIZE + index + 1}</td>
                    <td>
                      {getImageUrl(p.imgUrl || p.imageUrl) ? (
                        <img 
                          src={getImageUrl(p.imgUrl || p.imageUrl)} 
                          alt={p.name} 
                          className="product-thumb"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:5173/images/products/gpu_original.png'; }}
                        />
                      ) : (
                        <div className="product-thumb-empty" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-hover)', color:'var(--text-muted)'}}><Monitor size={20} /></div>
                      )}
                    </td>
                    <td className="product-name-cell">
                      <div className="product-name">{p.name}</div>
                      <div className="product-brand">{p.brandName || p.brand?.name}</div>
                    </td>
                    <td>{p.categoryName || p.category?.name || '--'}</td>
                    <td>
                      {p.price ? `${Number(p.price).toLocaleString('vi-VN')}đ` : '--'}
                      {p.oldPrice > p.price && (
                        <span className="badge badge-danger" style={{marginLeft: 8, fontSize: 10, padding: '2px 6px'}}>
                          -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => handlePinToTop(p.productId || p.id)} title="Đẩy lên đầu trang">
                          <ArrowUp size={14} />
                        </button>
                        <a href={`/products/${p.productId || p.id}`} className="btn btn-ghost btn-sm"><Edit2 size={14} /> Sửa</a>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.productId || p.id)}><Trash2 size={14} /> Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: total }, (_, i) => (
              <button key={i} className={`page-btn ${i === page ? 'active' : ''}`} onClick={() => setPage(i)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
