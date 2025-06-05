import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const { addClient, role } = useAppContext();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#F97316');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = modalRef.current;
    if (!node) return;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      node.querySelectorAll<HTMLElement>(focusableSelectors)
    );
    focusableElements[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab' && focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);
    try {
      await addClient({
        name,
        industry,
        logo: logo || undefined,
        color,
        socialAccounts: []
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-client-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-slate-800 rounded-lg w-full max-w-md p-4 md:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 id="add-client-title" className="text-xl font-bold mb-6">
          Добавить клиента
        </h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Название
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Например: Beauty Shop"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ниша
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Например: Косметика"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                URL логотипа (необязательно)
              </label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Фирменный цвет
              </label>
              <div className="flex space-x-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Отмена
            </button>
            {role !== 'viewer' && (
              <button
                type="submit"
                disabled={!name || !industry || loading}
                className="flex-1 px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Добавление...' : 'Добавить'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;