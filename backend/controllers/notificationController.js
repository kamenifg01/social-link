const db = require("../models");

// Récupérer toutes les notifications d'un utilisateur
exports.getUserNotifications = async (req, res) => {
  const userId = req.user.id; // Obtenez l'utilisateur connecté via le middleware d'authentification

  try {
    const notifications = await db.Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await db.Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error });
  }
};
