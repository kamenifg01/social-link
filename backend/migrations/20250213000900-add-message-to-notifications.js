'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notifications', 'message', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Nouvelle notification'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Notifications', 'message');
  }
}; 