import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCompareModalOpen, removeFromCompare } from '../../redux/compareSlice';

const currencyFormatter = new Intl.NumberFormat("vi-VN");

const CompareModal = () => {
  const dispatch = useDispatch();
  const { compareItems, isCompareModalOpen } = useSelector(state => state.compare);

  if (!isCompareModalOpen) return null;

  return (
    <div style={styles.overlay} onClick={() => dispatch(setCompareModalOpen(false))}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={() => dispatch(setCompareModalOpen(false))}>✕</button>
        <h2 style={styles.title}>So sánh cấu hình sản phẩm</h2>
        
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.labelCol}>Hình ảnh</td>
                {compareItems.map(item => {
                  const dbImageUrl = item.imageUrl || item.imgUrl || item.img_url || item.image || (item.images && item.images.length > 0 && item.images[0]?.url);
                  let formattedImageUrl = dbImageUrl;
                  if (dbImageUrl && dbImageUrl.startsWith('/uploads/')) {
                    formattedImageUrl = `http://localhost:8080${dbImageUrl}`;
                  }
                  return (
                    <td key={item.id} style={styles.dataCol}>
                      <img src={formattedImageUrl || '/images/products/gpu_original.png'} alt={item.name} style={styles.img} />
                      <button style={styles.removeBtn} onClick={() => {
                        dispatch(removeFromCompare(item.id));
                        if(compareItems.length <= 1) dispatch(setCompareModalOpen(false));
                      }}>Xóa</button>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td style={styles.labelCol}>Tên sản phẩm</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataColName}>{item.name}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Giá</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataColPrice}>{currencyFormatter.format(item.price)}₫</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Thương hiệu</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.brand?.name || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Danh mục</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.category?.name || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Model GPU</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.gpuModel || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>VRAM</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.vram || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Chuẩn bộ nhớ</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.memoryType || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Tản nhiệt</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.coolingType || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Nguồn phụ</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.powerConnectors || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Nguồn đề nghị</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.recommendedPsu || 'N/A'}</td>)}
              </tr>
              <tr>
                <td style={styles.labelCol}>Kích thước</td>
                {compareItems.map(item => <td key={item.id} style={styles.dataCol}>{item.dimension || 'N/A'}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    zIndex: 99999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '1200px',
    maxHeight: '90vh',
    padding: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  closeBtn: {
    position: 'absolute',
    top: '20px', right: '20px',
    background: '#f1f5f9', border: 'none',
    width: '32px', height: '32px', borderRadius: '50%',
    cursor: 'pointer', fontWeight: 'bold'
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '800',
    color: '#1e293b'
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    flex: 1,
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  labelCol: {
    width: '20%',
    fontWeight: 'bold',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
    color: '#475569'
  },
  dataCol: {
    width: '26%',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: '#1e293b'
  },
  dataColName: {
    width: '26%',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold',
    fontSize: '15px',
    color: '#1e293b'
  },
  dataColPrice: {
    width: '26%',
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    borderRight: '1px solid #e2e8f0',
    textAlign: 'center',
    verticalAlign: 'middle',
    fontWeight: 'bold',
    color: 'var(--accent-color)',
    fontSize: '18px'
  },
  img: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    marginBottom: '10px',
    display: 'block',
    margin: '0 auto 10px auto'
  },
  removeBtn: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.2s'
  }
};

export default CompareModal;
