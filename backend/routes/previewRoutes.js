const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getLinkPreview } = require('../utils/linkPreview');

// @desc    Fetch link preview metadata
// @route   POST /api/preview
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const preview = await getLinkPreview(url);
    res.json(preview);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
