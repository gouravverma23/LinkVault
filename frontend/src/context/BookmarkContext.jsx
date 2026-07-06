import { createContext, useContext, useState, useCallback } from 'react';
import { bookmarkService } from '../services/bookmarkService';
import toast from 'react-hot-toast';

const BookmarkContext = createContext(null);

export const useBookmarks = () => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarkProvider');
  return ctx;
};

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    category: 'all',
    tag: '',
    sort: 'newest',
    collectionId: '',
  });

  const fetchBookmarks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await bookmarkService.getAll({ ...filters, ...params });
      setBookmarks(data.bookmarks);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error('Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await bookmarkService.getStats();
      setStats(data);
    } catch {
      // silent
    }
  }, []);

  const createBookmark = async (data) => {
    const created = await bookmarkService.create(data);
    setBookmarks((prev) => [created, ...prev]);
    toast.success('Bookmark created!');
    return created;
  };

  const updateBookmark = async (id, data) => {
    const updated = await bookmarkService.update(id, data);
    setBookmarks((prev) => prev.map((b) => (b._id === id ? updated : b)));
    toast.success('Bookmark updated!');
    return updated;
  };

  const deleteBookmark = async (id) => {
    await bookmarkService.delete(id);
    setBookmarks((prev) => prev.filter((b) => b._id !== id));
    toast.success('Bookmark deleted!');
  };

  const toggleFavorite = async (id) => {
    const updated = await bookmarkService.toggleFavorite(id);
    setBookmarks((prev) => prev.map((b) => (b._id === id ? { ...b, isFavorite: updated.isFavorite } : b)));
    toast.success(updated.isFavorite ? 'Added to favorites!' : 'Removed from favorites');
  };

  const searchBookmarks = async (query) => {
    setLoading(true);
    try {
      const data = await bookmarkService.search(query);
      setBookmarks(data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (id) => {
    try {
      await bookmarkService.trackClick(id);
      setBookmarks((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, clickCount: (b.clickCount || 0) + 1 } : b
        )
      );
    } catch {
      // silent
    }
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => {
      const hasChanged = Object.keys(newFilters).some(
        (key) => prev[key] !== newFilters[key]
      );
      if (!hasChanged) return prev;
      return { ...prev, ...newFilters };
    });
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        stats,
        loading,
        pagination,
        filters,
        fetchBookmarks,
        fetchStats,
        createBookmark,
        updateBookmark,
        deleteBookmark,
        toggleFavorite,
        searchBookmarks,
        trackClick,
        updateFilters,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
