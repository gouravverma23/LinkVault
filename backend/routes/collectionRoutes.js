const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

router.route('/').get(protect, getCollections).post(protect, createCollection);
router
  .route('/:id')
  .put(protect, updateCollection)
  .delete(protect, deleteCollection);

module.exports = router;
