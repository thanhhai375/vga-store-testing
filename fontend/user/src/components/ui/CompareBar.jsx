import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare, setCompareModalOpen } from '../../redux/compareSlice';

const CompareBar = () => {
  const dispatch = useDispatch();
  const { compareItems } = useSelector(state => state.compare);

  if (compareItems.length === 0) return null;

  return (
    <div style={styles.bar}>
      <div style={styles.container}>
        <div style={styles.left}>
          <span style={styles.title}>So sánh sản phẩm ({compareItems.length}/3)</span>
          <button style={styles.clearBtn} onClick={() => dispatch(clearCompare())}>Xóa tất cả</button>
        </div>
        
        <div style={styles.items}>
          {compareItems.map(item => {
            const dbImageUrl = item.imageUrl || item.imgUrl || item.img_url || item.image || (item.images && item.images.length > 0 && item.images[0]?.url);
            let formattedImageUrl = dbImageUrl;
            if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
              formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
            }

            return (
              <div key={item.id} style={styles.item}>
                <img src={formattedImageUrl || '/images/products/gpu_original.png'} alt={item.name} style={styles.itemImg} />
                <button style={styles.removeItem} onClick={() => dispatch(removeFromCompare(item.id))}>✕</button>
              </div>
            );
          })}
          {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
            <div key={`empty-${i}`} style={styles.emptySlot}>+</div>
          ))}
        </div>

        <div style={styles.right}>
          <button 
            style={{...styles.compareBtn, opacity: compareItems.length > 1 ? 1 : 0.5}} 
            disabled={compareItems.length < 2}
            onClick={() => dispatch(setCompareModalOpen(true))}
          >
            So sánh ngay
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
    zIndex: 9998,
    padding: '12px 0',
    borderTop: '2px solid var(--accent-color)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '14px'
  },
  clearBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '12px',
    padding: 0,
    textAlign: 'left'
  },
  items: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  item: {
    position: 'relative',
    width: '60px',
    height: '60px',
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '4px',
    backgroundColor: '#f8fafc'
  },
  itemImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  removeItem: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptySlot: {
    width: '60px',
    height: '60px',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#cbd5e1',
    fontSize: '24px'
  },
  compareBtn: {
    backgroundColor: 'var(--accent-color)',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'uppercase'
  }
};

export default CompareBar;
