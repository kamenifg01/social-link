module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Comments', 'reactions', {
      type: Sequelize.JSONB,
      defaultValue: {
        like: [],
        heart: [],
        laugh: [],
        wow: [],
        sad: [],
        angry: []
      },
      allowNull: false
    });

    await queryInterface.addColumn('Comments', 'reactionsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Comments', 'reactions');
    await queryInterface.removeColumn('Comments', 'reactionsCount');
  }
}; 