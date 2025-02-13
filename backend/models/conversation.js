'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsToMany(models.User, {
        through: 'ConversationParticipants',
        as: 'participants'
      });
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversationId',
        as: 'messages'
      });
      Conversation.belongsTo(models.User, {
        foreignKey: 'lastMessageUserId',
        as: 'lastMessageUser'
      });
    }
  }

  Conversation.init({
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM('direct', 'group'),
      defaultValue: 'direct'
    },
    lastMessageContent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastMessageUserId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    unreadCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'Conversation',
    indexes: [
      {
        fields: ['lastMessageAt']
      }
    ]
  });

  return Conversation;
}; 