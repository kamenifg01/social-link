'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
<<<<<<< Updated upstream
    likesCount: {
=======
    reactions: {
      type: DataTypes.JSONB,
      defaultValue: {
        like: [],    // 👍
        heart: [],   // ❤️
        laugh: [],   // 😄
        wow: [],     // 😮
        sad: [],     // 😢
        angry: []    // 😠
      }
    },
    reactionsCount: {
>>>>>>> Stashed changes
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
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { as: "author", foreignKey: "authorId" });
    Comment.belongsTo(models.Post, { as: "post", foreignKey: "postId" });
    Comment.belongsTo(models.Comment, { as: "parentComment", foreignKey: "parentCommentId" });
    Comment.hasMany(models.Comment, { as: "replies", foreignKey: "parentCommentId" });
    Comment.hasMany(models.Like, { as: "likes", foreignKey: "commentId" });
  };

  return Comment;
};