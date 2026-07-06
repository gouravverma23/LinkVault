const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getBookmarks,
  getBookmark,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  toggleFavorite,
  getFavorites,
  searchBookmarks,
  trackClick,
  getStats,
  exportBookmarks,
  importBookmarks,
} = require('../controllers/bookmarkController');

// Static routes MUST come before :id routes
router.get('/search', protect, searchBookmarks);
router.get('/favorites', protect, getFavorites);
router.get('/stats', protect, getStats);
router.get('/export', protect, exportBookmarks);
router.post('/import', protect, importBookmarks);

router.route('/').get(protect, getBookmarks).post(protect, createBookmark);

router
  .route('/:id')
  .get(protect, getBookmark)
  .put(protect, updateBookmark)
  .delete(protect, deleteBookmark);

router.put('/:id/favorite', protect, toggleFavorite);
router.put('/:id/click', protect, trackClick);

module.exports = router;
