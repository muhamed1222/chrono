import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ToastProps {
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ duration = 3000 }) => {
  const { notification, clearNotification } = useAppContext();

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      clearNotification();
    }, duration);
    return () => clearTimeout(timer);
  }, [notification, duration, clearNotification]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow flex items-start">
      <span className="pr-2">{notification}</span>
      <button onClick={clearNotification} className="ml-2 text-white/70 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
