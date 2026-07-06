const Bookmark = require('../models/Bookmark');

// @desc    Get all bookmarks for user
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const {
      category,
      tag,
      collectionId,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    const query = { userId: req.user._id };

    if (category && category !== 'all') query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (collectionId) query.collectionId = collectionId;

    const sortOptions = {};
    if (sort === 'newest') sortOptions.createdAt = -1;
    else if (sort === 'oldest') sortOptions.createdAt = 1;
    else if (sort === 'alpha') sortOptions.title = 1;
    else if (sort === 'alpha-desc') sortOptions.title = -1;
    else if (sort === 'most-visited') sortOptions.clickCount = -1;
    else sortOptions.createdAt = -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [bookmarks, total] = await Promise.all([
      Bookmark.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('collectionId', 'name color icon'),
      Bookmark.countDocuments(query),
    ]);

    res.json({
      bookmarks,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bookmark
// @route   GET /api/bookmarks/:id
// @access  Private
const getBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate('collectionId', 'name color icon');

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    next(error);
  }
};

// @desc    Create bookmark
// @route   POST /api/bookmarks
// @access  Private
const createBookmark = async (req, res, next) => {
  try {
    const { title, url, description, category, tags, collectionId, favicon, ogImage } =
      req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      description: description || '',
      category: category || 'Uncategorized',
      tags: tags || [],
      collectionId: collectionId || null,
      favicon: favicon || '',
      ogImage: ogImage || '',
      userId: req.user._id,
    });

    const populated = await bookmark.populate('collectionId', 'name color icon');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update bookmark
// @route   PUT /api/bookmarks/:id
// @access  Private
const updateBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    const fields = ['title', 'url', 'description', 'category', 'tags', 'collectionId', 'isFavorite', 'favicon', 'ogImage'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        bookmark[field] = req.body[field];
      }
    });

    const updated = await bookmark.save();
    const populated = await updated.populate('collectionId', 'name color icon');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite
// @route   PUT /api/bookmarks/:id/favorite
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    bookmark.isFavorite = !bookmark.isFavorite;
    const updated = await bookmark.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get favorites
// @route   GET /api/bookmarks/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({
      userId: req.user._id,
      isFavorite: true,
    })
      .sort({ updatedAt: -1 })
      .populate('collectionId', 'name color icon');

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

// @desc    Search bookmarks
// @route   GET /api/bookmarks/search
// @access  Private
const searchBookmarks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const bookmarks = await Bookmark.find({
      userId: req.user._id,
      $text: { $search: q },
    })
      .sort({ score: { $meta: 'textScore' } })
      .populate('collectionId', 'name color icon');

    res.json(bookmarks);
  } catch (error) {
    // Fallback to regex search if text index fails
    try {
      const regex = new RegExp(req.query.q, 'i');
      const bookmarks = await Bookmark.find({
        userId: req.user._id,
        $or: [
          { title: regex },
          { description: regex },
          { url: regex },
          { tags: regex },
          { category: regex },
        ],
      })
        .sort({ createdAt: -1 })
        .populate('collectionId', 'name color icon');

      res.json(bookmarks);
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};

// @desc    Track bookmark click
// @route   PUT /api/bookmarks/:id/click
// @access  Private
const trackClick = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        $inc: { clickCount: 1 },
        $set: { lastClickedAt: new Date() },
      },
      { new: true }
    );

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json(bookmark);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/bookmarks/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalBookmarks,
      favoriteCount,
      categories,
      mostVisited,
      recentBookmarks,
    ] = await Promise.all([
      Bookmark.countDocuments({ userId }),
      Bookmark.countDocuments({ userId, isFavorite: true }),
      Bookmark.distinct('category', { userId }),
      Bookmark.find({ userId, clickCount: { $gt: 0 } })
        .sort({ clickCount: -1 })
        .limit(5)
        .populate('collectionId', 'name color icon'),
      Bookmark.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('collectionId', 'name color icon'),
    ]);

    res.json({
      totalBookmarks,
      favoriteCount,
      categoryCount: categories.length,
      categories,
      mostVisited,
      recentBookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export bookmarks
// @route   GET /api/bookmarks/export
// @access  Private
const exportBookmarks = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      const headers = 'Title,URL,Description,Category,Tags,Favorite,Click Count,Created At\n';
      const rows = bookmarks
        .map(
          (b) =>
            `"${(b.title || '').replace(/"/g, '""')}","${b.url}","${(b.description || '').replace(/"/g, '""')}","${b.category}","${(b.tags || []).join(';')}","${b.isFavorite}","${b.clickCount}","${b.createdAt}"`
        )
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookmarks.csv');
      return res.send(headers + rows);
    }

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

// @desc    Import bookmarks
// @route   POST /api/bookmarks/import
// @access  Private
const importBookmarks = async (req, res, next) => {
  try {
    const { bookmarks } = req.body;

    if (!Array.isArray(bookmarks) || bookmarks.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of bookmarks' });
    }

    const toInsert = bookmarks.map((b) => ({
      title: b.title || 'Untitled',
      url: b.url,
      description: b.description || '',
      category: b.category || 'Uncategorized',
      tags: b.tags || [],
      isFavorite: b.isFavorite || false,
      userId: req.user._id,
    }));

    // Filter out entries without URL
    const valid = toInsert.filter((b) => b.url);
    const inserted = await Bookmark.insertMany(valid);

    res.status(201).json({
      message: `Successfully imported ${inserted.length} bookmarks`,
      count: inserted.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
