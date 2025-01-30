const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
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

  return Like;
}; 