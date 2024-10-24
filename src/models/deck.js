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

    Deck.belongsTo(models.User, {
      foreignKey: 'ownerId',  // Utilisez 'ownerId' pour faire correspondre la migration
      onDelete: 'CASCADE',
    });
  };

  return Deck;
};
