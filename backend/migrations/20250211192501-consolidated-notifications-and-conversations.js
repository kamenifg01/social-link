'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Création de la table Notifications
      await queryInterface.createTable('Notifications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.ENUM(
            'LIKE',
            'COMMENT',
            'FOLLOW',
            'MENTION',
            'SHARE',
            'CONNECTION_REQUEST',
            'CONNECTION_ACCEPTED',
            'MESSAGE',
            'POST'
          ),
          allowNull: false
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
        actorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        postId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Posts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        commentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Comments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        data: {
          type: Sequelize.JSONB,
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

      // Création de la table Conversations
      await queryInterface.createTable('Conversations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.ENUM('direct', 'group'),
          defaultValue: 'direct'
        },
        title: {
          type: Sequelize.STRING,
          allowNull: true
        },
        lastMessageAt: {
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

      // Création de la table ConversationParticipants
      await queryInterface.createTable('ConversationParticipants', {
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
        conversationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Conversations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        lastReadAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        isAdmin: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
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

      // Création de la table Messages
      await queryInterface.createTable('Messages', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        conversationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Conversations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        senderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM('text', 'image', 'file'),
          defaultValue: 'text'
        },
        mediaUrl: {
          type: Sequelize.STRING,
          allowNull: true
        },
        metadata: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        readBy: {
          type: Sequelize.JSONB,
          defaultValue: []
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
      await queryInterface.addIndex('Notifications', ['userId'], { transaction });
      await queryInterface.addIndex('Notifications', ['actorId'], { transaction });
      await queryInterface.addIndex('Notifications', ['read'], { transaction });
      await queryInterface.addIndex('Notifications', ['createdAt'], { transaction });

      await queryInterface.addIndex('Conversations', ['lastMessageAt'], { transaction });
      await queryInterface.addIndex('Conversations', ['type'], { transaction });

      await queryInterface.addIndex('ConversationParticipants', ['userId', 'conversationId'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('ConversationParticipants', ['lastReadAt'], { transaction });

      await queryInterface.addIndex('Messages', ['conversationId'], { transaction });
      await queryInterface.addIndex('Messages', ['senderId'], { transaction });
      await queryInterface.addIndex('Messages', ['createdAt'], { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Suppression des tables dans l'ordre inverse de leur création
      await queryInterface.dropTable('Messages', { transaction });
      await queryInterface.dropTable('ConversationParticipants', { transaction });
      await queryInterface.dropTable('Conversations', { transaction });
      await queryInterface.dropTable('Notifications', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
