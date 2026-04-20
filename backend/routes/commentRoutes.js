const express = require('express');
const router = express.Router();
const { getComments, addComment, likeComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:careerId')
  .get(getComments)
  .post(protect, addComment);

router.route('/:id/like').put(protect, likeComment);

module.exports = router;
