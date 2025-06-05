import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Post, Client } from '../../types';
import { Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface CalendarDayProps {
  date: Date;
  posts: Post[];
  clients: Client[];
  onAddPost: () => void;
  className?: string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, posts, clients, onAddPost, className }) => {
  const { setSelectedPost, setCurrentView, role } = useAppContext();
  
  const day = format(date, 'd', { locale: ru });
  const isToday = new Date().toDateString() === date.toDateString();

  const handlePostClick = (postId: string) => {
    setSelectedPost(postId);
    setCurrentView('post-editor');
  };

  const getClientById = (clientId: string) => {
    return clients.find(client => client.id === clientId);
  };

  return (
    <div 
      className={`flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden transition-all hover:scale-[1.02] ${
        isToday ? 'ring-2 ring-cyan-500/50' : ''
      }`}
    >
      <div className={`p-3 md:p-4 ${isToday ? 'bg-cyan-900/50' : 'bg-slate-700'}`}>
        <div className="flex justify-between items-center">
          <p className={className || 'text-2xl font-bold text-white'}>{day}</p>
          <div className="flex items-center space-x-2">
            {posts.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-600 text-xs">
                {posts.length}
              </span>
            )}
            {role !== 'viewer' && (
              <button
                onClick={onAddPost}
                className="p-1.5 rounded-full bg-slate-600 hover:bg-slate-500 transition-colors"
                aria-label="Add post"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 md:p-3 space-y-2 overflow-y-auto max-h-[300px] scrollbar-thin">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-500">Нет публикаций</p>
          </div>
        ) : (
          posts.map((post) => {
            const client = getClientById(post.clientId);
            return (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="group relative p-2 md:p-3 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition-all"
                style={{ borderLeft: `4px solid ${client?.color || '#94a3b8'}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-xs text-slate-400">{client?.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    {post.platforms.map((platform) => (
                      <div 
                        key={platform} 
                        className="w-5 h-5 flex items-center justify-center rounded bg-slate-600 text-xs"
                        title={getPlatformName(platform)}
                      >
                        {platform === 'telegram' ? 'T' : platform === 'vk' ? 'V' : 'I'}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-sm line-clamp-2 group-hover:text-white">
                  {post.content}
                </p>

                {post.media && post.media.length > 0 && (
                  <div className="mt-2 flex -space-x-1">
                    {post.media.map((url, index) => (
                      <div 
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-600 flex items-center justify-center text-xs overflow-hidden"
                      >
                        <img 
                          src={url} 
                          alt={`Media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {format(new Date(post.scheduledFor), 'HH:mm')}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded ${
                    post.status === 'draft' 
                      ? 'bg-slate-600' 
                      : post.status === 'scheduled' 
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {post.status === 'draft' ? 'Черновик' : post.status === 'scheduled' ? 'Запланирован' : 'Опубликован'}
                  </span>
                </div>
              </div>
            );
          })
        )}
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

export default CalendarDay;