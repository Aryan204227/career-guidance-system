const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleLogin, googleAccessLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);          // ID token flow (unused fallback)
router.post('/google-access', googleAccessLogin); // Access token flow (used by frontend)

module.exports = router;
