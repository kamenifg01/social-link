'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'recipient'
      });
      Notification.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });
      Notification.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
      Notification.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        as: 'comment'
      });
    }
  }

  Notification.init({
    type: {
      type: DataTypes.ENUM(
        'LIKE',
        'COMMENT',
        'FOLLOW',
        'REPOST',
        'MENTION',
        'CONNECTION_REQUEST',
        'CONNECTION_ACCEPTED',
        'INVITATION_ACCEPTED',
        'MESSAGE'
      ),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Notification',
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['senderId']
      },
      {
        fields: ['isRead']
      },
      {
        fields: ['createdAt']
      }
    ],
    hooks: {
      beforeCreate: async (notification) => {
        // Vérifier que l'utilisateur existe
        const User = sequelize.models.User;
        const [recipient, sender] = await Promise.all([
          User.findByPk(notification.userId),
          User.findByPk(notification.senderId)
        ]);

        if (!recipient) {
          throw new Error('Utilisateur destinataire non trouvé');
        }
        if (!sender) {
          throw new Error('Utilisateur expéditeur non trouvé');
        }

        // Vérifier le post si postId est fourni
        if (notification.postId) {
          const Post = sequelize.models.Post;
          const post = await Post.findByPk(notification.postId);
          if (!post) {
            throw new Error('Post non trouvé');
          }
        }

        // Vérifier le commentaire si commentId est fourni
        if (notification.commentId) {
          const Comment = sequelize.models.Comment;
          const comment = await Comment.findByPk(notification.commentId);
          if (!comment) {
            throw new Error('Commentaire non trouvé');
          }
        }
      }
    }
  });

  return Notification;
}; 