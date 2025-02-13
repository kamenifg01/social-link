const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes publiques
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Routes alternatives pour le profil (doivent être avant les routes avec :id)
router.get('/me', auth, userController.getProfile);
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, upload.single('profilePicture'), userController.updateProfile);

// Routes protégées générales
router.get('/search', auth, userController.searchUsers);
router.get('/suggestions', auth, userController.getSuggestions);
router.get('/followers', auth, userController.getFollowers);
router.get('/following', auth, userController.getFollowing);

// Routes d'invitations
router.get('/invitations/pending', auth, userController.getPendingInvitations);

// Routes avec paramètre :id
router.get('/:id/profile', auth, userController.getUserProfile);
router.get('/:id/posts', auth, userController.getUserPosts);
router.get('/:id/followers', auth, userController.getUserFollowers);
router.get('/:id/following', auth, userController.getUserFollowing);
router.get('/:id/follow-status', auth, userController.getFollowStatus);
router.post('/:id/follow', auth, userController.followUser);
router.delete('/:id/follow', auth, userController.unfollowUser);
router.post('/:id/accept-invitation', auth, userController.acceptInvitation);
router.post('/:id/decline-invitation', auth, userController.declineInvitation);

// Route pour obtenir un utilisateur spécifique (doit être en dernier)
router.get('/:id', auth, userController.getUser);

module.exports = router; 