'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserRelation extends Model {
    static associate(models) {
      UserRelation.belongsTo(models.User, { 
        as: 'user',
        foreignKey: 'userId'
      });
      UserRelation.belongsTo(models.User, { 
        as: 'relatedUser',
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
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'UserRelation',
  });

  return UserRelation;
}; 