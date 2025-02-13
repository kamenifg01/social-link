'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Création de la table Users
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        isVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        status: {
          type: Sequelize.ENUM('active', 'suspended', 'deleted'),
          defaultValue: 'active'
        },
        // Informations de profil
        firstName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true
        },
        coverImage: {
          type: Sequelize.STRING,
          allowNull: true
        },
        bio: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        // Informations professionnelles
        title: {
          type: Sequelize.STRING,
          allowNull: true
        },
        company: {
          type: Sequelize.STRING,
          allowNull: true
        },
        location: {
          type: Sequelize.STRING,
          allowNull: true
        },
        website: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        // Réseaux sociaux
        linkedin: {
          type: Sequelize.STRING,
          allowNull: true
        },
        twitter: {
          type: Sequelize.STRING,
          allowNull: true
        },
        github: {
          type: Sequelize.STRING,
          allowNull: true
        },
        // Statistiques
        followersCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        followingCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        postsCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        // Paramètres de notification
        emailNotifications: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        pushNotifications: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        // Sécurité et connexion
        lastLoginAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        resetPasswordToken: {
          type: Sequelize.STRING,
          allowNull: true
        },
        resetPasswordExpires: {
          type: Sequelize.DATE,
          allowNull: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // Création de la table UserRelations pour gérer les relations entre utilisateurs
      await queryInterface.createTable('UserRelations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        relatedUserId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        status: {
          type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'blocked'),
          defaultValue: 'pending'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // Ajout des index
      await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        transaction
      });

      await queryInterface.addIndex('Users', ['username'], {
        unique: true,
        transaction
      });

      await queryInterface.addIndex('UserRelations', ['userId', 'relatedUserId'], {
        unique: true,
        transaction
      });

      await queryInterface.addIndex('UserRelations', ['status'], {
        transaction
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Suppression des tables dans l'ordre inverse de leur création
      await queryInterface.dropTable('UserRelations', { transaction });
      await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
