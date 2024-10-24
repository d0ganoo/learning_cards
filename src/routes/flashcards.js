const Joi = require('joi');
const { Flashcard } = require('../db/sequelize')

module.exports = (app) => { 

  const validateFlashcard = (data) => {
    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      indice: Joi.string(),
      additionalAnswer: Joi.string(),
      visibility: Joi.string().valid('public', 'private').default('public'),
      deckId: Joi.number().integer().min(1),
      ownerId: Joi.number().integer().required(),
    });

    return schema.validate(data);
  };
  // Route pour obtenir toutes les flashcards
  app.get('/flashcards', async (req, res) => {
    console.log('Début de la route /flashcards')
    try {
      const flashcards = await Flashcard.findAll()
      res.json(flashcards)
    } catch (error) {
      console.error(error)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour obtenir une flashcard par ID
  app.get('/flashcards/:id', async (req, res) => {
    const { id } = req.params
    try {
      const flashcard = await Flashcard.findByPk(id)
      if (flashcard) {
        res.json(flashcard)
      } else {
        res.status(404).send('Flashcard non trouvée')
      }
    } catch (error) {
      console.error(error)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour créer une nouvelle flashcard avec validation
  app.post('/flashcards', async (req, res) => {
    const { error, value } = validateFlashcard(req.body)

    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const {
      question,
      answer,
      indice,
      additionalAnswer,
      visibility,
      deckId,
      ownerId,
    } = value

    try {
      const newFlashcard = await Flashcard.create({
        question,
        answer,
        indice,
        additionalAnswer,
        visibility,
        deckId,
        ownerId,
      })

      res.status(201).json(newFlashcard)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour modifier une flashcard avec validation
  app.put('/flashcards/:id', async (req, res) => {
    const { id } = req.params

    const { error, value } = validateFlashcard(req.body)

    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    const {
      question,
      answer,
      indice,
      additionalAnswer,
      visibility,
      deckId,
      ownerId,
    } = value

    try {
      const flashcard = await Flashcard.findByPk(id)

      if (!flashcard) {
        return res.status(404).send('Flashcard non trouvée')
      }

      flashcard.question = question
      flashcard.answer = answer
      flashcard.indice = indice
      flashcard.additionalAnswer = additionalAnswer
      flashcard.visibility = visibility
      flashcard.deckId = deckId
      flashcard.ownerId = ownerId

      await flashcard.save()

      res.json(flashcard)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour supprimer une flashcard
  app.delete('/flashcards/:id', async (req, res) => {
    const { id } = req.params

    try {
      const flashcard = await Flashcard.findByPk(id)

      if (!flashcard) {
        return res.status(404).send('Flashcard non trouvée')
      }

      await flashcard.destroy()

      res.send('Flashcard supprimée avec succès')
    } catch (error) {
      console.error(error)
      res.status(500).send('Erreur serveur')
    }
  })
}
