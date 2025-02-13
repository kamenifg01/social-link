const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    static associate(models) {
      Skill.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      Skill.hasMany(models.SkillEndorsement, {
        foreignKey: 'skillId',
        as: 'endorsements'
      });
    }
  }

  Skill.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endorsementsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Skill',
    tableName: 'skills'
  });

  return Skill;
}; 