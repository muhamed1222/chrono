import React from 'react';
import { Edit, Trash, Link2 } from 'lucide-react';
import { Client } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const { setSelectedClient, setCurrentView } = useAppContext();

  const handleCreatePost = () => {
    setSelectedClient(client.id);
    setCurrentView('post-editor');
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      <div 
        className="h-24 bg-gradient-to-r p-4 flex items-end"
        style={{ 
          backgroundImage: client.logo 
            ? `linear-gradient(to right, ${client.color}80, ${client.color}), url(${client.logo})` 
            : `linear-gradient(to right, ${client.color}50, ${client.color})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h3 className="text-xl font-bold text-white">{client.name}</h3>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-slate-400 mb-3">
          <span>Ниша:</span>
          <span className="ml-2 px-2 py-0.5 rounded bg-slate-700 text-white">
            {client.industry}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Подключенные аккаунты</h4>
          <div className="space-y-2">
            {client.socialAccounts.map(account => (
              <div 
                key={account.id}
                className="flex items-center text-sm"
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${account.connected ? 'bg-green-500' : 'bg-slate-500'}`} />
                <div className="flex-1">
                  <p className="text-slate-300">{getPlatformName(account.platform)}</p>
                  <p className="text-xs text-slate-500">{account.handle}</p>
                </div>
                <button 
                  className="p-1.5 rounded hover:bg-slate-700 transition-colors"
                  title={account.connected ? "Отключить" : "Подключить"}
                >
                  <Link2 size={14} className={account.connected ? "text-cyan-400" : "text-slate-500"} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCreatePost}
            className="flex-1 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-sm font-medium transition-colors"
          >
            Создать публикацию
          </button>
          <button className="p-2 rounded bg-slate-700 hover:bg-slate-600 transition-colors">
            <Edit size={16} />
          </button>
          <button className="p-2 rounded bg-slate-700 hover:bg-red-700 transition-colors">
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const getPlatformName = (platform: 'telegram' | 'vk' | 'instagram'): string => {
  switch (platform) {
    case 'telegram':
      return 'Telegram';
    case 'vk':
      return 'ВКонтакте';
    case 'instagram':
      return 'Instagram';
  }
};

export default ClientCard;