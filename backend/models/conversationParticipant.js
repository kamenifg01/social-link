'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConversationParticipant extends Model {
    static associate(models) {
      ConversationParticipant.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      ConversationParticipant.belongsTo(models.Conversation, {
        foreignKey: 'conversationId'
      });
    }
  }

  ConversationParticipant.init({
    userId: {
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
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ConversationParticipant',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'conversationId']
      }
    ]
  });

  return ConversationParticipant;
}; 