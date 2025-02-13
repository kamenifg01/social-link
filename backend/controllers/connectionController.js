const db = require('../models');
const { Connection, User } = db;

exports.sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const sourceUserId = req.user.id;

    if (!targetUserId) {
      return res.status(400).json({ message: 'ID de l\'utilisateur cible requis' });
    }

    // Vérifier si l'utilisateur cible existe
    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur cible non trouvé' });
    }

    // Vérifier si l'utilisateur essaie de se connecter à lui-même
    if (sourceUserId === targetUserId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous connecter à vous-même' });
    }

    // Vérifier si la demande existe déjà
    const existingRequest = await Connection.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { sourceUserId, targetUserId },
          { sourceUserId: targetUserId, targetUserId: sourceUserId }
        ],
        status: ['pending', 'accepted']
      }
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({ message: 'Une demande de connexion est déjà en attente' });
      } else {
        return res.status(400).json({ message: 'Vous êtes déjà connecté avec cet utilisateur' });
      }
    }

    // Créer la demande
    const connection = await Connection.create({
      sourceUserId,
      targetUserId,
      status: 'pending'
    });

    // Inclure les informations de l'utilisateur source dans la réponse
    const sourceUser = await User.findByPk(sourceUserId, {
      attributes: ['id', 'username', 'profilePicture']
    });

    res.status(201).json({
      message: 'Demande de connexion envoyée',
      connection: {
        ...connection.toJSON(),
        sourceUser
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de la demande de connexion' });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const pendingRequests = await Connection.findAll({
      where: {
        targetUserId: userId,
        status: 'pending'
      },
      include: [{
        model: User,
        as: 'sourceUser',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.json(pendingRequests);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findOne({
      where: {
        id: requestId,
        targetUserId: userId,
        status: 'pending'
      }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    await connection.update({ status: 'accepted' });
    res.json({ message: 'Demande acceptée', connection });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande:', error);
    res.status(500).json({ message: 'Erreur lors de l\'acceptation de la demande' });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const connection = await Connection.findOne({
      where: {
        id: requestId,
        targetUserId: userId,
        status: 'pending'
      }
    });

    if (!connection) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    await connection.update({ status: 'rejected' });
    res.json({ message: 'Demande rejetée' });
  } catch (error) {
    console.error('Erreur lors du rejet de la demande:', error);
    res.status(500).json({ message: 'Erreur lors du rejet de la demande' });
  }
};

exports.getNetwork = async (req, res) => {
  try {
    const userId = req.user.id;
    const connections = await Connection.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { sourceUserId: userId },
          { targetUserId: userId }
        ],
        status: 'accepted'
      },
      include: [{
        model: User,
        as: 'sourceUser',
        attributes: ['id', 'username', 'profilePicture']
      }, {
        model: User,
        as: 'targetUser',
        attributes: ['id', 'username', 'profilePicture']
      }]
    });

    res.json(connections);
  } catch (error) {
    console.error('Erreur lors de la récupération du réseau:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du réseau' });
  }
};