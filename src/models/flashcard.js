// models/flashcard.js
const { DataTypes } = require('sequelize')


module.exports = (sequelize) => {
  const Flashcard = sequelize.define('Flashcard', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalAnswer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public',
    },
  })

  Flashcard.associate = (models) => {
    Flashcard.belongsTo(models.Deck, {
      foreignKey: 'deckId',  // Utilisez 'deckId' comme clé étrangère
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    Flashcard.belongsTo(models.User, {
      foreignKey: 'ownerId',  // Utilisez 'ownerId' pour faire correspondre la migration
      onDelete: 'CASCADE',
    });
  };
  return Flashcard
}
