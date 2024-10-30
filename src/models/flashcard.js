const { DataTypes } = require('sequelize');

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
    ownerId: { // Assurez-vous d'ajouter ce champ si nécessaire
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Flashcard.associate = (models) => {
    Flashcard.belongsTo(models.Deck, { foreignKey: 'deckId' });
    Flashcard.belongsTo(models.User, { foreignKey: 'ownerId' });
  };

  return Flashcard;
};
