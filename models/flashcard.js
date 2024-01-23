// models/flashcard.js
const { DataTypes } = require('sequelize')
const Joi = require('joi');

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

  Flashcard.validateFlashcard = (data) => {
    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      indice: Joi.string(),
      additionalAnswer: Joi.string(),
      visibility: Joi.string().valid('public', 'private').default('public'),
      deckId: Joi.number().integer().min(1),
    });

    return schema.validate(data);
  };

  Flashcard.associate = (models) => {
    Flashcard.belongsTo(models.Deck, {
      foreignKey: 'deckId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
  }

  return Flashcard
}
