'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      SELECT setval('"Users_id_seq"', (SELECT MAX(id) FROM "Users"), true);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Rien à faire pour le rollback
  }
}; 