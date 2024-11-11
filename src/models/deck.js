// models/deck.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Deck = sequelize.define('Deck', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Deck.associate = (models) => {
    Deck.belongsTo(models.User, { foreignKey: 'ownerId' });
    Deck.belongsToMany(models.Flashcard, {
      through: 'DeckFlashcards',
      foreignKey: 'deckId',
      otherKey: 'flashcardId' // Spécifiez `otherKey` pour le champ associé
    });
  };


  return Deck;
};
