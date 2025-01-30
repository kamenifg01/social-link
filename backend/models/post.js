'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { 
        as: "author", 
        foreignKey: "authorId" 
      });
      Post.hasMany(models.Comment, { 
        as: "comments", 
        foreignKey: "postId" 
      });
      Post.hasMany(models.Like, { 
        as: "likes", 
        foreignKey: "postId" 
      });
      Post.hasMany(models.Share, { 
        as: "shares", 
        foreignKey: "postId" 
      });
      Post.belongsTo(models.Post, { 
        as: "originalPost", 
        foreignKey: "originalPostId" 
      });
    }
  }

  Post.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'document', 'text'),
      allowNull: true
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaMetadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    sharesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    commentsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    originalPostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });

  return Post;
};
