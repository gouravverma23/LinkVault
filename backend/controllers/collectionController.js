const Collection = require('../models/Collection');
const Bookmark = require('../models/Bookmark');

// @desc    Get all collections for user
// @route   GET /api/collections
// @access  Private
const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    // Get bookmark count for each collection
    const collectionsWithCount = await Promise.all(
      collections.map(async (col) => {
        const count = await Bookmark.countDocuments({
          collectionId: col._id,
          userId: req.user._id,
        });
        return { ...col.toObject(), bookmarkCount: count };
      })
    );

    res.json(collectionsWithCount);
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private
const createCollection = async (req, res, next) => {
  try {
    const { name, description, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Collection name is required' });
    }

    const collection = await Collection.create({
      name,
      description: description || '',
      color: color || '#6366f1',
      icon: icon || 'folder',
      userId: req.user._id,
    });

    res.status(201).json({ ...collection.toObject(), bookmarkCount: 0 });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private
const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    const fields = ['name', 'description', 'color', 'icon'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        collection[field] = req.body[field];
      }
    });

    const updated = await collection.save();
    const count = await Bookmark.countDocuments({
      collectionId: updated._id,
      userId: req.user._id,
    });

    res.json({ ...updated.toObject(), bookmarkCount: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Remove collection reference from bookmarks
    await Bookmark.updateMany(
      { collectionId: req.params.id, userId: req.user._id },
      { $set: { collectionId: null } }
    );

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};
