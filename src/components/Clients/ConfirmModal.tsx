import React from 'react';

interface ConfirmModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onClose
}) => (
  <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-slate-800 rounded-lg w-full max-w-sm p-6">
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
          {cancelText}
        </button>
        <button type="button" onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors">
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
