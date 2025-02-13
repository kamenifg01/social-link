const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Appliquer l'authentification à toutes les routes
router.use(auth);

// Routes pour les commentaires
router.get('/posts/:postId/comments', commentController.getPostComments);
router.post('/posts/:postId/comments', commentController.addComment);
router.put('/comments/:commentId', commentController.updateComment);
router.delete('/comments/:commentId', commentController.deleteComment);

// Routes pour les réactions aux commentaires
router.post('/comments/:commentId/react', commentController.reactToComment);
router.delete('/comments/:commentId/react/:reactionType', commentController.removeReaction);

module.exports = router; 