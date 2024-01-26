// models/deck.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Deck = sequelize.define('Deck', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Deck.associate = (models) => {
    Deck.hasMany(models.Flashcard, { as: 'flashcards' });
  };

  return Deck;
};
