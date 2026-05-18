import React, { useState, useRef, useEffect } from 'react';
import './ExplodedVga.css';

const SPECS = [
  { label: 'Axial-tech Fans',     stat: '3 × 105mm',     color: '#ff4060' },
  { label: 'MaxContact Heatsink', stat: '3.5-Slot',       color: '#c8c8c8' },
  { label: 'Auto-Extreme PCB',    stat: '16-Phase VRM',   color: '#40cc70' },
  { label: 'Vapor Chamber',       stat: '14% Cooler',     color: '#40b0ff' },
  { label: 'Metal Backplate',     stat: 'Full CNC',       color: '#e08020' },
];

const ExplodedVga = () => {
  const [mode, setMode] = useState('exploded');
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="evga-section" ref={ref}>
      <div className={`evga-top container ${visible ? 'visible' : ''}`}>
        <div className="evga-top-left">
          <span className="evga-eyebrow">PREMIUM ENGINEERING</span>
          <h2 className="evga-title">ANATOMY OF <span>PERFECTION</span></h2>
          <p className="evga-desc">
            Khám phá kiến trúc bên trong của dòng GPU cao cấp nhất thế giới.
            Mỗi linh kiện được tinh chỉnh đến giới hạn vật lý.
          </p>
        </div>

        <div className="evga-tabs">
          <button
            className={`evga-tab ${mode === 'original' ? 'active' : ''}`}
            onClick={() => setMode('original')}
          >
            Nguyên Bản
          </button>
          <button
            className={`evga-tab ${mode === 'exploded' ? 'active' : ''}`}
            onClick={() => setMode('exploded')}
          >
            Tách Linh Kiện
          </button>
        </div>
      </div>

      <div className={`evga-img-wrap ${visible ? 'visible' : ''}`}>
        <img
          key={mode}
          src={mode === 'exploded' ? '/images/gpu_exploded.png' : '/images/gpu_original.png'}
          alt={mode === 'exploded' ? 'ROG GPU Exploded' : 'ROG GPU Original'}
          className="evga-img"
        />
      </div>

      <div className={`evga-specbar container ${visible ? 'visible' : ''}`}>
        {SPECS.map(s => (
          <div className="evga-spec" key={s.label} style={{ '--sc': s.color }}>
            <div className="evga-spec-dot" />
            <div>
              <div className="evga-spec-stat">{s.stat}</div>
              <div className="evga-spec-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExplodedVga;
