const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SkillEndorsement extends Model {
    static associate(models) {
      SkillEndorsement.belongsTo(models.Skill, {
        foreignKey: 'skillId',
        as: 'skill'
      });
      SkillEndorsement.belongsTo(models.User, {
        foreignKey: 'endorserId',
        as: 'endorser'
      });
    }
  }

  SkillEndorsement.init({
    skillId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Skills',
        key: 'id'
      }
    },
    endorserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'SkillEndorsement',
    tableName: 'skill_endorsements',
    indexes: [
      {
        unique: true,
        fields: ['skillId', 'endorserId']
      }
    ]
  });

  return SkillEndorsement;
}; 