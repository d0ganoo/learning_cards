const Joi = require('joi');
const { Flashcard, User } = require('../db/sequelize');

module.exports = (app) => {

  const validateFlashcard = (data) => {
    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      indice: Joi.string().optional(),
      additionalAnswer: Joi.string().optional(),
      visibility: Joi.string().valid('public', 'private').default('public'),
      deckId: Joi.number().integer().min(1).optional(),
      ownerId: Joi.number().integer().required(),
    });

    return schema.validate(data);
  };

  // Route pour obtenir toutes les flashcards
  app.get('/flashcards', async (req, res) => {
    console.log('Début de la route /flashcards');
    try {
      const flashcards = await Flashcard.findAll();
      res.json(flashcards);
    } catch (error) {
      console.error("Erreur lors de la récupération des flashcards:", error);
      res.status(500).send('Erreur serveur lors de la récupération des flashcards');
    }
  });

  // Route pour obtenir une flashcard par ID
  app.get('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const flashcard = await Flashcard.findByPk(id);
      if (flashcard) {
        res.json(flashcard);
      } else {
        res.status(404).send('Flashcard non trouvée');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la flashcard:", error);
      res.status(500).send('Erreur serveur lors de la récupération de la flashcard');
    }
  });

  // Route pour créer une nouvelle flashcard avec validation
  app.post('/flashcards', async (req, res) => {
    const { error, value } = validateFlashcard(req.body);

    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    const {
      question,
      answer,
      indice,
      additionalAnswer,
      visibility,
      deckId,
      ownerId,
    } = value;

    try {
      // Vérifiez si le ownerId existe dans la table users
      const ownerExists = await User.findByPk(ownerId);
      if (!ownerExists) {
        return res.status(404).send('Utilisateur non trouvé');
      }

      const newFlashcard = await Flashcard.create({
        question,
        answer,
        indice,
        additionalAnswer,
        visibility,
        deckId,
        ownerId,
      });

      res.status(201).json(newFlashcard);
    } catch (err) {
      console.error("Erreur lors de la création de la flashcard:", err);
      res.status(500).send('Erreur serveur lors de la création de la flashcard');
    }
  });


  // Route pour modifier une flashcard avec validation
  app.put('/flashcards/:id', async (req, res) => {
    const { id } = req.params;
    const { error, value } = validateFlashcard(req.body);

    if (error) {
      console.error("Validation Error:", error.details[0].message);
      return res.status(400).send(error.details[0].message);
    }

    const {
      question,
      answer,
      indice,
      additionalAnswer,
      visibility,
      deckId,
      ownerId,
    } = value;

    try {
      const flashcard = await Flashcard.findByPk(id);

      if (!flashcard) {
        return res.status(404).send('Flashcard non trouvée');
      }
      
      flashcard.question = question;
      flashcard.answer = answer;
      flashcard.indice = indice;
      flashcard.additionalAnswer = additionalAnswer;
      flashcard.visibility = visibility;
      flashcard.deckId = deckId;
      flashcard.ownerId = ownerId;

      await flashcard.save();

      res.json(flashcard);
    } catch (err) {
      console.error("Erreur lors de la modification de la flashcard:", err);
      res.status(500).send('Erreur serveur lors de la modification de la flashcard');
    }
  });

  // Route pour supprimer une flashcard
  app.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const flashcard = await Flashcard.findByPk(id);

      if (!flashcard) {
        return res.status(404).send('Flashcard non trouvée');
      }

      await flashcard.destroy();

      res.send('Flashcard supprimée avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression de la flashcard:", error);
      res.status(500).send('Erreur serveur lors de la suppression de la flashcard');
    }
  });
}
