'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRelation extends Model {
    static associate(models) {
      UserRelation.belongsTo(models.User, { 
        as: 'requester',
        foreignKey: 'userId'
      });
      UserRelation.belongsTo(models.User, { 
        as: 'target',
        foreignKey: 'relatedUserId'
      });
    }
  }

  UserRelation.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    relatedUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'blocked'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'UserRelation',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'relatedUserId']
      }
    ]
  });

  return UserRelation;
}; 