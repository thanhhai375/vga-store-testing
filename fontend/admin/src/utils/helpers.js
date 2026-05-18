/**
 * Utility helpers cho admin
 */


export const formatCurrency = (amount) => {
  if (!amount) return '--';
  return `${Number(amount).toLocaleString('vi-VN')}đ`;
};


export const formatDate = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleString('vi-VN');
};


export const truncate = (str, max = 80) => {
  if (!str) return '--';
  return str.length > max ? str.slice(0, max) + '...' : str;
};


export const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};
