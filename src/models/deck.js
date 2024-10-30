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
    Deck.belongsTo(models.User, { foreignKey: 'ownerId' });
    Deck.hasMany(models.Flashcard, { foreignKey: 'deckId' });
  };

  return Deck;
};
