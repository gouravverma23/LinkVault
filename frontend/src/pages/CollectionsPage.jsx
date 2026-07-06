import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, Plus, Edit3, Trash2, Bookmark } from 'lucide-react';
import { collectionService } from '../services/collectionService';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const CollectionsPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCol, setEditingCol] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#6366f1' });

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const openCreate = () => {
    setEditingCol(null);
    setForm({ name: '', description: '', color: '#6366f1' });
    setShowModal(true);
  };

  const openEdit = (col) => {
    setEditingCol(col);
    setForm({ name: col.name, description: col.description || '', color: col.color || '#6366f1' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');

    try {
      if (editingCol) {
        const updated = await collectionService.update(editingCol._id, form);
        setCollections((prev) => prev.map((c) => (c._id === editingCol._id ? updated : c)));
        toast.success('Collection updated!');
      } else {
        const created = await collectionService.create(form);
        setCollections((prev) => [created, ...prev]);
        toast.success('Collection created!');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await collectionService.delete(deleteId);
      setCollections((prev) => prev.filter((c) => c._id !== deleteId));
      toast.success('Collection deleted!');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-dark-800 dark:text-white">Collections</h1>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> New Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No collections yet"
          message="Create collections to group your bookmarks together."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {collections.map((col, i) => (
              <motion.div
                key={col._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/bookmarks?collectionId=${col._id}`)}
              >
                <div className="h-2" style={{ backgroundColor: col.color || '#6366f1' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${col.color}20` }}
                      >
                        <FolderOpen className="w-5 h-5" style={{ color: col.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-800 dark:text-dark-100 group-hover:text-primary-500 transition-colors">
                          {col.name}
                        </h3>
                        <p className="text-xs text-dark-400 flex items-center gap-1 mt-0.5">
                          <Bookmark className="w-3 h-3" /> {col.bookmarkCount || 0} bookmarks
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => openEdit(col)} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-primary-500">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(col._id)} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {col.description && (
                    <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-2">{col.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingCol ? 'Edit Collection' : 'New Collection'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Frontend Resources"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              rows={2}
              className="input-field resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-600 dark:text-dark-300 mb-1.5">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-lg transition-transform ${form.color === c ? 'scale-110 ring-2 ring-offset-2 ring-dark-300 dark:ring-offset-dark-800' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editingCol ? 'Update' : 'Create'} Collection
            </button>
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message="Bookmarks in this collection won't be deleted, but will no longer be grouped."
      />
    </div>
  );
};

export default CollectionsPage;
