import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { bookmarkService } from '../services/bookmarkService';
import { useBookmarks } from '../context/BookmarkContext';
import BookmarkCard from '../components/BookmarkCard';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const { deleteBookmark, toggleFavorite } = useBookmarks();

  const fetchFavorites = async () => {
    try {
      const data = await bookmarkService.getFavorites();
      setFavorites(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBookmark(deleteId);
      setFavorites((prev) => prev.filter((b) => b._id !== deleteId));
      setDeleteId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-800 dark:text-white">Favorites</h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          message="Mark bookmarks as favorite to see them here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {favorites.map((bookmark, i) => (
              <BookmarkCard
                key={bookmark._id}
                bookmark={bookmark}
                index={i}
                onDelete={setDeleteId}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Bookmark"
        message="Are you sure you want to delete this bookmark?"
      />
    </div>
  );
};

export default FavoritesPage;
