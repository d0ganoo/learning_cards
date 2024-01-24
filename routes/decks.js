const express = require('express');
const flashcardModel = require('../models/flashcard');

const router = express.Router();

module.exports = (sequelize) => {
  const Flashcard = flashcardModel(sequelize);

  router.get('/:deckId/flashcards', async (req, res) => {
    const { deckId } = req.params;

    try {
      const flashcards = await Flashcard.findAll({
        where: { deckId },
      });

      res.json(flashcards);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  });

  return router;
};
