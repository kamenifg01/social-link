<<<<<<< Updated upstream
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
=======
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Like.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post'
      });
    }
  }
  
  Like.init({
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      allowNull: true,
=======
      allowNull: false,
>>>>>>> Stashed changes
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
<<<<<<< Updated upstream
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
        where: {
          postId: {
            [Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['userId', 'commentId'],
        where: {
          commentId: {
            [Op.ne]: null
          }
        }
      }
    ]
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, { as: "user", foreignKey: "userId" });
    Like.belongsTo(models.Post, { as: "post", foreignKey: "postId" });
    Like.belongsTo(models.Comment, { as: "comment", foreignKey: "commentId" });
  };

=======
    reactionType: {
      type: DataTypes.ENUM('like', 'heart', 'laugh', 'wow', 'sad', 'angry'),
      defaultValue: 'like'
    }
  }, {
    sequelize,
    modelName: 'Like',
  });
  
>>>>>>> Stashed changes
  return Like;
}; 