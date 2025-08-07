import React, { createContext, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toast } from '../components/Toast';

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string | undefined, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const { t } = useTranslation();

  const showToast = useCallback((message: string | undefined, type: ToastType = 'success') => {
    if (!message) return;
    setMessage(t(message));
    setType(type);
    setVisible(true);
  }, [t]);

  const handleDismiss = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        onDismiss={handleDismiss}
      />
    </ToastContext.Provider>
  );
}; 