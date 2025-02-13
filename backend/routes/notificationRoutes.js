const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

// Routes protégées
router.get('/', auth, notificationController.getNotifications);
router.get('/unread', auth, notificationController.getUnreadNotifications);
router.get('/unread/count', auth, notificationController.getUnreadCount);
router.put('/:id/read', auth, notificationController.markAsRead);
router.put('/read-all', auth, notificationController.markAllAsRead);
router.delete('/:id', auth, notificationController.deleteNotification);
router.delete('/', auth, notificationController.deleteAllNotifications);

module.exports = router; 