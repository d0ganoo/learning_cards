const Joi = require('joi');
const { TrainingSession } = require('../db/sequelize');

// Validation de la durée
const validateUpdateTrainingTime = (data) => {
    const schema = Joi.object({
        duration: Joi.number().integer().min(0).required().messages({
            'number.base': 'duration doit être un nombre entier.',
            'any.required': 'duration est requis.',
            'number.min': 'duration doit être supérieur ou égal à 0.'
        }),
    });

    return schema.validate(data);
};

module.exports = (app) => {

    // Route POST pour démarrer une session d'entraînement
    app.post('/training-sessions/start', async (req, res) => {
        const { deckId, userId } = req.body;

        try {
            // Vérifier s'il existe déjà une session pour ce deck et cet utilisateur
            let session = await TrainingSession.findOne({ where: { deckId, userId } });

            if (session) {
                // Retourner la session existante avec la durée mise à jour
                return res.status(200).json({
                    data: {
                        id: session.id,
                        deckId: session.deckId,
                        userId: session.userId,
                        duration: session.duration,
                    }
                });
            } else {
                // Créer une nouvelle session si aucune n'existe
                session = await TrainingSession.create({
                    deckId,
                    userId,
                    duration: 0,  // Démarre la session avec une durée de 0
                });

                // Retourner la session nouvellement créée
                return res.status(201).json({
                    data: {
                        id: session.id,
                        deckId: session.deckId,
                        userId: session.userId,
                        duration: session.duration,
                    }
                });
            }
        } catch (err) {
            console.error('Erreur lors de la création ou récupération de la session:', err);
            res.status(500).send('Erreur serveur');
        }
    });

    // Route PUT pour mettre à jour la durée de la session d'entraînement
    app.put('/training-sessions/:sessionId', async (req, res) => {
        const { error, value } = validateUpdateTrainingTime(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let { duration } = value;
        const { sessionId } = req.params;

        // Convertir la durée en entier, si ce n'est pas déjà un nombre
        duration = parseInt(duration, 10);

        // Vérifier que la durée est un entier valide
        if (isNaN(duration) || duration < 0) {
            return res.status(400).send('La durée doit être un nombre entier positif.');
        }

        try {
            // Trouver la session par son ID
            const session = await TrainingSession.findByPk(sessionId);

            if (!session) {
                return res.status(404).send('Session d\'entraînement non trouvée');
            }

            // Mettre à jour la durée en l'ajoutant à la durée existante
            session.duration = duration;
            await session.save();

            // Retourner la session mise à jour
            return res.status(200).json({
                id: session.id,
                deckId: session.deckId,
                userId: session.userId,
                duration: session.duration,
            });
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la session:', err);
            res.status(500).send('Erreur serveur');
        }
    });

    app.get('/training-sessions/:deckId', async (req, res) => {
        const { deckId } = req.params;
    
        try {
            // Recherche de la dernière session active ou la plus récente pour le deck spécifié
            const session = await TrainingSession.findOne({
                where: { deckId: deckId },
                order: [['createdAt', 'DESC']],  // Tri par date pour obtenir la plus récente
                attributes: ['duration']         // Ne sélectionne que la colonne de durée
            });
    
            // Si une session existe, retourne la durée; sinon, retourne null
            const duration = session ? session.duration : null;
            
            res.json({ duration });
        } catch (error) {
            console.error('Erreur lors de la récupération de la session:', error);
            res.status(500).json({ message: 'Erreur serveur lors de la récupération de la session.' });
        }
    });

};
