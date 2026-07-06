import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Heart,
  FolderOpen,
  TrendingUp,
  Plus,
  ExternalLink,
  Clock,
  BarChart3,
} from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { stats, fetchStats, trackClick, loading } = useBookmarks();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) return <LoadingSpinner />;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-800 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-dark-400 dark:text-dark-500 mt-1">
            Here's what's happening with your bookmarks.
          </p>
        </div>
        <Link to="/bookmarks/new" className="btn-primary text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add Bookmark
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Bookmark}
          label="Total Bookmarks"
          value={stats?.totalBookmarks || 0}
          color="primary"
          delay={0}
        />
        <StatsCard
          icon={Heart}
          label="Favorites"
          value={stats?.favoriteCount || 0}
          color="rose"
          delay={0.1}
        />
        <StatsCard
          icon={FolderOpen}
          label="Categories"
          value={stats?.categoryCount || 0}
          color="accent"
          delay={0.2}
        />
        <StatsCard
          icon={TrendingUp}
          label="Total Clicks"
          value={stats?.mostVisited?.reduce((sum, b) => sum + b.clickCount, 0) || 0}
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Visited */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-dark-800 dark:text-white mb-4">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            Most Visited
          </h2>
          {stats?.mostVisited?.length > 0 ? (
            <div className="space-y-3">
              {stats.mostVisited.map((bookmark, i) => (
                <div
                  key={bookmark._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    trackClick(bookmark._id);
                    window.open(bookmark.url, '_blank');
                  }}
                >
                  <span className="text-sm font-bold text-dark-300 dark:text-dark-600 w-6 text-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-700 dark:text-dark-200 truncate group-hover:text-primary-500 transition-colors">
                      {bookmark.title}
                    </p>
                    <p className="text-xs text-dark-400 truncate">{bookmark.url}</p>
                  </div>
                  <span className="text-xs font-medium text-dark-400 bg-dark-100 dark:bg-dark-700 px-2 py-1 rounded-lg">
                    {bookmark.clickCount} clicks
                  </span>
                  <ExternalLink className="w-4 h-4 text-dark-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dark-400 dark:text-dark-500 text-center py-8">
              Start clicking your bookmarks to see stats here.
            </p>
          )}
        </motion.div>

        {/* Recent Bookmarks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-dark-800 dark:text-white">
              <Clock className="w-5 h-5 text-accent-500" />
              Recent Bookmarks
            </h2>
            <Link to="/bookmarks" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              View all
            </Link>
          </div>
          {stats?.recentBookmarks?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentBookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    trackClick(bookmark._id);
                    window.open(bookmark.url, '_blank');
                  }}
                >
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`}
                    alt=""
                    className="w-6 h-6 rounded flex-shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-700 dark:text-dark-200 truncate group-hover:text-primary-500 transition-colors">
                      {bookmark.title}
                    </p>
                    <p className="text-xs text-dark-400 truncate">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {bookmark.isFavorite && (
                    <Heart className="w-4 h-4 text-rose-500 fill-current flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dark-400 dark:text-dark-500 text-center py-8">
              No bookmarks yet. <Link to="/bookmarks/new" className="text-primary-500">Add your first!</Link>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
