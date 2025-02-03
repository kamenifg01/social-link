const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/refresh', authController.refreshToken);

// Routes protégées
router.get('/verify', auth, (req, res) => {
  res.status(200).json({ valid: true });
});
router.post('/logout', auth, authController.logout);

module.exports = router; 