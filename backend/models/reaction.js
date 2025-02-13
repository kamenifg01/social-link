'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    static associate(models) {
      Reaction.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      });
      Reaction.belongsTo(models.Post, {
        foreignKey: "postId",
        as: "post"
      });
      Reaction.belongsTo(models.Comment, {
        foreignKey: "commentId",
        as: "comment"
      });
    }
  }

  Reaction.init({
    type: {
      type: DataTypes.ENUM('like', 'heart', 'laugh', 'wow', 'sad', 'angry'),
      allowNull: false,
      defaultValue: 'like'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Reaction',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
        where: {
          postId: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['userId', 'commentId'],
        where: {
          commentId: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      }
    ],
    validate: {
      eitherPostOrComment() {
        if ((this.postId === null && this.commentId === null) || 
            (this.postId !== null && this.commentId !== null)) {
          throw new Error('Une réaction doit être associée soit à un post soit à un commentaire, pas les deux');
        }
      }
    }
  });

  return Reaction;
}; 