import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Calendar from '../Calendar/Calendar';
import ClientsView from '../Clients/ClientsView';
import PostEditor from '../Posts/PostEditor';
import TemplatesView from '../Templates/TemplatesView';

const AppLayout: React.FC = () => {
  const { currentView } = useAppContext();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'calendar':
        return <Calendar />;
      case 'clients':
        return <ClientsView />;
      case 'post-editor':
        return <PostEditor />;
      case 'templates':
        return <TemplatesView />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="flex h-screen bg-red-900 text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default AppLayout;