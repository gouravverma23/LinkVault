import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, Type, FileText, FolderOpen, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { bookmarkService } from '../services/bookmarkService';
import { collectionService } from '../services/collectionService';
import TagInput from '../components/TagInput';
import toast from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

const CreateBookmarkPage = () => {
  const navigate = useNavigate();
  const { createBookmark } = useBookmarks();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);
  const [form, setForm] = useState({
    url: '',
    title: '',
    description: '',
    category: '',
    tags: [],
    collectionId: '',
    favicon: '',
    ogImage: '',
  });

  const debouncedUrl = useDebounce(form.url, 800);

  // Fetch collections
  useEffect(() => {
    collectionService.getAll().then(setCollections).catch(() => {});
  }, []);

  // Auto-fetch link preview when URL changes
  useEffect(() => {
    const fetchPreview = async () => {
      if (!debouncedUrl || debouncedUrl.length < 5) return;
      // Basic URL check
      const hasProtocol = debouncedUrl.startsWith('http://') || debouncedUrl.startsWith('https://');
      const hasDot = debouncedUrl.includes('.');
      if (!hasDot) return;

      setFetchingPreview(true);
      try {
        const preview = await bookmarkService.getPreview(
          hasProtocol ? debouncedUrl : `https://${debouncedUrl}`
        );
        setForm((prev) => ({
          ...prev,
          title: prev.title || preview.title || '',
          description: prev.description || preview.description || '',
          favicon: preview.favicon || '',
          ogImage: preview.ogImage || '',
          url: preview.url || prev.url,
        }));
      } catch {
        // silent
      } finally {
        setFetchingPreview(false);
      }
    };
    fetchPreview();
  }, [debouncedUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url) return toast.error('URL is required');
    if (!form.title) return toast.error('Title is required');

    setLoading(true);
    try {
      await createBookmark({
        ...form,
        collectionId: form.collectionId || undefined,
      });
      navigate('/bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost text-sm mb-6 !px-0"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>

        <h1 className="text-2xl font-bold text-dark-800 dark:text-white mb-6">
          Add New Bookmark
        </h1>

        {/* Link Preview Card */}
        {(form.ogImage || form.favicon) && (
          <div className="glass-card mb-6 overflow-hidden">
            {form.ogImage && (
              <div className="h-40 overflow-hidden">
                <img src={form.ogImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div className="p-4 flex items-center gap-3">
              {form.favicon && (
                <img src={form.favicon} alt="" className="w-6 h-6 rounded" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark-700 dark:text-dark-200 truncate">{form.title || 'Website Title'}</p>
                <p className="text-xs text-dark-400 truncate">{form.url}</p>
              </div>
              {fetchingPreview && <Loader2 className="w-4 h-4 text-primary-500 animate-spin ml-auto" />}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          {/* URL */}
          <div>
            <label htmlFor="bookmark-url" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
              URL *
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                id="bookmark-url"
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com"
                className="input-field !pl-10"
                required
              />
              {fetchingPreview && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-primary-500">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Fetching preview...
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="bookmark-title" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
              Title *
            </label>
            <div className="relative">
              <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                id="bookmark-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Bookmark title"
                className="input-field !pl-10"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="bookmark-desc" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-dark-400" />
              <textarea
                id="bookmark-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description..."
                rows={3}
                className="input-field !pl-10 resize-none"
              />
            </div>
          </div>

          {/* Category + Collection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bookmark-category" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
                Category
              </label>
              <div className="relative">
                <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="bookmark-category"
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Frontend, Design"
                  className="input-field !pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="bookmark-collection" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
                Collection
              </label>
              <select
                id="bookmark-collection"
                value={form.collectionId}
                onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
                className="input-field"
              >
                <option value="">None</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">
              Tags
            </label>
            <TagInput
              tags={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Bookmark'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateBookmarkPage;
