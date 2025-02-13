'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Supprimer d'abord tous les utilisateurs existants
      await queryInterface.bulkDelete('Users', null, {});
      
      const hashedPassword = await bcrypt.hash('Password123', 10);
      const hashedPassword2 = await bcrypt.hash('Azerty2025', 10);
      
      // Création des utilisateurs de test
      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          username: 'testuser',
          email: 'demo@example.com',
          password: hashedPassword,
          isVerified: true,
          status: 'active',
          firstName: 'Test',
          lastName: 'User',
          title: 'Software Developer',
          company: 'Tech Corp',
          location: 'Paris, France',
          bio: 'Je suis un développeur passionné par les nouvelles technologies.',
          website: 'https://example.com',
          linkedin: 'https://linkedin.com/in/testuser',
          github: 'https://github.com/testuser',
          emailNotifications: true,
          pushNotifications: true,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          username: 'kameni',
          email: 'kamenifg@gmail.com',
          password: hashedPassword2,
          isVerified: true,
          status: 'active',
          firstName: 'Kameni',
          lastName: 'FG',
          title: 'Developer',
          company: 'Tech Corp',
          location: 'Paris, France',
          bio: 'Développeur passionné',
          emailNotifications: true,
          pushNotifications: true,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      console.log('Utilisateurs créés avec succès');

      // Création de quelques compétences
      await queryInterface.bulkInsert('Skills', [
        {
          name: 'JavaScript',
          category: 'Programming',
          description: 'JavaScript programming language',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'React',
          category: 'Frontend',
          description: 'React.js framework',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Node.js',
          category: 'Backend',
          description: 'Node.js runtime',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      // Création d'une expérience professionnelle
      await queryInterface.bulkInsert('Experiences', [{
        userId: 1, // Utiliser l'ID 1 directement
        title: 'Senior Developer',
        company: 'Tech Corp',
        location: 'Paris, France',
        startDate: new Date('2020-01-01'),
        isCurrent: true,
        description: 'Développement d\'applications web modernes',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

      console.log('Seeding terminé avec succès');
    } catch (error) {
      console.error('Erreur lors du seeding:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Suppression des données dans l'ordre inverse
      await queryInterface.bulkDelete('Experiences', null, {});
      await queryInterface.bulkDelete('Skills', null, {});
      await queryInterface.bulkDelete('Users', null, {});
      console.log('Rollback terminé avec succès');
    } catch (error) {
      console.error('Erreur lors du rollback:', error);
      throw error;
    }
  }
};
