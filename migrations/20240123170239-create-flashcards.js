'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Flashcards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      deckId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Decks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
        allowNull: true,
      },
      additionalAnswer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      visibility: {
        type: Sequelize.ENUM('public', 'private'),
        defaultValue: 'public',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Flashcards');
  },
};