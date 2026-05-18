import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import './BestSellers.css';

const stripHtmlTags = (str) => {
  if (!str) return "";
  return str.replace(/<[^>]*>?/gm, '');
};

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productService.getAll()
      .then(data => {

        const sortedProducts = data.sort((a, b) => (b.sold || b.sales || 0) - (a.sold || a.sales || 0));
        setProducts(sortedProducts.slice(0, 4));
      })
      .catch(err => console.error("Lỗi lấy sản phẩm bán chạy:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bs-section">
      <div className="container">
        <div className="bs-header-center">
          <h2 className="bs-title">SẢN PHẨM BÁN CHẠY</h2>
        </div>

        <div className="bs-grid">
          {products.map((p) => {
            // Retrieve all
            const dbImageUrl =
              p.imgUrl ||
              p.img_url ||
              p.img ||
              p.imageUrl ||
              p.image ||
              (p.images && p.images.length > 0 && p.images[0]?.url);

            // Default
            const fallbackImage = "/images/products/gpu_original.png";


            const finalImageUrl = dbImageUrl || fallbackImage;

            return (
              <div
                key={p.id}
                className="asus-corner-card"
                // Product
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="bs-img-box">
                  <img
                    src={finalImageUrl}
                    alt={p.name}
                    // Error handling
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>
                <h4 className="bs-name">{p.name}</h4>
                <p className="bs-desc">
                  {stripHtmlTags(p.description).substring(0, 90)}...
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
