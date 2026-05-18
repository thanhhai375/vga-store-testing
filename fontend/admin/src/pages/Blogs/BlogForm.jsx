import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Image as ImageIcon, Star, Tag, X } from 'lucide-react';
import blogService from '../../services/blogService';
import { toastSuccess, toastError } from '../../utils/alertUtils';

const CATEGORIES = [
  'Card đồ họa', 'CPU - Main', 'Linh kiện PC', 'Đánh giá',
  'Hướng dẫn', 'Tin công nghệ', 'Thị trường', 'Game', 'Tin khuyến mãi'
];

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', category: '', excerpt: '', author: '', featured: false
  });
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]); // array of strings
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    if (url.startsWith('/images/')) return `http://localhost:5173${url}`;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  useEffect(() => {
    if (isEdit) {
      blogService.getById(id).then(res => {
        const b = res.data || res;
        if (!b || !b.title) { toastError('Không tìm thấy bài viết'); navigate('/blogs'); return; }
        setForm({
          title: b.title || '',
          category: b.category || '',
          excerpt: b.excerpt || '',
          author: b.author || '',
          featured: b.featured || false,
        });
        setContent(b.content || '');
        // Parse tags from comma-separated string
        if (b.tags) setTags(b.tags.split(',').map(t => t.trim()).filter(Boolean));
        const thumbUrl = b.thumbnail || b.image;
        if (thumbUrl) setPreview(getImageUrl(thumbUrl) || thumbUrl);
        setLoading(false);
      }).catch(() => { toastError('Không tìm thấy bài viết'); navigate('/blogs'); });
    }
  }, [id, navigate, isEdit]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const addTag = (val) => {
    const clean = val.trim();
    if (clean && !tags.includes(clean)) setTags(prev => [...prev, clean]);
    setTagInput('');
  };
  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) setTags(prev => prev.slice(0, -1));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return toastError('Vui lòng điền đủ tiêu đề và thể loại');
    setSaving(true);
    const formData = new FormData();
    formData.append('blog', new Blob([JSON.stringify({
      title: form.title,
      category: form.category,
      excerpt: form.excerpt,
      author: form.author,
      content: content,
      featured: form.featured,
      tags: tags.join(','),
    })], { type: 'application/json' }));
    if (file) formData.append('image', file);
    try {
      if (isEdit) { await blogService.update(id, formData); }
      else { await blogService.create(formData); }
      toastSuccess('Lưu bài viết thành công!');
      navigate('/blogs');
    } catch (err) {
      toastError(err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra!');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/blogs')} style={{marginBottom: 8}}>
            <ArrowLeft size={16}/> Quay lại
          </button>
          <h1 className="page-title">{isEdit ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h1>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Đang lưu...' : <><Save size={16} /> Xuất bản</>}
        </button>
      </div>

      <div className="card" style={{maxWidth: 1000}}>
        <form onSubmit={handleSave} style={{display: 'flex', flexDirection: 'column', gap: 20}}>

          {/* Tiêu đề */}
          <div className="form-group">
            <label>Tiêu đề *</label>
            <input className="form-control" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          {/* Thể loại + Tác giả */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            <div className="form-group">
              <label>Thể loại *</label>
              <select className="form-control" value={form.category}
                onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">-- Chọn thể loại --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tác giả</label>
              <input type="text" className="form-control" value={form.author}
                onChange={e => setForm({...form, author: e.target.value})}
                placeholder="Tên tác giả..." />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label style={{display:'flex', alignItems:'center', gap:6}}>
              <Tag size={14}/> Tags / Từ khoá
            </label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px',
              border: '1px solid var(--border)', borderRadius: 8, minHeight: 44,
              background: 'var(--bg)', cursor: 'text'
            }} onClick={() => document.getElementById('tag-input').focus()}>
              {tags.map(tag => (
                <span key={tag} style={{
                  display:'flex', alignItems:'center', gap:4, padding:'3px 10px',
                  background:'var(--primary)', color:'#fff', borderRadius:20,
                  fontSize:12, fontWeight:500
                }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}
                    style={{background:'none',border:'none',color:'#fff',cursor:'pointer',padding:0,lineHeight:1}}>
                    <X size={11}/>
                  </button>
                </span>
              ))}
              <input
                id="tag-input"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder={tags.length === 0 ? 'Nhập tag, Enter để thêm... (VD: NVIDIA, RTX 4070)' : ''}
                style={{border:'none',outline:'none',background:'transparent',flex:1,minWidth:150,fontSize:13}}
              />
            </div>
            <span style={{fontSize:11, color:'var(--text-muted)', marginTop:4, display:'block'}}>
              Nhấn Enter hoặc dấu phẩy để thêm tag. Tag sẽ hiển thị trên trang Blog.
            </span>
          </div>

          {/* Featured toggle */}
          <div className="form-group">
            <label style={{display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none'}}>
              <div
                onClick={() => setForm({...form, featured: !form.featured})}
                style={{
                  width:42, height:24, borderRadius:12, cursor:'pointer', transition:'all 0.2s',
                  background: form.featured ? 'var(--primary)' : 'var(--border)',
                  position:'relative', flexShrink:0
                }}>
                <div style={{
                  position:'absolute', top:3, left: form.featured ? 21 : 3,
                  width:18, height:18, borderRadius:'50%', background:'#fff',
                  transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)'
                }}/>
              </div>
              <span style={{display:'flex', alignItems:'center', gap:4}}>
                <Star size={14} fill={form.featured ? '#f59e0b' : 'none'} color={form.featured ? '#f59e0b' : 'var(--text-muted)'}/>
                <strong>Bài viết nổi bật</strong>
                <span style={{color:'var(--text-muted)', fontWeight:400}}>
                  — hiển thị ở khu vực Hero trên đầu trang Blog
                </span>
              </span>
            </label>
          </div>

          {/* Tóm tắt */}
          <div className="form-group">
            <label>Tóm tắt (Excerpt)</label>
            <textarea className="form-control" rows={3} value={form.excerpt}
              onChange={e => setForm({...form, excerpt: e.target.value})}
              placeholder="Tóm tắt ngắn gọn hiển thị trên danh sách bài viết..." />
          </div>

          {/* Ảnh bìa */}
          <div className="form-group">
            <label>Ảnh bìa</label>
            <div style={{display:'flex', gap: 20, alignItems: 'center'}}>
              <div style={{width:200, height:110, border:'1px dashed var(--border)', borderRadius:8,
                display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'var(--bg-secondary)'}}>
                {preview
                  ? <img src={preview} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  : <ImageIcon color="var(--text-muted)"/>}
              </div>
              <div>
                <label className="btn btn-ghost" style={{cursor:'pointer'}}>
                  <Upload size={16}/> Chọn ảnh...
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={handleFileChange}/>
                </label>
                {preview && (
                  <button type="button" className="btn btn-ghost btn-sm"
                    onClick={() => { setFile(null); setPreview(''); }}
                    style={{marginTop:8, display:'block', color:'var(--danger)'}}>
                    <X size={14}/> Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nội dung */}
          <div className="form-group">
            <label>Nội dung bài viết</label>
            <textarea
              className="form-control"
              rows={15}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder='Nhập JSON hoặc văn bản thuần...&#10;Ví dụ JSON: [{"type":"paragraph","body":"Nội dung..."}]'
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default BlogForm;
