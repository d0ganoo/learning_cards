// models/FlashcardStatus.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const FlashcardStatus = sequelize.define('FlashcardStatus', {
        flashcardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Flashcards', key: 'id' },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        trainingSessionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'TrainingSessions', key: 'id' },
        },
        knowledgeStatus: { // Changement ici : ajouter le champ knowledgeStatus
            type: DataTypes.STRING, // stocke les valeurs comme 'known', 'unknown', etc.
            allowNull: false,
            validate: {
                isIn: [['known', 'unknown', 'thumb-up', 'thumb-down']], // État permis
            },
        },
    });

    FlashcardStatus.associate = (models) => {
        FlashcardStatus.belongsTo(models.Flashcard, { foreignKey: 'flashcardId' });
        FlashcardStatus.belongsTo(models.User, { foreignKey: 'userId' });
        FlashcardStatus.belongsTo(models.TrainingSession, { foreignKey: 'trainingSessionId' });
    };

    return FlashcardStatus;
};
