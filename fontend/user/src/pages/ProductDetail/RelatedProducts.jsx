import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ui/ProductCard';

const RelatedProducts = ({ categoryId, currentId }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const catId = categoryId;
    if (!catId) return;

    const fetchRelated = async () => {
      try {
        // axiosClient returns the full ApiResponse: { success, message, data: Page, timestamp }
        const apiResponse = await axiosClient.get(`/products?page=0&size=100`);
        const pageData = apiResponse?.data;
        let allProducts = [];
        if (pageData && Array.isArray(pageData.content)) {
          allProducts = pageData.content;
        } else if (Array.isArray(pageData)) {
          allProducts = pageData;
        }

        const filtered = allProducts.filter(p => {
          const pCatId = p.categoryId || p.category?.id;
          return pCatId == catId && p.id !== currentId;
        });

        const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
        setRelated(shuffled);
      } catch (e) {
        console.error('RelatedProducts error:', e);
      }
    };
    fetchRelated();
  }, [categoryId, currentId]);

  if (related.length === 0) return (
    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
      Không có sản phẩm tương tự.
    </p>
  );

  return (
    <div className="related-grid">
      {related.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default RelatedProducts;
