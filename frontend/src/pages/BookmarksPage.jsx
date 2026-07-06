import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { collectionService } from '../services/collectionService';
import BookmarkCard from '../components/BookmarkCard';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alpha', label: 'A → Z' },
  { value: 'alpha-desc', label: 'Z → A' },
  { value: 'most-visited', label: 'Most Visited' },
];

const BookmarksPage = () => {
  const {
    bookmarks,
    loading,
    pagination,
    filters,
    fetchBookmarks,
    deleteBookmark,
    updateFilters,
  } = useBookmarks();

  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const collectionId = searchParams.get('collectionId') || '';

  // Fetch collections to resolve collection details (e.g. name)
  useEffect(() => {
    const fetchCols = async () => {
      try {
        const data = await collectionService.getAll();
        setCollections(data);
      } catch {
        // silent
      }
    };
    fetchCols();
  }, []);

  const activeCollection = collections.find((c) => c._id === collectionId);

  // Fetch bookmarks whenever filters or collectionId change.
  // Pass collectionId directly as a param so it's always included in the API call,
  // avoiding the race condition of relying on context filters state.
  useEffect(() => {
    fetchBookmarks({ page: 1, collectionId });
  }, [fetchBookmarks, collectionId]);

  // Extract unique categories from bookmarks
  useEffect(() => {
    const cats = [...new Set(bookmarks.map((b) => b.category).filter(Boolean))];
    setCategories(cats);
  }, [bookmarks]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBookmark(deleteId);
      setDeleteId(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchBookmarks({ page: newPage, collectionId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-800 dark:text-white">
            {activeCollection ? `Collection: ${activeCollection.name}` : 'My Bookmarks'}
          </h1>
          {activeCollection && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs text-primary-500 hover:text-primary-600 font-medium hover:underline mt-1"
            >
              Clear collection filter
            </button>
          )}
        </div>
        <p className="text-sm text-dark-400">
          {pagination.total} bookmark{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-dark-500 dark:text-dark-400">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl text-sm text-dark-700 dark:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <div className="flex items-center gap-1.5">
              <SortAsc className="w-4 h-4 text-dark-400" />
              <select
                id="filter-sort"
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="appearance-none pl-3 pr-8 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-600 rounded-xl text-sm text-dark-700 dark:text-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarks Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : bookmarks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence>
              {bookmarks.map((bookmark, i) => (
                <BookmarkCard
                  key={bookmark._id}
                  bookmark={bookmark}
                  index={i}
                  onDelete={setDeleteId}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-ghost !p-2 disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    page === pagination.page
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn-ghost !p-2 disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Bookmark"
        message="Are you sure you want to delete this bookmark? This action cannot be undone."
      />
    </div>
  );
};

export default BookmarksPage;
