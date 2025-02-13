const { Notification, User, Post, Comment } = require('../models');

class NotificationService {
  async getNotifications(userId) {
    return await Notification.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'username', 'profilePicture', 'title']
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'content', 'type']
        },
        {
          model: Comment,
          as: 'comment',
          attributes: ['id', 'content']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('Notification non trouvée');
    }

    await notification.update({ isRead: true });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { isRead: true },
      {
        where: {
          userId,
          isRead: false
        }
      }
    );
  }

  async createNotification(data) {
    return await Notification.create(data);
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        userId
      }
    });

    if (!notification) {
      throw new Error('Notification non trouvée');
    }

    await notification.destroy();
  }
}

module.exports = new NotificationService();