'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Création de la table Posts
      await queryInterface.createTable('Posts', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
          validate: {
            len: [0, 5000]
          }
        },
        authorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        mediaType: {
          type: Sequelize.ENUM('image', 'video', 'document', 'text'),
          allowNull: true
        },
        mediaUrl: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        mediaMetadata: {
          type: Sequelize.JSON,
          allowNull: true
        },
        metrics: {
          type: Sequelize.JSONB,
          defaultValue: {
            likes: 0,
            shares: 0,
            comments: 0,
            reposts: 0,
            reactions: {
              like: 0,
              heart: 0,
              laugh: 0,
              wow: 0,
              sad: 0,
              angry: 0
            }
          }
        },
        originalPostId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Posts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        isHidden: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        visibility: {
          type: Sequelize.ENUM('public', 'connections', 'private'),
          defaultValue: 'public'
        },
        type: {
          type: Sequelize.ENUM('original', 'repost', 'share'),
          defaultValue: 'original'
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

      // Création de la table Comments
      await queryInterface.createTable('Comments', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        authorId: {
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
          allowNull: false,
          references: {
            model: 'Posts',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        parentCommentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Comments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        metrics: {
          type: Sequelize.JSONB,
          defaultValue: {
            likes: 0,
            replies: 0,
            reactions: {
              like: 0,
              heart: 0,
              laugh: 0,
              wow: 0,
              sad: 0,
              angry: 0
            }
          }
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

      // Création de la table Reactions
      await queryInterface.createTable('Reactions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        type: {
          type: Sequelize.ENUM('like', 'heart', 'laugh', 'wow', 'sad', 'angry'),
          allowNull: false,
          defaultValue: 'like'
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
      await queryInterface.addIndex('Posts', ['authorId'], { transaction });
      await queryInterface.addIndex('Posts', ['type'], { transaction });
      await queryInterface.addIndex('Posts', ['visibility'], { transaction });
      await queryInterface.addIndex('Posts', ['createdAt'], { transaction });

      await queryInterface.addIndex('Comments', ['postId'], { transaction });
      await queryInterface.addIndex('Comments', ['authorId'], { transaction });
      await queryInterface.addIndex('Comments', ['parentCommentId'], { transaction });
      await queryInterface.addIndex('Comments', ['createdAt'], { transaction });

      await queryInterface.addIndex('Reactions', ['userId', 'postId'], {
        unique: true,
        where: {
          postId: {
            [Sequelize.Op.ne]: null
          }
        },
        transaction
      });

      await queryInterface.addIndex('Reactions', ['userId', 'commentId'], {
        unique: true,
        where: {
          commentId: {
            [Sequelize.Op.ne]: null
          }
        },
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
      await queryInterface.dropTable('Reactions', { transaction });
      await queryInterface.dropTable('Comments', { transaction });
      await queryInterface.dropTable('Posts', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
