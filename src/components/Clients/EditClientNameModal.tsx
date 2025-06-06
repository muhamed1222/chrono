import React, { useState } from 'react';
import { X } from 'lucide-react';

interface EditClientNameModalProps {
  initialName: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

const EditClientNameModal: React.FC<EditClientNameModalProps> = ({ initialName, onSave, onClose }) => {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-6">Изменить название клиента</h2>
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:opacity-50 transition-colors">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientNameModal;
