import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Image, Send, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { formatLocalISO } from '../../utils/time';
import imageCompression from 'browser-image-compression';
import { uploadFile } from '../../lib/storage';
import Button from '../ui/Button';
import Input from '../ui/Input';

const PostEditor: React.FC = () => {
  const {
    clients,
    posts,
    selectedPost,
    selectedClient,
    selectedDate,
    setCurrentView,
    addPost,
    updatePost,
    role
  } = useAppContext();
  
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaInputError, setMediaInputError] = useState('');
  const [clientId, setClientId] = useState('');
  const [platforms, setPlatforms] = useState<('telegram' | 'vk' | 'instagram')[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (selectedPost) {
      const post = posts.find(p => p.id === selectedPost);
      if (post) {
        setContent(post.content);
        setMediaUrls(post.media || []);
        setClientId(post.clientId);
        setPlatforms(post.platforms);
        
        const date = new Date(post.scheduledFor);
        setScheduledDate(formatLocalISO(date).split('T')[0]);
        setScheduledTime(date.toTimeString().slice(0, 5));
      }
    } else if (selectedClient) {
      setClientId(selectedClient);
      // Set default platforms based on client's connected accounts
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        setPlatforms(
          client.socialAccounts
            .filter(account => account.connected)
            .map(account => account.platform)
        );
      }
    }
    
    if (selectedDate) {
      setScheduledDate(formatLocalISO(new Date(selectedDate)).split('T')[0]);
    } else {
      setScheduledDate(formatLocalISO(new Date()).split('T')[0]);
    }
  }, [selectedPost, selectedClient, selectedDate, posts, clients]);
  
  const handleSavePost = async () => {
    const scheduledDateTime = formatLocalISO(new Date(`${scheduledDate}T${scheduledTime}`));

    setError('');
    setLoading(true);

    try {
      if (selectedPost) {
        await updatePost(selectedPost, {
          content,
          media: mediaUrls,
          clientId,
          platforms,
          scheduledFor: scheduledDateTime,
          status: 'scheduled'
        });
      } else {
        await addPost({
          content,
          media: mediaUrls,
          clientId,
          platforms,
          scheduledFor: scheduledDateTime,
          status: 'scheduled'
        });
      }

      setCurrentView('calendar');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddMedia = () => {
    try {
      const url = new URL(mediaUrlInput.trim());
      setMediaUrls([...mediaUrls, url.toString()]);
      setMediaUrlInput('');
      setMediaInputError('');
    } catch {
      setMediaInputError('Некорректный URL');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setMediaInputError('Недопустимый тип файла');
      return;
    }

    if (file.size > maxSize) {
      setMediaInputError('Файл превышает 5MB');
      return;
    }

    setMediaInputError('');
    const previewUrl = URL.createObjectURL(file);
    setMediaUrls(prev => [...prev, previewUrl]);

    try {
      const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
      const uploadedUrl = await uploadFile(compressed);
      setMediaUrls(current => current.map(url => url === previewUrl ? uploadedUrl : url));
    } catch {
      setMediaUrls(current => current.filter(url => url !== previewUrl));
      setMediaInputError('Не удалось загрузить файл');
    } finally {
      URL.revokeObjectURL(previewUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };
  
  const togglePlatform = (e: React.ChangeEvent<HTMLInputElement>) => {
    const platform = e.target.value as 'telegram' | 'vk' | 'instagram';
    const { checked } = e.target;

    setPlatforms(current => {
      if (checked) {
        return current.includes(platform) ? current : [...current, platform];
      }
      return current.filter(p => p !== platform);
    });
  };
  
  const isPlatformAvailable = (platform: 'telegram' | 'vk' | 'instagram') => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return false;
    
    return client.socialAccounts.some(
      account => account.platform === platform && account.connected
    );
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {selectedPost ? 'Редактировать публикацию' : 'Новая публикация'}
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentView('calendar')}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Отмена
          </button>
          {role !== 'viewer' && (
            <button
              onClick={handleSavePost}
              disabled={!content || !clientId || platforms.length === 0 || loading}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send size={16} className="mr-2" />
              {loading ? 'Сохранение...' : 'Запланировать'}
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {error && (
          <div className="mb-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Клиент</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Выберите клиента</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Текст публикации</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="Введите текст публикации..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Медиа</label>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddMedia} className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600">
                  <Image size={14} className="mr-1" />
                  Добавить
                </Button>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {mediaInputError && (
                <p className="text-sm text-red-500">{mediaInputError}</p>
              )}
              
              {mediaUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={url} 
                        alt="Media preview" 
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveMedia(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-800/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 md:p-6 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500 text-sm">Нет добавленных медиафайлов</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Дата и время</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full pl-10 p-3 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                <div className="relative flex-1">
                  <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full pl-10 p-3 bg-slate-800 rounded-lg border border-slate-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Платформы</label>
              <div className="space-y-3">
                {[
                  { id: 'telegram', name: 'Telegram' },
                  { id: 'vk', name: 'ВКонтакте' },
                  { id: 'instagram', name: 'Instagram' }
                ].map(platform => {
                  const isAvailable = isPlatformAvailable(platform.id as 'telegram' | 'vk' | 'instagram');
                  const isSelected = platforms.includes(platform.id as 'telegram' | 'vk' | 'instagram');

                  return (
                    <label
                      key={platform.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        isAvailable
                          ? isSelected
                            ? 'border-cyan-500 bg-slate-700/50'
                            : 'border-slate-700 bg-slate-800'
                          : 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                      } ${isAvailable ? 'cursor-pointer hover:bg-slate-700' : ''} transition-colors`}
                    >
                      <input
                        type="checkbox"
                        value={platform.id}
                        checked={isSelected}
                        disabled={!isAvailable}
                        onChange={togglePlatform}
                        aria-label={`Выбрать ${platform.name}`}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                          isSelected ? 'bg-cyan-500' : 'bg-slate-700'
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected && <Check size={14} />}
                      </div>
                      <span>{platform.name}</span>
                      {!isAvailable && (
                        <span className="ml-auto text-xs text-slate-500">Не подключено</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="font-medium mb-2">Советы</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Оптимальная длина для Instagram — до 2200 символов</li>
                <li>• Добавляйте эмодзи для привлечения внимания</li>
                <li>• Используйте хэштеги для увеличения охвата</li>
                <li>• Задавайте вопросы для повышения вовлеченности</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Check: React.FC<{ size: number }> = ({ size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default PostEditor;