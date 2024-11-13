const Joi = require('joi');
const { FlashcardStatus } = require('../db/sequelize');

module.exports = (app) => {
    const validateCardKnowledgeStatus = (data) => {
        const schema = Joi.object({
            knowledgeStatus: Joi.string().valid('known', 'unknown', 'thumb-up', 'thumb-down').required().messages({
                'string.base': 'knowledgeStatus doit être une chaîne de caractères.',
                'any.only': 'knowledgeStatus doit être l’un des suivants: known, unknown, thumb-up, thumb-down.',
                'any.required': 'knowledgeStatus est requis.',
            }),
            userId: Joi.number().integer().required(),
            trainingSessionId: Joi.number().integer().required(),
        });

        return schema.validate(data);
    };

    app.put('/flashcards/:cardId/knowledge-status', async (req, res) => {
        const { error, value } = validateCardKnowledgeStatus(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { knowledgeStatus } = value;
        const { cardId } = req.params;
        const { userId, trainingSessionId } = req.body; // Récupérer l'userId de la requête

        try {
            // Vérifier si un FlashcardStatus existe pour cette carte et cet utilisateur
            let flashcardStatus = await FlashcardStatus.findOne({
                where: {
                    flashcardId: cardId,
                    userId: userId
                }
            });

            if (!flashcardStatus) {
                // Si aucune ligne n'existe pour cette carte et cet utilisateur, en créer une nouvelle
                flashcardStatus = await FlashcardStatus.create({
                    flashcardId: cardId,
                    userId: userId,
                    knowledgeStatus: knowledgeStatus,
                    trainingSessionId: trainingSessionId
                });
                return res.status(201).json(flashcardStatus); // Nouvelle entrée créée
            }

            // Si une entrée existe déjà, mettre à jour le `knowledgeStatus`
            flashcardStatus.knowledgeStatus = knowledgeStatus;
            await flashcardStatus.save();

            res.status(200).json(flashcardStatus); // Retourne l'état mis à jour
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
        }
    });
};
