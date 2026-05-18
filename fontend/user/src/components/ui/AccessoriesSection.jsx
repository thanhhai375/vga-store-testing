import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/productService';

const stripHtmlTags = (str) => {
    if (!str) return "";
    return str.replace(/<[^>]*>?/gm, '');
};

const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// ==========================================

// ==========================================
const mockAccessories = [
    {
        id: 9998,
        name: "ROG Herculx EVA-02 Edition",
        description: "Phiên bản ROG Herculx EVA-02 mạnh mẽ sẽ củng cố một cách an toàn ngay cả những card mạnh nhất, đồng thời mang đến thiết kế dễ sử dụng và khả năng tương thích rộng rãi.",
        imgUrl: "/images/products/asus/rog-herculx-eva.png"
    },
    {
        id: 9999,
        name: "ROG Herculx Graphics Card Holder",
        description: "Giá đỡ card đồ họa ROG Herculx có thể đỡ chắc chắn và an toàn cả những card mạnh và to nạc nhất, đồng thời có thiết kế dễ sử dụng và khả năng tương thích đa dạng.",
        imgUrl: "/images/products/asus/rog-herculx-holder.png"
    }
];

const AccessoriesSection = () => {
    const [accessories, setAccessories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        productService.getAll({ size: 200 })
            .then(data => {

                const findRealAccessories = data.filter(p => {
                    const name = p.name ? p.name.toLowerCase() : '';
                    const sku = p.sku ? p.sku.toLowerCase() : '';
                    const cat = p.category && p.category.name ? removeAccents(p.category.name) : '';
                    
                    return name.includes('herculx') || sku.includes('acc-') || cat.includes('phu kien');
                });

                if (findRealAccessories.length > 0) {

                    setAccessories(findRealAccessories.slice(0, 2));
                } else {

                    setAccessories(mockAccessories);
                }
            })
            .catch(err => {
                console.error("Lỗi API, chuyển sang dùng Mock Data:", err);
                setAccessories(mockAccessories); 
            });
    }, []);

    return (
        <section id="accessories-section" style={{ backgroundColor: '#fff', padding: '80px 0 100px 0' }}>
        <div style={{ textAlign: 'center', margin: '0 auto 50px auto' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#000', margin: '0 0 10px 0' }}>PHỤ KIỆN</h2>
            <Link to="/products?cat=Phụ Kiện" style={{ fontSize: '14px', fontWeight: '800', color: '#d8282e', textDecoration: 'none' }}>
                XEM TẤT CẢ PHỤ KIỆN ›
            </Link>
        </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                {accessories.map(p => {
                    const dbImageUrl = p.imgUrl || p.img_url || p.img || p.imageUrl || p.image || (p.images && p.images[0]?.url);
                    const fallbackImage = "/images/products/gpu_original.png";
                    const finalImageUrl = dbImageUrl || fallbackImage;

                    return (
                        <div
                            key={p.id}
                            className="asus-corner-card"
                            style={{ backgroundColor: '#f8f8f8', padding: '50px 40px', alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer' }}
                            onClick={() => navigate(`/product/${p.id}`)}
                        >
                            <img
                                src={finalImageUrl}
                                alt={p.name}
                                style={{ width: '80%', height: '180px', objectFit: 'contain', margin: '0 auto 30px auto', display: 'block' }}
                                onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                            />
                            <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#000', margin: '10px 0 15px 0', lineHeight: '1.2' }}>
                                {p.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                                {stripHtmlTags(p.description).substring(0, 120)}...
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AccessoriesSection;
