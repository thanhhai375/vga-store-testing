import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import './Blog.css';

/* ── SVG Icons ── */
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconFire = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#d8282e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconTag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

/* ── Helpers ── */
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
};
const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
};
const catColor = (cat = '') => {
  const map = {
    'Card đồ họa': '#d8282e', 'Đánh giá': '#d8282e',
    'CPU - Main': '#1d4ed8', 'Tin công nghệ': '#0891b2',
    'Linh kiện PC': '#7c3aed', 'Công nghệ': '#0891b2',
    'Game': '#16a34a', 'Thị trường': '#d97706',
    'Hướng dẫn': '#7c3aed', 'Tin khuyến mãi': '#d97706',
  };
  return map[cat] || '#475569';
};

/* ──────────────────────────────────────── */

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    blogService.getAll()
      .then(d => setBlogs(Array.isArray(d) ? d : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const heroPost = useMemo(() => {
    const feat = blogs.filter(p => p.featured).sort((a, b) => (b.views || 0) - (a.views || 0));
    return feat[0] || [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0))[0] || null;
  }, [blogs]);

  const trending = useMemo(() =>
    [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [blogs]);

  const categories = useMemo(() => {
    const cats = [...new Set(blogs.map(p => p.category).filter(Boolean))];
    return ['Tất cả', ...cats];
  }, [blogs]);

  // Extract real tags from all blog posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogs.forEach(p => {
      if (p.tags) p.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tagSet.add(t));
    });
    const real = [...tagSet].slice(0, 16);
    // Fallback if no tags set yet
    return real.length > 0 ? real : ['NVIDIA', 'AMD', 'RTX 4070', 'Intel Core', 'DDR5', 'DLSS', 'Ray Tracing', 'Build PC', 'Benchmark'];
  }, [blogs]);

  const filtered = useMemo(() => {
    let posts = [...blogs];
    if (activeCategory !== 'Tất cả') posts = posts.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
    }
    if (sortBy === 'popular') posts.sort((a, b) => (b.views || 0) - (a.views || 0));
    else posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return posts;
  }, [blogs, activeCategory, searchQuery, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  if (loading) return (
    <div className="bp-page">
      <div className="bp-loading"><div className="bp-spinner" /><p>Đang tải bài viết...</p></div>
    </div>
  );

  const heroImg = heroPost?.thumbnail || heroPost?.imgUrl || heroPost?.image || '/images/products/gpu_original.png';

  return (
    <div className="bp-page">
      <div className="bp-page-grid">
        <div className="bp-content-col">

          {/* HERO */}
          {heroPost && activeCategory === 'Tất cả' && !searchQuery && (
            <div className="bp-hero">
              <div className="bp-hero-inner">
                <div className="bp-hero-text">
                  <span className="bp-hero-badge" style={{ background: catColor(heroPost.category) }}>NỔI BẬT</span>
                  <h1 className="bp-hero-title">{heroPost.title}</h1>
                  <p className="bp-hero-excerpt">{heroPost.excerpt}</p>
                  <div className="bp-hero-meta">
                    <span className="bp-hero-author">
                      <IconUser />
                      Nguồn: {heroPost.source || heroPost.author || 'VGA Store'}
                    </span>
                    <span className="bp-hero-date">
                      <IconCalendar />
                      {fmtDate(heroPost.createdAt || heroPost.publishedAt)}
                    </span>
                  </div>
                  <Link to={`/blog/${heroPost.id}`} className="bp-hero-btn">
                    Đọc thêm <IconArrowRight />
                  </Link>
                </div>
                <div className="bp-hero-img-wrap">
                  <img src={heroImg} alt={heroPost.title} className="bp-hero-img" />
                </div>
              </div>
            </div>
          )}

          {/* FILTER + ARTICLES */}
          <div className="bp-body">
            {/* Filter bar */}
            <div className="bp-filter">
              <div className="bp-cats">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`bp-cat${activeCategory === cat ? ' active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
                  >{cat}</button>
                ))}
              </div>
              <div className="bp-sort-wrap">
                <select className="bp-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Xem nhiều</option>
                </select>
                <span className="bp-sort-arrow"><IconChevronDown /></span>
              </div>
            </div>

            {/* Search */}
            <div className="bp-search">
              <span className="bp-search-icon"><IconSearch /></span>
              <input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVisibleCount(8); }}
              />
              {searchQuery && <button className="bp-search-x" onClick={() => setSearchQuery('')}><IconX /></button>}
            </div>

            {(activeCategory !== 'Tất cả' || searchQuery) && (
              <p className="bp-result-txt">
                {filtered.length > 0 ? `Tìm thấy ${filtered.length} bài viết` : 'Không tìm thấy bài viết phù hợp'}
              </p>
            )}

            {/* Grid bài viết */}
            {filtered.length === 0 ? (
              <div className="bp-grid">
                <div className="bp-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" width="44" height="44">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                  </svg>
                  <h3>Không có bài viết</h3>
                  <p>Thử từ khóa khác hoặc chọn danh mục khác</p>
                  <button onClick={() => { setActiveCategory('Tất cả'); setSearchQuery(''); }}>Xem tất cả</button>
                </div>
              </div>
            ) : (
              <>
                <div className="bp-grid">
                  {visible.map(post => <BlogCard key={post.id} post={post} />)}
                </div>
                {visibleCount < filtered.length && (
                  <div className="bp-more-wrap">
                    <button className="bp-more-btn" onClick={() => setVisibleCount(c => c + 4)}>
                      Xem thêm ({filtered.length - visibleCount} bài)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="bp-sidebar">
          {/* Trending */}
          <div className="bp-widget">
            <div className="bp-widget-hd">
              <span className="bp-widget-title"><IconFire /> TIN ĐỌC NHIỀU</span>
              <Link to="/blog" className="bp-widget-more">Xem tất cả</Link>
            </div>
            <div className="bp-trending-list">
              {trending.map((post, idx) => {
                const tImg = post.thumbnail || post.imgUrl || post.image;
                return (
                  <Link key={post.id} to={`/blog/${post.id}`} className="bp-trend-item">
                    <span className={`bp-trend-num${idx < 3 ? ' top' : ''}`}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {tImg && (
                      <div className="bp-trend-thumb">
                        <img src={tImg} alt={post.title} />
                      </div>
                    )}
                    <div className="bp-trend-info">
                      <span className="bp-trend-source" style={{ color: catColor(post.category) }}>
                        Nguồn: {post.author || 'VGA Store'}
                      </span>
                      <h4 className="bp-trend-title">{post.title}</h4>
                      <span className="bp-trend-time">
                        <IconClock />{timeAgo(post.createdAt || post.publishedDate)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div className="bp-widget">
            <div className="bp-widget-hd">
              <span className="bp-widget-title"><IconFolder /> DANH MỤC</span>
            </div>
            <div className="bp-cat-list">
              {categories.filter(c => c !== 'Tất cả').map(cat => {
                const count = blogs.filter(p => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    className={`bp-cat-row${activeCategory === cat ? ' active' : ''}`}
                    onClick={() => { setActiveCategory(cat); setVisibleCount(8); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    <span className="bp-cat-dot" style={{ background: catColor(cat) }} />
                    <span>{cat}</span>
                    <span className="bp-cat-cnt">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="bp-widget">
            <div className="bp-widget-hd">
              <span className="bp-widget-title"><IconTag /> TAGS PHỔ BIẾN</span>
            </div>
            <div className="bp-tags">
              {allTags.map(tag => (
                <button key={tag} className="bp-tag"
                  onClick={() => { setSearchQuery(tag); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ── BlogCard ── */
function BlogCard({ post }) {
  const resolveImg = (url) => {
    if (!url) return '/images/products/gpu_original.png';
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    if (url.startsWith('http')) return url;
    return url;
  };
  const img = resolveImg(post.thumbnail || post.imgUrl || post.image);
  const color = catColor(post.category);
  return (
    <article className="bp-card">
      <Link to={`/blog/${post.id}`} className="bp-card-img-wrap">
        <img src={img} alt={post.title} className="bp-card-img" loading="lazy" />
        {post.category && <span className="bp-card-cat" style={{ background: color }}>{post.category}</span>}
      </Link>
      <div className="bp-card-body">
        <span className="bp-card-source">{post.author || 'VGA Store'}</span>
        <Link to={`/blog/${post.id}`} className="bp-card-title-link">
          <h2 className="bp-card-title">{post.title}</h2>
        </Link>
        <p className="bp-card-excerpt">{post.excerpt}</p>
        <div className="bp-card-foot">
          <span className="bp-card-time">
            <IconClock />{timeAgo(post.createdAt || post.publishedDate)}
          </span>
          <Link to={`/blog/${post.id}`} className="bp-card-ext" title="Xem bài viết">
            <IconExternal />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Blog;