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
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
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
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
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
        visibility: {  // Ajout du champ visibility
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'public', // Valeur par défaut
        },
        deckId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Decks',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        ownerId: {
          type: Sequelize.INTEGER,
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
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }, { transaction });

      // Insérer les utilisateurs
      await queryInterface.bulkInsert('Users', usersData.map(user => ({
        ...user.data, // Assurez-vous d'utiliser `data` pour accéder aux données
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Insérer les decks
      await queryInterface.bulkInsert('Decks', decksData.map(deck => ({
        ...deck.data, // Assurez-vous d'utiliser `data` pour accéder aux données
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Insérer les flashcards
      await queryInterface.bulkInsert('Flashcards', flashcardsData.map(card => ({
        ...card.data, // Assurez-vous d'utiliser `data` pour accéder aux données
        createdAt: new Date(),
        updatedAt: new Date(),
      })), { transaction });

      // Valider la transaction si tout a réussi
      await transaction.commit();
    } catch (error) {
      // Si une erreur se produit, annuler la transaction
      await transaction.rollback();
      throw error; // Relancer l'erreur pour qu'elle puisse être gérée par la suite
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer les flashcards, les decks et les utilisateurs dans l'ordre inverse
    await queryInterface.dropTable('Flashcards');
    await queryInterface.dropTable('Decks');
    await queryInterface.dropTable('Users');
  },
};
