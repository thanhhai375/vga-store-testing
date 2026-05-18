import React from "react";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="container about-container">
        <div className="about-text-content">
          <div className="about-header">
            <h2 className="section-title">Why Choose VGA STORE?</h2>
          </div>
          <p className="about-description">
            Chúng tôi tự hào là đơn vị cung cấp card đồ họa và linh kiện PC cao cấp hàng đầu dành cho game thủ, nhà sáng tạo nội dung và người đam mê công nghệ. VGA Store không chỉ bán linh kiện, chúng tôi bán trải nghiệm hiệu năng tối thượng.
          </p>

          <div className="about-stats-grid">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Authentic</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>

{/* Image */}
        <div className="about-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=600&auto=format&fit=crop"
            alt="PC Build Setup"
            className="about-image"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
