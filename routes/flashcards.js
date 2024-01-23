const express = require('express')
const { validateFlashcard } = require('../models/flashcard')
const flashcardModel = require('../models/flashcard')
const router = express.Router()

module.exports = (sequelize) => { 
  const Flashcard = flashcardModel(sequelize)
  // Route pour obtenir toutes les flashcards
  router.get('/', async (req, res) => {
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
  router.get('/:id', async (req, res) => {
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
  router.post('/', async (req, res) => {
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
    } = value

    try {
      const newFlashcard = await Flashcard.create({
        question,
        answer,
        indice,
        additionalAnswer,
        visibility,
        deckId,
      })

      res.status(201).json(newFlashcard)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour modifier une flashcard avec validation
  router.put('/:id', async (req, res) => {
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

      await flashcard.save()

      res.json(flashcard)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour supprimer une flashcard
  router.delete('/:id', async (req, res) => {
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

  return router
}
