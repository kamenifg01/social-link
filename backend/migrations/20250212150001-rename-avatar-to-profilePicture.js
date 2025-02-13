'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'avatar', 'profilePicture');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'profilePicture', 'avatar');
  }
}; 