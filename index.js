/* eslint-disable consistent-return */
/* eslint-disable no-console */
// index.js
const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser')
const { Sequelize } = require('sequelize')
const Joi = require('joi')
const flashcardModel = require('./models/flashcard')

const app = express()
app.use(bodyParser.json())

// Configuration Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'flashcards_db',
})

const Flashcard = flashcardModel(sequelize)

// Middleware de validation pour les flashcards
const validateFlashcard = (data) => {
  const schema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    indice: Joi.string(),
    additionalAnswer: Joi.string(),
    visibility: Joi.string().valid('public', 'private').default('public'),
    deckId: Joi.number().integer().min(1),
  })

  return schema.validate(data)
}

// Middleware pour permettre à Express de comprendre les requêtes JSON
app.use(express.json())

// Route pour obtenir toutes les flashcards
app.get('/flashcards', async (req, res) => {
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

app.get('/decks/:deckId/flashcards', async (req, res) => {
  const { deckId } = req.params

  try {
    const flashcards = await Flashcard.findAll({
      where: { deckId },
    })

    res.json(flashcards)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erreur serveur')
  }
})

// Port d'écoute
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
