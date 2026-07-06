import { Outlet, Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-50 dark:bg-dark-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent-400/20 dark:bg-accent-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">LinkVault</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
