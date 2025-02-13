'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments'
      });
      Post.hasMany(models.Reaction, {
        foreignKey: 'postId',
        as: 'reactions'
      });
      Post.belongsTo(models.Post, {
        foreignKey: 'originalPostId',
        as: 'originalPost'
      });
      Post.hasMany(models.Post, {
        foreignKey: 'originalPostId',
        as: 'shares'
      });
      Post.hasMany(models.Notification, {
        foreignKey: 'postId'
      });
    }
  }

  Post.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mediaMetadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    metrics: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        comments: 0,
        reactions: {
          like: 0,
          love: 0,
          haha: 0,
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
    originalPostId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    visibility: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: [['public', 'connections', 'private']]
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'original',
      validate: {
        isIn: [['original', 'share']]
      }
    },
    shareUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shareMetadata: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    commentSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        enabled: true,
        whoCanComment: 'everyone' // 'everyone', 'connections', 'none'
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
    timestamps: true,
    hooks: {
      beforeCreate: async (post) => {
        if (post.type === 'share' && !post.originalPostId) {
          throw new Error('Un post de type partage doit avoir un originalPostId');
        }
      },
      afterCreate: async (post, options) => {
        if (post.originalPostId) {
          await sequelize.models.Post.increment('metrics.reposts', {
            where: { id: post.originalPostId }
          });
        }
      },
      afterDestroy: async (post, options) => {
        if (post.originalPostId) {
          await sequelize.models.Post.decrement('metrics.reposts', {
            where: { id: post.originalPostId }
          });
        }
      }
    },
    indexes: [
      {
        fields: ['authorId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['visibility']
      }
    ]
  });

  return Post;
};
