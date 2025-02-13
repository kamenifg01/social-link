const { UserRelation, User, Notification } = require('../models');
const { Op } = require('sequelize');

exports.sendConnectionRequest = async (userId, targetUserId) => {
  // Vérifier si une relation existe déjà
  const existingRelation = await UserRelation.findOne({
    where: {
      [Op.or]: [
        { userId, relatedUserId: targetUserId },
        { userId: targetUserId, relatedUserId: userId }
      ]
    }
  });

  if (existingRelation) {
    throw new Error('Une relation existe déjà avec cet utilisateur');
  }

  // Vérifier si l'utilisateur cible existe
  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser) {
    throw new Error('Utilisateur cible non trouvé');
  }

  // Créer la demande de connexion
  const relation = await UserRelation.create({
    userId,
    relatedUserId: targetUserId,
    status: 'pending'
  });

  // Créer une notification pour l'utilisateur cible
  await Notification.create({
    type: 'CONNECTION_REQUEST',
    userId: targetUserId,
    senderId: userId,
    message: 'Vous avez reçu une demande de connexion',
    isRead: false
  });

  return relation;
};

exports.acceptConnectionRequest = async (userId, requestId) => {
  const request = await UserRelation.findOne({
    where: {
      id: requestId,
      relatedUserId: userId,
      status: 'pending'
    }
  });

  if (!request) {
    throw new Error('Demande de connexion non trouvée');
  }

  // Accepter la demande
  await request.update({ status: 'accepted' });

  // Créer une relation réciproque
  await UserRelation.create({
    userId: request.relatedUserId,
    relatedUserId: request.userId,
    status: 'accepted'
  });

  // Mettre à jour les compteurs
  await Promise.all([
    User.increment('followersCount', { where: { id: request.userId } }),
    User.increment('followingCount', { where: { id: userId } })
  ]);

  // Créer une notification pour l'expéditeur
  await Notification.create({
    type: 'CONNECTION_ACCEPTED',
    userId: request.userId,
    senderId: userId,
    message: 'Votre demande de connexion a été acceptée',
    isRead: false
  });

  return request;
};

exports.rejectConnectionRequest = async (userId, requestId) => {
  const request = await UserRelation.findOne({
    where: {
      id: requestId,
      relatedUserId: userId,
      status: 'pending'
    }
  });

  if (!request) {
    throw new Error('Demande de connexion non trouvée');
  }

  await request.update({ status: 'rejected' });
  return request;
};

exports.removeConnection = async (userId, connectionId) => {
  const connections = await UserRelation.findAll({
    where: {
      [Op.or]: [
        { userId, relatedUserId: connectionId },
        { userId: connectionId, relatedUserId: userId }
      ],
      status: 'accepted'
    }
  });

  if (connections.length === 0) {
    throw new Error('Connexion non trouvée');
  }

  // Supprimer les connexions
  await UserRelation.destroy({
    where: {
      [Op.or]: [
        { userId, relatedUserId: connectionId },
        { userId: connectionId, relatedUserId: userId }
      ],
      status: 'accepted'
    }
  });

  // Mettre à jour les compteurs
  await Promise.all([
    User.decrement('followersCount', { where: { id: connectionId } }),
    User.decrement('followingCount', { where: { id: userId } })
  ]);

  return true;
};

exports.getConnections = async (userId) => {
  return await User.findAll({
    include: [
      {
        model: UserRelation,
        where: {
          [Op.or]: [
            { userId },
            { relatedUserId: userId }
          ],
          status: 'accepted'
        },
        required: true
      }
    ],
    attributes: ['id', 'username', 'profilePicture', 'title', 'company']
  });
};

exports.getPendingRequests = async (userId) => {
  return await UserRelation.findAll({
    where: {
      relatedUserId: userId,
      status: 'pending'
    },
    include: [
      {
        model: User,
        as: 'requester',
        attributes: ['id', 'username', 'profilePicture', 'title', 'company']
      }
    ]
  });
};

exports.getSentRequests = async (userId) => {
  return await UserRelation.findAll({
    where: {
      userId,
      status: 'pending'
    },
    include: [
      {
        model: User,
        as: 'target',
        attributes: ['id', 'username', 'profilePicture', 'title', 'company']
      }
    ]
  });
};

exports.getMutualConnections = async (userId, otherUserId) => {
  const userConnections = await exports.getConnections(userId);
  const otherConnections = await exports.getConnections(otherUserId);

  const userConnectionIds = userConnections.map(conn => conn.id);
  const mutualConnections = otherConnections.filter(conn => 
    userConnectionIds.includes(conn.id)
  );

  return mutualConnections;
}; 