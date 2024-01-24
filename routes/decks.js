const { Flashcard } = require('../db/sequelize');

module.exports = (app) => {

  app.get('/decks/:deckId/flashcards', async (req, res) => {
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

};
