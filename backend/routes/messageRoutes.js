const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes protégées par authentification
router.use(auth);

// Conversations
router.post('/conversations', messageController.createConversation);
router.get('/conversations', messageController.getUserConversations);
router.get('/conversations/:id', messageController.getConversation);
router.post('/conversations/:conversationId/messages', upload.array('attachments'), messageController.sendMessage);
router.post('/conversations/:conversationId/read', messageController.markAsRead);
router.get('/unread-count', messageController.getUnreadCount);

// Messages
router.get('/conversations/:conversationId/messages', messageController.getMessages);
router.delete('/messages/:messageId', messageController.deleteMessage);
router.put('/messages/:messageId', messageController.editMessage);

// Participants
router.post('/conversations/:conversationId/participants', messageController.addParticipants);
router.delete('/conversations/:conversationId/participants/:userId', messageController.removeParticipant);

module.exports = router; 