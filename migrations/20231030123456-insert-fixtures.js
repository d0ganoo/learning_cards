const { usersData, decksData, flashcardsData } = require('../src/Fixtures/fixtures');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Création de la table Users
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        lastname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        firstname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction });

      // Création de la table Decks
      await queryInterface.createTable('Decks', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction });

      // Création de la table Flashcards
      await queryInterface.createTable('Flashcards', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        question: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        answer: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        indice: {
          type: Sequelize.STRING,
        },
        additionalAnswer: {
          type: Sequelize.STRING,
        },
        visibility: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'public',
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        deckId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'Decks',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        isDuplicated: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        originalCardId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Flashcards',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction });

      // Création de la table TrainingSession
      await queryInterface.createTable('TrainingSessions', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        deckId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Decks',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        duration: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction });

      // Création de la table FlashcardStatus
      await queryInterface.createTable('FlashcardStatuses', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        flashcardId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Flashcards',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        TrainingSessionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'TrainingSessions',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        knowledgeStatus: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isIn: [['known', 'unknown', 'thumb-up', 'thumb-down']],
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      }, { transaction });

      // Insérer les utilisateurs
      await queryInterface.bulkInsert('Users', usersData.map(user => ({
        ...user.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Insérer les decks
      await queryInterface.bulkInsert('Decks', decksData.map(deck => ({
        ...deck.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Insérer les flashcards
      await queryInterface.bulkInsert('Flashcards', flashcardsData.map(card => ({
        ...card.data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Commit de la transaction
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Suppression des tables FlashcardStatus et TrainingSessions
      await queryInterface.dropTable('FlashcardStatuses', { transaction });
      await queryInterface.dropTable('TrainingSessions', { transaction });

      // Suppression des tables existantes
      await queryInterface.dropTable('Flashcards', { transaction });
      await queryInterface.dropTable('Decks', { transaction });
      await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
