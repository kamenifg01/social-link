'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
      });
      Message.belongsTo(models.Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation'
      });
      Message.hasMany(models.Message, {
        foreignKey: 'replyToId',
        as: 'replies'
      });
      Message.belongsTo(models.Message, {
        foreignKey: 'replyToId',
        as: 'replyTo'
      });
    }
  }

  Message.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversations',
        key: 'id'
      }
    },
    replyToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Messages',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      defaultValue: 'text'
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent'
    },
    readBy: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Message',
    indexes: [
      {
        fields: ['conversationId', 'createdAt']
      },
      {
        fields: ['senderId']
      }
    ]
  });

  return Message;
}; 