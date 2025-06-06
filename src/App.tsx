import { AppProvider } from './context/AppContext';
import AppLayout from './components/Layout/AppLayout';
import AuthLayout from './components/Auth/AuthLayout';
import { useAppContext } from './context/AppContext';
import ThemeToggle from './components/ThemeToggle';

const AppContent = () => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return user ? <AppLayout /> : <AuthLayout />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
      <ThemeToggle />
    </AppProvider>
  );
}

export default App;