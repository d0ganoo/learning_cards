// routes/users.js

const express = require('express')
const { User, validateUser } = require('../models/user')

const router = express.Router()

// Route pour obtenir tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).send('Erreur serveur')
  }
})

// Route pour obtenir un utilisateur par ID
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).send('Utilisateur non trouvé')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Erreur serveur')
  }
})

// Route pour créer un nouvel utilisateur avec validation
router.post('/', async (req, res) => {
  const { error, value } = validateUser(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { lastname, firstname, username, email, password } = value

  try {
    const newUser = await User.create({
      lastname,
      firstname,
      username,
      email,
      password,
    })

    res.status(201).json(newUser)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erreur serveur')
  }
})

// Route pour mettre à jour un utilisateur avec validation
router.put('/:id', async (req, res) => {
  const { id } = req.params

  const { error, value } = validateUser(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const { lastname, firstname, username, email, password } = value

  try {
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé')
    }

    user.lastname = lastname
    user.firstname = firstname
    user.username = username
    user.email = email
    user.password = password

    await user.save()

    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erreur serveur')
  }
})

// Route pour supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé')
    }

    await user.destroy()

    res.send('Utilisateur supprimé avec succès')
  } catch (error) {
    console.error(error)
    res.status(500).send('Erreur serveur')
  }
})

module.exports = router
