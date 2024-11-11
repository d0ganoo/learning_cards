const { User } = require('../db/sequelize')
const { Flashcard } = require('../db/sequelize');
const { Deck } = require('../db/sequelize');
const Joi = require('joi')
const { Op } = require('sequelize');
const { sequelize } = require('../db/sequelize');

module.exports = (app) => {
  const validateUser = (data) => {
    const schema = Joi.object({
      lastname: Joi.string().required(),
      firstname: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    })

    return schema.validate(data)
  }

  // Route pour obtenir tous les utilisateurs
  app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll()
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).send('Erreur serveur')
    }
  })

  // Route pour obtenir un utilisateur par ID
  app.get('/users/:id', async (req, res) => {
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

  // Route pour obtenir la liste des decks de l'utilisateur connecté
  app.get('/users/:userId/decks', async (req, res) => {
    const userId = req.params.userId;

    try {
      // Récupération des decks appartenant à l'utilisateur spécifique
      const decks = await Deck.findAll({
        where: { ownerId: userId }
      });

      res.json(decks);
    } catch (error) {
      console.error("Erreur lors de la récupération des decks de l'utilisateur:", error);
      res.status(500).send("Erreur serveur lors de la récupération des decks");
    }
  });

  // Route pour obtenir la liste des cartes d'un deck de l'utilisateur connecté
  app.get('/users/:userId/decks/:deckId/flashcards', async (req, res) => {
    const { userId, deckId } = req.params;

    try {
      const flashcards = await Flashcard.findAll({
        where: {
          ownerId: userId,
          deckId: deckId,
        },
      });

      const deck = await Deck.findOne({
        where: {
          id: deckId,
          ownerId: userId,
        },
      });

      if (!deck) {
        return res.status(404).json({ message: 'Deck introuvable pour cet utilisateur' });
      }

      res.json(flashcards);
    } catch (error) {
      console.error("Erreur lors de la récupération des flashcards:", error);
      res.status(500).send('Erreur serveur lors de la récupération des flashcards');
    }
  });

  // Route pour récupérer les flashcards de l'utilisateur connecté
  app.get('/users/:userId/flashcards', async (req, res) => {
    const userId = req.params.userId;

    try {
      const flashcards = await Flashcard.findAll({
        where: { ownerId: userId }
      });

      res.json(flashcards);
    } catch (error) {
      console.error("Erreur lors de la récupération des cards de l'utilisateur:", error);
      res.status(500).send("Erreur serveur lors de la récupération des cards");
    }
  });

  // Route pour récupérer les flashcards publiques sans celles qui ont été dupliquées par l'utilisateur
  app.get('/users/:userId/public/flashcards', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Conversion de l'ID utilisateur
    try {
      // 1. Récupérer les cartes dupliquées par l'utilisateur
      const duplicatedCards = await Flashcard.findAll({
        where: {
          ownerId: userId, // L'utilisateur est le propriétaire de la carte dupliquée
          isDuplicated: true // La carte est une duplication
        },
        attributes: ['originalCardId'] // Nous n'avons besoin que de l'originalCardId
      });

      // Si aucune carte dupliquée n'est trouvée, initialiser un tableau vide
      const duplicatedOriginalIds = duplicatedCards.length
        ? duplicatedCards.map(card => card.originalCardId)
        : [];

      // 2. Récupérer les cartes publiques (celles qui n'appartiennent pas à l'utilisateur connecté)
      const publicCards = await Flashcard.findAll({
        where: {
          visibility: 'public', // Seules les cartes publiques
          ownerId: { [Op.ne]: userId }, // Exclut les cartes de l'utilisateur connecté
          // Nous excluons également les cartes dupliquées par l'utilisateur
          id: { [Op.notIn]: duplicatedOriginalIds }
        }
      });

      // Vérification des types de données retournés
      const cards = publicCards.map(card => ({
        ...card.toJSON(), // On s'assure de transformer en JSON (chaîne de caractères)
      }));

      res.json(cards); // Renvoie les cartes publiques filtrées
    } catch (error) {
      console.error("Erreur lors de la récupération des flashcards publiques:", error);
      res.status(500).send('Erreur serveur lors de la récupération des flashcards publiques');
    }
  });


  // Route pour rechercher des flashcards publiques en fonction d'un terme de recherche
  app.get('/users/:userId/public/flashcards/search', async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Conversion de l'ID utilisateur
    const { searchTerm } = req.query; // Le terme de recherche est passé dans la query string

    if (!searchTerm) {
      return res.status(400).send('Le terme de recherche est requis');
    }

    try {
      // Requête pour récupérer les cartes publiques qui contiennent le terme de recherche
      const flashcards = await Flashcard.findAll({
        where: {
          visibility: 'public',
          ownerId: { [Op.ne]: userId }, // Exclut les cartes de l'utilisateur connecté
          [Op.or]: [
            {
              question: {
                [Op.like]: sequelize.fn('LOWER', sequelize.col('question')), // Applique une conversion en minuscule
                [Op.like]: `%${searchTerm.toLowerCase()}%`, // Recherche insensible à la casse
              },
            },
            {
              answer: {
                [Op.like]: sequelize.fn('LOWER', sequelize.col('answer')), // Applique une conversion en minuscule
                [Op.like]: `%${searchTerm.toLowerCase()}%`, // Recherche insensible à la casse
              },
            },
          ],
        },
      });

      res.json(flashcards);
    } catch (error) {
      console.error("Erreur lors de la recherche des flashcards:", error);
      res.status(500).send('Erreur serveur lors de la recherche des flashcards');
    }
  });


  app.post('/users/:userId/decks/:deckId/add-flashcard', async (req, res) => {
    const { userId, deckId } = req.params;
    const { cardId } = req.body; // Récupère l'ID de la flashcard à copier

    try {
      // Vérifie si le deck appartient à l'utilisateur
      const deck = await Deck.findOne({
        where: {
          id: deckId,
          ownerId: userId,
        },
      });

      if (!deck) {
        return res.status(404).json({ message: 'Deck non trouvé ou ne vous appartient pas' });
      }

      // Vérifie que la flashcard existe
      const originalFlashcard = await Flashcard.findByPk(cardId);
      if (!originalFlashcard) {
        return res.status(404).json({ message: 'Flashcard non trouvée' });
      }

      // Duplique la flashcard et l'assigne à l'utilisateur
      await Flashcard.create({
        question: originalFlashcard.question,
        answer: originalFlashcard.answer,
        indice: originalFlashcard.indice,
        additionalAnswer: originalFlashcard.additionalAnswer,
        ownerId: userId,
        deckId: deckId,
        visibility: 'private',
        isDuplicated: true, // Marque comme dupliquée
        originalCardId: originalFlashcard.id, // L'ID de la carte originale
      });

      res.status(200).json({ message: 'Flashcard dupliquée et ajoutée au deck avec succès' });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la flashcard au deck:", error);
      res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de la flashcard au deck' });
    }
  });




  // Route pour créer un nouvel utilisateur avec validation
  app.post('/users', async (req, res) => {
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
  app.put('/users/:id', async (req, res) => {
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
  app.delete('/users/:id', async (req, res) => {
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
}
