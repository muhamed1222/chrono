import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ToastProps {
  message?: string | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-700 text-white px-4 py-2 rounded shadow flex items-start">
      <span className="pr-2 flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 hover:text-gray-300">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
