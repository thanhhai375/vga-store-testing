import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import axiosClient from '../../api/axiosClient';
import { toastError, toastSuccess } from '../../utils/alertUtils';
import './BlogDetail.css';

/* ── Inline SVG Icons ── */
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);
const IconStar = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconMessageCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconLightbulb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
);

/* ── Helpers ── */
const fmtDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
};
const readTime = (blocks = []) => {
  const words = blocks.reduce((acc, b) => acc + (b.body?.split(' ')?.length || 0), 0);
  return Math.max(1, Math.round(words / 200));
};

const catColor = (cat = '') => {
  const map = {
    'Card đồ họa':'#d8282e','Đánh giá':'#d8282e',
    'CPU - Main':'#1d4ed8','Tin công nghệ':'#0891b2',
    'Linh kiện PC':'#7c3aed','Game':'#16a34a',
    'Hướng dẫn':'#7c3aed','Tin khuyến mãi':'#d97706',
  };
  return map[cat] || '#d8282e';
};

/* ── Main Component ── */
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [comments, setComments]       = useState([]);
  const [newComment, setNewComment]   = useState('');
  const [guestName, setGuestName]     = useState('');
  const [newRating, setNewRating]     = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied]           = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await blogService.getById(id);
      setPost(data);
      if (data) {
        try {
          const res = await axiosClient.get(`/reviews/blog/${id}`);
          setComments(Array.isArray(res) ? res : []);
        } catch {}
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchData();
  }, [id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const rev = { blog: { id: parseInt(id) }, comment: newComment, rating: newRating, guestName: guestName || 'Khách hàng' };
      const saved = await axiosClient.post('/reviews', rev);
      setComments(prev => [saved, ...prev]);
      setNewComment(''); setGuestName(''); setNewRating(5);
      toastSuccess('Đã đăng bình luận!');
    } catch {
      toastError('Có lỗi khi gửi bình luận. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toastSuccess('Đã sao chép liên kết!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return (
    <div className="bd-loading-screen">
      <div className="bd-spinner" />
      <p>Đang tải bài viết...</p>
    </div>
  );

  if (!post) return (
    <div className="bd-not-found">
      <svg viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" width="64" height="64">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
      </svg>
      <h2>Không tìm thấy bài viết</h2>
      <Link to="/blog" className="bd-back-btn"><IconArrowLeft /> Quay lại Blog</Link>
    </div>
  );

  let contentBlocks = [];
  try {
    contentBlocks = JSON.parse(post.content);
    if (!Array.isArray(contentBlocks)) contentBlocks = [];
  } catch {
    contentBlocks = post.content ? [{ type: 'paragraph', body: post.content }] : [];
  }

  const publishDate = post.createdAt || post.publishedDate;
  // Resolve upload images to backend URL, keep external URLs as-is
  const resolveImg = (url) => {
    if (!url) return '/images/products/gpu_original.png';
    if (url.startsWith('/uploads/')) return `http://localhost:8080${url}`;
    if (url.startsWith('http')) return url;
    return url;
  };
  const heroImg = resolveImg(post.thumbnail || post.imgUrl || post.imageUrl || post.image);
  const color   = catColor(post.category);
  const mins    = readTime(contentBlocks);

  return (
    <div className="bd-page">

      {/* ── Back nav ── */}
      <div className="bd-breadcrumb-bar">
        <div className="bd-breadcrumb-inner">
          <Link to="/blog" className="bd-back-nav">
            <IconArrowLeft /> Quay lại
          </Link>
          {post.category && (
            <span className="bd-bc-cat" style={{ color }}>/ {post.category}</span>
          )}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="bd-wrapper">

        {/* ── LEFT: Article ── */}
        <div className="bd-article-col">

          {/* Hero image */}
          <div className="bd-hero-img-wrap">
            <img src={heroImg} alt={post.title} className="bd-hero-img" />
            {post.category && (
              <span className="bd-hero-cat" style={{ background: color }}>{post.category}</span>
            )}
          </div>

          {/* Article header */}
          <div className="bd-article-header">
            <h1 className="bd-title">{post.title}</h1>
            {post.excerpt && <p className="bd-excerpt">{post.excerpt}</p>}

            <div className="bd-meta-row">
              <span className="bd-meta-item">
                <IconUser />
                {post.author || 'VGA Store'}
              </span>
              {publishDate && (
                <span className="bd-meta-item">
                  <IconCalendar />
                  {fmtDate(publishDate)}
                </span>
              )}
              <span className="bd-meta-item">
                <IconEye />
                {(post.views || 0).toLocaleString('vi-VN')} lượt xem
              </span>
              <span className="bd-meta-item">
                <IconClock />
                {mins} phút đọc
              </span>
            </div>

            <div className="bd-divider" />
          </div>

          {/* Article body */}
          <article className="bd-article-body">
            {contentBlocks.map((block, idx) => {
              const type = (block.type || '').toLowerCase();
              switch (type) {
                case 'heading':
                  return <h2 key={idx} className="bd-h2">{block.body}</h2>;
                case 'subheading':
                  return <h3 key={idx} className="bd-h3">{block.body}</h3>;
                case 'paragraph':
                  return <p key={idx} className="bd-p">{block.body}</p>;
                case 'image':
                  return (
                    <figure key={idx} className="bd-figure">
                      <img src={block.url} alt={block.caption || ''} className="bd-img" />
                      {block.caption && <figcaption className="bd-figcaption">{block.caption}</figcaption>}
                    </figure>
                  );
                case 'tip':
                  return (
                    <div key={idx} className="bd-tip-box">
                      <span className="bd-tip-icon"><IconLightbulb /></span>
                      <div className="bd-tip-content">
                        <strong>Mẹo hữu ích</strong>
                        <p>{block.body}</p>
                      </div>
                    </div>
                  );
                case 'steps':
                  return (
                    <div key={idx} className="bd-steps">
                      {(block.items || []).map((step, si) => (
                        <div key={si} className="bd-step-item">
                          <div className="bd-step-num">{step.step || si + 1}</div>
                          <div className="bd-step-text">
                            {step.title && <strong>{step.title}</strong>}
                            {step.desc && <p>{step.desc}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                default:
                  return block.body ? <p key={idx} className="bd-p">{block.body}</p> : null;
              }
            })}
          </article>

          {/* Share bar */}
          <div className="bd-share-bar">
            <span className="bd-share-label"><IconShare /> Chia sẻ bài viết</span>
            <div className="bd-share-btns">
              <button
                className="bd-share-btn bd-share-fb"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                title="Chia sẻ Facebook"
              >
                <IconFacebook /> Facebook
              </button>
              <button
                className="bd-share-btn bd-share-tw"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
                title="Chia sẻ Twitter"
              >
                <IconTwitter /> Twitter
              </button>
              <button
                className={`bd-share-btn bd-share-copy${copied ? ' copied' : ''}`}
                onClick={copyLink}
              >
                <IconLink />
                {copied ? 'Đã sao chép!' : 'Sao chép link'}
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bd-comments">
            <h3 className="bd-comments-title">
              <IconMessageCircle />
              Bình luận <span className="bd-comments-count">({comments.length})</span>
            </h3>

            {/* Comment form */}
            <div className="bd-comment-form-wrap">
              <form className="bd-comment-form" onSubmit={handlePostComment}>
                <div className="bd-form-row">
                  <div className="bd-form-field">
                    <label>Tên của bạn</label>
                    <input
                      type="text"
                      placeholder="Nhập tên (bỏ trống = Khách hàng)"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                    />
                  </div>
                  <div className="bd-form-field">
                    <label>Đánh giá bài viết</label>
                    <div className="bd-stars">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n} type="button"
                          className="bd-star-btn"
                          onClick={() => setNewRating(n)}
                          onMouseEnter={() => setHoveredStar(n)}
                          onMouseLeave={() => setHoveredStar(0)}
                        >
                          <IconStar filled={n <= (hoveredStar || newRating)} />
                        </button>
                      ))}
                      <span className="bd-rating-text">{newRating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="bd-form-field">
                  <label>Nội dung bình luận <span className="bd-required">*</span></label>
                  <textarea
                    placeholder="Chia sẻ ý kiến của bạn về bài viết này..."
                    rows="4"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="bd-submit-btn" disabled={isSubmitting}>
                  {isSubmitting
                    ? <><span className="bd-btn-spinner" /> Đang gửi...</>
                    : <><IconSend /> Đăng bình luận</>
                  }
                </button>
              </form>
            </div>

            {/* Comment list */}
            <div className="bd-comments-list">
              {comments.length === 0 ? (
                <div className="bd-no-comments">
                  <IconMessageCircle />
                  <p>Chưa có bình luận. Hãy là người đầu tiên!</p>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={i} className="bd-comment-item">
                    <div className="bd-comment-avatar">
                      {(c.guestName || c.user?.username || 'K').slice(0, 1).toUpperCase()}
                    </div>
                    <div className="bd-comment-content">
                      <div className="bd-comment-meta">
                        <strong className="bd-comment-name">{c.guestName || c.user?.username || 'Khách hàng'}</strong>
                        <div className="bd-comment-stars">
                          {[1,2,3,4,5].map(n => <IconStar key={n} filled={n <= (c.rating || 5)} />)}
                        </div>
                        <span className="bd-comment-date">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                      <p className="bd-comment-text">{c.comment}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="bd-sidebar">

          {/* Author card */}
          <div className="bd-sidebar-card bd-author-card">
            <div className="bd-author-avatar-lg">
              {(post.source || post.author || 'V').slice(0, 1).toUpperCase()}
            </div>
            <div className="bd-author-info">
              <span className="bd-author-label">Nguồn / Tác giả</span>
              <strong className="bd-author-name">{post.author || 'VGA Store'}</strong>
            </div>
          </div>

          {/* Article info */}
          <div className="bd-sidebar-card">
            <h4 className="bd-sidebar-title">Thông tin bài viết</h4>
            <div className="bd-info-list">
              {publishDate && (
                <div className="bd-info-item">
                  <span className="bd-info-icon"><IconCalendar /></span>
                  <div>
                    <span className="bd-info-label">Đăng ngày</span>
                    <span className="bd-info-val">{fmtDate(publishDate)}</span>
                  </div>
                </div>
              )}
              <div className="bd-info-item">
                <span className="bd-info-icon"><IconClock /></span>
                <div>
                  <span className="bd-info-label">Thời gian đọc</span>
                  <span className="bd-info-val">{mins} phút</span>
                </div>
              </div>
              {post.views > 0 && (
                <div className="bd-info-item">
                  <span className="bd-info-icon"><IconEye /></span>
                  <div>
                    <span className="bd-info-label">Lượt xem</span>
                    <span className="bd-info-val">{post.views?.toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              )}
              {post.category && (
                <div className="bd-info-item">
                  <span className="bd-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                  </span>
                  <div>
                    <span className="bd-info-label">Danh mục</span>
                    <span className="bd-info-val" style={{ color }}>{post.category}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share sidebar */}
          <div className="bd-sidebar-card">
            <h4 className="bd-sidebar-title">Chia sẻ</h4>
            <div className="bd-sidebar-share">
              <button className="bd-ss-btn bd-ss-fb"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <IconFacebook /> Facebook
              </button>
              <button className="bd-ss-btn bd-ss-tw"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank')}>
                <IconTwitter /> Twitter
              </button>
              <button className={`bd-ss-btn bd-ss-copy${copied ? ' copied' : ''}`} onClick={copyLink}>
                <IconLink /> {copied ? 'Đã sao chép!' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* Back to blog */}
          <Link to="/blog" className="bd-back-to-blog">
            <IconArrowLeft />
            Quay lại danh sách tin
          </Link>

        </aside>
      </div>
    </div>
  );
};

export default BlogDetail;
