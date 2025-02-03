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

<<<<<<< Updated upstream
=======
// Routes pour les likes
router.post('/:id/like', postController.likePost);
router.get('/:id/reactions', postController.getPostReactions);

// Routes pour les reposts et partages
router.post('/:id/repost', postController.repostPost);
router.post('/:id/share', postController.sharePost);

// Routes pour les commentaires
router.get('/:id/comments', postController.getComments);
router.post('/:id/comments', postController.createComment);
router.put('/:postId/comments/:commentId', postController.updateComment);
router.delete('/:postId/comments/:commentId', postController.deleteComment);

// Routes pour les réactions aux commentaires
router.post('/:postId/comments/:commentId/react', postController.reactToComment);
router.delete('/:postId/comments/:commentId/react/:reactionType', postController.removeReaction);

>>>>>>> Stashed changes
module.exports = router; 