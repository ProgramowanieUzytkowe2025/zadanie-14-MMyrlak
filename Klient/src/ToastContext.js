import React, { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="toast-container">
            <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                {toast.message}
            </div>
            </div>
        </div>
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);