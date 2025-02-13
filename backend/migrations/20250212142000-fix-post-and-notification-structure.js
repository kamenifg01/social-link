'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ajout des colonnes pour les posts
    await queryInterface.addColumn('Posts', 'shareUrl', {
      type: Sequelize.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Posts', 'shareMetadata', {
      type: Sequelize.JSONB,
      allowNull: true
    });

    // Ajout de la colonne senderId pour les notifications
    await queryInterface.addColumn('Notifications', 'senderId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'shareUrl');
    await queryInterface.removeColumn('Posts', 'shareMetadata');
    await queryInterface.removeColumn('Notifications', 'senderId');
  }
};