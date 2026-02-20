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

  const colors = {
    success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: 'check_circle' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: 'error' },
    warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: 'warning' }
  };

  const c = colors[type] || colors.success;

  return (
    <div style={{
      position: 'fixed', bottom: '20px', left: '20px', padding: '14px 20px',
      borderRadius: '8px', borderLeft: `4px solid ${c.border}`, background: c.bg, color: c.text,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
      gap: '10px', fontSize: '14px', fontWeight: '500', zIndex: '9999',
      transform: visible ? 'translateX(0)' : 'translateX(-100%)', opacity: visible ? 1 : 0,
      transition: 'all 0.3s ease', maxWidth: '350px'
    }}>
      <span className="material-icons">{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span className="material-icons" style={{ fontSize: '18px' }}>close</span>
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div>
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          message={toast.message} 
          type={toast.type} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

export default Toast;