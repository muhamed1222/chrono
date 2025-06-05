import React, { useState } from 'react';
import { Check, Filter } from 'lucide-react';
import { Client } from '../../types';

interface ClientFilterProps {
  clients: Client[];
  selectedClients: string[];
  onChange: (clientIds: string[]) => void;
}

const ClientFilter: React.FC<ClientFilterProps> = ({ clients, selectedClients, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      onChange(selectedClients.filter(id => id !== clientId));
    } else {
      onChange([...selectedClients, clientId]);
    }
  };

  const selectAll = () => {
    onChange(clients.map(client => client.id));
  };

  const deselectAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <Filter size={16} />
        <span>Клиенты</span>
        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-slate-700 text-xs">
          {selectedClients.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-slate-800 rounded-lg shadow-lg z-10 p-2 border border-slate-700">
          <div className="flex justify-between text-xs text-slate-400 p-2 border-b border-slate-700">
            <button
              onClick={selectAll}
              className="hover:text-white transition-colors"
            >
              Выбрать все
            </button>
            <button
              onClick={deselectAll}
              className="hover:text-white transition-colors"
            >
              Снять выбор
            </button>
          </div>
          <div className="mt-2 max-h-60 overflow-y-auto">
            {clients.map(client => (
              <label
                key={client.id}
                className="flex items-center px-3 py-2 hover:bg-slate-700 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={client.id}
                  checked={selectedClients.includes(client.id)}
                  onChange={() => toggleClient(client.id)}
                  className="sr-only"
                />
                <div className="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden mr-3" style={{ backgroundColor: client.color }}>
                  {client.logo && <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />}
                </div>
                <span className="flex-1 text-sm">{client.name}</span>
                <div className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center">
                  {selectedClients.includes(client.id) && (
                    <Check size={14} className="text-cyan-400" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFilter;