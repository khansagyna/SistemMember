import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<ToastType>('success');
  const [message, setMessage] = useState('');

  const showToast = useCallback((type: ToastType, message: string) => {
    setType(type);
    setMessage(message);
    setVisible(true);
  }, []);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast visible={visible} type={type} message={message} onHide={hideToast} />
    </ToastContext.Provider>
  );
}

export const useGlobalToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useGlobalToast must be used within ToastProvider');
  return context;
};
