const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Flashcard = sequelize.define('Flashcard', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    indice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additionalAnswer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private'),
      defaultValue: 'public',
    },
    deckId: { // Assurez-vous d'ajouter ce champ si nécessaire
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerId: { // Assurez-vous d'ajouter ce champ si nécessaire
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDuplicated: { // Nouveau champ pour indiquer si la carte est une copie
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    originalCardId: { // Champ optionnel pour référencer l'ID de la carte originale
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Flashcards',
        key: 'id'
      }
    }
  });

  Flashcard.associate = (models) => {
    Flashcard.belongsTo(models.User, { foreignKey: 'ownerId' });
    Flashcard.belongsToMany(models.Deck, { 
        through: 'DeckFlashcards', 
        foreignKey: 'flashcardId', 
        otherKey: 'deckId' // Spécifiez `otherKey` pour le champ associé
    });
};

  return Flashcard;
};
