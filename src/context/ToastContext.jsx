import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    warning: (msg) => showToast(msg, 'warning'),
  };

  const colors = {
    success: { bg: '#d1fae5', border: '#10b981', icon: 'check_circle' },
    error: { bg: '#fee2e2', border: '#ef4444', icon: 'error' },
    warning: { bg: '#fef3c7', border: '#f59e0b', icon: 'warning' }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
        {toasts.map((t) => {
          const c = colors[t.type] || colors.success;
          return (
            <div key={t.id} style={{
              padding: '12px 16px', marginBottom: '8px', borderRadius: '8px',
              borderLeft: `4px solid ${c.border}`, background: c.bg,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '14px', fontWeight: '500', minWidth: '250px'
            }}>
              <span className="material-icons" style={{ fontSize: '20px', color: c.border }}>{c.icon}</span>
              {t.message}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};