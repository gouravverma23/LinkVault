const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Bookmark title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    url: {
      type: String,
      required: [true, 'Bookmark URL is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'Uncategorized',
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
    favicon: {
      type: String,
      default: '',
    },
    ogImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
bookmarkSchema.index({ userId: 1, createdAt: -1 });
bookmarkSchema.index({ userId: 1, category: 1 });
bookmarkSchema.index({ userId: 1, tags: 1 });
bookmarkSchema.index({ userId: 1, isFavorite: 1 });
bookmarkSchema.index({ userId: 1, clickCount: -1 });
bookmarkSchema.index(
  { title: 'text', description: 'text', url: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 3, url: 1 } }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);
