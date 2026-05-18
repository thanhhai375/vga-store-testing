import React, { useState, useEffect } from "react";
import "./HeroSection.css";

const slides = [
  { id: 1, img: "/images/hero/slide1.jpg" },
  { id: 2, img: "/images/hero/slide2.jpg" },
  { id: 3, img: "/images/hero/slide3.jpg" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let t;
    if (isPlaying && slides.length > 0) {
      t = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearInterval(t);
  }, [current, isPlaying]);

  if (slides.length === 0) return null;

  return (
    <section className="hero-wrapper">
      <div className="hero-banner-area">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === current ? "active" : ""}`}
            style={{ backgroundImage: `url('${s.img}')` }}
          />
        ))}

        <div className="hero-gradient-bottom" />

        <div className="hero-slider-controls">
          <div className="slider-progress-container">
            {slides.map((_, index) => (
              <div
                key={index}
                className="slider-progress-track"
                onClick={() => { setCurrent(index); setIsPlaying(true); }}
              >
                {index < current && <div className="slider-progress-fill completed" />}
                {index === current && (
                  <div
                    key={`active-${current}`}
                    className="slider-progress-fill active-anim"
                    style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
                  />
                )}
              </div>
            ))}
          </div>

          <button className="slider-play-pause" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 9v6m4-6v6" strokeLinecap="square" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 5v14l11-7z" strokeLinejoin="round" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className="hero-bottom-menu">
        <div 
          className="rog-menu-item" 
          onClick={() => document.getElementById('series-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <img className="rog-icon" src="/images/hero/icon-vga.png" alt="Card Đồ họa" />
          <span>Card Đồ họa</span>
        </div>
        <div 
          className="rog-menu-item" 
          onClick={() => document.getElementById('accessories-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <img className="rog-icon" src="/images/hero/icon-phukien.png" alt="Phụ kiện" />
          <span>Phụ kiện</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;