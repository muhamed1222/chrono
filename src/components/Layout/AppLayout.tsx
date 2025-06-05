import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Sidebar from './Sidebar';
import Calendar from '../Calendar/Calendar';
import ClientsView from '../Clients/ClientsView';
import PostEditor from '../Posts/PostEditor';
import ProductEditor from '../Posts/ProductEditor';
import TemplatesView from '../Templates/TemplatesView';
import ProductEditor from '../Products/ProductEditor';
import Alert from '../Alert';
import Toast from '../ui/Toast';

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
      case 'product-editor':
        return <ProductEditor />;
      case 'templates':
        return <TemplatesView />;
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-2 md:p-4">
          <Alert />
          <Toast />
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;