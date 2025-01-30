module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'mediaType', {
      type: Sequelize.ENUM('image', 'video', 'document', 'text'),
      allowNull: true,
      after: 'content'
    });

    await queryInterface.addColumn('Posts', 'mediaUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'mediaType'
    });

    await queryInterface.addColumn('Posts', 'mediaMetadata', {
      type: Sequelize.JSON,
      allowNull: true,
      after: 'mediaUrl',
      comment: 'Stocke les métadonnées du média (taille, durée, format, etc.)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'mediaMetadata');
    await queryInterface.removeColumn('Posts', 'mediaUrl');
    await queryInterface.removeColumn('Posts', 'mediaType');
  }
}; 