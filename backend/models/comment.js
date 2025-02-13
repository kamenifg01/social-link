'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
      Comment.belongsTo(models.Comment, {
        foreignKey: 'parentCommentId',
        as: 'parentComment'
      });
      Comment.hasMany(models.Comment, {
        foreignKey: 'parentCommentId',
        as: 'replies'
      });
      Comment.hasMany(models.Reaction, {
        foreignKey: 'commentId',
        as: 'reactions'
      });
      Comment.hasMany(models.Notification, {
        foreignKey: 'commentId',
        as: 'notifications'
      });
    }
  }

  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    metrics: {
      type: DataTypes.JSONB,
      defaultValue: {
        likes: 0,
        replies: 0,
        reactions: {
          like: 0,
          heart: 0,
          laugh: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    timestamps: true
  });

  return Comment;
};