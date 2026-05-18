import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import brandService from '../../services/brandService';
import { toastSuccess, toastError } from '../../utils/alertUtils';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', price: '', stock: '', categoryId: '', brandId: '', description: '', sku: '',
    gpuModel: '', vram: '', memoryType: '', coolingType: '', powerConnectors: '', recommendedPsu: '', dimension: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // Process
  const getImageUrl = (imgUrl) => {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('/uploads/')) return `http://localhost:8080${imgUrl}`;
    if (imgUrl.startsWith('/images/')) return `http://localhost:5173${imgUrl}`;
    return imgUrl;
  };

  useEffect(() => {
    // List
    categoryService.getAll().then(res => {
      const d = res.data || res;
      setCategories(Array.isArray(d) ? d : (d.content || []));
    }).catch(() => {});

    brandService.getAll().then(res => {
      const d = res.data || res;
      setBrands(Array.isArray(d) ? d : (d.content || []));
    }).catch(() => {});

    if (isEdit) {
      productService.getById(id).then(res => {

        const p = res.data || res;
        if (!p || !p.name) {
          toastError('Không tìm thấy sản phẩm');
          navigate('/products');
          return;
        }
        setForm({
          name: p.name || '',
          price: p.price || '',
          oldPrice: p.oldPrice || '',
          stock: p.stock ?? 0,
          categoryId: p.category?.id || '',
          brandId: p.brand?.id || '',
          description: p.description || '',
          sku: p.sku || '',
          gpuModel: p.gpuModel || '',
          vram: p.vram || '',
          memoryType: p.memoryType || '',
          coolingType: p.coolingType || '',
          powerConnectors: p.powerConnectors || '',
          recommendedPsu: p.recommendedPsu || '',
          dimension: p.dimension || ''
        });
        if (p.imgUrl || p.imageUrl) {
          const img = p.imgUrl || p.imageUrl;
          setExistingImage(img);
          setPreview(getImageUrl(img) || img);
        }
        setLoading(false);
      }).catch((err) => {
        console.error('Lỗi tải sản phẩm:', err);
        toastError('Không tìm thấy sản phẩm');
        navigate('/products');
      });
    }
  }, [id, navigate, isEdit]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || form.stock === '') return toastError('Vui lòng điền đủ thông tin bắt buộc (*): Tên, Giá, Tồn kho');

    if (!isEdit && !file) {
      return toastError('Vui lòng chọn Hình ảnh sản phẩm!');
    }

    setSaving(true);
    

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', Number(form.price));
    if (form.oldPrice) formData.append('oldPrice', Number(form.oldPrice));
    formData.append('stock', Number(form.stock));
    if (form.description) formData.append('description', form.description);
    if (form.sku) formData.append('sku', form.sku);
    if (form.gpuModel) formData.append('gpuModel', form.gpuModel);
    if (form.vram) formData.append('vram', form.vram);
    if (form.memoryType) formData.append('memoryType', form.memoryType);
    if (form.coolingType) formData.append('coolingType', form.coolingType);
    if (form.powerConnectors) formData.append('powerConnectors', form.powerConnectors);
    if (form.recommendedPsu) formData.append('recommendedPsu', form.recommendedPsu);
    if (form.dimension) formData.append('dimension', form.dimension);
    if (form.categoryId) formData.append('categoryId', Number(form.categoryId));
    if (form.brandId) formData.append('brandId', Number(form.brandId));
    if (file) formData.append('imageFile', file);

    try {
      if (isEdit) {
        await productService.update(id, formData);
        toastSuccess('Cập nhật sản phẩm thành công!');
      } else {
        await productService.create(formData);
        toastSuccess('Tạo sản phẩm thành công!');
      }
      navigate('/products');
    } catch (err) {
      console.error(err);
      toastError(err?.response?.data?.message || err?.message || 'Không thể lưu sản phẩm!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/products')} style={{marginBottom: 8}}>
            <ArrowLeft size={16}/> Quay lại Sản phẩm
          </button>
          <h1 className="page-title">{isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h1>
          <p className="page-subtitle">{isEdit ? 'Cập nhật thông tin và ảnh sản phẩm' : 'Điền thông tin để tạo sản phẩm mới'}</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>

      <form onSubmit={handleSave} style={{display:'grid', gridTemplateColumns:'1fr 360px', gap: 24, alignItems:'start'}}>
        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Thông tin cơ bản</h2>
            </div>
            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="VD: NVIDIA GeForce RTX 4070 Super" required />
            </div>
            <div className="form-group">
              <label>Mô tả ngắn</label>
              <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Mô tả chi tiết về sản phẩm..." />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Giá bán & Kho hàng</h2>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16}}>
              <div className="form-group">
                <label>Giá bán (VNĐ) *</label>
                <input type="number" className="form-control" placeholder="Ví dụ: 15000000" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Giá gốc (Tùy chọn)</label>
                <input type="number" className="form-control" placeholder="Nhập để hiển thị giảm giá" value={form.oldPrice || ''} onChange={e => setForm({...form, oldPrice: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Tồn kho *</label>
              <input type="number" className="form-control" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="VD: 50" required min="0"/>
            </div>
            <div className="form-group">
              <label>Mã SKU (Tuỳ chọn)</label>
              <input className="form-control" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="VD: RTX4070S-16G"/>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Thông số kỹ thuật</h2>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16}}>
              <div className="form-group">
                <label>Model GPU</label>
                <input className="form-control" value={form.gpuModel} onChange={e => setForm({...form, gpuModel: e.target.value})} placeholder="VD: RTX 4070 Super"/>
              </div>
              <div className="form-group">
                <label>Dung lượng VRAM</label>
                <input className="form-control" value={form.vram} onChange={e => setForm({...form, vram: e.target.value})} placeholder="VD: 12GB"/>
              </div>
              <div className="form-group">
                <label>Loại bộ nhớ</label>
                <input className="form-control" value={form.memoryType} onChange={e => setForm({...form, memoryType: e.target.value})} placeholder="VD: GDDR6X"/>
              </div>
              <div className="form-group">
                <label>Hệ thống tản nhiệt</label>
                <input className="form-control" value={form.coolingType} onChange={e => setForm({...form, coolingType: e.target.value})} placeholder="VD: 3 Quạt tản nhiệt"/>
              </div>
              <div className="form-group">
                <label>PSU khuyến cáo</label>
                <input className="form-control" value={form.recommendedPsu} onChange={e => setForm({...form, recommendedPsu: e.target.value})} placeholder="VD: 750W"/>
              </div>
              <div className="form-group">
                <label>Đầu cấp nguồn</label>
                <input className="form-control" value={form.powerConnectors} onChange={e => setForm({...form, powerConnectors: e.target.value})} placeholder="VD: 1 x 16-pin"/>
              </div>
            </div>
            <div className="form-group" style={{marginTop: 16}}>
              <label>Kích thước</label>
              <input className="form-control" value={form.dimension} onChange={e => setForm({...form, dimension: e.target.value})} placeholder="VD: 300 x 120 x 50 mm"/>
            </div>
          </div>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 20}}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Hình ảnh sản phẩm</h2>
            </div>
            <div className="form-group">
              <div style={{width:'100%', height: 200, border:'2px dashed var(--border)', borderRadius: 'var(--radius-lg)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'var(--bg-hover)', cursor:'pointer'}}
                onClick={() => document.getElementById('img-upload').click()}>
                {preview 
                  ? <img src={preview} alt="preview" style={{width:'100%', height:'100%', objectFit:'cover'}} /> 
                  : <><ImageIcon size={40} color="var(--text-muted)"/><p style={{marginTop:8, color:'var(--text-muted)', fontSize:13}}>Bấm để chọn ảnh</p></>
                }
              </div>
              <input id="img-upload" type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
              <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                <label className="btn btn-ghost btn-sm" htmlFor="img-upload" style={{cursor:'pointer'}}>
                  <Upload size={14}/> {preview ? 'Đổi ảnh' : 'Chọn ảnh'}
                </label>
                {preview && <span style={{fontSize:11, color:'var(--text-muted)'}}>Kéo thả hoặc bấm để thay ảnh</span>}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Phân loại</h2>
            </div>
            <div className="form-group">
              <label>Danh mục</label>
              <select className="form-control" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Thương hiệu</label>
              <select className="form-control" value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})}>
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
