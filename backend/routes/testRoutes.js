const express = require('express');
const router = express.Router();
const { getQuestions, submitTest, getHistory } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getQuestions).post(protect, submitTest);
router.route('/history').get(protect, getHistory);

module.exports = router;
