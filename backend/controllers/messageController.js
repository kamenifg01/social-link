const { Conversation, Message, User, ConversationParticipant, Sequelize, UserRelation, sequelize } = require('../models');
const { Op, literal } = require('sequelize');
const messageService = require('../services/messageService');

class MessageController {
  async createConversation(req, res) {
    try {
      const { participantIds, title } = req.body;
      
      if (!participantIds || !Array.isArray(participantIds)) {
        return res.status(400).json({ error: 'Liste des participants invalide' });
      }

      const conversation = await messageService.createConversation(
        req.user.id,
        participantIds,
        title
      );

      res.status(201).json(conversation);
    } catch (error) {
      console.error('createConversation - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getConversation(req, res) {
    try {
      const conversation = await messageService.getConversationById(
        req.params.id,
        req.user.id
      );
      res.json(conversation);
    } catch (error) {
      console.error('getConversation - Erreur:', error);
      res.status(404).json({ error: error.message });
    }
  }

  async getUserConversations(req, res) {
    try {
      const conversations = await messageService.getUserConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error('getUserConversations - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const { content } = req.body;
      const attachments = req.files ? req.files.map(file => file.path) : [];
      
      if (!content && attachments.length === 0) {
        return res.status(400).json({ error: 'Le message ne peut pas être vide' });
      }

      const message = await messageService.sendMessage(
        req.user.id,
        req.params.conversationId,
        content,
        attachments
      );

      // Récupérer le message avec les informations de l'expéditeur
      const messageWithSender = await Message.findByPk(message.id, {
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profilePicture']
        }]
      });

      res.status(201).json(messageWithSender);
    } catch (error) {
      console.error('sendMessage - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const messages = await Message.findAndCountAll({
        where: { conversationId },
        include: [{
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profilePicture']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        messages: messages.rows,
        total: messages.count,
        page: parseInt(page),
        totalPages: Math.ceil(messages.count / limit)
      });
    } catch (error) {
      console.error('getMessages - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      await messageService.markConversationAsRead(
        req.user.id,
        req.params.conversationId
      );
      res.json({ success: true });
    } catch (error) {
      console.error('markAsRead - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await messageService.getUnreadCount(req.user.id);
      res.json({ count });
    } catch (error) {
      console.error('getUnreadCount - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteMessage(req, res) {
    try {
      const message = await Message.findOne({
        where: {
          id: req.params.messageId,
          senderId: req.user.id
        }
      });

      if (!message) {
        return res.status(404).json({ error: 'Message non trouvé ou non autorisé' });
      }

      await message.destroy();
      res.json({ success: true });
    } catch (error) {
      console.error('deleteMessage - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async editMessage(req, res) {
    try {
      const { content } = req.body;
      const message = await Message.findOne({
        where: {
          id: req.params.messageId,
          senderId: req.user.id
        }
      });

      if (!message) {
        return res.status(404).json({ error: 'Message non trouvé ou non autorisé' });
      }

      await message.update({
        content,
        metadata: { ...message.metadata, edited: true }
      });

      res.json(message);
    } catch (error) {
      console.error('editMessage - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async addParticipants(req, res) {
    try {
      const { participantIds } = req.body;
      const { conversationId } = req.params;

      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }

      await Promise.all(participantIds.map(userId =>
        conversation.addParticipant(userId)
      ));

      const updatedConversation = await messageService.getConversationById(
        conversationId,
        req.user.id
      );

      res.json(updatedConversation);
    } catch (error) {
      console.error('addParticipants - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async removeParticipant(req, res) {
    try {
      const { conversationId, userId } = req.params;

      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }

      await conversation.removeParticipant(userId);
      res.json({ success: true });
    } catch (error) {
      console.error('removeParticipant - Erreur:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MessageController(); 