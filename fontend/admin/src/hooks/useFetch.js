import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

/**
 * Hook gọi API với auto loading và error state
 * @param {string} url - API endpoint
 * @param {object} params - Query params
 */
export const useFetch = (url, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(url, { params });
      setData(res.data || res);
    } catch (e) {
      setError(e.response?.data?.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, [url]);

  return { data, loading, error, refetch };
};
