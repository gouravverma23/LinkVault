import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bookmark,
  Heart,
  FolderOpen,
  Plus,
  User,
  LogOut,
  ChevronLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/bookmarks/new', icon: Plus, label: 'Add Bookmark' },
  { path: '/collections', icon: FolderOpen, label: 'Collections' },
  { path: '/favorites', icon: Heart, label: 'Favorites' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-6 border-b border-dark-100 dark:border-dark-700`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">LinkVault</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
        )}
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
        {/* Close (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/bookmarks' && location.pathname.startsWith('/bookmarks') && item.path === '/bookmarks');

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`nav-link ${isActive ? 'active' : ''} ${collapsed ? '!px-3 justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="px-3 py-4 border-t border-dark-100 dark:border-dark-700">
        {!collapsed && user && (
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-dark-700 dark:text-dark-200 truncate">{user.name}</p>
            <p className="text-xs text-dark-400 dark:text-dark-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`nav-link w-full hover:!bg-rose-50 dark:hover:!bg-rose-900/20 hover:!text-rose-500 ${collapsed ? '!px-3 justify-center' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 z-50 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 bottom-0 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 z-30 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
