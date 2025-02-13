const { Message, User, Conversation, ConversationParticipant } = require('../models');
const { Op } = require('sequelize');

class MessageService {
  async createConversation(creatorId, participantIds, title = null) {
    const conversation = await Conversation.create({
      creatorId,
      title
    });

    // Ajouter tous les participants, y compris le créateur
    const allParticipants = [...new Set([creatorId, ...participantIds])];
    await Promise.all(
      allParticipants.map(userId =>
        ConversationParticipant.create({
          userId,
          conversationId: conversation.id
        })
      )
    );

    return this.getConversationById(conversation.id);
  }

  async getConversationById(conversationId, userId) {
    const conversation = await Conversation.findOne({
      where: { id: conversationId },
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Message,
          as: 'messages',
          limit: 50,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ]
    });

    if (!conversation) {
      throw new Error('Conversation non trouvée');
    }

    // Vérifier si l'utilisateur est participant
    if (userId && !conversation.participants.some(p => p.id === userId)) {
      throw new Error('Non autorisé à accéder à cette conversation');
    }

    return conversation;
  }

  async getUserConversations(userId) {
    return await Conversation.findAll({
      include: [
        {
          model: ConversationParticipant,
          where: { userId },
          attributes: ['lastReadAt']
        },
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'profilePicture']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'username', 'profilePicture']
          }]
        }
      ],
      order: [[{ model: Message, as: 'messages' }, 'createdAt', 'DESC']]
    });
  }

  async sendMessage(senderId, conversationId, content, attachments = []) {
    // Vérifier si l'utilisateur est participant
    const participant = await ConversationParticipant.findOne({
      where: { userId: senderId, conversationId }
    });

    if (!participant) {
      throw new Error('Non autorisé à envoyer un message dans cette conversation');
    }

    const message = await Message.create({
      senderId,
      conversationId,
      content,
      attachments
    });

    return await Message.findByPk(message.id, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });
  }

  async markConversationAsRead(userId, conversationId) {
    const participant = await ConversationParticipant.findOne({
      where: { userId, conversationId }
    });

    if (!participant) {
      throw new Error('Participant non trouvé');
    }

    await participant.update({ lastReadAt: new Date() });
    return true;
  }

  async getUnreadCount(userId) {
    const conversations = await this.getUserConversations(userId);
    let unreadCount = 0;

    for (const conversation of conversations) {
      const participant = conversation.ConversationParticipants[0];
      const lastMessage = conversation.messages[0];

      if (lastMessage && (!participant.lastReadAt || new Date(lastMessage.createdAt) > new Date(participant.lastReadAt))) {
        unreadCount++;
      }
    }

    return unreadCount;
  }
}

module.exports = new MessageService(); 