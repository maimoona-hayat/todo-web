import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyles = () => {
    switch (type) {
      case 'error':
        return { background: '#fef2f2', border: '#ef4444', color: '#991b1b', icon: 'error' };
      case 'warning':
        return { background: '#fffbeb', border: '#f59e0b', color: '#92400e', icon: 'warning' };
      default:
        return { background: '#ecfdf5', border: '#10b981', color: '#065f46', icon: 'check_circle' };
    }
  };

  const styles = getStyles();

  return (
    <div className={`toast toast-${type}`} style={{
      position: 'fixed', bottom: '24px', left: '24px', padding: '14px 20px',
      borderRadius: '12px', borderLeft: `4px solid ${styles.border}`,
      background: styles.background, color: styles.color,
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center',
      gap: '12px', fontSize: '14px', fontWeight: '500', zIndex: '9999',
      transform: visible ? 'translateX(0)' : 'translateX(-120%)',
      opacity: visible ? '1' : '0', transition: 'all 0.3s ease', maxWidth: '380px'
    }}>
      <span className="material-icons" style={{ fontSize: '22px', color: styles.border }}>{styles.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.6 }}>
        <span className="material-icons" style={{ fontSize: '20px' }}>close</span>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
    {toasts.map((toast) => (
      <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
    ))}
  </div>
);

export default Toast;