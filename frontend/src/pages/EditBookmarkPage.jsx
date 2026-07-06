import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, Type, FileText, FolderOpen, ArrowLeft } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { bookmarkService } from '../services/bookmarkService';
import { collectionService } from '../services/collectionService';
import TagInput from '../components/TagInput';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditBookmarkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBookmark } = useBookmarks();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  useEffect(() => {
    const load = async () => {
      try {
        const [bookmark, cols] = await Promise.all([
          bookmarkService.getOne(id),
          collectionService.getAll(),
        ]);
        setForm({
          url: bookmark.url || '',
          title: bookmark.title || '',
          description: bookmark.description || '',
          category: bookmark.category || '',
          tags: bookmark.tags || [],
          collectionId: bookmark.collectionId?._id || bookmark.collectionId || '',
          favicon: bookmark.favicon || '',
          ogImage: bookmark.ogImage || '',
        });
        setCollections(cols);
      } catch {
        toast.error('Bookmark not found');
        navigate('/bookmarks');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.url || !form.title) return toast.error('URL and title are required');

    setLoading(true);
    try {
      await updateBookmark(id, {
        ...form,
        collectionId: form.collectionId || null,
      });
      navigate('/bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-6 !px-0">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </button>

        <h1 className="text-2xl font-bold text-dark-800 dark:text-white mb-6">Edit Bookmark</h1>

        {/* Preview */}
        {form.ogImage && (
          <div className="glass-card mb-6 overflow-hidden">
            <div className="h-40 overflow-hidden">
              <img src={form.ogImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">URL *</label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input id="edit-url" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input-field !pl-10" required />
            </div>
          </div>

          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Title *</label>
            <div className="relative">
              <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input id="edit-title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field !pl-10" required />
            </div>
          </div>

          <div>
            <label htmlFor="edit-desc" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Description</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-dark-400" />
              <textarea id="edit-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-field !pl-10 resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Category</label>
              <div className="relative">
                <FolderOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input id="edit-category" type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field !pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="edit-collection" className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Collection</label>
              <select id="edit-collection" value={form.collectionId} onChange={(e) => setForm({ ...form, collectionId: e.target.value })} className="input-field">
                <option value="">None</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id}>{col.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Tags</label>
            <TagInput tags={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Update Bookmark'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditBookmarkPage;
