const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const auth = require('../middleware/auth');

// Routes de recherche
router.get('/users', auth, searchController.searchUsers);
router.get('/posts', auth, searchController.searchPosts);
router.get('/all', auth, searchController.searchAll);
router.get('/suggestions', auth, searchController.getSuggestions);

module.exports = router; 