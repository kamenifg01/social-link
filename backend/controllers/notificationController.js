const { Notification, User } = require('../models');
const { Op } = require('sequelize');

// Récupérer toutes les notifications d'un utilisateur
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const notifications = await Notification.findAndCountAll({
      where: { userId: req.user.id },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      notifications: notifications.rows,
      total: notifications.count,
      currentPage: page,
      totalPages: Math.ceil(notifications.count / limit)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des notifications',
      error: error.message 
    });
  }
};

// Récupérer les notifications non lues d'un utilisateur
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { 
        userId: req.user.id,
        isRead: false
      },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications non lues:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des notifications non lues',
      error: error.message 
    });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    await notification.update({ isRead: true });
    res.json(notification);
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    res.status(500).json({ message: 'Erreur lors du marquage de la notification' });
  }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    res.status(500).json({ message: 'Erreur lors du marquage des notifications' });
  }
};

// Créer une nouvelle notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message, recipientId, postId, commentId } = req.body;
    
    const notification = await Notification.create({
      type,
      message,
      userId: recipientId,
      senderId: req.user.id,
      postId,
      commentId,
      isRead: false
    });

    const fullNotification = await Notification.findByPk(notification.id, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'username', 'profilePicture']
      }],
      attributes: ['id', 'type', 'message', 'isRead', 'createdAt', 'updatedAt']
    });

    return res.status(201).json({ 
      success: true,
      notification: fullNotification 
    });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    return res.status(500).json({ 
      success: false,
      message: "Une erreur est survenue lors de la création de la notification",
      error: error.message 
    });
  }
};
// Supprimer une notification
exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.destroy({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!result) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la notification' });
  }
};

// Supprimer toutes les notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.user.id }
    });
    res.json({ message: 'Toutes les notifications ont été supprimées' });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression des notifications' });
  }
};

// Compter les notifications non lues
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { 
        userId: req.user.id,
        isRead: false
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    res.status(500).json({ message: 'Erreur lors du comptage des notifications non lues' });
  }
};

