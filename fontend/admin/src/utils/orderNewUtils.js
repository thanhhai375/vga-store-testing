/**
 * Quản lý trạng thái "đơn hàng mới chưa xem" bằng localStorage.
 * Logic: Mỗi khi admin tải trang Orders, lưu IDs đơn hiện tại.
 * Những đơn có ID chưa trong localStorage → "MỚI".
 */

const SEEN_KEY = 'admin_seen_order_ids';

export const getSeenOrderIds = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));
  } catch {
    return new Set();
  }
};

export const markOrdersAsSeen = (orderIds) => {
  try {
    const seen = getSeenOrderIds();
    orderIds.forEach(id => seen.add(String(id)));
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {}
};

export const isOrderNew = (orderId) => {
  const seen = getSeenOrderIds();
  return !seen.has(String(orderId));
};

export const countNewOrders = (orders) => {
  const seen = getSeenOrderIds();
  return orders.filter(o => !seen.has(String(o.orderId || o.id))).length;
};
