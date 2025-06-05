import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Alert: React.FC = () => {
  const { error, clearError } = useAppContext();

  if (!error) return null;

  return (
    <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded flex justify-between items-start">
      <span className="pr-2 flex-1">{error}</span>
      <button onClick={clearError} className="ml-2 text-red-400 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;
