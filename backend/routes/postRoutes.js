const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes protégées (nécessitent une authentification)
router.use(authMiddleware);

// Route pour le feed
router.get('/feed', postController.getFeed);

// Routes pour les posts
router.post('/', postController.createPost);
router.get('/user/:userId', postController.getUserPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router; 