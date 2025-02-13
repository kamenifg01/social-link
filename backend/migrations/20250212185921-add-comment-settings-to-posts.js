'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'commentSettings', {
      type: Sequelize.JSONB,
      defaultValue: {
        allowReplies: true,
        allowReactions: true,
        sortBy: 'relevant',
        threadDepth: 3
      },
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'commentSettings');
  }
};
