import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useBookmarks } from '../context/BookmarkContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { searchBookmarks, fetchBookmarks } = useBookmarks();

  const handleSearch = (query) => {
    if (query) {
      searchBookmarks(query);
    } else {
      fetchBookmarks();
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <div
        className={`transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={handleSearch}
        />
        <main className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
