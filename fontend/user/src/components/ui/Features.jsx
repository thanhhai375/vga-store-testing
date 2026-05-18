import React from "react";
import "./Features.css";
const Features = () => {
  const features = [
    {
      icon: "🔒",
      title: "Secure Checked",
      desc: "Shop with confidence—payments are protected.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      desc: "Get your PC essentials delivered quickly.",
    },
    {
      icon: "🎧",
      title: "24/7 Support",
      desc: "Got questions? Our support team stays on.",
    },
    {
      icon: "📦",
      title: "Easy Returns",
      desc: "If it doesn't fit your rig, send it back.",
    },
  ];

  return (
    <div className="features">
      <div className="container features-grid">
        {features.map((item, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">{item.icon}</div>
            <h3 className="feature-title">{item.title}</h3>
            <p className="feature-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
