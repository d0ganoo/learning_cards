const { Flashcard } = require('../db/sequelize');
const { Deck } = require('../db/sequelize');

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


  // Route pour créer une nouvelle flashcard avec validation
  app.post('/decks', async (req, res) => {
    const { error, value } = validateFlashcard(req.body)

    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const {
      name,
      ownerId,
    } = value

    try {
      const newDeck = await Deck.create({
        name,
        ownerId,
      })

      res.status(201).json(newDeck)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erreur serveur')
    }
  })

};
