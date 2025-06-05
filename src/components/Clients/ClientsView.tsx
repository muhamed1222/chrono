import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ClientCard from './ClientCard';
import AddClientModal from './AddClientModal';

const ClientsView: React.FC = () => {
  const { clients } = useAppContext();
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Клиенты</h2>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Добавить клиента
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-6 bg-slate-800 rounded-full mb-4">
              <Users size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Нет клиентов</h3>
            <p className="text-slate-400 mb-6 text-center max-w-md">
              Добавьте своего первого клиента, чтобы начать создавать и планировать контент.
            </p>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Добавить клиента
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>

      {showAddClientModal && (
        <AddClientModal onClose={() => setShowAddClientModal(false)} />
      )}
    </div>
  );
};

const Users: React.FC<{ size: number, className?: string }> = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export default ClientsView;