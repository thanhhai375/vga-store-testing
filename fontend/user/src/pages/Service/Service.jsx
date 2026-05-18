import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import servicePolicyService from '../../services/servicePolicyService';
import { servicePages as localData } from '../../data/serviceData';
import './Service.css';


const renderServiceIcon = (emoji) => {
  const iconStyle = { width: '1em', height: '1em', display: 'inline-block', fill: 'currentColor' };
  switch (emoji) {
    case '🏢': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 10l-10-5v2l10 5 10-5v-2l-10 5zm0 5l-10-5v2l10 5 10-5v-2l-10 5z" /></svg>;
    case '📍': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>;
    case '🔄': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.946 7.946 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.946 7.946 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" /></svg>;
    case '🔧': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>;
    case '🔍': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>;
    case '🚚': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>;
    case '🛡️': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c0 .6-.4 1-1 1h-3.6c-.6 0-1-.4-1-1V9.5c0-1.4 1.4-2.5 2.8-2.5z" /></svg>;
    case '💳': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>;
    case '📊': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg>;
    case '📋': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>;
    case '🔒': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>;
    case '📄': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>;
    case '✨': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" /></svg>;
    case '⚡': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z" /></svg>;
    case '🤝': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
    case '🎯': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M12 2A10 10 0 1022 12 10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-14a6 6 0 106 6 6 6 0 00-6-6zm0 10a4 4 0 114-4 4 4 0 01-4 4z" /></svg>;
    case '⚠️': return <svg style={iconStyle} viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>;
    default: return <span>{emoji}</span>;
  }
};


function ContentRenderer({ blocks }) {
  if (!blocks) return null;
  return blocks.map((block, idx) => {
    switch (block.type) {
      case 'heading':
        return <h3 key={idx} className="sv-heading">{block.body}</h3>;
      case 'text':
        return <p key={idx} className="sv-text">{block.body}</p>;
      case 'list':
        return (
          <ul key={idx} className="sv-list">
            {block.items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      case 'warning':
        return (
          <div key={idx} className="sv-alert sv-alert-warning">
            <span className="sv-alert-icon">⚠️</span>
            <div className="sv-alert-content">{block.body}</div>
          </div>
        );
      case 'info':
        return (
          <div key={idx} className="sv-alert sv-alert-info">
            <span className="sv-alert-icon">ℹ️</span>
            <div className="sv-alert-content">{block.body}</div>
          </div>
        );
      case 'component':
        if (block.name === 'WarrantyCheck') {
          return <WarrantyCheck key={idx} />;
        }
        return null;
      case 'contact':
        return (
          <div key={idx} className="sv-contact-box">
            <h4>{block.contact.title}</h4>
            <div className="sv-contact-row"><span>📞 Hotline:</span><strong>{block.contact.phone}</strong></div>
            <div className="sv-contact-row"><span>📧 Email:</span><strong>{block.contact.email}</strong></div>
            <div className="sv-contact-row"><span>⏰ Giờ l.việc:</span><strong>{block.contact.hours}</strong></div>
          </div>
        );
      default:
        return null;
    }
  });
}

function WarrantyCheck() {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) setSearched(true);
  };

  return (
    <div className="sv-warranty-section">
      <form className="sv-warranty-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Nhập SĐT hoặc Mã S/N (VD: 0987654321)..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
          className="sv-warranty-input"
        />
        <button type="submit" className="sv-warranty-btn">KIỂM TRA BẢO HÀNH</button>
      </form>
      {searched && (
        <div className="sv-warranty-result">
          <div className="sv-warranty-result-icon">📋</div>
          <p>Không tìm thấy thông tin bảo hành cho "<strong>{query}</strong>".</p>
          <span>Vui lòng kiểm tra lại thông tin hoặc liên hệ hotline 1900.5301 để được hỗ trợ.</span>
        </div>
      )}
    </div>
  );
}


const Service = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const [policies, setPolicies] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await servicePolicyService.getAll();
        
        let mappedData = [];
        if (data && data.length > 0) {
          mappedData = data.map(item => {
            let parsedContent = [];
            try {
              parsedContent = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
            } catch (e) {
              console.warn("Parse content JSON failed for", item.id);
            }
            return {
              ...item,
              content: parsedContent
            };
          });
        } else {
          // Fallback to localData
          mappedData = localData; 
        }

        setPolicies(mappedData);

        // Set active tab based on URL or first item
        const defaultId = mappedData[0]?.id || '';
        if (tabFromUrl) {
          const found = mappedData.find((s) => s.id === tabFromUrl || s.label === tabFromUrl);
          if (found) {
            setActiveId(found.id);
          } else {
            setActiveId(defaultId);
          }
        } else {
          setActiveId(defaultId);
        }

      } catch (err) {
        console.error("Error loading policies", err);
        setPolicies(localData);
        if(!tabFromUrl) setActiveId(localData[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [tabFromUrl]);

  const activePage = policies.find((s) => s.id === activeId) || policies[0];

  const handleTabClick = (page) => {
    setActiveId(page.id);
    setSearchParams({ tab: page.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="service-page" style={{ textAlign: 'center', padding: '100px 0' }}>
         Đang tải chính sách dịch vụ...
      </div>
    );
  }

  if (!activePage) return null;

  return (
    <div className="service-page">
      <div className="sv-hero-clean">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="sv-hero-title-clean">{activePage.title}</h1>
          {activePage.description && (
            <p className="sv-hero-desc-clean">{activePage.description}</p>
          )}
        </div>
      </div>

      <div className="sv-body container">
        <div className="sv-layout">
          <aside className="sv-sidebar">
            <div className="sv-sidebar-title">DỊCH VỤ & CHÍNH SÁCH</div>
            <nav className="sv-sidebar-nav">
              {policies.map((page) => (
                <button
                  key={page.id}
                  className={`sv-nav-item ${activeId === page.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(page)}
                >
                  <span className="sv-nav-icon">{renderServiceIcon(page.icon)}</span>
                  <span className="sv-nav-label">{page.label}</span>
                </button>
              ))}
            </nav>

            <div className="sv-sidebar-cta">
              <div className="sv-sidebar-cta-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <h4>Cần hỗ trợ?</h4>
              <p>Tổng đài miễn phí</p>
              <a href="tel:19005301" className="sv-sidebar-cta-phone">1900.5301</a>
            </div>
          </aside>

          <main className="sv-content">
            <div className="sv-content-body">
              <ContentRenderer blocks={activePage.content} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Service;
