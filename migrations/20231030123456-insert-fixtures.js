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

      // Création de la table Flashcards avec les nouvelles colonnes
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
        isDuplicated: { // Ajout du champ isDuplicated
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        originalCardId: { // Ajout du champ originalCardId
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

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    // Suppression des colonnes ajoutées dans Flashcards
    await queryInterface.removeColumn('Flashcards', 'isDuplicated');
    await queryInterface.removeColumn('Flashcards', 'originalCardId');
    
    // Suppression des tables
    await queryInterface.dropTable('Flashcards');
    await queryInterface.dropTable('Decks');
    await queryInterface.dropTable('Users');
  },
};
