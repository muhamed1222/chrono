import React, { useState } from 'react';
import { Calendar, Users, FileText, Lightbulb, LogOut, Loader } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, signOut, signOutAll, error, clearError } = useAppContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    clearError();
    try {
      await signOut();
    } catch {
      // error is handled in context
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSignOutAll = async () => {
    setIsSigningOutAll(true);
    clearError();
    try {
      await signOutAll();
    } catch {
      // error is handled in context
    } finally {
      setIsSigningOutAll(false);
    }
  };

  const navItems = [
    {
      icon: <Calendar size={20} />,
      label: 'Календарь',
      view: 'calendar' as const,
    },
    {
      icon: <Users size={20} />,
      label: 'Клиенты',
      view: 'clients' as const,
    },
    {
      icon: <FileText size={20} />,
      label: 'Редактор',
      view: 'post-editor' as const,
    },
    {
      icon: <Lightbulb size={20} />,
      label: 'Идеи',
      view: 'templates' as const,
    },
  ];

  return (
    <aside className="w-56 md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="mr-2 text-cyan-400" />
          Chrono
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Контент по расписанию
        </p>
      </div>

      <nav className="flex-1 p-2 md:p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.view}>
              <Button
                onClick={() => setCurrentView(item.view)}
                className={`w-full flex items-center rounded-lg px-4 py-3 ${
                  currentView === item.view
                    ? 'bg-slate-700 text-cyan-400'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center rounded-lg px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          {isSigningOut ? (
            <Loader size={20} className="mr-3 animate-spin" />
          ) : (
            <LogOut size={20} className="mr-3" />
          )}
          Выйти
        </Button>
        <Button
          onClick={handleSignOutAll}
          disabled={isSigningOutAll}
          className="w-full flex items-center rounded-lg px-4 py-3 mt-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white"
        >
          {isSigningOutAll ? (
            <Loader size={20} className="mr-3 animate-spin" />
          ) : (
            <LogOut size={20} className="mr-3" />
          )}
          Выйти везде
        </Button>
        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded">
            {error}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;