'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Likes', 'reactionType', {
      type: Sequelize.ENUM('like', 'heart', 'laugh', 'wow', 'sad', 'angry'),
      defaultValue: 'like',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Likes', 'reactionType');
  }
}; 