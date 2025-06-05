import React, { useState } from 'react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppContext } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import CalendarDay from './CalendarDay';
import ClientFilter from './ClientFilter';
import { formatLocalISO } from '../../utils/time';

const Calendar: React.FC = () => {
  const { clients, posts, setCurrentView, setSelectedDate } = useAppContext();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedClients, setSelectedClients] = useState<string[]>(clients.map(c => c.id));

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddPost = (date: Date) => {
    setSelectedDate(formatLocalISO(date));
    setCurrentView('post-editor');
  };

  const filteredPosts = posts.filter(post => 
    selectedClients.includes(post.clientId) &&
    weekDays.some(day => isSameDay(new Date(post.scheduledFor), day))
  );

  const getPostCountForDay = (date: Date) => {
    return filteredPosts.filter(post => 
      isSameDay(new Date(post.scheduledFor), date)
    ).length;
  };

  const getDayClassName = (date: Date) => {
    const postCount = getPostCountForDay(date);
    const isToday = isSameDay(date, new Date());
    
    let className = 'text-2xl font-bold ';
    
    if (isToday) {
      className += 'text-cyan-400';
    } else if (postCount === 0) {
      className += 'text-white';
    } else if (postCount === 1) {
      className += 'text-amber-400';
    } else {
      className += 'text-rose-400';
    }
    
    return className;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Календарь контента</h2>
          <div className="flex items-center space-x-4">
            <ClientFilter 
              clients={clients}
              selectedClients={selectedClients}
              onChange={setSelectedClients}
            />
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleToday}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors flex items-center"
              >
                <CalendarDays size={16} className="mr-2" />
                Сегодня
              </button>
              <div className="flex items-center rounded-lg bg-slate-800 p-1">
                <button 
                  onClick={handlePrevWeek}
                  className="p-2 rounded hover:bg-slate-700 transition-colors"
                  aria-label="Previous week"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 font-medium">
                  {format(startDate, 'd MMM', { locale: ru })} — {format(weekDays[6], 'd MMM', { locale: ru })}
                </span>
                <button 
                  onClick={handleNextWeek}
                  className="p-2 rounded hover:bg-slate-700 transition-colors"
                  aria-label="Next week"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {weekDays.map((day) => (
            <div key={`header-${day}`} className="text-center">
              <p className="text-sm text-slate-400 capitalize">
                {format(day, 'EEEE', { locale: ru })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 h-full overflow-y-auto">
        {weekDays.map((day) => {
          const postsForDay = filteredPosts.filter(post => 
            isSameDay(new Date(post.scheduledFor), day)
          );
          
          return (
            <CalendarDay 
              key={day.toString()} 
              date={day} 
              posts={postsForDay}
              clients={clients}
              onAddPost={() => handleAddPost(day)}
              className={getDayClassName(day)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;