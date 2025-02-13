const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    static associate(models) {
      Recommendation.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'recipient'
      });
      Recommendation.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'author'
      });
    }
  }

  Recommendation.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
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
    relationship: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'Recommendation',
    tableName: 'recommendations',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'authorId']
      }
    ]
  });

  return Recommendation;
}; 