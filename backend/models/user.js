'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { 
        as: "posts", 
        foreignKey: "authorId" 
      });
      User.hasMany(models.Comment, { 
        as: "comments", 
        foreignKey: "authorId" 
      });
      User.hasMany(models.Like, { 
        as: "likes", 
        foreignKey: "userId" 
      });
      User.hasMany(models.Share, { 
        as: "shares", 
        foreignKey: "userId" 
      });
      User.hasMany(models.UserRelation, {
        as: 'sentRelations',
        foreignKey: 'userId'
      });
      User.hasMany(models.UserRelation, {
        as: 'receivedRelations',
        foreignKey: 'relatedUserId'
      });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user) => {
        if (!user.username) {
          user.username = user.email.split('@')[0];
        }
      }
    }
  });

  return User;
};
  