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
      foreignKey: 'deckId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  }

  return Flashcard
}
