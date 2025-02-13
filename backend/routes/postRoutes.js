const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes protégées
router.get('/feed', auth, postController.getFeed);
router.post('/', auth, upload.single('media'), postController.createPost);

// Routes publiques
router.get('/:id', postController.getPost);
router.get('/:id/comments', postController.getPostComments);
router.get('/:id/likes', postController.getPostLikes);
router.get('/:id/shares', postController.getPostShares);

// Routes protégées avec paramètres
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/like', auth, postController.likePost);
router.delete('/:id/like', auth, postController.unlikePost);
router.post('/:id/comment', auth, postController.createComment);
router.post('/:id/share', auth, postController.sharePost);
router.delete('/:id/share', auth, postController.unsharePost);
router.post('/:id/reaction', auth, postController.reactToPost);
router.delete('/:id/reaction/:type', auth, postController.removeReaction);
router.post('/:id/repost', auth, postController.repostPost);
router.delete('/:id/repost', auth, postController.unrepostPost);
router.put('/:id/visibility', auth, postController.updateVisibility);
router.get('/:id/visibility', auth, postController.getVisibility);

// Nouvelle route pour récupérer les réactions d'un post
router.get('/:id/reaction', auth, postController.getPostReactions);

// Ajouter ces nouvelles routes pour les options de menu
router.get('/:id/menu-options', auth, postController.getPostMenuOptions);
router.post('/:id/hide', auth, postController.hidePost);
router.post('/:id/unhide', auth, postController.unhidePost);
router.post('/:id/report', auth, postController.reportPost);
router.post('/users/:userId/block', auth, postController.blockUser);
router.post('/users/:userId/unblock', auth, postController.unblockUser);

module.exports = router;