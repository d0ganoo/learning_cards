// models/TrainingSession.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TrainingSession = sequelize.define('TrainingSession', {
        deckId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Decks', key: 'id' },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        duration: {
            type: DataTypes.INTEGER, // En secondes
            allowNull: false,
            defaultValue: 0, // Démarre la session avec une durée de 0
        },
    });

    // Associations
    TrainingSession.associate = (models) => {
        TrainingSession.belongsTo(models.Deck, { foreignKey: 'deckId' });
        TrainingSession.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return TrainingSession;
};
