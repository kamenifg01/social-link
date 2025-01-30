module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define("Share", {
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
      allowNull: false,
      references: {
        model: 'Posts',
        key: 'id'
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId']
      }
    ]
  });

  Share.associate = (models) => {
    Share.belongsTo(models.User, { as: "user", foreignKey: "userId" });
    Share.belongsTo(models.Post, { as: "post", foreignKey: "postId" });
  };

  return Share;
}; 